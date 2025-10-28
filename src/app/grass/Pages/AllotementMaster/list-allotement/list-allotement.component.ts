import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentCheckList } from 'src/app/grass/Models/AllotmentCheckList';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-list-allotement',
  templateUrl: './list-allotement.component.html',
  styleUrls: ['./list-allotement.component.css'],
  providers: [DatePipe],
})
export class ListAllotementComponent {
  formTitle = 'Application Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'asc';
  sortKey: string = 'ID';
  searchText: string = '';
  drawerTitle!: string;
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
    ['GRADE_PAY', 'Grade Pay'],
    ['OFFICE_NAME', 'Office Name'],
    ['DESIGNATION', 'Designation'],
    ['LOCATION', 'Location'],
    ['DDO_OF_THE_OFFICIAL', 'DDO Official'],
    ['EMAIL_ID', 'Email ID'],
    ['MOBILE_NO', 'Mobile Number'],
  ];
  drawerVisible: boolean = false;
  drawerData: AllotmentMaster = new AllotmentMaster();
  employeeID: any;
  showCreaterequest: boolean = false;
  datenew = new Date();
  Senioritylist: any = [];
  Waitinglist: any = [];
  Allotmentlistany: any = [];
  ResidenceTypereq: any = [];
  Publishedmonth = false;
  waitingmonth = false;
  Allotmmm = false;
  Allotmentchecklistdata: any = [];

  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.employeeID = sessionStorage.getItem('userId');
    this.search();
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }
  keyup(event: any) {
    // this.search(true);
  }
  search(reset: boolean = false) {
    let monthdate = new Date();
    let yeardate = new Date();
    let month = this.datepipe.transform(monthdate, 'MM');
    let year = this.datepipe.transform(yeardate, 'yyyy');

    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ')';
    }

    this.api
      .getAllotmenmaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND EMPLOYEE_ID = ' + this.employeeID + likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          let todays = new Date();
          // let todaysmonth = Number(todays.getMonth());
          let todaysmonth = Number(this.datepipe.transform(todays, 'MM'));
          if (this.dataList.length > 0) {
            let applnmonth = Number(
              this.datepipe.transform(
                this.dataList[0]['APPLICATION_DATETIME'],
                'MM'
              )
            );

            if (
              this.dataList[0]['STATUS'] == 'P' ||
              this.dataList[0]['STATUS'] == 'A'
            ) {
              this.showCreaterequest = true;
            } else if (
              applnmonth - todaysmonth != 0 &&
              this.dataList[0]['STATUS'] == 'A'
            ) {
              this.showCreaterequest = false;
            } else if (this.dataList[0]['STATUS'] == 'R') {
              this.showCreaterequest = false;
            } else if (this.dataList[0]['STATUS'] == '') {
              this.showCreaterequest = false;
            }
          }

          this.api.getAllotmentchecklist(0, 0, 'ID', 'desc', '').subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.Allotmentchecklistdata = data['data'];
              } else {
              }
            },
            (err) => { }
          );

          this.api
            .residenceTypeRequest(0, 0, '', 'desc', '')
            .subscribe((data) => {
              if (data['code'] == 200) {
                this.ResidenceTypereq = data['data'];

                this.api
                  .getSenioritylist(0, 0, 'ID', 'desc', ' AND YEAR = ' + year)
                  .subscribe(
                    (values) => {
                      this.Senioritylist = values['data'];
                      if (this.Senioritylist.length > 0) {
                        let applieddate =
                          this.dataList[0]['APPLICATION_DATETIME'];
                        let appliedmonth = Number(
                          this.datepipe.transform(applieddate, 'MM')
                        );
                        let getnextmonth = this.Senioritylist.find(
                          (val: any) => {
                            return val.MONTH == appliedmonth + 1;
                          }
                        );

                        if (getnextmonth) {
                          this.Publishedmonth = true;
                        } else {
                          this.Publishedmonth = false;
                        }
                      }
                    },
                    (errors) => { }
                  );
              }
            });

          this.api
            .getWaitinglist(0, 0, 'ID', 'desc', ' AND YEAR = ' + year)
            .subscribe(
              (data) => {
                this.Waitinglist = data['data'];
                if (this.Waitinglist.length > 0) {
                  let applnddate = this.dataList[0]['APPLICATION_DATETIME'];
                  let applnmonth = Number(
                    this.datepipe.transform(applnddate, 'MM')
                  );
                  let getnextmontwaiting = this.Waitinglist.find((val: any) => {
                    return val.MONTH == applnmonth + 1;
                  });

                  if (getnextmontwaiting) {
                    this.waitingmonth = true;
                  } else {
                    this.waitingmonth = false;
                  }
                }
              },
              (err) => { }
            );

          let applnddateallot = this.dataList[0]['APPLICATION_DATETIME'];
          let applallotmonth = Number(
            this.datepipe.transform(applnddateallot, 'MM')
          );
          let applyyear = Number(
            this.datepipe.transform(applnddateallot, 'yyyy')
          );
          let nextmonthget = applallotmonth + 1;
          let nextmothyear = applyyear;
          this.api
            .getflatAllotmentMaster(
              0,
              0,
              'ID',
              'desc',
              ' AND MONTH =  ' + nextmonthget + ' AND YEAR = ' + nextmothyear
            )
            .subscribe(
              (data) => {
                this.Allotmentlistany = data['data'];
                if (this.Allotmentlistany.length > 0) {
                  let applnddate = this.dataList[0]['APPLICATION_DATETIME'];
                  let applnmonth = Number(
                    this.datepipe.transform(applnddate, 'MM')
                  );
                  let getnextmontwaiting = this.Allotmentlistany.find(
                    (val: any) => {
                      return val.MONTH == applnmonth + 1;
                    }
                  );

                  if (getnextmontwaiting) {
                    this.Allotmmm = true;
                  } else {
                    this.Allotmmm = false;
                  }
                }
              },
              (err) => { }
            );
        },
        (err) => { }
      );
  }

  //////// ----------------------------------------------------------------------------------- //////////

  // If Conditions to show seniority lists and so on....
  Showsenioritylistform(data: any, i: number) {
    let hasvalue1 = false;
    let applieddate = data['APPLICATION_DATETIME'];
    let appliedmonth = Number(this.datepipe.transform(applieddate, 'MM'));
    let nextmonth = appliedmonth + 1;
    let appliedyear = Number(this.datepipe.transform(applieddate, 'yyyy'));

    for (let a = 0; a < this.ResidenceTypereq.length; a++) {
      if (this.ResidenceTypereq[a]['FLAT_REQUEST_ID'] == data.ID) {
        if (this.Senioritylist.length > 0) {
          for (let b = 0; b < this.Senioritylist.length; b++) {
            if (
              this.ResidenceTypereq[a]['RESIDENCE_TYPE'] ==
              this.Senioritylist[b]['RESIDENCE_TYPE'] &&
              this.Senioritylist[b]['MONTH'] == nextmonth &&
              this.Senioritylist[b]['YEAR'] == appliedyear
            ) {
              return (hasvalue1 = true);
            }
          }
        }
      }
    }

    if (hasvalue1) {
      return true;
    } else {
      return false;
    }
  }

  ShowFlatpreflistform(data, i) {
    let hasvalue1 = false;
    let applieddate = data['APPLICATION_DATETIME'];
    let appliedmonth = Number(this.datepipe.transform(applieddate, 'MM'));
    let nextmonth = appliedmonth + 1;
    let appliedyear = Number(this.datepipe.transform(applieddate, 'yyyy'));

    for (let a = 0; a < this.ResidenceTypereq.length; a++) {
      if (this.ResidenceTypereq[a]['FLAT_REQUEST_ID'] == data.ID) {
        if (this.Waitinglist.length > 0) {
          for (let b = 0; b < this.Waitinglist.length; b++) {
            if (
              this.ResidenceTypereq[a]['RESIDENCE_TYPE'] ==
              this.Waitinglist[b]['RESIDENCE_TYPE'] &&
              this.Waitinglist[b]['MONTH'] == nextmonth &&
              this.Waitinglist[b]['YEAR'] == appliedyear
            ) {
              return (hasvalue1 = true);
            }
          }
        }
      }
    }

    if (hasvalue1) {
      return true;
    } else {
      return false;
    }
  }

  ShowAllotmentlistform(data, i) {
    let hasvalue1 = false;
    let applieddate = data['APPLICATION_DATETIME'];
    let appliedmonth = Number(this.datepipe.transform(applieddate, 'MM'));
    let nextmonth = appliedmonth + 1;
    let appliedyear = Number(this.datepipe.transform(applieddate, 'yyyy'));

    for (let a = 0; a < this.ResidenceTypereq.length; a++) {
      if (this.ResidenceTypereq[a]['FLAT_REQUEST_ID'] == data.ID) {
        if (this.Allotmentlistany.length > 0) {
          for (let b = 0; b < this.Allotmentlistany.length; b++) {
            if (
              this.ResidenceTypereq[a]['RESIDENCE_TYPE'] ==
              this.Allotmentlistany[b]['RESIDENCE_TYPE'] &&
              this.Allotmentlistany[b]['MONTH'] == nextmonth &&
              this.Allotmentlistany[b]['YEAR'] == appliedyear
            ) {
              return (hasvalue1 = true);
            }
          }
        }
      }
    }

    if (hasvalue1) {
      return true;
    } else {
      return false;
    }
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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
    this.search(true);
  }

  currentStage: any;
  employeedata: any;
  Checklistdata: any;

  Employee_name = '';
  employee_code = '';
  emp_Designation = '';
  emp_dob = '';
  office_name = '';
  service_type = '';
  Grade_pay = '';
  gradepay_level = '';
  emp_address = '';
  emp_cast = '';
  headquarter_name = '';
  joining_date: any = '';

  isdetailsfilled: boolean = false;
  Rulesandapply = false;
  handleOk(): void {
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.employeeID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Employee_name = data['data'][0]['NAME'];
            this.employee_code = data['data'][0]['EMPLOYEE_CODE'];
            this.emp_Designation = data['data'][0]['DESIGNATION'];
            this.emp_dob = data['data'][0]['DOB'];
            this.office_name = data['data'][0]['OFFICE_NAME'];
            this.service_type = data['data'][0]['SERVICE_TYPE'];
            this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
            this.gradepay_level = data['data'][0]['GRADE_PAY_LEVEL'];
            this.emp_address = data['data'][0]['ADDRESS'];
            this.emp_cast = data['data'][0]['CAST'];
            this.headquarter_name = data['data'][0]['LOCATION'];
            this.joining_date = data['data'][0]['JOINING_DATE'];

            if (
              this.Employee_name == null ||
              this.emp_Designation == null ||
              this.emp_dob == null ||
              this.office_name == null ||
              this.service_type == null ||
              this.Grade_pay == null ||
              this.gradepay_level == null ||
              this.emp_cast == null ||
              this.headquarter_name == null ||
              this.joining_date == null
            ) {
              this.isdetailsfilled = true;
            } else {
              this.isdetailsfilled = false;
            }
          } else {
            this.message.error("Can't Load Employee Data", '');
          }
        },
        (err) => { }
      );
    this.Rulesandapply = false;
    this.drawerTitle = 'Create New Application';
    this.currentStage = 0;
    this.employeedata = this.employeeID;
    this.drawerData = new AllotmentMaster();
    this.Checklistdata = new AllotmentCheckList();
    this.drawerVisible = true;
  }
  add(): void {
    this.Rulesandapply = true;
  }

  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  edit(data: AllotmentMaster): void {
    this.drawerTitle = 'Update Application';
    this.currentStage = 0;
    this.isdetailsfilled = false;
    this.employeedata = this.employeeID;
    this.drawerData = Object.assign({}, data);
    this.Checklistdata = new AllotmentCheckList();
    this.drawerVisible = true;
  }

  Senioritylistview: boolean = false;
  listviewTitle = '';
  senioritydata: any;
  viewSenioritylist(data: AllotmentMaster) {
    this.listviewTitle = 'View Seniority Order';
    this.Senioritylistview = true;
    this.senioritydata = Object.assign({}, data);
  }

  listclosedrawer(): void {
    this.search();
    this.Senioritylistview = false;
  }

  get closeCallbackviewlist() {
    return this.listclosedrawer.bind(this);
  }

  Allotmentformshow: boolean = false;
  Allotmentformtitle = 'Application Form';
  empdata: any;
  showapplictaionform(data: any) {
    let hasvalue;

    hasvalue = this.Allotmentchecklistdata.find((val) => {
      return val.ALLOTEMENT_ID == data.ID;
    });

    if (!hasvalue) {
      return false;
    } else {
      return true;
    }
  }

  viewapplicationform(data: any) {
    this.Allotmentformshow = true;
    this.empdata = Object.assign({}, data);
  }

  AllotmentformClose() {
    this.search();
    this.Allotmentformshow = false;
  }

  get closeCallallotmentform() {
    return this.AllotmentformClose.bind(this);
  }

  onlyview: boolean = false;
  onlyviewTitle = '';
  empdetail: any;
  drawerdetails: any;
  Checklistdetails = new AllotmentCheckList();
  onlyviewappln(data: any) {
    this.onlyviewTitle = 'Application';
    this.currentStage = 0;
    this.empdetail = this.employeeID;
    this.drawerdetails = Object.assign({}, data);
    this.Checklistdetails = new AllotmentCheckList();
    this.onlyview = true;
  }

  onlyviewClose() {
    this.search();
    this.onlyview = false;
  }

  get closeonlyviewCall() {
    return this.onlyviewClose.bind(this);
  }

  flatprefview: boolean = false;
  flatprefTitle = '';
  flatprefData: any;
  flatprefclosedrawer() {
    this.search();
    this.flatprefview = false;
  }

  get closeCallflatpref() {
    return this.flatprefclosedrawer.bind(this);
  }

  FlatPreferencelist(flatdata) {
    this.flatprefTitle = "Quarter Preference's Order";
    this.flatprefview = true;
    this.flatprefData = Object.assign({}, flatdata);
  }

  Allotmentlivisible: boolean = false;
  Allotmentlidata: any;
  allotmentliTitle = '';
  Allotmentlistview(data) {
    this.Allotmentlivisible = true;
    this.allotmentliTitle = 'View Allotment Order';
    this.Allotmentlidata = data;
  }
  allotmentclosedrawer() {
    this.Allotmentlivisible = false;
  }
  get ClosecallAllotmentli() {
    return this.allotmentclosedrawer.bind(this);
  }
}
