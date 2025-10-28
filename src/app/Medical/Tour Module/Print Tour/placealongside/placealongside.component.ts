import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { TourSignatureMapData } from 'src/app/Medical/Models/TourSignatures';
@Component({
  selector: 'app-placealongside',
  templateUrl: './placealongside.component.html',
  styleUrls: ['./placealongside.component.css'],
})
export class PlacealongsideComponent implements OnInit {
  @Input() PlaceOrderMapCheckList;
  @Input() drawerClose;
  @Input() Railtotal: any;
  @Input() ShipBoattotal: any;
  @Input() Roadtotal: any;
  @Input() airtotal: any;
  @Input() alltotal: any;
  @Input() advanceamountta: any;
  @Input() placeorderdata: any;
  @Input() nettotalamountplaceorder: any;
  @Input() accototal: any;
  @Input() foodtotal: any;
  @Input() detailsandpurpose: any;
  @Input() acctotal1: any;
  @Input() ShipBoattotal1: any;
  @Input() airtotal1: any;
  @Input() Roadtotal1: any;
  @Input() Railtotal1: any;
  @Input() foodtotal1: any;
  @Input() hotelAdmissibleAmount: any;
  @Input() accommodationAdmissibleAmount: any;
  @Input() foodAdmissibleAmount: any;
  @Input() intercityAdmissibleAmount: any;
  @Input() intercityClaimedAmount: any;
  @Input() accommodationClaimedAmount: any;
  @Input() totalOfClaimedAmount: any;
  @Input() totalOfAdmissibleAmount: any;
  pdfDownload: boolean = false;
  isAdmin: boolean = false;
  Signaturearray: any = [];

  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  fileList: any = [];
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
    this.api
      .getFileMaster(
        0,
        0,
        'ID',
        'ASC',
        ' AND STATUS = 1 AND HIRARCHY_ID in (6,7)',
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
            if (data['code'] === 200) {
              this.Signaturearray = data['data'];

              if (this.Signaturearray.length > 0) {
                if (
                  this.PlaceOrderMapCheckList['TOUR_PLACE_ORDER_SIGNATURE_1']
                ) {
                  const abc = Number(
                    this.PlaceOrderMapCheckList['TOUR_PLACE_ORDER_SIGNATURE_1']
                  );
                  this.signature(abc);
                }
                if (
                  this.PlaceOrderMapCheckList['TOUR_PLACE_ORDER_SIGNATURE_2']
                ) {
                  const abc = Number(
                    this.PlaceOrderMapCheckList['TOUR_PLACE_ORDER_SIGNATURE_2']
                  );
                  this.signature1(abc);
                }
                if (
                  this.PlaceOrderMapCheckList['TOUR_PLACE_ORDER_SIGNATURE_3']
                ) {
                  const abc = Number(
                    this.PlaceOrderMapCheckList['TOUR_PLACE_ORDER_SIGNATURE_3']
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

  visible = false;

  open(): void {
    this.visible = true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

    if (
      this.placeorderdata.PREPARED_BY == undefined ||
      this.placeorderdata.PREPARED_BY == null ||
      this.placeorderdata.PREPARED_BY == ''
    ) {
      isOk = false;
      this.message.error('Please Enter Prepared By', '');
    }
    // else if (
    //   this.PlaceOrderMapCheckList.TOUR_PLACE_ORDER_SIGNATURE_2 === undefined ||
    //   this.PlaceOrderMapCheckList.TOUR_PLACE_ORDER_SIGNATURE_2 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 2', '');
    // } else if (
    //   this.PlaceOrderMapCheckList.TOUR_PLACE_ORDER_SIGNATURE_3 === undefined ||
    //   this.PlaceOrderMapCheckList.TOUR_PLACE_ORDER_SIGNATURE_3 === null
    // ) {
    //   isOk = false;
    //   this.message.error('Please Select Signature 3', '');
    // }
    if (isOk) {
      this.loadingRecords = true;
      // this.placeorderdata.PLACE_ORDER_NET_AMOUNT = this.nettotalamountplaceorder;

      if (!this.isAdmin) {
        this.api.updatetour(this.placeorderdata).subscribe((successCode) => {
          if (successCode.code == '200') {
            if (this.PlaceOrderMapCheckList.ID) {
              this.api
                .UpdatetourSignature(this.PlaceOrderMapCheckList)
                .subscribe((successCode) => {
                  if (successCode.code === 200) {
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
              this.PlaceOrderMapCheckList.TOUR_ID = this.placeorderdata.ID;

              this.api
                .CreatetourSignature(this.PlaceOrderMapCheckList)
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
            // this.loadingRecords = false;
            // this.printModel();

            this.api
              .gettouralldata(0, 0, '', '', ' AND ID=' + this.placeorderdata.ID)
              .subscribe(
                (data) => {
                  if (data.code == '200') {
                    this.placeorderdata = data['data'][0];
                    this.loadingRecords = false;
                    this.printOrderModalVisible = true;
                  } else {
                    this.loadingRecords = false;
                  }
                },
                (err) => {}
              );
            // this.message.success('Information Saved Successfully...', '');
          } else {
            this.loadingRecords = false;
            this.message.error('Information Has Not Saved...', '');
            // this.loadingRecords = false;
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
      .GettourSignature(
        0,
        0,
        '',
        'asc',
        ' AND TOUR_ID =' + this.placeorderdata.ID
      )
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.PlaceOrderMapCheckList = data['data'][0];
        } else {
          this.PlaceOrderMapCheckList = new TourSignatureMapData();
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

  changeamount1(event: any) {
    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT = 0;
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT = 0;

    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
      Number(event) +
      Number(this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT) +
      this.acctotal1 +
      Number(this.placeorderdata.FOOD_ADMISIBLE_AMOUNT);

    if (
      this.advanceamountta == undefined ||
      this.advanceamountta == null ||
      this.advanceamountta == '' ||
      this.advanceamountta == "'NaN'"
    ) {
      this.advanceamountta = 0;
    }

    this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
      Number(this.advanceamountta);
  }
  changeamount2(event: any) {
    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT = 0;
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT = 0;

    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT) +
      Number(event) +
      Number(this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT) +
      this.acctotal1 +
      Number(this.placeorderdata.FOOD_ADMISIBLE_AMOUNT);

    if (
      this.advanceamountta == undefined ||
      this.advanceamountta == null ||
      this.advanceamountta == '' ||
      this.advanceamountta == "'NaN'"
    ) {
      this.advanceamountta = 0;
    }

    this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
      Number(this.advanceamountta);
  }
  changeamount3(event: any) {
    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT = 0;
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT = 0;

    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT) +
      Number(event) +
      Number(this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT) +
      this.acctotal1 +
      Number(this.placeorderdata.FOOD_ADMISIBLE_AMOUNT);

    if (
      this.advanceamountta == undefined ||
      this.advanceamountta == null ||
      this.advanceamountta == '' ||
      this.advanceamountta == "'NaN'"
    ) {
      this.advanceamountta = 0;
    }

    this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
      Number(this.advanceamountta);
  }
  changeamount5(event: any) {
    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT = 0;
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT = 0;

    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT) +
      Number(event) +
      Number(this.placeorderdata.FOOD_ADMISIBLE_AMOUNT);

    if (
      this.advanceamountta == undefined ||
      this.advanceamountta == null ||
      this.advanceamountta == '' ||
      this.advanceamountta == "'NaN'"
    ) {
      this.advanceamountta = 0;
    }

    this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
      Number(this.advanceamountta);
  }
  changeamount4(event: any) {
    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT = 0;
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT = 0;

    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT) +
      Number(event) +
      this.acctotal1;

    if (
      this.advanceamountta == undefined ||
      this.advanceamountta == null ||
      this.advanceamountta == '' ||
      this.advanceamountta == "'NaN'"
    ) {
      this.advanceamountta = 0;
    }

    // this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
    //   Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
    //   Number(this.advanceamountta);
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
      Number(this.advanceamountta);
  }

  changeamount6(event: any) {
    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT = 0;
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT = 0;

    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT) +
      Number(this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT) +
      Number(event) +
      this.acctotal1 +
      Number(this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT);

    if (
      this.advanceamountta == undefined ||
      this.advanceamountta == null ||
      this.advanceamountta == '' ||
      this.advanceamountta == "'NaN'"
    ) {
      this.advanceamountta = 0;
    }

    // this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
    //   Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
    //   Number(this.advanceamountta);
    this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
      Number(this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT) -
      Number(this.advanceamountta);
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  // DRAWER2

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
