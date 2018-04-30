// src/app/topbanner/ngb2/topbanner.component.ts
import {Component, Input} from '@angular/core';

@Component({
  selector: 'topbanner',
  template: './topbanner.component.html',
  styleUrls: ['./topbanner.component.scss']
})
export class TopBanner {
  @Input()
  pageWaiting: number;
}

