import {Component, OnInit} from '@angular/core';
import {SlotTestService, SlotTestReq, SlotTestRet, SlotQueryRet} from "./slottest.services";
import {HomeService} from "../../home/home.service";
import {Subscription, Subject, Observable, interval} from "rxjs";
import {flatMap,map,filter} from "rxjs/operators"
import {ConfService} from "../../home/conf.service";

const queryInterval = 2000;

@Component({
  selector: 'slottest',
  templateUrl: './slottest.component.html',
  styleUrls: ['./slottest.component.scss']
})



export class SlotTest implements OnInit{
  deviceUrl:string;

  slotMaxLength: number = 3;
  turnCntMaxLength: number = 2;

  slotTipMessage: string = "请输入货道编号"
  turnCntTipMessage: string = "请输入旋转圈数"

  slotAutohide: boolean = true;
  turnCntAutohide: boolean = true;

  finishedWithError: string="";
  slotSelectFinishClicked = false;
  currentItemCntFinishClicked = false;

  slotNo: number;
  turnCnt: number;

  cmdStart:string =  "开始货道测试";
  cmdStop:string = this.cmdStart;

  intervalSource$ = interval(queryInterval);//.takeWhile(val => this.waitingCnt > timeJumpToFinish);

  testRetSubj:Subject<number> = new Subject<number>();
  finishTestSubj:Subject<number> = new Subject<number>();

  startTestTaskSubscription: Subscription;
  finishTestTaskSubscription: Subscription;
  tollRetSubjSubscription: Subscription;
  intervalSourceSubscription: Subscription;

  // retAddress: string = "/default-button"
  public constructor(private slotTestService: SlotTestService,  private homeService: HomeService, private confService:ConfService) {
    this.homeService.setPageWaiting('slottest->constructor', 60);
  }

  ngOnInit(){
    this.confService.getSlotTestUrl().subscribe(x=>this.deviceUrl = x);
    this.tollRetSubjSubscription = this.testRetSubj.asObservable().subscribe((inputId)=>this.doCheckRet(inputId));
    this.finishTestTaskSubscription = this.finishTestSubj.asObservable().subscribe((x)=>this.doFinish());

  }
  doFinish(){
    if(this.startTestTaskSubscription)this.startTestTaskSubscription.unsubscribe();
    if(this.tollRetSubjSubscription)this.tollRetSubjSubscription.unsubscribe();
    if(this.intervalSourceSubscription)this.intervalSourceSubscription.unsubscribe();
    if(this.finishTestTaskSubscription)this.finishTestTaskSubscription.unsubscribe();

  }
  doCheckRet(inputId:number){
    this.intervalSourceSubscription = this.intervalSource$
    .pipe(flatMap((x)=>this.slotTestService.slotTestQuery(this.deviceUrl, inputId))
      ,filter((data)=>data.length > 0)
      ,filter((data)=>data[0] != undefined)
      ,filter(data=>data[0] != null)
      ,map((data)=>data.slice(0,1)))
      .subscribe(
        (dataRet:SlotQueryRet[])=> {
          let outputdesc:string = dataRet[0].output_desc.replace(/'/g,'"');
          let turnCntArr:Array<any> = JSON.parse(outputdesc);
          let turnCntRet = turnCntArr.length;
          console.log(turnCntRet);
          if(turnCntRet == this.turnCnt){
            this.finishedWithError = "测试成功,转动"+ turnCntRet + "次";
          }
          else{
            this.finishedWithError = "测试失败,预期转动"+this.turnCnt+"次,实际转动"+ turnCntRet + "次";
          }
          this.homeService.setPageWaiting('slottest->intervalSourceRet', 60);
          // this.finishTestSubj.next(0);
          if(this.intervalSourceSubscription)this.intervalSourceSubscription.unsubscribe();
        }
      );
  }
  onSlotFinish(inputTxt: string){
    this.finishedWithError="";
    if(inputTxt == "keyboardOpen") {
      this.slotSelectFinishClicked = false;
    }
    else if(inputTxt == "keyboardHide"){
      this.slotSelectFinishClicked = true;
    }
    else{
      this.slotSelectFinishClicked = true;
      this.slotNo = +inputTxt;
    }
    console.log(inputTxt);
  }

  onTurnCntFinish(inputTxt: string){
    this.finishedWithError="";
    if(inputTxt == "keyboardOpen") {
      this.currentItemCntFinishClicked = false;
    }
    else if(inputTxt == "keyboardHide"){
      this.currentItemCntFinishClicked = true;
    }
    else{
      this.currentItemCntFinishClicked = true;
      this.turnCnt = +inputTxt;
    }
    console.log(inputTxt);
  }

  onCmdClicked(cmdNum: string){
    if(cmdNum == "return") {
      localStorage.removeItem("token");
    }else if(["start","stop"].some(x=>x==cmdNum)){               //(cmdNum == "stop") {
      this.finishedWithError = "";
      let su:SlotTestReq = new SlotTestReq();
      su.slot_no = this.slotNo;su.turn_cnt = this.turnCnt;
      this.startTestTaskSubscription = this.slotTestService.slotTest(this.deviceUrl, su)
      .subscribe((data:SlotTestRet)=> {
        if (data == undefined) {
          this.finishedWithError = "货道无效";
        } else {
          this.finishedWithError = "正在测试";
          this.testRetSubj.next(data.id)
        }
      }, err=>{this.finishedWithError = err;});
    }
  }
}
