import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'ls-applicationdrawer',
  templateUrl: './applicationdrawer.component.html',
  styleUrls: ['./applicationdrawer.component.css'],
})
export class ApplicationdrawerComponent {
  @Input()
  drawerClose: any;
  @Input()
  applicationdrawerdata: any;
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.DataFromDDO();
  }

  DDO_Master_Data: any = [];
  DataFromDDO() {
    if (
      this.applicationdrawerdata &&
      this.applicationdrawerdata.DDO_OF_THE_OFFICIAL_ID
    ) {
      this.DDO_Master_Data = [];
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' +
            this.applicationdrawerdata.DDO_OF_THE_OFFICIAL_ID
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.DDO_Master_Data = data['data'][0];
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
  close(): void {
    this.drawerClose();
  }
  printOrderModalVisible: boolean = false;

  printModel() {
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

  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Part-A.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
}
