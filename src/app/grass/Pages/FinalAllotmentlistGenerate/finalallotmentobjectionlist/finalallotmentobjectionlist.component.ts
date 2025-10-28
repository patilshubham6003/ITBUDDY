import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentObjection1 } from 'src/app/grass/Models/AllotmentObjection1';
// import { ObjectionMaster12 } from 'src/app/grass/Models/Objectionmaster12';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-finalallotmentobjectionlist',
  templateUrl: './finalallotmentobjectionlist.component.html',
  styleUrls: ['./finalallotmentobjectionlist.component.css'],
  providers: [DatePipe],
})
export class FinalallotmentobjectionlistComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = AllotmentObjection1;
  @Input() stringdata!: string;

  formTitle = 'Allotment Order Objections';
  dataList: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  ResidenceType: any = [];
  isSpinning = false;
  RESIDENCE_TYPE = '';
  userid: any;
  roleid: any;
  monthh = new Date();
  Statusall: any;
  filterquerystring = '';
  MONTH: any;
  YEAR: any;
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['REASON', 'REASON'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
  ];

  constructor(
    private api: APIServicesService,
    private sanitizer: DomSanitizer,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.MONTH = this.datePipe.transform(this.monthh, 'MM');
    this.YEAR = this.datePipe.transform(this.monthh, 'yyyy');
    this.roleid = Number(sessionStorage.getItem('roleId'));
    this.userid = Number(sessionStorage.getItem('userId'));
    if (this.data) {
      if (this.stringdata == 'ALL') {
        this.Statusall = this.stringdata;
        this.filterquerystring =
          " AND ACTION_STATUS != ''  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
        // this.search();
      } else if (this.stringdata == 'P') {
        this.Statusall = this.stringdata;
        this.filterquerystring =
          " AND ACTION_STATUS = 'P'  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
        // this.search();
      } else if (this.stringdata == 'A') {
        this.Statusall = this.stringdata;
        this.filterquerystring =
          " AND ACTION_STATUS = 'A'  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
        // this.search();
      } else if (this.stringdata == 'R') {
        this.Statusall = this.stringdata;
        this.filterquerystring =
          " AND ACTION_STATUS = 'R' AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
        // this.search();
      }
    }
    // this.search();
    // this.getResidenceType();
  }

  // getResidenceType() {
  //   this.api.getGradPay(0, 0, 'ID', 'asc', ' AND STATUS = 1 ').subscribe(
  //     (data) => {
  //       if (data['code'] == 200) {
  //         let listofresidence = [];
  //         listofresidence = data['data'];
  //         function removeDuplicates(arr: any) {
  //           const uniqueObjects: any = [];
  //           const uniqueResidenceTypeIds = new Set();
  //           for (const obj of arr) {
  //             if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
  //               uniqueObjects.push(obj);
  //               uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
  //             }
  //           }
  //           return uniqueObjects;
  //         }
  //         const result = removeDuplicates(listofresidence);
  //         this.ResidenceType = result;
  //       }
  //     },
  //     (err) => {
  //
  //     }
  //   );
  // }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    this.MONTH = this.datePipe.transform(this.monthh, 'MM');
    this.YEAR = this.datePipe.transform(this.monthh, 'yyyy');
    if (
      this.RESIDENCE_TYPE == null ||
      this.RESIDENCE_TYPE == undefined ||
      this.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else if (
      this.MONTH == null ||
      this.MONTH == undefined ||
      this.MONTH == ''
    ) {
      this.message.error('Please Select Month', '');
    } else {
      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }
  clearFilter() {
    this.RESIDENCE_TYPE = '';
    this.monthh = new Date();
    this.MONTH = this.datePipe.transform(this.monthh, 'MM');
    this.YEAR = this.datePipe.transform(this.monthh, 'yyyy');
    this.search(true);
    this.isFilterApplied = 'default';
  }

  keyup(event: any) {
    this.search(true);
  }

  changeRadioButton(event) {
    this.Statusall = event;
    this.stringdata = event;
    if (this.Statusall == 'ALL') {
      this.filterquerystring =
        " AND ACTION_STATUS != ''  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
      this.search();
    } else if (this.Statusall == 'P') {
      this.filterquerystring =
        " AND ACTION_STATUS = 'P'  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
      this.search();
    } else if (this.Statusall == 'A') {
      this.filterquerystring =
        " AND ACTION_STATUS = 'A'  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
      this.search();
    } else if (this.Statusall == 'R') {
      this.filterquerystring =
        " AND ACTION_STATUS = 'R'  AND DRAFT_ALLOTMENT_ID = " + this.data.ID;
      this.search();
    }
  }

  close() {
    this.drawerClose();
  }

  countData: any;
  IS_OBJECTION_OVER: any = 'N'

  search(reset: boolean = false) {
    this.isSpinning = true;
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
      likeQuery = likeQuery + ')';
    }

    this.MONTH = this.datePipe.transform(this.monthh, 'MM');
    this.YEAR = this.datePipe.transform(this.monthh, 'yyyy');

    this.api
      .getFinalAllotmentObjections(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.filterquerystring,
        this.data.ID + " AND ACTION_STATUS=='P'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.IS_OBJECTION_OVER = data['IS_OBJECTION_OVER'];
            this.dataList = data['data'];
            this.countData = Object.assign({}, data['countData']);
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          } else {
            this.IS_OBJECTION_OVER = 'N';
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          this.IS_OBJECTION_OVER = 'N';
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
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

  objectiondata: AllotmentObjection1 = new AllotmentObjection1();
  RejectRemark: boolean = false;

  edit(data: AllotmentObjection1) {
    this.RejectRemark = true;
    this.objectiondata = Object.assign({}, data);
  }

  CancleRemark() {
    this.search(true);
    this.RejectRemark = false;
  }
  loadobjjj: boolean = false;

  RejectRemarktable() {
    if (
      this.objectiondata.REMARK == null ||
      this.objectiondata.REMARK == undefined ||
      this.objectiondata.REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadobjjj = true;
      this.objectiondata.RESOLVER_ID = this.userid;
      this.objectiondata.ACTION_STATUS = 'R';
      // this.objectiondata.RESOLVED_DATE_TIME = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

      this.api
        .UpdateFinalAllotmentObjections(this.objectiondata)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.loadobjjj = false;
            this.search();
            this.message.success('Objection On Draft Allotment Order Rejected Successfully', '');
            this.RejectRemark = false;
            this.objectiondata = new AllotmentObjection1();
          } else {
            this.loadobjjj = false;
            this.message.error(' Failed To Reject Objection On Draft Allotment Order', '');
          }
        }, err => {
          this.loadobjjj = false;
          this.message.error(' Failed To Reject Objection On Draft Allotment Order', '');
        });
    }
  }

  SubmitRemark() {
    if (
      this.objectiondata.REMARK == null ||
      this.objectiondata.REMARK == undefined ||
      this.objectiondata.REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadobjjj = true;
      this.objectiondata.RESOLVER_ID = this.userid;
      this.objectiondata.ACTION_STATUS = 'A';
      // this.objectiondata.RESOLVED_DATE_TIME = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

      this.api
        .UpdateFinalAllotmentObjections(this.objectiondata)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.loadobjjj = false;
            this.search();
            this.message.success('Objection On Draft Allotment Order Approved Successfully', '');
            this.RejectRemark = false;
            this.objectiondata = new AllotmentObjection1();
          } else {
            this.loadobjjj = false;
            this.message.error(' Failed To Approve Objection On Draft Allotment Order', '');
          }
        }, err => {
          this.loadobjjj = false;
          this.message.error(' Failed To Approve Objection On Draft Allotment Order', '');
        });
    }
  }

  AttachedpdfsVisible: boolean = false;
  AttachedpdfsCancel() {
    this.AttachedpdfsVisible = false;
  }

  view1 = 0;
  ObjectionPDF = '';
  viewAssumptionAttached(pdfURL: string): void {
    this.ObjectionPDF = '';
    this.view1 = 11;
    this.AttachedpdfsVisible = true;
    this.ObjectionPDF = this.getS1(pdfURL);
  }
  ATTACHMENT2send(pdfURL: string): void {
    this.ObjectionPDF = '';
    this.view1 = 22;
    this.AttachedpdfsVisible = true;
    this.ObjectionPDF = this.getS1(pdfURL);
  }

  sanitizedLink12: any = '';
  getS1(link: string) {
    var a = '';
    if (this.view1 == 11) {
      a = this.api.retriveimgUrl + 'flatAllotmentObjection/' + link;
    }
    if (this.view1 == 22) {
      a = this.api.retriveimgUrl + 'flatAllotmentObjection/' + link;
    }
    this.sanitizedLink12 = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink12;
  }
}