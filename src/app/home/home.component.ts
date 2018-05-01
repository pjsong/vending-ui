import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import { Router } from "@angular/router";
import { HomeService } from "./home.service";
import { Subscription } from "rxjs";
import { ConfService } from "./conf.service";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class Home implements OnInit, OnDestroy {
  pageWaiting: number;
  waitingCnt: number = 0;
  disableClickReturn: number = 15;
  subscriptionPW: Subscription;
  constructor(private homeService: HomeService, private confService: ConfService, private router: Router) {
    this.confService.getDisableClickReturn().subscribe(x => {
      if (!isNaN(+x)) {
        this.disableClickReturn = +x;
        // console.log(this.disableClickReturn)
      }
    });
  }

  ngAfterViewInit() {
    setInterval(() => {
      if (this.waitingCnt > 0) {
        this.waitingCnt--;
      }
      //conduct current value to page
      this.homeService.setWaitingCnt(this.waitingCnt);
      if (!this.router.isActive("default-button", true) && this.waitingCnt == 0) {
        // no pagewaiting time indicator
        this.router.navigate(['/']);
      }
    }, 1000)
  }

  ngOnInit() {
    //get initial value from page
    this.subscriptionPW = this.homeService.pageWaiting$.subscribe(pw => {
      this.pageWaiting = pw;
      this.waitingCnt = this.pageWaiting;
    });

  }
  ngOnDestroy() {
    console.log("homeservice subscribe destroyed");
    if (this.subscriptionPW) {
      this.subscriptionPW.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(ev: Event) {
    if (this.waitingCnt > this.disableClickReturn) {
      this.waitingCnt = this.pageWaiting;
    }
  }
}
