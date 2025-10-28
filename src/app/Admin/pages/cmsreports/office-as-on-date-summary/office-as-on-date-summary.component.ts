import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ExportService } from 'src/app/Service/export.service';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-office-as-on-date-summary',
  templateUrl: './office-as-on-date-summary.component.html',
  styleUrls: ['./office-as-on-date-summary.component.css'],
  providers: [DatePipe],
})
export class OfficeAsOnDateSummaryComponent {
  formTitle = 'Office Wise Strength Summary';
  fileName = 'Office Wise Strength Summary.xlsx';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-visible';
  loadingRecords = false;
  // SearchData : string = '';
  sortValue: string = 'desc';
  sortKey: string = 'OFFICE_NAME';
  filterQuery: string = '';
  showddetails: boolean = false;

  Ranks: any = [];
  Offices: any = [];

  columns1: string[][] = [['OFFICE_NAME', 'Office Name']];

  searchText: string = '';
  date = null;

  startValue: any;
  endValue: any;
  FROM_JOINING_DATE;
  TO_JOINING_DATE;
  // month = new Date().getMonth().toString() + (new Date().getMonth() + 1).toString()
  // year = new Date().getFullYear()
  // MONTH: any = this.month;
  // MONTH1: any = new Date()
  // YEAR: any = this.year
  // monthFormat = "MMM-yyyy";

  constructor(
    private api: ServiceService,
    private datePipe: DatePipe,
    private _exportService: ExportService,
    private message: NzNotificationService,
    public router: Router
  ) {}

  endOpen = false;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() < this.startValue.getTime() - 1;
  };
  totalrecordes1: any = [];
  // gettotalrecords() {
  //   this.api.getofficeAsOnDateSummary(this.pageIndex, this.pageSize, this.sortKey, '', '', '', '', '')
  //     .subscribe(
  //       (data) => {
  //         this.totalrecordes1 = data['count'];
  //       },
  //       (err) => {

  //       }
  //     );
  // }
  onStartChange(date: Date): void {
    this.startValue = date;
  }
  onEndChange(date: Date): void {
    this.endValue = date;
  }
  showdash() {
    this.router.navigateByUrl('/claim/reportview');
  }
  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }
  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  faqs = [];

  SELECT_ALL1: boolean = false;

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  date1: any;

  ngOnInit() {
    this.date1 = new Date(); // Initialize date1 with the current date
    this.setToFirstDayOfMonth(this.date1);
    this.getOffices();
    // this.search();

    // this.gettotalrecords()
  }

  onChange(selectedDate: Date) {
    this.setToFirstDayOfMonth(selectedDate);
  }

  private setToFirstDayOfMonth(date: Date) {
    date.setDate(1); // Set the date to the 1st day of the month
  }
  filterapply: boolean = false;
  applyFilter() {
    this.pageIndex = 1;

    var sort: string;
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';

    var filter = '';
    filter = this.filterQuery;
    var likeQuery = '';

    this.showddetails = true;
    this.filterapply = true;
    this.search();
    this.isFilterApplied = 'primary';

    var likeQuery = '';

    // if (this.searchText != "") {
    //   likeQuery = " AND (";

    //   this.columns1.forEach(column => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });

    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    // }
    this.search();
  }
  clearFilter() {
    this.pageIndex = 1;

    this.SELECT_ALL1 = false;
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-visible';
    this.showddetails = false;
    this.filterapply = false;
    this.filterQuery = '';
    this.OFFICE_ID = [];
    this.searchText = '';
    this.date1 = new Date();
    this.search();
  }
  RANK_ID: any = [];
  dataList1: any = [];

  dataList: any = [];
  exportLoading: boolean = false;

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  FROM_DATE;
  TO_DATE;
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    this.startValue = this.datePipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datePipe.transform(this.endValue, 'yyyy-MM-dd');
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }


  

    var likeQuery = '';

    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND ';

      this.columns1.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      this.showddetails = true;
    } else {
      this.showddetails = false;
    }

    var dataOffice = '';
    if (
      this.OFFICE_ID != null &&
      this.OFFICE_ID != undefined &&
      this.OFFICE_ID != ''
    ) {
      dataOffice += ' AND RANK_ID IN ' + '(' + this.OFFICE_ID + ')';
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api
        .getofficewisedata(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + dataOffice
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isFilterApplied = 'primary';
          },
          (err) => {}
        );
    } else {
      var totalRecordsss = this.totalRecords;

      this.exportLoading = true;
      this.api
        .getofficewisedata(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + dataOffice
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.dataList1 = data['data'];
              if (this.dataList1.length == 0) {
                this.message.error('Data Not Found', '');
              } else {
                this.convertInExcel();
              }
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'OFFICE_NAME';
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
  DESIGNATION_ID: any = [];
  Designations: any = [];
  getDesignation() {
    this.api.getAllDesignation(0, 0, 'ID', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Designations = data['data'];
        }
      },
      (err) => {}
    );
  }
  OFFICE_ID: any = [];
  // getRanks() {
  //   this.api.getAllRank(0, 0, 'ID', 'desc', '').subscribe(data => {
  //     if (data['code'] == 200) {
  //       this.Ranks = data['data'];
  //     }
  //   }, err => {

  //   });
  // }
  // GetRankData() {
  //   this.api
  //     .getallDesignationForTransfer(
  //       0,
  //       0,
  //       'NAME',
  //       'asc',
  //       ' AND STATUS=1 AND MDB_ID is not NULL '
  //     )
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         if (data['data'].length > 0) {
  //           this.Ranklist = data['data'];
  //           // this.Rank = data['data'][0]['ID'];
  //         } else {
  //           this.Ranklist = [];
  //         }
  //       } else {
  //         this.message.error('Failed To Get Cadre List', '');
  //         this.Ranklist = [];
  //       }
  //     });
  // }
  // getallDesignationForTransfer
  getOffices() {
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Offices = data['data'];
          }
        },
        (err) => {}
      );
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.dataList1.length; i++) {
      obj1['Office Name'] = this.dataList1[i]['OFFICE_NAME'];
      // obj1['Cadre Name'] = this.dataList1[i]['RANK_NAME'];
      obj1['Sanctioned Strength'] = this.dataList1[i]['SANCTION_STRENGTH'];
      obj1['Working Strength'] = this.dataList1[i]['CURRENT_WORKING'];
      obj1['Shortage'] = this.dataList1[i]['SHORTAGE'];
      obj1['Shortage (%)'] = this.dataList1[i]['SHORTAGE_PERCENTAGE'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataList1.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Office Wise Strength Summary"' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
