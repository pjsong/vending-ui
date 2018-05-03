import {Component, OnInit} from '@angular/core';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import {Router, ActivatedRoute} from "@angular/router";

import {PaymethodService, Product, OrderTask, BuyTask} from "./paymethod.service";
import {HomeService} from "../home/home.service";
import {SlotStatus, Cart, ProductOrder} from "../slotselect/slotselect.service";
import {MainButton} from "../home-default-button/default-button.services";
import {ConfService} from "../home/conf.service";
import {Observable} from "rxjs";


@Component({
  selector: 'paymethod',
  templateUrl: './paymethod.component.html',
  styleUrls: ['./paymethod.component.scss'],
})

export class Paymethod implements OnInit{
  defaultWaiting:number = 30;
  productUrl:string;
  ordermainUrl:string;
  needToPay: string;
  needToPayAmount:number=0;
  cmdStart: string = "";
  cmdStop: string="";
  retTxt:string = "返回首页";
  timeoutMsg:string;
  mainButtons: MainButton[];
  buyTask: BuyTask = new BuyTask();

  constructor(private route: ActivatedRoute, private router:Router, private service: ConfService,
              private paymethodService:PaymethodService, private homeService: HomeService){
    this.buyTask.clearAll();
  }

  doWhenOnline(){
    this.service.getPayButton().subscribe(x=> this.mainButtons = x);
    let cart = JSON.parse(localStorage.getItem("cart")) as Cart;
    this.service.getProductUrl().do(x=>this.productUrl=x).subscribe(x=>{
        Observable.from(cart.productOrders).flatMap(productOrder=>{return this.productRetrive(productOrder)})
          .subscribe(
            (orderTask:OrderTask)=>{
              this.needToPayAmount += orderTask.total_paid;
              this.needToPay = "需要支付 " + this.needToPayAmount+" 元";
              this.buyTask.addToBuyTask(orderTask);
              return console.log("productOrder retrieved" + JSON.stringify(orderTask))},
            err=>console.log(err),
            ()=>{
              console.log("buyTask init finished");
              localStorage.setItem("buyTask", JSON.stringify(this.buyTask));
            }
          );
      }
    );
  }

  ngOnInit(){
    this.service.getPaymethodDefaultWaiting().subscribe(x=>{
      if(!isNaN(+x)) {
          this.defaultWaiting = +x;
      }
      this.homeService.setPageWaiting('paymethod->ngOnInit', this.defaultWaiting);
    });
    this.service.getOrdermainUrl().subscribe(x=>this.ordermainUrl=x);
    this.service.initWXPayConnection().timeoutWith(2000, Observable.throw(new Error('TimeoutError')))
      .catch(err=>{
        if(err.name == 'TimeoutError'){
          this.timeoutMsg = '网络超时';
        }else{
          console.log('initWXPayConnection err:' + err.name);this.timeoutMsg = '网络连接异常';
        }
        this.homeService.setPageWaiting('paymethod->ngOninit->initWXPayConnection', 5);
        return Observable.throw(err);})
      .subscribe(x=>{
        this.doWhenOnline();
      });
  }

  productRetrive(productOrder:ProductOrder){
    let slotStatus = productOrder.slotStatus;
    let productId = productOrder.product;
    return this.paymethodService.getProductPrice(this.productUrl, productId).map(
      (data:Product)=>{
        let itemCount = Number(productOrder.itemCnt)
        let orderTask:OrderTask = new OrderTask();
        orderTask.slot = +slotStatus.slot_no;
        orderTask.slot_no = slotStatus.slot_no;
        orderTask.product = productId;
        orderTask.product_name = data.product_name;
        orderTask.item_count= itemCount;
        orderTask.total_paid = data.sale_unit_price*itemCount;
        return orderTask;
      },
      (error:any)=>{this.needToPay = error});
  }
}
