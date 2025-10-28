import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { senioritypass } from 'src/app/grass/Models/SeniorityDatapass';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-notice-vacant',
  templateUrl: './notice-vacant.component.html',
  styleUrls: ['./notice-vacant.component.css'],
})
export class NoticeVacantComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() employeedata1: AllotmentMaster;
  @Input() Senioritydata1!: senioritypass;
  @Input() arrayofflatsdata: any[];

  emdata: any;
  seniority: any;
  flatlists: any[] = [];
  Prefflat: any[] = [];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }

  visible = false;

  open(): void {
    this.visible = true;
  }
  notundefined = false;
  ngOnInit() {
    if (this.employeedata1 != undefined && this.Senioritydata1 != undefined) {
      this.notundefined = true;
    } else {
      this.notundefined = false;
    }
    if (this.employeedata1) {
      this.emdata = this.employeedata1;
    }
    if (this.arrayofflatsdata.length > 0) {
      this.Prefflat = this.arrayofflatsdata;
    }
    if (this.Senioritydata1) {
      this.seniority = this.Senioritydata1;
      // this.seniority.RESIDENCE_TYPE_NAME
      this.api
        .getQuarterMaster(
          0,
          0,
          'ID',
          'desc',
          " AND AVAILABLE_STATUS = 'A' AND IS_PUBLISHED=1 AND RESIDENCE_TYPE_ID = " +
          this.seniority.RESIDENCE_TYPE
        )
        .subscribe(
          (data) => {
            this.flatlists = data['data'];
          },
          (err) => { }
        );
    }
  }

  close() {
    this.drawerClose();
  }
}
