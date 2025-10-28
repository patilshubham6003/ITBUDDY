import { Component } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
// import { ApiService } from 'src/app/Service/api.service';
import { QuarterMaster } from '../QuarterData';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-quarter',
  templateUrl: './quarter.component.html',
  styleUrls: ['./quarter.component.css'],
  providers: [DatePipe],
})
export class QUARTERComponent {
  formTitle = 'Quarters Database';
  dataList = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: QuarterMaster = new QuarterMaster();
  userid: any;
  roleid: any;
  Checkrole: boolean = true;

  columns: string[][] = [
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['NAME', 'name'],
    ['RESIDENCE_TYPE_NAME', 'Residence Type'],
    // ['ROOM_TYPE', 'Room Type'],
    ['FLOOR_NAME', 'Floor Name'],
    ['DESIGNATION', 'Designation'],
    ['EMPLOYEE_CODE', 'Employee Name'],
    ['EMPLOYEE_NAME', 'Employee Name'],

  ];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer, private exportService: ExportService,
  ) { }

  inspectorname: any = '';
  ngOnInit(): void {
    this.getallcities();

    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');

    if (this.roleid == 15) {
      this.api
        .getAllUsers(0, 0, 'ID', 'desc', ' AND ID = ' + this.userid)
        .subscribe(
          (value) => {
            if (value.code == 200) {
              if (value['data'].length > 0) {
                let inspectordata = value['data'][0];
                this.inspectorname = inspectordata['NAME'];
              }
            } else {
              console.error('Something Went Wrong..');
            }
          },
          (error) => {
            console.error(error, 'Something Went Wrong..');
          }
        );
    }
    this.getResidenceTypestart();
  }
  applyFilter() {
    this.search(true);
    this.isFilterApplied = 'primary';
  }
  clearFilter() {
    this.statusFilter = '';
    this.filterQuery1 = '';
    this.city = '';
    this.area = '';
    this.building = '';
    // this.roomtype = '';
    this.caretakerfilter = '';
    this.caretakerid = '';
    // this.ROOM_TYPE = [];
    this.BUILDING_ID = [];
    this.FLOOR_ID = [];
    this.CITY_ID = [];
    this.AVAILABLE_STATUS = null;
    this.AREA_ID = [];
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceType111.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
    }
    this.search(true);
    this.isFilterApplied = 'default';
  }
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }
  RESIDENCE_TYPE_IDD: any = [];
  AVAILABLE_STATUS: any;
  // ROOM_TYPE: any;
  likeQuery: any = '';

  statusFilter: any = '';
  filterQuery1: any = '';
  city: any = '';
  area: any = '';
  building: any = '';
  buildingfloor: any = '';
  roomtype: any = '';
  caretakerfilter: any = '';
  caretakerid: any = '';
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.likeQuery = '';

    if (this.searchText != '') {
      this.likeQuery = ' AND (';
      this.columns.forEach((column) => {
        this.likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      this.likeQuery = this.likeQuery.substring(0, this.likeQuery.length - 2);
      this.likeQuery = this.likeQuery + ') ';
    } else {
      this.likeQuery = '';
    }

    this.statusFilter = '';
    if (
      this.AVAILABLE_STATUS != undefined &&
      this.AVAILABLE_STATUS != '' &&
      this.AVAILABLE_STATUS != null
    ) {
      this.statusFilter = " AND AVAILABLE_STATUS='" + this.AVAILABLE_STATUS + "'";
    } else {
      this.statusFilter = '';
    }
    this.filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null
    ) {
      this.filterQuery1 =
        ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
    } else {
      this.filterQuery1 = '';
    }
    this.city = '';
    if (
      this.CITY_ID != undefined &&
      this.CITY_ID != '' &&
      this.CITY_ID != null
    ) {
      this.city = ' AND CITY_ID in (' + this.CITY_ID + ')';
    } else {
      this.city = '';
    }
    this.area = '';
    if (
      this.AREA_ID != undefined &&
      this.AREA_ID != '' &&
      this.AREA_ID != null
    ) {
      this.area = ' AND AREA_ID in (' + this.AREA_ID + ')';
    } else {
      this.area = '';
    }
    this.building = '';
    if (
      this.BUILDING_ID != undefined &&
      this.BUILDING_ID != '' &&
      this.BUILDING_ID != null
    ) {
      this.building = ' AND BUILDING_ID in (' + this.BUILDING_ID + ')';
    } else {
      this.building = '';
    }
    this.buildingfloor = '';

    if (
      this.FLOOR_ID != undefined &&
      this.FLOOR_ID != '' &&
      this.FLOOR_ID != null
    ) {
      this.buildingfloor = ' AND FLOOR_ID in (' + this.FLOOR_ID + ')';
    } else {
      this.buildingfloor = '';
    }
    this.caretakerid = Number(sessionStorage.getItem('userId'));
    if (Number(sessionStorage.getItem('roleId')) == 14) {
      this.caretakerfilter = ' AND CARETAKER_ID=' + this.caretakerid;
    } else {
      this.caretakerfilter = '';
    }
    this.loadingRecords = true;

    this.api
      .getQuarterMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.caretakerfilter +
        this.likeQuery +
        this.filterQuery1 +
        this.statusFilter +
        this.building +
        this.buildingfloor +
        this.area +
        this.city
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isFilterApplied = 'primary';
            this.filterClass = 'filter-invisible';
          } else {
            this.loadingRecords = false;
            this.totalRecords = 1;
            this.dataList = [];
            this.isFilterApplied = 'primary';
            this.filterClass = 'filter-invisible';
          }
        },
        (err) => {
          this.totalRecords = 1;
          this.dataList = [];
          this.loadingRecords = false;
          this.message.error('Failed To Get data', '');
        }
      );
  }

  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

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

  add(): void {
    this.drawerTitle = 'Add Quarter Information';
    this.drawerData = new QuarterMaster();
    this.api.getQuarterMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.drawerData.SEQUENCE_NO = 1;
        } else {
          this.drawerData.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => { }
    );

    this.drawerVisible = true;
  }

  edit(data: QuarterMaster): void {
    this.drawerTitle = 'Update Quarter Information';
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  // vacancylist(){

  // }

  vacancyvisible = false;
  vacancyTitle = '';
  values: any;
  viewflatvacancy() {
    this.vacancyTitle = 'Genrate Notice';
    this.values = Object.assign({}, undefined);
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          // this.drawerOrderVisible = true;
          this.loadingRecords = false;
          this.vacancyvisible = true;
        } else {
          this.message.error('Data Not Load', '');
          this.loadingRecords = false;
        }
      },
      (err) => {
        this.loadingRecords = false;
      }
    );
  }
  vacancyvisibleclose() {
    this.vacancyvisible = false;
  }

  get vacancyclose111() {
    return this.vacancyvisibleclose.bind(this);
  }

  drawerOrderVisible: boolean = false;
  drawerOrderTitle: string = '';
  flatlists: any;
  seniority: any;
  drawerOrderClose() {
    this.flatList = [];
    this.RESIDENCE_TYPE_NAME = '';
    this.RESIDENCE_TYPE_ID = '';
    this.currentDate = '';
    this.drawerOrderVisible = false;
    this.search();
  }
  get orderDrawerClose() {
    return this.drawerOrderClose.bind(this);
  }
  ResidenceType: any = [];
  RESIDENCE_TYPE_ID: any;
  totalFlatRecords = 0;
  order() {
    this.drawerOrderTitle = 'Generate Order';
    this.loadingRecords = true;
    this.flatList = [];
    this.RESIDENCE_TYPE_NAME = '';
    this.RESIDENCE_TYPE_ID = '';
    this.currentDate = '';
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          this.drawerOrderVisible = true;
          this.loadingRecords = false;
        } else {
          this.message.error('Data Not Load', '');
          this.loadingRecords = false;
        }
      },
      (err) => {
        this.loadingRecords = false;
      }
    );
  }

  flatList: any = [];
  RESIDENCE_TYPE_NAME: any;
  isSpinning: boolean = false;
  filter: any;
  currentMonth: any;
  currentYear: any;
  residenceTypeID: any;
  listOfFlat(event) {
    this.totalFlatRecords = 0;
    this.residenceTypeID = '';
    if (event != null && event != undefined && event != '') {
      this.residenceTypeID = event;
      this.isSpinning = true;
      this.api
        .getQuarterMaster(
          0,
          0,
          '',
          '',
          " AND STATUS=1 AND AVAILABLE_STATUS = 'A'  AND RESIDENCE_TYPE_ID = " +
          event
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.flatList = data['data'];
                this.totalFlatRecords = data['count'];
                this.RESIDENCE_TYPE_NAME =
                  data['data'][0]['RESIDENCE_TYPE_NAME'];
                this.isSpinning = false;
              } else {
                this.isSpinning = false;
                this.flatList = [];
                this.RESIDENCE_TYPE_NAME = '';
              }
            } else {
              this.flatList = [];
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    } else {
      this.flatList = [];
      this.isSpinning = false;
    }
  }
  printOrderModalVisible: boolean = false;
  currentDate: any;
  SELECTMONTH: any = new Date();
  generateOrder() {
    if (this.flatList.length > 0) {
      var data = {
        MONTH: this.datepipe.transform(new Date(this.SELECTMONTH), 'MM'),
        YEAR: this.datepipe.transform(new Date(this.SELECTMONTH), 'yyyy'),
        RESIDENCE_TYPE: this.residenceTypeID,
        DATETIME: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        RESIDENCE_TYPE_ID: this.flatList,
        FILE_URL: null,
        APPROVER_ID: null,
        CREATOR_ID: Number(sessionStorage.getItem('userId')),
        PUBLISH_DATE_TIME: null,
        IS_PUBLISH: 0,
      };
      this.api.createFlatOrderBulk(data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information Save Successfully...', '');
          this.isSpinning = false;
          this.currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
          this.printOrderModalVisible = true;
        } else if (successCode.code == '300') {
          this.message.info(
            this.RESIDENCE_TYPE_NAME + ' Quarter Order Already Generated...',
            ''
          );
        } else {
          this.message.error('Failed To Fill Information...', '');
          this.isSpinning = false;
        }
      }, err => {
        this.message.error('Failed To Fill Information...', '');
        this.isSpinning = false;
      });
    } else {
      this.message.error(
        'There Is No Vacant Quarter Available On This Residence Type',
        ''
      );
    }
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  openpdf() {
    this.pdfDownload = true;
    const element = document.getElementById('flatOrder');
    const opt = {
      margin: 0.2,
      filename: 'Available Quarter Order.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf()
      .from(element)
      .set(opt)
      .then(() => {
        this.pdfDownload = false;
      })
      .save();
  }
  pdfDownload: boolean = false;
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }
  // RESIDENCE_TYPE_IDD: any
  ResidenceType111: any;
  getResidenceType() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
        }
      },
      (err) => { }
    );
  }
  getResidenceTypestart() {
    this.RESIDENCE_TYPE_IDD = [];
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
          for (var i = 0; i < this.ResidenceType111.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
          }
          this.applyFilter();
        }
      },
      (err) => { }
    );
  }
  // BlockList:any;
  areaList: any;
  FloorNo: any;
  BuildingList: any;
  cityList: any;
  CITY_ID: any;
  AREA_ID: any;
  BUILDING_ID: any;
  FLOOR_ID: any;

  changecity(event: any) {
    this.BuildingList = [];
    this.FloorNo = [];
    this.areaList = [];

    if (event.length > 0) {
      this.api
        .getareamaster(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND CITY_ID in(' + event + ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.areaList = data['data'];
            }
          },
          (err) => { }
        );
    } else {
      this.BUILDING_ID = [];
      this.AREA_ID = [];
      this.FLOOR_ID = [];
    }

  }
  changearea(event: any) {
    this.BuildingList = [];
    if (event.length > 0) {
      this.api
        .getBuildingMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND AREA_ID in(' + event + ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.BuildingList = data['data'];
            }
          },
          (err) => { }
        );
    } else {
      this.BUILDING_ID = [];
      this.FLOOR_ID = [];
    }
  }
  buildingchange(event: any) {
    this.FloorNo = [];
    if (event.length > 0) {
      this.api
        .getFloorMaster(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND BUILDING_ID in(' + event + ')'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.FloorNo = data['data'];
            }
          },
          (err) => { }
        );
    } else {
      this.FLOOR_ID = [];
    }
  }
  getallcities() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        }
      },
      (err) => { }
    );
  }

  flatvacantbulk = false;
  flatvacantbulktitle = '';
  flatvacantdrawerClose() {
    this.search(true);
    this.flatvacantbulk = false;
  }
  get callbackflatvacant() {
    return this.flatvacantdrawerClose.bind(this);
  }
  flatvacantlistaddbulk() {
    this.flatvacantbulk = true;
    this.flatvacantbulktitle = 'Available Quarters For Approval';
  }

  flatvacantbulkshowinspector = false;
  flatvacantbulktitleinspector = '';
  approveflatvacantaddbulk() {
    this.flatvacantbulkshowinspector = true;
    this.flatvacantbulktitleinspector = 'Approve Available Quarters';
  }
  flatvacantinspectordrawerClose() {
    this.search(true);
    this.flatvacantbulkshowinspector = false;
  }
  get callbackflatvacantinspector() {
    return this.flatvacantinspectordrawerClose.bind(this);
  }

  Rulesandapply: boolean = false;
  storedata: any;
  selectvacantdate: any;
  vacantflatlist(data: any) {
    this.storedata = data;
    this.Rulesandapply = true;
    this.drawerData.REMARK = null
    this.drawerData.REMARK_FILE = null;
    this.progressBar4 = false;
    this.percent4 = 0;
    this.Icardshow = true;
  }

  cancelappliactionform() {
    this.Rulesandapply = false;
  }
  loadvac: boolean = false;
  Submitapplication(stoore: any) {
    if (this.drawerData.REMARK == '' || this.drawerData.REMARK == null || this.drawerData.REMARK == undefined) {
      this, this.message.error('Please Enter Remark For Vacant Quarter', '');
    } else {
      this.loadvac = true;
      stoore.TEMP_STATUS = 'A';
      stoore.AVAILABLE_STATUS = 'A';
      stoore.REMARK_FILE = this.drawerData.REMARK_FILE;
      stoore.REMARK = this.drawerData.REMARK;
      this.api.updateQuarterMaster(stoore).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Quarter Vacant Successfully...', '');
          this.Rulesandapply = false;
        } else {
          this.message.error('Failed To Vacant Quarter', '');
        }
        this.loadvac = false;
      }, err => {
        this.loadvac = false;
        this.message.error('Something Went Wrong , Please Try Again Later.', '');
      });
    }
  }

  progressBar4: boolean = false;
  percent4 = 0;
  timer4: any;
  Icardshow: boolean = false;

  IcardPDF: any;
  urlIcardPdf: any;

  clearIcard(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.drawerData.REMARK_FILE = null;
          this.Icardshow = true;
          this.progressBar4 = false;
          this.message.success('File Deleted Successfully', '');
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 5) {
      var a: any = this.api.retriveimgUrl + 'flatRemarkFile/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  view = 0;
  viewPdfSafe: any;
  viewIcard(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 5;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  onFileSelectedIcard(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.IcardPDF = <File>event.target.files[0];

      if (this.IcardPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.IcardPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlIcardPdf = url;
        if (this.drawerData.REMARK_FILE != undefined && this.drawerData.REMARK_FILE.trim() != '') {
          var arr = this.drawerData.REMARK_FILE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar4 = true;
      this.timer4 = this.api
        .onUpload2('flatRemarkFile', this.IcardPDF, this.urlIcardPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent4 = percentDone;
            if (this.percent4 == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar4 = false;
            this.percent4 = 0;
            this.drawerData.REMARK_FILE = null;
            this.Icardshow = true;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'File Uploaded Successfully...',
                ''
              );
              this.isSpinning = false;
              this.drawerData.REMARK_FILE = this.urlIcardPdf;
              this.Icardshow = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.IcardPDF = null;
      this.drawerData.REMARK_FILE = null;
    }
  }
  occupancydata: any
  flatdataocuupancy: any
  occupancyloader: boolean = false
  getoccupancy(event: any) {
    this.occupancyloader = true;
    this.flatdataocuupancy = event
    this.api.getCurrentOccupationDetailedReport(0, 0, '', '', ' AND FLAT_ID=' + event.ID).subscribe((data: any) => {
      if (data['code'] == 200) {
        this.occupancydata = data['data'][0];
        this.viewocuu = true
        this.occupancyloader = false;
      } else {
        this.occupancyloader = false;
      }
    }, err => {
      this.occupancyloader = false;

    });
  }
  viewocuu: boolean = false
  cancel() {
    this.viewocuu = false
    this.search()
  }

  dataList1: any = [];
  loadexcel: boolean = false;
  convertInExcel() {
    this.loadexcel = true;
    this.building +
      this.api.getQuarterMaster(0, 0, this.sortKey, 'desc', this.caretakerfilter + this.likeQuery + this.filterQuery1 + this.statusFilter + this.building + this.area + this.city).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadexcel = false;
            this.dataList1 = data['data'];
            if (this.dataList1.length > 0) {
              var arry1: any = [];
              var obj1: any = new Object();
              if (this.dataList1.length > 0) {
                for (var i = 0; i < this.dataList1.length; i++) {
                  if (this.dataList1[i]['AVAILABLE_STATUS'] == 'B') {
                    obj1[' Available Status'] = 'Booked';
                  } else if (this.dataList1[i]['AVAILABLE_STATUS'] == 'A') {
                    obj1[' Available Status'] = 'Available';
                  } else if (this.dataList1[i]['AVAILABLE_STATUS'] == 'U') {
                    obj1[' Available Status'] = 'Under Maintenance';
                  } else if (this.dataList1[i]['AVAILABLE_STATUS'] == 'NA') {
                    obj1[' Available Status'] = 'Not Available';
                  } else {
                    obj1[' Available Status'] = '-';
                  }
                  obj1['City Name'] = this.dataList1[i]['CITY_NAME'] ? this.dataList1[i]['CITY_NAME'] : '-';
                  obj1['Area Name'] = this.dataList1[i]['AREA_NAME'] ? this.dataList1[i]['AREA_NAME'] : '-';
                  obj1['Building Name'] = this.dataList1[i]['BUILDING_NAME'] ? this.dataList1[i]['BUILDING_NAME'] : '-';
                  obj1['Floor'] = this.dataList1[i]['FLOOR_NAME'] ? this.dataList1[i]['FLOOR_NAME'] : '-';
                  obj1['Quarter Name'] = this.dataList1[i]['NAME'] ? this.dataList1[i]['NAME'] : '-';
                  // obj1['Room Type'] = this.dataList1[i]['ROOM_TYPE'] ? this.dataList1[i]['ROOM_TYPE'] : '-';
                  obj1['Residence Type'] = this.dataList1[i]['RESIDENCE_TYPE_NAME'] ? this.dataList1[i]['RESIDENCE_TYPE_NAME'] : '-';
                  obj1['Employee Name'] = this.dataList1[i]['EMPLOYEE_NAME'] ? this.dataList1[i]['EMPLOYEE_NAME'] : '-';
                  obj1['Employee Code'] = this.dataList1[i]['EMPLOYEE_CODE'] ? this.dataList1[i]['EMPLOYEE_CODE'] : '-';
                  obj1['Designation'] = this.dataList1[i]['DESIGNATION'] ? this.dataList1[i]['DESIGNATION'] : '-';

                  if (this.dataList1[i]['STATUS'] == '0') {
                    obj1[' Status'] = 'Off';
                  } else if (this.dataList1[i]['STATUS'] == '1') {
                    obj1[' Status'] = 'On';
                  } else {
                    obj1[' Status'] = '-';
                  }
                  arry1.push(Object.assign({}, obj1));
                  if (i == this.dataList1.length - 1) {
                    this.exportService.exportExcel1(arry1, 'Quarters Database ' + this.datepipe.transform(new Date(), 'dd/MMM/yyyy'));
                  }
                }
              } else {
                this.message.error('Data Not Found', '');
              }
            } else {
              this.message.error('Data Not Found', '');
            }
          } else {
            this.loadexcel = false;
            this.dataList1 = [];
            this.message.error("Something went wrong, please try again later", "");
          }
        }, (err) => {
          this.loadexcel = false;
          this.dataList1 = [];
          this.message.error("Something went wrong, please try again later", "");
        });
  }
}