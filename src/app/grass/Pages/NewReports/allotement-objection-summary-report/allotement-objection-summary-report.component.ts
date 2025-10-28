import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-allotement-objection-summary-report',
  templateUrl: './allotement-objection-summary-report.component.html',
  styleUrls: ['./allotement-objection-summary-report.component.css'],
  providers: [DatePipe],
})
export class AllotementObjectionSummaryReportComponent {
  formTitle = ' Allotement Objection Summary ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  RESIDENCE_TYPE_ID: any = [];
  isSpinning = false;
  ResidenceTypelist: any = [];
  AVAILABLE_STATUS: any = '';
  columns: string[][] = [
    ['TOTAL', 'TOTAL'],
    ['REJECTED', 'REJECTED'],
    ['APPROVED', 'APPROVED'],
    ['PENDING', 'PENDING'],
    ['DELETED', 'DELETED'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
  ];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe, public router: Router,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  MONTH_RANGE: any = [];
  MONTH: any;
  YEAR: any;
  selectmonth: any = new Date();
  SELECTED_YEAR: any = new Date();
  MONTH2: any;
  MONTH1: any;
  onChangemonth(result: Date[]): void {
    if (result.length > 0) {
      let fromdate: any = new Date();
      let Todate: any = new Date();

      this.MONTH_RANGE[0] = new Date(
        result[0].getFullYear(),
        result[0].getMonth(),
        1
      );
      this.MONTH_RANGE[1] = new Date(
        result[1].getFullYear(),
        result[1].getMonth() + 1,
        0
      );
    }
  }
  onChangeyear(event: any) { }
  startdatenow = new Date();
  ngOnInit(): void {
    // this.search();
    this.MONTH_RANGE[0] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth(),
      1
    );
    this.MONTH_RANGE[1] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth() + 1,
      0
    );
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datepipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datepipe.transform(this.monthh2, 'yyyy-MM-dd');

    this.MONTH1 = this.datepipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.monthh2, 'yyyy-MM-dd');
    this.getResidenceTypestart();
  }
  monthh1: any;
  monthh2: any;
  monthh: any = [];
  showdash() {
    this.router.navigateByUrl('/grass/reports_list')
  }
  getResidenceTypestart() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
          }
          this.applyFilter();
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  keyup(event: any) {
    this.search(true);
  }

  dataList11: any = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = '';
      this.sortValue = 'desc';
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    // if (this.RESIDENCE_TYPE_ID.length != 0) {
    //   likeQuery += ' AND RESIDENCE_TYPE IN (' + this.RESIDENCE_TYPE_ID + ')';
    // }
    var dateFilter = '';
    if (this.monthh != null) {
      dateFilter =
        " AND  APPLICATION_DATETIME BETWEEN '" +
        this.datepipe.transform(this.monthh[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.monthh[1], 'yyyy-MM-dd') +
        "'";
    }
    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .getAllotementObjectionSummaryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList = [];
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
              this.dataList = [];
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getAllotementObjectionSummaryReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = [];
              this.dataList11 = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
              this.dataList11 = [];
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.exportLoading = false;
          }
        );
    }
  }

  exportLoading = false;
  importInExcel() {
    this.search(true, true);
  }

  applyFilter() {
    // if (
    //   this.selectmonth == null ||
    //   this.selectmonth == undefined ||
    //   this.selectmonth == ''
    // ) {
    //   this.message.error('Please Select Month', '');
    // }
    // // else if (
    // //   this.SELECTED_YEAR == null ||
    // //   this.SELECTED_YEAR == undefined ||
    // //   this.SELECTED_YEAR == ''
    // // ) {
    // //   this.message.error('Please Select Year', '');
    // // }
    // else {
    //   this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    //   this.YEAR = this.datepipe.transform(this.selectmonth, 'yyyy');
    //   this.isFilterApplied = 'primary';
    //   this.search(true);
    // }
    this.filterQuery = '';
    if (
      this.MONTH_RANGE.length > 0 &&
      this.YEAR !== null &&
      this.YEAR !== undefined &&
      this.YEAR !== '' &&
      this.RESIDENCE_TYPE_ID !== null &&
      this.RESIDENCE_TYPE_ID !== undefined &&
      this.RESIDENCE_TYPE_ID !== '' &&
      this.RESIDENCE_TYPE_ID.length > 0
    ) {
      this.filterQuery = '';
      this.MONTH1 = '';
      this.MONTH2 = '';
      this.SELECTED_YEAR = '';
      this.MONTH1 = this.datepipe.transform(this.MONTH_RANGE[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.MONTH_RANGE[1], 'yyyy-MM-dd');
      this.SELECTED_YEAR = this.datepipe.transform(this.YEAR, 'yyyy');
      this.filterQuery =
        " AND date(MONTH) BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' " +
        ' AND YEAR =' +
        this.SELECTED_YEAR +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.RESIDENCE_TYPE_ID +
        ')';
    } else if (
      this.MONTH_RANGE.length == 0 &&
      this.YEAR !== null &&
      this.YEAR !== undefined &&
      this.YEAR !== '' &&
      this.RESIDENCE_TYPE_ID !== null &&
      this.RESIDENCE_TYPE_ID !== undefined &&
      this.RESIDENCE_TYPE_ID !== '' &&
      this.RESIDENCE_TYPE_ID.length > 0
    ) {
      this.filterQuery = '';
      this.MONTH1 = '';
      this.MONTH2 = '';
      this.SELECTED_YEAR = '';
      this.SELECTED_YEAR = this.datepipe.transform(this.YEAR, 'yyyy');
      this.filterQuery =
        ' AND YEAR =' +
        this.SELECTED_YEAR +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.RESIDENCE_TYPE_ID +
        ')';
    } else if (
      this.MONTH_RANGE.length > 0 &&
      this.YEAR !== null &&
      this.YEAR !== undefined &&
      this.YEAR !== '' &&
      (this.RESIDENCE_TYPE_ID === null ||
        this.RESIDENCE_TYPE_ID === undefined ||
        this.RESIDENCE_TYPE_ID === '' ||
        this.RESIDENCE_TYPE_ID.length == 0)
    ) {
      this.filterQuery = '';
      this.MONTH1 = '';
      this.MONTH2 = '';
      this.SELECTED_YEAR = '';
      this.MONTH1 = this.datepipe.transform(this.MONTH_RANGE[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.MONTH_RANGE[1], 'yyyy-MM-dd');
      this.SELECTED_YEAR = this.datepipe.transform(this.YEAR, 'yyyy');
      this.filterQuery =
        " AND date(RAISE_OBJECTION_DATE_TIME) BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' " +
        ' AND YEAR =' +
        this.SELECTED_YEAR;
    } else if (
      this.MONTH_RANGE.length > 0 &&
      (this.YEAR === null || this.YEAR === undefined || this.YEAR === '') &&
      this.RESIDENCE_TYPE_ID !== null &&
      this.RESIDENCE_TYPE_ID !== undefined &&
      this.RESIDENCE_TYPE_ID !== '' &&
      this.RESIDENCE_TYPE_ID.length > 0
    ) {
      this.filterQuery = '';
      this.MONTH1 = '';
      this.MONTH2 = '';
      this.MONTH1 = this.datepipe.transform(this.MONTH_RANGE[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.MONTH_RANGE[1], 'yyyy-MM-dd');
      this.filterQuery =
        " AND date(RAISE_OBJECTION_DATE_TIME) BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' " +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.RESIDENCE_TYPE_ID +
        ')';
    } else if (
      this.MONTH_RANGE.length > 0 &&
      (this.YEAR === null || this.YEAR === undefined || this.YEAR === '') &&
      (this.RESIDENCE_TYPE_ID === null ||
        this.RESIDENCE_TYPE_ID === undefined ||
        this.RESIDENCE_TYPE_ID === '' ||
        this.RESIDENCE_TYPE_ID.length == 0)
    ) {
      this.filterQuery = '';
      this.MONTH1 = '';
      this.MONTH2 = '';
      this.MONTH1 = this.datepipe.transform(this.MONTH_RANGE[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.MONTH_RANGE[1], 'yyyy-MM-dd');
      this.filterQuery =
        " AND date(RAISE_OBJECTION_DATE_TIME) BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' ";
    } else if (
      this.MONTH_RANGE.length == 0 &&
      this.YEAR !== null &&
      this.YEAR !== undefined &&
      this.YEAR !== '' &&
      (this.RESIDENCE_TYPE_ID === null ||
        this.RESIDENCE_TYPE_ID === undefined ||
        this.RESIDENCE_TYPE_ID === '' ||
        this.RESIDENCE_TYPE_ID.length == 0)
    ) {
      this.filterQuery = '';
      this.SELECTED_YEAR = '';
      this.SELECTED_YEAR = this.datepipe.transform(this.YEAR, 'yyyy');
      this.filterQuery = ' AND YEAR =' + this.SELECTED_YEAR;
    } else {
      if (
        this.MONTH_RANGE.length == 0 &&
        (this.YEAR === null || this.YEAR === undefined || this.YEAR === '') &&
        this.RESIDENCE_TYPE_ID !== null &&
        this.RESIDENCE_TYPE_ID !== undefined &&
        this.RESIDENCE_TYPE_ID !== '' &&
        this.RESIDENCE_TYPE_ID.length > 0
      ) {
        this.filterQuery = '';
        this.filterQuery =
          ' AND RESIDENCE_TYPE_ID IN (' + this.RESIDENCE_TYPE_ID + ')';
      }
    }

    if (this.filterQuery) {
      this.isFilterApplied = 'primary';
      this.search(true);
    } else {
      this.message.error('Please Select Filter Value', '');
    }
  }
  clearFilter() {
    this.RESIDENCE_TYPE_ID = [];
    this.MONTH_RANGE = [];
    this.YEAR = null;
    this.MONTH1 = null;
    this.MONTH2 = null;
    this.MONTH_RANGE[0] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth(),
      1
    );
    this.MONTH_RANGE[1] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth() + 1,
      0
    );
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');

    this.MONTH1 = this.datepipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.monthh2, 'yyyy-MM-dd');

    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
    }
    // this.monthh1 = moment().startOf('month');
    // this.monthh2 = this.monthh1.clone().endOf('month');
    // this.monthh[0] = this.datepipe.transform(this.monthh1, 'yyyy-MM-dd');
    // this.monthh[1] = this.datepipe.transform(this.monthh2, 'yyyy-MM-dd');
    // this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    // this.YEAR = this.datepipe.transform(this.SELECTED_YEAR, 'yyyy');
    this.filterQuery = '';
    this.applyFilter();
    this.isFilterApplied = 'primary';
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        obj1['Residence Type'] = this.dataList11[i]['RESIDENCE_TYPE_NAME'];
        obj1['Total Objections'] = this.dataList11[i]['TOTAL'];
        obj1['Pending'] = this.dataList11[i]['PENDING'];
        obj1['Approved'] = this.dataList11[i]['APPROVED'];
        obj1['Rejected'] = this.dataList11[i]['REJECTED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Allotement Objection Summary Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
