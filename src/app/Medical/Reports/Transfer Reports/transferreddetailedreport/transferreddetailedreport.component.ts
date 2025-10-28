import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-transferreddetailedreport',
  templateUrl: './transferreddetailedreport.component.html',
  styleUrls: ['./transferreddetailedreport.component.css'],
})
export class TransferreddetailedreportComponent implements OnInit {
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
    ['NAME', 'Applicant Name'],
    ['DESIGNATION', 'Designation'],
    ['ADDRESS', 'Address'],
    ['OFFICE_NAME', 'Office Name'],
    ['NEW_OFFICE_NAME', 'New Office Name'],
    ['NEW_HEADQUARTERS_NAME', 'New HeadQuater Name'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';

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
    this.inspectorName();
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
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
    } else {
      this.message.error('', 'Please Inspector Name');
    }
    ///local
    this.api
      .gettransferreddetailreport(
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
    this.api
      .gettransferreddetailreport(0, 0, this.sortKey, sort, this.filterQuery)
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
      this.sortValue = 'desc';
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
      this.api
        .gettransferreddetailreport(
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
      this.exportLoading = false;
      this.api
        .gettransferreddetailreport(
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
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    }
  }

  inspectorname: any = [];
  inspectorName() {
    this.api.getAllUsers(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.inspectorname = data1['data'];
      },
      (err) => {}
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
  // }

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
      obj1['Employee Code'] = this.inspector[i]['EMPLOYEE_CODE'];
      obj1['Date Of Bill'] = this.inspector[i]['BILL_FILIING_DATE'];
      obj1['Hospital Name'] = this.inspector[i]['HOSPITAL_NAME'];
      obj1['Amount Of Reimbursement Claimed'] =
        this.inspector[i]['CLAIMED_AMOUNT'];
      obj1['Amount Of Reimbursement Admissible'] =
        this.inspector[i]['ADMISSIBLE_AMOUNT'];
      obj1['Advance Taken'] = this.inspector[i]['ADVANCE_AMOUNT'];
      obj1['Designation & Office'] = this.inspector[i]['DESIGNATION_OFFICE'];
      obj1['DDO Of Official'] = this.inspector[i]['DDO_OF_THE_OFFICIAL'];
      obj1['Patients Relation'] = this.inspector[i]['RELATION_WITH_PATIENT'];
      arry1.push(Object.assign({}, obj1));
      if (i == this.inspector.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Inspector Wise Detailed Summary Report' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
