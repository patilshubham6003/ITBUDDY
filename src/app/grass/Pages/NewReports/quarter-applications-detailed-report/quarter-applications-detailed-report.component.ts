import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-quarter-applications-detailed-report',
  templateUrl: './quarter-applications-detailed-report.component.html',
  styleUrls: ['./quarter-applications-detailed-report.component.css'],
  providers: [DatePipe],
})
export class QuarterApplicationsDetailedReportComponent {
  formTitle = 'Quarter Application Detailed Report';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'primary';
  filterClass: string = 'filter-invisible';
  RESIDENCE_TYPE_IDD: any = [];
  isSpinning = false;
  ResidenceTypelist: any = [];
  AVAILABLE_STATUS: any = '';
  columns: string[][] = [
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['APPLICATION_DATETIME', 'APPLICATION_DATETIME'],
    ['NAME', 'NAME'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION']
  ];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe, public router: Router,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  MONTH2: any;
  MONTH1: any;
  Monthrange: any = [];
  onChangemonth(result: Date[]): void {
    let fromdate: any = new Date();
    let Todate: any = new Date();

    this.Monthrange[0] = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );
  }
  startdatenow = new Date();
  ngOnInit(): void {
    // this.search();
    this.Monthrange[0] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth() + 1,
      0
    );
    this.getResidenceTypestart();
    this.getDesignation();
  }
  showdash() {
    this.router.navigateByUrl('/grass/reports_list')
  }
  Designationtypes: any = [];
  DESIGNATION_ID: any = []
  getDesignation() {
    this.isSpinning = true;
    this.api.getallDesignation(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Designationtypes = data['data'];
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  getResidenceTypestart() {
    this.RESIDENCE_TYPE_IDD = [];
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
          }
          // this.search();
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  keyup(event: any) {
    this.search(true);
  }
  Prioritydaterange: any = []
  Joiningdaterange: any = []
  dobdaterange: any = []
  reteimentdaterange: any = []
  presentpaylevaldaterange: any = []
  dataList11: any = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ' )';
    }

    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    var filterQuery1 = '';
    if (this.RESIDENCE_TYPE_IDD.length != 0) {
      filterQuery1 = ' AND RESIDENCE_TYPE IN (' + this.RESIDENCE_TYPE_IDD + ')';
    }
    if (this.DESIGNATION_ID.length > 0) {
      filterQuery1 += ' AND DESIGNATION_ID IN (' + this.RESIDENCE_TYPE_IDD + ')';
    }
    if (this.Prioritydaterange.length > 0) {
      filterQuery1 += " AND date(DATE_OF_PRIORITY) BETWEEN '" +
        this.datepipe.transform(this.Prioritydaterange[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.Prioritydaterange[1], 'yyyy-MM-dd') +
        "' ";
    }
    if (this.reteimentdaterange.length > 0) {
      filterQuery1 += " AND date(RETIREMENT_DATE) BETWEEN '" +
        this.datepipe.transform(this.reteimentdaterange[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.reteimentdaterange[1], 'yyyy-MM-dd') +
        "' ";
    }
    if (this.dobdaterange.length > 0) {
      filterQuery1 += " AND date(DOB) BETWEEN '" +
        this.datepipe.transform(this.dobdaterange[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.dobdaterange[1], 'yyyy-MM-dd') +
        "' ";
    }
    if (this.Joiningdaterange.length > 0) {
      filterQuery1 += " AND date(JOINING_DATE) BETWEEN '" +
        this.datepipe.transform(this.Joiningdaterange[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.Joiningdaterange[1], 'yyyy-MM-dd') +
        "' ";
    }
    if (this.presentpaylevaldaterange.length > 0) {
      filterQuery1 += " AND date(PRESENT_PAY_LEVEL_DATE) BETWEEN '" +
        this.datepipe.transform(this.Joiningdaterange[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.Joiningdaterange[1], 'yyyy-MM-dd') +
        "' ";
    }

    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .getapplicationdetailedReport1(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
          " AND date(APPLICATION_DATETIME) BETWEEN '" +
          this.MONTH1 +
          "' AND '" +
          this.MONTH2 +
          "' " +
          filterQuery1
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getapplicationdetailedReport1(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery +
          " AND date(APPLICATION_DATETIME) BETWEEN '" +
          this.MONTH1 +
          "' AND '" +
          this.MONTH2 +
          "' " +
          filterQuery1
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.exportLoading = false;
          }
        );
    }
  }

  exportLoading = false;
  importInExcel() {
    this.search(true, true);
  }

  applyFilter() {
    if (
      this.RESIDENCE_TYPE_IDD == null ||
      this.RESIDENCE_TYPE_IDD == undefined ||
      this.RESIDENCE_TYPE_IDD == '' || this.RESIDENCE_TYPE_IDD.length == 0
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      this.isFilterApplied = 'primary';
      this.search();
    }
  }
  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }
    this.Monthrange = [];
    let newdate = new Date();
    this.Monthrange[0] = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    this.Monthrange[1] = new Date(
      newdate.getFullYear(),
      newdate.getMonth() + 1,
      0
    );
    this.search(true);
    this.isFilterApplied = 'primary';
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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
    // if (currentSort != null && currentSort.value != undefined) {
    this.search();
    // }
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        obj1['Application Date'] =
          this.dataList11[i]['APPLICATION_DATETIME'] ? this.datepipe.transform(this.dataList11[i]['APPLICATION_DATETIME'], 'dd/MM/yyyy') : "_";
        obj1['Residence Type'] = this.dataList11[i]['RESIDENCE_TYPE_NAME'] ? this.dataList11[i]['RESIDENCE_TYPE_NAME'] : "_";
        obj1['Name'] = this.dataList11[i]['NAME'] ? this.dataList11[i]['NAME'] : "_";
        obj1['Employee Code'] = this.dataList11[i]['EMPLOYEE_CODE'] ? this.dataList11[i]['EMPLOYEE_CODE'] : "_";
        obj1['Designation'] = this.dataList11[i]['DESIGNATION'] ? this.dataList11[i]['DESIGNATION'] : "_";
        obj1['Date of Priority'] =
          this.dataList11[i]['DATE_OF_PRIORITY'] ? this.datepipe.transform(this.dataList11[i]['DATE_OF_PRIORITY'], 'dd/MM/yyyy') : "_";

        obj1['Date of Present Pay Level'] =
          this.dataList11[i]['PRESENT_PAY_LEVEL_DATE'] ? this.datepipe.transform(this.dataList11[i]['PRESENT_PAY_LEVEL_DATE'], 'dd/MM/yyyy') : "_";
        obj1['Date of Joining'] =
          this.dataList11[i]['JOINING_DATE'] ? this.datepipe.transform(this.dataList11[i]['JOINING_DATE'], 'dd/MM/yyyy') : "_";
        obj1['Date of Birth'] =
          this.dataList11[i]['DOB'] ? this.datepipe.transform(this.dataList11[i]['DOB'], 'dd/MM/yyyy') : "_";
        obj1['Date of Retirement'] =
          this.dataList11[i]['RETIREMENT_DATE'] ? this.datepipe.transform(this.dataList11[i]['RETIREMENT_DATE'], 'dd/MM/yyyy') : "_";
        if (this.dataList11[i]['STATUS'] == 'A') {
          obj1['Status'] = 'Approved';
        } else if (this.dataList11[i]['STATUS'] == 'P') {
          obj1['Status'] = 'Pending';
        } else if (this.dataList11[i]['STATUS'] == 'R') {
          obj1['Status'] = 'Rejected';
        } else if (this.dataList11[i]['STATUS'] == 'D') {
          obj1['Status'] = 'Deleted';
        } else {
          obj1['Status'] = '_';
        }

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Quarter Application Detailed Report' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
