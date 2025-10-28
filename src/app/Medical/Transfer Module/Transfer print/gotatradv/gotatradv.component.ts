import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { TransferMapData } from 'src/app/Medical/Models/TransFerSignatureClass';
import { ToWords } from 'to-words';
const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'Rupees',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});
@Component({
  selector: 'app-gotatradv',
  templateUrl: './gotatradv.component.html',
  styleUrls: ['./gotatradv.component.css'],
})
export class GotatradvComponent {
  @Input() drawerClose!: Function;
  @Input() data: any;
  @Input() relationdataorder: any;
  @Input() totalprivate90: any;
  @Input() totalpersonal90: any;
  @Input() AdvanceBillMap: any;

  pdfDownload: boolean = false;

  Signaturearray: any = [];
  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
  GET_SIGNATURE_IDS: any;
  SIGNNAME: any;
  SIGNNAME1: any;
  NAME_HN: any;
  NAME_HN1: any;
  POST: any;
  POST1: any;
  POST_HIN: any;
  POST1_HIN: any;
  OFFICE_NAME: any;
  OFFICE_NAME1: any;
  OFFICE_NAME_HIN: any;
  OFFICE_NAME1_HIN: any;
  isAdmin: any;

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) {}
  ngOnInit(): void {
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();
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

    if (
      this.AdvanceBillMap.ADV_CTG == undefined ||
      this.AdvanceBillMap.ADV_CTG == null ||
      this.AdvanceBillMap.ADV_CTG == ''
    ) {
      this.AdvanceBillMap.ADV_CTG =
        '80% of ' +
        this.data.GRADE_PAY +
        ' = Rs' +
        this.data.TRANSFER_GRANT_BASIC_PAY_TOTAL +
        '/-';
    }

    if (
      this.AdvanceBillMap.ADV_AIR_FARE == undefined ||
      this.AdvanceBillMap.ADV_AIR_FARE == null ||
      this.AdvanceBillMap.ADV_AIR_FARE == ''
    ) {
      this.AdvanceBillMap.ADV_AIR_FARE =
        '90% of ' +
        this.data.TRA_ALLO_FARE_RS * this.relationdataorder.length +
        ' = Rs' +
        this.data.TRAVELLING_ALLOW_TOTAL +
        '/-';
    }
    if (
      this.AdvanceBillMap.ADV_PERSONAL_EFFECTS == undefined ||
      this.AdvanceBillMap.ADV_PERSONAL_EFFECTS == null ||
      this.AdvanceBillMap.ADV_PERSONAL_EFFECTS == ''
    ) {
      this.AdvanceBillMap.ADV_PERSONAL_EFFECTS =
        '90% of ' +
        this.data.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT +
        ' = Rs' +
        this.totalpersonal90 +
        '/-';
    }
    if (
      this.AdvanceBillMap.ADV_PRIVATE_CONVEYANCE == undefined ||
      this.AdvanceBillMap.ADV_PRIVATE_CONVEYANCE == null ||
      this.AdvanceBillMap.ADV_PRIVATE_CONVEYANCE == ''
    ) {
      this.AdvanceBillMap.ADV_PRIVATE_CONVEYANCE =
        '80% of ' +
        this.data.CHARGES_FOR_PRIVATE_CON_AMOUNT +
        ' = Rs' +
        this.totalprivate90 +
        '/-';
    }
  }

  getAllUsers() {
    if (
      this.GET_SIGNATURE_IDS !== null &&
      this.GET_SIGNATURE_IDS !== undefined
    ) {
      this.api
        .getSignature(
          0,
          0,
          'ID',
          'desc',
          // ' AND STATUS!=false AND ID in(' + this.GET_SIGNATURE_IDS + ') '
          ' AND STATUS = 1 AND DDO_ID=' +
            Number(sessionStorage.getItem('ddoId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Signaturearray = data['data'];
              if (this.AdvanceBillMap['ADV_TRANSFER_ADV_BILL_SIGNATURE_1']) {
                const abc = Number(
                  this.AdvanceBillMap['ADV_TRANSFER_ADV_BILL_SIGNATURE_1']
                );
                this.signature(abc);
              }
              if (this.AdvanceBillMap['ADV_TRANSFER_ADV_BILL_SIGNATURE_2']) {
                const abc = Number(
                  this.AdvanceBillMap['ADV_TRANSFER_ADV_BILL_SIGNATURE_2']
                );
                this.signature1(abc);
              }
            }
          },
          (err) => {}
        );
    }
  }

  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'TATRADV.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  showmodel() {
    var isOk = true;

    // if (
    //   this.AdvanceBillMap.ADV_TRANSFER_ADV_BILL_SIGNATURE_1 === undefined ||
    //   this.AdvanceBillMap.ADV_TRANSFER_ADV_BILL_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.AdvanceBillMap.ADV_TRANSFER_ADV_BILL_SIGNATURE_2 === undefined ||
    //   this.AdvanceBillMap.ADV_TRANSFER_ADV_BILL_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // }

    if (isOk) {
      if (
        this.data.ADVANCE_BILL_DATE != null &&
        this.data.ADVANCE_BILL_DATE != undefined &&
        this.data.ADVANCE_BILL_DATE != ''
      ) {
        this.data.ADVANCE_BILL_DATE = this.datepipe.transform(
          this.data.ADVANCE_BILL_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.data.ADVANCE_BILL_DATE = this.data.ADVANCE_BILL_DATE;
      }
      if (
        this.data.DATE_OF_TRANSFER != null &&
        this.data.DATE_OF_TRANSFER != undefined &&
        this.data.DATE_OF_TRANSFER != ''
      ) {
        this.data.DATE_OF_TRANSFER = this.datepipe.transform(
          this.data.DATE_OF_TRANSFER,
          'yyyy-MM-dd'
        );
      } else {
        this.data.DATE_OF_TRANSFER = this.data.DATE_OF_TRANSFER;
      }

      if (!this.isAdmin) {
        this.data.IS_TRANSFER_ADVANCE_CREATED = true;
        this.data.CURRENT_STAGE_ID = 7;
        this.api.updatetransfer(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.printOrderModalVisible = true;
            // this.message.success('Information Saved Successfully...', '');

            if (this.AdvanceBillMap.ID) {
              this.api
                .UpdateTransferSignature(this.AdvanceBillMap)
                .subscribe((successCode) => {
                  if (successCode.code === 200) {
                    this.message.success(
                      'Information Updated Successfully',
                      ''
                    );
                    this.printOrderModalVisible = true;
                    // this.loadingRecords = false;

                    this.getData();
                  } else {
                    this.message.error('Failed To Update Information', '');
                    this.printOrderModalVisible = false;
                    // this.loadingRecords = false;
                  }
                });
            } else {
              this.AdvanceBillMap.TRANSFER_ID = this.data.ID;

              this.api
                .CreateTransferSignature(this.AdvanceBillMap)
                .subscribe((response) => {
                  if (response.code === 200) {
                    this.message.success('Information Saved Successfully', '');
                    this.printOrderModalVisible = true;
                    // this.loadingRecords = false;

                    this.getData();
                  } else {
                    this.message.error('Failed to Save Information', '');
                    this.printOrderModalVisible = false;
                    // this.loadingRecords = false;
                  }
                });
            }
          } else {
            this.message.error('Information Has Not Saved...', '');
          }
        });
      } else {
        this.printOrderModalVisible = true;
      }
    }
  }

  getData() {
    this.api
      .GetTransferSignature(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.data.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.AdvanceBillMap = data['data'][0];
        } else {
          this.AdvanceBillMap = new TransferMapData();
        }
      });
  }

  printOrderModalVisible: boolean = false;
  close() {
    this.drawerClose();
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  ggetinwords(amount: any) {
    if (amount) {
      var amountinwords = toWords.convert(Number(amount), {
        currency: true,
      });
      return amountinwords;
    } else {
      return 0;
    }
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HIN = '';
    }
  }

  signature1(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME1 = f[0]['NAME'];
      this.NAME_HN1 = f[0]['NAME_HN'];
      this.POST1 = f[0]['POST'];
      this.POST1_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME1_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME1 = '';
      this.NAME_HN1 = '';
      this.POST1 = '';
      this.POST1_HIN = '';
      this.OFFICE_NAME1 = '';
      this.OFFICE_NAME1_HIN = '';
    }
  }

  drawerVisiblesign: boolean = false;
  opensignature() {
    this.drawerVisiblesign = true;
  }

  drawerClosesign(): void {
    this.drawerVisiblesign = false;
    this.getAllUsers();
  }
  get closeCallbacksign() {
    return this.drawerClosesign.bind(this);
  }
}
