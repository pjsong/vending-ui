
import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable, of} from "rxjs";
import {map, flatMap,catchError} from "rxjs/operators"
import {CashboxTaskRet} from "./paycash/paycash.service";
import {MainButton} from "../home-default-button/default-button.service";
import {HttpUtils} from "../common/http-util";
import {environment as env} from "../../environments/environment"

let OrderTaskTestRet = {"user":1, "slot":9, "product":1,"itemCount":2, "payType":0, "status":2, "totalPaid": 29,"changeLeft": 100};

export class OrderTaskRet{
  user:number; slot:number; product:number; item_count:number;  pay_type:number; status:number;
  total_paid:number; change_left: number;controlboard_input_id:number;
  constructor(){}
}


export class BuyTask{
  orderTasks: OrderTask[] = [];
  addToBuyTask(orderTask:OrderTask){
    this.orderTasks.push(orderTask);
  }
  removeFromBuyTask(orderTask:OrderTask){
    let index = this.orderTasks.indexOf(orderTask);
    if(index > -1){
      this.orderTasks.splice(index,1);
    }
  }
  clearAll(){
    this.orderTasks = [];
  }
}

export class OrderTask{
  user: number = 1;
  slot: number;
  product: number;
  product_name: string;
  item_count: number;
  pay_type: number;
  status:number;
  total_paid: number;
  change_left:number;
  coin_left: number;
  slot_no: string;
  constructor(){}
}
export class Product{
  id: number;
  image_list_url: string;
  product_name: string;
  sale_unit_price: number;
  product_summary: string;
  product_desc: string;
  constructor(id: number,image_list_url: string, product_name: string, sale_unit_price: number,  product_summary: string, product_desc: string){
    this.id  = id;this.image_list_url = image_list_url;this.product_name = product_name;
    this.sale_unit_price = sale_unit_price; this.product_summary = product_summary; this.product_desc = product_desc;
  }
}


@Injectable()
export class PaymethodService{
  constructor(private http: Http ){}

  getProductPrice(productUrl:string, productId: number): Observable<Product> {
    if(env.isDev) return of(env.productTest[0] as Product)
    return this.http.get(productUrl + productId +'/?format=json')
      .pipe(map((res:Response)=>res.json() as Product),
      catchError(err=>{return this.handleError(err)}));
  }


  sendOrder(ordermainUrl:string, orderTask: OrderTask):Observable<number>{
    if(env.isDev) return of(env.orderTaskTestRet.controlboard_input_id as number);
    return new HttpUtils(this.http).POST<OrderTaskRet>(ordermainUrl, orderTask)
        .pipe(catchError(err=>{return this.handleError(err)}),map((orderTaskRet:OrderTaskRet)=>orderTaskRet.controlboard_input_id));
  }

  private handleError(error: Response | any){
    let errMsg: string;
    if(error instanceof Response){
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      // errMsg = "货道未设置";
    }else{
      errMsg = error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
