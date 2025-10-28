import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CommonFunctionService } from 'src/app/grass/Services/CommonFunctionService';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-user-area-mapping',
  templateUrl: './user-area-mapping.component.html',
  styleUrls: ['./user-area-mapping.component.css'],
})
export class UserAreaMappingComponent {
  formTitle = 'User Area Mappings';
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
  logtext: string = '';
  filterloading: boolean = false;

  columns: string[][] = [
    ['EMAIL_ID', 'Email ID'],
    ['NAME', '  Name  '],
    ['MOBILE_NUMBER', 'Mobile Number'],
  ];

  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any;

  drawerVisiblemapping: boolean;
  drawerTitlemapping: string;
  dataList1: any = [];
  pageSize2 = 10;

  constructor(
    public api: ApiService,
    private message: NzNotificationService,
    private router: Router
  ) {}
  ngOnInit() {
    // this.search();
  }

  onKeypressEvent(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }

  // Basic Methods
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
  onKeyDownEvent(event) {
    if (event.key == 'Enter') {
      event.preventDefault();
    }
    this.search(true);
  }
  selectedCouponfor = [];
  search(reset: boolean = false) {
    if (this.searchText.length < 3 && this.searchText.length !== 0) {
      return;
    }
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
    var globalSearchQuery = '';
    // Global Search (using searchText)
    if (this.searchText !== '') {
      globalSearchQuery =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchText}%'`;
          })
          .join(' OR ') +
        ')';
    }

    // Combine global search query and column-specific search query
    likeQuery = globalSearchQuery + (likeQuery ? ' AND ' + likeQuery : '');

    this.api
      .getAllUsers(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND ROLE_IDS = 60' + likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
          } else if (data['code'] == 400) {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.message.error('Failed to get user data', '');
            this.dataList = [];
          }
        },
        (err) => {
          if (err['status'] == 400) {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.message.error('Invalid filter parameter', '');
          } else {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.dataList = [];
          }
        }
      );
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  MapFacility(data: any) {
    this.drawerTitlemapping = 'Map Areas For ' + data.NAME;
    this.drawerData = Object.assign({}, data);
    this.drawerVisiblemapping = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallbackmapping() {
    return this.drawerClosemapping.bind(this);
  }

  drawerClosemapping(): void {
    this.search();
    this.drawerVisiblemapping = false;
  }
  iscoupontypeFilterApplied: boolean = false;

  startDateText: any = null;
  startDateVisible: boolean = false;

  expiryDateText: any = null;
  expiryDateVisible: boolean = false;

  couponTypeVisible;

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }

  keyup(keys) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    if (this.searchText.length >= 3 && keys.key === 'Enter') {
      this.search(true);
    } else if (this.searchText.length === 0 && keys.key == 'Backspace') {
      this.dataList = [];
      this.search(true);
    }
  }
  reset(): void {
    this.searchText = '';
    this.search();
  }

  //Advance Filter
  TabId: number;
  public commonFunction = new CommonFunctionService();
  userId = sessionStorage.getItem('userId');
  isTextOverflow = false;

  checkOverflow(element: HTMLElement, tooltip: any): void {
    this.isTextOverflow = element.scrollWidth > element.clientWidth;
    if (this.isTextOverflow) {
      tooltip.show();
    } else {
      tooltip.hide();
    }
  }

  filterData: any;
  currentClientId = 1;
  selectedFilter: string | null = null;
  isModalVisible = false;
  selectedQuery: string = '';

  back() {
    this.router.navigate(['/masters/menu']);
  }

  drawerVisibleInventoryMapping: boolean;
  drawerTitleInventoryMap: string;
  MapInventory(data: any) {
    this.drawerTitleInventoryMap = 'Map areas For ' + data.NAME;
    this.drawerData = Object.assign({}, data);
    this.drawerVisibleInventoryMapping = true;
  }

  drawerCloseInventorymapping(): void {
    this.search();
    this.drawerVisibleInventoryMapping = false;
  }

  get closeCallbackInventorymapping() {
    return this.drawerCloseInventorymapping.bind(this);
  }
}
