import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-viewlogs',
  templateUrl: './viewlogs.component.html',
  styleUrls: ['./viewlogs.component.css'],
})
export class ViewlogsComponent implements OnInit {
  @Input() drawerClose1: Function;
  @Input() data;
  @Input() type;
  @Input() LOGS1: any = [];

  @Input() filename: string;
  @Input() FILE_OR_CLAIM;

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    private cookie: CookieService
  ) { }

  ngOnInit() { }
  LOGS2: any = [];
  startDateChange(event) {
    this.LOGS2 = [];
    this.LOGS1 = [];
    if (this.type == 'e') {

      if (event == true) {
        this.api
          .getLogs(0, 0, 'ID', 'asc', ' AND FILE_ID = ' + this.data.FILE_ID)
          .subscribe(
            (userData1) => {
              if (userData1['count'] == 0) {
                this.LOGS2 = [];
              } else {
                this.LOGS2 = userData1['data'];
                this.filename = this.LOGS2[0]['FILE_NUMBER'];
              }
            },
            (err) => {

            }
          );
      } else {
        this.api
          .getclaimLogs(0, 0, 'ID', 'asc', ' AND CLAIM_ID = ' + this.data.ID)
          .subscribe(
            (userData1) => {
              if (userData1['count'] == 0) {
                this.LOGS1 = [];
              } else {
                this.LOGS1 = userData1['data'];
              }
            },
            (err) => {

            }
          );
      }
    } else {
      if (this.FILE_OR_CLAIM == true) {
        this.api
          .getLogs(0, 0, 'ID', 'asc', ' AND FILE_ID = ' + this.data.ID)
          .subscribe(
            (userData1) => {
              if (userData1['count'] == 0) {
                this.LOGS2 = [];
              } else {
                this.LOGS2 = userData1['data'];
                this.filename = this.LOGS2[0]['FILE_NUMBER'];
              }
              // this.isVisible11 = true
            },
            (err) => {

            }
          );
      } else {
        this.api
          .getclaimLogs(
            0,
            0,
            'ID',
            'asc',
            ' AND CLAIM_ID = ' + this.data.CLAIM_ID
          )
          .subscribe(
            (userData2) => {
              if (userData2['count'] == 0) {
                this.LOGS1 = [];
              } else {
                this.LOGS1 = userData2['data'];
              }
              // this.isVisible11 = true
            },
            (err) => {

            }
          );
      }
    }
  }

  close() {
    this.LOGS2 = [];
    this.LOGS1 = [];
    this.filename = '';
    this.data = [];
    this.FILE_OR_CLAIM = false;
    this.drawerClose1();

  }

  reset(httpForm: NgForm) {
    // this.isSpinning = true;
    httpForm.reset();
  }
}
