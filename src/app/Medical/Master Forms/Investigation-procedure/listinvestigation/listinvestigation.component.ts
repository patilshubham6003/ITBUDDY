import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Investigation } from 'src/app/Medical/Models/Investigation';
import { ServiceModuleExcel } from 'src/app/Medical/Models/servicemoduleexcel';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-listinvestigation',
  templateUrl: './listinvestigation.component.html',
  styleUrls: ['./listinvestigation.component.css']
})

export class ListinvestigationComponent implements OnInit {
  dataList: any;
  drawerVisible2: boolean = false;
  drawerData2: ServiceModuleExcel = new ServiceModuleExcel();
  constructor(private _apiService: ApiService, private notificationService: NzNotificationService) { }

  formTitle = "Investigation/ Procedure Master";
  // INVESTIGATION_MASTER: any = [];

  ngOnInit(): void {
    // this.INVESTIGATION_MASTER = [
    //   { ID: 1, CATEGORY_NAME: "Blood Bank", NAME: "Blood Group & RHO Type (2002-SP)", NABH_RATE: "100", NON_NABH_RATE: "100", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "CGHS Rates for 21 Treatement Procedures or Investigations in Continuation of 2014 CGHS Rates" },
    //   { ID: 2, CATEGORY_NAME: "Blood Bank", NAME: " Blood Bank bag and solution (2002-SP)", NABH_RATE: "175", NON_NABH_RATE: "175", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Notification Of CGHS Rates For 25 Investigations Under CGHS " },
    //   { ID: 3, CATEGORY_NAME: "Bio-Chemistry", NAME: "Blood gas analysis (2002-SP)", NABH_RATE: "352", NON_NABH_RATE: "352", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Notification Of CGHS Rates For 15 Investigations Under CGHS" },
    //   { ID: 4, CATEGORY_NAME: "Blood Bank", NAME: "Cross match (2002-SP)", NABH_RATE: "50", NON_NABH_RATE: "50", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Bhubaneshwar-Empanelled Hospitals, Diagnostic Centres and Rates" },
    //   { ID: 5, CATEGORY_NAME: "Dental", NAME: " Complicated Ext. per Tooth including LA (2002-SP)", NABH_RATE: "252", NON_NABH_RATE: "252", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "List Of Empanelled HCO's-Mumbai as on " },
    //   { ID: 6, CATEGORY_NAME: "Dental", NAME: "Extraction of tooth including LA (2002-SP)", NABH_RATE: "125", NON_NABH_RATE: "125", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Empanelment Of Kaizen Super Speciality under CGHS Mumbai" },
    //   { ID: 7, CATEGORY_NAME: "X-Ray", NAME: "X Ray Arthrography 2002", NABH_RATE: "1225", NON_NABH_RATE: "1225", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Empanelment of Millennium Special Lab Pvt.Ltd .Under CGHS Mumbai" },
    //   { ID: 8, CATEGORY_NAME: "Gastro And Hepatobiliary", NAME: "Gastroscopy (2002-SP)", NABH_RATE: "2020", NON_NABH_RATE: "2020", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Empanelment Of Private HCO Oncocare Center Under CGHS Mumbai" },
    //   { ID: 9, CATEGORY_NAME: "Haematology", NAME: "Absolute Eosinophil count (2002-SP)", NABH_RATE: "50", NON_NABH_RATE: "50", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Empanelment Of Private HCO H.L Raheja Hospital (Diabetic Association Of India)Under CGHS Mumbai" },
    //   { ID: 10, CATEGORY_NAME: "Harmones", NAME: "Gastroscopy (2002-SP)", NABH_RATE: "2020", NON_NABH_RATE: "2020", SUPEER_SPECIALITY_RATE: "0", MEMO_NOTIFICATION_ID: "Empanelment Of Big Smile Dental Clinic Under CGHS Mumbai" }
    // ];
  }

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  index = 0;

  sortValue: string = "asc";
  sortKey: string = "";
  logtext: string = "";
  searchText: string = "";
  columns: string[][] = [["INVESTIGATION_CATEGORY_NAME", "Category Name"], ["SHORT_CODE", "Short Code"], ["SCHEDULE_NO", "Schedule No"], ["NAME", "Investigation/ Procedure Name"], ["NABH_AMOUNT", "Rate for NABH"], ["NON_NABH_AMOUNT", "Rate for Non NABH"], ["SUPER_SPECIALITY_AMOUNT", "Rate for Super Seciality"], ["NOTIFICATION_MEMORAMDUM_NAME", "Memo Notification"], ["PRICELIST_NAME", "Pricelist Name"]];
  filterQuery: string = "";
  isloadSpinning = false;
  loadingRecords = false;
  clientData: any = [];

  // getAllClients(reset: boolean = false) {
  //   if (reset) {
  //     this.pageIndex = 1;
  //   }

  //   this.loadingRecords = true;
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith("a") ? "asc" : "desc";
  //     this.logtext = 'Filter Applied - Client Master form"+ sort +" "+this.sortKey +" KEYWORD [F - Client Master] ';
  //     this._apiService.addLog('A', this.logtext, this._apiService.emailId).subscribe(successCode => {
  //       if (successCode['code'] == "200") {
  //         
  //       }
  //       else {
  //         
  //       }
  //     });
  //   } catch (error) {
  //     sort = "";
  //   }

  //   
  //   if (this.searchText != "") {
  //     var likeQuery = " AND";
  //     this.columns.forEach(column => {
  //       likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
  //     });
  //     likeQuery = likeQuery.substring(0, likeQuery.length - 2)
  //     
  //   }

  //   this.logtext = 'Filter Applied - Client Master form "+ likeQuery +" KEYWORD [F - Client Master] ';
  //   this._apiService.addLog('A', this.logtext, this._apiService.emailId).subscribe(successCode => {
  //     if (successCode['code'] == "200") {
  //       
  //     }
  //     else {
  //       
  //     }
  //   });

  //   this._apiService.getAllClients(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
  //     
  //     this.loadingRecords = false;
  //     this.totalRecords = data['count'];
  //     this.clientData = data['data'];

  //   }, err => {
  //     
  //     if (err['ok'] == false)
  //       this.notificationService.error("Server Not Found", "");
  //   });
  // }

  drawerVisible = false;
  drawerTitle = "";
  clientDrawerData: Investigation = new Investigation();
  drawerTitle2 = "";
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  add() {
    this.drawerTitle = "Create New Investigation/ Procedure Details";
    this.clientDrawerData = new Investigation();
    this.drawerVisible = true;
    // this.clientDrawerData.IS_ACTIVE = true;

    this.logtext = 'ADD - Client Master form KEYWORD [A - Client Master] ';
    // this._apiService.addLog('A', this.logtext, this._apiService.emailId).subscribe(successCode => {
    //   if (successCode['code'] == "200") {

    //   }
    //   else {

    //   }
    // });
  }
  add2(): void {
    this.index = 0;
    this.drawerTitle2 = " Import Investigation Procedure Excel ";
    this.drawerData2 = new ServiceModuleExcel();
    this.drawerVisible2 = true;
  }
  edit(data: Investigation) {
    this.drawerTitle = "Update Investigation Procedure ";
    this.clientDrawerData = Object.assign({}, data);
    this.drawerVisible = true;



    this.logtext = 'EDIT - Client Master form KEYWORD [E - Client Master] ';
    // this._apiService.addLog('A', this.logtext, this._apiService.emailId).subscribe(successCode => {
    //   if (successCode['code'] == "200") {

    //   }
    //   else {

    //   }
    // });
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

    this._apiService
      .getinvestigationprocedure(
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
        (err) => {

        }
      );
  }
  drawerClose() {
    this.search();
    this.drawerVisible = false;
  }
  reset: boolean = false;
  drawerClose2() {

    this.search();
    this.drawerVisible2 = false;
    this.reset = true
  }
  get callBackDrawerClose() {
    return this.drawerClose.bind(this);
  }

  get closeCallback() {
    return this.drawerClose2.bind(this);
  }

  keyup(event: any) {
    this.search();
  }
  pageSize2 = 10;


  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find(item => item.value !== null);
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


}
