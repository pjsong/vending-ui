import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SlotSelectService, SlotStatus, Cart, ProductOrder, Slot} from "./slotselect.service";
import {HomeService} from "../home/home.service";
import {ConfService} from "../home/conf.service";
import {tap} from "rxjs/operators";

@Component({
  selector: 'slotselect',
  templateUrl: './slotselect.component.html',
  styleUrls: ['./slotselect.component.scss']
})



export class SlotSelect implements OnInit{
  slotStatusUrl:string;
  slotUrl:string;
  retTxt:string = "放购物车";
  retNavDisabled: boolean = true;
  cart:Cart = new Cart();
  cartEmpty:boolean = this.cart.productOrders.length == 0;
  maxLength: number = 3;
  tipMessage: string = "请输入三位货道编号";
  inputTxt: string = "";
  finishWithError: string;
  cmdStart:string =  "开始购买"
  cmdStop:string = "开始购买"
  itemCount: number = 1;
  slotSelectFinishClicked = false;
  defaultWaiting:number;

  public constructor(private router: Router, private slotService: SlotSelectService, private homeService: HomeService, private confService:ConfService) {
  }

  ngOnInit(){
    this.confService.getSlotSelectDefaultWaiting().subscribe(x=>{
      console.log(x);
      if(!isNaN(+x)) {
        this.defaultWaiting = +x;
      }
      this.homeService.setPageWaiting('slotselect->ngOnInit', this.defaultWaiting);
    })
    this.confService.getSlotStatusUrl().pipe(tap(x=>this.slotStatusUrl = x)).subscribe(x=>console.log("ngOnInit: " + x));
    this.confService.getSlotUrl().pipe(tap(x=>this.slotUrl = x)).subscribe(x=>console.log("ngOnInit: " + x));
  }

  onFinish(inputTxt: string){
    if(inputTxt == "keyboardOpen") {
      this.slotSelectFinishClicked = false;
      this.finishWithError = "";
    }
    else if(inputTxt == "keyboardHide"){
      this.slotSelectFinishClicked = true;
    }
    else{
        this.slotSelectFinishClicked = true;
        this.inputTxt = inputTxt;
    }
  }

  itemCntClick(flunctuation:number){
    this.finishWithError = "";
    // let addOrSubAllowed = (this.itemCount + flunctuation) > 0 && (this.itemCount + flunctuation) < 11
    if(this.itemCount + flunctuation > 0)
      this.itemCount += flunctuation;
  }

  cartRemoveProductClick(productOrder:ProductOrder){
    this.cart.removeFromCart(productOrder);
  }


  onCmdClicked(cmdNum: string){
    this.finishWithError = "";
    let slotNo = +this.inputTxt;
    if(isNaN(slotNo)){
      return;
    }
    this.slotService.slotselect(this.slotStatusUrl, slotNo).subscribe(
      (data:SlotStatus)=>{
        if(data == undefined){
          this.finishWithError = "货道无效";
          return;
        }
        else if(data.running_status == '0'){
          this.finishWithError = "当前货道故障";
          return;
        }else if(data.current_item_num<this.itemCount){
          if(data.current_item_num == 0){
            this.finishWithError = "货道商品售罄";
          }else{
            this.finishWithError = "货道数量不足,只有"+data.current_item_num+"个商品";
          }
          return;
        }
        //check cart
        let slotAlreadySelected = this.cart.productOrders.find(po=>{return po.slotStatus.slot_no == slotNo+''});
        if(slotAlreadySelected != undefined){
          console.log("currentItemNum:" + data.current_item_num);
          if(cmdNum == "return" && data.current_item_num <= (slotAlreadySelected.itemCnt)){
            this.finishWithError = "货道数量不足,只有"+data.current_item_num+"个商品";
            return;
          }
        }
        this.slotService.getSlotProduct(this.slotUrl, +data.slot_no).subscribe((slot:Slot)=>{
          if(slot == undefined || slot.product == null){
            this.finishWithError = "货道"+ data.slot_no + "未设置商品";
            return;
          }
          let productOrder = new ProductOrder(data,this.itemCount, slot.product);
          //only add when cart is empty and clicked buy, or clicked add to cart.
          // when cart is not empty and clicked buy, do not count current one

          if(this.cart.productOrders.length == 0 || cmdNum =="return"){
            this.cart.addToCart(productOrder)
          }
          if(cmdNum == "return"){ //continue adding to cart
          }else{
            localStorage.setItem("cart", JSON.stringify(this.cart));
            this.cart.clearAll();
            // localStorage.setItem("itemCount", ''+this.itemCount);
            // localStorage.setItem("slotStatus", JSON.stringify(data));
            console.log("slotNo:" + slotNo +", " + JSON.stringify(data))
            this.router.navigate(["paymethod"]).then(x=>console.log("navigated from slotselect"));
          }
        })
      },
      (error:any)=>{this.finishWithError = "无效货道"; this.inputTxt = "请输入三位货道编号";});

  }
}
