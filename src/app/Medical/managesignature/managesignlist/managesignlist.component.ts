


import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DDOMaster } from 'src/app/Modal/ddoMaster';


@Component({
  selector: 'app-managesignlist',
  templateUrl: './managesignlist.component.html',
  styleUrls: ['./managesignlist.component.css']
})
export class ManagesignlistComponent {
  formTitle = 'DDO Signature Mappping';
  ddoid = sessionStorage.getItem('ddoId');
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: DDOMaster = new DDOMaster();
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
  columns: string[][] = [
    ['SEQ_NO', 'Seq. No'],
    ['HEAD_OF_OFFICE', 'Head of Office'],
    ['LOCATION', 'Location'],
    ['POSITION_NO', 'Position Number'],
    ['MOBILE_NO', 'Mobile Number'],
    ['PR_CCIT', 'Pr. CCIT'],
    ['DESCRIPTION', 'DESCRIPTION'],

  ];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    // this.search(true);
    sessionStorage.removeItem('signaturedata');
  }

  keyup(event: any) {
    this.search(true);
  }

  add() {
    this.drawerTitle = ' Add New DDOMaster ';
    this.drawerData = new DDOMaster();
    this.INNERTABLEDATA = []
    this.loadingRecords = true;
    this.HEAD_OF_OFFICE = ''
    this.api.getAllDDOs(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['count'] == 0) {
            this.drawerData.SEQ_NO = 1;
          } else {
            this.drawerData.SEQ_NO = Number(data['data'][0]['SEQ_NO']) + 1;
          }
          this.loadingRecords = false;
          this.drawerVisible = true;
        } else {
          this.loadingRecords = false;
        }
      },
      (err) => { }
    );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  SignatureData: any = [];
  INNERTABLEDATA: any[] = []; // Changed to array
  HEAD_OF_OFFICE: any;

  edit(data: DDOMaster): void {
    this.drawerTitle = ' Signature Mapping of ' + data.HEAD_OF_OFFICE;
    this.drawerData = Object.assign({}, data);
    this.HEAD_OF_OFFICE = this.drawerData.HEAD_OF_OFFICE;

    if (data.SIGNATURE_IDS !== null && data.SIGNATURE_IDS !== undefined) {
      this.SignatureData = []
      this.INNERTABLEDATA = []
      this.api
        .getSignature(
          0,
          0,
          '',
          '',
          ' AND STATUS!=false AND ID in(' + data.SIGNATURE_IDS + ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.SignatureData = data['data'];
              let nextID = 1;

              this.SignatureData.forEach((data2, index) => {
                this.INNERTABLEDATA.push({
                  ID: nextID++,
                  SIGNATURE_ID: data2.ID,
                  SIGNATURE_NAME: data2.NAME,
                });
              });

            } else {
              this.SignatureData = []
              this.INNERTABLEDATA = []
            }
          },
          (err) => {
          }
        );
    }

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
    if (this.ddoid) {
      var ddofilter = ' AND ID=' + this.ddoid;
    } else {
      var ddofilter = ''
    }

    this.api
      .getAllDDOs(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + ddofilter)
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
}

