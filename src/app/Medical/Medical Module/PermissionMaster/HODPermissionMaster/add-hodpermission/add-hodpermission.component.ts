import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NgForm } from '@angular/forms';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { HODPermissionMaster } from 'src/app/Medical/Models/hodpermission';
import { HospitalMappingMaster } from 'src/app/Medical/Models/hospitalmappingmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-add-hodpermission',
  templateUrl: './add-hodpermission.component.html',
  styleUrls: ['./add-hodpermission.component.css'],
})
export class AddHODPermissionComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  empDrawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: HODPermissionMaster;
  empLoader: boolean = false;
  @Input() isSpinning: boolean = false;
  isOk: boolean = false;
  empID: any;
  @Input() HODPermissionID: any;
  employee: EmployeeMaster[] = [];
  hospitalData: HospitalMappingMaster = new HospitalMappingMaster();
  hospitalMapList: any = [];
  TREATEMENT_TYPE1 = false;
  TREATEMENT_TYPE2 = false;
  @Input() current = 0;
  hospitalList: any = [];
  empanneledHospitalMapList = [];
  nonEmpanneled: boolean = false;
  mobpattern = /^[6-9]\d{9}$/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  designationList: any = [];
  isAdmin: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) {}

  ngOnInit(): void {
    // this.allEmployeeList();
    this.allHospitalList();
    this.ListOfDesignation();
    this.loadOnlySelectedEmployee();
    this.ddoOfTheOfficialList();
    this.current = 0;
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
  }
  pageSize = 50;
  currentPage = 1;
  loading = false;
  filteredOptions: any = [];
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
              this.empLoader = false;
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
            this.designationList = [];
          }
        },
        (err) => {}
      );
  }
  filterEmpData(event: any) {
    this.empLoader = true;
    if (event != null) {
      this.api.getEmployeeMaster(0, 0, '', '', ' AND ID =' + event).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.empLoader = false;
            this.data.EMP_ID = data['data'][0]['ID'];
            this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
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
            this.data.CGHS_CARD_NO = '';
            this.data.CGHS_CARD_VALIDITY = '';
            this.data.BENEFICIARY_TYPE = '';
          }
        },
        (err) => {}
      );
    } else {
      this.empLoader = false;
      this.data.ID = null;
      this.data.OFFICE_NAME = '';
      this.data.DESIGNATION = '';
      this.data.DESIGNATION_ID = '';
      this.data.EMPLOYEE_CODE = '';
      this.data.LOCATION = '';
      this.data.DDO_OF_THE_OFFICIAL = '';
      this.data.DDO_OF_THE_OFFICIAL_ID = null;
      this.data.GRADE_PAY = '';
      this.data.EMAIL_ID = '';
      this.data.MOBILE_NO = '';
      this.data.ADDRESS = '';
      this.data.CGHS_CARD_NO = '';
      this.data.CGHS_CARD_VALIDITY = '';
      this.data.BENEFICIARY_TYPE = '';
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
          this.employee = [];
          this.tempCount = 0;
          this.filteredOptions = [];
        }
      },
      (err) => {}
    );
  }

  employeeSearch(event: any) {
    // this.procedureList2 = [];
    var f = '';
    if (
      event != null &&
      event != undefined &&
      event != '' &&
      event.target.value.length != 0
    ) {
      if (event.length >= 3) {
        this.api
          .getEmployeeMaster(
            0,
            0,
            '',
            'asc',
            " AND NAME like '%" +
              event +
              "%'" +
              " OR EMPLOYEE_CODE like '%" +
              event +
              "%'" +
              " OR OFFICE_NAME like '%" +
              event +
              "%'" +
              " OR DESIGNATION like '%" +
              event +
              "%'" +
              " OR DDO_OF_THE_OFFICIAL like '%" +
              event +
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
                // this.message.error("Can't Load Employee Data", '');
                // this.empLoader = false;
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
      // this.drawerData = Object.assign({}, this.editEmp);
      (this.empDrawerVisible = true);
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
              this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
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
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
          },
          (err) => {}
        );
    }
    // window.location.reload();
  }

  get closeCallback() {
    return this.empDrawerClose.bind(this);
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
  pressCS(event) {
    if (event == 'CS') {
      this.data.CGHS_CARD_VALIDITY = '';
      this.data.CGHS_CARD_NO = '';
    } else {
    }
  }

  relationshipFilter(event) {
    this.isSpinning = true;
    if (event == 'Self') {
      this.api
        .getEmployeeMaster(1, 1, '', '', ' AND ID = ' + this.data.EMP_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data.PATIENT_NAME = data['data'][0]['NAME'];
              this.isSpinning = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
      this.data.PATIENT_CGHS_BENEFICIERY_NO = this.data.CGHS_CARD_NO;
    } else {
      this.data.PATIENT_CGHS_BENEFICIERY_NO = '';
      this.data.PATIENT_NAME = '';
      this.isSpinning = false;
    }
  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.data.TREATMENT_START_DATE)
    ) < 0;

  disableBillDate() {
    this.disabledDate = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data.TREATMENT_START_DATE)
      ) < 0;
  }
  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.data.TREATMENT_START_DATE)
    ) < 0;

  treatEndDate() {
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.data.TREATMENT_START_DATE)
      ) < 0;
  }

  isAdvanceTaken(event: any) {
    if (event == false) {
      if (
        this.data.ADVANCE_AMOUNT != null ||
        this.data.ADVANCE_AMOUNT != undefined
      ) {
        this.data.ADVANCE_AMOUNT = null;
      } else {
        this.data.ADVANCE_AMOUNT = null;
      }
      if (
        this.data.ADVANCE_TAKEN_DATE != null ||
        this.data.ADVANCE_TAKEN_DATE != undefined
      ) {
        this.data.ADVANCE_TAKEN_DATE = null;
      } else {
        this.data.ADVANCE_TAKEN_DATE = null;
      }
    } else {
    }
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

  hospitalAddress(event: any) {
    this.api.getAllHospital(0, 0, '', '', ' AND ID = ' + event).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.hospitalData.ADDRESS = data['data'][0]['ADDRESS'];
          this.hospitalData.ACCREDATION = data['data'][0]['ACCREDITATION'];
        }
      },
      (err) => {}
    );
  }

  addHospital(addNew: boolean, hospitalFormReset: NgForm) {
    this.hospitalData.HOD_ID = this.HODPermissionID;
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
                    'desc',
                    ' AND HOD_ID = ' + this.HODPermissionID
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
                    'desc',
                    ' AND HOD_ID = ' + this.HODPermissionID
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

  resetDrawer(hospitalFormReset: NgForm) {
    this.hospitalData = new HospitalMappingMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    // hospitalFormReset.form.markAsPristine();
    // hospitalFormReset.form.markAsUntouched();
  }

  editHospital(data: any): void {
    // this.drawerTitle = 'Edit Claim Details';
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
            ' AND HOD_ID = ' + this.HODPermissionID
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
    // this.api.deleteHospitalMapping(data1)
  }
  cancel(): void {}

  onItemChecked(checked: boolean) {
    this.TREATEMENT_TYPE1 = checked;
    this.data.TREATEMENT_TYPE = '';
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == true) {
      this.data.TREATEMENT_TYPE = 'OT,IT';
    }
    if (this.TREATEMENT_TYPE1 == false && this.TREATEMENT_TYPE2 == true) {
      this.data.TREATEMENT_TYPE = 'IT';
    }
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == false) {
      this.data.TREATEMENT_TYPE = 'OT';
    }
  }

  onItemChecked2(checked: boolean) {
    this.TREATEMENT_TYPE2 = checked;
    this.data.TREATEMENT_TYPE = '';
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == true) {
      this.data.TREATEMENT_TYPE = 'OT,IT';
    }
    if (this.TREATEMENT_TYPE1 == false && this.TREATEMENT_TYPE2 == true) {
      this.data.TREATEMENT_TYPE = 'IT';
    }
    if (this.TREATEMENT_TYPE1 == true && this.TREATEMENT_TYPE2 == false) {
      this.data.TREATEMENT_TYPE = 'OT';
    }
  }

  pre(): void {
    if (this.current == 1) {
      this.isSpinning = true;
      // this.allEmployeeList();
      this.loadOnlySelectedEmployee();
      this.ListOfDesignation();
      this.ddoOfTheOfficialList();
      this.api
        .getHODPermissionMaster(
          0,
          0,
          '',
          '',
          ' AND ID =' + this.HODPermissionID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.current -= 1;
                // this.isSpinning = false;
              } else {
                this.data = data['data'][0];

                this.current -= 1;
                // this.isSpinning = false;
              }
            } else {
              this.message.error('Something Went Wrong', '');
              // this.isSpinning = false;
            }
            this.api
              .getHospitalMapping(
                0,
                0,
                '',
                'desc',
                ' AND HOD_ID = ' + this.HODPermissionID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.hospitalMapList = data['data'];
                    this.isSpinning = false;
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
  }

  next() {
    if (this.current == 0) {
      this.hospitalData = new HospitalMappingMaster();
      this.allHospitalList();
      this.isSpinning = true;
      this.api
        .getHODPermissionMaster(
          0,
          0,
          '',
          '',
          ' AND ID =' + this.HODPermissionID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                // this.billInTime()
                // this.empanelledHospital()
                this.data = new HODPermissionMaster();
                this.isSpinning = false;
              } else {
                this.data = data['data'][0];

                if (
                  this.data.TREATEMENT_TYPE == null ||
                  this.data.TREATEMENT_TYPE == '' ||
                  this.data.TREATEMENT_TYPE == undefined
                ) {
                  this.TREATEMENT_TYPE1 = false;
                  this.TREATEMENT_TYPE2 = false;
                }
                if (this.data.TREATEMENT_TYPE == 'IT') {
                  this.TREATEMENT_TYPE1 = false;
                  this.TREATEMENT_TYPE2 = true;
                }
                if (this.data.TREATEMENT_TYPE == 'OT') {
                  this.TREATEMENT_TYPE1 = true;
                  this.TREATEMENT_TYPE2 = false;
                }
                if (this.data.TREATEMENT_TYPE == 'OT,IT') {
                  this.TREATEMENT_TYPE1 = true;
                  this.TREATEMENT_TYPE2 = true;
                }
                // this.billInTime()
                // this.empanelledHospital();
                this.isSpinning = false;
              }
              this.api
                .getHospitalMapping(
                  0,
                  0,
                  '',
                  'desc',
                  ' AND HOD_ID = ' + this.HODPermissionID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.hospitalMapList = data['data'];
                      this.isSpinning = false;
                      this.current = 1;
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

  HODempSave(addNew: boolean): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.EMP_ID == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      // this.data.OFFICE_NAME == undefined &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&
      this.data.EMPLOYEE_CODE == undefined &&
      (this.data.GRADE_PAY == 0 || this.data.GRADE_PAY == undefined) &&
      this.data.BENEFICIARY_TYPE == ''
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
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Designation', '');
      // } else if (
      //   this.data.OFFICE_NAME == undefined ||
      //   this.data.OFFICE_NAME == null ||
      //   this.data.OFFICE_NAME == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Office Name', '');
    } else if (
      this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      this.data.DDO_OF_THE_OFFICIAL_ID == '' ||
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
      this.data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
      this.data.ROLE_ID = Number(sessionStorage.getItem('roleId'));
      // this.data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
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
          //   CLAIM_ID: this.HODPermissionID,
          //   MOBILE_NO: this.data.MOBILE_NO,
          //   EMAIL_ID: this.data.EMAIL_ID,
          //   STATUS: true,
          //   ADDRESS: this.data.ADDRESS,
          // };
          // if (
          //   (this.empID != undefined ||
          //     this.empID != null ||
          //     this.empID != '') &&
          //   this.empID == this.data.EMP_ID
          // ) {

          //   this.empAllDataForUpdate = {
          //     ID: this.empID,
          //     CLIENT_ID: 1,
          //     NAME: this.data.NAME,
          //     EMPLOYEE_CODE: this.data.EMPLOYEE_CODE,
          //     GRADE_PAY: this.data.GRADE_PAY,
          //     OFFICE_NAME: this.data.OFFICE_NAME,
          //     DESIGNATION: this.data.DESIGNATION,
          //     LOCATION: this.data.LOCATION,
          //     DDO_OF_THE_OFFICIAL: this.data.DDO_OF_THE_OFFICIAL,
          //     BENEFICIARY_TYPE: this.data.BENEFICIARY_TYPE,
          //     CGHS_CARD_NO: this.data.CGHS_CARD_NO,
          //     CGHS_CARD_VALIDITY: this.data.CGHS_CARD_VALIDITY,
          //     EMP_ID: this.empID,
          //     CLAIM_ID: this.HODPermissionID,
          //     MOBILE_NO: this.data.MOBILE_NO,
          //     EMAIL_ID: this.data.EMAIL_ID,
          //     STATUS: true,
          //     ADDRESS: this.data.ADDRESS,
          //     INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
          //   };
          // } else {
          //   // this.HODPermissionID = null;

          //   this.empAllDataForUpdate = {
          //     ID: this.data.ID,
          //     CLIENT_ID: 1,
          //     NAME: this.data.NAME,
          //     EMPLOYEE_CODE: this.data.EMPLOYEE_CODE,
          //     GRADE_PAY: this.data.GRADE_PAY,
          //     OFFICE_NAME: this.data.OFFICE_NAME,
          //     DESIGNATION: this.data.DESIGNATION,
          //     LOCATION: this.data.LOCATION,
          //     DDO_OF_THE_OFFICIAL: this.data.DDO_OF_THE_OFFICIAL,
          //     BENEFICIARY_TYPE: this.data.BENEFICIARY_TYPE,
          //     CGHS_CARD_NO: this.data.CGHS_CARD_NO,
          //     CGHS_CARD_VALIDITY: this.data.CGHS_CARD_VALIDITY,
          //     EMP_ID: this.data.ID,
          //     CLAIM_ID: null,
          //     MOBILE_NO: this.data.MOBILE_NO,
          //     EMAIL_ID: this.data.EMAIL_ID,
          //     STATUS: true,
          //     ADDRESS: this.data.ADDRESS,
          //     INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
          //   };
          // }
          // this.data['CLAIM_ID'] = this.HODPermissionID;
          this.api.updateHODPermission(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Saved Successfully...', '');
              // this.api.updateclaimed(this.data).subscribe((successCode) => {
              // if (successCode.code == '200') {
              //   this.message.success(
              //     'Information Saved Successfully...',
              //     ''
              //   );
              this.HODPermissionID = successCode.HOD_ID;
              // claimMasterPage.form.reset();
              // claimMasterPage.form.markAsPristine();
              // claimMasterPage.form.markAsUntouched();
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
          this.data.HOD_CREATED_DATETIME = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          );
          this.api.createHODPermission(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              this.HODPermissionID = successCode.HOD_ID;
              // claimMasterPage.form.reset();
              // claimMasterPage.form.markAsPristine();
              // claimMasterPage.form.markAsUntouched();
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
  claimSave(addNew: boolean): void {
    this.data.EMP_ID = this.data.EMP_ID;
    // this.data.hospitalData = this.hospitalMapList;
    // this.data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
    // for (var i = 0; this.hospitalMapList.length > i; i++) {
    //   this.hospitalMapList[i]['ID'] = undefined;
    //   this.hospitalMapList[i]['HOD_ID'] = undefined;
    // }
    // this.data.hospitalData = this.hospitalMapList;

    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.RELATION_WITH_PATIENT == undefined &&
      this.data.PATIENT_NAME == undefined &&
      this.data.PATIENT_CGHS_BENEFICIERY_NO == undefined &&
      this.data.NATURE_OF_TREATMENT == undefined &&
      this.data.BILL_FILIING_DATE == undefined &&
      this.data.TREATMENT_START_DATE == undefined &&
      this.data.TREATMENT_END_DATE == undefined &&
      this.data.OPD_TREATEMENT_AMOUNT == undefined &&
      this.data.INDOOR_TREATEMENT_AMOUNT == undefined &&
      this.data.TEST_OR_INVESTIGATION_AMOUNT == undefined
      // this.data.hospitalData.length == 0
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.RELATION_WITH_PATIENT == undefined ||
      this.data.RELATION_WITH_PATIENT == null ||
      this.data.RELATION_WITH_PATIENT == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Relationship with Applicant', '');
    } else if (
      this.data.PATIENT_NAME == undefined ||
      this.data.PATIENT_NAME == null ||
      this.data.PATIENT_NAME == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Patient Name', '');
    } else if (
      this.data.BENEFICIARY_TYPE == 'CG' &&
      (this.data.PATIENT_CGHS_BENEFICIERY_NO == undefined ||
        this.data.PATIENT_CGHS_BENEFICIERY_NO == null ||
        this.data.PATIENT_CGHS_BENEFICIERY_NO == '')
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Patient CGHS Beneficiary Number', '');
    } else if (
      this.data.NATURE_OF_TREATMENT == undefined ||
      this.data.NATURE_OF_TREATMENT == null ||
      this.data.NATURE_OF_TREATMENT == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Nature Of Treatment/Test', '');
    } else if (
      this.data.BILL_FILIING_DATE == undefined ||
      this.data.BILL_FILIING_DATE == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Bill Filling Date', '');
    } else if (
      this.data.TREATMENT_START_DATE == undefined ||
      this.data.TREATMENT_START_DATE == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Treatment Start Date', '');
    } else if (
      this.data.TREATMENT_END_DATE == undefined ||
      this.data.TREATMENT_END_DATE == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Treatment End Date', '');
    } else if (
      this.data.OPD_TREATEMENT_AMOUNT === undefined ||
      this.data.OPD_TREATEMENT_AMOUNT === null ||
      this.data.OPD_TREATEMENT_AMOUNT === ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter OPD Treatment Amount', '');
    } else if (
      this.data.INDOOR_TREATEMENT_AMOUNT === undefined ||
      this.data.INDOOR_TREATEMENT_AMOUNT === null ||
      this.data.INDOOR_TREATEMENT_AMOUNT === ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Indoor Treatment Amount', '');
    } else if (
      this.data.TEST_OR_INVESTIGATION_AMOUNT === undefined ||
      this.data.TEST_OR_INVESTIGATION_AMOUNT === null ||
      this.data.TEST_OR_INVESTIGATION_AMOUNT === ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Test/Investigation Amount', '');

      // }
      // else if (
      //   this.data.IS_ADVANCE_TAKEN == true &&
      //   (this.data.ADVANCE_AMOUNT == undefined ||
      //     this.data.ADVANCE_AMOUNT == null ||
      //     this.data.ADVANCE_AMOUNT == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Advance Amount.', '');
      // } else if (
      //   this.data.IS_ADVANCE_TAKEN == true &&
      //   (this.data.ADVANCE_TAKEN_DATE == undefined ||
      //     this.data.ADVANCE_TAKEN_DATE == null)
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Date Of Advance Taken.  ', '');
    } else if (this.hospitalMapList.length == 0) {
      this.isOk = false;
      this.message.error('Please Add Hospital ', '');
      // }
      //  else if (
      //   this.data.HOSPITAL_TYPE == undefined ||
      //   this.data.HOSPITAL_TYPE == null ||
      //   this.data.HOSPITAL_TYPE == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Select Hospital Type', '');
      // } else if (
      //   this.data.HOSPITAL_TYPE == 'E' &&
      //   (this.data.HOSPITAL_ID == undefined ||
      //     this.data.HOSPITAL_ID == null ||
      //     this.data.HOSPITAL_ID == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Select Hospital Name.', '');
      // } else if (
      //   this.data.HOSPITAL_TYPE == 'E' &&
      //   (this.data.HOSPITAL_ADDRESS == undefined ||
      //     this.data.HOSPITAL_ADDRESS == null ||
      //     this.data.HOSPITAL_ADDRESS == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Hospital Address.', '');
      // } else if (
      //   (this.data.HOSPITAL_TYPE == 'NE' || this.data.HOSPITAL_TYPE == 'G') &&
      //   (this.data.HOSPITAL_NAME == undefined ||
      //     this.data.HOSPITAL_NAME == null ||
      //     this.data.HOSPITAL_NAME == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Hospital Name.  ', '');
      // } else if (
      //   (this.data.HOSPITAL_TYPE == 'NE' || this.data.HOSPITAL_TYPE == 'G') &&
      //   (this.data.HOSPITAL_ADDRESS == undefined ||
      //     this.data.HOSPITAL_ADDRESS == null ||
      //     this.data.HOSPITAL_ADDRESS == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Hospital Address. ', '');
      // } else if (
      //   (this.data.HOSPITAL_TYPE == 'NE' || this.data.HOSPITAL_TYPE == 'G') &&
      //   (this.data.CLAIM_ACCREDITATION == undefined ||
      //     this.data.CLAIM_ACCREDITATION == null ||
      //     this.data.CLAIM_ACCREDITATION == '')
      // ) {
      //   this.isOk = false;
      //   this.message.error('Please Select Accredition.  ', '');
    }
    if (this.isOk) {
      this.data['HOD_ID'] = this.HODPermissionID;
      this.isSpinning = true;
      if (
        this.data.TREATMENT_START_DATE != undefined &&
        this.data.TREATMENT_START_DATE != null &&
        this.data.TREATMENT_START_DATE != ''
      ) {
        this.data.TREATMENT_START_DATE = this.datepipe.transform(
          this.data.TREATMENT_START_DATE,
          'yyyy-MM-dd'
        );
      }
      // this.data.TREATMENT_START_DATE = this.datepipe.transform(
      //   this.data.TREATMENT_START_DATE,
      //   'yyyy-MM-dd'
      // );
      if (
        this.data.TREATMENT_END_DATE != undefined &&
        this.data.TREATMENT_END_DATE != null &&
        this.data.TREATMENT_END_DATE != ''
      ) {
        this.data.TREATMENT_END_DATE = this.datepipe.transform(
          this.data.TREATMENT_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data.BILL_FILIING_DATE != undefined &&
        this.data.BILL_FILIING_DATE != null &&
        this.data.BILL_FILIING_DATE != ''
      ) {
        this.data.BILL_FILIING_DATE = this.datepipe.transform(
          this.data.BILL_FILIING_DATE,
          'yyyy-MM-dd'
        );
      }
      // this.data.BILL_FILIING_DATE = this.datepipe.transform(
      //   this.data.BILL_FILIING_DATE,
      //   'yyyy-MM-dd'
      // );

      if (
        this.data.ADVANCE_TAKEN_DATE != undefined &&
        this.data.ADVANCE_TAKEN_DATE != null &&
        this.data.ADVANCE_TAKEN_DATE != ''
      ) {
        this.data.ADVANCE_TAKEN_DATE = this.datepipe.transform(
          this.data.ADVANCE_TAKEN_DATE,
          'yyyy-MM-dd'
        );
      }
      // this.data.ADVANCE_TAKEN_DATE = this.datepipe.transform(
      //   this.data.ADVANCE_TAKEN_DATE,
      //   'yyyy-MM-dd'
      // );

      // var date1: any = new Date(this.data.TREATMENT_END_DATE);
      // var date2: any = new Date(this.data.BILL_FILIING_DATE);
      // this.diffDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)) + 1;

      // // this.data.DELAY_CONDELENCE_DIFFERENCE = this.diffDays;
      // var advance;
      // if (this.data.IS_ADVANCE_TAKEN == true) {
      //   advance = 1;

      // } else {
      //   advance = 0;

      // }
      // if (advance == 1 && this.diffDays <= 30) {
      //   this.data3.BILL_FILLED_INTIME = true;
      // } else if (advance == 1 && this.diffDays > 30) {
      //   this.data3.BILL_FILLED_INTIME = false;
      // } else if (advance == 0 && this.diffDays > 182) {
      //   this.data3.BILL_FILLED_INTIME = false;
      // } else {
      //   this.data3.BILL_FILLED_INTIME = true;
      // }

      // if (this.data.HOSPITAL_TYPE == 'E') {
      //   this.data.HOSPITAL_NAME = '';
      // } else {
      //   this.data.HOSPITAL_NAME = this.data.HOSPITAL_NAME;
      // }

      // if(this.data.HOSPITAL_TYPE == 'E' && (this.data.HOSPITAL_ADDRESS != undefined || this.data.HOSPITAL_ADDRESS != null
      //   || this.data.HOSPITAL_ADDRESS != '' || this.data.HOSPITAL_ADDRESS.trim() != '' )){
      //     this.data.HOSPITAL_ADDRESS = ''
      //   } else{
      //     this.data.HOSPITAL_ADDRESS = this.data.HOSPITAL_ADDRESS
      //   }

      // if (
      //   this.data.HOSPITAL_TYPE == 'E' &&
      //   (this.data.CLAIM_ACCREDITATION != undefined ||
      //     this.data.CLAIM_ACCREDITATION != null ||
      //     this.data.CLAIM_ACCREDITATION != '' ||
      //     this.data.CLAIM_ACCREDITATION.trim() != '')
      // ) {
      //   this.data.CLAIM_ACCREDITATION = '';
      // } else {
      //   this.data.CLAIM_ACCREDITATION = this.data.CLAIM_ACCREDITATION;
      // }

      // if (
      //   (this.data.HOSPITAL_TYPE == 'NE' || this.data.HOSPITAL_TYPE == 'G') &&
      //   (this.data.HOSPITAL_ID != undefined ||
      //     this.data.HOSPITAL_ID != null ||
      //     this.data.HOSPITAL_ID != '' ||
      //     this.data.HOSPITAL_ID.trim() != '')
      // ) {
      //   this.data.HOSPITAL_ID = '';
      // } else {
      //   this.data.HOSPITAL_ID = this.data.HOSPITAL_ID;
      // }

      {
        if (this.data.ID) {
          // if (
          //   (this.currentStageID != undefined ||
          //     this.currentStageID != null ||
          //     this.currentStageID != '') &&
          //   this.currentStageID > 3
          // ) {
          //   this.data.CURRENT_STAGE_ID = this.data.CURRENT_STAGE_ID;
          // } else {
          //   this.data.CURRENT_STAGE_ID = 3;
          // }
          this.api.updateHODPermission(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              // this.billInTime();
              // this.empanelledHospital();
              // this.next();
              // if (!addNew)
              this.drawerClose();
              this.current = 0;
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.data.HOD_CREATED_DATETIME = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          );
          this.api.createHODPermission(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              // this.HODPermissionID = successCode.EMPLOYEE

              // this.billInTime();
              // this.empanelledHospital();
              // this.next();

              // if (!addNew)
              this.drawerClose();
              this.current = 0;
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
  close(): void {
    this.current = 0;
    this.hospitalData.TYPE = '';
    this.hospitalData.HOSPITAL_ID = '';
    this.hospitalData.NAME = '';
    this.hospitalData.ADDRESS = '';
    this.hospitalData.ACCREDATION = '';
    this.drawerClose();
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
        this.paysliplatterurl = url;
        if (this.data.PAYSLIP != undefined && this.data.PAYSLIP.trim() != '') {
          var arr = this.data.PAYSLIP.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.PAYSLIP = this.urllink3;
      this.progressBar3 = true;
      this.timer3 = this.api
        .onUpload2('paySlipMedical', this.paysliplatter, this.paysliplatterurl)
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
            this.data.PAYSLIP = this.paysliplatterurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar3 = false;
            this.percent3 = 0;
            this.data.PAYSLIP = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.paysliplatter = null;
      this.data.PAYSLIP = null;
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
    this.data.PAYSLIP = null;
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
          this.data.SELF_BANK_DETAILS != undefined &&
          this.data.SELF_BANK_DETAILS.trim() != ''
        ) {
          var arr = this.data.SELF_BANK_DETAILS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.SELF_BANK_DETAILS = this.urllink3;
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
            this.data.SELF_BANK_DETAILS = this.SelfBankDetailsurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarSelfBankDetails = false;
            this.percentSelfBankDetails = 0;
            this.data.SELF_BANK_DETAILS = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.SelfBankDetails = null;
      this.data.SELF_BANK_DETAILS = null;
      this.isSpinning = false;
    }
  }

  viewSelfBankDetails(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'selfBankDetails/' + pdfURL);
  }

  clearSelfBankDetails(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarSelfBankDetails = false;
    this.percentSelfBankDetails = 0;
    this.data.SELF_BANK_DETAILS = null;
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
          this.data.HOSPITAL_ORIGINAL_BILL != undefined &&
          this.data.HOSPITAL_ORIGINAL_BILL.trim() != ''
        ) {
          var arr = this.data.HOSPITAL_ORIGINAL_BILL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.HOSPITAL_ORIGINAL_BILL = this.urllink3;
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
            this.data.HOSPITAL_ORIGINAL_BILL = this.OriginalHospitalBillurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarOriginalHospitalBill = false;
            this.percentOriginalHospitalBill = 0;
            this.data.HOSPITAL_ORIGINAL_BILL = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.OriginalHospitalBill = null;
      this.data.HOSPITAL_ORIGINAL_BILL = null;
      this.isSpinning = false;
    }
  }

  viewOriginalHospitalBill(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'originalHospitalBill/' + pdfURL);
  }

  clearOriginalHospitalBill(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarOriginalHospitalBill = false;
    this.percentOriginalHospitalBill = 0;
    this.data.HOSPITAL_ORIGINAL_BILL = null;
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
          this.data.HOSPITAL_DISCHARGE_CARD != undefined &&
          this.data.HOSPITAL_DISCHARGE_CARD.trim() != ''
        ) {
          var arr = this.data.HOSPITAL_DISCHARGE_CARD.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.HOSPITAL_DISCHARGE_CARD = this.urllink3;
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
            this.data.HOSPITAL_DISCHARGE_CARD = this.HospitalDischargeCardurl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarHospitalDischargeCard = false;
            this.percentHospitalDischargeCard = 0;
            this.data.HOSPITAL_DISCHARGE_CARD = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.HospitalDischargeCard = null;
      this.data.HOSPITAL_DISCHARGE_CARD = null;
      this.isSpinning = false;
    }
  }

  viewHospitalDischargeCard(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'hospitalDischargeCard/' + pdfURL);
  }

  clearHospitalDischargeCard(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarHospitalDischargeCard = false;
    this.percentHospitalDischargeCard = 0;
    this.data.HOSPITAL_DISCHARGE_CARD = null;
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
          this.data.OTHER_DOCUMENT != undefined &&
          this.data.OTHER_DOCUMENT.trim() != ''
        ) {
          var arr = this.data.OTHER_DOCUMENT.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.OTHER_DOCUMENT = this.urllink3;
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
            this.data.OTHER_DOCUMENT = this.otherDocumenturl;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarOtherDocument = false;
            this.percentOtherDocument = 0;
            this.data.OTHER_DOCUMENT = null;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.otherDocument = null;
      this.data.OTHER_DOCUMENT = null;
      this.isSpinning = false;
    }
  }

  viewOtherDocument(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'otherDocument/' + pdfURL);
  }

  clearOtherDocument(url: any, folder: any) {
    // var datadelete = folder + '/' + url;
    // this.api.deletealluploadsgrass(datadelete).subscribe(
    //   (successCode) => {
    //     if (successCode['code'] == 200) {
    this.progressBarOtherDocument = false;
    this.percentOtherDocument = 0;
    this.data.OTHER_DOCUMENT = null;
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
