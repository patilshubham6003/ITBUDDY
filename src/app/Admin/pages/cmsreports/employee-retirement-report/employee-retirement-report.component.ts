import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ExportService } from 'src/app/Service/export.service';
import { startOfMonth, endOfMonth } from 'date-fns';
import { CommonFunctionService } from 'src/app/grass/Services/CommonFunctionService';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-employee-retirement-report',
  templateUrl: './employee-retirement-report.component.html',
  styleUrls: ['./employee-retirement-report.component.css'],
  providers: [DatePipe],
})
export class EmployeeRetirementReportComponent {
  formTitle = 'Employee Retirement Report';

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  showddetails: boolean = false;

  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['CADRE_NAME', 'CADRE_NAME'],
  ];

  public commonFunction = new CommonFunctionService();

  isSpinning = false;
  filterClass: string = 'filter-visible';

  constructor(
    private api: ServiceService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService,
    public router: Router
  ) {}

  ngOnInit(): void {
    var currentDate = new Date();
    // this.date1[0] = new Date(
    //   currentDate.getFullYear(),
    //   currentDate.getMonth(),
    //   1
    // );
    // this.date1[1] = new Date();
    this.GetRankData();
    // this.GetDesignationData();
    this.GetOfficeData();
    // this.totalrecords();
    // this.getCounts();
  }
  showdash() {
    this.router.navigateByUrl('/claim/reportview');
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

  RateseparatedIds: number[];
  concatenatedRateIds: string;
  DesignationseparatedIds: number[];
  concatenatedDesignationIds: string;
  OfficeseparatedIds: number[];
  concatenatedOfficeIds: string;
  Rank: any = [];
  Ranklist: any = [];
  Office: any = [];
  OfficeDatalist: any = [];
  Designation: any = [];
  Designationlist: any = [];
  JoinigDate: any;

  disableFutureDates = (current: Date): boolean => {
    var tomorrow: any = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return current.getTime() >= tomorrow.getTime();
  };

  GetOfficeData() {
    this.api
      .getAllOfficeForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL'
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.OfficeDatalist = data['data'];
          } else {
            this.OfficeDatalist = [];
          }
        } else {
          this.message.error('Failed To Get Office Details', '');
          this.OfficeDatalist = [];
        }
      });
  }
  typelist: any;
  GetRankData() {
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL '
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.Ranklist = data['data'];
            // this.Rank = data['data'][0]['ID'];
          } else {
            this.Ranklist = [];
          }
        } else {
          this.message.error('Failed To Get Cadre List', '');
          this.Ranklist = [];
        }
      });

    this.api
      .getretirmenttypedata(0, 0, '', '', ' AND ID<>1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.typelist = data['data'];
            // this.Rank = data['data'][0]['ID'];
          } else {
            this.typelist = [];
          }
        } else {
          this.message.error('Failed To Get Cadre List', '');
          this.typelist = [];
        }
      });
  }

  // GetDesignationData() {
  //   this.api.getallDesignation(0, 0, '', 'asc', ' AND STATUS=1').subscribe((data) => {
  //     if (data['code'] == 200) {
  //       if (data['data'].length > 0) {
  //         this.Designationlist = data['data'];
  //       } else {
  //         this.Designationlist = [];
  //       }
  //     } else {
  //       this.message.error('Failed To Get Designation ', '');
  //       this.Designationlist = [];
  //     }
  //   });

  // }

  TempstartValue: any;
  TempendValue: any;
  filterapply: boolean = false;
  applyFilter() {
    this.pageIndex = 1;
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

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';
    this.isFilterApplied = 'primary';
    this.showddetails = true;
    this.filterapply = true;
    this.search();
    // this.getCounts();
  }

  clearFilter() {
    this.pageIndex = 1;

    this.isFilterApplied = 'default';
    this.showddetails = false;
    this.filterapply = false;
    this.filterQuery = '';
    var currentDate = new Date();
    // this.date1[0] = new Date(
    //   currentDate.getFullYear(),
    //   currentDate.getMonth(),
    //   1
    // );
    // this.date1[1] = new Date();
    this.RETIREMENT_TYPE = [];
    this.Designation = [];
    this.date1 = [];
    this.Rank = [];
    this.Office = [];
    this.search();
    // this.getCounts();
  }

  excelData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  FROM_RETIREMENT_DATE;
  TO_RETIREMENT_DATE;
  RETIREMENT_TYPE: any;
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
      this.showddetails = true;
    } else {
      this.showddetails = false;
    }

    if (this.searchText == '' && this.filterapply == true) {
      this.showddetails = true;
    }
    var date;

    var dataOffice = '';
    var dataOfficerank = '';
    if (this.Office != null && this.Office != undefined && this.Office != '') {
      dataOffice += ' AND ITHR_OFFICE_ID IN ' + '(' + this.Office + ')';
    }

    if (this.Rank != null && this.Rank != undefined && this.Rank != '') {
      dataOfficerank += ' AND DESIGNATION_ID IN ' + '(' + this.Rank + ')';
    }

    var dataOfficeranktype = '';
    if (
      this.RETIREMENT_TYPE != null &&
      this.RETIREMENT_TYPE != undefined &&
      this.RETIREMENT_TYPE != ''
    ) {
      dataOfficeranktype +=
        ' AND RETIREMENT_TYPE_ID IN ' + '(' + this.RETIREMENT_TYPE + ')';
    }
    var dataOfficeregist = '';
    if (this.date1.length == 2) {
      var FROM_DATE = this.datePipe.transform(this.date1[0], 'yyyy-MM-dd');
      var TO_DATE = this.datePipe.transform(this.date1[1], 'yyyy-MM-dd');
      dataOfficeregist +=
        " AND RETIREMENT_DATE BETWEEN '" +
        FROM_DATE +
        "' AND '" +
        TO_DATE +
        "'";
    } else {
    }

    var filter =
      dataOffice + dataOfficeregist + dataOfficerank + dataOfficeranktype;

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .employeeRetirementDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + filter + ' AND IS_ITHR_DATA=1'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];

              this.isFilterApplied = 'primary';

              this.api
                .getretrimentcount(
                  0,
                  0,
                  '',
                  '',
                  likeQuery + filter + ' AND IS_ITHR_DATA=1'
                )
                .subscribe(
                  (dataAAA) => {
                    if (dataAAA['code'] == 200) {
                      this.spin = false;

                      this.retrimentcount = dataAAA['data'][0];
                      this.isSpinning = false;
                    } else {
                      this.spin = false;
                      this.message.error('Something Went Wrong...', '');
                    }
                  },
                  (err) => {
                    this.isSpinning = false;
                    if (err['ok'] == false)
                      this.message.error('Server Not Found', '');
                  }
                );
            } else {
              this.loadingRecords = false;
              this.isSpinning = false;
              this.dataList = [];
              this.message.error('Something Went Wrong...', '');
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isSpinning = false;
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.exportLoading = false;

      this.api
        .employeeRetirementDetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + filter + ' AND IS_ITHR_DATA=1'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.excelData = data['data'];
              this.convertInExcel();
            } else {
              this.excelData = [];
              this.exportLoading = false;
              this.message.error('Something Went Wrong...', '');
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  abcosdingcount: any;
  retrimentcount: any;

  spin: boolean = false;
  spin2: boolean = false;
  spin3: boolean = false;
  getCounts(reset: boolean = false, exportInExcel: boolean = false) {
    var likeQuery = '';
    var dataOffice = '';
    var dataOffice1 = '';
    var dataOfficerank = '';
    var dataOfficerank1 = '';
    var dataOfficeregist1 = '';

    var dataOfficeregist = '';

    if (this.Office != null && this.Office != undefined && this.Office != '') {
      dataOffice += ' AND ITHR_OFFICE_ID IN ' + '(' + this.Office + ')';
      dataOffice1 += ' AND OFFICE_ID IN ' + '(' + this.Office + ')';
    }

    if (this.Rank != null && this.Rank != undefined && this.Rank != '') {
      dataOfficerank += ' AND DESIGNATION_ID IN ' + '(' + this.Rank + ')';
      dataOfficerank1 += ' AND RANK_ID IN ' + '(' + this.Rank + ')';
    }

    if (this.date1 != undefined && this.date1 != null && this.date1 != '') {
      var FROM_DATE: any = this.datePipe.transform(this.date1[0], 'yyyy-MM-dd');
      var TO_DATE: any = this.datePipe.transform(this.date1[1], 'yyyy-MM-dd');
      dataOfficeregist +=
        " AND RETIREMENT_DATE BETWEEN '" +
        FROM_DATE +
        "' AND '" +
        TO_DATE +
        "'";
    }

    this.spin = true;
    this.spin2 = true;
    this.spin3 = true;
  }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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

    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Name'] = this.excelData[i]['EMPLOYEE_NAME']
          ? this.excelData[i]['EMPLOYEE_NAME']
          : ' ';
        obj1['Employee No'] = this.excelData[i]['EMPLOYEE_CODE']
          ? this.excelData[i]['EMPLOYEE_CODE']
          : ' ';

        obj1['Office Name'] = this.excelData[i]['ITHR_OFFICE_NAME']
          ? this.excelData[i]['ITHR_OFFICE_NAME']
          : ' ';
        obj1['Cadre'] = this.excelData[i]['CADRE_NAME']
          ? this.excelData[i]['CADRE_NAME']
          : ' ';
        obj1['Retirement Type'] = this.excelData[i]['RETIREMENT_TYPE']
          ? this.excelData[i]['RETIREMENT_TYPE']
          : ' ';

        obj1['Retirement Date'] = this.datePipe.transform(
          this.excelData[i]['RETIREMENT_DATE'],
          'dd/MM/yyyy '
        );
        obj1['Remark'] = this.datePipe.transform(
          this.excelData[i]['REAMRK'],
          'dd/MM/yyyy '
        );
        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Employee Retirement Report ' +
              this.datePipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
  drawerdata: any = [];
  drawerTitle = '';
  drawerVisible: boolean = false;
  prevData: any = [];
  empdata: any = [];
  date1: any = [];
  getTotaldata(data) {
    // this.drawerTitle = "Employee Details"
    // if (this.date1 != undefined || this.date1.length != 0) {
    //   this.FROM_RETIREMENT_DATE = this.datePipe.transform(this.date1[0], 'yyyy-MM-dd');
    //   this.TO_RETIREMENT_DATE = this.datePipe.transform(this.date1[1], 'yyyy-MM-dd')
    // }
    // this.api.employeeRetirementDetailedReport(1, 1, '', '', 'AND EMPLOYEE_ID = ' + data.ID, '', '', this.FROM_RETIREMENT_DATE, this.TO_RETIREMENT_DATE, '').subscribe((data) => {
    //   if (data['code'] == 200) {
    //     this.empdata = data['data'][0];
    //   }
    // },
    //   (err) => {
    //     if (err['ok'] == false) this.message.error('Server Not Found', '');
    //   }
    // );
    // this.api.EmployeePostingProfile(0, 0, 'FROM_DATE', 'asc', '', data.ID,).subscribe((data) => {
    //   if (data['code'] == 200) {
    //     this.drawerdata = data['data'];
    //     this.drawerVisible = true;
    //   } else {
    //     this.message.error('Something Went Wrong...', '');
    //   }
    // },
    //   (err) => {
    //     if (err['ok'] == false) this.message.error('Server Not Found', '');
    //   }
    // );
  }
  ranges = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
  };
  drawerClose() {
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  totalRecords1;
  // totalrecords() {
  //   if (this.date1 != undefined || this.date1.length != 0) {
  //     this.FROM_RETIREMENT_DATE = this.datePipe.transform(
  //       this.date1[0],
  //       'yyyy-MM-dd'
  //     );
  //     this.TO_RETIREMENT_DATE = this.datePipe.transform(
  //       this.date1[1],
  //       'yyyy-MM-dd'
  //     );
  //   }
  //   this.api
  //     .employeeRetirementDetailedReport(
  //       '',
  //       '',
  //       '',
  //       '',
  //       '',
  //       '',
  //       '',
  //       this.FROM_RETIREMENT_DATE,
  //       this.TO_RETIREMENT_DATE,
  //       ''
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.loadingRecords = false;
  //           this.totalRecords1 = data['count'];
  //         } else {
  //           this.loadingRecords = false;
  //         }
  //       },
  //       (err) => {
  //         this.loadingRecords = false;
  //         if (err['ok'] == false) this.message.error('Server Not Found', '');
  //       }
  //     );
  // }
}
