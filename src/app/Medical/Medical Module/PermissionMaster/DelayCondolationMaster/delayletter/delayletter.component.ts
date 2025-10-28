import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as html2pdf from 'html2pdf.js';
import { DelayCondonationMaster } from 'src/app/Medical/Models/DelayCondonationMaster';
import { SignatureMaster } from 'src/app/Medical/Models/SignatureMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { MedicalSignatureData } from 'src/app/Medical/Models/MedicalSignature';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-delayletter',
  templateUrl: './delayletter.component.html',
  styleUrls: ['./delayletter.component.css'],
})
export class DelayletterComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() orderdata: any;
  @Input() data: DelayCondonationMaster;
  @Input() SECTION_TYPE: any;
  @Input() dateBetweenDiff: any;
  @Input() diffdate: any;
  @Input() SIGNNAME: any;
  @Input() NAME_HN: any;
  @Input() OFFICE_NAME: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() POST: any;
  @Input() POST_HN: any;
  @Input() delayLetterSignatureData: any;
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
  @Input() fileList = [];
  @Input() HospitalMapping: any = [];
  isAdmin: boolean = false;
  GET_SIGNATURE_IDS: any;
  mailId: any;
  constructor(
    // private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.mailId = sessionStorage.getItem('emailId');
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();
    this.getAllUsersOld();
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
  editorConfigHeader: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Header',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // S/ave(){}

  save() {}
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
    if (event) {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];
    } else {
      this.SECTION_TYPE = '';
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HN = '';
      this.POST = '';
      this.POST_HN = '';
    }
  }
  close(delayCondolencePermissionPage: NgForm): void {
    delayCondolencePermissionPage.form.reset();
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
      //     this.orderdata.hospitalData = this.claimHospitalMapping;
      //   }
      // }
      // this.orderdata.hospitalData = this.claimHospitalMapping;

      if (
        this.data.LETTER_DATE == undefined ||
        this.data.LETTER_DATE == null ||
        this.data.LETTER_DATE == ''
      ) {
        this.data.LETTER_DATE = null;
        this.orderdata.LETTER_DATE = null;
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
        this.orderdata.RECEIVED_DATE = null;
      } else {
        this.data.RECEIVED_DATE = this.datepipe.transform(
          this.data.RECEIVED_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data.CLAIM_SUBMITTED_DATE == undefined ||
        this.data.CLAIM_SUBMITTED_DATE == null ||
        this.data.CLAIM_SUBMITTED_DATE == ''
      ) {
        this.data.CLAIM_SUBMITTED_DATE = null;
        this.orderdata.CLAIM_SUBMITTED_DATE = null;
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
        this.orderdata.CLAIM_FILLED_DATE = null;
      } else {
        this.data.CLAIM_FILLED_DATE = this.datepipe.transform(
          this.data.CLAIM_FILLED_DATE,
          'yyyy-MM-dd'
        );
      }

      // this.orderdata['CLAIM_ID'] = this.orderdata.ID;
      if (this.HospitalMapping.length > 0) {
        this.api.updateDelayCondolation(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.message.success('Information updated Successfully', '');
            this.isSpinning = false;
            // this.openPrintOrderModal();

            for (let index = 0; index < this.HospitalMapping.length; index++) {
              this.HospitalMapping[index].CREATED_MODIFIED_DATE = '';
            }
            this.api
              .updatebulk(this.HospitalMapping)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // this.message.success(
                  //   'Information Changed Successfully...',
                  //   ''
                  // );
                  if (this.delayLetterSignatureData.ID) {
                    this.api
                      .UpdateMedicalSignature(this.delayLetterSignatureData)
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
                                    this.delayLetterSignatureData =
                                      data['data'][0];
                                  } else {
                                    this.delayLetterSignatureData =
                                      new MedicalSignatureData();
                                  }
                                  this.message.success(
                                    ' Information Updated Successfully...',
                                    ''
                                  );
                                  this.openPrintOrderModal();
                                } else {
                                  this.delayLetterSignatureData = [];
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
                    this.delayLetterSignatureData.DELAY_ID = this.data.ID;
                    this.api
                      .CreateMedicalSignature(this.delayLetterSignatureData)
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
                                    this.delayLetterSignatureData =
                                      data['data'][0];
                                  } else {
                                    this.delayLetterSignatureData =
                                      new MedicalSignatureData();
                                  }
                                  this.message.success(
                                    ' Information Save Successfully...',
                                    ''
                                  );
                                  this.openPrintOrderModal();
                                } else {
                                  this.delayLetterSignatureData = [];
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
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Not Saved', '');
                }
              });
            // this.api
            //   .updateClaimEmployee(this.orderdata)
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
            this.message.error('Information Not Saved', '');
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

  // }

  fileName: string = 'Sanction Order';
  pdfDownload: boolean = false;

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
  // public generatePDF() {
  //   var i = 0;
  //   var date = new Date();
  //   var datef = this.datepipe.transform(date, 'dd-MM-yyyy');
  //   var dates = this.datepipe.transform(date, 'hh-mm-ss a');
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
      this.delayLetterSignatureData.DELAY_LETTER_SIGNATURE_1 == null ||
      this.delayLetterSignatureData.DELAY_LETTER_SIGNATURE_1 == undefined ||
      this.delayLetterSignatureData.DELAY_LETTER_SIGNATURE_1 == ''
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
          item.ID == this.delayLetterSignatureData.DELAY_LETTER_SIGNATURE_1
      );
      this.SIGNNAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST2_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
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
