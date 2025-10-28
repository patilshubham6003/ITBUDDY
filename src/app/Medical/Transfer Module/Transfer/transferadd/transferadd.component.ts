import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { EmployeeMaster } from 'src/app/Medical/Models/Employee';
import { TransferCheckList } from 'src/app/Medical/Models/TransferChecklist';
import { CheckList } from 'src/app/Medical/Models/checkList';
import { form1 } from 'src/app/Medical/Models/form1';
import { form2 } from 'src/app/Medical/Models/form2';
import { form3 } from 'src/app/Medical/Models/form3';
import { Journeydetails } from 'src/app/Medical/Models/journeydetails';
import { QuestionaryMaster } from 'src/app/Medical/Models/questionarymaster';
import { Realtionshipdata } from 'src/app/Medical/Models/relationship';
import { TranferapplicationMaster } from 'src/app/Medical/Models/transferapplication';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-transferadd',
  templateUrl: './transferadd.component.html',
  styleUrls: ['./transferadd.component.css'],
})
export class TransferaddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService,
    private sanitizer: DomSanitizer
  ) {}
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /[6-9]{1}[0-9]{9}/;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @Input() isSpinning = false;
  @Input() relationdata: any = [];
  @Input() journey: form2;
  isOk = true;
  isAdmin: boolean = false;
  imgurl = this.api.retriveimgUrl;
  userId: any;
  parentUserId: any;
  @Input() isCreate: any;
  DDO_ID: any = Number(sessionStorage.getItem('ddoId'));
  ngOnInit(): void {
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
    this.gradePayLevelList();
    this.userId = Number(sessionStorage.getItem('userId'));
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
    this.fileNumberList();
    this.ListOfDesignation();
    this.current = 0;
    this.isSpinning = false;
    // this.allEmployeeList();
    this.ModeOfTranfer();
    this.ddoOfTheOfficialList();
    this.loadOnlySelectedEmployee();
  }

  isShowCSS: boolean = false;
  ModeOfTranfer() {
    this.api.gettravelmode(0, 0, '', 'asc', '').subscribe((data) => {
      if (data['code'] == 200) {
        this.travelmode = data['data'];
      }
    });
  }
  @Input()
  drawerVisible: boolean = false;
  empDrawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: TranferapplicationMaster;
  @Input() empID: any;
  @Input() claimID: any;
  @Input() current = 0;
  employee: EmployeeMaster[] = [];
  editrelation: Realtionshipdata = new Realtionshipdata();
  checkData: TransferCheckList = new TransferCheckList();
  data4: CheckList = new CheckList();
  Cities: EmployeeMaster[];
  filteredOptions: any = [];
  Names = EmployeeMaster;
  empLoader: boolean = false;
  orderdata1: any = [];
  travelmode: any = [];
  drawerTitleform1!: string;
  drawerVisible2form1: boolean = false;
  drawerData2form1: form1 = new form1();
  designationList: any = [];
  gradePayLevelDataList: any = [];
  ddoOfTheOfficialDataList: any = [];
  loggedInDDO: any;
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
            this.designationList = [];
            this.message.error("Can't Load Designation Data", '');
          }
        },
        (err) => {}
      );
  }
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
          } else {
            this.classdata = [];
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
  gradePayLevel: any = '';
  adddetailsjorney(): void {
    this.empID = this.empID;
    this.claimID = this.claimID;
    this.drawerTitledetailsjorney = 'Add Details of Journeys(s)';
    this.gradePayLevel = this.data.GRADE_PAY_LEVEL;
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
    this.loadingRecords = true;
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
          this.loadingRecords = false;
          this.formdata3 = data['data'];
        } else {
          this.loadingRecords = false;
          this.formdata3 = [];
        }
      });
  }

  getDataform2() {
    this.loadingRecords = true;
    this.api
      .gettransfortation(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.claimID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.formdata2 = data['data'];
        } else {
          this.loadingRecords = false;
          this.formdata2 = [];
        }
      });
  }

  getDataform1() {
    this.loadingRecords = true;
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
          this.loadingRecords = false;
          this.formdata1 = data['data'];
        } else {
          this.loadingRecords = false;
          this.formdata1 = [];
        }
      });
  }

  detailsJorneyGetData() {
    this.loadingRecords = true;
    this.api
      .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.claimID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.formdata7 = data['data'];
        } else {
          this.loadingRecords = false;
          this.formdata7 = [];
        }
      });
  }

  getrelationtable() {
    this.loadingRecords = true;
    this.api
      .getrelationtable(0, 0, '', 'asc', ' AND TRANSFER_ID =' + this.claimID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.relationdata = data['data'];
        } else {
          this.loadingRecords = false;
          this.relationdata = [];
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
  }

  editform3(data: form3): void {
    this.drawerTitleform3 = 'Edit Transportion Charges';
    this.drawerDataform3 = Object.assign({}, data);
    this.drawerVisibleform3 = true;
  }

  classdata: any;
  editform7(data: Journeydetails): void {
    this.gradePayLevel = this.data.GRADE_PAY_LEVEL;
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
          } else {
            this.classdata = [];
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

  loadOnlySelectedEmployee() {
    if (this.data.ID) {
      let fullName: any = '';
      fullName = this.data.NAME;

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
          this.employee = [];
          this.empLoader = false;
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

  close(): void {
    this.current = 0;
    this.drawerClose();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  AlldataSave(addNew: boolean, stage: string) {
    this.isOk = true;
    this.isSpinning = true;

    if (
      this.data.IS_ADVANCE_TAKEN == true &&
      (this.data.ADVANCED_AMOUNT == undefined ||
        this.data.ADVANCED_AMOUNT == null ||
        this.data.ADVANCED_AMOUNT == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Advance Amount.', '');
    } else if (
      this.data.IS_ADVANCE_TAKEN == true &&
      (this.data.ADVANCE_TAKEN_DATE == undefined ||
        this.data.ADVANCE_TAKEN_DATE == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
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

    this.data.ID = this.claimID;
    if (this.isOk && this.data.ID != undefined) {
      if (this.data.IS_ADVANCE_TAKEN == false) {
        this.data.ADVANCE_TAKEN_DATE = null;
        this.data.ADVANCED_AMOUNT = 0;
      }
      // if (stage == 'V') {
      //   this.data.CURRENT_STAGE_ID = 3;

      // }
      this.data.TRANSFER_ID = undefined;
      if (
        this.data.TRANSFER_HOLD_DATE != null &&
        this.data.TRANSFER_HOLD_DATE != undefined &&
        this.data.TRANSFER_HOLD_DATE != ''
      ) {
        this.data.TRANSFER_HOLD_DATE = this.datepipe.transform(
          this.data.TRANSFER_HOLD_DATE,
          'yyyy-MM-dd'
        );
      }
      this.api.updatetransfer(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.next();
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    }
  }
  grantamount(event: any) {
    if (event != undefined || event != null || event != '') {
      if (event <= 100) {
        this.data.TRANSFER_GRANT_AMOUNT = (this.data.GRADE_PAY * event) / 100;
      } else {
        this.message.error("Can't Type More Than 100%", '');
        this.data.TRANSFER_GRANT = 0;
        this.data.TRANSFER_GRANT_AMOUNT = 0;
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
  saveFileDetails() {
    this.isOk = true;
    this.isSpinning = true;
    // this.data.CURRENT_STAGE_ID = null;
    if (this.isOk && this.data.ID != undefined) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.data.TRANSFER_ID = undefined;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          // this.isSpinning = false;
          if (successCode.code == '200') {
            this.next();
          } else {
            this.isSpinning = false;
            this.message.error('Information Has Not Saved...', '');
          }
        });
      } else {
      }
    }
  }
  showcreatemsg: boolean = false;
  empSave(addNew: boolean): void {
    this.data.ORDER_FORM_REMARK = this.data.ORDER_FORM_REMARK;
    this.data.ORDER_FORM_REMARK_2 = this.data.ORDER_FORM_REMARK_2;
    this.isSpinning = true;
    if (!this.data.ADVANCE_AMOUNT_REQ) {
      this.data.ADVANCE_AMOUNT_REQ = 0;
    }
    if (!this.data.GRANT_ONE_BASIC_PAY_AMOUNT) {
      this.data.GRANT_ONE_BASIC_PAY_AMOUNT = 0;
    }
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
    this.isOk = true;
    this.data.memberTransferData = this.relationdata;

    if (
      this.data.EMP_ID == undefined &&
      this.data.DESIGNATION_ID == undefined &&
      this.data.EMPLOYEE_CODE == undefined &&
      // this.data.DDO_OF_THE_OFFICIAL_ID == undefined &&
      this.data.GRADE_PAY == undefined &&
      // this.data.MOBILE_NO == undefined &&
      // this.data.EMAIL_ID == undefined &&
      this.data.GRADE_PAY_LEVEL_ID == undefined &&
      this.data.SERVICE_TYPE == undefined
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
      this.message.error('Please Select Employee Name', '');
    } else if (
      this.data.DESIGNATION_ID == undefined ||
      this.data.DESIGNATION_ID == null ||
      this.data.DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Designation', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Employee Code', '');
      // } else if (
      //   this.data.DDO_OF_THE_OFFICIAL_ID == undefined ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == null ||
      //   this.data.DDO_OF_THE_OFFICIAL_ID == ''
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Select DDO Of The Official', '');
    } else if (
      this.data.GRADE_PAY == undefined ||
      this.data.GRADE_PAY == null ||
      this.data.GRADE_PAY == 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Basic Pay', '');
      // } else if (
      //   this.data.EMAIL_ID == undefined ||
      //   this.data.EMAIL_ID == null ||
      //   this.data.EMAIL_ID == ''
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Enter Email ID', '');
      // } else if (
      //   this.data.MOBILE_NO == undefined ||
      //   this.data.MOBILE_NO == null ||
      //   this.data.MOBILE_NO == '' ||
      //   this.data.MOBILE_NO == 0
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Enter Mobile Number', '');
    } else if (
      this.data.GRADE_PAY_LEVEL_ID == undefined ||
      this.data.GRADE_PAY_LEVEL_ID == null ||
      this.data.GRADE_PAY_LEVEL_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Grade Pay Level', '');
    } else if (
      this.data.SERVICE_TYPE == undefined ||
      this.data.SERVICE_TYPE == null ||
      this.data.SERVICE_TYPE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Service Type Name', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.DOJ_PRESENT_STATION == undefined ||
        this.data.DOJ_PRESENT_STATION == null ||
        this.data.DOJ_PRESENT_STATION == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select DOJ of Present Station', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.DOJ_PRESENT_POST == undefined ||
        this.data.DOJ_PRESENT_POST == null ||
        this.data.DOJ_PRESENT_POST == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select DOJ of Present Post', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.DETAILS_OF_TRANSFER_POSTING_ORDER == undefined ||
        this.data.DETAILS_OF_TRANSFER_POSTING_ORDER == null ||
        this.data.DETAILS_OF_TRANSFER_POSTING_ORDER == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Details of Transfer/Posting Order', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.PLACE_OFFICE_OF_POSTING == undefined ||
        this.data.PLACE_OFFICE_OF_POSTING == null ||
        this.data.PLACE_OFFICE_OF_POSTING == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
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
      this.isSpinning = false;
      this.message.error('Please Enter New Residence Address', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.TRA_ALLO_FARE_RS == undefined ||
        this.data.TRA_ALLO_FARE_RS == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Travelling Allowance Fare', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.TRAVEL_DA_DAYS == undefined ||
        this.data.TRAVEL_DA_DAYS == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Travel DA (Days)', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT == undefined ||
        this.data.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
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
      this.isSpinning = false;
      this.message.error(
        'Please Enter Transportation charges for Private Conveyance',
        ''
      );
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.TRAVEL_RS_PERDAY == undefined ||
        this.data.TRAVEL_RS_PERDAY == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Travel DA (Perday Rs)', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.ADVANCE_AMOUNT_REQ == undefined ||
        this.data.ADVANCE_AMOUNT_REQ == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Amount of Advance Required', '');
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      (this.data.GRANT_ONE_BASIC_PAY_AMOUNT == undefined ||
        this.data.GRANT_ONE_BASIC_PAY_AMOUNT == null)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Composite transfer grant @ one basic pay (80%)',
        ''
      );
    } else if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      this.data.memberTransferData.length == 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Add At Least One Particular of the members',
        ''
      );
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
        this.data.EMAIL_ID = '';
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
        this.data.MOBILE_NO = '';
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
      {
        if (!this.claimID) {
          this.data['IS_ADMIN_TRANSFER'] = true;
        }
        if (this.data.ID) {
          this.data['TRANSFER_ID'] = this.claimID;
          this.api
            .updatetransferempdetails(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.empID = successCode.EMP_ID;
                this.claimID = successCode.TRANSFER_ID;
                if (this.isCreate) {
                  this.isCreate = false;
                }
                this.next();
                this.isSpinning = false;
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
          this.data.APP_INFO_DATE_TIME = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          );
          this.data.DOWNLOAD_PARTA_DATE_TIME = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          );
          this.data.DOCUMENTS_SUBMITTED_DATE_TIME = this.datepipe.transform(
            new Date(),
            'yyyy-MM-dd HH:mm:ss'
          );
          this.data.TRANSFER_DETAILS_SUBMITTED_DATE_TIME =
            this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
          this.data.STEP_NO = 4;
          this.data.TRANSFER_STATUS = 'T';
          this.api.createEmployeeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.empID = successCode.EMPLOYEE;
              this.claimID = successCode.TRANSFER_ID;
              this.showcreatemsg = true;
              this.next();

              this.isSpinning = false;
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

  checkSave(addNew: boolean): void {
    this.checkData.TRANSFER_ID = this.claimID;
    this.isSpinning = true;
    this.isOk = true;

    if (
      this.data.IS_APPLYING_FOR_ADVANCE &&
      !this.data.IS_TRANSFER_ADVANCE_CREATED
    ) {
      this.isOk = true;
      if (
        (this.data.TRANSFER_STATUS == 'R' ||
          this.data.TRANSFER_STATUS == 'AR' ||
          this.data.TRANSFER_STATUS == 'H' ||
          this.data.TRANSFER_STATUS == 'AH') &&
        (this.data['TRANSFER_REMARK'] == undefined ||
          this.data['TRANSFER_REMARK'] == null ||
          this.data['TRANSFER_REMARK'] == '')
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Enter Remark', '');
      } else if (
        this.data.TRANSFER_STATUS == 'H' ||
        (this.data.TRANSFER_STATUS == 'AH' &&
          (this.data['TRANSFER_HOLD_DATE'] == undefined ||
            this.data['TRANSFER_HOLD_DATE'] == null ||
            this.data['TRANSFER_HOLD_DATE'] == ''))
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Select Hold Date', '');
      }

      if (this.isOk) {
        // if (this.data.TRANSFER_STATUS == 'AR') {
        //   this.data.CURRENT_STAGE_ID = 5;
        // } else if (this.data.TRANSFER_STATUS == 'AH') {
        //   this.data.CURRENT_STAGE_ID = 4;
        // } else if (this.data.TRANSFER_STATUS == 'AA') {
        //   this.data.CURRENT_STAGE_ID = 6;
        // }
        this.isSpinning = true;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            if (this.checkData.ID) {
              this.api
                .updateTransferChecklist(this.checkData)
                .subscribe((successCode) => {
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
              this.api
                .createTransferChecklist(this.checkData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Information Save Successfully...',
                      ''
                    );
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
            this.message.error('Information Has Not Saved...', '');
            this.isSpinning = false;
          }
        });
      }
    } else {
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
        this.isSpinning = false;
        this.message.error('Please Check All Checklist Proper ', '');
      } else if (
        this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == undefined ||
        this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == null ||
        this.checkData.CONDOLATION_OF_DELAY_IS_SUBMITTED == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Check 3 No. Point ', '');
      } else if (
        this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == undefined ||
        this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == null ||
        this.checkData.FIXED_TENURE_COMPLETED_AT_OLD_STATION == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Check 7 No. Point ', '');
      } else if (
        this.checkData.A_T_TICKET_SUBMITTED == undefined ||
        this.checkData.A_T_TICKET_SUBMITTED == null ||
        this.checkData.A_T_TICKET_SUBMITTED == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Check 8 No. Point  ', '');
      } else if (
        this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == undefined ||
        this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == null ||
        this.checkData.ORIGINAL_BOARDING_PASS_SELF_DECLARATION == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Check 9 No. Point ', '');
      } else if (
        this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED ==
          undefined ||
        this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED ==
          null ||
        this.checkData.TRANSPORTATION_OF_PERSONAL_EFFECT_BILL_SUBMITTED == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Check 10 No. Point ', '');
      } else if (
        this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
          undefined ||
        this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION ==
          null ||
        this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Check 11 No. Point ', '');
      } else if (
        this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == undefined ||
        this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == null ||
        this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED == ''
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error(' Please Check 13 No. Point ', '');
      } else if (
        this.data.TRANSFER_STATUS == undefined ||
        this.data.TRANSFER_STATUS == null ||
        this.data.TRANSFER_STATUS == 'T'
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Check 7 No. Point ', '');
      } else if (
        (this.data.TRANSFER_STATUS == 'R' ||
          this.data.TRANSFER_STATUS == 'AR' ||
          this.data.TRANSFER_STATUS == 'H' ||
          this.data.TRANSFER_STATUS == 'AH') &&
        (this.data['TRANSFER_REMARK'] == undefined ||
          this.data['TRANSFER_REMARK'] == null ||
          this.data['TRANSFER_REMARK'] == '')
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Enter Remark', '');
      } else if (
        this.data.TRANSFER_STATUS == 'H' ||
        (this.data.TRANSFER_STATUS == 'AH' &&
          (this.data['TRANSFER_HOLD_DATE'] == undefined ||
            this.data['TRANSFER_HOLD_DATE'] == null ||
            this.data['TRANSFER_HOLD_DATE'] == ''))
      ) {
        this.isOk = false;
        this.isSpinning = false;
        this.message.error('Please Enter Hold Date', '');
      } else if (
        this.data.IS_APPLYING_FOR_ADVANCE &&
        !this.data.IS_TRANSFER_ADVANCE_CREATED
      ) {
        if (
          this.data.TRANSFER_STATUS == 'AH' ||
          this.data.TRANSFER_STATUS == 'AR' ||
          this.data.TRANSFER_STATUS == 'AA'
        ) {
        } else {
          this.isOk = false;
          this.isSpinning = false;
          this.message.error('Please Change the claim status', '');
        }
      } else if (
        this.data.IS_APPLYING_FOR_ADVANCE &&
        this.data.IS_TRANSFER_ADVANCE_CREATED
      ) {
        if (
          this.data.TRANSFER_STATUS == 'AH' ||
          this.data.TRANSFER_STATUS == 'AR' ||
          this.data.TRANSFER_STATUS == 'AA'
        ) {
          this.isOk = false;
          this.isSpinning = false;
          this.message.error('Please Change the claim status', '');
        }
      }

      if (this.isOk) {
        if (this.data.TRANSFER_STATUS == 'R') {
          this.data.CURRENT_STAGE_ID = 5;
        } else if (this.data.TRANSFER_STATUS == 'H') {
          this.data.CURRENT_STAGE_ID = 4;
        } else if (this.data.TRANSFER_STATUS == 'A') {
          this.data.CURRENT_STAGE_ID = 6;
          this.data.IS_EMP_FILL_ADVANCE_INFO = 1;
        }

        this.isSpinning = true;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            if (this.checkData.ID) {
              this.api
                .updateTransferChecklist(this.checkData)
                .subscribe((successCode) => {
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
              this.api
                .createTransferChecklist(this.checkData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Information Save Successfully...',
                      ''
                    );
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
            this.message.error('Information Has Not Saved...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  clearRemark(event) {
    if (event == 'A' || event == 'AA') {
      this.data.TRANSFER_REMARK = null;
      this.data.TRANSFER_HOLD_DATE = null;
    } else if (event == 'R' || event == 'AR') {
      this.data.TRANSFER_HOLD_DATE = null;
      this.data.TRANSFER_REMARK = null;
    } else {
      this.data.TRANSFER_REMARK = null;
    }
  }

  uploadDoc(addNew: boolean) {
    this.isOk = true;
    this.isSpinning = true;
    if (this.isOk && this.data.ID != undefined) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.data.TRANSFER_ID = undefined;
        // this.data.CURRENT_STAGE_ID = null;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.isSpinning = false;
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

  pre(): void {
    if (this.current == 1) {
      this.isSpinning = true;
      // this.allEmployeeList();
      this.loadOnlySelectedEmployee();
      this.ListOfDesignation();
      this.gradePayLevelList();
      this.ddoOfTheOfficialList();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.data = data['data'][0];
                this.current -= 1;
              } else {
                this.data = data['data'][0];

                this.current -= 1;
              }
            } else {
              this.message.error('Something Went Wrong', '');
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
                    this.relationdata = data['data'];
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
    } else if (this.current == 3) {
      this.isSpinning = true;
      this.fileNumberList();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 0;
                  this.current1 = 0;
                } else {
                  this.current = 2;
                }
                this.data = data['data'][0];
                this.isSpinning = false;
              } else {
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 0;
                  this.current1 = 0;
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
    } else if (this.current == 2) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.ModeOfTranfer();
              if (data['data'].length >= 0) {
                this.current = 1;
                this.data = data['data'][0];
                this.isSpinning = false;
              } else {
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

      // this.isSpinning = false;
    } else if (this.current == 4) {
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              this.current = 3;
              this.current1 = 1;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
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
            if (
              this.data.ID == 0 ||
              this.data.ID == null ||
              this.data.ID == undefined
            ) {
              this.data.ID = data['data'][0]['ID'];
            } else {
              this.data.ID = this.data.ID;
            }

            if (data['data'][0]['DDO_OF_THE_OFFICIAL']) {
              this.oldDDO = data['data'][0]['DDO_OF_THE_OFFICIAL'];
            }

            if (data['data'][0]['DDO_OF_THE_OFFICIAL_ID']) {
              this.oldDDOID = data['data'][0]['DDO_OF_THE_OFFICIAL_ID'];
            }

            this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.data.SALUTATION = data['data'][0]['SALUTATION'];
            this.data.DESIGNATION = data['data'][0]['DESIGNATION'];
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
            this.data.NAME = data['data'][0]['NAME'];
            this.data.EMPLOYEE_NAME = data['data'][0]['NAME'];
            this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
            this.data.GRADE_PAY_LEVEL_ID =
              data['data'][0]['GRADE_PAY_LEVEL_ID'];
          } else {
            this.isSpinning = false;
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {}
      );
    } else {
      this.isSpinning = false;
      this.empLoader = false;
      this.data.ID = null;
      this.data.OFFICE_NAME = '';
      this.data.SALUTATION = '';
      this.data.DESIGNATION = '';
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
      this.data.NAME = '';
      this.data.SERVICE_TYPE = '';
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
        ' AND STATUS = 1 AND HIRARCHY_ID in (6,7)',
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
  railTicket: boolean = false;
  airTicket: boolean = false;
  freightCharge: any = 0;
  next() {
    if (this.current == 0) {
      this.isSpinning = true;
      this.getDataform1();
      this.getDataform2();
      this.getDataform3();
      this.ModeOfTranfer();
      this.detailsJorneyGetData();
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.data = new TranferapplicationMaster();
                if (this.showcreatemsg) {
                  this.message.success('Claim Created Successfully...', '');
                  this.showcreatemsg = false;
                } else {
                  this.message.success('Information Saved Successfully...', '');
                }
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
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
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
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

      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.message.success('Information Saved Successfully...', '');
                this.current = 2;
                this.data = data['data'][0];
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
      this.freightCharge = 0;
      this.isSpinning = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID =' + this.claimID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              if (data['data']['VEHICLE_BROUGHT_SELF_PROPULATION'] == 1) {
                this.freightCharge = 1;
              } else {
                this.freightCharge = 0;
              }

              this.message.success('Information Saved Successfully...', '');
              this.current = 3;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else if (this.current == 3) {
      this.fileNumberList();
      this.isSpinning = true;
      this.railTicket = false;
      this.airTicket = false;
      this.api
        .getAllTransferChecklist(
          0,
          0,
          '',
          '',
          ' AND TRANSFER_ID =' + this.claimID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.checkData = data['data'][0];
                this.isSpinning = false;
                this.message.success('Information Saved Successfully...', '');
                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 4;
                  this.current1 = 2;
                } else {
                  this.current = 4;
                }
              } else {
                this.checkData = new TransferCheckList();
                if (this.data.IS_ADVANCE_TAKEN == 1) {
                  this.checkData.T_A_ADVANCE_TAKEN = true;
                } else {
                  this.checkData.T_A_ADVANCE_TAKEN =
                    this.checkData.T_A_ADVANCE_TAKEN;
                }
                if (this.formdata7.length > 0) {
                  for (var i = 0; this.formdata7.length > i; i++) {
                    if (
                      this.formdata7[i]['TRAVEL_MODE_ID'] == 4 &&
                      (this.formdata7[i]['IRCTC_TICKET'] != null ||
                        this.formdata7[i]['IRCTC_TICKET'] != undefined ||
                        this.formdata7[i]['IRCTC_TICKET'] != '')
                    ) {
                      this.railTicket = true;
                    } else {
                      this.railTicket = false;
                    }
                    if (
                      this.formdata7[i]['TRAVEL_MODE_ID'] == 5 &&
                      (this.formdata7[i]['AIR_TICKET'] != null ||
                        this.formdata7[i]['AIR_TICKET'] != undefined ||
                        this.formdata7[i]['AIR_TICKET'] != '')
                    ) {
                      this.airTicket = true;
                    } else {
                      this.airTicket = false;
                    }
                  }
                  if (this.airTicket == true || this.railTicket == true) {
                    this.checkData.A_T_TICKET_SUBMITTED = 'Y';
                  } else {
                    this.checkData.A_T_TICKET_SUBMITTED = 'N';
                  }
                } else {
                  this.checkData.A_T_TICKET_SUBMITTED = 'NA';
                }

                if (
                  this.data.ASSUMPTION_CHARGE != null &&
                  this.data.ASSUMPTION_CHARGE != undefined &&
                  this.data.ASSUMPTION_CHARGE != ''
                ) {
                  this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED = 'Y';
                } else {
                  this.checkData.ASSUMPTION_OF_CHARGE_SUBMITTED = 'N';
                }

                if (
                  this.data.MANDATE_FORM != null &&
                  this.data.MANDATE_FORM != undefined &&
                  this.data.MANDATE_FORM != ''
                ) {
                  this.checkData.BANK_MANDATE_CHEQUE_SUBMITTED = true;
                } else {
                  this.checkData.BANK_MANDATE_CHEQUE_SUBMITTED =
                    this.checkData.BANK_MANDATE_CHEQUE_SUBMITTED;
                }
                if (
                  this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE != null &&
                  this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE != undefined &&
                  this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE != ''
                ) {
                  this.checkData.IS_TRANSFER_ORDER_SERVICE_CERTIFICATE = true;
                } else {
                  this.checkData.IS_TRANSFER_ORDER_SERVICE_CERTIFICATE =
                    this.checkData.IS_TRANSFER_ORDER_SERVICE_CERTIFICATE;
                }
                if (
                  this.data.PAY_SLIP != null &&
                  this.data.PAY_SLIP != undefined &&
                  this.data.PAY_SLIP != ''
                ) {
                  this.checkData.LAST_PAY_CERTIFICATE_SUBMITTED = true;
                } else {
                  this.checkData.LAST_PAY_CERTIFICATE_SUBMITTED =
                    this.checkData.LAST_PAY_CERTIFICATE_SUBMITTED;
                }

                if (this.freightCharge == 1) {
                  if (
                    this.data.TRAIN_BROUGHT_CHARGE != null ||
                    this.data.TRAIN_BROUGHT_CHARGE != undefined ||
                    this.data.TRAIN_BROUGHT_CHARGE != ''
                  ) {
                    this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION =
                      'Y';
                  } else {
                    this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION =
                      'N';
                  }
                } else {
                  this.checkData.TRANSPORTATION_OF_VEHICLE_BY_ROAD_SELF_PROPULSION =
                    'NA';
                }
                this.isSpinning = false;
                this.message.success('Information Saved Successfully...', '');

                if (
                  this.data.IS_APPLYING_FOR_ADVANCE &&
                  !this.data.IS_TRANSFER_ADVANCE_CREATED
                ) {
                  this.current = 4;
                  this.current1 = 2;
                } else {
                  this.current = 4;
                }
              }
            } else {
              this.isSpinning = false;
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  isAdvanceTaken(event: any) {
    if (event == false) {
      if (
        this.data.ADVANCED_AMOUNT != null ||
        this.data.ADVANCED_AMOUNT != undefined
      ) {
        this.data.ADVANCED_AMOUNT = null;
      } else {
        this.data.ADVANCED_AMOUNT = null;
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
          this.drawerData = new EmployeeMaster();
          this.message.error("Can't Load Employee Data", '');
        }
      });
  }

  empDrawerClose(): void {
    this.empDrawerVisible = false;

    if (
      this.data.EMP_ID != null &&
      this.data.EMP_ID != undefined &&
      this.data.EMP_ID != ''
    ) {
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.data.EMP_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.data.SALUTATION = data['data'][0]['SALUTATION'];
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
              this.data.SERVICE_TYPE = data['data'][0]['SERVICE_TYPE'];
              this.data.GRADE_PAY = data['data'][0]['GRADE_PAY'];
              this.data.EMAIL_ID = data['data'][0]['EMAIL_ID'];
              this.data.MOBILE_NO = data['data'][0]['MOBILE_NO'];
              this.data.ADDRESS = data['data'][0]['ADDRESS'];
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
      this.allEmployeeList();
    }
  }

  get closeCallback() {
    return this.empDrawerClose.bind(this);
  }

  cancel(): void {}

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
  fileURL1: any;
  onFileSelected(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
    }
  }

  confirmDeleteRetlation(data: any, i: number) {
    this.relationdata = this.relationdata.filter((item, index) => index != i);
    this.relationdata = [...[], ...this.relationdata];
  }

  index = -1;
  edit1(data: Realtionshipdata, i: any): void {
    this.index = i;
    this.editrelation = Object.assign({}, data);
  }

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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarassumptionCharge = false;
            this.percentassumptionCharge = 0;
            this.assumptionFileURL = null;
            this.data.ASSUMPTION_CHARGE = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.ASSUMPTION_CHARGE = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarlpc = false;
            this.percentlpc = 0;
            this.LPCFileURL = null;
            this.data.LPC = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.LPC = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarmandateForm = false;
            this.percentmandateForm = 0;
            this.mandateFormFileURL = null;
            this.data.MANDATE_FORM = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.MANDATE_FORM = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartransferServiceCertificate = false;
            this.percenttransferServiceCertificate = 0;
            this.transferFileURL = null;
            this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarticketBoardingPass = false;
            this.percentticketBoardingPass = 0;
            this.ticketPassFileURL = null;
            this.data.TICKET_BOARDING_PASS = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.TICKET_BOARDING_PASS = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartransportationBills = false;
            this.percenttransportationBills = 0;
            this.transportationBillFileURL = null;
            this.data.TRANSPORTATION_BILLS = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.TRANSPORTATION_BILLS = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarcondolationOfDelay = false;
            this.percentcondolationOfDelay = 0;
            this.condonationOfDelayFileURL = null;
            this.data.CONDOLATION_OF_DELAY = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.CONDOLATION_OF_DELAY = url;
              this.updatecall();
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
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
      var a: any = this.api.retriveimgUrl + 'transferPaySlip/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    this.printOrderModalVisible = true;
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  viewAssumptionPDF(pdfURL: string): void {
    this.view = 1;
    this.getS(pdfURL);
  }
  viewLPCPDF(pdfURL: string): void {
    this.view = 2;
    this.getS(pdfURL);
  }
  viewMandateFormPDF(pdfURL: string): void {
    this.view = 3;
    this.getS(pdfURL);
  }
  viewTransferPDF(pdfURL: string): void {
    this.view = 4;
    this.getS(pdfURL);
  }
  viewBoardingPassPDF(pdfURL: string): void {
    this.view = 5;
    this.getS(pdfURL);
  }
  viewTransportationBillsPDF(pdfURL: string): void {
    this.view = 6;
    this.getS(pdfURL);
  }
  viewCondonationOfDelayPDF(pdfURL: string): void {
    this.view = 7;
    this.getS(pdfURL);
  }
  viewPaySlipPDF(pdfURL: string): void {
    this.view = 8;
    this.getS(pdfURL);
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
    if (this.view == 8) {
      this.data.PAY_SLIP_STATUS = 'A';
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
    if (this.view == 8) {
      this.data.PAY_SLIP_STATUS = 'R';
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
    this.api.updatetransfer(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
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

  accommodation(data: any) {
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
  deleteCancel() {}
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

  rateOnKM(event) {
    if (event != null && event != undefined && event != '') {
      if (event >= 1 && event <= 100) {
        this.data.TRAIN_BROUGHT_CHARGE = 6485;
      } else if (event >= 101 && event <= 150) {
        this.data.TRAIN_BROUGHT_CHARGE = 7828;
      } else if (event >= 151 && event <= 200) {
        this.data.TRAIN_BROUGHT_CHARGE = 9059;
      } else if (event >= 201 && event <= 250) {
        this.data.TRAIN_BROUGHT_CHARGE = 10283;
      } else if (event >= 251 && event <= 300) {
        this.data.TRAIN_BROUGHT_CHARGE = 11530;
      } else if (event >= 301 && event <= 350) {
        this.data.TRAIN_BROUGHT_CHARGE = 12747;
      } else if (event >= 351 && event <= 400) {
        this.data.TRAIN_BROUGHT_CHARGE = 13994;
      } else if (event >= 401 && event <= 450) {
        this.data.TRAIN_BROUGHT_CHARGE = 15247;
      } else if (event >= 451 && event <= 500) {
        this.data.TRAIN_BROUGHT_CHARGE = 16494;
      } else if (event >= 501 && event <= 550) {
        this.data.TRAIN_BROUGHT_CHARGE = 17785;
      } else if (event >= 551 && event <= 600) {
        this.data.TRAIN_BROUGHT_CHARGE = 19069;
      } else if (event >= 601 && event <= 650) {
        this.data.TRAIN_BROUGHT_CHARGE = 19142;
      } else if (event >= 651 && event <= 700) {
        this.data.TRAIN_BROUGHT_CHARGE = 20336;
      } else if (event >= 701 && event <= 750) {
        this.data.TRAIN_BROUGHT_CHARGE = 21530;
      } else if (event >= 751 && event <= 800) {
        this.data.TRAIN_BROUGHT_CHARGE = 22717;
      } else if (event >= 801 && event <= 850) {
        this.data.TRAIN_BROUGHT_CHARGE = 23898;
      } else if (event >= 851 && event <= 900) {
        this.data.TRAIN_BROUGHT_CHARGE = 25070;
      } else if (event >= 901 && event <= 950) {
        this.data.TRAIN_BROUGHT_CHARGE = 26244;
      } else if (event >= 951 && event <= 1000) {
        this.data.TRAIN_BROUGHT_CHARGE = 27410;
      } else if (event >= 1001 && event <= 1050) {
        this.data.TRAIN_BROUGHT_CHARGE = 28604;
      } else if (event >= 1051 && event <= 1100) {
        this.data.TRAIN_BROUGHT_CHARGE = 29791;
      } else if (event >= 1101 && event <= 1150) {
        this.data.TRAIN_BROUGHT_CHARGE = 30979;
      } else if (event >= 1151 && event <= 1200) {
        this.data.TRAIN_BROUGHT_CHARGE = 32159;
      } else if (event >= 1201 && event <= 1250) {
        this.data.TRAIN_BROUGHT_CHARGE = 41674;
      } else if (event >= 1251 && event <= 1300) {
        this.data.TRAIN_BROUGHT_CHARGE = 43158;
      } else if (event >= 1301 && event <= 1350) {
        this.data.TRAIN_BROUGHT_CHARGE = 44633;
      } else if (event >= 1351 && event <= 1400) {
        this.data.TRAIN_BROUGHT_CHARGE = 46100;
      } else if (event >= 1401 && event <= 1450) {
        this.data.TRAIN_BROUGHT_CHARGE = 47567;
      } else if (event >= 1451 && event <= 1500) {
        this.data.TRAIN_BROUGHT_CHARGE = 49033;
      } else if (event >= 1501 && event <= 1550) {
        this.data.TRAIN_BROUGHT_CHARGE = 50369;
      } else if (event >= 1551 && event <= 1600) {
        this.data.TRAIN_BROUGHT_CHARGE = 51704;
      } else if (event >= 1601 && event <= 1650) {
        this.data.TRAIN_BROUGHT_CHARGE = 53040;
      } else if (event >= 1651 && event <= 1700) {
        this.data.TRAIN_BROUGHT_CHARGE = 54367;
      } else if (event >= 1701 && event <= 1750) {
        this.data.TRAIN_BROUGHT_CHARGE = 55624;
      } else if (event >= 1751 && event <= 1800) {
        this.data.TRAIN_BROUGHT_CHARGE = 56881;
      } else if (event >= 1801 && event <= 1850) {
        this.data.TRAIN_BROUGHT_CHARGE = 57850;
      } else if (event >= 1851 && event <= 1900) {
        this.data.TRAIN_BROUGHT_CHARGE = 58802;
      } else if (event >= 1901 && event <= 1950) {
        this.data.TRAIN_BROUGHT_CHARGE = 59753;
      } else if (event >= 1951 && event <= 2000) {
        this.data.TRAIN_BROUGHT_CHARGE = 60687;
      } else {
        this.data.TRAIN_BROUGHT_CHARGE = null;
      }
    } else {
      this.data.TRAIN_BROUGHT_CHARGE = 0;
    }
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
          this.data.ASSUMPTION_CHARGE_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarassumptionCharge = false;
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
    this.api.deletePdf('lpc/' + data.LPC).subscribe((successCode) => {
      if (successCode['code'] == '200') {
        this.data.LPC = null;
        this.data.LPC_STATUS = null;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.getAfterDelete();
            this.progressBarlpc = false;
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
      .deletePdf('mandateForm/' + data.MANDATE_FORM)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.MANDATE_FORM = null;
          this.data.MANDATE_FORM_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarmandateForm = false;
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

  transferDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf(
        'transferServiceCertificate/' + data.TRANSFER_ORDER_SERVICE_CERTIFICATE
      )
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE = null;
          this.data.TRANSFER_ORDER_SERVICE_CERTIFICATE_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartransferServiceCertificate = false;
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

  boardingPassDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('ticketBoardingPass/' + data.TICKET_BOARDING_PASS)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TICKET_BOARDING_PASS = null;
          this.data.TICKET_BOARDING_PASS_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarticketBoardingPass = false;
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

  transBillDeleteConfirm(data) {
    this.isSpinning = true;
    this.api
      .deletePdf('transportationBills/' + data.TRANSPORTATION_BILLS)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.TRANSPORTATION_BILLS = null;
          this.data.TRANSPORTATION_BILLS_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBartransportationBills = false;
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
      .deletePdf('condolationOfDelay/' + data.CONDOLATION_OF_DELAY)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.data.CONDOLATION_OF_DELAY = null;
          this.data.CONDOLATION_OF_DELAY_STATUS = null;
          this.api.updatetransfer(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.getAfterDelete();
              this.progressBarcondolationOfDelay = false;
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

  changeondvance(event: any) {}

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

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const domains = ['@gmail.com', '@gmail.in'];
      let isDomainPresent = false;

      for (const domain of domains) {
        if (this.data.EMAIL_ID.endsWith(domain)) {
          isDomainPresent = true;
          break;
        }
      }

      if (!isDomainPresent) {
        this.data.EMAIL_ID += '@gmail.com'; // Default to @gmail.com if no domain is specified
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Tab') {
      const domains = ['@gmail.com', '@gmail.in'];
      let isDomainPresent = false;

      for (const domain of domains) {
        if (this.data.EMAIL_ID.endsWith(domain)) {
          isDomainPresent = true;
          break;
        }
      }

      if (!isDomainPresent) {
        this.data.EMAIL_ID += '@gmail.com'; // Default to @gmail.com if no domain is specified
      }
    }
  }
}
