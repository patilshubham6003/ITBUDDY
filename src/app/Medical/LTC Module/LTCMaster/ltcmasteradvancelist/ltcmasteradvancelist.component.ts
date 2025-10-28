import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { LTCMaster } from 'src/app/Medical/Models/LTCMaster';
import { checkListltc1 } from 'src/app/Medical/Models/checklistltc';
import { ApiService } from 'src/app/Medical/Service/api.service';

import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { LTCSignatureMapData } from 'src/app/Medical/Models/LTCSignaturemap';

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
  },
});
@Component({
  selector: 'app-ltcmasteradvancelist',
  templateUrl: './ltcmasteradvancelist.component.html',
  styleUrls: ['./ltcmasteradvancelist.component.css'],
  providers: [NzNotificationService],
})
export class LtcmasteradvancelistComponent {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';
  drawerData: LTCMaster = new LTCMaster();
  userId: any;
  parentUserId: any;
  userName = Number(sessionStorage.getItem('userId'));
  // roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;
  formTitle = 'Manage Advance LTC';
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

  ltcAdvanceGarMap: LTCSignatureMapData = new LTCSignatureMapData();
  ManjuriAdeshSignMap: LTCSignatureMapData = new LTCSignatureMapData();
  AdvanceOrderSignMap: LTCSignatureMapData = new LTCSignatureMapData();
  MapSignatureOrder: LTCSignatureMapData = new LTCSignatureMapData();
  MapSignaturePartB: LTCSignatureMapData = new LTCSignatureMapData();
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
  extraFilterQuery: any;
  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.INSPECTOR_ID = null;
    this.dataList = [];
    this.search();
  }

  isAdmin: boolean = false;
  roleId: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    if (this.isAdmin) {
      this.loadAllUsers();
    }
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  userIdFilter;
  search(reset: boolean = false) {
    this.isSpinning = true;
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

    this.loadingRecords = true;
    if (!this.isAdmin) {
      if (this.parentUserId == 0) {
        var tempFilter = '';
        tempFilter =
          ' AND (INSPECTOR_ID =' +
          Number(sessionStorage.getItem('userId')) +
          ' OR SUB_INSPECTOR_ID = ' +
          Number(sessionStorage.getItem('userId')) +
          ')';
      } else {
        tempFilter =
          ' AND INSPECTOR_ID =' +
          Number(sessionStorage.getItem('userId')) +
          ' AND SUB_INSPECTOR_ID = ' +
          this.parentUserId;
      }

      this.extraFilterQuery =
        " AND IS_DELETED = 0 AND LTC_STATUS != 'P' AND IS_ADVANCE_CLAIM = 1" +
        tempFilter;
    } else {
      // this.extraFilterQuery = "AND LTC_STATUS != 'P' ";
      this.extraFilterQuery = ' AND IS_DELETED = 0  AND IS_ADVANCE_CLAIM = 1';
    }

    this.api
      .getAllltcMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilterQuery + this.filterQuery + likeQuery
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

  FamilyList: any = [];

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

  aamount = 0;
  checkListltc: checkListltc1 = new checkListltc1();
  partAData: any = [];
  relationdata1: any = [];
  formdata7: any = [];

  get close4rCloseCallback() {
    return this.close4.bind(this);
  }
  close4() {
    this.visible4 = false;
    this.search();
  }

  calculationDatalist: any = [];

  GoLtcFinal = 'Final Order';
  calculationTitle = 'Calculation';
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
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  currentStage = 0;
  isSpin: boolean = false;
  journeyData: any = [];
  add(): void {
    this.drawerTitle = 'Create New Advance Claim';
    this.drawerData = new LTCMaster();
    // this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
    //   sessionStorage.getItem('ddoId')
    // );
    this.drawerData.IS_ADVANCE_CLAIM = true;
    this.currentStage = 0;
    this.isSpin = false;
    this.relationdata = [];
    this.journeyData = [];
    this.ltcID = '';
    this.empID = '';
    this.drawerVisible = true;
  }

  empID;
  ltcID: any;
  currentStageID;

  relationdata: any = [];
  employeeDrawerData: any = [];

  edit(data: LTCMaster): void {
    this.ltcID = data.ID;
    this.isSpinning = false;
    this.currentStage = 0;
    this.drawerTitle = 'Edit Advance Claim Details';
    this.journeyData = [];
    this.drawerData = Object.assign({}, data);
    // if (
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == null ||
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == undefined ||
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == '' ||
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == 0
    // ) {
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
    //     sessionStorage.getItem('ddoId')
    //   );
    // } else {
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID =
    //     this.drawerData.DDO_OF_THE_OFFICIAL_ID;
    // }
    this.drawerData.SALUTATION = data.SALUTATION;
    if (
      this.drawerData.JOURNEY_DATA != null &&
      this.drawerData.JOURNEY_DATA != undefined &&
      this.drawerData.JOURNEY_DATA != ''
    ) {
      this.journeyData = JSON.parse(this.drawerData.JOURNEY_DATA);
    } else {
      this.journeyData = [];
    }
    this.api
      .getltc_family_master(0, 0, '', ' ', ' AND LTC_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.relationdata = data['data'];
        },

        (err) => {}
      );
    this.empID = data.EMP_ID;
    this.ltcID = data.ID;

    this.drawerVisible = true;
  }

  orderDrawerTitle: string;
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
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

  drawerLogVisible: boolean = false;
  drawerLogTitle: string = '';
  drawerLogData: any = [];

  openLogDrawer(): void {
    this.drawerLogTitle = 'Advance Claim Log Details';
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
  }
  cancel(): void {}

  deleteConfirm(data: any) {
    this.loadingRecords = true;

    data.IS_DELETED = 1;

    this.api.ltcMasterUpdate(data).subscribe((successCode) => {
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
  SECTION_TYPE: any;

  fileName: string = 'AdvanceClaim';
  pdfDownload: any = false;

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
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');
  }

  users: any = [];
  loadAllUsers() {
    this.api
      .getAllUsers(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_ACTIVE = 1  AND ROLE_IDS in (19,42)'
      )
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
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }
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
  AnyWindow(data) {
    window.open(this.api.retriveimgUrl + 'ltcPartA/' + data.LTC_PART_A);
  }

  advCalculationSheetData: any;
  advAmount: any;
  advNamount: any = 0;
  advIsVisible: boolean = false;
  advDestinationList: any = [];
  advformdata7: any = [];
  eligibleAmount: any = 0;
  advanceAllowable: any = 0;

  advCalculationSheet(data) {
    this.loadingRecords = true;
    this.ltcID = data.ID;
    this.advNamount = 0;
    this.eligibleAmount = 0;
    this.advanceAllowable = 0;

    this.advDestinationList = [];
    this.advformdata7 = [];
    var singleFareTotal: any = 0;
    if (
      data.JOURNEY_DATA != null &&
      data.JOURNEY_DATA != undefined &&
      data.JOURNEY_DATA != ''
    ) {
      this.advformdata7 = JSON.parse(data.JOURNEY_DATA);
      this.advformdata7.forEach((journey) => {
        singleFareTotal += journey.JOURNEY_CLAIMED_AMOUNT * journey.NO_OF_FAIRS;
      });
    } else {
      this.advformdata7 = [];
    }
    this.advCalculationSheetData = [];

    if (this.advformdata7.length > 0) {
      // for (let i = 0; i < this.advformdata7.length; i++) {
      //   this.advAmount += this.advformdata7[i]['AMOUNT_WITH_TAX'];
      // }
      // var advAmountClaimed = 0;
      for (let i = 0; i < this.advformdata7.length; i++) {
        this.advDestinationList.push(this.advformdata7[i].DEPARTURE_FROM);
        this.advDestinationList.push(this.advformdata7[i].ARRIVAL_TO);

        // advAmountClaimed += Number(this.advformdata7[i].JOURNEY_CLAIMED_AMOUNT);
      }
      // if (
      //   data.REQUIRED_ADVANCE_AMOUNT != undefined &&
      //   data.REQUIRED_ADVANCE_AMOUNT != null &&
      //   data.REQUIRED_ADVANCE_AMOUNT != ''
      // ) {
      //   this.eligibleAmount = Math.round(
      //     (data.REQUIRED_ADVANCE_AMOUNT * 90) / 100
      //   );
      // } else {
      //   this.eligibleAmount = 0;
      // }
      this.eligibleAmount = Math.round((singleFareTotal * 90) / 100);

      if (Number(this.eligibleAmount) > Number(data.REQUIRED_ADVANCE_AMOUNT)) {
        this.advanceAllowable = Number(data.REQUIRED_ADVANCE_AMOUNT);
      } else if (
        Number(this.eligibleAmount) < Number(data.REQUIRED_ADVANCE_AMOUNT)
      ) {
        this.advanceAllowable = Number(this.eligibleAmount);
      } else {
        this.advanceAllowable = Number(this.eligibleAmount);
      }
    }
    data.FINAL_ADVANCE_AMOUNT = Math.round(this.advanceAllowable);
    data.AMOUNT_OF_ADVANCE = Math.round(this.advanceAllowable);
    this.api.ltcMasterUpdate(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.api.getAllltcMaster(0, 0, '', '', ' AND ID =' + data.ID).subscribe(
          (LTCData) => {
            if (LTCData['code'] == 200) {
              if (LTCData['data'].length == 0) {
                this.advCalculationSheetData = data;
              } else {
                this.advCalculationSheetData = LTCData['data'][0];
              }
              this.advIsVisible = true;
              this.loadingRecords = false;
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
      } else {
        this.message.error('Failed To Save Information....', '');
        this.loadingRecords = false;
      }
    });

    // if (
    //   this.advCalculationSheetData.REQUIRED_ADVANCE_AMOUNT != undefined &&
    //   this.advCalculationSheetData.REQUIRED_ADVANCE_AMOUNT != null &&
    //   this.advCalculationSheetData.REQUIRED_ADVANCE_AMOUNT != ''
    // ) {
    //   this.eligibleAmount = Math.round(
    //     (this.advCalculationSheetData.REQUIRED_ADVANCE_AMOUNT * 90) / 100
    //   );
    // } else {
    //   this.eligibleAmount = 0;
    // }

    // this.api
    //   .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
    //   .subscribe((journeyData) => {
    //     if (journeyData['code'] == 200) {
    //       this.advformdata7 = journeyData['data'];
    //       // this.advAmount = 0;
    //       if (this.advformdata7.length > 0) {
    //         // for (let i = 0; i < this.advformdata7.length; i++) {
    //         //   this.advAmount += this.advformdata7[i]['AMOUNT_WITH_TAX'];
    //         // }
    //         for (let i = 0; i < this.advformdata7.length; i++) {
    //           this.advDestinationList.push(this.advformdata7[i].DEPARTURE_FROM);
    //           this.advDestinationList.push(this.advformdata7[i].ARRIVAL_TO);
    //         }
    //         // this.advNamount = this.advAmount - data.AMOUNT_OF_ADVANCE;
    //         var advAmountClaimed = 0;
    //         for (var i = 0; this.advformdata7.length > i; i++) {
    //           advAmountClaimed += this.advformdata7[i].JOURNEY_CLAIMED_AMOUNT;
    //         }
    //         this.eligibleAmount = Math.round((advAmountClaimed * 90) / 100);

    //         if (data.REQUIRED_ADVANCE_AMOUNT > this.eligibleAmount) {
    //           this.advanceAllowable = this.eligibleAmount;
    //         } else if (data.REQUIRED_ADVANCE_AMOUNT < this.eligibleAmount) {
    //           this.advanceAllowable = data.REQUIRED_ADVANCE_AMOUNT;
    //         } else {
    //           this.advanceAllowable = data.REQUIRED_ADVANCE_AMOUNT;
    //         }
    //       }
    //       data.FINAL_ADVANCE_AMOUNT = this.advanceAllowable;
    //       data.AMOUNT_OF_ADVANCE = this.advanceAllowable;

    //       this.api.ltcMasterUpdate(data).subscribe((successCode) => {
    //         if (successCode.code == '200') {
    //           this.api
    //             .getAllltcMaster(0, 0, '', '', ' AND ID =' + data.ID)
    //             .subscribe(
    //               (LTCData) => {
    //                 if (LTCData['code'] == 200) {
    //                   if (LTCData['data'].length == 0) {
    //                     this.advCalculationSheetData = data;
    //                   } else {
    //                     this.advCalculationSheetData = LTCData['data'][0];
    //                   }
    //                   this.advIsVisible = true;
    //                   this.loadingRecords = false;
    //                 } else {
    //                   this.message.error('Something Went Wrong', '');
    //                   this.loadingRecords = false;
    //                 }
    //               },
    //               (err) => {}
    //             );
    //         } else {
    //           this.message.error('Failed To Save Information....', '');
    //           this.loadingRecords = false;
    //         }
    //       });
    //     } else {
    //       this.loadingRecords = false;
    //     }
    //   });
  }

  get closeAdvCalculationCloseCallback() {
    return this.advCalculationClose.bind(this);
  }
  advCalculationClose() {
    this.advIsVisible = false;
    this.search();
  }

  advApplication: boolean = false;
  advApplicationData: any = [];
  advFamilyRelation: any = [];
  numberOfSingleFare: any = 0;
  amountOfSingleFare: any = 0;
  journeyModes: any = [];
  journeyClassModes: any = [];
  advJourneyData: any = [];
  singleFareTotal = 0;
  advLTCApplication(data) {
    this.advApplicationData = data;
    this.loadingRecords = true;
    this.numberOfSingleFare = 0;
    this.amountOfSingleFare = 0;
    this.journeyModes = [];
    this.journeyClassModes = [];
    this.advJourneyData = [];
    this.singleFareTotal = 0;
    if (
      data.JOURNEY_DATA != null &&
      data.JOURNEY_DATA != undefined &&
      data.JOURNEY_DATA != ''
    ) {
      this.advJourneyData = JSON.parse(data.JOURNEY_DATA);
      this.advJourneyData.forEach((journey) => {
        this.singleFareTotal +=
          journey.JOURNEY_CLAIMED_AMOUNT * journey.NO_OF_FAIRS;
      });
    } else {
      this.advJourneyData = [];
    }

    if (this.advJourneyData.length > 0) {
      for (let i = 0; i < this.advJourneyData.length; i++) {
        if (
          this.journeyModes.includes(
            this.advJourneyData[i].TRAVEL_MODE_NAME
          ) === false
        )
          this.journeyModes.push(this.advJourneyData[i].TRAVEL_MODE_NAME);
        if (
          this.journeyClassModes.includes(
            this.advJourneyData[i].TRAVEL_CLASS_NAME
          ) === false
        )
          this.journeyClassModes.push(this.advJourneyData[i].TRAVEL_CLASS_NAME);

        this.numberOfSingleFare += Number(this.advJourneyData[i].NO_OF_FAIRS);
        this.amountOfSingleFare += Number(
          this.advJourneyData[i].JOURNEY_CLAIMED_AMOUNT
        );
      }
    } else {
      this.journeyModes = [];
      this.journeyClassModes = [];
    }

    this.api
      .getltc_family_master(
        0,
        0,
        '',
        ' ',
        ' AND LTC_ID = ' + this.advApplicationData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.advFamilyRelation = data['data'];
            } else {
              this.advFamilyRelation = [];
            }
            this.loadingRecords = false;
            this.advApplication = true;
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  get closeAdvApplicationCloseCallback() {
    return this.advApplicationClose.bind(this);
  }
  advApplicationClose() {
    this.advApplication = false;
    this.search();
  }
  advIsVisibleGAR37: boolean = false;
  advGAR37Data: any = [];
  GAR37AdvanceAmount: any = 0;
  totalAmountInEng: any = '';
  // advGAR37(data) {
  //   this.advGAR37Data = [];
  //   this.advGAR37Data = data;
  //   this.loadingRecords = true;
  //   this.GAR37AdvanceAmount = 0;
  //   this.totalAmountInEng = '';
  //   var singleFareTotal: any = 0;
  //   var advGARJourney: any = [];
  //   if (
  //     data.JOURNEY_DATA != null &&
  //     data.JOURNEY_DATA != undefined &&
  //     data.JOURNEY_DATA != ''
  //   ) {
  //     advGARJourney = JSON.parse(data.JOURNEY_DATA);
  //     advGARJourney.forEach((journey) => {
  //       singleFareTotal += journey.JOURNEY_CLAIMED_AMOUNT * journey.NO_OF_FAIRS;
  //     });
  //   } else {
  //     advGARJourney = [];
  //   }
  //   this.api
  //     .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
  //     .subscribe((journeyData) => {
  //       if (journeyData['code'] == 200) {
  //         // this.advformdata7 = data['data'];
  //         this.advAmount = 0;
  //         if (journeyData['data'].length > 0) {
  //           // var advAmountClaimed = 0;
  //           // for (var i = 0; journeyData['data'].length > i; i++) {
  //           //   advAmountClaimed += journeyData['data'][i].JOURNEY_CLAIMED_AMOUNT;
  //           // }
  //           var eligibleAmount: any = 0;
  //           eligibleAmount = Math.round(
  //             (Number(this.advGAR37Data.REQUIRED_ADVANCE_AMOUNT) * 90) / 100
  //           );

  //           if (Number(singleFareTotal) > eligibleAmount) {
  //             this.GAR37AdvanceAmount = eligibleAmount;
  //           } else if (Number(singleFareTotal) < eligibleAmount) {
  //             this.GAR37AdvanceAmount = Number(singleFareTotal);
  //           } else {
  //             this.GAR37AdvanceAmount = Number(singleFareTotal);
  //           }
  //         }
  //         data.FINAL_ADVANCE_AMOUNT = this.GAR37AdvanceAmount;
  //         data.AMOUNT_OF_ADVANCE = this.GAR37AdvanceAmount;
  //         this.api.ltcMasterUpdate(data).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             this.api
  //               .getAllltcMaster(0, 0, '', '', ' AND ID =' + data.ID)
  //               .subscribe(
  //                 (LTCData) => {
  //                   if (LTCData['code'] == 200) {
  //                     if (LTCData['data'].length == 0) {
  //                       this.advGAR37Data = data;
  //                     } else {
  //                       this.advGAR37Data = LTCData['data'][0];
  //                     }

  //                     this.totalAmountInEng = toWords.convert(
  //                       this.advGAR37Data.FINAL_ADVANCE_AMOUNT,
  //                       { currency: true }
  //                     );

  //                     // let wordss = toWordsen.convert(this.am, { currency: true });
  //                     // this.advGAR37Data.FINAL_ADVANCE_AMOUNT = this.advGAR37Data.FINAL_ADVANCE_AMOUNT;
  //                     // this.admissibleinhindi = toWordsen.convert(this.advGAR37Data.FINAL_ADVANCE_AMOUNT, {
  //                     //   currency: true,
  //                     // });

  //                     this.advIsVisibleGAR37 = true;
  //                     this.loadingRecords = false;
  //                   } else {
  //                     this.message.error('Something Went Wrong', '');
  //                     this.loadingRecords = false;
  //                   }
  //                 },
  //                 (err) => {}
  //               );
  //           } else {
  //             this.message.error('Failed To Save Information....', '');
  //             this.loadingRecords = false;
  //           }
  //         });
  //       } else {
  //         this.loadingRecords = false;
  //       }
  //     });
  // }

  get closeAdvGAR37CloseCloseCallback() {
    return this.advGAR37Close.bind(this);
  }
  advGAR37Close() {
    this.advIsVisibleGAR37 = false;
    this.search();
  }
  advIsVisibleManjuri: boolean = false;
  advManjuriAdheshData: any = [];
  // advManjuriAdhesh(data) {
  //   this.advManjuriAdheshData = data;
  //   this.loadingRecords = true;
  //   this.advIsVisibleManjuri = true;
  //   this.loadingRecords = false;
  // }

  get closeAdvManjuriAdheshCloseCloseCallback() {
    return this.advManjuriAdheshClose.bind(this);
  }
  advManjuriAdheshClose() {
    this.advIsVisibleManjuri = false;
    this.search();
  }

  advOrderIsVisible: boolean = false;
  advOrderData: any = [];
  advOrderRelations: any = [];
  advOrderJourneyData: any = [];
  ordereligibleAmount: any = 0;
  allowedAmountInEng: any = '';
  // advOrder(data) {
  //   this.advOrderData = [];
  //   this.advOrderRelations = [];
  //   this.advOrderJourneyData = [];
  //   this.ordereligibleAmount = 0;
  //   this.allowedAmountInEng = '';
  //   this.loadingRecords = true;

  //   if (
  //     data.JOURNEY_DATA != null &&
  //     data.JOURNEY_DATA != undefined &&
  //     data.JOURNEY_DATA != ''
  //   ) {
  //     this.advOrderJourneyData = JSON.parse(data.JOURNEY_DATA);
  //   } else {
  //     this.advOrderJourneyData = [];
  //   }
  //   this.api
  //     .getltc_family_master(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
  //     .subscribe((data1) => {
  //       if (data1['code'] == 200) {
  //         if (data1['data'].length > 0) {
  //           for (let i = 0; i < data1['data'].length; i++) {
  //             this.advOrderRelations.push(data1['data'][i].RELATIONSHIP);
  //           }
  //         } else {
  //           this.advOrderRelations = [];
  //         }
  //         this.api.ltcMasterUpdate(data).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             this.api
  //               .getAllltcMaster(0, 0, '', '', ' AND ID =' + data.ID)
  //               .subscribe(
  //                 (data2) => {
  //                   if (data2['code'] == 200) {
  //                     if (data2['data'].length == 0) {
  //                       this.advOrderData = data;
  //                     } else {
  //                       this.advOrderData = data2['data'][0];
  //                     }
  //                     if (
  //                       this.advOrderData.FINAL_ADVANCE_AMOUNT != undefined &&
  //                       this.advOrderData.FINAL_ADVANCE_AMOUNT != null &&
  //                       this.advOrderData.FINAL_ADVANCE_AMOUNT != ''
  //                     ) {
  //                       this.allowedAmountInEng = toWords.convert(
  //                         this.advOrderData.FINAL_ADVANCE_AMOUNT,
  //                         { currency: true }
  //                       );
  //                     } else {
  //                       this.allowedAmountInEng = toWords.convert(0, {
  //                         currency: true,
  //                       });
  //                     }
  //                     if (
  //                       this.advOrderData.REQUIRED_ADVANCE_AMOUNT !=
  //                         undefined &&
  //                       this.advOrderData.REQUIRED_ADVANCE_AMOUNT != null &&
  //                       this.advOrderData.REQUIRED_ADVANCE_AMOUNT != ''
  //                     ) {
  //                       this.ordereligibleAmount = Math.round(
  //                         (this.advOrderData.REQUIRED_ADVANCE_AMOUNT * 90) / 100
  //                       );
  //                     } else {
  //                       this.ordereligibleAmount = 0;
  //                     }
  //                     this.loadingRecords = false;
  //                     this.advOrderIsVisible = true;
  //                   } else {
  //                     this.message.error('Something Went Wrong', '');
  //                     this.loadingRecords = false;
  //                   }
  //                 },
  //                 (err) => {}
  //               );
  //           } else {
  //             this.message.error('Failed To Save Information....', '');
  //             this.loadingRecords = false;
  //           }
  //         });
  //       } else {
  //         this.loadingRecords = false;
  //       }
  //     });
  // }

  get closeAdvOrderCloseCloseCallback() {
    return this.advOrderClose.bind(this);
  }
  advOrderClose() {
    this.advOrderIsVisible = false;
    this.search();
  }

  formdata3: any = [];
  formdata1: any = [];

  partAVisible = false;
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
                    this.aamount += this.formdata7[i]['JOURNEY_CLAIMED_AMOUNT'];
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
                                          this.partAVisible = true;
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

  closePartA() {
    this.partAVisible = false;
    this.search();
  }

  get partACloseCallback() {
    return this.closePartA.bind(this);
  }

  calculationVisible: boolean = false;
  passenger: any;
  calculationData: any = [];
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
                    if (Number(this.formdata7[i]['FAIR_PAID_DUPLICATE']) == 0) {
                      this.formdata7[i]['FAIR_PAID_DUPLICATE'] =
                        this.formdata7[i]['FAIR_PAID'];
                    }
                  }
                  this.calculationVisible = true;
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
  get calculationCloseCallback() {
    return this.closeCalculation.bind(this);
  }
  closeCalculation() {
    this.calculationVisible = false;
  }

  destinationList: any = [];
  OrderData: any;
  ltcsheet1Visible = false;

  Order(data: any) {
    this.loadingRecords = true;
    this.OrderData = data;

    if (this.OrderData.ID !== undefined && this.OrderData.ID !== null) {
      this.api
        .GetLTCSignature(0, 0, '', 'asc', ' AND LTC_ID =' + this.OrderData.ID)
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.MapSignatureOrder = data['data'][0];
            } else {
            }
          } else {
            this.MapSignatureOrder = new LTCSignatureMapData();
          }
        });
    }
    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];

          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['AMOUNT_WITH_TAX'];
          }
          for (let i = 0; i < this.formdata7.length; i++) {
            this.destinationList.push(this.formdata7[i].DEPARTURE_FROM);
            this.destinationList.push(this.formdata7[i].ARRIVAL_TO);
          }
          this.namount = this.amount - this.OrderData.AMOUNT_OF_ADVANCE;
          this.api
            .getltc_family_master(
              0,
              0,
              '',
              ' ',
              ' AND LTC_ID = ' + this.OrderData.ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  if (data['data'].length > 0) {
                    this.relationdata1 = data['data'];
                  } else {
                    this.relationdata1 = [];
                  }
                  this.loadingRecords = false;
                  this.ltcsheet1Visible = true;
                } else {
                  this.loadingRecords = false;
                  this.relationdata1 = [];
                }
              },
              (err) => {}
            );
        } else {
          this.loadingRecords = false;
        }
      });
  }

  ltcsheet1VisibleClose(): void {
    this.ltcsheet1Visible = false;
    this.search();
  }

  get ltcsheet1CloseCallback() {
    return this.ltcsheet1VisibleClose.bind(this);
  }

  partBData: any;
  POST: any;
  OFFICE_NAME: any;
  NAME: any;
  POST_HN: any;
  OFFICE_NAME_HN: any;
  NAME_HN: any;
  partB(data: any) {
    this.loadingRecords = true;
    this.partBData = data;
    this.FamilyList = [];
    this.destinationList = [];
    this.namount = 0;

    if (this.partBData.ID !== undefined && this.partBData.ID !== null) {
      this.api
        .GetLTCSignature(0, 0, '', 'asc', ' AND LTC_ID =' + this.partBData.ID)
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.MapSignaturePartB = data['data'][0];
            } else {
            }
          } else {
            this.MapSignaturePartB = new LTCSignatureMapData();
          }
        });
    }

    if (
      this.partBData.IS_DESTINATION_EDIT == null ||
      this.partBData.IS_DESTINATION_EDIT == '' ||
      this.partBData.IS_DESTINATION_EDIT == undefined
    ) {
      this.partBData.IS_DESTINATION_EDIT = 0;
    }

    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.partBData.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];
          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['AMOUNT_WITH_TAX'];
          }

          for (let i = 0; i < this.formdata7.length; i++) {
            // this.destinationList.push(this.formdata7[i].DEPARTURE_FROM);
            this.destinationList.push(this.formdata7[i].ARRIVAL_TO);
          }

          this.namount = this.amount - this.partBData.AMOUNT_OF_ADVANCE;
          if (
            this.partBData.AMOUNT != null &&
            this.partBData.AMOUNT != undefined &&
            this.partBData.AMOUNT != ''
          ) {
            this.namount = this.namount + this.partBData.AMOUNT;
          }

          this.api
            .getltc_family_master(
              0,
              0,
              '',
              ' ',
              ' AND LTC_ID = ' + this.partBData.ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  if (data['data'].length > 0) {
                    for (let i = 0; i < data['data'].length; i++) {
                      if (data['data'][i].RELATIONSHIP != 'Self') {
                        this.FamilyList.push(
                          data['data'][i].NAME_OF_FAMILY_MEMBER
                        );
                      }
                    }
                  } else {
                    this.FamilyList = [];
                  }
                  if (
                    this.partBData.PART_B_YEAR == undefined ||
                    this.partBData.PART_B_YEAR == null ||
                    this.partBData.PART_B_YEAR == ''
                  ) {
                    if (this.partBData.ORDER_YEAR == 'Block Year') {
                      this.partBData.PART_B_YEAR = 'Block Year';
                    } else {
                      this.partBData.PART_B_YEAR = 'Calendar Year';
                    }
                  }
                  this.loadingRecords = false;
                  this.ltcsheet2Visible = true;
                } else {
                }
              },
              (err) => {}
            );
        }
      });
  }

  ltcsheet2Visible = false;
  ltcsheet2VisibleClose(): void {
    this.ltcsheet2Visible = false;
    this.search();
  }

  get ltcsheet2CloseCallback() {
    return this.ltcsheet2VisibleClose.bind(this);
  }

  calculationSheetVisible = false;
  calculationSheet(data: any) {
    this.loadingRecords = true;
    this.ltcID = data.ID;
    this.namount = 0;
    this.destinationList = [];
    this.calculationSheetData = data;

    this.api

      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)

      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];
          this.amount = 0;
          for (let i = 0; i < this.formdata7.length; i++) {
            this.amount += this.formdata7[i]['AMOUNT_WITH_TAX'];
          }
          for (let i = 0; i < this.formdata7.length; i++) {
            this.destinationList.push(this.formdata7[i].DEPARTURE_FROM);
            this.destinationList.push(this.formdata7[i].ARRIVAL_TO);
          }
          this.namount =
            this.amount - this.calculationSheetData.AMOUNT_OF_ADVANCE;
          this.calculationSheetVisible = true;
          this.loadingRecords = false;
        }
      });
  }

  get calculationSheetCloseCallback() {
    return this.closeCalculationSheet.bind(this);
  }
  closeCalculationSheet() {
    this.calculationSheetVisible = false;
    this.search();
  }

  advGAR37(data) {
    this.advGAR37Data = [];
    this.advGAR37Data = data;
    this.loadingRecords = true;
    this.GAR37AdvanceAmount = 0;
    this.totalAmountInEng = '';
    var singleFareTotal: any = 0;
    var advGARJourney: any = [];

    if (this.advGAR37Data.ID !== undefined && this.advGAR37Data.ID !== null) {
      this.api
        .GetLTCSignature(
          0,
          0,
          '',
          'asc',
          ' AND LTC_ID =' + this.advGAR37Data.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.ltcAdvanceGarMap = data['data'][0];
            } else {
            }
          } else {
            this.ltcAdvanceGarMap = new LTCSignatureMapData();
          }
        });
    }

    if (
      data.JOURNEY_DATA != null &&
      data.JOURNEY_DATA != undefined &&
      data.JOURNEY_DATA != ''
    ) {
      var journeyAmountIntoFaires: any = 0;
      advGARJourney = JSON.parse(data.JOURNEY_DATA);
      advGARJourney.forEach((journey) => {
        journeyAmountIntoFaires +=
          journey.JOURNEY_CLAIMED_AMOUNT * journey.NO_OF_FAIRS;
      });
      singleFareTotal = Math.round(Number(journeyAmountIntoFaires));
    } else {
      advGARJourney = [];
    }
    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
      .subscribe((journeyData) => {
        if (journeyData['code'] == 200) {
          // this.advformdata7 = data['data'];
          this.advAmount = 0;
          if (journeyData['data'].length > 0) {
            // var advAmountClaimed = 0;
            // for (var i = 0; journeyData['data'].length > i; i++) {
            //   advAmountClaimed += journeyData['data'][i].JOURNEY_CLAIMED_AMOUNT;
            // }
            var eligibleAmount: any = 0;
            eligibleAmount = Math.round((Number(singleFareTotal) * 90) / 100);

            if (Number(data.REQUIRED_ADVANCE_AMOUNT) > eligibleAmount) {
              this.GAR37AdvanceAmount = eligibleAmount;
            } else if (Number(data.REQUIRED_ADVANCE_AMOUNT) < eligibleAmount) {
              this.GAR37AdvanceAmount = Number(data.REQUIRED_ADVANCE_AMOUNT);
            } else {
              this.GAR37AdvanceAmount = Number(data.REQUIRED_ADVANCE_AMOUNT);
            }
          }
          data.FINAL_ADVANCE_AMOUNT = Math.round(this.GAR37AdvanceAmount);
          data.AMOUNT_OF_ADVANCE = Math.round(this.GAR37AdvanceAmount);
          this.api.ltcMasterUpdate(data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.api
                .getAllltcMaster(0, 0, '', '', ' AND ID =' + data.ID)
                .subscribe(
                  (LTCData) => {
                    if (LTCData['code'] == 200) {
                      if (LTCData['data'].length == 0) {
                        this.advGAR37Data = data;
                      } else {
                        this.advGAR37Data = LTCData['data'][0];
                      }

                      this.totalAmountInEng = toWords.convert(
                        this.advGAR37Data.FINAL_ADVANCE_AMOUNT,
                        { currency: true }
                      );

                      // let wordss = toWordsen.convert(this.am, { currency: true });
                      // this.advGAR37Data.FINAL_ADVANCE_AMOUNT = this.advGAR37Data.FINAL_ADVANCE_AMOUNT;
                      // this.admissibleinhindi = toWordsen.convert(this.advGAR37Data.FINAL_ADVANCE_AMOUNT, {
                      //   currency: true,
                      // });

                      this.advIsVisibleGAR37 = true;
                      this.loadingRecords = false;
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Failed To Save Information....', '');
              this.loadingRecords = false;
            }
          });
        } else {
          this.loadingRecords = false;
        }
      });
  }

  advManjuriAdhesh(data) {
    this.advManjuriAdheshData = data;
    this.loadingRecords = true;

    if (
      this.advManjuriAdheshData.ID !== undefined &&
      this.advManjuriAdheshData.ID !== null
    ) {
      this.api
        .GetLTCSignature(
          0,
          0,
          '',
          'asc',
          ' AND LTC_ID =' + this.advManjuriAdheshData.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.ManjuriAdeshSignMap = data['data'][0];
            } else {
            }
            this.advIsVisibleManjuri = true;
            this.loadingRecords = false;
          } else {
            this.advIsVisibleManjuri = true;
            this.loadingRecords = false;
            this.ManjuriAdeshSignMap = new LTCSignatureMapData();
          }
        });
    }
  }

  advOrder(data) {
    this.advOrderData = [];
    this.advOrderRelations = [];
    this.advOrderJourneyData = [];
    this.ordereligibleAmount = 0;
    this.allowedAmountInEng = '';
    this.loadingRecords = true;

    if (
      data.JOURNEY_DATA != null &&
      data.JOURNEY_DATA != undefined &&
      data.JOURNEY_DATA != ''
    ) {
      var journeyAmountIntoFaires: any = 0;
      this.advOrderJourneyData = JSON.parse(data.JOURNEY_DATA);

      this.advOrderJourneyData.forEach((journey) => {
        journeyAmountIntoFaires +=
          journey.JOURNEY_CLAIMED_AMOUNT * journey.NO_OF_FAIRS;
      });

      this.ordereligibleAmount = Math.round(
        (Number(journeyAmountIntoFaires) * 90) / 100
      );
    } else {
      this.advOrderJourneyData = [];
      this.ordereligibleAmount = 0;
    }
    this.api
      .getltc_family_master(0, 0, '', 'asc', ' AND LTC_ID =' + data.ID)
      .subscribe((data1) => {
        if (data1['code'] == 200) {
          if (data1['data'].length > 0) {
            for (let i = 0; i < data1['data'].length; i++) {
              this.advOrderRelations.push(data1['data'][i].RELATIONSHIP);
            }
          } else {
            this.advOrderRelations = [];
          }
          this.api.ltcMasterUpdate(data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.api
                .getAllltcMaster(0, 0, '', '', ' AND ID =' + data.ID)
                .subscribe(
                  (data2) => {
                    if (data2['code'] == 200) {
                      if (data2['data'].length == 0) {
                        this.advOrderData = data;
                        this.Get_Ordrs();
                      } else {
                        this.advOrderData = data2['data'][0];
                        this.Get_Ordrs();
                      }
                      if (
                        this.advOrderData.FINAL_ADVANCE_AMOUNT != undefined &&
                        this.advOrderData.FINAL_ADVANCE_AMOUNT != null &&
                        this.advOrderData.FINAL_ADVANCE_AMOUNT != ''
                      ) {
                        this.allowedAmountInEng = toWords.convert(
                          this.advOrderData.FINAL_ADVANCE_AMOUNT,
                          { currency: true }
                        );
                      } else {
                        this.allowedAmountInEng = toWords.convert(0, {
                          currency: true,
                        });
                      }
                      // if (
                      //   this.advOrderData.REQUIRED_ADVANCE_AMOUNT !=
                      //     undefined &&
                      //   this.advOrderData.REQUIRED_ADVANCE_AMOUNT != null &&
                      //    this.advOrderData.REQUIRED_ADVANCE_AMOUNT != ''
                      // ) {
                      //   this.ordereligibleAmount = Math.round(
                      //     (this.advOrderData.REQUIRED_ADVANCE_AMOUNT * 90) / 100
                      //   );
                      // } else {
                      //   this.ordereligibleAmount = 0;
                      // }
                      this.loadingRecords = false;
                      this.advOrderIsVisible = true;
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Failed To Save Information....', '');
              this.loadingRecords = false;
            }
          });
        } else {
          this.loadingRecords = false;
        }
      });
  }
  Get_Ordrs() {
    if (
      this.advOrderData !== undefined &&
      this.advOrderData !== null &&
      this.advOrderData !== ''
    ) {
      this.api
        .GetLTCSignature(
          0,
          0,
          '',
          'asc',
          ' AND LTC_ID =' + this.advOrderData.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.AdvanceOrderSignMap = data['data'][0];
            } else {
            }
          } else {
            this.AdvanceOrderSignMap = new LTCSignatureMapData();
          }
        });
    }
  }
}
