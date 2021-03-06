import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, of, Subject} from "rxjs";
import {map, filter} from 'rxjs/operators'
import {HttpUtils} from "../common/http-util";
import {Member} from "../membercharge/membercharge.services";
import { environment as env} from '../../environments/environment';

let MEMBERTEST=[{
  "id": 2,
  "owner": 1,
  "user": 3,
  "balance": 88,
  "date_joined": "2017-01-07 14:04:20",
  "username": "buyer",
  "tel_no":"13509205735",
  "wechat_no":"WX13509205735"
}]


@Injectable()
export class FooterBannerService{
  httpUtils: HttpUtils;

  constructor(private http:Http){
    this.httpUtils = new HttpUtils(http);

  }

  getManagerInfo(memberUrl:string){
    if(env.isDev) return of(env.MANAGER_TEST[0]);

    console.log("footbanner memberUrl" + memberUrl);
    return this.http.get(memberUrl+"?format=json&isManager")
      // .timeout(timeoutSet, "getManagerInfo" + timeoutTip)
      // .filter((x:any)=>x!=undefined && x.length==1)
      .pipe(map((res:Response)=>res.json() as Member[]),
      map(x=>x[0] as Member));
      // .catch(x=>ofMEMBERTEST[0]));
  }
}
