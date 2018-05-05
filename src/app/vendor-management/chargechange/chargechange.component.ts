import {Component, OnInit} from '@angular/core';
import {Subscription, Subject, Observable} from "rxjs";
import {CashboxLog, PaycashService, CashboxTaskRet, TimeVars} from "../../paymethod/paycash/paycash.service";
import {HomeService} from "../../home/home.service";
import {ChargeChangeService} from "./chargechange.services";
import {ConfService} from "../../home/conf.service";
import {VendingStatus} from "../../home-default-button/default-button.services";
import {Environment as env } from "../../environments/environment"

@Component({
  selector: 'chargechange',
  templateUrl: './chargechange.component.html',
  styleUrls: ['./chargechange.component.scss']
})

export class ChargeChange implements OnInit{
  machineStatus: boolean = true;
  timeVars: TimeVars;
  waitingCnt:number;

  deviceUrl:string;
  deviceLogUrl:string;

  amountBefore: number ;
  amountCharging: number = 0;
  lastLogId: number = -1;

  cmdStart:string =  "开始充零钱";
  cmdStop:string = "结束充零钱";
  chargingTipMessage = "";
  retDisabled:boolean = true;
  cmdDisplay:boolean = true;

  currentPayoutAvailableSubscription:Subscription;
  startTollTaskSubscription: Subscription;
  terminateSubscription: Subscription;

  startChargeRetSubjSubscription: Subscription;
  intervalSourceSubscription: Subscription;
  countdownSubjSubscription: Subscription;
  intervalSource$:any;

  //do according to the waiting count
  countdownSubj:Subject<number> = new Subject<number>();
  timeCounterSubs: Subscription;
  startChargeRetSubj:Subject<number> = new Subject<number>();

  public constructor(private homeService: HomeService, private confService:ConfService, private chargeChangeService: ChargeChangeService, private service: PaycashService) {
    this.timeCounterSubs = homeService.waitingCnt$.subscribe(wc=>{
      this.waitingCnt = wc;this.countdownSubj.next(wc);
    });
  }

  ngOnInit(){
    let vendingstatus: VendingStatus = JSON.parse(localStorage.getItem("vendingstatus"));
    if(env.isDev) vendingstatus = env.vendingStatus;
    this.machineStatus = vendingstatus.omddevice == 'ok' && vendingstatus.cashboxstatus == 'ok';
    if(!this.machineStatus){
      this.chargingTipMessage = "纸币器本地服务故障";
      return;
    }
    this.confService.getDeviceUrl().subscribe(x=>{ this.deviceUrl = x;});
    this.confService.getDeviceLogUrl().subscribe(x=>{
      this.deviceLogUrl = x;
      this.currentPayoutAvailableSubscription = this.service.getCurrentPayoutAvailable(this.deviceLogUrl).subscribe(
          (cashboxLogList:CashboxLog[])=> {this.amountBefore = Number(cashboxLogList[0].ret_data)}),
          (error:any)=>{console.log(error);this.chargingTipMessage = "纸币器本地服务故障";
          };
    });

    this.chargeChangeService.getTimeVars().subscribe(x=>{
      console.log(x);
      this.timeVars = x;
      this.homeService.setPageWaiting('chargeChange->ngOnInit', this.timeVars.timeWithoutPay);
      this.intervalSource$ = Observable.interval(this.timeVars.queryInterval)
          .takeWhile(val => this.waitingCnt > this.timeVars.timeJumpToFinish)
          // .takeWhile(val => this.amountCharging+this.amountBefore<300);
      this.countdownSubjSubscription = this.countdownSubj.asObservable().subscribe((waitingCnt=>this.doWaitingCnt(waitingCnt)));
      this.startChargeRetSubjSubscription = this.startChargeRetSubj.asObservable().subscribe((operateId)=>this.doTollRet(operateId));
    });
  }

  doTollRet(operateId:number){
    this.intervalSourceSubscription = this.intervalSource$
        .flatMap((x:any)=>this.service.tollLog(this.deviceLogUrl,this.lastLogId, operateId))
      .subscribe(
        (dataRet:CashboxLog)=> {
          this.doToll(dataRet);
        }
      );
  }

  doToll(data:CashboxLog){
    console.log(data);
    if(data.ret_data > 0){
      this.lastLogId = data.id;
      this.amountCharging += data.ret_data;
      this.homeService.setPageWaiting("chargeChange->doToll", this.timeVars.timeWithPay);
    }
    this.chargingTipMessage = data.ret_data >= 0 ? "充值已成功":"充值已终止";
  }

  firstUnSubscribe(){
    if(this.startChargeRetSubjSubscription)this.startChargeRetSubjSubscription.unsubscribe();
    if(this.currentPayoutAvailableSubscription)this.currentPayoutAvailableSubscription.unsubscribe();
    if(this.startTollTaskSubscription)this.startTollTaskSubscription.unsubscribe();
  }

  lastUnSubscribe(){
    if(this.intervalSourceSubscription)this.intervalSourceSubscription.unsubscribe();
    if(this.countdownSubjSubscription)this.countdownSubjSubscription.unsubscribe();
    if(this.terminateSubscription)this.terminateSubscription.unsubscribe();
  }

  doWaitingCnt(waitingCnt: number){
    if(waitingCnt > this.timeVars.timeStartAlert){
      this.cmdDisplay = true;
      if(this.amountCharging>0){
        if((this.amountBefore + this.amountCharging<300)){//300 is the upper limit
          this.chargingTipMessage = "正在充值...";
          this.retDisabled = true;
        }else{
          this.chargingTipMessage = "充值已完成...";
          this.retDisabled = false;
          this.cmdDisplay = false;
          if(this.intervalSourceSubscription){
            this.intervalSourceSubscription.unsubscribe();
          }
          this.homeService.setPageWaiting("charge is full", this.timeVars.timeAlertEnd);
        }
        return;
      }
      return;
    }

    if(waitingCnt > this.timeVars.timeAlertEnd && waitingCnt < this.timeVars.timeStartAlert){
      this.chargingTipMessage = "充值即将终止,请立即点击屏幕";
      this.cmdDisplay = false;
      return;
    }

    if(waitingCnt == this.timeVars.timeAlertEnd-1) {
      if(this.retDisabled){
        this.terminateSubscription = this.service.terminate(this.deviceUrl).subscribe(
          (x:CashboxTaskRet)=>{
            console.log(JSON.stringify(x));
          },
          (error)=>console.log(error));
      }
      if(this.intervalSourceSubscription && env.isDev){
        this.intervalSourceSubscription.unsubscribe();
      }
      this.chargingTipMessage = "正在关闭充值";
      this.cmdDisplay = false;
      return;
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish){
      //query payout Available now
      if(this.amountCharging>0){
        this.service.sendCurrentPayoutAvailable(this.deviceUrl).subscribe(x=>console.log(x));
      }
      this.homeService.setLockAcquired(0);
      this.firstUnSubscribe();
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish-1){
      this.lastUnSubscribe();
      this.chargingTipMessage = "充值已关闭";
    }
  }

  onCmdClicked(cmdNum: string){
    // console.log(cmdNum)
    if(cmdNum == "start"){
      if(!this.machineStatus) return;
      this.retDisabled = true;
      this.homeService.setPageWaiting("chargechange->start", this.timeVars.timeWithoutPay);
      this.chargingTipMessage = "请放入10元钞票";
      this.homeService.setLockAcquired(1);
      this.startTollTaskSubscription = this.chargeChangeService.sendChargeCmd(this.deviceUrl).subscribe(
        (data:CashboxTaskRet)=>{
          console.log("toll operate command ret data: id:" + data.id+",  operateName: "+data.operate_name);
          this.startChargeRetSubj.next(data.id);
        },
        (error:any)=>{
          this.chargingTipMessage = error;
        }
      )
    }
    if(cmdNum == "stop"){
      this.homeService.setPageWaiting("chargechange->cmdClicked", this.timeVars.timeAlertEnd);
      this.retDisabled = false;
    }
  }
}
