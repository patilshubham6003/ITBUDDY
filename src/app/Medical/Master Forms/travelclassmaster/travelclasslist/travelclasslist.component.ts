import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Travelclass } from 'src/app/Medical/Models/Travelclass';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-travelclasslist',
  templateUrl: './travelclasslist.component.html',
  styleUrls: ['./travelclasslist.component.css'],
})
export class TravelclasslistComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: Travelclass = new Travelclass();
  formTitle = 'Travelclass List';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  screenwidth: any;
  unitWidth = 0;
  columns: string[][] = [
    ['NAME', 'Travel Mode'],
    ['TRAVEL_MODE_NAME', 'Travel Mode'],
    ['STATUS', 'Status'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {}

  keyup(event: any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.api
      .gettravelclass(
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

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add New TravelClass';
    this.drawerData = new Travelclass();

    this.drawerVisible = true;
  }

  edit(data: Travelclass): void {
    this.drawerTitle = 'Update Travel Class Master';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
}
