import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
// import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css'],
})
export class VacancyComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  isSpinning = false;
  printVacancyModalVisible: boolean = false;
  pdfDownload: boolean = false;

  close(VacancyPage: NgForm): void {
    VacancyPage.form.reset();
    this.drawerClose();
  }

  save() {
    this.openPrintVacancyModal();
  }
  openPrintVacancyModal() {
    this.printVacancyModalVisible = true;
  }

  printVacancyModalCancel() {
    this.printVacancyModalVisible = false;
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

    // html2pdf().from(element).set(opt).save();
  }
}
