import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-beneficiary-type-summary-reports',
  templateUrl: './beneficiary-type-summary-reports.component.html',
  styleUrls: ['./beneficiary-type-summary-reports.component.css'],
})
export class BeneficiaryTypeSummaryReportsComponent implements OnInit {
  formTitle = 'Beneficiary Type Summary Report';

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
    ['INSPECTOR_NAME', 'Beneficiary type'],
    ['APPLICATION_CREATED', 'Application Created'],
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

  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) { }

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

  branches: any = [];
  getBranch() {
    // this.api.getAllBranch(0, 0, '', 'asc', 'AND STATUS=1').subscribe((data1) => {
    //   
    //   this.branches = data1['data'];
    // },
    //   (err) => {
    //     
    //   }
    // );
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
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.dataList = [];
    this.search();
  }

  beneficiarytypesummary: any = [];
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
      likeQuery = " AND BENEFICIARY_TYPE like '%" + this.searchText + "%'";
      // this.columns.forEach(column => {
      //   likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      // });
      // likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")";
    }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .beneficiarytypewisesummary(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
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
          (err) => {

          }
        );
    } else {
      this.exportLoading = false;

      this.api
        .beneficiarytypewisesummary(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.beneficiarytypesummary = data['data'];
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
    const sortField = (currentSort && currentSort.key) || 'id';
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
    this.search(false);
  }

  convertInExcel() {



    var arry1: any = [];
    var obj1: any = new Object();
    if (this.beneficiarytypesummary.length > 0) {
      for (var i = 0; i < this.beneficiarytypesummary.length; i++) {
        // obj1['Beneficiary type'] = this.beneficiarytypesummary[i]['INSPECTOR_NAME'];
        if (this.beneficiarytypesummary[i]['BENEFICIARY_TYPE'] == 'CG') {
          obj1['Beneficiary Type'] = 'CGHS';
        } else {
          obj1['Beneficiary Type'] = 'CS(MA)';
        }
        obj1['Application Created'] =
          this.beneficiarytypesummary[i]['APPLICATION_CREATED'];
        obj1['Bill Items Added'] =
          this.beneficiarytypesummary[i]['BILL_ITEMS_ADDED'];
        obj1['Application Submited'] =
          this.beneficiarytypesummary[i]['APPLICATION_SUBMITTED'];
        obj1['Claim Information Verified'] =
          this.beneficiarytypesummary[i]['CLAIM_INFORMATION_VERIFIED'];
        obj1['Claim Rejected By Inspector'] =
          this.beneficiarytypesummary[i]['CLAIM_REJECTED_BY_INSPECTOR'];
        obj1['Claim Forwarded Towards Administrative Officer'] =
          this.beneficiarytypesummary[i][
          'CLAIM_FORWARDED_TOWARDS_ADMINISTRATIVE_OFFICER'
          ];
        obj1['Claim Forwarded Towards ITO'] =
          this.beneficiarytypesummary[i]['CLAIM_FORWARDED_TOWARDS_ITO'];
        obj1['Query Raised By Administative Officer'] =
          this.beneficiarytypesummary[i][
          'QUERY_RAISED_BY_ADMINISTRATIVE_OFFICER'
          ];
        obj1['Claim Forwarded Towards JCIT'] =
          this.beneficiarytypesummary[i]['CLAIM_FORWARDED_TOWARDS_JCIT'];
        obj1['Query Raised By ITO'] =
          this.beneficiarytypesummary[i]['QUERY_RAISED_BY_ITO'];
        obj1['Claim Forwarded Towards CIT'] =
          this.beneficiarytypesummary[i]['CLAIM_FORWARDED_TOWARDS_CIT'];
        obj1['Query Raised By JCIT'] =
          this.beneficiarytypesummary[i]['QUERY_RAISED_BY_JCIT'];
        obj1['Ready to Forward to Zonal CBDT'] =
          this.beneficiarytypesummary[i]['READY_TO_FORWARD_TO_ZONAL_CBDT'];
        obj1['Query Raised By CIT'] =
          this.beneficiarytypesummary[i]['QUERY_RAISED_BY_CIT'];
        obj1['Forwarded to Zonal CBDT'] =
          this.beneficiarytypesummary[i]['FORWARDED_TO_ZONAL_CBDT'];
        obj1['Query Raised By Zonal CBDT'] =
          this.beneficiarytypesummary[i]['QUERY_RAISED_BY_ZONAL_CBDT'];
        obj1['Claim Approved'] =
          this.beneficiarytypesummary[i]['CLAIM_APPROVED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.beneficiarytypesummary.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Beneficiary Type Summary Report' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error(' There is a no data', '');
    }
  }
}
