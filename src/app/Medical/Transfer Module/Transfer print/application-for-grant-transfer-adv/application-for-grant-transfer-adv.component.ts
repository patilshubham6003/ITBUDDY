import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-application-for-grant-transfer-adv',
  templateUrl: './application-for-grant-transfer-adv.component.html',
  styleUrls: ['./application-for-grant-transfer-adv.component.css'],
})
export class ApplicationForGrantTransferAdvComponent {
  @Input() drawerClose!: Function;
  @Input() data: any;
  @Input() relationdataorder: any;
  pdfDownload: boolean = false;

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) {}
  isAdmin: any;
  ngOnInit(): void {
    this.DataFromDDO();
    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
  DDO_Master_Data: any = [];
  DataFromDDO() {
    if (this.data && this.data.DDO_OF_THE_OFFICIAL_ID) {
      this.DDO_Master_Data = [];
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' + this.data.DDO_OF_THE_OFFICIAL_ID
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
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }
  openpdf() {
    const element = document.getElementById('printgpb');
    const opt = {
      margin: 0.2,
      filename: 'applicationforta.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
  printOrderModalVisible: boolean = false;
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  loadingRecords: boolean = false;
  showmodal() {
    // this.advanceamount = this.drawerClaimData.ORDER_FORM_TOTAL;
    this.loadingRecords = true;
    if (!this.isAdmin) {
      this.api.updatetransfer(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.loadingRecords = false;

          this.message.success('Information Saved Successfully...', '');
          this.printOrderModalVisible = true;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.loadingRecords = false;
        }
      });
    } else {
      this.loadingRecords = false;
      this.printOrderModalVisible = true;
    }
  }
}
