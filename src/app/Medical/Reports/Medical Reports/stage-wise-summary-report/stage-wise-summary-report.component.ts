import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-stage-wise-summary-report',
  templateUrl: './stage-wise-summary-report.component.html',
  styleUrls: ['./stage-wise-summary-report.component.css']
})
export class StageWiseSummaryReportComponent implements OnInit {

  formTitle = "Day Wise Detailed Summary Report";

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = "desc";
  sortKey: string = "";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: any = "default";

  columns: string[][] = [["TREATMENT_START_DATE", "Date"],
    // ["TOTAL_CLAIMS", "Total Claims"],
    // ["NEW", "New"],
    // ["FORWARDED", "Forwarded"],
    // ["REJECTED", "Rejected"],
    // ["QUERIED", "Queried"],
    // ["APPROVED", "Approved"],
    // ["REDDY_FOR_ZONAL", "Ready For Zonal"]
  ];

  STATUS: any = "AL";
  BRANCH: any = [];

  isSpinning = false;
  filterClass: string = "filter-invisible";

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  BRANCH_ID: any = [];
  SALES_MANAGER_ID: any = [];

  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();

  constructor(private api: ApiService, private datePipe: DatePipe,
    private cookie: CookieService, private _exportService: ExportService, private message: NzNotificationService) { }

  ngOnInit(): void {
    this.DATE[0] = new Date(this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01');
    this.DATE[1] = new Date();
    this.search();
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
    if (this.filterClass === "filter-visible")
      this.filterClass = "filter-invisible";

    else
      this.filterClass = "filter-visible";
  }

  stages: any = [];
  stageName() {
    // this.api.getAllBranch(0, 0, '', 'asc', 'AND STATUS=1').subscribe((data1) => {
    //   
    //   this.stages = data1['data'];
    // },
    //   (err) => {
    //     
    //   }
    // );
  }

  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary'
    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    }
    catch (error) {
      sort = '';
    }

    if (this.SALES_MANAGER_ID != undefined) {
      this.SALES_MANAGER_ID = this.SALES_MANAGER_ID;
    }
    this.DATE[0] = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd')
    this.DATE[1] = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd')

    if (this.DATE[0] != null) {
      this.START_DATE = this.DATE[0]
    }

    if (this.DATE[1] != null) {
      this.END_DATE = this.DATE[1]
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DATE = []
    this.DATE[0] = new Date(this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01');
    this.DATE[1] = new Date();
    this.dataList = [];
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(false, true);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = ""
    if (reset) {
      this.pageIndex = 1;
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    }
    catch (error) {
      sort = "";
    }


    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND (";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")";
    }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], "yyyy-MM-dd");
      this.END_DATE = this.datePipe.transform(this.DATE[1], "yyyy-MM-dd");
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api.dayWiseSummary(this.pageIndex, this.pageSize, this.sortKey, sort, this.filterQuery + likeQuery, this.START_DATE, this.END_DATE).subscribe(
        (data) => {

          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';

        },
        (err) => {

        }
      );
    }
    else {
      this.exportLoading = false;

      this.api.dayWiseSummary(0, 0, this.sortKey, sort, this.filterQuery + likeQuery, this.START_DATE, this.END_DATE).subscribe
        (data => {
          if (data['code'] == 200) {
            this.exportLoading = false;
            this.inspector = data['data'];
            this.convertInExcel();
          }
        },
          err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
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
    const currentSort = sort.find(item => item.value !== null);
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
    for (var i = 0; i < this.inspector.length; i++) {
      obj1['Date'] = this.inspector[i]['TREATMENT_START_DATE'];
      obj1['Total Claims'] = this.inspector[i]['TOTAL_CLAIMS'];
      obj1['New'] = this.inspector[i]['NEW'];
      obj1['Forwarded'] = this.inspector[i]['FORWARDED'];
      obj1['Rejected'] = this.inspector[i]['REJECTED'];
      obj1['Queried'] = this.inspector[i]['QUERIED'];
      obj1['Approved'] = this.inspector[i]['APPROVED'];
      obj1['Ready For Zonal'] = this.inspector[i]['REDDY_FOR_ZONAL'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.inspector.length - 1) {
        this._exportService.exportExcel(arry1, 'Day Wise Detailed Summary Report' + this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
      }
    }
  }
}
