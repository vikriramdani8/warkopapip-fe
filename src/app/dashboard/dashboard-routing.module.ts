import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'menu', 
    pathMatch: 'full' 
  }, {
    path : 'menu',
    component: MenuComponent
  }, {
    path : 'checkout',
    component: CheckoutComponent
  }, {
    path : 'admin',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
