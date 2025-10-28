import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-transfer-pending-claim',
  templateUrl: './transfer-pending-claim.component.html',
  styleUrls: ['./transfer-pending-claim.component.css'],
})
export class TransferPendingClaimComponent implements OnInit {
  drawerTitle!: string;
  userId = sessionStorage.getItem('userId');
  parentUserId = Number(sessionStorage.getItem('parentUserID'));
  userName = sessionStorage.getItem('userName');
  formTitle = 'Transfer Pending Claim';
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
    ['NAME', 'NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['ADDRESS', 'ADDRESS'],
    ['NEW_HEADQUARTERS_NAME', 'NEW_HEADQUARTERS_NAME'],
    ['NEW_ADDRESS', 'NEW_ADDRESS'],
  ];

  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  ddoID: any;
  ngOnInit(): void {
    this.ddoID = Number(sessionStorage.getItem('ddoId'));
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
      .gettransferdata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,this.filterQuery+
        likeQuery +
          " AND TRANSFER_STATUS = 'P' AND DDO_OF_THE_OFFICIAL_ID =" +
          this.ddoID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            // this.filterClass = 'filter-invisible';
          } else {
            this.message.error("Can't Load Data", '');
            this.loadingRecords = false;
          }
        },

        (err) => {}
      );
  }

  transferPickData: any = [];
  update(data: any) {
    this.transferPickData = [];
    this.loadingRecords = true;
    this.transferPickData = data;

    this.api
      .gettransferdata(0, 0, '', '', ' AND ID =' + this.transferPickData.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              if (data['data'][0]['TRANSFER_STATUS'] == 'P') {
                this.transferPickData['TRANSFER_STATUS'] = 'T';
                this.transferPickData['INSPECTOR_ID'] = this.userId;
                this.transferPickData['SUB_INSPECTOR_ID'] = this.parentUserId;
                this.transferPickData['INSPECTOR_NAME'] = this.userName;
                this.transferPickData['CURRENT_STAGE_ID'] = 3;

                this.api
                  .updatetransfer(this.transferPickData)
                  .subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success('Picked Successfully...', '');
                      this.search();
                      this.loadingRecords = false;
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

  // sort(params: NzTableQueryParams) {
  //   this.loadingRecords = true;
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find(item => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'ID';
  //   const sortOrder = (currentSort && currentSort.value) || 'asc';
  //

  //
  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search();
  // }

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
        this.filterQuery = 'AND IS_APPLYING_FOR_ADVANCE =' + this.TYPE_OF_CLAIM;
        
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
