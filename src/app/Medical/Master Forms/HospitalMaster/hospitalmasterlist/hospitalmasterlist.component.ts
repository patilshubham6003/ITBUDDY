import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HospitalMaster } from 'src/app/Medical/Models/HospitalMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-hospitalmasterlist',
  templateUrl: './hospitalmasterlist.component.html',
  styleUrls: ['./hospitalmasterlist.component.css'],
})
export class HospitalmasterlistComponent implements OnInit {
  formTitle = 'Hospital Master';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  list: any = [];
  list1: any = [];
  list2: any = [];
  list3: any = [];
  list4: any = [];
  list5: any = [];
  loadingRecords = true;
  sortValue: string = 'asc';
  sortKey: string = 'NAME';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['CITY_NAME', 'City Name'],
    ['NAME', 'Hospital Name'],
    ['ADDRESS', 'Address'],
    ['CONTACT_NOS', "Contacts No's"],
    ['EMAILS', 'Email ID'],
    ['NODAL_OFFICER_NAMES', 'Nodal Officer Name'],
    ['MOBILE_NOS', "Mobile No's"],
    ['ACCREDITATION', 'Accreditation'],
    ['NOTIFICATION_MEMORANDUM_NAME', 'Memorandum Id'],
    ['FACILITIES_NAME', 'Facilities'],
  ];
  drawerData2: string[];
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: HospitalMaster = new HospitalMaster();
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');
  pageSize2 = 10;
  facility: any = [];
  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  IHospitalMaster: any = [];

  ngOnInit() {}

  keyup(event: any) {
    // this.search();
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'NAME';
    const sortOrder = (currentSort && currentSort.value) || 'asc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
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
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    // this.loadingRecords = true;
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
      .getAllHospital(
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
          // if(this.totalRecords==0){
          //   data.SEQUENCE_NUMBER=1;
          // }else{
          //   data.SEQUENCE_NUMBER= this.dataList[this.dataList.length-1]['SEQUENCE_NUMBER']+1
          // }
        },
        (err) => {}
      );
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = 'Create New Hospital';
    this.drawerData = new HospitalMaster();

    // this.list=[]
    // this.list1=[]
    // this.list2=[]
    // this.list3=[]
    // this.list4=[]

    this.drawerData.FACILITIES_ID = '';
    this.drawerData.MOBILE_NOS = '';
    this.drawerData.NODAL_OFFICER_NAMES = '';
    this.drawerData.MOBILE_NOS = '';
    this.drawerData.CONTACT_NOS = '';

    this.drawerVisible = true;
  }

  EMAILS: any;
  CONTACT_NOS: any;
  NODAL_OFFICER_NAMES: any;
  FACILITIES_ID: any;
  MOBILE_NOS: any;
  edit(data: HospitalMaster): void {
    this.drawerTitle = 'Update Hospital Details';
    this.drawerData = Object.assign({}, data);

    // if (this.drawerData.CONTACT_NOS == '') {
    //   this.drawerData.CONTACT_NOS = [];
    // } else {
    //   this.drawerData.CONTACT_NOS = this.drawerData.CONTACT_NOS.split(',');
    // }

    if (this.drawerData.EMAILS == '') {
      this.drawerData.EMAILS = [];
    } else {
      this.drawerData.EMAILS = this.drawerData.EMAILS.split(',');
    }

    if (this.drawerData.NODAL_OFFICER_NAMES == '') {
      this.drawerData.NODAL_OFFICER_NAMES = [];
    } else {
      this.drawerData.NODAL_OFFICER_NAMES =
        this.drawerData.NODAL_OFFICER_NAMES.split(',');
    }

    if (this.drawerData.MOBILE_NOS == '') {
      this.drawerData.MOBILE_NOS = [];
    } else {
      this.drawerData.MOBILE_NOS = this.drawerData.MOBILE_NOS.split(',');
    }

    // if (this.drawerData.FACILITIES_ID == '') {

    //   this.drawerData.FACILITIES_ID = [];

    //   } else {

    //   this.drawerData.FACILITIES_ID = this.drawerData.FACILITIES_ID.toString().split(',');

    //   this.drawerData.FACILITIES_ID= this.drawerData.FACILITIES_ID.forEach(item=>{return parseInt(item)});
    //   }

    if (this.drawerData.FACILITIES_ID == '') {
      this.drawerData.FACILITIES_ID = [];
    } else {
      this.drawerData.FACILITIES_ID = this.drawerData.FACILITIES_ID.toString()
        .split(',')
        .map((item) => Number(item));
    }

    // if (this.drawerData.ACCREDITATION == '') {
    //   this.drawerData.ACCREDITATION = [];
    // } else {
    //   this.drawerData.ACCREDITATION = this.drawerData.ACCREDITATION.split(',');
    // }

    this.drawerData.CONTACT_NOS = this.drawerData.CONTACT_NOS.split(',');

    this.drawerVisible = true;
  }
}
