import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, of} from "rxjs";
import {map,flatMap} from "rxjs/operators";
import {HttpUtils} from "../../common/http-util";
import {ConfService} from "../../home/conf.service";
import { Environment as env} from "../../environments/environment"

export class ChargeCoinReq{
  "amount_before": number;
  "amount_data": number;
  // constructor(amount_before: number,
  // amount_data: number){this.amount_before=amount_before;this.amount_data=amount_data}
}
export class ChargeCoinRet{
  "id": number;
  "user": number;
  "amount_before": number;
  "amount_data": number;
  "amount_after": number;
  "create_time": string;
  constructor(id: number,user: number, amount_before: number, amount_data: number,
  amount_after: number, create_time: string){
    this.id=id;this.user=user;
    this.amount_after=amount_after;this.amount_before=amount_before;this.amount_data=amount_data;this.create_time=create_time}
}




@Injectable()
export class ChargeCoinService{
  constructor(private http: Http, private confService: ConfService ){}
  getDeviceUrl(){
    if(env.isDev) return of(env.coinchangelogUrl);
    return this.http.get(env.confUrlPrefix+"confname=coinlog").pipe(map(x=>x.json()),
        map(x=>x[0].conf_value));
  }

  // coinUpdateTest(deviceUrl:string, cc: ChargeCoinReq):Observable<ChargeCoinReq>{
  //   let testData:Observable<ChargeCoinReq> = Observable.create((subscriber:any)=>{subscriber.next(CHARGECOINRET[0])});
  //   return testData;
  // }
  coinCreateWithUrl(cc: ChargeCoinReq): Observable<ChargeCoinReq>{
    return this.confService.getCoinChangePostUrl().pipe(flatMap(x=>this.coinCreate(x, cc)));
  }

  coinCreate(coinChangePostUrl:string, cc: ChargeCoinReq): Observable<ChargeCoinReq>{
    console.log(cc);
    let retData:number = cc.amount_data;
    if(env.isDev) return of(env.chargeCoinRet[0]);
    return new HttpUtils(this.http).POSTWithToken<ChargeCoinReq>(coinChangePostUrl, cc)
        // .timeout(timeoutSetCashbox, "coinUpdate"+timeoutTip);
        // catch(this.handleError));
  }

  coinGetWithUrl(){
    return this.confService.getCoinChangeLogUrl().pipe(flatMap(x=>this.coinGet(x)))
  }

  coinGet(coinChangeLogUrl:string): Observable<ChargeCoinRet[]>{
    if(env.isDev) return of(env.chargeCoinRet);
    return this.http.get(coinChangeLogUrl).pipe(map((res:Response)=>res.json() as ChargeCoinRet[]))
  }

  private handleError(error: Response | any){
    let errMsg: string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = "更新失败";
    }else{
      errMsg = error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
