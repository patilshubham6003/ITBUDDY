import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-goltc',
  templateUrl: './goltc.component.html',
  styleUrls: ['./goltc.component.css'],
  providers: [NzNotificationService]
})
export class GoltcComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) { }
  @Input() drawerClose: Function;
  @Input() formdata7: any;
  @Input() amount: any;
  @Input() namount: any;
  @Input() LTC4data: any;
  @Input() relationdata1: any;
  pdfDownload: boolean = false;
  ngOnInit(): void {
    this.fileNumberList();
  }

  visible = false;
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.drawerClose();
  }

  fileList: any = [];
  fileNumberList() {
    this.api
      .getFileMaster(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND HIRARCHY_ID in (3,4)',
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200 && data['count'] > 0) {
            this.fileList = data['data'];
          } else {
            this.fileList = [];
          }
        },
        (err) => {

        }
      );
  }
  openpdf() {
    const element = document.getElementById('GoLtcFinal');
    const opt = {
      margin: 0.2,
      filename: 'Go/Ltc/Final.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  save() {
    this.loadingRecords = true;
    this.api.ltcMasterUpdate(this.LTC4data).subscribe((successCode) => {
      if (successCode.code == '200') {
        // this.drawerClose();
        this.loadingRecords = false;
        this.printOrderModalVisible = true;
        this.message.success('Information Saved Successfully...', '');
      } else {
        this.loadingRecords = false;
        this.message.error('Failed To Save Information....', '');
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

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
}
