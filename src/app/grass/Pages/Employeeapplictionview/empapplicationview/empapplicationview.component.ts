import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { AllotmentCheckList } from 'src/app/grass/Models/AllotmentCheckList';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { Flatpreference } from 'src/app/grass/Models/Flatpreference';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-empapplicationview',
  templateUrl: './empapplicationview.component.html',
  styleUrls: ['./empapplicationview.component.css'],
})
export class EmpapplicationviewComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data!: AllotmentMaster;
  @Input() data2!: AllotmentCheckList;
  @Input() empid: any;
  @Input() current = 0;

  flatpref: Flatpreference = new Flatpreference();

  filteredOptions: any = [];

  allotmentschecklistdata = [];
  ResidenceType: any = [];
  listofpreferencetype: any;

  ///// Employee Details To be Bind Starts here
  Employee_name = '';
  employee_code = '';
  emp_Designation = '';
  emp_dob = '';
  office_name = '';
  service_type = '';
  Grade_pay = '';
  gradepay_level = '';
  emp_address = '';
  emp_cast = '';
  headquarter_name = '';
  joining_date: any = '';
  ///// Employee Details To be Bind Ends here

  userid: any;
  roleid: any;

  isSpinning = false;
  isOk = true;
  filterkey = '';
  grassInspector = '';
  grassinspectorlist: any = [];
  // checklistData:any = [];

  constructor(
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private api: APIServicesService,
    private modal: NzModalService
  ) { }

  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  ngOnInit() {
    this.roleid = sessionStorage.getItem('roleId');
    this.userid = sessionStorage.getItem('userId');

    this.employeedetailsedit();

    if (this.data) {
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
      if (this.data.APPLICATION_FORM != null) {
        this.applnform = false;
      } else {
        this.applnform = true;
      }
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
  }

  employeedetailsedit() {
    this.Employee_name = '';
    this.employee_code = '';
    this.emp_Designation = '';
    this.emp_dob = '';
    this.office_name = '';
    this.service_type = '';
    this.Grade_pay = '';
    this.gradepay_level = '';
    this.emp_address = '';
    this.emp_cast = '';
    this.headquarter_name = '';
    this.joining_date = '';
    this.isSpinning = true;
    if (this.data) {
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMPLOYEE_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Employee_name = data['data'][0]['NAME'];
              this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
              this.emp_Designation = data['data'][0]['DESIGNATION'];
              this.emp_dob = data['data'][0]['DOB'];
              this.office_name = data['data'][0]['OFFICE_NAME'];
              this.service_type = data['data'][0]['SERVICE_TYPE'];
              this.data.BASIC_PAY = data['data'][0]['GRADE_PAY'];
              this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
              this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL'];
              this.emp_address = data['data'][0]['ADDRESS'];
              this.emp_cast = data['data'][0]['CAST'];
              this.headquarter_name = data['data'][0]['LOCATION'];
              this.joining_date = data['data'][0]['JOINING_DATE'];
              this.isSpinning = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
            }
          },
          (err) => { }
        );
    }
  }

  clearAllotmentletter() {
    this.data.JOINING_ALLOTMENT_LETTER = null;
    this.joiningAllotmentnotnull = true;
  }
  clearGradepayletter() {
    this.data.GRADE_PAY_DRAWN_LETTER = null;
    this.gradepaynotnull = true;
  }

  joininglettershow: boolean = false;
  clearJoiningletletter() {
    this.data.JOINING_LETTER = null;
    this.joininglettershow = true;
  }

  Payslipshow: boolean = false;
  clearpayslip() {
    this.data.PAY_SLIP = null;
    this.Payslipshow = true;
  }

  Icardshow: boolean = false;
  clearIcard() {
    this.data.I_CARD = null;
    this.Icardshow = true;
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

  RejectRemark: boolean = false;
  Reject() {
    this.data.REMARK = '';
    this.RejectRemark = true;
  }

  CancleRemark() {
    this.RejectRemark = false;
  }

  close() {
    this.drawerClose();
  }

  showbuttons: boolean = true;

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
  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      if (this.data.ID) {
        if (this.data.STATUS == 'A' || this.data.STATUS == 'R') {
          this.showbuttons = false;
        } else if (this.data.STATUS == 'P') {
          this.showbuttons = true;
        }

        if (this.data.ID) {
          this.filterlike = ' AND ID = ' + this.data.ID;

          this.getallotmentandchecklist();
        } else {
          this.filterlike = ' AND EMPLOYEE_ID = ' + this.empid;

          this.getallotmentandchecklist();
        }

        // this.api
        //   .getAllotmentchecklist(0, 0, '', '', ' AND ALLOTEMENT_ID = ' + this.data.ID)
        //   .subscribe(
        //     (data) => {
        //       if (data['code'] == 200) {
        //         this.allotmentschecklistdata = data['data'];

        //         if (this.allotmentschecklistdata.length > 0) {
        //           this.data2.ALLOTEMENT_ID = this.data.ID;
        //           this.data2.ID = this.allotmentschecklistdata[0]['ID'];
        //           this.data2.ALLOCATED_BY_DEPARTMENT =
        //             this.allotmentschecklistdata[0]['ALLOCATED_BY_DEPARTMENT'];
        //           this.data2.ALLOCATED_TO =
        //             this.data2.IS_GOVERNMENT_RESIDENCE_ALLOTED =
        //               this.allotmentschecklistdata[0][
        //                 'IS_GOVERNMENT_RESIDENCE_ALLOTED'
        //               ];
        //           this.data2.ALLOCATED_TO =
        //             this.allotmentschecklistdata[0]['ALLOCATED_TO'];
        //           this.data2.IS_EMPLOYEED_FAMILY_MEMBER =
        //             this.allotmentschecklistdata[0][
        //               'IS_EMPLOYEED_FAMILY_MEMBER'
        //             ];
        //           this.data2.ALLOCATED_BY =
        //             this.allotmentschecklistdata[0]['ALLOCATED_BY'];
        //           this.data2.IS_APPLICANT_STAY_PRESENTLY =
        //             this.allotmentschecklistdata[0][
        //               'IS_APPLICANT_STAY_PRESENTLY'
        //             ];
        //           this.data2.OFFICE_NAME_OF_FAMILY_MEM =
        //             this.allotmentschecklistdata[0][
        //               'OFFICE_NAME_OF_FAMILY_MEM'
        //             ];
        //           this.data2.STAYS_WITH_YOU =
        //             this.allotmentschecklistdata[0]['STAYS_WITH_YOU'];
        //           this.data2.RENTED_PREMISES_NAME =
        //             this.allotmentschecklistdata[0]['RENTED_PREMISES_NAME'];
        //           this.data2.TYPE_RESIDENCE =
        //             this.allotmentschecklistdata[0]['TYPE_RESIDENCE'];
        //           this.data2.POOL_NAME =
        //             this.allotmentschecklistdata[0]['POOL_NAME'];
        //           this.data2.DEBARRED_ALLOTMENT =
        //             this.allotmentschecklistdata[0]['DEBARRED_ALLOTMENT'];
        //           this.data2.CANCELLED_ALLOTMENT =
        //             this.allotmentschecklistdata[0]['CANCELLED_ALLOTMENT'];
        //           this.data2.AFFIRMATIVE_INDICATE =
        //             this.allotmentschecklistdata[0]['AFFIRMATIVE_INDICATE'];
        //           this.data2.RENT_FREE_ACCOMMODATION =
        //             this.allotmentschecklistdata[0]['RENT_FREE_ACCOMMODATION'];
        //           this.data2.APPLICANT_FAMILY =
        //             this.allotmentschecklistdata[0]['APPLICANT_FAMILY'];
        //           this.data2.STATION_DUTY_FAR_FAMILY =
        //             this.allotmentschecklistdata[0]['STATION_DUTY_FAR_FAMILY'];
        //           this.data2.PERMENANT_POST_HELD =
        //             this.allotmentschecklistdata[0]['PERMENANT_POST_HELD'];
        //           this.data2.OFFICE_ATTACHED =
        //             this.allotmentschecklistdata[0]['OFFICE_ATTACHED'];
        //           this.data2.SURETY_SUBSIST =
        //             this.allotmentschecklistdata[0]['SURETY_SUBSIST'];
        //           this.data2.CIVIL_LIST =
        //             this.allotmentschecklistdata[0]['CIVIL_LIST'];
        //         }
        //         this.current = 1;
        //         this.isSpinning = false;
        //       } else {
        //         this.message.error("Can't Load Allotment Checklist Data", '');
        //         this.isSpinning = false;
        //       }
        //     },
        //     (err) => {
        //
        //       this.isSpinning = false;
        //     }
        //   );
      } else {
        this.data2 = new AllotmentCheckList();
        this.current = 1;
      }
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
        allotmentid = this.generateddatalist[0]['ID'];
        if (
          this.generateddatalist[0].GRADE_PAY > 80000 &&
          this.generateddatalist[0].GRADE_PAY == 80000
        ) {
          this.disable10 = true;
          this.disable11 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 75000 &&
          this.generateddatalist[0].GRADE_PAY <= 79999
        ) {
          this.disable9 = true;
          this.disable10 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 67000 &&
          this.generateddatalist[0].GRADE_PAY <= 74999
        ) {
          this.disable8 = true;
          this.disable9 = true;
        }
        if (this.generateddatalist[0].GRADE_PAY == 10000) {
          this.disable7 = true;
          this.disable8 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 8700 &&
          this.generateddatalist[0].GRADE_PAY <= 8900
        ) {
          this.disable6 = true;
          this.disable7 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 7600 &&
          this.generateddatalist[0].GRADE_PAY <= 8000
        ) {
          this.disable5 = true;
          this.disable6 = true;
        }
        if (this.generateddatalist[0].GRADE_PAY == 6600) {
          this.disable3 = true;
          this.disable4 = true;
          this.disable5 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 5400 &&
          this.generateddatalist[0].GRADE_PAY <= 6600
        ) {
          this.disable3 = true;
          this.disable4 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 4200 &&
          this.generateddatalist[0].GRADE_PAY <= 4800
        ) {
          this.disable3 = true;
          this.disable2 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 1900 &&
          this.generateddatalist[0].GRADE_PAY <= 2800
        ) {
          this.disable1 = true;
          this.disable2 = true;
        }
        if (
          this.generateddatalist[0].GRADE_PAY >= 1300 &&
          this.generateddatalist[0].GRADE_PAY <= 1800
        ) {
          this.disable1 = true;
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
                                  } else {
                                    // this.checklistData[i]['isSelected'] = false
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
                  this.current = 1;
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
          this.data2 = new AllotmentCheckList();
          this.data2.ALLOTEMENT_ID = allotmentid;
          this.disableupload = true;
          this.current = 1;
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }
  pre() {
    this.current -= 1;
  }

  changeinallocatedto(event: any) { }

  changeinallocatedBy(event: any) { }
  changeResidencetype(event: any) { }

  emolumentdrawn(event: boolean) {
    this.data.IS_EMOLUMENTS_DRAWN = event;
    if (this.data.IS_EMOLUMENTS_DRAWN == false) {
      this.data.EMOLUMENTS_DRAWN = '';
    }
  }
  joinallotletter(event: boolean) {
    this.data.JOINING_ALLOTMENT_YEAR = event;
    if (this.data.JOINING_ALLOTMENT_YEAR == false) {
      this.data.JOINING_ALLOTMENT_LETTER = null;
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

  transferFileURLallotment: any;
  joiningAllotmentnotnull: boolean = true;
  urllink2: any;
  onFileSelectedTransfer1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      // this.data.JOINING_ALLOTMENT_LETTER = this.urllink2;
      this.api
        .onUpload(
          'joiningAllotmentLetter',
          this.transferFileURLallotment,
          this.urllink2
        )
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.JOINING_ALLOTMENT_LETTER = this.urllink2;
            if (this.data.JOINING_ALLOTMENT_LETTER != null) {
              this.joiningAllotmentnotnull = false;
            } else {
              this.joiningAllotmentnotnull = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURLallotment = null;
      this.data.JOINING_ALLOTMENT_LETTER = null;
    }
  }

  gradepaydrawnletter: any;
  gradepaynotnull: boolean = true;
  urllink3: any;
  onFileSelectedTransfer2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      this.api
        .onUpload(
          'gradePayDrawnLetter',
          this.gradepaydrawnletter,
          this.urllink3
        )
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.GRADE_PAY_DRAWN_LETTER = this.urllink3;
            if (this.data.GRADE_PAY_DRAWN_LETTER != null) {
              this.gradepaynotnull = false;
            } else {
              this.gradepaynotnull = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.gradepaydrawnletter = null;
      this.data.GRADE_PAY_DRAWN_LETTER = null;
    }
  }

  joindateletter: any;
  urljoinletter: any;
  onFileSelectedJoiningletter(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
          this.data.JOINING_LETTER.trim() != ''
        ) {
          var arr = this.data.JOINING_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.JOINING_LETTER = this.urllink3;
      this.api
        .onUpload('joiningLetter', this.joindateletter, this.urljoinletter)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.JOINING_LETTER = this.urljoinletter;
            if (this.data.JOINING_LETTER != null) {
              this.joininglettershow = false;
            } else {
              this.joininglettershow = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.joindateletter = null;
      this.data.JOINING_LETTER = null;
    }
  }

  payslippdf: any;
  urlpayslip: any;
  onFileSelectedPayslip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      // this.data.PAY_SLIP = this.urllink3;
      this.api
        .onUpload('paySlips', this.payslippdf, this.urlpayslip)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.PAY_SLIP = this.urlpayslip;
            if (this.data.PAY_SLIP != null) {
              this.Payslipshow = false;
            } else {
              this.Payslipshow = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.payslippdf = null;
      this.data.PAY_SLIP = null;
    }
  }

  IcardPDF: any;
  urlIcardPdf: any;
  onFileSelectedIcard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
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
      // this.data.I_CARD = this.urllink3;
      this.api
        .onUpload('iCards', this.IcardPDF, this.urlIcardPdf)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.I_CARD = this.urlIcardPdf;
            if (this.data.I_CARD != null) {
              this.Icardshow = false;
            } else {
              this.Icardshow = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.IcardPDF = null;
      this.data.I_CARD = null;
    }
  }

  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;
  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.appnPDF = <File>event.target.files[0];

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
      this.api
        .onUpload('applicationForm', this.appnPDF, this.urlappnPdf)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.APPLICATION_FORM = this.urlappnPdf;
            if (this.data.APPLICATION_FORM != null) {
              this.applnform = false;
            } else {
              this.applnform = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
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
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  ///////////////////////////////////////////
  dataList = [];
  drawerVisible12: boolean = false;
  drawerTitle12!: string;
  employeeedit: any;
  drawerData12: EmployeeMaster = new EmployeeMaster();

  drawerClose12(): void {
    // this.employeedetailsedit();
    this.drawerVisible12 = false;
  }

  get closeCallback12() {
    return this.drawerClose12.bind(this);
  }
  showload = false;
  ShowProfile() {
    this.drawerTitle12 = 'Update Employee ';
    this.showload = true;
    //  this.drawerData = Object.assign({}, data);
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.empid)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.drawerData12 = Object.assign({}, data['data'][0]);
            this.showload = false;
          }
          this.drawerVisible12 = true;
        },
        (err) => {
          this.showload = false;
        }
      );
  }
}
