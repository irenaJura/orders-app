import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Order } from '../modals/order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = 'api/mock-orders.json';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getOrders(query?: GetOrdersQuery): Observable<OrdersResponse<Order>> {
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
          o.id.toString().includes(searchString))
          .filter((o: Order) => o.status === filter)
        } else if (searchString) {
          foundOrders = orders.filter((o: Order) =>
                o.name
                    .toLowerCase()
                    .includes(searchString) ||
                o.id.toString().includes(searchString))
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

  getOrder(id: number): Observable<Order | undefined> {
    return this.getAllOrders()
      .pipe(
        map((data) => data),
        map((orders: Order[]) => orders.find(p => p.id === id))
      )
  }

  createOrder(order: Order): Observable<Order> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // Required for the in memory web API to assign a unique id
    order.id = 0;
    return this.http.post<Order>(this.ordersUrl, order, { headers })
      .pipe(
        tap(data => console.log('createProduct: ' + JSON.stringify(data))),
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
        tap(() => console.log('updateProduct: ' + order.id)),
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
