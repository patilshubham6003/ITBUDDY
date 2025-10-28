import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { genertaesecondSenioritylist } from 'src/app/grass/Models/Generatesecondssenioritylist';
import { ObjectionMaster } from 'src/app/grass/Models/ObjectionMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-objection-list-type-wise',
  templateUrl: './objection-list-type-wise.component.html',
  styleUrls: ['./objection-list-type-wise.component.css'],
  providers: [DatePipe],
})
export class ObjectionListTypeWiseComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = genertaesecondSenioritylist;

  drawerData: ObjectionMaster = new ObjectionMaster();
  formTitle = 'Seniority Order Objections';
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
  Status = 'ALL';
  userid: any;
  roleid: any;
  monthh = new Date();
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
    this.search();
    this.getResidenceType();
  }

  getResidenceType() {
    this.api.getGradPay(0, 0, 'ID', 'asc', ' AND STATUS = 1 ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          let listofresidence = [];
          listofresidence = data['data'];
          function removeDuplicates(arr: any) {
            const uniqueObjects: any = [];
            const uniqueResidenceTypeIds = new Set();
            for (const obj of arr) {
              if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
                uniqueObjects.push(obj);
                uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
              }
            }
            return uniqueObjects;
          }
          const result = removeDuplicates(listofresidence);

          this.ResidenceType = result;
        }
      },
      (err) => { }
    );
  }

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
    this.Status = event;
    this.search(true);
  }

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
      .getObjectionMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND RESIDENCE_TYPE = ' +
        this.data.RESIDENCE_TYPE +
        ' AND MONTH(REQUEST_DATETIME) = ' +
        this.MONTH +
        ' ' +
        ' AND YEAR(REQUEST_DATETIME) = ' +
        this.YEAR +
        ' ' +
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
            this.isSpinning = false;
          }
        },
        (err) => { }
      );
  }

  closedrawer() {
    this.drawerClose();
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

  objectiondata: ObjectionMaster = new ObjectionMaster();
  RejectRemark: boolean = false;

  edit(data: ObjectionMaster) {
    this.RejectRemark = true;
    this.objectiondata = Object.assign({}, data);
  }

  CancleRemark() {
    this.RejectRemark = false;
    this.objectiondata = new ObjectionMaster();
  }

  SubmitRemark() {
    if (this.roleid == 15) {
      this.objectiondata.RESOLVED_BY_ID = this.userid;
      this.objectiondata.STATUS = 'A';
    }

    if (
      this.objectiondata.REMARK == null ||
      this.objectiondata.REMARK == undefined ||
      this.objectiondata.REMARK == ''
    ) {
      this.message.error(' Please Enter Remark', '');
    } else {
      this.api
        .updateObjectionmaster(this.objectiondata)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Saved Successfully...', '');
            this.RejectRemark = false;
            this.objectiondata = new ObjectionMaster();
            this.search(true);
          } else {
            this.message.error(' Failed To Save Information...', '');
          }
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
      a = this.api.retriveimgUrl + 'seniorityObjections/' + link;
    }
    if (this.view1 == 22) {
      a = this.api.retriveimgUrl + 'seniorityObjections/' + link;
    }

    this.sanitizedLink12 = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink12;
  }
}
