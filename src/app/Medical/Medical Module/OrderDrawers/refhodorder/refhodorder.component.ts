import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { NgForm } from '@angular/forms';
import { QuestionaryMaster } from 'src/app/Medical/Models/questionarymaster';
import { SignatureMaster } from 'src/app/Medical/Models/SignatureMaster';

@Component({
  selector: 'app-refhodorder',
  templateUrl: './refhodorder.component.html',
  styleUrls: ['./refhodorder.component.css'],
})
export class RefhodorderComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() orderdata: any;
  @Input() HospitalMapping: any;
  @Input() queData: QuestionaryMaster = new QuestionaryMaster();
  @Input() amountinwords1: any;
  @Input() amountinwordsh1: any;
  @Input() claimID: any;
  @Input() empID: any;
  @Input() SECTION_TYPE: any;
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
  ) { }
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
  }
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
    this.orderdata.hospitalData = this.claimHospitalMapping;

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
              // this.message.success('Information Changed Successfully...', '');
              // this.openPrintOrderModal();
              // this.isSpinning = false;
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
  close(refHODOrderPage: NgForm): void {
    refHODOrderPage.form.reset();
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
  isfound: any = 0;
  pakagedata() {

    this.ADMISSIBLE_AMOUNT_HN = this.amountinwordsh1;
    // this.data=showLayout


    // this.isOk = true;
    // if (this.orderdata.ORDER_DATE == undefined || this.orderdata.ORDER_DATE == null) {
    //   // this.isOk = false;
    //   this.message.error('Please enter date', '');
    // } else
    // if (
    //   this.orderdata.FILE_ID == undefined ||
    //   this.orderdata.FILE_ID == null ||
    //   this.orderdata.FILE_ID == 0
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please select file no', '');
    // } else
    if (
      this.orderdata.ORDER_NO == undefined ||
      this.orderdata.ORDER_NO == null ||
      this.orderdata.ORDER_NO == ''
    ) {
      // this.isOk = false;
      this.message.error('Please enter Order Number', '');
    } else if (
      this.orderdata.EMPLOYEE_NAME_HN == undefined ||
      this.orderdata.EMPLOYEE_NAME_HN == null ||
      this.orderdata.EMPLOYEE_NAME_HN == ''
    ) {
      // this.isOk = false;
      this.message.error('Please enter name of applicant (in hindi)', '');
    } else if (
      this.orderdata.PATIENT_NAME_HN == undefined ||
      this.orderdata.PATIENT_NAME_HN == null ||
      this.orderdata.PATIENT_NAME_HN == ''
    ) {
      // this.isOk = false;
      this.message.error('Please enter Name of patient(in hindi)', '');
      // } else if (
      //   this.orderdata.HOSPITAL_NAME_HN == undefined ||
      //   this.orderdata.HOSPITAL_NAME_HN == null ||
      //   this.orderdata.HOSPITAL_NAME_HN == ''
      // ) {
      //   // this.isOk = false;
      //   this.message.error('Please Enter Name Of Hospital(in hindi)', '');
      // } else if (
      //   this.orderdata.HOSPITAL_ADDRESS_HN == undefined ||
      //   this.orderdata.HOSPITAL_ADDRESS_HN == null ||
      //   this.orderdata.HOSPITAL_ADDRESS_HN == ''
      // ) {
      //   // this.isOk = false;
      //   this.message.error('Please Enter Address Of Hospital(in hindi)', '');
      // } else {
    } else {
      for (let index = 0; index < this.HospitalMapping1.length; index++) {
        if (this.HospitalMapping1[index].NAME_HN == '') {
          this.isfound = 1;
        } else if (this.HospitalMapping1[index].ADDRESS_HN == '') {
          this.isfound = 2;
        }
      }
      if (this.isfound == 1) {
        this.message.error('Please Enter Name Of Hospital(in hindi)', '');
        this.isfound = null;
      } else if (this.isfound == 2) {
        this.message.error('Please Enter Address Of Hospital(in hindi)', '');
        this.isfound = null;
      } else {
        this.api
          .getEmployeeMaster(
            0,
            0,
            '',
            'asc',
            ' AND ID=' + this.orderdata.EMP_ID
          )
          .subscribe(
            (data) => {
              this.dataa = data['data'][0];
              this.dataa.EMPLOYEE_NAME_HN = this.orderdata.EMPLOYEE_NAME_HN;
              this.orderdata.SUB_STAGE = 'O';
              // this.orderdata.ORDER_DATE = this.datePipe.transform(
              //   this.orderdata.ORDER_DATE,
              //   'yyyy-MM-dd'
              // );
              this.api
                .updateEmployeeMaster1(this.dataa)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    // this.message.success('Information updated Successfully', '');
                    this.api
                      .updateClaimMaster(this.orderdata)
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          // this.message.success('Information updated Successfully','');

                          for (
                            let index = 0;
                            index < this.HospitalMapping1.length;
                            index++
                          ) {
                            this.HospitalMapping1[index].CREATED_MODIFIED_DATE =
                              '';
                          }

                          this.api
                            .updatebulk(this.HospitalMapping1)
                            .subscribe((successCode) => {
                              if (successCode.code == '200') {
                                this.message.success(
                                  'Information updated Successfully',
                                  ''
                                );
                              } else {
                                this.message.error('Information Not Saved', '');
                              }
                            });

                          this.openPrintOrderModal();
                        } else {
                          this.message.error('Information Not Saved', '');
                        }
                      });
                  } else if (successCode.code == '300') {
                    this.message.error(
                      'Email ID or Mobile No. Already Registered',
                      ''
                    );
                  } else {
                    this.message.error('Information Not Saved', '');
                  }
                });
            },
            (err) => {

              this.isSpinning = false;
            }
          );
      }
    }

    // }
  }

  fileName: string = 'HOD Order Letter';
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
}
