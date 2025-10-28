import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeQuarterFormsMaster } from 'src/app/Modal/employeeQuarterForm';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-employee-quarter-details-form',
  templateUrl: './employee-quarter-details-form.component.html',
  styleUrls: ['./employee-quarter-details-form.component.css'],
  providers: [DatePipe],
})
export class EmployeeQuarterDetailsFormComponent implements OnInit {
  data: EmployeeQuarterFormsMaster = new EmployeeQuarterFormsMaster();
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobilepattern = /^[6-9]\d{9}$/;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  date: any;
  isSpinning: boolean = false;
  ResidenceType: any = [];
  ResidenceType111: any = [];
  concatenatedRateIds: string;
  RateseparatedIds: number[];
  Designationtypes: any = [];
  dataList: any = [];
  isOk: boolean = true;
  flatslist: any = [];
  floordata: any = [];
  loadForms: boolean = false;
  loadDesignation: boolean = false;
  loadGradelevel: boolean = false;
  BuildingId: any;
  CaretakerId: any;
  @ViewChild('formsubmitedsuccessfully') formsubmitedsuccessfully: ElementRef;

  constructor(
    private api: WebsiteService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    public activeRoute: ActivatedRoute
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
    this.activeRoute.queryParams.subscribe((params) => {
      var buildingIdParam = params['building_id'];
      var caretakerIdParam = params['caretaker_id'];

      if (buildingIdParam) {
        var parts = buildingIdParam.split('_');
        this.BuildingId = parts[1];
      }
      if (caretakerIdParam) {
        var parts1 = caretakerIdParam.split('_');
        this.CaretakerId = parts1[1];
      }
    });
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
  getGradepay() {
    this.loadGradelevel = true;
    this.api.getgradepaylevel(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
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

    this.api.getResidenceforuser(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
        }
      },
      (err) => { }
    );
  }
  parseDate(input: string): Date | null {
    const parts = input.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    return null;
  }

  parsePastedDate(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedDate = event.clipboardData?.getData('text');
    if (pastedDate) {
      const parsedDate = this.parseDate(pastedDate);
      if (parsedDate) {
        this.data.DOB = parsedDate;
      } else {
        this.data.DOB = null;
      }
    }
  }
  parsePastedDate1(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedDate = event.clipboardData?.getData('text');
    if (pastedDate) {
      const parsedDate = this.parseDate(pastedDate);
      if (parsedDate) {
        this.data.JOINING_DATE = parsedDate;
      } else {
        this.data.JOINING_DATE = null;
      }
    }
  }
  parsePastedDate2(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedDate = event.clipboardData?.getData('text');
    if (pastedDate) {
      const parsedDate = this.parseDate(pastedDate);
      if (parsedDate) {
        this.data.PRESENT_PAY_LEVEL_DATE = parsedDate;
      } else {
        this.data.PRESENT_PAY_LEVEL_DATE = null;
      }
    }
  }
  parsePastedDate3(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedDate = event.clipboardData?.getData('text');
    if (pastedDate) {
      const parsedDate = this.parseDate(pastedDate);
      if (parsedDate) {
        this.data.ALLOTMENT_DATE_TIME = parsedDate;
      } else {
        this.data.ALLOTMENT_DATE_TIME = null;
      }
    }
  }
  parsePastedDate4(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedDate = event.clipboardData?.getData('text');
    if (pastedDate) {
      const parsedDate = this.parseDate(pastedDate);
      if (parsedDate) {
        this.data.DATE_OF_PRIORITY = parsedDate;
      } else {
        this.data.DATE_OF_PRIORITY = null;
      }
    }
  }
  parsePastedDate5(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedDate = event.clipboardData?.getData('text');
    if (pastedDate) {
      const parsedDate = this.parseDate(pastedDate);
      if (parsedDate) {
        this.data.RETIREMENT_DATE = parsedDate;
      } else {
        this.data.RETIREMENT_DATE = null;
      }
    }
  }

  parseDate1(input: string): Date | null {
    const parts = input.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      var year = parts[2];
      if (year.length === 4) {
        if (!isNaN(Number(year)) && !isNaN(month) && !isNaN(day)) {
          const parsedDate = new Date(Number(year), month, day);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
          }
        }
      }

    }
    return null;
  }
  onDateInputChange(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    if (inputDate) {
      const parsedDate = this.parseDate1(inputDate);
      if (parsedDate) {
        this.data.DOB = parsedDate;
      } else {
        this.data.DOB = null;
      }
    }
  }
  onDateInputChange1(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    if (inputDate) {
      const parsedDate = this.parseDate1(inputDate);
      if (parsedDate) {
        this.data.JOINING_DATE = parsedDate;
      } else {
        this.data.JOINING_DATE = null;
      }
    }
  }
  onDateInputChange2(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    if (inputDate) {
      const parsedDate = this.parseDate1(inputDate);
      if (parsedDate) {
        this.data.PRESENT_PAY_LEVEL_DATE = parsedDate;
      } else {
        this.data.PRESENT_PAY_LEVEL_DATE = null;
      }
    }
  }
  onDateInputChange3(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    if (inputDate) {
      const parsedDate = this.parseDate1(inputDate);
      if (parsedDate) {
        this.data.ALLOTMENT_DATE_TIME = parsedDate;
      } else {
        this.data.ALLOTMENT_DATE_TIME = null;
      }
    }
  }
  onDateInputChange4(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    if (inputDate) {
      const parsedDate = this.parseDate1(inputDate);
      if (parsedDate) {
        this.data.DATE_OF_PRIORITY = parsedDate;
      } else {
        this.data.DATE_OF_PRIORITY = null;
      }
    }
  }
  onDateInputChange5(event: Event): void {
    const inputDate = (event.target as HTMLInputElement).value;
    if (inputDate) {
      const parsedDate = this.parseDate1(inputDate);
      if (parsedDate) {
        this.data.RETIREMENT_DATE = parsedDate;
      } else {
        this.data.RETIREMENT_DATE = null;
      }
    }
  }

  isResidenceTypeValid(): boolean {
    if (
      (this.data.RESIDENCE_TYPE_ID != undefined && this.data.RESIDENCE_TYPE_ID != null) && (this.data.APPLIED_RESIDENCE_TYPE_ID != undefined &&
        Array.isArray(this.data.APPLIED_RESIDENCE_TYPE_ID) &&
        this.data.APPLIED_RESIDENCE_TYPE_ID.length > 0)
    ) {
      const isValidResidenceTypeID =
        this.data.RESIDENCE_TYPE_ID != 1 &&
        this.data.RESIDENCE_TYPE_ID != 2 &&
        this.data.RESIDENCE_TYPE_ID != 3 &&
        this.data.RESIDENCE_TYPE_ID != 4;
      const isAppliedResidenceTypeIDValid = this.data.APPLIED_RESIDENCE_TYPE_ID.some(
        id => ![1, 2, 3, 4].includes(id)
      );
      return isValidResidenceTypeID || isAppliedResidenceTypeIDValid;
    }
    return false;
  }

  save(): void {
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
    } else
      if (
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
      } else {
        this.loadForms = true;
        if (
          (this.data.RETIREMENT_DATE != null &&
            this.data.RETIREMENT_DATE != undefined &&
            this.data.RETIREMENT_DATE != '') && this.data.RESIDENCE_TYPE_ID != undefined &&
          this.data.APPLIED_RESIDENCE_TYPE_ID != undefined && (
            (this.data.RESIDENCE_TYPE_ID != 1 && this.data.RESIDENCE_TYPE_ID != 2 && this.data.RESIDENCE_TYPE_ID != 3 && this.data.RESIDENCE_TYPE_ID != 4) ||
            this.data.APPLIED_RESIDENCE_TYPE_ID.some(id => ![1, 2, 3, 4].includes(id)))
        ) {
          this.data.RETIREMENT_DATE = this.datepipe.transform(
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
          this.data.DATE_OF_PRIORITY = this.datepipe.transform(
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
          this.data.ALLOTMENT_DATE_TIME = this.datepipe.transform(
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
          this.data.PRESENT_PAY_LEVEL_DATE = this.datepipe.transform(
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
          this.data.JOINING_DATE = this.datepipe.transform(
            this.data.JOINING_DATE,
            'yyyy-MM-dd'
          );
        } else {
          this.data.JOINING_DATE = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd'
          );
        }
        if (
          this.data.DOB != null &&
          this.data.DOB != undefined &&
          this.data.DOB != ''
        ) {
          this.data.DOB = this.datepipe.transform(this.data.DOB, 'yyyy-MM-dd');
        } else {
          this.data.DOB = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        }
        this.isSpinning = true;
        this.data.BUILDING_ID = Number(this.BuildingId);
        this.data.CARETAKER_ID = Number(this.CaretakerId);
        this.data.STATUS = 'P';
        this.RateseparatedIds = this.data.APPLIED_RESIDENCE_TYPE_ID;
        this.concatenatedRateIds = this.RateseparatedIds.join(',');
        this.data.APPLIED_RESIDENCE_TYPE_ID = this.concatenatedRateIds;
        if (this.data.ID) {
          this.api.updatequarterallotmentData(this.data).subscribe(
            (successCode) => {
              if (successCode['code'] == '200') {
                this.message.success(
                  'Employee Quarter Details Updated Successfully',
                  ''
                );
                this.isSpinning = false;
                this.loadForms = false;
              } else {
                this.message.error(
                  'Failed To Update Employee Quarter Details',
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
                this.formsubmitedsuccessfully.nativeElement.click();
                this.isSpinning = false;
                this.loadForms = false;
              } else if (successCode['code'] == '300') {
                this.message.error(
                  'Employee Quarter Details Form Already Filled',
                  ''
                );
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
  cloderegistermodakl() {
    window.location.reload();
  }
}