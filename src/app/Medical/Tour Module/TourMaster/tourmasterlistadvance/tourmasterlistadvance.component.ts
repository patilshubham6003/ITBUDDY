import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { TourSignatureMapData } from 'src/app/Medical/Models/TourSignatures';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { Checklisttour } from 'src/app/Medical/Models/checklisttour';
import { Deatailsandpurposeoftours } from 'src/app/Medical/Models/deatailsandpurposetour';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-tourmasterlistadvance',
  templateUrl: './tourmasterlistadvance.component.html',
  styleUrls: ['./tourmasterlistadvance.component.css'],
})
export class TourmasterlistadvanceComponent {
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
  drawerLogData = [];
  partborder = false;
  adheshorder = false;
  duplicatecertificte = false;
  transferallounce = false;
  certificateorder = false;
  drawerData: Tourmaster = new Tourmaster();
  detailsjourneyofpurpose: Deatailsandpurposeoftours =
    new Deatailsandpurposeoftours();

  SignatureMaptourpartbdata: TourSignatureMapData = new TourSignatureMapData();
  SignatureMapCheckList: TourSignatureMapData = new TourSignatureMapData();
  PlaceOrderMapCheckList: TourSignatureMapData = new TourSignatureMapData();
  AdvanceBillView: TourSignatureMapData = new TourSignatureMapData();
  AdvanceShortBillView: TourSignatureMapData = new TourSignatureMapData();
  ManjuriAdeshView: TourSignatureMapData = new TourSignatureMapData();
  empID;
  tourID;
  isSpinning = false;
  userId: any;
  parentUserId: any;
  extraFilterQuery: any;
  isAdmin: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  columns: string[][] = [['EMPLOYEE_NAME', 'EMPLOYEE_NAME']];
  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId');
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
    //
    //

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

    if (this.isAdmin) {
      this.loadAllUsers();
    }
    // this.search();
  }
  // drawerDataform7: Journeydetails = new Journeydetails();
  SECTION_TYPE: any;
  NAME: any;
  NAME_HN: any;
  OFFICE_NAME: any;
  OFFICE_NAME_HN: any;
  POST: any;
  POST_HN: any;

  drawerClose(): void {
    this.currentStage = 0;
    this.search();
    this.isSpin = false;
    this.isCreate = false;
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
  isCreate: boolean = false;
  add(): void {
    this.drawerTitle = 'Create New Tour';
    this.drawerData = new Tourmaster();
    this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
      sessionStorage.getItem('ddoId')
    );
    this.drawerData.IS_APPLYING_FOR_ADVANCE = true;
    this.detailsjourneyofpurpose = new Deatailsandpurposeoftours();
    this.detailsandpurpose = [];
    this.particularofhotelsdata = [];
    this.particularoftours = [];
    this.currentStage = 0;
    this.tourID = '';
    this.empID = '';
    this.isSpin = false;
    this.isCreate = true;
    this.drawerVisible = true;
    this.editdata = false;
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
        .getSignature(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND ID = ' + this.adheshdata.SIGNATURE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
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
          (err) => {}
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
  particularofcityamount = [];

  totalamountofhotel = 0;
  journeytotalamounttourpartb = 0;
  advanceamountoftourpartb = 0;
  foodAdmissibleAmount = 0;
  accommodationAdmissibleAmount = 0;
  hotelAdmissibleAmount = 0;
  intercityAdmissibleAmount = 0;
  grossAmount = 0;
  actualExpences = 0;
  tourpart_b(data: any) {
    this.loadingRecords = true;
    this.drawerTitle2 = 'Tour Part B';
    this.tourpartbloadingcharges = 0;
    this.totalamountofpartb = 0;
    this.totalamountofhotel = 0;
    this.journeytotalamounttourpartb = 0;
    this.partcityamount = 0;
    this.foodAdmissibleAmount = 0;
    this.accommodationAdmissibleAmount = 0;
    this.hotelAdmissibleAmount = 0;
    this.intercityAdmissibleAmount = 0;
    this.actualExpences = 0;
    this.grossAmount = 0;
    this.tourpartbdata = Object.assign({}, data);
    this.advanceamountoftourpartb = data['AMOUNT_OF_T_A'];

    if (this.tourpartbdata.ID !== undefined && this.tourpartbdata.ID !== null) {
      this.api
        .GettourSignature(
          0,
          0,
          '',
          'asc',
          ' AND TOUR_ID =' + this.tourpartbdata.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.SignatureMaptourpartbdata = data['data'][0];
            } else {
            }
          } else {
            this.SignatureMaptourpartbdata = new TourSignatureMapData();
          }
        });
    }

    // this.api
    //   .gettoursparticularhotel(
    //     0,
    //     0,
    //     '',
    //     'asc',
    //     ' AND TOUR_ID =' + this.tourpartbdata.ID
    //   )
    //   .subscribe((data) => {
    //     if (data['code'] == 200) {
    //       this.tourparticularofhotelsdata = data['data'];
    //       for (let i = 0; i < this.tourparticularofhotelsdata.length; i++) {
    //         this.totalamountofhotel +=
    //           this.tourparticularofhotelsdata[i]['TOTAL_AMOUNT_PAID'];
    //       }
    //
    //       // this.calculateTotalAmountOfPartB();
    //     }
    //   });

    this.api
      .getdeatilssofpurpose(
        0,
        0,
        '',
        'asc',
        ' AND TOUR_ID =' + this.tourpartbdata.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.detailsandpurpose = data['data'];
          for (let i = 0; i < this.detailsandpurpose.length; i++) {
            this.journeytotalamounttourpartb +=
              this.detailsandpurpose[i]['FARE_PAID'];
          }

          // this.calculateTotalAmountOfPartB();
        }
      });

    this.api
      .gettoursFood(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourpartbdata.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          for (let i = 0; i < data['data'].length; i++) {
            this.foodAdmissibleAmount +=
              data['data'][i]['FOOD_ADMISIBLE_AMOUNT'];
          }

          this.api
            .getjourneyofparticulartours(
              0,
              0,
              '',
              'asc',
              ' AND TOUR_ID =' + this.tourpartbdata.ID
            )
            .subscribe((data) => {
              if (data['code'] == 200) {
                for (let i = 0; i < data['data'].length; i++) {
                  this.accommodationAdmissibleAmount +=
                    data['data'][i]['FARE_OF_ENTITLED_CLASS'];
                }

                this.api
                  .gettoursparticularhotel(
                    0,
                    0,
                    '',
                    'asc',
                    ' AND TOUR_ID =' + this.tourpartbdata.ID
                  )
                  .subscribe((data) => {
                    if (data['code'] == 200) {
                      for (let i = 0; i < data['data'].length; i++) {
                        this.hotelAdmissibleAmount +=
                          data['data'][i]['TOTAL_AMOUNT_PAID'];
                      }

                      this.api
                        .getjourneyofparticularcity(
                          0,
                          0,
                          '',
                          'asc',
                          ' AND TOUR_ID =' + this.tourpartbdata.ID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            for (let i = 0; i < data['data'].length; i++) {
                              this.intercityAdmissibleAmount +=
                                data['data'][i]['FARE_PAID'];
                            }

                            ////Actual Expenses/////
                            this.actualExpences =
                              this.foodAdmissibleAmount +
                              this.accommodationAdmissibleAmount +
                              this.hotelAdmissibleAmount +
                              this.intercityAdmissibleAmount;

                            this.actualExpences = Math.round(
                              this.actualExpences
                            );
                            ////Actual Expenses/////
                            ///////Total /////////
                            this.totalamountofpartb =
                              this.journeytotalamounttourpartb +
                              this.foodAdmissibleAmount +
                              this.accommodationAdmissibleAmount +
                              this.hotelAdmissibleAmount +
                              this.intercityAdmissibleAmount -
                              //  +this.totalamountofhotel
                              this.advanceamountoftourpartb;

                            this.totalamountofpartb = Math.round(
                              this.totalamountofpartb
                            );
                            ///////Total /////////

                            //////Gross Amount /////
                            this.grossAmount =
                              this.journeytotalamounttourpartb +
                              this.actualExpences;
                            this.grossAmount = Math.round(this.grossAmount);
                            //////Gross Amount /////
                            this.loadingRecords = false;
                            this.tourpartbvisible = true;
                          }
                        });
                    } else {
                      this.message.error('Failed To Load Hotel Data', '');
                    }
                  });
              } else {
                this.message.error('Failed To Load Data', '');
              }
            });
        } else {
          this.message.error('Failed To Load Food Data', '');
        }
      });

    // this.totalamountofpartb =
    //   this.journeytotalamounttourpartb + this.totalamountofhotel - this.advanceamountoftourpartb;
    //
  }
  tourNewpartbvisible: boolean = false;
  destinationList: any = [];
  netPayAmount = 0;
  tourNewpart_b(data: any) {
    this.loadingRecords = true;
    this.drawerTitle2 = 'Tour Part B';
    this.tourpartbloadingcharges = 0;
    this.totalamountofpartb = 0;
    this.totalamountofhotel = 0;
    this.journeytotalamounttourpartb = 0;
    this.partcityamount = 0;
    this.foodAdmissibleAmount = 0;
    this.accommodationAdmissibleAmount = 0;
    this.hotelAdmissibleAmount = 0;
    this.intercityAdmissibleAmount = 0;
    this.actualExpences = 0;
    this.grossAmount = 0;
    this.tourpartbdata = Object.assign({}, data);
    this.advanceamountoftourpartb = data['AMOUNT_OF_T_A'];
    this.destinationList = [];
    // this.api
    //   .gettoursparticularhotel(
    //     0,
    //     0,
    //     '',
    //     'asc',
    //     ' AND TOUR_ID =' + this.tourpartbdata.ID
    //   )
    //   .subscribe((data) => {
    //     if (data['code'] == 200) {
    //       this.tourparticularofhotelsdata = data['data'];
    //       for (let i = 0; i < this.tourparticularofhotelsdata.length; i++) {
    //         this.totalamountofhotel +=
    //           this.tourparticularofhotelsdata[i]['TOTAL_AMOUNT_PAID'];
    //       }
    //
    //       // this.calculateTotalAmountOfPartB();
    //     }
    //   });
    this.api
      .getdeatilssofpurpose(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            for (let i = 0; i < data['data'].length; i++) {
              this.destinationList.push(data['data'][i].DEPARTURE_FROM);
              this.destinationList.push(data['data'][i].ARRIVAL_TO);
            }
          } else {
            this.destinationList = [];
          }
        }
      });
    if (data.SIGNATURE_ID != null) {
      this.api
        .getSignature(
          0,
          0,
          '',
          '',
          ' AND STATUS = 1 AND ID = ' + data.SIGNATURE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
              this.NAME = data['data'][0]['NAME'];
              this.NAME_HN = data['data'][0]['NAME_HN'];
              this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
              this.POST = data['data'][0]['POST'];
              this.POST_HN = data['data'][0]['POST_HN'];
            } else {
              this.message.error('Something Went Wrong', '');
              this.loadingRecords = false;
            }
          },
          (err) => {}
        );
    } else {
    }

    this.api
      .getdeatilssofpurpose(
        0,
        0,
        '',
        'asc',
        ' AND TOUR_ID =' + this.tourpartbdata.ID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.detailsandpurpose = data['data'];
          for (let i = 0; i < this.detailsandpurpose.length; i++) {
            this.journeytotalamounttourpartb +=
              this.detailsandpurpose[i]['FARE_PAID'];
          }
          // this.calculateTotalAmountOfPartB();
        }
      });

    this.api
      .gettoursFood(0, 0, '', 'asc', ' AND TOUR_ID =' + this.tourpartbdata.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          for (let i = 0; i < data['data'].length; i++) {
            this.foodAdmissibleAmount +=
              data['data'][i]['FOOD_ADMISIBLE_AMOUNT'];
          }
          this.api
            .getjourneyofparticulartours(
              0,
              0,
              '',
              'asc',
              ' AND TOUR_ID =' + this.tourpartbdata.ID
            )
            .subscribe((data) => {
              if (data['code'] == 200) {
                for (let i = 0; i < data['data'].length; i++) {
                  this.accommodationAdmissibleAmount +=
                    data['data'][i]['FARE_OF_ENTITLED_CLASS'];
                }
                this.api
                  .gettoursparticularhotel(
                    0,
                    0,
                    '',
                    'asc',
                    ' AND TOUR_ID =' + this.tourpartbdata.ID
                  )
                  .subscribe((data) => {
                    if (data['code'] == 200) {
                      for (let i = 0; i < data['data'].length; i++) {
                        this.hotelAdmissibleAmount +=
                          data['data'][i]['TOTAL_AMOUNT_PAID'];
                      }
                      this.api
                        .getjourneyofparticularcity(
                          0,
                          0,
                          '',
                          'asc',
                          ' AND TOUR_ID =' + this.tourpartbdata.ID
                        )
                        .subscribe((data) => {
                          if (data['code'] == 200) {
                            for (let i = 0; i < data['data'].length; i++) {
                              this.intercityAdmissibleAmount +=
                                data['data'][i]['FARE_PAID'];
                            }

                            ////Actual Expenses/////
                            this.actualExpences =
                              this.foodAdmissibleAmount +
                              this.accommodationAdmissibleAmount +
                              this.hotelAdmissibleAmount +
                              this.intercityAdmissibleAmount;
                            this.actualExpences = Math.round(
                              this.actualExpences
                            );
                            ////Actual Expenses/////
                            ///////Total /////////
                            this.totalamountofpartb =
                              this.journeytotalamounttourpartb +
                              this.foodAdmissibleAmount +
                              this.accommodationAdmissibleAmount +
                              this.hotelAdmissibleAmount +
                              this.intercityAdmissibleAmount -
                              //  +this.totalamountofhotel
                              this.advanceamountoftourpartb;
                            this.totalamountofpartb = Math.round(
                              this.totalamountofpartb
                            );
                            ///////Total /////////

                            //////Gross Amount /////
                            this.grossAmount =
                              this.journeytotalamounttourpartb +
                              this.actualExpences;
                            this.grossAmount = Math.round(this.grossAmount);
                            //////Gross Amount /////
                            this.netPayAmount = 0;
                            if (this.tourpartbdata.IS_ADVANCE_TAKEN == 1) {
                              this.netPayAmount =
                                this.totalamountofpartb -
                                this.tourpartbdata.AMOUNT_OF_T_A;
                              this.netPayAmount = Math.round(this.netPayAmount);
                            } else {
                              this.netPayAmount = 0;
                            }
                            this.loadingRecords = false;
                            this.tourNewpartbvisible = true;
                          }
                        });
                    } else {
                      this.message.error('Failed To Load Hotel Data', '');
                    }
                  });
              } else {
                this.message.error('Failed To Load Data', '');
              }
            });
        } else {
          this.message.error('Failed To Load Food Data', '');
        }
      });

    // this.totalamountofpartb =
    //   this.journeytotalamounttourpartb + this.totalamountofhotel - this.advanceamountoftourpartb;
    //
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
  tourNewpartb() {
    this.tourNewpartbvisible = false;
    this.search();
  }
  get closeCallbacktourNewpartb() {
    return this.tourNewpartb.bind(this);
  }

  billsection: boolean = false;
  billDrawerData: any = [];
  tousanctionorder: any = [];
  billDrawerTitle: string = '';
  billsectiondata: any = [];
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
  selfdeclarationdata = [];
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

        (err) => {}
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

  airtotal = 0;
  Railtotal = 0;
  Roadtotal = 0;
  ShipBoattotal = 0;
  alltotal = 0;

  advanceamountta: any;
  accototal = 0;
  fooddata: any;
  foodtotal = 0;
  acctotal1 = 0;
  airtotal1 = 0;
  Railtotal1 = 0;
  ShipBoattotal1 = 0;
  Roadtotal1 = 0;
  foodtotal1 = 0;
  nettotalamountplaceorder = 0;
  intercityClaimedAmount = 0;
  accommodationClaimedAmount = 0;
  totalOfClaimedAmount = 0;
  totalOfAdmissibleAmount = 0;
  placeordervisible(data: any) {
    this.drawerTitle9 = 'Place Order';
    this.loadingRecords = true;
    this.airtotal = 0;
    this.Railtotal = 0;
    this.Roadtotal = 0;
    this.accototal = 0;
    this.ShipBoattotal = 0;
    this.foodtotal = 0;
    this.acctotal1 = 0;
    this.advanceamountta = 0;
    this.alltotal = 0;
    this.airtotal1 = 0;
    this.Railtotal1 = 0;
    this.ShipBoattotal1 = 0;
    this.Roadtotal1 = 0;
    this.foodtotal1 = 0;
    this.foodAdmissibleAmount = 0;
    this.accommodationAdmissibleAmount = 0;
    this.hotelAdmissibleAmount = 0;
    this.intercityAdmissibleAmount = 0;
    this.intercityClaimedAmount = 0;
    this.accommodationClaimedAmount = 0;
    this.totalOfClaimedAmount = 0;
    this.totalOfAdmissibleAmount = 0;
    this.drawerTitle11 = 'Place Order';
    this.placeorderdata = Object.assign({}, data);

    if (this.placeorderdata.ID !== undefined && this.placeorderdata !== null) {
      this.api
        .GettourSignature(
          0,
          0,
          '',
          'asc',
          ' AND TOUR_ID =' + this.placeorderdata.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.PlaceOrderMapCheckList = data['data'][0];
            } else {
            }
          } else {
            this.PlaceOrderMapCheckList = new TourSignatureMapData();
          }
        });
    }

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
                this.airtotal1 +=
                  this.detailsandpurpose[i]['CLAIMED_FARE_PAID'];
              }
            }
            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 3)
                this.Roadtotal += this.detailsandpurpose[i]['FARE_PAID'];
              this.Roadtotal1 += this.detailsandpurpose[i]['CLAIMED_FARE_PAID'];
            }

            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 6)
                this.ShipBoattotal += this.detailsandpurpose[i]['FARE_PAID'];
              this.ShipBoattotal1 +=
                this.detailsandpurpose[i]['CLAIMED_FARE_PAID'];
            }
            for (let i = 0; i < this.detailsandpurpose.length; i++) {
              if (this.detailsandpurpose[i]['TRAVEL_MODE_ID'] == 4)
                this.Railtotal += this.detailsandpurpose[i]['FARE_PAID'];
              this.Railtotal1 += this.detailsandpurpose[i]['CLAIMED_FARE_PAID'];
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
                      this.acctotal1 +=
                        this.particularofhotelsdata[i][
                          'PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT'
                        ];
                    }
                    this.hotelAdmissibleAmount = this.accototal;
                  }

                  this.api
                    .gettoursFood(
                      0,
                      0,
                      '',
                      'asc',
                      ' AND TOUR_ID =' + this.placeorderdata.ID
                    )
                    .subscribe((data) => {
                      if (data['code'] == 200) {
                        this.fooddata = data['data'];

                        for (let i = 0; i < this.fooddata.length; i++) {
                          this.foodtotal +=
                            this.fooddata[i]['FOOD_ADMISIBLE_AMOUNT'];
                          this.foodtotal1 += this.fooddata[i]['EXPENSE_AMOUNT'];
                        }
                        this.foodAdmissibleAmount = this.foodtotal;
                        if (this.airtotal == 0) {
                          this.airtotal1 = 0;
                        }
                        if (this.Roadtotal == 0) {
                          this.Roadtotal1 = 0;
                        }
                        if (this.ShipBoattotal == 0) {
                          this.ShipBoattotal1 = 0;
                        }
                        if (this.Railtotal == 0) {
                          this.Railtotal1 = 0;
                        }
                        if (this.accototal == 0) {
                          this.acctotal1 = 0;
                        }
                        if (this.foodtotal == 0) {
                          this.placeorderdata.FOOD_ADMISIBLE_AMOUNT = 0;
                        }

                        if (
                          this.advanceamountta == undefined ||
                          this.advanceamountta == null ||
                          this.advanceamountta == '' ||
                          this.advanceamountta == "'NaN'"
                        ) {
                          this.advanceamountta = 0;
                        }

                        this.api
                          .getdeatilssofpurpose(
                            0,
                            0,
                            '',
                            '',
                            ' AND TOUR_ID = ' + this.placeorderdata.ID
                          )
                          .subscribe(
                            (data) => {
                              if (data['code'] == 200) {
                                this.placeorderjourneydata = data['data'];

                                this.api
                                  .getjourneyofparticulartours(
                                    0,
                                    0,
                                    '',
                                    '',
                                    ' AND TOUR_ID = ' + this.placeorderdata.ID
                                  )
                                  .subscribe(
                                    (data) => {
                                      if (data['code'] == 200) {
                                        // this.placeorderjourneydata = data['data'];
                                        for (
                                          let i = 0;
                                          i < data['data'].length;
                                          i++
                                        ) {
                                          this.accommodationAdmissibleAmount +=
                                            data['data'][i][
                                              'FARE_OF_ENTITLED_CLASS'
                                            ];
                                        }
                                        for (
                                          let i = 0;
                                          i < data['data'].length;
                                          i++
                                        ) {
                                          this.accommodationClaimedAmount +=
                                            data['data'][i][
                                              'FARE_PAID_BY_OFFICER'
                                            ];
                                        }
                                        this.api
                                          .getjourneyofparticularcity(
                                            0,
                                            0,
                                            '',
                                            '',
                                            ' AND TOUR_ID = ' +
                                              this.placeorderdata.ID
                                          )
                                          .subscribe(
                                            (data) => {
                                              if (data['code'] == 200) {
                                                // this.placeorderjourneydata = data['data'];
                                                for (
                                                  let i = 0;
                                                  i < data['data'].length;
                                                  i++
                                                ) {
                                                  this.intercityAdmissibleAmount +=
                                                    data['data'][i][
                                                      'FARE_PAID'
                                                    ];
                                                }
                                                for (
                                                  let i = 0;
                                                  i < data['data'].length;
                                                  i++
                                                ) {
                                                  this.intercityClaimedAmount +=
                                                    data['data'][i][
                                                      'FARE_PAID_BY_OFFICER'
                                                    ];
                                                }

                                                this.placeorderdata.PLACE_ORDER_GROSS_AMOUNT =
                                                  this.airtotal1 +
                                                  this.Roadtotal1 +
                                                  this.ShipBoattotal1 +
                                                  this.Railtotal1 +
                                                  this.acctotal1 +
                                                  this.foodtotal1 +
                                                  this.hotelAdmissibleAmount +
                                                  this.intercityClaimedAmount;

                                                this.alltotal =
                                                  this.airtotal +
                                                  this.Roadtotal +
                                                  this.ShipBoattotal +
                                                  this.Railtotal +
                                                  this.foodtotal +
                                                  this.accototal +
                                                  this.hotelAdmissibleAmount +
                                                  this
                                                    .intercityAdmissibleAmount;
                                                this.alltotal = Math.round(
                                                  this.alltotal
                                                );

                                                this.totalOfAdmissibleAmount =
                                                  this.airtotal +
                                                  this.ShipBoattotal +
                                                  this.Roadtotal +
                                                  this.Railtotal +
                                                  this
                                                    .accommodationAdmissibleAmount +
                                                  this.foodtotal +
                                                  this.hotelAdmissibleAmount +
                                                  this
                                                    .intercityAdmissibleAmount;
                                                this.totalOfAdmissibleAmount =
                                                  Math.round(
                                                    this.totalOfAdmissibleAmount
                                                  );

                                                this.totalOfClaimedAmount =
                                                  this.airtotal1 +
                                                  this.ShipBoattotal1 +
                                                  this.Roadtotal1 +
                                                  this.Railtotal1 +
                                                  this
                                                    .accommodationClaimedAmount +
                                                  this.foodtotal1 +
                                                  this.acctotal1 +
                                                  this.intercityClaimedAmount;

                                                this.totalOfClaimedAmount =
                                                  Math.round(
                                                    this.totalOfClaimedAmount
                                                  );

                                                this.nettotalamountplaceorder =
                                                  this.totalOfAdmissibleAmount -
                                                  this.advanceamountta;
                                                this.nettotalamountplaceorder =
                                                  Math.round(
                                                    this
                                                      .nettotalamountplaceorder
                                                  );
                                                // this.nettotalamountplaceorder =
                                                //   this.alltotal -
                                                //   this.advanceamountta;

                                                this.placeorderdata.PLACE_ORDER_NET_AMOUNT =
                                                  this.placeorderdata
                                                    .PLACE_ORDER_GROSS_AMOUNT -
                                                  this.advanceamountta;

                                                this.loadingRecords = false;
                                                this.placealongorder = true;
                                              } else {
                                                this.message.error(
                                                  'Something Went Wrong',
                                                  ''
                                                );
                                                this.loadingRecords = false;
                                              }
                                            },
                                            (err) => {}
                                          );
                                      } else {
                                        this.message.error(
                                          'Something Went Wrong',
                                          ''
                                        );
                                        this.loadingRecords = false;
                                      }
                                    },
                                    (err) => {}
                                  );
                              } else {
                                this.message.error('Something Went Wrong', '');
                                this.loadingRecords = false;
                              }
                            },
                            (err) => {}
                          );
                      }
                    });
                }
              });
          } else {
            this.message.error('Something Went Wrong', '');
            this.loadingRecords = false;
          }
        },
        (err) => {}
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
  partadata = [];
  particularofcity = [];
  tourprtaorder: boolean = false;
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
          (err) => {}
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

    if (this.checklist.ID !== undefined && this.checklist.ID !== null) {
      this.api
        .GettourSignature(0, 0, '', 'asc', ' AND TOUR_ID =' + this.checklist.ID)
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.SignatureMapCheckList = data['data'][0];
            } else {
            }
          } else {
            this.SignatureMapCheckList = new TourSignatureMapData();
          }
        });
    }

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
  }

  checklistorderclose() {
    this.search();
    this.checklistorder = false;
  }
  get closebackchecklist() {
    return this.checklistorderclose.bind(this);
  }

  deleteCancel() {}
  deleteConfirm(data: any) {
    this.loadingRecords = true;
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
  Hospitalclaim = [];
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

        (err) => {}
      );
    this.detailsjourneyofpurpose = new Deatailsandpurposeoftours();
    this.drawerData = Object.assign({}, data);
    if (
      this.drawerData.DDO_OF_THE_OFFICIAL_ID == null ||
      this.drawerData.DDO_OF_THE_OFFICIAL_ID == undefined ||
      this.drawerData.DDO_OF_THE_OFFICIAL_ID == '' ||
      this.drawerData.DDO_OF_THE_OFFICIAL_ID == 0
    ) {
      this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
        sessionStorage.getItem('ddoId')
      );
    } else {
      this.drawerData.DDO_OF_THE_OFFICIAL_ID =
        this.drawerData.DDO_OF_THE_OFFICIAL_ID;
    }
    this.drawerData.IS_ADVANCE_TAKEN = this.drawerData.IS_ADVANCE_TAKEN;

    this.empID = data.EMP_ID;
    this.tourID = data.ID;
    this.isCreate = false;
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
    this.loadingRecords = true;
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
    if (this.isAdmin) {
      this.extraFilterQuery = ' AND IS_APPLYING_FOR_ADVANCE =1';
    } else {
      if (this.parentUserId == 0) {
        var tempFilter = '';
        tempFilter =
          ' AND (INSPECTOR_ID =' +
          Number(sessionStorage.getItem('userId')) +
          ' OR SUB_INSPECTOR_ID = ' +
          Number(sessionStorage.getItem('userId')) +
          ')';
      } else {
        tempFilter =
          ' AND INSPECTOR_ID =' +
          Number(sessionStorage.getItem('userId')) +
          ' AND SUB_INSPECTOR_ID = ' +
          this.parentUserId;
      }

      this.extraFilterQuery =
        " AND TOUR_STATUS <>'P' AND IS_APPLYING_FOR_ADVANCE =1 " + tempFilter;
    }
    this.api
      .gettouralldata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.extraFilterQuery + likeQuery + this.filterQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.loadingRecords = false;
          } else {
            this.message.error("Can't Load Tour Data", '');
          }
        },
        (err) => {}
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

  AnyWindow(data) {
    window.open(this.api.retriveimgUrl + 'tourPartA/' + data.TOUR_PART_A);
  }

  // getroledata(){
  //   if(this.roleid!=undefined && this.roleid!=47 && this.roleid!=46){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }
  isFilterApplied: any = 'default';
  INSPECTOR_ID: any = '';
  filterClass: string = 'filter-invisible';
  filterQuery: any = '';
  applyFilter() {
    if (
      this.INSPECTOR_ID != null &&
      this.INSPECTOR_ID != undefined &&
      this.INSPECTOR_ID != ''
    ) {
      this.filterClass = 'filter-invisible';
      this.isFilterApplied = 'primary';
      this.loadingRecords = false;
      var sort: string;

      try {
        sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }
      this.filterQuery = ' AND INSPECTOR_ID = ' + this.INSPECTOR_ID;
      this.search();
    } else {
      this.message.error('Please Select Inspector Name', '');
    }
  }

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.INSPECTOR_ID = null;
    this.dataList = [];
    this.search();
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  // AND ROLE_IDS = 43
  users: any = [];
  loadAllUsers() {
    this.api
      .getAllUsers(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_ACTIVE = 1  AND ROLE_IDS in (21,43)'
      )
      .subscribe(
        (userData) => {
          if (userData['code'] == 200) {
            this.users = userData['data'];
          } else {
            this.message.error("Can't Load User Information", '');
          }
        },
        (err) => {}
      );
  }

  TOURdata: any;
  drawerVisibleAdvance = false;
  drawerTitleAdvance = 'Advance Bill';
  advancedata: any;
  open(data: any): void {
    this.advancedata = data;

    // this.AdvanceBillView;
    if (data.ID !== null && data.ID !== undefined) {
      this.api
        .GettourSignature(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.AdvanceBillView = data['data'][0];
            } else {
            }
            this.drawerVisibleAdvance = true;
          } else {
            this.AdvanceBillView = new TourSignatureMapData();
          }
        });
    }
  }

  close(): void {
    this.drawerVisibleAdvance = false;
    this.search();
  }

  drawerVisibleapproval = false;
  drawerTitleapproval = 'मंजुरी आदेश ';
  openapproval(data: any): void {
    this.TOURdata = data;

    if (data.ID !== null && data.ID !== undefined) {
      this.api
        .GettourSignature(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.ManjuriAdeshView = data['data'][0];
            } else {
            }
            this.drawerVisibleapproval = true;
          } else {
            this.AdvanceBillView = new TourSignatureMapData();
          }
        });
    }
  }

  closeapproval(): void {
    this.drawerVisibleapproval = false;
    this.search();
  }

  applicationdrawerdata: any;
  drawerVisibleapplication = false;
  drawerTitleapplication = 'Application Form';
  openapplication(data: any): void {
    this.applicationdrawerdata = data;
    this.drawerVisibleapplication = true;
  }

  closeapplication(): void {
    this.drawerVisibleapplication = false;
    this.search();
  }

  drawerVisibleShort = false;
  drawerTitleShort = 'Short Bill';
  openShort(data: any): void {
    this.TOURdata = data;

    this.api
      .GettourSignature(0, 0, '', 'asc', ' AND TOUR_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] === 200) {
          if (data['data'] && data['data'].length > 0) {
            this.AdvanceShortBillView = data['data'][0];
          } else {
          }
          this.drawerVisibleShort = true;
        } else {
          this.AdvanceShortBillView = new TourSignatureMapData();
        }
      });
  }

  closeShort(): void {
    this.drawerVisibleShort = false;
    this.search();
  }

  get drawerVisibleapprovalnn() {
    return this.closeapproval.bind(this);
  }
  get drawerVisibleAdvanceclose() {
    return this.close.bind(this);
  }
  get closeapplicationnn() {
    return this.closeapplication.bind(this);
  }
  get drawerVisibleShortnnn() {
    return this.closeShort.bind(this);
  }
}
