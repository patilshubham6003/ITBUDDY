import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as html2pdf from 'html2pdf.js';
import { DelayCondonationMaster } from 'src/app/Medical/Models/DelayCondonationMaster';
import { SignatureMaster } from 'src/app/Medical/Models/SignatureMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { MedicalSignatureData } from 'src/app/Medical/Models/MedicalSignature';

@Component({
  selector: 'app-delayorder',
  templateUrl: './delayorder.component.html',
  styleUrls: ['./delayorder.component.css'],
})
export class DelayorderComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() orderdata1: any;
  @Input() HospitalMapping: any;
  @Input() data: DelayCondonationMaster;
  @Input() amountinwords1: any;
  @Input() amountinwordsh1: any;
  @Input() SECTION_TYPE: any;
  @Input() sixMonthDate: any;
  @Input() dateBetweenDiff: any;
  @Input() diffdate: any;
  @Input() delayOrderSignatureData: any;
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
  GET_SIGNATURE_IDS: any;
  @Input() fileList1 = [];
  @Input() HospitalMapping1: any = [];
  isAdmin: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsersOld();
    this.getAllUsers();
    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  data5: SignatureMaster = new SignatureMaster();
  Signaturearray: any = [];
  getAllUsersOld() {
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

  claimHospitalMapping = [];
  Save() {
    if (!this.isAdmin) {
      this.isSpinning = true;
      // this.claimHospitalMapping = [];
      // for (var i = 0; this.HospitalMapping.length > i; i++) {
      //   var obj = Object.assign({}, this.HospitalMapping[i]);
      //   obj.ID = undefined;
      //   this.claimHospitalMapping.push(obj);
      //   // this.claimHospitalMapping[i]['CLAIM_ID'] = undefined;
      //   if (this.HospitalMapping.length == i + 1) {
      //     this.orderdata1.hospitalData = this.claimHospitalMapping;
      //   }
      // }
      // this.orderdata1.hospitalData = this.claimHospitalMapping;

      if (
        this.data.LETTER_DATE == undefined ||
        this.data.LETTER_DATE == null ||
        this.data.LETTER_DATE == ''
      ) {
        this.data.LETTER_DATE = null;
        this.orderdata1.LETTER_DATE = null;
      } else {
        this.data.LETTER_DATE = this.datepipe.transform(
          this.data.LETTER_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data.RECEIVED_DATE == undefined ||
        this.data.RECEIVED_DATE == null ||
        this.data.RECEIVED_DATE == ''
      ) {
        this.data.RECEIVED_DATE = null;
        this.orderdata1.RECEIVED_DATE = null;
      } else {
        this.data.RECEIVED_DATE = this.datepipe.transform(
          this.data.RECEIVED_DATE,
          'yyyy-MM-dd'
        );
      }

      // if (
      //   this.data.REFERRAL_DATE == undefined ||
      //   this.data.REFERRAL_DATE == null ||
      //   this.data.REFERRAL_DATE == ''
      // ) {
      //   this.data.REFERRAL_DATE = null;
      //   this.orderdata1.REFERRAL_DATE = null;
      // } else {
      //   this.data.REFERRAL_DATE = this.datepipe.transform(
      //     this.data.REFERRAL_DATE,
      //     'yyyy-MM-dd'
      //   );
      // }

      if (
        this.data.CLAIM_SUBMITTED_DATE == undefined ||
        this.data.CLAIM_SUBMITTED_DATE == null ||
        this.data.CLAIM_SUBMITTED_DATE == ''
      ) {
        this.data.CLAIM_SUBMITTED_DATE = null;
        this.orderdata1.CLAIM_SUBMITTED_DATE = null;
      } else {
        this.data.CLAIM_SUBMITTED_DATE = this.datepipe.transform(
          this.data.CLAIM_SUBMITTED_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data.CLAIM_FILLED_DATE == undefined ||
        this.data.CLAIM_FILLED_DATE == null ||
        this.data.CLAIM_FILLED_DATE == ''
      ) {
        this.data.CLAIM_FILLED_DATE = null;
        this.orderdata1.CLAIM_FILLED_DATE = null;
      } else {
        this.data.CLAIM_FILLED_DATE = this.datepipe.transform(
          this.data.CLAIM_FILLED_DATE,
          'yyyy-MM-dd'
        );
      }

      // if (
      //   this.data.BILL_SUBMISSION_DATE == undefined ||
      //   this.data.BILL_SUBMISSION_DATE == null ||
      //   this.data.BILL_SUBMISSION_DATE == ''
      // ) {
      //   this.data.BILL_SUBMISSION_DATE = null;
      //   this.orderdata1.BILL_SUBMISSION_DATE = null;
      // } else {
      //   this.data.BILL_SUBMISSION_DATE = this.datepipe.transform(
      //     this.data.BILL_SUBMISSION_DATE,
      //     'yyyy-MM-dd'
      //   );
      // }

      // this.orderdata1['CLAIM_ID'] = this.orderdata1.ID;
      if (this.HospitalMapping.length > 0) {
        this.api.updateDelayCondolation(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.message.success('Information updated Successfully', '');
            this.isSpinning = false;
            // this.openPrintOrderModal();
            for (let index = 0; index < this.HospitalMapping1.length; index++) {
              this.HospitalMapping1[index].CREATED_MODIFIED_DATE = '';
            }
            this.api
              .updatebulk(this.HospitalMapping)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  if (this.delayOrderSignatureData.ID) {
                    this.api
                      .UpdateMedicalSignature(this.delayOrderSignatureData)
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          // if (!addNew) this.drawerClose();
                          this.isSpinning = false;
                          this.api
                            .GetMedicalSignature(
                              0,
                              0,
                              '',
                              '',
                              ' AND DELAY_ID = ' + this.data.ID
                            )
                            .subscribe(
                              (data) => {
                                if (data['code'] == 200) {
                                  if (data['data'].length > 0) {
                                    this.delayOrderSignatureData =
                                      data['data'][0];
                                  } else {
                                    this.delayOrderSignatureData =
                                      new MedicalSignatureData();
                                  }
                                  this.message.success(
                                    ' Information Updated Successfully...',
                                    ''
                                  );
                                  this.openPrintOrderModal();
                                } else {
                                  this.delayOrderSignatureData = [];
                                  this.message.error(
                                    'Something Went Wrong',
                                    ''
                                  );
                                }
                              },
                              (err) => {}
                            );
                        } else {
                          this.message.error(
                            ' Failed To Update Information...',
                            ''
                          );
                          this.isSpinning = false;
                        }
                      });
                  } else {
                    this.delayOrderSignatureData.DELAY_ID = this.data.ID;
                    this.api
                      .CreateMedicalSignature(this.delayOrderSignatureData)
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          // if (!addNew) {
                          //   this.drawerClose();
                          // } else {
                          //   this.data = new SignatureMaster();
                          //   this.resetDrawer(SignaturePage);
                          // }
                          this.isSpinning = false;
                          this.api
                            .GetMedicalSignature(
                              0,
                              0,
                              '',
                              '',
                              ' AND DELAY_ID = ' + this.data.ID
                            )
                            .subscribe(
                              (data) => {
                                if (data['code'] == 200) {
                                  if (data['data'].length > 0) {
                                    this.delayOrderSignatureData =
                                      data['data'][0];
                                  } else {
                                    this.delayOrderSignatureData =
                                      new MedicalSignatureData();
                                  }
                                  this.message.success(
                                    ' Information Save Successfully...',
                                    ''
                                  );
                                  this.openPrintOrderModal();
                                } else {
                                  this.delayOrderSignatureData = [];
                                  this.message.error(
                                    'Something Went Wrong',
                                    ''
                                  );
                                }
                              },
                              (err) => {}
                            );
                        } else {
                          this.message.error(
                            ' Failed To Save Information...',
                            ''
                          );
                          this.isSpinning = false;
                        }
                      });
                  }

                  // this.message.success('Information Changed Successfully...', '');
                  // this.openPrintOrderModal();
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Not Saved', '');
                }
              });
            // this.api
            //   .updateClaimEmployee(this.orderdata1)
            //   .subscribe((successCode) => {
            //     if (successCode.code == '200') {
            //       // this.message.success('Information Changed Successfully...', '');
            //       this.api
            //         .updatebulk(this.HospitalMapping)
            //         .subscribe((successCode) => {
            //           if (successCode.code == '200') {
            //             this.message.success(
            //               'Information updated Successfully',
            //               ''
            //             );
            //             this.openPrintOrderModal();
            //             this.isSpinning = false;
            //           } else {
            //             this.message.error('Information Not Saved', '');
            //           }
            //         });
            //     } else {
            //       this.message.error('Information Has Not Changed...', '');
            //       this.isSpinning = false;
            //     }
            //   });
          } else {
            this.message.error('Information Not Updated', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.message.error('Please Add Hospitals', '');
        this.isSpinning = false;
      }
    } else {
      this.openPrintOrderModal();
    }
  }

  close(): void {
    // delayCondolenceOrderPage.form.reset();
    this.drawerClose();
  }
  // close(delayCondolenceOrderPage: NgForm): void {
  //   // delayCondolenceOrderPage.form.reset();
  //   this.drawerClose();
  // }
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
  // dateDiff(event) {

  //   if(event != null || event != undefined || event != ''){
  //     event = this.datepipe.transform(
  //       event,
  //       'yyyy-MM-dd'
  //     );
  //   }else{}
  // }
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

  // diffdate=0

  datedifferance(event) {
    this.diffdate = 0;
    var date = this.data.TREATMENT_END_DATE;
    var modifiedDate = new Date(date);
    modifiedDate.setMonth(modifiedDate.getMonth() + 6);
    const formattedDate = modifiedDate;
    const differenceMilliseconds = event.getTime() - formattedDate.getTime();
    var dateDifference = differenceMilliseconds / (1000 * 3600 * 24);
    this.diffdate = dateDifference;
  }

  getAllUsers() {
    this.Signaturearray1 = [];
    if (
      this.GET_SIGNATURE_IDS !== null &&
      this.GET_SIGNATURE_IDS !== undefined
    ) {
      this.api
        .getSignature(
          0,
          0,
          'ID',
          'desc',
          // ' AND STATUS!=false AND ID in(' + this.GET_SIGNATURE_IDS + ')'
          ' AND STATUS = 1 AND DDO_ID=' +
            Number(sessionStorage.getItem('ddoId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length == 0) {
                this.Signaturearray1 = [];
              } else {
                this.Signaturearray1 = data['data'];
                if (data['count'] == this.Signaturearray1.length) {
                  this.findSignatures();
                }
              }
            }
          },
          (err) => {}
        );
    }
  }

  findSignatures() {
    if (
      this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_1 == null ||
      this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_1 == undefined ||
      this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_1 == ''
    ) {
      this.SIGNNAME2 = '';
      this.NAME_HN2 = '';
      this.POST2 = '';
      this.POST2_HIN = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME2_HIN = '';
    } else {
      var f = this.Signaturearray1.filter(
        (item) =>
          item.ID == this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_1
      );
      this.SIGNNAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST2_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
    }
    if (
      this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_2 == null ||
      this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_2 == undefined ||
      this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_2 == ''
    ) {
      this.SIGNNAME3 = '';
      this.NAME_HN3 = '';
      this.POST3 = '';
      this.POST3_HIN = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME3_HIN = '';
    } else {
      var f = this.Signaturearray1.filter(
        (item) =>
          item.ID == this.delayOrderSignatureData.DELAY_ORDER_SIGNATURE_2
      );
      this.SIGNNAME3 = f[0]['NAME'];
      this.NAME_HN3 = f[0]['NAME_HN'];
      this.POST3 = f[0]['POST'];
      this.POST3_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
    }
  }

  Signaturearray1: any = [];
  SIGNNAME2: any;
  NAME_HN2: any;
  POST2: any;
  POST2_HIN: any;
  OFFICE_NAME2: any;
  OFFICE_NAME2_HIN: any;
  signature2(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
      this.SIGNNAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST2_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME2 = '';
      this.NAME_HN2 = '';
      this.POST2 = '';
      this.POST2_HIN = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME2_HIN = '';
    }
  }

  SIGNNAME3: any;
  NAME_HN3: any;
  POST3: any;
  POST3_HIN: any;
  OFFICE_NAME3: any;
  OFFICE_NAME3_HIN: any;
  signature3(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
      this.SIGNNAME3 = f[0]['NAME'];
      this.NAME_HN3 = f[0]['NAME_HN'];
      this.POST3 = f[0]['POST'];
      this.POST3_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME3 = '';
      this.NAME_HN3 = '';
      this.POST3 = '';
      this.POST3_HIN = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME3_HIN = '';
    }
  }

  drawerVisiblesign: boolean = false;
  opensignature() {
    this.drawerVisiblesign = true;
  }

  drawerClosesign(): void {
    this.drawerVisiblesign = false;
    this.getAllUsers();
  }
  get closeCallbacksign() {
    return this.drawerClosesign.bind(this);
  }
}
