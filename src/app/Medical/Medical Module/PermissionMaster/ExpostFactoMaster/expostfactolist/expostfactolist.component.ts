import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ExpostFactoMaster } from 'src/app/Medical/Models/ExpostFactoMaster';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { MedicalSignatureData } from 'src/app/Medical/Models/MedicalSignature';
import { ClaimMaster } from 'src/app/Medical/Models/claimmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-expostfactolist',
  templateUrl: './expostfactolist.component.html',
  styleUrls: ['./expostfactolist.component.css'],
})
export class ExpostfactolistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';

  drawerData: ExpostFactoMaster = new ExpostFactoMaster();
  // data: ClaimMaster = new ClaimMaster();
  userId = Number(sessionStorage.getItem('userId'));
  userName = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;

  formTitle = 'Expost Facto List';
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
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['PATIENT_NAME', 'PATIENT_NAME'],
    ['RELATION_WITH_PATIENT', 'RELATION_WITH_PATIENT'],
    ['BILL_FILIING_DATE', 'BILL_FILIING_DATE'],
    ['TREATEMENT_TYPE', 'TREATEMENT_TYPE'],
    ['TREATMENT_START_DATE', 'TREATMENT_START_DATE'],
    ['TREATMENT_END_DATE', 'TREATMENT_END_DATE'],
    ['WARD_TYPE', 'WARD_TYPE'],
    ['NATURE_OF_TREATMENT', 'NATURE_OF_TREATMENT'],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME: any;
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
  current = new Date();
  rejectClaimVisible: boolean = false;
  isAdmin: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    // this.stageName();
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  stages = [];
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
    if (!this.isAdmin) {
      var extraFilterQuery =
        '  AND INSPECTOR_ID = ' + this.userId + ' AND ROLE_ID = ' + this.roleId;
    } else {
      // this.extraFilterQuery = "AND LTC_STATUS != 'P' ";
      var extraFilterQuery = ' ';
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
      .getExpostFactoMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery + likeQuery + extraFilterQuery
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
    if (this.BILL_FILIING_DATE.length > 0) {
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

      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.search();
    } else {
      this.message.error('Please Select Date', '');
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
  expostFactoID: any;
  add(): void {
    this.drawerTitle = 'Create New Expost Facto Permission';
    this.drawerData = new ExpostFactoMaster();
    this.currentStage = 0;
    this.isSpin = false;

    this.claimID = '';
    this.empID = '';
    this.currentStageID = '';
    this.expostFactoID = '';
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
  edit(data: any): void {
    this.drawerTitle = 'Edit Expost Facto Permission Details';
    this.drawerData = Object.assign({}, data);
    this.expostFactoID = '';
    this.expostFactoID = this.drawerData.ID;
    // this.isSpin = false;
    // this.empID = this.drawerData.EMP_ID;
    // this.claimID = this.drawerData.ID;
    // this.currentStageID = this.drawerData.CURRENT_STAGE_ID;

    // this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    // this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    // this.drawerData['DESIGNATION'] = this.drawerData['EMPLOYEE_DESIGNATION'];
    // this.drawerData['OFFICE_NAME'] = this.drawerData['EMPLOYEE_OFFICE_NAME'];
    // this.drawerData['DDO_OF_THE_OFFICIAL'] = this.drawerData['EMPLOYEE_DDO'];
    // this.drawerData['EMPLOYEE_CODE'] = this.drawerData['EMPLOYEE_CODE'];
    // this.drawerData['GRADE_PAY'] = this.drawerData['EMPLOYEE_GRADE_PAY'];
    // // this.drawerData['EMAIL_ID'] = this.drawerData['EMPLOYEE_NAME'];
    // // this.drawerData['MOBILE_NO'] = this.drawerData['EMPLOYEE_NAME'];
    // // this.drawerData['BENEFICIARY_TYPE'] = this.drawerData['BENEFICIARY_TYPE'];
    // // this.drawerData['ADDRESS'] = this.drawerData['EMPLOYEE_NAME'];
    // // this.drawerData['CGHS_CARD_NO'] = this.drawerData['EMPLOYEE_NAME'];
    // // this.drawerData['CGHS_CARD_VALIDITY'] = this.drawerData['EMPLOYEE_NAME'];
    // this.currentStage = 0;
    this.drawerVisible = true;
  }
  orderDrawerVisible: boolean = false;
  orderDrawerTitle: string;
  orderdata: any = new ClaimMaster();
  amountinwords: any;
  amountinwordsh: any;
  am = 100;
  fileList = [];
  HospitalMapping = [];

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
  showlayoutDataList = [];
  total = 0;
  total1 = 0;
  citylist = [];
  hospitallist = [];
  ACCREDITATION = '';
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
            this.total1 = Math.round(this.total1);
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
  drawerLogData = [];

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
    };
    this.api.deleteExPostFactoMaster(data1).subscribe((successCode) => {
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
  NAME: any;
  NAME_HN: any;
  OFFICE_NAME: any;
  OFFICE_NAME_HN: any;
  POST: any;
  POST_HN: any;

  drawerClaimClose(): void {
    this.drawerClaimVisible = false;
  }

  get closeClaimCallback() {
    return this.drawerClaimClose.bind(this);
  }

  fileName: string = 'Claim';
  pdfDownload: boolean = false;

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
  users = [];
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

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }
  expostOrderVisible: boolean = false;
  expostOrderTitle: string = '';
  queData: any = [];
  orderdata1: any = [];
  empID1;
  claimID1;
  expostOrderSignatureData: any = [];
  orderDrawer(data) {
    this.loadingRecords = true;
    this.expostOrderTitle = 'Expost Facto Order';
    this.expostDrawerData = Object.assign({}, data);
    if (
      this.expostDrawerData.EXPOST_REASON == null ||
      this.expostDrawerData.EXPOST_REASON == undefined ||
      this.expostDrawerData.EXPOST_REASON == ''
    ) {
      this.expostDrawerData.EXPOST_REASON =
        'In this instant case, referral was taken/not taken from the CGHS Doctor but the treatment has been taken at Empanelled /Non Empanelled hospital.';
    }

    if (
      this.expostDrawerData.SIGNATURE_ID != undefined &&
      this.expostDrawerData.SIGNATURE_ID != null
    ) {
      this.api
        .getSignature(
          0,
          0,
          'ID',
          'desc',
          ' AND ID = ' + this.expostDrawerData.SIGNATURE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
              // this.NAME = data['data'][0]['NAME'];
              // this.NAME_HN = data['data'][0]['NAME_HN'];
              // this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              // this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
              // this.POST = data['data'][0]['POST'];
              // this.POST_HN = data['data'][0]['POST_HN'];
              this.loadingRecords = false;
              this.expostOrderVisible = true;
            } else {
              this.loadingRecords = true;
            }
          },
          (err) => {}
        );
    } else {
      // this.loadingRecords = false;
      // this.expostOrderVisible = true;
    }
    this.api
      .getHospitalMapping(
        0,
        0,
        '',
        '',
        ' AND EXPOST_FACTO_ID = ' + this.expostDrawerData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.HospitalMapping = data['data'];

            this.api
              .GetMedicalSignature(
                0,
                0,
                '',
                '',
                ' AND EXPOST_ID = ' + this.expostDrawerData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.expostOrderSignatureData = data['data'][0];
                    } else {
                      this.expostOrderSignatureData =
                        new MedicalSignatureData();
                    }
                    this.loadingRecords = false;
                    this.expostOrderVisible = true;
                  } else {
                    this.expostOrderSignatureData = [];
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
    this.claimID1 = 0;
    this.empID1 = 0;
    // this.api
    // .getclaimMaster(
    //   0,
    //   0,
    //   '',
    //   '',
    //   ' AND HOD_ID=' + data.ID,
    //   '',
    //   '',
    //   '',
    //   ''
    // )
    // .subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.orderdata1 = data['data'][0];
    //       this.claimID1 = data['data'][0]['ID'];
    //       this.empID1 = data['data'][0]['EMP_ID'];

    //       this.api
    //         .getSignature(
    //           0,
    //           0,
    //           'ID',
    //           'desc',
    //           ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
    //         )
    //         .subscribe(
    //           (data) => {
    //             if (data['code'] == 200) {
    //               this.SECTION_TYPE =
    //                 data['data'][0]['SECTION_TYPE'];
    //             }
    //           },
    //           (err) => {
    //
    //           }
    //         );
    //       this.api
    //         .getHospitalMapping(
    //           0,
    //           0,
    //           '',
    //           'desc',
    //           ' AND CLAIM_ID = ' + this.claimID
    //         )
    //         .subscribe(
    //           (data) => {
    //             if (data['code'] == 200) {
    //               this.HospitalMapping = data['data'];

    //               // this.isSpinning = false;
    //               this.api
    //                 .getAllQuestions(
    //                   0,
    //                   0,
    //                   '',
    //                   '',
    //                   ' AND CLAIM_ID =' + this.claimID
    //                 )
    //                 .subscribe(
    //                   (data) => {
    //                     if (data['code'] == 200) {
    //                       if (data['data'].length == 0) {
    //                         this.queData = new QuestionaryMaster();
    //                       } else {
    //                         this.queData = data['data'][0];
    //                         if (
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_DATE ==
    //                             undefined &&
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_DATE == null &&
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_DATE == '' &&
    //                           this.queData.CGHS_AMA_REFERENCE_DATE
    //                             .length == 0
    //                         ) {
    //                           this.queData.CGHS_AMA_REFERENCE_DATE =
    //                             [];
    //                         } else {
    //                           this.queData.CGHS_AMA_REFERENCE_DATE =
    //                             this.queData.CGHS_AMA_REFERENCE_DATE.split(
    //                               ','
    //                             );
    //                         }
    //                         if (
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_END_DATE ==
    //                             undefined &&
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_END_DATE ==
    //                             null &&
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_END_DATE ==
    //                             '' &&
    //                           this.queData
    //                             .CGHS_AMA_REFERENCE_END_DATE
    //                             .length == 0
    //                         ) {
    //                           this.queData.CGHS_AMA_REFERENCE_END_DATE =
    //                             [];
    //                         } else {
    //                           this.queData.CGHS_AMA_REFERENCE_END_DATE =
    //                             this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
    //                               ','
    //                             );
    //                         }
    //                       }
    // this.expostOrderVisible = true;

    //                     } else {
    //                       this.message.error(
    //                         'Something Went Wrong',
    //                         ''
    //                       );
    //                       this.isSpinning = false;
    //                     }
    //                   },
    //                   (err) => {
    //
    //                   }
    //                 );
    //             } else {
    //               this.message.error('Something Went Wrong', '');
    //               // this.isSpinning = false;
    //             }
    //           },
    //           (err) => {
    //
    //           }
    //         );
    //     } else {
    //       this.message.error("Can't Load Data", '');
    //     }
    //   },
    //   (err) => {
    //
    //   }
    // );
  }
  get expostOrderSheetCloseCallback() {
    return this.expostOrderDrawerClose.bind(this);
  }
  expostOrderDrawerClose(): void {
    this.expostOrderVisible = false;
    this.search();
  }

  expostLetterVisible: boolean = false;
  expostLetterTitle: string = '';
  expostDrawerData: any = new ExpostFactoMaster();
  expostLetterSignatureData: any = [];
  letterDrawer(data) {
    this.loadingRecords = true;
    this.expostLetterTitle = 'Expost Facto Permission Letter ';
    this.expostDrawerData = Object.assign({}, data);
    if (this.expostDrawerData.LETTER_HEADER) {
      this.expostDrawerData.LETTER_HEADER = this.expostDrawerData.LETTER_HEADER;
    } else {
      this.expostDrawerData.LETTER_HEADER =
        '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
    }
    if (
      this.expostDrawerData.SIGNATURE_ID != undefined &&
      this.expostDrawerData.SIGNATURE_ID != null
    ) {
      this.api
        .getSignature(
          0,
          0,
          'ID',
          'desc',
          ' AND ID = ' + this.expostDrawerData.SIGNATURE_ID
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
              this.expostLetterVisible = true;
            } else {
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
      // this.loadingRecords = false;
      // this.expostLetterVisible = true;
    }
    this.api
      .getHospitalMapping(
        0,
        0,
        '',
        '',
        ' AND EXPOST_FACTO_ID = ' + this.expostDrawerData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.HospitalMapping = data['data'];
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );

    this.api
      .GetMedicalSignature(
        0,
        0,
        '',
        '',
        ' AND EXPOST_ID = ' + this.expostDrawerData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.expostLetterSignatureData = data['data'][0];
            } else {
              this.expostLetterSignatureData = new MedicalSignatureData();
            }
            this.loadingRecords = false;
            this.expostLetterVisible = true;
          } else {
            this.expostLetterSignatureData = [];
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );

    this.claimID1 = 0;
    this.empID1 = 0;
    this.SECTION_TYPE = '';
  }
  get letterSheetCloseCallback() {
    return this.expostLetterDrawerClose.bind(this);
  }
  expostLetterDrawerClose(): void {
    this.expostLetterVisible = false;
    this.search();
  }
}
