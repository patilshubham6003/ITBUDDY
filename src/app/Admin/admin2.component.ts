import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { changepassword } from 'src/app/Modal/changepasswordho';
import { CookieService } from 'ngx-cookie-service';
import { genertaeSenioritylist } from '../grass/Models/GenerateSeniorityList';
import { ServiceService } from '../Service/service.service';
import * as CryptoJS from 'crypto-js';
import { WebsiteService } from '../Service/website.service';
@Component({
  selector: 'app-admin2',
  templateUrl: './admin2.component.html',
  styleUrls: ['./admin2.component.css'],
})
export class Admin2Component implements OnInit {
  isCollapsed = false;
  isLogedIn: any;
  roleId = Number(sessionStorage.getItem('roleId'));
  menus: any = [];
  USERNAME = sessionStorage.getItem('userName');
  scrHeight: any;
  scrWidth: any;
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    console.log(event);
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  Dwidth: any;

  constructor(
    private api: ServiceService,
    public api1: WebsiteService,
    public cookie: CookieService,
    public router: Router,
    // public toast: NzNotificationService,
    private toast: ToastrService
  ) {
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '90%';
    }
  }
  rroleIdd: any;
  roledata: any = [];
  @ViewChild('rolemapmod') rolemapmod: ElementRef;

  ngOnInit() {
    if (
      sessionStorage.getItem('userName') != undefined &&
      sessionStorage.getItem('userName') != null
    ) {
      sessionStorage.setItem('isLogedIn', 'true');
      this.isLogedIn = true;
      this.loadForms();
    } else {
      this.isLogedIn = false;
      sessionStorage.setItem('isLogedIn', 'false');
    }
    this.rroleIdd = sessionStorage.getItem('roleId');
    if (
      sessionStorage.getItem('roledata') != undefined &&
      sessionStorage.getItem('roledata') != null
    ) {
      var roled: any = sessionStorage.getItem('roledata');
      this.roledata = JSON.parse(roled);
    }
  }

  console() {
    this.router.navigate(['/my-profile']);
  }

  reports: any[] = [];
  loadForms() {
    this.api.getForms(this.roleId).subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        data['data'].forEach((element) => {
          element['children'].sort(this.sortFunction);

          if (element['children'].length == 0) delete element['children'];
        });

        this.reports = data['data'];

        for (let k = 0; k < this.reports.length; k++) {
          if (
            this.reports[k].title != 'Medical Reports' &&
            this.reports[k].title != 'File Reports' &&
            this.reports[k].title != 'LTC Reports' &&
            this.reports[k].title != 'Tour Reports' &&
            this.reports[k].title != 'Transfer Reports' &&
            this.reports[k].title != 'ITHR Reports'

          ) {
            this.menus.push(this.reports[k]);
          }
        }

        this.menus.sort(this.sortFunction);
      }
    });
  }
  sortFunction(a, b) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
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
  // @ViewChild('rolemapmod') rolemapmod: ElementRef;
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
          console.log(err);
        }
      );
    }
  }
  changepass: changepassword = new changepassword();
  @ViewChild('closechangeppp') closechangeppp: ElementRef;
  RETYPE_PASSWORD;

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
      this.api.changepasswordemployee(this.changepass).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.otpSpinning = false;
            this.toast.success('Password Changed Successfully');
            this.changepass.NEW_PASSWORD = '';
            this.changepass.PASSWORD = '';
            this.closechangeppp.nativeElement.click();
          } else if (successCode['code'] == '303') {
            this.toast.error('Old Password Not Match.');
            this.otpSpinning = false;
          } else {
            this.toast.error('Something went wrong please try later');
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.toast.error('Something went wrong please try later');
          this.otpSpinning = false;
          console.log(err);
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
    } else if (sessionStorage.getItem('roleId') == '54') {
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
        window.location.reload();
      });
    } else if (sessionStorage.getItem('roleId') == '55') {
      this.router.navigateByUrl('/admin/web-dashboard');
      this.router.navigate(['/admin/web-dashboard']).then(() => {
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

  logout() {
    this.api.logoutcall().subscribe((data) => {
      if (data['code'] == '200') {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.toast.success('Logout Successfully', '');
        this.router.navigateByUrl('/', { replaceUrl: false });

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
        // setTimeout(() => {
        //   this.router.navigateByUrl('/', { replaceUrl: false });
        // }, 500);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    });
  }

  //profile update
  drawerVisible1 = false;
  drawerData1: any = [];
  drawerTitle1: string = 'Profile Details';
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
  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add() {
    this.drawerTitle1 = 'Profile Details';
    this.addnew = true;
    this.api1
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
            this.api1
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
                    this.drawerVisible1 = true;
                  } else {
                    this.empstatus = [];
                  }
                  this.drawerVisible1 = true;
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
          console.log(err);
        }
      );
  }
}
