import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {HttpUtils} from "../common/http-util";
import {ConfService} from "../home/conf.service";
import {Environment as env} from "../environments/environment"

let testLoginRet=[{'token':'123456789'}]

export class LoginRet{
  token: string;
  constructor(token: string){
    this.token = token;
  }
}

export class UserPrinciple{
  username: string;
  password: string;
  constructor(username:string, password:string){
    this.username  = username;this.password = password;
  }
}
@Injectable()
export class AuthService {
  authUrl:string;
  redirectUrl: string;
  errorEvent = new Subject<string>();
  httpUtils:HttpUtils;
  constructor(private http: Http, private router: Router, private confService:ConfService){
    this.httpUtils = new HttpUtils(http);
  }


  // loginTest(up: UserPrinciple){
  //   let testData:Observable<LoginRet> = Observable.create((subscriber:any)=>{subscriber.next(testLoginRet[0])}).subscribe(
  //     (data:LoginRet)=>{
  //       console.log(data.token);
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("username", up.username);
  //       localStorage.setItem("password", up.password);
  //       console.log("authservice.redirect: " + this.redirectUrl)
  //       let redirect = this.redirectUrl ? this.redirectUrl : '/';
  //       this.router.navigate([redirect]);
  //     },
  //     (err:Error) => {
  //       console.log("error happend: "+ err);
  //       this.errorEvent.next("loginerr")
  //     }
  //   );
  // }


  login(up: UserPrinciple){
      this.confService.getAuthUrl().subscribe(x=>{
          this.authUrl = x;
          if(env.isDev) {
            this.doLoginSuccceed(env.testLoginRet[0],up);
            return;
          }
          let loginRet:Observable<LoginRet> = this.httpUtils.POST<LoginRet>(this.authUrl, up)
              // .timeout(timeoutSetCashbox, "login"+ timeoutTip);
              // .catch(x=>Observable.of(testLoginRet[0]));
          loginRet.subscribe(
              (data:LoginRet)=>{
                  this.doLoginSuccceed(data,up);
              },
              (err:any) => {
                  console.log("errBody" + JSON.parse(err._body).detail)
                  console.log("error: " + err);
                  this.errorEvent.next(JSON.parse(err._body).detail)
              }
          );
      })
  }

  doLoginSuccceed(data: LoginRet, up: UserPrinciple){
    console.log(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", up.username);
    localStorage.setItem("password", up.password);
    this.errorEvent.next("loginsucceed");
  }

  logout(): void {
    localStorage.removeItem("token")
  }
}

