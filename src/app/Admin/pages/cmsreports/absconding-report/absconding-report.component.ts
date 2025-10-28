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
  selector: 'app-absconding-report',
  templateUrl: './absconding-report.component.html',
  styleUrls: ['./absconding-report.component.css'],
  providers: [DatePipe],
})
export class AbscondingReportComponent {
  formTitle = 'Absconding Detailed Report';
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
    ['ITHR_EMPLOYEE_NAME', 'ITHR_EMPLOYEE_NAME'],
    ['ITHR_MOBILE_NO', 'ITHR_MOBILE_NO'],
    ['ITHR_OFFICE_NAME', 'ITHR_OFFICE_NAME'],
    ['ITHR_RANK_NAME', 'ITHR_RANK_NAME'],
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
  filterClass: string = 'filter-visible';

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
    this.getCount();
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
        ' AND STATUS=1 AND MDB_ID IN(11,39,16,17,20,12,21,22,40,44,25)'
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
    this.getCount();
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

  clearFilter() {
    this.pageIndex = 1;

    this.showddetails = false;
    this.filtapply = false;
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-visible';
    this.showddetails = false;
    this.Class = [];
    this.Office = [];
    this.Rank = [];
    this.RetirementDate = [];
    this.DOB = [];
    this.Religion = '';
    this.category = '';
    this.SUB_CATEGORY_ID = '';
    this.filterQuery = '';
    this.JoinigDate1 = [];
    var currentDate = new Date();
    // this.JoinigDate1[0] = new Date(
    //   currentDate.getFullYear(),
    //   currentDate.getMonth(),
    //   1
    // );
    // this.JoinigDate1[1] = new Date(
    //   currentDate.getFullYear(),
    //   currentDate.getMonth() + 1,
    //   0
    // );

    this.search(true);
    this.getCount();
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
    var dataOffice = '';
    var dataOfficerank = '';
    var dataOfficeclass = '';
    var dataOfficecatb = '';
    var dataOfficereligion = '';
    var dataOfficedob = '';
    var dataOfficedojpre = '';
    var dataOfficeregist = '';
    var dataOfficeretire = '';
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
      dataOffice = ' AND OFFICE_ID IN ' + '(' + this.Office + ')';
    } else {
      dataOffice = ' AND OFFICE_ID IN (1,211,157,156,497)';
    }
    //ITHR_OFFICE_ID

    if (this.Rank != null && this.Rank != undefined && this.Rank != '') {
      dataOfficerank += ' AND RANK_ID IN ' + '(' + this.Rank + ')';
    }else {
      dataOfficerank +=" AND RANK_ID IN(11,39,16,17,20,12,21,22,40,44,25)"
    }
    // if (this.Class != null && this.Class != undefined && this.Class != '') {
    //   dataOfficeclass += ' AND CLASS_ID IN ' + '(' + this.Class + ')';
    // }

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
      dataOfficeregist +=
        " AND DOJ_PRESENT_POST BETWEEN '" +
        FROM_DATE +
        "' AND '" +
        TO_DATE +
        "'";
    }

    this.filterQuery =
      dataOffice +
      dataOfficerank +
      dataOfficeclass +
      dataOfficecatb +
      dataOfficereligion +
      dataOfficedob +
      dataOfficedojpre +
      dataOfficeregist +
      dataOfficeretire;
    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .getabcoundingreportdata(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
            ' AND IS_ITHR_DATA=1 AND ITHR_IS_RETIRED =0' +
            this.filterQuery
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
        .getabcoundingreportdata(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + ' AND  IS_ITHR_DATA=1' + this.filterQuery
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

  abcosdingcount: any;
  retrimentcount: any;

  spin: boolean = false;
  spin2: boolean = false;
  spin3: boolean = false;
  getCount(reset: boolean = false, exportInExcel: boolean = false) {
    var likeQuery = '';
    var dataOffice = '';
    var dataOffice1 = '';
    var dataOfficerank = '';
    var dataOfficerank1 = '';
    var dataOfficeregist1 = '';

    if (this.Office != null && this.Office != undefined && this.Office != '') {
      dataOffice += ' AND ITHR_OFFICE_ID IN ' + '(' + this.Office + ')';
      dataOffice1 += ' AND OFFICE_ID IN ' + '(' + this.Office + ')';
    } else {
      dataOffice1 = ' AND OFFICE_ID IN (1,211,157,156,497)';
    }

    if (this.Rank != null && this.Rank != undefined && this.Rank != '') {
      dataOfficerank += ' AND DESIGNATION_ID IN ' + '(' + this.Rank + ')';
      dataOfficerank1 += ' AND RANK_ID IN ' + '(' + this.Rank + ')';
    }else {
      dataOfficerank1 += "AND RANK_ID IN(11,39,16,17,20,12,21,22,40,44,25)"
    }

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

      dataOfficeregist1 +=
        " AND DOJ_PRESENT_POST BETWEEN '" +
        FROM_DATE +
        "' AND '" +
        TO_DATE +
        "'";
    }

    this.spin2 = true;

    this.api
      .getabscoundingcount(
        0,
        0,
        '',
        '',
        likeQuery +
          dataOffice1 +
          dataOfficerank1 +
          dataOfficeregist1 +
          ' AND IS_ITHR_DATA=1 AND ITHR_IS_RETIRED=0 '
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;

            this.abcosdingcount = data['data'][0];
            this.spin2 = false;
          } else {
            this.spin2 = false;
            this.message.error('Something Went Wrong...', '');
          }
        },
        (err) => {
          this.spin2 = false;
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
  }
  convertInExcel(): void {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.excelData.length; i++) {
      obj1['Name'] = this.excelData[i]['ITHR_EMPLOYEE_NAME'];
      obj1['Employee Code'] = this.excelData[i]['ITHR_EMPLOYEE_CODE'];
      obj1['Mobile No.'] = this.excelData[i]['ITHR_MOBILE_NO'];
      obj1['Office'] = this.excelData[i]['ITHR_OFFICE_NAME'];
      obj1['Cadre'] = this.excelData[i]['ITHR_RANK_NAME'];
      obj1['Date Of Birth'] = this.excelData[i]['ITHR_DOB'];
      obj1['Joining Date'] = this.excelData[i]['ITHR_JOINING_DATE'];
      // obj1['Retirement Date'] = this.excelData[i]['ITHR_RETIREMENT_DATE'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.excelData.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'absconding-report' +
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
      .getAllOfficeForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID in (1,211,157,156,497)'
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
