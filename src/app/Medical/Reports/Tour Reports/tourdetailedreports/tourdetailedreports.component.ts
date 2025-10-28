import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-tourdetailedreports',
  templateUrl: './tourdetailedreports.component.html',
  styleUrls: ['./tourdetailedreports.component.css'],
})
export class TourdetailedreportsComponent implements OnInit {
  userId: any = sessionStorage.getItem('userId');
  formTitle = 'Inspector Wise Detailed Summary Report';
  startValue: any;
  endValue: any;
  today2 = new Date();
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';

  columns: string[][] = [
    ['INSPECTOR_NAME', 'Inspector Name'],
    ['EMPLOYEE_NAME', 'Applicant Name'],
    ['DESIGNATION', 'Employee Designation'],
    ['BASIC_PAY', 'Basic Pay'],
    ['HEADQUARTERS_NAME', 'Office Name'],
    ['MOBILE_NO', 'Mobile No'],
    ['GRADE_PAY_LEVEL', ' Gradepay Level'],
  ];

  STATUS: any = 'AL';
  BRANCH: any = [];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  HOSPITAL_TYPE: any = [];
  STAGE_NAME: any = [];
  SALES_MANAGER_ID: any = [];

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();

  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.inspectorName();
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    // this.DATE[1] = new Date();
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );

    this.search();
  }
  INSPECTOR_NAME: any = [];
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  keyup(event: any) {
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  selectinspectorevent(event) {
    if (event.length == 0) {
      this.type = null;
    }
  }

  type: any;
  applyFilter() {
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');

    if (this.type != undefined) {
      this.isFilterApplied = 'primary';
      this.filterQuery = ' AND INSPECTOR_ID=' + '' + this.type;
      this.filterClass = 'filter-invisible';
    }

    this.api
      .gettouralldata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        },
        (err) => {}
      );
  }
  today =
    new Date().getFullYear().toString() +
    '-' +
    (new Date().getMonth() + 1).toString() +
    '-' +
    new Date().getDate().toString();

  month = this.today;
  clearFilter() {
    this.filterClass = 'filter-invisible';
    // this.dataList = [];
    this.startValue = null;
    this.endValue = null;
    this.filterQuery = '';
    this.month = this.today;
    this.type = null;
    this.isFilterApplied = 'default';
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(false, true);
  }

  query: any;

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'asc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var filter = '';
    if (likeQuery) filter = this.filterQuery + likeQuery;
    else filter = this.filterQuery;
    this.query = likeQuery;
    if (exportInExcel == false) {
      if (this.userId == 1) {
        this.api
          .gettouralldata(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            filter
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.isSpinning = false;
                this.filterClass = 'filter-invisible';
              } else {
                this.message.error('Something Went Wrong', '');
                this.loadingRecords = false;
              }
            },
            (err) => {}
          );
      } else {
        this.api
          .gettouralldata(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            ' AND INSPECTOR_ID =' + this.userId + filter
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.isSpinning = false;
                this.filterClass = 'filter-invisible';
              } else {
                this.message.error('Something Went Wrong', '');
                this.loadingRecords = false;
              }
            },
            (err) => {}
          );
      }
    } else {
      this.exportLoading = false;
      this.api
        .gettouralldata(0, 0, this.sortKey, sort, this.filterQuery + likeQuery)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.isSpinning = false;
              this.loadingRecords = false;
              this.inspector = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  inspectorname: any = [];
  inspectorName() {
    this.api.getAllUsers(0, 0, '', 'asc', ' AND ROLE_IDS=3').subscribe(
      (data1) => {
        this.inspectorname = data1['data'];
      },
      (err) => {}
    );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';

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
    this.search(false);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.inspector.length; i++) {
      obj1['Inspector Name'] = this.inspector[i]['INSPECTOR_NAME'];
      obj1['Applicant Name'] = this.inspector[i]['EMPLOYEE_NAME'];
      obj1['Employee Designation'] = this.inspector[i]['DESIGNATION'];
      obj1['Basic Pay'] = this.inspector[i]['BASIC_PAY'];
      obj1['Office Name'] = this.inspector[i]['HEADQUARTERS_NAME'];
      obj1['Mobile No'] = this.inspector[i]['MOBILE_NO'];
      obj1['Gradepay Level'] = this.inspector[i]['GRADE_PAY_LEVEL'];
      arry1.push(Object.assign({}, obj1));
      if (i == this.inspector.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Tour  Detailed Summary Report' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
