import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { LTCMaster } from 'src/app/Medical/Models/LTCMaster';
import { Realtionshipdata } from 'src/app/Medical/Models/relationship';
import { checkListltc1 } from 'src/app/Medical/Models/checklistltc';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
});
const toWordsen = new ToWords({
  localeCode: 'hi-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'रुपये',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});

@Component({
  selector: 'app-employeeltclist',
  templateUrl: './employeeltclist.component.html',
  styleUrls: ['./employeeltclist.component.css'],
  providers: [NzNotificationService],
})
export class EmployeeltclistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';

  drawerData: LTCMaster = new LTCMaster();
  editrelation: Realtionshipdata = new Realtionshipdata();
  checkListltc: checkListltc1 = new checkListltc1();
  // data: ClaimMaster = new ClaimMaster();
  // userId = Number(sessionStorage.getItem('userId'));
  userId: any;
  userName = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;

  formTitle = 'Manage LTC';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  size = 'small';
  isFilterApplied: any = 'default';
  newButton: string = 'default';
  forwardButton: string = 'default';
  rejectButton: string = 'default';
  queryButton: string = 'default';
  approvedButton: string = 'default';
  readyButton: string = 'default';
  totalButton: string = 'default';

  allClaimCount: any;
  allNewCount: any;
  allForwardCount: any;
  allRejectCount: any;
  allQueryCount: any;
  allApprovedCount: any;
  allReadyCount: any;
  REFRED_RATE_LIST = '';
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['GRADE_PAY', 'GRADE_PAY'],
    ['GRADE_PAY_LEVEL', 'GRADE_PAY_LEVEL'],
    ['NATURE_OF_LEAVE', 'NATURE_OF_LEAVE'],
    ['LEAVE_START_DATE', 'LEAVE_START_DATE'],
    ['LEAVE_END_DATE', 'LEAVE_END_DATE'],
    ['BLOCK_YEAR', 'BLOCK_YEAR'],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME: any;
  INSPECTOR_ID: any;
  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.BILL_FILIING_DATE = [];
    // this.BILL_FILIING_DATE[0] = new Date(
    //   this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    // );
    // this.BILL_FILIING_DATE[1] = new Date();
    this.TYPE_OF_HOSPITAL = [];
    this.dataList = [];
    this.search();
  }

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  // TYPE_OF_HOSPITAL: any = [];

  START_DATE: any;
  END_DATE: any;
  BILL_FILIING_DATE: any = [];
  current: any = new Date();
  rejectClaimVisible: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.loadAllUsers();
    this.search();
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  stages: any = [];
  stageName() {
    this.api.getStage(0, 0, '', 'asc', 'AND STATUS=1').subscribe(
      (data1) => {
        this.stages = data1['data'];
      },
      (err) => {}
    );
  }

  // sort(params: NzTableQueryParams): void {
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'id';
  //   const sortOrder = (currentSort && currentSort.value) || 'desc';

  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.pageSize2 != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize2 = pageSize;
  //   }

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search();
  // }
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
  userIdFilter;
  search(reset: boolean = false) {
    this.isSpinning = true;
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

    if (
      this.BILL_FILIING_DATE != undefined &&
      this.BILL_FILIING_DATE.length != 0
    ) {
      this.START_DATE = this.datePipe.transform(
        this.BILL_FILIING_DATE[0],
        'yyyy-MM-dd'
      );
      this.END_DATE = this.datePipe.transform(
        this.BILL_FILIING_DATE[1],
        'yyyy-MM-dd'
      );
    } else {
      this.START_DATE = null;
      this.END_DATE = null;
    }
    // if (Number(sessionStorage.getItem('roleId')) == 3) {
    //   this.userIdFilter =
    //     ' AND INSPECTOR_ID = ' + Number(sessionStorage.getItem('userId'));
    // } else if (Number(sessionStorage.getItem('roleId')) == 4) {
    //   this.userIdFilter =
    //     ' AND AO_ID = ' + Number(sessionStorage.getItem('userId'));
    // } else {
    //   this.userIdFilter = '';
    // }
    this.loadingRecords = true;

    this.api
      .getAllltcMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery + likeQuery + 'AND EMP_ID =' + this.userId
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
            this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
  }
  certificateVisible = false;
  certificateTitle: string;
  ltcsheet1VisibleTitle = 'Order';
  ltcsheet2VisibleTitle = 'Part B';

  visible4 = false;
  visible5 = false;
  visible6 = false;
  OrderData: any;
  Order(data: any) {
    this.loadingRecords = true;
    this.OrderData = data;

    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];

          this.ltcsheet1Visible = true;
          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['FAIR_PAID'];
          }
          this.namount = this.amount - this.OrderData.AMOUNT_OF_ADVANCE;
          this.loadingRecords = false;
        }
      });

    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.relationdata1 = data['data'];
        },
        (err) => {}
      );
  }
  partBData: any;
  POST: any;
  OFFICE_NAME: any;
  NAME: any;
  partB(data: any) {
    this.loadingRecords = true;
    this.partBData = data;
    this.namount = 0;
    if (
      this.partBData.SIGNATURE_ID != undefined &&
      this.partBData.SIGNATURE_ID != null &&
      this.partBData.SIGNATURE_ID != ''
    ) {
      this.api
        .getSignature(0, 0, '', '', ' AND ID = ' + data.SIGNATURE_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              // this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
              this.NAME = data['data'][0]['NAME'];
              // this.NAME_HN = data['data'][0]['NAME_HN'];
              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              // this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
              this.POST = data['data'][0]['POST'];
              // this.POST_HN = data['data'][0]['POST_HN'];
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    } else {
    }
    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.partBData.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];

          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['FAIR_PAID'];
          }
          this.namount = this.amount - this.partBData.AMOUNT_OF_ADVANCE;
          if (
            this.partBData.AMOUNT != null &&
            this.partBData.AMOUNT != undefined &&
            this.partBData.AMOUNT != ''
          ) {
            this.namount = this.namount + this.partBData.AMOUNT;
          }
          this.loadingRecords = false;
          this.ltcsheet2Visible = true;
        }
      });
  }

  manjuriAdheshData: any;
  manjuriAdhesh(data: any) {
    this.loadingRecords = true;
    this.manjuriAdheshData = data;
    this.namount = 0;

    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];

          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['FAIR_PAID'];
          }
          this.namount = this.amount - this.manjuriAdheshData.AMOUNT_OF_ADVANCE;
          this.loadingRecords = false;
          this.ltcorderVisible = true;
        }
      });
  }
  finalOrderData: any;
  finalOrder(data: any) {
    this.loadingRecords = true;
    this.aamount = 0;
    this.namount = 0;
    this.ltcID = data.ID;
    this.finalOrderData = data;
    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdata1 = data['data'];
            }

            this.api
              .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.formdata7 = data['data'];

                  this.amount = 0;
                  for (let i = 0; i < this.formdata7.length; i++) {
                    this.amount += this.formdata7[i]['FAIR_PAID'];
                  }
                  this.namount =
                    this.amount - this.finalOrderData.AMOUNT_OF_ADVANCE;
                  this.loadingRecords = false;
                  this.visible4 = true;
                }
              });
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  calculationSheetData: any;
  amount: any;
  namount: any = 0;
  calculationSheet(data: any) {
    this.loadingRecords = true;
    this.ltcID = data.ID;
    this.namount = 0;
    this.calculationSheetData = data;

    this.api

      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)

      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];

          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['FAIR_PAID'];
          }

          this.namount =
            this.amount - this.calculationSheetData.AMOUNT_OF_ADVANCE;
          this.visible5 = true;
          this.loadingRecords = false;
        }
      });
  }

  aamount = 0;
  partAData: any = [];
  formdata3: any = [];
  formdata1: any = [];
  relationdata1: any = [];
  formdata7: any = [];
  // partA(data: any) {
  //   this.loadingRecords = true;
  //   this.aamount = 0;
  //   this.partAData = data;
  //   this.ltcID = data.ID;
  //   this.api
  //     .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           if (data['data'].length > 0) {
  //             this.relationdata1 = data['data'];
  //
  //           }

  //           this.api
  //             .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
  //             .subscribe((data) => {
  //               if (data['code'] == 200) {
  //                 this.formdata7 = data['data'];
  //
  //                 for (let i = 0; i < this.formdata7.length; i++) {
  //                   this.aamount += this.formdata7[i]['FAIR_PAID'];
  //
  //                 }
  //                 this.api
  //                   .getJourneyParticular(
  //                     0,
  //                     0,
  //                     '',
  //                     'asc',
  //                     ' AND LTC_ID =' + this.ltcID
  //                   )
  //                   .subscribe((data) => {
  //                     if (data['code'] == 200) {
  //                       this.formdata3 = data['data'];
  //
  //                       this.api
  //                         .ltcRoadConnectedRail(
  //                           0,
  //                           0,
  //                           '',
  //                           'asc',
  //                           ' AND LTC_ID =' + this.ltcID
  //                         )
  //                         .subscribe((data) => {
  //                           if (data['code'] == 200) {
  //                             this.formdata1 = data['data'];
  //
  //                             this.visible6 = true;
  //                             this.loadingRecords = false;
  //                           }
  //                         });
  //                     }
  //                   });
  //               }
  //             });
  //         }
  //       },
  //       (err) => {
  //
  //         this.loadingRecords = false;
  //       }
  //     );
  // }

  childrenList: any = [];
  wifeList: any = [];
  selfList: any = [];
  partA(data: any) {
    this.loadingRecords = true;
    this.aamount = 0;
    this.partAData = data;
    this.ltcID = data.ID;
    this.childrenList = [];
    this.wifeList = [];
    this.selfList = [];
    this.relationdata1 = [];
    this.formdata7 = [];
    this.formdata1 = [];
    this.formdata3 = [];
    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdata1 = data['data'];
              for (let i = 0; i < this.relationdata1.length; i++) {
                if (this.relationdata1[i].RELATIONSHIP == 'Wife') {
                  this.wifeList.push(
                    this.relationdata1[i].NAME_OF_FAMILY_MEMBER
                  );
                } else if (
                  this.relationdata1[i].RELATIONSHIP == 'Daughter' ||
                  this.relationdata1[i].RELATIONSHIP == 'Son'
                ) {
                  this.childrenList.push(
                    this.relationdata1[i].NAME_OF_FAMILY_MEMBER
                  );
                } else if (this.relationdata1[i].RELATIONSHIP == 'Self') {
                  this.selfList.push(
                    this.relationdata1[i].NAME_OF_FAMILY_MEMBER
                  );
                } else {
                }
              }
            }

            this.api
              .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.formdata7 = data['data'];

                  for (let i = 0; i < this.formdata7.length; i++) {
                    this.aamount += this.formdata7[i]['FAIR_PAID'];
                  }
                  this.api
                    .getJourneyParticular(
                      0,
                      0,
                      '',
                      'asc',
                      ' AND LTC_ID =' + this.ltcID
                    )
                    .subscribe((data) => {
                      if (data['code'] == 200) {
                        this.formdata3 = data['data'];

                        this.api
                          .ltcRoadConnectedRail(
                            0,
                            0,
                            '',
                            'asc',
                            ' AND LTC_ID =' + this.ltcID
                          )
                          .subscribe((data) => {
                            if (data['code'] == 200) {
                              this.formdata1 = data['data'];

                              // this.visible6 = true;
                              this.loadingRecords = false;

                              this.api
                                .getJourneyParticular(
                                  0,
                                  0,
                                  '',
                                  'asc',
                                  ' AND LTC_ID =' + this.ltcID
                                )
                                .subscribe((data) => {
                                  if (data['code'] == 200) {
                                    this.formdata3 = data['data'];

                                    this.api
                                      .ltcJourneyChecklistget(
                                        0,
                                        0,
                                        '',
                                        'asc',
                                        ' AND LTC_ID =' + this.ltcID
                                      )
                                      .subscribe((data) => {
                                        if (data['code'] == 200) {
                                          if (data['data'].length > 0) {
                                            this.checkListltc = data['data'][0];
                                          }
                                          this.visible6 = true;
                                          this.loadingRecords = false;
                                        }
                                      });
                                  }
                                });
                            }
                          });
                      }
                    });
                }
              });
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  get close4rCloseCallback() {
    return this.close4.bind(this);
  }
  close4() {
    this.visible4 = false;
    this.search();
  }
  get close5rCloseCallback() {
    return this.close5.bind(this);
  }
  close5() {
    this.visible5 = false;
    this.search();
  }

  close6() {
    this.visible6 = false;
    this.search();
  }

  get close6CloseCallback() {
    return this.close6.bind(this);
  }

  visible7: boolean = false;
  passenger: any;
  calculationData: any = [];
  calculationDatalist: any = [];
  calculation(data: any) {
    this.loadingRecords = true;
    this.aamount = 0;
    this.namount = 0;
    this.calculationData = data;
    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdata1 = data['data'];
              this.passenger = data['data'].length;
            }
            this.api
              .ltcJourneyDetail(
                0,
                0,
                '',
                'asc',
                ' AND LTC_ID =' + this.calculationData.ID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.formdata7 = data['data'];
                  for (let i = 0; i < this.formdata7.length; i++) {
                    if (this.formdata7[i]['TRAVEL_MODE_NAME'] == 'Air') {
                      this.aamount += this.formdata7[i]['FAIR_PAID'];
                    }
                  }
                  this.visible7 = true;
                  this.loadingRecords = false;
                }
              });
          } else {
            this.passenger = 0;
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  get close7CloseCallback() {
    return this.close7.bind(this);
  }
  close7() {
    this.visible7 = false;
  }
  GoLtcFinal = 'Final Order';
  calculationTitle = 'Calculation';
  calculationsheet = 'Calculation Sheet';
  concession = 'Part A';

  opendd() {
    // this.certificateVisible=true;
    // this.GARVisible=true;
    // this.ltcsheet1Visible = true;
    // this.ltcsheet2Visible = true;
    // this.ltcorderVisible=true;
  }

  ltcorderVisible = false;
  ltcorderVisibleClose(): void {
    this.ltcorderVisible = false;
    this.search();
  }

  ltcorderVisibleTitle = '';
  get ltcorderCloseCallback() {
    return this.ltcorderVisibleClose.bind(this);
  }

  ltcsheet1Visible = false;
  ltcsheet1VisibleClose(): void {
    this.ltcsheet1Visible = false;
    this.search();
  }

  get ltcsheet1CloseCallback() {
    return this.ltcsheet1VisibleClose.bind(this);
  }
  ltcsheet2Visible = false;
  ltcsheet2VisibleClose(): void {
    this.ltcsheet2Visible = false;
    this.search();
  }

  get ltcsheet2CloseCallback() {
    return this.ltcsheet2VisibleClose.bind(this);
  }

  applyFilter() {
    if (
      this.INSPECTOR_ID != null &&
      this.INSPECTOR_ID != undefined &&
      this.INSPECTOR_ID != ''
    ) {
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.loadingRecords = false;
      var sort: string;

      try {
        sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }
      this.filterQuery = ' AND INSPECTOR_ID = ' + this.INSPECTOR_ID;
      this.search();
    } else {
      this.message.error('Please Select Inspector Name', '');
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  drawerClose(): void {
    this.currentStage = 0;
    this.search();
    this.drawerVisible = false;
    // window.location.reload();
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  currentStage = 0;
  isSpin: boolean = false;
  add(): void {
    this.drawerTitle = 'Create New Claim';
    this.drawerData = new LTCMaster();
    this.currentStage = 0;
    this.isSpin = false;
    this.relationdata = [];

    this.ltcID = '';
    this.empID = '';

    this.drawerVisible = true;
  }

  add1(): void {
    this.isSpin = false;
    this.relationdata = [];

    this.editrelation = new Realtionshipdata();

    this.ltcID = '';
    this.empID = '';
    this.drawerTitle = 'Create New Claim';
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.userId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.drawerData = Object.assign({}, data['data'][0]);
            this.drawerData['EMPLOYEE_NAME'] = this.drawerData['NAME'];
          }
          this.drawerVisible = true;
        },
        (err) => {}
      );
    this.currentStage = 0;
    this.isSpin = false;
  }

  empID;
  ltcID: any;
  currentStageID;
  // edit(data: any): void {
  //   this.drawerTitle = 'Edit Claim Details';
  //   this.drawerData = Object.assign({}, data);
  //
  //   this.isSpin = false;
  //   this.empID = this.drawerData.EMP_ID;
  //   this.ltcID = this.drawerData.ID;
  //   this.currentStageID = this.drawerData.CURRENT_STAGE_ID;
  //
  //

  //   this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
  //   this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
  //   this.drawerData['DESIGNATION'] = this.drawerData['EMPLOYEE_DESIGNATION'];
  //   this.drawerData['OFFICE_NAME'] = this.drawerData['EMPLOYEE_OFFICE_NAME'];
  //   this.drawerData['DDO_OF_THE_OFFICIAL'] = this.drawerData['EMPLOYEE_DDO'];
  //   this.drawerData['EMPLOYEE_CODE'] = this.drawerData['EMPLOYEE_CODE'];
  //   this.drawerData['GRADE_PAY'] = this.drawerData['EMPLOYEE_GRADE_PAY'];
  //   this.drawerVisible = true;
  // }

  relationdata: any = [];
  Hospitalclaim: any = [];
  employeeDrawerData: any = [];

  edit(data: any): void {
    this.ltcID = data.ID;
    this.isSpinning = false;
    this.currentStage = 0;
    this.drawerTitle = 'Edit Claim Details';
    this.drawerData = Object.assign({}, data);

    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.relationdata = data['data'];
        },

        (err) => {}
      );
    // this.api
    //   .getEmployeeMaster(0, 0, '', '', ' AND ID =' + data.EMP_ID)
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.employeeDrawerData = data['data'][0];
    //       } else {
    //         this.message.error('Can,t Load Employee Information', '');
    //       }
    //     },
    //     (err) => {
    //
    //     }
    //   );

    // this.drawerData3 = Object.assign({}, data);
    //
    this.empID = data.EMP_ID;
    this.ltcID = data.ID;
    this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    // this.drawerData['EMP_ID'] = this.employeeDrawerData['EMP_ID'];
    // this.drawerData['OFFICE_NAME'] =
    //   this.employeeDrawerData['EMPLOYEE_OFFICE_NAME'];
    // this.drawerData['DDO_OF_THE_OFFICIAL'] =
    //   this.employeeDrawerData['EMPLOYEE_DDO'];
    // this.drawerData['EMPLOYEE_CODE'] = this.employeeDrawerData['EMPLOYEE_CODE'];
    // this.drawerData['GRADE_PAY'] =
    //   this.employeeDrawerData['EMPLOYEE_GRADE_PAY'];
    // this.drawerData['EMAIL_ID'] = this.employeeDrawerData['EMPLOYEE_EMAIL_ID'];
    // this.drawerData['MOBILE_NO'] =
    //   this.employeeDrawerData['EMPLOYEE_MOBILE_NO'];

    this.drawerVisible = true;
  }

  orderDrawerVisible: boolean = false;
  orderDrawerTitle: string;
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
  am = 100;
  fileList: any = [];
  HospitalMapping: any = [];
  openOrderDrawer(data: any): void {
    if (data.ADMISSIBLE_AMOUNT == null || data.ADMISSIBLE_AMOUNT == undefined) {
      this.message.info('Please Fill Annexure Details First', '');
    } else {
      var filterQuery =
        ' AND CURRENT_POSITION_ID = ' +
        sessionStorage.getItem('userId') +
        ' AND (CLAIM_ID=null OR CLAIM_ID=0)';
      this.api
        .getFileMaster(
          0,
          0,
          'ID',
          'ASC',
          filterQuery,
          sessionStorage.getItem('userId')
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200 && data['count'] > 0) {
              this.fileList = data['data'];
            } else {
              this.fileList = [];
            }
          },
          (err) => {}
        );

      this.orderdata = data;
      let words = toWords.convert(this.am, { currency: true });
      this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
      this.amountinwords = toWords.convert(this.orderdata.ADMISSIBLE_AMOUNT, {
        currency: true,
      });

      let wordss = toWordsen.convert(this.am, { currency: true });
      this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
      this.amountinwordsh = toWordsen.convert(
        this.orderdata.ADMISSIBLE_AMOUNT,
        {
          currency: true,
        }
      );

      this.orderDrawerTitle = 'Order Details';
      this.orderDrawerVisible = true;
    }
    this.api
      .getHospitalMapping(0, 0, 'ID', 'ASC', ' AND CLAIM_ID = ' + data.ID)
      .subscribe(
        (data: any) => {
          if (data['code'] == 200 && data['count'] > 0) {
            this.HospitalMapping = data['data'];
          } else {
            this.HospitalMapping = [];
          }
        },
        (err) => {}
      );
  }

  orderDrawerClose(): void {
    this.orderDrawerVisible = false;
    this.search();
  }

  get orderDrawerCloseCallback() {
    return this.orderDrawerClose.bind(this);
  }

  isVisible: boolean = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  investigationDrawerVisible: boolean = false;
  investigationDrawerTitle: string;
  showlayoutDataList: any = [];
  total = 0;
  total1 = 0;
  citylist: any = [];
  hospitallist: any = [];
  ACCREDITATION: any = '';

  drawerLogVisible: boolean = false;
  drawerLogTitle: string = '';
  drawerLogData: any = [];

  openLogDrawer(): void {
    this.drawerLogTitle = 'Claim Log Details';
    this.drawerLogVisible = true;
  }

  drawerLogClose(): void {
    this.search();
    this.drawerLogVisible = false;
  }

  get closeLogCallback() {
    return this.drawerLogClose.bind(this);
  }

  applyStageFilter(event: any, stageId: string) {
    this.filterQuery = '';

    if (event == 'N') {
      this.newButton = 'primary';
      this.forwardButton = 'default';
      this.rejectButton = 'default';
      this.queryButton = 'default';
      this.approvedButton = 'default';
      this.readyButton = 'default';
      this.totalButton = 'default';
    } else if (event == 'F') {
      this.newButton = 'default';
      this.forwardButton = 'primary';
      this.rejectButton = 'default';
      this.queryButton = 'default';
      this.approvedButton = 'default';
      this.readyButton = 'default';
      this.totalButton = 'default';
    } else if (event == 'R') {
      this.newButton = 'default';
      this.forwardButton = 'default';
      this.rejectButton = 'primary';
      this.queryButton = 'default';
      this.approvedButton = 'default';
      this.readyButton = 'default';
      this.totalButton = 'default';
    } else if (event == 'Q') {
      this.newButton = 'default';
      this.forwardButton = 'default';
      this.rejectButton = 'default';
      this.queryButton = 'primary';
      this.approvedButton = 'default';
      this.readyButton = 'default';
      this.totalButton = 'default';
    } else if (event == 'A') {
      this.newButton = 'default';
      this.forwardButton = 'default';
      this.rejectButton = 'default';
      this.queryButton = 'default';
      this.approvedButton = 'primary';
      this.readyButton = 'default';
      this.totalButton = 'default';
    } else if (event == 'Z') {
      this.newButton = 'default';
      this.forwardButton = 'default';
      this.rejectButton = 'default';
      this.queryButton = 'default';
      this.approvedButton = 'default';
      this.readyButton = 'primary';
      this.totalButton = 'default';
    } else {
      this.newButton = 'default';
      this.forwardButton = 'default';
      this.rejectButton = 'default';
      this.queryButton = 'default';
      this.approvedButton = 'default';
      this.readyButton = 'default';
      this.totalButton = 'primary';
    }
    // this.loadingRecords = true;
    if (stageId != ' ') {
      var filterId = stageId.split(',');
      var filterQuery = ' AND (';
      for (var i = 0; i < filterId.length; i++) {
        filterQuery =
          filterQuery + ' CURRENT_STAGE_ID =' + filterId[i] + ' OR ';
      }
      filterQuery = filterQuery.substring(0, filterQuery.length - 3) + ')';
      this.filterQuery = this.filterQuery + filterQuery;
    } else {
      this.filterQuery = '';
    }
    // this.loadingRecords = false;
    this.applyFilter();
  }

  confirm(data: any, i: any) {
    var data1 = {
      ID: i,
      CURRENT_STAGE_ID: 6,
    };

    // data.CURRENT_STAGE_ID = 6;
    // this.api.updateclaimed(data)
  }
  cancel(): void {}

  deleteConfirm(data: any) {
    this.loadingRecords = true;

    var data1 = {
      ID: data.ID,
      EMP_ID: data.EMP_ID,
      INSPECTOR_ID: data.INSPECTOR_ID,
    };
    this.api.deleteClaim(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Record Deleted Successfully...', '');
        // if (!addNew) this.drawerClose();
        this.search();
        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }
  deleteCancel(): void {}

  // rejectConfirm(data: any) {
  //   // data.CURRENT_STAGE_ID = 5;
  //   // this.api.updateClaim();
  // }
  // rejectCancel(): void {}

  drawerClaimData: any;
  drawerClaimTitle = '';
  drawerClaimVisible = false;
  QUESTIONARIES: any;
  checkList: any;

  amountInwords = '';
  SECTION_TYPE: any;
  viewFile(data: any): void {
    this.drawerClaimTitle = 'View Claim File';
    this.drawerClaimData = Object.assign({}, data);
    if (data.ADMISSIBLE_AMOUNT != undefined && data.ADMISSIBLE_AMOUNT != null) {
      this.amountInwords = toWords.convert(
        this.drawerClaimData.ADMISSIBLE_AMOUNT,
        { currency: true }
      );
    } else {
    }
    this.api
      .getSignature(0, 0, 'ID', 'desc', ' AND ID = ' + data.SIGNATURE_ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
          }
        },
        (err) => {}
      );
    this.api
      .getHospitalMapping(0, 0, 'NAME', 'ASC', ' AND CLAIM_ID=' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.hospitallist = data['data'];
        },
        (err) => {}
      );
    this.drawerClaimVisible = true;
  }
  drawerClaimClose(): void {
    this.drawerClaimVisible = false;
  }

  get closeClaimCallback() {
    return this.drawerClaimClose.bind(this);
  }

  fileName: string = 'Claim';
  pdfDownload: boolean = false;

  public generatePDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('claimFile');

    html2pdf()
      .from(data)
      .set({
        margin: [5, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.pdfDownload = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.pdfDownload = false;
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');
  }

  isApproveVisible = false;
  FileId;
  selectedData;
  AO_ID;
  REMARK;

  openApproveModalHP(data) {
    this.selectedData = '';
    this.AO_ID = '';
    this.REMARK = '';
    this.isApproveVisible = true;
    this.selectedData = data;
    this.FileId = data.ID;
    this.loadAllUsers();
  }

  handleApproveCancel() {
    this.isApproveVisible = false;
  }

  handleApproveOk() {
    if (this.AO_ID == null || this.AO_ID == '' || this.AO_ID == undefined) {
      this.message.error('Please Select AO.', '');
    } else {
      var data2 = {
        ID: this.selectedData.ID,
        ADVANCE_TAKEN_DATE: this.selectedData.ADVANCE_TAKEN_DATE,
        HOSPITAL_TYPE: this.selectedData.HOSPITAL_TYPE,
        HOSPITAL_NAME: this.selectedData.HOSPITAL_NAME,
        HOSPITAL_ADDRESS: this.selectedData.HOSPITAL_ADDRESS,
        BANK_NAME: this.selectedData.BANK_NAME,
        SB_ACC_NO: this.selectedData.SB_ACC_NO,
        IFSC_CODE: this.selectedData.IFSC_CODE,
        MICR_CODE: this.selectedData.MICR_CODE,
        WARD_ENTITLEMENT: this.selectedData.WARD_ENTITLEMENT,
        TREATEMENT_TYPE: this.selectedData.TREATEMENT_TYPE,
        EMP_ID: this.selectedData.EMP_ID,
        GRADE_PAY: this.selectedData.GRADE_PAY,
        OFFICE_NAME: this.selectedData.OFFICE_NAME,
        DESIGNATION: this.selectedData.DESIGNATION,
        LOCATION: this.selectedData.LOCATION,
        PATIENT_NAME: this.selectedData.PATIENT_NAME,
        RELATION_WITH_PATIENT: this.selectedData.RELATION_WITH_PATIENT,
        BENEFICIARY_TYPE: this.selectedData.BENEFICIARY_TYPE,
        CGHS_CARD_NO: this.selectedData.CGHS_CARD_NO,
        IS_EMERGENCY_TREATMENT_APPLIED:
          this.selectedData.IS_EMERGENCY_TREATMENT_APPLIED,
        EMERGENCY_REF_DATE: this.selectedData.EMERGENCY_REF_DATE,
        HOSPITAL_ID: this.selectedData.HOSPITAL_ID,
        IS_PRIVATE_HOSPITAL: this.selectedData.IS_PRIVATE_HOSPITAL,
        IS_PERMISSION_TAKEN: this.selectedData.IS_PERMISSION_TAKEN,
        NATURE_OF_TREATMENT: this.selectedData.NATURE_OF_TREATMENT,
        TREATMENT_START_DATE: this.selectedData.TREATMENT_START_DATE,
        TREATMENT_END_DATE: this.selectedData.TREATMENT_END_DATE,
        IS_FORWARDING_LETTER: this.selectedData.IS_FORWARDING_LETTER,
        IS_MEDICAL_REIMBURSEMENT_CLAIMED:
          this.selectedData.IS_MEDICAL_REIMBURSEMENT_CLAIMED,
        IS_COPY_OF_CGHS_CARD_FOR_BOTH_BENEFICIARY_AND_PATIENT:
          this.selectedData
            .IS_COPY_OF_CGHS_CARD_FOR_BOTH_BENEFICIARY_AND_PATIENT,
        IS_DISCHARGE_CARD: this.selectedData.IS_DISCHARGE_CARD,
        FORM_NO_3_IN_CASE_THE_MEDICAL_CLAIM:
          this.selectedData.FORM_NO_3_IN_CASE_THE_MEDICAL_CLAIM,
        IS_FINAL_BILL_IN_ORIGINAL_ALONG_WITH_ONE_XEROX_ONE_COPY:
          this.selectedData
            .IS_FINAL_BILL_IN_ORIGINAL_ALONG_WITH_ONE_XEROX_ONE_COPY,
        IS_PAY_SLIP_OF_THE_PERIOD_OF_TRATMENT:
          this.selectedData.IS_PAY_SLIP_OF_THE_PERIOD_OF_TRATMENT,
        IS_BANK_MANDATE_FROM_ALONG_WITH_CANCELLED_CHEQUE:
          this.selectedData.IS_BANK_MANDATE_FROM_ALONG_WITH_CANCELLED_CHEQUE,
        IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE:
          this.selectedData.IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
        BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
        IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
        AMOUNT_OF_REIMBUSMENT_CLAIMED:
          this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
        AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
          this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
        IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
        ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
        NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
        CURRENT_STAGE_ID: 6,
        INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
        REMARK: this.REMARK,
        SUB_STAGE: this.selectedData.SUB_STAGE,
        WARD_TYPE: this.selectedData.WARD_TYPE,
        BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
        CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
        PATIENT_CGHS_BENEFICIERY_NO:
          this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
        AO_ID: this.AO_ID,
      };
      this.api.updateclaimed(data2).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Changed Successfully...', '');
          this.isApproveVisible = false;
          this.search();
          // if (!addNew) this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Changed...', '');
          this.isSpinning = false;
          this.isApproveVisible = true;
        }
      });
    }
  }
  users: any = [];
  loadAllUsers() {
    this.api
      .getAllUsers(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1 AND ROLE_IDS = 3')
      .subscribe(
        (userData) => {
          if (userData['code'] == 200) {
            this.users = userData['data'];
          } else {
            this.message.error("Can't Load User Information", '');
          }
        },
        (err) => {}
      );
  }

  AnnexureVisible = false;
  AnnexureCancel() {
    this.AnnexureVisible = false;
  }

  openAnnextureFile(data) {
    this.drawerClaimData = Object.assign({}, data);
    this.api
      .getannexture(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND CLAIM_ID=' + this.drawerClaimData.ID
      )
      .subscribe(
        (data) => {
          var countt = data['count'];
          this.AnnexureVisible = true;
          this.showlayoutDataList = data['data'];
          this.total = 0;
          this.total1 = 0;
          for (var i = 0; countt > i; i++) {
            this.total =
              this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
            this.total1 =
              this.total1 + this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
          }

          this.isSpinning = false;
          //
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    this.api
      .getHospitalMapping(0, 0, 'NAME', 'ASC', ' AND CLAIM_ID=' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.hospitallist = data['data'];
        },
        (err) => {}
      );
  }

  // public downloadclaimFile() {
  //   var i = 0;
  //   var date = new Date();
  //   var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
  //   var dates = this.datePipe.transform(date, 'hh-mm-ss a');
  //   var data = document.getElementById('printAnnexureModal');

  //   html2pdf()
  //     .from(data)
  //     .set({
  //       margin: [2, 10, 2, 5],
  //       pagebreak: { mode: ['css', 'legecy'] },
  //       jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
  //     })
  //     .toPdf()
  //     .get('pdf')
  //     .then(function (pdf) {
  //       this.pdfDownload = true;
  //       var totalPages = pdf.internal.getNumberOfPages();

  //       for (i = 1; i <= totalPages; i++) {
  //         pdf.setPage(i);
  //         pdf.setFontSize(12);
  //         pdf.setTextColor(150);
  //         pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
  //       }

  //       this.pdfDownload = false;
  //     })
  //     .save('Annexure "A"_' + datef + '_' + dates + '.pdf');
  // }

  printOrderModalVisible: boolean = false;

  openPrintOrderModal(data) {
    this.orderdata = data;
    let words = toWords.convert(this.am, { currency: true });
    this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
    this.amountinwords = toWords.convert(this.orderdata.ADMISSIBLE_AMOUNT, {
      currency: true,
    });

    let wordss = toWordsen.convert(this.am, { currency: true });
    this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
    this.amountinwordsh = toWordsen.convert(this.orderdata.ADMISSIBLE_AMOUNT, {
      currency: true,
    });
    this.printOrderModalVisible = true;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  orderPDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('printOrderModal');

    html2pdf()
      .from(data)
      .set({
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        margin: [2, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.pdfDownload = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.pdfDownload = false;
      })
      .save('Sanction Order_' + datef + '_' + dates + '.pdf');
  }
  downloadclaimFile() {
    const element = document.getElementById('printAnnexureModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
}
