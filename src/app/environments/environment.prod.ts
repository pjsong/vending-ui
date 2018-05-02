const configserveraddr = "http://172.18.0.4/";
const devicelogserveraddr = "http://172.18.0.2/";
const localserveraddr = "http://localhost:8000/";
const fileserveraddr = "http://static.oursmedia.cn/";
const wxServer = "https://api.scheduler.oursmedia.cn/";

export const environment = {
    isDev: false,
    name: "prod",
    configserver: configserveraddr,
    vendingStatusUrl: configserveraddr + "api/data/status",

    devicelogserver: devicelogserveraddr,
    fileserver: fileserveraddr,
    localserver: localserveraddr,
    wxPayServer: wxServer + "showPngQR",
    wxPayPollUrl: wxServer + "wxpaycheck",
    wxPayHeartbeatUrl: wxServer + "wxPayHeartbeat",

    confUrlPrefix: configserveraddr + "api/data/config/?format:json&",
    memberUrl: configserveraddr + "api/data/member/",
    slotUrl: configserveraddr + "api/data/slot/",
    productUrl: configserveraddr + "api/data/product/",
    authUrl: configserveraddr + "api/data/api-token-auth/",
    adminloginUrl: configserveraddr + "api/data/perm/?format:json",
    vendingConfUrl: configserveraddr + "api/data/vendingmachine/",

    coinchangepostUrl: devicelogserveraddr + "api/data/coinchangelog/create/",
    coinchangelogUrl: devicelogserveraddr + "api/data/coinchangelog/?format:json",
    slotstatusUrl: devicelogserveraddr + "api/data/slotstatus/",
    ordermainUrl: devicelogserveraddr + "api/data/cashmachine/ordermain/?format:json",
    devicelogUrl: devicelogserveraddr + "api/data/cashmachine/cashboxlog/?format:json",
    controlboardUrl: devicelogserveraddr + "api/data/controlboard/",

    versionUrl: localserveraddr + "api/data/version/",
    pullcodeUrl: localserveraddr + "api/data/pullcode/",
    slotTestUrl: localserveraddr + "api/data/controlboard/testrun/?format:json",
    shutdownUrl: localserveraddr + "api/data/shutdown/",
    rebootUrl: localserveraddr + "api/data/reboot/",

    timeoutSet: 200,
    timeoutSetCashbox: 5000,
    timeoutTip: ", timeout 200 exceed",
    mainButton: [
        {id: 1, imgUrl: 'http://172.18.0.3/static/images/vendor/front/homepage/On_Screen_Keyboard.png', buttonTxt:'货道购买', linkTarget:'../slotselect'}
        ,{id: 2,imgUrl: 'http://172.18.0.3/static/images/vendor/front/homepage/vendor-management.png',buttonTxt:'终端管理', linkTarget:'../vendor-management'}
        ,{id: 3,imgUrl: 'http://172.18.0.3/static/images/vendor/front/homepage/membership.png',buttonTxt:'会员充值', linkTarget:'../membercharge'}
        ],
    // buttonTest: [
    //     {"id":1, "imgUrl":pic1, "buttonTxt":"货道购买","linkTarget":"../slotselect"},
    //     {"id":2, "imgUrl":pic2, "buttonTxt":"终端管理","linkTarget":"../vendor-management"},
    //     {"id":3, "imgUrl":pic3, "buttonTxt":"会员充值","linkTarget":"../membercharge"},
    //     ],
    MANAGER_TEST: [{
        "id": 2,
        "owner": 1,
        "user": 3,
        "balance": 88,
        "date_joined": "2017-01-07 14:04:20",
        "username": "buyer",
        "tel_no":"13509205735",
        "wechat_no":"WX13509205735",
        "website":"http://oursmedia.cn"
        }],
    currentPayoutAvailableCmdTest : {"id": 1, "operateName":"currentPayoutAvailable", "operateData":0, "createTime":"2016-12-29 09:38:21"},
    ctCurrentPayoutAvailable : [{ "id": 5586,  "operate": 1,  "operate_status": "succeed",  "retData": 130,  "createTime": "2016-12-29 06:52:55"}],
    tollTestCmdRet : {"id": 99, "operateName":"toll", "operateData":9, "createTime":"2016-12-29 09:38:21"},
    terminateTestCmdRet : {"id": 99, "operateName":"terminate", "operateData":9, "createTime":"2016-12-29 09:38:21"},
    CashboxLogTest : [{"id":100,"operate": 99,   "operate_status": "succeed",  "retData": 20, "createTime":"2016-12-29 06:52:55"}],
    CashboxLogTest1 : [{"id":39015,"operate":99,"operate_status":"processing","retData":10,"createTime":"2016-12-31 08:06:01"}]
            
}