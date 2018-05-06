import {Component, OnInit} from '@angular/core';
import {Subject, Subscription, Observable, of, from, interval} from "rxjs";
import {map,flatMap, filter,tap,takeWhile} from 'rxjs/operators'
import {MemberInfoUpdateReq, MemberChargeService} from "../../membercharge/membercharge.services";
import {HomeService} from "../../home/home.service";
import {PaymethodService, OrderTask, BuyTask, OrderTaskRet} from "../paymethod.service";
import {TimeVars, PaycashService} from "../paycash/paycash.service";
import {ConfService} from "../../home/conf.service";
import {Cart} from "../../slotselect/slotselect.service";
import {SlotUpdateReq, SlotUpdateService} from "../../vendor-management/slotupdate/slotupdate.services";
import {VendingStatus} from "../../home-default-button/default-button.services";
import {environment as env} from "../../../environments/environment";

@Component({
  selector: 'paymember',
  templateUrl: './paymember.component.html',
  styleUrls: ['./paymember.component.scss']
})



export class Paymember implements OnInit{
  timeVars:TimeVars;
  memberUrl:string;
  ordermainUrl:string;
  slotStatusUrl:string;
  controlboardLogUrl:string;

  productDelievered: boolean = false;

  waitingCnt:number;
  countdownSubj:Subject<number> = new Subject<number>();
  timeCounterSubs: Subscription;

  countdownSubjSubscription: Subscription;

  // orderTask: OrderTask;
  buyTask: BuyTask;

  accountName: string;
  amountBefore: number = 0;
  amountToPay: number = 0;
  payingTipMessage:string = "";
  cmdStart:string =  "确认交易"
  cmdStop:string = "确认交易"
  cmdDisplay:boolean = true;
  retDisabled:boolean = false;
  selfcheckfail = '';
  miu:MemberInfoUpdateReq = new MemberInfoUpdateReq();
  public constructor(private service: MemberChargeService, private homeService: HomeService,private slotUpdateService: SlotUpdateService,
                     private confService:ConfService, private paymethodService: PaymethodService, private paycashService: PaycashService,) {
    this.timeCounterSubs = homeService.waitingCnt$.subscribe(wc=>{
      this.waitingCnt = wc;this.countdownSubj.next(wc);
    });
  }

  ngOnInit(){
    let vendingstatus: VendingStatus = JSON.parse(localStorage.getItem("vendingstatus"));
    if(env.isDev) vendingstatus = env.vendingStatus;
    let deviceOk: boolean = vendingstatus.omddevice == 'ok' && vendingstatus.controlboardstatus == 'ok';
    if(!deviceOk ){
      this.selfcheckfail = "机器故障,请选择其他支付方式";
      this.cmdDisplay = false;
      return;
    }
    this.accountName = localStorage.getItem("username");
    this.confService.getPayMemberTimeVars().subscribe(x=>{
      this.timeVars = x;
      this.homeService.setPageWaiting('chargeChange->ngOnInit', this.timeVars.timeWithoutPay);
    });


    this.buyTask = JSON.parse(localStorage.getItem("buyTask")) as BuyTask;
    if(this.buyTask.orderTasks.length == 0){
      this.homeService.setPageWaiting('paycash->buyTaskZero', 1);
    }
    this.buyTask.orderTasks = this.buyTask.orderTasks.map(orderTask=>{
      orderTask.pay_type =2;
      orderTask.status= 2;
      orderTask.user=1;
      this.amountToPay += orderTask.total_paid;
      return orderTask;
    });
    this.confService.getSlotStatusUrl().pipe(tap((x:any)=>this.slotStatusUrl=x)).subscribe((x:any)=>console.log(this.slotStatusUrl));
    this.confService.getControlBoardUrl().pipe(tap((x:any)=>this.controlboardLogUrl=x)).subscribe((x:any)=>console.log(this.controlboardLogUrl));


    this.confService.getOrdermainUrl().subscribe(url=>this.ordermainUrl=url);
    this.confService.getMemberUrl().subscribe(x=>{
      this.memberUrl = x;
      this.service.balanceSub.asObservable().subscribe(
          x=>{
            this.amountBefore = x.balance;
            this.miu.id = x.id; this.miu.balance = x.balance; this.miu.owner = x.owner;this.miu.user = x.user;
            // this.orderTask = JSON.parse(localStorage.getItem("orderTask")) as OrderTask;
            // this.orderTask.payType =1;
            // this.orderTask.status= 2;
            // this.orderTask.user=this.miu.user;
            // this.amountToPay = this.orderTask.totalPaid;
            if(this.amountToPay > this.amountBefore){
              this.payingTipMessage = "余额不足";
              this.retDisabled = false;
              this.homeService.setPageWaiting("paymember->ngOnInit, not enough balance", this.timeVars.timeJumpToFinish);
            }
          });
      this.service.getMemberInfo(this.memberUrl);
    })

    this.countdownSubjSubscription = this.countdownSubj.asObservable().subscribe((waitingCnt=>this.doWaitingCnt(waitingCnt)));

  }

  sendOrder(){
    // this.paymethodService.sendOrder(this.ordermainUrl, this.orderTask).subscribe(x=>{
    //   console.log(x);this.homeService.setPageWaiting("paymember->cmdClicked", this.timeVars.timeJumpToFinish);});


    let productOrders = (JSON.parse(localStorage.getItem("cart")) as Cart).productOrders;
    from(productOrders).pipe(flatMap(productOrder=>{
      let su:SlotUpdateReq = new SlotUpdateReq();
      let slotStatus = productOrder.slotStatus;
      su.slot_no = slotStatus.slot_no;
      su.before_item_num = slotStatus.current_item_num;
      su.variation_num = -productOrder.itemCnt;
      su.current_item_num = slotStatus.current_item_num - productOrder.itemCnt;
      su.running_status="1";
      return this.slotUpdateService.slotCreate(this.slotStatusUrl, su);
    })).subscribe(x=>console.log("slotUpdateReturned: " + x));

    let sendTaskSub:Subject<number> = new Subject<number>();

    let sendTaskSub$:Subscription = sendTaskSub.asObservable()
      .subscribe(indexOfOrderTask=>{
        let orderTask = this.buyTask.orderTasks[indexOfOrderTask];
        console.log("indexOfOrderTask: " + indexOfOrderTask);
        this.paymethodService.sendOrder(this.ordermainUrl, orderTask)
          .subscribe(
            controlboardInputId=>{
              console.log("now querying controlboardInputId: "+ controlboardInputId);
              let orderIntervalSource$ = interval(this.timeVars.queryInterval)
                .pipe(takeWhile(val=> this.productDelievered == false),
                flatMap(x=>{
                  return this.paycashService.orderTaskSendLog(this.controlboardLogUrl, controlboardInputId)}))
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


  lastUnSubscribe(){
    if(this.countdownSubjSubscription)this.countdownSubjSubscription.unsubscribe();
  }

  doWaitingCnt(waitingCnt: number){
    if(this.retDisabled && waitingCnt > this.timeVars.timeStartAlert){

    }

    if(waitingCnt > this.timeVars.timeAlertEnd && waitingCnt < this.timeVars.timeStartAlert){
      return;
    }

    if(waitingCnt == this.timeVars.timeAlertEnd-1) {
      // this.cmdDisplay = false;
      return;
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish){
    }
    if(waitingCnt == this.timeVars.timeJumpToFinish-1){
      this.lastUnSubscribe();
    }
  }

  onCmdClicked(cmdNum: string){
    console.log(cmdNum)
    if(["start","stop"].some(x=>x==cmdNum)){
      if(this.miu.balance >= this.amountToPay){
        this.miu.balance -= this.amountToPay;
        this.service.updateMemberInfo(this.memberUrl, this.miu).subscribe(x=> {
          // this.retDisabled = false;
          this.payingTipMessage = "交易成功";
          this.cmdDisplay = false;
          this.retDisabled = true;
          this.sendOrder();

        });
      }else{
        this.payingTipMessage = "余额不足"
      }
    }
  }
}
