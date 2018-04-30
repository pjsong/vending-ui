import { NgModule }     from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpModule} from "@angular/http";
import {Paymethod} from "./paymethod.component";
import {Paycash} from "./paycash/paycash.component";
import {Paymember} from "./paymember/paymember.component";
import {AuthGuard} from "../login/auth-guard.service";
import {Payweixin} from "./payweixin/payweixin.component";


const PaymethodRoutes: Routes = [
  {
    path: '',
    redirectTo: 'paymethod',
    pathMatch: 'full'
  },
  {
    path: 'paymethod',
    component: Paymethod
  },
  {
    path: 'paycash',
    component: Paycash
  },
  {
    path: 'paymember',
    component: Paymember,
    canActivate: [AuthGuard],
  },
  {
    path: 'payweixin',
    component: Payweixin
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(PaymethodRoutes), HttpModule
  ],
  exports: [
    RouterModule
  ],
})
export class PaymethodRoutingModule {}
