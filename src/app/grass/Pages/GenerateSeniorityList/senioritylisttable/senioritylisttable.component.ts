import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-senioritylisttable',
  templateUrl: './senioritylisttable.component.html',
  styleUrls: ['./senioritylisttable.component.css'],
})
export class SenioritylisttableComponent {
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: genertaeSenioritylist = new genertaeSenioritylist();
  formTitle = 'Seniority Order Master';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['TYPE', 'Type'],
    ['PAY_BILL_SECTION', 'Pay Bill'],
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
      .getSenioritylist(
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

  getObjections(data) {}

  sort(params: NzTableQueryParams) {
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
    this.drawerTitle = 'Generate New Seniority Order';
    this.drawerData = new genertaeSenioritylist();

    // this.api.getSenioritylist(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(data => {
    //   if (data['count'] == 0) {
    //     this.drawerData.SEQUENCE_NO = 1;

    //   } else {
    //     this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
    //   }

    // }, err => {
    //
    // });

    this.drawerVisible = true;
  }

  edit(data: genertaeSenioritylist): void {
    this.drawerTitle = 'Update Seniority Order';
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

  objectiondrawer: boolean = false;
  ObjectDrawerTitle = '';
  Senioritydataobj: any;
  OpenObjectionsTable(data) {
    this.objectiondrawer = true;
    this.ObjectDrawerTitle = 'Residence Type' + data.RESIDENCE_TYPE_NAME;
    this.Senioritydataobj = Object.assign({}, data);
  }
  objdrawerClose() {
    this.objectiondrawer = false;
  }

  get closeCallbackobjection() {
    return this.objdrawerClose.bind(this);
  }
}
