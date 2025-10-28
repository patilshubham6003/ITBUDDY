import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeData } from 'src/app/Medical/Models/MEmployeeData';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-tour-employee-update',
  templateUrl: './tour-employee-update.component.html',
  styleUrls: ['./tour-employee-update.component.css'],
})
export class TourEmployeeUpdateComponent {
  @Input() data!: EmployeeData;
  showdisble: boolean = true;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  imgurl = appkeys.retriveimgUrl;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  passwordVisible = false;
  date: any;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  constructor(
    private router: Router,
    private api: ApiService,
    private message: NzNotificationService,
    private cookie: CookieService,
    private datepipe: DatePipe
  ) {}
  isShowCSS: boolean = false;

  ngOnInit(): void {
    // if (this.drawerVisible == true) {
    this.ddoOfTheOfficialList();
    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      Number(sessionStorage.getItem('roleId')) != null &&
      Number(sessionStorage.getItem('roleId')) == 2
    ) {
      this.isShowCSS = true;
    } else {
      this.isShowCSS = false;
    }
    this.getGradepay();
    this.getDesignation();
    // }
    const today = new Date();
    if (this.data.DOB == null || this.data.DOB == undefined) {
      this.date = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
    }

    if (this.data.PROFILE_PHOTO) {
      this.ImageUrl = this.imgurl + 'profileImages/' + this.data.PROFILE_PHOTO;
    }
  }
  ResidenceType: any = [];
  profileshow: boolean = true;
  getGradepay() {
    this.api.getGradPay(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          let listofresidence = [];
          listofresidence = data['data'];
          function removeDuplicates(arr: any) {
            const uniqueObjects: any = [];
            const uniqueammounts = new Set();
            for (const obj of arr) {
              if (!uniqueammounts.has(obj.AMOUNT)) {
                uniqueObjects.push(obj);
                uniqueammounts.add(obj.AMOUNT);
              }
            }
            return uniqueObjects;
          }
          this.ResidenceType = removeDuplicates(listofresidence);
        }
      },
      (err) => {}
    );
  }

  ddoOfTheOfficialDataList: any = [];
  ddoOfTheOfficialList() {
    this.isSpinning = true;
    this.api.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            this.ddoOfTheOfficialDataList = data['data'];
          } else {
            this.ddoOfTheOfficialDataList = [];
          }
          this.isSpinning = false;
        } else {
          this.ddoOfTheOfficialDataList = [];
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }
  progressBar5: boolean = false;
  percent5 = 0;
  timer5: any;
  profilePDF: any;
  urlprofilePdf: any;
  onFileSelectedphoto(event: any) {
    if (event.target.files.length == 0) {
      this.message.error('Please select profile photo', '');
      this.profilePDF = null;
    } else if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.profilePDF = <File>event.target.files[0];
    } else {
      this.message.error('Please select olny JPEG/ JPG/ PNG files.', '');
      this.profilePDF = null;
    }

    if (this.profilePDF != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.profilePDF.name.split('.').pop();
      var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      this.urlprofilePdf = url;
      this.uploadImage(this.profilePDF, this.urlprofilePdf);
    }
  }
  ImageUrl: any = '';
  uploadImage(urldemo: any, url: any) {
    this.progressBar5 = true;
    this.timer5 = this.api.onUpload2('ProfileIMG', urldemo, url).subscribe(
      (res) => {
        if (res.type === HttpEventType.Response) {
        }
        if (res.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * res.loaded) / res.total);
          this.percent5 = percentDone;
          if (this.percent5 == 100) {
            this.isSpinning = false;
            // this.message.success('File Uploaded Successfully', '')
          }
        } else if (res.type == 2 && res.status != 200) {
          this.message.error('Failed To Upload File...', '');
          this.isSpinning = false;
          this.progressBar5 = false;
          this.percent5 = 0;
          this.data.PROFILE_PHOTO = null;
          this.ImageUrl = '';
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            this.message.success('Profile Photo Uploaded Successfully...', '');
            this.isSpinning = false;
            this.data.PROFILE_PHOTO = this.urlprofilePdf;
            this.ImageUrl =
              this.imgurl + 'profileImages/' + this.data.PROFILE_PHOTO;
          } else {
            this.isSpinning = false;
            this.progressBar5 = false;
            this.percent5 = 0;
            this.data.PROFILE_PHOTO = null;
            this.ImageUrl = '';
          }
        }

        // if (this.data.PROFILE_PHOTO != null) {
        //   this.castshow = false;
        // } else {
        //   this.castshow = true;
        // }
      },
      (error) => {
        // this.message.error('Failed To Upload File...', '');
        this.isSpinning = false;
        // this.progressBar5 = false;
        // this.percent5=0;
        // this.data.PROFILE_PHOTO=null
      }
    );
  }

  // uploadImage(urldemo: any, url: any) {
  //   this.progressBar5 = true;
  //   this.timer5 = this.api.onUpload2('ProfileIMG', urldemo, url).subscribe(
  //     (res) => {
  //       if (res.type === HttpEventType.Response) {
  //       }
  //       if (res.type === HttpEventType.UploadProgress) {
  //         const percentDone = Math.round((100 * res.loaded) / res.total);
  //         this.percent5 = percentDone;
  //         if (this.percent5 == 100) {
  //           this.isSpinning = false;
  //           // this.message.success('File Uploaded Successfully', '')
  //         }
  //       } else if (res.type == 2 && res.status != 200) {
  //         this.message.error('Failed To Upload File...', '');
  //         this.isSpinning = false;
  //         this.progressBar5 = false;
  //         this.percent5 = 0;
  //         this.data.PROFILE_PHOTO = null;
  //       } else if (res.type == 4 && res.status == 200) {
  //         if (res.body['code'] == 200) {
  //           this.message.success('Profile Photo Uploaded Successfully...', '');
  //           this.isSpinning = false;
  //           this.data.PROFILE_PHOTO = this.urlprofilePdf;
  //         } else {
  //           this.isSpinning = false;
  //           this.message.success('Profile Photo Uploaded Successfully...', '');
  //         }
  //       }

  //       // if (this.data.PROFILE_PHOTO != null) {
  //       //   this.castshow = false;
  //       // } else {
  //       //   this.castshow = true;
  //       // }
  //     },
  //     (error) => {
  //       // this.message.error('Failed To Upload File...', '');
  //       this.isSpinning = false;
  //       // this.progressBar5 = false;
  //       // this.percent5=0;
  //       // this.data.PROFILE_PHOTO=null
  //     }
  //   );
  // }
  clearprofile(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletePdf(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.PROFILE_PHOTO = null;
          // this.profileshow = true;
          this.progressBar5 = false;
          this.percent5 = 0;
        } else {
          this.message.error('Failed to delete Profile Photo', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete Profile Photo', '');
      }
    );
  }

  gradechanges() {
    localStorage.setItem('GradeDataSave', 'T');
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
    // }
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new EmployeeData();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  viewphoto(event: any) {
    window.open(this.api.retriveimgUrl + 'profileImages/' + event);
  }

  save1(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.JOINING_DATE = this.datepipe.transform(
      this.data.JOINING_DATE,
      'yyyy-MM-dd'
    );
    this.data.DOB = this.datepipe.transform(this.data.DOB, 'yyyy-MM-dd');
    if (
      this.data.NAME.trim() == '' &&
      this.data.MOBILE_NO == undefined &&
      this.data.GENDER == undefined &&
      this.data.CAST == null &&
      this.data.DOB == undefined &&
      this.data.OFFICE_NAME == undefined &&
      this.data.LOCATION.trim() == '' &&
      this.data.DESIGNATION_ID == null &&
      this.data.SERVICE_TYPE == null &&
      this.data.JOINING_DATE == null &&
      this.data.DDO_OF_THE_OFFICIAL_ID == null &&
      this.data.GRADE_PAY == null &&
      this.data.PROFILE_PHOTO == null
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Employee Name.', '');
    } else if (this.data.MOBILE_NO == undefined || this.data.MOBILE_NO <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile Number', '');
    } else if (!this.mobilepattern.test(this.data.MOBILE_NO.toString())) {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
    } else if (
      this.data.CAST == undefined ||
      this.data.CAST == null ||
      this.data.CAST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Cast  ', '');
    } else if (
      this.data.CAST != 'General' &&
      (this.data.CAST_CERTIFICATE == undefined ||
        this.data.CAST_CERTIFICATE == null ||
        this.data.CAST_CERTIFICATE == '')
    ) {
      this.isOk = false;
      this.message.error('Please Upload Your Caste Certificate  ', '');
    } else if (
      this.data.GENDER == undefined ||
      this.data.GENDER == null ||
      this.data.GENDER == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Gender', '');
    } else if (
      this.data.DOB == undefined ||
      this.data.DOB == null ||
      this.data.DOB == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Date Of Birth  ', '');
      // } else if (
      //   this.data.CAST == undefined ||
      //   this.data.CAST == null ||
      //   this.data.CAST == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Your Age', '');
    } else if (
      this.data.OFFICE_NAME == null ||
      this.data.OFFICE_NAME == undefined ||
      this.data.OFFICE_NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Your Office Name', '');
    } else if (
      this.data.LOCATION == null ||
      this.data.LOCATION == undefined ||
      this.data.LOCATION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Location', '');
    } else if (
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Designation', '');
    } else if (
      this.data.SERVICE_TYPE == undefined ||
      this.data.SERVICE_TYPE == null ||
      this.data.SERVICE_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Service Type', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == '' ||
      this.data.EMPLOYEE_CODE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Employee Code  ', '');
    } else if (
      this.data.JOINING_DATE == undefined ||
      this.data.JOINING_DATE == null ||
      this.data.JOINING_DATE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Date Of Joining  ', '');
    } else if (
      this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      this.data.DDO_OF_THE_OFFICIAL_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select DDO of the Official', '');
    } else if (
      this.data.GRADE_PAY == null ||
      this.data.GRADE_PAY == undefined ||
      this.data.GRADE_PAY == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Basic Pay', '');
    } else if (
      this.data.PROFILE_PHOTO == null ||
      this.data.PROFILE_PHOTO == undefined ||
      this.data.PROFILE_PHOTO == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Your Profile Photo', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == '' ||
        this.data.ADDRESS.trim() == ''
      ) {
        this.data.ADDRESS = ' ';
      } else {
        this.data.ADDRESS = this.data.ADDRESS;
      }
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
      if (
        this.data.OFFICE_NAME == undefined ||
        this.data.OFFICE_NAME == null ||
        this.data.OFFICE_NAME == '' ||
        this.data.OFFICE_NAME.trim() == ''
      ) {
        this.data.OFFICE_NAME = '';
      } else {
        this.data.OFFICE_NAME = this.data.OFFICE_NAME;
      }
      {
        if (this.data.ID) {
          this.api.updateEmployeeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) {
                this.drawerClose();
                websitebannerPage.form.reset();
                this.isSpinning = false;
              }
            } else if (successCode.code == '300') {
              this.message.error(
                'Mobile Number or Email ID Already Exist...',
                ''
              );
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api
            .createsimpleEmployeeMaster(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  websitebannerPage.form.reset();
                } else {
                  this.data = new EmployeeData();
                  this.resetDrawer(websitebannerPage);

                  this.api.getEmployeeMaster(0, 0, '', 'desc', '').subscribe(
                    (data) => {},
                    (err) => {}
                  );
                }
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(
                  'Mobile Number or Email ID Already Exist...',
                  ''
                );
                this.isSpinning = false;
              } else {
                this.message.error('Failed To Fill Information...', '');
                this.isSpinning = false;
              }
            });
        }
      }
    }
  }

  handleOk(): void {
    this.isVisible = false;
  }
  isSpinning1: boolean = false;
  handleCancel(): void {
    this.isVisible = false;
  }

  disabledDate2 = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current >= today;
  };
  OTP;
  isSpinning2: boolean = false;

  isValidOtp(ENTER_OTP) {
    const expression = /^[0-9]+$/;
    return expression.test(String('' + ENTER_OTP).toLowerCase());
  }

  handleCancelMobile() {
    this.isVisibleMobile = false;
  }
  handleOkMobile() {
    this.isVisibleMobile = false;
  }
  VerifyEmail() {
    this.EMP_ID = this.data.ID;

    if (this.OTP == '' || this.OTP.length < 6) {
      this.message.error('OTP field cant be blank', '');
    } else if (!this.isValidOtp(this.OTP)) {
      this.message.error('Enter numeric characters only', '');
    } else {
      this.isSpinning2 = true;
      this.api.verifyOtp(this.EMAIL_ID, this.OTP, this.EMP_ID).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Email Id Updated Successfully.', '');
            this.OTP = '';
            this.isSpinning2 = false;
            this.api
              .getEmployeeMaster(
                0,
                0,
                '',
                '',
                ' AND ID = ' + Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data = data['data'][0];
                    this.isVisible1 = false;
                  }
                },
                (err) => {}
              );
          } else if (successCode['code'] == '300') {
            this.message.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP = '';
            this.isSpinning2 = false;
          } else if (successCode['code'] == '400') {
            this.message.error('Something Went Wrong.Please Try Again', '');
            this.isSpinning2 = false;
          }
        },
        (err) => {
          this.message.error('Something Went Wrong.Please Try Again', '');
          this.isSpinning2 = false;
        }
      );
    }
  }
  isVisibleMobile1 = false;
  mobpattern = /^[6-9]\d{9}$/;

  SaveMobile() {
    this.EMP_ID = this.data.ID;
    if (this.MOBILE_NO == undefined || this.MOBILE_NO.toString().trim() == '') {
      this.message.error('Please Enter Mobile No.', '');
    } else if (!this.mobpattern.test(this.MOBILE_NO.toString())) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number', '');
    } else {
      // this.OTP = '';
      if (this.MOBILE_NO != undefined) {
        // this.otpSpinning = true;
        this.isSpinning3 = true;
        this.api.Mobiledotp(this.MOBILE_NO, this.EMP_ID).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.message.success(
                'A 6 digit OTP sent via Message to verify your Mobile No!',
                ''
              );
              this.isSpinning3 = false;
              this.isVisibleMobile1 = true;
              this.isVisibleMobile = false;
            } else if (successCode['code'] == '303') {
              this.message.error('Mobile number is already registered', '');
              this.isSpinning3 = false;
            } else {
              this.message.error(
                'Something went wrong please try later...',
                ''
              );
              this.isSpinning3 = false;
            }
          },
          (err) => {
            this.message.error('Something went wrong please try later...', '');
            this.isSpinning3 = false;
          }
        );
      }
    }
  }

  handleOkMobile1() {
    this.isVisibleMobile1 = false;
  }

  SaveEmail() {
    this.EMP_ID = this.data.ID;

    if (this.EMAIL_ID == undefined || this.EMAIL_ID.toString().trim() == '') {
      this.message.error('Please Enter Email ID', '');
    } else {
      // this.OTP = '';
      if (this.EMAIL_ID != undefined) {
        this.isSpinning1 = true;
        // this.otpSpinning = true;
        this.api.Emailidotp(this.EMAIL_ID, this.EMP_ID).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.isSpinning1 = false;
              this.message.success(
                'A 6 digit OTP sent via Message to verify your Email ID!',
                ''
              );
              this.isVisible1 = true;
              this.isVisible = false;
            } else if (successCode['code'] == '303') {
              this.message.error('Email Id is already registered', '');
              this.isSpinning1 = false;
            } else {
              this.message.error(
                'Something went wrong please try later...',
                ''
              );
              this.isSpinning1 = false;
            }
          },
          (err) => {
            this.message.error('Something went wrong please try later...', '');
            this.isSpinning1 = false;
          }
        );
      }
    }
  }
  isSpinning3: boolean = false;
  isSpinning4: boolean = false;

  VerifyMobile() {
    this.EMP_ID = this.data.ID;

    if (this.OTP == '' || this.OTP.length < 6) {
      this.message.error('OTP field cant be blank', '');
    } else if (!this.isValidOtp(this.OTP)) {
      this.message.error('Enter numeric characters only', '');
    } else {
      this.isSpinning4 = true;
      this.api.verifyMobileOTP(this.MOBILE_NO, this.OTP, this.EMP_ID).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Mobile No. Updated Successfully.', '');
            this.OTP = '';
            this.isSpinning4 = true;
            this.api
              .getEmployeeMaster(
                0,
                0,
                '',
                '',
                ' AND ID = ' + Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data = data['data'][0];
                    this.isVisibleMobile1 = false;
                    this.isSpinning4 = false;
                  }
                },
                (err) => {}
              );
          } else if (successCode['code'] == '300') {
            this.message.error('Invalid OTP.Please Enter Correct OTP.', '');
            this.OTP = '';
            this.isSpinning4 = false;
          } else if (successCode['code'] == '400') {
            this.message.error('Something Went Wrong.Please Try Again', '');
            this.isSpinning4 = false;
          }
        },
        (err) => {
          this.message.error('Something Went Wrong.Please Try Again', '');
          this.isSpinning4 = false;
        }
      );
    }
  }

  Designationtypes: any = [];
  getDesignation() {
    this.isSpinning = true;
    this.api
      .getAllDesignations(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Designationtypes = data['data'];
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  alphaOnly(event) {
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
  isVisible = false;
  OLDEMAIL;
  emailver;
  Allactivitydata;
  MOBILE_NO;
  EMAIL_ID;
  EMP_ID: any;
  isVisible1 = false;
  mobilepattern = /^[6-9]\d{9}$/;
  EditEmail() {
    this.isVisible = true;
    this.OLDEMAIL = this.data.EMAIL_ID;
    this.emailver == this.EMAIL_ID;
    this.EMAIL_ID = '';
    this.api.getEmployeeMaster(0, 0, '', '', '').subscribe(
      (data) => {
        this.Allactivitydata = data['data'];
        for (let i = 0; i < this.Allactivitydata.length; i++) {
          this.emailver = this.Allactivitydata[i]['EMAIL_ID'];
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  viewcast(event: any) {
    // window.open()
    window.open(this.api.retriveimgUrl + 'castCertificate/' + event);
  }

  // clearcaste() {
  //   this.data.CAST_CERTIFICATE = null;
  //   this.castshow = true;
  //   this.progressBar4 = false;
  //   this.percent4 = 0
  // }

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable dates earlier than today
    return (
      current >
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };

  calculateAgeemp() {
    const dob = new Date(this.data.DOB);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      this.data.AGE = age - 1;
    } else {
      this.data.AGE = age;
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  isVisibleMobile = false;
  OLDMOBILE_NO;
  Allactivity;
  phone;
  EditMobile() {
    this.isVisibleMobile = true;
    this.OLDMOBILE_NO = this.data.MOBILE_NO;
    this.phone == this.MOBILE_NO;
    this.MOBILE_NO = '';
    this.api.getEmployeeMaster(0, 0, '', '', '').subscribe(
      (data) => {
        this.Allactivity = data['data'];
        for (let i = 0; i < this.Allactivity.length; i++) {
          this.phone = this.Allactivity[i]['MOBILE_NO'];
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  castshow: boolean = true;
  changecast(event: any) {}
  progressBar4: boolean = false;
  percent4 = 0;
  timer4: any;
  castPDF: any;
  urlcastPdf: any;
  onFileSelectedcaste(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.castPDF = <File>event.target.files[0];

      if (this.castPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.castPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlcastPdf = url;
        if (
          this.data.CAST_CERTIFICATE != undefined &&
          this.data.CAST_CERTIFICATE.trim() != ''
        ) {
          var arr = this.data.CAST_CERTIFICATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar4 = true;
      this.timer4 = this.api
        .onUpload2('castCertificate', this.castPDF, this.urlcastPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent4 = percentDone;
            if (this.percent4 == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar4 = false;
            this.percent4 = 0;
            this.data.CAST_CERTIFICATE = null;
            this.castshow = true;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'Caste Certificate Uploaded Successfully...',
                ''
              );
              this.isSpinning = false;
              this.data.CAST_CERTIFICATE = this.urlcastPdf;
              this.castshow = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (res.body['code'] == 200) {

          // } else {

          // }

          // if (this.data.CAST_CERTIFICATE != null) {

          // } else {

          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.castPDF = null;
      this.isSpinning = false;
      this.progressBar4 = false;
      this.percent4 = 0;
      this.data.CAST_CERTIFICATE = null;
      this.castshow = true;
    }
  }

  clearcaste(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletePdf(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.CAST_CERTIFICATE = null;
          this.castshow = true;
          this.progressBar4 = false;
          this.percent4 = 0;
        } else {
          this.message.error('Failed to delete Caste Certificate', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete Caste Certificate', '');
      }
    );
  }
}
