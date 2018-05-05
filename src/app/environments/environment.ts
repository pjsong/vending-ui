const configserveraddr = "http://172.18.0.4/";
const devicelogserveraddr = "http://172.18.0.2/";
const localserveraddr = "http://localhost:8000/";
const fileserveraddr = "http://static.oursmedia.cn/";
const wxServer = "https://api.scheduler.oursmedia.cn/";
const deviceUrl= "http://localhost:8000/api/data/cashmachine/cashbox/?format=json"

const pic1 = "assets/img/defaultbutton/slotbuy.png";//"https://simimg.com/i/SmRlX";
const pic2 = "assets/img/defaultbutton/membership.png";//"https://simimg.com/i/SmnBl";
const pic3 = "assets/img/defaultbutton/vendor-management.png";//"https://simimg.com/i/Sm7vy";

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
    loginDefaultWaiting: "300",
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
    currentPayoutAvailableCmdTest : {"id": 1, "operate_name":"current_payout_available", "operate_data":0, "create_time":"2016-12-29 09:38:21"},
    ctCurrentPayoutAvailable : [{ "id": 5586,  "operate": 1,  "operate_status": "succeed",  "ret_data": 130,  "create_time": "2016-12-29 06:52:55"}],
    tollTestCmdRet : {"id": 99, "operate_name":"toll", "operate_data":9, "create_time":"2016-12-29 09:38:21"},
    terminateTestCmdRet : {"id": 99, "operate_name":"terminate", "operate_data":9, "create_time":"2016-12-29 09:38:21"},
    CashboxLogTest : [{"id":100,"operate": 99,   "operate_status": "succeed",  "ret_data": 20, "create_time":"2016-12-29 06:52:55"}],
    CashboxLogTestTerm : [{"id":100,"operate": 99,   "operate_status": "succeed",  "ret_data": -1, "create_time":"2016-12-29 06:52:55"}],
    CashboxLogTest1 : [{"id":39015,"operate":99,"operate_status":"processing","ret_data":10,"create_time":"2016-12-31 08:06:01"}],
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
    slotUpdateReq:[{id: 1, slot: 1,running_status:"1", before_item_num: 12, variation_num: 2, current_item_num: 10, malfunction_report_count: 0, slot_no: "001", user:1, create_time:"2016-04-04 01:01:01", update_time: "2016-04-04 01:01:01"}],  
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
    ],
    payButtons: 
    [
      {"id":1, "imgUrl":"https://s1.ax2x.com/2018/05/03/Sb4CA.png","buttonTxt":"现金支付","linkTarget":"../paycash"},
      {"id":2, "imgUrl":"https://s1.ax2x.com/2018/05/03/SbJ2O.png","buttonTxt":"微信支付","linkTarget":"../payweixin"},
      {"id":3, "imgUrl":"https://s1.ax2x.com/2018/05/01/SmRlX.png","buttonTxt":"会员支付","linkTarget":"../paymember"},
    ],
    vnedorManagementButton: 
    [
      {"id":1, "imgUrl":"","buttonTxt":"纸币找零","linkTarget":"./chargechange"},
      {"id":2, "imgUrl":"","buttonTxt":"硬币找零","linkTarget":"./chargecoin"},
      {"id":3, "imgUrl":"","buttonTxt":"货道维护","linkTarget":"./slotupdate"},
      {"id":4, "imgUrl":"","buttonTxt":"货道测试","linkTarget":"./slottest"},
      {"id":5, "imgUrl":"","buttonTxt":"软件更新","linkTarget":"./vendorupdate"},
    ],
    vendorManagementLoginRet: [{"detail":"OK"}],
    productTest: [
        {"id":1,"image_list_url":"http://172.18.0.3/static/images/vendor/front/604.jpeg",
          "product_name":"避孕套","sale_unit_price":9,"product_summary":"避孕套避孕套","product_desc":"避孕套避孕套避孕套"}
    ],

    vendingStatus: {"ip": "223.74.169.125", "hostname": "pjsong-spring001-001", "omddevice": "ok", "vmtype": "1", "ip_provider": "http://api.scheduler.oursmedia.cn/checkip", "md5": "fba10d5ab4cff3acbc1257acc8416c19", "conf_server": "http://172.16.0.4", "timestamp": "2017-04-25 23:54:17", "vm_slug":"pjsong-spring001-001","cashboxstatus": "ok", "coinmachinestatus":"ok","controlboardstatus":"ok"},
    paycashVars: {"payoutThreshold":90,"payoutCoinThreshold":29},
    deviceUrl: deviceUrl,

    paycashTimeVar: {"timeWithPay":60,"timeWithoutPay":50,"timeStartAlert":30,"timeAlertEnd":15,
"timeJumpToFinish":5,"queryInterval":2000},
    orderTaskTestRet: {"user":1, "slot":9, "product":1,"itemCount":2, "payType":0, "status":2, "totalPaid": 29,"changeLeft": 100},
    memberChargeTimeVar: {"timeWithPay":60,"timeWithoutPay":50,"timeStartAlert":30,"timeAlertEnd":15,
    "timeJumpToFinish":5,"queryInterval":2000},
    memberInfoUpdate: {
        "id": 2,
        "owner": 1,
        "user": 3,
        "balance": 98
      },
    chargeCoinRet: 
    [
      {"id":2, "user":1, "amount_before":100,"amount_data":-5, "amount_after":95, "create_time":"2017-01-05 10:01:09"}
      ,{"id":1, "user":1, "amount_before":0,"amount_data":100, "amount_after":100, "create_time":"2017-01-05 10:08:18"}
    ],
    slotUpdate: [{
        "slot": 1,
        "running_status": "1",
        "current_item_num": 11,
        "malfunction_report_count": 0
      }],
    payWXTimeVars:{
      timeWithPay: 60,
      timeWithoutPay: 120,
      timeStartAlert: 30,
      timeAlertEnd: 15,
      timeJumpToFinish: 5,
      queryInterval: 2000
    },
    payWXPollRet:{
      result: "SUCCESS"
    },
    payWXQRImgUrl:"assets/img/paymethod/wx_pay.png",
    payAliQRImgUrl:"assets/img/paymethod/ali_pay.png",
    paymemberTimeVars: {"timeWithPay":60,"timeWithoutPay":50,"timeStartAlert":30,"timeAlertEnd":15,
"timeJumpToFinish":5,"queryInterval":2000},
    vendingConf:  [
      {
        "slug": "pjsong-spring001-001",
        "sec": "7QL8YYGJy4uFK02YUT4Rl6ay1dihh502fQqV44ZNApx",
        "vm_type": 1,
        "charger": 1,
        "product_category": [
          1
        ],
        "charger_tel": "13509205735",
        "install_address": "jjj",
        "install_time": "2016-12-27 12:31:00",
        "alive_time": "2016-12-27 12:31:00"
      }
    ],
    testLoginRet: [{'token':'123456789'}]
}