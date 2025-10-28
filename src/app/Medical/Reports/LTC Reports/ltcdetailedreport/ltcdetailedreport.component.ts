import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-ltcdetailedreport',
  templateUrl: './ltcdetailedreport.component.html',
  styleUrls: ['./ltcdetailedreport.component.css'],
})
export class LtcdetailedreportComponent implements OnInit {
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
    ['EMPLOYEE_NAME', 'Employee Name'],
    ['DESIGNATION', 'Designation'],
    ['HEADQUARTERS', 'Headquarters'],
    ['INSPECTOR_NAME', 'Inspector Name'],
    ['LEAVE_START_DATE', 'Leave Start Date'],
    ['LEAVE_END_DATE', 'Leave End Date'],
    ['NATURE_OF_LEAVE', 'Nature Of Leave'],
    ['TOTAL_LEAVE', 'Total Leave'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';
  inspectorname: any = [];
  DATE: any = [];
  exportLoading: boolean;
  START_DATE: any;
  END_DATE: any;
  inspectorid: any;
  natureofleaveid: any;
  natureofleave: any[] = [];
  inspector: any[] = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    // private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) { }
  current = new Date();
  ngOnInit(): void {
    this.inspectornamedatTA();
    // this.api.getltcdetailreport(0, 0, '', '', '').subscribe(data => {
    //   
    // });
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
  }
  selectinspectorevent(event) {

    if (event.length == 0) {
      this.inspectorid = null;
    }
  }
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  importInExcel() {
    this.search(false, true);
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
        .getltcdetailreport(
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
          (err) => {

          }
        );
    } else {
      this.exportLoading = false;

      this.api
        .getltcdetailreport(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
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
  }
  isOk = true;
  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    // if()
    // this.search();
    if (
      this.START_DATE != undefined &&
      this.END_DATE == undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select End Date', '');
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE != undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Start Date', '');
    } else if (
      this.START_DATE != undefined &&
      this.END_DATE == undefined &&
      this.inspectorid != undefined &&
      this.natureofleaveid == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select End Date', '');
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE != undefined &&
      this.inspectorid != undefined &&
      this.natureofleaveid == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Start Date', '');
    } else if (
      this.START_DATE != undefined &&
      this.END_DATE == undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid != undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select End Date', '');
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE != undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid != undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Start Date', '');
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE == undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Filter Options', '');
    } else if (
      this.START_DATE != undefined &&
      this.END_DATE != undefined &&
      this.inspectorid != undefined &&
      this.natureofleaveid != undefined
    ) {
      // this.isOk = false
      // this.message.error('Please Select Filter Options', '')
      this.filterQuery =
        ' AND' +
        "((LEAVE_START_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' )" +
        ' OR ' +
        "(LEAVE_END_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' ))" +
        ' AND INSPECTOR_ID in (' +
        this.inspectorid +
        ')' +
        " AND NATURE_OF_LEAVE = '" +
        this.natureofleaveid +
        "'";
    } else if (
      this.START_DATE != undefined &&
      this.END_DATE != undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid == undefined
    ) {
      this.filterQuery =
        ' AND' +
        "((LEAVE_START_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' )" +
        ' OR ' +
        "(LEAVE_END_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' ))";
    } else if (
      this.START_DATE != undefined &&
      this.END_DATE != undefined &&
      this.inspectorid != undefined &&
      this.natureofleaveid == undefined
    ) {
      this.filterQuery =
        ' AND' +
        "((LEAVE_START_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' )" +
        ' OR ' +
        "(LEAVE_END_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' ))" +
        ' AND INSPECTOR_ID in (' +
        this.inspectorid +
        ')';
    } else if (
      this.START_DATE != undefined &&
      this.END_DATE != undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid != undefined
    ) {
      this.filterQuery =
        ' AND' +
        "((LEAVE_START_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' )" +
        ' OR ' +
        "(LEAVE_END_DATE BETWEEN '" +
        this.START_DATE +
        "' AND '" +
        this.END_DATE +
        "' ))" +
        " AND NATURE_OF_LEAVE = '" +
        this.natureofleaveid +
        "'";
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE == undefined &&
      this.inspectorid != undefined &&
      this.natureofleaveid != undefined
    ) {
      this.filterQuery =
        " AND NATURE_OF_LEAVE = '" +
        this.natureofleaveid +
        "'" +
        ' AND INSPECTOR_ID in (' +
        this.inspectorid +
        ')';
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE == undefined &&
      this.inspectorid != undefined &&
      this.natureofleaveid == undefined
    ) {
      this.filterQuery = ' AND INSPECTOR_ID in (' + this.inspectorid + ')';
    } else if (
      this.START_DATE == undefined &&
      this.END_DATE == undefined &&
      this.inspectorid == undefined &&
      this.natureofleaveid != undefined
    ) {
      this.filterQuery =
        " AND NATURE_OF_LEAVE = '" + this.natureofleaveid + "'";
    }
    if (this.isOk) {
      this.search(true);
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    // this.DATE = []
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    // this.STAGE_NAME=[]
    this.inspectorid = null;
    this.natureofleaveid = null;
    // this.BENIFICIARY_TYPE=[]
    // this.HOSPITAL_TYPE=[]
    // this.dataList = [];
    this.search(true);
  }
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
    for (var i = 0; i < this.inspector.length; i++) {
      obj1['Employee Name'] = this.inspector[i]['EMPLOYEE_NAME'];
      obj1['Designation'] = this.inspector[i]['DESIGNATION'];
      obj1['Headquarters'] = this.inspector[i]['HEADQUARTERS'];
      obj1['Inspector Name'] = this.inspector[i]['INSPECTOR_NAME'];
      obj1['Leave Start Date'] = this.inspector[i]['LEAVE_START_DATE'];
      obj1['Leave End Date'] = this.inspector[i]['LEAVE_END_DATE'];
      obj1['Nature Of Leave'] = this.inspector[i]['NATURE_OF_LEAVE'];
      obj1['Total Leave'] = this.inspector[i]['TOTAL_LEAVE'];
      arry1.push(Object.assign({}, obj1));
      if (i == this.inspector.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Ltc Detailed Report' +
          this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
  APPL;

  inspectornamedatTA() {
    this.api.getAllUsers(0, 0, '', 'asc', ' AND ROLE_IDS=3').subscribe(
      (data1) => {


        this.inspectorname = data1['data'];
      },

      (err) => {

      }
    );
  }
}
