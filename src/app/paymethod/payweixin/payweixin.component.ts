import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../home/home.service";
import {PaymethodService, OrderTask, BuyTask, OrderTaskRet} from "../paymethod.services";
import {TimeVars, PaycashService} from "../paycash/paycash.service";
import {ConfService} from "../../home/conf.service";
import {Observable, Subscription, Subject} from "rxjs";
import {Cart} from "../../slotselect/slotselect.service";
import {SlotUpdateReq, SlotUpdateService} from "../../vendor-management/slotupdate/slotupdate.services";
import {PayweixinService, VendingConf, WXPollRet, WXPayParams} from "./payweixin.service";
import {VendingStatus} from "../../home-default-button/default-button.services";

// let wxPayServerUrlParam = "width=200&height=200&termNo=spring001&slotNo=001&productName=傲咪迪-甜蜜蜜&totalFee=10&timestamp=14562&nonce=1&signature=83ACD4DD2F1B448553AEF2F48B464AE9";

@Component({
  selector: 'payweixin',
  template: './payweixin.component.html',
  styleUrls: ['./payweixin.component.scss']
})
export class Payweixin implements OnInit{
  timeVars:TimeVars;
  waitingCnt:number;
  wxPayPollUrl: string;

  vendingConfUrl: string;
  controlboardLogUrl:string;
  orderMainUrl:string;
  slotStatusUrl:string;

  buyTask: BuyTask;
  wxPayParams: WXPayParams;// = new WXPayParams();
  // showPngQR: string;
  intervalSource$:any;
  timeCounterSubs: Subscription;
  intervalSourceSubscription: Subscription;
  countdownSubjSubscription: Subscription;
  countdownSubj:Subject<number> = new Subject<number>();

  transactionStatus: string = "started";
  orderTaskCmdSend: boolean = false;
  tipMessage: string;
  totalPrice: number = 0;
  slotNoConcate: string = '';
  productConcate: string = '';
  retDisabled:boolean = false;
  payingTipMessage: string;
  retTxt:string="返回支付方式";
  retAddress:string="./paymethod";
  timeoutMsg:string;

  public constructor(private homeService: HomeService,
                     private slotUpdateService: SlotUpdateService,
                     private paymethodService:PaymethodService,
                     private paycashservice: PaycashService,
                     private paywxservice: PayweixinService,
                     private confService:ConfService) {
  }

  doWhenOnline(){
    let vendingstatus: VendingStatus = JSON.parse(localStorage.getItem("vendingstatus"));
    let deviceOk: boolean = vendingstatus.omddevice == 'ok' && vendingstatus.controlboardstatus == 'ok';
    if(!deviceOk ){
      this.tipMessage = "机器故障,请选择其他支付方式";
      this.retTxt = "返回支付方式";
      this.retAddress = "paymethod";
      return;
    }
    this.confService.getPaywxTimeVars().do((timevar:any)=>this.timeVars = timevar).subscribe((timevar:any)=>{
      this.homeService.setPageWaiting('paywx', this.timeVars.timeWithoutPay);
      this.confService.getControlBoardUrl().do((x:any)=>this.controlboardLogUrl=x).subscribe((x:any)=>console.log(this.controlboardLogUrl));
      this.confService.getOrdermainUrl().do((x:any)=>this.orderMainUrl=x).subscribe((x:any)=>console.log(this.orderMainUrl));
      this.confService.getSlotStatusUrl().do((x:any)=>this.slotStatusUrl=x).subscribe((x:any)=>console.log(this.slotStatusUrl));

      this.intervalSource$ = Observable.interval(this.timeVars.queryInterval).takeWhile(val => this.waitingCnt > this.timeVars.timeJumpToFinish);
      this.timeCounterSubs = this.homeService.waitingCnt$.do(x=>this.waitingCnt = x).subscribe(wc=>{
        if(!this.countdownSubjSubscription){
          console.log("this.countdownSubjSubscription registing")
          this.countdownSubjSubscription = this.countdownSubj.asObservable().subscribe((waitingCnt=>this.getMessage(waitingCnt)));
        }
        this.countdownSubj.next(wc);
      });

      this.buyTask = JSON.parse(localStorage.getItem("buyTask")) as BuyTask;
      if(this.buyTask.orderTasks.length == 0){
        this.homeService.setPageWaiting('paycash->buyTaskZero', 1);
      }
      this.buyTask.orderTasks = this.buyTask.orderTasks.map((orderTask:OrderTask)=>{
        orderTask.pay_type =1;
        orderTask.status= 2;
        orderTask.user=1;
        this.totalPrice += orderTask.total_paid;
        if(this.slotNoConcate.length + orderTask.slot_no.length<30){
          this.slotNoConcate += orderTask.slot_no + '-';
        }
        if(this.productConcate.length + orderTask.product_name.toString().length <30){
          this.productConcate += orderTask.product_name+ '-';}
        return orderTask;
      });

      this.confService.getVendingConfUrl().do((vendingConfUrl:string)=>this.vendingConfUrl=vendingConfUrl).subscribe(vendingConfUrl=>{
        console.log("getVendingConfUrl() " + vendingConfUrl);
        this.paywxservice.getVendingConf(vendingConfUrl).subscribe(
          (vendingconf:VendingConf)=>{
            console.log("vendingConf: " + JSON.stringify(vendingconf));
            this.confService.getWXPayServer().subscribe(wxPayUrl=>{
              console.log("getWXPayServer(): " + wxPayUrl);
              this.wxPayParams = this.paywxservice.getImgUrl(wxPayUrl, vendingconf, this.slotNoConcate, this.productConcate, this.totalPrice);
              console.log("getImgUrl(): " + JSON.stringify(this.wxPayParams));
              this.confService.getWXPayPollUrl().subscribe(url=>{
                this.wxPayPollUrl = url;
              });
            });
          }
        );
      });
    });
  }

  ngOnInit(){
    this.confService.initWXPayConnection().timeoutWith(2000, Observable.throw(new Error('TimeoutError')))
      .catch(err=>{
        if(err.name == 'TimeoutError'){
          this.timeoutMsg = '网络超时';
        }else{
          console.log('initWXPayConnection err:' + err.name);this.timeoutMsg = '网络连接异常';
        }
        this.homeService.setPageWaiting('paymethod->ngOninit->initWXPayConnection', 5);
        return Observable.throw(err);})
      .subscribe((x)=>{
      this.doWhenOnline();
      })
  }

  startTrx(){
    this.intervalSourceSubscription = this.intervalSource$
      .flatMap((x:any)=>{
        console.log("wx toll operate interval start: " +x);
        return this.paywxservice.toll(this.wxPayPollUrl, this.wxPayParams)})
      .subscribe((dataRet:WXPollRet)=> {
          console.log(dataRet.result);
          if(dataRet.result == 'SUCCESS'){
            this.transactionStatus = "paid";
          }
        }
      );
  }

  getMessage(waitingCnt:number){
    if(waitingCnt > this.timeVars.timeJumpToFinish && this.transactionStatus!="started"){
      this.payingTipMessage = "";
      if(this.transactionStatus == "delivered"){
        this.tipMessage = "交易成功,欢迎下次光临";
        this.homeService.setPageWaiting('paycash->timeJumpToFinish', this.timeVars.timeJumpToFinish);
      }else if(this.transactionStatus == "paid"){
        this.tipMessage = "支付成功, 正在出货, 请稍候";
        this.retDisabled = true;
        this.homeService.setPageWaiting('paycash->timeJumpToFinish', this.timeVars.timeWithPay);
        if(!this.orderTaskCmdSend){
          this.orderTaskCmdSend = true;
          this.sendOrder();
          this.firstUnSubscribe();
          console.log("now first unsubscribed");
        }
      }
      return;
    }
    //waitingCnt >=timeStartAlert
    if(waitingCnt > this.timeVars.timeStartAlert && this.transactionStatus == "started"){
      this.tipMessage = "需要支付"+ this.totalPrice + "元; 请微信扫描屏幕二维码";
      return;
    }
    if( waitingCnt==this.timeVars.timeStartAlert && this.transactionStatus == "started") {
      this.tipMessage = "交易即将中止, 请立即点击屏幕刷新时间";
      this.payingTipMessage = "";
      return;
    }
    if(waitingCnt == this.timeVars.timeAlertEnd-1 && this.transactionStatus == "started") {
      this.tipMessage = "交易已终止";
      this.transactionStatus = "aborted";//disable barQR image
      return;
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish-2){
      this.lastUnSubscribe();
    }
  }

  firstUnSubscribe(){
    if(this.intervalSourceSubscription)this.intervalSourceSubscription.unsubscribe();
  }
  lastUnSubscribe(){
    if(this.countdownSubjSubscription)this.countdownSubjSubscription.unsubscribe();
  }

  sendOrder(){
    let productOrders = (JSON.parse(localStorage.getItem("cart")) as Cart).productOrders;
    Observable.from(productOrders).flatMap(productOrder=>{
      let su:SlotUpdateReq = new SlotUpdateReq();
      let slotStatus = productOrder.slotStatus;
      su.slot_no = slotStatus.slot_no;
      su.before_item_num = slotStatus.current_item_num;
      su.variation_num = -productOrder.itemCnt;
      su.current_item_num = slotStatus.current_item_num - productOrder.itemCnt;
      su.running_status="1";
      return this.slotUpdateService.slotCreate(this.slotStatusUrl, su);
    }).subscribe(x=>console.log("slotUpdateReturned: " + x));

    let sendTaskSub:Subject<number> = new Subject<number>();

    let sendTaskSub$:Subscription = sendTaskSub.asObservable()
      .subscribe(indexOfOrderTask=>{
        let orderTask = this.buyTask.orderTasks[indexOfOrderTask];
        console.log("indexOfOrderTask: " + indexOfOrderTask + '\norderTask' + JSON.stringify(orderTask));
        this.paymethodService.sendOrder(this.orderMainUrl, orderTask)
          .map((orderTaskRet:OrderTaskRet)=>orderTaskRet.controlboard_input_id)
          .subscribe(
            controlboardInputId=>{
              console.log("now querying controlboardInputId: "+ controlboardInputId);
              let orderIntervalSource$ = Observable.interval(this.timeVars.queryInterval)
                .takeWhile(val=> this.transactionStatus == "paid")
                .flatMap(x=>{
                  return this.paycashservice.orderTaskSendLog(this.controlboardLogUrl, controlboardInputId)})
                .subscribe((dataRet:any)=> {
                  orderIntervalSource$.unsubscribe();
                  console.log("this.buyTask.orderTasks.length"+this.buyTask.orderTasks.length + "?=" + indexOfOrderTask);
                  if(indexOfOrderTask == this.buyTask.orderTasks.length-1){
                    this.transactionStatus = "delivered";
                    console.log("orderIndex query returned and finished");
                  }else{
                    setTimeout(()=>{
                      sendTaskSub.next(indexOfOrderTask+1);
                    }, 5000);

                    console.log("orderIndex query returned: "+ indexOfOrderTask);
                  }
                });
            });
      });
    sendTaskSub.next(0);
  }

  onCmdClicked(cmdNum: string){
    console.log(cmdNum)
    this.firstUnSubscribe();
    this.lastUnSubscribe();
  }
}
