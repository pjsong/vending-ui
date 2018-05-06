import { Injectable } from '@angular/core';
import {Observable, Subject, of} from "rxjs";
import {map,flatMap, filter} from "rxjs/operators";
import {Http, Response} from "@angular/http";
import {HttpUtils} from "../common/http-util";
import {MainButton} from "../home-default-button/default-button.services";
import { Environment as env} from "../environments/environment"

export class AdminLoginRet{
  detail: string;
}
let ADMINLOGINRET:AdminLoginRet[]=[{"detail":"OK"}]

@Injectable()
export class VendorManagementService{
  httpUtils:HttpUtils;
  loginRetOKEvent:Subject<string> = new Subject<string>() ;

  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }

  getButtons(){
    if(env.isDev) return of(env.vnedorManagementButton as MainButton[]);
    return this.http.get(env.confUrlPrefix+"confname=vendormanagement-button")
    .pipe(map(x=>x.json()),
        map(x=>JSON.parse(x[0].conf_value) as MainButton[]))
  }

  getAdminLoginUrl(){
    if(env.isDev) return of(env.adminloginUrl);
    return this.http.get(env.confUrlPrefix+"confname=adminloginurl").pipe(map(x=>x.json),
        // .timeout(timeoutSet, "vendormanagement.getAdminUrl" + timeoutTip)
        map(x=>x[0].conf_value))
  }
  adminLogin(adminLoginUrl:string){
    if(env.isDev) {this.loginRetOKEvent.next("OK");return;}
    let adminLoginRet: Observable<AdminLoginRet> = this.httpUtils
        .GetWithToken<AdminLoginRet>(adminLoginUrl)
      // .filter(x=>x != null && x.detail != undefined)
        ;
    adminLoginRet.subscribe(
      x=>{
        if(x.detail == "OK")
          this.loginRetOKEvent.next("OK");
        else
          this.loginRetOKEvent.next("NOT_OK")
      },
      err=>{
        this.loginRetOKEvent.next("AUTH_FAILED")
      });
  }
}
