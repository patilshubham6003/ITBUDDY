import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
import { TourSignatureMapData } from 'src/app/Medical/Models/TourSignatures';
@Component({
  selector: 'ls-advanceddrawer',
  templateUrl: './advanceddrawer.component.html',
  styleUrls: ['./advanceddrawer.component.css'],
})
export class AdvanceddrawerComponent {
  @Input()
  drawerClose: any;
  @Input()
  advancedata: any;
  @Input()
  AdvanceBillView: any;

  Signaturearray: any = [];
  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
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
  isAdmin: boolean = false;
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
                if (this.AdvanceBillView['ADV_TOUR_ADV_BILL_SIGNATURE_1']) {
                  const abc = Number(
                    this.AdvanceBillView['ADV_TOUR_ADV_BILL_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (this.AdvanceBillView['ADV_TOUR_ADV_BILL_SIGNATURE_2']) {
                  const abc = Number(
                    this.AdvanceBillView['ADV_TOUR_ADV_BILL_SIGNATURE_2']
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

    if (
      this.advancedata.PREPARED_BY == undefined ||
      this.advancedata.PREPARED_BY == null ||
      this.advancedata.PREPARED_BY == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Prepared By', '');
    }
    // else if (
    //   this.AdvanceBillView.ADV_TOUR_ADV_BILL_SIGNATURE_2 === undefined ||
    //   this.AdvanceBillView.ADV_TOUR_ADV_BILL_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // }

    if (isOk) {
      this.loadingRecords = true;
      this.advancedata.IS_ADVANCE_TOUR_CREATED = true;
      this.advancedata.IS_ADVANCE_TAKEN = true;
      this.advancedata.AMOUNT_OF_T_A = Number(
        this.advancedata.FINAL_ADVANCE_AMOUNT
      );
      this.advancedata.CURRENT_STAGE_ID = 7;
      if (this.advancedata.VIDE_ORDER_DATE) {
        this.advancedata.VIDE_ORDER_DATE = this.datePipe.transform(
          this.advancedata.VIDE_ORDER_DATE,
          'yyyy-MM-dd'
        );
      }

      if (!this.isAdmin) {
        this.api.updatetour(this.advancedata).subscribe((successCode) => {
          if (successCode.code === 200) {
            this.loadingRecords = false;

            if (this.AdvanceBillView.ID) {
              this.api
                .UpdatetourSignature(this.AdvanceBillView)
                .subscribe((successResponse) => {
                  if (successResponse.code === 200) {
                    this.message.success(
                      'Information Updated Successfully',
                      ''
                    );
                    this.printOrderModalVisible = true;
                    this.getData();
                  } else {
                    this.message.error('Failed To Update Information', '');
                    this.printOrderModalVisible = false;
                  }
                });
            } else {
              this.AdvanceBillView.TOUR_ID = this.advancedata.ID;
              this.api
                .CreatetourSignature(this.AdvanceBillView)
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
      .GettourSignature(0, 0, '', 'asc', ' AND TOUR_ID =' + this.advancedata.ID)
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.AdvanceBillView = data['data'][0];
        } else {
          this.AdvanceBillView = new TourSignatureMapData();
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
      filename: 'Part-A.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  gettotal(totalamount: any) {
    if (totalamount) {
      var lessamount = (totalamount * 90) / 100;
      if (
        Number(lessamount) >= Number(this.advancedata.REQUIRED_ADVANCE_AMOUNT)
      ) {
        this.advancedata.FINAL_ADVANCE_AMOUNT = Number(
          this.advancedata.REQUIRED_ADVANCE_AMOUNT
        );
        return Number(this.advancedata.REQUIRED_ADVANCE_AMOUNT);
      } else if (
        Number(lessamount) <= Number(this.advancedata.REQUIRED_ADVANCE_AMOUNT)
      ) {
        this.advancedata.FINAL_ADVANCE_AMOUNT = Number(lessamount);

        return Number(lessamount);
      } else {
        return 0;
      }
    } else {
      return 0;
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
