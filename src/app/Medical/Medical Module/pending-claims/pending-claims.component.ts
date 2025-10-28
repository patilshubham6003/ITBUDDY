import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-pending-claims',
  templateUrl: './pending-claims.component.html',
  styleUrls: ['./pending-claims.component.css'],
})
export class PendingClaimsComponent implements OnInit {
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;

  formTitle = 'Manage Pending Claims';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  size = 'small';
  isFilterApplied: any = 'default';
  newButton: string = 'default';
  forwardButton: string = 'default';
  rejectButton: string = 'default';
  queryButton: string = 'default';
  approvedButton: string = 'default';
  readyButton: string = 'default';
  totalButton: string = 'default';
  claimData: any;
  filterClass = 'filter-invisible';
  columns: string[][] = [
    // ['CLAIM_STAGE_NAME', ''],
    // ['CLAIM_NO', ''],
    ['EMPLOYEE_NAME', ''],
    ['EMPLOYEE_CODE', ''],
    ['DESIGNATION', ''],
    ['PATIENT_NAME', ''],
    ['RELATION_WITH_PATIENT', ''],
    ['BILL_FILIING_DATE', ''],
    // ['ADMISSIBLE_AMOUNT', ''],
    ['TREATMENT_START_DATE', ''],
    ['TREATMENT_END_DATE', ''],
    // ['REJECT_REMARK', ''],
    ['MOBILE_NO', ''],
    ['TEST_OR_INVESTIGATION_AMOUNT', 'TEST_OR_INVESTIGATION_AMOUNT'],
    ['INDOOR_TREATEMENT_AMOUNT', 'INDOOR_TREATEMENT_AMOUNT'],
    ['OPD_TREATEMENT_AMOUNT', 'OPD_TREATEMENT_AMOUNT'],
    ['TOTAL_ADVANCE_CLAIMED_AMOUNT', 'TOTAL_ADVANCE_CLAIMED_AMOUNT'],
  ];

  TYPE_OF_HOSPITAL: any;
  TYPE_OF_CLAIM: any;
  STAGE_NAME = [1, 2];
  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.BILL_FILIING_DATE = [];
    this.TYPE_OF_CLAIM = null;
    this.dataList = [];
    this.search();
  }

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;

  // TYPE_OF_HOSPITAL: any = [];

  START_DATE: any;
  END_DATE: any;
  BILL_FILIING_DATE = [];
  current = new Date();
  rejectClaimVisible: boolean = false;
  parentUserId: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ddoID: any;
  ngOnInit(): void {
    this.ddoID = Number(sessionStorage.getItem('ddoId'));
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
  // sort(sort: any): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   if (this.sortValue == "descend") {
  //     this.sortValue = 'desc';
  //   } else {
  //     this.sortValue = 'asc'
  //   }
  //   this.search(true);
  // }
  search(reset: boolean = false) {
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

    var roleiddd = sessionStorage.getItem('roleId');
    var rolefilter: any = ' AND ROLE_ID = ' + roleiddd;
    this.loadingRecords = true;
    this.api
      .getclaimMaster2(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery +
          likeQuery +
          " AND CURRENT_STAGE_ID = 3 AND (INSPECTOR_ID = 0 OR INSPECTOR_ID = null OR INSPECTOR_ID = '' )" +
          // rolefilter +
          ' AND DDO_OF_THE_OFFICIAL_ID =' +
          this.ddoID
        // ' AND (CURRENT_STAGE_ID = 1 OR CURRENT_STAGE_ID = 2 OR CURRENT_STAGE_ID = 3) AND INSPECTOR_ID = 0'
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
  }

  applyFilter() {
    this.filterQuery = '';
    if (
      this.BILL_FILIING_DATE != undefined &&
      this.BILL_FILIING_DATE.length > 0 &&
      this.TYPE_OF_CLAIM != undefined &&
      this.TYPE_OF_CLAIM != null &&
      this.TYPE_OF_CLAIM != ''
    ) {
      this.loadingRecords = true;
      var BILL_FILIING_DATE = this.datePipe.transform(
        this.BILL_FILIING_DATE[0],
        'yyyy-MM-dd'
      );
      var BILL_FILIING_DATE2 = this.datePipe.transform(
        this.BILL_FILIING_DATE[1],
        'yyyy-MM-dd'
      );

      if (this.BILL_FILIING_DATE[0] != null) {
        this.START_DATE = this.BILL_FILIING_DATE[0];
      }

      if (this.BILL_FILIING_DATE[1] != null) {
        this.END_DATE = this.BILL_FILIING_DATE[1];
      }

      this.filterQuery =
        " AND DATE (BILL_FILIING_DATE) BETWEEN ' " +
        BILL_FILIING_DATE +
        "'" +
        " AND '" +
        BILL_FILIING_DATE2 +
        "'" +
        ' AND IS_APPLYING_FOR_ADVANCE=' +
        this.TYPE_OF_CLAIM;
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.search();
    } else if (
      this.BILL_FILIING_DATE != undefined &&
      this.BILL_FILIING_DATE.length > 0 &&
      (this.TYPE_OF_CLAIM == undefined ||
        this.TYPE_OF_CLAIM == null ||
        this.TYPE_OF_CLAIM == '')
    ) {
      this.loadingRecords = true;
      var BILL_FILIING_DATE = this.datePipe.transform(
        this.BILL_FILIING_DATE[0],
        'yyyy-MM-dd'
      );
      var BILL_FILIING_DATE2 = this.datePipe.transform(
        this.BILL_FILIING_DATE[1],
        'yyyy-MM-dd'
      );

      if (this.BILL_FILIING_DATE[0] != null) {
        this.START_DATE = this.BILL_FILIING_DATE[0];
      }

      if (this.BILL_FILIING_DATE[1] != null) {
        this.END_DATE = this.BILL_FILIING_DATE[1];
      }

      this.filterQuery =
        " AND DATE (BILL_FILIING_DATE) BETWEEN ' " +
        BILL_FILIING_DATE +
        "'" +
        " AND '" +
        BILL_FILIING_DATE2 +
        "'";
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.search();
    } else if (
      (this.BILL_FILIING_DATE == undefined ||
        this.BILL_FILIING_DATE.length <= 0) &&
      this.TYPE_OF_CLAIM != undefined &&
      this.TYPE_OF_CLAIM != null &&
      this.TYPE_OF_CLAIM != ''
    ) {
      this.filterQuery = ' AND IS_APPLYING_FOR_ADVANCE=' + this.TYPE_OF_CLAIM;
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.search();
    } else {
      this.filterQuery = '';
      this.START_DATE = null;
      this.END_DATE = null;
      this.BILL_FILIING_DATE = [];
    }

    if (
      this.TYPE_OF_HOSPITAL != undefined &&
      this.TYPE_OF_HOSPITAL.length > 0
    ) {
      var f = ' AND(';
      for (var i = 0; i < this.TYPE_OF_HOSPITAL.length; i++) {
        f = f + 'TYPE_OF_HOSPITAL="N" OR';
        if (i + 1 == this.TYPE_OF_HOSPITAL.length) {
          f = f.substring(0, f.length - 2) + ')';
          this.filterQuery = this.filterQuery + f;
        }
      }
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  claimPickData: any = [];
  pickClaim(data: any) {
    this.claimPickData = [];
    this.loadingRecords = true;
    this.claimPickData = data;
    this.api
      .getclaimMaster2(0, 0, '', '', ' AND ID = ' + this.claimPickData.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.loadingRecords=false
            if (data['data'].length > 0) {
              if (
                data['data'][0]['CURRENT_STAGE_ID'] == 3 &&
                (data['data'][0]['INSPECTOR_ID'] == null ||
                  data['data'][0]['INSPECTOR_ID'] == undefined ||
                  data['data'][0]['INSPECTOR_ID'] == 0)
              ) {
                this.api
                  .getHospitalMapping(
                    0,
                    0,
                    '',
                    '',
                    ' AND CLAIM_ID = ' + this.claimPickData.ID
                  )
                  .subscribe(
                    (data2) => {
                      if (data2['code'] == 200) {
                        var hospitalMapList = data2['data'];
                        (this.claimPickData.INSPECTOR_ID = Number(this.userId)),
                          (this.claimPickData.SUB_INSPECTOR_ID = Number(
                            this.parentUserId
                          ));
                        this.api
                          .pickClaim(this.claimPickData)
                          .subscribe((successCode) => {
                            if (successCode.code == '200') {
                              this.message.success(
                                'Claim Picked Successfully...',
                                ''
                              );
                              if (
                                this.BILL_FILIING_DATE != undefined &&
                                this.BILL_FILIING_DATE.length > 0
                              ) {
                                this.applyFilter();
                              } else {
                                this.search();
                              }
                              this.loadingRecords = false;
                            } else {
                              this.message.error(
                                'Problem To Pick The Claim',
                                ''
                              );
                              this.loadingRecords = false;
                            }
                          });
                        // this.loadingRecords = false;
                      } else {
                        this.message.error(
                          "Can't Load Hospital Mapped Data.",
                          ''
                        );
                        this.loadingRecords = false;
                      }
                    },
                    (err) => {}
                  );
                this.loadingRecords = false;
              } else {
                this.message.error(
                  'This claim is already picked by another inspector',
                  ''
                );
                this.loadingRecords = false;
              }
            } else {
              this.loadingRecords = false;
              this.message.error('No record found', '');
            }
          } else {
            this.loadingRecords = false;
            this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
  }

  viewFileNew1111(data) {
    window.open(this.api.retriveimgUrl + 'claimForm/' + data.CLAIM_FORM);
  }
}
