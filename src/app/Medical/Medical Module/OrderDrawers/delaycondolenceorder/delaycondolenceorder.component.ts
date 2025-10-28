import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { QuestionaryMaster } from 'src/app/Medical/Models/questionarymaster';
import { SignatureMaster } from 'src/app/Medical/Models/SignatureMaster';

@Component({
  selector: 'app-delaycondolenceorder',
  templateUrl: './delaycondolenceorder.component.html',
  styleUrls: ['./delaycondolenceorder.component.css'],
})
export class DelaycondolenceorderComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() orderdata1: any;
  @Input() HospitalMapping: any;
  @Input() queData: QuestionaryMaster;
  @Input() amountinwords1: any;
  @Input() amountinwordsh1: any;
  @Input() SECTION_TYPE: any;
  @Input() sixMonthDate: any;
  @Input() dateBetweenDiff: any;
  FROM_DATE: Date = new Date();
  TO_DATE: Date = new Date();
  TODAYS_DATE: Date = new Date();
  PRINTED_DATE: Date = new Date();
  FILE_NO: string = '';
  isSpinning: boolean = false;
  IS_EMERG_TREAT_AVAILED = 0;
  IS_BILL_FILLED_IN_TIME = 0;
  IS_HOSPITAL_EMPLANELLED;
  Hospital_Type = 'NE';
  NAME: string = 'shubham';
  NAME_MR: string = '';
  Expose_facto = true;
  AMOUNT: number;
  AMOUNT_WORDS: string;
  am = 1000;
  PATIENT_NAME_HN: string;
  RELATIONSHIP_HN: string;
  EMPLOYEE_NAME_HN: string;
  ADMISSIBLE_AMOUNT_HN: any;
  dataa: any;
  radioValue: any = 'A';
  @Input() fileList1: any = [];
  @Input() HospitalMapping1: any = [];

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
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
      (err) => {}
    );
  }

  signatureData: any = [];
  Name = '';
  signature(event: any) {
    var f = this.Signaturearray.filter((item) => item.ID == event);
    this.SECTION_TYPE = f[0]['SECTION_TYPE'];
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
        this.orderdata1.hospitalData = this.claimHospitalMapping;
      }
    }
    this.orderdata1.hospitalData = this.claimHospitalMapping;

    if (
      this.queData.LETTER_DATE == undefined ||
      this.queData.LETTER_DATE == null ||
      this.queData.LETTER_DATE == ''
    ) {
      this.queData.LETTER_DATE = null;
      this.orderdata1.LETTER_DATE = null;
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
      this.orderdata1.RECEIVED_DATE = null;
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
      this.orderdata1.REFERRAL_DATE = null;
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
      this.orderdata1.CLAIM_SUBMITTED_DATE = null;
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
      this.orderdata1.CLAIM_FILLED_DATE = null;
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
      this.orderdata1.BILL_SUBMISSION_DATE = null;
    } else {
      this.queData.BILL_SUBMISSION_DATE = this.datepipe.transform(
        this.queData.BILL_SUBMISSION_DATE,
        'yyyy-MM-dd'
      );
    }

    this.orderdata1['CLAIM_ID'] = this.orderdata1.ID;
    this.api.updateQuestions(this.queData).subscribe((successCode) => {
      if (successCode.code == '200') {
        // this.message.success('Information updated Successfully','');

        // for (
        //   let index = 0;
        //   index < this.HospitalMapping1.length;
        //   index++
        // ) {
        //   this.HospitalMapping1[index].CREATED_MODIFIED_DATE =
        //     '';
        // }
        this.api
          .updateClaimEmployee(this.orderdata1)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              // this.message.success('Information Changed Successfully...', '');
              this.api
                .updatebulk(this.HospitalMapping)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Information updated Successfully',
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

  close(delayCondolenceOrderPage: NgForm): void {
    delayCondolenceOrderPage.form.reset();
    this.drawerClose();
  }
  printOrderModalVisible: boolean = false;

  openPrintOrderModal() {
    this.printOrderModalVisible = true;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  // auto(event: number) {

  // }
  isfound = 0;
  pakagedata() {
    this.openPrintOrderModal();
  }

  fileName: string = 'Sanction Order';
  pdfDownload: boolean = false;

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
  treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  dateDiff1(event) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    var result = new Date(event);
    this.sixMonthDate = new Date(this.sixMonthDate);
    var bb = this.datepipe.transform(result, 'yyyy-MM-dd');
    var cc = this.datepipe.transform(this.sixMonthDate, 'yyyy-MM-dd');
    var a = result.setMinutes(
      result.getMinutes() -
        result.getTimezoneOffset() -
        this.sixMonthDate.setMinutes(
          this.sixMonthDate.getMinutes() - this.sixMonthDate.getTimezoneOffset()
        )
    );
    var b =
      result.setMinutes(
        result.getMinutes() -
          result.getTimezoneOffset() -
          this.sixMonthDate.setMinutes(
            this.sixMonthDate.getMinutes() -
              this.sixMonthDate.getTimezoneOffset()
          )
      ) / millisecondsPerDay;

    // return result;
    // return (this.treatAsUTC(endDate) - this.treatAsUTC(startDate)) / millisecondsPerDay;
  }
  dateDiff(event) {
    var future = moment(event);
    var start = moment(this.sixMonthDate);
    this.dateBetweenDiff = future.diff(start, 'days'); // 9
  }
}
