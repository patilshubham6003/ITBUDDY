import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { Employee } from 'src/app/Modal/employee_registration';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-employee-registration',
  templateUrl: './employee-registration.component.html',
  styleUrls: ['./employee-registration.component.css'],
  providers: [DatePipe],
})
export class EmployeeRegistrationComponent implements OnInit {
  formTitle = 'Manage Employee Information';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  registercounts: any = [];
  rejectscounts: any = [];
  pendingscounts: any = [];
  approvedcounts: any = [];
  APPROVAL_STATUS: string = 'P';
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  selectFromMonth: any;
  FROMDATE: any;
  TODATE: any;
  selectToMonth: any;
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  logtext: string = '';
  retrieveimgUrl = appkeys.retriveimgUrl;
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMAIL_ID', 'Email ID'],
    ['DESIGNATION', 'Designation'],
    ['MOBILE_NO', 'Mobile No'],
    ['GRADE_PAY_LEVEL', 'Grade Pay Level'],
    ['GRASS_GRADE_PAY', 'Grade Pay'],
    ['GRADE_PAY', 'Basic Pay'],
    ['EMPLOYEE_CODE', 'Employee Code'],
  ];
  filterClass: string = 'filter-invisible';

  //drawer Variables

  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Employee = new Employee();

  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    public cookie: CookieService,
    private datepipe: DatePipe
  ) {}
  ngOnInit() {
    this.selectFromMonth = new Date();
    this.selectToMonth = new Date();
    this.FROMDATE = this.datepipe.transform(this.selectFromMonth, 'yyyy-MM-dd');
    this.TODATE = this.datepipe.transform(this.selectToMonth, 'yyyy-MM-dd');
    this.search();
  }
  keydown(event: any) {
    console.log(event);
    this.search();
  }
  showcolor = 0;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 1;

  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    if (this.APPROVAL_STATUS == 'all') {
      this.showcolor = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
    } else {
      this.showcolor = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
    }
    this.applyFilter();
  }
  show = this.drawerData.REJECT_REMARK;
  // Basic Methods
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  dateFilter: string = '';

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
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

    this.dateFilter = '';
    if (this.FROMDATE != null && this.TODATE != null) {
      this.FROMDATE = this.datepipe.transform(this.FROMDATE, 'yyyy-MM-dd');
      this.TODATE = this.datepipe.transform(this.TODATE, 'yyyy-MM-dd');
      this.dateFilter +=
        ' AND date(CREATED_MODIFIED_DATE) between ' +
        '"' +
        this.FROMDATE +
        '"' +
        ' AND ' +
        '"' +
        this.TODATE +
        '"';
    }
    this.filterQuery = '';
    if (this.APPROVAL_STATUS == 'all') {
      this.filterQuery = '';
    } else {
      this.filterQuery += " AND APPROVAL_STATUS='" + this.APPROVAL_STATUS + "'";
    }
    this.api
      .getAllEmployee(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery + likeQuery + this.dateFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            this.isSpinning = false;
            this.api.getRegistrationStatuscount().subscribe(
              (datass) => {
                this.registercounts = datass['data'][0]['TOTAL_REGISTRATION'];
                this.approvedcounts = datass['data'][0]['TOTAL_APPROVED'];
                this.pendingscounts = datass['data'][0]['TOTAL_PENDING'];
                this.rejectscounts = datass['data'][0]['TOTAL_REJECTED'];
              },
              (err) => {
                console.log(err);
              }
            );
            if (this.totalRecords == 0) {
              data['SEQUENCE_NO'] = 1;
            } else {
              data['SEQUENCE_NO'] =
                this.dataList[this.dataList.length - 1]['SEQUENCE_NO'] + 1;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  clearFilter() {
    this.dateFilter = '';

    this.FROMDATE = null;
    this.TODATE = null;
    this.selectToMonth = null;
    this.selectFromMonth = null;
    // this.APPROVAL_STATUS='ALL'
    // this.selectFromMonth = new Date()
    // this.selectToMonth = new Date()
    this.filterQuery = '';
    this.searchText = '';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }

  isSpinning: boolean = false;
  applyFilter() {
    this.isSpinning = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    console.log(sort);
    this.filterQuery = '';
    if (this.APPROVAL_STATUS == 'all') {
      this.filterQuery = '';
    } else {
      this.filterQuery += " AND APPROVAL_STATUS='" + this.APPROVAL_STATUS + "'";
    }
    this.FROMDATE = this.datepipe.transform(this.selectFromMonth, 'yyyy-MM-dd');
    this.TODATE = this.datepipe.transform(this.selectToMonth, 'yyyy-MM-dd');
    this.loadingRecords = true;
    this.search();
    this.isFilterApplied = 'primary';
    this.filterClass = 'filter-invisible';
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  fileURL: any;
  showimg: any;
  fileExt: any;
  edit(data: Employee): void {
    this.drawerTitle = 'Employee Registration Information';
    this.drawerData = Object.assign({}, data);
    sessionStorage.setItem('editTT', 'T');
    if (
      this.drawerData.ID_PROOF != null &&
      this.drawerData.ID_PROOF != undefined
    ) {
      var a = this.drawerData.ID_PROOF.split('.').toString();
      this.fileExt = a.slice(a.indexOf(',') + 1).trim();
    } else {
      this.drawerData.ID_PROOF = this.drawerData.ID_PROOF;
    }
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}
