import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EmployeeMaster } from 'src/app/grass/Models/Employee';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.css'],
})
export class EmployeelistComponent implements OnInit {
  formTitle = 'Employee Master';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'NAME';
  searchText: string = '';
  drawerTitle!: string;
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  userId: any;
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['GRADE_PAY', 'Grade Pay'],
    ['OFFICE_NAME', 'Office Name'],
    ['DESIGNATION', 'Designation'],
    ['LOCATION', 'Location'],
    ['DDO_OF_THE_OFFICIAL', 'DDO Official'],
    ['EMAIL_ID', 'Email ID'],
    ['MOBILE_NO', 'Mobile Number'],
  ];
  drawerVisible: boolean = false;
  drawerData: EmployeeMaster = new EmployeeMaster();
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
  }

  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  keyup(event: any) {
    // this.search();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
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

    this.api
      .getEmployeeMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        (err) => {}
      );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'NAME';
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

  add(): void {
    this.drawerTitle = 'Add New Employee';
    this.drawerData = new EmployeeMaster();

    this.api.getCityMaster(1, 1, '', 'desc', '').subscribe(
      (data) => {
        // if (data['count']==0){
        //   this.drawerData.SEQUENCE_NUMBER=1;
        // }else
        // {
        //   this.drawerData.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
        // }
      },
      (err) => {}
    );
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  claimID: any;
  edit(data: EmployeeMaster): void {
    this.drawerTitle = 'Update Employee Master';
    this.drawerData = Object.assign({}, data);
    // this.api
    //   .getclaimMaster(0, 0, '', '', ' AND EMP_ID =' + data.ID, '', '', '', '')
    //   .subscribe(
    //     (data) => {
    //       var dataList = data['data'];
    //       if (dataList.length >= 1) {
    //         this.claimID = data['data'][0]['ID'];
    //       } else {
    //         this.claimID = 0;
    //       }
    //     },
    //     (err) => {
    //
    //     }
    //   );
    this.drawerVisible = true;
  }

  deleteConfirm(data: any) {
    this.loadingRecords = true;
    var data1 = {
      ID: data.ID,
    };
    this.api.deleteEmployee(data1).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Employee Deleted Successfully...', '');
        this.search();
        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }
  deleteCancel(): void {}
}
