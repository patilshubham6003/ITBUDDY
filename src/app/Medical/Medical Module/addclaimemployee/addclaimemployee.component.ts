import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { EmployeeMaster } from '../../Models/Employee';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-addclaimemployee',
  templateUrl: './addclaimemployee.component.html',
  styleUrls: ['./addclaimemployee.component.css'],
})
export class AddclaimemployeeComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any = EmployeeMaster;
  claimUpdate;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  mobilepattern = /^[6-9]\d{9}$/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  officialEmailPattern = /^[a-zA-Z0-9._%+-]+@incometax\.gov\.in$/;
  passwordVisible = false;
  isAdmin: boolean = false;
  roleId: any;
  designationList: any = [];
  ddoOfTheOfficialDataList: any = [];
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.ListOfDesignation();
    this.ddoOfTheOfficialList();
    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

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

          if (!this.data.ID) {
            if (data['count'] == this.ddoOfTheOfficialDataList.length) {
              if (
                this.data.DDO_OF_THE_OFFICIAL_ID == null ||
                this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
                this.data.DDO_OF_THE_OFFICIAL_ID == '' ||
                this.data.DDO_OF_THE_OFFICIAL_ID == 0
              ) {
                this.data.DDO_OF_THE_OFFICIAL_ID = Number(
                  sessionStorage.getItem('ddoId')
                );
              } else {
                this.data.DDO_OF_THE_OFFICIAL_ID =
                  this.data.DDO_OF_THE_OFFICIAL_ID;
              }
            } else {
            }
          } else {
            if (
              this.data.DDO_OF_THE_OFFICIAL_ID == null ||
              this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
              this.data.DDO_OF_THE_OFFICIAL_ID == '' ||
              this.data.DDO_OF_THE_OFFICIAL_ID == 0
            ) {
              this.data.DDO_OF_THE_OFFICIAL_ID = Number(
                sessionStorage.getItem('ddoId')
              );
            } else {
              this.data.DDO_OF_THE_OFFICIAL_ID =
                this.data.DDO_OF_THE_OFFICIAL_ID;
            }
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

  ListOfDesignation() {
    this.api
      .getAllDesignations(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.designationList = data['data'];
            } else {
              this.designationList = [];
            }
          } else {
            this.message.error("Can't Load Designation Data", '');
          }
        },
        (err) => {}
      );
  }
  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
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

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.SALUTATION == undefined &&
      this.data.NAME.trim() == '' &&
      this.data.GRADE_PAY == undefined &&
      this.data.DESIGNATION_ID == undefined
      // &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&
      // this.data.MOBILE_NO == undefined
      // && this.data.EMAIL_ID == undefined
      //  &&this.data.PASSWORD == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.SALUTATION == null ||
      this.data.SALUTATION == undefined ||
      this.data.SALUTATION == ' '
    ) {
      this.isOk = false;
      this.message.error(' Please Select Salutation', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Employee Name.', '');
    } else if (
      this.data.IS_EMAIL_MOBILE &&
      (this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID.trim() == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Official Email ID', '');
    } else if (
      this.data.IS_EMAIL_MOBILE &&
      !this.officialEmailPattern.test(this.data.EMAIL_ID)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Official Email', '');
    } else if (
      this.data.IS_EMAIL_MOBILE &&
      (this.data.MOBILE_NO == undefined ||
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO <= 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile Number', '');
    } else if (
      this.data.IS_EMAIL_MOBILE &&
      !this.mobilepattern.test(this.data.MOBILE_NO.toString())
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile No.', '');
    }
    // else if (this.data.PASSWORD == null || this.data.PASSWORD == undefined) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Password', '');
    // } else if ( (this.data.ID !=null ||this.data.ID !=undefined ||
    //   this.data.ID !='' ||this.data.ID >0) &&
    //   (this.data.PASSWORD != null || this.data.PASSWORD != undefined) &&
    //   this.data.PASSWORD.length < 8
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Password Must Be 8 Character/Digit', '');

    // }
    else if (
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Designation', '');
    } else if (
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == 0 ||
      this.data.EMPLOYEE_CODE == ' '
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Employee Code      ', '');
      // }
      // else if (
      //   this.data.EMPLOYEE_CODE == undefined ||
      //   this.data.EMPLOYEE_CODE <= 0
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Employee Code  ', '');
      // }
      // else if (
      //   this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == 0
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Select DDO of the Official', '');
    } else if (this.data.GRADE_PAY == undefined || this.data.GRADE_PAY <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Basic Pay  ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      // if (

      //   this.data.EMAIL_ID == undefined ||
      //   this.data.EMAIL_ID == null ||
      //   this.data.EMAIL_ID == '' ||
      //   this.data.EMAIL_ID.trim() == ''
      // ) {
      //   this.data.EMAIL_ID = ' ';
      // } else {
      //   this.data.EMAIL_ID = this.data.EMAIL_ID;
      // }

      if (this.data.IS_EMAIL_MOBILE) {
        this.data.EMAIL_ID = this.data.EMAIL_ID;
        this.data.MOBILE_NO = this.data.MOBILE_NO;
      } else {
        this.data.EMAIL_ID = '';
        this.data.MOBILE_NO = '';
      }
      // if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO == '' ||
      //   this.data.MOBILE_NO.trim() == ''
      // ) {
      //   this.data.MOBILE_NO = ' ';
      // } else {
      //   this.data.MOBILE_NO = this.data.MOBILE_NO;
      // }

      if (
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == '' ||
        this.data.ADDRESS.trim() == ''
      ) {
        this.data.ADDRESS = null;
      } else {
        this.data.ADDRESS = this.data.ADDRESS;
      }
      if (
        this.data.OFFICE_NAME == undefined ||
        this.data.OFFICE_NAME == null ||
        this.data.OFFICE_NAME == '' ||
        this.data.OFFICE_NAME.trim() == ''
      ) {
        this.data.OFFICE_NAME = null;
      } else {
        this.data.OFFICE_NAME = this.data.OFFICE_NAME;
      }
      if (
        this.data.LOCATION == undefined ||
        this.data.LOCATION == null ||
        this.data.LOCATION == '' ||
        this.data.LOCATION.trim() == ''
      ) {
        this.data.LOCATION = null;
      } else {
        this.data.LOCATION = this.data.LOCATION;
      }
      {
        if (this.data.SALUTATION == 'Shri') {
          this.data.SALUTATION_HN = 'श्री';
        } else {
          this.data.SALUTATION_HN = 'श्रीमती';
        }
        if (this.data.ID) {
          // this.data.CLAIM_ID = this.claimID

          if (this.claimUpdate == 'MedicalClaim') {
            // this.data['CLAIM_ID'] = this.claimID;

            this.api
              .updateClaimWithoutHospitalData(this.data)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // this.message.success('Information Saved Successfully...', '');

                  if (!addNew) this.resetDrawer(websitebannerPage);
                  this.drawerClose();
                } else if (
                  successCode.code == '300' ||
                  successCode.code == '303'
                ) {
                  this.message.error(
                    'Email ID or Mobile Number Already Registered...',
                    ''
                  );
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Has Not Saved...', '');
                  this.isSpinning = false;
                }
              });
          } else {
            this.api
              .updateEmployeeMaster(this.data)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
                  if (!addNew) this.resetDrawer(websitebannerPage);
                  this.drawerClose();
                  this.isSpinning = false;
                } else if (
                  successCode.code == '300' ||
                  successCode.code == '303'
                ) {
                  this.message.error('', successCode.message);
                  // this.message.error(
                  //   'Email ID or Mobile Number Already Registered...',
                  //   ''
                  // );
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Has Not Changed...', '');
                  this.isSpinning = false;
                }
              });
          }
        } else {
          this.data.PASSWORD = CryptoJS.MD5(this.data.PASSWORD).toString(
            CryptoJS.enc.Hex
          );
          this.api
            .createEmployeeMasterBasic(this.data)
            // .createsimpleEmployeeMaster(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) {
                  this.resetDrawer(websitebannerPage);
                  this.drawerClose();
                } else {
                  this.data = new EmployeeMaster();
                  this.resetDrawer(websitebannerPage);
                  // this.data.IMG_URL= '';

                  this.api.getEmployeeMaster(0, 0, '', 'desc', '').subscribe(
                    (data) => {
                      // if (data['count']==0){
                      //   this.data.SEQUENCE_NUMBER=1;
                      // }else
                      // {
                      //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                      // }
                    },
                    (err) => {}
                  );
                }
                this.isSpinning = false;
              } else if (
                successCode.code == '300' ||
                successCode.code == '303'
              ) {
                this.message.error('', successCode.message);
                // this.message.error(
                //   'Email ID or Mobile Number Already Registered...',
                //   ''
                // );
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
  saveForClaim(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.SALUTATION == undefined &&
      this.data.NAME.trim() == '' &&
      this.data.GRADE_PAY == undefined &&
      this.data.DESIGNATION_ID == undefined
      // &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&
      // this.data.MOBILE_NO == undefined
      // && this.data.EMAIL_ID == undefined
      //  &&this.data.PASSWORD == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.SALUTATION == null ||
      this.data.SALUTATION == undefined ||
      this.data.SALUTATION == ' '
    ) {
      this.isOk = false;
      this.message.error(' Please Select Salutation', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Employee Name.', '');
      // } else if (
      //   this.data.EMAIL_ID == null ||
      //   this.data.EMAIL_ID == undefined ||
      //   this.data.EMAIL_ID.trim() == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Official Email ID', '');
      // } else if (!this.officialEmailPattern.test(this.data.EMAIL_ID)) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Valid Official Email', '');
      // } else if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO <= 0
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Mobile Number', '');
      // } else if (!this.mobilepattern.test(this.data.MOBILE_NO.toString())) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Valid Mobile No.', '');
    } else if (
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Designation', '');
    } else if (
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == 0 ||
      this.data.EMPLOYEE_CODE == ' '
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Employee Code', '');
      // }
      // else if (
      //   this.data.EMPLOYEE_CODE == undefined ||
      //   this.data.EMPLOYEE_CODE <= 0
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Employee Code  ', '');
      // }
      // else if (
      //   this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == 0
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Select DDO of the Official', '');
    } else if (this.data.GRADE_PAY == undefined || this.data.GRADE_PAY <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Basic Pay  ', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      // if (

      //   this.data.EMAIL_ID == undefined ||
      //   this.data.EMAIL_ID == null ||
      //   this.data.EMAIL_ID == '' ||
      //   this.data.EMAIL_ID.trim() == ''
      // ) {
      //   this.data.EMAIL_ID = ' ';
      // } else {
      //   this.data.EMAIL_ID = this.data.EMAIL_ID;
      // }

      // if (this.data.IS_EMAIL_MOBILE) {
      //   this.data.EMAIL_ID = this.data.EMAIL_ID;
      //   this.data.MOBILE_NO = this.data.MOBILE_NO;
      // } else {
      //   this.data.EMAIL_ID = '';
      //   this.data.MOBILE_NO = '';
      // }
      // if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO == '' ||
      //   this.data.MOBILE_NO.trim() == ''
      // ) {
      //   this.data.MOBILE_NO = ' ';
      // } else {
      //   this.data.MOBILE_NO = this.data.MOBILE_NO;
      // }

      if (
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == '' ||
        this.data.ADDRESS.trim() == ''
      ) {
        this.data.ADDRESS = null;
      } else {
        this.data.ADDRESS = this.data.ADDRESS;
      }
      if (
        this.data.OFFICE_NAME == undefined ||
        this.data.OFFICE_NAME == null ||
        this.data.OFFICE_NAME == '' ||
        this.data.OFFICE_NAME.trim() == ''
      ) {
        this.data.OFFICE_NAME = null;
      } else {
        this.data.OFFICE_NAME = this.data.OFFICE_NAME;
      }
      if (
        this.data.LOCATION == undefined ||
        this.data.LOCATION == null ||
        this.data.LOCATION == '' ||
        this.data.LOCATION.trim() == ''
      ) {
        this.data.LOCATION = null;
      } else {
        this.data.LOCATION = this.data.LOCATION;
      }
      {
        if (this.data.SALUTATION == 'Shri') {
          this.data.SALUTATION_HN = 'श्री';
        } else {
          this.data.SALUTATION_HN = 'श्रीमती';
        }
        var claimData = {
          ID: this.data.ID,
          EMP_ID: this.data.EMP_ID,
          SALUTATION: this.data.SALUTATION,
          EMPLOYEE_NAME: this.data.NAME,
          EMAIL_ID: this.data.EMAIL_ID,
          MOBILE_NO: this.data.MOBILE_NO,
          ADDRESS: this.data.ADDRESS,
          LOCATION: this.data.LOCATION,
          DESIGNATION_ID: this.data.DESIGNATION_ID,
          EMPLOYEE_CODE: this.data.EMPLOYEE_CODE,
          DDO_OF_THE_OFFICIAL_ID: this.data.DDO_OF_THE_OFFICIAL_ID,
          GRADE_PAY: this.data.GRADE_PAY,
        };
        if (this.data.ID) {
          // this.data.CLAIM_ID = this.claimID

          if (this.claimUpdate == 'MedicalClaim') {
            // this.data['CLAIM_ID'] = this.claimID;

            this.api
              .updateClaimWithoutHospitalData(claimData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // this.message.success('Information Saved Successfully...', '');

                  if (!addNew) this.resetDrawer(websitebannerPage);
                  this.drawerClose();
                } else if (
                  successCode.code == '300' ||
                  successCode.code == '303'
                ) {
                  this.message.error(
                    'Email ID or Mobile Number Already Registered...',
                    ''
                  );
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Has Not Saved...', '');
                  this.isSpinning = false;
                }
              });
          } else {
            this.api
              .updateEmployeeMaster(claimData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
                  if (!addNew) this.resetDrawer(websitebannerPage);
                  this.drawerClose();
                  this.isSpinning = false;
                } else if (
                  successCode.code == '300' ||
                  successCode.code == '303'
                ) {
                  this.message.error('', successCode.message);
                  // this.message.error(
                  //   'Email ID or Mobile Number Already Registered...',
                  //   ''
                  // );
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Has Not Changed...', '');
                  this.isSpinning = false;
                }
              });
          }
        }
      }
    }
  }

  clearEmailMobile() {
    if (this.data.IS_EMAIL_MOBILE) {
    } else {
      this.data.EMAIL_ID = ' ';
      this.data.MOBILE_NO = ' ';
    }
  }
}
