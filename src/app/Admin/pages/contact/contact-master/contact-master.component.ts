import { Component, OnInit } from '@angular/core';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Contact } from 'src/app/Modal/contact';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-contact-master',
  templateUrl: './contact-master.component.html',
  styleUrls: ['./contact-master.component.css'],
})
export class ContactMasterComponent implements OnInit {
  formTitle = 'Manage Contact Information';
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
  retrieveimgUrl = appkeys.retriveimgUrl;
  columns: string[][] = [
    ['EMAIL_ID', 'Email ID'],
    ['ADDRESS', 'Address'],
  ];
  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Contact = new Contact();
  constructor(
    private api: ServiceService
  ) // private message: NzNotificationService
  {}
  ngOnInit() {
    this.search();
  }
  keyup() {
    this.search();
  }
  // Basic Methods
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
      .getAllContact(
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
        (err) => {
          console.log(err);
        }
      );
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New Contact';
    this.drawerData = new Contact();

    this.drawerVisible = true;
  }
  edit(data: Contact): void {
    this.drawerTitle = 'Update Contact Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}
