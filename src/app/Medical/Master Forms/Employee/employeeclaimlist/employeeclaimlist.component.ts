import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApplicantMaster } from 'src/app/Medical/Models/applicantmaster';
import { ClaimMaster } from 'src/app/Medical/Models/claimmaster';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';

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
  selector: 'app-employeeclaimlist',
  templateUrl: './employeeclaimlist.component.html',
  styleUrls: ['./employeeclaimlist.component.css'],
  providers: [NzNotificationService]
})
export class EmployeeclaimlistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';
  totalButton: string = 'default';
  isFilterApplied: any = 'default';
  newButton: string = 'default';
  forwardButton: string = 'default';
  rejectButton: string = 'default';
  approvedButton: string = 'default';
  readyButton: string = 'default';
  queryButton: string = 'default';
  drawerData: ApplicantMaster = new ApplicantMaster();
  drawerData3: ClaimMaster = new ClaimMaster();
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;
  filename: string = 'Claim';

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
  allClaimCount: any;
  allNewCount: any;
  allForwardCount: any;
  allRejectCount: any;
  allQueryCount: any;
  allApprovedCount: any;
  allReadyCount: any;

  claimData: any;
  columns: string[][] = [
    ['CLAIM_NO', 'Claim No'],
    ['PATIENT_NAME', ' Applicant Name'],
    ['EMPLOYEE_NAME', '  Applicant Name'],
    ['EMPLOYEE_CODE', ' Employee Code'],
    ['EMPLOYEE_DESIGNATION', 'Employee Designation'],
    ['RELATION_WITH_PATIENT', 'Patient Relation'],
    ['BILL_FILIING_DATE', 'Bill Filling Date'],
    ['ADMISSIBLE_AMOUNT', 'Admissible Amount(₹)'],
    ['TREATEMENT_TYPE', 'Treatment Type'],
    ['TREATMENT_START_DATE', 'Treatment Start Date'],
    ['TREATMENT_END_DATE', 'Treatment End Date'],
    ['ACCREDITATION', 'Accrediation'],
    ['HOSPITAL_TYPE', 'Hospital Type'],
    ['HOSPITAL_NAME', 'Hospital Name'],
    ['WARD_TYPE', 'Ward Entitlement'],
    ['NATURE_OF_TREATMENT', ' Nature Of Treatment'],
    ['CHECKLIST_STATUS', 'Accept / Reject'],
    ['REMARK', 'Remark'],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME: any;
  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.BILL_FILIING_DATE = [];
    this.BILL_FILIING_DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.BILL_FILIING_DATE[1] = new Date();
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
  current = new Date();

  EMPLOYEE_MASTER = [
    {
      ID: 1,
      CURRENT_STAGE_NAME: 'Claim Info Verified',
      NAME_OF_APPLICATION: 'Mr Arun.A Poojari',
      DESIGNATION_OFFICE: 'Tax Assistant., O/o,Addl.CIT Rg-12(1), Mumbai',
      DDO_OFFICIAL: 'DDO Walfare & SG, Mumbai',
      EMP_CODE_NO: '148534',
      PATIENTS_RELATION: 'Wife-Mrs. Triveni.A Poojari-4424362',
      CGHS_OR_CS: 'CGHS',
      IS_EMERGENCY_TREATMENT: 'YES',
      DATE_OF_CGHS: 'NA',
      DATE_OF_BILL: '14-12-2022',
      IS_BILLFIELD: 'YES',
      NAME_OF_HOSPITAL: 'Galaxy Multispeciality Hospital, Mumbai',
      TREATMENT_NATURE:
        'Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ',
      TREATMENT_PERIOD: '20-11-2022 to 23-11-2022',
      REIMBURSMENT_CLAIMED: 'Rs.35,683',
      REIMBURSMENT_ADMISSIBLE: 'Rs.35,683',
      ADVANCE_TACKEN: 'NIL',
      NET_AMOUNT_PAYABLE: 'Rs.35,683/- ',
    },
    {
      ID: 2,
      CURRENT_STAGE_NAME: 'Application Submitted',
      NAME_OF_APPLICATION: 'Mr Vishal Mane',
      DESIGNATION_OFFICE: 'Tax Assistant., O/o,Addl.CIT Rg-12(1), Mumbai',
      DDO_OFFICIAL: 'DDO Walfare & SG, Mumbai',
      EMP_CODE_NO: '148534',
      PATIENTS_RELATION: 'Mother-Mrs. Rama B Mane-3424222',
      CGHS_OR_CS: 'CGHS',
      IS_EMERGENCY_TREATMENT: 'YES',
      DATE_OF_CGHS: 'NA',
      DATE_OF_BILL: '09-05-2022',
      IS_BILLFIELD: 'YES',
      NAME_OF_HOSPITAL: 'Galaxy Multispeciality Hospital, Mumbai',
      TREATMENT_NATURE:
        'Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ',
      TREATMENT_PERIOD: '20-04-2022 to 23-04-2022',
      REIMBURSMENT_CLAIMED: 'Rs.20,183',
      REIMBURSMENT_ADMISSIBLE: 'Rs.20,183',
      ADVANCE_TACKEN: 'NIL',
      NET_AMOUNT_PAYABLE: 'Rs.20,183/- ',
    },
    {
      ID: 3,
      CURRENT_STAGE_NAME: 'Claim Rejected',
      NAME_OF_APPLICATION: 'Mr Rahul Kate',
      DESIGNATION_OFFICE: 'Senior office., O/o,Addl.CIT Rg-12(1), Mumbai',
      DDO_OFFICIAL: 'DDO Walfare & SG, Mumbai',
      EMP_CODE_NO: '233233',
      PATIENTS_RELATION: 'Self-Mr. Rahul Kate-323535',
      CGHS_OR_CS: 'CGHS',
      IS_EMERGENCY_TREATMENT: 'YES',
      DATE_OF_CGHS: 'NA',
      DATE_OF_BILL: '23-09-2022',
      IS_BILLFIELD: 'YES',
      NAME_OF_HOSPITAL: 'Galaxy Multispeciality Hospital, Mumbai',
      TREATMENT_NATURE:
        'Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ',
      TREATMENT_PERIOD: '12-09-2022 to 20-09-2022',
      REIMBURSMENT_CLAIMED: 'Rs.23,333',
      REIMBURSMENT_ADMISSIBLE: 'Rs.23,333',
      ADVANCE_TACKEN: 'NIL',
      NET_AMOUNT_PAYABLE: 'Rs.23,333/- ',
    },
    {
      ID: 4,
      CURRENT_STAGE_NAME: 'Approved',
      NAME_OF_APPLICATION: 'Mr Ajit Kumar',
      DESIGNATION_OFFICE: 'Tax Assistant., O/o,Addl.CIT Rg-12(1), Mumbai',
      DDO_OFFICIAL: 'DDO Walfare & SG, Mumbai',
      EMP_CODE_NO: '564322',
      PATIENTS_RELATION: 'Father-Mr. Vijay B Kumar-4363463',
      CGHS_OR_CS: 'CGHS',
      IS_EMERGENCY_TREATMENT: 'YES',
      DATE_OF_CGHS: 'NA',
      DATE_OF_BILL: '22-01-2022',
      IS_BILLFIELD: 'YES',
      NAME_OF_HOSPITAL: 'Galaxy Multispeciality Hospital, Mumbai',
      TREATMENT_NATURE:
        'Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ',
      TREATMENT_PERIOD: '03-01-2022 to 07-01-2022',
      REIMBURSMENT_CLAIMED: 'Rs.45,683',
      REIMBURSMENT_ADMISSIBLE: 'Rs.45,683',
      ADVANCE_TACKEN: 'NIL',
      NET_AMOUNT_PAYABLE: 'Rs.45,683/- ',
    },
  ];
  employeeedit: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.employeeedit = sessionStorage.getItem('userId');
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
      (err) => {

      }
    );
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

  keyup(event: any) {
    this.search();
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
    } else if (Number(sessionStorage.getItem('roleId')) == 2) {
      this.userIdFilter =
        ' AND EMP_ID = ' + Number(sessionStorage.getItem('userId'));
    } else {
      this.userIdFilter = '';
    }
    this.loadingRecords = true;

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
        (err) => {

        }
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

    // if (this.SALES_MANAGER_ID != undefined) {
    //   // this.SALES_MANAGER_ID = this.SALES_MANAGER_ID;
    // }
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
    this.currentTab = 0;
    this.isSpinning = false;
    this.drawerVisible = false;
    this.search();
    // window.location.reload();
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // add(): void {
  //   this.drawerTitle = 'Create New Employee';
  //   this.drawerData = new ApplicantMaster();
  //   this.drawerVisible = true;
  // }

  currentTab;
  getemployee(): void {
    this.isSpinning = true;
    this.currentTab = 0;
    this.drawerTitle = 'Add New Claim ';

    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.employeeedit)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.dataList = data['data'];
            this.drawerData = Object.assign({}, data['data'][0]);
            this.isSpinning = false;
            this.drawerVisible = true;
          } else {
            this.message.error('Can,t Load Employee Information', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );
  }
  empID;
  claimid: any;
  claimID;
  Hospitalclaim: any = [];
  edit(data: any): void {
    this.claimid = data.ID;
    this.isSpinning = false;
    this.currentTab = 0;
    this.drawerTitle = 'Edit Claim Details';
    // this.drawerData = Object.assign({}, data);
    this.api
      .getHospitalMapping(0, 0, 'NAME', 'desc', ' AND CLAIM_ID=' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.Hospitalclaim = data['data'];

          // this.investigationDrawerData.CLAIM_HOSPITAL_MAPPING_ID = this.hospitallist[0]['ID']
        },

        (err) => {

        }
      );
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.employeeedit)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.dataList = data['data'];
            this.drawerData = Object.assign({}, data['data'][0]);
            // this.drawerVisible = true;
          } else {
            this.message.error('Can,t Load Employee Information', '');
          }
        },
        (err) => {

        }
      );

    this.empID = data.EMP_ID;
    this.claimID = data.ID;
    this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    this.drawerVisible = true;
  }
  orderDrawerVisible: boolean = false;
  orderDrawerTitle: string;
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
  am = 100;


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
  openInvestigationDrawer(data: any): void {
    this.claimData = data;
    this.investigationDrawerTitle = 'Create New Investigation';
    this.investigationDrawerData = new InvestigationMaster();

    this.api
      .getannexture(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS=1 AND CLAIM_ID=' + this.claimData.ID
      )
      .subscribe(
        (data) => {
          this.showlayoutDataList = data['data'];

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

  LOGS1: any = [];
  type;
  logData: any = [];
  FILE_OR_CLAIM: boolean = false;
  openLogDrawer(data): void {

    this.LOGS1 = data;
    this.drawerLogTitle = 'Claim Log Details';
    this.FILE_OR_CLAIM = false;
    this.filename = this.LOGS1['FILE_NUMBER'];
    this.api
      .getclaimLogs(0, 0, 'ID', 'asc', ' AND CLAIM_ID = ' + data.ID)
      .subscribe(
        (userData1) => {
          if (userData1['count'] == 0) {
            this.logData = [];
          } else {
            this.logData = userData1['data'];
          }
        },
        (err) => {

        }
      );
    this.drawerLogVisible = true;
    this.type = 'e';
  }

  drawerLogClose(): void {
    this.search();
    this.drawerLogVisible = false;
  }

  get closeLogCallback() {
    return this.drawerLogClose.bind(this);
  }

  // applyStageFilter(stageId: string) {
  //   var filterId = stageId.split(',');
  //   var filterQuery = ' AND (';
  //   for (var i = 0; i < filterId.length; i++) {
  //     filterQuery = filterQuery + ' CURRENT_STAGE_ID =' + filterId[i] + ' OR ';
  //   }
  //   filterQuery = filterQuery.substring(0, filterQuery.length - 3) + ')';
  //   this.filterQuery = this.filterQuery + filterQuery;

  //   // this.applyFilter();
  // }

  confirm(data: any, i: any) {
    data.CURRENT_STAGE_ID = 6;
    // this.api.updateClaim();
  }
  cancel(): void { }

  drawerClaimData: any;
  drawerClaimTitle: any = '';
  drawerClaimVisible: any = false;
  QUESTIONARIES: any;
  checkList: any;
  hospitallist: any = [];

  SECTION_TYPE: any;
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
    this.api
      .getSignature(0, 0, 'ID', 'desc', ' AND ID = ' + data.SIGNATURE_ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
          }
        },
        (err) => {

        }
      );
    this.api
      .getHospitalMapping(0, 0, 'NAME', 'ASC', ' AND CLAIM_ID=' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.hospitallist = data['data'];
        },
        (err) => {

        }
      );
    this.drawerClaimVisible = true;
  }
  drawerClaimClose(): void {
    this.drawerClaimVisible = false;
  }

  get closeClaimCallback() {
    return this.drawerClaimClose.bind(this);
  }

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
      .save(this.filename + '_' + datef + '_' + dates + '.pdf');
  }

  drawerClose1(): void {
    this.drawerLogVisible = false;
    this.search(); // window.location.reload();
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
}
