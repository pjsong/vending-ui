import {Component, OnInit} from '@angular/core';
import {ChargeCoinService, ChargeCoinRet, ChargeCoinReq} from "./chargecoin.services";
import {HomeService} from "../../home/home.service";

@Component({
  selector: 'chargecoin',
  templateUrl: './chargecoin.component.html',
  styleUrls: ['./chargecoin.component.scss']
})

export class ChargeCoin implements OnInit{
  // coinChangeLogUrl:string;
  // coinChangePostUrl:string;
  coinMaxLength: number = 3;
  coinTipMessage: string = "请输入新添加的硬币数";
  coinAutohide: boolean = true;

  amountBefore: number;
  coinTxt: number;
  currentItemCntFinishClicked = false;
  cmdStart:string =  "更新";
  cmdStop:string = "更新";
  retTxt:string = "返回";
  finishedWithError: string="";

  public constructor(private chargecoinService: ChargeCoinService,  private homeService: HomeService) {
    this.homeService.setPageWaiting('chargecoin',60);
  }

  ngOnInit(){
    this.chargecoinService.coinGetWithUrl()
        .subscribe((x:ChargeCoinRet[])=>{console.log(x); if(x.length > 0)this.amountBefore = x[0].amount_after;else this.amountBefore = 0;})
    // this.homeService.getCoinChangePostUrl().subscribe(x=>{
    //   this.coinChangePostUrl = x;
    // });
  }

  onInputFinish(inputTxt: string){
    this.finishedWithError = "";
    if(inputTxt == "keyboardOpen") {
      this.currentItemCntFinishClicked = false;
    }
    else if(inputTxt == "keyboardHide"){
      this.currentItemCntFinishClicked = true;
    }
    else{
      this.currentItemCntFinishClicked = true;
      this.coinTxt = +inputTxt;
    }
    console.log(inputTxt);
  }


  onCmdClicked(cmdNum: string){
    if(cmdNum == "return"){
      localStorage.removeItem("token");
    }else{
      let cc = new ChargeCoinReq();
      cc.amount_before = this.amountBefore;
      cc.amount_data = this.coinTxt;
      this.chargecoinService.coinCreateWithUrl(cc).subscribe((x:ChargeCoinRet)=>{
        this.chargecoinService.coinGetWithUrl()
          // .filter((data)=>data[0] != undefined)
          // .filter(data=>data[0] != null)
          // .map((data)=>data.slice(0,1))
          .subscribe((x:ChargeCoinRet[])=>{console.log(x);this.finishedWithError="更新成功"; this.amountBefore = x[0].amount_after})
      });
    }
  }

}
