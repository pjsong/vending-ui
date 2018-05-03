import {Component, OnInit} from '@angular/core';
import {
  PaycashService, CashboxLog, CashboxTaskRet,
  PaycashVars, TimeVars
} from "./paycash.service";
import {HomeService} from "../../home/home.service";
import {Observable, Subscription, Subject} from "rxjs";
import {ChargeCoinService, ChargeCoinRet, ChargeCoinReq} from "../../vendor-management/chargecoin/chargecoin.services";
import {PaymethodService, BuyTask, OrderTask, OrderTaskRet} from "../paymethod.service";
import {SlotUpdateReq, SlotUpdateService} from "../../vendor-management/slotupdate/slotupdate.services";
import {ConfService} from "../../home/conf.service";
import {Cart} from "../../slotselect/slotselect.service";
import {VendingStatus} from "../../home-default-button/default-button.services";
import {Environment as env} from "../../environments/environment"

const only20DownSupport = 20;
const only50DownSupport = 50;
const leftToPayThreshold = -9;

@Component({
  selector: 'paycash',
  templateUrl: './paycash.component.html',
  styleUrls: ['./paycash.component.scss']
})

export class Paycash implements OnInit{
  timeVars:TimeVars;
  paycashVars: PaycashVars;

  deviceUrl:string;
  deviceLogUrl:string;
  controlboardLogUrl:string;
  orderMainUrl:string;
  slotStatusUrl:string;
  chargeCoinReq = new ChargeCoinReq();

  waitingCnt:number;
  changeVerified: boolean = false;
  orderTaskCmdSend: boolean = false;
  productDelievered: boolean = false;
  tipMessage: string;
  changeTipMessage: string;
  payingTipMessage: string;
  totalPaid: number = 0;
  totalPaidout: number = 0;
  changeLeft:number = 0;

  cmdStart:string =  "开始购买";
  cmdStop:string = "取消购买";
  cmdDisplay:boolean = false;
  retDisabled:boolean = false;
  retTxt:string = "返回";
  retAddress: string = "/default-button";
  totalPrice: number = 0;
  lastLogId: number = -1;

  buyTask: BuyTask;
  intervalSource$:any;

  tollRetSubj:Subject<number> = new Subject<number>();
  countdownSubj:Subject<number> = new Subject<number>();

  timeCounterSubs: Subscription;
  intervalSourceSubscription: Subscription;
  countdownSubjSubscription: Subscription;
  terminateSubscription: Subscription;
  currentPayoutAvailableSubscription:Subscription;

  public constructor(private service: PaycashService,
                     private paymethodService:PaymethodService,
                     private coinService: ChargeCoinService,
                     private slotUpdateService: SlotUpdateService,
                     private homeService: HomeService,
                     private confService: ConfService) {
  }

  ngOnInit(){
    let vendingstatus: VendingStatus = JSON.parse(localStorage.getItem("vendingstatus"));
    if(env.isDev) vendingstatus = env.vendingStatus;
    console.log(vendingstatus);
    let deviceOk: boolean = vendingstatus.omddevice.toLowerCase() == 'ok' && vendingstatus.cashboxstatus.toLowerCase() == 'ok'
      && vendingstatus.coinmachinestatus.toLowerCase() == 'ok' && vendingstatus.controlboardstatus.toLowerCase() == 'ok';
    if(!deviceOk ){
      this.tipMessage = "机器故障,请选择其他支付方式";
      this.retTxt = "返回支付方式";
      this.retAddress = "paymethod";
      return;
    }
    this.confService.getPaycashVars().do((x:any)=>this.paycashVars = x).subscribe((x:any)=>{return console.log('ngOnInit:' + this.paycashVars)});
    this.confService.getDeviceUrl().do((x:any)=>this.deviceUrl = x).subscribe((x:any)=>{return console.log('ngOnInit:' + this.deviceUrl)});
    this.confService.getControlBoardUrl().do((x:any)=>this.controlboardLogUrl=x).subscribe((x:any)=>console.log('ngOnInit:' + this.controlboardLogUrl));
    this.confService.getOrdermainUrl().do((x:any)=>this.orderMainUrl=x).subscribe((x:any)=>console.log('ngOnInit:' + this.orderMainUrl));
    this.confService.getSlotStatusUrl().do((x:any)=>this.slotStatusUrl=x).subscribe((x:any)=>console.log('ngOnInit:' + this.slotStatusUrl));

    this.confService.getPaycashTimeVars().do((x:any)=>this.timeVars = x).subscribe((x:any)=>{
      this.homeService.setPageWaiting('paycash', this.timeVars.timeWithoutPay);
      this.confService.getDeviceLogUrl().do((x:any)=>this.deviceLogUrl=x).subscribe((x:any)=>{
        this.currentPayoutAvailableSubscription = this.service.getCurrentPayoutAvailable(this.deviceLogUrl).subscribe(
          (cashboxLogList:CashboxLog[])=>{return this.doCurrentPayoutCheck(cashboxLogList)},
          (error:any)=>{return this.tipMessage = error;})
      });
      this.intervalSource$ = Observable.interval(this.timeVars.queryInterval).takeWhile(val => this.waitingCnt > this.timeVars.timeJumpToFinish);
      this.timeCounterSubs = this.homeService.waitingCnt$.do(x=>this.waitingCnt = x).subscribe(wc=>{
        if(!this.countdownSubjSubscription){
          console.log("this.countdownSubjSubscription registing")
          this.countdownSubjSubscription = this.countdownSubj.asObservable().subscribe((waitingCnt=>this.getMessage(waitingCnt)));
        }
        this.countdownSubj.next(wc);
      });
    });
  }

  sendOrder(){
    console.log("coinLeft before sendOrder: " + this.chargeCoinReq.amount_before + ":" + this.chargeCoinReq.amount_data);
    if(this.chargeCoinReq.amount_data<0){
      this.coinService.coinCreateWithUrl(this.chargeCoinReq).subscribe(x=>console.log("chargeCoinReqUrl" + "coinChangeReturned: " + JSON.stringify(x)));
    }

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
    }).subscribe(x=>console.log("slotStatusUrl: "+this.slotStatusUrl + "\nslotUpdateReturned: " + JSON.stringify(x)));
    let sendTaskSub:Subject<number> = new Subject<number>();

    let sendTaskSub$:Subscription = sendTaskSub.asObservable()
      .subscribe(indexOfOrderTask=>{
        console.log("stopped here")
        let orderTask:OrderTask = this.buyTask.orderTasks[indexOfOrderTask];
        orderTask.change_left = this.changeLeft;
        orderTask.coin_left = this.chargeCoinReq.amount_before + this.chargeCoinReq.amount_data;
        console.log("why? delme: " + orderTask.change_left)
        console.log("indexOfOrderTask: " + indexOfOrderTask + '\nsend order to ordermain '+ this.orderMainUrl + '\nobj:' + JSON.stringify(orderTask));
        this.paymethodService.sendOrder(this.orderMainUrl, orderTask)
          .map((orderTaskRet:OrderTaskRet)=>orderTaskRet.controlboard_input_id)
          .subscribe(
            controlboardInputId=>{
              console.log("now querying controlboardInputId: "+ controlboardInputId);
              let orderIntervalSource$ = Observable.interval(this.timeVars.queryInterval)
                .takeWhile(val=> this.productDelievered == false)
                .flatMap(x=>{
                return this.service.orderTaskSendLog(this.controlboardLogUrl, controlboardInputId)})
                .subscribe((dataRet:any)=> {
                  orderIntervalSource$.unsubscribe();
                  console.log("this.buyTask.orderTasks.length"+this.buyTask.orderTasks.length + "?=" + indexOfOrderTask);
                  if(indexOfOrderTask == this.buyTask.orderTasks.length-1){
                    this.productDelievered = true;
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

  doCurrentPayoutCheck(cashboxLogList:CashboxLog[]){
    console.log(JSON.stringify(cashboxLogList));
    let cashboxLog = cashboxLogList[0];
    if(Number(cashboxLog.ret_data) < 0){
      this.tipMessage = "机器故障,请选择其他支付方式";
      this.retTxt = "返回支付方式";
      this.retAddress = "paymethod";
    }
    else if(Number(cashboxLog.ret_data) < this.paycashVars.payoutThreshold){
      this.tipMessage = "纸币零钱不足,请选择其他支付方式";
      this.retTxt = "返回支付方式";
      this.retAddress = "paymethod";
    }
    else{
      this.coinService.coinGetWithUrl()
        .subscribe((ccRet:ChargeCoinRet[])=>{
        let x = null;
          if(ccRet.length > 0) x = ccRet[0];
          if(x == null){
            this.tipMessage = "硬币数量未设置,请选择其他支付方式";
            this.retTxt = "返回支付方式";
            this.retAddress = "paymethod";
          }
          else if(x.amount_after < this.paycashVars.payoutCoinThreshold){
            console.log("coinLeft is: " + x.amount_after);
            this.tipMessage = "硬币零钱不足,请选择其他支付方式";
            this.retTxt = "返回支付方式";
            this.retAddress = "paymethod";
          }else{
            this.cmdDisplay = true;
            this.buyTask = JSON.parse(localStorage.getItem("buyTask")) as BuyTask;
            if(this.buyTask.orderTasks.length == 0){
              this.homeService.setPageWaiting('paycash->buyTaskZero', 1);
            }
            this.buyTask.orderTasks = this.buyTask.orderTasks.map((orderTask:OrderTask)=>{
              orderTask.pay_type =0;
              orderTask.status= 2;
              orderTask.user=1;
              this.totalPrice += orderTask.total_paid;
              return orderTask;
            });
            this.changeLeft = cashboxLog.ret_data;
            this.chargeCoinReq.amount_before = x.amount_after;
            this.chargeCoinReq.amount_data = 0;
            if(this.totalPrice <= only20DownSupport){
              this.changeTipMessage = "支持20元及以下面额, 请确认您的零钱足够支付";
            }
            else if(this.totalPrice <= only50DownSupport){
              this.changeTipMessage = "支持50元及以下面额, 请确认您的零钱足够支付"
            }
            else{
              this.startTx();
            }
          }
        });
    }
  }

  getMessage(waitingCnt:number){
    if(!this.changeVerified){
      return;
    }
    let leftToPay = this.totalPrice + this.totalPaidout - this.totalPaid;

    //watingCnt >=timeStartAlert and totalPaid > 0 and -9<=leftToPay<0
    if(waitingCnt > this.timeVars.timeJumpToFinish && leftToPay <= 0 && leftToPay >= leftToPayThreshold){
      this.payingTipMessage = "";
      if(this.productDelievered){
        this.tipMessage = "交易成功,欢迎下次光临";
        this.cmdDisplay = false;
        this.homeService.setPageWaiting('paycash->timeJumpToFinish', this.timeVars.timeJumpToFinish);
      }else{
        this.tipMessage = "正在出货, 请稍候";
        this.homeService.setPageWaiting('paycash->timeJumpToFinish', this.timeVars.timeWithPay);
        if(!this.orderTaskCmdSend){
          this.orderTaskCmdSend = true;
          this.chargeCoinReq.amount_data += leftToPay;
          this.sendOrder();
          this.firstUnSubscribe();
          console.log("now first unsubscribed");
        }
      }
      return;
    }

    //watingCnt >=timeStartAlert and totalPaid > 0 and leftToPay<-9
    if(leftToPay<leftToPayThreshold){
      this.tipMessage = "";
      this.payingTipMessage = "支付成功, 正在找零" + (this.totalPaid -this.totalPrice) + "元";
      return;
    }

    //waitingCnt >=timeStartAlert
    if(waitingCnt > this.timeVars.timeStartAlert && this.totalPaid <= 0){
      this.tipMessage = "需要支付"+ this.totalPrice + "元; 请放入钞票";
      return;
    }
    //watingCnt >=timeStartAlert and totalPaid > 0
    if(waitingCnt > this.timeVars.timeStartAlert && leftToPay>0){
      this.tipMessage = "需要支付"+ this.totalPrice + "元; 已经支付"+this.totalPaid+"元";
      return;
    }

    if( waitingCnt==this.timeVars.timeStartAlert && leftToPay > 0) {
      this.tipMessage = "交易即将中止, 请立即点击屏幕刷新时间";
      this.payingTipMessage = "";
      return;
    }

    if(waitingCnt == this.timeVars.timeAlertEnd-1 && leftToPay > 0) {
      this.tipMessage = "正在中止交易......";
      if(this.changeVerified){
        this.terminateSubscription = this.service.terminate(this.deviceUrl).subscribe(
          (x:CashboxTaskRet)=>{
            console.log("terminationSubscription: " + JSON.stringify(x));
          },
          (error)=>console.log(error));
      }
      return;
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish-1 && this.changeVerified){
      //query payout Available now
      this.service.sendCurrentPayoutAvailable(this.deviceUrl).subscribe(x=>console.log(x));
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish-2){
      this.lastUnSubscribe();
    }
  }


  firstUnSubscribe(){
    if(this.currentPayoutAvailableSubscription)this.currentPayoutAvailableSubscription.unsubscribe();
    if(this.intervalSourceSubscription)this.intervalSourceSubscription.unsubscribe();
  }

  lastUnSubscribe(){
    if(this.countdownSubjSubscription)this.countdownSubjSubscription.unsubscribe();
    if(this.terminateSubscription)this.terminateSubscription.unsubscribe();
  }

  doToll(data:CashboxLog){
    this.homeService.setPageWaiting('paycash->doToll',this.timeVars.timeWithPay);
    this.lastLogId = data.id;
    console.log('doToll ret: '+data);
    let payLeft = this.totalPrice - this.totalPaid;
    if(payLeft>0){
      this.totalPaid += data.ret_data;
      if(data.ret_data == 10 && this.changeLeft<300){
        this.changeLeft += data.ret_data;
      }
    }else{
      this.totalPaidout += data.ret_data;
      this.changeLeft -= 10;
    }
  }

  doOperate(operateId:number){
    console.log("start doOperate: " + operateId);
    this.intervalSourceSubscription = this.intervalSource$
        .flatMap((x:any)=>{console.log("do operate interval start: " +x);return this.service.tollLog(this.deviceLogUrl,this.lastLogId, operateId)})
       .subscribe(
       (dataRet:CashboxLog)=> {
         this.doToll(dataRet);
      }
    );
  }

  startTx(){
    this.homeService.setPageWaiting('paycash->onCmdClicked', this.timeVars.timeWithoutPay);
    this.changeVerified = true;
    this.retDisabled = true;
    this.cmdDisplay = false;
    this.changeTipMessage = "";
    this.tipMessage = "需要支付"+ this.totalPrice + "元; 请放入钞票";
    this.service.toll(this.deviceUrl, this.totalPrice).subscribe(
      (data:CashboxTaskRet)=>{
        console.log("toll operate command ret data: id:" + data.id+",  operateName: "+data.operate_name);
        this.doOperate(data.id)
      },
      (error:any)=>{
        this.tipMessage = error;
      }
    )
  }

  onCmdClicked(cmdNum: string){
    if(cmdNum == "start") {
      this.startTx();
    }else if(cmdNum == "stop") {
      this.homeService.setPageWaiting("paycash->cmdClicked",this.timeVars.timeAlertEnd);
    }
  }
}
