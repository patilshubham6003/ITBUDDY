import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { ApplicantMaster } from 'src/app/Medical/Models/applicantmaster';
import { CheckList } from 'src/app/Medical/Models/checkList';
import { ClaimMaster } from 'src/app/Medical/Models/claimmaster';
import { HospitalMappingMaster } from 'src/app/Medical/Models/hospitalmappingmaster';
import { QuestionaryMaster } from 'src/app/Medical/Models/questionarymaster';
import * as html2pdf from 'html2pdf.js';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { EmployeeData } from 'src/app/Medical/Models/MEmployeeData';

export class FromTOAccount {
  CLIENT_ID: number = 1;
  CLAIM_ID: number = 0;
  HOSPITAL_ID: number = 0;
  NAME: String = '';
  ADDRESS: String = '';
  ACCREDATION: String = '';
  TYPE: String = '';
}

@Component({
  selector: 'app-employeeclaimadd',
  templateUrl: './employeeclaimadd.component.html',
  styleUrls: ['./employeeclaimadd.component.css'],
  providers: [NzNotificationService],
})
export class EmployeeclaimaddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService,
    private sanitizer: DomSanitizer
  ) {}
  FROMACCOUNT: FromTOAccount = new FromTOAccount();
  namepatt = /[a-zA-Z][a-zA-Z ]+/;

  isOk = true;
  screenwidth = window.innerWidth;
  isShowCSS: boolean = false;
  userId = sessionStorage.getItem('userId');
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /[6-9]{1}[0-9]{9}/;
  ngOnInit(): void {
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
    if (this.isdraweropendedggg == true) {
      this.employeedetailsedit();
    }

    this.allHospitalList();
    if (this.ClaimApplicationFor.length == 0) {
      this.GetClaimApplicationFor();
    }
    this.ListOfDesignation();
    this.current = 0;
    this.isSpinning = false;

    if (this.data2.STEP_NO == 0) {
      this.current = 0;
      this.empSave(false);
    } else if (this.data2.STEP_NO == 1) {
      this.current = 1;
      this.claimSave(false, 'S');
    } else if (this.data2.STEP_NO == 2) {
      this.current = 2;
      this.downloadNext();
    }

    if (this.new) {
      this.data2.CLAM_UPLOAD_DATE_TIME = '';
      this.data2.CLAIM_DOWNLOAD_DATE_TIME = '';
      this.data2.CLAIM_INFO_DATE_TIME = '';
      this.data2.APP_INFO_DATE_TIME = '';
    }
  }
  drawerData: ApplicantMaster = new ApplicantMaster();
  @Input() drawerTitle: any;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: any;
  @Input() data2: ClaimMaster;

  @Input() empID: any;
  @Input() claimID: any;
  @Input() claimid: any;
  @Input() isSpinning = false;
  @Input() new: any;

  data3: QuestionaryMaster = new QuestionaryMaster();
  data5: HospitalMappingMaster = new HospitalMappingMaster();

  data4: CheckList = new CheckList();

  @Input() current = 0;
  employee: EmployeeMaster[] = [];

  Cities: EmployeeMaster[];
  filteredOptions: any = [];
  Names = EmployeeMaster;
  hospitalList: any = [];
  @Input() ClaimApplicationFor: any = [];

  diffDays: any;
  @Input() Hospitalclaim: any = [];

  TREATEMENT_TYPE1 = false;
  TREATEMENT_TYPE2 = false;
  @Input() designationList: any = [];
  @Input() employerecordfilled!: boolean;
  @Input() isdraweropendedggg: boolean = false;
  @Input() empid: any;
  ddoOfTheOfficialDataList: any = [];
  drawerVisibleEmpEdit: boolean = false;
  showload: boolean = false;
  drawerTitleEmpEdit!: string;
  drawerData12: EmployeeData = new EmployeeData();
  drawerDataEmpEdit: EmployeeData = new EmployeeData();
  drawerCloseEmpEdit(): void {
    this.employeedetailsedit();

    this.drawerVisibleEmpEdit = false;
  }
  get closeCallbackEmpEdit() {
    return this.drawerCloseEmpEdit.bind(this);
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

  GetClaimApplicationFor() {
    this.api.getAllRoles(0, 0, '', '', 'AND ID IN (22,38)').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ClaimApplicationFor = data['data'];
        } else {
          this.message.error("Can't Load Role Data", '');
        }
      },
      (err) => {}
    );
  }

  isAmountClaimed(event: any) {
    if (event != null) {
      if (event == false) {
        this.data2.OPD_TREATEMENT_AMOUNT = 0;
        this.data2.INDOOR_TREATEMENT_AMOUNT = 0;
        this.data2.TEST_OR_INVESTIGATION_AMOUNT = 0;
        this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT = 0;
      } else {
      }
    } else {
    }
  }
  allEmployeeList1() {
    this.api.getEmployeeMaster(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.employee = data['data'];
          this.filteredOptions = this.employee;
        }
      },
      (err) => {}
    );
  }

  getdata() {
    this.api.getclaimed(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['data'].length == 0) {
            this.data2 = new ClaimMaster();
            this.current = 1;
          } else {
            this.data2 = data['data'][0];

            if (this.data2.TREATEMENT_TYPE == '') {
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

            this.current = 1;
          }
        }
      },
      (err) => {}
    );
  }

  allHospitalList() {
    this.api.getAllHospital(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.hospitalList = data['data'];
        }
      },
      (err) => {}
    );
  }
  close(): void {
    this.current = 0;
    this.data2.STEP_NO = '';
    this.drawerClose();
  }

  applicantResetDrawer(applicantMasterPages: NgForm) {
    this.data = new ApplicantMaster();

    applicantMasterPages.form.reset();
  }
  claimResetDrawer(claimMasterPage: NgForm) {
    this.data2 = new ClaimMaster();

    claimMasterPage.form.reset();
  }

  checkResetDrawer(checkListMasterPage: NgForm) {
    this.data4 = new CheckList();

    checkListMasterPage.form.reset();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /////Only Number & One Dot

  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
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

                this.api.getEmployeeMaster(0, 0, '', 'desc', '').subscribe(
                  (data) => {},
                  (err) => {}
                );
              }
              this.isSpinning = false;
            } else if (successCode['code'] == '300') {
              this.message.error('Email or Mobile No already Registered,', '');
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
  empSave(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.CURRENT_STAGE_ID = 1;
    this.data.EMPLOYEE_NAME = this.data.NAME;

    if (
      this.data.NAME == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      this.data.ROLE_ID == undefined &&
      this.data.EMPLOYEE_CODE == undefined &&
      this.data.GRADE_PAY == 0 &&
      this.data.BENEFICIARY_TYPE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == null ||
      this.data.NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter/Select Employee Name', '');
    } else if (
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Designation', '');
    } else if (
      this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      this.data.DDO_OF_THE_OFFICIAL_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select DDO Of The Official', '');
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
      this.data.SERVICE_TYPE == undefined ||
      this.data.SERVICE_TYPE == null ||
      this.data.SERVICE_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please select Service Type Name', '');
    } else if (
      this.data.ROLE_ID == undefined ||
      this.data.ROLE_ID == null ||
      this.data.ROLE_ID == ''
    ) {
      this.isOk = false;
      this.message.error('   Please Select Claim Application For', '');
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
    }

    if (this.isOk) {
      this.isSpinning = true;

      if (
        this.data.OFFICE_ADDRESS == undefined ||
        this.data.OFFICE_ADDRESS == null ||
        this.data.OFFICE_ADDRESS == '' ||
        this.data.OFFICE_ADDRESS.trim() == ''
      ) {
        this.data.OFFICE_ADDRESS = null;
      } else {
        this.data.OFFICE_ADDRESS = this.data.OFFICE_ADDRESS;
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
      if (
        this.claimID == null ||
        this.claimID == undefined ||
        this.claimID == ''
      ) {
        this.data.ID = undefined;
        this.data['CLAIM_ID'] = undefined;
        this.data['EMP_ID'] = Number(sessionStorage.getItem('userId'));
      } else {
        this.data.ID = this.claimID;
        this.data['CLAIM_ID'] = this.claimID;
        this.data['EMP_ID'] = Number(sessionStorage.getItem('userId'));
      }
      this.data.APP_INFO_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      if (this.data.ID) {
        this.data['CLAIM_ID'] = this.claimID;
        this.api
          .updateClaimWithoutHospitalData(this.data)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.empID = successCode.EMPLOYEE;
              this.claimID = successCode.CLAIM;

              this.next();
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
        this.data['IS_ADMIN_CLAIM'] = 0;
        this.api.createClaimNew(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.empID = successCode.EMPLOYEE;
            this.claimID = successCode.CLAIM;

            this.next();
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

  claimSave(addNew: boolean, stage: string): void {
    this.data2.ID = this.claimID;

    for (var i = 0; this.Hospitalclaim.length > i; i++) {
      this.Hospitalclaim[i]['ID'] = undefined;
      this.Hospitalclaim[i]['CLAIM_ID'] = undefined;
    }

    this.isSpinning = true;

    setTimeout(() => {
      this.isSpinning = false;
      this.data2.hospitalData = this.Hospitalclaim;
      this.data2.INSPECTOR_ID = 0;
      this.data2.EMP_ID = sessionStorage.getItem('userId');
      this.isOk = true;
      if (
        this.data2.TEST_OR_INVESTIGATION_AMOUNT == undefined ||
        this.data2.TEST_OR_INVESTIGATION_AMOUNT == null ||
        this.data2.TEST_OR_INVESTIGATION_AMOUNT == ''
      ) {
        this.data2.TEST_OR_INVESTIGATION_AMOUNT = 0;
      } else {
        this.data2.TEST_OR_INVESTIGATION_AMOUNT =
          this.data2.TEST_OR_INVESTIGATION_AMOUNT;
      }

      if (
        this.data2.INDOOR_TREATEMENT_AMOUNT == undefined ||
        this.data2.INDOOR_TREATEMENT_AMOUNT == null ||
        this.data2.INDOOR_TREATEMENT_AMOUNT == ''
      ) {
        this.data2.INDOOR_TREATEMENT_AMOUNT = 0;
      } else {
        this.data2.INDOOR_TREATEMENT_AMOUNT =
          this.data2.INDOOR_TREATEMENT_AMOUNT;
      }

      if (
        this.data2.OPD_TREATEMENT_AMOUNT == undefined ||
        this.data2.OPD_TREATEMENT_AMOUNT == null ||
        this.data2.OPD_TREATEMENT_AMOUNT == ''
      ) {
        this.data2.OPD_TREATEMENT_AMOUNT = 0;
      } else {
        this.data2.OPD_TREATEMENT_AMOUNT = this.data2.OPD_TREATEMENT_AMOUNT;
      }

      if (
        this.data2.RELATION_WITH_PATIENT == undefined &&
        this.data2.PATIENT_NAME == undefined &&
        this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined &&
        this.data2.NATURE_OF_TREATMENT == undefined &&
        this.data2.TREATMENT_START_DATE == undefined &&
        this.data2.TREATMENT_END_DATE == undefined &&
        this.data2.BILL_FILIING_DATE == undefined &&
        this.data2.BANK_NAME == undefined &&
        this.data2.BANK_ACCOUNT_NO == undefined &&
        this.data2.IFSC_CODE == undefined &&
        this.data2.MICR_CODE == undefined
      ) {
        this.isOk = false;
        this.message.error('Please Fill All The Required Fields ', '');
      } else if (
        this.data2.RELATION_WITH_PATIENT == undefined ||
        this.data2.RELATION_WITH_PATIENT == null ||
        this.data2.RELATION_WITH_PATIENT == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Select Relation with Patient', '');
      } else if (
        this.data2.PATIENT_NAME == undefined ||
        this.data2.PATIENT_NAME == null ||
        this.data2.PATIENT_NAME == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Patient Name', '');
      } else if (
        this.data2.BENEFICIARY_TYPE == 'CG' &&
        (this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined ||
          this.data2.PATIENT_CGHS_BENEFICIERY_NO == null ||
          this.data2.PATIENT_CGHS_BENEFICIERY_NO == '')
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
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        (this.data2.CLAIMED_ADVANCE_AMOUNT === undefined ||
          this.data2.CLAIMED_ADVANCE_AMOUNT === null ||
          this.data2.CLAIMED_ADVANCE_AMOUNT === '')
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Claimed Advance Amount', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == true &&
        (this.data2.TENTATIVE_ADMISSION_DATE == undefined ||
          this.data2.TENTATIVE_ADMISSION_DATE == null ||
          this.data2.TENTATIVE_ADMISSION_DATE == '')
      ) {
        this.isOk = false;
        this.message.error(' Please Select Tentative Admission Date', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == true &&
        (this.data2.TREATEMENT_IS_RECIVED == undefined ||
          this.data2.TREATEMENT_IS_RECIVED == null ||
          this.data2.TREATEMENT_IS_RECIVED == '')
      ) {
        this.isOk = false;
        this.message.error(
          ' Please Select Whether treatement is received?',
          ''
        );
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        this.data2.IS_CERTIFICATE_FROM_OFFICER &&
        (this.data2.CGHS_AMA == '' ||
          this.data2.CGHS_AMA == null ||
          this.data2.CGHS_AMA == undefined)
      ) {
        this.isOk = false;
        this.message.error(' Please Upload CGHS/AMA Reference/Referral', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        this.data2.IS_ANTICIPATED_COST_OF_TREATMENT &&
        (this.data2.ESTIMATE == '' ||
          this.data2.ESTIMATE == null ||
          this.data2.ESTIMATE == undefined)
      ) {
        this.isOk = false;
        this.message.error(' Please Upload Hospital Estimate', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        this.data2.IS_ADVANCE_ANNEXURE_CREATED &&
        (this.data2.HOSPITAL_DISCHARGE_CARD == '' ||
          this.data2.HOSPITAL_DISCHARGE_CARD == null ||
          this.data2.HOSPITAL_DISCHARGE_CARD == undefined)
      ) {
        this.isOk = false;
        this.message.error(' Please Upload Hospital Discharge Card', '');
      } else if (
        this.data2.PAYSLIP == '' ||
        this.data2.PAYSLIP == null ||
        this.data2.PAYSLIP == undefined
      ) {
        this.isOk = false;
        this.message.error(' Please Upload Pay Slip', '');
      } else if (
        this.data2.BENEFICIARY_TYPE == 'CG' &&
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        (this.data2.CGHS_CARD == '' ||
          this.data2.CGHS_CARD == null ||
          this.data2.CGHS_CARD == undefined)
      ) {
        this.isOk = false;
        this.message.error(' Please Upload CGHS Card', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        (this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL == '' ||
          this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL == null ||
          this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL == undefined)
      ) {
        this.isOk = false;
        this.message.error(
          ' Please Upload Prescription issued by hospital Non-Empanelled/Empanelled',
          ''
        );
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE &&
        (this.data2.BANK_DETAILS_HOSPITAL == '' ||
          this.data2.BANK_DETAILS_HOSPITAL == null ||
          this.data2.BANK_DETAILS_HOSPITAL == undefined)
      ) {
        this.isOk = false;
        this.message.error(' Please Upload Bank Details of Hospital', '');
      } else if (
        this.data2.SELF_BANK_DETAILS == '' ||
        this.data2.SELF_BANK_DETAILS == null ||
        this.data2.SELF_BANK_DETAILS == undefined
      ) {
        this.isOk = false;
        this.message.error(' Please Upload Self Bank Details', '');
      } else if (
        !this.data2.IS_APPLYING_FOR_ADVANCE &&
        (this.data2.HOSPITAL_ORIGINAL_BILL == '' ||
          this.data2.HOSPITAL_ORIGINAL_BILL == null ||
          this.data2.HOSPITAL_ORIGINAL_BILL == undefined)
      ) {
        this.isOk = false;
        this.message.error(
          ' Please Upload Original Bill Issued By Hospital',
          ''
        );
      } else if (
        !this.data2.IS_APPLYING_FOR_ADVANCE &&
        (this.data2.HOSPITAL_DISCHARGE_CARD == '' ||
          this.data2.HOSPITAL_DISCHARGE_CARD == null ||
          this.data2.HOSPITAL_DISCHARGE_CARD == undefined)
      ) {
        this.isOk = false;
        this.message.error(' Please Upload Hospital Discharge Card', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == true &&
        this.data2.IS_ADVANCE_ANNEXURE_CREATED &&
        (this.data2.BILL_FILIING_DATE == undefined ||
          this.data2.BILL_FILIING_DATE == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Select Bill Filling Date', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == true &&
        this.data2.IS_ADVANCE_ANNEXURE_CREATED &&
        (this.data2.TREATMENT_START_DATE == undefined ||
          this.data2.TREATMENT_START_DATE == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Select Treatment Start Date', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == true &&
        this.data2.IS_ADVANCE_ANNEXURE_CREATED &&
        (this.data2.TREATMENT_END_DATE == undefined ||
          this.data2.TREATMENT_END_DATE == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Select Treatment End Date', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == false &&
        this.data2.IS_ADVANCE_TAKEN == false &&
        (this.data2.BILL_FILIING_DATE == undefined ||
          this.data2.BILL_FILIING_DATE == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Select Bill Filling Date', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == false &&
        this.data2.IS_ADVANCE_TAKEN == false &&
        (this.data2.TREATMENT_START_DATE == undefined ||
          this.data2.TREATMENT_START_DATE == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Select Treatment Start Date', '');
      } else if (
        this.data2.IS_APPLYING_FOR_ADVANCE == false &&
        this.data2.IS_ADVANCE_TAKEN == false &&
        (this.data2.TREATMENT_END_DATE == undefined ||
          this.data2.TREATMENT_END_DATE == null)
      ) {
        this.isOk = false;
        this.message.error(' Please Select Treatment End Date', '');
        // else if (
        //   this.data2.IS_ADVANCE_TAKEN == true &&
        //   (this.data2.ADVANCE_AMOUNT == undefined ||
        //     this.data2.ADVANCE_AMOUNT == null ||
        //     this.data2.ADVANCE_AMOUNT == '')
        // ) {
        //   this.isOk = false;
        //   this.message.error(' Please Enter Advance Amount.', '');
        // }
        // else if (
        //   this.data2.IS_ADVANCE_TAKEN == true &&
        //   (this.data2.ADVANCE_TAKEN_DATE == undefined ||
        //     this.data2.ADVANCE_TAKEN_DATE == null)
        // ) {
        //   this.isOk = false;
        //   this.message.error('Please Select Date Of Advance Taken.  ', '');
      } else if (
        this.data2.IS_ADVANCE_AMOUNT_CLAIMED &&
        (this.data2.OPD_TREATEMENT_AMOUNT === undefined ||
          this.data2.OPD_TREATEMENT_AMOUNT === null ||
          this.data2.OPD_TREATEMENT_AMOUNT === '')
      ) {
        this.isOk = false;
        this.message.error('Please Enter OPD Treatment Amount.  ', '');
      } else if (
        this.data2.IS_ADVANCE_AMOUNT_CLAIMED &&
        (this.data2.INDOOR_TREATEMENT_AMOUNT === undefined ||
          this.data2.INDOOR_TREATEMENT_AMOUNT === null ||
          this.data2.INDOOR_TREATEMENT_AMOUNT === '')
      ) {
        this.isOk = false;
        this.message.error('Please Enter Indoor Treatment Amount.  ', '');
      } else if (
        this.data2.IS_ADVANCE_AMOUNT_CLAIMED &&
        (this.data2.TEST_OR_INVESTIGATION_AMOUNT === undefined ||
          this.data2.TEST_OR_INVESTIGATION_AMOUNT === null ||
          this.data2.TEST_OR_INVESTIGATION_AMOUNT === '')
      ) {
        this.isOk = false;
        this.message.error('Please Enter Test/Investigation Amount.  ', '');
      } else if (
        this.data2.hospitalData == undefined ||
        this.data2.hospitalData.length == 0
      ) {
        this.isOk = false;
        this.message.error('Please Add Hospital Information ', '');
      } else if (
        this.data2.BANK_NAME == undefined ||
        this.data2.BANK_NAME == null ||
        this.data2.BANK_NAME == '' ||
        this.data2.BANK_NAME == ' '
      ) {
        this.isOk = false;
        this.message.error('Please Enter Name Of The Bank', '');
      } else if (
        this.data2.BANK_ACCOUNT_NO == undefined ||
        this.data2.BANK_ACCOUNT_NO == null ||
        this.data2.BANK_ACCOUNT_NO == '' ||
        this.data2.BANK_ACCOUNT_NO == ' '
      ) {
        this.isOk = false;
        this.message.error('Please Enter SB Account Number', '');
      } else if (
        this.data2.IFSC_CODE == undefined ||
        this.data2.IFSC_CODE == null ||
        this.data2.IFSC_CODE == '' ||
        this.data2.IFSC_CODE == ' '
      ) {
        this.isOk = false;
        this.message.error('Please Enter Branch IFSC Code', '');
      } else if (
        this.data2.MICR_CODE == undefined ||
        this.data2.MICR_CODE == null ||
        this.data2.MICR_CODE == '' ||
        this.data2.MICR_CODE == ' '
      ) {
        this.isOk = false;
        this.message.error('Please Enter Branch MICR Code', '');
      }

      if (this.isOk) {
        if (
          this.data2.OPD_TREATEMENT_AMOUNT == '' ||
          this.data2.OPD_TREATEMENT_AMOUNT == undefined ||
          this.data2.OPD_TREATEMENT_AMOUNT == null
        ) {
          this.data2.OPD_TREATEMENT_AMOUNT = (0).toString();
        } else {
          this.data2.OPD_TREATEMENT_AMOUNT =
            this.data2.OPD_TREATEMENT_AMOUNT.toString();
        }

        if (
          this.data2.INDOOR_TREATEMENT_AMOUNT == undefined ||
          this.data2.INDOOR_TREATEMENT_AMOUNT == null ||
          this.data2.INDOOR_TREATEMENT_AMOUNT == ''
        ) {
          this.data2.INDOOR_TREATEMENT_AMOUNT = (0).toString();
        } else {
          this.data2.INDOOR_TREATEMENT_AMOUNT =
            this.data2.INDOOR_TREATEMENT_AMOUNT.toString();
        }
        if (
          this.data2.TEST_OR_INVESTIGATION_AMOUNT == undefined ||
          this.data2.TEST_OR_INVESTIGATION_AMOUNT == null ||
          this.data2.TEST_OR_INVESTIGATION_AMOUNT == ''
        ) {
          this.data2.TEST_OR_INVESTIGATION_AMOUNT = (0).toString();
        } else {
          this.data2.TEST_OR_INVESTIGATION_AMOUNT =
            this.data2.TEST_OR_INVESTIGATION_AMOUNT.toString();
        }
        this.data2.STEP_NO = 1;
        this.data2['CLAIM_ID'] = this.claimID;
        // if (this.data2.IS_ADVANCE_AMOUNT_CLAIMED == true) {
        this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT =
          Number(this.data2.OPD_TREATEMENT_AMOUNT) +
          Number(this.data2.INDOOR_TREATEMENT_AMOUNT) +
          Number(this.data2.TEST_OR_INVESTIGATION_AMOUNT);
        this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT = Math.round(
          this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT
        );
        if (this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT == 0) {
          this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT = '0';
        } else {
          this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT =
            this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT;
        }
        // } else {
        //   this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT = 0;
        // }
        if (stage == 'V') {
          this.data2.CURRENT_STAGE_ID = 3;
          this.data2.STEP_NO = 5;
          this.data2.INSPECTOR_ID = '0';
          this.data2.SEND_FOR_VERIFICATION_DATE_TIME = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          );
        } else {
        }
        this.isSpinning = true;
        if (
          this.data2.TREATMENT_START_DATE != null &&
          this.data2.TREATMENT_START_DATE != undefined &&
          this.data2.TREATMENT_START_DATE != ''
        ) {
          this.data2.TREATMENT_START_DATE = this.datepipe.transform(
            this.data2.TREATMENT_START_DATE,
            'yyyy-MM-dd'
          );
        } else {
          this.data2.TREATMENT_START_DATE = this.data2.TREATMENT_START_DATE;
        }

        if (
          this.data2.TREATMENT_END_DATE != null &&
          this.data2.TREATMENT_END_DATE != undefined &&
          this.data2.TREATMENT_END_DATE != ''
        ) {
          this.data2.TREATMENT_END_DATE = this.datepipe.transform(
            this.data2.TREATMENT_END_DATE,
            'yyyy-MM-dd'
          );
        } else {
          this.data2.TREATMENT_END_DATE = this.data2.TREATMENT_END_DATE;
        }

        if (
          this.data2.BILL_FILIING_DATE != null &&
          this.data2.BILL_FILIING_DATE != undefined &&
          this.data2.BILL_FILIING_DATE != ''
        ) {
          this.data2.BILL_FILIING_DATE = this.datepipe.transform(
            this.data2.BILL_FILIING_DATE,
            'yyyy-MM-dd'
          );
        } else {
          this.data2.BILL_FILIING_DATE = this.data2.BILL_FILIING_DATE;
        }

        if (
          this.data2.ADVANCE_TAKEN_DATE != null &&
          this.data2.ADVANCE_TAKEN_DATE != undefined &&
          this.data2.ADVANCE_TAKEN_DATE != ''
        ) {
          this.data2.ADVANCE_TAKEN_DATE = this.datepipe.transform(
            this.data2.ADVANCE_TAKEN_DATE,
            'yyyy-MM-dd'
          );
        } else {
          this.data2.ADVANCE_TAKEN_DATE = this.data2.ADVANCE_TAKEN_DATE;
        }

        if (
          this.data2.TENTATIVE_ADMISSION_DATE != null &&
          this.data2.TENTATIVE_ADMISSION_DATE != undefined &&
          this.data2.TENTATIVE_ADMISSION_DATE != ''
        ) {
          this.data2.TENTATIVE_ADMISSION_DATE = this.datepipe.transform(
            this.data2.TENTATIVE_ADMISSION_DATE,
            'yyyy-MM-dd'
          );
        } else {
          this.data2.TENTATIVE_ADMISSION_DATE =
            this.data2.TENTATIVE_ADMISSION_DATE;
        }

        var date1: any = new Date(this.data2.TREATMENT_END_DATE);
        var date2: any = new Date(this.data2.BILL_FILIING_DATE);
        this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;

        this.data2.CLAIM_INFO_DATE_TIME = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        );

        {
          if (this.data2.ID) {
            for (var i = 0; this.data2.hospitalData.length > i; i++) {
              this.data2.hospitalData[i]['CLAIM_ID'] = this.claimid;
            }

            this.api.updateclaimed(this.data2).subscribe((successCode) => {
              if (successCode.code == '200') {
                if (!addNew) {
                  this.empID = this.data2.EMP_ID;
                  this.claimID = this.data2.ID;

                  if (stage == 'V') {
                    this.drawerClose();
                  } else {
                    this.next();
                  }
                }
              } else {
                this.Rulesandapply = false;
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
          } else {
            this.api.createclaimed(this.data2).subscribe((successCode) => {
              if (successCode.code == '200') {
                if (!addNew) {
                  this.empID = this.data2.EMP_ID;
                  this.claimID = this.data2.ID;

                  if (stage == 'V') {
                    this.Rulesandapply = false;
                    this.drawerClose();
                  } else {
                    this.next();
                  }
                }
              } else {
                this.Rulesandapply = false;
                this.message.error('Failed To Fill Information...', '');
                this.isSpinning = false;
              }
            });
          }
        }
      }
    }, 2000);
  }

  checkSave(addNew: boolean, claimMasterPage: NgForm): void {
    this.data4.EMP_ID = this.empID;
    this.data4.CLAIM_ID = this.claimID;

    this.isSpinning = false;
    this.isOk = true;

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
    }

    if (this.isOk) {
      this.isSpinning = true;

      {
        if (this.data4.ID) {
          this.api.updateChecklist(this.data4).subscribe((successCode) => {
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
          this.api.createChecklist(this.data4).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
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

  downloadNext() {
    this.isSpinning = true;
    this.data2.CLAIM_DOWNLOAD_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.data2['CLAIM_ID'] = this.data2.ID;
    for (var i = 0; this.Hospitalclaim.length > i; i++) {
      this.Hospitalclaim[i]['ID'] = undefined;
      this.Hospitalclaim[i]['CLAIM_ID'] = undefined;
    }
    this.data2.hospitalData = this.Hospitalclaim;
    this.data2.STEP_NO = 2;
    this.api.updateclaimed(this.data2).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.empID = this.data2.EMP_ID;
        this.claimID = this.data2.ID;

        this.next();
      } else {
        this.message.error('Information Has Not Changed...', '');
        this.isSpinning = false;
      }
    });
  }
  pre2(): void {
    if (this.current == 2 && this.data.ID > 0) {
      this.current -= 2;
    } else {
      this.current -= 1;
    }
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
  allEmployeeList() {
    this.api.getEmployeeMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.employee = data['data'];
          this.filteredOptions = this.employee;
        }
      },
      (err) => {}
    );
  }

  dataList: any = [];
  pre(): void {
    if (this.current == 1) {
      this.isSpinning = true;
      this.ddoOfTheOfficialList();
      this.api;
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              this.current -= 1;
              this.isSpinning = false;
            } else {
              this.data = data['data'][0];
              this.data.NAME = data['data'][0]['EMPLOYEE_NAME'];
              this.current -= 1;
              this.isSpinning = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.drawerClaimData = '';
      this.hospitallist = [];
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.drawerClaimData = data['data'][0];
            this.data2 = data['data'][0];
            this.isSpinning = false;
            this.api
              .getHospitalMapping(
                0,
                0,
                'NAME',
                'ASC',
                ' AND CLAIM_ID=' + this.claimID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.hospitallist = data['data'];
                      this.current = 2;
                      this.isSpinning = false;
                    } else {
                      this.hospitallist = [];
                      this.current = 2;
                      this.isSpinning = false;
                    }
                  } else {
                    this.isSpinning = false;
                  }
                },
                (err) => {}
              );
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.allHospitalList();
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data2 = data['data'][0];
            if (this.data2.TREATEMENT_TYPE == '') {
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
            this.hospitallist = [];
            this.api
              .getHospitalMapping(
                0,
                0,
                'NAME',
                'ASC',
                ' AND CLAIM_ID=' + this.claimID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.hospitallist = data['data'];
                      this.current = 1;
                      this.isSpinning = false;
                    } else {
                      this.hospitallist = [];
                      this.current = 1;
                      this.isSpinning = false;
                    }
                  } else {
                    this.isSpinning = false;
                  }
                },
                (err) => {}
              );
          }
        },
        (err) => {}
      );
    } else {
      this.isSpinning = true;
      this.current -= 1;
      this.isSpinning = false;
    }
  }

  filterdrama(event: any) {
    this.api.getEmployeeMaster(0, 0, '', '', ' AND ID =' + event).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
          this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
          this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];

          this.data.LOCATION = data['data'][0]['LOCATION'];
          this.data.DDO_OF_THE_OFFICIAL =
            data['data'][0]['DDO_OF_THE_OFFICIAL'];
          this.data.DDO_OF_THE_OFFICIAL_ID =
            data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
          this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
        }
      },
      (err) => {}
    );
  }

  name: any = '';
  onChange(value: string): void {
    this.name = value;
    this.filteredOptions = [];
    this.filteredOptions = this.employee.filter(
      (option) => option.NAME.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    if (value != '') {
      if (this.filteredOptions.length > 0) {
        this.data.ID = this.filteredOptions[0]['ID'];
        this.data.OFFICE_NAME = this.filteredOptions[0]['OFFICE_NAME'];
        this.data.DESIGNATION = this.filteredOptions[0]['DESIGNATION'];
        this.data.EMPLOYEE_CODE = this.filteredOptions[0]['EMPLOYEE_CODE'];

        this.data.LOCATION = this.filteredOptions[0]['LOCATION'];
        this.data.DDO_OF_THE_OFFICIAL =
          this.filteredOptions[0]['DDO_OF_THE_OFFICIAL'];
        this.data.DDO_OF_THE_OFFICIAL_ID =
          this.filteredOptions[0]['DDO_OF_THE_OFFICIAL_ID'];
        this.data.GRADE_PAY = this.filteredOptions[0]['GRADE_PAY'];
      } else {
        this.data.ID = undefined;
        this.name = value;
        this.data.OFFICE_NAME = '';
        this.data.DESIGNATION = '';
        this.data.EMPLOYEE_CODE = '';
        this.data.LOCATION = '';
        this.data.DDO_OF_THE_OFFICIAL = '';
        this.data.DDO_OF_THE_OFFICIAL_ID = null;
        this.data.GRADE_PAY = '';
      }
    } else {
      this.name = value;
      this.data.OFFICE_NAME = '';
      this.data.DESIGNATION = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = null;
      this.data.GRADE_PAY = '';
    }
    this.data.NAME = this.name;
  }
  drawerClaimData: any;
  hospitallist: any = [];
  reqAdv90: any = 0;
  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.data2.EMP_ID = this.empID;

      this.data2.EMPLOYEE_NAME = this.data.NAME;
      this.data2.EMPLOYEE_CODE = this.data.EMPLOYEE_CODE;
      this.data2.GRADE_PAY = this.data.GRADE_PAY;
      this.data2.OFFICE_NAME = this.data.OFFICE_NAME;
      this.data2.DESIGNATION = this.data.DESIGNATION;
      this.data2.LOCATION = this.data.LOCATION;
      this.data2.DDO_OF_THE_OFFICIAL = this.data.DDO_OF_THE_OFFICIAL;
      this.data2.DDO_OF_THE_OFFICIAL_ID = this.data.DDO_OF_THE_OFFICIAL_ID;
      this.data2.BENEFICIARY_TYPE = this.data.BENEFICIARY_TYPE;
      this.data2.CGHS_CARD_NO = this.data.CGHS_CARD_NO;
      this.data2.CGHS_CARD_VALIDITY = this.data.CGHS_CARD_VALIDITY;

      this.data2.MOBILE_NO = this.data.MOBILE_NO;

      this.data2.EMAIL_ID = this.data.EMAIL_ID;
      this.data2.STATUS = true;
      this.data2.ADDRESS = this.data.ADDRESS;

      if (
        this.claimID == undefined ||
        this.claimID == null ||
        this.claimID == 0
      ) {
        this.data2 = new ClaimMaster();
        this.data2.EMP_ID = this.empID;

        this.data2.EMPLOYEE_NAME = this.data.NAME;
        this.data2.EMPLOYEE_CODE = this.data.EMPLOYEE_CODE;
        this.data2.GRADE_PAY = this.data.GRADE_PAY;
        this.data2.OFFICE_NAME = this.data.OFFICE_NAME;
        this.data2.DESIGNATION = this.data.DESIGNATION;
        this.data2.LOCATION = this.data.LOCATION;
        this.data2.DDO_OF_THE_OFFICIAL = this.data.DDO_OF_THE_OFFICIAL;
        this.data2.DDO_OF_THE_OFFICIAL_ID = this.data.DDO_OF_THE_OFFICIAL_ID;
        this.data2.BENEFICIARY_TYPE = this.data.BENEFICIARY_TYPE;
        this.data2.CGHS_CARD_NO = this.data.CGHS_CARD_NO;
        this.data2.CGHS_CARD_VALIDITY = this.data.CGHS_CARD_VALIDITY;

        this.data2.MOBILE_NO = this.data.MOBILE_NO;
        this.data2.EMAIL_ID = this.data.EMAIL_ID;
        this.data2.STATUS = true;
        this.data2.ADDRESS = this.data.ADDRESS;
        this.Hospitalclaim = [];
      }
      this.isSpinning = true;
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              this.data2 = new ClaimMaster();
            } else {
              this.data2 = data['data'][0];

              if (this.data2.TREATEMENT_TYPE == '') {
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
              this.hospitallist = [];
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  'NAME',
                  'ASC',
                  ' AND CLAIM_ID=' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.hospitallist = data['data'];
                        this.message.success(
                          'Information Saved Successfully...',
                          ''
                        );
                        this.current = 1;
                        this.isSpinning = false;
                      } else {
                        this.hospitallist = [];
                        this.message.success(
                          'Information Saved Successfully...',
                          ''
                        );
                        this.current = 1;
                        this.isSpinning = false;
                      }
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );

              this.isSpinning = false;
            }
            this.data2.EMP_ID = this.empID;

            this.data2.EMPLOYEE_NAME = this.data.NAME;
            this.data2.EMPLOYEE_CODE = this.data.EMPLOYEE_CODE;
            this.data2.GRADE_PAY = this.data.GRADE_PAY;
            this.data2.OFFICE_NAME = this.data.OFFICE_NAME;
            this.data2.DESIGNATION = this.data.DESIGNATION;
            this.data2.LOCATION = this.data.LOCATION;
            this.data2.DDO_OF_THE_OFFICIAL = this.data.DDO_OF_THE_OFFICIAL;
            this.data2.DDO_OF_THE_OFFICIAL_ID =
              this.data.DDO_OF_THE_OFFICIAL_ID;
            this.data2.BENEFICIARY_TYPE = this.data.BENEFICIARY_TYPE;
            this.data2.CGHS_CARD_NO = this.data.CGHS_CARD_NO;
            this.data2.CGHS_CARD_VALIDITY = this.data.CGHS_CARD_VALIDITY;

            this.data2.MOBILE_NO = this.data.MOBILE_NO;
            this.data2.EMAIL_ID = this.data.EMAIL_ID;
            this.data2.STATUS = true;
            this.data2.ADDRESS = this.data.ADDRESS;
          }
        },
        (err) => {}
      );
    } else if (this.current == 1) {
      this.hospitallist = [];
      this.drawerClaimData = '';
      this.isSpinning = true;
      this.DataFromDDO();
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.drawerClaimData = data['data'][0];
            this.data2 = data['data'][0];
            this.reqAdv90 = 0;
            if (
              this.drawerClaimData.CLAIMED_ADVANCE_AMOUNT != null &&
              this.drawerClaimData.CLAIMED_ADVANCE_AMOUNT != undefined &&
              this.drawerClaimData.CLAIMED_ADVANCE_AMOUNT != ''
            ) {
              this.reqAdv90 = Math.round(
                (this.drawerClaimData.CLAIMED_ADVANCE_AMOUNT * 90) / 100
              );
            } else {
              this.reqAdv90 = 0;
            }
            this.hospitallist = [];
            this.api
              .getHospitalMapping(
                0,
                0,
                'NAME',
                'ASC',
                ' AND CLAIM_ID=' + this.claimID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.hospitallist = data['data'];
                      this.message.success(
                        'Information Changed Successfully...',
                        ''
                      );
                      this.current = 2;
                      this.isSpinning = false;
                    } else {
                      this.hospitallist = [];
                      this.message.success(
                        'Information Changed Successfully...',
                        ''
                      );
                      this.current = 2;
                      this.isSpinning = false;
                    }
                  } else {
                    this.isSpinning = false;
                  }
                },
                (err) => {}
              );
          }
        },
        (err) => {}
      );
    } else if ((this.current = 2)) {
      this.isSpinning = true;
      this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data2 = data['data'][0];
            this.isSpinning = false;
            this.message.success('Information Changed Successfully...', '');
            this.current = 3;
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {}
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
          this.data5.ADDRESS = data['data'][0]['ADDRESS'];
          this.data5.NAME = data['data'][0]['NAME'];
          this.data5.ACCREDATION = data['data'][0]['ACCREDITATION'];
        }
      },
      (err) => {}
    );
  }

  hospitalType(event: any) {
    if (event == 'E') {
      this.data5.ADDRESS = '';
      this.data5.ACCREDATION = '';
      this.data5.NAME = '';
      if (
        this.data5.NAME != undefined ||
        this.data5.NAME != null ||
        this.data5.NAME != ''
      ) {
        this.data5.NAME = '';
      } else {
        this.data5.NAME = '';
      }
    } else if (event == 'NE') {
      this.data5.ADDRESS = '';
      this.data5.ACCREDATION = '';
      this.data5.NAME = '';

      if (
        this.data5.HOSPITAL_ID != undefined ||
        this.data5.HOSPITAL_ID != null
      ) {
        this.data5.HOSPITAL_ID = null;
      } else {
        this.data5.HOSPITAL_ID = null;
      }
    } else {
      this.data5.ADDRESS = '';
      this.data5.ACCREDATION = '';
      this.data5.NAME = '';
      if (
        this.data5.HOSPITAL_ID != undefined ||
        this.data5.HOSPITAL_ID != null
      ) {
        this.data5.HOSPITAL_ID = null;
      } else {
        this.data5.HOSPITAL_ID = null;
      }
    }
  }

  billInTime() {
    var date1: any = new Date(this.data2.TREATMENT_END_DATE);
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;

    if (this.data2.IS_ADVANCE_TAKEN == true && this.diffDays <= 30) {
      this.data3.BILL_FILLED_INTIME = true;
    } else if (this.data2.IS_ADVANCE_TAKEN == false && this.diffDays > 182) {
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
    differenceInCalendarDays(current, new Date(this.data2.TREATMENT_END_DATE)) <
    0;

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.data2.TREATMENT_START_DATE)
    ) < 0;

  disableBillDate() {
    this.disabledDate = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data2.TREATMENT_END_DATE)
      ) < 0;
  }

  treatEndDate() {
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data2.TREATMENT_START_DATE)
      ) < 0;
  }

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

  resetDrawer(claimMasterPage: NgForm) {
    this.data = new ApplicantMaster();
    this.data2 = new ClaimMaster();

    this.current = 0;
  }

  addData(addNew: boolean, form11: NgForm) {
    this.isSpinning = false;
    this.data5['CLAIM_ID'] = this.claimID;

    this.isOk = true;

    if (this.data5.TYPE == '') {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data5.TYPE == undefined ||
      this.data5.TYPE == null ||
      this.data5.TYPE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Hospital Type', '');
    } else if (
      this.data5.TYPE == 'E' &&
      (this.data5.HOSPITAL_ID == undefined ||
        this.data5.HOSPITAL_ID == null ||
        this.data5.HOSPITAL_ID == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Hospital Name.', '');
    } else if (
      (this.data5.TYPE == 'NE' || this.data5.TYPE == 'G') &&
      (this.data5.NAME == undefined ||
        this.data5.NAME == null ||
        this.data5.NAME == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Hospital Name.  ', '');
    } else if (
      (this.data5.TYPE == 'NE' || this.data5.TYPE == 'G') &&
      (this.data5.ACCREDATION == undefined ||
        this.data5.ACCREDATION == null ||
        this.data5.ACCREDATION == '')
    ) {
      this.isOk = false;
      this.message.error('Please Select Accreditation. ', '');
    }

    if (this.isOk) {
      this.FROMACCOUNT = {
        CLIENT_ID: 1,
        CLAIM_ID: 0,
        HOSPITAL_ID: this.data5.HOSPITAL_ID,
        NAME: this.data5.NAME,
        TYPE: this.data5.TYPE,
        ACCREDATION: this.data5.ACCREDATION,
        ADDRESS: this.data5.ADDRESS,
      };
      if (this.index > -1) {
        this.Hospitalclaim[this.index] = this.FROMACCOUNT;
      } else {
        this.Hospitalclaim.push(this.FROMACCOUNT);
      }
      this.Hospitalclaim = [...[], ...this.Hospitalclaim];

      form11.form.reset();
      this.index = -1;

      {
      }
    }
  }

  getDatahospital() {
    this.api.getHospitalMapping(0, 0, '', 'asc', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.Hospitalclaim = data['data'];
      }
    });
  }
  index = -1;
  edit(data5: HospitalMappingMaster, i): void {
    this.index = i;
    this.data5 = Object.assign({}, data5);
  }
  resetDrawer1(form11: NgForm) {
    this.data5 = new HospitalMappingMaster();

    form11.form.markAsPristine();
    form11.form.markAsUntouched();
  }

  relationshipFilter(event) {
    this.isSpinning = true;
    if (event == 'Self') {
      this.data2.PATIENT_NAME = this.data.NAME;
      this.data2.PATIENT_CGHS_BENEFICIERY_NO = this.data.CGHS_CARD_NO;
      this.isSpinning = false;
    } else {
      this.data2.PATIENT_CGHS_BENEFICIERY_NO = '';
      this.data2.PATIENT_NAME = '';
      this.isSpinning = false;
    }
  }

  confirmDeleteHospital(data: any) {
    this.Hospitalclaim = this.Hospitalclaim.filter(
      (item) => item.ID != data.ID
    );
    this.Hospitalclaim = [...[], ...this.Hospitalclaim];
  }
  cancel(): void {}

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 950;
    }
  }
  printOrderModalVisible1 = false;
  printOrderModalVisible = false;
  printOrderModalCancel1() {
    this.printOrderModalVisible1 = false;
    this.checkClaimData();
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
    this.checkClaimData();
  }
  checkClaimData() {
    this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.drawerClaimData = data['data'][0];
          this.data2 = data['data'][0];
          this.api
            .getHospitalMapping(
              0,
              0,
              'NAME',
              'ASC',
              ' AND CLAIM_ID=' + this.claimID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200 && data['data'].length > 0)
                  this.hospitallist = data['data'];
              },
              (err) => {}
            );
        }
      },
      (err) => {}
    );
  }
  openpdf() {
    this.updatecallForDownload();
    const element = document.getElementById('claimFile');

    if (this.data2.IS_APPLYING_FOR_ADVANCE) {
      const opt = {
        margin: 0.2,
        filename: 'Application For Advance.pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
    } else {
      const opt = {
        margin: 0.2,
        filename: 'Claim Form.pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
    }
  }
  showmodal() {
    this.printOrderModalVisible1 = true;
    this.updatecallForDownload();
  }
  showmodal1() {}

  partaurl: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;

  uploadparta(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.partaurl = <File>event.target.files[0];

      if (this.partaurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.partaurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data2.CLAIM_FORM != undefined &&
          this.data2.CLAIM_FORM.trim() != ''
        ) {
          var arr = this.data2.CLAIM_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload('claimForm', this.partaurl, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
            }
          }
          if (res.body['code'] == 200) {
            this.data2.CLAIM_FORM = url;
            this.updatecallForUpload();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar = false;
            this.percent = 0;
            this.partaurl = null;
            this.data2.CLAIM_FORM = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.partaurl = null;
      this.data2.CLAIM_FORM = null;
    }
  }
  ViewClaimForm(pdfURL: string): void {
    this.view = 1;
    this.printOrderModalVisible = true;
  }
  updatecall() {
    this.isSpinning = true;
    this.data2['CLAIM_ID'] = this.data2.ID;
    for (var i = 0; this.hospitallist.length > i; i++) {
      this.hospitallist[i]['ID'] = undefined;
      this.hospitallist[i]['CLAIM_ID'] = undefined;
    }
    this.data2.hospitalData = this.hospitallist;
    this.api.updateclaimed(this.data2).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.message.success('File Uploaded Successfully...', '');
      } else {
        this.message.error('Information Has Not Saved...', '');

        this.isSpinning = false;
      }
    });
  }
  updatecallForDownload() {
    this.isSpinning = true;
    this.data2.CLAIM_DOWNLOAD_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.data2['CLAIM_ID'] = this.data2.ID;
    for (var i = 0; this.hospitallist.length > i; i++) {
      this.hospitallist[i]['ID'] = undefined;
      this.hospitallist[i]['CLAIM_ID'] = undefined;
    }
    this.data2.hospitalData = this.hospitallist;
    this.api.updateclaimed(this.data2).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.drawerClaimData = data['data'][0];
              this.data2 = data['data'][0];
              this.isSpinning = false;
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  'NAME',
                  'ASC',
                  ' AND CLAIM_ID=' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.hospitallist = data['data'];
                        this.isSpinning = false;
                      } else {
                        this.hospitallist = [];
                        this.isSpinning = false;
                      }
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }
  updatecallForUpload() {
    this.isSpinning = true;
    this.data2.CLAM_UPLOAD_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.data2['CLAIM_ID'] = this.data2.ID;
    for (var i = 0; this.hospitallist.length > i; i++) {
      this.hospitallist[i]['ID'] = undefined;
      this.hospitallist[i]['CLAIM_ID'] = undefined;
    }
    this.data2.hospitalData = this.hospitallist;
    this.api.updateclaimed(this.data2).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.drawerClaimData = data['data'][0];
              this.data2 = data['data'][0];
              this.isSpinning = false;
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  'NAME',
                  'ASC',
                  ' AND CLAIM_ID=' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.hospitallist = data['data'];
                        this.isSpinning = false;
                      } else {
                        this.hospitallist = [];
                        this.isSpinning = false;
                      }
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }
  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'claimForm/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
  Rulesandapply: boolean = false;
  openConfirmModel() {
    this.Rulesandapply = true;
  }
  cancelappliactionform() {
    this.Rulesandapply = false;
  }
  roleDate: any = [];
  ShowProfile() {
    this.drawerTitleEmpEdit = 'Update Employee Profile';
    this.showload = true;

    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.empid)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.drawerDataEmpEdit = Object.assign({}, data['data'][0]);
            if (
              this.drawerDataEmpEdit.DESIGNATION_ID != null &&
              this.drawerDataEmpEdit.DESIGNATION_ID != undefined &&
              this.drawerDataEmpEdit.DESIGNATION_ID != ''
            ) {
              if (
                this.drawerDataEmpEdit.DESIGNATION_ID == 6 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 7 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 8 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 9 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 11 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 14 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 15 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 16 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 38 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 41 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 49 ||
                this.drawerDataEmpEdit.DESIGNATION_ID == 72
              ) {
                this.drawerDataEmpEdit.ROLE_ID = Number(22);
              } else {
                this.drawerDataEmpEdit.ROLE_ID = Number(38);
              }
            } else {
              this.drawerDataEmpEdit.ROLE_ID = this.drawerDataEmpEdit.ROLE_ID;
            }
            this.showload = false;
            this.employerecordfilled = false;
            this.roleDate = this.ClaimApplicationFor;
            this.drawerVisibleEmpEdit = true;
          }
        },
        (err) => {}
      );
  }
  employeedetailsedit() {
    if (this.empid) {
      this.isSpinning = true;
      this.api
        .getEmployeeMaster(0, 0, '', '', 'AND ID = ' + this.empid)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data.NAME = data['data'][0]['NAME'];
              this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
              this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
              this.data.ROLE_ID = data['data'][0]['ROLE_ID'];
              this.data.DDO_OF_THE_OFFICIAL =
                data['data'][0]['DDO_OF_THE_OFFICIAL'];
              this.data.DDO_OF_THE_OFFICIAL_ID =
                data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
              this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
              this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.GRADE_PAY_LEVEL = data['data'][0]['GRADE_PAY_LEVEL'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.BENEFICIARY_TYPE = data['data'][0]['BENEFICIARY_TYPE'];
              this.data.CGHS_CARD_NO = data['data'][0]['CGHS_CARD_NO'];
              this.data.CGHS_CARD_VALIDITY =
                data['data'][0]['CGHS_CARD_VALIDITY'];

              if (
                this.data.ROLE_ID == null ||
                this.data.ROLE_ID == undefined ||
                this.data.ROLE_ID == ''
              ) {
                if (
                  this.data.DESIGNATION_ID == 6 ||
                  this.data.DESIGNATION_ID == 7 ||
                  this.data.DESIGNATION_ID == 8 ||
                  this.data.DESIGNATION_ID == 9 ||
                  this.data.DESIGNATION_ID == 11 ||
                  this.data.DESIGNATION_ID == 14 ||
                  this.data.DESIGNATION_ID == 15 ||
                  this.data.DESIGNATION_ID == 16 ||
                  this.data.DESIGNATION_ID == 38 ||
                  this.data.DESIGNATION_ID == 41 ||
                  this.data.DESIGNATION_ID == 49 ||
                  this.data.DESIGNATION_ID == 72
                ) {
                  this.data.ROLE_ID = Number(22);
                } else {
                  this.data.ROLE_ID = Number(38);
                }
              } else {
                this.data.ROLE_ID = this.data.ROLE_ID;
              }
              // if (this.employerecordfilled) {
              //   this.ShowProfile();
              //   this.message.warning(
              //     'Please Update All The Details Required',
              //     ''
              //   );
              // }
              this.isSpinning = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    }
  }

  deleteCancel(): void {}

  getAfterDelete() {
    this.isSpinning = true;
    this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.data2 = data['data'][0];
          this.isSpinning = false;
          this.message.success('File Deleted...', '');
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  partADeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('claimForm/' + data.CLAIM_FORM)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data2.CLAIM_FORM = null;
          this.data2['CLAIM_ID'] = this.data2.ID;
          for (var i = 0; this.hospitallist.length > i; i++) {
            this.hospitallist[i]['ID'] = undefined;
            this.hospitallist[i]['CLAIM_ID'] = undefined;
          }
          this.data2.hospitalData = this.hospitallist;
          this.api.updateclaimed(this.data2).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBar = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }
  gethospitaltype() {
    var showtype = '';
    if (this.hospitallist.length > 0) {
      for (let i = 0; i < this.hospitallist.length; i++) {
        if (this.hospitallist[i].TYPE == 'NE') {
          showtype = 'No';
        }
      }
      if (showtype == 'No') {
        return 'No';
      } else {
        return 'Yes';
      }
    } else {
      return '';
    }
  }

  claimFor(event) {
    if (event != null && event != undefined && event != '') {
      if (
        event == 6 ||
        event == 7 ||
        event == 8 ||
        event == 9 ||
        event == 11 ||
        event == 14 ||
        event == 15 ||
        event == 16 ||
        event == 38 ||
        event == 41 ||
        event == 49 ||
        event == 72
      ) {
        this.data.ROLE_ID = 22;
      } else {
        this.data.ROLE_ID = 38;
      }
    } else {
      this.data.ROLE_ID = null;
    }
  }

  progressBar1: boolean = false;
  percent1 = 0;
  timer1: any;
  estimatelatter: any;
  estimatelatterurl: any;

  onFileSelectedestimate(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.estimatelatter = <File>event.target.files[0];

      if (this.estimatelatter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.estimatelatter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.estimatelatterurl = url;
        if (
          this.data2.ESTIMATE != undefined &&
          this.data2.ESTIMATE.trim() != ''
        ) {
          var arr = this.data2.ESTIMATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.ESTIMATE = this.urllink3;
      this.progressBar1 = true;
      this.timer1 = this.api
        .onUpload2('estimate', this.estimatelatter, this.estimatelatterurl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Estimate Letter Uploaded Successfully...',
              ''
            );
            this.isSpinning = false;
            this.data2.ESTIMATE = this.estimatelatterurl;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar1 = false;
            this.percent1 = 0;
            this.data2.ESTIMATE = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.estimatelatter = null;
      this.data2.ESTIMATE = null;
    }
  }

  viewAssumptionPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'estimate/' + pdfURL);
  }

  clearGradepayletter(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBar1 = false;
    this.percent1 = 0;
    this.data2.ESTIMATE = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  progressBar2: boolean = false;
  percent2 = 0;
  timer2: any;
  cghsamalatter: any;
  cghsamalatterurl: any;

  onFileSelectedcghsama(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.cghsamalatter = <File>event.target.files[0];

      if (this.cghsamalatter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.cghsamalatter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.cghsamalatterurl = url;
        if (
          this.data2.CGHS_AMA != undefined &&
          this.data2.CGHS_AMA.trim() != ''
        ) {
          var arr = this.data2.CGHS_AMA.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.CGHS_AMA = this.urllink3;
      this.progressBar2 = true;
      this.timer2 = this.api
        .onUpload2('cghsAma', this.cghsamalatter, this.cghsamalatterurl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent2 = percentDone;
            if (this.percent2 == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success('CGHS/AMA Uploaded Successfully...', '');
            this.isSpinning = false;
            this.data2.CGHS_AMA = this.cghsamalatterurl;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar2 = false;
            this.percent2 = 0;
            this.data2.CGHS_AMA = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.cghsamalatter = null;
      this.data2.CGHS_AMA = null;
    }
  }

  viewcghsama(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'cghsAma/' + pdfURL);
  }

  clearcghsama(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBar2 = false;
    this.percent2 = 0;
    this.data2.CGHS_AMA = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  progressBar3: boolean = false;
  percent3 = 0;
  timer3: any;
  paysliplatter: any;
  paysliplatterurl: any;

  onFileSelectedpayslip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.paysliplatter = <File>event.target.files[0];

      if (this.paysliplatter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.paysliplatter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.cghsamalatterurl = url;
        if (
          this.data2.PAYSLIP != undefined &&
          this.data2.PAYSLIP.trim() != ''
        ) {
          var arr = this.data2.PAYSLIP.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.PAYSLIP = this.urllink3;
      this.progressBar3 = true;
      this.timer3 = this.api
        .onUpload2('paySlipMedical', this.paysliplatter, this.cghsamalatterurl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent3 = percentDone;
            if (this.percent3 == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success('Payslip Uploaded Successfully...', '');
            this.data2.PAYSLIP = this.cghsamalatterurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar3 = false;
            this.percent3 = 0;
            this.data2.PAYSLIP = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.paysliplatter = null;
      this.data2.PAYSLIP = null;
    }
  }

  viewpayslip(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'paySlipMedical/' + pdfURL);
  }

  clearpayslip(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBar3 = false;
    this.percent3 = 0;
    this.data2.PAYSLIP = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }

  progressBar4: boolean = false;
  percent4 = 0;
  timer4: any;
  cghscardlatter: any;
  cghscardlatterurl: any;

  onFileSelectedcghscard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.cghscardlatter = <File>event.target.files[0];

      if (this.cghscardlatter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.cghscardlatter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.cghscardlatterurl = url;
        if (
          this.data2.CGHS_CARD != undefined &&
          this.data2.CGHS_CARD.trim() != ''
        ) {
          var arr = this.data2.CGHS_CARD.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.CGHS_CARD = this.urllink3;
      this.progressBar4 = true;
      this.timer4 = this.api
        .onUpload2('cghsCard', this.cghscardlatter, this.cghscardlatterurl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent4 = percentDone;
            if (this.percent4 == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success('Cghs Card Uploaded Successfully...', '');
            this.data2.CGHS_CARD = this.cghscardlatterurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar4 = false;
            this.percent4 = 0;
            this.data2.CGHS_CARD = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.cghscardlatter = null;
      this.data2.CGHS_CARD = null;
    }
  }

  progressBarPrescription: boolean = false;
  percentPrescription = 0;
  prescription: any;
  prescriptionurl: any;

  onFileSelectedPrescription(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.prescription = <File>event.target.files[0];

      if (this.prescription != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.prescription.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.prescriptionurl = url;
        if (
          this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL != undefined &&
          this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL.trim() != ''
        ) {
          var arr = this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL = this.urllink3;
      this.progressBarPrescription = true;
      this.api
        .onUpload2(
          'precescriptonIssuedByHospital',
          this.prescription,
          this.prescriptionurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentPrescription = percentDone;
            if (this.percentPrescription == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Prescription issued by hospital (Non-Empanelled/Empanelled) Uploaded Successfully...',
              ''
            );
            this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL = this.prescriptionurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarPrescription = false;
            this.percentPrescription = 0;
            this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.prescription = null;
      this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL = null;
    }
  }
  progressBarFinalClaim: boolean = false;
  percentFinalClaim = 0;
  finalClaim: any;
  finalClaimurl: any;

  onFileSelectedFinalClaim(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.finalClaim = <File>event.target.files[0];

      if (this.finalClaim != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.finalClaim.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.finalClaimurl = url;
        if (
          this.data2.BANK_DETAILS_HOSPITAL != undefined &&
          this.data2.BANK_DETAILS_HOSPITAL.trim() != ''
        ) {
          var arr = this.data2.BANK_DETAILS_HOSPITAL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.BANK_DETAILS_HOSPITAL = this.urllink3;
      this.progressBarFinalClaim = true;
      this.api
        .onUpload2('bankdetailsofhospital', this.finalClaim, this.finalClaimurl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentFinalClaim = percentDone;
            if (this.percentFinalClaim == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Bank Details of Hospital Uploaded Successfully...',
              ''
            );
            this.data2.BANK_DETAILS_HOSPITAL = this.finalClaimurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarFinalClaim = false;
            this.percentPrescription = 0;
            this.data2.BANK_DETAILS_HOSPITAL = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.finalClaim = null;
      this.data2.BANK_DETAILS_HOSPITAL = null;
    }
  }
  progressBarOtherDocument: boolean = false;
  percentOtherDocument = 0;
  otherDocument: any;
  otherDocumenturl: any;

  onFileSelectedOtherDocument(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.otherDocument = <File>event.target.files[0];

      if (this.otherDocument != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.otherDocument.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.otherDocumenturl = url;
        if (
          this.data2.OTHER_DOCUMENT != undefined &&
          this.data2.OTHER_DOCUMENT.trim() != ''
        ) {
          var arr = this.data2.OTHER_DOCUMENT.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.OTHER_DOCUMENT = this.urllink3;
      this.progressBarOtherDocument = true;
      this.api
        .onUpload2('otherDocument', this.otherDocument, this.otherDocumenturl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentOtherDocument = percentDone;
            if (this.percentOtherDocument == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success('Other Document Uploaded Successfully...', '');
            this.data2.OTHER_DOCUMENT = this.otherDocumenturl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarOtherDocument = false;
            this.percentPrescription = 0;
            this.data2.OTHER_DOCUMENT = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.otherDocument = null;
      this.data2.OTHER_DOCUMENT = null;
    }
  }

  progressBarOfCertificateFromOfficer: boolean = false;
  percentOfCertificateFromOfficer = 0;
  certificateFromOfficer: any;
  certificateFromOfficerurl: any;

  onFileSelectedCertificate(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.certificateFromOfficer = <File>event.target.files[0];

      if (this.certificateFromOfficer != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.certificateFromOfficer.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.certificateFromOfficerurl = url;
        if (
          this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER != undefined &&
          this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER.trim() != ''
        ) {
          var arr = this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER = this.urllink3;
      this.progressBarOfCertificateFromOfficer = true;
      this.api
        .onUpload2(
          'certificateFromMedicalOfficer',
          this.certificateFromOfficer,
          this.certificateFromOfficerurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentOfCertificateFromOfficer = percentDone;
            if (this.percentOfCertificateFromOfficer == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Certificate from the medical officer or specialist of the recognised hospital is enclosed Uploaded Successfully...',
              ''
            );
            this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER =
              this.certificateFromOfficerurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarOfCertificateFromOfficer = false;
            this.percentOfCertificateFromOfficer = 0;
            this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.certificateFromOfficer = null;
      this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER = null;
    }
  }

  progressBarOfAnticipateCost: boolean = false;
  percentOfAnticipateCost = 0;
  certificateOfAnticipateCost: any;
  anticipateCostrurl: any;

  onFileSelectedAnticipateCost(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.certificateOfAnticipateCost = <File>event.target.files[0];

      if (this.certificateOfAnticipateCost != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.certificateOfAnticipateCost.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.anticipateCostrurl = url;
        if (
          this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE != undefined &&
          this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE.trim() != ''
        ) {
          var arr =
            this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE = this.urllink3;
      this.progressBarOfAnticipateCost = true;
      this.api
        .onUpload2(
          'treatementCertificate',
          this.certificateOfAnticipateCost,
          this.anticipateCostrurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentOfAnticipateCost = percentDone;
            if (this.percentOfAnticipateCost == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Anticipated cost of treatement as certified by the medical officer/specialist Uploaded Successfully...',
              ''
            );
            this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE =
              this.anticipateCostrurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarOfAnticipateCost = false;
            this.percentOfAnticipateCost = 0;
            this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.certificateOfAnticipateCost = null;
      this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE = null;
    }
  }

  progressBarSelfBankDetails: boolean = false;
  percentSelfBankDetails = 0;
  SelfBankDetails: any;
  SelfBankDetailsurl: any;

  onFileSelectedSelfBankDetails(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.SelfBankDetails = <File>event.target.files[0];

      if (this.SelfBankDetails != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.SelfBankDetails.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.SelfBankDetailsurl = url;
        if (
          this.data2.SELF_BANK_DETAILS != undefined &&
          this.data2.SELF_BANK_DETAILS.trim() != ''
        ) {
          var arr = this.data2.SELF_BANK_DETAILS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.SELF_BANK_DETAILS = this.urllink3;
      this.progressBarSelfBankDetails = true;
      this.api
        .onUpload2(
          'selfBankDetails',
          this.SelfBankDetails,
          this.SelfBankDetailsurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentSelfBankDetails = percentDone;
            if (this.percentSelfBankDetails == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Self Bank Details Uploaded Successfully...',
              ''
            );
            this.data2.SELF_BANK_DETAILS = this.SelfBankDetailsurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarSelfBankDetails = false;
            this.percentSelfBankDetails = 0;
            this.data2.SELF_BANK_DETAILS = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.SelfBankDetails = null;
      this.data2.SELF_BANK_DETAILS = null;
    }
  }
  progressBarOriginalHospitalBill: boolean = false;
  percentOriginalHospitalBill = 0;
  OriginalHospitalBill: any;
  OriginalHospitalBillurl: any;

  onFileSelectedOriginalHospitalBill(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.OriginalHospitalBill = <File>event.target.files[0];

      if (this.OriginalHospitalBill != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.OriginalHospitalBill.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.OriginalHospitalBillurl = url;
        if (
          this.data2.HOSPITAL_ORIGINAL_BILL != undefined &&
          this.data2.HOSPITAL_ORIGINAL_BILL.trim() != ''
        ) {
          var arr = this.data2.HOSPITAL_ORIGINAL_BILL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.HOSPITAL_ORIGINAL_BILL = this.urllink3;
      this.progressBarOriginalHospitalBill = true;
      this.api
        .onUpload2(
          'originalHospitalBill',
          this.OriginalHospitalBill,
          this.OriginalHospitalBillurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentOriginalHospitalBill = percentDone;
            if (this.percentOriginalHospitalBill == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              'Original Bill Issued By Hospital Uploaded Successfully...',
              ''
            );
            this.data2.HOSPITAL_ORIGINAL_BILL = this.OriginalHospitalBillurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarOriginalHospitalBill = false;
            this.percentOriginalHospitalBill = 0;
            this.data2.HOSPITAL_ORIGINAL_BILL = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.OriginalHospitalBill = null;
      this.data2.HOSPITAL_ORIGINAL_BILL = null;
    }
  }
  viewcghscard(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'cghsCard/' + pdfURL);
  }
  viewPrescription(pdfURL: string): void {
    window.open(
      this.api.retriveimgUrl + 'precescriptonIssuedByHospital/' + pdfURL
    );
  }
  viewFinalClaim(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'bankdetailsofhospital/' + pdfURL);
  }
  viewOtherDocument(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'otherDocument/' + pdfURL);
  }
  viewSelfBankDetails(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'selfBankDetails/' + pdfURL);
  }
  viewOriginalHospitalBill(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'originalHospitalBill/' + pdfURL);
  }

  viewHospitalDischargeCard(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'hospitalDischargeCard/' + pdfURL);
  }
  viewCertificateFromOfficer(pdfURL: string): void {
    window.open(
      this.api.retriveimgUrl + 'certificateFromMedicalOfficer/' + pdfURL
    );
  }
  viewAnticipateCost(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'treatementCertificate/' + pdfURL);
  }

  clearcghscard(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBar4 = false;
    this.percent4 = 0;
    this.data2.CGHS_CARD = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }

  progressBarHospitalDischargeCard: boolean = false;
  percentHospitalDischargeCard = 0;
  HospitalDischargeCard: any;
  HospitalDischargeCardurl: any;

  onFileSelectedHospitalDischargeCard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.HospitalDischargeCard = <File>event.target.files[0];

      if (this.HospitalDischargeCard != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.HospitalDischargeCard.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.HospitalDischargeCardurl = url;
        if (
          this.data2.HOSPITAL_DISCHARGE_CARD != undefined &&
          this.data2.HOSPITAL_DISCHARGE_CARD.trim() != ''
        ) {
          var arr = this.data2.HOSPITAL_DISCHARGE_CARD.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data2.HOSPITAL_DISCHARGE_CARD = this.urllink3;
      this.progressBarHospitalDischargeCard = true;
      this.api
        .onUpload2(
          'hospitalDischargeCard',
          this.HospitalDischargeCard,
          this.HospitalDischargeCardurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentHospitalDischargeCard = percentDone;
            if (this.percentHospitalDischargeCard == 100) {
              this.isSpinning = false;
            }
          }

          if (res.body['code'] == 200) {
            this.message.success(
              ' Hospital Discharge Card Uploaded Successfully...',
              ''
            );
            this.data2.HOSPITAL_DISCHARGE_CARD = this.HospitalDischargeCardurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarHospitalDischargeCard = false;
            this.percentHospitalDischargeCard = 0;
            this.data2.HOSPITAL_DISCHARGE_CARD = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.HospitalDischargeCard = null;
      this.data2.HOSPITAL_DISCHARGE_CARD = null;
    }
  }

  clearPrescription(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarPrescription = false;
    this.percentPrescription = 0;
    this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  clearFinalClaim(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarFinalClaim = false;
    this.percentFinalClaim = 0;
    this.data2.BANK_DETAILS_HOSPITAL = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  clearOtherDocument(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarOtherDocument = false;
    this.percentOtherDocument = 0;
    this.data2.OTHER_DOCUMENT = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  clearCertificateFromOfficer(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarOfCertificateFromOfficer = false;
    this.percentOfCertificateFromOfficer = 0;
    this.data2.CERTIFICATE_FROM_MEDICAL_OFFICER = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  clearAnticipateCost(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarOfAnticipateCost = false;
    this.percentOfAnticipateCost = 0;
    this.data2.ANTICIPATE_COST_OF_TRATEMENT_CERTIFICATE = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }

  clearSelfBankDetails(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarSelfBankDetails = false;
    this.percentSelfBankDetails = 0;
    this.data2.SELF_BANK_DETAILS = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }
  clearOriginalHospitalBill(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarOriginalHospitalBill = false;
    this.percentOriginalHospitalBill = 0;
    this.data2.HOSPITAL_ORIGINAL_BILL = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }

  clearHospitalDischargeCard(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarHospitalDischargeCard = false;
    this.percentHospitalDischargeCard = 0;
    this.data2.HOSPITAL_DISCHARGE_CARD = null;
    this.message.success('File Deleted Successfully', '');
    //     } else {
    //       this.message.error('Failed to delete File', '');
    //     }
    //   },
    //   (err) => {
    //     this.message.error('Failed to delete File', '');
    //   }
    // );
  }

  changeondvance(event: any) {
    if (event) {
      this.data2.ADVANCE_TAKEN_DATE = null;
      this.data2.ADVANCE_AMOUNT = null;
      this.data2.TREATMENT_END_DATE = null;
      this.data2.TREATMENT_START_DATE = null;
      this.data2.BILL_FILIING_DATE = null;
      this.data2.IS_ADVANCE_TAKEN = true;
    } else {
      this.data2.IS_ADVANCE_TAKEN = false;
    }
  }
  DDO_Master_Data: any = [];
  DataFromDDO() {
    if (this.data2 && this.data2.DDO_OF_THE_OFFICIAL_ID) {
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' + this.data2.DDO_OF_THE_OFFICIAL_ID
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.DDO_Master_Data = data['data'];
              } else {
                this.DDO_Master_Data = [];
              }
            } else {
            }
          },
          (err) => {}
        );
    } else {
      this.DDO_Master_Data = [];
    }
  }

  getOneMonth() {
    var date = new Date();

    // Add one month to the current date
    date.setMonth(date.getMonth() + 1);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }
}
