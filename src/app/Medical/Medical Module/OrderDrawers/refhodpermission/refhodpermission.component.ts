import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as html2pdf from 'html2pdf.js';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { SignatureMaster } from 'src/app/Medical/Models/SignatureMaster';

@Component({
  selector: 'app-refhodpermission',
  templateUrl: './refhodpermission.component.html',
  styleUrls: ['./refhodpermission.component.css'],
})
export class RefhodpermissionComponent implements OnInit {
  @Input() orderdata: any;
  @Input() HospitalMapping: any;
  // @Input() delayPermissionClaimData: any;
  @Input() queData: any;
  @Input() claimID: any;
  @Input() empID: any;
  @Input() drawerClose: Function;
  @Input() SECTION_TYPE: any;
  @Input() NAME: any;
  @Input() NAME_HN: any;
  @Input() OFFICE_NAME: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() POST: any;
  @Input() POST_HN: any;
  isSpinning: boolean = false;
  pdfDownload: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  claimHospitalMapping: any = [];

  Save() {
    this.isSpinning = true;
    this.claimHospitalMapping = [];
    for (var i = 0; this.HospitalMapping.length > i; i++) {
      var obj = Object.assign({}, this.HospitalMapping[i]);
      obj.ID = undefined;
      this.claimHospitalMapping.push(obj);
      // this.claimHospitalMapping[i]['CLAIM_ID'] = undefined;
      if (this.HospitalMapping.length == i + 1) {
        this.orderdata.hospitalData = this.claimHospitalMapping;
      }
    }

    if (
      this.queData.LETTER_DATE == undefined ||
      this.queData.LETTER_DATE == null ||
      this.queData.LETTER_DATE == ''
    ) {
      this.queData.LETTER_DATE = null;
      this.orderdata.LETTER_DATE = null;
    } else {
      this.queData.LETTER_DATE = this.datepipe.transform(
        this.queData.LETTER_DATE,
        'yyyy-MM-dd'
      );
    }

    if (
      this.queData.RECEIVED_DATE == undefined ||
      this.queData.RECEIVED_DATE == null ||
      this.queData.RECEIVED_DATE == ''
    ) {
      this.queData.RECEIVED_DATE = null;
      this.orderdata.RECEIVED_DATE = null;
    } else {
      this.queData.RECEIVED_DATE = this.datepipe.transform(
        this.queData.RECEIVED_DATE,
        'yyyy-MM-dd'
      );
    }

    if (
      this.queData.REFERRAL_DATE == undefined ||
      this.queData.REFERRAL_DATE == null ||
      this.queData.REFERRAL_DATE == ''
    ) {
      this.queData.REFERRAL_DATE = null;
      this.orderdata.REFERRAL_DATE = null;
    } else {
      this.queData.REFERRAL_DATE = this.datepipe.transform(
        this.queData.REFERRAL_DATE,
        'yyyy-MM-dd'
      );
    }

    if (
      this.queData.CLAIM_SUBMITTED_DATE == undefined ||
      this.queData.CLAIM_SUBMITTED_DATE == null ||
      this.queData.CLAIM_SUBMITTED_DATE == ''
    ) {
      this.queData.CLAIM_SUBMITTED_DATE = null;
      this.orderdata.CLAIM_SUBMITTED_DATE = null;
    } else {
      this.queData.CLAIM_SUBMITTED_DATE = this.datepipe.transform(
        this.queData.CLAIM_SUBMITTED_DATE,
        'yyyy-MM-dd'
      );
    }

    if (
      this.queData.CLAIM_FILLED_DATE == undefined ||
      this.queData.CLAIM_FILLED_DATE == null ||
      this.queData.CLAIM_FILLED_DATE == ''
    ) {
      this.queData.CLAIM_FILLED_DATE = null;
      this.orderdata.CLAIM_FILLED_DATE = null;
    } else {
      this.queData.CLAIM_FILLED_DATE = this.datepipe.transform(
        this.queData.CLAIM_FILLED_DATE,
        'yyyy-MM-dd'
      );
    }
    if (
      this.queData.BILL_SUBMISSION_DATE == undefined ||
      this.queData.BILL_SUBMISSION_DATE == null ||
      this.queData.BILL_SUBMISSION_DATE == ''
    ) {
      this.queData.BILL_SUBMISSION_DATE = null;
      this.orderdata.BILL_SUBMISSION_DATE = null;
    } else {
      this.queData.BILL_SUBMISSION_DATE = this.datepipe.transform(
        this.queData.BILL_SUBMISSION_DATE,
        'yyyy-MM-dd'
      );
    }

    this.orderdata['CLAIM_ID'] = this.orderdata.ID;
    this.api.updateQuestions(this.queData).subscribe((successCode) => {
      if (successCode.code == '200') {
        // this.message.success('Information updated Successfully','');

        for (let index = 0; index < this.HospitalMapping.length; index++) {
          this.HospitalMapping[index].CREATED_MODIFIED_DATE = '';
          this.HospitalMapping[index].IS_VISIBLE_IN_ORDER =
            this.HospitalMapping[index].IS_VISIBLE_IN_ORDER == true ? 1 : 0;
        }

        this.api
          .updateClaimEmployee(this.orderdata)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.api
                .updatebulk(this.HospitalMapping)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Information Changed Successfully...',
                      ''
                    );
                    this.openPrintOrderModal();
                    this.isSpinning = false;
                  } else {
                    this.message.error('Information Not Saved', '');
                  }
                });
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.message.error('Information Not Saved', '');
      }
    });
  }

  close(referanceHODPermissionPage: NgForm): void {
    referanceHODPermissionPage.form.reset();
    this.drawerClose();
  }
  printOrderModalVisible: boolean = false;

  openPrintOrderModal() {
    // this.api
    //   .getclaimMaster(
    //     0,
    //     0,
    //     '',
    //     '',
    //     ' AND ID=' + this.orderdata.ID,
    //     '',
    //     '',
    //     '',
    //     ''
    //   )
    //   .subscribe(
    //     (data) => {
    //       this.orderdata = data['data'][0];
    //     },
    //     (err) => {
    //       
    //     }
    //   );
    this.printOrderModalVisible = true;
  }

  printOrderModalCancel() {
    this.api
      .getclaimMaster(
        0,
        0,
        '',
        '',
        ' AND ID=' + this.orderdata.ID,
        '',
        '',
        '',
        ''
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.orderdata = data['data'][0];
            if (
              this.orderdata.CGHS_AMA_REFERENCE_DATE == undefined ||
              this.orderdata.CGHS_AMA_REFERENCE_DATE == null ||
              this.orderdata.CGHS_AMA_REFERENCE_DATE == '' ||
              this.orderdata.CGHS_AMA_REFERENCE_DATE.length == 0
            ) {
              this.orderdata.CGHS_AMA_REFERENCE_DATE = [];
            } else {
              this.orderdata.CGHS_AMA_REFERENCE_DATE =
                this.orderdata.CGHS_AMA_REFERENCE_DATE.split(',');
              // this.dateDifference();
            }
            if (
              this.orderdata.CGHS_AMA_REFERENCE_END_DATE == undefined ||
              this.orderdata.CGHS_AMA_REFERENCE_END_DATE == null ||
              this.orderdata.CGHS_AMA_REFERENCE_END_DATE == '' ||
              this.orderdata.CGHS_AMA_REFERENCE_END_DATE.length == 0
            ) {
              this.orderdata.CGHS_AMA_REFERENCE_END_DATE = [];
            } else {
              this.orderdata.CGHS_AMA_REFERENCE_END_DATE =
                this.orderdata.CGHS_AMA_REFERENCE_END_DATE.split(',');
            }
          } else {
            // this.message.error("Can't Load Data", '');
          }
        },
        (err) => {

        }
      );
    this.api
      .getAllQuestions(0, 0, '', '', ' AND CLAIM_ID =' + this.orderdata.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.queData = data['data'][0];
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );
    this.printOrderModalVisible = false;
  }

  fileName: string = 'HOD Permission Letter';

  // public generatePDF() {
  //   var i = 0;
  //   var date = new Date();
  //   var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
  //   var dates = this.datePipe.transform(date, 'hh-mm-ss a');
  //   var data = document.getElementById('printOrderModal');

  //   html2pdf()
  //     .from(data)
  //     .set({
  //       image: { type: 'jpeg', quality: 1.0 },
  //       html2canvas: { scale: 3, useCORS: true },
  //       margin: [2, 10, 2, 5],
  //       pagebreak: { mode: ['css', 'legecy'] },
  //       jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
  //     })
  //     .toPdf()
  //     .get('pdf')
  //     .then(function (pdf) {
  //       this.pdfDownload = true;
  //       var totalPages = pdf.internal.getNumberOfPages();

  //       for (i = 1; i <= totalPages; i++) {
  //         pdf.setPage(i);
  //         pdf.setFontSize(12);
  //         pdf.setTextColor(150);
  //         pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
  //       }

  //       this.pdfDownload = false;
  //     })
  //     .save(this.fileName + '_' + datef + '_' + dates + '.pdf');

  //   // var i = 0;
  //   // var date = new Date();
  //   // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
  //   // var dates = this.datePipe.transform(date, "h:mm:ss a");
  //   // var data = document.getElementById('print');
  //   // var opt = {
  //   //   margin: 0.2,
  //   //   image: { type: 'jpeg', quality: 0.98 },
  //   //   html2canvas: { scale: 4 },
  //   //   jsPDF: { unit: 'in', orientation: 'landscape', width: 'imgWidth' }
  //   // };

  //   // html2pdf().set(opt).from(data).save(this.formTitle);
  // }

  generatePDF() {
    const element = document.getElementById('printOrderModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  data5: SignatureMaster = new SignatureMaster();
  Signaturearray: any = [];
  getAllUsers() {
    this.api.getSignature(0, 0, 'ID', 'desc', ' AND STATUS =1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturearray = data['data'];
        }
      },
      (err) => {

      }
    );
  }
  signatureData: any = [];
  Name = '';
  signature(event: any) {
    var f = this.Signaturearray.filter((item) => item.ID == event);
    this.SECTION_TYPE = f[0]['SECTION_TYPE'];
    this.NAME = f[0]['NAME'];
    this.NAME_HN = f[0]['NAME_HN'];
    this.OFFICE_NAME = f[0]['OFFICE_NAME'];
    this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
    this.POST = f[0]['POST'];
    this.POST_HN = f[0]['POST_HN'];
  }
}
