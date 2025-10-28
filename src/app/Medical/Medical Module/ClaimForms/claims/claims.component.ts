import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerData: any = [];
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem("userName")
  roleId = sessionStorage.getItem("roleId")
  pageSize2 = 10;
  formTitle = "Manage Claims";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = "desc";
  sortKey: string = "ID";
  searchText: string = "";
  filterQuery: string = "";
  size = 'small'
  isFilterApplied: string = "default";
  isVisible = false;
  constructor() { }
  EMPLOYEE_MASTER = [
    {
      "ID": 1,
      "NAME_OF_APPLICATION": "Mr Arun.A Poojari",
      "DESIGNATION_OFFICE": "Tax Assistant., O/o,Addl.CIT Rg-12(1), Mumbai",
      "DDO_OFFICIAL": "DDO Walfare & SG, Mumbai",
      "EMP_CODE_NO": "148534",
      "PATIENTS_RELATION": "Wife-Mrs. Triveni.A Poojari-4424362",
      "CGHS_OR_CS": "CGHS",
      "IS_EMERGENCY_TREATMENT": "YES",
      "DATE_OF_CGHS": "NA",
      "DATE_OF_BILL": "14-12-2022",
      "IS_BILLFIELD": "YES",
      "NAME_OF_HOSPITAL": "Galaxy Multispeciality Hospital, Mumbai",
      "TREATMENT_NATURE": "Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ",
      "TREATMENT_PERIOD": '20-11-2022 to 23-11-2022',
      "REIMBURSMENT_CLAIMED": "Rs.35,683",
      "REIMBURSMENT_ADMISSIBLE": "Rs.35,683",
      "ADVANCE_TACKEN": "NIL",
      "NET_AMOUNT_PAYABLE": "Rs.35,683/- ",
    },
    {
      "ID": 2,
      "NAME_OF_APPLICATION": "Mr Vishal Mane",
      "DESIGNATION_OFFICE": "Tax Assistant., O/o,Addl.CIT Rg-12(1), Mumbai",
      "DDO_OFFICIAL": "DDO Walfare & SG, Mumbai",
      "EMP_CODE_NO": "148534",
      "PATIENTS_RELATION": "Mother-Mrs. Rama B Mane-3424222",
      "CGHS_OR_CS": "CGHS",
      "IS_EMERGENCY_TREATMENT": "YES",
      "DATE_OF_CGHS": "NA",
      "DATE_OF_BILL": "09-05-2022",
      "IS_BILLFIELD": "YES",
      "NAME_OF_HOSPITAL": "Galaxy Multispeciality Hospital, Mumbai",
      "TREATMENT_NATURE": "Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ",
      "TREATMENT_PERIOD": '20-04-2022 to 23-04-2022',
      "REIMBURSMENT_CLAIMED": "Rs.20,183",
      "REIMBURSMENT_ADMISSIBLE": "Rs.20,183",
      "ADVANCE_TACKEN": "NIL",
      "NET_AMOUNT_PAYABLE": "Rs.20,183/- ",
    },
    {
      "ID": 3,
      "NAME_OF_APPLICATION": "Mr Rahul Kate",
      "DESIGNATION_OFFICE": "Senior office., O/o,Addl.CIT Rg-12(1), Mumbai",
      "DDO_OFFICIAL": "DDO Walfare & SG, Mumbai",
      "EMP_CODE_NO": "233233",
      "PATIENTS_RELATION": "Self-Mr. Rahul Kate-323535",
      "CGHS_OR_CS": "CGHS",
      "IS_EMERGENCY_TREATMENT": "YES",
      "DATE_OF_CGHS": "NA",
      "DATE_OF_BILL": "23-09-2022",
      "IS_BILLFIELD": "YES",
      "NAME_OF_HOSPITAL": "Galaxy Multispeciality Hospital, Mumbai",
      "TREATMENT_NATURE": "Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ",
      "TREATMENT_PERIOD": '12-09-2022 to 20-09-2022',
      "REIMBURSMENT_CLAIMED": "Rs.23,333",
      "REIMBURSMENT_ADMISSIBLE": "Rs.23,333",
      "ADVANCE_TACKEN": "NIL",
      "NET_AMOUNT_PAYABLE": "Rs.23,333/- ",
    },
    {
      "ID": 4,
      "NAME_OF_APPLICATION": "Mr Ajit Kumar",
      "DESIGNATION_OFFICE": "Tax Assistant., O/o,Addl.CIT Rg-12(1), Mumbai",
      "DDO_OFFICIAL": "DDO Walfare & SG, Mumbai",
      "EMP_CODE_NO": "564322",
      "PATIENTS_RELATION": "Father-Mr. Vijay B Kumar-4363463",
      "CGHS_OR_CS": "CGHS",
      "IS_EMERGENCY_TREATMENT": "YES",
      "DATE_OF_CGHS": "NA",
      "DATE_OF_BILL": "22-01-2022",
      "IS_BILLFIELD": "YES",
      "NAME_OF_HOSPITAL": "Galaxy Multispeciality Hospital, Mumbai",
      "TREATMENT_NATURE": "Hysterectomy, Transvaginal Endocervical,Myomectomy with D & C ",
      "TREATMENT_PERIOD": '03-01-2022 to 07-01-2022',
      "REIMBURSMENT_CLAIMED": "Rs.45,683",
      "REIMBURSMENT_ADMISSIBLE": "Rs.45,683",
      "ADVANCE_TACKEN": "NIL",
      "NET_AMOUNT_PAYABLE": "Rs.45,683/- ",
    },

  ];
  ngOnInit(): void {
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
    this.loadingRecords = false;
    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";
    } catch (error) {
      sort = "";
    }


    var likeQuery = "";





  }


  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New Claim";
    this.drawerVisible = true;
  }

  edit(data: any): void {
    this.drawerTitle = "Edit Claim Details";
    this.drawerVisible = true;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {

    this.isVisible = false;
  }

  handleCancel(): void {

    this.isVisible = false;
  }
}
