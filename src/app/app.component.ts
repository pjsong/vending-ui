import {Component, ViewContainerRef} from '@angular/core';

//use import to imports application-wide css.
// for those css and html inside componnets, webpack loads with calls to require(), added by angular2-template-loader plug-in
// import 'bootstrap/dist/css/bootstrap.css';
// import '../../public/css/styles.css';
// import 'bootstrap/less/carousel.less';
// import 'font-awesome/css/font-awesome.min.css';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private viewContainerRef: ViewContainerRef){}
}
