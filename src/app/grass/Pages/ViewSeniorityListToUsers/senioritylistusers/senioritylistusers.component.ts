import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { FlatPreferenceadd } from 'src/app/grass/Models/FlatPreferenceadd';
import { ObjectionMaster } from 'src/app/grass/Models/ObjectionMaster';
import { SeniorityListUsershow } from 'src/app/grass/Models/SeniorityListUsershow';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-senioritylistusers',
  templateUrl: './senioritylistusers.component.html',
  styleUrls: ['./senioritylistusers.component.css'],
  providers: [DatePipe],
})
export class SenioritylistusersComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: AllotmentMaster;

  objectiondata: ObjectionMaster = new ObjectionMaster();

  RESIDENCE_TYPE: any;
  listview: any = [];
  isSpinning: boolean = false;
  ResidenceType: any = [];
  ObjectionDataList: any = [];
  Senioritylistid: any;
  Datenew = new Date();
  arrayofflat: any = [];
  month: any;
  year: any;
  filterkey: string = '';

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.month = this.datepipe.transform(this.Datenew, 'MM');
    this.year = this.datepipe.transform(this.Datenew, 'yyyy');
    this.getResidenceType();
  }

  getflatpreference() {
    this.api
      .getFlatPreference(
        0,
        0,
        'PREFERNCE_NO',
        'asc',
        ' AND IS_SUBMITTED = "S" AND EMPLOYEE_ID = ' +
        this.data.EMPLOYEE_ID +
        ' AND FLAT_REQUEST_ID = ' +
        this.data.ID +
        ' AND TYPE = ' +
        this.RESIDENCE_TYPE
      )
      .subscribe(
        (data) => {
          this.arrayofflat = data['data'];
        },
        (error) => { }
      );
  }

  getResidenceType() {
    this.isSpinning = true;
    if (this.data) {
      this.api
        .residenceTypeRequest(
          0,
          0,
          '',
          '',
          ' AND FLAT_REQUEST_ID = ' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.ResidenceType = data['data'];
            this.isSpinning = false;
          }
        });
    }
  }

  timer: any;
  countdowndisable = true;
  ifstatusisA = true;
  getviewSenioritylist() {
    this.countdowndisable = true;
    this.timer = '';
    if (
      this.RESIDENCE_TYPE == null ||
      this.RESIDENCE_TYPE == undefined ||
      this.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      this.isSpinning = true;
      let applieddate = this.data['APPLICATION_DATETIME'];
      let appliedmonth = Number(this.datepipe.transform(applieddate, 'MM'));
      let applnyear = Number(this.datepipe.transform(applieddate, 'yyyy'));
      let senioritymonth = appliedmonth + 1;

      this.api
        .getSenioritylist(
          0,
          0,
          'ID',
          'desc',
          ' AND RESIDENCE_TYPE = ' +
          this.RESIDENCE_TYPE +
          ' AND MONTH = ' +
          senioritymonth +
          ' AND YEAR = ' +
          applnyear
        )
        .subscribe(
          (data) => {
            this.listview = data['data'];
            if (this.listview.length <= 0) {
              this.message.info('No Order Generated Yet.', '');
            }
            this.isSpinning = false;
            if (this.listview.length > 0) {
              this.Senioritylistid = this.listview[0]['ID'];
              let sapandate = this.listview[0]['OBJ_DATETIME_PERIOD'];

              this.api
                .getObjectionMaster(
                  0,
                  0,
                  'ID',
                  'desc',
                  ' AND EMPLOYEE_ID = ' +
                  this.data.EMPLOYEE_ID +
                  ' AND FLAT_REQUEST_ID = ' +
                  this.data.ID +
                  ' AND SENIORITY_LIST_ID =' +
                  this.Senioritylistid
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.ObjectionDataList = data['data'];
                      if (this.ObjectionDataList.length > 0) {
                        if (this.ObjectionDataList[0]['STATUS'] == 'A') {
                          this.ifstatusisA = false;
                        }
                      } else if (this.ObjectionDataList.length <= 0) {
                        this.ifstatusisA = true;
                      }
                      this.isSpinning = false;

                      let targetDate = new Date(sapandate); // Your datetime value should be assigned here
                      let timeRemaining: number; // Time remaining in milliseconds
                      // let countdownInterval: any; // Interval reference

                      let countdownInterval = setInterval(() => {
                        const currentDate = new Date();
                        timeRemaining =
                          targetDate.getTime() - currentDate.getTime();

                        const seconds = Math.floor(timeRemaining / 1000);
                        const minutes = Math.floor(seconds / 60);
                        const hours = Math.floor(minutes / 60);
                        const days = Math.floor(hours / 24);

                        // const formattedTime = {
                        //   days: days % 24,
                        //   hours: hours % 24,
                        //   minutes: minutes % 60,
                        //   seconds: seconds % 60
                        // };
                        this.timer =
                          '( Time Left: ' +
                          (days % 24) +
                          ':' +
                          (hours % 24) +
                          ':' +
                          (minutes % 60) +
                          ':' +
                          (seconds % 60) +
                          ' )';

                        if (timeRemaining <= 0) {
                          this.countdowndisable = false;
                          clearInterval(countdownInterval);
                          this.timer = '';
                          timeRemaining = 0;
                        }
                      }, 1000);
                    } else {
                      this.message.error('Something Went Wrong', '');
                    }
                  },
                  (err) => {
                    this.isSpinning = false;
                  }
                );

              this.getflatpreference();
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    }
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  getchange = '';
  viewAssumptionPDF(pdfURL: string): void {
    this.getchange = '';
    this.view = 1;
    this.getchange = this.getS(pdfURL);
    this.printOrderModalVisible = true;
  }

  sanitizedLink: any = '';
  getS(link: string) {
    var a = '';
    if (this.view == 1) {
      a = this.api.retriveimgUrl + 'seniorityLists/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  drawerVisibleobj: boolean = false;
  drawerTitleObjection = '';
  senddata: any;
  ViewObjection() {
    this.drawerTitleObjection = 'Objections History';
    this.drawerVisibleobj = true;
    this.senddata = this.ObjectionDataList;
  }

  get closeCallbackobj() {
    return this.drawerCloseobj.bind(this);
  }

  drawerCloseobj() {
    this.getviewSenioritylist();
    this.drawerVisibleobj = false;
  }

  RejectRemark: boolean = false;
  raiseObjection() {
    this.RejectRemark = true;
    this.objectiondata = new ObjectionMaster();
    if (this.objectiondata.ATTACHMENT1 != null) {
      this.attachment1 = false;
    } else {
      this.attachment1 = true;
    }
    if (this.objectiondata.ATTACHMENT2 != null) {
      this.attachment2pdf = false;
    } else {
      this.attachment2pdf = true;
    }
  }

  CancleRemark() {
    this.RejectRemark = false;
    this.objectiondata = new ObjectionMaster();
    this.getviewSenioritylist();
  }

  SubmitRemark() {
    this.objectiondata.EMPLOYEE_ID = this.data.EMPLOYEE_ID;
    this.objectiondata.SENIORITY_LIST_ID = this.Senioritylistid;
    this.objectiondata.FLAT_REQUEST_ID = this.data.ID;
    this.objectiondata.STATUS = 'P';
    //
    //

    if (
      this.objectiondata.REASON == null ||
      this.objectiondata.REASON == undefined ||
      this.objectiondata.REASON == ''
    ) {
      this.message.error(' Please Enter Reason for Objection', '');
    } else {
      this.api
        .createObjectionmaster(this.objectiondata)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Saved Successfully...', '');
            this.RejectRemark = false;
            this.objectiondata = new ObjectionMaster();
            this.getviewSenioritylist();
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
    }
  }

  SpinningRejection: boolean = false;
  transferFileURL: any;
  attachment1: boolean = true;
  urllink: any;
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
          this.objectiondata.ATTACHMENT1 != undefined &&
          this.objectiondata.ATTACHMENT1.trim() != ''
        ) {
          var arr = this.objectiondata.ATTACHMENT1.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('seniorityObjections', this.transferFileURL, this.urllink)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.objectiondata.ATTACHMENT1 = this.urllink;
            this.message.success('File Uploaded Successfully...', '');
            if (this.objectiondata.ATTACHMENT1 != null) {
              this.attachment1 = false;
            } else {
              this.attachment1 = true;
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
      this.objectiondata.ATTACHMENT1 = null;
    }
  }
  ATTACHMENT1clear() {
    this.objectiondata.ATTACHMENT1 = null;
  }

  transferFileURLallotment: any;
  attachment2pdf: boolean = true;
  urllink2: any;
  onFileAttachment2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.SpinningRejection = true;
      this.transferFileURLallotment = <File>event.target.files[0];

      if (this.transferFileURLallotment != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURLallotment.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink2 = url;
        if (
          this.objectiondata.ATTACHMENT2 != undefined &&
          this.objectiondata.ATTACHMENT2.trim() != ''
        ) {
          var arr = this.objectiondata.ATTACHMENT2.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload(
          'seniorityObjections',
          this.transferFileURLallotment,
          this.urllink2
        )
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.objectiondata.ATTACHMENT2 = this.urllink2;
            if (this.objectiondata.ATTACHMENT2 != null) {
              this.attachment2pdf = false;
            } else {
              this.attachment2pdf = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.SpinningRejection = false;
            // this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.SpinningRejection = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURLallotment = null;
      this.objectiondata.ATTACHMENT2 = null;
    }
  }

  ATTACHMENT2clear() {
    this.objectiondata.ATTACHMENT2 = null;
  }

  AttachedpdfsVisible: boolean = false;
  AttachedpdfsCancel() {
    this.AttachedpdfsVisible = false;
  }

  view1 = 0;
  viewattachedpdf = '';
  viewAssumptionAttached(pdfURL: string): void {
    this.viewattachedpdf = '';
    this.view1 = 11;
    this.AttachedpdfsVisible = true;
    this.viewattachedpdf = this.getS1(pdfURL);
  }
  ATTACHMENT2send(pdfURL: string): void {
    this.viewattachedpdf = '';
    this.view1 = 22;
    this.AttachedpdfsVisible = true;
    this.viewattachedpdf = this.getS1(pdfURL);
  }

  sanitizedLink12: any = '';
  getS1(link: string) {
    var a = '';
    if (this.view1 == 11) {
      a = this.api.retriveimgUrl + 'seniorityObjections/' + link;
    }
    if (this.view1 == 22) {
      a = this.api.retriveimgUrl + 'seniorityObjections/' + link;
    }

    this.sanitizedLink12 = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink12;
  }

  ////////////////////////////////// Quarter Preferences Drawer //////////////////////////////////////////////
  flatAvailablevisible: boolean = false;
  flatAvailabletitle = '';
  seniortiylistdata12: any;
  flatdata: any;
  emppdata: any;
  addpreference() {
    this.flatAvailabletitle = 'Add Quarter Preference';
    this.seniortiylistdata12 = Object.assign({}, this.listview[0]);
    this.emppdata = Object.assign({}, this.data);
    this.flatAvailablevisible = true;
  }

  get closecallflatavailable() {
    return this.flatAvailableclose.bind(this);
  }
  flatAvailableclose() {
    this.getviewSenioritylist();
    this.flatAvailablevisible = false;
  }
}
