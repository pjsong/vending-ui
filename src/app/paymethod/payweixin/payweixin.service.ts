import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, Response,} from "@angular/http";
import {HttpUtils} from "../../common/http-util";
import {Observable} from "rxjs";
import * as CryptoJS from "crypto-js"

export class VendingConf{
  slug:string;sec:string;vm_type:number;charger:number;product_category:number[];
  charger_tel:string;install_address:string;install_time:string;alive_time:string;
  constructor(){}
}

export class WXPollRet{
  result: string;
  constructor(){}
}
export class WXPayTimeVars{
  timeWithPay: number;
  timeWithoutPay: number;
  timeStartAlert: number;
  timeAlertEnd: number;
  timeJumpToFinish: number;
  queryInterval: number;
  constructor(){}
}
export class WXPayParams{
  termNo:string;
  slotNo:string;
  timestampstr:string;
  sec:string;
  randomstr: string;
  sign: string;
  imgUrl: string;
  constructor(){}
}


export const WXTIMEVARS={"timeWithPay":60,"timeWithoutPay":120,"timeStartAlert":30,"timeAlertEnd":15,
  "timeJumpToFinish":5,"queryInterval":2000};
export const VENDING=
  [
    {
      "slug": "pjsong-spring001-001",
      "sec": "7QL8YYGJy4uFK02YUT4Rl6ay1dihh502fQqV44ZNApx",
      "vmType": 1,
      "charger": 1,
      "productCategory": [
        1
      ],
      "chargerTel": "13509205735",
      "installAddress": "jjj",
      "installTime": "2016-12-27 12:31:00",
      "aliveTime": "2016-12-27 12:31:00"
    }
  ];
@Injectable()
export class PayweixinService {
  httpUtils:HttpUtils;
  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }
  getVendingConf(vendingConfUrl:string): Observable<VendingConf>{
    let urlAddr =  vendingConfUrl;
    return this.http.get(vendingConfUrl).map(x=>x.json() as VendingConf[]).filter(x=>x.length>0).map(x=>x[0]);
    // return Observable.of(VENDING).filter(x=>x.length>0).map(x=>x[0]);
    // .catch(this.handleError)});
  }

  getRandom(): string{
    return Math.floor((Math.random()*100000000) +1)+'';
  }

  getImgUrl(confurl: string, vendingConf: VendingConf, slotNoConcate:string, productConcate:string, totalPrice: number) :WXPayParams {
    console.log("getImgUrl: " + slotNoConcate + ';' + productConcate + ';' + totalPrice +'\n');
      let timestampstr = new Date().getTime().toString();
      let randomstr = this.getRandom();
      let sec = vendingConf.sec;

      let strArr = [timestampstr,randomstr,sec];
      strArr.sort();
      let strArrConc:string = strArr.reduce((acc,val)=>acc+val);
      let sign = CryptoJS.createHash('md5').update(strArrConc).digest('hex').toUpperCase();
      let ele1:string = 'termNo='+vendingConf.slug;
      let ele2:string = 'slotNo=' + slotNoConcate;
      let ele3:string = 'productName=' + productConcate;
      let ele4:string = 'totalFee=' + totalPrice*100;
      let ele5:string = 'timestamp='+ timestampstr;
      let ele6:string = 'nonce='+randomstr;
      let ele7:string = 'width=200';
      let ele8:string = 'height=200';
      let ele9:string = 'sign='+sign;

      let newArr = [ele1,ele2,ele3,ele4,ele5,ele6,ele7,ele8,ele9]
      let rettemp:string = newArr.reduce((acc,val)=>acc+'&'+val);
      let ret:string = confurl+'?'+rettemp;
      console.log("confurl: " + ret);
      let params:WXPayParams = new WXPayParams();
      params.termNo = vendingConf.slug;
      params.sec = sec;
      params.imgUrl = ret;
      params.randomstr = randomstr;
      params.sign = sign;
      params.slotNo = slotNoConcate;
      params.timestampstr=timestampstr;
      return params;
  }

  toll(tollUrl:string, wxPayParams:WXPayParams):Observable<WXPollRet>{
    // return Observable.of(ct);
    let paramstr = '?termNo='+wxPayParams.termNo+'&slotNo='+wxPayParams.slotNo+'&timestamp='+wxPayParams.timestampstr;
    paramstr = paramstr + '&nonce='+wxPayParams.randomstr+'&sign=' + wxPayParams.sign;
    return this.http.get(tollUrl+paramstr).map((res:Response)=>res.json() as WXPollRet);
    //   .map(data=>data[0].outputDesc[0])
    //   .filter(data=>data.length>0)
    //   .catch(this.handleError);
  }
}
