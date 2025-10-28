import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { HttpEventType } from '@angular/common/http';
import { ChangeFlatempMaster } from '../changeflatmaster';
import { ChangeFlatCreateMaster } from '../changeflatCreateMaster';

@Component({
  selector: 'app-changeflatdrawer',
  templateUrl: './changeflatdrawer.component.html',
  styleUrls: ['./changeflatdrawer.component.css'],
  providers: [DatePipe]
})
export class ChangeflatdrawerComponent implements OnInit {
  @Input() empid: any;
  @Input() employerecordfilled!: boolean;
  @Input() isdraweropendedggg: boolean = false;
  @Input() drawerClose;
  @Input() stage!: number;
  @Input() data: any = new ChangeFlatCreateMaster();
  @Input() datastatic: any = new ChangeFlatCreateMaster();
  dCHANGE_REASON_TYPE: any;
  dCHANGE_REASON: any;
  dCHANGE_RESIDENCE_TYPE_ID: any;
  checkthevalidation: boolean = false;
  Changeflatpurpose: any;
  showbuttons: boolean = false;
  isotpSpinning: boolean = false;
  todaysdate = new Date();

  disableprevious: boolean = false;
  disablenext: boolean = false;
  printOrderModalVisible = false;
  view = 0;
  viewPdfSafe: any;
  isagreedisable1 = true;
  isSpinning = false;
  date: any;
  Designationtypes: any = [];
  RecidenceList1: any = [];
  showotheroption: boolean = false;
  otherpurpose: any;
  changereason: any;
  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    if (this.isdraweropendedggg == true && this.datastatic.CHANGE_REASON_TYPE == null) {
      this.checkthevalidation = true;
      this.api.getemployeeresidencetype(0, 0, '', 'asc', '')
        .subscribe(data => {
          if (data['code'] == '200') {
            this.RecidenceList1 = data['data'];
          }
        },
          (error) => {
          }
        );
    }
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  alphaOnly(event) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }
  close() {
    this.drawerClose();
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  agrreconfirmation1() {
    this.isagreedisable1 = !this.isagreedisable1;
  }
  previous2() {
    this.submitapplnon = true;
    this.api
      .getfinalflattakenEmployeeLists(
        0,
        0,
        'ID',
        'desc',
        " AND STATUS = 'Y' AND TAKEN_STATUS = 'A' AND INSPECTOR_STATUS = 'A' AND EMP_ID=" + Number(sessionStorage.getItem('userId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (this.stage > 0) {
              this.stage -= 1;
            }
            if (this.stage <= 0) {
              this.stage = 0;
            }
            this.isSpinning = false;
            this.submitapplnon = false;
            this.datastatic = data['data'][0];
          }
        },
        (err) => {
          this.isSpinning = false;
          this.submitapplnon = false;
        }
      );


    // this.api
    // .getchangeemp(
    //   0,
    //   0,
    //   'ID',
    //   'desc',
    //   ' AND FINAL_FLAT_TAKEN_ID = ' + this.datastatic.ID 
    // )
    // .subscribe(
    //   (data) => {
    //     if (this.stage > 0) {
    //       this.stage -= 1;
    //     }
    //     if (this.stage <= 0) {
    //       this.stage = 0;
    //     }
    //     this.datastatic = data['data'][0];
    //     this.isSpinning=false;
    //     this.submitapplnon=false;
    //   },
    //   (err) => {
    //     this.isSpinning=false;
    //     this.submitapplnon=false;

    //   }
    // );
  }
  otherdd: any;
  selectd(d: any) {
    this.otherdd = d;
  }

  savenextapp: boolean = false;
  nextUpload() {
    this.savenextapp = true;
    this.api
      .getchangeemp(
        0,
        0,
        'ID',
        'desc',
        ' AND FINAL_FLAT_TAKEN_ID = ' + this.datastatic.ID
      )
      .subscribe(
        (data) => {
          this.data = data['data'][0];
          this.data.CHANGE_STEP_NO = '0';
          this.data.CHANGE_PRINT_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
          this.api.updatechangeemp(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Information Updated Successfully.', '');
              this.api
                .getchangeemp(
                  0,
                  0,
                  'ID',
                  'desc',
                  ' AND FINAL_FLAT_TAKEN_ID = ' + this.datastatic.ID
                )
                .subscribe(
                  (data) => {
                    this.data = data['data'][0];
                    this.stage = 1;
                    this.savenextapp = false;
                  },
                  (err) => {
                    this.savenextapp = false;
                  });
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
              this.savenextapp = false;
            }
          }, err => {
            this.savenextapp = false;
            this.message.error('Failed To Update Information...', '');
          });
        })
  }

  progressBar: boolean = false
  percent = 0
  timer: any
  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;

  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.appnPDF = <File>event.target.files[0];
      this.isSpinning = true
      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.data.CHANGE_FORM != undefined &&
          this.data.CHANGE_FORM.trim() != ''
        ) {
          var arr = this.data.CHANGE_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload2('changeFlatForm', this.appnPDF, this.urlappnPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * res.loaded / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && (res.status != 200)) {
            this.message.error('Failed To Upload Change of Accommodation Form', '');
            this.isSpinning = false
            this.progressBar = false;
            this.percent = 0;
            this.data.CHANGE_FORM = null
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.CHANGE_FORM = this.urlappnPdf;
              this.message.success('Change of Accommodation Form Uploaded Successfully...', '');
              this.isSpinning = false;
            }
          }
          if (this.data.CHANGE_FORM != null) {
            this.applnform = false;
          } else {
            this.applnform = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.appnPDF = null;
      this.data.CHANGE_FORM = null;
      this.isSpinning = false
    }
  }

  applnformshow(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 6;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }

  clearapplnform() {
    this.data.CHANGE_FORM = null;
    this.applnform = true;
    this.progressBar = false
  }

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'gradePayDrawnLetter/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'joiningAllotmentLetter/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'joiningLetter/' + link;
    }
    if (this.view == 4) {
      var a: any = this.api.retriveimgUrl + 'paySlips/' + link;
    }
    if (this.view == 5) {
      var a: any = this.api.retriveimgUrl + 'iCards/' + link;
    }
    if (this.view == 6) {
      var a: any = this.api.retriveimgUrl + 'applicationForm/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
  submitapplnon: boolean = false;
  Submitapplication() {
    if (
      this.data.CHANGE_FORM == null ||
      this.data.CHANGE_FORM == undefined ||
      this.data.CHANGE_FORM == ''
    ) {
      this.message.error('Please Upload Application Form', '');
    } else {
      this.data.IS_SUBMITTED = 1;
      this.data.CHANGE_STEP_NO = 1;
      this.data.APPLIED_FOR_CHANGE_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.data.FINAL_FLAT_TAKEN_ID = this.datastatic.ID;
      if (this.datastatic.CHANGE_INSPECTOR_STATUS == 'R') {
        this.data.CHANGE_INSPECTOR_REMARK = null;
        this.data.CHANGE_INSPECTOR_STATUS = 'P'
        this.data.CHANGE_INSPECTOR_APPROVED_DATE_TIME = null;
      }
      this.submitapplnon = true;

      this.api.updatechangeemp(this.data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Change of Accommodation Form Submitted Successfully...', '');
          this.Rulesandapply = false;
          this.submitapplnon = false;
          this.drawerClose();
        }
        else {
          this.Rulesandapply = true;
          this.submitapplnon = false;
          this.message.error('Failed to Submit Change of Accommodation Form', '');

        }
      }, err => {
        this.Rulesandapply = true;
        this.submitapplnon = false;
        this.message.error('Failed to Submit Change of Accommodation Form', '');

      });
    }
  }
  cancelappliactionform() {
    this.Rulesandapply = false;
  }
  cancelvaidationform() {
    this.Rulesandapply = false;
    this.checkthevalidation = false;
    this.drawerClose();

  }
  Rulesandapply = false;
  agrreconfirmation() {
    this.Rulesandapply = true;
  }
  handleOkform(): void {
    if (
      this.data.CHANGE_FORM == null ||
      this.data.CHANGE_FORM == undefined ||
      this.data.CHANGE_FORM == ''
    ) {
      this.message.error('Please Upload Acceptance Form', '');
    } else if (this.isagreedisable1) {
      this.message.info('Please review and accept the following terms and conditions, To proceed with your application', '');
    } else {
      this.Rulesandapply = true;
    }
  }
  recidence: any;
  selectrecidence(datar: any) {
    this.recidence = datar;
  }
  oreason(odata: any) {
    this.otherpurpose = odata;
  }
  createapplication: boolean = false;
  checkthevalidationsubmit() {
    // this.recidence=2;
    this.checkthevalidation = true;
    if (this.changereason == null || this.changereason == undefined) {
      this.message.error("Please Select Quarter Change Purpose", "")
    } else if (this.changereason == 'O' && (this.otherpurpose == null || this.otherpurpose == undefined || this.otherpurpose == '')) {
      this.message.error("Please Enter Quarter Change Other Purpose", "")
    } else if (this.recidence == '' || this.recidence == null || this.recidence == undefined) {
      this.message.error("Please Select Residence Type", "")
    } else {
      this.data.CHANGE_RESIDENCE_TYPE_ID = this.recidence;
      if (this.changereason == 'O') {
        this.data.CHANGE_REASON = this.otherpurpose
      } else if (this.changereason == 'M') {
        this.data.CHANGE_REASON = 'Medical Purpose'
      } else {
        this.data.CHANGE_REASON = 'Building Maintenance'
      }
      this.data.CHANGE_REASON_TYPE = this.changereason;

      this.data.FINAL_FLAT_TAKEN_ID = this.datastatic.ID;
      this.data.EMP_ID = Number(sessionStorage.getItem('userId'));
      this.createapplication = true;
      this.api.Createchangeemp(this.data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success("Information submitted successfully", "")
          this.checkthevalidation = false;
          this.createapplication = false;
        } else if (successCode['code'] == '300') {
          this.message.error('You are not currently able to apply for change of accommodation Quarter', '');
          this.checkthevalidation = true;
          this.createapplication = false;
        } else {
          this.message.error('Failed To Save Information...', '');
          this.checkthevalidation = true;
          this.createapplication = false;
        }
      }, err => {
        this.message.error('Something went wrong, Please try again after some time', '');
        this.checkthevalidation = true;
        this.createapplication = false;
      });
    }
  }

  checkthevalidationcancelll() {
    this.checkthevalidation = false;
    this.showbuttons = false;
    this.drawerClose();
  }

  ifyesthen() {
    this.showbuttons = true;
  }
  flatpurposechange(data: any) {
    if (data == "O") {
      this.showotheroption = true;
    } else {
      this.showotheroption = false;
    }
    this.changereason = data;
  }
}