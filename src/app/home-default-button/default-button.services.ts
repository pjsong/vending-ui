import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {confUrlPrefix, timeoutTip, timeoutSet} from "../home/conf.service";
import {Observable} from "rxjs";

export class MainButton{
  // public id: number; public imgUrl: string; public buttonTxt: string; public linkTarget: string;
  constructor(public id: number, public imgUrl: string, public buttonTxt: string, public linkTarget: string){
  }
}


export class Conf{
  config_type: string;
  conf_name: string;
  conf_value: string;
}

// {"ip": "223.74.169.125", "hostname": "pjsong-spring001-001", "omddevice": "connection_timeout_exception", "vmtype": "1", "ip_provider": "http://api.scheduler.oursmedia.cn/checkip", "MD5": "fba10d5ab4cff3acbc1257acc8416c19", "conf_server": "http://172.16.0.4", "timestamp": "2017-04-25 23:54:17"}
export class VendingStatus{
  md5:string;vm_slug:string; vmtype:string; timestamp:string; ip: string; ip_provider:string;
  omddevice:string;cashboxstatus:string;coinmachinestatus:string;controlboardstatus:string;
  conf_server:string;
}
// let BUTTONS = [
//   new MainButton(1, 'http://172.18.0.3/static/images/vendor/front/homepage/On_Screen_Keyboard.png', '货道购买', '../slotselect')
//   ,new MainButton(2,'http://172.18.0.3/static/images/vendor/front/homepage/vendor-management.png','终端管理', '../vendor-management')
//   ,new MainButton(3,'http://172.18.0.3/static/images/vendor/front/homepage/membership.png','会员充值', '../membercharge')
// ];
// let VENDINGSTATUS_TEST =
//   {"ip": "223.74.169.125", "vm_slug": "pjsong-spring001-001", "omddevice": "connection_timeout_exception", "vmtype": "1", "ip_provider": "http://api.scheduler.oursmedia.cn/checkip", "MD5": "fba10d5ab4cff3acbc1257acc8416c19", "conf_server": "http://172.16.0.4", "timestamp": "2017-04-25 23:54:17"}

  let BUTTONSTEST =
  [
    {"id":1, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/On_Screen_Keyboard.png","buttonTxt":"货道购买","linkTarget":"../slotselect"},
    {"id":2, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/vendor-management.png","buttonTxt":"终端管理","linkTarget":"../vendor-management"},
    {"id":3, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/membership.png","buttonTxt":"会员充值","linkTarget":"../membercharge"},
  ];
// let mbPromise = Promise.resolve(BUTTONS);


// @Injectable()
// export class ButtonService{
//   constructor(private http:Http){}
//   getButtonNew(){
//     return this.http.get(confUrlPrefix+"confname=default-button")
//       .map(x=>x.json()).map(x=>JSON.parse(x[0].conf_value) as MainButton[]);
//       // .timeout(timeoutSet, new Error("getButtonNew "+timeoutTip))
//       // .catch(x=>Observable.of(BUTTONSTEST as MainButton[]))
//   }
// }
