const configserveraddr = "http://172.18.0.4/";
const devicelogserveraddr = "http://172.18.0.2/";
const localserveraddr = "http://localhost:8000/";
const fileserveraddr = "http://static.oursmedia.cn/";
const wxServer = "https://api.scheduler.oursmedia.cn/";
const pic1 = "https://s1.ax2x.com/2018/05/02/SVBMe.png";//"https://simimg.com/i/SmRlX";
const pic2 = "https://s1.ax2x.com/2018/05/01/SmRlX.png";//"https://simimg.com/i/SmnBl";
const pic3 = "https://s1.ax2x.com/2018/05/01/SmosJ.png";//"https://simimg.com/i/Sm7vy";

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
    paySelectTimeout: "2000",
     
    mainButton : [
    {id: 1, imgUrl: pic1, buttonTxt:'货道购买', linkTarget:'../slotselect'}
    ,{id: 2,imgUrl: pic2, buttonTxt:'终端管理', linkTarget:'../vendor-management'}
    ,{id: 3,imgUrl: pic3, buttonTxt:'会员充值', linkTarget:'../membercharge'}
    ],

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
        {id: 1, slot: 1,running_status:"1", before_item_num: 12, variation_num: 2, current_item_num: 10, malfunction_report_count: 0, slot_no: "001", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 2, slot: 2,running_status:"1", before_item_num: 2, variation_num: 2, current_item_num: 0, malfunction_report_count: 0, slot_no: "002", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 3, slot: 3,running_status:"0", before_item_num: 12, variation_num: 2, current_item_num: 10, malfunction_report_count: 0, slot_no: "003", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 4, slot: 4,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "004", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 5, slot: 5,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "005", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 6, slot: 6,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "006", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 7, slot: 7,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "007", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 8, slot: 8,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "008", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 9, slot: 9,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "009", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"},
        {id: 10, slot: 10,running_status:"1", before_item_num: 4, variation_num: 2, current_item_num: 2, malfunction_report_count: 0, slot_no: "010", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"}

      ],
    slotProduct: [
        {id: 1, vending_machine: 1, product: 1, slot_no: "001", capacity: 60, controll_type: "spring"},
        {id: 2, vending_machine: 1, product: 2, slot_no: "002", capacity: 60, controll_type: "spring"},
        {id: 3, vending_machine: 1, product: 3, slot_no: "003", capacity: 60, controll_type: "spring"},
        {id: 4, vending_machine: 1, product: 3, slot_no: "004", capacity: 60, controll_type: "spring"},
        {id: 5, vending_machine: 1, product: 3, slot_no: "005", capacity: 60, controll_type: "spring"},
        {id: 6, vending_machine: 1, product: 3, slot_no: "006", capacity: 60, controll_type: "spring"},
        {id: 7, vending_machine: 1, product: 3, slot_no: "007", capacity: 60, controll_type: "spring"},
        {id: 8, vending_machine: 1, product: 3, slot_no: "008", capacity: 60, controll_type: "spring"},
        {id: 9, vending_machine: 1, product: 3, slot_no: "009", capacity: 60, controll_type: "spring"},
    ]
}