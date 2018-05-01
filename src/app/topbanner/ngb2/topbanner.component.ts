import {Component, Input} from '@angular/core';

@Component({
  selector: 'topbanner',
  templateUrl: './topbanner.component.html',
  styleUrls: ['./topbanner.component.scss']
})
export class TopBanner {
  @Input()
  pageWaiting: number;
}

