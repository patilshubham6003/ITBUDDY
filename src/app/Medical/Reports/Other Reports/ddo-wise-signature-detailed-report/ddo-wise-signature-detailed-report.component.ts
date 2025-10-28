import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-ddo-wise-signature-detailed-report',
  templateUrl: './ddo-wise-signature-detailed-report.component.html',
  styleUrls: ['./ddo-wise-signature-detailed-report.component.css'],
})
export class DdoWiseSignatureDetailedReportComponent {
  formTitle = ' DDO Wise Signature Detailed Report';
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
    ['DDO_HEAD_OF_OFFICE', ' DDO Of The Official'],
    ['NAME', ' Name'],
    ['NAME_HN', 'Name In Hindi'],
    ['OFFICE_NAME', 'Office Name'],
    ['OFFICE_NAME_HN', ' Office Name In Hindi'],
    ['POST', 'Post'],
    ['POST_HN', 'Post In Hindi'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  DDO_OF_THE_OFFICIAL_ID: any;
  TYPE_OF_CLAIM: any;
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
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    if (
      this.DDO_OF_THE_OFFICIAL_ID != null &&
      this.DDO_OF_THE_OFFICIAL_ID != undefined &&
      this.DDO_OF_THE_OFFICIAL_ID != ''
    ) {
      this.filterQuery = '';
      this.filterQuery = ' AND DDO_ID = ' + this.DDO_OF_THE_OFFICIAL_ID;
    } else {
      this.filterQuery = '';
      this.message.error('Select Any Filter Value', '');
    }

    if (this.filterQuery) {
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DDO_OF_THE_OFFICIAL_ID = 0;
    this.dataList = [];
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

    // if (this.searchText != '') {
    //   likeQuery = " AND INSPECTOR_NAME like '%" + this.searchText + "%'";
    // }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }
    // if (this.userId == 1) {
    //   this.extraFilterQuery = '';
    // } else {
    //   this.extraFilterQuery = 'AND INSPECTOR_ID = ' + this.userId;
    // }
    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .getSignature(
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
        .getSignature(0, 0, this.sortKey, sort, this.filterQuery + likeQuery)
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
        obj1['DDO Of The Official'] = this.inspector[i]['DDO_HEAD_OF_OFFICE'];
        obj1['Name'] = this.inspector[i]['NAME'];
        obj1['Name In Hindi'] = this.inspector[i]['NAME_HN'];
        obj1['Office Name'] = this.inspector[i]['OFFICE_NAME'];
        obj1['Office Name In Hindi'] = this.inspector[i]['OFFICE_NAME_HN'];
        obj1['Post '] = this.inspector[i]['POST'];
        obj1['Post In Hindi'] = this.inspector[i]['POST_HN'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.inspector.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'DDO Wise Signature Detailed Report' +
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
