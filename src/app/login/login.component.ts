import {Component, OnInit} from '@angular/core';
import {AuthService, UserPrinciple, LoginRet} from "../login/auth.service";
import {Router} from "@angular/router";
import {HomeService} from "../home/home.service";
import {ConfService} from "../home/conf.service";
const userTipMessage:string = "pjsong" //"请输入登录名"
const passwordTipMessage :string = "pjsong3101" //"请输入密码"

@Component({
  selector: 'login',
  template: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  loginErrorMsg: string;
  loginDefaultWaiting:number = 30;
  tipMessageUserName: string = "用户名";
  maxLengthUserName: number = 32;
  userInputUserName: string = userTipMessage;
  inputTypeUserName: string = "text"
  autohideUserName: boolean = true;

  tipMessagePassword: string = "密码";
  maxLengthPassword: number = 32;
  userInputPassword: string = userTipMessage;
  inputTypePassword: string = "password";
  autohidePassword: boolean = true;

  cmdStart:string =  "开始登录";
  cmdStop:string = "开始登录";
  retTxt:string = "返回首页";

  clickStatus:string="";

  public constructor(private authService: AuthService, private router: Router, private homeService: HomeService, private confService:ConfService) {
  }

  ngOnInit(){
    this.confService.getLoginDefaultWaiting().subscribe(x=>{
      if(!isNaN(+x)){
        this.loginDefaultWaiting = +x;
      }
      this.homeService.setPageWaiting('login->ngOnInit',this.loginDefaultWaiting);
    });
    this.authService.errorEvent.asObservable().subscribe(x=>this.errorHandler(x));
  }

  login(up: UserPrinciple): boolean{
    if(localStorage.getItem("token")){
      let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
      this.router.navigate([redirect]);
      return true;
    }
    this.authService.login(up);
  }
//paqmind.com/posts/rxjs-error-and-completed-events-demystified
  errorHandler(code:string){
    console.log("errorHandler code : " + code);
    if(code == "loginsucceed"){
      console.log("authservice.redirect: " + this.authService.redirectUrl)
      let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/';
      this.router.navigate([redirect]);
    }
    else{
      this.loginErrorMsg = code;
      // this.userInputUserName="";
      // this.userInputPassword="";
      this.onPasswordFinish("");
      this.onUserNameFinish("");
    }
  }

  logout(){
    localStorage.removeItem("token");
  }

  onUserNameFinish(inputTxt: string){
    console.log(inputTxt);
    if(inputTxt == "inputBoxClicked"){
      this.clickStatus = "";
    }else{
      this.userInputUserName = inputTxt;
      this.clickStatus = "usernameClicked";
    }
  }

  onPasswordFinish(inputTxt: string){
    console.log(inputTxt);
    if(inputTxt == "inputBoxClicked"){
      this.clickStatus = "usernameClicked";
    }else {
      this.userInputPassword = inputTxt;
      this.clickStatus = "passwordClicked";
    }
  }

  onCmdClicked(cmdNum: string){
    if(["start", "stop"].some(x=>x==cmdNum))
      this.login(new UserPrinciple(this.userInputUserName, this.userInputPassword))
  }
}

