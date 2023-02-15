import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderResolverService } from './order-resolver.service';
import { OrdersListComponent } from './orders-list/orders-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'orders',
    canActivate: [AuthGuard],
    component: OrdersListComponent },
  { path: 'orders/:id',
    canActivate: [AuthGuard],
    resolve: { resolvedData: OrderResolverService },
    component: OrderDetailComponent },
  { path: 'orders/:id/:edit',
    canActivate: [AuthGuard],
    resolve: { resolvedData: OrderResolverService },
    component: OrderEditComponent },
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
