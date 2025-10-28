import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { TransferMapData } from 'src/app/Medical/Models/TransFerSignatureClass';

@Component({
  selector: 'app-transferchecklist',
  templateUrl: './transferchecklist.component.html',
  styleUrls: ['./transferchecklist.component.css'],
})
export class TransferchecklistComponent implements OnInit {
  @Input() transferData;
  @Input() CheckListSignatureMap;
  @Input() checklistData;
  @Input() drawerClose;
  @Input() SIGNNAME: any;
  @Input() OFFICE_NAME: any;
  @Input() POST: any;
  GET_SIGNATURE_IDS: any;
  SIGNATURE_ID: any;

  isSpinning: boolean = false;
  isOk: boolean = false;
  pdfDownload: boolean = false;
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
  Signaturearray: any = [];
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
              if (
                this.CheckListSignatureMap['TRANSFER_CHECKLIST_SIGNATURE_1']
              ) {
                const abc = Number(
                  this.CheckListSignatureMap['TRANSFER_CHECKLIST_SIGNATURE_1']
                );
                this.signature(abc);
              }
            }
          },
          (err) => {}
        );
    }
  }
  close(): void {
    this.isSpinning = false;
    this.drawerClose();
  }

  checkSave(addNew: boolean): void {
    this.isOk = true;

    // if (this.CheckListSignatureMap.TRANSFER_CHECKLIST_SIGNATURE_1 === undefined || this.CheckListSignatureMap.TRANSFER_CHECKLIST_SIGNATURE_1 === null) {
    //   this.isOk = false;
    //   this.message.error('Please Select Signature ', '');
    // }
    if (this.isOk) {
      this.isSpinning = true;

      {
        if (!this.isAdmin) {
          if (this.transferData.ID) {
            this.api
              .updatetransfer(this.transferData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // this.message.success(
                  //   'Information Changed Successfully...',
                  //   ''
                  // );
                  // this.isSpinning = false;
                  this.showmodal();
                  if (!addNew) {
                    this.isSpinning = false;
                  }
                } else {
                  this.message.error('Information Has Not Changed...', '');
                  this.isSpinning = false;
                }
              });
          } else {
          }
        } else {
          this.showmodal();
        }
      }
    }
  }
  printOrderModalVisible = false;
  showmodal() {
    // this.advanceamount = this.checklistData.ORDER_FORM_TOTAL;

    if (this.CheckListSignatureMap.ID) {
      this.api
        .UpdateTransferSignature(this.CheckListSignatureMap)
        .subscribe((successCode) => {
          if (successCode.code === 200) {
            this.message.success('Information Updated Successfully', '');
            this.printOrderModalVisible = true;
            this.isSpinning = false;

            this.getData();
          } else {
            this.message.error('Failed To Update Information', '');
            this.printOrderModalVisible = false;
            this.isSpinning = false;
          }
        });
    } else {
      this.CheckListSignatureMap.TRANSFER_ID = this.transferData.ID;

      this.api
        .CreateTransferSignature(this.CheckListSignatureMap)
        .subscribe((response) => {
          if (response.code === 200) {
            this.message.success('Information Saved Successfully', '');
            this.printOrderModalVisible = true;
            this.isSpinning = false;

            this.getData();
          } else {
            this.message.error('Failed to Save Information', '');
            this.printOrderModalVisible = false;
            this.isSpinning = false;
          }
        });
    }
  }

  getData() {
    this.api
      .GetTransferSignature(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.transferData.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.CheckListSignatureMap = data['data'][0];
        } else {
          this.CheckListSignatureMap = new TransferMapData();
        }
      });
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
    this.isSpinning = false;
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

  SIGNNAME1: any;
  OFFICE_NAME1: any;
  POST1: any;

  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME1 = f[0]['NAME'];
      this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
      this.POST1 = f[0]['POST'];
    } else {
      this.SIGNNAME1 = '';
      this.OFFICE_NAME1 = '';
      this.POST1 = '';
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
