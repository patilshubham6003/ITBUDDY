import { Component, OnInit, ViewChild } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
// import { FaqComponent } from '../faq/faq.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FaqresponsesComponent } from '../faqresponses/faqresponses.component';
import { ServiceService } from 'src/app/Service/service.service';
import { Faq } from 'src/app/Modal/faq';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
})
export class FaqsComponent implements OnInit {
  formTitle = 'Manage FAQs';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns1: string[][] = [
    ['FAQ_HEAD_NAME', 'FAQ Head Name'],
    ['QUESTION', 'Question'],
    ['ANSWER', 'Answer'],
    ['TAGS', 'Tags'],
    ['POSITIVE_COUNT', 'Positive Count'],
    ['NEGATIVE_COUNT', 'Negative Count'],
    ['SEQ_NO', 'Sequence No'],
  ];
  columns: string[][] = [
    ['POSITIVE_COUNT', 'Positive Count'],
    ['NEGATIVE_COUNT', 'Negative Count'],
    ['SEQ_NO', 'Sequence No'],
  ];
  applicationId = Number(this.cookie.get('applicationId'));
  @ViewChild(FaqresponsesComponent, { static: false })
  faqResponse1: FaqresponsesComponent;
  // @ViewChild(FaqComponent,{static:false}) myInputVariable: ElementRef;
  // @ViewChild('inputFile') myInputVariable: ElementRef;

  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Faq = new Faq();

  drawerVisible1: boolean;
  drawerTitle1: string;
  drawerData1: Faq = new Faq();
  constructor(private api: ServiceService, private cookie: CookieService) {}
  ngOnInit() {
    this.search();
  }
  // Basic Methods
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
  search(reset: boolean = false) {
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

    var likeQuery = ' ';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns1.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (likeQuery)
      this.filterQuery =
        ' AND APPLICATION_ID=' + this.applicationId + likeQuery;
    else this.filterQuery = ' AND APPLICATION_ID=' + this.applicationId;

    this.api
      .getAllFaqs(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ''
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          if (this.totalRecords == 0) {
            data['SEQ_NO'] = 1;
          } else {
            data['SEQ_NO'] =
              this.dataList[this.dataList.length - 1]['SEQ_NO'] + 1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add(): void {
    this.drawerTitle = 'Create New FAQ';
    this.drawerData = new Faq();
    this.drawerData.STATUS = true;
    this.drawerData.FAQ_HEAD_ID = 0;
    this.drawerData.QUESTION = '';
    this.drawerData.ANSWER = '';
    this.drawerData.TAGS = '';
    this.drawerData.URL = '';
    this.drawerData.TAGS_STRING = [];
    // this.form.nativeElement.reset()
    // this.myInputVariable.nativeElement.value = '';

    // this.drawerVisible = true;
    this.api.getAllFaqs(1, 1, 'SEQ_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.drawerVisible = true;
  }
  edit(data: Faq): void {
    this.drawerTitle = 'Update FAQ';
    try {
      data.TAGS_STRING = data.TAGS.split(',');
    } catch (error) {
      data.TAGS_STRING = [];
    }
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
  isSpinning: boolean = false;
  RESPONSE_TYPE = 'P';
  responseData;
  ViewResponses(data: Faq) {
    this.drawerTitle1 = 'FAQ Responses';
    this.drawerData1 = Object.assign({}, data);

    this.filterQuery = " AND RESPONSE_TYPE='" + this.RESPONSE_TYPE + "' ";
    this.api
      .getAllFaqResponses(0, 0, this.sortKey, '', this.filterQuery)
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.responseData = this.dataList = data['data'];
        },
        (err) => {
          console.log(err);
        }
      );
    this.drawerVisible1 = true;
    this.isSpinning = false;
    this.loadingRecords = false;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.search();
    this.drawerVisible1 = false;
  }
  faqresponse() {}
}
