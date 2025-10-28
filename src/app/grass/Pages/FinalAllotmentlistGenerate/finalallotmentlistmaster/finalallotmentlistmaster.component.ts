import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FinalAllotmentlist } from 'src/app/grass/Models/FinalAllotmentlistgenerate';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-finalallotmentlistmaster',
  templateUrl: './finalallotmentlistmaster.component.html',
  styleUrls: ['./finalallotmentlistmaster.component.css'],
  providers: [DatePipe],
})
export class FinalallotmentlistmasterComponent {
  current = 1;
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: FinalAllotmentlist = new FinalAllotmentlist();
  formTitle = 'Final Allotment Order Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  Timmerstartloop: any = [];
  isSpinning = false;
  Timmerendloop: any = [];
  countdowndisable = true;
  columns: string[][] = [
    ['TYPE', 'Type'],
    ['PAY_BILL_SECTION', 'Pay Bill'],
  ];
  constructor(
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private api: APIServicesService
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
    // this.search();
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  keyup(event: any) {
    this.search();
  }
  search(reset: boolean = false) {
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
        " AND FILTER_DATE BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "'" +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.joinedResidencetype +
        ')';
    } else if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      (this.RESIDENCE_TYPE_ID == undefined ||
        this.RESIDENCE_TYPE_ID == null ||
        this.RESIDENCE_TYPE_ID == '')
    ) {
      this.Filterquery =
        " AND FILTER_DATE BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "'";
    }

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

    this.isSpinning = true;
    this.api
      .getDraftAllotmentListgenerate(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.Filterquery
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';

            if (this.dataList.length > 0) {
              this.Timmerstartloop.length = this.dataList.length;
              this.Timmerendloop.length = this.dataList.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.dataList.length;
              timeremaining2.length = this.dataList.length;
              // starttimmer
              for (let ab = 0; ab < this.dataList.length; ab++) {
                // let sapandate = this.dataList[ab]['OBJ_END_TIME_PERIOD'];
                let startdate = this.dataList[ab]['OBJ_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();

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
                    this.Timmerstartloop[ab] = 0;
                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
              // endtimmer
              for (let cc = 0; cc < this.dataList.length; cc++) {
                let sapandate = this.dataList[cc]['OBJ_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                let startdate = this.dataList[cc]['OBJ_START_DATE_TIME'];
                const startdatet = new Date(startdate);

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
                    this.Timmerendloop[cc] = 0;
                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
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

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
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

  currentstage: any;
  Showstepscheck(data, index) {
    if (
      data.OBJ_START_DATE_TIME != null &&
      data.OBJ_END_DATE_TIME != null &&
      data.FINAL_FILE_URL == null &&
      this.Timmerstartloop[index] <= 0 &&
      (this.Timmerendloop[index] > 0 || this.Timmerendloop[index] != '')
    ) {
      return 0;
    } else if (
      data.OBJ_START_DATE_TIME != null &&
      data.OBJ_END_DATE_TIME != null &&
      data.FINAL_FILE_URL == null &&
      this.Timmerstartloop[index] <= 0 &&
      this.Timmerendloop[index] <= 0
    ) {
      return 2;
    } else if (
      data.OBJ_START_DATE_TIME != null &&
      data.OBJ_END_DATE_TIME != null &&
      data.FINAL_FILE_URL != null &&
      this.Timmerstartloop[index] <= 0 &&
      this.Timmerendloop[index] <= 0
    ) {
      return 4;
    } else {
      return -1;
    }
  }

  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
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
  // Continuestatus(data: senioritypass) {
  //   this.thisphase = 0;
  //   this.stages123 = data.STEP_NO + 1;
  // }
  RESIDENCE_TYPE: any;
  flatPreferenceDataList: any = [];
  flatPreferenceList: any = [];
  flatPreferancepageIndex: any = 0;
  flatPreferancepageSize: any = 10;
  viewPreference(data: any): void {
    this.drawerData = Object.assign({}, data);
    this.drawerTitle = "Quarter Preference's Order";
    this.flatPreferancepageIndex = 1;
    this.flatPreferancepageSize = 10;
  }

  DrawerVisiblechek: boolean = false;
  DrawerVisibleTitle = '';
  DrawerVisibleData: any;
  DrawerVisibleClose() {
    this.search();
    this.DrawerVisiblechek = false;
  }

  get closeCallDrawerVisible() {
    return this.DrawerVisibleClose.bind(this);
  }
  employeefilterid: any = []
  ContinueSteps(show: any) {
    this.employeefilterid = []
    if (show.PENDING != 0) {
      this.message.info('Some Objections are still pending.', '');
    } else {
      this.DrawerVisibleTitle = 'Allotment Order';

      this.DrawerVisibleData = Object.assign({}, show);

      this.api
        .getFlatAllotmentList(
          0,
          0,
          'SENIORITY_SEQ_NO',
          'desc',
          ' AND PREFERENCES_MASTER_ID = ' + this.DrawerVisibleData.PREFERENCES_MASTER_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.DrawerVisiblechek = true;
              this.employeefilterid = data['data'];
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
    }
  }

  Objectionsdrawervisible = false;
  Objectiondrawertitle = '';
  Objectionsdrawerdata: any;
  StringObjectionfilter: any;
  ObjectiondrawerClose() {
    this.search();
    this.Objectionsdrawervisible = false;
  }

  get closeCallObjectionsdrawer() {
    return this.ObjectiondrawerClose.bind(this);
  }

  objectionshow(data: any, filterstring: string, nn) {
    if (
      data.OBJ_START_DATE_TIME != null &&
      data.OBJ_START_DATE_TIME != undefined &&
      data.OBJ_START_DATE_TIME != '' &&
      data.OBJ_END_DATE_TIME != null &&
      data.OBJ_END_DATE_TIME != undefined &&
      data.OBJ_END_DATE_TIME != '' &&
      this.Timmerendloop[nn] <= 0
    ) {
      this.Objectionsdrawervisible = true;
      this.Objectiondrawertitle = "Allotment Objection's Order";
      this.Objectionsdrawerdata = Object.assign({}, data);
      this.StringObjectionfilter = filterstring;
    } else if (
      data.OBJ_START_DATE_TIME != null &&
      data.OBJ_START_DATE_TIME != undefined &&
      data.OBJ_START_DATE_TIME != '' &&
      data.OBJ_END_DATE_TIME != null &&
      data.OBJ_END_DATE_TIME != undefined &&
      data.OBJ_END_DATE_TIME != '' &&
      (this.Timmerendloop[nn] > 0 || this.Timmerendloop[nn] != '')
    ) {
      this.message.info('Objection End Time is not Over Yet.', '');
    } else {
      this.message.info('Objection Time is Not Started Yet', '');
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  SenioritylistPDF: any;
  viewdraftallotmentlist(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'draftAllotmentList/' + pdfURL;
    window.open(fileUrl);
    // this.SenioritylistPDF = '';
    // this.view = 1;
    // this.printOrderModalVisible = true;
    // this.SenioritylistPDF = this.getS(pdfURL);
  }
  viewFinalFile(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'finalAllotmentList/' + pdfURL;
    window.open(fileUrl);
    // this.SenioritylistPDF = '';
    // this.view = 2;
    // this.printOrderModalVisible = true;
    // this.SenioritylistPDF = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'draftAllotmentList/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'finalAllotmentList/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
}
