// src/app/topbanner/ngb2/topbanner.component.ts
import {Component, Input, OnInit} from '@angular/core';
import {ConfService} from "../home/conf.service";
import {FooterBannerService} from "./footerbanner.service";
import {Member} from "../membercharge/membercharge.services";
import {flatMap} from "rxjs/operators"
 
@Component({
  selector: 'footerbanner',
  templateUrl: 'footerbanner.component.html',
  styleUrls: ['./footerbanner.component.scss']
})
export class FooterBanner implements OnInit{
  manager:Member;

  constructor(private confService: ConfService, private footerBannerService: FooterBannerService){}

  ngOnInit(){
    this.confService.getMemberUrl()
      .pipe(flatMap(url=> this.footerBannerService.getManagerInfo(url)))
      .subscribe(x=>{
        // console.log(JSON.stringify(x))
        this.manager = x as Member;
    });
  }
}

