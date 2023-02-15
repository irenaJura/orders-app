import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order, OrderResolved } from '../modals/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnInit {
  pageTitle = '';
  isAddMode = false;
  isLoading = false;
  errorMessage = '';

  formData: any[] = [
    {"label": "Name", "formControlName": "name"},
    {"label": "Customer", "formControlName": "customer"},
    {"label": "Status", "formControlName": "status"},
    {"label": "Date", "formControlName": "date"},
    {"label": "Price", "formControlName": "price"},
  ];
  orderForm: FormGroup = new FormGroup({});
  order: Order | undefined;

  constructor(private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.route.data.subscribe(data => {
        const resolvedData: OrderResolved = data['resolvedData'];
        this.errorMessage = resolvedData.error ? resolvedData.error : '';
        this.onOrderRetrieved(resolvedData.order);
      })
  }

  onOrderRetrieved(order: Order | null): void {
    if(order) {
      this.order = order;
    };

    if (!this.order) {
      this.pageTitle = 'No order found';
    } else {
      if (this.order.id === 0) {
        this.pageTitle = 'Add Order';
        this.isAddMode = true;
        this.buildForm();
        this.initializeEditForm(this.order);

      } else {
        this.pageTitle = `Edit Order: ${this.order.name}`;
        this.buildForm();
        this.initializeEditForm(this.order);
      }
    }
  }

  buildForm() {
    this.orderForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      customer: new FormControl('', Validators.required),
      status: this.isAddMode ?
        new FormControl({value: 'open', disabled: true}, Validators.required) :
        new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
    });
  }

  initializeEditForm(order: Order): void {
    this.orderForm.patchValue({
        id: order.id,
        name: order.name,
        customer: order.customer,
        status: order.status,
        date: order.date,
        price: order.price
      });
}

  deleteOrder(): void {
    if (!this.order || !this.order.id) {
      // Don't delete, it was never saved.
      this.router.navigate(['orders']);
    } else {
      if (confirm(`Really delete the order: ${this.order.name}?`)) {
        this.orderService.deleteOrder(this.order.id).subscribe({
          next: (data) => this.router.navigate(['orders']),
          error: err => this.errorMessage = err
        });
      }
    }
  }

  onSubmit(orderForm: FormGroup): void {
    if (orderForm.valid) {
      if (orderForm.value.id === 0) {
        this.orderService.createOrder(orderForm.value).subscribe({
          next: (order) => {
            this.order = order;
            this.onSaveComplete(this.order.id)
          },
          error: err => this.errorMessage = err
        });
      } else {
        orderForm.value.id = this.order?.id;
        this.orderService.updateOrder(orderForm.value).subscribe({
          next: () => this.onSaveComplete(+orderForm.value.id),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please fill out the required fields.'
    }
  }

  onSaveComplete(id: number | null): void {
    this.router.navigate(['/orders', id]);
    this.orderForm.reset();
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }
}
