import { Injectable } from '@angular/core';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import {Http, } from "@angular/http";
import {HttpUtils} from "../../common/http-util";
import {Observable} from "rxjs";

export class VersionAPIRet{
  pics:string;
  vendingui: string;
  omddata: string;
  omddevice: string;
  itl: string;
  constructor(){}
}
export class UpdateMsgRet{
  return: string;
}

@Injectable()
export class UpgradeService {
  httpUtils:HttpUtils;
  constructor(private http: Http ){
    this.httpUtils = new HttpUtils(http);
  }

  getVersion(versionUrl:string): Observable<VersionAPIRet>{
    return this.http.get(versionUrl).map(x=>x.json() as VersionAPIRet)
  }

  getUpdateMsg(pullcodeUrl:string): Observable<UpdateMsgRet>{
    return this.http.get(pullcodeUrl).map(x=>x.json() as UpdateMsgRet)
  }
  shutdown(shutdownUrl:string): Observable<UpdateMsgRet>{
    return this.http.get(shutdownUrl).map(x=>x.json() as UpdateMsgRet)
  }
  reboot(rebootUrl:string): Observable<UpdateMsgRet>{
    return this.http.get(rebootUrl).map(x=>x.json() as UpdateMsgRet)
  }
}

