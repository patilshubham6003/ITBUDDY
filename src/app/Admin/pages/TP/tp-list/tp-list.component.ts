import { Component, HostListener, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { startOfMonth, endOfMonth } from 'date-fns';
import { ExportService } from 'src/app/Service/export.service';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
import { EmpTransferDataForEdit } from 'src/app/Modal/employeeQuarterForm';

@Component({
  selector: 'app-tp-list',
  templateUrl: './tp-list.component.html',
  styleUrls: ['./tp-list.component.css'],
  providers: [DatePipe],
})
export class TpListComponent {
  formTitle = 'Request  Representation Module for Transfers & Postings ';
  drawerTitle: any;
  drawerVisible = false;
  drawerData: any = [];
  GLOBAL_TABLE_CARD: string = 'T';
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    console.log(event);
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  currentYear: any;
  nextYear: any;
  REASON_FOR_TRANSFER: any = '';

  constructor(
    private datePipe: DatePipe,
    private exportService: ExportService,
    public router: Router,
    private api: WebsiteService,
    private message: NzNotificationService // private modal: NzModalService
  ) {}
  ngOnInit() {
    this.getScreenSize(event);
    this.value1 = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datePipe.transform(new Date(), 'yyyy-MM-31');
    const todayss: any = new Date();
    this.currentYear = todayss.getFullYear();
    this.nextYear = (todayss.getFullYear() + 1).toString().slice(-2);
    // this.search(true);
    // this.getOffice();
    // this.getranks();
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
    this.totalrecords();
  }
  appdate: any = [];
  cricular_viewIcard1(item: any) {
    const fileUrl = appkeys.retriveimgUrl + 'representModuleTP/' + item;
    window.open(fileUrl);
  }
  RANKID: any;
  ranklist: any = [];
  ranklisttt: any = [];
  getranks() {
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS = 1 AND ID NOT IN (51,52,27,18)'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ranklist = data['data'];
              this.ranklisttt = data['data'];
            } else {
              this.ranklist = [];
            }
          } else {
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  Offices: any = [];
  getOffice() {
    this.api
      .getAllOfficeForTransfer(0, 0, 'ID', 'desc', ' AND STATUS=1')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Offices = data['data'];
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showddetails: boolean = false;

  scrHeight: any;
  scrWidth: any;
  pageIndex: any = 1;
  pageSize: any = 10;
  totalRecords: any = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['CADRE', 'CADRE'],
    ['NAME', 'NAME'],
    ['BUILDING_1', 'BUILDING_1'],
    ['CHARGE_1', 'CHARGE_1'],
    ['BUILDING_2', 'BUILDING_2'],
    ['BUILDING_3', 'BUILDING_3'],
    ['CHARGE_2', 'CHARGE_2'],
    ['CHARGE_3', 'CHARGE_3'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['APPLICATION_NO', 'APPLICATION_NO'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NO', 'MOBILE_NO'],
  ];

  drawerClose(): void {
    this.drawerVisible = false;
    this.search(true);
  }
  // showdash() {
  //   this.router.navigateByUrl('/report/report-view');
  // }
  Dwidth = '50%';
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // edit(data: EmpTransferDataForEdit): void {
  //   this.drawerTitle = 'Update Transfer Details';
  //   this.drawerData = Object.assign({}, data);
  //   this.drawerVisible = true;
  // }

  ranges = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
  };
  addnew: boolean = false;
  statustype = '';
  selectedDate: any = [];
  TOTAL = 0;
  PENDING = 0;
  APPROVED = 0;
  REJECTED = 0;

  OFFICE_ID_transfer: any = [];
  TO_OFFICE_ID: any = [];
  RANK_ID_transfer: any;
  filterQuery2 = '';
  filterQuery1 = '';
  filterQuery3 = '';

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  keyup() {
    this.search(true);
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.dataList = [];
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';

      this.columns.forEach((column, i) => {
        if (this.columns.length == i + 1) {
          likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
        } else {
          likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
        }
      });
    }
    // if (
    //   this.statustype !== null &&
    //   this.statustype !== undefined &&
    //   this.statustype !== ''
    // ) {
    //   likeQuery += ' AND REQ_STATUS = ' + "'" + this.statustype + "'";
    // }

    this.filterQuery = '';

    if (this.appdate == undefined || this.appdate.length == 0) {
      this.filterQuery = '';
    } else {
      this.filterQuery =
        " AND (APPLICATION_DATE BETWEEN '" +
        this.datePipe.transform(this.appdate[0], 'yyyy-MM-dd') +
        ' ' +
        '00:00:00' +
        "' AND '" +
        this.datePipe.transform(this.appdate[1], 'yyyy-MM-dd') +
        ' ' +
        '23:59:59' +
        "')";
    }

    likeQuery = likeQuery + this.filterQuery;
    this.loadingRecords = true;
    this.api
      .getalltpreqlist(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else {
            this.loadingRecords = false;
            this.totalRecords = [];
            this.dataList = [];
            this.message.error('Server Not Found', '');
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.totalRecords = [];
          this.dataList = [];
          this.message.error('Server Not Found', '');
          console.log(err);
        }
      );
  }

  totalRecords1;
  totalrecords() {
    this.api.getalltpreqlist(0, 0, '', '', '').subscribe(
      (data) => {
        this.loadingRecords = false;
        this.totalRecords1 = data['count'];
      },
      (err) => {
        this.loadingRecords = false;
        console.log(err);
      }
    );
  }
  exportLoadingtransfer = false;
  loadexcel: boolean = false;
  dataList1: any = [];
  convertInExcel() {
    this.loadexcel = true;
    this.api.getalltpreqlist(0, 0, 'ID', 'desc', '').subscribe(
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
                obj1['Application Date'] =
                  this.dataList1[i]['APPLICATION_DATE'] != null
                    ? this.datePipe.transform(
                        this.dataList1[i]['APPLICATION_DATE'],
                        'dd/MMM/yyyy'
                      )
                    : this.dataList1[i]['APPLICATION_DATE'];
                obj1['Name'] = this.dataList1[i]['NAME']
                  ? this.dataList1[i]['NAME']
                  : '-';
                obj1['Application No.'] = this.dataList1[i]['APPLICATION_NO']
                  ? this.dataList1[i]['APPLICATION_NO']
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
                obj1['Current Posting'] = this.dataList1[i]['CURRENT_POSTING']
                  ? this.dataList1[i]['CURRENT_POSTING']
                  : '-';
                obj1['Cadre'] = this.dataList1[i]['CADRE']
                  ? this.dataList1[i]['CADRE']
                  : '-';

                obj1['Period Spent In Current Office'] =
                  this.dataList1[i]['TENURE_CURRENT_POSTING_YR'] &&
                  this.dataList1[i]['TENURE_CURRENT_POSTING_MNT']
                    ? this.datePipe.transform(
                        this.dataList1[i]['TENURE_CURRENT_POSTING_YR'],
                        'dd/MMM/yyyy'
                      ) +
                      ' - ' +
                      this.datePipe.transform(
                        this.dataList1[i]['TENURE_CURRENT_POSTING_MNT'],
                        'dd/MMM/yyyy'
                      )
                    : '-';

                obj1['Current Residential Address'] = this.dataList1[i][
                  'CURRENT_RESIDENT_ADD'
                ]
                  ? this.dataList1[i]['CURRENT_RESIDENT_ADD']
                  : '-';
                obj1[' Buiding 1'] = this.dataList1[i]['BUILDING_1']
                  ? this.dataList1[i]['BUILDING_1']
                  : '-';
                obj1[' Buiding 2'] = this.dataList1[i]['BUILDING_2']
                  ? this.dataList1[i]['BUILDING_2']
                  : '-';
                obj1[' Buiding 3'] = this.dataList1[i]['BUILDING_3']
                  ? this.dataList1[i]['BUILDING_3']
                  : '-';

                obj1[' Charge 1'] = this.dataList1[i]['CHARGE_1']
                  ? this.dataList1[i]['CHARGE_1']
                  : '-';
                obj1[' Charge 2'] = this.dataList1[i]['CHARGE_2']
                  ? this.dataList1[i]['CHARGE_2']
                  : '-';
                obj1[' Charge 3'] = this.dataList1[i]['CHARGE_3']
                  ? this.dataList1[i]['CHARGE_3']
                  : '-';

                obj1['Primary Reason for request of transfer'] = this.dataList1[
                  i
                ]['REASON_FOR_REQUEST']
                  ? this.dataList1[i]['REASON_FOR_REQUEST']
                  : '-';
                obj1['Request'] = this.dataList1[i]['REQUEST']
                  ? this.dataList1[i]['REQUEST']
                  : '-';

                obj1['Attachment'] = this.dataList1[i]['ATTACHMENT']
                  ? `=HYPERLINK("${appkeys.retriveimgUrl}representModuleTP/${this.dataList1[i]['ATTACHMENT']}", "Download")`
                  : '-';
                arry1.push(Object.assign({}, obj1));
                if (i == this.dataList1.length - 1) {
                  this.exportService.exportExcel1(
                    arry1,
                    'Representation Module for Transfers & Postings ' +
                      this.datePipe.transform(
                        new Date(),
                        'dd/MMM/yyyy HH:mm:ss'
                      )
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

  applyFilter() {
    this.pageIndex = 1;
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.showddetails = true;
    this.search(true);
  }

  apply_Filter(a: any) {
    this.pageIndex = 1;
    this.statustype = a;
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.search(true);
  }

  showfile(file: any) {
    const fileUrl = appkeys.retriveimgUrl + 'transferReqFiles/' + file;
    window.open(fileUrl);
  }

  clearFilter() {
    this.pageIndex = 1;
    this.statustype = '';

    this.appdate = [];

    this.showddetails = false;

    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
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
    this.search(false);
  }

  confirmModal?: NzModalRef;
  value1: any = '';
  value2: any = '';

  changeDate(value) {
    this.value1 = this.datePipe.transform(value[0], 'yyyy-MM-dd');
    this.value2 = this.datePipe.transform(value[1], 'yyyy-MM-dd');
  }

  REQ_STATUS = 'A';

  isConfirmLoading = false;
  DisaplyModel = false;
  isSpinning = false;
  CheckData: any = [];

  cricular_viewIcard() {
    const fileUrl =
      appkeys.retriveimgUrl + 'transferReqFiles/' + this.CheckData.ATTACHMENTS;
    window.open(fileUrl);
  }

  filterClass: string = 'filter-invisible';

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
}
