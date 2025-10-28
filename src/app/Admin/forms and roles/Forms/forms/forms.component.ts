import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServiceService } from 'src/app/Service/service.service';
import { Form } from 'src/app/commonModule/form';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements OnInit {
  formTitle = 'Manage Forms';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['PARENT_NAME', 'Parent Name'],
    ['NAME', 'Name'],
    ['LINK', 'Link'],
    ['ICON', 'Icon'],
  ];

  //drawer Variables
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: Form = new Form();
  loadingForm = false;
  forms: Form[];
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}
  ngOnInit() {
    // if (this.userId == null || this.userName == null || this.roleId == null) {
    //   this.api.logoutForSessionValues()
    // }
    // else {
    this.search();
    this.loadForms();
    // }
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
  likeQuery: any = '';
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
    if (this.searchText != '') {
      this.likeQuery = ' AND';
      this.columns.forEach((column) => {
        this.likeQuery +=
          ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      this.likeQuery = this.likeQuery.substring(0, this.likeQuery.length - 2);
    }
    this.api
      .getAllForms(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New Form';
    this.drawerData = new Form();
    //this.loadForms()
    this.drawerVisible = true;
  }
  edit(data: Form): void {
    this.drawerTitle = 'Update Form';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  loadForms() {
    this.loadingForm = true;
    this.api.getAllForms(0, 0, '', '', ' AND PARENT_ID=0').subscribe(
      (data) => {
        this.forms = data['data'];
        this.loadingForm = false;
      },
      (err) => {
        console.log(err);
        //this.loadingForm = false;
      }
    );
  }
}
