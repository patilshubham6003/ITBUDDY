import { Component, ViewEncapsulation } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CityMaster } from 'src/app/grass/Models/CityMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
})
export class CityListComponent {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: CityMaster = new CityMaster();
  formTitle = ' City Master ';
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
    private api: APIServicesService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.search();
  }

  keyup(event: any) {
    this.search(true);
  }

  statusChange(data: CityMaster, status: boolean) {
    data.STATUS = status;
    this.api.updateCityMaster(data).subscribe((successCode) => {
      if (successCode['code'] == 200)
        this.message.success('Status Updated Successfully', '');
      else this.message.error('Failed to Update Status', '');

      this.search(false);
    });
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
      .getCityMaster(
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

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  add(): void {
    this.drawerTitle = ' Add New City Information ';
    this.drawerData = new CityMaster();
    // this.api.getCityMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
    //   if (data['count']==0){
    //     this.drawerData.SEQUENCE_NO=1;
    //   }else
    //   {
    //     this.drawerData.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO'] + 1;
    //   }
    // },err=>{
    //
    // })
    this.drawerData.STATUS = true;
    this.drawerVisible = true;
  }
  edit(data: CityMaster): void {
    this.drawerTitle = ' Update City Information';
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
}
