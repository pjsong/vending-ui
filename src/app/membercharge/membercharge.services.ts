import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Subject, Observable, Subscription } from "rxjs";
import { HttpUtils } from "../common/http-util";
import { TimeVars, CashboxTaskRet, CashboxTask } from "../paymethod/paycash/paycash.service";
import { Environment as env } from '../environments/environment';

export class Member {
  "id": number;
  "owner": number;
  "user": number;
  "balance": number;
  "date_joined": string;
  "username": string;
  "tel_no": string;
  "wechat_no": string;
  "website": string;
  constructor() { }
}


export class MemberInfoUpdateReq {
  "id": number;
  "owner": number;
  "user": number;
  "balance": number;
}



@Injectable()
export class MemberChargeService {
  httpUtils: HttpUtils;
  balanceSub: Subject<MemberInfoUpdateReq> = new Subject<MemberInfoUpdateReq>()

  constructor(private http: Http) {
    this.httpUtils = new HttpUtils(http);

  }

  memberCharge(deviceUrl: string): Observable<CashboxTaskRet> {
    if (env.isDev) return Observable.of(env.tollTestCmdRet);
    let ct = new CashboxTask("memberCharge", 0);
    return this.httpUtils.POST<CashboxTaskRet>(deviceUrl, ct)
  }

  getMemberInfo(memberUrl: string) {
    if (env.isDev) {
      Observable.of(env.MANAGER_TEST[0]).subscribe(
        (x: any) => { this.balanceSub.next(x[0]) }); return;
    }

    let username = localStorage.getItem("username");
    this.httpUtils.GetWithToken<Member[]>(memberUrl + "?username=" + username + "&format=json")
      .filter((x: any) => x != undefined && x.length == 1)
      .catch(x => Observable.of(env.MANAGER_TEST[0])).subscribe(
        (x: any) => { this.balanceSub.next(x[0]) },
    )
  }


  updateMemberInfo(memberUrl: string, req: MemberInfoUpdateReq) {
    let id: number = req.id;
    if (env.isDev) return Observable.of(env.memberInfoUpdate);
    return this.httpUtils.PutWithToken<MemberInfoUpdateReq>(memberUrl + "edit/" + id + "/", req)
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errMsg = "充值错误";
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
