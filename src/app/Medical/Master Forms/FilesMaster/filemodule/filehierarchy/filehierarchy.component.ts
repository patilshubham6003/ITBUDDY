import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { FilehierarchiesComponent } from '../filehierarchies/filehierarchies.component';
import { FileHierarchy } from 'src/app/Medical/Models/filehierarchy';

@Component({
  selector: 'app-filehierarchy',
  templateUrl: './filehierarchy.component.html',
  styleUrls: ['./filehierarchy.component.css']
})
export class FilehierarchyComponent implements OnInit {

  formTitle = "Manage File Hierarchy";
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
  columns: string[][] = [["PARENT_NAME", "ParentName"], ["NAME", "Name"], ["IS_LAST", "Is last node"]]
  isApproveVisible = false
  //drawer Variables
  drawerVisible: boolean;
  drawerTitle: string;
  REMARK: string
  drawerData: FileHierarchy = new FileHierarchy();

  @ViewChild(FilehierarchiesComponent, { static: false }) FilehierarchiesComponent: FilehierarchiesComponent;

  constructor(private api: ApiService, private message: NzNotificationService) { }
  ngOnInit() {
    this.search();
  }
  // Basic Methods
  // sort(sort: { key: string; value: string }): void {
  //   this.sortKey = sort.key;
  //   this.sortValue = sort.value;
  //   this.search(true);
  // }
  sort(sort: any): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    if (this.sortValue == "descend") {
      this.sortValue = 'desc';
    } else {
      this.sortValue = 'asc'
    }
    this.search(true);
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
    if (this.searchText != "") {
      var likeQuery: any = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
    }
    this.api.getAllFilehierarchy(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
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
  FileHierarchy: any = []
  add(): void {
    this.drawerTitle = "Create New File Hierarchy";
    this.drawerData = new FileHierarchy();
    this.api.getAllFilehierarchy(0, 0, '', '', 'AND IS_LAST=0').subscribe(data => {

      this.FileHierarchy = data['data'];
    }, err => {

      //this.loadingForm = false;
    });
    this.drawerVisible = true;

  }
  listdata2: any = []
  IS_ADVANCE: boolean
  IS_LAST: boolean
  islast: any
  edit(data: FileHierarchy): void {
    this.IS_ADVANCE = false


    this.drawerTitle = "Update File Hierarchy";
    this.drawerData = Object.assign({}, data);
    this.islast = data.IS_LAST
    if (this.islast == "0") {
      this.IS_LAST = false
    } else {
      this.IS_LAST = true
    }
    if (data.IS_ADVANCE == "Y") {
      this.IS_ADVANCE = true
    } else {
      this.IS_ADVANCE = false
    }


    this.drawerVisible = true;
    this.api.getAllFilehierarchy(0, 0, 'ID', 'desc', " AND ID !=" + data.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.listdata2 = data['data'];
      }
    });
    // this.FilehierarchiesComponent.getallorg2(data.ID);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
    this.IS_ADVANCE = false
    this.IS_LAST = false
  }




}
