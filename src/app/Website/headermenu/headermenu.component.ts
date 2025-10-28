import { DOCUMENT, DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NzShowUploadList } from 'ng-zorro-antd/upload';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { changepassword } from 'src/app/Modal/changepasswordho';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-headermenu',
  templateUrl: './headermenu.component.html',
  styleUrls: ['./headermenu.component.css'],
  providers: [DatePipe],
})
export class HeadermenuComponent implements OnInit {
  NAME: any;
  MOBILE_NO: any;
  DESIGNATION: any;
  GRADE_PAY_LEVEL: any;
  POSTED_CITY_ID: any;
  PAN_CARD: any;
  GRADE_PAY: any;
  OTHER_GRADE_PAY: any;
  GRASS_GRADE_PAY: any;
  EMPLOYEE_CODE: any;
  APPROVAL_STATUS: any;
  ID_PROOF: any;
  mobilev = false;
  showforgot = false;
  PASS = '';
  CPASS = '';
  fsendOtp = false;
  PHONE = '';
  MIDDLE_NAME = '';
  LAST_NAME = '';
  PASSWORD = '';
  CONFIRM_PASSWORD = '';
  EMAIL_ID = '';
  fieldTextType: boolean = false;
  pass1: boolean = false;
  pass2: boolean = false;
  pass3: boolean = false;
  pass4: boolean = false;
  pass11: boolean = false;

  emailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  details: any = [];
  resendTrue = false;
  mobilepattrn = /[6-9]{1}[0-9]{9}/;
  OTP = '';
  OTP1 = '';
  OTP11 = '';
  otpSpinning = false;
  myInterval2: any;
  showTimer = false;
  timerMobile: any;
  isLoggedIn: any = false;
  toasts: any[] = [];
  scrHeight: any;
  scrWidth: any;
  show: boolean = false;
  off = false;
  roledata: any = [];
  designation: any = [];
  userPname: any;
  rroleIdd: any;
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  Dwidth: any;

  constructor(
    private datePipe: DatePipe,
    public api: WebsiteService,
    public cookie: CookieService,
    public router: Router,
    private toast: ToastrService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.getScreenSize(event);
    if (this.scrWidth <= 990) {
      this.show = true;
    } else {
      this.show = false;
    }
    if (this.scrWidth <= 500) {
      this.off = true;
      this.Dwidth = '100%';
    } else {
      this.off = false;
      this.Dwidth = '90%';
    }
  }

  getcondition() {
    if (
      sessionStorage.getItem('roleId') != null &&
      sessionStorage.getItem('roleId') != undefined &&
      sessionStorage.getItem('roleId') != ''
    ) {
      if (sessionStorage.getItem('roleId') == '56') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const headerElement = document.getElementById('header');
    if (headerElement) {
      const headerScrolled = () => {
        if (window.scrollY > 30) {
          headerElement.classList.add('header-scrolled');
        } else {
          headerElement.classList.remove('header-scrolled');
        }
      };
      if (document) {
        window.addEventListener('load', headerScrolled);
        document.onscroll = headerScrolled;
      }
    }
  }
  ranksss: any = [];
  adminshow: boolean = false;
  ngOnInit(): void {
    if (
      sessionStorage.getItem('isLoggedIn') != undefined &&
      sessionStorage.getItem('isLoggedIn') != null
    ) {
      this.api
        .getallDesignationForTransfer(
          0,
          0,
          'NAME',
          'asc',
          ' AND STATUS=1 AND MDB_ID is not NULL '
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.ranksss = data['data'];
              } else {
              }
            }
          },
          (err) => { }
        );

      this.isLoggedIn = true;

      this.rroleIdd = sessionStorage.getItem('roleId');

      // if (this.rroleIdd == '2') {
      //   this.getemployeedata(true);
      // } else {

      // }
      this.getemployeedata(false);
      var nname = sessionStorage.getItem('userName');
      if (nname !== null) {
        var nameParts = nname.split(' ');
        this.userPname = nameParts[0];
      } else {
        this.userPname = 'User';
      }

      this.getrolewiseservice();
    } else {
      this.isLoggedIn = false;
      var nd = document.getElementById('datastore');
      nd?.click();
    }

    if (
      sessionStorage.getItem('roleId') == '17' ||
      sessionStorage.getItem('roleId') == '58'
    ) {
      this.adminshow = true;
    }

    if (
      sessionStorage.getItem('roledata') != undefined &&
      sessionStorage.getItem('roledata') != null
    ) {
      var roled: any = sessionStorage.getItem('roledata');
      this.roledata = JSON.parse(roled);
    }
  }
  GRADE_PAY_LEVEL_ID: any;
  gradepaylevel: any = [];
  servicedetailroutecon() {
    sessionStorage.setItem('Isservisedetail', 'F');
  }
  showmobile = false;
  showw = 0;
  showww = 0;
  showww1 = 0;
  showww11 = 0;
  showwwd = 0;
  showservs = 0;
  drop() {
    this.showww = 1;
    this.showww1 = 0;
    this.showwwd = 0;
    this.showww11 = 0;
    this.showservs = 0;
  }
  droppp() {
    this.showwwd = 1;
    this.showww = 0;
    this.showww1 = 0;
    this.showww11 = 0;
    this.showservs = 0;
  }
  drop1() {
    this.showww = 0;
    this.showww1 = 1;
    this.showwwd = 0;
    this.showww11 = 0;
    // this.showservs=1;
  }

  drop3() {
    this.showww = 0;
    this.showww1 = 0;
    this.showww11 = 1;
    this.showwwd = 0;
    this.showservs = 0;
  }
  dropserv() {
    this.showservs = 1;
    this.showww = 0;
    this.showww1 = 1;
    this.showww11 = 0;
    this.showwwd = 0;
  }
  open() {
    this.showmobile = true;
    this.showw = 1;
  }
  close() {
    this.showmobile = false;
    this.showw = 0;
  }
  // logout() {
  //   this.api.logoutcall().subscribe((data) => {
  //     if (data['code'] == '200') {
  //       this.cookie.deleteAll();
  //       sessionStorage.clear();
  //       localStorage.clear();
  //       this.toast.success('Logout Successfully', '');

  //       this.router.navigateByUrl('https://www.incometaxmumbai.gov.in/', { replaceUrl: false });

  //       // this.router.navigate(['/']).then(() => {
  //       //   window.location.reload();
  //       // });
  //       // setTimeout(() => {
  //       //   window.location.reload();
  //       // }, 1000);
  //     }
  //   });
  // }

  logout() {
    this.api.logoutcall().subscribe((data) => {
      if (data['code'] == '200') {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.toast.success('Logout Successfully', '');
        this.document.location.href = 'https://www.incometaxmumbai.gov.in/';
        // this.router.navigateByUrl('https://www.incometaxmumbai.gov.in/', {
        //   replaceUrl: true,
        // });

        // this.router.navigate(['/']).then(() => {
        //   window.location.reload();
        // });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      } else {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.toast.success('Logout Successfully', '');

        // this.router.navigateByUrl('https://www.incometaxmumbai.gov.in/', {
        //   replaceUrl: true,
        // });

        this.document.location.href = 'https://www.incometaxmumbai.gov.in/';
      }
    });
  }
  design_IDS: any;
  design_IDS1: any = [];
  GradePay_ID: any;
  GradePay_ID1: any = [];
  RESIDENCE_TYPE_NAME1: any = [];

  gradepayData: any = [];
  getcityy() {
    this.api
      .getDesignation(0, 0, 'SEQUENCE_NO', 'desc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.designation = data['data'];
        }
      });

    this.api
      .getgradepay(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.gradepayData = data['data'];
        }
      });

    this.api.getgradepaylevel(0, 0, 'ID', 'asc', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.gradepaylevel = data['data'];
      }
    });
  }

  isValiddg: boolean;
  selectdesign(data: any) {
    var castid = this.designation.find((item) => item.NAME == data);
    if (castid != undefined) {
      this.design_IDS1 = castid.ID;
    } else {
      this.design_IDS1 = '';
    }
    this.isValiddg = this.designation.some((item) => item.NAME === data);
    return this.isValiddg;
  }
  gradepaylevelID: any;
  selectgradepaylevel(data: any) {
    var gradepayid = this.gradepaylevel.find(
      (item) => item.GRADE_PAY_LEVEL == data
    );
    if (gradepayid != undefined) {
      this.gradepaylevelID = gradepayid.ID;
    } else {
      this.gradepaylevelID = '';
    }
    this.isValidgradepay = this.gradepaylevel.some(
      (item) => item.GRADE_PAY_LEVEL === data
    );
    return this.isValidgradepay;
  }

  isValidgp: boolean;
  isValidgradepay: boolean;
  selectgradepay(data: any) {
    // if(data!='Other'){
    this.OTHER_GRADE_PAY = '';
    var recidence = data.split('--');
    var castid = this.gradepayData.find(
      (item) =>
        item.AMOUNT == recidence[0] && recidence[1] == item.RESIDENCE_TYPE_NAME
    );

    if (castid !== undefined) {
      this.GradePay_ID1 = castid.AMOUNT;
      this.RESIDENCE_TYPE_NAME1 = castid.ID;
    } else {
      this.GradePay_ID1 = data;
      this.RESIDENCE_TYPE_NAME1 = 0;
    }

    // }else{
    //   this.GradePay_ID1 = this.OTHER_GRADE_PAY;
    //   this.RESIDENCE_TYPE_NAME1 = null;
    // }
    // this.isValidgp = this.gradepayData.some(
    //   (item) => item.AMOUNT.toString() === this.GradePay_ID1
    // );
    // return this.isValidgp;
  }

  @ViewChild('otpve') otpve: ElementRef;
  @ViewChild('otpve1') otpve1: ElementRef;
  @ViewChild('openregi') openregi: ElementRef;
  @ViewChild('openregi1') openregi1: ElementRef;
  @ViewChild('openregi2') openregi2: ElementRef;
  @ViewChild('clodeOTP') clodeOTP: ElementRef;
  @ViewChild('clodeOTP1') clodeOTP1: ElementRef;
  @ViewChild('clodemail') clodemail: ElementRef;
  @ViewChild('openotpmodemail') openotpmodemail: ElementRef;
  @ViewChild('openotpmodmobile') openotpmodmobile: ElementRef;
  @ViewChild('regsuccessmodal1111') regsuccessmodal1111: ElementRef;
  @ViewChild('rolemapmod') rolemapmod: ElementRef;

  @ViewChild('ngOtpInputttt') ngOtpInputttt: any;
  @ViewChild('pinChange') pinChange: any;
  statedata: any;
  closeModal() {
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
    this.RESIDENCE_TYPE_NAME1 = '';
    this.EMPLOYEE_CODE = '';
    this.EMAIL_ID = '';
    this.GRADE_PAY = '';
    this.OTHER_GRADE_PAY = '';
    this.GRASS_GRADE_PAY = '';
    this.GRADE_PAY_LEVEL_ID = '';
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
    this.router.navigateByUrl('/', { replaceUrl: false });
    this.pass1 = false;
    this.pass2 = false;
    this.isagreedisable = true;
  }

  closeModal1() {
    this.OTP = '';
    this.OTP1 = '';
    this.OTP11 = '';
    this.MOBILE_NO = '';
    this.PAN_CARD = '';
    this.APPROVAL_STATUS = '';
    this.emailtrue = false;
    this.emailload = false;
    this.otpSpinning = false;
    this.DESIGNATION = '';
    this.design_IDS1 = '';
    this.design_IDS = '';
    this.GradePay_ID = '';
    this.GradePay_ID1 = '';
    this.RESIDENCE_TYPE_NAME1 = '';
    this.OTHER_GRADE_PAY = '';
    this.EMPLOYEE_CODE = '';
    this.NAME = '';
    this.EMAIL_ID = '';
    this.GRADE_PAY = '';
    this.GRASS_GRADE_PAY = '';
    this.GRADE_PAY_LEVEL = '';
    this.GRADE_PAY_LEVEL_ID = '';
    this.PASSWORD = '';
    this.statedata = '';
    this.POSTED_CITY_ID = '';
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
    this.router.navigateByUrl('/', { replaceUrl: false });
    this.pass1 = false;
    this.pass2 = false;
    this.isagreedisable = true;
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

  isValidOtp(ENTER_OTP) {
    const expression = /^[0-9]+$/;
    return expression.test(String('' + ENTER_OTP).toLowerCase());
  }

  emailtrue: boolean = false;
  mobilevery: boolean = false;
  emailload: boolean = false;
  mobileload: boolean = false;

  verify() {
    if (this.OTP == '' || this.OTP.length < 6) {
      this.toast.error('OTP field cant be blank', '');
    } else if (!this.isValidOtp(this.OTP)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.mobileload = true;
      this.otpSpinning = true;
      this.api.verifyOTP(this.MOBILE_NO, this.OTP).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.mobileload = false;
            this.toast.success('OTP verified successfully.', '');
            this.OTP = '';
            this.PASSWORD = '';
            this.MOBILE_NO = this.MOBILE_NO;
            this.otpSpinning = false;
            var nd = document.getElementById('closeotpmobileee');
            nd?.click();
            this.openregi1.nativeElement.click();
            this.emailtrue = true;
            this.mobilevery = true;
          } else if (successCode['code'] == '300') {
            this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP = '';
            this.mobileload = false;
            this.otpSpinning = false;
          } else if (successCode['code'] == '400') {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.mobileload = false;
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something Went Wrong.Please Try Again', '');
          this.mobileload = false;
          this.otpSpinning = false;
        }
      );
    }
  }

  verify1() {
    if (this.OTP1 == '' || this.OTP1.length < 6) {
      this.toast.error('OTP field cant be blank', '');
    } else if (!this.isValidOtp(this.OTP1)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.otpSpinning = true;
      this.emailload = true;
      this.api.verifyOTP1(this.EMAIL_ID, this.OTP1).subscribe(
        (successCode) => {
          this.emailload = false;
          if (successCode['code'] == '200') {
            this.toast.success('OTP verified successfully.', '');
            this.OTP1 = '';
            this.OTP = '';
            this.PASSWORD = '';
            this.otpSpinning = false;

            this.EMAIL_ID = this.EMAIL_ID;
            this.emailload = false;
            this.openregi1.nativeElement.click();

            this.clodeOTP1.nativeElement.click();
            // this.openregi2.nativeElement.click();
            this.emailtrue = true;
          } else if (successCode['code'] == '300') {
            this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP1 = '';
            this.emailload = false;
            this.otpSpinning = false;
          } else if (successCode['code'] == '400') {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.emailload = false;
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something Went Wrong.Please Try Again', '');
          this.emailload = false;
          this.otpSpinning = false;
        }
      );
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  checklogin() {
    if (
      this.PHONE == undefined ||
      (this.PHONE.toString().trim() == '' && this.IS_SIGNED_UP != 1)
    ) {
      this.toast.error('Please Enter Mobile No. / Email ID', '');
    } else if (
      this.PASSWORD == undefined ||
      this.PASSWORD.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Password', '');
    } else {
      if (this.IS_SIGNED_UP == 1) {
        this.PHONE = this.EMPLOYEE_CODE;
      } else {
        this.PHONE = this.PHONE;
      }
      // CryptoJS.MD5(this.PASSWORD).toString(CryptoJS.enc.Hex)
      if (this.PASSWORD != undefined) {
        this.otpSpinning = true;
        this.api
          .LoginUser(
            this.PHONE,
            CryptoJS.MD5(this.PASSWORD).toString(CryptoJS.enc.Hex)
          )
          .subscribe(
            (successCode) => {
              // this.otpSpinning = false;
              if (successCode['code'] == 200) {
                this.cookie.set(
                  'token',
                  successCode['data'][0]['token'],
                  365,
                  '',
                  '',
                  false,
                  'Strict'
                );
                sessionStorage.setItem('isLoggedIn', 'true');
                if (
                  successCode['data'][0]['UserData'][0]['USER_ID'] != null &&
                  successCode['data'][0]['UserData'][0]['USER_ID'] != '' &&
                  successCode['data'][0]['UserData'][0]['USER_ID'] != undefined
                ) {
                  sessionStorage.setItem(
                    'userId',
                    successCode['data'][0]['UserData'][0]['USER_ID']
                  );
                } else {
                  sessionStorage.setItem(
                    'userId',
                    successCode['data'][0]['UserData'][0]['EMP_ID']
                  );
                }
                sessionStorage.setItem(
                  'userName',
                  successCode['data'][0]['UserData'][0]['NAME']
                );

                sessionStorage.setItem(
                  'emailId',
                  successCode['data'][0]['UserData'][0]['EMAIL_ID']
                );
                sessionStorage.setItem(
                  'ddoId',
                  successCode['data'][0]['UserData'][0]['DDO_ID']
                );
                sessionStorage.setItem(
                  'parentUserID',
                  successCode['data'][0]['UserData'][0]['PARENT_USER_ID']
                );
                sessionStorage.setItem(
                  'roleId',
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'ROLE_ID'
                  ]
                );
                if (successCode['data'][0]['UserData'][0]['SIGNATURE_IDS']) {
                  sessionStorage.setItem(
                    'SIGNATURE_IDS',
                    successCode['data'][0]['UserData'][0]['SIGNATURE_IDS']
                  );
                }

                sessionStorage.setItem(
                  'roledata',
                  JSON.stringify(
                    successCode['data'][0]['UserData'][0]['ROLE_DETAILS']
                  )
                );
                sessionStorage.setItem(
                  'Empcode',
                  successCode['data'][0]['UserData'][0]['EMPLOYEE_CODE']
                );

                sessionStorage.setItem(
                  'level',
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'LEVEL'
                  ]
                );
                sessionStorage.setItem(
                  'roleName',
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'ROLE_NAME'
                  ]
                );

                if (
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'EMPLOYEE_MOBILE_NO'
                  ] != null &&
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'EMPLOYEE_MOBILE_NO'
                  ] != undefined &&
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'EMPLOYEE_MOBILE_NO'
                  ] != ''
                ) {
                  sessionStorage.setItem(
                    'loginmobileNo',
                    successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                    'EMPLOYEE_MOBILE_NO'
                    ]
                  );
                } else if (
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'USER_MOBILE'
                  ] != null &&
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'USER_MOBILE'
                  ] != '' &&
                  successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                  'USER_MOBILE'
                  ] != undefined
                ) {
                  sessionStorage.setItem(
                    'loginmobileNo',
                    successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                    'USER_MOBILE'
                    ]
                  );
                }

                if (
                  successCode['data'][0]['UserData'][0]['RESIDENCE_TYPE_IDS'] !=
                  null &&
                  successCode['data'][0]['UserData'][0]['RESIDENCE_TYPE_IDS'] !=
                  undefined &&
                  successCode['data'][0]['UserData'][0]['RESIDENCE_TYPE_IDS'] !=
                  ''
                ) {
                  sessionStorage.setItem(
                    'residanceids',
                    successCode['data'][0]['UserData'][0]['RESIDENCE_TYPE_IDS']
                  );
                }

                sessionStorage.setItem(
                  'clientmasterid',
                  successCode['data'][0]['UserData'][0]['CLIENT_MASTER_ID']
                );
                this.toast.success('Logged In Successfully', '');

                var rdataaa1: any = sessionStorage.getItem('roledata');
                var rdataaa: any = JSON.parse(rdataaa1);

                if (rdataaa.length > 1) {
                  var roled: any = sessionStorage.getItem('roledata');
                  this.roledata = JSON.parse(roled);
                  this.rolemapmod.nativeElement.click();
                } else {
                  if (
                    sessionStorage.getItem('AGT') == 'AGT' &&
                    Number(
                      successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                      'ROLE_ID'
                      ]
                    ) == 2
                  ) {
                    sessionStorage.removeItem('AGT');
                    this.router.navigateByUrl('/transfer-request');
                    this.router.navigate(['/transfer-request']).then(() => {
                      window.location.reload();
                    });
                  } else if (
                    sessionStorage.getItem('ITHR') == 'ITHR' &&
                    Number(
                      successCode['data'][0]['UserData'][0]['ROLE_DETAILS'][0][
                      'ROLE_ID'
                      ]
                    ) == 2
                  ) {
                    sessionStorage.removeItem('ITHR');
                    this.router.navigateByUrl('/it-hr');
                    this.router.navigate(['/it-hr']).then(() => {
                      window.location.reload();
                    });
                  } else {
                    if (
                      sessionStorage.getItem('roleId') == '17' ||
                      sessionStorage.getItem('roleId') == '58'
                    ) {
                      this.router.navigateByUrl('/admin/web-dashboard');
                      this.router
                        .navigate(['/admin/web-dashboard'])
                        .then(() => {
                          window.location.reload();
                        });
                    } else if (sessionStorage.getItem('roleId') == '1') {
                      this.router.navigateByUrl('/grass');
                      this.router.navigate(['/grass']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '52') {
                      this.router.navigateByUrl('/admin/web-dashboard');
                      this.router
                        .navigate(['/admin/web-dashboard'])
                        .then(() => {
                          window.location.reload();
                        });
                    } else if (
                      sessionStorage.getItem('roleId') == '53' ||
                      sessionStorage.getItem('roleId') == '59'
                    ) {
                      this.router.navigateByUrl('/admin/web-dashboard');
                      this.router
                        .navigate(['/admin/web-dashboard'])
                        .then(() => {
                          window.location.reload();
                        });
                    } else if (sessionStorage.getItem('roleId') == '54') {
                      this.router.navigateByUrl('/admin/web-dashboard');
                      this.router
                        .navigate(['/admin/web-dashboard'])
                        .then(() => {
                          window.location.reload();
                        });
                    } else if (sessionStorage.getItem('roleId') == '55') {
                      this.router.navigateByUrl('/admin/web-dashboard');
                      this.router
                        .navigate(['/admin/web-dashboard'])
                        .then(() => {
                          window.location.reload();
                        });
                    } else if (sessionStorage.getItem('roleId') == '15') {
                      this.router.navigateByUrl('/grass');
                      this.router.navigate(['/grass']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '14') {
                      this.router.navigateByUrl('/grass');
                      this.router.navigate(['/grass']).then(() => {
                        window.location.reload();
                      });
                    }
                    else if (sessionStorage.getItem('roleId') == '60') {
                      this.router.navigateByUrl('/grass');
                      this.router.navigate(['/grass']).then(() => {
                        window.location.reload();
                      });
                    }
                    // else if (sessionStorage.getItem('roleId') == '16') {
                    //   this.router.navigateByUrl('/gbs');
                    //   this.router.navigate(['/gbs']).then(() => {
                    //     window.location.reload();
                    //   });
                    // }
                    else if (sessionStorage.getItem('roleId') == '19') {
                      localStorage.setItem('serviceid', '6');
                      localStorage.setItem('isfirst', 'one');
                      this.router.navigateByUrl('/claim');
                      this.router.navigate(['/claim']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '20') {
                      localStorage.setItem('serviceid', '7');
                      localStorage.setItem('isfirst', 'one');
                      this.router.navigateByUrl('/claim');
                      this.router.navigate(['/claim']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '21') {
                      localStorage.setItem('serviceid', '4');
                      localStorage.setItem('isfirst', 'one');
                      this.router.navigateByUrl('/claim');
                      this.router.navigate(['/claim']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '22') {
                      localStorage.setItem('serviceid', '3');
                      localStorage.setItem('isfirst', 'one');
                      this.router.navigateByUrl('/claim');
                      this.router.navigate(['/claim']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '38') {
                      localStorage.setItem('serviceid', '3');
                      localStorage.setItem('isfirst', 'one');
                      this.router.navigateByUrl('/claim');
                      this.router.navigate(['/claim']).then(() => {
                        window.location.reload();
                      });
                    } else if (sessionStorage.getItem('roleId') == '51') {
                      this.router.navigateByUrl(
                        '/quarter_applications/quarter_applications_dashboard'
                      );
                      this.router
                        .navigate([
                          '/quarter_applications/quarter_applications_dashboard',
                        ])
                        .then(() => {
                          window.location.reload();
                        });
                    }
                    // else if (sessionStorage.getItem('roleId') == '24') {
                    //   this.router.navigateByUrl('/edms');
                    //   this.router.navigate(['/edms']).then(() => {
                    //     window.location.reload();
                    //   });
                    // }
                    else if (sessionStorage.getItem('roleId') == '18') {
                      this.router.navigateByUrl('/admin/web-dashboard');
                      this.router
                        .navigate(['/admin/web-dashboard'])
                        .then(() => {
                          window.location.reload();
                        });
                    }
                    // else if (sessionStorage.getItem('roleId') == '25') {
                    //   this.router.navigateByUrl('/edms');
                    //   this.router.navigate(['/edms']).then(() => {
                    //     window.location.reload();
                    //   });
                    // }
                    else if (
                      sessionStorage.getItem('roleId') == '47' ||
                      sessionStorage.getItem('roleId') == '46' ||
                      sessionStorage.getItem('roleId') == '48' ||
                      sessionStorage.getItem('roleId') == '49' ||
                      sessionStorage.getItem('roleId') == '50' ||
                      sessionStorage.getItem('roleId') == '56'
                    ) {
                      localStorage.setItem('isfirst', 'one');
                      this.router.navigateByUrl('/claim');
                      this.router.navigate(['/claim']).then(() => {
                        window.location.reload();
                      });
                    } else {
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                  }
                }
              } else if (successCode['code'] == '300') {
                this.toast.info(
                  'User already registered. Pending for verification.',
                  ''
                );
                this.otpSpinning = false;
              } else if (successCode['code'] == '404') {
                this.toast.error('Username or Password is incorrect', '');
                this.otpSpinning = false;
              } else {
                this.toast.error(
                  'Something went wrong please try later...',
                  ''
                );
                this.otpSpinning = false;
              }
            },
            (err) => {
              this.toast.error('Something went wrong please try later...', '');
              this.otpSpinning = false;
            }
          );
      }
    }
  }

  isValidMobile(mobile: string) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }

  check() {
    if (this.NAME == undefined || this.NAME.toString().trim() == '') {
      this.toast.error('Please Enter Full Name', '');
    } else if (
      this.MOBILE_NO == undefined ||
      this.MOBILE_NO.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Mobile No.', '');
    } else if (!this.isValidMobile(this.MOBILE_NO)) {
      this.toast.error('Please Enter Valid Mobile No.', '');
    } else {
      this.OTP = '';
      this.OTP11 = '';
      this.mobileload = true;
      if (this.MOBILE_NO != undefined) {
        this.otpSpinning = true;
        this.api.memberLogin(this.MOBILE_NO).subscribe(
          (successCode) => {
            this.otpSpinning = false;
            if (successCode['code'] == 200) {
              this.toast.success(
                'A 6 digit OTP sent via Message to verify your mobile number!',
                ''
              );
              this.mobileload = false;
              this.resendTrue = true;
              this.StartTimerMobile2();
              var nd = document.getElementById('register1111');
              nd?.click();
              var ndd = document.getElementById('regist11111');
              ndd?.click();
              this.otpve.nativeElement.click();
            } else if (successCode['code'] == '304') {
              this.toast.info('Mobile number is already registered', '');
              this.mobileload = false;
            } else if (successCode['code'] == '305') {
              this.toast.info('Mobile number is already registered.', '');
              this.mobileload = false;
            } else {
              this.toast.error('Something went wrong please try later...', '');
              this.mobileload = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...', '');
            this.mobileload = false;
          }
        );
      }
    }
  }

  check1() {
    if (this.NAME == undefined || this.NAME.toString().trim() == '') {
      this.toast.error('Please Enter Full Name', '');
    } else if (
      this.EMAIL_ID == undefined ||
      this.EMAIL_ID.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.EMAIL_ID)) {
      this.toast.error('Please Enter Valid Email ID', '');
    } else {
      this.OTP1 = '';
      this.OTP11 = '';
      if (this.EMAIL_ID != undefined) {
        this.emailload = true;
        this.api.emailotpsend(this.EMAIL_ID, this.EMPLOYEE_CODE).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.toast.success(
                'A 6 digit OTP sent via Email to verify your Email ID',
                ''
              );
              this.emailload = false;
              this.resendTrue = true;
              this.StartTimerMobile2();
              var nd = document.getElementById('emailregiClose');
              nd?.click();
              var ndd = document.getElementById('emailviribhb');
              ndd?.click();
              this.otpve1.nativeElement.click();
            } else if (successCode['code'] == '300') {
              this.toast.error('Something  went wrong please try later...', '');
              this.emailload = false;
            } else if (successCode['code'] == '304') {
              this.toast.info('Email ID is already registered.', '');
              this.emailload = false;
            } else if (successCode['code'] == '305') {
              this.toast.info('Email ID is already registered.', '');
              this.emailload = false;
            } else {
              this.toast.error('Something went wrong please try later...', '');
              this.emailload = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        );
      }
    }
  }
  closeeotp() {
    var nd = document.getElementById('emailotpcclose');
    nd?.click();
    this.openotpmodemail.nativeElement.click();
  }

  closeeotpppp() {
    var nd = document.getElementById('closeotpmobileee');
    nd?.click();
    this.openotpmodmobile.nativeElement.click();
  }
  resendOTPmobile() {
    this.api.memberLogin(this.MOBILE_NO).subscribe(
      (successCode) => {
        if (successCode['code'] == '200') {
          this.toast.success(
            'A 6 digit OTP sent via Message to verify your mobile number!',
            ''
          );
          this.StartTimerMobile2();
          this.resendTrue = true;
          this.OTP = '';
        } else {
          this.toast.error('Something went wrong please try later...', '');
        }
      },
      (err) => {
        this.toast.error('Something went wrong please try later...', '');
      }
    );
  }

  resendOTPemail() {
    this.api.emailotpsend(this.EMAIL_ID, this.EMPLOYEE_CODE).subscribe(
      (successCode) => {
        if (successCode['code'] == '200') {
          this.toast.success(
            'A 6 digit OTP sent via Message to verify your mobile number!',
            ''
          );
          this.StartTimerMobile2();
          this.resendTrue = true;
          this.OTP1 = '';
        } else {
          this.toast.error('Something went wrong please try later...', '');
        }
      },
      (err) => {
        this.toast.error('Something went wrong please try later...', '');
      }
    );
  }
  openloging() {
    var nd = document.getElementById('loginClose');
    nd?.click();
    this.openregi.nativeElement.click();
  }
  StartTimerMobile2() {
    this.showTimer = true;
    this.timerMobile = 0;
    this.myInterval2 = setInterval(() => {
      if (this.timerMobile == 180) {
        clearInterval(this.myInterval2);
        this.showTimer = false;
      } else {
        this.showTimer = true;
        this.timerMobile++;
      }
    }, 1000);
  }

  handleInputChange() {
    const validOptions = [
      'Level 1',
      'Level 2',
      'Level 3',
      'Level 4',
      'Level 5',
      'Level 6',
      'Level 7',
      'Level 8',
      'Level 9',
      'Level 10',
      'Level 11',
      'Level 12',
      'Level 13',
      'Level 14',
      'Level 15',
      'Level 16',
      'Level 17',
    ];

    if (!validOptions.includes(this.GRADE_PAY_LEVEL)) {
      // Show an error message or perform error handling logic here
      this.toast.error(
        'Invalid Grade Pay Level Entered. Please Select Valid Grade Pay Level'
      );
    }
  }

  Register() {
    if (this.NAME == undefined || this.NAME.toString().trim() == '') {
      this.toast.error('Please Enter Full Name', '');
    } else if (this.EMAIL_ID == '' || this.EMAIL_ID == undefined) {
      this.toast.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.EMAIL_ID)) {
      this.toast.error('Please Enter Valid Email ID', '');
    } else if (
      this.MOBILE_NO == undefined ||
      this.MOBILE_NO.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Mobile No.', '');
    } else if (!this.isValidMobile(this.MOBILE_NO)) {
      this.toast.error('Please Enter Valid Mobile No.', '');
    }
    //  else if (
    //   this.GRADE_PAY_LEVEL_ID == undefined ||
    //   this.GRADE_PAY_LEVEL_ID.toString().trim() == ''
    // ) {
    //   this.toast.error('Please Select Grade Pay Level', '');
    // } else if (!this.isValidgradepay) {
    //   this.toast.error(
    //     'Invalid Grade Pay Level. Please select from the valid options.',
    //     ''
    //   );
    // } else if (
    //   this.GradePay_ID == undefined ||
    //   this.GradePay_ID.toString().trim() == ''
    // ) {
    //   this.toast.error('Please Select Grade pay', '');
    // }
    // else if (!this.isValidgp) {
    //   this.toast.error(
    //     'Invalid Grade Pay. Please select from the valid options.',
    //     ''
    //   );
    // }
    // else if (this.OTHER_GRADE_PAY == undefined || this.OTHER_GRADE_PAY.toString().trim() == '') {
    //   this.toast.error('Please enter your grade pay.',);
    // }
    //
    else if (
      this.EMPLOYEE_CODE == undefined ||
      this.EMPLOYEE_CODE.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Employee Code', '');
    } else if (
      this.PASSWORD == undefined ||
      this.PASSWORD.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Password');
    } else if (!this.isValidPassword(this.PASSWORD)) {
      this.toast.error(
        'Enter Minimum 8 Alphanumeric Characters With Special Symbols.'
      );
    } else if (this.PASSWORD != this.CONFIRM_PASSWORD) {
      this.toast.error('Confirm Password and Password Must Be Same');
    } else {
      this.MOBILE_NO = this.MOBILE_NO == undefined ? '' : this.MOBILE_NO;
      var data = {
        NAME: this.NAME,
        EMAIL_ID: this.EMAIL_ID,
        MOBILE_NO: this.MOBILE_NO,
        DESIGNATION_ID: null,
        GRADE_PAY_LEVEL_ID: null,
        POSTED_CITY_ID: null,
        PAN_CARD: null,
        GRADE_PAY: null,
        GRASS_GRADE_PAY: null,
        GRAAS_GRADE_PAY_ID: null,
        EMPLOYEE_CODE: this.EMPLOYEE_CODE,
        ID_PROOF: null,
        CLIENT_ID: 1,
        APPROVAL_STATUS: 'P',
        PASSWORD: CryptoJS.MD5(this.PASSWORD).toString(CryptoJS.enc.Hex),
      };
      this.otpSpinning = true;
      this.api.memberRegister(data).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.regsuccessmodal1111.nativeElement.click();
            this.otpSpinning = false;
          } else if (successCode['code'] == '300') {
            this.toast.error('Employee already registered', '');
            this.otpSpinning = false;
          } else {
            this.toast.error('Something went wrong please try later...', '');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later...', '');
          this.otpSpinning = false;
        }
      );
    }
  }

  cloderegistermodakl() {
    window.location.reload();
  }
  isagreedisable = true;
  Rulesandapply = false;
  drawerVisible = false;
  agrreconfirmation() {
    var nd = document.getElementById('pppvacy');
    nd?.click();
    this.Rulesandapply = true;
    this.drawerVisible = true;
  }
  agrreconfirmation1() {
    this.isagreedisable = !this.isagreedisable;
  }
  fileURL1: any;
  folderName = 'idProof';
  image: any;
  handleOk(): void {
    this.Rulesandapply = false;
    this.openregi1.nativeElement.click();
  }
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;
  checkImagedoc(event: any) {
    if (event.target.files.length == 0) {
      this.toast.error('Please Select ID Proof', '');
      this.image = null;
    } else if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'application/pdf'
    ) {
      this.image = <File>event.target.files[0];
    } else {
      this.toast.error('Please select olny JPEG/ JPG/ PNG/ pdf files.', '');
      this.image = null;
    }
    if (this.image != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.image.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      if (this.ID_PROOF != undefined && this.ID_PROOF.trim() != '') {
        var arr = this.ID_PROOF.split('/');
        if (arr.length > 1) {
          url = arr[0];
        }
      }
      this.ID_PROOF = url;
      this.uploadImagedoc();
    }
  }
  imgurl = appkeys.retriveimgUrl;

  uploadImagedoc() {
    var fileURL = this.image;
    var url = this.ID_PROOF;
    this.progressBar = true;
    this.timer = this.api.onUploadidproof1('idProof', fileURL, url).subscribe(
      (successCode) => {
        if (successCode.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(
            (100 * successCode.loaded) / successCode.total
          );
          this.percent = percentDone;
          // if (this.percent == 100) {
          //   this.toast.success('ID Proof Uploaded Successfully');
          // }
        } else if (successCode.type == 2 && successCode.status != 200) {
          this.toast.error('Failed To Upload ID Proof', '');
          this.progressBar = false;
          this.percent = 0;
          this.ID_PROOF = null;
        } else if (successCode.type == 4 && successCode.status == 200) {
          if (successCode.body['code'] == 200) {
            this.toast.success('ID Proof Uploaded Successfully', '');
          }
        }
      },
      (err) => {
        this.toast.error('Failed To Upload ID Proof', '');
        this.ID_PROOF = null;
      }
    );
  }

  clearcaste(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.ID_PROOF = null;
          this.progressBar = false;
          this.percent = 0;
        } else {
          this.toast.error('Failed to delete ID Proof', '');
        }
      },
      (err) => {
        this.toast.error('Failed to delete ID Proof', '');
      }
    );
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  omit111(event: any) {
    const charCode = event.which || event.keyCode;
    // Allow only numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      return false;
    }
    return true;
  }
  alphaonly(event) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }

  showforgot1: boolean = false;
  showforgot2: boolean = false;
  showforgot3: boolean = false;

  forgotPass() {
    this.showforgot1 = true;
    this.showforgot2 = false;
    this.showforgot3 = false;
  }
  changedtext: any = 'Change Mobile No./ Email';
  isEmail: boolean;
  checknumber() {
    if (this.PHONE == undefined || this.PHONE.toString().trim() == '') {
      this.toast.error('Please Enter Mobile No. Or Email ID', '');
    } else if (
      this.EMPLOYEE_CODE == undefined ||
      this.EMPLOYEE_CODE.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Employee Code', '');
    } else {
      this.OTP = '';
      if (this.PHONE != undefined) {
        this.otpSpinning = true;
        this.api
          .websiteForgetPassword(this.PHONE, this.EMPLOYEE_CODE)
          .subscribe(
            (successCode) => {
              if (successCode['code'] == 200) {
                this.toast.success(
                  'A 6 digit OTP sent via Message to verify your Email ID!',
                  ''
                );
                this.resendTrue = true;
                let phone = this.PHONE;
                this.isEmail = phone.includes('@');
                this.changedtext = this.isEmail
                  ? 'Change Email'
                  : 'Change Mobile No.';
                this.showforgot2 = true;
                this.showforgot1 = false;
                this.showforgot3 = false;
                this.StartTimerMobile2();
                this.otpSpinning = false;
              } else if (successCode['code'] == '404') {
                this.toast.error(
                  'Email ID or Employee Code does not match.',
                  ''
                );
                this.otpSpinning = false;
              }
              // else if (successCode['code'] == '304') {
              //   this.toast.info(
              //     'User is registered. Pending for verification.',
              //     ''
              //   );
              //   this.otpSpinning = false;
              // }
              else {
                this.toast.error(
                  'Something went wrong please try later...',
                  ''
                );
                this.otpSpinning = false;
              }
            },
            (err) => {
              this.toast.error('Something went wrong please try later...', '');
              this.otpSpinning = false;
            }
          );
      }
    }
  }

  verifynumber() {
    if (this.OTP11 == '' || this.OTP11.length < 6) {
      this.toast.error("OTP field can't be blank", '');
    } else if (!this.isValidOtp(this.OTP11)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.otpSpinning = true;
      this.api.verifyOTP3(this.PHONE, this.OTP11).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.toast.success('OTP Verified Successfully.', '');
            this.otpSpinning = false;
            this.OTP11 = this.OTP11;
            this.showforgot1 = false;
            this.showforgot2 = false;
            this.showforgot3 = true;
          } else if (successCode['code'] == '404') {
            this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP11 = '';
            this.otpSpinning = false;
          } else if (successCode['code'] == '400') {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.otpSpinning = false;
          } else {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something Went Wrong.Please Try Again', '');
          this.otpSpinning = false;
        }
      );
    }
  }

  openloginmod() {
    this.showforgot1 = true;
    this.showforgot2 = false;
    this.showforgot3 = false;
    this.newprocess = false;
    this.newprocessotp = false;
    this.OTP11 = '';
    this.IS_SIGNED_UP = null;
  }
  openloginmod111() {
    this.showforgot1 = false;
    this.showforgot2 = false;
    this.showforgot3 = false;
    this.newprocess = false;
    this.newprocessotp = false;
    this.OTP11 = '';
    this.IS_SIGNED_UP = null;
  }
  isValidPassword(password: string) {
    const expression =
      /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return expression.test(String('' + password).toLowerCase());
  }
  Changepass() {
    if (!this.isValidPassword(this.PASS)) {
      this.toast.error('Please Enter Valid Password', '');
    } else if (this.PASS == undefined || this.PASS.toString().trim() == '') {
      this.toast.error('Please Enter Password', '');
    } else if (this.PASS != this.CPASS) {
      this.toast.error('New Password And Retype Password Must Be Same', '');
    } else {
      this.otpSpinning = true;
      this.api
        .changepasss(
          this.PHONE,
          CryptoJS.MD5(this.PASS).toString(CryptoJS.enc.Hex)
        )
        .subscribe(
          (successCode) => {
            this.otpSpinning = false;
            if (successCode['code'] == '200') {
              this.toast.success('Password Changed Successfully.', '');
              this.PASSWORD = '';
              this.OTP = '';
              this.OTP11 = '';
              this.showforgot1 = false;
              this.showforgot2 = false;
              this.showforgot3 = false;
              this.CPASS = '';
              this.PASS = '';
            } else if (successCode['code'] == '300') {
              this.toast.error('Something Went Wrong.Please Try Again.', '');
              this.OTP = '';
            } else if (successCode['code'] == '400') {
              this.toast.error('Something Went Wrong.Please Try Again.', '');
            }
          },
          (err) => {
            this.toast.error('Something Went Wrong.Please Try Again.', '');
          }
        );
    }
  }

  @Output() getAllFilter: any = new EventEmitter();

  changerole(event: any) {
    sessionStorage.setItem('roleId', event.ROLE_ID);
    sessionStorage.setItem('roleName', event.ROLE_NAME);
    localStorage.setItem('isfirst', 'one');
    localStorage.setItem('firsttime', 'true');
    // if (event.ROLE_ID == 2) {
    // 	sessionStorage.setItem('userId', event.EMP_ID);
    // } else {
    // 	sessionStorage.setItem('userId', event.USER_ID);
    // }
    if (
      sessionStorage.getItem('roleId') == '17' ||
      sessionStorage.getItem('roleId') == '58'
    ) {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '52') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '53') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '54') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '55') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '1') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/grass');
      this.router.navigate(['/grass']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '15') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/grass');
      this.router.navigate(['/grass']).then(() => {
        window.location.reload();
      });
    } else if ((sessionStorage.getItem('roleId') == '14') || (sessionStorage.getItem('roleId') == '60')) {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/grass');
      this.router.navigate(['/grass']).then(() => {
        window.location.reload();
      });
    }
    // else if (sessionStorage.getItem('roleId') == '16') {
    //   var nd = document.getElementById('rolemapmodclosed');
    //   nd?.click();
    //   this.getAllFilter.emit();
    //   this.router.navigateByUrl('/gbs');
    //   this.router.navigate(['/gbs']).then(() => {
    //     window.location.reload();
    //   });
    // }
    else if (sessionStorage.getItem('roleId') == '19') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      localStorage.setItem('serviceid', '6');
      localStorage.setItem('isfirst', 'one');
      this.router.navigateByUrl('/claim');
      this.router.navigate(['/claim']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '20') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      localStorage.setItem('serviceid', '7');
      localStorage.setItem('isfirst', 'one');
      this.router.navigateByUrl('/claim');
      this.router.navigate(['/claim']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '21') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      localStorage.setItem('serviceid', '4');
      localStorage.setItem('isfirst', 'one');
      this.router.navigateByUrl('/claim');
      this.router.navigate(['/claim']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '22') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      localStorage.setItem('serviceid', '3');
      localStorage.setItem('isfirst', 'one');
      this.router.navigateByUrl('/claim');
      this.router.navigate(['/claim']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '38') {
      localStorage.setItem('serviceid', '3');
      localStorage.setItem('isfirst', 'one');
      this.router.navigateByUrl('/claim');
      this.router.navigate(['/claim']).then(() => {
        window.location.reload();
      });
    }
    // else if (sessionStorage.getItem('roleId') == '24') {
    //   var nd = document.getElementById('rolemapmodclosed');
    //   nd?.click();
    //   this.getAllFilter.emit();
    //   this.router.navigateByUrl('/edms');
    //   this.router.navigate(['/edms']).then(() => {
    //     window.location.reload();
    //   });
    // }
    else if (sessionStorage.getItem('roleId') == '18') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    }
    // else if (sessionStorage.getItem('roleId') == '25') {
    //   var nd = document.getElementById('rolemapmodclosed');
    //   nd?.click();
    //   this.getAllFilter.emit();
    //   this.router.navigateByUrl('/edms');
    //   this.router.navigate(['/edms']).then(() => {
    //     window.location.reload();
    //   });
    // }
    else if (
      sessionStorage.getItem('roleId') == '47' ||
      sessionStorage.getItem('roleId') == '46' ||
      sessionStorage.getItem('roleId') == '48' ||
      sessionStorage.getItem('roleId') == '49' ||
      sessionStorage.getItem('roleId') == '50' ||
      sessionStorage.getItem('roleId') == '56'
    ) {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      localStorage.setItem('serviceid', '3');
      localStorage.setItem('isfirst', 'one');
      this.router.navigateByUrl('/claim');
      this.router.navigate(['/claim']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '51') {
      var nd = document.getElementById('rolemapmodclosed');
      nd?.click();
      this.getAllFilter.emit();
      this.router.navigateByUrl(
        '/quarter_applications/quarter_applications_dashboard'
      );
      this.router
        .navigate(['/quarter_applications/quarter_applications_dashboard'])
        .then(() => {
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
    this.toast.success('Your role has been changed successfully', '');
  }

  changepass: changepassword = new changepassword();
  RETYPE_PASSWORD: any = '';
  @ViewChild('closechangeppp') closechangeppp: ElementRef;

  changepasss() {
    if (this.changepass.PASSWORD == '' || this.changepass.PASSWORD == null) {
      this.toast.error('Please Enter Old Password');
    } else if (
      this.changepass.NEW_PASSWORD == '' ||
      this.changepass.NEW_PASSWORD == null
    ) {
      this.toast.error('Please Enter New Password');
    } else if (!this.isValidPassword(this.changepass.NEW_PASSWORD)) {
      this.toast.error('Please Enter Valid New Password');
    } else if (this.changepass.PASSWORD == this.changepass.NEW_PASSWORD) {
      this.toast.error('Old And New Password Are Same');
    } else if (this.changepass.PASSWORD == this.RETYPE_PASSWORD) {
      this.toast.error('Old And Retype Password Are Same');
    } else if (this.changepass.NEW_PASSWORD != this.RETYPE_PASSWORD) {
      this.toast.error('New Password And Retype Password Are Not Same');
    } else {
      this.changepass.ID = Number(sessionStorage.getItem('userId'));
      this.changepass.NEW_PASSWORD = CryptoJS.MD5(
        this.changepass.NEW_PASSWORD
      ).toString(CryptoJS.enc.Hex);
      this.changepass.PASSWORD = CryptoJS.MD5(
        this.changepass.PASSWORD
      ).toString(CryptoJS.enc.Hex);
      this.otpSpinning = true;
      if (this.rroleIdd == 2) {
        this.api.changepasswordemployee(this.changepass).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.otpSpinning = false;
              this.toast.success('Password Changed Successfully');
              this.changepass.NEW_PASSWORD = '';
              this.changepass.PASSWORD = '';
              this.closechangeppp.nativeElement.click();
            } else if (successCode['code'] == '303') {
              this.toast.error('New Password Not Match To The Old Password.');
              this.otpSpinning = false;
            } else {
              this.toast.error('Something went wrong please try later...');
              this.otpSpinning = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...');
            this.otpSpinning = false;
          }
        );
      } else {
        this.api.changepassworduser(this.changepass).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.otpSpinning = false;
              this.toast.success('Password Changed Successfully');
              this.changepass.NEW_PASSWORD = '';
              this.changepass.PASSWORD = '';
              this.closechangeppp.nativeElement.click();
            } else if (successCode['code'] == '303') {
              this.toast.error('New Password Not Match To The Old Password.');
              this.otpSpinning = false;
            } else {
              this.toast.error('Something went wrong please try later...');
              this.otpSpinning = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...');
            this.otpSpinning = false;
          }
        );
      }
    }
  }

  Roleservises: any = [];
  rolecountw: any = 0;
  getrolewiseservice() {
    this.api
      .getservices(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS=1 ')
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.Roleservises = data['data'];
          this.rolecountw = data['count'];
        }
      });
  }

  ROLEDATA: any = [];
  SERVICE_ROUTERLINK: any;
  loadserv: any;

  @ViewChild('exampleModal111w') exampleModal111w: ElementRef;
  @ViewChild('ggggggggg11') ggggggggg11: ElementRef;
  @ViewChild('outofservice1') outofservice1: ElementRef;
  storeserviceid(data, title) {
    var sanitizedTitle = title.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    localStorage.setItem('serviceid', data);
    localStorage.setItem('storservTrue', 'T');
    this.router.navigate(['/service/' + aa]);
    if (localStorage.getItem('storservTrue') == 'T') {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      localStorage.removeItem('storservTrue');
    }
  }

  getServices(data: any) {
    localStorage.setItem('serviceid', data);
    this.loadserv = localStorage.getItem('serviceid');
    this.api
      .getservices(0, 0, '', 'desc', ' AND STATUS=1 AND ID=' + this.loadserv)
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.SERVICE_ROUTERLINK = data['data'][0]['SERVICE_ROUTE'];
          this.ROLEDATA = data['data'][0]['ROLE_DATA'];
          this.openServiceAdmin();
        }
      });
  }
  openServiceAdmin() {
    if (
      sessionStorage.getItem('isLoggedIn') != undefined &&
      sessionStorage.getItem('isLoggedIn') != null
    ) {
      localStorage.setItem('isfirst', 'one');
      localStorage.setItem('firsttime', 'true');
      if (
        this.SERVICE_ROUTERLINK != '' &&
        this.SERVICE_ROUTERLINK != null &&
        this.SERVICE_ROUTERLINK != undefined
      ) {
        var sessionroleId = sessionStorage.getItem('roleId');
        var ids = this.ROLEDATA.split(',');
        if (ids.findIndex((x) => x == sessionroleId) > -1) {
          this.getAllFilter.emit();
          this.router.navigateByUrl(this.SERVICE_ROUTERLINK, {
            replaceUrl: false,
          });
        } else {
          this.outofservice1.nativeElement.click();
        }
      } else {
        this.ggggggggg11.nativeElement.click();
      }
    } else {
      this.exampleModal111w.nativeElement.click();
    }
  }
  IS_EMAIL: any;
  IS_MOBILE: any;
  disbalemobile: any = false;
  disableemailid: any = false;
  showcheckdata: any = false;
  IS_SIGNED_UP: any = null;
  showwwmail: boolean = false;
  showwwmobile: boolean = false;
  statusssss: any;
  checkemail() {
    if (
      this.EMPLOYEE_CODE == undefined ||
      this.EMPLOYEE_CODE.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Employee Code', '');
    }
    // else if (!this.emailpattern.test(this.PHONE)) {
    //   this.toast.error("Please Enter Valid Email ID", "");
    // }
    else {
      // CryptoJS.MD5(this.PASSWORD).toString(CryptoJS.enc.Hex)
      // if (this.PHONE != undefined ) {
      this.otpSpinning = true;
      this.api.checkmailid(this.EMPLOYEE_CODE).subscribe(
        (successCode) => {
          // this.otpSpinning = false;
          if (successCode['code'] == 200) {
            this.statusssss = successCode['data'].STATUS;
            if (successCode['data'].STATUS == 0) {
              this.toast.info(
                'Your account already exists in our database. Please contact the administrator to activate your account',
                ' '
              );
            } else {
              this.IS_SIGNED_UP = successCode['data'].IS_SIGNED_UP;

              this.IS_EMAIL = successCode['data'].IS_EMAIL;
              this.IS_MOBILE = successCode['data'].IS_MOBILE;
              // this.NAME = successCode["data"]["USER_DATA"].NAME;
              // this.MOBILE_NO = successCode["data"]["USER_DATA"].MOBILE_NO;
              // if (this.MOBILE_NO) {
              //   this.disbalemobile = true;
              // } else {
              //   this.disbalemobile = false;
              // }

              if (this.IS_SIGNED_UP == 1) {
                this.toast.info('Employee already registered', '');
                this.disableemailid = true;
              } else {
                if (this.IS_EMAIL == 1) {
                  this.toast.info('Enter Name Based Email Id', '');
                  this.showwwmail = true;
                  this.showwwmobile = false;
                } else if (this.IS_MOBILE == 1) {
                  this.toast.info('Enter Mobile Number', '');
                  this.showwwmail = false;
                  this.showwwmobile = true;
                } else {
                  this.toast.info(
                    'Email id and Mobile Number is not present in our database please register ',
                    ' '
                  );
                  this.newprocess = true;
                }
                this.EMPLOYEE_ID = successCode['data'].EMPLOYEE_ID;
                this.disableemailid = true;
              }

              this.showcheckdata = true;
            }
            this.otpSpinning = false;
          } else if (successCode['code'] == '300') {
            this.toast.info(
              'User already registered. Pending for verification.',
              ''
            );
            this.otpSpinning = false;
          }
          //  else if (successCode['code'] == '404') {
          //   this.toast.error('Username or Password is incorrect', '');
          //   this.otpSpinning = false;
          // }
          else if (successCode['code'] == '401') {
            this.toast.error(
              'This Employee Code is not present in out database please register',
              ''
            );
            // this.toast.error("Please Enter Your Official Email ID", "");
            this.newprocess = true;
            this.otpSpinning = false;
          } else {
            this.toast.error('Something went wrong please try later...', '');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later...', '');
          this.otpSpinning = false;
        }
      );
      // }
    }
  }

  getotpfornewprocessmobile() {
    // this.EMAIL_ID = this.PHONE;
    this.OTP1 = '';
    if (this.EMAIL_ID != undefined) {
      this.emailload = true;
      this.api
        .emailotpsendnewwmobile(this.MOBILE_NO, this.EMPLOYEE_CODE)
        .subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.toast.success(
                'A 6 digit OTP sent via Email to verify your Mobile Number',
                ''
              );
              this.emailload = false;
              this.resendTrue = true;
              this.newprocess = true;
              this.newprocessotp = true;

              this.StartTimerMobile2();
              // var nd = document.getElementById("loginClose");
              // nd?.click();
              // var ndd = document.getElementById("emailviribhb");
              // ndd?.click();
              // this.otpve1.nativeElement.click();
            } else if (successCode['code'] == '300') {
              // this.toast.error("Please Enter valid Employee Code", "");
              this.toast.error(
                'Mobile number does not match our database. Please register.',
                ''
              );

              this.errormsgformobile = true;
              this.emailload = false;
            } else if (successCode['code'] == '400') {
              this.toast.error('Please Enter valid Employee Code', '');
              this.emailload = false;
            }

            // }
            else {
              this.toast.error('Something went wrong please try later...', '');
              this.emailload = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        );
    }
  }
  getotpfornewprocessemail() {
    this.EMAIL_ID = this.PHONE;
    this.OTP1 = '';
    if (this.EMAIL_ID != undefined) {
      this.emailload = true;
      this.api
        .emailotpsendnewwemail(this.EMAIL_ID, this.EMPLOYEE_CODE)
        .subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.toast.success(
                'A 6 digit OTP sent via Email to verify your Email ID',
                ''
              );
              this.emailload = false;
              this.resendTrue = true;
              this.newprocess = true;
              this.newprocessotp = true;

              this.StartTimerMobile2();
              // var nd = document.getElementById("loginClose");
              // nd?.click();
              // var ndd = document.getElementById("emailviribhb");
              // ndd?.click();
              // this.otpve1.nativeElement.click();
            } else if (successCode['code'] == '300') {
              if (this.IS_MOBILE) {
                this.errormsgforemail = true;
                this.toast.error(
                  'Email ID does not match in our database please use valid Email Id or skip the Email use Mobile Number for verfication',
                  ''
                );
              } else {
                this.toast.error(
                  'Email ID does not match in our database. Please use valid Email Id',
                  ''
                );
              }

              this.emailload = false;
            } else if (successCode['code'] == '400') {
              // this.toast.error("Please Enter valid Employee Code", "");
              this.emailload = false;
            }

            // }
            else {
              this.toast.error('Something went wrong please try later...', '');
              this.emailload = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        );
    }
  }
  getotpfornewprocess() {
    this.EMAIL_ID = this.PHONE;

    this.OTP1 = '';
    if (this.EMAIL_ID != undefined) {
      this.emailload = true;
      // this.api
      //   .emailotpsendnewmobilenewapi(this.EMAIL_ID, this.EMPLOYEE_CODE)
      //   .subscribe(
      this.api.emailotpsendneww(this.EMAIL_ID, this.EMPLOYEE_CODE).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.toast.success(
              'A 6 digit OTP sent via Email to verify your Email ID',
              ''
            );
            this.emailload = false;
            this.resendTrue = true;
            this.newprocess = true;
            this.newprocessotp = true;
            this.StartTimerMobile2();
            // var nd = document.getElementById("loginClose");
            // nd?.click();
            // var ndd = document.getElementById("emailviribhb");
            // ndd?.click();
            // this.otpve1.nativeElement.click();
          } else if (successCode['code'] == '400') {
            // this.toast.error("Please Enter valid Employee Code", "");
            this.emailload = false;
          }

          // }
          else {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later...', '');
          this.emailload = false;
        }
      );
    }
  }

  changemaill() {
    this.newprocess = false;
    this.PHONE = '';
    this.EMAIL_ID = '';
  }

  newprocess: boolean = false;
  newprocessotp: boolean = false;

  getotptoemail() {
    if (
      this.EMPLOYEE_CODE == undefined ||
      this.EMPLOYEE_CODE.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Employee Code', '');
    }
    // else if (!this.emailpattern.test(this.EMAIL_ID)) {
    //   this.toast.error('Please Enter Valid Email ID', '');
    // }
    else {
      this.EMAIL_ID = this.PHONE;
      this.OTP1 = '';
      if (this.EMAIL_ID != undefined) {
        this.emailload = true;
        this.api.emailotpsend(this.EMAIL_ID, this.EMPLOYEE_CODE).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.toast.success(
                'A 6 digit OTP sent via Email to verify your Email ID',
                ''
              );
              this.emailload = false;
              this.resendTrue = true;
              this.StartTimerMobile2();
              var nd = document.getElementById('loginClose');
              nd?.click();
              var ndd = document.getElementById('emailviribhb');
              ndd?.click();
              this.otpve1.nativeElement.click();
            } else if (successCode['code'] == '400') {
              this.toast.error('Please Enter valid Employee Code', '');
              this.emailload = false;
            }
            // else if (successCode['code'] == '304') {
            //   this.toast.info('Email ID is already registered.', '');
            //   this.emailload = false;
            // } else if (successCode['code'] == '305') {
            //   this.toast.info('Email ID is already registered.', '');
            //   this.emailload = false;
            // }
            else {
              this.toast.error('Something went wrong please try later...', '');
              this.emailload = false;
            }
          },
          (err) => {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        );
      }
    }
  }

  DOJ: any;

  get maxJoiningDate(): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
    return currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  emailverfy() {
    if (this.OTP1 == '' || this.OTP1.length < 6) {
      this.toast.error('OTP field cant be blank', '');
    } else if (!this.isValidOtp(this.OTP1)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.otpSpinning = true;
      this.emailload = true;
      this.api.verifyOTP1(this.EMAIL_ID, this.OTP1).subscribe(
        (successCode) => {
          this.emailload = false;
          if (successCode['code'] == '200') {
            this.toast.success('OTP verified successfully.', '');
            this.OTP1 = '';
            this.OTP = '';
            this.PASSWORD = '';
            this.otpSpinning = false;

            this.EMAIL_ID = this.EMAIL_ID;
            this.emailload = false;
            this.clodemail.nativeElement.click();
            this.openregi2.nativeElement.click();
            this.emailtrue = true;
          } else if (successCode['code'] == '300') {
            this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP1 = '';
            this.emailload = false;
            this.otpSpinning = false;
          } else if (successCode['code'] == '400') {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.emailload = false;
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something Went Wrong.Please Try Again', '');
          this.emailload = false;
          this.otpSpinning = false;
        }
      );
    }
  }
  drawerVisible1 = false;
  drawerData: any = [];
  drawerTitle: string = 'Profile Details';
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
  drawerClose(): void {
    this.drawerVisible1 = false;
    this.drawerVisible2 = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(whichopen: boolean) {
    this.drawerTitle = 'Profile Details';
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
                    // this.drawerVisible1 = true;
                    if (whichopen) {
                      this.drawerVisible1 = true;
                    } else {
                      this.drawerVisible2 = true;
                    }
                  } else {
                    this.empstatus = [];
                  }
                  if (whichopen) {
                    this.drawerVisible1 = true;
                  } else {
                    this.drawerVisible2 = true;
                  }
                } else {
                  this.toast.error(
                    'Something Went Wrong, Please Try Again Later.'
                  );
                }
              });
          }
        },
        (err) => {
          this.toast.error('Something Went Wrong, Please Try Again Later.');
        }
      );
  }

  drawerVisible2 = false;

  newProcessRegistration: boolean = false;
  verifyemailnewprocess() {
    if (this.OTP11 == '' || this.OTP11.length < 6) {
      this.toast.error("OTP field can't be blank", '');
    } else if (!this.isValidOtp(this.OTP11)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.otpSpinning = true;
      this.api.verifyemailotpsendnewprocess(this.PHONE, this.OTP11).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.toast.success('OTP Verified Successfully.', '');
            this.otpSpinning = false;
            this.OTP11 = this.OTP11;
            this.newProcessRegistration = true;
          } else if (successCode['code'] == '400') {
            this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP11 = '';
            this.otpSpinning = false;
          } else if (successCode['code'] == '404') {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.otpSpinning = false;
          } else {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something Went Wrong.Please Try Again', '');
          this.otpSpinning = false;
        }
      );
    }
  }

  newprocessregistrationcoomplete: boolean = false;

  Registernewprocess() {
    if (this.NAME == undefined || this.NAME.toString().trim() == '') {
      this.toast.error('Please Enter Full Name', '');
    } else if (this.EMAIL_ID == '' || this.EMAIL_ID == undefined) {
      this.toast.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.EMAIL_ID)) {
      this.toast.error('Please Enter Valid Email ID', '');
    } else if (
      this.MOBILE_NO == undefined ||
      this.MOBILE_NO.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Mobile No.', '');
    } else if (!this.isValidMobile(this.MOBILE_NO)) {
      this.toast.error('Please Enter Valid Mobile No.', '');
    } else if (
      this.EMPLOYEE_CODE == undefined ||
      this.EMPLOYEE_CODE.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Employee Code', '');
    } else if (this.DOJ == undefined || this.DOJ.toString().trim() == '') {
      this.toast.error('Please Select Date Of Joining', '');
    } else if (
      this.PLACE_OF_CURRENT_POSTING == undefined ||
      this.PLACE_OF_CURRENT_POSTING.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Place Of Current Posting', '');
    } else if (
      this.ID_PROOF == undefined ||
      this.ID_PROOF.toString().trim() == ''
    ) {
      this.toast.error('Please Select ID Proof', '');
    } else if (
      this.PASSWORD == undefined ||
      this.PASSWORD.toString().trim() == ''
    ) {
      this.toast.error('Please Enter Password');
    } else if (!this.isValidPassword(this.PASSWORD)) {
      this.toast.error(
        'Enter Minimum 8 Alphanumeric Characters With Special Symbols.'
      );
    } else if (this.PASSWORD != this.CONFIRM_PASSWORD) {
      this.toast.error('Confirm Password and Password Must Be Same');
    }
    // else if (
    //   this.PAY_SLIP == undefined ||
    //   this.PAY_SLIP.toString().trim() == ""
    // ) {
    //   this.toast.error("Please Select Latest Pay Slip", "");
    // }

    //  else if (
    //   this.GRADE_PAY_LEVEL_ID == undefined ||
    //   this.GRADE_PAY_LEVEL_ID.toString().trim() == ''
    // ) {
    //   this.toast.error('Please Select Grade Pay Level', '');
    // } else if (!this.isValidgradepay) {
    //   this.toast.error(
    //     'Invalid Grade Pay Level. Please select from the valid options.',
    //     ''
    //   );
    // } else if (
    //   this.GradePay_ID == undefined ||
    //   this.GradePay_ID.toString().trim() == ''
    // ) {
    //   this.toast.error('Please Select Grade pay', '');
    // }
    // else if (!this.isValidgp) {
    //   this.toast.error(
    //     'Invalid Grade Pay. Please select from the valid options.',
    //     ''
    //   );
    // }
    // else if (this.OTHER_GRADE_PAY == undefined || this.OTHER_GRADE_PAY.toString().trim() == '') {
    //   this.toast.error('Please enter your grade pay.',);
    // }
    //
    else {
      this.MOBILE_NO = this.MOBILE_NO == undefined ? '' : this.MOBILE_NO;
      var data = {
        NAME: this.NAME,
        EMAIL_ID: this.EMAIL_ID,
        MOBILE_NO: this.MOBILE_NO,
        EMPLOYEE_CODE: this.EMPLOYEE_CODE,
        ID_PROOF: this.ID_PROOF ? this.ID_PROOF : null,
        PAY_SLIP: this.PAY_SLIP ? this.PAY_SLIP : null,
        PLACE_OF_CURRENT_POSTING: this.PLACE_OF_CURRENT_POSTING,
        DOJ: this.datePipe.transform(this.DOJ, 'yyyy-MM-dd'),
        PASSWORD: CryptoJS.MD5(this.PASSWORD).toString(CryptoJS.enc.Hex),
        EMPLOYEE_ID: this.EMPLOYEE_ID ? this.EMPLOYEE_ID : 0,
        CLIENT_ID: 1,
      };

      this.otpSpinning = true;
      this.api.memberRegisternewprocess(data).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            // this.regsuccessmodal1111.nativeElement.click();
            this.otpSpinning = false;
            this.newprocessregistrationcoomplete = true;
          } else if (successCode['code'] == '300') {
            this.toast.error('Email Id already exists', '');
            this.otpSpinning = false;
          } else if (successCode['code'] == '301') {
            this.toast.error('Mobile number already exists', '');
            this.otpSpinning = false;
          } else if (successCode['code'] == '302') {
            this.toast.error('Employee code already exists.', '');
            this.otpSpinning = false;
          } else {
            this.toast.error('Something went wrong please try later...', '');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later...', '');
          this.otpSpinning = false;
        }
      );
    }
  }
  EMPLOYEE_ID: any;
  disableemployeecode: boolean = false;
  checkempcodeee() {
    if (this.EMPLOYEE_CODE.length == 6) {
      this.api.empget(this.EMPLOYEE_CODE).subscribe((data) => {
        if (data['code'] == 200) {
          this.disableemployeecode = true;
          this.NAME = data['data'][0]['NAME'];
          this.MOBILE_NO = data['data'][0]['MOBILE_NO'];
          this.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
          if (data['data'][0]['ID']) {
            this.EMPLOYEE_ID = data['data'][0]['ID'];
          }
        } else {
          this.disableemployeecode = true;
          this.EMPLOYEE_ID = 0;
        }
      });
    } else {
      this.toast.error('Please Enter Employee Code', '');
    }
  }

  Changeemployeecodeee() {
    this.disableemployeecode = false;
    this.NAME = '';

    this.MOBILE_NO = '';
    this.EMPLOYEE_CODE = '';
  }

  clearifproff() {
    this.ID_PROOF = '';
  }
  PAY_SLIP: any;
  clearifproffpay() {
    this.PAY_SLIP = '';
  }
  viewidproof(event: any) {
    if (event) window.open(this.api.retriveimgUrl + 'idProof/' + event);
  }
  viewidproofpay(event: any) {
    if (event) window.open(this.api.retriveimgUrl + 'paySlips/' + event);
  }

  adminloginn: boolean = false;

  adminlogin() {
    this.adminloginn = true;
    this.EMPLOYEE_CODE = '';
    this.PHONE = '';
  }
  backtoemployeelogin() {
    this.adminloginn = false;
    this.EMPLOYEE_CODE = '';
    this.PHONE = '';
  }

  checkImagedocpay(event: any) {
    if (event.target.files.length == 0) {
      this.toast.error('Please Select pay slip', '');
      this.image = null;
    } else if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'application/pdf'
    ) {
      this.image = <File>event.target.files[0];
    } else {
      this.toast.error('Please select olny JPEG/ JPG/ PNG/ pdf files.', '');
      this.image = null;
    }
    if (this.image != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.image.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      if (this.PAY_SLIP != undefined && this.PAY_SLIP.trim() != '') {
        var arr = this.PAY_SLIP.split('/');
        if (arr.length > 1) {
          url = arr[0];
        }
      }
      this.PAY_SLIP = url;
      this.uploadImagedocpay();
    }
  }

  PLACE_OF_CURRENT_POSTING: any;

  uploadImagedocpay() {
    var fileURL = this.image;
    var url = this.PAY_SLIP;
    this.progressBar = true;
    this.timer = this.api.onUploadidproof1('paySlips', fileURL, url).subscribe(
      (successCode) => {
        if (successCode.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(
            (100 * successCode.loaded) / successCode.total
          );
          this.percent = percentDone;
          // if (this.percent == 100) {
          //   this.toast.success('ID Proof Uploaded Successfully');
          // }
        } else if (successCode.type == 2 && successCode.status != 200) {
          this.toast.error('Failed To Upload latest Pay Slip', '');
          this.progressBar = false;
          this.percent = 0;
          this.PAY_SLIP = null;
        } else if (successCode.type == 4 && successCode.status == 200) {
          if (successCode.body['code'] == 200) {
            this.toast.success('latest Pay Slip Uploaded Successfully', '');
          }
        }
      },
      (err) => {
        this.toast.error('Failed To Upload latest Pay Slip', '');
        this.PAY_SLIP = null;
      }
    );
  }

  errormsgforemail = false;
  errormsgformobile = false;
  skipemail() {
    this.resendTrue = false;
    this.newprocessotp = false;
    this.newprocess = false;
    this.showwwmobile = true;
    this.showwwmail = false;
    this.errormsgforemail = false;
    this.errormsgformobile = false;
  }

  gotoregister() {
    this.newprocessregistrationcoomplete = false;
    this.newprocess = true;
    this.newprocessotp = false;
  }

  oldregistration: boolean = false;

  verifyemailnewprocessmail() {
    if (this.OTP11 == '' || this.OTP11.length < 6) {
      this.toast.error("OTP field can't be blank", '');
    } else if (!this.isValidOtp(this.OTP11)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.otpSpinning = true;
      this.api
        .verifyemailotpsendnewprocessnew(
          this.PHONE,
          this.OTP11,
          this.EMPLOYEE_CODE
        )
        .subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.toast.success('OTP Verified Successfully.', '');

              this.NAME = successCode['data']['NAME'];
              this.MOBILE_NO = successCode['data']['MOBILE_NO'];
              this.EMPLOYEE_CODE = successCode['data']['EMPLOYEE_CODE'];
              this.EMAIL_ID = successCode['data']['EMAIL_ID'];
              this.otpSpinning = false;
              this.OTP11 = this.OTP11;
              this.oldregistration = true;
            } else if (successCode['code'] == '300') {
              this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
              this.OTP11 = '';
              this.otpSpinning = false;
            } else if (successCode['code'] == '404') {
              this.toast.error('Something Went Wrong.Please Try Again', '');
              this.otpSpinning = false;
            } else {
              this.toast.error('Something Went Wrong.Please Try Again', '');
              this.otpSpinning = false;
            }
          },
          (err) => {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.otpSpinning = false;
          }
        );
    }
  }

  disableregistrationmobile: boolean = false;
  disableregistrationemail: boolean = false;
  disableregistrationname: boolean = false;

  verifyemailnewprocessMobile() {
    if (this.OTP11 == '' || this.OTP11.length < 6) {
      this.toast.error("OTP field can't be blank", '');
    } else if (!this.isValidOtp(this.OTP11)) {
      this.toast.error('Enter numeric characters only', '');
    } else {
      this.otpSpinning = true;
      this.api
        .verifyemailotpsendnewprocessnew(
          this.MOBILE_NO,
          this.OTP11,
          this.EMPLOYEE_CODE
        )
        .subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.toast.success('OTP Verified Successfully.', '');
              this.NAME = successCode['data']['NAME'];
              this.MOBILE_NO = successCode['data']['MOBILE_NO'];
              this.EMPLOYEE_CODE = successCode['data']['EMPLOYEE_CODE'];
              this.EMAIL_ID = successCode['data']['EMAIL_ID'];

              if (this.NAME) {
                this.disableregistrationname = true;
              } else {
                this.disableregistrationname = false;
              }
              if (this.MOBILE_NO) {
                this.disableregistrationmobile = true;
              } else {
                this.disableregistrationmobile = false;
              }
              if (this.EMAIL_ID) {
                this.disableregistrationemail = true;
              } else {
                this.disableregistrationemail = false;
              }

              this.otpSpinning = false;
              this.OTP11 = this.OTP11;
              this.oldregistration = true;
            } else if (successCode['code'] == '300') {
              this.toast.error('Invalid OTP.Please Enter Correct OTP.', '');
              this.OTP11 = '';
              this.otpSpinning = false;
            } else if (successCode['code'] == '404') {
              this.toast.error('Something Went Wrong.Please Try Again', '');
              this.otpSpinning = false;
            } else {
              this.toast.error('Something Went Wrong.Please Try Again', '');
              this.otpSpinning = false;
            }
          },
          (err) => {
            this.toast.error('Something Went Wrong.Please Try Again', '');
            this.otpSpinning = false;
          }
        );
    }
  }

  ////////////////////////////////// New Process //////////////////////////////////////
  gotoregisterNew() {
    this.newprocessregistrationcoomplete = false;
    this.newprocess = true;
    this.newprocessotp = false;
    this.oldregistration = false;
  }

  getotpfornewprocessNewEmail() {
    this.EMAIL_ID = this.PHONE;

    this.OTP1 = '';
    if (this.EMAIL_ID != undefined) {
      this.emailload = true;
      this.api.emailotpsendnewemailnewapi(this.EMAIL_ID).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.toast.success(
              'A 6 digit OTP sent via Email to verify your Email ID',
              ''
            );
            this.emailload = false;
            this.resendTrue = true;
            this.newprocess = true;
            this.newprocessotp = true;
            this.StartTimerMobile2();
            // var nd = document.getElementById("loginClose");
            // nd?.click();
            // var ndd = document.getElementById("emailviribhb");
            // ndd?.click();
            // this.otpve1.nativeElement.click();
          } else if (successCode['code'] == '400') {
            // this.toast.error("Please Enter valid Employee Code", "");
            this.emailload = false;
          }

          // }
          else {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later...', '');
          this.emailload = false;
        }
      );
    }
  }

  getotpfornewprocessNewMobile() {
    this.MOBILE_NO;

    this.OTP1 = '';
    if (this.MOBILE_NO != undefined) {
      this.emailload = true;
      this.api.emailotpsendnewmobilenewapi(this.MOBILE_NO).subscribe(
        // this.api.emailotpsendneww(this.EMAIL_ID,this.EMPLOYEE_CODE).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.toast.success(
              'A 6 digit OTP sent via Email to verify your Email ID',
              ''
            );
            this.emailload = false;
            this.resendTrue = true;
            this.newprocess = true;
            this.newprocessotp = true;
            this.StartTimerMobile2();
            // var nd = document.getElementById("loginClose");
            // nd?.click();
            // var ndd = document.getElementById("emailviribhb");
            // ndd?.click();
            // this.otpve1.nativeElement.click();
          } else if (successCode['code'] == '400') {
            // this.toast.error("Please Enter valid Employee Code", "");
            this.emailload = false;
          }

          // }
          else {
            this.toast.error('Something went wrong please try later...', '');
            this.emailload = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later...', '');
          this.emailload = false;
        }
      );
    }
  }

  openloginmod111New() {
    this.showcheckdata = true;
    this.newprocess = false;
    this.showwwmail = false;
    this.showwwmobile = true;
    this.OTP = '';
    this.OTP1 = '';
    this.OTP11 = '';
  }

  opendesginationmodel: boolean = false;

  IS_ITHR_DATA: boolean = false;
  getemployeedata(eventtt: any) {
    this.api
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.employeedataaaa112323 = data['data'][0];
            if (
              data['data'][0].IS_ITHR_DATA == null ||
              data['data'][0].IS_ITHR_DATA == undefined
            ) {
              this.IS_ITHR_DATA = false;
            } else {
              this.IS_ITHR_DATA = data['data'][0].IS_ITHR_DATA;
            }
          }
        },
        (err) => { }
      );
  }
  empdata: any;
  employeedataaaa112323: any = [];
  employeedataaaa11111: any = [];
  changecader() {
    this.api
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.employeedataaaa11111 = data['data'][0];
            this.modelshowwwww = true;
          }
        },
        (err) => { }
      );
  }
  loadingRecords: boolean = false;

  modelshowwwww: boolean = false;

  handleOkkkkkkkkkkkkkk() {
    this.loadingRecords = true;
    this.api
      .updateprofile(this.employeedataaaa11111)
      .subscribe((successCode: any) => {
        if (successCode.code == '200') {
          this.loadingRecords = false;
          window.location.reload();
          this.toast.success('Cadre Changed Successfully...', '');
        } else {
          this.toast.error('Cadre Has Not Changed...', '');
          this.loadingRecords = false;
        }
      });
  }

  cancel121221() {
    this.modelshowwwww = false;
  }
}
