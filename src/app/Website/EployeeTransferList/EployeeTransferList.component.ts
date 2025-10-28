import { Component, ElementRef, HostListener, OnInit, ViewChild, } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { EmpTransferData } from 'src/app/Modal/employeeQuarterForm';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject } from 'rxjs';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

export class changepassword {
  ID: number;
  PASSWORD: any = '';
  NEW_PASSWORD: any = '';
}
@Component({
  selector: 'app-EployeeTransferList',
  templateUrl: './EployeeTransferList.component.html',
  styleUrls: ['./EployeeTransferList.component.css'],
  providers: [DatePipe],
})
export class EployeeTransferListComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: EmpTransferData = new EmpTransferData();
  formTitle: string = 'Manage Employee Transfer';
  dataList: any = [];
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
  Employeelist: any = [];
  loadEmployee: boolean = false;
  EMP_NAME: any;
  isModalVisible: boolean = false;
  AttachmentURL;
  showAttachments: boolean = true;
  percent: any = 0;
  progressBar: any = false;
  timer5: any;
  isSpinning = false;
  isSpinningCom = false;
  data: EmpTransferData = new EmpTransferData();
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
  drawerwidth: any = '80%';
  scrHeight: any;
  scrWidth: any;
  Dwidth: any;
  @HostListener("window:resize", ["$event"]) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  constructor(
    private api: WebsiteService,
    private _api: ApiService,
    private cookie: CookieService,
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

  ngOnInit(): void {
    const today: any = new Date();
    this.nextYear = (today.getFullYear());
    this.currentYear = (today.getFullYear() + 1).toString().slice(-2);
    this.EMP_CODE = sessionStorage.getItem('Empcode');
    this.EMP_CODE = this.EMP_CODE.replace(/["\\]/g, '');
    this.search();
  }
  console() {
    this.router.navigate(['/my-profile']);
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  isOk: boolean = true;
  isSpinninggg: { [key: number]: boolean } = {};
  dataofpdf: any = [];
  dataofpdf1: any = [];

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
            this.nextYear = (today.getFullYear());
            this.currentYear = (today.getFullYear() + 1).toString().slice(-2);
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
  OTP: any;
  isVerifiedOTP: boolean = false;
  loading: boolean = false;

  logout() {
    this._api.logoutcall().subscribe((data) => {
      if (data['code'] == '200') {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.message.success('Logout Successfully', '');
        this.router.navigateByUrl("/");
        this.router.navigate(["/"]).then(() => {
          window.location.reload();
        });
      } else {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.message.success('Logout Successfully', '');
        this.router.navigateByUrl("/");
        this.router.navigate(["/"]).then(() => {
          window.location.reload();
        });
      }
    }, err => {
      this.cookie.deleteAll();
      sessionStorage.clear();
      localStorage.clear();
      this.message.success('Logout Successfully', '');
      this.router.navigateByUrl("/");
      this.router.navigate(["/"]).then(() => {
        window.location.reload();
      });
    });
  }

  @ViewChild('otpve') otpve: ElementRef;
  @ViewChild('otpve1') otpve1: ElementRef;
  @ViewChild('openregi') openregi: ElementRef;
  @ViewChild('openregi1') openregi1: ElementRef;
  @ViewChild('openregi2') openregi2: ElementRef;
  @ViewChild('clodeOTP') clodeOTP: ElementRef;
  @ViewChild('clodeOTP1') clodeOTP1: ElementRef;
  @ViewChild('openotpmodemail') openotpmodemail: ElementRef;
  @ViewChild('openotpmodmobile') openotpmodmobile: ElementRef;
  @ViewChild('regsuccessmodal1111') regsuccessmodal1111: ElementRef;
  @ViewChild('rolemapmod') rolemapmod: ElementRef;
  @ViewChild('ngOtpInputttt') ngOtpInputttt: any;
  @ViewChild('pinChange') pinChange: any;

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
  isValidPassword(password: string) {
    const expression =
      /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return expression.test(String('' + password).toLowerCase());
  }
  Changepasss() {
    if (!this.isValidPassword(this.PASS)) {
      this.message.error('Please Enter Valid Password', '');
    } else if (this.PASS == undefined || this.PASS.toString().trim() == '') {
      this.message.error('Please Enter Password', '');
    } else if (this.PASS != this.CPASS) {
      this.message.error('Password And Confirm Password Must Be Same', '');
    } else {
      this.otpSpinning = true;
      this._api.changepasss(this.PHONE, this.PASS).subscribe(
        (successCode) => {
          this.otpSpinning = false;
          if (successCode['code'] == '200') {
            this.message.success('Password Changed Successfully.', '');
            this.PASSWORD = '';
            this.OTP = '';
            this.OTP11 = '';
            this.showforgot1 = false;
            this.showforgot2 = false;
            this.showforgot3 = false;
            this.CPASS = '';
            this.PASS = '';
          } else if (successCode['code'] == '300') {
            this.message.error('Something Went Wrong.Please Try Again.', '');
            this.OTP = '';
          } else if (successCode['code'] == '400') {
            this.message.error('Something Went Wrong.Please Try Again.', '');
          }
        },
        (err) => {
          this.message.error('Something Went Wrong.Please Try Again.', '');
        }
      );
    }
  }
  RETYPE_PASSWORD: string = '';
  changepassss: changepassword = new changepassword();

  @ViewChild('closechangeppp') closechangeppp: ElementRef;
  rroleIdd: any = localStorage.getItem('roleId');
  changepasss() {
    if (
      this.changepassss.PASSWORD == '' ||
      this.changepassss.PASSWORD == null
    ) {
      this.message.error('Please Enter Old Password', '');
    } else if (
      this.changepassss.NEW_PASSWORD == '' ||
      this.changepassss.NEW_PASSWORD == null
    ) {
      this.message.error('Please Enter New Password', '');
    } else if (!this.isValidPassword(this.changepassss.NEW_PASSWORD)) {
      this.message.error('Please Enter Valid New Password', '');
    } else if (this.changepassss.PASSWORD == this.changepassss.NEW_PASSWORD) {
      this.message.error('Old And New Password Are Same', '');
    } else if (this.changepassss.PASSWORD == this.RETYPE_PASSWORD) {
      this.message.error('Old And Retype Password Are Same', '');
    } else if (this.changepassss.NEW_PASSWORD != this.RETYPE_PASSWORD) {
      this.message.error('New Password And Retype Password Are Not Same', '');
    } else {
      this.changepassss.ID = Number(sessionStorage.getItem('userId'));
      this.changepassss.NEW_PASSWORD = CryptoJS.MD5(
        this.changepassss.NEW_PASSWORD
      ).toString(CryptoJS.enc.Hex);
      this.changepassss.PASSWORD = CryptoJS.MD5(
        this.changepassss.PASSWORD
      ).toString(CryptoJS.enc.Hex);
      this.otpSpinning = true;
      this._api.changepasswordemployee(this.changepassss).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.otpSpinning = false;

            this.changepassss.NEW_PASSWORD = '';
            this.changepassss.PASSWORD = '';
            this.closechangeppp.nativeElement.click();
            this.message.success('Password Changed Successfully', '');
          } else if (successCode['code'] == '303') {
            this.message.error(
              'New Password Not Match To The Old Password.',
              ''
            );
            this.otpSpinning = false;
          } else {
            this.message.error('Something went wrong please try later...', '');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.message.error('Something went wrong please try later...', '');
          this.otpSpinning = false;
        }
      );
    }
  }
  onOtpChange(otp: any) {
    this.OTP = otp.toString();
  }
  onOtpChange1(otp1: any) {
    this.OTP1 = otp1.toString();
  }
  onOtpChange3(otp2: any) {
    this.OTP11 = otp2.toString();
  }
  showpass3() {
    this.pass3 = !this.pass3;
  }
  showpass4() {
    this.pass4 = !this.pass4;
  }
  showpass1() {
    this.pass1 = !this.pass1;
  }
  showpass2() {
    this.pass2 = !this.pass2;
  }
  showp() {
    this.pass11 = !this.pass11;
  }

  search(reset: boolean = false) {
    this.isSpinning = true;
    this.api
      .getAlltransferRequestnew(
        this.pageIndex,
        this.pageSize,
        '',
        'desc',
        ' AND EMPLOYEE_CODE =' + "'" + this.EMP_CODE + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
          } else {
            this.message.error('Data Not Load', '');
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  uptrue: boolean[] = [];

  updown(index: number) {
    this.uptrue[index] = true;
  }
  updown1(index: number) {
    this.uptrue[index] = false;
  }
  cricular_viewIcard1(item: any) {
    const fileUrl = appkeys.retriveimgUrl + 'transferReqFiles/' + item;
    window.open(fileUrl);
  }

  emitted = false;
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])
  onScroll(e: any) {
    const activityItem = document.getElementById('activityItem');
    if (activityItem) {
      const scrollTop = activityItem.scrollTop;
      const offsetHeight = activityItem.offsetHeight;
      const scrollHeight = activityItem.scrollHeight;
      if (scrollTop + offsetHeight + 1 >= scrollHeight && !this.emitted) {
        this.emitted = true;
        this.onScrollingFinished();
      } else if (scrollTop + offsetHeight + 1 < scrollHeight) {
        this.emitted = false;
      }
    }
  }

  onScrollingFinished() {
    this.loadMoreP();
  }
  loadMoreP(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.dataList);
    }
  }

  getNextItems(): boolean {
    if (this.dataList.length >= this.totalRecords) {
      return false;
    }
    this.pageIndex = this.pageIndex + 1;
    this.search(false);
    return true;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  isSpinning11: boolean;
  AllFilters() {
    this.isSpinning11 = true;
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
  loaddataOtp: boolean = false;
  viewAttachments() {
    const fileUrl =
      appkeys.retriveimgUrl + 'transferReqFiles/' + this.data.ATTACHMENTS;
    window.open(fileUrl);
  }
  openpdf() {
    this.loading = true;
    const element = document.getElementById('excel-table');
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


  opendrawer() {
    const today: any = new Date();
    this.nextYear = (today.getFullYear());
    this.currentYear = (today.getFullYear() + 1).toString().slice(-2);
    this.data.DESIGNATION = null;
    this.data.REQ_BUILDING_ID = null;
    this.data.REQ_OFFICE_ID = null;
    this.data.REQ_BUILDING_ID_2 = null;
    this.data.REQ_OFFICE_ID_2 = null;
    this.data.REQ_BUILDING_ID_3 = null;
    this.data.REQ_OFFICE_ID_3 = null;
    this.data.SUMMARY_OF_TRANSFER = '';
    this.data.ATTACHMENTS = null;
    this.data.REQ_BUILDING_ID_5 = null;
    this.data.REQ_BUILDING_ID_4 = null;
    this.data.REQ_OFFICE_ID_5 = null;
    this.data.REQ_OFFICE_ID_4 = null;
    this.data.CURRENT_OFFICE_ID = null;
    this.data.REASON_FOR_TRANSFER = null;
    this.data.SPEND_DAY_IN_OFFICE = null;
    this.data.ADDRESS = '';
    this.isVerifiedOTP = false;
    this.progressBar = false;
    this.drawerTitle = 'Request For Transfer In Annual General Transfer ' + this.nextYear + '-' + this.currentYear;
    this.drawerData = new EmpTransferData();
    if (this.dataList.length > 0 && this.dataList != null) {
      this.loaddrawer = true;
      this.api
        .checkEligiblityTransferRequest(0, 0, '', 'asc', '', this.EMP_CODE)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loaddrawer = false;
            this.drawerVisible = true;
          } else if (data['code'] == 304) {
            this.loaddrawer = false;
            this.message.info(data['message'], '');
          } else {
            this.message.error('Failed To Get Employee Data ', '');
            this.Employeelist = [];
            this.loaddrawer = false;
          }
        });
    } else {
      this.drawerVisible = true;
    }
  }

  edittransfer(data: EmpTransferData): void {
    this.message.info("You can edit your transfer details only once.", "")
    this.drawerTitle = 'Update Transfer Details';
    this.drawerData = Object.assign({}, data);
    this.drawerData.DESIGNATION = data.RANK_ID1
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }


  drawerVisible1s = false;
  drawerDatas: any = [];
  drawerTitles: string = 'Add Employee Details';
  addnew: boolean = false;
  drawerDatapersonal: any = [];
  empstatus: any = [{
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
  }];
  drawerClosess(): void {
    this.search();
    this.drawerVisible1s = false;
  }
  get closeCallbackss() {
    return this.drawerClosess.bind(this);
  }
  openprofile() {
    this.drawerTitles = 'Profile Details';
    this.addnew = true
    this.api.getprofiledata(0, 0, '', '', ' AND ID=' + sessionStorage.getItem('userId') + '').subscribe(
      (data) => {
        if (data.code == '200' && data.data.length > 0) {
          var dataforper = data['data'][0];
          this.drawerDatapersonal = Object.assign({}, dataforper);
          this.api.getempstatus(0, 0, '', 'asc', ' AND ID=' + sessionStorage.getItem('userId')).subscribe((data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.empstatus = data['data'];
                this.drawerVisible1s = true;
              } else {
                this.empstatus = [];
              }
              this.drawerVisible1s = true;
            } else {
              this.message.error("Something Went Wrong, Please Try Again Later.", "")
            }
          })
        }
      }, (err) => {
        this.message.error("Something Went Wrong, Please Try Again Later.", "")
      });

  }
}
