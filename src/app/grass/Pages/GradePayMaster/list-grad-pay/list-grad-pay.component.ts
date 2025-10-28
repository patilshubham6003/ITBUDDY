import { Component, OnInit } from '@angular/core';
// import { GradPayMaster } from '../../Models/GradPayMaster';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { ApiService } from 'src/app/Service/api.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { GradPayMaster } from 'src/app/grass/Models/GradPayMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-list-grad-pay',
  templateUrl: './list-grad-pay.component.html',
  styleUrls: ['./list-grad-pay.component.css'],
})
export class ListGradPayComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: GradPayMaster = new GradPayMaster();
  formTitle = 'Grad Pay Master';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'SEQUENCE_NO';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['RESIDENCE_TYPE_NAME', 'Residence type'],
    ['SEQUENCE_NO', 'Sequence no'],
    ['STATUS', 'status'],
    ['AMOUNT', 'Amount'],
  ];
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService
  ) {}

  ngOnInit(): void {}
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
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
      .getGradPay(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
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
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  add(): void {
    this.drawerTitle = 'Add New Grad Pay';
    this.drawerData = new GradPayMaster();

    this.api.getGradPay(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => {}
    );
    this.drawerVisible = true;
  }

  edit(data: GradPayMaster): void {
    this.drawerTitle = 'Update Grad Pay';
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
