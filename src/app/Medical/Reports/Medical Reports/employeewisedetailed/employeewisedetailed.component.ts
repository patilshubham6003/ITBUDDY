import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-employeewisedetailed',
  templateUrl: './employeewisedetailed.component.html',
  styleUrls: ['./employeewisedetailed.component.css'],
})
export class EmployeewisedetailedComponent implements OnInit {
  formTitle = 'Employee Wise Detailed Report';

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

  columns: string[][] = [
    ['INSPECTOR_NAME', 'Inspector Name'],
    ['EMPLOYEE_NAME', 'Applicant Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    // ['CLAIM_CLAIM_STAGE_NAME', 'Stage Name'],
    ['BILL_FILIING_DATE', 'Date Of Bill'],
    ['HOSPITAL_TYPE', 'Hospital Type'],
    ['HOSPITAL_NAME', 'Hospital Name'],
    // ["CLAIMED_AMOUNT", "Amount Of Reimbursement Claimed"],
    ['ADMISSIBLE_AMOUNT', 'Amount Of Reimbursement Admissible'],
    ['ADVANCE_AMOUNT', 'Advance Amount'],
    ['TREATEMENT_TYPE', 'Treatment Type'],
    // ["DESIGNATION_OFFICE", "Designation & Office"],
    ['DDO_OF_THE_OFFICIAL', 'DDO Of Official'],
    ['RELATION_WITH_PATIENT', 'Patients Relation'],
    ['BENEFICIARY_TYPE', 'CGHS/CS (MA) Beneficiary'],
    ['EMERGENCY_TREATEMENT', 'Emergency Treatment Availed'],
    ['CGHS_AMA_REFERENCE_DATE', "Date Of CGHS/AMA's Reference"],
    ['IS_BILL_FILLED_IN_TIME', 'Bill Is Filled In Time'],
    ['NATURE_OF_TREATMENT', 'Nature Of Treatment'],
    // ["PERIOD_OF_TREATMENT", "Period Of Treatment"],
    // ["NET_PAYABLE_AMOUNT", "Net Amount Payable/Recoverable"],
    ['CGHS_AMA_REFERENCE_NO', 'CGHS Number'],
  ];

  STATUS: any = 'AL';
  BRANCH: any = [];

  isSpinning = false;
  filterClass: string = 'filter-invisible';

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  HOSPITAL_TYPE: any = [];
  // CLAIM_STAGE_NAME: any = [];
  SALES_MANAGER_ID: any = [];
  START_DATE: any;
  END_DATE: any;
  DATE: any = [];
  current = new Date();
  INSPECTOR_NAME: any = [];
  BENIFICIARY_TYPE: any = [];
  constructor(
    private api: ApiService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private _exportService: ExportService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.search();
    // this.stageName();
    this.inspectorName();
  }

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
  // stageName() {
  //   this.api.getStage(0, 0, '', 'asc', 'AND STATUS=1').subscribe(
  //     (data1) => {
  //
  //       this.stages = data1['data'];
  //     },
  //     (err) => {
  //
  //     }
  //   );
  // }
  inspectorname: any = [];
  inspectorName() {
    this.api.getAllUsers(0, 0, '', 'asc', '').subscribe(
      (data1) => {
        this.inspectorname = data1['data'];
      },
      (err) => {}
    );
  }

  applyFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'primary';
    this.loadingRecords = false;
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    if (this.SALES_MANAGER_ID != undefined) {
      this.SALES_MANAGER_ID = this.SALES_MANAGER_ID;
    }
    this.DATE[0] = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
    this.DATE[1] = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');

    if (this.DATE[0] != null) {
      this.START_DATE = this.DATE[0];
    }

    if (this.DATE[1] != null) {
      this.END_DATE = this.DATE[1];
    }

    this.search();
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.DATE = [];
    this.BENIFICIARY_TYPE = [];
    this.HOSPITAL_TYPE = [];
    this.INSPECTOR_NAME = [];
    // this.CLAIM_STAGE_NAME = [];
    this.DATE[0] = new Date(
      this.current.getFullYear() + '-' + (this.current.getMonth() + 1) + '-01'
    );
    this.DATE[1] = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    );
    this.dataList = [];
    this.search();
  }

  inspector: any = [];
  exportLoading: boolean = false;
  importInExcel() {
    this.search(false, true);
  }
  search(reset: boolean = false, exportInExcel: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.DATE != undefined && this.DATE.length != 0) {
      this.START_DATE = this.datePipe.transform(this.DATE[0], 'yyyy-MM-dd');
      this.END_DATE = this.datePipe.transform(this.DATE[1], 'yyyy-MM-dd');
    }

    if (exportInExcel == false) {
      this.loadingRecords = true;

      this.api
        .employeewisedetailed(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          this.HOSPITAL_TYPE,
          // this.CLAIM_STAGE_NAME,
          this.INSPECTOR_NAME,
          this.BENIFICIARY_TYPE,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (err) => {}
        );
    } else {
      this.exportLoading = false;

      this.api
        .employeewisedetailed(
          0,
          0,
          this.sortKey,
          sort,
          this.filterQuery + likeQuery,
          this.HOSPITAL_TYPE,
          // this.CLAIM_STAGE_NAME,
          this.INSPECTOR_NAME,
          this.BENIFICIARY_TYPE,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.exportLoading = false;
              this.inspector = data['data'];
              this.convertInExcel();
            }
          },
          (err) => {
            if (err['ok'] == false) this.message.error('Server Not Found', '');
          }
        );
    }
  }

  // sort(sort: any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   if (this.sortValue == "descend") {
  //     this.sortValue = 'desc';
  //   } else {
  //     this.sortValue = 'asc'
  //   }
  //
  //   this.search(true);
  // }
  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
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
    this.search(false);
  }
  convertInExcel() {
    var arry1: any = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.inspector.length; i++) {
      obj1['Employee Name'] = this.inspector[i]['EMPLOYEE_NAME'];
      obj1['Employee Code'] = this.inspector[i]['EMPLOYEE_CODE'];
      obj1['Date Of Bill'] = this.inspector[i]['BILL_FILIING_DATE'];
      if (this.inspector[i]['HOSPITAL_TYPE'] == 'E') {
        obj1['Hospital Type'] = 'Empanelled';
      } else if (this.inspector[i]['HOSPITAL_TYPE'] == 'NE') {
        obj1['Hospital Type'] = 'Non Empanelled';
      } else {
        obj1['Hospital Type'] = 'Government';
      }
      obj1['Hospital Name'] = this.inspector[i]['HOSPITAL_NAME'];
      obj1['Amount Of Reimbursement Claimed'] =
        this.inspector[i]['CLAIMED_AMOUNT'];
      obj1['Amount Of Reimbursement Admissible'] =
        this.inspector[i]['ADMISSIBLE_AMOUNT'];
      obj1['Advance Taken'] = this.inspector[i]['ADVANCE_AMOUNT'];
      if (this.inspector[i]['TREATEMENT_TYPE'] == 'IT') {
        obj1['Treatment Type'] = 'Test Entitled & Indoor Treatment';
      } else if (this.inspector[i]['TREATEMENT_TYPE'] == 'OT') {
        obj1['Treatment Type'] = 'OPD Treatment';
      } else {
        obj1['Treatment Type'] =
          'OPD Treatment/Test Entitled & Indoor Treatment';
      }
      obj1['Designation & Office'] = this.inspector[i]['DESIGNATION/OFFICE'];
      obj1['DDO Of Official'] = this.inspector[i]['DDO_OF_THE_OFFICIAL'];
      obj1['Patients Relation'] = this.inspector[i]['RELATION_WITH_PATIENT'];
      if (this.inspector[i]['BENEFICIARY_TYPE'] == 'CG') {
        obj1['CGHS/CS (MA) Beneficiary'] = 'CGHS';
      } else {
        obj1['CGHS/CS (MA) Beneficiary'] = 'CS(MA)';
      }
      obj1['Emergency Treatment Availed'] =
        this.inspector[i]['EMERGENCY_TREATEMENT'];
      obj1["Date Of CGHS/AMA's Reference"] =
        this.inspector[i]['CGHS_AMA_REFERENCE_DATE'];
      obj1['Bill Is Filed In Time'] =
        this.inspector[i]['IS_BILL_FILLED_IN_TIME'];
      obj1['Nature Of Treatment'] = this.inspector[i]['NATURE_OF_TREATMENT'];
      obj1['Period Of Treatment'] = this.inspector[i]['PERIOD_OF_TREATMENT'];
      obj1['Net Amount Payable/Recoverable'] =
        this.inspector[i]['NET_PAYABLE_AMOUNT'];
      obj1['CGHS Number'] = this.inspector[i]['CGHS_AMA_REFERENCE_NO'];

      arry1.push(Object.assign({}, obj1));
      if (i == this.inspector.length - 1) {
        this._exportService.exportExcel(
          arry1,
          'Employee Wise Detailed Summary Report' +
            this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        );
      }
    }
  }
}
