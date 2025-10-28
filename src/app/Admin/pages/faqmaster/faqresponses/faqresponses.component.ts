import { Component, OnInit, Input } from '@angular/core';
// import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Faq } from 'src/app/Modal/faq';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-faqresponses',
  templateUrl: './faqresponses.component.html',
  styleUrls: ['./faqresponses.component.css'],
})
export class FaqresponsesComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Faq;
  @Input() dataList;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  // dataList :any= [];
  @Input() loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterClass: string = 'filter-visible';
  initFilter = true;
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['USER_MOBILE', 'Mobile Number'],
    ['USER_EMAIL_ID', 'Email ID'],
    ['SUGGESTION', 'Suggestion'],
  ];

  FAQ_MASTER_ID: Number;
  RESPONSE_TYPE = 'P';
  filterQuery: string = '';

  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Faq = new Faq();
  @Input() isSpinning = false;

  constructor(
    private api: ServiceService
  ) // private message: NzNotificationService
  {}
  ngOnInit() {
    this.isSpinning = false;
    this.loadingRecords = false;
    this.search();
  }
  // Basic Methods

  getFAQID(id?) {
    if (id == undefined) this.FAQ_MASTER_ID = 0;
    else this.FAQ_MASTER_ID = id;
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'desc' : 'asc';
    } catch (error) {
      sort = '';
    }

    if (this.searchText != '') {
      this.filterQuery += ' AND (';
      var likeQuery = ' ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like ('%" + this.searchText + "%') OR";
      });
      this.filterQuery += likeQuery.substring(0, likeQuery.length - 3) + ')';
    } else {
      this.filterQuery = '';
      this.applyFilter(this.FAQ_MASTER_ID);
    }
    if (this.FAQ_MASTER_ID != undefined) {
      this.api
        .getAllFaqResponses(0, 0, this.sortKey, sort, this.filterQuery)
        .subscribe(
          (data) => {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.loadingRecords = false;
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter(id?) {
    this.FAQ_MASTER_ID = id;
    this.isSpinning = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'desc' : 'asc';
    } catch (error) {
      sort = '';
    }
    // this.filterQuery=" AND FAQ_MASTER_ID="+this.FAQ_MASTER_ID+" AND RESPONSE_TYPE='"+this.RESPONSE_TYPE+"' "
    this.filterQuery = " AND RESPONSE_TYPE='" + this.RESPONSE_TYPE + "' ";

    if (this.FAQ_MASTER_ID != undefined) {
      this.api
        .getAllFaqResponses(0, 0, this.sortKey, sort, this.filterQuery)
        .subscribe(
          (data) => {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';
            this.isSpinning = false;
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  clearFilter() {
    this.RESPONSE_TYPE = 'P';
    this.isFilterApplied = 'default';
    this.filterClass = 'filter-invisible';
    this.applyFilter(this.FAQ_MASTER_ID);
  }

  getName(RESPONSE_TYPE) {
    if (RESPONSE_TYPE == 'N') return 'Change';
    else return '';
  }

  edit(data: Faq, RESPONSE_TYPE, id) {
    console.log(id);
    if (RESPONSE_TYPE == 'N') {
      this.drawerTitle = 'Update Faq';
      try {
        data.TAGS_STRING = data.TAGS.split(',');
      } catch (error) {
        data.TAGS_STRING = [];
      }
      this.drawerData = Object.assign({}, data);
      this.drawerVisible = true;
    }
  }

  get closeCallback() {
    return this.drawerCloseFaq.bind(this);
  }

  drawerCloseFaq() {
    this.applyFilter(this.FAQ_MASTER_ID);
    this.drawerVisible = false;
  }
}
