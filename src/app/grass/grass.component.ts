import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { APIServicesService } from './Services/APIService.service';
import { CookieService } from 'ngx-cookie-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserMaster } from './Models/usermaster';
import { EmployeeMaster } from './Models/Employee';
import { changepassword } from '../Modal/changepasswordho';
import { genertaeSenioritylist } from './Models/GenerateSeniorityList';
import * as CryptoJS from 'crypto-js';
import { WebsiteService } from '../Service/website.service';
@Component({
  selector: 'app-grass',
  templateUrl: './grass.component.html',
  styleUrls: ['./grass.component.css'],
})
export class GrassComponent {
  title = 'GRAAS';
  isCollapsed = false;
  roledata: any = [];
  isVisible = false;
  isSpinning = false;
  isLogedIn = false;
  PASSWORD: any = '';
  NEWPASSWORD: any = '';
  CONFPASSWORD: any = '';
  screenwidth = 0;
  // isPassword = false;
  roleId = Number(sessionStorage.getItem('roleId'));
  menus = [];
  USERNAME = sessionStorage.getItem('userName');
  userId = Number(sessionStorage.getItem('userId'));
  user = new UserMaster();
  showconfirm = false;
  currentroute = '';
  pageName = '';
  scrHeight: any;
  scrWidth: any;
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  Dwidth: any;
  constructor(
    private router: Router,
    private api: APIServicesService,
    private api1: WebsiteService,
    private cookie: CookieService,
    private message: NzNotificationService
  ) {
    // this.loggerInit();
    this.screenwidth = window.innerWidth;
    router.events.subscribe((val) => {
      var url = window.location.href;
      var arr = url.split('/');
      this.currentroute = arr[3];
    });
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '90%';
    }
  }

  slides: string[] = [
    'ITEM 1',
    'ITEM 2',
    'ITEM 3',
    'ITEM 4',
    // Add more slide URLs here
  ];

  ngAfterViewInit() {
    this.startSlider();
  }

  @ViewChild('slider', { static: true }) slider: ElementRef;
  intervalId: any;
  paused: boolean = false;
  currentSlide: number = 0;
  startSlider() {
    this.intervalId = setInterval(() => {
      if (!this.paused) {
        this.nextSlide();
      }
    }, 3000); // Adjust the interval as needed
  }

  pauseSlider() {
    clearInterval(this.intervalId);
    this.paused = true;
  }

  resumeSlider() {
    this.paused = false;
    this.startSlider();
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  showsidebar: any;
  ngOnInit() {
    this.rroleIdd = sessionStorage.getItem('roleId');
    if (
      sessionStorage.getItem('roledata') != undefined &&
      sessionStorage.getItem('roledata') != null
    ) {
      var roled: any = sessionStorage.getItem('roledata');
      this.roledata = JSON.parse(roled);
    }
    this.employeeedit = sessionStorage.getItem('userId');
    this.roleId = Number(sessionStorage.getItem('roleId'));
    let url = window.location.href;
    var arr = url.split('/');
    this.pageName = arr[3] + '/' + arr[4];

    if (
      this.cookie.get('token') === '' ||
      this.cookie.get('token') === null ||
      this.cookie.get('token') === undefined ||
      this.userId === 0 ||
      this.roleId === 0
    ) {
      // this.isLogedIn = false;
      // this.router.navigateByUrl('/');
      this.logout();
    } else {
      if (this.userId || this.roleId != 0) {
        this.isLogedIn = true;
        // if (this.roleId != 2) this.accessPageForRedirect();
        this.loadForms();
        if (Number(localStorage.getItem('serviceid')) == 5) {
          if (this.roleId == 2) {
            this.showsidebar = false;
            // this.router.navigateByUrl('/grass/Applicationcompo');
            this.router.navigateByUrl('/grass/accomodation_allotment_process');
          } else if (this.roleId == 60) {
            this.showsidebar = true;
            this.router.navigateByUrl('/grass/renovation-requests');
          } else {
            this.router.navigateByUrl('/grass/graas_dashboard');

            this.showsidebar = true;
          }
        } else {
          if (this.roleId == 60) {
            this.showsidebar = true;
            this.router.navigateByUrl('/grass/renovation-requests');
          } else {
            this.showsidebar = true;
            this.router.navigateByUrl('/grass/graas_dashboard');
          }

        }
      } else {
        // this.api.logoutForSessionValues();
      }
    }
    this.getfullwidth();
  }

  checkpass() {
    this.api
      .getAllUsers(0, 0, 'ID', 'desc', ' AND ID=' + this.userId)
      .subscribe(
        (data) => {
          this.user = data['data'][0];

          if (this.PASSWORD == this.user.PASSWORD) {
            this.showconfirm = true;
          } else {
            this.showconfirm = false;
            this.message.error('Please enter correct password', '');
          }
        },
        (err) => { }
      );
  }

  confpass() {
    this.isSpinning = false;
    this.showconfirm = true;

    if (this.NEWPASSWORD.trim() == '' && this.CONFPASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter All Fields', '');
    } else if (this.NEWPASSWORD == null || this.NEWPASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter New Password', '');
    } else if (this.CONFPASSWORD == null || this.CONFPASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter Correct Confirm Password', '');
    } else if (this.NEWPASSWORD == this.CONFPASSWORD) {
      this.user.PASSWORD = this.NEWPASSWORD;
      this.api.updateUser(this.user).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('User Updated Successfully...', '');
          //if(!addNew)
          // this.drawerClose();
          this.isVisible = false;
          this.NEWPASSWORD = '';
          this.CONFPASSWORD = '';
          this.PASSWORD = '';
          this.isSpinning = false;
        } else {
          this.message.error('User Updation Failed...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.message.error(
        'Please enter new password & confirm password same',
        ''
      );
    }
  }

  // loggerInit() {
  //   if (
  //     this.cookie.get('supportKey') === '' ||
  //     this.cookie.get('supportKey') === null
  //   ) {
  //     this.api.loggerInit().subscribe(
  //       (data) => {
  //         if (data.code == '200') {
  //           this.cookie.set(
  //             'supportKey',
  //             data['data'][0]['supportkey'],
  //             365,
  //             '',
  //             '',
  //             false,
  //             'Strict'
  //           );
  //         }
  //       },
  //       (err) => {}
  //     );
  //   } else {
  //   }
  // }

  service_id = 5;

  loadForms() {
    this.api
      .getForms(this.userId, this.roleId, this.service_id)
      .subscribe((data: any) => {
        if (data['code'] == 200) {
          data['data'].forEach((element: any) => {
            element['children'].sort(this.sortFunction);

            if (element['children'].length == 0) delete element['children'];
          });
          this.menus = data['data'].sort(this.sortFunction);
        }
      });
  }

  sortFunction(a: any, b: any) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }

  // logout() {
  //   this.cookie.delete("supportKey")
  //   this.cookie.delete("token")
  //   sessionStorage.clear();
  //   window.location.reload();
  // }
  // logout() {
  //   this.cookie.delete('supportKey');
  //   this.cookie.delete('visitorId');
  //   this.cookie.delete('token');
  //   this.cookie.delete('userId');
  //   this.cookie.delete('ROLE_ID');
  //   sessionStorage.clear();

  //   window.location.reload();
  //   // this.router.navigateByUrl('/login')
  // }

  logout() {
    this.api.logoutcall().subscribe((data) => {
      if (data['code'] == '200') {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.message.success('Logout Successfully', '');
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

  console() {
    this.router.navigate(['/my-profile']);
  }

  // changepass(): void {
  //   this.isVisible = true;
  // }

  cpassdrawerTitle = '';
  cpassdrawer: boolean = false;

  // get closeCallback() {
  //   return this.cpassdrawerClose.bind(this);
  // }
  showChangePasswordDrawer(): void {
    this.cpassdrawerTitle = ' Reset Password ';
    this.cpassdrawer = true;
  }

  cpassdrawerClose(): void {
    this.cpassdrawer = false;
  }

  ///////////////////////////////////////////
  dataList: any = [];
  drawerVisible: boolean = false;
  drawerTitle!: string;
  employeeedit: any;
  // drawerData: EmployeeMaster = new EmployeeMaster();

  // drawerClose(): void {
  //   this.drawerVisible = false;
  // }

  // get closeCallback1() {
  //   return this.drawerClose.bind(this);
  // }

  // ShowProfile() {
  //   this.drawerTitle = 'Update Employee ';
  //   //  this.drawerData = Object.assign({}, data);
  //   this.api
  //     .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.employeeedit)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.dataList = data['data'];
  //           this.drawerData = Object.assign({}, data['data'][0]);
  //         }
  //         this.drawerVisible = true;
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

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
  // PASSWORD
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
      this.message.error('Please Enter Valid Password', '');
    } else if (this.PASS == undefined || this.PASS.toString().trim() == '') {
      this.message.error('Please Enter Password', '');
    } else if (this.PASS != this.CPASS) {
      this.message.error('Password And Confirm Password Must Be Same', '');
    } else {
      this.otpSpinning = true;
      this.api.changepasss(this.PHONE, this.PASS).subscribe(
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
  changepass: changepassword = new changepassword();
  @ViewChild('closechangeppp') closechangeppp: ElementRef;
  rroleIdd: any;
  changepasss() {
    if (this.changepass.PASSWORD == '' || this.changepass.PASSWORD == null) {
      this.message.error('Please Enter Old Password', '');
    } else if (
      this.changepass.NEW_PASSWORD == '' ||
      this.changepass.NEW_PASSWORD == null
    ) {
      this.message.error('Please Enter New Password', '');
    } else if (!this.isValidPassword(this.changepass.NEW_PASSWORD)) {
      this.message.error('Please Enter Valid New Password', '');
    } else if (this.changepass.PASSWORD == this.changepass.NEW_PASSWORD) {
      this.message.error('Old And New Password Are Same', '');
    } else if (this.changepass.PASSWORD == this.RETYPE_PASSWORD) {
      this.message.error('Old And Retype Password Are Same', '');
    } else if (this.changepass.NEW_PASSWORD != this.RETYPE_PASSWORD) {
      this.message.error('New Password And Retype Password Are Not Same', '');
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
              this.message.success('Password Changed Successfully', '');
              this.changepass.NEW_PASSWORD = '';
              this.changepass.PASSWORD = '';
              this.closechangeppp.nativeElement.click();
            } else if (successCode['code'] == '303') {
              this.message.error(
                'New Password Not Match To The Old Password.',
                ''
              );
              this.otpSpinning = false;
            } else {
              this.message.error(
                'Something went wrong please try later...',
                ''
              );
              this.otpSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something went wrong please try later...', '');
            this.otpSpinning = false;
          }
        );
      } else {
        this.api.changepassworduser(this.changepass).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.otpSpinning = false;
              this.message.success('Password Changed Successfully', '');
              this.changepass.NEW_PASSWORD = '';
              this.changepass.PASSWORD = '';
              this.closechangeppp.nativeElement.click();
            } else if (successCode['code'] == '303') {
              this.message.error(
                'New Password Not Match To The Old Password.',
                ''
              );
              this.otpSpinning = false;
            } else {
              this.message.error(
                'Something went wrong please try later...',
                ''
              );
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
    } else if (
      sessionStorage.getItem('roleId') == '1' ||
      sessionStorage.getItem('roleId') == '60'
    ) {
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
    this.message.success('Your role has been changed successfully', '');
  }

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

  urldash = window.location.href;
  arrdash = this.urldash.split('/');
  showsidebarmenu: boolean = true;
  getfullwidth() {
    this.urldash = window.location.href;
    this.arrdash = this.urldash.split('/');
    if (this.arrdash[4] == 'employeecorner') {
      if (this.arrdash[5] == 'graas_dashboard') {
        this.showsidebarmenu = false;
        return this.showsidebarmenu;
      } else {
        this.showsidebarmenu = true;
        return this.showsidebarmenu;
      }
    } else {
      if (this.arrdash[4] == 'graas_dashboard') {
        this.showsidebarmenu = false;
        return this.showsidebarmenu;
      } else {
        this.showsidebarmenu = true;
        return this.showsidebarmenu;
      }
    }
  }
  show() {
    this.router.navigate(['/grass/grass-dashboard']);
    this.showsidebarmenu = true;
  }
}
