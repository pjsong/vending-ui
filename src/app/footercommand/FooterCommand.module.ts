import { NgModule }      from '@angular/core';
// import {Ng2BootstrapModule} from 'ngx-bootstrap';
import {CommonModule} from "@angular/common";
import {FooterCommand} from "./footercommand.component";



@NgModule({
  //other module whose exported classes are needed by component templates decleared in this module
  imports: [CommonModule],//, Ng2BootstrapModule],
  //view classes that belongs to this module
  declarations: [FooterCommand
  ],
  //creators of services that this module contributes to the global collection of services
  providers: [
  ],
  // subset of declarations that should be visible and usable in the component templates of other modules
  exports:[FooterCommand],
})
export class FooterCommandModule { }
