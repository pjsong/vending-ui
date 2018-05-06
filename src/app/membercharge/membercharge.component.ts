import {Component, OnInit} from '@angular/core';
import {MemberChargeService, MemberInfoUpdateReq} from "./membercharge.services";
import {Subject, Subscription, Observable, interval} from "rxjs";
import {filter,takeWhile} from "rxjs/operators"
import {HomeService} from "../home/home.service";
import {PaycashService, CashboxLog, CashboxTaskRet, TimeVars} from "../paymethod/paycash/paycash.service";
import {ConfService} from "../home/conf.service";
import {environment as env } from "../../environments/environment"

@Component({
  selector: 'membercharge',
  templateUrl: './membercharge.component.html',
  styleUrls: ['./membercharge.component.scss']
})



export class MemberCharge implements OnInit{
  deviceUrl:string;
  deviceLogUrl:string;
  timeVars:TimeVars;
  memberUrl:string;
  waitingCnt:number;
  countdownSubj:Subject<number> = new Subject<number>();
  timeCounterSubs: Subscription;
  startChargeRetSubj:Subject<number> = new Subject<number>();

  currentPayoutAvailableSubscription:Subscription;
  startTollTaskSubscription: Subscription;
  terminateSubscription: Subscription;

  startChargeRetSubjSubscription: Subscription;
  intervalSourceSubscription: Subscription;
  countdownSubjSubscription: Subscription;
  intervalSource$:any;
  // = Observable.interval(this.timeVars.queryInterval).takeWhile(val => this.waitingCnt > this.timeVars.timeJumpToFinish);

  accountName: string;
  amountBefore: number = 0;
  amountCharging: number = 0;
  lastLogId: number = -1;

  cmdStart:string =  "开始充值";
  cmdStop:string = "结束充值";
  cmdDisplay:boolean = true;
  retDisabled:boolean = false;
  retTxt:string = "返回首页";
  startClicked:boolean = false;
  chargingTipMessage = "";
  miu:MemberInfoUpdateReq = new MemberInfoUpdateReq();
  public constructor(private service: MemberChargeService, private homeService: HomeService
      ,private confService: ConfService,private paycashService: PaycashService) {
    this.timeCounterSubs = homeService.waitingCnt$.subscribe(wc=>{
      this.waitingCnt = wc;this.countdownSubj.next(wc);
    });
  }

  ngOnInit(){
    this.confService.getMemberUrl().subscribe(x=>{
      this.memberUrl=x;
      this.service.getMemberInfo(this.memberUrl);
    });
    this.confService.getDeviceLogUrl().subscribe(url=>this.deviceLogUrl = url);
    this.accountName = localStorage.getItem("username");
    this.confService.getDeviceUrl().subscribe(x=>this.deviceUrl = x);
    this.confService.getMemberchargeTimeVars().subscribe(x=>{
      this.timeVars = x;
      this.homeService.setPageWaiting('chargeChange->ngOnInit', this.timeVars.timeWithoutPay);
      this.intervalSource$ = interval(this.timeVars.queryInterval).pipe(takeWhile(val => this.waitingCnt > this.timeVars.timeJumpToFinish));
      this.startChargeRetSubjSubscription = this.startChargeRetSubj.asObservable().subscribe((operateId)=>this.doTollRet(operateId));
      this.countdownSubjSubscription = this.countdownSubj.asObservable().subscribe((waitingCnt=>this.doWaitingCnt(waitingCnt)));
    });
    this.service.balanceSub.asObservable().pipe(filter(x=>x!=undefined)).subscribe(
      x=>{this.amountBefore = x.balance;this.miu.id = x.id; this.miu.balance = x.balance; this.miu.owner = x.owner;this.miu.user = x.user});
  }

  doTollRet(operateId:number){
    console.log("doTollRet: waitingCnt" + this.waitingCnt);
    this.intervalSourceSubscription = this.intervalSource$
        .flatMap((x:any)=>this.paycashService.tollLog(this.deviceLogUrl, this.lastLogId,operateId))
        .subscribe(
            (dataRet:CashboxLog)=> {
              if(env.isDev && this.waitingCnt <= this.timeVars.timeAlertEnd){
                dataRet =env.CashboxLogTestTerm[0];
              }
              this.doToll(dataRet);
            }
        );
  }

  doToll(data:CashboxLog){
    console.log(data);
    if(data.ret_data > 0){
      this.lastLogId = data.id;
      this.amountCharging += data.ret_data;
      this.miu.balance += data.ret_data;
      this.homeService.setPageWaiting("chargeChange->doToll", this.timeVars.timeWithPay);
      return;
    }
    this.chargingTipMessage = data.ret_data == 0 ? "充值已成功":"充值已终止";
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
      if(this.amountCharging>0){
        this.chargingTipMessage = "正在充值...";
        this.cmdDisplay=true;
      }else{
        this.chargingTipMessage = "";
      }
    }

    if(waitingCnt > this.timeVars.timeAlertEnd && waitingCnt < this.timeVars.timeStartAlert){
      this.chargingTipMessage = "充值即将终止,请立即点击屏幕";
      return;
    }

    if(waitingCnt == this.timeVars.timeAlertEnd-1) {
      if(this.startClicked){
        this.terminateSubscription = this.paycashService.terminate(this.deviceUrl).subscribe(
          (x:CashboxTaskRet)=>{
            console.log(JSON.stringify(x));
          },
          (error)=>{console.log(error);
          this.homeService.setPageWaiting("member charge terminate failed", this.timeVars.timeAlertEnd)
          });
        this.chargingTipMessage = "正在关闭充值";
      }
      else{
        this.chargingTipMessage = "充值已关闭";
        this.retDisabled = false;
      }
      this.cmdDisplay = false;
      return;
    }
    if(this.startClicked && waitingCnt == this.timeVars.timeJumpToFinish){
      //query payout Available now
      this.service.updateMemberInfo(this.memberUrl, this.miu).subscribe((x:any)=>this.retDisabled = false);
      if(this.amountCharging>0){
        this.paycashService.sendCurrentPayoutAvailable(this.deviceUrl).subscribe(x=>console.log(x));
      }
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
      this.startClicked = true;
      this.retDisabled = true;
      this.homeService.setPageWaiting("chargechange->start", this.timeVars.timeWithoutPay);
      this.chargingTipMessage = "请放入钞票";
      this.startTollTaskSubscription = this.service.memberCharge(this.deviceUrl).subscribe(
        (data:CashboxTaskRet)=>{
          console.log("membercharge operate command ret data: id:" + data.id+",  operateName: "+data.operate_name);
          this.startChargeRetSubj.next(data.id);
        },
        (error:any)=>{
          this.chargingTipMessage = error;
        }
      )
    }
    if(cmdNum == "stop"){
      this.homeService.setPageWaiting("chargechange->cmdClicked", this.timeVars.timeAlertEnd);
    }
  }
}
