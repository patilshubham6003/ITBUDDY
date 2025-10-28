import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-claim-log-drawer',
  templateUrl: './claim-log-drawer.component.html',
  styleUrls: ['./claim-log-drawer.component.css'],
})
export class ClaimLogDrawerComponent implements OnInit {
  @Input() drawerClose: any = Function;
  @Input() data: any = [];
  dataList: any;
  isSpinning = false;
  pageIndex = 1;
  pageSize2 = 10;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';

  LOG_MASTER: any = [];

  status: boolean = true;

  constructor(private message: NzNotificationService) {}

  ngOnInit() {}

  // sort(params: NzTableQueryParams): void {
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find(item => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'id';
  //   const sortOrder = (currentSort && currentSort.value) || 'desc';

  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.pageSize2 != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize2 = pageSize;
  //   }

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search();
  // }

  sort(sort: any): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    if (this.sortValue == 'descend') {
      this.sortValue = 'desc';
    } else {
      this.sortValue = 'asc';
    }

    this.search(true);
  }
  categoryList = [];

  close(): void {
    this.drawerClose();
  }

  isValidMobile(mobile) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }

  isValidEmail(email) {
    const expression =
      /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    return expression.test(String(email).toLowerCase());
  }

  save(addNew: boolean): void {}
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
  }
}
