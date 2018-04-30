import { NgModule }      from '@angular/core';
import {Ng2BootstrapModule} from 'ngx-bootstrap';
import {RouterModule} from "@angular/router";

import {NumKBModule} from "../numKB/numKB.module";
import {CommonModule} from "@angular/common";

import {FooterCommandModule} from "../footercommand/FooterCommand.module";
import {PaymethodRoutingModule} from "./paymethod-routing.module";
import {Paymethod} from "./paymethod.component";
import {PaymethodService} from "./paymethod.services";
import {Paycash} from "./paycash/paycash.component";
import {PaycashService} from "./paycash/paycash.service";
import {ChargeCoinService} from "../vendor-management/chargecoin/chargecoin.services";
import {Paymember} from "./paymember/paymember.component";
import {SlotUpdateService} from "../vendor-management/slotupdate/slotupdate.services";
import {Payweixin} from "./payweixin/payweixin.component";
import {PayweixinService} from "./payweixin/payweixin.service";



@NgModule({
  //other module whose exported classes are needed by component templates decleared in this module
  imports: [ CommonModule, Ng2BootstrapModule, PaymethodRoutingModule, RouterModule, NumKBModule, FooterCommandModule],
  //view classes that belongs to this module
  declarations: [ Paymethod, Paycash, Paymember, Payweixin
  ],
  //creators of services that this module contributes to the global collection of services
  providers: [
    PaymethodService, PaycashService, PayweixinService, ChargeCoinService, SlotUpdateService,
  ],
  // subset of declarations that should be visible and usable in the component templates of other modules
  exports:[Paymethod],
})
export class PaymethodModule { }
