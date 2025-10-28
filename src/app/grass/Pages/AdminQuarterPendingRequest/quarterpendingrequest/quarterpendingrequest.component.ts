import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentCheckList } from 'src/app/grass/Models/AllotmentCheckList';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-quarterpendingrequest',
  templateUrl: './quarterpendingrequest.component.html',
  styleUrls: ['./quarterpendingrequest.component.css'],
  providers: [DatePipe],
})
export class QuarterpendingrequestComponent {
  formTitle = "Applications For Quarters";
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'ID';
  searchText: string = '';
  drawerTitle!: string;
  filterQuery: string = '';
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'Name'],
    ['EMAIL_ID', 'Name'],
    // ['DESIGNATION_SHORT_CODE', 'Name'],
    ['RESIDENCE_TYPE_NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Name']
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
  ) { }

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
    // this.search();
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
            this.RESIDENCE_TYPE_IDD.push(this.emp[i]['ID']);
          }

          this.applyFilter();
          // this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  pendingscounts;
  registercounts;
  approvedcounts;
  deleteedcounts;
  OLDApplicationcounts: any = '';
  NewApplicationcounts: any = '';
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
      this.RESIDENCE_TYPE_IDD.push(this.emp[i]['ID']);
    }
    // this.monthh[0]=new Date()
    // this.monthh[1]=new Date()
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datePipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datePipe.transform(this.monthh2, 'yyyy-MM-dd');
    this.searchText = '';
    this.search(true);
    this.isFilterApplied = 'default';
  }

  changeRadioButton(event) {
    this.Status = event;
    this.search(true);
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
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    } else {
      statusFilter = ` AND STATUS !=''`;

    }

    var filterQuery1 = '';
    if (this.RESIDENCE_TYPE_IDD != undefined && this.RESIDENCE_TYPE_IDD != '' && this.RESIDENCE_TYPE_IDD != null && this.RESIDENCE_TYPE_IDD.length > 0) {
      filterQuery1 = ' AND (';
      this.RESIDENCE_TYPE_IDD.forEach((RESIDENCE_TYPE_IDD) => {
        filterQuery1 += " RESIDENCE_TYPE_ID like '%" + RESIDENCE_TYPE_IDD + "%' OR";
      });
      filterQuery1 = filterQuery1.substring(0, filterQuery1.length - 2) + ')';
    }


    this.loadingRecords = true;

    if (this.roleid == 15) {

      if (this.APPROVAL_STATUS == 'D') {
        this.isSpinning = true;
        this.api
          .getflatrequestrecyclebindata(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            filterQuery1 + dateFilter + likeQuery
          )
          .subscribe(
            (data) => {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              // this.dataList = data['data'];
              if (data['count'] > 0) {
                this.dataList = data['data'].map(item => {
                  return {
                    ...item,
                    RESIDENCE_TYPE_ARRAY: item.RESIDENCE_TYPE_NAME.split(',')
                  };
                });
              } else {
                this.dataList = data['data'];
              }

              this.filterClass = 'filter-invisible';
              this.isFilterApplied = 'primary';

              this.api
                .getCount(0, 0, '', '', filterQuery1 + dateFilter)
                .subscribe(
                  (data) => {
                    this.data = data['data'];
                    this.pendingscounts = data['data'][0]['PENDING'];
                    this.rejectscounts = data['data'][0]['REJECTED'];
                    this.registercounts = data['data'][0]['TOTAL'];
                    this.approvedcounts = data['data'][0]['APPROVED'];
                    this.deleteedcounts = data['data'][0]['DELETED'];
                    this.isSpinning = false;
                  },
                  (err) => {
                    this.isSpinning = false;
                  }
                );
            },
            (err) => {
              this.isSpinning = false;
              this.loadingRecords = false;
            }
          );
        this.isSpinning = false;
      } else {
        this.isSpinning = true;
        this.api
          .getAllotmenmaster(
            this.pageIndex,
            this.pageSize,
            this.sortKey,
            sort,
            filterQuery1 + statusFilter + dateFilter + likeQuery
          )
          .subscribe(
            (data) => {
              this.loadingRecords = false;
              this.totalRecords = data['count'];
              // this.dataList = data['data'];
              if (data['count'] > 0) {
                this.dataList = data['data'].map(item => {
                  return {
                    ...item,
                    RESIDENCE_TYPE_ARRAY: item.RESIDENCE_TYPE_NAME.split(',')
                  };
                });
              } else {
                this.dataList = data['data'];
              }
              this.filterClass = 'filter-invisible';
              this.isFilterApplied = 'primary';

              this.api
                .getCount(0, 0, '', '', filterQuery1 + dateFilter)
                .subscribe(
                  (data) => {
                    this.data = data['data'];
                    this.pendingscounts = data['data'][0]['PENDING'];
                    this.rejectscounts = data['data'][0]['REJECTED'];
                    this.registercounts = data['data'][0]['TOTAL'];
                    this.approvedcounts = data['data'][0]['APPROVED'];
                    this.deleteedcounts = data['data'][0]['DELETED'];
                    this.isSpinning = false;
                  },
                  (err) => {
                    this.isSpinning = false;
                    this.loadingRecords = false;
                  }
                );
            },
            (err) => {
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          );
        this.isSpinning = false;
      }

    } else {
      this.loadingRecords = false;
      this.isSpinning = false;
    }
  }
  APPROVAL_STATUS: any = 'P';
  showcolor0 = 0;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 1;
  showcolor4 = 0;

  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    if (this.APPROVAL_STATUS == 'ALL') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'D') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 1;
    } else {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    }
    this.applyFilter();
  }
  ApplicationStatus: any = '';

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
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

  currentStage: any;
  employeedata: any;
  Checklistdata: any;
  applnformshow(pdfURL: string): void {
    var a: any = this.api.retriveimgUrl + 'applicationForm/' + pdfURL;
    window.open(a)
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  edit(data: any): void {
    this.drawerTitle = 'Quarter Application Of ' + data.EMPLOYEE_NAME + ' For Residence ' + data.RESIDENCE_TYPE_NAME;
    this.currentStage = 0;
    this.employeedata = this.employeeID;
    this.drawerData = Object.assign({}, data);
    this.Checklistdata = new AllotmentCheckList();
    this.drawerVisible = true;
  }

  ApproveAction(data: any) { }

  RejectAction(data: any) { }
  deletedata: any = [];
  deleteapp: boolean = false;
  deleteresidance: any = []
  RESIDENCE_TYPE_IDDDDD: any = []
  confirmshow: boolean = false
  deleteapplication(data: any) {
    var dataaaaa = data
    this.RESIDENCE_TYPE_IDDDDD = []
    this.loadingRecords = true;
    var filterrrr = ' AND STATUS = 1 AND ID in ' + '(' + data.RESIDENCE_TYPE_ID + ')'
    this.api.getResidence1111(0, 0, 'ID', 'asc', filterrrr).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.deleteresidance = data['data'];
          this.deletedata = null;
          this.deletedata = dataaaaa;
          this.deleteapp = true;
          this.loadingRecords = false
        } else {
          this.loadingRecords = false
        }
      },
      (err) => {
        this.loadingRecords = false
      }
    );

  }
  canceldelete() {
    this.deletedata = null;
    this.deleteapp = false;
    this.confirmshow = false;
  }

  deletefinal() {
    this.isSpinning = true;
    var ids = '' + this.RESIDENCE_TYPE_IDDDDD + ''
    var data = {
      RESIDENCE_TYPE_IDS: ids,
      EMPLOYEE_ID: this.deletedata.EMPLOYEE_ID,
      ID: this.deletedata.ID
    }
    this.api.deleteapplicationform(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Application deleted Successfully...', '');
        this.isSpinning = false;
        this.deleteapp = false;
        this.confirmshow = false;
        this.search();
      } else {
        this.message.error(' Failed To delete application', '');
        this.isSpinning = false;
      }
    }, err => {
      this.isSpinning = false;
    });
  }

  deletefinalbefore() {
    if (this.RESIDENCE_TYPE_IDDDDD == null || this.RESIDENCE_TYPE_IDDDDD == '' || this.RESIDENCE_TYPE_IDDDDD == undefined || this.RESIDENCE_TYPE_IDDDDD.length == 0) {
      this.message.error('Please Select Residence Type', '')
    } else {
      this.confirmshow = true
    }
  }
}
