import { Component, OnInit, Input } from '@angular/core';
import { ServiceService } from 'src/app/Service/service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Role } from 'src/app/commonModule/role';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.css'],
})
export class RoledetailsComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Role;
  @Input() roleDetailsData: any[] = [];
  @Input() drawerVisible: boolean;
  isSpinning = false;
  pageIndex = 1;
  pageSize = 10;
  pageSize2 = 10;

  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns1: string[] = [
    'PARENT_NAME',
    'NAME',
    'LINK',
    'DESCRIPTION',
    'CREATED_MODIFIED_DATE',
  ];
  columns: string[][] = [
    // ['PARENT_ROLE_NAME','Parent Role Name'],
    ['PARENT_NAME', 'Parent Name'],
    ['NAME', 'Name'],
    ['LINK', 'Link'],
    // ["READ_ONLY","Read Only"],
    ['DESCRIPTION', 'Description'],
    // ["ARCHIVE_FLAG","Archive Flag"],
    ['CREATED_MODIFIED_DATE', ' Date'],
  ];

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.search();
  }

  close(): void {
    this.drawerClose();
  }

  save() {
    this.isSpinning = true;

    this.api
      .addRoleDetails(this.data.ID, this.roleDetailsData)
      .subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Role Details added Successfully', '');
          this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error('Role Details assigning Failed', '');
          this.isSpinning = false;
        }
      });
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    // if(this.pageSize2 != pageSize) {
    //   this.pageIndex = 1;
    //   this.pageSize2 = pageSize;
    // }

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
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    console.log(sort);
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
  }
}
