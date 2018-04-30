import { NgModule }     from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpModule} from "@angular/http";
import {SlotSelect} from "../slotselect/slotselect.component";
import {DefaultButton} from "../home-default-button/default-button.component";
import {_404Component} from "../common/404";
import {AuthGuard} from "../login/auth-guard.service";
import {MemberCharge} from "../membercharge/membercharge.component";

const HomeRoutes: Routes = [
  {
    path: '',
    redirectTo: 'default-button',
    pathMatch: 'full'
  },
  {
    path: 'slotselect',
    component: SlotSelect
  },
  {
    path: 'paymethod',
    loadChildren: '../paymethod/paymethod.module#PaymethodModule',
  },
  {
    path: 'membercharge',
    component: MemberCharge,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor-management',
    loadChildren: '../vendor-management/vendor-management.module#VendorManagementModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'default-button',
    component: DefaultButton
  },
  {
    path: '**', component: _404Component
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(HomeRoutes), HttpModule
  ],
  exports: [
    RouterModule
  ],
})
export class HomeRoutingModule {}
