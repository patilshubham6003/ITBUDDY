import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { QuarterMaster } from '../QUARTER/QuarterData';

@Component({
  selector: 'app-flatcountclick',
  templateUrl: './flatcountclick.component.html',
  styleUrls: ['./flatcountclick.component.css']
})
export class FlatcountclickComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() APPROVAL_STATUS!: string;
  @Input() RecApp: any = [];
  @Input() MonthApp: number;
  @Input() yearApp: number;

  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'ID';
  searchText: string = '';
  drawerTitle!: string;
  filterQuery: string = '';
  columns: string[][] = [
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['NAME', 'name'],
    ['RESIDENCE_TYPE_NAME', 'Residence Type']
  ];
  employeeID: any;
  userid: any;
  roleid: any;
  isFilterApplied: any = 'primary';
  // isFilterApplied: any = 'default';
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  Status = 'P';
  monthh: any = [];
  MONTH: any;
  YEAR: any;
  monthh1: any;
  monthh2: any;
  dateFormat = 'dd/MM/yyyy';

  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    const monthMoment = moment({ year: this.yearApp, month: this.MonthApp - 1 }).subtract(1, 'months');;
    var first: any = monthMoment.startOf('month').toDate();
    var end: any = monthMoment.endOf('month').toDate();
    this.monthh[0] = this.datePipe.transform(first, 'yyyy-MM-dd');
    this.monthh[1] = this.datePipe.transform(end, 'yyyy-MM-dd');
    this.employeeID = sessionStorage.getItem('userId');
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  close() {
    this.drawerClose();
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  emp: any = [];
  pendingscounts;
  applyFilter() {
    if (this.monthh == null) {
      this.message.error('Please Select Month', '');
    } else {
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }

  changeRadioButton(event) {
    this.Status = event;
    this.search(true);
  }
  RESIDENCE_TYPE_NAME = [];
  keyup(event: any) {
    this.search(true);
  }
  rejectscounts;
  search(reset: boolean = false) {
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND AVAILABLE_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    }

    var filterQuery1 = '';
    if (this.RecApp != undefined && this.RecApp != '' && this.RecApp != null) {
      filterQuery1 = ' AND RESIDENCE_TYPE_ID=' + this.RecApp;
    }

    this.isSpinning = true;
    this.api
      .getQuarterMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        filterQuery1 + statusFilter + likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.api
              .getSeniorityListWithCount(0, 0, '', '', filterQuery1)
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    // this.data = data['data'];
                    this.pendingscounts = data['FLAT_COUNT'][0];
                  }
                  this.isSpinning = false;
                },
                (err) => {
                  this.isSpinning = false;
                }
              );
          } else {
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.isSpinning = false;
        });
  }
  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.applyFilter();
  }
  ApplicationStatus: any = '';

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
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
}