import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-quarter-applications-summary-report',
  templateUrl: './quarter-applications-summary-report.component.html',
  styleUrls: ['./quarter-applications-summary-report.component.css'],
  providers: [DatePipe],
})
export class QuarterApplicationsSummaryReportComponent {
  formTitle = ' Quarters Applications Summary ';
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
  RESIDENCE_TYPE_IDD: any = [];
  isSpinning = false;
  ResidenceTypelist: any = [];
  AVAILABLE_STATUS: any = '';
  RESIDENCE_TYPE_ID: any = [];
  columns: string[][] = [
    ['TOTAL', 'TOTAL'],
    ['REJECTED', 'REJECTED'],
    ['APPROVED', 'APPROVED'],
    ['PENDING', 'PENDING'],
    ['DELETED', 'DELETED'],
  ];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe, public router: Router,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  Monthrange: any = [];
  MONTH: any;
  YEAR: any;
  selectmonth: any = new Date();
  selectyear: any = new Date();
  onChangemonth(result: any) { }
  onChangeyear(event: any) { }
  startdatenow = new Date();
  ngOnInit(): void {
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datepipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datepipe.transform(this.monthh2, 'yyyy-MM-dd');
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
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
          }
          this.search();
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
    if (this.RESIDENCE_TYPE_IDD.length != 0) {
      likeQuery += ' AND RESIDENCE_TYPE IN (' + this.RESIDENCE_TYPE_IDD + ')';
    }
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
        .getapplicationsReport1(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery,
          dateFilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
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
        .getapplicationsReport1(0, 0, this.sortKey, sort, likeQuery, dateFilter)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
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
    if (
      this.selectmonth == null ||
      this.selectmonth == undefined ||
      this.selectmonth == ''
    ) {
      this.message.error('Please Select Month', '');
    }
    // else if (
    //   this.selectyear == null ||
    //   this.selectyear == undefined ||
    //   this.selectyear == ''
    // ) {
    //   this.message.error('Please Select Year', '');
    // }
    else {
      this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
      this.YEAR = this.datepipe.transform(this.selectmonth, 'yyyy');
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }
  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datepipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datepipe.transform(this.monthh2, 'yyyy-MM-dd');
    // this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    // this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');
    this.search(true);
    this.isFilterApplied = 'default';
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
        obj1['Application Count'] = this.dataList11[i]['TOTAL'];
        obj1['Rejected Count'] = this.dataList11[i]['REJECTED'];
        obj1['Approved Count'] = this.dataList11[i]['APPROVED'];
        obj1['Pending Count'] = this.dataList11[i]['PENDING'];
        obj1['Deleted Count'] = this.dataList11[i]['DELETED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Quarters Applications Summary Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
