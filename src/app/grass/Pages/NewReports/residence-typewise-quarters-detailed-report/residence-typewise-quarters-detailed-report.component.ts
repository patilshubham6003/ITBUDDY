import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-residence-typewise-quarters-detailed-report',
  templateUrl: './residence-typewise-quarters-detailed-report.component.html',
  styleUrls: ['./residence-typewise-quarters-detailed-report.component.css'],
  providers: [DatePipe],
})
export class ResidenceTypewiseQuartersDetailedReportComponent {
  formTitle = 'Residence Type Wise Quarter Details';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = '';
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
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['FLOOR_NAME', 'FLOOR_NAME'],
    ['NAME', 'NAME']
  ];

  CITY_ID: any = [];
  AREA_ID: any = [];
  CARETAKER_ID: any = [];

  BUILDING_ID: any = [];
  cityList: any = [];
  areaList: any = [];
  BuildingList: any = [];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe, public router: Router,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }
  MONTH: any;
  YEAR: any;
  Monthrange: any = [];
  users: any = [];
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
    this.getResidenceTypestart();
    this.changecity();
  }
  showdash() {
    this.router.navigateByUrl('/grass/reports_list')
  }
  changecity() {
    this.api.getareamaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
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
      .getBuildingMaster(0, 0, '', '', ' AND STATUS = 1 AND AREA_ID in(' + event + ')')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.BuildingList = data['data'];
          }
        },
        (err) => { }
      );
  }
  FloorNo: any = []
  FLOOR_ID: any;

  ChangeBuilding(event: any) {
    this.api
      .getFloorMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND BUILDING_ID IN (' + event + ')'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.FloorNo = data['data'];
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
      this.sortKey = '';
      this.sortValue = 'asc';
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'asc';
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
    var Areaname = '';
    if (
      this.AREA_ID != null &&
      this.AREA_ID != undefined &&
      this.AREA_ID != ''
    ) {
      var stringconvert2 = this.AREA_ID.join(',');
      Areaname = ' AND AREA_ID IN ( ' + stringconvert2 + ' )';
    }
    if (
      this.BUILDING_ID != null &&
      this.BUILDING_ID != undefined &&
      this.BUILDING_ID != ''
    ) {
      var stringconvert2 = this.BUILDING_ID.join(',');
      Areaname += ' AND BUILDING_ID IN ( ' + stringconvert2 + ' )';
    }
    if (
      this.FLOOR_ID != null &&
      this.FLOOR_ID != undefined &&
      this.FLOOR_ID != ''
    ) {
      var stringconvert2 = this.FLOOR_ID;
      Areaname += ' AND FLOOR_ID IN ( ' + stringconvert2 + ' )';
    }

    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .ResidenceTypewiseQuartersDetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery + filterQuery1 + Areaname
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
        .ResidenceTypewiseQuartersDetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery + filterQuery1 + Areaname
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
      this.RESIDENCE_TYPE_IDD == null ||
      this.RESIDENCE_TYPE_IDD == undefined ||
      this.RESIDENCE_TYPE_IDD == '' || this.RESIDENCE_TYPE_IDD.length == 0
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {


      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }
    this.AREA_ID = [];
    this.BUILDING_ID = [];
    this.FLOOR_ID = null;
    this.CARETAKER_ID = [];
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
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
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
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        obj1['Residence Type'] = this.dataList11[i]['RESIDENCE_TYPE_NAME'];
        obj1['Area Name'] = this.dataList11[i]['AREA_NAME'];
        obj1['Building Name'] = this.dataList11[i]['BUILDING_NAME'];
        obj1['Floor'] = this.dataList11[i]['FLOOR_NAME'];
        obj1['Quarter Name'] = this.dataList11[i]['NAME'];
        if (this.dataList11[i]['STATUS'] == 1) {
          obj1['Status'] = 'On';
        } else {
          obj1['Status'] = 'Off';
        }

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Residence Type Wise Quarter Details ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
