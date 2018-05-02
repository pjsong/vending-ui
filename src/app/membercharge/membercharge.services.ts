import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Subject, Observable, Subscription} from "rxjs";
import {HttpUtils} from "../common/http-util";
import {TimeVars, TIMEVARS, CashboxTaskRet, CashboxTask} from "../paymethod/paycash/paycash.service";
import { Environment as env} from '../environments/environment';

export class Member{
  "id": number;
  "owner": number;
  "user": number;
  "balance": number;
  "date_joined": string;
  "username": string;
  "tel_no":string;
  "wechat_no":string;
  "website":string;
  constructor(){}
}


export class MemberInfoUpdateReq{
  "id": number;
  "owner": number;
  "user": number;
  "balance": number;
}

let MEMBERINFOUPDATE = [
  {
    "id": 2,
    "owner": 1,
    "user": 3,
    "balance": 98
  }
]

@Injectable()
export class MemberChargeService{
  httpUtils: HttpUtils;
  balanceSub:Subject<MemberInfoUpdateReq> = new Subject<MemberInfoUpdateReq>()

  constructor(private http:Http){
    this.httpUtils = new HttpUtils(http);

  }

  // getMemberInfoTest(){
  //   Observable.create((subscriber:any)=>{subscriber.next(MEMBERTEST)})
  //     .subscribe(
  //       (x:Member[])=>{this.balanceSub.next(x[0])},
  //       // (err:Error)=>{this.balanceSub.next(-1)}
  //   )
  // }

  memberCharge(deviceUrl:string):Observable<CashboxTaskRet>{
    if(env.isDev) return Observable.of(env.tollTestCmdRet);
    let ct = new CashboxTask("memberCharge",0);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct)
        // .timeout(timeoutSetCashbox, "memberCharge " + timeoutTip)
    // .catch(x=>Observable.of(tollTestCmdRet));
  }
  getMemberInfo(memberUrl:string){
    let username = localStorage.getItem("username");
    this.httpUtils.GetWithToken<Member[]>(memberUrl+"?username="+username+"&format=json")
        // .timeout(timeoutSet, "getMemberInfo" + timeoutTip)
        .filter((x:any)=>x!=undefined && x.length==1).catch(x=>Observable.of(env.MANAGER_TEST[0])).subscribe(
        (x:any)=>{this.balanceSub.next(x[0])},
      // err=>{this.balanceSub.next(-1)}
    )
  }


  updateMemberInfo(memberUrl:string, req: MemberInfoUpdateReq){
    let id: number = req.id;
    return this.httpUtils.PutWithToken<MemberInfoUpdateReq>(memberUrl+"edit/"+id+"/" ,req )
        // .timeout(timeoutSet, "updateMemberInfo" + timeoutTip)
        // .catch(x=>Observable.of(MEMBERINFOUPDATE)
          .catch(this.handleError);
  }

  private handleError(error: Response | any){
    let errMsg: string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errMsg = "充值错误";
    }else{
      errMsg = error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
