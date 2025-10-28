import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
// import { NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
// import { areaMaster } from 'src/app/Models/supportAreaMaster';
import { CookieService } from 'ngx-cookie-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ToWords } from 'to-words';
import { AddnewfileformComponent } from '../addnewfileform/addnewfileform.component';
import { Filemaster } from 'src/app/Medical/Models/filemaster';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'Rupees',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});
const toWordsen = new ToWords({
  localeCode: 'hi-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'रुपये',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});

@Component({
  selector: 'app-filemastertable',
  templateUrl: './filemastertable.component.html',
  styleUrls: ['./filemastertable.component.css'],
})
export class FilemastertableComponent implements OnInit {
  isVisible1: boolean;
  isVisible2: boolean;

  @ViewChild(AddnewfileformComponent, { static: false })
  addnewfile: AddnewfileformComponent;
  constructor(
    private cookie: CookieService,
    private datepipe: DatePipe,
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  userID: any;
  ngOnInit() {
    // this.search();
    this.getData();
    this.default = 'primary';

    this.disabledDate1 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;

    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;

    this.userID = Number(sessionStorage.getItem('userId'));
  }

  columns: string[][] = [
    ['FILE_NAME', 'File Name'],
    ['FILE_NUMBER', 'File Number'],
    ['CREATOR_NAME', 'Created By'],
    ['FILE_CREATED_DATE_TIME', 'Created Date & Time'],
  ];

  columns1: string[][] = [
    ['FILE_NAME', 'File Name'],
    ['FILE_NUMBER', 'File Number'],
    ['CREATOR_NAME', 'Created By'],
    ['FILE_CREATED_DATE_TIME', 'Created Date & Time'],
    ['CURRENT_POSITION_NAME', 'Currently At'],
    ['SENDER_NAME', 'Sent By'],
    ['CURRENT_POSITION_DATETIME', 'Last Updated'],
  ];

  AnnexureVisible = false;
  AnnexureCancel() {
    this.AnnexureVisible = false;
  }
  drawerClaimData: any;
  drawerClaimTitle = '';
  drawerClaimVisible = false;
  QUESTIONARIES: any;
  checkList: any;
  showlayoutDataList: any = [];
  total = 0;
  total1 = 0;
  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;
  SECTION_TYPE: any;
  am = 100;
  queryButton: any = 'default';
  queryButton11: any = 'default';
  queryButtonb11: any = 'default';
  readyButton: any = 'default';
  queryButtonb1s1: any = 'default';
  REFRED_RATE_LIST: any = '';
  openAnnextureFile(data) {
    // this.drawerClaimData = Object.assign({}, data);
    this.api.getclaimed(0, 0, '', '', ' AND ID =' + data.CLAIM_ID).subscribe(
      (data) => {
        this.drawerClaimData = data['data'][0];
      },
      (err) => {}
    );
    this.api
      .getannexture(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND CLAIM_ID=' + this.drawerClaimData.ID
      )
      .subscribe(
        (data) => {
          var countt = data['count'];
          this.AnnexureVisible = true;
          this.showlayoutDataList = data['data'];
          this.total = 0;
          this.total1 = 0;
          for (var i = 0; countt > i; i++) {
            this.total =
              this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
            this.total1 =
              this.total1 + this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
          }

          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }

  printOrderModalVisible: boolean = false;

  openPrintOrderModal(data) {
    this.api.getclaimed(0, 0, '', '', ' AND ID =' + data.CLAIM_ID).subscribe(
      (data) => {
        this.orderdata = data['data'][0];
        let words = toWords.convert(this.am, { currency: true });
        this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
        this.amountinwords = toWords.convert(this.orderdata.ADMISSIBLE_AMOUNT, {
          currency: true,
        });

        let wordss = toWordsen.convert(this.am, { currency: true });
        this.orderdata.ADMISSIBLE_AMOUNT = this.orderdata.ADMISSIBLE_AMOUNT;
        this.amountinwordsh = toWordsen.convert(
          this.orderdata.ADMISSIBLE_AMOUNT,
          {
            currency: true,
          }
        );
        this.printOrderModalVisible = true;
      },
      (err) => {}
    );
    // this.orderdata = data;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  amountInwords = '';
  viewFile(data: any): void {
    this.drawerClaimTitle = 'View Claim File';
    this.api.getclaimed(0, 0, '', '', ' AND ID =' + data.CLAIM_ID).subscribe(
      (data) => {
        this.drawerClaimData = data['data'][0];
        if (
          this.drawerClaimData.ADMISSIBLE_AMOUNT != undefined &&
          this.drawerClaimData.ADMISSIBLE_AMOUNT != null
        ) {
          this.amountInwords = toWords.convert(
            this.drawerClaimData.ADMISSIBLE_AMOUNT,
            { currency: true }
          );
        } else {
        }
        this.drawerClaimVisible = true;
      },
      (err) => {}
    );

    // this.drawerClaimData = Object.assign({}, data);
  }
  drawerClaimClose(): void {
    this.drawerClaimVisible = false;
  }

  get closeClaimCallback() {
    return this.drawerClaimClose.bind(this);
  }

  disabledEndDate2;
  formTitle = 'File Master';
  filterClass: string = 'filter-invisible';
  searchText: string = '';
  isVisible = false;
  isSpinning = false;
  loadingRecords = false;

  isVisible3 = false;

  orgID = Number(sessionStorage.getItem('orgId'));
  drawerTitle: string | undefined;
  drawerTitle1: string | undefined;

  pageIndex = 1;
  pageSize = 10;
  sortKey: string = 'id';
  sortValue: string = 'desc';
  totalRecords = 1;

  startValue: any;
  endValue: any;
  endOpen = false;
  startOpen = false;
  today2 = new Date();
  dates: any = [];
  isFilterApplied: string = 'default';
  filterQuery: string = '';

  dataList: any[] = [];
  listOfData2: any = [];

  user: Filemaster = new Filemaster();

  drawerData: any = [];
  default: any = '';
  default1: any = '';
  default2: any = '';
  default3: any = '';

  drawerClose() {
    this.isVisible = false;
    this.search();
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  cancel(): void {}

  confirm(data): void {
    if (this.array.length > 0) {
      // data.ACTION_STATUS = 'A'

      this.api
        .addbulkforaccept(
          this.sendData,
          'A',
          '',
          sessionStorage.getItem('userId')
        )
        .subscribe((successCode: any) => {
          if (successCode['code'] == 200) {
            this.message.success(
              'File information Updated successfully...',
              ''
            );
            this.search();
            this.alldata = [];
            this.array = [];
            this.sendData = [];
          }
        });
    } else {
      data.ACTION_STATUS = 'A';
      data['USER_ID'] = sessionStorage.getItem('userId');
      this.api.updatefile(data).subscribe((successCode: any) => {
        if (successCode['code'] == 200) {
          this.search();
          this.alldata = [];
          this.array = [];
          this.sendData = [];
          this.message.success('File information Updated successfully...', '');
        }
      });
    }
  }

  myDesk() {
    this.alldata = [];
    this.array = [];
    this.sendData = [];
    this.default = 'primary';
    this.default1 = 'default';
    this.default2 = 'default';
    this.default3 = 'default';
    this.filterQuery =
      ' AND CURRENT_POSITION_ID = ' +
      sessionStorage.getItem('userId') +
      ' AND ACTION_STATUS IN ( "M" , "A" , "R" , "B" , "C") ';
    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
          this.totalRecords = data['count'];
          this.count = data['FILE_COUNTS'];
        },
        (err) => {}
      );
  }

  otherDesk() {
    this.alldata = [];
    this.array = [];
    this.sendData = [];
    this.default1 = 'primary';
    this.default = 'default';
    this.default2 = 'default';
    this.default3 = 'default';
    this.filterQuery =
      ' AND CURRENT_POSITION_ID != ' +
      sessionStorage.getItem('userId') +
      ' AND (CREATOR_ID = ' +
      sessionStorage.getItem('userId') +
      ' OR SENDER_ID = ' +
      sessionStorage.getItem('userId') +
      ')' +
      ' AND ACTION_STATUS IN ( "A" )' +
      ' OR  ( CURRENT_POSITION_ID != ' +
      sessionStorage.getItem('userId') +
      ' AND CREATOR_ID = ' +
      sessionStorage.getItem('userId') +
      ' AND SENDER_ID != ' +
      sessionStorage.getItem('userId') +
      ')';
    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
          this.totalRecords = data['count'];
          this.count = data['FILE_COUNTS'];
        },
        (err) => {}
      );
  }

  PendingMydesk() {
    this.alldata = [];
    this.array = [];
    this.sendData = [];
    this.default1 = 'default';
    this.default = 'default';
    this.default2 = 'primary';
    this.default3 = 'default';
    this.filterQuery =
      ' AND CURRENT_POSITION_ID = ' +
      sessionStorage.getItem('userId') +
      ' AND ACTION_STATUS IN ( "P" ) ';
    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
          this.totalRecords = data['count'];
          this.count = data['FILE_COUNTS'];
        },
        (err) => {}
      );
  }
  PendingOtherdesk() {
    this.alldata = [];
    this.array = [];
    this.sendData = [];
    this.default1 = 'default';
    this.default = 'default';
    this.default2 = 'default';
    this.default3 = 'primary';
    this.filterQuery =
      ' AND SENDER_ID = ' +
      sessionStorage.getItem('userId') +
      '  AND ACTION_STATUS IN ( "P")';
    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
          this.totalRecords = data['count'];
          this.count = data['FILE_COUNTS'];
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

  search(reset: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
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

      this.columns1.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery + likeQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.count = data['FILE_COUNTS'];
          this.dataList = data['data'];
        },
        (err) => {}
      );
  }

  getData() {
    this.filterQuery =
      ' AND CURRENT_POSITION_ID = ' +
      sessionStorage.getItem('userId') +
      ' AND ACTION_STATUS IN ( "M" , "A" , "R" , "B", "C","F")  ';

    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        this.sortValue,
        this.filterQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          this.loadingRecords = false;
          this.dataList = data['data'];
          this.totalRecords = data['count'];
          this.count = data['FILE_COUNTS'];
        },
        (err) => {}
      );
  }
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  count: any = [];

  array: any = [];
  checked = false;
  checked1 = false;
  checkedd = true;
  indeterminate = true;
  indeterminate1 = false;
  setOfCheckedId = new Set<number>();
  setOfCheckedId1 = new Set<number>();
  alldata: any = [];
  sendData: any = [];
  isChecked: boolean;

  transferButton: boolean = true;
  closeButton: boolean = true;
  finalButton: boolean = true;
  pullbackButton: boolean = true;
  acceptButton: boolean = true;
  rejectButton: boolean = true;

  onChecked1(id: number, checked: boolean, data: any): void {
    this.array = [];
    this.alldata = [];
    if (checked) {
      this.isChecked = checked;
      this.array.push(id);
      this.alldata.push(data);
      this.sendData.push(data);
      var transferButton: boolean = false;
      var closeButton: boolean = false;
      var finalButton: boolean = false;
      var pullbackButton: boolean = false;
      var acceptButton: boolean = false;
      var rejectButton: boolean = false;

      for (let h = 0; h < this.sendData.length; h++) {
        if (
          this.sendData[h].CURRENT_POSITION_ID !=
            sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS == 'P'
        ) {
          transferButton = true;
        }

        if (this.sendData[h].FILE_STATUS == 'C') {
          closeButton = true;
        }

        if (
          this.sendData[h].CREATOR_ID != sessionStorage.getItem('userId') ||
          this.sendData[h].IS_ADVANCE != 'Y' ||
          this.sendData[h].FILE_STATUS == 'C'
        ) {
          finalButton = true;
        }

        if (
          this.sendData[h].SENDER_ID != sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS != 'P'
        ) {
          pullbackButton = true;
        }
        if (
          this.sendData[h].CURRENT_POSITION_ID !=
            sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS != 'P'
        ) {
          acceptButton = true;
        }
        if (
          this.sendData[h].CURRENT_POSITION_ID !=
            sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS != 'P'
        ) {
          rejectButton = true;
        }

        if (h + 1 == this.sendData.length) {
          this.transferButton = transferButton == false ? false : true;
          this.closeButton = closeButton == false ? false : true;
          this.finalButton = finalButton == false ? false : true;
          this.pullbackButton = pullbackButton == false ? false : true;
          this.acceptButton = acceptButton == false ? false : true;
          this.acceptButton = acceptButton == false ? false : true;
          this.rejectButton = rejectButton == false ? false : true;
        }
      }
      this.indeterminate = false;
    } else {
      this.sendData = this.sendData.filter((element) => id != element.ID);
      this.array = this.array.filter((element) => id != element);

      var transferButton: boolean = false;
      var closeButton: boolean = false;
      var finalButton: boolean = false;
      var pullbackButton: boolean = false;
      var acceptButton: boolean = false;
      var rejectButton: boolean = false;

      for (let h = 0; h < this.sendData.length; h++) {
        if (
          this.sendData[h].CURRENT_POSITION_ID !=
          sessionStorage.getItem('userId')
        ) {
          transferButton = true;
        }

        if (this.sendData[h].FILE_STATUS == 'C') {
          closeButton = true;
        }

        if (
          this.sendData[h].CREATOR_ID != sessionStorage.getItem('userId') ||
          this.sendData[h].IS_ADVANCE != 'Y' ||
          this.sendData[h].FILE_STATUS == 'C'
        ) {
          finalButton = true;
        }

        if (
          this.sendData[h].SENDER_ID != sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS != 'P'
        ) {
          pullbackButton = true;
        }
        if (
          this.sendData[h].CURRENT_POSITION_ID !=
            sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS != 'P'
        ) {
          acceptButton = true;
        }
        if (
          this.sendData[h].CURRENT_POSITION_ID !=
            sessionStorage.getItem('userId') ||
          this.sendData[h].ACTION_STATUS != 'P'
        ) {
          rejectButton = true;
        }

        if (h + 1 == this.sendData.length) {
          this.transferButton = transferButton == false ? false : true;
          this.closeButton = closeButton == false ? false : true;
          this.finalButton = finalButton == false ? false : true;
          this.pullbackButton = pullbackButton == false ? false : true;
          this.acceptButton = acceptButton == false ? false : true;
          this.acceptButton = acceptButton == false ? false : true;
          this.rejectButton = rejectButton == false ? false : true;
        }
      }

      this.indeterminate = true;
    }
  }

  onAllChecked1(value: boolean): void {
    this.array = [];
    this.sendData = [];
    this.dataList.forEach((item) => {
      this.isChecked = value;
      this.alldata = [];
      if (value) {
        if (value == true) {
          if (item.ACTION_STATUS != 'C') {
            this.array.push(item.ID);
            this.alldata.push(item);
            this.sendData.push(item);
            var transferButton: boolean = false;
            var closeButton: boolean = false;
            var finalButton: boolean = false;
            var pullbackButton: boolean = false;
            var acceptButton: boolean = false;
            var rejectButton: boolean = false;

            for (let h = 0; h < this.sendData.length; h++) {
              if (
                this.sendData[h].CURRENT_POSITION_ID !=
                  sessionStorage.getItem('userId') ||
                this.sendData[h].ACTION_STATUS == 'P'
              ) {
                transferButton = true;
              }

              if (this.sendData[h].FILE_STATUS == 'C') {
                closeButton = true;
              }

              if (
                this.sendData[h].CREATOR_ID !=
                  sessionStorage.getItem('userId') ||
                this.sendData[h].IS_ADVANCE != 'Y' ||
                this.sendData[h].FILE_STATUS == 'C'
              ) {
                finalButton = true;
              }

              if (
                this.sendData[h].SENDER_ID !=
                  sessionStorage.getItem('userId') ||
                this.sendData[h].ACTION_STATUS != 'P'
              ) {
                pullbackButton = true;
              }
              if (
                this.sendData[h].CURRENT_POSITION_ID !=
                  sessionStorage.getItem('userId') ||
                this.sendData[h].ACTION_STATUS != 'P'
              ) {
                acceptButton = true;
              }
              if (
                this.sendData[h].CURRENT_POSITION_ID !=
                  sessionStorage.getItem('userId') ||
                this.sendData[h].ACTION_STATUS != 'P'
              ) {
                rejectButton = true;
              }

              if (h + 1 == this.sendData.length) {
                this.transferButton = transferButton == false ? false : true;
                this.closeButton = closeButton == false ? false : true;
                this.finalButton = finalButton == false ? false : true;
                this.pullbackButton = pullbackButton == false ? false : true;
                this.acceptButton = acceptButton == false ? false : true;
                this.acceptButton = acceptButton == false ? false : true;
                this.rejectButton = rejectButton == false ? false : true;
              }
            }
            this.checked1 = true;
            this.indeterminate = false;
          }
        }

        // item.IS_SELECTED = 1
      } else {
        // item.IS_SELECTED = 0
        this.array = [];
        this.checked1 = false;
        this.indeterminate = true;
      }
    });
  }
  filterQuery1 = '';
  applyFilter() {
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.startValue = this.datepipe.transform(this.startValue, 'yyyy-MM-dd');
    this.endValue = this.datepipe.transform(this.endValue, 'yyyy-MM-dd');

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    // this.filterQuery = '';
    this.startValue = this.datepipe.transform(
      this.startValue,
      'yyyy-MM-dd 00:00:00'
    );
    this.endValue = this.datepipe.transform(
      this.endValue,
      'yyyy-MM-dd 23:59:59'
    );

    if (this.startValue != null && this.endValue != null) {
      this.filterQuery1 =
        " AND FILE_CREATED_DATE_TIME BETWEEN '" +
        this.startValue +
        "' AND '" +
        this.endValue +
        "' ";

      var filter = '';
      filter = this.filterQuery1;
      var likeQuery = '';
    }

    // if (this.data.ALLOTMENT_TYPE_ID != null) {
    //   this.filterQuery =
    //     this.filterQuery + ' AND ALLOTMENT_TYPE_ID=' + "" + this.data.ALLOTMENT_TYPE_ID + "";
    // }

    this.search();
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns1.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.api
      .getFileMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterQuery1 + this.filterQuery,
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.isFilterApplied = 'primary';
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.count = data['FILE_COUNTS'];
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
          // this.search();
        },
        (err) => {}
      );
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.startValue = null;
    this.endValue = null;

    this.isFilterApplied = 'default';
    this.filterQuery = '';

    this.dataList = [];
    this.disabledDate1 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;

    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date()) > 0;
    this.search();
    // this.data.ALLOTMENT_TYPE_ID = null;
  }

  startDateChange() {
    if (this.startValue != null) {
      var startDate = this.datepipe.transform(this.startValue, 'yyyy-MM-dd');
      var endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

      this.disabledDate2 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.startValue)) < 0;
    } else {
      this.disabledDate2 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date()) > 0;
    }
  }

  endDateChange() {
    var startDate = this.datepipe.transform(this.startValue, 'yyyy-MM-dd');
    var endDate = this.datepipe.transform(this.endValue, 'yyyy-MM-dd');

    if (this.endValue != null) {
      this.disabledDate1 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.endValue)) > 0;
    } else {
      this.disabledDate1 = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date()) > 0;
    }
  }

  getDaysArray(start: any, end: any) {
    for (
      var arr: any = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(this.datepipe.transform(dt, 'yyyy-MM-dd'));
      this.dates.push(this.datepipe.transform(dt, 'yyyy-MM-dd'));
    }
    return arr;
  }

  timeDefaultValue = setHours(new Date(), 0);

  disabledStartDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) > 0;

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.startValue)) < 0;

  disabledDate1 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.endValue)) > 0;

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.endOpen = true;

      // this.endValue = this.startValue;
    }
  }
  Hierarchy: any = [];
  add() {
    this.drawerTitle = 'Create File';
    this.user = new Filemaster();
    this.user.STATUS = true;
    this.api
      .getAllFilehierarchy(0, 0, '', '', 'AND IS_LAST=1')
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.Hierarchy = data['data'];
          this.isVisible = true;
        }
      });
    // this.api.getFileMaster(0, 0, 'SEQUENCE_NO', 'desc', '').subscribe((data) => {
    //   if (data['count'] == 0) {
    //     this.user.SEQUENCE_NO = 1;
    //   } else {
    //     this.user.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
    //   }
    // }, (err) => {
    //
    // });
  }

  edit(data: Filemaster) {
    this.isVisible = true;
    this.drawerTitle = 'Update File';
    this.user = Object.assign({}, data);
    if (data.FILE_STATUS == 'A' || data.FILE_STATUS == 'T') {
      this.user.FILE_STATUS = 'A';
    }

    if (data.STATUS == '0') {
      this.user.STATUS = false;
    } else {
      this.user.STATUS = true;
    }

    this.addnewfile.getallorg2(data.ID);

    // this.api.getFileMaster(0, 0, '', '', " AND ID !=" + data.ID).subscribe(data => {
    //   this.listOfData2 = data['data'];

    // }, err => {
    //
    // });
  }
  isApproveVisible = false;
  APPROVER_ID;
  REMARK: any = '';
  PULLBACKREMARKK: any = '';
  CloseFileREMARK: any = '';
  FileId;

  openApproveModalHP(data) {
    this.isApproveVisible = true;
    this.FileId = data.ID;
    this.loadAllTaggedUsers();
  }

  handleApproveCancel() {
    this.isApproveVisible = false;
    this.APPROVER_ID = null;
    this.REMARK = '';
  }
  isApproveVisiblepullback = false;
  handleApprovepullback() {
    this.isApproveVisiblepullback = false;
    // this.APPROVER_ID=null
    // this.REMARK=''
  }
  tempData1 = new Object();
  confirm1(data): void {
    this.isApproveVisiblepullback = true;
    this.tempData1 = new Object();
    this.tempData1 = data;
  }

  isApproveVisibleCloseFile = false;
  tempData2 = new Object();
  confirm2(data): void {
    this.isApproveVisibleCloseFile = true;
    this.tempData2 = new Object();
    this.tempData2 = data;
  }
  handleApproveCloseFile() {
    this.isApproveVisibleCloseFile = false;
  }
  closeremark: any;
  handleApproveOkCloseFile() {
    if (this.array.length > 0) {
      // this.tempData2["ACTION_STATUS"] = "C";
      // this.tempData2["FILE_STATUS"] = "C";
      if (this.CloseFileREMARK == null || this.CloseFileREMARK == undefined) {
        this.closeremark = '';
      } else {
        this.closeremark = this.CloseFileREMARK;
      }
      this.api
        .addbulkforaccept(
          this.sendData,
          'C',
          this.closeremark,
          sessionStorage.getItem('userId')
        )
        .subscribe((successCode: any) => {
          if (successCode['code'] == 200) {
            this.search();
            this.isApproveVisibleCloseFile = false;
            this.alldata = [];
            this.array = [];
            this.sendData = [];
            this.CloseFileREMARK = '';
            this.message.success(
              'File information Updated successfully...',
              ''
            );
          }
        });
    } else {
      this.tempData2['ACTION_STATUS'] = 'C';
      this.tempData2['FILE_STATUS'] = 'C';
      this.tempData2['USER_ID'] = sessionStorage.getItem('userId');

      if (this.CloseFileREMARK == null || this.CloseFileREMARK == undefined) {
        this.tempData2['REMARK'] = '';
      } else {
        this.tempData2['REMARK'] = this.CloseFileREMARK;
      }
      this.api.updatefile(this.tempData2).subscribe((successCode: any) => {
        if (successCode['code'] == 200) {
          this.search();
          this.alldata = [];
          this.array = [];
          this.sendData = [];
          this.CloseFileREMARK = '';
          this.isApproveVisibleCloseFile = false;
          this.message.success('File information Updated successfully...', '');
        }
      });
    }
  }
  tempData6 = new Object();
  FINALREMARK: any = '';
  Teststatus: any;
  confirm6(data): void {
    this.isApproveVisibleFinal = true;
    this.tempData6 = new Object();
    this.tempData6 = data;
    this.Teststatus = data.ACTION_STATUS;
  }
  isApproveVisibleFinal = false;
  handleApproveFinal() {
    this.isApproveVisibleFinal = false;
  }
  finalremar: any;
  handleApproveOkFinal() {
    if (this.array.length > 0) {
      // this.tempData6["ACTION_STATUS"] = "F";
      // this.tempData6["IS_ADVANCE"] = "F";
      if (this.FINALREMARK == null || this.FINALREMARK == undefined) {
        this.finalremar = '';
      } else {
        this.finalremar = this.FINALREMARK;
      }

      this.api
        .addbulkforaccept1(
          this.sendData,
          this.finalremar,
          'F',
          sessionStorage.getItem('userId')
        )
        .subscribe((successCode: any) => {
          if (successCode['code'] == 200) {
            this.search();
            this.isApproveVisibleFinal = false;
            this.alldata = [];
            this.array = [];
            this.sendData = [];
            this.FINALREMARK = '';
            this.message.success(
              'File information Updated successfully...',
              ''
            );
          }
        });
    } else {
      this.tempData6['TEST_STATUS'] = this.Teststatus;
      this.tempData6['ACTION_STATUS'] = '';
      this.tempData6['IS_ADVANCE'] = 'F';
      this.tempData6['USER_ID'] = sessionStorage.getItem('userId');
      this.api.updatefile(this.tempData6).subscribe((successCode: any) => {
        if (successCode['code'] == 200) {
          this.search();
          this.alldata = [];
          this.array = [];
          this.sendData = [];
          this.FINALREMARK = '';
          this.isApproveVisibleFinal = false;
          this.message.success('File information Updated successfully...', '');
        }
      });
    }
  }
  puulbackre: any;
  handleApproveOkpullback() {
    if (this.array.length > 0) {
      // this.tempData1["ACTION_STATUS"] = "B";
      if (this.PULLBACKREMARKK == null || this.PULLBACKREMARKK == undefined) {
        this.puulbackre == '';
      } else {
        this.puulbackre = this.PULLBACKREMARKK;
      }

      this.api
        .addbulkforaccept(
          this.sendData,
          'B',
          this.puulbackre,
          sessionStorage.getItem('userId')
        )
        .subscribe((successCode: any) => {
          if (successCode['code'] == 200) {
            this.search();
            this.isApproveVisiblepullback = false;
            this.alldata = [];
            this.array = [];
            this.sendData = [];
            this.PULLBACKREMARKK = '';
            this.message.success(
              'File information Updated successfully...',
              ''
            );
          }
        });
    } else {
      this.tempData1['ACTION_STATUS'] = 'B';
      this.tempData1['USER_ID'] = sessionStorage.getItem('userId');
      this.api.updatefile(this.tempData1).subscribe((successCode: any) => {
        if (successCode['code'] == 200) {
          this.search();
          this.isApproveVisiblepullback = false;
          this.alldata = [];
          this.array = [];
          this.sendData = [];
          this.PULLBACKREMARKK = '';
          this.message.success('File information Updated successfully...', '');
        }
      });
    }
  }

  isApproveVisiblereject = false;
  handleApproveCancel111() {
    this.isApproveVisiblereject = false;
    // this.APPROVER_ID=null
    // this.REMARK=''
  }
  rejectdata: any = [];
  tempData = new Object();
  Reject(data) {
    this.isApproveVisiblereject = true;
    // this.rejectdata = data
    this.tempData = new Object();
    this.tempData = data;
  }
  REJECTREMARK: any = '';
  remarkk: any;
  handleApproveOkreject() {
    if (this.array.length > 0) {
      // this.tempData["ACTION_STATUS"] = "R";
      if (this.REJECTREMARK == null || this.REJECTREMARK == undefined) {
        this.remarkk = '';
      } else {
        this.remarkk = this.REJECTREMARK;
      }

      this.api
        .addbulkforaccept(
          this.sendData,
          'R',
          this.remarkk,
          sessionStorage.getItem('userId')
        )
        .subscribe((successCode: any) => {
          if (successCode['code'] == 200) {
            this.search();
            this.isApproveVisiblereject = false;
            this.alldata = [];
            this.array = [];
            this.REJECTREMARK = '';
            this.sendData = [];
            this.message.success(
              'File information Updated successfully...',
              ''
            );
          }
        });
    } else {
      this.tempData['ACTION_STATUS'] = 'R';
      this.tempData['REMARK'] = this.REJECTREMARK;
      this.tempData['USER_ID'] = sessionStorage.getItem('userId');
      // this.tempData["CURRENT_POSITION_ID "] = this.tempData["SENDER_ID "]
      this.api.updatefile(this.tempData).subscribe((successCode: any) => {
        if (successCode['code'] == 200) {
          this.search();
          this.alldata = [];
          this.array = [];
          this.REJECTREMARK = '';
          this.sendData = [];
          this.isApproveVisiblereject = false;
          this.message.success('File information Updated successfully...', '');
        }
      });
    }
  }

  ACTION_STATUS;
  handleApproveOk() {
    if (this.array.length > 0) {
      if (this.APPROVER_ID == null) {
        this.message.error('Please Select User...', '');
      } else {
        this.api
          .addbulkforaccept3(
            this.APPROVER_ID,
            this.REMARK,
            sessionStorage.getItem('userId'),
            'P',
            this.sendData
          )
          .subscribe((successCode: any) => {
            if (successCode['code'] == 200) {
              this.search();
              this.alldata = [];
              this.array = [];
              this.sendData = [];
              this.APPROVER_ID = null;
              this.REMARK = null;
              this.isApproveVisible = false;
              this.message.success(
                'File information Updated successfully...',
                ''
              );
            }
          });
      }
    } else {
      if (this.APPROVER_ID == null) {
        this.message.error('Please Select User And Enter Remark...', '');
      } else {
        this.api
          .transferFile(
            this.APPROVER_ID,
            this.REMARK,
            this.FileId,
            sessionStorage.getItem('userId'),
            (this.ACTION_STATUS = 'P')
          )
          .subscribe((successCode) => {
            if (successCode['code'] == 200) {
              this.message.success('File Transfered successfully...', '');
              this.getData();
              this.APPROVER_ID = null;
              this.REMARK = null;
              this.isApproveVisible = false;
            } else {
              this.message.error('Failed to Transfer File...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
  users: any = [];
  loadAllTaggedUsers() {
    this.api
      .getAllUsers(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_ACTIVE = 1 AND ID != ' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (userData) => {
          this.users = userData['data'];
        },
        (err) => {}
      );
  }
  isApproveVisible11 = false;
  handleApproveCancel11() {
    this.isApproveVisible11 = false;
  }

  handleApproveOk11() {
    this.isApproveVisible11 = false;
  }
  LOGS: any = [];
  openLOGModal(data) {
    this.isApproveVisible11 = true;
    this.api.getLogs(0, 0, 'ID', 'desc', ' AND FILE_ID = ' + data.ID).subscribe(
      (userData1) => {
        this.LOGS = userData1['data'];
      },
      (err) => {}
    );
  }

  LOGS1: any = [];
  isVisible11: boolean = false;
  drawerClose1() {
    this.isVisible11 = false;
    this.search();
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  filename: any;
  type;
  logData: any = [];
  FILE_OR_CLAIM: boolean = false;
  viewlogs(data) {
    // this.LOGS1 = data;
    this.LOGS1 = Object.assign({}, data);
    this.type = 'f';
    this.drawerTitle1 = 'Logs';
    this.FILE_OR_CLAIM = false;
    this.filename = this.LOGS1['FILE_NUMBER'];
    this.api
      .getclaimLogs(0, 0, 'ID', 'asc', ' AND CLAIM_ID = ' + data.CLAIM_ID)
      .subscribe(
        (userData1) => {
          if (userData1['count'] == 0) {
            this.logData = [];
          } else {
            this.logData = userData1['data'];
          }
        },
        (err) => {}
      );
    this.isVisible11 = true;
  }
}
