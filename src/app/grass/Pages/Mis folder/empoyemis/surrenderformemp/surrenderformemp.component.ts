import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpEventType } from '@angular/common/http';
import { SurrenderempMaster } from '../surrenderemp';

@Component({
  selector: 'app-surrenderformemp',
  templateUrl: './surrenderformemp.component.html',
  styleUrls: ['./surrenderformemp.component.css'],
  providers: [DatePipe]
})
export class SurrenderformempComponent implements OnInit{
  @Input() empid: any;
  @Input() employerecordfilled!: boolean;
  @Input() isdraweropendedggg: boolean = false;
  @Input() drawerClose;
  @Input() stage!: number;
  @Input() data: any = new SurrenderempMaster();
  @Input() dataass: any = new SurrenderempMaster();


  todaysdate = new Date();

  sampletext: any = '';
  isagreedisable1 = true;
  isotpSpinning: boolean = false;

  disableprevious: boolean = false;
  disablenext: boolean = false;
  printOrderModalVisible = false;
  view = 0;
  viewPdfSafe: any;
  isSpinning = false;
  date: any;
  datacount: any;
  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    if (this.isdraweropendedggg == true) {
      this.isSpinning=true;
      this.api
        .getsurrenderemp(
          0,
          0,
          'ID',
          'desc',
          ' AND FINAL_FLAT_TAKEN_ID = ' + this.data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.data = data['data'][0];
              this.datacount = data['count'];
      this.isSpinning=false;

              if (data['data'].length > 0) {
                this.sampletext = data['data'][0]['SURRENDER_TEXT'];
              }
            }else{
              this.isSpinning=false;
              this.message.error("Something went wrong, Please try again later","");
            }
          },
          (err) => {
      this.isSpinning=false;
this.message.error("Something went wrong, Please try again later","");
          });
    }

  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '120px',
    //  minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Type your message here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['undo','redo','strikeThrough','subscript','superscript','justifyLeft','justifyCenter','justifyRight','justifyFull','indent','outdent','insertUnorderedList','insertOrderedList'],['textColor','backgroundColor','customClasses','link','unlink','insertImage','insertVideo','insertHorizontalRule','removeFormat','toggleEditorMode']]
  };
  caretakervacationmodal = false;
  opencaretakervacationmodal() {
    this.caretakervacationmodal = true;
  }
  cancelcaretakervacationmodal() {
    this.caretakervacationmodal = false;
  }
  pdfDownloaddraft = false;
  downloadPdfdraft() {
    this.pdfDownloaddraft = true;
    const element = document.getElementById('printpageform1');
    const opt = {
      margin: 0.2,
      filename: 'Surrender Form.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    setTimeout(() => {
      this.pdfDownloaddraft = false;
    }, 5000)
  }

  close() {
    this.drawerClose();
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


  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  agrreconfirmation1() {
    this.isagreedisable1 = !this.isagreedisable1;
  }

  previous2() {
    if (this.stage > 0) {
      this.stage -= 1;
    }
    if (this.stage <= 0) {
      this.stage = 0;
    }
    this.isSpinning=true;
    this.progressBar = false;
    this.isagreedisable1 =true;
    this.api
      .getsurrenderemp(
        0,
        0,
        'ID',
        'desc',
        ' AND FINAL_FLAT_TAKEN_ID = ' + this.dataass.ID 
      )
      .subscribe(
        (data) => {
          this.data = data['data'][0];
          this.datacount = data['count'];
          this.isSpinning=false;
        },
        (err) => {
          this.isSpinning=false;
        }
      );
  }
  otherdd: any;
  selectd(d: any) {
    this.otherdd = d;
  }

  submitapplnon:boolean=false;
  savenextapp:boolean=false;
  nextUpload() {
    if(this.sampletext.length<=0){
      this.message.error("Please enter message regarding non-acceptance",'')
    }else{
      if (this.datacount > 0) {
        this.data.SURRENDER_STEP_NO = '0';
        this.data.SURRENDER_PRINT_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.data.EMP_ID = this.data.EMP_ID;
        this.data.FLAT_ID = this.data.FLAT_ID;
        // this.data.FINAL_FLAT_TAKEN_ID = this.data.ID;
        this.data.SURRENDER_TEXT = this.sampletext;
        this.data.SURRENDER_SEND_TO_CARETAKER = 0;
        if(this.dataass.SURRENDER_CARETAKER_STATUS=='R' || this.dataass.SURRENDER_INSPECTOR_STATUS=='R'){
          // this.data.SURRENDER_CARETAKER_STATUS = 'P'
          // this.data.SURRENDER_INSPECTOR_STATUS = 'P'
          this.data.SURRENDER_CARETAKER_REMARK = null;
          this.data.SURRENDER_INSPECTOR_REMARK = null;
          this.data.SURRENDER_SEND_TO_INSPECTOR=0;
          this.data.SURRENDER_CARETAKER_APPROVED_DATE_TIME = null;
          this.data.SURRENDER_INSPECTOR_APPROVED_DATE_TIME=null;
          this.data.SURRENDER_INSPECTOR_ID=null;
          // this.data.SURRENDER_PRINT_DATE_TIME=null;
          // this.data.SURRENDER_FORM_SUBMITTED_DATE_TIME=null;
          this.data.IS_REAPPLY=1;
        }
  
  this.savenextapp=true;
        this.api.updatesurrenderemp(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
  
            this.message.success(' Information Updated Successfully...', '');
            this.api
              .getsurrenderemp(
                0,
                0,
                'ID',
                'desc',
                ' AND FINAL_FLAT_TAKEN_ID = ' + this.dataass.ID 
              )
              .subscribe(
                (data) => {
                  this.data = data['data'][0];
                  this.datacount = data['count'];
            this.stage = 1;
            this.savenextapp=false;
  
                  // if (this.data.SURRENDER_FORM != null) {
                  //   this.applnform = false;
                  // } else {
                  //   this.applnform = true;
                  // }
                },
                (err) => {
            this.savenextapp=false;
                }
              );
  
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
            this.savenextapp=false;
          }
        },err=>{
          this.savenextapp=false;
          this.message.error('Failed To Update Information...', '');
        });
      } else {
        this.dataass.SURRENDER_STEP_NO = 0;
        this.dataass.SURRENDER_PRINT_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        this.dataass.EMP_ID = this.dataass.EMP_ID;
        this.dataass.FLAT_ID = this.dataass.FLAT_ID;
        this.dataass.FINAL_FLAT_TAKEN_ID = this.dataass.ID;
        this.dataass.CLIENT_ID = 1;
        this.dataass.SURRENDER_TEXT = this.sampletext;
        this.dataass.SURRENDER_CARETAKER_STATUS = 'P'
  
        this.savenextapp=true;
  
        this.api.Createsurrenderemp(this.dataass).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.api
              .getsurrenderemp(
                0,
                0,
                'ID',
                'desc',
                ' AND FINAL_FLAT_TAKEN_ID = ' + this.dataass.ID
              )
              .subscribe(
                (data) => {
                  this.data = data['data'][0];
                  this.datacount = data['count'];
                  this.stage = 1;
                  this.savenextapp=false;
                  this.message.success(' Information Save Successfully...', '');
  
                  if (this.data.SURRENDER_FORM != null) {
                    this.applnform = false;
                  } else {
                    this.applnform = true;
                  }
                },
                (err) => {
                  this.savenextapp=false;
  
                }
              );
  
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
            this.savenextapp=false;
  
          }
        },err=>{          
          this.savenextapp=false;
          this.message.error(' Failed To Save Information...', '');
  
        });
      }
    }
  }


  // imgurl = appkeys.retriveimgUrl;



  progressBar: boolean = false
  percent = 0
  timer: any
  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;
  subsurforms:boolean=false;
  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.appnPDF = <File>event.target.files[0];
      // this.isSpinning = true
     this.subsurforms = true;
      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.data.SURRENDER_FORM != undefined &&
          this.data.SURRENDER_FORM.trim() != ''
        ) {
          var arr = this.data.SURRENDER_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload2('surrenderForm', this.appnPDF, this.urlappnPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * res.loaded / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
     this.subsurforms = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && (res.status != 200)) {
            this.message.error('Failed To Upload Surrender Form ', '');
            this.progressBar = false;
            this.percent = 0;
            this.data.SURRENDER_FORM = null;
     this.subsurforms = false;

          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.SURRENDER_FORM = this.urlappnPdf;
     this.subsurforms = false;

              this.message.success('Surrender Form Uploaded Successfully', '');
            }
          }
          if (this.data.SURRENDER_FORM != null) {
            this.applnform = false;
          } else {
            this.applnform = true;
          }
        },err=>{
          this.message.error('Failed To Upload Surrender Form ', '');
            this.progressBar = false;
            this.percent = 0;
            this.data.SURRENDER_FORM = null;
     this.subsurforms = false;
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.appnPDF = null;
      this.data.SURRENDER_FORM = null;
     this.subsurforms = false;

    }
  }


  applnformshow(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 6;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }

  // clearapplnform() {
  //   this.data.SURRENDER_FORM = null;
  //   this.applnform = true;
  //   this.progressBar = false
  // }
  clearapplnform(url: any, folder: any) {
    var datadelete = folder + '/' + url
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.SURRENDER_FORM = null;
          this.applnform = true;
          this.progressBar = false;
          this.percent = 0;
        } else {
          this.message.error('Failed to delete ID Proof', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete ID Proof', '');
      })
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
      var a: any = this.api.retriveimgUrl + 'surrenderForm/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }


  Submitapplication() {
    if (
      this.data.SURRENDER_FORM == null ||
      this.data.SURRENDER_FORM == undefined ||
      this.data.SURRENDER_FORM == ''
    ) {
      this.message.error('Please Upload Application Form', '');
    } else {
      this.data.IS_SURRENDER_FORM_SUBMITTED = 1;
      this.data.SURRENDER_STEP_NO = 1;
      this.data.SURRENDER_FORM_SUBMITTED_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.data.EMP_ID = this.data.EMP_ID;
      this.data.FLAT_ID = this.data.FLAT_ID;
      this.data.FINAL_FLAT_TAKEN_ID = this.dataass.ID;
      this.data.SURRENDER_CARETAKER_ID = this.dataass.CARETAKER_ID;
      this.data.SURRENDER_SEND_TO_CARETAKER = 1;
      if(this.dataass.SURRENDER_CARETAKER_STATUS=='R' || this.dataass.SURRENDER_INSPECTOR_STATUS=='R'){
        this.data.SURRENDER_CARETAKER_STATUS = 'P'
        this.data.SURRENDER_INSPECTOR_STATUS = 'P'
        this.data.SURRENDER_CARETAKER_REMARK = null;
        this.data.SURRENDER_INSPECTOR_REMARK = null;
        this.data.SURRENDER_SEND_TO_INSPECTOR=0;
        this.data.SURRENDER_CARETAKER_APPROVED_DATE_TIME = null;
        this.data.SURRENDER_INSPECTOR_APPROVED_DATE_TIME=null;
        this.data.SURRENDER_INSPECTOR_ID=null;
        this.data.SURRENDER_PRINT_DATE_TIME=null;
        this.data.IS_REAPPLY=0;
      }
      this.data.IS_REAPPLY=0;

      this.submitapplnon=true;

      this.api.updatesurrenderemp(this.data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Surrender Form Submitted Successfully...', '');
          this.Rulesandapply = false;
      this.submitapplnon=false;

          this.drawerClose();
        }
        else {
          this.Rulesandapply = true;
      this.submitapplnon=false;
      this.message.error('Failed to submit surrender form', '');

        }
      },err=>{
        this.Rulesandapply = true;
        this.submitapplnon=false;
        this.message.error('Failed to submit surrender form', '');
      });
    }
  }

  cancelappliactionform() {
    this.Rulesandapply = false;
  }

  Rulesandapply = false;
  agrreconfirmation() {
    this.Rulesandapply = true;
  }
  handleOkform(): void {
    if (
      this.data.SURRENDER_FORM == null ||
      this.data.SURRENDER_FORM == undefined ||
      this.data.SURRENDER_FORM == ''
    ) {
      this.message.error('Please Upload Surrender Form', '');
    } else if (this.isagreedisable1) {
      this.message.info('Please review and accept the following terms and conditions, To proceed with your application', '');
    } else {
      this.Rulesandapply = true;
    }
  }
}