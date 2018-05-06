import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, flatMap, filter, tap } from "rxjs/operators";
import { Http } from "@angular/http";
import { HttpUtils } from "../common/http-util";
import { TimeVars, PaycashVars } from "../paymethod/paycash/paycash.service";
import { MainButton, VendingStatus, Conf } from "../home-default-button/default-button.services";
import { WXPayParams, WXPayTimeVars } from "../paymethod/payweixin/payweixin.service";
import { environment as env } from '../../environments/environment';

@Injectable()
export class ConfService {

    httpUtils: HttpUtils;
    constructor(private http: Http) {
        this.httpUtils = new HttpUtils(http);
    }

    confUrlPrefixWithVmtype(): Observable<string> {
        return this.getVendingStatus().pipe(map((x: VendingStatus) => {
            let ret = '';
            let vmtype = 'vmtype=' + x.vmtype;
            let prefixOriginal = env.configserver + "api/data/config/?format=json&";
            if (prefixOriginal.endsWith('&') || prefixOriginal.endsWith('?')) {
                ret = prefixOriginal + vmtype
            }
            else if (prefixOriginal.includes('&') || prefixOriginal.includes('?')) {
                ret = '&' + prefixOriginal + vmtype
            } else {
                ret = '?' + prefixOriginal + vmtype
            }
            return ret + '&';
        }));
    }

    getMemberchargeTimeVars() {
        if (env.isDev) return of(env.memberChargeTimeVar)
        const key = "membercharge-timevars";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            this.confUrlPrefixWithVmtype().pipe(
                flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=membercharge-timevars").pipe(
                        map(x => x.json()),
                        map(x => JSON.parse(x[0].conf_value) as TimeVars),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret));
    }

    getMemberUrl(): Observable<string> {
        if (env.isDev) return of(env.memberUrl);
        const key = "memberUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype().pipe(
                flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=member")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            // .catch(err=>of(memberUrl))
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret));
    }
    getWXPayServer() {
        if (env.isDev) return of(env.wxPayServer);
        const key = "wxPayUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=wxpay")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret))
    }
    getWXPayPollUrl() {
        if (env.isDev) return of(env.wxPayPollUrl);
        const key = "wxPayPollUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype().pipe(
                flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=wxpoll")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret))
    }
    getPayMemberTimeVars() {
        if (env.isDev) return of(env.paymemberTimeVars);
        const key = "payMemberTimeVars";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype().pipe(
                flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=paymember-timevars")
                        .pipe(map(x => x.json()),
                            map(x => JSON.parse(x[0].conf_value) as TimeVars),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret));
    }

    getSlotUrl() {
        if (env.isDev) return of(env.slotUrl);
        const key = "slotUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=slot")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret));
    }

    getSlotStatusUrl(): Observable<string> {
        if (env.isDev) return of(env.slotstatusUrl);
        const key = "slotStatusUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=slotstatus")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))))
                }));
        }
        return of(JSON.parse(ret));
    }

    getSlotSelectDefaultWaiting() {
        if (env.isDev) return of(env.slotSelectTimeout);
        const key = "slotselectdefaultwaiting";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=slotselect-defaultwaiting")
                        .pipe(map(res => res.json()),
                            map(x => x[0].conf_value));
                }))
        }
    }

    initWXPayConnection() {
        if (env.isDev) return of("OK");
        return this.http.get(env.wxPayHeartbeatUrl).pipe(map(x => x.json()));
    }
    getHomepageButton() {
        const key = "homepagebutton";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=default-button")
                        .pipe(
                            map(x => x.json()),
                            map(x => JSON.parse(x[0].conf_value) as MainButton[]));
                }));
        }
        return of(JSON.parse(ret));
    }


    getPayButton() {
        if (env.isDev) return of(env.payButtons as MainButton[]);
        const key = "paybutton";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype().pipe(
                flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=paymethod-button")
                        .pipe(map(x => x.json()),
                            map(x => JSON.parse(x[0].conf_value) as MainButton[]),
                            // .timeout(timeoutSet, "paymethod.getButtonNew "+timeoutTip)
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }));
        }
        return of(JSON.parse(ret));
    }

    getPaymethodDefaultWaiting() {
        if (env.isDev) {
            return of(env.paySelectTimeout);
        }
        const key = "paymethodDefaultWaiting";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=paymethod-defaultwaiting")
                        .pipe(map(x => x.json()),
                            // .timeout(timeoutSet, "getPaymethodDefaultAWaiting "+timeoutTip)
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }));
        }
        return of(JSON.parse(ret));
    }

    getProductUrl() {
        if (env.isDev) return of(env.productUrl);
        const key = "productUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=product")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret));
    }

    getOrdermainUrl() {
        if (env.isDev) return of(env.ordermainUrl);
        const key = "ordermainUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=ordermain")
                        .pipe(map(x => x.json()),
                            map(x => x[0].conf_value),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }

    getPaycashTimeVars() {
        const key = "paycashTimeVars";
        if (env.isDev) return of(env.paycashTimeVar);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=paycash-timevars")
                        .pipe(map(x => x.json()),
                            map(x => JSON.parse(x[0].conf_value) as TimeVars),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }
    getPaywxTimeVars() {
        const key = "paywxTimeVars";
        if (env.isDev) return of(env.payWXTimeVars);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=wxpaytimevars")
                        .pipe(map(x => x.json()),
                            // .timeout(timeoutSet, "getPaycashVars" + timeoutTip)
                            map(x => JSON.parse(x[0].conf_value) as WXPayTimeVars),
                            tap(x => localStorage.setItem(key, JSON.stringify(x))))
                }))
        };
        return of(JSON.parse(ret));
    }

    getPaycashVars() {
        const key = "paycashVars";
        if (env.isDev) return of(env.paycashVars).pipe(tap(x => localStorage.setItem(key, JSON.stringify(x))));
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=paycash-paycashvars")
                    .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getPaycashVars" + timeoutTip)
                        map(x => JSON.parse(x[0].conf_value) as PaycashVars),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }


    getAuthUrl() {
        const key = "authUrl";
        if (env.isDev) return of(env.authUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=loginapi")
                    .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getAuthUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, x)));
                }))
        }
        return of(ret);
    }

    getDisableClickReturn() {
        if (env.isDev) return of("15");
        const key = "disableClickReturn";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=home-disableClickReturn")
                        // .timeout(timeoutSet, new Error("getDisableClickReturn " + timeoutTip))
                        .pipe(map(res => res.json() as Conf[]),
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getLoginDefaultWaiting() {
        if (env.isDev) return of(env.loginDefaultWaiting);
        const key = "loginDefaultWaiting";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=login-defaultwaiting")
                    .pipe(map(x => x.json()),
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getDeviceUrl() {
        const key = "deviceUrl";
        if (env.isDev) { return of(env.deviceUrl) }
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=cashbox")
                        .pipe(map(x => x.json()),
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getSlotTestUrl() {
        const key = "slotTestUrl";
        if (env.isDev) return of(env.slotTestUrl)
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=controlboardapi")
                        .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getDeviceUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        // .catch(x=>of(slotTestUrl))
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getCoinChangePostUrl() {
        const key = "coinChangePostUrl";
        if (env.isDev) return of(env.coinchangepostUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=coinchangelogcreate")
                        .pipe(map(x => x.json()),
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getCoinChangeLogUrl() {
        const key = "coinChangeLogUrl";
        if (env.isDev) return of(env.coinchangelogUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=coinchangelog")
                        .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getCoinChangeUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getDeviceLogUrl() {
        const key = "deviceLogUrl";
        if (env.isDev) return of(env.devicelogUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=cashboxlog")
                        .pipe(map(x => x.json()),
                        map(x => { return x[0].conf_value }),
                        // .catch(x=>{return of(devicelogUrl)})
                        tap(x => localStorage.setItem(key, x)));
                }))
        };
        return of(ret);
    }

    getControlBoardUrl() {
        const key = "controlboardapi";
        if (env.isDev) return of(env.controlboardUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=controlboardapi")
                    .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }
    getVendingConfUrl() {
        const key = "vendingconf";
        if (env.isDev) return of(env.vendingConfUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=vendingconf")
                    .pipe(map(x => x.json()),
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                    // return of(vendingConfUrl).do(x=>localStorage.setItem(key, JSON.stringify(x)));
                }))
        };
        return of(JSON.parse(ret));
    }
    getVersionUrl() {
        if(env.isDev) return of(env.versionUrl);
        const key = "versionUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=version").pipe(
                        map(x => x.json()),
                        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        }
        return of(JSON.parse(ret));
    }

    getPullcodeUrl() {
        const key = "pullcodeUrl";
        if (env.isDev) return of(env.pullcodeUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=pullcode")
                    .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }

    getShutdownUrl() {
        const key = "shutdownUrl";
        if (env.isDev) return of(env.shutdownUrl);
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=shutdown")
                    .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }
    getRebootUrl() {
        if (env.isDev) return of(env.rebootUrl);
        const key = "rebootUrl";
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.confUrlPrefixWithVmtype()
                .pipe(flatMap(confUrlPrefix => {
                    return this.http.get(confUrlPrefix + "confname=reboot")
                    .pipe(map(x => x.json()),
                        // .timeout(timeoutSet, "getControlBoardUrl" + timeoutTip)
                        map(x => x[0].conf_value),
                        tap(x => localStorage.setItem(key, JSON.stringify(x))));
                }))
        };
        return of(JSON.parse(ret));
    }

    getVendingStatus(): Observable<VendingStatus> {
        const key = "vendingstatus";
        if (env.isDev) {
            return of(env.vendingStatus).pipe(tap(x => { localStorage.setItem(key, JSON.stringify(x)); return x; }));
        }
        let ret = localStorage.getItem(key);
        if (ret == null) {
            return this.http.get(env.vendingStatusUrl)
            .pipe(map(x => { return x.json() as VendingStatus }),
                tap(x => { localStorage.setItem(key, JSON.stringify(x)); return x; }));
        }
        return of(JSON.parse(ret));
    }


}
