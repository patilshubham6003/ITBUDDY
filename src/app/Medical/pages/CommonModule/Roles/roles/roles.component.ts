import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { RoledetailsComponent } from '../roledetails/roledetails.component';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Role } from 'src/app/commonModule/role';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})

export class RolesComponent implements OnInit {
  formTitle = "Manage Roles";
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
  columns: string[][] = [['PARENT_ROLE_NAME', 'Parent Role Name'], ["NAME", "Name"], ["TYPE", "Type"], ["START_PAGE", "Start Page"], ["LEVEL", "Level"]]
  drawerData2: any[];
  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Role = new Role();
  drawerVisible1: boolean;
  drawerTitle1: string;
  drawerData1: Role = new Role();
  userId = sessionStorage.getItem("userId")
  userName = sessionStorage.getItem("userName")
  roleId = sessionStorage.getItem("roleId")
  pageSize2 = 10

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() {
    // if (this.userId == null || this.userName == null || this.roleId == null) {
    //   this.api.logoutForSessionValues()
    // }
    // else {
    // this.search();
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

    if (this.searchText != "") {
      likeQuery = " ";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")"

    }

    this.api.getAllRoles(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.dataList = data['data'];
    }, err => {

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  //Drawer Methods
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New Role";
    this.drawerData = new Role();
    this.drawerData.IS_ACTIVE = true
    this.drawerData.DESCRIPTION = " "
    this.drawerVisible = true;
  }

  edit(data: Role): void {
    this.drawerTitle = "Update Role";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  @ViewChild(RoledetailsComponent) RoledetailsComponentVar: RoledetailsComponent;

  MapForms(data: Role): void {
    this.RoledetailsComponentVar.loadingRecords = true;

    this.api.getRoleDetails(data.ID).subscribe(data => {
      this.RoledetailsComponentVar.loadingRecords = false;

      this.drawerData2 = data['data'];

    }, err => {

    });

    this.drawerTitle1 = "Role Details for " + data.NAME + "";
    this.drawerData1 = Object.assign({}, data);
    this.drawerVisible1 = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
}