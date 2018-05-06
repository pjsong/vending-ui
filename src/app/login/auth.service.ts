import { Injectable } from '@angular/core';

import {Observable, of, Subject} from "rxjs";
import {map, filter} from 'rxjs/operators'
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import {HttpUtils} from "../common/http-util";
import {ConfService} from "../home/conf.service";
import {environment as env} from "../../environments/environment"

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

  login(up: UserPrinciple){
      this.confService.getAuthUrl().subscribe(x=>{
          this.authUrl = x;
          if(env.isDev) {
            this.doLoginSuccceed(env.testLoginRet[0],up);
            return;
          }
          let loginRet:Observable<LoginRet> = this.httpUtils.POST<LoginRet>(this.authUrl, up)
              // .timeout(timeoutSetCashbox, "login"+ timeoutTip);
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

