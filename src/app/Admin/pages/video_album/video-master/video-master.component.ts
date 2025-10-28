import { Component, Input, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys } from 'src/app/app.constant';
import { Video } from 'src/app/Modal/video';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-video-master',
  templateUrl: './video-master.component.html',
  styleUrls: ['./video-master.component.css'],
})
export class VideoMasterComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: Video = new Video();
  formTitle = 'Video List';
  @Input()
  dataList: any[] = [];
  @Input()
  photoID: any = 0;
  loadingRecords = true;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['SEQUENCE_NO', 'Sequence '],
    ['VIDEO_URL', 'Video Url'],
    ['TITLE', 'Title'],
  ];
  @Input() drawerClose2!: Function;

  imgurl = appkeys.retriveimgUrl;

  constructor(private api: ServiceService) {}

  ngOnInit(): void {
    this.loadingRecords = false;
    this.search();
  }

  keyup() {
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
      likeQuery = ' AND(';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.api
      .getAllVideoMaster(
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

          for (var i = 0; i < this.dataList.length; i++) {}
        },
        (err) => {
          console.log(err);
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Add New Video';
    this.drawerData = new Video();

    this.api.getAllVideoMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.drawerVisible = true;
  }
  edit(data: Video): void {
    this.drawerTitle = 'Update Video ';
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
    const sortOrder = (currentSort && currentSort.value) || 'descks';

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

  loadData() {
    this.api
      .getAllVideoMaster(this.pageIndex, this.pageSize, this.sortKey, '', '')
      .subscribe((data) => {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      });
  }
}
