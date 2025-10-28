import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-applicationsummaryreport',
  templateUrl: './applicationsummaryreport.component.html',
  styleUrls: ['./applicationsummaryreport.component.css'],
  providers: [DatePipe],
})
export class ApplicationsummaryreportComponent {
  formTitle = ' Applications Summary ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'MONTH';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  RESIDENCE_TYPE_IDD: any = [];
  isSpinning = false;
  ResidenceTypelist: any = [];
  AVAILABLE_STATUS: any = '';

  columns: string[][] = [
    ['MONTH', 'MONTH'],
    ['YEAR', 'YEAR'],
    ['TOTAL_COUNT', 'TOTAL_COUNT'],
    ['REJECTED_COUNT', 'REJECTED_COUNT'],
    ['APPROVED_COUNT', 'APPROVED_COUNT'],
    ['PENDING_COUNT', 'PENDING_COUNT'],
  ];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  Monthrange: any = [];
  MONTH: any;
  YEAR: any;
  selectmonth: any = new Date();
  selectyear: any = new Date();
  onChangemonth(result: any) { }
  onChangeyear(event: any) { }
  startdatenow = new Date();
  ngOnInit(): void {
    this.search();
    // this.getResidenceTypestart();
  }

  getResidenceTypestart() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
          }
          this.search();
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  keyup(event: any) {
    this.search(true);
  }

  dataList11: any = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'MONTH';
      this.sortValue = 'desc';
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');

    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .getapplicationReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + ' AND MONTH = ' + this.MONTH + ' AND YEAR = ' + this.YEAR
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getapplicationReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + ' AND MONTH = ' + this.MONTH + ' AND YEAR = ' + this.YEAR
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.exportLoading = false;
          }
        );
    }
  }

  exportLoading = false;
  importInExcel() {
    this.search(true, true);
  }

  applyFilter() {
    if (
      this.selectmonth == null ||
      this.selectmonth == undefined ||
      this.selectmonth == ''
    ) {
      this.message.error('Please Select Month', '');
    } else if (
      this.selectyear == null ||
      this.selectyear == undefined ||
      this.selectyear == ''
    ) {
      this.message.error('Please Select Year', '');
    } else {
      this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
      this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }
  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }
    this.selectmonth = new Date();
    this.selectyear = new Date();
    this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');
    this.search(true);
    this.isFilterApplied = 'default';
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
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

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        if (this.dataList11[i]['MONTH'] == '1') {
          obj1['Month'] = 'January';
        } else if (this.dataList11[i]['MONTH'] == '2') {
          obj1['Month'] = 'February';
        } else if (this.dataList11[i]['MONTH'] == '3') {
          obj1['Month'] = 'March';
        } else if (this.dataList11[i]['MONTH'] == '4') {
          obj1['Month'] = 'April';
        } else if (this.dataList11[i]['MONTH'] == '5') {
          obj1['Month'] = 'May';
        } else if (this.dataList11[i]['MONTH'] == '6') {
          obj1['Month'] = 'June';
        } else if (this.dataList11[i]['MONTH'] == '7') {
          obj1['Month'] = 'July';
        } else if (this.dataList11[i]['MONTH'] == '8') {
          obj1['Month'] = 'August';
        } else if (this.dataList11[i]['MONTH'] == '9') {
          obj1['Month'] = 'September';
        } else if (this.dataList11[i]['MONTH'] == '10') {
          obj1['Month'] = 'October';
        } else if (this.dataList11[i]['MONTH'] == '11') {
          obj1['Month'] = 'November';
        } else if (this.dataList11[i]['MONTH'] == '12') {
          obj1['Month'] = 'December';
        }
        obj1['Year'] = this.dataList11[i]['YEAR'];
        obj1['Application Count'] = this.dataList11[i]['TOTAL_COUNT'];
        obj1['Rejected Count'] = this.dataList11[i]['REJECTED_COUNT'];
        obj1['Approved Count'] = this.dataList11[i]['APPROVED_COUNT'];
        obj1['Pending Count'] = this.dataList11[i]['PENDING_COUNT'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Application Summary Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
