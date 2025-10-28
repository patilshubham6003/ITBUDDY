import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-feedbackmaster',
  templateUrl: './feedbackmaster.component.html',
  styleUrls: ['./feedbackmaster.component.css']
})
export class FeedbackmasterComponent {
  formTitle: any;
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

  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['EMAIL_ID', 'Email'],
    ['MOBILE_NO', 'Mobile No'],
  ];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}
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


    var fil = " AND STATUS =1 AND FEEDBACK_STATUS  = '" + this.VERIFIED_STATUS + "'";

    this.api
      .feedbackmasterget(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + fil
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          // if (
          //   data['count'] == null ||
          //   data['count'] == 0
          // ) {
          //   this.approvedCount = 0;
          // } else {
          //   this.approvedCount = data['count'];
          // }

          if (
            data['PENDDING'] == null ||
            data['PENDDING'] == 0
          ) {
            this.pendingCount = 0;
          } else {
            this.pendingCount = data['PENDDING'];
          }

          if (
             data['REVIEW'] == null ||
             data['REVIEW'] == 0
          ) {
            this.rejectedCount = 0;
          } else {
            this.rejectedCount =  data['REVIEW'];
          }
          this.loadingRecords = false;
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
    this.REMARK = '';
  }
  openmodell: boolean = false;
  approverejectdata(data: any, status: any) {
    this.openmodell = true;
    this.verifydata = data;
    this.verifystatus = status;
  }
  loadsendto: boolean = false;

  verify(data: any, status: any) {
    if (
      
      (this.REMARK == null || this.REMARK == undefined || this.REMARK == '')
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadingRecords = true;
      // var dataaa: any = {
      //   FEEDBACK_STATUS : status,
      //   REMARK: this.REMARK,
      //   CLIENT_ID: 1,
      //   ID: data.ID,
      // };
     if(status == 'D'){
      data.STATUS=false
     }
      data.FEEDBACK_STATUS = status
      data.REMARK = this.REMARK
      data.RESOLVER_ID = sessionStorage.getItem('userId')

      this.api.feedbackupdate(data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          if (status == 'RE') {
            this.message.success(' Information Reviewed Successfully...', '');
          } else {
            this.message.success(' Information Deleted Successfully...', '');
          }
          this.search();
          this.loadingRecords = false;
          this.openmodell = false;
          this.verifydata = '';
          this.verifystatus = '';
          this.REMARK = '';
        } else if (successCode['code'] == '300') {
          this.loadingRecords = false;
          this.message.error(successCode['message'], '');
        } else {
          this.message.error(' Failed To Update Information...', '');
          this.loadingRecords = false;
        }
      });
    }
  }

  viewidproof(event: any) {
    if (event) window.open(this.api.retrieveimgUrl + 'feedbackAttchment/' + event);
  }
  viewipayslip(event: any) {
    if (event) window.open(this.api.retrieveimgUrl + 'paySlips/' + event);
  }
}
