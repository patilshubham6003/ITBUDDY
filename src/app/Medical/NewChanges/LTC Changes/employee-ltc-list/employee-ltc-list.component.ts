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
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'Rupees',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
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
  selector: 'app-employee-ltc-list',
  templateUrl: './employee-ltc-list.component.html',
  styleUrls: ['./employee-ltc-list.component.css'],
})
export class EmployeeLtcListComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';

  drawerData: LTCMaster = new LTCMaster();
  editrelation: Realtionshipdata = new Realtionshipdata();

  // userId = Number(sessionStorage.getItem('userId'));
  userId = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;

  formTitle = 'Employee LTC Claim Application';
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
  showid: any;
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

  INSPECTOR_ID: any;
  isSpinning = false;

  search2(event: any) {
    this.pageIndex = event;
    this.search();
  }

  search3(event: any) {
    this.pageSize = event;
    this.search(true);
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.BILL_FILIING_DATE = [];
    this.dataList = [];
    this.search();
  }
  currentt = 2;

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  START_DATE: any;
  END_DATE: any;
  BILL_FILIING_DATE: any = [];
  current: any = new Date();

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.loadAllUsers();
    this.search();
    this.drawerWidth = '100%';
  }
  drawerWidth: any;

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }

  // sort(params: NzTableQueryParams): void {
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'id';
  //   const sortOrder = (currentSort && currentSort.value) || 'desc';
  //
  //
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
        this.filterQuery +
          likeQuery +
          ' AND IS_ADMIN_LTC = 0 AND EMP_ID =' +
          this.userId
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

  checkListltc: checkListltc1 = new checkListltc1();
  aamount = 0;
  partAData: any = [];
  formdata3: any = [];
  formdata1: any = [];
  relationdata1: any = [];
  formdata7: any = [];
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
                                          } else {
                                            this.checkListltc =
                                              new checkListltc1();
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
    this.isdraweropended = false;
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  currentStage = 0;
  isSpin: boolean = false;

  opennnadvance(aa: any) {
    if (aa == 'apply') {
      this.addApply('adv');
    } else {
      this.add1('adv');
    }
  }
  opennnsimple(aa: any) {
    if (aa == 'apply') {
      this.addApply('sim');
    } else {
      this.add1('sim');
    }
  }
  showmodell: boolean = false;
  show = '';
  createCustomButtonModal(aa: any): void {
    this.showmodell = true;
    this.show = '';
    this.show = aa;
  }
  cancelModel() {
    this.showmodell = false;
  }

  add1(claimFor): void {
    this.showmodell = false;
    this.isSpin = false;
    this.isSpinning = true;
    this.relationdata = [];
    this.journeyData = [];

    this.editrelation = new Realtionshipdata();

    this.employeedata = this.userId;
    this.ltcID = '';
    this.empID = '';
    this.drawerTitle = 'Application for Leave Travel Concession';
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.userId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.drawerData = Object.assign({}, data['data'][0]);
            this.drawerData['EMPLOYEE_NAME'] = this.drawerData['NAME'];
            if (claimFor == 'adv') {
              this.drawerData['IS_ADVANCE_CLAIM'] = true;
              this.drawerData['IS_ADVANCE_LTC_CREATED'] = false;
              // this.drawerData['AD_STEP_NO'] = 0;
            } else {
              this.drawerData['IS_ADVANCE_CLAIM'] = false;
              this.drawerData['IS_ADVANCE_LTC_CREATED'] = false;
            }
          }
          this.isSpinning = false;
          this.drawerVisible = true;
        },
        (err) => {}
      );
    this.currentStage = 0;
    this.isSpin = false;
  }

  addApply(claimFor): void {
    this.showmodell = false;
    this.isSpin = false;
    this.isSpinning = true;
    this.relationdata = [];
    this.journeyData = [];

    this.editrelation = new Realtionshipdata();

    this.ltcID = '';
    this.empID = '';
    this.drawerTitle = 'Application for Leave Travel Concession';
    this.isdraweropended = true;
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.userId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.drawerData = Object.assign({}, data['data'][0]);
            this.drawerData['EMPLOYEE_NAME'] = this.drawerData['NAME'];
            if (claimFor == 'adv') {
              this.drawerData['IS_ADVANCE_CLAIM'] = true;
              this.drawerData['IS_ADVANCE_LTC_CREATED'] = false;
              // this.drawerData['AD_STEP_NO'] = 0;
            } else {
              this.drawerData['IS_ADVANCE_CLAIM'] = false;
              this.drawerData['IS_ADVANCE_LTC_CREATED'] = false;
            }

            this.Employee_name = data['data'][0]['NAME'];
            this.emp_Designation = data['data'][0]['DESIGNATION'];
            this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
            this.emp_ddo = data['data'][0]['DDO_OF_THE_OFFICIAL'];
            this.office_name = data['data'][0]['OFFICE_NAME'];
            this.basic_pay = data['data'][0]['GRADE_PAY'];
            this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL_ID'];
            this.mobile_no = data['data'][0]['MOBILE_NO'];
            this.gender = data['data'][0]['GENDER'];
            this.dob = data['data'][0]['DOB'];
            this.age = data['data'][0]['AGE'];
            this.location = data['data'][0]['LOCATION'];
            this.designation = data['data'][0]['DESIGNATION_ID'];
            this.serviceType = data['data'][0]['SERVICE_TYPE'];
            this.joining_Date = data['data'][0]['JOINING_DATE'];
            this.ProfilePhoto = data['data'][0]['PROFILE_PHOTO'];

            if (
              this.Employee_name == null ||
              this.Employee_name == '' ||
              this.Employee_name == undefined ||
              this.emp_Designation == null ||
              this.emp_Designation == '' ||
              this.emp_Designation == undefined ||
              this.employee_code == null ||
              this.employee_code == '' ||
              this.employee_code == undefined ||
              this.basic_pay == null ||
              this.basic_pay == '' ||
              this.basic_pay == undefined ||
              this.mobile_no == null ||
              this.mobile_no == '' ||
              this.mobile_no == undefined ||
              this.gender == null ||
              this.gender == '' ||
              this.gender == undefined ||
              this.dob == null ||
              this.dob == '' ||
              this.dob == undefined ||
              this.age == null ||
              this.age == '' ||
              this.age == undefined ||
              this.location == null ||
              this.location == '' ||
              this.location == undefined ||
              this.designation == null ||
              this.designation == '' ||
              this.designation == undefined ||
              this.serviceType == null ||
              this.serviceType == '' ||
              this.serviceType == undefined ||
              this.joining_Date == null ||
              this.joining_Date == '' ||
              this.joining_Date == undefined ||
              this.ProfilePhoto == null ||
              this.ProfilePhoto == '' ||
              this.ProfilePhoto == undefined
            ) {
              this.isdetailsfilled = true;
            } else {
              this.isdetailsfilled = false;
            }
          }
          this.isSpinning = false;
          this.employeedata = this.userId;
          this.drawerVisible = true;
        },
        (err) => {}
      );
    this.currentStage = 0;
    this.isSpin = false;
  }

  empID;
  ltcID: any;

  relationdata: any = [];
  Hospitalclaim: any = [];
  employeeDrawerData: any = [];
  journeyData: any = [];
  edit(data: any): void {
    this.ltcID = data.ID;
    this.isSpinning = true;
    this.currentStage = 0;
    this.journeyData = [];
    this.isdraweropended = false;
    this.drawerTitle = 'Edit Application for Leave Travel Concession';
    this.drawerData = Object.assign({}, data);

    if (
      this.drawerData.JOURNEY_DATA != null &&
      this.drawerData.JOURNEY_DATA != undefined &&
      this.drawerData.JOURNEY_DATA != ''
    ) {
      this.journeyData = JSON.parse(this.drawerData.JOURNEY_DATA);
    } else {
      this.journeyData = [];
    }
    this.empID = data.EMP_ID;
    this.ltcID = data.ID;
    this.employeedata = this.userId;
    this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdata = data['data'];
            } else {
              this.relationdata = [];
            }
            this.drawerVisible = true;
          } else {
          }
        },
        (err) => {}
      );
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

  showlayoutDataList: any = [];

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
        this.search();
        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }
  deleteCancel(): void {}

  amountInwords = '';

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
  logs: any;
  logdata: any;
  showstatus(event: any, i) {
    this.logdata = [];
    this.showid = i;

    this.api
      .getltclog(0, 0, '', 'desc', ' AND LTC_ID=' + event.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.logdata = data['data'];
        }
      });
  }
  showstatus1() {
    this.showid = null;
  }

  isdraweropended: boolean = false;
  Employee_name = '';
  employee_code = '';
  emp_Designation = '';
  emp_ddo = '';
  office_name = '';
  basic_pay = '';
  mobile_no = '';
  gradepay_level = '';
  emp_address = '';
  emp_cast = '';
  headquarter_name = '';
  joining_date: any = '';
  isdetailsfilled: boolean = false;
  employeedata: any;
  cast: any;
  gender: any;
  dob: any;
  age: any;
  location: any;
  designation: any;
  serviceType: any;
  joining_Date: any;
  ProfilePhoto: any;

  checkstep(stepno: any, adstepno: any, data: any) {
    if (data.IS_ADVANCE_CLAIM && !data.IS_ADVANCE_LTC_CREATED) {
      return adstepno;
    } else {
      return stepno;
    }
  }
}
