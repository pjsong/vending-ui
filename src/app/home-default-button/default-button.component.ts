import {Component, OnInit} from '@angular/core';

import {Router, ActivatedRoute, Params} from "@angular/router";
import {MainButton} from "./default-button.services";
import {Observable, of, Subject} from "rxjs";
import {map, filter, timeoutWith,retryWhen,catchError} from 'rxjs/operators'
import {HomeService} from "../home/home.service";
import {ConfService} from "../home/conf.service";
import { Environment as env} from '../environments/environment';

@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.scss'],
})

export class DefaultButton implements OnInit{
  mainButtons: MainButton[];
  timeoutMsg:string = '';
  constructor(private route: ActivatedRoute, private router:Router, private service: ConfService, private homeService: HomeService){
  }

  ngOnInit(){
    this.homeService.setPageWaiting('defaultButton->ngOnInit', 0);
    localStorage.clear();
    if(env.isDev) {
      this.mainButtons = env.mainButton;
      return;
    }
    this.service.initWXPayConnection().pipe(timeoutWith(2000, Observable.throw(new Error('TimeoutError')))
      ,catchError(err=>{
        if(err.name == 'TimeoutError'){
          this.timeoutMsg = '网络超时';
        }else{
          console.log('initWXPayConnection err:' + err.name);this.timeoutMsg = '网络连接异常';
        }
        return Observable.throw(err);}))
        // ,retryWhen(error=>error.delay(60*1000)))
      .subscribe(x=>{
      //console.log(JSON.stringify(x));
      this.service.getHomepageButton().subscribe(x=>{
        this.mainButtons = x;
      },
      error=>{
        this.timeoutMsg = '数据处理异常';
      });
     });
  }
}
