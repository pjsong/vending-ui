import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'footercommand',
  templateUrl: './footercommand.component.html',
  styleUrls: ['./footercommand.component.scss']
})
export class FooterCommand implements OnInit{
    cmdStatus: string;
  @Input()
    cmdStart: string = "";
  @Input()
    cmdDisplay: boolean = true;
  @Input()
    cmdStop: string = "";
  @Input()
    retTxt: string = "返回首页";
  @Input()
    retAddress: string = "/default-button"
  @Input()
    retDisabled: boolean = false;
  @Input()
    retNavDisabled: boolean = false;
  @Output()
    cmdClickedEmitter = new EventEmitter<string>();

  constructor(private router:Router){}

  ngOnInit(){
    this.cmdStatus = this.cmdStart;
  }

  cmdClicked(cmd: number){
    if(cmd==0){
      if(this.cmdStatus == this.cmdStart) {
        this.cmdStatus = this.cmdStop;
        this.cmdClickedEmitter.emit("start");
      }
      else {
        this.cmdStatus = this.cmdStart;
        this.cmdClickedEmitter.emit("stop");
      }
    }
    else if(cmd == 1){
      if(!this.retDisabled && !this.retNavDisabled){
        this.router.navigate([this.retAddress]);
      }
      this.cmdClickedEmitter.emit("return");
    }
  }
}

