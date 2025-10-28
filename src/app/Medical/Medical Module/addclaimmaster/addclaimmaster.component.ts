import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { EmployeeMaster } from '../../Models/Employee';
import { ApplicantMaster } from '../../Models/applicantmaster';
import { CheckList } from '../../Models/checkList';
import { ClaimMaster } from '../../Models/claimmaster';
import { HODPermissionMaster } from '../../Models/hodpermission';
import { HospitalMappingMaster } from '../../Models/hospitalmappingmaster';
import { QuestionaryMaster } from '../../Models/questionarymaster';
import { ExpostFactoMaster } from '../../Models/ExpostFactoMaster';
import { DelayCondonationMaster } from '../../Models/DelayCondonationMaster';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-addclaimmaster',
  templateUrl: './addclaimmaster.component.html',
  styleUrls: ['./addclaimmaster.component.css'],
})
export class AddclaimmasterComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) {}
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  officialEmailPattern = /^[a-zA-Z0-9._%+-]+@incometax\.gov\.in$/;
  @Input() isSpinning = false;
  isOk = true;
  userId: number = 0;
  mobpattern = /^[6-9]\d{9}$/;
  isAdmin: boolean = false;
  roleId: any;
  DDO_ID: any = Number(sessionStorage.getItem('ddoId'));
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));

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
    this.current = 0;
    this.isSpinning = false;

    this.allHospitalList();
    this.ListOfDesignation();
    this.ddoOfTheOfficialList();
    this.userId = Number(sessionStorage.getItem('userId'));
    this.loadOnlySelectedEmployee();
  }
  @Input()
  drawerVisible: boolean = false;
  empDrawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any = ApplicantMaster;
  @Input() empID: any;
  @Input() claimID: any;
  @Input() currentStageID: any;

  data2: ClaimMaster = new ClaimMaster();
  data3: QuestionaryMaster = new QuestionaryMaster();
  hospitalData: HospitalMappingMaster = new HospitalMappingMaster();

  data4: CheckList = new CheckList();

  @Input() current = 0;
  employee: EmployeeMaster[] = [];
  HODPermissionList: HODPermissionMaster[] = [];
  delayCondolationList: DelayCondonationMaster[] = [];
  expostFactoList: ExpostFactoMaster[] = [];

  Cities: EmployeeMaster[] = [];
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
  hodList: any = [];
  @Input() designationList: any = [];

  ddoOfTheOfficialDataList: any = [];

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
            this.designationList = data['data'];
          } else {
            this.message.error("Can't Load Designation Data", '');
          }
        },
        (err) => {}
      );
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
          this.employee = [];
          this.tempCount = 0;
          this.filteredOptions = [];
        }
      },
      (err) => {}
    );
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
  allHODPermissionList() {
    if (this.data2.EMP_ID != null && this.data2.EMP_ID != undefined) {
      this.api
        .getHODPermissionMaster(
          0,
          0,
          '',
          '',
          ' AND EMP_ID = ' +
            this.data2.EMP_ID +
            ' AND INSPECTOR_ID = ' +
            Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.HODPermissionList = data['data'];
            } else {
              this.message.error("Can't Load Data", '');
            }
          },
          (err) => {}
        );
    } else {
    }
  }
  allDelayCondonationList() {
    if (this.data2.EMP_ID != null && this.data2.EMP_ID != undefined) {
      this.api
        .getDelayCondolationMaster(
          0,
          0,
          '',
          '',
          ' AND EMP_ID = ' +
            this.data2.EMP_ID +
            ' AND INSPECTOR_ID = ' +
            Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.delayCondolationList = data['data'];
            } else {
              this.message.error("Can't Load Data", '');
            }
          },
          (err) => {}
        );
    } else {
    }
  }
  allExpostFactoList() {
    if (this.data2.EMP_ID != null && this.data2.EMP_ID != undefined) {
      this.api
        .getExpostFactoMaster(
          0,
          0,
          '',
          '',
          ' AND EMP_ID = ' +
            this.data2.EMP_ID +
            ' AND INSPECTOR_ID = ' +
            Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.expostFactoList = data['data'];
            } else {
              this.message.error("Can't Load Data", '');
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
    this.hospitalData.TYPE = '';
    this.hospitalData.HOSPITAL_ID = '';
    this.hospitalData.NAME = '';
    this.hospitalData.ADDRESS = '';
    this.hospitalData.ACCREDATION = '';
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
  queResetDrawer(queMasterPage: NgForm) {
    this.data3 = new QuestionaryMaster();

    queMasterPage.form.reset();
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

  dateOmit(event: any) {
    return false;
  }

  empAllDataForUpdate: any;
  empSave(addNew: boolean): void {
    this.isSpinning = true;
    this.isOk = true;
    this.data.hospitalData = this.hospitalMapList;
    for (var i = 0; this.hospitalMapList.length > i; i++) {
      this.hospitalMapList[i]['ID'] = undefined;
      this.hospitalMapList[i]['CLAIM_ID'] = undefined;
    }
    this.data.hospitalData = this.hospitalMapList;

    if (
      this.data.EMP_ID == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&
      this.data.EMPLOYEE_CODE == undefined &&
      this.data.GRADE_PAY == 0 &&
      // this.data.EMAIL_ID == undefined &&
      // this.data.MOBILE_NO == undefined &&
      this.data.BENEFICIARY_TYPE == ''
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
      this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      this.data.DDO_OF_THE_OFFICIAL_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select DDO Of The Official', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Employee Code', '');
    } else if (
      this.data.GRADE_PAY == undefined ||
      this.data.GRADE_PAY == null ||
      this.data.GRADE_PAY == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Basic Pay ', '');
    } else if (
      this.data.EMAIL_ID != undefined &&
      this.data.EMAIL_ID != null &&
      this.data.EMAIL_ID != '' &&
      this.data.EMAIL_ID != ' ' &&
      !this.officialEmailPattern.test(this.data.EMAIL_ID)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Valid Official Email', '');
      // } else if (
      //   this.data.EMAIL_ID == undefined ||
      //   this.data.EMAIL_ID == null ||
      //   this.data.EMAIL_ID == ''
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Email ID', '');
      // } else if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO == ''
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Enter Mobile Number', '');
    } else if (
      this.data.BENEFICIARY_TYPE == undefined ||
      this.data.BENEFICIARY_TYPE == null ||
      this.data.BENEFICIARY_TYPE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Beneficiary Type', '');
    } else if (
      this.data.BENEFICIARY_TYPE == 'CG' &&
      (this.data.CGHS_CARD_NO == undefined ||
        this.data.CGHS_CARD_NO == null ||
        this.data.CGHS_CARD_NO == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
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
        this.empID == null ||
        this.empID == undefined ||
        this.empID == '' ||
        this.empID == 0
      ) {
        this.data.ROLE_ID = Number(sessionStorage.getItem('roleId'));
      } else {
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
        this.data.MOBILE_NO == undefined ||
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == '' ||
        this.data.MOBILE_NO.trim() == ''
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
      if (
        this.data.BENEFICIARY_TYPE == 'CG' &&
        (this.data.CGHS_CARD_VALIDITY == undefined ||
          this.data.CGHS_CARD_VALIDITY == null ||
          this.data.CGHS_CARD_VALIDITY == '')
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
          this.data['CLAIM_ID'] = this.claimID;

          this.api
            .updateClaimWithoutHospitalData(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                // this.message.success('Information Saved Successfully...', '');

                this.empID = successCode.EMPLOYEE;
                this.claimID = successCode.CLAIM;

                this.next();
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
          (this.data['CLIENT_ID'] = 1),
            (this.data['NAME'] = this.data.NAME),
            (this.data['EMPLOYEE_CODE'] = this.data.EMPLOYEE_CODE),
            (this.data['SALUTATION'] = this.data.SALUTATION),
            (this.data['GRADE_PAY'] = this.data.GRADE_PAY),
            (this.data['OFFICE_NAME'] = this.data.OFFICE_NAME),
            (this.data['DESIGNATION_ID'] = this.data.DESIGNATION_ID),
            (this.data['LOCATION'] = this.data.LOCATION),
            (this.data['DDO_OF_THE_OFFICIAL'] = this.data.DDO_OF_THE_OFFICIAL),
            (this.data['DDO_OF_THE_OFFICIAL_ID'] =
              this.data.DDO_OF_THE_OFFICIAL_ID),
            (this.data['BENEFICIARY_TYPE'] = this.data.BENEFICIARY_TYPE),
            (this.data['CGHS_CARD_NO'] = this.data.CGHS_CARD_NO),
            (this.data['CGHS_CARD_VALIDITY'] = this.data.CGHS_CARD_VALIDITY),
            (this.data['CLAIM_ID'] = null),
            (this.data['MOBILE_NO'] = this.data.MOBILE_NO),
            (this.data['EMAIL_ID'] = this.data.EMAIL_ID),
            (this.data['STATUS'] = true),
            (this.data['ADDRESS'] = this.data.ADDRESS),
            (this.data['APP_INFO_DATE_TIME'] = this.datepipe.transform(
              new Date(),
              'yyyy-MM-dd HH:mm:ss'
            )),
            // (this.data['INSPECTOR_ID'] = Number(
            //   sessionStorage.getItem('userId')
            // )),
            (this.data['IS_APPLYING_FOR_ADVANCE'] =
              this.data.IS_APPLYING_FOR_ADVANCE),
            (this.data['INSPECTOR_ID'] =
              this.data['INSPECTOR_ID'] == null ||
              this.data['INSPECTOR_ID'] === undefined ||
              this.data['INSPECTOR_ID'] === '' ||
              this.data['INSPECTOR_ID'] === 0
                ? Number(sessionStorage.getItem('userId'))
                : this.data['INSPECTOR_ID']),
            (this.data['SUB_INSPECTOR_ID'] =
              this.data['SUB_INSPECTOR_ID'] == null ||
              this.data['SUB_INSPECTOR_ID'] === undefined ||
              this.data['SUB_INSPECTOR_ID'] === ''
                ? Number(sessionStorage.getItem('parentUserID'))
                : this.data['SUB_INSPECTOR_ID']),
            (this.data['IS_ADMIN_CLAIM'] = 1);
          this.api.createClaimNew(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Save Successfully...', '');
              this.empID = successCode.EMPLOYEE;
              this.claimID = successCode.CLAIM;

              this.next();
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
  }

  claimSave(addNew: boolean): void {
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
      this.data2.INDOOR_TREATEMENT_AMOUNT = this.data2.INDOOR_TREATEMENT_AMOUNT;
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

    this.data2.EMP_ID = this.empID;
    this.data2.ID = this.claimID;
    this.data2.hospitalData = this.hospitalMapList;
    // this.data2.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));

    if (
      this.data2.INSPECTOR_ID == null ||
      this.data2.INSPECTOR_ID == undefined ||
      this.data2.INSPECTOR_ID == '' ||
      this.data2.INSPECTOR_ID == 0
    ) {
      this.data2.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
    } else {
      this.data2.INSPECTOR_ID = this.data2.INSPECTOR_ID;
    }
    if (
      this.data2.SUB_INSPECTOR_ID == null ||
      this.data2.SUB_INSPECTOR_ID == undefined ||
      this.data2.SUB_INSPECTOR_ID == ''
    ) {
      this.data2.SUB_INSPECTOR_ID = Number(
        sessionStorage.getItem('parentUserID')
      );
    } else {
      this.data2.SUB_INSPECTOR_ID = this.data2.SUB_INSPECTOR_ID;
    }

    for (var i = 0; this.hospitalMapList.length > i; i++) {
      this.hospitalMapList[i]['ID'] = undefined;
      this.hospitalMapList[i]['CLAIM_ID'] = undefined;
    }
    this.data2.hospitalData = this.hospitalMapList;
    this.isSpinning = true;
    this.isOk = true;

    if (
      this.data2.RELATION_WITH_PATIENT == undefined &&
      this.data2.PATIENT_NAME == undefined &&
      this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined &&
      this.data2.NATURE_OF_TREATMENT == undefined &&
      this.data2.TREATMENT_START_DATE == undefined &&
      this.data2.TREATMENT_END_DATE == undefined &&
      this.data2.BILL_FILIING_DATE == undefined &&
      this.data2.hospitalData.length == 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data2.RELATION_WITH_PATIENT == undefined ||
      this.data2.RELATION_WITH_PATIENT == null ||
      this.data2.RELATION_WITH_PATIENT == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Relationship with Applicant', '');
    } else if (
      this.data2.PATIENT_NAME == undefined ||
      this.data2.PATIENT_NAME == null ||
      this.data2.PATIENT_NAME == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Patient Name', '');
    } else if (
      this.data2.BENEFICIARY_TYPE == 'CG' &&
      (this.data2.PATIENT_CGHS_BENEFICIERY_NO == undefined ||
        this.data2.PATIENT_CGHS_BENEFICIERY_NO == null ||
        this.data2.PATIENT_CGHS_BENEFICIERY_NO == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Patient CGHS Beneficiary Number', '');
    } else if (
      this.data2.NATURE_OF_TREATMENT == undefined ||
      this.data2.NATURE_OF_TREATMENT == null ||
      this.data2.NATURE_OF_TREATMENT == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Nature Of Treatment/Test', '');
    } else if (
      this.data2.IS_APPLYING_FOR_ADVANCE &&
      (this.data2.CLAIMED_ADVANCE_AMOUNT === undefined ||
        this.data2.CLAIMED_ADVANCE_AMOUNT === null ||
        this.data2.CLAIMED_ADVANCE_AMOUNT === '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Claimed Advance Amount', '');
    } else if (
      this.data2.IS_APPLYING_FOR_ADVANCE == true &&
      (this.data2.TENTATIVE_ADMISSION_DATE == undefined ||
        this.data2.TENTATIVE_ADMISSION_DATE == null ||
        this.data2.TENTATIVE_ADMISSION_DATE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Tentative Admission Date', '');
    } else if (
      this.data2.IS_APPLYING_FOR_ADVANCE == true &&
      (this.data2.TREATEMENT_IS_RECIVED == undefined ||
        this.data2.TREATEMENT_IS_RECIVED == null ||
        this.data2.TREATEMENT_IS_RECIVED == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Whether treatement is received?', '');
      // } else if (
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   this.data2.IS_CERTIFICATE_FROM_OFFICER &&
      //   (this.data2.CGHS_AMA == '' ||
      //     this.data2.CGHS_AMA == null ||
      //     this.data2.CGHS_AMA == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload CGHS/AMA Reference/Referral', '');
      // } else if (
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   this.data2.IS_ANTICIPATED_COST_OF_TREATMENT &&
      //   (this.data2.ESTIMATE == '' ||
      //     this.data2.ESTIMATE == null ||
      //     this.data2.ESTIMATE == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Hospital Estimate', '');
      // } else if (
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   (this.data2.PAYSLIP == '' ||
      //     this.data2.PAYSLIP == null ||
      //     this.data2.PAYSLIP == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Pay Slip', '');
      // } else if (
      //   this.data2.BENEFICIARY_TYPE == 'CG' &&
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   (this.data2.CGHS_CARD == '' ||
      //     this.data2.CGHS_CARD == null ||
      //     this.data2.CGHS_CARD == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload CGHS Card', '');
      // } else if (
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   (this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL == '' ||
      //     this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL == null ||
      //     this.data2.PRECESCRIPTION_ISSUED_BY_HOSPITAL == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(
      //     ' Please Upload Prescription issued by hospital Non-Empanelled/Empanelled',
      //     ''
      //   );
      // } else if (
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   (this.data2.BANK_DETAILS_HOSPITAL == '' ||
      //     this.data2.BANK_DETAILS_HOSPITAL == null ||
      //     this.data2.BANK_DETAILS_HOSPITAL == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Bank Details of Hospital', '');
      // } else if (
      //   this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   this.data2.IS_ADVANCE_ANNEXURE_CREATED &&
      //   (this.data2.HOSPITAL_DISCHARGE_CARD == '' ||
      //     this.data2.HOSPITAL_DISCHARGE_CARD == null ||
      //     this.data2.HOSPITAL_DISCHARGE_CARD == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Hospital Discharge Card', '');
      // } else if (
      //   this.data2.PAYSLIP == '' ||
      //   this.data2.PAYSLIP == null ||
      //   this.data2.PAYSLIP == undefined
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Pay Slip', '');
      // } else if (
      //   this.data2.SELF_BANK_DETAILS == '' ||
      //   this.data2.SELF_BANK_DETAILS == null ||
      //   this.data2.SELF_BANK_DETAILS == undefined
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Self Bank Details', '');
      // } else if (
      //   !this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   (this.data2.HOSPITAL_ORIGINAL_BILL == '' ||
      //     this.data2.HOSPITAL_ORIGINAL_BILL == null ||
      //     this.data2.HOSPITAL_ORIGINAL_BILL == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Original Bill Issued By Hospital', '');
      // } else if (
      //   !this.data2.IS_APPLYING_FOR_ADVANCE &&
      //   (this.data2.HOSPITAL_DISCHARGE_CARD == '' ||
      //     this.data2.HOSPITAL_DISCHARGE_CARD == null ||
      //     this.data2.HOSPITAL_DISCHARGE_CARD == undefined)
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error(' Please Upload Hospital Discharge Card', '');
    } else if (
      this.data2.IS_APPLYING_FOR_ADVANCE == false &&
      this.data2.IS_ADVANCE_TAKEN == false &&
      (this.data2.BILL_FILIING_DATE == undefined ||
        this.data2.BILL_FILIING_DATE == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Bill Filling Date', '');
    } else if (
      this.data2.IS_APPLYING_FOR_ADVANCE == false &&
      this.data2.IS_ADVANCE_TAKEN == false &&
      (this.data2.TREATMENT_START_DATE == undefined ||
        this.data2.TREATMENT_START_DATE == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Treatment Start Date', '');
    } else if (
      this.data2.IS_APPLYING_FOR_ADVANCE == false &&
      this.data2.IS_ADVANCE_TAKEN == false &&
      (this.data2.TREATMENT_END_DATE == undefined ||
        this.data2.TREATMENT_END_DATE == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Treatment End Date', '');
    }
    // else
    // if (
    //   this.data2.IS_ADVANCE_TAKEN == true &&
    //   (this.data2.ADVANCE_TAKEN_DATE == undefined ||
    //     this.data2.ADVANCE_TAKEN_DATE == null)
    // ) {
    //   this.isOk = false;
    // this.isSpinning = false;
    //   this.message.error('Please Select Date Of Advance Taken.  ', '');
    // }
    else if (
      this.data2.IS_ADVANCE_AMOUNT_CLAIMED &&
      (this.data2.OPD_TREATEMENT_AMOUNT === undefined ||
        this.data2.OPD_TREATEMENT_AMOUNT === null ||
        this.data2.OPD_TREATEMENT_AMOUNT === '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter OPD Treatment Amount.  ', '');
    } else if (
      this.data2.IS_ADVANCE_AMOUNT_CLAIMED &&
      (this.data2.INDOOR_TREATEMENT_AMOUNT === undefined ||
        this.data2.INDOOR_TREATEMENT_AMOUNT === null ||
        this.data2.INDOOR_TREATEMENT_AMOUNT === '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Indoor Treatment Amount.  ', '');
    } else if (
      this.data2.IS_ADVANCE_AMOUNT_CLAIMED &&
      (this.data2.TEST_OR_INVESTIGATION_AMOUNT === undefined ||
        this.data2.TEST_OR_INVESTIGATION_AMOUNT === null ||
        this.data2.TEST_OR_INVESTIGATION_AMOUNT === '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Test/Investigation Amount.  ', '');
    } else if (this.data2.hospitalData.length == 0) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Add Hospital ', '');
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
      // this.data2.CURRENT_STAGE_ID = 3;
      this.data2.CLAIM_INFO_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data2['CLAIM_ID'] = this.claimID;
      this.isSpinning = true;
      if (this.data2.IS_ADVANCE_AMOUNT_CLAIMED == true) {
        this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT =
          Number(this.data2.OPD_TREATEMENT_AMOUNT) +
          Number(this.data2.INDOOR_TREATEMENT_AMOUNT) +
          Number(this.data2.TEST_OR_INVESTIGATION_AMOUNT);
        this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT = Math.round(
          this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT
        );
      } else {
        this.data2.TOTAL_ADVANCE_CLAIMED_AMOUNT = 0;
      }
      if (
        this.data2.TREATMENT_START_DATE != undefined &&
        this.data2.TREATMENT_START_DATE != null &&
        this.data2.TREATMENT_START_DATE != ''
      ) {
        this.data2.TREATMENT_START_DATE = this.datepipe.transform(
          this.data2.TREATMENT_START_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.data2.TREATMENT_START_DATE = null;
      }
      if (
        this.data2.BILL_FILIING_DATE != undefined &&
        this.data2.BILL_FILIING_DATE != null &&
        this.data2.BILL_FILIING_DATE != ''
      ) {
        this.data2.BILL_FILIING_DATE = this.datepipe.transform(
          this.data2.BILL_FILIING_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.data2.BILL_FILIING_DATE = null;
      }
      if (
        this.data2.TREATMENT_END_DATE != undefined &&
        this.data2.TREATMENT_END_DATE != null &&
        this.data2.TREATMENT_END_DATE != ''
      ) {
        this.data2.TREATMENT_END_DATE = this.datepipe.transform(
          this.data2.TREATMENT_END_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.data2.TREATMENT_END_DATE = null;
      }
      this.data2.ADVANCE_TAKEN_DATE = this.datepipe.transform(
        this.data2.ADVANCE_TAKEN_DATE,
        'yyyy-MM-dd'
      );

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

      if (this.data2.HOSPITAL_TYPE == 'E') {
        this.data2.HOSPITAL_NAME = '';
      } else {
        this.data2.HOSPITAL_NAME = this.data2.HOSPITAL_NAME;
      }

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
          // if (
          //   (this.currentStageID != undefined ||
          //     this.currentStageID != null ||
          //     this.currentStageID != '') &&
          //   this.currentStageID > 3
          // ) {
          //   this.data2.CURRENT_STAGE_ID = this.data2.CURRENT_STAGE_ID;
          // } else {
          //   this.data2.CURRENT_STAGE_ID = 3;
          // }
          this.api.updateclaimed(this.data2).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.billInTime();
              this.empanelledHospital();
              this.next();
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createclaimed(this.data2).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.billInTime();
              this.empanelledHospital();
              this.next();
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  queSave(addNew: boolean): void {
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;

    this.isSpinning = true;
    this.isOk = true;

    if (
      this.data2.IS_APPLYING_FOR_ADVANCE == false ||
      !this.data.IS_ADVANCE_ANNEXURE_CREATED
    ) {
      if (
        this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
        (this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
          this.data3.CGHS_AMA_REFERENCE_DATE == null ||
          this.data3.CGHS_AMA_REFERENCE_DATE.length == 0)
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Add CGHS/AMAs Reference Start Date', '');
      } else if (
        this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Add CGHS/AMAs Reference Start Date', '');
      } else if (
        this.data3.IS_PERMISSION_TAKEN_FROM_HOD == true &&
        (this.data3.HOD_PERMISSION_DATE == undefined ||
          this.data3.HOD_PERMISSION_DATE == null)
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Select HOD Permission Date', '');
      } else if (
        this.data3.EXPO_FACTO_PERMISSION == true &&
        (this.data3.EXPO_FACTO_DATE == undefined ||
          this.data3.EXPO_FACTO_DATE == null)
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Select Ex-Post Facto Referance Date ', '');
      }
      if (
        this.data3.BILL_FILLED_INTIME == false &&
        (this.data3.DELAY_CONDOLENCE_DATE == undefined ||
          this.data3.DELAY_CONDOLENCE_DATE == null)
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Select Delay Condolence Date', '');
      } else if (
        this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
        (this.data3.CGHS_AMA_REFERENCE_DATE != undefined ||
          this.data3.CGHS_AMA_REFERENCE_DATE != null ||
          this.data3.CGHS_AMA_REFERENCE_DATE.length != 0)
      ) {
        var date2: any = new Date(this.data2.BILL_FILIING_DATE);
        var expoDiffDays = Math.floor(
          (date2 - this.date1) / (1000 * 60 * 60 * 24)
        );
      }
    } else {
      if (
        this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
        (this.data3.CGHS_AMA_REFERENCE_DATE == undefined ||
          this.data3.CGHS_AMA_REFERENCE_DATE == null ||
          this.data3.CGHS_AMA_REFERENCE_DATE.length == 0)
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Add CGHS/AMAs Reference Start Date', '');
      } else if (
        this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
        this.data3.CGHS_AMA_REFERENCE_DATE.length == 0
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Add CGHS/AMAs Reference Start Date', '');
      }
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
        this.data3.HOD_ID != undefined &&
        this.data3.HOD_ID != null &&
        this.data3.HOD_ID.length != 0
      ) {
        this.data3.HOD_ID = this.data3.HOD_ID.toString();
      } else {
        this.data3.HOD_ID = null;
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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.CLAIM_SUBMITTED_DATE == undefined ||
        this.data3.CLAIM_SUBMITTED_DATE == null ||
        this.data3.CLAIM_SUBMITTED_DATE == ''
      ) {
        this.data3.CLAIM_SUBMITTED_DATE = null;
      } else {
        this.data3.CLAIM_SUBMITTED_DATE = this.datepipe.transform(
          this.data3.CLAIM_SUBMITTED_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                      }
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
              this.next();

              // this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.next();

              this.data4 = new CheckList();
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
    this.data4.EMP_ID = this.empID;
    this.data4.CLAIM_ID = this.claimID;
    this.isSpinning = true;
    this.isOk = true;

    if (
      this.data4.COPY_OF_CGHS_CARD == undefined ||
      this.data4.COPY_OF_CGHS_CARD == null ||
      this.data4.COPY_OF_CGHS_CARD == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Check Copy of CGHS card for both benificiary and patient ',
        ''
      );
    } else if (
      (this.data4.DISCHARGE_CARD == undefined ||
        this.data4.DISCHARGE_CARD == null ||
        this.data4.DISCHARGE_CARD == '') &&
      (!this.data2.IS_APPLYING_FOR_ADVANCE ||
        this.data.IS_ADVANCE_ANNEXURE_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Check Discharge Card ', '');
    } else if (
      this.data4.FORM_NO_3_MEDICAL_CLAIM == undefined ||
      this.data4.FORM_NO_3_MEDICAL_CLAIM == null ||
      this.data4.FORM_NO_3_MEDICAL_CLAIM == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Check Form No.3 in case the medical claim is of the officials family member for AMA Benificiery ',
        ''
      );
    } else if (
      (this.data4.PRESCIPTION_OF_MEDICINES_PURSCHASED_OUTSIDE == undefined ||
        this.data4.PRESCIPTION_OF_MEDICINES_PURSCHASED_OUTSIDE == null ||
        this.data4.PRESCIPTION_OF_MEDICINES_PURSCHASED_OUTSIDE == '') &&
      (!this.data2.IS_APPLYING_FOR_ADVANCE ||
        this.data.IS_ADVANCE_ANNEXURE_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Check Prescription of Medicines Purchased From Outside ',
        ''
      );
    }
    // else if (
    //   this.data4.CHECKLIST_STATUS == 'R' &&
    //   (this.data4.REJECT_REMARK == undefined ||
    //     this.data4.REJECT_REMARK == null ||
    //     this.data4.REJECT_REMARK == '')
    // ) {
    //   this.isOk = false;
    // this.isSpinning = false;
    //   this.message.error(' Please Enter Reject Remark.', '');
    // } else if (
    //   this.data4.CHECKLIST_STATUS == 'H' &&
    //   (this.data4.ON_HOLD_DATE == undefined || this.data4.ON_HOLD_DATE == null)
    // ) {
    //   this.isOk = false;
    // this.isSpinning = false;
    //   this.message.error(' Please Select On Hold Date.', '');
    // } else if (
    //   this.data4.CHECKLIST_STATUS == 'H' &&
    //   (this.data4.ON_HOLD_REMARK == undefined ||
    //     this.data4.ON_HOLD_REMARK == null ||
    //     this.data4.ON_HOLD_REMARK == '')
    // ) {
    //   this.isOk = false;
    // this.isSpinning = false;
    //   this.message.error(' Please Enter On Hold Remark.', '');
    // }
    else if (
      (this.data4.CHECKLIST_STATUS == undefined ||
        this.data4.CHECKLIST_STATUS == null ||
        this.data4.CHECKLIST_STATUS == 'T') &&
      (!this.data.IS_APPLYING_FOR_ADVANCE ||
        this.data.IS_ADVANCE_ANNEXURE_CREATED)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please select the claim status', '');
    } else if (
      (this.data4.CHECKLIST_STATUS == 'R' ||
        this.data4.CHECKLIST_STATUS == 'H' ||
        this.data4.CHECKLIST_STATUS == 'AR' ||
        this.data4.CHECKLIST_STATUS == 'AH') &&
      (this.data['TOUR_REMARK'] == undefined ||
        this.data['TOUR_REMARK'] == null ||
        this.data['TOUR_REMARK'] == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Remark', '');
    } else if (
      (this.data4.CHECKLIST_STATUS == 'H' ||
        this.data4.CHECKLIST_STATUS == 'AH') &&
      (this.data['TOUR_HOLD_DATE'] == undefined ||
        this.data['TOUR_HOLD_DATE'] == null ||
        this.data['TOUR_HOLD_DATE'] == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Hold Date', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_ADVANCE_ANNEXURE_CREATED
    ) {
      if (
        this.data4.CHECKLIST_STATUS == 'AH' ||
        this.data4.CHECKLIST_STATUS == 'AR' ||
        this.data4.CHECKLIST_STATUS == 'AA'
      ) {
      } else {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Change the claim status', '');
      }
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      this.data.IS_ADVANCE_ANNEXURE_CREATED
    ) {
      if (
        this.data4.CHECKLIST_STATUS == 'AH' ||
        this.data4.CHECKLIST_STATUS == 'AR' ||
        this.data4.CHECKLIST_STATUS == 'AA'
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Change the claim status', '');
      }
    } else if (
      this.data4.CHECKLIST_STATUS == 'A' ||
      this.data4.CHECKLIST_STATUS == 'AA'
    ) {
      if (this.data3.EMERGENCY_TREATEMENT == true || this.emergencyTaken == 1) {
        if (
          this.data3.IS_HOSPITAL_EMPLANELLED == true ||
          this.empanelHospital == 1
        ) {
          if (
            (this.data3.DOCTOR_EMERGENCY_CERTIFICATE_TAKEN == false ||
              this.drCertificate == 0) &&
            (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)
          ) {
            this.isOk = false;
            this.isSpinning = false;
            this.message.error(
              'Please Provide Doctor Certificate Or Expo Facto Permission Letter.',
              ''
            );
          }
        }
      } else {
        if (
          this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true ||
          this.referanceTaken == 1
        ) {
          if (
            this.data3.IS_HOSPITAL_EMPLANELLED == false ||
            this.empanelHospital == 0
          ) {
            if (
              (this.data3.IS_PERMISSION_TAKEN_FROM_HOD == false ||
                this.hodPermission == 0) &&
              (this.data3.EXPO_FACTO_PERMISSION == false || this.expoFacto == 0)
            ) {
              this.isOk = false;
              this.isSpinning = false;
              this.message.error(
                'Please Provide HOD Permission Letter Or Expo Facto Permission Letter.',
                ''
              );
            }
          }
        } else {
          if (
            this.data3.IS_HOSPITAL_EMPLANELLED == false ||
            this.empanelHospital == 0
          ) {
            if (
              this.data3.EXPO_FACTO_PERMISSION == false ||
              this.expoFacto == 0
            ) {
              this.isOk = false;
              this.isSpinning = false;
              this.message.error(
                'Please Provide Expo Facto Permission Letter.',
                ''
              );
            }
          } else {
            if (
              this.data3.EXPO_FACTO_PERMISSION == false ||
              this.expoFacto == 0
            ) {
              this.isOk = false;
              this.isSpinning = false;
              this.message.error(
                'Please Provide Expo Facto Permission Letter.',
                ''
              );
            }
          }
        }
      }
    }

    if (this.isOk) {
      if (
        this.data4.FILE_NO_ID == undefined ||
        this.data4.FILE_NO_ID == null ||
        this.data4.FILE_NO_ID == ''
      ) {
        this.data4.FILE_NO_ID = 0;
      } else {
        this.data4.FILE_NO_ID = this.data4.FILE_NO_ID;
      }
      if (this.data4.CHECKLIST_STATUS == 'A') {
        this.data4.CURRENT_STAGE_ID = 4;
        this.data2.STEP_NO = 5;
        this.data4.REJECT_REMARK = '';
      } else if (this.data4.CHECKLIST_STATUS == 'R') {
        this.data4.CURRENT_STAGE_ID = 5;
        this.data2.STEP_NO = 5;
        this.data4.REJECT_REMARK = this.data4.REJECT_REMARK;
      } else {
        this.data4.CURRENT_STAGE_ID = 18;
        this.data2.STEP_NO = 5;
        this.data4.ON_HOLD_REMARK = this.data4.ON_HOLD_REMARK;
      }
      this.data4.ON_HOLD_DATE = this.datepipe.transform(
        this.data4.ON_HOLD_DATE,
        'yyyy-MM-dd'
      );
      this.isSpinning = true;

      {
        this.api.updateclaimed(this.data2).subscribe((successCode) => {
          if (successCode.code == '200') {
            if (this.data4.ID) {
              this.api.updateChecklist(this.data4).subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
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
              this.api.createChecklist(this.data4).subscribe((successCode) => {
                if (successCode.code == '200') {
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
          } else {
            this.message.error('Information Has Not Changed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  pre(): void {
    if (this.current == 1) {
      this.isSpinning = true;
      // this.allEmployeeList();
      this.loadOnlySelectedEmployee();
      this.ListOfDesignation();
      this.ddoOfTheOfficialList();
      if (
        this.claimID != null &&
        this.claimID != undefined &&
        this.claimID != ''
      ) {
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
                } else {
                  this.data = data['data'][0];
                }
              } else {
                this.message.error('Something Went Wrong', '');
              }
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  '',
                  'desc',
                  ' AND CLAIM_ID = ' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.hospitalMapList = data['data'];
                      } else {
                        this.hospitalMapList = [];
                      }
                      this.isSpinning = false;
                      this.current -= 1;
                    } else {
                      this.message.error('Something Went Wrong', '');
                      this.isSpinning = false;
                    }
                  },
                  (err) => {}
                );
            },
            (err) => {}
          );
      } else {
      }
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.disableReferanceDate();
      this.allHODPermissionList();
      this.allDelayCondonationList();
      this.allExpostFactoList();
      if (
        this.claimID != null &&
        this.claimID != undefined &&
        this.claimID != ''
      ) {
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
                    data['data'][0]['HOD_ID'] != undefined &&
                    data['data'][0]['HOD_ID'] != null &&
                    data['data'][0]['HOD_ID'] != '' &&
                    data['data'][0]['HOD_ID'].length != 0
                  ) {
                    this.data3.HOD_ID = data['data'][0]['HOD_ID'].split(',');
                    this.data3.HOD_ID.forEach((element, index) => {
                      this.data3.HOD_ID[index] = Number(element);
                    });
                  } else {
                  }

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
                    this.date1 = new Date(
                      Math.max.apply(
                        null,
                        this.data3.CGHS_AMA_REFERENCE_END_DATE.map(function (
                          e
                        ) {
                          return new Date(e);
                        })
                      )
                    );
                    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
                    this.expoDiffDays = Math.floor(
                      (date2 - this.date1) / (1000 * 60 * 60 * 24)
                    );
                    this.dateDifference();
                  }
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
      } else {
      }
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.allHospitalList();
      if (
        this.claimID != null &&
        this.claimID != undefined &&
        this.claimID != ''
      ) {
        this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data2 = new ClaimMaster();
                this.hospitalData = new HospitalMappingMaster();
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
                this.hospitalData = new HospitalMappingMaster();
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
      } else {
      }
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
            this.data.DDO_OF_THE_OFFICIAL_ID = Number(
              sessionStorage.getItem('ddoId')
            );
            // if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
            //   this.data.DDO_OF_THE_OFFICIAL_ID = Number(
            //     sessionStorage.getItem('ddoId')
            //   );
            // } else {
            //   this.data.DDO_OF_THE_OFFICIAL_ID =
            //     data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            // }
            this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
            this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
            this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
            this.data.ADDRESS = data['data'][0]['ADDRESS'];

            this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
            this.data.EMPLOYEE_NAME_HN = data['data'][0]['EMPLOYEE_NAME_HN'];

            this.data.CGHS_CARD_NO = '';
            this.data.CGHS_CARD_VALIDITY = '';
            this.data.BENEFICIARY_TYPE = '';
            this.isSpinning = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {}
      );
    } else {
      this.empLoader = false;
      this.data.ID = null;
      this.data.OFFICE_NAME = '';
      this.data.SALUTATION = '';
      this.data.DESIGNATION_ID = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = '';
      this.data.GRADE_PAY = '';
      this.data.EMAIL_ID = '';
      this.data.MOBILE_NO = '';
      this.data.ADDRESS = '';
      this.data.CGHS_CARD_NO = '';
      this.data.CGHS_CARD_VALIDITY = '';
      this.data.BENEFICIARY_TYPE = '';
      this.isSpinning = false;
    }
  }

  name = '';
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
        this.data.SALUTATION = this.filteredOptions[0]['SALUTATION'];
        this.data.DESIGNATION = this.filteredOptions[0]['DESIGNATION'];
        this.data.EMPLOYEE_CODE = this.filteredOptions[0]['EMPLOYEE_CODE'];
        this.data.LOCATION = this.filteredOptions[0]['LOCATION'];
        this.data.DDO_OF_THE_OFFICIAL =
          this.filteredOptions[0]['DDO_OF_THE_OFFICIAL'];
        this.data.DDO_OF_THE_OFFICIAL_ID =
          this.filteredOptions[0]['DDO_OF_THE_OFFICIAL_ID'];
        this.data.GRADE_PAY = this.filteredOptions[0]['GRADE_PAY'];
        this.data.EMAIL_ID = this.filteredOptions[0]['EMAIL_ID'];
        this.data.MOBILE_NO = this.filteredOptions[0]['MOBILE_NO'];
        this.data.ADDRESS = this.filteredOptions[0]['ADDRESS'];
      } else {
        this.data.ID = undefined;
        this.name = value;
        this.data.OFFICE_NAME = '';
        this.data.SALUTATION = '';
        this.data.DESIGNATION = '';
        this.data.EMPLOYEE_CODE = '';
        this.data.LOCATION = '';
        this.data.DDO_OF_THE_OFFICIAL = '';
        this.data.DDO_OF_THE_OFFICIAL_ID = null;
        this.data.GRADE_PAY = '';
        this.data.EMAIL_ID = '';
        this.data.MOBILE_NO = '';
        this.data.ADDRESS = '';
      }
    } else {
      this.name = value;
      this.data.OFFICE_NAME = '';
      this.data.SALUTATION = '';
      this.data.DESIGNATION = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = null;
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

  dateDifference() {
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
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
        ' AND STATUS = 1 AND HIRARCHY_ID in (12,13)',
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
      this.allHospitalList();
      this.isSpinning = true;
      if (
        this.claimID != null &&
        this.claimID != undefined &&
        this.claimID != ''
      ) {
        this.api.getclaimed(0, 0, '', '', ' AND ID =' + this.claimID).subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data2 = new ClaimMaster();
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

                this.empanelledHospital();
              }
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  '',
                  'desc',
                  ' AND CLAIM_ID = ' + this.claimID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.hospitalMapList = data['data'];
                      this.message.success(
                        'Information Saved Successfully...',
                        ''
                      );
                      this.isSpinning = false;
                      this.current = 1;
                      this.hospitalData = new HospitalMappingMaster();
                    } else {
                      this.message.error('Something Went Wrong', '');
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
      }
    } else if (this.current == 1) {
      this.isSpinning = true;
      this.disableReferanceDate();
      if (
        this.claimID != null &&
        this.claimID != undefined &&
        this.claimID != ''
      ) {
        this.api
          .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                if (data['data'].length == 0) {
                  this.data3 = new QuestionaryMaster();
                  this.billInTime();
                  this.empanelledHospital();
                  this.allHODPermissionList();
                  this.allDelayCondonationList();
                  this.allExpostFactoList();
                  this.message.success('Information Save Successfully...', '');
                  this.current = 2;
                  this.isSpinning = false;

                  if (this.data2.ESTIMATE) {
                    this.data3.IS_HOSPITAL_ESTIMATE_ATTACHED = true;
                  } else {
                    this.data3.IS_HOSPITAL_ESTIMATE_ATTACHED = false;
                  }
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
                    data['data'][0]['HOD_ID'] != undefined &&
                    data['data'][0]['HOD_ID'] != null &&
                    data['data'][0]['HOD_ID'] != '' &&
                    data['data'][0]['HOD_ID'].length != 0
                  ) {
                    this.data3.HOD_ID = data['data'][0]['HOD_ID'].split(',');
                    this.data3.HOD_ID.forEach((element, index) => {
                      this.data3.HOD_ID[index] = Number(element);
                    });
                  } else {
                  }

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
                    this.date1 = new Date(
                      Math.max.apply(
                        null,
                        this.data3.CGHS_AMA_REFERENCE_END_DATE.map(function (
                          e
                        ) {
                          return new Date(e);
                        })
                      )
                    );
                    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
                    this.expoDiffDays = Math.floor(
                      (date2 - this.date1) / (1000 * 60 * 60 * 24)
                    );
                    this.dateDifference();
                  }

                  this.billInTime();
                  this.empanelledHospital();
                  this.allHODPermissionList();
                  this.allDelayCondonationList();
                  this.allExpostFactoList();
                  this.message.success('Information Save Successfully...', '');
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
      } else {
      }
    } else if ((this.current = 2)) {
      this.fileNumberList();
      this.isSpinning = true;
      if (
        this.claimID != null &&
        this.claimID != undefined &&
        this.claimID != ''
      ) {
        this.api
          .getAllChecklist(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                if (data['data'].length == 0) {
                  this.data4 = new CheckList();

                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
                  this.current = 3;
                  this.isSpinning = false;
                  if (this.data2.ESTIMATE) {
                    this.data4.HOSPITAL_ESTIMATE_COPY = true;
                  } else {
                    this.data4.HOSPITAL_ESTIMATE_COPY = false;
                  }
                } else {
                  this.data4 = data['data'][0];

                  this.message.success(
                    'Information Changed Successfully...',
                    ''
                  );
                  this.current = 3;
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
    } else {
    }
  }

  calculateDiff() {
    var date1: any = new Date(this.data2.TREATMENT_END_DATE);
    var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
  }

  hospitalAddress(event: any) {
    if (event != null) {
      this.api.getAllHospital(0, 0, '', '', ' AND ID = ' + event).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.hospitalData.ADDRESS = data['data'][0]['ADDRESS'];
            this.hospitalData.ACCREDATION = data['data'][0]['ACCREDITATION'];
          }
        },
        (err) => {}
      );
    } else {
    }
  }

  hospitalType(event: any) {
    if (event != null) {
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
    } else {
    }
  }

  billInTime() {
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
  }
  empanneledHospitalMapList: any = [];
  nonEmpanneled: boolean = false;
  empanelledHospital() {
    this.nonEmpanneled = false;
    if (
      this.claimID != null &&
      this.claimID != undefined &&
      this.claimID != ''
    ) {
      this.api
        .getHospitalMapping(0, 0, '', 'desc', ' AND CLAIM_ID = ' + this.claimID)
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
    } else {
    }
  }

  isAdvanceTaken(event: any) {
    if (event != null) {
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
    } else {
    }
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
    this.isSpinning = true;
    if (event != null) {
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
    } else {
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
      this.data3.HOD_ID = [];
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
      this.data3.HOD_ID = [];
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
      this.CGHS_AMA_REFERENCE_DATE == undefined ||
      this.CGHS_AMA_REFERENCE_DATE == null ||
      this.CGHS_AMA_REFERENCE_DATE == ''
    ) {
      this.message.error("Please Select CGHS/AMA's Reference Start Date", '');
    } else {
      this.date1 = '';
      this.expoDiffDays = '';
      var date = this.datepipe.transform(
        this.CGHS_AMA_REFERENCE_DATE,
        'yyyy-MM-dd'
      );

      this.data3.CGHS_AMA_REFERENCE_DATE.push(date);
      this.CGHS_AMA_REFERENCE_DATE = null;
      if (
        this.CGHS_AMA_REFERENCE_END_DATE != undefined &&
        this.CGHS_AMA_REFERENCE_END_DATE != null &&
        this.CGHS_AMA_REFERENCE_END_DATE != ''
      ) {
        this.date2 = '';
        this.expoDiffDays = '';
        var enddate = this.datepipe.transform(
          this.CGHS_AMA_REFERENCE_END_DATE,
          'yyyy-MM-dd'
        );

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

        this.expoDiffDays = Math.floor(
          (date2 - this.date1) / (1000 * 60 * 60 * 24)
        );
      } else {
        this.CGHS_AMA_REFERENCE_END_DATE = null;
      }
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
    if (data.EMP_ID != null && data.EMP_ID != undefined && data.EMP_ID != '') {
      this.drawerData = data;
      // this.api
      //   .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + data.EMP_ID)
      //   .subscribe((data) => {
      //     if (data['code'] == 200) {
      //       this.drawerData = data['data'][0];
      //       // if (
      //       //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == null ||
      //       //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == undefined ||
      //       //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == 0
      //       // ) {
      //       //   this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
      //       //     sessionStorage.getItem('ddoId')
      //       //   );
      //       // } else {
      //       //   this.drawerData.DDO_OF_THE_OFFICIAL_ID =
      //       //     this.drawerData.DDO_OF_THE_OFFICIAL_ID;
      //       // }
      //     } else {
      //       this.message.error("Can't Load Employee Data", '');
      //     }
      //   });
    } else {
    }

    this.empDrawerVisible = true;
  }
  empDrawerClose(): void {
    this.empDrawerVisible = false;
    this.isSpinning = true;
    if (
      this.data.EMP_ID == null ||
      this.data.EMP_ID == undefined ||
      this.data.EMP_ID == ''
    ) {
      this.isSpinning = false;
      this.allEmployeeList();
    } else {
      this.isSpinning = false;
      // this.api
      //   .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
      //   .subscribe(
      //     (data) => {
      //       if (data['code'] == 200) {
      //         this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
      //         this.data.SALUTATION = data['data'][0]['SALUTATION'];
      //         this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
      //         this.data.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
      //         this.data.LOCATION = data['data'][0]['LOCATION'];
      //         this.data.DDO_OF_THE_OFFICIAL =
      //           data['data'][0]['DDO_OF_THE_OFFICIAL'];
      //         if (!data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
      //           this.data.DDO_OF_THE_OFFICIAL_ID = Number(
      //             sessionStorage.getItem('ddoId')
      //           );
      //         } else {
      //           this.data.DDO_OF_THE_OFFICIAL_ID =
      //             data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
      //         }
      //         this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
      //         this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
      //         this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
      //         this.data.ADDRESS = data['data'][0]['ADDRESS'];
      //         this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
      //         this.data.DESIGNATION_ID = data['data'][0]['DESIGNATION_ID'];
      //         this.isSpinning = false;
      //       } else {
      //         this.message.error("Can't Load Employee Data", '');
      //         this.isSpinning = false;
      //       }
      //     },
      //     (err) => {}
      //   );
    }
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
    if (
      this.data3.CGHS_AMA_REFERENCE_DATE != undefined ||
      this.data3.CGHS_AMA_REFERENCE_DATE != null ||
      this.data3.CGHS_AMA_REFERENCE_DATE != '' ||
      this.data3.CGHS_AMA_REFERENCE_DATE.length != 0
    ) {
      this.date1 = new Date(
        Math.max.apply(
          null,
          this.data3.CGHS_AMA_REFERENCE_DATE.map(function (e) {
            return new Date(e);
          })
        )
      );
      var date2: any = new Date(this.data2.BILL_FILIING_DATE);
      this.expoDiffDays = Math.floor(
        (date2 - this.date1) / (1000 * 60 * 60 * 24)
      );
    } else {
    }
    if (
      this.data3.EMERGENCY_TREATEMENT == false &&
      this.data3.REFERENCE_FORM_CGHS_AMA_TAKEN == true &&
      this.expoDiffDays < 30
    ) {
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
    this.isSpinning = true;
    this.isOk = true;

    if (
      this.hospitalData.TYPE == '' &&
      this.hospitalData.ADDRESS == '' &&
      this.hospitalData.ACCREDATION == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.hospitalData.TYPE == null ||
      this.hospitalData.TYPE.trim() == '' ||
      this.hospitalData.TYPE == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Hospital Type.', '');
    } else if (
      this.hospitalData.TYPE == 'E' &&
      (this.hospitalData.HOSPITAL_ID == undefined ||
        this.hospitalData.HOSPITAL_ID == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Hospital Name ', '');
    } else if (
      (this.hospitalData.TYPE == 'NE' || this.hospitalData.TYPE == 'G') &&
      (this.hospitalData.NAME == undefined ||
        this.hospitalData.NAME == null ||
        this.hospitalData.NAME == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Hospital Name ', '');
    } else if (
      this.hospitalData.ADDRESS == undefined ||
      this.hospitalData.ADDRESS == null ||
      this.hospitalData.ADDRESS == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Hospital Address ', '');
    } else if (
      this.hospitalData.ACCREDATION == undefined ||
      this.hospitalData.ACCREDATION == null ||
      this.hospitalData.ACCREDATION == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
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

                this.api
                  .getHospitalMapping(
                    0,
                    0,
                    '',
                    'desc',
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

                hospitalFormReset.form.reset();
                this.resetDrawer(hospitalFormReset);
                this.api
                  .getHospitalMapping(
                    0,
                    0,
                    '',
                    'desc',
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
    this.hospitalData = Object.assign({}, data);
  }

  confirmDeleteHospital(data: any) {
    var hospitalData = {
      ID: data.ID,
    };
    this.api.deleteHospitalMapping(hospitalData).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Hospital Deleted Successfully...', '');
        this.api
          .getHospitalMapping(
            0,
            0,
            '',
            'desc',
            ' AND CLAIM_ID = ' + this.claimID
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.hospitalMapList = data['data'];
                this.isSpinning = false;
              } else {
                this.message.error("Can't Load Hospital Mapped Data.", '');
                this.isSpinning = false;
              }
            },
            (err) => {}
          );
      } else {
        this.message.error('Hospital Has Not Deleted...', '');
        this.isSpinning = false;
      }
    });
  }
  cancel(): void {}

  resetDrawer(hospitalFormReset: NgForm) {
    this.hospitalData = new HospitalMappingMaster();
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
  }
  permissionLetter() {
    this.orderValue = '';
    this.orderSheetTitle = 'Permission Letter';
    this.orderSheetVisible = true;
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

  delayOrderSheetCloseNew(): void {
    if (
      this.claimID != null &&
      this.claimID != undefined &&
      this.claimID != ''
    ) {
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
    } else {
    }
  }
  get delayOrderSheetCloseCallback() {
    return this.delayOrderSheetCloseNew.bind(this);
  }

  get delayPermissionCloseCallback() {
    return this.delayPermissionClosenew.bind(this);
  }

  delayPermissionVisiblenew: any;
  delayPermissionTitlenew: any;
  delayOrderSheetnewVisible: any;
  delayOrderSheetnewTitle: any;
  orderdata: any = [];
  dateBetweenDiff: any;
  sixMonthDate: any;
  addMonths(date: any, months) {
    date = new Date(date);
    this.sixMonthDate = date.setMonth(date.getMonth() + months);
  }
  delayOrderSheetnew() {
    this.delayOrderSheetnewTitle = 'Delay Order Sheet';

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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                      var date1 = data['data'][0]['TREATMENT_END_DATE'];

                      this.addMonths(
                        new Date(data['data'][0]['TREATMENT_END_DATE']),
                        6
                      );

                      if (
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != undefined &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != null &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != ''
                      ) {
                        var future = moment(
                          data['data'][0]['CLAIM_SUBMITTED_DATE']
                        );
                        var start = moment(this.sixMonthDate);
                        this.dateBetweenDiff = future.diff(start, 'days');
                      } else {
                      }
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
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
                      var date = data['data'][0]['TREATMENT_END_DATE'];
                      this.addMonths(
                        new Date(data['data'][0]['TREATMENT_END_DATE']),
                        6
                      );

                      if (
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != undefined &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != null &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != ''
                      ) {
                        var future = moment(
                          data['data'][0]['CLAIM_SUBMITTED_DATE']
                        );
                        var start = moment(this.sixMonthDate);
                        this.dateBetweenDiff = future.diff(start, 'days');
                      } else {
                      }
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
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
  NAME: any;
  NAME_HN: any;
  OFFICE_NAME: any;
  OFFICE_NAME_HN: any;
  POST: any;
  POST_HN: any;
  permissionnewLetter() {
    this.delayPermissionTitlenew = 'Delay Permission Letter';

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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                      this.addMonths(
                        new Date(data['data'][0]['TREATMENT_END_DATE']),
                        6
                      );
                      if (
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != undefined &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != null &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != ''
                      ) {
                        var future = moment(
                          data['data'][0]['CLAIM_SUBMITTED_DATE']
                        );
                        var start = moment(this.sixMonthDate);
                        this.dateBetweenDiff = future.diff(start, 'days');
                      } else {
                      }
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
                              this.NAME = data['data'][0]['NAME'];
                              this.NAME_HN = data['data'][0]['NAME_HN'];
                              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                              this.OFFICE_NAME_HN =
                                data['data'][0]['OFFICE_NAME_HN'];
                              this.POST = data['data'][0]['POST'];
                              this.POST_HN = data['data'][0]['POST_HN'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
                      this.addMonths(
                        new Date(data['data'][0]['TREATMENT_END_DATE']),
                        6
                      );
                      if (
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != undefined &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != null &&
                        data['data'][0]['CLAIM_SUBMITTED_DATE'] != ''
                      ) {
                        var future = moment(
                          data['data'][0]['CLAIM_SUBMITTED_DATE']
                        );
                        var start = moment(this.sixMonthDate);
                        this.dateBetweenDiff = future.diff(start, 'days');
                      } else {
                      }
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
                              this.NAME = data['data'][0]['NAME'];
                              this.NAME_HN = data['data'][0]['NAME_HN'];
                              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                              this.OFFICE_NAME_HN =
                                data['data'][0]['OFFICE_NAME_HN'];
                              this.POST = data['data'][0]['POST'];
                              this.POST_HN = data['data'][0]['POST_HN'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
    if (
      this.claimID != null &&
      this.claimID != undefined &&
      this.claimID != ''
    ) {
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
    } else {
    }
  }

  get refExpoOrderCloseCallback() {
    return this.refExpoOrderClose.bind(this);
  }

  refExpoPermissionLetterVisible: boolean = false;
  isRefExpoPermission: boolean = false;
  refExpoPermissionLetterTitle: string = '';
  refExpoPermissionLetter() {
    this.refExpoPermissionLetterTitle =
      'Referance Expo Facto Permission Letter';
    this.claimID1 = '';
    this.empID1 = '';
    this.data3.EMP_ID = this.empID;
    this.data3.CLAIM_ID = this.claimID;
    this.isRefExpoPermission = false;
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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                              this.NAME = data['data'][0]['NAME'];
                              this.NAME_HN = data['data'][0]['NAME_HN'];
                              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                              this.OFFICE_NAME_HN =
                                data['data'][0]['OFFICE_NAME_HN'];
                              this.POST = data['data'][0]['POST'];
                              this.POST_HN = data['data'][0]['POST_HN'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
                              this.NAME = data['data'][0]['NAME'];
                              this.NAME_HN = data['data'][0]['NAME_HN'];
                              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                              this.OFFICE_NAME_HN =
                                data['data'][0]['OFFICE_NAME_HN'];
                              this.POST = data['data'][0]['POST'];
                              this.POST_HN = data['data'][0]['POST_HN'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
    if (
      this.claimID != null &&
      this.claimID != undefined &&
      this.claimID != ''
    ) {
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
    } else {
    }
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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
    this.disableReferanceDate();
    if (
      this.claimID != null &&
      this.claimID != undefined &&
      this.claimID != ''
    ) {
      this.api
        .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data3 = new QuestionaryMaster();
                this.billInTime();
                this.empanelledHospital();

                this.refhodorderVisible = false;
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
    } else {
    }
  }
  get refhodorderSheetCloseCallback() {
    return this.refhodorderSheetClose.bind(this);
  }

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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
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
                              this.NAME = data['data'][0]['NAME'];
                              this.NAME_HN = data['data'][0]['NAME_HN'];
                              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                              this.OFFICE_NAME_HN =
                                data['data'][0]['OFFICE_NAME_HN'];
                              this.POST = data['data'][0]['POST'];
                              this.POST_HN = data['data'][0]['POST_HN'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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
                              this.NAME = data['data'][0]['NAME'];
                              this.NAME_HN = data['data'][0]['NAME_HN'];
                              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
                              this.OFFICE_NAME_HN =
                                data['data'][0]['OFFICE_NAME_HN'];
                              this.POST = data['data'][0]['POST'];
                              this.POST_HN = data['data'][0]['POST_HN'];
                            }
                          },
                          (err) => {}
                        );
                      this.api
                        .getHospitalMapping(
                          0,
                          0,
                          '',
                          'desc',
                          ' AND CLAIM_ID = ' + this.claimID
                        )
                        .subscribe(
                          (data) => {
                            if (data['code'] == 200) {
                              this.HospitalMapping = data['data'];

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

  refhodPermissionSheetClose(): void {
    this.disableReferanceDate();
    if (
      this.claimID != null &&
      this.claimID != undefined &&
      this.claimID != ''
    ) {
      this.api
        .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data3 = new QuestionaryMaster();
                this.billInTime();
                this.empanelledHospital();

                this.refhodPermissionVisible = false;
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
    } else {
    }
  }
  get refhodPermissionSheetCloseCallback() {
    return this.refhodPermissionSheetClose.bind(this);
  }

  HODPermissionVisible: boolean = false;
  HODPermissionTitle: string = '';
  HODPermissionID: any;
  genHODPermission() {
    this.isSpinning = true;
    this.HODPermissionID = this.empID;
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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.EXPOST_FACTO_ID == undefined ||
        this.data3.EXPOST_FACTO_ID == null ||
        this.data3.EXPOST_FACTO_ID == ''
      ) {
        this.data3.EXPOST_FACTO_ID = null;
      } else {
        this.data3.EXPOST_FACTO_ID = this.data3.EXPOST_FACTO_ID;
      }
      if (
        this.data3.DELAY_CONDOLATION_ID == undefined ||
        this.data3.DELAY_CONDOLATION_ID == null ||
        this.data3.DELAY_CONDOLATION_ID == ''
      ) {
        this.data3.DELAY_CONDOLATION_ID = null;
      } else {
        this.data3.DELAY_CONDOLATION_ID = this.data3.DELAY_CONDOLATION_ID;
      }
      if (
        this.data3.HOD_ID == undefined ||
        this.data3.HOD_ID == null ||
        this.data3.HOD_ID == ''
      ) {
        this.data3.HOD_ID = null;
      } else {
        this.data3.HOD_ID = this.data3.HOD_ID.toString();
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
              this.isSpinning = false;
              var hodData = {
                CLAIM_ID: this.claimID,
                HOD_CREATED_DATETIME: this.datepipe.transform(
                  new Date(),
                  'yyyy-MM-dd HH:mm:ss'
                ),
              };
              this.api
                .generateHODPermission(hodData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Permission Generated Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.api
                      .getHODPermissionMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND EMP_ID =' +
                          this.empID +
                          ' AND INSPECTOR_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.totalRecords = data['count'];

                            this.HODPermissionList = data['data'];
                            this.delayLoadingRecords = false;
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
                                      this.isSpinning = false;
                                    } else {
                                      this.data3 = data['data'][0];
                                      this.emergencyTaken =
                                        data['data'][0]['EMERGENCY_TREATEMENT'];
                                      this.drCertificate =
                                        data['data'][0][
                                          'DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'
                                        ];
                                      this.empanelHospital =
                                        data['data'][0][
                                          'IS_HOSPITAL_EMPLANELLED'
                                        ];
                                      this.expoFacto =
                                        data['data'][0][
                                          'EXPO_FACTO_PERMISSION'
                                        ];
                                      this.referanceTaken =
                                        data['data'][0][
                                          'REFERENCE_FORM_CGHS_AMA_TAKEN'
                                        ];
                                      this.hodPermission =
                                        data['data'][0][
                                          'IS_PERMISSION_TAKEN_FROM_HOD'
                                        ];
                                      if (
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          undefined &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          null &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          '' &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_DATE = [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_DATE.split(
                                            ','
                                          );
                                      }
                                      if (
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          undefined &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          null &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE == '' &&
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_END_DATE.split(
                                            ','
                                          );
                                      }
                                      this.isSpinning = false;
                                    }
                                    this.allDelayCondonationList();
                                    this.allExpostFactoList();
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
                            this.message.error("Can't Load Data", '');
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.message.error('Failed To Generate Permission ...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.isSpinning = false;
              var hodData = {
                CLAIM_ID: this.claimID,
                HOD_CREATED_DATETIME: this.datepipe.transform(
                  new Date(),
                  'yyyy-MM-dd HH:mm:ss'
                ),
              };
              this.api
                .generateHODPermission(hodData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Permission Generated Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.api
                      .getHODPermissionMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND EMP_ID =' +
                          this.empID +
                          ' AND INSPECTOR_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.totalRecords = data['count'];
                            this.HODPermissionList = data['data'];

                            this.delayLoadingRecords = false;
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
                                      this.isSpinning = false;
                                    } else {
                                      this.data3 = data['data'][0];
                                      this.emergencyTaken =
                                        data['data'][0]['EMERGENCY_TREATEMENT'];
                                      this.drCertificate =
                                        data['data'][0][
                                          'DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'
                                        ];
                                      this.empanelHospital =
                                        data['data'][0][
                                          'IS_HOSPITAL_EMPLANELLED'
                                        ];
                                      this.expoFacto =
                                        data['data'][0][
                                          'EXPO_FACTO_PERMISSION'
                                        ];
                                      this.referanceTaken =
                                        data['data'][0][
                                          'REFERENCE_FORM_CGHS_AMA_TAKEN'
                                        ];
                                      this.hodPermission =
                                        data['data'][0][
                                          'IS_PERMISSION_TAKEN_FROM_HOD'
                                        ];
                                      if (
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          undefined &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          null &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          '' &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_DATE = [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_DATE.split(
                                            ','
                                          );
                                      }
                                      if (
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          undefined &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          null &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE == '' &&
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_END_DATE.split(
                                            ','
                                          );
                                      }
                                      this.isSpinning = false;
                                    }
                                    this.allDelayCondonationList();
                                    this.allExpostFactoList();
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
                            this.message.error("Can't Load Data", '');
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.message.error('Failed To Generate Permission ...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  HODPermissionDrawerClose(): void {
    this.HODPermissionVisible = false;
    this.allHODPermissionList();
  }

  get HODPermissionCloseCallback() {
    return this.HODPermissionDrawerClose.bind(this);
  }
  delayCondonationVisible: boolean = false;
  delayCondonationTitle: string = '';
  delayCondonationID: any;
  dataList: any = [];
  totalRecords: any;
  delayLoadingRecords: boolean = false;
  genDelayCondonation() {
    this.isSpinning = true;
    this.empID = this.empID;
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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.EXPOST_FACTO_ID == undefined ||
        this.data3.EXPOST_FACTO_ID == null ||
        this.data3.EXPOST_FACTO_ID == ''
      ) {
        this.data3.EXPOST_FACTO_ID = null;
      } else {
        this.data3.EXPOST_FACTO_ID = this.data3.EXPOST_FACTO_ID;
      }
      if (
        this.data3.DELAY_CONDOLATION_ID == undefined ||
        this.data3.DELAY_CONDOLATION_ID == null ||
        this.data3.DELAY_CONDOLATION_ID == ''
      ) {
        this.data3.DELAY_CONDOLATION_ID = null;
      } else {
        this.data3.DELAY_CONDOLATION_ID = this.data3.DELAY_CONDOLATION_ID;
      }
      if (
        this.data3.HOD_ID == undefined ||
        this.data3.HOD_ID == null ||
        this.data3.HOD_ID == ''
      ) {
        this.data3.HOD_ID = null;
      } else {
        this.data3.HOD_ID = this.data3.HOD_ID.toString();
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
              this.isSpinning = false;
              var delayData = {
                CLAIM_ID: this.claimID,
                DELAY_CREATED_DATETIME: this.datepipe.transform(
                  new Date(),
                  'yyyy-MM-dd HH:mm:ss'
                ),
              };
              this.api
                .generateDelayCondonation(delayData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Permission Generated Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.api
                      .getDelayCondolationMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND EMP_ID =' +
                          this.empID +
                          ' AND INSPECTOR_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.totalRecords = data['count'];

                            this.delayCondolationList = data['data'];
                            this.delayLoadingRecords = false;
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
                                      this.isSpinning = false;
                                    } else {
                                      this.data3 = data['data'][0];
                                      this.emergencyTaken =
                                        data['data'][0]['EMERGENCY_TREATEMENT'];
                                      this.drCertificate =
                                        data['data'][0][
                                          'DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'
                                        ];
                                      this.empanelHospital =
                                        data['data'][0][
                                          'IS_HOSPITAL_EMPLANELLED'
                                        ];
                                      this.expoFacto =
                                        data['data'][0][
                                          'EXPO_FACTO_PERMISSION'
                                        ];
                                      this.referanceTaken =
                                        data['data'][0][
                                          'REFERENCE_FORM_CGHS_AMA_TAKEN'
                                        ];
                                      this.hodPermission =
                                        data['data'][0][
                                          'IS_PERMISSION_TAKEN_FROM_HOD'
                                        ];
                                      if (
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          undefined &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          null &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          '' &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_DATE = [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_DATE.split(
                                            ','
                                          );
                                      }
                                      if (
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          undefined &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          null &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE == '' &&
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_END_DATE.split(
                                            ','
                                          );
                                      }
                                      this.isSpinning = false;
                                    }
                                    this.allHODPermissionList();
                                    this.allExpostFactoList();
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
                            this.message.error("Can't Load Data", '');
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.message.error('Failed To Generate Permission ...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.isSpinning = false;
              var delayData = {
                CLAIM_ID: this.claimID,
                DELAY_CREATED_DATETIME: this.datepipe.transform(
                  new Date(),
                  'yyyy-MM-dd HH:mm:ss'
                ),
              };
              this.api
                .generateDelayCondonation(delayData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Permission Generated Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.api
                      .getDelayCondolationMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND EMP_ID =' +
                          this.empID +
                          ' AND INSPECTOR_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.totalRecords = data['count'];
                            this.delayCondolationList = data['data'];

                            this.delayLoadingRecords = false;
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
                                      this.isSpinning = false;
                                    } else {
                                      this.data3 = data['data'][0];
                                      this.emergencyTaken =
                                        data['data'][0]['EMERGENCY_TREATEMENT'];
                                      this.drCertificate =
                                        data['data'][0][
                                          'DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'
                                        ];
                                      this.empanelHospital =
                                        data['data'][0][
                                          'IS_HOSPITAL_EMPLANELLED'
                                        ];
                                      this.expoFacto =
                                        data['data'][0][
                                          'EXPO_FACTO_PERMISSION'
                                        ];
                                      this.referanceTaken =
                                        data['data'][0][
                                          'REFERENCE_FORM_CGHS_AMA_TAKEN'
                                        ];
                                      this.hodPermission =
                                        data['data'][0][
                                          'IS_PERMISSION_TAKEN_FROM_HOD'
                                        ];
                                      if (
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          undefined &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          null &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          '' &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_DATE = [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_DATE.split(
                                            ','
                                          );
                                      }
                                      if (
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          undefined &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          null &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE == '' &&
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_END_DATE.split(
                                            ','
                                          );
                                      }
                                      this.isSpinning = false;
                                    }
                                    this.allHODPermissionList();
                                    this.allExpostFactoList();
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
                            this.message.error("Can't Load Data", '');
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.message.error('Failed To Generate Permission ...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  delayCondonationDrawerClose(): void {
    this.delayCondonationVisible = false;
    this.allDelayCondonationList();
  }

  get delayCondonationCloseCallback() {
    return this.delayCondonationDrawerClose.bind(this);
  }

  expostFactoVisible: boolean = false;
  ExpostLoadingRecords: boolean = false;
  expostFactoTitle: string = '';
  expostFactoID: any;
  genExpostFacto() {
    this.isSpinning = true;
    this.ExpostLoadingRecords = false;
    this.expostFactoID = this.empID;
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
        this.data3.TREATEMENT_PERMISSION_START_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_START_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_START_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_START_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_START_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.TREATEMENT_PERMISSION_END_DATE == undefined ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == null ||
        this.data3.TREATEMENT_PERMISSION_END_DATE == ''
      ) {
        this.data3.TREATEMENT_PERMISSION_END_DATE = null;
      } else {
        this.data3.TREATEMENT_PERMISSION_END_DATE = this.datepipe.transform(
          this.data3.TREATEMENT_PERMISSION_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data3.BILL_SUBMISSION_DATE == undefined ||
        this.data3.BILL_SUBMISSION_DATE == null ||
        this.data3.BILL_SUBMISSION_DATE == ''
      ) {
        this.data3.BILL_SUBMISSION_DATE = null;
      } else {
        this.data3.BILL_SUBMISSION_DATE = this.datepipe.transform(
          this.data3.BILL_SUBMISSION_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data3.EXPOST_FACTO_ID == undefined ||
        this.data3.EXPOST_FACTO_ID == null ||
        this.data3.EXPOST_FACTO_ID == ''
      ) {
        this.data3.EXPOST_FACTO_ID = null;
      } else {
        this.data3.EXPOST_FACTO_ID = this.data3.EXPOST_FACTO_ID;
      }
      if (
        this.data3.DELAY_CONDOLATION_ID == undefined ||
        this.data3.DELAY_CONDOLATION_ID == null ||
        this.data3.DELAY_CONDOLATION_ID == ''
      ) {
        this.data3.DELAY_CONDOLATION_ID = null;
      } else {
        this.data3.DELAY_CONDOLATION_ID = this.data3.DELAY_CONDOLATION_ID;
      }
      if (
        this.data3.HOD_ID == undefined ||
        this.data3.HOD_ID == null ||
        this.data3.HOD_ID == ''
      ) {
        this.data3.HOD_ID = null;
      } else {
        this.data3.HOD_ID = this.data3.HOD_ID.toString();
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
              this.isSpinning = false;
              var expoData = {
                CLAIM_ID: this.claimID,
                EXPOST_CREATED_DATETIME: this.datepipe.transform(
                  new Date(),
                  'yyyy-MM-dd HH:mm:ss'
                ),
              };
              this.api
                .generateExpostFacto(expoData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Permission Generated Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.api
                      .getExpostFactoMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND EMP_ID =' +
                          this.empID +
                          ' AND INSPECTOR_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.totalRecords = data['count'];

                            this.expostFactoList = data['data'];
                            this.delayLoadingRecords = false;
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
                                      this.isSpinning = false;
                                    } else {
                                      this.data3 = data['data'][0];
                                      this.emergencyTaken =
                                        data['data'][0]['EMERGENCY_TREATEMENT'];
                                      this.drCertificate =
                                        data['data'][0][
                                          'DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'
                                        ];
                                      this.empanelHospital =
                                        data['data'][0][
                                          'IS_HOSPITAL_EMPLANELLED'
                                        ];
                                      this.expoFacto =
                                        data['data'][0][
                                          'EXPO_FACTO_PERMISSION'
                                        ];
                                      this.referanceTaken =
                                        data['data'][0][
                                          'REFERENCE_FORM_CGHS_AMA_TAKEN'
                                        ];
                                      this.hodPermission =
                                        data['data'][0][
                                          'IS_PERMISSION_TAKEN_FROM_HOD'
                                        ];
                                      if (
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          undefined &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          null &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          '' &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_DATE = [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_DATE.split(
                                            ','
                                          );
                                      }
                                      if (
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          undefined &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          null &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE == '' &&
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_END_DATE.split(
                                            ','
                                          );
                                      }
                                      this.isSpinning = false;
                                    }
                                    this.allHODPermissionList();
                                    this.allDelayCondonationList();
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
                            this.message.error("Can't Load Data", '');
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.message.error('Failed To Generate Permission ...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuestions(this.data3).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.isSpinning = false;
              var expoData = {
                CLAIM_ID: this.claimID,
                EXPOST_CREATED_DATETIME: this.datepipe.transform(
                  new Date(),
                  'yyyy-MM-dd HH:mm:ss'
                ),
              };
              this.api
                .generateExpostFacto(expoData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Permission Generated Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.api
                      .getExpostFactoMaster(
                        0,
                        0,
                        '',
                        '',
                        ' AND EMP_ID =' +
                          this.empID +
                          ' AND INSPECTOR_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.totalRecords = data['count'];
                            this.expostFactoList = data['data'];

                            this.delayLoadingRecords = false;
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
                                      this.isSpinning = false;
                                    } else {
                                      this.data3 = data['data'][0];
                                      this.emergencyTaken =
                                        data['data'][0]['EMERGENCY_TREATEMENT'];
                                      this.drCertificate =
                                        data['data'][0][
                                          'DOCTOR_EMERGENCY_CERTIFICATE_TAKEN'
                                        ];
                                      this.empanelHospital =
                                        data['data'][0][
                                          'IS_HOSPITAL_EMPLANELLED'
                                        ];
                                      this.expoFacto =
                                        data['data'][0][
                                          'EXPO_FACTO_PERMISSION'
                                        ];
                                      this.referanceTaken =
                                        data['data'][0][
                                          'REFERENCE_FORM_CGHS_AMA_TAKEN'
                                        ];
                                      this.hodPermission =
                                        data['data'][0][
                                          'IS_PERMISSION_TAKEN_FROM_HOD'
                                        ];
                                      if (
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          undefined &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          null &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE ==
                                          '' &&
                                        this.data3.CGHS_AMA_REFERENCE_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_DATE = [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_DATE.split(
                                            ','
                                          );
                                      }
                                      if (
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          undefined &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE ==
                                          null &&
                                        this.data3
                                          .CGHS_AMA_REFERENCE_END_DATE == '' &&
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE
                                          .length == 0
                                      ) {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          [];
                                      } else {
                                        this.data3.CGHS_AMA_REFERENCE_END_DATE =
                                          this.data3.CGHS_AMA_REFERENCE_END_DATE.split(
                                            ','
                                          );
                                      }
                                      this.isSpinning = false;
                                    }
                                    this.allHODPermissionList();
                                    this.allDelayCondonationList();
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
                            this.message.error("Can't Load Data", '');
                          }
                        },
                        (err) => {}
                      );
                  } else {
                    this.message.error('Failed To Generate Permission ...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  expostFactoDrawerClose(): void {
    this.expostFactoVisible = false;
    this.allExpostFactoList();
  }

  get expostFactoCloseCallback() {
    return this.expostFactoDrawerClose.bind(this);
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
      this.isSpinning = true;
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
      this.isSpinning = false;
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
      this.isSpinning = true;
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
      this.isSpinning = false;
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
      this.isSpinning = true;
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
      this.isSpinning = false;
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
      this.isSpinning = true;
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
      this.isSpinning = false;
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
    window.open(this.api.retriveimgUrl + 'bankdetailsofhospital`/' + pdfURL);
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

  progressBarOfCertificateFromOfficer: boolean = false;
  percentOfCertificateFromOfficer = 0;
  certificateFromOfficer: any;
  certificateFromOfficerurl: any;

  onFileSelectedCertificate(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.isSpinning = false;
    }
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

  progressBarOfAnticipateCost: boolean = false;
  percentOfAnticipateCost = 0;
  certificateOfAnticipateCost: any;
  anticipateCostrurl: any;

  onFileSelectedAnticipateCost(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.isSpinning = false;
    }
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

  progressBarFinalClaim: boolean = false;
  percentFinalClaim = 0;
  finalClaim: any;
  finalClaimurl: any;

  onFileSelectedFinalClaim(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
            this.percentFinalClaim = 0;
            this.data2.BANK_DETAILS_HOSPITAL = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.finalClaim = null;
      this.data2.BANK_DETAILS_HOSPITAL = null;
      this.isSpinning = false;
    }
  }

  progressBarOtherDocument: boolean = false;
  percentOtherDocument = 0;
  otherDocument: any;
  otherDocumenturl: any;

  onFileSelectedOtherDocument(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
            this.percentOtherDocument = 0;
            this.data2.OTHER_DOCUMENT = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.otherDocument = null;
      this.data2.OTHER_DOCUMENT = null;
      this.isSpinning = false;
    }
  }

  progressBarPrescription: boolean = false;
  percentPrescription = 0;
  prescription: any;
  prescriptionurl: any;

  onFileSelectedPrescription(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.isSpinning = false;
    }
  }

  progressBarSelfBankDetails: boolean = false;
  percentSelfBankDetails = 0;
  SelfBankDetails: any;
  SelfBankDetailsurl: any;

  onFileSelectedSelfBankDetails(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.isSpinning = false;
    }
  }
  progressBarOriginalHospitalBill: boolean = false;
  percentOriginalHospitalBill = 0;
  OriginalHospitalBill: any;
  OriginalHospitalBillurl: any;

  onFileSelectedOriginalHospitalBill(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.isSpinning = false;
    }
  }
  progressBarHospitalDischargeCard: boolean = false;
  percentHospitalDischargeCard = 0;
  HospitalDischargeCard: any;
  HospitalDischargeCardurl: any;

  onFileSelectedHospitalDischargeCard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.isSpinning = false;
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
}
