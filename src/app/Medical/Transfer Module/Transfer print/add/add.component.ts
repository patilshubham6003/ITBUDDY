import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { TransferMapData } from 'src/app/Medical/Models/TransFerSignatureClass';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent implements OnInit {
  @Input() SignaturePartB;
  @Input() drawerClose;
  @Input() partbdata;
  @Input() journeyDetailsData;
  @Input() multiplication;
  @Input() incidentalsAmonut;
  @Input() tranferchnagesorder;
  @Input() totalofweight;
  @Input() transferallounceorder;
  @Input() netpaymentofpartb;
  @Input() grosspaymentofpartb;
  @Input() amountofadvance;
  @Input() fairpaidofpartb;
  @Input() amountt;
  @Input() weightrate;
  @Input() distance;
  @Input() grosspaymentvalue;
  @Input() privateVehicleMinFair;
  @Input() showPrivate;
  @Input() TravelModeNames;
  @Input() personalEffectsAddmissible;
  pdfDownload: boolean = false;
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
  isAdmin: boolean = false;

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
                if (this.SignaturePartB['TRANSFER_PART_B_SIGNATURE_1']) {
                  const abc = Number(
                    this.SignaturePartB['TRANSFER_PART_B_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.SignaturePartB['TRANSFER_PART_B_SIGNATURE_2']) {
                  const abc = Number(
                    this.SignaturePartB['TRANSFER_PART_B_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
                if (this.SignaturePartB['TRANSFER_PART_B_SIGNATURE_3']) {
                  const abc = Number(
                    this.SignaturePartB['TRANSFER_PART_B_SIGNATURE_3']
                  );
                  this.signature2(abc);
                }
              }
            }
          },
          (err) => {}
        );
    }
  }
  visible = false;

  open(): void {
    this.visible = true;
  }

  total = 0;

  gettotal() {
    if (
      this.partbdata.CTG_TOTAL != undefined &&
      this.partbdata.ROAD_MILEAGE_TOTAL != undefined &&
      this.partbdata.JOURNEY_TOTAL != undefined &&
      // this.partbdata.PERSONAL_EFFECT_TOTAL != undefined &&
      this.personalEffectsAddmissible != undefined &&
      this.partbdata.PRIVATE_CONVEYANCE_TOTAL != undefined
    ) {
      this.total =
        Number(this.partbdata.CTG_TOTAL) +
        Number(this.partbdata.ROAD_MILEAGE_TOTAL) +
        Number(this.partbdata.JOURNEY_TOTAL) +
        Number(this.personalEffectsAddmissible) +
        // Number(this.partbdata.PERSONAL_EFFECT_TOTAL) +
        Number(this.partbdata.PRIVATE_CONVEYANCE_TOTAL);
    }

    return this.total;
  }
  nettotal = 0;

  gettotall() {
    this.partbdata.ORDER_FORM_NET_TOTAL = 0;
    if (this.partbdata.ADVANCED_AMOUNT != undefined) {
      this.partbdata.ORDER_FORM_NET_TOTAL =
        this.total - this.partbdata.ADVANCED_AMOUNT;
    }
    return this.partbdata.ORDER_FORM_NET_TOTAL;
  }

  close(): void {
    this.drawerClose();
  }
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Part-B.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  showmodal() {
    var isOk = true;

    // if (
    //   this.SignaturePartB.TRANSFER_PART_B_SIGNATURE_1 === undefined ||
    //   this.SignaturePartB.TRANSFER_PART_B_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.SignaturePartB.TRANSFER_PART_B_SIGNATURE_2 === undefined ||
    //   this.SignaturePartB.TRANSFER_PART_B_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // } else if (
    //   this.SignaturePartB.TRANSFER_PART_B_SIGNATURE_3 === undefined ||
    //   this.SignaturePartB.TRANSFER_PART_B_SIGNATURE_3 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 3', '');
    // }

    if (isOk) {
      this.printModel();
    }
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  printModel() {
    if (
      this.partbdata.ID != undefined ||
      this.partbdata.ID != null ||
      this.partbdata.ID != ''
    ) {
      this.loadingRecords = true;
      this.api
        .gettransferdata(0, 0, '', '', ' AND ID = ' + this.partbdata.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.loadingRecords = false;
              this.partbdata = data['data'][0];
              if (!this.isAdmin) {
                if (this.SignaturePartB.ID) {
                  this.api
                    .UpdateTransferSignature(this.SignaturePartB)
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
                  this.SignaturePartB.TRANSFER_ID = this.partbdata.ID;

                  this.api
                    .CreateTransferSignature(this.SignaturePartB)
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
                this.loadingRecords = false;
                this.printOrderModalVisible = true;
              }

              // this.printOrderModalVisible = true;
            } else {
              this.message.error("Can't Load Data", '');
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
    }
  }

  getData() {
    this.api
      .GetTransferSignature(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.partbdata.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.SignaturePartB = data['data'][0];
        } else {
          this.SignaturePartB = new TransferMapData();
        }
      });
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  visible2 = false;

  open2(): void {
    this.visible2 = true;
  }

  close2(): void {
    this.visible2 = false;
  }

  openpdf2() {
    const element = document.getElementById('excel-table2');
    const opt = {
      margin: 0.2,
      filename: 'Travel-Allowance.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
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
