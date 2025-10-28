import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-toursantionorder',
  templateUrl: './toursantionorder.component.html',
  styleUrls: ['./toursantionorder.component.css'],
})
export class ToursantionorderComponent implements OnInit {
  @Input() toursanctionorder: Tourmaster;
  @Input() tousanctionorder: any;
  @Input() drawerClose: any;
  @Input() SECTION_TYPE: any;
  @Input() SIGNNAME: any;
  @Input() NAME_HN: any;
  @Input() OFFICE_NAME: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() POST: any;
  @Input() POST_HN: any;
  pdfDownload: boolean = false;
  loadingRecords: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  // @Input() data

  isVisible = false;

  ngOnInit(): void {
    this.getAllUsers();
  }

  orderBtn() {
    this.isVisible = true;
  }

  close(): void {
    this.drawerClose();
  }

  download() {}

  print() {}
  printModel() {
    this.api
      .gettransferdata(0, 0, '', '', ' AND ID = ' + this.toursanctionorder.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.toursanctionorder = data['data'][0];
            this.printOrderModalVisible = true;
          } else {
            // this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
  }
  printOrderModalVisible = false;
  showmodal() {
    this.api.updatetour(this.toursanctionorder).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Information Saved Successfully...', '');
        this.printOrderModalVisible = true;
      } else {
        this.message.error('Information Has Not Saved...', '');
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
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'tour Sanction Order.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
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
}
