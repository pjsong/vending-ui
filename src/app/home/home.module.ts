import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { HomeRoutingModule } from './home-routing.module';
// import {Ng2BootstrapModule} from 'ngx-bootstrap';
import {Home} from "./home.component";
import {DefaultButton} from "../home-default-button/default-button.component";
import {SlotSelect} from "../slotselect/slotselect.component";
// import {ButtonService} from "../home-default-button/default-button.services";
import {_404Component} from "../common/404";
import {TopBanner} from "../topbanner/ngb2/topbanner.component";
import {FooterBanner} from "../footerbanner/footerbanner.component";
import {NumKBModule} from "../numKB/numKB.module";
import {AuthGuard} from "../login/auth-guard.service";
import {AuthService} from "../login/auth.service";
import {LoginRoutingModule} from "../login/login-routing.module";
import {LoginComponent} from "../login/login.component";
import {KeyBoardModule} from "../keyboard/keyboard.module";
import {FooterCommandModule} from "../footercommand/FooterCommand.module";
import {MemberCharge} from "../membercharge/membercharge.component";
import {MemberChargeService} from "../membercharge/membercharge.services";
import {SlotSelectService} from "../slotselect/slotselect.service";
import {HomeService} from "./home.service";
import {PaycashService} from "../paymethod/paycash/paycash.service";
import {ConfService} from "./conf.service";
import {FooterBannerService} from "../footerbanner/footerbanner.service";



@NgModule({
  //other module whose exported classes are needed by component templates decleared in this module
  imports: [ BrowserModule, LoginRoutingModule, HomeRoutingModule,  NumKBModule, KeyBoardModule, FooterCommandModule],
  //view classes that belongs to this module
  declarations: [ Home, TopBanner, FooterBanner, DefaultButton, SlotSelect, LoginComponent, MemberCharge, _404Component
  ],
  //creators of services that this module contributes to the global collection of services
  providers: [
    HomeService, ConfService, FooterBannerService, SlotSelectService, MemberChargeService, AuthGuard, AuthService, PaycashService,
  ],
  // subset of declarations that should be visible and usable in the component templates of other modules
  exports:[Home],
})
export class HomeModule { }
