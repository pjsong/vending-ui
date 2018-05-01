
import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {CashboxTaskRet} from "./paycash/paycash.service";
import {MainButton} from "../home-default-button/default-button.services";
import {HttpUtils} from "../common/http-util";

// let BUTTONS = [
//   new MainButton(1, 'http://172.18.0.3/static/images/vendor/front/paymethod/money-icon-58243.png', '现金支付', '../paycash')
//   ,new MainButton(2,'http://172.18.0.3/static/images/vendor/front/paymethod/wechat.png','微信支付', '../payweixin')
//   ,new MainButton(3,'http://172.18.0.3/static/images/vendor/front/homepage/membership.png','会员支付', '../paymember')
// ]
export const BUTTONSTEST =
    [
      {"id":1, "imgUrl":"http://172.18.0.3/static/images/vendor/front/paymethod/money-icon-58243.png","buttonTxt":"现金支付","linkTarget":"../paycash"},
      {"id":2, "imgUrl":"http://172.18.0.3/static/images/vendor/front/paymethod/wechat.png","buttonTxt":"微信支付","linkTarget":"../payweixin"},
      {"id":3, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/membership.png","buttonTxt":"会员支付","linkTarget":"../paymember"},
    ]

let ProductTest = [
  {"id":1,"imageListUrl":"http://172.18.0.3/static/images/vendor/front/604.jpeg",
    "productName":"避孕套","saleUnitPrice":9,"productSummary":"避孕套避孕套","productDesc":"避孕套避孕套避孕套"},
]
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
    return this.http.get(productUrl + productId +'/?format=json')
      .map((res:Response)=>res.json() as Product)
      .catch(err=>{return this.handleError(err)});
      // .timeout(timeoutSet, "getProductPrice "+timeoutTip)
      // .catch(error=>Observable.of(ProductTest[0]));
  }


  sendOrder(ordermainUrl:string, orderTask: OrderTask){
    return new HttpUtils(this.http).POST<OrderTaskRet>(ordermainUrl, orderTask)
        // .timeout(timeoutSetCashbox, "sendOrder "+timeoutTip)
        .catch(err=>{return this.handleError(err)});
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
