import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// import { log } from 'console';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-userfileactivitydetailedreport',
  templateUrl: './userfileactivitydetailedreport.component.html',
  styleUrls: ['./userfileactivitydetailedreport.component.css'],
})
export class UserfileactivitydetailedreportComponent implements OnInit {
  formTitle = 'User File Activity Detailed Report';

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
    ['CREATOR_NAME', 'User Name'],
    ['CREATOR_ROLE', 'Role Name'],
    ['HIRARCHY_NAME', 'Hierarchy Name'],
    ['FILE_NAME', 'File Name'],
  ];

  BRANCH: any = [];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  USER: any = [];
  HIRARCHY_NAME: any = [];

  SALES_MANAGER_ID: any = [];

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  FILE_YEAR: any = [];
  BENIFICIARY_TYPE: any = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.search();
    this.stageName();
    this.inspectorName();
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
  USERS: any;
  usernames: any = [];
  stageName() {
    this.api.getAllUsers(0, 0, '', 'asc', 'AND ROLE_IDS = 3').subscribe(
      (data1) => {
        this.usernames = data1['data'];
      },
      (err) => {}
    );
  }
  HIERARCHY: any;
  Hierarchyname: any = [];
  inspectorName() {
    this.api.getAllFilehierarchy(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.Hierarchyname = data1['data'];
      },
      (err) => {}
    );
  }
  event(a: any) {
    if (a.length <= 0) {
      this.HIERARCHY = null;
    } else {
      this.HIERARCHY = a;
    }
  }
  event1(b: any) {
    if (b.length <= 0) {
      this.USERS = null;
    } else {
      this.USERS = b;
    }
  }
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

    if (this.SALES_MANAGER_ID != undefined) {
      this.SALES_MANAGER_ID = this.SALES_MANAGER_ID;
    }
    this.DATE[0] = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
    this.DATE[1] = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');

    if (this.DATE[0] != null) {
      this.START_DATE = this.DATE[0];
    }

    if (this.DATE[1] != null) {
      this.END_DATE = this.DATE[1];
    }

    if (this.HIERARCHY != undefined && this.USERS != undefined) {
      this.filterQuery =
        'AND HIRARCHY_ID in (' +
        this.HIERARCHY +
        ')' +
        ' AND CREATOR_ID in (' +
        this.USERS +
        ')';
    } else if (this.HIERARCHY != undefined && this.USERS == undefined) {
      this.filterQuery = ' AND HIRARCHY_ID in (' + this.HIERARCHY + ')';
    } else if (this.HIERARCHY == undefined && this.USERS != undefined) {
      this.filterQuery = ' AND CREATOR_ID in (' + this.USERS + ')';
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DATE = [];
    this.BENIFICIARY_TYPE = [];
    this.USER = [];
    this.FILE_YEAR = [];
    this.HIRARCHY_NAME = [];
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.dataList = [];
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(false, true);
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    // if (exportInExcel == false) {
    // this.loadingRecords = true;

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .userfileactivitydetailedreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          // this.USERS,
          // this.HIERARCHY,
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
        .userfileactivitydetailedreport(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          // this.USERS,
          // this.HIERARCHY,
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
    if (this.inspector.length > 0) {
      for (var i = 0; i < this.inspector.length; i++) {
        obj1['User Name'] = this.inspector[i]['USER_NAME'];
        obj1['Role Name'] = this.inspector[i]['ROLE_NAME'];
        obj1['Hirarchy Name'] = this.inspector[i]['HIRARCHY_NAME'];
        obj1['File Name'] = this.inspector[i]['FILE_NAME'];
        obj1['File Number'] = this.inspector[i]['FILE_NUMBER'];
        obj1['Action Date & Time'] = this.inspector[i]['TRANSFER_DATETIME'];
        obj1['Remark'] = this.inspector[i]['REMARK'];
        obj1['Action'] = this.inspector[i]['ACTION_STATUS'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.inspector.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'User File Activity Wise Detailed Report' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
