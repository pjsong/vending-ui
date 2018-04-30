import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {HttpUtils} from "../common/http-util";
import {TimeVars, TIMEVARS, PaycashVars, PAYCASHVARS} from "../paymethod/paycash/paycash.service";
import {MainButton, VendingStatus, Conf} from "../home-default-button/default-button.services";
import {BUTTONSTEST} from "../paymethod/paymethod.services";
import {WXTIMEVARS, WXPayParams, WXPayTimeVars} from "../paymethod/payweixin/payweixin.service";

export const configserver = "http://172.18.0.4/";
export const vendingStatusUrl = configserver + "api/data/status";

export const devicelogserver = "http://172.18.0.2/";
export const fileserver = "http://static.oursmedia.cn/";
export const localserver = "http://localhost:8000/";
export const wxPayServer = "https://api.scheduler.oursmedia.cn/showPngQR";
export const wxPayPollUrl = "https://api.scheduler.oursmedia.cn/wxpaycheck";
export const wxPayHeartbeatUrl = "https://api.scheduler.oursmedia.cn/wxPayHeartbeat";

export const confUrlPrefix = configserver + "api/data/config/?format=json&";
export const memberUrl = configserver + "api/data/member/";
export const slotUrl = configserver + "api/data/slot/";
export const productUrl = configserver + "api/data/product/";
export const authUrl = configserver + "api/data/api-token-auth/";
export const adminloginUrl = configserver+ "api/data/perm/?format=json";
export const vendingConfUrl = configserver + "api/data/vendingmachine/";

export const coinchangepostUrl = devicelogserver + "api/data/coinchangelog/create/";
export const coinchangelogUrl = devicelogserver + "api/data/coinchangelog/?format=json";
export const slotstatusUrl = devicelogserver + "api/data/slotstatus/";
export const ordermainUrl = devicelogserver + "api/data/cashmachine/ordermain/?format=json";
export const devicelogUrl = devicelogserver + "api/data/cashmachine/cashboxlog/?format=json";
export const controlboardUrl = devicelogserver + "api/data/controlboard/";

export const versionUrl = localserver + "api/data/version/";
export const pullcodeUrl = localserver + "api/data/pullcode/";
export const slotTestUrl = localserver + "api/data/controlboard/testrun/?format=json";
export const shutdownUrl = localserver + "api/data/shutdown/";
export const rebootUrl = localserver + "api/data/reboot/";

export const timeoutSet = 200;
export const timeoutSetCashbox = 5000;
export const timeoutTip = ", timeout "+timeoutSet+ " exceed";


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
      let prefixOriginal = configserver + "api/data/config/?format=json&";
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
    const key = "wxPayUrl";
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=wxpay").map(x=>x.json())
        .map(x=>x[0].conf_value)
        //.catch(err=>Observable.of(wxPayServer))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      // return Observable.of(wxPayServer).do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret))
  }
  getWXPayPollUrl(){
    const key = "wxPayPollUrl";
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=wxpoll").map(x=>x.json())
        .map(x=>x[0].conf_value)
        //.catch(err=>Observable.of(wxPayPollUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      // return Observable.of(wxPayPollUrl).do(x=>localStorage.setItem(key, JSON.stringify(x)));
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
        //.catch(x=>Observable.of(TIMEVARS))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      })}
    return Observable.of(JSON.parse(ret));
  }

  getSlotUrl(){
    const key = "slotUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=slot").map(x=>x.json())
            .map(x=>x[0].conf_value)
            // .catch(err=>Observable.of(slotUrl))
            .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        })
    }
    return Observable.of(JSON.parse(ret));
  }

  getSlotStatusUrl(): Observable<string>{
    const key = "slotStatusUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix + "confname=slotstatus").map(x=>x.json())
          .map(x=>x[0].conf_value)
          // .catch(err=>Observable.of(slotstatusUrl))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
      });
    }
      return Observable.of(JSON.parse(ret));
  }

  getSlotSelectDefaultWaiting(){
    const key = "slotselectdefaultwaiting";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=slotselect-defaultwaiting")
            .map(res=>res.json())
            // .timeout(timeoutSet, "getSlotSelectDefaultWaiting "+timeoutTip)
            .map(x=>x[0].conf_value);
            // .catch(x=>Observable.of("20"));
        })
    }
  }

  initWXPayConnection(){
    return this.http.get(wxPayHeartbeatUrl).map(x=>x.json());
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
    const key = "paybutton";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=paymethod-button")
              .map(x=>x.json()).map(x=>JSON.parse(x[0].conf_value) as MainButton[])
              // .timeout(timeoutSet, "paymethod.getButtonNew "+timeoutTip)
              .catch(x=>Observable.of(BUTTONSTEST as MainButton[]))
              .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        });
    }
    return Observable.of(JSON.parse(ret));
  }

  getPaymethodDefaultWaiting(){
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
    const key= "productUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=product").map(x=>x.json())
          // .timeout(timeoutSet, "getProductUrl "+timeoutTip)
          .map(x=>x[0].conf_value).catch(err=>Observable.of(productUrl))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })}
    return Observable.of(JSON.parse(ret));
  }

  getOrdermainUrl(){
    const key="ordermainUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=ordermain").map(x=>x.json())
          // .timeout(timeoutSet, "getOrdermainUrl "+timeoutTip)
          .map(x=>x[0].conf_value).catch(err=>Observable.of(ordermainUrl))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }

  getPaycashTimeVars(){
    const key = "paycashTimeVars";
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
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=paycash-paycashvars").map(x=>x.json())
          // .timeout(timeoutSet, "getPaycashVars" + timeoutTip)
          .map(x=>JSON.parse(x[0].conf_value) as PaycashVars).catch(x=>Observable.of(PAYCASHVARS))
          .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }


  getAuthUrl(){
    const key = "authUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=loginapi").map(x=>x.json())
          // .timeout(timeoutSet, "getAuthUrl" + timeoutTip)
          .map(x=>x[0].conf_value).catch(err=>Observable.of(authUrl))
          .do(x=>localStorage.setItem(key, x));
    })}
    return Observable.of(ret);
  }

  getDisableClickReturn(){
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
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=cashbox")
          .map(x=>x.json())
          // .timeout(timeoutSet, "getDeviceUrl" + timeoutTip)
          .map(x=>x[0].conf_value)
          // .catch(x=>Observable.of("http://localhost:8000/api/data/cashmachine/cashbox/?format=json"))
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
    let ret = localStorage.getItem(key);
    if(ret == null){
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=coinchangelogcreate")
          .map(x=>x.json())
          // .timeout(timeoutSet, "getCoinChangeUrl" + timeoutTip)
          .map(x=>x[0].conf_value)
          .catch(x=>Observable.of(coinchangepostUrl))
          .do(x=> localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getCoinChangeLogUrl(){
    const key = "coinChangeLogUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix + "confname=coinchangelog")
          .map(x => x.json())
          // .timeout(timeoutSet, "getCoinChangeUrl" + timeoutTip)
          .map(x => x[0].conf_value)
          .catch(x => Observable.of(coinchangelogUrl))
          .do(x=> localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getDeviceLogUrl(){
    const key="deviceLogUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
     return this.http.get(confUrlPrefix+"confname=cashboxlog")
        .map(x=>x.json())
        // .timeout(timeoutSet, "getDeviceLogUrl" + timeoutTip)
        .map(x=>{return x[0].conf_value})
        // .catch(x=>{return Observable.of(devicelogUrl)})
         .do(x=> localStorage.setItem(key, x));
    })};
    return Observable.of(ret);
  }

  getControlBoardUrl(){
    const key = "controlboardapi";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=controlboardapi").map(x=>x.json())
        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(controlboardUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }
  getVendingConfUrl(){
    const key = "vendingconf";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
      return this.http.get(confUrlPrefix+"confname=vendingconf").map(x=>x.json())
      // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
        .map(x=>x[0].conf_value).catch(err=>Observable.of(vendingConfUrl))
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
        .map(x=>x[0].conf_value).catch(err=>Observable.of(versionUrl))
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
        .map(x=>x[0].conf_value).catch(err=>Observable.of(pullcodeUrl))
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
        .map(x=>x[0].conf_value).catch(err=>Observable.of(shutdownUrl))
        .do(x=>localStorage.setItem(key, JSON.stringify(x)));
    })};
    return Observable.of(JSON.parse(ret));
  }
  getRebootUrl(){
    const key = "rebootUrl";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.confUrlPrefixWithVmtype()
        .flatMap(confUrlPrefix=>{
          return this.http.get(confUrlPrefix+"confname=reboot").map(x=>x.json())
          // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
            .map(x=>x[0].conf_value)
            .catch(err=>Observable.of(rebootUrl))
            .do(x=>localStorage.setItem(key, JSON.stringify(x)));
        })};
    return Observable.of(JSON.parse(ret));
  }

  getVendingStatus(): Observable<VendingStatus>{
    const key = "vendingstatus";
    let ret = localStorage.getItem(key);
    if(ret == null) {
      return this.http.get(vendingStatusUrl).map(x=>{return x.json() as VendingStatus})
        .do(x=>{localStorage.setItem(key, JSON.stringify(x));return x;});
    }
    return Observable.of(JSON.parse(ret));
  }
}
