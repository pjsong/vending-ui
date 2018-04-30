// import { Injectable } from '@angular/core';
// import {Http, Response} from "@angular/http";
// import {Subject, Observable, Subscription} from "rxjs";
// import {MemberInfoUpdateReq, Member} from "../../membercharge/membercharge.services";
// import {HttpUtils} from "../../common/http-util";
// import {confUrlPrefix} from "../../home/home.service";
// import {TimeVars, TIMEVARS} from "../paycash/paycash.service";
//
//
// let MEMBERTEST=[{
//   "id": 2,
//   "owner": 1,
//   "user": 3,
//   "balance": 88,
//   "date_joined": "2017-01-07 14:04:20",
//   "username": "buyer"}]
//
// let MEMBERINFOUPDATE = [
//   {
//     "id": 2,
//     "owner": 1,
//     "user": 3,
//     "balance": 98
//   }
// ]
//
// @Injectable()
// export class PaymemberService{
//   httpUtils: HttpUtils;
//   balanceSub:Subject<MemberInfoUpdateReq> = new Subject<MemberInfoUpdateReq>()
//
//   constructor(private http:Http){
//     this.httpUtils = new HttpUtils(http);
//
//   }
//
//   getMemberInfoTest(){
//     Observable.create((subscriber:any)=>{subscriber.next(MEMBERTEST)})
//       .subscribe(
//         (x:Member[])=>{this.balanceSub.next(x[0])},
//         // (err:Error)=>{this.balanceSub.next(-1)}
//     )
//   }
//
//   // getMemberInfo(){
//   //   let username = localStorage.getItem("username");
//   //   this.httpUtils.GetWithToken<Member[]>("http://172.18.0.4/api/data/member/?username="+username+"&format=json")
//   //     .filter(x=>x!=undefined && x.length==1).subscribe(
//   //     x=>{this.balanceSub.next(x[0])},
//   //     // err=>{this.balanceSub.next(-1)}
//   //   )
//   // }
//
//
//   // updateMemberInfo(req: MemberInfoUpdateReq){
//   //   let id: number = req.id;
//   //   return this.httpUtils.PutWithToken<MemberInfoUpdateReq>("http://172.18.0.4/api/data/member/edit/"+id+"/",req ).catch(this.handleError);
//   // }
//
//   // private handleError(error: Response | any){
//   //   let errMsg: string;
//   //   if(error instanceof Response){
//   //     const body = error.json() || '';
//   //     const err = body.error || JSON.stringify(body);
//   //     // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
//   //     errMsg = "货道未设置";
//   //   }else{
//   //     errMsg = error.message?error.message:error.toString();
//   //   }
//   //   console.error(errMsg);
//   //   return Observable.throw(errMsg);
//   // }
// }
