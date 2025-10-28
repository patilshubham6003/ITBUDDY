import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EmployeeReg } from 'src/app/Modal/empregistration2';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-pendinggenralreq',
  templateUrl: './pendinggenralreq.component.html',
  styleUrls: ['./pendinggenralreq.component.css'],
  providers: [DatePipe],
})
export class PendinggenralreqComponent {
  formTitle: any = 'Manage General Verification';
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterClass: string;

  dataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any;
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'Name'],

    ['EMPLOYEE_CODE', 'Employee Code'],
  ];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datepipe: DatePipe
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

  approvedCount: any = 0;
  pendingCount: any = 0;
  rejectedCount: any = 0;
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
    // var fil=' AND APPROVAL_STATUS = '+ this.VERIFIED_STATUS

    var fil = " AND APPROVAL_STATUS = '" + this.VERIFIED_STATUS + "'";
    var filextra = '';
    if (sessionStorage.getItem('roleId') == '54') {
      filextra = ' AND DESIGNATION_ID IN (11,17,44,22,21,20,25,19,12,39,40,16,13,43,23,6,34,41,37,38)'
    }
    this.api
      .getallgenralreq(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + fil + filextra
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataList = data['data'];

          this.api.getallgenralreqcount(0, 0, '', '', '' + filextra).subscribe(
            (forms) => {
              var dataaaaa = forms['data'];
              if (
                forms['data'][0]['APPROVED'] == null ||
                forms['data'][0]['APPROVED'] == 0
              ) {
                this.approvedCount = 0;
              } else {
                this.approvedCount = forms['data'][0]['APPROVED'];
              }

              if (
                forms['data'][0]['PENDING'] == null ||
                forms['data'][0]['PENDING'] == 0
              ) {
                this.pendingCount = 0;
              } else {
                this.pendingCount = forms['data'][0]['PENDING'];
              }

              if (
                forms['data'][0]['REJECT'] == null ||
                forms['data'][0]['REJECT'] == 0
              ) {
                this.rejectedCount = 0;
              } else {
                this.rejectedCount = forms['data'][0]['REJECT'];
              }
              this.loadingRecords = false;
            },
            (err) => {
              // this.isSpinning = false;
            }
          );
        } else {
          this.dataList = [];
          this.message.error('Failed To Get Employees', '');
          this.loadingRecords = false;
        }
      });
  }

  VERIFIED_STATUS: string = 'P';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  showEmployeeSearch: boolean = true;
  isEmpCodevisible = true;
  isEmailVisible = true;

  selectStatus(data: any) {
    this.VERIFIED_STATUS = data;
    this.search();
  }
  REMARK: any;
  verifydata: any;
  verifystatus: any;
  cancel() {
    this.openmodell = false;
    this.viewdataaaa = false;
    this.REMARK = '';
  }
  openmodell: boolean = false;
  oldpostindata: any;
  approverejectdata(data: any, status: any) {
    this.verifydata = data;
    this.verifystatus = status;
    this.openmodell = true;
  }
  loadsendto: boolean = false;

  verify(data: any, status: any) {
    if (
      status == 'R' &&
      (this.REMARK == null || this.REMARK == undefined || this.REMARK == '')
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadingRecords = true;
      this.verifydata.APPROVAL_STATUS = status;
      this.verifydata.ACTION_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.verifydata.ACTION_TAKEN_BY = sessionStorage.getItem('userId');

      this.verifydata.REJECT_REMARK = this.REMARK ? this.REMARK : null;

      this.api.updategenralrequest(this.verifydata).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          if (status == 'A') {
            this.openmodell = false;
            this.message.success(' Information Approved Successfully...', '');
          } else {
            this.message.success(' Information Rejected Successfully...', '');
            this.loadingRecords = false;
            this.openmodell = false;
          }
          this.search();

          this.verifydata = '';
          this.oldpostindata = [];
          this.verifystatus = '';
          this.REMARK = '';
        } else {
          this.message.error(' Failed To Update Information...', '');
          this.loadingRecords = false;
        }
      });
    }
  }

  viewidproof(event: any) {
    if (event)
      window.open(this.api.retrieveimgUrl + 'ithrAddressProof/' + event);
  }
  viewipayslip(event: any) {
    if (event) window.open(this.api.retrieveimgUrl + 'paySlips/' + event);
  }

  viewdataaaa: boolean = false;

  viewdataaaaaaaaaa(data: any) {
    this.verifydata = data;
    this.openmodell = true;
  }
}
