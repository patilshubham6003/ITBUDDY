import { Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FaqHeadComponent } from '../faq-head/faq-head.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ServiceService } from 'src/app/Service/service.service';
import { FaqHead } from 'src/app/Modal/Faqhead';

@Component({
  selector: 'app-faq-heads',
  templateUrl: './faq-heads.component.html',
  styleUrls: ['./faq-heads.component.css'],
})
export class FaqHeadsComponent implements OnInit {
  formTitle = 'Manage FAQ Heads';
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
  columns: string[][] = [
    ['PARENT_NAME', 'Parent Name'],
    ['NAME', 'FAQ Head Name'],
  ];
  applicationId = Number(this.cookie.get('applicationId'));
  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: FaqHead = new FaqHead();
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
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (likeQuery)
      this.filterQuery =
        ' AND APPLICATION_ID=' + this.applicationId + likeQuery;
    else this.filterQuery = ' AND APPLICATION_ID=' + this.applicationId;

    this.api
      .getAllFaqHeads(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];

          if (this.totalRecords == 0) {
            data['SEQUENCE_NO'] = 1;
          } else {
            data['SEQUENCE_NO'] =
              this.dataList[this.dataList.length - 1]['SEQUENCE_NO'] + 1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  @ViewChild(FaqHeadComponent, { static: false })
  FaqHeadComponentVar: FaqHeadComponent;

  add(): void {
    this.drawerVisible = true;

    this.drawerTitle = 'Create New FAQ Head';
    this.drawerData = new FaqHead();

    this.api.getAllFaqHeads(1, 1, 'SEQUENCE_NO', 'desc', ' ').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.drawerData.PARENT_ID = null;
    this.drawerData.NAME = '';
    this.drawerData.DESCRIPTION = '';
    this.drawerData.PARENT_NAME = null;

    this.FaqHeadComponentVar.loadFaqHeads1();
  }

  edit(data: FaqHead): void {
    this.drawerTitle = 'Update FAQ Head';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    this.FaqHeadComponentVar.loadFaqHeads1();
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
}
