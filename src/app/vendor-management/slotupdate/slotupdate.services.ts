import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {HttpUtils} from "../../common/http-util";
import {confUrlPrefix, timeoutTip, timeoutSet, timeoutSetCashbox, slotstatusUrl} from "../../home/conf.service";

export class SlotUpdateReq{
  "slot_no": string;
  "running_status": string = "1";
  "before_item_num": number;
  "variation_num": number;
  "current_item_num": number;
  "malfunction_report_count": number;
  constructor(){}
}
export class SlotCreateReq{
  "slot_no": string;
  "running_status": string = "1";
  "current_item_num": number;
  "malfunction_report_count": number;
  constructor(){}
}
let SLOTUPDATE = [{
  "slot": 1,
  "running_status": "1",
  "current_item_num": 11,
  "malfunction_report_count": 0
}]


@Injectable()
export class SlotUpdateService{
  constructor(private http: Http ){}


  // slotUpdate(slotUpdateUrl:string, su: SlotUpdateReq): Observable<SlotUpdateReq>{
  //   console.log(su);
  //   return new HttpUtils(this.http).PutWithToken<SlotUpdateReq>(slotUpdateUrl +'edit/' + su.slotNo+'/', su)
  //     .catch(err=> {
  //         this.handleError(err, slotUpdateUrl, su);
  //       return null;
  //     });
  // }

  slotCreate(slotUpdateUrl:string, su: SlotUpdateReq): Observable<SlotUpdateReq>{
    console.log(su);
    return new HttpUtils(this.http).POSTWithToken<SlotUpdateReq>(slotUpdateUrl + 'create/', su)
      .catch(err=> this.handleCreateError(err))
    // .timeout(timeoutSetCashbox, "slotUpdate" + timeoutTip)
    // .catch(error=>Observable.of(SLOTUPDATE[0]).catch(this.handleError));
  }

  private handleError(error: Response | any, slotCreateUrl: string, su: SlotUpdateReq){
    let errMsg: string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      console.log("response error status: " + error.status + ', error.statusText' +  error.statusText);
      if(error.status == 404){
        this.slotCreate(slotCreateUrl, su).subscribe(x=>console.log("create returned: " + JSON.stringify(x)));
      }
      errMsg = "handleErrorResponse: 货道未设置";
    }else{
      errMsg = error.message?error.message:error.toString();
    }
    console.error("handleError: " + errMsg);
  }

  private handleCreateError(error: Response | any){
    let errMsg: string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`; //4.4 Not Found
      console.log("create response error status: " + error.status + 'error.statusText' +  error.statusText);
      errMsg = "create handleErrorResponse: 货道未设置";
    }else{
      errMsg = "create no Response error: " + error.message?error.message:error.toString();
    }
    console.error("create handleError: " + errMsg);
    return Observable.throw("创建成功");
  }
}