import { Injectable } from '@angular/core';

import {Http, } from "@angular/http";
import {HttpUtils} from "../../common/http-util";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import { environment as env} from '../../../environments/environment';

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
    if(env.isDev) return of(env.versionRet);
    return this.http.get(versionUrl).pipe(map(x=>x.json() as VersionAPIRet))
  }

  getUpdateMsg(pullcodeUrl:string): Observable<UpdateMsgRet>{
    return this.http.get(pullcodeUrl).pipe(map(x=>x.json() as UpdateMsgRet))
  }
  shutdown(shutdownUrl:string): Observable<UpdateMsgRet>{
    return this.http.get(shutdownUrl).pipe(map(x=>x.json() as UpdateMsgRet))
  }
  reboot(rebootUrl:string): Observable<UpdateMsgRet>{
    return this.http.get(rebootUrl).pipe(map(x=>x.json() as UpdateMsgRet))
  }
}

