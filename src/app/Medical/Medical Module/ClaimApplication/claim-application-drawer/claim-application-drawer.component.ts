import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { MedicalSignatureData } from 'src/app/Medical/Models/MedicalSignature';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
// import { ToWords } from 'to-words';
// const toWords = new ToWords();
import { ToWords } from 'to-words';
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'Rupees',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});
const toWordsen = new ToWords({
  localeCode: 'hi-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'रुपये',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});
@Component({
  selector: 'app-claim-application-drawer',
  templateUrl: './claim-application-drawer.component.html',
  styleUrls: ['./claim-application-drawer.component.css'],
})

// export class ClaimApplicationDrawerComponent implements OnInit {
//   @Input() drawerClose: Function;
//   @Input() orderdata: any;
//   @Input() amountinwords: any;
//   @Input() amountinwordsh: any;
//   @Input() amountinwordssh: any;
//   @Input() amountinwordss: any;
//   @Input() SECTION_TYPE: any;
//   @Input() SIGNNAME: any;
//   @Input() NAME_HN: any;
//   @Input() OFFICE_NAME: any;
//   @Input() OFFICE_NAME_HN: any;
//   @Input() POST: any;
//   @Input() POST_HN: any;
//   @Input() Order: any;
//   @Input() isAdvanceSameAsAdmissible: any;
//   @Input() admissibleineng: any;
//   @Input() admissibleinhindi: any;
//   @Input() advadmissibleineng: any;
//   @Input() advadmissibleinhindi: any;
//   @Input() advanceineng: any;
//   @Input() advanceinhindi: any;
//   @Input() finaladmissibleineng: any;
//   @Input() finaladmissibleinhindi: any;
//   @Input() finalclaimedineng: any;
//   @Input() finalclaimedinhindi: any;
//   @Input() finalremainingineng: any;
//   @Input() finalremaininginhindi: any;
//   FROM_DATE: Date = new Date();
//   TO_DATE: Date = new Date();
//   TODAYS_DATE: Date = new Date();
//   PRINTED_DATE: Date = new Date();
//   FILE_NO: string = '';
//   @Input() isSpinning: boolean = false;
//   IS_EMERG_TREAT_AVAILED = 0;
//   IS_BILL_FILLED_IN_TIME = 0;
//   IS_HOSPITAL_EMPLANELLED;
//   Hospital_Type = 'NE';
//   NAME: string = 'shubham';
//   NAME_MR: string = '';
//   Expose_facto = true;
//   AMOUNT: number=0;
//   AMOUNT_WORDS: string='';
//   am = 1000;
//   PATIENT_NAME_HN: string='';
//   RELATIONSHIP_HN: string='';
//   EMPLOYEE_NAME_HN: string='';
//   ADMISSIBLE_AMOUNT_HN: any;
//   dataa: any;
//   radioValue: any = 'A';
//   @Input() fileList = [];
//   @Input() HospitalMapping:any = [];
//   @Input() Signaturearray:any = [];

//   constructor(
//     private datePipe: DatePipe,
//     private message: NzNotificationService,
//     private api: ApiService
//   ) {}
//   userId: any;
//   mailId: any;
//   ngOnInit(): void {
//     this.getAllUsers();
//     this.userId = Number(sessionStorage.getItem('userId'));
//     this.mailId = sessionStorage.getItem('emailId');
//   }
//   printLatestOrderModalVisible1: boolean = false;
//   save() {}

//   close(): void {
//     this.isSpinning = false;
//     this.drawerClose();
//   }

//   printOrderModalVisible: boolean = false;

//   openPrintOrderModal() {
//     this.api
//       .getclaimMaster2(0, 0, 'ID', 'ASC', ' AND ID= ' + this.orderdata.ID)
//       .subscribe(
//         (data) => {
//           this.orderdata = data['data'][0];
//         },
//         (err) => {
//
//         }
//       );
//     this.printOrderModalVisible = true;
//   }

//   printLatestOrderModalVisible: boolean = false;
//   openPrintOrderModalLatest() {
//     this.api
//       .getclaimMaster2(0, 0, 'ID', 'ASC', ' AND ID= ' + this.orderdata.ID)
//       .subscribe(
//         (data) => {
//           this.orderdata = data['data'][0];
//         },
//         (err) => {
//
//         }
//       );
//     this.printLatestOrderModalVisible = true;
//   }

//   printOrderModalCancel() {
//     this.printOrderModalVisible = false;
//   }
//   printLatestOrderModalCancel() {
//     this.printLatestOrderModalVisible = false;
//   }

//   getwidth() {
//     if (window.innerWidth <= 400) {
//       return 400;
//     } else {
//       return 850;
//     }
//   }

//   // auto(event: number) {

//   // }
//   isfound :any= 0;
//   pakagedata() {
//     this.ADMISSIBLE_AMOUNT_HN = this.amountinwordsh;
//     // this.data=showLayout

//     // this.isOk = true;
//     // if (this.orderdata.ORDER_DATE == undefined || this.orderdata.ORDER_DATE == null) {
//     //   // this.isOk = false;
//     //   this.message.error('Please enter date', '');
//     // } else
//     // if (
//     //   this.orderdata.FILE_ID == undefined ||
//     //   this.orderdata.FILE_ID == null ||
//     //   this.orderdata.FILE_ID == 0
//     // ) {
//     //   // this.isOk = false;
//     //   this.message.error('Please select file no', '');
//     // } else
//     if (
//       this.orderdata.SIGNATURE_ID == undefined ||
//       this.orderdata.SIGNATURE_ID == null ||
//       this.orderdata.SIGNATURE_ID == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please Select Signature', '');
//     } else if (
//       this.orderdata.ORDER_NO == undefined ||
//       this.orderdata.ORDER_NO == null ||
//       this.orderdata.ORDER_NO == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please enter Order Number', '');
//     } else if (
//       this.orderdata.EMPLOYEE_NAME_HN == undefined ||
//       this.orderdata.EMPLOYEE_NAME_HN == null ||
//       this.orderdata.EMPLOYEE_NAME_HN == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please enter name of applicant (in hindi)', '');
//     } else if (
//       this.orderdata.PATIENT_NAME_HN == undefined ||
//       this.orderdata.PATIENT_NAME_HN == null ||
//       this.orderdata.PATIENT_NAME_HN == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please enter Name of patient(in hindi)', '');
//       // } else if (
//       //   this.orderdata.HOSPITAL_NAME_HN == undefined ||
//       //   this.orderdata.HOSPITAL_NAME_HN == null ||
//       //   this.orderdata.HOSPITAL_NAME_HN == ''
//       // ) {
//       //   // this.isOk = false;
//       //   this.message.error('Please Enter Name Of Hospital(in hindi)', '');
//       // } else if (
//       //   this.orderdata.HOSPITAL_ADDRESS_HN == undefined ||
//       //   this.orderdata.HOSPITAL_ADDRESS_HN == null ||
//       //   this.orderdata.HOSPITAL_ADDRESS_HN == ''
//       // ) {
//       //   // this.isOk = false;
//       //   this.message.error('Please Enter Address Of Hospital(in hindi)', '');
//       // } else {
//     } else {
//       for (let index = 0; index < this.HospitalMapping.length; index++) {
//         if (this.HospitalMapping[index].NAME_HN == '') {
//           this.isfound = 1;
//         } else if (this.HospitalMapping[index].ADDRESS_HN == '') {
//           this.isfound = 2;
//         }
//       }
//       if (this.isfound == 1) {
//         this.message.error('Please Enter Name Of Hospital(in hindi)', '');
//         this.isfound = null;
//       } else if (this.isfound == 2) {
//         this.message.error('Please Enter Address Of Hospital(in hindi)', '');
//         this.isfound = null;
//       } else {
//         this.isSpinning = true;
//         this.api
//           .getEmployeeMaster(
//             0,
//             0,
//             '',
//             'asc',
//             ' AND ID=' + this.orderdata.EMP_ID
//           )
//           .subscribe(
//             (data) => {
//               this.dataa = data['data'][0];
//               this.dataa.EMPLOYEE_NAME_HN = this.orderdata.EMPLOYEE_NAME_HN;
//               this.orderdata.SUB_STAGE = 'O';
//               this.orderdata.ORDER_DATE = this.datePipe.transform(
//                 this.orderdata.ORDER_DATE,
//                 'yyyy-MM-dd'
//               );
//               this.api
//                 .updateEmployeeMaster1(this.dataa)
//                 .subscribe((successCode) => {
//                   if (successCode.code == '200') {
//                     // this.message.success('Information updated Successfully', '');
//                     this.api
//                       .updateClaimMaster(this.orderdata)
//                       .subscribe((successCode) => {
//                         if (successCode.code == '200') {
//                           // this.message.success('Information updated Successfully','');

//                           for (
//                             let index = 0;
//                             index < this.HospitalMapping.length;
//                             index++
//                           ) {
//                             this.HospitalMapping[index].CREATED_MODIFIED_DATE =
//                               '';
//                             this.HospitalMapping[index].IS_VISIBLE_IN_ORDER =
//                               this.HospitalMapping[index].IS_VISIBLE_IN_ORDER ==
//                               true
//                                 ? 1
//                                 : 0;
//                           }

//                           this.api
//                             .updatebulk(this.HospitalMapping)
//                             .subscribe((successCode) => {
//                               if (successCode.code == '200') {
//                                 this.message.success(
//                                   'Information updated Successfully',
//                                   ''
//                                 );
//                               } else {
//                                 this.message.error('Information Not Saved', '');
//                               }
//                             });
//                           this.isSpinning = false;
//                           this.openPrintOrderModal();
//                         } else {
//                           this.message.error('Information Not Saved', '');
//                         }
//                       });
//                   } else if (successCode.code == '300') {
//                     this.message.error(
//                       'Email ID or Mobile No. Already Registered',
//                       ''
//                     );
//                   } else {
//                     this.message.error('Information Not Saved', '');
//                   }
//                 });
//             },
//             (err) => {
//
//               this.isSpinning = false;
//             }
//           );
//       }
//     }

//     // }
//   }
//   isfoundLatest:any = 0;
//   pakagedataLatest() {
//     this.ADMISSIBLE_AMOUNT_HN = this.amountinwordsh;
//     // this.data=showLayout

//     // this.isOk = true;
//     // if (this.orderdata.ORDER_DATE == undefined || this.orderdata.ORDER_DATE == null) {
//     //   // this.isOk = false;
//     //   this.message.error('Please enter date', '');
//     // } else
//     // if (
//     //   this.orderdata.FILE_ID == undefined ||
//     //   this.orderdata.FILE_ID == null ||
//     //   this.orderdata.FILE_ID == 0
//     // ) {
//     //   // this.isOk = false;
//     //   this.message.error('Please select file no', '');
//     // } else
//     if (
//       this.orderdata.SIGNATURE_ID == undefined ||
//       this.orderdata.SIGNATURE_ID == null ||
//       this.orderdata.SIGNATURE_ID == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please Select Signature', '');
//     } else if (
//       this.orderdata.ORDER_NO == undefined ||
//       this.orderdata.ORDER_NO == null ||
//       this.orderdata.ORDER_NO == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please enter Order Number', '');
//     } else if (
//       this.orderdata.EMPLOYEE_NAME_HN == undefined ||
//       this.orderdata.EMPLOYEE_NAME_HN == null ||
//       this.orderdata.EMPLOYEE_NAME_HN == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please enter name of applicant (in hindi)', '');
//     } else if (
//       this.orderdata.PATIENT_NAME_HN == undefined ||
//       this.orderdata.PATIENT_NAME_HN == null ||
//       this.orderdata.PATIENT_NAME_HN == ''
//     ) {
//       // this.isOk = false;
//       this.message.error('Please enter Name of patient(in hindi)', '');
//       // } else if (
//       //   this.orderdata.HOSPITAL_NAME_HN == undefined ||
//       //   this.orderdata.HOSPITAL_NAME_HN == null ||
//       //   this.orderdata.HOSPITAL_NAME_HN == ''
//       // ) {
//       //   // this.isOk = false;
//       //   this.message.error('Please Enter Name Of Hospital(in hindi)', '');
//       // } else if (
//       //   this.orderdata.HOSPITAL_ADDRESS_HN == undefined ||
//       //   this.orderdata.HOSPITAL_ADDRESS_HN == null ||
//       //   this.orderdata.HOSPITAL_ADDRESS_HN == ''
//       // ) {
//       //   // this.isOk = false;
//       //   this.message.error('Please Enter Address Of Hospital(in hindi)', '');
//       // } else {
//     } else {
//       for (let index = 0; index < this.HospitalMapping.length; index++) {
//         if (this.HospitalMapping[index].NAME_HN == '') {
//           this.isfoundLatest = 1;
//         } else if (this.HospitalMapping[index].ADDRESS_HN == '') {
//           this.isfoundLatest = 2;
//         }
//       }
//       if (this.isfoundLatest == 1) {
//         this.message.error('Please Enter Name Of Hospital(in hindi)', '');
//         this.isfoundLatest = null;
//       } else if (this.isfoundLatest == 2) {
//         this.message.error('Please Enter Address Of Hospital(in hindi)', '');
//         this.isfoundLatest = null;
//       } else {
//         this.isSpinning = true;
//         this.api
//           .getEmployeeMaster(
//             0,
//             0,
//             '',
//             'asc',
//             ' AND ID=' + this.orderdata.EMP_ID
//           )
//           .subscribe(
//             (data) => {
//               this.dataa = data['data'][0];
//               this.dataa.EMPLOYEE_NAME_HN = this.orderdata.EMPLOYEE_NAME_HN;
//               this.orderdata.SUB_STAGE = 'O';
//               this.orderdata.ORDER_DATE = this.datePipe.transform(
//                 this.orderdata.ORDER_DATE,
//                 'yyyy-MM-dd'
//               );
//               this.api
//                 .updateEmployeeMaster1(this.dataa)
//                 .subscribe((successCode) => {
//                   if (successCode.code == '200') {
//                     // this.message.success('Information updated Successfully', '');
//                     this.api
//                       .updateClaimMaster(this.orderdata)
//                       .subscribe((successCode) => {
//                         if (successCode.code == '200') {
//                           // this.message.success('Information updated Successfully','');

//                           for (
//                             let index = 0;
//                             index < this.HospitalMapping.length;
//                             index++
//                           ) {
//                             this.HospitalMapping[index].CREATED_MODIFIED_DATE =
//                               '';
//                             this.HospitalMapping[index].IS_VISIBLE_IN_ORDER =
//                               this.HospitalMapping[index].IS_VISIBLE_IN_ORDER ==
//                               true
//                                 ? 1
//                                 : 0;
//                           }

//                           this.api
//                             .updatebulk(this.HospitalMapping)
//                             .subscribe((successCode) => {
//                               if (successCode.code == '200') {
//                                 this.message.success(
//                                   'Information updated Successfully',
//                                   ''
//                                 );
//                               } else {
//                                 this.message.error('Information Not Saved', '');
//                               }
//                             });
//                           this.isSpinning = false;
//                           this.openPrintOrderModalLatest();
//                         } else {
//                           this.message.error('Information Not Saved', '');
//                         }
//                       });
//                   } else if (successCode.code == '300') {
//                     this.message.error(
//                       'Email ID or Mobile No. Already Registered',
//                       ''
//                     );
//                   } else {
//                     this.message.error('Information Not Saved', '');
//                   }
//                 });
//             },
//             (err) => {
//
//               this.isSpinning = false;
//             }
//           );
//       }
//     }

//     // }
//   }

//   fileName: string = 'Sanction Order';
//   pdfDownload: boolean = false;

//   public generatePDF() {
//     var i = 0;
//     var date = new Date();
//     var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
//     var dates = this.datePipe.transform(date, 'hh-mm-ss a');
//     var data = document.getElementById('printOrderModal');

//     html2pdf()
//       .from(data)
//       .set({
//         image: { type: 'jpeg', quality: 1.0 },
//         html2canvas: { scale: 3, useCORS: true },
//         margin: [2, 10, 2, 5],
//         pagebreak: { mode: ['css', 'legecy'] },
//         jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
//       })
//       .toPdf()
//       .get('pdf')
//       .then(function (pdf) {
//         // this.pdfDownload = true;
//         var totalPages = pdf.internal.getNumberOfPages();

//         for (i = 1; i <= totalPages; i++) {
//           pdf.setPage(i);
//           pdf.setFontSize(12);
//           pdf.setTextColor(150);
//           pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
//         }

//         // this.pdfDownload = false;
//       })
//       .save(this.fileName + '_' + datef + '_' + dates + '.pdf');

//     // var i = 0;
//     // var date = new Date();
//     // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
//     // var dates = this.datePipe.transform(date, "h:mm:ss a");
//     // var data = document.getElementById('print');
//     // var opt = {
//     //   margin: 0.2,
//     //   image: { type: 'jpeg', quality: 0.98 },
//     //   html2canvas: { scale: 4 },
//     //   jsPDF: { unit: 'in', orientation: 'landscape', width: 'imgWidth' }
//     // };

//     // html2pdf().set(opt).from(data).save(this.formTitle);
//   }
//   public generateLatestOrderPDF() {
//     var i = 0;
//     var date = new Date();
//     var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
//     var dates = this.datePipe.transform(date, 'hh-mm-ss a');
//     var data = document.getElementById('printOrderModalLatest');

//     html2pdf()
//       .from(data)
//       .set({
//         image: { type: 'jpeg', quality: 1.0 },
//         html2canvas: { scale: 3, useCORS: true },
//         margin: [2, 10, 2, 5],
//         pagebreak: { mode: ['css', 'legecy'] },
//         jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
//       })
//       .toPdf()
//       .get('pdf')
//       .then(function (pdf) {
//         // this.loadingRecords = true;
//         var totalPages = pdf.internal.getNumberOfPages();

//         for (i = 1; i <= totalPages; i++) {
//           pdf.setPage(i);
//           pdf.setFontSize(12);
//           pdf.setTextColor(150);
//           pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
//         }

//         // this.loadingRecords = false;
//       })
//       .save(this.fileName + '_' + datef + '_' + dates + '.pdf');

//     // var i = 0;
//     // var date = new Date();
//     // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
//     // var dates = this.datePipe.transform(date, "h:mm:ss a");
//     // var data = document.getElementById('print');
//     // var opt = {
//     //   margin: 0.2,
//     //   image: { type: 'jpeg', quality: 0.98 },
//     //   html2canvas: { scale: 4 },
//     //   jsPDF: { unit: 'in', orientation: 'landscape', width: 'imgWidth' }
//     // };

//     // html2pdf().set(opt).from(data).save(this.formTitle);
//   }

//   getAllUsers() {
//     this.api.getSignature(0, 0, 'ID', 'desc', '').subscribe(
//       (data) => {
//         if (data['code'] == 200) {
//           this.Signaturearray = data['data'];
//         }
//       },
//       (err) => {
//
//       }
//     );
//   }
//   signatureData: any = [];
//   Name = '';
//   signature(event: any) {
//     var f = this.Signaturearray.filter((item) => item.ID == event);
//     this.SECTION_TYPE = f[0]['SECTION_TYPE'];
//     this.SIGNNAME = f[0]['NAME'];
//     this.NAME_HN = f[0]['NAME_HN'];
//     this.OFFICE_NAME = f[0]['OFFICE_NAME'];
//     this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
//     this.POST = f[0]['POST'];
//     this.POST_HN = f[0]['POST_HN'];
//   }
// }
export class ClaimApplicationDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() orderdata: any;
  @Input() amountinwords: any;
  @Input() amountinwordsh: any;
  @Input() amountinwordssh: any;
  @Input() amountinwordss: any;
  @Input() SECTION_TYPE: any;
  @Input() SIGNNAME: any;
  @Input() NAME_HN: any;
  @Input() OFFICE_NAME: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() POST: any;
  @Input() POST_HN: any;
  @Input() Order: any;
  @Input() isAdvanceSameAsAdmissible: any;
  @Input() Signaturearray: any = [];
  @Input() admissibleineng: any;
  @Input() admissibleinhindi: any;
  @Input() advadmissibleineng: any;
  @Input() advadmissibleinhindi: any;
  @Input() advanceineng: any;
  @Input() advanceinhindi: any;
  @Input() finaladmissibleineng: any;
  @Input() finaladmissibleinhindi: any;
  @Input() finalclaimedineng: any;
  @Input() finalclaimedinhindi: any;
  @Input() finalremainingineng: any;
  @Input() finalremaininginhindi: any;
  @Input() orderSignatureData: any;
  Signaturearray1: any = [];
  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
  FROM_DATE: Date = new Date();
  TO_DATE: Date = new Date();
  TODAYS_DATE: Date = new Date();
  PRINTED_DATE: Date = new Date();
  FILE_NO: string = '';
  @Input() isSpinning: boolean = false;
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

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  userId: any;
  mailId: any;
  isAdmin: boolean = false;
  roleId: any;
  ddoId: any;
  ngOnInit(): void {
    console.log('this.Order', this.Order);
    this.ddoId = Number(sessionStorage.getItem('ddoId'));
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();

    this.userId = Number(sessionStorage.getItem('userId'));
    this.mailId = sessionStorage.getItem('emailId');

    this.roleId = Number(sessionStorage.getItem('roleId'));

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.api
      .getAllDDOs(
        0,
        0,
        'ID',
        'ASC',
        ' AND ID = ' + Number(sessionStorage.getItem('ddoId'))
      )
      .subscribe(
        (data: any) => {
          this.HeadOfOffice = '';
          this.HeadOfOfficeHn = '';
          if (data['code'] == 200) {
            if (data['count'] > 0) {
              this.HeadOfOffice = data['data'][0]['HEAD_OF_OFFICE'];
              this.HeadOfOfficeHn = data['data'][0]['HEAD_OF_OFFICE_HN'];
            } else {
              this.HeadOfOffice = '';
              this.HeadOfOfficeHn = '';
            }
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
            this.HeadOfOffice = '';
            this.HeadOfOfficeHn = '';
          }
        },
        (err) => {}
      );
  }

  findSignatures() {
    if (this.Order == 'O') {
      if (
        this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2 == null ||
        this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2 == undefined ||
        this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2 == ''
      ) {
        this.SIGNNAME3 = '';
        this.NAME_HN3 = '';
        this.POST3 = '';
        this.POST3_HIN = '';
        this.OFFICE_NAME3 = '';
        this.OFFICE_NAME3_HIN = '';
        this.SECTION_TYPE = '';
        this.SIGNNAME = '';
        this.NAME_HN = '';
        this.OFFICE_NAME = '';
        this.OFFICE_NAME_HN = '';
        this.POST = '';
        this.POST_HN = '';
      } else {
        var f = this.Signaturearray1.filter(
          (item) => item.ID == this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2
        );
        this.SIGNNAME3 = f[0]['NAME'];
        this.NAME_HN3 = f[0]['NAME_HN'];
        this.POST3 = f[0]['POST'];
        this.POST3_HIN = f[0]['POST_HN'];
        this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
        this.SECTION_TYPE = f[0]['SECTION_TYPE'];
        this.SIGNNAME = f[0]['NAME'];
        this.NAME_HN = f[0]['NAME_HN'];
        this.OFFICE_NAME = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
        this.POST = f[0]['POST'];
        this.POST_HN = f[0]['POST_HN'];
      }
      if (
        this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1 == null ||
        this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1 == undefined ||
        this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1 == ''
      ) {
        this.SIGNNAME2 = '';
        this.NAME_HN2 = '';
        this.POST2 = '';
        this.POST2_HIN = '';
        this.OFFICE_NAME2 = '';
        this.OFFICE_NAME2_HIN = '';
      } else {
        var f = this.Signaturearray1.filter(
          (item) => item.ID == this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1
        );
        this.SIGNNAME2 = f[0]['NAME'];
        this.NAME_HN2 = f[0]['NAME_HN'];
        this.POST2 = f[0]['POST'];
        this.POST2_HIN = f[0]['POST_HN'];
        this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
      }
    } else if (this.Order == 'L') {
      if (
        this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2 == null ||
        this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2 == undefined ||
        this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2 == ''
      ) {
        this.SECTION_TYPE = '';
        this.SIGNNAME = '';
        this.NAME_HN = '';
        this.OFFICE_NAME = '';
        this.OFFICE_NAME_HN = '';
        this.POST = '';
        this.POST_HN = '';
      } else {
        var f = this.Signaturearray1.filter(
          (item) =>
            item.ID == this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2
        );
        this.SIGNNAME3 = f[0]['NAME'];
        this.NAME_HN3 = f[0]['NAME_HN'];
        this.POST3 = f[0]['POST'];
        this.POST3_HIN = f[0]['POST_HN'];
        this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
        this.SECTION_TYPE = f[0]['SECTION_TYPE'];
        this.SIGNNAME = f[0]['NAME'];
        this.NAME_HN = f[0]['NAME_HN'];
        this.OFFICE_NAME = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
        this.POST = f[0]['POST'];
        this.POST_HN = f[0]['POST_HN'];
      }
      if (
        this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1 == null ||
        this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1 == undefined ||
        this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1 == ''
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
            item.ID == this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1
        );
        this.SIGNNAME2 = f[0]['NAME'];
        this.NAME_HN2 = f[0]['NAME_HN'];
        this.POST2 = f[0]['POST'];
        this.POST2_HIN = f[0]['POST_HN'];
        this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
      }
    } else if (this.Order == 'AO') {
      if (
        this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2 == null ||
        this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2 == undefined ||
        this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2 == ''
      ) {
        this.SECTION_TYPE = '';
        this.SIGNNAME = '';
        this.NAME_HN = '';
        this.OFFICE_NAME = '';
        this.OFFICE_NAME_HN = '';
        this.POST = '';
        this.POST_HN = '';
      } else {
        var f = this.Signaturearray1.filter(
          (item) =>
            item.ID == this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2
        );
        this.SIGNNAME3 = f[0]['NAME'];
        this.NAME_HN3 = f[0]['NAME_HN'];
        this.POST3 = f[0]['POST'];
        this.POST3_HIN = f[0]['POST_HN'];
        this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
        this.SECTION_TYPE = f[0]['SECTION_TYPE'];
        this.SIGNNAME = f[0]['NAME'];
        this.NAME_HN = f[0]['NAME_HN'];
        this.OFFICE_NAME = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
        this.POST = f[0]['POST'];
        this.POST_HN = f[0]['POST_HN'];
      }
      if (
        this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1 == null ||
        this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1 == undefined ||
        this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1 == ''
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
            item.ID == this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1
        );
        this.SIGNNAME2 = f[0]['NAME'];
        this.NAME_HN2 = f[0]['NAME_HN'];
        this.POST2 = f[0]['POST'];
        this.POST2_HIN = f[0]['POST_HN'];
        this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
        this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
      }
    }
  }
  printLatestOrderModalVisible1: boolean = false;
  save() {}

  close(): void {
    this.isSpinning = false;
    this.drawerClose();
  }

  printOrderModalVisible: boolean = false;

  openPrintOrderModal() {
    this.api
      .getclaimMaster2(0, 0, 'ID', 'ASC', ' AND ID= ' + this.orderdata.ID)
      .subscribe(
        (data) => {
          this.orderdata = data['data'][0];
        },
        (err) => {}
      );
    this.printOrderModalVisible = true;
  }

  printLatestOrderModalVisible: boolean = false;
  openPrintOrderModalLatest() {
    this.api
      .getclaimMaster2(0, 0, 'ID', 'ASC', ' AND ID= ' + this.orderdata.ID)
      .subscribe(
        (data) => {
          this.orderdata = data['data'][0];
        },
        (err) => {}
      );
    this.printLatestOrderModalVisible = true;
  }

  printLatestAdvanceOrderModalVisible: boolean = false;
  openPrintAdvanceOrderModalLatest() {
    this.api
      .getclaimMaster2(0, 0, 'ID', 'ASC', ' AND ID= ' + this.orderdata.ID)
      .subscribe(
        (data) => {
          this.orderdata = data['data'][0];
        },
        (err) => {}
      );
    this.printLatestAdvanceOrderModalVisible = true;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printLatestOrderModalCancel() {
    this.printLatestOrderModalVisible = false;
  }
  printAdvanceOrderModalCancel() {
    this.printLatestAdvanceOrderModalVisible = false;
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
    // if (
    //   this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1 == undefined ||
    //   this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1 == null ||
    //   this.orderSignatureData.CLAIM_ORDER_SIGNATURE_1 == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2 == undefined ||
    //   this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2 == null ||
    //   this.orderSignatureData.CLAIM_ORDER_SIGNATURE_2 == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature 2', '');
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
      for (let index = 0; index < this.HospitalMapping.length; index++) {
        if (this.HospitalMapping[index].NAME_HN == '') {
          this.isfound = 1;
        } else if (this.HospitalMapping[index].ADDRESS_HN == '') {
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
        this.isSpinning = true;
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
              this.dataa.DESIGNATION_NAME_HN =
                this.orderdata.DESIGNATION_NAME_HN;
              this.orderdata.SUB_STAGE = 'O';
              this.orderdata.ORDER_DATE = this.datePipe.transform(
                this.orderdata.ORDER_DATE,
                'yyyy-MM-dd'
              );
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
                            index < this.HospitalMapping.length;
                            index++
                          ) {
                            this.HospitalMapping[index].CREATED_MODIFIED_DATE =
                              '';
                            this.HospitalMapping[index].IS_VISIBLE_IN_ORDER =
                              this.HospitalMapping[index].IS_VISIBLE_IN_ORDER ==
                              true
                                ? 1
                                : 0;
                          }

                          this.api
                            .updatebulk(this.HospitalMapping)
                            .subscribe((successCode) => {
                              if (successCode.code == '200') {
                                // this.message.success(
                                //   'Information updated Successfully',
                                //   ''
                                // );
                                this.orderSignatureData.CLAIM_ID =
                                  this.orderdata.ID;
                                if (this.orderSignatureData.ID) {
                                  this.api
                                    .UpdateMedicalSignature(
                                      this.orderSignatureData
                                    )
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
                                            ' AND CLAIM_ID = ' +
                                              this.orderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                if (data['data'].length > 0) {
                                                  this.orderSignatureData =
                                                    data['data'][0];
                                                  if (
                                                    data['data'][0][
                                                      'ADV_ORDER_HEADER'
                                                    ]
                                                  ) {
                                                    this.orderSignatureData.ADV_ORDER_HEADER =
                                                      data['data'][0][
                                                        'ADV_ORDER_HEADER'
                                                      ];
                                                  } else {
                                                    this.orderSignatureData.ADV_ORDER_HEADER =
                                                      '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351; , &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340; (&#2346;&#2381;&#2352;&#2358;&#2366;&#2360;&#2344; &#2319;&#2357;&#2306; &#2335;&#2368;&#2346;&#2368;&#2319;&#2360;), &#2350;&#2369;&#2306;&#2348;&#2312;</div><div>OFFICE OF THE COMMISSIONER OF INCOME-TAX (ADMIN, &amp; TPS)</div><div>&#2340;&#2368;&#2360;&#2352;&#2368; &#2350;&#2306;&#2332;&#2367;&#2354;, &#2310;&#2351;&#2325;&#2352; &#2349;&#2357;&#2344;, &#2350;&#2361;&#2352;&#2381;&#2359;&#2368; &#2325;&#2352;&#2381;&#2357;&#2375; &#2352;&#2379;&#2337;, &#2350;&#2369;&#2306;&#2348;&#2312; -20</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI-20</div>';
                                                  }
                                                } else {
                                                  this.orderSignatureData =
                                                    new MedicalSignatureData();

                                                  this.orderSignatureData.ADV_ORDER_HEADER =
                                                    '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351; , &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340; (&#2346;&#2381;&#2352;&#2358;&#2366;&#2360;&#2344; &#2319;&#2357;&#2306; &#2335;&#2368;&#2346;&#2368;&#2319;&#2360;), &#2350;&#2369;&#2306;&#2348;&#2312;</div><div>OFFICE OF THE COMMISSIONER OF INCOME-TAX (ADMIN, &amp; TPS)</div><div>&#2340;&#2368;&#2360;&#2352;&#2368; &#2350;&#2306;&#2332;&#2367;&#2354;, &#2310;&#2351;&#2325;&#2352; &#2349;&#2357;&#2344;, &#2350;&#2361;&#2352;&#2381;&#2359;&#2368; &#2325;&#2352;&#2381;&#2357;&#2375; &#2352;&#2379;&#2337;, &#2350;&#2369;&#2306;&#2348;&#2312; -20</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI-20</div>';
                                                }
                                                this.message.success(
                                                  ' Information Updated Successfully...',
                                                  ''
                                                );
                                                this.openPrintOrderModal();
                                              } else {
                                                this.orderSignatureData = [];
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
                                  this.api
                                    .CreateMedicalSignature(
                                      this.orderSignatureData
                                    )
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
                                            ' AND CLAIM_ID = ' +
                                              this.orderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                if (data['data'].length > 0) {
                                                  this.orderSignatureData =
                                                    data['data'][0];
                                                  if (
                                                    data['data'][0][
                                                      'ADV_ORDER_HEADER'
                                                    ]
                                                  ) {
                                                    this.orderSignatureData.ADV_ORDER_HEADER =
                                                      data['data'][0][
                                                        'ADV_ORDER_HEADER'
                                                      ];
                                                  } else {
                                                    this.orderSignatureData.ADV_ORDER_HEADER =
                                                      '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351; , &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340; (&#2346;&#2381;&#2352;&#2358;&#2366;&#2360;&#2344; &#2319;&#2357;&#2306; &#2335;&#2368;&#2346;&#2368;&#2319;&#2360;), &#2350;&#2369;&#2306;&#2348;&#2312;</div><div>OFFICE OF THE COMMISSIONER OF INCOME-TAX (ADMIN, &amp; TPS)</div><div>&#2340;&#2368;&#2360;&#2352;&#2368; &#2350;&#2306;&#2332;&#2367;&#2354;, &#2310;&#2351;&#2325;&#2352; &#2349;&#2357;&#2344;, &#2350;&#2361;&#2352;&#2381;&#2359;&#2368; &#2325;&#2352;&#2381;&#2357;&#2375; &#2352;&#2379;&#2337;, &#2350;&#2369;&#2306;&#2348;&#2312; -20</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI-20</div>';
                                                  }
                                                } else {
                                                  this.orderSignatureData =
                                                    new MedicalSignatureData();

                                                  this.orderSignatureData.ADV_ORDER_HEADER =
                                                    '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351; , &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340; (&#2346;&#2381;&#2352;&#2358;&#2366;&#2360;&#2344; &#2319;&#2357;&#2306; &#2335;&#2368;&#2346;&#2368;&#2319;&#2360;), &#2350;&#2369;&#2306;&#2348;&#2312;</div><div>OFFICE OF THE COMMISSIONER OF INCOME-TAX (ADMIN, &amp; TPS)</div><div>&#2340;&#2368;&#2360;&#2352;&#2368; &#2350;&#2306;&#2332;&#2367;&#2354;, &#2310;&#2351;&#2325;&#2352; &#2349;&#2357;&#2344;, &#2350;&#2361;&#2352;&#2381;&#2359;&#2368; &#2325;&#2352;&#2381;&#2357;&#2375; &#2352;&#2379;&#2337;, &#2350;&#2369;&#2306;&#2348;&#2312; -20</div><div>3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI-20</div>';
                                                }
                                                this.message.success(
                                                  ' Information Save Successfully...',
                                                  ''
                                                );
                                                this.openPrintOrderModal();
                                              } else {
                                                this.orderSignatureData = [];
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
                              } else {
                                this.message.error('Information Not Saved', '');
                                this.isSpinning = false;
                              }
                            });
                          this.isSpinning = false;
                        } else {
                          this.message.error('Information Not Saved', '');
                          this.isSpinning = false;
                        }
                      });
                  } else if (successCode.code == '300') {
                    this.message.error(
                      'Email ID or Mobile No. Already Registered',
                      ''
                    );
                    this.isSpinning = false;
                  } else {
                    this.message.error('Information Not Saved', '');
                    this.isSpinning = false;
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
  isfoundLatest: any = 0;
  pakagedataLatest() {
    this.ADMISSIBLE_AMOUNT_HN = this.amountinwordsh;
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

    // if (
    //   this.orderdata.SIGNATURE_ID == undefined ||
    //   this.orderdata.SIGNATURE_ID == null ||
    //   this.orderdata.SIGNATURE_ID == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature', '');
    // }
    // if (
    //   this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1 == undefined ||
    //   this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1 == null ||
    //   this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_1 == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2 == undefined ||
    //   this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2 == null ||
    //   this.orderSignatureData.CLAIM_NEW_ORDER_SIGNATURE_2 == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature 2', '');
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
      for (let index = 0; index < this.HospitalMapping.length; index++) {
        if (this.HospitalMapping[index].NAME_HN == '') {
          this.isfoundLatest = 1;
        } else if (this.HospitalMapping[index].ADDRESS_HN == '') {
          this.isfoundLatest = 2;
        }
      }
      if (this.isfoundLatest == 1) {
        this.message.error('Please Enter Name Of Hospital(in hindi)', '');
        this.isfoundLatest = null;
      } else if (this.isfoundLatest == 2) {
        this.message.error('Please Enter Address Of Hospital(in hindi)', '');
        this.isfoundLatest = null;
      } else {
        this.isSpinning = true;
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
              this.orderdata.ORDER_DATE = this.datePipe.transform(
                this.orderdata.ORDER_DATE,
                'yyyy-MM-dd'
              );
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
                            index < this.HospitalMapping.length;
                            index++
                          ) {
                            this.HospitalMapping[index].CREATED_MODIFIED_DATE =
                              '';
                            this.HospitalMapping[index].IS_VISIBLE_IN_ORDER =
                              this.HospitalMapping[index].IS_VISIBLE_IN_ORDER ==
                              true
                                ? 1
                                : 0;
                          }

                          this.api
                            .updatebulk(this.HospitalMapping)
                            .subscribe((successCode) => {
                              if (successCode.code == '200') {
                                this.orderSignatureData.CLAIM_ID =
                                  this.orderdata.ID;
                                if (this.orderSignatureData.ID) {
                                  this.api
                                    .UpdateMedicalSignature(
                                      this.orderSignatureData
                                    )
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
                                            ' AND CLAIM_ID = ' +
                                              this.orderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                if (data['data'].length > 0) {
                                                  this.orderSignatureData =
                                                    data['data'][0];
                                                  this.orderSignatureData.NEW_ORDER_HEADER =
                                                    data['data'][0][
                                                      'NEW_ORDER_HEADER'
                                                    ];
                                                } else {
                                                  this.orderSignatureData =
                                                    new MedicalSignatureData();
                                                }
                                                this.message.success(
                                                  ' Information Updated Successfully...',
                                                  ''
                                                );
                                                this.openPrintOrderModalLatest();
                                              } else {
                                                this.orderSignatureData = [];
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
                                  this.api
                                    .CreateMedicalSignature(
                                      this.orderSignatureData
                                    )
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
                                            ' AND CLAIM_ID = ' +
                                              this.orderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                if (data['data'].length > 0) {
                                                  this.orderSignatureData =
                                                    data['data'][0];
                                                  this.orderSignatureData.NEW_ORDER_HEADER =
                                                    data['data'][0][
                                                      'NEW_ORDER_HEADER'
                                                    ];
                                                } else {
                                                  this.orderSignatureData =
                                                    new MedicalSignatureData();
                                                }
                                                this.message.success(
                                                  ' Information Save Successfully...',
                                                  ''
                                                );
                                                this.openPrintOrderModalLatest();
                                              } else {
                                                this.orderSignatureData = [];
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
                                // this.message.success(
                                //   'Information updated Successfully',
                                //   ''
                                // );
                              } else {
                                this.message.error('Information Not Saved', '');
                                this.isSpinning = false;
                              }
                            });
                          this.isSpinning = false;
                          this.openPrintOrderModalLatest();
                        } else {
                          this.message.error('Information Not Saved', '');
                          this.isSpinning = false;
                        }
                      });
                  } else if (successCode.code == '300') {
                    this.message.error(
                      'Email ID or Mobile No. Already Registered',
                      ''
                    );
                    this.isSpinning = false;
                  } else {
                    this.message.error('Information Not Saved', '');
                    this.isSpinning = false;
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
  pakageadvancedataLatest() {
    this.ADMISSIBLE_AMOUNT_HN = this.amountinwordsh;
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
    // if (
    //   this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1 == undefined ||
    //   this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1 == null ||
    //   this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_1 == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2 == undefined ||
    //   this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2 == null ||
    //   this.orderSignatureData.ADV_CLAIM_ORDER_SIGNATURE_2 == ''
    // ) {
    //   // this.isOk = false;
    //   this.message.error('Please Select Signature 2', '');
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
      for (let index = 0; index < this.HospitalMapping.length; index++) {
        if (this.HospitalMapping[index].NAME_HN == '') {
          this.isfoundLatest = 1;
        } else if (this.HospitalMapping[index].ADDRESS_HN == '') {
          this.isfoundLatest = 2;
        }
      }
      if (this.isfoundLatest == 1) {
        this.message.error('Please Enter Name Of Hospital(in hindi)', '');
        this.isfoundLatest = null;
      } else if (this.isfoundLatest == 2) {
        this.message.error('Please Enter Address Of Hospital(in hindi)', '');
        this.isfoundLatest = null;
      } else {
        this.isSpinning = true;
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
              this.orderdata.ORDER_DATE = this.datePipe.transform(
                this.orderdata.ORDER_DATE,
                'yyyy-MM-dd'
              );
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
                            index < this.HospitalMapping.length;
                            index++
                          ) {
                            this.HospitalMapping[index].CREATED_MODIFIED_DATE =
                              '';
                            this.HospitalMapping[index].IS_VISIBLE_IN_ORDER =
                              this.HospitalMapping[index].IS_VISIBLE_IN_ORDER ==
                              true
                                ? 1
                                : 0;
                          }

                          this.api
                            .updatebulk(this.HospitalMapping)
                            .subscribe((successCode) => {
                              if (successCode.code == '200') {
                                this.orderSignatureData.CLAIM_ID =
                                  this.orderdata.ID;
                                if (this.orderSignatureData.ID) {
                                  this.api
                                    .UpdateMedicalSignature(
                                      this.orderSignatureData
                                    )
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
                                            ' AND CLAIM_ID = ' +
                                              this.orderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                if (data['data'].length > 0) {
                                                  this.orderSignatureData =
                                                    data['data'][0];
                                                  if (
                                                    data['data'][0][
                                                      'FINAL_ORDER_HEADER'
                                                    ]
                                                  ) {
                                                    this.orderSignatureData.FINAL_ORDER_HEADER =
                                                      data['data'][0][
                                                        'FINAL_ORDER_HEADER'
                                                      ];
                                                  } else {
                                                    this.orderSignatureData.FINAL_ORDER_HEADER =
                                                      '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
                                                  }
                                                } else {
                                                  this.orderSignatureData =
                                                    new MedicalSignatureData();

                                                  this.orderSignatureData.FINAL_ORDER_HEADER =
                                                    '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
                                                }

                                                this.message.success(
                                                  ' Information Updated Successfully...',
                                                  ''
                                                );
                                                this.openPrintAdvanceOrderModalLatest();
                                              } else {
                                                this.orderSignatureData = [];
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
                                  this.api
                                    .CreateMedicalSignature(
                                      this.orderSignatureData
                                    )
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
                                            ' AND CLAIM_ID = ' +
                                              this.orderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                if (data['data'].length > 0) {
                                                  this.orderSignatureData =
                                                    data['data'][0];
                                                  if (
                                                    data['data'][0][
                                                      'FINAL_ORDER_HEADER'
                                                    ]
                                                  ) {
                                                    this.orderSignatureData.FINAL_ORDER_HEADER =
                                                      data['data'][0][
                                                        'FINAL_ORDER_HEADER'
                                                      ];
                                                  } else {
                                                    this.orderSignatureData.FINAL_ORDER_HEADER =
                                                      '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
                                                  }
                                                } else {
                                                  this.orderSignatureData =
                                                    new MedicalSignatureData();

                                                  this.orderSignatureData.FINAL_ORDER_HEADER =
                                                    '<div>&#2325;&#2366;&#2352;&#2381;&#2351;&#2366;&#2354;&#2351;, &#2346;&#2381;&#2352;&#2343;&#2366;&#2344; &#2350;&#2369;&#2326;&#2381;&#2351; &#2310;&#2351;&#2325;&#2352; &#2310;&#2351;&#2369;&#2325;&#2381;&#2340;, &#2350;&#2369;&#2306;&#2348;&#2312;</div><div class="family">OFFICE OF THE</div><div class="family">PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX,</div><div class="family">MUMBAI</div><div class="family">3<span>rd</span>&#160;FLOOR, AAYAKAR BHAVAN, MAHARSHI KARVE ROAD, MUMBAI - 400020</div><div>(022) - 22016691/22077187 / Fax: 022- 22079273/22077187</div>';
                                                }

                                                this.message.success(
                                                  ' Information Save Successfully...',
                                                  ''
                                                );
                                                this.openPrintAdvanceOrderModalLatest();
                                              } else {
                                                this.orderSignatureData = [];
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
                                // this.message.success(
                                //   'Information updated Successfully',
                                //   ''
                                // );
                              } else {
                                this.message.error('Information Not Saved', '');
                                this.isSpinning = false;
                              }
                            });
                          this.isSpinning = false;
                          this.openPrintAdvanceOrderModalLatest();
                        } else {
                          this.message.error('Information Not Saved', '');
                          this.isSpinning = false;
                        }
                      });
                  } else if (successCode.code == '300') {
                    this.message.error(
                      'Email ID or Mobile No. Already Registered',
                      ''
                    );
                    this.isSpinning = false;
                  } else {
                    this.message.error('Information Not Saved', '');
                    this.isSpinning = false;
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

  fileName: string = 'Sanction Order';
  pdfDownload: boolean = false;

  public generatePDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('printOrderModal');

    html2pdf()
      .from(data)
      .set({
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        margin: [2, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.pdfDownload = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.pdfDownload = false;
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');

    // var i = 0;
    // var date = new Date();
    // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
    // var dates = this.datePipe.transform(date, "h:mm:ss a");
    // var data = document.getElementById('print');
    // var opt = {
    //   margin: 0.2,
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 4 },
    //   jsPDF: { unit: 'in', orientation: 'landscape', width: 'imgWidth' }
    // };

    // html2pdf().set(opt).from(data).save(this.formTitle);
  }
  public generateLatestOrderPDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('printOrderModalLatest');

    html2pdf()
      .from(data)
      .set({
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        margin: [2, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.loadingRecords = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.loadingRecords = false;
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');

    // var i = 0;
    // var date = new Date();
    // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
    // var dates = this.datePipe.transform(date, "h:mm:ss a");
    // var data = document.getElementById('print');
    // var opt = {
    //   margin: 0.2,
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 4 },
    //   jsPDF: { unit: 'in', orientation: 'landscape', width: 'imgWidth' }
    // };

    // html2pdf().set(opt).from(data).save(this.formTitle);
  }
  public generateAdvanceOrderPDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('printOrderModalAdvance');

    html2pdf()
      .from(data)
      .set({
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        margin: [2, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.loadingRecords = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.loadingRecords = false;
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');

    // var i = 0;
    // var date = new Date();
    // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
    // var dates = this.datePipe.transform(date, "h:mm:ss a");
    // var data = document.getElementById('print');
    // var opt = {
    //   margin: 0.2,
    //   image: { type: 'jpeg', quality: 0.98 },
    //   html2canvas: { scale: 4 },
    //   jsPDF: { unit: 'in', orientation: 'landscape', width: 'imgWidth' }
    // };

    // html2pdf().set(opt).from(data).save(this.formTitle);
  }

  GET_SIGNATURE_IDS: any;
  HeadOfOffice: any;
  HeadOfOfficeHn: any;

  getAllUsers() {
    this.HeadOfOffice = '';
    this.HeadOfOfficeHn = '';

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
  signatureData: any = [];
  Name = '';

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
      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];
    } else {
      this.SIGNNAME3 = '';
      this.NAME_HN3 = '';
      this.POST3 = '';
      this.POST3_HIN = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME3_HIN = '';
      this.SECTION_TYPE = '';
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HN = '';
      this.POST = '';
      this.POST_HN = '';
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
