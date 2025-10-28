import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from '../../Services/APIService.service';
import { appkeys } from 'src/app/app.constant';
import { DatePipe } from '@angular/common';
import { AllotmentObjection1 } from '../../Models/AllotmentObjection1';
import { endOfMonth, startOfMonth, subYears } from 'date-fns';

@Component({
  selector: 'app-allotmentdetails',
  templateUrl: './allotmentdetails.component.html',
  styleUrls: ['./allotmentdetails.component.css'],
  providers: [DatePipe],
})
export class AllotmentdetailsComponent implements OnInit {
  isVisible = false;
  sanitizedLink: any = '';
  sanitizedLink1: any = '';
  imgurl = appkeys.retriveimgUrl;
  image: any;
  event1;
  fileURL: File | null = null;
  url: any;
  // folderName = 'flatAllotmentObjection';s

  SpinningRejection: boolean = false;
  transferFileURL: any;
  attachment1: boolean = true;
  urllink: any;
  objectiondata: AllotmentObjection1 = new AllotmentObjection1();
  // data:any=AllotmentMaster
  // data: genertaeSenioritylist = new AllotmentMaster();
  constructor(
    private dom: DomSanitizer,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private message: NzNotificationService,
    public api: APIServicesService
  ) { }

  dataList = [];

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  RejectRemark: boolean = false;
  raiseObjection(data) {
    this.objectiondata = new AllotmentObjection1();
    this.objectiondata.EMP_ID = Number(sessionStorage.getItem('userId'));
    this.objectiondata.RAISE_OBJECTION_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.objectiondata.ACTION_STATUS = 'P';
    this.objectiondata.DRAFT_ALLOTMENT_ID = data.ID;
    this.RejectRemark = true;
  }

  CancleRemark() {
    this.RejectRemark = false;
    this.objectiondata = new AllotmentObjection1();
  }
  showdata: any = false;
  showobjection: any = false;
  checkstep(data, n) {
    let fileurl = data.FILE_URL;
    let finalfileurl = data.FINAL_FILE_URL;
    // let objdatetime = data.OBJ_DATETIME_PERIOD;

    if (data.IS_FINAL == 1) {
      data.SHOW_DATA = true;
      data.SHOW_OBJ = false;
      return 4;
    } else if (
      data.IS_FINAL == 0 &&
      this.Timmerstartloop[n] == 0 &&
      (this.Timmerendloop[n] != 0 || this.Timmerendloop[n] != '')
    ) {
      data.SHOW_OBJ = true;
      data.SHOW_DATA = true;

      return 1;
    } else if (
      data.IS_FINAL == 0 &&
      this.Timmerstartloop[n] == 0 &&
      this.Timmerendloop[n] == 0
    ) {
      // this.showobjection[n]=true;
      data.SHOW_OBJ = false;
      data.SHOW_DATA = true;
      return 2;
    } else if (
      data.IS_FINAL == 0 &&
      this.Timmerstartloop[n] != 0 &&
      (this.Timmerendloop[n] != 0 || this.Timmerendloop[n] != '')
    ) {
      return 0;
    } else {
      return 0;
    }
  }

  SubmitRemark() {
    if (
      this.objectiondata.OBJECTION == null ||
      this.objectiondata.OBJECTION == undefined ||
      this.objectiondata.OBJECTION == ''
    ) {
      this.message.error(' Please Enter Reason for Objection', '');
    } else {
      this.api
        .createAllotementObjection(this.objectiondata)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Saved Successfully...', '');
            this.RejectRemark = false;
            this.objectiondata = new AllotmentObjection1();
          } else if (successCode['code'] == '300') {
            this.message.info('Your objection period is over', '');
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
    }
  }

  showHideReasonArray: any[] = [];
  view1 = 0;
  viewattachedpdf = '';
  viewAssumptionAttached(pdfURL: string): void {
    this.viewattachedpdf = '';
    this.view1 = 11;
    this.AttachedpdfsVisible = true;
    this.viewattachedpdf = this.getS1(pdfURL);
  }
  AttachedpdfsVisible: boolean = false;
  AttachedpdfsCancel() {
    this.AttachedpdfsVisible = false;
  }
  sanitizedLink12: any = '';

  getS1(link: string) {
    var a = '';
    if (this.view1 == 11) {
      a = this.api.retriveimgUrl + 'flatAllotmentObjection/' + link;
    }
    if (this.view1 == 22) {
      a = this.api.retriveimgUrl + 'flatAllotmentObjection/' + link;
    }

    this.sanitizedLink12 = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink12;
  }
  ATTACHMENT1clear() {
    this.objectiondata.FILE_URL = null;
  }

  onFileATTACHMENT1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.SpinningRejection = true;
      this.transferFileURL = <File>event.target.files[0];

      if (this.transferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink = url;
        if (
          this.objectiondata.FILE_URL != undefined &&
          this.objectiondata.FILE_URL.trim() != ''
        ) {
          var arr = this.objectiondata.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('flatAllotmentObjection', this.transferFileURL, this.urllink)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.objectiondata.FILE_URL = this.urllink;
            this.message.success('File Uploaded Successfully...', '');
            if (this.objectiondata.FILE_URL != null) {
              this.attachment1 = false;
            }
            this.SpinningRejection = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.SpinningRejection = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.objectiondata.FILE_URL = null;
    }
  }
  isVisible2 = false;
  openpdf() {
    // window.open(this.fileExt);
    this.isVisible2 = true;
    // var a = this.imgurl + 'idProof/' + link;
    const a =
      './assets/ACCEPTNCE OF GOVERNMENT ACCOMMODATION ALLOTTED BY INCOME TAX DEPARTMENT.pdf';
    this.sanitizedLink1 = this.dom.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink1;
  }
  deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

  handleOkpdf(): void {
    this.isVisible2 = false;
  }

  handleCancelpdf(): void {
    this.isVisible2 = false;
  }
  showcard = false;
  show = false;
  onGetLeaves1() {
    this.show = !this.show;
    this.showcard = true;
  }
  // onGetLeave() {
  //   this.show = !this.show;
  //   this.showcard = false;
  // }

  isRecordLoading = false;
  timeLeft: string = '0:0:0:0';
  timer: any;
  countdowndisable = true;
  employeeID: any;
  nowdate = new Date();
  month1: any;
  year: any;
  allotmentdata: any = [];
  flatarrlist: any = [];
  Timmerloop: any = [];
  i = 0;
  Timmerstartloop: any = [];
  Timmerendloop: any = [];
  ngOnInit() {
    this.api.getemployeeresidencetype(0, 0, '', 'asc', '').subscribe(
      (data) => {
        if (data['code'] == '200') {
          this.ResidenceTypelist = data['data'];
        }
      },
      (error) => {
        console.error(error, 'Employee Residence Type');
      }
    );

    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    this.selectFromMonth[0] = lastYearSameMonth;
    this.selectFromMonth[1] = endOfCurrentMonth;
    this.selectFromMonth = [this.selectFromMonth[0], this.selectFromMonth[1]]

    this.search();
    // this.isRecordLoading=true
    //     this.api
    //       .getAllotementlistdraft(
    //         0,
    //         0,
    //         '',
    //         'asc',
    //         ' AND MONTH = ' +
    //           Number(Number(new Date().getMonth() + 1) + 1) +
    //           ' AND YEAR = ' +
    //           new Date().getFullYear()
    //       )
    //       .subscribe(
    //         (data) => {
    //           this.listview = data['data'];
    //           this.showHideReasonArray = new Array(this.listview.length).fill(
    //             false
    //           );
    //           this.isRecordLoading = false;
    //           if (this.listview.length <= 0) {
    //             this.message.info('No Order Generated Yet.', '');
    //           }
    //           this.isSpinning = false;
    //           if (this.listview.length > 0) {
    //             this.i = 2;
    //             this.Timmerstartloop.length = this.listview.length;
    //             this.Timmerendloop.length = this.listview.length;

    //             let timeremaining: any = [];
    //             let timeremaining2: any = [];
    //             timeremaining.length = this.listview.length;
    //             timeremaining2.length = this.listview.length;
    //             // starttimmer
    //             for (let ab = 0; ab < this.listview.length; ab++) {
    //               // let sapandate = this.listview[ab]['OBJ_END_TIME_PERIOD'];
    //               let startdate = this.listview[ab]['OBJ_START_DATE_TIME'];
    //               let targetDate = new Date(startdate); // Your datetime value should be assigned here

    //               let countdownInterval = setInterval(() => {
    //                 const currentDate = new Date();
    //                 timeremaining[ab] =
    //                   targetDate.getTime() - currentDate.getTime();

    //                 const seconds = Math.floor(timeremaining[ab] / 1000);
    //                 const minutes = Math.floor(seconds / 60);
    //                 const hours = Math.floor(minutes / 60);
    //                 const days = Math.floor(hours / 24);
    //                 // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
    //                 this.Timmerstartloop[ab] =
    //                   (days % 24) +
    //                   ':' +
    //                   (hours % 24) +
    //                   ':' +
    //                   (minutes % 60) +
    //                   ':' +
    //                   (seconds % 60);
    //                 if (timeremaining[ab] <= 0) {
    //                   this.countdowndisable = false;
    //                   clearInterval(countdownInterval);
    //                   this.i = 2;
    //                   this.Timmerstartloop[ab] = 0;

    //                   timeremaining[ab] = 0;
    //                 }
    //               }, 1000);
    //             }

    //             // endtimmer
    //             for (let cc = 0; cc < this.listview.length; cc++) {
    //               let sapandate = this.listview[cc]['OBJ_END_DATE_TIME'];
    //               let targetDate = new Date(sapandate); // Your datetime value should be assigned here
    //               // let startdate = this.listview[cc]['OBJ_START_DATE_TIME'];
    //               // const startdatet = new Date(startdate);

    //               let countdownInterval1 = setInterval(() => {
    //                 const currentDate = new Date();
    //                 timeremaining2[cc] =
    //                   targetDate.getTime() - currentDate.getTime();

    //                 const seconds = Math.floor(timeremaining2[cc] / 1000);
    //                 const minutes = Math.floor(seconds / 60);
    //                 const hours = Math.floor(minutes / 60);
    //                 const days = Math.floor(hours / 24);
    //                 // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
    //                 this.Timmerendloop[cc] =
    //                   (days % 24) +
    //                   ':' +
    //                   (hours % 24) +
    //                   ':' +
    //                   (minutes % 60) +
    //                   ':' +
    //                   (seconds % 60);
    //                 if (timeremaining2[cc] <= 0) {
    //                   this.countdowndisable = false;
    //                   clearInterval(countdownInterval1);
    //                   this.i = 2;
    //                   this.Timmerendloop[cc] = 0;

    //                   timeremaining2[cc] = 0;
    //                 }
    //               }, 1000);
    //             }
    //           }
    //         },
    //         (err) => {
    //
    //           this.isSpinning = false;
    //         }
    //       );
    //       this.listview.IS_FINAL=1
  }

  RESIDENCE_TYPE: any;
  listview: any = [];
  isSpinning: boolean = false;
  ResidenceType: any = [];
  ObjectionDataList: any = [];
  Senioritylistid: any;
  Datenew = new Date();
  arrayofflat: any = [];
  // month: any;
  // year: any;
  filterkey: string = '';

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible1: boolean = false;
  printOrderModalCancel1() {
    this.printOrderModalVisible1 = false;
  }
  printOrderModalVisible = false;
  view = 0;
  getchange = '';

  viewAssumptionPDF(pdfURL: string): void {
    const fileUrl = this.api.retriveimgUrl + 'draftAllotmentList/' + pdfURL;
    window.open(fileUrl);
    // window.open('')
    // this.getchange = '';
    // // this.view = 1;
    // this.getchange = this.getS(pdfURL);
    // this.printOrderModalVisible = true;
  }

  getS(link: string) {
    var a = '';
    // if (this.view == 1) {
    a = this.api.retriveimgUrl + 'draftAllotmentList/' + link;
    // }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  clear1() {
    this.objectiondata.FILE_URL = null;
    this.fileURL = null;
  }

  showHideReason(index: number) {
    this.showHideReasonArray[index] = !this.showHideReasonArray[index];
    // this.getobjectionmastertt();
  }

  showid: any;
  showstatus(event: any, i) {
    sessionStorage.setItem('DRAFT_MASTER_ID', event.ID);
    // this.logdata=[];
    this.showid = i;
    // this.logs=event;
    this.api
      .getAllotementObjection(
        0,
        0,
        '',
        'desc',
        ' AND EMP_ID = ' +
        Number(sessionStorage.getItem('userId')) +
        ' AND DRAFT_ALLOTMENT_ID = ' +
        event.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.ObjectionDataList = data['data'];
          } else {
            this.message.error('Something Went Wrong', '');
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }

  onGetLeave() {
    this.show = !this.show;
    this.showcard = false;
    this.showid = null;
  }
  final;
  drawerData;
  finalList;
  // showfinal(data:AllotmentObjection1,pdfURL: string,event: any)
  // {
  //   this.drawerData = Object.assign({}, data);
  //     this.api.getFinalAllotementlist(
  //       0,
  //       0,
  //       '',
  //       'asc',
  //       ' AND DRAFT_ALLOTMENT_MASTER_ID = ' +event.ID
  //        +' AND RESIDENCE_TYPE_ID='+this.drawerData.RESIDENCE_TYPE_ID
  //     )
  //     .subscribe(
  //       (data) => {
  //         if(data['code']==200){
  //           this.final=data['data'][0]
  //         }
  //       })
  //       this.getchange1 = '';
  //     // this.view = 1;
  //     this.getchange1 = this.getS2(pdfURL);

  //       this.printOrderModalVisible1=true
  //   }
  // getS2(link: string) {
  //   var a = '';
  //   // if (this.view == 1) {
  //   a = this.api.retriveimgUrl + 'finalAllotmentList/' + link;
  //   // }
  //   this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
  //   return this.sanitizedLink;
  // }
  // getchange1

  showfinal(data: AllotmentObjection1, event: any) {
    this.drawerData = Object.assign({}, data);
    this.api
      .getFinalAllotementlist(
        0,
        0,
        '',
        'asc',
        ' AND DRAFT_ALLOTMENT_MASTER_ID = ' +
        event.ID +
        ' AND RESIDENCE_TYPE_ID=' +
        this.drawerData.RESIDENCE_TYPE_ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.final = data['data'][0]['FILE_URL'];
          this.showmobfile();
        }
      });
  }
  showmobfile() {
    const fileUrl = this.api.retriveimgUrl + 'finalAllotmentList/' + this.final;
    window.open(fileUrl);
  }
  showmobfile1(pdfURL: string) {
    const fileUrl = this.api.retriveimgUrl + 'draftAllotmentList/' + pdfURL;
    window.open(fileUrl);
  }

  RESIDENCE_TYPE_ID: any = [];
  joinedResidencetype: any;
  ResidenceTypelist: any = [];
  datenew: any = new Date();
  selectFromMonth: any = [];
  // selectToMonth: any = new Date(
  //   this.datenew.getFullYear(),
  //   this.datenew.getMonth()
  // );
  selectyear: any = new Date();
  isFilterApplied: any = 'default';
  // isSpinning = false;
  MONTH1: any;
  MONTH2: any;
  YEAR1: any;
  filterClass: string = 'filter-invisible';
  Filterquery = '';
  changetostring($event) {
    this.joinedResidencetype = '';
    this.joinedResidencetype = this.RESIDENCE_TYPE_ID.join(',');
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  applyFilter() {
    // if (this.RESIDENCE_TYPE_ID.length == 0) {
    //   this.message.error('Please Select Residence Type', '');
    // }
    // else
    if (
      this.selectFromMonth == null ||
      this.selectFromMonth == undefined ||
      this.selectFromMonth == ''
    ) {
      this.message.error('Please Select From Month', '');
    }
    //  else if (
    //   this.selectToMonth == null ||
    //   this.selectToMonth == undefined ||
    //   this.selectToMonth == ''
    // ) {
    //   this.message.error('Please Select To Month', '');
    // } else if (
    //   this.selectyear == null ||
    //   this.selectyear == undefined ||
    //   this.selectyear == ''
    // ) {
    //   this.message.error('Please Select Year', '');
    // }
    else {
      // this.MONTH1 = this.datepipe.transform(this.selectFromMonth, 'MM');
      // this.MONTH2 = this.datepipe.transform(this.selectToMonth, 'MM');
      // this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');
      this.isFilterApplied = 'primary';
      this.search();
    }
  }
  // datenew: any = new Date();
  clearFilter() {
    this.RESIDENCE_TYPE_ID = [];
    // this.MONTH1 = '';
    // this.MONTH2 = '';
    // this.YEAR1 = '';
    this.datenew = new Date();
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    this.selectFromMonth[0] = lastYearSameMonth;
    this.selectFromMonth[1] = endOfCurrentMonth;
    this.selectFromMonth = [this.selectFromMonth[0], this.selectFromMonth[1]]

    this.selectyear = new Date();
    this.search();
    this.isFilterApplied = 'default';
  }
  // isSpinning = false;
  search() {
    // this.MONTH1 = this.datepipe.transform(this.selectFromMonth, 'MM');
    // this.MONTH2 = this.datepipe.transform(this.selectToMonth, 'MM');
    // this.YEAR1 = this.datepipe.transform(this.selectyear, 'yyyy');

    if (
      this.selectFromMonth != null &&
      this.selectFromMonth != undefined &&
      this.selectFromMonth != '' &&
      this.RESIDENCE_TYPE_ID != undefined &&
      this.RESIDENCE_TYPE_ID != null &&
      this.RESIDENCE_TYPE_ID != ''
    ) {
      this.selectFromMonth[0] = this.datepipe.transform(
        this.selectFromMonth[0],
        'yyyy-MM-dd'
      );
      this.selectFromMonth[1] = this.datepipe.transform(
        this.selectFromMonth[1],
        'yyyy-MM-dd'
      );
      this.Filterquery =
        " AND FILTER_DATE BETWEEN '" +
        this.selectFromMonth[0] +
        "' AND '" +
        this.selectFromMonth[1] +
        "' AND RESIDENCE_TYPE_ID IN (" +
        this.joinedResidencetype +
        ')';
      this.isRecordLoading = true;
      this.api
        .getAllotementlistdraft(0, 0, '', 'asc', this.Filterquery)
        .subscribe(
          (data) => {
            this.listview = data['data'];
            this.filterClass = 'filter-invisible';
            this.showHideReasonArray = new Array(this.listview.length).fill(
              false
            );
            this.isRecordLoading = false;
            if (this.listview.length <= 0) {
              this.message.info('No Order Generated Yet.', '');
            }
            this.isSpinning = false;
            if (this.listview.length > 0) {
              this.i = 2;
              this.Timmerstartloop.length = this.listview.length;
              this.Timmerendloop.length = this.listview.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.listview.length;
              timeremaining2.length = this.listview.length;
              // starttimmer
              for (let ab = 0; ab < this.listview.length; ab++) {
                // let sapandate = this.listview[ab]['OBJ_END_TIME_PERIOD'];
                let startdate = this.listview[ab]['OBJ_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining[ab] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerstartloop[ab] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining[ab] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval);
                    this.i = 2;
                    this.Timmerstartloop[ab] = 0;
                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }

              // endtimmer
              for (let cc = 0; cc < this.listview.length; cc++) {
                let sapandate = this.listview[cc]['OBJ_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                // let startdate = this.listview[cc]['OBJ_START_DATE_TIME'];
                // const startdatet = new Date(startdate);

                let countdownInterval1 = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining2[cc] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining2[cc] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerendloop[cc] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining2[cc] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval1);
                    this.i = 2;
                    this.Timmerendloop[cc] = 0;
                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      this.listview.IS_FINAL = 1;
    } else {
      this.selectFromMonth[0] = this.datepipe.transform(
        this.selectFromMonth[0],
        'yyyy-MM-dd'
      );
      this.selectFromMonth[1] = this.datepipe.transform(
        this.selectFromMonth[1],
        'yyyy-MM-dd'
      );
      this.Filterquery =
        " AND FILTER_DATE BETWEEN '" +
        this.selectFromMonth[0] +
        "' AND '" +
        this.selectFromMonth[1] +
        "'";
      this.isRecordLoading = true;
      this.api
        .getAllotementlistdraft(0, 0, '', 'asc', this.Filterquery)
        .subscribe(
          (data) => {
            this.listview = data['data'];
            this.filterClass = 'filter-invisible';
            this.showHideReasonArray = new Array(this.listview.length).fill(
              false
            );
            this.isRecordLoading = false;
            if (this.listview.length <= 0) {
              this.message.info('No Order Generated Yet.', '');
            }
            this.isSpinning = false;
            if (this.listview.length > 0) {
              this.i = 2;
              this.Timmerstartloop.length = this.listview.length;
              this.Timmerendloop.length = this.listview.length;

              let timeremaining: any = [];
              let timeremaining2: any = [];
              timeremaining.length = this.listview.length;
              timeremaining2.length = this.listview.length;
              // starttimmer
              for (let ab = 0; ab < this.listview.length; ab++) {
                // let sapandate = this.listview[ab]['OBJ_END_TIME_PERIOD'];
                let startdate = this.listview[ab]['OBJ_START_DATE_TIME'];
                let targetDate = new Date(startdate); // Your datetime value should be assigned here

                let countdownInterval = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining[ab] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining[ab] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerstartloop[ab] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining[ab] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval);
                    this.i = 2;
                    this.Timmerstartloop[ab] = 0;
                    timeremaining[ab] = 0;
                  }
                }, 1000);
              }

              // endtimmer
              for (let cc = 0; cc < this.listview.length; cc++) {
                let sapandate = this.listview[cc]['OBJ_END_DATE_TIME'];
                let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                // let startdate = this.listview[cc]['OBJ_START_DATE_TIME'];
                // const startdatet = new Date(startdate);

                let countdownInterval1 = setInterval(() => {
                  const currentDate = new Date();
                  timeremaining2[cc] =
                    targetDate.getTime() - currentDate.getTime();

                  const seconds = Math.floor(timeremaining2[cc] / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  const days = Math.floor(hours / 24);
                  // this.Timmerloop[ab] = '( Time Left: ' + (days % 24) + ':' + (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + ' )';
                  this.Timmerendloop[cc] =
                    (days % 24) +
                    ' Day : ' +
                    (hours % 24) +
                    ' Hrs : ' +
                    (minutes % 60) +
                    ' Min : ' +
                    (seconds % 60) +
                    ' Sec';
                  if (timeremaining2[cc] <= 0) {
                    this.countdowndisable = false;
                    clearInterval(countdownInterval1);
                    this.i = 2;
                    this.Timmerendloop[cc] = 0;
                    timeremaining2[cc] = 0;
                  }
                }, 1000);
              }
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      this.listview.IS_FINAL = 1;
    }
  }

  clearFilterresidencetype() {
    this.RESIDENCE_TYPE_ID = null;
    this.applyFilter();
  }

  frommonth = false;
  clearFilterfrommonth() {
    this.datenew = new Date();
    this.selectFromMonth[0] = new Date(
      this.datenew.getFullYear(),
      this.datenew.getMonth(),
      1
    );
    this.selectFromMonth[1] = new Date(
      this.datenew.getFullYear(),
      this.datenew.getMonth() + 1,
      0
    );
    this.applyFilter();
    this.frommonth = false;
  }
  formmonthchange($event) {
    let dddate = new Date();
    let frmonth = new Date(dddate.getFullYear(), dddate.getMonth());
    if (this.selectFromMonth != frmonth) {
      this.frommonth = true;
    } else {
      this.frommonth = false;
    }
  }

  tomonth = false;
  clearFiltertomonth() {
    let tmonth = new Date();
    // this.selectToMonth = new Date(
    //   tmonth.getFullYear(),
    //   tmonth.getMonth()
    // );
    this.applyFilter();
    this.tomonth = false;
  }

  tomonthchange($event) {
    let dddate = new Date();
    let tomonth = new Date(dddate.getFullYear(), dddate.getMonth());
    // if (this.selectToMonth != tomonth) {
    //   this.tomonth = true;
    // } else {
    //   this.tomonth = false;
    // }
  }

  yearfilter = false;
  clearFilterYear() {
    let tmonth = new Date();
    this.selectyear = new Date();
    this.applyFilter();
    this.yearfilter = false;
  }
  yearchange($event) {
    let dddate = new Date();
    let tomonth = new Date();
    if (this.selectyear != tomonth) {
      this.yearfilter = true;
    } else {
      this.yearfilter = false;
    }
  }

  onChangemonth(result: any): void {
    // let fromdate :any = new Date(result[0].getFullYear(),result[0].getMonth(),1);
    // let Todate :any = new Date(result[1].getFullYear(), result[1].getMonth()+1, 0);
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
}
