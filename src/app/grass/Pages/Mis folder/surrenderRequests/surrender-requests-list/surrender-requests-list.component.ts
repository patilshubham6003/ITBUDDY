import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys, grass } from 'src/app/app.constant';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-surrender-requests-list',
  templateUrl: './surrender-requests-list.component.html',
  styleUrls: ['./surrender-requests-list.component.css'],
  providers: [DatePipe]
})
export class SurrenderRequestsListComponent {
  current = 1;
  drawerVisible: boolean = false;
  drawerTitle!: string;
  // drawerData: MISInspectorModel = new MISInspectorModel();
  formTitle = 'Quarter Surrender Requests';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pendingscounts = 0;
  registercounts = 0;
  approvedcounts = 0;
  deleteedcounts = 0;
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
  datee: any;

  todaysdateee: any = new Date();
  dateprevioue: any = new Date();
  dateprevioue1: any;
  dateprevioue2: any;

  todaysdateee1: any = new Date();
  dateeeeeforremnderPH: any;

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
  KeyImage: any = grass.key;
  VACANT_ORDER_NO: any;
  ADDRESS: any;
  DESIGNATIONT: any;

  ngOnInit() {
    this.KeyImage = grass.key;

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
    this.getAllUsers();

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

  disabledStartDate = (current: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.datee = current;
    return current < yesterday;
  };

  // disabledStartDatess = (current: Date): boolean => {
  //   const yesterday = new Date();
  //   yesterday.setDate(yesterday.getDate() - 1);
  //   this.datee = current;
  //   return current >= yesterday;
  // };

  disabledStartDatess = (current: Date): boolean => {
    const today = new Date();
    this.datee = current;
    // Disable all future dates (i.e., any date greater than today)
    return current > today;
  };
  disabledStartDate11 = (current: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.datee = current;
    return current < yesterday;
  };
  Signaturearray: any = [];
  SIGNNAME = '';
  NAME_HN = '';
  POST = '';
  POST_HIN = '';
  OFFICE_NAME = '';
  OFFICE_NAME_HIN = '';
  imgurl = appkeys.retriveimgUrl;
  SIGNATURE_IMAGE = '';

  getAllUsers() {
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        ' AND STATUS = 1  AND SERVICE_ID = 5 '
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Signaturearray = data['data'];
          }
        },
        (err) => { }
      );
  }

  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HIN = f[0]['OFFICE_NAME_HN'];
      this.SIGNATURE_IMAGE = f[0]['SIGNATURE_IMAGE'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HIN = '';
      this.SIGNATURE_IMAGE = '';
    }
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
  rejectscounts: any = 0
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
    var statusFilter = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      statusFilter = ' AND SURRENDER_INSPECTOR_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    }
    this.isRecordLoading = true;
    this.isSpinning = true;
    this.api
      .flatSurenderGet1(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        " AND SURRENDER_FORM_SUBMITTED_DATE_TIME BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 + "'",
        likeQuery +
        " AND SURRENDER_FORM_SUBMITTED_DATE_TIME BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 + "'" + statusFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isRecordLoading = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
            this.pendingscounts = data['summary']['Pending'] ? data['summary']['Pending'] : 0;
            this.rejectscounts = data['summary']['Rejected'] ? data['summary']['Rejected'] : 0;
            this.registercounts = data['summary']['Total'] ? data['summary']['Total'] : 0;
            this.approvedcounts = data['summary']['Approved'] ? data['summary']['Approved'] : 0;
          } else {
            this.loadingRecords = false;
            this.totalRecords = 0;
            this.dataList = [];
            this.isRecordLoading = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
            this.pendingscounts = 0
            this.rejectscounts = 0
            this.registercounts = 0
            this.approvedcounts = 0
          }

        },
        (err) => {
          this.isRecordLoading = false;
          this.isSpinning = false;
          this.filterClass = 'filter-invisible';
          this.pendingscounts = 0
          this.rejectscounts = 0
          this.registercounts = 0
          this.approvedcounts = 0
        }
      );
  }
  APPROVAL_STATUS: any = 'P';
  showcolor0 = 0;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 1;
  showcolor4 = 0;

  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    if (this.APPROVAL_STATUS == 'P') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    }
    this.applyFilter();
  }
  ApplicationStatus: any = '';

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
  todaysdate: any;
  newdate = new Date();
  todaysyear: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth()
  );
  nextyear: any = new Date(
    this.newdate.getFullYear() + 1,
    this.newdate.getMonth()
  );
  empdata: any;
  dateeeeeforremnder: any;

  AcceptCaretaker(data: any) {
    // this.Acceptmodal = true;
    this.caretakeracceptancedata = Object.assign({}, data);

    this.empdata = data;
    this.POPreview = true;
    this.todaysyear = this.datepipe.transform(this.todaysyear, 'yyyy');
    this.nextyear = this.datepipe.transform(this.nextyear, 'yyyy');
    this.todaysdate = this.datepipe.transform(this.todaysdate, 'dd/MM/yyyy');
    var dateeeeeee: any = new Date();
    var datee3 = dateeeeeee.setDate(dateeeeeee.getDate() + 2);
    this.dateeeeeforremnder = datee3;

    this.todaysdateee = new Date();
    this.VACANT_ORDER_NO = '';
    this.DESIGNATIONT = '';
    this.ADDRESS = '';
    this.dateprevioue2 = null;
    this.dateprevioue1 = null;
    this.dateprevioue = new Date();

  }
  NEW_SIGNATURE_ID: any;
  generaterenovationphysicalreminder() {
    if (
      this.NEW_SIGNATURE_ID == '' ||
      this.NEW_SIGNATURE_ID == null ||
      this.NEW_SIGNATURE_ID == undefined ||
      this.NEW_SIGNATURE_ID == 0
    ) {
      this.message.error('Please select signature', '');
    } else if (
      this.todaysdateee == '' ||
      this.todaysdateee == null ||
      this.todaysdateee == undefined
    ) {
      this.message.error('Please Select Date', '');
    } else if (
      this.VACANT_ORDER_NO == '' ||
      this.VACANT_ORDER_NO == null ||
      this.VACANT_ORDER_NO == undefined
    ) {
      this.message.error('Please Enter Vacant Order Number', '');
    } else if (
      this.DESIGNATIONT == '' ||
      this.DESIGNATIONT == null ||
      this.DESIGNATIONT == undefined
    ) {
      this.message.error('Please Enter Designation', '');
    } else if (
      this.ADDRESS == '' ||
      this.ADDRESS == null ||
      this.ADDRESS == undefined
    ) {
      this.message.error('Please Enter Address', '');
    } else if (
      this.dateprevioue == '' ||
      this.dateprevioue == null ||
      this.dateprevioue == undefined
    ) {
      this.message.error('Please Select Vacated Date', '');
    } else if (
      this.dateprevioue1 == '' ||
      this.dateprevioue1 == null ||
      this.dateprevioue1 == undefined
    ) {
      this.message.error('Please Select Request Date', '');
    } else if (
      this.dateprevioue2 == '' ||
      this.dateprevioue2 == null ||
      this.dateprevioue2 == undefined
    ) {
      this.message.error('Please Select Last Electricity Bill Date', '');
    } else {
      this.Acceptmodal = true;
    }
  }
  htmlContent: any;

  acceptmodalcheck() {
    const element: any = document.getElementById('Prntmodal111');
    this.htmlContent = element.outerHTML;
    this.loadingRecords = true;
    let sendtodata = {
      ...this.caretakeracceptancedata,
      SURRENDER_INSPECTOR_STATUS: 'A',
      SURRENDER_INSPECTOR_REMARK: this.CARETAKER_REMARK,
      SURRENDER_INSPECTOR_ID: this.userid,
      htmlContent: this.htmlContent,
      SURRENDER_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
    };
    this.api.AcceptSurrender(sendtodata).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.message.success(
            'Quarter Surrender Request Accepted Successfully',
            ''
          );
          this.loadingRecords = false;
          this.POPreview = false;
          this.cancelmodal();
        } else {
          this.message.error(
            'Failed To Accept Quarter Surrender Request',
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
    this.POPreview = false;
    this.VACANT_ORDER_NO = '';
    this.DESIGNATIONT = '';
    this.ADDRESS = '';
    this.dateprevioue2 = null;
    this.dateprevioue1 = null;
    this.dateprevioue = null;
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
        SURRENDER_INSPECTOR_STATUS: 'R',
        SURRENDER_INSPECTOR_REMARK: this.CARETAKER_REMARK,
        SURRENDER_INSPECTOR_ID: this.userid,
        SURRENDER_INSPECTOR_APPROVED_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
      };
      this.api.RejectSurrender(sendtodata).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.message.success(
              'Quarter Surrender Rejected Successfully',
              ''
            );
            this.loadingRecords = false;
            this.Cancelsurrendermodal();
          } else {
            this.message.error(
              'Failed To Reject Quarter Surrender Request',
              ''
            );
            this.loadingRecords = false;
          }
        },
        (error) => {
          this.message.error(
            'Failed To Reject Quarter Surrender Request',
            ''
          );
          this.loadingRecords = false;
        }
      );
    }
  }

  viewsurrederform(url: string, numberss: any) {
    if (numberss == 'a') {
      const fileUrl = this.api.retriveimgUrl + 'licenseFeeLetter/' + url;
      window.open(fileUrl);
    } else if (numberss == 'b') {
      const fileUrl = this.api.retriveimgUrl + 'lightBillLetter/' + url;
      window.open(fileUrl);
    } else if (numberss == 'd') {
      const fileUrl = this.api.retriveimgUrl + 'surrenderInspectorLetter/' + url;
      window.open(fileUrl);
    } else {
      const fileUrl = this.api.retriveimgUrl + 'surrenderLetter/' + url;
      window.open(fileUrl);
    }

  }

  POPreview: boolean = false;
  closemodal() {
    this.POPreview = false;
    this.search();
  }
}
