import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DDOTypeDetailsData } from 'src/app/Medical/Models/ddotypedetails';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-ddotype-details-list',
  templateUrl: './ddotype-details-list.component.html',
  styleUrls: ['./ddotype-details-list.component.css'],
})
export class DDOTypeDetailsListComponent implements OnInit {
  cityMaster: any = [];
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: DDOTypeDetailsData = new DDOTypeDetailsData();
  formTitle = 'DDO List';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'NAME';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['NAME', 'Name'],
    ['NAME_HN', 'NAME_HN'],
    ['SEQ_NO', 'SEQ_NO'],
    ['DDO_TYPE_MASTER_NAME', 'DDO_TYPE_MASTER_NAME'],
    ['STATUS', 'STATUS'],

  ];
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) { }

  ngOnInit(): void { }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search();
  }
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
      .getddoTypeDetailsMaster(
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
          // if(this.totalRecords==0){
          //   data.SEQ_NO=1;
          // }else{
          //   data.SEQ_NO= this.dataList[this.dataList.length-1]['SEQ_NO']+1
          // }
        },
        (err) => {

        }
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

  add(): void {
    this.drawerTitle = 'Add New DDO ';
    this.drawerData = new DDOTypeDetailsData();

    this.api.getddoTypeDetailsMaster(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => {

      }
    );
    this.drawerVisible = true;
  }

  edit(data: DDOTypeDetailsData): void {
    this.drawerTitle = 'Update DDO ';
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
}
