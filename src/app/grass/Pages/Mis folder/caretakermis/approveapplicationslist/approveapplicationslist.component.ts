import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-approveapplicationslist',
  templateUrl: './approveapplicationslist.component.html',
  styleUrls: ['./approveapplicationslist.component.css'],
  providers: [DatePipe],
})
export class ApproveapplicationslistComponent {
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  username: any = sessionStorage.getItem('userName');
  usernumber: any = sessionStorage.getItem('loginmobileNo');
  useremail: any = sessionStorage.getItem('emailId');
  cureeentdate: any = new Date();
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) {}

  datenew = new Date();
  selectFromMonth: any = new Date(
    this.datenew.getFullYear(),
    this.datenew.getMonth()
  );
  selectToMonth: any = new Date(
    this.datenew.getFullYear(),
    this.datenew.getMonth()
  );
  selectyear: any = new Date();

  Monthrange: any = [];
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

    this.Monthrange[0] = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );
  }
  startdatenow = new Date();

  ngOnInit(): void {
    // this.search();
    this.Monthrange[0] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      this.startdatenow.getFullYear(),
      this.startdatenow.getMonth() + 1,
      0
    );

    this.applyFilter();
    this.getResidenceType();
    this.getallcities();
  }
  loadingRecords: boolean;
  sortValue: any;
  searchText: string = '';

  columns1: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['FLAT_NAME', 'FLAT_NAME'],
  ];

  totalRecords: any;
  dataList: any;
  pageIndex = 1;
  pageSize = 10;
  caretakerdata: any = [];
  sortKey: any;
  BUILDING_ID: any;
  AREA_ID: any;
  CITY_ID: any;
  RESIDENCE_TYPE_IDD: any = [];
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
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
      this.columns1.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ') ';
    }
    this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

    var filterQuery1 = '';
    if (
      this.RESIDENCE_TYPE_IDD != undefined &&
      this.RESIDENCE_TYPE_IDD != '' &&
      this.RESIDENCE_TYPE_IDD != null
    ) {
      filterQuery1 =
        ' AND RESIDENCE_TYPE_ID in (' + this.RESIDENCE_TYPE_IDD + ')';
    }
    var city = '';
    if (
      this.CITY_ID != undefined &&
      this.CITY_ID != '' &&
      this.CITY_ID != null
    ) {
      city = ' AND CITY_ID in (' + this.CITY_ID + ')';
    }
    var area = '';
    if (
      this.AREA_ID != undefined &&
      this.AREA_ID != '' &&
      this.AREA_ID != null
    ) {
      area = ' AND AREA_ID in (' + this.AREA_ID + ')';
    }
    var building = '';
    if (
      this.BUILDING_ID != undefined &&
      this.BUILDING_ID != '' &&
      this.BUILDING_ID != null
    ) {
      building = ' AND BUILDING_ID in (' + this.BUILDING_ID + ')';
    }
    var Datefilter = '';
    if (
      this.MONTH1 != undefined &&
      this.MONTH1 != '' &&
      this.MONTH1 != null &&
      this.MONTH2 != undefined &&
      this.MONTH2 != '' &&
      this.MONTH2 != null
    ) {
      Datefilter =
        " AND FILTER_DATE BETWEEN '" +
        this.MONTH1 +
        "' AND '" +
        this.MONTH2 +
        "' ";
    }
    var caretakerid = Number(sessionStorage.getItem('userId'));
    var caretakerfilter = ' AND CARETAKER_ID=' + caretakerid;
    // caretakerfilter+

    // var caretaker

    this.api
      .getcaretakeraprovedata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        Datefilter +
          caretakerfilter +
          likeQuery +
          building +
          area +
          city +
          filterQuery1
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.caretakerdata = data['data'];
            this.loadingRecords = false;
            this.filterClass = 'filter-invisible';
            this.isFilterApplied = 'primary';
            // if(this.totalRecords==0){
            //   data['SEQUENCE_NO']=1;
            // }else{
            //   data['SEQUENCE_NO']= this.dataList[this.dataList.length-1]['SEQUENCE_NO']+1
            // }
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }

  sort(params: NzTableQueryParams): void {
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
  data: any = [];
  approveeee(data: any) {
    // this.data = event;

    if (
      data.TECHNICAL_TAKEN_DATE_TIME != null &&
      data.TECHNICAL_TAKEN_DATE_TIME != ''
    ) {
      data.TECHNICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.TECHNICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }

    if (
      data.PHYSICAL_TAKEN_DATE_TIME != null &&
      data.PHYSICAL_TAKEN_DATE_TIME != ''
    ) {
      data.PHYSICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.PHYSICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    if (
      data.OCCUPANCY_TYPE == null ||
      data.OCCUPANCY_TYPE == undefined ||
      data.OCCUPANCY_TYPE == ''
    ) {
      this.message.error('Please select occupancy type', '');
    } else if (
      data.OCCUPANCY_TYPE == 'T' &&
      (data.TECHNICAL_REMARK == null ||
        data.TECHNICAL_REMARK == undefined ||
        data.TECHNICAL_REMARK == '')
    ) {
      this.message.error('Please enter technical remark', '');
    } else if (
      data.OCCUPANCY_TYPE == 'T' &&
      (data.TECHNICAL_TAKEN_DATE_TIME == null ||
        data.TECHNICAL_TAKEN_DATE_TIME == undefined ||
        data.TECHNICAL_TAKEN_DATE_TIME == '')
    ) {
      this.message.error('Please Select technical date', '');
    } else if (
      (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED == 1 &&
      (data.PHYSICAL_OCCUPANCY_LETTER == null ||
        data.PHYSICAL_OCCUPANCY_LETTER == undefined ||
        data.PHYSICAL_OCCUPANCY_LETTER == '')
    ) {
      this.message.error('Please upload physical letter', '');
    } else if (
      (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
      (data.DEDUCTION_REMARK == null ||
        data.DEDUCTION_REMARK == undefined ||
        data.DEDUCTION_REMARK == '')
    ) {
      this.message.error('Please enter decuction remark', '');
    } else {
      this.accpt = true;
    }
  }
  accpt: boolean = false;
  view(event: any) {
    window.open(
      this.api.retriveimgUrl + 'authorisationOccupationLetter/' + event,
      ''
    );
  }
  view2(event: any) {
    window.open(this.api.retriveimgUrl + 'allotmentFinalLetter/' + event, '');
  }

  approveupdate(data: any) {
    if (
      data.TECHNICAL_TAKEN_DATE_TIME != null &&
      data.TECHNICAL_TAKEN_DATE_TIME != ''
    ) {
      data.TECHNICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.TECHNICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }

    if (
      data.PHYSICAL_TAKEN_DATE_TIME != null &&
      data.PHYSICAL_TAKEN_DATE_TIME != ''
    ) {
      data.PHYSICAL_TAKEN_DATE_TIME = this.datepipe.transform(
        data.PHYSICAL_TAKEN_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
    }
    if (
      data.OCCUPANCY_TYPE == null ||
      data.OCCUPANCY_TYPE == undefined ||
      data.OCCUPANCY_TYPE == ''
    ) {
      this.message.error('Please select occupancy type', '');
    } else if (
      data.OCCUPANCY_TYPE == 'T' &&
      (data.TECHNICAL_REMARK == null ||
        data.TECHNICAL_REMARK == undefined ||
        data.TECHNICAL_REMARK == '')
    ) {
      this.message.error('Please enter technical remark', '');
    } else if (
      data.OCCUPANCY_TYPE == 'T' &&
      (data.TECHNICAL_TAKEN_DATE_TIME == null ||
        data.TECHNICAL_TAKEN_DATE_TIME == undefined ||
        data.TECHNICAL_TAKEN_DATE_TIME == '')
    ) {
      this.message.error('Please Select technical date', '');
    } else if (
      (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
      data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED == 1 &&
      (data.PHYSICAL_OCCUPANCY_LETTER == null ||
        data.PHYSICAL_OCCUPANCY_LETTER == undefined ||
        data.PHYSICAL_OCCUPANCY_LETTER == '')
    ) {
      this.message.error('Please upload physical letter', '');
    } else if (
      (data.OCCUPANCY_TYPE == 'P' || data.IS_PHYSICALLY_FLAT_AVAILABLE == 1) &&
      (data.DEDUCTION_REMARK == null ||
        data.DEDUCTION_REMARK == undefined ||
        data.DEDUCTION_REMARK == '')
    ) {
      this.message.error('Please enter decuction remark', '');
    } else {
      this.loadingRecords = true;
      if (data.OCCUPANCY_TYPE == 'P') {
        data.IS_APPROVED_BY_CARETAKER = 1;
      } else if (data.IS_PHYSICALLY_FLAT_AVAILABLE == 0) {
        data.IS_APPROVED_BY_CARETAKER = 0;
        data.TECHNICAL_TAKEN_DATE_TIME = '';
        data.TECHNICAL_REMARK = '';
      } else {
        data.IS_APPROVED_BY_CARETAKER = 0;
      }
      data.CARETAKER_ID = Number(sessionStorage.getItem('userId'));

      this.api.updatecaretakeraprovedata(data).subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.message.success('Approved Successfully', '');
            this.accpt = false;
            // this.search();
            this.loadingRecords = false;
            // this.stage = 1;
          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      );
    }
  }
  cancel() {
    this.accpt = false;
  }
  ResidenceType111: any = [];
  areaList: any = [];
  BuildingList: any = [];
  cityList: any = [];

  getResidenceType() {
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
          for (var i = 0; i < this.ResidenceType111.length; i++) {
            this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
          }
        }
      },
      (err) => {}
    );
  }
  changecity(event: any) {
    // this.BuildingList = []
    // this.FloorNo = [];
    this.areaList = [];

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
        (err) => {}
      );
  }
  changearea(event: any) {
    this.BuildingList = [];

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
        (err) => {}
      );
  }

  getallcities() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        }
      },
      (err) => {}
    );
  }
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  applyFilter() {
    if (
      this.Monthrange == null ||
      this.Monthrange == undefined ||
      this.Monthrange == ''
    ) {
      this.message.error('Please Select Month', '');
    } else {
      this.MONTH1 = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
      this.MONTH2 = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');

      this.isFilterApplied = 'primary';
      this.search(true);
    }
  }
  clearFilter() {
    this.Monthrange = [];
    let newdate = new Date();
    this.Monthrange[0] = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    this.Monthrange[1] = new Date(
      newdate.getFullYear(),
      newdate.getMonth() + 1,
      0
    );
    this.BUILDING_ID = null;
    this.AREA_ID = null;
    this.CITY_ID = null;
    // this.RESIDENCE_TYPE_IDD = null;
    this.RESIDENCE_TYPE_IDD = [];
    for (var i = 0; i < this.ResidenceType111.length; i++) {
      this.RESIDENCE_TYPE_IDD.push(this.ResidenceType111[i]['ID']);
    }
    this.search(true);
    this.isFilterApplied = 'default';
  }
  drawerVisible: boolean = false;
  drawerData: any = [];
  condition: boolean = false;
  editform(data: any) {
    this.progressBar1 = false;
    this.percent1 = 0;
    this.drawerData = data;
    var currentDate = new Date();

    this.drawerData.PHYSICAL_TAKEN_DATE_TIME = new Date(currentDate);

    if (data.INSPECTOR_TECHNICAL_STATUS == 'A') {
      this.condition = true;
    } else {
      this.condition = false;
    }

    this.drawerVisible = true;
  }
  onOccupancyTypeChange(event: any) {
    if (event == 'T') {
      if (
        this.drawerData.TECHNICAL_TAKEN_DATE_TIME == null ||
        this.drawerData.TECHNICAL_TAKEN_DATE_TIME == undefined ||
        this.drawerData.TECHNICAL_TAKEN_DATE_TIME == ''
      ) {
        var currentDate = new Date();
        this.drawerData.TECHNICAL_TAKEN_DATE_TIME = new Date(currentDate);
        this.drawerData.TECHNICAL_TAKEN_DATE_TIME.setDate(
          currentDate.getDate() + 45
        );
      }
    }
  }
  drawerClose() {
    this.drawerVisible = false;
    this.search();
  }

  caretakervacationmodal = false;
  opencaretakervacationmodal() {
    this.caretakervacationmodal = true;
  }
  cancelcaretakervacationmodal() {
    this.caretakervacationmodal = false;
  }
  pdfDownloaddraft = false;
  downloadPdfdraft() {
    this.loadingRecords = true;
    const element = document.getElementById('printpageform1');
    const opt = {
      margin: 0.2,
      filename: 'Physical Occupation Report.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.loadingRecords = false;
    }, 5000);
  }

  progressBar1: boolean = false;
  percent1 = 0;
  timer1: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  FinalFileurl: any;
  urlFinalFileurl: any;
  FinalFileUrlUpload(event: any, data) {
    if (event.target.files[0].type == 'application/pdf') {
      this.FinalFileurl = <File>event.target.files[0];

      if (this.FinalFileurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.FinalFileurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlFinalFileurl = url;
        // if (
        //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED != undefined &&
        //   data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED.trim() != ''
        // ) {
        //   var arr = this.data.IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED.split('/');
        //   if (arr.length > 1) {
        //     url = arr[5];
        //   }
        // }
      }
      this.progressBar1 = true;
      this.loadingRecords = true;
      this.timer1 = this.api
        .onUpload2(
          'physicalOccupancyLetter',
          this.FinalFileurl,
          this.urlFinalFileurl
        )
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              // this.message.success('File Uploaded Successfully', '');
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.loadingRecords = false;
            this.progressBar1 = false;
            this.percent1 = 0;
            data.PHYSICAL_OCCUPANCY_LETTER = null;
            this.drawerData.PHYSICAL_OCCUPANCY_LETTER = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully', '');
              this.loadingRecords = false;
              data.PHYSICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
              this.drawerData.PHYSICAL_OCCUPANCY_LETTER = this.urlFinalFileurl;
              this.loadingRecords = false;
            } else {
              this.loadingRecords = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.loadingRecords = false;
      this.progressBar1 = false;
      this.percent1 = 0;
      data.PHYSICAL_OCCUPANCY_LETTER = null;
      this.loadingRecords = false;
    }
  }

  clearFinalFileUrl(url: any, folder: any, data: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.message.success('File Deleted Successfully', '');
          data.PHYSICAL_OCCUPANCY_LETTER = null;
          // this.drawerData.PHYSICAL_OCCUPANCY_LETTER = null;
          this.progressBar1 = false;
          this.percent1 = 0;
        } else {
          this.message.error('Failed to delete File', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete File', '');
      }
    );
  }

  viewFinalFileUrl(fileurl: any) {
    window.open(this.api.retriveimgUrl + 'physicalOccupancyLetter/' + fileurl);
  }

  // getdisabled(data){
  //   var condition=false;
  //   if(data.data.INSPECTOR_TECHNICAL_STATUS==1){
  //     condition=true;
  //   }else{
  //     condition=false;
  //   }
  //   return condition;
  // }
}
