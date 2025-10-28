// declare let html2pdf: any;
import { Component, Input } from '@angular/core';
// import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css'],
})
export class NoticeComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  isSpinning = false;
  printNoticeModalVisible: boolean = false;
  pdfDownload: boolean = false;

  close(): void {
    this.drawerClose();
  }

  printNoticeModalCancel() {
    this.printNoticeModalVisible = false;
  }

  openPrintNoticeModal() {
    this.printNoticeModalVisible = true;
  }

  getwidth() {
    if (window.innerWidth <= 420) {
      return 420;
    } else {
      return 860;
    }
  }

  save() {
    this.openPrintNoticeModal();
  }

  generatePDF() {
    const element = document.getElementById('printNoticeModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    // html2pdf().from(element).set(opt).save();
  }
}
