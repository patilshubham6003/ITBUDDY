import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { EmployeeMaster } from 'src/app/grass/Models/Employee';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { HttpEventType } from '@angular/common/http';
import { appkeys } from 'src/app/app.constant';
import * as moment from 'moment';
@Component({
  selector: 'app-grassemployeeupdate',
  templateUrl: './grassemployeeupdate.component.html',
  styleUrls: ['./grassemployeeupdate.component.css'],
})
export class GrassemployeeupdateComponent {
  @Input() data!: EmployeeMaster;
  showdisble: boolean = true;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  passwordVisible = false;
  date: any;
  employeefullname: any = [];

  // emailpattern =
  //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  emailpattern =
    /^(?!.*\.\.)[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

  GRADE_PAY: any;
  GradePayLevelData: any = [];

  constructor(
    public api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }

  retrieveimgUrl = appkeys.retriveimgUrl;
  ngOnInit(): void {
    if (
      sessionStorage.getItem('userName') != undefined &&
      sessionStorage.getItem('userName') != null &&
      sessionStorage.getItem('userName') != ''
    ) {
      this.data.NAME = sessionStorage.getItem('userName') || '';
      // Split fullName into parts

      const nameParts = this.data.NAME.split(' ');
      // Assign parts to respective variables
      if (this.data.MIDDLE_NAME && this.data.LAST_NAME) {
        this.data.MIDDLE_NAME = this.data.MIDDLE_NAME;
        this.data.LAST_NAME = this.data.LAST_NAME;
        this.data.FIRST_NAME = nameParts.length > 0 ? nameParts[0] : '';
      } else if (
        this.data.MIDDLE_NAME &&
        (this.data.LAST_NAME == null ||
          this.data.LAST_NAME == undefined ||
          this.data.LAST_NAME == '')
      ) {
        this.data.MIDDLE_NAME = this.data.MIDDLE_NAME;
        this.data.LAST_NAME = nameParts.slice(2).join(' ');
        this.data.FIRST_NAME = nameParts.length > 0 ? nameParts[0] : '';
      } else if (
        this.data.LAST_NAME &&
        (this.data.MIDDLE_NAME == null ||
          this.data.MIDDLE_NAME == undefined ||
          this.data.MIDDLE_NAME == '')
      ) {
        this.data.MIDDLE_NAME = nameParts.length > 1 ? nameParts[1] : '';
        this.data.LAST_NAME = this.data.LAST_NAME;
        this.data.FIRST_NAME = nameParts.length > 0 ? nameParts[0] : '';
      } else {
        this.data.FIRST_NAME = nameParts.length > 0 ? nameParts[0] : '';
        this.data.MIDDLE_NAME = nameParts.length > 1 ? nameParts[1] : '';
        this.data.LAST_NAME = nameParts.slice(2).join(' ');
      }
    }
    sessionStorage.setItem('preGradePayid', this.data.GRAAS_GRADE_PAY_ID);
    if (this.data != undefined) {
      this.getGradepay();
      this.getDesignation();
      this.api.getAllGradePayLevel(0, 0, '', 'desc', '').subscribe((data1) => {
        this.GradePayLevelData = data1['data'];
      });
    }
    // }
    const today = new Date();
    if (this.data.DOB == null || this.data.DOB == undefined) {
      this.date = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
    }

    this.ddoOfTheOfficialList();
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
      (err) => { }
    );
  }
  disabledDate2 = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current >= today;
  };
  disabledDate2222 = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current <= today;
  };

  ResidenceType: any = [];
  Designationtypes: any = [];
  getDesignation() {
    this.isSpinning = true;
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL '
      ).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Designationtypes = data['data'];
            this.isSpinning = false;
          }
        },
        (err) => { }
      );
  }


  getGradepay() {
    this.api.getGradPay(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];

          if (this.data != undefined) {
            if (this.data.GRAAS_GRADE_PAY_ID == 0) {
              this.data.GRAAS_GRADE_PAY_ID = null;
            } else {
            }
          }
        }
      },
      (err) => { }
    );
  }

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable dates earlier than today
    return (
      current >
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };
  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
    // }
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new EmployeeMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  gradechanges(event) {
    localStorage.setItem('GradeDataSave', 'T');

    if (event != null) {
      sessionStorage.setItem('GPChangeChecklist', 'T');
      let gradedata = this.ResidenceType.find((value: any) => {
        return value.ID == event;
      });

      if (gradedata) {
        this.data.GRASS_GRADE_PAY = gradedata.AMOUNT;
      }
    } else {
      this.data.GRAAS_GRADE_PAY_ID = null;
      this.data.GRASS_GRADE_PAY = null;
    }
  }

  showlabel = false;
  changecast(event: any) {
    if (event == 'GN') {
      this.showlabel = false;
    } else {
      this.showlabel = true;
    }
  }

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

    if (this.data.DOB) {
      // Using moment.js to manipulate the date
      const dobMoment = moment(this.data.DOB);
      const retirementMoment = dobMoment.add(60, 'years').endOf('month');
      this.data.RETIREMENT_DATE = retirementMoment.toDate();
    } else {
      this.data.RETIREMENT_DATE = null;
    }
  }

  changeswitch(datasd: any) {
    if (datasd == false) {
      this.data.PRESENT_PAY_LEVEL_DATE = null;
    }
  }
  isValidMobile(mobile: string) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }
  mobilepattern = /^[6-9]\d{9}$/;
  save1(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.JOINING_DATE = this.datepipe.transform(
      this.data.JOINING_DATE,
      'yyyy-MM-dd'
    );
    if (
      this.data.DATE_OF_JOINING_MILITORY != null &&
      this.data.DATE_OF_JOINING_MILITORY != undefined &&
      this.data.DATE_OF_JOINING_MILITORY != ''
    ) {
      this.data.DATE_OF_JOINING_MILITORY = this.datepipe.transform(
        this.data.DATE_OF_JOINING_MILITORY,
        'yyyy-MM-dd'
      );
    }
    if (
      this.data.DATE_OF_RETIREMENT_MILITORY != null &&
      this.data.DATE_OF_RETIREMENT_MILITORY != undefined &&
      this.data.DATE_OF_RETIREMENT_MILITORY != ''
    ) {
      this.data.DATE_OF_RETIREMENT_MILITORY = this.datepipe.transform(
        this.data.DATE_OF_RETIREMENT_MILITORY,
        'yyyy-MM-dd'
      );
    }
    if (
      this.data.RETIREMENT_DATE != null &&
      this.data.RETIREMENT_DATE != undefined &&
      this.data.RETIREMENT_DATE != ''
    ) {
      this.data.RETIREMENT_DATE = this.datepipe.transform(
        this.data.RETIREMENT_DATE,
        'yyyy-MM-dd'
      );
    }
    if (
      this.data.PRESENT_PAY_LEVEL_DATE != null &&
      this.data.PRESENT_PAY_LEVEL_DATE != undefined &&
      this.data.PRESENT_PAY_LEVEL_DATE != ''
    ) {
      this.data.PRESENT_PAY_LEVEL_DATE = this.datepipe.transform(
        this.data.PRESENT_PAY_LEVEL_DATE,
        'yyyy-MM-dd'
      );
    }

    this.data.DOB = this.datepipe.transform(this.data.DOB, 'yyyy-MM-dd');
    if (this.data.FIRST_NAME == null || this.data.FIRST_NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter First Name.', '');
    }
    // else if (this.data.MIDDLE_NAME == null || this.data.MIDDLE_NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Middle Name.', '');
    // } else if (this.data.LAST_NAME == null || this.data.LAST_NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Last Name.', '');
    // }
    else if (
      this.data.DOB == undefined ||
      this.data.DOB == null ||
      this.data.DOB == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Date Of Birth  ', '');
    } else if (
      this.data.AGE == undefined ||
      this.data.AGE == null ||
      this.data.AGE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Your Age', '');
    } else if (
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID.toString().trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null ||
      this.data.MOBILE_NO.toString().trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
    } else if (!this.isValidMobile(this.data.MOBILE_NO)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile No.', '');
    } else if (
      this.data.PROFILE_PHOTO == undefined ||
      this.data.PROFILE_PHOTO == null
    ) {
      this.isOk = false;
      this.message.error('Please Upload Profile Photo ', '');
    } else if (
      this.data.GENDER == undefined ||
      this.data.GENDER == null ||
      this.data.GENDER == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Gender', '');
    } else if (
      this.data.OFFICE_NAME == null ||
      this.data.OFFICE_NAME == undefined ||
      this.data.OFFICE_NAME == '' ||
      this.data.OFFICE_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Your Office Name', '');
    } else if (
      this.data.LOCATION == null ||
      this.data.LOCATION == undefined ||
      this.data.LOCATION == '' ||
      this.data.LOCATION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Location', '');
    } else if (
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Designation', '');
    } else if (
      this.data.SERVICE_TYPE == null ||
      this.data.SERVICE_TYPE == '' ||
      this.data.SERVICE_TYPE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Service Type', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
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
      this.data.DDO_OF_THE_OFFICIAL_ID == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select DDO of the Official', '');
    } else if (
      this.data.GRAAS_GRADE_PAY_ID == undefined ||
      this.data.GRAAS_GRADE_PAY_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Grade Pay  ', '');
    } else if (
      this.data.GRADE_PAY_LEVEL_ID == undefined ||
      this.data.GRADE_PAY_LEVEL_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Grade Pay Level ', '');
    } else if (
      this.data.BASIC_PAY == undefined ||
      this.data.BASIC_PAY == null ||
      this.data.BASIC_PAY == '' ||
      this.data.BASIC_PAY == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Basic Pay', '');
    } else if (
      this.data.IS_PRESENT_PAY_LEVEL_CHANGED == 1 &&
      (this.data.PRESENT_PAY_LEVEL_DATE == null ||
        this.data.PRESENT_PAY_LEVEL_DATE == undefined ||
        this.data.PRESENT_PAY_LEVEL_DATE == '')
    ) {
      this.isOk = false;
      this.message.error('Please Select Date of Present Pay Level', '');
    } else if (
      this.data.RETIREMENT_DATE == undefined ||
      this.data.RETIREMENT_DATE == null ||
      this.data.RETIREMENT_DATE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Retirement Date', '');
    } else if (
      this.data.IS_EX_SERVICEMAN == 1 &&
      (this.data.DATE_OF_JOINING_MILITORY == undefined ||
        this.data.DATE_OF_JOINING_MILITORY == null ||
        this.data.DATE_OF_JOINING_MILITORY == '')
    ) {
      this.isOk = false;
      this.message.error(
        'Please Select Date of joining in previous service',
        ''
      );
    } else if (
      this.data.IS_EX_SERVICEMAN == 1 &&
      (this.data.DATE_OF_RETIREMENT_MILITORY == undefined ||
        this.data.DATE_OF_RETIREMENT_MILITORY == null ||
        this.data.DATE_OF_RETIREMENT_MILITORY == '')
    ) {
      this.isOk = false;
      this.message.error('Please Select Date of Retirement', '');
    } else if (
      this.data.CAST == '' ||
      this.data.CAST == null ||
      this.data.CAST == undefined ||
      this.data.CAST.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Caste', '');
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
          if (
            this.data.MIDDLE_NAME != null &&
            this.data.MIDDLE_NAME != '' &&
            this.data.MIDDLE_NAME != undefined &&
            this.data.LAST_NAME != null &&
            this.data.LAST_NAME != '' &&
            this.data.LAST_NAME != undefined
          ) {
            this.data.NAME =
              this.data.FIRST_NAME +
              ' ' +
              this.data.MIDDLE_NAME +
              ' ' +
              this.data.LAST_NAME;
          } else if (
            (this.data.MIDDLE_NAME == null ||
              this.data.MIDDLE_NAME == '' ||
              this.data.MIDDLE_NAME == undefined ||
              this.data.MIDDLE_NAME.trim() == '') &&
            this.data.LAST_NAME != null &&
            this.data.LAST_NAME != '' &&
            this.data.LAST_NAME != undefined &&
            this.data.LAST_NAME.trim() != ''
          ) {
            this.data.MIDDLE_NAME = null;
            this.data.NAME = this.data.FIRST_NAME + ' ' + this.data.LAST_NAME;
          } else if (
            (this.data.LAST_NAME == null ||
              this.data.LAST_NAME == '' ||
              this.data.LAST_NAME == undefined ||
              this.data.LAST_NAME.trim() != '') &&
            this.data.MIDDLE_NAME != null &&
            this.data.MIDDLE_NAME != '' &&
            this.data.MIDDLE_NAME != undefined &&
            this.data.MIDDLE_NAME.trim() != ''
          ) {
            this.data.LAST_NAME = null;
            this.data.NAME = this.data.FIRST_NAME + ' ' + this.data.MIDDLE_NAME;
          } else {
            this.data.NAME = this.data.FIRST_NAME;
          }
          this.api.updateEmployeeMaster(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                sessionStorage.setItem('userName', this.data.NAME);
                this.message.success('Information Changed Successfully...', '');
                if (
                  Number(sessionStorage.getItem('preGradePayid')) !=
                  this.data.GRAAS_GRADE_PAY_ID
                ) {
                  if (
                    sessionStorage.getItem('GPChangeChecklist') == 'T' &&
                    sessionStorage.getItem('flat_check_id') != null &&
                    sessionStorage.getItem('flat_check_id') != '' &&
                    sessionStorage.getItem('flat_check_id') != undefined
                  ) {
                    this.api
                      .removeRecidencetype(
                        Number(sessionStorage.getItem('flat_check_id'))
                      )
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          sessionStorage.removeItem('GPChangeChecklist');
                          sessionStorage.removeItem('preGradePayid');
                        }
                      });
                  }
                }
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
              } else if (successCode.code == '303') {
                this.message.error(
                  'Mobile Number or Email ID Already Exist...',
                  ''
                );
                this.isSpinning = false;
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        } else {
          this.data.NAME =
            this.data.FIRST_NAME +
            ' ' +
            this.data.MIDDLE_NAME +
            ' ' +
            this.data.LAST_NAME;
          this.api.createsimpleEmployeeMaster(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (
                  Number(sessionStorage.getItem('preGradePayid')) !=
                  this.data.GRAAS_GRADE_PAY_ID
                ) {
                  if (
                    sessionStorage.getItem('GPChangeChecklist') == 'T' &&
                    sessionStorage.getItem('flat_check_id') != null &&
                    sessionStorage.getItem('flat_check_id') != '' &&
                    sessionStorage.getItem('flat_check_id') != undefined
                  ) {
                    this.api
                      .removeRecidencetype(
                        Number(sessionStorage.getItem('flat_check_id'))
                      )
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          sessionStorage.removeItem('GPChangeChecklist');
                          sessionStorage.removeItem('preGradePayid');
                        }
                      });
                  }
                }
                if (!addNew) {
                  this.drawerClose();
                  websitebannerPage.form.reset();
                } else {
                  this.data = new EmployeeMaster();
                  this.resetDrawer(websitebannerPage);

                  this.api.getEmployeeMaster(0, 0, '', 'desc', '').subscribe(
                    (data) => {
                      this.data = data['data'][0];
                    },
                    (err) => { }
                  );
                }
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(
                  'Mobile Number or Email ID Already Exist...',
                  ''
                );
                this.isSpinning = false;
              } else if (successCode.code == '303') {
                this.message.error(
                  'Mobile Number or Email ID Already Exist...',
                  ''
                );
                this.isSpinning = false;
              } else {
                this.message.error('Failed To Fill Information...', '');
                this.isSpinning = false;
              }
            },
            (err) => {
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
              this.isSpinning = false;
            }
          );
        }
      }
    }
  }
  isVisible = false;
  OLDEMAIL;
  emailver;
  Allactivitydata;
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
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  MOBILE_NO;
  EMAIL_ID;
  EMP_ID: any;
  isVisible1 = false;
  handleOk1(): void {
    this.isVisible1 = false;
  }
  handleCancel1(): void {
    this.isVisible1 = false;
  }

  OTP;
  isValidOtp(ENTER_OTP) {
    const expression = /^[0-9]+$/;
    return expression.test(String('' + ENTER_OTP).toLowerCase());
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
  handleCancelMobile() {
    this.isVisibleMobile = false;
  }
  handleOkMobile() {
    this.isVisibleMobile = false;
  }
  mobpattern = /^[6-9]\d{9}$/;

  isVisibleMobile1 = false;
  handleCancelMobile1() {
    this.isVisibleMobile1 = false;
  }
  handleOkMobile1() {
    this.isVisibleMobile1 = false;
  }

  isSpinning1: boolean = false;
  SaveEmail() {
    this.EMP_ID = this.data.ID;

    if (this.EMAIL_ID == undefined || this.EMAIL_ID.toString().trim() == '') {
      this.message.error('Please Enter  Offical Email ID', '');
    }
    if (
      this.EMAIL_ID != null &&
      this.EMAIL_ID != undefined &&
      !this.emailpattern.test(this.EMAIL_ID)
    ) {
      this.message.error('Please Enter Valid Official New Email ID', '');
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
                '6-digit OTP sent to entered offical email Id.. Please verify.',
                ''
              );
              this.isVisible1 = true;
              this.isVisible = false;
            } else if (successCode['code'] == '303') {
              this.message.error('Offical Email Id is already registered', '');
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
  SaveMobile() {
    this.EMP_ID = this.data.ID;
    if (this.MOBILE_NO == undefined || this.MOBILE_NO.toString().trim() == '') {
      this.message.error('Please Enter Mobile No', '');
    }
    if (!this.mobpattern.test(this.MOBILE_NO.toString())) {
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
                '6-digit OTP sent to entered Mobile No. Please verify.',
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

  isSpinning2: boolean = false;
  VerifyEmail() {
    this.EMP_ID = this.data.ID;
    if (this.OTP == '' || this.OTP == null || this.OTP == undefined) {
      this.message.error('Please enter OTP', '');
    } else if (
      this.OTP !== '' &&
      this.OTP !== null &&
      this.OTP !== undefined &&
      this.OTP.length < 6
    ) {
      this.message.error('Please enter valid OTP', '');
    } else if (!this.isValidOtp(this.OTP)) {
      this.message.error('Enter numeric characters only', '');
    } else {
      this.isSpinning2 = true;
      this.api.verifyOTP(this.EMAIL_ID, this.OTP, this.EMP_ID).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Email Id Updated Successfully.', '');
            sessionStorage.setItem('emailId', this.EMAIL_ID);

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
                    this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
                    this.isVisible1 = false;
                  }
                },
                (err) => { }
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
  isSpinning4: boolean = false;

  VerifyMobile() {
    this.EMP_ID = this.data.ID;

    if (this.OTP == '' || this.OTP == null || this.OTP == undefined) {
      this.message.error('Please enter OTP', '');
    } else if (
      this.OTP !== '' &&
      this.OTP !== null &&
      this.OTP !== undefined &&
      this.OTP.length < 6
    ) {
      this.message.error('Please enter valid OTP', '');
    } else if (!this.isValidOtp(this.OTP)) {
      this.message.error('Enter numeric characters only', '');
    } else {
      this.isSpinning4 = true;
      this.api.verifyMobileOTP(this.MOBILE_NO, this.OTP, this.EMP_ID).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Mobile No. Updated Successfully.', '');
            sessionStorage.setItem('loginmobileNo', this.MOBILE_NO);
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
                    this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
                    this.isVisibleMobile1 = false;
                    this.isSpinning4 = false;
                  }
                },
                (err) => { }
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

  castshow: boolean = true;
  profileshow: boolean = true;
  clearcaste(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
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

  viewcast(event: any) {
    // window.open()
    window.open(this.api.retriveimgUrl + 'castCertificate/' + event);
  }
  viewphoto(event: any) {
    // window.open()
    window.open(this.api.retriveimgUrl + 'profileImages/' + event);
  }

  progressBar5: boolean = false;
  percent5 = 0;
  timer5: any;
  profilePDF: any;
  urlprofilePdf: any;
  onFileSelectedphoto(event: any) {
    if (event.target.files.length == 0) {
      this.message.error('Please upload profile photo', '');
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
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            this.message.success('Profile Photo Uploaded Successfully...', '');
            this.isSpinning = false;
            this.data.PROFILE_PHOTO = this.urlprofilePdf;
          } else {
            this.isSpinning = false;
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
  clearprofile(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.PROFILE_PHOTO = null;
          // this.profileshow = true;
          this.progressBar5 = false;
          this.percent5 = 0;
        } else {
          this.data.PROFILE_PHOTO = null;
          // this.profileshow = true;
          this.progressBar5 = false;
          this.percent5 = 0;
        }
      },
      (err) => {
        this.message.error('Failed to delete Profile Photo', '');
      }
    );
  }

  selectedDesignation(event: any) {
    if (event) {
      const selected = this.Designationtypes.find((x: any) => x.ID === event);
      if (selected) {
        this.data.DESIGNATION = selected.NAME;
      }
    } else {
      this.data.DESIGNATION = null;
    }
  }

  handleCancelForVerify(): void {
    this.isVisible1 = false;
  }

  handleCancelForVerifyM(): void {
    this.isVisibleMobile1 = false;
  }
}
