import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-traveling-allowance',
  templateUrl: './traveling-allowance.component.html',
  styleUrls: ['./traveling-allowance.component.css'],
})
export class TravelingAllowanceComponent implements OnInit {
  constructor(public api: ApiService) {}
  @Input() drawerClose;
  @Input() transferallounceorder;
  @Input() relationdataorder;
  @Input() tranvellingallounceorder;
  @Input() tranferchnagesorder;
  @Input() railorder;
  @Input() accommodation;
  @Input() journeydetails;
  pdfDownload: boolean = false;

  ngOnInit(): void {
    this.DataFromDDO();
  }
  DDO_Master_Data: any = [];
  DataFromDDO() {
    if (
      this.transferallounceorder &&
      this.transferallounceorder.DDO_OF_THE_OFFICIAL_ID
    ) {
      this.DDO_Master_Data = [];
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' +
            this.transferallounceorder.DDO_OF_THE_OFFICIAL_ID
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.DDO_Master_Data = data['data'];
              } else {
                this.DDO_Master_Data = [];
              }
            } else {
            }
          },
          (err) => {}
        );
    } else {
      this.DDO_Master_Data = [];
    }
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
      filename: 'Part-A.pdf',
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
