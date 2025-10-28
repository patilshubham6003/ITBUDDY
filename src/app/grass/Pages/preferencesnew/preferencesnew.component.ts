import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from '../../Services/APIService.service';
import { seniorityUpdate } from '../../Models/seniorityUpdate';
import { prefdata } from '../../Models/perfdata';
import { endOfMonth, startOfMonth, subYears } from 'date-fns';

@Component({
  selector: 'app-preferencesnew',
  templateUrl: './preferencesnew.component.html',
  styleUrls: ['./preferencesnew.component.css'],
  providers: [DatePipe],
})
export class PreferencesnewComponent {
  drawerVisible: boolean = false;
  drawerTitle: string;
  isRecordLoading: boolean = false;
  i: number = 0;

  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) { }

  size = '100%';
  employeeID: any;
  Allotmentdata: any = [];
  Allotmentchecklistdata: any = [];
  ResidenceTypereq: any = [];
  Waitinglist: any = [];
  preferencesListView: any = [];

  empID = sessionStorage.getItem('userId');

  date: any = new seniorityUpdate();
  count: any;
  countdowndisable: any;
  Timmerendloop: any = [];
  Timmerstartloop: any = [];
  ngOnInit() {
    this.api.getemployeeresidencetype(0, 0, '', 'asc', '').subscribe(
      (data) => {
        if (data['code'] == '200') {
          this.ResidenceTypelist = data['data'];
        }
      },
      (error) => {
        console.error(error, 'Employee Residence Type');
      }
    );
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    this.selectFromMonth[0] = lastYearSameMonth;
    this.selectFromMonth[1] = endOfCurrentMonth;

    this.search();
  }
  getcount(data: any, i: any) {
    if (data['EMP_DATA'] != '') {
      if (
        data['EMP_DATA'] != undefined &&
        data['EMP_DATA'][0]['STEP_NO'] != undefined &&
        data['EMP_DATA'][0]['STEP_NO'] != ''
      ) {
        var stepno: any = data['EMP_DATA'][0]['STEP_NO'];
      }
    }
    if (data.PREFERENCE_STEP_NO == 2) {
      return 3;
    } else if (stepno != undefined && stepno != '') {
      return stepno;
    } else {
      return 0;
    }
  }
  preference: any;
  getPreference(): void {
    this.api
      .getAllotmenmaster(
        0,
        0,
        'ID',
        'desc',
        ' AND EMPLOYEE_ID=' + this.employeeID
      )
      .subscribe(
        (data) => {
          if (data['data'].length > 0) {
            this.preference = data['data'][0];
          }
        },
        (err) => { }
      );
  }

  preferencedata: any;

  showw(i: any) {
    //
    //
    if (
      this.Timmerstartloop[i] == 0 &&
      (this.Timmerendloop[i] != 0 || this.Timmerendloop[i] != '')
    ) {
      //
      return false;
    } else if (this.Timmerstartloop[i] == 0 && this.Timmerendloop[i] == 0) {
      //
      return true;
    } else {
      return true;
    }
  }

  flat: any;
  empdata: any;
  datamap: any;
  perfdata: any;
  dataListFlat: any = [];
  dataList: any;
  dataListFinal: any;
  flatIdsArray: any = [];
  prdata: any = [];
  filterforprep: any = '';
  openadd(data: any) {
    this.isRecordLoading = true;
    // this.drawerVisible = true;
    this.drawerTitle = 'Add Quarter Referance';
    this.datamap = Object.assign({}, data);
    this.api
      .getperdata(
        0,
        0,
        '',
        'desc',
        ' AND PREFERENCES_MASTER_ID=' +
        data.ID +
        ' AND EMP_ID=' +
        Number(sessionStorage.getItem('userId'))
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            // this.isRecordLoading = false;
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
                    }
                    this.api
                      .getpredranceflatdata(
                        0,
                        0,
                        'SEQUENCE_NO',
                        'desc',
                        " AND STATUS=1 AND AVAILABLE_STATUS='A' AND IS_PUBLISHED=1 " +
                        ' AND RESIDENCE_TYPE_ID = ' +
                        this.datamap.RESIDENCE_TYPE_ID + this.filterforprep
                      )
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200) {
                            // this.isRecordLoading = false;
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

                                    this.drawerVisible = true;
                                    this.isRecordLoading = false;
                                  }
                                },
                                (err) => { }
                              );
                          }
                        },
                        (err) => { }
                      );
                  }
                },
                (err) => { }
              );
          }
        },
        (err) => { }
      );
  }
  getdate(MONTH: any) {
    if (MONTH == '1') {
      return 'Jan';
    } else if (MONTH == '2') {
      return 'Feb';
    } else if (MONTH == '3') {
      return 'Mar';
    } else if (MONTH == '4') {
      return 'Apr';
    } else if (MONTH == '5') {
      return 'May';
    } else if (MONTH == '6') {
      return 'Jun';
    } else if (MONTH == '7') {
      return 'July';
    } else if (MONTH == '8') {
      return 'Aug';
    } else if (MONTH == '9') {
      return 'Sep';
    } else if (MONTH == '10') {
      return 'Oct';
    } else if (MONTH == '11') {
      return 'Nov';
    } else if (MONTH == '12') {
      return 'Dec';
    } else {
      return 'None';
    }
  }

  drawerClose(): void {
    this.drawerVisible = false;
    this.closedata();
    this.search();
  }

  closedata11() {
    this.isRecordLoading = true;
    this.api
      .getflatperf(
        0,
        0,
        '',
        'desc',
        ' AND MONTH=' +
        Number(Number(new Date().getMonth()) + 1) +
        ' AND YEAR=' +
        new Date().getFullYear(),
        Number(Number(new Date().getMonth()) + 1),
        new Date().getFullYear()
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            this.isRecordLoading = false;
            this.preferencesListView = []
            for (let i = 0; i < data['data'].length; i++) {
              if (data.data[i].SENIORITY_LIST_COUNT != 0) {
                this.preferencesListView.push(data['data'][i]);
              }

            }
            // this.preferencesListView = data['data'];
            // for (let i = 0; i < this.preferencesListView.length; i++) {
            //   this.preferencesListView[i]['EMP_DATA'] = JSON.parse(
            //     this.preferencesListView[i]['EMP_DATA']
            //   );

            // }

            this.Timmerstartloop.length = this.preferencesListView.length;
            this.Timmerendloop.length = this.preferencesListView.length;

            let timeremaining: any = [];
            let timeremaining2: any = [];
            timeremaining.length = this.preferencesListView.length;
            timeremaining2.length = this.preferencesListView.length;
            // starttimmer
            for (let ab = 0; ab < this.preferencesListView.length; ab++) {
              // let sapandate = this.preferencesListView[ab]['OBJ_END_TIME_PERIOD'];
              let startdate =
                this.preferencesListView[ab]['PREFERENCE_START_DATE_TIME'];
              let targetDate = new Date(startdate); // Your datetime value should be assigned here

              let countdownInterval = setInterval(() => {
                const currentDate = new Date();
                timeremaining[ab] =
                  targetDate.getTime() - currentDate.getTime();
                //

                const seconds = Math.floor(timeremaining[ab] / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
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
                  clearInterval(countdownInterval);
                  this.i = 2;
                  this.Timmerstartloop[ab] = 0;
                  //
                  timeremaining[ab] = 0;
                }
              }, 1000);
            }
            // endtimmer
            for (let cc = 0; cc < this.preferencesListView.length; cc++) {
              let sapandate =
                this.preferencesListView[cc]['PREFERENCE_END_DATE_TIME'];
              let targetDate = new Date(sapandate); // Your datetime value should be assigned here
              // let startdate = this.preferencesListView[cc]['OBJ_START_DATE_TIME'];
              // const startdatet = new Date(startdate);

              let countdownInterval1 = setInterval(() => {
                const currentDate = new Date();
                timeremaining2[cc] =
                  targetDate.getTime() - currentDate.getTime();
                //

                const seconds = Math.floor(timeremaining2[cc] / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
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
                  clearInterval(countdownInterval1);
                  this.i = 2;
                  this.Timmerendloop[cc] = 0;

                  timeremaining2[cc] = 0;
                }
              }, 1000);
            }
          }
        },
        (err) => { }
      );
  }

  closedata() {
    this.search();
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  // dateFormat = "yyyy/MMM/dd"
  currentDate: any = new Date();
  // date = this.this.this.datepipe.transform(this.currentDate, 'yyyy-MM-dd')
  FlatprefListPDF = '';
  modalFile: any;
  pageIndex = 10;
  pageSize = 10;
  sortKey: string = 'SEQUENCE_NO';
  totalRecords = 1;
  allot: any;
  stage = 0;
  sanitizedLink: any = '';
  perform: any;
  viewModal(data: any) {
    this.api
      .getperdata(
        0,
        0,
        '',
        'desc',
        ' AND PREFERENCES_MASTER_ID=' +
        data.ID +
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
  allotment: any;
  openlist(data) {
    this.api
      .viewprefdata(0, 0, '', 'desc', ' AND PREFERENCES_MASTER_ID=' + data.ID)
      .subscribe(
        (data: any) => {
          if (data['code'] == 200) {
            this.allotment = data['data'][0];

            if (
              this.allotment.FILE_URL != null &&
              this.allotment.FILE_URL != undefined &&
              this.allotment.FILE_URL != ''
            ) {
              const fileUrl =
                this.api.retriveimgUrl +
                'draftAllotmentList/' +
                this.allotment.FILE_URL;
              window.open(fileUrl);
            }
          }
        },
        (err) => { }
      );
  }

  RESIDENCE_TYPE_ID: any = [];
  joinedResidencetype: any;
  ResidenceTypelist: any = [];
  datenew: any = new Date();
  selectFromMonth: any = [];
  selectToMonth: any = new Date(
    this.datenew.getFullYear(),
    this.datenew.getMonth()
  );
  selectyear: any = new Date();
  isFilterApplied: any = 'default';
  // isSpinning = false;
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  filterClass: string = 'filter-invisible';
  Filterquery = '';
  changetostring($event) {
    this.joinedResidencetype = '';
    this.joinedResidencetype = this.RESIDENCE_TYPE_ID.join(',');
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    // if (this.RESIDENCE_TYPE_ID.length == 0) {
    //   this.message.error('Please Select Residence Type', '');
    // }
    if (
      this.selectFromMonth == null ||
      this.selectFromMonth == undefined ||
      this.selectFromMonth == ''
    ) {
      this.message.error('Please Select From Month', '');
    } else {
      // this.selectFromMonth[0] = new Date(satedatenew.getFullYear(),satedatenew.getMonth(),1);
      // this.selectFromMonth[1] = new Date(satedatenew.getFullYear(),satedatenew.getMonth()+1, 0);

      this.isFilterApplied = 'primary';
      this.search();
    }
  }
  // datenew: any = new Date();
  clearFilter() {
    this.RESIDENCE_TYPE_ID = [];
    // this.MONTH1 = '';
    // this.MONTH2 = '';
    // this.YEAR1 = '';
    this.datenew = new Date();
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    this.selectFromMonth[0] = lastYearSameMonth;
    this.selectFromMonth[1] = endOfCurrentMonth;
    this.selectFromMonth = [this.selectFromMonth[0], this.selectFromMonth[1]]

    // this.selectToMonth = new Date(
    //   this.datenew.getFullYear(),
    //   this.datenew.getMonth()
    // );
    // this.selectyear = new Date();
    this.search();
    this.isFilterApplied = 'default';
  }
  isSpinning = false;
  search() {
    // this.MONTH1 = this.this.this.datepipe.transform(this.selectFromMonth, 'MM');
    // this.MONTH2 = this.this.this.datepipe.transform(this.selectToMonth, 'MM');
    // this.YEAR1 = this.this.this.datepipe.transform(this.selectyear, 'yyyy');

    if (
      this.selectFromMonth != null &&
      this.selectFromMonth != undefined &&
      this.selectFromMonth != '' &&
      this.RESIDENCE_TYPE_ID != undefined &&
      this.RESIDENCE_TYPE_ID != null &&
      this.RESIDENCE_TYPE_ID != ''
    ) {
      // var dateFilter = '';
      //

      // // if (this.selectFromMonth.length > 0) {
      //   var startdate: any = new Date(this.MONTH1);
      //   var endDate: any = new Date(this.MONTH2);
      //
      //   // if (startdate <= endDate) {
      // var  i=1;
      //   var monthsBetween: any = [];
      //   while (startdate <= endDate) {
      //     const monthNumber = startdate.getMonth()+1; // Add 1 to get the month number (1 to 12)
      //     monthsBetween.push(monthNumber.toString());
      //     startdate.setMonth((startdate.getMonth()+1)+1);
      //     i++;

      //   }
      //   dateFilter = ' AND MONTH in (' + monthsBetween + ')';
      //

      // }
      if (
        this.joinedResidencetype != null &&
        this.joinedResidencetype != undefined &&
        this.joinedResidencetype != ''
      ) {
        this.Filterquery = '' + this.joinedResidencetype + '';
      } else {
        this.Filterquery = '';
      }
      // this.Filterquery =
      //   ' AND YEAR = ' +
      //   this.YEAR1 +
      //   ' AND RESIDENCE_TYPE_ID IN (' +
      //   this.joinedResidencetype +
      //   ')';
      // this.Filterquery = " AND MONTH BETWEEN " + this.MONTH1 + " AND " + this.MONTH2 + " AND YEAR = " + this.YEAR1 + " AND RESIDENCE_TYPE_ID IN (" + this.joinedResidencetype + ")"
      this.isRecordLoading = true;
      this.isSpinning = true;
      this.api
        .getflatperf(
          0,
          0,
          '',
          'desc',
          this.Filterquery,
          (this.selectFromMonth[0] = this.datepipe.transform(
            this.selectFromMonth[0],
            'yyyy-MM-dd'
          )),
          (this.selectFromMonth[1] = this.datepipe.transform(
            this.selectFromMonth[1],
            'yyyy-MM-dd'
          ))
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.isRecordLoading = false;
              this.preferencesListView = data['data']

              // for (let i = 0; i < data['data'].length; i++) {
              //   // if (data.data[i].SENIORITY_LIST_COUNT != 0) {
              //     this.preferencesListView.push(data['data'][i]);
              //   // }

              // }
              this.filterClass = 'filter-invisible';
              this.isSpinning = false;
              // for (let i = 0; i < this.preferencesListView.length; i++) {
              //   this.preferencesListView[i]['EMP_DATA'] = JSON.parse(
              //     this.preferencesListView[i]['EMP_DATA']
              //   );

              // }

              this.Timmerstartloop.length = this.preferencesListView.length;
              this.Timmerendloop.length = this.preferencesListView.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.preferencesListView.length;
              timeremaining2.length = this.preferencesListView.length;
              // starttimmer
              for (let ab = 0; ab < this.preferencesListView.length; ab++) {
                // let sapandate = this.preferencesListView[ab]['OBJ_END_TIME_PERIOD'];
                let startdate =
                  this.preferencesListView[ab]['PREFERENCE_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();
                  //

                  const seconds = Math.floor(timeremaining[ab] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
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
                    clearInterval(countdownInterval);
                    this.i = 2;
                    this.Timmerstartloop[ab] = 0;

                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
              // endtimmer
              for (let cc = 0; cc < this.preferencesListView.length; cc++) {
                let sapandate =
                  this.preferencesListView[cc]['PREFERENCE_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                // let startdate = this.preferencesListView[cc]['OBJ_START_DATE_TIME'];
                // const startdatet = new Date(startdate);

                let countdownInterval1 = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining2[cc] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining2[cc] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
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
                    clearInterval(countdownInterval1);
                    this.i = 2;
                    this.Timmerendloop[cc] = 0;

                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
          },
          (err) => { }
        );
    } else {
      if (
        this.joinedResidencetype != null &&
        this.joinedResidencetype != undefined &&
        this.joinedResidencetype != ''
      ) {
        this.Filterquery = '' + this.joinedResidencetype + '';
      } else {
        this.Filterquery = '';
      }
      // this.Filterquery =
      //   ' AND MONTH BETWEEN ' +
      //   this.MONTH1 +
      //   ' AND ' +
      //   this.MONTH2 +
      //   ' AND YEAR  = ' +
      //   this.YEAR1;
      this.isRecordLoading = true;
      this.isSpinning = true;
      this.api
        .getflatperf(
          0,
          0,
          '',
          'desc',
          this.Filterquery,
          (this.selectFromMonth[0] = this.datepipe.transform(
            this.selectFromMonth[0],
            'yyyy-MM-dd'
          )),
          (this.selectFromMonth[1] = this.datepipe.transform(
            this.selectFromMonth[1],
            'yyyy-MM-dd'
          ))
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.isRecordLoading = false;
              this.preferencesListView = data['data']
              // for (let i = 0; i < data['data'].length; i++) {
              //   if (data.data[i].SENIORITY_LIST_COUNT != 0) {
              //     this.preferencesListView.push(data['data'][i]);
              //   }

              // }
              this.filterClass = 'filter-invisible';
              this.isSpinning = false;
              // for (let i = 0; i < this.preferencesListView.length; i++) {
              //   this.preferencesListView[i]['EMP_DATA'] = JSON.parse(
              //     this.preferencesListView[i]['EMP_DATA']
              //   );

              // }

              this.Timmerstartloop.length = this.preferencesListView.length;
              this.Timmerendloop.length = this.preferencesListView.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.preferencesListView.length;
              timeremaining2.length = this.preferencesListView.length;
              // starttimmer
              for (let ab = 0; ab < this.preferencesListView.length; ab++) {
                // let sapandate = this.preferencesListView[ab]['OBJ_END_TIME_PERIOD'];
                let startdate =
                  this.preferencesListView[ab]['PREFERENCE_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();
                  //

                  const seconds = Math.floor(timeremaining[ab] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
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
                    clearInterval(countdownInterval);
                    this.i = 2;
                    this.Timmerstartloop[ab] = 0;
                    //
                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
              // endtimmer
              for (let cc = 0; cc < this.preferencesListView.length; cc++) {
                let sapandate =
                  this.preferencesListView[cc]['PREFERENCE_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                // let startdate = this.preferencesListView[cc]['OBJ_START_DATE_TIME'];
                // const startdatet = new Date(startdate);

                let countdownInterval1 = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining2[cc] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining2[cc] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
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
                    clearInterval(countdownInterval1);
                    this.i = 2;
                    this.Timmerendloop[cc] = 0;

                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
          },
          (err) => { }
        );
    }
  }

  clearFilterresidencetype() {
    this.RESIDENCE_TYPE_ID = null;
    this.applyFilter();
  }

  frommonth = false;
  clearFilterfrommonth() {
    this.datenew = new Date();
    // this.selectFromMonth =
    var satedatenew = new Date();
    this.selectFromMonth[0] = new Date(
      satedatenew.getFullYear(),
      satedatenew.getMonth(),
      1
    );
    this.selectFromMonth[1] = new Date(
      satedatenew.getFullYear(),
      satedatenew.getMonth() + 1,
      0
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

  tomonth = false;
  clearFiltertomonth() {
    let tmonth = new Date();
    this.selectToMonth = new Date(tmonth.getFullYear(), tmonth.getMonth());
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

  yearfilter = false;
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

  onChangemonth(result: any): void {
    // let fromdate :any = new Date(result[0].getFullYear(),result[0].getMonth(),1);
    // let Todate :any = new Date(result[1].getFullYear(), result[1].getMonth()+1, 0);
    //
    //
    this.selectFromMonth[0] = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    this.selectFromMonth[1] = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );
  }
}
