import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  EmployeeQuarterFormsMaster,
  EmployeeQuarterFormsMaster1,
} from 'src/app/Modal/employeeQuarterForm';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-aplication-list-com',
  templateUrl: './aplication-list-com.component.html',
  styleUrls: ['./aplication-list-com.component.css'],
})
export class AplicationListComComponent implements OnInit {
  formTitle = 'Manage Quarter Applications';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords: boolean = true;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  logtext: string = '';
  retrieveimgUrl = appkeys.retriveimgUrl;
  columns: string[][] = [
    ['EMAIL_ID'],
    ['EMPLOYEE_NAME'],
    ['MOBILE_NO'],
    ['EMPLOYEE_CODE'],
    ['BASIC_PAY'],
    ['GRADE_PAY_LEVEL'],
    ['DESIGNATION_NAME'],
    ['FLOOR_ID'],
    ['FLAT_ID'],
    ['BUILDING_NAME'],
  ];
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: EmployeeQuarterFormsMaster = new EmployeeQuarterFormsMaster();
  checkItsView: boolean = false;
  drawerData1: any = [];
  drawerVisible1: boolean;
  drawerTitle1: string;
  visibleGenerateModal: boolean = false;
  GenerateBuilding: any = [];
  GenerateBuildingName: any;
  GeneratedLink: any;
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    public router: Router
  ) { }
  ngOnInit() {
    this.search();
  }
  keyup(event: any) {
    this.search();
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
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
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
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    this.api
      .getquarterallotmentData(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery + ' AND CARETAKER_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add(): void {
    this.drawerTitle1 = 'Add New Quarter';
    this.drawerData1 = new EmployeeQuarterFormsMaster1();
    this.drawerVisible1 = true;
  }
  edit(data: EmployeeQuarterFormsMaster): void {
    this.drawerTitle = 'Manage Employee Quarter Application';
    this.checkItsView = false;
    this.drawerData = Object.assign({}, data);
    if (
      data.APPLIED_RESIDENCE_TYPE_ID != null &&
      data.APPLIED_RESIDENCE_TYPE_ID != undefined
    ) {
      this.drawerData.APPLIED_RESIDENCE_TYPE_ID =
        data.APPLIED_RESIDENCE_TYPE_ID.split(',').map(Number);
    } else {
      this.drawerData.APPLIED_RESIDENCE_TYPE_ID = [];
    }
    this.drawerData.CHECK_CONDITION = data.CHECK_CONDITION.toString();
    this.drawerVisible = true;
  }

  viewDetails(data: EmployeeQuarterFormsMaster): void {
    this.drawerTitle = 'View Employee Quarter Application Details';
    this.checkItsView = true;
    this.drawerData = Object.assign({}, data);
    if (data.CHECK_CONDITION != null) {
      this.drawerData.CHECK_CONDITION = data.CHECK_CONDITION.toString();
    }
    if (
      data.APPLIED_RESIDENCE_TYPE_ID != null &&
      data.APPLIED_RESIDENCE_TYPE_ID != undefined
    ) {
      this.drawerData.APPLIED_RESIDENCE_TYPE_ID =
        data.APPLIED_RESIDENCE_TYPE_ID.split(',').map(Number);
    } else {
      this.drawerData.APPLIED_RESIDENCE_TYPE_ID = [];
    }
    this.drawerVisible = true;
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  drawerClose1(): void {
    this.search();
    this.drawerVisible1 = false;
  }

  generateOpenModal() {
    this.visibleGenerateModal = true;
    this.GenerateBuildingName = null;
    this.GeneratedLink = null;
    this.api
      .getmappedbuildingget(
        0,
        0,
        '',
        '',
        ' AND USER_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.GenerateBuilding = data['data'];
          }
        },
        (err) => { }
      );
  }
  closeGenerateLink() {
    this.visibleGenerateModal = false;
  }
  generateLink(d: any) {
    if (
      d == null ||
      d == undefined ||
      d <= 0 ||
      this.GenerateBuildingName == ''
    ) {
      this.message.error('Please Select Building Name', '');
    } else {
      let url = window.location.href;
      var arr = url.split('/');
      var aaa = '';
      if (arr[3] == 'employeecorner') {
        aaa = 'https://www.incometaxmumbai.gov.in/employeecorner';
      } else {
        aaa = 'https://imithra.uvtechsoft.com';
      }
      const buildingKey = this.generateRandomKey(16) + '_' + d;
      const caretakerKey =
        this.generateRandomKey(16) +
        '_' +
        Number(sessionStorage.getItem('userId'));
      this.GeneratedLink =
        aaa +
        '/employee-quarter-details-form?building_id=' +
        buildingKey +
        '&caretaker_id=' +
        caretakerKey;
    }
  }

  generateRandomKey(length: number = 16): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomString;
  }

  copyLink(url: string) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.message.success('URL copied to clipboard successfully', '');
      })
      .catch((error) => {
        this.message.error('Failed to copy url', '');
      });
  }
}