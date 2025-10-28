import { Component, HostListener, Input, OnInit } from '@angular/core';
import { EmpTransferData } from 'src/app/Modal/employeeQuarterForm';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import * as html2pdf from 'html2pdf.js';
import { Router } from '@angular/router';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
import { differenceInCalendarDays, setHours } from 'date-fns';
@Component({
  selector: 'app-employee-transfer-drawer',
  templateUrl: './employee-transfer-drawer.component.html',
  styleUrls: ['./employee-transfer-drawer.component.css'],
})
export class EmployeeTransferDrawerComponent implements OnInit {
  @Input() drawerClose: any = Function;
  @Input() data: any = EmpTransferData;
  @Input()
  drawerVisible: boolean = false;
  loadingRecords: boolean = false;
  totalRecords: number = 10;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortValue: string = 'desc';
  sortKey: string = 'NAME';
  searchText: string = '';
  datToDisplay: Date = new Date();
  mobpattern = /^[6-9]\d{9}$/;
  olddata: any = [];
  ID: any;
  OTP: any;
  isVerifiedOTP: boolean = false;
  isOTPModalVisible: boolean = false;
  loading: boolean = false;
  Employeelist: any = [];
  loadEmployee: boolean = false;
  EMP_NAME: any;
  ReqBuildinglist: any = [];
  ReqBuildinglistforfilter: any = [];
  ReqBuildinglist2: any = [];
  ReqBuildinglist3: any = [];
  ReqBuildinglist4: any = [];
  ReqBuildinglist5: any = [];
  ReqOfficelist1: any = [];
  ReqOfficelist2: any[] = [];
  ReqOfficelist3: any[] = [];
  ReqOfficelist4: any[] = [];
  ReqOfficelist5: any[] = [];
  ReqOfficelistcurrent: any = [];
  Designationlist: any = [];
  loadDesignation: boolean = false;
  loadBuilding: boolean = false;
  isModalVisible: boolean = false;
  isModalVisible1: boolean = false;
  isModalVisibleonaddd: boolean = false;
  loadOffice1: boolean = false;
  loadOffice2: boolean = false;
  loadOffice3: boolean = false;
  loadOffice4: boolean = false;
  loadOffice5: boolean = false;
  loadOfficeCurrent: boolean = false;
  AttachmentURL;
  showAttachments: boolean = true;
  percent: any = 0;
  progressBar: any = false;
  timer5: any;
  isSpinning = false;
  isSpinningCom = false;
  REQ_OFFICE_ID: any;
  REQ_BUILDING_ID: any;
  Requested: any = [];
  istruname: boolean = false;
  istrucode: boolean = false;
  istruemail: boolean = false;
  istrumobile: boolean = false;
  EMP_CODE: any;
  currentYear: any;
  nextYear: any;
  loaddrawer: boolean = false;
  dataListOfficeCat: any = [];
  gradepaynotnull: boolean = true;
  scrHeight: any;
  scrWidth: any;
  Dwidth: any;
  details: any = [];
  officed1: any = [];
  officed2: any = [];
  officed3: any = [];
  officed4: any = [];
  officed5: any = [];

  officeOptions1: any[] = [
    { value: 'Audit / Judicial', label: 'Audit / Judicial' },
    { value: 'Central Charges', label: 'Central Charges' },
    { value: 'CIT/Add. CIT Appeals', label: 'CIT/Add. CIT Appeals' },
    { value: 'DDO Charges', label: 'DDO Charges' },
    { value: 'DDO Gazetted', label: 'DDO Gazetted' },
    { value: 'Exemption / TDS', label: 'Exemption / TDS' },
    { value: 'Faceless Charges', label: 'Faceless Charges' },
    { value: 'Headquarters', label: 'Headquarters' },
    { value: 'Investigation Wing', label: 'Investigation Wing' },
    { value: 'IT & TP', label: 'IT & TP' },
    { value: 'Jurisdiction Charges', label: 'Jurisdiction Charges' },
    { value: 'NADT-RC / MSTU', label: 'NADT-RC / MSTU' },
    { value: 'Other Charges', label: 'Other Charges' },
  ];
  OTP1 = '';
  isagreedisable: boolean = false;
  OTP11 = '';
  otpSpinning = false;
  NAME: any;
  MOBILE_NO: any;
  DESIGNATION: any;
  GRADE_PAY_LEVEL: any;
  POSTED_CITY_ID: any;
  PAN_CARD: any;
  GRADE_PAY: any;
  GRASS_GRADE_PAY: any;
  EMPLOYEE_CODE: any;
  APPROVAL_STATUS: any;
  ID_PROOF: any;
  mobilev = false;
  showforgot = false;
  PASS = '';
  CPASS = '';
  design_IDS: any;
  design_IDS1: any = [];
  GradePay_ID: any;
  GradePay_ID1: any = [];
  gradepayData: any = [];
  pass1: boolean = false;
  pass2: boolean = false;
  pass3: boolean = false;
  pass4: boolean = false;
  pass11: boolean = false;
  showforgot1: boolean = false;
  showforgot2: boolean = false;
  timerMobile: boolean = false;
  showforgot3: boolean = false;
  fieldTextType: boolean = false;
  fsendOtp: boolean = false;
  statedata;
  EMAIL_ID;
  PASSWORD;
  PHONE;
  isOk: boolean = true;
  isSpinninggg: { [key: number]: boolean } = {};
  dataofpdf: any = [];
  dataofpdf1: any = [];
  isSpinning11: boolean;
  loadattach: boolean = false;
  loaddataOtp: boolean = false;
  DESIGNATION_NAME: any;
  classdata: any = '';
  loadingconfotp: boolean = false;
  showTimer = false;
  timerMobile1: any;
  myInterval2: any;
  drawerVisible1s = false;
  drawerDatas: any = [];
  drawerTitles: string = 'Add Employee Details';
  addnew: boolean = false;
  drawerDatapersonal: any = [];
  empstatus: any = [
    {
      IS_ACR_FILLED: 0,
      IS_ADDITIONAL_FILLED: 0,
      IS_ADDRESS_FILLED: 0,
      IS_EDUCATION_FILLED: 0,
      IS_EXAM_FILLED: 0,
      IS_FAMILY_FILLED: 0,
      IS_IPR_FILLED: 0,
      IS_OPTIONAL_FILLED: 0,
      IS_PERSONAL_FILLED: 0,
      IS_POSTING_FILLED: 0,
      IS_PROMOTION_FILLED: 0,
      IS_SERVICE_FILLED: 0,
      IS_TRAINING_FILLED: 0,
    },
  ];

  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  constructor(
    private api: WebsiteService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private router: Router
  ) {
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '90%';
    }
  }

  ngOnInit() {
    this.EMP_CODE = sessionStorage.getItem('Empcode');
    this.EMP_CODE = this.EMP_CODE.replace(/["\\]/g, '');
    this.officed1 = this.officeOptions1;
    this.officed2 = this.officeOptions1;
    this.officed3 = this.officeOptions1;
    this.officed4 = this.officeOptions1;
    this.officed5 = this.officeOptions1;
    const today: any = new Date();
    this.nextYear = today.getFullYear() - 1;
    this.currentYear = today.getFullYear().toString().slice(-2);
    // this.data.DESIGNATION = null;
    // this.data.REQ_BUILDING_ID = null;
    // this.data.REQ_OFFICE_ID = null;
    // this.data.REQ_BUILDING_ID_2 = null;
    // this.data.REQ_OFFICE_ID_2 = null;
    // this.data.REQ_BUILDING_ID_3 = null;
    // this.data.REQ_OFFICE_ID_3 = null;
    // this.data.SUMMARY_OF_TRANSFER = '';
    // this.data.ATTACHMENTS = null;
    // this.data.REQ_BUILDING_ID_5 = null;
    // this.data.REQ_BUILDING_ID_4 = null;
    // this.data.REQ_OFFICE_ID_5 = null;
    // this.data.REQ_OFFICE_ID_4 = null;
    // this.data.CURRENT_OFFICE_ID = null;
    // this.data.REASON_FOR_TRANSFER = null;
    // this.data.SPEND_DAY_IN_OFFICE = null;
    // this.data.ADDRESS = '';
    // this.data.APAR_DATE = '';
    // this.data.IPR_FILLING_DATE = '';
    this.showTimer = false;
    this.isVerifiedOTP = false;
    this.progressBar = false;
    if (this.data.ID) {
      if (this.data.ATTACHMENTS != null && this.data.ATTACHMENTS != undefined) {
        this.gradepaynotnull = false;
      } else {
        this.gradepaynotnull = true;
      }
    }
    this.GetDesignationData();
    this.GetReqBuildingData();

    if (
      sessionStorage.getItem('userName') != null &&
      sessionStorage.getItem('userName') != '' &&
      sessionStorage.getItem('userName') != undefined
    ) {
      var dd: any = sessionStorage.getItem('userName');
      this.data.EMPLOYEE_NAME = dd;
      this.istruname = true;
    } else {
      this.istruname = false;
    }
    if (
      sessionStorage.getItem('Empcode') != null &&
      sessionStorage.getItem('Empcode') != '' &&
      sessionStorage.getItem('Empcode') != undefined
    ) {
      var dq1: any = sessionStorage.getItem('Empcode');
      this.data.EMP_NO = dq1;
      this.istrucode = true;
    } else {
      this.istrucode = false;
    }
    if (
      sessionStorage.getItem('emailId') != null &&
      sessionStorage.getItem('emailId') != '' &&
      sessionStorage.getItem('emailId') != undefined
    ) {
      var dd1: any = sessionStorage.getItem('emailId');
      this.data.EMAIL_ID = dd1;
      this.istruemail = true;
    } else {
      this.istruemail = false;
    }

    if (
      sessionStorage.getItem('loginmobileNo') != null &&
      sessionStorage.getItem('loginmobileNo') != '' &&
      sessionStorage.getItem('loginmobileNo') != undefined
    ) {
      var dd2: any = sessionStorage.getItem('loginmobileNo');
      this.data.MOBILE_NO = dd2;
      this.istrumobile = true;
    } else {
      this.istrumobile = false;
    }
  }
  close() {
    this.drawerClose();
  }
  officeidtrue = false;
  rankidtrue = false;
  officecategoryget() {
    this.api
      .getofficeCategoryData(0, 0, 'ID', 'desc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataListOfficeCat = data['data'];
        } else {
          this.dataListOfficeCat = [];
        }
      });
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  closeModal1() {
    this.OTP = '';
    this.OTP1 = '';
    this.OTP11 = '';
    this.MOBILE_NO = '';
    this.PAN_CARD = '';
    this.APPROVAL_STATUS = '';
    this.DESIGNATION = '';
    this.design_IDS1 = '';
    this.design_IDS = '';
    this.GradePay_ID = '';
    this.GradePay_ID1 = '';
    this.EMPLOYEE_CODE = '';
    this.EMAIL_ID = '';
    this.GRADE_PAY = '';
    this.GRASS_GRADE_PAY = '';
    this.GRADE_PAY_LEVEL = '';
    this.PASSWORD = '';
    this.statedata = '';
    this.POSTED_CITY_ID = '';
    this.NAME = '';
    this.showforgot1 = false;
    this.showforgot2 = false;
    this.showforgot3 = false;
    this.pass3 = false;
    this.pass4 = false;
    this.pass11 = false;
    this.fieldTextType = false;
    this.CPASS = '';
    this.PASS = '';
    this.PHONE = '';
    this.fsendOtp = false;
    this.timerMobile = false;
    this.pass1 = false;
    this.pass2 = false;
    this.isagreedisable = true;
  }

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  printt(data: any): void {
    const id = data.ID;
    this.isSpinninggg[id] = true;
    this.api
      .getAlltransferRequestnew(
        1,
        1,
        '',
        '',
        " AND APPLICATION_NO='" + data.APPLICATION_NO + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            const today: any = new Date();
            this.nextYear = today.getFullYear() - 1;
            this.currentYear = today.getFullYear().toString().slice(-2);
            this.dataofpdf = data['data'][0];
            this.isSpinninggg[id] = false;
            this.openpdf();
          } else {
            this.isSpinninggg[id] = false;
            this.message.error('Server Not Found', '');
          }
        },
        (err) => {
          this.isSpinninggg[id] = false;
          this.message.error('Server Not Found', '');
        }
      );
  }

  closeModal11() {
    this.isModalVisible1 = false;
  }
  closeModaladd() {
    this.isModalVisibleonaddd = false;
    this.data = new EmpTransferData();
    this.data.ATTACHMENTS = null;
    this.progressBar = false;
  }

  AllFilters() {
    this.isSpinning11 = true;
  }

  GetReqOfficeData1(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    } else {
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    }
  }
  GetReqOfficeData2(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    } else {
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    }
  }
  GetReqOfficeData3(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    } else {
      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    }
  }
  GetReqOfficeData4(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
    } else {
      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );
    }
  }
  GetReqOfficeData5(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != BuildingID &&
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    } else {
      this.ReqBuildinglist4 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID2 &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_2 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_5
      );

      this.ReqBuildinglist5 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.ID != this.data.REQ_BUILDING_ID &&
          element.ID != this.data.REQ_BUILDING_ID_3 &&
          element.ID != this.data.REQ_BUILDING_ID_4 &&
          element.ID != this.data.REQ_BUILDING_ID_2
      );
    }
  }

  officengchange1(BuildingID: number) {
    if (BuildingID != null) {
      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    } else {
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    }
  }
  officengchange2(BuildingID: number) {
    if (BuildingID != null) {
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    } else {
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    }
  }
  officengchange3(BuildingID: number) {
    if (BuildingID != null) {
      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    } else {
      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    }
  }
  officengchange4(BuildingID: number) {
    if (BuildingID != null) {
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
    } else {
      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );
    }
  }
  officengchange5(BuildingID: number) {
    if (BuildingID != null) {
      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    } else {
      this.officed4 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_2 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_5
      );

      this.officed5 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.REQ_OFFICE_ID &&
          element.value != this.data.REQ_OFFICE_ID_3 &&
          element.value != this.data.REQ_OFFICE_ID_4 &&
          element.value != this.data.REQ_OFFICE_ID_2
      );
    }
  }

  GetReqOffice1Change(d: any) {
    var selectedProduct = this.ReqOfficelist1.filter(
      (element: any) => element.ID == d
    );
    if (selectedProduct != null || selectedProduct != undefined) {
      this.data.OFFICE_CATEGORY = selectedProduct[0].OFFICE_CATEGORY_ID;
    }
  }

  GetReqOffice2Change(d: any) {
    var selectedProduct = this.ReqOfficelist2.filter(
      (element: any) => element.ID == d
    );
    if (selectedProduct != null || selectedProduct != undefined) {
      this.data.OFFICE_CATEGORY_2 = selectedProduct[0].OFFICE_CATEGORY_ID;
    }
  }

  GetReqOffice3Change(d: any) {
    var selectedProduct = this.ReqOfficelist3.filter(
      (element: any) => element.ID == d
    );
    if (selectedProduct != null || selectedProduct != undefined) {
      this.data.OFFICE_CATEGORY_3 = selectedProduct[0].OFFICE_CATEGORY_ID;
    }
  }

  GetReqOffice4Change(d: any) {
    var selectedProduct = this.ReqOfficelist4.filter(
      (element: any) => element.ID == d
    );
    if (selectedProduct != null || selectedProduct != undefined) {
      this.data.OFFICE_CATEGORY_4 = selectedProduct[0].OFFICE_CATEGORY_ID;
    }
  }

  GetReqOffice5Change(d: any) {
    var selectedProduct = this.ReqOfficelist5.filter(
      (element: any) => element.ID == d
    );
    if (selectedProduct != null || selectedProduct != undefined) {
      this.data.OFFICE_CATEGORY_5 = selectedProduct[0].OFFICE_CATEGORY_ID;
    }
  }

  findTitleByKey(items: any, key: any): string | undefined {
    for (const item of items) {
      if (item.ID === key) {
        return item.NAME;
      }
    }

    return undefined;
  }

  GetDesignationData() {
    this.loadDesignation = true;
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID IN(11,17,44,22,21,20,25,19,12,39,40,16,13) '
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Designationlist = data['data'];
            this.loadDesignation = false;
            var dd2: any = sessionStorage.getItem('rankid');
            var selectedProduct = this.Designationlist.filter(
              (element: any) => element.MDB_ID == dd2
            );

            this.data.DESIGNATION = dd2;
            if (selectedProduct.length > 0) {
              this.rankidtrue = true;
              this.data.DESIGNATION = selectedProduct[0].MDB_ID;
            } else {
              this.rankidtrue = false;
              this.data.DESIGNATION = null;
            }
          } else {
            this.message.error('Failed To Get Cadre Data ', '');
            this.Designationlist = [];
            this.loadDesignation = false;
          }
        },
        (err) => {
          this.Designationlist = [];
          this.loadDesignation = false;
        }
      );
  }

  GetReqBuildingData() {
    this.loadBuilding = true;

    this.api
      .getAllBuildingforTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ReqBuildinglist = data['data'];
              this.ReqBuildinglistforfilter = data['data'];
              this.ReqBuildinglist2 = data['data'];
              this.ReqBuildinglist3 = data['data'];
              this.ReqBuildinglist4 = data['data'];
              this.ReqBuildinglist5 = data['data'];
              this.loadBuilding = false;
            } else {
              this.ReqBuildinglist = [];
              this.loadBuilding = false;
            }
          } else {
            this.message.error('Failed To Get Building Data', '');
            this.ReqBuildinglist = [];
            this.loadBuilding = false;
          }
        },
        (err) => {
          this.ReqBuildinglist = [];
          this.loadBuilding = false;
        }
      );

    this.loadOfficeCurrent = true;
    this.api
      .getAllOfficeForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1  AND MDB_ID is not NULL'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ReqOfficelistcurrent = data['data'];

              if (
                sessionStorage.getItem('officeid') != null &&
                sessionStorage.getItem('officeid') != '' &&
                sessionStorage.getItem('officeid') != undefined
              ) {
                var dd2: any = sessionStorage.getItem('officeid');
                var selectedProduct = this.ReqOfficelistcurrent.filter(
                  (element: any) => element.MDB_ID == dd2
                );

                this.data.CURRENT_OFFICE_ID = dd2;
                if (selectedProduct.length > 0) {
                  this.officeidtrue = true;
                  this.data.CURRENT_OFFICE_ID = selectedProduct[0].MDB_ID;
                } else {
                  this.officeidtrue = false;
                  this.data.CURRENT_OFFICE_ID = null;
                }
                // this.officeidtrue = true;
              } else {
                this.officeidtrue = false;
              }

              this.loadOfficeCurrent = false;
            } else {
              this.loadOfficeCurrent = false;
            }
          } else {
            this.loadOfficeCurrent = false;
          }
        },
        (err) => {
          this.loadOfficeCurrent = false;
        }
      );
  }

  onFileSelectAttachments(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      ) {
        if (file.size <= 1 * 1024 * 1024) {
          this.isSpinning = true;
          this.AttachmentURL = file;

          if (this.AttachmentURL != null) {
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.AttachmentURL.name.split('.').pop();
            var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
            this.data.ATTACHMENTS = '';
            this.data.ATTACHMENTS = d == null ? '' : d + number + '.' + fileExt;
          }

          this.progressBar = true;
          this.loadattach = true;

          this.timer5 = this.api
            .onUploadAttachments(
              'transferReqFiles',
              this.AttachmentURL,
              this.data.ATTACHMENTS
            )
            .subscribe(
              (res) => {
                if (res.type === HttpEventType.Response) {
                  this.loadattach = false;
                } else if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  this.percent = percentDone;

                  if (this.percent == 100) {
                    this.isSpinning = false;
                    this.loadattach = false;
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed To Upload File...', '');
                  this.isSpinning = false;
                  this.progressBar = false;
                  this.loadattach = false;

                  this.percent = 0;
                  this.data.ATTACHMENTS = null;
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('File Uploaded Successfully...', '');
                    this.showAttachments = false;
                    this.loadattach = false;

                    this.isSpinning = false;
                  } else {
                    this.message.error('Failed To Upload File...', '');
                    this.showAttachments = true;
                    this.loadattach = false;
                    this.data.ATTACHMENTS = null;
                    this.percent = 0;
                    this.progressBar = false;
                  }
                }

                if (this.data.ATTACHMENTS != null) {
                  this.gradepaynotnull = false;
                } else {
                  this.gradepaynotnull = true;
                }
              },
              (error) => {
                this.loadattach = false;
              }
            );

          event.target.value = null;
        } else {
          this.showAttachments = true;
          this.data.ATTACHMENTS = null;
          this.percent = 0;
          this.progressBar = false;
          this.message.info(
            'Select only PDF, JPEG, or PNG file less than 1 MB',
            ''
          );
        }
      } else {
        this.showAttachments = true;
        this.data.ATTACHMENTS = null;
        this.percent = 0;
        this.progressBar = false;
        this.message.info('Select only PDF, JPEG, or PNG file', '');
      }
    }
  }

  clearAttachments() {
    this.data.ATTACHMENTS = null;
    this.showAttachments = true;
    this.gradepaynotnull = true;
    this.percent = 0;
    this.progressBar = false;
  }

  print(): void {
    this.api
      .getAlltransferRequestnew(
        1,
        1,
        '',
        '',
        " AND APPLICATION_NO='" + this.data.APPLICATION_NO + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataofpdf = data['data'][0];
            this.openpdf();
          } else {
            this.message.error('Server Not Found', '');
          }
        },
        (err) => {
          this.message.error('Server Not Found', '');
        }
      );
  }

  closeModal() {
    this.isModalVisible = false;
    this.isModalVisibleonaddd = false;
    this.isVerifiedOTP = false;
  }
  StartTimerMobile2() {
    this.showTimer = true;
    this.timerMobile1 = 0;
    this.myInterval2 = setInterval(() => {
      if (this.timerMobile1 == 180) {
        clearInterval(this.myInterval2);
        this.showTimer = false;
      } else {
        this.showTimer = true;
        this.timerMobile1++;
      }
    }, 1000);
  }

  isValidEmail(email: string) {
    const expression =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return expression.test(String('' + email).toLowerCase());
  }
  isValidMobile(mobile: string) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }
  ConfirmRequest() {
    this.isOk = true;
    this.showTimer = false;
    if (
      this.data.DESIGNATION == 51 ||
      this.data.DESIGNATION == 52 ||
      this.data.DESIGNATION == 27 ||
      this.data.DESIGNATION == 18
    ) {
      if (
        this.data.EMPLOYEE_NAME == null ||
        this.data.EMPLOYEE_NAME == undefined ||
        this.data.EMPLOYEE_NAME == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Employee Name', '');
      } else if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Email ID', '');
      } else if (!this.isValidEmail(this.data.EMAIL_ID)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Email ID', '');
      } else if (this.data.EMP_NO == null || this.data.EMP_NO == undefined) {
        this.isOk = false;
        this.message.error('Please Enter Employee Code', '');
      } else if (
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Mobile No.', '');
      } else if (!this.isValidMobile(this.data.MOBILE_NO)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Mobile No.', '');
      } else if (
        this.data.DESIGNATION == null ||
        this.data.DESIGNATION == undefined ||
        this.data.DESIGNATION == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Cadre', '');
      } else if (
        this.data.CURRENT_OFFICE_ID == null ||
        this.data.CURRENT_OFFICE_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Office', '');
      } else if (
        this.data.SPEND_DAY_IN_OFFICE == null ||
        this.data.SPEND_DAY_IN_OFFICE == undefined ||
        this.data.SPEND_DAY_IN_OFFICE == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Period Spent In Current Office', '');
      } else if (
        this.data.ADDRESS == null ||
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Address Details', '');
      } else if (
        this.data.REQ_OFFICE_ID == null ||
        this.data.REQ_OFFICE_ID == undefined ||
        this.data.REQ_OFFICE_ID == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 1', '');
      } else if (
        this.data.REQ_OFFICE_ID_2 == null ||
        this.data.REQ_OFFICE_ID_2 == undefined ||
        this.data.REQ_OFFICE_ID_2 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 2', '');
      } else if (
        this.data.REQ_OFFICE_ID_3 == null ||
        this.data.REQ_OFFICE_ID_3 == undefined ||
        this.data.REQ_OFFICE_ID_3 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 3', '');
      } else if (
        this.data.REQ_OFFICE_ID_4 == null ||
        this.data.REQ_OFFICE_ID_4 == undefined ||
        this.data.REQ_OFFICE_ID_4 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 4', '');
      } else if (
        this.data.REQ_OFFICE_ID_5 == null ||
        this.data.REQ_OFFICE_ID_5 == undefined ||
        this.data.REQ_OFFICE_ID_5 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 5', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == null ||
        this.data.REASON_FOR_TRANSFER == undefined ||
        this.data.REASON_FOR_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Reason Type', '');
      } else if (
        this.data.SUMMARY_OF_TRANSFER == null ||
        this.data.SUMMARY_OF_TRANSFER == undefined ||
        this.data.SUMMARY_OF_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Reason For Transfer Request', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == 'Medical' &&
        (this.data.ATTACHMENTS == null ||
          this.data.ATTACHMENTS == undefined ||
          this.data.ATTACHMENTS == '')
      ) {
        this.isOk = false;
        this.message.error('Please Upload The Attachment', '');
      }
      //  else if ((this.data.DESIGNATION != 22 && this.data.DESIGNATION != 36 && this.data.DESIGNATION != 43 && this.data.DESIGNATION != 75 && this.data.DESIGNATION != 39 && this.data.DESIGNATION != 46 && this.data.DESIGNATION != 34 && this.data.DESIGNATION != 35 && this.data.DESIGNATION != 86 && this.data.DESIGNATION != 105 && this.data.DESIGNATION != 87) && (
      //   this.data.IPR_FILLING_DATE == null ||
      //   this.data.IPR_FILLING_DATE == undefined ||
      //   this.data.IPR_FILLING_DATE == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date of filling of IPR for Group A/B', '');
      // }
      // else if (
      //   this.data.APAR_DATE == null ||
      //   this.data.APAR_DATE == undefined ||
      //   this.data.APAR_DATE == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date Of APAR Submitted', '');
      // }
      else if (this.data.IS_REGISTERED_ON_iGOT == 0) {
        this.isOk = false;
        this.message.error(
          'You Need To Register With iGot Portal In Order To Submit The Transfer Request',
          ''
        );
      }
    } else {
      if (
        this.data.EMPLOYEE_NAME == null ||
        this.data.EMPLOYEE_NAME == undefined ||
        this.data.EMPLOYEE_NAME == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Employee Name', '');
      } else if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Email ID', '');
      } else if (!this.isValidEmail(this.data.EMAIL_ID)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Email ID', '');
      } else if (this.data.EMP_NO == null || this.data.EMP_NO == undefined) {
        this.isOk = false;
        this.message.error('Please Enter Employee Code', '');
      } else if (
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Mobile No.', '');
      } else if (!this.isValidMobile(this.data.MOBILE_NO)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Mobile No.', '');
      } else if (
        this.data.DESIGNATION == null ||
        this.data.DESIGNATION == undefined ||
        this.data.DESIGNATION == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Cadre', '');
      } else if (
        this.data.CURRENT_OFFICE_ID == null ||
        this.data.CURRENT_OFFICE_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Office', '');
      } else if (
        this.data.FROM_DATE == null ||
        this.data.FROM_DATE == undefined ||
        this.data.FROM_DATE == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select From Date', '');
      } else if (
        this.data.TO_DATE == null ||
        this.data.TO_DATE == undefined ||
        this.data.TO_DATE == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select To Date', '');
      } else if (
        this.data.SPEND_DAY_IN_OFFICE == null ||
        this.data.SPEND_DAY_IN_OFFICE == undefined ||
        this.data.SPEND_DAY_IN_OFFICE == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Period Spent In Current Office', '');
      } else if (
        this.data.ADDRESS == null ||
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Address Details', '');
      } else if (
        this.data.REQ_BUILDING_ID == null ||
        this.data.REQ_BUILDING_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Building 1', '');
      } else if (
        this.data.REQ_BUILDING_ID_2 == null ||
        this.data.REQ_BUILDING_ID_2 == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Building 2', '');
      } else if (
        this.data.REQ_BUILDING_ID_3 == null ||
        this.data.REQ_BUILDING_ID_3 == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Building 3', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == null ||
        this.data.REASON_FOR_TRANSFER == undefined ||
        this.data.REASON_FOR_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Reason Type', '');
      } else if (
        this.data.SUMMARY_OF_TRANSFER == null ||
        this.data.SUMMARY_OF_TRANSFER == undefined ||
        this.data.SUMMARY_OF_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Reason For Request', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == 'Medical' &&
        (this.data.ATTACHMENTS == null ||
          this.data.ATTACHMENTS == undefined ||
          this.data.ATTACHMENTS == '')
      ) {
        this.isOk = false;
        this.message.error('Please Upload The Attachment', '');
      }
      // else if (
      //   (this.data.DESIGNATION != 22 && this.data.DESIGNATION != 36 && this.data.DESIGNATION != 43 && this.data.DESIGNATION != 75 && this.data.DESIGNATION != 39 && this.data.DESIGNATION != 46 && this.data.DESIGNATION != 34 && this.data.DESIGNATION != 35 && this.data.DESIGNATION != 86 && this.data.DESIGNATION != 105 && this.data.DESIGNATION != 87) && (
      //     this.data.IPR_FILLING_DATE == null ||
      //     this.data.IPR_FILLING_DATE == undefined ||
      //     this.data.IPR_FILLING_DATE == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date of filling of IPR for Group A/B', '');
      // }
      //  else if (
      //   this.data.APAR_DATE == null ||
      //   this.data.APAR_DATE == undefined ||
      //   this.data.APAR_DATE == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date Of APAR Submitted', '');
      // }
      else if (this.data.IS_REGISTERED_ON_iGOT == 0) {
        this.isOk = false;
        this.message.error(
          'You Need To Register With iGot Portal In Order To Submit The Transfer Request',
          ''
        );
      }
    }

    if (this.isOk) {
      // if (
      //   this.data.DESIGNATION != 51 &&
      //   this.data.DESIGNATION != 52 &&
      //   this.data.DESIGNATION != 27 &&
      //   this.data.DESIGNATION != 18
      // ) {
      //   this.api
      //     .getempstatus(
      //       0,
      //       0,
      //       '',
      //       'asc',
      //       ' AND ID=' + sessionStorage.getItem('userId')
      //     )
      //     .subscribe(
      //       (data) => {
      //         if (data['code'] == 200) {
      //           if (
      //             data['data'].length > 0 &&
      //             data['data'][0].IS_PERSONAL_FILLED == 1 &&
      //             data['data'][0].IS_ADDRESS_FILLED == 1 &&
      //             data['data'][0].IS_SERVICE_FILLED == 1
      //           ) {
      //             this.isSpinningCom = true;
      //             this.loaddataOtp = true;
      //             this.data.RANK_ID1 = this.data.DESIGNATION;

      //             this.api
      //               .getotptotransferform(this.data.EMAIL_ID, this.data.EMP_NO)
      //               .subscribe(
      //                 (successCode: any) => {
      //                   if (successCode.code == 200) {
      //                     this.OTP = null;
      //                     this.isSpinningCom = false;
      //                     this.isOTPModalVisible = true;
      //                     this.loaddataOtp = false;
      //                     this.StartTimerMobile2();
      //                     this.message.success(
      //                       '6 digit OTP send to your official email ID successfully.',
      //                       ''
      //                     );
      //                   } else if (successCode.code == 300) {
      //                     this.message.error(
      //                       'Your employee no. is not found, please contact to IT Department',
      //                       ''
      //                     );
      //                     this.isSpinningCom = false;
      //                     this.loaddataOtp = false;
      //                   } else if (successCode.code == 350) {
      //                     this.message.error('Failed To Send OTP', '');
      //                     this.isSpinningCom = false;
      //                     this.loaddataOtp = false;
      //                   } else {
      //                     this.message.error('Failed To Send OTP', '');
      //                     this.isSpinningCom = false;
      //                     this.loaddataOtp = false;
      //                   }
      //                 },
      //                 (err) => {
      //                   this.message.error(
      //                     'Something went wrong, Please try again later.',
      //                     ''
      //                   );
      //                   this.isSpinningCom = false;
      //                   this.loaddataOtp = false;
      //                 }
      //               );
      //           } else {
      //             this.message.info(
      //               'Kindly complete your profile details to proceed for the transfer request.',
      //               ''
      //             );
      //             this.openprofile();
      //           }
      //         } else {
      //           this.loaddataOtp = false;
      //           this.isSpinningCom = false;
      //           this.message.error(
      //             'Something Went Wrong, Please Try Again Later.',
      //             ''
      //           );
      //         }
      //       },
      //       (err) => {
      //         this.loaddataOtp = false;
      //         this.isSpinningCom = false;
      //         this.message.error(
      //           'Something Went Wrong, Please Try Again Later.',
      //           ''
      //         );
      //       }
      //     );
      // } else {
      var selectedProduct = this.Designationlist.filter(
        (element: any) => element.MDB_ID == this.data.DESIGNATION
      );
      this.data.SHORT_NAME = selectedProduct[0].SHORT_NAME;
      this.isSpinningCom = true;
      this.loaddataOtp = true;
      this.data.RANK_ID1 = this.data.DESIGNATION;
      this.api
        .getotptotransferform(this.data.EMAIL_ID, this.data.EMP_NO)
        .subscribe(
          (successCode: any) => {
            if (successCode.code == 200) {
              this.OTP = null;
              this.isSpinningCom = false;
              this.isOTPModalVisible = true;
              this.loaddataOtp = false;
              this.StartTimerMobile2();
              this.message.success(
                '6 digit OTP send to your official email ID successfully.',
                ''
              );
            } else if (successCode.code == 300) {
              this.message.error(
                'Your employee no. is not found, please contact to IT Department',
                ''
              );
              this.isSpinningCom = false;
              this.loaddataOtp = false;
            } else {
              this.message.error('Failed to send OTP', '');
              this.isSpinningCom = false;
              this.loaddataOtp = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, Please try again later.',
              ''
            );
            this.isSpinningCom = false;
            this.loaddataOtp = false;
          }
        );
      // }
    }
  }
  loadingUpdate: boolean = false;
  UpdateTransferForm() {
    this.isOk = true;
    this.showTimer = false;
    if (
      this.data.DESIGNATION == 51 ||
      this.data.DESIGNATION == 52 ||
      this.data.DESIGNATION == 27 ||
      this.data.DESIGNATION == 18
    ) {
      if (
        this.data.EMPLOYEE_NAME == null ||
        this.data.EMPLOYEE_NAME == undefined ||
        this.data.EMPLOYEE_NAME == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Employee Name', '');
      } else if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Email ID', '');
      } else if (!this.isValidEmail(this.data.EMAIL_ID)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Email ID', '');
      } else if (this.data.EMP_NO == null || this.data.EMP_NO == undefined) {
        this.isOk = false;
        this.message.error('Please Enter Employee Code', '');
      } else if (
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Mobile No.', '');
      } else if (!this.isValidMobile(this.data.MOBILE_NO)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Mobile No.', '');
      } else if (
        this.data.DESIGNATION == null ||
        this.data.DESIGNATION == undefined ||
        this.data.DESIGNATION == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Cadre', '');
      } else if (
        this.data.CURRENT_OFFICE_ID == null ||
        this.data.CURRENT_OFFICE_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Office', '');
      } else if (
        this.data.SPEND_DAY_IN_OFFICE == null ||
        this.data.SPEND_DAY_IN_OFFICE == undefined ||
        this.data.SPEND_DAY_IN_OFFICE == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Period Spent In Current Office', '');
      } else if (
        this.data.ADDRESS == null ||
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Address Details', '');
      } else if (
        this.data.REQ_OFFICE_ID == null ||
        this.data.REQ_OFFICE_ID == undefined ||
        this.data.REQ_OFFICE_ID == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 1', '');
      } else if (
        this.data.REQ_OFFICE_ID_2 == null ||
        this.data.REQ_OFFICE_ID_2 == undefined ||
        this.data.REQ_OFFICE_ID_2 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 2', '');
      } else if (
        this.data.REQ_OFFICE_ID_3 == null ||
        this.data.REQ_OFFICE_ID_3 == undefined ||
        this.data.REQ_OFFICE_ID_3 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 3', '');
      } else if (
        this.data.REQ_OFFICE_ID_4 == null ||
        this.data.REQ_OFFICE_ID_4 == undefined ||
        this.data.REQ_OFFICE_ID_4 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 4', '');
      } else if (
        this.data.REQ_OFFICE_ID_5 == null ||
        this.data.REQ_OFFICE_ID_5 == undefined ||
        this.data.REQ_OFFICE_ID_5 == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Charge 5', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == null ||
        this.data.REASON_FOR_TRANSFER == undefined ||
        this.data.REASON_FOR_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Reason Type', '');
      } else if (
        this.data.SUMMARY_OF_TRANSFER == null ||
        this.data.SUMMARY_OF_TRANSFER == undefined ||
        this.data.SUMMARY_OF_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Reason For Transfer Request', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == 'Medical' &&
        (this.data.ATTACHMENTS == null ||
          this.data.ATTACHMENTS == undefined ||
          this.data.ATTACHMENTS == '')
      ) {
        this.isOk = false;
        this.message.error('Please Upload The Attachment', '');
      }
      // else if ((this.data.DESIGNATION != 22 && this.data.DESIGNATION != 36 && this.data.DESIGNATION != 43 && this.data.DESIGNATION != 75 && this.data.DESIGNATION != 39 && this.data.DESIGNATION != 46 && this.data.DESIGNATION != 34 && this.data.DESIGNATION != 35 && this.data.DESIGNATION != 86 && this.data.DESIGNATION != 105 && this.data.DESIGNATION != 87) && (
      //   this.data.IPR_FILLING_DATE == null ||
      //   this.data.IPR_FILLING_DATE == undefined ||
      //   this.data.IPR_FILLING_DATE == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date of filling of IPR for Group A/B', '');
      // }
      // else if (
      //   this.data.APAR_DATE == null ||
      //   this.data.APAR_DATE == undefined ||
      //   this.data.APAR_DATE == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date Of APAR Submitted', '');
      // }
      else if (this.data.IS_REGISTERED_ON_iGOT == 0) {
        this.isOk = false;
        this.message.error(
          'You Need To Register With iGot Portal In Order To Submit The Transfer Request',
          ''
        );
      }
    } else {
      if (
        this.data.EMPLOYEE_NAME == null ||
        this.data.EMPLOYEE_NAME == undefined ||
        this.data.EMPLOYEE_NAME == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Employee Name', '');
      } else if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Email ID', '');
      } else if (!this.isValidEmail(this.data.EMAIL_ID)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Email ID', '');
      } else if (this.data.EMP_NO == null || this.data.EMP_NO == undefined) {
        this.isOk = false;
        this.message.error('Please Enter Employee Code', '');
      } else if (
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Enter Mobile No.', '');
      } else if (!this.isValidMobile(this.data.MOBILE_NO)) {
        this.isOk = false;
        this.message.error('Please Enter Valid Mobile No.', '');
      } else if (
        this.data.DESIGNATION == null ||
        this.data.DESIGNATION == undefined ||
        this.data.DESIGNATION == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Cadre', '');
      } else if (
        this.data.CURRENT_OFFICE_ID == null ||
        this.data.CURRENT_OFFICE_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Current Office', '');
      } else if (
        this.data.SPEND_DAY_IN_OFFICE == null ||
        this.data.SPEND_DAY_IN_OFFICE == undefined ||
        this.data.SPEND_DAY_IN_OFFICE == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Period Spent In Current Office', '');
      } else if (
        this.data.ADDRESS == null ||
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Address Details', '');
      } else if (
        this.data.REQ_BUILDING_ID == null ||
        this.data.REQ_BUILDING_ID == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Building 1', '');
      } else if (
        this.data.REQ_BUILDING_ID_2 == null ||
        this.data.REQ_BUILDING_ID_2 == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Building 2', '');
      } else if (
        this.data.REQ_BUILDING_ID_3 == null ||
        this.data.REQ_BUILDING_ID_3 == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Select Requested Building 3', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == null ||
        this.data.REASON_FOR_TRANSFER == undefined ||
        this.data.REASON_FOR_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Select Reason Type', '');
      } else if (
        this.data.SUMMARY_OF_TRANSFER == null ||
        this.data.SUMMARY_OF_TRANSFER == undefined ||
        this.data.SUMMARY_OF_TRANSFER == ''
      ) {
        this.isOk = false;
        this.message.error('Please Enter Reason For Request', '');
      } else if (
        this.data.REASON_FOR_TRANSFER == 'Medical' &&
        (this.data.ATTACHMENTS == null ||
          this.data.ATTACHMENTS == undefined ||
          this.data.ATTACHMENTS == '')
      ) {
        this.isOk = false;
        this.message.error('Please Upload The Attachment', '');
      }
      // else if (
      //   (this.data.DESIGNATION != 22 && this.data.DESIGNATION != 36 && this.data.DESIGNATION != 43 && this.data.DESIGNATION != 75 && this.data.DESIGNATION != 39 && this.data.DESIGNATION != 46 && this.data.DESIGNATION != 34 && this.data.DESIGNATION != 35 && this.data.DESIGNATION != 86 && this.data.DESIGNATION != 105 && this.data.DESIGNATION != 87) && (
      //     this.data.IPR_FILLING_DATE == null ||
      //     this.data.IPR_FILLING_DATE == undefined ||
      //     this.data.IPR_FILLING_DATE == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date of filling of IPR for Group A/B', '');
      // }
      //  else if (
      //   this.data.APAR_DATE == null ||
      //   this.data.APAR_DATE == undefined ||
      //   this.data.APAR_DATE == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date Of APAR Submitted', '');
      // }
      else if (this.data.IS_REGISTERED_ON_iGOT == 0) {
        this.isOk = false;
        this.message.error(
          'You Need To Register With iGot Portal In Order To Submit The Transfer Request',
          ''
        );
      }
    }

    if (this.isOk) {
      if (
        this.data.DESIGNATION != 51 &&
        this.data.DESIGNATION != 52 &&
        this.data.DESIGNATION != 27 &&
        this.data.DESIGNATION != 18
      ) {
        this.api
          .getempstatus(
            0,
            0,
            '',
            'asc',
            ' AND ID=' + sessionStorage.getItem('userId')
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                if (
                  data['data'].length > 0 &&
                  data['data'][0].IS_PERSONAL_FILLED == 1 &&
                  data['data'][0].IS_ADDRESS_FILLED == 1 &&
                  data['data'][0].IS_SERVICE_FILLED == 1
                ) {
                  this.loadingUpdate = true;
                  this.data.OTP = this.OTP;
                  if (this.data.APAR_DATE) {
                    this.data.APAR_DATE = this.datepipe.transform(
                      this.data.APAR_DATE,
                      'yyyy-MM-dd'
                    );
                  }
                  if (this.data.IPR_FILLING_DATE) {
                    this.data.IPR_FILLING_DATE = this.datepipe.transform(
                      this.data.IPR_FILLING_DATE,
                      'yyyy-MM-dd'
                    );
                  }
                  this.data.IS_UPDATED = true;
                  this.data.RANK_ID1 = this.data.DESIGNATION;
                  this.api
                    .updateemployeeTransferRequestBasic(this.data)
                    .subscribe(
                      (successCode) => {
                        if (successCode.code == 200) {
                          this.message.success(
                            'Employee Transfer Request Updated Successfully',
                            ''
                          );
                          this.isSpinningCom = false;
                          this.isOTPModalVisible = false;
                          sessionStorage.setItem('emailId', this.data.EMAIL_ID);
                          sessionStorage.setItem(
                            'loginmobileNo',
                            this.data.MOBILE_NO
                          );
                          this.loadingUpdate = false;
                          this.drawerClose();
                        } else if (successCode.code == 300) {
                          this.message.error('Email ID is incorrect', '');
                          this.isSpinningCom = false;
                          this.loadingUpdate = false;
                        } else if (successCode.code == 301) {
                          this.message.error(
                            'Invalid OTP. Please enter correct OTP',
                            ''
                          );
                          this.isSpinningCom = false;
                          this.loadingUpdate = false;
                        } else if (successCode.code == 302) {
                          this.message.error(
                            'Your employee no. is not found, please contact to IT department',
                            ''
                          );
                          this.isSpinningCom = false;
                          this.loadingUpdate = false;
                        } else {
                          this.message.error(
                            'Employee Transfer Request Updation Failed',
                            ''
                          );
                          this.isSpinningCom = false;
                          this.loadingUpdate = false;
                        }
                      },
                      (err) => {
                        this.message.error(
                          'Something went wrong.',
                          'Please try again.'
                        );
                        this.isSpinningCom = false;
                        this.loadingUpdate = false;
                      }
                    );
                } else {
                  this.isSpinningCom = false;
                  this.loadingUpdate = false;
                  this.message.info(
                    'Kindly complete your profile details to proceed for the transfer request.',
                    ''
                  );
                  this.openprofile();
                }
              } else {
                this.loaddataOtp = false;
                this.isSpinningCom = false;
                this.message.error(
                  'Something Went Wrong, Please Try Again Later.',
                  ''
                );
              }
            },
            (err) => {
              this.loaddataOtp = false;
              this.isSpinningCom = false;
              this.message.error(
                'Something Went Wrong, Please Try Again Later.',
                ''
              );
            }
          );
      } else {
        this.loadingUpdate = true;
        this.data.OTP = this.OTP;
        if (this.data.APAR_DATE) {
          this.data.APAR_DATE = this.datepipe.transform(
            this.data.APAR_DATE,
            'yyyy-MM-dd'
          );
        }
        if (this.data.IPR_FILLING_DATE) {
          this.data.IPR_FILLING_DATE = this.datepipe.transform(
            this.data.IPR_FILLING_DATE,
            'yyyy-MM-dd'
          );
        }
        this.data.IS_UPDATED = true;
        this.data.RANK_ID1 = this.data.DESIGNATION;
        this.api.updateemployeeTransferRequestBasic(this.data).subscribe(
          (successCode) => {
            if (successCode.code == 200) {
              this.data.APPLICATION_NO = successCode['APPLICATION_NO'];
              this.message.success(
                'Employee Transfer Request Updated Successfully',
                ''
              );
              this.isSpinningCom = false;
              this.isOTPModalVisible = false;
              sessionStorage.setItem('emailId', this.data.EMAIL_ID);
              sessionStorage.setItem('loginmobileNo', this.data.MOBILE_NO);
              this.loadingUpdate = false;
              this.drawerClose();
            } else if (successCode.code == 300) {
              this.message.error('Email ID is incorrect', '');
              this.isSpinningCom = false;
              this.loadingUpdate = false;
            } else if (successCode.code == 301) {
              this.message.error('Invalid OTP. Please enter correct OTP', '');
              this.isSpinningCom = false;
              this.loadingUpdate = false;
            } else if (successCode.code == 302) {
              this.message.error(
                'Your employee no. is not found, please contact to IT department',
                ''
              );
              this.isSpinningCom = false;
              this.loadingUpdate = false;
            } else {
              this.message.error(
                'Employee Transfer Request Updation Failed',
                ''
              );
              this.isSpinningCom = false;
              this.loadingUpdate = false;
            }
          },
          (err) => {
            this.message.error('Something went wrong.', 'Please try again.');
            this.isSpinningCom = false;
            this.loadingUpdate = false;
          }
        );
      }
    }
  }

  resendOTPForAGT() {
    this.isSpinningCom = true;
    this.loadingUpdate = true;
    this.loaddataOtp = true;
    this.api
      .getotptotransferform(this.data.EMAIL_ID, this.data.EMP_NO)
      .subscribe(
        (successCode: any) => {
          if (successCode.code == 200) {
            this.OTP = null;
            this.isSpinningCom = false;
            this.loadingUpdate = false;
            this.isOTPModalVisible = true;
            this.loaddataOtp = false;
            this.StartTimerMobile2();
            this.message.success(
              '6 digit OTP send to your official email ID successfully.',
              ''
            );
          } else if (successCode.code == 300) {
            this.message.error(
              'Your employee no. is not found, please contact to IT Department',
              ''
            );
            this.isSpinningCom = false;
            this.loadingUpdate = false;
            this.loaddataOtp = false;
          } else if (successCode.code == 350) {
            this.message.error('Failed To Send OTP', '');
            this.isSpinningCom = false;
            this.loaddataOtp = false;
            this.loadingUpdate = false;
          } else {
            this.message.error('Failed To Send OTP', '');
            this.isSpinningCom = false;
            this.loaddataOtp = false;
            this.loadingUpdate = false;
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, Please try again later.',
            ''
          );
          this.isSpinningCom = false;
          this.loaddataOtp = false;
          this.loadingUpdate = false;
        }
      );
  }
  viewAttachments() {
    const fileUrl =
      appkeys.retriveimgUrl + 'transferReqFiles/' + this.data.ATTACHMENTS;
    window.open(fileUrl);
  }

  closeOTPModal(): void {
    this.isOTPModalVisible = false;
  }
  disabledDate2222 = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current > today;
  };

  designationChanged(selectedId: number): void {
    if (selectedId != null && selectedId != undefined && selectedId != 0) {
      var selectedProduct = this.Designationlist.filter(
        (element: any) => element.MDB_ID == selectedId
      );
      this.data.SHORT_NAME = selectedProduct[0].SHORT_NAME;
      if (selectedId == 51 || selectedId == 52 || selectedId == 18) {
        this.officeOptions1 = [
          { value: 'Audit / Judicial', label: 'Audit / Judicial' },
          { value: 'Add.CIT Appeals', label: 'Add.CIT Appeals' },
          { value: 'Central Charges', label: 'Central Charges' },
          { value: 'DDO Gazetted', label: 'DDO Gazetted' },
          { value: 'Exemption / TDS', label: 'Exemption / TDS' },
          { value: 'Faceless Charges', label: 'Faceless Charges' },
          { value: 'Headquarters', label: 'Headquarters' },
          { value: 'Investigation Wing', label: 'Investigation Wing' },
          { value: 'IT & TP', label: 'IT & TP' },
          { value: 'Jurisdiction Charges', label: 'Jurisdiction Charges' },
          { value: 'NADT-RC / MSTU', label: 'NADT-RC / MSTU' },
          { value: 'Other Charges', label: 'Other Charges' },
        ];
        this.officed1 = this.officeOptions1;
        this.officed2 = this.officeOptions1;
        this.officed3 = this.officeOptions1;
        this.officed4 = this.officeOptions1;
        this.officed5 = this.officeOptions1;
        this.data.REQ_BUILDING_ID = null;
        this.data.REQ_BUILDING_ID_2 = null;
        this.data.REQ_BUILDING_ID_3 = null;
        this.data.REQ_BUILDING_ID_4 = null;
        this.data.REQ_BUILDING_ID_5 = null;
      } else {
        this.officeOptions1 = [
          { value: 'Audit / Judicial', label: 'Audit / Judicial' },
          { value: 'Central Charges', label: 'Central Charges' },
          { value: 'CIT/Add. CIT Appeals', label: 'CIT/Add. CIT Appeals' },
          { value: 'DDO Charges', label: 'DDO Charges' },
          { value: 'DDO Gazetted', label: 'DDO Gazetted' },
          { value: 'Exemption / TDS', label: 'Exemption / TDS' },
          { value: 'Faceless Charges', label: 'Faceless Charges' },
          { value: 'Headquarters', label: 'Headquarters' },
          { value: 'Investigation Wing', label: 'Investigation Wing' },
          { value: 'IT & TP', label: 'IT & TP' },
          { value: 'Jurisdiction Charges', label: 'Jurisdiction Charges' },
          { value: 'NADT-RC / MSTU', label: 'NADT-RC / MSTU' },
          { value: 'Other Charges', label: 'Other Charges' },
        ];
        this.officed1 = this.officeOptions1;
        this.officed2 = this.officeOptions1;
        this.officed3 = this.officeOptions1;
        this.officed4 = this.officeOptions1;
        this.officed5 = this.officeOptions1;
        this.data.REQ_BUILDING_ID = null;
        this.data.REQ_BUILDING_ID_2 = null;
        this.data.REQ_BUILDING_ID_3 = null;
        this.data.REQ_BUILDING_ID_4 = null;
        this.data.REQ_BUILDING_ID_5 = null;
      }
    } else {
      this.officeOptions1 = [
        { value: 'Audit / Judicial', label: 'Audit / Judicial' },
        { value: 'Central Charges', label: 'Central Charges' },
        { value: 'CIT/Add. CIT Appeals', label: 'CIT/Add. CIT Appeals' },
        { value: 'DDO Charges', label: 'DDO Charges' },
        { value: 'DDO Gazetted', label: 'DDO Gazetted' },
        { value: 'Exemption / TDS', label: 'Exemption / TDS' },
        { value: 'Faceless Charges', label: 'Faceless Charges' },
        { value: 'Headquarters', label: 'Headquarters' },
        { value: 'Investigation Wing', label: 'Investigation Wing' },
        { value: 'IT & TP', label: 'IT & TP' },
        { value: 'Jurisdiction Charges', label: 'Jurisdiction Charges' },
        { value: 'NADT-RC / MSTU', label: 'NADT-RC / MSTU' },
        { value: 'Other Charges', label: 'Other Charges' },
      ];
      this.officed1 = this.officeOptions1;
      this.officed2 = this.officeOptions1;
      this.officed3 = this.officeOptions1;
      this.officed4 = this.officeOptions1;
      this.officed5 = this.officeOptions1;

      this.data.REQ_BUILDING_ID = null;
      this.data.REQ_OFFICE_ID = null;
      this.data.REQ_BUILDING_ID_2 = null;
      this.data.REQ_OFFICE_ID_2 = null;
      this.data.REQ_BUILDING_ID_3 = null;
      this.data.REQ_OFFICE_ID_3 = null;
      this.data.REQ_BUILDING_ID_4 = null;
      this.data.REQ_OFFICE_ID_4 = null;
      this.data.REQ_BUILDING_ID_5 = null;
      this.data.REQ_OFFICE_ID_5 = null;
    }
  }

  ConfirmOTP(): void {
    let isOk = true;
    if (this.OTP == null || this.OTP == undefined || this.OTP == '') {
      isOk = false;
      this.message.error('Please Enter OTP', '');
    } else if (this.OTP.length != 6) {
      isOk = false;
      this.message.error('Please Enter Valid OTP', '');
    }
    if (isOk) {
      this.loadingconfotp = true;
      this.data.OTP = this.OTP;
      if (this.data.APAR_DATE) {
        this.data.APAR_DATE = this.datepipe.transform(
          this.data.APAR_DATE,
          'yyyy-MM-dd'
        );
      }
      if (this.data.IPR_FILLING_DATE) {
        this.data.IPR_FILLING_DATE = this.datepipe.transform(
          this.data.IPR_FILLING_DATE,
          'yyyy-MM-dd'
        );
      }
      if (this.data.FROM_DATE) {
        this.data.FROM_DATE = this.datepipe.transform(
          this.data.FROM_DATE,
          'yyyy-MM-dd'
        );
      }
      if (this.data.TO_DATE) {
        this.data.TO_DATE = this.datepipe.transform(
          this.data.TO_DATE,
          'yyyy-MM-dd'
        );
      }
      this.data.RANK_ID1 = this.data.DESIGNATION;
      this.api.createEmpTransferRequest(this.data).subscribe(
        (successCode) => {
          if (successCode.code == 200) {
            this.data.APPLICATION_NO = successCode['APPLICATION_NO'];
            this.message.success(
              'OTP Verified & Employee Transfer Request Submitted Successfully',
              ''
            );
            this.isSpinningCom = false;
            this.isOTPModalVisible = false;
            sessionStorage.setItem('emailId', this.data.EMAIL_ID);
            sessionStorage.setItem('loginmobileNo', this.data.MOBILE_NO);
            // this.isVerifiedOTP = true;
            this.loadingconfotp = false;
            this.drawerClose();
          } else if (successCode.code == 300) {
            this.message.error('Email ID is incorrect', '');
            this.isSpinningCom = false;
            this.loadingconfotp = false;
          } else if (successCode.code == 301) {
            this.message.error('Invalid OTP. Please enter correct OTP', '');
            this.isSpinningCom = false;
            this.loadingconfotp = false;
          } else if (successCode.code == 302) {
            this.message.error(
              'Your employee no. is not found, please contact to IT department',
              ''
            );
            this.isSpinningCom = false;
            this.loadingconfotp = false;
          } else {
            this.message.error('Employee Transfer Request Creation Failed', '');
            this.isSpinningCom = false;
            this.loadingconfotp = false;
          }
        },
        (err) => {
          this.message.error('Something went wrong.', 'Please try again.');
          this.isSpinningCom = false;
          this.loadingconfotp = false;
        }
      );
    }
  }
  openpdf() {
    this.loading = true;
    const element = document.getElementById('excel-table2');
    const opt = {
      margin: 0.2,
      filename: 'APPLICATION FOR TRANSFER',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  drawerClosess(): void {
    this.drawerVisible1s = false;
  }
  get closeCallbackss() {
    return this.drawerClosess.bind(this);
  }
  openprofile() {
    this.drawerTitles = 'Employee Details';
    this.addnew = true;
    this.api
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND ID=' + sessionStorage.getItem('userId') + ''
      )
      .subscribe(
        (data) => {
          if (data.code == '200' && data.data.length > 0) {
            var dataforper = data['data'][0];
            this.drawerDatapersonal = Object.assign({}, dataforper);
            this.api
              .getempstatus(
                0,
                0,
                '',
                'asc',
                ' AND ID=' + sessionStorage.getItem('userId')
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  if (data['data'].length > 0) {
                    this.empstatus = data['data'];
                    this.drawerVisible1s = true;
                  } else {
                    this.empstatus = [];
                  }
                  this.drawerVisible1s = true;
                } else {
                  this.message.error(
                    'Something Went Wrong, Please Try Again Later.',
                    ''
                  );
                }
              });
          }
        },
        (err) => {
          this.message.error(
            'Something Went Wrong, Please Try Again Later.',
            ''
          );
        }
      );
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.data.FROM_DATE) < 0;

  calculateDateDifference(fromDate: string, toDate: string): any {
    if (
      fromDate != null &&
      fromDate != '' &&
      fromDate != undefined &&
      toDate != null &&
      toDate != '' &&
      toDate != undefined
    ) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          0
        );
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      if (years !== 0 && months !== 0 && days !== 0) {
        this.data.SPEND_DAY_IN_OFFICE =
          years + ' Year ' + months + ' Month ' + days + ' Day';
        return years + ' Year ' + months + ' Month ' + days + ' Day';
      } else if (years !== 0 && months !== 0 && days === 0) {
        this.data.SPEND_DAY_IN_OFFICE = years + ' Year ' + months + ' Month';
        return years + ' Year ' + months + ' Month';
      } else if (years !== 0 && months === 0 && days !== 0) {
        this.data.SPEND_DAY_IN_OFFICE = years + ' Year ' + days + ' Day';
        return years + ' Year ' + days + ' Day';
      } else if (years !== 0 && months === 0 && days === 0) {
        this.data.SPEND_DAY_IN_OFFICE = years + ' Year';
        return years + ' Year';
      } else if (years === 0 && months !== 0 && days !== 0) {
        this.data.SPEND_DAY_IN_OFFICE = months + ' Month ' + days + ' Day';
        return months + ' Month ' + days + ' Day';
      } else if (years === 0 && months !== 0 && days === 0) {
        this.data.SPEND_DAY_IN_OFFICE = months + ' Month';
        return months + ' Month';
      } else if (years === 0 && months === 0 && days !== 0) {
        this.data.SPEND_DAY_IN_OFFICE = days + ' Day';
        return days + ' Day';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}
