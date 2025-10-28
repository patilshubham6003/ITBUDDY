import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-flatvacantdetailsreport',
  templateUrl: './flatvacantdetailsreport.component.html',
  styleUrls: ['./flatvacantdetailsreport.component.css'],
  providers: [DatePipe],
})
export class FlatvacantdetailsreportComponent {
  formTitle = ' Quarter Vacant Detailed Report ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  RESIDENCE_TYPE_IDD: any = [];
  isSpinning = false;
  ResidenceTypelist: any = [];
  AVAILABLE_STATUS: any = '';
  MONTH1: any;
  MONTH2: any;

  columns: string[][] = [
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['FLAT_STATUS_DATE', 'FLAT_STATUS_DATE'],
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['FLOOR_NAME', 'FLOOR_NAME'],
    ['NAME', 'NAME'],
    ['AVAILABLE_STATUS', 'AVAILABLE_STATUS'],
  ];

  CITY_ID: any = [];
  AREA_ID: any = [];
  BUILDING_ID: any = [];
  cityList: any = [];
  areaList: any = [];
  BuildingList: any = [];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  // Monthrange: any = [];
  MONTH: any;
  YEAR: any;
  // selectmonth: any = new Date();
  // selectyear: any = new Date();
  // onChangemonth(result:any) {

  // }
  // onChangeyear(event: any) {

  // }
  Monthrange: any = [];
  onChangemonth(result: Date[]): void {
    let fromdate: any = new Date();
    let Todate: any = new Date();

    this.Monthrange[0] = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );
  }
  startdatenow = new Date();
  ngOnInit(): void {
    // this.search();
    this.Monthrange[0] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth() + 1,
      0
    );
    this.getallcities();
    this.getResidenceTypestart();
  }

  changecity(event: any) {
    this.AREA_ID = [];
    this.BUILDING_ID = [];
    this.BuildingList = [];
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
    this.BUILDING_ID = [];
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

  getResidenceTypestart() {
    this.RESIDENCE_TYPE_IDD = [];
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
          }
          this.search();
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  keyup(event: any) {
    this.search(true);
  }
  dataList11: any = [];
  search(reset: boolean = false, exportInExcel: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ' )';
    }

    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != ''
    ) {
      var stringconvert = this.RESIDENCE_TYPE_IDD.join(',');
      filterQuery1 = ' AND RESIDENCE_TYPE_ID IN ( ' + stringconvert + ' )';
    }
    var Cityname = '';
    if (
      this.CITY_ID != null &&
      this.CITY_ID != undefined &&
      this.CITY_ID != ''
    ) {
      var stringconvert1 = this.CITY_ID.join(',');
      Cityname = ' AND CITY_ID IN ( ' + stringconvert1 + ' )';
    }
    var Areaname = '';
    if (
      this.AREA_ID != null &&
      this.AREA_ID != undefined &&
      this.AREA_ID != ''
    ) {
      var stringconvert2 = this.AREA_ID.join(',');
      Areaname = ' AND AREA_ID IN ( ' + stringconvert2 + ' )';
    }
    var Buildingname = '';
    if (
      this.BUILDING_ID != null &&
      this.BUILDING_ID != undefined &&
      this.BUILDING_ID != ''
    ) {
      var stringconvert3 = this.BUILDING_ID.join(',');
      Buildingname = ' AND BUILDING_ID IN ( ' + stringconvert3 + ' )';
    }
    var Status = '';
    if (
      this.AVAILABLE_STATUS != null &&
      this.AVAILABLE_STATUS != undefined &&
      this.AVAILABLE_STATUS != ''
    ) {
      Status = " AND AVAILABLE_STATUS = '" + this.AVAILABLE_STATUS + "'";
    }
    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .getflatvacantdetailedreport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
          " AND date(FLAT_STATUS_DATE) BETWEEN '" +
          this.MONTH1 +
          "' AND '" +
          this.MONTH2 +
          "' " +
          filterQuery1 +
          Cityname +
          Areaname +
          Buildingname +
          Status
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.dataList = data['data'];
              this.loadingRecords = false;
              this.isSpinning = false;
              this.filterClass = 'filter-invisible';
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        );
    } else {
      this.exportLoading = true;
      this.api
        .getflatvacantdetailedreport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery +
          " AND date(FLAT_STATUS_DATE) BETWEEN '" +
          this.MONTH1 +
          "' AND '" +
          this.MONTH2 +
          "' " +
          filterQuery1 +
          Cityname +
          Areaname +
          Buildingname +
          Status
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = data['data'];
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
              this.exportLoading = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.exportLoading = false;
          }
        );
    }
  }
  exportLoading = false;
  importInExcel() {
    this.search(true, true);
  }

  applyFilter() {
    if (
      this.Monthrange == null ||
      this.Monthrange == undefined ||
      this.Monthrange == ''
    ) {
      this.message.error('Please Select Month', '');
    } else {
      this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }
    this.CITY_ID = [];
    this.AREA_ID = [];
    this.BUILDING_ID = [];
    this.AVAILABLE_STATUS = null;
    this.Monthrange = [];
    let newdate = new Date();
    this.Monthrange[0] = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    this.Monthrange[1] = new Date(
      newdate.getFullYear(),
      newdate.getMonth() + 1,
      0
    );
    this.search();
    this.isFilterApplied = 'default';
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  sort(params: NzTableQueryParams): void {
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

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        obj1['Residence Type'] = this.dataList11[i]['RESIDENCE_TYPE_NAME'];
        obj1['Vacant Date'] = this.dataList11[i]['FLAT_STATUS_DATE'];
        obj1['City'] = this.dataList11[i]['CITY_NAME'];
        obj1['Area'] = this.dataList11[i]['AREA_NAME'];
        obj1['Building'] = this.dataList11[i]['BUILDING_NAME'];
        obj1['Floor'] = this.dataList11[i]['FLOOR_NAME'];
        obj1['Quarter Name'] = this.dataList11[i]['NAME'];
        if (this.dataList11[i]['AVAILABLE_STATUS'] == 'A') {
          obj1['Status'] = 'Available';
        } else if (this.dataList11[i]['AVAILABLE_STATUS'] == 'B') {
          obj1['Status'] = 'Booked';
        } else if (this.dataList11[i]['AVAILABLE_STATUS'] == 'U') {
          obj1['Status'] = 'Under Maintainance';
        }

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Quarter Vacant Details Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
