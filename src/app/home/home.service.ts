import {Injectable} from "@angular/core";
import {Subject, Observable, of} from "rxjs";
import {map, filter} from 'rxjs/operators'
import {Http} from "@angular/http";
import {HttpUtils} from "../common/http-util";

@Injectable()
export class HomeService{
  //observable source
  private pageWaiting = new Subject<number>();
  private waitingCnt = new Subject<number>();
  private lockAcquired = new Subject<number>();
  //observable stream
  pageWaiting$ = this.pageWaiting.asObservable();
  waitingCnt$ = this.waitingCnt.asObservable();
  lockAcquired$ = this.lockAcquired.asObservable();

  httpUtils: HttpUtils;
  constructor(private http:Http){
    this.httpUtils = new HttpUtils(http);
  }
  // message command
  setPageWaiting(source: string, pw:number){
    // console.log(source + " is setting pagewaiting: " + pw);
    this.pageWaiting.next(pw);
  }

  setWaitingCnt(wc:number){
    this.waitingCnt.next(wc);
  }

  setLockAcquired(disabled:number){
    this.lockAcquired.next(disabled);
  }

}
