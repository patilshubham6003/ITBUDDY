import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ExportService } from 'src/app/Service/export.service';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-registration-report',
  templateUrl: './registration-report.component.html',
  styleUrls: ['./registration-report.component.css'],
  providers: [DatePipe],
})
export class RegistrationReportComponent {
  formTitle: any='Employee Registration Completion Report'
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterClass: string = 'filter-invisible';
  dataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  drawerVisible: boolean;
  filterdata=''
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['EMAIL_ID', 'Email'],
    ['MOBILE_NO', 'Mobile No'],
  ];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private exportService: ExportService,
    private datePipe: DatePipe,
  ) { }
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
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
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
    likeQuery +=' AND IS_SIGNED_UP = 1'


    if(this.value1 && this.value2){
      likeQuery +=
      " AND (CREATED_MODIFIED_DATE BETWEEN '" +
      this.value1 +
      ' ' +
      '00:00:00' +
      "' AND '" +
      this.value2 +
      ' ' +
      '23:59:59' +
      "')";
    }

    this.filterdata=likeQuery

    this.api
      .empget(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        } else {
          this.loadingRecords = false;
          this.dataList = [];
          this.message.error('Failed To Get Employees', '');
        }
      });
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  showEmployeeSearch: boolean = true;

  isEmpCodevisible = true;
  isEmailVisible = true;
  value1
  value2
  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }
  selectedDate=''
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  applyFilter() {
    this.pageIndex = 1;
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.search(true);
  }

  clearFilter() {
    this.pageIndex = 1;
    this.selectedDate=''
    this.value1 =''
    this.value2 = ''
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }

  loadexcel:boolean=false
  exportLoadingtransfer:boolean=false
  dataList1:any=[]
  convertInExcel() {
    this.loadexcel = true;
    this.api
      .empget(
        0,
        0,
        'ID',
        'desc',
        this.filterdata
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadexcel = false;
            this.dataList1 = data['data'];

            if (this.dataList1.length > 0) {
              var arry1: any = [];
              var obj1: any = new Object();
              this.loadingRecords = true;
              if (this.dataList1.length > 0) {
                for (var i = 0; i < this.dataList1.length; i++) {
                  
                  obj1['Name'] = this.dataList1[i]['NAME']
                    ? this.dataList1[i]['NAME']
                    : '-';
                 
                  obj1['Employee Code'] = this.dataList1[i]['EMPLOYEE_CODE']
                    ? this.dataList1[i]['EMPLOYEE_CODE']
                    : '-';
                  obj1['Email'] = this.dataList1[i]['EMAIL_ID']
                    ? this.dataList1[i]['EMAIL_ID']
                    : '-';
                  obj1['Mobile No'] = this.dataList1[i]['MOBILE_NO']
                    ? this.dataList1[i]['MOBILE_NO']
                    : '-';
                 
                  
                  arry1.push(Object.assign({}, obj1));
                  if (i == this.dataList1.length - 1) {
                    this.exportService.exportExcel1(
                      arry1,
                      'Employee Registration Completion Report' +
                        this.datePipe.transform(new Date(), 'dd/MMM/yyyy')
                    );
                    this.loadingRecords = false;
                  }
                }
              } else {
                this.message.error('There is a No Data', '');
              }
            } else {
              this.message.error('There is a No Data', '');
            }
          } else {
            this.loadexcel = false;
            this.dataList1 = [];
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
          }
        },
        (err) => {
          this.loadexcel = false;
          this.dataList1 = [];
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          console.log(err);
        }
      );
  }

 
 

  loadbutton: boolean = false;
  
}

