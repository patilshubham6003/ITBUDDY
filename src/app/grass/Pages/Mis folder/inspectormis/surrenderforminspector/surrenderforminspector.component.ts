import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-surrenderforminspector',
  templateUrl: './surrenderforminspector.component.html',
  styleUrls: ['./surrenderforminspector.component.css'],
  providers: [DatePipe],
})
export class SurrenderforminspectorComponent {
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
    if (this.showCards == true && this.showSurrenderandflatchange == false) {
      this.getResidenceTypes();
      // this.search();
    } else {
    }
  }

  getResidenceTypes() {
    this.ResidenceTypelist = [];
    this.RESIDENCE_TYPE_ID = [];
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
        }
      },
      (err) => {
        //
        this.message.error('Failed To get Residence Type', '');
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
    this.dataList = [];
    this.api
      .getdatasurrenderlist(
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
          this.employeedata = [];
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

  RESIDENCETYPE_NAME: any;
  EmployeeAcceptancelist: any = [];
  resitypedata: any;
  showSurrenderandflatchange = false;
  changebacktocards() {
    this.showCards = true;
    this.showSurrenderandflatchange = false;
    // this.search(true);
    this.joinedResidencetype = '';
    this.employeedata = [];
    this.ResidenceTypelist = [];
    this.RESIDENCE_TYPE_ID = [];
    this.getResidenceTypes();
  }

  employeedata: any = [];
  showemployeedata(data: any) {
    this.RESIDENCETYPE_NAME = '';
    this.resitypedata = data;

    this.showCards = false;
    this.showSurrenderandflatchange = true;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = data.RESIDENCE_TYPE_NAME;
    this.employeedata = [];
    // AND SURRENDER_SEND_TO_INSPECTOR = 1AND SURRENDER_CARETAKER_STATUS = 'A'
    this.api
      .flatSurenderGet(
        0,
        0,
        'ID',
        'desc',
        '' +
        " AND FINAL_ALLOTMENT_MASTER_ID = " +
        data.ID
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.employeedata = data['data'];
          this.dataList = [];
          this.isRecordLoading = false;
          this.isSpinning = false;
        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
        }
      );
  }

  getflatsurrenderget() {
    this.RESIDENCETYPE_NAME = '';
    this.showCards = false;
    this.showSurrenderandflatchange = true;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = this.resitypedata.RESIDENCE_TYPE_NAME;
    this.employeedata = [];
    // AND SURRENDER_SEND_TO_INSPECTOR = 1 AND SURRENDER_CARETAKER_STATUS = 'A'
    this.api
      .flatSurenderGet(
        0,
        0,
        'ID',
        'desc',
        '' +
        " AND FINAL_ALLOTMENT_MASTER_ID = " +
        this.resitypedata.ID
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.employeedata = data['data'];
          this.dataList = [];
          this.isRecordLoading = false;
          this.isSpinning = false;
        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
        }
      );
  }

  surrenderdatadata: any;
  viewPdfSafe12: any;
  view11: any;
  SurrenderFormApprove(data: any, url: string) {
    this.surrenderdatadata = Object.assign({}, data);
    this.viewPdfSafe12 = '';
    this.view11 = 1;
    this.VisibleOccupancyLetter = true;
    this.viewPdfSafe12 = this.getS11(url);
  }

  VisibleOccupancyLetter = false;
  VisibleOccupancyLetterContentCancel() {
    this.getflatsurrenderget();
    this.VisibleOccupancyLetter = false;
  }

  rejectdata: any;
  RejectSurrenderflat() {
    this.Inspector_REMARK = '';
    this.rejectdata = Object.assign({}, this.surrenderdatadata);
    this.RejectModalInspector = true;
  }

  approvedata: any;
  ApproveSurrenderflat() {
    this.approvedata = Object.assign({}, this.surrenderdatadata);
    this.SurrenderConfirm = true;
  }

  showSurrenderForm(url: string) {
    window.open(this.api.retriveimgUrl + 'surrenderForm/' + url);
  }

  SurrenderConfirm = false;
  CancelSurrenderConfirm() {
    this.SurrenderConfirm = false;
  }
  surrenderconfimok() {
    this.loadingRecords = true;
    this.isSpinning = true;
    let sendtodata = {
      ...this.approvedata,
      SURRENDER_INSPECTOR_STATUS: 'A',
      SURRENDER_INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
      SURRENDER_INSPECTOR_REMARK: null,
      SURRENDER_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
    };
    this.api.Acceptflatsurrenderinspector(sendtodata).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.message.success('Quarter Surrender Accepted Successfully', '');
          this.loadingRecords = false;
          this.isSpinning = false;
          this.CancelSurrenderConfirm();
          this.VisibleOccupancyLetterContentCancel();
        } else {
          this.message.error('Failed To Accept Quarter Surrender', '');
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Accept Quarter Surrender', '');
        this.loadingRecords = false;
        this.isSpinning = false;
      }
    );
  }

  sanitizedLink: any = '';
  getS11(link: string) {
    this.sanitizedLink = '';
    if (this.view11 == 1) {
      var a: any = this.api.retriveimgUrl + 'surrenderForm/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink;
  }

  RejectModalInspector = false;
  Inspector_REMARK: any;
  Cancelsurrendermodal() {
    this.RejectModalInspector = false;
  }
  RejectSurrender() {
    if (
      this.Inspector_REMARK == null ||
      this.Inspector_REMARK == undefined ||
      this.Inspector_REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadingRecords = true;
      this.isSpinning = true;
      let sendtodata = {
        ...this.rejectdata,
        SURRENDER_INSPECTOR_STATUS: 'R',
        SURRENDER_INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
        SURRENDER_INSPECTOR_REMARK: this.Inspector_REMARK,
        SURRENDER_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.api.Rejectflatsurrendercaretaker(sendtodata).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.message.success('Quarter Surrender Rejected successfully', '');
            this.loadingRecords = false;
            this.isSpinning = false;
            this.Cancelsurrendermodal();
            this.VisibleOccupancyLetterContentCancel();
            this.getflatsurrenderget();
          } else {
            this.message.error('Failed To Reject Quarter Surrender', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (error) => {
          this.message.error('Failed To Reject Quarter Surrender', '');
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
    }
  }

  flatchangedata: any;
  FlatchangeRequest(data: any) {
    this.RESIDENCETYPE_NAME = '';
    this.flatchangedata = data;

    this.showCards = false;
    this.showSurrenderandflatchange = false;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = data.RESIDENCE_TYPE_NAME;
    this.employeedata = [];
    this.api
      .getflatchangerequestsdetails(
        0,
        0,
        'ID',
        'desc',
        '' + ' AND IS_SUBMITTED = 1 AND FINAL_ALLOTMENT_MASTER_ID = ' + data.ID
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.employeedata = data['data'];
          this.dataList = [];
          this.isRecordLoading = false;
          this.isSpinning = false;
        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
        }
      );
  }

  getFlatchangerequestagain() {
    this.RESIDENCETYPE_NAME = '';
    this.showCards = false;
    this.showSurrenderandflatchange = false;
    this.isRecordLoading = true;
    this.RESIDENCETYPE_NAME = this.flatchangedata.RESIDENCE_TYPE_NAME;
    this.employeedata = [];
    this.api
      .getflatchangerequestsdetails(
        0,
        0,
        'ID',
        'desc',
        '' +
        ' AND IS_SUBMITTED = 1 AND FINAL_ALLOTMENT_MASTER_ID = ' +
        this.flatchangedata.ID
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.employeedata = data['data'];
          this.dataList = [];
          this.isRecordLoading = false;
          this.isSpinning = false;
        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
        }
      );
  }

  view22: any;
  viewPdfSafe13: any;
  approvechangeformdata: any;
  Rejectchangeformdata: any;
  showChangeForm(data: any, Url: string) {
    this.approvechangeformdata = Object.assign({}, data);
    this.Rejectchangeformdata = Object.assign({}, data);
    this.viewPdfSafe13 = '';
    this.view22 = 1;
    this.VisibleChangeflatmodal = true;
    this.viewPdfSafe13 = this.getS122(Url);
  }

  viewChangeflatform(url: string) {
    window.open(this.api.retriveimgUrl + 'changeFlatForm/' + url);
  }

  VisibleChangeflatmodal = false;
  VisibleChangeflatmodalCancel() {
    this.getFlatchangerequestagain();
    this.VisibleChangeflatmodal = false;
  }

  sanitizedLink11: any = '';
  getS122(link: string) {
    this.sanitizedLink11 = '';
    if (this.view22 == 1) {
      var a: any = this.api.retriveimgUrl + 'changeFlatForm/' + link;
    }

    this.sanitizedLink11 = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink11;
  }

  RejectChangeflat() {
    this.Flatchange_Remark = '';
    this.RejectFlatchangerequest = true;
  }

  RejectFlatchangerequest = false;
  Flatchange_Remark: any = '';
  CancelRejectFlatchangerequest() {
    this.RejectFlatchangerequest = false;
  }
  RejectFlatchangerequestcomfirm() {
    if (
      this.Flatchange_Remark == null ||
      this.Flatchange_Remark == undefined ||
      this.Flatchange_Remark == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadingRecords = true;
      this.isSpinning = true;
      let sendtodata = {
        ...this.approvechangeformdata,
        CHANGE_INSPECTOR_STATUS: 'R',
        STATUS: 'R',
        CHANGE_INSPECTOR_REMARK: this.Flatchange_Remark,
        CHANGE_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.api.changeflatrequestAction(sendtodata).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Quarter Change Request Rejected successfully',
              ''
            );
            this.loadingRecords = false;
            this.isSpinning = false;
            this.CancelRejectFlatchangerequest();
            this.VisibleChangeflatmodalCancel();
          } else {
            this.message.error('Failed To Reject Quarter Change Request', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (error) => {
          this.message.error('Failed To Reject Quarter Change Request', '');
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
    }
  }

  ApproveChangeflat() {
    this.FlatChangeRequestApprove = true;
  }

  FlatChangeRequestApprove = false;
  CancelApproveFlatChangeRequest() {
    this.FlatChangeRequestApprove = false;
  }
  ConfirmApproveFlatChangeRequest() {
    this.loadingRecords = true;
    this.isSpinning = true;
    let sendtodata = {
      ...this.approvechangeformdata,
      CHANGE_INSPECTOR_STATUS: 'A',
      STATUS: 'A',
      CHANGE_INSPECTOR_REMARK: null,
      CHANGE_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
    };
    this.api.changeflatrequestAction(sendtodata).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.message.success('Quarter Change Request Approved successfully', '');
          this.loadingRecords = false;
          this.isSpinning = false;
          this.CancelApproveFlatChangeRequest();
          this.VisibleChangeflatmodalCancel();
        } else {
          this.message.error('Failed To Approve Quarter Change Request', '');
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Approve Quarter Change Request', '');
        this.loadingRecords = false;
        this.isSpinning = false;
      }
    );
  }
}
