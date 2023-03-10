import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {
  constructor() { }
  createDb() {
    return {
      orders: [
        {
          id: 1,
          name: 'Order Ana',
          customer: 'Ana Anic',
          status: 'open',
          date: '01/01/2023',
          price: 10.0
        },
        {
          id: 2,
          name: 'Order Boris',
          customer: 'Boris Boric',
          status: 'closed',
          date: '02/01/2023',
          price: 20.0
        },
        {
          id: 3,
          name: 'Order Doris',
          customer:'Doris Doric',
          status: 'open',
          date: '03/01/2023',
          price: 30.0
        },
        {
          id: 4,
          name: 'Order Goran',
          customer: 'Goran Goric',
          status: 'closed',
          date: '04/01/2023',
          price: 40.0
        },
        {
          id: 5,
          name: 'Order Hrvoje',
          customer: 'Hrvoje Hrga',
          status: 'open',
          date: '05/01/2023',
          price: 50.0
        },
        {
          id: 6,
          name: 'Order Ivana',
          customer: 'Ivana Ivic',
          status: 'closed',
          date: '06/01/2023',
          price: 60.0
        },
        {
          id: 7,
          name: 'Order Julija',
          customer: 'Julija Julic',
          status: 'open',
          date: '07/01/2023',
          price: 70.0
        },
        {
          id: 8,
          name: 'Order Krunoslav',
          customer: 'Krunoslav Krunic',
          status: 'closed',
          date: '08/01/2023',
          price: 80.0
        },
        {
          id: 9,
          name: 'Order Lidija',
          customer: 'Lidija Lidic',
          status: 'open',
          date: '09/01/2023',
          price: 90.0
        },
        {
          id: 10,
          name: 'Order Marija',
          customer: 'Marija Maric',
          status: 'open',
          date: '10/01/2023',
          price: 100.0
        }
      ]

    };
  }
}
