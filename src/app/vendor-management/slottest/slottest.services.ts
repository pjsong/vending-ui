
import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {HttpUtils} from "../../common/http-util";

export class SlotTestReq{
  "slot_no": number;
  "turn_cnt": number;
  constructor(){}
}
export class SlotTestRet{
  "id": number;
  "slot_no": number;
  "turn_cnt": number;
  "create_time":string;
  constructor(){}
}
export class SlotQueryRet{
  "id": number;
  "input": number;
  "output_desc": string;
  "create_time":string;
  constructor(){}
}
let SLOTTEST:SlotTestReq = {
  "slot_no": 9,
  "turn_cnt": 1,
}
// let SLOTTESTRET:SlotTestRet[] = [{
//   "id":20,
//   "slotNo": 9,
//   "turnCnt": 1,
//   createTime:"2017-01-01 01:01:01"
// }]
let SLOTTESTQUERYRET:SlotQueryRet[] = [{
  "id":20,
  "input": 53,
  "output_desc": "[['57', '58', '00', '66', '00', '01', '03', '01', '00', '1a']]",
   "create_time":"2017-01-01 01:01:01"
}]
// let urlPrefix = 'http://localhost:8000/api/data/controlboard/'

@Injectable()
export class SlotTestService{
  constructor(private http: Http ){}

  slotTest(deviceUrl:string, su: SlotTestReq): Observable<SlotTestRet>{
    console.log(su);
    return new HttpUtils(this.http).POST<SlotTestRet>(deviceUrl+"testrun/?format=json", su).catch(error=>Observable.of(SLOTTEST)
      .catch(this.handleError));
  }

  // http://127.0.0.1:8000/api/data/controlboard/outputlist/?inputId=53
  // slotTestQueryTest(inputId:number):Observable<SlotQueryRet[]>{
  //   let testData:Observable<SlotQueryRet[]> = Observable.create((subscriber:any)=>{subscriber.next(SLOTTESTQUERYRET)});
  //   return testData;
  // }

  slotTestQuery(deviceUrl:string, inputId:number): Observable<SlotQueryRet[]>{
    let urlAddr =  deviceUrl + 'outputlist/?inputId='+inputId+"&format=json";
    return this.http.get(urlAddr)
      .map((res:Response)=>res.json() as SlotQueryRet[] || {}).catch(error=>Observable.of(SLOTTESTQUERYRET)
      .catch(this.handleError));
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
