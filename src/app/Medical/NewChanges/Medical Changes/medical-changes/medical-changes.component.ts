import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApplicantMaster } from 'src/app/Medical/Models/applicantmaster';
import { ClaimMaster } from 'src/app/Medical/Models/claimmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { ToWords } from 'to-words';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { HttpEventType } from '@angular/common/http';

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
  selector: 'app-medical-changes',
  templateUrl: './medical-changes.component.html',
  styleUrls: ['./medical-changes.component.css'],
})
export class MedicalChangesComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';
  totalButton: string = 'default';
  isFilterApplied: any = 'default';
  drawerData: ApplicantMaster = new ApplicantMaster();
  drawerData3: ClaimMaster = new ClaimMaster();
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;
  filename: string = 'Claim';

  formTitle = 'Employee Medical Claim Application';
  pageIndex = 1;
  pageSize = 20;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  size = 'small';

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

  employeeedit: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
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
      (err) => {}
    );
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
        ' AND IS_ADMIN_CLAIM = 0 AND INSPECTOR_ID = ' +
        Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 4) {
      this.userIdFilter =
        ' AND IS_ADMIN_CLAIM = 0 AND AO_ID = ' +
        Number(sessionStorage.getItem('userId'));
    } else if (Number(sessionStorage.getItem('roleId')) == 2) {
      this.userIdFilter =
        ' AND IS_ADMIN_CLAIM = 0 AND EMP_ID = ' +
        Number(sessionStorage.getItem('userId'));
    } else {
      this.userIdFilter = '';
    }
    this.isSpinning = true;
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
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];

            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          } else {
            this.message.error('Data Not Load', '');
            this.isSpinning = false;
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
    this.isdraweropended = false;
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
  new: boolean = false;
  getemployee(claimFor): void {
    this.showmodell = false;
    this.isSpinning = true;
    this.currentTab = 0;
    this.drawerTitle = 'Application for Medical Claim Reimburesment ';
    this.claimid = '';
    this.claimID = '';
    this.new = true;
    this.employeedata = this.userId;
    this.Hospitalclaim = [];
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.employeeedit)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.dataList = data['data'];
            this.drawerData3 = new ClaimMaster();
            this.drawerData = Object.assign({}, data['data'][0]);
            if (claimFor == 'adv') {
              this.drawerData['IS_APPLYING_FOR_ADVANCE'] = 1;
              this.drawerData.IS_ADVANCE_AMOUNT_CLAIMED = 0;
            } else {
              this.drawerData['IS_APPLYING_FOR_ADVANCE'] = 0;
              this.drawerData.IS_ADVANCE_AMOUNT_CLAIMED = 1;
            }
            if (
              this.drawerData.DESIGNATION_ID != null &&
              this.drawerData.DESIGNATION_ID != undefined &&
              this.drawerData.DESIGNATION_ID != ''
            ) {
              if (
                this.drawerData.DESIGNATION_ID == 6 ||
                this.drawerData.DESIGNATION_ID == 7 ||
                this.drawerData.DESIGNATION_ID == 8 ||
                this.drawerData.DESIGNATION_ID == 9 ||
                this.drawerData.DESIGNATION_ID == 11 ||
                this.drawerData.DESIGNATION_ID == 14 ||
                this.drawerData.DESIGNATION_ID == 15 ||
                this.drawerData.DESIGNATION_ID == 16 ||
                this.drawerData.DESIGNATION_ID == 38 ||
                this.drawerData.DESIGNATION_ID == 41 ||
                this.drawerData.DESIGNATION_ID == 49 ||
                this.drawerData.DESIGNATION_ID == 72
              ) {
                this.drawerData.ROLE_ID = 22;
              } else {
                this.drawerData.ROLE_ID = 38;
              }
            } else {
              this.drawerData.ROLE_ID = null;
            }
            this.isSpinning = false;
            this.employeedata = this.userId;

            this.drawerVisible = true;
          } else {
            this.message.error('Can,t Load Employee Information', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }
  empID;
  claimid: any;
  claimID;
  Hospitalclaim: any = [];
  drawerWidth: any = '100%';
  ClaimApplicationFor: any = [];
  edit(data: any): void {
    this.new = false;
    this.claimid = data.ID;
    this.claimID = data.ID;
    this.isSpinning = true;
    this.currentTab = 0;
    this.drawerTitle = 'Edit Application for Medical Claim Reimburesment ';
    this.drawerData.NAME = data.EMPLOYEE_NAME;
    this.drawerData.DESIGNATION_ID = data.DESIGNATION_ID;
    this.drawerData.OFFICE_NAME = data.OFFICE_NAME;
    this.drawerData.DDO_OF_THE_OFFICIAL = data.DDO_OF_THE_OFFICIAL;
    this.drawerData.EMPLOYEE_CODE = data.EMPLOYEE_CODE;
    this.drawerData.GRADE_PAY = data.GRADE_PAY;
    this.drawerData.EMAIL_ID = data.EMAIL_ID;
    this.drawerData.MOBILE_NO = data.MOBILE_NO;
    this.drawerData.BENEFICIARY_TYPE = data.BENEFICIARY_TYPE;
    this.drawerData.ADDRESS = data.ADDRESS;
    this.drawerData.CGHS_CARD_NO = data.CGHS_CARD_NO;
    this.drawerData.CGHS_CARD_VALIDITY = data.CGHS_CARD_VALIDITY;
    this.drawerData.ROLE_ID = data.ROLE_ID;
    this.drawerData.DDO_OF_THE_OFFICIAL_ID = data.DDO_OF_THE_OFFICIAL_ID;
    this.drawerData.SERVICE_TYPE = data.SERVICE_TYPE;
    this.employeedata = this.userId;
    this.isdraweropended = false;
    this.drawerData3 = Object.assign({}, data);
    //
    this.empID = data.EMP_ID;
    this.claimID = data.ID;
    this.Hospitalclaim = [];
    this.api
      .getHospitalMapping(0, 0, 'NAME', 'desc', ' AND CLAIM_ID=' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.Hospitalclaim = data['data'];
            } else {
              this.Hospitalclaim = [];
            }
            this.api.getAllRoles(0, 0, '', '', 'AND ID IN (22,38)').subscribe(
              (roleData) => {
                if (roleData['code'] == 200) {
                  if (roleData['data'].length > 0) {
                    this.ClaimApplicationFor = roleData['data'];
                  } else {
                    this.ClaimApplicationFor = [];
                  }
                  this.isSpinning = false;
                  this.drawerVisible = true;
                } else {
                  this.message.error("Can't Load Role Data", '');
                  this.isSpinning = false;
                  this.ClaimApplicationFor = [];
                }
              },
              (err) => {}
            );
          } else {
            this.isSpinning = false;
            this.Hospitalclaim = [];
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
        (err) => {}
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

  confirm(data: any, i: any) {
    data.CURRENT_STAGE_ID = 6;
    // this.api.updateClaim();
  }
  cancel(): void {}

  drawerClaimData: any;
  drawerClaimTitle: any = '';
  drawerClaimVisible: any = false;
  QUESTIONARIES: any;
  checkList: any;
  hospitallist: any = [];
  viewFile(data: any): void {
    this.drawerClaimTitle = 'View Claim File';
    this.drawerClaimData = Object.assign({}, data);
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

  search2(event: any) {
    this.pageIndex = event;
    this.search();
  }

  search3(event: any) {
    this.pageSize = event;
    this.search(true);
  }

  items: any[] = [1, 2, 3, 4];
  currentIndex = 0;
  loggedin = true;

  closeHelpModel() {
    this.loggedin = false;
  }

  nextSlide() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else {
      this.helpModalCancel();
    }
  }

  deleteCancel() {}
  printOrderModalVisible: boolean = false;
  helpModalCancel() {
    this.printOrderModalVisible = false;
    this.loggedin = false;
  }
  openHelpModel() {
    this.printOrderModalVisible = true;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  logs: any;
  logdata: any;
  showid: any;
  showstatus(event: any, i) {
    this.logdata = [];
    this.showid = i;

    this.api
      .getclaimLogs(0, 0, '', 'desc', ' AND CLAIM_ID=' + event.ID)
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
  addApply(claimFor): void {
    this.showmodell = false;
    this.isSpinning = true;
    this.currentTab = 0;
    this.drawerTitle = 'Application for Medical Claim Reimburesment ';
    this.claimid = '';
    this.claimID = '';
    this.new = true;
    this.isdraweropended = true;
    this.Hospitalclaim = [];
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.employeeedit)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (claimFor == 'adv') {
              this.drawerData['IS_APPLYING_FOR_ADVANCE'] = 1;
              this.drawerData.IS_ADVANCE_AMOUNT_CLAIMED = 0;
            } else { 
              this.drawerData['IS_APPLYING_FOR_ADVANCE'] = 0;
              this.drawerData.IS_ADVANCE_AMOUNT_CLAIMED = 1;
            }
            this.drawerData3 = new ClaimMaster();
            // this.dataList = data['data'];
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
            this.isSpinning = false;
            this.employeedata = this.userId;
            this.drawerVisible = true;
          } else {
            this.message.error('Can,t Load Employee Information', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }
  canceladvance() {
    this.openadvancemodel = false;
  }
  advancedata: any = [];
  openadvancemodel: boolean = false;
  filladvance(data: any) {
    this.openadvancemodel = true;
    this.advancedata = data;

    this.advancedata.OPD_TREATEMENT_AMOUNT = 0;
    this.advancedata.INDOOR_TREATEMENT_AMOUNT = 0;
    this.advancedata.TEST_OR_INVESTIGATION_AMOUNT = 0;

    // this.api
    //   .updateClaimWithoutHospitalData(data)
    //   .subscribe((successCode) => {
    //     if (successCode.code == '200') {
    //       this.message.success('Advance details Saved Successfully...', '');

    //     }  else {
    //       this.message.error('Information Has Not Saved...', '');
    //       this.isSpinning = false;
    //     }
    //   });
  }

  Spinningadvance = false;
  saveadvance() {
    if (
      this.advancedata.TREATMENT_START_DATE == null ||
      this.advancedata.TREATMENT_START_DATE == '' ||
      this.advancedata.TREATMENT_START_DATE == undefined
    ) {
      this.message.error('Please Select Treatment Start Date', '');
    } else if (
      this.advancedata.TREATMENT_END_DATE == null ||
      this.advancedata.TREATMENT_END_DATE == '' ||
      this.advancedata.TREATMENT_END_DATE == undefined
    ) {
      this.message.error('Please Select Treatment End Date', '');
    } else if (
      this.advancedata.OPD_TREATEMENT_AMOUNT == null ||
      this.advancedata.OPD_TREATEMENT_AMOUNT == undefined
    ) {
      this.message.error('Please Enter OPD Treatment Amount', '');
    } else if (
      this.advancedata.INDOOR_TREATEMENT_AMOUNT == null ||
      this.advancedata.INDOOR_TREATEMENT_AMOUNT == undefined
    ) {
      this.message.error('Please Enter Indoor Treatment Amount', '');
    } else if (
      this.advancedata.TEST_OR_INVESTIGATION_AMOUNT == null ||
      this.advancedata.TEST_OR_INVESTIGATION_AMOUNT == undefined
    ) {
      this.message.error('Please enter Test/Investigation Amount', '');
    } else if (
      this.advancedata.HOSPITAL_DISCHARGE_CARD == null ||
      this.advancedata.HOSPITAL_DISCHARGE_CARD == undefined ||
      this.advancedata.HOSPITAL_DISCHARGE_CARD == ''
    ) {
      this.message.error('Please Upload Hospital Discharge Card', '');
    } else {
      this.advancedata.TREATMENT_END_DATE = this.datePipe.transform(
        this.advancedata.TREATMENT_END_DATE,
        'yyyy-MM-dd'
      );
      this.advancedata.TREATMENT_START_DATE = this.datePipe.transform(
        this.advancedata.TREATMENT_START_DATE,
        'yyyy-MM-dd'
      );
      this.Spinningadvance = true;
      this.api
        .updateClaimWithoutHospitalData(this.advancedata)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Advance details Saved Successfully...', '');
            this.Spinningadvance = false;
            this.openadvancemodel = false;
            this.search();
          } else {
            this.message.error('Information Has Not Saved...', '');
            this.Spinningadvance = false;
          }
        });
    }
  }
  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.advancedata.TREATMENT_START_DATE)
    ) < 0;

  treatEndDate() {
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.advancedata.TREATMENT_START_DATE)
      ) < 0;
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

  opennnadvance(aa: any) {
    if (aa == 'apply') {
      this.addApply('adv');
    } else {
      this.getemployee('adv');
    }
  }

  opennnsimple(aa: any) {
    if (aa == 'apply') {
      this.addApply('sim');
    } else {
      this.getemployee('sim');
    }
  }

  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }

  progressBarHospitalDischargeCard: boolean = false;
  percentHospitalDischargeCard = 0;
  HospitalDischargeCard: any;
  HospitalDischargeCardurl: any;

  onFileSelectedHospitalDischargeCard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.HospitalDischargeCard = <File>event.target.files[0];

      if (this.HospitalDischargeCard != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.HospitalDischargeCard.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.HospitalDischargeCardurl = url;
        if (
          this.advancedata.HOSPITAL_DISCHARGE_CARD != undefined &&
          this.advancedata.HOSPITAL_DISCHARGE_CARD.trim() != ''
        ) {
          var arr = this.advancedata.HOSPITAL_DISCHARGE_CARD.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.advancedata.HOSPITAL_DISCHARGE_CARD = this.urllink3;
      this.progressBarHospitalDischargeCard = true;
      this.api
        .onUpload2(
          'hospitalDischargeCard',
          this.HospitalDischargeCard,
          this.HospitalDischargeCardurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentHospitalDischargeCard = percentDone;
            if (this.percentHospitalDischargeCard == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              ' Hospital Discharge Card Uploaded Successfully...',
              ''
            );
            this.advancedata.HOSPITAL_DISCHARGE_CARD =
              this.HospitalDischargeCardurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarHospitalDischargeCard = false;
            this.percentHospitalDischargeCard = 0;
            this.advancedata.HOSPITAL_DISCHARGE_CARD = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.HospitalDischargeCard = null;
      this.advancedata.HOSPITAL_DISCHARGE_CARD = null;
    }
  }

  viewHospitalDischargeCard(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'hospitalDischargeCard/' + pdfURL);
  }

  clearHospitalDischargeCard(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarHospitalDischargeCard = false;
    this.percentHospitalDischargeCard = 0;
    this.advancedata.HOSPITAL_DISCHARGE_CARD = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
}
