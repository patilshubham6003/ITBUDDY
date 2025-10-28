import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-list-pending-claim',
  templateUrl: './list-pending-claim.component.html',
  styleUrls: ['./list-pending-claim.component.css'],
  providers: [NzNotificationService],
})
export class ListPendingClaimComponent implements OnInit {
  drawerTitle!: string;
  userId = sessionStorage.getItem('userId');
  parentUserId: any;
  userName = sessionStorage.getItem('userName');
  formTitle = 'LTC Pending Claim';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['GRADE_PAY', 'GRADE_PAY'],
    ['GRADE_PAY_LEVEL', 'GRADE_PAY_LEVEL'],
    ['NATURE_OF_LEAVE', 'NATURE_OF_LEAVE'],
    ['LEAVE_START_DATE', 'LEAVE_START_DATE'],
    ['LEAVE_END_DATE', 'LEAVE_END_DATE'],
    ['BLOCK_YEAR', 'BLOCK_YEAR'],
  ];
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ddoID: any;
  ngOnInit(): void {
    this.ddoID = Number(sessionStorage.getItem('ddoId'));
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  keyup(event: any) {
    this.search();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
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

    this.api
      .getAllltcMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,this.filterQuery +
        likeQuery +
          " AND LTC_STATUS = 'P' AND DDO_OF_THE_OFFICIAL_ID =" +
          this.ddoID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            // this.isSpinning = false;
            // this.filterClass = 'filter-invisible';
          } else {
            this.message.error("Can't Load Data", '');
            this.loadingRecords = false;
          }
        },

        (err) => {}
      );
  }

  ltcPickData: any = [];
  update(data: any) {
    this.ltcPickData = [];
    this.loadingRecords = true;
    this.ltcPickData = data;
    this.api
      .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.ltcPickData.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              if (data['data'][0]['LTC_STATUS'] == 'P') {
                this.ltcPickData['LTC_STATUS'] = 'T';
                this.ltcPickData['INSPECTOR_ID'] = this.userId;
                this.ltcPickData['SUB_INSPECTOR_ID'] = this.parentUserId;
                this.ltcPickData['INSPECTOR_NAME'] = this.userName;
                this.ltcPickData['CURRENT_STAGE_ID'] = 3;

                this.api
                  .ltcMasterUpdate(this.ltcPickData)
                  .subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success('Picked Successfully...', '');
                      this.search();
                      this.loadingRecords = false;
                    } else {
                      this.message.error('Problem To Pick The Claim...', '');
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
              this.message.error('No record found', '');
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
 
  sort(sort: any): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    if (this.sortValue == 'descend') {
      this.sortValue = 'desc';
    } else {
      this.sortValue = 'asc';
    }
    this.search(true);
  }
  TYPE_OF_CLAIM:any;
  filterClass = 'filter-invisible';
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
        this.filterQuery = 'AND IS_ADVANCE_CLAIM =' + this.TYPE_OF_CLAIM;
        
        this.filterClass = 'filter-invisible';
        this.isFilterApplied = 'primary';
        this.search();
      
   
   
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }


}
