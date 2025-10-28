import { Component, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { senioritypass } from 'src/app/grass/Models/SeniorityDatapass';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-flatpreflisttable',
  templateUrl: './flatpreflisttable.component.html',
  styleUrls: ['./flatpreflisttable.component.css'],
  providers: [DatePipe],
})
export class FlatpreflisttableComponent {
  current = 1;
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: senioritypass = new senioritypass();
  formTitle = 'Quarter Preference Order Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  isSpinning = false;
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['TYPE', 'Type'],
    ['PAY_BILL_SECTION', 'Pay Bill'],
  ];
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) { }

  Monthrange: any = [];
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

  startdatenow = new Date();
  ngOnInit(): void {
    this.Monthrange[0] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth() + 1,
      0
    );
    this.getResidenceTypes();
  }

  getResidenceTypes() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1 ').subscribe(
      (data) => {
        if (data.code == 200) {
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
          }
          this.applyFilter();
        } else {
          this.message.error('Failed To get Residence Type', '');
        }
      },
      (err) => {
        //
        this.message.error('Failed To get Residence Type', '');
      }
    );
  }

  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  // keyup(event: any) {
  //   this.search();
  // }

  Timmerstartloop: any = [];
  countdowndisable = true;
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.RESIDENCE_TYPE_ID != undefined &&
      this.RESIDENCE_TYPE_ID != null &&
      this.RESIDENCE_TYPE_ID != ''
    ) {
      this.joinedResidencetype = this.RESIDENCE_TYPE_ID.join(',');
      this.Filterquery =
        " AND DATE_CREATED_BY_MONTH BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "'" +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.joinedResidencetype +
        ')';
      this.isSpinning = true;
      this.api
        .getAllPreferanceList111(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.Filterquery
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';

            if (this.dataList.length > 0) {
              this.Timmerstartloop.length = this.dataList.length;
              let timeremaining: any = [];
              timeremaining.length = this.dataList.length;
              // starttimmer
              for (let ab = 0; ab < this.dataList.length; ab++) {
                let startdate = this.dataList[ab]['PREFERENCE_END_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

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
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining[ab] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval);
                    this.Timmerstartloop[ab] = 0;
                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
            }
          },
          (err) => { }
        );
    } else {
      this.Filterquery =
        " AND DATE_CREATED_BY_MONTH BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "'";
      this.isSpinning = true;
      this.api
        .getAllPreferanceList111(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.Filterquery
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';

            if (this.dataList.length > 0) {
              this.Timmerstartloop.length = this.dataList.length;
              let timeremaining: any = [];
              timeremaining.length = this.dataList.length;
              // starttimmer
              for (let ab = 0; ab < this.dataList.length; ab++) {
                let startdate = this.dataList[ab]['PREFERENCE_END_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

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
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining[ab] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval);
                    this.Timmerstartloop[ab] = 0;
                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
            }
          },
          (err) => { }
        );
    }
  }

  // sort(params: NzTableQueryParams) {
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'ID';
  //   const sortOrder = (currentSort && currentSort.value) || 'desc';

  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search();
  // }

  // add(): void {
  //   this.drawerTitle = 'Generate Quarter Preference Order';
  //   this.drawerData = new genertaeSenioritylist();

  //   this.api.getWaitinglist(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(data => {
  //     if (data['count'] == 0) {
  //       this.drawerData.SEQUENCE_NO = 1;
  //     } else {
  //       this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
  //     }
  //   }, err => {
  //
  //   });

  //   this.drawerVisible = true;
  // }

  // edit(data: genertaeSenioritylist): void {
  //   this.drawerTitle = 'Update Quarter Preference Order';
  //   this.drawerData = Object.assign({}, data);
  //   this.drawerVisible = true;
  // }

  viewDraftAllotment(fileurl: any) {
    const fileUrl = this.api.retriveimgUrl + 'draftAllotmentList/' + fileurl;
    window.open(fileUrl);
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  thisphase = 0;
  stages123: any;
  Continuestatus(data: senioritypass) {
    this.thisphase = 0;
    this.stages123 = data.STEP_NO + 1;
  }
  RESIDENCE_TYPE: any;
  flatPreferenceDataList: any = [];
  flatPreferenceList: any = [];
  flatPreferancepageIndex: any = 0;
  flatPreferancepageSize: any = 10;
  isPrevious: boolean = false;
  viewPreference(data: senioritypass): void {
    this.isSpinning = true;
    this.drawerData = Object.assign({}, data);
    this.drawerTitle = "Quarter Preference's Order";
    this.flatPreferancepageIndex = 1;
    this.flatPreferancepageSize = 10;
    // this.RESIDENCE_TYPE = data.RESIDENCE_TYPE;

    this.api
      .getAllDraftAllotment(
        1,
        20,
        '',
        '',
        " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " +
        this.drawerData.ID
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
                ' AND PREFERENCES_MASTER_ID = ' + this.drawerData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    // this.flatPreferenceDataList = data['data'];
                    this.employeefilterid = data['data'];
                    // localStorage.setItem('employeefilterid',this.employeefilterid)
                    localStorage.setItem(
                      'employeefilterid',
                      JSON.stringify(this.employeefilterid)
                    );
                  } else {
                    this.message.error('Data Not Load', '');
                  }
                },
                (err) => { }
              );
            this.loadingRecords = false;
            this.drawerVisible = true;
            this.isSpinning = false;
          } else {
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  employeefilterid: any = [];
  viewPreferencedemo(data: senioritypass): void {
    // this.drawerData = Object.assign({}, data);
    this.isSpinning = true;
    this.drawerTitle = "Quarter Preference's Order";
    this.flatPreferancepageIndex = 0;
    this.flatPreferancepageSize = 0;
    this.drawerData = Object.assign({}, data);
    // this.drawerTitle = "Quarter Preference's Order";
    // this.flatPreferancepageIndex = 1;
    // this.flatPreferancepageSize = 10;
    this.employeefilterid = [];
    // this.RESIDENCE_TYPE = data.RESIDENCE_TYPE;
    this.api
      .getFlatAllotmentList(
        1,
        10,
        'EMP_ID',
        'desc',
        ' AND PREFERENCES_MASTER_ID = ' + this.drawerData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.flatPreferenceDataList = data['data'];
            this.employeefilterid = data['data'];
            // localStorage.setItem('employeefilterid',this.employeefilterid)
            localStorage.setItem(
              'employeefilterid',
              JSON.stringify(this.employeefilterid)
            );
            this.api
              .getAllDraftAllotment(
                0,
                0,
                '',
                '',
                " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " +
                this.drawerData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.isPrevious = true;
                    } else {
                      this.isPrevious = false;
                    }
                    this.loadingRecords = false;
                    this.drawerVisible = true;
                  } else {
                  }
                },
                (err) => { }
              );
          } else {
            this.message.error('Data Not Load', '');
          }

          // if (data['code'] == 200) {
          //   if (data['data'].length > 0) {
          //     this.flatPreferenceDataList = data['data'];
          //   } else {
          //     this.flatPreferenceDataList = [];
          //   }
          //   this.loadingRecords = false;
          //   this.drawerVisible = true;
          // } else {
          //   this.message.error('Data Not Load', '');
          // }
        },
        (err) => { }
      );
    // this.drawerData = new genertaeSenioritylist();

    // this.api.getWaitinglist(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.drawerData.SEQUENCE_NO = 1;
    //   } else {
    //     this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
    //   }
    // }, err => {
    //
    // });
  }

  RESIDENCE_TYPE_ID: any = [];
  joinedResidencetype: any;
  ResidenceTypelist: any = [];
  datenew: any = new Date();
  selectoyear: any = new Date();
  selectToMonth: any = new Date();
  selectfromyear: any = new Date();
  selectFromMonth: any = new Date();

  // isFilterApplied: any = 'default';
  // isSpinning = false;
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  YEAR2: any;
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
    // } else
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
      this.search();
    }
  }
  // datenew: any = new Date();
  clearFilter() {
    this.RESIDENCE_TYPE_ID = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
    }

    this.Monthrange = [];
    let newdate = new Date();
    this.Monthrange[0] = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    this.Monthrange[1] = new Date(
      newdate.getFullYear(),
      newdate.getMonth() + 1,
      0
    );
    this.search();
    this.isFilterApplied = 'default';
  }
}
