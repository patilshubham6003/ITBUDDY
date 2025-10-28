// import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-ltcsanstionorder',
  templateUrl: './ltcsanstionorder.component.html',
  styleUrls: ['./ltcsanstionorder.component.css'],
  providers:[NzNotificationService]
})
export class LtcsanstionorderComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() namount: any;
  @Input() LTCdata: any;
  @Input() formdata7: any;
  // @Input() orderdata: any;
  // @Input() HospitalMapping: any;
  // @Input() queData: QuestionaryMaster = new QuestionaryMaster();
  // @Input() amountinwords1: any;
  // @Input() amountinwordsh1: any;
  // @Input() claimID: any;
  // @Input() empID: any;
  // @Input() SECTION_TYPE: any;
  // FROM_DATE: Date = new Date();
  // TO_DATE: Date = new Date();
  // TODAYS_DATE: Date = new Date();
  // PRINTED_DATE: Date = new Date();
  // FILE_NO: string = '';
  // isSpinning: boolean = false;
  // IS_EMERG_TREAT_AVAILED = 0;
  // IS_BILL_FILLED_IN_TIME = 0;
  // IS_HOSPITAL_EMPLANELLED;
  // Hospital_Type = 'NE';
  // NAME: string = 'shubham';
  // NAME_MR: string = '';
  // Expose_facto = true;
  // AMOUNT: number;
  // AMOUNT_WORDS: string;
  // am = 1000;
  // PATIENT_NAME_HN: string;
  // RELATIONSHIP_HN: string;
  // EMPLOYEE_NAME_HN: string;
  // ADMISSIBLE_AMOUNT_HN: any;
  // dataa: any;
  // radioValue: any = 'A';
  // @Input() fileList1 = [];
  // @Input() HospitalMapping1 = [];

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {}

  claimHospitalMapping = [];

  openPrintOrderModal() {
    this.printOrderModalVisible = true;
  }
  close(): void {
    this.drawerClose();
  }

  printOrderModalVisible: boolean = false;
  loadingRecords: boolean = false;

  Save() {
    this.loadingRecords = true;
    this.api.ltcMasterUpdate(this.LTCdata).subscribe((successCode) => {
      if (successCode.code == '200') {
        // this.drawerClose();
        this.loadingRecords = false;
        this.openPrintOrderModal();
        this.message.success('Information Saved Successfully...', '');
      } else {
        this.loadingRecords = false;
        this.message.error('Failed To Save Information....', '');
      }
    });
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

  fileName: string = 'HOD Order Letter';
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
}

