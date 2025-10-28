import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { Checklisttour } from 'src/app/Medical/Models/checklisttour';
import { Deatailsandpurposeoftours } from 'src/app/Medical/Models/deatailsandpurposetour';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-employeetourlist',
  templateUrl: './employeetourlist.component.html',
  styleUrls: ['./employeetourlist.component.css'],
  providers: [NzNotificationService]
})
export class EmployeetourlistComponent implements OnInit {
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  drawerTitle1: string = '';
  drawerTitle2: string = '';
  drawerTitle3: string = '';
  drawerTitle4: string = '';
  drawerTitle5: string = '';
  drawerTitle6: string = '';
  drawerTitle7: string = '';
  drawerTitle8: string = '';
  drawerTitle9: string = '';
  drawerTitle10: string = '';
  drawerTitle11: string = '';
  drawerLogTitle: string = '';
  drawerLogData: any = [];
  partborder = false;
  adheshorder = false;
  duplicatecertificte = false;
  transferallounce = false;
  certificateorder = false;
  drawerData: Tourmaster = new Tourmaster();
  detailsjourneyofpurpose: Deatailsandpurposeoftours =
    new Deatailsandpurposeoftours();
  empID;
  tourID;
  isSpinning = false;
  userId: any;
  extraFilterQuery: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) { }
  columns: string[][] = [['EMPLOYEE_NAME', 'EMPLOYEE_NAME']];
  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    // this.search();
  }
  drawerTitleform7!: string;
  drawerVisibleform7: boolean = false;
  // drawerDataform7: Journeydetails = new Journeydetails();
  SECTION_TYPE: any;
  NAME: any;
  NAME_HN: any;
  OFFICE_NAME: any;
  OFFICE_NAME_HN: any;
  POST: any;
  POST_HN: any;
  deatailsandpurpose(): void {
    this.drawerTitleform7 = 'Add Transportion Charges';
    // this.drawerDataform7 = new Journeydetails();
    this.drawerVisibleform7 = true;
  }

  drawerCloseform7(): void {
    // this.getDataform7();
    this.drawerVisibleform7 = false;
  }

  get closeCallbackform7() {
    return this.drawerCloseform7.bind(this);
  }

  drawerClose(): void {
    this.currentStage = 0;
    this.search();
    this.isSpin = false;
    this.drawerVisible = false;

    // window.location.reload();
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }
  // data2: Deatailsandpurposeoftours = new Deatailsandpurposeoftours();
  add(): void {
    var employeeedit = Number(sessionStorage.getItem('userId'));
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + employeeedit)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            // this.dataList = data['data'];
            this.drawerData = Object.assign({}, data['data'][0]);


            this.drawerTitle = 'Create New Tour';
            this.drawerData['EMPLOYEE_NAME'] = this.drawerData['NAME'];
            this.drawerData['BASIC_PAY'] = this.drawerData['GRADE_PAY'];
            this.drawerData['EMP_ID'] = this.drawerData['ID'];
            this.drawerData['ID'] = 0;

            this.detailsjourneyofpurpose = new Deatailsandpurposeoftours();
            this.detailsandpurpose = [];
            this.particularofhotelsdata = [];
            this.particularoftours = [];
            this.currentStage = 0;
            this.tourID = '';
            this.empID = Number(sessionStorage.getItem('userId'));
            this.isSpin = false;
            this.drawerVisible = true;
            this.editdata = false;
          } else {
            this.message.error('Can,t Load Employee Information', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );
  }

  adheshdata: any = [];
  tourpartbdata: any = [];

  certificatedata: any = [];
  aayakarbhavandata: any = [];

  toursanctionorder: any = [];
  selftoursanctionorder: any = [];
  tourtravellingllounce: any = [];
  checklist: any = [];
  checklistyesno: any = [];
  aheshorder(data: Tourmaster) {
    this.loadingRecords = true;
    // this.adheshdata = data;
    this.drawerTitle3 = 'Aadhesh';
    this.adheshdata = Object.assign({}, data);
    if (
      this.adheshdata.SIGNATURE_ID != undefined ||
      this.adheshdata.SIGNATURE_ID != null
    ) {
      this.api
        .getSignature(0, 0, '', '', ' AND ID = ' + this.adheshdata.SIGNATURE_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              // this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];

              this.NAME = data['data'][0]['NAME'];
              this.NAME_HN = data['data'][0]['NAME_HN'];
              this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
              this.POST = data['data'][0]['POST'];
              this.POST_HN = data['data'][0]['POST_HN'];
              this.loadingRecords = false;
              this.adheshorder = true;
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {

          }
        );
    } else {
      this.adheshorder = true;
      this.loadingRecords = false;
    }
  }

  certificateduplicate(data: any) {
    this.drawerTitle4 = 'Certificate Duplicte';
    this.certificatedata = Object.assign({}, data);


    this.api
      .gettoursparticularhotel(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.particularofhotelsdata1 = data['data'];

        }
      });
    this.duplicatecertificte = true;
  }

  adheshdrawerclose() {
    this.adheshorder = false;
    this.search();
  }
  get closeCallbackadhesh() {
    return this.adheshdrawerclose.bind(this);
  }
  certificateduplicaterawerclose() {
    this.duplicatecertificte = false;
    this.search();
  }
  get closeCallbackacertificateduplicate() {
    return this.certificateduplicaterawerclose.bind(this);
  }

  tourpartbloadingcharges: any;
  partcityamount: any;
  totalamountofpartb: any;
  particularofcityamount: any = [];

  totalamountofhotel = 0;
  journeytotalamounttourpartb = 0;
  advanceamountoftourpartb = 0;
  tourpart_b(data: any) {
    this.drawerTitle2 = 'Tour Part B';
    this.tourpartbloadingcharges = 0;
    this.totalamountofpartb = 0;
    this.totalamountofhotel = 0;
    this.journeytotalamounttourpartb = 0;
    this.partcityamount = 0;
    this.tourpartbdata = Object.assign({}, data);
    this.advanceamountoftourpartb = data['AMOUNT_OF_T_A'];
    this.api
      .gettoursparticularhotel(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.tourparticularofhotelsdata = data['data'];

          for (let i = 0; i < this.tourparticularofhotelsdata.length; i++) {
            this.totalamountofhotel +=
              this.tourparticularofhotelsdata[i]['TOTAL_AMOUNT_PAID'];
          }

          this.calculateTotalAmountOfPartB();
        }
      });

    this.api
      .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.detailsandpurpose = data['data'];
          for (let i = 0; i < this.detailsandpurpose.length; i++) {
            this.journeytotalamounttourpartb +=
              this.detailsandpurpose[i]['FARE_PAID'];
          }

          this.calculateTotalAmountOfPartB();
        }
      });
    // this.totalamountofpartb =
    //   this.journeytotalamounttourpartb + this.totalamountofhotel - this.advanceamountoftourpartb;
    // 

    this.tourpartbvisible = true;
  }

  calculateTotalAmountOfPartB() {
    this.totalamountofpartb =
      this.journeytotalamounttourpartb +
      this.totalamountofhotel -
      this.advanceamountoftourpartb;

  }
  tourpartbvisible: boolean = false;
  tourpartb() {
    this.tourpartbvisible = false;
    this.search();
  }
  get closeCallbacktourpartb() {
    return this.tourpartb.bind(this);
  }

  billsection: boolean = false;
  billDrawerData: any = [];
  tousanctionorder: any = [];
  billDrawerTitle: string = '';
  billsectiondata: any = [];
  // biillsection(data: any) {
  //   this.drawerTitle5 = 'Bill Section';
  //   this.billDrawerData = Object.assign({}, data);
  //   this.billDrawerTitle = 'Bill Section';
  //   this.api
  //     .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.billsectiondata = data['data'][0];

  //         
  //       }
  //     });

  //   this.billsection = true;
  // }

  biillsection(data: any) {
    this.drawerTitle5 = 'Bill Section';
    this.billDrawerData = Object.assign({}, data);
    this.billDrawerTitle = 'Bill Section';
    this.api
      .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.billsectiondata = data['data'];

        }
      });

    this.billsection = true;
  }

  billsectionclose() {
    this.billsection = false;
    this.search();
  }

  get closeCallbackbillsetion() {
    return this.billsectionclose.bind(this);
  }

  aayakarbhavan: boolean = false;
  aaykardata: any;

  aayakrbhavan(data: Tourmaster) {
    this.drawerTitle6 = 'Aaykar';
    this.aayakarbhavandata = Object.assign({}, data);


    this.aayakarbhavan = true;
  }

  aayakarbhavanclose() {
    this.aayakarbhavan = false;
    this.search();
  }
  get closeCallbackaayakarbhavan() {
    return this.aayakarbhavanclose.bind(this);
  }

  selfsancationorder: boolean = false;
  // selfsanction(data: Tourmaster) {
  //   this.drawerTitle7 = 'Sanction Order';
  //   this.selftoursanctionorder = Object.assign({}, data);
  //   
  //   this.selfsancationorder = true;
  // }
  selfdeclarationdata: any = [];
  selfsanction(data: Tourmaster) {
    this.drawerTitle7 = 'Sanction Order';
    this.selftoursanctionorder = Object.assign({}, data);
    this.api
      .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.selfdeclarationdata = data['data'];

        }
      });
    this.selfsancationorder = true;
  }

  selfsanctionclose() {
    this.selfsancationorder = false;
    this.search();
  }
  get closeCalselfsnction() {
    return this.selfsanctionclose.bind(this);
  }

  toursancationorder: boolean = false;
  toursanction(data: any) {
    this.drawerTitle8 = 'Tour Sanction Order';
    this.toursanctionorder = Object.assign({}, data);


    this.api
      .getdeatilssofpurpose(0, 0, '', ' ', ' AND TOUR_ID =' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) this.tousanctionorder = data['data'];
          // this.relationdataorder = data['data'];
        },

        (err) => {

        }
      );
    this.toursancationorder = true;
  }

  toursanctionclose() {
    this.search();
    this.toursancationorder = false;
  }
  get closebacktour() {
    return this.toursanctionclose.bind(this);
  }

  placealongorder: boolean = false;
  placeorderdata: any = [];
  placeorderjourney: any = [];
  placeorderrail: any = [];
  placeorderjourneydata: any = [];
  placeorderhotel: any;
  placeorderjourneycount: any;
  placeorderrailcount: any;
  totalcountofplaceorder: any;
  // placeordervisible(): void {
  //   this.drawerTitle11 = 'Place Order';
  //   this.placeorderhotel = 0;
  //   this.placeorderjourneycount = 0;
  //   this.placeorderrailcount = 0;

  //   // this.api
  //   //   .gettoursparticularhotel(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
  //   //   .subscribe((data) => {
  //   //     if (data['code'] == 200) {
  //   //       this.placeorderdata = data['data'];
  //   //       for (let i = 0; i < this.placeorderdata.length; i++) {
  //   //         this.placeorderhotel = this.placeorderdata[i]['DAILY_RATE_OF_LODGING_CHARGES']
  //   //       }
  //   //       
  //   //     }
  //   //   });

  //   // this.api
  //   //   .getjourneyofparticulartours(
  //   //     0,
  //   //     0,
  //   //     '',
  //   //     'asc',
  //   //     ' AND TOUR_ID =' + data.ID
  //   //   )
  //   //   .subscribe((data) => {
  //   //     if (data['code'] == 200) {
  //   //       this.placeorderjourney = data['data'];
  //   //       for (let i = 0; i < this.placeorderjourney.length; i++) {
  //   //         this.placeorderjourneycount = this.placeorderjourney[i]['FARE_OF_ENTITLED_CLASS']
  //   //       }
  //   //       
  //   //     }
  //   //   });

  //   // this.api
  //   //   .getjourneyofparticularcity(
  //   //     0,
  //   //     0,
  //   //     '',
  //   //     'asc',
  //   //     ' AND TOUR_ID =' + data.ID
  //   //   )
  //   //   .subscribe((data) => {
  //   //     if (data['code'] == 200) {
  //   //       this.placeorderrail = data['data'];
  //   //       for (let i = 0; i < this.placeorderrail.length; i++) {
  //   //         this.placeorderrailcount = this.placeorderrail[i]['FARE_PAID']
  //   //       }
  //   //       
  //   //     }
  //   //   });

  //   this.totalcountofplaceorder =
  //     this.placeorderhotel +
  //     this.placeorderjourneycount +
  //     this.placeorderrailcount;
  //   
  //   this.placealongorder = true;
  // }

  airtotal = 0;
  Railtotal = 0;
  Roadtotal = 0;
  ShipBoattotal = 0;
  alltotal = 0;
  // placeordervisible(data: any) {
  //   this.airtotal = 0;
  //   this.Railtotal = 0;
  //   this.Roadtotal = 0;
  //   this.ShipBoattotal = 0;
  //   this.alltotal = 0;
  //   this.drawerTitle11 = 'Place Order';
  //   this.api
  //     .getdeatilssofpurpose(0, 0, '', '', ' AND TOUR_ID = ' + data.ID)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.detailsandpurpose = data['data'];
  //           

  //           for (let i = 0; i < this.detailsandpurpose.length; i++) {
  //             if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 5) {
  //               this.airtotal += this.detailsandpurpose[i]['FARE_PAID'];
  //             }
  //           }
  //           for (let i = 0; i < this.detailsandpurpose.length; i++) {
  //             if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 3)
  //               this.Roadtotal += this.detailsandpurpose[i]['FARE_PAID'];
  //           }

  //           for (let i = 0; i < this.detailsandpurpose.length; i++) {
  //             if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 6)
  //               this.ShipBoattotal += this.detailsandpurpose[i]['FARE_PAID'];
  //           }
  //           for (let i = 0; i < this.detailsandpurpose.length; i++) {
  //             if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 4)
  //               this.Railtotal += this.detailsandpurpose[i]['FARE_PAID'];
  //           }

  //           this.alltotal =
  //             this.airtotal +
  //             this.Roadtotal +
  //             this.ShipBoattotal +
  //             this.Railtotal;

  //           // <span *ngIf="partadata.TRAVEL_MODE_ID==6">ShipBoat</span>
  //           // <span *ngIf="partadata.TRAVEL_MODE_ID==5">Air</span>
  //           // <span *ngIf="partadata.TRAVEL_MODE_ID==4">Reil</span>
  //           // <span *ngIf="partadata.TRAVEL_MODE_ID==3">Road</span>

  //           this.placealongorder = true;
  //           this.isSpinning = false;
  //         } else {
  //           this.message.error('Something Went Wrong', '');
  //           this.isSpinning = false;
  //         }
  //       },
  //       (err) => {
  //         
  //       }
  //     );
  // }

  advanceamountta: any;
  accototal = 0;
  nettotalamountplaceorder = 0;
  placeordervisible(data: any) {
    this.airtotal = 0;
    this.Railtotal = 0;
    this.Roadtotal = 0;
    this.accototal = 0;
    this.ShipBoattotal = 0;
    this.advanceamountta = 0;
    this.alltotal = 0;
    this.drawerTitle11 = 'Place Order';
    this.placeorderdata = Object.assign({}, data);


    this.advanceamountta = data['AMOUNT_OF_T_A'];
    this.api
      .getdeatilssofpurpose(0, 0, '', '', ' AND TOUR_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.detailsandpurpose = data['data'];


            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 5) {
                this.airtotal += this.detailsandpurpose[i]['FARE_PAID'];
              }
            }
            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 3)
                this.Roadtotal += this.detailsandpurpose[i]['FARE_PAID'];
            }

            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 6)
                this.ShipBoattotal += this.detailsandpurpose[i]['FARE_PAID'];
            }
            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 4)
                this.Railtotal += this.detailsandpurpose[i]['FARE_PAID'];
            }

            this.api
              .gettoursparticularhotel(
                0,
                0,
                '',
                'asc',
                ' AND TOUR_ID =' + this.placeorderdata.ID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  if (data['code'] == 200) {
                    this.particularofhotelsdata = data['data'];

                    for (
                      let i = 0;
                      i < this.particularofhotelsdata.length;
                      i++
                    ) {
                      this.accototal +=
                        this.particularofhotelsdata[i]['TOTAL_AMOUNT_PAID'];
                    }
                  }
                  if (this.airtotal == 0) {
                    this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT = 0;
                  }
                  if (this.Roadtotal == 0) {
                    this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT = 0;
                  }
                  if (this.ShipBoattotal == 0) {
                    this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT = 0;
                  }
                  if (this.Railtotal == 0) {
                    this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT = 0;
                  }
                  if (this.accototal == 0) {
                    this.placeorderdata.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT = 0;
                  }

                  this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
                    this.placeorderdata.PLACE_ORDER_AIR_ADMISSIBLE_AMOUNT +
                    this.placeorderdata.PLACE_ORDER_ROAD_ADMISSIBLE_AMOUNT +
                    this.placeorderdata.PLACE_ORDER_SHIP_ADMISSIBLE_AMOUNT +
                    this.placeorderdata.PLACE_ORDER_RAIL_ADMISSIBLE_AMOUNT +
                    this.placeorderdata
                      .PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT;

                  if (
                    this.advanceamountta == undefined ||
                    this.advanceamountta == null ||
                    this.advanceamountta == '' ||
                    this.advanceamountta == "'NaN'"
                  ) {
                    this.advanceamountta = 0;
                  }
                  this.alltotal =
                    this.airtotal +
                    this.Roadtotal +
                    this.ShipBoattotal +
                    this.Railtotal +
                    this.accototal;

                  this.nettotalamountplaceorder =
                    this.alltotal - this.advanceamountta;

                  this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
                    this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT -
                    this.advanceamountta;

                  this.placealongorder = true;
                  this.isSpinning = false;
                }
              });
          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );

    this.api
      .getdeatilssofpurpose(0, 0, '', '', ' AND TOUR_ID = ' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.placeorderjourneydata = data['data'];

          } else {
            this.message.error('Something Went Wrong', '');
            this.isSpinning = false;
          }
        },
        (err) => {

        }
      );
  }
  placeorderclose() {
    this.search();
    this.placealongorder = false;
  }
  get closebackplacealong() {
    return this.placeorderclose.bind(this);
    this.search();
  }
  partadata: any = [];
  particularofcity: any = [];
  tourprtaorder: boolean = false;
  fooddata: any
  tourprtaordervisible(data: any) {
    this.drawerTitle1 = 'Tour Part A';
    this.partadata = data;

    if (data.ID != undefined && data.ID != null && data.ID != '') {
      this.api
        .getdeatilssofpurpose(0, 0, '', '', ' AND TOUR_ID = ' + data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.detailsandpurpose = data['data'];


              this.isSpinning = false;
            } else {
              this.message.error('Something Went Wrong', '');
              this.isSpinning = false;
            }
          },
          (err) => {

          }
        );

      this.api
        .gettoursparticularhotel(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.particularofhotelsdata = data['data'];

          }
        });

      this.api
        .getjourneyofparticulartours(
          0,
          0,
          '',
          'asc',
          ' AND TOUR_ID =' + data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.particularoftours = data['data'];

          }
        });

      this.api
        .getjourneyofparticularcity(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.particularofcity = data['data'];

          }
        });

      this.api
        .gettoursFood(0, 0, '', 'asc', ' AND TOUR_ID =' + +data.ID)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.fooddata = data['data'];


            // for (let i = 0; i < this.fooddata.length; i++) {
            //   this.foodtotal +=
            //     this.fooddata[i]['FOOD_ADMISIBLE_AMOUNT'];
            //   this.foodtotal1 += this.fooddata[i]['EXPENSE_AMOUNT'];
            // }
          }
        });

      this.tourprtaorder = true;
    } else {
    }
  }

  tourpartaorderclose() {
    this.search();
    this.tourprtaorder = false;
  }
  get closebacktourprta() {
    return this.tourpartaorderclose.bind(this);
  }

  trvellingbalanceaorder: boolean = false;
  travellingdata: any = [];
  travellingaordervisible(data: any) {
    this.drawerTitle10 = 'Travelling allowance';
    this.tourtravellingllounce = Object.assign({}, data);

    this.api
      .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.travellingdata = data['data'];


        }
      });
    this.trvellingbalanceaorder = true;
  }

  travellingaorderclose() {
    this.search();
    this.trvellingbalanceaorder = false;
  }
  get closebacktravelling() {
    return this.travellingaorderclose.bind(this);
  }

  checklistorder: boolean = false;
  chceklistaordervisible(data: any) {
    this.drawerTitle11 = 'Checklist';
    this.checklist = Object.assign({}, data);

    this.api
      .getTourChecklist(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.checklistyesno = data['data'][0];
          } else {
            this.checklistyesno = new Checklisttour();
          }
          this.checklistorder = true;
        } else {
        }
      });

    if (
      this.checklist.SIGNATURE_ID != undefined ||
      this.checklist.SIGNATURE_ID != null
    ) {
      this.api
        .getSignature(0, 0, '', '', ' AND ID = ' + this.checklist.SIGNATURE_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.NAME = data['data'][0]['NAME'];
              this.NAME_HN = data['data'][0]['NAME_HN'];
              this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
              this.POST = data['data'][0]['POST'];
              this.POST_HN = data['data'][0]['POST_HN'];
              this.loadingRecords = false;
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {

          }
        );
    } else {
      this.loadingRecords = false;
    }
  }

  checklistorderclose() {
    this.search();
    this.checklistorder = false;
  }
  get closebackchecklist() {
    return this.checklistorderclose.bind(this);
  }

  // deleteConfirm(data: any) {
  //   
  //   this.loadingRecords = true;
  //   var data1 = {
  //     TOUR_ID: data.ID,
  //     EMPLOYEE_ID: data.EMP_ID,
  //     INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
  //   };
  //   this.api.deletetour(data1).subscribe((successCode) => {
  //     if (successCode.code == '200') {
  //       this.message.success('Record Deleted Successfully...', '');
  //       this.search();
  //       this.loadingRecords = false;
  //     } else {
  //       this.message.error('Information Has Not Deleted...', '');
  //       this.loadingRecords = false;
  //     }
  //   });
  // }

  deleteCancel() { }
  deleteConfirm(data: any) {

    this.loadingRecords = true;
    // var data1 = {
    //   TOUR_ID: data.ID,
    //   EMPLOYEE_ID: data.EMP_ID,
    //   INSPECTOR_ID: Number(sessionStorage.getItem('userId')),
    // };
    data.IS_DELETED = 1;

    this.api.updatetour(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Record Deleted Successfully...', '');
        this.search();
        this.loadingRecords = false;
      } else {
        this.message.error('Information Has Not Deleted...', '');
        this.loadingRecords = false;
      }
    });
  }
  editdata: boolean;
  currentStage = 0;
  claimid: any;
  detailsandpurpose: any = [];
  particularofhotelsdata: any = [];
  tourparticularofhotelsdata: any = [];
  particularofhotelsdata1: any = [];
  particularoftours: any = [];
  relationdataorder: any = [];
  Hospitalclaim: any = [];
  isSpin: boolean = false;
  edit(data: any): void {
    this.claimid = data.ID;
    this.isSpinning = false;
    this.isSpin = false;
    // this.currentTab = 0;
    this.drawerTitle = 'Edit Tour Details';
    // this.drawerData = Object.assign({}, data);
    this.api
      .getdeatilssofpurpose(0, 0, '', ' ', ' AND TOUR_ID =' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0)
            this.detailsandpurpose = data['data'];
          // this.relationdataorder = data['data'];

        },

        (err) => {

        }
      );
    this.detailsjourneyofpurpose = new Deatailsandpurposeoftours();
    this.drawerData = Object.assign({}, data);

    // this.api
    //   .getEmployeeMaster(0, 0, '', '', ' AND ID =' + data.EMP_ID)
    //   .subscribe(
    //     (data) => {
    //       if (data['code'] == 200) {
    //         this.drawerData = Object.assign({}, data['data'][0]);
    //         this.drawerData['EMP_ID'] = this.drawerData['ID'];

    //       } else {
    //         this.message.error('Can,t Load Employee Information', '');
    //       }
    //     },
    //     (err) => {
    //       
    //     }
    //   );

    // this.drawerData3 = Object.assign({}, data);
    // 
    this.empID = data.EMP_ID;
    this.tourID = data.ID;
    // this.drawerData['EMPLOYEE_NAME'] = this.drawerData['NAME'];
    // this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    // this.drawerData['BASIC_PAY'] = this.drawerData['GRADE_PAY'];
    // this.drawerData['NAME'] = this.drawerData['EMPLOYEE_NAME'];
    // this.drawerData['EMP_ID'] = this.drawerData['EMP_ID'];
    // this.drawerData['DESIGNATION'] = this.drawerData['DESIGNATION'];
    // this.drawerData['HEADQUARTERS_NAME'] = this.drawerData['OFFICE_NAME'];
    // this.drawerData['DDO_OF_THE_OFFICIAL'] =
    //   this.drawerData['DDO_OF_THE_OFFICIAL'];
    // this.drawerData['EMPLOYEE_CODE'] = this.drawerData['EMPLOYEE_CODE'];
    // this.drawerData['GRADE_PAY'] = this.drawerData['GRADE_PAY'];
    // this.drawerData['MOBILE_NO'] = this.drawerData['MOBILE_NO'];
    this.drawerVisible = true;
  }
  keyup(event: any) {
    this.search();
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    // this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);

    }
    if (this.userId == 1) {
      this.extraFilterQuery = '';
    } else {
      this.extraFilterQuery = 'AND EMP_ID = ' + this.userId;
    }
    this.api
      .gettouralldata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilterQuery + likeQuery
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          // if(this.totalRecords==0){
          //   data.SEQUENCE_NUMBER=1;
          // }else{
          //   data.SEQUENCE_NUMBER= this.dataList[this.dataList.length-1]['SEQUENCE_NUMBER']+1
          // }
        },
        (err) => {

        }
      );
  }

  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }
  FILE_NO: any;
}
