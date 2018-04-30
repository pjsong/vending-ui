import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'keyboardInput',
  template: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})

export class KeyboardInput implements OnInit{
  @Input()
    maxLength: number;
  @Input()
    inputType: string;
  @Input()
    tipMessage: string;
  @Output()
    onFinish = new EventEmitter<string>();
  @Input()
    autohide: boolean = false;

  inputTxt: string = "";

  keyboardDisplay: boolean = true;
  keyboardRow: Array<any> = [
    {"val":"1", "displayValue" : "1"}
    , {"val":"2", "displayValue" : "2"}
    , {"val":"3", "displayValue" : "3"}
    , {"val":"4", "displayValue" : "4"}
    , {"val":"5", "displayValue" : "5"}
    , {"val":"6", "displayValue" : "6"}
    , {"val":"7", "displayValue" : "7"}
    , {"val":"8", "displayValue" : "8"}
    , {"val":"9", "displayValue" : "9"}
    , {"val":"0", "displayValue" : "0"}
    , {"val":"q", "displayValue" : "q"}
    , {"val":"w", "displayValue" : "w"}
    , {"val":"e", "displayValue" : "e"}
    , {"val":"r", "displayValue" : "r"}
    , {"val":"t", "displayValue" : "t"}
    , {"val":"y", "displayValue" : "y"}
    , {"val":"u", "displayValue" : "u"}
    , {"val":"i", "displayValue" : "i"}
    , {"val":"o", "displayValue" : "o"}
    , {"val":"p", "displayValue" : "p"}
    , {"val":"a", "displayValue" : "a"}
    , {"val":"s", "displayValue" : "s"}
    , {"val":"d", "displayValue" : "d"}
    , {"val":"f", "displayValue" : "f"}
    , {"val":"g", "displayValue" : "g"}
    , {"val":"h", "displayValue" : "h"}
    , {"val":"j", "displayValue" : "j"}
    , {"val":"k", "displayValue" : "k"}
    , {"val":"l", "displayValue" : "l"}
    , {"val":"shift", "displayValue" : "大写"}
    , {"val":"z", "displayValue" : "z"}
    , {"val":"x", "displayValue" : "x"}
    , {"val":"c", "displayValue" : "c"}
    , {"val":"v", "displayValue" : "v"}
    , {"val":"b", "displayValue" : "b"}
    , {"val":"n", "displayValue" : "n"}
    , {"val":"m", "displayValue" : "m"}
    , {"val":"backspace", "displayValue" :"退格"}
    , {"val":"clear", "displayValue" :"清空"}
    , {"val":"enter", "displayValue" :"完成"}
  ]
  public constructor() {

  }

  ngOnInit(){
    if(this.autohide)
      this.keyboardDisplay = !this.keyboardDisplay;
  }
  inputboxClicked(){
    if(this.autohide)
      this.keyboardDisplay = !this.keyboardDisplay;
    this.onFinish.emit("inputBoxClicked");
  }
  shiftClick(numObj: any){
    // console.log(numObj.displayValue)
    if(numObj.displayValue == "大写"){
      numObj.displayValue = "小写"
      this.switchCase(true)
    }else{
      numObj.displayValue = "大写"
      this.switchCase(false)
    }
  }

  switchCase(isToUpperCase: boolean){
    this.keyboardRow.forEach(
      ele=>{
        let isSpecialButton = ["backspace", "clear", "enter", "shift"].some(x=>x==ele.val);
        if(!isSpecialButton && isNaN(+ele.val)) {
          if (isToUpperCase) {
            ele.val = ele.val.toUpperCase();ele.displayValue = ele.displayValue.toUpperCase()
          }
          else {
            ele.val = ele.val.toLowerCase();ele.displayValue = ele.displayValue.toLowerCase()
          }
        }
      })
  }


  clickButton(numObj:any){
    if(this.inputTxt == this.tipMessage){
      this.inputTxt = "";
    }
    if(numObj.val=="shift"){
        this.shiftClick(numObj);
    }else if(numObj.val=="backspace"){
      if(this.inputTxt.length > 1)
        this.inputTxt = this.inputTxt.substr(0, this.inputTxt.length-1);
      else
        this.inputTxt = this.tipMessage;
    }else if(numObj.val=="clear"){
      this.inputTxt = this.tipMessage;
    }else if(numObj.val=="enter"){
      if(this.autohide){
        this.keyboardDisplay = ! this.keyboardDisplay;
      }
      this.onFinish.emit(this.inputTxt);
    }
    // max length reached
    else if(this.inputTxt.length >= this.maxLength){
      if(this.autohide)
        this.keyboardDisplay = !this.keyboardDisplay;
    }
    // ordinary input
    else {
      this.inputTxt += numObj.val;
    }
  }
}

