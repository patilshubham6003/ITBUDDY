import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AllotmentCheckList } from 'src/app/grass/Models/AllotmentCheckList';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { endOfMonth, startOfMonth, subYears } from 'date-fns';
import { HttpEventType } from '@angular/common/http';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-renovation-list',
  templateUrl: './renovation-list.component.html',
  styleUrls: ['./renovation-list.component.css'],
  providers: [DatePipe],
})
export class RenovationListComponent {
  formTitle = 'Renovation Requests';
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
  columns: string[][] = [
    ['DESIGNATION', 'DESIGNATION'],
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['FLAT_NAME', 'FLAT_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['CITY_NAME', 'CITY_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['RENOVATION_REJECTION_REMARK', 'RENOVATION_REJECTION_REMARK'],
  ];
  drawerVisible: boolean = false;
  drawerData: AllotmentMaster = new AllotmentMaster();
  employeeID: any;
  userid: any;
  roleid: any;
  isFilterApplied: any = 'primary';
  // isFilterApplied: any = 'default';
  isSpinning = false;
  filterClass: string = 'filter-invisible';
  Status = 'P';
  monthh: any = [];
  MONTH: any;
  YEAR: any;
  RESIDENCE_TYPE_IDD: any = [];
  monthh1: any;
  monthh2: any;
  dateFormat = 'dd/MM/yyyy';
  selectFromMonth: any = [];

  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datePipe: DatePipe
  ) { }
  AREA_ID: any = [];
  ngOnInit(): void {
    console.log('roleid', Number(sessionStorage.getItem('roleId')));
    if (Number(sessionStorage.getItem('roleId')) == 60) {
      this.api
        .getuserAreaMapping(
          0,
          0,
          '',
          '',
          ' AND USER_ID = ' + Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.AREA_ID = [];
              if (data['data'].length > 0) {
                const areaIds = data['data'].map((item: any) => item.AREA_ID);
                this.AREA_ID = areaIds;
              } else {
                this.AREA_ID = [];
              }
            } else {
              this.dataList = [];
              this.isSpinning = false;
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.loadingRecords = false;
          }
        );
    }
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datePipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datePipe.transform(this.monthh2, 'yyyy-MM-dd');
    this.employeeID = sessionStorage.getItem('userId');

    // this.getEmployee()
    // this.search();

    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    this.selectFromMonth[0] = lastYearSameMonth;
    this.selectFromMonth[1] = endOfCurrentMonth;
    this.selectFromMonth = [this.selectFromMonth[0], this.selectFromMonth[1]];
    this.getResidenceTypestart();
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    // this.search();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  emp: any = [];

  getResidenceTypestart() {
    // this.isSpinning = true;
    this.api.getResidence1111(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.emp = data['data'];

          for (var i = 0; i < this.emp.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.emp[i]['ID']);
          }

          this.applyFilter();
          // this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  pendingscounts;
  registercounts;
  approvedcounts;
  deleteedcounts;

  OLDApplicationcounts: any = '';
  NewApplicationcounts: any = '';

  clearFilter() {
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.emp.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.emp[i]['ID']);
    }
    // this.monthh[0]=new Date()
    // this.monthh[1]=new Date()
    this.monthh1 = moment().startOf('month');
    this.monthh2 = this.monthh1.clone().endOf('month');
    this.monthh[0] = this.datePipe.transform(this.monthh1, 'yyyy-MM-dd');
    this.monthh[1] = this.datePipe.transform(this.monthh2, 'yyyy-MM-dd');
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    this.selectFromMonth[0] = lastYearSameMonth;
    this.selectFromMonth[1] = endOfCurrentMonth;
    this.selectFromMonth = [this.selectFromMonth[0], this.selectFromMonth[1]];

    this.searchText = '';
    this.search(true);
    this.isFilterApplied = 'default';
  }

  changeRadioButton(event) {
    this.Status = event;
    this.search(true);
  }
  RESIDENCE_TYPE_NAME = [];
  keyup(event: any) {
    this.search(true);
  }
  rejectscounts;
  data;
  PENDING_COUNT: any = 0;
  APPROVE_COUNT: any = 0;
  REJECT_COUNT: any = 0;

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'ID';
      this.sortValue = 'desc';
    }
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
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.loadingRecords = true;

    var countFilter = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD.length > 0
    ) {
      countFilter +=
        ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
    }
    if (
      this.AREA_ID != undefined &&
      this.AREA_ID != '' &&
      this.AREA_ID != null &&
      this.AREA_ID.length > 0
    ) {
      countFilter += ' AND AREA_ID in (' + this.AREA_ID + ')';
    }

    if (
      this.selectFromMonth !== null ||
      this.selectFromMonth !== undefined ||
      this.selectFromMonth !== ''
    ) {
      countFilter +=
        " AND RENOVATION_RESQUEST_DATETIME BETWEEN '" +
        this.datePipe.transform(this.selectFromMonth[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.selectFromMonth[1], 'yyyy-MM-dd') +
        "'";
    }
    this.PENDING_COUNT = 0;
    this.APPROVE_COUNT = 0;
    this.REJECT_COUNT = 0;

    this.isSpinning = true;
    this.api
      .getFlatTakenEmployeeFinalllNew(
        this.pageIndex,
        this.pageSize,
        'ID',
        'desc',

        ' AND IS_APPLIEND_FOR_RENOVATION = 1 ' + this.filterQuery + likeQuery,
        ' AND IS_APPLIEND_FOR_RENOVATION = 1 ' + countFilter
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.isSpinning = false;
            this.totalRecords = data['count'];
            if (data['count'] > 0) {
              this.dataList = data['data'];
            } else {
              this.dataList = [];
            }
            if (data['COUNTS'][0]) {
              this.PENDING_COUNT = data['COUNTS'][0]['PENDING'];
              this.APPROVE_COUNT = data['COUNTS'][0]['APPROVED'];
              this.REJECT_COUNT = data['COUNTS'][0]['REJECTED'];
            } else {
              this.PENDING_COUNT = 0;
              this.APPROVE_COUNT = 0;
              this.REJECT_COUNT = 0;
            }
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';
          } else {
            this.dataList = [];
            this.isSpinning = false;
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.dataList = [];
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
  }

  applyFilter() {
    this.filterQuery = '';
    if (this.APPROVAL_STATUS != undefined && this.APPROVAL_STATUS != 'ALL') {
      this.filterQuery +=
        ' AND RENOVATION_STATUS=' + "'" + this.APPROVAL_STATUS + "'";
    }

    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null &&
      this.RESIDENCE_TYPE_IDD.length > 0
    ) {
      this.filterQuery +=
        ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
    }
    if (
      this.AREA_ID != undefined &&
      this.AREA_ID != '' &&
      this.AREA_ID != null &&
      this.AREA_ID.length > 0
    ) {
      this.filterQuery += ' AND AREA_ID in (' + this.AREA_ID + ')';
    }

    if (
      this.selectFromMonth !== null ||
      this.selectFromMonth !== undefined ||
      this.selectFromMonth !== ''
    ) {
      this.filterQuery +=
        " AND RENOVATION_RESQUEST_DATETIME BETWEEN '" +
        this.datePipe.transform(this.selectFromMonth[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datePipe.transform(this.selectFromMonth[1], 'yyyy-MM-dd') +
        "'";
    }

    if (this.filterQuery) {
      this.isFilterApplied = 'primary';
      this.search(true);
    } else {
      this.message.error('', 'Select Filter');
    }
  }

  APPROVAL_STATUS: any = 'P';
  showcolor0 = 0;
  showcolor1 = 0;
  showcolor2 = 0;
  showcolor3 = 1;
  showcolor4 = 0;
  renst: any = '';

  clickevent(data: any) {
    this.APPROVAL_STATUS = data;
    this.pageIndex = 1;
    this.pageSize = 10;
    if (this.APPROVAL_STATUS == 'ALL') {
      this.showcolor0 = 1;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'A') {
      this.showcolor0 = 0;
      this.showcolor1 = 1;
      this.showcolor2 = 0;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else if (this.APPROVAL_STATUS == 'R') {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 1;
      this.showcolor3 = 0;
      this.showcolor4 = 0;
    } else {
      this.showcolor0 = 0;
      this.showcolor1 = 0;
      this.showcolor2 = 0;
      this.showcolor3 = 1;
      this.showcolor4 = 0;
    }
    this.applyFilter();
  }
  ApplicationStatus: any = '';
  renovationdata: any;
  renovationdatad: any;
  key: any = '';
  renovationdata1: any;
  key1: any = '';
  RENOVATION_REMARK: any = '';
  renovationshow: boolean = false;
  RENOVATION_REMARK1: any = '';
  renovationshow1: boolean = false;
  approverenovation(data: any, key: any) {
    this.key = key;
    this.renovationdatad = data;
    this.renst = '';
    this.renovationshow = true;
  }
  rejectrenovation() {
    if (
      this.renovationdatad.RENOVATION_REJECTION_REMARK == '' ||
      this.renovationdatad.RENOVATION_REJECTION_REMARK == null ||
      this.renovationdatad.RENOVATION_REJECTION_REMARK == undefined
    ) {
      this.message.error('Please Enter the Rejection Remark', '');
    } else {
      this.isSpinningrenovation = true;
      this.renovationdatad.RENOVATION_APPROVED_DATETIME =
        this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.renovationdatad.RENOVATION_STATUS = 'R';
      var dateeeeeee = new Date();
      var datee3: any = dateeeeeee.setDate(dateeeeeee.getDate() + 3);
      datee3 = this.datePipe.transform(dateeeeeee, 'yyyy-MM-dd');
      this.renovationdatad.PHYSICAL_END_DATETIME = datee3 + ' 23:59:59';
      this.renovationdatad.IS_RENOVATION_RECEIVED = false;
      this.renovationdatad.IS_RENOVATION = 0;
      this.api
        .UpdateEmployeeDataflatfinalrenovation(this.renovationdatad)
        .subscribe(
          (value) => {
            if (value.code == 200) {
              this.message.success(
                'Renovation Request Rejected Successfully',
                ''
              );
              this.renovationshow = false;
              this.isSpinningrenovation = false;
              this.search();
            } else {
              this.message.error('Failed to reject renovation request', '');
              this.isSpinningrenovation = false;
            }
          },
          (error) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinningrenovation = false;
          }
        );
    }
  }
  isSpinningrenovation: boolean = false;
  approverrenovation() {
    this.renovationdatad.RENOVATION_STATUS = 'A';
    this.renovationdatad.PHYSICAL_END_DATETIME = '';
    this.renovationdatad.RENOVATION_APPROVED_DATETIME = new Date();
    this.renovationdatad.RENOVATION_APPROVED_DATETIME = this.datePipe.transform(
      this.renovationdatad.RENOVATION_APPROVED_DATETIME,
      'yyyy-MM-dd HH:mm:ss'
    );
    this.renovationdatad.IS_RENOVATION_RECEIVED = true;
    this.isSpinningrenovation = true;
    this.api
      .UpdateEmployeeDataflatfinalrenovation(this.renovationdatad)
      .subscribe(
        (value) => {
          if (value.code == 200) {
            this.message.success(
              'Renovation Request Approved Successfully',
              ''
            );
            this.renovationshow = false;
            this.isSpinningrenovation = false;
            this.search();
          } else {
            this.message.error('Failed to approve renovation request', '');
            this.isSpinningrenovation = false;
          }
        },
        (error) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinningrenovation = false;
        }
      );
  }
  cancelrenovation() {
    this.renovationshow = false;
    this.search();
  }

  isTableInitialized = false;

  sort(params: NzTableQueryParams): void {
    if (!this.isTableInitialized) {
      this.isTableInitialized = true;
      return;
    }

    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    if (this.pageSize !== pageSize || this.sortKey !== sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    } else {
      this.pageIndex = pageIndex;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  // sort(params: NzTableQueryParams) {
  //   this.loadingRecords = true;
  //   const { pageSize, pageIndex, sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || 'ID';
  //   const sortOrder = (currentSort && currentSort.value) || 'asc';
  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if (this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if (this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   this.search();
  // }

  currentStage: any;
  employeedata: any;
  Checklistdata: any;
  applnformshow(pdfURL: string): void {
    var a: any = this.api.retriveimgUrl + 'applicationForm/' + pdfURL;
    window.open(a);
  }
  drawerClose(): void {
    this.search();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  edit(data: any): void {
    this.drawerTitle =
      'Quarter Application Of ' +
      data.EMPLOYEE_NAME +
      ' For Residence ' +
      data.RESIDENCE_TYPE_NAME;
    this.currentStage = 0;
    this.employeedata = this.employeeID;
    this.drawerData = Object.assign({}, data);
    this.Checklistdata = new AllotmentCheckList();
    this.drawerVisible = true;
  }

  ApproveAction(data: any) { }

  RejectAction(data: any) { }
  deletedata: any = [];
  deleteapp: boolean = false;
  deleteresidance: any = [];
  RESIDENCE_TYPE_IDDDDD: any = [];
  confirmshow: boolean = false;
  deleteapplication(data: any) {
    var dataaaaa = data;
    this.RESIDENCE_TYPE_IDDDDD = [];
    this.loadingRecords = true;
    var filterrrr =
      ' AND STATUS = 1 AND ID in ' + '(' + data.RESIDENCE_TYPE_ID + ')';
    this.api.getResidence1111(0, 0, 'ID', 'asc', filterrrr).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.deleteresidance = data['data'];
          this.deletedata = null;
          this.deletedata = dataaaaa;
          this.deleteapp = true;
          this.loadingRecords = false;
        } else {
          this.loadingRecords = false;
        }
      },
      (err) => {
        this.loadingRecords = false;
      }
    );
  }
  canceldelete() {
    this.deletedata = null;
    this.deleteapp = false;
    this.confirmshow = false;
  }

  deletefinal() {
    this.isSpinning = true;
    var ids = '' + this.RESIDENCE_TYPE_IDDDDD + '';
    var data = {
      RESIDENCE_TYPE_IDS: ids,
      EMPLOYEE_ID: this.deletedata.EMPLOYEE_ID,
      ID: this.deletedata.ID,
    };
    this.api.deleteapplicationform(data).subscribe(
      (successCode) => {
        if (successCode.code == '200') {
          this.message.success('Application deleted Successfully...', '');
          this.isSpinning = false;
          this.deleteapp = false;
          this.confirmshow = false;
          this.search();
        } else {
          this.message.error(' Failed To delete application', '');
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  deletefinalbefore() {
    if (
      this.RESIDENCE_TYPE_IDDDDD == null ||
      this.RESIDENCE_TYPE_IDDDDD == '' ||
      this.RESIDENCE_TYPE_IDDDDD == undefined ||
      this.RESIDENCE_TYPE_IDDDDD.length == 0
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      this.confirmshow = true;
    }
  }

  modalVisible: boolean = false;

  tableData: any;
  openCertificateModel(data: any) {
    this.tableData = '';
    this.certificateUrl = '';
    this.URL = '';
    this.tableData = data;
    this.modalVisible = true;
  }
  closeModal() {
    this.modalVisible = false;
  }

  certificateUrl: any;
  URL: any;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      this.message.error(
        'Please upload only JPG, JPEG, PNG, PDF, or DOC/DOCX files',
        ''
      );
      this.certificateUrl = null;
      return;
    }

    if (file.size > maxSize) {
      this.message.error('File size should not exceed 5MB', '');
      this.certificateUrl = null;
      return;
    }

    this.processFile(file);
  }

  processFile(file: File) {
    this.certificateUrl = file;

    // Generate unique file name
    const number = Math.floor(100000 + Math.random() * 900000);
    const fileExt = file.name.split('.').pop();
    const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
    this.URL = `${d}${number}.${fileExt}`;

    // Optional: preview or upload logic
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // this.image = reader.result as string; // only if preview is needed
    };
  }

  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  //   const allowedDocTypes = [
  //     'application/pdf',
  //     'application/msword',
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //   ];
  //   const maxSize = 5 * 1024 * 1024; // 5MB

  //
  //   if (file.size > maxSize) {
  //     this.message.error('File size should not exceed 5MB', '');
  //     this.certificateUrl = null;
  //     return;
  //   }

  //
  //   if (![...allowedImageTypes, ...allowedDocTypes].includes(file.type)) {
  //     this.message.error(
  //       'Please upload only JPG, JPEG, PNG, PDF, or DOC/DOCX files',
  //       ''
  //     );
  //     this.certificateUrl = null;
  //     return;
  //   }

  //
  //   if (allowedImageTypes.includes(file.type)) {
  //     const img = new Image();
  //     img.src = window.URL.createObjectURL(file);

  //     img.onload = () => {
  //       if (img.width === 450 && img.height === 370) {
  //         this.processFile(file);
  //       } else {
  //         this.message.error('Image must be exactly 450×370 pixels', '');
  //         this.certificateUrl = null;
  //       }
  //     };
  //   } else {
  //
  //     this.processFile(file);
  //   }
  // }

  // processFile(file: File) {
  //   this.certificateUrl = file;

  //   // Generate file name
  //   const number = Math.floor(100000 + Math.random() * 900000);
  //   const fileExt = file.name.split('.').pop();
  //   const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
  //   this.URL = `${d}${number}.${fileExt}`;

  //   // Optional: preview or upload logic
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => {
  //     // this.image = reader.result as string; // Only for images if needed
  //   };

  // onFileSelected(event) {
  //   let imgs = new Image();
  //   imgs.src = window.URL.createObjectURL(event.target.files[0]);
  //   // const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
  //   imgs.onload = () => {
  //     if (
  //       (event.target.files[0].type == 'image/jpeg' ||
  //         event.target.files[0].type == 'image/jpg' ||
  //         event.target.files[0].type == 'image/png') &&
  //       imgs.height == 370 &&
  //       imgs.width == 450
  //     ) {
  //       // isLtsize = true;
  //       this.certificateUrl = <File>event.target.files[0];
  //       const reader = new FileReader();
  //       if (event.target.files && event.target.files.length) {
  //         const [file] = event.target.files;
  //         reader.readAsDataURL(file);
  //         reader.onload = () => {
  //           // this.image = reader.result as string;
  //         };
  //         var number = Math.floor(100000 + Math.random() * 900000);
  //         var fileExt = this.certificateUrl.name.split('.').pop();
  //         var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
  //         var url = '';
  //         url = d == null ? '' : d + number + '.' + fileExt;
  //         // url =  d + number + '.' + fileExt;

  //         this.URL = url;
  //         // this.data.IMG_URL = url;
  //       }
  //     } else {
  //       this.message.error(
  //         'Please upload an image having type png,jpg,jpeg and with size 370*450',
  //         ''
  //       );
  //       this.certificateUrl = null;
  //       // this.data.IMG_URL = '';
  //     }
  //   };

  // }

  fileURL: any;
  folderName: any = 'habitableCertificate';

  percent: any = 0;
  progressBar: any = false;
  timer: any;

  uploadCertificate() {
    this.isSpinning = true;
    this.progressBar = true;
    this.timer = this.api
      .onUpload2('habitableCertificate', this.certificateUrl, this.URL)
      .subscribe(
        (res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar = false;
            this.percent = 0;
            // this.personalinformation.PROFILE_PHOTO = null;
            this.isSpinning = false;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              var data = {
                ID: this.tableData.ID,
                HABITABLE_CERTIFICATE: this.URL,
                HABITABLE_UPLOADED_BY_USER_ID: Number(
                  sessionStorage.getItem('userId')
                ),
              };
              this.api
                .sendHabitableCertificate(data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      ' Certificate Uploaded Successfully...',
                      ''
                    );
                    this.modalVisible = false;
                    this.isSpinning = false;
                    this.search();
                  } else {
                    this.message.error(' Failed To Update Information...', '');
                    this.isSpinning = false;
                  }
                });

              // this.message.success('Profile Photo Uploaded Successfully...', '');
              this.isSpinning = false;
              // this.personalinformation.PROFILE_PHOTO = this.urlprofilePdf;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        },
        (err) => {
          this.isSpinning = false;
          console.log(err);
        }
      );
  }
  retrieveimgUrl = appkeys.retriveimgUrl;

  openCertificate(data: any) {
    window.open(
      this.retrieveimgUrl + 'habitableCertificate/' + data.HABITABLE_CERTIFICATE
    );
  }
  Viewoccupancyformletter1(data: any) {
    window.open(this.retrieveimgUrl + 'renovationAttachments/' + data);
  }
  onChangemonth(result: Date[]): void {
    let fromdate: any = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    let Todate: any = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );

    this.selectFromMonth[0] = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    this.selectFromMonth[1] = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );
  }
  cancel() { }
}
