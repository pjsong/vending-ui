import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, Response} from "@angular/http";
import {confUrlPrefix, timeoutTip, timeoutSet, timeoutSetCashbox} from "../../home/conf.service";
import {HttpUtils} from "../../common/http-util";

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

let currentPayoutAvailableCmdTest = {"id": 1, "operateName":"currentPayoutAvailable", "operateData":0, "createTime":"2016-12-29 09:38:21"};
let ctCurrentPayoutAvailable = [{ "id": 5586,  "operate": 1,  "operate_status": "succeed",  "retData": 130,  "createTime": "2016-12-29 06:52:55"}];
let tollTestCmdRet = {"id": 99, "operateName":"toll", "operateData":9, "createTime":"2016-12-29 09:38:21"};
let terminateTestCmdRet = {"id": 99, "operateName":"terminate", "operateData":9, "createTime":"2016-12-29 09:38:21"};
let CashboxLogTest = [{"id":100,"operate": 99,   "operate_status": "succeed",  "retData": 20, "createTime":"2016-12-29 06:52:55"}];
let CashboxLogTest1 = [{"id":39015,"operate":99,"operate_status":"processing","retData":10,"createTime":"2016-12-31 08:06:01"}];

export const TIMEVARS={"timeWithPay":60,"timeWithoutPay":50,"timeStartAlert":30,"timeAlertEnd":15,
"timeJumpToFinish":5,"queryInterval":2000};

export const PAYCASHVARS={"payoutThreshold":90,"payoutCoinThreshold":29};


@Injectable()
export class PaycashService {
  httpUtils:HttpUtils;
  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }


  sendCurrentPayoutAvailable(deviceUrl:string): Observable<CashboxTaskRet>{
    let ct = new CashboxTask("currentPayoutAvailable",0);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct);
        // .timeout(timeoutSetCashbox, "sendCurrentPayoutAvailable" + timeoutTip+", "+deviceUrl);
        // .catch(x=>Observable.of(currentPayoutAvailableCmdTest));
  }


  getCurrentPayoutAvailable(deviceLogUrl:string): Observable<CashboxLog[]>{
    let urlAddr =  deviceLogUrl+"&operateName=currentPayoutAvailable&limit=1";
    return this.http.get(urlAddr)
      .map((res:Response)=>res.json() as CashboxLog[])
        // .timeout(timeoutSetCashbox, "getCurrentPayoutAvailable" + timeoutTip);
        // .catch(x=>{return Observable.of(ctCurrentPayoutAvailable)
        // .catch(this.handleError)});
  }


  toll(deviceUrl:string, tollAmount: number):Observable<CashboxTaskRet>{
    let ct = new CashboxTask("toll",tollAmount);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct);
        // .timeout(timeoutSetCashbox, "toll" + timeoutTip)
        // .catch(x=>Observable.of(tollTestCmdRet));
  }


  tollLog(deviceLogUrl:string, lastLogId:number, operateId:number):Observable<CashboxLog>{
    let urlAddr =  deviceLogUrl+"&operate="+operateId;
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
    let urlAddr = controlboardLogUrl+"outputlist/?format=json&inputId="+controlboardInputId
    return this.http.get(urlAddr).map((res:Response)=>res.json() as OrderTaskSendRet[]).filter(data=>data.length>0)
      .map(data=>data[0].output_desc[0])
      .filter(data=>data.length>0)
      .catch(this.handleError);
  }

  terminate(deviceUrl:string):Observable<CashboxTaskRet>{
    let ct = new CashboxTask("terminate",0);
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

