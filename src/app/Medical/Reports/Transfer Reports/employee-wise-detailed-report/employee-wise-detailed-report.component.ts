import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-employee-wise-detailed-report',
  templateUrl: './employee-wise-detailed-report.component.html',
  styleUrls: ['./employee-wise-detailed-report.component.css'],
})
export class EmployeeWiseDetailedReportComponent implements OnInit {
  formTitle = 'Inspector Wise Amount Stats Report';

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
    ['NAME', 'NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['ADDRESS', 'ADDRESS'],
    ['NEW_HEADQUARTERS_NAME', 'NEW_HEADQUARTERS_NAME'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  userId: any;
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    // this.DATE[1] = new Date();
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.search();
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

  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.DATE[0] = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
    this.DATE[1] = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');

    if (this.DATE[0] != null) {
      this.START_DATE = this.DATE[0];
    }

    if (this.DATE[1] != null) {
      this.END_DATE = this.DATE[1];
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DATE = [];
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.dataList = [];
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }

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

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .employeeWiseDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + ' AND IS_DELETED = 0',
          this.START_DATE,
          this.END_DATE
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
        .employeeWiseDetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          this.START_DATE,
          this.END_DATE
        )
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
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
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
    this.search(false);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.inspector.length > 0) {
      for (var i = 0; i < this.inspector.length; i++) {
        obj1['Applicant Name'] = this.inspector[i]['NAME'];

        obj1['Mobile No'] = this.inspector[i]['MOBILE_NO'];

        obj1['Employee Code'] = this.inspector[i]['EMPLOYEE_CODE'];
        obj1['Employee Designation'] = this.inspector[i]['DESIGNATION'];
        obj1['DDO official'] = this.inspector[i]['DDO_OF_THE_OFFICIAL'];
        obj1['Office Name'] = this.inspector[i]['OFFICE_NAME'];
        obj1['Old Residential Address'] = this.inspector[i]['ADDRESS'];

        obj1['New Head Quater Name'] =
          this.inspector[i]['NEW_HEADQUARTERS_NAME'];
        obj1['Mode of Tranfer'] = this.inspector[i]['TRAVEL_MODE_NAME'];
        obj1['Station Name'] = this.inspector[i]['STATION_NAME'];
        obj1['Amount (₹)'] = this.inspector[i]['AMOUNT'];
        obj1['Date Of Advance Taken'] = this.inspector[i]['ADVANCE_TAKEN_DATE'];
        obj1[' Advance Amount(₹)'] = this.inspector[i]['ADVANCED_AMOUNT'];

        obj1[' AVoucher No.'] = this.inspector[i]['VOUCHER_NO'];

        obj1['Voucher No.'] = this.inspector[i]['FILE_NO'];
        obj1['Road Mileage'] = this.inspector[i]['ROAD_MILEAGE'];
        obj1['Per KM'] = this.inspector[i]['PER_KM'];

        obj1['Transfer Grant'] = this.inspector[i]['TRANSFER_GRANT'];

        obj1['Transfer Grant Amonut'] =
          this.inspector[i]['TRANSFER_GRANT_AMOUNT'];
        obj1['Transfer Incidentals D. A.'] = this.inspector[i]['D_A'];

        obj1['Rupees Per Day'] = this.inspector[i]['RUPEES_PER_DAY'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.inspector.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Date Wise Mode Count Report' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
