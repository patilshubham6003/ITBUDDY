import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { LTCSignatureMapData } from 'src/app/Medical/Models/LTCSignaturemap';
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
  selector: 'ls-gardrawer',
  templateUrl: './gardrawer.component.html',
  styleUrls: ['./gardrawer.component.css'],
})
export class GARDrawerComponent {
  @Input() drawerClose: any;
  @Input() ltcAdvanceGarMap: any;
  @Input() LTCGARdata: any;
  @Input() GAR37AdvanceAmount: any;
  @Input() totalAmountInEng: any;

  isAdmin: boolean = false;
  Signaturearray: any = [];
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
  GET_SIGNATURE_IDS: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
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
          ' AND STATUS = 1 AND DDO_ID=' +
            Number(sessionStorage.getItem('ddoId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Signaturearray = data['data'];
              if (this.Signaturearray.length > 0) {
                if (this.ltcAdvanceGarMap['ADV_LTC_GAR_SIGNATURE_1']) {
                  const abc = Number(
                    this.ltcAdvanceGarMap['ADV_LTC_GAR_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.ltcAdvanceGarMap['ADV_LTC_GAR_SIGNATURE_2']) {
                  const abc = Number(
                    this.ltcAdvanceGarMap['ADV_LTC_GAR_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
              }
            }
          },
          (err) => {}
        );
    }
  }
  loadingRecords: boolean = false;
  showmodal() {
    var isOk = true;
    // if (
    //   this.ltcAdvanceGarMap.ADV_LTC_GAR_SIGNATURE_1 === undefined ||
    //   this.ltcAdvanceGarMap.ADV_LTC_GAR_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.ltcAdvanceGarMap.ADV_LTC_GAR_SIGNATURE_2 === undefined ||
    //   this.ltcAdvanceGarMap.ADV_LTC_GAR_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // }

    if (isOk) {
      this.loadingRecords = true;
      if (!this.isAdmin) {
        this.api.ltcMasterUpdate(this.LTCGARdata).subscribe((successCode) => {
          if (successCode.code == '200') {
            if (this.ltcAdvanceGarMap.ID) {
              this.api
                .UpdateLTCSignature(this.ltcAdvanceGarMap)
                .subscribe((updateLTCResponse) => {
                  if (updateLTCResponse.code === 200) {
                    this.message.success(
                      'Information Updated Successfully',
                      ''
                    );
                    this.printOrderModalVisible = true;
                    this.loadingRecords = false;
                  } else {
                    this.message.error('Failed To Update Information', '');
                    this.loadingRecords = false;
                  }
                  this.getData();
                });
            } else {
              this.ltcAdvanceGarMap.LTC_ID = this.LTCGARdata.ID;
              this.api
                .CreateLTCSignature(this.ltcAdvanceGarMap)
                .subscribe((createLTCResponse) => {
                  if (createLTCResponse.code === 200) {
                    this.message.success('Information Saved Successfully', '');
                    this.printOrderModalVisible = true;
                    this.loadingRecords = false;
                  } else {
                    this.message.error('Failed to Save Information', '');
                    this.loadingRecords = false;
                  }
                  this.getData();
                });
            }
          } else {
            this.message.error('Information Has Not Saved...', '');
            this.loadingRecords = false;
          }
        });
      } else {
        this.printOrderModalVisible = true;
        this.loadingRecords = false;
      }
    }
  }

  getData() {
    this.api
      .GetLTCSignature(0, 0, '', 'asc', ' AND LTC_ID  = ' + this.LTCGARdata.ID)
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.ltcAdvanceGarMap = data['data'][0];
        } else {
          this.ltcAdvanceGarMap = new LTCSignatureMapData();
        }
      });
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
  close(): void {
    this.drawerClose();
  }

  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'LTC-GAR-37.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
  am = 100;
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

  getcurrentmonthyear() {
    var date = new Date();
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    return month + ' , ' + year;
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
