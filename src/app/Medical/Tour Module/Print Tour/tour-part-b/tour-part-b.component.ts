import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TourSignatureMapData } from 'src/app/Medical/Models/TourSignatures';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-tour-part-b',
  templateUrl: './tour-part-b.component.html',
  styleUrls: ['./tour-part-b.component.css'],
})
export class TourPartBComponent implements OnInit {
  @Input() drawerClose;
  @Input() tourpartbdata;
  @Input() SignatureMaptourpartbdata;

  @Input() totalamountofpartb;
  @Input() journeytotalamounttourpartb;
  @Input() foodAdmissibleAmount;
  @Input() accommodationAdmissibleAmount;
  @Input() hotelAdmissibleAmount;
  @Input() intercityAdmissibleAmount;
  @Input() actualExpences;
  @Input() grossAmount;
  isAdmin: boolean = false;

  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  GET_SIGNATURE_IDS: any;
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
  close(): void {
    this.drawerClose();
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  Signaturearray: any = [];
  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
  SIGNATURE_ID2: any;

  getAllUsers() {
    if (this.GET_SIGNATURE_IDS) {
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
            if (data['code'] === 200) {
              this.Signaturearray = data['data'];

              if (this.Signaturearray.length > 0) {
                if (this.SignatureMaptourpartbdata['TOUR_PART_B_SIGNATURE_1']) {
                  const abc = Number(
                    this.SignatureMaptourpartbdata['TOUR_PART_B_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.SignatureMaptourpartbdata['TOUR_PART_B_SIGNATURE_2']) {
                  const abc = Number(
                    this.SignatureMaptourpartbdata['TOUR_PART_B_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
                if (this.SignatureMaptourpartbdata['TOUR_PART_B_SIGNATURE_3']) {
                  const abc = Number(
                    this.SignatureMaptourpartbdata['TOUR_PART_B_SIGNATURE_3']
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

  printOrderModalVisible: boolean = false;
  loadingRecords: boolean = false;
  pdfDownload: boolean = false;
  showmodal() {
    if (!this.isAdmin) {
      var isOk = true;
      // if (
      //   this.SignatureMaptourpartbdata.TOUR_PART_B_SIGNATURE_1 === undefined ||
      //   this.SignatureMaptourpartbdata.TOUR_PART_B_SIGNATURE_1 === null
      // ) {
      //   isOk = false;
      //   this.message.error('Please Select Signature 1', '');
      // } else if (
      //   this.SignatureMaptourpartbdata.TOUR_PART_B_SIGNATURE_2 === undefined ||
      //   this.SignatureMaptourpartbdata.TOUR_PART_B_SIGNATURE_2 === null
      // ) {
      //   isOk = false;
      //   this.message.error('Please Select Signature 2', '');
      // } else if (
      //   this.SignatureMaptourpartbdata.TOUR_PART_B_SIGNATURE_3 === undefined ||
      //   this.SignatureMaptourpartbdata.TOUR_PART_B_SIGNATURE_3 === null
      // ) {
      //   isOk = false;
      //   this.message.error('Please Select Signature 3', '');
      // }

      if (isOk) {
        if (this.SignatureMaptourpartbdata.ID) {
          this.api
            .UpdatetourSignature(this.SignatureMaptourpartbdata)
            .subscribe((successCode) => {
              if (successCode.code === 200) {
                this.message.success('Information Updated Successfully', '');
                this.printOrderModalVisible = true;
                this.getData();
              } else {
                this.message.error('Failed To Update Information', '');
                this.printOrderModalVisible = false;
              }
            });
        } else {
          this.SignatureMaptourpartbdata.TOUR_ID = this.tourpartbdata.ID;

          this.api
            .CreatetourSignature(this.SignatureMaptourpartbdata)
            .subscribe((response) => {
              if (response.code === 200) {
                this.message.success('Information Saved Successfully', '');
                this.printOrderModalVisible = true;
                this.getData();
              } else {
                this.message.error('Failed to Save Information', '');
                this.printOrderModalVisible = false;
              }
            });
        }
      }
    } else {
      this.printOrderModalVisible = true;
    }
  }

  getData() {
    this.api
      .GettourSignature(
        0,
        0,
        '',
        'asc',
        ' AND TOUR_ID =' + this.tourpartbdata.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.SignatureMaptourpartbdata = data['data'][0];
        } else {
          this.SignatureMaptourpartbdata = new TourSignatureMapData();
        }
      });
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
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
