import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import * as html2pdf from 'html2pdf.js';
import { HttpEventType } from '@angular/common/http';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { finalallocationdetailsemp } from 'src/app/grass/Models/FinalAllocationDetailsEmp';
import { acceptrejectallocation } from 'src/app/grass/Models/AcceptRejectAllocation';
import { TitleStrategy } from '@angular/router';
import { grass } from 'src/app/app.constant';
// import { finalallocationdetailsemp } from 'src/app/grass/Models/FinalAllocationDetailsEmp';
// import { acceptrejectallocation } from 'src/app/grass/Models/AcceptRejectAllocation';

@Component({
  selector: 'app-misinspector-view',
  templateUrl: './misinspector-view.component.html',
  styleUrls: ['./misinspector-view.component.css'],
  providers: [DatePipe],
})
export class MISInspectorViewComponent {
  current = 1;
  drawerVisible: boolean = false;
  drawerTitle!: string;
  // drawerData: MISInspectorModel = new MISInspectorModel();
  formTitle = 'Final Allotment Order Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  // isFilterApplied: string = 'default';
  Timmerstartloop: any = [];
  Timmerendloop: any = [];
  countdowndisable = true;
  isRecordLoading = false;
  columns: string[][] = [
    ['TYPE', 'Type'],
    ['PAY_BILL_SECTION', 'Pay Bill'],
  ];
  constructor(
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) { }

  roleid: any;
  userid: any;
  showCards = true;
  showNonAcceptanceCards = false;
  TechnicalShowdata = false;
  key: any = grass.key

  Monthrange: any = [];
  onChangemonth(result: Date[]): void {
    let fromdate: any = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    let Todate: any = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );

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
    this.key = grass.key;

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
    this.roleid = Number(sessionStorage.getItem('roleId'));
    this.userid = Number(sessionStorage.getItem('userId'));

    if (
      this.showCards == true &&
      this.showNonAcceptanceCards == false &&
      this.showPhysicalTechnical == false &&
      this.TechnicalShowdata == false
    ) {
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
      this.getResidenceTypes();
    } else {
    }
  }

  getResidenceTypes() {
    this.ResidenceTypelist = [];
    this.RESIDENCE_TYPE_ID = [];
    this.isRecordLoading = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1 ').subscribe(
      (data) => {
        if (data.code == 200) {
          this.ResidenceTypelist = data['data'];
          for (var i = 0; i < this.ResidenceTypelist.length; i++) {
            this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
          }
          this.applyFilter();
        } else {
          this.message.error('Failed To get Residence Type', '');
          this.isRecordLoading = false;
        }
      },
      (err) => {
        //
        this.message.error('Failed To get Residence Type', '');
        this.isRecordLoading = false;
      }
    );
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  filterClass: string = 'filter-invisible';
  isFilterApplied: any = 'default';
  RESIDENCE_TYPE_ID: any = [];
  joinedResidencetype: any;
  ResidenceTypelist: any = [];
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  YEAR2: any;

  applyFilter() {
    // if (this.RESIDENCE_TYPE_ID.length == 0) {
    //   this.message.error('Please Select Residence Type', '');
    // } else
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
      this.search(true);
    }
  }
  isSpinning = false;
  clearFilter() {
    this.RESIDENCE_TYPE_ID = [];
    for (var i = 0; i < this.ResidenceTypelist.length; i++) {
      this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
    }

    this.Monthrange = [];
    this.dataList = [];
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

  CheckStepno(emplist: any) {
    if (
      emplist.INSPECTOR_STATUS == 'P' &&
      (emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME == null ||
        emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME == undefined ||
        emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME == '') &&

      (emplist.ALLOTMENT_FINAL_LETTER == null ||
        emplist.ALLOTMENT_FINAL_LETTER == undefined ||
        emplist.ALLOTMENT_FINAL_LETTER == '') &&

      emplist.IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED == 0
    ) {
      return 0;
    } else if (
      emplist.INSPECTOR_STATUS == 'A' &&
      (emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME == null ||
        emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME == undefined ||
        emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME == '') &&

      (emplist.ALLOTMENT_FINAL_LETTER == null ||
        emplist.ALLOTMENT_FINAL_LETTER == undefined ||
        emplist.ALLOTMENT_FINAL_LETTER == '') &&

      emplist.IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED == 0
    ) {
      return 1;
    } else if (
      emplist.INSPECTOR_STATUS == 'A' &&
      emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != null &&
      emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != undefined &&
      emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != '' &&

      (emplist.ALLOTMENT_FINAL_LETTER == null ||
        emplist.ALLOTMENT_FINAL_LETTER == undefined ||
        emplist.ALLOTMENT_FINAL_LETTER == '') &&

      emplist.IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED == 0
    ) {
      return 2;
    }
    // else if (
    //   emplist.INSPECTOR_STATUS == 'A' &&
    //   emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != null &&
    //   emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != undefined &&
    //   emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != '' &&
    //   emplist.PRINT_AUTHORISATION_ORDER_DATE_TIME != null &&
    //   emplist.PRINT_AUTHORISATION_ORDER_DATE_TIME != undefined &&
    //   emplist.PRINT_AUTHORISATION_ORDER_DATE_TIME != '' &&
    //   (emplist.ALLOTMENT_FINAL_LETTER == null ||
    //     emplist.ALLOTMENT_FINAL_LETTER == undefined ||
    //     emplist.ALLOTMENT_FINAL_LETTER == '') &&
    //   (emplist.AUTHORISATION_OCCUPATION_LETTER == null ||
    //     emplist.AUTHORISATION_OCCUPATION_LETTER == undefined ||
    //     emplist.AUTHORISATION_OCCUPATION_LETTER == '') &&
    //   emplist.IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED == 0
    // ) {
    //   return 3;
    // } 
    else if (
      emplist.INSPECTOR_STATUS == 'A' &&
      emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != null &&
      emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != undefined &&
      emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != '' &&

      emplist.ALLOTMENT_FINAL_LETTER != null &&
      emplist.ALLOTMENT_FINAL_LETTER != undefined &&
      emplist.ALLOTMENT_FINAL_LETTER != '' &&

      emplist.IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED == 1
    ) {
      return 4;
    }
    // else if (emplist.INSPECTOR_STATUS == 'A'
    //   && (emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != null && emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != undefined && emplist.PRINT_ALLOTMENT_ORDER_DATE_TIME != '')
    //   && (emplist.PRINT_AUTHORISATION_ORDER_DATE_TIME != null && emplist.PRINT_AUTHORISATION_ORDER_DATE_TIME != undefined && emplist.PRINT_AUTHORISATION_ORDER_DATE_TIME != '')
    //   && (emplist.ALLOTMENT_FINAL_LETTER != null && emplist.ALLOTMENT_FINAL_LETTER != undefined && emplist.ALLOTMENT_FINAL_LETTER != '')
    //   && (emplist.AUTHORISATION_OCCUPATION_LETTER != null && emplist.AUTHORISATION_OCCUPATION_LETTER != undefined && emplist.AUTHORISATION_OCCUPATION_LETTER != '')
    //   && emplist.IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED == 1) {
    //   return 5;
    // }
    else {
      return 0;
    }
  }

  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  // keyup(event: any) {
  //   this.search();
  // }
  Filterquery = '';
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    this.dataList = [];
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
    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');
    this.joinedResidencetype = '';
    if (
      this.MONTH1 != null &&
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH2 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.RESIDENCE_TYPE_ID != undefined &&
      this.RESIDENCE_TYPE_ID != null &&
      this.RESIDENCE_TYPE_ID != ''
    ) {
      this.joinedResidencetype = this.RESIDENCE_TYPE_ID.join(',');
      this.Filterquery =
        " AND FILTER_DATE BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "'" +
        ' AND RESIDENCE_TYPE_ID IN (' +
        this.joinedResidencetype +
        ')';
    } else {
      this.Filterquery =
        " AND FILTER_DATE BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "'";
    }

    this.isRecordLoading = true;
    this.isSpinning = true;
    this.api
      .getFinalAllotmentDatalist11(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + this.Filterquery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isRecordLoading = false;
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
          this.isFilterApplied = 'primary';
          this.EmployeeAcceptancelist = [];
        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        }
      );
  }

  ViewShow(show: any) {
    this.DrawerVisibleTitle = 'Employee Quarter Acceptance List';
    this.DrawerVisiblechek = true;
    this.DrawerVisibleData = Object.assign({}, show);
  }

  DrawerVisiblechek = false;
  DrawerVisibleTitle = '';
  DrawerVisibleData: any;
  DrawerVisibleClose() {
    this.search();
    this.DrawerVisiblechek = false;
  }
  get closeCallDrawerVisible() {
    return this.DrawerVisibleClose.bind(this);
  }

  iii = 0;
  RESIDENCETYPE_NAME: any;
  EmployeeAcceptancelist: any = [];
  resitypedata: any;
  RESIDENCE_ID: any = ''
  showemployeedata(data: any) {
    this.RESIDENCETYPE_NAME = '';
    this.resitypedata = data;
    this.showCards = false;
    this.showNonAcceptanceCards = false;
    this.showPhysicalTechnical = false;
    this.TechnicalShowdata = false;
    this.EmployeeAcceptancelist = [];
    this.isRecordLoading = true;
    this.RESIDENCE_ID = data.RESIDENCE_TYPE_ID;
    this.RESIDENCETYPE_NAME = data.RESIDENCE_TYPE_NAME;
    this.api
      .getFlatTakenEmployeeList111(
        0,
        0,
        'ID',
        'desc',
        " AND TAKEN_STATUS = 'A' AND STATUS = 'Y' AND IS_ACCEPTANCE_LETTER_SUBMITED = '1' AND (INSPECTOR_STATUS = 'P' or INSPECTOR_STATUS = 'A') AND IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED = 0 AND FINAL_ALLOTMENT_MASTER_ID = " +
        data.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];

            if (this.EmployeeAcceptancelist.length > 0) {
              this.Timmerstartloop.length = this.EmployeeAcceptancelist.length;
              this.Timmerendloop.length = this.EmployeeAcceptancelist.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.EmployeeAcceptancelist.length;
              timeremaining2.length = this.EmployeeAcceptancelist.length;
              // starttimmer
              for (let ab = 0; ab < this.EmployeeAcceptancelist.length; ab++) {
                // let sapandate = this.dataList[ab]['OBJ_END_TIME_PERIOD'];
                let startdate =
                  this.EmployeeAcceptancelist[ab]['ACCEPTANCE_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining[ab] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerstartloop[ab] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining[ab] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval);
                    this.Timmerstartloop[ab] = 0;

                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
              // endtimmer
              for (let cc = 0; cc < this.EmployeeAcceptancelist.length; cc++) {
                let sapandate =
                  this.EmployeeAcceptancelist[cc]['ACCEPTANCE_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                let startdate =
                  this.EmployeeAcceptancelist[cc]['ACCEPTANCE_START_DATE_TIME'];
                const startdatet = new Date(startdate);

                let countdownInterval1 = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining2[cc] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining2[cc] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerendloop[cc] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining2[cc] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval1);
                    this.Timmerendloop[cc] = 0;

                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  residencetypeshow: any;
  showPhysicalTechnical = false;
  filterqueryshow: any = '';
  ViewcaretakerAcceptance(data: any, filter: string) {
    this.RESIDENCETYPE_NAME = '';
    this.residencetypeshow = data;
    this.filterqueryshow = filter;
    this.EmployeeAcceptancelist = [];

    this.showCards = false;
    this.showNonAcceptanceCards = false;
    this.showPhysicalTechnical = true;
    this.TechnicalShowdata = false;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = data.RESIDENCE_TYPE_NAME;
    this.api
      .getFlatTakenEmployeeFinalll(
        0,
        0,
        'ID',
        'desc',
        " AND (IS_PHYSICALLY_FLAT_AVAILABLE = '1' OR OCCUPANCY_TYPE = '" +
        filter +
        "') AND FINAL_ALLOTMENT_MASTER_ID = " +
        data.ID +
        ' AND IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1'
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  getViewcaretakerAcceptance() {
    this.RESIDENCETYPE_NAME = '';

    this.showCards = false;
    this.EmployeeAcceptancelist = [];
    this.showNonAcceptanceCards = false;
    this.showPhysicalTechnical = true;
    this.TechnicalShowdata = false;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = this.residencetypeshow.RESIDENCE_TYPE_NAME;
    this.api
      .getFlatTakenEmployeeFinalll(
        0,
        0,
        'ID',
        'desc',
        " AND (IS_PHYSICALLY_FLAT_AVAILABLE = '1' OR OCCUPANCY_TYPE = '" +
        this.filterqueryshow +
        "') AND FINAL_ALLOTMENT_MASTER_ID = " +
        this.residencetypeshow.ID +
        ' AND IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1'
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  technicalshowdata: any;
  technicalfilter: any;
  ViewTechnicalcaretakeracceptance(data: any, filter: string) {
    this.RESIDENCETYPE_NAME = '';
    this.technicalshowdata = data;
    this.technicalfilter = filter;
    this.EmployeeAcceptancelist = [];

    this.showCards = false;
    this.showNonAcceptanceCards = false;
    this.showPhysicalTechnical = false;
    this.TechnicalShowdata = true;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = data.RESIDENCE_TYPE_NAME;
    this.api
      .getFlatTakenEmployeeFinalll(
        0,
        0,
        'ID',
        'desc',
        " AND OCCUPANCY_TYPE = '" +
        filter +
        "' AND FINAL_ALLOTMENT_MASTER_ID = " +
        data.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  getViewtechnicalAcceptance() {
    this.RESIDENCETYPE_NAME = '';

    this.showCards = false;
    this.EmployeeAcceptancelist = [];
    this.showNonAcceptanceCards = false;
    this.showPhysicalTechnical = false;
    this.TechnicalShowdata = true;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = this.technicalshowdata.RESIDENCE_TYPE_NAME;
    this.api
      .getFlatTakenEmployeeFinalll(
        0,
        0,
        'ID',
        'desc',
        " AND OCCUPANCY_TYPE = '" +
        this.technicalfilter +
        "' AND FINAL_ALLOTMENT_MASTER_ID = " +
        this.technicalshowdata.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  nonAcceptancedata: any;
  ViewNonAcceptance(data: any) {
    this.RESIDENCETYPE_NAME = '';

    this.showCards = false;
    this.showNonAcceptanceCards = true;
    this.showPhysicalTechnical = false;
    this.TechnicalShowdata = false;
    this.nonAcceptancedata = Object.assign({}, data);
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = data.RESIDENCE_TYPE_NAME;
    this.api
      .getNonAcceptanceDetails(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_NON_ACCEPTANCE_FORM_SUBMITTED = 1 AND FINAL_ALLOTMENT_MASTER_ID = ' +
        this.nonAcceptancedata.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  getViewNonAcceptance() {
    this.RESIDENCETYPE_NAME = '';

    this.showCards = false;
    this.showNonAcceptanceCards = true;
    this.EmployeeAcceptancelist = [];
    this.showPhysicalTechnical = false;
    this.TechnicalShowdata = false;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = this.nonAcceptancedata.RESIDENCE_TYPE_NAME;
    this.api
      .getNonAcceptanceDetails(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_NON_ACCEPTANCE_FORM_SUBMITTED = 1 AND FINAL_ALLOTMENT_MASTER_ID = ' +
        this.nonAcceptancedata.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];
            this.EmployeeAcceptancelist = data['data'];
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  getflattakenlist() {
    this.EmployeeAcceptancelist = [];
    this.isRecordLoading = true;
    this.api
      .getFlatTakenEmployeeList111(
        0,
        0,
        'ID',
        'desc',
        " AND TAKEN_STATUS = 'A' AND STATUS = 'Y' AND IS_ACCEPTANCE_LETTER_SUBMITED = '1' AND (INSPECTOR_STATUS = 'P' or INSPECTOR_STATUS = 'A') AND IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED = 0 AND FINAL_ALLOTMENT_MASTER_ID = " +
        this.resitypedata.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];

            this.EmployeeAcceptancelist = data['data'];
            if (this.EmployeeAcceptancelist.length > 0) {
              this.Timmerstartloop.length = this.EmployeeAcceptancelist.length;
              this.Timmerendloop.length = this.EmployeeAcceptancelist.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.EmployeeAcceptancelist.length;
              timeremaining2.length = this.EmployeeAcceptancelist.length;
              // starttimmer
              for (let ab = 0; ab < this.EmployeeAcceptancelist.length; ab++) {
                // let sapandate = this.dataList[ab]['OBJ_END_TIME_PERIOD'];
                let startdate =
                  this.EmployeeAcceptancelist[ab]['ACCEPTANCE_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining[ab] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerstartloop[ab] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining[ab] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval);
                    this.Timmerstartloop[ab] = 0;

                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }
              // endtimmer
              for (let cc = 0; cc < this.EmployeeAcceptancelist.length; cc++) {
                let sapandate =
                  this.EmployeeAcceptancelist[cc]['ACCEPTANCE_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                let startdate =
                  this.EmployeeAcceptancelist[cc]['ACCEPTANCE_START_DATE_TIME'];
                const startdatet = new Date(startdate);

                let countdownInterval1 = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining2[cc] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining2[cc] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerendloop[cc] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining2[cc] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval1);
                    this.Timmerendloop[cc] = 0;

                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }
  getflattakenlistphysicaltechnical() {
    this.EmployeeAcceptancelist = [];
    this.isRecordLoading = true;
    this.api
      .getFlatTakenEmployeeList111(
        0,
        0,
        'ID',
        'desc',
        " AND TAKEN_STATUS = 'A' AND STATUS = 'Y' AND IS_ACCEPTANCE_LETTER_SUBMITED = '1' AND (INSPECTOR_STATUS = 'P' or INSPECTOR_STATUS = 'A') AND IS_ALLOTMENT_AUTHORISATION_LETTER_RECIVED = 1 AND FINAL_ALLOTMENT_MASTER_ID = " +
        this.resitypedata.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoading = false;
            this.dataList = [];
            this.ResidenceTypelist = [];
            this.RESIDENCE_TYPE_ID = [];

            this.EmployeeAcceptancelist = data['data'];
            // if (this.EmployeeAcceptancelist.length > 0) {
            //   this.Timmerstartloop.length = this.EmployeeAcceptancelist.length;
            //   this.Timmerendloop.length = this.EmployeeAcceptancelist.length;

            //   let timeremaining: any = [];
            //   let timeremaining2: any = [];
            //   timeremaining.length = this.EmployeeAcceptancelist.length;
            //   timeremaining2.length = this.EmployeeAcceptancelist.length;
            //   // starttimmer
            //   for (let ab = 0; ab < this.EmployeeAcceptancelist.length; ab++) {
            //     // let sapandate = this.dataList[ab]['OBJ_END_TIME_PERIOD'];
            //     let startdate = this.EmployeeAcceptancelist[ab]['ACCEPTANCE_START_DATE_TIME'];
            //     let targetDate = new Date(startdate); // Your datetime value should be assigned here

            //     let countdownInterval = setInterval(() => {
            //       const currentDate = new Date();
            //       timeremaining[ab] =
            //         targetDate.getTime() - currentDate.getTime();
            //

            //       const seconds = Math.floor(timeremaining[ab] / 1000);
            //       const minutes = Math.floor(seconds / 60);
            //       const hours = Math.floor(minutes / 60);
            //       const days = Math.floor(hours / 24);
            //       // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
            //       this.Timmerstartloop[ab] =
            //         (days % 24) +
            //         ' Day : ' +
            //         (hours % 24) +
            //         ' Hrs : ' +
            //         (minutes % 60) +
            //         ' Min : ' +
            //         (seconds % 60) + ' Sec';
            //       if (timeremaining[ab] <= 0) {
            //         this.countdowndisable = false;
            //         clearInterval(countdownInterval);
            //         this.Timmerstartloop[ab] = 0;
            //
            //         timeremaining[ab] = 0;
            //       }
            //     }, 1000);
            //   }
            //   // endtimmer
            //   for (let cc = 0; cc < this.EmployeeAcceptancelist.length; cc++) {
            //     let sapandate = this.EmployeeAcceptancelist[cc]['ACCEPTANCE_END_DATE_TIME'];
            //     let targetDate = new Date(sapandate); // Your datetime value should be assigned here
            //     let startdate = this.EmployeeAcceptancelist[cc]['ACCEPTANCE_START_DATE_TIME'];
            //     const startdatet = new Date(startdate);

            //     let countdownInterval1 = setInterval(() => {
            //       const currentDate = new Date();
            //       timeremaining2[cc] =
            //         targetDate.getTime() - currentDate.getTime();
            //

            //       const seconds = Math.floor(timeremaining2[cc] / 1000);
            //       const minutes = Math.floor(seconds / 60);
            //       const hours = Math.floor(minutes / 60);
            //       const days = Math.floor(hours / 24);
            //       // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
            //       this.Timmerendloop[cc] =
            //         (days % 24) +
            //         ' Day : ' +
            //         (hours % 24) +
            //         ' Hrs : ' +
            //         (minutes % 60) +
            //         ' Min : ' +
            //         (seconds % 60) + ' Sec';
            //       if (timeremaining2[cc] <= 0) {
            //         this.countdowndisable = false;
            //         clearInterval(countdownInterval1);
            //         this.Timmerendloop[cc] = 0;
            //
            //         timeremaining2[cc] = 0;
            //       }
            //     }, 1000);
            //   }
            // }
          } else {
            this.isRecordLoading = false;
          }
        },
        (err) => {
          this.isRecordLoading = false;
        }
      );
  }

  changebacktocards() {
    this.showCards = true;
    this.showNonAcceptanceCards = false;
    this.showPhysicalTechnical = false;
    this.TechnicalShowdata = false;
    // this.search(true);
    this.joinedResidencetype = '';
    this.ResidenceTypelist = [];
    this.RESIDENCE_TYPE_ID = [];
    this.getResidenceTypes();
  }

  ViewAFss(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'acceptanceLetter/' + url;
    window.open(fileUrl);
  }

  ViewFAllotment(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }
  ViewFAcceptance(url: string) {
    const fileUrl =
      this.api.retriveimgUrl + 'authorisationOccupationLetter/' + url;
    window.open(fileUrl);
  }
  Viewoccupancyformletter(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'physicalOccupancyLetter/' + url;
    window.open(fileUrl);
  }
  ShowNonAcceptanceform(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'nonAcceptanceLetter/' + url;
    window.open(fileUrl);
  }

  empdata: any;
  newdate = new Date();
  todaysyear: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth()
  );
  nextyear: any = new Date(
    this.newdate.getFullYear() + 1,
    this.newdate.getMonth()
  );
  elementAsString: any
  elementAsString111: any
  todaysdate: any = new Date();
  generatePOletter(data: finalallocationdetailsemp, n) {
    this.todaysyear = this.datepipe.transform(this.todaysyear, 'yyyy');
    this.nextyear = this.datepipe.transform(this.nextyear, 'yyyy');
    this.todaysdate = this.datepipe.transform(this.todaysdate, 'dd/MM/yyyy');
    this.AllotmentPreview = true;

    this.empdata = Object.assign({}, data);

    setTimeout(() => {


      const element: any = document.getElementById('Prntmodal');
      this.elementAsString111 = element.outerHTML;
      let senddata = {
        ...this.empdata,
        PRINT_ALLOTMENT_ORDER_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.IsspinningData = true;
      this.api.updatefinalAllotmentDetailsEmployee(senddata).subscribe(
        (value) => {
          if (value.code == 200) {
            // this.IsspinningData = false;
            this.api.allotmentlatterupload(this.elementAsString111, this.empdata.FINAL_FLAT_TAKEN_ID).subscribe(
              (data) => {
                if (data.code == 200) {
                  // this.message.success(' Successfully', '');
                  this.message.success('Files Submitted Successfully', '');
                  // this.Uploadmodalclose();
                  this.IsspinningData = false;
                  this.isSpinning = false;
                  // this.Uploadconfirmmodal = false;;
                } else {

                }
              },

            );



          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );

      this.filtergignatureid = ' AND SERVICE_ID = 5';
    }, 1000);
    // this.getsignaturedata();
  }


  generateALletter(data: any, n: any) {
    this.POPreview = true;

    setTimeout(() => {



      const element: any = document.getElementById('Prntmodal111');
      this.elementAsString = element.outerHTML;

      let newdate = new Date();
      this.SEND_TO_CARETAKER_END_DATE_TIME = new Date(
        newdate.getFullYear(),
        newdate.getMonth(),
        newdate.getDate() + 5
      );
      this.NONACCEPTANCE_END_DATETIME = new Date(
        newdate.getFullYear(),
        newdate.getMonth(),
        newdate.getDate() + 5
      );
      this.percent2 = 0;
      // this.Uploadfiles = true;
      this.uploaddata = Object.assign({}, data);

      this.SEND_TO_CARETAKER_END_DATE_TIME = this.datepipe.transform(
        this.SEND_TO_CARETAKER_END_DATE_TIME,
        'yyyy-MM-dd'
      );
      this.NONACCEPTANCE_END_DATETIME = this.datepipe.transform(
        this.NONACCEPTANCE_END_DATETIME,
        'yyyy-MM-dd'
      );





      this.Submituploadfiles();
    }, 1000);

  }

  uploadfinallist(data, n) { }
  uploadAuthslip(data, n) { }

  AllotmentPreview = false;
  isSpinningmodal = false;
  closemodal() {
    this.getflattakenlist();
    this.AllotmentPreview = false;
    this.POPreview = false;
  }

  // Final Allotment List Signature data
  SECTION_TYPE: any = '';
  NAME: any = '';
  NAME_HN: any = '';
  OFFICE_NAME: any = '';
  OFFICE_NAME_HN: any = '';
  POST: any = '';
  POST_HN: any = '';
  filtergignatureid = '';

  // Authorization Slip Signature 1 data
  SECTION_TYPE1: any = '';
  NAME1: any = '';
  NAME_HN1: any = '';
  OFFICE_NAME1: any = '';
  OFFICE_NAME_HN1: any = '';
  POST1: any = '';
  POST_HN1: any = '';

  // Authorization Slip Signature 2 data
  SECTION_TYPE2: any = '';
  NAME2: any = '';
  NAME_HN2: any = '';
  OFFICE_NAME2: any = '';
  OFFICE_NAME_HN2: any = '';
  POST2: any = '';
  POST_HN2: any = '';
  getsignaturedata() {
    this.Signaturelist = [];
    this.api.getSignature(0, 0, 'ID', 'desc', this.filtergignatureid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturelist = data['data'];
          this.Authsignaturelist1 = data['data'];
          this.Authsignaturelist2 = data['data'];

          // Final Allotment List Signature
          if (
            this.empdata.ALLOTMENT_FINAL_SIGNATURE != null &&
            this.empdata.ALLOTMENT_FINAL_SIGNATURE != undefined &&
            this.empdata.ALLOTMENT_FINAL_SIGNATURE != ''
          ) {
            var f = this.Signaturelist.filter(
              (item) => item['ID'] == this.empdata.ALLOTMENT_FINAL_SIGNATURE
            );
            this.SECTION_TYPE = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID = f[0]['ID'];
            this.NAME = f[0]['NAME'];
            this.NAME_HN = f[0]['NAME_HN'];
            this.OFFICE_NAME = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
            this.POST = f[0]['POST'];
            this.POST_HN = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID = data['data'][0]['ID'];
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.NAME = data['data'][0]['NAME'];
            this.NAME_HN = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
            this.POST = data['data'][0]['POST'];
            this.POST_HN = data['data'][0]['POST_HN'];
          }
        } else {
          console.error('someting went wrong');
        }
      },
      (error) => { }
    );
  }
  getsignaturedata2() {
    this.Authsignaturelist1 = [];
    this.Authsignaturelist2 = [];
    this.api.getSignature(0, 0, 'ID', 'desc', this.filtergignatureid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturelist = data['data'];
          this.Authsignaturelist1 = data['data'];
          this.Authsignaturelist2 = data['data'];

          // Final Allotment List Signature

          // Authorization Slip Signature 1
          if (
            this.authdata.AUTHORISATION_SIGNATURE1 != null &&
            this.authdata.AUTHORISATION_SIGNATURE1 != undefined &&
            this.authdata.AUTHORISATION_SIGNATURE1 != ''
          ) {
            var f = this.Authsignaturelist1.filter(
              (item) => item['ID'] == this.authdata.AUTHORISATION_SIGNATURE1
            );
            this.SECTION_TYPE1 = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID1 = f[0]['ID'];
            this.NAME1 = f[0]['NAME'];
            this.NAME_HN1 = f[0]['NAME_HN'];
            this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN1 = f[0]['OFFICE_NAME_HN'];
            this.POST1 = f[0]['POST'];
            this.POST_HN1 = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID1 = data['data'][0]['ID'];
            this.SECTION_TYPE1 = data['data'][0]['SECTION_TYPE'];
            this.NAME1 = data['data'][0]['NAME'];
            this.NAME_HN1 = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME1 = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN1 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST1 = data['data'][0]['POST'];
            this.POST_HN1 = data['data'][0]['POST_HN'];
          }

          // Authorization Slip Signature 2
          if (
            this.authdata.AUTHORISATION_SIGNATURE2 != null &&
            this.authdata.AUTHORISATION_SIGNATURE2 != undefined &&
            this.authdata.AUTHORISATION_SIGNATURE2 != ''
          ) {
            var f = this.Authsignaturelist2.filter(
              (item) => item['ID'] == this.authdata.AUTHORISATION_SIGNATURE2
            );
            this.SECTION_TYPE2 = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID2 = f[0]['ID'];
            this.NAME2 = f[0]['NAME'];
            this.NAME_HN2 = f[0]['NAME_HN'];
            this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN2 = f[0]['OFFICE_NAME_HN'];
            this.POST2 = f[0]['POST'];
            this.POST_HN2 = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID2 = data['data'][0]['ID'];
            this.SECTION_TYPE2 = data['data'][0]['SECTION_TYPE'];
            this.NAME2 = data['data'][0]['NAME'];
            this.NAME_HN2 = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME2 = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN2 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST2 = data['data'][0]['POST'];
            this.POST_HN2 = data['data'][0]['POST_HN'];
          }
        } else {
          console.error('someting went wrong');
        }
      },
      (error) => { }
    );
  }

  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
  SIGNATURE_ID2: any;
  Signaturelist: any = [];
  Authsignaturelist1: any = [];
  Authsignaturelist2: any = [];
  IsspinningData = false;
  changesignature(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE = '';
      this.NAME = '';
      this.NAME_HN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HN = '';
      this.POST = '';
      this.POST_HN = '';
      this.SIGNATURE_ID = null;
    } else {
      var f = this.Signaturelist.filter((item) => item['ID'] == event);
      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID = f[0]['ID'];
      this.NAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];

      let signaturedata: finalallocationdetailsemp = {
        // ALLOTMENT_FINAL_SIGNATURE: this.SIGNATURE_ID,
        // ID: this.empdata.ID,
        ...this.empdata,
        ALLOTMENT_FINAL_SIGNATURE: this.SIGNATURE_ID,
        PRINT_ALLOTMENT_ORDER_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.IsspinningData = true;
      this.api.updatefinalAllotmentDetailsEmployee(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );
    }
  }
  changesignature1(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE1 = '';
      this.NAME1 = '';
      this.NAME_HN1 = '';
      this.OFFICE_NAME1 = '';
      this.OFFICE_NAME_HN1 = '';
      this.POST1 = '';
      this.POST_HN1 = '';
      this.SIGNATURE_ID1 = null;
    } else {
      var f = this.Authsignaturelist1.filter((item) => item['ID'] == event);
      this.SECTION_TYPE1 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID1 = f[0]['ID'];
      this.NAME1 = f[0]['NAME'];
      this.NAME_HN1 = f[0]['NAME_HN'];
      this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN1 = f[0]['OFFICE_NAME_HN'];
      this.POST1 = f[0]['POST'];
      this.POST_HN1 = f[0]['POST_HN'];

      let signaturedata: finalallocationdetailsemp = {
        // AUTHORISATION_SIGNATURE1: this.SIGNATURE_ID1,
        // ID: this.empdata.ID,
        ...this.authdata,
        AUTHORISATION_SIGNATURE1: this.SIGNATURE_ID1,
        AUTHORISATION_SIGNATURE2: this.SIGNATURE_ID2,
        PRINT_AUTHORISATION_ORDER_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.IsspinningData = true;
      this.api.updatefinalAllotmentDetailsEmployee(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );
    }
  }
  changesignature2(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE2 = '';
      this.NAME2 = '';
      this.NAME_HN2 = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME_HN2 = '';
      this.POST2 = '';
      this.POST_HN2 = '';
      this.SIGNATURE_ID2 = null;
    } else {
      var f = this.Authsignaturelist2.filter((item) => item['ID'] == event);
      this.SECTION_TYPE2 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID2 = f[0]['ID'];
      this.NAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN2 = f[0]['OFFICE_NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST_HN2 = f[0]['POST_HN'];

      let signaturedata: finalallocationdetailsemp = {
        // AUTHORISATION_SIGNATURE2: this.SIGNATURE_ID2,
        // ID: this.empdata.ID,
        ...this.authdata,
        AUTHORISATION_SIGNATURE1: this.SIGNATURE_ID1,
        AUTHORISATION_SIGNATURE2: this.SIGNATURE_ID2,
        PRINT_AUTHORISATION_ORDER_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.IsspinningData = true;
      this.api.updatefinalAllotmentDetailsEmployee(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );
    }
  }

  pdfDownload = false;
  downloadPdf() {
    // if (
    //   this.SIGNATURE_ID != null &&
    //   this.SIGNATURE_ID != undefined &&
    //   this.SIGNATURE_ID != ''
    // ) {
    // } else {
    //   this.message.error('Please Select Signature', '');
    // }
    this.pdfDownload = true;
    const element: any = document.getElementById('Prntmodal');


    var elementAsString: any = element.outerHTML;
    this.api.pdfffff(elementAsString).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success(' Successfully', '');

        } else {

        }
      },

    );
    const opt = {
      margin: 0.2,
      filename: 'Final Allotment Letter.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.pdfDownload = false;
    }, 5000);
  }

  ViewAcceptanceform(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'acceptanceLetter/' + url;
    window.open(fileUrl);
  }
  ViewAllotmentFinalletter(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }
  ViewAuthSlip(url: string) {
    const fileUrl =
      this.api.retriveimgUrl + 'authorisationOccupationLetter/' + url;
    window.open(fileUrl);
  }

  viewAllotmentLettershow(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }
  viewAuthorizationlettershow(url: string) {
    const fileUrl =
      this.api.retriveimgUrl + 'authorisationOccupationLetter/' + url;
    window.open(fileUrl);
  }

  authdata: any;
  newdate1 = new Date();
  todaysyear1: any = new Date(
    this.newdate1.getFullYear(),
    this.newdate1.getMonth()
  );
  nextyear1: any = new Date(
    this.newdate1.getFullYear() + 1,
    this.newdate1.getMonth()
  );
  todaysdate1: any = new Date();


  generateAUletter(data, n) {
    this.todaysyear1 = this.datepipe.transform(this.todaysyear1, 'yyyy');
    this.nextyear1 = this.datepipe.transform(this.nextyear1, 'yyyy');
    this.todaysdate1 = this.datepipe.transform(this.todaysdate1, 'dd/MM/yyyy');
    this.authModelVisible = true;
    this.authdata = Object.assign({}, data);
    let newdate = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let senddata = {
      ...this.authdata,
      PRINT_AUTHORISATION_ORDER_DATE_TIME: newdate,
    };
    this.api.updatefinalAllotmentDetailsEmployee(senddata).subscribe(
      (value) => {
        if (value.code == 200) {
          this.IsspinningData = false;
        } else {
          console.error('something went wrong');
          this.IsspinningData = false;
        }
      },
      (error) => {
        console.error(error, 'something went wrong');
        this.IsspinningData = false;
      }
    );
    this.filtergignatureid = ' AND SERVICE_ID = 5';
    this.getsignaturedata2();
  }
  authModelVisible = false;
  authhandleCancel() {
    this.getflattakenlist();
    this.authModelVisible = false;
  }

  authopenpdfRecords = false;
  authopenpdf() {
    this.authopenpdfRecords = true;
    var element: any = document.getElementById('excel-table');
    var elementAsString: any = element.outerHTML;
    this.api.pdfffff(elementAsString).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success(' Successfully', '');

        } else {

        }
      },

    );

    const opt = {
      margin: 0.2,
      filename: 'Authorization Slip.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.authopenpdfRecords = false;
    }, 5000);

  }

  progressBar: boolean = false;
  percent = 0;
  timer: any;
  appnPDF: any;
  urlappnPdf: any;
  appnPDF1: any;
  urlappnPdf1: any;
  applnform: boolean = true;

  /// Accept And Reject Process.

  AcceptRejectModal = false;
  isSpinningReject = false;
  isSpinningAccept = false;
  INSPECTOR_REMARK: any = '';
  accetrejectdata: acceptrejectallocation = new acceptrejectallocation();
  AcceptReject(data: any) {
    this.accetrejectdata = Object.assign({}, data);
    this.AcceptRejectModal = true;
  }
  // Cancelmodal() {
  //   this.getflattakenlist();
  //   this.AcceptRejectModal = false;
  // }

  //// Upload files process///////////

  uploaddata: any;
  Uploadletters(data: finalallocationdetailsemp) {
    // this.ALLOTMENT_FINAL_LETTER = null;
    // this.AUTHORISATION_OCCUPATION_LETTER = null;
    // this.progressBar1 = false;
    // this.joininglettershow = true;
    // this.joininglettershow1 = true;
    // this.percent1 = 0;
    // this.progressBar2 = false;
    let newdate = new Date();
    this.SEND_TO_CARETAKER_END_DATE_TIME = new Date(
      newdate.getFullYear(),
      newdate.getMonth(),
      newdate.getDate() + 5
    );
    this.NONACCEPTANCE_END_DATETIME = new Date(
      newdate.getFullYear(),
      newdate.getMonth(),
      newdate.getDate() + 5
    );
    this.percent2 = 0;
    this.Uploadfiles = true;
    this.uploaddata = Object.assign({}, data);
  }

  Uploadfiles = false;
  Uploadmodalclose() {
    this.getflattakenlist();
    this.Uploadfiles = false;
  }

  SEND_TO_CARETAKER_END_DATE_TIME: any;
  NONACCEPTANCE_END_DATETIME: any;
  Openconfirmation() {
    // if (
    //   this.ALLOTMENT_FINAL_LETTER == null ||
    //   this.ALLOTMENT_FINAL_LETTER == undefined ||
    //   this.ALLOTMENT_FINAL_LETTER == ''
    // ) {
    //   this.message.error('Please Upload Allotment Letter', '');
    // } else if (
    //   this.AUTHORISATION_OCCUPATION_LETTER == null ||
    //   this.AUTHORISATION_OCCUPATION_LETTER == undefined ||
    //   this.AUTHORISATION_OCCUPATION_LETTER == ''
    // ) {
    //   this.message.error('Please Upload Authorization Letter', '');
    // } else if (
    //   this.SEND_TO_CARETAKER_END_DATE_TIME == null ||
    //   this.SEND_TO_CARETAKER_END_DATE_TIME == undefined ||
    //   this.SEND_TO_CARETAKER_END_DATE_TIME == ''
    // ) {
    //   if (this.RESIDENCE_ID == 1 || this.RESIDENCE_ID == 2 || this.RESIDENCE_ID == 3) {
    //     this.message.error('Please Select Send to Caretaker DateTime', '');
    //   } else {
    //     this.message.error('Please Select Last Date of Occupancy', '');
    //   }

    // } else if (
    //   this.NONACCEPTANCE_END_DATETIME == null ||
    //   this.NONACCEPTANCE_END_DATETIME == undefined ||
    //   this.NONACCEPTANCE_END_DATETIME == ''
    // ) {
    //   this.message.error('Please Select Non Acceptance DateTime', '');
    // } else 
    // {
    this.SEND_TO_CARETAKER_END_DATE_TIME = this.datepipe.transform(
      this.SEND_TO_CARETAKER_END_DATE_TIME,
      'yyyy-MM-dd'
    );
    this.NONACCEPTANCE_END_DATETIME = this.datepipe.transform(
      this.NONACCEPTANCE_END_DATETIME,
      'yyyy-MM-dd'
    );
    this.Submituploadfiles();
    // }
  }

  disabledDate11 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.SEND_TO_CARETAKER_END_DATE_TIME) < 0;
  DisableNonAcceptance = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.NONACCEPTANCE_END_DATETIME) < 0;

  Uploadconfirmmodal = false;
  Submituploadfiles() {
    let senddata = {
      ID: this.uploaddata.ID,
      ALLOTMENT_FINAL_LETTER: this.ALLOTMENT_FINAL_LETTER,
      AUTHORISATION_OCCUPATION_LETTER: this.AUTHORISATION_OCCUPATION_LETTER,
      SEND_TO_CARETAKER_END_DATE_TIME: this.SEND_TO_CARETAKER_END_DATE_TIME,
      NON_ACCEPTANCE_END_DATE_TIME: this.NONACCEPTANCE_END_DATETIME,
      EMP_ID: this.uploaddata.EMP_ID,
    };

    var dateeeeeee: any = new Date(this.uploaddata.ACCEPTANCE_END_DATE_TIME);

    // var datee2=new Date();

    var datee3 = dateeeeeee.setDate(dateeeeeee.getDate() + 5);
    datee3 = this.datepipe.transform(
      dateeeeeee,
      'yyyy-MM-dd'
    );
    this.isSpinning = true;
    this.api.updatefinalAllotmentDetailsuploadletters(senddata).subscribe(
      (data) => {
        if (data.code == 200) {

          this.api.physicallatterupload(this.elementAsString, this.uploaddata.FINAL_FLAT_TAKEN_ID, datee3).subscribe(
            (data) => {
              if (data.code == 200) {
                // this.message.success(' Successfully', '');
                this.message.success('Files Submitted Successfully', '');
                // this.Uploadmodalclose();
                this.IsspinningData = false;
                this.isSpinning = false;
                // this.Uploadconfirmmodal = false;;
              } else {

              }
            },

          );



        } else {
          this.message.error('Failed To Submit Files', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        console.error(error);
        this.message.error('Something Went Wrong...', '');
        this.isSpinning = false;
      }
    );
  }
  CancelUploadconfirm() {
    this.Uploadconfirmmodal = false;
  }

  progressBar1: boolean = false;
  percent1 = 0;
  timer1: any;
  joininglettershow = true;
  joindateletter: any;
  urljoinletter: any;
  IsspinningUploaddata = false;
  ALLOTMENT_FINAL_LETTER: any;
  // AUTHORISATION_OCCUPATION_LETTER
  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.IsspinningUploaddata = true;
      this.joindateletter = <File>event.target.files[0];

      if (this.joindateletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.joindateletter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urljoinletter = url;
        this.progressBar1 = true;
        if (
          this.ALLOTMENT_FINAL_LETTER != undefined &&
          this.ALLOTMENT_FINAL_LETTER.trim() != ''
        ) {
          var arr = this.ALLOTMENT_FINAL_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.timer1 = this.api
        .onUpload2(
          'allotmentFinalLetter',
          this.joindateletter,
          this.urljoinletter
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              this.IsspinningUploaddata = false;
              this.message.success('File Uploaded Successfully', '');
            }
          }
          this.ALLOTMENT_FINAL_LETTER = this.urljoinletter;
          if (this.ALLOTMENT_FINAL_LETTER != null) {
            this.joininglettershow = false;
          } else {
            this.joininglettershow = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.joindateletter = null;
      this.IsspinningUploaddata = false;
      this.ALLOTMENT_FINAL_LETTER = null;
    }
  }

  clearAllocationletter(fileurl: string, folder: string) {
    // this.ALLOTMENT_FINAL_LETTER = null;
    // this.joininglettershow = true;
    // this.progressBar1 = false;
    // this.percent1 = 0;

    this.IsspinningUploaddata = true;
    var deletefile = folder + '/' + fileurl;
    this.api.deletealluploadsgrass(deletefile).subscribe(
      (value) => {
        if (value.code == 200) {
          this.message.success(
            'Final Allotment List File Deleted Successfully',
            ''
          );
          this.ALLOTMENT_FINAL_LETTER = null;
          this.joininglettershow = true;
          this.progressBar1 = false;
          this.percent1 = 0;
          this.IsspinningUploaddata = false;
        } else {
          this.message.error('Failed To Delete Final Allotment List File', '');
          this.IsspinningUploaddata = false;
        }
      },
      (error) => {
        this.message.error('Failed To Delete Final Allotment List File', '');
        this.IsspinningUploaddata = false;
      }
    );
  }
  viewAllocationLetter(url) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }

  progressBar2: boolean = false;
  percent2 = 0;
  timer2: any;
  joininglettershow1 = true;
  joindateletter2: any;
  urljoinletter2: any;
  AUTHORISATION_OCCUPATION_LETTER: any;
  onFileApplicationform1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.IsspinningUploaddata = true;
      this.joindateletter2 = <File>event.target.files[0];

      if (this.joindateletter2 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.joindateletter2.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urljoinletter2 = url;
        this.progressBar2 = true;
        if (
          this.AUTHORISATION_OCCUPATION_LETTER != undefined &&
          this.AUTHORISATION_OCCUPATION_LETTER.trim() != ''
        ) {
          var arr = this.AUTHORISATION_OCCUPATION_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.timer2 = this.api
        .onUpload2(
          'authorisationOccupationLetter',
          this.joindateletter2,
          this.urljoinletter2
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent2 = percentDone;
            if (this.percent2 == 100) {
              this.IsspinningUploaddata = false;
              this.message.success('File Uploaded Successfully', '');
            }
          }
          this.AUTHORISATION_OCCUPATION_LETTER = this.urljoinletter2;
          if (this.AUTHORISATION_OCCUPATION_LETTER != null) {
            this.joininglettershow1 = false;
          } else {
            this.joininglettershow1 = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.joindateletter2 = null;
      this.IsspinningUploaddata = false;
      this.AUTHORISATION_OCCUPATION_LETTER = null;
    }
  }

  clearAuthorizationletter(fileurl: string, folder: string) {
    // this.AUTHORISATION_OCCUPATION_LETTER = null;
    // this.joininglettershow1 = true;
    // this.progressBar2 = false;
    // this.percent2 = 0;

    this.IsspinningUploaddata = true;
    var deletefile = folder + '/' + fileurl;
    this.api.deletealluploadsgrass(deletefile).subscribe(
      (value) => {
        if (value.code == 200) {
          this.message.success(
            'Authorization Letter File Deleted Successfully',
            ''
          );
          this.AUTHORISATION_OCCUPATION_LETTER = null;
          this.joininglettershow1 = true;
          this.progressBar2 = false;
          this.percent2 = 0;
          this.IsspinningUploaddata = false;
        } else {
          this.message.error('Failed To Delete Authorization Letter File', '');
          this.IsspinningUploaddata = false;
        }
      },
      (error) => {
        this.message.error('Failed To Delete Authorization Letter File', '');
        this.isSpinning = false;
        this.IsspinningUploaddata = false;
      }
    );
  }
  viewAuthorizationLetter(url) {
    const fileUrl =
      this.api.retriveimgUrl + 'authorisationOccupationLetter/' + url;
    window.open(fileUrl);
  }

  printOrderModalCancel() {
    this.getflattakenlist();
    this.printOrderModalVisible = false;
  }

  printOrderModalVisible = false;
  view = 0;
  viewPdfSafe: any;
  ViewNonAcceptanceform: any;
  ViewAF(pdfURL: string, emplist: any) {
    this.accetrejectdata = Object.assign({}, emplist);
    this.viewPdfSafe = '';
    this.view = 1;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  view122: any;
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'acceptanceLetter/' + link;
    }
    // if (this.view122 == 2) {
    //   var a: any = this.api.retriveimgUrl + 'nonAcceptanceLetter/' + link;
    // }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink;
  }
  getS111(link: string) {
    this.sanitizedLink = '';
    if (this.view122 == 2) {
      var a: any = this.api.retriveimgUrl + 'nonAcceptanceLetter/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink;
  }

  RejectAcceptance() {
    if (
      this.INSPECTOR_REMARK == null ||
      this.INSPECTOR_REMARK == '' ||
      this.INSPECTOR_REMARK == undefined
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.isSpinningReject = true;
      this.accetrejectdata.INSPECTOR_ID = sessionStorage.getItem('userId');
      this.accetrejectdata.INSPECTOR_REMARK = this.INSPECTOR_REMARK;
      this.api
        .updatefinalAllotmentDetailsReject(this.accetrejectdata)
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.message.success('Acceptance Rejected Successfully', '');
              this.isSpinningReject = false;
              this.Cancelmodal();
            } else {
              this.isSpinningReject = false;
              this.message.error('Failed To Reject Acceptance', '');
            }
          },
          (error) => {
            console.error(error);
            this.isSpinningReject = false;
            this.message.error('Something Went Wrong...', '');
          }
        );
    }
  }

  OpenRejectModal() {
    this.AcceptRejectModal = true;
  }

  Cancelmodal() {
    this.printOrderModalCancel();
    this.AcceptRejectModal = false;
  }

  occupancydata: any;
  Rejectoccupancydata: any;
  viewPdfSafe12: any;
  view11: any;
  ViewPhysicaloccletter(emplist: any, pdfUrl: string) {
    this.occupancydata = Object.assign({}, emplist);
    this.Rejectoccupancydata = Object.assign({}, emplist);
    this.viewPdfSafe12 = '';
    this.view11 = 1;
    this.VisibleOccupancyLetter = true;
    this.viewPdfSafe12 = this.getS11(pdfUrl);
  }

  VisibleOccupancyLetter = false;
  VisibleOccupancyLetterContentCancel() {
    this.getViewcaretakerAcceptance();
    this.VisibleOccupancyLetter = false;
  }

  sanitizedLink1: any = '';
  getS11(link: string) {
    this.sanitizedLink1 = '';
    if (this.view11 == 1) {
      var a: any = this.api.retriveimgUrl + 'physicalOccupancyLetter/' + link;
    }

    this.sanitizedLink1 = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink1;
  }

  ApproveOccupancyLetter() {
    this.OccupancyConfirm = true;
  }

  Rejectaccupancyremark = false;
  RejectOccupancyLetter() {
    this.REJECT_OCCUPANCY_REMARK = '';
    this.Rejectaccupancyremark = true;
  }

  REJECT_OCCUPANCY_REMARK: any = '';
  Rejectaccupancymodal() {
    this.Rejectaccupancyremark = false;
  }
  Rejectoccuancyconfirm() {
    if (
      this.REJECT_OCCUPANCY_REMARK == null ||
      this.REJECT_OCCUPANCY_REMARK == undefined ||
      this.REJECT_OCCUPANCY_REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      let datasend = {
        ...this.Rejectoccupancydata,
        INSPECTOR_FINAL_ACTION_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        INSPECTOR_FINAL_STATUS: 'R',
        INSPECTOR_FINAL_REMARK: this.REJECT_OCCUPANCY_REMARK,
        IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED: 0,
        PHYSICAL_OCCUPANCY_LETTER: null,
      };
      this.isSpinning = true;
      this.isSpinningReject = true;
      this.api.RejectPhysicalOccupancyRequest(datasend).subscribe(
        (data) => {
          if (data.code == 200) {
            this.message.success(
              'Physical Occupancy Rejected Successfully',
              ''
            );
            this.isSpinning = false;
            this.isSpinningReject = false;
            this.Rejectaccupancymodal();
            this.VisibleOccupancyLetterContentCancel();
          } else {
            this.message.error('Failed To Reject Physical Occupancy', '');
            this.isSpinning = false;
            this.isSpinningReject = false;
          }
        },
        (error) => {
          this.message.error('Failed To Reject Physical Occupancy', '');
          this.isSpinning = false;
          this.isSpinningReject = false;
        }
      );
    }
  }

  OccupancyConfirm = false;
  CancelOccupancyConfirm() {
    this.OccupancyConfirm = false;
  }

  Occupancyconfimok() {
    let datasend = {
      ...this.occupancydata,
      INSPECTOR_FINAL_ACTION_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
      IS_LIVING: '1',
      INSPECTOR_FINAL_STATUS: 'A',
    };
    this.isSpinning = true;
    this.api.UpdateIsInspectorApproved(datasend).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success('Physical Occupancy Approved Successfully', '');
          this.isSpinning = false;
          this.VisibleOccupancyLetterContentCancel();
          this.CancelOccupancyConfirm();
        } else {
          this.message.error('Failed To Approve Physical Occupancy', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Approve Physical Occupancy', '');
        this.isSpinning = false;
      }
    );
  }

  AcceptAcceptanceDATA: any;
  Viewnonacceptance(pdfURL: string, emplist: any) {
    this.AcceptAcceptanceDATA = Object.assign({}, emplist);
    this.ViewNonAcceptanceform = '';
    this.view122 = 2;
    this.nonacceptancemodel = true;
    this.ViewNonAcceptanceform = this.getS111(pdfURL);
  }

  nonacceptancemodel: boolean = false;
  nonacceptancemodelcancel() {
    this.nonacceptancemodel = false;
    this.getViewNonAcceptance();
  }

  nonacceptanceAcceptModal() {
    this.NonAcceptanceConfirmmodal = true;
  }

  NonAcceptanceConfirmmodal = false;
  CancelNonAcceptanceConfirm() {
    this.NonAcceptanceConfirmmodal = false;
  }
  NonAcceptanceConfirmok() {
    this.isSpinningAccept = true;
    let datasend = {
      ...this.AcceptAcceptanceDATA,
      NON_ACCEPTANCE_INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
      NON_ACCEPTANCE_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
      NON_ACCEPTANCE_INSPECTOR_STATUS: 'A',
      NON_ACCEPTANCE_INSPECTOR_REMARK: null,
    };
    this.api.ApproveNonAcceptanceStatus(datasend).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success('Non Acceptance Approved Successfully', '');
          this.CancelNonAcceptanceConfirm();
          this.nonacceptancemodelcancel();
          this.isSpinningAccept = false;
        } else {
          this.message.error('Failed To Approve Non Acceptance', '');
          this.isSpinningAccept = false;
        }
      },
      (error) => {
        this.message.error('Failed To Approve Non Acceptance', '');
        this.isSpinningAccept = false;
      }
    );
  }

  INSPECTOR_REMARK_REJECT: any = '';
  nonacceptanceRejectModal() {
    this.NonAcceptanceRejectRemark = true;
    this.INSPECTOR_REMARK_REJECT = '';
  }

  NonAcceptanceRejectRemark = false;
  NonAcceptanceRejectRemarkmodal() {
    this.NonAcceptanceRejectRemark = false;
  }
  NonAcceptanceRejectSend() {
    if (
      this.INSPECTOR_REMARK_REJECT == null ||
      this.INSPECTOR_REMARK_REJECT == undefined ||
      this.INSPECTOR_REMARK_REJECT == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.isSpinningReject = true;
      let datasend = {
        ...this.AcceptAcceptanceDATA,
        NON_ACCEPTANCE_INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
        NON_ACCEPTANCE_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        NON_ACCEPTANCE_INSPECTOR_STATUS: 'R',
        NON_ACCEPTANCE_INSPECTOR_REMARK: this.INSPECTOR_REMARK_REJECT,
      };
      this.api.RejectNonAcceptanceStatus(datasend).subscribe(
        (data) => {
          if (data.code == 200) {
            this.message.success('Non Acceptance Rejected Successfully', '');
            this.NonAcceptanceRejectRemarkmodal();
            this.nonacceptancemodelcancel();
            this.isSpinningReject = false;
          } else {
            this.message.error('Failed To Rejected Non Acceptance', '');
            this.isSpinningReject = false;
          }
        },
        (error) => {
          this.message.error('Failed To Rejected Non Acceptance', '');
          this.isSpinningReject = false;
        }
      );
    }
  }

  ApprovependingAcceptance = false;
  cancelApprovependingAcceptance() {
    this.ApprovependingAcceptance = false;
  }

  AcceptAcceptance() {
    this.ApprovependingAcceptance = true;
  }

  ApprovependingAcceptanceAccept() {
    this.isSpinning = true;
    this.accetrejectdata.INSPECTOR_ID = sessionStorage.getItem('userId');
    this.api.updatefinalAllotmentDetailsAccept(this.accetrejectdata).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success('Acceptance Approved Successfully', '');
          this.cancelApprovependingAcceptance();
          this.printOrderModalCancel();
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Approve Acceptance', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        console.error(error);
        this.message.error('Something Went Wrong...', '');
        this.isSpinning = false;
      }
    );
  }

  getdateee(event: any) {
    var remainingDays = 0;
    var targetDate = new Date(event);
    var currentDate = new Date();
    const differenceMilliseconds = targetDate.getTime() - currentDate.getTime();
    // Calculate the remaining days by converting milliseconds to days.
    remainingDays = Math.ceil(differenceMilliseconds / (1000 * 60 * 60 * 24));
    return remainingDays;
  }

  //////////////////////// technical Occupancy Related /////////////////////////////
  tecnicaloccdatta: any;
  tecnicaloccdattaAccept: any;
  tecnicaloccdattaReject: any;
  ViewtechnicalAccupancy(emplist: any) {
    this.TechnicalModal = true;
    this.tecnicaloccdatta = Object.assign({}, emplist);
    this.tecnicaloccdattaAccept = Object.assign({}, emplist);
    this.tecnicaloccdattaReject = Object.assign({}, emplist);
  }

  TechnicalModal = false;
  CancelTechnicalModal() {
    this.getViewtechnicalAcceptance();
    this.TechnicalModal = false;
  }

  ////////////////////////// Reject Technical Occupancy //////////////////////////////

  RejectTechnicalModal() {
    this.TECHNICAL_OCCUPANCY_REMARK = '';
    this.TechnicalOccupRemark = true;
  }

  TechnicalOccupRemark = false;
  TECHNICAL_OCCUPANCY_REMARK = '';
  TechnicalOccupRemarkRejectmodal() {
    this.TechnicalOccupRemark = false;
  }
  RejectTechnicalOccupanyok() {
    if (
      this.TECHNICAL_OCCUPANCY_REMARK == null ||
      this.TECHNICAL_OCCUPANCY_REMARK == undefined ||
      this.TECHNICAL_OCCUPANCY_REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.isSpinningReject = true;
      this.isSpinning = true;
      let senddata = {
        ...this.tecnicaloccdattaReject,
        INSPECTOR_TECHNICAL_STATUS: 'R',
        INSPECTOR_TECHNICAL_REMARK: this.TECHNICAL_OCCUPANCY_REMARK,
      };
      this.api.TechnicalOccupancyApproveReject(senddata).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Technical Occupancy Rejected Successfully',
              ''
            );
            this.TechnicalOccupRemarkRejectmodal();
            this.CancelTechnicalModal();
            this.isSpinning = false;
            this.isSpinningReject = false;
          } else {
            this.message.error('Failed To Reject Technical Occupancy', '');
            this.isSpinning = false;
            this.isSpinningReject = false;
          }
        },
        (error) => {
          console.error(error);
          this.message.error('Failed To Reject Technical Occupancy', '');
          this.isSpinning = false;
          this.isSpinningReject = false;
        }
      );
    }
  }

  ///////////////////////// Approve Technical Occupancy /////////////////////////////
  ApproveTechnicalModal() {
    this.TechnicalOccupancyconfirmmodal = true;
  }

  TechnicalOccupancyconfirmmodal = false;
  technicaloccupancyok() {
    this.isSpinning = true;
    let senddata = {
      ...this.tecnicaloccdattaAccept,
      INSPECTOR_TECHNICAL_STATUS: 'A',
      INSPECTOR_TECHNICAL_REMARK: null,
    };
    this.api.TechnicalOccupancyApproveReject(senddata).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.message.success('Technical Occupancy Approved Successfully', '');
          this.technicaloccupancyno();
          this.CancelTechnicalModal();
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Approve Technical Occupancy', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        console.error(error);
        this.message.error('Failed To Approve Technical Occupancy', '');
        this.isSpinning = false;
      }
    );
  }
  technicaloccupancyno() {
    this.TechnicalOccupancyconfirmmodal = false;
  }

  tecoccy: any;
  viewtechnicaldetailsoccupancy(data: any) {
    this.TechnicalModal22 = true;
    this.tecoccy = Object.assign({}, data);
  }

  TechnicalModal22 = false;
  CancelTechnicalModal22() {
    this.TechnicalModal22 = false;
    this.getViewcaretakerAcceptance();
  }

  urlll: any = this.api.retriveimgUrl + 'logo/govtOfIndia.png'
  // ViewAuthSlip(url: string) {
  //   const fileUrl = this.urlll + url;
  //   window.open(fileUrl);
  // }

  POPreview: boolean = false
}
