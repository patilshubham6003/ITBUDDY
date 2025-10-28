import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonFunctionService } from 'src/app/grass/Services/CommonFunctionService';
import { ExportService } from 'src/app/Service/export.service';
import { ServiceService } from 'src/app/Service/service.service';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
@Component({
  selector: 'app-ithr-summary-report',
  templateUrl: './ithr-summary-report.component.html',
  styleUrls: ['./ithr-summary-report.component.css'],
  providers: [DatePipe],
})
export class IthrSummaryReportComponent {
  public commonFunction = new CommonFunctionService();

  constructor(
    private api: ServiceService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService,
    public router: Router
  ) {}

  loadingpieRecords: boolean = false;
  carddata: any;
  showdash() {
    this.router.navigateByUrl('/claim/reportview');
  }

  year: any;

  ngOnInit() {
    // this.year[0] = startOfYear(new Date());
    // this.year[1] = endOfYear(new Date());

    // this.getCardDashboardReport();
    this.search();
    this.GetOfficeData();
    this.GetRankData();
  }
  getCardDashboardReport() {
    // this.year[0] = this.datepipe.transform(this.year[0], 'yyyy-MM-dd');
    // this.year[1] = this.datepipe.transform(this.year[1], 'yyyy-MM-dd');

    // var filter = '';
    // var IS_GAZZETTED: any = '';
    // if (this.roleid == 55) {
    //   filter = ' AND IS_GAZZETTED=1'
    //   IS_GAZZETTED = 1;
    // } else if (this.roleid == 56) {
    //   filter = ' AND IS_GAZZETTED=0'
    //   IS_GAZZETTED = 0;
    // }

    this.api
      .getCardDashboardReport(0, 0, '', '', '', this.year[0], this.year[1], '')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.carddata = data['data'][0];
          }
        },
        (err) => {}
      );
  }

  formTitle: any = 'ITHR Summary Report';
  applyFilter() {
    this.search();
  }

  clearFilter() {
    this.Office = null;
    this.date1 = null;
    this.Rank = null;
    this.search(true,false)
  }
  isSpinning: boolean = false;
  isFilterApplied: any = 'primary';

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  Office: any;
  Rank: any;
  date1: any;
  filterClass: string = 'filter-visible';
  JoinigDate1: any;
  OfficeDatalist: any;
  Ranklist: any;

  loadingRecords: boolean = false;
  filterQuery: any;
  abcosdingcount: any;
  retrimentcount: any;

  spin: boolean = false;
  spin2: boolean = false;
  spin3: boolean = false;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var likeQuery = '';
    var dataOffice = '';
    var dataOffice1 = '';
    var dataOfficerank = '';
    var dataOfficerank1 = '';
    var dataOfficeregist1 = '';

    var dataOfficeregist = '';

    if (this.Office != null && this.Office != undefined && this.Office != '') {
      dataOffice += ' AND ITHR_OFFICE_ID IN ' + '(' + this.Office + ')';
      dataOffice1 += ' AND OFFICE_ID IN ' + '(' + this.Office + ')';
    }

    if (this.Rank != null && this.Rank != undefined && this.Rank != '') {
      dataOfficerank += ' AND DESIGNATION_ID IN ' + '(' + this.Rank + ')';
      dataOfficerank1 += ' AND RANK_ID IN ' + '(' + this.Rank + ')';
    }

    if (this.date1 != undefined && this.date1 != null && this.date1 != '') {
      var FROM_DATE: any = this.datePipe.transform(this.date1[0], 'yyyy-MM-dd');
      var TO_DATE: any = this.datePipe.transform(this.date1[1], 'yyyy-MM-dd');
      dataOfficeregist +=
        " AND RETIREMENT_DATE BETWEEN '" +
        FROM_DATE +
        "' AND '" +
        TO_DATE +
        "'";
      dataOfficeregist1 +=
        " AND DOJ_PRESENT_POST BETWEEN '" +
        FROM_DATE +
        "' AND '" +
        TO_DATE +
        "'";
    }

    this.spin = true;
    this.spin2 = true;
    this.spin3 = true;

    this.api
      .getretrimentcount(
        0,
        0,
        '',
        '',
        likeQuery + dataOffice + dataOfficerank + dataOfficeregist +" AND IS_ITHR_DATA=1"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.spin = false;

            this.retrimentcount = data['data'][0];
            this.spin = false;
          } else {
            this.spin = false;
            this.message.error('Something Went Wrong...', '');
          }
        },
        (err) => {
          this.spin = false;
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );

    this.api
      .getabscoundingcount(
        0,
        0,
        '',
        '',
        likeQuery + dataOffice1 + dataOfficerank1 + dataOfficeregist1+" AND IS_ITHR_DATA=1"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;

            this.abcosdingcount = data['data'][0];
            this.spin2 = false;
          } else {
            this.spin2 = false;
            this.message.error('Something Went Wrong...', '');
          }
        },
        (err) => {
          this.spin2 = false;
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );

    this.api
      .getotherdashcount(
        0,
        0,
        '',
        '',
        likeQuery +" AND IS_ITHR_DATA=1",
        this.Office,
        FROM_DATE,
        TO_DATE,
        this.Rank
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;

            this.carddata = data['data'];
            this.spin3 = false;
          } else {
            this.spin3 = false;
            this.message.error('Something Went Wrong...', '');
          }
        },
        (err) => {
          this.spin3 = false;
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
  }
  othercount: any;
  GetOfficeData() {
    this.api
      .getAllOfficeForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL'
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.OfficeDatalist = data['data'];
          } else {
            this.OfficeDatalist = [];
          }
        } else {
          this.message.error('Failed To Get Office Details', '');
          this.OfficeDatalist = [];
        }
      });
  }
  typelist: any;
  GetRankData() {
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL '
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Ranklist = data['data'];
            // this.Rank = data['data'][0]['ID'];
          } else {
            this.Ranklist = [];
          }
        } else {
          this.message.error('Failed To Get Cadre List', '');
          this.Ranklist = [];
        }
      });
  }
}
