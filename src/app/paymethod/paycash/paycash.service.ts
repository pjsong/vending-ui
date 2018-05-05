import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, Response} from "@angular/http";
import {HttpUtils} from "../../common/http-util";
import {Environment as env} from "../../environments/environment"

export class OrderTaskSendRet{
id:number;input: number;output_desc: Array<Array<string>>;create_time:string;
constructor(){}
}

export class CashboxTask{
  operate_name: string;//toll,charge,clearPayout,payout,currentPayoutAvailable
  operate_data: number;
  constructor(operate_name:string, operate_data:number){
    this.operate_name  = operate_name;this.operate_data = operate_data;
  }
}

export class CashboxTaskRet{
  id: number;
  operate_name: string;//toll,charge,clearPayout,payout,currentPayoutAvailable
  operate_data: number;
  create_time: string;
  constructor(id: number, operate_name:string, operate_data:number, create_time: string){
    this.id = id;this.operate_name  = operate_name;this.operate_data = operate_data;this.create_time = create_time;
  }
}

export class CashboxLog{
  id: number;
  operate: number;
  operate_status: string;
  ret_data: number;
  create_time: string;
  constructor(  id: number, operate: number, operate_status: string, ret_data: number, create_time: string){
    this.id = id; this.operate = operate; this.operate_status = operate_status;
    this.ret_data = ret_data; this.create_time = create_time;
  }
}

export class TimeVars{
  timeWithPay:number;timeWithoutPay:number;timeStartAlert:number;
  timeAlertEnd:number;timeJumpToFinish:number;queryInterval:number;
  constructor(){}
}

export class PaycashVars{
  payoutThreshold:number;payoutCoinThreshold:number;
}


@Injectable()
export class PaycashService {
  httpUtils:HttpUtils;
  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }


  sendCurrentPayoutAvailable(deviceUrl:string): Observable<CashboxTaskRet>{
    if(env.isDev) return Observable.of(env.currentPayoutAvailableCmdTest);
    let ct = new CashboxTask("currentPayoutAvailable",0);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct);
        // .timeout(timeoutSetCashbox, "sendCurrentPayoutAvailable" + timeoutTip+", "+deviceUrl);
  }


  getCurrentPayoutAvailable(deviceLogUrl:string): Observable<CashboxLog[]>{
    if(env.isDev) return Observable.of(env.ctCurrentPayoutAvailable);
    let urlAddr =  deviceLogUrl+"&operateName=currentPayoutAvailable&limit=1";
    return this.http.get(urlAddr)
      .map((res:Response)=>res.json() as CashboxLog[])
        // .timeout(timeoutSetCashbox, "getCurrentPayoutAvailable" + timeoutTip);
        // .catch(x=>{return Observable.of(ctCurrentPayoutAvailable)
        // .catch(this.handleError)});
  }


  toll(deviceUrl:string, tollAmount: number):Observable<CashboxTaskRet>{
    if(env.isDev) return Observable.of(env.tollTestCmdRet)
    let ct = new CashboxTask("toll",tollAmount);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct);
        // .timeout(timeoutSetCashbox, "toll" + timeoutTip)
        // .catch(x=>Observable.of(tollTestCmdRet));
  }


  tollLog(deviceLogUrl:string, lastLogId:number, operateId:number):Observable<CashboxLog>{
    let urlAddr =  deviceLogUrl+"&operate="+operateId;
    if(env.isDev) return Observable.of(env.CashboxLogTest1[0]);
    return this.http.get(urlAddr)
      .map((res:Response)=>res.json() as CashboxLog[]).do(x=>console.log("toll return: " + x))
      // .timeout(timeoutSetCashbox, "tollLog" + timeoutTip)
        .filter((data:any)=>data.length > 0)
        .map(data=>data[0])
        .filter(data=>data != undefined)
        .filter((data:any)=>data.ret_data>0)
        .filter((data:any)=>data.operate_status != "terminated")
        .filter(((data:any)=> data.id != lastLogId))
        // .catch(x=>Observable.of(CashboxLogTest1[0])
      .catch(this.handleError);
  }

  orderTaskSendLog(controlboardLogUrl:string, controlboardInputId:number){
    if(env.isDev) return Observable.of(env.orderTaskTestRet);
    let urlAddr = controlboardLogUrl+"outputlist/?format=json&inputId="+controlboardInputId
    return this.http.get(urlAddr).map((res:Response)=>res.json() as OrderTaskSendRet[]).filter(data=>data.length>0)
      .map(data=>data[0].output_desc[0])
      .filter(data=>data.length>0)
      .catch(this.handleError);
  }

  terminate(deviceUrl:string):Observable<CashboxTaskRet>{
    let ct = new CashboxTask("terminate",0);
    if(env.isDev) return Observable.of(env.terminateTestCmdRet);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct);
        // .timeout(timeoutSetCashbox, "terminate" + timeoutTip)
        // .catch(x=>Observable.of(terminateTestCmdRet));
  }



  private handleError(error: Response | any){
    let errMsg: string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errMsg = "货道未设置";
    }else{
      errMsg = error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

