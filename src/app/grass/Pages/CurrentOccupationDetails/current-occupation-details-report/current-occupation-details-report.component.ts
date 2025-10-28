import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ExportService } from 'src/app/Service/export.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-current-occupation-details-report',
  templateUrl: './current-occupation-details-report.component.html',
  styleUrls: ['./current-occupation-details-report.component.css'],
  providers: [DatePipe]
})
export class CurrentOccupationDetailsReportComponent {

  dateFormat = "dd/MMM/yyyy";
  formTitle = "Current Occupancy Details";
  fileName = "CurrentOccupationDetailedReport.xlsx";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  exportToExcelDataList = [];
  loadingRecords = true;
  exportToExcelLoading = false;
  sortKey: string = "ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["EMPLOYEE_NAME", "Employee Name"], ["DESIGNATION", "Email Id"], ["EMPLOYEE_CODE", "Mobile No."],
  ["FLAT_NAME", "Subject"], ["AREA_NAME", "Message"], ["RESIDENCE_TYPE_NAME", "Message"], ["AREA_NAME", "Message"], ["AREA_NAME", "Message"]];
  isSpinning = false;
  loadingFilterEmployees = true;
  filterClass: string = "filter-visible";
  date: Date[] = [];
  startValue: any = new Date();
  endValue: any = new Date();
  endOpen = false;
  // CREATED_MODIFIED_DATE:Date[]=[];


  constructor(private _exportService: ExportService, private api: APIServicesService, private datePipe: DatePipe, private message: NzNotificationService, private cookie: CookieService) { }

  ngOnInit() {
    // this.date[0] = new Date();
    // this.date[1] = new Date();
    //  this.search();
    this.isFilterApplied = "default";
    this.filterClass = "filter-invisible";
    this.getResidenceType()
    this.getAreaMaster()
    this.getBuildingMaster()
  }
  ResidenceType: any = []

  getResidenceType() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        this.isSpinning = false;
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          // if (this.data.ID) {
          //   this.generatelist();
          // }
        }
      },
      (err) => {
        this.isSpinning = false;

      }
    );
  }

  RESIDENCE_TYPE: any = []
  AREA_ID: any = []
  building: any
  BUILDING_ID: any = []
  getBuildingMaster() {
    this.isSpinning = true;
    this.api.getBuildingMaster(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        this.isSpinning = false;
        if (data['code'] == 200) {

          this.building = data['data'];
          this.isSpinning = false;
          // if (this.data.ID) {
          //   this.generatelist();
          // }
        }
      },
      (err) => {
        this.isSpinning = false;

      }
    );
  }
  area: any = []
  getAreaMaster() {
    this.isSpinning = true;
    this.api.getareamaster(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.area = data['data'];
          this.isSpinning = false;
          // if (this.data.ID) {
          //   this.generatelist();
          // }
        }
      },
      (err) => {
        this.isSpinning = false;

      }
    );
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('searchBtn');
    if (element != null) element.focus();
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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
  orgId = this.cookie.get('orgId');
  exportLoading: boolean = false;
  importInExcel() {
    this.search(true, true);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    // this.filterQuery = "";
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";
    if (this.searchText != "") {
      likeQuery = " AND (";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      this.filterQuery += likeQuery.substring(0, likeQuery.length - 3) + ")";
    }

    var residenceType = "";
    if ((this.RESIDENCE_TYPE != undefined) && (this.RESIDENCE_TYPE.length != 0)) {
      residenceType = " AND RESIDENCE_TYPE IN ('" + this.RESIDENCE_TYPE + "'" + ")";
    }
    else {
      residenceType = "";
    }

    var AreaFilter = "";
    if ((this.AREA_ID != undefined) && (this.AREA_ID.length != 0)) {
      AreaFilter = " AND AREA_ID IN ('" + this.AREA_ID + "'" + ")";
    }
    else {
      AreaFilter = "";
    }

    var buildingFilter = "";
    if ((this.BUILDING_ID != undefined) && (this.BUILDING_ID.length != 0)) {
      buildingFilter = " AND BUILDING_ID IN ('" + this.BUILDING_ID + "'" + ")";
    }
    else {
      buildingFilter = "";
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;
      this.api.getCurrentOccupationDetailedReport(this.pageIndex, this.pageSize, this.sortKey, sort, this.filterQuery + residenceType + AreaFilter + buildingFilter + ' AND FLAT_ID!=0').subscribe((data: any) => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.isFilterApplied = 'primary';
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';

        }

      }, err => {
        this.isSpinning = false;

      });

    }
    else {
      this.exportLoading = true;
      this.api.getCurrentOccupationDetailedReport(0, 0, this.sortKey, sort, this.filterQuery + residenceType + AreaFilter + buildingFilter + ' AND FLAT_ID!=0').subscribe((data: any) => {
        if (data['code'] == 200) {
          this.exportLoading = false;
          this.exportToExcelDataList = data['data'];
          this.convertInExcel();
        }
      },
        err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
    }
  }

  keyup(event: any) {
    this.search();
  }

  getDaysArray(start: any, end: any) {

    for (
      var arr: any = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datePipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }

  timeDefaultValue = setHours(new Date(), 0);

  dates: any = [];
  today2 = new Date();


  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose(): void {
    this.search();
  }

  clearFilter() {

    this.date = [];
    //  this.date[0] = new Date();
    //  this.date[1] = new Date();
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = "";
    this.search(true);
  }

  applyFilter() {

    this.loadingRecords = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    }
    catch (error) {
      sort = '';
    }

    this.search(true);
    this.filterClass = "filter-invisible";

    this.isFilterApplied = "primary";

  }

  showFilter(): void {
    if (this.filterClass === "filter-visible")
      this.filterClass = "filter-invisible";

    else
      this.filterClass = "filter-visible";
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.exportToExcelDataList.length; i++) {
      obj1['Employee Name'] = this.exportToExcelDataList[i]['EMPLOYEE_NAME'] ? this.exportToExcelDataList[i]['EMPLOYEE_NAME'] : '_';
      obj1['Employee Code'] = this.exportToExcelDataList[i]['EMPLOYEE_CODE'] ? this.exportToExcelDataList[i]['EMPLOYEE_CODE'] : '_';
      obj1['Designation'] = this.exportToExcelDataList[i]['DESIGNATION'] ? this.exportToExcelDataList[i]['DESIGNATION'] : '_';

      obj1['Official Email Id'] = this.exportToExcelDataList[i]['EMAIL_ID'] ? this.exportToExcelDataList[i]['EMAIL_ID'] : '_';
      obj1['Official Mobile No.'] = this.exportToExcelDataList[i]['MOBILE_NO'] ? this.exportToExcelDataList[i]['MOBILE_NO'] : '_';
      obj1['Residence Type'] = this.exportToExcelDataList[i]['RESIDENCE_TYPE_NAME'] ? this.exportToExcelDataList[i]['RESIDENCE_TYPE_NAME'] : '_';
      obj1['Area'] = this.exportToExcelDataList[i]['AREA_NAME'] ? this.exportToExcelDataList[i]['AREA_NAME'] : '_';
      obj1['Building'] = this.exportToExcelDataList[i]['BUILDING_NAME'] ? this.exportToExcelDataList[i]['BUILDING_NAME'] : '_';
      obj1['Quarter Name'] = this.exportToExcelDataList[i]['FLAT_NAME'] ? this.exportToExcelDataList[i]['FLAT_NAME'] : '_';

      arry1.push(Object.assign({}, obj1));
      if (i == this.exportToExcelDataList.length - 1) {
        this._exportService.exportExcel(arry1, 'Current Occupancy Details Report' + this.datePipe.transform(new Date(), 'dd-MMM-yy'));
      }
    }
  }


}
