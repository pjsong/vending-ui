import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Http, Response} from "@angular/http";
import {HttpUtils} from "../common/http-util";
import {confUrlPrefix, timeoutTip, timeoutSet, adminloginUrl} from "../home/conf.service";
import {MainButton} from "../home-default-button/default-button.services";

export class AdminLoginRet{
  detail: string;
}
let ADMINLOGINRET:AdminLoginRet[]=[{"detail":"OK"}]

// let BUTTONS = [
//    new MainButton(1,'', '纸币找零', './chargechange')
//   ,new MainButton(2,'', '硬币找零', './chargecoin')
//   ,new MainButton(3,'', '货道维护', './slotupdate')
//   ,new MainButton(4, '', '货道测试', './slottest')
//   ,new MainButton(5, '', '软件更新', './vendorupdate')
// ];
let BUTTONSTEST =
    [
      {"id":1, "imgUrl":"","buttonTxt":"纸币找零","linkTarget":"./chargechange"},
      {"id":2, "imgUrl":"","buttonTxt":"硬币找零","linkTarget":"./chargecoin"},
      {"id":3, "imgUrl":"","buttonTxt":"货道维护","linkTarget":"./slotupdate"},
      {"id":4, "imgUrl":"","buttonTxt":"货道测试","linkTarget":"./slottest"},
      {"id":5, "imgUrl":"","buttonTxt":"软件更新","linkTarget":"./vendorupdate"},
    ];

@Injectable()
export class VendorManagementService{
  httpUtils:HttpUtils;
  loginRetOKEvent:Subject<string> = new Subject<string>() ;

  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }

  getButtons(){
    return this.http.get(confUrlPrefix+"confname=vendormanagement-button").map(x=>x.json())
        // .timeout(timeoutSet, "vendormanagement.getButtons" + timeoutTip)
        .map(x=>JSON.parse(x[0].conf_value) as MainButton[])
        .catch(x=>Observable.of(BUTTONSTEST as MainButton[]))
  }
  // adminLoginTest():Observable<AdminLoginRet>{
  //   let testData:Observable<AdminLoginRet> = Observable.create((subscriber:any)=>{subscriber.next(ADMINLOGINRET[0])});
  //   return testData;
  // }

  getAdminLoginUrl(){
    return this.http.get(confUrlPrefix+"confname=adminloginurl").map(x=>x.json)
        // .timeout(timeoutSet, "vendormanagement.getAdminUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(x=>Observable.of(adminloginUrl))
  }
  adminLogin(adminLoginUrl:string){
    let adminLoginRet: Observable<AdminLoginRet> = this.httpUtils
        .GetWithToken<AdminLoginRet>(adminLoginUrl)
      // .filter(x=>x != null && x.detail != undefined)
      //   .timeout(timeoutSet, "vendormanagement.adminLogin" + timeoutTip)
        .catch(error=>Observable.of(ADMINLOGINRET[0]));
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
