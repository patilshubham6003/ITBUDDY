import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { changepassword } from 'src/app/Modal/changepasswordho';
import { genertaeSenioritylist } from '../../Models/GenerateSeniorityList';
import { APIServicesService } from '../../Services/APIService.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [DatePipe],
})
export class SidebarComponent {
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datepipe: DatePipe,
    private router: Router,
    private toast: ToastrService,
    public cookie: CookieService
  ) { }
  RETYPE_PASSWORD;
  employeeID: any;
  dataList: any = [];
  Allotmentchecklistdata: any = [];
  ResidenceTypereq: any = [];
  Senioritylist: any = [];
  Waitinglist: any = [];
  Allotmentlistany: any = [];
  currentstage: any = [];
  datenew = new Date();
  Year: any;
  NextMonth: any;
  i = 0;

  onIndexChange(event: number): void {
    this.api
      .getAllotmenmaster(0, 0, '', '', ' AND EMPLOYEE_ID = ' + this.employeeID)
      .subscribe((data) => {
        this.totalRecords = data['count'];
        this.dataList = data['data'];
        if (event == 0) {
          this.currentstage['STEP_NO'] = event;
        }
        else if (Number(localStorage.getItem('currentstageid')) >= event) {
          if (event == 1) {
            this.currentstage['STEP_NO'] = event;
            this.router.navigate(['/grass/flatAvailabecompo'], {
              replaceUrl: true,
            });
          } else if (event == 2) {
            this.currentstage['STEP_NO'] = event;
            this.router.navigateByUrl('/grass/Senioritylistcomp');
          } else if (event == 3) {
            this.currentstage['STEP_NO'] = event;
            this.router.navigate(['/grass/Preferencescompo'], {
              replaceUrl: true,
            });
          } else if (event == 4) {
            this.currentstage['STEP_NO'] = event;
            this.router.navigate(['/grass/Allotmentcompo'], {
              replaceUrl: true,
            });
          } else if (event == 5) {
            this.currentstage['STEP_NO'] = event;
            this.router.navigate(['/grass/mis'], { replaceUrl: true });
          }
        } else if (this.totalRecords == 0) {
          if (event == 1 || event == 2 || event == 3 || event == 4) {
            this.message.info('Please Fill Application Form ', '');
          }
        } else if (this.totalRecords != 0) {
          if (event == 1) {
            if (this.dataList[0]['STATUS'] == 'P') {
              this.message.info('Your Application Is Under Process ', '');
            } else if (this.dataList[0]['STATUS'] == 'R') {
              this.message.info('Your Application Is Rejected.', '');
            } else {
              this.message.info('Vacancy Report not published yet', '');
            }
          }
          if (event == 2) {
            if (this.dataList[0]['STATUS'] == 'P') {
              this.message.info('Your Application Is Under Process ', '');
            } else if (this.dataList[0]['STATUS'] == 'R') {
              this.message.info('Your Application Is Rejected.', '');
            } else {
              this.message.info('Seniority Order Is Not Published Yet ', '');
            }
          }
          if (event == 3) {
            this.message.info('You Are Not Allowed For Preference', '');
          }
          if (event == 4) {
            this.message.info('You Are Not Allowed For Allotment', '');
          }
          if (event == 5) {
            this.message.info('You Are Not Allowed For MIS', '');
          }
        }
      });
  }
  dataaa: any;
  tabMIS: any = true;
  tabAllotment: any = true;
  Preferences: any = true;
  SeniorityList: any = true;
  falatavailabilityList: any = true;
  status: any;
  totalRecords: any;
  roledata: any = [];
  ngOnInit() {
    this.rroleIdd = sessionStorage.getItem('roleId');
    if (
      sessionStorage.getItem('roledata') != undefined &&
      sessionStorage.getItem('roledata') != null
    ) {
      var roled: any = sessionStorage.getItem('roledata');
      this.roledata = JSON.parse(roled);
    }
    this.Year = this.datenew.getFullYear();
    this.NextMonth = this.datenew.getMonth();
    this.employeeID = sessionStorage.getItem('userId');
    this.api
      .getstages(0, 0, '', 'desc', '', Number(sessionStorage.getItem('userId')))
      .subscribe(
        (data) => {
          this.currentstage = data['data'][0];
          this.dataaa = data['data'][0];
          localStorage.setItem('currentstageid', this.dataaa['STEP_NO']);
          if (Number(localStorage.getItem('currentstageid')) == 5) {
            // this.tabMIS = false;
          }
          if (Number(localStorage.getItem('currentstageid')) == 4) {
            this.tabMIS = false;
          }
          if (Number(localStorage.getItem('currentstageid')) == 3) {
            this.tabAllotment = false;
            this.tabMIS = false;
          }
          if (Number(localStorage.getItem('currentstageid')) == 2) {
            this.tabAllotment = false;
            this.tabMIS = false;
            this.Preferences = false;
          }
          if (Number(localStorage.getItem('currentstageid')) == 1) {
            this.tabAllotment = false;
            this.tabMIS = false;
            this.Preferences = false;
            this.SeniorityList = false;
          }
          if (Number(localStorage.getItem('currentstageid')) == 0) {
            this.tabAllotment = false;
            this.tabMIS = false;
            this.Preferences = false;
            this.SeniorityList = false;
            this.falatavailabilityList = false;
          }
          if (Number(localStorage.getItem('currentstageid')) == 5) {
            this.router.navigate(['/grass/mis'], { replaceUrl: true });
          } else if (Number(localStorage.getItem('currentstageid')) == 4) {
            this.router.navigate(['/grass/Allotmentcompo'], {
              replaceUrl: true,
            });
          } else if (Number(localStorage.getItem('currentstageid')) == 3) {
            this.router.navigate(['/grass/Preferencescompo'], {
              replaceUrl: true,
            });
          } else if (Number(localStorage.getItem('currentstageid')) == 2) {
            this.router.navigateByUrl('/grass/Senioritylistcomp');
          } else if (Number(localStorage.getItem('currentstageid')) == 1) {
            this.router.navigate(['/grass/flatAvailabecompo'], {
              replaceUrl: true,
            });
          }
        },
        (err) => { }
      );
  }

  movemis() {
    this.router.navigate(['/grass/mis']);
  }

  console() {
    this.router.navigate(['/my-profile']);
  }

  changerole(event: any) {
    sessionStorage.setItem('roleId', event.ROLE_ID);
    sessionStorage.setItem('roleName', event.ROLE_NAME);
    if (sessionStorage.getItem('roleId') == '17') {
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if ((sessionStorage.getItem('roleId') == '1') || (sessionStorage.getItem('roleId') == '60')) {
      this.router.navigateByUrl('/grass');
      this.router.navigate(['/grass']).then(() => {
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
    } else if (sessionStorage.getItem('roleId') == '16') {
      this.router.navigateByUrl('/gbs');
      this.router.navigate(['/gbs']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '19') {
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
    } else if (sessionStorage.getItem('roleId') == '24') {
      this.router.navigateByUrl('/edms');
      this.router.navigate(['/edms']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '18') {
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '25') {
      this.router.navigateByUrl('/edms');
      this.router.navigate(['/edms']).then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
    this.toast.success('Your role has been changed successfully', '');
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
  OTP = '';
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
  Changepass() {
    if (!this.isValidPassword(this.PASS)) {
      this.toast.error('Please Enter Valid Password', '');
    } else if (this.PASS == undefined || this.PASS.toString().trim() == '') {
      this.toast.error('Please Enter Password', '');
    } else if (this.PASS != this.CPASS) {
      this.toast.error('Password And Confirm Password Must Be Same', '');
    } else {
      this.otpSpinning = true;
      this.api.changepasss(this.PHONE, this.PASS).subscribe(
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
  changepass: changepassword = new changepassword();
  @ViewChild('closechangeppp') closechangeppp: ElementRef;
  rroleIdd: any;
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
      this.otpSpinning = true;
      this.changepass.NEW_PASSWORD = CryptoJS.MD5(this.changepass.NEW_PASSWORD).toString(CryptoJS.enc.Hex)
      this.changepass.PASSWORD = CryptoJS.MD5(this.changepass.PASSWORD).toString(CryptoJS.enc.Hex)

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
  logout() {
    this.cookie.deleteAll();
    sessionStorage.clear();
    localStorage.clear();
    this.toast.success('Logout Successfully', '');
    // setTimeout(() => {
    //   this.router.navigateByUrl('/', { replaceUrl: false });
    // }, 500);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
    this.router.navigateByUrl('/');
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  drawerTitle = '';
  drawerVisible = false;
  drawerData: genertaeSenioritylist = new genertaeSenioritylist();
  getNotification(): void {
    this.drawerTitle = 'Notifications';
    this.drawerData = new genertaeSenioritylist();
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  updatestep() {
    this.currentstage['STEP_NO'] = 1;
    this.currentstage['EMP_ID'] = Number(sessionStorage.getItem('userId'));

    this.api.updatestates(this.currentstage).subscribe((successCode) => {
      if (successCode.code == '200') {
      } else {
        this.message.error(' Failed To Update Information...', '');
      }
    });
  }

  youtubevideodrawer() {
    this.drawerVisibleYoutube = true;
    this.drawerTitleYoutube = 'Youtube Videos';
  }
  drawerVisibleYoutube = false;
  drawerTitleYoutube = '';
  drawerCloseYoutube() {
    this.drawerVisibleYoutube = false;
  }
  get closeCallbackYoutube() {
    return this.drawerCloseYoutube.bind(this);
  }
}
