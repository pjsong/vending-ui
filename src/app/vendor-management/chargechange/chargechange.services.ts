let ctCurrentPayoutAvailable = [{ "id": 5586,  "operate": 140,  "operateStatus": "succeed",  "retData": 130,  "createTime": "2016-12-29 06:52:55"}]

import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {CashboxTask, CashboxTaskRet, CashboxLog, TimeVars} from "../../paymethod/paycash/paycash.service";
import {HttpUtils} from "../../common/http-util";
import { Environment as env} from "../../environments/environment"


@Injectable()
export class ChargeChangeService{
  private ctCurrentPayoutAvailable: CashboxTask;
  private httpUtils:HttpUtils;
  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }
  getTimeVars(){
    if(env.isDev) return Observable.of(env.paycashTimeVar)
    return this.http.get(env.confUrlPrefix+"confname=chargechange-timevars").map(x=>x.json())
        // .filter(x=>x.length>0)
        // .timeout(timeoutSet, "chargechange.getTimeVars" + timeoutTip)
        .map(x=>{
          return JSON.parse(x[0].conf_value) as TimeVars}).map(x=>{if(x == undefined) Observable.throw("undefined"); return x})
        .catch(x=>{return Observable.of(env.paycashTimeVar)});
  }


  sendChargeCmd(deviceUrl:string):Observable<CashboxTaskRet>{
    if(env.isDev) return Observable.of(env.chargeTestCmdRet)
    let ct = new CashboxTask("charge",0);
      return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct);
          // .timeout(timeoutSet, "sendChargeCmd"+timeoutTip)
        // .catch(error=>Observable.of(chargeTestCmdRet));
  }

  // getCurrentPayoutAvailableTest():Observable<CashboxLog[]>{
  //   let testData:Observable<CashboxLog[]> = Observable.create(
  //     (subscriber:any)=>{subscriber.next(ctCurrentPayoutAvailable)});
  //   return testData;
  // }
}
