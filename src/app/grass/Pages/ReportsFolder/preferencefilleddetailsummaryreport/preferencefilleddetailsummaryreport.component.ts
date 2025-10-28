import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as XLSX from 'xlsx';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-preferencefilleddetailsummaryreport',
  templateUrl: './preferencefilleddetailsummaryreport.component.html',
  styleUrls: ['./preferencefilleddetailsummaryreport.component.css'],
  providers: [DatePipe],
})
export class PreferencefilleddetailsummaryreportComponent {
  formTitle = 'Preference Filled Summary Detailed Report';
  filterClass: string = 'filter-visible';
  searchText: string = '';
  isFilterApplied: any = "'default'";
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'ASC';
  pageSize2 = 10;
  sortKey: string = 'RESIDENCE_TYPE_ID';
  dataList: any[] = [];
  isSpinning = false;
  dateFormat = 'dd/MM/yyyy';
  ResidenceTypelist: any = [];
  GradPay: any = [];
  RESIDENCE_TYPE_IDD: any = [];
  RESIDENCE_TYPE_ID: any;
  GRADE_PAY_LEVEL: any;
  RESIDENCE = '';
  filterquery: string = '';

  MONTH: any;
  YEAR: any;
  RESIDENCE_TYPE: any;
  CAST: any;
  selectmonth: any = new Date();
  selectyear: any = new Date();

  exportLoading: boolean = false;
  filterQuery: any;
  ExcelList: any = [];
  query: any;

  columns: string[][] = [
    ['MONTH', 'Month'],
    ['YEAR', 'Year'],
    ['RESIDENCE_TYPE_NAME', 'Residence Type'],
    ['DESIGNATION', 'Designation'],
    ['GRADE_PAY_LEVEL', 'Grade Pay Level'],
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    // ['JOINING_DATE', 'Joining Date'],
    // ['RETIREMENT_DATE', 'Reitirement Date'],
    // ['DOB ', 'Date Of Birth'],
  ];
  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private _exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.selectmonth = new Date();
    this.selectyear = new Date();
    this.applyFilter();
    this.getResidenceTypestart();
    this.getAllGradPay();
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
      (err) => {}
    );
  }

  getAllGradPay() {
    this.isSpinning = true;
    this.api.getAllGradPayLevel(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.GradPay = data['data'];
          this.search();
          this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  showlabel = false;
  changecast(event: any) {
    if (event == 'GN') {
      this.showlabel = false;
    } else {
      this.showlabel = true;
    }
  }

  keyup(event: any) {
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'RESIDENCE_TYPE_ID';
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
        .getpreferenceFilledDetail(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + this.filterQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              if (this.dataList.length > 0) {
                for (let i = 0; i < this.dataList.length; i++) {
                  this.dataList[i]['PREFERENCES'] = JSON.parse(
                    this.dataList[i]['PREFERENCES']
                  );
                  this.dataList[i]['PREFERENCES'] = this.dataList[i][
                    'PREFERENCES'
                  ].sort(function (a, b) {
                    return a.PREFERENCE_NO - b.PREFERENCE_NO;
                  });
                }
              }
            } else {
              this.dataList = [];
            }
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (error) => {}
        );
    } else {
      this.api
        .getpreferenceFilledDetail(
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

  onChangemonth(result: any) {}
  onChangeyear(event: any) {}

  applyFilter() {
    this.loadingRecords = true;

    if (
      this.selectmonth == undefined &&
      this.selectyear == undefined &&
      this.RESIDENCE_TYPE_ID == undefined &&
      this.GRADE_PAY_LEVEL == undefined &&
      this.CAST == undefined
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
        this.isFilterApplied = 'primary';
      }

      if (this.selectyear != undefined) {
        const formattedYear = this.datepipe.transform(this.selectyear, 'yyyy');
        this.filterQuery += " AND YEAR = '" + formattedYear + "'";
        this.isFilterApplied = 'primar';
      }

      if (this.RESIDENCE_TYPE_ID != undefined) {
        this.filterQuery +=
          ' AND RESIDENCE_TYPE_ID IN ( ' + this.RESIDENCE_TYPE_ID + ')';
        this.isFilterApplied = 'primary';
      }

      if (this.GRADE_PAY_LEVEL != undefined) {
        this.filterQuery +=
          " AND GRADE_PAY_LEVEL ='" + this.GRADE_PAY_LEVEL + "'";
        this.isFilterApplied = 'primary';
      }

      if (this.CAST != undefined) {
        this.filterQuery += " AND CAST = '" + this.CAST + "'";
        this.isFilterApplied = 'primary';
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
    this.GRADE_PAY_LEVEL = null;
    this.CAST = null;
    this.filterQuery = '';
    this.applyFilter();
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
  }

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1: any = [];
    if (this.ExcelList.length > 0) {
      for (var i = 0; i < this.ExcelList.length; i++) {
        var obj1: any = new Object();
        obj1['Name'] = this.ExcelList[i]['EMPLOYEE_NAME'];
        obj1['Residence Type'] = this.ExcelList[i]['RESIDENCE_TYPE_NAME'];
        // obj1['Preference'] = this.ExcelList[i]['FLAT_NAME'];
        obj1['Date Of Birth'] =
          this.ExcelList[i]['DOB'] != null
            ? this.datepipe.transform(this.ExcelList[i]['DOB'], 'dd/MM/yyyy')
            : this.ExcelList[i]['DOB'];
        if (this.ExcelList[i]['CAST'] == 'GN') {
          obj1['Caste'] = 'General';
        } else if (this.ExcelList[i]['CAST'] == 'SC') {
          obj1['Caste'] = 'Scheduled Caste';
        } else if (this.ExcelList[i]['CAST'] == 'ST') {
          obj1['Caste'] = 'Scheduled Tribes';
        }
        obj1['Date Of Priority'] =
          this.ExcelList[i]['DATE_OF_PRIORITY'] != null
            ? this.datepipe.transform(
                this.ExcelList[i]['DATE_OF_PRIORITY'],
                'dd/MM/yyyy'
              )
            : this.ExcelList[i]['DATE_OF_PRIORITY'];
        obj1['Grade Pay Level'] = this.ExcelList[i]['GRADE_PAY_LEVEL'];
        obj1['Date Of Retirement'] =
          this.ExcelList[i]['RETIREMENT_DATE'] != null
            ? this.datepipe.transform(
                this.ExcelList[i]['RETIREMENT_DATE'],
                'dd/MM/yyyy'
              )
            : this.ExcelList[i]['RETIREMENT_DATE'];
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
        var c = JSON.parse(this.ExcelList[i]['PREFERENCES']);

        for (let j = 0; j < c.length; j++) {
          obj1['Preference' + (j + 1)] = c[j]['FLAT_NAME'];
          if (j + 1 == c.length) {
            arry1.push(Object.assign({}, obj1));
          }
        }

        if (i == this.ExcelList.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Preference Filled Summary Detailed Report' +
              this.datepipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
