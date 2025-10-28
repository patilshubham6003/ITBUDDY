import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
// import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-objection',
  templateUrl: './objection.component.html',
  styleUrls: ['./objection.component.css'],
})
export class ObjectionComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  isSpinning = false;
  printObjectionModalVisible: boolean = false;
  pdfDownload: boolean = false;

  close(ObjectionPage: NgForm): void {
    ObjectionPage.form.reset();
    this.drawerClose();
  }

  printObjectionModalCancel() {
    this.printObjectionModalVisible = false;
  }

  openPrintObjectionModal() {
    this.printObjectionModalVisible = true;
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  save() {
    this.openPrintObjectionModal();
  }

  generatePDF() {
    const element = document.getElementById('printObjectionModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    // html2pdf().from(element).set(opt).save();
  }
}
