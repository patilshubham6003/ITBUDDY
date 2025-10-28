import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeMaster } from '../../Models/Employee';
import { APIServicesService } from '../../Services/APIService.service';

@Component({
  selector: 'app-employeelogin',
  templateUrl: './employeelogin.component.html',
  styleUrls: ['./employeelogin.component.css'],
})
export class EmployeeloginComponent implements OnInit {
  EMAIL_ID = '';
  data: EmployeeMaster = new EmployeeMaster();
  PASSWORD = '';
  passwordVisible = false;
  passwordVisible1 = false;
  isloginSpinning = false;
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  isLogedIn = false;
  emailId: any;
  isVisible = false;
  mobpattern = /^[6-9]\d{9}$/;
  sendOtp = false;
  sendotpemplyee = false;
  employeepassword = false;
  employeemobileverified = false;
  password = false;
  mobileverified = false;
  NEWPASSWORD = '';
  CONFPASSWORD = '';

  CONF_PASSWORD = '';
  fogotdata = true;
  visiblee = false;
  visiblee1 = false;
  // MOBILE_NO = sessionStorage.getItem('mobileno');
  MOBILE_NO: any;

  KEYWORD = 'OLD';
  otpSpinning = false;
  myInterval2: any;
  showTimer = false;
  timerMobile: any;
  showconfirm = false;
  isSpinning = false;
  Mobile1 = '';
  USER_ID = 0;
  OTP = '';
  NAME = '';
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  resendTrue = false;
  mobilepattrn = /[6-9]{1}[0-9]{9}/;
  NEW_PASSWORD: string = '';
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  constructor(
    private router: Router,
    private api: APIServicesService,
    private message: NzNotificationService,
    private cookie: CookieService
  ) { }

  ngOnInit(): void {
    clearInterval(this.myInterval2);

    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.router.navigate(['grass/employeelogin']);
    } else {
      if (this.userId == null || this.userName == null || this.roleId == null)
        this.api.logoutForSessionValues();
      else {
        if (this.roleId == '60') {
          this.isLogedIn = true;
          this.router.navigateByUrl('/grass/renovation-requests');
        } else {
          this.isLogedIn = true;
          this.router.navigate(['grass/graas_dashboard']);
        }

      }
    }
    //const userId = '1';
    //this.api.requestPermission(this.userId)
  }

  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '')
      this.message.error('Please Enter Email Id and Password', '');
    else {
      this.isloginSpinning = true;
      this.api.loginemployee(this.EMAIL_ID, this.PASSWORD).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.cookie.set(
              'token',
              data['data'][0]['token'],
              365,
              '',
              '',
              false,
              'Strict'
            );
            sessionStorage.setItem(
              'userId',
              data['data'][0]['UserData'][0]['EMP_ID']
            );
            sessionStorage.setItem(
              'userName',
              data['data'][0]['UserData'][0]['NAME']
            );
            sessionStorage.setItem(
              'emailId',
              data['data'][0]['UserData'][0]['EMAIL_ID']
            );
            sessionStorage.setItem(
              'roleId',
              data['data'][0]['UserData'][0]['ROLE_DETAILS'][0]['ROLE_ID']
            );
            sessionStorage.setItem(
              'level',
              data['data'][0]['UserData'][0]['ROLE_DETAILS'][0]['LEVEL']
            );
            sessionStorage.setItem(
              'roleName',
              data['data'][0]['UserData'][0]['ROLE_DETAILS'][0]['ROLE_NAME']
            );
            sessionStorage.setItem(
              'userId',
              data['data'][0]['UserData'][0]['EMP_ID']
            );
            sessionStorage.setItem(
              'clientmasterid',
              data['data'][0]['UserData'][0]['CLIENT_MASTER_ID']
            );

            this.message.info(data['message'], '');
            this.emailId = sessionStorage.getItem('emailId');
            window.location.reload();

            setTimeout(() => {
              this.isloginSpinning = false;
            }, 1000);

            // this.api.addLog('L', 'Login Successfully ', this.emailId).subscribe(
            //   (data) => {},
            //   (err) => {
            //     if (err['ok'] == false)
            //       this.message.error('Server Not Found', '');
            //   }
            // );
          } else {
            this.message.error(data['message'], '');
            setTimeout(() => {
              this.isloginSpinning = false;
            }, 1000);

            // this.api
            //   .addLog(
            //     'A',
            //     data['message'] +
            //       ' ' +
            //       'Login Failed with EmailId= ' +
            //       this.EMAIL_ID +
            //       ' and Password=' +
            //       this.PASSWORD,
            //     '0'
            //   )
            //   .subscribe(
            //     (data) => {},
            //     (err) => {
            //       if (err['ok'] == false)
            //         this.message.error('Server Not Found', '');
            //     }
            //   );
          }
        },
        (err) => {
          this.message.error('Server not found', '');
          this.isloginSpinning = false;
        }
      );
    }
  }
  // @ViewChild('ngOtpInput') ngOtpInputRef:any;
  showModal(): void {
    this.fogotdata = false;
    this.visiblee = true;
    this.visiblee1 = false;
    this.isVisible = true;
    this.MOBILE_NO = '';
    this.OTP = '';
    this.NEWPASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
  }

  hideandshow() {
    this.fogotdata = false;
    this.visiblee = false;
    this.visiblee1 = true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  check() {
    if (this.MOBILE_NO.trim() != '' && this.MOBILE_NO != undefined) {
      this.otpSpinning = true;
      this.api.otplogin1(this.MOBILE_NO).subscribe(
        (successCode) => {
          this.otpSpinning = false;
          if (successCode['code'] == 200) {
            this.sendOtp = true;
            this.mobileverified = false;
            this.password = false;
            this.message.success('Otp Sent Sucessfully', '');

            this.resendTrue = true;
            this.StartTimerMobile2();
          } else if (successCode['code'] == '404') {
            this.message.error('Please Enter Registered Mobile Number', '');
          } else if (successCode['code'] == '300') {
            this.message.error('This Number is Already Used, Please Login', '');
          } else {
            this.message.error('Something went wrong please try later', '');
          }
        },
        (err) => {
          this.message.error('Something went wrong. Please try again.', '');
          this.otpSpinning = false;
        }
      );
    } else {
      this.message.error('Mobile Number Required...', '');
    }
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
  onOtpChange(otp: any) {
    // this.OTP = this.OTP + event.srcElement.
    this.OTP = otp.toString();
  }

  resendOTP() {
    this.check();
  }

  varify() {
    if (this.OTP == '') {
      this.message.error('Please Enter OTP', '');
    }
    this.otpSpinning = true;
    this.api.verifyOTP1(this.MOBILE_NO, this.OTP).subscribe(
      (successCode) => {
        this.otpSpinning = false;
        if (successCode['code'] == '200') {
          this.mobileverified = true;

          sessionStorage.setItem('mobileno', this.MOBILE_NO);
          this.sendOtp = false;
          this.password = true;
          this.message.success('Mobile No Varified Successfully!', '');
          this.USER_ID = successCode['data'][0]['UserData'][0]['ID'];
          // this.Mobile = this.Mobile1;

          this.cookie.set(
            'token',
            successCode['data'][0]['token'],
            365,
            '',
            '',
            true,
            'None'
          );
        } else if (successCode['code'] == '300') {
          this.message.error('Invalid OTP Please Enter Correct OTP.', '');
          this.OTP = '';
        } else if (successCode['code'] == '400') {
          this.message.error('Something Went Wrong.Please Try Again.', '');
        }
      },
      (err) => {
        this.message.error('Something went wrong. Please try again.', '');
        this.isSpinning = false;
      }
    );
  }

  confpass() {
    this.isSpinning = false;

    if (this.NEW_PASSWORD == undefined || this.NEW_PASSWORD.trim() == '') {
      this.showconfirm = false;
      this.message.error('Please Enter New Password', '');
    } else if (
      this.CONFPASSWORD == undefined ||
      this.CONFPASSWORD.trim() == ''
    ) {
      this.showconfirm = false;
      this.message.error('Please Enter Correct Confirm Password', '');
    } else if (this.NEW_PASSWORD == this.CONFPASSWORD) {
      // this.user.PASSWORD = this.NEW_PASSWORD;
      this.api
        .employeechangepassordforgot(this.MOBILE_NO, this.NEW_PASSWORD)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Password Changed Successfully...', '');
            window.location.reload();
            this.isVisible = false;
            this.NEW_PASSWORD = '';
            this.CONFPASSWORD = '';
            this.PASSWORD = '';

            this.isSpinning = false;
          } else {
            this.message.error('Password Change Failed...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('New Password & Confirm Password Must Be Same', '');
    }
  }

  handleCancel(): void {
    this.isVisible = false;
    this.MOBILE_NO = '';
    this.OTP = '';
    this.NEWPASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
  }

  changepass(): void {
    this.NEW_PASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
    this.isVisible = true;
  }

  STATUS: boolean = true;

  Register() {
    this.data.MOBILE_NO = this.MOBILE_NO;
    if (
      this.data.NAME.trim() == '' &&
      this.data.EMAIL_ID.trim() == '' &&
      this.data.MOBILE_NO <= 0 &&
      this.data.PASSWORD.trim() == '' &&
      this.CONF_PASSWORD.trim() == ''
    ) {
      this.message.error('Please Fill All The Information', '');
    } else if (this.data.NAME == undefined || this.data.NAME.trim() == '') {
      this.message.error('Please Enter  Name', '');
    } else if (!this.namepatt.test(this.data.NAME)) {
      this.message.error('Please Enter  Name', '');
    }
    //  else if (this.data.EMAIL_ID == null || this.data.EMAIL_ID.trim() == '') {
    //   this.message.error('Please Enter Email id', '');
    // } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
    //   this.message.error('Email ID Must be Proper', '');
    // }
    else if (
      this.data.PASSWORD == undefined ||
      this.data.PASSWORD.toString().trim() == ''
    ) {
      this.message.error('Please Enter Password', '');
    } else if (
      this.CONF_PASSWORD == undefined ||
      this.CONF_PASSWORD.toString().trim() == ''
    ) {
      this.message.error('Please Enter Confirm Password', '');
    } else if (this.data.PASSWORD != this.CONF_PASSWORD) {
      this.message.error('Password and Confirm Password Must Be Same', '');
    } else {
      if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID.trim() == ''
      ) {
        this.data.EMAIL_ID = null;
      } else {
        this.data.EMAIL_ID = this.data.EMAIL_ID;
      }

      var data = {
        MOBILE_NO: this.data.MOBILE_NO,
        NAME: this.data.NAME,
        EMAIL_ID: this.data.EMAIL_ID,
        PASSWORD: this.data.PASSWORD,
        STATUS: this.STATUS,
      };

      this.api.createregistrtion(data).subscribe((successCode) => {
        if (successCode['code'] == 200) {
          // sessionStorage.setItem('Member_Id', successCode['data'][0]['MEMBER_ID'])
          // sessionStorage.setItem('Current_Plan_Id', successCode['data'][0]['CURRENT_PLAN_ID'])
          // sessionStorage.setItem('Name', successCode['data'][0]['NAME'])
          // sessionStorage.setItem('Contact', this.MOBILE_NO)
          // sessionStorage.setItem('Gender', this.GENDER);

          this.message.success('Registration Completed Successfully...', '');

          setTimeout(() => {
            // this.router.navigate(['/login'], { replaceUrl: true });
          }, 1000);

          // if (this.registerform == true) {
          //   this.registerform = false;
          // } else {
          //   this.registerform = true;
          // }

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else if (successCode['code'] == '300') {
          this.message.error(
            'Entered Mobile Number or Email Already Present.',
            ''
          );
        } else if (successCode['code'] == '400') {
          this.message.error('Something went wrong please try later...', '');
        } else {
          this.message.error('Something went wrong please try later...', '');
        }
      });
    }
  }

  loginpage() {
    this.fogotdata = false;
    this.visiblee1 = false;
    this.visiblee = true;
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  check1() {
    if (this.MOBILE_NO.trim() != '' && this.MOBILE_NO != undefined) {
      this.otpSpinning = true;
      this.api.forgotemployeeotp(this.MOBILE_NO).subscribe(
        (successCode) => {
          this.otpSpinning = false;
          if (successCode['code'] == 200) {
            this.sendotpemplyee = true;
            this.employeemobileverified = false;
            this.employeepassword = false;
            this.message.success('Otp Sent Sucessfully', '');

            this.resendTrue = true;
            this.StartTimerMobile2();
          } else if (successCode['code'] == '404') {
            this.message.error('Please Enter Registered Mobile Number', '');
          } else if (successCode['code'] == '300') {
            this.message.error('This Number is Already Used, Please Login', '');
          } else {
            this.message.error('Something went wrong please try later', '');
          }
        },
        (err) => {
          this.message.error('Something went wrong. Please try again.', '');
          this.otpSpinning = false;
        }
      );
    } else {
      this.message.error('Mobile Number Required...', '');
    }
  }

  varify1() {
    if (this.OTP == '') {
      this.message.error('Please Enter OTP', '');
    }
    this.otpSpinning = true;
    this.api.verifyOTP1(this.MOBILE_NO, this.OTP).subscribe(
      (successCode) => {
        this.otpSpinning = false;
        if (successCode['code'] == '200') {
          sessionStorage.setItem('mobileno', this.MOBILE_NO);

          this.sendotpemplyee = false;
          this.employeemobileverified = true;
          this.employeepassword = true;

          this.message.success('Mobile No Varified Successfully!', '');
          this.USER_ID = successCode['data'][0]['UserData'][0]['ID'];
          // this.Mobile = this.Mobile1;

          this.cookie.set(
            'token',
            successCode['data'][0]['token'],
            365,
            '',
            '',
            true,
            'None'
          );
        } else if (successCode['code'] == '300') {
          this.message.error('Invalid OTP Please Enter Correct OTP.', '');
          this.OTP = '';
        } else if (successCode['code'] == '400') {
          this.message.error('Something Went Wrong.Please Try Again.', '');
        }
      },
      (err) => {
        this.message.error('Something went wrong. Please try again.', '');
        this.isSpinning = false;
      }
    );
  }
  isCheckedButton = false;
  registerButton: boolean = true;
  registerTrue(event: boolean) {
    if (event == true) {
      this.registerButton = false;
    } else {
      this.registerButton = true;
    }
  }
}
