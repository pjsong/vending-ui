const configserveraddr = "http://172.18.0.4/";
const devicelogserveraddr = "http://172.18.0.2/";
const localserveraddr = "http://localhost:8000/";
const fileserveraddr = "http://static.oursmedia.cn/";
const wxServer = "https://api.scheduler.oursmedia.cn/";
const pic1 = "https://s1.ax2x.com/2018/05/02/SVBMe.png";//"https://simimg.com/i/SmRlX";
const pic2 = "https://s1.ax2x.com/2018/05/01/SmRlX.png";//"https://simimg.com/i/SmnBl";
const pic3 = "https://s1.ax2x.com/2018/05/01/SmosJ.png";//"https://simimg.com/i/Sm7vy";
// https://s1.ax2x.com/2018/05/01/SmRlX.png

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
    slotSelectTimeout: "2000",
     
    mainButton : [
    {id: 1, imgUrl: pic1, buttonTxt:'货道购买', linkTarget:'../slotselect'}
    ,{id: 2,imgUrl: pic2, buttonTxt:'终端管理', linkTarget:'../vendor-management'}
    ,{id: 3,imgUrl: pic3, buttonTxt:'会员充值', linkTarget:'../membercharge'}
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
    currentPayoutAvailableCmdTest : {"id": 1, "operate_name":"currentPayoutAvailable", "operateData":0, "createTime":"2016-12-29 09:38:21"},
    ctCurrentPayoutAvailable : [{ "id": 5586,  "operate": 1,  "operate_status": "succeed",  "retData": 130,  "createTime": "2016-12-29 06:52:55"}],
    tollTestCmdRet : {"id": 99, "operate_name":"toll", "operate_data":9, "create_time":"2016-12-29 09:38:21"},
    terminateTestCmdRet : {"id": 99, "operate_name":"terminate", "operate_data":9, "create_time":"2016-12-29 09:38:21"},
    CashboxLogTest : [{"id":100,"operate": 99,   "operate_status": "succeed",  "retData": 20, "createTime":"2016-12-29 06:52:55"}],
    CashboxLogTest1 : [{"id":39015,"operate":99,"operate_status":"processing","retData":10,"createTime":"2016-12-31 08:06:01"}],
    slotStatusTest : [
        {id: 1, slot: 1, product: 1,runningStatus:"1", currentItemNum: 10, malfunctionReportCount: 0, slotNo: "009"},
        {id: 2, slot: 2, product: 1,runningStatus:"1", currentItemNum: 0, malfunctionReportCount: 0, slotNo: "004"},
        {id: 3, slot: 3, product: 1,runningStatus:"0", currentItemNum: 10, malfunctionReportCount: 0, slotNo: "009"},
        {id: 4, slot: 4, product: 1,runningStatus:"1", currentItemNum: 2, malfunctionReportCount: 0, slotNo: "009"}
      ]
}