import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { GrassexportserviceService } from 'src/app/grass/Services/grassexportservice.service';

@Component({
  selector: 'app-applicationdetailedreport',
  templateUrl: './applicationdetailedreport.component.html',
  styleUrls: ['./applicationdetailedreport.component.css'],
  providers: [DatePipe],
})
export class ApplicationdetailedreportComponent {
  formTitle = ' Application Detailed Report ';
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
  columns: string[][] = [
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['APPLICATION_DATETIME', 'APPLICATION_DATETIME'],
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['DOB', 'DOB'],
    ['DATE_JOINING', 'DATE_JOINING'],
    ['OFFICER_CAST', 'OFFICER_CAST'],
    ['STATUS', 'STATUS'],
  ];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private _exportService: GrassexportserviceService,
    private message: NzNotificationService
  ) { }

  MONTH2: any;
  MONTH1: any;
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
          // this.search();
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
      filterQuery1 = ' AND (';
      this.RESIDENCE_TYPE_IDD.forEach((RESIDENCE_TYPE_IDD) => {
        filterQuery1 +=
          " RESIDENCE_TYPE_ID like '%" + RESIDENCE_TYPE_IDD + "%' OR";
      });

      filterQuery1 = filterQuery1.substring(0, filterQuery1.length - 2) + ')';
    }

    if (exportInExcel == false) {
      this.isSpinning = true;
      this.loadingRecords = true;
      this.api
        .getapplicationdetailedReport(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
          " AND date(APPLICATION_DATETIME) BETWEEN '" +
          this.MONTH1 +
          "' AND '" +
          this.MONTH2 +
          "' " +
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
        .getapplicationdetailedReport(
          0,
          0,
          this.sortKey,
          sort,
          likeQuery +
          " AND date(APPLICATION_DATETIME) BETWEEN '" +
          this.MONTH1 +
          "' AND '" +
          this.MONTH2 +
          "' " +
          filterQuery1
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataList11 = data['data'];
              this.loadingRecords = false;
              this.exportLoading = false;
              this.convertInExcel();
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
              this.exportLoading = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
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
    this.Monthrange = [];
    let newdate = new Date();
    this.Monthrange[0] = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    this.Monthrange[1] = new Date(
      newdate.getFullYear(),
      newdate.getMonth() + 1,
      0
    );
    this.search(true);
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
        // obj1['Month'] = this.dataList11[i]['APPLICATION_DATETIME'];

        if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '01'
        ) {
          obj1['Month'] = 'January';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '02'
        ) {
          obj1['Month'] = 'February';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '03'
        ) {
          obj1['Month'] = 'March';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '04'
        ) {
          obj1['Month'] = 'April';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '05'
        ) {
          obj1['Month'] = 'May';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '06'
        ) {
          obj1['Month'] = 'June';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '07'
        ) {
          obj1['Month'] = 'July';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '08'
        ) {
          obj1['Month'] = 'August';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '09'
        ) {
          obj1['Month'] = 'September';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '10'
        ) {
          obj1['Month'] = 'October';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '11'
        ) {
          obj1['Month'] = 'November';
        } else if (
          this.datepipe.transform(
            this.dataList11[i]['APPLICATION_DATETIME'],
            'MM'
          ) == '12'
        ) {
          obj1['Month'] = 'December';
        }

        obj1['Year'] =
          this.dataList11[i]['APPLICATION_DATETIME'] != null
            ? this.datepipe.transform(
              this.dataList11[i]['APPLICATION_DATETIME'],
              'yyyy'
            )
            : this.dataList11[i]['APPLICATION_DATETIME'];

        obj1['Name'] = this.dataList11[i]['EMPLOYEE_NAME'];
        obj1['Date of Birth'] =
          this.dataList11[i]['DOB'] != null
            ? this.datepipe.transform(this.dataList11[i]['DOB'], 'dd/MM/yyyy')
            : this.dataList11[i]['DOB'];
        obj1['Date of Joining'] =
          this.dataList11[i]['DATE_JOINING'] != null
            ? this.datepipe.transform(
              this.dataList11[i]['DATE_JOINING'],
              'dd/MM/yyyy'
            )
            : this.dataList11[i]['DATE_JOINING'];
        // obj1['Caste'] = this.dataList11[i]['OFFICER_CAST'];
        if (this.dataList11[i]['OFFICER_CAST'] == 'GN') {
          obj1['Caste'] = 'General';
        } else if (this.dataList11[i]['OFFICER_CAST'] == 'SC') {
          obj1['Caste'] = 'SC';
        } else if (this.dataList11[i]['OFFICER_CAST'] == 'ST') {
          obj1['Caste'] = 'ST';
        }

        if (this.dataList11[i]['STATUS'] == 'A') {
          obj1['Status'] = 'Approved';
        } else if (this.dataList11[i]['STATUS'] == 'P') {
          obj1['Status'] = 'Pending';
        } else if (this.dataList11[i]['STATUS'] == 'R') {
          obj1['Status'] = 'Rejected';
        }

        arry1.push(Object.assign({}, obj1));
        if (i == this.dataList11.length - 1) {
          this._exportService.exportExcel(
            arry1,
            'Application Detailed Report ' +
            this.datepipe.transform(new Date(), 'dd/MM/yyyy')
          );
        }
      }
    } else {
      this.message.error('Data Not Found', '');
    }
  }
}
