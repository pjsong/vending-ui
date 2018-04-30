import {Component, OnInit} from '@angular/core';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {MainButton} from "./default-button.services";
import {Observable} from "rxjs";
import {HomeService} from "../home/home.service";
import {ConfService} from "../home/conf.service";


@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.scss'],
})

export class DefaultButton implements OnInit{
  mainButtons: MainButton[];
  timeoutMsg:string = '';
  // mainButtonsOld: Observable<MainButton[]>;
  constructor(private route: ActivatedRoute, private router:Router, private service: ConfService, private homeService: HomeService){
  }

  ngOnInit(){
    this.homeService.setPageWaiting('defaultButton->ngOnInit', 0);
    localStorage.clear();
    this.service.initWXPayConnection().timeoutWith(2000, Observable.throw(new Error('TimeoutError')))
      .catch(err=>{
        if(err.name == 'TimeoutError'){
          this.timeoutMsg = '网络超时';
        }else{
          console.log('initWXPayConnection err:' + err.name);this.timeoutMsg = '网络连接异常';
        }
        return Observable.throw(err);})
      .retryWhen(error=>error.delay(60*1000))
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
