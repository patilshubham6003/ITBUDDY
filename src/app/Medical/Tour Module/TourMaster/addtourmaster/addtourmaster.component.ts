import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { Checklisttour } from 'src/app/Medical/Models/checklisttour';
import { Deatailsandpurposeoftours } from 'src/app/Medical/Models/deatailsandpurposetour';
import { foodtable } from 'src/app/Medical/Models/foodaddd';
import { Joureyofparticularcity } from 'src/app/Medical/Models/journeydetailsbycity';
import { Joureyofparticulartours } from 'src/app/Medical/Models/journeyofparticulartours';
import { Particularhotels } from 'src/app/Medical/Models/particulardetailsofhotel';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-addtourmaster',
  templateUrl: './addtourmaster.component.html',
  styleUrls: ['./addtourmaster.component.css'],
})
export class AddtourmasterComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() isSpinning = false;
  @Input() data: Tourmaster;
  @Input() data2: Deatailsandpurposeoftours;
  @Input() current = 0;
  @Input() empID: any;
  @Input() tourID: any;
  @Input() editdata: any;
  @Input() isCreate: any;

  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /[6-9]{1}[0-9]{9}/;
  filteredOptions: any = [];
  employee: EmployeeMaster[] = [];
  empLoader: boolean = false;
  @Input() detailsandpurpose: any = [];
  @Input() particularofhotelsdata: any = [];
  @Input() particularoftours: any = [];
  particularofcity: any = [];
  modedata: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  loadingRecords: boolean = false;
  totalRecords = 1;
  classdata: any[] = [];
  gradpaylevel: any;
  userId: any;
  parentUserId: any;
  show = true;
  isAdmin: boolean = false;
  data3: Checklisttour = new Checklisttour();
  loggedInDDO: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService,
    private sanitizer: DomSanitizer
  ) {}
  DDO_ID: any = Number(sessionStorage.getItem('ddoId'));
  ngOnInit(): void {
    this.gradePayLevelList();
    this.ddoOfTheOfficialList();
    this.userId = Number(sessionStorage.getItem('userId'));
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
    this.current = 0;
    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        } else {
          this.modedata = [];
        }
      },
      (err) => {}
    );

    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.api.gettravelclass(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.classdata = data['data'];
        } else {
          this.classdata = [];
        }
      },
      (err) => {}
    );
    // this.allEmployeeList();
    this.loadOnlySelectedEmployee();
    this.fileNumberList();
    this.ListOfDesignation();
  }

  ddoOfTheOfficialDataList: any = [];
  ddoOfTheOfficialList() {
    this.isSpinning = true;
    this.api.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          this.loggedInDDO = '';
          if (data['count'] > 0) {
            this.ddoOfTheOfficialDataList = data['data'];
            const matchedDDO = this.ddoOfTheOfficialDataList.find(
              (item) => item.ID === Number(sessionStorage.getItem('ddoId'))
            );
            this.loggedInDDO = matchedDDO
              ? matchedDDO.HEAD_OF_OFFICE
              : 'DDO not found';
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
            this.gradePayLevel = [];
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }
  designationList: any = [];

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
            this.designationList = [];
            this.message.error("Can't Load Designation Data", '');
          }
        },
        (err) => {}
      );
  }
  drawerTitledetailsofjourney!: string;
  drawerVisibledetailsofjourney: boolean = false;
  drawerDatadetailsofjourney: Deatailsandpurposeoftours =
    new Deatailsandpurposeoftours();

  detailsofjourney(): void {
    this.drawerTitledetailsofjourney = 'Add Details Charges';
    this.drawerDatadetailsofjourney = new Deatailsandpurposeoftours();
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
    this.drawerVisibledetailsofjourney = true;
  }

  drawerClosedetailsofjourney(): void {
    this.getdeatilssofpurpose();
    this.drawerVisibledetailsofjourney = false;
  }

  get closeCallbackdetailsofjourney() {
    return this.drawerClosedetailsofjourney.bind(this);
  }

  editdetailsndpurpose(data: Deatailsandpurposeoftours): void {
    this.drawerTitledetailsofjourney = 'Edit Journey Details';
    this.drawerDatadetailsofjourney = Object.assign({}, data);
    this.drawerVisibledetailsofjourney = true;
  }

  getdeatilssofpurpose() {
    this.loadingRecords = true;

    this.api
      .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.detailsandpurpose = data['data'];
        }
      });
  }

  drawerTitleparticularofhotels!: string;
  drawerVisibleparticularofhotels: boolean = false;
  drawerDataparticularofhotels: Particularhotels = new Particularhotels();

  particularofhotels(): void {
    this.drawerTitleparticularofhotels = 'Add Particular of Hotels Details';
    this.drawerDataparticularofhotels = new Particularhotels();
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
    this.drawerVisibleparticularofhotels = true;
  }
  drawerTitlefood: any;
  drawerDatafood: any;
  maxAdmissibleAmount: any = 0;
  foodopen(): void {
    this.drawerTitlefood = 'Add Food Bill';
    this.drawerDatafood = new foodtable();
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
    this.maxAdmissibleAmount = 0;
    this.drawerVisiblefood = true;
  }
  drawerVisiblefood = false;
  drawerClosefood(): void {
    this.gettoursfood();
    this.drawerVisiblefood = false;
  }

  get closeCallbackfood() {
    return this.drawerClosefood.bind(this);
  }
  editfood(data: foodtable): void {
    this.drawerTitlefood = 'Edit Food Bill Details';
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
    this.drawerDatafood = Object.assign({}, data);
    this.drawerDatafood.START_TIME = new Date('01-01-2000 ' + data.START_TIME);
    this.drawerDatafood.END_TIME = new Date('01-01-2000 ' + data.END_TIME);
    if (this.drawerDatafood.IS_LONG_JOURNEY == true) {
      var date1: any = new Date(this.drawerDatafood.JOURNEY_END_DATE);
      var date2: any = new Date(this.drawerDatafood.EXPENSE_DATE);
      var days1 = Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
      var days = days1 + 1;
      if (
        this.gradpaylevel == 'Level 6' ||
        this.gradpaylevel == 'Level 7' ||
        this.gradpaylevel == 'Level 8'
      ) {
        this.maxAdmissibleAmount = 500 * Number(days);
      } else if (
        this.gradpaylevel == 'Level 9' ||
        this.gradpaylevel == 'Level 10' ||
        this.gradpaylevel == 'Level 11'
      ) {
        this.maxAdmissibleAmount = 800 * Number(days);
      } else if (
        this.gradpaylevel == 'Level 12' ||
        this.gradpaylevel == 'Level 13'
      ) {
        this.maxAdmissibleAmount = 1000 * Number(days);
      } else if (this.gradpaylevel >= 'Level 14') {
        this.maxAdmissibleAmount = 1200 * Number(days);
      }
    } else {
      this.maxAdmissibleAmount = 0;
    }
    this.drawerVisiblefood = true;
  }

  drawerCloseparticularofhotels(): void {
    this.gettoursparticularhotel();
    this.drawerVisibleparticularofhotels = false;
  }

  get closeCallbackparticularofhotels() {
    return this.drawerCloseparticularofhotels.bind(this);
  }

  editparticularsofhotels(data: Particularhotels): void {
    this.drawerTitleparticularofhotels = 'Edit Particular of Hotels Details';
    this.gradpay();
    this.drawerDataparticularofhotels = Object.assign({}, data);
    this.drawerVisibleparticularofhotels = true;
  }

  gradpay() {
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
  }
  gettoursparticularhotel() {
    this.loadingRecords = true;
    this.api
      .gettoursparticularhotel(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.particularofhotelsdata = data['data'];
        }
      });
  }
  fooddata: any;
  gettoursfood() {
    this.api
      .gettoursFood(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.fooddata = data['data'];
        }
      });
  }

  gettourchecklist() {
    this.loadingRecords = true;
    this.api
      .getTourChecklist(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.data3 = data['data'];
        }
      });
  }

  drawerTitlejourneyparticulartours!: string;
  drawerVisiblejourneyparticulartours: boolean = false;
  drawerDatajourneyparticulartours: Joureyofparticulartours =
    new Joureyofparticulartours();

  journeyofparticular(): void {
    this.drawerTitlejourneyparticulartours = 'Add Journey of Particular';
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
    this.drawerDatajourneyparticulartours = new Joureyofparticulartours();
    this.drawerVisiblejourneyparticulartours = true;
  }

  drawerClosejourneyparticulartours(): void {
    this.drawerVisiblejourneyparticulartours = false;
    this.prticulartours();
  }

  get closeCallbackjourneyparticulartours() {
    return this.drawerClosejourneyparticulartours.bind(this);
  }

  editjourneyofparticular(data: any): void {
    this.gradpaylevel = this.data.GRADE_PAY_LEVEL;
    this.drawerTitlejourneyparticulartours = 'Edit Journey of Particular';
    this.drawerDatajourneyparticulartours = Object.assign({}, data);
    this.drawerVisiblejourneyparticulartours = true;
  }

  prticulartours() {
    this.loadingRecords = true;
    if (this.tourID != undefined && this.tourID != null && this.tourID != '') {
      this.api
        .getjourneyofparticulartours(
          0,
          0,
          '',
          'asc',
          ' AND TOUR_ID =' + this.tourID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.particularoftours = data['data'];
          }
        });
    } else {
    }
  }

  drawerTitlejourneycity!: string;
  drawerVisiblejourneycity: boolean = false;
  drawerDatajourneycity: Joureyofparticularcity = new Joureyofparticularcity();

  journeyofparticularcity(): void {
    this.drawerTitlejourneycity = 'Add Transportion Charges';
    this.drawerDatajourneycity = new Joureyofparticularcity();
    this.drawerVisiblejourneycity = true;
  }

  drawerClosejourneyofparticularcity(): void {
    this.getjourneyofparticularcity();
    this.drawerVisiblejourneycity = false;
  }

  get closeCallbackcityback() {
    return this.drawerClosejourneyofparticularcity.bind(this);
  }

  editdrawerClosejourneyofparticularcity(data: Joureyofparticularcity): void {
    this.drawerTitlejourneycity = 'Edit Particular of City';
    this.drawerDatajourneycity = Object.assign({}, data);
    this.drawerVisiblejourneycity = true;
  }

  getjourneyofparticularcity() {
    this.api
      .getjourneyofparticularcity(
        0,
        0,
        '',
        'asc',
        ' AND TOUR_ID =' + this.tourID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.particularofcity = data['data'];
        }
      });
  }

  oldDDO: any;
  oldDDOID: any;
  filterEmpData(event: any) {
    this.empLoader = true;
    this.isSpinning = true;
    this.oldDDO = '';
    this.oldDDOID = '';
    if (event != null) {
      this.api.getEmployeeMaster(0, 0, '', '', ' AND ID =' + event).subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'][0]['DDO_OF_THE_OFFICIAL']) {
              this.oldDDO = data['data'][0]['DDO_OF_THE_OFFICIAL'];
            }

            if (data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
              this.oldDDOID = data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            }

            this.empLoader = false;
            this.isSpinning = false;
            this.data.ID = data['data'][0]['ID'];
            this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
            this.data.SALUTATION = data['data'][0]['SALUTATION'];
            this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
            this.data.BASIC_PAY = data['data'][0]['GRADE_PAY'];
            // if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
            this.data.DDO_OF_THE_OFFICIAL_ID = Number(
              sessionStorage.getItem('ddoId')
            );
            // } else {
            //   this.data.DDO_OF_THE_OFFICIAL_ID =
            //     data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            // }
            this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
            this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
            this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
            this.data.GRADE_PAY_LEVEL_ID =
              data['data'][0]['GRADE_PAY_LEVEL_ID'];
          } else {
            this.empLoader = false;
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
    } else {
      this.empLoader = false;
      this.isSpinning = false;
      this.data.ID = null;
      this.data.DESIGNATION_ID = '';
      this.data.SALUTATION = '';
      this.data.HEADQUARTERS_NAME = '';
      this.data.MOBILE_NO = '';
      this.data.SERVICE_TYPE = '';
      this.data.BASIC_PAY = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = null;
      this.data.GRADE_PAY_LEVEL_ID = null;
      this.data.EMPLOYEE_NAME = '';
    }
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  showcreatemsg: boolean = false;
  empAllDataForUpdate: any;
  isPrevious: boolean = false;
  empSave(addNew: boolean): void {
    this.isSpinning = true;
    this.isOk = true;
    var data2 = [];

    if (this.data.DURATION_START_DATE) {
      this.data.DURATION_START_DATE = this.datepipe.transform(
        this.data.DURATION_START_DATE,
        'yyyy-MM-dd'
      );
    }
    if (this.data.DURATION_END_DATE) {
      this.data.DURATION_END_DATE = this.datepipe.transform(
        this.data.DURATION_END_DATE,
        'yyyy-MM-dd'
      );
    }
    if (this.data.TA_BILL_SUBMITTED_DATE) {
      this.data.TA_BILL_SUBMITTED_DATE = this.datepipe.transform(
        this.data.TA_BILL_SUBMITTED_DATE,
        'yyyy-MM-dd'
      );
    }

    if (
      this.data.EMP_ID == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      this.data.BASIC_PAY == undefined &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&
      this.data.GRADE_PAY_LEVEL_ID == undefined &&
      // this.data.MOBILE_NO == undefined &&
      this.data.SERVICE_TYPE == undefined &&
      this.data.HEADQUARTERS_NAME == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.EMP_ID == undefined ||
      this.data.EMP_ID == null ||
      this.data.EMP_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Employee Name', '');
    } else if (
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Designation', '');
    } else if (
      this.data.BASIC_PAY == undefined ||
      this.data.BASIC_PAY == null ||
      this.data.BASIC_PAY == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Basic Pay', '');
      // } else if (
      //   this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == 0
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Select DDO Of The Official', '');
      // } else if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO == 0
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Mobile No', '');
    } else if (
      this.data.GRADE_PAY_LEVEL_ID == undefined ||
      this.data.GRADE_PAY_LEVEL_ID == null ||
      this.data.GRADE_PAY_LEVEL_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Grade Pay Level', '');
    } else if (
      this.data.SERVICE_TYPE == undefined ||
      this.data.SERVICE_TYPE == null ||
      this.data.SERVICE_TYPE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Service Type Name', '');
    } else if (
      this.data.HEADQUARTERS_NAME == undefined ||
      this.data.HEADQUARTERS_NAME == null ||
      this.data.HEADQUARTERS_NAME == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Head Quater Address', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (
        this.data.HEADQUARTERS_NAME == undefined ||
        this.data.HEADQUARTERS_NAME == null ||
        this.data.HEADQUARTERS_NAME == '' ||
        this.data.HEADQUARTERS_NAME.trim() == ''
      ) {
        this.data.HEADQUARTERS_NAME = null;
      }
      {
        if (this.data.ID) {
          if (
            (this.empID != undefined ||
              this.empID != null ||
              this.empID != '') &&
            this.empID == this.data.EMP_ID
          ) {
            this.empAllDataForUpdate = {
              ID: this.empID,
              CLIENT_ID: 1,
              EMP_ID: this.empID,
              TOUR_ID: this.data.ID,
              EMPLOYEE_NAME: this.data.EMPLOYEE_NAME,
              DESIGNATION: this.data.DESIGNATION,
              DESIGNATION_ID: this.data.DESIGNATION_ID,
              BASIC_PAY: this.data.BASIC_PAY,
              DDO_OF_THE_OFFICIAL_ID: this.data.DDO_OF_THE_OFFICIAL_ID,
              MOBILE_NO:
                this.data.MOBILE_NO === null ||
                this.data.MOBILE_NO === undefined ||
                this.data.MOBILE_NO === '' ||
                this.data.MOBILE_NO === 0
                  ? ''
                  : this.data.MOBILE_NO,
              AMOUNT_OF_T_A: this.data.AMOUNT_OF_T_A,
              GRADE_PAY_LEVEL_ID: this.data.GRADE_PAY_LEVEL_ID,
              SERVICE_TYPE: this.data.SERVICE_TYPE,
              HEADQUARTERS_NAME: this.data.HEADQUARTERS_NAME,
              DEPARTURE_FROM: this.data2.DEPARTURE_FROM,
              ARRIVAL_DATETIME: this.data2.ARRIVAL_DATETIME,
              ARRIVAL_TO: this.data2.ARRIVAL_TO,
              TRAVEL_MODE_ID: this.data2.TRAVEL_MODE_ID,
              TRAVEL_CLASS_ID: this.data2.TRAVEL_CLASS_ID,
              HOURS_OF_HALT: this.data2.HOURS_OF_HALT,
              DAYS_OF_HALT: this.data2.DAYS_OF_HALT,
              FARE_PAID: this.data2.FARE_PAID,
              DISTANCE_IN_KM_FOR_ROAD: this.data2.DISTANCE_IN_KM_FOR_ROAD,
              IS_RETURNED: this.data2.IS_RETURNED,
              STATUS: true,
              INSPECTOR_ID:
                this.data.INSPECTOR_ID === null ||
                this.data.INSPECTOR_ID === undefined ||
                this.data.INSPECTOR_ID === '' ||
                this.data.INSPECTOR_ID === 0
                  ? Number(sessionStorage.getItem('userId'))
                  : this.data.INSPECTOR_ID,
              // INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
              // SUB_INSPECTOR_ID: Number(sessionStorage.getItem('parentUserID')),
              SUB_INSPECTOR_ID:
                this.data.SUB_INSPECTOR_ID == null ||
                this.data.SUB_INSPECTOR_ID === undefined ||
                this.data.SUB_INSPECTOR_ID === ''
                  ? Number(sessionStorage.getItem('parentUserID'))
                  : this.data.SUB_INSPECTOR_ID,
              ADESH_REASON: this.data.ADESH_REASON,
              SIGNATURE_ID: this.data.SIGNATURE_ID,
              TOUR_STATUS: this.data.TOUR_STATUS,

              IS_APPLYING_FOR_ADVANCE: this.data.IS_APPLYING_FOR_ADVANCE,
              VISITED_PLACE_AND_PERIOD: this.data.VISITED_PLACE_AND_PERIOD,
              PURPOSE_OF_TOUR: this.data.PURPOSE_OF_TOUR,
              IS_APPROVED_BY_TOUR_PROGRAMME_AUTHORITY:
                this.data.IS_APPROVED_BY_TOUR_PROGRAMME_AUTHORITY,
              TOUR_PROGRAMME_AUTHORITY_REMARK:
                this.data.TOUR_PROGRAMME_AUTHORITY_REMARK,
              DURATION_START_DATE: this.data.DURATION_START_DATE,
              DURATION_END_DATE: this.data.DURATION_END_DATE,
              TRAVEL_FARE: this.data.TRAVEL_FARE,
              JOURNEY_PERIOD_ALLOWANCE: this.data.JOURNEY_PERIOD_ALLOWANCE,
              HALT_ALLOWANCE: this.data.HALT_ALLOWANCE,
              TOTAL_ALLOWANCE: this.data.TOTAL_ALLOWANCE,
              TOTAL_RA_DA: this.data.TOTAL_RA_DA,
              REQUIRED_ADVANCE_AMOUNT: this.data.REQUIRED_ADVANCE_AMOUNT,
              IS_ADVANCE_OUTSTANDING: this.data.IS_ADVANCE_OUTSTANDING,
              TA_BILL_SUBMITTED_DATE: this.data.TA_BILL_SUBMITTED_DATE,
              IS_ADVANCE_TOUR_CREATED: this.data.IS_ADVANCE_TOUR_CREATED,
              IS_ADVANCE_TAKEN: this.data.IS_ADVANCE_TAKEN,
              IS_EMP_FILL_ADVANCE_INFO: this.data.IS_EMP_FILL_ADVANCE_INFO,
              FOOD_BILL_CLAIM: this.data.FOOD_BILL_CLAIM,
              SALUTATION: this.data.SALUTATION,
              IS_ADMIN_TOUR: this.data.IS_ADMIN_TOUR,
            };
          } else if (this.isPrevious == true) {
            this.empAllDataForUpdate = {
              ID: this.data.ID,
              CLIENT_ID: 1,
              EMP_ID: this.data.EMP_ID,
              TOUR_ID: this.data.ID,
              EMPLOYEE_NAME: this.data.EMPLOYEE_NAME,
              DESIGNATION: this.data.DESIGNATION,
              DESIGNATION_ID: this.data.DESIGNATION_ID,
              AMOUNT_OF_T_A: this.data.AMOUNT_OF_T_A,
              BASIC_PAY: this.data.BASIC_PAY,
              DDO_OF_THE_OFFICIAL_ID: this.data.DDO_OF_THE_OFFICIAL_ID,
              MOBILE_NO:
                this.data.MOBILE_NO === null ||
                this.data.MOBILE_NO === undefined ||
                this.data.MOBILE_NO === '' ||
                this.data.MOBILE_NO === 0
                  ? ''
                  : this.data.MOBILE_NO,
              GRADE_PAY_LEVEL_ID: this.data.GRADE_PAY_LEVEL_ID,
              SERVICE_TYPE: this.data.SERVICE_TYPE,
              HEADQUARTERS_NAME: this.data.HEADQUARTERS_NAME,
              DEPARTURE_FROM: this.data2.DEPARTURE_FROM,
              ARRIVAL_DATETIME: this.data2.ARRIVAL_DATETIME,
              ARRIVAL_TO: this.data2.ARRIVAL_TO,
              TRAVEL_MODE_ID: this.data2.TRAVEL_MODE_ID,
              IS_RETURNED: this.data2.IS_RETURNED,
              TRAVEL_CLASS_ID: this.data2.TRAVEL_CLASS_ID,
              HOURS_OF_HALT: this.data2.HOURS_OF_HALT,
              DAYS_OF_HALT: this.data2.DAYS_OF_HALT,
              FARE_PAID: this.data2.FARE_PAID,
              DISTANCE_IN_KM_FOR_ROAD: this.data2.DISTANCE_IN_KM_FOR_ROAD,

              INSPECTOR_ID:
                this.data.INSPECTOR_ID === null ||
                this.data.INSPECTOR_ID === undefined ||
                this.data.INSPECTOR_ID === '' ||
                this.data.INSPECTOR_ID === 0
                  ? Number(sessionStorage.getItem('userId'))
                  : this.data.INSPECTOR_ID,
              // INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
              // SUB_INSPECTOR_ID: Number(sessionStorage.getItem('parentUserID')),
              SUB_INSPECTOR_ID:
                this.data.SUB_INSPECTOR_ID === null ||
                this.data.SUB_INSPECTOR_ID === undefined ||
                this.data.SUB_INSPECTOR_ID === ''
                  ? Number(sessionStorage.getItem('parentUserID'))
                  : this.data.SUB_INSPECTOR_ID,
              ADESH_REASON: this.data.ADESH_REASON,
              SIGNATURE_ID: this.data.SIGNATURE_ID,
              TOUR_STATUS: this.data.TOUR_STATUS,
              IS_APPLYING_FOR_ADVANCE: this.data.IS_APPLYING_FOR_ADVANCE,
              VISITED_PLACE_AND_PERIOD: this.data.VISITED_PLACE_AND_PERIOD,
              PURPOSE_OF_TOUR: this.data.PURPOSE_OF_TOUR,
              IS_APPROVED_BY_TOUR_PROGRAMME_AUTHORITY:
                this.data.IS_APPROVED_BY_TOUR_PROGRAMME_AUTHORITY,
              TOUR_PROGRAMME_AUTHORITY_REMARK:
                this.data.TOUR_PROGRAMME_AUTHORITY_REMARK,
              DURATION_START_DATE: this.data.DURATION_START_DATE,
              DURATION_END_DATE: this.data.DURATION_END_DATE,
              TRAVEL_FARE: this.data.TRAVEL_FARE,
              JOURNEY_PERIOD_ALLOWANCE: this.data.JOURNEY_PERIOD_ALLOWANCE,
              HALT_ALLOWANCE: this.data.HALT_ALLOWANCE,
              TOTAL_ALLOWANCE: this.data.TOTAL_ALLOWANCE,
              TOTAL_RA_DA: this.data.TOTAL_RA_DA,
              REQUIRED_ADVANCE_AMOUNT: this.data.REQUIRED_ADVANCE_AMOUNT,
              IS_ADVANCE_OUTSTANDING: this.data.IS_ADVANCE_OUTSTANDING,
              TA_BILL_SUBMITTED_DATE: this.data.TA_BILL_SUBMITTED_DATE,
              IS_ADVANCE_TOUR_CREATED: this.data.IS_ADVANCE_TOUR_CREATED,
              IS_ADVANCE_TAKEN: this.data.IS_ADVANCE_TAKEN,
              IS_EMP_FILL_ADVANCE_INFO: this.data.IS_EMP_FILL_ADVANCE_INFO,
              FOOD_BILL_CLAIM: this.data.FOOD_BILL_CLAIM,
              SALUTATION: this.data.SALUTATION,
              IS_ADMIN_TOUR: this.data.IS_ADMIN_TOUR,
            };
          } else {
            this.empAllDataForUpdate = {
              ID: this.data.ID,
              CLIENT_ID: 1,
              EMP_ID: this.data.EMP_ID,
              TOUR_ID: null,
              EMPLOYEE_NAME: this.data.EMPLOYEE_NAME,
              DESIGNATION_ID: this.data.DESIGNATION_ID,
              AMOUNT_OF_T_A: this.data.AMOUNT_OF_T_A,
              BASIC_PAY: this.data.BASIC_PAY,
              DDO_OF_THE_OFFICIAL_ID: this.data.DDO_OF_THE_OFFICIAL_ID,
              MOBILE_NO:
                this.data.MOBILE_NO === null ||
                this.data.MOBILE_NO === undefined ||
                this.data.MOBILE_NO === '' ||
                this.data.MOBILE_NO === 0
                  ? ''
                  : this.data.MOBILE_NO,
              GRADE_PAY_LEVEL_ID: this.data.GRADE_PAY_LEVEL_ID,
              SERVICE_TYPE: this.data.SERVICE_TYPE,
              HEADQUARTERS_NAME: this.data.HEADQUARTERS_NAME,
              DEPARTURE_FROM: this.data2.DEPARTURE_FROM,
              ARRIVAL_DATETIME: this.data2.ARRIVAL_DATETIME,
              ARRIVAL_TO: this.data2.ARRIVAL_TO,
              TRAVEL_MODE_ID: this.data2.TRAVEL_MODE_ID,
              IS_RETURNED: this.data2.IS_RETURNED,
              TRAVEL_CLASS_ID: this.data2.TRAVEL_CLASS_ID,
              HOURS_OF_HALT: this.data2.HOURS_OF_HALT,
              DAYS_OF_HALT: this.data2.DAYS_OF_HALT,
              FARE_PAID: this.data2.FARE_PAID,
              DISTANCE_IN_KM_FOR_ROAD: this.data2.DISTANCE_IN_KM_FOR_ROAD,
              DOWNLOAD_PARTA_DATE_TIME: this.datepipe.transform(
                new Date(),
                'yyyy-MM-dd HH:mm:ss'
              ),
              DOCUMENTS_SUBMITTED_DATE_TIME: this.datepipe.transform(
                new Date(),
                'yyyy-MM-dd HH:mm:ss'
              ),
              PRINT_FORM_DATE_TIME: this.datepipe.transform(
                new Date(),
                'yyyy-MM-dd HH:mm:ss'
              ),
              EMP_DETAILS_SUBMITTED_DATE_TIME: this.datepipe.transform(
                new Date(),
                'yyyy-MM-dd HH:mm:ss'
              ),
              STEP_NO: 4,
              TOUR_STATUS: 'T',
              INSPECTOR_ID:
                this.data.INSPECTOR_ID == null ||
                this.data.INSPECTOR_ID === undefined ||
                this.data.INSPECTOR_ID === '' ||
                this.data.INSPECTOR_ID === 0
                  ? Number(sessionStorage.getItem('userId'))
                  : this.data.INSPECTOR_ID,
              // INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
              // SUB_INSPECTOR_ID: Number(sessionStorage.getItem('parentUserID')),
              SUB_INSPECTOR_ID:
                this.data.SUB_INSPECTOR_ID == null ||
                this.data.SUB_INSPECTOR_ID === undefined ||
                this.data.SUB_INSPECTOR_ID === ''
                  ? Number(sessionStorage.getItem('parentUserID'))
                  : this.data.SUB_INSPECTOR_ID,
              ADESH_REASON: this.data.ADESH_REASON,
              SIGNATURE_ID: this.data.SIGNATURE_ID,
              IS_APPLYING_FOR_ADVANCE: this.data.IS_APPLYING_FOR_ADVANCE,
              VISITED_PLACE_AND_PERIOD: this.data.VISITED_PLACE_AND_PERIOD,
              PURPOSE_OF_TOUR: this.data.PURPOSE_OF_TOUR,
              IS_APPROVED_BY_TOUR_PROGRAMME_AUTHORITY:
                this.data.IS_APPROVED_BY_TOUR_PROGRAMME_AUTHORITY,
              TOUR_PROGRAMME_AUTHORITY_REMARK:
                this.data.TOUR_PROGRAMME_AUTHORITY_REMARK,
              DURATION_START_DATE: this.data.DURATION_START_DATE,
              DURATION_END_DATE: this.data.DURATION_END_DATE,
              TRAVEL_FARE: this.data.TRAVEL_FARE,
              JOURNEY_PERIOD_ALLOWANCE: this.data.JOURNEY_PERIOD_ALLOWANCE,
              HALT_ALLOWANCE: this.data.HALT_ALLOWANCE,
              TOTAL_ALLOWANCE: this.data.TOTAL_ALLOWANCE,
              TOTAL_RA_DA: this.data.TOTAL_RA_DA,
              REQUIRED_ADVANCE_AMOUNT: this.data.REQUIRED_ADVANCE_AMOUNT,
              IS_ADVANCE_OUTSTANDING: this.data.IS_ADVANCE_OUTSTANDING,
              TA_BILL_SUBMITTED_DATE: this.data.TA_BILL_SUBMITTED_DATE,

              IS_ADVANCE_TOUR_CREATED: this.data.IS_ADVANCE_TOUR_CREATED,
              IS_ADVANCE_TAKEN: this.data.IS_ADVANCE_TAKEN,
              IS_EMP_FILL_ADVANCE_INFO: this.data.IS_EMP_FILL_ADVANCE_INFO,
              FOOD_BILL_CLAIM: this.data.FOOD_BILL_CLAIM,
              SALUTATION: this.data.SALUTATION,
              IS_ADMIN_TOUR: 1,
            };
          }
        }

        {
          if (this.data.ID) {
            this.isSpinning = true;
            this.api
              .updatetourmasterform(this.empAllDataForUpdate)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.empID = successCode.EMP_ID;
                  this.tourID = successCode.TOUR_ID;
                  if (this.isCreate) {
                    this.isCreate = false;
                  }
                  this.next();
                  // this.isSpinning = false;
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
            this.isSpinning = true;
            this.api
              .createEmployeeMaster(this.data)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.empID = successCode.EMP_ID;
                  this.tourID = successCode.TOUR_ID;
                  this.showcreatemsg = true;
                  this.next();
                  // this.isSpinning = false;
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
                  this.message.error('Failed To Fill Information...', '');
                  this.isSpinning = false;
                }
              });
          }
        }
      }
    }
  }
  fileURL1: any;

  resetDrawer(hospitalFormReset: NgForm) {}
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  pre(): void {
    this.isPrevious = true;
    if (this.current == 1) {
      this.isSpinning = true;
      this.gradePayLevelList();
      this.ddoOfTheOfficialList();
      // this.allEmployeeList();
      this.loadOnlySelectedEmployee();
      this.ListOfDesignation();
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
              } else {
                this.data = data['data'][0];
              }

              this.api
                .getdeatilssofpurpose(
                  0,
                  0,
                  '',
                  '',
                  ' AND TOUR_ID = ' + this.tourID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.detailsandpurpose = data['data'];
                      this.isSpinning = false;
                      this.current = 0;
                      this.current1 = 0;
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Something Went Wrong', '');
            }
          },
          (err) => {}
        );
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.getdeatilssofpurpose();
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = data['data'][0];
                this.current = 1;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                this.current = 1;

                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );

      this.isSpinning = false;
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.getjourneyofparticularcity();
      this.gettoursparticularhotel();
      this.gettoursfood();
      this.prticulartours();
      this.ddoOfTheOfficialList();
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = data['data'][0];
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_ADVANCE_TOUR_CREATED
                ) {
                  this.current = 0;
                  this.current1 = 0;
                } else {
                  this.current = 2;
                }
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_ADVANCE_TOUR_CREATED
                ) {
                  this.current = 0;
                } else {
                  this.current = 2;
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

      this.isSpinning = false;
    }
    if (this.current == 4) {
      this.isSpinning = true;
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = data['data'][0];
                this.current -= 1;
                this.current1 -= 1;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                this.current -= 1;
                this.current1 -= 1;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );

      this.isSpinning = false;
    } else {
      this.isSpinning = true;
      this.current -= 1;
      this.isSpinning = false;
    }
  }

  travelclass: any;
  travelid: any;
  getclassmode(event: any) {
    this.classdata = [];

    this.api
      .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID = ' + event)
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            this.classdata = data['data'];
            var f = this.classdata.filter((item) => item.ID == event);
            this.travelclass = f[0]['TRAVEL_CLASS_ID'];
            this.travelid = f[0]['TRAVEL_MODE_ID'];
            let name;
            name = this.modedata.filter((val) => {
              if (val.ID == event) {
                return val.NAME;
              }
            });
            this.data2.TRAVEL_MODE_NAME = name[0].NAME;
          }
        },
        (err: any) => {}
      );
  }

  advanceTaken: any = 0;
  foodAmountClaimed: any = 0;
  railTicket: boolean = false;
  airTicket: boolean = false;
  roadTicket: boolean = false;
  bordingPass: boolean = false;
  hotelBill: boolean = false;
  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.getdeatilssofpurpose();
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            this.data = new Tourmaster();
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                if (this.showcreatemsg) {
                  this.message.success('Claim Created Successfully...', '');
                  this.showcreatemsg = false;
                } else {
                  this.message.success('Information Saved Successfully...', '');
                }
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_ADVANCE_TOUR_CREATED
                ) {
                  this.current = 3;
                  this.current1 = 1;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                if (this.showcreatemsg) {
                  this.message.success('Claim Created Successfully...', '');
                  this.showcreatemsg = false;
                } else {
                  this.message.success('Information Saved Successfully...', '');
                }
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_ADVANCE_TOUR_CREATED
                ) {
                  this.current = 3;
                  this.current1 = 1;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              }
            } else {
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 1) {
      this.isSpinning = true;
      this.advanceTaken = 0;
      this.foodAmountClaimed = 0;
      this.getjourneyofparticularcity();
      this.gettoursparticularhotel();
      this.gettoursfood();
      this.prticulartours();
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            this.data = new Tourmaster();
            if (data['code'] == 200) {
              if (data['data']['IS_ADVANCE_TAKEN'] == 1) {
                this.advanceTaken = 1;
              } else {
                this.advanceTaken = 0;
              }
              if (data['data']['FOOD_BILL_CLAIM'] == 1) {
                this.foodAmountClaimed = 1;
              } else {
                this.foodAmountClaimed = 0;
              }
              if (data['data'].length == 0) {
                this.message.success('Information Saved Successfully...', '');
                this.current = 2;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                this.message.success('Information Saved Successfully...', '');
                this.current = 2;
                this.isSpinning = false;
              }
            } else {
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 2) {
      this.api
        .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID)
        .subscribe(
          (data) => {
            this.data = new Tourmaster();
            if (data['code'] == 200) {
              if (data['data']['IS_ADVANCE_TAKEN'] == 1) {
                this.advanceTaken = 1;
              } else {
                this.advanceTaken = 0;
              }
              if (data['data']['FOOD_BILL_CLAIM'] == 1) {
                this.foodAmountClaimed = 1;
              } else {
                this.foodAmountClaimed = 0;
              }
              if (data['data'].length == 0) {
                this.message.success('Information Saved Successfully...', '');
                this.current = 3;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                this.message.success('Information Saved Successfully...', '');
                this.current = 3;
                this.isSpinning = false;
              }
            } else {
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 3) {
      this.fileNumberList();
      this.railTicket = false;
      this.airTicket = false;
      this.bordingPass = false;
      this.roadTicket = false;
      this.hotelBill = false;
      this.api
        .getTourChecklist(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            if (data['count'] == 0) {
              this.data3 = new Checklisttour();
              if ((this.advanceTaken = 1)) {
                this.data3.T_A_ADVANCE_TAKEN = true;
              } else {
                this.data3.T_A_ADVANCE_TAKEN = this.data3.T_A_ADVANCE_TAKEN;
              }

              if (this.detailsandpurpose.length > 0) {
                for (var i = 0; this.detailsandpurpose.length > i; i++) {
                  if (
                    this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 5 &&
                    this.detailsandpurpose[i]['TICKET_FROM'] == 1
                  ) {
                    this.airTicket = true;
                  } else {
                    this.airTicket = false;
                  }
                }
                if (this.airTicket == true) {
                  this.data3.TICKET_BOOKED_THROUGH_TRAVEL_AGENT = true;
                } else {
                  this.data3.TICKET_BOOKED_THROUGH_TRAVEL_AGENT = false;
                }
              } else {
                this.data3.TICKET_BOOKED_THROUGH_TRAVEL_AGENT = false;
              }

              if ((this.foodAmountClaimed = 1)) {
                this.data3.FOOD_EXPENSES_CLAIMED = true;
              } else {
                this.data3.FOOD_EXPENSES_CLAIMED =
                  this.data3.FOOD_EXPENSES_CLAIMED;
              }
              if (
                this.data.TICKET_EXCHANGE_VOUCHER_ARRANGED_BY == 'DC (Admin)'
              ) {
                this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK = 'Y';
              } else if (
                this.data.TICKET_EXCHANGE_VOUCHER_ARRANGED_BY == undefined &&
                this.data.TICKET_EXCHANGE_VOUCHER_ARRANGED_BY == null &&
                this.data.TICKET_EXCHANGE_VOUCHER_ARRANGED_BY == ''
              ) {
                this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK = 'NA';
              } else {
                this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK = 'N';
              }
              if (
                this.data.S_R_61 != null &&
                this.data.S_R_61 != undefined &&
                this.data.S_R_61 != ''
              ) {
                this.data3.S_R_61_SUBMITTED = true;
              } else {
                this.data3.S_R_61_SUBMITTED = this.data3.S_R_61_SUBMITTED;
              }
              if (
                this.data.BANK_MANDATE_FORM != null &&
                this.data.BANK_MANDATE_FORM != undefined &&
                this.data.BANK_MANDATE_FORM != ''
              ) {
                this.data3.BANK_MANDATE_FORM_SUBMITTED = true;
              } else {
                this.data3.BANK_MANDATE_FORM_SUBMITTED =
                  this.data3.BANK_MANDATE_FORM_SUBMITTED;
              }

              if (this.particularofhotelsdata.length > 0) {
                for (var i = 0; this.particularofhotelsdata.length > i; i++) {
                  if (
                    this.particularofhotelsdata[i]['HOTEL_BILL'] != null &&
                    this.particularofhotelsdata[i]['HOTEL_BILL'] != undefined &&
                    this.particularofhotelsdata[i]['HOTEL_BILL'] != ''
                  ) {
                    this.hotelBill = true;
                  } else {
                  }
                }
                if (this.hotelBill == true) {
                  this.data3.ACCOMODATION_BILL_CLAIMED_SUBMITTED = true;
                } else {
                  this.data3.ACCOMODATION_BILL_CLAIMED_SUBMITTED = false;
                }
              } else {
                this.data3.ACCOMODATION_BILL_CLAIMED_SUBMITTED = false;
              }
              if (this.detailsandpurpose.length > 0) {
                for (var i = 0; this.detailsandpurpose.length > i; i++) {
                  if (
                    this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 5 &&
                    this.detailsandpurpose[i]['TOUR_BOARDING_PASS'] != null &&
                    this.detailsandpurpose[i]['TOUR_BOARDING_PASS'] !=
                      undefined &&
                    this.detailsandpurpose[i]['TOUR_BOARDING_PASS'] != ''
                  ) {
                    this.bordingPass = true;
                  } else {
                  }
                }
                if (
                  this.bordingPass == true &&
                  this.data.TOUR_SELF_DECLARATION != null &&
                  this.data.TOUR_SELF_DECLARATION != undefined &&
                  this.data.TOUR_SELF_DECLARATION != ''
                ) {
                  this.data3.TRAVELLING_VOUCHER_SUBMITTED = true;
                } else {
                  this.data3.TRAVELLING_VOUCHER_SUBMITTED = false;
                }
              } else {
              }

              if (this.detailsandpurpose.length > 0) {
                for (var i = 0; this.detailsandpurpose.length > i; i++) {
                  if (
                    this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 3 &&
                    this.detailsandpurpose[i]['TOUR_ROAD_TICKETS'] != null &&
                    this.detailsandpurpose[i]['TOUR_ROAD_TICKETS'] !=
                      undefined &&
                    this.detailsandpurpose[i]['TOUR_ROAD_TICKETS'] != ''
                  ) {
                    this.roadTicket = true;
                  } else {
                  }
                }
                if (
                  this.roadTicket == true &&
                  this.data.TOUR_SELF_DECLARATION != null &&
                  this.data.TOUR_SELF_DECLARATION != undefined &&
                  this.data.TOUR_SELF_DECLARATION != ''
                ) {
                  this.data3.ORIGINAL_BOARDING_PASS_SUBMITTED = true;
                } else {
                  this.data3.ORIGINAL_BOARDING_PASS_SUBMITTED = false;
                }
              }
              this.message.success('Information Saved Successfully...', '');
              this.current = 4;
              this.current1 = 2;
            } else {
              this.data3 = data['data'][0];
              this.message.success('Information Saved Successfully...', '');
              this.current = 4;
              this.current1 = 2;
            }
          } else {
            this.isSpinning = false;
          }
        });
    } else {
    }
  }
  close(): void {
    this.current = 0;
    this.isSpinning = false;
    this.drawerClose();
  }
  fileList: any = [];
  fileNumberList() {
    this.isSpinning = true;
    this.api
      .getFileMaster(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND HIRARCHY_ID in (6,7)',
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.fileList = data['data'];
            } else {
              this.fileList = [];
            }
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
  }

  getLatestEmpData() {
    if (this.data.EMP_ID != null || this.data.EMP_ID != undefined) {
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
              this.data.SALUTATION = data['data'][0]['SALUTATION'];
              this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
              this.data.BASIC_PAY = data['data'][0]['GRADE_PAY'];
              if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
                this.data.DDO_OF_THE_OFFICIAL_ID = Number(
                  sessionStorage.getItem('ddoId')
                );
              } else {
                this.data.DDO_OF_THE_OFFICIAL_ID =
                  data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
              }
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
              this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
              this.data.GRADE_PAY_LEVEL_ID =
                data['data'][0]['GRADE_PAY_LEVEL_ID'];
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  tempCount: any = 0;
  allEmployeeList() {
    this.empLoader = true;
    this.tempCount = 0;
    this.api.getEmployeeMaster(1, 50, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.employee = data['data'];
          this.tempCount = data['count'];
          this.filteredOptions = this.employee;
          this.empLoader = false;
        } else {
          this.message.error("Can't Load Employee Data", '');
          this.empLoader = false;
        }
      },
      (err) => {}
    );
  }

  loadOnlySelectedEmployee() {
    if (this.data.ID) {
      let fullName: any = '';
      fullName = this.data.EMPLOYEE_NAME;

      // Split the name into an array of words
      // let nameParts: any = '';
      // nameParts = fullName.split(' ');

      // Extract the first three words
      let firstThreeWords: any = '';
      firstThreeWords = fullName.substring(0, 3);

      this.api
        .getEmployeeMaster(
          0,
          0,
          '',
          '',
          " AND STATUS = 1 AND NAME like '%" + firstThreeWords + "%'"
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              const newData = data['data'];
              // this.employee = data['data'];

              this.employee = [...this.employee, ...newData];
              this.filteredOptions = this.employee;
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
            this.empLoader = false;
          },
          (err) => {
            this.empLoader = false;
          }
        );
    } else {
      this.allEmployeeList();
    }
  }

  pageSize1 = 50;
  currentPage = 1;
  loading = false;

  onScroll(event) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.currentPage++;

      if (this.tempCount == this.employee.length) {
        this.message.info('All Employee Load', '');
      } else {
        this.loadEmployeeData();
      }
    }
  }

  loadEmployeeData() {
    if (!this.empLoader) {
      this.currentPage = +this.currentPage;

      this.empLoader = true;
      this.api
        .getEmployeeMaster(
          this.currentPage,
          this.pageSize1,
          '',
          '',
          ' AND STATUS = 1'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              const newData = data['data'];
              // this.employee = data['data'];

              this.tempCount = data['count'];

              this.employee = [...this.employee, ...newData];
              this.filteredOptions = this.employee;
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
            this.empLoader = false;
          },
          (err) => {
            this.empLoader = false;
          }
        );
    }
  }

  docSave(addNew: boolean) {
    this.isOk = true;

    this.isSpinning = true;
    this.data.ID = this.tourID;
    if (this.isOk && this.data.ID != undefined) {
      this.data.TOUR_ID = undefined;
      this.api.updatetour(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.next();
          // this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    }
  }
  // employeeSearch(event: any) {
  //   var f = '';
  //   if (event.target.value.length >= 3) {
  //     this.api
  //       .getEmployeeMaster(
  //         0,
  //         0,
  //         '',
  //         'asc',
  //         " AND NAME like '%" +
  //           event.target.value +
  //           "%'" +
  //           " OR EMPLOYEE_CODE like '%" +
  //           event.target.value +
  //           "%'" +
  //           " OR OFFICE_NAME like '%" +
  //           event.target.value +
  //           "%'" +
  //           " OR DESIGNATION like '%" +
  //           event.target.value +
  //           "%'" +
  //           " OR DDO_OF_THE_OFFICIAL like '%" +
  //           event.target.value +
  //           "%'" +
  //           f
  //       )
  //       .subscribe(
  //         (empData) => {
  //           if (empData['code'] == 200) {
  //             var filteredOptions = empData['data'];
  //           } else {
  //             this.message.error("Can't Load Employee Data", '');
  //           }
  //         },
  //         (err) => {}
  //       );
  //   } else {
  //   }
  // }

  employeeSearch(event: any) {
    var f = '';
    if (
      event != null &&
      event != undefined &&
      event != '' &&
      event.target.value.length != 0
    ) {
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
                var filteredOptions = [];
                filteredOptions = empData['data'];
                this.employee = filteredOptions;
              } else {
                this.message.error("Can't Load Employee Data", '');
              }
            },
            (err) => {}
          );
      } else {
      }
    } else {
      this.employee = [];
      this.loadEmployeeData();
    }
  }
  drawerData: EmployeeMaster = new EmployeeMaster();
  drawerTitle: string = '';

  add(): void {
    this.drawerTitle = 'Create New Employee';
    this.drawerData = new EmployeeMaster();
    this.drawerData.IS_ADMIN_EMP = true;
    // this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
    //   sessionStorage.getItem('ddoId')
    // );
    this.empDrawerVisible = true;
  }
  editEmp;
  empDrawerVisible: boolean = false;
  edit(data: any): void {
    this.drawerTitle = 'Edit Employee Details';
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + data.EMP_ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.drawerData = data['data'][0];
          // if (
          //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == null ||
          //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == undefined ||
          //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == 0
          // ) {
          //   this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
          //     sessionStorage.getItem('ddoId')
          //   );
          // } else {
          //   this.drawerData.DDO_OF_THE_OFFICIAL_ID =
          //     this.drawerData.DDO_OF_THE_OFFICIAL_ID;
          // }
        } else {
          this.message.error("Can't Load Employee Data", '');
        }
      }),
      (this.empDrawerVisible = true);
  }

  empDrawerClose(): void {
    this.empDrawerVisible = false;
    this.getLatestEmpData();
  }

  get closeCallback1() {
    return this.empDrawerClose.bind(this);
  }
  index = -1;
  // addData(addNew: boolean, journoey: NgForm) {
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (
  //     this.data2.DISTANCE_IN_KM_FOR_ROAD == undefined &&
  //     this.data2.FARE_PAID == undefined &&
  //     this.data2.TRAVEL_MODE_ID == 0 &&
  //     this.data2.TRAVEL_CLASS_ID == 0 &&
  //     this.data2.DEPARTURE_FROM == undefined &&
  //     this.data2.ARRIVAL_TO == undefined &&
  //     this.data2.PURPOSE_OF_JOURNEY == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Fill All The Required Fields ', '');
  //   } else if (
  //     this.data2.DEPARTURE_DATETIME == null ||
  //     this.data2.DEPARTURE_DATETIME == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Departure Date', '');
  //   } else if (
  //     this.data2.DEPARTURE_FROM == null ||
  //     this.data2.DEPARTURE_FROM == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Departure From.', '');
  //   } else if (
  //     this.data2.ARRIVAL_DATETIME == null ||
  //     this.data2.ARRIVAL_DATETIME == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Arrival Date', '');
  //   } else if (this.data2.ARRIVAL_TO == null || this.data2.ARRIVAL_TO == '') {
  //     this.isOk = false;
  //     this.message.error('Please Enter Arrival to.', '');
  //   } else if (
  //     this.data2.TRAVEL_MODE_ID == null ||
  //     this.data2.TRAVEL_MODE_ID <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Travel Mode', '');
  //   } else if (
  //     this.data2.TRAVEL_CLASS_ID == null ||
  //     this.data2.TRAVEL_CLASS_ID <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Select Class of Mode.', '');
  //   } else if (
  //     this.data2.DAYS_OF_HALT == null ||
  //     this.data2.DAYS_OF_HALT <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please days of halts.', '');
  //   } else if (
  //     this.data2.HOURS_OF_HALT == null ||
  //     this.data2.HOURS_OF_HALT == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Hours of Halts.', '');
  //   } else if (this.data2.FARE_PAID == null || this.data2.FARE_PAID <= 0) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Fare Paid.', '');
  //   } else if (
  //     this.data2.DISTANCE_IN_KM_FOR_ROAD == null ||
  //     this.data2.DISTANCE_IN_KM_FOR_ROAD <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Distance in km for road.', '');
  //   } else if (
  //     this.data2.PURPOSE_OF_JOURNEY == null ||
  //     this.data2.PURPOSE_OF_JOURNEY <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please purpose of Journey.', '');
  //   }

  //   if (this.isOk) {
  //     if (this.data2.ARRIVAL_DATETIME == undefined) {
  //       this.data2.ARRIVAL_DATETIME = null;
  //     } else {
  //       this.data2.ARRIVAL_DATETIME = this.datepipe.transform(
  //         this.data2.ARRIVAL_DATETIME,
  //         'yyyy-MM-dd'
  //       );
  //     }
  //     if (this.data2.DEPARTURE_DATETIME == undefined) {
  //       this.data2.DEPARTURE_DATETIME = null;
  //     } else {
  //       this.data2.DEPARTURE_DATETIME = this.datepipe.transform(
  //         this.data2.DEPARTURE_DATETIME,
  //         'yyyy-MM-dd'
  //       );
  //     }

  //     if (this.index > -1) {
  //       this.detailsandpurpose[this.index] = Object.assign({}, this.data2);
  //     } else {
  //       this.detailsandpurpose.push(Object.assign({}, this.data2));
  //     }
  //     this.detailsandpurpose = [...[], ...this.detailsandpurpose];

  //     journoey.form.reset();
  //     this.data2 = new Deatailsandpurposeoftours();
  //     this.index = -1;
  //   }
  // }

  TRAVEL_MODE_NAME: any;
  isdata(event: any) {
    if (event == false) {
      this.data.TRAVELLED_M_E_OT = '';
    }
  }
  freeBoardLodging(event: any) {
    if (event == false) {
      this.data.BOARD = false;
      this.data.LODGING = false;
      this.data.BOARD_AND_LODGING = false;
    } else {
    }
  }

  datadessable(event: any) {
    if (event == true) {
      this.data.LODGING = false;
      this.data.BOARD_AND_LODGING = false;
    }
  }

  datadessable1(event: any) {
    if (event == true) {
      this.data.BOARD = false;
      this.data.BOARD_AND_LODGING = false;
    }
  }
  datadessable2(event: any) {
    if (event == true) {
      this.data.LODGING = false;
      this.data.BOARD = false;
    }
  }

  selectchangevent(key: any) {
    if (key != null || key != undefined) {
      let name;
      name = this.modedata.filter((val) => {
        if (val.ID == key) {
          return val.NAME;
        }
      });
      this.data2.TRAVEL_MODE_NAME = name[0].NAME;
      this.api
        .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID = ' + key)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.classdata = data['data'];
            }
          },
          (err) => {}
        );
    }
  }

  selectchangevent1(key: any) {
    if (key != null || key != undefined) {
      let name;
      name = this.classdata.filter((val) => {
        if (val.ID == key) {
          return val.NAME;
        }
      });
      this.data2.TRAVEL_CLASS_NAME = name[0].NAME;
    }
  }

  isdasadta(event: any) {
    if (event == false) {
      this.data.RETURN_TICKET_PURCHASED_REMARK = '';
    }
  }

  AlldataSave(addNew: boolean) {
    this.isOk = true;

    this.isSpinning = true;
    this.data.ID = this.tourID;
    if (this.isOk && this.data.ID != undefined) {
      if (this.data.ADVANCE_TAKEN_DATE == undefined) {
        this.data.ADVANCE_TAKEN_DATE = null;
      } else {
        this.data.ADVANCE_TAKEN_DATE = this.datepipe.transform(
          this.data.ADVANCE_TAKEN_DATE,
          'yyyy-MM-dd'
        );
      }
      this.data.TOUR_ID = undefined;
      this.api.updatetour(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.next();
          // this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    }
  }

  Secondstep(addNew: boolean) {
    this.isOk = true;
    this.isSpinning = true;
    this.data.ID = this.tourID;
    if (this.isOk && this.data.ID != undefined) {
      this.data.TOUR_ID = undefined;
      this.api.updatetour(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.next();
          // this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    }
  }

  saveCheckList(addNew: boolean): void {
    if (
      this.data.TOUR_HOLD_DATE != null &&
      this.data.TOUR_HOLD_DATE != undefined &&
      this.data.TOUR_HOLD_DATE != ''
    ) {
      this.data.TOUR_HOLD_DATE = this.datepipe.transform(
        this.data.TOUR_HOLD_DATE,
        'yyyy-MM-dd'
      );
    }
    this.isSpinning = true;
    this.isOk = true;
    this.data3.TOUR_ID = this.tourID;
    if (
      this.data3.DELAYED_SUBMISSION_BILL == undefined &&
      this.data3.ELECTION_DUTY == undefined &&
      this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK == undefined &&
      (!this.data.IS_APPLYING_FOR_ADVANCE || this.data.IS_ADVANCE_TOUR_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Check All Information ', '');
    } else if (
      (this.data3.DELAYED_SUBMISSION_BILL == undefined ||
        this.data3.DELAYED_SUBMISSION_BILL == null ||
        this.data3.DELAYED_SUBMISSION_BILL == '') &&
      (!this.data.IS_APPLYING_FOR_ADVANCE || this.data.IS_ADVANCE_TOUR_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Check 3 No. Point ', '');
    } else if (
      (this.data3.ELECTION_DUTY == undefined ||
        this.data3.ELECTION_DUTY == null ||
        this.data3.ELECTION_DUTY == '') &&
      (!this.data.IS_APPLYING_FOR_ADVANCE || this.data.IS_ADVANCE_TOUR_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Check 6 No. Point ', '');
    } else if (
      (this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK == undefined ||
        this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK == null ||
        this.data3.TICKET_BOOKED_THROUGH_TRAVEL_DESK == '') &&
      (!this.data.IS_APPLYING_FOR_ADVANCE || this.data.IS_ADVANCE_TOUR_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Check 7 No. Point ', '');
    } else if (
      (this.data.TOUR_STATUS == undefined ||
        this.data.TOUR_STATUS == null ||
        this.data.TOUR_STATUS == 'T') &&
      (!this.data.IS_APPLYING_FOR_ADVANCE || this.data.IS_ADVANCE_TOUR_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please select the claim status', '');
    } else if (
      (this.data.TOUR_STATUS == 'R' ||
        this.data.TOUR_STATUS == 'H' ||
        this.data.TOUR_STATUS == 'AR' ||
        this.data.TOUR_STATUS == 'AH') &&
      (this.data['TOUR_REMARK'] == undefined ||
        this.data['TOUR_REMARK'] == null ||
        this.data['TOUR_REMARK'] == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Remark', '');
    } else if (
      (this.data.TOUR_STATUS == 'H' || this.data.TOUR_STATUS == 'AH') &&
      (this.data['TOUR_HOLD_DATE'] == undefined ||
        this.data['TOUR_HOLD_DATE'] == null ||
        this.data['TOUR_HOLD_DATE'] == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Hold Date', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_ADVANCE_TOUR_CREATED
    ) {
      if (
        this.data.TOUR_STATUS == 'AH' ||
        this.data.TOUR_STATUS == 'AR' ||
        this.data.TOUR_STATUS == 'AA'
      ) {
      } else {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Change the claim status', '');
      }
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      this.data.IS_ADVANCE_TOUR_CREATED
    ) {
      if (
        this.data.TOUR_STATUS == 'AH' ||
        this.data.TOUR_STATUS == 'AR' ||
        this.data.TOUR_STATUS == 'AA'
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Change the claim status', '');
      }
    }

    if (this.isOk) {
      if (this.data.TOUR_STATUS == 'AH') {
        this.data.CURRENT_STAGE_ID = 4;
      } else if (this.data.TOUR_STATUS == 'AR') {
        this.data.CURRENT_STAGE_ID = 5;
      } else if (this.data.TOUR_STATUS == 'AA') {
        this.data.CURRENT_STAGE_ID = 6;
      } else if (this.data.TOUR_STATUS == 'H') {
        this.data.CURRENT_STAGE_ID = 8;
      } else if (this.data.TOUR_STATUS == 'R') {
        this.data.CURRENT_STAGE_ID = 9;
      } else if (this.data.TOUR_STATUS == 'A') {
        this.data.CURRENT_STAGE_ID = 10;
      }
      this.isSpinning = true;
      this.api.updatetour(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          if (this.data3.ID) {
            this.api
              .updatetourmasterchecklist(this.data3)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
                  this.isSpinning = false;
                  this.current = 0;
                  if (!addNew) this.drawerClose();
                } else {
                  this.message.error('Information Has Not Changed...', '');
                  this.isSpinning = false;
                }
              });
          } else {
            this.api
              .createtourmasterchecklist(this.data3)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success('Information Save Successfully...', '');
                  this.isSpinning = false;
                  this.current = 0;
                  if (!addNew) this.drawerClose();
                  else {
                    this.data3 = new Checklisttour();
                  }
                } else {
                  this.message.error('Failed To Fill Information...', '');
                  this.isSpinning = false;
                }
              });
          }
          this.isSpinning = false;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    }
  }

  isAdvanceTaken(event: any) {
    if (event == false) {
      if (
        this.data.AMOUNT_OF_T_A != null ||
        this.data.AMOUNT_OF_T_A != undefined
      ) {
        this.data.AMOUNT_OF_T_A = null;
      } else {
        this.data.AMOUNT_OF_T_A = null;
      }
      if (
        this.data.ADVANCE_TAKEN_DATE != null ||
        this.data.ADVANCE_TAKEN_DATE != undefined
      ) {
        this.data.ADVANCE_TAKEN_DATE = null;
      } else {
        this.data.ADVANCE_TAKEN_DATE = null;
      }
      if (
        this.data.ADVANCE_TAKEN_VOUCHER_NO != null ||
        this.data.ADVANCE_TAKEN_VOUCHER_NO != undefined
      ) {
        this.data.ADVANCE_TAKEN_VOUCHER_NO = null;
      } else {
        this.data.ADVANCE_TAKEN_VOUCHER_NO = null;
      }
    } else {
    }
  }

  updatecall() {
    this.api.updatetour(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.message.success('File Uploaded Successfully', '');
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }
  SR61FileURL: any;
  progressBarS_R_61: boolean = false;
  percentS_R_61 = 0;
  timerS_R_61: any;
  onFileSelectedSR61(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.SR61FileURL = <File>event.target.files[0];

      if (this.SR61FileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.SR61FileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (this.data.S_R_61 != undefined && this.data.S_R_61.trim() != '') {
          var arr = this.data.S_R_61.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarS_R_61 = true;
      this.timerS_R_61 = this.api
        .onUpload('S_R_61', this.SR61FileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentS_R_61 = percentDone;
            if (this.percentS_R_61 == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarS_R_61 = false;
            this.percentS_R_61 = 0;
            this.SR61FileURL = null;
            this.data.S_R_61 = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.S_R_61 = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.SR61FileURL = null;
      this.data.S_R_61 = null;
      this.isSpinning = false;
    }
  }

  bankMandateFormFileURL: any;
  progressBarbankMandateForm: boolean = false;
  percentbankMandateForm = 0;
  timerbankMandateForm: any;
  onFileSelectedBankMandateForm(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.bankMandateFormFileURL = <File>event.target.files[0];

      if (this.bankMandateFormFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.bankMandateFormFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.BANK_MANDATE_FORM != undefined &&
          this.data.BANK_MANDATE_FORM.trim() != ''
        ) {
          var arr = this.data.BANK_MANDATE_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarbankMandateForm = true;
      this.timerbankMandateForm = this.api
        .onUpload('bankMandateForm', this.bankMandateFormFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentbankMandateForm = percentDone;
            if (this.percentbankMandateForm == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarbankMandateForm = false;
            this.percentbankMandateForm = 0;
            this.bankMandateFormFileURL = null;
            this.data.BANK_MANDATE_FORM = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              // this.message.success('File Uploaded Successfully...', '');
              this.data.BANK_MANDATE_FORM = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (res.body['code'] == 200) {
          //   this.data.BANK_MANDATE_FORM = url;
          //   this.updatecall();
          //   this.isSpinning = false;
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          //   this.progressBarbankMandateForm = false;
          //   this.percentbankMandateForm = 0;
          //   this.bankMandateFormFileURL = null;
          //   this.data.BANK_MANDATE_FORM = null;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.bankMandateFormFileURL = null;
      this.data.BANK_MANDATE_FORM = null;
      this.isSpinning = false;
    }
  }
  selfDeclarationFormFileURL: any;
  progressBartourSelfDeclaration: boolean = false;
  percenttourSelfDeclaration = 0;
  timertourSelfDeclaration: any;
  onFileSelectedSelfDeclaration(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.selfDeclarationFormFileURL = <File>event.target.files[0];

      if (this.selfDeclarationFormFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.selfDeclarationFormFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_SELF_DECLARATION != undefined &&
          this.data.TOUR_SELF_DECLARATION.trim() != ''
        ) {
          var arr = this.data.TOUR_SELF_DECLARATION.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBartourSelfDeclaration = true;
      this.timertourSelfDeclaration = this.api
        .onUpload('tourSelfDeclaration', this.selfDeclarationFormFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          // if (res.type === HttpEventType.UploadProgress) {
          //   const percentDone = Math.round((100 * res.loaded) / res.total);
          //   this.percenttourSelfDeclaration = percentDone;
          //   if (this.percenttourSelfDeclaration == 100) {
          //     this.isSpinning = false;
          //   }
          // }
          // if (res.body['code'] == 200) {
          //   this.data.TOUR_SELF_DECLARATION = url;
          //   this.updatecall();
          //   this.isSpinning = false;
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          //   this.progressBartourSelfDeclaration = false;
          //   this.percenttourSelfDeclaration = 0;
          //   this.selfDeclarationFormFileURL = null;
          //   this.data.TOUR_SELF_DECLARATION = null;
          // }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourSelfDeclaration = percentDone;
            if (this.percenttourSelfDeclaration == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourSelfDeclaration = false;
            this.percenttourSelfDeclaration = 0;
            this.selfDeclarationFormFileURL = null;
            this.data.TOUR_SELF_DECLARATION = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.TOUR_SELF_DECLARATION = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.selfDeclarationFormFileURL = null;
      this.data.TOUR_SELF_DECLARATION = null;
      this.isSpinning = false;
    }
  }

  tourDelayCondolation: any;
  progressBartourDelayCondolation: boolean = false;
  percenttourDelayCondolation = 0;
  timertourDelayCondolation: any;
  onFileSelectedtourDelayCondolation(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.tourDelayCondolation = <File>event.target.files[0];

      if (this.tourDelayCondolation != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.tourDelayCondolation.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_DELAY_CONDOLATION_URL != undefined &&
          this.data.TOUR_DELAY_CONDOLATION_URL.trim() != ''
        ) {
          var arr = this.data.TOUR_DELAY_CONDOLATION_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBartourDelayCondolation = true;
      this.timertourDelayCondolation = this.api
        .onUpload('tourDelayCondolation', this.tourDelayCondolation, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourDelayCondolation = percentDone;
            if (this.percenttourDelayCondolation == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourDelayCondolation = false;
            this.percenttourDelayCondolation = 0;
            this.tourDelayCondolation = null;
            this.data.TOUR_DELAY_CONDOLATION_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.TOUR_DELAY_CONDOLATION_URL = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
          // if (res.body['code'] == 200) {

          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          //   this.progressBartourDelayCondolation = false;
          //   this.percenttourDelayCondolation = 0;
          //   this.tourDelayCondolation = null;
          //   this.data.TOUR_DELAY_CONDOLATION_URL = null;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.tourDelayCondolation = null;
      this.data.TOUR_DELAY_CONDOLATION_URL = null;
      this.isSpinning = false;
    }
  }

  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'S_R_61/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'bankMandateForm/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'tourSelfDeclaration/' + link;
    }
    if (this.view == 4) {
      var a: any = this.api.retriveimgUrl + 'tourDelayCondolation/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    this.printOrderModalVisible = true;
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  SR61ViewAssumptionPDF(pdfURL: string): void {
    this.view = 1;
    this.getS(pdfURL);
  }
  bankViewMandateFormPDF(pdfURL: string): void {
    this.view = 2;
    this.getS(pdfURL);
  }
  viewSelfDeclarationFormPDF(pdfURL: string): void {
    this.view = 3;
    this.getS(pdfURL);
  }
  viewDelayCondonationPDF(pdfURL: string): void {
    this.view = 4;
    this.getS(pdfURL);
  }

  deleteCancel() {}
  getAfterDelete() {
    this.isSpinning = true;
    this.api.gettouralldata(0, 0, '', '', ' AND ID =' + this.tourID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.data = data['data'][0];
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  sr61DeleteConfirm(data) {
    this.isSpinning = true;
    this.api.deletePdf('S_R_61/' + data.S_R_61).subscribe((successCode) => {
      if (successCode['code'] == '200') {
        this.data.S_R_61 = null;
        this.api.updatetour(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.getAfterDelete();
            this.progressBarS_R_61 = false;
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

  bankMandateDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('bankMandateForm/' + data.BANK_MANDATE_FORM)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.BANK_MANDATE_FORM = null;
          this.api.updatetour(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarbankMandateForm = false;
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
  selfDecDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('tourSelfDeclaration/' + data.TOUR_SELF_DECLARATION)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TOUR_SELF_DECLARATION = null;
          this.api.updatetour(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartourSelfDeclaration = false;
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
  delayDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('tourDelayCondolation/' + data.TOUR_DELAY_CONDOLATION_URL)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TOUR_DELAY_CONDOLATION_URL = null;
          this.api.updatetour(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartourDelayCondolation = false;
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

  changeondvance(event: any) {}

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.data.DURATION_START_DATE)) <
    0;

  treatEndDate() {
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data.DURATION_START_DATE)
      ) < 0;
  }
  NominationDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('tourNominationLetter/' + data.NOMINATION_LETTER)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.NOMINATION_LETTER = null;
          this.api.updatetour(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarNomination = false;
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
  viewNomination(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'tourNominationLetter/' + pdfURL);
  }

  Nomination: any;
  progressBarNomination: boolean = false;
  percentNomination = 0;
  timerNomination: any;
  onFileSelectedtourNomination(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.Nomination = <File>event.target.files[0];

      if (this.Nomination != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.Nomination.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.NOMINATION_LETTER != undefined &&
          this.data.NOMINATION_LETTER.trim() != ''
        ) {
          var arr = this.data.NOMINATION_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarNomination = true;
      this.timerNomination = this.api
        .onUpload('tourNominationLetter', this.Nomination, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentNomination = percentDone;
            if (this.percentNomination == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarNomination = false;
            this.percentNomination = 0;
            this.Nomination = null;
            this.data.NOMINATION_LETTER = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.NOMINATION_LETTER = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.Nomination = null;
      this.data.NOMINATION_LETTER = null;
      this.isSpinning = false;
    }
  }
  SalaryslipDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('tourSalarySlip/' + data.SALARY_SLIP)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.SALARY_SLIP = null;
          this.api.updatetour(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarSalaryslip = false;
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
  viewSalaryslip(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'tourSalarySlip/' + pdfURL);
  }

  Salaryslip: any;
  progressBarSalaryslip: boolean = false;
  percentSalaryslip = 0;
  timerSalaryslip: any;
  onFileSelectedtourSalaryslip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.Salaryslip = <File>event.target.files[0];

      if (this.Salaryslip != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.Salaryslip.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.SALARY_SLIP != undefined &&
          this.data.SALARY_SLIP.trim() != ''
        ) {
          var arr = this.data.SALARY_SLIP.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarSalaryslip = true;
      this.timerSalaryslip = this.api
        .onUpload('tourSalarySlip', this.Salaryslip, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentSalaryslip = percentDone;
            if (this.percentSalaryslip == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarSalaryslip = false;
            this.percentSalaryslip = 0;
            this.Salaryslip = null;
            this.data.SALARY_SLIP = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.SALARY_SLIP = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.Salaryslip = null;
      this.data.SALARY_SLIP = null;
      this.isSpinning = false;
    }
  }

  totalcalculate(event: any) {
    this.data.TOTAL_ALLOWANCE = 0;
    this.data.TOTAL_ALLOWANCE =
      Number(event) + Number(this.data.HALT_ALLOWANCE);
  }
  totalcalculate1(event: any) {
    this.data.TOTAL_ALLOWANCE = 0;
    this.data.TOTAL_ALLOWANCE =
      Number(event) + Number(this.data.JOURNEY_PERIOD_ALLOWANCE);
  }

  current1: any = 0;
  getcurrent() {
    if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_ADVANCE_TOUR_CREATED
    ) {
      return this.current1;
    } else {
      return this.current;
    }
  }
}
