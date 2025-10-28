import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';

import { CookieService } from 'ngx-cookie-service';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { ApplicantMaster } from 'src/app/Medical/Models/applicantmaster';
import { CheckList } from 'src/app/Medical/Models/checkList';
import { ClaimMaster } from 'src/app/Medical/Models/claimmaster';
import { QuestionaryMaster } from 'src/app/Medical/Models/questionarymaster';

@Component({
  selector: 'app-addforwardmaster',
  templateUrl: './addforwardmaster.component.html',
  styleUrls: ['./addforwardmaster.component.css'],
})
export class AddforwardmasterComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) { }
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  isSpinning = false;
  isOk = true;
  mobpattern = /^[6-9]\d{9}$/;
  ngOnInit(): void {
    // this.current = 0;
    this.allEmployeeList();
    this.allHospitalList();
  }
  @Input()
  drawerVisible: boolean = false;
  empDrawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: ApplicantMaster;
  @Input() empID: any;
  @Input() claimID: any;
  // @Input() data2: ClaimMaster;
  //  data2: ClaimMaster;
  // @Input() data3: QuestionaryMaster;
  data2: ClaimMaster = new ClaimMaster();
  data3: QuestionaryMaster = new QuestionaryMaster();
  // @Input() data4: CheckList;
  //  data4: CheckList;
  data4: CheckList = new CheckList();

  @Input() current = 0;
  employee: EmployeeMaster[] = [];

  Cities: EmployeeMaster[];
  filteredOptions: any = [];
  Names = EmployeeMaster;
  hospitalList: any = [];
  diffDays: any;

  TREATEMENT_TYPE1 = false;
  TREATEMENT_TYPE2 = false;
  CGHS_AMA_REFERENCE_DATE: any = new Date();
  empLoader: boolean = false;
  allEmployeeList() {
    this.empLoader = true;

    this.api.getEmployeeMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.employee = data['data'];
          this.filteredOptions = this.employee;
          this.empLoader = false;
        } else {
          // this.message.error("Can't Load Employee Data", '');
          this.empLoader = false;
        }
      },
      (err) => {

      }
    );
    if (this.data.EMP_ID != null || this.data.EMP_ID != undefined) {
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
              this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
              this.data.LOCATION = data['data'][0]['LOCATION'];
              this.data.DDO_OF_THE_OFFICIAL =
                data['data'][0]['DDO_OF_THE_OFFICIAL'];
              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.ADDRESS = data['data'][0]['ADDRESS'];
            } else {
              // this.message.error("Can't Load Employee Data", '');
            }
          },
          (err) => {

          }
        );
    } else {
    }
  }

  allHospitalList() {
    this.api.getAllHospital(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.hospitalList = data['data'];
        }
      },
      (err) => {

      }
    );
  }
  close(): void {
    this.current = 0;
    this.drawerClose();
  }

  applicantResetDrawer(applicantMasterPages: NgForm) {


    this.data = new ApplicantMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    // applicantMasterPages.form.markAsPristine();
    // applicantMasterPages.form.markAsUntouched();
    applicantMasterPages.form.reset();
  }
  claimResetDrawer(claimMasterPage: NgForm) {
    this.data2 = new ClaimMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    // claimMasterPage.form.markAsPristine();
    // claimMasterPage.form.markAsUntouched();
    claimMasterPage.form.reset();
  }
  queResetDrawer(queMasterPage: NgForm) {
    this.data3 = new QuestionaryMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    // queMasterPage.form.markAsPristine();
    // queMasterPage.form.markAsUntouched();
    queMasterPage.form.reset();
  }
  checkResetDrawer(checkListMasterPage: NgForm) {
    this.data4 = new CheckList();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    // checkListMasterPage.form.markAsPristine();
    // checkListMasterPage.form.markAsUntouched();
    checkListMasterPage.form.reset();
  }
  // close(applicantMasterPages: NgForm,claimMasterPage: NgForm,queMasterPage: NgForm,checkListMasterPage: NgForm) {
  //   
  //  this.current = 0;
  //   this.applicantResetDrawer(applicantMasterPages);
  //   this.claimResetDrawer(claimMasterPage);
  //   this.queResetDrawer(queMasterPage);
  //   this.checkResetDrawer(checkListMasterPage);
  //   // claimMasterPage.form.reset();
  //   this.drawerClose();
  // }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  dateOmit(event: any) {
    return false;
  }

  save(addNew: boolean, claimMasterPage: NgForm): void {
    if (this.current == 0) {
      this.current = 1;
    } else if (this.current == 1) {
      this.current = 2;
    } else if (this.current == 2) {
      this.current = 3;
    }
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == '' &&
      this.data.LOCATION.trim() == '' &&
      this.data.DDO_OF_THE_OFFICIAL.trim() == '' &&
      this.data.DESIGNATION.trim() == '' &&
      this.data.OFFICE_NAME.trim() == '' &&
      this.data.EMPLOYEE_CODE == 0 &&
      this.data.GRADE_PAY == 0
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Employee Name.', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Employee Code  ', '');
    } else if (this.data.GRADE_PAY == undefined || this.data.GRADE_PAY <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Grade Pay  ', '');
    } else if (
      this.data.OFFICE_NAME == null ||
      this.data.OFFICE_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Name.', '');
    } else if (
      this.data.DESIGNATION == null ||
      this.data.DESIGNATION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Designation', '');
    } else if (this.data.LOCATION == null || this.data.LOCATION.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Location', '');
    } else if (
      this.data.DDO_OF_THE_OFFICIAL == null ||
      this.data.DDO_OF_THE_OFFICIAL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Designation', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateEmployeeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createEmployeeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new ApplicantMaster();
                // this.resetDrawer(claimMasterPage);
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
                  (err) => {

                  }
                );
              }
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
  empAllDataForUpdate: any;
  empSave(addNew: boolean, claimMasterPage: NgForm): void {
    this.isSpinning = false;



    this.isOk = true;

    if (
      this.data.EMP_ID == undefined &&
      this.data.DESIGNATION == undefined &&
      this.data.OFFICE_NAME == undefined &&
      this.data.DDO_OF_THE_OFFICIAL == undefined &&
      this.data.EMPLOYEE_CODE == undefined &&
      this.data.GRADE_PAY == 0 &&
      this.data.BENEFICIARY_TYPE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.EMP_ID == undefined ||
      this.data.EMP_ID == null ||
      this.data.EMP_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Employee Name', '');
    } else if (
      this.data.DESIGNATION == undefined ||
      this.data.DESIGNATION == null ||
      this.data.DESIGNATION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Designation', '');
    } else if (
      this.data.OFFICE_NAME == undefined ||
      this.data.OFFICE_NAME == null ||
      this.data.OFFICE_NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Name', '');
    } else if (
      this.data.DDO_OF_THE_OFFICIAL == undefined ||
      this.data.DDO_OF_THE_OFFICIAL == null ||
      this.data.DDO_OF_THE_OFFICIAL == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter DDO Of The Official', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Employee Code', '');
    } else if (
      this.data.GRADE_PAY == undefined ||
      this.data.GRADE_PAY == null ||
      this.data.GRADE_PAY == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Basic Pay ', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null ||
      this.data.MOBILE_NO == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile Number', '');
    } else if (
      this.data.BENEFICIARY_TYPE == undefined ||
      this.data.BENEFICIARY_TYPE == null ||
      this.data.BENEFICIARY_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Beneficiary Type', '');
    } else if (
      this.data.BENEFICIARY_TYPE == 'CG' &&
      (this.data.CGHS_CARD_NO == undefined ||
        this.data.CGHS_CARD_NO == null ||
        this.data.CGHS_CARD_NO == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter CGHS Card Number.', '');
    } else if (
      this.data.BENEFICIARY_TYPE == 'CG' &&
      (this.data.CGHS_CARD_VALIDITY == undefined ||
        this.data.CGHS_CARD_VALIDITY == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter CGHS Card Validity  ', '');
    }
    //  else if (
    //   this.data.MOBILE_NO != undefined ||
    //   this.data.MOBILE_NO != null ||
    //   this.data.MOBILE_NO != '' &&
    //   ( this.data.MOBILE_NO.length < 10))
    //  {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Valid 10 Digit Mobile Number', '');
    // }
    // else
    // if (
    //   this.data.EMAIL_ID != null ||
    //   this.data.EMAIL_ID != undefined ||
    //   this.data.EMAIL_ID != '' ||
    //   this.data.EMAIL_ID.trim() == ''
    // )
    // {
    //   if ((this.data.EMAIL_ID != null ||
    //     this.data.EMAIL_ID != undefined ||
    //     this.data.EMAIL_ID != '' ||
    //     this.data.EMAIL_ID.trim() == '') && (this.emailpattern.test(this.data.EMAIL_ID))) {
    //     this.message.error('Email ID Must be Proper', '');
    //   this.isOk = false;
    //   }
    // }
    if (this.isOk) {
      // this.data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
      this.isSpinning = true;
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
        this.data.EMPLOYEE_CODE == undefined ||
        this.data.EMPLOYEE_CODE == null ||
        this.data.EMPLOYEE_CODE == '' ||
        this.data.EMPLOYEE_CODE.trim() == ''
      ) {
        this.data.EMPLOYEE_CODE = ' ';
      } else {
        this.data.EMPLOYEE_CODE = this.data.EMPLOYEE_CODE;
      }

      if (
        this.data.MOBILE_NO == undefined ||
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == '' ||
        this.data.MOBILE_NO.trim() == ''
      ) {
        this.data.MOBILE_NO = ' ';
      } else {
        this.data.MOBILE_NO = this.data.MOBILE_NO;
      }

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
        this.data.BENEFICIARY_TYPE == 'CS' &&
        (this.data.CGHS_CARD_NO != undefined ||
          this.data.CGHS_CARD_NO != null ||
          this.data.CGHS_CARD_NO != '')
      ) {
        this.data.CGHS_CARD_NO = null;
      } else {
        this.data.CGHS_CARD_NO = this.data.CGHS_CARD_NO;
      }
      if (
        this.data.BENEFICIARY_TYPE == 'CS' &&
        (this.data.CGHS_CARD_VALIDITY != undefined ||
          this.data.CGHS_CARD_VALIDITY != null ||
          this.data.CGHS_CARD_VALIDITY != '')
      ) {
        this.data.CGHS_CARD_VALIDITY = null;
      } else {
        this.data.CGHS_CARD_VALIDITY = this.data.CGHS_CARD_VALIDITY;
      }
      this.data.CGHS_CARD_VALIDITY = this.datepipe.transform(
        this.data.CGHS_CARD_VALIDITY,
        'yyyy-MM-dd'
      );
      {
        if (this.data.ID) {



          // var data = {
          //   ID: this.empID,
          //   CLIENT_ID: 1,
          //   NAME: this.data.NAME,
          //   EMPLOYEE_CODE: this.data.EMPLOYEE_CODE,
          //   GRADE_PAY: this.data.GRADE_PAY,
          //   OFFICE_NAME: this.data.OFFICE_NAME,
          //   DESIGNATION: this.data.DESIGNATION,
          //   LOCATION: this.data.LOCATION,
          //   DDO_OF_THE_OFFICIAL: this.data.DDO_OF_THE_OFFICIAL,
          //   BENEFICIARY_TYPE: this.data.BENEFICIARY_TYPE,
          //   CGHS_CARD_NO: this.data.CGHS_CARD_NO,
          //   CGHS_CARD_VALIDITY: this.data.CGHS_CARD_VALIDITY,
          //   EMP_ID: this.empID,
          //   CLAIM_ID: this.claimID,
          //   MOBILE_NO: this.data.MOBILE_NO,
          //   EMAIL_ID: this.data.EMAIL_ID,
          //   STATUS: true,
          //   ADDRESS: this.data.ADDRESS,
          // };
          if (this.empID != undefined && this.empID == this.data.EMP_ID) {

            this.empAllDataForUpdate = {
              ID: this.empID,
              CLIENT_ID: 1,
              NAME: this.data.NAME,
              EMPLOYEE_CODE: this.data.EMPLOYEE_CODE,
              GRADE_PAY: this.data.GRADE_PAY,
              OFFICE_NAME: this.data.OFFICE_NAME,
              DESIGNATION: this.data.DESIGNATION,
              LOCATION: this.data.LOCATION,
              DDO_OF_THE_OFFICIAL: this.data.DDO_OF_THE_OFFICIAL,
              BENEFICIARY_TYPE: this.data.BENEFICIARY_TYPE,
              CGHS_CARD_NO: this.data.CGHS_CARD_NO,
              CGHS_CARD_VALIDITY: this.data.CGHS_CARD_VALIDITY,
              EMP_ID: this.empID,
              CLAIM_ID: this.claimID,
              MOBILE_NO: this.data.MOBILE_NO,
              EMAIL_ID: this.data.EMAIL_ID,
              STATUS: true,
              ADDRESS: this.data.ADDRESS,
              INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
            };
          } else {
            this.claimID = null;


            this.empAllDataForUpdate = {
              ID: this.data.ID,
              CLIENT_ID: 1,
              NAME: this.data.NAME,
              EMPLOYEE_CODE: this.data.EMPLOYEE_CODE,
              GRADE_PAY: this.data.GRADE_PAY,
              OFFICE_NAME: this.data.OFFICE_NAME,
              DESIGNATION: this.data.DESIGNATION,
              LOCATION: this.data.LOCATION,
              DDO_OF_THE_OFFICIAL: this.data.DDO_OF_THE_OFFICIAL,
              BENEFICIARY_TYPE: this.data.BENEFICIARY_TYPE,
              CGHS_CARD_NO: this.data.CGHS_CARD_NO,
              CGHS_CARD_VALIDITY: this.data.CGHS_CARD_VALIDITY,
              EMP_ID: this.data.ID,
              CLAIM_ID: this.claimID,
              MOBILE_NO: this.data.MOBILE_NO,
              EMAIL_ID: this.data.EMAIL_ID,
              STATUS: true,
              ADDRESS: this.data.ADDRESS,
              INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
            };
          }
          this.data['CLAIM_ID'] = this.claimID;
          this.api
            .updateEmployeeMasterFromClaim(this.empAllDataForUpdate)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Saved Successfully...', '');
                // this.api.updateclaimed(this.data).subscribe((successCode) => {
                // if (successCode.code == '200') {
                //   this.message.success(
                //     'Information Saved Successfully...',
                //     ''
                //   );
                this.empID = successCode.EMPLOYEE;
                this.claimID = successCode.CLAIM;
                this.next();
                //     // if (!addNew) this.drawerClose();
                //     this.isSpinning = false;
                // } else {
                //   this.message.error('Information Has Not Saved...', '');
                //   this.isSpinning = false;
                // }
                // });
                this.isSpinning = false;
              } else if (successCode.code == '300') {
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
          this.api.createEmployeeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              this.empID = successCode.EMPLOYEE;
              this.claimID = successCode.CLAIM;


              this.next();
              // if (!addNew)
              // this.drawerClose();
              // else {
              //   this.data = new ApplicantMaster();
              //   this.resetDrawer(claimMasterPage);
              //   // this.data.IMG_URL= '';

              //   this.api.getEmployeeMaster(0,0,'','desc','').subscribe (data =>{
              //     // if (data['count']==0){
              //     //   this.data.SEQUENCE_NUMBER=1;
              //     // }else
              //     // {
              //     //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
              //     // }
              //   },err=>{
              //     
              //   })
              // }
              this.isSpinning = false;
            } else if (successCode.code == '300') {
              this.message.error(
                'Email ID or Mobile Number Already Registered...',
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

  claimSave(addNew: boolean, claimMasterPage: NgForm): void {
    this.data2.EMP_ID = this.empID;
    this.data2.ID = this.claimID;
    this.data2.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));




    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data2.PATIENT_NAME == undefined &&
      this.data2.RELATION_WITH_PATIENT == undefined &&
      this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined &&
      this.data2.NATURE_OF_TREATMENT == undefined &&
      this.data2.TREATMENT_START_DATE == undefined &&
      this.data2.TREATMENT_END_DATE == undefined &&
      this.data2.HOSPITAL_TYPE == '' &&
      this.data2.BILL_FILIING_DATE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data2.PATIENT_NAME == undefined ||
      this.data2.PATIENT_NAME == null ||
      this.data2.PATIENT_NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Patient Name', '');
    } else if (
      this.data2.RELATION_WITH_PATIENT == undefined ||
      this.data2.RELATION_WITH_PATIENT == null ||
      this.data2.RELATION_WITH_PATIENT == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Relation with Patient', '');
    } else if (
      this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined ||
      this.data2.PATIENT_CGHS_BENEFICIERY_NO == null ||
      this.data2.PATIENT_CGHS_BENEFICIERY_NO == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Patient CGHS Beneficiary Number', '');
    } else if (
      this.data2.NATURE_OF_TREATMENT == undefined ||
      this.data2.NATURE_OF_TREATMENT == null ||
      this.data2.NATURE_OF_TREATMENT == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Nature Of Treatment/Test', '');
    } else if (
      this.data2.TREATMENT_START_DATE == undefined ||
      this.data2.TREATMENT_START_DATE == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Treatment Start Date', '');
    } else if (
      this.data2.TREATMENT_END_DATE == undefined ||
      this.data2.TREATMENT_END_DATE == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Treatment End Date', '');
    } else if (
      this.data2.IS_ADVANCE_TAKEN == true &&
      (this.data2.ADVANCE_AMOUNT == undefined ||
        this.data2.ADVANCE_AMOUNT == null ||
        this.data2.ADVANCE_AMOUNT == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Advance Amount.', '');
    } else if (
      this.data2.IS_ADVANCE_TAKEN == true &&
      (this.data2.ADVANCE_TAKEN_DATE == undefined ||
        this.data2.ADVANCE_TAKEN_DATE == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Date Of Advance Taken.  ', '');
    } else if (
      this.data2.HOSPITAL_TYPE == undefined ||
      this.data2.HOSPITAL_TYPE == null ||
      this.data2.HOSPITAL_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Hospital Type', '');
    } else if (
      this.data2.HOSPITAL_TYPE == 'E' &&
      (this.data2.HOSPITAL_ID == undefined ||
        this.data2.HOSPITAL_ID == null ||
        this.data2.HOSPITAL_ID == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Hospital Name.', '');
    } else if (
      this.data2.HOSPITAL_TYPE == 'E' &&
      (this.data2.HOSPITAL_ADDRESS == undefined ||
        this.data2.HOSPITAL_ADDRESS == null ||
        this.data2.HOSPITAL_ADDRESS == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Hospital Address.', '');
    } else if (
      (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
      (this.data2.HOSPITAL_NAME == undefined ||
        this.data2.HOSPITAL_NAME == null ||
        this.data2.HOSPITAL_NAME == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Hospital Name.  ', '');
    } else if (
      (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
      (this.data2.HOSPITAL_ADDRESS == undefined ||
        this.data2.HOSPITAL_ADDRESS == null ||
        this.data2.HOSPITAL_ADDRESS == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Hospital Address. ', '');
    } else if (
      (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
      (this.data2.CLAIM_ACCREDITATION == undefined ||
        this.data2.CLAIM_ACCREDITATION == null ||
        this.data2.CLAIM_ACCREDITATION == '')
    ) {
      this.isOk = false;
      this.message.error('Please Select Accredition.  ', '');
    } else if (
      this.data2.BILL_FILIING_DATE == undefined ||
      this.data2.BILL_FILIING_DATE == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Bill Filling Date', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.data2.TREATMENT_START_DATE = this.datepipe.transform(
        this.data2.TREATMENT_START_DATE,
        'yyyy-MM-dd'
      );
      this.data2.TREATMENT_END_DATE = this.datepipe.transform(
        this.data2.TREATMENT_END_DATE,
        'yyyy-MM-dd'
      );
      this.data2.BILL_FILIING_DATE = this.datepipe.transform(
        this.data2.BILL_FILIING_DATE,
        'yyyy-MM-dd'
      );
      this.data2.ADVANCE_TAKEN_DATE = this.datepipe.transform(
        this.data2.ADVANCE_TAKEN_DATE,
        'yyyy-MM-dd'
      );

      var date1: any = new Date(this.data2.TREATMENT_END_DATE);
      var date2: any = new Date(this.data2.BILL_FILIING_DATE);
      this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;


      var advance;
      if (this.data2.IS_ADVANCE_TAKEN == true) {
        advance = 1;

      } else {
        advance = 0;

      }
      if (advance == 1 && this.diffDays <= 30) {
        this.data3.BILL_FILLED_INTIME = true;
      } else if (advance == 1 && this.diffDays > 30) {
        this.data3.BILL_FILLED_INTIME = false;
      } else if (advance == 0 && this.diffDays > 182) {
        this.data3.BILL_FILLED_INTIME = false;
      } else {
        this.data3.BILL_FILLED_INTIME = true;
      }

      if (
        this.data2.HOSPITAL_TYPE == 'E' &&
        (this.data2.HOSPITAL_NAME != undefined ||
          this.data2.HOSPITAL_NAME != null ||
          this.data2.HOSPITAL_NAME != '' ||
          this.data2.HOSPITAL_NAME.trim() != '')
      ) {
        this.data2.HOSPITAL_NAME = '';
      } else {
        this.data2.HOSPITAL_NAME = this.data2.HOSPITAL_NAME;
      }

      // if(this.data2.HOSPITAL_TYPE == 'E' && (this.data2.HOSPITAL_ADDRESS != undefined || this.data2.HOSPITAL_ADDRESS != null
      //   || this.data2.HOSPITAL_ADDRESS != '' || this.data2.HOSPITAL_ADDRESS.trim() != '' )){
      //     this.data2.HOSPITAL_ADDRESS = ''
      //   } else{
      //     this.data2.HOSPITAL_ADDRESS = this.data2.HOSPITAL_ADDRESS
      //   }

      if (
        this.data2.HOSPITAL_TYPE == 'E' &&
        (this.data2.CLAIM_ACCREDITATION != undefined ||
          this.data2.CLAIM_ACCREDITATION != null ||
          this.data2.CLAIM_ACCREDITATION != '' ||
          this.data2.CLAIM_ACCREDITATION.trim() != '')
      ) {
        this.data2.CLAIM_ACCREDITATION = '';
      } else {
        this.data2.CLAIM_ACCREDITATION = this.data2.CLAIM_ACCREDITATION;
      }

      if (
        (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
        (this.data2.HOSPITAL_ID != undefined ||
          this.data2.HOSPITAL_ID != null ||
          this.data2.HOSPITAL_ID != '' ||
          this.data2.HOSPITAL_ID.trim() != '')
      ) {
        this.data2.HOSPITAL_ID = '';
      } else {
        this.data2.HOSPITAL_ID = this.data2.HOSPITAL_ID;
      }

      {
        if (this.data2.ID) {
          this.data2.CURRENT_STAGE_ID = 3;
          this.api.updateclaimed(this.data2).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              this.billInTime();
              this.empanelledHospital();
              this.next();
              // if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createclaimed(this.data2).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              // this.claimID = successCode.EMPLOYEE
              // 
              this.billInTime();
              this.empanelledHospital();
              this.next();

              // if (!addNew) this.drawerClose();
              // else {
              //   // this.data = new ApplicantMaster();
              //   this.resetDrawer(claimMasterPage);
              //   // this.data.IMG_URL= '';

              //   // this.api.getEmployeeMaster(0,0,'','desc','').subscribe (data =>{
              //   //   // if (data['count']==0){
              //   //   //   this.data.SEQUENCE_NUMBER=1;
              //   //   // }else
              //   //   // {
              //   //   //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
              //   //   // }
              //   // },err=>{
              //   //   
              //   // })
              // }
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

  queSave(addNew: boolean, claimMasterPage: NgForm): void {
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;

    // 
    // 
    // this.data.NAME = this.name
    // if(this.current == 0){
    //   this.current = 1;
    // }else if(this.current == 1){
    // this.current = 2;
    // } else if(this.current == 2){
    // this.current = 3;
    // }
    this.isSpinning = false;
    this.isOk = true;

    //   if(
    //   this.data.NAME.trim() == '' &&
    //   this.data.LOCATION.trim() == '' &&
    //   this.data.DDO_OF_THE_OFFICIAL.trim() == '' &&
    //   this.data.DESIGNATION.trim() == '' &&
    //   this.data.OFFICE_NAME.trim() == '' &&
    //   this.data.EMPLOYEE_CODE == 0 &&
    //   this.data.GRADE_PAY == 0

    // )

    //   {
    //     this.isOk=false;
    //     this.message.error("Please Fill All The Required Fields " ,"")
    //   }

    if (
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      (this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
        this.data3.CGHS_AMA_REFERENCE_DATE == null ||
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Add CGHS/AMAs Reference Date', '');
    }
    // if (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true && (this.data3.CGHS_AMA_REFERENCE_NO == undefined || this.data3.CGHS_AMA_REFERENCE_NO == null)) {
    //   this.isOk = false;
    //   this.message.error('Please Enter CGHS/AMAs Reference Number ', '');
    // }
    else if (
      this.data3.IS_PERMISSION_TAKEN_FROM_HOD == true &&
      (this.data3.HOD_PERMISSION_DATE == undefined ||
        this.data3.HOD_PERMISSION_DATE == null)
    ) {
      this.isOk = false;
      this.message.error(' Please Select HOD Permission Date', '');
    } else if (
      this.data3.EXPO_FACTO_PERMISSION == true &&
      (this.data3.EXPO_FACTO_DATE == undefined ||
        this.data3.EXPO_FACTO_DATE == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Ex-Post Facto Referance Date ', '');
    }
    if (
      this.data3.BILL_FILLED_INTIME == false &&
      (this.data3.DELAY_CONDOLENCE_DATE == undefined ||
        this.data3.DELAY_CONDOLENCE_DATE == null)
    ) {
      this.isOk = false;
      this.message.error(' Please Select Delay Condolence Date', '');
    }
    // else if (this.data3.BILL_FILLED_INTIME == false && (this.data3.DELAY_CONDOLENCE_NUMBER == undefined || this.data3.DELAY_CONDOLENCE_NUMBER == null)) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Delay Condolence Number', '');
    // }
    else if (
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      (this.data3.CGHS_AMA_REFERENCE_DATE != undefined ||
        this.data3.CGHS_AMA_REFERENCE_DATE != null ||
        this.data3.CGHS_AMA_REFERENCE_DATE.length != 0)
    ) {
      var date1: any = new Date(
        this.data3.CGHS_AMA_REFERENCE_DATE[
        this.data3.CGHS_AMA_REFERENCE_DATE.length - 1
        ]
      );
      // 
      // 
      var date2: any = new Date(this.data2.BILL_FILIING_DATE);
      // 

      var expoDiffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));


      if (expoDiffDays > 30 && this.data3.EXPO_FACTO_PERMISSION == false) {
        this.isOk = false;
        this.message.error(' Please Take Ex-Post Facto Permission ', '');
      } else {
      }
    }

    if (this.isOk) {
      this.isSpinning = true;

      // this.data3.CGHS_AMA_REFERENCE_DATE = this.datepipe.transform(
      //   this.data3.CGHS_AMA_REFERENCE_DATE,
      //   'yyyy-MM-dd'
      // );
      this.data3.DELAY_CONDOLENCE_DATE = this.datepipe.transform(
        this.data3.DELAY_CONDOLENCE_DATE,
        'yyyy-MM-dd'
      );
      this.data3.EXPOST_FACTO_PERMISSION_DATE = this.datepipe.transform(
        this.data3.EXPOST_FACTO_PERMISSION_DATE,
        'yyyy-MM-dd'
      );
      this.data3.EXPO_FACTO_DATE = this.datepipe.transform(
        this.data3.EXPO_FACTO_DATE,
        'yyyy-MM-dd'
      );
      this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(
        this.data3.HOD_PERMISSION_DATE,
        'yyyy-MM-dd'
      );
      this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(
        this.data3.HOD_PERMISSION_DATE,
        'yyyy-MM-dd'
      );
      // this.data2.TREATMENT_END_DATE = this.datepipe.transform(this.data2.TREATMENT_END_DATE, 'yyyy-MM-dd');
      // this.data2.BILL_FILIING_DATE = this.datepipe.transform(this.data2.BILL_FILIING_DATE, 'yyyy-MM-dd');
      // if (
      //   this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == false &&
      //   (this.data3.CGHS_AMA_REFERENCE_DATE != undefined ||
      //     this.data3.CGHS_AMA_REFERENCE_DATE != null ||
      //     this.data3.CGHS_AMA_REFERENCE_DATE != '' ||
      //     this.data3.CGHS_AMA_REFERENCE_DATE.trim() != '')
      // ) {
      //   this.data3.CGHS_AMA_REFERENCE_DATE = null;
      // } else {
      //   this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      // }
      // if (
      //   this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == false &&
      //   (this.data3.CGHS_AMA_REFERENCE_NO != undefined ||
      //     this.data3.CGHS_AMA_REFERENCE_NO != null ||
      //     this.data3.CGHS_AMA_REFERENCE_NO != '' ||
      //     this.data3.CGHS_AMA_REFERENCE_NO.trim() != '')
      // ) {
      //   this.data3.CGHS_AMA_REFERENCE_NO = ' ';
      // } else {
      //   this.data3.CGHS_AMA_REFERENCE_NO = this.data3.CGHS_AMA_REFERENCE_NO;
      // }

      // if (
      //   this.data3.IS_PERMISSION_TAKEN_FROM_HOD == false &&
      //   (this.data3.HOD_PERMISSION_DATE != undefined ||
      //     this.data3.HOD_PERMISSION_DATE != null)
      // ) {
      //   this.data3.HOD_PERMISSION_DATE = null;
      // } else {
      //   this.data3.HOD_PERMISSION_DATE = this.data3.HOD_PERMISSION_DATE;
      // }
      // if (
      //   this.data3.IS_PERMISSION_TAKEN_FROM_HOD == false &&
      //   (this.data3.HOD_PERMISSION_NO != undefined ||
      //     this.data3.HOD_PERMISSION_NO != null)
      // ) {
      //   this.data3.HOD_PERMISSION_NO = '';
      // } else {
      //   this.data3.HOD_PERMISSION_NO = this.data3.HOD_PERMISSION_NO;
      // }

      // if (
      //   this.data3.EXPO_FACTO_PERMISSION == false &&
      //   (this.data3.EXPO_FACTO_DATE != undefined ||
      //     this.data3.EXPO_FACTO_DATE != null)
      // ) {
      //   this.data3.EXPO_FACTO_DATE = null;
      // } else {
      //   this.data3.EXPO_FACTO_DATE = this.data3.EXPO_FACTO_DATE;
      // }
      // if (
      //   this.data3.EXPO_FACTO_PERMISSION == false &&
      //   (this.data3.EXPO_FACTO_REFERENCE_NO != undefined ||
      //     this.data3.EXPO_FACTO_REFERENCE_NO != null)
      // ) {
      //   this.data3.EXPO_FACTO_REFERENCE_NO = '';
      // } else {
      //   this.data3.EXPO_FACTO_REFERENCE_NO = this.data3.EXPO_FACTO_REFERENCE_NO;
      // }

      if (
        this.data3.BILL_FILLED_INTIME == false &&
        (this.data3.DELAY_CONDOLENCE_DATE != undefined ||
          this.data3.DELAY_CONDOLENCE_DATE != null)
      ) {
        this.data3.DELAY_CONDOLENCE_DATE = this.data3.DELAY_CONDOLENCE_DATE;
      } else {
        this.data3.DELAY_CONDOLENCE_DATE = null;
      }
      if (
        this.data3.BILL_FILLED_INTIME == false &&
        (this.data3.DELAY_CONDOLENCE_NUMBER != undefined ||
          this.data3.DELAY_CONDOLENCE_NUMBER != null)
      ) {
        this.data3.DELAY_CONDOLENCE_NUMBER = this.data3.DELAY_CONDOLENCE_NUMBER;
      } else {
        this.data3.DELAY_CONDOLENCE_NUMBER = '';
      }
      {
        if (this.data3.ID) {
          this.api.updateQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              this.api
                .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length == 0) {
                        this.isSpinning = false;
                      } else {
                        this.data3 = data['data'][0];
                        this.emergencyTaken =
                          data['data'][0]['EMERGENCY_TREATEMENT'];
                        this.drCertificate =
                          data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
                        this.empanelHospital =
                          data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
                        this.expoFacto =
                          data['data'][0]['EXPO_FACTO_PERMISSION'];
                        this.referanceTaken =
                          data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
                        this.hodPermission =
                          data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
                        if (
                          this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
                          this.data3.CGHS_AMA_REFERENCE_DATE == null ||
                          this.data3.CGHS_AMA_REFERENCE_DATE == '' ||
                          this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
                        ) {
                          this.data3.CGHS_AMA_REFERENCE_DATE = [];
                        } else {
                          this.data3.CGHS_AMA_REFERENCE_DATE =
                            this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
                        }
                        this.isSpinning = false;
                      }
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {

                  }
                );
              this.next();
              // this.claimConfirmation();
              // if (!addNew) this.drawerClose();
              // this.current = 3
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              // this.claimID = successCode.EMPLOYEE
              // 
              // this.claimConfirmation();
              this.current = 3;

              // if (!addNew) this.drawerClose();
              // else {
              this.data4 = new CheckList();
              //   this.resetDrawer(claimMasterPage);
              //   // this.data.IMG_URL= '';

              //   // this.api.getEmployeeMaster(0,0,'','desc','').subscribe (data =>{
              //   //   // if (data['count']==0){
              //   //   //   this.data.SEQUENCE_NUMBER=1;
              //   //   // }else
              //   //   // {
              //   //   //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
              //   //   // }
              //   // },err=>{
              //   //   
              //   // })
              // }
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
  checkSave(addNew: boolean, claimMasterPage: NgForm): void {
    this.data4.EMP_ID = this.empID;
    this.data4.CLAIM_ID = this.claimID;
    this.isSpinning = false;
    this.isOk = true;

    //   if(
    //   this.data.NAME.trim() == '' &&
    //   this.data.LOCATION.trim() == '' &&
    //   this.data.DDO_OF_THE_OFFICIAL.trim() == '' &&
    //   this.data.DESIGNATION.trim() == '' &&
    //   this.data.OFFICE_NAME.trim() == '' &&
    //   this.data.EMPLOYEE_CODE == 0 &&
    //   this.data.GRADE_PAY == 0

    // )
    //   {
    //     this.isOk=false;
    //     this.message.error("Please Fill All The Required Fields " ,"")
    //   }
    //   else
    if (
      this.data4.COPY_OF_CGHS_CARD == undefined ||
      this.data4.COPY_OF_CGHS_CARD == null ||
      this.data4.COPY_OF_CGHS_CARD == ''
    ) {
      this.isOk = false;
      this.message.error(
        'Please Check Copy of CGHS card for both benificiary and patient ',
        ''
      );
    } else if (
      this.data4.DISCHARGE_CARD == undefined ||
      this.data4.DISCHARGE_CARD == null ||
      this.data4.DISCHARGE_CARD == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check Discharge Card ', '');
    } else if (
      this.data4.FORM_NO_3_MEDICAL_CLAIM == undefined ||
      this.data4.FORM_NO_3_MEDICAL_CLAIM == null ||
      this.data4.FORM_NO_3_MEDICAL_CLAIM == ''
    ) {
      this.isOk = false;
      this.message.error(
        'Please Check Form No.3 in case the medical claim is of the officials family member for AMA Benificiery ',
        ''
      );
    } else if (
      this.data4.PRESCIPTION_OF_MEDICINES_PURSCHASED_OUTSIDE == undefined ||
      this.data4.PRESCIPTION_OF_MEDICINES_PURSCHASED_OUTSIDE == null ||
      this.data4.PRESCIPTION_OF_MEDICINES_PURSCHASED_OUTSIDE == ''
    ) {
      this.isOk = false;
      this.message.error(
        'Please Check Prescription of Medicines Purchased From Outside ',
        ''
      );
    } else if (
      this.data4.CHECKLIST_STATUS == 'R' &&
      (this.data4.REJECT_REMARK == undefined ||
        this.data4.REJECT_REMARK == null ||
        this.data4.REJECT_REMARK == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Reject Remark.', '');
    } else if (
      (((this.data3.EMERGENCY_TREATEMENT == true || this.emergencyTaken == 1) &&
        (this.data3.DOCTOR_EMERGENCY_CERTIFICATE_TAKEN == false ||
          this.drCertificate == 0) &&
        (this.data3.IS_HOSPITAL_EMPLANELLED == true ||
          this.empanelHospital == 1) &&
        (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)) ||
        ((this.data3.EMERGENCY_TREATEMENT == false ||
          this.emergencyTaken == 0) &&
          (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true ||
            this.referanceTaken == 1) &&
          (this.data3.IS_HOSPITAL_EMPLANELLED == false ||
            this.empanelHospital == 0) &&
          (this.data3.IS_PERMISSION_TAKEN_FROM_HOD == false ||
            this.hodPermission == 0) &&
          (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)) ||
        ((this.data3.EMERGENCY_TREATEMENT == false ||
          this.emergencyTaken == 0) &&
          (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == false ||
            this.referanceTaken == 0) &&
          (this.data3.IS_HOSPITAL_EMPLANELLED == false ||
            this.empanelHospital == 0) &&
          (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)) ||
        ((this.data3.EMERGENCY_TREATEMENT == false ||
          this.emergencyTaken == 0) &&
          (this.data3.IS_HOSPITAL_EMPLANELLED == true ||
            this.empanelHospital == 1) &&
          (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0) &&
          (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == false ||
            this.referanceTaken == 0))) &&
      this.data4.CHECKLIST_STATUS == 'A'
    ) {
      this.isOk = false;
      this.message.error(' Please Check Questionaries Again', '');
    }

    //   else if (this.data.EMPLOYEE_CODE == undefined || this.data.EMPLOYEE_CODE <= 0) {
    //     this.isOk = false;
    //     this.message.error('Please Enter Employee Code  ', '');
    //   }
    //   else if (this.data.GRADE_PAY == undefined || this.data.GRADE_PAY <= 0) {
    //     this.isOk = false;
    //     this.message.error('Please Enter Grade Pay  ', '');
    //   }
    //   else if (this.data.OFFICE_NAME == null || this.data.OFFICE_NAME.trim() == '') {
    //     this.isOk = false;
    //     this.message.error(' Please Enter Office Name.', '');
    //   }
    //   else if (this.data.DESIGNATION == null || this.data.DESIGNATION.trim() == '') {
    //     this.isOk = false;
    //     this.message.error(' Please Enter Designation', '');
    //   }

    //   else if (this.data.LOCATION == null || this.data.LOCATION.trim() == '') {
    //     this.isOk = false;
    //     this.message.error(' Please Enter Location', '');
    //   }
    //   else if (this.data.DDO_OF_THE_OFFICIAL == null || this.data.DDO_OF_THE_OFFICIAL.trim() == '') {
    //     this.isOk = false;
    //     this.message.error(' Please Enter Designation', '');
    //   }

    if (this.isOk) {
      if (this.data4.CHECKLIST_STATUS == 'A') {
        this.data4.CURRENT_STAGE_ID = 4;
      } else {
        this.data4.CURRENT_STAGE_ID = 5;
      }
      this.isSpinning = true;
      // this.data3.CGHS_AMA_REFERENCE_DATE = this.datepipe.transform(this.data3.CGHS_AMA_REFERENCE_DATE, 'yyyy-MM-dd');
      // this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(this.data3.HOD_PERMISSION_DATE, 'yyyy-MM-dd');
      // this.data3.EXPOST_FACTO_PERMISSION_DATE = this.datepipe.transform(this.data3.EXPOST_FACTO_PERMISSION_DATE, 'yyyy-MM-dd');
      // this.data3.DELAY_CONDOLENCE_DATE = this.datepipe.transform(this.data3.DELAY_CONDOLENCE_DATE, 'yyyy-MM-dd');
      // this.data2.TREATMENT_END_DATE = this.datepipe.transform(this.data2.TREATMENT_END_DATE, 'yyyy-MM-dd');
      // this.data2.BILL_FILIING_DATE = this.datepipe.transform(this.data2.BILL_FILIING_DATE, 'yyyy-MM-dd');

      {
        if (this.data4.ID) {
          this.api.updateChecklist(this.data4).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.current = 0;
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createChecklist(this.data4).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                // this.data = new ApplicantMaster();
                // this.resetDrawer(claimMasterPage);
                // this.data.IMG_URL= '';
                // this.api.getEmployeeMaster(0,0,'','desc','').subscribe (data =>{
                //   // if (data['count']==0){
                //   //   this.data.SEQUENCE_NUMBER=1;
                //   // }else
                //   // {
                //   //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                //   // }
                // },err=>{
                //   
                // })
              }
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
  pre2(): void {
    if (this.current == 2 && this.data.ID > 0) {
      this.current -= 2;
    } else {
      this.current -= 1;
    }
  }

  pre(): void {
    if (this.current == 1) {
      this.isSpinning = true;
      this.allEmployeeList();
      this.api
        .getclaimMaster(
          0,
          0,
          '',
          '',
          ' AND ID =' + this.claimID,
          null,
          null,
          '',
          ''
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.current -= 1;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];


                this.current -= 1;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {

          }
        );
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.disableReferanceDate();
      this.api
        .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.current -= 1;
                this.isSpinning = false;
              } else {
                this.data3 = data['data'][0];
                this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
                this.drCertificate =
                  data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
                this.empanelHospital =
                  data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
                this.expoFacto = data['data'][0]['EXPO_FACTO_PERMISSION'];
                this.referanceTaken =
                  data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
                this.hodPermission =
                  data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
                if (
                  this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
                  this.data3.CGHS_AMA_REFERENCE_DATE == null ||
                  this.data3.CGHS_AMA_REFERENCE_DATE == '' ||
                  this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
                ) {
                  this.data3.CGHS_AMA_REFERENCE_DATE = [];
                } else {
                  this.data3.CGHS_AMA_REFERENCE_DATE =
                    this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
                }
                this.current -= 1;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {

          }
        );
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.allHospitalList();
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              // this.billInTime()
              // this.empanelledHospital()
              this.data2 = new ClaimMaster();
              this.current -= 1;
              this.isSpinning = false;
            } else {
              this.data2 = data['data'][0];

              if (
                this.data2.TREATEMENT_TYPE == null ||
                this.data2.TREATEMENT_TYPE == '' ||
                this.data2.TREATEMENT_TYPE == undefined
              ) {
                this.TREATEMENT_TYPE1 = false;
                this.TREATEMENT_TYPE2 = false;
              }
              if (this.data2.TREATEMENT_TYPE == 'IT') {
                this.TREATEMENT_TYPE1 = false;
                this.TREATEMENT_TYPE2 = true;
              }
              if (this.data2.TREATEMENT_TYPE == 'OT') {
                this.TREATEMENT_TYPE1 = true;
                this.TREATEMENT_TYPE2 = false;
              }
              if (this.data2.TREATEMENT_TYPE == 'OT,IT') {
                this.TREATEMENT_TYPE1 = true;
                this.TREATEMENT_TYPE2 = true;
              }
              // this.billInTime()
              // this.empanelledHospital();
              this.current -= 1;
              this.isSpinning = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );

      this.isSpinning = false;
    } else {
      this.isSpinning = true;
      this.current -= 1;
      this.isSpinning = false;
    }
  }

  filterEmpData(event: any) {
    this.empLoader = true;
    if (event != null) {
      this.api.getEmployeeMaster(0, 0, '', '', ' AND ID =' + event).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.empLoader = false;
            this.data.ID = data['data'][0]['ID'];
            this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
            this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
            this.data.LOCATION = data['data'][0]['LOCATION'];
            this.data.DDO_OF_THE_OFFICIAL =
              data['data'][0]['DDO_OF_THE_OFFICIAL'];
            this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
            this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
            this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
            this.data.ADDRESS = data['data'][0]['ADDRESS'];
            this.data.CGHS_CARD_NO = '';
            this.data.CGHS_CARD_VALIDITY = '';
            this.data.BENEFICIARY_TYPE = '';
          }
        },
        (err) => {

        }
      );
    } else {
      this.empLoader = false;
      this.data.ID = null;
      this.data.OFFICE_NAME = '';
      this.data.DESIGNATION = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.GRADE_PAY = '';
      this.data.EMAIL_ID = '';
      this.data.MOBILE_NO = '';
      this.data.ADDRESS = '';
      this.data.CGHS_CARD_NO = '';
      this.data.CGHS_CARD_VALIDITY = '';
      this.data.BENEFICIARY_TYPE = '';
    }
  }

  // name
  // onChange(value: string): void {
  //   
  //   this.name == value

  //   this.filteredOptions = this.employee.filter(option => option.NAME.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  //   

  //   // var a = this.employee.filter(obj => {
  //   //   return obj.NAME == value;
  //   // })
  //   

  // }

  name = '';
  onChange(value: string): void {
    this.name = value;
    this.filteredOptions = [];
    this.filteredOptions = this.employee.filter(
      (option) => option.NAME.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

    if (value != '') {
      if (this.filteredOptions.length > 0) {
        // this.name = this.filteredOptions[0]['NAME'];
        this.data.ID = this.filteredOptions[0]['ID'];

        this.data.OFFICE_NAME = this.filteredOptions[0]['OFFICE_NAME'];
        this.data.DESIGNATION = this.filteredOptions[0]['DESIGNATION'];
        this.data.EMPLOYEE_CODE = this.filteredOptions[0]['EMPLOYEE_CODE'];
        this.data.LOCATION = this.filteredOptions[0]['LOCATION'];
        this.data.DDO_OF_THE_OFFICIAL =
          this.filteredOptions[0]['DDO_OF_THE_OFFICIAL'];
        this.data.GRADE_PAY = this.filteredOptions[0]['GRADE_PAY'];
        this.data.EMAIL_ID = this.filteredOptions[0]['EMAIL_ID'];
        this.data.MOBILE_NO = this.filteredOptions[0]['MOBILE_NO'];
        this.data.ADDRESS = this.filteredOptions[0]['ADDRESS'];
      } else {
        this.data.ID = undefined;
        this.name = value;
        this.data.OFFICE_NAME = '';
        this.data.DESIGNATION = '';
        this.data.EMPLOYEE_CODE = '';
        this.data.LOCATION = '';
        this.data.DDO_OF_THE_OFFICIAL = '';
        this.data.GRADE_PAY = '';
        this.data.EMAIL_ID = '';
        this.data.MOBILE_NO = '';
        this.data.ADDRESS = '';
      }
    } else {
      this.name = value;
      this.data.OFFICE_NAME = '';
      this.data.DESIGNATION = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.GRADE_PAY = '';
      this.data.EMAIL_ID = '';
      this.data.MOBILE_NO = '';
      this.data.ADDRESS = '';
    }
    this.data.NAME = this.name;
  }
  emergencyTaken;
  drCertificate;
  empanelHospital;
  expoFacto;
  referanceTaken;
  hodPermission;
  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              // this.billInTime()
              // this.empanelledHospital()
              this.data2 = new ClaimMaster();
              this.current = 1;
              this.isSpinning = false;
            } else {
              this.data2 = data['data'][0];

              if (
                this.data2.TREATEMENT_TYPE == null ||
                this.data2.TREATEMENT_TYPE == '' ||
                this.data2.TREATEMENT_TYPE == undefined
              ) {
                this.TREATEMENT_TYPE1 = false;
                this.TREATEMENT_TYPE2 = false;
              }
              if (this.data2.TREATEMENT_TYPE == 'IT') {
                this.TREATEMENT_TYPE1 = false;
                this.TREATEMENT_TYPE2 = true;
              }
              if (this.data2.TREATEMENT_TYPE == 'OT') {
                this.TREATEMENT_TYPE1 = true;
                this.TREATEMENT_TYPE2 = false;
              }
              if (this.data2.TREATEMENT_TYPE == 'OT,IT') {
                this.TREATEMENT_TYPE1 = true;
                this.TREATEMENT_TYPE2 = true;
              }
              // this.billInTime()
              this.empanelledHospital();
              this.current = 1;
              this.isSpinning = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );
    } else if (this.current == 1) {
      this.isSpinning = true;
      this.disableReferanceDate();
      this.api
        .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data3 = new QuestionaryMaster();
                this.billInTime();
                this.empanelledHospital();
                this.current = 2;
                this.isSpinning = false;
              } else {
                this.data3 = data['data'][0];
                this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
                this.drCertificate =
                  data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
                this.empanelHospital =
                  data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
                this.expoFacto = data['data'][0]['EXPO_FACTO_PERMISSION'];
                this.referanceTaken =
                  data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
                this.hodPermission =
                  data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
                if (
                  this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
                  this.data3.CGHS_AMA_REFERENCE_DATE == null ||
                  this.data3.CGHS_AMA_REFERENCE_DATE == '' ||
                  this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
                ) {
                  this.data3.CGHS_AMA_REFERENCE_DATE = [];
                } else {
                  this.data3.CGHS_AMA_REFERENCE_DATE =
                    this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
                }
                // this.calculateDiff();
                this.billInTime();
                this.empanelledHospital();
                this.current = 2;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {

          }
        );
    } else if ((this.current = 2)) {
      this.isSpinning = true;
      this.api
        .getAllChecklist(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data4 = new CheckList();
                // this.claimConfirmation();
                this.current = 3;
                this.isSpinning = false;
              } else {
                this.data4 = data['data'][0];
                // this.claimConfirmation();
                this.current = 3;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {

          }
        );
    } else {
    }
  }

  calculateDiff() {
    var date1: any = new Date(this.data2.TREATMENT_END_DATE);
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
  }

  hospitalAddress(event: any) {
    this.api.getAllHospital(0, 0, '', '', ' AND ID = ' + event).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.data2.HOSPITAL_ADDRESS = data['data'][0]['ADDRESS'];
        }
      },
      (err) => {

      }
    );
  }

  hospitalType(event: any) {




    if (event == 'E') {
      this.data2.HOSPITAL_ADDRESS = null;
      if (
        this.data2.HOSPITAL_NAME != undefined ||
        this.data2.HOSPITAL_NAME != null ||
        this.data2.HOSPITAL_NAME != ''
      ) {
        this.data2.HOSPITAL_NAME = '';
      } else {
        this.data2.HOSPITAL_NAME = '';
      }
    } else if (event == 'NE') {
      this.data2.HOSPITAL_ADDRESS = null;
      if (
        this.data2.HOSPITAL_ID != undefined ||
        this.data2.HOSPITAL_ID != null
      ) {
        this.data2.HOSPITAL_ID = null;
      } else {
        this.data2.HOSPITAL_ID = null;
      }
    } else {
      this.data2.HOSPITAL_ADDRESS = null;
      if (
        this.data2.HOSPITAL_ID != undefined ||
        this.data2.HOSPITAL_ID != null
      ) {
        this.data2.HOSPITAL_ID = null;
      } else {
        this.data2.HOSPITAL_ID = null;
      }
    }
  }

  billInTime() {
    var date1: any = new Date(this.data2.TREATMENT_END_DATE);
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
    // 
    // 
    // 
    var advance;
    if (this.data2.IS_ADVANCE_TAKEN == true) {
      advance = 1;

    } else {
      advance = 0;

    }
    if (advance == 1 && this.diffDays <= 30) {
      this.data3.BILL_FILLED_INTIME = true;
    } else if (advance == 1 && this.diffDays > 30) {
      this.data3.BILL_FILLED_INTIME = false;
    } else if (advance == 0 && this.diffDays > 182) {
      this.data3.BILL_FILLED_INTIME = false;
    } else {
      this.data3.BILL_FILLED_INTIME = true;
    }
  }

  empanelledHospital() {


    if (this.data2.HOSPITAL_TYPE == 'E') {
      this.data3.IS_HOSPITAL_EMPLANELLED = true;
    } else {
      this.data3.IS_HOSPITAL_EMPLANELLED = false;
    }
  }

  isAdvanceTaken(event: any) {
    if (event == false) {
      if (
        this.data2.ADVANCE_AMOUNT != null ||
        this.data2.ADVANCE_AMOUNT != undefined
      ) {
        this.data2.ADVANCE_AMOUNT = null;
      } else {
        this.data2.ADVANCE_AMOUNT = null;
      }
      if (
        this.data2.ADVANCE_TAKEN_DATE != null ||
        this.data2.ADVANCE_TAKEN_DATE != undefined
      ) {
        this.data2.ADVANCE_TAKEN_DATE = null;
      } else {
        this.data2.ADVANCE_TAKEN_DATE = null;
      }
    } else {
    }
  }
  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.data2.TREATMENT_START_DATE)
    ) < 0;

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.data2.TREATMENT_START_DATE)
    ) < 0;

  disableBillDate() {
    this.disabledDate = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data2.TREATMENT_START_DATE)
      ) < 0;
  }

  treatEndDate() {
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data2.TREATMENT_START_DATE)
      ) < 0;
  }

  referanceDateDisabledDate = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.data2.TREATMENT_START_DATE)
    ) < 0;

  disableReferanceDate() {
    this.referanceDateDisabledDate = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data2.BILL_FILIING_DATE)
      ) > 0;
  }
  // TREATEMENT_TYPE1 =false;
  // TREATEMENT_TYPE2 =false;

  onItemChecked(checked: boolean) {
    this.TREATEMENT_TYPE1 = checked;
    this.data2.TREATEMENT_TYPE = '';
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == true) {
      this.data2.TREATEMENT_TYPE = 'OT,IT';
    }
    if (this.TREATEMENT_TYPE1 == false && this.TREATEMENT_TYPE2 == true) {
      this.data2.TREATEMENT_TYPE = 'IT';
    }
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == false) {
      this.data2.TREATEMENT_TYPE = 'OT';
    }
  }

  onItemChecked2(checked: boolean) {
    this.TREATEMENT_TYPE2 = checked;
    this.data2.TREATEMENT_TYPE = '';
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == true) {
      this.data2.TREATEMENT_TYPE = 'OT,IT';
    }
    if (this.TREATEMENT_TYPE1 == false && this.TREATEMENT_TYPE2 == true) {
      this.data2.TREATEMENT_TYPE = 'IT';
    }
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == false) {
      this.data2.TREATEMENT_TYPE = 'OT';
    }
  }

  claimConfirmation() {












    if (
      ((this.data3.EMERGENCY_TREATEMENT == true || this.emergencyTaken == 1) &&
        (this.data3.DOCTOR_EMERGENCY_CERTIFICATE_TAKEN == false ||
          this.drCertificate == 0) &&
        (this.data3.IS_HOSPITAL_EMPLANELLED == true ||
          this.empanelHospital == 1) &&
        (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)) ||
      ((this.data3.EMERGENCY_TREATEMENT == false || this.emergencyTaken == 0) &&
        (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true ||
          this.referanceTaken == 1) &&
        (this.data3.IS_HOSPITAL_EMPLANELLED == false ||
          this.empanelHospital == 0) &&
        (this.data3.IS_PERMISSION_TAKEN_FROM_HOD == false ||
          this.hodPermission == 0) &&
        (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)) ||
      ((this.data3.EMERGENCY_TREATEMENT == false || this.emergencyTaken == 0) &&
        (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == false ||
          this.referanceTaken == 0) &&
        (this.data3.IS_HOSPITAL_EMPLANELLED == false ||
          this.empanelHospital == 0) &&
        (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)) ||
      ((this.data3.EMERGENCY_TREATEMENT == false || this.emergencyTaken == 0) &&
        (this.data3.IS_HOSPITAL_EMPLANELLED == true ||
          this.empanelHospital == 1) &&
        (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0) &&
        (this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == false ||
          this.referanceTaken == 0))
    ) {
      this.data4.CHECKLIST_STATUS = 'R';

    } else {
      this.data4.CHECKLIST_STATUS = 'A';

    }
  }

  relationshipFilter(event) {

    if (event == 'Self') {
      this.data2.PATIENT_CGHS_BENEFICIERY_NO = this.data.CGHS_CARD_NO;
    } else {
      this.data2.PATIENT_CGHS_BENEFICIERY_NO = '';
    }
  }
  list: any = [];
  ADD(CGHS_AMA_REFERENCE_DATE: any) {

    this.list.push(CGHS_AMA_REFERENCE_DATE);

  }

  onChangeReferance(event: any) {
    if (event == false) {
      this.data3.CGHS_AMA_REFERENCE_DATE = [];
      this.data3.CGHS_AMA_REFERENCE_NO = '';
    } else {
    }
  }

  onChangeExpoFacto(event: any) {
    if (event == false) {
      this.data3.EXPO_FACTO_DATE = null;
      this.data3.EXPO_FACTO_REFERENCE_NO = '';
    } else {
    }
  }

  onChangeHOD(event: any) {
    if (event == false) {
      this.data3.HOD_PERMISSION_DATE = null;
      this.data3.HOD_PERMISSION_NO = '';
    } else {
    }
  }
  onChangeBillIntime(event: any) {
    if (event == true) {
      this.data3.DELAY_CONDOLENCE_DATE = null;
      this.data3.DELAY_CONDOLENCE_NUMBER = '';
    } else {
      this.data3.DELAY_CONDOLENCE_DATE = this.data3.DELAY_CONDOLENCE_DATE;
      this.data3.DELAY_CONDOLENCE_NUMBER = this.data3.DELAY_CONDOLENCE_NUMBER;
    }
  }

  addDates() {
    // 
    if (
      this.CGHS_AMA_REFERENCE_DATE == undefined ||
      this.CGHS_AMA_REFERENCE_DATE == null ||
      this.CGHS_AMA_REFERENCE_DATE == ''
    ) {
      this.message.error('Please Select Date', '');
    } else {
      var date = this.datepipe.transform(
        this.CGHS_AMA_REFERENCE_DATE,
        'yyyy-MM-dd'
      );
      this.data3.CGHS_AMA_REFERENCE_DATE.push(date);
      this.CGHS_AMA_REFERENCE_DATE = null;
      // 
    }
  }
  drawerData: EmployeeMaster = new EmployeeMaster();
  drawerTitle: string = '';

  add(): void {
    this.drawerTitle = 'Create New Employee';
    this.drawerData = new EmployeeMaster();
    this.empDrawerVisible = true;
  }
  editEmp;
  edit(data: any): void {
    this.drawerTitle = 'Edit Employee Details';
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + data.EMP_ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.drawerData = data['data'][0];
        } else {
          // this.message.error("Can't Load Employee Data", '');
        }
      }),
      // this.drawerData = Object.assign({}, this.editEmp);
      (this.empDrawerVisible = true);
  }
  empDrawerClose(): void {
    this.empDrawerVisible = false;
    this.allEmployeeList();
    // window.location.reload();
  }

  get closeCallback() {
    return this.empDrawerClose.bind(this);
  }
}
