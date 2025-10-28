import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AllotmentMaster } from '../../Models/AllotmentMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from '../../Services/APIService.service';
import * as moment from 'moment';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentCheckList } from '../../Models/AllotmentCheckList';

@Component({
  selector: 'app-deletedapplcationsdetails',
  templateUrl: './deletedapplcationsdetails.component.html',
  styleUrls: ['./deletedapplcationsdetails.component.css'],
  providers: [DatePipe],
})
export class DeletedapplcationsdetailsComponent {
  formTitle = 'Deleted Applications';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  drawerTitle!: string;
  filterQuery: string = '';
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'Name'],
    // ['EMPLOYEE_CODE', 'Employee Code'],

    // ['EMAIL_ID', 'Email ID'],
    // ['MOBILE_NO', 'Mobile Number'],
  ];
  drawerVisible: boolean = false;
  drawerData: AllotmentMaster = new AllotmentMaster();
  employeeID: any;
  userid: any;
  roleid: any;
  isFilterApplied: any = 'primary';
  // isFilterApplied: any = 'default';
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  Status = 'P';
  monthh: any = [];
  MONTH: any;
  YEAR: any;
  RESIDENCE_TYPE_IDD: any = [];
  monthh1: any;
  monthh2: any;
  dateFormat = 'dd/MM/yyyy';

  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datePipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datePipe.transform(this.monthh2, 'yyyy-MM-dd');
    this.employeeID = sessionStorage.getItem('userId');

    // this.getEmployee()
    this.getResidenceTypestart();
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  emp: any = [];
  getEmployee() {
    this.api.getResidence(0, 0, '', '', '').subscribe(
      (data) => {
        this.emp = data['data'];
      },
      (err) => {
        //
      }
    );
  }

  getResidenceTypestart() {
    // this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.emp = data['data'];

          for (var i = 0; i < this.emp.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.emp[i]['TYPE']);
          }

          this.applyFilter();
          // this.isSpinning = false;
        }
      },
      (err) => {}
    );
  }

  applyFilter() {
    if (this.monthh == null) {
      this.message.error('Please Select Month', '');
    } else {
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }

  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.emp.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.emp[i]['TYPE']);
    }

    this.monthh[0] = moment().startOf('month');
    this.monthh[1] = this.monthh[0].clone().endOf('month');
    this.searchText = '';
    this.search(true);
    this.isFilterApplied = 'default';
  }

  RESIDENCE_TYPE_NAME = [];
  keyup(event: any) {
    this.search(true);
  }
  rejectscounts;
  data;
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    var dateFilter = '';
    if (this.monthh != null) {
      dateFilter =
        " AND ( date(APPLICATION_DATETIME ) BETWEEN '" +
        this.datePipe.transform(this.monthh[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.monthh[1], 'yyyy-MM-dd') +
        "')";
    }
    // var statusFilter = "";
    // if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
    //   statusFilter = ' AND STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    // }
    // else if (this.APPROVAL_STATUS == 'ALL') {
    //   statusFilter = " AND STATUS IN ('A','P','R') ";
    // }

    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null
    ) {
      // var filterQuery1 = ;
      this.RESIDENCE_TYPE_IDD.forEach((RESIDENCE_TYPE_IDD) => {
        filterQuery1 +=
          " RESIDENCE_TYPE_NAME like '%" + RESIDENCE_TYPE_IDD + "%' OR";
      });

      filterQuery1 =
        ' AND (' + filterQuery1.substring(0, filterQuery1.length - 2) + ')';
    }

    this.isSpinning = true;
    this.loadingRecords = true;

    this.api
      .getflatrequestrecyclebindata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        // sort,
        sort,
        filterQuery1 + dateFilter + likeQuery
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Get Data.', '');
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
          this.message.error('Failed To Get Data.', '');
        }
      );
  }

  ApplicationStatus: any = '';

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  // currentStage: any;
  // employeedata: any;
  // Checklistdata: any;

  // drawerClose(): void {
  //   this.search();
  //   this.drawerVisible = false;
  // }

  // get closeCallback() {
  //   return this.drawerClose.bind(this);
  // }
  // edit(data: any): void {
  //   this.drawerTitle = 'Applicant: ' + data.EMPLOYEE_NAME;
  //   this.currentStage = 0;
  //   this.employeedata = this.employeeID;
  //   this.drawerData = Object.assign({}, data);
  //   this.Checklistdata = new AllotmentCheckList();
  //   this.drawerVisible = true;
  // }

  // ApproveAction(data: any) { }

  // RejectAction(data: any) { }
  // deletedata: any = []
  // deleteapp: boolean = false;

  // deleteapplication(data: any) {
  //   this.deletedata = null;
  //   this.deletedata = data;
  //   this.deleteapp = true;

  // }
  // canceldelete() {
  //   this.deletedata = null;
  //   this.deleteapp = false;

  // }

  // deletefinal() {

  //   this.isSpinning = true;
  //   this.api.deleteapplicationform(this.deletedata).subscribe((successCode) => {
  //     if (successCode.code == '200') {
  //       this.message.success('Application deleted Successfully...', '');
  //       this.isSpinning = false;
  //       this.deleteapp = false;
  //       this.search();
  //     } else {
  //       this.message.error(' Failed To delete application', '');
  //       this.isSpinning = false;
  //     }
  //   });

  // }
}
