import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { ApplicantMaster } from 'src/app/Medical/Models/applicantmaster';
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
  selector: 'app-forwardmasterlist',
  templateUrl: './forwardmasterlist.component.html',
  styleUrls: ['./forwardmasterlist.component.css'],
})
export class ForwardmasterlistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  isApproveModalConfirmLoading: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';
  REFRED_RATE_LIST = '';
  drawerData: ApplicantMaster = new ApplicantMaster();

  userId = Number(sessionStorage.getItem('userId'));
  userName = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;

  formTitle = 'Manage Claims';
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
  newButton: any = 'default';
  forwardButton: any = 'default';
  rejectButton: any = 'default';
  queryButton: any = 'default';
  approvedButton: any = 'default';
  readyButton: any = 'default';
  totalButton: any = 'default';
  claimData: any;
  allClaimCount: any;
  allNewCount: any;
  allForwardCount: any;
  allRejectCount: any;
  allQueryCount: any;
  allApprovedCount: any;
  allReadyCount: any;
  columns: string[][] = [
    ['CLAIM_STAGE_NAME', ''],
    ['CLAIM_NO', ''],
    ['EMPLOYEE_NAME', ''],
    ['EMPLOYEE_CODE', ''],
    ['DESIGNATION', ''],
    ['PATIENT_NAME', ''],
    ['RELATION_WITH_PATIENT', ''],
    ['BILL_FILIING_DATE', ''],
    ['ADMISSIBLE_AMOUNT', ''],
    ['TREATMENT_START_DATE', ''],
    ['TREATMENT_END_DATE', ''],
    ['REJECT_REMARK', ''],
    ['MOBILE_NO', ''],
    ['EMPANELLED_HOSPITAL_NAME', ''],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME: any;
  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.BILL_FILIING_DATE = [];

    this.TYPE_OF_HOSPITAL = [];
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
    this.stageName();

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
    if (Number(sessionStorage.getItem('roleId')) == 3) {
      this.userIdFilter =
        ' AND INSPECTOR_ID = ' + Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 4) {
      this.userIdFilter =
        ' AND AO_ID = ' + Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 5) {
      this.userIdFilter =
        ' AND ITO_ID = ' + Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 6) {
      this.userIdFilter =
        ' AND JCIT_ID = ' + Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 7) {
      this.userIdFilter =
        ' AND CIT_ID = ' + Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 10) {
      this.userIdFilter =
        ' AND ZONAL_ID = ' + Number(sessionStorage.getItem('userId'));
    } else {
      this.userIdFilter = '';
    }
    this.loadingRecords = true;

    this.api
      .getClaimMasterCount(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.userIdFilter
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.allClaimCount = data['count'][0]['ALL_CLAIMS'];
          this.allNewCount = data['count'][0]['NEW'];
          this.allForwardCount = data['count'][0]['FORWARD'];
          this.allRejectCount = data['count'][0]['REJECTED'];
          this.allQueryCount = data['count'][0]['QUERY_RAISED'];
          this.allApprovedCount = data['count'][0]['APPROVED'];
          this.allReadyCount = data['count'][0]['READY'];
          // this.dataList = data['data'];
          //

          // this.isSpinning = false;
          // this.filterClass = 'filter-invisible';
        },
        (err) => {}
      );
    this.api
      .getclaimMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.userIdFilter + this.filterQuery + likeQuery,
        this.START_DATE,
        this.END_DATE,
        this.TYPE_OF_HOSPITAL,
        this.STAGE_NAME
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        },
        (err) => {}
      );
  }

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

    this.BILL_FILIING_DATE[0] = this.datePipe.transform(
      this.BILL_FILIING_DATE[0],
      'yyyy-MM-dd'
    );
    this.BILL_FILIING_DATE[1] = this.datePipe.transform(
      this.BILL_FILIING_DATE[1],
      'yyyy-MM-dd'
    );

    if (this.BILL_FILIING_DATE[0] != null) {
      this.START_DATE = this.BILL_FILIING_DATE[0];
    }

    if (this.BILL_FILIING_DATE[1] != null) {
      this.END_DATE = this.BILL_FILIING_DATE[1];
    }

    this.search();
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
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  currentStage: any;
  add(): void {
    this.drawerTitle = 'Create New Claim';
    this.drawerData = new ApplicantMaster();
    this.currentStage = 0;
    this.claimID = undefined;
    this.empID = undefined;
    this.drawerVisible = true;
  }

  empID;
  claimID;
  edit(data: any): void {
    this.currentStage = 0;
    this.drawerTitle = 'Edit Claim Details';
    this.drawerData = Object.assign({}, data);

    this.empID = data.EMP_ID;
    this.claimID = data.ID;
    this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    this.drawerData['DESIGNATION'] = this.drawerData['EMPLOYEE_DESIGNATION'];
    this.drawerData['OFFICE_NAME'] = this.drawerData['EMPLOYEE_OFFICE_NAME'];
    this.drawerData['DDO_OF_THE_OFFICIAL'] = this.drawerData['EMPLOYEE_DDO'];
    this.drawerData['EMPLOYEE_CODE'] = this.drawerData['EMPLOYEE_CODE'];
    this.drawerData['GRADE_PAY'] = this.drawerData['EMPLOYEE_GRADE_PAY'];

    this.drawerVisible = true;
  }
  orderDrawerVisible: boolean = false;
  orderDrawerTitle: string;
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
  am = 100;
  openOrderDrawer(data: any): void {
    if (data.ADMISSIBLE_AMOUNT == null || data.ADMISSIBLE_AMOUNT == undefined) {
      this.message.info('Please Fill Annexure Details First', '');
    } else {
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
  }

  orderDrawerClose(): void {
    this.orderDrawerVisible = false;
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
  openInvestigationDrawer(data: any): void {
    if (data != null || data != undefined) {
      this.claimData = data;
      this.investigationDrawerTitle = 'Create New Investigation';
      this.investigationDrawerData = new InvestigationMaster();
      this.citylist = [];

      // this.api.getCityMaster(0, 0, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
      //   (data) => {
      //     if (data['code'] == 200 && data['data'].length > 0)
      //       this.citylist = data['data'];
      //   },

      //   (err) => {}
      // );
      this.api
        .getannexture(
          0,
          0,
          'ID',
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
    } else {
    }
  }

  investigationDrawerClose(): void {
    this.investigationDrawerVisible = false;
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

  drawerClaimData: any;
  drawerClaimTitle = '';
  drawerClaimVisible = false;
  QUESTIONARIES: any;
  checkList: any;

  amountInwords = '';
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
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
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
  USER_ID;
  REMARK;

  openApproveModalHP(data) {
    this.selectedData = '';
    this.USER_ID = '';
    this.REMARK = '';
    this.isApproveVisible = true;
    this.selectedData = data;
    this.FileId = data.ID;
    this.loadAllUsers();
  }

  handleApproveCancel() {
    this.isApproveVisible = false;
  }
  data2 = new Object();
  handleApproveOk() {
    if (
      this.USER_ID == null ||
      this.USER_ID == '' ||
      this.USER_ID == undefined
    ) {
      this.message.error('Please Select Name.', '');
    } else {
      if (Number(sessionStorage.getItem('userId')) == 4) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 7,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: Number(sessionStorage.getItem('userId')),
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: this.selectedData.CIT_ID,
        };
      } else if (Number(sessionStorage.getItem('userId')) == 5) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 9,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: Number(sessionStorage.getItem('userId')),
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: this.selectedData.CIT_ID,
        };
      } else if (Number(sessionStorage.getItem('userId')) == 6) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 11,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: Number(sessionStorage.getItem('userId')),
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: this.selectedData.CIT_ID,
        };
      } else if (Number(sessionStorage.getItem('userId')) == 7) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 13,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: Number(sessionStorage.getItem('userId')),
        };
      } else if (Number(sessionStorage.getItem('userId')) == 10) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 13,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: Number(sessionStorage.getItem('userId')),
          CIT_ID: this.selectedData.CIT_ID,
        };
      }
      this.api.updateclaimed(this.data2).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Changed Successfully...', '');
          this.isApproveVisible = false;
          this.search();

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
    this.api.getAllUsers(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1').subscribe(
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

  isRejectByAOVisible = false;

  rejectByAO(data) {
    this.REMARK = '';
    this.selectedData = '';
    this.isRejectByAOVisible = true;
    this.selectedData = data;
    this.FileId = data.ID;
    // this.loadAllUsers();
  }

  handleRejectCancel() {
    this.isRejectByAOVisible = false;
  }

  handleRejectOk() {
    if (this.REMARK == null || this.REMARK == '' || this.REMARK == undefined) {
      this.message.error('Please Enter Remark.', '');
    } else {
      if (Number(sessionStorage.getItem('userId')) == 4) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 8,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: Number(sessionStorage.getItem('userId')),
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: this.selectedData.CIT_ID,
        };
      } else if (Number(sessionStorage.getItem('userId')) == 5) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 10,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: Number(sessionStorage.getItem('userId')),
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: this.selectedData.CIT_ID,
        };
      } else if (Number(sessionStorage.getItem('userId')) == 6) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 12,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: Number(sessionStorage.getItem('userId')),
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: this.selectedData.CIT_ID,
        };
      } else if (Number(sessionStorage.getItem('userId')) == 7) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 14,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: this.selectedData.ZONAL_ID,
          CIT_ID: Number(sessionStorage.getItem('userId')),
        };
      } else if (Number(sessionStorage.getItem('userId')) == 10) {
        this.data2 = {
          CLIENT_ID: 1,
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
            this.selectedData
              .IS_PRESCRIPTION_OF_MEDICINES_PURCHASED_FROM_OUTSIDE,
          BILL_FILIING_DATE: this.selectedData.BILL_FILIING_DATE,
          IS_BILL_FILLED_IN_TIME: this.selectedData.IS_BILL_FILLED_IN_TIME,
          AMOUNT_OF_REIMBUSMENT_CLAIMED:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_CLAIMED,
          AMOUNT_OF_REIMBUSMENT_ADMISSIBLE:
            this.selectedData.AMOUNT_OF_REIMBUSMENT_ADMISSIBLE,
          IS_ADVANCE_TAKEN: this.selectedData.IS_ADVANCE_TAKEN,
          ADVANCE_AMOUNT: this.selectedData.ADVANCE_AMOUNT,
          NET_AMOUNT_PAYABLE: this.selectedData.NET_AMOUNT_PAYABLE,
          CURRENT_STAGE_ID: 13,
          INSPECTOR_ID: this.selectedData.INSPECTOR_ID,
          REMARK: this.REMARK,
          SUB_STAGE: this.selectedData.SUB_STAGE,
          WARD_TYPE: this.selectedData.WARD_TYPE,
          BANK_ACCOUNT_NO: this.selectedData.BANK_ACCOUNT_NO,
          CLAIM_ACCREDITATION: this.selectedData.CLAIM_ACCREDITATION,
          PATIENT_CGHS_BENEFICIERY_NO:
            this.selectedData.PATIENT_CGHS_BENEFICIERY_NO,
          AO_ID: this.selectedData.AO_ID,
          JCIT_ID: this.selectedData.JCIT_ID,
          ITO_ID: this.selectedData.ITO_ID,
          ZONAL_ID: Number(sessionStorage.getItem('userId')),
          CIT_ID: this.selectedData.CIT_ID,
        };
      }
      this.api.updateclaimed(this.data2).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Changed Successfully...', '');
          this.isApproveVisible = false;
          this.search();

          this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Changed...', '');
          this.isSpinning = false;
          this.isApproveVisible = true;
        }
      });
    }
  }
}
