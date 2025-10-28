import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ContactDirectory } from 'src/app/Modal/contact_directory';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-contact-directory',
  templateUrl: './contact-directory.component.html',
  styleUrls: ['./contact-directory.component.css'],
})
export class ContactDirectoryComponent {
  formTitle = 'Manage Contact Directory Information';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  logtext: string = '';
  retrieveimgUrl = appkeys.retriveimgUrl;
  columns: string[][] = [
    ['SEQUENCE_NO', 'Sequence No'],
    ['NAME', 'Name'],
    ['DESIGNATION', 'Designation'],
    ['EMAIL_ID', 'EmailId'],
    ['MOBILE_NO', 'MobileNo'],
    ['OFFICE_NAME', 'OfficeName'],
    ['SERVICE_TITLE', 'ServiceName'],
    ['STATUS', 'status'],
  ];

  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: ContactDirectory = new ContactDirectory();

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}

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
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    this.api
      .getContactDirectory(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
            if (this.totalRecords == 0) {
              data['SEQUENCE_NO'] = 1;
            } else {
              data['SEQUENCE_NO'] =
                this.dataList[this.dataList.length - 1]['SEQUENCE_NO'] + 1;
            }
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          console.log(err);
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

  onKeypressEvent(event: any) {
    console.log(event);
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Contact Directory';
    this.drawerData = new ContactDirectory();
    this.api.getContactDirectory(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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
    this.drawerData.STATUS = true;
    this.drawerVisible = true;
  }

  edit(data: ContactDirectory): void {
    this.drawerTitle = 'Update Contact Directory Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }
}
