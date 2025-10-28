import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-otpreport',
  templateUrl: './otpreport.component.html',
  styleUrls: ['./otpreport.component.css'],
  providers: [DatePipe],
})
export class OtpreportComponent {
  dateFormat = 'dd/MM/yyyy';
  formTitle = 'Mobile No / Email OTP Report';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  TYPEE:any=''
  exportToExcelDataList = [];
  loadingRecords = true;
  exportToExcelLoading = false;
  sortKey: string = 'ID';
  sortValue: string = 'desc';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['EMAIL_ID', 'Email Id'],
    ['MOBILE_NO', 'Mobile No.'],
    ['REQUESTED_DATETIME', 'Date'],
    ['OTP', 'OTP'],
  ];
  isSpinning = false;
  loadingFilterEmployees = true;
  filterClass: string = 'filter-visible';
  date: Date[] = [];
  startValue: any = new Date();
  endValue: any = new Date();
  endOpen = false;
  // REQUESTED_DATETIME:Date[]=[];

  constructor(
    private api: ServiceService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private cookie: CookieService
  ) {}

  ngOnInit() {
   
    this.filterClass = 'filter-invisible';
  }

  onKeypressEvent(event: any) {
    const element = window.document.getElementById('searchBtn');
    if (element != null) element.focus();
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
  orgId = this.cookie.get('orgId');
  exportLoading: boolean = false;
  // importInExcel() {
  //   this.search(true, true);
  // }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    this.filterQuery = "";

    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText) {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      // this.filterQuery += likeQuery.substring(0, likeQuery.length - 3) + ')';
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    var dateFilter = '';
    if (this.date != undefined && this.date.length != 0) {
      dateFilter =
        " AND (REQUESTED_DATETIME BETWEEN '" +
        this.datePipe.transform(this.date[0], 'yyyy-MM-dd 00:00:00') +
        "' AND '" +
        this.datePipe.transform(this.date[1], 'yyyy-MM-dd 23:59:59') +
        "')";
      this.isFilterApplied = 'primary';
    }
    
    if(this.TYPEE=='M'){
      this.filterQuery+=" AND MOBILE_NO != ''";

    }
    else if(this.TYPEE=='E'){
      this.filterQuery+=" AND EMAIL_ID != ''";
    }else {
      this.filterQuery+='';
    }



    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.dataList = [];
      this.api
        .getotpdata(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + dateFilter
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.isFilterApplied = 'primary';
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getotpdata(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery + dateFilter
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.exportToExcelDataList = data['data'];
              // this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  keyup() {
    this.search();
  }



  dates: any = [];
  today2 = new Date();


  clearFilter() {
    this.date = [];
    this.TYPEE=''
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.search(true);
  }

  applyFilter() {
    this.loadingRecords = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    console.log(sort);
  
    this.search(true);
    this.filterClass = 'filter-invisible';
  }

  showFilter(): void {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  
}
