import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { TranferapplicationMaster } from 'src/app/Medical/Models/transferapplication';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { ToWords } from 'to-words';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TransferMapData } from 'src/app/Medical/Models/TransFerSignatureClass';
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
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  @Input() SignatureOrderDataMap;
  @Input() drawerClose;
  @Input() transferallounceorder;
  @Input() tranferchnagesorder1;
  @Input() journeydetails;
  @Input() journeyfairfaird;
  @Input() raiamount;
  @Input() amount;
  @Input() railorder;
  @Input() accommodation;
  @Input() totacountofbill;
  @Input() istransport;
  @Input() drawerClaimData: TranferapplicationMaster;
  @Input() netAmountInWord;
  @Input() TravelModeNames;
  @Input() showPrivate;
  @Input() multiplication;
  @Input() fairpaidofpartb;
  @Input() weightrate;
  @Input() distance;
  @Input() amountt;
  @Input() totalofweight;
  @Input() grosspaymentvalue;
  @Input() nettotacountofbill;
  @Input() transferJourneyClaimedAmount;
  @Input() inspectorDestination;
  @Input() personalEffectsAddmissible;
  Signaturearray: any = [];
  GET_SIGNATURE_IDS: any;
  SIGNNAME: any;
  SIGNNAME1: any;
  SIGNNAME2: any;
  NAME_HN: any;
  NAME_HN1: any;
  NAME_HN2: any;
  POST: any;
  POST1: any;
  POST2: any;
  POST_HIN: any;
  POST1_HIN: any;
  POST2_HIN: any;
  OFFICE_NAME: any;
  OFFICE_NAME1: any;
  OFFICE_NAME2: any;
  OFFICE_NAME_HIN: any;
  OFFICE_NAME1_HIN: any;
  OFFICE_NAME2_HIN: any;
  SIGNNAME3: any;
  NAME_HN3: any;
  POST3: any;
  POST3_HIN: any;
  OFFICE_NAME3: any;
  OFFICE_NAME3_HIN: any;
  loadingRecords: boolean = false;
  privateVehicleMinFair: any;
  pdfDownload: boolean = false;
  editorConfigPara: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Remark...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };
  isAdmin: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    public cookie: CookieService
  ) {}
  isVisible = false;
  drawerData: TranferapplicationMaster = new TranferapplicationMaster();
  ngOnInit(): void {
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();
    this.fileNumberList();

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
          // ' AND STATUS!=false AND ID in(' + this.GET_SIGNATURE_IDS + ')'
          ' AND STATUS = 1 AND DDO_ID=' +
            Number(sessionStorage.getItem('ddoId'))
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Signaturearray = data['data'];
              if (this.Signaturearray.length > 0) {
                if (this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_1']) {
                  const abc = Number(
                    this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_2']) {
                  const abc = Number(
                    this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
                if (this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_3']) {
                  const abc = Number(
                    this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_3']
                  );
                  this.signature2(abc);
                }
                if (this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_4']) {
                  const abc = Number(
                    this.SignatureOrderDataMap['TRANSFER_ORDER_SIGNATURE_4']
                  );
                  this.signature3(abc);
                }
              }
            }
          },
          (err) => {}
        );
    }
  }

  orderBtn() {
    this.isVisible = true;
  }

  close(): void {
    this.drawerClose();
  }

  download() {}
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  total = 0;
  gettotal() {
    // if (
    //   this.drawerClaimData.CTG_ADMISIBLE_AMOUNT != undefined &&
    //   this.drawerClaimData.PERSONAL_EFFECT_ADMISIBLE_AMOUNT != undefined &&
    //   this.drawerClaimData.ROAD_MILEAGE_ADMISIBLE_AMOUNT != undefined &&
    //   this.drawerClaimData.JOURNEY_ADMISIBLE_AMOUNT != undefined &&
    //   this.drawerClaimData.PRIVATE_CONVIENCE_ADMISIBLE_AMOUNT != undefined
    // ) {
    //   this.total =
    //     Number(this.drawerClaimData.CTG_ADMISIBLE_AMOUNT) +
    //     Number(this.drawerClaimData.PERSONAL_EFFECT_ADMISIBLE_AMOUNT) +
    //     Number(this.drawerClaimData.ROAD_MILEAGE_ADMISIBLE_AMOUNT) +
    //     Number(this.drawerClaimData.JOURNEY_ADMISIBLE_AMOUNT) +
    //     Number(this.drawerClaimData.PRIVATE_CONVIENCE_ADMISIBLE_AMOUNT);
    // }

    if (
      this.drawerClaimData.CTG_TOTAL != undefined &&
      this.drawerClaimData.PERSONAL_EFFECT_TOTAL != undefined &&
      this.drawerClaimData.ROAD_MILEAGE_TOTAL != undefined &&
      this.drawerClaimData.JOURNEY_TOTAL != undefined &&
      this.drawerClaimData.PRIVATE_CONVEYANCE_TOTAL != undefined
    ) {
      this.total =
        Number(this.drawerClaimData.CTG_TOTAL) +
        Number(this.drawerClaimData.PERSONAL_EFFECT_TOTAL) +
        Number(this.drawerClaimData.ROAD_MILEAGE_TOTAL) +
        Number(this.transferJourneyClaimedAmount) +
        // Number(this.drawerClaimData.JOURNEY_TOTAL) +
        Number(this.drawerClaimData.PRIVATE_CONVEYANCE_TOTAL);
    }

    return this.total;
  }
  // gettotal() {
  //   if (
  //     this.drawerClaimData.CTG_ADMISIBLE_AMOUNT != undefined &&
  //     this.drawerClaimData.PERSONAL_EFFECT_ADMISIBLE_AMOUNT != undefined &&
  //     this.drawerClaimData.ROAD_MILEAGE_ADMISIBLE_AMOUNT != undefined &&
  //     this.drawerClaimData.JOURNEY_ADMISIBLE_AMOUNT != undefined &&
  //     this.drawerClaimData.PRIVATE_CONVIENCE_ADMISIBLE_AMOUNT != undefined
  //   ) {
  //     this.total =
  //       Number(this.drawerClaimData.CTG_ADMISIBLE_AMOUNT) +
  //       Number(this.drawerClaimData.PERSONAL_EFFECT_ADMISIBLE_AMOUNT) +
  //       Number(this.drawerClaimData.ROAD_MILEAGE_ADMISIBLE_AMOUNT) +
  //       Number(this.drawerClaimData.JOURNEY_ADMISIBLE_AMOUNT) +
  //       Number(this.drawerClaimData.PRIVATE_CONVIENCE_ADMISIBLE_AMOUNT);
  //   }

  //   return this.total;
  // }

  nettotal = 0;
  gettotall() {
    this.drawerClaimData.ORDER_FORM_NET_TOTAL = 0;
    if (this.drawerClaimData.ADVANCED_AMOUNT != undefined) {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        this.total - this.drawerClaimData.ADVANCED_AMOUNT;
    }
    return this.drawerClaimData.ORDER_FORM_NET_TOTAL;
  }
  getwords() {
    this.netAmountInWord = toWords.convert(
      Number(this.drawerClaimData.ORDER_FORM_NET_TOTAL),
      {
        currency: true,
      }
    );

    return this.netAmountInWord;
  }

  ordertotal: any;
  advanceamount: any;
  calculation(event: any) {
    if (
      this.drawerClaimData.ORDER_AIR_FARE != null &&
      this.drawerClaimData.ORDER_PERSONAL_EFFECT != undefined
    ) {
      this.drawerClaimData.ORDER_FORM_TOTAL =
        Number(event) +
        Number(this.drawerClaimData.ORDER_AIR_FARE) +
        Number(this.drawerClaimData.ORDER_PERSONAL_EFFECT);
    }

    if (this.drawerClaimData.IS_ADVANCE_TAKEN == true) {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        this.drawerClaimData.ORDER_FORM_TOTAL -
        Number(this.drawerClaimData.ADVANCED_AMOUNT);
    } else {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        Number(event) +
        Number(this.drawerClaimData.ORDER_AIR_FARE) +
        Number(this.drawerClaimData.ORDER_PERSONAL_EFFECT);
    }
  }

  calculation1(event: any) {
    if (
      this.drawerClaimData.ORDER_CTG != null &&
      this.drawerClaimData.ORDER_PERSONAL_EFFECT != undefined
    ) {
      this.drawerClaimData.ORDER_FORM_TOTAL =
        Number(this.drawerClaimData.ORDER_CTG) +
        Number(event) +
        Number(this.drawerClaimData.ORDER_PERSONAL_EFFECT);
    }

    if (this.drawerClaimData.IS_ADVANCE_TAKEN == true) {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        this.drawerClaimData.ORDER_FORM_TOTAL -
        Number(this.drawerClaimData.ADVANCED_AMOUNT);
    } else {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        Number(this.drawerClaimData.ORDER_CTG) +
        Number(event) +
        Number(this.drawerClaimData.ORDER_PERSONAL_EFFECT);
    }
  }

  calculation2(event: any) {
    if (
      this.drawerClaimData.ORDER_CTG != null &&
      this.drawerClaimData.ORDER_AIR_FARE != undefined
    ) {
      this.drawerClaimData.ORDER_FORM_TOTAL =
        Number(this.drawerClaimData.ORDER_CTG) +
        Number(this.drawerClaimData.ORDER_AIR_FARE) +
        Number(event);
    }

    if (this.drawerClaimData.IS_ADVANCE_TAKEN == true) {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        this.drawerClaimData.ORDER_FORM_TOTAL -
        Number(this.drawerClaimData.ADVANCED_AMOUNT);
    } else {
      this.drawerClaimData.ORDER_FORM_NET_TOTAL =
        Number(this.drawerClaimData.ORDER_CTG) +
        Number(this.drawerClaimData.ORDER_AIR_FARE) +
        Number(event);
    }
  }

  print() {
    this.loadingRecords = true;
    this.api
      .gettransferdata(0, 0, '', '', ' AND ID = ' + this.drawerClaimData.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.drawerClaimData = data['data'][0];
            this.printOrderModalVisible = true;
          } else {
            this.loadingRecords = false;
            // this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
  }
  printOrderModalVisible = false;

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
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Dated.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
  fileList: any = [];
  fileNumberList() {
    this.api
      .getFileMaster(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND HIRARCHY_ID in (9,10)',
        sessionStorage.getItem('userId')
      )
      .subscribe(
        (data: any) => {
          if (data['code'] == 200 && data['count'] > 0) {
            this.fileList = data['data'];
          } else {
            this.fileList = [];
          }
        },
        (err) => {}
      );
  }
  // index = 0;
  // getCount() {
  //   this.index += 1;
  //   return this.index;
  // }

  showmodal() {
    // this.advanceamount = this.drawerClaimData.ORDER_FORM_TOTAL;

    var isOk = true;

    // if (
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_1 === undefined ||
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_2 === undefined ||
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // } else if (
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_3 === undefined ||
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_3 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 3', '');
    // } else if (
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_4 === undefined ||
    //   this.SignatureOrderDataMap.TRANSFER_ORDER_SIGNATURE_4 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 4', '');
    // }

    if (isOk) {
      if (this.drawerClaimData.ORDER_FORM_DATE == undefined) {
        this.drawerClaimData.ORDER_FORM_DATE = null;
      } else {
        this.drawerClaimData.ORDER_FORM_DATE = this.datepipe.transform(
          this.drawerClaimData.ORDER_FORM_DATE,
          'yyyy-MM-dd'
        );
      }
      if (this.drawerClaimData.IS_EDITABLE_DESTINATION == false) {
        this.drawerClaimData.DESTINATION_REMARK = null;
      } else {
        this.drawerClaimData.DESTINATION_REMARK =
          this.drawerClaimData.DESTINATION_REMARK;
      }

      if (!this.isAdmin) {
        this.api
          .updatetransfer(this.drawerClaimData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              if (this.SignatureOrderDataMap.ID) {
                this.api
                  .UpdateTransferSignature(this.SignatureOrderDataMap)
                  .subscribe((successCode) => {
                    if (successCode.code === 200) {
                      this.message.success(
                        'Information Updated Successfully',
                        ''
                      );
                      this.printOrderModalVisible = true;
                      this.loadingRecords = false;

                      this.getData();
                    } else {
                      this.message.error('Failed To Update Information', '');
                      this.printOrderModalVisible = false;
                      this.loadingRecords = false;
                    }
                  });
              } else {
                this.SignatureOrderDataMap.TRANSFER_ID =
                  this.drawerClaimData.ID;

                this.api
                  .CreateTransferSignature(this.SignatureOrderDataMap)
                  .subscribe((response) => {
                    if (response.code === 200) {
                      this.message.success(
                        'Information Saved Successfully',
                        ''
                      );
                      this.printOrderModalVisible = true;
                      this.loadingRecords = false;

                      this.getData();
                    } else {
                      this.message.error('Failed to Save Information', '');
                      this.printOrderModalVisible = false;
                      this.loadingRecords = false;
                    }
                  });
              }
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

  getData() {
    this.api
      .GetTransferSignature(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.drawerClaimData.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.SignatureOrderDataMap = data['data'][0];
        } else {
          this.SignatureOrderDataMap = new TransferMapData();
        }
      });
  }

  destinationRemarkNull(event) {
    if (event == false) {
      this.drawerClaimData.DESTINATION_REMARK = null;
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

  signature2(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST2_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME2 = '';
      this.NAME_HN2 = '';
      this.POST2 = '';
      this.POST2_HIN = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME2_HIN = '';
    }
  }

  signature3(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME3 = f[0]['NAME'];
      this.NAME_HN3 = f[0]['NAME_HN'];
      this.POST3 = f[0]['POST'];
      this.POST3_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME3 = '';
      this.NAME_HN3 = '';
      this.POST3 = '';
      this.POST3_HIN = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME3_HIN = '';
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
