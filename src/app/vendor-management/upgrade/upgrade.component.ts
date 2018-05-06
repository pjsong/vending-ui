import {Component, OnInit} from '@angular/core';
import {HomeService} from "../../home/home.service";
import {ConfService} from "../../home/conf.service";
import {UpgradeService, VersionAPIRet, UpdateMsgRet} from "./upgrade.service";
import {Observable, Subscription, interval} from "rxjs";
import {flatMap} from "rxjs/operators"

@Component({
  selector: 'upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})



export class Upgrade implements OnInit{
  pullcodeUrl: string;
  versionUrl: string;
  shutdownUrl: string;
  rebootUrl: string;
  processMsg: string;
  cmdDisplay:boolean = true;
  retDisabled:boolean = false;
  uiVersion: string;
  deviceVersion: string;
  dataVersion: string;

  intervalSource$:any;
  intervalSourceSubscription: Subscription;

  public constructor(private homeService: HomeService, private confService: ConfService, private upgradeService: UpgradeService) {
  }

  ngOnInit(){
    this.homeService.setPageWaiting('chargeChange->ngOnInit', 60);
    this.confService.getVersionUrl().pipe(
      flatMap(versionUrl=>this.upgradeService.getVersion(versionUrl)))
      .subscribe((versionAPIRet: VersionAPIRet)=>{
      this.uiVersion = versionAPIRet.vendingui;
      this.deviceVersion = versionAPIRet.omddevice;
      this.dataVersion = versionAPIRet.omddata;
    });
    this.confService.getPullcodeUrl().subscribe(pullcodeUrl=>this.pullcodeUrl = pullcodeUrl);
    this.confService.getShutdownUrl().subscribe(sdUrl=>this.shutdownUrl = sdUrl);
    this.confService.getRebootUrl().subscribe(sdUrl=>this.rebootUrl = sdUrl);

    this.intervalSource$ = interval(2000);
  }

  onCmdClicked(cmdNum: string){
    if(cmdNum == "return") {
       //placeHolder, no use for now
    }
  }
  cmdClicked(cmdNum: number){
    if(cmdNum == 0){//upgrade
      this.intervalSourceSubscription = this.intervalSource$
        .pipe(flatMap((x:any)=>{console.log("do operate interval start: " +x);return this.upgradeService.getUpdateMsg(this.pullcodeUrl)}))
        .subscribe(
          (dataRet:UpdateMsgRet)=> {
            this.processMsg = (dataRet.return);
            if(this.processMsg == "done" || this.processMsg == "更新完成"){
              this.intervalSourceSubscription.unsubscribe();
            }
          }
        );

    }else if(cmdNum ==1){//shutdown
      this.upgradeService.shutdown(this.shutdownUrl).subscribe(x=>this.processMsg = x.return)

    }else if(cmdNum ==2){//open cabin
      this.upgradeService.reboot(this.rebootUrl).subscribe(x=>this.processMsg = x.return)

    }
  }
}
