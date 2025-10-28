import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SignatureMaster } from 'src/app/Medical/Models/SignatureMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { adminsignature } from 'src/app/Modal/adminsignature';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-grass-signature-master-list',
  templateUrl: './grass-signature-master-list.component.html',
  styleUrls: ['./grass-signature-master-list.component.css'],
})
export class GrassSignatureMasterListComponent {
  dataList: any = [];
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
  drawerVisible: boolean = false;
  drawerData: adminsignature = new adminsignature();
  // drawerVisible!: boolean;
  // drawerTitle!: string;
  // drawerData: Signature = new Signature();
  formTitle = ' Signature Master ';
  // dataList: any[] = [];
  // loadingRecords = false;
  // totalRecords = 1;
  // pageIndex = 1;
  // pageSize = 10;
  // sortValue: string = 'desc';
  // sortKey: string = 'id';
  // searchText: string = '';
  // filterQuery: string = '';
  // isFilterApplied: string = 'default';
  columns: string[][] = [
    // ['USER_NAME', 'User Name'],

    ['NAME', 'Name'],
    ['NAME_HN', 'Name Hindi'],

    ['OFFICE_NAME', 'Office Name'],
    ['OFFICE_NAME_HN', 'Office Name Hindi'],

    ['POST', 'Post'],
    ['POST_HN', 'Post Hindi'],

    // ['SECTION_TYPE', 'Section Type'],

    // ['SERVICE_TITLE', 'Service Title'],
  ];

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }


    this.api
      .getadminSignature(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND SERVICE_ID = 5' + likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => { }
      );
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = ' Add New Signature ';
    this.drawerData = new adminsignature();
    this.drawerVisible = true;
  }
  edit(data: adminsignature): void {
    this.drawerTitle = ' Update Signature Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
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
}
