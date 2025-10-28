import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-allotment-form',
  templateUrl: './allotment-form.component.html',
  styleUrls: ['./allotment-form.component.css'],
})
export class AllotmentFormComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any;
  isSpinning = false;
  printAllotmentModalVisible: boolean = false;
  pdfDownload: boolean = false;
  close(AllotmentPage: NgForm): void {
    AllotmentPage.form.reset();
    this.drawerClose();
  }

  save() {
    this.openPrintAllotmentModal();
  }
  openPrintAllotmentModal() {
    this.printAllotmentModalVisible = true;
  }

  printAllotmentModalCancel() {
    this.printAllotmentModalVisible = false;
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  generatePDF() {
    const element = document.getElementById('printVacancyModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  }
}
