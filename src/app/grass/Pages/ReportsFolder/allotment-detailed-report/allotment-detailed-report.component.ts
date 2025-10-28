import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';
// import { ApiService } from '../../Service/api.service';
// import { ExportService } from '../../Service/export.service';

@Component({
  selector: 'app-allotment-detailed-report',
  templateUrl: './allotment-detailed-report.component.html',
  styleUrls: ['./allotment-detailed-report.component.css'],
  providers: [DatePipe],
})
export class AllotmentDetailedReportComponent implements OnInit {
  formTitle = 'Allotment Detailed Report';

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
  EMPLOYEE: any = [];
  ResidenceTypeData: any = [];
  ResidenceType: any = [];
  Cast;
  GradePayLevel;
  GradePayLevelData: any = [];

  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['DOB', 'DOB'],
    ['CAST', 'CAST'],
    ['JOINING_DATE', 'JOINING_DATE'],
    ['GRADE_PAY_LEVEL', 'GRADE_PAY_LEVEL'],
    ['RETIREMENT_DATE', 'RETIREMENT_DATE'],
    ['MONTH', 'MONTH'],
    ['YEAR', 'YEAR'],
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
  DateOfBirth;
  DOBDate: Date[] = [];
  DateOfPriority: Date[] = [];
  DateOfjoining: Date[] = [];
  DateofRetirement: Date[] = [];

  DOB1: any;
  DOB2: any;
  DateOfPriority1: any;
  DateOfPriority2: any;

  DateOfjoining1: any;
  DateOfjoining2: any;

  DateofRetirement1: any;
  DateofRetirement2: any;

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private cookie: CookieService,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.changeDate(this.DOBDate);
    this.DateOfPriority;
    this.changeDateOfPriority(this.DateOfPriority);

    this.DateofRetirement;
    this.changeDateofRetirement(this.DateofRetirement);

    this.search();
    this.api.getEmployeeMaster(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.EmployeeName = data1['data'];
        // this.applyFilter();
      },
      (err) => { }
    );
    this.api.getresidenceType(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.ResidenceTypeData = data1['data'];
        // this.applyFilter();
      },
      (err) => { }
    );

    this.api.getAllGradePayLevel(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.GradePayLevelData = data1['data'];
        // this.applyFilter();
      },
      (err) => { }
    );
    this.applyFilter();
  }
  changecast(event: any) { }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  keyup(event: any) {
    this.search(true);
  }

  changeDate(value: any) {
    this.DOB1 = this.datepipe.transform(value[0], 'yyyy-MM-dd');
    this.DOB2 = this.datepipe.transform(value[1], 'yyyy-MM-dd');
  }

  changeDateOfPriority(value: any) {
    this.DateOfPriority1 = this.datepipe.transform(value[0], 'yyyy-MM-dd');
    this.DateOfPriority2 = this.datepipe.transform(value[1], 'yyyy-MM-dd');
  }

  changeDateOfjoining(value: any) {
    this.DateOfjoining1 = this.datepipe.transform(value[0], 'yyyy-MM-dd');
    this.DateOfjoining2 = this.datepipe.transform(value[1], 'yyyy-MM-dd');
  }

  changeDateofRetirement(value: any) {
    this.DateofRetirement1 = this.datepipe.transform(value[0], 'yyyy-MM-dd');
    this.DateofRetirement2 = this.datepipe.transform(value[1], 'yyyy-MM-dd');
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  stages: any = [];

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
      //
    }

    this.YEAR1 = this.datepipe.transform(this.YEAR1, 'yyyy');

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';

    // if (this.DOB1 != undefined && this.DOB2 != undefined) {
    //   if (this.DOB1 != null && this.DOB2 == null) {
    //     this.message.error('Please Select End Date', '');
    //   } else if (this.DOB1 == null && this.DOB2 != null) {
    //     this.message.error('Please Select Start Date', '');
    //   } else {
    //     // this.filterQuery += " AND ( DATE BETWEEN '" + this.DOB1 + " 00:00:00" + "' AND '" + this.DOB2 + " 23:59:59" + "' ) "
    //     this.filterQuery +=
    //       " AND ( DOB BETWEEN '" + this.DOB1 + "' AND '" + this.DOB2 + "' ) ";
    //   }
    // }

    // if (
    //   this.DateOfPriority1 != undefined &&
    //   this.DateOfPriority2 != undefined
    // ) {
    //   if (this.DateOfPriority1 != null && this.DateOfPriority2 == null) {
    //     this.message.error('Please Select End Date', '');
    //   } else if (this.DateOfPriority1 == null && this.DateOfPriority2 != null) {
    //     this.message.error('Please Select Start Date', '');
    //   } else {
    //     // this.filterQuery += " AND ( DATE BETWEEN '" + this.DateOfPriority1 + " 00:00:00" + "' AND '" + this.DateOfPriority2 + " 23:59:59" + "' ) "
    //     this.filterQuery +=
    //       " AND ( DATE_OF_PRIORITY BETWEEN '" +
    //       this.DateOfPriority1 +
    //       "' AND '" +
    //       this.DateOfPriority2 +
    //       "' ) ";
    //   }
    // }

    if (
      this.DOBDate.length != 0 &&
      this.DOBDate != undefined &&
      this.DOBDate != null
    ) {
      this.filterQuery +=
        " AND ( DOB BETWEEN '" + this.DOB1 + "' AND '" + this.DOB2 + "' ) ";
    } else {
      this.filterQuery = this.filterQuery;
    }

    // if (
    //   this.DateOfPriority.length != 0 &&
    //   this.DateOfPriority != undefined &&this.DateOfPriority !=null
    // ) {
    //   this.filterQuery +=
    //   " AND ( DATE_OF_PRIORITY BETWEEN '" +
    //     this.DateOfPriority1 +
    //     "' AND '" +
    //     this.DateOfPriority2 +
    //     "' ) ";
    // }else {
    //   this.filterQuery = this.filterQuery;
    // }

    if (
      this.DateOfjoining.length != 0 &&
      this.DateOfjoining != undefined &&
      this.DateOfjoining != null
    ) {
      this.filterQuery +=
        " AND ( JOINING_DATE BETWEEN '" +
        this.DateOfjoining1 +
        "' AND '" +
        this.DateOfjoining2 +
        "' ) ";
    } else {
      this.filterQuery = this.filterQuery;
    }

    if (
      this.DateofRetirement.length != 0 &&
      this.DateofRetirement != undefined &&
      this.DateofRetirement != null
    ) {
      this.filterQuery +=
        " AND ( RETIREMENT_DATE BETWEEN '" +
        this.DateofRetirement1 +
        "' AND '" +
        this.DateofRetirement2 +
        "' ) ";
    } else {
      this.filterQuery = this.filterQuery;
    }

    // if (
    //   this.DateofRetirement1 != undefined &&
    //   this.DateofRetirement2 != undefined
    // ) {
    //   if (this.DateofRetirement1 != null && this.DateofRetirement2 == null) {
    //     this.message.error('Please Select End Date', '');
    //   } else if (
    //     this.DateofRetirement1 == null &&
    //     this.DateofRetirement2 != null
    //   ) {
    //     this.message.error('Please Select Start Date', '');
    //   } else {
    //     // this.filterQuery += " AND ( DATE BETWEEN '" + this.DateofRetirement1 + " 00:00:00" + "' AND '" + this.DateofRetirement2 + " 23:59:59" + "' ) "
    //     this.filterQuery +=
    //       " AND ( RETIREMENT_DATE BETWEEN '" +
    //       this.DateofRetirement1 +
    //       "' AND '" +
    //       this.DateofRetirement2 +
    //       "' ) ";
    //   }
    // }

    if (this.EMPLOYEE.length != 0 && this.EMPLOYEE != '') {
      this.filterQuery += ' AND EMP_ID IN (' + this.EMPLOYEE + ')';
      //  " AND EMPLOYEE_NAME='" + this.EMPLOYEE + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }

    if (
      this.ResidenceType.length != 0 &&
      this.ResidenceType != undefined &&
      this.ResidenceType != ''
    ) {
      this.filterQuery +=
        ' AND RESIDENCE_TYPE_ID IN (' + this.ResidenceType + ')';
      // this.filterQuery +=
      // " AND RESIDENCE_TYPE_NAME='" + this.ResidenceType + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }

    if (this.Cast != null && this.Cast != undefined && this.Cast != '') {
      this.filterQuery += " AND CAST='" + this.Cast + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (
      this.GradePayLevel != null &&
      this.GradePayLevel != undefined &&
      this.GradePayLevel != ''
    ) {
      this.filterQuery +=
        " AND GRADE_PAY_LEVEL_ID='" + this.GradePayLevel + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (this.MONTH != null && this.MONTH != undefined && this.MONTH != '') {
      this.filterQuery += " AND MONTH='" + this.MONTH + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (this.YEAR1 != null && this.YEAR1 != undefined && this.YEAR1 != '') {
      this.filterQuery += " AND YEAR='" + this.YEAR1 + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.YEAR1 = new Date();

    this.MONTH = new Date().getMonth() + 1;
    this.GradePayLevel = '';
    this.Cast = '';
    this.Cast = undefined;
    this.Cast = null;
    this.EMPLOYEE = [];
    this.ResidenceType = [];
    // this.MONTH = '';
    this.DOBDate;
    this.DOBDate;
    this.DateofRetirement = [];
    this.DateOfPriority = [];
    this.DateOfjoining = [];
    this.DOBDate = [];

    // this.DateofRetirement[1]
    this.dataList = [];
    this.changeDate(this.DOBDate);
    this.DateOfPriority;
    this.changeDateOfPriority(this.DateOfPriority);
    this.DateOfPriority;
    this.changeDateOfPriority(this.DateOfPriority);

    this.DateofRetirement;
    this.changeDateofRetirement(this.DateofRetirement);
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
      this.START_DATE = this.datepipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datepipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .finalAllotmentDetailsReports(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          " AND STATUS='Y'" + this.filterQuery + likeQuery
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
        .finalAllotmentDetailsReports(
          0,
          0,
          this.sortKey,
          sort,
          " AND STATUS='Y'" + this.filterQuery + likeQuery
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
        obj1['Name'] = this.excelData[i]['EMPLOYEE_NAME'];

        obj1['Residence Type'] = this.excelData[i]['RESIDENCE_TYPE_NAME'];

        // obj1['Date Of Birth'] = this.excelData[i]['DOB'];
        obj1['Date Of Birth'] =
          this.excelData[i]['DOB'] != null
            ? this.datepipe.transform(this.excelData[i]['DOB'], 'dd/MM/yyyy')
            : this.excelData[i]['DOB'];
        // obj1['Caste'] = this.excelData[i]['CAST'];
        if (this.excelData[i]['CAST'] == 'GN') {
          obj1['Caste'] = 'General';
        } else if (this.excelData[i]['CAST'] == 'SC') {
          obj1['Caste'] = 'Scheduled Caste';
        } else if (this.excelData[i]['CAST'] == 'ST') {
          obj1['Caste'] = 'Scheduled Tribes';
        }
        // obj1['Date Of Priority'] = this.excelData[i]['DATE_OF_PRIORITY'];
        obj1['Date Of Joining'] =
          this.excelData[i]['JOINING_DATE'] != null
            ? this.datepipe.transform(
              this.excelData[i]['JOINING_DATE'],
              'dd/MM/yyyy'
            )
            : this.excelData[i]['JOINING_DATE'];
        obj1['Date Of Priority'] =
          this.excelData[i]['DATE_OF_PRIORITY'] != null
            ? this.datepipe.transform(
              this.excelData[i]['DATE_OF_PRIORITY'],
              'dd/MM/yyyy'
            )
            : this.excelData[i]['DATE_OF_PRIORITY'];
        obj1['Grade Pay Level'] = this.excelData[i]['GRADE_PAY_LEVEL'];
        // obj1['Date of Retirement'] = this.excelData[i]['RETIREMENT_DATE'];
        obj1['Date Of Retirement'] =
          this.excelData[i]['RETIREMENT_DATE'] != null
            ? this.datepipe.transform(
              this.excelData[i]['RETIREMENT_DATE'],
              'dd/MM/yyyy'
            )
            : this.excelData[i]['RETIREMENT_DATE'];

        // obj1['Month'] = this.excelData[i]['MONTH'];
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
            'Allotment Detailed Report' +
            this.datepipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
