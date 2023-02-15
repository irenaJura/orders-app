import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order, OrderResolved } from './modals/order';
import { OrderService } from './services/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderResolverService {
  constructor(private orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderResolved>| null{
    const id = route.paramMap.get('id');
    if (isNaN(Number(id))) {
      const msg = `Order id is not a number: ${id}`;
      console.error(msg);
      return of({ order: null, error: msg });
    }
    return this.orderService.getOrder(Number(id))
      .pipe(
        map(order => ({ order: order })),
        catchError(error => {
          const msg = `Retrieval error: ${error}`;
          console.error(msg);
          return of({ order: null, error: msg })
        })
      )
  }
}
