// import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LTCSignatureMapData } from 'src/app/Medical/Models/LTCSignaturemap';
@Component({
  selector: 'app-ltcsheet1',
  templateUrl: './ltcsheet1.component.html',
  styleUrls: ['./ltcsheet1.component.css'],
  providers: [NzNotificationService],
})
export class Ltcsheet1Component implements OnInit {
  @Input() drawerClose: Function;
  @Input() formdata7: any;
  @Input() MapSignatureOrder: any;
  @Input() amount: any;
  @Input() namount: any;
  @Input() LTC1data: any;
  @Input() relationdata1: any;
  loadingRecords: boolean = false;
  printOrderModalVisible: boolean = false;

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
  // @Input() POST: any;
  // @Input() OFFICE_NAME: any;
  @Input() NAME: any;
  @Input() POST_HN: any;
  @Input() OFFICE_NAME_HN: any;
  // @Input() NAME_HN: any;
  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
  SIGNATURE_ID2: any;
  GET_SIGNATURE_IDS: any;
  Signaturearray: any = [];
  remarkCount: any = 0;
  allRemarks: any;
  isAdmin: boolean = false;
  roleId: any;
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}

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
    this.remarkCount = Number(this.formdata7.length);

    for (let i = 0; i < this.formdata7.length; i++) {
      const remark = this.formdata7[i]['REMARK'];
      if (remark !== null && remark !== undefined && remark.trim() !== '') {
        this.allRemarks =
          (this.allRemarks ? this.allRemarks + ', ' : '') + remark;
      }
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
                if (this.MapSignatureOrder['LTC_ORDER_SIGNATURE_1']) {
                  const abc = Number(
                    this.MapSignatureOrder['LTC_ORDER_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.MapSignatureOrder['LTC_ORDER_SIGNATURE_2']) {
                  const abc = Number(
                    this.MapSignatureOrder['LTC_ORDER_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
                if (this.MapSignatureOrder['LTC_ORDER_SIGNATURE_3']) {
                  const abc = Number(
                    this.MapSignatureOrder['LTC_ORDER_SIGNATURE_3']
                  );
                  this.signature2(abc);
                }
                if (this.MapSignatureOrder['CHECKED_BY_SIGNATURE']) {
                  const abc = Number(
                    this.MapSignatureOrder['CHECKED_BY_SIGNATURE']
                  );
                  this.checkedBySignature(abc);
                }
              }
            }
          },
          (err) => {}
        );
    }
  }
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

  calculateRemarkRowspan(): number {
    const totalRows = this.formdata7.length;
    return totalRows > 1 ? totalRows : 1;
  }
  claimHospitalMapping = [];

  Save() {
    var isOk = true;
    // if (
    //   this.MapSignatureOrder.LTC_ORDER_SIGNATURE_1 === undefined ||
    //   this.MapSignatureOrder.LTC_ORDER_SIGNATURE_1 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 1', '');
    // } else if (
    //   this.MapSignatureOrder.LTC_ORDER_SIGNATURE_2 === undefined ||
    //   this.MapSignatureOrder.LTC_ORDER_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // } else if (
    //   this.MapSignatureOrder.LTC_ORDER_SIGNATURE_3 === undefined ||
    //   this.MapSignatureOrder.LTC_ORDER_SIGNATURE_3 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 3', '');
    // }
    if (isOk) {
      this.LTC1data.BILL_SUBMITTED_DATE = this.datepipe.transform(
        this.LTC1data.BILL_SUBMITTED_DATE,
        'yyyy-MM-dd'
      );
      this.loadingRecords = true;
      this.api.ltcMasterUpdate(this.LTC1data).subscribe((ltcUpdateResponse) => {
        if (ltcUpdateResponse.code === 200) {
          if (this.MapSignatureOrder.ID) {
            this.api
              .UpdateLTCSignature(this.MapSignatureOrder)
              .subscribe((updateLTCResponse) => {
                if (updateLTCResponse.code === 200) {
                  this.message.success('Information Updated Successfully', '');
                  this.printOrderModalVisible = true;
                  this.loadingRecords = false;
                } else {
                  this.message.error('Failed To Update Information', '');
                }
                this.loadingRecords = false;
                this.getData();
              });
          } else {
            this.MapSignatureOrder.LTC_ID = this.LTC1data.ID;
            this.api
              .CreateLTCSignature(this.MapSignatureOrder)
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
          this.openPrintOrderModal();
        } else {
          this.message.error('Failed To Save Information', '');
          this.loadingRecords = false;
        }
      });
    }
  }

  getData() {
    this.api
      .GetLTCSignature(0, 0, '', 'asc', ' AND LTC_ID  = ' + this.LTC1data.ID)
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.MapSignatureOrder = data['data'][0];
        } else {
          this.MapSignatureOrder = new LTCSignatureMapData();
        }
      });
  }

  openPrintOrderModal() {
    if (
      this.LTC1data.ID != undefined ||
      this.LTC1data.ID != null ||
      this.LTC1data.ID != ''
    ) {
      this.loadingRecords = true;
      this.api
        .getAllltcMaster(0, 0, '', '', ' AND ID = ' + this.LTC1data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.LTC1data = data['data'][0];
              this.loadingRecords = false;
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
  close(): void {
    this.drawerClose();
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
  getdateeeee() {
    var date: any = new Date();
    date = this.datepipe.transform(date, 'dd/MM/yyyy');
    return date;
  }
  getlevel(level: any) {
    if (level != null && level != undefined && level != '') {
      const numbers = level.match(/\d+/g);
      return numbers;
    } else {
      return '';
    }
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getclaimedamount() {
    var amount = 0;
    if (this.formdata7.length > 0) {
      for (var i = 0; this.formdata7.length > i; i++) {
        amount += this.formdata7[i].JOURNEY_CLAIMED_AMOUNT;
      }
    }
    return amount;
  }

  CHECKE_BY_NAME: any = '';
  CHECKE_BY_NAME_HN: any = '';
  CHECKE_BY_POST: any = '';
  CHECKE_BY_POST_HN: any = '';
  CHECKE_BY_OFFICE_NAME: any = '';
  CHECKE_BY_OFFICE_NAME_HN: any = '';
  checkedBySignature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      this.CHECKE_BY_NAME = '';
      this.CHECKE_BY_NAME_HN = '';
      this.CHECKE_BY_POST = '';
      this.CHECKE_BY_POST_HN = '';
      this.CHECKE_BY_OFFICE_NAME = '';
      this.CHECKE_BY_OFFICE_NAME_HN = '';
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.CHECKE_BY_NAME = f[0]['NAME'];
      this.CHECKE_BY_NAME_HN = f[0]['NAME_HN'];
      this.CHECKE_BY_POST = f[0]['POST'];
      this.CHECKE_BY_POST_HN = f[0]['POST_HN'];
      this.CHECKE_BY_OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.CHECKE_BY_OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
    } else {
      this.CHECKE_BY_NAME = '';
      this.CHECKE_BY_NAME_HN = '';
      this.CHECKE_BY_POST = '';
      this.CHECKE_BY_POST_HN = '';
      this.CHECKE_BY_OFFICE_NAME = '';
      this.CHECKE_BY_OFFICE_NAME_HN = '';
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
