import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
@Component({
  selector: 'app-travellingallouncebill',
  templateUrl: './travellingallouncebill.component.html',
  styleUrls: ['./travellingallouncebill.component.css'],
})
export class TravellingallouncebillComponent implements OnInit {
  @Input() tform: any;
  @Input() tPform: any;
  @Input() tourtravellingllounce: Tourmaster;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) { }
  @Input() drawerClose: any;
  @Input() travellingdata: any;
  pdfDownload: boolean = false;
  ngOnInit(): void {
    // this.getDocument()
  }

  getDocument() {
    this.api.gettransferdata(0, 0, 'ID', 'desc', ' ').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.tform = data['data'][0];
        }
      },
      (err) => {

      }
    );

    this.api
      .gettransfarchnagedetailspersonal(0, 0, 'ID', 'desc', ' ')
      .subscribe(
        (data) => {
          if (data['count'] > 0) {
            this.tPform = data['data'];
          }
        },
        (err) => {

        }
      );
  }

  visible2 = false;
  visible = false;

  open2(): void {
    this.visible2 = true;
  }

  close(): void {
    this.drawerClose();
  }

  openpdf() {
    const element = document.getElementById('excel-table2');
    const opt = {
      margin: 0.2,
      filename: 'Travelling Allowance.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  showmodal() {
    if (this.tourtravellingllounce.TRAVELLING_ALLOWANCE_DATE == undefined) {
      this.tourtravellingllounce.TRAVELLING_ALLOWANCE_DATE = null;
    } else {
      this.tourtravellingllounce.TRAVELLING_ALLOWANCE_DATE =
        this.datepipe.transform(
          this.tourtravellingllounce.TRAVELLING_ALLOWANCE_DATE,
          'yyyy-MM-dd'
        );
    }
    this.api.updatetour(this.tourtravellingllounce).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.loadingRecords = false;
        // this.printModel();
        this.message.success('Information Saved Successfully...', '');
        this.printOrderModalVisible = true;
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

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
}
