import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../modals/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
  // order: Order | undefined;
  pageTitle = 'Order Edit';
  errorMessage = '';

  order: Order | undefined;
  private currentProduct: any;
  private originalProduct: any;

  // get order(): Order {
  //  return this.currentProduct;
  // }

  // set order(value: Order) {
  //   this.currentProduct = value;
  //   // clone the object to retain a copy
  //   this.originalProduct = { ...value };
  // }

  get isDirty(): boolean {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
  }

  constructor(private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pageTitle += `: ${id}`;
    if (id) {
      this.getOrder(id);
    }
    // this.route.data.subscribe(data => {
    //   const resolvedData: ProductResolved = data['resolvedData'];
    //   this.errorMessage = resolvedData.error ? resolvedData.error : '';
    //   this.onProductRetrieved(resolvedData.order);
    // })
  }

  getOrder(id: number): void {
    this.orderService.getOrder(id).subscribe({
      next: order => this.order = order,
      error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(order: Order | null): void {
    if(order) this.order = order;

    if (!this.order) {
      this.pageTitle = 'No order found';
    } else {
      if (this.order.id === 0) {
        this.pageTitle = 'Add Order';
      } else {
        this.pageTitle = `Edit Order: ${this.order.name}`;
      }
    }
  }

  deleteProduct(): void {
    if (!this.order || !this.order.id) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the order: ${this.order.name}?`)) {
        this.orderService.deleteOrder(this.order.id).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      }
    }
  }

  reset(): void {
    this.currentProduct = null;
    this.originalProduct = null;
  }

  saveProduct(): void {
    if (this.order) {
      if (this.order.id === 0) {
        this.orderService.createOrder(this.order).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      } else {
        this.orderService.updateOrder(this.order).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.reset();
    // Navigate back to the order list
    this.router.navigate(['/orders']);
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }
}
