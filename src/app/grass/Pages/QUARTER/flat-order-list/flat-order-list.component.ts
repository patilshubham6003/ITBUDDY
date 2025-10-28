import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { FlatOrderMaster } from '../FlatOrder';

@Component({
  selector: 'app-flat-order-list',
  templateUrl: './flat-order-list.component.html',
  styleUrls: ['./flat-order-list.component.css'],
  providers: [DatePipe],
})
export class FlatOrderListComponent {
  formTitle = 'Vacant Quarter Available Master';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: FlatOrderMaster = new FlatOrderMaster();
  // drawerData: any
  userid: any;
  roleid: any;
  YEARR: any = [];
  MONTHH: any = [];
  columns: string[][] = [
    ['RESIDENCE_TYPE_NAME', 'Residence Type Name'],
    ['DATETIME', 'Date Time'],
    ['CREATOR_NAME', 'Creator Name'],
    ['MONTH', 'Month'],
    ['YEAR', 'Year'],
    ['APPROVER_NAME', 'Approvar Name'],
    ['PUBLISH_DATE_TIME', 'Publish Date Time'],
  ];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
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
    this.getallcities();
    this.getResidenceTypestart();
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');

    // this.search(true);
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }
  RESIDENCE_TYPE_IDD: any = [];
  AVAILABLE_STATUS: any;
  ROOM_TYPE: any;
  BUILDING_ID: any;
  AREA_ID: any;
  CITY_ID: any;
  MONTH1: any;
  MONTH2: any;
  onChange(result: Date[]): void { }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

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
      likeQuery = likeQuery + ') ';
    }

    // var statusFilter = "";
    // if (this.AVAILABLE_STATUS != undefined && this.AVAILABLE_STATUS != '' && this.AVAILABLE_STATUS != null  ) {

    //   statusFilter=" AND AVAILABLE_STATUS='"+this.AVAILABLE_STATUS+"'"
    // }
    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null
    ) {
      filterQuery1 = ' AND RESIDENCE_TYPE in (' + this.RESIDENCE_TYPE_IDD + ')';
    }

    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    var datefilter = '';
    if (
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH1 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.MONTH2 != null
    ) {
      datefilter =
        " AND date(DATETIME) BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' ";
    }
    // var dateFilter = '';
    // if (this.MONTHH.length >0) {
    //   var startdate: any =new Date( this.MONTHH[0])
    //   var endDate: any =new Date( this.MONTHH[1])
    //   // if (startdate <= endDate) {

    //     var monthsBetween:any=[]

    //     while (startdate <= endDate) {
    //       const monthNumber = startdate.getMonth(); // Add 1 to get the month number (1 to 12)
    //       monthsBetween.push(monthNumber.toString());
    //        startdate.setMonth(startdate.getMonth());
    //     }
    //     // this.datepipe.transform(monthsBetween, 'MM');
    //   //

    //   dateFilter =
    //   " AND MONTH in (" + monthsBetween+")";
    // }

    // var years: any = [];
    // var yearfilter = '';
    // if (this.YEARR.length > 0) {
    //   var statedate: any = this.datepipe.transform(this.YEARR[0], 'yyyy');
    //   var enddate: any = this.datepipe.transform(this.YEARR[1], 'yyyy');

    //   for (let year = statedate; year <= enddate; year++) {
    //     years.push(year);
    //   }
    //   //

    //   yearfilter =
    //     " AND YEAR in (" + years+")";
    // }

    this.loadingRecords = true;
    this.api
      .getFlatOrder(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + datefilter + filterQuery1
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];

          this.filterClass = 'filter-invisible';
          this.isFilterApplied = 'primary';
        },
        (err) => { }
      );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    this.drawerVisible = false;
    this.search();
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Add Quarter Information';
    // this.drawerData = new FlatOrderMaster();
    // this.api.getQuarterMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
    //   (data) => {
    //     if (data['count'] == 0) {
    //       this.drawerData.SEQUENCE_NO = 1;
    //     } else {
    //       this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
    //     }
    //   },
    //   (err) => {
    //
    //   }
    // );

    this.drawerVisible = true;
  }
  flatList: any = [];
  edit(data: any): void {
    this.loadingRecords = true;
    this.drawerTitle = 'Update Quarter Information';
    this.drawerData = Object.assign({}, data);

    this.api
      .getFlatOrderLog(0, 0, '', '', ' AND ORDER_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.flatList = data['data'];
            } else {
              this.flatList = [];
            }
            this.loadingRecords = false;
            this.drawerVisible = true;
          } else {
            this.loadingRecords = false;
            this.flatList = [];
            // this.isSpinning = false;
          }
        },
        (err) => { }
      );
  }

  // vacancylist(){

  // }

  vacancyvisible = false;
  vacancyTitle = '';
  values: any;
  viewflatvacancy() {
    this.vacancyvisible = true;
    this.vacancyTitle = 'Quarter Vacancy';
    this.values = Object.assign({}, undefined);
  }
  vacancyvisibleclose() {
    this.vacancyvisible = false;
  }
  getResidenceTypestart() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
          for (var i = 0; i < this.ResidenceType111.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
          }
          this.search(true);
        }
      },
      (err) => { }
    );
  }

  get vacancyclose111() {
    return this.vacancyvisibleclose.bind(this);
  }

  areaList: any;
  BuildingList: any;
  cityList: any;
  changecity(event: any) {
    this.BuildingList = [];

    this.areaList = [];

    this.api
      .getareamaster(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND CITY_ID in(' + event + ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.areaList = data['data'];
          }
        },
        (err) => { }
      );
  }
  changearea(event: any) {
    this.BuildingList = [];

    this.api
      .getBuildingMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND AREA_ID in(' + event + ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.BuildingList = data['data'];
          }
        },
        (err) => { }
      );
  }

  getallcities() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        }
      },
      (err) => { }
    );
  }

  ResidenceType111: any;
  getResidenceType() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
        }
      },
      (err) => { }
    );
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
      // this.YEAR1 = this.datepipe.transform(this.Monthrange[0], 'yyyy');
      // this.YEAR2 = this.datepipe.transform(this.Monthrange[1], 'yyyy');
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }
  clearFilter() {
    // this.YEARR = null;
    // this.MONTHH = null;
    // for(var i=0;i<this.ResidenceType111.length;i++){
    //   this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
    // }
    // this.search();
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceType111.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
    }

    this.Monthrange = [];
    let newdate = new Date();
    this.Monthrange[0] = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    this.Monthrange[1] = new Date(
      newdate.getFullYear(),
      newdate.getMonth() + 1,
      0
    );
    this.search(true);
    this.isFilterApplied = 'default';
  }

  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
}
