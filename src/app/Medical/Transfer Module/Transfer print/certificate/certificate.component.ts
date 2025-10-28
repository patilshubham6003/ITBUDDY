import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css'],
})
export class CertificateComponent implements OnInit {
  @Input() drawerClose;
  @Input() transferallounceorder;
  pdfDownload: boolean = false;
  constructor() {}

  ngOnInit(): void {}

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
      filename: 'Certificate.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  showmodal() {
    this.printOrderModalVisible = true;
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
