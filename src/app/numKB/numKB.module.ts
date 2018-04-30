import { NgModule }      from '@angular/core';
import {Ng2BootstrapModule} from 'ngx-bootstrap';
import {NumKB} from "./numKB.component";
import {CommonModule} from "@angular/common";



@NgModule({
  //other module whose exported classes are needed by component templates decleared in this module
  imports: [CommonModule, Ng2BootstrapModule],
  //view classes that belongs to this module
  declarations: [NumKB
  ],
  //creators of services that this module contributes to the global collection of services
  providers: [
  ],
  // subset of declarations that should be visible and usable in the component templates of other modules
  exports:[NumKB],
})
export class NumKBModule { }
