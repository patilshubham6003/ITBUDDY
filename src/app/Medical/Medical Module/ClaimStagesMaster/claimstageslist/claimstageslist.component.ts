import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { stagemasterfile } from 'src/app/Medical/Models/stagemaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-claimstageslist',
  templateUrl: './claimstageslist.component.html',
  styleUrls: ['./claimstageslist.component.css']
})

export class ClaimstageslistComponent implements OnInit {
  drawerData: stagemasterfile = new stagemasterfile();
  dataList: any = [];
  drawerVisible: boolean = false;
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "asc";
  sortKey: string = "NAME";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["NAME", "Name"]];
  constructor(private message: NzNotificationService, private api: ApiService) { }

  MedicalFacilities: any = [];

  ngOnInit(): void {
    // this.MedicalFacilities = [
    //   {
    //     "ID": 1,
    //     "NAME": "EYE HOSPITAL",
    //     "STATUS": false
    //   },
    //   {
    //     "ID": 2,
    //     "NAME": "LAB AND DIAGNOSTIC",
    //     "STATUS": false
    //   },
    //   {
    //     "ID": 3,
    //     "NAME": "Dental Clinic",
    //     "STATUS": true
    //   },
    //   {
    //     "ID": 4,
    //     "NAME": "CANCER",
    //     "STATUS": true
    //   },
    //   {
    //     "ID": 5,
    //     "NAME": "GENERAL PURPOSE",
    //     "STATUS": false
    //   },
    //   {
    //     "ID": 6,
    //     "NAME": " Cardiology",
    //     "STATUS": false
    //   },
    //   {
    //     "ID": 7,
    //     "NAME": "Labs",
    //     "STATUS": true
    //   },
    //   {
    //     "ID": 8,
    //     "NAME": "General",
    //     "STATUS": true
    //   },
    //   {
    //     "ID": 9,
    //     "NAME": "General Sector",
    //     "STATUS": true
    //   }
    // ]
  }

  Visible: boolean = false;
  AddTitle() {
    this.drawerTitle = "Create Medical Facility";
    this.Visible = true;
    this.drawerData = new stagemasterfile();
    // this.MedicalFacilities.STATUS=
  }
  add(): void {
    this.drawerTitle = "Create Stage Master";
    this.drawerData = new stagemasterfile();

    this.api.getstage(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(data => {
      if (data['count'] == 0) {
        this.drawerData.SEQUENCE_NUMBER = 1;
      } else {
        this.drawerData.SEQUENCE_NUMBER = data['data'][0]['SEQUENCE_NUMBER'] + 1;
      }
    }, err => {

    })
    this.drawerVisible = true;
  }

  closeDrawer() {
    this.Visible = false;
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

  formTitle = "Claim Stage Master"
  drawerTitle = ""


  edit(data: stagemasterfile): void {
    this.drawerTitle = "Update Stage Master";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
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

    this.api.getstage(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
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
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }

}
