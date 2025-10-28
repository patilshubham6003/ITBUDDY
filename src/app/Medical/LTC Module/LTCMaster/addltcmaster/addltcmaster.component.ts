import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { LTCMaster } from 'src/app/Medical/Models/LTCMaster';
import { LTCQuestionaryMaster } from 'src/app/Medical/Models/LTCQuestionaryMaster';
import { roadRail } from 'src/app/Medical/Models/RoadRail';
import { journeyP } from 'src/app/Medical/Models/journeyParticular';
import { Journeydetails } from 'src/app/Medical/Models/journeydetails';
import { Realtionshipdata } from 'src/app/Medical/Models/relationship';
import { Travelmode } from 'src/app/Medical/Models/travelmode';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';

export class advJourneyDetails {
  DEPARTURE_FROM: any = '';
  ARRIVAL_TO: any = '';
  NO_OF_FAIRS: any = '';
  JOURNEY_CLAIMED_AMOUNT: any = '';
  TRAVEL_MODE_ID: any = '';
  TRAVEL_CLASS_ID: any = '';
  TRAVEL_MODE_NAME: any = '';
  TRAVEL_CLASS_NAME: any = '';
  FROM_DATETIME: any = '';
  TO_DATETIME: any = '';
  IS_DELETED: any = 0;
}

@Component({
  selector: 'app-addltcmaster',
  templateUrl: './addltcmaster.component.html',
  styleUrls: ['./addltcmaster.component.css'],
  providers: [NzNotificationService],
})
export class AddltcmasterComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService,
    private sanitizer: DomSanitizer
  ) {}
  userId: any;
  isAdmin: boolean = false;
  roleId: any;
  stepCurrent: any = 0;
  DDO_ID: any = Number(sessionStorage.getItem('ddoId'));
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.stepCurrent = this.stepCurrent;
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
    // this.allEmployeeList();
    this.loadOnlySelectedEmployee();
    this.BlockYears();
    this.fileNumberList();
    this.ListOfDesignation();
    this.gradePayLevelList();
    this.getMode();
    this.ddoOfTheOfficialList();
    this.current = this.current;
    this.userId = Number(sessionStorage.getItem('userId'));
    if (this.data.ID) {
      if (
        this.data.ADVANCE_ORDER_YEAR != '' &&
        this.data.ADVANCE_ORDER_YEAR != null &&
        this.data.ADVANCE_ORDER_YEAR != undefined
      ) {
        this.clearAdvanceBlockCalanderYearEdit(this.data.ADVANCE_ORDER_YEAR);
      } else {
        this.advanceBlockYearList = [];
      }
      if (
        this.data.FINAL_ORDER_YEAR != '' &&
        this.data.FINAL_ORDER_YEAR != null &&
        this.data.FINAL_ORDER_YEAR != undefined
      ) {
        this.clearFinalBlockCalanderYearEdit(this.data.FINAL_ORDER_YEAR);
      } else {
        this.finalBlockYearList = [];
      }
    }
  }
  mobpattern = /[6-9]{1}[0-9]{9}/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() isSpinning = false;
  @Input() relationdata: any = [];
  @Input() journeyData: any = [];

  @Input() journey: any;
  isOk = true;
  HEADQUARTERS: any;

  @Input()
  drawerVisible: boolean = false;
  empDrawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: LTCMaster;

  @Input() empID: any;
  @Input() ltcID: any;

  QueData: LTCQuestionaryMaster = new LTCQuestionaryMaster();

  @Input() current = 0;
  employee: EmployeeMaster[] = [];

  Cities: EmployeeMaster[];
  filteredOptions: any = [];
  Names = EmployeeMaster;

  empLoader: boolean = false;
  orderdata1 = [];
  travelmode = new Travelmode();
  drawerTitleform1!: string;
  drawerVisible2form1: boolean = false;
  drawerData2form1: roadRail = new roadRail();
  blockYearList: any = [];
  advanceBlockYearList: any = [];
  designationList: any = [];
  gradePayLevelDataList: any = [];
  ddoOfTheOfficialDataList: any = [];

  classMode: any = [];
  loggedInDDO: any;
  ddoOfTheOfficialList() {
    this.isSpinning = true;
    this.api.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
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
          this.isSpinning = false;
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
              this.data.DDO_OF_THE_OFFICIAL_ID === null ||
              this.data.DDO_OF_THE_OFFICIAL_ID === undefined ||
              this.data.DDO_OF_THE_OFFICIAL_ID === '' ||
              this.data.DDO_OF_THE_OFFICIAL_ID === 0
            ) {
              this.data.DDO_OF_THE_OFFICIAL_ID = Number(
                sessionStorage.getItem('ddoId')
              );
            } else {
              this.data.DDO_OF_THE_OFFICIAL_ID =
                this.data.DDO_OF_THE_OFFICIAL_ID;
            }
          }
        } else {
          this.ddoOfTheOfficialDataList = [];
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  getClasses(event: any) {
    if (event != null && event != undefined && event != '') {
      this.classMode = [];
      this.editJourneyRecord.TRAVEL_CLASS_ID = null;
      this.api
        .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID=' + event)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.classMode = data['data'];
            }
          },
          (err) => {}
        );
    } else {
      this.classMode = [];
      this.editJourneyRecord.TRAVEL_CLASS_ID = null;
    }
  }
  travelMode: any = [];
  getMode() {
    this.api.gettravelmode(0, 0, '', '', ' AND ID in (4,5)').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.travelMode = data['data'];
        }
      },
      (err) => {}
    );
  }
  gradePayLevelList() {
    this.isSpinning = true;
    this.api
      .getAllGradePayLevel(0, 0, 'ID', 'ASC', ' AND STATUS = 1')
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.gradePayLevelDataList = data['data'];
            } else {
              this.gradePayLevelDataList = [];
            }
            this.isSpinning = false;
          } else {
            this.gradePayLevelDataList = [];
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
  BlockYears(): void {
    var likeQuery: any = '';
    if (
      this.data.ORDER_YEAR != undefined &&
      this.data.ORDER_YEAR != null &&
      this.data.ORDER_YEAR != ''
    ) {
      if (this.data.ORDER_YEAR == 'Block Year') {
        likeQuery = " AND YEAR like '%-%'";
      } else {
        likeQuery = " AND YEAR not like '%-%'";
      }
      this.api
        .getBlockYearMaster(0, 0, '', 'asc', ' AND STATUS = 1' + likeQuery)
        .subscribe((data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.blockYearList = data['data'];
            } else {
              this.blockYearList = [];
            }
          } else {
            this.blockYearList = [];
          }
        });
    }
  }

  disabledAppointmentDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  clearAdvanceData(event) {
    if (event == 0) {
      this.data.APPOINTMENT_DATE = null;
      this.data.HOMETOWN = null;
      this.data.PARTICULARS_BLOCK_YEAR = null;
      this.data.PARTICULARS_HOMETOWN = null;
      this.data.AVAIL_BLOCK_YEAR = null;
      this.data.AVAILS_CL_EL = null;
      this.data.LTC_ADVACNE_SETTLED = null;
      this.data.PLACE_OF_VISIT = null;
      this.data.JOURNEY_ONWARD_PROPOSED_DATE = null;
      this.data.JOURNEY_RETURN_PROBABLE_DATE = null;
      this.data.REQUIRED_ADVANCE_AMOUNT = null;
      // this.data.AMOUNT_OF_SINGLE_FARE = null;
      // this.data.NUMBER_OF_FARE = null;
      // this.data.TRAVEL_MODE_ID = null;
      // this.data.CLASS_OF_MODE_ID = null;
      this.data.ADVANCE_ORDER_YEAR == '';
    } else {
      this.data.NATURE_OF_LEAVE == null;
      this.data.LEAVE_START_DATE == null;
      this.data.LEAVE_END_DATE == null;
      this.data.ORDER_YEAR == '';
      this.data.BLOCK_YEAR_ID == null;
    }
  }
  LTCID: any;
  addform1(): void {
    this.drawerTitleform1 = 'Add Places Details Which Are Connected By Rail';
    this.drawerData2form1 = new roadRail();

    this.ltcID = this.ltcID;
    this.drawerVisible2form1 = true;
  }

  drawerClose2form1(): void {
    this.drawerVisible2form1 = false;
    this.getDataform1();
  }

  get closeCallbackform1form1() {
    return this.drawerClose2form1.bind(this);
  }

  switch = false;

  switch1 = false;
  switchChange1(e: boolean) {
    this.switch1 != e;
    this.data.IS_ADVANCE_TAKEN = null;
  }

  drawerTitleform3!: string;
  drawerVisibleform3: boolean = false;
  drawerDataform3: journeyP = new journeyP();

  addform3(): void {
    this.drawerTitleform3 = 'Add Details Of Accommodation Class';
    this.drawerDataform3 = new journeyP();
    this.ltcID = this.ltcID;
    this.drawerVisibleform3 = true;
  }

  drawerCloseform3(): void {
    this.getDataform3();
    this.drawerVisibleform3 = false;
  }

  get closeCallbackform3() {
    return this.drawerCloseform3.bind(this);
  }
  gradePayLevel: any;
  drawerTitleform7!: string;
  drawerVisibleform7: boolean = false;
  drawerDataform7: Journeydetails = new Journeydetails();

  addform7(): void {
    this.drawerTitleform7 = 'Add Details of Journeys(s)';
    this.drawerDataform7 = new Journeydetails();
    this.gradePayLevel = this.data.GRADE_PAY_LEVEL;
    this.ltcID = this.ltcID;
    this.drawerVisibleform7 = true;
  }

  drawerCloseform7(): void {
    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];
        }
      });
    this.drawerVisibleform7 = false;
  }

  get closeCallbackform7() {
    return this.drawerCloseform7.bind(this);
  }

  formdata3: any = [];
  formdata2: any = [];
  formdata1: any = [];
  formdata7: any = [];
  getDataform3() {
    this.api
      .getJourneyParticular(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata3 = data['data'];
        }
      });
  }

  getDataform2() {
    this.api
      .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata7 = data['data'];
        }
      });
  }
  cancel() {}
  deleteCancel() {}
  confirmDeleterelation(data: any, i: number) {
    this.relationdata = this.relationdata.filter((item, index) => index != i);

    this.relationdata = [...[], ...this.relationdata];
  }

  getDataform1() {
    this.api
      .ltcRoadConnectedRail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.formdata1 = data['data'];
        }
      });
  }

  deleteConfirm(data: any) {
    (data.IS_DELETED = 1),
      this.api.ltcJourneyDetailUpdate(data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Record Deleted Successfully...', '');
          this.getDataform2();
        } else {
          this.message.error('Information Has Not Deleted...', '');
        }
      });
  }

  deleteConfirmparticular(data: any) {
    (data.IS_DELETED = 1),
      this.api.updateJourneyParticular(data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Record Deleted Successfully...', '');
          this.getDataform3();
        } else {
          this.message.error('Information Has Not Deleted...', '');
        }
      });
  }

  deleteConfirmlitcroad(data: any) {
    (data.IS_DELETED = 1),
      this.api
        .ltcRoadConnectedRailUpdate(data, this.ltcID)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Record Deleted Successfully...', '');
            this.getDataform1();
          } else {
            this.message.error('Information Has Not Deleted...', '');
          }
        });
  }

  // getDataform7() {
  //   this.api
  //     .getAllltcMaster(0, 0, '', 'asc', ' AND ID =' + this.ltcID)
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.formdata7 = data['data'];
  //       }
  //     });
  // }

  getTimeIn12Hour(time: any) {
    return this.datepipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }
  checkboxdatais: boolean = false;
  chechboxdata(event: any) {
    this.checkboxdatais = event;
  }

  showtable1(event: any) {}
  class = [];
  editform3(data: journeyP): void {
    this.drawerTitleform3 = 'Edit Details Of Accommodation Class';
    this.drawerDataform3 = Object.assign({}, data);
    this.ltcID = this.ltcID;
    this.api
      .gettravelclass(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND MODE_ID=' + data.MODE_OF_CONVEYANCE_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.class = data['data'];
            this.drawerVisibleform3 = true;
          } else {
          }
        },
        (err) => {}
      );
  }

  classdata: any;
  editform7(data: Journeydetails): void {
    this.drawerTitleform7 = 'Edit Details of Journeys(s)';
    this.gradePayLevel = this.data.GRADE_PAY_LEVEL;
    this.drawerDataform7 = Object.assign({}, data);
    this.api
      .gettravelclass(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND ID=' + data.TRAVEL_CLASS_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classdata = data['data'];
          }
        },
        (err) => {}
      );

    this.ltcID = this.ltcID;
    this.drawerVisibleform7 = true;
  }
  dataList: any = [];

  editform1(data: roadRail): void {
    this.drawerTitleform1 = 'Edit Places Details Which Are Connected By Rail';
    this.drawerData2form1 = Object.assign({}, data);
    this.data.LTC_ID = this.ltcID;

    this.drawerVisible2form1 = true;
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
    // if (this.data.EMP_ID != null || this.data.EMP_ID != undefined) {
    //   this.api
    //     .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           if (
    //             data['data'][0]['SALUTATION'] == null ||
    //             data['data'][0]['SALUTATION'] == undefined ||
    //             data['data'][0]['SALUTATION'] == ''
    //           ) {
    //             this.data.SALUTATION = this.data.SALUTATION;
    //           } else {
    //             this.data.SALUTATION = data['data'][0]['SALUTATION'];
    //           }
    //           this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
    //           this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
    //           this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
    //           this.data.LOCATION = data['data'][0]['LOCATION'];
    //           this.data.DDO_OF_THE_OFFICIAL =
    //             data['data'][0]['DDO_OF_THE_OFFICIAL'];
    //           this.data.DDO_OF_THE_OFFICIAL_ID =
    //             data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
    //           this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
    //           this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
    //           this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
    //           this.data.ADDRESS = data['data'][0]['ADDRESS'];
    //           this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
    //           this.data.GRADE_PAY_LEVEL_ID =
    //             data['data'][0]['GRADE_PAY_LEVEL_ID'];
    //         } else {
    //           this.message.error("Can't Load Employee Data", '');
    //         }
    //       },
    //       (err) => {}
    //     );
    // } else {
    // }
  }
  allEmployeeList111() {
    this.empLoader = true;
    // this.api.getEmployeeMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.employee = data['data'];
    //       this.filteredOptions = this.employee;
    //       this.empLoader = false;
    //     } else {
    //       this.message.error("Can't Load Employee Data", '');
    //       this.empLoader = false;
    //     }
    //   },
    //   (err) => {}
    // );
    if (this.data.EMP_ID != null || this.data.EMP_ID != undefined) {
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (
                data['data'][0]['SALUTATION'] == null ||
                data['data'][0]['SALUTATION'] == undefined ||
                data['data'][0]['SALUTATION'] == ''
              ) {
                this.data.SALUTATION = this.data.SALUTATION;
              } else {
                this.data.SALUTATION = data['data'][0]['SALUTATION'];
              }
              this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
              this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
              this.data.LOCATION = data['data'][0]['LOCATION'];
              this.data.DDO_OF_THE_OFFICIAL =
                data['data'][0]['DDO_OF_THE_OFFICIAL'];
              if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
                this.data.DDO_OF_THE_OFFICIAL_ID = Number(
                  sessionStorage.getItem('ddoId')
                );
              } else {
                this.data.DDO_OF_THE_OFFICIAL_ID =
                  data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
              }
              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.ADDRESS = data['data'][0]['ADDRESS'];
              this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
              this.data.GRADE_PAY_LEVEL_ID =
                data['data'][0]['GRADE_PAY_LEVEL_ID'];
              this.empLoader = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              this.empLoader = false;
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  pageSize = 50;
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
          this.pageSize,
          '',
          '',
          ' AND STATUS = 1 '
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

  close(): void {
    this.current = 0;
    this.drawerClose();
  }

  applicantResetDrawer(ITCMasterPages: NgForm) {
    this.data = new LTCMaster();
    ITCMasterPages.form.reset();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  AlldataSave(addNew: boolean) {
    this.isOk = true;
    this.isSpinning = false;

    if (
      this.data.IS_ADVANCE_CLAIM == false &&
      (this.data.IS_ADVANCE_TAKEN == true || this.data.IS_ADVANCE_TAKEN == 1)
    ) {
      if (
        this.data.AMOUNT_OF_ADVANCE == undefined ||
        this.data.AMOUNT_OF_ADVANCE == 0
      ) {
        this.message.error('Please enter advance amount', '');
        this.isOk = false;
      }
    }

    this.data.ID = this.ltcID;
    if (this.isOk && this.data.ID != undefined) {
      this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.ltcID = successCode.LTC_ID;
          this.next();
        } else {
          this.message.error('Failed To Save Information....', '');
          this.isSpinning = false;
        }
      });
    }
  }

  disabledEndDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  disabledStartDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  currentDate: Date = new Date();
  leaveFromDate() {
    if (
      this.data.LEAVE_END_DATE == null ||
      this.data.LEAVE_END_DATE == undefined ||
      this.data.LEAVE_END_DATE == ''
    ) {
      this.disabledStartDate = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.currentDate)) > 0;
    } else {
      this.disabledStartDate = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.data.LEAVE_END_DATE)) >
        0;
    }
  }
  leaveToDate() {
    if (
      this.data.LEAVE_START_DATE == null ||
      this.data.LEAVE_START_DATE == undefined ||
      this.data.LEAVE_START_DATE == ''
    ) {
      this.disabledEndDate = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.currentDate)) > 0;
    } else {
      this.disabledEndDate = (current: Date): boolean =>
        differenceInCalendarDays(
          current,
          new Date(this.data.LEAVE_START_DATE)
        ) < 0;
    }
  }
  showcreatemsg: boolean = false;
  empSave(): void {
    this.isSpinning = true;
    if (
      this.data.INSPECTOR_ID == null ||
      this.data.INSPECTOR_ID == undefined ||
      this.data.INSPECTOR_ID == '' ||
      this.data.INSPECTOR_ID == 0
    ) {
      this.data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
    } else {
      this.data.INSPECTOR_ID = this.data.INSPECTOR_ID;
    }
    if (
      this.data.SUB_INSPECTOR_ID == null ||
      this.data.SUB_INSPECTOR_ID == undefined ||
      this.data.SUB_INSPECTOR_ID == ''
    ) {
      this.data.SUB_INSPECTOR_ID = Number(
        sessionStorage.getItem('parentUserID')
      );
    } else {
      this.data.SUB_INSPECTOR_ID = this.data.SUB_INSPECTOR_ID;
    }
    this.data.familyData = this.relationdata;
    this.isOk = true;
    if (
      this.data.EMP_ID == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      // this.data.EMPLOYEE_CODE == undefined &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&/
      (this.data.GRADE_PAY == undefined || this.data.GRADE_PAY == 0) &&
      // (this.data.MOBILE_NO == undefined || this.data.MOBILE_NO == 0) &&
      (this.data.NATURE_OF_LEAVE == undefined ||
        this.data.NATURE_OF_LEAVE == 0) &&
      (this.data.LEAVE_START_DATE == undefined ||
        this.data.LEAVE_START_DATE == null) &&
      (this.data.LEAVE_END_DATE == undefined ||
        this.data.LEAVE_END_DATE == null) &&
      this.data.GRADE_PAY_LEVEL_ID == undefined &&
      // this.data.EMAIL_ID == undefined &&
      this.data.BLOCK_YEAR_ID == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.SALUTATION == undefined ||
      this.data.SALUTATION == null ||
      this.data.SALUTATION == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Salutation', '');
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
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Employee Code', '');
      // } else if (
      //   this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == 0
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Select DDO Of The Official', '');
    } else if (
      this.data.GRADE_PAY === undefined ||
      this.data.GRADE_PAY === null ||
      this.data.GRADE_PAY === ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Basic Pay', '');
    } else if (
      this.data.GRADE_PAY_LEVEL_ID == undefined ||
      this.data.GRADE_PAY_LEVEL_ID == null ||
      this.data.GRADE_PAY_LEVEL_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Grade Pay Level', '');
      // } else if (
      //   this.data.EMAIL_ID == undefined ||
      //   this.data.EMAIL_ID == null ||
      //   this.data.EMAIL_ID == ''
      // ) {
      //   this.isOk = false;
      //     this.isSpinning = false;
      //   this.message.error(' Please Enter Email ID', '');
      // } else if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO == ''
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Mobile Number', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.APPOINTMENT_DATE == undefined ||
      //     this.data.APPOINTMENT_DATE == null ||
      //     this.data.APPOINTMENT_DATE == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Select Appointment Date', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.HOMETOWN == undefined ||
      //     this.data.HOMETOWN == null ||
      //     this.data.HOMETOWN == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Hometown', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.PARTICULARS_BLOCK_YEAR == undefined ||
      //     this.data.PARTICULARS_BLOCK_YEAR == null ||
      //     this.data.PARTICULARS_BLOCK_YEAR == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Particulars Of Block Year', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.PARTICULARS_HOMETOWN == undefined ||
      //     this.data.PARTICULARS_HOMETOWN == null ||
      //     this.data.PARTICULARS_HOMETOWN == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Particulars Of Home Town', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.ANYWHERE_IN_INDIA == undefined ||
      //     this.data.ANYWHERE_IN_INDIA == null ||
      //     this.data.ANYWHERE_IN_INDIA == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Any Where In India', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.AVAIL_BLOCK_YEAR == undefined ||
      //     this.data.AVAIL_BLOCK_YEAR == null ||
      //     this.data.AVAIL_BLOCK_YEAR == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Avail Block Year', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.AVAILS_CL_EL == undefined ||
      //     this.data.AVAILS_CL_EL == null ||
      //     this.data.AVAILS_CL_EL == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Avail CL or EL', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.LTC_ADVACNE_SETTLED == undefined ||
      //     this.data.LTC_ADVACNE_SETTLED == null ||
      //     this.data.LTC_ADVACNE_SETTLED == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Whether Advance Already Taken', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.PLACE_OF_VISIT == undefined ||
      //     this.data.PLACE_OF_VISIT == null ||
      //     this.data.PLACE_OF_VISIT == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Place Of Visit', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.JOURNEY_ONWARD_PROPOSED_DATE == undefined ||
      //     this.data.JOURNEY_ONWARD_PROPOSED_DATE == null ||
      //     this.data.JOURNEY_ONWARD_PROPOSED_DATE == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Select Onward Journey Date', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.JOURNEY_RETURN_PROBABLE_DATE == undefined ||
      //     this.data.JOURNEY_RETURN_PROBABLE_DATE == null ||
      //     this.data.JOURNEY_RETURN_PROBABLE_DATE == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Select Return Journey Date', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.AMOUNT_OF_SINGLE_FARE == undefined ||
      //     this.data.AMOUNT_OF_SINGLE_FARE == null ||
      //     this.data.AMOUNT_OF_SINGLE_FARE == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Amount Of Single Fare', '');
      // } else if (
      //   this.data.IS_ADVANCE_CLAIM == true &&
      //   (this.data.NUMBER_OF_FARE == undefined ||
      //     this.data.NUMBER_OF_FARE == null ||
      //     this.data.NUMBER_OF_FARE == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Number Of Single Fare', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == true &&
      (this.data.REQUIRED_ADVANCE_AMOUNT == undefined ||
        this.data.REQUIRED_ADVANCE_AMOUNT == null ||
        this.data.REQUIRED_ADVANCE_AMOUNT == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Amount Of Advance Required', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == false &&
      (this.data.NATURE_OF_LEAVE == undefined ||
        this.data.NATURE_OF_LEAVE == null ||
        this.data.NATURE_OF_LEAVE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Nature Of Leave', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == false &&
      (this.data.LEAVE_START_DATE == undefined ||
        this.data.LEAVE_START_DATE == null ||
        this.data.LEAVE_START_DATE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Leave Start Date', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == false &&
      (this.data.LEAVE_END_DATE == undefined ||
        this.data.LEAVE_END_DATE == null ||
        this.data.LEAVE_END_DATE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Leave End Date', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == false &&
      this.data.ORDER_YEAR == 'Block Year' &&
      (this.data.BLOCK_YEAR_ID == undefined ||
        this.data.BLOCK_YEAR_ID == null ||
        this.data.BLOCK_YEAR_ID == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Block Year', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == false &&
      this.data.ORDER_YEAR == 'Calendar Year' &&
      (this.data.BLOCK_YEAR_ID == undefined ||
        this.data.BLOCK_YEAR_ID == null ||
        this.data.BLOCK_YEAR_ID == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Calendar Year', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == true &&
      this.journeyData.length == 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Add Advance Claim Journey Details', '');
    } else if (
      this.data.IS_ADVANCE_CLAIM == true &&
      this.journeyData.length > 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      var maxNoOfFairs: any = 0;
      const noOfFairsArray = this.journeyData.map((data) => data.NO_OF_FAIRS);
      maxNoOfFairs = Math.max(...noOfFairsArray);
      if (this.relationdata.length >= Number(maxNoOfFairs)) {
        this.isOk = true;
      } else {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(
          ' Please Add Particulars of Members Same As Mention In Number Of Fare In Journey Details',
          ''
        );
      }
    }

    if (this.isOk) {
      if (this.journeyData.length > 0) {
        var journey: any = '';
        journey = this.journeyData;
        this.data.JOURNEY_DATA = JSON.stringify(journey);
      } else {
        this.data.JOURNEY_DATA = null;
      }

      this.data.familyData = this.relationdata;
      if (this.data.IS_ADVANCE_CLAIM == true) {
        this.data.IS_ADVANCE_TAKEN = true;
      } else {
        this.data.IS_ADVANCE_TAKEN = this.data.IS_ADVANCE_TAKEN;
      }
      this.isSpinning = true;
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
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID.trim() == ''
      ) {
        this.data.EMAIL_ID = '';
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
        this.data.MOBILE_NO === undefined ||
        this.data.MOBILE_NO === null ||
        this.data.MOBILE_NO === '' ||
        this.data.MOBILE_NO.trim() === ''
      ) {
        this.data.MOBILE_NO = '';
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
        this.data.LEAVE_START_DATE != undefined &&
        this.data.LEAVE_START_DATE != null &&
        this.data.LEAVE_START_DATE != ''
      ) {
        this.data.LEAVE_START_DATE = this.datepipe.transform(
          this.data.LEAVE_START_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data.LEAVE_END_DATE != undefined &&
        this.data.LEAVE_END_DATE != null &&
        this.data.LEAVE_END_DATE != ''
      ) {
        this.data.LEAVE_END_DATE = this.datepipe.transform(
          this.data.LEAVE_END_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data.APPOINTMENT_DATE != undefined &&
        this.data.APPOINTMENT_DATE != null &&
        this.data.APPOINTMENT_DATE != ''
      ) {
        this.data.APPOINTMENT_DATE = this.datepipe.transform(
          this.data.APPOINTMENT_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data.JOURNEY_ONWARD_PROPOSED_DATE != undefined &&
        this.data.JOURNEY_ONWARD_PROPOSED_DATE != null &&
        this.data.JOURNEY_ONWARD_PROPOSED_DATE != ''
      ) {
        this.data.JOURNEY_ONWARD_PROPOSED_DATE = this.datepipe.transform(
          this.data.JOURNEY_ONWARD_PROPOSED_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data.JOURNEY_RETURN_PROBABLE_DATE != undefined &&
        this.data.JOURNEY_RETURN_PROBABLE_DATE != null &&
        this.data.JOURNEY_RETURN_PROBABLE_DATE != ''
      ) {
        this.data.JOURNEY_RETURN_PROBABLE_DATE = this.datepipe.transform(
          this.data.JOURNEY_RETURN_PROBABLE_DATE,
          'yyyy-MM-dd'
        );
      }

      if (!this.ltcID) {
        this.data.IS_ADMIN_LTC = true;
      }
      if (this.data.ID) {
        if (
          this.data.familyData == undefined ||
          this.data.familyData.length == 0
        ) {
        } else {
          for (var i = 0; this.relationdata.length > i; i++) {
            this.relationdata[i]['ID'] = undefined;
          }
          this.data.familyData = this.relationdata;
        }
        this.data['LTC_ID'] = this.ltcID;
        this.api.ltcMasterLTCCreate(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.ltcID = successCode.LTC_ID;
            this.next();
            // this.isSpinning = false;
          } else if (successCode.code == '300' || successCode.code == '303') {
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
        this.data.APP_INFO_DATE_TIME = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        );
        this.data.TARVEL_DETAILS_SUBMITTED_DATE_TIME = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        );
        this.data.DOCUMENTS_SUBMITTED_DATE_TIME = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        );
        this.data.PARTA_DOWNLOAD_DATE_TIME = this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        );
        this.data.STEP_NO = 4;
        this.data.LTC_STATUS = 'T';
        this.api.ltcMasterLTCCreate(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.ltcID = successCode.LTC_ID;

            this.showcreatemsg = true;
            this.next();

            // this.isSpinning = false;
          } else if (successCode.code == '300' || successCode.code == '303') {
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
  queSave(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.LTC_STATUS == undefined ||
      this.data.LTC_STATUS == null ||
      this.data.LTC_STATUS == 'T'
    ) {
      this.isOk = false;
      this.message.error('Please Confirmation Claim', '');
    } else if (
      (this.data.LTC_STATUS == 'H' || this.data.LTC_STATUS == 'AH') &&
      (this.data.LTC_HOLD_DATE == undefined ||
        this.data.LTC_HOLD_DATE == null ||
        this.data.LTC_HOLD_DATE == '')
    ) {
      // else if (
      //   (this.data.IS_ADVANCE_CLAIM == false ||
      //     (this.data.IS_ADVANCE_CLAIM == true &&
      //       this.data.IS_ADVANCE_LTC_CREATED == true)) &&
      //   this.data.LTC_STATUS == 'H' &&
      //   (this.data.LTC_HOLD_DATE == undefined ||
      //     this.data.LTC_HOLD_DATE == null ||
      //     this.data.LTC_HOLD_DATE == '')
      // )
      this.isOk = false;
      this.message.error(' Please Select On Hold Date', '');
      // } else if (
      //   this.data.LTC_STATUS == 'H' &&
      //   (this.data.LTC_REMARK == undefined ||
      //     this.data.LTC_REMARK == null ||
      //     this.data.LTC_REMARK == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter On Hold Remark', '');
    } else if (
      (this.data.LTC_STATUS == 'R' ||
        this.data.LTC_STATUS == 'AR' ||
        this.data.LTC_STATUS == 'H' ||
        this.data.LTC_STATUS == 'AH') &&
      (this.data.LTC_REMARK == undefined ||
        this.data.LTC_REMARK == null ||
        this.data.LTC_REMARK == '')
    ) {
      this.isOk = false;
      if (this.data.LTC_STATUS == 'R' || this.data.LTC_STATUS == 'AR') {
        this.message.error(' Please Enter Reject Remark', '');
      } else {
        this.message.error(' Please Enter On Hold Remark', '');
      }
    } else if (
      this.data.IS_ADVANCE_CLAIM &&
      !this.data.IS_ADVANCE_LTC_CREATED
    ) {
      if (
        this.data.LTC_STATUS == 'AH' ||
        this.data.LTC_STATUS == 'AR' ||
        this.data.LTC_STATUS == 'AA'
      ) {
      } else {
        this.isOk = false;
        this.message.error('Please Change The Claim Status', '');
      }
    } else if (this.data.IS_ADVANCE_CLAIM && this.data.IS_ADVANCE_LTC_CREATED) {
      if (
        this.data.LTC_STATUS == 'AH' ||
        this.data.LTC_STATUS == 'AR' ||
        this.data.LTC_STATUS == 'AA'
      ) {
        this.isOk = false;
        this.message.error('Please Change The Claim Status', '');
      }
    }

    this.QueData.LTC_ID = this.ltcID;
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.LTC_STATUS == 'H') {
        if (
          this.data.LTC_HOLD_DATE != null &&
          this.data.LTC_HOLD_DATE != undefined &&
          this.data.LTC_HOLD_DATE != ''
        ) {
          this.data.LTC_HOLD_DATE = this.datepipe.transform(
            this.data.LTC_HOLD_DATE,
            'yyyy-MM-dd'
          );
        }
      } else {
        this.data.LTC_HOLD_DATE = null;
      }
      if (this.data.LTC_STATUS == 'R') {
        this.data.CURRENT_STAGE_ID = 5;
      } else if (this.data.LTC_STATUS == 'H') {
        this.data.CURRENT_STAGE_ID = 4;
      } else if (this.data.LTC_STATUS == 'A') {
        this.data.CURRENT_STAGE_ID = 6;
      }
      this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          if (this.QueData.ID) {
            this.api
              .updateLTCquestions(this.QueData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
                  this.drawerClose();
                  this.current = 0;
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Has Not Changed...', '');
                  this.isSpinning = false;
                }
              });
          } else {
            this.api
              .createLTCquestions(this.QueData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success('Information Save Successfully...', '');
                  this.drawerClose();
                  this.current = 0;
                  this.isSpinning = false;
                } else {
                  this.message.error('Failed To Fill Information...', '');
                  this.isSpinning = false;
                }
              });
          }
        } else {
          this.message.error('Failed To Save Information....', '');
          this.isSpinning = false;
        }
      });
    }
  }

  pre(): void {
    if (this.current == 1) {
      this.isSpinning = true;
      // this.allEmployeeList();
      this.loadOnlySelectedEmployee();
      this.ListOfDesignation();
      this.BlockYears();
      this.gradePayLevelList();
      this.ddoOfTheOfficialList();
      this.api
        .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
              } else {
                this.data = data['data'][0];
                if (
                  this.data.JOURNEY_DATA != null &&
                  this.data.JOURNEY_DATA != undefined &&
                  this.data.JOURNEY_DATA != ''
                ) {
                  this.journeyData = JSON.parse(this.data.JOURNEY_DATA);
                } else {
                  this.journeyData = [];
                }
              }
              this.api
                .getltc_family_master(
                  0,
                  0,
                  '',
                  '',
                  ' AND LTC_ID = ' + this.ltcID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.relationdata = data['data'];
                      } else {
                        this.relationdata = [];
                      }
                      if (
                        this.data.ADVANCE_ORDER_YEAR != '' &&
                        this.data.ADVANCE_ORDER_YEAR != null &&
                        this.data.ADVANCE_ORDER_YEAR != undefined
                      ) {
                        this.clearAdvanceBlockCalanderYearEdit(
                          this.data.ADVANCE_ORDER_YEAR
                        );
                      } else {
                        this.advanceBlockYearList = [];
                      }

                      if (
                        this.data.FINAL_ORDER_YEAR != '' &&
                        this.data.FINAL_ORDER_YEAR != null &&
                        this.data.FINAL_ORDER_YEAR != undefined
                      ) {
                        this.clearFinalBlockCalanderYearEdit(
                          this.data.FINAL_ORDER_YEAR
                        );
                      } else {
                        this.finalBlockYearList = [];
                      }

                      this.current -= 1;
                      this.stepCurrent -= 1;
                      this.isSpinning = false;
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
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.api
        .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (
                this.data.ADVANCE_ORDER_YEAR != '' &&
                this.data.ADVANCE_ORDER_YEAR != null &&
                this.data.ADVANCE_ORDER_YEAR != undefined
              ) {
                this.clearAdvanceBlockCalanderYearEdit(
                  this.data.ADVANCE_ORDER_YEAR
                );
              } else {
                this.advanceBlockYearList = [];
              }

              if (
                this.data.FINAL_ORDER_YEAR != '' &&
                this.data.FINAL_ORDER_YEAR != null &&
                this.data.FINAL_ORDER_YEAR != undefined
              ) {
                this.clearFinalBlockCalanderYearEdit(
                  this.data.FINAL_ORDER_YEAR
                );
              } else {
                this.finalBlockYearList = [];
              }

              if (data['data'].length == 0) {
                this.data = new LTCMaster();
                this.isSpinning = false;
                this.progressBarltcAssumptionCharge = false;
                this.progressBarltcLpc = false;
                this.progressBarltcMandateForm = false;
                this.progressBarltcServiceCertificate = false;
                this.progressBarltcTicketBoardingPass = false;
                this.progressBarltcTransportationBills = false;
                this.progressBarltcCondonationOfDelay = false;
                this.progressBarltcSalarySlipForm = false;
                this.progressBarSuretyBond = false;
                this.current = 2;
                this.stepCurrent = 1;
              } else {
                this.data = data['data'][0];
                this.isSpinning = false;
                this.progressBarltcAssumptionCharge = false;
                this.progressBarltcLpc = false;
                this.progressBarltcMandateForm = false;
                this.progressBarltcServiceCertificate = false;
                this.progressBarltcTicketBoardingPass = false;
                this.progressBarltcTransportationBills = false;
                this.progressBarltcCondonationOfDelay = false;
                this.progressBarltcSalarySlipForm = false;
                this.progressBarSuretyBond = false;
                this.current = 2;
                this.stepCurrent = 1;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      this.isSpinning = true;
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.api
        .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = new LTCMaster();
                if (
                  this.data.IS_ADVANCE_CLAIM == true &&
                  this.data.IS_ADVANCE_LTC_CREATED == false
                ) {
                  this.current = 0;
                  this.stepCurrent = 0;
                } else {
                  this.current = 1;
                }
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
              }
              this.getDataform1();
              this.getDataform3();
              this.api
                .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
                .subscribe((data) => {
                  if (data['code'] == 200) {
                    this.isSpinning = false;
                    this.formdata7 = data['data'];
                    if (
                      this.data.IS_ADVANCE_CLAIM == true &&
                      this.data.IS_ADVANCE_LTC_CREATED == false
                    ) {
                      this.current = 0;
                      this.stepCurrent = 0;
                    } else {
                      this.current = 1;
                    }
                  }
                });
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
            this.empLoader = false;
            this.isSpinning = false;
            if (data['data'][0]['DDO_OF_THE_OFFICIAL']) {
              this.oldDDO = data['data'][0]['DDO_OF_THE_OFFICIAL'];
            }

            if (data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
              this.oldDDOID = data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            }
            this.data.EMP_ID = data['data'][0]['ID'];
            this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.data.SALUTATION = data['data'][0]['SALUTATION'];
            this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
            this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
            this.data.LOCATION = data['data'][0]['LOCATION'];
            // this.data.DDO_OF_THE_OFFICIAL =
            //   data['data'][0]['DDO_OF_THE_OFFICIAL'];
            // if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
            this.data.DDO_OF_THE_OFFICIAL_ID = Number(
              sessionStorage.getItem('ddoId')
            );
            // } else {
            //   this.data.DDO_OF_THE_OFFICIAL_ID =
            //     data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            // }
            this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
            this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
            this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
            this.data.ADDRESS = data['data'][0]['ADDRESS'];
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
      this.data.OFFICE_NAME = '';
      this.data.SALUTATION = '';
      this.data.DESIGNATION_ID = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = null;
      this.data.GRADE_PAY_LEVEL_ID = null;
      this.data.GRADE_PAY = '';
      this.data.EMAIL_ID = '';
      this.data.MOBILE_NO = '';
      this.data.ADDRESS = '';
    }
  }

  fileList: any = [];
  fileNumberList() {
    this.api
      .getFileMaster(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND HIRARCHY_ID in (3,4)',
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

  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.api
        .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = new LTCMaster();
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
              }
              this.getDataform1();
              // this.getDataform7();

              this.getDataform3();
              this.api
                .ltcJourneyDetail(0, 0, '', 'asc', ' AND LTC_ID =' + this.ltcID)
                .subscribe((data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.isSpinning = false;
                      this.formdata7 = data['data'];
                      if (this.showcreatemsg) {
                        this.message.success(
                          'Claim Created Successfully...',
                          ''
                        );
                        this.showcreatemsg = false;
                      } else {
                        this.message.success(
                          'Information Saved Successfully...',
                          ''
                        );
                      }
                      if (
                        this.data.IS_ADVANCE_CLAIM == true &&
                        this.data.IS_ADVANCE_LTC_CREATED == false
                      ) {
                        this.progressBarltcAssumptionCharge = false;
                        this.progressBarltcLpc = false;
                        this.progressBarltcMandateForm = false;
                        this.progressBarltcServiceCertificate = false;
                        this.progressBarltcTicketBoardingPass = false;
                        this.progressBarltcTransportationBills = false;
                        this.progressBarltcCondonationOfDelay = false;
                        this.progressBarltcSalarySlipForm = false;
                        this.progressBarSuretyBond = false;

                        this.current = 2;
                        this.stepCurrent = 1;
                      } else {
                        this.current = 1;
                      }
                    } else {
                      this.isSpinning = false;
                      this.formdata7 = [];
                      if (this.showcreatemsg) {
                        this.message.success(
                          'Claim Created Successfully...',
                          ''
                        );
                        this.showcreatemsg = false;
                      } else {
                        this.message.success(
                          'Information Saved Successfully...',
                          ''
                        );
                      }
                      if (
                        this.data.IS_ADVANCE_CLAIM == true &&
                        this.data.IS_ADVANCE_LTC_CREATED == false
                      ) {
                        this.progressBarltcAssumptionCharge = false;
                        this.progressBarltcLpc = false;
                        this.progressBarltcMandateForm = false;
                        this.progressBarltcServiceCertificate = false;
                        this.progressBarltcTicketBoardingPass = false;
                        this.progressBarltcTransportationBills = false;
                        this.progressBarltcCondonationOfDelay = false;
                        this.progressBarltcSalarySlipForm = false;
                        this.progressBarSuretyBond = false;
                        this.current = 2;
                        this.stepCurrent = 1;
                      } else {
                        this.current = 1;
                      }
                    }
                  }
                });
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 1) {
      this.api
        .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = new LTCMaster();
                this.message.success('Information Saved Successfully...', '');
                this.progressBarltcAssumptionCharge = false;
                this.progressBarltcLpc = false;
                this.progressBarltcMandateForm = false;
                this.progressBarltcServiceCertificate = false;
                this.progressBarltcTicketBoardingPass = false;
                this.progressBarltcTransportationBills = false;
                this.progressBarltcCondonationOfDelay = false;
                this.progressBarltcSalarySlipForm = false;
                this.progressBarSuretyBond = false;
                this.current = 2;
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];
                this.message.success('Information Saved Successfully...', '');
                this.progressBarltcAssumptionCharge = false;
                this.progressBarltcLpc = false;
                this.progressBarltcMandateForm = false;
                this.progressBarltcServiceCertificate = false;
                this.progressBarltcTicketBoardingPass = false;
                this.progressBarltcTransportationBills = false;
                this.progressBarltcCondonationOfDelay = false;
                this.progressBarltcSalarySlipForm = false;
                this.progressBarSuretyBond = false;
                this.current = 2;
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
      this.fileNumberList();
      this.api
        .getLTCquestions(0, 0, '', '', ' AND LTC_ID =' + this.ltcID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.QueData = new LTCQuestionaryMaster();
                if (this.data.IS_ADVANCE_TAKEN == 1) {
                  this.QueData.IS_ADVANCE_FOR_LTC_GRANTED = true;
                } else {
                  this.QueData.IS_ADVANCE_FOR_LTC_GRANTED =
                    this.QueData.IS_ADVANCE_FOR_LTC_GRANTED;
                }
                if (
                  this.data.BLOCK_YEAR != undefined &&
                  this.data.BLOCK_YEAR != null &&
                  this.data.BLOCK_YEAR != ''
                ) {
                  this.QueData.WHETHER_BLOCK_YEAR_MENTIONED = true;
                } else {
                  this.QueData.WHETHER_BLOCK_YEAR_MENTIONED =
                    this.QueData.WHETHER_BLOCK_YEAR_MENTIONED;
                }
                if (
                  this.data.LTC_MANDATE_FORM != undefined &&
                  this.data.LTC_MANDATE_FORM != null &&
                  this.data.LTC_MANDATE_FORM != ''
                ) {
                  this.QueData.IS_BANK_MANDATE_FORM_SUBMITTED = true;
                }
                if (
                  this.data.LEAVE_SACTIONED_ORDER_URL != undefined &&
                  this.data.LEAVE_SACTIONED_ORDER_URL != null &&
                  this.data.LEAVE_SACTIONED_ORDER_URL != ''
                ) {
                  this.QueData.IS_COPY_OF_LEAVE_LEAVE_SANCTIONED_ORDER_GIVEN =
                    'Y';
                } else {
                  this.QueData.IS_COPY_OF_LEAVE_LEAVE_SANCTIONED_ORDER_GIVEN =
                    'N';
                }
                if (
                  this.data.LATEST_PAYMENT_SLIP != undefined &&
                  this.data.LATEST_PAYMENT_SLIP != null &&
                  this.data.LATEST_PAYMENT_SLIP != ''
                ) {
                  this.QueData.IS_LATEST_PAYMENT_SLIP_FOR_PAY_LEVEL = true;
                }
                this.message.success('Information Saved Successfully...', '');
                this.current = 3;
                this.stepCurrent = 2;
                this.isSpinning = false;
              } else {
                this.QueData = data['data'][0];
                this.message.success('Information Saved Successfully...', '');
                this.current = 3;
                this.stepCurrent = 2;
                this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else {
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
          this.empDrawerVisible = true;
        } else {
          this.message.error("Can't Load Employee Data", '');
        }
      });
  }

  empDrawerClose(): void {
    this.empDrawerVisible = false;

    if (
      this.data.EMP_ID == null ||
      this.data.EMP_ID == undefined ||
      this.data.EMP_ID == ''
    ) {
      this.isSpinning = false;
      this.allEmployeeList();
    } else {
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (
                data['data'][0]['SALUTATION'] == null ||
                data['data'][0]['SALUTATION'] == undefined ||
                data['data'][0]['SALUTATION'] == ''
              ) {
                this.data.SALUTATION = this.data.SALUTATION;
              } else {
                this.data.SALUTATION = data['data'][0]['SALUTATION'];
              }
              this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
              this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
              this.data.LOCATION = data['data'][0]['LOCATION'];
              this.data.DDO_OF_THE_OFFICIAL =
                data['data'][0]['DDO_OF_THE_OFFICIAL'];
              if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
                this.data.DDO_OF_THE_OFFICIAL_ID = Number(
                  sessionStorage.getItem('ddoId')
                );
              } else {
                this.data.DDO_OF_THE_OFFICIAL_ID =
                  data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
              }

              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.ADDRESS = data['data'][0]['ADDRESS'];
              this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
              this.data.GRADE_PAY_LEVEL_ID =
                data['data'][0]['GRADE_PAY_LEVEL_ID'];
              this.isSpinning = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    }
  }

  get closeCallback() {
    return this.empDrawerClose.bind(this);
  }

  queData: any = [];
  index = -1;
  editrelation: Realtionshipdata = new Realtionshipdata();
  edit1(data: Realtionshipdata, i: any): void {
    this.index = i;
    this.editrelation = Object.assign({}, data);
  }

  // addData(addNew: boolean, relation: NgForm) {
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (
  //     (this.editrelation.NAME_OF_FAMILY_MEMBER == undefined ||
  //       this.editrelation.NAME_OF_FAMILY_MEMBER.trim() == '') &&
  //     (this.editrelation.AGE == undefined || this.editrelation.AGE == 0) &&
  //     (this.editrelation.RELATIONSHIP == undefined ||
  //       this.editrelation.RELATIONSHIP.trim() == '')
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Fill All The Required Fields ', '');
  //   } else if (
  //     this.editrelation.NAME_OF_FAMILY_MEMBER == undefined ||
  //     this.editrelation.NAME_OF_FAMILY_MEMBER.trim() == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Name of Family Member.', '');
  //   } else if (
  //     this.editrelation.AGE == undefined ||
  //     this.editrelation.AGE <= 0
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
  //     this.editrelation.ID = undefined;
  //     this.editrelation.CLIENT_ID = 1;

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
        this.editrelation.RELATIONSHIP.trim() == '') &&
      (this.editrelation.GENDER == undefined ||
        this.editrelation.GENDER.trim() == '')
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
    } else if (
      this.editrelation.GENDER == null ||
      this.editrelation.GENDER == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Gender ', '');
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

  LTCAssumptionFileURL: any;
  progressBarltcAssumptionCharge: boolean = false;
  percentltcAssumptionCharge = 0;
  timerltcAssumptionCharge: any;

  AssumptionurlPdf;
  onFileSelectedAssumption(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.LTCAssumptionFileURL = <File>event.target.files[0];

      if (this.LTCAssumptionFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCAssumptionFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.AssumptionurlPdf = url;
        if (
          this.data.PRIOR_LEAVE_APPLICATION_URL != undefined &&
          this.data.PRIOR_LEAVE_APPLICATION_URL.trim() != ''
        ) {
          var arr = this.data.PRIOR_LEAVE_APPLICATION_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcAssumptionCharge = true;
      this.timer = this.api
        .onUpload2(
          'priorLeaveApplication',
          this.LTCAssumptionFileURL,
          this.AssumptionurlPdf
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcAssumptionCharge = percentDone;
            if (this.percentltcAssumptionCharge == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarltcAssumptionCharge = false;
            this.percentltcAssumptionCharge = 0;
            this.data.PRIOR_LEAVE_APPLICATION_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.PRIOR_LEAVE_APPLICATION_URL = this.AssumptionurlPdf;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCAssumptionFileURL = null;
      this.isSpinning = false;
      this.progressBarltcAssumptionCharge = false;
      this.percentltcAssumptionCharge = 0;
      this.data.PRIOR_LEAVE_APPLICATION_URL = null;
    }
  }

  LTCLPCFileURL: any;
  progressBarltcLpc: boolean = false;
  percentltcLpc = 0;
  timerltcLpc: any;

  LPCurlPdf: any;
  onFileSelectedLPC(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.LTCLPCFileURL = <File>event.target.files[0];

      if (this.LTCLPCFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCLPCFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.LPCurlPdf = url;
        if (
          this.data.LEAVE_SACTIONED_ORDER_URL != undefined &&
          this.data.LEAVE_SACTIONED_ORDER_URL.trim() != ''
        ) {
          var arr = this.data.LEAVE_SACTIONED_ORDER_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcLpc = true;
      this.timer = this.api
        .onUpload2('leaveSanctionedOrder', this.LTCLPCFileURL, this.LPCurlPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcLpc = percentDone;
            if (this.percentltcLpc == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarltcLpc = false;
            this.percentltcLpc = 0;
            this.data.LEAVE_SACTIONED_ORDER_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.LEAVE_SACTIONED_ORDER_URL = this.LPCurlPdf;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCLPCFileURL = null;
      this.isSpinning = false;
      this.progressBarltcLpc = false;
      this.percentltcLpc = 0;
      this.data.PRIOR_LEAVE_APPLICATION_URL = null;
    }
  }

  LTCMandateFormFileURL: any;
  progressBarltcMandateForm: boolean = false;
  percentltcMandateForm = 0;
  timerltcMandateForm: any;

  urlPdf: any;
  timer: any;
  onFileSelectedMandateForm(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.LTCMandateFormFileURL = <File>event.target.files[0];

      if (this.LTCMandateFormFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCMandateFormFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlPdf = url;
        if (
          this.data.LTC_MANDATE_FORM != undefined &&
          this.data.LTC_MANDATE_FORM.trim() != ''
        ) {
          var arr = this.data.LTC_MANDATE_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcMandateForm = true;
      this.timer = this.api
        .onUpload2('ltcMandateForm', this.LTCMandateFormFileURL, this.urlPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcMandateForm = percentDone;
            if (this.percentltcMandateForm == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarltcMandateForm = false;
            this.percentltcMandateForm = 0;
            this.data.LTC_MANDATE_FORM = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.LTC_MANDATE_FORM = this.urlPdf;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCMandateFormFileURL = null;
      this.isSpinning = false;
      this.progressBarltcMandateForm = false;
      this.percentltcMandateForm = 0;
      this.data.LTC_MANDATE_FORM = null;
    }
  }
  LTCTransferFileURL: any;
  progressBarltcServiceCertificate: boolean = false;
  percentltcServiceCertificate = 0;
  timerltcServiceCertificate: any;

  TransferurlPdf;
  onFileSelectedTransfer(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.LTCTransferFileURL = <File>event.target.files[0];

      if (this.LTCTransferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCTransferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.TransferurlPdf = url;
        if (
          this.data.LATEST_PAYMENT_SLIP != undefined &&
          this.data.LATEST_PAYMENT_SLIP.trim() != ''
        ) {
          var arr = this.data.LATEST_PAYMENT_SLIP.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcServiceCertificate = true;
      this.timer = this.api
        .onUpload2(
          'latestPaymentSlip',
          this.LTCTransferFileURL,
          this.TransferurlPdf
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcServiceCertificate = percentDone;
            if (this.percentltcServiceCertificate == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarltcServiceCertificate = false;
            this.percentltcServiceCertificate = 0;
            this.data.LATEST_PAYMENT_SLIP = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.LATEST_PAYMENT_SLIP = this.TransferurlPdf;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCTransferFileURL = null;
      this.isSpinning = false;
      this.progressBarltcServiceCertificate = false;
      this.percentltcServiceCertificate = 0;
      this.data.LATEST_PAYMENT_SLIP = null;
    }
  }

  LTCTicketPassFileURL: any;
  progressBarltcTicketBoardingPass: boolean = false;
  percentltcTicketBoardingPass = 0;
  timerltcTicketBoardingPass: any;
  onFileSelectedTicketPass1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.LTCTicketPassFileURL = <File>event.target.files[0];

      if (this.LTCTicketPassFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCTicketPassFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.DEPENDENCY_CERTIFICATE != undefined &&
          this.data.DEPENDENCY_CERTIFICATE.trim() != ''
        ) {
          var arr = this.data.DEPENDENCY_CERTIFICATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcTicketBoardingPass = true;
      this.timerltcTicketBoardingPass = this.api
        .onUpload('dependencyCertificate', this.LTCTicketPassFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcTicketBoardingPass = percentDone;
            if (this.percentltcTicketBoardingPass == 100) {
              this.isSpinning = false;
            }
          }
          if (res.status != 200) {
            this.isSpinning = false;
            this.progressBarltcTicketBoardingPass = false;
            this.percentltcTicketBoardingPass = 0;
            this.LTCTicketPassFileURL = null;
            this.data.DEPENDENCY_CERTIFICATE = null;
            this.message.error('Failed To Save File...', '');
          } else if (res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.updatecall();
              this.isSpinning = false;
              this.data.DEPENDENCY_CERTIFICATE = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCTicketPassFileURL = null;
      this.data.DEPENDENCY_CERTIFICATE = null;
    }
  }
  DEPENDENCYurlPdf;
  onFileSelectedTicketPass(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.LTCTicketPassFileURL = <File>event.target.files[0];

      if (this.LTCTicketPassFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCTicketPassFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.DEPENDENCYurlPdf = url;
        if (
          this.data.DEPENDENCY_CERTIFICATE != undefined &&
          this.data.DEPENDENCY_CERTIFICATE.trim() != ''
        ) {
          var arr = this.data.DEPENDENCY_CERTIFICATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcTicketBoardingPass = true;
      this.timer = this.api
        .onUpload2(
          'dependencyCertificate',
          this.LTCTicketPassFileURL,
          this.DEPENDENCYurlPdf
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcTicketBoardingPass = percentDone;
            if (this.percentltcTicketBoardingPass == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarltcTicketBoardingPass = false;
            this.percentltcTicketBoardingPass = 0;
            this.data.DEPENDENCY_CERTIFICATE = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.DEPENDENCY_CERTIFICATE = this.DEPENDENCYurlPdf;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCTicketPassFileURL = null;
      this.isSpinning = false;
      this.progressBarltcTicketBoardingPass = false;
      this.percentltcTicketBoardingPass = 0;
      this.data.DEPENDENCY_CERTIFICATE = null;
    }
  }

  LTCTransportationBillFileURL: any;
  progressBarltcTransportationBills: boolean = false;
  percentltcTransportationBills = 0;
  timerltcTransportationBills: any;
  onFileSelectedTransportationBill(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.LTCTransportationBillFileURL = <File>event.target.files[0];

      if (this.LTCTransportationBillFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCTransportationBillFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.LTC_TRANSPORTATION_BILLS != undefined &&
          this.data.LTC_TRANSPORTATION_BILLS.trim() != ''
        ) {
          var arr = this.data.LTC_TRANSPORTATION_BILLS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcTransportationBills = true;
      this.timerltcTransportationBills = this.api
        .onUpload(
          'ltcTransportationBills',
          this.LTCTransportationBillFileURL,
          url
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcTransportationBills = percentDone;
            if (this.percentltcTransportationBills == 100) {
              this.isSpinning = false;
            }
          }
          if (res.body['code'] == 200) {
            this.data.LTC_TRANSPORTATION_BILLS = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarltcTransportationBills = false;
            this.percentltcTransportationBills = 0;
            this.LTCTransportationBillFileURL = null;
            this.data.LTC_TRANSPORTATION_BILLS = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCTransportationBillFileURL = null;
      this.data.LTC_TRANSPORTATION_BILLS = null;
    }
  }

  condonationOfDelayFileURL: any;
  progressBarltcCondonationOfDelay: boolean = false;
  percentltcCondonationOfDelay = 0;
  timerltcCondonationOfDelay: any;
  onFileSelectedCondonationOfDelay(event: any) {
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
          this.data.LTC_CONDONATION_OF_DELAY != undefined &&
          this.data.LTC_CONDONATION_OF_DELAY.trim() != ''
        ) {
          var arr = this.data.LTC_CONDONATION_OF_DELAY.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarltcCondonationOfDelay = true;
      this.timerltcCondonationOfDelay = this.api
        .onUpload('ltcCondonationOfDelay', this.condonationOfDelayFileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcCondonationOfDelay = percentDone;
            if (this.percentltcCondonationOfDelay == 100) {
              this.isSpinning = false;
            }
          }
          if (res.body['code'] == 200) {
            this.data.LTC_CONDONATION_OF_DELAY = url;
            this.updatecall();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarltcCondonationOfDelay = false;
            this.percentltcCondonationOfDelay = 0;
            this.condonationOfDelayFileURL = null;
            this.data.LTC_CONDONATION_OF_DELAY = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.condonationOfDelayFileURL = null;
      this.data.LTC_CONDONATION_OF_DELAY = null;
    }
  }

  LTCSalarySlipFileURL: any;
  progressBarltcSalarySlipForm: boolean = false;
  percentltcSalarySlip = 0;
  PdfUrlSalarySlip: any;
  timerSalarySlip: any;
  onFileSelectedSalarySlip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.LTCSalarySlipFileURL = <File>event.target.files[0];

      if (this.LTCSalarySlipFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.LTCSalarySlipFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.PdfUrlSalarySlip = url;
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
      this.progressBarltcSalarySlipForm = true;
      this.timerSalarySlip = this.api
        .onUpload2(
          'salarySlip',
          this.LTCSalarySlipFileURL,
          this.PdfUrlSalarySlip
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentltcSalarySlip = percentDone;
            if (this.percentltcSalarySlip == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBarltcSalarySlipForm = false;
            this.percentltcSalarySlip = 0;
            this.data.SALARY_SLIP = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.data.SALARY_SLIP = this.PdfUrlSalarySlip;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.LTCSalarySlipFileURL = null;
      this.isSpinning = false;
      this.progressBarltcSalarySlipForm = false;
      this.percentltcSalarySlip = 0;
      this.data.SALARY_SLIP = null;
    }
  }
  view = 0;
  sanitizedLink: any = '';
  getS(link: string) {
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'priorLeaveApplication/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'leaveSanctionedOrder/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'ltcMandateForm/' + link;
    }
    if (this.view == 4) {
      var a: any = this.api.retriveimgUrl + 'latestPaymentSlip/' + link;
    }
    if (this.view == 5) {
      var a: any = this.api.retriveimgUrl + 'dependencyCertificate/' + link;
    }
    if (this.view == 8) {
      var a: any = this.api.retriveimgUrl + 'websiteScreenShot/' + link;
    }
    if (this.view == 9) {
      var a: any = this.api.retriveimgUrl + 'salarySlip/' + link;
    }
    if (this.view == 10) {
      var a: any = this.api.retriveimgUrl + 'suretyBond/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    this.printOrderModalVisible = true;
    //  this.sanitizedLink;
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  viewAssumptionPDF(pdfURL: string): void {
    this.view = 1;
    this.getS(this.data.PRIOR_LEAVE_APPLICATION_URL);
  }
  viewLPCPDF(pdfURL: string): void {
    this.view = 2;
    this.getS(this.data.LEAVE_SACTIONED_ORDER_URL);
  }
  viewMandateFormPDF(pdfURL: string): void {
    this.view = 3;
    this.getS(this.data.LTC_MANDATE_FORM);
  }
  viewTransferPDF(pdfURL: string): void {
    this.view = 4;
    this.getS(this.data.LATEST_PAYMENT_SLIP);
  }
  viewBoardingPassPDF(pdfURL: string): void {
    this.view = 5;
    this.getS(this.data.DEPENDENCY_CERTIFICATE);
  }
  viewTransportationBillsPDF(pdfURL: string): void {
    this.view = 6;
    this.getS(this.data.LTC_TRANSPORTATION_BILLS);
  }
  viewCondonationOfDelayPDF(pdfURL: string): void {
    this.view = 7;
    this.getS(this.data.LTC_CONDONATION_OF_DELAY);
  }
  viewwebsiteSSPDF(pdfURL: string): void {
    this.view = 8;
    this.getS(this.data.WEBSITE_SCREENSHOT);
  }
  viewSalarySlipPDF(pdfURL: string): void {
    this.view = 9;
    this.getS(this.data.SALARY_SLIP);
  }
  viewSuretyBondPDF(pdfURL: string): void {
    this.view = 10;
    this.getS(this.data.SURETY_BOND);
  }
  uploadDoc(addNew: boolean) {
    this.isOk = true;
    if (this.isOk && this.data.ID != undefined) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.isSpinning = false;

            this.next();
          } else {
            this.message.error('Information Has Not Saved...', '');
            this.isSpinning = false;
          }
        });
      } else {
      }
    }
  }

  updatecall() {
    this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('File Uploaded Successfully...', '');
      } else {
        this.message.error('Information Has Not Saved...', '');

        this.isSpinning = false;
      }
    });
  }

  getAfterDelete() {
    this.isSpinning = true;
    this.api.getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.data = data['data'][0];
          this.message.success('File Deleted...', '');
          this.isSpinning = false;
        } else {
          this.message.error('Something Went Wrong', '');
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  assumptionDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('priorLeaveApplication/' + data.PRIOR_LEAVE_APPLICATION_URL)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.PRIOR_LEAVE_APPLICATION_URL = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcAssumptionCharge = false;
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

  LPCDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('leaveSanctionedOrder/' + data.LEAVE_SACTIONED_ORDER_URL)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.LEAVE_SACTIONED_ORDER_URL = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcLpc = false;
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

  mandateDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('ltcMandateForm/' + data.LTC_MANDATE_FORM)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.LTC_MANDATE_FORM = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcMandateForm = false;
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

  serviceDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('latestPaymentSlip/' + data.LATEST_PAYMENT_SLIP)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.LATEST_PAYMENT_SLIP = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcServiceCertificate = false;
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

  dependancyDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('dependencyCertificate/' + data.DEPENDENCY_CERTIFICATE)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.DEPENDENCY_CERTIFICATE = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcTicketBoardingPass = false;
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

  billDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('ltcTransportationBills/' + data.LTC_TRANSPORTATION_BILLS)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.LTC_TRANSPORTATION_BILLS = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcTransportationBills = false;
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
      .deletePdf('ltcCondonationOfDelay/' + data.LTC_CONDONATION_OF_DELAY)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.LTC_CONDONATION_OF_DELAY = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcCondonationOfDelay = false;
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
  webdelete(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('websiteScreenShot/' + data.WEBSITE_SCREENSHOT)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.WEBSITE_SCREENSHOT = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarweb = false;
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
  salarySlipDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('salarySlip/' + data.SALARY_SLIP)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.SALARY_SLIP = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarltcSalarySlipForm = false;
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

  suretyBondDelete(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('suretyBond/' + data.SURETY_BOND)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.SURETY_BOND = null;
          this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarSuretyBond = false;
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
  websiteSSFileURL: any;
  onFileSelectedwebsiteSS(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.websiteSSFileURL = <File>event.target.files[0];

      if (this.websiteSSFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.websiteSSFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.WEBSITE_SCREENSHOT != undefined &&
          this.data.WEBSITE_SCREENSHOT.trim() != ''
        ) {
          var arr = this.data.WEBSITE_SCREENSHOT.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('websiteScreenShot', this.websiteSSFileURL, url)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.WEBSITE_SCREENSHOT = url;

            this.updatecall();
            // this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.websiteSSFileURL = null;
      this.data.WEBSITE_SCREENSHOT = null;
    }
  }

  weburl: any;
  progressBarweb: boolean = false;
  percentweb = 0;
  timerweb: any;
  onfileweb(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.weburl = <File>event.target.files[0];

      if (this.weburl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.weburl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
      }
      this.progressBarweb = true;
      this.timerltcCondonationOfDelay = this.api
        .onUpload('websiteScreenShot', this.weburl, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentweb = percentDone;
            if (this.percentweb == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarweb = false;
            this.percentweb = 0;
            this.weburl = null;
            this.data.WEBSITE_SCREENSHOT = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.WEBSITE_SCREENSHOT = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.weburl = null;
      this.data.WEBSITE_SCREENSHOT = null;
    }
  }

  suretyBondurl: any;
  progressBarSuretyBond: boolean = false;
  percentSuretyBond = 0;
  onfileSuretyBond(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.suretyBondurl = <File>event.target.files[0];

      if (this.suretyBondurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.suretyBondurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
      }
      this.progressBarSuretyBond = true;
      this.timerltcCondonationOfDelay = this.api
        .onUpload('suretyBond', this.suretyBondurl, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentSuretyBond = percentDone;
            if (this.percentSuretyBond == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarSuretyBond = false;
            this.percentSuretyBond = 0;
            this.suretyBondurl = null;
            this.data.SURETY_BOND = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.SURETY_BOND = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.suretyBondurl = null;
      this.data.SURETY_BOND = null;
    }
  }

  clearDateRemark(event) {
    if (event == 'R') {
      this.data.LTC_HOLD_DATE = null;
      this.data.LTC_REMARK = null;
    } else if (event == 'H') {
      this.data.LTC_REMARK = null;
    } else {
      this.data.LTC_HOLD_DATE = null;
      this.data.LTC_REMARK = null;
    }
  }

  clearBlockCalanderYear(event) {
    var likeQuery: any = '';
    if (event == 'Block Year') {
      this.data.BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR like '%-%'";
    } else {
      this.data.BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR not like '%-%'";
    }

    this.api
      .getBlockYearMaster(0, 0, '', 'asc', ' AND STATUS = 1 ' + likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.blockYearList = data['data'];
          } else {
            this.blockYearList = [];
          }
        } else {
          this.blockYearList = [];
        }
      });
  }

  clearAdvanceBlockCalanderYear(event) {
    var likeQuery: any = '';
    if (event == 'Block Year') {
      this.data.PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR like '%-%'";
    } else {
      this.data.PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR not like '%-%'";
    }
    this.advanceBlockYearList = [];
    this.api
      .getBlockYearMaster(0, 0, '', 'asc', ' AND STATUS = 1 ' + likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.advanceBlockYearList = data['data'];
          } else {
            this.advanceBlockYearList = [];
          }
        } else {
          this.advanceBlockYearList = [];
        }
      });
  }

  finalBlockYearList: any = [];
  clearCurrentBlockCalanderYear(event) {
    var likeQuery: any = '';
    if (event == 'Block Year') {
      this.data.FINAL_PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR like '%-%'";
    } else {
      this.data.FINAL_PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR not like '%-%'";
    }
    this.finalBlockYearList = [];
    this.api
      .getBlockYearMaster(0, 0, '', 'asc', ' AND STATUS = 1 ' + likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.finalBlockYearList = data['data'];
          } else {
            this.finalBlockYearList = [];
          }
        } else {
          this.finalBlockYearList = [];
        }
      });
  }
  clearAdvanceBlockCalanderYearEdit(event) {
    var likeQuery: any = '';
    if (event == 'Block Year') {
      // this.data.PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR like '%-%'";
    } else {
      // this.data.PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR not like '%-%'";
    }
    this.advanceBlockYearList = [];
    this.api
      .getBlockYearMaster(0, 0, '', 'asc', ' AND STATUS = 1 ' + likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.advanceBlockYearList = data['data'];
          } else {
            this.advanceBlockYearList = [];
          }
        } else {
          this.advanceBlockYearList = [];
        }
      });
  }
  clearFinalBlockCalanderYearEdit(event) {
    var likeQuery: any = '';
    if (event == 'Block Year') {
      // this.data.PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR like '%-%'";
    } else {
      // this.data.PARTICULARS_BLOCK_YEAR_ID = null;
      likeQuery = " AND YEAR not like '%-%'";
    }
    this.finalBlockYearList = [];
    this.api
      .getBlockYearMaster(0, 0, '', 'asc', ' AND STATUS = 1 ' + likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.finalBlockYearList = data['data'];
          } else {
            this.finalBlockYearList = [];
          }
        } else {
          this.finalBlockYearList = [];
        }
      });
  }

  confirmDeleteJourney(data: any, i: number) {
    this.journeyData = this.journeyData.filter((item, index) => index != i);

    this.journeyData = [...[], ...this.journeyData];
  }

  journeyIndex = -1;
  editJourneyRecord: advJourneyDetails = new advJourneyDetails();
  editJourneyData(data: advJourneyDetails, i: any): void {
    this.journeyIndex = i;
    this.editJourneyRecord = Object.assign({}, data);
    if (
      data.TRAVEL_MODE_ID != null &&
      data.TRAVEL_MODE_ID != undefined &&
      data.TRAVEL_MODE_ID != ''
    ) {
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
              this.classMode = data['data'];
            }
          },
          (err) => {}
        );
    } else {
      this.classMode = this.classMode;
    }
  }

  isOkJourney = true;
  addJourneyData(addNew: boolean, journeyTableData: NgForm) {
    this.isSpinning = false;
    this.isOkJourney = true;

    if (
      (this.editJourneyRecord.DEPARTURE_FROM == undefined ||
        this.editJourneyRecord.DEPARTURE_FROM == '' ||
        this.editJourneyRecord.DEPARTURE_FROM == null) &&
      (this.editJourneyRecord.ARRIVAL_TO == undefined ||
        this.editJourneyRecord.ARRIVAL_TO == null ||
        this.editJourneyRecord.ARRIVAL_TO == '') &&
      (this.editJourneyRecord.NO_OF_FAIRS == undefined ||
        this.editJourneyRecord.NO_OF_FAIRS == '' ||
        this.editJourneyRecord.NO_OF_FAIRS == null) &&
      (this.editJourneyRecord.JOURNEY_CLAIMED_AMOUNT == undefined ||
        this.editJourneyRecord.JOURNEY_CLAIMED_AMOUNT == null) &&
      (this.editJourneyRecord.TRAVEL_MODE_ID == undefined ||
        this.editJourneyRecord.TRAVEL_MODE_ID == 0 ||
        this.editJourneyRecord.TRAVEL_MODE_ID == null) &&
      (this.editJourneyRecord.TRAVEL_CLASS_ID == undefined ||
        this.editJourneyRecord.TRAVEL_CLASS_ID == 0 ||
        this.editJourneyRecord.TRAVEL_CLASS_ID == null)
    ) {
      this.isOkJourney = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.editJourneyRecord.DEPARTURE_FROM == undefined ||
      this.editJourneyRecord.DEPARTURE_FROM == '' ||
      this.editJourneyRecord.DEPARTURE_FROM == null
    ) {
      this.isOkJourney = false;
      this.message.error(' Please Enter From Place.', '');
    } else if (
      this.editJourneyRecord.ARRIVAL_TO == undefined ||
      this.editJourneyRecord.ARRIVAL_TO == '' ||
      this.editJourneyRecord.ARRIVAL_TO == null
    ) {
      this.isOkJourney = false;
      this.message.error('Please Enter To Place  ', '');
    } else if (
      this.editJourneyRecord.TRAVEL_MODE_ID == null ||
      this.editJourneyRecord.TRAVEL_MODE_ID == undefined ||
      this.editJourneyRecord.TRAVEL_MODE_ID == 0
    ) {
      this.isOkJourney = false;
      this.message.error(' Please Select Travel Mode.', '');
    } else if (
      this.editJourneyRecord.TRAVEL_CLASS_ID == null ||
      this.editJourneyRecord.TRAVEL_CLASS_ID == undefined ||
      this.editJourneyRecord.TRAVEL_CLASS_ID == 0
    ) {
      this.isOkJourney = false;
      this.message.error(' Please Select Class of Mode.', '');
    } else if (
      this.editJourneyRecord.NO_OF_FAIRS == null ||
      this.editJourneyRecord.NO_OF_FAIRS == undefined ||
      this.editJourneyRecord.NO_OF_FAIRS == ''
    ) {
      this.isOkJourney = false;
      this.message.error(' Please Enter Number Of Fare.', '');
    } else if (
      this.editJourneyRecord.JOURNEY_CLAIMED_AMOUNT == null ||
      this.editJourneyRecord.JOURNEY_CLAIMED_AMOUNT == undefined ||
      this.editJourneyRecord.JOURNEY_CLAIMED_AMOUNT == ''
    ) {
      this.isOkJourney = false;
      this.message.error(' Please Enter Fare Paid Claimed.', '');
    }

    if (this.isOkJourney) {
      const foundModeItem = this.travelMode.find(
        (travelModeItem) =>
          travelModeItem.ID === this.editJourneyRecord.TRAVEL_MODE_ID
      );
      this.editJourneyRecord['TRAVEL_MODE_NAME'] = foundModeItem
        ? foundModeItem.NAME
        : '';

      const foundClassItem = this.classMode.find(
        (travelClassItem) =>
          travelClassItem.ID === this.editJourneyRecord.TRAVEL_CLASS_ID
      );
      this.editJourneyRecord['TRAVEL_CLASS_NAME'] = foundClassItem
        ? foundClassItem.NAME
        : '';

      // this.editJourneyRecord.ID = undefined;
      if (
        this.data.JOURNEY_ONWARD_PROPOSED_DATE != null &&
        this.data.JOURNEY_ONWARD_PROPOSED_DATE != undefined &&
        this.data.JOURNEY_ONWARD_PROPOSED_DATE != ''
      ) {
        this.editJourneyRecord.FROM_DATETIME =
          this.data.JOURNEY_ONWARD_PROPOSED_DATE = this.datepipe.transform(
            this.data.JOURNEY_ONWARD_PROPOSED_DATE,
            'yyyy-MM-dd HH:mm'
          );
      } else {
        this.editJourneyRecord.FROM_DATETIME = null;
      }

      if (
        this.data.JOURNEY_RETURN_PROBABLE_DATE != null &&
        this.data.JOURNEY_RETURN_PROBABLE_DATE != undefined &&
        this.data.JOURNEY_RETURN_PROBABLE_DATE != ''
      ) {
        this.editJourneyRecord.TO_DATETIME =
          this.data.JOURNEY_RETURN_PROBABLE_DATE = this.datepipe.transform(
            this.data.JOURNEY_RETURN_PROBABLE_DATE,
            'yyyy-MM-dd HH:mm'
          );
      } else {
        this.editJourneyRecord.TO_DATETIME = null;
      }
      this.editJourneyRecord.IS_DELETED = 0;
      if (this.journeyIndex > -1) {
        this.journeyData[this.journeyIndex] = Object.assign(
          {},
          this.editJourneyRecord
        );
      } else {
        this.journeyData.push(Object.assign({}, this.editJourneyRecord));
      }
      this.journeyData = [...[], ...this.journeyData];

      journeyTableData.form.reset();
      this.classMode = [];
      this.editJourneyRecord = new advJourneyDetails();
      this.journeyIndex = -1;
    }
  }

  getcurrent() {
    if (this.data.IS_ADVANCE_CLAIM && !this.data.IS_ADVANCE_LTC_CREATED) {
      return this.stepCurrent;
    } else {
      return this.current;
    }
  }

  clearParticularHomeTown(event) {
    if (event == false) {
      this.data.PARTICULARS_HOMETOWN = null;
    } else {
    }
  }
  clearFinalParticularHomeTown(event) {
    if (event == false) {
      this.data.FINAL_PARTICULARS_HOMETOWN = null;
    } else {
    }
  }

  getspecification(event: any) {
    var dd = this.blockYearList.find((x) => x.ID == event);

    this.data.SPECIFICATION = dd.SPECIFICATION;
  }
}
