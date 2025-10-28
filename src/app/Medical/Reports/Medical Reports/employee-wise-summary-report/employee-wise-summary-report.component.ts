import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-employee-wise-summary-report',
  templateUrl: './employee-wise-summary-report.component.html',
  styleUrls: ['./employee-wise-summary-report.component.css'],
})
export class EmployeeWiseSummaryReportComponent implements OnInit {
  formTitle = 'Employee Wise Summary Report';

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
    ['EMPLOYEE_NAME', 'Employee Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
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
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );

    this.dataList = [];
    this.search();
  }

  Employee: any = [];
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
        " AND (EMPLOYEE_NAME like '%" +
        this.searchText +
        "%' OR EMPLOYEE_CODE like '%" +
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
        .employeewisesummaryreport(
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
        .employeewisesummaryreport(
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
              this.Employee = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

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
    this.search();
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.Employee.length > 0) {
      for (var i = 0; i < this.Employee.length; i++) {
        obj1['Hospital Name'] = this.Employee[i]['EMPLOYEE_NAME'];
        obj1['Employee code'] = this.Employee[i]['EMPLOYEE_CODE'];
        obj1['Application Created'] = this.Employee[i]['APPLICATION_CREATED'];
        obj1['Bill Items Added'] = this.Employee[i]['BILL_ITEMS_ADDED'];
        obj1['Application Submited'] =
          this.Employee[i]['APPLICATION_SUBMITTED'];
        obj1['Claim Information Verified'] =
          this.Employee[i]['CLAIM_INFORMATION_VERIFIED'];
        obj1['Claim Rejected By Inspector'] =
          this.Employee[i]['CLAIM_REJECTED_BY_INSPECTOR'];
        obj1['Claim Forwarded Towards Administrative Officer'] =
          this.Employee[i]['CLAIM_FORWARDED_TOWARDS_ADMINISTRATIVE_OFFICER'];
        obj1['Claim Forwarded Towards ITO'] =
          this.Employee[i]['CLAIM_FORWARDED_TOWARDS_ITO'];
        obj1['Query Raised By Administative Officer'] =
          this.Employee[i]['QUERY_RAISED_BY_ADMINISTRATIVE_OFFICER'];
        obj1['Claim Forwarded Towards JCIT'] =
          this.Employee[i]['CLAIM_FORWARDED_TOWARDS_JCIT'];
        obj1['Query Raised By ITO'] = this.Employee[i]['QUERY_RAISED_BY_ITO'];
        obj1['Claim Forwarded Towards CIT'] =
          this.Employee[i]['CLAIM_FORWARDED_TOWARDS_CIT'];
        obj1['Query Raised By JCIT'] = this.Employee[i]['QUERY_RAISED_BY_JCIT'];
        obj1['Ready to Forward to Zonal CBDT'] =
          this.Employee[i]['READY_TO_FORWARD_TO_ZONAL_CBDT'];
        obj1['Query Raised By CIT'] = this.Employee[i]['QUERY_RAISED_BY_CIT'];
        obj1['Forwarded to Zonal CBDT'] =
          this.Employee[i]['FORWARDED_TO_ZONAL_CBDT'];
        obj1['Query Raised By Zonal CBDT'] =
          this.Employee[i]['QUERY_RAISED_BY_ZONAL_CBDT'];
        obj1[' Claim Approved'] = this.Employee[i]['CLAIM_APPROVED'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.Employee.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Employee Wise Summary Reports' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
