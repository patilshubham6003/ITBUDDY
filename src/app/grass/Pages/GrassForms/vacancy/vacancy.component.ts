import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css'],
})
export class VacancyComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any;
  @Input() ResidenceType: any;
  isSpinning = false;
  printVacancyModalVisible: boolean = false;
  pdfDownload: boolean = false;
  currentdate = new Date();
  savendate: any = new Date();
  close(VacancyPage: NgForm): void {
    VacancyPage.form.reset();
    this.drawerClose();
  }
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }
  filtergignatureid = '';
  userid: any;
  Signaturelist: any = [];
  TotalSignature: any = [];
  NAME: any;
  SIGNATURE_ID1: any;
  SECTION_TYPE: any = '';
  NAME_HN: any = '';
  OFFICE_NAME: any = '';
  OFFICE_NAME_HN: any = '';
  POST: any = '';
  POST_HN: any = '';
  DefaultSignature: any = [];
  ngOnInit(): void {
    var a: any;
    a = this.savendate.setDate(new Date().getDate() + 7);
    this.userid = Number(sessionStorage.getItem('userId'));

    this.filtergignatureid = ' AND SERVICE_ID = 5 ';
    this.getsignaturedata();
  }
  changesignature(event) {
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        this.filtergignatureid + ' AND ID =' + event
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.Signaturelist = data['data'];
            this.NAME = data['data'][0]['NAME'];

            this.TotalSignature = data['count'];
          } else {
            console.error('someting went wrong');
          }
        },
        (error) => { }
      );
  }
  getsignaturedata() {
    this.api
      .getSignature(0, 0, 'ID', 'desc', this.filtergignatureid)
      // this.filtergignatureid + ' AND USER_ID =' + this.userid
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Signaturelist = data['data'];
            // this.NAME = data['data'][0]['NAME'];

            for (let i = 0; i < this.Signaturelist.length; i++) {
              if (
                data['data'][i]['USER_ID'] ==
                Number(sessionStorage.getItem('userId'))
              ) {
                this.DefaultSignature = data['data'][i]['NAME'];
                this.NAME = this.DefaultSignature;
              }
            }
            this.TotalSignature = data['count'];
          } else {
            console.error('someting went wrong');
          }
        },
        (error) => { }
      );
  }

  save() {
    this.openPrintVacancyModal();
  }
  openPrintVacancyModal() {
    this.printVacancyModalVisible = true;
  }

  printVacancyModalCancel() {
    this.printVacancyModalVisible = false;
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  generatePDF() {
    this.pdfDownload = true;
    const element = document.getElementById('printVacancyModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 3 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  }

  getvacancylist() { }

  residenceTypeID: any;
  totalFlatRecords: any;
  flatList: any;
  RESIDENCE_TYPE_ID: any;
  RESIDENCE_TYPE_NAME: any;
  listOfFlat(event) {
    // this.currentMonth = this.datepipe.transform(new Date(), 'MM');
    // this.currentYear = this.datepipe.transform(new Date(), 'yyyy');
    // this.filter=" AND MONTH = "+this.currentMonth +" AND YEAR = "+this.currentYear
    this.totalFlatRecords = 0;
    this.residenceTypeID = '';
    if (event != null && event != undefined && event != '') {
      this.residenceTypeID = event;
      this.RESIDENCE_TYPE_ID = event;
      this.isSpinning = true;
      this.api
        .getQuarterMaster(
          0,
          0,
          '',
          '',
          " AND STATUS=1 AND AVAILABLE_STATUS = 'A'  AND RESIDENCE_TYPE_ID = " +
          event
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.flatList = data['data'];
                this.totalFlatRecords = data['count'];
                this.RESIDENCE_TYPE_NAME =
                  data['data'][0]['RESIDENCE_TYPE_NAME'];
                this.isSpinning = false;
              } else {
                this.isSpinning = false;
                this.flatList = [];
                this.RESIDENCE_TYPE_NAME = '';
              }
            } else {
              this.flatList = [];
              this.isSpinning = false;
            }
          },
          (err) => { }
        );
    } else {
      this.flatList = [];
      this.isSpinning = false;
    }
  }
}
