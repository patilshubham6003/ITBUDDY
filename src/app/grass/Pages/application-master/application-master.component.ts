import { Component, Input, OnInit } from '@angular/core';
import { AllotmentMaster } from '../../Models/AllotmentMaster';
import { AllotmentCheckList } from '../../Models/AllotmentCheckList';
import { APIServicesService } from '../../Services/APIService.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { endOfMonth, startOfMonth, subYears } from 'date-fns';
import { prefdata } from '../../Models/perfdata';
import { ObjectionMasterNew } from '../../Models/objectionmasternew';
import { AllotmentObjection1 } from '../../Models/AllotmentObjection1';
import { DomSanitizer } from '@angular/platform-browser';
import { MisEmpMaster } from '../Mis folder/empoyemis/miseployee';
import { HttpEventType } from '@angular/common/http';
import * as moment from 'moment';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-application-master',
  templateUrl: './application-master.component.html',
  styleUrls: ['./application-master.component.css'],
  providers: [DatePipe],
})
export class ApplicationMasterComponent implements OnInit {
  drawerVisible: boolean = false;
  isdraweropended: boolean = false;
  drawerTitle;
  dwisth: any = '100%';
  employeeID: any;
  formTitle = 'Application Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 0;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'primary';
  drawerData: AllotmentMaster = new AllotmentMaster();
  showCreaterequest: boolean = false;
  datenew = new Date();
  Senioritylist: any = [];
  drawerVisibleSurrender: boolean = false;
  drawerTitleSurrender;
  dwisthSurrender: any = '400%';
  drawerDataSurrender: any;
  confirmsurrnder: boolean = false;
  LICENSE_FEE_LETTER: any
  LIGHT_BILL_LETTER: any
  SIGNED_SURRENDER_LETTER: any
  Waitinglist: any = [];
  Publishedmonth = false;
  waitingmonth = false;
  Allotmentchecklistdata: any = [];
  remarkcondition: any;
  filter: boolean = false;
  currentDate: Date = new Date();
  datee: any;
  Timmerloopdsen: any = [];
  idsen = 0;
  Timmerstartloopdsen: any = [];
  Timmerendloopdsen: any = [];
  countdowndisabledsen: boolean = true;

  Timmerloopmis: any = [];
  imis = 0;
  Timmerstartloopmis: any = [];
  Timmerendloopmis: any = [];
  countdowndisablemis: boolean = true;
  Checklistdata: AllotmentCheckList = new AllotmentCheckList();
  Checklistdatasss: AllotmentCheckList = new AllotmentCheckList();
  Monthrange: any = [];
  isRecordLoadingdata: boolean = false;
  ObjectionDataList: any = [];
  perform: any;
  Timmerendlooppre: any = [];
  Timmerstartlooppre: any = [];
  countdowndisablepre: any;
  datamap: any;
  perfdata: any
  dataListFlat: any = []
  flatIdsArray: any = []
  prdata: any
  filterforprep: any
  count: any;
  dataListFinal: any
  empdata: any
  empID: any = sessionStorage.getItem('userId')
  drawerVisiblepre: boolean = false;
  disableprevious: boolean = false;
  dontshowdata = false;
  RESIDENCE_TYPE_ID: any = [];
  joinedResidencetype: any;
  ResidenceTypelist: any = [];
  selectFromMonth: any = new Date();
  selectToMonth: any = new Date();
  selectyear: any = new Date();
  isSpinning = false;
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  filterClass: string = 'filter-invisible';
  Filterquery = '';
  i = 1;
  IS_EMOLUMENTS_DRAWN;
  JOINING_ALLOTMENT_YEAR;
  ResidenceType;
  Status;
  disablenext: boolean = false;
  thisphase = 0;
  stages123: any;
  profilephotooo: any;
  uptrue: boolean[] = [];
  datalistForSteps: any = [];
  currentStage: any;
  employeedata: any;
  Employee_name = '';
  Grass_gradepay_id: any = '';
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
  Rulesandapply = false;
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['GRADE_PAY', 'Grade Pay'],
    ['OFFICE_NAME', 'Office Name'],
    ['DESIGNATION', 'Designation'],
    ['LOCATION', 'Location'],
    ['DDO_OF_THE_OFFICIAL', 'DDO Official'],
    ['EMAIL_ID', 'Email ID'],
    ['MOBILE_NO', 'Mobile Number'],
  ];
  residenceTypeIdToSet: any;
  RESIDENCE_TYPE_IDD: any = [];
  recidencefilter: string = '';
  Timmerendloopphend: any = []
  Timmerstartloopphend: any = []
  countdownInterval: any = []
  countdownInterval1: any = []
  countdownInterval1sen: any = []
  countdownIntervalallot: any = []
  countdownInterval1alot: any = []
  countdownIntervaldsen: any = []
  countdownInterval1alotend: any = []
  countdownInterval1mis: any = []

  countdowndisablephend: any
  iiiiphend: any;
  currentTime: Date = new Date();
  currentTimefordsen: Date = new Date();
  currentTimeforfsen: Date = new Date();
  currentTimeforpre: Date = new Date();
  currentTimeforallo: Date = new Date();
  currentTimeformis: Date = new Date();
  currentTimeforobj: Date = new Date();
  currentTimefoeph: Date = new Date();
  urlappnPdf1: any;
  urlappnPdfs1: any;
  urlappnPdfs2: any;
  urlappnPdfs3: any;

  urlappnPdf: any;
  weburl: any;
  weburls1: any;
  weburls2: any;
  weburls3: any;

  progressBarweb: boolean = false;
  progressBarwebs1: boolean = false;
  progressBarwebs2: boolean = false;
  progressBarwebs3: boolean = false;

  percentweb = 0;
  percentwebs1 = 0;
  percentwebs2 = 0;
  percentwebs3 = 0;

  timerweb: any;
  timerltcCondonationOfDelay: any;
  PHYSICAL_OCCUPANCY_LETTER: any;
  gradepaynotnull: boolean = true;
  phconf: boolean = false;
  weburl1: any;
  progressBarweb1: boolean = false;
  percentweb1 = 0;
  timerweb1: any;
  timerltcCondonationOfDelay1: any;
  timerltcCondonationOfDelays1: any;
  timerltcCondonationOfDelays2: any;
  timerltcCondonationOfDelays3: any;

  RennovationPDF: any;
  gradepaynotnull1: boolean = true;
  gradepaynotnull2: boolean = true;
  gradepaynotnull3: boolean = true;
  gradepaynotnull4: boolean = true;

  phconf1: boolean = false;
  showren: boolean = false;
  Rulesandapplyacceptance: boolean = false;
  rejectremarkonacceptance: any = false;
  rejectflatLoading: boolean = false;
  Rulesandapply1accept: any = false;
  dwisthacceptance: any = '100%';
  drawerVisibleacceptance: boolean = false;
  isdraweropendedacceptance: boolean = false;
  drawerTitleacceptance: any = '';
  employeeIDacceptance: any;
  stages123acceptance: any = 0;
  employeedataacceptance: any;
  drawerDataacceptance: MisEmpMaster = new MisEmpMaster();
  storeacceptcarddata: any = [];
  storeacceptcarddata1: any = [];
  ObjectionDataListallot: any = []
  physicalloading: boolean = false
  falseviewpdfphysical: any
  viewphysicaloccupancyModalVisible: boolean = false
  viewpdfphysical: any;
  renovationshow: boolean = false
  isSpinningrenovation: boolean = false
  renovationdata: any
  Timmerendloopallot: any = []
  Timmerstartloopallot: any = []
  countdowndisableallot: any
  iiii: any
  objectiondataallot: any
  RejectRemarkallot: any = false
  RejectRemark: boolean = false;
  objectiondata: ObjectionMasterNew = new ObjectionMasterNew();
  SpinningRejection: boolean = false;
  transferFileURL: any;
  attachment1: boolean = true;
  urllink: any;
  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    var nextMonthDate = new Date(lastYearSameMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    this.Monthrange[0] = nextMonthDate;
    this.Monthrange[1] = endOfCurrentMonth;
    this.datee = this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.employeeID = sessionStorage.getItem('userId');
    this.dwisth = '100%';
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          this.ResidenceTypelist = data['data'];
          this.isSpinning = false;
        }
      },
      (err) => { }
    );

    this.search(true);
  }
  onChangemonth(result: Date[]): void {
    if (result != null && result != undefined) {
      let fromdate: any = new Date(
        result[0].getFullYear(),
        result[0].getMonth(),
        1
      );
      let Todate: any = new Date(
        result[1].getFullYear(),
        result[1].getMonth() + 1,
        0
      );

      this.Monthrange[0] = new Date(
        result[0].getFullYear(),
        result[0].getMonth(),
        1
      );
      this.Monthrange[1] = new Date(
        result[1].getFullYear(),
        result[1].getMonth() + 1,
        0
      );
    } else {
      this.Monthrange = null;
    }
  }

  applyFilter() {
    if (
      this.Monthrange == null ||
      this.Monthrange == undefined ||
      this.Monthrange == ''
    ) {
      this.message.error('Please Select Month', '');
    } else {
      this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }
  search(reset: boolean = false) {
    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
      clearInterval(this.countdownInterval[cc]);
      clearInterval(this.countdownInterval1[cc]);
      clearInterval(this.countdownInterval1sen[cc]);
      clearInterval(this.countdownIntervalallot[cc]);
      clearInterval(this.countdownInterval1alot[cc]);
      clearInterval(this.countdownIntervaldsen[cc]);
      clearInterval(this.countdownInterval1mis[cc]);
      clearInterval(this.countdownInterval1alotend[cc]);
    }
    this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ')';
    }

    if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD != ''
    ) {
      this.isSpinning = true;
      if (this.RESIDENCE_TYPE_IDD.length > 0) {
        this.recidencefilter =
          ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
      }
      this.api
        .getDatacurrentstagesMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND EMP_ID = ' +
          this.employeeID +
          ' AND DATE_CREATED_BY_MONTH BETWEEN ' +
          "'" +
          this.MONTH1 +
          "'" +
          ' AND ' +
          "'" +
          this.MONTH2 +
          "'" +
          this.recidencefilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.fetchCurrentTime();
              this.filterClass = 'filter-invisible';
              this.datalistForSteps = data['data'];
              for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                if (data['data'][oo]['EMP_DATA'] != null) {
                  this.datalistForSteps[oo]['EMP_DATA'] = JSON.parse(data['data'][oo]['EMP_DATA']);
                }
              }

              if (data['count'] == 0) {
                this.getstepsData();
              } else {
                for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                  if (this.datalistForSteps[oo].STEP_NO > 2) {
                    this.Timmerstartlooppre.length =
                      this.datalistForSteps.length;
                    this.Timmerendlooppre.length = this.datalistForSteps.length;

                    let timeremaining: any = [];
                    let timeremaining2: any = [];
                    timeremaining.length = this.datalistForSteps.length;
                    timeremaining2.length = this.datalistForSteps.length;

                    for (let ab = 0; ab < this.datalistForSteps.length; ab++) {
                      let startdate =
                        this.datalistForSteps[ab]['PREFERENCE_START_DATE_TIME'];
                      let targetDate = new Date(startdate);
                      clearInterval(this.countdownInterval[ab]);
                      this.countdownInterval[ab] = setInterval(() => {
                        const currentDate = new Date(this.currentTimeforpre);
                        timeremaining[ab] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining[ab] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerstartlooppre[ab] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining[ab] <= 0) {
                          this.countdowndisablepre = false;
                          clearInterval(this.countdownInterval[ab]);
                          this.i = 2;
                          this.Timmerstartlooppre[ab] = 0;
                          timeremaining[ab] = 0;
                        }
                        this.currentTimeforpre.setSeconds(this.currentTimeforpre.getSeconds() + 1);
                      }, 1000);
                    }

                    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                      let sapandate =
                        this.datalistForSteps[cc]['PREFERENCE_END_DATE_TIME'];
                      let targetDate = new Date(sapandate);
                      clearInterval(this.countdownInterval1[cc]);
                      this.countdownInterval1[cc] = setInterval(() => {
                        const currentDate = new Date(this.currentTimeforallo);
                        timeremaining2[cc] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining2[cc] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerendlooppre[cc] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining2[cc] <= 0) {
                          this.countdowndisablepre = false;
                          clearInterval(this.countdownInterval1[cc]);
                          this.i = 2;
                          this.Timmerendlooppre[cc] = 0;

                          timeremaining2[cc] = 0;
                        }
                        this.currentTimeforallo.setSeconds(this.currentTimeforallo.getSeconds() + 1);
                      }, 1000);
                    }
                  }
                }

                // allotment start
                for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                  if (this.datalistForSteps[oo].STEP_NO > 3) {
                    this.iiii = 2;
                    this.Timmerstartloopallot.length = this.datalistForSteps.length;
                    this.Timmerendloopallot.length = this.datalistForSteps.length;

                    let timeremainingallot: any = [];
                    let timeremaining2allot: any = [];
                    timeremainingallot.length = this.datalistForSteps.length;
                    timeremaining2allot.length = this.datalistForSteps.length;

                    for (let ab = 0; ab < this.datalistForSteps.length; ab++) {
                      let startdate = this.datalistForSteps[ab]['ALLOTMENT_OBJ_START_DATE_TIME'];
                      let targetDate = new Date(startdate);
                      clearInterval(this.countdownIntervalallot[ab]);
                      this.countdownIntervalallot[ab] = setInterval(() => {
                        const currentDate = new Date(this.currentTimeforobj);
                        timeremainingallot[ab] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremainingallot[ab] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerstartloopallot[ab] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremainingallot[ab] <= 0) {
                          this.countdowndisableallot = false;
                          clearInterval(this.countdownIntervalallot[ab]);
                          this.iiii = 2;
                          this.Timmerstartloopallot[ab] = 0;
                          timeremainingallot[ab] = 0;
                        }
                        this.currentTimeforobj.setSeconds(this.currentTimeforobj.getSeconds() + 1);
                      }, 1000);
                    }


                    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                      let sapandate = this.datalistForSteps[cc]['ALLOTMENT_OBJ_END_DATE_TIME'];
                      let targetDate = new Date(sapandate);
                      clearInterval(this.countdownInterval1alot[cc]);
                      this.countdownInterval1alot[cc] = setInterval(() => {
                        const currentDate = new Date(this.currentTime);
                        timeremaining2allot[cc] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining2allot[cc] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerendloopallot[cc] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining2allot[cc] <= 0) {
                          this.countdowndisableallot = false;
                          clearInterval(this.countdownInterval1alot[cc]);
                          this.iiii = 2;
                          this.Timmerendloopallot[cc] = 0;
                          timeremaining2allot[cc] = 0;
                        }
                        this.currentTime.setSeconds(this.currentTime.getSeconds() + 1);
                      }, 1000);
                    }
                  }
                }

                // allotment end

                // seniority
                this.idsen = 2;
                this.Timmerstartloopdsen.length = this.datalistForSteps.length;
                this.Timmerendloopdsen.length = this.datalistForSteps.length;

                let timeremainingdsen: any = [];
                let timeremaining2dsen: any = [];
                timeremainingdsen.length = this.datalistForSteps.length;
                timeremaining2dsen.length = this.datalistForSteps.length;

                for (let ab = 0; ab < this.datalistForSteps.length; ab++) {
                  let startdatedsen = this.datalistForSteps[ab]['SEN_OBJ_START_DATE_TIME'];
                  let targetDatedsen = new Date(startdatedsen);
                  clearInterval(this.countdownIntervaldsen[ab]);

                  this.countdownIntervaldsen[ab] = setInterval(() => {
                    const currentDatedsen = new Date(this.currentTimefordsen);
                    timeremainingdsen[ab] =
                      targetDatedsen.getTime() - currentDatedsen.getTime();

                    const secondsdsen = Math.floor(timeremainingdsen[ab] / 1000);
                    const minutesdsen = Math.floor(secondsdsen / 60);
                    const hoursdsen = Math.floor(minutesdsen / 60);
                    const daysdsen = Math.floor(hoursdsen / 24);
                    this.Timmerstartloopdsen[ab] =
                      (daysdsen % 24) +
                      ' Day : ' +
                      (hoursdsen % 24) +
                      ' Hrs : ' +
                      (minutesdsen % 60) +
                      ' Min : ' +
                      (secondsdsen % 60) +
                      ' Sec';
                    if (timeremainingdsen[ab] <= 0) {
                      this.countdowndisabledsen = false;
                      clearInterval(this.countdownIntervaldsen[ab]);
                      this.idsen = 2;
                      this.Timmerstartloopdsen[ab] = 0;

                      timeremainingdsen[ab] = 0;
                    }
                    this.currentTimefordsen.setSeconds(this.currentTimefordsen.getSeconds() + 1);
                  }, 1000);
                }


                for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                  let sapandatedsen = this.datalistForSteps[cc]['SEN_OBJ_END_DATE_TIME'];
                  let targetDatedsen = new Date(sapandatedsen);
                  clearInterval(this.countdownInterval1sen[cc]);
                  this.countdownInterval1sen[cc] = setInterval(() => {
                    const currentDatedsen = new Date(this.currentTimeforfsen);
                    timeremaining2dsen[cc] =
                      targetDatedsen.getTime() - currentDatedsen.getTime();

                    const secondsdsen = Math.floor(timeremaining2dsen[cc] / 1000);
                    const minutesdsen = Math.floor(secondsdsen / 60);
                    const hoursdsen = Math.floor(minutesdsen / 60);
                    const daysdsen = Math.floor(hoursdsen / 24);
                    this.Timmerendloopdsen[cc] =
                      (daysdsen % 24) +
                      ' Day : ' +
                      (hoursdsen % 24) +
                      ' Hrs : ' +
                      (minutesdsen % 60) +
                      ' Min : ' +
                      (secondsdsen % 60) +
                      ' Sec';
                    if (timeremaining2dsen[cc] <= 0) {
                      this.countdowndisabledsen = false;
                      clearInterval(this.countdownInterval1sen[cc]);
                      this.idsen = 2;
                      this.Timmerendloopdsen[cc] = 0;

                      timeremaining2dsen[cc] = 0;
                    }
                    this.currentTimeforfsen.setSeconds(this.currentTimeforfsen.getSeconds() + 1);
                  }, 1000);
                }
                // seniority
                //MIS
                this.imis = 2;
                this.Timmerstartloopmis.length = this.datalistForSteps.length;
                this.Timmerendloopmis.length = this.datalistForSteps.length;

                let timeremainingmis: any = [];
                let timeremaining2mis: any = [];
                timeremainingmis.length = this.datalistForSteps.length;
                timeremaining2mis.length = this.datalistForSteps.length;


                for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                  let sapandatemis = this.datalistForSteps[cc]['ACCEPTANCE_END_DATE_TIME'];

                  let targetDatemis = new Date(sapandatemis);
                  clearInterval(this.countdownInterval1mis[cc]);

                  this.countdownInterval1mis[cc] = setInterval(() => {
                    const currentDatemis = new Date(this.currentTimeformis);
                    timeremaining2mis[cc] =
                      targetDatemis.getTime() - currentDatemis.getTime();

                    const secondsmis = Math.floor(timeremaining2mis[cc] / 1000);
                    const minutesmis = Math.floor(secondsmis / 60);
                    const hoursmis = Math.floor(minutesmis / 60);
                    const daysmis = Math.floor(hoursmis / 24);
                    this.Timmerendloopmis[cc] =
                      (daysmis % 24) +
                      ' Day : ' +
                      (hoursmis % 24) +
                      ' Hrs : ' +
                      (minutesmis % 60) +
                      ' Min : ' +
                      (secondsmis % 60) + ' Sec';
                    if (timeremaining2mis[cc] <= 0) {
                      this.countdowndisablemis = false;
                      clearInterval(this.countdownInterval1mis[cc]);
                      this.imis = 2;
                      this.Timmerendloopmis[cc] = '';
                      timeremaining2mis[cc] = 0;
                    }
                    this.currentTimeformis.setSeconds(this.currentTimeformis.getSeconds() + 1);
                  }, 1000);
                }


                for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                  if (this.datalistForSteps[oo].STEP_NO > 4) {
                    this.iiiiphend = 2;
                    this.Timmerendloopphend.length = this.datalistForSteps.length;
                    let timeremaining2pend: any = [];
                    timeremaining2pend.length = this.datalistForSteps.length;
                    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                      let sapandate = this.datalistForSteps[cc]['FINAL_FLAT_TAKEN_DETAILS']['PHYSICAL_END_DATETIME'];
                      let targetDate = new Date(sapandate);
                      clearInterval(this.countdownInterval1alotend[cc]);

                      this.countdownInterval1alotend[cc] = setInterval(() => {
                        const currentDate = new Date(this.currentTimefoeph);
                        timeremaining2pend[cc] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining2pend[cc] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerendloopphend[cc] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining2pend[cc] <= 0) {
                          this.countdowndisablephend = false;
                          clearInterval(this.countdownInterval1alotend[cc]);
                          this.iiiiphend = 2;
                          this.Timmerendloopphend[cc] = '';
                          timeremaining2pend[cc] = 0;
                        }
                        this.currentTimefoeph.setSeconds(this.currentTimefoeph.getSeconds() + 1);
                      }, 1000);
                    }
                  }
                }

                //MIS
              }

              this.isSpinning = false;
            } else {
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        );
    } else {
      this.isSpinning = true;
      if (this.RESIDENCE_TYPE_IDD.length > 0) {
        this.recidencefilter =
          ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
      }
      this.api
        .getDatacurrentstagesMaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND EMP_ID = ' +
          this.employeeID +
          ' AND DATE_CREATED_BY_MONTH BETWEEN ' +
          "'" +
          this.MONTH1 +
          "'" +
          ' AND ' +
          "'" +
          this.MONTH2 +
          "'" +
          this.recidencefilter
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
              this.fetchCurrentTime();
              this.datalistForSteps = data['data'];
              for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                if (data['data'][oo]['EMP_DATA'] != null) {
                  this.datalistForSteps[oo]['EMP_DATA'] = JSON.parse(data['data'][oo]['EMP_DATA']);
                }
              }

              if (data['count'] == 0) {
                this.getstepsData();
              } else {
                for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                  if (this.datalistForSteps[oo].STEP_NO > 2) {
                    this.Timmerstartlooppre.length =
                      this.datalistForSteps.length;
                    this.Timmerendlooppre.length = this.datalistForSteps.length;

                    let timeremaining: any = [];
                    let timeremaining2: any = [];
                    timeremaining.length = this.datalistForSteps.length;
                    timeremaining2.length = this.datalistForSteps.length;

                    for (let ab = 0; ab < this.datalistForSteps.length; ab++) {
                      let startdate =
                        this.datalistForSteps[ab]['PREFERENCE_START_DATE_TIME'];
                      let targetDate = new Date(startdate);
                      clearInterval(this.countdownInterval[ab]);
                      this.countdownInterval[ab] = setInterval(() => {
                        const currentDate = new Date(this.currentTimeforpre);
                        timeremaining[ab] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining[ab] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerstartlooppre[ab] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining[ab] <= 0) {
                          this.countdowndisablepre = false;
                          clearInterval(this.countdownInterval[ab]);
                          this.i = 2;
                          this.Timmerstartlooppre[ab] = 0;

                          timeremaining[ab] = 0;
                        }
                        this.currentTimeforpre.setSeconds(this.currentTimeforpre.getSeconds() + 1);
                      }, 1000);
                    }

                    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                      let sapandate =
                        this.datalistForSteps[cc]['PREFERENCE_END_DATE_TIME'];
                      let targetDate = new Date(sapandate);
                      clearInterval(this.countdownInterval1[cc]);
                      this.countdownInterval1[cc] = setInterval(() => {
                        const currentDate = new Date(this.currentTimeforallo);
                        timeremaining2[cc] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining2[cc] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerendlooppre[cc] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining2[cc] <= 0) {
                          this.countdowndisablepre = false;
                          clearInterval(this.countdownInterval1[cc]);
                          this.i = 2;
                          this.Timmerendlooppre[cc] = 0;

                          timeremaining2[cc] = 0;
                        }
                        this.currentTimeforallo.setSeconds(this.currentTimeforallo.getSeconds() + 1);
                      }, 1000);
                    }
                  }
                }

                // allotment start
                for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                  if (this.datalistForSteps[oo].STEP_NO > 3) {
                    this.iiii = 2;
                    this.Timmerstartloopallot.length = this.datalistForSteps.length;
                    this.Timmerendloopallot.length = this.datalistForSteps.length;

                    let timeremainingallot: any = [];
                    let timeremaining2allot: any = [];
                    timeremainingallot.length = this.datalistForSteps.length;
                    timeremaining2allot.length = this.datalistForSteps.length;

                    for (let ab = 0; ab < this.datalistForSteps.length; ab++) {
                      let startdate = this.datalistForSteps[ab]['ALLOTMENT_OBJ_START_DATE_TIME'];
                      let targetDate = new Date(startdate);
                      clearInterval(this.countdownIntervalallot[ab]);
                      this.countdownIntervalallot[ab] = setInterval(() => {
                        const currentDate = new Date(this.currentTimeforobj);
                        timeremainingallot[ab] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremainingallot[ab] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerstartloopallot[ab] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremainingallot[ab] <= 0) {
                          this.countdowndisableallot = false;
                          clearInterval(this.countdownIntervalallot[ab]);
                          this.iiii = 2;
                          this.Timmerstartloopallot[ab] = 0;
                          timeremainingallot[ab] = 0;
                        }
                        this.currentTimeforobj.setSeconds(this.currentTimeforobj.getSeconds() + 1);
                      }, 1000);
                    }


                    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                      let sapandate = this.datalistForSteps[cc]['ALLOTMENT_OBJ_END_DATE_TIME'];
                      let targetDate = new Date(sapandate);
                      clearInterval(this.countdownInterval1alot[cc]);
                      this.countdownInterval1alot[cc] = setInterval(() => {
                        const currentDate = new Date(this.currentTime);
                        timeremaining2allot[cc] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining2allot[cc] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerendloopallot[cc] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining2allot[cc] <= 0) {
                          this.countdowndisableallot = false;
                          clearInterval(this.countdownInterval1alot[cc]);
                          this.iiii = 2;
                          this.Timmerendloopallot[cc] = 0;
                          timeremaining2allot[cc] = 0;
                        }
                        this.currentTime.setSeconds(this.currentTime.getSeconds() + 1);
                      }, 1000);
                    }
                  }
                }

                // allotment end

                // seniority
                this.idsen = 2;
                this.Timmerstartloopdsen.length = this.datalistForSteps.length;
                this.Timmerendloopdsen.length = this.datalistForSteps.length;

                let timeremainingdsen: any = [];
                let timeremaining2dsen: any = [];
                timeremainingdsen.length = this.datalistForSteps.length;
                timeremaining2dsen.length = this.datalistForSteps.length;

                for (let ab = 0; ab < this.datalistForSteps.length; ab++) {
                  let startdatedsen = this.datalistForSteps[ab]['SEN_OBJ_START_DATE_TIME'];
                  let targetDatedsen = new Date(startdatedsen);
                  clearInterval(this.countdownIntervaldsen[ab]);

                  this.countdownIntervaldsen[ab] = setInterval(() => {
                    const currentDatedsen = new Date(this.currentTimefordsen);
                    timeremainingdsen[ab] =
                      targetDatedsen.getTime() - currentDatedsen.getTime();

                    const secondsdsen = Math.floor(timeremainingdsen[ab] / 1000);
                    const minutesdsen = Math.floor(secondsdsen / 60);
                    const hoursdsen = Math.floor(minutesdsen / 60);
                    const daysdsen = Math.floor(hoursdsen / 24);
                    this.Timmerstartloopdsen[ab] =
                      (daysdsen % 24) +
                      ' Day : ' +
                      (hoursdsen % 24) +
                      ' Hrs : ' +
                      (minutesdsen % 60) +
                      ' Min : ' +
                      (secondsdsen % 60) +
                      ' Sec';
                    if (timeremainingdsen[ab] <= 0) {
                      this.countdowndisabledsen = false;
                      clearInterval(this.countdownIntervaldsen[ab]);
                      this.idsen = 2;
                      this.Timmerstartloopdsen[ab] = 0;

                      timeremainingdsen[ab] = 0;
                    }
                    this.currentTimefordsen.setSeconds(this.currentTimefordsen.getSeconds() + 1);
                  }, 1000);
                }


                for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                  let sapandatedsen = this.datalistForSteps[cc]['SEN_OBJ_END_DATE_TIME'];
                  let targetDatedsen = new Date(sapandatedsen);
                  clearInterval(this.countdownInterval1sen[cc]);
                  this.countdownInterval1sen[cc] = setInterval(() => {
                    const currentDatedsen = new Date(this.currentTimeforfsen);
                    timeremaining2dsen[cc] =
                      targetDatedsen.getTime() - currentDatedsen.getTime();

                    const secondsdsen = Math.floor(timeremaining2dsen[cc] / 1000);
                    const minutesdsen = Math.floor(secondsdsen / 60);
                    const hoursdsen = Math.floor(minutesdsen / 60);
                    const daysdsen = Math.floor(hoursdsen / 24);
                    this.Timmerendloopdsen[cc] =
                      (daysdsen % 24) +
                      ' Day : ' +
                      (hoursdsen % 24) +
                      ' Hrs : ' +
                      (minutesdsen % 60) +
                      ' Min : ' +
                      (secondsdsen % 60) +
                      ' Sec';
                    if (timeremaining2dsen[cc] <= 0) {
                      this.countdowndisabledsen = false;
                      clearInterval(this.countdownInterval1sen[cc]);
                      this.idsen = 2;
                      this.Timmerendloopdsen[cc] = 0;

                      timeremaining2dsen[cc] = 0;
                    }
                    this.currentTimeforfsen.setSeconds(this.currentTimeforfsen.getSeconds() + 1);
                  }, 1000);
                }
                // seniority
                //MIS
                this.imis = 2;
                this.Timmerstartloopmis.length = this.datalistForSteps.length;
                this.Timmerendloopmis.length = this.datalistForSteps.length;

                let timeremainingmis: any = [];
                let timeremaining2mis: any = [];
                timeremainingmis.length = this.datalistForSteps.length;
                timeremaining2mis.length = this.datalistForSteps.length;


                for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                  let sapandatemis = this.datalistForSteps[cc]['ACCEPTANCE_END_DATE_TIME'];

                  let targetDatemis = new Date(sapandatemis);
                  clearInterval(this.countdownInterval1mis[cc]);

                  this.countdownInterval1mis[cc] = setInterval(() => {
                    const currentDatemis = new Date(this.currentTimeformis);
                    timeremaining2mis[cc] =
                      targetDatemis.getTime() - currentDatemis.getTime();

                    const secondsmis = Math.floor(timeremaining2mis[cc] / 1000);
                    const minutesmis = Math.floor(secondsmis / 60);
                    const hoursmis = Math.floor(minutesmis / 60);
                    const daysmis = Math.floor(hoursmis / 24);
                    this.Timmerendloopmis[cc] =
                      (daysmis % 24) +
                      ' Day : ' +
                      (hoursmis % 24) +
                      ' Hrs : ' +
                      (minutesmis % 60) +
                      ' Min : ' +
                      (secondsmis % 60) + ' Sec';
                    if (timeremaining2mis[cc] <= 0) {
                      this.countdowndisablemis = false;
                      clearInterval(this.countdownInterval1mis[cc]);
                      this.imis = 2;
                      this.Timmerendloopmis[cc] = '';
                      timeremaining2mis[cc] = 0;
                    }
                    this.currentTimeformis.setSeconds(this.currentTimeformis.getSeconds() + 1);
                  }, 1000);
                }


                for (let oo = 0; oo < this.datalistForSteps.length; oo++) {
                  if (this.datalistForSteps[oo].STEP_NO > 4 && this.datalistForSteps[oo]['FINAL_FLAT_TAKEN_DETAILS']['PHYSICAL_END_DATETIME'] != null) {
                    this.iiiiphend = 2;
                    this.Timmerendloopphend.length = this.datalistForSteps.length;

                    let timeremaining2pend: any = [];
                    timeremaining2pend.length = this.datalistForSteps.length;


                    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
                      let sapandate = this.datalistForSteps[cc]['FINAL_FLAT_TAKEN_DETAILS']['PHYSICAL_END_DATETIME'];
                      let targetDate = new Date(sapandate);
                      clearInterval(this.countdownInterval1alotend[cc]);

                      this.countdownInterval1alotend[cc] = setInterval(() => {
                        const currentDate = new Date(this.currentTimefoeph);
                        timeremaining2pend[cc] =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeremaining2pend[cc] / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);
                        this.Timmerendloopphend[cc] =
                          (days % 24) +
                          ' Day : ' +
                          (hours % 24) +
                          ' Hrs : ' +
                          (minutes % 60) +
                          ' Min : ' +
                          (seconds % 60) +
                          ' Sec';
                        if (timeremaining2pend[cc] <= 0) {
                          this.countdowndisablephend = false;
                          clearInterval(this.countdownInterval1alotend[cc]);
                          this.iiiiphend = 2;
                          this.Timmerendloopphend[cc] = '';
                          timeremaining2pend[cc] = 0;
                        }
                        this.currentTimefoeph.setSeconds(this.currentTimefoeph.getSeconds() + 1);
                      }, 1000);
                    }
                  }
                }

                //MIS
              }
            } else {
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        );
    }
  }

  getstepsData() {
    this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ')';
    }
    this.isSpinning = true;
    this.loadingRecords = true;
    if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD != ''
    ) {

      if (this.RESIDENCE_TYPE_IDD.length > 0) {
        this.recidencefilter =
          ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
      }
      this.api
        .getAllotmenmaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND EMPLOYEE_ID = ' +
          this.employeeID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.filterClass = 'filter-invisible';
              this.isSpinning = false;
              this.totalRecords = data['count'];
              data['data'].forEach((item) => {
                if (
                  item.STATUS == 'A' &&
                  item.RESIDENCE_TYPE_ID != null &&
                  item.RESIDENCE_TYPE_ID != undefined &&
                  item.RESIDENCE_TYPE_ID != ''
                ) {
                  this.residenceTypeIdToSet = item.RESIDENCE_TYPE_ID;
                }
              });
              if (this.residenceTypeIdToSet != null) {
                sessionStorage.setItem(
                  'residanceids',
                  this.residenceTypeIdToSet
                );
              }
              if (data.RESIDENCE_TYPESS != null) {
                data.RESIDENCE_TYPESS = data.RESIDENCE_TYPESS.split(',');
              }
              this.dataList = data['data'];
              if (data['count'] > 0) {
                this.remarkcondition = data['data'][0]['STATUS'];
              }
              let todays = new Date();
              let todaysmonth = Number(this.datepipe.transform(todays, 'MM'));
              if (this.dataList.length > 0) {
                let applnmonth = Number(
                  this.datepipe.transform(
                    this.dataList[0]['APPLICATION_DATETIME'],
                    'MM'
                  )
                );
                if (
                  this.dataList[0]['STATUS'] == 'P' ||
                  this.dataList[0]['STATUS'] == 'A'
                ) {
                  this.showCreaterequest = true;
                } else if (
                  applnmonth - todaysmonth != 0 &&
                  this.dataList[0]['STATUS'] == 'A'
                ) {
                  this.showCreaterequest = false;
                } else if (this.dataList[0]['STATUS'] == 'R') {
                  this.showCreaterequest = false;
                } else if (this.dataList[0]['STATUS'] == '') {
                  this.showCreaterequest = false;
                }
              }
              this.api.getAllotmentchecklist(0, 0, 'ID', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.Allotmentchecklistdata = data['data'];
                  } else {
                  }
                },
                (err) => { }
              );
            } else {
              this.isSpinning = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.loadingRecords = false;
          }
        );
    } else {
      if (this.RESIDENCE_TYPE_IDD.length > 0) {
        this.recidencefilter =
          ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
      }
      this.api
        .getAllotmenmaster(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND EMPLOYEE_ID = ' +
          this.employeeID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.filterClass = 'filter-invisible';
              this.isSpinning = false;
              this.totalRecords = data['count'];
              data['data'].forEach((item) => {
                if (
                  item.STATUS == 'A' &&
                  item.RESIDENCE_TYPE_ID != null &&
                  item.RESIDENCE_TYPE_ID != undefined &&
                  item.RESIDENCE_TYPE_ID != ''
                ) {
                  this.residenceTypeIdToSet = item.RESIDENCE_TYPE_ID;
                }
              });
              if (this.residenceTypeIdToSet != null) {
                sessionStorage.setItem(
                  'residanceids',
                  this.residenceTypeIdToSet
                );
              }
              if (data.RESIDENCE_TYPESS != null) {
                data.RESIDENCE_TYPESS = data.RESIDENCE_TYPESS.split(',');
              }
              this.dataList = data['data'];
              if (data['count'] > 0) {
                this.remarkcondition = data['data'][0]['STATUS'];
              }
              let todays = new Date();
              let todaysmonth = Number(this.datepipe.transform(todays, 'MM'));
              if (this.dataList.length > 0) {
                let applnmonth = Number(
                  this.datepipe.transform(
                    this.dataList[0]['APPLICATION_DATETIME'],
                    'MM'
                  )
                );
                if (
                  this.dataList[0]['STATUS'] == 'P' ||
                  this.dataList[0]['STATUS'] == 'A'
                ) {
                  this.showCreaterequest = true;
                } else if (
                  applnmonth - todaysmonth != 0 &&
                  this.dataList[0]['STATUS'] == 'A'
                ) {
                  this.showCreaterequest = false;
                } else if (this.dataList[0]['STATUS'] == 'R') {
                  this.showCreaterequest = false;
                } else if (this.dataList[0]['STATUS'] == '') {
                  this.showCreaterequest = false;
                }
              }
              this.api.getAllotmentchecklist(0, 0, 'ID', 'desc', '').subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.Allotmentchecklistdata = data['data'];
                  } else {
                  }
                },
                (err) => { }
              );
            } else {
              this.isSpinning = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.loadingRecords = false;
          }
        );
    }
  }

  updown(eventss: any, index: number) {
    this.uptrue = []
    this.uptrue[index] = true;

    this.ObjectionDataList = [];
    this.ObjectionDataListallot = [];
    if (eventss.DRAFT_WAITING_ID != null && eventss.DRAFT_WAITING_ID != undefined && eventss.DRAFT_WAITING_ID != '') {
      this.isRecordLoadingdata = true;
      this.api
        .getObjectionMaster1(
          0,
          0,
          '',
          'desc',
          ' AND EMP_ID = ' + Number(sessionStorage.getItem('userId')) +
          ' AND DRAFT_WAITING_MASTER_ID = ' + eventss.DRAFT_WAITING_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {

              this.ObjectionDataList = data['data'];


              if (eventss.DRAFT_ALLOTMENT_ID != null && eventss.DRAFT_ALLOTMENT_ID != undefined && eventss.DRAFT_ALLOTMENT_ID != '') {


                this.api
                  .getAllotementObjection(
                    0,
                    0,
                    '',
                    'desc',
                    ' AND EMP_ID = ' +
                    Number(sessionStorage.getItem('userId')) +
                    ' AND DRAFT_ALLOTMENT_ID = ' +
                    eventss.DRAFT_ALLOTMENT_ID
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.isRecordLoadingdata = false;
                        this.ObjectionDataListallot = data['data'];
                      } else {
                        this.message.error('Something Went Wrong', '');
                        this.isRecordLoadingdata = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
              } else {
                this.isRecordLoadingdata = false;
              }
            } else {
              this.isRecordLoadingdata = false;
              this.message.error('Something Went Wrong', '');
            }
          },
          (err) => {
            this.isRecordLoadingdata = false;
            this.isSpinning = false;
          }
        );

    }
  }
  updown1(index: number) {
    this.uptrue[index] = false;
  }

  clearFilter() {
    for (let cc = 0; cc < this.datalistForSteps.length; cc++) {
      clearInterval(this.countdownInterval[cc]);
      clearInterval(this.countdownInterval1[cc]);
      clearInterval(this.countdownInterval1sen[cc]);
      clearInterval(this.countdownIntervalallot[cc]);
      clearInterval(this.countdownInterval1alot[cc]);
      clearInterval(this.countdownIntervaldsen[cc]);
      clearInterval(this.countdownInterval1alotend[cc]);
      clearInterval(this.countdownInterval1mis[cc]);
    }
    this.Monthrange = [];
    this.recidencefilter = '';
    this.RESIDENCE_TYPE_IDD = [];
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    var nextMonthDate = new Date(lastYearSameMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    this.Monthrange[0] = nextMonthDate;
    this.Monthrange[1] = endOfCurrentMonth;
    this.search(true);
    this.isFilterApplied = 'primary';
  }
  employeedetails() {
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.employeeID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Employee_name = data['data'][0]['NAME'];
            this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
            this.emp_Designation = data['data'][0]['DESIGNATION'];
            this.emp_dob = data['data'][0]['DOB'];
            this.office_name = data['data'][0]['OFFICE_NAME'];
            this.service_type = data['data'][0]['SERVICE_TYPE'];
            this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
            this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL'];
            this.emp_address = data['data'][0]['ADDRESS'];
            this.emp_cast = data['data'][0]['CAST'];
            this.headquarter_name = data['data'][0]['LOCATION'];
            this.joining_date = data['data'][0]['JOINING_DATE'];
            this.profilephotooo = data['data'][0]['PROFILE_PHOTO'];

            this.Grass_gradepay_id = data['data'][0]['GRAAS_GRADE_PAY_ID'];
            if (
              this.Employee_name == null ||
              this.Employee_name == '' ||
              this.emp_Designation == null ||
              this.emp_Designation == '' ||
              this.emp_dob == null ||
              this.emp_dob == '' ||
              this.office_name == null ||
              this.office_name == '' ||
              this.service_type == null ||
              this.service_type == '' ||
              this.Grade_pay == null ||
              this.Grade_pay == '' ||
              this.headquarter_name == null ||
              this.headquarter_name == '' ||
              this.Grass_gradepay_id == null ||
              this.Grass_gradepay_id == 0 ||
              this.joining_date == null ||
              this.joining_date == '' ||
              this.profilephotooo == null ||
              this.profilephotooo == ''
            ) {
              this.isdetailsfilled = true;
            } else {
              this.isdetailsfilled = false;
            }
          } else {
            this.message.error("Can't Load Employee Data", '');
          }
        },
        (err) => { }
      );
  }

  add(): void {
    this.Rulesandapply = true;
  }

  termsandconditions(): void {
    sessionStorage.setItem('reapply', 'F');
    this.isdraweropended = true;
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.employeeID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Employee_name = data['data'][0]['NAME'];
            this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
            this.emp_Designation = data['data'][0]['DESIGNATION'];
            this.emp_dob = data['data'][0]['DOB'];
            this.office_name = data['data'][0]['OFFICE_NAME'];
            this.service_type = data['data'][0]['SERVICE_TYPE'];
            this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
            this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL'];
            this.emp_address = data['data'][0]['ADDRESS'];
            this.headquarter_name = data['data'][0]['LOCATION'];
            this.joining_date = data['data'][0]['JOINING_DATE'];
            this.profilephotooo = data['data'][0]['PROFILE_PHOTO'];
            this.Grass_gradepay_id = data['data'][0]['GRAAS_GRADE_PAY_ID'];

            if (
              this.Employee_name == null ||
              this.emp_Designation == null ||
              this.emp_dob == null ||
              this.office_name == null ||
              this.service_type == null ||
              this.Grade_pay == null ||
              this.headquarter_name == null ||
              this.Grass_gradepay_id == null ||
              this.Grass_gradepay_id == 0 ||
              this.joining_date == null ||
              this.profilephotooo == null
            ) {
              this.isdetailsfilled = true;
            } else {
              this.isdetailsfilled = false;
            }
          } else {
            this.message.error("Can't Load Employee Data", '');
          }
        },
        (err) => { }
      );

    this.Rulesandapply = false;
    this.stages123 = 0;
    this.employeedata = this.employeeID;
    this.drawerTitle = 'Create New Aplication';
    this.drawerVisible = true;
    this.drawerData = new AllotmentMaster();
    this.Checklistdata = new AllotmentCheckList();
  }

  closeterms() {
    this.Rulesandapply = false;
  }

  add1(data: AllotmentMaster, Checklistdatasss: AllotmentCheckList): void {
    sessionStorage.setItem('reapply', 'T');
    this.stages123 = 0;
    this.employeedata = this.employeeID;
    sessionStorage.setItem('flat_check_id', data.ID);
    this.drawerVisible = true;
    this.employeedetails();
    this.drawerTitle = 'Application for Accommodation';
    this.isdraweropended = true;
    var datasssss: any = Object.assign({}, data);
    datasssss.ID = 0;
    datasssss = datasssss;
    this.drawerData = datasssss;
    this.Checklistdata = Object.assign({}, Checklistdatasss);
  }

  Continuestatus(data: AllotmentMaster) {
    sessionStorage.setItem('reapply', 'F');
    this.thisphase = 0;
    this.stages123 = data.STEP_NO + 1;
    sessionStorage.setItem('flat_check_id', data.ID);
    this.employeedetails();
    this.drawerTitle = 'Application for Accommodation';
    this.drawerVisible = true;
    this.isdraweropended = true;
    this.employeedata = this.employeeID;
    this.drawerData = Object.assign({}, data);
    this.Checklistdata = new AllotmentCheckList();
  }

  edit(data: AllotmentMaster): void {
    sessionStorage.setItem('reapply', 'F');
    this.drawerTitle = 'Re-apply For Application';
    this.currentStage = 0;
    this.isdetailsfilled = false;
    this.isdraweropended = true;
    sessionStorage.setItem('flat_check_id', data.ID);
    this.employeedata = this.employeeID;
    this.drawerData = Object.assign({}, data);
    this.Checklistdata = new AllotmentCheckList();
    this.drawerVisible = true;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
    sessionStorage.removeItem('flat_check_id');
    this.isdraweropended = false;
  }

  displayc() {
    this.i++;
    if (this.i == 6) {
      this.disablenext = true;
      this.drawerClose();
    }
  }
  previous() {
    this.i--;
    if (this.i == 1) {
      this.disableprevious = true;
    }
  }
  close() {
    this.drawerVisible = false;
    this.drawerClose();
  }

  changetostring($event) {
    this.joinedResidencetype = '';
    this.joinedResidencetype = this.RESIDENCE_TYPE_ID.join(',');
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  showmobfile1(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'draftWaitingList/' + pdfURL;
    window.open(fileUrl);
  }

  openadd(data: any) {

    console.log(data, "data")
    this.loadingRecords = true;
    let month = data.MONTH;
    let year = data.YEAR;
    if (month === 1) {
      month = 12;
      year = year - 1;
    } else {
      month = month - 1;
    }
    this.api.getcaretakeraprovedata(
      0,
      0,
      '',
      '',
      ' AND EMP_ID =' + this.empID + ' AND MONTH = ' + month + ' AND YEAR = ' + year + ' AND RESIDENCE_TYPE_ID=' + data.RESIDENCE_TYPE_ID
    )
      .subscribe(
        (datacheck) => {
          if (datacheck['code'] == 200 && datacheck['count'] > 0) {
            if (datacheck['data'][0]['IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED'] == 1) {
              var month = ''
              switch (data.MONTH) {
                case 1:
                  month = 'JANUARY';
                  break;
                case 2:
                  month = 'FEBRUARY';
                  break;
                case 3:
                  month = 'MARCH';
                  break;
                case 4:
                  month = 'APRIL';
                  break;
                case 5:
                  month = 'MAY';
                  break;
                case 6:
                  month = 'JUNE';
                  break;
                case 7:
                  month = 'JULY';
                  break;
                case 8:
                  month = 'AUGUST';
                  break;
                case 9:
                  month = 'SEPTEMBER';
                  break;
                case 10:
                  month = 'OCTOBER';
                  break;
                case 11:
                  month = 'NOVEMBER';
                  break;
                case 12:
                  month = 'DECEMBER';
                  break;
                default:
                  break;
              }
              this.drawerTitle = 'Add Quarter Preferences For Residence ' + data.RESIDENCE_TYPE_NAME + " " + month + " " + data.YEAR;
              this.datamap = Object.assign({}, data);
              this.datamap.ID = data.PREFERANCE_MASTER_ID;
              this.loadingRecords = true;

              this.api
                .getperdata(
                  0,
                  0,
                  '',
                  'desc',
                  ' AND PREFERENCES_MASTER_ID=' +
                  data.PREFERANCE_MASTER_ID +
                  ' AND EMP_ID=' +
                  Number(sessionStorage.getItem('userId'))
                )
                .subscribe(
                  (data: any) => {
                    if (data['code'] == 200) {
                      if (data['data'].length > 0) {
                        this.perfdata = data['data'][0];
                      } else {
                        this.perfdata = new prefdata();
                      }
                      this.api
                        .getmployeeaddbulk(
                          0,
                          0,
                          'PREFERENCE_NO',
                          'asc',
                          ' AND PREFERENCES_MASTER_ID = ' +
                          this.datamap.ID +
                          ' AND EMP_ID = ' +
                          Number(sessionStorage.getItem('userId'))
                        )
                        .subscribe(
                          (data: any) => {
                            if (data['code'] == 200) {
                              if (data['data'].length > 0) {
                                this.dataListFlat = data['data'];
                                this.prdata = data['data'];
                                this.flatIdsArray = [];
                                if (data['count'] > 0) {
                                  this.prdata.forEach(item => {
                                    this.flatIdsArray.push(item.FLAT_ID);
                                  });
                                }
                              } else {
                                this.dataListFlat = [];
                              }
                              if (this.flatIdsArray.length > 0) {
                                this.filterforprep = ' AND FLAT_ID NOT IN (' + this.flatIdsArray + ')'
                              } else {
                                this.filterforprep = ''
                              }
                              this.api
                                .getpredranceflatdata(
                                  0,
                                  0,
                                  'SEQUENCE_NO',
                                  'desc',
                                  " AND STATUS=1 AND VACANT_STATUS='A' AND IS_PUBLISHED=1 " +
                                  ' AND RESIDENCE_TYPE_ID = ' +
                                  this.datamap.RESIDENCE_TYPE_ID + this.filterforprep
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      this.dataList = data['data'];
                                      this.dataListFinal = data['data'];
                                      this.count = data['count'];

                                      this.api
                                        .getEmployeeMaster(
                                          0,
                                          0,
                                          '',
                                          '',
                                          ' AND ID =' + this.empID
                                        )
                                        .subscribe(
                                          (data) => {
                                            if (data['code'] == 200) {
                                              let employeedata = data['data'];
                                              this.empdata = employeedata;
                                              this.drawerVisiblepre = true;
                                              this.loadingRecords = false;
                                            } else {
                                              this.loadingRecords = false;
                                            }
                                          },
                                          (err) => {
                                            this.loadingRecords = false;
                                          });
                                    } else {
                                      this.loadingRecords = false;
                                    }
                                  },
                                  (err) => {
                                    this.loadingRecords = false;
                                  });
                            } else {
                              this.loadingRecords = false;
                            }
                          },
                          (err) => {
                            this.loadingRecords = false;
                          });
                    } else {
                      this.loadingRecords = false;
                    }
                  },
                  (err) => {
                    this.loadingRecords = false;
                  });
            } else {
              this.loadingRecords = false;
              this.message.info("You don't have access to fill preferenses", '')
            }
          } else {
            var month = ''
            switch (data.MONTH) {
              case 1:
                month = 'JANUARY';
                break;
              case 2:
                month = 'FEBRUARY';
                break;
              case 3:
                month = 'MARCH';
                break;
              case 4:
                month = 'APRIL';
                break;
              case 5:
                month = 'MAY';
                break;
              case 6:
                month = 'JUNE';
                break;
              case 7:
                month = 'JULY';
                break;
              case 8:
                month = 'AUGUST';
                break;
              case 9:
                month = 'SEPTEMBER';
                break;
              case 10:
                month = 'OCTOBER';
                break;
              case 11:
                month = 'NOVEMBER';
                break;
              case 12:
                month = 'DECEMBER';
                break;
              default:
                break;
            }
            this.drawerTitle = 'Add Quarter Preferences For Residence ' + data.RESIDENCE_TYPE_NAME + " " + month + " " + data.YEAR;
            this.datamap = Object.assign({}, data);
            this.datamap.ID = data.PREFERANCE_MASTER_ID;
            this.loadingRecords = true;

            this.api
              .getperdata(
                0,
                0,
                '',
                'desc',
                ' AND PREFERENCES_MASTER_ID=' +
                data.PREFERANCE_MASTER_ID +
                ' AND EMP_ID=' +
                Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (data: any) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.perfdata = data['data'][0];
                    } else {
                      this.perfdata = new prefdata();
                    }
                    this.api
                      .getmployeeaddbulk(
                        0,
                        0,
                        'PREFERENCE_NO',
                        'asc',
                        ' AND PREFERENCES_MASTER_ID = ' +
                        this.datamap.ID +
                        ' AND EMP_ID = ' +
                        Number(sessionStorage.getItem('userId'))
                      )
                      .subscribe(
                        (data: any) => {
                          if (data['code'] == 200) {
                            if (data['data'].length > 0) {
                              this.dataListFlat = data['data'];
                              this.prdata = data['data'];
                              this.flatIdsArray = [];
                              if (data['count'] > 0) {
                                this.prdata.forEach(item => {
                                  this.flatIdsArray.push(item.FLAT_ID);
                                });
                              }
                            } else {
                              this.dataListFlat = [];
                            }
                            if (this.flatIdsArray.length > 0) {
                              this.filterforprep = ' AND FLAT_ID NOT IN (' + this.flatIdsArray + ')'
                            } else {
                              this.filterforprep = ''
                            }
                            this.api
                              .getpredranceflatdata(
                                0,
                                0,
                                'SEQUENCE_NO',
                                'desc',
                                " AND STATUS=1 AND VACANT_STATUS='A' AND IS_PUBLISHED=1 " +
                                ' AND RESIDENCE_TYPE_ID = ' +
                                this.datamap.RESIDENCE_TYPE_ID + this.filterforprep
                              )
                              .subscribe(
                                (data) => {
                                  if (data['code'] == 200) {
                                    this.dataList = data['data'];
                                    this.dataListFinal = data['data'];
                                    this.count = data['count'];

                                    this.api
                                      .getEmployeeMaster(
                                        0,
                                        0,
                                        '',
                                        '',
                                        ' AND ID =' + this.empID
                                      )
                                      .subscribe(
                                        (data) => {
                                          if (data['code'] == 200) {
                                            let employeedata = data['data'];
                                            this.empdata = employeedata;
                                            this.drawerVisiblepre = true;
                                            this.loadingRecords = false;
                                          } else {
                                            this.loadingRecords = false;
                                          }
                                        },
                                        (err) => {
                                          this.loadingRecords = false;
                                        });
                                  } else {
                                    this.loadingRecords = false;
                                  }
                                },
                                (err) => {
                                  this.loadingRecords = false;
                                });
                          } else {
                            this.loadingRecords = false;
                          }
                        },
                        (err) => {
                          this.loadingRecords = false;
                        });
                  } else {
                    this.loadingRecords = false;
                  }
                },
                (err) => {
                  this.loadingRecords = false;
                });

          }
        },
        (err) => {
          this.loadingRecords = false;
          this.message.info("Something went wrong, please try again later", '')
        });
  }

  prefranceclose() {
    this.drawerVisiblepre = false;
    this.search()
  }

  get closeCallbackpre() {
    return this.prefranceclose.bind(this);
  }

  showw(i: any) {
    if (
      this.Timmerstartlooppre[i] == 0 &&
      (this.Timmerendlooppre[i] != 0 || this.Timmerendlooppre[i] != '')
    ) {
      return false;
    } else if (this.Timmerstartlooppre[i] == 0 && this.Timmerendlooppre[i] == 0) {
      return true;
    } else {
      return true;
    }
  }

  viewModal(data: any) {
    this.api
      .getperdata(
        0,
        0,
        '',
        'desc',
        ' AND PREFERENCES_MASTER_ID=' +
        data.PREFERANCE_MASTER_ID +
        ' AND EMP_ID=' +
        Number(sessionStorage.getItem('userId'))
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            this.perform = data['data'][0];

            if (
              this.perform.UPLOAD_URL != null &&
              this.perform.UPLOAD_URL != undefined &&
              this.perform.UPLOAD_URL != ''
            ) {
              const fileUrl =
                this.api.retriveimgUrl +
                'employeePreferance/' +
                this.perform.UPLOAD_URL;
              window.open(fileUrl);
            }
          }
        },
        (err) => { }
      );
  }

  showmobfile(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'finalList/' + pdfURL;
    window.open(fileUrl);
  }
  viewAssumptionAttached(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'seniorityObjections/' + pdfURL;
    window.open(fileUrl);
  }

  raiseObjection(datai: any) {
    this.attachment1 = true;
    this.objectiondata = new ObjectionMasterNew();
    this.objectiondata.EMP_ID = Number(sessionStorage.getItem('userId'));
    this.objectiondata.RAISE_OBJECTION_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.objectiondata.ACTION_STATUS = 'P';
    this.objectiondata.DRAFT_WAITING_MASTER_ID = datai.DRAFT_WAITING_ID;
    this.RejectRemark = true;
  }

  CancleRemark() {
    this.RejectRemark = false;
    this.objectiondata = new ObjectionMasterNew();
  }

  ATTACHMENT1clear() {
    this.objectiondata.FILE_URL = null;
  }

  onFileATTACHMENT1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.SpinningRejection = true;
      this.transferFileURL = <File>event.target.files[0];

      if (this.transferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink = url;
        if (
          this.objectiondata.FILE_URL != undefined &&
          this.objectiondata.FILE_URL.trim() != ''
        ) {
          var arr = this.objectiondata.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('seniorityObjections', this.transferFileURL, this.urllink)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.objectiondata.FILE_URL = this.urllink;
            this.message.success('File Uploaded Successfully...', '');
            if (this.objectiondata.FILE_URL != null) {
              this.attachment1 = false;
            }
            this.SpinningRejection = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.SpinningRejection = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.objectiondata.FILE_URL = null;
    }
  }

  OpenVacantOrder(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'flatOrders/' + pdfURL;
    window.open(fileUrl);
  }
  OpenVacantNotice(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'flatVacantOrder/' + pdfURL;
    window.open(fileUrl);
  }

  setid(data: any) {
    this.storeacceptcarddata = data;
  }

  raiseObjectionforallotment(data) {
    this.objectiondataallot = new AllotmentObjection1();
    this.objectiondataallot.EMP_ID = Number(sessionStorage.getItem('userId'));
    this.objectiondataallot.RAISE_OBJECTION_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.objectiondataallot.ACTION_STATUS = 'P';
    this.objectiondataallot.DRAFT_ALLOTMENT_ID = data.DRAFT_ALLOTMENT_ID;
    this.RejectRemarkallot = true;
  }

  SubmitRemarkforallot() {
    if (
      this.objectiondataallot.OBJECTION == null ||
      this.objectiondataallot.OBJECTION == undefined ||
      this.objectiondataallot.OBJECTION == ''
    ) {
      this.message.error('Please Enter Your Objection', '');
    } else {
      this.isSpinning = true;
      this.api
        .createAllotementObjection(this.objectiondataallot)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Objection raised successfully on the draft allotment order.', '');
            this.RejectRemarkallot = false;
            this.isSpinning = false;
            this.objectiondataallot = new AllotmentObjection1();
            this.search();
          } else if (successCode['code'] == '300') {
            this.isSpinning = false;
            this.message.info(" You can't raise the objection now due to the objection period is over", "");
          } else {
            this.message.error('Failed To Raised Objection On Draft Allotment Order', '');
            this.isSpinning = false;
          }
        }, err => {
          this.message.error('Failed To Raised Objection On Draft Allotment Order', '');
          this.isSpinning = false;
        });
    }
  }

  CancleRemarkforalot() {
    this.RejectRemarkallot = false;
    this.objectiondataallot = new AllotmentObjection1();
  }

  openrenovation(data: any) {
    this.renovationshow = true
    this.renovationdata = data
  }

  cancelrenovation() {
    this.renovationshow = false
  }

  viewAccl(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'acceptanceLetter/' + pdfURL;
    window.open(fileUrl)
  }

  setidmis(data: any) {
    this.storeacceptcarddata = data.FINAL_ALLOTMENT_DETAILS;
    this.storeacceptcarddata1 = data;
  }

  showwmis(i: any) {
    if (this.Timmerendloopmis[i] > 0 || this.Timmerendloopmis[i] != '') {
      return false;
    } else if (this.Timmerendloopmis[i] == 0) {
      return true;
    } else {
      return true;
    }
  }

  SubmitRemark() {
    if (
      this.objectiondata.OBJECTION == null ||
      this.objectiondata.OBJECTION == undefined ||
      this.objectiondata.OBJECTION == ''
    ) {
      this.message.error('Please Enter Your Objection On Draft Seniority Order', '');
    } else {
      this.SpinningRejection = true;
      this.api
        .createObjectionmaster1(this.objectiondata)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Objection raised successfully on the draft seniority order.', '');
            this.RejectRemark = false;
            this.SpinningRejection = false;
            this.search();
            this.objectiondata = new ObjectionMasterNew();
          } else if (successCode['code'] == '300') {
            this.message.info("You can't raise the objection now due to the objection period is over", '');
            this.SpinningRejection = false;
          } else {
            this.message.error('Failed To Raised Objection On Draft Seniority Order', '');
            this.isSpinning = false;
            this.SpinningRejection = false;
          }
        }, err => {
          this.message.error('Something went wrong, please try again later', '');
          this.isSpinning = false;
          this.SpinningRejection = false;
        });
    }
  }

  Continuestatusacceptance(data: MisEmpMaster) {
    this.isdraweropendedacceptance = true;
    this.stages123acceptance = data.STEP_NO + 1;
    this.DataForSendLetters = this.storeacceptcarddata1;
    this.employeedataacceptance = this.employeeID;
    var month = ''
    switch (data.MONTH) {
      case 1:
        month = 'JANUARY';
        break;
      case 2:
        month = 'FEBRUARY';
        break;
      case 3:
        month = 'MARCH';
        break;
      case 4:
        month = 'APRIL';
        break;
      case 5:
        month = 'MAY';
        break;
      case 6:
        month = 'JUNE';
        break;
      case 7:
        month = 'JULY';
        break;
      case 8:
        month = 'AUGUST';
        break;
      case 9:
        month = 'SEPTEMBER';
        break;
      case 10:
        month = 'OCTOBER';
        break;
      case 11:
        month = 'NOVEMBER';
        break;
      case 12:
        month = 'DECEMBER';
        break;
      default:
        break;
    }
    this.drawerTitleacceptance = "Acceptance Form For Residence " + data.RESIDENCE_TYPE_NAME + " " + month + " " + data.YEAR;
    this.drawerVisibleacceptance = true;
    var datasssss: any = Object.assign({}, data);
    this.drawerDataacceptance = datasssss;
  }

  closeterms1acceptance() {
    this.Rulesandapply1accept = false;
  }
  add1acceptance(): void {
    this.Rulesandapply1accept = true;
  }
  closerejectcon() {
    this.Rulesandapply1accept = false;
    this.rejectremarkonacceptance = false;
  }

  agrrerejconfcancel() {
    this.Rulesandapply1accept = false;
  }
  agrrerejconf(): void {
    this.rejectremarkonacceptance = true;
  }
  rejectaccept(storeacceptcarddatas: MisEmpMaster) {
    if (this.storeacceptcarddata.NON_ACCEPTANCE_REMARK == null || this.storeacceptcarddata.NON_ACCEPTANCE_REMARK == undefined || this.storeacceptcarddata.NON_ACCEPTANCE_REMARK == null) {
      this.message.error("Please Enter Remark For Non-Acceptance", "")
    } else {
      this.rejectflatLoading = true;
      var date = new Date();
      var datef = this.datepipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
      this.api.rejectFlat11(
        storeacceptcarddatas.ID,
        storeacceptcarddatas.YEAR,
        storeacceptcarddatas.MONTH,
        this.employeeID,
        this.storeacceptcarddata.NON_ACCEPTANCE_REMARK,
        datef, storeacceptcarddatas.RESIDENCE_TYPE_ID,
        this.storeacceptcarddata1.FLAT_REQUEST_ID
      )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.rejectflatLoading = false;
              this.rejectremarkonacceptance = false;
              this.Rulesandapply1accept = false;
              this.message.success('Non-Acceptance Submitted successfully', '');
              this.search();
            }
            else if (data['code'] == 300) {
              this.rejectflatLoading = false;
              this.message.error("You can't fill the Non-Acceptance now due to the Non-Acceptance period is over.", '');
            } else {
              this.rejectflatLoading = false;
              this.message.error('Failed To Submit Non-Acceptance', '');
            }
          }, err => {
            this.rejectflatLoading = false;
            this.message.error('Something went wrong, please try again later', '');
          });
    }
  }
  addacceptance(): void {
    this.Rulesandapplyacceptance = true;
  }
  closetermsacce() {
    this.Rulesandapplyacceptance = false;
  }

  DataForSendLetters: any;
  termsandconditionsacce(storeacceptcarddata: MisEmpMaster) {
    this.isdraweropendedacceptance = true;
    this.Rulesandapplyacceptance = false;
    this.stages123acceptance = 0;
    this.employeedataacceptance = this.employeeID;
    this.DataForSendLetters = this.storeacceptcarddata1;
    var month = ''
    switch (storeacceptcarddata.MONTH) {
      case 1:
        month = 'JANUARY';
        break;
      case 2:
        month = 'FEBRUARY';
        break;
      case 3:
        month = 'MARCH';
        break;
      case 4:
        month = 'APRIL';
        break;
      case 5:
        month = 'MAY';
        break;
      case 6:
        month = 'JUNE';
        break;
      case 7:
        month = 'JULY';
        break;
      case 8:
        month = 'AUGUST';
        break;
      case 9:
        month = 'SEPTEMBER';
        break;
      case 10:
        month = 'OCTOBER';
        break;
      case 11:
        month = 'NOVEMBER';
        break;
      case 12:
        month = 'DECEMBER';
        break;
      default:
        break;
    }
    this.drawerTitleacceptance = "Acceptance Form For Residence " + storeacceptcarddata.RESIDENCE_TYPE_NAME + " " + month + " " + storeacceptcarddata.YEAR;
    this.drawerVisibleacceptance = true;
    var datasssss: any = Object.assign({}, storeacceptcarddata);
    this.drawerDataacceptance = datasssss;
  }
  get closeCallbackacceptance() {
    return this.drawerCloseacceptance.bind(this);
  }
  drawerCloseacceptance(): void {
    this.search();
    this.drawerVisibleacceptance = false;
    this.isdraweropendedacceptance = false;
  }
  draftallotmentpdf(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'draftAllotmentList/' + pdfURL;
    window.open(fileUrl);
  }
  finalallotementpdf(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'finalAllotmentList/' + pdfURL;
    window.open(fileUrl);
  }

  Viewoccupancyformletter(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'physicalOccupancyLetter/' + url;
    window.open(fileUrl);
  }
  Viewoccupancyformletter1(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'renovationAttachments/' + url;
    window.open(fileUrl);
  }
  viewAllotmentLettershow(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }
  viewapplicationform(fileurl: any) {
    const fileUrl = this.api.retriveimgUrl + 'applicationForm/' + fileurl;
    window.open(fileUrl);
  }

  viewPhysicalReminder(fileurl: any) {
    const fileUrl = this.api.retriveimgUrl + 'physicalOccupancyReminder/' + fileurl;
    window.open(fileUrl);
  }

  viewstopHRA(fileurl: any) {
    const fileUrl = this.api.retriveimgUrl + 'stopHRA/' + fileurl;
    window.open(fileUrl);
  }

  approvephysical(data: any) {
    if (this.PHYSICAL_OCCUPANCY_LETTER == null || this.PHYSICAL_OCCUPANCY_LETTER == '' || this.PHYSICAL_OCCUPANCY_LETTER == undefined) {
      this.message.error("Please Upload Caretaker Possession Letter", "")
    } else {
      this.loadingRecords = true;
      data.IS_APPROVED_BY_CARETAKER = 1;
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1;
      data.PHYSICAL_OCCUPANCY_LETTER = this.PHYSICAL_OCCUPANCY_LETTER;
      data.OCCUPANCY_TYPE = "P";
      data.INSPECTOR_FINAL_ACTION_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      )
      data.IS_LIVING = '1';
      data.INSPECTOR_FINAL_STATUS = 'A';
      data.PHYSICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      )
      this.api.UpdateIsInspectorApproved(data).subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.message.success('Caretaker Possession Letter Submitted Successfully', '');
            this.phconf = false;
            this.viewphysicaloccupancyModalVisible = false;
            this.search();
            this.loadingRecords = false;
          } else if (value['code'] == 300) {
            this.message.info("You can't fill the caretaker possession letter now due to the Acceptance period is over.", '');

            this.loadingRecords = false;
          } else {
            this.message.error('Failed to Submit Signed Copy of Caretaker Possession Letter', '');
            this.loadingRecords = false;
          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      );
    }
  }

  selectocuu(show: any, allotd: any, time: any) {
    if (time == 0) {
      this.message.info("You can't fill the Physical Possession Letter now due to the Acceptance period is over.", '')
    } else {
      this.physicalloading = true;
      this.storeacceptcarddata = show;
      this.viewphysicaloccupancyModalVisible = true;
      this.isSpinning = false;
      this.progressBarweb = false;
      this.percentweb = 0;
      this.weburl = null;
      this.PHYSICAL_OCCUPANCY_LETTER = null;
      this.gradepaynotnull = true;
      this.viewpdfphysical = this.sanitizer.bypassSecurityTrustResourceUrl(this.api.retriveimgUrl + 'physicalOccupancyReminder/' + allotd);
      this.physicalloading = false
    }
  }

  applyforrennovation(show: any, allotd: any, time: any) {
    if (time == 0) {
      this.message.info("You Can't Apply For Renovation now due to the Physical Possession Letter Acceptance period is over.", '')

    } else {
      this.showren = true;
      this.renovationdata = show;
      this.isSpinning = false;
      this.progressBarweb1 = false;
      this.renovationdata.RENOVATION_REMARK = null;
      this.percentweb1 = 0;
      this.weburl1 = null;
      this.renovationdata.RENOVATION_ATTACHEMENTS = null;
    }
  }

  removationgive(data: any) {
    if (data.RENOVATION_REMARK == null || data.RENOVATION_REMARK == undefined || data.RENOVATION_REMARK == '') {
      this.message.error('Please describe the required renovation details', '');
    } else {
      data.IS_RENOVATION = true;
      data.RENOVATION_RESQUEST_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      )
      data.RENOVATION_STATUS = 'P';
      data.IS_APPLIEND_FOR_RENOVATION = 1;
      this.isSpinningrenovation = true
      this.api.UpdateEmployeeDataflatfinal1(data).subscribe(
        (value) => {
          if (value.code == 200) {
            this.message.success('Applied For Renovation Request Successfully', '');
            this.phconf1 = false;
            this.showren = false;
            this.isSpinningrenovation = false
            this.search();
          } else {
            this.message.error('Failed To Apply For Renovation Request.', "");
            this.isSpinningrenovation = false
          }
        },
        (error) => {
          this.isSpinningrenovation = false
          this.message.error('something went wrong', "");
        }
      );
    }
  }

  printOrderModalCancel1() {
    this.phconf1 = false;
  }
  showrenCancel() {
    this.showren = false;
  }

  openrenno() {
    if (this.renovationdata.RENOVATION_REMARK == null || this.renovationdata.RENOVATION_REMARK == undefined || this.renovationdata.RENOVATION_REMARK == '') {
      this.message.error('Please describe the required renovation details', '');
    } else {
      this.phconf1 = true;
    }
  }

  cancelconfph() {
    this.viewphysicaloccupancyModalVisible = false;
    this.search();
  }

  openpgCon() {
    if (this.PHYSICAL_OCCUPANCY_LETTER == null || this.PHYSICAL_OCCUPANCY_LETTER == '' || this.PHYSICAL_OCCUPANCY_LETTER == undefined) {
      this.message.error("Please Upload Caretaker Possession Letter", "")
    } else {
      this.phconf = true;
    }
  }

  printOrderModalCancel() {
    this.phconf = false;
  }
  onfileweb(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.weburl = <File>event.target.files[0];
      if (this.weburl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.weburl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.PHYSICAL_OCCUPANCY_LETTER != undefined &&
          this.PHYSICAL_OCCUPANCY_LETTER.trim() != ''
        ) {
          var arr = this.PHYSICAL_OCCUPANCY_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true
      this.progressBarweb = true;
      this.timerltcCondonationOfDelay = this.api
        .onUpload2('physicalOccupancyLetter', this.weburl, this.urlappnPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentweb = percentDone;
            if (this.percentweb == 100) {
              this.isSpinning = false;
            }
          }
          if (res['body']['code'] == 200) {
            this.message.success('Caretaker Possession Letter Uploaded Successfully.', '');
            this.PHYSICAL_OCCUPANCY_LETTER = this.urlappnPdf;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Upload Caretaker Possession Letter.', '');
            this.isSpinning = false;
            this.progressBarweb = false;
            this.percentweb = 0;
            this.PHYSICAL_OCCUPANCY_LETTER = null;
          }
          this.PHYSICAL_OCCUPANCY_LETTER = this.urlappnPdf;
          if (this.PHYSICAL_OCCUPANCY_LETTER != null) {
            this.gradepaynotnull = false;
          } else {
            this.gradepaynotnull = true;
          }
        }, err => {
          this.message.error('Failed To Upload Physically Possession Letter.', '');
          this.isSpinning = false;
          this.progressBarweb = false;
          this.percentweb = 0;
          this.weburl = null;
          this.PHYSICAL_OCCUPANCY_LETTER = null;
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.weburl = null;
      this.isSpinning = false;
      this.PHYSICAL_OCCUPANCY_LETTER = null;
    }
  }
  clearGradepayletter(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.PHYSICAL_OCCUPANCY_LETTER = null;
          this.gradepaynotnull = true;
          this.percentweb = 0;
          this.progressBarweb = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }
  onfileweb1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.weburl1 = <File>event.target.files[0];
      if (this.weburl1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.weburl1.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf1 = url;
        if (
          this.renovationdata.RENOVATION_ATTACHEMENTS != undefined &&
          this.renovationdata.RENOVATION_ATTACHEMENTS.trim() != ''
        ) {
          var arr = this.renovationdata.RENOVATION_ATTACHEMENTS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true
      this.progressBarweb1 = true;
      this.timerltcCondonationOfDelay1 = this.api
        .onUpload2('renovationAttachments', this.weburl1, this.urlappnPdf1)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentweb1 = percentDone;
            if (this.percentweb1 == 100) {
              this.isSpinning = false;
            }
          }
          if (res['body']['code'] == 200) {
            this.message.success('Attachment For Renovation Uploaded Successfully.', '');
            this.renovationdata.RENOVATION_ATTACHEMENTS = this.urlappnPdf1;
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Upload Attachment For Renovation.', '');
            this.isSpinning = false;
            this.progressBarweb1 = false;
            this.percentweb1 = 0;
            this.renovationdata.RENOVATION_ATTACHEMENTS = null;
          }
          this.renovationdata.RENOVATION_ATTACHEMENTS = this.urlappnPdf1;
          if (this.renovationdata.RENOVATION_ATTACHEMENTS != null) {
            this.gradepaynotnull1 = false;
          } else {
            this.gradepaynotnull1 = true;
          }
        }, err => {
          this.message.error('Failed To Upload Attachment For Renovation.', '');
          this.isSpinning = false;
          this.progressBarweb1 = false;
          this.percentweb1 = 0;
          this.weburl1 = null;
          this.renovationdata.RENOVATION_ATTACHEMENTS = null;
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.weburl1 = null;
      this.isSpinning = false;
      this.renovationdata.RENOVATION_ATTACHEMENTS = null;
    }
  }
  clearGradepayletter1(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.renovationdata.RENOVATION_ATTACHEMENTS = null;
          this.gradepaynotnull1 = true;
          this.percentweb1 = 0;
          this.progressBarweb1 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  getdate(data: any) {
    // Create a moment object for the provided year and month
    let date = moment({ year: data.YEAR, month: data.MONTH - 1, day: 1 });

    // Add one month to get the start date of the next month
    date = date.add(1, 'months').startOf('month');

    // Transform the date to the desired format
    const formattedDate = this.datepipe.transform(date.toDate(), 'dd/MM/yyyy');
    return formattedDate;
  }
  getdatefordesuction(data: any) {
    var d: any = new Date(data.YEAR, data.MONTH + 1, 1);
    d = this.datepipe.transform(d, 'dd/MM/yyyy');
    return d;
  }

  fetchCurrentTime(): void {
    this.api.getCurrentTime().subscribe(
      (data) => {
        this.currentTime = new Date(data.datetime);
        this.currentTimefordsen = new Date(data.datetime);
        this.currentTimeforfsen = new Date(data.datetime);
        this.currentTimeforpre = new Date(data.datetime);
        this.currentTimeforallo = new Date(data.datetime);
        this.currentTimeformis = new Date(data.datetime);
        this.currentTimeforobj = new Date(data.datetime);
        this.currentTimefoeph = new Date(data.datetime);

        var dddd: any = this.datepipe.transform(this.currentTime, "yyyy-MM-dd HH:mm:ss")
      },
      (error) => {
        console.error('Error fetching time:', error);
      }
    );
  }
  retrieveimgUrl = appkeys.retriveimgUrl;

  openCertificate(data: any) {
    window.open(
      this.retrieveimgUrl + 'habitableCertificate/' + data
    );
  }
  openCertificate1(data: any) {
    window.open(
      this.retrieveimgUrl + 'surrenderInspectorLetter/' + data
    );
  }

  applyforsurrender(surrenderdata: any) {
    this.drawerTitleSurrender = 'Apply For Surrender Quarter';
    this.drawerDataSurrender = surrenderdata;
    this.progressBarwebs1 = false;
    this.percentwebs1 = 0;
    this.weburls1 = null;
    this.LICENSE_FEE_LETTER = null;

    this.progressBarwebs2 = false;
    this.percentwebs2 = 0;
    this.weburls2 = null;
    this.LIGHT_BILL_LETTER = null;

    this.progressBarwebs3 = false;
    this.percentwebs3 = 0;
    this.weburls3 = null;
    this.SIGNED_SURRENDER_LETTER = null;
    this.gradepaynotnull2 = true;
    this.gradepaynotnull3 = true;
    this.gradepaynotnull4 = true;
    this.drawerVisibleSurrender = true;
  }
  get closeCallbackSurrender() {
    return this.drawerCloseSurrender.bind(this);
  }
  drawerCloseSurrender(): void {
    this.confirmsurrnder = false;
    this.drawerVisibleSurrender = false;
    this.progressBarwebs1 = false;
    this.percentwebs1 = 0;
    this.weburls1 = null;
    this.LICENSE_FEE_LETTER = null;

    this.progressBarwebs2 = false;
    this.percentwebs2 = 0;
    this.weburls2 = null;
    this.LIGHT_BILL_LETTER = null;

    this.progressBarwebs3 = false;
    this.percentwebs3 = 0;
    this.weburls3 = null;
    this.SIGNED_SURRENDER_LETTER = null;
    this.gradepaynotnull2 = true;
    this.gradepaynotnull3 = true;
    this.gradepaynotnull4 = true;

    this.spinningsurrenderletter = false;
    this.spinninglightbill = false;
    this.spinninglicense = false;
    this.search();
  }

  SurrenderQuarter() {
    if (this.LICENSE_FEE_LETTER == null || this.LICENSE_FEE_LETTER == undefined || this.LICENSE_FEE_LETTER == '') {
      this.message.error('Please upload license fee letter', '');
    } else if (this.LIGHT_BILL_LETTER == null || this.LIGHT_BILL_LETTER == undefined || this.LIGHT_BILL_LETTER == '') {
      this.message.error('Please upload light bill letter', '');
    } else if (this.SIGNED_SURRENDER_LETTER == null || this.SIGNED_SURRENDER_LETTER == undefined || this.SIGNED_SURRENDER_LETTER == '') {
      this.message.error('Please upload caretaker signed surrender letter', '');
    } else {
      this.confirmsurrnder = true;
    }
  }

  ConfirmSurrender() {
    console.log("drawerDataSurrender", this.drawerDataSurrender)
    if (this.LICENSE_FEE_LETTER == null || this.LICENSE_FEE_LETTER == undefined || this.LICENSE_FEE_LETTER == '') {
      this.message.error('Please upload license fee letter', '');
    } else if (this.LIGHT_BILL_LETTER == null || this.LIGHT_BILL_LETTER == undefined || this.LIGHT_BILL_LETTER == '') {
      this.message.error('Please upload light bill letter', '');
    } else if (this.SIGNED_SURRENDER_LETTER == null || this.SIGNED_SURRENDER_LETTER == undefined || this.SIGNED_SURRENDER_LETTER == '') {
      this.message.error('Please upload caretaker signed surrender letter', '');
    } else {

      var surrenderapplydata = {
        "LICENSE_FEE_LETTER": this.LICENSE_FEE_LETTER,
        "LIGHT_BILL_LETTER": this.LIGHT_BILL_LETTER,
        "SIGNED_SURRENDER_LETTER": this.SIGNED_SURRENDER_LETTER,
        "SURRENDER_FORM_SUBMITTED_DATE_TIME": this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        "SURRENDER_INSPECTOR_STATUS": "P",
        "FINAL_FLAT_TAKEN_ID": this.drawerDataSurrender.FINAL_FLAT_TAKEN_DETAILS.ID,
        "CLIENT_ID": 1
      }

      this.isSpinningrenovation = true
      this.api.Createsurrenderemp(surrenderapplydata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.message.success('Applied For Surrender Successfully', '');
            this.phconf1 = false;
            this.showren = false;
            this.isSpinningrenovation = false
            this.confirmsurrnder = false;
            this.progressBarwebs1 = false;
            this.percentwebs1 = 0;
            this.weburls1 = null;
            this.LICENSE_FEE_LETTER = null;

            this.progressBarwebs2 = false;
            this.percentwebs2 = 0;
            this.weburls2 = null;
            this.LIGHT_BILL_LETTER = null;

            this.progressBarwebs3 = false;
            this.spinningsurrenderletter = false;
            this.spinninglightbill = false;
            this.spinninglicense = false;

            this.percentwebs3 = 0;
            this.weburls3 = null;
            this.SIGNED_SURRENDER_LETTER = null;

            this.drawerCloseSurrender();
          } else {
            this.message.error('Failed To Apply For Surrender.', "");
            this.isSpinningrenovation = false
          }
        },
        (error) => {
          this.isSpinningrenovation = false
          this.message.error('something went wrong', "");
        }
      );
    }
  }


  cancelsurrenderConfirm() {
    this.confirmsurrnder = false;
  }


  spinninglicense: boolean = false
  spinninglightbill: boolean = false
  spinningsurrenderletter: boolean = false
  onfilewebs1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.weburls1 = <File>event.target.files[0];
      const maxFileSize = 5 * 1024 * 1024; // 1 MB

      if (this.weburls1.size > maxFileSize) {
        this.message.error('File size should not exceed 5MB.', '');
        this.weburls1 = null;
        return;
      }
      if (this.weburls1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.weburls1.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdfs1 = url;
        if (
          this.LICENSE_FEE_LETTER != undefined &&
          this.LICENSE_FEE_LETTER.trim() != ''
        ) {
          var arr = this.LICENSE_FEE_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.spinninglicense = true
      this.progressBarwebs1 = true;
      this.timerltcCondonationOfDelays1 = this.api
        .onUpload2('licenseFeeLetter', this.weburls1, this.urlappnPdfs1)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentwebs1 = percentDone;
            if (this.percentwebs1 == 100) {
              this.spinninglicense = false;
            }
          }
          if (res['body']['code'] == 200) {
            this.message.success('License Fee Letter Uploaded Successfully.', '');
            this.LICENSE_FEE_LETTER = this.urlappnPdfs1;
            this.spinninglicense = false;
          } else {
            this.message.error('Failed To Upload License Fee Letter.', '');
            this.spinninglicense = false;
            this.progressBarwebs1 = false;
            this.percentwebs1 = 0;
            this.LICENSE_FEE_LETTER = null;
          }
          this.LICENSE_FEE_LETTER = this.urlappnPdfs1;
          if (this.LICENSE_FEE_LETTER != null) {
            this.gradepaynotnull2 = false;
          } else {
            this.gradepaynotnull2 = true;
          }
        }, err => {
          this.message.error('Failed To Upload License Fee Letter.', '');
          this.spinninglicense = false;
          this.progressBarwebs1 = false;
          this.percentwebs1 = 0;
          this.weburls1 = null;
          this.LICENSE_FEE_LETTER = null;
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.weburls1 = null;
      this.spinninglicense = false;
      this.LICENSE_FEE_LETTER = null;
    }
  }

  clearGradepayletters1(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.LICENSE_FEE_LETTER = null;
          this.gradepaynotnull2 = true;
          this.percentwebs1 = 0;
          this.progressBarwebs1 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  onfilewebs2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.weburls2 = <File>event.target.files[0];

      const maxFileSize = 5 * 1024 * 1024; // 1 MB

      if (this.weburls2.size > maxFileSize) {
        this.message.error('File size should not exceed 5MB.', '');
        this.weburls2 = null;
        return;
      }
      if (this.weburls2 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.weburls2.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdfs2 = url;
        if (
          this.LIGHT_BILL_LETTER != undefined &&
          this.LIGHT_BILL_LETTER.trim() != ''
        ) {
          var arr = this.LIGHT_BILL_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.spinninglightbill = true
      this.progressBarwebs2 = true;
      this.timerltcCondonationOfDelays2 = this.api
        .onUpload2('lightBillLetter', this.weburls2, this.urlappnPdfs2)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentwebs2 = percentDone;
            if (this.percentwebs2 == 100) {
              this.spinninglightbill = false;
            }
          }
          if (res['body']['code'] == 200) {
            this.message.success('Light Bill Letter Uploaded Successfully.', '');
            this.LIGHT_BILL_LETTER = this.urlappnPdfs2;
            this.spinninglightbill = false;
          } else {
            this.message.error('Failed To Upload Light Bill Letter.', '');
            this.spinninglightbill = false;
            this.progressBarwebs2 = false;
            this.percentwebs2 = 0;
            this.LIGHT_BILL_LETTER = null;
          }
          this.LIGHT_BILL_LETTER = this.urlappnPdfs2;
          if (this.LIGHT_BILL_LETTER != null) {
            this.gradepaynotnull3 = false;
          } else {
            this.gradepaynotnull3 = true;
          }
        }, err => {
          this.message.error('Failed To Upload Light Bill Letter.', '');
          this.spinninglightbill = false;
          this.progressBarwebs2 = false;
          this.percentwebs2 = 0;
          this.weburls2 = null;
          this.LIGHT_BILL_LETTER = null;
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.weburls2 = null;
      this.spinninglightbill = false;
      this.LIGHT_BILL_LETTER = null;
    }
  }
  clearGradepayletters2(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.LIGHT_BILL_LETTER = null;
          this.gradepaynotnull3 = true;
          this.percentwebs2 = 0;
          this.progressBarwebs2 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  onfilewebs3(event: any) {
    if (event.target.files[0].type == 'application/pdf') {

      const maxFileSize = 5 * 1024 * 1024; // 1 MB
      this.weburls3 = <File>event.target.files[0];

      if (this.weburls3.size > maxFileSize) {
        this.message.error('File size should not exceed 5MB.', '');
        this.weburls3 = null;
        return;
      }
      if (this.weburls3 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.weburls3.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdfs3 = url;
        if (
          this.SIGNED_SURRENDER_LETTER != undefined &&
          this.SIGNED_SURRENDER_LETTER.trim() != ''
        ) {
          var arr = this.SIGNED_SURRENDER_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.spinningsurrenderletter = true
      this.progressBarwebs3 = true;
      this.timerltcCondonationOfDelays3 = this.api
        .onUpload2('surrenderLetter', this.weburls3, this.urlappnPdfs3)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentwebs3 = percentDone;
            if (this.percentwebs3 == 100) {
              this.spinningsurrenderletter = false;
            }
          }
          if (res['body']['code'] == 200) {
            this.message.success('Surrender Letter (Signed by Caretaker) Uploaded Successfully.', '');
            this.SIGNED_SURRENDER_LETTER = this.urlappnPdfs3;
            this.spinningsurrenderletter = false;
          } else {
            this.message.error('Failed To Upload Surrender Letter (Signed by Caretaker).', '');
            this.spinningsurrenderletter = false;
            this.progressBarwebs3 = false;
            this.percentwebs3 = 0;
            this.SIGNED_SURRENDER_LETTER = null;
          }
          this.SIGNED_SURRENDER_LETTER = this.urlappnPdfs3;
          if (this.SIGNED_SURRENDER_LETTER != null) {
            this.gradepaynotnull4 = false;
          } else {
            this.gradepaynotnull4 = true;
          }
        }, err => {
          this.message.error('Failed To Upload Surrender Letter (Signed by Caretaker).', '');
          this.spinningsurrenderletter = false;
          this.progressBarwebs3 = false;
          this.percentwebs3 = 0;
          this.weburls3 = null;
          this.SIGNED_SURRENDER_LETTER = null;
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.weburls3 = null;
      this.spinningsurrenderletter = false;
      this.SIGNED_SURRENDER_LETTER = null;
    }
  }
  clearGradepayletters3(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.SIGNED_SURRENDER_LETTER = null;
          this.gradepaynotnull4 = true;
          this.percentwebs3 = 0;
          this.progressBarwebs3 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }



  Viewattachment(url: string, numberss: any) {
    if (numberss == 'a') {
      const fileUrl = this.api.retriveimgUrl + 'licenseFeeLetter/' + url;
      window.open(fileUrl);
    } else if (numberss == 'b') {
      const fileUrl = this.api.retriveimgUrl + 'lightBillLetter/' + url;
      window.open(fileUrl);
    } else {
      const fileUrl = this.api.retriveimgUrl + 'surrenderLetter/' + url;
      window.open(fileUrl);
    }

  }
}