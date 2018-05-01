import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'numKB',
  templateUrl: './numKB.component.html',
  styleUrls: ['./numKB.component.scss']
})



export class NumKB implements OnInit{
  @Input()
    maxLength: number;
  @Input()
    tipMessage: string;
  inputTxt: string = "";
  @Output()
   onFinish = new EventEmitter<string>();
  @Input()
    autohide: boolean = true;
  keyboardDisplay: boolean = true
  keyboardImgsRow1: Array<any> = [
    {"val":1, "displayValue" : "1"}
    , {"val":2, "displayValue" : "2"}
    , {"val":3, "displayValue" : "3"}
    , {"val":0, "displayValue" : "0"}
    , {"val":4, "displayValue" : "4"}
    , {"val":5, "displayValue" : "5"}
    , {"val":6, "displayValue" : "6"}
    , {"val":10, "displayValue" : "后退"}
    , {"val":7, "displayValue" : "7"}
    , {"val":8, "displayValue" : "8"}
    , {"val":9, "displayValue" : "9"}
    , {"val":11, "displayValue" :"完成"}
  ]
  public constructor() {
  }

  inputboxClicked(){
    this.inputTxt = "";
    if(this.autohide)
      this.keyboardDisplay = !this.keyboardDisplay;
      this.onFinish.emit("keyboardOpen")
  }

  ngOnInit(){
    this.inputTxt = this.tipMessage;
    if(this.autohide)
      this.keyboardDisplay = !this.keyboardDisplay;
  }

  clickButton(numObj:any){
    let isControlKey:boolean = numObj.val == 10 || numObj.val == 11;
    let isNotNumberInput = this.inputTxt == this.tipMessage || this.inputTxt == ""
    if( isControlKey && isNotNumberInput){
      this.inputTxt = this.tipMessage;
      return;
    }
    if(this.inputTxt == this.tipMessage){
      this.inputTxt="";
    }

    //backward key
    if(numObj.val==10){
      if(this.inputTxt.length > 1) {
        this.inputTxt = this.inputTxt.substr(0, this.inputTxt.length - 1);
      }else{
        this.inputTxt = this.tipMessage;
      }
      return
    }
    // not finish key
    if(numObj.val != 11){
      this.inputTxt += numObj.val;
      if(this.inputTxt.length >= this.maxLength){
        if(this.autohide) {
          this.keyboardDisplay = !this.keyboardDisplay;
          this.onFinish.emit("keyboardHide")
        }
        this.onFinish.emit(this.inputTxt);
      }
      return
    }else {
      // finish key
      this.onFinish.emit(this.inputTxt);
      if(this.autohide){
        this.keyboardDisplay = !this.keyboardDisplay
        this.onFinish.emit("keyboardHide")
      }
    }
  }
}
