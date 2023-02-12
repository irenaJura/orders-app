import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../modals/order';
import { OrderService, GetOrdersQuery } from '../services/order.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  pageTitle = 'Orders List';
  isLoader = false;
  totalPages = 0;
  totalItems = 0;
  filter = '';
  errorMessage = '';
  sub!: Subscription;

  private _listFilter = "";
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.getPaginatedOrders({searchString: value, filter: this.filter});
  }

  paginatedOrders: Order[] = [];

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getPaginatedOrders();
  }

  getPaginatedOrders(query?: GetOrdersQuery) {
    this.sub = this.orderService.getOrders(query).subscribe({
      next: orders =>  {
        this.paginatedOrders = orders.data;
        this.totalItems = orders.totalItems;
        this.totalPages = orders.totalPages;
      },
      error: error => this.errorMessage = error
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onFilterChange(event: any): void {
      this.filter = event.value;
      this.getPaginatedOrders({filter: event.value, searchString: this.listFilter});
  }

  displayActivePage(obj: GetOrdersQuery): void{
    const query = {page: obj.page, searchString: obj.searchString, filter: obj.filter};
    this.getPaginatedOrders(query);
}
}
