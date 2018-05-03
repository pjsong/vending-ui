import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, Response} from "@angular/http";
import {Observer} from "rxjs";
import {Environment as env} from "../environments/environment"

export class ProductOrder{
  slotStatus: SlotStatus;
  product: number;
  itemCnt: number;
  constructor(slotStatus: SlotStatus, itemCnt:number, product:number){
    this.slotStatus = slotStatus; this.itemCnt = itemCnt;this.product = product;
  }
}

export class Cart{
  productOrders: ProductOrder[] = [];

  addToCart(productOrder: ProductOrder){
    if(this.productOrders.length<3) {
      if (!this.productOrders.some(po => po.slotStatus.id == productOrder.slotStatus.id)) {
        this.productOrders.push(productOrder);
      }else{
        this.productOrders.map(po=>{
          if(po.slotStatus.id == productOrder.slotStatus.id){
            po.itemCnt+=productOrder.itemCnt;
          }
        });
      }
    }
  }
  removeFromCart(productOrder:ProductOrder){
    let index = this.productOrders.indexOf(productOrder);
    if(index > -1){
      console.log("removeFrmCart Index "+ index);
      this.productOrders.splice(index, 1);
    }
    console.log(this.productOrders.length)
  }
  clearAll(){
    this.productOrders = [];
  }
}

export class SlotStatus{
  id: number;
  running_status: string;
  before_item_num: number;
  variation_num: number;
  current_item_num: number;
  malfunction_report_count: number;
  slot_no: string;
  user:number;
  create_time:string;
  update_time:string;
  // constructor(){}
  constructor(id: number,slot: number, running_status: string, before_item_num: number, variation_num: number, current_item_num: number,  malfunction_report_count: number, slot_no: string){
    this.id  = id;this.running_status = running_status;this.slot_no = slot_no; this.before_item_num = before_item_num;
    this.variation_num = variation_num; this.current_item_num = current_item_num; this.malfunction_report_count = malfunction_report_count;
  }
}

export class Slot{
  id: number;
  vending_machine: number;
  product: number;
  slot_no: string;
  capacity: number;
  controll_type: string;
  constructor(id: number, vending_machine: number, product: number,slot_no: string, capacity: number, controll_type: string){
    this.id =id;this.vending_machine = vending_machine; this.product = product; this.slot_no = slot_no;
    this.capacity = capacity; this.controll_type = controll_type;
  }
}



@Injectable()
export class SlotSelectService {
  constructor(private http: Http ){}

  slotselect(slotStatusUrl:string, slotNo: number): Observable<SlotStatus> {
    if(env.isDev){
      return Observable.of(env.slotStatusTest[slotNo-1] as SlotStatus)
    }
    let reqStr = slotStatusUrl + '?format=json&slotNo=' + slotNo;
    console.log(reqStr);
    return this.http.get(reqStr)
      .map((res:Response)=>{console.log(res.json);return res.json() as SlotStatus[];})
      .map((slotstatus: SlotStatus[])=>{console.log(JSON.stringify(slotstatus));return slotstatus[0]})
      // .timeout(timeoutSet, "slotselect "+timeoutTip)
        .catch((err:any)=>{
            return this.handleError(err);
        // return Observable.of(slotStatusTest[slotNo-1] as SlotStatus).catch(error=>this.handleError(error))
          }
      )
  }

  getSlotProduct(slotUrl: string, slotNo: number): Observable<Slot>{
    if(env.isDev){
      console.log(slotNo);
      return Observable.of(env.slotProduct[slotNo-1] as Slot);
    }
    let reqStr = slotUrl + slotNo+'/?format=json';
    console.log(reqStr);
    return this.http.get(reqStr)
      .map((res:Response)=>res.json() as Slot)
      .catch((err:any)=>{
          return this.handleError(err);
        }
      );
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

