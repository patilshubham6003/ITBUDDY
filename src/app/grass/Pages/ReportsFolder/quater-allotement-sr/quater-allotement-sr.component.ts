import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-quater-allotement-sr',
  templateUrl: './quater-allotement-sr.component.html',
  styleUrls: ['./quater-allotement-sr.component.css'],
  providers: [DatePipe],
})
export class QuaterAllotementSRComponent implements OnInit {
  formTitle = 'Quater Allotment Report ';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'RESIDENCE_TYPE_ID';
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
    ['YEAR', 'YEAR'],
    ['MONTH', 'MONTH'],
  ];

  CITY_ID: any = [];
  AREA_ID: any = [];
  BUILDING_ID: any = [];
  cityList: any = [];
  areaList: any = [];
  BuildingList: any = [];
  selectmonth: any = new Date();
  selectyear: any = new Date();
  MONTH: any;
  YEAR: any;
  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  Monthrange: any = [];

  startdatenow = new Date();
  ngOnInit(): void {
    this.getResidenceTypestart();
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
      this.sortKey = 'RESIDENCE_TYPE_ID';
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

    this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');

    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != ''
    ) {
      var stringconvert = this.RESIDENCE_TYPE_IDD.join(',');
      filterQuery1 = ' AND RESIDENCE_TYPE_ID IN ( ' + stringconvert + ' )';
    }
    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .QuaterAllotementSReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
          ' AND MONTH = ' +
          this.MONTH +
          ' AND YEAR = ' +
          this.YEAR +
          filterQuery1
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
        .QuaterAllotementSReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery +
          ' AND MONTH = ' +
          this.MONTH +
          ' AND YEAR = ' +
          this.YEAR +
          filterQuery1
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
      this.selectmonth == null ||
      this.selectmonth == undefined ||
      this.selectmonth == ''
    ) {
      this.message.error('Please Select Month', '');
    } else if (
      this.selectyear == null ||
      this.selectyear == undefined ||
      this.selectyear == ''
    ) {
      this.message.error('Please Select Year', '');
    } else {
      this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
      this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');
      this.isFilterApplied = 'primary';
      this.search();
    }
  }

  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
    }

    this.selectmonth = new Date();
    this.selectyear = new Date();
    this.MONTH = this.datepipe.transform(this.selectmonth, 'MM');
    this.YEAR = this.datepipe.transform(this.selectyear, 'yyyy');
    this.CITY_ID = [];
    this.AREA_ID = [];
    this.BUILDING_ID = [];

    this.Monthrange = [];
    let newdate = new Date();
    this.search();
    this.isFilterApplied = 'default';
  }

  edit1(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'flatVacantOrder/' + pdfURL;
    window.open(fileUrl);
  }
  edit2(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'draftWaitingList/' + pdfURL;
    window.open(fileUrl);
  }
  edit3(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'finalList/' + pdfURL;
    window.open(fileUrl);
  }
  edit4(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'draftAllotmentList/' + pdfURL;
    window.open(fileUrl);
  }
  edit5(pdfURL: any) {
    const fileUrl = this.api.retriveimgUrl + 'finalAllotmentList/' + pdfURL;
    window.open(fileUrl);
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'RESIDENCE_TYPE_ID';
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
    this.search();
  }

  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    if (this.dataList11.length > 0) {
      for (var i = 0; i < this.dataList11.length; i++) {
        obj1['Month'] = this.dataList11[i]['MONTH'];
        obj1['Year'] = this.dataList11[i]['YEAR'];
        obj1['Residence Type Name'] = this.dataList11[i]['RESIDENCE_TYPE_NAME'];

        obj1['Vacant Report Datetime'] = this.datepipe.transform(
          this.dataList11[i]['VACANT_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        // obj1['Vacant Report File'] = this.dataList11[i]['VACANT_FILE_URL'];
        obj1['Draft Seniority Datetime'] = this.datepipe.transform(
          this.dataList11[i]['DRAFT_SEN_PUBLISH_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        // obj1['Draft Seniority File'] = this.dataList11[i]['DRAFT_SEN_FILE_URL'];
        obj1['Final Seniority Datetime'] = this.datepipe.transform(
          this.dataList11[i]['FINAL_SEN_PUBLISH_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        // obj1['Final Seniority File'] = this.dataList11[i]['FINAL_SEN_FILE_URL'];
        obj1['Preference Start Datetime'] = this.datepipe.transform(
          this.dataList11[i]['PREFERENCE_START_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        obj1['Preference End Datetime'] = this.datepipe.transform(
          this.dataList11[i]['PREFERENCE_END_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        obj1['Draft Allotment Datetime'] = this.datepipe.transform(
          this.dataList11[i]['DRAFT_ALLOTMENT_PUBLISH_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        // obj1['Draft Allotment File'] = this.dataList11[i]['DRAFT_ALLOTMENT_FILE_URL'];
        obj1['Final Allotment Datetime'] = this.datepipe.transform(
          this.dataList11[i]['FINAL_ALLOTMENT_PUBLISH_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        // obj1['Final Allotment File'] = this.dataList11[i]['FINAL_ALLOTMENT_FILE_URL'];
        obj1['Acceptance Start Datetime'] = this.datepipe.transform(
          this.dataList11[i]['ACCEPTANCE_START_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );
        obj1['Acceptance End Datetime'] = this.datepipe.transform(
          this.dataList11[i]['ACCEPTANCE_END_DATE_TIME'],
          'dd-MM-yyyy HH:mm:ss'
        );

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Quater Allotment Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
