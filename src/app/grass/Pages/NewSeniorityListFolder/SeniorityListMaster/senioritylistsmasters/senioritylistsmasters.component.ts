import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { newSeniorityist } from 'src/app/grass/Models/NewSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { endOfMonth, startOfMonth, subYears } from 'date-fns';

@Component({
  selector: 'app-senioritylistsmasters',
  templateUrl: './senioritylistsmasters.component.html',
  styleUrls: ['./senioritylistsmasters.component.css'],
  providers: [DatePipe],
})
export class SenioritylistsmastersComponent {
  data: newSeniorityist = new newSeniorityist();
  n = 0;
  dataList: any = [];
  isSpinning = false;
  ResidenceType: any = [];
  ResidenceTypelist: any = [];
  MONTH = new Date();
  YEAR = new Date();
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  datenew = new Date();
  selectFromMonth: any;
  selectToMonth: any;
  selectyear: any;
  selectoyear: any;
  RESIDENCE_TYPE: any;
  RESIDENCE_TYPE_IDD: any = [];
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  columns = [];
  NEW: number;
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  FlatRequestarray: any = [];
  userid: any;
  roleid: any;
  isSpinningTrue: boolean = false;
  dataList1: any;
  countdowndisable: boolean = true;
  Timmerstartloop: any = [];
  Timmerendloop: any = [];
  applicationCount: any;
  flatsCount: any;
  objectionsCount: any;
  YEAR2;
  loadingRecords = false;
  DraftDataShow: any;
  FinalDataShow: any;
  CastCategory: any = 'GN';
  ShowTable = false;
  countdowndisableForPreference: boolean = true;
  TimmerstartloopForPreference: any = [];
  TimmerendloopForPreference: any = [];
  countdowndisableForFinal: boolean = true;
  TimmerstartloopForFinal: any = [];
  TimmerendloopForFinal: any = [];
  Monthrange: any = [];
  startdatenow = new Date();
  countdownInterval: any = [];
  countdownInterval1: any = [];
  countdownIntervalForFinal: any = [];
  countdownIntervalForPreference: any = [];
  countdownInterval1aal: any = [];
  showfinalbutton = false;
  searchfilteredrecords: any = '';
  showgeneratedlist: any = [];
  dupshowgeneratedlist: any = [];
  ShowDrawerVisible = false;
  currentTime: Date = new Date();
  currentTimeobjstart: Date = new Date();
  currentTimeobjend: Date = new Date();
  currentTimeprepstart: Date = new Date();
  currentTimeallend: Date = new Date();
  isdraft: any;
  isVisible = false;
  isSpinning112 = false;
  isSpinning12 = false;
  showcolums = false;
  SeniorityVisibleShow = false;
  SeniorityTitleShow = '';
  modaldata: any;
  isSpinning11: any = false;
  AddSenioritydrawer = false;
  AddSeniorityTitle = '';
  Senioritydataobj: any;
  currentstage = 0;
  tempdataid: any;
  Objectionsdrawervisible = false;
  Objectiondrawertitle = '';
  Objectionsdrawerdata: any;
  StringObjectionfilter: any;
  viewVacantFlatsVisible: boolean = false;
  VacantFlatsdrawertitle = 'Vacancy Order & Notice Process';
  VacantFlatsdrawerdata: any;
  employeefilterid: any = [];
  flatPreferenceDataList: any = [];
  flatPreferenceList: any = [];
  flatPreferancepageIndex: any = 0;
  flatPreferancepageSize: any = 10;
  isPrevious: boolean = false;
  drawerTitleForPreference = 'Vacant Quarters';
  drawerDataForPreference: any;
  VacantFlatScenarityId: any;
  drawerVisibleForPreference: boolean = false;
  drafttitleaforallotment = '';
  employeefilteridForfinal: any = [];
  DrawerVisibleData: any;
  DrawerVisibleTitle: any;
  DrawerVisiblechek: boolean = false;
  scenioritycardId: any;
  finalallotmenttitle: any = '';
  ObjectionsdrawervisibleAllot = false;
  ObjectiondrawertitleAllot = '';
  ObjectionsdrawerdataAllot: any;
  StringObjectionfilterAllot: any;
  uptrue: boolean[] = [];
  openmissshow: boolean = false;
  misdata: any;
  mistitle: string = '';
  mislistdata: any;
  constructor(
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private api: APIServicesService
  ) {}

  onChangemonth(result: Date[]): void {
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
  }

  ngOnInit() {
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    var nextMonthDate = new Date(lastYearSameMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    this.Monthrange[0] = nextMonthDate;
    this.Monthrange[1] = endOfCurrentMonth;
    this.userid = Number(sessionStorage.getItem('userId'));
    this.roleid = Number(sessionStorage.getItem('roleId'));
    this.getResidenceTypestart();
  }

  keyup(event: any) {
    this.search(true);
  }

  search(reset: boolean = false) {
    for (let cc = 0; cc < this.dataList.length; cc++) {
      clearInterval(this.countdownInterval1[cc]);
      clearInterval(this.countdownInterval[cc]);
      clearInterval(this.countdownIntervalForFinal[cc]);
      clearInterval(this.countdownIntervalForPreference[cc]);
      clearInterval(this.countdownInterval1aal[cc]);
    }
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }

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
    this.isSpinningTrue = true;
    if (this.RESIDENCE_TYPE_IDD.length > 0) {
      this.api
        .getSeniorityListWithCount(
          0,
          0,
          'ID',
          'desc',
          " AND DATE_CREATED_BY_MONTH BETWEEN '" +
            this.MONTH1 +
            "' AND '" +
            this.MONTH2 +
            "' AND RESIDENCE_TYPE_ID in (" +
            this.RESIDENCE_TYPE_IDD +
            ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.isSpinningTrue = false;
              this.isSpinning = false;
              this.fetchCurrentTime();
              this.dataList = data['data'];
              this.dataList1 = data['data'];
              // this.dataList = this.dataList.map((item) => ({
              //   ...item,
              //   NEW_STEP_NO: 3,
              // }));

              this.applicationCount = data['APPLICATION_COUNT'];
              this.flatsCount = data['FLAT_COUNT'];
              this.objectionsCount = data['OBJECTION_COUNT'];
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
              this.isFilterApplied = 'primary';
              if (this.dataList.length > 0) {
                this.Timmerstartloop.length = this.dataList.length;
                this.Timmerendloop.length = this.dataList.length;

                let timeremaining: any = [];
                let timeremaining2: any = [];
                timeremaining.length = this.dataList.length;
                timeremaining2.length = this.dataList.length;

                for (let ab = 0; ab < this.dataList.length; ab++) {
                  this.Timmerstartloop[ab] = '';
                  let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                  let targetDate = new Date(startdate);
                  clearInterval(this.countdownInterval[ab]);
                  this.countdownInterval[ab] = setInterval(() => {
                    const currentDate = new Date(this.currentTimeobjstart);
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
                      (seconds % 60) +
                      ' Sec';
                    if (timeremaining[ab] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(this.countdownInterval[ab]);
                      this.Timmerstartloop[ab] = '';
                      timeremaining[ab] = 0;
                    }
                    this.currentTimeobjstart.setSeconds(
                      this.currentTimeobjstart.getSeconds() + 1
                    );
                  }, 1000);
                }

                for (let cc = 0; cc < this.dataList.length; cc++) {
                  this.Timmerendloop[cc] = '';
                  let sapandate = this.dataList[cc]['OBJ_END_DATE_TIME'];
                  let targetDate = new Date(sapandate);

                  clearInterval(this.countdownInterval1[cc]);
                  this.countdownInterval1[cc] = setInterval(() => {
                    const currentDate = new Date(this.currentTimeobjend);
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
                      (seconds % 60) +
                      ' Sec';
                    if (timeremaining2[cc] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(this.countdownInterval1[cc]);
                      this.Timmerendloop[cc] = '';
                      timeremaining2[cc] = 0;
                    }
                    this.currentTimeobjend.setSeconds(
                      this.currentTimeobjend.getSeconds() + 1
                    );
                  }, 1000);
                }
              }

              for (var i = 0; i < data['data'].length; i++) {
                if (data['data'].length === data['FLAT_COUNT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['FLAT_COUNT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['FLATCOUNT'] = data['FLAT_COUNT'][i];
                  } else {
                  }
                }
                if (data['data'].length === data['MISCOUNT'].length) {
                  if (data['MISCOUNT'][i] != null) {
                    if (
                      this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                      data['MISCOUNT'][i]['RESIDENCE_TYPE_ID']
                    ) {
                      this.dataList[i]['MISCOUNT'] = data['MISCOUNT'][i];
                    } else {
                    }
                  }
                }

                if (data['data'].length === data['APPLICATION_COUNT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['APPLICATION_COUNT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['APPLICATIONS'] =
                      data['APPLICATION_COUNT'][i];
                  } else {
                  }
                }

                if (data['data'].length === data['OBJECTION_COUNT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['OBJECTION_COUNT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['OBJECTION'] = data['OBJECTION_COUNT'][i];
                  } else {
                  }
                }
                if (data['data'].length === data['ALLOTMENT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['ALLOTMENT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['ALLOTMENT'] = data['ALLOTMENT'][i];
                  } else {
                  }
                }

                if (i + 1 == data['data'].length) {
                  this.isSpinning = false;
                  this.filterClass = 'filter-invisible';
                }
                this.isSpinning = false;
              }

              if (this.dataList.length > 0) {
                this.TimmerstartloopForPreference.length = this.dataList.length;
                let timeremainingForPreference: any = [];
                timeremainingForPreference.length = this.dataList.length;

                for (let ab = 0; ab < this.dataList.length; ab++) {
                  let startdateForPreference =
                    this.dataList[ab]['PREFERENCE_END_DATE_TIME'];
                  let targetDateForPreference = new Date(
                    startdateForPreference
                  );
                  clearInterval(this.countdownIntervalForPreference[ab]);

                  this.countdownIntervalForPreference[ab] = setInterval(() => {
                    const currentDateForPreference = new Date(
                      this.currentTimeprepstart
                    );
                    timeremainingForPreference[ab] =
                      targetDateForPreference.getTime() -
                      currentDateForPreference.getTime();

                    const secondsForPreference = Math.floor(
                      timeremainingForPreference[ab] / 1000
                    );
                    const minutesForPreference = Math.floor(
                      secondsForPreference / 60
                    );
                    const hoursForPreference = Math.floor(
                      minutesForPreference / 60
                    );
                    const daysForPreference = Math.floor(
                      hoursForPreference / 24
                    );
                    this.TimmerstartloopForPreference[ab] =
                      (daysForPreference % 24) +
                      ' Day : ' +
                      (hoursForPreference % 24) +
                      ' Hrs : ' +
                      (minutesForPreference % 60) +
                      ' Min : ' +
                      (secondsForPreference % 60) +
                      ' Sec';
                    if (timeremainingForPreference[ab] <= 0) {
                      this.countdowndisableForPreference = false;
                      clearInterval(this.countdownIntervalForPreference[ab]);
                      this.TimmerstartloopForPreference[ab] = 0;
                      timeremainingForPreference[ab] = 0;
                    }
                    this.currentTimeprepstart.setSeconds(
                      this.currentTimeprepstart.getSeconds() + 1
                    );
                  }, 1000);
                }
              }

              if (this.dataList.length > 0) {
                this.TimmerstartloopForFinal.length = this.dataList.length;
                this.TimmerendloopForFinal.length = this.dataList.length;

                let timeremainingForFinal: any = [];
                let timeremaining2ForFinal: any = [];
                timeremainingForFinal.length = this.dataList.length;
                timeremaining2ForFinal.length = this.dataList.length;

                for (let ab = 0; ab < this.dataList.length; ab++) {
                  let startdateForFinal =
                    this.dataList[ab]['ALL_START_DATETIME'];
                  let targetDateForFinal = new Date(startdateForFinal);
                  clearInterval(this.countdownIntervalForFinal[ab]);

                  this.countdownIntervalForFinal[ab] = setInterval(() => {
                    const currentDateForFinal = new Date(
                      this.currentTimeallend
                    );
                    timeremainingForFinal[ab] =
                      targetDateForFinal.getTime() -
                      currentDateForFinal.getTime();

                    const secondsForFinal = Math.floor(
                      timeremainingForFinal[ab] / 1000
                    );
                    const minutesForFinal = Math.floor(secondsForFinal / 60);
                    const hoursForFinal = Math.floor(minutesForFinal / 60);
                    const daysForFinal = Math.floor(hoursForFinal / 24);
                    this.TimmerstartloopForFinal[ab] =
                      (daysForFinal % 24) +
                      ' Day : ' +
                      (hoursForFinal % 24) +
                      ' Hrs : ' +
                      (minutesForFinal % 60) +
                      ' Min : ' +
                      (secondsForFinal % 60) +
                      ' Sec';
                    if (timeremainingForFinal[ab] <= 0) {
                      this.countdowndisableForFinal = false;
                      clearInterval(this.countdownIntervalForFinal[ab]);
                      this.TimmerstartloopForFinal[ab] = 0;
                      timeremainingForFinal[ab] = 0;
                    }
                    this.currentTimeallend.setSeconds(
                      this.currentTimeallend.getSeconds() + 1
                    );
                  }, 1000);
                }

                for (let cc = 0; cc < this.dataList.length; cc++) {
                  let sapandate = this.dataList[cc]['ALL_END_DATETIME'];
                  let targetDateForFinal = new Date(sapandate);
                  clearInterval(this.countdownInterval1aal[cc]);

                  this.countdownInterval1aal[cc] = setInterval(() => {
                    const currentDateForFinal = new Date(this.currentTime);
                    timeremaining2ForFinal[cc] =
                      targetDateForFinal.getTime() -
                      currentDateForFinal.getTime();

                    const secondsForFinal = Math.floor(
                      timeremaining2ForFinal[cc] / 1000
                    );
                    const minutesForFinal = Math.floor(secondsForFinal / 60);
                    const hoursForFinal = Math.floor(minutesForFinal / 60);
                    const daysForFinal = Math.floor(hoursForFinal / 24);
                    this.TimmerendloopForFinal[cc] =
                      (daysForFinal % 24) +
                      ' Day : ' +
                      (hoursForFinal % 24) +
                      ' Hrs : ' +
                      (minutesForFinal % 60) +
                      ' Min : ' +
                      (secondsForFinal % 60) +
                      ' Sec';
                    if (timeremaining2ForFinal[cc] <= 0) {
                      this.countdowndisableForFinal = false;
                      clearInterval(this.countdownInterval1aal[cc]);
                      this.TimmerendloopForFinal[cc] = 0;
                      timeremaining2ForFinal[cc] = 0;
                    }
                    this.currentTime.setSeconds(
                      this.currentTime.getSeconds() + 1
                    );
                  }, 1000);
                }
              }
            } else {
              this.isSpinningTrue = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinningTrue = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          }
        );
    } else {
      this.api
        .getSeniorityListWithCount(
          0,
          0,
          'ID',
          'desc',
          " AND DATE_CREATED_BY_MONTH BETWEEN '" +
            this.MONTH1 +
            "' AND '" +
            this.MONTH2 +
            "'"
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.isSpinningTrue = false;
              this.isSpinning = false;
              this.fetchCurrentTime();
              this.dataList = data['data'];
              this.dataList1 = data['data'];
              this.applicationCount = data['APPLICATION_COUNT'];
              this.flatsCount = data['FLAT_COUNT'];
              this.objectionsCount = data['OBJECTION_COUNT'];
              this.filterClass = 'filter-invisible';
              this.isFilterApplied = 'primary';

              if (this.dataList.length > 0) {
                this.Timmerstartloop.length = this.dataList.length;
                this.Timmerendloop.length = this.dataList.length;

                let timeremaining: any = [];
                let timeremaining2: any = [];
                timeremaining.length = this.dataList.length;
                timeremaining2.length = this.dataList.length;

                for (let ab = 0; ab < this.dataList.length; ab++) {
                  this.Timmerstartloop[ab] = '';
                  let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                  let targetDate = new Date(startdate);
                  clearInterval(this.countdownInterval[ab]);
                  this.countdownInterval[ab] = setInterval(() => {
                    const currentDate = new Date(this.currentTimeobjstart);
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
                      (seconds % 60) +
                      ' Sec';
                    if (timeremaining[ab] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(this.countdownInterval[ab]);
                      this.Timmerstartloop[ab] = '';
                      timeremaining[ab] = 0;
                    }
                    this.currentTimeobjstart.setSeconds(
                      this.currentTimeobjstart.getSeconds() + 1
                    );
                  }, 1000);
                }

                for (let cc = 0; cc < this.dataList.length; cc++) {
                  this.Timmerendloop[cc] = '';
                  let sapandate = this.dataList[cc]['OBJ_END_DATE_TIME'];
                  let targetDate = new Date(sapandate);

                  clearInterval(this.countdownInterval1[cc]);
                  this.countdownInterval1[cc] = setInterval(() => {
                    const currentDate = new Date(this.currentTimeobjend);
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
                      (seconds % 60) +
                      ' Sec';
                    if (timeremaining2[cc] <= 0) {
                      this.countdowndisable = false;
                      clearInterval(this.countdownInterval1[cc]);
                      this.Timmerendloop[cc] = '';
                      timeremaining2[cc] = 0;
                    }
                    this.currentTimeobjend.setSeconds(
                      this.currentTimeobjend.getSeconds() + 1
                    );
                  }, 1000);
                }
              }

              for (var i = 0; i < data['data'].length; i++) {
                if (data['data'].length === data['FLAT_COUNT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['FLAT_COUNT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['FLATCOUNT'] = data['FLAT_COUNT'][i];
                  } else {
                  }
                }

                if (data['data'].length === data['MISCOUNT'].length) {
                  if (data['MISCOUNT'][i] != null) {
                    if (
                      this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                      data['MISCOUNT'][i]['RESIDENCE_TYPE_ID']
                    ) {
                      this.dataList[i]['MISCOUNT'] = data['MISCOUNT'][i];
                    } else {
                    }
                  }
                }

                if (data['data'].length === data['APPLICATION_COUNT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['APPLICATION_COUNT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['APPLICATIONS'] =
                      data['APPLICATION_COUNT'][i];
                  } else {
                  }
                }

                if (data['data'].length === data['OBJECTION_COUNT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['OBJECTION_COUNT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['OBJECTION'] = data['OBJECTION_COUNT'][i];
                  } else {
                  }
                }
                if (data['data'].length === data['ALLOTMENT'].length) {
                  if (
                    this.dataList[i]['RESIDENCE_TYPE_ID'] ===
                    data['ALLOTMENT'][i]['RESIDENCE_TYPE_ID']
                  ) {
                    this.dataList[i]['ALLOTMENT'] = data['ALLOTMENT'][i];
                  } else {
                  }
                }

                if (i + 1 == data['data'].length) {
                  this.isSpinning = false;
                  this.filterClass = 'filter-invisible';
                }
                this.isSpinning = false;
              }

              if (this.dataList.length > 0) {
                this.TimmerstartloopForPreference.length = this.dataList.length;
                let timeremainingForPreference: any = [];
                timeremainingForPreference.length = this.dataList.length;
                for (let ab = 0; ab < this.dataList.length; ab++) {
                  let startdateForPreference =
                    this.dataList[ab]['PREFERENCE_END_DATE_TIME'];
                  let targetDateForPreference = new Date(
                    startdateForPreference
                  );
                  clearInterval(this.countdownIntervalForPreference[ab]);

                  this.countdownIntervalForPreference[ab] = setInterval(() => {
                    const currentDateForPreference = new Date(
                      this.currentTimeprepstart
                    );
                    timeremainingForPreference[ab] =
                      targetDateForPreference.getTime() -
                      currentDateForPreference.getTime();

                    const secondsForPreference = Math.floor(
                      timeremainingForPreference[ab] / 1000
                    );
                    const minutesForPreference = Math.floor(
                      secondsForPreference / 60
                    );
                    const hoursForPreference = Math.floor(
                      minutesForPreference / 60
                    );
                    const daysForPreference = Math.floor(
                      hoursForPreference / 24
                    );
                    this.TimmerstartloopForPreference[ab] =
                      (daysForPreference % 24) +
                      ' Day : ' +
                      (hoursForPreference % 24) +
                      ' Hrs : ' +
                      (minutesForPreference % 60) +
                      ' Min : ' +
                      (secondsForPreference % 60) +
                      ' Sec';
                    if (timeremainingForPreference[ab] <= 0) {
                      this.countdowndisableForPreference = false;
                      clearInterval(this.countdownIntervalForPreference[ab]);
                      this.TimmerstartloopForPreference[ab] = 0;
                      timeremainingForPreference[ab] = 0;
                    }
                    this.currentTimeprepstart.setSeconds(
                      this.currentTimeprepstart.getSeconds() + 1
                    );
                  }, 1000);
                }
              }

              if (this.dataList.length > 0) {
                this.TimmerstartloopForFinal.length = this.dataList.length;
                this.TimmerendloopForFinal.length = this.dataList.length;

                let timeremainingForFinal: any = [];
                let timeremaining2ForFinal: any = [];
                timeremainingForFinal.length = this.dataList.length;
                timeremaining2ForFinal.length = this.dataList.length;

                for (let ab = 0; ab < this.dataList.length; ab++) {
                  let startdateForFinal =
                    this.dataList[ab]['ALL_START_DATETIME'];
                  let targetDateForFinal = new Date(startdateForFinal);
                  clearInterval(this.countdownIntervalForFinal[ab]);

                  this.countdownIntervalForFinal[ab] = setInterval(() => {
                    const currentDateForFinal = new Date(
                      this.currentTimeallend
                    );
                    timeremainingForFinal[ab] =
                      targetDateForFinal.getTime() -
                      currentDateForFinal.getTime();

                    const secondsForFinal = Math.floor(
                      timeremainingForFinal[ab] / 1000
                    );
                    const minutesForFinal = Math.floor(secondsForFinal / 60);
                    const hoursForFinal = Math.floor(minutesForFinal / 60);
                    const daysForFinal = Math.floor(hoursForFinal / 24);
                    this.TimmerstartloopForFinal[ab] =
                      (daysForFinal % 24) +
                      ' Day : ' +
                      (hoursForFinal % 24) +
                      ' Hrs : ' +
                      (minutesForFinal % 60) +
                      ' Min : ' +
                      (secondsForFinal % 60) +
                      ' Sec';
                    if (timeremainingForFinal[ab] <= 0) {
                      this.countdowndisableForFinal = false;
                      clearInterval(this.countdownIntervalForFinal[ab]);
                      this.TimmerstartloopForFinal[ab] = 0;
                      timeremainingForFinal[ab] = 0;
                    }
                    this.currentTimeallend.setSeconds(
                      this.currentTimeallend.getSeconds() + 1
                    );
                  }, 1000);
                }

                for (let cc = 0; cc < this.dataList.length; cc++) {
                  let sapandate = this.dataList[cc]['ALL_END_DATETIME'];
                  let targetDateForFinal = new Date(sapandate);
                  clearInterval(this.countdownInterval1aal[cc]);

                  this.countdownInterval1aal[cc] = setInterval(() => {
                    const currentDateForFinal = new Date(this.currentTime);
                    timeremaining2ForFinal[cc] =
                      targetDateForFinal.getTime() -
                      currentDateForFinal.getTime();

                    const secondsForFinal = Math.floor(
                      timeremaining2ForFinal[cc] / 1000
                    );
                    const minutesForFinal = Math.floor(secondsForFinal / 60);
                    const hoursForFinal = Math.floor(minutesForFinal / 60);
                    const daysForFinal = Math.floor(hoursForFinal / 24);
                    this.TimmerendloopForFinal[cc] =
                      (daysForFinal % 24) +
                      ' Day : ' +
                      (hoursForFinal % 24) +
                      ' Hrs : ' +
                      (minutesForFinal % 60) +
                      ' Min : ' +
                      (secondsForFinal % 60) +
                      ' Sec';
                    if (timeremaining2ForFinal[cc] <= 0) {
                      this.countdowndisableForFinal = false;
                      clearInterval(this.countdownInterval1aal[cc]);
                      this.TimmerendloopForFinal[cc] = 0;
                      timeremaining2ForFinal[cc] = 0;
                    }
                    this.currentTime.setSeconds(
                      this.currentTime.getSeconds() + 1
                    );
                  }, 1000);
                }
              }
            } else {
              this.isSpinningTrue = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinningTrue = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          }
        );
    }
  }

  changecastGeneral(event: any) {
    if (event == 'GN') {
      this.loadingRecords = true;
      this.showgeneratedlist = [...this.dupshowgeneratedlist];
      this.loadingRecords = false;
    } else if (event == 'SC') {
      this.loadingRecords = true;
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (value: any) => {
          this.loadingRecords = false;
          return value.CAST == 'SC';
        }
      );
    } else if (event == 'ST') {
      this.loadingRecords = true;
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (value: any) => {
          this.loadingRecords = false;
          return value.CAST == 'ST';
        }
      );
    }
  }

  searchrecords() {
    if (
      this.searchfilteredrecords == '' ||
      this.searchfilteredrecords.length < 3
    ) {
      this.showgeneratedlist = this.dupshowgeneratedlist;
    } else {
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (option) =>
          option.EMPLOYEE_NAME.toLowerCase().indexOf(
            this.searchfilteredrecords.toLowerCase()
          ) !== -1
      );
    }
  }

  ViewModalAndCastData(data: any) {
    if (data.RESIDENCE_TYPE_ID > 4) {
      this.showcolums = true;
    } else {
      this.showcolums = false;
    }
    if (data.TEMP_STEP_NO < 7) {
      this.showfinalbutton = false;
    } else {
      this.showfinalbutton = true;
    }
    this.DraftDataShow = Object.assign({}, data);
    this.FinalDataShow = Object.assign({}, data);
    this.ShowDrawerVisible = true;
  }

  ShowDrawerVisibleCancel() {
    this.ShowDrawerVisible = false;
  }

  ShowDraftDrawer() {
    this.showgeneratedlist = [];
    this.dupshowgeneratedlist = [];
    this.loadingRecords = true;
    this.isSpinning112 = true;

    this.api
      .tempwaitinglistdetailscall(
        0,
        0,
        'CURRENT_SEQ',
        'asc',
        ' AND  TEMP_WAITING_MASTER_ID = ' + this.DraftDataShow.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.ShowDrawerVisibleCancel();
            this.showgeneratedlist = data['data'];
            this.dupshowgeneratedlist = data['data'];
            this.SeniorityVisibleShow = true;
            this.SeniorityTitleShow = 'View Draft Order';
            this.ShowTable = true;
            this.loadingRecords = false;
            this.isSpinning112 = false;
          } else {
            this.message.error('Failed To get data', '');
            this.isSpinning112 = false;
          }
        },
        (error) => {
          this.message.error('Failed To get data', '');
          this.isSpinning112 = false;
        }
      );
  }

  ShowFinalDrawer() {
    this.showgeneratedlist = [];
    this.dupshowgeneratedlist = [];
    if (this.FinalDataShow.TEMP_STEP_NO > 7) {
      this.loadingRecords = true;
      this.isSpinning12 = true;
      this.api
        .DraftwaitingListDetails(
          0,
          0,
          'CURRENT_SEQ_NO',
          'asc',
          ' AND DRAFT_WAITING_MASTER_ID = ' +
            this.FinalDataShow.DRAFT_WAITING_MASTER_ID
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.ShowDrawerVisibleCancel();
              this.showgeneratedlist = data['data'];
              this.dupshowgeneratedlist = data['data'];
              this.loadingRecords = false;
              this.SeniorityVisibleShow = true;
              this.ShowTable = false;
              this.loadingRecords = false;
              this.isSpinning12 = false;
              this.SeniorityTitleShow = 'View Final Order';
            }
          },
          (error) => {
            this.message.error('Failed To get data', '');
            this.isSpinning12 = false;
          }
        );
    } else {
      this.message.error('Final List Is Not Published Yet', '');
      this.isSpinning12 = false;
    }
  }

  CloseDrawer() {
    this.SeniorityVisibleShow = false;
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
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
      for (let cc = 0; cc < this.dataList.length; cc++) {
        clearInterval(this.countdownInterval1[cc]);
        clearInterval(this.countdownInterval[cc]);
        clearInterval(this.countdownIntervalForFinal[cc]);
        clearInterval(this.countdownIntervalForPreference[cc]);
        clearInterval(this.countdownInterval1aal[cc]);
      }

      this.search(true);
    }
  }
  clearFilter() {
    for (let cc = 0; cc < this.dataList.length; cc++) {
      clearInterval(this.countdownInterval1[cc]);
      clearInterval(this.countdownInterval[cc]);
      clearInterval(this.countdownIntervalForFinal[cc]);
      clearInterval(this.countdownIntervalForPreference[cc]);
      clearInterval(this.countdownInterval1aal[cc]);
    }

    this.RESIDENCE_TYPE = '';
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }
    this.Monthrange = [];
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    var nextMonthDate = new Date(lastYearSameMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    this.Monthrange[0] = nextMonthDate;
    this.Monthrange[1] = endOfCurrentMonth;
    this.search(true);
    this.isFilterApplied = 'default';
  }

  getResidenceType() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          this.ResidenceTypelist = data['data'];
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }
  getResidenceTypestart() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
          }
          this.applyFilter();
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  handleCancel(): void {
    this.search();
    this.isVisible = false;
  }

  addNewList() {
    this.modaldata.MONTH = this.datepipe.transform(this.modaldata.MONTH, 'MM');
    this.modaldata.YEAR = this.datepipe.transform(this.modaldata.YEAR, 'yyyy');
    this.modaldata.CREATOR_ID = this.userid;
    if (this.modaldata.MONTH == null || this.modaldata.MONTH == undefined) {
      this.message.error('Please Select Month', '');
    } else if (
      this.modaldata.YEAR == null ||
      this.modaldata.YEAR == undefined
    ) {
      this.message.error('Please Select Year', '');
    } else if (
      this.modaldata.RESIDENCE_TYPE_ID == null ||
      this.modaldata.RESIDENCE_TYPE_ID == undefined
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      this.isSpinning11 = true;
      this.api.CreateSeniorityList(this.modaldata).subscribe(
        (successCode) => {
          if (successCode.code == '200') {
            this.message.success('Monthy Process Created Successfully', '');
            this.isSpinning11 = false;
            this.handleCancel();
          } else if (successCode.code == '300') {
            this.isSpinning11 = false;
            this.message.info(
              'Some application are Pending, Please check & take action over it.',
              ''
            );
            this.modaldata.MONTH = new Date(this.modaldata.MONTH);
            this.modaldata.YEAR = new Date(this.modaldata.YEAR);
          } else if (successCode.code == '304') {
            this.isSpinning11 = false;
            this.message.info(
              'Order cannot be created, due to no application are found.',
              ''
            );
            this.modaldata.MONTH = new Date(this.modaldata.MONTH);
            this.modaldata.YEAR = new Date(this.modaldata.YEAR);
          } else if (successCode.code == '403') {
            this.isSpinning11 = false;
            this.message.info('Monthly Process Already Exists', '');
            this.modaldata.MONTH = new Date(this.modaldata.MONTH);
            this.modaldata.YEAR = new Date(this.modaldata.YEAR);
          } else {
            this.isSpinning11 = false;
            this.message.error('Failed To Create Monthy Process', '');
          }
        },
        (err) => {
          this.isSpinning11 = false;
          this.message.error('Failed To Create Monthy Process', '');
        }
      );
    }
  }

  AddSeniorityClose() {
    this.AddSenioritydrawer = false;
    this.search();
  }

  get closeCallAddSeniority() {
    return this.AddSeniorityClose.bind(this);
  }

  Continuestatusdraft(data) {
    if (data.TEMP_STEP_NO == 0 || data.TEMP_STEP_NO == null) {
      this.currentstage = 0;
    } else {
      this.currentstage = 1;
    }
    this.isdraft = 'draft';
    var month = '';
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
    this.AddSeniorityTitle =
      'Draft Seniority Order For Residence ' +
      data.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      data.YEAR;

    this.tempdataid = data.ID;
    this.AddSenioritydrawer = true;
    this.Senioritydataobj = Object.assign({}, data);
  }
  Continuestatusfinal(data) {
    if (data.TEMP_STEP_NO != 3 && data.TEMP_STEP_NO != 0) {
      this.currentstage = 1;
    }
    this.isdraft = 'final';
    this.tempdataid = data.ID;
    var month = '';
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
    this.AddSeniorityTitle =
      'Final Seniority Order For Residence ' +
      data.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      data.YEAR;

    this.AddSenioritydrawer = true;
    this.Senioritydataobj = Object.assign({}, data);
  }
  Continuestatus1(data, time, time1) {
    if (time1 > 0 || time1 != '') {
      this.message.info('Objection start time is not over', '');
    }
    // else if (time > 0 || time != '') {
    //   this.message.info('Please wait until the objection period is over.', '');
    // }
    else if (data['OBJECTION']['PENDING'] > 0) {
      this.message.info('Please check pending objection', '');
    } else {
      if (data.TEMP_STEP_NO == 3) {
        this.currentstage = 0;
      }
      this.tempdataid = data.ID;
      this.isdraft = 'final';
      var month = '';
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
      this.AddSeniorityTitle =
        'Final Seniority Order For Residence ' +
        data.RESIDENCE_TYPE_NAME +
        ' ' +
        month +
        ' ' +
        data.YEAR;

      this.AddSenioritydrawer = true;
      this.Senioritydataobj = Object.assign({}, data);
    }
  }

  ObjectiondrawerClose() {
    this.search();
    this.Objectionsdrawervisible = false;
  }

  get closeCallObjectionsdrawer() {
    return this.ObjectiondrawerClose.bind(this);
  }

  objectionshow(data: any, filterstring: string) {
    var month = '';
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
    this.Objectiondrawertitle =
      "Objection's on Draft Seniority Order For Residence " +
      data.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      data.YEAR;

    if (data.DRAFT_WAITING_MASTER_ID == null) {
      this.message.info('Objection time is not started yet', '');
    } else {
      if (filterstring == 'ALL') {
        var filter =
          ' AND DRAFT_WAITING_MASTER_ID = ' + data.DRAFT_WAITING_MASTER_ID;
      } else {
        var filter =
          " AND ACTION_STATUS = '" +
          filterstring +
          "'" +
          ' AND DRAFT_WAITING_MASTER_ID = ' +
          data.DRAFT_WAITING_MASTER_ID;
      }
      this.isSpinningTrue = true;
      this.api
        .getObjectionMasterWithCount(
          0,
          0,
          '',
          '',
          filter,
          data.DRAFT_WAITING_MASTER_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.isSpinningTrue = false;
              this.Objectionsdrawervisible = true;
            } else if (data['code'] == 300) {
              // this.isSpinningTrue = false;
              // this.message.info(
              //   'Please wait until the objection period is over.',
              //   ''
              // );
              this.isSpinningTrue = false;
              this.Objectionsdrawervisible = true;
            } else {
              this.isSpinningTrue = false;
            }
          },
          (err) => {
            this.isSpinningTrue = false;
          }
        );
    }
    this.Objectionsdrawerdata = Object.assign({}, data);
    this.StringObjectionfilter = filterstring;
  }

  AddnewList() {
    this.modaldata = new newSeniorityist();
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth());

    const nextMonthString = nextMonth.toISOString().split('T')[0].slice(0, 7);
    this.modaldata.MONTH = nextMonth;
    const currentYear = new Date().getFullYear();
    this.modaldata.YEAR = new Date(today.getFullYear(), today.getMonth());
    this.getResidenceType();
    this.isVisible = true;
  }
  disabledDate2 = (current: Date): boolean => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth());
    const nextMonthString = nextMonth.toISOString().split('T')[0].slice(0, 7);

    return current <= nextMonth;
  };

  disabledDate1 = (current: Date): boolean => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth());
    const nextMonthString = nextMonth.toISOString().split('T')[0].slice(0, 7);

    return current <= nextMonth;
  };

  openFinalList(data) {
    if (data.FINAL_PUBLISHER_ID == 0) {
      window.open(
        this.api.retriveimgUrl + 'draftWaitingList/' + data.FINAL_FILE_URL
      );
    } else {
      window.open(this.api.retriveimgUrl + 'finalList/' + data.FINAL_FILE_URL);
    }
  }
  showmobfile1(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'draftWaitingList/' + pdfURL;
    window.open(fileUrl);
  }

  viewVacantFlatsList(data: any) {
    var month = '';
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
    this.VacantFlatsdrawertitle =
      'Vacancy Notice For Residence ' +
      data.RESIDENCE_TYPE_NAME +
      '' +
      month +
      ' ' +
      data.YEAR;
    this.VacantFlatsdrawerdata = Object.assign({}, data);
    this.viewVacantFlatsVisible = true;
  }

  VacantFlatsdrawerClose() {
    this.search();
    this.viewVacantFlatsVisible = false;
  }

  get closeCallVacantFlatssdrawer() {
    return this.VacantFlatsdrawerClose.bind(this);
  }

  viewPreference(datass: any): void {
    var month = '';
    switch (datass.MONTH) {
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
    this.drafttitleaforallotment =
      'Draft Allotment Order For Residence ' +
      datass.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      datass.YEAR;
    this.isSpinning = true;
    this.api
      .getAllPreferanceList111(
        1,
        1,
        '',
        'desc',
        ' AND ID=' + datass.PREFERENCE_MASTER_ID
      )
      .subscribe(
        (datacode) => {
          if (datacode['code'] == 200) {
            this.drawerDataForPreference = Object.assign(
              {},
              datacode['data'][0]
            );
            this.flatPreferancepageIndex = 1;
            this.flatPreferancepageSize = 10;
            this.api
              .getAllDraftAllotment(
                1,
                20,
                '',
                '',
                " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " +
                  datass.PREFERENCE_MASTER_ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.isPrevious = true;
                    } else {
                      this.isPrevious = false;
                    }

                    this.api
                      .getFlatAllotmentList(
                        0,
                        0,
                        'SENIORITY_SEQ_NO',
                        'desc',
                        ' AND PREFERENCES_MASTER_ID = ' +
                          datass.PREFERENCE_MASTER_ID
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            this.employeefilterid = data['data'];
                            localStorage.setItem(
                              'employeefilterid',
                              JSON.stringify(this.employeefilterid)
                            );
                          } else {
                            this.message.error('Data Not Load', '');
                          }
                        },
                        (err) => {}
                      );
                    this.loadingRecords = false;
                    this.drawerVisibleForPreference = true;
                    this.VacantFlatScenarityId = datass.ID;
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
            this.loadingRecords = false;
            this.isSpinning = false;
            this.message.error(
              'Something Went Wrong, Please Try Again Later',
              ''
            );
          }
        },
        (err) => {
          this.isSpinning = true;
          this.loadingRecords = false;
        }
      );
  }

  drawerCloseForPreference() {
    this.search();
    this.drawerVisibleForPreference = false;
  }

  get closeCallbackForPreference() {
    return this.drawerCloseForPreference.bind(this);
  }

  viewDraftAllotment(PREFERENCE_MASTER_IDs: any) {
    this.api
      .getAllPreferanceList111(
        1,
        1,
        '',
        'desc',
        ' AND ID=' + PREFERENCE_MASTER_IDs
      )
      .subscribe((datacode) => {
        if (datacode['code'] == 200) {
          const fileUrl =
            this.api.retriveimgUrl +
            'draftAllotmentList/' +
            datacode['data'][0]['FILE_URL'];
          window.open(fileUrl);
        }
      });
  }

  ContinueSteps(show: any) {
    var month = '';
    switch (show.MONTH) {
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
    this.finalallotmenttitle =
      'Final Allotment Order For Residence ' +
      show.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      show.YEAR;
    this.employeefilteridForfinal = [];

    if (show['ALLOTMENT']['PENDING'] > 0) {
      this.message.info('Some objections are still pending.', '');
    } else {
      this.api
        .getDraftAllotmentListgenerate(
          1,
          1,
          '',
          'desc',
          ' AND MONTH=' +
            show.MONTH +
            ' AND YEAR=' +
            show.YEAR +
            ' AND RESIDENCE_TYPE_ID IN (' +
            show.RESIDENCE_TYPE_ID +
            ')' +
            ' AND PREFERENCES_MASTER_ID=' +
            show.PREFERENCE_MASTER_ID
        )
        .subscribe(
          (datafinal) => {
            if (datafinal.code == 200) {
              this.DrawerVisibleTitle = 'Allotment Order';
              this.DrawerVisibleData = Object.assign({}, datafinal['data'][0]);
              this.scenioritycardId = show;

              this.api
                .getFlatAllotmentList(
                  0,
                  0,
                  'SENIORITY_SEQ_NO',
                  'desc',
                  ' AND PREFERENCES_MASTER_ID = ' + show.PREFERENCE_MASTER_ID
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.DrawerVisiblechek = true;
                      this.employeefilteridForfinal = data['data'];
                      localStorage.setItem(
                        'employeefilterid',
                        JSON.stringify(this.employeefilteridForfinal)
                      );
                    } else {
                      this.message.error('Data Not Load', '');
                    }
                  },
                  (err) => {}
                );
            } else {
              this.message.error('Failed To get Data.', '');
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            }
          },
          (err) => {
            this.message.error('Failed To get Data.', '');
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          }
        );
    }
  }

  DrawerVisibleClose() {
    this.search();
    this.DrawerVisiblechek = false;
  }

  get closeCallDrawerVisible() {
    return this.DrawerVisibleClose.bind(this);
  }

  viewFinalFile(PREFERENCE_MASTER_IDs: any) {
    this.api
      .getFinalAllotmentDatalist11(
        1,
        1,
        '',
        'desc',
        ' AND DRAFT_ALLOTMENT_MASTER_ID=' + PREFERENCE_MASTER_IDs
      )
      .subscribe((datacode) => {
        if (datacode['code'] == 200) {
          const fileUrl =
            this.api.retriveimgUrl +
            'finalAllotmentList/' +
            datacode['data'][0]['FILE_URL'];
          window.open(fileUrl);
        }
      });
  }

  OpenVacantNotice(PREFERENCE_MASTER_IDs: any) {
    this.api
      .getFlatOrder(
        1,
        1,
        '',
        'desc',
        ' AND MONTH=' +
          PREFERENCE_MASTER_IDs.MONTH +
          ' AND YEAR=' +
          PREFERENCE_MASTER_IDs.YEAR +
          ' AND RESIDENCE_TYPE IN (' +
          PREFERENCE_MASTER_IDs.RESIDENCE_TYPE_ID +
          ')'
      )
      .subscribe((datacode) => {
        if (datacode['code'] == 200) {
          const fileUrl =
            this.api.retriveimgUrl +
            'flatVacantOrder/' +
            datacode['data'][0]['FILE_URL'];
          window.open(fileUrl);
        }
      });
  }
  OpenVacantOrder(PREFERENCE_MASTER_IDs: any) {
    this.api
      .getFlatOrder(
        1,
        1,
        '',
        'desc',
        ' AND MONTH=' +
          PREFERENCE_MASTER_IDs.MONTH +
          ' AND YEAR=' +
          PREFERENCE_MASTER_IDs.YEAR +
          ' AND RESIDENCE_TYPE IN (' +
          PREFERENCE_MASTER_IDs.RESIDENCE_TYPE_ID +
          ')'
      )
      .subscribe((datacode) => {
        if (datacode['code'] == 200) {
          const fileUrl =
            this.api.retriveimgUrl +
            'flatOrders/' +
            datacode['data'][0]['ORDER_FILE_URL'];
          window.open(fileUrl);
        }
      });
  }

  ObjectiondrawerCloseAllot() {
    this.search();
    this.ObjectionsdrawervisibleAllot = false;
  }

  get closeCallObjectionsdrawerAllot() {
    return this.ObjectiondrawerCloseAllot.bind(this);
  }

  objectionshowForAllotement(data: any, filterstring: string, nn) {
    if (
      data.ALL_START_DATETIME != null &&
      data.ALL_START_DATETIME != undefined &&
      data.ALL_START_DATETIME != '' &&
      data.ALL_END_DATETIME != null &&
      data.ALL_END_DATETIME != undefined &&
      data.ALL_END_DATETIME != '' &&
      this.TimmerendloopForFinal[nn] <= 0
    ) {
      this.isSpinningTrue = true;
      this.api
        .getDraftAllotmentListgenerate(
          1,
          1,
          '',
          'desc',
          ' AND MONTH=' +
            data.MONTH +
            ' AND YEAR=' +
            data.YEAR +
            ' AND RESIDENCE_TYPE_ID IN (' +
            data.RESIDENCE_TYPE_ID +
            ')' +
            ' AND PREFERENCES_MASTER_ID=' +
            data.PREFERENCE_MASTER_ID
        )
        .subscribe(
          (datafinal) => {
            if (datafinal.code == 200) {
              this.isSpinningTrue = false;
              this.ObjectionsdrawervisibleAllot = true;
              var month = '';
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
              this.ObjectiondrawertitleAllot =
                "Objection's on Draft Allotment Order For Residence " +
                data.RESIDENCE_TYPE_NAME +
                ' ' +
                month +
                ' ' +
                data.YEAR;
              this.ObjectionsdrawerdataAllot = Object.assign(
                {},
                datafinal['data'][0]
              );
              this.StringObjectionfilterAllot = filterstring;
            } else {
              this.isSpinningTrue = false;
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
            }
          },
          (err) => {
            this.isSpinningTrue = false;
          }
        );
    } else if (
      data.ALL_START_DATETIME != null &&
      data.ALL_START_DATETIME != undefined &&
      data.ALL_START_DATETIME != '' &&
      data.ALL_END_DATETIME != null &&
      data.ALL_END_DATETIME != undefined &&
      data.ALL_END_DATETIME != '' &&
      (this.TimmerendloopForFinal[nn] > 0 ||
        this.TimmerendloopForFinal[nn] != '')
    ) {
      // this.message.info('Objection end time is not over yet.', '');
      this.isSpinningTrue = true;
      this.api
        .getDraftAllotmentListgenerate(
          1,
          1,
          '',
          'desc',
          ' AND MONTH=' +
            data.MONTH +
            ' AND YEAR=' +
            data.YEAR +
            ' AND RESIDENCE_TYPE_ID IN (' +
            data.RESIDENCE_TYPE_ID +
            ')' +
            ' AND PREFERENCES_MASTER_ID=' +
            data.PREFERENCE_MASTER_ID
        )
        .subscribe(
          (datafinal) => {
            if (datafinal.code == 200) {
              this.isSpinningTrue = false;
              this.ObjectionsdrawervisibleAllot = true;
              var month = '';
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
              this.ObjectiondrawertitleAllot =
                "Objection's on Draft Allotment Order For Residence " +
                data.RESIDENCE_TYPE_NAME +
                ' ' +
                month +
                ' ' +
                data.YEAR;
              this.ObjectionsdrawerdataAllot = Object.assign(
                {},
                datafinal['data'][0]
              );
              this.StringObjectionfilterAllot = filterstring;
            } else {
              this.isSpinningTrue = false;
              this.message.error(
                'Something went wrong, please try again later',
                ''
              );
            }
          },
          (err) => {
            this.isSpinningTrue = false;
          }
        );
    } else {
      this.message.info('Objection time is not started yet', '');
    }
  }

  updown(index: number) {
    this.uptrue[index] = true;
  }
  updown1(index: number) {
    this.uptrue[index] = false;
  }
  searchdata: any;
  searchdataMAIN: any;

  Openmis(data: any, filterrrrr: any) {
    this.searchdata = filterrrrr;
    this.searchdataMAIN = filterrrrr;
    this.misdata = data;
    var month = '';
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
    this.isSpinningTrue = true;
    this.mistitle =
      'MIS Process For Residence ' +
      data.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      data.YEAR;
    this.api
      .getFinalAllotmentDatalist11(
        0,
        0,
        '',
        'desc',
        ' AND DRAFT_ALLOTMENT_MASTER_ID=' + this.misdata.DRAFT_ALLOTMENT_ID
      )
      .subscribe(
        (datas) => {
          if (datas['code'] == 200) {
            this.isSpinningTrue = false;
            this.loadingRecords = false;
            this.isSpinning = false;
            this.openmissshow = true;
            this.mislistdata = datas['data'][0];
          } else {
            this.isSpinningTrue = false;
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinningTrue = false;
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
  }

  closemisdrawer() {
    this.search();
    this.openmissshow = false;
  }

  get closeCallmisdrawer() {
    return this.closemisdrawer.bind(this);
  }

  fetchCurrentTime(): void {
    this.api.getCurrentTime().subscribe(
      (data) => {
        this.currentTime = new Date(data.datetime);
        this.currentTimeobjstart = new Date(data.datetime);
        this.currentTimeobjend = new Date(data.datetime);
        this.currentTimeprepstart = new Date(data.datetime);
        this.currentTimeallend = new Date(data.datetime);
      },
      (error) => {
        console.error('Error fetching time:', error);
      }
    );
  }

  Appdrawervisible: boolean = false;
  Appdrawertitle = '';
  Appdrawerdata: any;
  StringAppfilter: any;
  AplicationdrawerClose() {
    this.search();
    this.Appdrawervisible = false;
  }

  get closeCallApplicationdrawer() {
    return this.AplicationdrawerClose.bind(this);
  }

  MonthApp: any;
  RecApp: any;
  yearApp: any;
  appClickData(data: any, filterstring: string) {
    var month = '';
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
    this.Appdrawertitle =
      'Quarter Applications Of Residence ' +
      data.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      data.YEAR;
    this.RecApp = data.RESIDENCE_TYPE_ID;
    this.MonthApp = data.MONTH;
    this.yearApp = data.YEAR;
    this.Appdrawervisible = true;
    this.Appdrawerdata = Object.assign({}, data);
    this.StringAppfilter = filterstring;
  }

  Flatdrawervisible: boolean = false;
  Flatdrawertitle = '';
  Flatdrawerdata: any;
  StringFlatfilter: any;
  FlatdrawerClose() {
    this.search();
    this.Flatdrawervisible = false;
  }

  get closeCallFlatdrawer() {
    return this.FlatdrawerClose.bind(this);
  }

  MonthFlat: any;
  RecFlat: any;
  yearFlat: any;
  FlatClickData(data: any, filterstring: string) {
    var month = '';
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
    this.Flatdrawertitle =
      'Quarters Summary Of Residence ' +
      data.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      data.YEAR;
    this.RecFlat = data.RESIDENCE_TYPE_ID;
    this.MonthFlat = data.MONTH;
    this.yearFlat = data.YEAR;
    this.Flatdrawervisible = true;
    this.Flatdrawerdata = Object.assign({}, data);
    this.StringFlatfilter = filterstring;
  }
}
