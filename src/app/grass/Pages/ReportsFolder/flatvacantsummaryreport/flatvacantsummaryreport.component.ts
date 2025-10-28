import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-flatvacantsummaryreport',
  templateUrl: './flatvacantsummaryreport.component.html',
  styleUrls: ['./flatvacantsummaryreport.component.css'],
  providers: [DatePipe],
})
export class FlatvacantsummaryreportComponent {
  formTitle = ' Quarters Vacant Summary ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  RESIDENCE_TYPE_IDD: any = [];
  isSpinning = false;
  ResidenceTypelist: any = [];
  AVAILABLE_STATUS: any = '';
  selectmonth: any = new Date();
  selectyear: any = new Date();
  MONTH: any;
  YEAR: any;

  columns: string[][] = [
    ['ACCEPTANCE', 'ACCEPTANCE'],
    ['AVAILABLE', 'AVAILABLE'],
    ['BOOKED', 'BOOKED'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['TOTAL', 'TOTAL'],
    ['UNDER_MAINTENANCE', 'UNDER_MAINTENANCE'],
  ];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  Monthrange: any = [];

  startdatenow = new Date();

  onChangemonth(event) { }
  onChangeyear(event) { }

  ngOnInit(): void {
    this.getResidenceTypestart();
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
      this.sortKey = 'id';
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ') ';
    }

    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != ''
    ) {
      filterQuery1 = this.RESIDENCE_TYPE_IDD.join(',');
    }

    this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.isSpinning = true;
      this.api
        .getflatvacantsummaryreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery,
          this.MONTH,
          this.YEAR,
          filterQuery1
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinning = false;
              this.loadingRecords = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.loadingRecords = false;
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getflatvacantsummaryreport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery,
          this.MONTH,
          this.YEAR,
          filterQuery1
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = data['data'];
              this.convertInExcel();
              this.loadingRecords = false;
              this.exportLoading = false;
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
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

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        obj1['Residence Type'] = this.dataList11[i]['RESIDENCE_TYPE_NAME'];
        obj1['Total'] = this.dataList11[i]['TOTAL'];
        obj1['Available'] = this.dataList11[i]['AVAILABLE'];
        obj1['Booked'] = this.dataList11[i]['BOOKED'];
        obj1['Under Maintainance'] = this.dataList11[i]['UNDER_MAINTENANCE'];
        obj1['Acceptance'] = this.dataList11[i]['ACCEPTANCE'];

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Quarter Vacant Summary Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
