import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from "@angular/http";
import { SlotTest } from "./slottest/slottest.component";
import { ChargeChange } from "./chargechange/chargechange.component";
import { VendorManagement } from "./vendor-management.component";
import { SlotUpdate } from "./slotupdate/slotupdate.component";
import { ChargeCoin } from "./chargecoin/chargecoin.component";
import { Upgrade } from "./upgrade/upgrade.component";
import {AuthGuard} from "../login/auth-guard.service"

//https://angular.io/guide/router#canactivate-requiring-authentication
const VendorManagementRoutes: Routes = [
  {
    path: '',
    component: VendorManagement,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'chargechange',
        component: ChargeChange
      },
      {
        path: 'chargecoin',
        component: ChargeCoin
      },
      {
        path: 'slotupdate',
        component: SlotUpdate
      },
      {
        path: 'slottest',
        component: SlotTest
      },
      {
        path: 'vendorupdate',
        component: Upgrade
      },
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(VendorManagementRoutes), HttpModule
  ],
  exports: [
    RouterModule
  ],
})
export class VendorManagementRoutingModule { }
