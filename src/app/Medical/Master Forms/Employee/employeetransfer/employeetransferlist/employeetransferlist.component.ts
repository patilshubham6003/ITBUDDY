import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { Realtionshipdata } from 'src/app/Medical/Models/relationship';
import { TranferapplicationMaster } from 'src/app/Medical/Models/transferapplication';
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
  selector: 'app-employeetransferlist',
  templateUrl: './employeetransferlist.component.html',
  styleUrls: ['./employeetransferlist.component.css'],
  providers: [NzNotificationService],
})
export class EmployeetransferlistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';

  drawerData: TranferapplicationMaster = new TranferapplicationMaster();
  // data: ClaimMaster = new ClaimMaster();
  userId: any;
  // userId = Number(sessionStorage.getItem('userId'));
  userName = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;
  REFRED_RATE_LIST = '';
  formTitle = 'Manage Transfer';
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
  claimData: any;
  allClaimCount: any;
  allNewCount: any;
  allForwardCount: any;
  allRejectCount: any;
  allQueryCount: any;
  allApprovedCount: any;
  allReadyCount: any;
  INSPECTOR_ID: any;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['ADDRESS', 'ADDRESS'],
    ['NEW_HEADQUARTERS_NAME', 'NEW_HEADQUARTERS_NAME'],
    ['NEW_ADDRESS', 'NEW_ADDRESS'],
    ['NAME_OF_FAMILY_MEMBER', 'NAME_OF_FAMILY_MEMBER'],
    ['AGE', 'AGE'],
    ['RELATIONSHIP', 'RELATIONSHIP'],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME: any;
  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.INSPECTOR_ID = null;
    this.dataList = [];
    this.search();
  }

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  // TYPE_OF_HOSPITAL: any = [];

  START_DATE: any;
  END_DATE: any;
  BILL_FILIING_DATE: any = [];
  current = new Date();
  rejectClaimVisible: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    if (this.userId == 1) {
      this.loadAllUsers();
    } else {
    }
    // this.search();
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

    this.loadingRecords = true;

    this.api
      .gettransferdata(
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
            // this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
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
    this.drawerVisible = false;
    this.search();

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
    this.drawerData = new TranferapplicationMaster();
    this.currentStage = 0;
    this.isSpin = false;
    this.relationdata = [];

    this.claimID = '';
    this.empID = '';
    this.currentStageID = '';
    this.drawerVisible = true;
  }
  editrelation: Realtionshipdata = new Realtionshipdata();
  add1(): void {
    this.isSpin = false;
    this.relationdata = [];

    this.editrelation = new Realtionshipdata();
    this.claimID = '';
    this.empID = '';
    this.drawerTitle = 'Create New Claim';
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.userId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.drawerData = Object.assign({}, data['data'][0]);
          }
          this.drawerVisible = true;
        },
        (err) => {}
      );
    this.currentStage = 0;
    this.isSpin = false;
  }

  empID;
  claimID;
  currentStageID;
  // edit(data: any): void {
  //   this.drawerTitle = 'Edit Claim Details';
  //   this.drawerData = Object.assign({}, data);
  //
  //   this.api
  //     .getrelationtable(0, 0, '', ' ', ' AND ID =' + data.EMP_ID)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200 && data['data'].length > 0)
  //           this.relationdata = data['data'];
  //       },

  //       (err) => {
  //
  //       }
  //     );
  //   this.isSpin = false;
  //   this.empID = this.drawerData.EMP_ID;
  //   this.claimID = this.drawerData.ID;
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

  claimid: any;
  relationdata: any = [];
  relationdataorder: any = [];
  Hospitalclaim: any = [];
  edit(data: any): void {
    this.claimid = data.ID;
    this.empID = data.EMP_ID;
    this.claimID = data.ID;
    this.loadingRecords = true;
    this.drawerData = Object.assign({}, data);
    // this.currentTab = 0;
    this.drawerTitle = 'Edit Transfer Details';
    // this.drawerData = Object.assign({}, data);
    this.api
      .getrelationtable(0, 0, '', ' ', ' AND TRANSFER_ID =' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['code'] == 200 && data['data'].length > 0) {
              this.relationdata = data['data'];
            } else {
              this.relationdata = [];
            }
            this.loadingRecords = false;
            this.drawerVisible = true;
          } else {
            this.loadingRecords = false;
          }
          // this.relationdataorder = data['data'];
        },

        (err) => {}
      );

    // this.api
    //   .getEmployeeMaster(0, 0, '', '', ' AND ID =' + data.EMP_ID)
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.drawerData = Object.assign({}, data['data'][0]);
    //         this.drawerData['EMP_ID'] = this.drawerData['ID'];
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
    // this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    // this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    // this.drawerData['GRADE_PAY_LEVEL'] = this.drawerData['GRADE_PAY_LEVEL'];
    // this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    // this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    // this.drawerData['DESIGNATION'] = this.drawerData['DESIGNATION'];
    // this.drawerData['OFFICE_NAME'] = this.drawerData['EMPLOYEE_OFFICE_NAME'];
    // this.drawerData['DDO_OF_THE_OFFICIAL'] =
    //   this.drawerData['DDO_OF_THE_OFFICIAL'];
    // this.drawerData['EMPLOYEE_CODE'] = this.drawerData['EMPLOYEE_CODE'];
    // this.drawerData['GRADE_PAY'] = this.drawerData['GRADE_PAY'];
    // this.drawerData['MOBILE_NO'] = this.drawerData['MOBILE_NO'];
  }

  orderDrawerVisible: boolean = false;
  orderDrawerTitle: string;
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
  am = 100;
  fileList: any = [];
  HospitalMapping: any = [];

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
  investigationDrawerData: InvestigationMaster = new InvestigationMaster();
  showlayoutDataList: any = [];
  total = 0;
  total1 = 0;
  citylist: any = [];
  hospitallist: any = [];
  ACCREDITATION: any = '';
  openInvestigationDrawer(data: any): void {
    if (data != null || data != undefined) {
      this.claimData = data;
      this.investigationDrawerTitle = 'Create New Investigation';
      this.investigationDrawerData = new InvestigationMaster();
      this.citylist = [];

      this.api.getCityMaster(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.citylist = data['data'];
        },

        (err) => {}
      );
      this.api
        .getannexture(
          0,
          0,
          'TYPE',
          'desc',
          ' AND STATUS=1 AND CLAIM_ID=' + this.claimData.ID
        )
        .subscribe(
          (data) => {
            this.showlayoutDataList = data['data'];
            this.total = 0;
            this.total1 = 0;
            for (var i = 0; this.showlayoutDataList.length > i; i++) {
              this.total =
                this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
              this.total1 =
                this.total1 + this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
            }
            this.investigationDrawerVisible = true;
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
            this.investigationDrawerData.CLAIM_HOSPITAL_MAPPING_ID =
              this.hospitallist[0]['ID'];

            this.ACCREDITATION = this.hospitallist[0]['ACCREDATION'];
          },
          (err) => {}
        );
    } else {
    }
  }

  investigationDrawerClose(): void {
    this.investigationDrawerVisible = false;
    this.search();
  }

  get investigationDrawerCloseCallback() {
    return this.investigationDrawerClose.bind(this);
  }

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

    // var data1 = {
    //   TRANSFER_ID: data.ID,
    //   EMPLOYEE_ID: data.EMP_ID,
    //   INSPECTOR_ID: data.INSPECTOR_ID,
    // };
    data.IS_DELETED = 1;

    this.api.updatetransfer(data).subscribe((successCode) => {
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
  drawerClaimVisible1 = false;
  partborder = false;
  transferallounce = false;
  certificateorder = false;
  QUESTIONARIES: any;
  checkList: any;
  transferallounceorder: any = [];
  tranvellingallounceorder: any = [];
  journeydetails: any[] = [];
  railorder: any = [];
  tranferchnagesorder: any = [];
  tranferchnagesorder1: any = [];
  accommodation: any = [];
  amountInwords: any = '';
  SECTION_TYPE: any;
  transferAllounceDrawerTitle: string = '';
  travellingallounce(data) {
    this.transferAllounceDrawerTitle = 'Transfer Allowance';
    this.loadingRecords = true;
    this.api.gettransferdata(0, 0, '', ' ', ' AND ID =' + data.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['code'] == 200 && data['data'].length > 0) {
            this.transferallounceorder = data['data'][0];
          } else {
            this.transferallounceorder = [];
          }

          this.loadingRecords = false;
          this.transferallounce = true;
        } else {
          this.loadingRecords = false;
        }
      },

      (err) => {}
    );
    this.api
      .getrelationtable(0, 0, '', ' ', ' AND TRANSFER_ID =' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.relationdataorder = data['data'];
        },

        (err) => {}
      );
    this.api
      .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          //
          this.journeydetails = data['data'];
        }
      });
    this.api
      .gettransfarchnagedetailspersonal(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + data.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.tranferchnagesorder = data['data'];
        }
      });

    this.api
      .gettransfarchnagedetails1(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + data.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.railorder = data['data'];
        }
      });

    this.api
      .gettransfortation(0, 0, '', 'asc', ' AND TRANSFER_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.accommodation = data['data'];
        }
      });
  }

  amount: any = 0;
  journeyfairfaird: any = 0;
  raiamount: any = 0;
  istransport: any = 0;
  totacountofbill: any = 0;
  billDataID: any;
  netAmountInWord: any;
  orderFormTitle: string = '';

  TravelModeNames: any = [];

  nettotacountofbill = 0;
  orderData(data) {
    this.billDataID = data.ID;
    this.loadingRecords = true;
    this.amount = 0;

    this.journeyfairfaird = 0;
    this.raiamount = 0;
    this.istransport = 0;

    this.weightrate = 0;
    this.grosspaymentvalue = 0;
    this.weightkg = 0;
    this.amountt = 0;
    this.distance = 0;

    this.fairpaidofpartb = 0;
    this.grosspaymentofpartb = 0;
    this.amountofadvanceamount = 0;
    this.incidentalsAmonut = 0;
    this.privateVehicleMinFair = 0;
    this.multiplication = 0;
    this.totalofweight = 0;
    this.totacountofbill = 0;
    this.nettotacountofbill = 0;
    this.orderFormTitle = 'Order';
    this.drawerClaimData = Object.assign({}, data);

    if (
      (data.ROAD_MILEAGE != undefined && data.PER_KM != undefined) ||
      (data.ROAD_MILEAGE != null && data.PER_KM != null)
    ) {
      this.multiplication = data.ROAD_MILEAGE * data.PER_KM;
    } else {
    }

    this.api
      .gettransfarchnagedetailspersonal(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.billDataID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.tranferchnagesorder = data['data'];
          this.tranferchnagesorder1 = data['data'];

          if (data['data'].length > 0) {
            this.distance = data['data'][0]['DISTANCE'];
            this.weightrate = data['data'][0]['RATE'];
            this.amountt = data['data'][0]['WEIGHT_IN_KG'];
          } else {
            this.distance = 0;
            this.weightrate = 0;
            this.amountt = 0;
          }
          this.totalofweight =
            (this.distance * this.weightrate * this.amountt) / 6000;
          this.totalofweight = this.totalofweight.toFixed();

          if (
            this.multiplication == undefined ||
            this.multiplication == null ||
            this.multiplication == '' ||
            isNaN(this.multiplication) == true
          ) {
            this.multiplication = 0;
          } else {
            this.multiplication = this.multiplication;
          }

          if (
            this.incidentalsAmonut == undefined ||
            this.incidentalsAmonut == null ||
            this.incidentalsAmonut == '' ||
            isNaN(this.incidentalsAmonut) == true
          ) {
            this.incidentalsAmonut = 0;
          } else {
            this.incidentalsAmonut = this.incidentalsAmonut;
          }

          if (this.totalofweight == undefined || this.totalofweight == null) {
            this.totalofweight = 0;
          } else {
            this.totalofweight = this.totalofweight;
          }

          if (
            this.amountofadvance == undefined ||
            this.amountofadvance == null
          ) {
            this.amountofadvance = 0;
          } else {
            this.amountofadvance = this.amountofadvance;
          }

          if (
            this.transfergrantamount == undefined ||
            this.transfergrantamount == null
          ) {
            this.transfergrantamount = 0;
          } else {
            this.transfergrantamount = this.transfergrantamount;
          }

          if (
            this.fairpaidofpartb == undefined ||
            this.fairpaidofpartb == null
          ) {
            this.fairpaidofpartb = 0;
          } else {
            this.fairpaidofpartb = this.fairpaidofpartb;
          }

          this.grosspaymentofpartb =
            Number(this.multiplication) +
            Number(this.incidentalsAmonut) +
            Number(this.totalofweight) +
            Number(this.grosspaymentvalue) +
            Number(this.transfergrantamount) +
            Number(this.fairpaidofpartb);
          this.grosspaymentofpartb = Math.round(this.grosspaymentofpartb);

          // if (
          //   this.grosspaymentofpartb == 'NaN' ||
          //   this.grosspaymentofpartb == null ||
          //   this.grosspaymentofpartb == undefined
          // ) {
          //   this.grosspaymentofpartb = 0;
          // } else {
          //   this.grosspaymentofpartb = this.grosspaymentofpartb;
          // }
          if (
            this.amountofadvanceamount == null ||
            this.amountofadvanceamount == undefined
          ) {
            this.amountofadvanceamount = 0;
          } else {
            this.amountofadvanceamount = this.amountofadvanceamount;
          }

          this.netpaymentofpartb =
            Number(this.grosspaymentofpartb) -
            Number(this.amountofadvanceamount);
          this.netpaymentofpartb = Math.round(this.netpaymentofpartb);
        }
      });

    this.TravelModeNames = [];
    this.privateVehicleFair = [];
    this.TravelModeNames = [];
    this.showPrivate = 0;

    this.api
      .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.billDataID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['code'] == 200 && data['data'].length > 0) {
              this.transferallounceorder = data['data'][0];
            }
            this.api
              .getjourneydetails(
                0,
                0,
                '',
                'asc',
                ' AND TRANSFER_ID =' + this.billDataID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.journeydetails = data['data'];

                  for (let i = 0; i < this.journeydetails.length; i++) {
                    this.fairpaidofpartb += this.journeydetails[i]['FAIR_PAID'];
                  }

                  for (let i = 0; i < this.journeydetails.length; i++) {
                    this.journeyfairfaird +=
                      this.journeydetails[i]['FAIR_PAID'];
                  }

                  for (let i = 0; i < this.journeydetails.length; i++) {
                    if (this.journeydetails[i]['TRAVEL_CLASS_ID'] == 13) {
                      this.privateVehicleFair.push(
                        this.journeydetails[i]['FAIR_PAID']
                      );
                    } else {
                    }
                  }
                  if (this.privateVehicleFair.length > 0) {
                    this.privateVehicleMinFair = Math.min.apply(
                      null,
                      this.privateVehicleFair
                    );
                  } else {
                    this.privateVehicleMinFair = 0;
                  }

                  if (
                    this.drawerClaimData.VEHICLE_BROUGHT_SELF_PROPULATION == 0
                  ) {
                    if (
                      this.drawerClaimData.TRUCK_SHIP_CHARGE != null &&
                      this.drawerClaimData.TRUCK_SHIP_CHARGE != undefined &&
                      this.drawerClaimData.TRUCK_SHIP_CHARGE > 0 &&
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO !=
                        null &&
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO !=
                        undefined &&
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO > 0
                    ) {
                      if (this.privateVehicleFair.length > 0) {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.TRUCK_SHIP_CHARGE,
                          this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO,
                          this.privateVehicleMinFair
                        );
                      } else {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.TRUCK_SHIP_CHARGE,
                          this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO
                        );
                      }
                    } else {
                      this.grosspaymentvalue = this.privateVehicleMinFair;
                    }
                  } else if (
                    this.drawerClaimData.VEHICLE_BROUGHT_SELF_PROPULATION == 1
                  ) {
                    if (
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL != null &&
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL != undefined &&
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL > 0 &&
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE != null &&
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE != undefined &&
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE > 0
                    ) {
                      if (this.privateVehicleFair.length > 0) {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.VEHICLE_BROUGHT_TOTAL,
                          this.drawerClaimData.TRAIN_BROUGHT_CHARGE,
                          this.privateVehicleMinFair
                        );
                      } else {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.VEHICLE_BROUGHT_TOTAL,
                          this.drawerClaimData.TRAIN_BROUGHT_CHARGE
                        );
                      }
                    } else {
                      this.grosspaymentvalue = this.privateVehicleMinFair;
                    }
                  } else {
                  }

                  if (
                    this.grosspaymentvalue ==
                      this.drawerClaimData.TRUCK_SHIP_CHARGE ||
                    this.grosspaymentvalue ==
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO ||
                    this.grosspaymentvalue ==
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL ||
                    this.grosspaymentvalue ==
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE
                  ) {
                    this.showPrivate = 1;
                  } else if (
                    this.grosspaymentvalue > 0 &&
                    this.grosspaymentvalue == this.privateVehicleMinFair
                  ) {
                    this.showPrivate = 2;
                  } else {
                    this.showPrivate = 0;
                  }

                  //

                  for (let i = 0; i < this.journeydetails.length; i++) {
                    if (
                      this.TravelModeNames.includes(
                        this.journeydetails[i]['TRAVEL_MODE_NAME']
                      ) === false
                    )
                      this.TravelModeNames.push(
                        this.journeydetails[i].TRAVEL_MODE_NAME
                      );
                  }

                  let sum = 0;

                  this.api
                    .gettransfarchnagedetailspersonal(
                      0,
                      0,
                      '',
                      'asc',
                      ' AND TRANSFER_ID =' + this.billDataID
                    )
                    .subscribe((data) => {
                      if (data['code'] == 200) {
                        for (
                          let i = 0;
                          i < this.tranferchnagesorder.length;
                          i++
                        ) {
                          this.amount += this.tranferchnagesorder[i]['AMOUNT'];
                        }
                        // if (data['data'].length > 1) {
                        //   this.amount = data['data'][0]['AMOUNT'];
                        // } else {
                        //   this.amount = 0;
                        // }

                        this.api
                          .gettransfarchnagedetails1(
                            0,
                            0,
                            '',
                            'asc',
                            ' AND TRANSFER_ID =' + this.billDataID
                          )
                          .subscribe((data) => {
                            if (data['code'] == 200) {
                              this.railorder = data['data'];
                              let sum2 = 0;
                              for (let i = 0; i < this.railorder.length; i++) {
                                this.raiamount +=
                                  this.railorder[i]['FARE_PAID'];
                              }

                              this.api
                                .gettransfortation(
                                  0,
                                  0,
                                  '',
                                  'asc',
                                  ' AND TRANSFER_ID =' + this.billDataID
                                )
                                .subscribe((data) => {
                                  if (data['code'] == 200) {
                                    this.accommodation = data['data'];

                                    for (
                                      let i = 0;
                                      i < this.accommodation.length;
                                      i++
                                    ) {
                                      this.istransport +=
                                        this.accommodation[i]['FARE_PAID'];
                                    }
                                    if (
                                      this.drawerData
                                        .IS_HIGHER_CLASS_ACCOMODATION == true
                                    ) {
                                      if (
                                        this.amount == undefined ||
                                        this.amount == null ||
                                        isNaN(this.amount) == true
                                      ) {
                                        this.amount = 0;
                                      } else {
                                        this.amount = this.amount;
                                      }

                                      if (
                                        this.journeyfairfaird == undefined ||
                                        this.journeyfairfaird == null ||
                                        isNaN(this.journeyfairfaird) == true
                                      ) {
                                        this.journeyfairfaird = 0;
                                      } else {
                                        this.journeyfairfaird =
                                          this.journeyfairfaird;
                                      }

                                      if (
                                        this.raiamount == undefined ||
                                        this.raiamount == null ||
                                        isNaN(this.raiamount) == true
                                      ) {
                                        this.raiamount = 0;
                                      } else {
                                        this.raiamount = this.raiamount;
                                      }

                                      if (
                                        this.istransport == undefined ||
                                        this.istransport == null ||
                                        isNaN(this.istransport) == true
                                      ) {
                                        this.istransport = 0;
                                      } else {
                                        this.istransport = this.istransport;
                                      }

                                      // if (
                                      //   this.totacountofbill == null ||
                                      //   this.totacountofbill == undefined ||
                                      //   this.totacountofbill == 'NaN'
                                      // ) {
                                      //   this.totacountofbill = 0;
                                      // } else {
                                      //   this.totacountofbill =
                                      //     this.totacountofbill;
                                      // }
                                    } else {
                                      if (
                                        this.amount == undefined ||
                                        this.amount == null ||
                                        isNaN(this.amount) == true
                                      ) {
                                        this.amount = 0;
                                      } else {
                                        this.amount = this.amount;
                                      }

                                      if (
                                        this.journeyfairfaird == undefined ||
                                        this.journeyfairfaird == null ||
                                        isNaN(this.journeyfairfaird) == true
                                      ) {
                                        this.journeyfairfaird = 0;
                                      } else {
                                        this.journeyfairfaird =
                                          this.journeyfairfaird;
                                      }

                                      if (
                                        this.raiamount == undefined ||
                                        this.raiamount == null ||
                                        isNaN(this.raiamount) == true
                                      ) {
                                        this.raiamount = 0;
                                      } else {
                                        this.raiamount = this.raiamount;
                                      }

                                      this.totacountofbill =
                                        this.amount +
                                        this.journeyfairfaird +
                                        this.raiamount;
                                    }

                                    if (
                                      this.drawerClaimData
                                        .TRANSFER_GRANT_AMOUNT != undefined ||
                                      this.drawerClaimData
                                        .TRANSFER_GRANT_AMOUNT != null ||
                                      this.drawerClaimData
                                        .TRANSFER_GRANT_AMOUNT != ''
                                    ) {
                                      this.drawerClaimData.TRANSFER_GRANT_AMOUNT =
                                        this.drawerClaimData.TRANSFER_GRANT_AMOUNT;
                                    } else {
                                      this.drawerClaimData.TRANSFER_GRANT_AMOUNT = 0;
                                    }

                                    this.totacountofbill =
                                      Number(
                                        this.drawerClaimData
                                          .TRANSFER_GRANT_AMOUNT
                                      ) +
                                      Number(this.multiplication) +
                                      Number(this.totalofweight) +
                                      Number(this.grosspaymentvalue) +
                                      Number(this.fairpaidofpartb);

                                    this.nettotacountofbill =
                                      this.totacountofbill;

                                    //  +
                                    // this.amount +
                                    // this.journeyfairfaird +
                                    // this.raiamount +
                                    // this.istransport;

                                    if (
                                      this.drawerClaimData.IS_ADVANCE_TAKEN == 1
                                    ) {
                                      this.nettotacountofbill = 0;
                                      this.nettotacountofbill =
                                        Number(this.totacountofbill) -
                                        Number(
                                          this.drawerClaimData.ADVANCED_AMOUNT
                                        );
                                    } else {
                                      this.totacountofbill = Number(
                                        this.totacountofbill
                                      );
                                    }

                                    if (
                                      this.totacountofbill == null ||
                                      this.totacountofbill == undefined ||
                                      isNaN(this.totacountofbill) == true
                                    ) {
                                      this.totacountofbill = 0;
                                    } else {
                                      this.totacountofbill =
                                        this.totacountofbill;
                                    }

                                    this.netAmountInWord = toWords.convert(
                                      Number(this.nettotacountofbill),
                                      {
                                        currency: true,
                                      }
                                    );
                                    // this.loadingRecords = false;
                                    // this.drawerClaimVisible = true;
                                    this.drawerClaimData.CTG_TOTAL =
                                      this.drawerClaimData.TRANSFER_GRANT_AMOUNT;
                                    this.drawerClaimData.ROAD_MILEAGE_TOTAL =
                                      this.multiplication;
                                    this.drawerClaimData.JOURNEY_TOTAL =
                                      this.journeyfairfaird;
                                    this.drawerClaimData.PERSONAL_EFFECT_TOTAL =
                                      this.totalofweight;
                                    this.drawerClaimData.PRIVATE_CONVEYANCE_TOTAL =
                                      this.grosspaymentvalue;

                                    this.api
                                      .updatetransfer(this.drawerClaimData)
                                      .subscribe((successCode) => {
                                        if (successCode.code == '200') {
                                          // this.loadingRecords = false;
                                          this.loadingRecords = false;
                                          this.drawerClaimVisible = true;
                                          // this.message.success('Information Saved Successfully...', '');
                                        } else {
                                          this.message.error(
                                            'Information Has Not Saved...',
                                            ''
                                          );
                                          this.loadingRecords = false;
                                        }
                                      });
                                  }
                                });
                            } else {
                              this.loadingRecords = false;
                            }
                          });
                      } else {
                        this.loadingRecords = false;
                      }
                    });
                } else {
                  this.loadingRecords = false;
                }
              });
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }
  certificateDrawerTitle: string = '';
  certificate(data) {
    this.loadingRecords = true;
    this.certificateDrawerTitle = 'Certificate';
    this.api.gettransferdata(0, 0, '', ' ', ' AND ID =' + data.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['code'] == 200 && data['data'].length > 0) {
            this.transferallounceorder = data['data'][0];
          } else {
            this.transferallounceorder = [];
          }
          this.loadingRecords = false;
          this.certificateorder = true;
        } else {
          this.loadingRecords = false;
        }
      },

      (err) => {}
    );
  }
  partbdata: any;
  journeyDetailsData: any;
  multiplication: any;
  incidentalsAmonut: any;
  partDrawerTitle: string = '';
  grosspaymentofpartb: any;
  netpaymentofpartb: any;
  amountofadvance = 0;
  transfergrantamount = 0;
  amountofadvanceamount = 0;
  fairpaidofpartb = 0;
  totalofweight: any = 0;
  weightkg = 0;
  weightrate = 0;
  // partb(data: any) {
  //   this.loadingRecords = true;
  //   this.partbdata = data;
  //   this.partDrawerTitle = 'Part-B';
  //   if (
  //     (data.ROAD_MILEAGE != undefined && data.PER_KM != undefined) ||
  //     (data.ROAD_MILEAGE != null && data.PER_KM != null)
  //   ) {
  //     this.multiplication = data.ROAD_MILEAGE * data.PER_KM;
  //   } else {
  //   }
  //   if (
  //     (data.RUPEES_PER_DAY != undefined && data.D_A != undefined) ||
  //     (data.RUPEES_PER_DAY != null && data.D_A != null)
  //   ) {
  //     this.incidentalsAmonut = data.D_A * data.RUPEES_PER_DAY;
  //   } else {
  //   }
  //
  //   this.api
  //     .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + data.ID)
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.journeyDetailsData = data['data'][0];
  //         this.loadingRecords = false;
  //         this.partborder = true;
  //       } else {
  //         this.loadingRecords = false;
  //         this.journeyDetailsData = [];
  //       }
  //     });
  // }
  amountt: any = 0;
  distance: any = 0;
  grosspaymentvalue: any;

  privateVehicleFair: any = [];
  privateVehicleMinFair = 0;
  showPrivate: any = 0;
  partb(data: any) {
    this.loadingRecords = true;
    this.weightrate = 0;
    this.grosspaymentvalue = 0;
    this.weightkg = 0;
    this.amountt = 0;
    this.distance = 0;

    this.fairpaidofpartb = 0;
    this.grosspaymentofpartb = 0;
    this.amountofadvanceamount = 0;
    this.incidentalsAmonut = 0;
    this.privateVehicleMinFair = 0;
    this.partbdata = data;

    this.partDrawerTitle = 'Part-B';
    this.amountofadvance = data['AMOUNT'];
    this.amountofadvanceamount = data['ADVANCED_AMOUNT'];
    this.transfergrantamount = data['TRANSFER_GRANT_AMOUNT'];

    if (
      (data.ROAD_MILEAGE != undefined && data.PER_KM != undefined) ||
      (data.ROAD_MILEAGE != null && data.PER_KM != null)
    ) {
      this.multiplication = data.ROAD_MILEAGE * data.PER_KM;
    } else {
    }
    if (
      (data.RUPEES_PER_DAY != undefined && data.D_A != undefined) ||
      (data.RUPEES_PER_DAY != null && data.D_A != null)
    ) {
      this.incidentalsAmonut = data.D_A * data.RUPEES_PER_DAY;
    } else {
    }
    if (
      (data.WEIGHT_IN_KG != undefined && data.RATE != undefined) ||
      (data.WEIGHT_IN_KG != null && data.RATE != null)
    ) {
      // this.totalofweight = data.WEIGHT_IN_KG * data.RATE;
    } else {
    }
    this.privateVehicleFair = [];
    this.TravelModeNames = [];
    this.showPrivate = 0;
    this.api
      .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.journeyDetailsData = data['data'];

          for (let i = 0; i < this.journeyDetailsData.length; i++) {
            if (
              this.TravelModeNames.includes(
                this.journeyDetailsData[i].TRAVEL_MODE_NAME
              ) === false
            )
              this.TravelModeNames.push(
                this.journeyDetailsData[i].TRAVEL_MODE_NAME
              );
          }

          for (let i = 0; i < this.journeyDetailsData.length; i++) {
            this.fairpaidofpartb += this.journeyDetailsData[i]['FAIR_PAID'];
          }

          for (let i = 0; i < this.journeyDetailsData.length; i++) {
            if (this.journeyDetailsData[i]['TRAVEL_CLASS_ID'] == 13) {
              this.privateVehicleFair.push(
                this.journeyDetailsData[i]['FAIR_PAID']
              );
            } else {
            }
          }
          if (this.privateVehicleFair.length > 0) {
            this.privateVehicleMinFair = Math.min.apply(
              null,
              this.privateVehicleFair
            );
          } else {
            this.privateVehicleMinFair = 0;
          }

          if (this.partbdata.VEHICLE_BROUGHT_SELF_PROPULATION == 0) {
            if (this.privateVehicleFair.length > 0) {
              this.grosspaymentvalue = Math.min(
                this.partbdata.TRUCK_SHIP_CHARGE,
                this.partbdata.TRAIN_BROUGHT_FOR_CHARGE_NO,
                this.privateVehicleMinFair
              );
            } else {
              this.grosspaymentvalue = Math.min(
                this.partbdata.TRUCK_SHIP_CHARGE,
                this.partbdata.TRAIN_BROUGHT_FOR_CHARGE_NO
              );
            }
          } else if (this.partbdata.VEHICLE_BROUGHT_SELF_PROPULATION == 1) {
            if (this.privateVehicleFair.length > 0) {
              this.grosspaymentvalue = Math.min(
                this.partbdata.VEHICLE_BROUGHT_TOTAL,
                this.partbdata.TRAIN_BROUGHT_CHARGE,
                this.privateVehicleMinFair
              );
            } else {
              this.grosspaymentvalue = Math.min(
                this.partbdata.VEHICLE_BROUGHT_TOTAL,
                this.partbdata.TRAIN_BROUGHT_CHARGE
              );
            }
          }

          if (
            this.grosspaymentvalue == this.partbdata.TRUCK_SHIP_CHARGE ||
            this.grosspaymentvalue ==
              this.partbdata.TRAIN_BROUGHT_FOR_CHARGE_NO ||
            this.grosspaymentvalue == this.partbdata.VEHICLE_BROUGHT_TOTAL ||
            this.grosspaymentvalue == this.partbdata.TRAIN_BROUGHT_CHARGE
          ) {
            this.showPrivate = 1;
          } else if (
            this.grosspaymentvalue > 0 &&
            this.grosspaymentvalue == this.privateVehicleMinFair
          ) {
            this.showPrivate = 2;
          } else {
            this.showPrivate = 0;
          }

          this.loadingRecords = false;
        } else {
          this.loadingRecords = false;
          this.journeyDetailsData = [];
        }
      });

    this.totalofweight = 0;
    this.api
      .gettransfarchnagedetailspersonal(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + data.ID
      )

      .subscribe((data) => {
        if (data['code'] == 200) {
          this.tranferchnagesorder = data['data'];

          // for (let i = 0; i < this.tranferchnagesorder.length; i++) {
          //   this.distance += this.tranferchnagesorder[i]['DISTANCE'];
          //   this.weightrate += this.tranferchnagesorder[i]['RATE'];
          //   this.amountt += this.tranferchnagesorder[i]['WEIGHT_IN_KG'];
          //   if (i + 1 == this.tranferchnagesorder.length) {
          //   }
          // }
          if (data['data'].length > 0) {
            this.distance = data['data'][0]['DISTANCE'];
            this.weightrate = data['data'][0]['RATE'];
            this.amountt = data['data'][0]['WEIGHT_IN_KG'];
          } else {
            this.distance = 0;
            this.weightrate = 0;
            this.amountt = 0;
          }
          this.totalofweight =
            (this.distance * this.weightrate * this.amountt) / 6000;
          this.totalofweight = this.totalofweight.toFixed();

          if (
            this.multiplication == undefined ||
            this.multiplication == null ||
            this.multiplication == '' ||
            isNaN(this.multiplication) == true
          ) {
            this.multiplication = 0;
          } else {
            this.multiplication = this.multiplication;
          }

          if (
            this.incidentalsAmonut == undefined ||
            this.incidentalsAmonut == null ||
            this.incidentalsAmonut == '' ||
            isNaN(this.incidentalsAmonut) == true
          ) {
            this.incidentalsAmonut = 0;
          } else {
            this.incidentalsAmonut = this.incidentalsAmonut;
          }

          if (this.totalofweight == undefined || this.totalofweight == null) {
            this.totalofweight = 0;
          } else {
            this.totalofweight = this.totalofweight;
          }

          if (
            this.amountofadvance == undefined ||
            this.amountofadvance == null
          ) {
            this.amountofadvance = 0;
          } else {
            this.amountofadvance = this.amountofadvance;
          }

          if (
            this.transfergrantamount == undefined ||
            this.transfergrantamount == null
          ) {
            this.transfergrantamount = 0;
          } else {
            this.transfergrantamount = this.transfergrantamount;
          }

          if (
            this.fairpaidofpartb == undefined ||
            this.fairpaidofpartb == null
          ) {
            this.fairpaidofpartb = 0;
          } else {
            this.fairpaidofpartb = this.fairpaidofpartb;
          }

          this.grosspaymentofpartb =
            Number(this.multiplication) +
            Number(this.incidentalsAmonut) +
            Number(this.totalofweight) +
            Number(this.grosspaymentvalue) +
            Number(this.transfergrantamount) +
            Number(this.fairpaidofpartb);
          this.grosspaymentofpartb = Math.round(this.grosspaymentofpartb);

          // if (
          //   this.grosspaymentofpartb == 'NaN' ||
          //   this.grosspaymentofpartb == null ||
          //   this.grosspaymentofpartb == undefined
          // ) {
          //   this.grosspaymentofpartb = 0;
          // } else {
          //   this.grosspaymentofpartb = this.grosspaymentofpartb;
          // }
          if (
            this.amountofadvanceamount == null ||
            this.amountofadvanceamount == undefined
          ) {
            this.amountofadvanceamount = 0;
          } else {
            this.amountofadvanceamount = this.amountofadvanceamount;
          }

          this.netpaymentofpartb =
            Number(this.grosspaymentofpartb) -
            Number(this.amountofadvanceamount);
          this.netpaymentofpartb = Math.round(this.netpaymentofpartb);
          this.partborder = true;
        }
      });
  }
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

  drawerClose1() {
    this.totacountofbill = 0;
    this.drawerClaimVisible = false;
    this.search();
  }
  get closeCallbackClaim() {
    return this.drawerClose1.bind(this);
  }

  partbdrawerclose() {
    this.partborder = false;
    this.search();
  }
  get closeCallbackpartb() {
    return this.partbdrawerclose.bind(this);
  }

  transferallowuncedrawerclose() {
    this.transferallounce = false;
    this.search();
  }
  get closeCallbacktransferallowunce() {
    return this.transferallowuncedrawerclose.bind(this);
  }

  certificatedrawerclose() {
    this.certificateorder = false;
    this.search();
  }
  get closeCallbackcertificate() {
    return this.certificatedrawerclose.bind(this);
  }
  checklistData: any = [];
  transferData: any = [];
  checklistVisible: boolean = false;
  checklistTitle: string = '';
  POST: any;
  OFFICE_NAME: any;
  SIGNNAME: any;
  openChecklist(data) {
    if (data.ID != null || data.ID != undefined) {
      this.transferData = Object.assign({}, data);

      this.checklistTitle = 'CheckList';
      this.loadingRecords = true;
      this.api
        .getAllTransferChecklist(0, 0, '', ' ', ' AND TRANSFER_ID =' + data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.checklistData = data['data'][0];
              } else {
                this.checklistData = [];
              }

              if (
                this.transferData.SIGNATURE_ID != undefined &&
                this.transferData.SIGNATURE_ID != null &&
                this.transferData.SIGNATURE_ID != ''
              ) {
                this.api
                  .getSignature(
                    0,
                    0,
                    '',
                    '',
                    ' AND ID = ' + this.transferData.SIGNATURE_ID
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        // this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
                        this.SIGNNAME = data['data'][0]['NAME'];
                        // this.NAME_HN = data['data'][0]['NAME_HN'];
                        this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                        // this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
                        this.POST = data['data'][0]['POST'];
                        // this.POST_HN = data['data'][0]['POST_HN'];
                        this.loadingRecords = false;
                        // this.orderDrawerVisible = true;
                        this.loadingRecords = false;
                        this.checklistVisible = true;
                      } else {
                        this.message.error('Something Went Wrong', '');
                        this.loadingRecords = false;
                      }
                    },
                    (err) => {}
                  );
              } else {
                this.POST = '';
                this.OFFICE_NAME = '';
                this.SIGNNAME = '';
                this.loadingRecords = false;
                this.checklistVisible = true;
              }
            } else {
              this.loadingRecords = false;
              this.message.error("Can't Load Checklist Data", '');
            }
          },

          (err) => {}
        );
    } else {
    }
  }

  checkListdrawerclose() {
    this.checklistVisible = false;
    this.search();
  }
  get closeCallbackchecklist() {
    return this.checkListdrawerclose.bind(this);
  }
}
