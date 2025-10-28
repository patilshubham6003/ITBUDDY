import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { contactInfo } from 'src/app/Modal/usercontact';
import { ServiceService } from 'src/app/Service/service.service';
import { ExportService } from 'src/app/Service/export.service';
// import { ApiService } from 'src/app/Service/api.service';
@Component({
  selector: 'app-usercontacts',
  templateUrl: './usercontacts.component.html',
  styleUrls: ['./usercontacts.component.css'],
  providers: [DatePipe],
})
export class UsercontactsComponent implements OnInit {
  @Input() data: contactInfo = new contactInfo();
  dateFormat = 'dd/MMM/yyyy';
  formTitle = 'Contact Info Report';
  fileName = 'ContactInfoReport.xlsx';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  exportToExcelDataList = [];
  loadingRecords = true;
  exportToExcelLoading = false;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'Employee Name'],
    ['EMAIL_ID', 'Email Id'],
    ['MOBILE_NO', 'Mobile No.'],
    ['CREATED_MODIFIED_DATE', 'Date'],
    ['SUBJECT', 'Subject'],
    ['MESSAGE', 'Message'],
  ];
  isSpinning = false;
  loadingFilterEmployees = true;
  filterClass: string = 'filter-visible';
  date: Date[] = [];
  startValue: any = new Date();
  endValue: any = new Date();
  endOpen = false;
  // CREATED_MODIFIED_DATE:Date[]=[];

  constructor(
    private _exportService: ExportService,
    private api: ServiceService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    // this.date[0] = new Date();
    // this.date[1] = new Date();
    // this.search();
    // this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    //  this.onKeypressEvent(event)
  }

  onKeypressEvent(event: any) {
    const element = window.document.getElementById('searchBtn');
    if (element != null) element.focus();
  }
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
  orgId = this.cookie.get('orgId');
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    // this.filterQuery = "";

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

    if (this.searchText) {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      // this.filterQuery += likeQuery.substring(0, likeQuery.length - 3) + ')';
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    var dateFilter = '';
    if (this.date != undefined && this.date.length != 0) {
      dateFilter =
        " AND (CREATED_MODIFIED_DATE BETWEEN '" +
        this.datePipe.transform(this.date[0], 'yyyy-MM-dd 00:00:00') +
        "' AND '" +
        this.datePipe.transform(this.date[1], 'yyyy-MM-dd 23:59:59') +
        "')";
      this.isFilterApplied = 'primary';
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.dataList = [];
      this.api
        .getContactInfo(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + dateFilter
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.isFilterApplied = 'primary';
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getContactInfo(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + dateFilter
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.exportToExcelDataList = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  keyup() {
    this.search();
  }

  getDaysArray(start: any, end: any) {
    for (
      var arr: any = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }

  timeDefaultValue = setHours(new Date(), 0);

  dates: any = [];
  today2 = new Date();

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose(): void {
    this.search();
  }

  clearFilter() {
    this.date = [];
    //  this.date[0] = new Date();
    //  this.date[1] = new Date();
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.search(true);
  }

  applyFilter() {
    this.loadingRecords = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    console.log(sort);
    // if (this.date.length > 0) {
    //   this.isFilterApplied = 'primary';
    // } else {
    //   this.isFilterApplied = 'default';
    // }
    this.search(true);
    this.filterClass = 'filter-invisible';
  }

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();

    if (this.exportToExcelDataList.length) {
      for (var i = 0; i < this.exportToExcelDataList.length; i++) {
        obj1['Employee Name'] = this.exportToExcelDataList[i]['EMPLOYEE_NAME'];
        obj1['Email Id'] = this.exportToExcelDataList[i]['EMAIL_ID'];
        obj1['Mobile No.'] = this.exportToExcelDataList[i]['MOBILE_NO'];
        obj1['Date'] = this.datePipe.transform(
          this.exportToExcelDataList[i]['CREATED_MODIFIED_DATE'],
          'dd MMM yyyy'
        );
        obj1['Subject'] = this.exportToExcelDataList[i]['SUBJECT'];
        obj1['Message'] = this.exportToExcelDataList[i]['MESSAGE'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.exportToExcelDataList.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Contact Info ' + this.datePipe.transform(new Date(), 'dd-MMM-yy')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
