import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-day-wise-files-summary-report',
  templateUrl: './day-wise-files-summary-report.component.html',
  styleUrls: ['./day-wise-files-summary-report.component.css'],
})
export class DayWiseFilesSummaryReportComponent implements OnInit {
  formTitle = 'Day Wise Files Summary Report';

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
  STAGE_NAME: any = [];
  columns: string[][] = [
    ['TOTAL_CREATED', 'Created'],
    ['PENDING_AT_OTHERDESK', "Transfered by me'"],
    ['PENDING_AT_MYDESK', 'Transfered towards me'],
    ['TOTAL_CLOSE', 'Closed by me'],
    ['TOTAL_ACCEPT', 'Accepted by me'],
    ['TOTAL_REJECT', 'Rejected by me'],
    ['TOTAL_CONVERTED_TO_FINAL', 'Converted To Final'],
  ];

  STATUS: any = 'AL';
  BRANCH: any = [];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  BRANCH_ID: any = [];
  SALES_MANAGER_ID: any = [];

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  roleId: any;
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.roleId = sessionStorage.getItem('roleId');
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    // this.search();
    // this.username()
    this.api
      .getAllUsers(0, 0, '', 'asc', ' AND ROLE_ID = ' + this.roleId)
      .subscribe(
        (data1) => {
          this.usernames = data1['data'];
          this.USERS = data1['data'][0]['ID'];
          this.applyFilter();
        },
        (err) => {}
      );
    // this.search();
    // this.getSales();
  }

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

  usernames: any = [];
  USERS: any;
  // username() {
  //   this.api.getAllUsers(0, 0, '', 'asc', 'AND ROLE_IDS = ' +this.roleId).subscribe(
  //     (data1) => {
  //
  //       this.usernames = data1['data'];
  //       this.USERS = data1['data'][0]['ID'];

  //     },
  //     (err) => {
  //
  //     }
  //   );
  // }

  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // if (this.SALES_MANAGER_ID != undefined) {
    //   this.SALES_MANAGER_ID = this.SALES_MANAGER_ID;
    // }
    this.DATE[0] = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
    this.DATE[1] = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');

    if (this.DATE[0] != null) {
      this.START_DATE = this.DATE[0];
    } else {
    }
    if (this.DATE[1] != null) {
      this.END_DATE = this.DATE[1];
    } else {
    }

    // this.api.getAllUsers(0, 0, '', 'asc', 'AND ROLE_IDS = ' +this.roleId).subscribe(
    //   (data1) => {
    //     //
    //     this.usernames = data1['data'];
    //     this.USERS = data1['data'][0]['ID'];
    //
    //   },
    //   (err) => {
    //
    //   }
    // );
    // this.search();
    var likeQuery = '';

    if (this.searchText != '') {
      // likeQuery = " AND INSPECTOR_NAME like '%" + this.searchText + "%'";
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .dayWiseFilesSummaryReport(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery + likeQuery,
        this.USERS,
        this.START_DATE,
        this.END_DATE
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.inspector = data['data'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        },
        (err) => {}
      );
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.USERS = [];
    this.DATE = [];
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date();
    this.dataList = [];
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
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
      // likeQuery = " AND INSPECTOR_NAME like '%" + this.searchText + "%'";
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }
    // this.USERS=this.roleId
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .dayWiseFilesSummaryReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          this.USERS,
          this.START_DATE,
          this.END_DATE
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
    } else {
      this.exportLoading = false;

      this.api
        .dayWiseFilesSummaryReport(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          this.USERS,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
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

  // sort(sort: any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   if (this.sortValue == "descend") {
  //     this.sortValue = 'desc';
  //   } else {
  //     this.sortValue = 'asc'
  //   }
  //
  //   this.search(true);
  // }

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
    this.search();
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.inspector.length > 0) {
      for (var i = 0; i < this.inspector.length; i++) {
        obj1['Created'] = this.inspector[i]['TOTAL_CREATED'];
        obj1['Transfered by me'] = this.inspector[i]['PENDING_AT_OTHERDESK'];
        obj1['Transfered towards me'] = this.inspector[i]['PENDING_AT_MYDESK'];
        obj1['Closed by me'] = this.inspector[i]['TOTAL_CLOSE'];
        obj1['Accepted by me'] = this.inspector[i]['TOTAL_ACCEPT'];
        obj1['Rejected by me'] = this.inspector[i]['TOTAL_REJECT'];
        obj1['Converted To Final'] =
          this.inspector[i]['TOTAL_CONVERTED_TO_FINAL'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.inspector.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Day Wise File Summary Report' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
