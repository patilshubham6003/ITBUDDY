import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeQuarterFormsMaster } from 'src/app/Modal/employeeQuarterForm';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-edit-quarter-apllication',
  templateUrl: './edit-quarter-apllication.component.html',
  styleUrls: ['./edit-quarter-apllication.component.css'],
  providers: [DatePipe],
})
export class EditQuarterApllicationComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: EmployeeQuarterFormsMaster;
  isSpinning: boolean = false;
  @Input()
  checkItsView: boolean = false;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobilepattern = /^[6-9]\d{9}$/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  date: any;
  ResidenceType: any = [];
  Designationtypes: any = [];
  concatenatedRateIds: string;
  RateseparatedIds: number[];
  dataList: any = [];
  isOk: boolean = true;
  flatslist: any = [];
  floordata: any = [];
  loadForms: boolean = false;
  loadDesignation: boolean = false;
  loadGradelevel: boolean = false;
  ResidenceType111: any = [];

  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.getGradepay();
    this.getDesignation();
    const today = new Date();
    if (this.data.DOB == null || this.data.DOB == undefined) {
      this.date = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
    }
  }
  close(): void {
    this.drawerClose();
  }
  getGradepay() {
    this.loadGradelevel = true;
    this.api.getgradepaylevel(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          if (this.data != undefined) {
            if (this.data.GRAD_PAY_LEVEL_ID == 0) {
              this.data.GRAD_PAY_LEVEL_ID = null;
            } else {
            }
          }
          this.loadGradelevel = false;
        } else {
          this.loadGradelevel = false;
          this.ResidenceType = [];
        }
      },
      (err) => {
        this.loadGradelevel = false;
        this.ResidenceType = [];
      }
    );

    this.api.getResidenceforuser(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
        }
      },
      (err) => { }
    );
  }
  getDesignation() {
    this.loadDesignation = true;
    this.api
      .getDesignation(0, 0, 'SEQUENCE_NO', 'desc', ' AND STATUS = 1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Designationtypes = data['data'];
            this.loadDesignation = false;
          } else {
            this.Designationtypes = [];
            this.loadDesignation = false;
          }
        },
        (err) => {
          this.Designationtypes = [];
          this.loadDesignation = false;
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

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      current >
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };

  save(addNew: boolean): void {
    var isOk = true;
    if (
      this.data.EMPLOYEE_NAME == undefined ||
      this.data.EMPLOYEE_NAME == null ||
      this.data.EMPLOYEE_NAME.trim() == ''
    ) {
      this.message.error('Please Enter Name', '');
      this.isOk = false;
    } else if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Designation', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null ||
      this.data.MOBILE_NO <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile Number', '');
    } else if (!this.mobilepattern.test(this.data.MOBILE_NO.toString())) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile No.', '');
    } else if (
      this.data.DOB == undefined ||
      this.data.DOB == null ||
      this.data.DOB == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Date Of Birth  ', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Employee Code', '');
    } else if (
      this.data.CAST == undefined ||
      this.data.CAST == null ||
      this.data.CAST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Caste  ', '');
    } else if (
      this.data.GENDER == undefined ||
      this.data.GENDER == null ||
      this.data.GENDER == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Your Gender', '');
    } else if (
      this.data.GRAD_PAY_LEVEL_ID == undefined ||
      this.data.GRAD_PAY_LEVEL_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Grade Pay Level', '');
    } else if (
      this.data.BASIC_PAY == undefined ||
      this.data.BASIC_PAY == null ||
      this.data.BASIC_PAY <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Basic Pay', '');
    } else if (
      this.data.JOINING_DATE == undefined ||
      this.data.JOINING_DATE == null ||
      this.data.JOINING_DATE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Date Of Joining  ', '');
    } else if (
      this.data.FLOOR_ID == undefined ||
      this.data.FLOOR_ID == null ||
      this.data.FLOOR_ID.trim() == ''
    ) {
      this.message.error('Please Enter Floor Name', '');
      this.isOk = false;
    } else if (
      this.data.FLAT_ID == undefined ||
      this.data.FLAT_ID == null ||
      this.data.FLAT_ID.trim() == ''
    ) {
      this.message.error('Please Enter Quarter Name', '');
      this.isOk = false;
    } else if (
      this.data.CIVIL_LIST == undefined ||
      this.data.CIVIL_LIST == null ||
      this.data.CIVIL_LIST == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Civil List No.', '');
    } else if (
      this.data.APPLIED_RESIDENCE_TYPE_ID == null ||
      this.data.APPLIED_RESIDENCE_TYPE_ID == undefined ||
      this.data.APPLIED_RESIDENCE_TYPE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Applied Residence Type', '');
    } else if (
      this.data.RESIDENCE_TYPE_ID == null ||
      this.data.RESIDENCE_TYPE_ID == undefined ||
      this.data.RESIDENCE_TYPE_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Residence Type', '');
    } else if (
      (this.data.PRESENT_PAY_LEVEL_DATE == undefined ||
        this.data.PRESENT_PAY_LEVEL_DATE == null ||
        this.data.PRESENT_PAY_LEVEL_DATE == '') && this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
        (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
        this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))) {
      this.isOk = false;
      this.message.error('Please Select Present Pay Level Date', '');
    } else if (
      (this.data.ALLOTMENT_DATE_TIME == undefined ||
        this.data.ALLOTMENT_DATE_TIME == null ||
        this.data.ALLOTMENT_DATE_TIME == '') && this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
        (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
        this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))) {
      this.isOk = false;
      this.message.error('Please Select Allotment Date', '');
    } else if (
      (this.data.DATE_OF_PRIORITY == undefined ||
        this.data.DATE_OF_PRIORITY == null ||
        this.data.DATE_OF_PRIORITY == '') && this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
        (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
        this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))) {
      this.isOk = false;
      this.message.error('Please Select Date Of Priority', '');
    } else if (
      (this.data.RETIREMENT_DATE == undefined ||
        this.data.RETIREMENT_DATE == null ||
        this.data.RETIREMENT_DATE == '') && this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
        (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
        this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))) {
      this.isOk = false;
      this.message.error('Please Select Retirement Date', '');
    } else if (
      this.data.OCCUPANCY_TYPE == undefined ||
      this.data.OCCUPANCY_TYPE == null ||
      this.data.OCCUPANCY_TYPE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Occupancy Type', '');
    } else if (
      this.data.CHECK_CONDITION == undefined ||
      this.data.CHECK_CONDITION == null ||
      this.data.CHECK_CONDITION <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Allotment Time', '');
    }
    if (this.isOk) {
      this.loadForms = true;
      if (
        (this.data.RETIREMENT_DATE != null &&
          this.data.RETIREMENT_DATE != undefined &&
          this.data.RETIREMENT_DATE != '') && this.data.RESIDENCE_TYPE_ID != undefined &&
        this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
          (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
          this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))
      ) {
        this.data.RETIREMENT_DATE = this.datePipe.transform(
          this.data.RETIREMENT_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.data.RETIREMENT_DATE = null;
      }
      if (
        (this.data.DATE_OF_PRIORITY != null &&
          this.data.DATE_OF_PRIORITY != undefined &&
          this.data.DATE_OF_PRIORITY != '') && this.data.RESIDENCE_TYPE_ID != undefined &&
        this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
          (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
          this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))
      ) {
        this.data.DATE_OF_PRIORITY = this.datePipe.transform(
          this.data.DATE_OF_PRIORITY,
          'yyyy-MM-dd'
        );
      } else {
        this.data.DATE_OF_PRIORITY = null
      }
      if (
        (this.data.ALLOTMENT_DATE_TIME != null &&
          this.data.ALLOTMENT_DATE_TIME != undefined &&
          this.data.ALLOTMENT_DATE_TIME != '') && this.data.RESIDENCE_TYPE_ID != undefined &&
        this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
          (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
          this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))
      ) {
        this.data.ALLOTMENT_DATE_TIME = this.datePipe.transform(
          this.data.ALLOTMENT_DATE_TIME,
          'yyyy-MM-dd'
        );
      } else {
        this.data.ALLOTMENT_DATE_TIME = null;
      }
      if (
        (this.data.PRESENT_PAY_LEVEL_DATE != null &&
          this.data.PRESENT_PAY_LEVEL_DATE != undefined &&
          this.data.PRESENT_PAY_LEVEL_DATE != '') && this.data.RESIDENCE_TYPE_ID != undefined &&
        this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
          (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
          this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))
      ) {
        this.data.PRESENT_PAY_LEVEL_DATE = this.datePipe.transform(
          this.data.PRESENT_PAY_LEVEL_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.data.PRESENT_PAY_LEVEL_DATE = null;
      }
      if (
        this.data.JOINING_DATE != null &&
        this.data.JOINING_DATE != undefined &&
        this.data.JOINING_DATE != ''
      ) {
        this.data.JOINING_DATE = this.datePipe.transform(
          this.data.JOINING_DATE,
          'yyyy-MM-dd'
        );
      }
      if (
        this.data.DOB != null &&
        this.data.DOB != undefined &&
        this.data.DOB != ''
      ) {
        this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');
      }
      this.isSpinning = true;
      this.data.STATUS = 'A';
      this.RateseparatedIds = this.data.APPLIED_RESIDENCE_TYPE_ID;
      this.concatenatedRateIds = this.RateseparatedIds.join(',');
      this.data.APPLIED_RESIDENCE_TYPE_ID = this.concatenatedRateIds;
      if (this.data.ID) {
        this.api.updatequarterallotmentData(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success(
                'Employee Quarter Details Approved Successfully',
                ''
              );
              this.drawerClose();
              this.isSpinning = false;
              this.loadForms = false;
            } else {
              this.message.error(
                'Failed To Approve Employee Quarter Details',
                ''
              );
              this.isSpinning = false;
              this.loadForms = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong, Please Try Again', '');
            this.isSpinning = false;
            this.loadForms = false;
          }
        );
      } else {
        this.data.CLIENT_ID = 1;
        this.api.CreatequarterallotmentData(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success(
                'Employee Quarter Details Created Successfully',
                ''
              );
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new EmployeeQuarterFormsMaster();
              }
              this.isSpinning = false;
              this.loadForms = false;
            } else {
              this.message.error(
                'Failed To Submit Employee Quarter Details',
                ''
              );
              this.isSpinning = false;
              this.loadForms = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong, Please Try Again', '');
            this.isSpinning = false;
            this.loadForms = false;
          }
        );
      }
    }
  }
}