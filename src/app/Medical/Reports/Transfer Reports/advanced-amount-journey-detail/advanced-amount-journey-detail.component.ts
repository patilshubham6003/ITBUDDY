import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-advanced-amount-journey-detail',
  templateUrl: './advanced-amount-journey-detail.component.html',
  styleUrls: ['./advanced-amount-journey-detail.component.css'],
})
export class AdvancedAmountJourneyDetailComponent implements OnInit {
  formTitle = 'Beneficiary Type Wise Detailed Report';

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

  columns: string[][] = [['NAME', 'Applicant Name']];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  INSPECTOR_NAME: any = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}
  userId: any;
  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.search();
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

  inspectorname: any = [];
  inspectorName() {
    this.api.getAllUsers(0, 0, '', 'asc', 'AND ROLE_IDS = 3').subscribe(
      (data1) => {
        this.inspectorname = data1['data'];
      },
      (err) => {}
    );
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

    this.DATE[0] = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
    this.DATE[1] = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');

    if (this.DATE[0] != null) {
      this.START_DATE = this.DATE[0];
    }

    if (this.DATE[1] != null) {
      this.END_DATE = this.DATE[1];
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DATE = [];

    this.INSPECTOR_NAME = [];
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

    if (exportInExcel == false) {
      this.loadingRecords = true;
      if (this.userId == 1) {
        this.api
          .advancedAmountJourneyDetail(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            this.filterQuery + likeQuery,
            this.INSPECTOR_NAME
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
        this.api
          .advancedAmountJourneyDetail(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            this.filterQuery + likeQuery,
            this.userId
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
    } else {
      this.exportLoading = false;

      this.api
        .advancedAmountJourneyDetail(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          ''
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
  sort(sort: any): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    if (this.sortValue == 'descend') {
      this.sortValue = 'desc';
    } else {
      this.sortValue = 'asc';
    }

    this.search(true);
  }

  // sort(params: NzTableQueryParams) {
  //   this.loadingRecords = true;
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || '';
  //   const sortOrder = (currentSort && currentSort.value) || 'asc';
  //

  //
  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search(false);
  // }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.inspector.length; i++) {
      obj1['Applicant Name'] = this.inspector[i]['EMPLOYEE_NAME'];

      obj1['Fare paid Journey'] = this.inspector[i]['FAIR_PAID_FOR_JOURNEY'];
      obj1['Advance Amount'] = this.inspector[i]['ADVANCED_AMOUNT'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.inspector.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Advance Amount Journey Details Reports' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
