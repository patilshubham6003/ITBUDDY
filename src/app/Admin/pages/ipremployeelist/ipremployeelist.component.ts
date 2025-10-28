import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServiceService } from 'src/app/Service/service.service';
import { startOfMonth, endOfMonth } from 'date-fns';
import { DatePipe } from '@angular/common';
import { appkeys } from 'src/app/app.constant';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-ipremployeelist',
  templateUrl: './ipremployeelist.component.html',
  styleUrls: ['./ipremployeelist.component.css'],
  providers: [DatePipe],
})
export class IpremployeelistComponent {
  selectedDate: any;
  formTitle: any = 'IPR Employee Forms';
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterClass: string = 'filter-invisible';

  ranges = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
  };
  dataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any;
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['CURRENT_POSTING', 'current posting']
  ];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private exportService: ExportService,
  ) {}
  value2: any;
  value1: any;

  ngOnInit() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate: any = this.datePipe.transform(
      startOfMonth,
      'yyyy-MM-dd'
    );
    const formattedEndDate: any = this.datePipe.transform(
      endOfMonth,
      'yyyy-MM-dd'
    );

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
  }

  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }

  isFilterApplied: any = 'primary';
  applyFilter() {
    this.pageIndex = 1;
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.search(true);
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
  filterQuery: any;
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

    if (this.selectedDate == undefined || this.selectedDate.length == 0) {
      this.filterQuery = '';
    } else {
      this.filterQuery =
        " AND (SUBMITTED_DATE_TIME BETWEEN '" +
        this.value1 +
        ' ' +
        '00:00:00' +
        "' AND '" +
        this.value2 +
        ' ' +
        '23:59:59' +
        "')";
    }
    this.api
      .getIPRdata(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
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
  // add(): void {
  //   this.drawerTitle = 'Create New Employee';
  //   this.drawerData = new EmployeeReg();
  //   this.showEmployeeSearch = true;
  //   this.isEmailVisible = true;
  //   this.isEmpCodevisible = true;
  //   this.drawerVisible = true;
  // }
  isEmpCodevisible = true;
  isEmailVisible = true;
  // edit(data: EmployeeReg): void {
  //   this.drawerTitle = 'Update Employee';
  //   this.drawerData = Object.assign({}, data);
  //   this.showEmployeeSearch = false;
  //   this.isEmailVisible = false;
  //   this.isEmpCodevisible = false;
  //   this.drawerVisible = true;
  // }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.drawerVisible = false;
    this.search();
  }

  clearFilter() {
    this.pageIndex = 1;

    this.selectedDate = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Format the dates using DatePipe
    const formattedStartDate = this.datePipe.transform(
      startOfMonth,
      'yyyy-MM-dd'
    );
    const formattedEndDate = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd');

    // Store the formatted dates in the selectedDate array
    this.selectedDate = [formattedStartDate, formattedEndDate];
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.search(true);
  }

  exportLoadingtransfer = false;
  loadexcel: boolean = false;
  dataList1: any = [];
  convertInExcel() {
    this.loadexcel = true;
    var filteruseris = '';
    // if (sessionStorage.getItem('roleId') == '55') {
    //   filteruseris = '';
    // } else {
    //   if (sessionStorage.getItem('roleId') == '52') {
    //     filteruseris = ' AND RANK_ID1 IN (51,52,27,18)';
    //   } else {
    //     filteruseris = ' AND RANK_ID1 NOT IN (51,52,27,18)';
    //   }
    // }
    this.api.getIPRdata(0, 0, 'ID', 'desc', filteruseris).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.loadexcel = false;
          this.dataList1 = data['data'];
          if (this.dataList1.length > 0) {
            var arry1: any = [];
            var obj1: any = new Object();
            this.exportLoadingtransfer = true;
            if (this.dataList1.length > 0) {
              for (var i = 0; i < this.dataList1.length; i++) {
                obj1['Name'] = this.dataList1[i]['NAME']
                  ? this.dataList1[i]['NAME']
                  : '-';

                obj1['Employee Code'] = this.dataList1[i]['EMPLOYEE_CODE']
                  ? this.dataList1[i]['EMPLOYEE_CODE']
                  : '-';
                obj1['Current designation'] = this.dataList1[i]['CURRENT_POSTING']
                  ? this.dataList1[i]['CURRENT_POSTING']
                  : '-';
                obj1['IPR Submitted Date'] =
                  this.dataList1[i]['SUBMITTED_DATE_TIME'] != null
                    ? this.datePipe.transform(
                        this.dataList1[i]['SUBMITTED_DATE_TIME'],
                        'dd/MMM/yyyy HH:mm'
                      )
                    : this.dataList1[i]['SUBMITTED_DATE_TIME'];

                obj1['Attachment'] = this.dataList1[i]['IPR_SIGNED_COPY']
                  ? `=HYPERLINK("${appkeys.retriveimgUrl}iPRForms/${this.dataList1[i]['IPR_SIGNED_COPY']}", "Download")`
                  : '-';
                arry1.push(Object.assign({}, obj1));
                if (i == this.dataList1.length - 1) {
                  this.exportService.exportExcel1(
                    arry1,
                    'IPR Submitted List ' +
                      this.datePipe.transform(new Date(), 'dd/MMM/yyyy')
                  );
                  this.exportLoadingtransfer = false;
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
        this.message.error('Something went wrong, please try again later', '');
        console.log(err);
      }
    );
  }


  
  downloadPdf(event: string,nameee:any): void {
    const url = this.api.baseUrl + 'iPRForms/' + event;

    // this.api.downloadFile(url).subscribe(
    //   (response) => {
    //     this.saveFile(response, 'downloaded-file.pdf');
    //   },
    //   (error) => {
    //     console.error('Error downloading the file:', error);
    //   }
    // );

    


    this.api.downloadFile(event).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' }); // Adjust MIME type as needed
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download ='IPR Submitted form('+ nameee+').pdf' // Desired file name
        link.click();
        window.URL.revokeObjectURL(link.href); // Free up memory
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  saveFile(data: Blob, filename: string): void {
    const blob = new Blob([data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href); // Free memory
  }

  viewidproof(event:any) {
    if (event) window.open(this.api.retrieveimgUrl + 'iPRForms/' + event);
  }
}
