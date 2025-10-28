import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { ApplicantMaster } from '../../Models/applicantmaster';
import { InvestigationMaster } from '../../Models/InvestigationMaster';
import { MedicalSignatureData } from '../../Models/MedicalSignature';
import { AngularEditorConfig } from '@kolkov/angular-editor';
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
  selector: 'app-claimmasterlistadvance',
  templateUrl: './claimmasterlistadvance.component.html',
  styleUrls: ['./claimmasterlistadvance.component.css'],
})
export class ClaimmasterlistadvanceComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';
  REFRED_RATE_LIST = '';
  drawerData: ApplicantMaster = new ApplicantMaster();
  // data: ClaimMaster = new ClaimMaster();
  userId = Number(sessionStorage.getItem('userId'));
  // userName = Number(sessionStorage.getItem('userId'));
  userName = sessionStorage.getItem('userName');
  roleId: any;
  pageSize2 = 10;

  formTitle = 'Manage Advance Claims';
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
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['CLAIM_STAGE_NAME', 'CLAIM_STAGE_NAME'],
    ['CLAIM_NO', 'CLAIM_NO'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['EMPLOYEE_DESIGNATION', 'EMPLOYEE_DESIGNATION'],
    ['PATIENT_NAME', 'PATIENT_NAME'],
    ['RELATION_WITH_PATIENT', 'RELATION_WITH_PATIENT'],
    ['BILL_FILIING_DATE', 'BILL_FILIING_DATE'],
    ['ADMISSIBLE_AMOUNT', 'ADMISSIBLE_AMOUNT'],
    ['TREATEMENT_TYPE', 'TREATEMENT_TYPE'],
    ['TREATMENT_START_DATE', 'TREATMENT_START_DATE'],
    ['TREATMENT_END_DATE', 'TREATMENT_END_DATE'],
    ['WARD_TYPE', 'WARD_TYPE'],
    ['CHECKLIST_STATUS', 'CHECKLIST_STATUS'],
    ['REJECT_REMARK', 'REJECT_REMARK'],
    ['PREPARED_BY', 'PREPARED_BY'],
    ['CHECKED_BY', 'CHECKED_BY'],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME: any;
  isSpinning = false;

  editorConfigPrepared: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Prepared By',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };
  editorConfigPreparedHn: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Prepared By In Hindi',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };
  editorConfigChecked: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Checked by',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };
  editorConfigCheckedHn: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Checked by In Hindi',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };

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
    this.INSPECTOR_ID = '';
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
  isAdmin: boolean = false;
  parentUserId: any;
  HeadOfOffice: any = '';
  HeadOfOfficeHn: any = '';
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
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

    // this.stageName();
    // this.search();
    // if (this.userId == 1) {
    if (this.isAdmin) {
      this.loadAllUsers();
    }
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();
    // } else {
    // }

    this.api
      .getAllDDOs(
        0,
        0,
        'ID',
        'ASC',
        ' AND ID = ' + Number(sessionStorage.getItem('ddoId'))
      )
      .subscribe(
        (data: any) => {
          this.HeadOfOffice = '';
          this.HeadOfOfficeHn = '';
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.HeadOfOffice = data['data'][0]['HEAD_OF_OFFICE'];
              this.HeadOfOfficeHn = data['data'][0]['HEAD_OF_OFFICE_HN'];
            } else {
              this.HeadOfOffice = '';
              this.HeadOfOfficeHn = '';
            }
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
            this.HeadOfOffice = '';
            this.HeadOfOfficeHn = '';
          }
        },
        (err) => {}
      );
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
  // sort(sort: any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   if (this.sortValue == 'descend') {
  //     this.sortValue = 'desc';
  //   } else {
  //     this.sortValue = 'asc';
  //   }
  //   this.search(true);
  // }
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
    //     ' AND IS_DELETED = 0 AND INSPECTOR_ID = ' +
    //     Number(sessionStorage.getItem('userId'));
    // } else if (Number(sessionStorage.getItem('roleId')) == 4) {
    //   this.userIdFilter =
    //     ' AND IS_DELETED = 0 AND AO_ID = ' +
    //     Number(sessionStorage.getItem('userId'));
    // } else {
    //   this.userIdFilter = ' AND IS_DELETED = 0';
    // }
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

      this.userIdFilter = ' AND IS_DELETED = 0 ' + tempFilter;
      //  +
      // ' AND ROLE_ID = ' +
      // Number(sessionStorage.getItem('roleId'));
    } else {
      this.userIdFilter = ' AND IS_DELETED = 0';
    }
    var advancefilter = ' AND IS_APPLYING_FOR_ADVANCE = 1';
    this.loadingRecords = true;
    // this.api
    //   .getClaimMasterCount(
    //     this.pageIndex,
    //     this.pageSize,
    //     this.sortKey,
    //     sort,
    //     this.userIdFilter
    //   )
    //   .subscribe(
    //     (data) => {
    //       // this.loadingRecords = false;
    //       this.allClaimCount = data['count'][0]['ALL_CLAIMS'];
    //       this.allNewCount = data['count'][0]['NEW'];
    //       this.allForwardCount = data['count'][0]['FORWARD'];
    //       this.allRejectCount = data['count'][0]['REJECTED'];
    //       this.allQueryCount = data['count'][0]['QUERY_RAISED'];
    //       this.allApprovedCount = data['count'][0]['APPROVED'];
    //       this.allReadyCount = data['count'][0]['READY'];
    //       // this.dataList = data['data'];

    //       // this.isSpinning = false;
    //       // this.filterClass = 'filter-invisible';
    //     },
    //     (err) => {
    //
    //     }
    //   );
    this.api
      .getclaimMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.userIdFilter + this.filterQuery + likeQuery + advancefilter,
        this.START_DATE,
        this.END_DATE,
        this.TYPE_OF_HOSPITAL,
        this.STAGE_NAME
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
  INSPECTOR_ID: any = '';
  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // if (this.SALES_MANAGER_ID != undefined) {
    //   // this.SALES_MANAGER_ID = this.SALES_MANAGER_ID;
    // }
    if (
      this.BILL_FILIING_DATE.length > 0 &&
      this.INSPECTOR_ID != null &&
      this.INSPECTOR_ID != undefined &&
      this.INSPECTOR_ID != ''
    ) {
      this.BILL_FILIING_DATE[0] = this.datePipe.transform(
        this.BILL_FILIING_DATE[0],
        'yyyy-MM-dd'
      );
      this.BILL_FILIING_DATE[1] = this.datePipe.transform(
        this.BILL_FILIING_DATE[1],
        'yyyy-MM-dd'
      );
      this.filterQuery = ' AND INSPECTOR_ID = ' + this.INSPECTOR_ID;
      this.search();
    } else if (
      this.BILL_FILIING_DATE.length == 0 &&
      this.INSPECTOR_ID != null &&
      this.INSPECTOR_ID != undefined &&
      this.INSPECTOR_ID != ''
    ) {
      this.filterQuery = ' AND INSPECTOR_ID = ' + this.INSPECTOR_ID;
      this.search();
    } else if (
      this.BILL_FILIING_DATE.length > 0 &&
      (this.INSPECTOR_ID == null ||
        this.INSPECTOR_ID == undefined ||
        this.INSPECTOR_ID == '')
    ) {
      this.BILL_FILIING_DATE[0] = this.datePipe.transform(
        this.BILL_FILIING_DATE[0],
        'yyyy-MM-dd'
      );
      this.BILL_FILIING_DATE[1] = this.datePipe.transform(
        this.BILL_FILIING_DATE[1],
        'yyyy-MM-dd'
      );
      this.search();
    } else {
      this.message.error('Please Select Any Filter Value', '');
    }
    // this.BILL_FILIING_DATE[0] = this.datePipe.transform(
    //   this.BILL_FILIING_DATE[0],
    //   'yyyy-MM-dd'
    // );
    // this.BILL_FILIING_DATE[1] = this.datePipe.transform(
    //   this.BILL_FILIING_DATE[1],
    //   'yyyy-MM-dd'
    // );

    // if (this.BILL_FILIING_DATE[0] != null) {
    //   this.START_DATE = this.BILL_FILIING_DATE[0];
    // }

    // if (this.BILL_FILIING_DATE[1] != null) {
    //   this.END_DATE = this.BILL_FILIING_DATE[1];
    // }

    // this.search();
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
    this.getAllUsers();
    // window.location.reload();
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  currentStage = 0;
  isSpin: boolean = false;
  add(): void {
    this.drawerTitle = 'Create New Advance Claim';
    this.drawerData = new ApplicantMaster();
    this.drawerData.IS_APPLYING_FOR_ADVANCE = 1;
    this.drawerData.IS_ADVANCE_AMOUNT_CLAIMED = 0;
    // this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
    //   sessionStorage.getItem('ddoId')
    // );
    this.currentStage = 0;
    this.isSpin = false;
    this.claimID = '';
    this.empID = '';
    this.currentStageID = '';
    this.drawerVisible = true;
  }
  // empID=0;
  // edit(data: any): void {
  //   this.drawerTitle = 'Edit Claim Details';

  //   this.drawerData = Object.assign({}, data);

  //   this.empID = data.ID;

  //   this.drawerVisible = true;
  // }

  empID;
  claimID;
  currentStageID;
  designationList: any = [];
  edit(data: any): void {
    this.drawerTitle = 'Edit Advance Claim Details';
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
    this.isSpin = false;
    this.empID = this.drawerData.EMP_ID;
    this.claimID = this.drawerData.ID;
    this.currentStageID = this.drawerData.CURRENT_STAGE_ID;
    this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    this.drawerData['DESIGNATION_ID'] = this.drawerData['DESIGNATION_ID'];

    this.drawerData['EMPLOYEE_CODE'] = this.drawerData['EMPLOYEE_CODE'];
    this.currentStage = 0;
    this.drawerVisible = true;
  }
  orderDrawerVisible: boolean = false;
  orderDrawerTitle: string = '';
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
  am = 100;
  fileList: any = [];
  HospitalMapping: any = [];
  orderSignatureData: any = [];
  openOrderDrawer(data: any): void {
    this.orderSignatureData = [];
    this.Order = '';
    this.loadingRecords = true;
    if (data.ADMISSIBLE_AMOUNT == null || data.ADMISSIBLE_AMOUNT == undefined) {
      this.message.info('Please Fill Annexure Details First', '');
      this.loadingRecords = false;
    } else {
      this.isAdvanceSameAsAdmissible = false;
      this.admissibleineng = '';
      this.admissibleinhindi = '';
      this.advadmissibleineng = '';
      this.advadmissibleinhindi = '';
      this.advanceineng = '';
      this.advanceinhindi = '';
      this.finaladmissibleineng = '';
      this.finaladmissibleinhindi = '';
      this.finalclaimedineng = '';
      this.finalclaimedinhindi = '';
      this.finalremainingineng = '';
      this.finalremaininginhindi = '';
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
              // this.loadingRecords = false;
            }
          },
          (err) => {}
        );
      // this.api
      //   .getSignature(0, 0, '', '', ' AND ID = ' + data.SIGNATURE_ID)
      //   .subscribe(
      //     (data) => {
      //       if (data['code'] == 200) {
      //         this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
      //         this.NAME = data['data'][0]['NAME'];
      //         this.NAME_HN = data['data'][0]['NAME_HN'];
      //         this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
      //         this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
      //         this.POST = data['data'][0]['POST'];
      //         this.POST_HN = data['data'][0]['POST_HN'];
      //         // this.loadingRecords = false;
      //         // this.orderDrawerVisible = true;
      //       } else {
      //         this.message.error('Something Went Wrong', '');
      //         this.loadingRecords = false;
      //       }
      //     },
      //     (err) => {}
      //   );
      this.orderdata = data;
      if (
        this.orderdata.ADMISSIBLE_AMOUNT == null ||
        this.orderdata.ADMISSIBLE_AMOUNT == undefined ||
        this.orderdata.ADMISSIBLE_AMOUNT == 'NaN'
      ) {
        this.orderdata.ADMISSIBLE_AMOUNT = 0;
      } else {
        this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
      }

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

      if (
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == null ||
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == undefined ||
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == 'NaN'
      ) {
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT = 0;
      } else {
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
      }

      let wordsss = toWords.convert(this.am, { currency: true });
      this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
      this.amountinwordss = toWords.convert(
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
        {
          currency: true,
        }
      );

      let wordssss = toWordsen.convert(this.am, { currency: true });
      this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
      this.amountinwordssh = toWordsen.convert(
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
        {
          currency: true,
        }
      );

      this.orderDrawerTitle = 'Order Details';
      this.Signaturearray = [];
      this.api
        .getHospitalMapping(0, 0, 'ID', 'ASC', ' AND CLAIM_ID = ' + data.ID)
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.HospitalMapping = data['data'];
              } else {
                this.HospitalMapping = [];
              }
              this.loadingRecords = false;
              this.Order = 'O';
              this.isAdvanceSameAsAdmissible = false;

              if (
                this.orderdata.ADMISSIBLE_AMOUNT == null ||
                this.orderdata.ADMISSIBLE_AMOUNT == undefined ||
                this.orderdata.ADMISSIBLE_AMOUNT == 'NaN'
              ) {
                this.orderdata.ADMISSIBLE_AMOUNT = 0;
              } else {
                this.orderdata.ADMISSIBLE_AMOUNT =
                  this.orderdata.ADMISSIBLE_AMOUNT;
              }

              if (
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == null ||
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == undefined ||
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == 'NaN'
              ) {
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT = 0;
              } else {
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
              }

              if (
                this.orderdata.ADVANCE_AMOUNT == null ||
                this.orderdata.ADVANCE_AMOUNT == undefined ||
                this.orderdata.ADVANCE_AMOUNT == 'NaN'
              ) {
                this.orderdata.ADVANCE_AMOUNT = 0;
              } else {
                this.orderdata.ADVANCE_AMOUNT = this.orderdata.ADVANCE_AMOUNT;
              }

              if (
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT == null ||
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT == undefined ||
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT == 'NaN'
              ) {
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT = 0;
              } else {
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
              }

              if (
                this.orderdata.FINAL_CLAIMED_AMOUNT == null ||
                this.orderdata.FINAL_CLAIMED_AMOUNT == undefined ||
                this.orderdata.FINAL_CLAIMED_AMOUNT == 'NaN'
              ) {
                this.orderdata.FINAL_CLAIMED_AMOUNT = 0;
              } else {
                this.orderdata.FINAL_CLAIMED_AMOUNT =
                  this.orderdata.FINAL_CLAIMED_AMOUNT;
              }

              if (
                this.orderdata.FINAL_REMAINING_AMOUNT == null ||
                this.orderdata.FINAL_REMAINING_AMOUNT == undefined ||
                this.orderdata.FINAL_REMAINING_AMOUNT == 'NaN'
              ) {
                this.orderdata.FINAL_REMAINING_AMOUNT = 0;
              } else {
                this.orderdata.FINAL_REMAINING_AMOUNT =
                  this.orderdata.FINAL_REMAINING_AMOUNT;
              }

              if (
                this.orderdata.FINAL_CLAIMED_AMOUNT != null &&
                this.orderdata.FINAL_CLAIMED_AMOUNT != undefined &&
                this.orderdata.FINAL_CLAIMED_AMOUNT != ''
              ) {
                let finclaimeng = toWords.convert(this.am, {
                  currency: true,
                });
                this.orderdata.FINAL_CLAIMED_AMOUNT =
                  this.orderdata.FINAL_CLAIMED_AMOUNT;
                this.finalclaimedineng = toWords.convert(
                  this.orderdata.FINAL_CLAIMED_AMOUNT,
                  {
                    currency: true,
                  }
                );

                let finclaimhn = toWordsen.convert(this.am, {
                  currency: true,
                });
                this.orderdata.FINAL_CLAIMED_AMOUNT =
                  this.orderdata.FINAL_CLAIMED_AMOUNT;
                this.finalclaimedinhindi = toWordsen.convert(
                  this.orderdata.FINAL_CLAIMED_AMOUNT,
                  {
                    currency: true,
                  }
                );
              } else {
                this.finalclaimedinhindi = '';
                this.finalclaimedineng = '';
              }

              if (
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT != null &&
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT != undefined &&
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT != ''
              ) {
                let finadmeng = toWords.convert(this.am, {
                  currency: true,
                });
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                this.finaladmissibleineng = toWords.convert(
                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT,
                  {
                    currency: true,
                  }
                );

                let finadmhn = toWordsen.convert(this.am, {
                  currency: true,
                });
                this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                this.finaladmissibleinhindi = toWordsen.convert(
                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT,
                  {
                    currency: true,
                  }
                );
              } else {
                this.finaladmissibleineng = '';
                this.finaladmissibleinhindi = '';
              }

              if (
                this.orderdata.ADVANCE_AMOUNT != null &&
                this.orderdata.ADVANCE_AMOUNT != undefined &&
                this.orderdata.ADVANCE_AMOUNT != ''
              ) {
                let adveng = toWords.convert(this.am, { currency: true });
                this.orderdata.ADVANCE_AMOUNT = this.orderdata.ADVANCE_AMOUNT;
                this.advanceineng = toWords.convert(
                  this.orderdata.ADVANCE_AMOUNT,
                  {
                    currency: true,
                  }
                );

                let advhn = toWordsen.convert(this.am, {
                  currency: true,
                });
                this.orderdata.ADVANCE_AMOUNT = this.orderdata.ADVANCE_AMOUNT;
                this.advanceinhindi = toWordsen.convert(
                  this.orderdata.ADVANCE_AMOUNT,
                  {
                    currency: true,
                  }
                );
              } else {
                this.advanceineng = '';
                this.advanceinhindi = '';
              }

              if (
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != null &&
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != undefined &&
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != ''
              ) {
                let advadmeng = toWords.convert(this.am, {
                  currency: true,
                });
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                this.advadmissibleineng = toWords.convert(
                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
                  {
                    currency: true,
                  }
                );

                let advadmhn = toWordsen.convert(this.am, {
                  currency: true,
                });
                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                this.advadmissibleinhindi = toWordsen.convert(
                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
                  {
                    currency: true,
                  }
                );
              } else {
                this.advadmissibleineng = '';
                this.advadmissibleinhindi = '';
              }

              if (
                this.orderdata.ADMISSIBLE_AMOUNT != null &&
                this.orderdata.ADMISSIBLE_AMOUNT != undefined &&
                this.orderdata.ADMISSIBLE_AMOUNT != ''
              ) {
                let admeng = toWords.convert(this.am, { currency: true });
                this.orderdata.ADMISSIBLE_AMOUNT =
                  this.orderdata.ADMISSIBLE_AMOUNT;
                this.admissibleineng = toWords.convert(
                  this.orderdata.ADMISSIBLE_AMOUNT,
                  {
                    currency: true,
                  }
                );

                let admhn = toWordsen.convert(this.am, {
                  currency: true,
                });
                this.orderdata.ADMISSIBLE_AMOUNT =
                  this.orderdata.ADMISSIBLE_AMOUNT;
                this.admissibleinhindi = toWordsen.convert(
                  this.orderdata.ADMISSIBLE_AMOUNT,
                  {
                    currency: true,
                  }
                );
              } else {
                this.admissibleineng = '';
                this.admissibleinhindi = '';
              }

              if (
                this.orderdata.FINAL_REMAINING_AMOUNT != null &&
                this.orderdata.FINAL_REMAINING_AMOUNT != undefined &&
                this.orderdata.FINAL_REMAINING_AMOUNT != ''
              ) {
                let rem = toWords.convert(this.am, { currency: true });
                this.orderdata.FINAL_REMAINING_AMOUNT =
                  this.orderdata.FINAL_REMAINING_AMOUNT;
                this.finalremainingineng = toWords.convert(
                  this.orderdata.FINAL_REMAINING_AMOUNT,
                  {
                    currency: true,
                  }
                );

                let remhn = toWordsen.convert(this.am, {
                  currency: true,
                });
                this.orderdata.FINAL_REMAINING_AMOUNT =
                  this.orderdata.FINAL_REMAINING_AMOUNT;
                this.finalremaininginhindi = toWordsen.convert(
                  this.orderdata.FINAL_REMAINING_AMOUNT,
                  {
                    currency: true,
                  }
                );
              } else {
                this.finalremainingineng = '';
                this.finalremaininginhindi = '';
              }

              this.api
                .GetMedicalSignature(
                  0,
                  0,
                  '',
                  '',
                  ' AND CLAIM_ID = ' + this.orderdata.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.orderSignatureData = data['data'][0];
                        if (data['data'][0]['ADV_ORDER_HEADER']) {
                          this.orderSignatureData.ADV_ORDER_HEADER =
                            data['data'][0]['ADV_ORDER_HEADER'];
                        } else {
                          this.orderSignatureData.ADV_ORDER_HEADER =
                            '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351; , &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340; (&#2346;&#2381;&#2352;&#2358;&#2366;&#2360;&#2344; &#2319;&#2357;&#2306; &#2335;&#2368;&#2346;&#2368;&#2319;&#2360;), &#2350;&#2369;&#2306;&#2348;&#2312;</div><div>OFFICE OF THE COMMISSIONER OF INCOME-TAX (ADMIN, &amp; TPS)</div><div>&#2340;&#2368;&#2360;&#2352;&#2368; &#2350;&#2306;&#2332;&#2367;&#2354;, &#2310;&#2351;&#2325;&#2352; &#2349;&#2357;&#2344;, &#2350;&#2361;&#2352;&#2381;&#2359;&#2368; &#2325;&#2352;&#2381;&#2357;&#2375; &#2352;&#2379;&#2337;, &#2350;&#2369;&#2306;&#2348;&#2312; -20</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI-20</div>';
                        }
                      } else {
                        this.orderSignatureData = new MedicalSignatureData();

                        this.orderSignatureData.ADV_ORDER_HEADER =
                          '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351; , &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340; (&#2346;&#2381;&#2352;&#2358;&#2366;&#2360;&#2344; &#2319;&#2357;&#2306; &#2335;&#2368;&#2346;&#2368;&#2319;&#2360;), &#2350;&#2369;&#2306;&#2348;&#2312;</div><div>OFFICE OF THE COMMISSIONER OF INCOME-TAX (ADMIN, &amp; TPS)</div><div>&#2340;&#2368;&#2360;&#2352;&#2368; &#2350;&#2306;&#2332;&#2367;&#2354;, &#2310;&#2351;&#2325;&#2352; &#2349;&#2357;&#2344;, &#2350;&#2361;&#2352;&#2381;&#2359;&#2368; &#2325;&#2352;&#2381;&#2357;&#2375; &#2352;&#2379;&#2337;, &#2350;&#2369;&#2306;&#2348;&#2312; -20</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI-20</div>';
                      }

                      this.loadingRecords = false;
                      this.orderDrawerVisible = true;
                    } else {
                      this.orderSignatureData = [];
                      this.message.error('Something Went Wrong', '');
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {}
                );

              // this.orderDrawerVisible = true;
              this.Spin = false;
            } else {
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    }
  }

  Signaturearray: any = [];
  Order: any = '';
  Spin: boolean = false;
  isAdvanceSameAsAdmissible: boolean = false;
  openNewOrderDrawer(data: any): void {
    this.Order = '';
    this.loadingRecords = true;
    this.orderdata = data;
    if (data.ADMISSIBLE_AMOUNT == null || data.ADMISSIBLE_AMOUNT == undefined) {
      this.message.info('Please Fill Annexure Details First', '');
      this.loadingRecords = false;
    } else {
      this.isAdvanceSameAsAdmissible = false;
      this.admissibleineng = '';
      this.admissibleinhindi = '';
      this.advadmissibleineng = '';
      this.advadmissibleinhindi = '';
      this.advanceineng = '';
      this.advanceinhindi = '';
      this.finaladmissibleineng = '';
      this.finaladmissibleinhindi = '';
      this.finalclaimedineng = '';
      this.finalclaimedinhindi = '';
      this.finalremainingineng = '';
      this.finalremaininginhindi = '';
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
              // this.loadingRecords = false;
            }
          },
          (err) => {}
        );
      // this.api
      //   .getSignature(0, 0, '', '', ' AND ID = ' + data.SIGNATURE_ID)
      //   .subscribe(
      //     (data) => {
      //       if (data['code'] == 200) {
      //         this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
      //         this.NAME = data['data'][0]['NAME'];
      //         this.NAME_HN = data['data'][0]['NAME_HN'];
      //         this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
      //         this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
      //         this.POST = data['data'][0]['POST'];
      //         this.POST_HN = data['data'][0]['POST_HN'];
      //         // this.loadingRecords = false;
      //         // this.orderDrawerVisible = true;
      //       } else {
      //         this.message.error('Something Went Wrong', '');
      //         this.loadingRecords = false;
      //       }
      //     },
      //     (err) => {}
      //   );
      if (
        this.orderdata.ADMISSIBLE_AMOUNT == null ||
        this.orderdata.ADMISSIBLE_AMOUNT == undefined ||
        this.orderdata.ADMISSIBLE_AMOUNT == 'NaN'
      ) {
        this.orderdata.ADMISSIBLE_AMOUNT = 0;
      } else {
        this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
      }

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

      if (
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == null ||
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == undefined ||
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == 'NaN'
      ) {
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT = 0;
      } else {
        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
      }

      this.orderDrawerTitle = 'Order Details';
      this.Signaturearray = [];
      this.api
        .getHospitalMapping(0, 0, 'ID', 'ASC', ' AND CLAIM_ID = ' + data.ID)
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.HospitalMapping = data['data'];
              } else {
                this.HospitalMapping = [];
              }
              this.api
                .getSignature(0, 0, 'ID', 'desc', ' AND STATUS = 1 ')
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.Signaturearray = data['data'];
                      this.loadingRecords = false;
                      this.Spin = false;
                      this.total = 0;
                      this.total1 = 0;
                      this.advanceAdmissible = 0;
                      this.api
                        .getannexture(
                          0,
                          0,
                          'ID',
                          'ASC',
                          ' AND STATUS = 1 AND IS_ADVANCE = 0 AND CLAIM_ID=' +
                            this.orderdata.ID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              if (
                                this.orderdata.ADMISSIBLE_AMOUNT == null ||
                                this.orderdata.ADMISSIBLE_AMOUNT == undefined ||
                                this.orderdata.ADMISSIBLE_AMOUNT == 'NaN'
                              ) {
                                this.orderdata.ADMISSIBLE_AMOUNT = 0;
                              } else {
                                this.orderdata.ADMISSIBLE_AMOUNT =
                                  this.orderdata.ADMISSIBLE_AMOUNT;
                              }

                              if (
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT ==
                                  null ||
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT ==
                                  undefined ||
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT ==
                                  'NaN'
                              ) {
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT = 0;
                              } else {
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                              }

                              if (
                                this.orderdata.ADVANCE_AMOUNT == null ||
                                this.orderdata.ADVANCE_AMOUNT == undefined ||
                                this.orderdata.ADVANCE_AMOUNT == 'NaN'
                              ) {
                                this.orderdata.ADVANCE_AMOUNT = 0;
                              } else {
                                this.orderdata.ADVANCE_AMOUNT =
                                  this.orderdata.ADVANCE_AMOUNT;
                              }

                              if (
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT ==
                                  null ||
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT ==
                                  undefined ||
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT == 'NaN'
                              ) {
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT = 0;
                              } else {
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                              }

                              if (
                                this.orderdata.FINAL_CLAIMED_AMOUNT == null ||
                                this.orderdata.FINAL_CLAIMED_AMOUNT ==
                                  undefined ||
                                this.orderdata.FINAL_CLAIMED_AMOUNT == 'NaN'
                              ) {
                                this.orderdata.FINAL_CLAIMED_AMOUNT = 0;
                              } else {
                                this.orderdata.FINAL_CLAIMED_AMOUNT =
                                  this.orderdata.FINAL_CLAIMED_AMOUNT;
                              }

                              if (
                                this.orderdata.FINAL_REMAINING_AMOUNT == null ||
                                this.orderdata.FINAL_REMAINING_AMOUNT ==
                                  undefined ||
                                this.orderdata.FINAL_REMAINING_AMOUNT == 'NaN'
                              ) {
                                this.orderdata.FINAL_REMAINING_AMOUNT = 0;
                              } else {
                                this.orderdata.FINAL_REMAINING_AMOUNT =
                                  this.orderdata.FINAL_REMAINING_AMOUNT;
                              }
                              if (
                                this.orderdata.FINAL_CLAIMED_AMOUNT != null &&
                                this.orderdata.FINAL_CLAIMED_AMOUNT !=
                                  undefined &&
                                this.orderdata.FINAL_CLAIMED_AMOUNT != ''
                              ) {
                                let finclaimeng = toWords.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.FINAL_CLAIMED_AMOUNT =
                                  this.orderdata.FINAL_CLAIMED_AMOUNT;
                                this.finalclaimedineng = toWords.convert(
                                  this.orderdata.FINAL_CLAIMED_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );

                                let finclaimhn = toWordsen.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.FINAL_CLAIMED_AMOUNT =
                                  this.orderdata.FINAL_CLAIMED_AMOUNT;
                                this.finalclaimedinhindi = toWordsen.convert(
                                  this.orderdata.FINAL_CLAIMED_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );
                              } else {
                                this.finalclaimedinhindi = '';
                                this.finalclaimedineng = '';
                              }

                              if (
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT !=
                                  null &&
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT !=
                                  undefined &&
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT != ''
                              ) {
                                let finadmeng = toWords.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                                this.finaladmissibleineng = toWords.convert(
                                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );

                                let finadmhn = toWordsen.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                                this.finaladmissibleinhindi = toWordsen.convert(
                                  this.orderdata.FINAL_ADMISSIBLE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );
                              } else {
                                this.finaladmissibleineng = '';
                                this.finaladmissibleinhindi = '';
                              }

                              if (
                                this.orderdata.ADVANCE_AMOUNT != null &&
                                this.orderdata.ADVANCE_AMOUNT != undefined &&
                                this.orderdata.ADVANCE_AMOUNT != ''
                              ) {
                                let adveng = toWords.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.ADVANCE_AMOUNT =
                                  this.orderdata.ADVANCE_AMOUNT;
                                this.advanceineng = toWords.convert(
                                  this.orderdata.ADVANCE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );

                                let advhn = toWordsen.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.ADVANCE_AMOUNT =
                                  this.orderdata.ADVANCE_AMOUNT;
                                this.advanceinhindi = toWordsen.convert(
                                  this.orderdata.ADVANCE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );
                              } else {
                                this.advanceineng = '';
                                this.advanceinhindi = '';
                              }

                              if (
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT !=
                                  null &&
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT !=
                                  undefined &&
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != ''
                              ) {
                                let advadmeng = toWords.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                                this.advadmissibleineng = toWords.convert(
                                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );

                                let advadmhn = toWordsen.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                                this.advadmissibleinhindi = toWordsen.convert(
                                  this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );
                              } else {
                                this.advadmissibleineng = '';
                                this.advadmissibleinhindi = '';
                              }

                              if (
                                this.orderdata.ADMISSIBLE_AMOUNT != null &&
                                this.orderdata.ADMISSIBLE_AMOUNT != undefined &&
                                this.orderdata.ADMISSIBLE_AMOUNT != ''
                              ) {
                                let admeng = toWords.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.ADMISSIBLE_AMOUNT =
                                  this.orderdata.ADMISSIBLE_AMOUNT;
                                this.admissibleineng = toWords.convert(
                                  this.orderdata.ADMISSIBLE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );

                                let admhn = toWordsen.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.ADMISSIBLE_AMOUNT =
                                  this.orderdata.ADMISSIBLE_AMOUNT;
                                this.admissibleinhindi = toWordsen.convert(
                                  this.orderdata.ADMISSIBLE_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );
                              } else {
                                this.admissibleineng = '';
                                this.admissibleinhindi = '';
                              }

                              if (
                                this.orderdata.FINAL_REMAINING_AMOUNT != null &&
                                this.orderdata.FINAL_REMAINING_AMOUNT !=
                                  undefined &&
                                this.orderdata.FINAL_REMAINING_AMOUNT != ''
                              ) {
                                let rem = toWords.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.FINAL_REMAINING_AMOUNT =
                                  this.orderdata.FINAL_REMAINING_AMOUNT;
                                this.finalremainingineng = toWords.convert(
                                  this.orderdata.FINAL_REMAINING_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );

                                let remhn = toWordsen.convert(this.am, {
                                  currency: true,
                                });
                                this.orderdata.FINAL_REMAINING_AMOUNT =
                                  this.orderdata.FINAL_REMAINING_AMOUNT;
                                this.finalremaininginhindi = toWordsen.convert(
                                  this.orderdata.FINAL_REMAINING_AMOUNT,
                                  {
                                    currency: true,
                                  }
                                );
                              } else {
                                this.finalremainingineng = '';
                                this.finalremaininginhindi = '';
                              }
                              if (data['data'].length > 0) {
                                this.showlayoutDataList = data['data'];
                                this.total = 0;
                                this.total1 = 0;
                                this.advanceAdmissible = 0;

                                // for (var i = 0; data['count'] > i; i++) {
                                //   this.total =
                                //     this.total +
                                //     this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
                                //   this.total1 =
                                //     this.total1 +
                                //     this.showlayoutDataList[i][
                                //       'ADMISSIBLE_AMOUNT'
                                //     ];
                                // }
                                // this.claimData.ADMISSIBLE_AMOUNT = this.total1;
                                // this.claimData.CLAIMED_AMOUNT = this.total;

                                this.total1 = Number(this.total1);
                                if (this.orderdata.IS_ADVANCE_TAKEN == 1) {
                                  // this.advanceAdmissible = Math.round(
                                  //   (this.total1 * 90) / 100
                                  // );
                                  this.advanceAdmissible =
                                    this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;

                                  if (
                                    this.advanceAdmissible ==
                                    this.orderdata.ADVANCE_AMOUNT
                                  ) {
                                    this.isAdvanceSameAsAdmissible = true;
                                  } else {
                                    this.isAdvanceSameAsAdmissible = false;
                                  }
                                } else {
                                  this.advanceAdmissible = 0;
                                  this.isAdvanceSameAsAdmissible = false;
                                }
                                if (this.isAdvanceSameAsAdmissible == true) {
                                  let wordsss = toWords.convert(this.am, {
                                    currency: true,
                                  });
                                  this.advanceAdmissible =
                                    this.advanceAdmissible;
                                  this.amountinwordss = toWords.convert(
                                    this.advanceAdmissible,
                                    {
                                      currency: true,
                                    }
                                  );

                                  let wordssss = toWordsen.convert(this.am, {
                                    currency: true,
                                  });
                                  this.advanceAdmissible =
                                    this.advanceAdmissible;
                                  this.amountinwordssh = toWordsen.convert(
                                    this.advanceAdmissible,
                                    {
                                      currency: true,
                                    }
                                  );
                                } else {
                                  let wordsss = toWords.convert(this.am, {
                                    currency: true,
                                  });
                                  this.orderdata.ADMISSIBLE_AMOUNT =
                                    this.orderdata.ADMISSIBLE_AMOUNT;
                                  this.amountinwordss = toWords.convert(
                                    this.orderdata.ADMISSIBLE_AMOUNT,
                                    {
                                      currency: true,
                                    }
                                  );

                                  let wordssss = toWordsen.convert(this.am, {
                                    currency: true,
                                  });
                                  this.orderdata.ADMISSIBLE_AMOUNT =
                                    this.orderdata.ADMISSIBLE_AMOUNT;
                                  this.amountinwordssh = toWordsen.convert(
                                    this.orderdata.ADMISSIBLE_AMOUNT,
                                    {
                                      currency: true,
                                    }
                                  );
                                }
                                this.isSpinning = false;
                                this.Order = 'L';
                                // this.orderDrawerVisible = true;
                              } else {
                                this.isSpinning = false;
                                this.Order = 'L';
                                this.isAdvanceSameAsAdmissible = false;
                                // this.orderDrawerVisible = true;
                              }

                              this.api
                                .GetMedicalSignature(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID = ' + this.orderdata.ID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length > 0) {
                                        this.orderSignatureData =
                                          data['data'][0];
                                        if (
                                          data['data'][0]['NEW_ORDER_HEADER']
                                        ) {
                                          this.orderSignatureData.NEW_ORDER_HEADER =
                                            data['data'][0]['NEW_ORDER_HEADER'];
                                        } else {
                                          this.orderSignatureData.NEW_ORDER_HEADER =
                                            '<div class="family"><div>PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div>MUMBAI</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div></div>';
                                        }
                                      } else {
                                        this.orderSignatureData =
                                          new MedicalSignatureData();

                                        this.orderSignatureData.NEW_ORDER_HEADER =
                                          '<div class="family"><div>PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div>MUMBAI</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div></div>';
                                      }
                                      this.loadingRecords = false;
                                      this.orderDrawerVisible = true;
                                    } else {
                                      this.orderSignatureData = [];
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.loadingRecords = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.isSpinning = false;
                            }
                          },
                          (err) => {
                            this.isSpinning = false;
                          }
                        );
                    } else {
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    }
  }

  orderDrawerClose(): void {
    this.orderDrawerVisible = false;
    this.Spin = false;
    this.search();
    this.getAllUsers();
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
  investigationDrawerTitle: string = '';
  investigationDrawerData: InvestigationMaster = new InvestigationMaster();
  showlayoutDataList: any = [];
  total = 0;
  total1 = 0;
  advanceAdmissible = 0;
  citylist: any = [];
  hospitallist: any = [];
  ACCREDITATION: any = '';
  openInvestigationDrawer(data: any): void {
    this.total = 0;
    this.total1 = 0;
    if (data != null || data != undefined) {
      this.claimData = data;
      this.investigationDrawerTitle = 'Create New Investigation';
      this.investigationDrawerData = new InvestigationMaster();
      this.citylist = [];
      this.loadingRecords = true;
      // this.api.getCityMaster(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
      //   (data) => {
      //     if (data['code'] == 200) {
      //       if (data['data'].length > 0) {
      //         this.citylist = data['data'];
      //       } else {
      //         this.citylist = [];
      //       }
      this.api
        .getHospitalMapping(
          0,
          0,
          'NAME',
          'ASC',
          ' AND CLAIM_ID=' + this.claimData.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.hospitallist = data['data'];
                this.investigationDrawerData.CLAIM_HOSPITAL_MAPPING_ID =
                  this.hospitallist[0]['ID'];
                this.ACCREDITATION = this.hospitallist[0]['ACCREDATION'];
              } else {
                this.hospitallist = [];
              }
              this.api
                .getannexture(
                  0,
                  0,
                  'ID',
                  'ASC',
                  ' AND STATUS=1 AND IS_ADVANCE = 0 AND CLAIM_ID=' +
                    this.claimData.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.showlayoutDataList = data['data'];
                      this.total = 0;
                      this.total1 = 0;
                      if (data['data'].length > 0) {
                        for (
                          var i = 0;
                          this.showlayoutDataList.length > i;
                          i++
                        ) {
                          this.total =
                            this.total +
                            this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
                          this.total1 =
                            this.total1 +
                            this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
                        }
                      } else {
                        this.total = 0;
                        this.total1 = 0;
                      }
                      this.total1 = Math.round(this.total1);
                      if (this.claimData.IS_ADVANCE_TAKEN == 1) {
                        this.advanceAdmissible = Math.round(
                          (this.total1 * 90) / 100
                        );
                      } else {
                        this.advanceAdmissible = 0;
                      }
                      this.claimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
                        this.advanceAdmissible
                      );
                      this.loadingRecords = false;
                      this.investigationDrawerVisible = true;
                    } else {
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {
                    this.isSpinning = false;
                  }
                );
            } else {
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
      //     } else {
      //       this.loadingRecords = false;
      //     }
      //   },
      //   (err) => {}
      // );
    } else {
    }
  }

  investigationDrawerClose(): void {
    this.investigationDrawerVisible = false;
    this.search();
    this.getAllUsers();
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
    this.getAllUsers();
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

  // deleteConfirm(data: any) {
  //   this.loadingRecords = true;
  //   var data1 = {
  //     ID: data.ID,
  //     EMP_ID: data.EMP_ID,
  //   };
  //   this.api.deleteClaim(data1).subscribe((successCode) => {
  //     if (successCode.code == '200') {
  //       this.message.success('Claim Deleted Successfully...', '');
  //       // if (!addNew) this.drawerClose();
  //       this.search();
  //       this.loadingRecords = false;
  //     } else {
  //       this.message.error('Information Has Not Deleted...', '');
  //       this.loadingRecords = false;
  //     }
  //   });
  // }

  deleteConfirm(data: any) {
    this.loadingRecords = true;

    var data1 = {
      ID: data.ID,
      EMP_ID: data.EMP_ID,
      IS_DELETED: '1',
      IS_ADVANCE_TAKEN: data.IS_ADVANCE_TAKEN,
      CURRENT_STAGE_ID: data.CURRENT_STAGE_ID,
      PAY_BILL: data.PAY_BILL,
      SIGNATURE_ID: data.SIGNATURE_ID,
    };
    this.api.updateClaim(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Claim Deleted Successfully...', '');
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
  NAME: any;
  NAME_HN: any;
  OFFICE_NAME: any;
  OFFICE_NAME_HN: any;
  POST: any;
  POST_HN: any;
  viewFile(data: any): void {
    this.drawerClaimTitle = 'View Claim File';
    this.loadingRecords = true;
    this.drawerClaimData = Object.assign({}, data);
    this.admissibleineng = '';
    this.admissibleinhindi = '';
    if (this.drawerClaimData.IS_ADVANCE_TAKEN == 0) {
      if (
        data.ADMISSIBLE_AMOUNT != undefined &&
        data.ADMISSIBLE_AMOUNT != null
      ) {
        this.admissibleineng = toWords.convert(
          this.drawerClaimData.ADMISSIBLE_AMOUNT,
          { currency: true }
        );

        let wordss = toWordsen.convert(this.am, { currency: true });
        data.ADMISSIBLE_AMOUNT = data.ADMISSIBLE_AMOUNT;
        this.admissibleinhindi = toWordsen.convert(data.ADMISSIBLE_AMOUNT, {
          currency: true,
        });
      } else {
        this.admissibleineng = '';
        this.admissibleinhindi = '';
      }
    } else {
      if (
        data.ADVANCE_ADMISSIBLE_AMOUNT != undefined &&
        data.ADVANCE_ADMISSIBLE_AMOUNT != null
      ) {
        this.advadmissibleineng = toWords.convert(
          this.drawerClaimData.ADVANCE_ADMISSIBLE_AMOUNT,
          { currency: true }
        );

        let wordss = toWordsen.convert(this.am, { currency: true });
        data.ADVANCE_ADMISSIBLE_AMOUNT = data.ADVANCE_ADMISSIBLE_AMOUNT;
        this.advadmissibleinhindi = toWordsen.convert(
          data.ADVANCE_ADMISSIBLE_AMOUNT,
          {
            currency: true,
          }
        );
      } else {
        this.advadmissibleineng = '';
        this.advadmissibleinhindi = '';
      }
    }
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        ' AND STATUS = 1 AND ID = ' + data.SIGNATURE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.api
              .getHospitalMapping(
                0,
                0,
                'NAME',
                'ASC',
                ' AND CLAIM_ID=' + this.drawerClaimData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.hospitallist = data['data'];
                    } else {
                      this.hospitallist = [];
                    }
                    this.drawerClaimVisible = true;
                  } else {
                    this.loadingRecords = false;
                  }
                },
                (err) => {}
              );
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }
  drawerClaimClose(): void {
    this.drawerClaimVisible = false;
    this.search();
    this.getAllUsers();
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
      .getAllUsers(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_ACTIVE = 1 AND ROLE_IDS in (22,38)'
      )
      .subscribe(
        (userData) => {
          if (userData['code'] == 200) {
            this.users = userData['data'];
          } else {
            this.users = [];
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
          if (this.drawerClaimData.IS_ADVANCE_TAKEN == 1) {
            this.advanceAdmissible = Math.round((this.total1 * 90) / 100);
          } else {
            this.advanceAdmissible = 0;
          }
          this.drawerClaimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
            this.advanceAdmissible
          );
          this.isSpinning = false;
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
  amountinwordssh: any;
  amountinwordss: any;
  openPrintOrderModal(data) {
    this.isSpinning = true;
    this.orderdata = data;
    let words = toWords.convert(this.am, { currency: true });
    if (
      this.orderdata.ADMISSIBLE_AMOUNT != null &&
      this.orderdata.ADMISSIBLE_AMOUNT != undefined &&
      this.orderdata.ADMISSIBLE_AMOUNT != ''
    ) {
      this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
      this.admissibleineng = toWords.convert(this.orderdata.ADMISSIBLE_AMOUNT, {
        currency: true,
      });

      let wordss = toWordsen.convert(this.am, { currency: true });
      this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
      this.admissibleinhindi = toWordsen.convert(
        this.orderdata.ADMISSIBLE_AMOUNT,
        {
          currency: true,
        }
      );
    } else {
      this.admissibleineng = '';
      this.admissibleinhindi = '';
    }
    this.api
      .getSignature(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND ID = ' + data.SIGNATURE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.isSpinning = false;
            this.printOrderModalVisible = true;
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
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

  certificateVisible = false;
  certificateloadingRecords = false;
  certificateTitle: string = '';
  certificateData: any = [];
  openCertificate(data) {
    this.loadingRecords = true;
    this.certificateloadingRecords = false;
    this.certificateTitle = 'Certificate';
    this.certificateData = Object.assign({}, data);
    this.api
      .getHospitalMapping(0, 0, 'ID', 'ASC', ' AND CLAIM_ID = ' + data.ID)
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            if (data['code'] == 200 && data['count'] > 0) {
              this.HospitalMapping = data['data'];
            } else {
              this.HospitalMapping = [];
            }
            this.loadingRecords = false;
            this.certificateVisible = true;
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
    // this.GARVisible=true;
    // this.ltcsheet1Visible = true;
    // this.ltcsheet2Visible = true;
    // this.ltcorderVisible=true;
  }

  certificaterClose(): void {
    this.certificateVisible = false;
    this.certificateloadingRecords = false;
    this.search();
    this.getAllUsers();
  }

  get certificaterCloseCallback() {
    return this.certificaterClose.bind(this);
  }

  ltcorderVisible = false;
  ltcorderVisibleClose(): void {
    this.ltcorderVisible = false;
    this.getAllUsers();
    // this.search();
  }
  GARVisibleTitle = '';
  ltcorderVisibleTitle = '';
  GARData;
  amountinWordsInGar: any;
  SIGNATURE_ID: any;
  openGAR23(data) {
    this.SIGNATURE_ID = data.SIGNATURE_ID;
    this.certificateloadingRecords = false;
    this.loadingRecords = true;
    this.GARVisibleTitle = 'GAR 23';
    this.GARData = Object.assign({}, data);
    let words = toWords.convert(this.am, { currency: true });
    data.ADMISSIBLE_AMOUNT = data.ADMISSIBLE_AMOUNT;
    this.amountinWordsInGar = toWords.convert(data.ADMISSIBLE_AMOUNT, {
      currency: true,
    });
    this.api
      .getHospitalMapping(0, 0, 'ID', 'ASC', ' AND CLAIM_ID = ' + data.ID)
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            if (data['code'] == 200 && data['count'] > 0) {
              this.HospitalMapping = data['data'];
            } else {
              this.HospitalMapping = [];
            }
            this.api
              .getSignature(
                0,
                0,
                '',
                '',
                ' AND STATUS = 1 AND ID = ' + this.SIGNATURE_ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                    this.GARVisible = true;
                    this.loadingRecords = true;
                  } else {
                    this.message.error('Something Went Wrong', '');
                    this.loadingRecords = true;
                  }
                },
                (err) => {}
              );
          } else {
          }
        },
        (err) => {}
      );
    // this.GARVisible=true;
    // this.ltcsheet1Visible = true;
    // this.ltcsheet2Visible = true;
    // this.ltcorderVisible=true;
  }
  get ltcorderCloseCallback() {
    return this.ltcorderVisibleClose.bind(this);
  }
  GARVisible = false;
  GARVisibleClose(): void {
    this.GARVisible = false;
    this.search();
    this.getAllUsers();
  }
  get GARCloseCallback() {
    return this.GARVisibleClose.bind(this);
  }
  newClaimFileSignature: any = [];
  viewFileNew(data: any): void {
    this.drawerClaimTitle = 'View Claim File';
    this.loadingRecords = true;
    this.drawerClaimData = Object.assign({}, data);
    this.admissibleineng = '';
    this.admissibleinhindi = '';
    this.advanceineng = '';
    this.advanceinhindi = '';
    this.SIGNNAME2 = '';
    this.NAME_HN2 = '';
    this.POST2 = '';
    this.POST2_HIN = '';
    this.OFFICE_NAME2 = '';
    this.OFFICE_NAME2_HIN = '';

    this.SIGNNAME3 = '';
    this.NAME_HN3 = '';
    this.POST3 = '';
    this.POST3_HIN = '';
    this.OFFICE_NAME3 = '';
    this.OFFICE_NAME3_HIN = '';

    this.SIGNNAME4 = '';
    this.NAME_HN4 = '';
    this.POST4 = '';
    this.POST4_HIN = '';
    this.OFFICE_NAME4 = '';
    this.OFFICE_NAME4_HIN = '';
    if (data.ADMISSIBLE_AMOUNT != undefined && data.ADMISSIBLE_AMOUNT != null) {
      this.admissibleineng = toWords.convert(
        this.drawerClaimData.ADMISSIBLE_AMOUNT,
        { currency: true }
      );

      let wordss = toWordsen.convert(this.am, { currency: true });
      data.ADMISSIBLE_AMOUNT = data.ADMISSIBLE_AMOUNT;
      this.admissibleinhindi = toWordsen.convert(data.ADMISSIBLE_AMOUNT, {
        currency: true,
      });
    } else {
      this.admissibleineng = '';
      this.admissibleinhindi = '';
    }
    if (data.ADVANCE_AMOUNT != undefined && data.ADVANCE_AMOUNT != null) {
      this.advanceineng = toWords.convert(this.drawerClaimData.ADVANCE_AMOUNT, {
        currency: true,
      });

      let wordss = toWordsen.convert(this.am, { currency: true });
      data.ADVANCE_AMOUNT = data.ADVANCE_AMOUNT;
      this.advanceinhindi = toWordsen.convert(data.ADVANCE_AMOUNT, {
        currency: true,
      });
    } else {
      this.advanceineng = '';
      this.advanceinhindi = '';
    }
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        ' AND STATUS = 1 AND ID = ' + data.SIGNATURE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.api
              .getHospitalMapping(
                0,
                0,
                'NAME',
                'ASC',
                ' AND CLAIM_ID=' + this.drawerClaimData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.hospitallist = data['data'];
                    } else {
                      this.hospitallist = [];
                    }

                    this.api
                      .GetMedicalSignature(
                        0,
                        0,
                        '',
                        '',
                        ' AND CLAIM_ID = ' + this.drawerClaimData.ID
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              this.newClaimFileSignature = data['data'][0];

                              if (this.Signaturearray1.length > 0) {
                                if (
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_1 != null &&
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_1 !=
                                    undefined &&
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_1 != ''
                                ) {
                                  var f = this.Signaturearray1.filter(
                                    (item) =>
                                      item.ID ==
                                      this.newClaimFileSignature
                                        .ADV_CLAIM_CLAIM_FILE_SIGNATURE_1
                                  );
                                  if (f.length > 0) {
                                    this.SIGNNAME2 = f[0]['NAME'];
                                    this.NAME_HN2 = f[0]['NAME_HN'];
                                    this.POST2 = f[0]['POST'];
                                    this.POST2_HIN = f[0]['POST_HN'];
                                    this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
                                    this.OFFICE_NAME2_HIN =
                                      f[0]['OFFICE_NAME_HN'];
                                  } else {
                                    this.newClaimFileSignature.ADV_CLAIM_CLAIM_FILE_SIGNATURE_1 =
                                      null;
                                    this.SIGNNAME2 = '';
                                    this.NAME_HN2 = '';
                                    this.POST2 = '';
                                    this.POST2_HIN = '';
                                    this.OFFICE_NAME2 = '';
                                    this.OFFICE_NAME2_HIN = '';
                                  }
                                } else {
                                  this.SIGNNAME2 = '';
                                  this.NAME_HN2 = '';
                                  this.POST2 = '';
                                  this.POST2_HIN = '';
                                  this.OFFICE_NAME2 = '';
                                  this.OFFICE_NAME2_HIN = '';
                                }

                                if (
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_2 != null &&
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_2 !=
                                    undefined &&
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_2 != ''
                                ) {
                                  var f = this.Signaturearray1.filter(
                                    (item) =>
                                      item.ID ==
                                      this.newClaimFileSignature
                                        .ADV_CLAIM_CLAIM_FILE_SIGNATURE_2
                                  );
                                  if (f.length > 0) {
                                    this.SIGNNAME3 = f[0]['NAME'];
                                    this.NAME_HN3 = f[0]['NAME_HN'];
                                    this.POST3 = f[0]['POST'];
                                    this.POST3_HIN = f[0]['POST_HN'];
                                    this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
                                    this.OFFICE_NAME3_HIN =
                                      f[0]['OFFICE_NAME_HN'];
                                  } else {
                                    this.newClaimFileSignature.ADV_CLAIM_CLAIM_FILE_SIGNATURE_2 =
                                      null;
                                    this.SIGNNAME3 = '';
                                    this.NAME_HN3 = '';
                                    this.POST3 = '';
                                    this.POST3_HIN = '';
                                    this.OFFICE_NAME3 = '';
                                    this.OFFICE_NAME3_HIN = '';
                                  }
                                } else {
                                  this.SIGNNAME3 = '';
                                  this.NAME_HN3 = '';
                                  this.POST3 = '';
                                  this.POST3_HIN = '';
                                  this.OFFICE_NAME3 = '';
                                  this.OFFICE_NAME3_HIN = '';
                                }

                                if (
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_3 != null &&
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_3 !=
                                    undefined &&
                                  this.newClaimFileSignature
                                    .ADV_CLAIM_CLAIM_FILE_SIGNATURE_3 != ''
                                ) {
                                  var f = this.Signaturearray1.filter(
                                    (item) =>
                                      item.ID ==
                                      this.newClaimFileSignature
                                        .ADV_CLAIM_CLAIM_FILE_SIGNATURE_3
                                  );
                                  if (f.length > 0) {
                                    this.SIGNNAME4 = f[0]['NAME'];
                                    this.NAME_HN4 = f[0]['NAME_HN'];
                                    this.POST4 = f[0]['POST'];
                                    this.POST4_HIN = f[0]['POST_HN'];
                                    this.OFFICE_NAME4 = f[0]['OFFICE_NAME'];
                                    this.OFFICE_NAME4_HIN =
                                      f[0]['OFFICE_NAME_HN'];
                                  } else {
                                    this.newClaimFileSignature.ADV_CLAIM_CLAIM_FILE_SIGNATURE_3 =
                                      null;
                                    this.SIGNNAME4 = '';
                                    this.NAME_HN4 = '';
                                    this.POST4 = '';
                                    this.POST4_HIN = '';
                                    this.OFFICE_NAME4 = '';
                                    this.OFFICE_NAME4_HIN = '';
                                  }
                                } else {
                                  this.SIGNNAME4 = '';
                                  this.NAME_HN4 = '';
                                  this.POST4 = '';
                                  this.POST4_HIN = '';
                                  this.OFFICE_NAME4 = '';
                                  this.OFFICE_NAME4_HIN = '';
                                }
                              } else {
                                this.SIGNNAME2 = '';
                                this.NAME_HN2 = '';
                                this.POST2 = '';
                                this.POST2_HIN = '';
                                this.OFFICE_NAME2 = '';
                                this.OFFICE_NAME2_HIN = '';

                                this.SIGNNAME3 = '';
                                this.NAME_HN3 = '';
                                this.POST3 = '';
                                this.POST3_HIN = '';
                                this.OFFICE_NAME3 = '';
                                this.OFFICE_NAME3_HIN = '';

                                this.SIGNNAME4 = '';
                                this.NAME_HN4 = '';
                                this.POST4 = '';
                                this.POST4_HIN = '';
                                this.OFFICE_NAME4 = '';
                                this.OFFICE_NAME4_HIN = '';
                              }
                            } else {
                              this.newClaimFileSignature =
                                new MedicalSignatureData();
                            }

                            this.loadingRecords = false;
                            this.drawerNewClaimVisible = true;
                          } else {
                            this.newClaimFileSignature = [];
                            this.message.error('Something Went Wrong', '');
                            this.loadingRecords = false;
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.loadingRecords = false;
                  }
                },
                (err) => {}
              );
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  isClaimOk = true;
  printModalAdvClaimNewFileVisible: boolean = false;
  advClaimFileNewSave() {
    this.isClaimOk = true;
    this.isSpinning = true;
    if (
      (this.drawerClaimData.PREPARED_BY_HN == undefined ||
        this.drawerClaimData.PREPARED_BY_HN == null ||
        this.drawerClaimData.PREPARED_BY_HN == '') &&
      (this.drawerClaimData.CHECKED_BY_HN == undefined ||
        this.drawerClaimData.CHECKED_BY_HN == null ||
        this.drawerClaimData.CHECKED_BY_HN == '')
    ) {
      this.message.error(
        'Please Enter Prepared By In Hindi & Checked by In Hindi',
        ''
      );
      this.isClaimOk = false;
      this.isSpinning = false;
    } else if (
      this.drawerClaimData.PREPARED_BY_HN == undefined ||
      this.drawerClaimData.PREPARED_BY_HN == null ||
      this.drawerClaimData.PREPARED_BY_HN == ''
    ) {
      this.message.error('Please Enter Prepared By In Hindi', '');
      this.isClaimOk = false;
      this.isSpinning = false;
    } else if (
      this.drawerClaimData.CHECKED_BY_HN == undefined ||
      this.drawerClaimData.CHECKED_BY_HN == null ||
      this.drawerClaimData.CHECKED_BY_HN == ''
    ) {
      this.message.error('Please Enter Checked by In Hindi', '');
      this.isClaimOk = false;
      this.isSpinning = false;
    }
    this.newClaimFileSignature.CLAIM_ID = this.drawerClaimData.ID;
    if (this.isClaimOk) {
      if (this.newClaimFileSignature.ID) {
        this.api
          .UpdateMedicalSignature(this.newClaimFileSignature)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              // if (!addNew) this.drawerClose();
              this.isSpinning = false;
              this.api
                .GetMedicalSignature(
                  0,
                  0,
                  '',
                  '',
                  ' AND CLAIM_ID = ' + this.drawerClaimData.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.newClaimFileSignature = data['data'][0];
                      } else {
                        this.newClaimFileSignature = new MedicalSignatureData();
                      }

                      this.api
                        .updateClaimWithoutHospitalData(this.drawerClaimData)
                        .subscribe((successCode) => {
                          if (successCode.code == '200') {
                            // this.message.success('Information Changed Successfully...', '');
                            // if (!addNew) this.drawerClose();
                            this.message.success(
                              'Information updated Successfully',
                              ''
                            );

                            // this.getdata();

                            this.printModalAdvClaimNewFileVisible = true;
                            this.isSpinning = false;
                          } else {
                            this.message.error(
                              'Information Has Not Changed...',
                              ''
                            );
                            this.isSpinning = false;
                          }
                        });

                      // this.generateNewPDF();
                    } else {
                      this.newClaimFileSignature = [];
                      this.message.error('Something Went Wrong', '');
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .CreateMedicalSignature(this.newClaimFileSignature)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              // if (!addNew) {
              //   this.drawerClose();
              // } else {
              //   this.data = new SignatureMaster();
              //   this.resetDrawer(SignaturePage);
              // }
              this.isSpinning = false;
              this.api
                .GetMedicalSignature(
                  0,
                  0,
                  '',
                  '',
                  ' AND CLAIM_ID = ' + this.drawerClaimData.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.newClaimFileSignature = data['data'][0];
                      } else {
                        this.newClaimFileSignature = new MedicalSignatureData();
                      }
                      this.api
                        .updateClaimWithoutHospitalData(this.drawerClaimData)
                        .subscribe((successCode) => {
                          if (successCode.code == '200') {
                            // this.message.success('Information Changed Successfully...', '');
                            // if (!addNew) this.drawerClose();
                            this.message.success(
                              'Information updated Successfully',
                              ''
                            );

                            // this.getdata();

                            this.printModalAdvClaimNewFileVisible = true;
                            this.isSpinning = false;
                          } else {
                            this.message.error(
                              'Information Has Not Changed...',
                              ''
                            );
                            this.isSpinning = false;
                          }
                        });
                      // this.generateNewPDF();
                    } else {
                      this.newClaimFileSignature = [];
                      this.message.error('Something Went Wrong', '');
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  printModalAdvClaimNewFileCancel() {
    this.printModalAdvClaimNewFileVisible = false;
  }

  printModalClaimNewFileVisible: boolean = false;
  claimFileNewSave() {
    this.isClaimOk = true;
    this.isSpinning = true;
    if (
      (this.drawerClaimData.PREPARED_BY_HN == undefined ||
        this.drawerClaimData.PREPARED_BY_HN == null ||
        this.drawerClaimData.PREPARED_BY_HN == '') &&
      (this.drawerClaimData.CHECKED_BY_HN == undefined ||
        this.drawerClaimData.CHECKED_BY_HN == null ||
        this.drawerClaimData.CHECKED_BY_HN == '')
    ) {
      this.message.error(
        'Please Enter Prepared By In Hindi & Checked by In Hindi',
        ''
      );
      this.isClaimOk = false;
      this.isSpinning = false;
    } else if (
      this.drawerClaimData.PREPARED_BY_HN == undefined ||
      this.drawerClaimData.PREPARED_BY_HN == null ||
      this.drawerClaimData.PREPARED_BY_HN == ''
    ) {
      this.message.error('Please Enter Prepared By In Hindi', '');
      this.isClaimOk = false;
      this.isSpinning = false;
    } else if (
      this.drawerClaimData.CHECKED_BY_HN == undefined ||
      this.drawerClaimData.CHECKED_BY_HN == null ||
      this.drawerClaimData.CHECKED_BY_HN == ''
    ) {
      this.message.error('Please Enter Checked by In Hindi', '');
      this.isClaimOk = false;
      this.isSpinning = false;
    }
    this.newClaimFileSignature.CLAIM_ID = this.drawerClaimData.ID;
    if (this.isClaimOk) {
      if (this.newClaimFileSignature.ID) {
        this.api
          .UpdateMedicalSignature(this.newClaimFileSignature)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              // if (!addNew) this.drawerClose();
              this.isSpinning = false;
              this.api
                .GetMedicalSignature(
                  0,
                  0,
                  '',
                  '',
                  ' AND CLAIM_ID = ' + this.drawerClaimData.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.newClaimFileSignature = data['data'][0];
                      } else {
                        this.newClaimFileSignature = new MedicalSignatureData();
                      }
                      this.message.success(
                        ' Information Updated Successfully...',
                        ''
                      );
                      this.printModalClaimNewFileVisible = true;
                      // this.generateNewPDF();
                    } else {
                      this.newClaimFileSignature = [];
                      this.message.error('Something Went Wrong', '');
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .CreateMedicalSignature(this.newClaimFileSignature)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              // if (!addNew) {
              //   this.drawerClose();
              // } else {
              //   this.data = new SignatureMaster();
              //   this.resetDrawer(SignaturePage);
              // }
              this.isSpinning = false;
              this.api
                .GetMedicalSignature(
                  0,
                  0,
                  '',
                  '',
                  ' AND CLAIM_ID = ' + this.drawerClaimData.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.newClaimFileSignature = data['data'][0];
                      } else {
                        this.newClaimFileSignature = new MedicalSignatureData();
                      }
                      this.message.success(
                        ' Information Save Successfully...',
                        ''
                      );
                      this.printModalClaimNewFileVisible = true;
                      // this.generateNewPDF();
                    } else {
                      this.newClaimFileSignature = [];
                      this.message.error('Something Went Wrong', '');
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  printModalClaimNewFileCancel() {
    this.printModalClaimNewFileVisible = false;
  }

  drawerNewClaimVisible: boolean = false;
  drawerNewClaimClose(): void {
    this.drawerNewClaimVisible = false;
    this.search();
    this.getAllUsers();
  }

  get closeNewClaimCallback() {
    return this.drawerNewClaimClose.bind(this);
  }

  public generateNewPDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('newClaimFile');

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

  public generateAdvancePDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('advanceClaimFile');

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
  viewFileNew1111(data) {
    window.open(this.api.retriveimgUrl + 'claimForm/' + data.CLAIM_FORM);
  }

  advanceAnnexureVisible: boolean = false;
  openAdvanceAnnexure(data: any): void {
    if (data != null || data != undefined) {
      this.total = 0;
      this.total1 = 0;
      this.claimData = data;
      this.investigationDrawerTitle = 'Create New Advance Annexure A';
      this.investigationDrawerData = new InvestigationMaster();
      this.citylist = [];
      this.loadingRecords = true;
      // this.api.getCityMaster(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
      //   (data) => {
      //     if (data['code'] == 200) {
      //       if (data['data'].length > 0) {
      //         this.citylist = data['data'];
      //       } else {
      //         this.citylist = [];
      //       }
      //     } else {
      //       this.loadingRecords = false;
      //     }
      //   },
      //   (err) => {}
      // );
      this.api
        .getannexture(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS=1 AND IS_ADVANCE = 1 AND CLAIM_ID=' + this.claimData.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.showlayoutDataList = data['data'];
              this.total = 0;
              this.total1 = 0;
              if (data['data'].length > 0) {
                for (var i = 0; this.showlayoutDataList.length > i; i++) {
                  this.total =
                    this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
                  this.total1 =
                    this.total1 +
                    this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
                }
              } else {
                this.total = 0;
                this.total1 = 0;
              }
              this.total1 = Math.round(this.total1);
              if (this.claimData.IS_ADVANCE_TAKEN == 1) {
                this.advanceAdmissible = Math.round(this.total1);
              } else {
                this.advanceAdmissible = 0;
              }
              this.claimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
                this.advanceAdmissible
              );
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  'NAME',
                  'ASC',
                  ' AND CLAIM_ID=' + this.claimData.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.hospitallist = data['data'];
                        this.investigationDrawerData.CLAIM_HOSPITAL_MAPPING_ID =
                          this.hospitallist[0]['ID'];

                        this.ACCREDITATION =
                          this.hospitallist[0]['ACCREDATION'];
                      } else {
                        this.hospitallist = [];
                      }
                      this.loadingRecords = false;
                      this.advanceAnnexureVisible = true;
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    } else {
      this.loadingRecords = false;
    }
  }

  advanceAnnexureDrawerClose(): void {
    this.advanceAnnexureVisible = false;
    this.search();
    this.getAllUsers();
  }

  get advanceAnnexureDrawerCloseCallback() {
    return this.advanceAnnexureDrawerClose.bind(this);
  }

  admissibleineng: any = '';
  admissibleinhindi: any = '';
  advadmissibleineng: any = '';
  advadmissibleinhindi: any = '';
  advanceineng: any = '';
  advanceinhindi: any = '';
  finaladmissibleineng: any = '';
  finaladmissibleinhindi: any = '';
  finalclaimedineng: any = '';
  finalclaimedinhindi: any = '';
  finalremainingineng: any = '';
  finalremaininginhindi: any = '';
  openAdvanceOrderDrawer(data: any): void {
    this.Order = '';
    this.loadingRecords = true;
    if (
      data.FINAL_REMAINING_AMOUNT == null ||
      data.FINAL_REMAINING_AMOUNT == undefined ||
      data.FINAL_REMAINING_AMOUNT == 0 ||
      data.FINAL_REMAINING_AMOUNT == ''
    ) {
      this.message.info('Please Fill Advance Annexure Details First', '');
      this.loadingRecords = false;
    } else {
      this.orderdata = data;
      this.isAdvanceSameAsAdmissible = false;
      this.admissibleineng = '';
      this.admissibleinhindi = '';
      this.advadmissibleineng = '';
      this.advadmissibleinhindi = '';
      this.advanceineng = '';
      this.advanceinhindi = '';
      this.finaladmissibleineng = '';
      this.finaladmissibleinhindi = '';
      this.finalclaimedineng = '';
      this.finalclaimedinhindi = '';
      this.finalremainingineng = '';
      this.finalremaininginhindi = '';
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
              // this.loadingRecords = false;
            }
          },
          (err) => {}
        );
      this.api
        .getSignature(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND ID = ' + data.SIGNATURE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
              this.NAME = data['data'][0]['NAME'];
              this.NAME_HN = data['data'][0]['NAME_HN'];
              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
              this.POST = data['data'][0]['POST'];
              this.POST_HN = data['data'][0]['POST_HN'];
              // this.loadingRecords = false;
              // this.orderDrawerVisible = true;
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
      this.orderDrawerTitle = 'Order Details';
      this.Signaturearray = [];
      this.api
        .getHospitalMapping(0, 0, 'ID', 'ASC', ' AND CLAIM_ID = ' + data.ID)
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.HospitalMapping = data['data'];
              } else {
                this.HospitalMapping = [];
              }
              this.api
                .getSignature(0, 0, 'ID', 'desc', ' AND STATUS = 1 ')
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (
                        this.orderdata.ADMISSIBLE_AMOUNT == null ||
                        this.orderdata.ADMISSIBLE_AMOUNT == undefined ||
                        this.orderdata.ADMISSIBLE_AMOUNT == 'NaN'
                      ) {
                        this.orderdata.ADMISSIBLE_AMOUNT = 0;
                      } else {
                        this.orderdata.ADMISSIBLE_AMOUNT =
                          this.orderdata.ADMISSIBLE_AMOUNT;
                      }

                      if (
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == null ||
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == undefined ||
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT == 'NaN'
                      ) {
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT = 0;
                      } else {
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                      }

                      if (
                        this.orderdata.ADVANCE_AMOUNT == null ||
                        this.orderdata.ADVANCE_AMOUNT == undefined ||
                        this.orderdata.ADVANCE_AMOUNT == 'NaN'
                      ) {
                        this.orderdata.ADVANCE_AMOUNT = 0;
                      } else {
                        this.orderdata.ADVANCE_AMOUNT =
                          this.orderdata.ADVANCE_AMOUNT;
                      }

                      if (
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT == null ||
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT == undefined ||
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT == 'NaN'
                      ) {
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT = 0;
                      } else {
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                          this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                      }

                      if (
                        this.orderdata.FINAL_CLAIMED_AMOUNT == null ||
                        this.orderdata.FINAL_CLAIMED_AMOUNT == undefined ||
                        this.orderdata.FINAL_CLAIMED_AMOUNT == 'NaN'
                      ) {
                        this.orderdata.FINAL_CLAIMED_AMOUNT = 0;
                      } else {
                        this.orderdata.FINAL_CLAIMED_AMOUNT =
                          this.orderdata.FINAL_CLAIMED_AMOUNT;
                      }

                      if (
                        this.orderdata.FINAL_REMAINING_AMOUNT == null ||
                        this.orderdata.FINAL_REMAINING_AMOUNT == undefined ||
                        this.orderdata.FINAL_REMAINING_AMOUNT == 'NaN'
                      ) {
                        this.orderdata.FINAL_REMAINING_AMOUNT = 0;
                      } else {
                        this.orderdata.FINAL_REMAINING_AMOUNT =
                          this.orderdata.FINAL_REMAINING_AMOUNT;
                      }

                      if (
                        this.orderdata.FINAL_CLAIMED_AMOUNT != null &&
                        this.orderdata.FINAL_CLAIMED_AMOUNT != undefined &&
                        this.orderdata.FINAL_CLAIMED_AMOUNT != ''
                      ) {
                        let finclaimeng = toWords.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.FINAL_CLAIMED_AMOUNT =
                          this.orderdata.FINAL_CLAIMED_AMOUNT;
                        this.finalclaimedineng = toWords.convert(
                          this.orderdata.FINAL_CLAIMED_AMOUNT,
                          {
                            currency: true,
                          }
                        );

                        let finclaimhn = toWordsen.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.FINAL_CLAIMED_AMOUNT =
                          this.orderdata.FINAL_CLAIMED_AMOUNT;
                        this.finalclaimedinhindi = toWordsen.convert(
                          this.orderdata.FINAL_CLAIMED_AMOUNT,
                          {
                            currency: true,
                          }
                        );
                      } else {
                        this.finalclaimedinhindi = '';
                        this.finalclaimedineng = '';
                      }

                      if (
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT != null &&
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT != undefined &&
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT != ''
                      ) {
                        let finadmeng = toWords.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                          this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                        this.finaladmissibleineng = toWords.convert(
                          this.orderdata.FINAL_ADMISSIBLE_AMOUNT,
                          {
                            currency: true,
                          }
                        );

                        let finadmhn = toWordsen.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.FINAL_ADMISSIBLE_AMOUNT =
                          this.orderdata.FINAL_ADMISSIBLE_AMOUNT;
                        this.finaladmissibleinhindi = toWordsen.convert(
                          this.orderdata.FINAL_ADMISSIBLE_AMOUNT,
                          {
                            currency: true,
                          }
                        );
                      } else {
                        this.finaladmissibleineng = '';
                        this.finaladmissibleinhindi = '';
                      }

                      if (
                        this.orderdata.ADVANCE_AMOUNT != null &&
                        this.orderdata.ADVANCE_AMOUNT != undefined &&
                        this.orderdata.ADVANCE_AMOUNT != ''
                      ) {
                        let adveng = toWords.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.ADVANCE_AMOUNT =
                          this.orderdata.ADVANCE_AMOUNT;
                        this.advanceineng = toWords.convert(
                          this.orderdata.ADVANCE_AMOUNT,
                          {
                            currency: true,
                          }
                        );

                        let advhn = toWordsen.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.ADVANCE_AMOUNT =
                          this.orderdata.ADVANCE_AMOUNT;
                        this.advanceinhindi = toWordsen.convert(
                          this.orderdata.ADVANCE_AMOUNT,
                          {
                            currency: true,
                          }
                        );
                      } else {
                        this.advanceineng = '';
                        this.advanceinhindi = '';
                      }

                      if (
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != null &&
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != undefined &&
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT != ''
                      ) {
                        let advadmeng = toWords.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                        this.advadmissibleineng = toWords.convert(
                          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
                          {
                            currency: true,
                          }
                        );

                        let advadmhn = toWordsen.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT =
                          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT;
                        this.advadmissibleinhindi = toWordsen.convert(
                          this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT,
                          {
                            currency: true,
                          }
                        );
                      } else {
                        this.advadmissibleineng = '';
                        this.advadmissibleinhindi = '';
                      }

                      if (
                        this.orderdata.ADMISSIBLE_AMOUNT != null &&
                        this.orderdata.ADMISSIBLE_AMOUNT != undefined &&
                        this.orderdata.ADMISSIBLE_AMOUNT != ''
                      ) {
                        let admeng = toWords.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.ADMISSIBLE_AMOUNT =
                          this.orderdata.ADMISSIBLE_AMOUNT;
                        this.admissibleineng = toWords.convert(
                          this.orderdata.ADMISSIBLE_AMOUNT,
                          {
                            currency: true,
                          }
                        );

                        let admhn = toWordsen.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.ADMISSIBLE_AMOUNT =
                          this.orderdata.ADMISSIBLE_AMOUNT;
                        this.admissibleinhindi = toWordsen.convert(
                          this.orderdata.ADMISSIBLE_AMOUNT,
                          {
                            currency: true,
                          }
                        );
                      } else {
                        this.admissibleineng = '';
                        this.admissibleinhindi = '';
                      }

                      if (
                        this.orderdata.FINAL_REMAINING_AMOUNT != null &&
                        this.orderdata.FINAL_REMAINING_AMOUNT != undefined &&
                        this.orderdata.FINAL_REMAINING_AMOUNT != ''
                      ) {
                        let rem = toWords.convert(this.am, { currency: true });
                        this.orderdata.FINAL_REMAINING_AMOUNT =
                          this.orderdata.FINAL_REMAINING_AMOUNT;
                        this.finalremainingineng = toWords.convert(
                          this.orderdata.FINAL_REMAINING_AMOUNT,
                          {
                            currency: true,
                          }
                        );

                        let remhn = toWordsen.convert(this.am, {
                          currency: true,
                        });
                        this.orderdata.FINAL_REMAINING_AMOUNT =
                          this.orderdata.FINAL_REMAINING_AMOUNT;
                        this.finalremaininginhindi = toWordsen.convert(
                          this.orderdata.FINAL_REMAINING_AMOUNT,
                          {
                            currency: true,
                          }
                        );
                      } else {
                        this.finalremainingineng = '';
                        this.finalremaininginhindi = '';
                      }

                      if (
                        this.orderdata.ADVANCE_ADMISSIBLE_AMOUNT ==
                        this.orderdata.ADVANCE_AMOUNT
                      ) {
                        this.isAdvanceSameAsAdmissible = true;
                      } else {
                        this.isAdvanceSameAsAdmissible = false;
                      }

                      this.api
                        .GetMedicalSignature(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.orderdata.ID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              // if (data['data'].length > 0) {
                              //   this.orderSignatureData = data['data'][0];
                              // } else {
                              //   this.orderSignatureData =
                              //     new MedicalSignatureData();
                              // }

                              if (data['data'].length > 0) {
                                this.orderSignatureData = data['data'][0];
                                if (data['data'][0]['FINAL_ORDER_HEADER']) {
                                  this.orderSignatureData.FINAL_ORDER_HEADER =
                                    data['data'][0]['FINAL_ORDER_HEADER'];
                                } else {
                                  this.orderSignatureData.FINAL_ORDER_HEADER =
                                    '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
                                }
                              } else {
                                this.orderSignatureData =
                                  new MedicalSignatureData();

                                this.orderSignatureData.FINAL_ORDER_HEADER =
                                  '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
                              }

                              this.loadingRecords = false;
                              this.orderDrawerVisible = true;
                            } else {
                              this.orderSignatureData = [];
                              this.message.error('Something Went Wrong', '');
                              this.loadingRecords = false;
                            }
                          },
                          (err) => {}
                        );

                      this.Signaturearray = data['data'];
                      this.loadingRecords = false;
                      this.Order = 'AO';
                      // this.orderDrawerVisible = true;
                      this.Spin = false;
                    } else {
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    }
  }

  drawerAdvanceClaimVisible: boolean = false;
  drawerAdvanceClaimTitle: string = '';
  viewFileForAdvance(data: any): void {
    this.drawerAdvanceClaimTitle = 'View Advance Claim File';
    this.loadingRecords = true;
    this.drawerClaimData = Object.assign({}, data);
    this.finalremainingineng = '';
    this.finalremaininginhindi = '';
    this.advanceineng = '';
    this.advanceinhindi = '';
    this.SIGNNAME2 = '';
    this.NAME_HN2 = '';
    this.POST2 = '';
    this.POST2_HIN = '';
    this.OFFICE_NAME2 = '';
    this.OFFICE_NAME2_HIN = '';

    this.SIGNNAME3 = '';
    this.NAME_HN3 = '';
    this.POST3 = '';
    this.POST3_HIN = '';
    this.OFFICE_NAME3 = '';
    this.OFFICE_NAME3_HIN = '';

    this.SIGNNAME4 = '';
    this.NAME_HN4 = '';
    this.POST4 = '';
    this.POST4_HIN = '';
    this.OFFICE_NAME4 = '';
    this.OFFICE_NAME4_HIN = '';
    if (this.drawerClaimData.IS_ADVANCE_TAKEN == 1) {
      if (
        data.FINAL_REMAINING_AMOUNT != undefined &&
        data.FINAL_REMAINING_AMOUNT != null
      ) {
        this.finalremainingineng = toWords.convert(
          this.drawerClaimData.FINAL_REMAINING_AMOUNT,
          { currency: true }
        );

        let wordss = toWordsen.convert(this.am, { currency: true });
        data.FINAL_REMAINING_AMOUNT = data.FINAL_REMAINING_AMOUNT;
        this.finalremaininginhindi = toWordsen.convert(
          data.FINAL_REMAINING_AMOUNT,
          {
            currency: true,
          }
        );
      } else {
        this.finalremainingineng = '';
        this.finalremaininginhindi = '';
      }
    } else {
      if (data.ADVANCE_AMOUNT != undefined && data.ADVANCE_AMOUNT != null) {
        this.advanceineng = toWords.convert(
          this.drawerClaimData.ADVANCE_AMOUNT,
          { currency: true }
        );

        let wordss = toWordsen.convert(this.am, { currency: true });
        data.ADVANCE_AMOUNT = data.ADVANCE_AMOUNT;
        this.advanceinhindi = toWordsen.convert(data.ADVANCE_AMOUNT, {
          currency: true,
        });
      } else {
        this.advanceineng = '';
        this.advanceinhindi = '';
      }
    }
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        ' AND STATUS = 1 AND ID = ' + data.SIGNATURE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.api
              .getHospitalMapping(
                0,
                0,
                'NAME',
                'ASC',
                ' AND CLAIM_ID=' + this.drawerClaimData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.hospitallist = data['data'];
                    } else {
                      this.hospitallist = [];
                    }

                    this.api
                      .GetMedicalSignature(
                        0,
                        0,
                        '',
                        '',
                        ' AND CLAIM_ID = ' + this.drawerClaimData.ID
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              this.newClaimFileSignature = data['data'][0];

                              if (this.Signaturearray1.length > 0) {
                                if (
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_1 != null &&
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_1 !=
                                    undefined &&
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_1 != ''
                                ) {
                                  var f = this.Signaturearray1.filter(
                                    (item) =>
                                      item.ID ==
                                      this.newClaimFileSignature
                                        .CLAIM_CLAIM_FILE_SIGNATURE_1
                                  );
                                  if (f.length > 0) {
                                    this.SIGNNAME2 = f[0]['NAME'];
                                    this.NAME_HN2 = f[0]['NAME_HN'];
                                    this.POST2 = f[0]['POST'];
                                    this.POST2_HIN = f[0]['POST_HN'];
                                    this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
                                    this.OFFICE_NAME2_HIN =
                                      f[0]['OFFICE_NAME_HN'];
                                  } else {
                                    this.newClaimFileSignature.CLAIM_CLAIM_FILE_SIGNATURE_1 =
                                      null;
                                    this.SIGNNAME2 = '';
                                    this.NAME_HN2 = '';
                                    this.POST2 = '';
                                    this.POST2_HIN = '';
                                    this.OFFICE_NAME2 = '';
                                    this.OFFICE_NAME2_HIN = '';
                                  }
                                } else {
                                  this.SIGNNAME2 = '';
                                  this.NAME_HN2 = '';
                                  this.POST2 = '';
                                  this.POST2_HIN = '';
                                  this.OFFICE_NAME2 = '';
                                  this.OFFICE_NAME2_HIN = '';
                                }

                                if (
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_2 != null &&
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_2 !=
                                    undefined &&
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_2 != ''
                                ) {
                                  var f = this.Signaturearray1.filter(
                                    (item) =>
                                      item.ID ==
                                      this.newClaimFileSignature
                                        .CLAIM_CLAIM_FILE_SIGNATURE_2
                                  );
                                  if (f.length > 0) {
                                    this.SIGNNAME3 = f[0]['NAME'];
                                    this.NAME_HN3 = f[0]['NAME_HN'];
                                    this.POST3 = f[0]['POST'];
                                    this.POST3_HIN = f[0]['POST_HN'];
                                    this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
                                    this.OFFICE_NAME3_HIN =
                                      f[0]['OFFICE_NAME_HN'];
                                  } else {
                                    this.newClaimFileSignature.CLAIM_CLAIM_FILE_SIGNATURE_2 =
                                      null;
                                    this.SIGNNAME3 = '';
                                    this.NAME_HN3 = '';
                                    this.POST3 = '';
                                    this.POST3_HIN = '';
                                    this.OFFICE_NAME3 = '';
                                    this.OFFICE_NAME3_HIN = '';
                                  }
                                } else {
                                  this.SIGNNAME3 = '';
                                  this.NAME_HN3 = '';
                                  this.POST3 = '';
                                  this.POST3_HIN = '';
                                  this.OFFICE_NAME3 = '';
                                  this.OFFICE_NAME3_HIN = '';
                                }

                                if (
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_3 != null &&
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_3 !=
                                    undefined &&
                                  this.newClaimFileSignature
                                    .CLAIM_CLAIM_FILE_SIGNATURE_3 != ''
                                ) {
                                  var f = this.Signaturearray1.filter(
                                    (item) =>
                                      item.ID ==
                                      this.newClaimFileSignature
                                        .CLAIM_CLAIM_FILE_SIGNATURE_3
                                  );
                                  if (f.length > 0) {
                                    this.SIGNNAME4 = f[0]['NAME'];
                                    this.NAME_HN4 = f[0]['NAME_HN'];
                                    this.POST4 = f[0]['POST'];
                                    this.POST4_HIN = f[0]['POST_HN'];
                                    this.OFFICE_NAME4 = f[0]['OFFICE_NAME'];
                                    this.OFFICE_NAME4_HIN =
                                      f[0]['OFFICE_NAME_HN'];
                                  } else {
                                    this.newClaimFileSignature.CLAIM_CLAIM_FILE_SIGNATURE_3 =
                                      null;
                                    this.SIGNNAME4 = '';
                                    this.NAME_HN4 = '';
                                    this.POST4 = '';
                                    this.POST4_HIN = '';
                                    this.OFFICE_NAME4 = '';
                                    this.OFFICE_NAME4_HIN = '';
                                  }
                                } else {
                                  this.SIGNNAME4 = '';
                                  this.NAME_HN4 = '';
                                  this.POST4 = '';
                                  this.POST4_HIN = '';
                                  this.OFFICE_NAME4 = '';
                                  this.OFFICE_NAME4_HIN = '';
                                }
                              } else {
                                this.SIGNNAME2 = '';
                                this.NAME_HN2 = '';
                                this.POST2 = '';
                                this.POST2_HIN = '';
                                this.OFFICE_NAME2 = '';
                                this.OFFICE_NAME2_HIN = '';

                                this.SIGNNAME3 = '';
                                this.NAME_HN3 = '';
                                this.POST3 = '';
                                this.POST3_HIN = '';
                                this.OFFICE_NAME3 = '';
                                this.OFFICE_NAME3_HIN = '';

                                this.SIGNNAME4 = '';
                                this.NAME_HN4 = '';
                                this.POST4 = '';
                                this.POST4_HIN = '';
                                this.OFFICE_NAME4 = '';
                                this.OFFICE_NAME4_HIN = '';
                              }
                            } else {
                              this.newClaimFileSignature =
                                new MedicalSignatureData();
                            }

                            this.loadingRecords = false;
                            this.drawerAdvanceClaimVisible = true;
                          } else {
                            this.newClaimFileSignature = [];
                            this.message.error('Something Went Wrong', '');
                            this.loadingRecords = false;
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.loadingRecords = false;
                  }
                },
                (err) => {}
              );
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  drawerAdvanceClaimClose(): void {
    this.drawerAdvanceClaimVisible = false;
    this.search();
    this.getAllUsers();
  }
  getScrollConfig(): { x: string; y: string } {
    return !this.isAdmin
      ? { x: '6300px', y: '55vh' }
      : { x: '6520px', y: '55vh' };
  }

  Signaturearray1: any = [];
  SIGNATURE_ID1: any;
  SIGNATURE_ID2: any;
  SIGNNAME2: any;
  NAME_HN2: any;
  POST2: any;
  POST2_HIN: any;
  OFFICE_NAME2: any;
  OFFICE_NAME2_HIN: any;

  GET_SIGNATURE_IDS: any;

  SIGNNAME3: any;
  NAME_HN3: any;
  POST3: any;
  POST3_HIN: any;
  OFFICE_NAME3: any;
  OFFICE_NAME3_HIN: any;

  SIGNNAME4: any;
  NAME_HN4: any;
  POST4: any;
  POST4_HIN: any;
  OFFICE_NAME4: any;
  OFFICE_NAME4_HIN: any;

  getAllUsers() {
    if (
      this.GET_SIGNATURE_IDS !== null &&
      this.GET_SIGNATURE_IDS !== undefined
    ) {
      this.api
        .getSignature(
          0,
          0,
          'ID',
          'desc',
          // ' AND STATUS!=false AND ID in(' + this.GET_SIGNATURE_IDS + ')'
          ' AND STATUS = 1 AND DDO_ID=' +
            Number(sessionStorage.getItem('ddoId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Signaturearray1 = data['data'];
            }
          },
          (err) => {}
        );
    }
  }

  signature2(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
      this.SIGNNAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST2_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME2 = '';
      this.NAME_HN2 = '';
      this.POST2 = '';
      this.POST2_HIN = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME2_HIN = '';
    }
  }
  signature3(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
      this.SIGNNAME3 = f[0]['NAME'];
      this.NAME_HN3 = f[0]['NAME_HN'];
      this.POST3 = f[0]['POST'];
      this.POST3_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME3 = '';
      this.NAME_HN3 = '';
      this.POST3 = '';
      this.POST3_HIN = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME3_HIN = '';
    }
  }

  signature4(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
      this.SIGNNAME4 = f[0]['NAME'];
      this.NAME_HN4 = f[0]['NAME_HN'];
      this.POST4 = f[0]['POST'];
      this.POST4_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME4 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME4_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME4 = '';
      this.NAME_HN4 = '';
      this.POST4 = '';
      this.POST4_HIN = '';
      this.OFFICE_NAME4 = '';
      this.OFFICE_NAME4_HIN = '';
    }
  }

  drawerVisiblesign: boolean = false;
  opensignature() {
    this.drawerVisiblesign = true;
  }

  drawerClosesign(): void {
    this.drawerVisiblesign = false;
    this.getAllUsers();
  }
  get closeCallbacksign() {
    return this.drawerClosesign.bind(this);
  }
}
