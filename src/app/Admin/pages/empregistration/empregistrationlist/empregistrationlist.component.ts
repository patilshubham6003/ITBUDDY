import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EmployeeReg } from 'src/app/Modal/empregistration2';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-empregistrationlist',
  templateUrl: './empregistrationlist.component.html',
  styleUrls: ['./empregistrationlist.component.css'],
})
export class EmpregistrationlistComponent {
  formTitle: any='Manage Employee Registration';
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
  drawerData: EmployeeReg = new EmployeeReg();
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['EMAIL_ID', 'Email'],
    ['MOBILE_NO', 'Mobile No'],
  ];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService
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
  add(): void {
    this.drawerTitle = 'Create New Employee';
    this.drawerData = new EmployeeReg();
    this.showEmployeeSearch = true;
    this.isEmailVisible = true;
    this.isEmpCodevisible = true;
    this.drawerVisible = true;
  }
  isEmpCodevisible = true;
  isEmailVisible = true;
  edit(data: EmployeeReg): void {
    this.drawerTitle = 'Update Employee';
    this.drawerData = Object.assign({}, data);
    this.showEmployeeSearch = false;
    this.isEmailVisible = false;
    this.isEmpCodevisible = false;
    this.drawerVisible = true;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.drawerVisible = false;
    this.search();
  }
}
