import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { InvestigationCategory } from 'src/app/Medical/Models/InvestigationCategory';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-investigation-component',
  templateUrl: './investigation-component.component.html',
  styleUrls: ['./investigation-component.component.css']
})
export class InvestigationComponentComponent implements OnInit {
  formTitle = "Investigation Categories Master"
  drawerTitle = ""
  searchText: string = "";
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "asc";
  sortKey: string = "NAME";

  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["NAME", "Name"]];
  drawerData: InvestigationCategory = new InvestigationCategory();
  constructor(private api: ApiService, private message: NzNotificationService) { }

  // InvestigationCategori = [];
  ngOnInit(): void {
    // this.InvestigationCategori = [
    //   { ID: 1, CITY_NAME: "Mumbai", CATEGORY_NAME: "Blood Bank", STATUS: 1 },
    //   { ID: 2, CITY_NAME: "Mumbai", CATEGORY_NAME: "Bio-Chemistry", STATUS: 1 },
    //   { ID: 3, CITY_NAME: "Mumbai", CATEGORY_NAME: "CT", STATUS: 0 },
    //   { ID: 4, CITY_NAME: "Mumbai", CATEGORY_NAME: "CSF", STATUS: 1 },
    //   { ID: 5, CITY_NAME: "Mumbai", CATEGORY_NAME: "Cytogeneticd", STATUS: 0 },
    //   { ID: 6, CITY_NAME: "Mumbai", CATEGORY_NAME: "Dental", STATUS: 1 },
    //   { ID: 7, CITY_NAME: "Mumbai", CATEGORY_NAME: "Flow cytometry", STATUS: 1 },
    //   { ID: 8, CITY_NAME: "Mumbai", CATEGORY_NAME: "Gastro And Hepatobiliary", STATUS: 1 },
    //   { ID: 9, CITY_NAME: "Mumbai", CATEGORY_NAME: "Haematology", STATUS: 1 },
    //   { ID: 10, CITY_NAME: "Mumbai", CATEGORY_NAME: "Harmones", STATUS: 1 }
    // ]
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  // @Input()
  Visible: boolean = false;
  AddTitle() {
    this.drawerTitle = "Add Investigation Category";
    this.Visible = true;
    this.drawerData = new InvestigationCategory();

    // this.MedicalFacilities.Status=
  }
  closeDrawer() {
    this.Visible = false;
    this.search()
  }
  get closeDrawercallback() {
    return this.closeDrawer.bind(this)
  }
  getwidth() {
    if (window.innerWidth < 400) {
      return 380;
    } else {
      return 500;
    }
  }



  edit(data: InvestigationCategory): void {
    this.drawerTitle = "Update Investigation Category";
    this.drawerData = Object.assign({}, data);
    this.Visible = true;
  }


  keyup(event: any) {
    this.search();
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

    this.api.getinvestigationcategory(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      this.loadingRecords = false;
      this.totalRecords = data['count'];
      this.dataList = data['data'];
      // if(this.totalRecords==0){
      //   data.SEQUENCE_NUMBER=1;
      // }else{
      //   data.SEQUENCE_NUMBER= this.dataList[this.dataList.length-1]['SEQUENCE_NUMBER']+1
      // }
    }, err => {

    });

  }


  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'NAME';
    const sortOrder = (currentSort && currentSort.value) || 'asc';

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
}
