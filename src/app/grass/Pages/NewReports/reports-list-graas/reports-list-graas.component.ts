import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-reports-list-graas',
  templateUrl: './reports-list-graas.component.html',
  styleUrls: ['./reports-list-graas.component.css']
})
export class ReportsListGraasComponent implements OnInit {
  loadingpieRecords: boolean = false;
  menus: any = [];
  reports: any = [];
  roleId = Number(sessionStorage.getItem('roleId'));
  USERNAME = sessionStorage.getItem('userName');
  userId = Number(sessionStorage.getItem('userId'));
  constructor(private api: APIServicesService, private cookie: CookieService) { }
  ngOnInit() {
    this.getAllForms();
  }
  getAllForms() {
    this.loadingpieRecords = true;
    this.api.getForms(this.userId, this.roleId, 5).subscribe((data1) => {
      this.loadingpieRecords = false;
      if (data1['code'] == 200) {
        this.reports = data1['data'];
        for (let k = 0; k < this.reports.length; k++) {
          if (this.reports[k].title == 'Reports List') {
            this.menus = this.reports[k].children;
          }
        }
      } else {
        this.menus = [];
        this.loadingpieRecords = false;
      }
    },
      (err) => {
        this.loadingpieRecords = false;
      }
    );
  }
}