import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { LTCSignatureMapData } from 'src/app/Medical/Models/LTCSignaturemap';
@Component({
  selector: 'app-gpb-iiltc-advdrawer',
  templateUrl: './gpb-iiltc-advdrawer.component.html',
  styleUrls: ['./gpb-iiltc-advdrawer.component.css'],
})
export class GpbIIltcAdvdrawerComponent {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}
  @Input() drawerClose!: Function;
  @Input()
  LTCAdvOrderData: any;
  @Input()
  advOrderRelations: any;
  @Input()
  ordereligibleAmount: any;
  @Input()
  allowedAmountInEng: any;
  @Input()
  advOrderJourneyData: any;
  @Input()
  AdvanceOrderSignMap: any;
  pdfDownload: boolean = false;
  isAdmin: boolean = false;
  roleId: any;
  // isAdmin: boolean = false;
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

  ngOnInit(): void {
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();
    this.roleId = Number(sessionStorage.getItem('roleId'));
    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
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
                if (this.AdvanceOrderSignMap['ADV_LTC_ADV_ORDER_SIGNATURE_1']) {
                  const abc = Number(
                    this.AdvanceOrderSignMap['ADV_LTC_ADV_ORDER_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.AdvanceOrderSignMap['ADV_LTC_ADV_ORDER_SIGNATURE_2']) {
                  const abc = Number(
                    this.AdvanceOrderSignMap['ADV_LTC_ADV_ORDER_SIGNATURE_2']
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
  visible5 = false;
  open(): void {
    this.visible5 = true;
  }

  close(): void {
    this.drawerClose();
  }

  openpdf() {
    const element = document.getElementById('advOrder');
    const opt = {
      margin: 0.2,
      filename: 'Calculation.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  save() {
    var isOk = true;
    // if (
    //   this.AdvanceOrderSignMap.ADV_LTC_ADV_ORDER_SIGNATURE_1 === undefined ||
    //   this.AdvanceOrderSignMap.ADV_LTC_ADV_ORDER_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.AdvanceOrderSignMap.ADV_LTC_ADV_ORDER_SIGNATURE_2 === undefined ||
    //   this.AdvanceOrderSignMap.ADV_LTC_ADV_ORDER_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // }

    if (isOk) {
      if (this.LTCAdvOrderData.ADVANCE_ORDER_DATE) {
        this.LTCAdvOrderData.ADVANCE_ORDER_DATE = this.datepipe.transform(
          this.LTCAdvOrderData.ADVANCE_ORDER_DATE,
          'yyyy-MM-dd'
        );
      }

      this.loadingRecords = true;
      this.api
        .ltcMasterUpdate(this.LTCAdvOrderData)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            if (this.AdvanceOrderSignMap.ID) {
              this.api
                .UpdateLTCSignature(this.AdvanceOrderSignMap)
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
                  }
                  this.loadingRecords = false;
                  this.getData();
                });
            } else {
              this.AdvanceOrderSignMap.LTC_ID = this.LTCAdvOrderData.ID;
              this.api
                .CreateLTCSignature(this.AdvanceOrderSignMap)
                .subscribe((createLTCResponse) => {
                  if (createLTCResponse.code === 200) {
                    this.message.success('Information Saved Successfully', '');

                    this.printOrderModalVisible = true;
                    this.loadingRecords = false;
                  } else {
                    this.message.error('Failed to Save Information', '');
                  }
                  this.loadingRecords = false;
                  this.getData();
                });
            }
          } else {
            this.loadingRecords = false;
            this.message.error('Failed To Save Information....', '');
          }
        });
    }
  }

  getData() {
    this.api
      .GetLTCSignature(
        0,
        0,
        '',
        'asc',
        ' AND LTC_ID  = ' + this.LTCAdvOrderData.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.AdvanceOrderSignMap = data['data'][0];
        } else {
          this.AdvanceOrderSignMap = new LTCSignatureMapData();
        }
      });
  }
  openPrintModal() {
    this.printOrderModalVisible = true;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 900;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  getlevel(level: any) {
    if (level != null && level != undefined && level != '') {
      const numbers = level.match(/\d+/g);
      return numbers;
    }
  }
  remarkCount: any = 0;

  getTotalClaimed() {
    // this.totalClaimed = 0;
    var advAmountClaimed = 0;
    if (this.advOrderJourneyData.length > 0) {
      for (var i = 0; this.advOrderJourneyData.length > i; i++) {
        advAmountClaimed +=
          Number(this.advOrderJourneyData[i].JOURNEY_CLAIMED_AMOUNT) *
          Number(this.advOrderJourneyData[i].NO_OF_FAIRS);
      }
      // this.totalClaimed = advAmountClaimed;
    }
    return advAmountClaimed;
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
