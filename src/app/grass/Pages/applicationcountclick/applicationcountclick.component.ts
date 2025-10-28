import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-applicationcountclick',
  templateUrl: './applicationcountclick.component.html',
  styleUrls: ['./applicationcountclick.component.css']
})
export class ApplicationcountclickComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = AllotmentMaster;
  @Input() APPROVAL_STATUS!: string;
  @Input() RecApp: any = [];
  @Input() MonthApp: number;
  @Input() yearApp: number;


  dataList = [];
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
    ['EMPLOYEE_NAME', 'Name'],
    ['EMAIL_ID', 'Name'],
    ['DESIGNATION_SHORT_CODE', 'Name'],
    ['EMPLOYEE_CODE', 'Name']
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
  registercounts;
  approvedcounts;
  deleteedcounts;

  OLDApplicationcounts: any = '';
  NewApplicationcounts: any = '';
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

    var dateFilter = '';
    if (this.monthh != null) {
      dateFilter =
        " AND ( date(APPLICATION_DATETIME ) BETWEEN '" +
        this.datePipe.transform(this.monthh[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.monthh[1], 'yyyy-MM-dd') +
        "')";
    }
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    }

    var filterQuery1 = '';
    if (this.RecApp != undefined && this.RecApp != '' && this.RecApp != null) {
      // filterQuery1 = ' AND (';
      // this.RecApp.forEach((RESIDENCE_TYPE_IDD) => {
      //   filterQuery1 += " RESIDENCE_TYPE_NAME like '%" + RESIDENCE_TYPE_IDD + "%' OR";
      // });
      // filterQuery1 = filterQuery1.substring(0, filterQuery1.length - 2) + ')';
      filterQuery1 = " AND RESIDENCE_TYPE_ID like '%" + this.RecApp + "%'";
    }

    this.isSpinning = true;
    this.api
      .getAllotmenmaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        filterQuery1 + statusFilter + dateFilter + likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          // this.dataList = data['data'];
          if (data['count'] > 0) {
            this.dataList = data['data'].map(item => {
              return {
                ...item,
                RESIDENCE_TYPE_ARRAY: item.RESIDENCE_TYPE_NAME.split(',')
              };
            });
          } else {
            this.dataList = data['data'];
          }
          this.filterClass = 'filter-invisible';
          this.isFilterApplied = 'primary';

          this.api
            .getCount(0, 0, '', '', filterQuery1 + dateFilter)
            .subscribe(
              (data) => {
                this.data = data['data'];
                this.pendingscounts = data['data'][0]['PENDING'];
                this.rejectscounts = data['data'][0]['REJECTED'];
                this.registercounts = data['data'][0]['TOTAL'];
                this.approvedcounts = data['data'][0]['APPROVED'];
                this.deleteedcounts = data['data'][0]['DELETED'];
                this.isSpinning = false;
              },
              (err) => {
                this.isSpinning = false;
              }
            );
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    this.isSpinning = false;

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
