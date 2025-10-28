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

@Component({
  selector: 'app-newtransferreport',
  templateUrl: './newtransferreport.component.html',
  styleUrls: ['./newtransferreport.component.css'],
  providers: [DatePipe],
})
export class NewtransferreportComponent implements OnInit {
  formTitle = 'Request For Transfer In Annual General Transfer ';
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
  rolid: any;
  constructor(
    private datePipe: DatePipe,
    private exportService: ExportService,
    public router: Router,
    private api: WebsiteService,
    private message: NzNotificationService
  ) // private modal: NzModalService
  {}
  ngOnInit() {
    this.rolid = sessionStorage.getItem('roleId');
    this.getScreenSize(event);
    this.value1 = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datePipe.transform(new Date(), 'yyyy-MM-31');
    const todayss: any = new Date();
    this.currentYear = todayss.getFullYear();
    this.nextYear = (todayss.getFullYear() + 1).toString().slice(-2);
    // this.search(true);
    this.getOffice();
    this.getranks();
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
  cricular_viewIcard1(item: any) {
    const fileUrl = appkeys.retriveimgUrl + 'transferReqFiles/' + item;
    window.open(fileUrl);
  }
  RANKID: any;
  ranklist: any = [];
  ranklisttt: any = [];
  getranks() {
    var filteruseris1 = '';
    if (sessionStorage.getItem('roleId') == '55') {
      filteruseris1 = '';
    } else {
      if (sessionStorage.getItem('roleId') == '52') {
        filteruseris1 = ' AND ID IN (51,52,27,18)';
      } else {
        filteruseris1 = ' AND ID NOT IN (51,52,27,18)';
      }
    }
    this.api
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS = 1' + filteruseris1
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
    ['DESIGNATION_NAME', 'DESIGNATION_NAME'],
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['REQ_BUILDING_NAME', 'REQ_BUILDING_NAME'],
    ['REQ_OFFICE_ID', 'REQ_OFFICE_ID'],
    ['REQ_BUILDING_NAME_2', 'REQ_BUILDING_NAME_2'],
    ['REQ_BUILDING_NAME_3', 'REQ_BUILDING_NAME_3'],
    ['REQ_BUILDING_NAME_4', 'REQ_BUILDING_NAME_4'],
    ['REQ_BUILDING_NAME_5', 'REQ_BUILDING_NAME_5'],
    ['REQ_OFFICE_ID_2', 'REQ_OFFICE_ID_2'],
    ['REQ_OFFICE_ID_3', 'REQ_OFFICE_ID_3'],
    ['REQ_OFFICE_ID_4', 'REQ_OFFICE_ID_4'],
    ['REQ_OFFICE_ID_5', 'REQ_OFFICE_ID_5'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['APPLICATION_NO', 'APPLICATION_NO'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['MOBILE_NO', 'MOBILE_NO'],
  ];

  drawerClose(): void {
    this.drawerVisible = false;
    this.search(true);
  }
  showdash() {
    this.router.navigateByUrl('/report/report-view');
  }
  Dwidth = '50%';
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
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
    if (
      this.statustype !== null &&
      this.statustype !== undefined &&
      this.statustype !== ''
    ) {
      likeQuery += ' AND REQ_STATUS = ' + "'" + this.statustype + "'";
    }

    this.filterQuery = '';

    if (this.selectedDate == undefined || this.selectedDate.length == 0) {
      this.filterQuery = '';
    } else {
      this.filterQuery =
        " AND (REQUESTED_DATETIME BETWEEN '" +
        this.value1 +
        ' ' +
        '00:00:00' +
        "' AND '" +
        this.value2 +
        ' ' +
        '23:59:59' +
        "')";
    }
    if (
      this.OFFICE_ID_transfer != undefined &&
      this.OFFICE_ID_transfer != null &&
      this.OFFICE_ID_transfer.length > 0
    ) {
      this.filterQuery1 =
        ' AND CURRENT_OFFICE_ID IN(' + this.OFFICE_ID_transfer + ')';
    } else {
      this.filterQuery1 = '';
    }
    if (
      this.RANK_ID_transfer != undefined &&
      this.RANK_ID_transfer != null &&
      this.RANK_ID_transfer.length > 0
    ) {
      this.filterQuery2 = ' AND RANK_ID1 IN(' + this.RANK_ID_transfer + ')';
    } else {
      this.filterQuery2 = '';
    }
    this.filterQuery3 = '';
    if (
      this.REASON_FOR_TRANSFER != undefined &&
      this.REASON_FOR_TRANSFER != null &&
      this.REASON_FOR_TRANSFER != ''
    ) {
      this.filterQuery3 =
        " AND REASON_FOR_TRANSFER IN('" + this.REASON_FOR_TRANSFER + "')";
    } else {
      this.filterQuery3 = '';
    }

    likeQuery =
      likeQuery +
      this.filterQuery +
      this.filterQuery1 +
      this.filterQuery2 +
      this.filterQuery3;
    this.loadingRecords = true;
    if (sessionStorage.getItem('roleId') == '55') {
      this.api
        .getAlltransferRequestnew(
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
    } else {
      if (sessionStorage.getItem('roleId') == '52') {
        this.api
          .getAlltransferRequestnew(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            likeQuery + ' AND RANK_ID1 IN (51,52,27,18)'
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
      } else {
        this.api
          .getAlltransferRequestnew(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            likeQuery + ' AND RANK_ID1 NOT IN (51,52,27,18)'
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
    }
  }

  totalRecords1;
  totalrecords() {
    if (sessionStorage.getItem('roleId') == '55') {
      this.api.getAlltransferRequestnew(0, 0, '', '', '').subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords1 = data['count'];
        },
        (err) => {
          this.loadingRecords = false;
          console.log(err);
        }
      );
    } else {
      if (sessionStorage.getItem('roleId') == '52') {
        this.api
          .getAlltransferRequestnew(
            0,
            0,
            '',
            '',
            ' AND RANK_ID1 IN (51,52,27,18)'
          )
          .subscribe(
            (data) => {
              this.loadingRecords = false;
              this.totalRecords1 = data['count'];
            },
            (err) => {
              this.loadingRecords = false;
              console.log(err);
            }
          );
      } else {
        this.api
          .getAlltransferRequestnew(
            0,
            0,
            '',
            '',
            ' AND RANK_ID1 NOT IN (51,52,27,18)'
          )
          .subscribe(
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
    }
  }
  exportLoadingtransfer = false;
  loadexcel: boolean = false;
  dataList1: any = [];
  convertInExcel() {
    this.loadexcel = true;
    var filteruseris = '';
    if (sessionStorage.getItem('roleId') == '55') {
      filteruseris = '';
    } else {
      if (sessionStorage.getItem('roleId') == '52') {
        filteruseris = ' AND RANK_ID1 IN (51,52,27,18)';
      } else {
        filteruseris = ' AND RANK_ID1 NOT IN (51,52,27,18)';
      }
    }
    this.api
      .getAlltransferRequestnew(0, 0, 'ID', 'desc', filteruseris)
      .subscribe(
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
                    this.dataList1[i]['REQUESTED_DATETIME'] != null
                      ? this.datePipe.transform(
                          this.dataList1[i]['REQUESTED_DATETIME'],
                          'dd/MMM/yyyy'
                        )
                      : this.dataList1[i]['REQUESTED_DATETIME'];
                  obj1['Name'] = this.dataList1[i]['EMPLOYEE_NAME']
                    ? this.dataList1[i]['EMPLOYEE_NAME']
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
                  obj1['Current Office'] = this.dataList1[i][
                    'CURRENT_OFFICE_NAME'
                  ]
                    ? this.dataList1[i]['CURRENT_OFFICE_NAME']
                    : '-';
                  obj1['Cadre'] = this.dataList1[i]['DESIGNATION_NAME']
                    ? this.dataList1[i]['DESIGNATION_NAME']
                    : '-';
                  obj1['Period Spent In Current Office'] = this.dataList1[i][
                    'SPEND_DAY_IN_OFFICE'
                  ]
                    ? this.dataList1[i]['SPEND_DAY_IN_OFFICE']
                    : '-';
                  obj1['Current Residential Address'] = this.dataList1[i][
                    'ADDRESS'
                  ]
                    ? this.dataList1[i]['ADDRESS']
                    : '-';
                  obj1['Requested Buiding 1'] = this.dataList1[i][
                    'REQ_BUILDING_NAME'
                  ]
                    ? this.dataList1[i]['REQ_BUILDING_NAME']
                    : '-';
                  obj1['Requested Buiding 2'] = this.dataList1[i][
                    'REQ_BUILDING_NAME_2'
                  ]
                    ? this.dataList1[i]['REQ_BUILDING_NAME_2']
                    : '-';
                  obj1['Requested Buiding 3'] = this.dataList1[i][
                    'REQ_BUILDING_NAME_3'
                  ]
                    ? this.dataList1[i]['REQ_BUILDING_NAME_3']
                    : '-';
                  obj1['Requested Buiding 4'] = this.dataList1[i][
                    'REQ_BUILDING_NAME_4'
                  ]
                    ? this.dataList1[i]['REQ_BUILDING_NAME_4']
                    : '-';
                  obj1['Requested Buiding 5'] = this.dataList1[i][
                    'REQ_BUILDING_NAME_5'
                  ]
                    ? this.dataList1[i]['REQ_BUILDING_NAME_5']
                    : '-';
                  obj1['Requested Charge 1'] = this.dataList1[i][
                    'REQ_OFFICE_ID'
                  ]
                    ? this.dataList1[i]['REQ_OFFICE_ID']
                    : '-';
                  obj1['Requested Charge 2'] = this.dataList1[i][
                    'REQ_OFFICE_ID_2'
                  ]
                    ? this.dataList1[i]['REQ_OFFICE_ID_2']
                    : '-';
                  obj1['Requested Charge 3'] = this.dataList1[i][
                    'REQ_OFFICE_ID_3'
                  ]
                    ? this.dataList1[i]['REQ_OFFICE_ID_3']
                    : '-';
                  obj1['Requested Charge 4'] = this.dataList1[i][
                    'REQ_OFFICE_ID_4'
                  ]
                    ? this.dataList1[i]['REQ_OFFICE_ID_4']
                    : '-';
                  obj1['Requested Charge 5'] = this.dataList1[i][
                    'REQ_OFFICE_ID_5'
                  ]
                    ? this.dataList1[i]['REQ_OFFICE_ID_5']
                    : '-';
                  if (this.dataList1[i]['REASON_FOR_TRANSFER'] == 'Medical') {
                    obj1[' Reason Type'] = 'Medical';
                  } else if (
                    this.dataList1[i]['REASON_FOR_TRANSFER'] == 'Other'
                  ) {
                    obj1[' Reason Type'] = 'Other';
                  } else if (
                    this.dataList1[i]['REASON_FOR_TRANSFER'] == 'Retirement'
                  ) {
                    obj1[' Reason Type'] = 'Retirement';
                  } else if (
                    this.dataList1[i]['REASON_FOR_TRANSFER'] == 'Family'
                  ) {
                    obj1[' Reason Type'] = 'Family';
                  } else {
                    obj1[' Reason Type'] = '-';
                  }
                  obj1['Reason For Transfer'] = this.dataList1[i][
                    'SUMMARY_OF_TRANSFER'
                  ]
                    ? this.dataList1[i]['SUMMARY_OF_TRANSFER']
                    : '-';
                  obj1['Date Of APAR Submitted'] =
                    this.dataList1[i]['APAR_DATE'] != null
                      ? this.datePipe.transform(
                          this.dataList1[i]['APAR_DATE'],
                          'dd/MMM/yyyy'
                        )
                      : '-';
                  obj1['Date Of Filling Of IPR For Group A/B'] =
                    this.dataList1[i]['IPR_FILLING_DATE'] != null
                      ? this.datePipe.transform(
                          this.dataList1[i]['IPR_FILLING_DATE'],
                          'dd/MMM/yyyy'
                        )
                      : '-';
                  if (this.rolid == '53') {
                    obj1['Officer Request'] = this.dataList1[i]['HA_REQUEST']
                      ? this.dataList1[i]['HA_REQUEST']
                      : '-';
                    obj1['Officer Request Date'] =
                      this.dataList1[i]['HA_DATE'] != null
                        ? this.datePipe.transform(
                            this.dataList1[i]['HA_DATE'],
                            'dd/MMM/yyyy'
                          )
                        : '-';
                    obj1['Request Remark'] = this.dataList1[i]['HA_REMARK']
                      ? this.dataList1[i]['HA_REMARK']
                      : '-';
                  }
                  obj1['Attachment'] = this.dataList1[i]['ATTACHMENTS']
                    ? `=HYPERLINK("${appkeys.retriveimgUrl}transferReqFiles/${this.dataList1[i]['ATTACHMENTS']}", "Download")`
                    : '-';
                  arry1.push(Object.assign({}, obj1));
                  if (i == this.dataList1.length - 1) {
                    this.exportService.exportExcel1(
                      arry1,
                      'Request For Transfer In Annual General Transfer ' +
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
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
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

  COLUMN_CODE: any[][] = [
    ['REQUESTED_DATETIME', 'Req. Date'],
    ['EMPLOYEE_NAME', 'Name'],
    ['EMAIL_ID', 'Email'],
    ['MOBILE_NO', 'Mobile No.'],
    ['EMPLOYEE_CODE', 'Civil Code'],
    ['DESIGNATION_NAME', 'Current Cadre'],
    ['CURRENT_OFFICE_NAME', 'Current Office'],
    ['REQ_BUILDING_NAME', 'Requested Buiding 1'],
    ['REQ_BUILDING_NAME_2', 'Requested Buiding 2'],
    ['REQ_BUILDING_NAME_3', 'Requested Buiding 3'],
    ['REQ_BUILDING_NAME_4', 'Requested Buiding 4'],
    ['REQ_BUILDING_NAME_5', 'Requested Buiding 5'],
    ['REQ_OFFICE_NAME', 'Requested Charge 1'],
    ['REQ_OFFICE_NAME_2', 'Requested Charge 2'],
    ['REQ_OFFICE_NAME_3', 'Requested Charge 3'],
    ['REQ_OFFICE_NAME_4', 'Requested Charge 4'],
    ['REQ_OFFICE_NAME_5', 'Requested Charge 5'],
    ['REASON_FOR_TRANSFER', 'Reason For Transfer'],
    ['SUMMARY_OF_TRANSFER', 'Summary of Transfer'],
    ['SPEND_DAY_IN_OFFICE', 'Spend Days'],
    ['ATTACHMENTS', 'Attachments'],
  ];

  clearFilter() {
    this.pageIndex = 1;
    this.statustype = '';
    this.filterQuery = '';
    this.filterQuery1 = '';
    this.filterQuery2 = '';
    this.filterQuery3 = '';
    this.OFFICE_ID_transfer = null;
    this.RANK_ID_transfer = null;
    this.REASON_FOR_TRANSFER = null;
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
    this.showddetails = false;
    this.value1 = this.datePipe.transform(new Date(), 'yyyy-MM-01');
    this.value2 = this.datePipe.transform(new Date(), 'yyyy-MM-31');
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
