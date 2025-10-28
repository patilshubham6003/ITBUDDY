import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { MedicalSignatureData } from '../../Models/MedicalSignature';

@Component({
  selector: 'app-claimcertificate',
  templateUrl: './claimcertificate.component.html',
  styleUrls: ['./claimcertificate.component.css'],
})
export class ClaimcertificateComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() certificateData;
  @Input() HospitalMapping;
  @Input() loadingRecords: boolean = false;
  @Input() certificateSignatureData: any;
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  claimHospitalMapping: any = [];

  Save() {
    this.loadingRecords = true;
    this.claimHospitalMapping = [];
    for (var i = 0; this.HospitalMapping.length > i; i++) {
      var obj = Object.assign({}, this.HospitalMapping[i]);
      obj.ID = undefined;
      this.claimHospitalMapping.push(obj);
      // this.claimHospitalMapping[i]['CLAIM_ID'] = undefined;
      if (this.HospitalMapping.length == i + 1) {
        this.certificateData.hospitalData = this.claimHospitalMapping;
      }
    }
    this.certificateData['CLAIM_ID'] = this.certificateData.ID;
    this.api.updateclaimed(this.certificateData).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Information Changed Successfully...', '');
        // this.loadingRecords = false;
        this.api
          .getclaimMaster(
            1,
            1,
            '',
            '',
            ' AND ID = ' + this.certificateData.ID,
            '',
            '',
            '',
            ''
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.openPrintOrderModal();
              } else {
                // this.message.error("Can't Load Data", '');
                this.loadingRecords = false;
              }
            },
            (err) => {}
          );
      } else {
        this.message.error('Information Has Not Changed...', '');
        this.loadingRecords = false;
      }
    });
  }
  close(): void {
    this.loadingRecords = false;
    this.drawerClose();
  }

  printOrderModalVisible: boolean = false;

  openPrintOrderModal() {
    if (this.certificateData.BILL_NUMBER) {
      this.certificateData.BILL_NUMBER = this.certificateData.BILL_NUMBER;
    } else {
      this.certificateData.BILL_NUMBER = null;
    }

    this.certificateSignatureData.CLAIM_ID = this.certificateData.ID;

    this.api
      .updateClaimWithoutHospitalData(this.certificateData)
      .subscribe((successCode) => {
        if (successCode.code == '200') {
          if (this.certificateSignatureData.ID) {
            this.api
              .UpdateMedicalSignature(this.certificateSignatureData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // if (!addNew) this.drawerClose();
                  // this.isSpinning = false;
                  this.api
                    .GetMedicalSignature(
                      0,
                      0,
                      '',
                      '',
                      ' AND CLAIM_ID = ' + this.certificateData.ID
                    )
                    .subscribe(
                      (data) => {
                        if (data['code'] == 200) {
                          if (data['data'].length > 0) {
                            this.certificateSignatureData = data['data'][0];
                          } else {
                            this.certificateSignatureData =
                              new MedicalSignatureData();
                          }
                          this.message.success(
                            ' Information Updated Successfully...',
                            ''
                          );
                          this.printOrderModalVisible = true;
                        } else {
                          this.certificateSignatureData = [];
                          this.message.error('Something Went Wrong', '');
                        }
                      },
                      (err) => {}
                    );
                } else {
                  this.message.error(' Failed To Update Information...', '');
                  // this.isSpinning = false;
                }
              });
          } else {
            this.api
              .CreateMedicalSignature(this.certificateSignatureData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // if (!addNew) {
                  //   this.drawerClose();
                  // } else {
                  //   this.data = new SignatureMaster();
                  //   this.resetDrawer(SignaturePage);
                  // }
                  // this.isSpinning = false;
                  this.api
                    .GetMedicalSignature(
                      0,
                      0,
                      '',
                      '',
                      ' AND CLAIM_ID = ' + this.certificateData.ID
                    )
                    .subscribe(
                      (data) => {
                        if (data['code'] == 200) {
                          if (data['data'].length > 0) {
                            this.certificateSignatureData = data['data'][0];
                          } else {
                            this.certificateSignatureData =
                              new MedicalSignatureData();
                          }
                          this.message.success(
                            ' Information Save Successfully...',
                            ''
                          );
                          this.printOrderModalVisible = true;
                        } else {
                          this.certificateSignatureData = [];
                          this.message.error('Something Went Wrong', '');
                        }
                      },
                      (err) => {}
                    );
                } else {
                  this.message.error(' Failed To Save Information...', '');
                  // this.isSpinning = false;
                }
              });
          }
        } else {
          this.message.error('Information Has Not Changed...', '');
          this.loadingRecords = false;
        }
      });
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

  // auto(event: number) {

  // }

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

  SIGNNAME: any;
  NAME_HN: any;
  POST: any;
  POST_HIN: any;
  OFFICE_NAME: any;
  OFFICE_NAME_HIN: any;
  signature1(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
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
  Signaturearray1: any = [];
  getAllUsers() {
    this.Signaturearray1 = [];

    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        // ' AND STATUS!=false AND ID in(' + this.GET_SIGNATURE_IDS + ')'
        ' AND STATUS = 1 AND DDO_ID=' + Number(sessionStorage.getItem('ddoId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length == 0) {
              this.Signaturearray1 = [];
            } else {
              this.Signaturearray1 = data['data'];
              if (data['count'] == this.Signaturearray1.length) {
                this.findSignatures();
              }
            }
          }
        },
        (err) => {}
      );
  }

  findSignatures() {
    if (
      this.certificateSignatureData.CERTIFICATE_SIGNATURE_1 == null ||
      this.certificateSignatureData.CERTIFICATE_SIGNATURE_1 == undefined ||
      this.certificateSignatureData.CERTIFICATE_SIGNATURE_1 == ''
    ) {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HIN = '';
    } else {
      var f = this.Signaturearray1.filter(
        (item) =>
          item.ID == this.certificateSignatureData.CERTIFICATE_SIGNATURE_1
      );

      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HIN = f[0]['OFFICE_NAME_HN'];
    }
  }
}
