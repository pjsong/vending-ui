import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {HttpUtils} from "../common/http-util";
import {TimeVars, TIMEVARS, PaycashVars} from "../paymethod/paycash/paycash.service";
import {MainButton, VendingStatus, Conf} from "../home-default-button/default-button.services";
import {WXPayParams, WXPayTimeVars} from "../paymethod/payweixin/payweixin.service";
import { Environment as env} from '../environments/environment';

@Injectable()
export class ConfService{

  httpUtils: HttpUtils;
  constructor(private http:Http){
    this.httpUtils = new HttpUtils(http);
  }

  confUrlPrefixWithVmtype():Observable<string>{
    return this.getVendingStatus().map((x:VendingStatus)=>{
      let ret = '';
      let vmtype = 'vmtype=' + x.vmtype;
      let prefixOriginal = env.configserver + "api/data/config/?format=json&";
      if(prefixOriginal.endsWith('&') || prefixOriginal.endsWith('?')){
        ret = prefixOriginal + vmtype
      }
      else if(prefixOriginal.includes('&') || prefixOriginal.includes('?')){
        ret = '&' + prefixOriginal + vmtype
      }else{
        ret = '?' + prefixOriginal + vmtype
      }
      return ret+'&';
    });
  }

  getMemberchargeTimeVars(){
    const key = "membercharge-timevars";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
    return this.http.get(confUrlPrefix+"confname=membercharge-timevars").map(x=>x.json())
        .map(x=>JSON.parse(x[0].conf_value) as TimeVars)
        // .catch(x=>Observable.of(TIMEVARS))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret));
  }

  getMemberUrl(): Observable<string>{
    if(env.isDev) return Observable.of(env.memberUrl);
    const key = "memberUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
        return this.http.get(confUrlPrefix+"confname=member").map(x=>x.json())
        // .timeout(timeoutSet, "getMemberUrl" + timeoutTip)
        .map(x=>x[0].conf_value)
        // .catch(err=>Observable.of(memberUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret));
  }
  getWXPayServer(){
    if(env.isDev) return Observable.of(env.wxPayServer);
    const key = "wxPayUrl";
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=wxpay").map(x=>x.json())
        .map(x=>x[0].conf_value)
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret))
  }
  getWXPayPollUrl(){
    if(env.isDev) return Observable.of(env.wxPayPollUrl);
    const key = "wxPayPollUrl";
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=wxpoll").map(x=>x.json())
        .map(x=>x[0].conf_value)
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret))
  }
  getPayMemberTimeVars(){
    const key = "payMemberTimeVars";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=paymember-timevars").map(x=>x.json())
          // .timeout(timeoutSetCashbox, "getPayMemberTimeVars" + timeoutTip)
          .map(x=>JSON.parse(x[0].conf_value) as TimeVars)
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      })}
    return Observable.of(JSON.parse(ret));
  }

  getSlotUrl(){
    if(env.isDev) return Observable.of(env.slotUrl);
    const key = "slotUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=slot").map(x=>x.json())
            .map(x=>x[0].conf_value)
            .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        })
    }
    return Observable.of(JSON.parse(ret));
  }

  getSlotStatusUrl(): Observable<string>{
    if(env.isDev) return Observable.of(env.slotstatusUrl);
    const key = "slotStatusUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix + "confname=slotstatus").map(x=>x.json())
          .map(x=>x[0].conf_value)
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      });
    }
      return Observable.of(JSON.parse(ret));
  }

  getSlotSelectDefaultWaiting(){
    if(env.isDev) return Observable.of(env.slotSelectTimeout);
    const key = "slotselectdefaultwaiting";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=slotselect-defaultwaiting")
            .map(res=>res.json())
            // .timeout(timeoutSet, "getSlotSelectDefaultWaiting "+timeoutTip)
            .map(x=>x[0].conf_value);
        })
    }
  }

  initWXPayConnection(){
    if(env.isDev) return Observable.of("OK");
    return this.http.get(env.wxPayHeartbeatUrl).map(x=>x.json());
  }
  getHomepageButton(){
    const key = "homepagebutton";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
    return this.http.get(confUrlPrefix+"confname=default-button")
      .map(x=>x.json()).map(x=>JSON.parse(x[0].conf_value) as MainButton[]);
    // .timeout(timeoutSet, new Error("getButtonNew "+timeoutTip))
    // .catch(x=>Observable.of(BUTTONSTEST as MainButton[]))
  });}
    return Observable.of(JSON.parse(ret));
  }


  getPayButton(){
    if(env.isDev) return Observable.of(env.payButtons as MainButton[]);
    const key = "paybutton";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=paymethod-button")
              .map(x=>x.json()).map(x=>JSON.parse(x[0].conf_value) as MainButton[])
              // .timeout(timeoutSet, "paymethod.getButtonNew "+timeoutTip)
              .catch(x=>Observable.of(env.payButtons as MainButton[]))
              .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        });
    }
    return Observable.of(JSON.parse(ret));
  }

  getPaymethodDefaultWaiting(){
    if(env.isDev){
      return Observable.of(env.paySelectTimeout);
    }
    const key = "paymethodDefaultWaiting";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
    return this.http.get(confUrlPrefix+"confname=paymethod-defaultwaiting").map(x=>x.json())
        // .timeout(timeoutSet, "getPaymethodDefaultAWaiting "+timeoutTip)
        .map(x=>x[0].conf_value).catch(x=>Observable.of("30"))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    });}
    return Observable.of(JSON.parse(ret));
  }

  getProductUrl(){
    if(env.isDev) return Observable.of(env.productUrl);
    const key= "productUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=product").map(x=>x.json())
          // .timeout(timeoutSet, "getProductUrl "+timeoutTip)
          .map(x=>x[0].conf_value).catch(err=>Observable.of(env.productUrl))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret));
  }

  getOrdermainUrl(){
    if(env.isDev) return Observable.of(env.ordermainUrl);
    const key="ordermainUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=ordermain").map(x=>x.json())
          // .timeout(timeoutSet, "getOrdermainUrl "+timeoutTip)
          .map(x=>x[0].conf_value).catch(err=>Observable.of(env.ordermainUrl))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }

  getPaycashTimeVars(){
    const key = "paycashTimeVars";
    if(env.isDev) return Observable.of(env.paycashTimeVar);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=paycash-timevars").map(x=>x.json())
          // .timeout(timeoutSet, "getTimeVars" + timeoutTip)
          .map(x=>JSON.parse(x[0].conf_value) as TimeVars).catch(x=>Observable.of(TIMEVARS))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }
  getPaywxTimeVars(){
    const key = "paywxTimeVars";
    if(env.isDev) return Observable.of(env.payWXTimeVars);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=wxpaytimevars").map(x=>x.json())
          // .timeout(timeoutSet, "getPaycashVars" + timeoutTip)
            .map(x=>JSON.parse(x[0].conf_value) as WXPayTimeVars)
            .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        })};
    return Observable.of(JSON.parse(ret));
  }

  getPaycashVars(){
    const key = "paycashVars";
    if(env.isDev) return Observable.of(env.paycashVars).do(x=>localStorage.setItem(key, JSON.stringify(x)));
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=paycash-paycashvars").map(x=>x.json())
          // .timeout(timeoutSet, "getPaycashVars" + timeoutTip)
          .map(x=>JSON.parse(x[0].conf_value) as PaycashVars)
          .catch(x=>Observable.of(env.paycashVars))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }


  getAuthUrl(){
    const key = "authUrl";
    if(env.isDev) return Observable.of(env.authUrl);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=loginapi").map(x=>x.json())
          // .timeout(timeoutSet, "getAuthUrl" + timeoutTip)
          .map(x=>x[0].conf_value).catch(err=>Observable.of(env.authUrl))
          .do(x=>localStorage.setItem(key, x));
    })}
    return Observable.of(ret);
  }

  getDisableClickReturn(){
    if(env.isDev) return Observable.of("15");
    const key="disableClickReturn";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix + "confname=home-disableClickReturn")
        // .timeout(timeoutSet, new Error("getDisableClickReturn " + timeoutTip))
          .map(res => res.json() as Conf[]).map(x => x[0].conf_value)
          .catch(x => Observable.of("15"))
          .do(x=>localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getLoginDefaultWaiting(){
    if(env.isDev) return Observable.of(env.loginDefaultWaiting);
    const key="loginDefaultWaiting";
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=login-defaultwaiting").map(x=>x.json())
          // .timeout(timeoutSet, "getLoginDefaultWaiting" + timeoutTip)
          .map(x=>x[0].conf_value).catch(x=>Observable.of("30"))
          .do(x=>localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getDeviceUrl(){
    const key = "deviceUrl";
    if(env.isDev){return Observable.of(env.deviceUrl)}
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=cashbox")
          .map(x=>x.json())
          // .timeout(timeoutSet, "getDeviceUrl" + timeoutTip)
          .map(x=>x[0].conf_value)
          .do(x=>localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getSlotTestUrl(){
    const key = "slotTestUrl";
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=controlboardapi")
          .map(x=>x.json())
          // .timeout(timeoutSet, "getDeviceUrl" + timeoutTip)
          .map(x=>x[0].conf_value)
          // .catch(x=>Observable.of(slotTestUrl))
          .do(x=>localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getCoinChangePostUrl(){
    const key = "coinChangePostUrl";
    if(env.isDev) return Observable.of(env.coinchangepostUrl);
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=coinchangelogcreate")
          .map(x=>x.json())
          // .timeout(timeoutSet, "getCoinChangeUrl" + timeoutTip)
          .map(x=>x[0].conf_value)
          .catch(x=>Observable.of(env.coinchangepostUrl))
          .do(x=> localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getCoinChangeLogUrl(){
    const key = "coinChangeLogUrl";
    if(env.isDev) return Observable.of(env.coinchangelogUrl);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix + "confname=coinchangelog")
          .map(x => x.json())
          // .timeout(timeoutSet, "getCoinChangeUrl" + timeoutTip)
          .map(x => x[0].conf_value)
          .catch(x => Observable.of(env.coinchangelogUrl))
          .do(x=> localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getDeviceLogUrl(){
    const key="deviceLogUrl";
    if(env.isDev) return Observable.of(env.devicelogUrl);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
     return this.http.get(confUrlPrefix+"confname=cashboxlog")
        .map(x=>x.json())
        .map(x=>{return x[0].conf_value})
        // .catch(x=>{return Observable.of(devicelogUrl)})
         .do(x=> localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getControlBoardUrl(){
    const key = "controlboardapi";
    if(env.isDev) return Observable.of(env.controlboardUrl);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=controlboardapi").map(x=>x.json())
        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(env.controlboardUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }
  getVendingConfUrl(){
    const key = "vendingconf";
    if(env.isDev) return Observable.of(env.vendingConfUrl);
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=vendingconf").map(x=>x.json())
      // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(env.vendingConfUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      // return Observable.of(vendingConfUrl).do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }
  getVersionUrl(){
    const key = "versionUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=version").map(x=>x.json())
      // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(env.versionUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret));
  }

  getPullcodeUrl(){
    const key = "pullcodeUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=pullcode").map(x=>x.json())
      // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(env.pullcodeUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }

  getShutdownUrl(){
    const key = "shutdownUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=shutdown").map(x=>x.json())
      // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(env.shutdownUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }
  getRebootUrl(){
    if(env.isDev) return Observable.of(env.rebootUrl);
    const key = "rebootUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=reboot").map(x=>x.json())
          // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
            .map(x=>x[0].conf_value)
            .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        })};
    return Observable.of(JSON.parse(ret));
  }

  getVendingStatus(): Observable<VendingStatus>{
    const key = "vendingstatus";
    if(env.isDev){
        return Observable.of(env.vendingStatus).do(x=>{localStorage.setItem(key, JSON.stringify(x));return x;});;
    }
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.http.get(env.vendingStatusUrl).map(x=>{return x.json() as VendingStatus})
        .do(x=>{localStorage.setItem(key, JSON.stringify(x));return x;});
    }
    return Observable.of(JSON.parse(ret));
  }

  
}
