import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ExportService } from 'src/app/Service/export.service';
import { endOfMonth, startOfMonth } from 'date-fns';
import { ServiceService } from 'src/app/Service/service.service';
import { CommonFunctionService } from 'src/app/grass/Services/CommonFunctionService';

@Component({
  selector: 'app-allemployeereport',
  templateUrl: './allemployeereport.component.html',
  styleUrls: ['./allemployeereport.component.css'],
  providers: [DatePipe],
})
export class AllemployeereportComponent implements OnInit {
  formTitle = 'Employees Detailed Report';
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
  show: boolean = false;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['CATEGORY_NAME', 'CATEGORY_NAME'],
    ['SUB_CATEGORY_NAME', 'SUB_CATEGORY_NAME'],
    ['ITHR_DESIGNATION_NAME', 'ITHR_DESIGNATION_NAME'],
  ];

  filtapply: boolean = false;
  showddetails: boolean = false;
  defaultFiltCount: any;
  ranges = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
  };

  public commonFunction = new CommonFunctionService();
  SUB_CATEGORY_ID: any;
  SubCatList: any = [];
  isSpinning = false;
  filterClass: string = 'filter-invisible';

  constructor(
    private api: ServiceService,
    private datePipe: DatePipe,
    private datepipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService,
    public router: Router
  ) {}
  year: any;
  JoinigDate1: any = [];
  datee;
  datee1;
  datee2;
  ngOnInit(): void {
    this.show = true;
    var currentDate = new Date();
    this.datee = sessionStorage.getItem('selectedstartdate');
    this.datee2 = sessionStorage.getItem('selectedenddate');

    // if (
    //   this.datee != null &&
    //   this.datee != undefined &&
    //   this.datee != '' &&
    //   this.datee2 != '' &&
    //   this.datee2 != null &&
    //   this.datee2 != undefined
    // ) {
    //   this.datee = this.datePipe.transform(this.datee, 'yyyy-MM-dd');
    //   this.datee2 = this.datePipe.transform(this.datee2, 'yyyy-MM-dd');
    //   this.JoinigDate1[0] = this.datee;
    //   this.JoinigDate1[1] = this.datee2;
    // } else {
    //   this.JoinigDate1[0] = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     1
    //   );
    //   this.JoinigDate1[1] = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth() + 1,
    //     0
    //   );
    // }
    this.GetRankData();
    // this.GetDesignationData();
    this.GetOfficeData();
    // this.GetClassData();
    this.GetcategoryData();
    // this.GetreligonData()
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
  JoinigDate: any = [];

  disableFutureDates = (current: Date): boolean => {
    var tomorrow: any = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return current.getTime() >= tomorrow.getTime();
  };

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
  }

  // GetDesignationData() {
  //   this.api
  //     .getallDesignation(0, 0, '', 'asc', ' AND STATUS=1')
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         if (data['data'].length > 0) {
  //           this.Designationlist = data['data'];
  //         } else {
  //           this.Designationlist = [];
  //         }
  //       } else {
  //         this.message.error('Failed To Get Designation ', '');
  //         this.Designationlist = [];
  //       }
  //     });
  // }

  TempstartValue: any;
  TempendValue: any;
  applyFilter() {
    this.pageIndex = 1;

    this.showddetails = true;
    this.filtapply = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';

    var filter = '';
    filter = this.filterQuery;
    var likeQuery = '';

    this.search();
    this.showddetails = true;

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
  }

  GENDER: any;
  clearFilter() {
    this.pageIndex = 1;

    this.showddetails = false;
    this.filtapply = false;
    this.isFilterApplied = 'default';

    this.showddetails = false;
    this.Class = [];
    this.Office = [];
    this.Rank = [];
    this.RetirementDate = [];
    this.DOB = [];
    this.Religion = '';
    this.category = '';
    this.SUB_CATEGORY_ID = '';
    this.MARRITAL_STATUS = '';
    this.GENDER = '';
    this.filterQuery = '';
    this.JoinigDate1 = [];

    this.JoinigDate1 = [];

    this.search(true);
  }

  FROM_DATE;
  TO_DATE;
  excelData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
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

  MARRITAL_STATUS: any;
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

    this.filterQuery = '';
    if (this.searchText != '') {
      this.showddetails = true;
      likeQuery = ' AND (';

      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + ' like "%' + this.searchText + '%" OR';
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery += ')';
    } else {
      this.showddetails = false;
    }

    if (this.searchText == '' && this.filtapply == true) {
      this.showddetails = true;
    }
    if (this.Office != null && this.Office != undefined && this.Office != '') {
      this.filterQuery += ' AND ITHR_OFFICE_ID IN ' + '(' + this.Office + ')';
    }

    if (this.Rank != null && this.Rank != undefined && this.Rank != '') {
      this.filterQuery += ' AND DESIGNATION_ID IN ' + '(' + this.Rank + ')';
    }

    if (
      this.category != null &&
      this.category != undefined &&
      this.category != ''
    ) {
      // dataOfficecatb += ' AND CATEGORY_ID =  ' + "'" + this.category + "'";
      this.filterQuery += ' AND CATEGORY_ID IN ' + '(' + this.category + ')';
    }
    if (
      this.SUB_CATEGORY_ID != null &&
      this.SUB_CATEGORY_ID != undefined &&
      this.SUB_CATEGORY_ID != ''
    ) {
      this.filterQuery +=
        ' AND SUB_CATEGORY_ID IN ' + '(' + this.SUB_CATEGORY_ID + ')';
    }
    // if (
    //   this.Religion != null &&
    //   this.Religion != undefined &&
    //   this.Religion != ''
    // ) {
    //   dataOfficereligion += ' AND RELIGION_ID =  ' + "'" + this.Religion + "'";
    // }
    if (this.DOB != undefined && this.DOB != null && this.DOB != '') {
      var FROM_DATE = this.datepipe.transform(this.DOB[0], 'yyyy-MM-dd');
      var TO_DATE = this.datepipe.transform(this.DOB[1], 'yyyy-MM-dd');
      this.filterQuery +=
        " AND DOB BETWEEN '" + FROM_DATE + "' AND '" + TO_DATE + "'";
    }
    // if (
    //   this.JoinigDate != undefined &&
    //   this.JoinigDate != null &&
    //   this.JoinigDate != ''
    // ) {
    //   var FROM_DATE = this.datepipe.transform(this.JoinigDate[0], 'yyyy-MM-dd');
    //   var TO_DATE = this.datepipe.transform(this.JoinigDate[1], 'yyyy-MM-dd');
    //   dataOfficedojpre +=
    //     " AND DOJ_PRESENT_POST BETWEEN '" +
    //     FROM_DATE +
    //     "' AND '" +
    //     TO_DATE +
    //     "'";
    // }

    if (
      this.JoinigDate1 != undefined &&
      this.JoinigDate1 != null &&
      this.JoinigDate1 != ''
    ) {
      var FROM_DATE = this.datepipe.transform(
        this.JoinigDate1[0],
        'yyyy-MM-dd'
      );
      var TO_DATE = this.datepipe.transform(this.JoinigDate1[1], 'yyyy-MM-dd');
      this.filterQuery +=
        " AND JOINING_DATE BETWEEN '" + FROM_DATE + "' AND '" + TO_DATE + "'";
    }

    if (
      this.RetirementDate != undefined &&
      this.RetirementDate != null &&
      this.RetirementDate != ''
    ) {
      var FROM_DATE = this.datepipe.transform(
        this.RetirementDate[0],
        'yyyy-MM-dd'
      );
      var TO_DATE = this.datepipe.transform(
        this.RetirementDate[1],
        'yyyy-MM-dd'
      );
      this.filterQuery +=
        " AND JOINING_DATE BETWEEN '" + FROM_DATE + "' AND '" + TO_DATE + "'";
    }

    if (
      this.MARRITAL_STATUS != null &&
      this.MARRITAL_STATUS != undefined &&
      this.MARRITAL_STATUS != ''
    ) {
      this.filterQuery +=
        ' AND MARRITAL_STATUS =  ' + "'" + this.MARRITAL_STATUS + "'";
    }
    if (this.GENDER != null && this.GENDER != undefined && this.GENDER != '') {
      this.filterQuery += ' AND GENDER =  ' + "'" + this.GENDER + "'";
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .getAllEmployeefordash(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND IS_ITHR_DATA=1 AND IS_RETIRED=0'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              if (
                this.defaultFiltCount == null &&
                this.defaultFiltCount == undefined
              ) {
                this.defaultFiltCount = data['count'];
              } else {
                this.defaultFiltCount = this.defaultFiltCount;
              }
              this.filterClass = 'filter-invisible';
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinning = false;
            } else {
              this.loadingRecords = false;
              this.dataList = [];
              this.message.error('Something Went Wrong...', '');
            }
          },
          (err) => {
            this.loadingRecords = false;
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    } else {
      this.exportLoading = true;

      this.api
        .getAllEmployeefordash(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery + ' AND IS_ITHR_DATA=1'
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
            this.exportLoading = false;
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  convertInExcel(): void {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.excelData.length; i++) {
      obj1['Name'] = this.excelData[i]['NAME'];
      obj1['Employee Code'] = this.excelData[i]['EMPLOYEE_CODE'];
      obj1['Mobile No.'] = this.excelData[i]['MOBILE_NO'];
      obj1['Office'] = this.excelData[i]['ITHR_OFFICE_NAME'];
      obj1['Cadre'] = this.excelData[i]['ITHR_DESIGNATION_NAME'];
      obj1['Date Of Birth'] = this.excelData[i]['DOB'];
      obj1['Joining Date'] = this.excelData[i]['JOINING_DATE'];
      obj1['Retirement Date'] = this.excelData[i]['RETIREMENT_DATE'];
      obj1['Category 1'] = this.excelData[i]['CATEGORY_NAME'];
      obj1['Category 2'] = this.excelData[i]['SUB_CATEGORY_NAME'];
      obj1['Gender'] = this.excelData[i]['GENDER'];
      obj1['Martial Status'] = this.excelData[i]['MARRITAL_STATUS'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.excelData.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Employee Detailed Report"' +
            this.datePipe.transform(new Date(), 'dd/MMM/yyyy')
        );
      }
    }
  }

  drawerTitle = '';
  ID = 0;
  empdata: any;
  drawerdata: any;
  drawerVisible = false;
  // getTotaldata(data) {

  //   this.drawerTitle = 'Employee Details';
  //   this.ID = data.ID
  //   this.api.EmployeeDetailedReport(1, 1, '', '', 'AND ID =' + data.ID, '', '', '', '').subscribe((data) => {
  //     if (data['code'] == 200) {
  //       this.empdata = data['data'][0];
  //     }
  //   }, (err) => {
  //     if (err['ok'] == false) this.message.error('Server Not Found', '');
  //   });
  //   this.api.EmployeePostingProfile(0, 0, 'FROM_DATE', 'asc', '', data.ID,).subscribe((data) => {
  //     if (data['code'] == 200) {
  //       this.drawerdata = data['data'];
  //       this.drawerVisible = true;
  //     } else {
  //       this.message.error('Something Went Wrong...', '');
  //     }
  //   },
  //     (err) => {
  //       if (err['ok'] == false) this.message.error('Server Not Found', '');
  //     }
  //   );
  // }
  drawerClose() {
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  showdash() {
    this.router.navigateByUrl('/claim/reportview');
  }

  GetOfficeData() {
    this.api
      .getAllOfficeForTransfer1111(
        0,
        0,
        '',
        '',
        ''
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
  categoryData: any = [];
  religonData: any = [];
  category: any;
  Religion: any;
  GetcategoryData() {
    this.api
      .getcategoryData(0, 0, '', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.categoryData = data['data'];
          } else {
            this.categoryData = [];
          }
        } else {
          this.message.error('Failed To Get Category Details', '');
          this.categoryData = [];
        }
      });

    this.api
      .getAllSubcategoryMasterData(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.SubCatList = data['data'];
            } else {
              this.SubCatList = [];
            }
          } else {
          }
        },
        (err) => {}
      );
  }
  // GetreligonData() {
  //   this.api
  //     .getreligionData(0, 0, '', 'asc', ' AND STATUS=1')
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         if (data['data'].length > 0) {
  //           this.religonData = data['data'];
  //         } else {
  //           this.religonData = [];
  //         }
  //       } else {
  //         this.message.error('Failed To Get Religon Details', '');
  //         this.religonData = [];
  //       }
  //     });
  // }
  // GetClassData() {
  //   this.api.getAllClassMaster(0, 0, '', 'asc', ' AND STATUS=1').subscribe((data) => {
  //     if (data['code'] == 200) {
  //       if (data['data'].length > 0) {
  //         this.Classlist = data['data'];
  //       } else {
  //         this.Classlist = [];
  //       }
  //     } else {
  //       this.message.error('Failed To Get Group List', '');
  //       this.Classlist = [];
  //     }
  //   });
  // }

  retirementemp: any = [];
  Classlist: any = [];
  Class: any = [];
  DOB: any = '';
  RetirementDate: any = '';

  disableFutureDates1 = (current: Date): boolean => {
    var tomorrow: any = new Date();
    tomorrow.setDate(tomorrow.getDate());
    return current.getTime() >= tomorrow.getTime();
  };
}
