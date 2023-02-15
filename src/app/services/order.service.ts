import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Order } from '../modals/order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = 'api/orders';
  private orders: Order[] = [];

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl)
      .pipe(
        tap(data => this.orders = data),
        catchError(this.handleError)
      );
  }

  getPaginatedOrders(query?: GetOrdersQuery): Observable<OrdersResponse<Order>> {
    return this.http.get<Order[]>(this.ordersUrl).pipe(
      map((data) => {
        const orders = data;
        const page = query?.page || 1;
        const perPage = query?.perPage || 5;
        const searchString = query?.searchString?.toLowerCase() || '';
        const filter = query?.filter;
        let foundOrders;

        if (searchString && filter && filter !== "all") {
          foundOrders = orders.filter((o: Order) =>
          o.name
              .toLowerCase()
              .includes(searchString) ||
          o.id?.toString().includes(searchString))
          .filter((o: Order) => o.status === filter)
        } else if (searchString) {
          foundOrders = orders.filter((o: Order) =>
                o.name
                    .toLowerCase()
                    .includes(searchString) ||
                o.id?.toString().includes(searchString))
        } else if (filter && filter !== "all") {
          foundOrders = orders.filter((o: Order) => o.status === filter)
        } else {
          foundOrders = orders;
        }


        const totalItems = foundOrders.length;
        const totalPages = Math.ceil(totalItems / perPage);
        const thisPageFirstIndex = (page - 1) * perPage;
        const nextPageFirstIndex = thisPageFirstIndex + perPage;
        return {
          page,
          perPage,
          totalItems,
          totalPages,
          data: foundOrders.filter((_, i) =>
          i >= thisPageFirstIndex &&
          i < nextPageFirstIndex)
          .map((o) => ({ ...o })),
        }
      }),
      // tap(data => console.log('All', JSON.stringify(data))),
      catchError(this.handleError)
    );
}

getOrder(id: number): Observable<Order> {
  if (id === 0) {
    return of(this.initializeOrder());
  }
  const url = `${this.ordersUrl}/${id}`;
  return this.http.get<Order>(url)
    .pipe(
      tap(data => console.log('getOrder: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
}

  createOrder(order: Order): Observable<Order> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Required for the in memory web API to assign a unique id
    order.id = null;
    order.status = 'open';
    return this.http.post<Order>(this.ordersUrl, order, { headers })
      .pipe(
        tap(data => {
          this.orders.push(order);
          console.log('createProduct: ' + JSON.stringify(data))
        }),
        map(data => data),
        catchError(this.handleError)
      );
  }

  deleteOrder(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.ordersUrl}/${id}`;
    return this.http.delete<Order>(url, { headers })
      .pipe(
        tap(data => console.log('deleteProduct: ' + id)),
        catchError(this.handleError)
      );
  }

  updateOrder(order: Order): Observable<Order> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.ordersUrl}/${order.id}`;
    return this.http.put<Order>(url, order, { headers })
      .pipe(
        tap(() => console.log('updateOrder: ' + order.id)),
        // Return the order on an update
        map(() => order),
        catchError(this.handleError)
      );
  }

    private handleError(err: HttpErrorResponse) {
      let errorMessage = '';
      if(err.error instanceof ErrorEvent) {
        errorMessage = 'An error occured: ' + err.error.message;
      } else {
        errorMessage = `Server returned code: ${err.status} error message is: ${err.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
  }

  private initializeOrder(): Order {
    // Return an initialized object
    return {
      id: 0,
      name: '',
      customer: '',
      status: 'open',
      date: '',
      price: 0
    };
  }
}

interface OrdersResponse<T>{
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}

export interface GetOrdersQuery {
  page?: number;
  perPage?: number;
  searchString?: string;
  filter?: string;
}
