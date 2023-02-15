import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderResolved } from '../modals/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  pageTitle = 'Order Detail';
  order: Order | null = null;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    const resolvedData: OrderResolved = this.route.snapshot.data['resolvedData'];
    this.errorMessage = resolvedData.error ? resolvedData.error : '';
    this.onProductRetrieved(resolvedData.order);
  }

  onProductRetrieved(order: Order | null): void {
    this.order = order;

    if (this.order) {
      this.pageTitle = `Product Detail: ${this.order.name}`;
    } else {
      this.pageTitle = 'No product found';
    }
  }

  // ngOnInit(): void {
  //   const id = Number(this.route.snapshot.paramMap.get('id'));
  //   this.pageTitle += `: ${id}`;
  //   if (id) {
  //     this.getOrder(id);
  //   }
  // }

  // getOrder(id: number): void {
  //   this.orderService.getOrder(id).subscribe({
  //     next: order => this.order = order,
  //     error: err => this.errorMessage = err
  //   });
  // }

  onBack(): void {
    this.router.navigate(['/orders']);
  }

}
