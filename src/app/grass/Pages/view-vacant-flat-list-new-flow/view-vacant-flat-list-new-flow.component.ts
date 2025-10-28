import { Component, Input, OnInit } from '@angular/core';
import { APIServicesService } from '../../Services/APIService.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { QuarterMaster } from '../QUARTER/QuarterData';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-view-vacant-flat-list-new-flow',
  templateUrl: './view-vacant-flat-list-new-flow.component.html',
  styleUrls: ['./view-vacant-flat-list-new-flow.component.css'],
  providers: [DatePipe],
})
export class ViewVacantFlatListNewFlowComponent implements OnInit {
  formTitle = 'Quarter Master';
  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  drawerTitle!: string;
  userid: any;
  roleid: any;
  Checkrole: boolean = true;
  savendate: any = new Date();
  cutoffPeriod: any;
  imgurl = appkeys.retriveimgUrl;

  columns: string[][] = [
    ['CITY_NAME', 'CITY_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['NAME', 'name'],
    ['RESIDENCE_TYPE_NAME', 'Residence Type'],
    ['ROOM_TYPE', 'Room Type'],
  ];
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = QuarterMaster;
  vacantstep: any = 0;
  currentDate: any;
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}

  inspectorname: any = '';
  ngOnInit(): void {
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.currentDate = new Date();
    let currentDatcute: Date = new Date();
    this.cutoffPeriod = new Date(
      currentDatcute.getFullYear(),
      currentDatcute.getMonth(),
      0
    );
    const currentDate: any = new Date();
    const futureDate: any = new Date(currentDate);
    this.savendate = futureDate.setDate(currentDate.getDate() + 9);
    this.getAllUsers();
  }
  applyFilter() {
    this.search(true);
    this.isFilterApplied = 'primary';
  }

  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  onKeypressEvent(event: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
  }
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ') ';
    }
    var filterQuery1 = '';
    if (
      this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.RESIDENCE_TYPE_ID != '' &&
      this.data.RESIDENCE_TYPE_ID != null
    ) {
      filterQuery1 =
        ' AND RESIDENCE_TYPE_ID in (' + this.data.RESIDENCE_TYPE_ID + ')';
    }
    var caretakerid = Number(sessionStorage.getItem('userId'));
    if (Number(sessionStorage.getItem('roleId')) == 14) {
      var caretakerfilter = ' AND CARETAKER_ID=' + caretakerid;
    } else {
      var caretakerfilter = '';
    }

    this.api
      .getQuarterMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        likeQuery +
          caretakerfilter +
          filterQuery1 +
          " AND STATUS=1 AND AVAILABLE_STATUS = 'A'"
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.isFilterApplied = 'primary';
          this.filterClass = 'filter-invisible';
        },
        (err) => {
          this.loadingRecords = false;
          this.message.error('Failed To Get data', '');
        }
      );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  close() {
    this.drawerClose();
  }
  // viewNotice() {
  //   if (this.dataList.length == 0) {
  //     this.message.info('No quarters are available, Please vacant quarters to proceed.', '');
  //   } else {
  //     const currentDate: any = new Date();
  //     const futureDate: any = new Date(currentDate);
  //     this.savendate = futureDate.setDate(currentDate.getDate() + 9);
  //     this.PREFERENCE_START_DATE_TIME = new Date();
  //     this.onStartChange1(this.PREFERENCE_START_DATE_TIME);
  //     this.vacantstep = 1;
  //   }
  // }

  viewNotice() {
    this.previewnoticeload = true;
    if (this.dataList.length == 0) {
      this.message.info(
        'No quarters are available, Please vacant quarters to proceed.',
        ''
      );
      this.previewnoticeload = false;
    } else {
      var filterQuery1 = '';
      if (
        this.data.RESIDENCE_TYPE_ID != undefined &&
        this.data.RESIDENCE_TYPE_ID != '' &&
        this.data.RESIDENCE_TYPE_ID != null
      ) {
        filterQuery1 =
          ' AND RESIDENCE_TYPE_ID in (' + this.data.RESIDENCE_TYPE_ID + ')';
      }
      var caretakerid = Number(sessionStorage.getItem('userId'));
      if (Number(sessionStorage.getItem('roleId')) == 14) {
        var caretakerfilter = ' AND CARETAKER_ID=' + caretakerid;
      } else {
        var caretakerfilter = '';
      }
      this.api
        .getQuarterMaster(
          0,
          0,
          '',
          '',
          " AND STATUS=1 AND AVAILABLE_STATUS = 'A' " +
            filterQuery1 +
            caretakerfilter
        )
        .subscribe(
          (data) => {
            this.dataList = data['data'];
            if (this.dataList.length == 0) {
              this.message.info(
                'No quarters are available, Please vacant quarters to proceed.',
                ''
              );
              this.previewnoticeload = false;
            } else {
              this.previewnoticeload = false;
              const currentDate: any = new Date();
              const futureDate: any = new Date(currentDate);
              this.savendate = futureDate.setDate(currentDate.getDate() + 9);
              this.PREFERENCE_START_DATE_TIME = new Date();
              this.onStartChange1(this.PREFERENCE_START_DATE_TIME);
              this.vacantstep = 1;
            }
          },
          (err) => {
            this.previewnoticeload = false;
            this.loadingRecords = false;
            this.message.error('Failed To Get data', '');
          }
        );
    }
  }

  generateload: boolean = false;

  generateOrder() {
    this.generatedOrder1();
  }

  previousNotice() {
    this.vacantstep = 0;
  }
  previousOrder() {
    this.vacantstep = 1;
  }

  flatList: any = [];
  dataListForFinalOrder: any = [];
  RESIDENCE_TYPE_NAME: any;
  isSpinning: boolean = false;
  isSpinningForPDF: boolean = false;

  filter: any;
  currentMonth: any;
  currentYear: any;
  residenceTypeID: any;
  flatIdsArray: any = [];
  PdfGenFlase: boolean = false;
  previewnoticeload: boolean = false;

  vacantid: any;
  listOfFlat(event) {
    if (
      this.data.SIGNATURE_ID == null ||
      this.data.SIGNATURE_ID == undefined ||
      this.data.SIGNATURE_ID == '' ||
      this.data.SIGNATURE_ID == 0
    ) {
      this.message.error('Please Select Signature', '');
    } else if (
      this.data.VACANT_ORDER_NO == null ||
      this.data.VACANT_ORDER_NO == undefined ||
      this.data.VACANT_ORDER_NO == '' ||
      this.data.VACANT_ORDER_NO == 0
    ) {
      this.message.error('Please Vacant Order Number', '');
    } else if (
      this.currentDate == null ||
      this.currentDate == undefined ||
      this.currentDate == ''
    ) {
      this.message.error('Please Select Date', '');
    } else if (
      this.PREFERENCE_START_DATE_TIME == null ||
      this.PREFERENCE_START_DATE_TIME == undefined ||
      this.PREFERENCE_START_DATE_TIME == ''
    ) {
      this.message.error('Please Select Preference Start Datetime', '');
    } else if (
      this.PREFERENCE_END_DATE_TIME == null ||
      this.PREFERENCE_END_DATE_TIME == undefined ||
      this.PREFERENCE_END_DATE_TIME == ''
    ) {
      this.message.error('Please Select Preference End Datetime', '');
    } else {
      this.PREFERENCE_START_DATE_TIME = this.datepipe.transform(
        this.PREFERENCE_START_DATE_TIME,
        'yyyy-MM-dd :HH:mm'
      );
      this.PREFERENCE_END_DATE_TIME = this.datepipe.transform(
        this.PREFERENCE_END_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
      this.residenceTypeID = '';
      if (event != null && event != undefined && event != '') {
        this.residenceTypeID = event;
        this.isSpinning = true;
        this.isSpinningForPDF = true;
        this.previewnoticeload = true;
        this.api
          .getQuarterMaster(
            0,
            0,
            '',
            '',
            " AND STATUS=1 AND AVAILABLE_STATUS = 'A' AND RESIDENCE_TYPE_ID = " +
              event
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                if (data['data'].length > 0) {
                  this.currentDate = this.datepipe.transform(
                    this.currentDate,
                    'yyyy-MM-dd'
                  );
                  this.flatList = data['data'];
                  this.flatList.forEach((item) => {
                    this.flatIdsArray.push(item.ID);
                  });
                  this.RESIDENCE_TYPE_NAME =
                    data['data'][0]['RESIDENCE_TYPE_NAME'];
                  if (this.flatList.length > 0) {
                    var datas = {
                      MONTH: this.data.MONTH,
                      YEAR: this.data.YEAR,
                      RESIDENCE_TYPE: this.data.RESIDENCE_TYPE_ID,
                      DATETIME: this.datepipe.transform(
                        new Date(),
                        'yyyy-MM-dd HH:mm:ss'
                      ),
                      RESIDENCE_TYPE_ID: this.flatList,
                      FILE_URL: null,
                      APPROVER_ID: Number(sessionStorage.getItem('userId')),
                      CREATOR_ID: Number(sessionStorage.getItem('userId')),
                      PUBLISH_DATE_TIME: this.datepipe.transform(
                        new Date(),
                        'yyyy-MM-dd HH:mm:ss'
                      ),
                      IS_PUBLISH: 1,
                    };
                    this.api.createFlatOrderBulk(datas).subscribe(
                      (successCode) => {
                        if (successCode.code == '200') {
                          this.vacantid = successCode['VACANT_MASTER_ID'];
                          this.previewnoticeload = false;
                          this.generatedOrder();
                          this.api
                            .flatVacantOrderMasterGenPDF(
                              this.data.RESIDENCE_TYPE_ID,
                              this.RESIDENCE_TYPE_NAME,
                              this.flatIdsArray,
                              successCode['VACANT_MASTER_ID'],
                              this.datepipe.transform(
                                this.cutoffPeriod,
                                'dd/MM/yyyy'
                              ),
                              this.datepipe.transform(
                                this.currentDate,
                                'dd/MM/yyyy'
                              ),
                              this.datepipe.transform(
                                this.PREFERENCE_END_DATE_TIME,
                                'dd/MM/yyyy HH:mm'
                              ),
                              this.PREFERENCE_START_DATE_TIME,
                              this.PREFERENCE_END_DATE_TIME,
                              this.data.DRAFT_WAITING_MASTER_ID,
                              this.data.SIGNATURE_ID,
                              this.data.VACANT_ORDER_NO,
                              this.SIGNNAME,
                              this.NAME_HN,
                              this.POST,
                              this.POST_HIN,
                              this.OFFICE,
                              this.OFFICE_HN,
                              this.SIGNATURE_IMAGE
                            )
                            .subscribe(
                              (successCodefogen) => {
                                if (successCodefogen.code == '200') {
                                  this.vacantstep = 1;
                                  var noticed: any = this.datepipe.transform(
                                    new Date(),
                                    'yyyy-MM-dd HH:mm:ss'
                                  );
                                  this.api
                                    .tempWaitingListStepUpdateForvacantflat(
                                      this.data.ID,
                                      2,
                                      '',
                                      '',
                                      this.vacantid,
                                      this.data.DRAFT_WAITING_MASTER_ID,
                                      noticed
                                    )
                                    .subscribe(
                                      (stepdata) => {
                                        if (stepdata['code'] == 200) {
                                          this.close();
                                          this.isSpinning = false;
                                        } else {
                                          this.isSpinning = false;
                                          this.message.error(
                                            'Something went wrong, Please Try Again',
                                            ''
                                          );
                                        }
                                      },
                                      (err) => {
                                        this.isSpinning = false;
                                        this.message.error(
                                          'Something went wrong, Please Try Again',
                                          ''
                                        );
                                      }
                                    );
                                  this.PdfGenFlase = false;
                                  this.isSpinning = false;
                                  this.isSpinningForPDF = false;
                                } else {
                                  this.PdfGenFlase = true;
                                  this.isSpinning = false;
                                  this.previewnoticeload = false;

                                  this.isSpinningForPDF = false;
                                  this.message.error(
                                    'Vacant Notice Generation Failed, Please Try Again',
                                    ''
                                  );
                                }
                              },
                              (err) => {
                                this.PdfGenFlase = true;
                                this.isSpinningForPDF = false;
                                this.previewnoticeload = false;
                                this.isSpinning = false;
                                this.message.error(
                                  'Vacant Notice Generation Failed, Please Try Again',
                                  ''
                                );
                              }
                            );
                        } else if (successCode.code == '300') {
                          this.isSpinning = true;
                          this.isSpinningForPDF = true;
                          this.generatedOrder();
                          this.api
                            .flatVacantOrderMasterGenPDF(
                              this.data.RESIDENCE_TYPE_ID,
                              this.RESIDENCE_TYPE_NAME,
                              this.flatIdsArray,
                              successCode['VACANT_MASTER_ID'],
                              this.datepipe.transform(
                                this.cutoffPeriod,
                                'dd/MM/yyyy'
                              ),
                              this.datepipe.transform(
                                this.currentDate,
                                'dd/MM/yyyy'
                              ),
                              this.datepipe.transform(
                                this.PREFERENCE_END_DATE_TIME,
                                'dd/MM/yyyy HH:mm'
                              ),
                              this.PREFERENCE_START_DATE_TIME,
                              this.PREFERENCE_END_DATE_TIME,
                              this.data.DRAFT_WAITING_MASTER_ID,
                              this.data.SIGNATURE_ID,
                              this.data.VACANT_ORDER_NO,
                              this.SIGNNAME,
                              this.NAME_HN,
                              this.POST,
                              this.POST_HIN,
                              this.OFFICE,
                              this.OFFICE_HN,
                              this.SIGNATURE_IMAGE
                            )
                            .subscribe(
                              (successCodefogen) => {
                                if (successCodefogen.code == '200') {
                                  this.vacantstep = 1;
                                  var noticed: any = this.datepipe.transform(
                                    new Date(),
                                    'yyyy-MM-dd HH:mm:ss'
                                  );
                                  this.api
                                    .tempWaitingListStepUpdateForvacantflat(
                                      this.data.ID,
                                      2,
                                      '',
                                      '',
                                      this.vacantid,
                                      this.data.DRAFT_WAITING_MASTER_ID,
                                      noticed
                                    )
                                    .subscribe(
                                      (stepdata) => {
                                        if (stepdata['code'] == 200) {
                                          this.close();
                                          this.isSpinning = false;
                                        } else {
                                          this.isSpinning = false;
                                          this.message.error(
                                            'Something went wrong, Please Try Again',
                                            ''
                                          );
                                        }
                                      },
                                      (err) => {
                                        this.isSpinning = false;
                                        this.message.error(
                                          'Something went wrong, Please Try Again',
                                          ''
                                        );
                                      }
                                    );
                                  this.PdfGenFlase = false;
                                  this.isSpinning = false;
                                  this.isSpinningForPDF = false;
                                } else {
                                  this.PdfGenFlase = true;
                                  this.isSpinning = false;
                                  this.previewnoticeload = false;

                                  this.isSpinningForPDF = false;
                                  this.message.error(
                                    'Vacant Notice Generation Failed, Please Try Again',
                                    ''
                                  );
                                }
                              },
                              (err) => {
                                this.PdfGenFlase = true;
                                this.isSpinningForPDF = false;
                                this.isSpinning = false;
                                this.previewnoticeload = false;

                                this.message.error(
                                  'Vacant Notice Generation Failed, Please Try Again',
                                  ''
                                );
                              }
                            );
                        } else {
                          this.message.error(
                            'Something went wrong, please try again later',
                            ''
                          );
                          this.isSpinning = false;
                          this.isSpinningForPDF = false;
                          this.previewnoticeload = false;
                        }
                      },
                      (err) => {
                        this.isSpinning = false;
                        this.isSpinningForPDF = false;
                        this.previewnoticeload = false;

                        this.message.error(
                          'Something went wrong, please try again later',
                          ''
                        );
                      }
                    );
                  } else {
                    this.isSpinning = false;
                    this.isSpinningForPDF = false;
                    this.previewnoticeload = false;

                    this.message.info(
                      'There Is No Vacant Quarter Available On This Residence Type',
                      ''
                    );
                  }
                } else {
                  this.isSpinning = false;
                  this.flatList = [];
                  this.isSpinningForPDF = false;
                  this.previewnoticeload = false;

                  this.RESIDENCE_TYPE_NAME = '';
                  this.message.info(
                    'There Is No Vacant Quarter Available On This Residence Type',
                    ''
                  );
                }
              } else {
                this.flatList = [];
                this.isSpinningForPDF = false;
                this.isSpinning = false;
                this.previewnoticeload = false;
              }
            },
            (err) => {
              this.isSpinning = false;
              this.flatList = [];
              this.isSpinningForPDF = false;
              this.RESIDENCE_TYPE_NAME = '';
            }
          );
      } else {
        this.flatList = [];
        this.isSpinning = false;
        this.isSpinningForPDF = false;
        this.RESIDENCE_TYPE_NAME = '';
        this.previewnoticeload = false;
      }
    }
  }

  generatedOrder() {
    var filterQuery1 = '';
    if (
      this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.RESIDENCE_TYPE_ID != '' &&
      this.data.RESIDENCE_TYPE_ID != null
    ) {
      filterQuery1 =
        ' AND RESIDENCE_TYPE in (' + this.data.RESIDENCE_TYPE_ID + ')';
    }
    var datefilter = '';
    if (
      this.data.MONTH != undefined &&
      this.data.MONTH != '' &&
      this.data.MONTH != null
    ) {
      datefilter =
        ' AND MONTH=' + this.data.MONTH + ' AND YEAR=' + this.data.YEAR;
    }

    this.api
      .getFlatOrder(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        'desc',
        datefilter + filterQuery1
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.currentDate = this.datepipe.transform(
              new Date(),
              'yyyy-MM-dd'
            );
            this.dataListForFinalOrder = data['data'][0];
            this.previewnoticeload = false;
            this.vacantid = data['data'][0]['ID'];
            this.publish();
          } else {
            this.loadingRecords = false;
            this.previewnoticeload = false;
          }
        },
        (err) => {
          this.previewnoticeload = false;

          this.loadingRecords = false;
        }
      );
  }

  generatedOrder1() {
    var filterQuery1 = '';
    if (
      this.data.RESIDENCE_TYPE_ID != undefined &&
      this.data.RESIDENCE_TYPE_ID != '' &&
      this.data.RESIDENCE_TYPE_ID != null
    ) {
      filterQuery1 =
        ' AND RESIDENCE_TYPE in (' + this.data.RESIDENCE_TYPE_ID + ')';
    }
    var datefilter = '';
    if (
      this.data.MONTH != undefined &&
      this.data.MONTH != '' &&
      this.data.MONTH != null
    ) {
      datefilter =
        ' AND MONTH=' + this.data.MONTH + ' AND YEAR=' + this.data.YEAR;
    }

    this.api
      .getFlatOrder(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        'desc',
        datefilter + filterQuery1
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            const currentDate: any = new Date();
            const futureDate: any = new Date(currentDate);
            this.savendate = futureDate.setDate(currentDate.getDate() + 9);
            this.currentDate = this.datepipe.transform(
              new Date(),
              'yyyy-MM-dd'
            );
            this.dataListForFinalOrder = data['data'][0];
            this.vacantid = data['data'][0]['ID'];
            this.generateload = true;

            this.api
              .flatVacantOrderMasterGenPDForder(
                this.data.RESIDENCE_TYPE_ID,
                this.RESIDENCE_TYPE_NAME,
                this.flatIdsArray,
                this.vacantid
              )
              .subscribe(
                (successCodefogen) => {
                  if (successCodefogen.code == '200') {
                    this.vacantstep = 2;
                    this.PdfGenFlase = false;
                    this.generateload = false;
                    this.isSpinning = false;
                    this.isSpinningForPDF = false;
                    this.message.success(
                      'Order Sheet Generated Successfully ',
                      ''
                    );
                  } else {
                    this.PdfGenFlase = true;
                    this.isSpinning = false;
                    this.generateload = false;
                    this.isSpinningForPDF = false;
                    this.message.error(
                      'Vacant Notice Generation Failed, Please Try Again',
                      ''
                    );
                  }
                },
                (err) => {
                  this.PdfGenFlase = true;
                  this.isSpinningForPDF = false;
                  this.generateload = false;
                  this.isSpinning = false;
                  this.message.error(
                    'Vacant Notice Generation Failed, Please Try Again',
                    ''
                  );
                }
              );
          } else {
            this.loadingRecords = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }

  publish() {
    this.dataListForFinalOrder.APPROVER_ID = Number(
      sessionStorage.getItem('userId')
    );
    this.dataListForFinalOrder.IS_PUBLISH = 1;
    this.dataListForFinalOrder.PUBLISH_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.dataListForFinalOrder.RESIDENCE_TYPE = this.data.RESIDENCE_TYPE_ID;
    this.api.updateFlatOrder(this.dataListForFinalOrder).subscribe(
      (successCode) => {
        if (successCode.code == '200') {
        } else {
        }
      },
      (err) => {}
    );
  }

  getdatee() {
    var date: any = new Date();
    const firstDayOfCurrentMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth);
    lastDayOfPreviousMonth.setDate(firstDayOfCurrentMonth.getDate() - 1);
    return this.datepipe.transform(
      new Date(lastDayOfPreviousMonth),
      'dd-MM-yyyy'
    );
  }
  PREFERENCE_START_DATE_TIME: any;
  PREFERENCE_END_DATE_TIME: any;
  onStartChange1(date: Date): void {
    this.PREFERENCE_END_DATE_TIME = new Date(date);
    this.PREFERENCE_END_DATE_TIME.setDate(
      this.PREFERENCE_END_DATE_TIME.getDate() + 7
    );
  }
  datee: any;
  disabledEndDate1 = (endValue: Date): boolean => {
    if (!endValue) {
      return false;
    }
    var previousDate = new Date(this.PREFERENCE_START_DATE_TIME);
    previousDate.setDate(previousDate.getDate() + 7);
    return endValue <= new Date(previousDate);
  };

  disabledStartDate = (current: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.datee = current;
    return current < yesterday;
  };

  getAllUsers() {
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        ' AND STATUS = 1  AND SERVICE_ID = 5  '
        // AND DDO_ID=' +  Number(sessionStorage.getItem('ddoId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Signaturearray = data['data'];

            if (this.Signaturearray.length > 0) {
              if (this.data['SIGNATURE_ID']) {
                const abc = Number(this.data['SIGNATURE_ID']);
                this.signature(abc);
              }
            }
          }
        },
        (err) => {}
      );
  }

  Signaturearray: any = [];
  SIGNNAME = '';
  NAME_HN = '';
  POST = '';
  POST_HIN = '';
  OFFICE = '';
  OFFICE_HN = '';
  SIGNATURE_IMAGE = '';
  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
      this.OFFICE = f[0]['OFFICE_NAME'];
      this.OFFICE_HN = f[0]['OFFICE_NAME_HN'];
      this.SIGNATURE_IMAGE = f[0]['SIGNATURE_IMAGE'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
      this.OFFICE = '';
      this.OFFICE_HN = '';
      this.SIGNATURE_IMAGE = '';
    }
  }
}
