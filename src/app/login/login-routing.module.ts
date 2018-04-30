import { NgModule }       from '@angular/core';
import { RouterModule }   from '@angular/router';
import { LoginComponent } from './login.component';
import {AuthGuard} from "./auth-guard.service";
import {AuthService} from "./auth.service";
import {CommonModule} from "@angular/common";
import {KeyBoardModule} from "../keyboard/keyboard.module";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'login', component: LoginComponent }
    ]), CommonModule, KeyBoardModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard,
    AuthService
  ]
})
export class LoginRoutingModule {}
