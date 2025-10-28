import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-caretakerwise-flat-detailed-report',
  templateUrl: './caretakerwise-flat-detailed-report.component.html',
  styleUrls: ['./caretakerwise-flat-detailed-report.component.css'],
  providers: [DatePipe],
})
export class CaretakerwiseFlatDetailedReportComponent implements OnInit {
  formTitle = 'Caretaker wise Quarter Detailed  Report';

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  dataListForExport: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  current = new Date();
  YEAR1: any = new Date();

  MONTH: any = new Date().getMonth() + 1;
  EmployeeName: any = [];
  EMPLOYEE: any;
  ResidenceTypeData: any = [];
  CaretakerData: any = [];
  CityData: any = [];
  AreaData: any = [];
  BuildingData: any = [];
  FloorData: any = [];
  FlatData: any = [];
  CaretakerName: any = [];

  ResidenceType: any = [];
  City: any = [];
  Area: any = [];
  Building: any = [];
  Floor: any = [];
  STATUS: any;
  Flat: any = [];

  columns: string[][] = [
    ['NAME', 'NAME'],
    ['FLOOR_NAME', 'FLOOR_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['CITY_NAME', 'CITY_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['CARETAKER_NAME', 'CARETAKER_NAME'],
  ];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  constructor(
    private api: APIServicesService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    // this.applyFilter();

    this.api.getresidenceType(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.ResidenceTypeData = data1['data'];
      },
      (err) => { }
    );

    this.api.getCityMaster(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.CityData = data1['data'];
      },
      (err) => { }
    );

    this.api.getareamaster(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.AreaData = data1['data'];
      },
      (err) => { }
    );

    this.api.getBuildingMaster(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.BuildingData = data1['data'];
      },
      (err) => { }
    );

    this.api.getFloorMaster(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.FloorData = data1['data'];
      },
      (err) => { }
    );

    this.api.getQuarterMaster(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.FlatData = data1['data'];
      },
      (err) => { }
    );

    this.api.getmappinguser(0, 0, '', '', ' AND ROLE_ID=14').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CaretakerData = data['data'];
        }
      },
      (err) => { }
    );
  }
  changecast(event: any) { }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  keyup(event: any) {
    this.search(true);
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  stages: any = [];
  separatedIds: number[];
  concatenatedIds: string;
  applyFilter() {
    this.filterQuery = '';
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      this.filterQuery = likeQuery;
      //
    }

    this.YEAR1 = this.datePipe.transform(this.YEAR1, 'yyyy');

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.filterQuery = '';

    if (
      this.CaretakerName != null &&
      this.CaretakerName != '' &&
      this.CaretakerName.length != 0
    ) {
      this.filterQuery += ' AND CARETAKER_ID IN (' + this.CaretakerName + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (
      this.ResidenceType != null &&
      this.ResidenceType != '' &&
      this.ResidenceType.length != 0
    ) {
      this.filterQuery +=
        ' AND RESIDENCE_TYPE_ID IN (' + this.ResidenceType + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (this.City != null && this.City != '' && this.City.length != 0) {
      this.filterQuery += ' AND CITY_ID IN (' + this.City + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (this.Area != null && this.Area != '' && this.Area.length != 0) {
      this.filterQuery += ' AND AREA_ID IN (' + this.Area + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (
      this.Building != null &&
      this.Building != '' &&
      this.Building.length != 0
    ) {
      this.filterQuery += ' AND BUILDING_ID IN (' + this.Building + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (this.Floor != null && this.Floor != '' && this.Floor.length != 0) {
      this.filterQuery += ' AND FLOOR_ID IN (' + this.Floor + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }
    if (this.Flat != null && this.Flat != '' && this.Flat.length != 0) {
      this.filterQuery += ' AND ID IN (' + this.Flat + ')';
    } else {
      this.filterQuery = this.filterQuery;
    }

    if (this.STATUS != null && this.STATUS != undefined) {
      this.filterQuery += " AND AVAILABLE_STATUS='" + this.STATUS + "'";
    } else {
      this.filterQuery = this.filterQuery;
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.YEAR1 = new Date();

    this.MONTH = new Date().getMonth() + 1;

    this.EMPLOYEE = '';
    this.ResidenceType = [];
    this.City = [];
    this.Area = [];
    this.Building = [];
    this.Floor = [];
    this.Flat = [];
    this.CaretakerName = [];
    this.STATUS = undefined;

    this.dataList = [];

    this.search();
  }

  excelData: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }

  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.separatedIds = this.ResidenceType;
    this.concatenatedIds = this.separatedIds.join(', ');

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .CaretakerwiseFlatDetailedReports(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (err) => { }
        );
    } else {
      this.exportLoading = false;

      this.api
        .CaretakerwiseFlatDetailedReports(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.excelData = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
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
    this.search(false);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.excelData.length > 0) {
      for (var i = 0; i < this.excelData.length; i++) {
        obj1['Care Taker Name'] = this.excelData[i]['CARETAKER_NAME'];
        obj1['Residence Type'] = this.excelData[i]['RESIDENCE_TYPE_NAME'];
        obj1['City Name '] = this.excelData[i]['CITY_NAME'];
        obj1['Area Name'] = this.excelData[i]['AREA_NAME'];
        obj1['Building Name '] = this.excelData[i]['BUILDING_NAME'];
        obj1['Floor Name'] = this.excelData[i]['FLOOR_NAME'];
        obj1['Quarter Name'] = this.excelData[i]['NAME'];
        if (this.excelData[i]['AVAILABLE_STATUS'] == 'A') {
          obj1['Status'] = 'Available';
        } else if (this.excelData[i]['AVAILABLE_STATUS'] == 'B') {
          obj1['Status'] = 'Booked';
        } else if (this.excelData[i]['AVAILABLE_STATUS'] == 'AC') {
          obj1['Status'] = ' Acceptance Form Filled ';
        } else if (this.excelData[i]['AVAILABLE_STATUS'] == 'UN') {
          obj1['Status'] = ' Under Maintenance';
        }

        arry1.push(Object.assign({}, obj1));
        if (i == this.excelData.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Caretaker wise Quarter Detailed  Report' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
          );
        }
      }
    } else {
      this.message.error('There is a no data', '');
    }
  }
}
