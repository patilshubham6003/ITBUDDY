import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';
import { ExportService } from 'src/app/Service/export.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-preference-filled-summary-report',
  templateUrl: './preference-filled-summary-report.component.html',
  styleUrls: ['./preference-filled-summary-report.component.css'],
  providers: [DatePipe],
})
export class PreferenceFilledSummaryReportComponent {
  formTitle = 'Preference Filled Summary';
  filterClass: string = 'filter-visible';
  searchText: string = '';
  isFilterApplied: any = "'default'";
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'ASC';
  pageSize2 = 10;
  sortKey: string = 'id';
  dataList: any[] = [];
  isSpinning = false;
  dateFormat = 'dd/MM/yyyy';
  ResidenceTypelist: any = [];
  RESIDENCE_TYPE_IDD: any = [];
  RESIDENCE_TYPE_ID: any;

  RESIDENCE = '';
  filterquery: string = '';

  MONTH: any;
  YEAR: any;
  RESIDENCE_TYPE: any;
  selectmonth: any = new Date();
  selectyear: any = new Date();

  exportLoading: boolean = false;
  filterQuery: any;
  ExcelList: any = [];
  query: any;

  columns: string[][] = [['RESIDENCE_TYPE_NAME', 'Residence Type']];
  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private _exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.selectmonth = new Date();
    this.selectyear = new Date();
    this.applyFilter();
    this.getResidenceTypestart();
  }

  keyup(event: any) {
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
    }
    var sort: string;
    this.loadingRecords = true;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    var filter = '';
    if (likeQuery) filter = this.filterQuery + likeQuery;
    else filter = this.filterQuery;
    this.query = likeQuery;

    if (exportInExcel == false) {
      this.api
        .getpreferenceFilledSummary(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              this.dataList = data['data'];
            } else {
              // this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => { }
        );
    } else {
      this.api
        .getpreferenceFilledSummary(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.ExcelList = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  // fileName = 'Preference Filled Summary  Report';

  // exportexcel(): void {
  //   let element = document.getElementById('data_List');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   XLSX.writeFile(wb, this.fileName);
  // }

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.ExcelList.length > 0) {
      for (var i = 0; i < this.ExcelList.length; i++) {
        obj1['Residence Type'] = this.ExcelList[i]['RESIDENCE_TYPE_NAME'];
        if (this.ExcelList[i]['MONTH'] == '01') {
          obj1['Month'] = 'January';
        } else if (this.ExcelList[i]['MONTH'] == '02') {
          obj1['Month'] = 'February';
        } else if (this.ExcelList[i]['MONTH'] == '03') {
          obj1['Month'] = 'March';
        } else if (this.ExcelList[i]['MONTH'] == '04') {
          obj1['Month'] = 'April';
        } else if (this.ExcelList[i]['MONTH'] == '05') {
          obj1['Month'] = 'May';
        } else if (this.ExcelList[i]['MONTH'] == '06') {
          obj1['Month'] = 'June';
        } else if (this.ExcelList[i]['MONTH'] == '07') {
          obj1['Month'] = 'July';
        } else if (this.ExcelList[i]['MONTH'] == '08') {
          obj1['Month'] = 'August';
        } else if (this.ExcelList[i]['MONTH'] == '09') {
          obj1['Month'] = 'September';
        } else if (this.ExcelList[i]['MONTH'] == '10') {
          obj1['Month'] = 'October';
        } else if (this.ExcelList[i]['MONTH'] == '11') {
          obj1['Month'] = 'November';
        } else if (this.ExcelList[i]['MONTH'] == '12') {
          obj1['Month'] = 'December';
        }
        obj1['Year'] = this.ExcelList[i]['YEAR'];
        obj1['Count'] = this.ExcelList[i]['COUNT'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.ExcelList.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Preference Filled Summary  Report' +
            this.datepipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }

  onChangemonth(result: any) { }
  onChangeyear(event: any) { }

  applyFilter() {
    this.loadingRecords = true;

    if (
      (this.selectmonth == undefined || this.selectmonth == null) &&
      (this.selectyear == undefined || this.selectyear == null) &&
      (this.RESIDENCE_TYPE_ID == undefined || this.RESIDENCE_TYPE_ID == null)
    ) {
      this.message.error('', 'Please Select Any Filter Value');
      this.filterClass = 'filter-visible';
    } else {
      let sort: string;
      try {
        sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      this.filterQuery = '';

      if (this.selectmonth != undefined) {
        const formattedMonth = this.datepipe.transform(this.selectmonth, 'MM');
        this.filterQuery += " AND MONTH = '" + formattedMonth + "'";
      }

      if (this.selectyear != undefined) {
        const formattedYear = this.datepipe.transform(this.selectyear, 'yyyy');
        this.filterQuery += " AND YEAR = '" + formattedYear + "'";
      }

      if (this.RESIDENCE_TYPE_ID != undefined) {
        this.filterQuery +=
          ' AND RESIDENCE_TYPE_ID IN ( ' + this.RESIDENCE_TYPE_ID + ')';
      }

      if (this.filterQuery !== '') {
        this.isFilterApplied = 'primary';
        this.filterClass = 'filter-invisible';
        this.search(true);
      }
      this.loadingRecords = false;
    }
  }

  clearFilter() {
    this.selectmonth = new Date();
    this.selectyear = new Date();
    this.RESIDENCE_TYPE_ID = null;
    this.filterQuery = '';
    this.applyFilter();
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }

  getResidenceTypestart() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceTypelist = data['data'];
          this.search();
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'MONTH';
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
}
