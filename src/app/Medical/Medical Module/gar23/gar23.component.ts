import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { MedicalSignatureData } from '../../Models/MedicalSignature';

@Component({
  selector: 'app-gar23',
  templateUrl: './gar23.component.html',
  styleUrls: ['./gar23.component.css'],
})
export class GAR23Component implements OnInit {
  @Input() drawerClose: Function;
  @Input() GARData;
  @Input() HospitalMapping;
  @Input() Signaturearray;
  @Input() amountinWords;
  @Input() OFFICE_NAME;
  @Input() loadingRecords: boolean = false;
  @Input() gar23SignatureData: any;
  Signaturearray1: any = [];
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}
  isAdmin: boolean = false;
  roleId: any;
  ngOnInit(): void {
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

  claimHospitalMapping: any = [];

  Save() {
    this.loadingRecords = true;
    this.claimHospitalMapping = [];
    for (var i = 0; this.HospitalMapping.length > i; i++) {
      var obj: any = Object.assign({}, this.HospitalMapping[i]);
      obj.ID = undefined;
      this.claimHospitalMapping.push(obj);
      // this.claimHospitalMapping[i]['CLAIM_ID'] = undefined;
      if (this.HospitalMapping.length == i + 1) {
        this.GARData.hospitalData = this.claimHospitalMapping;
      }
    }

    if (this.GARData.BILL_NUMBER) {
      this.GARData.BILL_NUMBER = this.GARData.BILL_NUMBER;
    } else {
      this.GARData.BILL_NUMBER = null;
    }

    if (this.GARData.GAR_23_DATE) {
      this.GARData.GAR_23_DATE = this.datePipe.transform(
        this.GARData.GAR_23_DATE,
        'yyyy-MM-dd'
      );
    } else {
      this.GARData.GAR_23_DATE = this.GARData.GAR_23_DATE;
    }
    this.GARData['CLAIM_ID'] = this.GARData.ID;
    this.api.updateclaimed(this.GARData).subscribe((successCode) => {
      if (successCode.code == '200') {
        // this.message.success('Information Changed Successfully...', '');
        // this.loadingRecords = false;
        this.api
          .getclaimMaster(
            1,
            1,
            '',
            '',
            ' AND ID = ' + this.GARData.ID,
            '',
            '',
            '',
            ''
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.loadingRecords = false;
                this.gar23SignatureData.CLAIM_ID = this.GARData.ID;
                if (this.gar23SignatureData.ID) {
                  this.api
                    .UpdateMedicalSignature(this.gar23SignatureData)
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
                            ' AND CLAIM_ID = ' + this.GARData.ID
                          )
                          .subscribe(
                            (data) => {
                              if (data['code'] == 200) {
                                if (data['data'].length > 0) {
                                  this.gar23SignatureData = data['data'][0];
                                } else {
                                  this.gar23SignatureData =
                                    new MedicalSignatureData();
                                }
                                this.message.success(
                                  ' Information Updated Successfully...',
                                  ''
                                );
                                this.openPrintOrderModal();
                              } else {
                                this.gar23SignatureData = [];
                                this.message.error('Something Went Wrong', '');
                              }
                            },
                            (err) => {}
                          );
                      } else {
                        this.message.error(
                          ' Failed To Update Information...',
                          ''
                        );
                        // this.isSpinning = false;
                      }
                    });
                } else {
                  this.api
                    .CreateMedicalSignature(this.gar23SignatureData)
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
                            ' AND CLAIM_ID = ' + this.GARData.ID
                          )
                          .subscribe(
                            (data) => {
                              if (data['code'] == 200) {
                                if (data['data'].length > 0) {
                                  this.gar23SignatureData = data['data'][0];
                                } else {
                                  this.gar23SignatureData =
                                    new MedicalSignatureData();
                                }
                                this.message.success(
                                  ' Information Save Successfully...',
                                  ''
                                );
                                this.openPrintOrderModal();
                              } else {
                                this.gar23SignatureData = [];
                                this.message.error('Something Went Wrong', '');
                              }
                            },
                            (err) => {}
                          );
                      } else {
                        this.message.error(
                          ' Failed To Save Information...',
                          ''
                        );
                        // this.isSpinning = false;
                      }
                    });
                }
              } else {
                this.message.error("Can't Load Data", '');
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

  signature(event: any) {
    var f = this.Signaturearray.filter((item) => item.ID == event);

    this.OFFICE_NAME = f[0]['OFFICE_NAME'];
  }
  // Signaturearray:any = [];
  // getAllUsers() {
  //   this.api.getSignature(0, 0, 'ID', 'desc', ' AND STATUS = 1 ').subscribe(
  //     (data) => {
  //       if (data['code'] == 200) {
  //         this.Signaturearray = data['data'];
  //       }
  //     },
  //     (err) => {}
  //   );
  // }

  SIGNNAME2: any;
  NAME_HN2: any;
  POST2: any;
  POST2_HIN: any;
  OFFICE_NAME2: any;
  OFFICE_NAME2_HIN: any;
  signature2(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
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

  SIGNNAME3: any;
  NAME_HN3: any;
  POST3: any;
  POST3_HIN: any;
  OFFICE_NAME3: any;
  OFFICE_NAME3_HIN: any;
  signature3(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray1.filter((item) => item.ID == event);
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
      this.gar23SignatureData.GAR_23_SIGNATURE_1 == null ||
      this.gar23SignatureData.GAR_23_SIGNATURE_1 == undefined ||
      this.gar23SignatureData.GAR_23_SIGNATURE_1 == ''
    ) {
      this.SIGNNAME2 = '';
      this.NAME_HN2 = '';
      this.POST2 = '';
      this.POST2_HIN = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME2_HIN = '';
    } else {
      var f = this.Signaturearray1.filter(
        (item) => item.ID == this.gar23SignatureData.GAR_23_SIGNATURE_1
      );

      this.SIGNNAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST2_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME2_HIN = f[0]['OFFICE_NAME_HN'];
    }
    if (
      this.gar23SignatureData.GAR_23_SIGNATURE_2 == null ||
      this.gar23SignatureData.GAR_23_SIGNATURE_2 == undefined ||
      this.gar23SignatureData.GAR_23_SIGNATURE_2 == ''
    ) {
      this.SIGNNAME3 = '';
      this.NAME_HN3 = '';
      this.POST3 = '';
      this.POST3_HIN = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME3_HIN = '';
    } else {
      var f = this.Signaturearray1.filter(
        (item) => item.ID == this.gar23SignatureData.GAR_23_SIGNATURE_2
      );
      this.SIGNNAME3 = f[0]['NAME'];
      this.NAME_HN3 = f[0]['NAME_HN'];
      this.POST3 = f[0]['POST'];
      this.POST3_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME3_HIN = f[0]['OFFICE_NAME_HN'];
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
