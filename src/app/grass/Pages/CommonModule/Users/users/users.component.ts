import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserMaster } from 'src/app/grass/Models/usermaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  formTitle = 'Manage Users';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['ROLE_NAME', 'Role'],
    ['NAME', 'Name'],
    ['EMAIL_ID', 'Email'],
    ['MOBILE_NUMBER', 'Mobile'],
  ];
  // ["PASSWORD", "Password"]

  //drawer Variables
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: UserMaster = new UserMaster();

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.search();
  }
  // Basic Methods
  // sort(sort:any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   this.search(true);
  // }
  keyup(event: any) {
    this.search(true);
  }

  // statusChange(data,$event){

  // }
  statusChange(data: UserMaster, status: boolean) {
    data.IS_ACTIVE = status;
    this.api.updateUser(data).subscribe((successCode) => {
      if (successCode['code'] == 200)
        this.message.success('Status Updated Successfully', '');
      else this.message.error('Failed to Update Status', '');

      this.search(false);
    });
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    // const sortOrder = (currentSort && currentSort.value) || 'asc';

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
      //this.sortKey = "id";
      // this.sortValue = "desc"
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
      .getAllUsers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        (err) => {}
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New User';
    this.drawerData = new UserMaster();
    this.drawerData.IS_ACTIVE = true;
    this.drawerVisible = true;
  }
  edit(data: UserMaster): void {
    this.drawerTitle = 'Update User Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}
