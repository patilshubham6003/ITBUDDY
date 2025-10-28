import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ExportService } from 'src/app/Service/export.service';
import { payLevelUpgrade } from '../../QUARTER/QuarterData';

@Component({
  selector: 'app-pay-level-upgrade-list',
  templateUrl: './pay-level-upgrade-list.component.html',
  styleUrls: ['./pay-level-upgrade-list.component.css'],
  providers: [DatePipe],
})
export class PayLevelUpgradeListComponent implements OnInit {
  formTitle = 'Manage Employee Upgrade Details';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: payLevelUpgrade = new payLevelUpgrade();
  userid: any;
  roleid: any;
  Checkrole: boolean = true;

  columns: string[][] = [
    ['NEW_GRADE_PAY_LEVEL', 'NEW_GRADE_PAY_LEVEL'],
    ['NEW_DESIGNATION_NAME', 'NEW_DESIGNATION_NAME'],
    ['RESIDENCE_TYPE_NAME', 'Residence Type'],
    ['OLD_GRADE_PAY_LEVEL', 'Floor Name'],
    ['OLD_DESIGNATION_NAME', 'Designation'],
    ['EMPLOYEE_CODE', 'Employee Name'],
    ['EMPLOYEE_NAME', 'Employee Name'],

  ];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer, private exportService: ExportService,
  ) { }

  inspectorname: any = '';
  ngOnInit(): void {
    this.getallcities();
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.getResidenceTypestart();

  }
  applyFilter() {
    this.search(true);
    this.isFilterApplied = 'primary';
  }
  clearFilter() {
    this.statusFilter = '';
    this.filterQuery1 = '';
    this.city = '';
    this.building = '';
    this.caretakerid = '';
    this.BUILDING_ID = [];
    this.FLOOR_ID = [];
    this.CITY_ID = [];
    this.AVAILABLE_STATUS = null;
    this.AREA_ID = [];
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceType111.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
    }
    this.search(true);
    this.isFilterApplied = 'default';
  }
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }
  RESIDENCE_TYPE_IDD: any = [];
  AVAILABLE_STATUS: any;
  // ROOM_TYPE: any;
  likeQuery: any = '';

  statusFilter: any = '';
  filterQuery1: any = '';
  city: any = '';
  building: any = '';
  caretakerid: any = '';
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.likeQuery = '';

    if (this.searchText != '') {
      this.likeQuery = ' AND (';
      this.columns.forEach((column) => {
        this.likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      this.likeQuery = this.likeQuery.substring(0, this.likeQuery.length - 2);
      this.likeQuery = this.likeQuery + ') ';
    } else {
      this.likeQuery = '';
    }
    this.filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null
    ) {
      this.filterQuery1 =
        ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
    } else {
      this.filterQuery1 = '';
    }
    this.city = '';
    if (
      this.CITY_ID != undefined &&
      this.CITY_ID != '' &&
      this.CITY_ID != null
    ) {
      this.city = ' AND ( NEW_DESIGNATION_ID in (' + this.CITY_ID + ') OR OLD_DESIGNATION_ID in (' + this.CITY_ID + '))';
    } else {
      this.city = '';
    }
    this.building = '';
    if (
      this.BUILDING_ID != undefined &&
      this.BUILDING_ID != '' &&
      this.BUILDING_ID != null
    ) {
      this.building = ' AND ( NEW_GRADE_PAY_LEVEL_ID in (' + this.BUILDING_ID + ') OR OLD_GRADE_PAY_LEVEL_ID in (' + this.BUILDING_ID + '))';
    } else {
      this.building = '';
    }
    this.loadingRecords = true;

    this.api
      .getpayLevelUpgrade(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.likeQuery +
        this.filterQuery1 +
        this.statusFilter +
        this.building +
        this.city
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isFilterApplied = 'primary';
            this.filterClass = 'filter-invisible';
          } else {
            this.loadingRecords = false;
            this.totalRecords = 1;
            this.dataList = [];
            this.isFilterApplied = 'primary';
            this.filterClass = 'filter-invisible';
          }
        },
        (err) => {
          this.totalRecords = 1;
          this.dataList = [];
          this.loadingRecords = false;
          this.message.error('Failed To Get data', '');
        }
      );
  }

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

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Upgrade Employee Details';
    this.drawerData = new payLevelUpgrade();
    this.drawerVisible = true;
  }

  edit(data: payLevelUpgrade): void {
    this.drawerTitle = 'Upgrade Employee Details';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }


  pdfDownload: boolean = false;
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }
  // RESIDENCE_TYPE_IDD: any
  ResidenceType111: any;
  getResidenceType() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
        }
      },
      (err) => { }
    );
  }
  getResidenceTypestart() {
    this.RESIDENCE_TYPE_IDD = [];
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
          for (var i = 0; i < this.ResidenceType111.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
          }
          this.applyFilter();
        }
      },
      (err) => { }
    );
  }
  // BlockList:any;
  areaList: any;
  FloorNo: any;
  BuildingList: any;
  cityList: any;
  CITY_ID: any;
  AREA_ID: any;
  BUILDING_ID: any;
  FLOOR_ID: any;

  getallcities() {
    this.api.getallDesignation(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        }
      },
      (err) => { }
    );

    this.api.getAllGradePayLevel(0, 0, 'ID', 'desc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.BuildingList = data['data'];
        }
      },
      (err) => { }
    );
  }

  dataList1: any = [];
  loadexcel: boolean = false;
  convertInExcel() {
    this.loadexcel = true;
    this.building +
      this.api.getpayLevelUpgrade(0, 0, this.sortKey, 'desc', this.likeQuery + this.filterQuery1 + this.statusFilter + this.building + this.city).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadexcel = false;
            this.dataList1 = data['data'];
            if (this.dataList1.length > 0) {
              var arry1: any = [];
              var obj1: any = new Object();
              if (this.dataList1.length > 0) {
                for (var i = 0; i < this.dataList1.length; i++) {
                  obj1['Employee Name'] = this.dataList1[i]['EMPLOYEE_NAME'] ? this.dataList1[i]['EMPLOYEE_NAME'] : '-';
                  obj1['Employee Code'] = this.dataList1[i]['EMPLOYEE_CODE'] ? this.dataList1[i]['EMPLOYEE_CODE'] : '-';
                  obj1['Residence Type'] = this.dataList1[i]['RESIDENCE_TYPE_NAME'] ? this.dataList1[i]['RESIDENCE_TYPE_NAME'] : '-';
                  obj1['New Designation'] = this.dataList1[i]['NEW_DESIGNATION_NAME'] ? this.dataList1[i]['NEW_DESIGNATION_NAME'] : '-';
                  obj1['New Grade Pay Level'] = this.dataList1[i]['NEW_GRADE_PAY_LEVEL'] ? this.dataList1[i]['NEW_GRADE_PAY_LEVEL'] : '-';
                  obj1['New Present Pay Level Date'] = this.dataList1[i]['NEW_PRESENT_PAY_LEVEL_DATE'] ? this.datepipe.transform(this.dataList1[i]['NEW_PRESENT_PAY_LEVEL_DATE'], 'dd/MMM/yyyy') : '-';
                  obj1['Old Designation'] = this.dataList1[i]['OLD_DESIGNATION_NAME'] ? this.dataList1[i]['OLD_DESIGNATION_NAME'] : '-';
                  obj1['Old Grade Pay Level'] = this.dataList1[i]['OLD_GRADE_PAY_LEVEL'] ? this.dataList1[i]['OLD_GRADE_PAY_LEVEL'] : '-';
                  obj1['Old Present Pay Level Date'] = this.dataList1[i]['OLD_PRESENT_PAY_LEVEL_DATE'] ? this.datepipe.transform(this.dataList1[i]['OLD_PRESENT_PAY_LEVEL_DATE'], 'dd/MMM/yyyy') : '-';
                  arry1.push(Object.assign({}, obj1));
                  if (i == this.dataList1.length - 1) {
                    this.exportService.exportExcel1(arry1, 'Upgrade Employee Details ' + this.datepipe.transform(new Date(), 'dd/MMM/yyyy'));
                  }
                }
              } else {
                this.message.error('Data Not Found', '');
              }
            } else {
              this.message.error('Data Not Found', '');
            }
          } else {
            this.loadexcel = false;
            this.dataList1 = [];
            this.message.error("Something went wrong, please try again later", "");
          }
        }, (err) => {
          this.loadexcel = false;
          this.dataList1 = [];
          this.message.error("Something went wrong, please try again later", "");
        });
  }
}