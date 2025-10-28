import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-reportsview',
  templateUrl: './reportsview.component.html',
  styleUrls: ['./reportsview.component.css'],
})
export class ReportsviewComponent implements OnInit {
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getAllForms();
  }
  isCollapsed = false;
  MedicalTitle = 'Medical Reports';
  FileTitle = ' File Reports';
  TourTitle = ' Tour Reports';
  LTCTitle = ' LTC Reports';
  TransferTitle = ' Transfer Reports';
  OtherTitle = ' Other Reports';
  MEDICALEPORTS: any = [];
  reports: any = [];
  array: any = [];
  FILEREPORTS: any = [];
  LTCREPORTS: any = [];
  TOURREPORTS: any = [];
  TransferREPORTS: any = [];
  OtherREPORTS: any = [];
  roleId: any = Number(sessionStorage.getItem('roleId'));
  ITHRREPORTS: any = [];
  getAllForms() {
    if (
      this.roleId == 47 ||
      this.roleId == 46 ||
      this.roleId == 48 ||
      this.roleId == 49 ||
      this.roleId == 50 ||
      this.roleId == 56
    ) {
      this.api.getForms1(this.roleId).subscribe(
        (data1) => {
          this.reports = data1['data'];

          for (let k = 0; k < this.reports.length; k++) {
            if (this.reports[k].title == 'Medical Reports') {
              this.MEDICALEPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'File Reports') {
              this.FILEREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'LTC Reports') {
              this.LTCREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'Tour Reports') {
              this.TOURREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'Transfer Reports') {
              this.TransferREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'Other Reports') {
              this.OtherREPORTS = this.reports[k].children;
            }
            if (this.reports[k].title == 'ITHR Reports') {
              this.ITHRREPORTS = this.reports[k].children.sort((a, b) => a.SEQ_NO - b.SEQ_NO);
            }
          }


        },
        (err) => {}
      );
    } else {
      this.api.getForms(this.roleId).subscribe(
        (data1) => {
          this.reports = data1['data'];

          for (let k = 0; k < this.reports.length; k++) {
            if (this.reports[k].title == 'Medical Reports') {
              this.MEDICALEPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'File Reports') {
              this.FILEREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'LTC Reports') {
              this.LTCREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'Tour Reports') {
              this.TOURREPORTS = this.reports[k].children;
            }

            if (this.reports[k].title == 'Transfer Reports') {
              this.TransferREPORTS = this.reports[k].children;
            }
            if (this.reports[k].title == 'ITHR Reports') {
              this.ITHRREPORTS = this.reports[k].children;
            }
          }
        },
        (err) => {}
      );
    }
  }
}
