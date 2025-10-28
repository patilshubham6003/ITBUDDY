import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TimelineService } from 'ng-zorro-antd/timeline';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-surrendercaretakerform',
  templateUrl: './surrendercaretakerform.component.html',
  styleUrls: ['./surrendercaretakerform.component.css'],
  providers: [DatePipe],
})
export class SurrendercaretakerformComponent {
  current = 1;
  drawerVisible: boolean = false;
  drawerTitle!: string;
  // drawerData: MISInspectorModel = new MISInspectorModel();
  formTitle = 'Quarter Surrender';
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
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['FLAT_NAME', 'FLAT_NAME'],
  ];
  constructor(
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) { }

  roleid: any;
  userid: any;

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
    // this.getResidenceTypes();
    // this.search();
    this.applyFilter();
  }

  // getResidenceTypes() {
  //   this.ResidenceTypelist = [];
  //   this.RESIDENCE_TYPE_ID = []
  //   this.api.getResidence(0, 0, 'ID', 'asc', " AND STATUS = 1 ").subscribe(data => {
  //     if (data.code == 200) {
  //       this.ResidenceTypelist = data['data']
  //       for (var i = 0; i < this.ResidenceTypelist.length; i++) {
  //         this.RESIDENCE_TYPE_ID.push(this.ResidenceTypelist[i]['ID']);
  //       }

  //     }
  //     else {
  //       this.message.error("Failed To get Residence Type", "");
  //     }
  //   },
  //     (err) => {
  //       //
  //       this.message.error("Failed To get Residence Type", "");

  //     }
  //   );
  // }

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
      likeQuery = likeQuery + ') ';
    }
    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    this.isRecordLoading = true;
    this.isSpinning = true;
    this.api
      .flatSurenderGet(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
        " AND date(SURRENDER_FORM_SUBMITTED_DATE_TIME) BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' AND SURRENDER_SEND_TO_CARETAKER = '1' AND SURRENDER_CARETAKER_ID = " +
        Number(sessionStorage.getItem('userId'))
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isRecordLoading = false;
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
        }
      );
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

  Acceptmodal = false;
  caretakeracceptancedata: any;
  AcceptCaretaker(data: any) {
    this.Acceptmodal = true;
    this.caretakeracceptancedata = Object.assign({}, data);
  }

  acceptmodalcheck() {
    this.loadingRecords = true;
    let sendtodata = {
      ...this.caretakeracceptancedata,
      SURRENDER_CARETAKER_STATUS: 'A',
      SURRENDER_SEND_TO_INSPECTOR: 1,
      SURRENDER_CARETAKER_REMARK: null,
      SURRENDER_CARETAKER_APPROVED_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
    };
    this.api.Acceptflatsurrendercaretaker(sendtodata).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.message.success(
            'Quarter Surrender Accepted & Sent To Inspector',
            ''
          );
          this.loadingRecords = false;
          this.cancelmodal();
        } else {
          this.message.error(
            'Failed To Accept Quarter Surrender By Caretaker',
            ''
          );
          this.loadingRecords = false;
        }
      },
      (error) => {
        this.message.error('Failed To Accept Quarter Surrender By Caretaker', '');
        this.loadingRecords = false;
      }
    );
  }
  cancelmodal() {
    this.search();
    this.Acceptmodal = false;
  }

  RejectModalCaretaker = false;
  CARETAKER_REMARK: any = '';
  RejectRemarkcaretaker: any;
  Rejectcaretaker(data: any) {
    this.CARETAKER_REMARK = '';
    this.RejectModalCaretaker = true;
    this.RejectRemarkcaretaker = Object.assign({}, data);
  }
  Cancelsurrendermodal() {
    this.search();
    this.RejectModalCaretaker = false;
  }
  RejectSurrender() {
    if (
      this.CARETAKER_REMARK == null ||
      this.CARETAKER_REMARK == undefined ||
      this.CARETAKER_REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadingRecords = true;
      let sendtodata = {
        ...this.RejectRemarkcaretaker,
        SURRENDER_CARETAKER_STATUS: 'R',
        SURRENDER_SEND_TO_INSPECTOR: null,
        SURRENDER_CARETAKER_REMARK: this.CARETAKER_REMARK,
        SURRENDER_CARETAKER_APPROVED_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.api.Rejectflatsurrendercaretaker(sendtodata).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Quarter Surrender Rejected By Caretaker successfully',
              ''
            );
            this.loadingRecords = false;
            this.Cancelsurrendermodal();
          } else {
            this.message.error(
              'Failed To Reject Quarter Surrender By Caretaker',
              ''
            );
            this.loadingRecords = false;
          }
        },
        (error) => {
          this.message.error(
            'Failed To Reject Quarter Surrender By Caretaker',
            ''
          );
          this.loadingRecords = false;
        }
      );
    }
  }

  viewsurrederform(url: string) {
    window.open(this.api.retriveimgUrl + 'surrenderForm/' + url);
  }
}
