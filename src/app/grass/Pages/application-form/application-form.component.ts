import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentCheckList } from 'src/app/grass/Models/AllotmentCheckList';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { EmployeeMaster } from 'src/app/grass/Models/Employee';
import { Flatpreference } from 'src/app/grass/Models/Flatpreference';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { isBefore, isAfter, endOfDay } from 'date-fns';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css'],
  providers: [DatePipe],
})
export class ApplicationFormComponent implements OnInit {
  i = 0;
  @Input() data2!: AllotmentCheckList;
  @Input() employerecordfilled!: boolean;
  @Input() isdraweropendedggg: boolean = false;
  ResidenceType;
  Status;
  showdisble111: boolean = false;
  disablenext: boolean = false;
  @Input() drawerClose;
  @Input() stage!: number;
  @Input() data: AllotmentMaster;
  thisyear: any;
  nextyear: any;
  datemm = new Date();
  Employee_name = '';
  firstname = '';
  middlename = '';
  lastname = '';

  basicpay = '';
  profilephoto: any = '';
  employee_code = '';
  emp_Designation = '';
  emp_Designation_ID: any;
  emp_dob = '';
  office_name = '';
  service_type = '';
  Grade_pay = '';
  gradepay_level = '';
  emp_address = '';
  emp_cast = '';
  headquarter_name = '';
  joining_date: any = '';
  @Input() empid: any;
  getlatestupload: any;
  getlatestsubmit: any;
  EMP_DATA123: any;
  imgurl: any = this.api.retriveimgUrl;
  currentyear: any;
  // employerecordfilled!:boolean;
  mobilen: any = sessionStorage.getItem('loginmobileNo')

  constructor(
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private api: APIServicesService
  ) { }
  date: any;
  ngOnInit() {
    this.getGradepay();
    this.currentyear = new Date().getFullYear();
    this.mobilen = sessionStorage.getItem('loginmobileNo')
    this.getallotmentandchecklist();
    let ab = new Date(this.datemm.getFullYear());
    let cd = new Date(this.datemm.getFullYear() + 1);
    this.thisyear = this.datepipe.transform(ab, 'yyyyMMdd');
    this.nextyear = this.datepipe.transform(cd, 'yyyyMMdd');
    const today = new Date();
    this.date = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );

    if (this.isdraweropendedggg == true) {
      this.employeedetailsedit();
    }
    if (this.data.ID) {
      if (this.data.APPLICATION_FORM != null) {
        this.applnform = false;
      } else {
        this.applnform = true;
      }
      if (this.data.MARRIAGE_CERTIFICATE != null) {
        this.showmarriagecertificate = false;
      } else {
        this.showmarriagecertificate = true;
      }
    } else {
      this.applnform = true;
    }

    this.checklistData = [
      { JOINING_DATE: null, RESIDENCE_TYPE: 1, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 2, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 3, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 4, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 5, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 6, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 7, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 8, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 9, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 10, isSelected: false },
      { JOINING_DATE: null, RESIDENCE_TYPE: 11, isSelected: false },
    ];

    if (
      this.data.FLAT_PREFERENCE != null ||
      this.data.FLAT_PREFERENCE != undefined
    ) {
      this.listofpreferencetype = this.data.FLAT_PREFERENCE;
    } else {
      this.listofpreferencetype = [];
      if (this.listofpreferencetype.length <= 0) {
        this.flatpref.SERIAL_NO = 1;
      }
    }
    if (this.isdraweropendedggg == true) {
      if (this.data.ID) {
        this.isSpinningprintform = true;
        this.api
          .residenceTypeRequest(
            0,
            0,
            '',
            '',
            ' AND FLAT_REQUEST_ID = ' + this.data.ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.array = data['data'];
              if (data['data'].length > 0) {
                this.api
                  .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.EMP_DATA123 = Object.assign({}, data['data'][0]);
                        this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                        this.data.DEMO_GRADE_PAY_ID =
                          data['data'][0]['GRAAS_GRADE_PAY_ID'];
                        this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                        this.Employee_name = data['data'][0]['NAME'];
                        this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
                        this.emp_Designation = data['data'][0]['ITHR_DESIGNATION_NAME'];
                        this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                        this.emp_Designation_ID =
                          data['data'][0]['DESIGNATION_ID'];
                        this.firstname = data['data'][0]['FIRST_NAME'];
                        this.middlename = data['data'][0]['MIDDLE_NAME'];
                        this.lastname = data['data'][0]['LAST_NAME'];
                        this.emp_dob = data['data'][0]['DOB'];
                        this.basicpay = data['data'][0]['BASIC_PAY'];

                        this.office_name = data['data'][0]['OFFICE_NAME'];
                        this.service_type = data['data'][0]['SERVICE_TYPE'];
                        this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
                        this.gradepay_level =
                          data['data'][0]['GRADE_PAY_LEVEL'];
                        this.emp_address = data['data'][0]['ADDRESS'];
                        this.emp_cast = data['data'][0]['CAST'];
                        this.headquarter_name = data['data'][0]['LOCATION'];
                        this.joining_date = data['data'][0]['JOINING_DATE'];
                        this.flatpref.DATE_OF_JOINING =
                          data['data'][0]['JOINING_DATE'];
                        this.data.JOINING_LETTER =
                          data['data'][0]['JOINING_LETTER'];
                      } else {
                      }
                    },
                    (err) => {
                    }
                  );

                for (var i = 0; i < this.checklistData.length; i++) {
                  for (var j = 0; j < this.array.length; j++) {
                    if (
                      this.array[j]['RESIDENCE_TYPE'] ==
                      this.checklistData[i]['RESIDENCE_TYPE']
                    ) {
                      this.checklistData[i]['isSelected'] = true;
                      this.checklistData[i]['JOINING_DATE'] =
                        this.array[j]['JOINING_DATE'];
                      this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] =
                        this.array[j]['GRAD_PAY_LEVEL_ID'];
                      this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
                        this.array[j]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'];
                    } else {
                    }
                  }
                }
              } else {
              }
            } else {
              this.isSpinningprintform = false;
            }
          }, err => {
            this.isSpinningprintform = false;
          });

        this.api
          .getAllotmenmaster(0, 0, 'ID', 'desc', ' AND ID = ' + this.data.ID)
          .subscribe(
            (data) => {
              this.isSpinningprintform = false;
              let allotmentmast = data['data'];
              this.allomas = allotmentmast[0];
              this.applicationdate = data['data'][0]['APPLICATION_DATETIME'];
              this.approveddate = data['data'][0]['APP_SUBMIT_DATETIME'];
              this.printformm = data['data'][0]['APP_PRINT_DATETIME'];
              this.applicationinfo = data['data'][0]['APP_INFO_DATETIME'];
              this.api
                .getAllotmentchecklist(
                  0,
                  0,
                  'ID',
                  'desc',
                  ' AND ALLOTEMENT_ID = ' + this.data.ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      let allotchekda = data['data'];
                      this.allodata = allotchekda[0];
                    } else {
                    }
                  },
                  (err) => { }
                );
            },
            (err) => {
              this.isSpinningprintform = false;
            }
          );

        this.api
          .residenceTypeRequest(
            0,
            0,
            'RESIDENCE_TYPE',
            'asc',
            ' AND FLAT_REQUEST_ID = ' + this.data.ID
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.flatarrlist = data['data'];
            }
          });

        this.api
          .getfamilymaster(
            0,
            0,
            'ID',
            'desc',
            ' AND EMP_ID =' + this.data.EMPLOYEE_ID + " AND RELATION = 'Father'"
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                let fatherdetail = data['data'];
                if (fatherdetail.length > 0) {
                  this.fatherdetail1 = fatherdetail[0];
                  this.Fathername = fatherdetail[0]['NAME'];
                  let firstname = this.fatherdetail1.NAME.split(' ');
                  this.Father1name = firstname[0];
                }
              }
            },
            (err) => { }
          );
      }
    }


    if (localStorage.getItem('GradeDataSave') == 'T') {
      this.checklistData = [
        { JOINING_DATE: null, RESIDENCE_TYPE: 1, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 2, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 3, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 4, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 5, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 6, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 7, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 8, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 9, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 10, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 11, isSelected: false },
      ];
    }

    this.next();

  }
  displayc() {
    this.stage == 4;

    if (this.data.APPLICATION_FORM != null) {
      this.applnform = false;
    } else {
      this.applnform = true;
    }

    if (this.stage == 5) {
      this.disablenext = true;
      // localStorage.removeItem('GradeDataSave')
      this.drawerClose();
    }
  }
  disabledDate123 = (current: Date): boolean => {
    // Get today's date without the time component
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable today and future dates
    return (
      current <
      new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    );
  };

  nextUpload() {
    if (this.isagreedisable1) {
      this.message.info(
        'Please review and accept the following terms and conditions, To proceed with your application',
        ''
      );
    } else {
      this.Rulesandapply = true;
    }
  }
  disabledDate1 = (current: Date): boolean => {
    const today = endOfDay(new Date());
    return isAfter(current, today);
  };
  disabledDate2 = (current: Date): boolean => {
    const today = endOfDay(new Date());
    return isBefore(current, today);
  };
  disableprevious: boolean = false;
  previous() {
    this.showdisble111 = true;
    // this.getallotmentandchecklist112();
    if (this.stage > 0) {
      this.stage -= 1;
    }
    if (this.stage <= 0) {
      this.stage = 0;
    }
    if (this.data.MARRIAGE_CERTIFICATE != null) {
      this.showmarriagecertificate = false;
    } else {
      this.showmarriagecertificate = true;
    }
  }
  gradepaydata: any = [];
  getGradepay() {
    this.gradepaydata = [];
    this.api.getAllGradePayLevel(0, 0, 'ID', 'asc', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.gradepaydata = data['data'];
      } else {
        this.gradepaydata = [];
      }
    });
  }
  previous1() {
    this.showdisble111 = true;
    if (this.stage > 0) {
      this.stage -= 1;
    }
    if (this.stage <= 0) {
      this.stage = 0;
    }

    if (this.data.MARRIAGE_CERTIFICATE != null) {
      this.showmarriagecertificate = false;
    } else {
      this.showmarriagecertificate = true;
    }

    this.previous2();
  }
  previous2() {
    this.showdisble111 = true;
    if (this.stage > 0) {
      this.stage -= 1;
    }
    if (this.stage <= 0) {
      this.stage = 0;
    }
    if (this.data.ID) {
      if (this.data.MARRIAGE_CERTIFICATE != null) {
        this.showmarriagecertificate = false;
      } else {
        this.showmarriagecertificate = true;
      }

      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.EMP_DATA123 = Object.assign({}, data['data'][0]);

              this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
              this.data.DEMO_GRADE_PAY_ID =
                data['data'][0]['GRAAS_GRADE_PAY_ID'];
              this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
              this.basicpay = data['data'][0]['BASIC_PAY'];
              this.firstname = data['data'][0]['FIRST_NAME'];
              this.middlename = data['data'][0]['MIDDLE_NAME'];
              this.lastname = data['data'][0]['LAST_NAME'];
              this.Employee_name = data['data'][0]['NAME'];
              this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
              this.emp_Designation = data['data'][0]['ITHR_DESIGNATION_NAME'];
              this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
              this.emp_Designation_ID = data['data'][0]['DESIGNATION_ID'];
              this.emp_dob = data['data'][0]['DOB'];
              this.office_name = data['data'][0]['OFFICE_NAME'];

              this.service_type = data['data'][0]['SERVICE_TYPE'];
              this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
              this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL'];
              this.emp_address = data['data'][0]['ADDRESS'];
              this.emp_cast = data['data'][0]['CAST'];
              this.headquarter_name = data['data'][0]['LOCATION'];
              this.joining_date = data['data'][0]['JOINING_DATE'];
              this.flatpref.DATE_OF_JOINING = data['data'][0]['JOINING_DATE'];
              this.data.JOINING_LETTER = data['data'][0]['JOINING_LETTER'];

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
      this.api
        .residenceTypeRequest(
          0,
          0,
          '',
          '',
          ' AND FLAT_REQUEST_ID = ' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.array = data['data'];

            if (data['data'].length > 0) {
              for (var i = 0; i < this.checklistData.length; i++) {
                for (var j = 0; j < this.array.length; j++) {
                  if (
                    this.array[j]['RESIDENCE_TYPE'] ==
                    this.checklistData[i]['RESIDENCE_TYPE']
                  ) {
                    this.checklistData[i]['isSelected'] = true;
                    this.checklistData[i]['JOINING_DATE'] =
                      this.array[j]['JOINING_DATE'];
                    this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] =
                      this.array[j]['GRAD_PAY_LEVEL_ID'];
                    this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
                      this.array[j]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'];
                  } else {
                  }
                }
              }
            } else {
            }
          }
        });

      this.api
        .getAllotmenmaster(0, 0, 'ID', 'desc', ' AND ID = ' + this.data.ID)
        .subscribe(
          (data) => {
            let allotmentmast = data['data'];
            this.allomas = allotmentmast[0];
            // ' AND ALLOTEMENT_ID = ' + this.data.ID
            this.api
              .getAllotmentchecklist(
                0,
                0,
                'ID',
                'desc',
                ' AND ALLOTEMENT_ID = ' + this.data.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    let allotchekda = data['data'];
                    this.allodata = allotchekda[0];
                  } else {
                  }
                },
                (err) => { }
              );
          },
          (err) => { }
        );

      this.api
        .residenceTypeRequest(
          0,
          0,
          'RESIDENCE_TYPE',
          'asc',
          ' AND FLAT_REQUEST_ID = ' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.flatarrlist = data['data'];
          }
        });

      this.api
        .getfamilymaster(
          0,
          0,
          'ID',
          'desc',
          ' AND EMP_ID =' + this.data.EMPLOYEE_ID + ' AND RELATION = "Father"'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              let fatherdetail = data['data'];
              if (fatherdetail.length > 0) {
                this.fatherdetail1 = fatherdetail[0];
                this.Fathername = fatherdetail[0]['NAME'];
                let firstname = this.fatherdetail1.NAME.split(' ');
                this.Father1name = firstname[0];
              } else {
                this.Fathername = '';
                this.Father1name = '';
              }
            }
          },
          (err) => { }
        );
    }
    this.employeedetailsedit();
    this.getallotmentandchecklist1122();
  }

  getallotmentandchecklist1122() {
    this.disable1 = false;
    this.disable2 = false;
    this.disable3 = false;
    this.disable4 = false;
    this.disable5 = false;
    this.disable6 = false;
    this.disable7 = false;
    this.disable8 = false;
    this.disable9 = false;
    this.disable10 = false;
    this.disable11 = false;
    let allotmentid: any;
    this.api.getAllotmenmaster(0, 0, 'ID', 'desc', this.filterlike).subscribe(
      (data) => {
        this.generateddatalist = data['data'];
        allotmentid = this.generateddatalist[0]['ID'];
        this.api
          .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
          .subscribe(
            (getempss) => {
              if (getempss['code'] == 200) {
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 80000
                ) {
                  this.disable10 = false;
                  this.disable11 = false;
                  this.disable6 = true;
                  this.disable5 = true;
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 75000 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 79999
                ) {
                  this.disable9 = false;
                  this.disable10 = false;
                  this.disable6 = true;
                  this.disable5 = true;
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 67000 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 74999
                ) {
                  this.disable9 = false;
                  this.disable8 = false;
                  this.disable6 = true;
                  this.disable5 = true;
                }
                if (getempss['data'][0].GRASS_GRADE_PAY == 10000) {
                  this.disable7 = false;
                  this.disable8 = false;
                  this.disable6 = true;
                  this.disable5 = true;
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 8700 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 8900
                ) {
                  this.disable7 = false;
                  this.disable6 = true;
                  this.disable5 = true;
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 7600 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 8000
                ) {
                  this.disable5 = true;
                  this.disable6 = true;
                }
                if (getempss['data'][0].GRASS_GRADE_PAY == 6600) {
                  if (getempss['data'][0].GRAAS_GRADE_PAY_ID == 14) {
                    this.disable4 = true;
                  } else if (getempss['data'][0].GRAAS_GRADE_PAY_ID == 15) {
                    this.disable4 = true;
                    this.disable5 = true;
                  }
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 5400 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 6600
                ) {
                  if (
                    getempss['data'][0].GRAAS_GRADE_PAY_ID == 13 ||
                    getempss['data'][0].GRAAS_GRADE_PAY_ID == 14
                  ) {
                    this.disable4 = true;
                  }
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 4200 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 4800
                ) {
                  this.disable3 = true;
                  this.disable2 = true;
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 1900 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 2800
                ) {
                  this.disable1 = true;
                  this.disable2 = true;
                }
                if (
                  getempss['data'][0].GRASS_GRADE_PAY >= 1300 &&
                  getempss['data'][0].GRASS_GRADE_PAY <= 1800
                ) {
                  this.disable1 = true;
                }
              } else {

              }
            }
          );

        this.isSpinning = true;
        if (this.data.ID) {
          this.api
            .getAllotmentchecklist(
              0,
              0,
              '',
              '',
              ' AND ALLOTEMENT_ID = ' + this.data.ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.allotmentschecklistdata = data['data'];

                  if (this.allotmentschecklistdata.length > 0) {
                    this.data2.ALLOTEMENT_ID = this.data.ID;
                    this.data2.ID = this.allotmentschecklistdata[0]['ID'];
                    if (this.data2.ID) {
                      this.disableupload = false;
                    }
                    this.data2.ALLOCATED_BY_DEPARTMENT =
                      this.allotmentschecklistdata[0][
                      'ALLOCATED_BY_DEPARTMENT'
                      ];
                    this.data2.ALLOCATED_TO =
                      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED =
                      this.allotmentschecklistdata[0][
                      'IS_GOVERNMENT_RESIDENCE_ALLOTED'
                      ];
                    this.data2.ALLOCATED_TO =
                      this.allotmentschecklistdata[0]['ALLOCATED_TO'];
                    this.data2.IS_EMPLOYEED_FAMILY_MEMBER =
                      this.allotmentschecklistdata[0][
                      'IS_EMPLOYEED_FAMILY_MEMBER'
                      ];
                    this.data2.ALLOCATED_BY =
                      this.allotmentschecklistdata[0]['ALLOCATED_BY'];
                    this.data2.IS_APPLICANT_STAY_PRESENTLY =
                      this.allotmentschecklistdata[0][
                      'IS_APPLICANT_STAY_PRESENTLY'
                      ];
                    this.data2.OFFICE_NAME_OF_FAMILY_MEM =
                      this.allotmentschecklistdata[0][
                      'OFFICE_NAME_OF_FAMILY_MEM'
                      ];
                    this.data2.STAYS_WITH_YOU =
                      this.allotmentschecklistdata[0]['STAYS_WITH_YOU'];
                    this.data2.RENTED_PREMISES_NAME =
                      this.allotmentschecklistdata[0]['RENTED_PREMISES_NAME'];
                    this.data2.TYPE_RESIDENCE =
                      this.allotmentschecklistdata[0]['TYPE_RESIDENCE'];
                    this.data2.POOL_NAME =
                      this.allotmentschecklistdata[0]['POOL_NAME'];
                    this.data2.DEBARRED_ALLOTMENT =
                      this.allotmentschecklistdata[0]['DEBARRED_ALLOTMENT'];
                    this.data2.CANCELLED_ALLOTMENT =
                      this.allotmentschecklistdata[0]['CANCELLED_ALLOTMENT'];
                    this.data2.AFFIRMATIVE_INDICATE =
                      this.allotmentschecklistdata[0]['AFFIRMATIVE_INDICATE'];
                    this.data2.RENT_FREE_ACCOMMODATION =
                      this.allotmentschecklistdata[0][
                      'RENT_FREE_ACCOMMODATION'
                      ];
                    this.data2.APPLICANT_FAMILY =
                      this.allotmentschecklistdata[0]['APPLICANT_FAMILY'];
                    this.data2.STATION_DUTY_FAR_FAMILY =
                      this.allotmentschecklistdata[0][
                      'STATION_DUTY_FAR_FAMILY'
                      ];
                    this.data2.PERMENANT_POST_HELD =
                      this.allotmentschecklistdata[0]['PERMENANT_POST_HELD'];
                    this.data2.OFFICE_ATTACHED =
                      this.allotmentschecklistdata[0]['OFFICE_ATTACHED'];
                    this.data2.SURETY_SUBSIST =
                      this.allotmentschecklistdata[0]['SURETY_SUBSIST'];
                    this.data2.CIVIL_LIST =
                      this.allotmentschecklistdata[0]['CIVIL_LIST'];

                    if (this.data2.ID) {
                      this.api
                        .residenceTypeRequest(
                          0,
                          0,
                          '',
                          '',
                          ' AND FLAT_REQUEST_ID = ' + allotmentid
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            this.array = data['data'];

                            if (data['data'].length > 0) {
                              for (
                                var i = 0;
                                i < this.checklistData.length;
                                i++
                              ) {
                                for (var j = 0; j < this.array.length; j++) {
                                  if (
                                    this.array[j]['RESIDENCE_TYPE'] ==
                                    this.checklistData[i]['RESIDENCE_TYPE']
                                  ) {
                                    this.checklistData[i]['isSelected'] = true;
                                    this.checklistData[i]['JOINING_DATE'] =
                                      this.array[j]['JOINING_DATE'];
                                    this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] =
                                      this.array[j]['GRAD_PAY_LEVEL_ID'];
                                    this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
                                      this.array[j]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'];
                                  } else {
                                  }
                                }
                              }
                            } else {
                            }
                          }
                        });
                    }
                  } else {
                    this.data2 = new AllotmentCheckList();
                    this.data2.ALLOTEMENT_ID = allotmentid;
                    this.disableupload = true;
                  }
                  this.isSpinning = false;
                } else {
                  this.message.error("Can't Load Allotment Checklist Data", '');
                  this.isSpinning = false;
                }
              },
              (err) => {
                this.isSpinning = false;
              }
            );
        } else {
          if (sessionStorage.getItem('reapply') == 'T') {
            this.api
              .getAllotmentchecklist(
                1,
                1,
                'ID',
                'desc',
                ' AND ALLOTEMENT_ID =' + allotmentid
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data2 = data['data'][0];
                  }
                },
                (err) => { }
              );
            this.data2.ALLOTEMENT_ID = allotmentid;
            this.disableupload = true;
            // this.stage = 1;
            this.isSpinning = false;
          } else {
            this.data2 = new AllotmentCheckList();

            this.data2.ALLOTEMENT_ID = allotmentid;
            this.disableupload = true;
            // this.stage = 1;
            this.isSpinning = false;
          }
          // this.data2 = new AllotmentCheckList();
          // this.data2.ALLOTEMENT_ID = allotmentid;
          // this.disableupload = true;
          // this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  allomas: any;
  allodata: any;

  drawerVisible: boolean = false;
  allotmentdata: any = [];
  flatarrlist: any = [];
  data1: any;
  checklistdata22: any = [];
  fatherdetail1: any;
  Father1name: any;
  Fathername: any;
  dateofbirth: any;
  dataisavailable: boolean = false;
  data3: any;
  data4: any;
  filterkey = '';
  showbutton: boolean = true;


  clearAllotmentletter(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.JOINING_ALLOTMENT_LETTER = null;
          this.joiningAllotmentnotnull = true;
          this.progressBar5 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.data.JOINING_ALLOTMENT_LETTER = null;
          this.joiningAllotmentnotnull = true;
          this.progressBar5 = false;
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }
  clearMarriage(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.MARRIAGE_CERTIFICATE = null;
          this.marriageFileURLallotment = null;
          this.showmarriagecertificate = true;
          this.progressBar10 = false;
          this.percent10 = 0;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.data.MARRIAGE_CERTIFICATE = null;
          this.marriageFileURLallotment = null;
          this.showmarriagecertificate = true;
          this.progressBar10 = false;
          this.percent10 = 0;
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }
  clearGradepayletter(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.GRADE_PAY_DRAWN_LETTER = null;
          this.gradepaynotnull = true;
          this.progressBar1 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.data.GRADE_PAY_DRAWN_LETTER = null;
          this.gradepaynotnull = true;
          this.progressBar1 = false;
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  joininglettershow: boolean = false;
  clearJoiningletletter(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.JOINING_LETTER = null;
          this.joininglettershow = true;
          this.progressBar2 = false;
          this.message.success('File Deleted Successfully', '');

          let sendata = {
            ...this.EMP_DATA123,
            JOINING_LETTER: null,
          };
          this.api.updateEmployeeMaster(sendata).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Changed Successfully...', '');
            } else {
              // this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.data.JOINING_LETTER = null;
          this.joininglettershow = true;
          this.progressBar2 = false;
          this.message.success('File Deleted Successfully', '');

          let sendata = {
            ...this.EMP_DATA123,
            JOINING_LETTER: null,
          };
          this.api.updateEmployeeMaster(sendata).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Changed Successfully...', '');
            } else {
              // this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  Payslipshow: boolean = false;
  // clearpayslip() {
  //   this.data.PAY_SLIP = null;
  //   this.Payslipshow = true;
  //   this.progressBar3 = false;

  // }
  clearpayslip(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.PAY_SLIP = null;
          this.Payslipshow = true;
          this.progressBar3 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.data.PAY_SLIP = null;
          this.Payslipshow = true;
          this.progressBar3 = false;
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  Icardshow: boolean = false;
  clearIcard(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.I_CARD = null;
          this.Icardshow = true;
          this.progressBar4 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.data.I_CARD = null;
          this.Icardshow = true;
          this.progressBar4 = false;
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  clearapplnform(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.APPLICATION_FORM = null;
          this.applnform = true;
          this.progressBar = false;
          this.percent = 0;
          this.message.success('File Deleted Successfully', '');
          this.api.UpdateAllotmentmaster(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
              } else {
              }
            },
            (error) => { }
          );
        } else {
          this.data.APPLICATION_FORM = null;
          this.applnform = true;
          this.progressBar = false;
          this.percent = 0;
          this.message.success('File Deleted Successfully', '');
          this.api.UpdateAllotmentmaster(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
              } else {
              }
            },
            (error) => { }
          );
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onChange(value: string): void { }

  change(event: any) { }
  changecast(event: any) { }
  changepaylevel(event: any) { }
  changeAccommodation(event: any) { }

  listofaccomodation: any = [];

  flatpref: Flatpreference = new Flatpreference();
  listofpreferencetype: any;
  AddResedenceprefe() {
    this.flatpref.DATE_OF_JOINING = this.datepipe.transform(
      this.flatpref.DATE_OF_JOINING,
      'yyyy-MM-dd'
    );
    this.flatpref.DATE_MIN_PAY_GOV = this.datepipe.transform(
      this.flatpref.DATE_MIN_PAY_GOV,
      'yyyy-MM-dd'
    );

    if (
      this.flatpref.TYPE_OF_RESIDENCE == '' ||
      this.flatpref.TYPE_OF_RESIDENCE == null ||
      this.flatpref.TYPE_OF_RESIDENCE == undefined
    ) {
      this.message.warning('Please Select The Residence Type', '');
    } else if (
      this.flatpref.DATE_MIN_PAY_GOV == '' ||
      this.flatpref.DATE_MIN_PAY_GOV == null ||
      this.flatpref.DATE_MIN_PAY_GOV == undefined
    ) {
      this.message.warning(
        'Please Select Date From which the Min Pay Govt.',
        ''
      );
    } else if (
      this.flatpref.DATE_OF_JOINING == '' ||
      this.flatpref.DATE_OF_JOINING == null ||
      this.flatpref.DATE_OF_JOINING == undefined
    ) {
      this.message.warning('Please Select The Joining Date', '');
    } else {
      if (this.flatpref.SERIAL_NO > this.listofpreferencetype.length) {
        this.listofpreferencetype.push({
          EMPLOYEE_ID: Number(sessionStorage.getItem('userId')),
          DATE_MIN_PAY_GOV: this.flatpref.DATE_MIN_PAY_GOV,
          GRADE_PAY: this.Grade_pay,
          TYPE_OF_RESIDENCE: this.flatpref.TYPE_OF_RESIDENCE,
          SERIAL_NO: this.flatpref.SERIAL_NO,
          DATE_OF_JOINING: this.flatpref.DATE_OF_JOINING,
        });
        this.flatpref.TYPE_OF_RESIDENCE = '';
        this.flatpref.DATE_MIN_PAY_GOV = '';
        this.flatpref.SERIAL_NO = this.listofpreferencetype.length + 1;
      } else {
        for (let i = 0; i < this.listofpreferencetype.length; i++) {
          if (
            this.listofpreferencetype[i]['SERIAL_NO'] == this.flatpref.SERIAL_NO
          ) {
            this.listofpreferencetype.splice(i, 1, {
              EMPLOYEE_ID: Number(sessionStorage.getItem('userId')),
              DATE_MIN_PAY_GOV: this.flatpref.DATE_MIN_PAY_GOV,
              GRADE_PAY: this.Grade_pay,
              TYPE_OF_RESIDENCE: this.flatpref.TYPE_OF_RESIDENCE,
              SERIAL_NO: this.flatpref.SERIAL_NO,
              DATE_OF_JOINING: this.flatpref.DATE_OF_JOINING,
            });
            this.flatpref.TYPE_OF_RESIDENCE = '';
            this.flatpref.DATE_MIN_PAY_GOV = '';
            this.flatpref.SERIAL_NO = this.listofpreferencetype.length + 1;
          }
        }
      }
    }
  }

  editpreference(listdata: any) {
    this.flatpref.DATE_MIN_PAY_GOV = listdata.DATE_MIN_PAY_GOV;
    this.flatpref.TYPE_OF_RESIDENCE = listdata.TYPE_OF_RESIDENCE;
    this.flatpref.SERIAL_NO = listdata.SERIAL_NO;
  }

  deletepreference(listdata: any) {
    this.listofpreferencetype.splice(listdata.SERIAL_NO - 1, 1);
    // this.flatpref = new Flatpreference();
    this.flatpref.DATE_MIN_PAY_GOV = '';
    this.flatpref.TYPE_OF_RESIDENCE = '';

    this.flatpref.SERIAL_NO = this.listofpreferencetype.length + 1;
    for (let i = 0; i < this.listofpreferencetype.length; i++) {
      this.listofpreferencetype[i]['SERIAL_NO'] = i + 1;
    }
  }
  allotmentschecklistdata: any = [];
  close() {
    // localStorage.removeItem('GradeDataSave')
    this.drawerClose();
  }
  generateddatalist: any = [];
  disableupload: boolean = true;
  checklistData: any[] = [];
  allotmentId: any;
  array: any = [];
  disable1: any = 0;
  disable2: any = 0;
  disable3: any = 0;
  disable4: any = 0;
  disable5: any = 0;
  disable6: any = 0;
  disable7: any = 0;
  disable8: any = 0;
  disable9: any = 0;
  disable10: any = 0;
  disable11: any = 0;
  filterlike = '';
  isSpinning = false;
  isSpinningprintform: boolean = false;

  getreapplyData: any = sessionStorage.getItem('reapply');
  next() {
    if (localStorage.getItem('GradeDataSave') == 'T') {
      this.checklistData = [
        { JOINING_DATE: null, RESIDENCE_TYPE: 1, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 2, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 3, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 4, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 5, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 6, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 7, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 8, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 9, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 10, isSelected: false },
        { JOINING_DATE: null, RESIDENCE_TYPE: 11, isSelected: false },
      ];
    }
    this.filterlike = '';
    if (this.stage == 0) {
      if (this.data.ID) {
        if (this.getreapplyData == 'T') {
          this.filterlike = ' AND EMPLOYEE_ID = ' + Number(sessionStorage.getItem('userId'));
          this.getallotmentandchecklist();
        } else {
          this.filterlike = ' AND ID = ' + this.data.ID;
          this.getallotmentandchecklist();
        }
      } else {
        this.filterlike = ' AND EMPLOYEE_ID = ' + Number(sessionStorage.getItem('userId'));
        this.getallotmentandchecklist();
      }
    }
  }
  removedat1(event: boolean) {
    if (this.disable1 == true) {
      if (event == true) {
        this.checklistData[0].JOINING_DATE = this.data.DATE_JOINING;
      } else {
        this.checklistData[0].JOINING_DATE = null;
        this.checklistData[0].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
        this.checklistData[0].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
      }
    }
  }
  removedat2(event: boolean) {
    if (this.disable2 == true) {
      if (event == true) {
        this.checklistData[1].JOINING_DATE = this.data.DATE_JOINING;
      } else {
        this.checklistData[1].JOINING_DATE = null;
        this.checklistData[1].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
        this.checklistData[1].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
      }
    }
  }
  removedat3(event: boolean) {
    if (this.disable3 == true) {
      if (event == true) {
        this.checklistData[2].JOINING_DATE = this.data.DATE_JOINING;
      } else {
        this.checklistData[2].JOINING_DATE = null;
        this.checklistData[2].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
        this.checklistData[2].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
      }
    }
  }
  removedat4(event: boolean) {
    if (this.disable4 == true) {
      if (event == true) {
        this.checklistData[3].JOINING_DATE = this.data.DATE_JOINING;
      } else {
        this.checklistData[3].JOINING_DATE = null;
        this.checklistData[3].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
        this.checklistData[3].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
      }
    }
  }
  removedat5() {
    if (this.disable5 == true) {
      this.checklistData[4].JOINING_DATE = null;
      this.checklistData[4].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[4].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  removedat6() {
    if (this.disable6 == true) {
      this.checklistData[5].JOINING_DATE = null;
      this.checklistData[5].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[5].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  removedat7() {
    if (this.disable7 == true) {
      this.checklistData[6].JOINING_DATE = null;
      this.checklistData[6].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[6].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  removedat8() {
    if (this.disable8 == true) {
      this.checklistData[7].JOINING_DATE = null;
      this.checklistData[7].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[7].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  removedat9() {
    if (this.disable9 == true) {
      this.checklistData[8].JOINING_DATE = null;
      this.checklistData[8].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[8].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  removedat10() {
    if (this.disable10 == true) {
      this.checklistData[9].JOINING_DATE = null;
      this.checklistData[9].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[9].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  removedat11() {
    if (this.disable11 == true) {
      this.checklistData[10].JOINING_DATE = null;
      this.checklistData[10].GRAD_PAY_LEVEL_ID_ABOVE_4S = null;
      this.checklistData[10].PRESENT_PAY_LEVEL_DATE_ABOVE_4S = null;
    }
  }
  getallotmentandchecklist() {
    this.disable1 = false;
    this.disable2 = false;
    this.disable3 = false;
    this.disable4 = false;
    this.disable5 = false;
    this.disable6 = false;
    this.disable7 = false;
    this.disable8 = false;
    this.disable9 = false;
    this.disable10 = false;
    this.disable11 = false;
    let allotmentid: any;
    this.api.getAllotmenmaster(0, 0, 'ID', 'desc', this.filterlike).subscribe(
      (data) => {
        this.generateddatalist = data['data'];
        if (data['count'] > 0) {
          allotmentid = this.generateddatalist[0]['ID'];
          this.api
            .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
            .subscribe(
              (getempss) => {
                if (getempss['code'] == 200) {
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 80000
                  ) {
                    this.disable10 = false;
                    this.disable11 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 75000 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 79999
                  ) {
                    this.disable9 = false;
                    this.disable10 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 67000 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 74999
                  ) {

                    this.disable9 = false;
                    this.disable8 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (getempss['data'][0].GRASS_GRADE_PAY == 10000) {
                    // this.disable7 = true;
                    // this.disable8 = true;

                    this.disable7 = false;
                    this.disable8 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 8700 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 8900
                  ) {
                    this.disable6 = true;
                    this.disable7 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 7600 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 8000
                  ) {
                    this.disable5 = true;
                    this.disable6 = true;
                  }
                  if (getempss['data'][0].GRASS_GRADE_PAY == 6600) {
                    if (getempss['data'][0].GRAAS_GRADE_PAY_ID == 14) {
                      this.disable4 = true;
                    } else if (getempss['data'][0].GRAAS_GRADE_PAY_ID == 15) {
                      this.disable4 = true;
                      this.disable5 = true;
                    }
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 5400 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 6600
                  ) {
                    if (
                      getempss['data'][0].GRAAS_GRADE_PAY_ID == 13 ||
                      getempss['data'][0].GRAAS_GRADE_PAY_ID == 14
                    ) {
                      this.disable4 = true;
                    }
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 4200 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 4800
                  ) {
                    this.disable3 = true;
                    this.disable2 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 1900 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 2800
                  ) {
                    this.disable1 = true;
                    this.disable2 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 1300 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 1800
                  ) {
                    this.disable1 = true;
                  }
                } else {

                }
              }
            );
        }
        else {
          this.api
            .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
            .subscribe(
              (getempss) => {
                if (getempss['code'] == 200) {
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 80000
                  ) {
                    this.disable10 = false;
                    this.disable11 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 75000 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 79999
                  ) {
                    this.disable9 = false;
                    this.disable10 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 67000 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 74999
                  ) {
                    this.disable8 = false;
                    this.disable9 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (getempss['data'][0].GRASS_GRADE_PAY == 10000) {

                    this.disable7 = false;
                    this.disable8 = false;
                    this.disable6 = true;
                    this.disable5 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 8700 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 8900
                  ) {
                    this.disable6 = true;
                    this.disable7 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 7600 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 8000
                  ) {
                    this.disable5 = true;
                    this.disable6 = true;
                  }
                  if (getempss['data'][0].GRASS_GRADE_PAY == 6600) {
                    if (getempss['data'][0].GRAAS_GRADE_PAY_ID == 14) {
                      this.disable4 = true;
                    } else if (getempss['data'][0].GRAAS_GRADE_PAY_ID == 15) {
                      this.disable4 = true;
                      this.disable5 = true;
                    }
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 5400 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 6600
                  ) {
                    if (
                      getempss['data'][0].GRAAS_GRADE_PAY_ID == 13 ||
                      getempss['data'][0].GRAAS_GRADE_PAY_ID == 14
                    ) {
                      this.disable4 = true;
                    }
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 4200 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 4800
                  ) {
                    this.disable3 = true;
                    this.disable2 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 1900 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 2800
                  ) {
                    this.disable1 = true;
                    this.disable2 = true;
                  }
                  if (
                    getempss['data'][0].GRASS_GRADE_PAY >= 1300 &&
                    getempss['data'][0].GRASS_GRADE_PAY <= 1800
                  ) {
                    this.disable1 = true;
                  }
                } else {

                }
              }
            );
        }
        this.isSpinning = true;
        if (this.data.ID) {
          this.api
            .getAllotmentchecklist(
              0,
              0,
              '',
              '',
              ' AND ALLOTEMENT_ID = ' + allotmentid
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.allotmentschecklistdata = data['data'];

                  if (this.allotmentschecklistdata.length > 0) {
                    this.data2.ALLOTEMENT_ID = this.data.ID;
                    this.data2.ID = this.allotmentschecklistdata[0]['ID'];
                    if (this.data2.ID) {
                      this.disableupload = false;
                    }
                    this.data2.ALLOCATED_BY_DEPARTMENT =
                      this.allotmentschecklistdata[0][
                      'ALLOCATED_BY_DEPARTMENT'
                      ];
                    this.data2.ALLOCATED_TO =
                      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED =
                      this.allotmentschecklistdata[0][
                      'IS_GOVERNMENT_RESIDENCE_ALLOTED'
                      ];
                    this.data2.ALLOCATED_TO =
                      this.allotmentschecklistdata[0]['ALLOCATED_TO'];
                    this.data2.IS_EMPLOYEED_FAMILY_MEMBER =
                      this.allotmentschecklistdata[0][
                      'IS_EMPLOYEED_FAMILY_MEMBER'
                      ];
                    this.data2.ALLOCATED_BY =
                      this.allotmentschecklistdata[0]['ALLOCATED_BY'];
                    this.data2.IS_APPLICANT_STAY_PRESENTLY =
                      this.allotmentschecklistdata[0][
                      'IS_APPLICANT_STAY_PRESENTLY'
                      ];
                    this.data2.OFFICE_NAME_OF_FAMILY_MEM =
                      this.allotmentschecklistdata[0][
                      'OFFICE_NAME_OF_FAMILY_MEM'
                      ];
                    this.data2.STAYS_WITH_YOU =
                      this.allotmentschecklistdata[0]['STAYS_WITH_YOU'];
                    this.data2.RENTED_PREMISES_NAME =
                      this.allotmentschecklistdata[0]['RENTED_PREMISES_NAME'];
                    this.data2.TYPE_RESIDENCE =
                      this.allotmentschecklistdata[0]['TYPE_RESIDENCE'];
                    this.data2.POOL_NAME =
                      this.allotmentschecklistdata[0]['POOL_NAME'];
                    this.data2.DEBARRED_ALLOTMENT =
                      this.allotmentschecklistdata[0]['DEBARRED_ALLOTMENT'];
                    this.data2.CANCELLED_ALLOTMENT =
                      this.allotmentschecklistdata[0]['CANCELLED_ALLOTMENT'];
                    this.data2.AFFIRMATIVE_INDICATE =
                      this.allotmentschecklistdata[0]['AFFIRMATIVE_INDICATE'];
                    this.data2.RENT_FREE_ACCOMMODATION =
                      this.allotmentschecklistdata[0][
                      'RENT_FREE_ACCOMMODATION'
                      ];
                    this.data2.APPLICANT_FAMILY =
                      this.allotmentschecklistdata[0]['APPLICANT_FAMILY'];
                    this.data2.STATION_DUTY_FAR_FAMILY =
                      this.allotmentschecklistdata[0][
                      'STATION_DUTY_FAR_FAMILY'
                      ];
                    this.data2.PERMENANT_POST_HELD =
                      this.allotmentschecklistdata[0]['PERMENANT_POST_HELD'];
                    this.data2.OFFICE_ATTACHED =
                      this.allotmentschecklistdata[0]['OFFICE_ATTACHED'];
                    this.data2.SURETY_SUBSIST =
                      this.allotmentschecklistdata[0]['SURETY_SUBSIST'];
                    this.data2.CIVIL_LIST =
                      this.allotmentschecklistdata[0]['CIVIL_LIST'];
                    if (sessionStorage.getItem('reapply') == 'T') {
                      this.api
                        .residenceTypeRequest(
                          0,
                          0,
                          '',
                          '',
                          ' AND FLAT_REQUEST_ID = ' + allotmentid
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            this.array = data['data'];

                            if (data['data'].length > 0) {
                              for (
                                var i = 0;
                                i < this.checklistData.length;
                                i++
                              ) {
                                for (var j = 0; j < this.array.length; j++) {
                                  if (
                                    this.array[j]['RESIDENCE_TYPE'] ==
                                    this.checklistData[i]['RESIDENCE_TYPE']
                                  ) {
                                    this.checklistData[i]['isSelected'] = true;
                                    this.checklistData[i]['JOINING_DATE'] =
                                      this.array[j]['JOINING_DATE'];
                                    this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] =
                                      this.array[j]['GRAD_PAY_LEVEL_ID'];
                                    this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
                                      this.array[j]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'];
                                  } else {
                                  }
                                }
                              }
                            } else {
                            }
                          }
                        });
                    }
                    if (this.data2.ID) {
                      this.api
                        .residenceTypeRequest(
                          0,
                          0,
                          '',
                          '',
                          ' AND FLAT_REQUEST_ID = ' + allotmentid
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            this.array = data['data'];

                            if (data['data'].length > 0) {
                              for (
                                var i = 0;
                                i < this.checklistData.length;
                                i++
                              ) {
                                for (var j = 0; j < this.array.length; j++) {
                                  if (
                                    this.array[j]['RESIDENCE_TYPE'] ==
                                    this.checklistData[i]['RESIDENCE_TYPE']
                                  ) {
                                    this.checklistData[i]['isSelected'] = true;
                                    this.checklistData[i]['JOINING_DATE'] =
                                      this.array[j]['JOINING_DATE'];
                                    this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] =
                                      this.array[j]['GRAD_PAY_LEVEL_ID'];
                                    this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
                                      this.array[j]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'];
                                  } else {
                                  }
                                }
                              }
                            } else {
                            }
                          }
                        });

                      this.api
                        .getAllotmenmaster(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND ID = ' + this.data2.ALLOTEMENT_ID
                        )
                        .subscribe(
                          (data) => {
                            let allotmentmast = data['data'];
                            this.allomas = allotmentmast[0];
                            this.api
                              .getAllotmentchecklist(
                                0,
                                0,
                                'ID',
                                'desc',
                                ' AND ALLOTEMENT_ID = ' +
                                this.data2.ALLOTEMENT_ID
                              )
                              .subscribe(
                                (data) => {
                                  if (data['code'] == 200) {
                                    let allotchekda = data['data'];
                                    this.allodata = allotchekda[0];
                                  } else {
                                  }
                                },
                                (err) => { }
                              );
                          },
                          (err) => { }
                        );

                      this.api
                        .residenceTypeRequest(
                          0,
                          0,
                          'RESIDENCE_TYPE',
                          'asc',
                          ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            this.flatarrlist = data['data'];
                          }
                        });

                      this.api
                        .getfamilymaster(
                          0,
                          0,
                          'ID',
                          'desc',
                          ' AND EMP_ID =' +
                          this.data.EMPLOYEE_ID +
                          ' AND RELATION = "Father"'
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              let fatherdetail = data['data'];
                              if (fatherdetail.length > 0) {
                                this.fatherdetail1 = fatherdetail[0];
                                this.Fathername = fatherdetail[0]['NAME'];
                                let firstname =
                                  this.fatherdetail1.NAME.split(' ');
                                this.Father1name = firstname[0];
                              }
                            }
                          },
                          (err) => { }
                        );
                    }
                  } else {
                    this.data2 = new AllotmentCheckList();
                    this.data2.ALLOTEMENT_ID = allotmentid;
                    this.disableupload = true;
                  }
                  // this.stage = 1;
                  this.isSpinning = false;
                } else {
                  this.message.error("Can't Load Allotment Checklist Data", '');
                  this.isSpinning = false;
                }
              },
              (err) => {
                this.isSpinning = false;
              }
            );
        } else {
          if (sessionStorage.getItem('reapply') == 'T') {
            this.api
              .getAllotmentchecklist(
                1,
                1,
                'ID',
                'desc',
                ' AND ALLOTEMENT_ID =' + allotmentid
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data2 = data['data'][0];
                  }
                },
                (err) => { }
              );

            this.api
              .residenceTypeRequest(
                0,
                0,
                '',
                '',
                ' AND FLAT_REQUEST_ID = ' + allotmentid
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.array = data['data'];

                  if (data['data'].length > 0) {
                    for (
                      var i = 0;
                      i < this.checklistData.length;
                      i++
                    ) {
                      for (var j = 0; j < this.array.length; j++) {
                        if (
                          this.array[j]['RESIDENCE_TYPE'] ==
                          this.checklistData[i]['RESIDENCE_TYPE']
                        ) {
                          this.checklistData[i]['isSelected'] = true;
                          this.checklistData[i]['JOINING_DATE'] =
                            this.array[j]['JOINING_DATE'];
                          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] =
                            this.array[j]['GRAD_PAY_LEVEL_ID'];
                          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
                            this.array[j]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'];
                        } else {
                        }
                      }
                    }
                  } else {
                  }
                }
              });
            this.data2.ALLOTEMENT_ID = allotmentid;
            this.disableupload = true;
            // this.stage = 1;
            this.isSpinning = false;
          } else {
            this.data2 = new AllotmentCheckList();
            this.data2.ALLOTEMENT_ID = allotmentid;
            this.disableupload = true;
            this.isSpinning = false;
          }
        }
      },
      (err) => { }
    );
  }

  pre() {
    this.stage -= 1;
  }

  emolumentdrawn(event: boolean) {
    this.data.IS_EMOLUMENTS_DRAWN = event;
    if (this.data.IS_EMOLUMENTS_DRAWN == false) {
      this.data.EMOLUMENTS_DRAWN = '';
    }
  }
  joinallotletter(event: boolean) {
    this.data.JOINING_ALLOTMENT_YEAR = event;
  }
  workinglatter(event: boolean) {
    this.data.IS_SPOUSE_WORKING_IN_GOV = event;
    if (event == false) {
      this.data.SPOUSE_EMP_CODE = null;
      this.data.SPOUSE_NAME = null;
      this.data.MARRIAGE_CERTIFICATE = null;
      this.showmarriagecertificate = true;
      this.progressBar10 = false;
      this.percent10 = 0;
    }
  }
  isanygov(event: boolean) {
    this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED = event;
    if (this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == false) {
      this.data2.ALLOCATED_TO = '';
      this.data2.ALLOCATED_BY = '';
      this.data2.ALLOCATED_BY_DEPARTMENT = '';
    }
  }

  fammememp(event: boolean) {
    this.data2.IS_EMPLOYEED_FAMILY_MEMBER = event;
    if (this.data2.IS_EMPLOYEED_FAMILY_MEMBER == false) {
      this.data2.OFFICE_NAME_OF_FAMILY_MEM = '';
    }
  }
  applicantsaty(event: boolean) {
    this.data2.IS_APPLICANT_STAY_PRESENTLY = event;
    if (this.data2.IS_APPLICANT_STAY_PRESENTLY == false) {
      this.data2.TYPE_RESIDENCE = '';
      this.data2.RENTED_PREMISES_NAME = '';
      this.data2.POOL_NAME = '';
    }
  }
  cancelledapplication(event: boolean) {
    this.data2.CANCELLED_ALLOTMENT = event;
    if (this.data2.CANCELLED_ALLOTMENT == false) {
      this.data2.AFFIRMATIVE_INDICATE = '';
    }
  }
  applicantfamily(event: boolean) {
    this.data2.APPLICANT_FAMILY = event;
    if (this.data2.APPLICANT_FAMILY == false) {
      this.data2.STATION_DUTY_FAR_FAMILY = '';
    }
  }
  isOk;
  applicationdate: any;
  applicationinfo: any;
  printformm: any;
  approveddate: any;
  newdateforpreview: any = new Date();
  empSave() {
    this.newdateforpreview = new Date();
    this.isOk = true;
    this.data.PRESENT_RESENDENTIAL_ADDRESS = this.emp_address;
    this.data.PRESENT_OFFICE_ADDRESS = this.headquarter_name;
    // this.data.DESIGNATION = this.emp_Designation;
    this.data.DESIGNATION_ID = this.emp_Designation_ID;
    // this.data.OFFICER_CAST = this.emp_cast;
    this.data.OFFICER_CAST = this.emp_cast;

    this.data.DATE_JOINING = this.joining_date;
    this.data.GRADE_PAY = this.Grade_pay;
    this.data.PAY_LEVEL = this.gradepay_level;
    this.data.FLAT_PREFERENCE = this.listofpreferencetype;

    this.isOksss = false;
    // this.isOksss = false;
    this.isOksss1 = false;
    this.isOksss2 = false;
    let checklisdat = this.checklistData.find((value) => {
      return value.isSelected == true;
    });

    for (var i = 4; i < this.checklistData.length; i++) {
      this.isOksss = false;
      this.isOksss1 = false;
      this.isOksss2 = false;
      if (this.checklistData[i]['isSelected'] == true) {
        if (
          this.checklistData[i]['JOINING_DATE'] == '' ||
          this.checklistData[i]['JOINING_DATE'] == undefined ||
          this.checklistData[i]['JOINING_DATE'] == null
        ) {
          this.isOksss = true;
          console.log(this.checklistData[i], " this.checklistData[i]")
          if (this.checklistData[i]['RESIDENCE_TYPE'] == 1 || this.checklistData[i]['RESIDENCE_TYPE'] == 2 || this.checklistData[i]['RESIDENCE_TYPE'] == 3) {
            this.conditionbasedErrorMessage = 'Please Select Date of Joining for Selected Residence Type';
          } else {
            this.conditionbasedErrorMessage = 'Please Select Date of Priority for Selected Residence Type';
          }
          break;
        } else if (
          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] == '' ||
          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] == undefined ||
          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] == null
        ) {
          this.isOksss = false;
          this.isOksss1 = true;
          break;
        } else if (
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] == '' ||
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] ==
          undefined ||
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] == null
        ) {
          this.isOksss = false;
          this.isOksss1 = false;
          this.isOksss2 = true;
          break;
        } else {
          this.isOksss = false;
          this.isOksss1 = false;
          this.isOksss2 = false;
        }
      }
    }


    if (
      this.data.DESIGNATION_ID == '' &&
      // this.data.DESIGNATION == '' &&
      this.data.DATE_JOINING == '' &&
      this.data.JOINING_LETTER == '' &&
      this.data.JOINING_ALLOTMENT_YEAR == false &&
      this.data.JOINING_ALLOTEMENT_DETAILS == '' &&
      this.data.JOINING_ALLOTMENT_LETTER == null &&
      this.data.SUPERANNUATION_DATE == '' &&
      this.data.PRESENT_RESENDENTIAL_ADDRESS == '' &&
      this.data.PRESENT_OFFICE_ADDRESS == '' &&
      this.data.GRADE_PAY == '' &&
      this.data.PAY_LEVEL == '' &&
      this.data.GRADE_PAY_DRAWN_DATE == '' &&
      this.data.GRADE_PAY_DRAWN_LETTER == '' &&
      this.data.IS_EMOLUMENTS_DRAWN == false &&
      this.data.EMOLUMENTS_DRAWN == '' &&
      this.data.ACCOMMODATION_TYPE == '' &&
      this.data.ACCOMMODATION_SENIORITY_DATE == '' &&
      this.data.DATE_MIN_PAY_GOV == '' &&
      this.data.EMPLOYEE_ID == ''
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Details ', '');
    }
    else if (
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.ShowProfile();
      this.message.error('Please Fill All The Required Details', '');
    }
    else if (
      this.data.DATE_JOINING == undefined ||
      this.data.DATE_JOINING == null ||
      this.data.DATE_JOINING == ''
    ) {
      this.isOk = false;
      this.message.error(this.conditionbasedErrorMessage, '');
    } else if (
      this.data.PRESENT_RESENDENTIAL_ADDRESS == undefined ||
      this.data.PRESENT_RESENDENTIAL_ADDRESS == null ||
      this.data.PRESENT_RESENDENTIAL_ADDRESS == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Your Present Residential Address', '');
    } else if (
      this.data.PRESENT_OFFICE_ADDRESS == undefined ||
      this.data.PRESENT_OFFICE_ADDRESS == null ||
      this.data.PRESENT_OFFICE_ADDRESS == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Your Present Office Address', '');
    } else if (
      this.data.GRADE_PAY == undefined ||
      this.data.GRADE_PAY == null ||
      this.data.GRADE_PAY == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Your Grade Pay', '');
    } else if (
      this.data.GRADE_PAY_DRAWN_DATE == undefined ||
      this.data.GRADE_PAY_DRAWN_DATE == null ||
      this.data.GRADE_PAY_DRAWN_DATE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Grade Pay Drawn Date ', '');
    } else if (
      this.data.GRADE_PAY_DRAWN_LETTER == undefined ||
      this.data.GRADE_PAY_DRAWN_LETTER == null ||
      this.data.GRADE_PAY_DRAWN_LETTER == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Grade Pay Drawn Letter ', '');
    } else if (
      this.data.JOINING_LETTER == undefined ||
      this.data.JOINING_LETTER == null ||
      this.data.JOINING_LETTER == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Joining Letter ', '');
    } else if (
      this.data.SUPERANNUATION_DATE == undefined ||
      this.data.SUPERANNUATION_DATE == null ||
      this.data.SUPERANNUATION_DATE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Your Super Annuation Date ', '');
    } else if (
      this.data.PAY_SLIP == undefined ||
      this.data.PAY_SLIP == null ||
      this.data.PAY_SLIP == ''
    ) {
      this.isOk = false;
      this.message.error('Please Upload Pay Slip ', '');
    } else if (
      this.data.I_CARD == undefined ||
      this.data.I_CARD == null ||
      this.data.I_CARD == ''
    ) {
      this.isOk = false;
      this.message.error('Please Upload I-Card ', '');
    } else if (
      this.data.IS_EMOLUMENTS_DRAWN == true &&
      (this.data.EMOLUMENTS_DRAWN == undefined ||
        this.data.EMOLUMENTS_DRAWN == null ||
        this.data.EMOLUMENTS_DRAWN == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Details of Emoluments Drawn ', '');
    } else if (
      this.data.JOINING_ALLOTMENT_YEAR == true &&
      (this.data.JOINING_ALLOTMENT_LETTER == undefined ||
        this.data.JOINING_ALLOTMENT_LETTER == null ||
        this.data.JOINING_ALLOTMENT_LETTER == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Joining Allotment Letter ', '');
    } else if (
      this.data.ACCOMMODATION_SENIORITY_DATE == undefined ||
      this.data.ACCOMMODATION_SENIORITY_DATE == null ||
      this.data.ACCOMMODATION_SENIORITY_DATE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Your Seniority Date ', '');
    } else if (
      this.data.STATUS == 'A' &&
      (this.data.FLAT_PREFERENCE == undefined ||
        this.data.FLAT_PREFERENCE == null ||
        this.data.FLAT_PREFERENCE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Details Of Your Preference ', '');
    } else if (
      this.data.IS_SPOUSE_WORKING_IN_GOV == true &&
      (this.data.SPOUSE_NAME == undefined ||
        this.data.SPOUSE_NAME == null ||
        this.data.SPOUSE_NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Spouse Name', '');
    } else if (
      this.data.IS_SPOUSE_WORKING_IN_GOV == true &&
      (this.data.SPOUSE_EMP_CODE == undefined ||
        this.data.SPOUSE_EMP_CODE == null ||
        this.data.SPOUSE_EMP_CODE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Spouse Employee Code', '');
    } else if (
      this.data.IS_SPOUSE_WORKING_IN_GOV == true &&
      (this.data.MARRIAGE_CERTIFICATE == undefined ||
        this.data.MARRIAGE_CERTIFICATE == null ||
        this.data.MARRIAGE_CERTIFICATE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Upload Marriage certificate', '');
    } else if (!checklisdat) {
      this.isOk = false;
      this.message.error('Please Select Residence Type', '');
    } else if (this.isOksss) {
      this.isOk = false;
      this.message.error(this.conditionbasedErrorMessage, '');
    } else if (this.isOksss1) {
      this.isOk = false;
      this.message.error('Please Select Grade Pay Level for Selected Residence Type', '');
    } else if (this.isOksss2) {
      this.isOk = false;
      this.message.error('Please Select Date Of Present Pay Level for Selected Residence Type', '');
    } else if (
      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true &&
      (this.data2.ALLOCATED_TO == undefined ||
        this.data2.ALLOCATED_TO == null ||
        this.data2.ALLOCATED_TO == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Residence Allocated To', '');
    } else if (
      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true &&
      (this.data2.ALLOCATED_BY == undefined ||
        this.data2.ALLOCATED_BY == null ||
        this.data2.ALLOCATED_BY == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Allocated By Department ', '');
    } else if (
      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true &&
      (this.data2.ALLOCATED_BY_DEPARTMENT == undefined ||
        this.data2.ALLOCATED_BY_DEPARTMENT == null ||
        this.data2.ALLOCATED_BY_DEPARTMENT == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Allocated By Department Name ', '');
    } else if (
      this.data2.IS_EMPLOYEED_FAMILY_MEMBER == true &&
      (this.data2.OFFICE_NAME_OF_FAMILY_MEM == undefined ||
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == null ||
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Name of Family Member', '');
    } else if (
      this.data2.IS_APPLICANT_STAY_PRESENTLY == true &&
      (this.data2.TYPE_RESIDENCE == undefined ||
        this.data2.TYPE_RESIDENCE == null ||
        this.data2.TYPE_RESIDENCE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Type of Residence', '');
    } else if (
      this.data2.TYPE_RESIDENCE == 'In Rented Primeses' &&
      (this.data2.RENTED_PREMISES_NAME == undefined ||
        this.data2.RENTED_PREMISES_NAME == null ||
        this.data2.RENTED_PREMISES_NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Rented Premises Name ', '');
    } else if (
      this.data2.TYPE_RESIDENCE ==
      'In quarter from general pool/Any Other pool.' &&
      (this.data2.POOL_NAME == undefined ||
        this.data2.POOL_NAME == null ||
        this.data2.POOL_NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Pool Name ', '');
    } else if (
      this.data2.CANCELLED_ALLOTMENT == true &&
      (this.data2.AFFIRMATIVE_INDICATE == undefined ||
        this.data2.AFFIRMATIVE_INDICATE == null ||
        this.data2.AFFIRMATIVE_INDICATE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Allotment Details', '');
    } else if (
      this.data2.APPLICANT_FAMILY == true &&
      (this.data2.STATION_DUTY_FAR_FAMILY == undefined ||
        this.data2.STATION_DUTY_FAR_FAMILY == null ||
        this.data2.STATION_DUTY_FAR_FAMILY == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Station in city Details', '');
    }

    this.checklistData['JOINING_DATE'] = this.datepipe.transform(
      this.checklistData['JOINING_DATE'],
      'yyyy-MM-dd'
    );
    this.data.DATE_CONDITION = 'AID';

    for (var i = 0; this.checklistData.length > i; i++) {
      this.checklistData[i]['JOINING_DATE'] = this.datepipe.transform(
        this.checklistData[i]['JOINING_DATE'],
        'yyyy-MM-dd'
      );
      this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
        this.datepipe.transform(
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'],
          'yyyy-MM-dd'
        );
    }

    if (this.data.JOINING_ALLOTMENT_YEAR == false) {
      this.data.JOINING_ALLOTMENT_LETTER = null;
    }
    if (this.data.IS_EMOLUMENTS_DRAWN == false) {
      this.data.EMOLUMENTS_DRAWN = '';
    }
    this.data.SUPERANNUATION_DATE = this.datepipe.transform(
      this.data.SUPERANNUATION_DATE,
      'yyyy-MM-dd'
    );
    this.data.DATE_JOINING = this.datepipe.transform(
      this.data.DATE_JOINING,
      'yyyy-MM-dd'
    );
    this.data.GRADE_PAY_DRAWN_DATE = this.datepipe.transform(
      this.data.GRADE_PAY_DRAWN_DATE,
      'yyyy-MM-dd'
    );
    this.data.ACCOMMODATION_SENIORITY_DATE = this.datepipe.transform(
      this.data.ACCOMMODATION_SENIORITY_DATE,
      'yyyy-MM-dd'
    );
    this.data.APPLICATION_DATETIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.data.STATUS = '';
    this.data.OFFICER_CAST = this.emp_cast
    if (this.isOk) {

      this.isSpinning = true;
      if (this.data.ID) {
        this.data.STEP_NO = 0;
        this.api.UpdateAllotmentmaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.message.success(' Information Updated Successfully...', '');
            // this.next();
            this.data2.RESIDENCE_DATA = [];
            this.stage = 1;
            for (var i = 0; this.checklistData.length > i; i++) {
              if (this.checklistData[i]['isSelected'] == true) {
                this.data2.RESIDENCE_DATA.push({
                  RESIDENCE_TYPE: this.checklistData[i]['RESIDENCE_TYPE'],
                  JOINING_DATE: this.checklistData[i]['JOINING_DATE'],
                  PRESENT_PAY_LEVEL_DATE_ABOVE_4S:
                    this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'],
                  GRAD_PAY_LEVEL_ID_ABOVE_4S:
                    this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'],
                  FLAT_REQUEST_ID: this.generateddatalist[0]['ID'],
                });
              }
            }
            this.isSpinningprintform = true;
            this.api
              .getAllotmenmaster(
                0,
                0,
                'ID',
                'desc',
                ' AND EMPLOYEE_ID = ' + Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    let getlatestallot = data['data'];
                    this.applicationdate =
                      data['data'][0]['APPLICATION_DATETIME'];
                    let latestallotID = getlatestallot[0]['ID'];
                    this.data.ID = latestallotID;

                    if (this.data2.ID) {
                      this.api
                        .UpdateAllotmentCheckListmaster(this.data2)
                        .subscribe((successCode1) => {
                          if (successCode1.code == '200') {
                            this.message.success(' Information Updated Successfully...', '');
                            this.isSpinning = false;
                            this.data.STEP_NO = 0;
                            this.api
                              .UpdateAllotmentmaster(this.data)
                              .subscribe((successCode) => {
                                if (successCode.code == '200') {
                                  this.api
                                    .getAllotmenmaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe(
                                      (data) => {
                                        let allotmentmast = data['data'];
                                        this.allomas = allotmentmast[0];
                                        this.applicationinfo =
                                          data['data'][0]['APP_INFO_DATETIME'];
                                        this.api
                                          .getAllotmentchecklist(
                                            0,
                                            0,
                                            'ID',
                                            'desc',
                                            ' AND ALLOTEMENT_ID = ' + this.data2.ALLOTEMENT_ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                let allotchekda = data['data'];
                                                this.allodata = allotchekda[0];

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
                                                        this.isSpinningprintform = false;
                                                        this.EMP_DATA123 = Object.assign(
                                                          {},
                                                          data['data'][0]
                                                        );
                                                        this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                                                        this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                                                        this.basicpay = data['data'][0]['BASIC_PAY'];
                                                        this.Employee_name =
                                                          data['data'][0]['NAME'];
                                                        this.employee_code =
                                                          data['data'][0]['EMPLOYEE_CODE'];
                                                        this.emp_Designation =
                                                          data['data'][0]['ITHR_DESIGNATION_NAME'];
                                                        this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                                                        this.firstname = data['data'][0]['FIRST_NAME'];
                                                        this.middlename = data['data'][0]['MIDDLE_NAME'];
                                                        this.lastname = data['data'][0]['LAST_NAME'];
                                                        this.emp_Designation_ID =
                                                          data['data'][0]['DESIGNATION_ID'];
                                                        this.emp_dob = data['data'][0]['DOB'];
                                                        this.office_name =
                                                          data['data'][0]['OFFICE_NAME'];
                                                        this.service_type =
                                                          data['data'][0]['SERVICE_TYPE'];
                                                        this.Grade_pay =
                                                          data['data'][0]['GRASS_GRADE_PAY'];
                                                        this.gradepay_level =
                                                          data['data'][0]['GRADE_PAY_LEVEL'];
                                                        this.emp_address =
                                                          data['data'][0]['ADDRESS'];
                                                        this.emp_cast =
                                                          data['data'][0]['CAST'];
                                                        this.headquarter_name =
                                                          data['data'][0]['LOCATION'];
                                                        this.joining_date =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.flatpref.DATE_OF_JOINING =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.data.DEMO_GRADE_PAY_ID =
                                                          data['data'][0][
                                                          'GRAAS_GRADE_PAY_ID'
                                                          ];
                                                        this.data.JOINING_LETTER =
                                                          data['data'][0]['JOINING_LETTER'];

                                                        this.isSpinning = false;
                                                        this.isSpinningprintform = false;
                                                      } else {
                                                        this.message.error(
                                                          "Can't Load Employee Data",
                                                          ''
                                                        );
                                                        this.isSpinning = false;
                                                        this.isSpinningprintform = false;
                                                      }
                                                    },
                                                    (err) => {
                                                      this.isSpinning = false;
                                                      this.isSpinningprintform = false;
                                                    }
                                                  );
                                              } else {
                                                this.isSpinning = false;
                                                this.isSpinningprintform = false;
                                              }
                                            }, err => {
                                              this.isSpinningprintform = false;
                                              this.isSpinning = false;
                                            });
                                      }, err => {
                                        this.isSpinningprintform = false;
                                        this.isSpinning = false;
                                      });

                                  this.api
                                    .residenceTypeRequest(
                                      0,
                                      0,
                                      'RESIDENCE_TYPE',
                                      'asc',
                                      ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        this.flatarrlist = data['data'];
                                      }
                                    });

                                  this.api
                                    .getfamilymaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND EMP_ID =' +
                                      this.data.EMPLOYEE_ID +
                                      ' AND RELATION = "Father"'
                                    )
                                    .subscribe(
                                      (data) => {
                                        if (data['code'] == 200) {
                                          let fatherdetail = data['data'];
                                          if (fatherdetail.length > 0) {
                                            this.fatherdetail1 = fatherdetail[0];
                                            this.Fathername = fatherdetail[0]['NAME'];
                                            let firstname =
                                              this.fatherdetail1.NAME.split(' ');
                                            this.Father1name = firstname[0];
                                          }
                                        }
                                      },
                                      (err) => { }
                                    );

                                  this.stage = 1;
                                  this.isSpinning = false;
                                } else {
                                  this.message.error(' Failed To Update Information...', '');
                                  this.isSpinning = false;
                                  this.isSpinningprintform = false;
                                }
                              }, err => {
                                this.isSpinningprintform = false;
                                this.isSpinning = false;
                              });
                          } else {
                            this.message.error(' Failed To Update Information...', '');
                            this.isSpinning = false;
                            this.isSpinningprintform = true;
                          }
                        }, err => {
                          this.isSpinningprintform = false;
                          this.isSpinning = false;

                        });
                    } else {
                      this.api
                        .createAllotmentCheckListmaster(this.data2)
                        .subscribe((successCode) => {
                          if (successCode.code == '200') {
                            this.message.success(' Information Save Successfully...', '');
                            this.isSpinning = false;

                            this.data.STEP_NO = 0;
                            this.api
                              .UpdateAllotmentmaster(this.data)
                              .subscribe((successCode) => {
                                if (successCode.code == '200') {
                                  this.api
                                    .getAllotmenmaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe(
                                      (data) => {
                                        let allotmentmast = data['data'];
                                        this.allomas = allotmentmast[0];
                                        this.applicationinfo =
                                          data['data'][0]['APP_INFO_DATETIME'];
                                        this.api
                                          .getAllotmentchecklist(
                                            0,
                                            0,
                                            'ID',
                                            'desc',
                                            ' AND ALLOTEMENT_ID = ' + this.data2.ALLOTEMENT_ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                let allotchekda = data['data'];
                                                this.allodata = allotchekda[0];
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
                                                      this.isSpinningprintform = false;
                                                      if (data['code'] == 200) {
                                                        this.isSpinningprintform = false;
                                                        this.EMP_DATA123 = Object.assign(
                                                          {},
                                                          data['data'][0]
                                                        );
                                                        this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                                                        this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                                                        this.basicpay = data['data'][0]['BASIC_PAY'];
                                                        this.Employee_name =
                                                          data['data'][0]['NAME'];
                                                        this.employee_code =
                                                          data['data'][0]['EMPLOYEE_CODE'];
                                                        this.emp_Designation =
                                                          data['data'][0]['ITHR_DESIGNATION_NAME'];
                                                        this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                                                        this.firstname = data['data'][0]['FIRST_NAME'];
                                                        this.middlename = data['data'][0]['MIDDLE_NAME'];
                                                        this.lastname = data['data'][0]['LAST_NAME'];
                                                        this.emp_Designation_ID =
                                                          data['data'][0]['DESIGNATION_ID'];
                                                        this.emp_dob = data['data'][0]['DOB'];
                                                        this.office_name =
                                                          data['data'][0]['OFFICE_NAME'];
                                                        this.service_type =
                                                          data['data'][0]['SERVICE_TYPE'];
                                                        this.Grade_pay =
                                                          data['data'][0]['GRASS_GRADE_PAY'];
                                                        this.gradepay_level =
                                                          data['data'][0]['GRADE_PAY_LEVEL'];
                                                        this.emp_address =
                                                          data['data'][0]['ADDRESS'];
                                                        this.emp_cast =
                                                          data['data'][0]['CAST'];
                                                        this.headquarter_name =
                                                          data['data'][0]['LOCATION'];
                                                        this.joining_date =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.flatpref.DATE_OF_JOINING =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.data.DEMO_GRADE_PAY_ID =
                                                          data['data'][0][
                                                          'GRAAS_GRADE_PAY_ID'
                                                          ];
                                                        this.data.JOINING_LETTER =
                                                          data['data'][0]['JOINING_LETTER'];

                                                        this.isSpinning = false;
                                                        this.isSpinningprintform = false;
                                                      } else {
                                                        this.message.error(
                                                          "Can't Load Employee Data",
                                                          ''
                                                        );
                                                        this.isSpinning = false;
                                                        this.isSpinningprintform = false;
                                                      }
                                                    },
                                                    (err) => {
                                                      this.isSpinning = false;
                                                      this.isSpinningprintform = false;
                                                    }
                                                  );
                                              } else {
                                                this.isSpinningprintform = false;
                                                this.isSpinning = false;
                                              }
                                            }, err => {
                                              this.isSpinningprintform = false;
                                              this.isSpinning = false;
                                            });
                                      }, err => {
                                        this.isSpinningprintform = false;
                                        this.isSpinning = false;
                                      });

                                  this.api
                                    .residenceTypeRequest(
                                      0,
                                      0,
                                      'RESIDENCE_TYPE',
                                      'asc',
                                      ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        this.flatarrlist = data['data'];
                                        this.data3 = Object.assign({}, this.data);
                                        this.data4 = Object.assign({}, this.data2);
                                      }
                                    });

                                  this.api
                                    .getfamilymaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND EMP_ID =' +
                                      this.data.EMPLOYEE_ID +
                                      ' AND RELATION = "Father"'
                                    )
                                    .subscribe(
                                      (data) => {
                                        if (data['code'] == 200) {
                                          let fatherdetail = data['data'];
                                          if (fatherdetail.length > 0) {
                                            this.fatherdetail1 = fatherdetail[0];
                                            this.Fathername = fatherdetail[0]['NAME'];
                                            let firstname =
                                              this.fatherdetail1.NAME.split(' ');
                                            this.Father1name = firstname[0];
                                          }
                                        }
                                      },
                                      (err) => { }
                                    );
                                  this.stage = 1;
                                  this.isSpinning = false;
                                } else {
                                  this.message.error(' Failed To Update Information...', '');
                                  this.isSpinning = false;
                                  this.isSpinningprintform = false;
                                }
                              }, err => {
                                this.isSpinningprintform = false;
                                this.isSpinning = false;
                              });
                          } else {
                            this.message.error(' Failed To Save Information...', '');
                            this.isSpinning = false;
                            this.isSpinningprintform = false;
                          }
                        }, err => {
                          this.isSpinningprintform = false;
                          this.isSpinning = false;
                        });
                    }
                  } else {
                    this.isSpinningprintform = true;
                  }
                },
                (err) => {
                  this.isSpinningprintform = true;
                }
              );
            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.info(
              'You have not permmission for Quater Application',
              ''
            );
            this.isSpinning = false;
            this.isSpinningprintform = false;
          } else if (successCode.code == '302') {
            this.message.info('Please Enter valid Spouse Employee code', '');
            this.isSpinning = false;
            this.isSpinningprintform = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
            this.isSpinningprintform = false;
          }
        }, err => {
          this.isSpinningprintform = false;
          this.isSpinning = false;
        });
      } else {
        this.data.STEP_NO = 0;
        this.data.STATUS = '';
        this.api.createAllotmentmaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data2.RESIDENCE_DATA = [];
            this.stage = 1;
            for (var i = 0; this.checklistData.length > i; i++) {
              if (this.checklistData[i]['isSelected'] == true) {
                this.data2.RESIDENCE_DATA.push({
                  RESIDENCE_TYPE: this.checklistData[i]['RESIDENCE_TYPE'],
                  JOINING_DATE: this.checklistData[i]['JOINING_DATE'],
                  PRESENT_PAY_LEVEL_DATE_ABOVE_4S:
                    this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'],
                  GRAD_PAY_LEVEL_ID_ABOVE_4S:
                    this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'],
                  FLAT_REQUEST_ID: successCode['ID'],
                });
              }
            }
            this.data2.ALLOTEMENT_ID = successCode['ID'];
            // this.message.success(' Information Save Successfully...', '');
            // this.next();
            this.api
              .getAllotmenmaster(
                0,
                0,
                'ID',
                'desc',
                ' AND EMPLOYEE_ID = ' + Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    let getlatestallot = data['data'];
                    this.applicationdate =
                      data['data'][0]['APPLICATION_DATETIME'];
                    let latestallotID = getlatestallot[0]['ID'];
                    this.data.ID = latestallotID;
                    if (this.data2.ID) {
                      this.api
                        .UpdateAllotmentCheckListmaster(this.data2)
                        .subscribe((successCode) => {
                          if (successCode.code == '200') {
                            this.message.success(' Information Updated Successfully...', '');
                            this.isSpinning = false;
                            this.data.STEP_NO = 0;
                            this.api
                              .UpdateAllotmentmaster(this.data)
                              .subscribe((successCode) => {
                                if (successCode.code == '200') {
                                  this.api
                                    .getAllotmenmaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe(
                                      (data) => {
                                        let allotmentmast = data['data'];
                                        this.allomas = allotmentmast[0];
                                        this.applicationinfo =
                                          data['data'][0]['APP_INFO_DATETIME'];
                                        this.api
                                          .getAllotmentchecklist(
                                            0,
                                            0,
                                            'ID',
                                            'desc',
                                            ' AND ALLOTEMENT_ID = ' + this.data2.ALLOTEMENT_ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                let allotchekda = data['data'];
                                                this.allodata = allotchekda[0];
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
                                                        this.EMP_DATA123 = Object.assign(
                                                          {},
                                                          data['data'][0]
                                                        );
                                                        this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                                                        this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                                                        this.basicpay = data['data'][0]['BASIC_PAY'];
                                                        this.Employee_name =
                                                          data['data'][0]['NAME'];
                                                        this.employee_code =
                                                          data['data'][0]['EMPLOYEE_CODE'];
                                                        this.emp_Designation =
                                                          data['data'][0]['ITHR_DESIGNATION_NAME'];
                                                        this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                                                        this.firstname = data['data'][0]['FIRST_NAME'];
                                                        this.middlename = data['data'][0]['MIDDLE_NAME'];
                                                        this.lastname = data['data'][0]['LAST_NAME'];
                                                        this.emp_Designation_ID =
                                                          data['data'][0]['DESIGNATION_ID'];
                                                        this.emp_dob = data['data'][0]['DOB'];
                                                        this.office_name =
                                                          data['data'][0]['OFFICE_NAME'];
                                                        this.service_type =
                                                          data['data'][0]['SERVICE_TYPE'];
                                                        this.Grade_pay =
                                                          data['data'][0]['GRASS_GRADE_PAY'];
                                                        this.gradepay_level =
                                                          data['data'][0]['GRADE_PAY_LEVEL'];
                                                        this.emp_address =
                                                          data['data'][0]['ADDRESS'];
                                                        this.emp_cast =
                                                          data['data'][0]['CAST'];
                                                        this.headquarter_name =
                                                          data['data'][0]['LOCATION'];
                                                        this.joining_date =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.flatpref.DATE_OF_JOINING =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.data.DEMO_GRADE_PAY_ID =
                                                          data['data'][0][
                                                          'GRAAS_GRADE_PAY_ID'
                                                          ];
                                                        this.data.JOINING_LETTER =
                                                          data['data'][0]['JOINING_LETTER'];

                                                        this.isSpinning = false;
                                                      } else {
                                                        this.message.error(
                                                          "Can't Load Employee Data",
                                                          ''
                                                        );
                                                        this.isSpinning = false;
                                                      }
                                                    },
                                                    (err) => {
                                                      this.isSpinning = false;
                                                    }
                                                  );
                                              } else {
                                              }
                                            },
                                            (err) => { }
                                          );
                                      },
                                      (err) => { }
                                    );
                                  sessionStorage.setItem('flat_check_id', "'" + this.data2.ALLOTEMENT_ID + "'");

                                  this.api
                                    .residenceTypeRequest(
                                      0,
                                      0,
                                      'RESIDENCE_TYPE',
                                      'asc',
                                      ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        this.flatarrlist = data['data'];
                                      }
                                    });

                                  this.api
                                    .getfamilymaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND EMP_ID =' +
                                      this.data.EMPLOYEE_ID +
                                      ' AND RELATION = "Father"'
                                    )
                                    .subscribe(
                                      (data) => {
                                        if (data['code'] == 200) {
                                          let fatherdetail = data['data'];
                                          if (fatherdetail.length > 0) {
                                            this.fatherdetail1 = fatherdetail[0];
                                            this.Fathername = fatherdetail[0]['NAME'];
                                            let firstname =
                                              this.fatherdetail1.NAME.split(' ');
                                            this.Father1name = firstname[0];
                                          }
                                        }
                                      },
                                      (err) => { }
                                    );

                                  this.stage = 1;
                                  this.isSpinning = false;
                                } else {
                                  this.message.error(' Failed To Update Information...', '');
                                  this.isSpinning = false;
                                }
                              });
                          } else {
                            this.message.error(' Failed To Update Information...', '');
                            this.isSpinning = false;
                          }
                        });
                    } else {
                      this.api
                        .createAllotmentCheckListmaster(this.data2)
                        .subscribe((successCode) => {
                          if (successCode.code == '200') {
                            this.message.success(' Information Save Successfully...', '');
                            this.isSpinning = false;

                            this.data.STEP_NO = 0;
                            this.api
                              .UpdateAllotmentmaster(this.data)
                              .subscribe((successCode) => {
                                if (successCode.code == '200') {
                                  this.api
                                    .getAllotmenmaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe(
                                      (data) => {
                                        let allotmentmast = data['data'];
                                        this.allomas = allotmentmast[0];
                                        this.applicationinfo =
                                          data['data'][0]['APP_INFO_DATETIME'];
                                        this.api
                                          .getAllotmentchecklist(
                                            0,
                                            0,
                                            'ID',
                                            'desc',
                                            ' AND ALLOTEMENT_ID = ' + this.data2.ALLOTEMENT_ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                let allotchekda = data['data'];
                                                this.allodata = allotchekda[0];
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
                                                        this.EMP_DATA123 = Object.assign(
                                                          {},
                                                          data['data'][0]
                                                        );
                                                        this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                                                        this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                                                        this.basicpay = data['data'][0]['BASIC_PAY'];
                                                        this.Employee_name =
                                                          data['data'][0]['NAME'];
                                                        this.employee_code =
                                                          data['data'][0]['EMPLOYEE_CODE'];
                                                        this.emp_Designation =
                                                          data['data'][0]['ITHR_DESIGNATION_NAME'];
                                                        this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                                                        this.firstname = data['data'][0]['FIRST_NAME'];
                                                        this.middlename = data['data'][0]['MIDDLE_NAME'];
                                                        this.lastname = data['data'][0]['LAST_NAME'];
                                                        this.emp_Designation_ID =
                                                          data['data'][0]['DESIGNATION_ID'];
                                                        this.emp_dob = data['data'][0]['DOB'];
                                                        this.office_name =
                                                          data['data'][0]['OFFICE_NAME'];
                                                        this.service_type =
                                                          data['data'][0]['SERVICE_TYPE'];
                                                        this.Grade_pay =
                                                          data['data'][0]['GRASS_GRADE_PAY'];
                                                        this.gradepay_level =
                                                          data['data'][0]['GRADE_PAY_LEVEL'];
                                                        this.emp_address =
                                                          data['data'][0]['ADDRESS'];
                                                        this.emp_cast =
                                                          data['data'][0]['CAST'];
                                                        this.headquarter_name =
                                                          data['data'][0]['LOCATION'];
                                                        this.joining_date =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.flatpref.DATE_OF_JOINING =
                                                          data['data'][0]['JOINING_DATE'];
                                                        this.data.DEMO_GRADE_PAY_ID =
                                                          data['data'][0][
                                                          'GRAAS_GRADE_PAY_ID'
                                                          ];
                                                        this.data.JOINING_LETTER =
                                                          data['data'][0]['JOINING_LETTER'];

                                                        this.isSpinning = false;
                                                      } else {
                                                        this.message.error(
                                                          "Can't Load Employee Data",
                                                          ''
                                                        );
                                                        this.isSpinning = false;
                                                      }
                                                    },
                                                    (err) => {
                                                      this.isSpinning = false;
                                                    }
                                                  );
                                              } else {
                                              }
                                            },
                                            (err) => { }
                                          );
                                      },
                                      (err) => { }
                                    );
                                  sessionStorage.setItem('flat_check_id', "'" + this.data2.ALLOTEMENT_ID + "'");

                                  this.api
                                    .residenceTypeRequest(
                                      0,
                                      0,
                                      'RESIDENCE_TYPE',
                                      'asc',
                                      ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                                    )
                                    .subscribe((data) => {
                                      if (data['code'] == 200) {
                                        this.flatarrlist = data['data'];
                                        this.data3 = Object.assign({}, this.data);
                                        this.data4 = Object.assign({}, this.data2);
                                      }
                                    });

                                  this.api
                                    .getfamilymaster(
                                      0,
                                      0,
                                      'ID',
                                      'desc',
                                      ' AND EMP_ID =' +
                                      this.data.EMPLOYEE_ID +
                                      ' AND RELATION = "Father"'
                                    )
                                    .subscribe(
                                      (data) => {
                                        if (data['code'] == 200) {
                                          let fatherdetail = data['data'];
                                          if (fatherdetail.length > 0) {
                                            this.fatherdetail1 = fatherdetail[0];
                                            this.Fathername = fatherdetail[0]['NAME'];
                                            let firstname =
                                              this.fatherdetail1.NAME.split(' ');
                                            this.Father1name = firstname[0];
                                          }
                                        }
                                      },
                                      (err) => { }
                                    );
                                  this.stage = 1;
                                  this.isSpinning = false;
                                } else {
                                  this.message.error(' Failed To Update Information...', '');
                                  this.isSpinning = false;
                                }
                              });
                          } else {
                            this.message.error(' Failed To Save Information...', '');
                            this.isSpinning = false;
                          }
                        });
                    }
                  }

                },
                (err) => { }
              );

            this.isSpinning = false;


          } else if (successCode.code == '300') {
            this.message.info(
              'You have not permmission for Quater Application',
              ''
            );
            this.isSpinning = false;
          } else if (successCode.code == '302') {
            this.message.info('Please Enter valid Spouse Employee code', '');
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  formatCaste(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  changeinallocatedto(event: any) { }

  changeinallocatedBy(event: any) { }
  changeResidencetype(event: any) { }

  Rulesandapply = false;
  agrreconfirmation() {
    this.Rulesandapply = true;
  }
  Rulesandapplyterms: boolean = false;
  termsmodal() {
    this.Rulesandapplyterms = true;
  }
  handleOkterms() {
    this.Rulesandapplyterms = false;
  }
  isOksss: Boolean = false;
  conditionbasedErrorMessage: any;

  isOksss1: Boolean = false;
  isOksss2: Boolean = false;
  checkSave() {
    this.isOksss = false;
    // this.isOksss = false;
    this.isOksss1 = false;
    this.isOksss2 = false;
    this.isOk = true;
    let checklisdat = this.checklistData.find((value) => {
      return value.isSelected == true;
    });

    for (var i = 4; i < this.checklistData.length; i++) {
      this.isOksss = false;
      this.isOksss1 = false;
      this.isOksss2 = false;
      if (this.checklistData[i]['isSelected'] == true) {
        if (
          this.checklistData[i]['JOINING_DATE'] == '' ||
          this.checklistData[i]['JOINING_DATE'] == undefined ||
          this.checklistData[i]['JOINING_DATE'] == null
        ) {
          this.isOksss = true;
          console.log(this.checklistData[i], " this.checklistData[i]1")
          if (this.checklistData[i]['RESIDENCE_TYPE'] == 1 || this.checklistData[i]['RESIDENCE_TYPE'] == 2 || this.checklistData[i]['RESIDENCE_TYPE'] == 3) {
            this.conditionbasedErrorMessage = 'Please Select Date of Joining for Selected Residence Type';
          } else {
            this.conditionbasedErrorMessage = 'Please Select Date of Priority for Selected Residence Type';
          }
          break;
        } else if (
          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] == '' ||
          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] == undefined ||
          this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'] == null
        ) {
          this.isOksss = false;
          this.isOksss1 = true;
          break;
        } else if (
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] == '' ||
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] ==
          undefined ||
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] == null
        ) {
          this.isOksss = false;
          this.isOksss1 = false;
          this.isOksss2 = true;
          break;
        } else {
          this.isOksss = false;
          this.isOksss1 = false;
          this.isOksss2 = false;
        }
      }
    }

    if (!checklisdat) {
      this.isOk = false;
      this.message.error('Please Select Residence Type', '');
    } else if (this.isOksss) {
      this.isOk = false;
      this.message.error(this.conditionbasedErrorMessage, '');
    } else if (this.isOksss1) {
      this.isOk = false;
      this.message.error('Please Select Grade Pay Level for Selected Residence Type', '');
    } else if (this.isOksss2) {
      this.isOk = false;
      this.message.error('Please Select Date Of Present Pay Level for Selected Residence Type', '');
    } else if (
      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true &&
      (this.data2.ALLOCATED_TO == undefined ||
        this.data2.ALLOCATED_TO == null ||
        this.data2.ALLOCATED_TO == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Residence Allocated To', '');
    } else if (
      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true &&
      (this.data2.ALLOCATED_BY == undefined ||
        this.data2.ALLOCATED_BY == null ||
        this.data2.ALLOCATED_BY == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Allocated By Department ', '');
    } else if (
      this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true &&
      (this.data2.ALLOCATED_BY_DEPARTMENT == undefined ||
        this.data2.ALLOCATED_BY_DEPARTMENT == null ||
        this.data2.ALLOCATED_BY_DEPARTMENT == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Allocated By Department Name ', '');
    } else if (
      this.data2.IS_EMPLOYEED_FAMILY_MEMBER == true &&
      (this.data2.OFFICE_NAME_OF_FAMILY_MEM == undefined ||
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == null ||
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Name of Family Member', '');
    } else if (
      this.data2.IS_APPLICANT_STAY_PRESENTLY == true &&
      (this.data2.TYPE_RESIDENCE == undefined ||
        this.data2.TYPE_RESIDENCE == null ||
        this.data2.TYPE_RESIDENCE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Select Type of Residence', '');
    } else if (
      this.data2.TYPE_RESIDENCE == 'In Rented Primeses' &&
      (this.data2.RENTED_PREMISES_NAME == undefined ||
        this.data2.RENTED_PREMISES_NAME == null ||
        this.data2.RENTED_PREMISES_NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Rented Premises Name ', '');
    } else if (
      this.data2.TYPE_RESIDENCE ==
      'In quarter from general pool/Any Other pool.' &&
      (this.data2.POOL_NAME == undefined ||
        this.data2.POOL_NAME == null ||
        this.data2.POOL_NAME == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Pool Name ', '');
    } else if (
      this.data2.CANCELLED_ALLOTMENT == true &&
      (this.data2.AFFIRMATIVE_INDICATE == undefined ||
        this.data2.AFFIRMATIVE_INDICATE == null ||
        this.data2.AFFIRMATIVE_INDICATE == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Allotment Details', '');
    } else if (
      this.data2.APPLICANT_FAMILY == true &&
      (this.data2.STATION_DUTY_FAR_FAMILY == undefined ||
        this.data2.STATION_DUTY_FAR_FAMILY == null ||
        this.data2.STATION_DUTY_FAR_FAMILY == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Station in city Details', '');
    }

    this.checklistData['JOINING_DATE'] = this.datepipe.transform(
      this.checklistData['JOINING_DATE'],
      'yyyy-MM-dd'
    );
    this.data.DATE_CONDITION = 'AID';

    for (var i = 0; this.checklistData.length > i; i++) {
      this.checklistData[i]['JOINING_DATE'] = this.datepipe.transform(
        this.checklistData[i]['JOINING_DATE'],
        'yyyy-MM-dd'
      );
      this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'] =
        this.datepipe.transform(
          this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'],
          'yyyy-MM-dd'
        );
    }
    if (this.isOk) {
      this.data2.RESIDENCE_DATA = [];
      for (var i = 0; this.checklistData.length > i; i++) {
        if (this.checklistData[i]['isSelected'] == true) {
          this.data2.RESIDENCE_DATA.push({
            RESIDENCE_TYPE: this.checklistData[i]['RESIDENCE_TYPE'],
            JOINING_DATE: this.checklistData[i]['JOINING_DATE'],
            PRESENT_PAY_LEVEL_DATE_ABOVE_4S:
              this.checklistData[i]['PRESENT_PAY_LEVEL_DATE_ABOVE_4S'],
            GRAD_PAY_LEVEL_ID_ABOVE_4S:
              this.checklistData[i]['GRAD_PAY_LEVEL_ID_ABOVE_4S'],
            FLAT_REQUEST_ID: this.generateddatalist[0]['ID'],
          });
        }
      }
      this.isSpinning = true;
      if (this.data2.ID) {
        this.api
          .UpdateAllotmentCheckListmaster(this.data2)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Updated Successfully...', '');
              this.isSpinning = false;
              this.data.STEP_NO = 1;
              this.api
                .UpdateAllotmentmaster(this.data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.api
                      .getAllotmenmaster(
                        0,
                        0,
                        'ID',
                        'desc',
                        ' AND ID = ' + this.data2.ALLOTEMENT_ID
                      )
                      .subscribe(
                        (data) => {
                          let allotmentmast = data['data'];
                          this.allomas = allotmentmast[0];
                          this.applicationinfo =
                            data['data'][0]['APP_INFO_DATETIME'];
                          this.api
                            .getAllotmentchecklist(
                              0,
                              0,
                              'ID',
                              'desc',
                              ' AND ALLOTEMENT_ID = ' + this.data2.ALLOTEMENT_ID
                            )
                            .subscribe(
                              (data) => {
                                if (data['code'] == 200) {
                                  let allotchekda = data['data'];
                                  this.allodata = allotchekda[0];
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
                                          this.EMP_DATA123 = Object.assign(
                                            {},
                                            data['data'][0]
                                          );
                                          this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                                          this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                                          this.basicpay = data['data'][0]['BASIC_PAY'];
                                          this.Employee_name =
                                            data['data'][0]['NAME'];
                                          this.employee_code =
                                            data['data'][0]['EMPLOYEE_CODE'];
                                          this.emp_Designation =
                                            data['data'][0]['ITHR_DESIGNATION_NAME'];
                                          this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                                          this.emp_Designation_ID =
                                            data['data'][0]['DESIGNATION_ID'];
                                          this.emp_dob = data['data'][0]['DOB'];
                                          this.firstname = data['data'][0]['FIRST_NAME'];
                                          this.middlename = data['data'][0]['MIDDLE_NAME'];
                                          this.lastname = data['data'][0]['LAST_NAME'];
                                          this.office_name =
                                            data['data'][0]['OFFICE_NAME'];
                                          this.service_type =
                                            data['data'][0]['SERVICE_TYPE'];
                                          this.Grade_pay =
                                            data['data'][0]['GRASS_GRADE_PAY'];
                                          this.gradepay_level =
                                            data['data'][0]['GRADE_PAY_LEVEL'];
                                          this.emp_address =
                                            data['data'][0]['ADDRESS'];
                                          this.emp_cast =
                                            data['data'][0]['CAST'];
                                          this.headquarter_name =
                                            data['data'][0]['LOCATION'];
                                          this.joining_date =
                                            data['data'][0]['JOINING_DATE'];
                                          this.flatpref.DATE_OF_JOINING =
                                            data['data'][0]['JOINING_DATE'];
                                          this.data.DEMO_GRADE_PAY_ID =
                                            data['data'][0][
                                            'GRAAS_GRADE_PAY_ID'
                                            ];
                                          this.data.JOINING_LETTER =
                                            data['data'][0]['JOINING_LETTER'];


                                          this.isSpinning = false;
                                        } else {
                                          this.message.error(
                                            "Can't Load Employee Data",
                                            ''
                                          );
                                          this.isSpinning = false;
                                        }
                                      },
                                      (err) => {
                                        this.isSpinning = false;
                                      }
                                    );
                                } else {
                                }
                              },
                              (err) => { }
                            );
                        },
                        (err) => { }
                      );

                    sessionStorage.setItem('flat_check_id', "'" + this.data2.ALLOTEMENT_ID + "'");

                    this.api
                      .residenceTypeRequest(
                        0,
                        0,
                        'RESIDENCE_TYPE',
                        'asc',
                        ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                      )
                      .subscribe((data) => {
                        if (data['code'] == 200) {
                          this.flatarrlist = data['data'];
                        }
                      });

                    this.api
                      .getfamilymaster(
                        0,
                        0,
                        'ID',
                        'desc',
                        ' AND EMP_ID =' +
                        this.data.EMPLOYEE_ID +
                        ' AND RELATION = "Father"'
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            let fatherdetail = data['data'];
                            if (fatherdetail.length > 0) {
                              this.fatherdetail1 = fatherdetail[0];
                              this.Fathername = fatherdetail[0]['NAME'];
                              let firstname =
                                this.fatherdetail1.NAME.split(' ');
                              this.Father1name = firstname[0];
                            }
                          }
                        },
                        (err) => { }
                      );

                    this.stage = 2;
                    this.isSpinning = false;
                  } else {
                    this.message.error(' Failed To Update Information...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createAllotmentCheckListmaster(this.data2)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              this.isSpinning = false;

              this.data.STEP_NO = 1;
              this.api
                .UpdateAllotmentmaster(this.data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.api
                      .getAllotmenmaster(
                        0,
                        0,
                        'ID',
                        'desc',
                        ' AND ID = ' + this.data2.ALLOTEMENT_ID
                      )
                      .subscribe(
                        (data) => {
                          let allotmentmast = data['data'];
                          this.allomas = allotmentmast[0];
                          this.applicationinfo =
                            data['data'][0]['APP_INFO_DATETIME'];
                          this.api
                            .getAllotmentchecklist(
                              0,
                              0,
                              'ID',
                              'desc',
                              ' AND ALLOTEMENT_ID = ' + this.data2.ALLOTEMENT_ID
                            )
                            .subscribe(
                              (data) => {
                                if (data['code'] == 200) {
                                  let allotchekda = data['data'];
                                  this.allodata = allotchekda[0];
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
                                          this.EMP_DATA123 = Object.assign(
                                            {},
                                            data['data'][0]
                                          );
                                          this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
                                          this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
                                          this.basicpay = data['data'][0]['BASIC_PAY'];
                                          this.Employee_name =
                                            data['data'][0]['NAME'];
                                          this.employee_code =
                                            data['data'][0]['EMPLOYEE_CODE'];
                                          this.firstname = data['data'][0]['FIRST_NAME'];
                                          this.middlename = data['data'][0]['MIDDLE_NAME'];
                                          this.lastname = data['data'][0]['LAST_NAME'];
                                          this.emp_Designation =
                                            data['data'][0]['ITHR_DESIGNATION_NAME'];
                                          this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
                                          this.emp_Designation_ID =
                                            data['data'][0]['DESIGNATION_ID'];
                                          this.emp_dob = data['data'][0]['DOB'];
                                          this.office_name =
                                            data['data'][0]['OFFICE_NAME'];
                                          this.service_type =
                                            data['data'][0]['SERVICE_TYPE'];
                                          this.Grade_pay =
                                            data['data'][0]['GRASS_GRADE_PAY'];
                                          this.gradepay_level =
                                            data['data'][0]['GRADE_PAY_LEVEL'];
                                          this.emp_address =
                                            data['data'][0]['ADDRESS'];
                                          this.emp_cast =
                                            data['data'][0]['CAST'];
                                          this.headquarter_name =
                                            data['data'][0]['LOCATION'];
                                          this.joining_date =
                                            data['data'][0]['JOINING_DATE'];
                                          this.flatpref.DATE_OF_JOINING =
                                            data['data'][0]['JOINING_DATE'];
                                          this.data.DEMO_GRADE_PAY_ID =
                                            data['data'][0][
                                            'GRAAS_GRADE_PAY_ID'
                                            ];
                                          this.data.JOINING_LETTER =
                                            data['data'][0]['JOINING_LETTER'];

                                          this.isSpinning = false;
                                        } else {
                                          this.message.error(
                                            "Can't Load Employee Data",
                                            ''
                                          );
                                          this.isSpinning = false;
                                        }
                                      },
                                      (err) => {
                                        this.isSpinning = false;
                                      }
                                    );
                                } else {
                                }
                              },
                              (err) => { }
                            );
                        },
                        (err) => { }
                      );
                    sessionStorage.setItem('flat_check_id', "'" + this.data2.ALLOTEMENT_ID + "'");

                    this.api
                      .residenceTypeRequest(
                        0,
                        0,
                        'RESIDENCE_TYPE',
                        'asc',
                        ' AND FLAT_REQUEST_ID = ' + this.data2.ALLOTEMENT_ID
                      )
                      .subscribe((data) => {
                        if (data['code'] == 200) {
                          this.flatarrlist = data['data'];
                          this.data3 = Object.assign({}, this.data);
                          this.data4 = Object.assign({}, this.data2);
                        }
                      });

                    this.api
                      .getfamilymaster(
                        0,
                        0,
                        'ID',
                        'desc',
                        ' AND EMP_ID =' +
                        this.data.EMPLOYEE_ID +
                        ' AND RELATION = "Father"'
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            let fatherdetail = data['data'];
                            if (fatherdetail.length > 0) {
                              this.fatherdetail1 = fatherdetail[0];
                              this.Fathername = fatherdetail[0]['NAME'];
                              let firstname =
                                this.fatherdetail1.NAME.split(' ');
                              this.Father1name = firstname[0];
                            }
                          }
                        },
                        (err) => { }
                      );
                    this.stage = 2;
                    this.isSpinning = false;
                  } else {
                    this.message.error(' Failed To Update Information...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  sendforverification() {
    this.data.STATUS = 'P';

    this.isOk = true;
    if (
      this.data2.ALLOCATED_BY_DEPARTMENT == '' &&
      this.data2.STATION_DUTY_FAR_FAMILY == '' &&
      this.data2.SURETY_SUBSIST == '' &&
      this.data2.CIVIL_LIST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED == true) {
      if (
        this.data2.ALLOCATED_TO == undefined ||
        this.data2.ALLOCATED_TO == null ||
        this.data2.ALLOCATED_TO == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Select Residence Allocated To', '');
      } else if (
        this.data2.ALLOCATED_BY == undefined ||
        this.data2.ALLOCATED_BY == null ||
        this.data2.ALLOCATED_BY == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Select Allocated By Department ', '');
      } else if (
        this.data2.ALLOCATED_BY_DEPARTMENT == undefined ||
        this.data2.ALLOCATED_BY_DEPARTMENT == null ||
        this.data2.ALLOCATED_BY_DEPARTMENT == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Allocated By Department Name ', '');
      }
    } else if (this.data2.IS_EMPLOYEED_FAMILY_MEMBER == true) {
      if (
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == undefined ||
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == null ||
        this.data2.OFFICE_NAME_OF_FAMILY_MEM == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Office Name of Family Member', '');
      }
    } else if (this.data2.IS_APPLICANT_STAY_PRESENTLY == true) {
      if (
        this.data2.TYPE_RESIDENCE == undefined ||
        this.data2.TYPE_RESIDENCE == null ||
        this.data2.TYPE_RESIDENCE == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Select Type of Residence', '');
      } else if (this.data2.TYPE_RESIDENCE == 'In Rented Primeses') {
        if (
          this.data2.RENTED_PREMISES_NAME == undefined ||
          this.data2.RENTED_PREMISES_NAME == null ||
          this.data2.RENTED_PREMISES_NAME == ''
        ) {
          this.isOk = false;
          this.message.error(' Please Enter Rented Premises Name ', '');
        }
      } else if (
        this.data2.TYPE_RESIDENCE ==
        'In quarter from general pool/Any Other pool.'
      ) {
        if (
          this.data2.POOL_NAME == undefined ||
          this.data2.POOL_NAME == null ||
          this.data2.POOL_NAME == ''
        ) {
          this.isOk = false;
          this.message.error(' Please Enter Pool Name ', '');
        }
      }
    } else if (this.data2.CANCELLED_ALLOTMENT == true) {
      if (
        this.data2.AFFIRMATIVE_INDICATE == undefined ||
        this.data2.AFFIRMATIVE_INDICATE == null ||
        this.data2.AFFIRMATIVE_INDICATE == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Allotment Details', '');
      }
    } else if (this.data2.APPLICANT_FAMILY == true) {
      if (
        this.data2.STATION_DUTY_FAR_FAMILY == undefined ||
        this.data2.STATION_DUTY_FAR_FAMILY == null ||
        this.data2.STATION_DUTY_FAR_FAMILY == ''
      ) {
        this.isOk = false;
        this.message.error(' Please Enter Details of House Near Station ', '');
      }
    }
    //  else if (
    //   this.data2.PERMENANT_POST_HELD == undefined ||
    //   this.data2.PERMENANT_POST_HELD == null ||
    //   this.data2.PERMENANT_POST_HELD == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Permenant Post Held ', '');
    // } else if (
    //   this.data2.OFFICE_ATTACHED == undefined ||
    //   this.data2.OFFICE_ATTACHED == null ||
    //   this.data2.OFFICE_ATTACHED == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Office With Attached ', '');
    // }
    else if (!this.disableupload) {
      this.isOk = false;
      this.message.error(' Please Upload Application form PDF ', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data2.ID) {
        this.api
          .UpdateAllotmentCheckListmaster(this.data2)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Updated Successfully...', '');
              this.isSpinning = false;

              this.api
                .UpdateAllotmentmaster(this.data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    // this.message.success(
                    //   ' Information Updated Successfully...',
                    //   ''
                    // );
                    this.isSpinning = false;
                  } else {
                    this.message.error(' Failed To Update Information...', '');
                    this.isSpinning = false;
                  }
                });

              // this.close();
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createAllotmentCheckListmaster(this.data2)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              this.isSpinning = false;

              this.api
                .UpdateAllotmentmaster(this.data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    // this.message.success(
                    //   ' Information Updated Successfully...',
                    //   ''
                    // );
                    this.isSpinning = false;
                  } else {
                    this.message.error(' Failed To Update Information...', '');
                    this.isSpinning = false;
                  }
                });

              // this.close();
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  transferFileURL: any;
  urllink: any;

  onFileSelectedTransfer(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.transferFileURL = <File>event.target.files[0];

      if (this.transferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink = url;
        if (
          this.data.JOINING_LETTER != undefined &&
          this.data.JOINING_LETTER.trim() != ''
        ) {
          var arr = this.data.JOINING_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('joiningLetter', this.transferFileURL, this.urllink)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.JOINING_LETTER = this.urllink;
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.data.JOINING_LETTER = null;
    }
  }

  progressBar5: boolean = false;
  percent5 = 0;
  timer5: any;

  transferFileURLallotment: any;
  joiningAllotmentnotnull: boolean = false;
  urllink2: any;
  onFileSelectedTransfer1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.transferFileURLallotment = <File>event.target.files[0];

      if (this.transferFileURLallotment != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURLallotment.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink2 = url;
        if (
          this.data.JOINING_ALLOTMENT_LETTER != undefined &&
          this.data.JOINING_ALLOTMENT_LETTER.trim() != ''
        ) {
          var arr = this.data.JOINING_ALLOTMENT_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar5 = true;
      this.timer5 = this.api
        .onUpload2(
          'joiningAllotmentLetter',
          this.transferFileURLallotment,
          this.urllink2
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent5 = percentDone;
            if (this.percent5 == 100) {
              this.isSpinning = false;
              this.message.success('File Uploaded Successfully', '');
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar5 = false;
            this.percent5 = 0;
            this.data.JOINING_ALLOTMENT_LETTER = null;
            this.transferFileURLallotment = null;
            this.joiningAllotmentnotnull = true;
            this.urllink2 = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'File Uploaded Successfully...',
                ''
              );
              this.isSpinning = false;
              this.data.JOINING_ALLOTMENT_LETTER = this.urllink2;
              this.progressBar5 = false;
            } else {
              this.isSpinning = false;
            }
          }

          if (this.data.JOINING_ALLOTMENT_LETTER != null) {
            this.joiningAllotmentnotnull = false;
          } else {
            this.joiningAllotmentnotnull = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURLallotment = null;
      this.data.JOINING_ALLOTMENT_LETTER = null;
    }
  }

  progressBar1: boolean = false;
  percent1 = 0;
  timer1: any;

  gradepaydrawnletter: any;
  gradepaynotnull: boolean = true;
  urllink3: any;

  onFileSelectedTransfer2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.gradepaydrawnletter = <File>event.target.files[0];

      if (this.gradepaydrawnletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.gradepaydrawnletter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink3 = url;
        if (
          this.data.GRADE_PAY_DRAWN_LETTER != undefined &&
          this.data.GRADE_PAY_DRAWN_LETTER.trim() != ''
        ) {
          var arr = this.data.GRADE_PAY_DRAWN_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.GRADE_PAY_DRAWN_LETTER = this.urllink3;
      this.progressBar1 = true;
      this.timer1 = this.api
        .onUpload2(
          'gradePayDrawnLetter',
          this.gradepaydrawnletter,
          this.urllink3
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }


          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar1 = false;
            this.percent1 = 0;
            this.data.GRADE_PAY_DRAWN_LETTER = null;
            this.gradepaydrawnletter = null;
            this.gradepaynotnull = true;
            this.urllink3 = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'Grade Pay Drawn Letter Uploaded Successfully...',
                ''
              );
              this.isSpinning = false;
              this.data.GRADE_PAY_DRAWN_LETTER = this.urllink3;
              this.progressBar1 = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (res.body['code'] == 200) {
          //   this.message.success(
          //     'Grade Pay Drawn Letter Uploaded Successfully...',
          //     ''
          //   );
          //   this.isSpinning = false;
          // }

          // this.data.GRADE_PAY_DRAWN_LETTER = this.urllink3;
          if (this.data.GRADE_PAY_DRAWN_LETTER != null) {
            this.gradepaynotnull = false;
          } else {
            this.gradepaynotnull = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.gradepaydrawnletter = null;
      this.data.GRADE_PAY_DRAWN_LETTER = null;
    }
  }

  progressBar2: boolean = false;
  percent2 = 0;
  timer2: any;

  joindateletter: any;
  urljoinletter: any;
  onFileSelectedJoiningletter(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.joindateletter = <File>event.target.files[0];

      if (this.joindateletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.joindateletter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urljoinletter = url;
        if (
          this.data.JOINING_LETTER != undefined &&
          this.data.JOINING_LETTER != null &&
          this.data.JOINING_LETTER.trim() != ''
        ) {
          var arr = this.data.JOINING_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar2 = true;
      this.timer2 = this.api
        .onUpload2('joiningLetter', this.joindateletter, this.urljoinletter)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent2 = percentDone;
            if (this.percent2 == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }

          if (res.body['code'] == 200) {
            this.message.success('Joining Letter Uploaded Successfully...', '');
            this.data.JOINING_LETTER = this.urljoinletter;
            this.progressBar2 = false;
            let sendata = {
              ...this.EMP_DATA123,
              JOINING_LETTER: this.data.JOINING_LETTER,
            };
            this.api.updateEmployeeMaster(sendata).subscribe((successCode) => {
              if (successCode.code == '200') {
                // this.message.success('Information Changed Successfully...', '');
              } else {
                // this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });

            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.percent2 = 0;
            this.progressBar2 = false;
            this.data.JOINING_LETTER = null;

            this.joindateletter = null;
            this.joininglettershow = true;
            this.urljoinletter = null;
          }
          this.data.JOINING_LETTER = this.urljoinletter;
          if (this.data.JOINING_LETTER != null) {
            this.joininglettershow = false;
          } else {
            this.joininglettershow = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.joindateletter = null;
      this.data.JOINING_LETTER = null;
    }
  }
  progressBar4: boolean = false;
  percent4 = 0;
  timer4: any;

  payslippdf: any;
  urlpayslip: any;
  onFileSelectedPayslip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.payslippdf = <File>event.target.files[0];

      if (this.payslippdf != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.payslippdf.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlpayslip = url;
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
      this.progressBar3 = true;
      this.timer3 = this.api
        .onUpload2('paySlips', this.payslippdf, this.urlpayslip)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent3 = percentDone;
            if (this.percent3 == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }

          if (res.body['code'] == 200) {
            this.message.success('Pay Slip Uploaded Successfully...', '');
            this.isSpinning = false;
            this.progressBar3 = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar3 = false;
            this.percent3 = 0;
            this.data.PAY_SLIP = null;

            this.payslippdf = null;
            this.Payslipshow = true;
            this.urlpayslip = null;
          }
          this.data.PAY_SLIP = this.urlpayslip;
          if (this.data.PAY_SLIP != null) {
            this.Payslipshow = false;
          } else {
            this.Payslipshow = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.payslippdf = null;
      this.data.PAY_SLIP = null;
    }
  }

  progressBar3: boolean = false;
  percent3 = 0;
  timer3: any;

  IcardPDF: any;
  urlIcardPdf: any;
  onFileSelectedIcard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.IcardPDF = <File>event.target.files[0];

      if (this.IcardPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.IcardPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlIcardPdf = url;
        if (this.data.I_CARD != undefined && this.data.I_CARD.trim() != '') {
          var arr = this.data.I_CARD.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar4 = true;
      this.timer4 = this.api
        .onUpload2('iCards', this.IcardPDF, this.urlIcardPdf)
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
          }
          if (res.body['code'] == 200) {
            this.message.success('I-Card Uploaded Successfully...', '');
            this.isSpinning = false;
            this.progressBar4 = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar4 = false;
            this.percent4 = 0;
            this.data.I_CARD = null;

            this.IcardPDF = null;
            this.Icardshow = true;
            this.urlIcardPdf = null;
          }
          this.data.I_CARD = this.urlIcardPdf;
          if (this.data.I_CARD != null) {
            this.Icardshow = false;
          } else {
            this.Icardshow = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.IcardPDF = null;
      this.data.I_CARD = null;
    }
  }

  progressBar: boolean = false;
  percent = 0;
  timer: any;
  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;

  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.appnPDF = <File>event.target.files[0];
      // this.isSpinning = true
      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.data.APPLICATION_FORM != undefined &&
          this.data.APPLICATION_FORM.trim() != ''
        ) {
          var arr = this.data.APPLICATION_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload2('applicationForm', this.appnPDF, this.urlappnPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          }
          if (res['body']['code'] == 200) {
            this.message.success(
              'Application Form Uploaded Successfully...',
              ''
            );
            this.data.APPLICATION_FORM = this.urlappnPdf;
            this.progressBar = false;
            this.api.UpdateAllotmentmaster(this.data).subscribe(
              (successCode) => {
                if (successCode.code == '200') {
                } else {
                }
              },
              (error) => { }
            );

            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar = false;
            this.percent = 0;
            this.data.APPLICATION_FORM = null;
            this.appnPDF = null;
            this.applnform = true;
            this.urlappnPdf = null;
          }
          this.data.APPLICATION_FORM = this.urlappnPdf;
          if (this.data.APPLICATION_FORM != null) {
            this.applnform = false;
          } else {
            this.applnform = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.appnPDF = null;
      this.data.APPLICATION_FORM = null;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  viewPdfSafe: any;
  viewAssumptionPDF(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 1;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  JoiningLatershow(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 2;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  viewJoiningLetter(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 3;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  viewpayslip(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 4;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  viewIcard(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 5;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  applnformshow(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 6;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  Marriageshow(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 7;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'gradePayDrawnLetter/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'joiningAllotmentLetter/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'joiningLetter/' + link;
    }
    if (this.view == 4) {
      var a: any = this.api.retriveimgUrl + 'paySlips/' + link;
    }
    if (this.view == 5) {
      var a: any = this.api.retriveimgUrl + 'iCards/' + link;
    }
    if (this.view == 6) {
      var a: any = this.api.retriveimgUrl + 'applicationForm/' + link;
    }
    if (this.view == 7) {
      var a: any = this.api.retriveimgUrl + 'marriageCertificate/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  cancelappliactionform() {
    this.Rulesandapply = false;
  }
  isagreedisable1 = true;
  agrreconfirmation1() {
    this.isagreedisable1 = !this.isagreedisable1;
  }
  handleOkform(): void {
    if (
      this.data.APPLICATION_FORM == null ||
      this.data.APPLICATION_FORM == undefined ||
      this.data.APPLICATION_FORM == ''
    ) {
      this.message.error('Please Upload Application Form', '');
    } else if (this.isagreedisable1) {
      this.message.info(
        'Please review and accept the following terms and conditions, To proceed with your application',
        ''
      );
    } else {
      this.Rulesandapply = true;
    }
  }
  Submitapplication() {

    // this.data.STEP_NO = 2;
    // this.data.DATE_CONDITION = 'APD';
    // if (
    //   this.data.APPLICATION_FORM == null ||
    //   this.data.APPLICATION_FORM == undefined ||
    //   this.data.APPLICATION_FORM == ''
    // ) {
    //   this.message.error('Please Upload Application Form', '');
    // } else {
    this.data.STATUS = 'P';
    this.data.STEP_NO = 1;
    this.data.DATE_CONDITION = 'ASD';
    // this.data.APP_SUBMIT_DATETIME = this.datepipe.transform(
    //   new Date(),
    //   'yyyy-MM-dd hh:mm:ss'
    // );
    this.api.UpdateAllotmentmaster(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.Rulesandapply = false;
        this.message.success('Application Send For Verification Successfully', '');
        const element: any = document.getElementById('printpage');
        var elementAsString: any = element.outerHTML;
        this.api.applicationFormPDF(elementAsString, this.data.ID).subscribe(
          (data) => {
            if (data.code == 200) {
              // this.message.success(' Successfully', '');
            } else {
            }
          },

        );

        this.api
          .getAllotmenmaster(
            0,
            0,
            'ID',
            'desc',
            ' AND EMPLOYEE_ID = ' + Number(sessionStorage.getItem('userId'))
          )
          .subscribe(
            (data) => {
              this.getlatestsubmit = data['data'];
              this.approveddate = data['data'][0]['APP_SUBMIT_DATETIME'];
            },
            (err) => { }
          );
        // localStorage.removeItem('GradeDataSave')
        this.drawerClose();
      } else {
        this.message.error(' Failed To Send For Verification...', '');
      }
    });
  }


  ///////////////////////////////////////////
  dataList = [];
  drawerVisible12: boolean = false;
  drawerTitle12!: string;
  employeeedit: any;
  drawerData12: EmployeeMaster = new EmployeeMaster();

  drawerClose12(): void {
    this.employeedetailsedit();
    this.next();
    this.drawerVisible12 = false;
  }
  employeedetailsedit() {
    if (Number(sessionStorage.getItem('userId'))) {
      this.isSpinning = true;
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.EMP_DATA123 = Object.assign({}, data['data'][0]);
              this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
              this.data.DEMO_GRADE_PAY_ID =
                data['data'][0]['GRAAS_GRADE_PAY_ID'];
              this.data.BASIC_PAY = data['data'][0]['BASIC_PAY'];
              this.basicpay = data['data'][0]['BASIC_PAY'];
              this.Employee_name = data['data'][0]['NAME'];
              this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
              this.emp_Designation = data['data'][0]['ITHR_DESIGNATION_NAME'];
              this.profilephoto = data['data'][0]['PROFILE_PHOTO'];
              this.emp_Designation_ID = data['data'][0]['DESIGNATION_ID'];
              this.emp_dob = data['data'][0]['DOB'];
              this.office_name = data['data'][0]['OFFICE_NAME'];
              this.firstname = data['data'][0]['FIRST_NAME'];
              this.middlename = data['data'][0]['MIDDLE_NAME'];
              this.lastname = data['data'][0]['LAST_NAME'];
              this.service_type = data['data'][0]['SERVICE_TYPE'];
              this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
              this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL'];
              this.emp_address = data['data'][0]['ADDRESS'];
              this.headquarter_name = data['data'][0]['LOCATION'];
              this.emp_cast = data['data'][0]['CAST'];
              this.joining_date = data['data'][0]['JOINING_DATE'];
              this.flatpref.DATE_OF_JOINING = data['data'][0]['JOINING_DATE'];
              this.data.PRESENT_PAY_LEVEL_DATE =
                data['data'][0]['PRESENT_PAY_LEVEL_DATE'];
              this.data.IS_PRESENT_PAY_LEVEL_CHANGED =
                data['data'][0]['IS_PRESENT_PAY_LEVEL_CHANGED'];
              this.data.JOINING_LETTER = data['data'][0]['JOINING_LETTER'];
              this.data.SUPERANNUATION_DATE = data['data'][0]['RETIREMENT_DATE'];
              if (this.employerecordfilled) {
                this.ShowProfile();
                this.message.warning(
                  'Please Update All The Details Required',
                  ''
                );
              }

              if (this.data.GRADE_PAY_DRAWN_LETTER != null) {
                this.gradepaynotnull = false;
              } else {
                this.gradepaynotnull = true;
              }
              if (this.data.JOINING_ALLOTMENT_LETTER != null) {
                this.joiningAllotmentnotnull = false;
              } else {
                this.joiningAllotmentnotnull = true;
              }
              if (this.data.JOINING_LETTER != null) {
                this.joininglettershow = false;
              } else {
                this.joininglettershow = true;
              }
              if (this.data.PAY_SLIP != null) {
                this.Payslipshow = false;
              } else {
                this.Payslipshow = true;
              }
              if (this.data.I_CARD != null) {
                this.Icardshow = false;
              } else {
                this.Icardshow = true;
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

  get closeCallback12() {
    return this.drawerClose12.bind(this);
  }

  showload = false;
  ShowProfile() {
    this.drawerTitle12 = 'Update Profile';
    this.showload = true;
    //  this.drawerData = Object.assign({}, data);
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + Number(sessionStorage.getItem('userId')))
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.drawerData12 = Object.assign({}, data['data'][0]);

            this.showload = false;
            this.employerecordfilled = false;
          }
          this.drawerVisible12 = true;
        },
        (err) => {
          this.showload = false;
        }
      );
  }

  getdetailsinfo() {
    this.api.getGradPay(0, 0, 'ID', 'asc', ' AND ' + this.filterkey).subscribe(
      (data) => {
        if (data['code'] == 200) {
          let listofresidence = [];
          listofresidence = data['data'];
          function removeDuplicates(arr: any) {
            const uniqueObjects: any = [];
            const uniqueResidenceTypeIds = new Set();
            for (const obj of arr) {
              if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
                uniqueObjects.push(obj);
                uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
              }
            }
            return uniqueObjects;
          }
          const result = removeDuplicates(listofresidence);
          this.ResidenceType = result;
        }
      },
      (err) => { }
    );
  }

  Showapplicationform() { }
  percent10: any = 0;
  timer10: any;
  progressBar10: boolean = false;
  showmarriagecertificate: boolean = true;
  marriageurllink2: any;
  marriageFileURLallotment: any;
  Marriagecertificate(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.marriageFileURLallotment = <File>event.target.files[0];

      if (this.marriageFileURLallotment != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.marriageFileURLallotment.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.marriageurllink2 = url;
      }
      this.progressBar10 = true;
      this.timer10 = this.api
        .onUpload2(
          'marriageCertificate',
          this.marriageFileURLallotment,
          this.marriageurllink2
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent10 = percentDone;
            if (this.percent10 == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar10 = false;
            this.percent10 = 0;
            this.data.MARRIAGE_CERTIFICATE = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.isSpinning = false;
              this.showmarriagecertificate = false;
              this.progressBar10 = false;
              this.data.MARRIAGE_CERTIFICATE = this.marriageurllink2;
            } else {
              this.isSpinning = false;
            }
          }

          // if (this.data.JOINING_ALLOTMENT_LETTER != null) {
          //   this.joiningAllotmentnotnull = false;
          // } else {
          //   this.joiningAllotmentnotnull = true;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.marriageFileURLallotment = null;
      this.data.MARRIAGE_CERTIFICATE = null;
      this.showmarriagecertificate = true;
    }
  }
}
