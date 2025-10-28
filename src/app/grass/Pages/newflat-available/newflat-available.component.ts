import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QuarterMaster } from '../QUARTER/QuarterData';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-newflat-available',
  templateUrl: './newflat-available.component.html',
  styleUrls: ['./newflat-available.component.css'],
  providers: [DatePipe],
})
export class NewflatAvailableComponent implements OnInit {
  formTitle = 'Quarter Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 20;
  sortValue: string = 'desc';
  sortKey: string = 'SEQUENCE_NO';
  searchText: string = '';
  filterQuery: string = '';
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: QuarterMaster = new QuarterMaster();
  userid: any;
  roleid: any;
  CityList: any = [];
  CITY: any;
  AreaList: any = [];
  AreaList2: any = [];
  AREA: any;
  // RecidenceList: any = [];
  RecidenceList1: any = [];
  employeedata: any = [];
  RECIDENCE: any;
  BlockList: any = [];
  BlockList2: any = [];
  faltListdat: any = [];
  faltListdat1: any = [];
  BuildingListdat: any = [];
  BuildingListdat1: any = [];
  FloorListdat: any = [];
  FloorListdat1: any = [];
  faltListdat11: any = [];
  faltListdat1111: any = [];

  BUILDING: any;
  FLOOR: any;
  ROOMTYPE: any;
  FALTSS: any;
  fil: boolean = false;
  filterkey = '';
  Grade_pay = '';
  roomtypessss: any = [];
  totalcountofflat: any;
  @ViewChild('scrollContainerflat') scrollContainerflat: ElementRef;
  constructor(private api: APIServicesService) { }

  ngOnInit(): void {
    this.userid = sessionStorage.getItem('userId')
    this.roleid = sessionStorage.getItem('roleId')

    this.api.getemployeeresidencetype(0, 0, '', 'asc', '')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.RecidenceList1 = data['data'];
        }
      },
        (error) => {
        }
      );

    this.loadMoreData();
    this.getCity();
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }

  getCity() {
    this.api.getCityMaster(0, 0, '', 'desc', ' AND STATUS=1 ')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.CityList = data['data'];
        }
      })

    this.api.getareamaster(0, 0, '', 'desc', ' AND STATUS=1 ')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.AreaList = data['data'];
        }
      })

    this.api.getBlockmaster(0, 0, '', 'desc', ' AND STATUS=1 ')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.BlockList = data['data'];
        }
      })

    this.loadingRecords = true;
    this.api.getFlatAvailabilityget1(0, 0, 'SEQUENCE_NO', 'desc', " AND STATUS=1 AND AVAILABLE_STATUS= 'A' AND IS_PUBLISHED=1 ", Number(sessionStorage.getItem('userId'))).subscribe((data) => {
      if (data['code'] == 200) {

        this.faltListdat = data['data'];
        this.dataList = data['data'];
        this.roomtypessss = data['data'];
        this.totalcountofflat = data['count'];
        this.totalRecords1 = data['count'];
        const uniqueRoomTypesSet = new Set();
        const uniqueRoomTypeRecords: any = [];
        for (const item of this.roomtypessss) {
          const roomType = item.ROOM_TYPE;
          if (!uniqueRoomTypesSet.has(roomType)) {
            uniqueRoomTypesSet.add(roomType);
            uniqueRoomTypeRecords.push(item);
          }
        }
        this.roomtypessss = uniqueRoomTypeRecords;
      }
    })

    this.api.getBuildingMaster(0, 0, 'SEQUENCE_NO', 'desc', " AND STATUS=1 ").subscribe((data) => {
      if (data['code'] == 200) {
        this.BuildingListdat = data['data'];
      }
    })
    this.api.getFloorMaster(0, 0, 'SEQUENCE_NO', 'desc', " AND STATUS=1 ").subscribe((data) => {
      if (data['code'] == 200) {
        this.FloorListdat = data['data'];
      }
    })
  }
  block1: any = [];
  area1: any = [];
  recicence1: any = [];
  roomtype1: any = [];

  city1: any = [];
  floor1: any = [];

  building1: any = [];

  selectcity(e: any) {
    this.city1 = e;
    this.AreaList2 = [];
    this.AreaList2 = this.AreaList.filter(area => this.city1.findIndex(selectedCityId => selectedCityId === (area.CITY_ID)) > -1);
    var selectArea = this.AREA;
    if (this.AREA && this.AREA.length > 0) {
      this.AREA = []
      for (let i = 0; i < this.AreaList2.length; i++) {
        if (selectArea.includes(this.AreaList2[i].ID)) {
          this.AREA.push(this.AreaList2[i].ID);
        }
        if (i + 1 == this.AreaList2.length) {
          this.selectarea(this.AREA);
        }
      }
    } else {
    }
    if (this.city1.length === 0) {
      this.block1 = null;
      this.FALTSS = null;
      this.area1 = null;
      this.AREA = null;
      this.city1 = null;
      this.CITY = null;
      this.floor1 = null;
      this.FLOOR = null;
      this.building1 = null;
      this.BUILDING = null;
    }
    // this.applyFilter();
  }

  selectarea(e: any) {
    this.area1 = e;
    this.BuildingListdat1 = []
    this.BuildingListdat1 = this.BuildingListdat.filter(area => this.area1.findIndex(selectedCityId => selectedCityId === (area.AREA_ID)) > -1);
    var selectBuilding = this.BUILDING;
    if (this.BUILDING && this.BUILDING.length > 0) {
      this.BUILDING = []
      for (let i = 0; i < this.BuildingListdat1.length; i++) {
        if (selectBuilding.includes(this.BuildingListdat1[i].ID)) {
          this.BUILDING.push(this.BuildingListdat1[i].ID);
        }
        if (i + 1 == this.BuildingListdat1.length) {
          this.selectbuilding(this.BUILDING);
        }
      }
    } else {
    }
    if (this.area1.length === 0) {
      this.block1 = null;
      this.FALTSS = null;
      this.area1 = null;
      this.AREA = null;
      this.floor1 = null;
      this.FLOOR = null;
      this.building1 = null;
      this.BUILDING = null;
    }
    // this.applyFilter();
  }
  selectbuilding(e: any) {
    this.building1 = e;
    this.FloorListdat1 = []
    this.FloorListdat1 = this.FloorListdat.filter(area => this.building1.findIndex(selectedCityId => selectedCityId === (area.BUILDING_ID)) > -1);
    var selectfloor = this.FLOOR;
    if (this.FLOOR && this.FLOOR.length > 0) {
      this.FLOOR = []
      for (let i = 0; i < this.FloorListdat1.length; i++) {
        if (selectfloor.includes(this.FloorListdat1[i].ID)) {
          this.FLOOR.push(this.FloorListdat1[i].ID);
        }
        if (i + 1 == this.FloorListdat1.length) {
          this.selectfloor(this.FLOOR);
        }
      }
    } else {
    }
    if (this.building1.length === 0) {
      this.block1 = null;
      this.FALTSS = null;
      this.floor1 = null;
      this.FLOOR = null;
      this.building1 = null;
      this.BUILDING = null;
    }
    // this.applyFilter();
  }
  selectfloor(e: any) {
    this.floor1 = e;
    this.faltListdat1 = []
    this.faltListdat1 = this.faltListdat.filter(area => this.floor1.findIndex(selectedCityId => selectedCityId === (area.FLOOR_ID)) > -1);
    var selectflats = this.FALTSS;
    if (this.FALTSS && this.FALTSS.length > 0) {
      this.FALTSS = []
      for (let i = 0; i < this.faltListdat1.length; i++) {
        if (selectflats.includes(this.faltListdat1[i].ID)) {
          this.FALTSS.push(this.faltListdat1[i].ID);
        }
        if (i + 1 == this.faltListdat1.length) {
          this.selectblock(this.FALTSS);
        }
      }
    } else {
    }
    if (this.floor1.length === 0) {
      this.block1 = null;
      this.FALTSS = null;
      this.floor1 = null;
      this.FLOOR = null;
    }
    // this.applyFilter();
  }
  selectblock(e: any) {
    this.block1 = e;
    this.faltListdat11 = []
    this.faltListdat11 = this.faltListdat1111.filter(area => this.block1.findIndex(selectedCityId => selectedCityId === (area.ID)) > -1);
    if (this.block1.length === 0) {
      this.block1 = null;
      this.FALTSS = null;
    }
    // this.applyFilter();
  }

  selectroomtype(e: any) {
    this.roomtype1 = e;
    // this.applyFilter();
  }

  selectrecidence(e: any) {
    this.recicence1 = e;
    // this.applyFilter();

  }

  totalRecords1: any;
  applyFilter() {
    this.isFilterApplied = 'primary';
    this.filterQuery = '';
    var f = "";
    if (this.city1 != null && this.city1 != undefined && this.city1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.city1.length; i++) {
        query += " CITY_ID = '" + this.city1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }

    if (this.area1 != null && this.area1 != undefined && this.area1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.area1.length; i++) {
        query += " AREA_ID = '" + this.area1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }

    if (this.building1 != null && this.building1 != undefined && this.building1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.building1.length; i++) {
        query += " BUILDING_ID = '" + this.building1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }
    if (this.floor1 != null && this.floor1 != undefined && this.floor1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.floor1.length; i++) {
        query += " FLOOR_ID = '" + this.floor1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }
    if (this.block1 != null && this.block1 != undefined && this.block1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.block1.length; i++) {
        query += " ID = '" + this.block1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }
    if (this.roomtype1 != null && this.roomtype1 != undefined && this.roomtype1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.roomtype1.length; i++) {
        query += " ROOM_TYPE = '" + this.roomtype1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }
    if (this.recicence1 != null && this.recicence1 != undefined && this.recicence1 != '') {
      f += ' AND ('
      var query = ''
      for (var i = 0; i < this.recicence1.length; i++) {
        query += " RESIDENCE_TYPE_ID = '" + this.recicence1[i] + "' OR";
      }
      f += query.substring(0, query.length - 2) + ' )'
    }
    this.filterQuery = f;
    this.loadingRecords = true;
    this.api.getFlatAvailabilityget1(
      1,
      20,
      'SEQUENCE_NO',
      'desc',
      " AND STATUS=1 AND AVAILABLE_STATUS= 'A' AND IS_PUBLISHED=1 " + this.filterQuery, Number(sessionStorage.getItem('userId'))).subscribe((data) => {
        if (data['code'] == 200) {
          this.pageIndex = 1;
          this.loadingRecords = false;
          this.fil = true;
          this.filterClass = 'filter-invisible';
          this.totalRecords = data['count'];
          this.totalRecords1 = data['count'];
          this.loadingRecordsload = true;
          this.dataList = data['data']
        }
      }, err => {
        this.loadingRecords = false;
      });
  }

  clearfilt() {
    this.filterQuery = '';
    this.recicence1 = [];
    this.RECIDENCE = null;
    this.block1 = [];
    this.FALTSS = null;
    this.area1 = [];
    this.AREA = null;
    this.city1 = [];
    this.CITY = null;
    this.floor1 = [];
    this.FLOOR = null;
    this.roomtype1 = [];
    this.ROOMTYPE = null;
    this.building1 = [];
    this.BUILDING = null;
    this.fil = false;
    this.loadingRecords = true;
    this.pageIndex = 1;

    this.api.getFlatAvailabilityget1(1, 20, 'SEQUENCE_NO', 'desc', " AND STATUS=1 AND AVAILABLE_STATUS= 'A' AND IS_PUBLISHED=1 ", Number(sessionStorage.getItem('userId'))).subscribe((data) => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.isFilterApplied = 'default';
        this.filterClass = 'filter-invisible';
        this.totalRecords = data['count'];
        this.totalRecords1 = data['count'];
        this.loadingRecordsload = true;
        this.dataList = data['data'];
      }
    }, err => {
      this.loadingRecords = false;
    });
  }
  clearfiltCity() {
    this.city1 = [];
    this.CITY = null;
    this.area1 = null;
    this.AREA = null;
    this.building1 = null;
    this.BUILDING = null;
    this.floor1 = null;
    this.FLOOR = null;
    this.block1 = null;
    this.FALTSS = null;
    this.fil = false;
    this.applyFilter();
  }
  clearfiltArea() {
    this.area1 = [];
    this.AREA = null;
    this.building1 = null;
    this.BUILDING = null;
    this.floor1 = null;
    this.FLOOR = null;
    this.block1 = null;
    this.FALTSS = null;
    this.fil = false;
    this.applyFilter();
  }
  clearfiltBuilding() {
    this.building1 = [];
    this.BUILDING = null;
    this.floor1 = null;
    this.FLOOR = null;
    this.block1 = null;
    this.FALTSS = null;
    this.fil = false;
    this.applyFilter();
  }
  clearfiltFloor() {
    this.floor1 = [];
    this.FLOOR = null;
    this.block1 = null;
    this.FALTSS = null;
    this.fil = false;
    this.applyFilter();
  }
  clearfiltBlock() {
    this.block1 = [];
    this.FALTSS = null;
    this.fil = false;
    this.applyFilter();
  }
  clearFilterRoom() {
    this.roomtype1 = [];
    this.ROOMTYPE = null;
    this.fil = false;
    this.applyFilter();
  }
  applyFilterRecidence() {
    this.recicence1 = [];
    this.RECIDENCE = null;
    this.fil = false;
    this.applyFilter();
  }

  onScroll(): void {
    const container = this.scrollContainerflat.nativeElement;
    const scrollPercentage =
      (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;

    // Adjust the threshold as needed (e.g., 80%)
    if (scrollPercentage > 50) {
      this.loadMoreData(); // Load more data when user is near the bottom
    }
  }
  loadingRecordsload: boolean = true;
  // Load more data
  loadMoreData(): void {
    //  this.pageIndex=1;
    if (this.loadingRecordsload == true) {
      this.loadingRecordsload = false;
      this.pageIndex++;
      this.api.getFlatAvailabilityget1(
        this.pageIndex,
        this.pageSize,
        'SEQUENCE_NO',
        'desc',
        " AND STATUS=1 AND AVAILABLE_STATUS= 'A' AND IS_PUBLISHED=1 " + this.filterQuery,
        Number(sessionStorage.getItem('userId'))
      ).subscribe((data) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = [...this.dataList, ...data['data']];
          if (data['data'].length > 0) {
            this.loadingRecordsload = true;
          }
        }
      });
    }
  }
  filterClass: string = 'filter-invisible';
  isFilterApplied: any = 'default';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

}