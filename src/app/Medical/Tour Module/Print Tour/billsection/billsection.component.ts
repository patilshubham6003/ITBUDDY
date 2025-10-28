import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-billsection',
  templateUrl: './billsection.component.html',
  styleUrls: ['./billsection.component.css'],
})
export class BillsectionComponent implements OnInit {
  @Input() drawerClose;
  @Input() billDrawerData;
  @Input() billsectiondata;
  isSpinning: boolean = false;
  pdfDownload: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.drawerClose();
  }
  openpdf(): void {
  }

  printOrderModalVisible: boolean = false;
  openPrintOrderModal() {
    if (this.billDrawerData.BILL_SECTION_DATE == undefined) {
      this.billDrawerData.BILL_SECTION_DATE = null;
    } else {
      this.billDrawerData.BILL_SECTION_DATE = this.datePipe.transform(
        this.billDrawerData.BILL_SECTION_DATE,
        'yyyy-MM-dd'
      );
    }
    this.api.updatetour(this.billDrawerData).subscribe((successCode) => {
      if (successCode.code == '200') {
        // this.loadingRecords = false;
        // this.printModel();
        this.message.success('Information Saved Successfully...', '');
        this.printOrderModalVisible = true;
      } else {
        this.message.error('Information Has Not Saved...', '');
        // this.loadingRecords = false;
      }
    });
  }

  showmodal() {
    this.api.updatetour(this.billDrawerData).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Information Saved Successfully...', '');
      } else {
        this.message.error('Information Has Not Saved...', '');
      }
    });
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
}
