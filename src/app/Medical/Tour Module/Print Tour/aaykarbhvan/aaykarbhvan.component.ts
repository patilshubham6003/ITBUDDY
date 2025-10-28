import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-aaykarbhvan',
  templateUrl: './aaykarbhvan.component.html',
  styleUrls: ['./aaykarbhvan.component.css'],
})
export class AaykarbhvanComponent implements OnInit {
  @Input() drawerClose;
  @Input() data: any;
  @Input() aayakarbhavandata: Tourmaster;
  @Input() SECTION_TYPE: any;
  @Input() SIGNNAME: any;
  @Input() NAME_HN: any;
  @Input() OFFICE_NAME: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() POST: any;
  @Input() POST_HN: any;
  pdfDownload: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  ngOnInit(): void {
    this.getAllUsers();
  }
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.drawerClose();
  }
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Aaykar.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
  printModel() {
    this.api
      .gettouralldata(0, 0, '', '', ' AND ID = ' + this.aayakarbhavandata.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.aayakarbhavandata = data['data'][0];
            // this.printOrderModalVisible = true;
          } else {
            // this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
  }
  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  showmodal() {
    this.api.updatetour(this.aayakarbhavandata).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.loadingRecords = false;
        this.api
          .gettouralldata(
            0,
            0,
            '',
            '',
            ' AND ID = ' + this.aayakarbhavandata.ID
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.aayakarbhavandata = data['data'][0];
                this.printOrderModalVisible = true;
              } else {
                // this.message.error("Can't Load Data", '');
              }
            },
            (err) => {}
          );

        this.message.success('Information Saved Successfully...', '');
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.loadingRecords = false;
      }
    });
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }
  Signaturearray: any = [];
  getAllUsers() {
    this.api.getSignature(0, 0, 'ID', 'desc', ' AND STATUS = 1 ').subscribe(
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
    this.SIGNNAME = f[0]['NAME'];
    this.NAME_HN = f[0]['NAME_HN'];
    this.OFFICE_NAME = f[0]['OFFICE_NAME'];
    this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
    this.POST = f[0]['POST'];
    this.POST_HN = f[0]['POST_HN'];
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
}
