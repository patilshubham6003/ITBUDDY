import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToWords } from 'to-words';
import * as html2pdf from 'html2pdf.js';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { TranferapplicationMaster } from 'src/app/Medical/Models/transferapplication';
import { TransferMapData } from 'src/app/Medical/Models/TransFerSignatureClass';

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'Rupees',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});
const toWordsen = new ToWords({
  localeCode: 'hi-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    // currencyOptions: {
    //   // can be used to override defaults for the selected locale
    //   name: 'Rupee',
    //   plural: 'रुपये',
    //   symbol: '₹',
    //   fractionalUnit: {
    //     name: 'Paisa',
    //     plural: 'Paise',
    //     symbol: '',
    //   },
    // },
  },
});

@Component({
  selector: 'app-transferlist',
  templateUrl: './transferlist.component.html',
  styleUrls: ['./transferlist.component.css'],
})
export class TransferlistComponent implements OnInit {
  drawerData2: any[] = [];
  drawerVisible: boolean = false;
  drawerTitle: string = '';
  filterClass: string = 'filter-invisible';

  drawerData: TranferapplicationMaster = new TranferapplicationMaster();
  // data: ClaimMaster = new ClaimMaster();
  userId: any;
  parentUserId: any;
  // userId = Number(sessionStorage.getItem('userId'));
  userName = Number(sessionStorage.getItem('userId'));
  roleId = Number(sessionStorage.getItem('roleId'));
  pageSize2 = 10;
  formTitle = 'Manage Transfer';
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList: any = [];
  loadingRecords = false;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  size = 'small';
  isFilterApplied: any = 'default';
  claimData: any;
  INSPECTOR_ID: any;
  columns: string[][] = [
    ['NAME', 'NAME'],
    ['MOBILE_NO', 'MOBILE_NO'],
    ['EMPLOYEE_CODE', 'EMPLOYEE_CODE'],
    ['DESIGNATION', 'DESIGNATION'],
    ['DDO_OF_THE_OFFICIAL', 'DDO_OF_THE_OFFICIAL'],
    ['OFFICE_NAME', 'OFFICE_NAME'],
    ['ADDRESS', 'ADDRESS'],
    ['NEW_HEADQUARTERS_NAME', 'NEW_HEADQUARTERS_NAME'],
    ['NEW_ADDRESS', 'NEW_ADDRESS'],
    ['INSPECTOR_NAME', 'INSPECTOR_NAME'],
  ];

  isSpinning = false;

  clearFilter() {
    this.filterClass = 'filter-invisible';
    this.isFilterApplied = 'default';
    this.filterQuery = '';
    this.INSPECTOR_ID = null;
    this.dataList = [];
    this.search();
  }
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isAdmin: boolean = false;
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.parentUserId = Number(sessionStorage.getItem('parentUserID'));
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
  }

  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize2 != pageSize) {
      this.pageIndex = 1;
      this.pageSize2 = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }
    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.search();
  }

  userIdFilter;
  search(reset: boolean = false) {
    this.isSpinning = true;
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';

    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }
    if (!this.isAdmin) {
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
      this.userIdFilter =
        " AND TRANSFER_STATUS != 'P' AND IS_APPLYING_FOR_ADVANCE = 0 " +
        tempFilter;
    } else {
      this.userIdFilter = ' AND IS_APPLYING_FOR_ADVANCE = 0';
    }
    this.loadingRecords = true;

    this.api
      .gettransferdata(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        this.userIdFilter + this.filterQuery + likeQuery
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          } else {
            this.loadingRecords = false;
            this.dataList = [];
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
            // this.message.error("Can't Load Data", '');
          }
        },
        (err) => {}
      );
  }

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

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  drawerClose(): void {
    this.currentStage = 0;
    this.isCreate = false;
    this.drawerVisible = false;
    this.search();
  }

  get closeCallback() {
    this.currentStage = 0;
    return this.drawerClose.bind(this);
  }
  currentStage = 0;
  isSpin: boolean = false;
  isCreate: boolean = false;
  add(): void {
    this.drawerTitle = 'Create New Claim';
    this.drawerData = new TranferapplicationMaster();
    // this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
    //   sessionStorage.getItem('ddoId')
    // );
    this.drawerData.IS_APPLYING_FOR_ADVANCE = false;
    this.currentStage = 0;
    this.isSpin = false;
    this.relationdata = [];
    this.claimID = '';
    this.empID = '';
    this.isCreate = true;
    this.drawerVisible = true;
  }

  empID;
  claimID;
  claimid: any;
  relationdata: any = [];
  relationdataorder: any = [];

  edit(data: any): void {
    this.claimid = data.ID;
    this.empID = data.EMP_ID;
    this.claimID = data.ID;
    this.loadingRecords = true;
    this.drawerData = Object.assign({}, data);
    this.isCreate = false;
    // if (
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == null ||
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == undefined ||
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == '' ||
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID == 0
    // ) {
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID = Number(
    //     sessionStorage.getItem('ddoId')
    //   );
    // } else {
    //   this.drawerData.DDO_OF_THE_OFFICIAL_ID =
    //     this.drawerData.DDO_OF_THE_OFFICIAL_ID;
    // }
    this.drawerTitle = 'Edit Transfer Details';
    this.api
      .getrelationtable(0, 0, '', ' ', ' AND TRANSFER_ID =' + data.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdata = data['data'];
            } else {
              this.relationdata = [];
            }
            this.loadingRecords = false;
            this.drawerVisible = true;
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  orderdata: any;
  amountinwords: any;
  amountinwordsh: any;

  cancel(): void {}

  deleteConfirm(data: any) {
    this.loadingRecords = true;
    data.IS_DELETED = 1;
    this.api.updatetransfer(data).subscribe((successCode) => {
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
  deleteCancel(): void {}

  drawerClaimData: any;
  drawerClaimTitle = '';
  drawerClaimVisible = false;
  partborder = false;
  transferallounce = false;
  certificateorder = false;
  transferallounceorder: any = [];
  tranvellingallounceorder = [];
  journeydetails: any[] = [];
  railorder: any = [];
  tranferchnagesorder: any = [];
  tranferchnagesorder1: any = [];
  accommodation: any = [];
  amountInwords: any = '';
  transferAllounceDrawerTitle: string = '';
  travellingData: any;
  travellingallounce(data) {
    this.transferAllounceDrawerTitle = 'Transfer Allowance';
    this.travellingData = '';
    this.travellingData = data;
    this.loadingRecords = true;
    this.api
      .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.travellingData.ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.transferallounceorder = data['data'][0];
            } else {
              this.transferallounceorder = [];
            }

            this.api
              .getrelationtable(
                0,
                0,
                '',
                ' ',
                ' AND TRANSFER_ID =' + this.travellingData.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.relationdataorder = data['data'];
                    } else {
                      this.relationdataorder = [];
                    }
                    this.api
                      .getjourneydetails(
                        0,
                        0,
                        '',
                        'asc',
                        ' AND TRANSFER_ID =' + this.travellingData.ID
                      )
                      .subscribe((data) => {
                        if (data['code'] == 200) {
                          if (data['data'].length > 0) {
                            this.journeydetails = data['data'];
                          } else {
                            this.journeydetails = [];
                          }

                          this.api
                            .gettransfarchnagedetailspersonal(
                              0,
                              0,
                              '',
                              'asc',
                              ' AND TRANSFER_ID =' + this.travellingData.ID
                            )
                            .subscribe((data) => {
                              if (data['code'] == 200) {
                                if (data['data'].length > 0) {
                                  this.tranferchnagesorder = data['data'];
                                } else {
                                  this.tranferchnagesorder = [];
                                }

                                this.api
                                  .gettransfarchnagedetails1(
                                    0,
                                    0,
                                    '',
                                    'asc',
                                    ' AND TRANSFER_ID =' +
                                      this.travellingData.ID
                                  )
                                  .subscribe((data) => {
                                    if (data['code'] == 200) {
                                      if (data['data'].length > 0) {
                                        this.railorder = data['data'];
                                      } else {
                                        this.railorder = [];
                                      }

                                      this.api
                                        .gettransfortation(
                                          0,
                                          0,
                                          '',
                                          'asc',
                                          ' AND TRANSFER_ID =' +
                                            this.travellingData.ID
                                        )
                                        .subscribe((data) => {
                                          if (data['code'] == 200) {
                                            if (data['data'].length > 0) {
                                              this.accommodation = data['data'];
                                            } else {
                                              this.accommodation = [];
                                            }
                                            this.loadingRecords = false;
                                            this.transferallounce = true;
                                          } else {
                                            this.loadingRecords = false;
                                            this.accommodation = [];
                                            this.message.error(
                                              "Can't Load Details of journey(s)",
                                              ''
                                            );
                                          }
                                        });
                                    } else {
                                      this.loadingRecords = false;
                                      this.railorder = [];
                                      this.message.error(
                                        "Can't Load Details of journey(s)",
                                        ''
                                      );
                                    }
                                  });
                              } else {
                                this.loadingRecords = false;
                                this.tranferchnagesorder = [];
                                this.message.error(
                                  "Can't Load Transportation charges of personal effects",
                                  ''
                                );
                              }
                            });
                        } else {
                          this.journeydetails = [];
                          this.loadingRecords = false;
                          this.message.error("Can't Load Journey Details", '');
                        }
                      });
                  } else {
                    this.loadingRecords = false;
                    this.relationdataorder = [];
                    this.message.error("Can't Load Relation Data", '');
                  }
                },
                (err) => {}
              );
          } else {
            this.transferallounceorder = [];
            this.loadingRecords = false;
            this.message.error("Can't Load Transfer Data", '');
          }
        },

        (err) => {}
      );
  }

  amount: any = 0;
  journeyfairfaird: any = 0;
  raiamount: any = 0;
  istransport: any = 0;
  totacountofbill: any = 0;
  billDataID: any;
  netAmountInWord: any;
  orderFormTitle: string = '';
  TravelModeNames: any = [];
  nettotacountofbill = 0;
  transferJourneyClaimedAmount = 0;
  inspectorDestination: any;
  personalEffectsAddmissible: any;
  personalEffectsClaimed: any;

  certificateDrawerTitle: string = '';
  certificate(data) {
    this.loadingRecords = true;
    this.certificateDrawerTitle = 'Certificate';
    this.api.gettransferdata(0, 0, '', ' ', ' AND ID =' + data.ID).subscribe(
      (data) => {
        if (data['code'] == 200) {
          if (data['data'].length > 0) {
            this.transferallounceorder = data['data'][0];
          } else {
            this.transferallounceorder = [];
          }
          this.loadingRecords = false;
          this.certificateorder = true;
        } else {
          this.transferallounceorder = [];
          this.loadingRecords = false;
        }
      },
      (err) => {}
    );
  }
  partbdata: any;
  journeyDetailsData: any;
  multiplication: any;
  incidentalsAmonut: any;
  partDrawerTitle: string = '';
  grosspaymentofpartb: any;
  netpaymentofpartb: any;
  amountofadvance = 0;
  transfergrantamount = 0;
  amountofadvanceamount = 0;
  fairpaidofpartb = 0;
  totalofweight: any = 0;
  weightkg = 0;
  weightrate = 0;
  amountt: any = 0;
  distance: any = 0;
  grosspaymentvalue: any;
  privateVehicleFair: any = [];
  privateVehicleMinFair = 0;
  showPrivate: any = 0;

  fileName: string = 'Claim';
  pdfDownload: boolean = false;

  public generatePDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('claimFile');

    html2pdf()
      .from(data)
      .set({
        margin: [5, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.pdfDownload = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.pdfDownload = false;
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');
  }

  users: any = [];
  loadAllUsers() {
    this.api
      .getAllUsers(
        0,
        0,
        'ID',
        'desc',
        ' AND IS_ACTIVE = 1 AND ROLE_IDS in (20,44)'
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

  orderPDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('printOrderModal');

    html2pdf()
      .from(data)
      .set({
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        margin: [2, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.pdfDownload = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.pdfDownload = false;
      })
      .save('Sanction Order_' + datef + '_' + dates + '.pdf');
  }

  drawerClose1() {
    this.totacountofbill = 0;
    this.drawerClaimVisible = false;
    this.search();
  }
  get closeCallbackClaim() {
    return this.drawerClose1.bind(this);
  }

  partbdrawerclose() {
    this.partborder = false;
    this.search();
  }
  get closeCallbackpartb() {
    return this.partbdrawerclose.bind(this);
  }

  transferallowuncedrawerclose() {
    this.transferallounce = false;
    this.search();
  }
  get closeCallbacktransferallowunce() {
    return this.transferallowuncedrawerclose.bind(this);
  }

  certificatedrawerclose() {
    this.certificateorder = false;
    this.search();
  }
  get closeCallbackcertificate() {
    return this.certificatedrawerclose.bind(this);
  }
  checklistData: any = [];
  transferData: any = [];
  checklistVisible: boolean = false;
  checklistTitle: string = '';
  POST: any;
  OFFICE_NAME: any;
  SIGNNAME: any;

  checkListdrawerclose() {
    this.checklistVisible = false;
    this.search();
  }
  get closeCallbackchecklist() {
    return this.checkListdrawerclose.bind(this);
  }
  AnyWindow(data) {
    window.open(
      this.api.retriveimgUrl + 'transferPartA/' + data.TRANSFER_PART_A
    );
  }
  isVisible: boolean = false;
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // Drawer Titles
  applicationforgranttitle = 'Application For Grant For T.A';
  gotatradvancetitle = 'GO TATR Advance';
  tartdocumentdrawertitle = 'TATR Document';
  manjuriAdheshDrawerTitle = 'मंजुरी आदेश';

  //Drawer Visibility Booleans
  applicationforgrantvisible: boolean = false;
  gotatradvancevisible: boolean = false;
  tartdocumentdrawervisible: boolean = false;
  manjuriAdheshDrawerVisible: boolean = false;

  //Drawercloses
  approvaldrawerClose(): void {
    this.manjuriAdheshDrawerVisible = false;
  }

  tartdocumentdrawerClose(): void {
    this.tartdocumentdrawervisible = false;
  }

  closeApplicationdrawer(): void {
    this.applicationforgrantvisible = false;
  }

  gotatradvanceDrawerClose(): void {
    this.gotatradvancevisible = false;
  }
  totalprivate90: any = 0;
  totalpersonal90: any = 0;
  gotatradvanceDraweropen(data: any): void {
    this.alldocdata = data;
    this.totalprivate90 = 0;
    this.totalpersonal90 = 0;
    this.loadingRecords = true;
    this.isSpinning = true;
    this.api
      .getrelationtable(
        0,
        0,
        '',
        ' ',
        ' AND TRANSFER_ID =' + this.alldocdata.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdataorder = data['data'];

              var Allowancetotal =
                (this.alldocdata.TRA_ALLO_FARE_RS *
                  this.relationdataorder.length *
                  90) /
                100;

              this.alldocdata.TRAVELLING_ALLOW_TOTAL = Number(Allowancetotal);
              this.alldocdata.TRAVAL_DA_TOTAL =
                Number(this.alldocdata.TRAVEL_DA_DAYS) *
                Number(this.alldocdata.TRAVEL_RS_PERDAY);
              this.alldocdata.TRANSFER_GRANT_BASIC_PAY_TOTAL =
                (Number(this.alldocdata.GRADE_PAY) * 80) / 100;
              this.alldocdata.TOTAL_ENT_AMOUNT =
                Number(this.alldocdata.TRAVELLING_ALLOW_TOTAL) +
                Number(this.alldocdata.TRAVAL_DA_TOTAL) +
                Number(this.alldocdata.TRANSFER_GRANT_BASIC_PAY_TOTAL) +
                Number(this.alldocdata.CHARGES_FOR_PRIVATE_CON_AMOUNT) +
                Number(this.alldocdata.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT);
            } else {
              this.relationdataorder = [];
            }

            this.totalprivate90 =
              (Number(this.alldocdata.CHARGES_FOR_PRIVATE_CON_AMOUNT) * 90) /
              100;
            this.totalpersonal90 =
              (Number(this.alldocdata.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT) *
                90) /
              100;

            var finalAdvanceAmount: any = 0;
            finalAdvanceAmount =
              Number(this.alldocdata.TRANSFER_GRANT_BASIC_PAY_TOTAL) +
              Number(this.alldocdata.TRAVELLING_ALLOW_TOTAL) +
              Number(this.totalprivate90) +
              Number(this.totalpersonal90);
            this.alldocdata.FINAL_ADVANCE_AMOUNT = Math.round(
              Number(finalAdvanceAmount)
            );
            this.alldocdata.ADVANCED_AMOUNT = Math.round(
              Number(finalAdvanceAmount)
            );

            this.api
              .updatetransfer(this.alldocdata)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.api
                    .gettransferdata(
                      0,
                      0,
                      '',
                      ' ',
                      ' AND ID =' + this.alldocdata.ID
                    )
                    .subscribe(
                      (data) => {
                        if (data['code'] == 200) {
                          this.alldocdata = [];
                          if (data['data'].length > 0) {
                            this.alldocdata = data['data'][0];
                          } else {
                            this.alldocdata = [];
                          }
                          this.gotatradvancevisible = true;
                          this.loadingRecords = false;
                          this.isSpinning = false;
                        } else {
                          this.alldocdata = [];
                          this.loadingRecords = false;
                          this.isSpinning = false;
                        }
                      },
                      (err) => {}
                    );
                } else {
                  this.message.error('Information Has Not Saved...', '');
                  this.isSpinning = false;
                  this.loadingRecords = false;
                }
              });
          } else {
            this.loadingRecords = false;
            this.relationdataorder = [];
            this.message.error("Can't Load Relation Data", '');
          }
        },
        (err) => {}
      );
  }
  approvaldraweropen(data: any): void {
    this.alldocdata = data;
    this.manjuriAdheshDrawerVisible = true;
  }
  alldocdata: any;
  openApplicationdrawer(data: any): void {
    this.loadingRecords = true;
    this.alldocdata = data;

    this.api
      .getrelationtable(
        0,
        0,
        '',
        ' ',
        ' AND TRANSFER_ID =' + this.alldocdata.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.relationdataorder = data['data'];
              var Allowancetotal =
                (this.alldocdata.TRA_ALLO_FARE_RS *
                  this.relationdataorder.length *
                  90) /
                100;

              this.alldocdata.TRAVELLING_ALLOW_TOTAL = Number(Allowancetotal);
              this.alldocdata.TRAVAL_DA_TOTAL =
                Number(this.alldocdata.TRAVEL_DA_DAYS) *
                Number(this.alldocdata.TRAVEL_RS_PERDAY);
              this.alldocdata.TRANSFER_GRANT_BASIC_PAY_TOTAL =
                (Number(this.alldocdata.GRADE_PAY) * 80) / 100;

              this.alldocdata.TOTAL_ENT_AMOUNT =
                Number(this.alldocdata.TRAVELLING_ALLOW_TOTAL) +
                Number(this.alldocdata.TRAVAL_DA_TOTAL) +
                Number(this.alldocdata.TRANSFER_GRANT_BASIC_PAY_TOTAL) +
                Number(this.alldocdata.CHARGES_FOR_PRIVATE_CON_AMOUNT) +
                Number(this.alldocdata.CHARGES_FOR_PERSONAL_EFFECTS_AMOUNT);
            } else {
              this.relationdataorder = [];
            }
            this.applicationforgrantvisible = true;
            this.loadingRecords = false;
          } else {
            this.loadingRecords = false;
            this.relationdataorder = [];
            this.message.error("Can't Load Relation Data", '');
          }
        },
        (err) => {}
      );
  }
  tartdocumentdraweropen(data: any): void {
    this.alldocdata = data;
    this.tartdocumentdrawervisible = true;
  }

  //Call Backs
  get closeApplicationdrawercallback() {
    return this.closeApplicationdrawer.bind(this);
  }
  get gotatradvanceDrawerClosecallback() {
    return this.gotatradvanceDrawerClose.bind(this);
  }
  get tartdocumentdrawerCloseCallback() {
    return this.tartdocumentdrawerClose.bind(this);
  }
  get manjuriAdheshDrawercloseCallback() {
    return this.approvaldrawerClose.bind(this);
  }

  SignaturePartB: TransferMapData = new TransferMapData();
  CheckListSignatureMap: TransferMapData = new TransferMapData();
  SignatureOrderDataMap: TransferMapData = new TransferMapData();

  ordeRrelationdata: any = [];
  orderData(data) {
    this.billDataID = data.ID;
    this.loadingRecords = true;
    this.amount = 0;

    this.journeyfairfaird = 0;
    this.raiamount = 0;
    this.istransport = 0;

    this.weightrate = 0;
    this.grosspaymentvalue = 0;
    this.weightkg = 0;
    this.amountt = 0;
    this.distance = 0;

    this.fairpaidofpartb = 0;
    this.grosspaymentofpartb = 0;
    this.amountofadvanceamount = 0;
    this.incidentalsAmonut = 0;
    this.privateVehicleMinFair = 0;
    this.multiplication = 0;
    this.totalofweight = 0;
    this.totacountofbill = 0;
    this.nettotacountofbill = 0;
    this.transferJourneyClaimedAmount = 0;
    this.personalEffectsAddmissible = 0;
    this.personalEffectsClaimed = 0;
    this.orderFormTitle = 'Order';
    this.ordeRrelationdata = [];
    this.drawerClaimData = Object.assign({}, data);
    var relationDataArray: any = [];
    this.api
      .getrelationtable(
        0,
        0,
        '',
        ' ',
        ' AND TRANSFER_ID =' + this.drawerClaimData.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ordeRrelationdata = data['data'];
              // for (let i = 0; i < this.ordeRrelationdata.length; i++) {
              //   relationDataArray.push(this.ordeRrelationdata[i].RELATIONSHIP);
              // }
            } else {
              this.ordeRrelationdata = [];
              relationDataArray = [];
            }
            // this.loadingRecords = false;
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
    if (
      this.drawerClaimData.ID !== undefined &&
      this.drawerClaimData.ID !== null
    ) {
      this.api
        .GetTransferSignature(
          0,
          0,
          '',
          'asc',
          ' AND TRANSFER_ID =' + this.drawerClaimData.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.SignatureOrderDataMap = data['data'][0];
            } else {
            }
          } else {
            this.SignatureOrderDataMap = new TransferMapData();
          }
        });
    }

    if (
      (data.ROAD_MILEAGE != undefined && data.PER_KM != undefined) ||
      (data.ROAD_MILEAGE != null && data.PER_KM != null)
    ) {
      this.multiplication = Number(data.ROAD_MILEAGE) * Number(data.PER_KM);
    } else {
      this.multiplication = 0;
    }

    this.api
      .gettransfarchnagedetailspersonal(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + this.billDataID
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.tranferchnagesorder = data['data'];
          this.tranferchnagesorder1 = data['data'];

          if (data['data'].length > 0) {
            this.distance = data['data'][0]['DISTANCE'];
            this.weightrate = data['data'][0]['RATE'];
            this.amountt = data['data'][0]['WEIGHT_IN_KG'];
            for (let z = 0; z < this.tranferchnagesorder.length; z++) {
              this.personalEffectsAddmissible +=
                this.tranferchnagesorder[z]['AMOUNT'];
              this.personalEffectsClaimed +=
                this.tranferchnagesorder[z]['TRANSPORTATION_CLAIMED_AMOUNT'];
            }
          } else {
            this.distance = 0;
            this.weightrate = 0;
            this.amountt = 0;
            this.personalEffectsAddmissible = 0;
            this.personalEffectsClaimed = 0;
          }
          this.totalofweight =
            (this.distance * this.weightrate * this.amountt) / 6000;
          this.totalofweight = this.totalofweight.toFixed();

          if (
            this.multiplication == undefined ||
            this.multiplication == null ||
            this.multiplication == '' ||
            isNaN(this.multiplication) == true
          ) {
            this.multiplication = 0;
          } else {
            this.multiplication = this.multiplication;
          }

          if (
            this.incidentalsAmonut == undefined ||
            this.incidentalsAmonut == null ||
            this.incidentalsAmonut == '' ||
            isNaN(this.incidentalsAmonut) == true
          ) {
            this.incidentalsAmonut = 0;
          } else {
            this.incidentalsAmonut = this.incidentalsAmonut;
          }

          if (
            this.personalEffectsAddmissible == undefined ||
            this.personalEffectsAddmissible == null ||
            this.personalEffectsAddmissible == '' ||
            isNaN(this.personalEffectsAddmissible) == true
          ) {
            this.personalEffectsAddmissible = 0;
          } else {
            this.personalEffectsAddmissible = this.personalEffectsAddmissible;
          }
          if (
            this.personalEffectsClaimed == undefined ||
            this.personalEffectsClaimed == null ||
            this.personalEffectsClaimed == '' ||
            isNaN(this.personalEffectsClaimed) == true
          ) {
            this.personalEffectsClaimed = 0;
          } else {
            this.personalEffectsClaimed = this.personalEffectsClaimed;
          }

          if (this.totalofweight == undefined || this.totalofweight == null) {
            this.totalofweight = 0;
          } else {
            this.totalofweight = this.totalofweight;
          }

          if (
            this.amountofadvance == undefined ||
            this.amountofadvance == null
          ) {
            this.amountofadvance = 0;
          } else {
            this.amountofadvance = this.amountofadvance;
          }

          if (
            this.transfergrantamount == undefined ||
            this.transfergrantamount == null
          ) {
            this.transfergrantamount = 0;
          } else {
            this.transfergrantamount = this.transfergrantamount;
          }

          if (
            this.fairpaidofpartb == undefined ||
            this.fairpaidofpartb == null
          ) {
            this.fairpaidofpartb = 0;
          } else {
            this.fairpaidofpartb = this.fairpaidofpartb;
          }

          if (
            this.amountofadvanceamount == null ||
            this.amountofadvanceamount == undefined
          ) {
            this.amountofadvanceamount = 0;
          } else {
            this.amountofadvanceamount = this.amountofadvanceamount;
          }
        }
      });

    this.TravelModeNames = [];
    this.privateVehicleFair = [];
    this.TravelModeNames = [];
    this.showPrivate = 0;
    this.inspectorDestination = '';
    if (this.drawerClaimData.SIGNATURE_ID != null) {
      this.api
        .getSignature(
          0,
          0,
          '',
          '',
          ' AND ID = ' + this.drawerClaimData.SIGNATURE_ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.inspectorDestination = data['data'][0]['POST'];
              } else {
                this.inspectorDestination = '';
              }
            } else {
            }
          },
          (err) => {}
        );
    } else {
      this.inspectorDestination = '';
    }
    var journeyTravelModes: any = [];
    this.api
      .gettransferdata(0, 0, '', ' ', ' AND ID =' + this.billDataID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['code'] == 200 && data['data'].length > 0) {
              this.transferallounceorder = data['data'][0];
            }
            this.api
              .getjourneydetails(
                0,
                0,
                '',
                'asc',
                ' AND TRANSFER_ID =' + this.billDataID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.journeydetails = data['data'];

                  if (this.journeydetails.length > 0) {
                    for (let i = 0; i < this.journeydetails.length; i++) {
                      this.fairpaidofpartb +=
                        this.journeydetails[i]['FAIR_PAID'];
                    }

                    for (let i = 0; i < this.journeydetails.length; i++) {
                      this.journeyfairfaird +=
                        this.journeydetails[i]['FAIR_PAID'];
                    }
                    for (let i = 0; i < this.journeydetails.length; i++) {
                      this.transferJourneyClaimedAmount +=
                        this.journeydetails[i][
                          'TRANSFER_JOURNEY_CLAIMED_AMOUNT'
                        ];
                    }

                    for (let i = 0; i < this.journeydetails.length; i++) {
                      if (this.journeydetails[i]['TRAVEL_CLASS_ID'] == 13) {
                        this.privateVehicleFair.push(
                          this.journeydetails[i]['FAIR_PAID']
                        );
                      } else {
                      }

                      // for (let j = 0; j < this.journeydetails.length; j++) {
                      //   journeyTravelModes.push(
                      //     this.journeydetails[j]['TRAVEL_MODE_NAME']
                      //   );
                      // }
                    }
                  } else {
                    this.fairpaidofpartb = 0;
                    this.journeyfairfaird = 0;
                    this.transferJourneyClaimedAmount = 0;
                    this.privateVehicleFair = 0;
                    this.privateVehicleFair = [];
                  }

                  if (this.privateVehicleFair.length > 0) {
                    this.privateVehicleMinFair = Math.min.apply(
                      null,
                      this.privateVehicleFair
                    );
                  } else {
                    this.privateVehicleMinFair = 0;
                  }

                  if (
                    this.drawerClaimData.VEHICLE_BROUGHT_SELF_PROPULATION == 0
                  ) {
                    if (
                      this.drawerClaimData.TRUCK_SHIP_CHARGE != null &&
                      this.drawerClaimData.TRUCK_SHIP_CHARGE != undefined &&
                      this.drawerClaimData.TRUCK_SHIP_CHARGE > 0 &&
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO !=
                        null &&
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO !=
                        undefined &&
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO > 0
                    ) {
                      if (this.privateVehicleFair.length > 0) {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.TRUCK_SHIP_CHARGE,
                          this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO,
                          this.privateVehicleMinFair,
                          this.drawerClaimData.VEHICLE_CLAIMED_AMOUNT
                        );
                      } else {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.TRUCK_SHIP_CHARGE,
                          this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO,
                          this.drawerClaimData.VEHICLE_CLAIMED_AMOUNT
                        );
                      }
                    } else {
                      this.grosspaymentvalue = this.privateVehicleMinFair;
                    }
                  } else if (
                    this.drawerClaimData.VEHICLE_BROUGHT_SELF_PROPULATION == 1
                  ) {
                    if (
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL != null &&
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL != undefined &&
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL > 0 &&
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE != null &&
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE != undefined &&
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE > 0
                    ) {
                      if (this.privateVehicleFair.length > 0) {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.VEHICLE_BROUGHT_TOTAL,
                          this.drawerClaimData.TRAIN_BROUGHT_CHARGE,
                          this.privateVehicleMinFair,
                          this.drawerClaimData.VEHICLE_CLAIMED_AMOUNT
                        );
                      } else {
                        this.grosspaymentvalue = Math.min(
                          this.drawerClaimData.VEHICLE_BROUGHT_TOTAL,
                          this.drawerClaimData.TRAIN_BROUGHT_CHARGE,
                          this.drawerClaimData.VEHICLE_CLAIMED_AMOUNT
                        );
                      }
                    } else {
                      this.grosspaymentvalue = this.privateVehicleMinFair;
                    }
                  } else {
                  }

                  if (
                    this.grosspaymentvalue ==
                      this.drawerClaimData.TRUCK_SHIP_CHARGE ||
                    this.grosspaymentvalue ==
                      this.drawerClaimData.TRAIN_BROUGHT_FOR_CHARGE_NO ||
                    this.grosspaymentvalue ==
                      this.drawerClaimData.VEHICLE_BROUGHT_TOTAL ||
                    this.grosspaymentvalue ==
                      this.drawerClaimData.TRAIN_BROUGHT_CHARGE
                  ) {
                    this.showPrivate = 1;
                  } else if (
                    this.grosspaymentvalue > 0 &&
                    this.grosspaymentvalue == this.privateVehicleMinFair
                  ) {
                    this.showPrivate = 2;
                  } else {
                    this.showPrivate = 0;
                  }

                  for (let i = 0; i < this.journeydetails.length; i++) {
                    if (
                      this.TravelModeNames.includes(
                        this.journeydetails[i].TRAVEL_MODE_NAME
                      ) === false
                    )
                      this.TravelModeNames.push(
                        this.journeydetails[i].TRAVEL_MODE_NAME
                      );
                  }

                  let sum = 0;

                  this.api
                    .gettransfarchnagedetailspersonal(
                      0,
                      0,
                      '',
                      'asc',
                      ' AND TRANSFER_ID =' + this.billDataID
                    )
                    .subscribe((data) => {
                      if (data['code'] == 200) {
                        for (
                          let i = 0;
                          i < this.tranferchnagesorder.length;
                          i++
                        ) {
                          this.amount += this.tranferchnagesorder[i]['AMOUNT'];
                        }
                        // if (data['data'].length > 1) {
                        //   this.amount = data['data'][0]['AMOUNT'];
                        // } else {
                        //   this.amount = 0;
                        // }

                        this.api
                          .gettransfarchnagedetails1(
                            0,
                            0,
                            '',
                            'asc',
                            ' AND TRANSFER_ID =' + this.billDataID
                          )
                          .subscribe((data) => {
                            if (data['code'] == 200) {
                              this.railorder = data['data'];
                              let sum2 = 0;
                              for (let i = 0; i < this.railorder.length; i++) {
                                this.raiamount +=
                                  this.railorder[i]['FARE_PAID'];
                              }

                              this.api
                                .gettransfortation(
                                  0,
                                  0,
                                  '',
                                  'asc',
                                  ' AND TRANSFER_ID =' + this.billDataID
                                )
                                .subscribe((data) => {
                                  if (data['code'] == 200) {
                                    this.accommodation = data['data'];

                                    for (
                                      let i = 0;
                                      i < this.accommodation.length;
                                      i++
                                    ) {
                                      this.istransport +=
                                        this.accommodation[i]['FARE_PAID'];
                                    }
                                    if (
                                      this.drawerData
                                        .IS_HIGHER_CLASS_ACCOMODATION == true
                                    ) {
                                      if (
                                        this.amount == undefined ||
                                        this.amount == null ||
                                        isNaN(this.amount) == true
                                      ) {
                                        this.amount = 0;
                                      } else {
                                        this.amount = this.amount;
                                      }

                                      if (
                                        this.journeyfairfaird == undefined ||
                                        this.journeyfairfaird == null ||
                                        isNaN(this.journeyfairfaird) == true
                                      ) {
                                        this.journeyfairfaird = 0;
                                      } else {
                                        this.journeyfairfaird =
                                          this.journeyfairfaird;
                                      }

                                      if (
                                        this.raiamount == undefined ||
                                        this.raiamount == null ||
                                        isNaN(this.raiamount) == true
                                      ) {
                                        this.raiamount = 0;
                                      } else {
                                        this.raiamount = this.raiamount;
                                      }

                                      if (
                                        this.istransport == undefined ||
                                        this.istransport == null ||
                                        isNaN(this.istransport) == true
                                      ) {
                                        this.istransport = 0;
                                      } else {
                                        this.istransport = this.istransport;
                                      }

                                      // if (
                                      //   this.totacountofbill == null ||
                                      //   this.totacountofbill == undefined ||
                                      //   this.totacountofbill == 'NaN'
                                      // ) {
                                      //   this.totacountofbill = 0;
                                      // } else {
                                      //   this.totacountofbill =
                                      //     this.totacountofbill;
                                      // }
                                    } else {
                                      if (
                                        this.amount == undefined ||
                                        this.amount == null ||
                                        isNaN(this.amount) == true
                                      ) {
                                        this.amount = 0;
                                      } else {
                                        this.amount = this.amount;
                                      }

                                      if (
                                        this.journeyfairfaird == undefined ||
                                        this.journeyfairfaird == null ||
                                        isNaN(this.journeyfairfaird) == true
                                      ) {
                                        this.journeyfairfaird = 0;
                                      } else {
                                        this.journeyfairfaird =
                                          this.journeyfairfaird;
                                      }

                                      if (
                                        this.raiamount == undefined ||
                                        this.raiamount == null ||
                                        isNaN(this.raiamount) == true
                                      ) {
                                        this.raiamount = 0;
                                      } else {
                                        this.raiamount = this.raiamount;
                                      }

                                      this.totacountofbill =
                                        this.amount +
                                        this.journeyfairfaird +
                                        this.raiamount;
                                    }

                                    if (
                                      this.drawerClaimData
                                        .TRANSFER_GRANT_AMOUNT != undefined ||
                                      this.drawerClaimData
                                        .TRANSFER_GRANT_AMOUNT != null ||
                                      this.drawerClaimData
                                        .TRANSFER_GRANT_AMOUNT != ''
                                    ) {
                                      this.drawerClaimData.TRANSFER_GRANT_AMOUNT =
                                        this.drawerClaimData.TRANSFER_GRANT_AMOUNT;
                                    } else {
                                      this.drawerClaimData.TRANSFER_GRANT_AMOUNT = 0;
                                    }

                                    this.grosspaymentofpartb =
                                      Number(this.multiplication) +
                                      Number(this.incidentalsAmonut) +
                                      Number(this.totalofweight) +
                                      Number(this.grosspaymentvalue) +
                                      Number(this.transfergrantamount) +
                                      Number(this.fairpaidofpartb);
                                    this.grosspaymentofpartb = Math.round(
                                      this.grosspaymentofpartb
                                    );

                                    this.netpaymentofpartb =
                                      Number(this.grosspaymentofpartb) -
                                      Number(this.amountofadvanceamount);
                                    this.netpaymentofpartb = Math.round(
                                      this.netpaymentofpartb
                                    );

                                    this.totacountofbill =
                                      Number(
                                        this.drawerClaimData
                                          .TRANSFER_GRANT_AMOUNT
                                      ) +
                                      Number(this.multiplication) +
                                      Number(this.personalEffectsAddmissible) +
                                      Number(this.grosspaymentvalue) +
                                      Number(this.fairpaidofpartb);

                                    this.nettotacountofbill =
                                      this.totacountofbill;

                                    //  +
                                    // this.amount +
                                    // this.journeyfairfaird +
                                    // this.raiamount +
                                    // this.istransport;

                                    if (
                                      this.drawerClaimData.IS_ADVANCE_TAKEN == 1
                                    ) {
                                      this.nettotacountofbill = 0;
                                      this.nettotacountofbill =
                                        Number(this.totacountofbill) -
                                        Number(
                                          this.drawerClaimData.ADVANCED_AMOUNT
                                        );
                                    } else {
                                      this.totacountofbill = Number(
                                        this.totacountofbill
                                      );
                                    }

                                    if (
                                      this.totacountofbill == null ||
                                      this.totacountofbill == undefined ||
                                      isNaN(this.totacountofbill) == true
                                    ) {
                                      this.totacountofbill = 0;
                                    } else {
                                      this.totacountofbill =
                                        this.totacountofbill;
                                    }

                                    this.netAmountInWord = toWords.convert(
                                      Number(this.nettotacountofbill),
                                      {
                                        currency: true,
                                      }
                                    );

                                    const cleanedAmountInWords =
                                      this.netAmountInWord.replace(
                                        /\s*Rupees\s*/gi,
                                        ' '
                                      );

                                    this.netAmountInWord = cleanedAmountInWords;

                                    // this.loadingRecords = false;
                                    // this.drawerClaimVisible = true;
                                    this.drawerClaimData.CTG_TOTAL =
                                      this.drawerClaimData.TRANSFER_GRANT_AMOUNT;
                                    this.drawerClaimData.ROAD_MILEAGE_TOTAL =
                                      this.multiplication;
                                    this.drawerClaimData.JOURNEY_TOTAL =
                                      this.journeyfairfaird;
                                    this.drawerClaimData.PERSONAL_EFFECT_TOTAL =
                                      this.personalEffectsClaimed;
                                    // this.drawerClaimData.PERSONAL_EFFECT_TOTAL =
                                    //   this.totalofweight;
                                    this.drawerClaimData.PRIVATE_CONVEYANCE_TOTAL =
                                      this.grosspaymentvalue;

                                    var relationInOrder: any = [];
                                    var travelModesInOrder: any = [];

                                    // if (relationDataArray.length > 0) {
                                    //   let uniqueRelationship: string[] =
                                    //     Array.from(new Set(relationDataArray));

                                    //   if (uniqueRelationship.length === 1) {
                                    //     relationInOrder.push(
                                    //       `${uniqueRelationship[0]}/`
                                    //     );
                                    //   } else {
                                    //     // Construct the string with '/' after every value
                                    //     let relationshipString =
                                    //       uniqueRelationship.join('/');
                                    //     // Replace ',' with '/'
                                    //     relationshipString =
                                    //       relationshipString.replace(/,/g, '/');
                                    //     // Find the index of the last comma
                                    //     const lastCommaIndex =
                                    //       relationshipString.lastIndexOf('/');
                                    //     // Insert 'and ' before the last comma
                                    //     relationshipString =
                                    //       relationshipString.slice(
                                    //         0,
                                    //         lastCommaIndex
                                    //       ) +
                                    //       ' and ' +
                                    //       relationshipString.slice(
                                    //         lastCommaIndex + 1
                                    //       );
                                    //     // Push the modified string to the array
                                    //     relationInOrder.push(
                                    //       relationshipString
                                    //     );
                                    //   }
                                    // }

                                    // if (journeyTravelModes.length > 0) {
                                    //   let uniqueTravelModes: string[] =
                                    //     Array.from(new Set(journeyTravelModes));

                                    //   if (uniqueTravelModes.length === 1) {
                                    //     travelModesInOrder.push(
                                    //       `${uniqueTravelModes[0]}/`
                                    //     );
                                    //   } else {
                                    //     // Construct the string with '/' after every value
                                    //     let modesString =
                                    //       uniqueTravelModes.join('/');
                                    //     // Replace ',' with '/'
                                    //     modesString = modesString.replace(
                                    //       /,/g,
                                    //       '/'
                                    //     );
                                    //     // Find the index of the last comma
                                    //     const lastCommaIndex =
                                    //       modesString.lastIndexOf('/');
                                    //     // Insert 'and ' before the last comma
                                    //     modesString =
                                    //       modesString.slice(0, lastCommaIndex) +
                                    //       ' and ' +
                                    //       modesString.slice(lastCommaIndex + 1);
                                    //     // Push the modified string to the array
                                    //     travelModesInOrder.push(modesString);
                                    //   }
                                    // }

                                    if (this.journeydetails.length > 0) {
                                      journeyTravelModes = [
                                        ...new Set(
                                          this.journeydetails.map(
                                            (detail1) =>
                                              detail1['TRAVEL_MODE_NAME']
                                          )
                                        ),
                                      ];
                                    } else {
                                      journeyTravelModes = [];
                                    }
                                    if (this.ordeRrelationdata.length > 0) {
                                      relationDataArray = [
                                        ...new Set(
                                          this.ordeRrelationdata.map(
                                            (detail) => detail['RELATIONSHIP']
                                          )
                                        ),
                                      ];
                                    } else {
                                      relationDataArray = [];
                                    }

                                    if (
                                      relationDataArray.length == 0 &&
                                      journeyTravelModes.length == 0
                                    ) {
                                      this.drawerClaimData.ORDER_FORM_REMARK_2 =
                                        'The Officer has claim for...';
                                    } else if (
                                      relationDataArray.length != 0 &&
                                      journeyTravelModes.length != 0
                                    ) {
                                      this.drawerClaimData.ORDER_FORM_REMARK_2 =
                                        'The Officer has claim for ' +
                                        relationDataArray +
                                        ' by ' +
                                        journeyTravelModes +
                                        '.';
                                    } else if (
                                      relationDataArray.length != 0 &&
                                      journeyTravelModes.length == 0
                                    ) {
                                      this.drawerClaimData.ORDER_FORM_REMARK_2 =
                                        'The Officer has claim for' +
                                        relationDataArray +
                                        ' ...';
                                    } else if (
                                      relationDataArray.length == 0 &&
                                      journeyTravelModes.length != 0
                                    ) {
                                      this.drawerClaimData.ORDER_FORM_REMARK_2 =
                                        'The Officer has claim for' +
                                        ' ... ' +
                                        journeyTravelModes;
                                    }

                                    this.api
                                      .updatetransfer(this.drawerClaimData)
                                      .subscribe((successCode) => {
                                        if (successCode.code == '200') {
                                          // this.loadingRecords = false;
                                          if (
                                            this.drawerClaimData.CTG_REMARK ==
                                              null ||
                                            this.drawerClaimData.CTG_REMARK ==
                                              undefined ||
                                            this.drawerClaimData.CTG_REMARK ==
                                              ''
                                          ) {
                                            this.drawerClaimData.CTG_REMARK =
                                              'CTG is ' +
                                              this.drawerClaimData
                                                .TRANSFER_GRANT +
                                              '% of ' +
                                              this.drawerClaimData.GRADE_PAY +
                                              '/- = ' +
                                              this.drawerClaimData
                                                .TRANSFER_GRANT_AMOUNT +
                                              '/- ';
                                          } else {
                                            this.drawerClaimData.CTG_REMARK =
                                              this.drawerClaimData.CTG_REMARK;
                                          }

                                          var localJourneyArray: any = [];
                                          if (
                                            this.drawerClaimData
                                              .JOURNEY_REMARK == null ||
                                            this.drawerClaimData
                                              .JOURNEY_REMARK == undefined ||
                                            this.drawerClaimData
                                              .JOURNEY_REMARK == ''
                                          ) {
                                            for (
                                              let i = 0;
                                              i < this.journeydetails.length;
                                              i++
                                            ) {
                                              localJourneyArray.push(
                                                this.journeydetails[i]
                                                  .NO_OF_FAIRS +
                                                  ' fare from ' +
                                                  this.journeydetails[i]
                                                    .DEPARTURE_FROM +
                                                  ' to ' +
                                                  this.journeydetails[i]
                                                    .ARRIVAL_TO +
                                                  ' = Rs. ' +
                                                  this.journeydetails[i]
                                                    .FAIR_PAID
                                              );
                                            }
                                            if (
                                              this.journeydetails.length ==
                                              localJourneyArray.length
                                            ) {
                                              this.drawerClaimData.JOURNEY_REMARK =
                                                localJourneyArray.join('<br>');
                                            }
                                          } else {
                                            this.drawerClaimData.JOURNEY_REMARK =
                                              this.drawerClaimData.JOURNEY_REMARK;
                                          }
                                          // if (
                                          //   this.totalofweight > 0 &&
                                          //   (this.drawerClaimData
                                          //     .PERSONAL_REMARK == null ||
                                          //     this.drawerClaimData
                                          //       .PERSONAL_REMARK == undefined ||
                                          //     this.drawerClaimData
                                          //       .PERSONAL_REMARK == '')
                                          // ) {
                                          //   this.drawerClaimData.PERSONAL_REMARK =
                                          //     ' Calculation:' +
                                          //     '' +
                                          //     this.weightrate +
                                          //     '' +
                                          //     '*' +
                                          //     '' +
                                          //     this.distance +
                                          //     '' +
                                          //     '*' +
                                          //     '' +
                                          //     this.amountt +
                                          //     '' +
                                          //     '/6000' +
                                          //     '(Weight for day(s) Rs. per day )';
                                          // } else {
                                          //   this.drawerClaimData.PERSONAL_REMARK =
                                          //     this.drawerClaimData.PERSONAL_REMARK;
                                          // }

                                          if (
                                            this.grosspaymentvalue > 0 &&
                                            (this.drawerClaimData
                                              .PRIVATE_CONVEYANCE_REMARK ==
                                              null ||
                                              this.drawerClaimData
                                                .PRIVATE_CONVEYANCE_REMARK ==
                                                undefined ||
                                              this.drawerClaimData
                                                .PRIVATE_CONVEYANCE_REMARK ==
                                                '')
                                          ) {
                                            if (
                                              this.drawerClaimData
                                                .VEHICLE_BROUGHT_SELF_PROPULATION ==
                                              0
                                            ) {
                                              if (
                                                this.grosspaymentvalue ==
                                                this.drawerClaimData
                                                  .TRUCK_SHIP_CHARGE
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  'Truck/Ship Charge:-' +
                                                  this.drawerClaimData
                                                    .TRUCK_SHIP_CHARGE;
                                              } else if (
                                                this.grosspaymentvalue ==
                                                this.drawerClaimData
                                                  .TRAIN_BROUGHT_FOR_CHARGE_NO
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  ' Train Brought KiloMeter :-' +
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_FOR_KMS_NO +
                                                  '<br>' +
                                                  'Train Brought Charge :-' +
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_FOR_CHARGE_NO;
                                              } else if (
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .TRUCK_SHIP_CHARGE &&
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_FOR_CHARGE_NO &&
                                                this.privateVehicleMinFair > 0
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  'Private Vehicle Brought Charges';
                                              } else if (
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .TRUCK_SHIP_CHARGE &&
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_FOR_CHARGE_NO &&
                                                this.privateVehicleMinFair <= 0
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  '';
                                              }
                                            } else {
                                              if (
                                                this.grosspaymentvalue ==
                                                this.drawerClaimData
                                                  .VEHICLE_BROUGHT_TOTAL
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  ' Road Milage :-' +
                                                  this.drawerClaimData
                                                    .VEHICLE_BROUGHT_ROAD_MILEAGE +
                                                  '<br>' +
                                                  ' KiloMeter :-' +
                                                  this.drawerClaimData
                                                    .VEHICLE_BROUGHT_ROAD_MILEAGE_KMS +
                                                  '<br>' +
                                                  'Total:-' +
                                                  this.drawerClaimData
                                                    .VEHICLE_BROUGHT_TOTAL;
                                              } else if (
                                                this.grosspaymentvalue ==
                                                this.drawerClaimData
                                                  .TRAIN_BROUGHT_CHARGE
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  'Train Brought KiloMeter :-' +
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_KMS +
                                                  '<br>' +
                                                  ' Train Brought Charge :-' +
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_CHARGE;
                                              } else if (
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_CHARGE &&
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .VEHICLE_BROUGHT_TOTAL &&
                                                this.privateVehicleMinFair > 0
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  'Private Vehicle Brought Charges';
                                              } else if (
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .TRAIN_BROUGHT_CHARGE &&
                                                this.grosspaymentvalue !=
                                                  this.drawerClaimData
                                                    .VEHICLE_BROUGHT_TOTAL &&
                                                this.privateVehicleMinFair <= 0
                                              ) {
                                                this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                                  '';
                                              }
                                            }
                                          } else {
                                            this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK =
                                              this.drawerClaimData.PRIVATE_CONVEYANCE_REMARK;
                                          }

                                          this.loadingRecords = false;
                                          this.drawerClaimVisible = true;
                                        } else {
                                          this.message.error(
                                            'Information Has Not Saved...',
                                            ''
                                          );
                                          this.loadingRecords = false;
                                        }
                                      });
                                  }
                                });
                            } else {
                              this.loadingRecords = false;
                            }
                          });
                      } else {
                        this.loadingRecords = false;
                      }
                    });
                } else {
                  this.loadingRecords = false;
                }
              });
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {}
      );
  }

  partb(data: any) {
    this.loadingRecords = true;
    this.weightrate = 0;
    this.grosspaymentvalue = 0;
    this.weightkg = 0;
    this.amountt = 0;
    this.distance = 0;

    this.fairpaidofpartb = 0;
    this.grosspaymentofpartb = 0;
    this.amountofadvanceamount = 0;
    this.incidentalsAmonut = 0;
    this.privateVehicleMinFair = 0;
    this.partbdata = data;
    this.personalEffectsAddmissible = 0;
    this.partDrawerTitle = 'Part-B';
    this.amountofadvance = data['AMOUNT'];
    this.amountofadvanceamount = data['ADVANCED_AMOUNT'];
    this.transfergrantamount = data['TRANSFER_GRANT_AMOUNT'];

    if (this.partbdata.ID !== undefined && this.partbdata.ID !== null) {
      this.api
        .GetTransferSignature(
          0,
          0,
          '',
          'asc',
          ' AND TRANSFER_ID =' + this.partbdata.ID
        )
        .subscribe((data) => {
          if (data['code'] === 200) {
            if (data['data'] && data['data'].length > 0) {
              this.SignaturePartB = data['data'][0];
            } else {
            }
          } else {
            this.SignaturePartB = new TransferMapData();
          }
        });
    }
    if (
      (data.ROAD_MILEAGE != undefined && data.PER_KM != undefined) ||
      (data.ROAD_MILEAGE != null && data.PER_KM != null)
    ) {
      this.multiplication = data.ROAD_MILEAGE * data.PER_KM;
    } else {
    }
    if (
      (data.RUPEES_PER_DAY != undefined && data.D_A != undefined) ||
      (data.RUPEES_PER_DAY != null && data.D_A != null)
    ) {
      this.incidentalsAmonut = data.D_A * data.RUPEES_PER_DAY;
    } else {
    }
    if (
      (data.WEIGHT_IN_KG != undefined && data.RATE != undefined) ||
      (data.WEIGHT_IN_KG != null && data.RATE != null)
    ) {
      // this.totalofweight = data.WEIGHT_IN_KG * data.RATE;
    } else {
    }
    this.privateVehicleFair = [];
    this.TravelModeNames = [];
    this.showPrivate = 0;
    this.api
      .getjourneydetails(0, 0, '', 'asc', ' AND TRANSFER_ID =' + data.ID)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.journeyDetailsData = data['data'];

          for (let i = 0; i < this.journeyDetailsData.length; i++) {
            if (
              this.TravelModeNames.includes(
                this.journeyDetailsData[i].TRAVEL_MODE_NAME
              ) === false
            )
              this.TravelModeNames.push(
                this.journeyDetailsData[i].TRAVEL_MODE_NAME
              );
          }

          for (let i = 0; i < this.journeyDetailsData.length; i++) {
            this.fairpaidofpartb += this.journeyDetailsData[i]['FAIR_PAID'];
          }

          for (let i = 0; i < this.journeyDetailsData.length; i++) {
            if (this.journeyDetailsData[i]['TRAVEL_CLASS_ID'] == 13) {
              this.privateVehicleFair.push(
                this.journeyDetailsData[i]['FAIR_PAID']
              );
            } else {
            }
          }
          if (this.privateVehicleFair.length > 0) {
            this.privateVehicleMinFair = Math.min.apply(
              null,
              this.privateVehicleFair
            );
          } else {
            this.privateVehicleMinFair = 0;
          }

          if (this.partbdata.VEHICLE_BROUGHT_SELF_PROPULATION == 0) {
            if (this.privateVehicleFair.length > 0) {
              this.grosspaymentvalue = Math.min(
                this.partbdata.TRUCK_SHIP_CHARGE,
                this.partbdata.TRAIN_BROUGHT_FOR_CHARGE_NO,
                this.privateVehicleMinFair
              );
            } else {
              this.grosspaymentvalue = Math.min(
                this.partbdata.TRUCK_SHIP_CHARGE,
                this.partbdata.TRAIN_BROUGHT_FOR_CHARGE_NO
              );
            }
          } else if (this.partbdata.VEHICLE_BROUGHT_SELF_PROPULATION == 1) {
            if (this.privateVehicleFair.length > 0) {
              this.grosspaymentvalue = Math.min(
                this.partbdata.VEHICLE_BROUGHT_TOTAL,
                this.partbdata.TRAIN_BROUGHT_CHARGE,
                this.privateVehicleMinFair
              );
            } else {
              this.grosspaymentvalue = Math.min(
                this.partbdata.VEHICLE_BROUGHT_TOTAL,
                this.partbdata.TRAIN_BROUGHT_CHARGE
              );
            }
          }

          if (
            this.grosspaymentvalue == this.partbdata.TRUCK_SHIP_CHARGE ||
            this.grosspaymentvalue ==
              this.partbdata.TRAIN_BROUGHT_FOR_CHARGE_NO ||
            this.grosspaymentvalue == this.partbdata.VEHICLE_BROUGHT_TOTAL ||
            this.grosspaymentvalue == this.partbdata.TRAIN_BROUGHT_CHARGE
          ) {
            this.showPrivate = 1;
          } else if (
            this.grosspaymentvalue > 0 &&
            this.grosspaymentvalue == this.privateVehicleMinFair
          ) {
            this.showPrivate = 2;
          } else {
            this.showPrivate = 0;
          }

          this.loadingRecords = false;
        } else {
          this.loadingRecords = false;
          this.journeyDetailsData = [];
        }
      });

    this.totalofweight = 0;
    this.api
      .gettransfarchnagedetailspersonal(
        0,
        0,
        '',
        'asc',
        ' AND TRANSFER_ID =' + data.ID
      )

      .subscribe((data) => {
        if (data['code'] == 200) {
          this.tranferchnagesorder = data['data'];

          if (data['data'].length > 0) {
            this.distance = data['data'][0]['DISTANCE'];
            this.weightrate = data['data'][0]['RATE'];
            this.amountt = data['data'][0]['WEIGHT_IN_KG'];
            for (let z = 0; z < this.tranferchnagesorder.length; z++) {
              this.personalEffectsAddmissible +=
                this.tranferchnagesorder[z]['AMOUNT'];
            }
          } else {
            this.distance = 0;
            this.weightrate = 0;
            this.amountt = 0;
            this.personalEffectsAddmissible = 0;
          }
          this.totalofweight =
            (this.distance * this.weightrate * this.amountt) / 6000;
          this.totalofweight = this.totalofweight.toFixed();

          if (
            this.multiplication == undefined ||
            this.multiplication == null ||
            this.multiplication == '' ||
            isNaN(this.multiplication) == true
          ) {
            this.multiplication = 0;
          } else {
            this.multiplication = this.multiplication;
          }

          if (
            this.incidentalsAmonut == undefined ||
            this.incidentalsAmonut == null ||
            this.incidentalsAmonut == '' ||
            isNaN(this.incidentalsAmonut) == true
          ) {
            this.incidentalsAmonut = 0;
          } else {
            this.incidentalsAmonut = this.incidentalsAmonut;
          }

          if (this.totalofweight == undefined || this.totalofweight == null) {
            this.totalofweight = 0;
          } else {
            this.totalofweight = this.totalofweight;
          }

          if (
            this.amountofadvance == undefined ||
            this.amountofadvance == null
          ) {
            this.amountofadvance = 0;
          } else {
            this.amountofadvance = this.amountofadvance;
          }

          if (
            this.transfergrantamount == undefined ||
            this.transfergrantamount == null
          ) {
            this.transfergrantamount = 0;
          } else {
            this.transfergrantamount = this.transfergrantamount;
          }

          if (
            this.fairpaidofpartb == undefined ||
            this.fairpaidofpartb == null
          ) {
            this.fairpaidofpartb = 0;
          } else {
            this.fairpaidofpartb = this.fairpaidofpartb;
          }

          this.grosspaymentofpartb =
            Number(this.multiplication) +
            Number(this.incidentalsAmonut) +
            Number(this.totalofweight) +
            Number(this.grosspaymentvalue) +
            Number(this.transfergrantamount) +
            Number(this.fairpaidofpartb);
          this.grosspaymentofpartb = Math.round(this.grosspaymentofpartb);

          // if (
          //   this.grosspaymentofpartb == 'NaN' ||
          //   this.grosspaymentofpartb == null ||
          //   this.grosspaymentofpartb == undefined
          // ) {
          //   this.grosspaymentofpartb = 0;
          // } else {
          //   this.grosspaymentofpartb = this.grosspaymentofpartb;
          // }
          if (
            this.amountofadvanceamount == null ||
            this.amountofadvanceamount == undefined
          ) {
            this.amountofadvanceamount = 0;
          } else {
            this.amountofadvanceamount = this.amountofadvanceamount;
          }

          this.netpaymentofpartb =
            Number(this.grosspaymentofpartb) -
            Number(this.amountofadvanceamount);
          this.netpaymentofpartb = Math.round(this.netpaymentofpartb);
          this.partborder = true;
        }
      });
  }

  openChecklist(data) {
    if (data.ID != null || data.ID != undefined) {
      this.transferData = Object.assign({}, data);
      this.checklistTitle = 'CheckList';
      this.loadingRecords = true;

      if (this.transferData.ID !== undefined && this.transferData.ID !== null) {
        this.api
          .GetTransferSignature(
            0,
            0,
            '',
            'asc',
            ' AND TRANSFER_ID =' + this.transferData.ID
          )
          .subscribe((data) => {
            if (data['code'] === 200) {
              if (data['data'] && data['data'].length > 0) {
                this.CheckListSignatureMap = data['data'][0];
              } else {
              }
            } else {
              this.CheckListSignatureMap = new TransferMapData();
            }
          });
      }

      this.api
        .getAllTransferChecklist(0, 0, '', ' ', ' AND TRANSFER_ID =' + data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.checklistData = data['data'][0];
              } else {
                this.checklistData = [];
              }
              this.loadingRecords = false;
              this.checklistVisible = true;
              // if (
              //   this.transferData.SIGNATURE_ID != undefined &&
              //   this.transferData.SIGNATURE_ID != null &&
              //   this.transferData.SIGNATURE_ID != ''
              // ) {
              //   this.api
              //     .getSignature(
              //       0,
              //       0,
              //       '',
              //       '',
              //       ' AND ID = ' + this.transferData.SIGNATURE_ID
              //     )
              //     .subscribe(
              //       (data) => {
              //         if (data['code'] == 200) {
              //           this.SIGNNAME = data['data'][0]['NAME'];
              //           this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
              //           this.POST = data['data'][0]['POST'];
              //           this.loadingRecords = false;
              //           this.checklistVisible = true;
              //         } else {
              //           this.message.error('Something Went Wrong', '');
              //           this.loadingRecords = false;
              //         }
              //       },
              //       (err) => {}
              //     );
              // } else {
              //   // this.POST = '';
              //   // this.OFFICE_NAME = '';
              //   // this.SIGNNAME = '';
              //   this.loadingRecords = false;
              //   this.checklistVisible = true;
              // }
            } else {
              this.loadingRecords = false;
              this.message.error("Can't Load Checklist Data", '');
            }
          },
          (err) => {}
        );
    } else {
    }
  }
}
