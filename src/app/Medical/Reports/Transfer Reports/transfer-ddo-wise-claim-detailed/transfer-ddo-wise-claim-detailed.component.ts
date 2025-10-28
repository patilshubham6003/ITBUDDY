import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
@Component({
  selector: 'app-transfer-ddo-wise-claim-detailed',
  templateUrl: './transfer-ddo-wise-claim-detailed.component.html',
  styleUrls: ['./transfer-ddo-wise-claim-detailed.component.css'],
})
export class TransferDdoWiseClaimDetailedComponent {
  formTitle = 'Transfer DDO Wise Claim Detailed Report';
  userId: any;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';

  columns: string[][] = [
    ['DDO_OF_THE_OFFICIAL', 'DDO Of The Official'],
    ['NAME', 'Employee Name'],
    ['GRADE_PAY', 'Basic Pay'],
    ['MOBILE_NO', 'Mobile Number'],
    ['EMPLOYEE_CODE', 'Emplyee Code'],
    ['DESIGNATION', 'Designation'],
    ['GRADE_PAY_LEVEL', 'Grade Pay Level'],
    ['SERVICE_TYPE', 'Service Type'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  DDO_OF_THE_OFFICIAL_ID: any;
  TYPE_OF_CLAIM: any;
  IS_CLAIM: any;
  CLAIM_AT: any;
  SELECTFROMDATE: any;
  SELECTTODATE: any;
  isDateFilter = true;
  ddoOfTheOfficialDataList: any = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.ddoOfTheOfficialList();
    // this.DATE[0] = new Date(
    //   this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    // );
    // this.DATE[1] = new Date(
    //   this.current.getFullYear(),
    //   this.current.getMonth() + 1,
    //   0
    // );
    // this.search();
    // this.getSales();

    this.disabledDate1 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;

    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  keyup(event: any) {
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  ddoOfTheOfficialList() {
    this.isSpinning = true;
    this.api.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            this.ddoOfTheOfficialDataList = data['data'];
          } else {
            this.ddoOfTheOfficialDataList = [];
          }
          this.isSpinning = false;
        } else {
          this.ddoOfTheOfficialDataList = [];
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  applyFilter() {
    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var FromDate: any = '';
    var ToDate: any = '';
    this.filterQuery = '';
    if (this.DDO_OF_THE_OFFICIAL_ID) {
      this.filterQuery +=
        ' AND DDO_OF_THE_OFFICIAL_ID = ' + this.DDO_OF_THE_OFFICIAL_ID;
    }
    if (this.TYPE_OF_CLAIM) {
      this.filterQuery +=
        ' AND IS_APPLYING_FOR_ADVANCE = ' + this.TYPE_OF_CLAIM;
    }
    if (this.IS_CLAIM) {
      this.filterQuery += ' AND IS_DELETED =' + this.IS_CLAIM;
    }

    if (this.SELECTFROMDATE || this.SELECTTODATE) {
      this.isDateFilter = true;
      if (this.SELECTFROMDATE && !this.SELECTTODATE) {
        this.isDateFilter = false;
        this.message.error('Please Select To Date', '');
      } else if (!this.SELECTFROMDATE && this.SELECTTODATE) {
        this.isDateFilter = false;
        this.message.error('Please Select From Date', '');
      } else {
        FromDate = this.datePipe.transform(
          this.SELECTFROMDATE,
          'yyyy-MM-dd 00:00:00'
        );
        ToDate = this.datePipe.transform(
          this.SELECTTODATE,
          'yyyy-MM-dd 23:59:59'
        );
        this.filterQuery +=
          " AND date(APP_INFO_DATE_TIME) BETWEEN '" +
          FromDate +
          "' AND '" +
          ToDate +
          "' ";
      }
    }

    if (this.CLAIM_AT) {
      this.filterQuery += ' AND IS_ADMIN_TRANSFER = ' + this.CLAIM_AT;
    }

    if (this.filterQuery) {
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.search();
    } else {
      if (!this.isDateFilter && !this.filterQuery) {
      } else {
        this.message.error('Select Any Filter Value', '');
      }
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DDO_OF_THE_OFFICIAL_ID = 0;
    this.TYPE_OF_CLAIM = null;
    this.IS_CLAIM = null;
    this.SELECTFROMDATE = null;
    this.SELECTTODATE = null;
    this.CLAIM_AT = null;
    this.dataList = [];
    this.disabledDate1 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;

    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(false, true);
  }
  extraFilterQuery: any;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }
    // this.loadingRecords = true;
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

    // if (this.userId == 1) {
    //   this.extraFilterQuery = '';
    // } else {
    //   this.extraFilterQuery = 'AND INSPECTOR_ID = ' + this.userId;
    // }
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .gettransferdata(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (err) => {}
        );
    } else {
      this.exportLoading = false;

      this.api
        .gettransferdata(0, 0, this.sortKey, sort, this.filterQuery + likeQuery)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.inspector = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  // sort(sort: any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   if (this.sortValue == "descend") {
  //     this.sortValue = 'desc';
  //   } else {
  //     this.sortValue = 'asc'
  //   }
  //
  //   this.search(true);
  // }

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
    this.search(false);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.inspector.length > 0) {
      for (var i = 0; i < this.inspector.length; i++) {
        obj1['DDO Of The Official'] = this.inspector[i]['DDO_OF_THE_OFFICIAL'];
        obj1['Employee Name'] = this.inspector[i]['NAME'];
        obj1['Basic Pay'] = this.inspector[i]['GRADE_PAY'];
        obj1['Mobile Number'] = this.inspector[i]['MOBILE_NO'];
        obj1['Emplyee Code'] = this.inspector[i]['EMPLOYEE_CODE'];
        obj1['Designation'] = this.inspector[i]['DESIGNATION'];
        obj1['Grade Pay Level'] = this.inspector[i]['GRADE_PAY_LEVEL'];
        obj1['Service Type'] = this.inspector[i]['SERVICE_TYPE'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.inspector.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Transfer DDO Wise Claim Detailed Report' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) > 0;

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.SELECTFROMDATE)) < 0;

  disabledDate1 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.SELECTTODATE)) > 0;

  startDateChange() {
    if (this.SELECTFROMDATE != null) {
      // var startDate = this.datePipe.transform(
      //   this.SELECTFROMDATE,
      //   'yyyy-MM-dd'
      // );
      // var endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

      this.disabledDate2 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.SELECTFROMDATE)) < 0;
    } else {
      this.disabledDate2 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date()) > 0;
    }
  }

  endDateChange() {
    // var startDate = this.datePipe.transform(this.SELECTFROMDATE, 'yyyy-MM-dd');
    // var endDate = this.datePipe.transform(this.SELECTTODATE, 'yyyy-MM-dd');

    if (this.SELECTTODATE != null) {
      this.disabledDate1 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.SELECTTODATE)) > 0;
    } else {
      this.disabledDate1 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date()) > 0;
    }
  }
}
