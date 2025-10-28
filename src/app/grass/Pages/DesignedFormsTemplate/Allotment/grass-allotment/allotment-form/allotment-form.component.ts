import { Component, Input, ViewEncapsulation } from '@angular/core';
// import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-allotment-form',
  templateUrl: './allotment-form.component.html',
  styleUrls: ['./allotment-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AllotmentFormComponent {
  @Input() drawerClose: Function;
  @Input()
  drawerVisible: boolean = false;
  loadingRecords = false;
  Spining;

  Download() {
    this.pdfVisible = true;
  }
  close(): void {
    this.drawerClose();
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  pdfVisible: boolean = false;

  printClose() {
    this.pdfVisible = false;
  }

  loading: boolean = false;
  openpdf() {
    this.loading = true;

    const element = document.getElementById('pdf');
    const opt = {
      margin: 0.2,
      filename: 'Find Allotment',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    // html2pdf().from(element).set(opt).save();
    this.loading = false;
  }
}
