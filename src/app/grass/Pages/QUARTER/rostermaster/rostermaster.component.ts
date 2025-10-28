import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-rostermaster',
  templateUrl: './rostermaster.component.html',
  styleUrls: ['./rostermaster.component.css'],
  providers: [DatePipe],
})
export class RostermasterComponent {
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }
  ngOnInit(): void {
    // this.search(true);
    this.getallcities();
    this.getResidenceTypestart();
  }

  columns: string[][] = [
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'Date Time'],
    ['BUILDING_NAME', 'Creator Name'],
    ['FLOOR_NAME', 'Month'],
    ['NAME', 'Year'],
    ['RESIDENCE_TYPE_NAME', 'Approvar Name'],
    ['ROSTER_POINT_NO', 'Approvar Name'],
  ];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ROSTER_POINT_NO';
  searchText: any = '';
  rosterData: any = [];
  dataList: any = [];
  isSpinning = false;
  formTitle: any = 'Roaster Master';
  areaList: any;
  FloorNo: any;
  RESIDENCE_TYPE_IDD: any = [];
  ResidenceType111: any = [];
  ROOM_TYPE: any;
  AVAILABLE_STATUS: any;
  BuildingList: any;
  cityList: any;
  CITY_ID: any;
  AREA_ID: any;
  BUILDING_ID: any;
  CASTTTTT: any = '';

  search(reset: boolean = false) {
    //
    //

    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ROSTER_POINT_NO';
      this.sortValue = 'desc';
    }

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

    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null
    ) {
      filterQuery1 =
        ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
    }
    var city = '';
    if (
      this.CITY_ID != undefined &&
      this.CITY_ID != '' &&
      this.CITY_ID != null
    ) {
      city = ' AND CITY_ID in (' + this.CITY_ID + ')';
    }
    var area = '';
    if (
      this.AREA_ID != undefined &&
      this.AREA_ID != '' &&
      this.AREA_ID != null
    ) {
      area = ' AND AREA_ID in (' + this.AREA_ID + ')';
    }
    var building = '';
    if (
      this.BUILDING_ID != undefined &&
      this.BUILDING_ID != '' &&
      this.BUILDING_ID != null
    ) {
      building = ' AND BUILDING_ID in (' + this.BUILDING_ID + ')';
    }
    var avaiablestatus = '';
    if (
      this.AVAILABLE_STATUS != undefined &&
      this.AVAILABLE_STATUS != '' &&
      this.AVAILABLE_STATUS != null
    ) {
      avaiablestatus = " AND VACANT_STATUS = '" + this.AVAILABLE_STATUS + "'";
    }
    var casteeee: any = '';
    if (
      this.CASTTTTT != undefined &&
      this.CASTTTTT != '' &&
      this.CASTTTTT != null
    ) {
      if (this.CASTTTTT == 'SC') {
        casteeee = ' AND ROSTER_POINT_NO in (10,20,40,50)';
      } else if (this.CASTTTTT == 'ST') {
        casteeee = ' AND ROSTER_POINT_NO in (30,60)';
      } else {
        casteeee = '';
      }
    }

    this.loadingRecords = true;
    this.isSpinning = true;
    this.api
      .getrosterdata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
        city +
        building +
        area +
        filterQuery1 +
        casteeee +
        avaiablestatus
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.isSpinning = false;
          this.totalRecords = data['count'];
          this.filterClass = 'filter-invisible';
          this.dataList = data['data'];
          this.isFilterApplied = 'primary';

          // this.filterClass = 'filter-invisible';
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }

  getResidenceTypestart() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
          for (var i = 0; i < this.ResidenceType111.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
          }
          this.search(true);
        }
      },
      (err) => { }
    );
  }

  changecity(event: any) {
    this.BuildingList = [];
    this.FloorNo = [];
    this.areaList = [];

    this.api
      .getareamaster(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND CITY_ID in(' + event + ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.areaList = data['data'];
          }
        },
        (err) => { }
      );
  }
  changearea(event: any) {
    this.BuildingList = [];

    this.api
      .getBuildingMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND AREA_ID in(' + event + ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.BuildingList = data['data'];
          }
        },
        (err) => { }
      );
  }

  getallcities() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        }
      },
      (err) => { }
    );
  }

  applyFilter() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.search(true);
  }

  clearFilter() {
    this.ROOM_TYPE = null;
    this.BUILDING_ID = null;
    this.AVAILABLE_STATUS = null;
    this.AREA_ID = null;
    this.CITY_ID = null;
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceType111.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
    }
    this.search(true);
  }

  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ROSTER_POINT_NO';
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
}
