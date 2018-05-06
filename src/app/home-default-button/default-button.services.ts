import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {Observable, of, Subject} from "rxjs";
import {map, filter} from 'rxjs/operators'
import { Environment as env} from '../environments/environment';

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

export class VendingStatus{
  md5:string;vm_slug:string; hostname:string;vmtype:string; 
  timestamp:string; ip: string; ip_provider:string;
  omddevice:string;cashboxstatus:string;
  coinmachinestatus:string;controlboardstatus:string;
  conf_server:string;
}

// let VENDINGSTATUS_TEST =
//   {"ip": "223.74.169.125", "vm_slug": "pjsong-spring001-001", "omddevice": "connection_timeout_exception", "vmtype": "1", "ip_provider": "http://api.scheduler.oursmedia.cn/checkip", "MD5": "fba10d5ab4cff3acbc1257acc8416c19", "conf_server": "http://172.16.0.4", "timestamp": "2017-04-25 23:54:17"}


