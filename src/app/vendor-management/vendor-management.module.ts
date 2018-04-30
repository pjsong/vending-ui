import { NgModule }      from '@angular/core';
import {Ng2BootstrapModule} from 'ngx-bootstrap';
import {RouterModule} from "@angular/router";
import {VendorManagement} from "./vendor-management.component";
import {VendorManagementRoutingModule} from "./vendor-management-routing.module";
import {SlotTest} from "./slottest/slottest.component";
import {ChargeCoin} from "./chargecoin/chargecoin.component";
import {ChargeChange} from "./chargechange/chargechange.component";
import {NumKBModule} from "../numKB/numKB.module";
import {CommonModule} from "@angular/common";
import {ChargeChangeService} from "./chargechange/chargechange.services";
import {SlotTestService} from "./slottest/slottest.services";
import {ChargeCoinService} from "./chargecoin/chargecoin.services";
import {VendorManagementService} from "./vendor-management.services";
import {FooterCommandModule} from "../footercommand/FooterCommand.module";
import {SlotUpdate} from "./slotupdate/slotupdate.component";
import {SlotUpdateService} from "./slotupdate/slotupdate.services";
import {PaycashService} from "../paymethod/paycash/paycash.service";
import {Upgrade} from "./upgrade/upgrade.component";
import {UpgradeService} from "./upgrade/upgrade.service";


@NgModule({
  //other module whose exported classes are needed by component templates decleared in this module
  imports: [ CommonModule, Ng2BootstrapModule, VendorManagementRoutingModule, RouterModule, NumKBModule, FooterCommandModule],
  //view classes that belongs to this module
  declarations: [ VendorManagement, SlotTest, ChargeCoin, ChargeChange,SlotUpdate, Upgrade
  ],
  //creators of services that this module contributes to the global collection of services
  providers: [
    VendorManagementService, PaycashService, ChargeChangeService, SlotUpdateService, SlotTestService, ChargeCoinService, UpgradeService
  ],
  // subset of declarations that should be visible and usable in the component templates of other modules
  exports:[VendorManagement],
})
export class VendorManagementModule { }
