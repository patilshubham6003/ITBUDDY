import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-self-declaration-certificate',
  templateUrl: './self-declaration-certificate.component.html',
  styleUrls: ['./self-declaration-certificate.component.css'],
})
export class SelfDeclarationCertificateComponent implements OnInit {
  @Input() drawerClose;
  @Input() selftoursanctionorder: any;
  @Input() selfdeclarationdata: any;

  @Input() data;
  constructor() {}
  isVisible = false;
  loadingRecords: boolean = false;
  pdfDownload: boolean = false;
  ngOnInit(): void {}

  orderBtn() {
    this.isVisible = true;
  }

  close(): void {
    this.drawerClose();
  }

  download() {}

  print() {}
  printOrderModalVisible = false;
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
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Certificate Duplicate.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
}
