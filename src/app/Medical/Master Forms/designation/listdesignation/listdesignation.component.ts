import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Designation } from 'src/app/Modal/designation';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-listdesignation',
  templateUrl: './listdesignation.component.html',
  styleUrls: ['./listdesignation.component.css'],
})
export class ListdesignationComponent {
  formTitle = ' Designation  Master';

  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: Designation = new Designation();
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [['NAME', 'Name']];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    // this.search(true);
  }

  keyup(event: any) {
    this.search(true);
  }

  add() {
    this.drawerTitle = ' Add New Designation ';
    this.drawerVisible = true;
    this.api.getAllDesignations(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO =
            Number(data['data'][0]['SEQUENCE_NO']) + 1;
        }
      },
      (err) => {}
    );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose(): void {
    // this.search();
    this.drawerVisible = false;
  }

  edit(data: Designation): void {
    this.drawerTitle = ' Update City Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    // const sortOrder = (currentSort && currentSort.value) || 'asc';

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
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.api
      .getAllDesignations(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
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
        (err) => {}
      );
  }
}
