import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-hospital-wise-summary-report',
  templateUrl: './hospital-wise-summary-report.component.html',
  styleUrls: ['./hospital-wise-summary-report.component.css'],
})
export class HospitalWiseSummaryReportComponent implements OnInit {
  formTitle = 'Hospital Wise Summary Report';

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
    ['HOSPITAL_NAME', 'Hospital Name'],
    ['HOSPITAL_TYPE', 'Hospital Type'],
    ['APPLICATION_CREATED', 'Application Created'],
    ['BILL_ITEMS_ADDED', 'Bill Items Added'],
    ['APPLICATION_SUBMITTED', 'Application Submited'],
    ['CLAIM_INFORMATION_VERIFIED', 'Claim Information Verified'],
    ['CLAIM_REJECTED_BY_INSPECTOR', 'Claim Rejected By Inspector'],
    [
      'CLAIM_FORWARDED_TOWARDS_ADMINISTRATIVE_OFFICER',
      'Claim Forwarded Towards Administrative Officer',
    ],
    ['CLAIM_FORWARDED_TOWARDS_ITO', 'Claim Forwarded Towards ITO'],
    [
      'QUERY_RAISED_BY_ADMINISTRATIVE_OFFICER',
      'Query Raised By Administative Officer',
    ],
    ['CLAIM_FORWARDED_TOWARDS_JCIT', 'Claim Forwarded Towards JCIT'],
    ['QUERY_RAISED_BY_ITO', 'Query Raised By ITO'],
    ['CLAIM_FORWARDED_TOWARDS_CIT', 'Claim Forwarded Towards CIT'],
    ['QUERY_RAISED_BY_JCIT', 'Query Raised By JCIT'],
    ['READY_TO_FORWARD_TO_ZONAL_CBDT', 'Ready to Forward to Zonal CBDT'],
    ['QUERY_RAISED_BY_CIT', 'Query Raised By CIT'],
    ['FORWARDED_TO_ZONAL_CBDT', 'Forwarded to Zonal CBDT'],
    ['QUERY_RAISED_BY_ZONAL_CBDT', 'Query Raised By Zonal CBDT'],
    ['CLAIM_APPROVED', 'Claim Approved'],
  ];

  STATUS: any = 'AL';
  BRANCH: any = [];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  TYPE_OF_HOSPITAL: any = [];

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  userId: any;
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
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

    if (this.TYPE_OF_HOSPITAL != undefined) {
      this.TYPE_OF_HOSPITAL = this.TYPE_OF_HOSPITAL;
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
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    // this.DATE[1] = new Date();
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );

    this.TYPE_OF_HOSPITAL = [];
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
      likeQuery =
        " AND (HOSPITAL_NAME like '%" +
        this.searchText +
        "%' OR HOSPITAL_TYPE like '%" +
        this.searchText +
        "%')";
    }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .hospitalWiseSummary(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + 'AND INSPECTOR_ID = ' + this.userId,
          this.TYPE_OF_HOSPITAL,
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
        .hospitalWiseSummary(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + 'AND INSPECTOR_ID = ' + this.userId,
          this.TYPE_OF_HOSPITAL,
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
    if (this.inspector.length > 0) {
      for (var i = 0; i < this.inspector.length; i++) {
        obj1['Hospital Name'] = this.inspector[i]['HOSPITAL_NAME'];

        if (this.inspector[i]['HOSPITAL_TYPE'] == 'E') {
          obj1['Hospital Type'] = 'Empanelled';
        } else if (this.inspector[i]['HOSPITAL_TYPE'] == 'NE') {
          obj1['Hospital Type'] = 'Non Empanelled';
        } else {
          obj1['Hospital Type'] = 'Government';
        }
        obj1['Application Created'] = this.inspector[i]['APPLICATION_CREATED'];
        obj1['Total Count'] = this.inspector[i]['TOTAL_COUNT'];
        obj1['Bill Items Added'] = this.inspector[i]['BILL_ITEMS_ADDED'];
        obj1['Application Submited'] =
          this.inspector[i]['APPLICATION_SUBMITTED'];
        obj1['Claim Information Verified'] =
          this.inspector[i]['CLAIM_INFORMATION_VERIFIED'];
        obj1['Claim Rejected By Inspector'] =
          this.inspector[i]['CLAIM_REJECTED_BY_INSPECTOR'];
        obj1['Claim Forwarded Towards Administrative Officer'] =
          this.inspector[i]['CLAIM_FORWARDED_TOWARDS_ADMINISTRATIVE_OFFICER'];
        obj1['Claim Forwarded Towards ITO'] =
          this.inspector[i]['CLAIM_FORWARDED_TOWARDS_ITO'];
        obj1['Query Raised By Administative Officer'] =
          this.inspector[i]['QUERY_RAISED_BY_ADMINISTRATIVE_OFFICER'];
        obj1['Claim Forwarded Towards JCIT'] =
          this.inspector[i]['CLAIM_FORWARDED_TOWARDS_JCIT'];
        obj1['Query Raised By ITO'] = this.inspector[i]['QUERY_RAISED_BY_ITO'];
        obj1['Claim Forwarded Towards CIT'] =
          this.inspector[i]['CLAIM_FORWARDED_TOWARDS_CIT'];
        obj1['Query Raised By JCIT'] =
          this.inspector[i]['QUERY_RAISED_BY_JCIT'];
        obj1['Ready to Forward to Zonal CBDT'] =
          this.inspector[i]['READY_TO_FORWARD_TO_ZONAL_CBDT'];
        obj1['Query Raised By CIT'] = this.inspector[i]['QUERY_RAISED_BY_CIT'];
        obj1['Forwarded to Zonal CBDT'] =
          this.inspector[i]['FORWARDED_TO_ZONAL_CBDT'];
        obj1['Query Raised By Zonal CBDT'] =
          this.inspector[i]['QUERY_RAISED_BY_ZONAL_CBDT'];
        obj1['Claim Approved'] = this.inspector[i]['CLAIM_APPROVED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.inspector.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Hospital Wise Summary Report' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
