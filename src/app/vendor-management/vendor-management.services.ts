import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
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
    if(env.isDev) return Observable.of(env.vnedorManagementButton as MainButton[]);
    return this.http.get(env.confUrlPrefix+"confname=vendormanagement-button").map(x=>x.json())
        // .timeout(timeoutSet, "vendormanagement.getButtons" + timeoutTip)
        .map(x=>JSON.parse(x[0].conf_value) as MainButton[])
        .catch(x=>Observable.of(env.vnedorManagementButton as MainButton[]))
  }
  // adminLoginTest():Observable<AdminLoginRet>{
  //   let testData:Observable<AdminLoginRet> = Observable.create((subscriber:any)=>{subscriber.next(ADMINLOGINRET[0])});
  //   return testData;
  // }

  getAdminLoginUrl(){
    if(env.isDev) return Observable.of(env.adminloginUrl);
    return this.http.get(env.confUrlPrefix+"confname=adminloginurl").map(x=>x.json)
        // .timeout(timeoutSet, "vendormanagement.getAdminUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(x=>Observable.of(env.adminloginUrl))
  }
  adminLogin(adminLoginUrl:string){
    if(env.isDev) {this.loginRetOKEvent.next("OK");return;}
    let adminLoginRet: Observable<AdminLoginRet> = this.httpUtils
        .GetWithToken<AdminLoginRet>(adminLoginUrl)
      // .filter(x=>x != null && x.detail != undefined)
        .catch(error=>Observable.of(env.vendorManagementLoginRet[0]));
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
