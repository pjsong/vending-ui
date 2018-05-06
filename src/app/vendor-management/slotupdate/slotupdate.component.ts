import {Component, OnInit} from '@angular/core';
import {SlotUpdateService, SlotUpdateReq} from "./slotupdate.services";
import {HomeService} from "../../home/home.service";
import {ConfService} from "../../home/conf.service";
import {SlotSelectService, SlotStatus} from "../../slotselect/slotselect.service";


@Component({
  selector: 'slotupdate',
  templateUrl: './slotupdate.component.html',
  styleUrls: ['./slotupdate.component.scss']
})

export class SlotUpdate implements OnInit{
  slotStatusUrl:string;
  slotMaxLength: number = 3;
  itemCntMaxLength: number = 2;

  slotTipMessage: string = "请输入货道编号";
  currentItemCntTipMessage: string = "请输入货物数量";

  slotAutohide: boolean = true;
  currentItemCntAutohide: boolean = true;

  currentItemCnt: number;
  slotNo: string;

  slotSelectFinishClicked = false;
  currentItemCntFinishClicked = false;
  finishedWithError: string="";

  cmdStart:string =  "更新货道数量";
  cmdStop:string = "更新货道数量";

  public constructor(private slotUpdateService: SlotUpdateService,  private homeService: HomeService, private confService: ConfService, private slotselectService: SlotSelectService) {
    this.homeService.setPageWaiting('slotupdate->constructor',60);
  }

  ngOnInit(){
    this.confService.getSlotStatusUrl().subscribe(x=>this.slotStatusUrl=x);
  }
  onSlotFinish(inputTxt: string){
    this.finishedWithError="";
    if(inputTxt == "keyboardOpen") {
      this.slotSelectFinishClicked = false;
      this.currentItemCntFinishClicked = false;
    }
    else if(inputTxt == "keyboardHide"){
      this.slotSelectFinishClicked = true;
    }
    else{
      this.slotSelectFinishClicked = true;
      this.slotNo = inputTxt;
    }
    console.log(inputTxt);
  }

  onCurrentItemCntFinish(inputTxt: string){
    this.finishedWithError="";
    if(inputTxt == "keyboardOpen") {
      this.currentItemCntFinishClicked = false;
    }
    else if(inputTxt == "keyboardHide"){
      this.currentItemCntFinishClicked = true;
    }
    else{
      this.currentItemCntFinishClicked = true;
      this.currentItemCnt = +inputTxt;
    }
    console.log(inputTxt);
  }


  doLog(slotStatus: SlotStatus):any{
    let su:SlotUpdateReq = new SlotUpdateReq();
    su.slot_no = this.slotNo; su.before_item_num = slotStatus == null? 0 : slotStatus.current_item_num;
    su.variation_num = this.currentItemCnt; su.current_item_num = su.before_item_num + this.currentItemCnt;
    su.running_status="1";
    this.slotUpdateService.slotCreate(this.slotStatusUrl, su).subscribe(
      (data:SlotUpdateReq)=> {
        if (data == undefined) {
          this.finishedWithError = "货道无效";
        }
        else{ // if(data.currentItemNum == this.currentItemCnt){
          this.finishedWithError = "更新成功";
        }
      }//TypeError: You provided 'null' where a stream was expected. You can provide an Observable, Promise, Array, or Iterable
      , err=>{this.finishedWithError = "新创建";});
  }

  onCmdClicked(cmdNum: string){
    this.finishedWithError="";
    if(cmdNum == "return"){
      localStorage.removeItem("token");
    }else{
      this.slotselectService.slotselect(this.slotStatusUrl, +this.slotNo)
        .subscribe(
        (slotStatus: SlotStatus)=>{
          this.doLog(slotStatus);
          });
        }
    }
  }
