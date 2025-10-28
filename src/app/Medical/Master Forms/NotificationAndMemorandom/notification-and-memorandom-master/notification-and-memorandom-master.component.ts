import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NotificationAndMemorandomMaster } from 'src/app/Medical/Models/NotificationAndMemorandom';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-notification-and-memorandom-master',
  templateUrl: './notification-and-memorandom-master.component.html',
  styleUrls: ['./notification-and-memorandom-master.component.css'],
})
export class NotificationAndMemorandomMasterComponent implements OnInit {
  NotificationAndMemorandomMaster: any = [];

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.search();
  }

  formTitle = 'Notification/ Memorandum Master';
  searchText: string = '';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  sortValue: string = 'asc';
  sortKey: string = 'NAME';
  drawerData: NotificationAndMemorandomMaster =
    new NotificationAndMemorandomMaster();
  drawerVisible: boolean;
  drawerTitle: string;
  pageSize2 = 10;
  columns: string[][] = [
    ['NAME', 'Name'],
    ['DATE', 'Date'],
    ['FILE_NO', 'File No'],
  ];
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  add(): void {
    this.drawerTitle = 'Create New Notification And Memorandum';
    this.drawerData = new NotificationAndMemorandomMaster();
    this.drawerVisible = true;
  }

  edit(data: NotificationAndMemorandomMaster): void {
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  dataList: any = [];
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
      .getAllNotification(
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
}
