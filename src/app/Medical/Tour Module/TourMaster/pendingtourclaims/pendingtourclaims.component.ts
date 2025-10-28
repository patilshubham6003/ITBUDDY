import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-pendingtourclaims',
  templateUrl: './pendingtourclaims.component.html',
  styleUrls: ['./pendingtourclaims.component.css'],
})
export class PendingtourclaimsComponent implements OnInit {
  userId = sessionStorage.getItem('userId');
  parentUserId: any;
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;

  formTitle = 'Manage Pending Tour Claims';
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
  newButton: any = 'default';
  forwardButton: any = 'default';
  rejectButton: any = 'default';
  queryButton: any = 'default';
  approvedButton: any = 'default';
  readyButton: any = 'default';
  totalButton: any = 'default';
  claimData: any;
  filterClass = 'filter-invisible';
  columns: string[][] = [
    ['EMPLOYEE_NAME', ''],
    ['BASIC_PAY', ''],
    ['DESIGNATION', ''],
    ['HEADQUARTERS_NAME', ''],
    ['MOBILE_NO', ''],
    ['GRADE_PAY_LEVEL', ''],
  ];

  TYPE_OF_HOSPITAL: any;
  STAGE_NAME = [1, 2];
  isSpinning = false;

  // clearFilter() {
  //   this.filterClass = 'filter-invisible';
  //   this.isFilterApplied = 'default';
  //   this.filterQuery = '';
  //   this.BILL_FILIING_DATE = [];
  //   this.TYPE_OF_HOSPITAL = [];
  //   this.dataList = [];
  //   this.applyFilter();
  // }

  dateFormat = 'dd/MM/yyyy';
  isButtonSpinning: boolean = false;
  ddoID: any;
  START_DATE: any;
  END_DATE: any;
  BILL_FILIING_DATE: any = [];
  current = new Date();
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.ddoID = Number(sessionStorage.getItem('ddoId'));
    this.userId = sessionStorage.getItem('userId');
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
    this.userName = sessionStorage.getItem('userName');
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

    this.loadingRecords = true;
    this.api
      .gettouralldata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,this.filterQuery +
        " AND TOUR_STATUS ='P' AND DDO_OF_THE_OFFICIAL_ID =" +
          this.ddoID +
          likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        },
        (err) => {}
      );
  }

  // applyFilter() {
  //   this.filterClass = 'filter-invisible';
  //   this.isFilterApplied = 'primary';
  //   this.loadingRecords = false;

  //   this.filterQuery = '';
  //   if (
  //     this.BILL_FILIING_DATE != undefined &&
  //     this.BILL_FILIING_DATE.length > 0
  //   ) {
  //     var BILL_FILIING_DATE = this.datePipe.transform(
  //       this.BILL_FILIING_DATE[0],
  //       'yyyy-MM-dd 00:00:00'
  //     );
  //     var BILL_FILIING_DATE2 = this.datePipe.transform(
  //       this.BILL_FILIING_DATE[1],
  //       'yyyy-MM-dd 23:59:59'
  //     );

  //     if (this.BILL_FILIING_DATE[0] != null) {
  //       this.START_DATE = this.BILL_FILIING_DATE[0];
  //     }

  //     if (this.BILL_FILIING_DATE[1] != null) {
  //       this.END_DATE = this.BILL_FILIING_DATE[1];
  //     }

  //     this.filterQuery =
  //       ' AND (BILL_FILIING_DATE BETWEEN ' +
  //       BILL_FILIING_DATE +
  //       ' AND ' +
  //       BILL_FILIING_DATE2 +
  //       ')';
  //   } else {
  //     this.filterQuery = '';
  //     this.START_DATE = null;
  //     this.END_DATE = null;
  //     this.BILL_FILIING_DATE = [];
  //   }

  //   if (
  //     this.TYPE_OF_HOSPITAL != undefined &&
  //     this.TYPE_OF_HOSPITAL.length > 0
  //   ) {
  //     var f = ' AND(';
  //     for (var i = 0; i < this.TYPE_OF_HOSPITAL.length; i++) {
  //       f = f + 'TYPE_OF_HOSPITAL="N" OR';
  //       if (i + 1 == this.TYPE_OF_HOSPITAL.length) {
  //         f = f.substring(0, f.length - 2) + ')';
  //         this.filterQuery = this.filterQuery + f;
  //       }
  //     }
  //   }

  //   this.search();
  // }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  tourPickData: any = [];
  pickClaim(data: any) {
    this.tourPickData = [];
    this.loadingRecords = true;
    this.tourPickData = data;
    this.api
      .gettouralldata(0, 0, '', '', ' AND ID =' + this.tourPickData.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              if (data['data'][0]['TOUR_STATUS'] == 'P') {
                (this.tourPickData.TOUR_STATUS = 'T'),
                  (this.tourPickData.INSPECTOR_ID = Number(this.userId)),
                  (this.tourPickData['INSPECTOR_NAME'] = this.userName);
                this.tourPickData['CURRENT_STAGE_ID'] = 3;
                this.tourPickData.SUB_INSPECTOR_ID = Number(this.parentUserId);

                this.api
                  .updatetour(this.tourPickData)
                  .subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success('Picked Successfully...', '');
                      this.loadingRecords = false;
                      this.search();
                    } else {
                      this.message.error('Claim Not Picked...', '');
                      this.loadingRecords = false;
                    }
                  });
              } else {
                this.message.error(
                  'This claim is already picked by another inspector',
                  ''
                );
                this.loadingRecords = false;
              }
            } else {
              this.message.error('Record Not Found', '');
              this.loadingRecords = false;
            }
          } else {
            this.message.error("Can't Load Data", '');
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }


  TYPE_OF_CLAIM:any;
  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.TYPE_OF_CLAIM = null;
    this.search();
  }

  applyFilter() {
    this.filterQuery=''
    if( this.TYPE_OF_CLAIM != undefined &&
      this.TYPE_OF_CLAIM != null &&
      this.TYPE_OF_CLAIM != ''){
        this.filterQuery = 'AND IS_APPLYING_FOR_ADVANCE =' + this.TYPE_OF_CLAIM;
        
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
        this.search();
      
   
   
    }
  }

 
}
