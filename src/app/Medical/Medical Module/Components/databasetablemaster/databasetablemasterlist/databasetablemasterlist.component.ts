import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DataBaseTableMaster } from '../../databasetablemaster';

@Component({
  selector: 'app-databasetablemasterlist',
  templateUrl: './databasetablemasterlist.component.html',
  styleUrls: ['./databasetablemasterlist.component.css']
})
export class DatabasetablemasterlistComponent implements OnInit {

  formTitle = "Import Investigation Procedure Table";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["TABLE_NAME", "Name"], ["SEQUENCE_NO", "Sequence No."], ["EXCEL_URL", "Excel URL"], ["COLUMN_JSON", "Column JSON"]]
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: DataBaseTableMaster = new DataBaseTableMaster();

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.search(true);
  }

  keyup(event: any) {
    this.search();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(false);
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = "id";
      this.sortValue = "desc"
    }

    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2)
    }

    this.api.getdatabasetable(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.dataList = data['data'];

    }, err => {

    });
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerData = new DataBaseTableMaster();
    this.drawerData.EXCEL_URL = ""

    this.api.getdatabasetable(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(data => {
      if (data['count'] == 0) {
        this.drawerData.SEQUENCE_NO = 1;

      } else {
        this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
      }

    }, err => {

    });

    this.drawerTitle = "Create New Investigation Procedure Import Table";
    this.drawerData.STATUS = true;
    this.drawerVisible = true;
  }

  edit(data: DataBaseTableMaster): void {
    this.drawerTitle = "Update Investigation Procedure Import Table";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerData = new DataBaseTableMaster();
    this.drawerVisible = false;
  }
}

