const configserveraddr = "http://172.18.0.4/";
const devicelogserveraddr = "http://172.18.0.2/";
const localserveraddr = "http://localhost:8000/";
const fileserveraddr = "http://static.oursmedia.cn/";
const wxServer = "https://api.scheduler.oursmedia.cn/";

export const Environment = {
    isDev: true,
    name: "dev",
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

    mainButton : [
    {id: 1, imgUrl: 'http://172.18.0.3/static/images/vendor/front/homepage/On_Screen_Keyboard.png', buttonTxt:'货道购买', linkTarget:'../slotselect'}
    ,{id: 2,imgUrl: 'http://172.18.0.3/static/images/vendor/front/homepage/vendor-management.png',buttonTxt:'终端管理', linkTarget:'../vendor-management'}
    ,{id: 3,imgUrl: 'http://172.18.0.3/static/images/vendor/front/homepage/membership.png',buttonTxt:'会员充值', linkTarget:'../membercharge'}
    ],
    buttonTest: [
        {"id":1, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/On_Screen_Keyboard.png","buttonTxt":"货道购买","linkTarget":"../slotselect"},
        {"id":2, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/vendor-management.png","buttonTxt":"终端管理","linkTarget":"../vendor-management"},
        {"id":3, "imgUrl":"http://172.18.0.3/static/images/vendor/front/homepage/membership.png","buttonTxt":"会员充值","linkTarget":"../membercharge"},
        ]
}