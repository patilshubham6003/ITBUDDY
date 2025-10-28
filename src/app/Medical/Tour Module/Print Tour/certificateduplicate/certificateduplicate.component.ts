import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-certificateduplicate',
  templateUrl: './certificateduplicate.component.html',
  styleUrls: ['./certificateduplicate.component.css'],
})
export class CertificateduplicateComponent implements OnInit {
  @Input() drawerClose;
  // @Input() data;
  @Input() certificatedata: Tourmaster;
  @Input() particularofhotelsdata1: any;
  constructor() {}
  ngOnInit(): void {}
  visible = false;
  pdfDownload: boolean = false;
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
      filename: 'CertificateDuplicate.pdf',
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
