import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-claim-master-report',
  templateUrl: './claim-master-report.component.html',
  styleUrls: ['./claim-master-report.component.css'],
  providers: [DatePipe],
})
export class ClaimMasterReportComponent implements OnInit {
  INSPECTOR_NAME: any = [];
  TOTAL_CLAIM: any;
  SUBMITTED: any;
  VERIFIED: any;
  ANNEXTURE: any;
  ORDERS: any;
  CLAIM_FILE: any;

  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;

  formTitle = 'Total Claim Report';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  size = 'small';
  isFilterApplied: any = 'default';
  newButton: any = 'default';
  forwardButton: any = 'default';
  rejectButton: any = 'default';
  queryButton: any = 'default';
  approvedButton: any = 'default';
  readyButton: any = 'default';
  totalButton: any = 'default';
  claimData: any;
  filterClass = 'filter-invisible';
  columns: string[][] = [['INSPECTOR_NAME', '']];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME = [1, 2];
  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.INSPECTOR_ID = null;
    this.dataList = [];
    this.search();
  }
  keyup(event: any) {
    this.search();
  }
  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  START_DATE: any;
  END_DATE: any;
  BILL_FILIING_DATE: any = [];
  current = new Date();
  rejectClaimVisible: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.search();
    this.stageName();
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }

  sort(params: NzTableQueryParams) {
    // this.loadingRecords = true;
    // this.sortKey = sort.key;
    //   this.sortValue = sort.value;

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
    if (sortOrder == 'descend') {
      this.sortValue = 'desc';
    } else {
      this.sortValue = 'asc';
    }
    this.sortKey = sortField;
    // this.sortValue = sortOrder;
    this.search(false);
  }

  search(reset: boolean = false) {
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

    this.api
      .getcontact(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery + likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          }
        },
        (err) => {}
      );
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

  value3: any;
  onChangev3(value: any) {
    this.value3 = value;
  }

  INSPECTOR_ID: any;
  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;

    this.filterQuery = '';
    // if (
    //   this.INSPECTOR_NAME != undefined && this.INSPECTOR_NAME.length > 0) {
    //   var f = ' AND(';
    //   for (var i = 0; i < this.INSPECTOR_NAME.length; i++) {
    //     f = f + 'INSPECTOR_NAME="N" OR';
    //     if (i + 1 == this.INSPECTOR_NAME.length) {
    //       f = f.substring(0, f.length - 2) + ')';
    //       this.filterQuery = this.filterQuery + f;
    //     }
    //   }
    // }
    if (
      this.INSPECTOR_ID != undefined &&
      this.INSPECTOR_ID != null &&
      this.INSPECTOR_ID != ''
    ) {
      this.filterQuery = ' AND INSPECTOR_ID = ' + this.INSPECTOR_ID;
      //
      this.filterClass = 'filter-invisible';
      this.search(true);
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
}
