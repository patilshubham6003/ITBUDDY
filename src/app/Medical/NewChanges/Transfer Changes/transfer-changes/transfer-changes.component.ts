import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Realtionshipdata } from 'src/app/Medical/Models/relationship';
import { TranferapplicationMaster } from 'src/app/Medical/Models/transferapplication';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
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
  selector: 'app-transfer-changes',
  templateUrl: './transfer-changes.component.html',
  styleUrls: ['./transfer-changes.component.css'],
})
export class TransferChangesComponent implements OnInit {
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
  formTitle = 'Employee Transfer Claim Application';
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

  claimData: any;

  INSPECTOR_ID: any;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['DESIGNATION', 'MOBILE_NO'],
    ['MOBILE_NO', 'EMPLOYEE_CODE'],
    ['EMPLOYEE_CODE', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['GRADE_PAY', 'ADDRESS'],
    ['GRADE_PAY_LEVEL', 'NEW_HEADQUARTERS_NAME'],
    ['FILE_NO', 'NEW_ADDRESS'],
  ];

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
    this.search();
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

    this.isSpinning = true;
    this.api
      .gettransferdata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery +
          likeQuery +
          ' AND IS_ADMIN_TRANSFER = 0 AND EMP_ID =' +
          this.userId
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.isSpinning = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
              this.isSpinning = false;
            }
          } else {
            // this.message.error("Can't Load Data", '');
            this.isSpinning = false;
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
    this.employeedata = this.userId;
    this.isdraweropended = false;
    this.search();
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  currentStage = 0;
  isSpin: boolean = false;
  add(): void {
    this.drawerTitle = 'Application for Travelling Allowance for TRANSFER';
    this.drawerData = new TranferapplicationMaster();
    this.currentStage = 0;
    this.isSpin = false;
    this.relationdata = [];

    this.claimID = '';
    this.empID = '';
    this.currentStageID = '';
    this.drawerVisible = true;
  }

  search2(event: any) {
    this.pageIndex = event;
    this.search();
  }

  search3(event: any) {
    this.pageSize = event;
    this.search(true);
  }
  drawerWidth: any = '100%';
  editrelation: Realtionshipdata = new Realtionshipdata();
  add1(key: any): void {
    this.isSpin = false;
    this.relationdata = [];

    this.editrelation = new Realtionshipdata();
    this.claimID = '';
    this.empID = '';
    this.employeedata = this.userId;
    this.drawerTitle = 'Application for Travelling Allowance for TRANSFER';
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.userId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.drawerData = Object.assign({}, data['data'][0]);
          }
          this.isdraweropended = false;
          this.drawerVisible = true;
          if (key == 'ad') {
            this.drawerData.IS_APPLYING_FOR_ADVANCE = true;
            this.drawerData.IS_ADVANCE_TAKEN = true;
          } else {
            this.drawerData.IS_APPLYING_FOR_ADVANCE = false;
          }
          this.showmodell = false;
        },
        (err) => {}
      );

    this.currentStage = 0;
    this.isSpin = false;
  }

  empID;
  claimID;
  currentStageID;

  claimid: any;
  relationdata: any = [];
  relationdataorder: any = [];
  Hospitalclaim: any = [];
  designationList: any = [];
  edit(data: any): void {
    this.claimid = data.ID;
    this.empID = data.EMP_ID;
    this.claimID = data.ID;
    this.isSpinning = true;
    this.employeedata = this.userId;
    this.isdraweropended = false;
    this.drawerData = Object.assign({}, data);
    // this.currentTab = 0;
    this.drawerTitle = 'Edit Transfer Details';
    // this.drawerData = Object.assign({}, data);
    this.api
      .getrelationtable(0, 0, '', ' ', ' AND TRANSFER_ID =' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdata = data['data'];
            } else {
              this.relationdata = [];
            }
            this.api
              .getAllDesignations(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.designationList = data['data'];
                    this.isSpinning = false;
                    this.drawerVisible = true;
                  } else {
                    this.isSpinning = false;
                    this.message.error("Can't Load Designation Data", '');
                  }
                },
                (err) => {}
              );
          } else {
            this.isSpinning = false;
          }
          // this.relationdataorder = data['data'];
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

  investigationDrawerVisible: boolean = false;
  investigationDrawerTitle: string;
  investigationDrawerData: InvestigationMaster = new InvestigationMaster();
  showlayoutDataList: any = [];
  total = 0;
  total1 = 0;
  citylist: any = [];

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

  showid: any;
  logdata: any = [];

  showstatus(event: any, i) {
    this.logdata = [];
    this.showid = i;
    // this.logs=event;

    this.api
      .getTransferLog(0, 0, '', 'desc', ' AND TRANSFER_ID=' + event.ID)
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
  addApply(key: any): void {
    this.isSpin = false;
    this.relationdata = [];

    this.editrelation = new Realtionshipdata();
    this.claimID = '';
    this.empID = '';
    this.drawerTitle = 'Application for Travelling Allowance for TRANSFER';
    this.isdraweropended = true;
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.userId)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.drawerData = Object.assign({}, data['data'][0]);
            this.Employee_name = data['data'][0]['NAME'];
            this.emp_Designation = data['data'][0]['DESIGNATION'];
            this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
            this.emp_ddo = data['data'][0]['DDO_OF_THE_OFFICIAL'];
            this.office_name = data['data'][0]['OFFICE_NAME'];
            this.basic_pay = data['data'][0]['GRADE_PAY'];
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
          this.employeedata = this.userId;
          if (key == 'ad') {
            this.drawerData.IS_APPLYING_FOR_ADVANCE = true;
            this.drawerData.IS_ADVANCE_TAKEN = true;
          } else {
            this.drawerData.IS_APPLYING_FOR_ADVANCE = false;
          }
          this.drawerVisible = true;
          this.showmodell = false;
        },
        (err) => {}
      );
    this.currentStage = 0;
    this.isSpin = false;
  }

  opennnadvance(aa: any) {
    if (aa == 'apply') {
      this.addApply('ad');
    } else {
      this.add1('ad');
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
  cancel11() {
    this.showmodell = false;
  }

  checkstep(stepno: any, adstepno: any, data: any) {
    if (data.IS_APPLYING_FOR_ADVANCE && !data.IS_TRANSFER_ADVANCE_CREATED) {
      return adstepno;
    } else {
      return stepno;
    }
  }
}
