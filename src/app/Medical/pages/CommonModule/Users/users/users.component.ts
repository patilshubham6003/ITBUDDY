import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { User } from 'src/app/Medical/Models/Commonmodule/user';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  formTitle = "Manage Users";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "ID";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["TASK_CATEGORY_NAME", "Category"], ["NAME", "Name"], ["EMAIL_ID", "Email"], ["MOBILE_NUMBER", "Mobile"]]

  drawerData2: string[];
  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: User = new User();
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem("userName")
  roleId = sessionStorage.getItem("roleId")
  pageSize2 = 10;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() {
    // if (this.userId == null || this.userName == null || this.roleId == null) {
    //   this.api.logoutForSessionValues()
    // }
    // else {
    //   this.search();
    // }
    this.search();
  }

  // Basic Methods
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';



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
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }


    var likeQuery = "";

    if (this.searchText != '') {
      likeQuery = ' AND ';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    // if (this.searchText != "") {
    //   // if(this.roleId!="1")
    //   // likeQuery=" AND ID IN (select USER_ID from view_user_role_mapping where PARENT_ID="+this.roleId +") AND("
    //   // else
    //   // likeQuery = " AND ID IN (select USER_ID from view_user_role_mapping) AND("

    //   this.columns.forEach(column => {
    //     likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
    //   });
    //   likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    // }
    // else
    // {
    //   // if(this.roleId!="1")
    //   // likeQuery=" AND ID IN (select USER_ID from view_user_role_mapping where PARENT_ID="+this.roleId +") "
    //   // else
    //   // likeQuery=" AND ID IN (select USER_ID from view_user_role_mapping)"
    // }

    this.api.getAllUsers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {

      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.dataList = data['data'];
    }, err => {

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // this.api.getAllUserMappingData(this.pageIndex, this.pageSize, this.sortKey, sort, "").subscribe(data => {
    //   
    //   this.loadingRecords = false;
    //   this.totalRecords = data['count'];
    //   this.dataList = data['data'];
    // }, err => {
    //   
    //   if (err['ok'] == false)
    //     this.message.error("Server Not Found", "");
    //  });
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New User";
    this.drawerData = new User();
    this.drawerData.IS_ACTIVE = true
    this.drawerVisible = true;
  }

  edit(data: User): void {
    this.drawerVisible = true;
    this.drawerTitle = "Update User";
    // this.drawerData = Object.assign({}, data);

    this.drawerData.CLIENT_ID = data.CLIENT_ID;
    this.drawerData.ID = data.ID;
    this.drawerData.NAME = data.NAME;
    this.drawerData.MOBILE_NUMBER = data.MOBILE_NUMBER;
    this.drawerData.EMAIL_ID = data.EMAIL_ID;
    this.drawerData.PASSWORD = data.PASSWORD;
    this.drawerData.IS_ACTIVE = data.IS_ACTIVE;
    this.drawerData.ROLE_DATA = data.ROLE_DATA;
    this.drawerData.TASK_CATEGORY_ID = data.TASK_CATEGORY_ID;



    this.drawerData.ROLE_DATA = data["ROLE_IDS"].split(',');
    for (var i = 0; i < this.drawerData.ROLE_DATA.length; i++) {
      this.drawerData.ROLE_DATA[i] = Number(this.drawerData.ROLE_DATA[i]);
    }
  }
}
