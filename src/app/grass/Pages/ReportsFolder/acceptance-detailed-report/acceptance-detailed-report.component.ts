import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-acceptance-detailed-report',
  templateUrl: './acceptance-detailed-report.component.html',
  styleUrls: ['./acceptance-detailed-report.component.css'],
  providers: [DatePipe],
})
export class AcceptanceDetailedReportComponent implements OnInit {
  formTitle = 'Acceptance Detailed Report ';

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
  current = new Date();
  YEAR1: any = new Date();

  MONTH: any = new Date().getMonth() + 1;
  EmployeeName: any = [];
  EMPLOYEE: any;
  ResidenceTypeData: any = [];
  OccupancyTypeData: any;
  ResidenceType: any = [];
  Cast;
  GradePayLevel;
  GradePayLevelData: any = [];

  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['OCCUPANCY_TYPE', 'OCCUPANCY_TYPE'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
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

  constructor(
    private api: APIServicesService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    public router: Router,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.applyFilter();

    this.api.getresidenceType(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.ResidenceTypeData = data1['data'];
      },
      (err) => { }
    );
  }
  changecast(event: any) { }
  showdash() {
    this.router.navigateByUrl('/grass/reports_list')
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

  stages: any = [];
  separatedIds: number[];
  concatenatedIds: string;
  applyFilter() {
    this.filterQuery = '';
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      this.filterQuery = likeQuery;
    }

    this.YEAR1 = this.datePipe.transform(this.YEAR1, 'yyyy');

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';
    this.separatedIds = this.ResidenceType;
    this.concatenatedIds = this.separatedIds.join(', ');

    this.api
      .acceptanceDetailedReports(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery,
        this.YEAR1,
        this.MONTH,
        this.concatenatedIds,
        this.OccupancyTypeData
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.excelData = data['data'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        },
        (err) => { }
      );

    // this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.YEAR1 = new Date();
    this.concatenatedIds = '';
    this.separatedIds = [];
    this.OccupancyTypeData = '';
    this.MONTH = new Date().getMonth() + 1;
    this.GradePayLevel = '';
    this.Cast = '';
    this.EMPLOYEE = '';
    this.ResidenceType = [];

    this.dataList = [];

    this.applyFilter();
  }

  excelData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }
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

      this.api
        .acceptanceDetailedReports(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery,
          this.YEAR1,
          this.MONTH,
          this.concatenatedIds,
          this.OccupancyTypeData
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];

            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (err) => { }
        );
    } else {
      this.exportLoading = false;

      this.api
        .acceptanceDetailedReports(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery,
          this.YEAR1,
          this.MONTH,
          this.concatenatedIds,
          this.OccupancyTypeData
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.excelData = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    this.search(false);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['  Employee Name'] = this.excelData[i]['EMPLOYEE_NAME'];
        obj1['Residence Type'] = this.excelData[i]['RESIDENCE_TYPE_NAME'];
        // obj1[' Occupancy Type'] = this.excelData[i]['OCCUPANCY_TYPE'];
        if (this.excelData[i]['OCCUPANCY_TYPE'] == 'P') {
          obj1['Occupancy Type'] = 'Physical';
        } else if (this.excelData[i]['OCCUPANCY_TYPE'] == 'T') {
          obj1['Occupancy Type'] = 'Technical';
        }

        if (this.excelData[i]['MONTH'] == '01') {
          obj1['Month'] = 'January';
        } else if (this.excelData[i]['MONTH'] == '02') {
          obj1['Month'] = 'February';
        } else if (this.excelData[i]['MONTH'] == '03') {
          obj1['Month'] = 'March';
        } else if (this.excelData[i]['MONTH'] == '04') {
          obj1['Month'] = 'April';
        } else if (this.excelData[i]['MONTH'] == '05') {
          obj1['Month'] = 'May';
        } else if (this.excelData[i]['MONTH'] == '06') {
          obj1['Month'] = 'June';
        } else if (this.excelData[i]['MONTH'] == '07') {
          obj1['Month'] = 'July';
        } else if (this.excelData[i]['MONTH'] == '08') {
          obj1['Month'] = 'August';
        } else if (this.excelData[i]['MONTH'] == '09') {
          obj1['Month'] = 'September';
        } else if (this.excelData[i]['MONTH'] == '10') {
          obj1['Month'] = 'October';
        } else if (this.excelData[i]['MONTH'] == '11') {
          obj1['Month'] = 'November';
        } else if (this.excelData[i]['MONTH'] == '12') {
          obj1['Month'] = 'December';
        }
        obj1['Year'] = this.excelData[i]['YEAR'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Acceptance Detailed Report ' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
