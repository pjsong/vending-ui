import { Component, OnInit } from '@angular/core';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import { Router, ActivatedRoute } from "@angular/router";
import { VendorManagementService } from "./vendor-management.services";
import { HomeService } from "../home/home.service";
import { MainButton } from "../home-default-button/default-button.services";


@Component({
  selector: 'vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.scss'],
})

export class VendorManagement implements OnInit {
  adminLoginUrl: string;

  tButtons: MainButton[];
  disabled: boolean = false;
  isDisabled() {
    return this.disabled;
  }
  constructor(
    private route: ActivatedRoute, private router: Router, private service: VendorManagementService, private homeService: HomeService) { }

  ngOnInit() {
    this.service.getAdminLoginUrl().subscribe((x: any) => {
      this.adminLoginUrl = x;
      this.service.loginRetOKEvent.subscribe(x => {
        
        if (x == "OK") {
          this.homeService.lockAcquired$.subscribe(
            (x: number) => {
              if (x == 0) this.disabled = false;
              else this.disabled = true;
            }
          );
          this.service.getButtons().subscribe(x => this.tButtons = x);
        } else {
          console.log("loginRetOKEVent:" + x);
          this.router.navigate(["/"])
        }
      });
      this.service.adminLogin(this.adminLoginUrl);
    });


  }
}
