import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DelayCondonationMaster } from 'src/app/Medical/Models/DelayCondonationMaster';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-generatedelaycondonationlist',
  templateUrl: './generatedelaycondonationlist.component.html',
  styleUrls: ['./generatedelaycondonationlist.component.css'],
})
export class GeneratedelaycondonationlistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';

  drawerData: DelayCondonationMaster = new DelayCondonationMaster();
  // data: ClaimMaster = new ClaimMaster();
  userId = Number(sessionStorage.getItem('userId'));
  userName = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;

  formTitle = 'Delay Condonation Permission List';
  pageIndex = 1;
  pageSize = 10;
  @Input() totalRecords = 1;
  @Input() dataList: any = [];
  @Input() loadingRecords = false;
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
  @Input() delayCondonationID;
  @Input() empID;
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
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    // this.stageName();

    this.search();
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
  empFilter: any;
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
    if (this.empID != undefined && this.empID != null && this.empID != '') {
      this.empFilter = ' AND EMP_ID =' + this.empID;
    } else {
      this.empFilter = '';
    }
    this.api
      .getDelayCondolationMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.empFilter + this.filterQuery + likeQuery
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
  employeeID: any;
  employee = [];
  add(): void {
    this.drawerTitle = 'Create New Delay Condonation Permission';
    this.employeeID = this.empID;
    this.currentStage = 0;
    this.isSpin = false;

    if (this.empID != undefined && this.empID != null && this.empID != '') {
      this.api
        .getEmployeeMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND ID =' + this.empID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.employee = data['data'];
              // this.filteredOptions = this.employee;
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
          },
          (err) => {}
        );
    } else {
    }
    this.drawerData = new DelayCondonationMaster();
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

  claimID;
  currentStageID;
  edit(data: any): void {
    this.drawerTitle = 'Edit Delay Condonation Permission Details';
    this.drawerData = Object.assign({}, data);

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
  orderdata: any;
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
      EMP_ID: data.EMP_ID,
    };
    this.api.deleteDelayCondolationMaster(data1).subscribe((successCode) => {
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
  hodOrderVisible: boolean = false;
  hodOrderTitle: string = '';
  queData: any = [];
  orderdata1: any = [];
  empID1;
  claimID1;
  dateBetweenDiff: any;
  sixMonthDate: any;
  orderDrawer(data) {
    this.hodOrderTitle = 'HOD Permission Order';
    this.hodOrderVisible = true;
    this.queData = Object.assign({}, data);
    this.HospitalMapping = Object.assign({}, data);
    this.orderdata1 = Object.assign({}, data);
    this.claimID1 = 0;
    this.empID1 = 0;
    this.sixMonthDate = 0;
    this.dateBetweenDiff = 0;
    this.SECTION_TYPE = '';
  }
  get hodorderSheetCloseCallback() {
    return this.hodOrderDrawerClose.bind(this);
  }
  hodOrderDrawerClose(): void {
    this.hodOrderVisible = false;
    this.search();
  }

  hodLetterVisible: boolean = false;
  hodLetterTitle: string = '';
  letterDrawer(data) {
    this.hodLetterVisible = true;
    this.hodLetterTitle = 'HOD Permission Letter ';
    this.queData = Object.assign({}, data);
    this.HospitalMapping = Object.assign({}, data);
    this.orderdata1 = Object.assign({}, data);
    this.claimID1 = 0;
    this.empID1 = 0;
    this.sixMonthDate = 0;
    this.dateBetweenDiff = 0;
    this.SECTION_TYPE = '';
  }
  get letterSheetCloseCallback() {
    return this.hodLetterDrawerClose.bind(this);
  }
  hodLetterDrawerClose(): void {
    this.hodLetterVisible = false;
    this.search();
  }
  close(): void {
    this.drawerClose();
  }
}
