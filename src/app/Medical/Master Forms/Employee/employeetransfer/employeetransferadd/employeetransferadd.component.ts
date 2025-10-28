import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { TransferCheckList } from 'src/app/Medical/Models/TransferChecklist';
import { CheckList } from 'src/app/Medical/Models/checkList';
import { ClaimMaster } from 'src/app/Medical/Models/claimmaster';
import { form1 } from 'src/app/Medical/Models/form1';
import { form2 } from 'src/app/Medical/Models/form2';
import { form3 } from 'src/app/Medical/Models/form3';
import { HospitalMappingMaster } from 'src/app/Medical/Models/hospitalmappingmaster';
import { Journeydetails } from 'src/app/Medical/Models/journeydetails';
import { QuestionaryMaster } from 'src/app/Medical/Models/questionarymaster';
import { Realtionshipdata } from 'src/app/Medical/Models/relationship';
import { TranferapplicationMaster } from 'src/app/Medical/Models/transferapplication';
import { HttpEventType } from '@angular/common/http';
import { EmployeeData } from 'src/app/Medical/Models/MEmployeeData';

export class FromTOAccount {
  // ID: number;
  CLIENT_ID: number = 1;
  F;

  AGE: number = 0;

  NAME_OF_FAMILY_MEMBER: String = '';

  RELATIONSHIP: String = '';
}
@Component({
  selector: 'app-employeetransferadd',
  templateUrl: './employeetransferadd.component.html',
  styleUrls: ['./employeetransferadd.component.css'],
  providers: [NzNotificationService],
})
export class EmployeetransferaddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService,
    private sanitizer: DomSanitizer
  ) {}
  mobpattern = /[6-9]{1}[0-9]{9}/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  changeondvance(event: any) {}
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() isSpinning = false;
  @Input() relationdata: any = [];
  // @Input() Hospitalclaim: any = [];
  @Input() journey: form2;
  isOk = true;
  imgurl = this.api.retriveimgUrl;
  isShowCSS: boolean = false;
  @Input() employerecordfilled!: boolean;
  @Input() isdraweropendedggg: boolean = false;
  @Input() empid: any;
  DDO_Master_Data: any = [];

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
    this.fileNumberList();
    this.ListOfDesignation();
    this.current = 0;

    this.api.gettravelmode(0, 0, '', 'asc', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.travelmode = data['data'];
      }
    });

    this.isSpinning = false;
    this.allEmployeeList();
    this.allHospitalList();
    this.gradePayLevelList();

    if (
      !this.data.IS_TRANSFER_ADVANCE_CREATED &&
      this.data.IS_APPLYING_FOR_ADVANCE
    ) {
      if (this.data.AD_STEP_NO == 0) {
        this.current = 0;
        this.empSave(false);
      } else if (this.data.AD_STEP_NO == 1) {
        this.current = 2;
        this.next();
      } else if (this.data.AD_STEP_NO == 2) {
        this.current = 2;
        this.next();
      }
    } else {
      if (this.data.STEP_NO == 0) {
        this.current = 0;
        this.empSave(false);
      } else if (this.data.STEP_NO == 1) {
        this.current = 1;
        this.AlldataSave(false, 'S');
      } else if (this.data.STEP_NO == 2) {
        this.current = 2;
        this.uploadDoc(false);
      } else if (this.data.STEP_NO == 3) {
        this.current = 2;
        // this.partA();
        this.next();
      }
    }
    this.DataFromDDO();

    if (this.data.IS_APPLYING_FOR_ADVANCE) {
      if (
        this.data.GRADE_PAY != 0 &&
        this.data.GRADE_PAY != undefined &&
        this.data.GRADE_PAY != null
      ) {
        if (
          this.data.GRANT_ONE_BASIC_PAY_AMOUNT == 0 ||
          this.data.GRANT_ONE_BASIC_PAY_AMOUNT == undefined ||
          this.data.GRANT_ONE_BASIC_PAY_AMOUNT == null
        ) {
          this.data.GRANT_ONE_BASIC_PAY_AMOUNT =
            (Number(this.data.GRADE_PAY) * 80) / 100;
        }
      }
    }

    // else if (this.data.STEP_NO == 4) {
    //   this.current = 5;
    //   this.nextForSteps();
    // }
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
  gradePayLevel: any = [];
  gradePayLevelList() {
    this.isSpinning = true;
    this.api
      .getAllGradePayLevel(0, 0, 'ID', 'ASC', ' AND STATUS = 1')
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.gradePayLevel = data['data'];
            } else {
              this.gradePayLevel = [];
            }
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  @Input() designationList: any = [];

  ListOfDesignation() {
    this.api
      .getAllDesignations(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.designationList = data['data'];
          } else {
            this.message.error("Can't Load Designation Data", '');
          }
        },
        (err) => {}
      );
  }
  @Input()
  drawerVisible: boolean = false;
  empDrawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: TranferapplicationMaster;
  @Input() editrelation: Realtionshipdata;

  @Input() empID: any;
  @Input() claimID: any;
  @Input() currentStageID: any;
  // @Input() data2: ClaimMaster;
  //  data2: ClaimMaster;
  // @Input() data3: QuestionaryMaster;
  data2: ClaimMaster = new ClaimMaster();
  // editrelation: Realtionshipdata = new Realtionshipdata();
  data3: QuestionaryMaster = new QuestionaryMaster();
  checkData: TransferCheckList = new TransferCheckList();
  hospitalData: HospitalMappingMaster = new HospitalMappingMaster();
  // @Input() data4: CheckList;
  //  data4: CheckList;
  data4: CheckList = new CheckList();
  @Input() drawerTitle11: any;

  @Input() current = 0;
  employee: EmployeeMaster[] = [];

  Cities: EmployeeMaster[];
  filteredOptions: any = [];
  Names = EmployeeMaster;
  hospitalList: any = [];
  diffDays: any;
  date1: any;
  date2: any;
  expoDiffDays: any;
  TREATEMENT_TYPE1 = false;
  TREATEMENT_TYPE2 = false;
  CGHS_AMA_REFERENCE_DATE: any = new Date();
  CGHS_AMA_REFERENCE_END_DATE: any = new Date();
  empLoader: boolean = false;
  orderdata1: any = [];
  // travelmode = new Travelmode();
  travelmode: any = [];
  drawerTitleform1!: string;
  drawerVisible2form1: boolean = false;
  drawerData2form1: form1 = new form1();
  addform1(): void {
    this.drawerTitleform1 = 'Add Journey Details';
    this.drawerData2form1 = new form1();
    this.drawerVisible2form1 = true;
  }

  drawerClose2form1(): void {
    this.getDataform1();
    this.drawerVisible2form1 = false;
  }

  get closeCallbackform1form1() {
    return this.drawerClose2form1.bind(this);
  }

  drawerTitleform2!: string;
  drawerVisibleform2: boolean = false;
  drawerDataform2: form2 = new form2();
  addform2(): void {
    this.drawerTitleform2 = 'Add New Higher Class of Accommodation';
    this.drawerDataform2 = new form2();
    this.drawerVisibleform2 = true;
  }

  drawerCloseform2(): void {
    this.getDataform2();
    this.drawerVisibleform2 = false;
  }

  get closeCallbackform2() {
    return this.drawerCloseform2.bind(this);
  }

  editform2(data: form2): void {
    this.drawerTitleform2 = 'Edit Higher Class of Accommodation Details';
    this.drawerDataform2 = Object.assign({}, data);
    this.api
      .gettravelclass(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND MODE_ID = ' + data.TRAVEL_MODE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classdata = data['data'];
          }
        },
        (err) => {}
      );
    this.drawerVisibleform2 = true;
  }

  drawerTitleform3!: string;
  drawerVisibleform3: boolean = false;
  drawerDataform3: form3 = new form3();

  addform3(): void {
    this.drawerTitleform3 = 'Add Transportion Charges';
    this.drawerDataform3 = new form3();
    this.drawerVisibleform3 = true;
  }

  drawerCloseform3(): void {
    this.getDataform3();
    this.drawerVisibleform3 = false;
  }

  get closeCallbackform3() {
    return this.drawerCloseform3.bind(this);
  }

  drawerTitledetailsjorney: string = '';
  detailsjorneyDrawerVisible: boolean = false;
  detailsJorneyDrawerData: Journeydetails = new Journeydetails();

  adddetailsjorney(): void {
    this.empID = this.empID;
    this.claimID = this.claimID;
    this.drawerTitledetailsjorney = 'Add Details of Journeys(s)';
    this.detailsJorneyDrawerData = new Journeydetails();
    this.detailsjorneyDrawerVisible = true;
  }

  detailsjorneyDrawerClose(): void {
    this.detailsJorneyGetData();
    this.detailsjorneyDrawerVisible = false;
  }

  get closeCallbackdetailsjorney() {
    return this.detailsjorneyDrawerClose.bind(this);
  }

  formdata3: any = [];
  formdata2: any = [];
  formdata1: any = [];
  formdata7: any = [];
  getDataform3() {
    this.isSpinning = true;
    this.api
      .gettransfarchnagedetailspersonal(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.claimID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.formdata3 = data['data'];
        } else {
          this.isSpinning = false;
        }
      });
  }

  getDataform2() {
    this.isSpinning = true;
    this.api
      .gettransfortation(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.claimID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.formdata2 = data['data'];
        } else {
          this.isSpinning = false;
        }
      });
  }

  // SHOW_TABLE: boolean = false;
  // showtable(event: { SHOW_TABLE: boolean; }) {
  //   event.IS_HIGHER_CLASS_ACCOMODATION = !event.SHOW_TABLE;
  // }

  getDataform1() {
    this.isSpinning = true;
    this.api
      .gettransfarchnagedetails1(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.claimID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.formdata1 = data['data'];
        } else {
          this.isSpinning = false;
        }
      });
  }

  detailsJorneyGetData() {
    this.isSpinning = true;
    this.api
      .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.claimID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.formdata7 = data['data'];
        } else {
          this.isSpinning = false;
        }
      });
  }

  getrelationtable() {
    this.isSpinning = true;
    this.api
      .getrelationtable(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.claimID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.relationdata = data['data'];
        } else {
          this.isSpinning = false;
        }
      });
  }
  getTimeIn12Hour(time: any) {
    return this.datepipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }
  checkboxdatais: boolean = false;
  chechboxdata(event: any) {
    this.data.CERTIFIED_INFORMATION = event;
  }

  showtable1(event: any) {
    this.data.IS_HIGHER_CLASS_ACCOMODATION = event;

    // if (event == false) {
    //   if (this.formdata2.length > 1) {
    //     for (var i = 0; this.formdata2.length > 1; i++) {
    //       this.formdata2[i].IS_DELETED = 1;
    //     }

    //     this.api
    //       .updatetransfortation(this.formdata2)
    //       .subscribe((successCode) => {
    //         if (successCode.code == '200') {
    //         } else {
    //           this.message.error('Information Has Not Changed...', '');
    //           this.isSpinning = false;
    //         }
    //       });
    //   }
    // }
  }

  editform3(data: form3): void {
    this.drawerTitleform3 = 'Edit Transportion Charges';
    this.drawerDataform3 = Object.assign({}, data);
    this.drawerVisibleform3 = true;
  }

  classdata: any;
  editform7(data: Journeydetails): void {
    this.drawerTitledetailsjorney = 'Edit Details of Journeys(s)';
    this.detailsJorneyDrawerData = Object.assign({}, data);
    this.api
      .gettravelclass(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND MODE_ID=' + data.TRAVEL_MODE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classdata = data['data'];
          }
        },
        (err) => {}
      );
    this.detailsjorneyDrawerVisible = true;
  }

  editform1(data: form1): void {
    this.drawerTitleform1 = 'Edit Journey Details';
    this.drawerData2form1 = Object.assign({}, data);
    this.drawerVisible2form1 = true;
  }

  allEmployeeList() {
    this.empLoader = true;

    this.api.getEmployeeMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.employee = data['data'];
          this.filteredOptions = this.employee;
          this.empLoader = false;
        } else {
          this.message.error("Can't Load Employee Data", '');
          this.empLoader = false;
        }
      },
      (err) => {}
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
              this.data.DDO_OF_THE_OFFICIAL_ID =
                data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
              this.data.ADDRESS = data['data'][0]['ADDRESS'];
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
          },
          (err) => {}
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
      (err) => {}
    );
  }
  close(): void {
    this.current = 0;
    this.drawerClose();
  }

  applicantResetDrawer(applicantMasterPages: NgForm) {
    this.data = new TranferapplicationMaster();
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

  //// Only number and dot
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  dateOmit(event: any) {
    return false;
  }

  STATION_NAME: string = '';
  TOTAL_AMOUNT: any;
  ADVANCE_TAKEN_DATE: any;
  ADVANCED_AMOUNT: any;
  AMOUNT: any;
  AlldataSave(addNew: boolean, stage: string) {
    this.data.STEP_NO = 1;
    this.isOk = true;
    this.isSpinning = false;

    if (this.data.IS_HIGHER_CLASS_ACCOMODATION == false) {
      // if (this.formdata2.length > 1) {
      //   for (var i = 0; this.formdata2.length > 1; i++) {
      //     this.formdata2[i].IS_DELETED = 1;
      //   }
      // var TRANSFER_ID
      this.api.delettrasferrecord(this.data.ID).subscribe((successCode) => {
        if (successCode.code == '200') {
        } else {
          this.message.error('Information Has Not Changed...', '');
          this.isSpinning = false;
        }
      });
      // }
    }
    // if (
    //   this.formdata7 == 0 &&
    //   this.formdata3 == 0 &&
    //   this.formdata1 == 0 &&
    //   this.data.TRAVEL_MODE_ID == 0 &&
    //   this.data.STATION_NAME.trim() == '' &&
    //   this.data.AMOUNT == 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Fill All The Required Fields ', '');
    // } else if (this.formdata7 == null || this.formdata7 <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Details of Journeys(s)', '');
    // } else if (this.formdata3 == null || this.formdata3 <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Transportion Charges of personal effects', '');
    // } else if (this.formdata1 == null || this.formdata1 <= 0) {
    //   this.isOk = false;
    //   this.message.error(
    //     'Details Journey(s) performed by road between place connected by Rail',
    //     ''
    //   );
    // } else if (
    //   this.data.TRAVEL_MODE_ID == null ||
    //   this.data.TRAVEL_MODE_ID <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Travel Mode', '');
    // } else if (
    //   this.data.STATION_NAME == null ||
    //   this.data.STATION_NAME.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Station Name', '');
    // } else if (this.data.AMOUNT == null || this.data.AMOUNT <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Amout', '');
    // } else
    if (
      this.data.IS_ADVANCE_TAKEN == true &&
      (this.data.ADVANCED_AMOUNT == undefined ||
        this.data.ADVANCED_AMOUNT == null ||
        this.data.ADVANCED_AMOUNT == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Advance Amount.', '');
    } else if (
      this.data.IS_ADVANCE_TAKEN == true &&
      (this.data.ADVANCE_TAKEN_DATE == undefined ||
        this.data.ADVANCE_TAKEN_DATE == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Date Of Advance Taken.  ', '');
    }

    if (this.data.ADVANCE_TAKEN_DATE == undefined) {
      this.data.ADVANCE_TAKEN_DATE = null;
    } else {
      this.data.ADVANCE_TAKEN_DATE = this.datepipe.transform(
        this.data.ADVANCE_TAKEN_DATE,
        'yyyy-MM-dd'
      );
    }
    this.data.TRANSFER_DETAILS_SUBMITTED_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    // this.data.STATION_NAME = this.STATION_NAME;
    // this.data.CERTIFIED_INFORMATION = this.checkboxdatais;
    // this.data.TOTAL_AMOUNT = this.TOTAL_AMOUNT;
    // this.data.AMOUNT = this.AMOUNT;
    // this.data.ADVANCE_TAKEN_DATE = this.ADVANCE_TAKEN_DATE;
    // this.data.ADVANCED_AMOUNT = this.ADVANCED_AMOUNT;
    this.data.ID = this.claimID;
    if (this.isOk && this.data.ID != undefined) {
      if (this.data.IS_ADVANCE_TAKEN == false) {
        this.data.ADVANCE_TAKEN_DATE = null;
        this.data.ADVANCED_AMOUNT = 0;
      }
      // if (stage == 'V') {
      //   this.data.CURRENT_STAGE_ID = 3;
      // }
      // this.data.CURRENT_STAGE_ID = null;
      this.data.TRANSFER_ID = undefined;
      this.api.updatetransfer(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          // this.drawerClose();
          this.next();
          // this.resetDrawer(modedataform);
          // this.message.success('Information Saved Successfully...', '');
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    }
  }

  FILE_NO: any;
  // AlldataSave1(addNew: boolean, modedataform: NgForm, stage: string) {
  //   this.isOk = true;
  //   this.isSpinning = false;

  //   // this.data.FILE_NO = this.FILE_NO;
  //   this.data.ID = this.claimID;
  //   this.data.CURRENT_STAGE_ID = 4;
  //   if (this.isOk && this.data.ID != undefined) {
  //     this.data.TRANSFER_ID = undefined;
  //     this.api.updatetransfer(this.data).subscribe((successCode) => {
  //       if (successCode.code == '200') {
  //         this.current = 0;
  //         this.drawerClose();
  //         // this.next();
  //         this.resetDrawer(modedataform);
  //         this.message.success('Information Saved Successfully...', '');
  //       } else {
  //         this.message.error('Information Has Not Saved...', '');
  //         this.isSpinning = false;
  //       }
  //     });
  //   }
  // }

  savepdf1(addNew: boolean, modedataform: NgForm, stage: string) {
    // this.data.FILE_NO = this.FILE_NO;

    // if (this.data.FILE_URL.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Fill All Required Fields.', '');
    // } else if (this.data.FILE_URL == null || this.data.FILE_URL.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Select Pdf File', '');
    // }
    if (this.isOk && this.data.ID != undefined) {
      this.isSpinning = true;

      if (this.fileURL1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.FILE_URL != undefined &&
          this.data.FILE_URL.trim() != ''
        ) {
          var arr = this.data.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
        this.api
          .onUpload('transferFile', this.fileURL1, url)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.data.FILE_URL = url;
              // appkeys.retriveimgUrl + 'DownloadsFile/' + url;

              if (this.data.ID) {
                this.data.TRANSFER_ID = undefined;
                this.api.updatetransfer(this.data).subscribe((successCode) => {
                  this.isSpinning = false;
                  if (successCode.code == '200') {
                    this.current = 0;
                    this.drawerClose();
                    // this.next();
                    this.resetDrawer(modedataform);
                    this.message.success(
                      'Information Saved Successfully...',
                      ''
                    );
                  } else {
                    this.message.error('Information Has Not Saved...', '');
                  }
                });
              } else {
              }
            } else {
              this.message.error('Failed To Save PDF File...', '');
              this.isSpinning = false;
            }
          });
      } else if (this.data.FILE_URL == null || this.data.FILE_URL == '') {
        this.message.error('Please Select File', '');
        this.isSpinning = false;
      } else {
        if (this.data.ID) {
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            this.isSpinning = false;
            if (successCode.code == '200') {
              this.current = 0;
              this.drawerClose();
              // this.next();
              this.resetDrawer(modedataform);
              this.message.success('Information Saved Successfully...', '');
            } else {
              this.message.error('Information Has Not Saved...', '');
            }
          });
        } else {
        }
      }
    }
  }

  grantamount(event: any) {
    if (event != undefined || event != null || event != '') {
      if (event <= 100) {
        // this.data.TRANSFER_GRANT = null;
        this.data.TRANSFER_GRANT_AMOUNT = (this.data.GRADE_PAY * event) / 100;
        // this.data.TRANSFER_GRANT_AMOUNT = gamount;
        // this.data.TRANSFER_GRANT = '80% of ' + event;
      } else {
        this.message.error("Can't Type More Than 100%", '');
        this.data.TRANSFER_GRANT = 0;
        this.data.TRANSFER_GRANT_AMOUNT = 0;
        // event = 100;
      }
    } else {
      this.data.TRANSFER_GRANT_AMOUNT = 0;
    }
  }
  grantamount1(event: any) {
    this.data.TRANSFER_GRANT = null;
    var gamount = (event * 80) / 100;
    this.data.TRANSFER_GRANT_AMOUNT = gamount;
    this.data.TRANSFER_GRANT = '80% of ' + event;
  }
  saveFileDetails(addNew: boolean) {
    this.data.STEP_NO = 2;
    // this.data.FILE_NO = this.FILE_NO;

    // if (this.data.FILE_URL.trim() == '') {
    this.isOk = true;
    //   this.message.error('Please Fill All Required Fields.', '');
    // } else if (this.data.FILE_URL == null || this.data.FILE_URL.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Select Pdf File', '');
    // }
    if (this.isOk && this.data.ID != undefined) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.data.TRANSFER_ID = undefined;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          this.isSpinning = false;
          if (successCode.code == '200') {
            // this.drawerClose();
            this.next();
            // this.resetDrawer(modedataform);
            this.message.success('Information Saved Successfully...', '');
          } else {
            this.message.error('Information Has Not Saved...', '');
          }
        });
      } else {
      }
      ///////////////////////////
      // if (this.fileURL1 != null) {
      //   var number = Math.floor(100000 + Math.random() * 900000);
      //   var fileExt = this.fileURL1.name.split('.').pop();
      //   var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
      //   var url = '';
      //   url = d == null ? '' : d + number + '.' + fileExt;
      //   if (
      //     this.data.FILE_URL != undefined &&
      //     this.data.FILE_URL.trim() != ''
      //   ) {
      //     var arr = this.data.FILE_URL.split('/');
      //     if (arr.length > 1) {
      //       url = arr[5];
      //     }
      //   }
      //   this.api
      //     .onUpload('transferFile', this.fileURL1, url)
      //     .subscribe((successCode) => {
      //       if (successCode.code == '200') {
      //         this.data.FILE_URL = url;
      //         // appkeys.retriveimgUrl + 'DownloadsFile/' + url;
      //

      //         if (this.data.ID) {
      //           this.data.TRANSFER_ID = undefined;
      //           this.api.updatetransfer(this.data).subscribe((successCode) => {
      //             this.isSpinning = false;
      //             if (successCode.code == '200') {
      //               this.current = 0;
      //               this.drawerClose();
      //               // this.next();
      //               this.resetDrawer(modedataform);
      //               this.message.success(
      //                 'Information Saved Successfully...',
      //                 ''
      //               );
      //             } else {
      //               this.message.error('Information Has Not Saved...', '');
      //             }
      //           });
      //         } else {
      //         }
      //       } else {
      //         this.message.error('Failed To Save PDF File...', '');
      //         this.isSpinning = false;
      //       }
      //     });
      // } else if (this.data.FILE_URL == null || this.data.FILE_URL == '') {
      //   this.message.error('Please Select File', '');
      //   this.isSpinning = false;
      // } else {
      //   if (this.data.ID) {
      //     this.api.updatetransfer(this.data).subscribe((successCode) => {
      //       this.isSpinning = false;
      //       if (successCode.code == '200') {
      //         this.current = 0;
      //         this.drawerClose();
      //         // this.next();
      //         this.resetDrawer(modedataform);
      //         this.message.success('Information Saved Successfully...', '');
      //
      //       } else {
      //         this.message.error('Information Has Not Saved...', '');
      //
      //       }
      //     });
      //   } else {
      //   }
      // }
    }
  }

  empAllDataForUpdate: any;
  empSave(addNew: boolean): void {
    if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_TRANSFER_ADVANCE_CREATED
    ) {
      this.data.AD_STEP_NO = 0;
      this.data.STEP_NO = 0;
    } else {
      this.data.STEP_NO = 0;
    }
    if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      this.data.IS_TRANSFER_ADVANCE_CREATED
    ) {
      this.data.INSPECTOR_ID = this.data.INSPECTOR_ID;
    } else {
      this.data.INSPECTOR_ID = 0;
    }
    this.data.ORDER_FORM_REMARK = this.data.ORDER_FORM_REMARK;
    this.data.ORDER_FORM_REMARK_2 = this.data.ORDER_FORM_REMARK_2;
    this.isSpinning = false;

    this.data.EMP_ID = Number(sessionStorage.getItem('userId'));
    this.isOk = true;
    this.data.memberTransferData = this.relationdata;

    if (
      this.data.NAME == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      this.data.EMPLOYEE_CODE == undefined &&
      this.data.DDO_OF_THE_OFFICIAL == undefined &&
      this.data.DDO_OF_THE_OFFICIAL_ID == null &&
      this.data.GRADE_PAY == 0 &&
      this.data.EMAIL_ID == null &&
      this.data.MOBILE_NO == undefined &&
      this.data.GRADE_PAY_LEVEL_ID == undefined &&
      this.data.SERVICE_TYPE == undefined
      // &&
      // this.data.HEADQUARTERS_NAME == undefined &&
      // this.data.ADDRESS == undefined &&
      // this.data.NEW_HEADQUARTERS_NAME == undefined &&
      // this.data.NEW_ADDRESS == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == null ||
      this.data.NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Employee Name', '');
    } else if (
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Designation', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Employee Code', '');
    } else if (
      this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      this.data.DDO_OF_THE_OFFICIAL_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select DDO Of The Official', '');
    } else if (
      this.data.GRADE_PAY == undefined ||
      this.data.GRADE_PAY == null ||
      this.data.GRADE_PAY == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Grade Pay', '');
    } else if (
      this.data.EMP_ID == undefined ||
      this.data.EMP_ID == null ||
      this.data.EMP_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email ID', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null ||
      this.data.MOBILE_NO == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Grade Pay', '');
    } else if (
      this.data.GRADE_PAY_LEVEL_ID == undefined ||
      this.data.GRADE_PAY_LEVEL_ID == null ||
      this.data.GRADE_PAY_LEVEL_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Grade Pay Level', '');
    } else if (
      this.data.SERVICE_TYPE == undefined ||
      this.data.SERVICE_TYPE == null ||
      this.data.SERVICE_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Service Type Name', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.DOJ_PRESENT_STATION == undefined ||
        this.data.DOJ_PRESENT_STATION == null ||
        this.data.DOJ_PRESENT_STATION == '')
    ) {
      this.isOk = false;
      this.message.error('Please Select DOJ of Present Station', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.DOJ_PRESENT_POST == undefined ||
        this.data.DOJ_PRESENT_POST == null ||
        this.data.DOJ_PRESENT_POST == '')
    ) {
      this.isOk = false;
      this.message.error('Please Select DOJ of Present Post', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.DETAILS_OF_TRANSFER_POSTING_ORDER == undefined ||
        this.data.DETAILS_OF_TRANSFER_POSTING_ORDER == null ||
        this.data.DETAILS_OF_TRANSFER_POSTING_ORDER == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Details of Transfer/Posting Order', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.PLACE_OFFICE_OF_POSTING == undefined ||
        this.data.PLACE_OFFICE_OF_POSTING == null ||
        this.data.PLACE_OFFICE_OF_POSTING == '')
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Place Office of Posting on Transfer',
        ''
      );
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.RESIDANCE_IS_INVOLVED == undefined ||
        this.data.RESIDANCE_IS_INVOLVED == null ||
        this.data.RESIDANCE_IS_INVOLVED == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter New Residence Address', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.TRA_ALLO_FARE_RS == undefined ||
        this.data.TRA_ALLO_FARE_RS == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Travelling Allowance Fare', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT == undefined ||
        this.data.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT == null)
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Transportation charges for Personal Effects',
        ''
      );
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.CHARGES_FOR_PRIVATE_CON_AMOUNT == undefined ||
        this.data.CHARGES_FOR_PRIVATE_CON_AMOUNT == null)
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Transportation charges for Private Conveyance',
        ''
      );
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.TRAVEL_DA_DAYS == undefined ||
        this.data.TRAVEL_DA_DAYS == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Travel DA (Days)', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.TRAVEL_RS_PERDAY == undefined ||
        this.data.TRAVEL_RS_PERDAY == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Travel DA (Perday Rs)', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.GRANT_ONE_BASIC_PAY_AMOUNT == undefined ||
        this.data.GRANT_ONE_BASIC_PAY_AMOUNT == null)
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Composite transfer grant @ one basic pay (80%)',
        ''
      );
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.ADVANCE_AMOUNT_REQ == undefined ||
        this.data.ADVANCE_AMOUNT_REQ == null)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Amount of Advance Required', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      this.data.memberTransferData.length == 0
    ) {
      this.isOk = false;
      this.message.error(
        'Please Add At Least One Particular of the members',
        ''
      );

      // } else if (
      //   this.data.HEADQUARTERS_NAME == undefined ||
      //   this.data.HEADQUARTERS_NAME == null ||
      //   this.data.HEADQUARTERS_NAME == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Old Head Quarter Name', '');
      // } else if (
      //   this.data.ADDRESS == undefined ||
      //   this.data.ADDRESS == null ||
      //   this.data.ADDRESS == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Old Residential Address', '');
      // } else if (
      //   this.data.NEW_HEADQUARTERS_NAME == undefined ||
      //   this.data.NEW_HEADQUARTERS_NAME == null ||
      //   this.data.NEW_HEADQUARTERS_NAME == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter New Head Quarter Name', '');
      // } else if (
      //   this.data.NEW_ADDRESS == undefined ||
      //   this.data.NEW_ADDRESS == null ||
      //   this.data.NEW_ADDRESS == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter New Residential Address', '');
    }

    if (this.isOk) {
      if (
        this.data.memberTransferData == undefined ||
        this.data.memberTransferData.length == 0
      ) {
      } else {
        for (var i = 0; this.relationdata.length > i; i++) {
          this.relationdata[i]['ID'] = undefined;
        }
        this.data.memberTransferData = this.relationdata;
      }

      this.isSpinning = true;
      if (
        this.data.OFFICE_NAME == undefined ||
        this.data.OFFICE_NAME == null ||
        this.data.OFFICE_NAME == '' ||
        this.data.OFFICE_NAME.trim() == ''
      ) {
        this.data.OFFICE_NAME = null;
      }

      if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID.trim() == ''
      ) {
        this.data.EMAIL_ID = null;
      }
      if (
        this.data.EMPLOYEE_CODE == undefined ||
        this.data.EMPLOYEE_CODE == null ||
        this.data.EMPLOYEE_CODE == '' ||
        this.data.EMPLOYEE_CODE.trim() == ''
      ) {
        this.data.EMPLOYEE_CODE = ' ';
      }

      if (
        this.data.MOBILE_NO == undefined ||
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == '' ||
        this.data.MOBILE_NO.trim() == ''
      ) {
        this.data.MOBILE_NO = ' ';
      }

      if (
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == '' ||
        this.data.ADDRESS.trim() == ''
      ) {
        this.data.ADDRESS = ' ';
      }

      if (
        this.data.BENEFICIARY_TYPE == 'CS' &&
        (this.data.CGHS_CARD_NO != undefined ||
          this.data.CGHS_CARD_NO != null ||
          this.data.CGHS_CARD_NO != '')
      ) {
        this.data.CGHS_CARD_NO = null;
      }
      if (
        this.data.BENEFICIARY_TYPE == 'CS' &&
        (this.data.CGHS_CARD_VALIDITY != undefined ||
          this.data.CGHS_CARD_VALIDITY != null ||
          this.data.CGHS_CARD_VALIDITY != '')
      ) {
        this.data.CGHS_CARD_VALIDITY = null;
      }

      if (
        this.data.BENEFICIARY_TYPE == 'CG' &&
        (this.data.CGHS_CARD_VALIDITY == undefined ||
          this.data.CGHS_CARD_VALIDITY == null ||
          this.data.CGHS_CARD_VALIDITY == '')
      ) {
        this.data.CGHS_CARD_VALIDITY = null;
      }

      if (
        this.data.CGHS_CARD_VALIDITY != null &&
        this.data.CGHS_CARD_VALIDITY != undefined &&
        this.data.CGHS_CARD_VALIDITY != ''
      ) {
        this.data.CGHS_CARD_VALIDITY = this.datepipe.transform(
          this.data.CGHS_CARD_VALIDITY,
          'yyyy-MM-dd'
        );
      } else {
        this.data.CGHS_CARD_VALIDITY = this.data.CGHS_CARD_VALIDITY;
      }

      if (
        this.data.DOJ_PRESENT_STATION != null &&
        this.data.DOJ_PRESENT_STATION != undefined &&
        this.data.DOJ_PRESENT_STATION != ''
      ) {
        this.data.DOJ_PRESENT_STATION = this.datepipe.transform(
          this.data.DOJ_PRESENT_STATION,
          'yyyy-MM-dd'
        );
      } else {
        this.data.DOJ_PRESENT_STATION = this.data.DOJ_PRESENT_STATION;
      }

      if (
        this.data.DOJ_PRESENT_POST != null &&
        this.data.DOJ_PRESENT_POST != undefined &&
        this.data.DOJ_PRESENT_POST != ''
      ) {
        this.data.DOJ_PRESENT_POST = this.datepipe.transform(
          this.data.DOJ_PRESENT_POST,
          'yyyy-MM-dd'
        );
      } else {
        this.data.DOJ_PRESENT_POST = this.data.DOJ_PRESENT_POST;
      }
      this.data.APP_INFO_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      if (!this.claimID) {
        this.data['IS_ADMIN_TRANSFER'] = false;
      }
      {
        if (this.data.ID) {
          this.data['TRANSFER_ID'] = this.claimID;
          this.api
            .updatetransferempdetails(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                // this.message.success('Information Saved Successfully...', '');

                this.empID = successCode.EMP_ID;
                this.claimID = successCode.TRANSFER_ID;
                this.next();
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
              // this.message.success('Information Save Successfully...', '');
              this.empID = successCode.EMPLOYEE;
              this.claimID = successCode.TRANSFER_ID;
              this.next();

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

  // claimSave(addNew: boolean, claimMasterPage: NgForm): void {
  //   this.data2.EMP_ID = this.empID;
  //   this.data2.ID = this.claimID;
  //   this.data2.hospitalData = this.hospitalMapList;
  //   this.data2.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
  //   for (var i = 0; this.hospitalMapList.length > i; i++) {
  //     this.hospitalMapList[i]['ID'] = undefined;
  //     this.hospitalMapList[i]['CLAIM_ID'] = undefined;
  //   }
  //   this.data2.hospitalData = this.hospitalMapList;

  //   //
  //   //

  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (
  //     this.data2.RELATION_WITH_PATIENT == undefined &&
  //     this.data2.PATIENT_NAME == undefined &&
  //     this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined &&
  //     this.data2.NATURE_OF_TREATMENT == undefined &&
  //     this.data2.TREATMENT_START_DATE == undefined &&
  //     this.data2.TREATMENT_END_DATE == undefined &&
  //     this.data2.BILL_FILIING_DATE == undefined &&
  //     this.data2.hospitalData.length == 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Fill All The Required Fields ', '');
  //   } else if (
  //     this.data2.RELATION_WITH_PATIENT == undefined ||
  //     this.data2.RELATION_WITH_PATIENT == null ||
  //     this.data2.RELATION_WITH_PATIENT == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Relationship with Applicant', '');
  //   } else if (
  //     this.data2.PATIENT_NAME == undefined ||
  //     this.data2.PATIENT_NAME == null ||
  //     this.data2.PATIENT_NAME == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Patient Name', '');
  //   } else if (
  //     this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined ||
  //     this.data2.PATIENT_CGHS_BENEFICIERY_NO == null ||
  //     this.data2.PATIENT_CGHS_BENEFICIERY_NO == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Patient CGHS Beneficiary Number', '');
  //   } else if (
  //     this.data2.NATURE_OF_TREATMENT == undefined ||
  //     this.data2.NATURE_OF_TREATMENT == null ||
  //     this.data2.NATURE_OF_TREATMENT == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Nature Of Treatment/Test', '');
  //   } else if (
  //     this.data2.TREATMENT_START_DATE == undefined ||
  //     this.data2.TREATMENT_START_DATE == null
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Treatment Start Date', '');
  //   } else if (
  //     this.data2.TREATMENT_END_DATE == undefined ||
  //     this.data2.TREATMENT_END_DATE == null
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Treatment End Date', '');
  //   } else if (
  //     this.data2.BILL_FILIING_DATE == undefined ||
  //     this.data2.BILL_FILIING_DATE == null
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Bill Filling Date', '');
  //   } else if (
  //     this.data2.IS_ADVANCE_TAKEN == true &&
  //     (this.data2.ADVANCE_AMOUNT == undefined ||
  //       this.data2.ADVANCE_AMOUNT == null ||
  //       this.data2.ADVANCE_AMOUNT == '')
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Advance Amount.', '');
  //   } else if (
  //     this.data2.IS_ADVANCE_TAKEN == true &&
  //     (this.data2.ADVANCE_TAKEN_DATE == undefined ||
  //       this.data2.ADVANCE_TAKEN_DATE == null)
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Date Of Advance Taken.  ', '');
  //   } else if (this.data2.hospitalData.length == 0) {
  //     this.isOk = false;
  //     this.message.error('Please Add Hospital ', '');
  //     // }
  //     //  else if (
  //     //   this.data2.HOSPITAL_TYPE == undefined ||
  //     //   this.data2.HOSPITAL_TYPE == null ||
  //     //   this.data2.HOSPITAL_TYPE == ''
  //     // ) {
  //     //   this.isOk = false;
  //     //   this.message.error(' Please Select Hospital Type', '');
  //     // } else if (
  //     //   this.data2.HOSPITAL_TYPE == 'E' &&
  //     //   (this.data2.HOSPITAL_ID == undefined ||
  //     //     this.data2.HOSPITAL_ID == null ||
  //     //     this.data2.HOSPITAL_ID == '')
  //     // ) {
  //     //   this.isOk = false;
  //     //   this.message.error(' Please Select Hospital Name.', '');
  //     // } else if (
  //     //   this.data2.HOSPITAL_TYPE == 'E' &&
  //     //   (this.data2.HOSPITAL_ADDRESS == undefined ||
  //     //     this.data2.HOSPITAL_ADDRESS == null ||
  //     //     this.data2.HOSPITAL_ADDRESS == '')
  //     // ) {
  //     //   this.isOk = false;
  //     //   this.message.error(' Please Enter Hospital Address.', '');
  //     // } else if (
  //     //   (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
  //     //   (this.data2.HOSPITAL_NAME == undefined ||
  //     //     this.data2.HOSPITAL_NAME == null ||
  //     //     this.data2.HOSPITAL_NAME == '')
  //     // ) {
  //     //   this.isOk = false;
  //     //   this.message.error('Please Enter Hospital Name.  ', '');
  //     // } else if (
  //     //   (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
  //     //   (this.data2.HOSPITAL_ADDRESS == undefined ||
  //     //     this.data2.HOSPITAL_ADDRESS == null ||
  //     //     this.data2.HOSPITAL_ADDRESS == '')
  //     // ) {
  //     //   this.isOk = false;
  //     //   this.message.error('Please Enter Hospital Address. ', '');
  //     // } else if (
  //     //   (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
  //     //   (this.data2.CLAIM_ACCREDITATION == undefined ||
  //     //     this.data2.CLAIM_ACCREDITATION == null ||
  //     //     this.data2.CLAIM_ACCREDITATION == '')
  //     // ) {
  //     //   this.isOk = false;
  //     //   this.message.error('Please Select Accredition.  ', '');
  //   }
  //   if (this.isOk) {
  //     this.data2['TRANSFER_ID'] = this.claimID;
  //     this.isSpinning = true;
  //     this.data2.TREATMENT_START_DATE = this.datepipe.transform(
  //       this.data2.TREATMENT_START_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data2.TREATMENT_END_DATE = this.datepipe.transform(
  //       this.data2.TREATMENT_END_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data2.BILL_FILIING_DATE = this.datepipe.transform(
  //       this.data2.BILL_FILIING_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data2.ADVANCE_TAKEN_DATE = this.datepipe.transform(
  //       this.data2.ADVANCE_TAKEN_DATE,
  //       'yyyy-MM-dd'
  //     );

  //     var date1: any = new Date(this.data2.TREATMENT_END_DATE);
  //     var date2: any = new Date(this.data2.BILL_FILIING_DATE);
  //     this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
  //
  //     this.data2.DELAY_CONDELENCE_DIFFERENCE = this.diffDays;
  //     var advance;
  //     if (this.data2.IS_ADVANCE_TAKEN == true) {
  //       advance = 1;
  //
  //     } else {
  //       advance = 0;
  //
  //     }
  //     if (advance == 1 && this.diffDays <= 30) {
  //       this.data3.BILL_FILLED_INTIME = true;
  //     } else if (advance == 1 && this.diffDays > 30) {
  //       this.data3.BILL_FILLED_INTIME = false;
  //     } else if (advance == 0 && this.diffDays > 182) {
  //       this.data3.BILL_FILLED_INTIME = false;
  //     } else {
  //       this.data3.BILL_FILLED_INTIME = true;
  //     }

  //     if (this.data2.HOSPITAL_TYPE == 'E') {
  //       this.data2.HOSPITAL_NAME = '';
  //     } else {
  //       this.data2.HOSPITAL_NAME = this.data2.HOSPITAL_NAME;
  //     }

  //     // if(this.data2.HOSPITAL_TYPE == 'E' && (this.data2.HOSPITAL_ADDRESS != undefined || this.data2.HOSPITAL_ADDRESS != null
  //     //   || this.data2.HOSPITAL_ADDRESS != '' || this.data2.HOSPITAL_ADDRESS.trim() != '' )){
  //     //     this.data2.HOSPITAL_ADDRESS = ''
  //     //   } else{
  //     //     this.data2.HOSPITAL_ADDRESS = this.data2.HOSPITAL_ADDRESS
  //     //   }

  //     if (
  //       this.data2.HOSPITAL_TYPE == 'E' &&
  //       (this.data2.CLAIM_ACCREDITATION != undefined ||
  //         this.data2.CLAIM_ACCREDITATION != null ||
  //         this.data2.CLAIM_ACCREDITATION != '' ||
  //         this.data2.CLAIM_ACCREDITATION.trim() != '')
  //     ) {
  //       this.data2.CLAIM_ACCREDITATION = '';
  //     } else {
  //       this.data2.CLAIM_ACCREDITATION = this.data2.CLAIM_ACCREDITATION;
  //     }

  //     if (
  //       (this.data2.HOSPITAL_TYPE == 'NE' || this.data2.HOSPITAL_TYPE == 'G') &&
  //       (this.data2.HOSPITAL_ID != undefined ||
  //         this.data2.HOSPITAL_ID != null ||
  //         this.data2.HOSPITAL_ID != '' ||
  //         this.data2.HOSPITAL_ID.trim() != '')
  //     ) {
  //       this.data2.HOSPITAL_ID = '';
  //     } else {
  //       this.data2.HOSPITAL_ID = this.data2.HOSPITAL_ID;
  //     }

  //     {
  //       if (this.data2.ID) {
  //         if (
  //           (this.currentStageID != undefined ||
  //             this.currentStageID != null ||
  //             this.currentStageID != '') &&
  //           this.currentStageID > 3
  //         ) {
  //           this.data2.CURRENT_STAGE_ID = this.data2.CURRENT_STAGE_ID;
  //         } else {
  //           this.data2.CURRENT_STAGE_ID = 3;
  //         }
  //         this.api.updateclaimed(this.data2).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             this.message.success('Information Changed Successfully...', '');
  //             this.billInTime();
  //             this.empanelledHospital();
  //             this.next();
  //             // if (!addNew) this.drawerClose();
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error('Information Has Not Changed...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       } else {
  //         this.api.createclaimed(this.data2).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             this.message.success('Information Save Successfully...', '');
  //             // this.claimID = successCode.EMPLOYEE
  //             //
  //             this.billInTime();
  //             this.empanelledHospital();
  //             this.next();

  //             this.isSpinning = false;
  //           } else {
  //             this.message.error('Failed To Fill Information...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       }
  //     }
  //   }
  // }

  queSave(addNew: boolean, claimMasterPage: NgForm): void {
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;

    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      (this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
        this.data3.CGHS_AMA_REFERENCE_DATE == null ||
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Add CGHS/AMAs Reference Start Date', '');
    } else if (
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      (this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined ||
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null ||
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0)
    ) {
      this.isOk = false;
      this.message.error(' Please Add CGHS/AMAs Reference End Date', '');
    } else if (
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      this.data3.CGHS_AMA_REFERENCE_DATE.length !=
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length
    ) {
      this.isOk = false;
      this.message.error(
        ' Please Add CGHS/AMAs Reference Start Date & End Date Equal',
        ''
      );
    } else if (
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
    } else if (
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      (this.data3.CGHS_AMA_REFERENCE_DATE != undefined ||
        this.data3.CGHS_AMA_REFERENCE_DATE != null ||
        this.data3.CGHS_AMA_REFERENCE_DATE.length != 0)
    ) {
      var date2: any = new Date(this.data2.BILL_FILIING_DATE);
      //

      var expoDiffDays = Math.floor(
        (date2 - this.date1) / (1000 * 60 * 60 * 24)
      );

      ///////////////////////////////////Date Difference ///////////////////
    }

    if (this.isOk) {
      this.isSpinning = true;

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

      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
                          this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
                          this.data3.CGHS_AMA_REFERENCE_DATE == null &&
                          this.data3.CGHS_AMA_REFERENCE_DATE == '' &&
                          this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
                        ) {
                          this.data3.CGHS_AMA_REFERENCE_DATE = [];
                        } else {
                          this.data3.CGHS_AMA_REFERENCE_DATE =
                            this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
                        }
                        if (
                          this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
                          this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
                          this.data3.CGHS_AMA_REFERENCE_END_DATE == '' &&
                          this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
                        ) {
                          this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
                        } else {
                          this.data3.CGHS_AMA_REFERENCE_END_DATE =
                            this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
                        }
                        this.isSpinning = false;
                      }
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
              this.next();

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

              this.current = 3;

              this.data4 = new CheckList();

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

  checkSave1(addNew: boolean): void {
    this.data.TRANSFER_STATUS = 'P';
    this.checkData.TRANSFER_ID = this.claimID;
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == undefined &&
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == undefined &&
      this.checkData.A_T_TICKET_SUBMITTED == undefined &&
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == undefined &&
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED ==
        undefined &&
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
        undefined &&
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Check All Checklist Proper ', '');
    } else if (
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == undefined ||
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == null ||
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check 3 No. Point ', '');
    } else if (
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == undefined ||
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == null ||
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check 7 No. Point ', '');
    } else if (
      this.checkData.A_T_TICKET_SUBMITTED == undefined ||
      this.checkData.A_T_TICKET_SUBMITTED == null ||
      this.checkData.A_T_TICKET_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check 8 No. Point  ', '');
    } else if (
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == undefined ||
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == null ||
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 9 No. Point ', '');
    } else if (
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED ==
        undefined ||
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED == null ||
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 10 No. Point ', '');
    } else if (
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
        undefined ||
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
        null ||
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 11 No. Point ', '');
    } else if (
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == undefined ||
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == null ||
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 13 No. Point ', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.checkData.ID) {
          this.api
            .updateTransferChecklist(this.checkData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.api.updatetransfer(this.data).subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.isSpinning = false;
                    this.message.success(
                      'Information Saved Successfully...',
                      ''
                    );
                    this.drawerClose();
                    this.current = 0;
                  } else {
                    this.message.error('Information Has Not Saved...', '');
                    this.isSpinning = false;
                  }
                });
                this.message.success('Information Changed Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  this.current = 0;
                  this.isSpinning = false;
                }
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createTransferChecklist(this.checkData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.api.updatetransfer(this.data).subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.isSpinning = false;
                    this.message.success(
                      'Information Saved Successfully...',
                      ''
                    );
                    this.drawerClose();
                    this.current = 0;
                  } else {
                    this.message.error('Information Has Not Saved...', '');
                    this.isSpinning = false;
                  }
                });
                this.message.success('Information Save Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  this.current = 0;
                } else {
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
  checkSave(addNew: boolean): void {
    this.data.TRANSFER_STATUS = null;
    this.checkData.TRANSFER_ID = this.claimID;
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == undefined &&
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == undefined &&
      this.checkData.A_T_TICKET_SUBMITTED == undefined &&
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == undefined &&
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED ==
        undefined &&
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
        undefined &&
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Check All Checklist Proper ', '');
    } else if (
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == undefined ||
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == null ||
      this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check 3 No. Point ', '');
    } else if (
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == undefined ||
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == null ||
      this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check 7 No. Point ', '');
    } else if (
      this.checkData.A_T_TICKET_SUBMITTED == undefined ||
      this.checkData.A_T_TICKET_SUBMITTED == null ||
      this.checkData.A_T_TICKET_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error('Please Check 8 No. Point  ', '');
    } else if (
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == undefined ||
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == null ||
      this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 9 No. Point ', '');
    } else if (
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED ==
        undefined ||
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED == null ||
      this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 10 No. Point ', '');
    } else if (
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
        undefined ||
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
        null ||
      this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 11 No. Point ', '');
    } else if (
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == undefined ||
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == null ||
      this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Check 13 No. Point ', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.checkData.ID) {
          this.api
            .updateTransferChecklist(this.checkData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.api.updatetransfer(this.data).subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.isSpinning = false;
                    this.message.success(
                      'Information Saved Successfully...',
                      ''
                    );
                    this.drawerClose();
                    this.current = 0;
                  } else {
                    this.message.error('Information Has Not Saved...', '');
                    this.isSpinning = false;
                  }
                });
                this.message.success('Information Changed Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  this.current = 0;
                  this.isSpinning = false;
                }
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createTransferChecklist(this.checkData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.api.updatetransfer(this.data).subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.isSpinning = false;
                    this.message.success(
                      'Information Saved Successfully...',
                      ''
                    );
                    this.drawerClose();
                    this.current = 0;
                  } else {
                    this.message.error('Information Has Not Saved...', '');
                    this.isSpinning = false;
                  }
                });
                this.message.success('Information Save Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  this.current = 0;
                } else {
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

  partA() {
    this.data.STEP_NO = 4;
    this.data.TRANSFER_ID = undefined;
    // this.data.CURRENT_STAGE_ID = null;
    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;

        // this.current=5;
        // this.drawerClose();
        this.next();
        // this.message.success('Information Saved Successfully...', '');
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }

  saveDownloadDate() {
    this.isSpinning = true;
    this.data.DOWNLOAD_PARTA_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.api
          .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.isSpinning = false;
                this.data = data['data'][0];
                this.message.success('Information Saved Successfully...', '');
              } else {
                this.message.error('Information Has Not Saved...', '');
                this.isSpinning = false;
              }
            },
            (err) => {}
          );
      } else {
        this.isSpinning = false;
      }
    });
  }
  partA1() {
    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        // this.current=5;
        this.printOrderModalVisible1 = true;
        // this.drawerClose();
        // this.next();
        this.message.success('Information Saved Successfully...', '');
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }

  uploadDoc(addNew: boolean) {
    this.isOk = true;
    if (
      !this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.ASSUMPTION_CHARGE == null ||
        this.data.ASSUMPTION_CHARGE == undefined ||
        this.data.ASSUMPTION_CHARGE.trim() == '')
    ) {
      this.message.error('Please select Assumption Charge', '');
      this.isOk = false;
    } else if (
      this.data.MANDATE_FORM == null ||
      this.data.MANDATE_FORM == undefined ||
      this.data.MANDATE_FORM.trim() == ''
    ) {
      this.message.error('Please select Mandate Form', '');
      this.isOk = false;
    } else if (
      this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE == null ||
      this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE == undefined ||
      this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE.trim() == ''
    ) {
      this.message.error(
        'Please select Transfer Order Service Certificate ',
        ''
      );
      this.isOk = false;
    } else if (
      this.data.PAY_SLIP == null ||
      this.data.PAY_SLIP == undefined ||
      this.data.PAY_SLIP == ''
    ) {
      this.message.error('Please select Pay Slip ', this.data.PAY_SLIP);
      this.isOk = false;
    } else {
      this.data.DOCUMENTS_SUBMITTED_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      if (
        this.data.IS_APPLYING_FOR_ADVANCE &&
        !this.data.IS_TRANSFER_ADVANCE_CREATED
      ) {
        this.data.AD_STEP_NO = 1;
      } else {
        this.data.STEP_NO = 3;
      }
      // this.data.CURRENT_STAGE_ID = null;

      if (this.isOk && this.data.ID != undefined) {
        this.isSpinning = true;
        if (this.data.ID) {
          this.data.TRANSFER_ID = undefined;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.isSpinning = false;
              // this.current=4;
              // this.drawerClose();
              this.next();
              // this.message.success('Information Saved Successfully...', '');
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
        } else {
        }
      }
      this.DataFromDDO();
    }
  }

  DataFromDDO() {
    if (this.data && this.data.DDO_OF_THE_OFFICIAL_ID) {
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' + this.data.DDO_OF_THE_OFFICIAL_ID
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
  uploadDoc1(addNew: boolean) {
    if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_TRANSFER_ADVANCE_CREATED
    ) {
      this.data.AD_STEP_NO = 2;
    } else {
      this.data.STEP_NO = 4;
    }

    this.data.UPLOAD_PARTA_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.isOk = true;
    // if (
    //   this.data.TRANSFER_PART_A == null ||
    //   this.data.TRANSFER_PART_A == undefined ||
    //   this.data.TRANSFER_PART_A == ''
    // ) {
    //   this.message.error('Please Upload Part A Document with Sign', '');
    //   this.isOk = false;
    // } else {
    //   this.isOk = true;
    // }
    if (this.isOk && this.data.ID != undefined) {
      this.isSpinning = true;

      if (this.data.ID) {
        if (
          this.data.IS_APPLYING_FOR_ADVANCE &&
          this.data.IS_TRANSFER_ADVANCE_CREATED
        ) {
          this.data.IS_EMP_FILL_ADVANCE_INFO = 1;
        } else {
          this.data.TRANSFER_ID = undefined;
          this.data.TRANSFER_STATUS = 'P';
          this.data.CURRENT_STAGE_ID = 2;
        }

        // this.data.CURRENT_STAGE_ID = 3;

        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.isSpinning = false;
            this.confirmVisible = false;
            this.drawerClose();
            // this.next();
            this.message.success('Information Saved Successfully...', '');
          } else {
            this.confirmVisible = false;
            this.message.error('Information Has Not Saved...', '');
            this.isSpinning = false;
          }
        });
      } else {
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
      this.gradePayLevelList();
      this.ddoOfTheOfficialList();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                // this.isSpinning = false;
                this.data = data['data'][0];
              } else {
                // this.isSpinning = false;
              }
              this.api
                .getrelationtable(
                  0,
                  0,
                  '',
                  '',
                  ' AND TRANSFER_ID = ' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.relationdata = data['data'];
                      } else {
                        this.relationdata = [];
                      }
                      this.isSpinning = false;
                      this.current = 0;
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Something Went Wrong', '');
              // this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.current = 2;
                this.current1 = 0;
                this.data = data['data'][0];
                this.isSpinning = false;
              } else {
                this.current = 2;
                this.current1 = 1;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.getDataform1();
      this.getDataform2();
      this.getDataform3();
      this.detailsJorneyGetData();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.data = data['data'][0];
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 0;
                  this.current1 = 0;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              } else {
                // this.data = data['data'][0];
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 0;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              }
            } else {
              // this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 4) {
      // this.current=3;
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              this.api
                .getrelationtable(
                  0,
                  0,
                  '',
                  ' ',
                  ' AND TRANSFER_ID =' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.relationdataorder = data['data'];
                      } else {
                        this.relationdataorder = [];
                      }
                      this.api
                        .getjourneydetails(
                          0,
                          0,
                          '',
                          'asc',
                          ' AND TRANSFER_ID =' + this.claimID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              this.journeydetails = data['data'];
                            } else {
                              this.journeydetails = [];
                            }
                            this.api
                              .gettransfarchnagedetailspersonal(
                                0,
                                0,
                                '',
                                'asc',
                                ' AND TRANSFER_ID =' + this.claimID
                              )
                              .subscribe((data) => {
                                if (data['code'] == 200) {
                                  if (data['data'].length > 0) {
                                    this.tranferchnagesorder = data['data'];
                                  } else {
                                    this.tranferchnagesorder = [];
                                  }
                                  this.api
                                    .gettransfarchnagedetails1(
                                      0,
                                      0,
                                      '',
                                      'asc',
                                      ' AND TRANSFER_ID =' + this.claimID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        if (data['data'].length > 0) {
                                          this.railorder = data['data'];
                                        } else {
                                          this.railorder = [];
                                        }
                                        this.api
                                          .gettransfortation(
                                            0,
                                            0,
                                            '',
                                            'asc',
                                            ' AND TRANSFER_ID =' + this.claimID
                                          )
                                          .subscribe((data) => {
                                            if (data['code'] == 200) {
                                              if (data['data'].length > 0) {
                                                this.accommodation =
                                                  data['data'];
                                              } else {
                                                this.accommodation = [];
                                              }
                                              this.isSpinning = false;
                                              this.current = 3;
                                            } else {
                                              this.isSpinning = false;
                                            }
                                          });
                                      } else {
                                        this.isSpinning = false;
                                      }
                                    });
                                } else {
                                  this.isSpinning = false;
                                }
                              });
                          } else {
                            this.isSpinning = false;
                          }
                        });
                    } else {
                      this.isSpinning = false;
                    }
                  },

                  (err) => {}
                );
            } else {
              this.isSpinning = false;
            }
          },

          (err) => {}
        );
    } else if (this.current == 5) {
      this.current = 4;
      this.api
        .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['code'] == 200 && data['data'].length > 0) {
                this.data = data['data'][0];
              }

              this.loadingRecords = false;
              // this.transferallounce = true;
            } else {
              this.loadingRecords = false;
            }
          },

          (err) => {}
        );
      this.api
        .getrelationtable(0, 0, '', ' ', ' AND TRANSFER_ID =' + this.data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200 && data['data'].length > 0)
              this.relationdataorder = data['data'];
          },

          (err) => {}
        );
      this.api
        .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            //
            this.journeydetails = data['data'];
          }
        });
      this.api
        .gettransfarchnagedetailspersonal(
          0,
          0,
          '',
          'asc',
          ' AND TRANSFER_ID =' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.tranferchnagesorder = data['data'];
          }
        });

      this.api
        .gettransfarchnagedetails1(
          0,
          0,
          '',
          'asc',
          ' AND TRANSFER_ID =' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.railorder = data['data'];
          }
        });

      this.api
        .gettransfortation(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.accommodation = data['data'];
          }
        });
    }
  }

  filterEmpData(event: any) {
    this.empLoader = true;
    if (event != null) {
      this.api.getEmployeeMaster(0, 0, '', '', ' AND ID =' + event).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.empLoader = false;
            if (
              this.data2.ID == 0 ||
              this.data2.ID == null ||
              this.data2.ID == undefined
            ) {
              this.data.ID = data['data'][0]['ID'];
            } else {
              this.data.ID = this.data2.ID;
            }
            this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
            this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
            this.data.LOCATION = data['data'][0]['LOCATION'];
            this.data.DDO_OF_THE_OFFICIAL =
              data['data'][0]['DDO_OF_THE_OFFICIAL'];
            this.data.DDO_OF_THE_OFFICIAL_ID =
              data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
            this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
            this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
            this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
            this.data.ADDRESS = data['data'][0]['ADDRESS'];
            this.data.NAME = data['data'][0]['NAME'];
            // if (
            //   this.data.GRADE_PAY != '' ||
            //   this.data.GRADE_PAY != null ||
            //   this.data.GRADE_PAY != undefined
            // ) {
            //   this.grantamount(this.data.GRADE_PAY);
            // }
          }
        },
        (err) => {}
      );
    } else {
      this.empLoader = false;
      this.data.ID = null;
      this.data.OFFICE_NAME = '';
      this.data.DESIGNATION = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = null;
      this.data.GRADE_PAY = '';
      this.data.EMAIL_ID = '';
      this.data.MOBILE_NO = '';
      this.data.SERVICE_TYPE = '';
      this.data.ADDRESS = '';
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

  emergencyTaken;
  drCertificate;
  empanelHospital;
  expoFacto;
  referanceTaken;
  hodPermission;

  dateDifference() {
    // var date1: any = new Date(
    //   Math.max.apply(
    //     null,
    //     this.data3.CGHS_AMA_REFERENCE_DATE.map(function (e) {
    //
    //       return new Date(e);
    //     })
    //   )
    // );
    //
    //
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    //

    this.expoDiffDays = Math.floor(
      (date2 - this.date1) / (1000 * 60 * 60 * 24)
    );
  }

  fileList: any = [];
  fileNumberList() {
    this.api
      .getFileMaster(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND HIRARCHY_ID in (9,10)',
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200 && data['count'] > 0) {
            this.fileList = data['data'];
          } else {
            this.fileList = [];
          }
        },
        (err) => {}
      );
  }
  railorder: any = [];
  tranferchnagesorder: any = [];
  journeydetails: any = [];
  relationdataorder: any = [];

  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.getDataform1();
      this.getDataform2();
      this.getDataform3();
      this.detailsJorneyGetData();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data2 = new ClaimMaster();
                this.message.success('Information Saved Successfully...', '');
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 2;
                  this.current1 = 1;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                this.message.success('Information Saved Successfully...', '');
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 2;
                  this.current1 = 1;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              }
            } else {
              // this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 1) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.message.success('Information Saved Successfully...', '');
                this.current = 2;
                this.isSpinning = false;
              } else {
                this.message.success('Information Saved Successfully...', '');
                this.current = 2;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              this.api
                .getrelationtable(
                  0,
                  0,
                  '',
                  ' ',
                  ' AND TRANSFER_ID =' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.relationdataorder = data['data'];
                      } else {
                        this.relationdataorder = [];
                      }
                      this.api
                        .getjourneydetails(
                          0,
                          0,
                          '',
                          'asc',
                          ' AND TRANSFER_ID =' + this.claimID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              this.journeydetails = data['data'];
                            } else {
                              this.journeydetails = [];
                            }
                            this.api
                              .gettransfarchnagedetailspersonal(
                                0,
                                0,
                                '',
                                'asc',
                                ' AND TRANSFER_ID =' + this.claimID
                              )
                              .subscribe((data) => {
                                if (data['code'] == 200) {
                                  if (data['data'].length > 0) {
                                    this.tranferchnagesorder = data['data'];
                                  } else {
                                    this.tranferchnagesorder = [];
                                  }
                                  this.api
                                    .gettransfarchnagedetails1(
                                      0,
                                      0,
                                      '',
                                      'asc',
                                      ' AND TRANSFER_ID =' + this.claimID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        if (data['data'].length > 0) {
                                          this.railorder = data['data'];
                                        } else {
                                          this.railorder = [];
                                        }
                                        this.api
                                          .gettransfortation(
                                            0,
                                            0,
                                            '',
                                            'asc',
                                            ' AND TRANSFER_ID =' + this.claimID
                                          )
                                          .subscribe((data) => {
                                            if (data['code'] == 200) {
                                              if (data['data'].length > 0) {
                                                this.accommodation =
                                                  data['data'];
                                              } else {
                                                this.accommodation = [];
                                              }
                                              this.isSpinning = false;
                                              this.message.success(
                                                'Information Saved Successfully...',
                                                ''
                                              );
                                              if (
                                                this.data
                                                  .IS_APPLYING_FOR_ADVANCE &&
                                                !this.data
                                                  .IS_TRANSFER_ADVANCE_CREATED
                                              ) {
                                                var Allowancetotal =
                                                  (this.data.TRA_ALLO_FARE_RS *
                                                    this.relationdataorder
                                                      .length *
                                                    90) /
                                                  100;
                                                this.data.TRAVELLING_ALLOW_TOTAL =
                                                  Number(Allowancetotal);
                                                this.data.TRAVAL_DA_TOTAL =
                                                  Number(
                                                    this.data.TRAVEL_DA_DAYS
                                                  ) *
                                                  Number(
                                                    this.data.TRAVEL_RS_PERDAY
                                                  );

                                                this.data.TOTAL_ENT_AMOUNT =
                                                  Number(
                                                    this.data
                                                      .TRAVELLING_ALLOW_TOTAL
                                                  ) +
                                                  Number(
                                                    this.data.TRAVAL_DA_TOTAL
                                                  ) +
                                                  Number(
                                                    this.data
                                                      .GRANT_ONE_BASIC_PAY_AMOUNT
                                                  ) +
                                                  Number(
                                                    this.data
                                                      .CHARGES_FOR_PRIVATE_CON_AMOUNT
                                                  ) +
                                                  Number(
                                                    this.data
                                                      .CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT
                                                  );
                                              }
                                              this.current = 3;
                                              this.current1 = 2;
                                            } else {
                                              this.isSpinning = false;
                                            }
                                          });
                                      } else {
                                        this.isSpinning = false;
                                      }
                                    });
                                } else {
                                  this.isSpinning = false;
                                }
                              });
                          } else {
                            this.isSpinning = false;
                          }
                        });
                    } else {
                      this.isSpinning = false;
                    }
                  },

                  (err) => {}
                );
            } else {
              this.isSpinning = false;
            }
          },

          (err) => {}
        );
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              // if (data['data'].length == 0) {
              this.message.success('Information Saved Successfully...', '');
              this.current = 3;
              this.current1 = 3;

              this.isSpinning = false;
              // } else {
              //   this.current = 3;
              //   this.isSpinning = false;
              // }
            } else {
              // this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      // this.api
      //   .getAllTransferChecklist(
      //     0,
      //     0,
      //     '',
      //     '',
      //     ' AND TRANSFER_ID =' + this.claimID
      //   )
      //   .subscribe(
      //     (data) => {
      //       if (data['code'] == 200) {
      //         if (data['data'].length > 0) {
      //           this.checkData = data['data'][0];
      //           this.isSpinning = false;
      //           this.current = 4;
      //         } else {
      //           this.current = 4;
      //           this.checkData = new TransferCheckList();
      //           this.isSpinning = false;
      //         }
      //         // }
      //       } else {
      //         // this.message.error('Something Went Wrong', '');
      //         this.isSpinning = false;
      //       }
      //     },
      //     (err) => {
      //
      //     }
      //   );
    } else if (this.current == 4) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              this.api
                .getrelationtable(
                  0,
                  0,
                  '',
                  ' ',
                  ' AND TRANSFER_ID =' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.relationdataorder = data['data'];
                      } else {
                        this.relationdataorder = [];
                      }
                      this.api
                        .getjourneydetails(
                          0,
                          0,
                          '',
                          'asc',
                          ' AND TRANSFER_ID =' + this.claimID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              this.journeydetails = data['data'];
                            } else {
                              this.journeydetails = [];
                            }
                            this.api
                              .gettransfarchnagedetailspersonal(
                                0,
                                0,
                                '',
                                'asc',
                                ' AND TRANSFER_ID =' + this.claimID
                              )
                              .subscribe((data) => {
                                if (data['code'] == 200) {
                                  if (data['data'].length > 0) {
                                    this.tranferchnagesorder = data['data'];
                                  } else {
                                    this.tranferchnagesorder = [];
                                  }
                                  this.api
                                    .gettransfarchnagedetails1(
                                      0,
                                      0,
                                      '',
                                      'asc',
                                      ' AND TRANSFER_ID =' + this.claimID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        if (data['data'].length > 0) {
                                          this.railorder = data['data'];
                                        } else {
                                          this.railorder = [];
                                        }
                                        this.api
                                          .gettransfortation(
                                            0,
                                            0,
                                            '',
                                            'asc',
                                            ' AND TRANSFER_ID =' + this.claimID
                                          )
                                          .subscribe((data) => {
                                            if (data['code'] == 200) {
                                              if (data['data'].length > 0) {
                                                this.accommodation =
                                                  data['data'];
                                              } else {
                                                this.accommodation = [];
                                              }
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                          }
                        });
                    }
                  },

                  (err) => {}
                );
            } else {
              this.isSpinning = false;
            }
          },

          (err) => {}
        );
    } else if (this.current == 5) {
    }
  }
  nextForSteps() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.getDataform1();
      this.getDataform2();
      this.getDataform3();
      this.detailsJorneyGetData();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data2 = new ClaimMaster();
                // this.current = 1;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                // this.current = 1;
                this.isSpinning = false;
              }
            } else {
              // this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 1) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                // this.current = 2;
                this.isSpinning = false;
              } else {
                // this.current = 2;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              // this.current = 3;
              this.api
                .getrelationtable(
                  0,
                  0,
                  '',
                  ' ',
                  ' AND TRANSFER_ID =' + this.data.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.relationdataorder = data['data'];
                      } else {
                        this.relationdataorder = [];
                      }

                      this.api
                        .getjourneydetails(
                          0,
                          0,
                          '',
                          'asc',
                          ' AND TRANSFER_ID =' + this.data.ID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              //
                              this.journeydetails = data['data'];
                            } else {
                              this.journeydetails = [];
                            }
                            this.api
                              .gettransfarchnagedetailspersonal(
                                0,
                                0,
                                '',
                                'asc',
                                ' AND TRANSFER_ID =' + this.data.ID
                              )
                              .subscribe((data) => {
                                if (data['code'] == 200) {
                                  if (data['data'].length > 0) {
                                    this.tranferchnagesorder = data['data'];
                                  } else {
                                    this.tranferchnagesorder = [];
                                  }
                                  this.api
                                    .gettransfortation(
                                      0,
                                      0,
                                      '',
                                      'asc',
                                      ' AND TRANSFER_ID =' + this.data.ID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        if (data['data'].length > 0) {
                                          this.accommodation = data['data'];
                                        } else {
                                          this.accommodation = [];
                                        }
                                        this.isSpinning = false;
                                        // this.current = 3;
                                      } else {
                                        this.isSpinning = false;
                                      }
                                    });
                                } else {
                                  this.isSpinning = false;
                                }
                              });
                          } else {
                            this.isSpinning = false;
                          }
                        });
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              // this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              // if (data['data'].length == 0) {
              // this.current = 4;
              this.isSpinning = false;
              // } else {
              //   this.current = 3;
              //   this.isSpinning = false;
              // }
            } else {
              // this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      // this.api
      //   .getAllTransferChecklist(
      //     0,
      //     0,
      //     '',
      //     '',
      //     ' AND TRANSFER_ID =' + this.claimID
      //   )
      //   .subscribe(
      //     (data) => {
      //       if (data['code'] == 200) {
      //         if (data['data'].length > 0) {
      //           this.checkData = data['data'][0];
      //           this.isSpinning = false;
      //           this.current = 4;
      //         } else {
      //           this.current = 4;
      //           this.checkData = new TransferCheckList();
      //           this.isSpinning = false;
      //         }
      //         // }
      //       } else {
      //         // this.message.error('Something Went Wrong', '');
      //         this.isSpinning = false;
      //       }
      //     },
      //     (err) => {
      //
      //     }
      //   );
    } else if (this.current == 4) {
      this.loadingRecords = true;
      this.api
        .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['code'] == 200 && data['data'].length > 0) {
                this.data = data['data'][0];
              }

              this.loadingRecords = false;
              // this.transferallounce = true;
            } else {
              this.loadingRecords = false;
            }
          },

          (err) => {}
        );
      this.api
        .getrelationtable(0, 0, '', ' ', ' AND TRANSFER_ID =' + this.data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200 && data['data'].length > 0)
              this.relationdataorder = data['data'];
          },

          (err) => {}
        );
      this.api
        .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            //
            this.journeydetails = data['data'];
          }
        });
      this.api
        .gettransfarchnagedetailspersonal(
          0,
          0,
          '',
          'asc',
          ' AND TRANSFER_ID =' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.tranferchnagesorder = data['data'];
          }
        });

      this.api
        .gettransfarchnagedetails1(
          0,
          0,
          '',
          'asc',
          ' AND TRANSFER_ID =' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.railorder = data['data'];
          }
        });

      this.api
        .gettransfortation(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.accommodation = data['data'];
          }
        });
    } else if (this.current == 5) {
    }
  }
  accommodation: any = [];

  calculateDiff() {
    var date1: any = new Date(this.data2.TREATMENT_END_DATE);
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
  }

  hospitalAddress(event: any) {
    this.api.getAllHospital(0, 0, '', '', ' AND ID = ' + event).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.hospitalData.ADDRESS = data['data'][0]['ADDRESS'];
          this.hospitalData.ACCREDATION = data['data'][0]['ACCREDITATION'];
          //
        }
      },
      (err) => {}
    );
  }

  hospitalType(event: any) {
    if (event == 'E') {
      this.hospitalData.ADDRESS = null;
      this.hospitalData.ACCREDATION = null;
      if (
        this.hospitalData.NAME != undefined ||
        this.hospitalData.NAME != null ||
        this.hospitalData.NAME != ''
      ) {
        this.hospitalData.NAME = '';
      } else {
        this.hospitalData.NAME = '';
      }
    } else if (event == 'NE') {
      this.hospitalData.ADDRESS = null;
      this.hospitalData.ACCREDATION = null;
      if (
        this.hospitalData.HOSPITAL_ID != undefined ||
        this.hospitalData.HOSPITAL_ID != null
      ) {
        this.hospitalData.HOSPITAL_ID = null;
      } else {
        this.hospitalData.HOSPITAL_ID = null;
      }
    } else {
      this.hospitalData.ADDRESS = null;
      this.hospitalData.ACCREDATION = null;
      if (
        this.hospitalData.HOSPITAL_ID != undefined ||
        this.hospitalData.HOSPITAL_ID != null
      ) {
        this.hospitalData.HOSPITAL_ID = null;
      } else {
        this.hospitalData.HOSPITAL_ID = null;
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
  empanneledHospitalMapList: any = [];
  nonEmpanneled: boolean = false;
  empanelledHospital() {
    this.nonEmpanneled = false;
    this.api
      .getHospitalMapping(0, 0, '', '', ' AND CLAIM_ID = ' + this.claimID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.empanneledHospitalMapList = data['data'];
            for (var i = 0; this.empanneledHospitalMapList.length > i; i++) {
              if (this.empanneledHospitalMapList[i]['TYPE'] == 'NE') {
                this.nonEmpanneled = true;
              } else {
              }
            }
            if (this.nonEmpanneled == true) {
              this.data3.IS_HOSPITAL_EMPLANELLED = false;
            } else {
              this.data3.IS_HOSPITAL_EMPLANELLED = true;
            }
            this.isSpinning = false;
          } else {
            this.message.error("Can't Load Hospital Mapped Data.", '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  isAdvanceTaken(event: any) {
    if (event == false) {
      if (
        this.ADVANCED_AMOUNT != null ||
        this.data.ADVANCED_AMOUNT != undefined
      ) {
        this.data.ADVANCED_AMOUNT = null;
      } else {
        this.data.ADVANCED_AMOUNT = null;
      }
      if (
        this.ADVANCE_TAKEN_DATE != null ||
        this.ADVANCE_TAKEN_DATE != undefined
      ) {
        this.ADVANCE_TAKEN_DATE = null;
      } else {
        this.ADVANCE_TAKEN_DATE = null;
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
    //
    this.isSpinning = true;
    if (event == 'Self') {
      this.api
        .getEmployeeMaster(1, 1, '', '', ' AND ID = ' + this.empID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data2.PATIENT_NAME = data['data'][0]['NAME'];
              this.isSpinning = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      this.data2.PATIENT_CGHS_BENEFICIERY_NO = this.data.CGHS_CARD_NO;
    } else {
      this.data2.PATIENT_CGHS_BENEFICIERY_NO = '';
      this.data2.PATIENT_NAME = '';
      this.isSpinning = false;
    }
  }
  list: any = [];
  ADD(CGHS_AMA_REFERENCE_DATE: any) {
    this.list.push(CGHS_AMA_REFERENCE_DATE);
  }

  onChangeReferance(event: any) {
    if (event == false) {
      this.data3.CGHS_AMA_REFERENCE_DATE = [];
      this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
      this.data3.CGHS_AMA_REFERENCE_NO = '';
      this.data3.IS_PERMISSION_TAKEN_FROM_HOD = false;
      this.data3.HOD_PERMISSION_DATE = null;
      this.data3.HOD_PERMISSION_NO = '';
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
      this.data3.EXPO_FACTO_PERMISSION = false;
      this.data3.EXPO_FACTO_DATE = null;
      this.data3.EXPO_FACTO_REFERENCE_NO = '';
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
    if (
      (this.CGHS_AMA_REFERENCE_DATE == undefined ||
        this.CGHS_AMA_REFERENCE_DATE == null ||
        this.CGHS_AMA_REFERENCE_DATE == '') &&
      (this.CGHS_AMA_REFERENCE_END_DATE == undefined ||
        this.CGHS_AMA_REFERENCE_END_DATE == null ||
        this.CGHS_AMA_REFERENCE_END_DATE == '')
    ) {
      this.message.error('Please Select Date', '');
    } else if (
      (this.CGHS_AMA_REFERENCE_DATE == undefined ||
        this.CGHS_AMA_REFERENCE_DATE == null ||
        this.CGHS_AMA_REFERENCE_DATE == '') &&
      (this.CGHS_AMA_REFERENCE_END_DATE != undefined ||
        this.CGHS_AMA_REFERENCE_END_DATE != null ||
        this.CGHS_AMA_REFERENCE_END_DATE != '')
    ) {
      this.message.error("Please Select CGHS/AMA's Reference Start Date", '');
    } else if (
      (this.CGHS_AMA_REFERENCE_DATE != undefined ||
        this.CGHS_AMA_REFERENCE_DATE != null ||
        this.CGHS_AMA_REFERENCE_DATE != '') &&
      (this.CGHS_AMA_REFERENCE_END_DATE == undefined ||
        this.CGHS_AMA_REFERENCE_END_DATE == null ||
        this.CGHS_AMA_REFERENCE_END_DATE == '')
    ) {
      this.message.error("Please Select CGHS/AMA's Reference End Date", '');
    } else {
      this.date1 = '';
      this.expoDiffDays = '';
      var date = this.datepipe.transform(
        this.CGHS_AMA_REFERENCE_DATE,
        'yyyy-MM-dd'
      );
      this.date2 = '';
      this.expoDiffDays = '';
      var enddate = this.datepipe.transform(
        this.CGHS_AMA_REFERENCE_END_DATE,
        'yyyy-MM-dd'
      );

      this.data3.CGHS_AMA_REFERENCE_DATE.push(date);
      this.CGHS_AMA_REFERENCE_DATE = null;

      this.data3.CGHS_AMA_REFERENCE_END_DATE.push(enddate);
      this.CGHS_AMA_REFERENCE_END_DATE = null;

      this.date1 = new Date(
        Math.max.apply(
          null,
          this.data3.CGHS_AMA_REFERENCE_END_DATE.map(function (e) {
            return new Date(e);
          })
        )
      );
      var date2: any = new Date(this.data2.BILL_FILIING_DATE);
      //

      this.expoDiffDays = Math.floor(
        (date2 - this.date1) / (1000 * 60 * 60 * 24)
      );

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
          this.message.error("Can't Load Employee Data", '');
        }
      }),
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

  emergencySwitch(event) {
    if (event == true) {
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN = false;
      this.data3.CGHS_AMA_REFERENCE_DATE = [];
      this.data3.IS_PERMISSION_TAKEN_FROM_HOD = false;
      this.data3.HOD_PERMISSION_DATE = null;
      this.data3.HOD_PERMISSION_NO = '';
    } else {
      this.data3.DOCTOR_EMERGENCY_CERTIFICATE_TAKEN = false;
    }
  }

  doctorSwitch(event) {
    if (event == true) {
      this.data3.EXPO_FACTO_PERMISSION = false;
      this.data3.EXPO_FACTO_DATE = null;
      this.data3.EXPO_FACTO_REFERENCE_NO = '';
    } else {
    }
  }

  checkDateDiff() {
    //

    if (
      this.data3.CGHS_AMA_REFERENCE_DATE != undefined ||
      this.data3.CGHS_AMA_REFERENCE_DATE != null ||
      this.data3.CGHS_AMA_REFERENCE_DATE != '' ||
      this.data3.CGHS_AMA_REFERENCE_DATE.length != 0
    ) {
      //

      // this.data3.CGHS_AMA_REFERENCE_DATE =
      //   this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
      // this.dateDifference()
      this.date1 = new Date(
        Math.max.apply(
          null,
          this.data3.CGHS_AMA_REFERENCE_DATE.map(function (e) {
            return new Date(e);
          })
        )
      );
      var date2: any = new Date(this.data2.BILL_FILIING_DATE);
      //
      //

      this.expoDiffDays = Math.floor(
        (date2 - this.date1) / (1000 * 60 * 60 * 24)
      );
    } else {
      //
    }
    if (
      this.data3.EMERGENCY_TREATEMENT == false &&
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      this.expoDiffDays < 30
    ) {
      // this.onChangeExpoFacto(false);
      this.data3.EXPO_FACTO_PERMISSION = false;
      this.data3.EXPO_FACTO_DATE = null;
      this.data3.EXPO_FACTO_REFERENCE_NO = '';
    } else {
    }
  }

  HOSPITAL_ADDRESS;
  HOSPITAL_TYPE;
  HOSPITAL_NAME;
  HOSPITAL_ID;
  hospitalMapList: any = [];
  addHospital(addNew: boolean, hospitalFormReset: NgForm) {
    this.hospitalData.CLAIM_ID = this.claimID;
    this.isSpinning = false;
    this.isOk = true;
    // if(this.hospitalData.HOSPITAL_ID !=undefined || this.hospitalData.HOSPITAL_ID !=null){

    // }
    if (
      this.hospitalData.TYPE == '' &&
      this.hospitalData.ADDRESS == '' &&
      this.hospitalData.ACCREDATION == ''
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.hospitalData.TYPE == null ||
      this.hospitalData.TYPE.trim() == '' ||
      this.hospitalData.TYPE == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Hospital Type.', '');
    } else if (
      this.hospitalData.TYPE == 'E' &&
      (this.hospitalData.HOSPITAL_ID == undefined ||
        this.hospitalData.HOSPITAL_ID == null)
    ) {
      this.isOk = false;
      this.message.error('Please Select Hospital Name ', '');
    } else if (
      (this.hospitalData.TYPE == 'NE' || this.hospitalData.TYPE == 'G') &&
      (this.hospitalData.NAME == undefined ||
        this.hospitalData.NAME == null ||
        this.hospitalData.NAME == '')
    ) {
      this.isOk = false;
      this.message.error('Please Enter Hospital Name ', '');
    } else if (
      this.hospitalData.ADDRESS == undefined ||
      this.hospitalData.ADDRESS == null ||
      this.hospitalData.ADDRESS == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Hospital Address ', '');
    } else if (
      this.hospitalData.ACCREDATION == undefined ||
      this.hospitalData.ACCREDATION == null ||
      this.hospitalData.ACCREDATION == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Accreditation ', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.hospitalData.ID) {
          this.api
            .updateHospitalMapping(this.hospitalData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Changed Successfully...', '');
                hospitalFormReset.form.reset();
                this.resetDrawer(hospitalFormReset);
                // this.hospitalData.TYPE = null;
                // this.hospitalData.HOSPITAL_ID = null;
                // this.hospitalData.NAME = '';
                // this.hospitalData.ADDRESS = '';
                // this.hospitalData.ACCREDATION = '';
                this.api
                  .getHospitalMapping(
                    0,
                    0,
                    '',
                    '',
                    ' AND CLAIM_ID = ' + this.claimID
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.hospitalMapList = data['data'];
                        this.isSpinning = false;
                      } else {
                        this.message.error(
                          "Can't Load Hospital Mapped Data.",
                          ''
                        );
                        this.isSpinning = false;
                      }
                    },
                    (err) => {}
                  );
                // if (!addNew)
                // this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createHospitalMapping(this.hospitalData)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                // if (!addNew)
                // this.drawerClose();
                // else {
                //   this.hospitalData = new HospitalMappingMaster();
                //   // this.resetDrawer(claimMasterPage);
                //   // this.data.IMG_URL= '';

                //   // this.api.getEmployeeMaster(0, 0, '', 'desc', '').subscribe(
                //   //   (data) => {
                //       // if (data['count']==0){
                //       //   this.data.SEQUENCE_NUMBER=1;
                //       // }else
                //       // {
                //       //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                //       // }
                //     // },
                //     // (err) => {
                //     //
                //     // }
                //   // );
                // }
                // this.hospitalData.TYPE = null;
                // this.hospitalData.HOSPITAL_ID = null;
                // this.hospitalData.NAME = '';
                // this.hospitalData.ADDRESS = '';
                // this.hospitalData.ACCREDATION = '';
                hospitalFormReset.form.reset();
                this.resetDrawer(hospitalFormReset);
                this.api
                  .getHospitalMapping(
                    0,
                    0,
                    '',
                    '',
                    ' AND CLAIM_ID = ' + this.claimID
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.hospitalMapList = data['data'];
                        this.isSpinning = false;
                      } else {
                        this.message.error(
                          "Can't Load Hospital Mapped Data.",
                          ''
                        );
                        this.isSpinning = false;
                      }
                    },
                    (err) => {}
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

  editHospital(data: any): void {
    // this.drawerTitle = 'Edit Claim Details';
    this.hospitalData = Object.assign({}, data);
  }

  cancel(): void {}

  resetDrawer(hospitalFormReset: NgForm) {
    this.hospitalData = new HospitalMappingMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    // hospitalFormReset.form.markAsPristine();
    // hospitalFormReset.form.markAsUntouched();
  }

  employeeSearch(event: any) {
    //
    //
    // this.procedureList2 = [];
    var f = '';
    if (event.target.value.length >= 3) {
      this.api
        .getEmployeeMaster(
          0,
          0,
          '',
          'asc',
          " AND NAME like '%" +
            event.target.value +
            "%'" +
            " OR EMPLOYEE_CODE like '%" +
            event.target.value +
            "%'" +
            " OR OFFICE_NAME like '%" +
            event.target.value +
            "%'" +
            " OR DESIGNATION like '%" +
            event.target.value +
            "%'" +
            " OR DDO_OF_THE_OFFICIAL like '%" +
            event.target.value +
            "%'" +
            f
        )
        .subscribe(
          (empData) => {
            if (empData['code'] == 200) {
              var filteredOptions = empData['data'];

              // this.employee = [...[], ...empData['data']];

              // this.empLoader = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              // this.empLoader = false;
            }
          },
          (err) => {}
        );
    } else {
    }
    // this.api
    //   .getinvestigationprocedure(
    //     0,
    //     0,
    //     'NAME',
    //     'asc',
    //     " and NAME like '%" + event + "%'" + f
    //   )
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200 && data['data'].length > 0)
    //         this.procedureList2 = data['data'];
    //       else this.procedureList2 = [];
    //     },
    //     (err) => {
    //
    //       this.isSpinning = false;
    //     }
    //   );
    // }
  }
  pressCS(event) {
    if (event == 'CS') {
      this.data.CGHS_CARD_VALIDITY = '';
      this.data.CGHS_CARD_NO = '';
    } else {
    }
  }
  clearRemark(event) {
    if (event == 'A') {
      this.data4.REJECT_REMARK = null;
      this.data4.ON_HOLD_REMARK = null;
      this.data4.ON_HOLD_DATE = null;
    } else if (event == 'R') {
      this.data4.ON_HOLD_REMARK = null;
      this.data4.ON_HOLD_DATE = null;
    } else {
      this.data4.REJECT_REMARK = null;
    }
  }

  orderSheetVisible: boolean = false;
  orderSheetTitle: string = '';
  orderValue: any = '';
  orderSheet() {
    this.orderValue = '';
    this.orderSheetTitle = 'Order Sheet';
    this.orderSheetVisible = true;
    // this.orderValue = 1;
  }
  permissionLetter() {
    this.orderValue = '';
    this.orderSheetTitle = 'Permission Letter';
    this.orderSheetVisible = true;
    // this.orderValue = 2;
  }

  orderSheetClose(): void {
    this.orderSheetVisible = false;
  }

  get orderSheetCloseCallback() {
    return this.orderSheetClose.bind(this);
  }
  HospitalMapping: any = [];
  queData: any = [];
  empID1;
  claimID1;
  // delayOrderSheetVisible: boolean = false;
  // delayOrderSheetTitle: string = '';
  // delayOrderSheet() {
  //   this.isSpinning = true;
  //   this.claimID1 = '';
  //   this.empID1 = '';
  //   this.delayOrderSheetTitle = 'Order Letter';
  //   this.isOk = true;
  //   if (this.isOk) {
  //     this.isSpinning = true;
  //     this.data3.DELAY_CONDOLENCE_DATE = this.datepipe.transform(
  //       this.data3.DELAY_CONDOLENCE_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.EXPOST_FACTO_PERMISSION_DATE = this.datepipe.transform(
  //       this.data3.EXPOST_FACTO_PERMISSION_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.EXPO_FACTO_DATE = this.datepipe.transform(
  //       this.data3.EXPO_FACTO_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(
  //       this.data3.HOD_PERMISSION_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(
  //       this.data3.HOD_PERMISSION_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     if (
  //       this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
  //       this.data3.CGHS_AMA_REFERENCE_DATE == null &&
  //       this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
  //     ) {
  //       this.data3.CGHS_AMA_REFERENCE_DATE = '';
  //     } else {
  //       this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
  //     }
  //     if (
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
  //     ) {
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
  //     } else {
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE =
  //         this.data3.CGHS_AMA_REFERENCE_END_DATE;
  //     }

  //     if (
  //       this.data3.BILL_FILLED_INTIME == false &&
  //       (this.data3.DELAY_CONDOLENCE_DATE != undefined ||
  //         this.data3.DELAY_CONDOLENCE_DATE != null)
  //     ) {
  //       this.data3.DELAY_CONDOLENCE_DATE = this.data3.DELAY_CONDOLENCE_DATE;
  //     } else {
  //       this.data3.DELAY_CONDOLENCE_DATE = null;
  //     }
  //     if (
  //       this.data3.BILL_FILLED_INTIME == false &&
  //       (this.data3.DELAY_CONDOLENCE_NUMBER != undefined ||
  //         this.data3.DELAY_CONDOLENCE_NUMBER != null)
  //     ) {
  //       this.data3.DELAY_CONDOLENCE_NUMBER = this.data3.DELAY_CONDOLENCE_NUMBER;
  //     } else {
  //       this.data3.DELAY_CONDOLENCE_NUMBER = '';
  //     }
  //     {
  //       if (this.data3.ID) {
  //         this.api.updateQuestions(this.data3).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             // this.message.success('Information Changed Successfully...', '');
  //             this.api
  //               .getclaimMaster(
  //                 0,
  //                 0,
  //                 '',
  //                 '',
  //                 ' AND ID=' + this.claimID,
  //                 '',
  //                 '',
  //                 '',
  //                 ''
  //               )
  //               .subscribe(
  //                 (data) => {
  //                   if (data['code'] == 200) {
  //
  //                     this.orderdata1 = data['data'][0];
  //                     this.claimID1 = data['data'][0]['ID'];
  //                     this.empID1 = data['data'][0]['EMP_ID'];
  //

  //                     this.api
  //                       .getHospitalMapping(
  //                         0,
  //                         0,
  //                         '',
  //                         '',
  //                         ' AND CLAIM_ID = ' + this.claimID
  //                       )
  //                       .subscribe(
  //                         (data) => {
  //                           if (data['code'] == 200) {
  //                             this.HospitalMapping = data['data'];
  //

  //                             // this.isSpinning = false;
  //                             this.api
  //                               .getAllQuestions(
  //                                 0,
  //                                 0,
  //                                 '',
  //                                 '',
  //                                 ' AND CLAIM_ID =' + this.claimID
  //                               )
  //                               .subscribe(
  //                                 (data) => {
  //                                   if (data['code'] == 200) {
  //                                     if (data['data'].length == 0) {
  //                                       this.queData = new QuestionaryMaster();
  //                                     } else {
  //                                       this.queData = data['data'][0];
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == '' &&
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           '' &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                     }
  //                                   } else {
  //                                     this.message.error(
  //                                       'Something Went Wrong',
  //                                       ''
  //                                     );
  //                                     // this.isSpinning = false;
  //                                   }
  //                                 },
  //                                 (err) => {
  //
  //                                 }
  //                               );
  //                           } else {
  //                             this.message.error('Something Went Wrong', '');
  //                             // this.isSpinning = false;
  //                           }
  //                         },
  //                         (err) => {
  //
  //                         }
  //                       );
  //                   } else {
  //                     this.message.error("Can't Load Data", '');
  //                   }
  //                 },
  //                 (err) => {
  //
  //                 }
  //               );
  //             this.isSpinning = false;
  //             this.delayOrderSheetVisible = true;
  //           } else {
  //             this.message.error('Information Has Not Changed...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       } else {
  //         this.api.createQuestions(this.data3).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             // this.message.success('Information Save Successfully...', '');
  //             this.api
  //               .getclaimMaster(
  //                 0,
  //                 0,
  //                 '',
  //                 '',
  //                 ' AND ID=' + this.claimID,
  //                 '',
  //                 '',
  //                 '',
  //                 ''
  //               )
  //               .subscribe(
  //                 (data) => {
  //                   if (data['code'] == 200) {
  //
  //                     this.orderdata1 = data['data'][0];
  //                     this.claimID1 = data['data'][0]['ID'];
  //                     this.empID1 = data['data'][0]['EMP_ID'];
  //
  //                     this.api
  //                       .getHospitalMapping(
  //                         0,
  //                         0,
  //                         '',
  //                         '',
  //                         ' AND CLAIM_ID = ' + this.claimID
  //                       )
  //                       .subscribe(
  //                         (data) => {
  //                           if (data['code'] == 200) {
  //                             this.HospitalMapping = data['data'];
  //
  //

  //                             // this.isSpinning = false;
  //                             this.api
  //                               .getAllQuestions(
  //                                 0,
  //                                 0,
  //                                 '',
  //                                 '',
  //                                 ' AND CLAIM_ID =' + this.claimID
  //                               )
  //                               .subscribe(
  //                                 (data) => {
  //                                   if (data['code'] == 200) {
  //                                     if (data['data'].length == 0) {
  //                                       this.queData = new QuestionaryMaster();
  //                                     } else {
  //                                       this.queData = data['data'][0];
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == '' &&
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           '' &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                     }
  //                                   } else {
  //                                     this.message.error(
  //                                       'Something Went Wrong',
  //                                       ''
  //                                     );
  //                                     this.isSpinning = false;
  //                                   }
  //                                 },
  //                                 (err) => {
  //
  //                                 }
  //                               );
  //                           } else {
  //                             this.message.error('Something Went Wrong', '');
  //                             // this.isSpinning = false;
  //                           }
  //                         },
  //                         (err) => {
  //
  //                         }
  //                       );
  //                   } else {
  //                     this.message.error("Can't Load Data", '');
  //                   }
  //                 },
  //                 (err) => {
  //
  //                 }
  //               );
  //             this.delayOrderSheetVisible = true;
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error('Failed To Fill Information...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       }
  //     }
  //   }
  //   this.orderdata1 = [];
  // }

  // delayOrderSheetClose(): void {
  //   // this.delayOrderSheetVisible = false;
  //   this.disableReferanceDate();
  //   this.api
  //     .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           if (data['data'].length == 0) {
  //             this.data3 = new QuestionaryMaster();
  //             this.billInTime();
  //             this.empanelledHospital();
  //             // this.current = 2;
  //             this.delayOrderSheetVisible = false;
  //             this.isSpinning = false;
  //           } else {
  //             this.data3 = data['data'][0];
  //             this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
  //             this.drCertificate =
  //               data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
  //             this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
  //             this.expoFacto = data['data'][0]['EXPO_FACTO_PERMISSION'];
  //             this.referanceTaken =
  //               data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
  //             this.hodPermission =
  //               data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
  //             if (
  //               this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
  //               this.data3.CGHS_AMA_REFERENCE_DATE == null &&
  //               this.data3.CGHS_AMA_REFERENCE_DATE == '' &&
  //               this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
  //             ) {
  //               this.data3.CGHS_AMA_REFERENCE_DATE = [];
  //             } else {
  //               this.data3.CGHS_AMA_REFERENCE_DATE =
  //                 this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
  //               this.dateDifference();
  //             }
  //             if (
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE == '' &&
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
  //             ) {
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
  //             } else {
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE =
  //                 this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
  //               this.dateDifference();
  //             }
  //             this.calculateDiff();
  //             this.billInTime();
  //             this.empanelledHospital();
  //             // this.current = 2;
  //             this.isSpinning = false;
  //             this.delayOrderSheetVisible = false;
  //           }
  //         } else {
  //           this.message.error('Something Went Wrong', '');
  //           this.isSpinning = false;
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

  delayOrderSheetCloseNew(): void {
    this.api
      .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              this.data3 = new QuestionaryMaster();
              this.billInTime();
              this.empanelledHospital();
              this.delayOrderSheetnewVisible = false;
              this.isSpinning = false;
            } else {
              this.data3 = data['data'][0];
              this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
              this.drCertificate =
                data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
              this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
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
                // this.dateDifference();
              }
              if (
                this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE == null ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE == '' ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_END_DATE =
                  this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
                this.dateDifference();
              }
              // this.calculateDiff();
              this.billInTime();
              this.empanelledHospital();
              this.delayOrderSheetnewVisible = false;
              this.isSpinning = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }
  get delayOrderSheetCloseCallback() {
    return this.delayOrderSheetCloseNew.bind(this);
  }

  // delayPermissionVisible: boolean = false;
  // delayPermissionTitle: string = '';
  // delayPermissionData: any = [];
  // delayPermissionClaimData = [];
  // delayPermission() {
  //   this.delayPermissionTitle = 'Permission Letter';
  //   this.delayPermissionVisible = true;
  //   if (this.isOk) {
  //     this.isSpinning = true;
  //     this.data3.DELAY_CONDOLENCE_DATE = this.datepipe.transform(
  //       this.data3.DELAY_CONDOLENCE_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.EXPOST_FACTO_PERMISSION_DATE = this.datepipe.transform(
  //       this.data3.EXPOST_FACTO_PERMISSION_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.EXPO_FACTO_DATE = this.datepipe.transform(
  //       this.data3.EXPO_FACTO_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(
  //       this.data3.HOD_PERMISSION_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     this.data3.HOD_PERMISSION_DATE = this.datepipe.transform(
  //       this.data3.HOD_PERMISSION_DATE,
  //       'yyyy-MM-dd'
  //     );
  //     if (
  //       this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
  //       this.data3.CGHS_AMA_REFERENCE_DATE == null &&
  //       this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
  //     ) {
  //       this.data3.CGHS_AMA_REFERENCE_DATE = '';
  //     } else {
  //       this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
  //     }
  //     if (
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
  //     ) {
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
  //     } else {
  //       this.data3.CGHS_AMA_REFERENCE_END_DATE =
  //         this.data3.CGHS_AMA_REFERENCE_END_DATE;
  //     }

  //     if (
  //       this.data3.BILL_FILLED_INTIME == false &&
  //       (this.data3.DELAY_CONDOLENCE_DATE != undefined ||
  //         this.data3.DELAY_CONDOLENCE_DATE != null)
  //     ) {
  //       this.data3.DELAY_CONDOLENCE_DATE = this.data3.DELAY_CONDOLENCE_DATE;
  //     } else {
  //       this.data3.DELAY_CONDOLENCE_DATE = null;
  //     }
  //     if (
  //       this.data3.BILL_FILLED_INTIME == false &&
  //       (this.data3.DELAY_CONDOLENCE_NUMBER != undefined ||
  //         this.data3.DELAY_CONDOLENCE_NUMBER != null)
  //     ) {
  //       this.data3.DELAY_CONDOLENCE_NUMBER = this.data3.DELAY_CONDOLENCE_NUMBER;
  //     } else {
  //       this.data3.DELAY_CONDOLENCE_NUMBER = '';
  //     }
  //     {
  //       if (this.data3.ID) {
  //         this.api.updateQuestions(this.data3).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             // this.message.success('Information Changed Successfully...', '');
  //             this.api
  //               .getclaimMaster(
  //                 0,
  //                 0,
  //                 '',
  //                 '',
  //                 ' AND ID=' + this.claimID,
  //                 '',
  //                 '',
  //                 '',
  //                 ''
  //               )
  //               .subscribe(
  //                 (data) => {
  //                   if (data['code'] == 200) {
  //
  //                     this.orderdata1 = data['data'][0];
  //                     this.claimID1 = data['data'][0]['ID'];
  //                     this.empID1 = data['data'][0]['EMP_ID'];
  //

  //                     this.api
  //                       .getHospitalMapping(
  //                         0,
  //                         0,
  //                         '',
  //                         '',
  //                         ' AND CLAIM_ID = ' + this.claimID
  //                       )
  //                       .subscribe(
  //                         (data) => {
  //                           if (data['code'] == 200) {
  //                             this.HospitalMapping = data['data'];
  //

  //                             // this.isSpinning = false;
  //                             this.api
  //                               .getAllQuestions(
  //                                 0,
  //                                 0,
  //                                 '',
  //                                 '',
  //                                 ' AND CLAIM_ID =' + this.claimID
  //                               )
  //                               .subscribe(
  //                                 (data) => {
  //                                   if (data['code'] == 200) {
  //                                     if (data['data'].length == 0) {
  //                                       this.queData = new QuestionaryMaster();
  //                                     } else {
  //                                       this.queData = data['data'][0];
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == '' &&
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           '' &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                     }
  //                                   } else {
  //                                     this.message.error(
  //                                       'Something Went Wrong',
  //                                       ''
  //                                     );
  //                                     // this.isSpinning = false;
  //                                   }
  //                                 },
  //                                 (err) => {
  //
  //                                 }
  //                               );
  //                           } else {
  //                             this.message.error('Something Went Wrong', '');
  //                             // this.isSpinning = false;
  //                           }
  //                         },
  //                         (err) => {
  //
  //                         }
  //                       );
  //                   } else {
  //                     this.message.error("Can't Load Data", '');
  //                   }
  //                 },
  //                 (err) => {
  //
  //                 }
  //               );
  //             this.isSpinning = false;
  //             this.delayPermissionVisible = true;
  //           } else {
  //             this.message.error('Information Has Not Changed...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       } else {
  //         this.api.createQuestions(this.data3).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             // this.message.success('Information Save Successfully...', '');
  //             this.api
  //               .getclaimMaster(
  //                 0,
  //                 0,
  //                 '',
  //                 '',
  //                 ' AND ID=' + this.claimID,
  //                 '',
  //                 '',
  //                 '',
  //                 ''
  //               )
  //               .subscribe(
  //                 (data) => {
  //                   if (data['code'] == 200) {
  //
  //                     this.orderdata1 = data['data'][0];
  //                     this.claimID1 = data['data'][0]['ID'];
  //                     this.empID1 = data['data'][0]['EMP_ID'];
  //
  //                     this.api
  //                       .getHospitalMapping(
  //                         0,
  //                         0,
  //                         '',
  //                         '',
  //                         ' AND CLAIM_ID = ' + this.claimID
  //                       )
  //                       .subscribe(
  //                         (data) => {
  //                           if (data['code'] == 200) {
  //                             this.HospitalMapping = data['data'];
  //
  //

  //                             // this.isSpinning = false;
  //                             this.api
  //                               .getAllQuestions(
  //                                 0,
  //                                 0,
  //                                 '',
  //                                 '',
  //                                 ' AND CLAIM_ID =' + this.claimID
  //                               )
  //                               .subscribe(
  //                                 (data) => {
  //                                   if (data['code'] == 200) {
  //                                     if (data['data'].length == 0) {
  //                                       this.queData = new QuestionaryMaster();
  //                                     } else {
  //                                       this.queData = data['data'][0];
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_DATE == '' &&
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                       if (
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           undefined &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           null &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE ==
  //                                           '' &&
  //                                         this.queData
  //                                           .CGHS_AMA_REFERENCE_END_DATE
  //                                           .length == 0
  //                                       ) {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           [];
  //                                       } else {
  //                                         this.queData.CGHS_AMA_REFERENCE_END_DATE =
  //                                           this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
  //                                             ','
  //                                           );
  //                                       }
  //                                     }
  //                                   } else {
  //                                     this.message.error(
  //                                       'Something Went Wrong',
  //                                       ''
  //                                     );
  //                                     this.isSpinning = false;
  //                                   }
  //                                 },
  //                                 (err) => {
  //
  //                                 }
  //                               );
  //                           } else {
  //                             this.message.error('Something Went Wrong', '');
  //                             // this.isSpinning = false;
  //                           }
  //                         },
  //                         (err) => {
  //
  //                         }
  //                       );
  //                   } else {
  //                     this.message.error("Can't Load Data", '');
  //                   }
  //                 },
  //                 (err) => {
  //
  //                 }
  //               );
  //             this.delayPermissionVisible = true;
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error('Failed To Fill Information...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       }
  //     }
  //   }
  //   this.orderdata1 = [];
  // }

  // delayPermissionClose(): void {
  //   this.api
  //     .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           if (data['data'].length == 0) {
  //             this.data3 = new QuestionaryMaster();
  //             this.billInTime();
  //             this.empanelledHospital();
  //             this.delayPermissionVisible = false;
  //             this.isSpinning = false;
  //           } else {
  //             this.data3 = data['data'][0];
  //             this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
  //             this.drCertificate =
  //               data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
  //             this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
  //             this.expoFacto = data['data'][0]['EXPO_FACTO_PERMISSION'];
  //             this.referanceTaken =
  //               data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
  //             this.hodPermission =
  //               data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
  //             if (
  //               this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
  //               this.data3.CGHS_AMA_REFERENCE_DATE == null ||
  //               this.data3.CGHS_AMA_REFERENCE_DATE == '' ||
  //               this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
  //             ) {
  //               this.data3.CGHS_AMA_REFERENCE_DATE = [];
  //             } else {
  //               this.data3.CGHS_AMA_REFERENCE_DATE =
  //                 this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
  //               // this.dateDifference();
  //             }
  //             if (
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined ||
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE == null ||
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE == '' ||
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
  //             ) {
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
  //             } else {
  //               this.data3.CGHS_AMA_REFERENCE_END_DATE =
  //                 this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
  //               this.dateDifference();
  //             }
  //             // this.calculateDiff();
  //             this.billInTime();
  //             this.empanelledHospital();
  //             this.delayPermissionVisible = false;
  //             this.isSpinning = false;
  //           }
  //         } else {
  //           this.message.error('Something Went Wrong', '');
  //           this.isSpinning = false;
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

  get delayPermissionCloseCallback() {
    return this.delayPermissionClosenew.bind(this);
  }

  delayPermissionVisiblenew: any;
  delayPermissionTitlenew: any;
  delayOrderSheetnewVisible: any;
  delayOrderSheetnewTitle: any;
  orderdata: any = [];

  delayOrderSheetnew() {
    this.delayOrderSheetnewTitle = 'Delay Order Sheet';
    // this.delayOrderSheetnewVisible = true;
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    if (this.isOk) {
      this.isSpinning = true;
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
      if (
        this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      }
      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                      this.delayOrderSheetnewVisible = true;
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      // this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                      this.delayOrderSheetnewVisible = true;
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
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
    this.orderdata1 = [];
  }

  delayOrderSheetnewClose(): void {
    this.delayOrderSheetnewVisible = false;
  }
  delayPermissionClosenew(): void {
    this.delayPermissionVisiblenew = false;
  }
  SECTION_TYPE: any;
  permissionnewLetter() {
    this.delayPermissionTitlenew = 'Delay Permission Letter';
    // this.delayPermissionVisiblenew = true;
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    if (this.isOk) {
      this.isSpinning = true;
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
      if (
        this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      }
      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      // this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.isSpinning = false;
              this.delayPermissionVisiblenew = true;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.delayPermissionVisiblenew = true;
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
    this.orderdata1 = [];
  }

  refExpoOrderVisible: boolean = false;
  refExpoOrderTitle: string = '';
  refExpoOrderSheet() {
    this.refExpoOrderTitle = 'Referance Expo Facto Order Sheet';
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    this.isOk = true;
    if (this.isOk) {
      this.isSpinning = true;
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
      if (
        this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      }
      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      // this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.isSpinning = false;
              this.refExpoOrderVisible = true;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.refExpoOrderVisible = true;
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

  refExpoOrderClose(): void {
    // this.refExpoOrderVisible = false;
    this.api
      .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              this.data3 = new QuestionaryMaster();
              this.billInTime();
              this.empanelledHospital();
              this.refExpoOrderVisible = false;
              this.isSpinning = false;
            } else {
              this.data3 = data['data'][0];
              this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
              this.drCertificate =
                data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
              this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
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
                // this.dateDifference();
              }
              if (
                this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE == null ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE == '' ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_END_DATE =
                  this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
                this.dateDifference();
              }
              // this.calculateDiff();
              this.billInTime();
              this.empanelledHospital();
              this.refExpoOrderVisible = false;
              this.isSpinning = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  get refExpoOrderCloseCallback() {
    return this.refExpoOrderClose.bind(this);
  }

  refExpoPermissionLetterVisible: boolean = false;
  refExpoPermissionLetterTitle: string = '';
  refExpoPermissionLetter() {
    this.refExpoOrderTitle = 'Referance Expo Facto Order Sheet';
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    this.isOk = true;
    if (this.isOk) {
      this.isSpinning = true;
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
      if (
        this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      }
      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      // this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.isSpinning = false;
              this.refExpoPermissionLetterVisible = true;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.refExpoPermissionLetterVisible = true;
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

  refExpoPermissionLetterClose(): void {
    // this.refExpoPermissionLetterVisible = false;
    this.api
      .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              this.data3 = new QuestionaryMaster();
              this.billInTime();
              this.empanelledHospital();
              this.refExpoPermissionLetterVisible = false;
              this.isSpinning = false;
            } else {
              this.data3 = data['data'][0];
              this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
              this.drCertificate =
                data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
              this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
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
                // this.dateDifference();
              }
              if (
                this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE == null ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE == '' ||
                this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_END_DATE =
                  this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
                this.dateDifference();
              }
              // this.calculateDiff();
              this.billInTime();
              this.empanelledHospital();
              this.refExpoPermissionLetterVisible = false;
              this.isSpinning = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  get refExpoPermissionLetterCloseCallback() {
    return this.refExpoPermissionLetterClose.bind(this);
  }

  refhodorderVisible: boolean = false;
  refhodorderSheetTitle: string = '';
  refHODOrderSheet() {
    this.isSpinning = true;
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    this.refhodorderSheetTitle = 'Referance HOD Order Letter';
    this.isOk = true;
    if (this.isOk) {
      this.isSpinning = true;
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
      if (
        this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      }
      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      // this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.isSpinning = false;
              this.refhodorderVisible = true;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.refhodorderVisible = true;
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
    this.orderdata1 = [];
  }

  refhodorderSheetClose(): void {
    // this.delayOrderSheetVisible = false;
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
              // this.current = 2;
              this.refhodorderVisible = false;
              this.isSpinning = false;
            } else {
              this.data3 = data['data'][0];
              this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
              this.drCertificate =
                data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
              this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
              this.expoFacto = data['data'][0]['EXPO_FACTO_PERMISSION'];
              this.referanceTaken =
                data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
              this.hodPermission =
                data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
              if (
                this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
                this.data3.CGHS_AMA_REFERENCE_DATE == null &&
                this.data3.CGHS_AMA_REFERENCE_DATE == '' &&
                this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_DATE =
                  this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
                this.dateDifference();
              }
              if (
                this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
                this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
                this.data3.CGHS_AMA_REFERENCE_END_DATE == '' &&
                this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_END_DATE =
                  this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
                this.dateDifference();
              }
              this.calculateDiff();
              this.billInTime();
              this.empanelledHospital();
              // this.current = 2;
              this.isSpinning = false;
              this.refhodorderVisible = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }
  get refhodorderSheetCloseCallback() {
    return this.refhodorderSheetClose.bind(this);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  refhodPermissionVisible: boolean = false;
  refhodPermissionSheetTitle: string = '';
  refHODPermission() {
    this.isSpinning = true;
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    this.refhodPermissionSheetTitle = 'Referance HOD Permission Letter';
    this.isOk = true;
    if (this.isOk) {
      this.isSpinning = true;
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
      if (
        this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_DATE = this.data3.CGHS_AMA_REFERENCE_DATE;
      }
      if (
        this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
        this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
      ) {
        this.data3.CGHS_AMA_REFERENCE_END_DATE = '';
      } else {
        this.data3.CGHS_AMA_REFERENCE_END_DATE =
          this.data3.CGHS_AMA_REFERENCE_END_DATE;
      }

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
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      // this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.isSpinning = false;
              this.refhodPermissionVisible = true;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.api
                .getclaimMaster(
                  0,
                  0,
                  '',
                  '',
                  ' AND ID=' + this.claimID,
                  '',
                  '',
                  '',
                  ''
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.orderdata1 = data['data'][0];
                      this.claimID1 = data['data'][0]['ID'];
                      this.empID1 = data['data'][0]['EMP_ID'];

                      this.api
                        .getSignature(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + data['data'][0]['SIGNATURE_ID']
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.SECTION_TYPE =
                                data['data'][0]['SECTION_TYPE'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          '',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

                              // this.isSpinning = false;
                              this.api
                                .getAllQuestions(
                                  0,
                                  0,
                                  '',
                                  '',
                                  ' AND CLAIM_ID =' + this.claimID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length == 0) {
                                        this.queData = new QuestionaryMaster();
                                      } else {
                                        this.queData = data['data'][0];
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_DATE == '' &&
                                          this.queData.CGHS_AMA_REFERENCE_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_DATE.split(
                                              ','
                                            );
                                        }
                                        if (
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            undefined &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            null &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE ==
                                            '' &&
                                          this.queData
                                            .CGHS_AMA_REFERENCE_END_DATE
                                            .length == 0
                                        ) {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            [];
                                        } else {
                                          this.queData.CGHS_AMA_REFERENCE_END_DATE =
                                            this.queData.CGHS_AMA_REFERENCE_END_DATE.split(
                                              ','
                                            );
                                        }
                                      }
                                    } else {
                                      this.message.error(
                                        'Something Went Wrong',
                                        ''
                                      );
                                      this.isSpinning = false;
                                    }
                                  },
                                  (err) => {}
                                );
                            } else {
                              this.message.error('Something Went Wrong', '');
                              // this.isSpinning = false;
                            }
                          },
                          (err) => {}
                        );
                    } else {
                      this.message.error("Can't Load Data", '');
                    }
                  },
                  (err) => {}
                );
              this.refhodPermissionVisible = true;
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
    this.orderdata1 = [];
  }
  fileURL1: any;
  onFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
    }
  }
  refhodPermissionSheetClose(): void {
    // this.delayOrderSheetVisible = false;
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
              // this.current = 2;
              this.refhodPermissionVisible = false;
              this.isSpinning = false;
            } else {
              this.data3 = data['data'][0];
              this.emergencyTaken = data['data'][0]['EMERGENCY_TREATEMENT'];
              this.drCertificate =
                data['data'][0]['DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'];
              this.empanelHospital = data['data'][0]['IS_HOSPITAL_EMPLANELLED'];
              this.expoFacto = data['data'][0]['EXPO_FACTO_PERMISSION'];
              this.referanceTaken =
                data['data'][0]['REFERENCE_FORM_CGHS_AMA_TAKEN'];
              this.hodPermission =
                data['data'][0]['IS_PERMISSION_TAKEN_FROM_HOD'];
              if (
                this.data3.CGHS_AMA_REFERENCE_DATE == undefined &&
                this.data3.CGHS_AMA_REFERENCE_DATE == null &&
                this.data3.CGHS_AMA_REFERENCE_DATE == '' &&
                this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_DATE =
                  this.data3.CGHS_AMA_REFERENCE_DATE.split(',');
                this.dateDifference();
              }
              if (
                this.data3.CGHS_AMA_REFERENCE_END_DATE == undefined &&
                this.data3.CGHS_AMA_REFERENCE_END_DATE == null &&
                this.data3.CGHS_AMA_REFERENCE_END_DATE == '' &&
                this.data3.CGHS_AMA_REFERENCE_END_DATE.length == 0
              ) {
                this.data3.CGHS_AMA_REFERENCE_END_DATE = [];
              } else {
                this.data3.CGHS_AMA_REFERENCE_END_DATE =
                  this.data3.CGHS_AMA_REFERENCE_END_DATE.split(',');
                this.dateDifference();
              }
              this.calculateDiff();
              this.billInTime();
              this.empanelledHospital();
              // this.current = 2;
              this.isSpinning = false;
              this.refhodPermissionVisible = false;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  confirmDeleteHospital(data: any, i: number) {
    this.relationdata = this.relationdata.filter((item, index) => index != i);

    this.relationdata = [...[], ...this.relationdata];
  }

  index = -1;
  edit1(data: Realtionshipdata, i: any): void {
    this.index = i;
    this.editrelation = Object.assign({}, data);
  }

  FROMACCOUNT: FromTOAccount = new FromTOAccount();
  // addData(addNew: boolean, relation: NgForm) {
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (
  //     this.editrelation.NAME_OF_FAMILY_MEMBER == undefined &&
  //     this.editrelation.AGE == undefined &&
  //     this.editrelation.RELATIONSHIP == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Fill All The Required Fields ', '');
  //   } else if (
  //     this.editrelation.NAME_OF_FAMILY_MEMBER == null ||
  //     this.editrelation.NAME_OF_FAMILY_MEMBER.trim() == '' ||
  //     this.editrelation.NAME_OF_FAMILY_MEMBER == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Name of Family Member.', '');
  //   } else if (
  //     this.editrelation.AGE == undefined ||
  //     this.editrelation.AGE <= 0 ||
  //     this.editrelation.AGE == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Age  ', '');
  //   } else if (
  //     this.editrelation.RELATIONSHIP == null ||
  //     this.editrelation.RELATIONSHIP == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error(
  //       ' Please Select Relationship with the Govt. Servant.',
  //       ''
  //     );
  //   }

  //   if (this.isOk) {
  //     if (this.index > -1) {
  //       this.relationdata[this.index] = Object.assign({}, this.editrelation);
  //     } else {
  //       this.relationdata.push(Object.assign({}, this.editrelation));
  //     }
  //     this.relationdata = [...[], ...this.relationdata];

  //     relation.form.reset();
  //     this.editrelation = new Realtionshipdata();
  //     this.index = -1;
  //   }
  // }

  addData(addNew: boolean, relation: NgForm) {
    this.isSpinning = false;
    this.isOk = true;

    if (
      (this.editrelation.NAME_OF_FAMILY_MEMBER == undefined ||
        this.editrelation.NAME_OF_FAMILY_MEMBER.trim() == '') &&
      (this.editrelation.AGE == undefined || this.editrelation.AGE == 0) &&
      (this.editrelation.RELATIONSHIP == undefined ||
        this.editrelation.RELATIONSHIP.trim() == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.editrelation.NAME_OF_FAMILY_MEMBER == undefined ||
      this.editrelation.NAME_OF_FAMILY_MEMBER.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Name of Family Member.', '');
    } else if (
      this.editrelation.AGE == undefined ||
      this.editrelation.AGE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Age  ', '');
    } else if (
      this.editrelation.RELATIONSHIP == null ||
      this.editrelation.RELATIONSHIP == undefined
    ) {
      this.isOk = false;
      this.message.error(
        ' Please Select Relationship with the Govt. Servant.',
        ''
      );
    } else if (this.index <= 0) {
      var isSelfExisting: any = '';
      var isMotherExisting: any = '';
      var isFatherExisting: any = '';
      isSelfExisting = this.relationdata.some(
        (data) => data.RELATIONSHIP === 'Self'
      );
      isMotherExisting = this.relationdata.some(
        (data) => data.RELATIONSHIP === 'Mother'
      );
      isFatherExisting = this.relationdata.some(
        (data) => data.RELATIONSHIP === 'Father'
      );

      // Check if the current relationship is one of "Self", "Mother", or "Father" and if there's already a record with that relationship
      if (
        (this.editrelation.RELATIONSHIP === 'Self' && isSelfExisting) ||
        (this.editrelation.RELATIONSHIP === 'Mother' && isMotherExisting) ||
        (this.editrelation.RELATIONSHIP === 'Father' && isFatherExisting)
      ) {
        this.isOk = false;
        this.message.error(
          'Only one record with' +
            " '" +
            this.editrelation.RELATIONSHIP +
            "' " +
            ' relationship is allowed.',
          ''
        );
      } else {
        this.isOk = true;
      }
    } else {
      this.isOk = true;
    }

    if (this.isOk) {
      // Check if the relationship is "Self" and if there's already a record with "Self"

      // else {
      // Proceed with adding or updating the record
      this.editrelation.ID = undefined;
      this.editrelation.CLIENT_ID = 1;

      if (this.index > -1) {
        this.relationdata[this.index] = Object.assign({}, this.editrelation);
      } else {
        this.relationdata.push(Object.assign({}, this.editrelation));
      }
      this.relationdata = [...[], ...this.relationdata];

      relation.form.reset();
      this.editrelation = new Realtionshipdata();
      this.index = -1;
      // }
    }
  }

  get refhodPermissionSheetCloseCallback() {
    return this.refhodPermissionSheetClose.bind(this);
  }

  vehicleBroughtClear(event) {
    if (event == true) {
      this.data.VEHICLE_BROUGHT_ROAD_MILEAGE = null;
      this.data.VEHICLE_BROUGHT_ROAD_MILEAGE_KMS = null;
      this.data.VEHICLE_BROUGHT_TOTAL = null;
      this.data.TRAIN_BROUGHT_KMS = null;
      this.data.TRAIN_BROUGHT_CHARGE = null;
    } else {
      this.data.TRUCK_SHIP_CHARGE = null;
      this.data.TRAIN_BROUGHT_FOR_KMS_NO = null;
      this.data.TRAIN_BROUGHT_FOR_CHARGE_NO = null;
    }
  }
  roadMilageTotal(event) {
    if (event != null || event != undefined || event != '') {
      if (
        this.data.VEHICLE_BROUGHT_ROAD_MILEAGE_KMS != undefined ||
        this.data.VEHICLE_BROUGHT_ROAD_MILEAGE_KMS != null ||
        this.data.VEHICLE_BROUGHT_ROAD_MILEAGE_KMS != 0
      ) {
        this.data.VEHICLE_BROUGHT_TOTAL =
          this.data.VEHICLE_BROUGHT_ROAD_MILEAGE_KMS * event;
      } else {
      }
    } else {
    }
  }
  roadKMTotal(event) {
    if (event != null || event != undefined || event != '') {
      if (
        this.data.VEHICLE_BROUGHT_ROAD_MILEAGE != undefined ||
        this.data.VEHICLE_BROUGHT_ROAD_MILEAGE != null ||
        this.data.VEHICLE_BROUGHT_ROAD_MILEAGE != 0
      ) {
        this.data.VEHICLE_BROUGHT_TOTAL =
          this.data.VEHICLE_BROUGHT_ROAD_MILEAGE * event;
      } else {
      }
    } else {
    }
  }

  assumptionFileURL: any;
  progressBarassumptionCharge: boolean = false;
  percentassumptionCharge = 0;
  timerassumptionCharge: any;
  onFileSelectedAssumption(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.assumptionFileURL = <File>event.target.files[0];

      if (this.assumptionFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.assumptionFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.ASSUMPTION_CHARGE != undefined &&
          this.data.ASSUMPTION_CHARGE.trim() != ''
        ) {
          var arr = this.data.ASSUMPTION_CHARGE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarassumptionCharge = true;
      this.timerassumptionCharge = this.api
        .onUpload('assumptionCharge', this.assumptionFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentassumptionCharge = percentDone;
            if (this.percentassumptionCharge == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.ASSUMPTION_CHARGE = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarassumptionCharge = false;
            this.percentassumptionCharge = 0;
            this.assumptionFileURL = null;
            this.data.ASSUMPTION_CHARGE = null;
          }

          // if (successCode.code == '200') {
          //   this.data.ASSUMPTION_CHARGE = url;
          //   this.data.ASSUMPTION_CHARGE_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;

          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.assumptionFileURL = null;
      this.data.ASSUMPTION_CHARGE = null;
    }
  }

  LPCFileURL: any;
  progressBarlpc: boolean = false;
  percentlpc = 0;
  timerlpc: any;
  onFileSelectedLPC(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.LPCFileURL = <File>event.target.files[0];

      if (this.LPCFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LPCFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (this.data.LPC != undefined && this.data.LPC.trim() != '') {
          var arr = this.data.LPC.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarlpc = true;
      this.timerlpc = this.api
        .onUpload('lpc', this.LPCFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentlpc = percentDone;
            if (this.percentlpc == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.LPC = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarlpc = false;
            this.percentlpc = 0;
            this.LPCFileURL = null;
            this.data.LPC = null;
          }

          // if (successCode.code == '200') {
          //   this.data.LPC = url;
          //   this.data.LPC_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;

          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LPCFileURL = null;
      this.data.LPC = null;
    }
  }

  mandateFormFileURL: any;
  progressBarmandateForm: boolean = false;
  percentmandateForm = 0;
  timermandateForm: any;
  onFileSelectedMandateForm(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.mandateFormFileURL = <File>event.target.files[0];

      if (this.mandateFormFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.mandateFormFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.MANDATE_FORM != undefined &&
          this.data.MANDATE_FORM.trim() != ''
        ) {
          var arr = this.data.MANDATE_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarmandateForm = true;
      this.timermandateForm = this.api
        .onUpload('mandateForm', this.mandateFormFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentmandateForm = percentDone;
            if (this.percentmandateForm == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.MANDATE_FORM = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarmandateForm = false;
            this.percentmandateForm = 0;
            this.mandateFormFileURL = null;
            this.data.MANDATE_FORM = null;
          }

          // if (successCode.code == '200') {
          //   this.data.MANDATE_FORM = url;
          //   this.data.MANDATE_FORM_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.mandateFormFileURL = null;
      this.data.MANDATE_FORM = null;
    }
  }

  transferFileURL: any;
  progressBartransferServiceCertificate: boolean = false;
  percenttransferServiceCertificate = 0;
  timertransferServiceCertificate: any;
  onFileSelectedTransfer(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.transferFileURL = <File>event.target.files[0];

      if (this.transferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE != undefined &&
          this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE.trim() != ''
        ) {
          var arr = this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBartransferServiceCertificate = true;
      this.timertransferServiceCertificate = this.api
        .onUpload('transferServiceCertificate', this.transferFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttransferServiceCertificate = percentDone;
            if (this.percenttransferServiceCertificate == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartransferServiceCertificate = false;
            this.percenttransferServiceCertificate = 0;
            this.transferFileURL = null;
            this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = null;
          }

          // if (successCode.code == '200') {
          //   this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = url;
          //   this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = null;
    }
  }

  ticketPassFileURL: any;
  progressBarticketBoardingPass: boolean = false;
  percentticketBoardingPass = 0;
  timerticketBoardingPass: any;
  onFileSelectedTicketPass(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.ticketPassFileURL = <File>event.target.files[0];

      if (this.ticketPassFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.ticketPassFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TICKET_BOARDING_PASS != undefined &&
          this.data.TICKET_BOARDING_PASS.trim() != ''
        ) {
          var arr = this.data.TICKET_BOARDING_PASS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarticketBoardingPass = true;
      this.timerticketBoardingPass = this.api
        .onUpload('ticketBoardingPass', this.ticketPassFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentticketBoardingPass = percentDone;
            if (this.percentticketBoardingPass == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.TICKET_BOARDING_PASS = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarticketBoardingPass = false;
            this.percentticketBoardingPass = 0;
            this.ticketPassFileURL = null;
            this.data.TICKET_BOARDING_PASS = null;
          }

          // if (successCode.code == '200') {
          //   this.data.TICKET_BOARDING_PASS = url;
          //   this.data.TICKET_BOARDING_PASS_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.ticketPassFileURL = null;
      this.data.TICKET_BOARDING_PASS = null;
    }
  }

  transportationBillFileURL: any;
  progressBartransportationBills: boolean = false;
  percenttransportationBills = 0;
  timertransportationBills: any;
  onFileSelectedTransportationBill(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.transportationBillFileURL = <File>event.target.files[0];

      if (this.transportationBillFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transportationBillFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TRANSPORTATION_BILLS != undefined &&
          this.data.TRANSPORTATION_BILLS.trim() != ''
        ) {
          var arr = this.data.TRANSPORTATION_BILLS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBartransportationBills = true;
      this.timertransportationBills = this.api
        .onUpload('transportationBills', this.transportationBillFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttransportationBills = percentDone;
            if (this.percenttransportationBills == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.TRANSPORTATION_BILLS = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartransportationBills = false;
            this.percenttransportationBills = 0;
            this.transportationBillFileURL = null;
            this.data.TRANSPORTATION_BILLS = null;
          }

          // if (successCode.code == '200') {
          //   this.data.TRANSPORTATION_BILLS = url;
          //   this.data.TRANSPORTATION_BILLS_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transportationBillFileURL = null;
      this.data.TRANSPORTATION_BILLS = null;
    }
  }

  condonationOfDelayFileURL: any;
  progressBarcondolationOfDelay: boolean = false;
  percentcondolationOfDelay = 0;
  timercondolationOfDelay: any;
  onFileSelectedCondonationOfDelay(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.condonationOfDelayFileURL = <File>event.target.files[0];

      if (this.condonationOfDelayFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.condonationOfDelayFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.CONDOLATION_OF_DELAY != undefined &&
          this.data.CONDOLATION_OF_DELAY.trim() != ''
        ) {
          var arr = this.data.CONDOLATION_OF_DELAY.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarcondolationOfDelay = true;
      this.timercondolationOfDelay = this.api
        .onUpload('condolationOfDelay', this.condonationOfDelayFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentcondolationOfDelay = percentDone;
            if (this.percentcondolationOfDelay == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.CONDOLATION_OF_DELAY = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarcondolationOfDelay = false;
            this.percentcondolationOfDelay = 0;
            this.condonationOfDelayFileURL = null;
            this.data.CONDOLATION_OF_DELAY = null;
          }

          // if (successCode.code == '200') {
          //   this.data.CONDOLATION_OF_DELAY = url;
          //   this.data.CONDOLATION_OF_DELAY_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.condonationOfDelayFileURL = null;
      this.data.CONDOLATION_OF_DELAY = null;
    }
  }

  paySlipFileURL: any;
  progressBarPaySlip: boolean = false;
  percentPaySlip = 0;
  timerPaySlip: any;
  onFileSelectedPaySlip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.paySlipFileURL = <File>event.target.files[0];

      if (this.paySlipFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.paySlipFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.PAY_SLIP != undefined &&
          this.data.PAY_SLIP.trim() != ''
        ) {
          var arr = this.data.PAY_SLIP.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarPaySlip = true;
      this.timerPaySlip = this.api
        .onUpload('transferPaySlip', this.paySlipFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentPaySlip = percentDone;
            if (this.percentPaySlip == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarPaySlip = false;
            this.percentPaySlip = 0;
            this.paySlipFileURL = null;
            this.data.PAY_SLIP = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.PAY_SLIP = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.paySlipFileURL = null;
      this.data.PAY_SLIP = null;
    }
  }
  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'assumptionCharge/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'lpc/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'mandateForm/' + link;
    }
    if (this.view == 4) {
      var a: any =
        this.api.retriveimgUrl + 'transferServiceCertificate/' + link;
    }
    if (this.view == 5) {
      var a: any = this.api.retriveimgUrl + 'ticketBoardingPass/' + link;
    }
    if (this.view == 6) {
      var a: any = this.api.retriveimgUrl + 'transportationBills/' + link;
    }
    if (this.view == 7) {
      var a: any = this.api.retriveimgUrl + 'condolationOfDelay/' + link;
    }
    if (this.view == 8) {
      var a: any = this.api.retriveimgUrl + 'transferPartA/' + link;
    }
    if (this.view == 9) {
      var a: any = this.api.retriveimgUrl + 'transferPaySlip/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink;
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  viewAssumptionPDF(pdfURL: string): void {
    this.view = 1;
    this.printOrderModalVisible = true;

    // window.open(this.api.retriveimgUrl + 'assumptionCharge/' + pdfURL);
  }
  viewLPCPDF(pdfURL: string): void {
    this.view = 2;
    this.printOrderModalVisible = true;
    // window.open(this.api.retriveimgUrl + 'lpc/' + pdfURL);
  }
  viewMandateFormPDF(pdfURL: string): void {
    this.view = 3;
    this.printOrderModalVisible = true;
    // window.open(this.api.retriveimgUrl + 'mandateForm/' + pdfURL);
  }
  viewTransferPDF(pdfURL: string): void {
    this.view = 4;
    this.printOrderModalVisible = true;
    // window.open(
    // this.api.retriveimgUrl + 'transferServiceCertificate/' + pdfURL
    // );
  }
  viewBoardingPassPDF(pdfURL: string): void {
    this.view = 5;
    this.printOrderModalVisible = true;
    // window.open(this.api.retriveimgUrl + 'ticketBoardingPass/' + pdfURL);
  }
  viewTransportationBillsPDF(pdfURL: string): void {
    this.view = 6;
    this.printOrderModalVisible = true;
    // window.open(this.api.retriveimgUrl + 'transportationBills/' + pdfURL);
  }
  viewCondonationOfDelayPDF(pdfURL: string): void {
    this.view = 7;
    this.printOrderModalVisible = true;
    // window.open(this.api.retriveimgUrl + 'condolationOfDelay/' + pdfURL);
  }

  viewPaySlipPDF(pdfURL: string): void {
    this.view = 9;
    this.printOrderModalVisible = true;
  }

  Accept() {
    this.isSpinning = true;
    if (this.view == 1) {
      this.data.ASSUMPTION_CHARGE_STATUS = 'A';
    }
    if (this.view == 2) {
      this.data.LPC_STATUS = 'A';
    }
    if (this.view == 3) {
      this.data.MANDATE_FORM_STATUS = 'A';
    }
    if (this.view == 4) {
      this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE_STATUS = 'A';
    }
    if (this.view == 5) {
      this.data.TICKET_BOARDING_PASS_STATUS = 'A';
    }
    if (this.view == 6) {
      this.data.TRANSPORTATION_BILLS_STATUS = 'A';
    }
    if (this.view == 7) {
      this.data.CONDOLATION_OF_DELAY_STATUS = 'A';
    }

    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.message.success('Verified Successfully...', '');
        this.printOrderModalVisible = false;
      } else {
        this.message.error('Information Has Not Saved...', '');

        this.isSpinning = false;
      }
    });
  }
  reject() {
    this.isSpinning = true;
    if (this.view == 1) {
      this.data.ASSUMPTION_CHARGE_STATUS = 'R';
    }
    if (this.view == 2) {
      this.data.LPC_STATUS = 'R';
    }
    if (this.view == 3) {
      this.data.MANDATE_FORM_STATUS = 'R';
    }
    if (this.view == 4) {
      this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE_STATUS = 'R';
    }
    if (this.view == 5) {
      this.data.TICKET_BOARDING_PASS_STATUS = 'R';
    }
    if (this.view == 6) {
      this.data.TRANSPORTATION_BILLS_STATUS = 'R';
    }
    if (this.view == 7) {
      this.data.CONDOLATION_OF_DELAY_STATUS = 'R';
    }

    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;

        this.message.success('Rejected Successfully...', '');
        this.printOrderModalVisible = false;
      } else {
        this.message.error('Information Has Not Saved...', '');

        this.isSpinning = false;
      }
    });
  }

  updatecall() {
    this.isSpinning = true;
    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.getAfterFileUpload();
        // this.isSpinning = false;
        // this.message.success('Verified Successfully...', '');
        // this.printOrderModalVisible = false;
        // this.message.success('File Uploaded Successfully...', '');
        // this.isSpinning = false;
      } else {
        this.message.error('Information Has Not Saved...', '');

        this.isSpinning = false;
      }
    });
  }
  getAfterFileUpload() {
    this.isSpinning = true;
    this.api
      .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data = data['data'][0];
            this.isSpinning = false;
            this.message.success('File Uploaded Successfully...', '');
            //  this.message.success('File Deleted...', '');
          } else {
            // this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  updatecallForUpload() {
    this.isSpinning = true;
    this.data.UPLOAD_PARTA_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.api
          .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.isSpinning = false;
                this.data = data['data'][0];
                this.message.success('File Uploaded Successfully...', '');
              } else {
                this.message.error('Something Went Wrong', '');
                this.isSpinning = false;
              }
            },
            (err) => {}
          );
        // this.isSpinning = false;
        // this.message.success('Verified Successfully...', '');
        // this.printOrderModalVisible = false;
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }

  loadingRecords = false;
  deleteConfirm(data: any) {
    this.loadingRecords = true;

    var data1 = {
      ID: data.ID,
      IS_DELETED: 1,
    };
    this.api.deletedetailsofjourney(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Record Deleted Successfully...', '');
        this.detailsJorneyGetData();
        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }

  deletetransportationcharges(data: any) {
    this.loadingRecords = true;

    var data1 = {
      ID: data.ID,
      IS_DELETED: 1,
    };
    this.api.deletetransportationcharges(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Record Deleted Successfully...', '');
        this.getDataform3();

        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }
  deleteCancel() {}
  accommodation1(data: any) {
    this.loadingRecords = true;

    var data1 = {
      ID: data.ID,
      IS_DELETED: 1,
    };
    this.api.accommodation(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Record Deleted Successfully...', '');
        this.getDataform2();

        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }

  deleterail(data: any) {
    this.loadingRecords = true;

    var data1 = {
      ID: data.ID,
      IS_DELETED: 1,
    };
    this.api.deleterail(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Record Deleted Successfully...', '');
        this.getDataform1();

        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }
  isSpinning11: boolean = false;
  openpdf() {
    this.saveDownloadDate();
    this.isSpinning11 = true;
    const element = document.getElementById('excel-table2');
    const opt = {
      margin: 0.2,
      filename: 'Part-A.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();

    // html2pdf().from(element).set(opt).outputPdf((pdf) => {
    //   pdf.save();
    //   this.isSpinning11=false;
    // });
  }

  // openpdf() {
  //   this.saveDownloadDate();
  //   const element = document.getElementById('excel-table2');
  //   const opt = {
  //     margin: 0.2,
  //     filename: 'Part-A.pdf',
  //     image: { type: 'jpeg', quality: 0.98 }, // Adjust quality as needed
  //     html2canvas: { scale: 2 }, // Adjust scale as needed
  //     jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
  //   };

  //   // Specify the styles for the PDF conversion
  //   const pdfStyles = {
  //     table: {
  //       fontSize: '12px',
  //     },
  //   };

  //   // Apply the styles to the HTML element
  //   const elementStyle = {
  //     element: element,
  //     onrendered: function (canvas) {
  //       canvas.style.fontSize = pdfStyles.table.fontSize;
  //     },
  //   };

  //   html2pdf().from(elementStyle).set(opt).save();
  // }

  printOrderModalVisible1: boolean = false;
  showmodal() {
    this.printOrderModalVisible1 = true;
  }
  showmodal1() {
    // this.printOrderModalVisible = true;
    this.message.success('Information Changed Successfully...', '');
    this.current = 4;
    this.next();
  }

  printOrderModalCancel1() {
    this.printOrderModalVisible1 = false;
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  partaurl: any;
  progressBartourPartA: boolean = false;
  percenttourPartA = 0;
  timertourPartA: any;
  uploadparta(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

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
          this.data.TRANSFER_PART_A != undefined &&
          this.data.TRANSFER_PART_A.trim() != ''
        ) {
          var arr = this.data.TRANSFER_PART_A.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBartourPartA = true;
      this.timertourPartA = this.api
        .onUpload('transferPartA', this.partaurl, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourPartA = percentDone;
            if (this.percenttourPartA == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res.body['code'] == 200) {
            // this.message.success('I-Card Uploaded Successfully...', '');
            this.data.TRANSFER_PART_A = url;
            this.updatecallForUpload();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourPartA = false;
            this.percenttourPartA = 0;
            this.partaurl = null;
            this.data.TRANSFER_PART_A = null;
          }

          // if (successCode.code == '200') {
          //   this.data.TRANSFER_PART_A = url;
          //   // this.data.TRANSPORTATION_BILLS_STATUS = '';
          //   this.updatecall();
          //   this.message.success('File Uploaded Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.partaurl = null;
      this.data.TRANSFER_PART_A = null;
    }
  }

  ViewParta(pdfURL: string): void {
    this.view = 8;
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'transferPartA/' + pdfURL);
  }

  confirmVisible: boolean = false;
  openConfirmModel() {
    this.confirmVisible = true;
    // if (
    //   this.data.TRANSFER_PART_A != null &&
    //   this.data.TRANSFER_PART_A != undefined &&
    //   this.data.TRANSFER_PART_A != ''
    // ) {
    //   this.confirmVisible = true;
    // } else {
    //   this.message.error('Please Upload Part A Document with Sign.', '');
    //   this.isSpinning = false;
    // }
  }
  cancelappliactionform() {
    this.confirmVisible = false;
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
              this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.DDO_OF_THE_OFFICIAL =
                data['data'][0]['DDO_OF_THE_OFFICIAL'];
              this.data.DDO_OF_THE_OFFICIAL_ID =
                data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
              this.data.GRADE_PAY_LEVEL = data['data'][0]['GRADE_PAY_LEVEL'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
              this.data.GRADE_PAY_LEVEL = data['data'][0]['GRADE_PAY_LEVEL'];
              // if (this.employerecordfilled) {
              //   this.ShowProfile();
              //   this.message.warning(
              //     'Please Update All The Details Required',
              //     ''
              //   );
              // }

              if (this.data.IS_APPLYING_FOR_ADVANCE) {
                if (
                  this.data.GRADE_PAY != 0 &&
                  this.data.GRADE_PAY != undefined &&
                  this.data.GRADE_PAY != null
                ) {
                  if (
                    this.data.GRANT_ONE_BASIC_PAY_AMOUNT == 0 ||
                    this.data.GRANT_ONE_BASIC_PAY_AMOUNT == undefined ||
                    this.data.GRANT_ONE_BASIC_PAY_AMOUNT == null
                  ) {
                    this.data.GRANT_ONE_BASIC_PAY_AMOUNT =
                      (Number(this.data.GRADE_PAY) * 80) / 100;
                  }
                }
              }
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
  showload: boolean = false;
  drawerVisibleEmpEdit: boolean = false;
  drawerTitleEmpEdit: any = '';
  drawerDataEmpEdit: EmployeeData = new EmployeeData();
  ShowProfile() {
    this.drawerTitleEmpEdit = 'Update Employee Profile';
    this.showload = true;
    //  this.drawerDataEmpEdit = Object.assign({}, data);
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.empid)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.dataList = data['data'];
            //

            this.drawerDataEmpEdit = Object.assign({}, data['data'][0]);
            this.showload = false;
            this.employerecordfilled = false;
          }
          this.drawerVisibleEmpEdit = true;
        },
        (err) => {}
      );
  }
  drawerCloseEmpEdit(): void {
    this.employeedetailsedit();
    this.drawerVisibleEmpEdit = false;
  }
  get closeCallbackEmpEdit() {
    return this.drawerCloseEmpEdit.bind(this);
  }

  getAfterDelete() {
    this.isSpinning = true;
    this.api
      .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data = data['data'][0];
            this.isSpinning = false;
            this.message.success('File Deleted...', '');
          } else {
            // this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  assumptionDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('assumptionCharge/' + data.ASSUMPTION_CHARGE)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.ASSUMPTION_CHARGE = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarassumptionCharge = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  LPCDeleteConfirm(data) {
    this.isSpinning = true;
    this.api.deletePdf('lpc/' + data.LPC).subscribe((successCode) => {
      if (successCode['code'] == '200') {
        this.data.LPC = null;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.getAfterDelete();
            this.progressBarlpc = false;
          } else {
            this.message.error('Information Has Not Saved...', '');
            this.isSpinning = false;
          }
        });
        // this.message.success('File Deleted...', '');
        // this.printOrderModalVisible = false;
      } else {
        this.message.error('File Has Not Deleted...', '');
        this.isSpinning = false;
      }
    });
  }
  mandateDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('mandateForm/' + data.MANDATE_FORM)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.MANDATE_FORM = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarmandateForm = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  transferDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf(
        'transferServiceCertificate/' + data.TRANSFER_ORDER_SERVICE_CERTIFICATE
      )
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartransferServiceCertificate = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  boardingPassDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('ticketBoardingPass/' + data.TICKET_BOARDING_PASS)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TICKET_BOARDING_PASS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarticketBoardingPass = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  transBillDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('transportationBills/' + data.TRANSPORTATION_BILLS)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TRANSPORTATION_BILLS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartransportationBills = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  delayDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('condolationOfDelay/' + data.CONDOLATION_OF_DELAY)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.CONDOLATION_OF_DELAY = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarcondolationOfDelay = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  partADeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('transferPartA/' + data.TRANSFER_PART_A)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TRANSFER_PART_A = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartourPartA = false;
            } else {
              this.message.error('Information Has Not Saved...', '');
              this.isSpinning = false;
            }
          });
          // this.message.success('File Deleted...', '');
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('File Has Not Deleted...', '');
          this.isSpinning = false;
        }
      });
  }

  paySlipDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('transferPaySlip/' + data.PAY_SLIP)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.PAY_SLIP = null;
          this.data.PAY_SLIP_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarPaySlip = false;
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
  current1: any = 0;
  getcurrent() {
    if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_TRANSFER_ADVANCE_CREATED
    ) {
      return this.current1;
    } else {
      return this.current;
    }
  }
}
