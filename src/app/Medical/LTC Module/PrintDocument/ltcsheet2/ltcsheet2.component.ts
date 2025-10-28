// import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { LTCSignatureMapData } from 'src/app/Medical/Models/LTCSignaturemap';
@Component({
  selector: 'app-ltcsheet2',
  templateUrl: './ltcsheet2.component.html',
  styleUrls: ['./ltcsheet2.component.css'],
  providers: [NzNotificationService],
})
export class Ltcsheet2Component implements OnInit {
  @Input() drawerClose: Function;
  @Input() amount: any;
  @Input() namount: any;
  @Input() LTC2data: any;
  @Input() MapSignaturePartB: any;
  @Input() POST: any;
  @Input() OFFICE_NAME: any;
  @Input() NAME: any;
  @Input() POST_HN: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() NAME_HN: any;
  @Input() destinationList: any;
  @Input() FamilyList: any;
  GET_SIGNATURE_IDS: any;
  SIGNNAME: any;
  SIGNNAME1: any;
  SIGNNAME2: any;
  NAME_HN11: any;
  NAME_HN1: any;
  NAME_HN2: any;
  POST11: any;
  POST1: any;
  POST2: any;
  POST_HIN: any;
  POST1_HIN: any;
  POST2_HIN: any;
  OFFICE_NAME11: any;
  OFFICE_NAME1: any;
  OFFICE_NAME2: any;
  OFFICE_NAME_HIN: any;
  OFFICE_NAME1_HIN: any;
  OFFICE_NAME2_HIN: any;
  OFFICE_NAME3_HIN: any;
  OFFICE_NAME3: any;
  POST3_HIN: any;
  POST3: any;
  NAME_HN3: any;
  SIGNNAME3: any;
  SIGNNAME4: any;
  NAME_HN4: any;
  POST4: any;
  POST4_HIN: any;
  OFFICE_NAME4: any;
  OFFICE_NAME4_HIN: any;

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}
  Signaturearray: any = [];
  isAdmin: boolean = false;
  roleId: any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');
    this.getAllUsers();
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

    this.getdestinationList();
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
                if (this.MapSignaturePartB['LTC_PART_B_SIGNATURE_1']) {
                  const abc = Number(
                    this.MapSignaturePartB['LTC_PART_B_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.MapSignaturePartB['LTC_PART_B_SIGNATURE_2']) {
                  const abc = Number(
                    this.MapSignaturePartB['LTC_PART_B_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
                if (this.MapSignaturePartB['LTC_PART_B_SIGNATURE_3']) {
                  const abc = Number(
                    this.MapSignaturePartB['LTC_PART_B_SIGNATURE_3']
                  );
                  this.signature2(abc);
                }
                if (this.MapSignaturePartB['LTC_PART_B_SIGNATURE_4']) {
                  const abc = Number(
                    this.MapSignaturePartB['LTC_PART_B_SIGNATURE_4']
                  );
                  this.signature3(abc);
                }
                if (this.MapSignaturePartB['LTC_PART_B_SIGNATURE_5']) {
                  const abc = Number(
                    this.MapSignaturePartB['LTC_PART_B_SIGNATURE_5']
                  );
                  this.signature4(abc);
                }
              }
            }
          },
          (err) => {}
        );
    }
  }
  omit(event) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  claimHospitalMapping = [];
  loadingRecords: boolean = false;
  Save() {
    var isOk = true;
    // if (
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_1 === undefined ||
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_2 === undefined ||
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // } else if (
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_3 === undefined ||
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_3 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 3', '');
    // } else if (
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_4 === undefined ||
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_4 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 4', '');
    // } else if (
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_5 === undefined ||
    //   this.MapSignaturePartB.LTC_PART_B_SIGNATURE_5 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 5', '');
    // }
    if (isOk) {
      this.loadingRecords = true;

      this.api.ltcMasterUpdate(this.LTC2data).subscribe((successCode) => {
        if (successCode.code == '200') {
          if (this.MapSignaturePartB.ID) {
            this.api
              .UpdateLTCSignature(this.MapSignaturePartB)
              .subscribe((updateTransferResponse) => {
                if (updateTransferResponse.code === 200) {
                  this.message.success('Information Updated Successfully', '');
                  this.printOrderModalVisible = true;
                  this.loadingRecords = false;
                } else {
                  this.message.error('Failed To Update Information', '');
                  this.loadingRecords = false;
                }
                this.getData();
              });
          } else {
            this.MapSignaturePartB.LTC_ID = this.LTC2data.ID;
            this.api
              .CreateLTCSignature(this.MapSignaturePartB)
              .subscribe((createTransferResponse) => {
                if (createTransferResponse.code === 200) {
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
          this.loadingRecords = false;
          this.message.error('Failed To Save Information....', '');
        }
      });
    }
  }

  getData() {
    this.api
      .GetLTCSignature(0, 0, '', 'asc', ' AND LTC_ID  = ' + this.LTC2data.ID)
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.MapSignaturePartB = data['data'][0];
        } else {
          this.MapSignaturePartB = new LTCSignatureMapData();
        }
      });
  }
  close(): void {
    this.drawerClose();
  }

  printOrderModalVisible: boolean = false;

  openPrintOrderModal() {
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

  isfound = 0;

  fileName: string = 'HOD Order Letter';
  pdfDownload: boolean = false;

  generatePDF() {
    const element = document.getElementById('printOrderModal');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  nnamount = 0;
  changeamountt(event: any) {
    this.nnamount = 0;

    this.nnamount = Number(this.namount) + Number(event);
  }
  getlevel(level: any) {
    if (level != null && level != undefined && level != '') {
      const numbers = level.match(/\d+/g);
      return numbers;
    }
  }
  destinationnn: any = '';
  getdestinationList() {
    this.destinationnn = '';
    if (this.destinationList.length > 0) {
      var dataaa: any = '';
      for (var i = 0; i < this.destinationList.length; i++) {
        if (dataaa != '') {
          dataaa = dataaa + ',' + this.destinationList[i];
        } else {
          dataaa = this.destinationList[i];
        }
      }
    }
    if (dataaa != '') {
      this.destinationnn = dataaa + ' only';
    } else {
      this.destinationnn = '';
    }
    var dataaaaa = this.destinationnn;
  }

  clearDesignation(event) {
    if (event == false) {
      this.LTC2data.DESTIONATION_REMARK = null;
    } else {
    }
  }

  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN11 = f[0]['NAME_HN'];
      this.POST11 = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME11 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN11 = '';
      this.POST11 = '';
      this.POST_HIN = '';
      this.OFFICE_NAME11 = '';
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

  signature4(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME4 = f[0]['NAME'];
      this.NAME_HN4 = f[0]['NAME_HN'];
      this.POST4 = f[0]['POST'];
      this.POST4_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME4 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME4_HIN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.SIGNNAME4 = '';
      this.NAME_HN4 = '';
      this.POST4 = '';
      this.POST4_HIN = '';
      this.OFFICE_NAME4 = '';
      this.OFFICE_NAME4_HIN = '';
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
