import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { ObjectionMaster } from 'src/app/grass/Models/ObjectionMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-flatallotmentuserlist',
  templateUrl: './flatallotmentuserlist.component.html',
  styleUrls: ['./flatallotmentuserlist.component.css'],
})
export class FlatallotmentuserlistComponent {
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

  close() {
    this.drawerClose();
  }

  getflatpreference() {
    this.api
      .getFlatPreference(
        0,
        0,
        'PREFERNCE_NO',
        'asc',
        ' AND EMPLOYEE_ID = ' +
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
      // if (this.data.GRADE_PAY >= '1300' && this.data.GRADE_PAY <= '1800') {
      //   this.filterkey = 'AMOUNT IN (1300,1400,1600,1650,1800)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY >= '1900' && this.data.GRADE_PAY <= '2800') {
      //   this.filterkey =
      //     'AMOUNT IN (1300,1400,1600,1650,1800, 1900,2000, 2400,2800)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY >= '4200' && this.data.GRADE_PAY <= '4800') {
      //   this.filterkey =
      //     'AMOUNT IN (1300,1400,1600,1650,1800, 1900,2000, 2400,2800, 4200, 4600, 4800)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY >= '5400' && this.data.GRADE_PAY < '6600') {
      //   this.filterkey = 'AMOUNT IN (5400)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY == '6600') {
      //   this.filterkey = 'AMOUNT IN (5400,6600)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY >= '7600' && this.data.GRADE_PAY <= '8000') {
      //   this.filterkey = 'AMOUNT IN (7600,8000)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY >= '8700' && this.data.GRADE_PAY <= '8900') {
      //   this.filterkey = 'AMOUNT IN (7600,8000,8700,8900)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY == '10000') {
      //   this.filterkey = 'AMOUNT IN (10000)';
      //   this.getdetailsinfo();
      // } else if (
      //   this.data.GRADE_PAY >= '67000' &&
      //   this.data.GRADE_PAY <= '74999'
      // ) {
      //   this.filterkey = 'AMOUNT IN (10000,67000,74999)';
      //   this.getdetailsinfo();
      // } else if (
      //   this.data.GRADE_PAY >= '75000' &&
      //   this.data.GRADE_PAY <= '79999'
      // ) {
      //   this.filterkey = 'AMOUNT IN (10000,67000,74999,75000,79999)';
      //   this.getdetailsinfo();
      // } else if (this.data.GRADE_PAY >= '80000') {
      //   this.filterkey = 'AMOUNT IN (10000,67000,74999,75000,79999,80000)';
      //   this.getdetailsinfo();
      // }

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

  ifstatusisA = true;
  getviewSenioritylist() {
    if (
      this.RESIDENCE_TYPE == null ||
      this.RESIDENCE_TYPE == undefined ||
      this.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      let applieddate = this.data['APPLICATION_DATETIME'];
      let appliedmonth = Number(this.datepipe.transform(applieddate, 'MM'));
      let applnyear = Number(this.datepipe.transform(applieddate, 'yyyy'));
      let senioritymonth = appliedmonth + 1;
      this.isSpinning = true;
      this.api
        .getflatAllotmentMaster(
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
            this.isSpinning = false;
            if (this.listview.length <= 0) {
              this.message.info('No Order Generated Yet.', '');
            }
          },
          (err) => { }
        );
    }
  }

  // getdetailsinfo(){
  //   this.api
  //       .getGradPay(
  //         0,
  //         0,
  //         'ID',
  //         'desc',
  //         " AND "+this.filterkey
  //       )
  //       .subscribe(
  //         (data) => {
  //           if (data['code'] == 200) {
  //             let listofresidence = [];
  //             listofresidence = data['data'];
  //             function removeDuplicates(arr: any) {
  //               const uniqueObjects: any = [];
  //               const uniqueResidenceTypeIds = new Set();
  //               for (const obj of arr) {
  //                 if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
  //                   uniqueObjects.push(obj);
  //                   uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
  //                 }
  //               }
  //               return uniqueObjects;
  //             }
  //             const result = removeDuplicates(listofresidence);
  //             this.ResidenceType = result;
  //             this.isSpinning = false;
  //           }
  //         },
  //         (err) => {
  //
  //         }
  //       );
  // }

  // close(websitebannerPage: NgForm) {
  //   this.drawerClose();
  // }

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
      a = this.api.retriveimgUrl + 'flatAllocationList/' + link;
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
  }

  SubmitRemark() {
    this.objectiondata.EMPLOYEE_ID = this.data.EMPLOYEE_ID;
    this.objectiondata.SENIORITY_LIST_ID = this.Senioritylistid;
    this.objectiondata.FLAT_REQUEST_ID = this.data.ID;
    this.objectiondata.STATUS = 'P';

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
