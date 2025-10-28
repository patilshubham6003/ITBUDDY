import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { MisEmpMaster } from '../miseployee';
import { NonAcceptanceMaster } from '../nonacceptanceMasters';
import { DataNonAcceptanceMaster } from '../dataofacceptancelist';
import * as html2pdf from 'html2pdf.js';
import { HttpEventType } from '@angular/common/http';
import { SurrenderempMaster } from '../surrenderemp';
import { ChangeFlatCreateMaster } from '../changeflatCreateMaster';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-showcardsmis',
  templateUrl: './showcardsmis.component.html',
  styleUrls: ['./showcardsmis.component.css'],
  providers: [DatePipe]
})
export class ShowcardsmisComponent implements OnInit {
  dataList: any = [];
  loadingRecords = false;
  // totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  employeeID: any;
  Rulesandapply = false;
  Rulesandapply1 = false;

  stages123: any = 0;
  stageschange: any = 0;
  stageschangenon: any = 0;
  stageschangesurrender: any = 0;
  showsurrenderstepstrue: boolean = false;
  showchangestepstrue: boolean = true;
  cureeentdate = new Date();
  drawerTitle = '';
  drawerVisible: boolean = false;

  drawerTitle1 = '';
  drawerTitlenon = '';
  drawerTitlesurrender = '';


  drawerVisible1: boolean = false;
  drawerVisiblenon: boolean = false;
  drawerVisiblesurrender: boolean = false;


  dwisth: any = '100%'
  formTitle = 'MIS';
  searchText: string = ''
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  drawerData: MisEmpMaster = new MisEmpMaster();
  drawerData1: MisEmpMaster = new MisEmpMaster();
  drawerDatanon: NonAcceptanceMaster = new NonAcceptanceMaster();
  drawerDatanonsss: MisEmpMaster = new MisEmpMaster();
  drawerDatasurrender: SurrenderempMaster = new SurrenderempMaster();



  showCreaterequest: boolean = false;
  datenew = new Date();
  Senioritylist: any = [];
  Waitinglist: any = [];
  Publishedmonth = false;
  waitingmonth = false;
  Allotmentchecklistdata: any = [];
  remarkcondition: any;
  filter: boolean = false;
  currentDate: Date = new Date();
  datee: any
  // drawerData:any=[]
  currentStage: any;
  employeedata: any;
  employeedata1: any;
  employeedatanon: any;

  employeedatasurrender: any;

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
  applicationdate: any;
  applicationinfo: any;
  printformm: any;
  submitdate: any;
  approveddate: any;
  isdetailsfilled: boolean = false;
  isdraweropended: boolean = false;
  isdraweropended1: boolean = false;
  isdraweropendednon: boolean = false;
  isdraweropendedsurrender: boolean = false;

  changeswitch: boolean = true;
  surrenderswitch: boolean = false;

  dtalista: any = [];
  Timmerstartloop: any = [];
  Timmerendloop: any = [];
  i = 0;
  countdowndisable = true;
  Timmerstartloop2: any = [];
  Timmerendloop2: any = [];
  ii = 0;
  countdowndisable2 = true;
  ResidenceTypelist: any = []
  totalRecords: any = [];
  MONTH
  YEAR
  selectDate: any = new Date;
  Filterquery = '';
  isRecordLoading = false;
  altrue: boolean = false;
  acceptf: boolean = false;
  rejectf: boolean = false;
  allocatf: boolean = false;


  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {
    this.employeeID = sessionStorage.getItem('userId');
    // this.search();
    this.api.getemployeeresidencetype(0, 0, '', 'asc', '')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.ResidenceTypelist = data['data'];
        }
      },
        (error) => {
        }
      );
  }


  onesectionclick() {
    this.changeswitch = true;
    this.surrenderswitch = false;
  }
  twosectionclick() {
    this.changeswitch = false;
    this.surrenderswitch = true;
  }
  isButtonEnabled: boolean;
  shownonacceptanceb: boolean;
  getallocatedflats() {
    this.altrue = true;
    this.allocatf = true;
    this.MONTH1 = this.datepipe.transform(this.selectFromMonth, 'MM');
    this.MONTH2 = this.datepipe.transform(this.selectToMonth, 'MM');
    this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
    if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.YEAR1 != null &&
      this.YEAR1 != undefined &&
      this.YEAR1 != '' &&
      this.RESIDENCE_TYPE_ID != undefined &&
      this.RESIDENCE_TYPE_ID != null &&
      this.RESIDENCE_TYPE_ID != ''
    ) {
      this.Filterquery =
        ' AND MONTH BETWEEN ' +
        this.MONTH1 +
        ' AND ' +
        this.MONTH2 +
        ' AND YEAR = ' +
        this.YEAR1 +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.joinedResidencetype +
        ')';
      this.isRecordLoading = true;
      this.loadingRecords = true;

      this.api
        .getfinalallotementdetailss(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          this.sortValue,
          this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.dtalista = data['data'][0];
              if (this.dataList.length > 0) {
                var myButtonss = document.getElementById('myButton');
                if (myButtonss) {
                  const nonacceptancedate = new Date(data['data'][0]['ALLOTMENT_DATE_TIME']);
                  const eightDaysAfter = new Date(nonacceptancedate);
                  eightDaysAfter.setDate(eightDaysAfter.getDate() + 8);
                  const currentDatess = new Date();
                  if (currentDatess > eightDaysAfter) {
                    this.shownonacceptanceb = true;
                  }
                } else {
                }
                const receivedDate = new Date(data['data'][0]['INSPETOR_APPROVE_DATE_TIME']);

                // Calculate the date 9 days after the received date
                const nineDaysLater = new Date(receivedDate);
                nineDaysLater.setDate(receivedDate.getDate() + 9);

                // Get the current date and time
                const currentDate = new Date();

                if (currentDate >= receivedDate && currentDate <= nineDaysLater) {
                  // The button should be disabled within the 9-day range
                  this.isButtonEnabled = false;
                } else {
                  // The button should be enabled outside the 9-day range
                  this.isButtonEnabled = true;
                }



                this.ii = 2;
                this.Timmerstartloop2.length = this.dataList.length;
                this.Timmerendloop2.length = this.dataList.length;

                let timeremainingi2: any = [];
                let timeremaining22: any = [];
                timeremainingi2.length = this.dataList.length;
                timeremaining22.length = this.dataList.length;

                // endtimmer
                for (let cc = 0; cc < this.dataList.length; cc++) {
                  let sapandate2 = this.dataList[cc]['NON_ACCEPTANCE_END_DATE_TIME'];

                  let targetDate2 = new Date(sapandate2);
                  let countdownInterval12 = setInterval(() => {
                    const currentDate2 = new Date();
                    timeremaining22[cc] =
                      targetDate2.getTime() - currentDate2.getTime();

                    const seconds2 = Math.floor(timeremaining22[cc] / 1000);
                    const minutes2 = Math.floor(seconds2 / 60);
                    const hours2 = Math.floor(minutes2 / 60);
                    const days2 = Math.floor(hours2 / 24);
                    this.Timmerendloop2[cc] =
                      (days2 % 24) +
                      ' Day : ' +
                      (hours2 % 24) +
                      ' Hrs : ' +
                      (minutes2 % 60) +
                      ' Min : ' +
                      (seconds2 % 60) + ' Sec';
                    if (timeremaining22[cc] <= 0) {
                      this.countdowndisable2 = false;
                      clearInterval(countdownInterval12);
                      this.ii = 2;
                      this.Timmerendloop2[cc] = 0;
                      timeremaining22[cc] = 0;
                    }
                  }, 1000);
                }

                this.i = 2;
                this.Timmerstartloop.length = this.dataList.length;
                this.Timmerendloop.length = this.dataList.length;

                let timeremaining: any = [];
                let timeremaining2: any = [];
                timeremaining.length = this.dataList.length;
                timeremaining2.length = this.dataList.length;
                // starttimmer
                for (let ab = 0; ab < this.dataList.length; ab++) {
                  let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                  let targetDate = new Date(startdate);

                  let countdownInterval = setInterval(() => {
                    const currentDate = new Date();
                    timeremaining[ab] =
                      targetDate.getTime() - currentDate.getTime();
                    const seconds = Math.floor(timeremaining[ab] / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    this.Timmerstartloop[ab] =
                      (days % 24) +
                      ' Day : ' +
                      (hours % 24) +
                      ' Hrs : ' +
                      (minutes % 60) +
                      ' Min : ' +
                      (seconds % 60) + ' Sec';
                    if (timeremaining[ab] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(countdownInterval);
                      this.i = 2;
                      this.Timmerstartloop[ab] = 0;
                      timeremaining[ab] = 0;
                    }
                  }, 1000);
                }

                // endtimmer
                for (let cc = 0; cc < this.dataList.length; cc++) {
                  let sapandate = this.dataList[cc]['ACCEPTANCE_END_DATE_TIME'];

                  let targetDate = new Date(sapandate);
                  let countdownInterval1 = setInterval(() => {
                    const currentDate = new Date();
                    timeremaining2[cc] =
                      targetDate.getTime() - currentDate.getTime();

                    const seconds = Math.floor(timeremaining2[cc] / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    this.Timmerendloop[cc] =
                      (days % 24) +
                      ' Day : ' +
                      (hours % 24) +
                      ' Hrs : ' +
                      (minutes % 60) +
                      ' Min : ' +
                      (seconds % 60) + ' Sec';
                    if (timeremaining2[cc] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(countdownInterval1);
                      this.i = 2;
                      this.Timmerendloop[cc] = 0;
                      timeremaining2[cc] = 0;
                    }
                  }, 1000);
                }
              }
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    } else {
      this.Filterquery =
        ' AND MONTH BETWEEN ' +
        this.MONTH1 +
        ' AND ' +
        this.MONTH2 +
        ' AND YEAR  = ' +
        this.YEAR1;
      this.loadingRecords = true;
      this.api
        .getfinalallotementdetailss(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          this.sortValue,
          this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
        )
        // this.MONTH,this.MONTH,this.YEAR,''
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.dtalista = data['data'][0];
              if (this.dataList.length > 0) {
                var myButtonss = document.getElementById('myButton');
                if (myButtonss) {
                  const nonacceptancedate = new Date(data['data'][0]['ALLOTMENT_DATE_TIME']);
                  const eightDaysAfter = new Date(nonacceptancedate);
                  eightDaysAfter.setDate(eightDaysAfter.getDate() + 8);
                  const currentDatess = new Date();
                  if (currentDatess > eightDaysAfter) {
                    this.shownonacceptanceb = true;
                  }
                } else {
                }

                const receivedDate = new Date(data['data'][0]['INSPETOR_APPROVE_DATE_TIME']);
                // Calculate the date 9 days after the received date
                const nineDaysLater = new Date(receivedDate);
                nineDaysLater.setDate(receivedDate.getDate() + 9);
                // Get the current date and time
                const currentDate = new Date();
                if (currentDate >= receivedDate && currentDate <= nineDaysLater) {
                  // The button should be disabled within the 9-day range
                  this.isButtonEnabled = false;
                } else {
                  // The button should be enabled outside the 9-day range
                  this.isButtonEnabled = true;
                }

                this.ii = 2;
                this.Timmerstartloop2.length = this.dataList.length;
                this.Timmerendloop2.length = this.dataList.length;

                let timeremainingi2: any = [];
                let timeremaining22: any = [];
                timeremainingi2.length = this.dataList.length;
                timeremaining22.length = this.dataList.length;

                // endtimmer
                for (let cc = 0; cc < this.dataList.length; cc++) {
                  let sapandate2 = this.dataList[cc]['NON_ACCEPTANCE_END_DATE_TIME'];

                  let targetDate2 = new Date(sapandate2);
                  let countdownInterval12 = setInterval(() => {
                    const currentDate2 = new Date();
                    timeremaining22[cc] =
                      targetDate2.getTime() - currentDate2.getTime();

                    const seconds2 = Math.floor(timeremaining22[cc] / 1000);
                    const minutes2 = Math.floor(seconds2 / 60);
                    const hours2 = Math.floor(minutes2 / 60);
                    const days2 = Math.floor(hours2 / 24);
                    this.Timmerendloop2[cc] =
                      (days2 % 24) +
                      ' Day : ' +
                      (hours2 % 24) +
                      ' Hrs : ' +
                      (minutes2 % 60) +
                      ' Min : ' +
                      (seconds2 % 60) + ' Sec';
                    if (timeremaining22[cc] <= 0) {
                      this.countdowndisable2 = false;
                      clearInterval(countdownInterval12);
                      this.ii = 2;
                      this.Timmerendloop2[cc] = 0;
                      timeremaining22[cc] = 0;
                    }
                  }, 1000);
                }

                this.i = 2;
                this.Timmerstartloop.length = this.dataList.length;
                this.Timmerendloop.length = this.dataList.length;
                let timeremaining: any = [];
                let timeremaining2: any = [];
                timeremaining.length = this.dataList.length;
                timeremaining2.length = this.dataList.length;
                // starttimmer
                for (let ab = 0; ab < this.dataList.length; ab++) {
                  let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                  let targetDate = new Date(startdate);
                  let countdownInterval = setInterval(() => {
                    const currentDate = new Date();
                    timeremaining[ab] =
                      targetDate.getTime() - currentDate.getTime();
                    const seconds = Math.floor(timeremaining[ab] / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    this.Timmerstartloop[ab] =
                      (days % 24) +
                      ' Day : ' +
                      (hours % 24) +
                      ' Hrs : ' +
                      (minutes % 60) +
                      ' Min : ' +
                      (seconds % 60) + ' Sec';
                    if (timeremaining[ab] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(countdownInterval);
                      this.i = 2;
                      this.Timmerstartloop[ab] = 0;
                      timeremaining[ab] = 0;
                    }
                  }, 1000);
                }
                // endtimmer
                for (let cc = 0; cc < this.dataList.length; cc++) {
                  let sapandate = this.dataList[cc]['ACCEPTANCE_END_DATE_TIME'];

                  let targetDate = new Date(sapandate);
                  let countdownInterval1 = setInterval(() => {
                    const currentDate = new Date();
                    timeremaining2[cc] =
                      targetDate.getTime() - currentDate.getTime();
                    const seconds = Math.floor(timeremaining2[cc] / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    this.Timmerendloop[cc] =
                      (days % 24) +
                      ' Day : ' +
                      (hours % 24) +
                      ' Hrs : ' +
                      (minutes % 60) +
                      ' Min : ' +
                      (seconds % 60) + ' Sec';
                    if (timeremaining2[cc] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(countdownInterval1);
                      this.i = 2;
                      this.Timmerendloop[cc] = 0;
                      timeremaining2[cc] = 0;
                    }
                  }, 1000);
                }
              }
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    }
  }

  getacceptedflats() {
    this.altrue = true;
    this.acceptf = true;
    this.loadingRecords = true;
    this.MONTH1 = this.datepipe.transform(this.selectFromMonth, 'MM');
    this.MONTH2 = this.datepipe.transform(this.selectToMonth, 'MM');
    this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
    if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.YEAR1 != null &&
      this.YEAR1 != undefined &&
      this.YEAR1 != '' &&
      this.RESIDENCE_TYPE_ID != undefined &&
      this.RESIDENCE_TYPE_ID != null &&
      this.RESIDENCE_TYPE_ID != ''
    ) {
      this.Filterquery =
        ' AND MONTH BETWEEN ' +
        this.MONTH1 +
        ' AND ' +
        this.MONTH2 +
        ' AND YEAR = ' +
        this.YEAR1 +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.joinedResidencetype +
        ')';
      this.api
        .getfinalflattakenEmployeeLists(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          this.sortValue,
          this.Filterquery + " AND STATUS = 'Y' AND TAKEN_STATUS = 'A' AND INSPECTOR_STATUS = 'A' AND EMP_ID=" + this.employeeID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.dtalista = data['data'][0];
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    } else {
      this.Filterquery =
        ' AND MONTH BETWEEN ' +
        this.MONTH1 +
        ' AND ' +
        this.MONTH2 +
        ' AND YEAR  = ' +
        this.YEAR1;
      this.loadingRecords = true;
      this.api
        .getfinalflattakenEmployeeLists(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          this.sortValue,
          this.Filterquery + " AND STATUS = 'Y' AND TAKEN_STATUS = 'A' AND INSPECTOR_STATUS = 'A' AND EMP_ID=" + this.employeeID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.dtalista = data['data'][0];
            }
          },
          (err) => {
            this.loadingRecords = false;
          }
        );
    }
  }

  getrejectedflats() {
    this.altrue = true;
    this.rejectf = true;
    this.loadingRecords = true;
    this.api
      .getfinalallotementdetailss(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        " AND STATUS = 'Y' AND ( TAKEN_STATUS = 'R' OR INSPECTOR_STATUS = 'R' OR TAKEN_STATUS = 'O') AND EMP_ID=" + this.employeeID        
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.dtalista = data['data'][0];
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  // isButtonEnabled:boolean=false;
  backtopre() {
    this.altrue = false;
    this.acceptf = false;
    this.rejectf = false;
    this.allocatf = false;
  }
  search() {
    this.MONTH1 = this.datepipe.transform(this.selectFromMonth, 'MM');
    this.MONTH2 = this.datepipe.transform(this.selectToMonth, 'MM');
    this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
    if (this.allocatf) {
      if (
        this.MONTH1 != null &&
        this.MONTH1 != undefined &&
        this.MONTH1 != '' &&
        this.MONTH2 != null &&
        this.MONTH2 != undefined &&
        this.MONTH2 != '' &&
        this.YEAR1 != null &&
        this.YEAR1 != undefined &&
        this.YEAR1 != '' &&
        this.RESIDENCE_TYPE_ID != undefined &&
        this.RESIDENCE_TYPE_ID != null &&
        this.RESIDENCE_TYPE_ID != ''
      ) {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR = ' +
          this.YEAR1 +
          ' AND RESIDENCE_TYPE_ID IN (' +
          this.joinedResidencetype +
          ')';
        this.isRecordLoading = true;
        this.api
          .getfinalallotementdetailss(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
          )
          // this.MONTH1,this.MONTH2,this.YEAR1,this.joinedResidencetype
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];

                if (this.dataList.length > 0) {

                  var myButtonss = document.getElementById('myButton');
                  if (myButtonss) {
                    const nonacceptancedate = new Date(data['data'][0]['ALLOTMENT_DATE_TIME']);
                    const eightDaysAfter = new Date(nonacceptancedate);
                    eightDaysAfter.setDate(eightDaysAfter.getDate() + 8);
                    const currentDatess = new Date();
                    if (currentDatess > eightDaysAfter) {
                      this.shownonacceptanceb = true;
                    }
                  } else {
                  }

                  const receivedDate = new Date(data['data'][0]['INSPETOR_APPROVE_DATE_TIME']);

                  // Calculate the date 9 days after the received date
                  const nineDaysLater = new Date(receivedDate);
                  nineDaysLater.setDate(receivedDate.getDate() + 9);

                  // Get the current date and time
                  const currentDate = new Date();

                  if (currentDate >= receivedDate && currentDate <= nineDaysLater) {
                    // The button should be disabled within the 9-day range
                    this.isButtonEnabled = false;
                  } else {
                    // The button should be enabled outside the 9-day range
                    this.isButtonEnabled = true;
                  }
                  this.ii = 2;
                  this.Timmerstartloop2.length = this.dataList.length;
                  this.Timmerendloop2.length = this.dataList.length;

                  let timeremainingi2: any = [];
                  let timeremaining22: any = [];
                  timeremainingi2.length = this.dataList.length;
                  timeremaining22.length = this.dataList.length;

                  // endtimmer
                  for (let cc = 0; cc < this.dataList.length; cc++) {
                    let sapandate2 = this.dataList[cc]['NON_ACCEPTANCE_END_DATE_TIME'];

                    let targetDate2 = new Date(sapandate2);
                    let countdownInterval12 = setInterval(() => {
                      const currentDate2 = new Date();
                      timeremaining22[cc] =
                        targetDate2.getTime() - currentDate2.getTime();

                      const seconds2 = Math.floor(timeremaining22[cc] / 1000);
                      const minutes2 = Math.floor(seconds2 / 60);
                      const hours2 = Math.floor(minutes2 / 60);
                      const days2 = Math.floor(hours2 / 24);
                      this.Timmerendloop2[cc] =
                        (days2 % 24) +
                        ' Day : ' +
                        (hours2 % 24) +
                        ' Hrs : ' +
                        (minutes2 % 60) +
                        ' Min : ' +
                        (seconds2 % 60) + ' Sec';
                      if (timeremaining22[cc] <= 0) {
                        this.countdowndisable2 = false;
                        clearInterval(countdownInterval12);
                        this.ii = 2;
                        this.Timmerendloop2[cc] = 0;
                        timeremaining22[cc] = 0;
                      }
                    }, 1000);
                  }



                  this.i = 2;
                  this.Timmerstartloop.length = this.dataList.length;
                  this.Timmerendloop.length = this.dataList.length;

                  let timeremaining: any = [];
                  let timeremaining2: any = [];
                  timeremaining.length = this.dataList.length;
                  timeremaining2.length = this.dataList.length;
                  // starttimmer
                  for (let ab = 0; ab < this.dataList.length; ab++) {
                    let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                    let targetDate = new Date(startdate);

                    let countdownInterval = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining[ab] =
                        targetDate.getTime() - currentDate.getTime();
                      const seconds = Math.floor(timeremaining[ab] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerstartloop[ab] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining[ab] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval);
                        this.i = 2;
                        this.Timmerstartloop[ab] = 0;
                        timeremaining[ab] = 0;
                      }
                    }, 1000);
                  }

                  // endtimmer
                  for (let cc = 0; cc < this.dataList.length; cc++) {
                    let sapandate = this.dataList[cc]['ACCEPTANCE_END_DATE_TIME'];

                    let targetDate = new Date(sapandate);
                    let countdownInterval1 = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining2[cc] =
                        targetDate.getTime() - currentDate.getTime();

                      const seconds = Math.floor(timeremaining2[cc] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerendloop[cc] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining2[cc] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval1);
                        this.i = 2;
                        this.Timmerendloop[cc] = 0;
                        timeremaining2[cc] = 0;
                      }
                    }, 1000);
                  }
                }
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      } else {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR  = ' +
          this.YEAR1;
        this.loadingRecords = true;
        this.api
          .getfinalallotementdetailss(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
          )
          // this.MONTH,this.MONTH,this.YEAR,''
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];

                if (this.dataList.length > 0) {
                  var myButtonss = document.getElementById('myButton');
                  if (myButtonss) {
                    const nonacceptancedate = new Date(data['data'][0]['ALLOTMENT_DATE_TIME']);
                    const eightDaysAfter = new Date(nonacceptancedate);
                    eightDaysAfter.setDate(eightDaysAfter.getDate() + 8);
                    const currentDatess = new Date();
                    if (currentDatess > eightDaysAfter) {
                      this.shownonacceptanceb = true;
                    }
                  } else {
                  }



                  const receivedDate = new Date(data['data'][0]['INSPETOR_APPROVE_DATE_TIME']);

                  // Calculate the date 9 days after the received date
                  const nineDaysLater = new Date(receivedDate);
                  nineDaysLater.setDate(receivedDate.getDate() + 9);

                  // Get the current date and time
                  const currentDate = new Date();

                  if (currentDate >= receivedDate && currentDate <= nineDaysLater) {
                    // The button should be disabled within the 9-day range
                    this.isButtonEnabled = false;
                  } else {
                    // The button should be enabled outside the 9-day range
                    this.isButtonEnabled = true;
                  }
                  this.ii = 2;
                  this.Timmerstartloop2.length = this.dataList.length;
                  this.Timmerendloop2.length = this.dataList.length;

                  let timeremainingi2: any = [];
                  let timeremaining22: any = [];
                  timeremainingi2.length = this.dataList.length;
                  timeremaining22.length = this.dataList.length;

                  // endtimmer
                  for (let cc = 0; cc < this.dataList.length; cc++) {
                    let sapandate2 = this.dataList[cc]['NON_ACCEPTANCE_END_DATE_TIME'];

                    let targetDate2 = new Date(sapandate2);
                    let countdownInterval12 = setInterval(() => {
                      const currentDate2 = new Date();
                      timeremaining22[cc] =
                        targetDate2.getTime() - currentDate2.getTime();

                      const seconds2 = Math.floor(timeremaining22[cc] / 1000);
                      const minutes2 = Math.floor(seconds2 / 60);
                      const hours2 = Math.floor(minutes2 / 60);
                      const days2 = Math.floor(hours2 / 24);
                      this.Timmerendloop2[cc] =
                        (days2 % 24) +
                        ' Day : ' +
                        (hours2 % 24) +
                        ' Hrs : ' +
                        (minutes2 % 60) +
                        ' Min : ' +
                        (seconds2 % 60) + ' Sec';
                      if (timeremaining22[cc] <= 0) {
                        this.countdowndisable2 = false;
                        clearInterval(countdownInterval12);
                        this.ii = 2;
                        this.Timmerendloop2[cc] = 0;
                        timeremaining22[cc] = 0;
                      }
                    }, 1000);
                  }



                  this.i = 2;
                  this.Timmerstartloop.length = this.dataList.length;
                  this.Timmerendloop.length = this.dataList.length;

                  let timeremaining: any = [];
                  let timeremaining2: any = [];
                  timeremaining.length = this.dataList.length;
                  timeremaining2.length = this.dataList.length;
                  // starttimmer
                  for (let ab = 0; ab < this.dataList.length; ab++) {
                    let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                    let targetDate = new Date(startdate);

                    let countdownInterval = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining[ab] =
                        targetDate.getTime() - currentDate.getTime();
                      const seconds = Math.floor(timeremaining[ab] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerstartloop[ab] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining[ab] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval);
                        this.i = 2;
                        this.Timmerstartloop[ab] = 0;
                        timeremaining[ab] = 0;
                      }
                    }, 1000);
                  }

                  // endtimmer
                  for (let cc = 0; cc < this.dataList.length; cc++) {
                    let sapandate = this.dataList[cc]['ACCEPTANCE_END_DATE_TIME'];

                    let targetDate = new Date(sapandate);
                    let countdownInterval1 = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining2[cc] =
                        targetDate.getTime() - currentDate.getTime();

                      const seconds = Math.floor(timeremaining2[cc] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerendloop[cc] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining2[cc] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval1);
                        this.i = 2;
                        this.Timmerendloop[cc] = 0;
                        timeremaining2[cc] = 0;
                      }
                    }, 1000);
                  }
                }
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      }
    } else if (this.acceptf) {
      if (
        this.MONTH1 != null &&
        this.MONTH1 != undefined &&
        this.MONTH1 != '' &&
        this.MONTH2 != null &&
        this.MONTH2 != undefined &&
        this.MONTH2 != '' &&
        this.YEAR1 != null &&
        this.YEAR1 != undefined &&
        this.YEAR1 != '' &&
        this.RESIDENCE_TYPE_ID != undefined &&
        this.RESIDENCE_TYPE_ID != null &&
        this.RESIDENCE_TYPE_ID != ''
      ) {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR = ' +
          this.YEAR1 +
          ' AND RESIDENCE_TYPE_ID IN (' +
          this.joinedResidencetype +
          ')';
        this.isRecordLoading = true;
        this.api
          .getfinalflattakenEmployeeLists(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND TAKEN_STATUS = 'A' AND INSPECTOR_STATUS = 'A' AND EMP_ID=" + this.employeeID
          )
          // this.MONTH1,this.MONTH2,this.YEAR1,this.joinedResidencetype
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      } else {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR  = ' +
          this.YEAR1;
        this.loadingRecords = true;
        this.api
          .getfinalflattakenEmployeeLists(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND TAKEN_STATUS = 'A' AND INSPECTOR_STATUS = 'A' AND EMP_ID=" + this.employeeID
          )
          // this.MONTH,this.MONTH,this.YEAR,''
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      }
    } else if (this.rejectf) {
      if (
        this.MONTH1 != null &&
        this.MONTH1 != undefined &&
        this.MONTH1 != '' &&
        this.MONTH2 != null &&
        this.MONTH2 != undefined &&
        this.MONTH2 != '' &&
        this.YEAR1 != null &&
        this.YEAR1 != undefined &&
        this.YEAR1 != '' &&
        this.RESIDENCE_TYPE_ID != undefined &&
        this.RESIDENCE_TYPE_ID != null &&
        this.RESIDENCE_TYPE_ID != ''
      ) {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR = ' +
          this.YEAR1 +
          ' AND RESIDENCE_TYPE_ID IN (' +
          this.joinedResidencetype +
          ')';
        this.isRecordLoading = true;
        this.api
          .getfinalallotementdetailss(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND ( TAKEN_STATUS = 'R' OR INSPECTOR_STATUS = 'R' OR TAKEN_STATUS = 'O') AND EMP_ID=" + this.employeeID
          )
          // this.MONTH1,this.MONTH2,this.YEAR1,this.joinedResidencetype
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      } else {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR  = ' +
          this.YEAR1;
        this.loadingRecords = true;
        this.api
          .getfinalallotementdetailss(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND ( TAKEN_STATUS = 'R' OR INSPECTOR_STATUS = 'R' OR TAKEN_STATUS = 'O') AND EMP_ID=" + this.employeeID
          )
          // this.MONTH,this.MONTH,this.YEAR,''
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      }
    } else {
      if (
        this.MONTH1 != null &&
        this.MONTH1 != undefined &&
        this.MONTH1 != '' &&
        this.MONTH2 != null &&
        this.MONTH2 != undefined &&
        this.MONTH2 != '' &&
        this.YEAR1 != null &&
        this.YEAR1 != undefined &&
        this.YEAR1 != '' &&
        this.RESIDENCE_TYPE_ID != undefined &&
        this.RESIDENCE_TYPE_ID != null &&
        this.RESIDENCE_TYPE_ID != ''
      ) {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR = ' +
          this.YEAR1 +
          ' AND RESIDENCE_TYPE_ID IN (' +
          this.joinedResidencetype +
          ')';
        this.isRecordLoading = true;
        this.api
          .getfinalallotementdetailss(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
          )
          // this.MONTH1,this.MONTH2,this.YEAR1,this.joinedResidencetype
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];

                if (this.dataList.length > 0) {
                  const receivedDate = new Date(data['data'][0]['INSPETOR_APPROVE_DATE_TIME']);

                  // Calculate the date 9 days after the received date
                  const nineDaysLater = new Date(receivedDate);
                  nineDaysLater.setDate(receivedDate.getDate() + 9);

                  // Get the current date and time
                  const currentDate = new Date();

                  if (currentDate >= receivedDate && currentDate <= nineDaysLater) {
                    // The button should be disabled within the 9-day range
                    this.isButtonEnabled = false;
                  } else {
                    // The button should be enabled outside the 9-day range
                    this.isButtonEnabled = true;
                  }
                  this.i = 2;
                  this.Timmerstartloop.length = this.dataList.length;
                  this.Timmerendloop.length = this.dataList.length;

                  let timeremaining: any = [];
                  let timeremaining2: any = [];
                  timeremaining.length = this.dataList.length;
                  timeremaining2.length = this.dataList.length;
                  // starttimmer
                  for (let ab = 0; ab < this.dataList.length; ab++) {
                    let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                    let targetDate = new Date(startdate);

                    let countdownInterval = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining[ab] =
                        targetDate.getTime() - currentDate.getTime();
                      const seconds = Math.floor(timeremaining[ab] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerstartloop[ab] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining[ab] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval);
                        this.i = 2;
                        this.Timmerstartloop[ab] = 0;
                        timeremaining[ab] = 0;
                      }
                    }, 1000);
                  }

                  // endtimmer
                  for (let cc = 0; cc < this.dataList.length; cc++) {
                    let sapandate = this.dataList[cc]['ACCEPTANCE_END_DATE_TIME'];

                    let targetDate = new Date(sapandate);
                    let countdownInterval1 = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining2[cc] =
                        targetDate.getTime() - currentDate.getTime();

                      const seconds = Math.floor(timeremaining2[cc] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerendloop[cc] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining2[cc] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval1);
                        this.i = 2;
                        this.Timmerendloop[cc] = 0;
                        timeremaining2[cc] = 0;
                      }
                    }, 1000);
                  }
                }
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      } else {
        this.Filterquery =
          ' AND MONTH BETWEEN ' +
          this.MONTH1 +
          ' AND ' +
          this.MONTH2 +
          ' AND YEAR  = ' +
          this.YEAR1;
        this.loadingRecords = true;
        this.api
          .getfinalallotementdetailss(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            this.sortValue,
            this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
          )
          // this.MONTH,this.MONTH,this.YEAR,''
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.totalRecords = data['count'];
                this.dataList = data['data'];
                this.dtalista = data['data'][0];

                if (this.dataList.length > 0) {
                  const receivedDate = new Date(data['data'][0]['INSPETOR_APPROVE_DATE_TIME']);

                  // Calculate the date 9 days after the received date
                  const nineDaysLater = new Date(receivedDate);
                  nineDaysLater.setDate(receivedDate.getDate() + 9);

                  // Get the current date and time
                  const currentDate = new Date();

                  if (currentDate >= receivedDate && currentDate <= nineDaysLater) {
                    // The button should be disabled within the 9-day range
                    this.isButtonEnabled = false;
                  } else {
                    // The button should be enabled outside the 9-day range
                    this.isButtonEnabled = true;
                  }
                  this.i = 2;
                  this.Timmerstartloop.length = this.dataList.length;
                  this.Timmerendloop.length = this.dataList.length;

                  let timeremaining: any = [];
                  let timeremaining2: any = [];
                  timeremaining.length = this.dataList.length;
                  timeremaining2.length = this.dataList.length;
                  // starttimmer
                  for (let ab = 0; ab < this.dataList.length; ab++) {
                    let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                    let targetDate = new Date(startdate);

                    let countdownInterval = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining[ab] =
                        targetDate.getTime() - currentDate.getTime();
                      const seconds = Math.floor(timeremaining[ab] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerstartloop[ab] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining[ab] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval);
                        this.i = 2;
                        this.Timmerstartloop[ab] = 0;
                        timeremaining[ab] = 0;
                      }
                    }, 1000);
                  }

                  // endtimmer
                  for (let cc = 0; cc < this.dataList.length; cc++) {
                    let sapandate = this.dataList[cc]['ACCEPTANCE_END_DATE_TIME'];

                    let targetDate = new Date(sapandate);
                    let countdownInterval1 = setInterval(() => {
                      const currentDate = new Date();
                      timeremaining2[cc] =
                        targetDate.getTime() - currentDate.getTime();

                      const seconds = Math.floor(timeremaining2[cc] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerendloop[cc] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) + ' Sec';
                      if (timeremaining2[cc] <= 0) {
                        this.countdowndisable = false;
                        clearInterval(countdownInterval1);
                        this.i = 2;
                        this.Timmerendloop[cc] = 0;
                        timeremaining2[cc] = 0;
                      }
                    }, 1000);
                  }
                }
              }
            },
            (err) => {
              this.loadingRecords = false;
            }
          );
      }
    }
  }

  viewAOL(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'authorisationOccupationLetter/' + pdfURL;
    window.open(fileUrl)
  }
  viewPAL(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'physicalOccupancyLetter/' + pdfURL;
    window.open(fileUrl)
  }
  viewAccl(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'acceptanceLetter/' + pdfURL;
    window.open(fileUrl)
  }
  viewallocation(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + pdfURL;
    window.open(fileUrl)
  }
  viewAFL(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'finalAllotmentList/' + pdfURL;
    window.open(fileUrl)
  }
  viewfinalsc(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'finalList/' + pdfURL;
    window.open(fileUrl)
  }
  checkstep(data: any, n) {

    if (data.INSPECTOR_STATUS == 'A' || data.INSPECTOR_STATUS == 'R') {
      return 4;
    } else if (data.STEP_NO == 2) {
      return 3;
    } else if (data.STEP_NO == 1) {
      return 1;
    } else if (data.STEP_NO == 0) {
      return 0;
    } else {
      return 0;
    }
  }

  getdateee(event: any) {
    var remainingDays = 0;
    var targetDate = new Date(event);
    var currentDate = new Date();
    const differenceMilliseconds = targetDate.getTime() - currentDate.getTime();
    // Calculate the remaining days by converting milliseconds to days.
    remainingDays = Math.ceil(differenceMilliseconds / (1000 * 60 * 60 * 24));
    return remainingDays;
  }

  checkstep1(data: any, n) {
    if (data.INSPECTOR_FINAL_STATUS == 'R' || data.INSPECTOR_FINAL_STATUS == 'A' || data.INSPECTOR_TECHNICAL_STATUS == 'A' || data.INSPECTOR_TECHNICAL_STATUS == 'R') {
      return 5;
    } else if (data.OCCUPANCY_TYPE == 'P' || data.OCCUPANCY_TYPE == 'T') {
      return 4;
    } else if (data.SEND_TO_CARETAKER_DATE_TIME != null) {
      return 3;
    }
    // else if (data.AUTHORISATION_OCCUPATION_LETTER != null) {
    //   return 3;
    // } 
    else if (data.ALLOTMENT_FINAL_LETTER != null) {
      return 2;
    } if (data.ACCEPTANCE_LETTER != null) {
      return 1;
    } else {
      return 0;
    }
  }



  //   checkstep1(data: any, n) {
  //     if (data.INSPECTOR_FINAL_STATUS == 'R' || data.INSPECTOR_FINAL_STATUS=='A' || data.INSPECTOR_TECHNICAL_STATUS=='A' || data.INSPECTOR_TECHNICAL_STATUS=='R') {
  //      return 6;
  //    }else if (data.OCCUPANCY_TYPE == 'P' || data.OCCUPANCY_TYPE=='T') {
  //      return 5;
  //    }else if (data.SEND_TO_CARETAKER_DATE_TIME != null) {
  //      return 4;
  //    } else if (data.AUTHORISATION_OCCUPATION_LETTER != null) {
  //      return 3;
  //    } else if (data.ALLOTMENT_FINAL_LETTER != null) {
  //      return 2;
  //    } if (data.ACCEPTANCE_LETTER != null) {
  //      return 1;
  //    } else {
  //      return 0;
  //    }
  //  }


  checkstepphysical1(data: any, n) {
    if (data.INSPECTOR_FINAL_STATUS == 'R' || data.INSPECTOR_FINAL_STATUS == 'A') {
      return 5;
    } else if (data.PHYSICAL_OCCUPANCY_LETTER != null) {
      return 4;
    } else if (data.PHYSICAL_OCCUPANCY_LETTER == null) {
      return 3;
    } else if (data.SEND_TO_CARETAKER_DATE_TIME != null) {
      return 3;
    }
    // else if (data.AUTHORISATION_OCCUPATION_LETTER != null) {
    //   return 3;
    // } 
    else if (data.ALLOTMENT_FINAL_LETTER != null) {
      return 1;
    } if (data.ACCEPTANCE_LETTER != null) {
      return 0;
    } else {
      return 0;
    }
  }
  checkstepnon1(data: any, n) {
    if (data.NON_ACCEPTANCE_INSPECTOR_STATUS != 'A' || data.NON_ACCEPTANCE_INSPECTOR_STATUS != 'R') {
      return 3;
    } else if (data.NON_ACCEPTANCE_INSPECTOR_STATUS == 'A' || data.NON_ACCEPTANCE_INSPECTOR_STATUS == 'R') {
      return 3;
    }
    // else if (data.AUTHORISATION_OCCUPATION_LETTER != null) {
    //   return 3;
    // } 
    else if (data.ALLOTMENT_FINAL_LETTER != null) {
      return 2;
    } if (data.ACCEPTANCE_LETTER != null) {
      return 1;
    } else {
      return 0;
    }
  }

  checkstepnon2(data: any, n) {
    if (data.NON_ACCEPTANCE_INSPECTOR_STATUS == 'R') {
      return 2;
    } else if (data.NON_ACCEPTANCE_INSPECTOR_STATUS != 'A' || data.NON_ACCEPTANCE_INSPECTOR_STATUS != 'R') {
      return 3;
    } else if (data.NON_ACCEPTANCE_INSPECTOR_STATUS == 'A' || data.NON_ACCEPTANCE_INSPECTOR_STATUS == 'R') {
      return 3;
    }
    // else if (data.AUTHORISATION_OCCUPATION_LETTER != null) {
    //   return 3;
    // }
    else if (data.ALLOTMENT_FINAL_LETTER != null) {
      return 2;
    } if (data.ACCEPTANCE_LETTER != null) {
      return 1;
    } else {
      return 0;
    }
  }


  checkstep2(data: any, n) {
    if (data.NON_ACCEPTANCE_FORM_SUBMITTED_DATE_TIME != null) {
      return 3;
    } else if (data.NON_ACCEPTANCE_STEP_NO == 1) {
      return 1;
    } else if (data.NON_ACCEPTANCE_STEP_NO == 0) {
      return 0;
    } else {
      return 0;
    }
  }


  checkstepchange(data: any, n) {
    if (data.CHANGE_INSPECTOR_STATUS == 'A' || data.CHANGE_INSPECTOR_STATUS == 'R') {
      return 3;
    } else if (data.APPLIED_FOR_CHANGE_DATE_TIME != null) {
      return 2;
    } else if (data.CHANGE_PRINT_DATE_TIME != null) {
      return 1;
    } else if (data.CHANGE_PRINT_DATE_TIME == null) {
      return 0;
    } else {
      return 0;
    }
  }


  checkstepsurrender(data: any, n) {
    if (data.SURRENDER_INSPECTOR_APPROVED_DATE_TIME != null) {
      return 4;
    } else if (data.SURRENDER_CARETAKER_APPROVED_DATE_TIME != null) {
      return 3;
    } else if (data.SURRENDER_FORM_SUBMITTED_DATE_TIME != null) {
      return 2;
    } else if (data.SURRENDER_PRINT_DATE_TIME != null) {
      return 1;
    } else if (data.SURRENDER_PRINT_DATE_TIME == null) {
      return 0;
    } else {
      return 0;
    }
  }
  showw(i: any) {
    if (this.Timmerendloop[i] > 0 || this.Timmerendloop[i] != '') {
      return false;
    } else if (this.Timmerendloop[i] == 0) {
      return true;
    } else {
      return true;
    }
  }
  add(): void {
    this.Rulesandapply = true;
  }
  add1(): void {
    this.Rulesandapply1 = true;
  }
  checktoccuboole: boolean = false;
  checktoccu(data: any): void {
    this.checktoccuboole = true;
    this.storeacceptcarddata = data;
  }
  cancelchecktoccu(): void {
    this.checktoccuboole = false;
  }
  selectoccupancy: boolean = false
  selectocuu(show: any) {
    this.physicalloading = true
    // this.selectoccupancy = true;
    this.storeacceptcarddata = show;
    this.storeacceptcarddata.OCCUPANCY_TYPE = "P"
    this.viewphysicaloccupancyModalVisible = true

    this.viewpdfphysical = this.sanitizer.bypassSecurityTrustResourceUrl(this.api.retriveimgUrl + 'physicalOccupancyLetter/' + this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER);
    this.physicalloading = false

  }
  physicalloading: boolean = false

  printupload: boolean = false;

  Showoccupancylater(show: any) {
    this.printupload = true;
    this.storeacceptcarddata = show;

  }

  downloadPdfdraft() {
    this.loadingRecords = true;
    const element = document.getElementById('printpageform1');
    const opt = {
      margin: 0.2,
      filename: 'Physical Occupation Report.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.loadingRecords = false;
    }, 5000);
  }
  sendforveri = false;
  cancelsendtoc() {
    this.sendforveri = false;
  }
  sendtoc(data: any) {
    this.sendforveri = true;
    this.storeacceptcarddata = data;
  }
  nonacceptanceconfirmation: boolean = false;
  sendtoc11(data: any) {
    this.nonacceptanceconfirmation = true;
    this.storeacceptcarddata = data;
  }
  cancelnonacceptanceDrawer() {
    this.nonacceptanceconfirmation = false;
  }
  changefconfirmation: boolean = false;

  sendtocchangefconfirmationfoot(data: any) {
    this.changefconfirmation = true;
    this.storeacceptcarddata = data;
  }
  cancelchangefconfirmationfoot() {
    this.changefconfirmation = false;
  }
  surrenderformconfirmation: boolean = false;

  surrenderdrawerconf(data: any) {
    this.surrenderformconfirmation = true;
    this.storeacceptcarddata = data;
  }
  cancelsurrenderformfoot() {
    this.surrenderformconfirmation = false;
  }

  loadsendto: boolean = false;
  sendtoccaretaker(storeacceptcarddata: MisEmpMaster) {
    this.loadsendto = true;
    this.api.getQuarterMaster(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      this.sortValue,
      ' AND ID=' + storeacceptcarddata.FLAT_ID
    )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.api.sendtocaretakeraccform(storeacceptcarddata.ID, sessionStorage.getItem('userId'), data['data'][0]['CARETAKER_ID']).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.sendforveri = false;
                this.loadsendto = false;
                this.message.success("Acceptance form send to caretaker successfully.", '');
                this.loadingRecords = false;
                this.api
                  .getfinalallotementdetailss(
                    this.pageIndex,
                    this.pageSize,
                    this.sortKey,
                    this.sortValue,
                    this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
                  )
                  // this.MONTH,this.MONTH,this.YEAR,''
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.loadingRecords = false;
                        this.loadsendto = false;
                        this.totalRecords = data['count'];
                        this.dataList = data['data'];
                        this.dtalista = data['data'][0];
                      }
                    },
                    (err) => {
                      this.loadingRecords = false;
                      this.loadsendto = false;
                    }
                  );
              } else if (successCode['code'] == '300') {
                this.loadingRecords = false;
                this.sendforveri = false;
                this.loadsendto = false;

                this.message.error("Send to caretaker time is over", '');
              }
            },
              (err) => {
                this.loadingRecords = false;
                this.sendforveri = false;
                this.loadsendto = false;

                this.message.error("Something went wrong. Please try again letter", '');
              })
          }
        })
  }
  closeterms() {
    this.Rulesandapply = false;
  }
  closeterms1() {
    this.Rulesandapply1 = false;
  }
  get closeCallback() {
    // this. search();
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
    this.isdraweropended = false;
  }
  storeacceptcarddata: any = [];
  setid(data: any) {
    this.storeacceptcarddata = data;
  }
  termsandconditions(storeacceptcarddata: MisEmpMaster) {
    this.isdraweropended = true;
    this.Rulesandapply = false;
    this.stages123 = 0;
    this.employeedata = this.employeeID;
    this.drawerTitle = 'Acceptance Of Quarter';
    this.drawerVisible = true;
    var datasssss: any = Object.assign({}, storeacceptcarddata);
    this.drawerData = datasssss;
  }
  sendtocaretaker(datass: any) {
    this.api.getQuarterMaster(
      this.pageIndex,
      this.pageSize,
      this.sortKey,
      this.sortValue,
      ' AND ID=' + datass.FLAT_ID
    )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            datass.CARETAKER_ID = data['data'][0]['CARETAKER_ID'];
            datass.STEP_NO = 4;
            datass.SEND_TO_CARETAKER_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

            this.api.updategetflatgetlist(datass).subscribe((successCode) => {
              if (successCode['code'] == '200') {
              }
            })
          }
        })
  }
  Continuestatus(data: MisEmpMaster) {
    // this.thisphase = 0;
    // this.stages123 = data.STEP_NO + 1;
    // this.employeedetails();
    // this.drawerTitle = 'Re-apply Aplication';
    // this.drawerVisible = true;
    // this.isdraweropended=true;
    // this.employeedata = this.employeeID;
    // this.drawerData = Object.assign({}, data);

    this.isdraweropended = true;

    // this.Rulesandapply = false;
    this.stages123 = data.STEP_NO + 1;
    this.employeedata = this.employeeID;
    this.drawerTitle = 'Acceptance Of Quarter';
    this.drawerVisible = true;
    var datasssss: any = Object.assign({}, data);
    this.drawerData = datasssss;
  }

  rejectflatLoading: boolean = false;
  reject(storeacceptcarddata: MisEmpMaster) {
    this.rejectflatLoading = true;
    var date = new Date();
    var datef = this.datepipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
    this.api.rejectFlat(
      storeacceptcarddata.ID,
      storeacceptcarddata.YEAR,
      storeacceptcarddata.MONTH,
      this.employeeID,
      storeacceptcarddata.REMARK,
      datef
    )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.rejectflatLoading = false;
            this.Rulesandapply1 = false;
            this.message.success('Quarter rejected successfully', '');
            this.api
              .getfinalallotementdetailss(
                this.pageIndex,
                this.pageSize,
                this.sortKey,
                this.sortValue,
                this.Filterquery + " AND STATUS = 'Y' AND EMP_ID=" + this.employeeID
              )
              // this.MONTH,this.MONTH,this.YEAR,''
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.loadingRecords = false;
                    this.totalRecords = data['count'];
                    this.dataList = data['data'];
                    this.dtalista = data['data'][0];
                  }
                })
          } else {
            this.rejectflatLoading = false;
            this.message.error('Failed to reject Quarter', '');
          }
        }
      );
  }

  // Filters

  yearfilter = false;
  frommonth = false;
  tomonth = false;
  selectToMonth: any = new Date(
    this.datenew.getFullYear(),
    this.datenew.getMonth()
  );
  selectyear: any = new Date;
  //  selectDate: any = new Date;
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  RESIDENCE_TYPE_ID: any = [];
  joinedResidencetype: any;
  applyFilter() {
    if (
      this.selectFromMonth == null ||
      this.selectFromMonth == undefined ||
      this.selectFromMonth == ''
    ) {
      this.message.error('Please Select From Month', '');
    } else if (
      this.selectToMonth == null ||
      this.selectToMonth == undefined ||
      this.selectToMonth == ''
    ) {
      this.message.error('Please Select To Month', '');
    } else if (
      this.selectyear == null ||
      this.selectyear == undefined ||
      this.selectyear == ''
    ) {
      this.message.error('Please Select Year', '');
    } else {
      this.MONTH1 = this.datepipe.transform(this.selectFromMonth, 'MM');
      this.MONTH2 = this.datepipe.transform(this.selectToMonth, 'MM');
      this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.RESIDENCE_TYPE_ID = [];
    this.MONTH1 = '';
    this.MONTH2 = '';
    this.YEAR1 = '';
    this.datenew = new Date();
    this.selectFromMonth = new Date(
      this.datenew.getFullYear(),
      this.datenew.getMonth()
    );
    this.selectToMonth = new Date(
      this.datenew.getFullYear(),
      this.datenew.getMonth()
    );
    this.selectyear = new Date();
    this.search();
    this.isFilterApplied = 'default';
  }

  clearFilterresidencetype() {
    this.RESIDENCE_TYPE_ID = null;
    this.applyFilter();
  }

  changetostring($event) {
    this.joinedResidencetype = '';
    this.joinedResidencetype = this.RESIDENCE_TYPE_ID.join(",");
  }

  clearFilterfrommonth() {
    this.datenew = new Date();
    this.selectFromMonth = new Date(
      this.datenew.getFullYear(),
      this.datenew.getMonth()
    );
    this.applyFilter();
    this.frommonth = false;
  }

  formmonthchange($event) {
    let dddate = new Date();
    let frmonth = new Date(dddate.getFullYear(), dddate.getMonth());
    if (this.selectFromMonth != frmonth) {
      this.frommonth = true;
    } else {
      this.frommonth = false;
    }
  }

  clearFiltertomonth() {
    let tmonth = new Date();
    this.selectToMonth = new Date(
      tmonth.getFullYear(),
      tmonth.getMonth()
    );
    this.applyFilter();
    this.tomonth = false;
  }

  tomonthchange($event) {
    let dddate = new Date();
    let tomonth = new Date(dddate.getFullYear(), dddate.getMonth());
    if (this.selectToMonth != tomonth) {
      this.tomonth = true;
    } else {
      this.tomonth = false;
    }
  }

  clearFilterYear() {
    let tmonth = new Date();
    this.selectyear = new Date();
    this.applyFilter();
    this.yearfilter = false;
  }

  yearchange($event) {
    let dddate = new Date();
    let tomonth = new Date();
    if (this.selectyear != tomonth) {
      this.yearfilter = true;
    } else {
      this.yearfilter = false;
    }
  }

  selectFromMonth: any = new Date(
    this.datenew.getFullYear(),
    this.datenew.getMonth()
  );

  openchangeflatdrawer(storeacceptcarddata: ChangeFlatCreateMaster) {
    this.changefconfirmation = false;

    this.isdraweropended1 = true;
    // this.Rulesandapply = false;
    // if(storeacceptcarddata.CHANGE_INSPECTOR_STATUS=='R'){
    //   this.stageschange = storeacceptcarddata.CHANGE_STEP_NO;
    // }else{
    this.stageschange = 0;
    // }

    this.employeedata1 = this.employeeID;
    this.drawerTitle1 = 'Application Change of Accommodation Form';
    this.drawerVisible1 = true;
    var datasssss: any = Object.assign({}, storeacceptcarddata);
    this.drawerData1 = datasssss;
  }

  nonacceptanceDrawer(storeacceptcarddata: DataNonAcceptanceMaster) {
    this.nonacceptanceconfirmation = false;
    this.isdraweropendednon = true;
    // this.Rulesandapply = false;
    this.stageschangenon = 0;
    this.employeedatanon = this.employeeID;
    this.drawerTitlenon = 'Non-acceptance Form';
    this.drawerVisiblenon = true;
    var datasssss: any = Object.assign({}, storeacceptcarddata);
    // this.drawerDatanon = datasssss;
    this.drawerDatanonsss = datasssss;
    this.drawerDatanonsss = datasssss;
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  drawerClose1(): void {
    this.search();
    this.drawerVisible1 = false;
    this.isdraweropended1 = false;
  }

  get closeCallbacknon() {
    return this.drawerClosenon.bind(this);
  }
  drawerClosenon(): void {
    this.search();
    this.drawerVisiblenon = false;
    this.isdraweropendednon = false;
  }



  // surrender
  surrenderdrawer(storeacceptcarddata: SurrenderempMaster) {
    this.surrenderformconfirmation = false;
    this.isdraweropendedsurrender = true;
    // this.Rulesandapply = false;
    // if(storeacceptcarddata.SURRENDER_CARETAKER_STATUS=='R' || storeacceptcarddata.SURRENDER_INSPECTOR_STATUS=='R' ){
    //   this.stageschangesurrender = 1
    // }else{
    this.stageschangesurrender = 0;
    // }
    this.employeedatasurrender = this.employeeID;
    this.drawerTitlesurrender = 'Surrender Form';
    this.drawerVisiblesurrender = true;
    var datasssss: any = Object.assign({}, storeacceptcarddata);
    // this.drawerDatanon = datasssss;
    this.drawerDatasurrender = datasssss;
    this.drawerDatasurrender = datasssss;
  }

  get closeCallbacksurrender() {
    return this.drawerClosesurrender.bind(this);
  }
  drawerClosesurrender(): void {
    this.search();
    this.drawerVisiblesurrender = false;
    this.isdraweropendedsurrender = false;
  }
  //signned copy
  progressBar1: boolean = false;
  percent1 = 0;
  opennexttab: boolean = false;
  timer1: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  FinalFileurl: any;
  urlFinalFileurl: any;
  dataprevious() {
    this.opennexttab = false;
  }
  opennectdata() {
    this.opennexttab = true;
  }

  insomeuploadcert: boolean = false;
  FinalFileUrlUpload(event: any, data) {
    if (event.target.files[0].type == 'application/pdf') {
      this.FinalFileurl = <File>event.target.files[0];
      this.insomeuploadcert = true;
      if (this.FinalFileurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.FinalFileurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlFinalFileurl = url;
      }
      this.progressBar1 = true;
      this.loadingRecords = true;
      this.timer1 = this.api
        .onUpload2(
          'physicalOccupancyLetter',
          this.FinalFileurl,
          this.urlFinalFileurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              this.message.success('File Uploaded Successfully', '');
              this.insomeuploadcert = false;

            }
          }
          data.PHYSICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
          this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
          this.loadingRecords = false;
          this.insomeuploadcert = false;

        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.FinalFileurl = null;
      this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = null;
      this.loadingRecords = false;
      this.insomeuploadcert = false;
    }
  }

  clearFinalFileUrl(url: any, folder: any, data: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.message.success('File Deleted Successfully', '');
          data.PHYSICAL_OCCUPANCY_LETTER = null;
          // this.drawerData.PHYSICAL_OCCUPANCY_LETTER = null;
          this.progressBar1 = false;
          this.percent1 = 0;


        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  viewFinalFileUrl(fileurl: any) {
    window.open(this.api.retriveimgUrl + 'physicalOccupancyLetter/' + fileurl);
  }

  loadphysical: boolean = false;
  pppOccupancyconfirmmodal: boolean = false;

  submitoccupancyletterconfirmations(datam: any) {
    if (datam.PHYSICAL_OCCUPANCY_LETTER == null || datam.PHYSICAL_OCCUPANCY_LETTER == undefined || datam.PHYSICAL_OCCUPANCY_LETTER == '') {
      this.message.error("Please Upload Physical Occupancy Letter", '');
    } else {
      this.pppOccupancyconfirmmodal = true;
      this.storeacceptcarddata = datam;
    }
  }
  cancelcaretakervacationmodal() {
    this.pppOccupancyconfirmmodal = false;
    this.printupload = false;
    this.FinalFileurl = null;
    this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = null;
    this.loadingRecords = false;
    this.insomeuploadcert = false;
    this.progressBar1 = false;

  }

  cancelcaretakervacationmodal1() {
    this.pppOccupancyconfirmmodal = false;
    this.printupload = false;
    this.FinalFileurl = null;
    this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = null;
    this.loadingRecords = false;
    this.insomeuploadcert = false;
    this.progressBar1 = false;

  }
  submitoccupancyletter(datass: any) {
    if (datass.PHYSICAL_OCCUPANCY_LETTER == null || datass.PHYSICAL_OCCUPANCY_LETTER == undefined || datass.PHYSICAL_OCCUPANCY_LETTER == '') {
      this.message.error("Please Upload Physical Occupancy Letter", '');
    } else {
      this.loadphysical = true;
      this.api
        .getcaretakeraprovedata(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          'desc',
          ' AND FINAL_ALLOTMENT_DETAILS_ID=' + datass.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.loadingRecords = false;
              datass.PHYSICAL_OCCUPANCY_LETTER = datass.PHYSICAL_OCCUPANCY_LETTER;
              datass.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1;
              datass.INSPECTOR_FINAL_STATUS = 'P';
              datass.INSPECTOR_FINAL_REMARK = null;
              datass.INSPECTOR_FINAL_ACTION_DATE_TIME = null;
              this.api.occupacyletterupdate(datass).subscribe(
                (value) => {
                  if (value['code'] == 200) {
                    this.loadphysical = false;
                    this.message.success('Submitted Successfully', '');
                    this.loadingRecords = false;
                    this.printupload = false;
                    this.progressBar1 = false;
                    this.pppOccupancyconfirmmodal = false;
                  }
                },
                (error) => {
                  this.loadphysical = false;
                  this.message.error('Something Went Wrong', '');
                  this.loadingRecords = false;
                }
              );
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadphysical = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.loadphysical = false;
            this.loadingRecords = false;
          }
        );
    }

  }

  showchangemsg() {
    this.message.info("We are working on it, please check after some time", "")
  }

  onOccupancyTypeChange(event: any) {
    if (event == 'T') {
      // if (
      //   this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME == null ||
      //   this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME == undefined ||
      //   this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME == ''
      // ) {
      var currentDate = new Date();
      this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME = new Date(currentDate);
      this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME.setDate(
        currentDate.getDate() + 45
      );
      this.storeacceptcarddata.DEDUCTION_REMARK = ''
      this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = ''
      this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME = ''
      this.storeacceptcarddata.TECHNICAL_REMARK = ''
      this.storeacceptcarddata.PHYSICAL_TAKEN_DATE_TIME = ''
      this.progressBar1 = false;
      this.percent1 = 0;
      this.timer1 = 0
      this.progressBar = false;
      this.percent = 0;
      this.timer = 0
      this.FinalFileurl = ''
      this.urlFinalFileurl = ''
      // }
    }
    if (event == 'P') {
      // if (
      //   this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME == null ||
      //   this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME == undefined ||
      //   this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME == ''
      // ) {
      this.storeacceptcarddata.DEDUCTION_REMARK = ''
      this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = ''
      this.storeacceptcarddata.TECHNICAL_TAKEN_DATE_TIME = ''
      this.storeacceptcarddata.TECHNICAL_REMARK = ''
      this.storeacceptcarddata.PHYSICAL_TAKEN_DATE_TIME = ''
      this.progressBar1 = false;
      this.percent1 = 0;
      this.timer1 = 0
      this.progressBar = false;
      this.percent = 0;
      this.timer = 0
      this.FinalFileurl = ''
      this.urlFinalFileurl = ''
      // }
    }
  }

  caretakervacationmodal = false;
  opencaretakervacationmodal() {
    this.caretakervacationmodal = true;
  }
  cancelcaretakervacationmodal22() {
    this.caretakervacationmodal = false;
  }
  canceloccupancy() {
    this.selectoccupancy = false;
    this.search();
    this.progressBar1 = false;
    this.percent1 = 0;
    this.timer1 = 0
    this.progressBar = false;
    this.percent = 0;
    this.timer = 0
    this.FinalFileurl = ''
    this.urlFinalFileurl = ''
  }
  pdfDownloaddraft = false;
  downloadPdfdraft111() {
    this.loadingRecords = true;
    const element = document.getElementById('printpageform1');
    const opt = {
      margin: 0.2,
      filename: 'Physical Occupation Report.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.loadingRecords = false;
    }, 5000);
  }
  accpt: boolean = false;
  approveupdate(data: any) {
    if (
      data.TECHNICAL_TAKEN_DATE_TIME != null &&
      data.TECHNICAL_TAKEN_DATE_TIME != ''
    ) {
      data.TECHNICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.TECHNICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    if (data.OCCUPANCY_TYPE == 'P') {
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED == 1

    } else {
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED == 0
    }
    if (
      data.PHYSICAL_TAKEN_DATE_TIME != null &&
      data.PHYSICAL_TAKEN_DATE_TIME != ''
    ) {
      data.PHYSICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.PHYSICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    // if (
    //   data.OCCUPANCY_TYPE == null ||
    //   data.OCCUPANCY_TYPE == undefined ||
    //   data.OCCUPANCY_TYPE == ''
    // ) {
    //   this.message.error('Please select occupancy type', '');
    // } else if (
    //   data.OCCUPANCY_TYPE == 'T' &&
    //   (data.TECHNICAL_REMARK == null ||
    //     data.TECHNICAL_REMARK == undefined ||
    //     data.TECHNICAL_REMARK == '')
    // ) {
    //   this.message.error('Please enter technical remark', '');
    // } else if (
    //   data.OCCUPANCY_TYPE == 'T' &&
    //   (data.TECHNICAL_TAKEN_DATE_TIME == null ||
    //     data.TECHNICAL_TAKEN_DATE_TIME == undefined ||
    //     data.TECHNICAL_TAKEN_DATE_TIME == '')
    // ) {
    //   this.message.error('Please Select technical date', '');
    // } else if (
    //   (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
    //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED == 1 &&
    //   (data.PHYSICAL_OCCUPANCY_LETTER == null ||
    //     data.PHYSICAL_OCCUPANCY_LETTER == undefined ||
    //     data.PHYSICAL_OCCUPANCY_LETTER == '')
    // ) {
    //   this.message.error('Please upload physical letter', '');
    // } else if (
    //   (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
    //   (data.DEDUCTION_REMARK == null ||
    //     data.DEDUCTION_REMARK == undefined ||
    //     data.DEDUCTION_REMARK == '')
    // ) {
    //   this.message.error('Please enter decuction remark', '');
    // } else {
    this.loadingRecords = true;
    if (data.OCCUPANCY_TYPE == 'P') {
      data.IS_APPROVED_BY_CARETAKER = 1;
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1;
    } else if (data.IS_PHYSICALLY_FLAT_AVAILABLE == 0) {
      data.IS_APPROVED_BY_CARETAKER = 0;
      data.TECHNICAL_TAKEN_DATE_TIME = '';
      data.TECHNICAL_REMARK = '';
    } else {
      data.IS_APPROVED_BY_CARETAKER = 0;
    }

    // data.CARETAKER_ID = Number(sessionStorage.getItem('userId'));
    data.ID = data.FINAL_FLAT_TAKEN_ID
    this.api.updatecaretakeraprovedata(data).subscribe(
      (value) => {
        if (value['code'] == 200) {
          this.message.success('Approved Successfully', '');
          this.accpt = false;
          this.selectoccupancy = false;
          this.search();
          this.loadingRecords = false;
          // this.stage = 1;
        }
      },
      (error) => {
        this.message.error('Something Went Wrong', '');
        this.loadingRecords = false;
      }
    );
    // }
  }
  cancel() {
    this.accpt = false;
  }
  approveeee(data: any) {
    if (
      data.TECHNICAL_TAKEN_DATE_TIME != null &&
      data.TECHNICAL_TAKEN_DATE_TIME != ''
    ) {
      data.TECHNICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.TECHNICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    if (data.OCCUPANCY_TYPE == 'P') {
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1
    } else {
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 0
    } if (
      data.PHYSICAL_TAKEN_DATE_TIME != null &&
      data.PHYSICAL_TAKEN_DATE_TIME != ''
    ) {
      data.PHYSICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.PHYSICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    if (
      data.PHYSICAL_TAKEN_DATE_TIME != null &&
      data.PHYSICAL_TAKEN_DATE_TIME != ''
    ) {
      data.PHYSICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.PHYSICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    if (data.OCCUPANCY_TYPE == 'P') {
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1

    } else {
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 0
    }
    if (
      data.OCCUPANCY_TYPE == null ||
      data.OCCUPANCY_TYPE == undefined ||
      data.OCCUPANCY_TYPE == ''
    ) {
      this.message.error('Please select occupancy type', '');
    } else if (
      data.OCCUPANCY_TYPE == 'T' &&
      (data.TECHNICAL_REMARK == null ||
        data.TECHNICAL_REMARK == undefined ||
        data.TECHNICAL_REMARK == '')
    ) {
      this.message.error('Please enter technical remark', '');
    } else if (
      data.OCCUPANCY_TYPE == 'T' &&
      (data.TECHNICAL_TAKEN_DATE_TIME == null ||
        data.TECHNICAL_TAKEN_DATE_TIME == undefined ||
        data.TECHNICAL_TAKEN_DATE_TIME == '')
    ) {
      this.message.error('Please mention the tentative completion date.', '');
    }
    // else if (
    //   data.OCCUPANCY_TYPE == 'P' &&
    //   (data.PHYSICAL_TAKEN_DATE_TIME == null ||
    //     data.PHYSICAL_TAKEN_DATE_TIME == undefined ||
    //     data.PHYSICAL_TAKEN_DATE_TIME == '')
    // ) {
    //   this.message.error('Please Select Actual physical occupation Date', '');
    // }
    // else if (
    //   data.OCCUPANCY_TYPE == 'T' && 
    //   (data.TECHNICAL_OCCUPANCY_LETTER == null ||
    //     data.TECHNICAL_OCCUPANCY_LETTER == undefined ||
    //     data.TECHNICAL_OCCUPANCY_LETTER == '')
    // ) {
    //   this.message.error('Please upload Certificate', '');
    // }
    else if (
      (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED == 1 &&
      (data.PHYSICAL_OCCUPANCY_LETTER == null ||
        data.PHYSICAL_OCCUPANCY_LETTER == undefined ||
        data.PHYSICAL_OCCUPANCY_LETTER == '')
    ) {
      this.message.error('Please upload physical letter', '');
    }
    else if (
      data.OCCUPANCY_TYPE == 'P' &&
      (data.PHYSICAL_TAKEN_DATE_TIME == null ||
        data.PHYSICAL_TAKEN_DATE_TIME == undefined ||
        data.PHYSICAL_TAKEN_DATE_TIME == '')
    ) {
      this.message.error('Please Select Actual physical occupation Date', '');
    }
    else if (
      (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
      (data.DEDUCTION_REMARK == null ||
        data.DEDUCTION_REMARK == undefined ||
        data.DEDUCTION_REMARK == '')
    ) {
      this.message.error('Please enter remark', '');
    } else {
      this.accpt = true;
      if (data.OCCUPANCY_TYPE == 'P') {
        this.storeacceptcarddata.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1;
      }
      this.storeacceptcarddata = data
    }
  }
  FinalFileUrlUpload1(event: any, data) {
    if (event.target.files[0].type == 'application/pdf') {
      this.FinalFileurl = <File>event.target.files[0];

      if (this.FinalFileurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.FinalFileurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlFinalFileurl = url;
        // if (
        //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED != undefined &&
        //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED.trim() != ''
        // ) {
        //   var arr = this.data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED.split('/');
        //   if (arr.length > 1) {
        //     url = arr[5];
        //   }
        // }
      }
      this.progressBar1 = true;
      this.loadingRecords = true;
      this.timer1 = this.api
        .onUpload2(
          'physicalOccupancyLetter',
          this.FinalFileurl,
          this.urlFinalFileurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              // this.message.success('File Uploaded Successfully', '');
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.loadingRecords = false;
            this.progressBar1 = false;
            this.percent1 = 0;
            data.PHYSICAL_OCCUPANCY_LETTER = null;
            this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully', '');
              this.loadingRecords = false;
              data.PHYSICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
              this.storeacceptcarddata.PHYSICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
              this.loadingRecords = false;
            } else {
              this.loadingRecords = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.loadingRecords = false;
      this.progressBar1 = false;
      this.percent1 = 0;
      data.PHYSICAL_OCCUPANCY_LETTER = null;
      this.loadingRecords = false;
    }
  }
  FinalFileUrlUpload11(event: any, data) {
    if (event.target.files[0].type == 'application/pdf') {
      this.FinalFileurl = <File>event.target.files[0];

      if (this.FinalFileurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.FinalFileurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlFinalFileurl = url;
        // if (
        //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED != undefined &&
        //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED.trim() != ''
        // ) {
        //   var arr = this.data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED.split('/');
        //   if (arr.length > 1) {
        //     url = arr[5];
        //   }
        // }
      }
      this.progressBar1 = true;
      this.loadingRecords = true;
      this.timer1 = this.api
        .onUpload2(
          'technicalOccupancyLetter',
          this.FinalFileurl,
          this.urlFinalFileurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              // this.message.success('File Uploaded Successfully', '');
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.loadingRecords = false;
            this.progressBar1 = false;
            this.percent1 = 0;
            data.PHYSICAL_OCCUPANCY_LETTER = null;
            this.storeacceptcarddata.TECHNICAL_OCCUPANCY_LETTER = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully', '');
              this.loadingRecords = false;
              data.TECHNICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
              this.storeacceptcarddata.TECHNICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
              this.loadingRecords = false;
            } else {
              this.loadingRecords = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.loadingRecords = false;
      this.progressBar1 = false;
      this.percent1 = 0;
      data.PHYSICAL_OCCUPANCY_LETTER = null;
      this.loadingRecords = false;
    }
  }

  clearFinalFileUrl1(url: any, folder: any, data: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.message.success('File Deleted Successfully', '');
          data.TECHNICAL_OCCUPANCY_LETTER = null;
          // this.drawerData.PHYSICAL_OCCUPANCY_LETTER = null;
          this.progressBar1 = false;
          this.percent1 = 0;


        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  viewFinalFileUrl1(fileurl: any) {
    window.open(this.api.retriveimgUrl + 'technicalOccupancyLetter/' + fileurl);
  }

  viewphysicaloccupancyModalVisible: boolean = false
  viewpdfphysical: any;

  approvephysical(data: any) {


    this.loadingRecords = true;
    data.IS_APPROVED_BY_CARETAKER = 1;
    data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1;


    // let datasend = {
    //   ...this.occupancydata,
    //   INSPECTOR_FINAL_ACTION_DATE_TIME: this.datepipe.transform(
    //     new Date(),
    //     'yyyy-MM-dd HH:mm:ss'
    //   ),
    //   IS_LIVING: '1',
    //   INSPECTOR_FINAL_STATUS: 'A',
    // };
    // data.INSPECTOR_FINAL_ACTION_DATE_TIME= this.datepipe.transform(
    //   new Date(),
    //   'yyyy-MM-dd HH:mm:ss'
    // )
    // data.IS_LIVING= '1'
    // data.INSPECTOR_FINAL_STATUS= 'A'
    // if (data.OCCUPANCY_TYPE == 'P') {

    // } else if (data.IS_PHYSICALLY_FLAT_AVAILABLE == 0) {
    //   data.IS_APPROVED_BY_CARETAKER = 0;
    //   data.TECHNICAL_TAKEN_DATE_TIME = '';
    //   data.TECHNICAL_REMARK = '';
    // } else {
    //   data.IS_APPROVED_BY_CARETAKER = 0;
    // }

    // data.CARETAKER_ID = Number(sessionStorage.getItem('userId'));
    data.ID = data.FINAL_FLAT_TAKEN_ID
    this.api.UpdateIsInspectorApproved(data).subscribe(
      (value) => {
        if (value['code'] == 200) {
          this.message.success('Approved Successfully', '');
          this.accpt = false;
          this.viewphysicaloccupancyModalVisible = false;
          this.search();
          this.loadingRecords = false;
          // this.stage = 1;
        }
      },
      (error) => {
        this.message.error('Something Went Wrong', '');
        this.loadingRecords = false;
      }
    );
    // }
  }

  rejectphysical(data: any) { }
  printOrderModalCancel() {
    this.viewphysicaloccupancyModalVisible = false
    this.search()
  }
  // cureeentdate:any
}