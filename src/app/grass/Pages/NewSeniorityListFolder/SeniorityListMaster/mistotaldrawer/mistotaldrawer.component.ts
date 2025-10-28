import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { appkeys, grass } from 'src/app/app.constant';
import { Allotmentpublishedlist } from 'src/app/grass/Models/AllotmentPublishlist';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-mistotaldrawer',
  templateUrl: './mistotaldrawer.component.html',
  styleUrls: ['./mistotaldrawer.component.css'],
})
export class MIStotaldrawerComponent {
  constructor(
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private message: NzNotificationService,
    private api: APIServicesService
  ) { }
  @Input() drawerClose!: Function;
  @Input() misdata: any;
  @Input() mislistdata: any;
  @Input() searchdata: any;
  @Input() searchdataMAIN: any;
  dateeeeeforremnder: any;
  currentTimeformis: Date = new Date();
  Timmerloopmis: any = [];
  Signaturearray: any = [];
  SIGNNAME = '';
  NAME_HN = '';
  POST = '';
  POST_HIN = '';
  OFFICE_NAME = '';
  OFFICE_NAME_HIN = '';
  imis = 0;
  Timmerstartloopmis: any = [];
  Timmerendloopmis: any = [];
  countdowndisablemis: boolean = true;
  countdowndisablephend: boolean = true;
  KeyImage: any = grass.key;
  imgurl = appkeys.retriveimgUrl;
  ngOnInit() {
    this.KeyImage = grass.key;

    this.getAllUsers();
    if (this.searchdata == 'MAIN_TPEA') {
      this.openreceiveddiv1 = false;
      this.openreceiveddiv = true;
    } else if (this.searchdata == 'TREPHYA') {
      this.openreceiveddiv1 = true;
      this.openreceiveddiv = false;
    } else {
      this.openreceiveddiv1 = false;
      this.openreceiveddiv = false;
    }
    this.search(true);
    var dateeeeeee = new Date();
    this.dateeeeeforremnder =
      this.datepipe.transform(dateeeeeee, 'yyyy-MM-dd') + ' 23:59:59';
  }
  ViewTechnicalcaretakeracceptance(data: any, n) { }
  ViewNonAcceptance(data: any) { }

  totalRecordsPA = 0;
  pageIndexPA = 1;
  pageSizePA = 10;
  sortValuePA: string = 'asc';
  sortKeyPA: string = 'ID';
  loadingRecords: boolean = false;
  sortPA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexPA = pageIndex;
    this.pageSizePA = pageSize;

    if (this.pageSizePA != pageSize) {
      this.pageIndexPA = 1;
      this.pageSizePA = pageSize;
    }

    if (this.sortKeyPA != sortField) {
      this.pageIndexPA = 1;
      this.pageSizePA = pageSize;
    }

    this.sortKeyPA = sortField;
    this.sortValuePA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  EmployeeAcceptancelist: any = [];

  Timmerstartloop: any = [];
  Timmerendloop: any = [];
  countdowndisable = true;

  accetrejectdata: any;
  viewPdfSafe: any;
  viewPdfSafephysical: any;
  printOrderModalVisibletitle: any;
  printOrderModalVisible: boolean = false;
  ViewAF(pdfURL: string, emplist: any) {
    this.accetrejectdata = Object.assign({}, emplist);
    this.viewPdfSafe = '';
    this.printOrderModalVisible = true;
    var month = '';
    switch (this.accetrejectdata.MONTH) {
      case 1:
        month = 'JANUARY';
        break;
      case 2:
        month = 'FEBRUARY';
        break;
      case 3:
        month = 'MARCH';
        break;
      case 4:
        month = 'APRIL';
        break;
      case 5:
        month = 'MAY';
        break;
      case 6:
        month = 'JUNE';
        break;
      case 7:
        month = 'JULY';
        break;
      case 8:
        month = 'AUGUST';
        break;
      case 9:
        month = 'SEPTEMBER';
        break;
      case 10:
        month = 'OCTOBER';
        break;
      case 11:
        month = 'NOVEMBER';
        break;
      case 12:
        month = 'DECEMBER';
        break;
      default:
        break;
    }
    this.printOrderModalVisibletitle =
      'Generate Physical Letter For Residence ' +
      this.accetrejectdata.RESIDENCE_TYPE_NAME +
      ' ' +
      month +
      ' ' +
      this.accetrejectdata.YEAR;
    this.acceptancestep = 0;
    this.viewPdfSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.api.retriveimgUrl + 'acceptanceLetter/' + pdfURL
    );
    this.viewPdfSafephysical = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.api.retriveimgUrl +
      'physicalOccupancyReminder/' +
      this.accetrejectdata.PHYSICAL_OCCUPANCY_REMINDER
    );
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
    this.generatephysical = false;
    this.search();
  }
  ApprovependingAcceptance: boolean = false;

  INSPECTOR_REMARK: any;

  AcceptAcceptance() {
    this.ApprovependingAcceptance = true;
  }
  isSpinningReject: boolean = false;

  isSpinning: boolean = false;
  generatephysical: boolean = false;
  acceptancestep: any = 0;
  datee: any;
  AcceptAcceptancenext(data: any) {
    console.log('data11', data);

    this.acceptancestep = 1;
    var dateeeeeee: any = new Date(data.ACCEPTANCE_END_DATE_TIME);
    var datee3 = dateeeeeee.setDate(dateeeeeee.getDate() + 5);
    this.dateeeeeforremnderPH = datee3;
    this.dataAllotmentPublish.NEW_SIGNATURE_ID = data.GRAAS_SIGNATURE_ID;
    this.signature(this.dataAllotmentPublish.NEW_SIGNATURE_ID);
  }

  disabledStartDate = (current: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.datee = current;
    return current < yesterday;
  };
  disabledStartDate11 = (current: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.datee = current;
    return current < yesterday;
  };
  previousd() {
    this.acceptancestep = 0;
  }
  ApprovependingAcceptanceAccept1111(data: any) {
    if (
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == '' ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == null ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == undefined ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == 0
    ) {
      this.message.error('Please select signature', '');
    } else if (
      this.todaysdateee1 == null ||
      this.todaysdateee1 == undefined ||
      this.todaysdateee1 == ''
    ) {
      this.message.error('Please select date', '');
    } else if (
      this.dateeeeeforremnderPH == null ||
      this.dateeeeeforremnderPH == undefined ||
      this.dateeeeeforremnderPH == ''
    ) {
      this.message.error('Please select physical possession date', '');
    } else {
      this.generatephysical = true;
      const element: any = document.getElementById('Prntmodal11111forback');
      this.HTML_FOR_PHYSICAL = element.outerHTML;
    }
  }
  HTML_FOR_PHYSICAL: any;
  ApprovependingAcceptanceAccept(data: any) {
    this.isSpinning = true;
    this.api
      .pdfffffForreminder(
        this.HTML_FOR_PHYSICAL,
        this.accetrejectdata.ID,
        this.accetrejectdata.EMAIL_ID,
        this.accetrejectdata.RESIDENCE_TYPE_NAME,
        this.accetrejectdata.EMPLOYEE_NAME,
        Number(sessionStorage.getItem('userId')),
        this.accetrejectdata.INSPECTOR_REMARK,
        this.dataAllotmentPublish.NEW_SIGNATURE_ID,
        this.dataAllotmentPublish.PHYSICAL_ORDER_NO
      )
      .subscribe(
        (dataaaa) => {
          if (dataaaa.code == 200) {
            this.message.success('Physical Letter generated successfully', '');
            this.IsspinningData = false;
            this.isSpinning = false;
            this.printOrderModalVisible = false;
            this.generatephysical = false;
            this.search();
            // this.accetrejectdata.INSPECTOR_ID = sessionStorage.getItem('userId');
            // this.accetrejectdata.REMINDER_GENERATE_DATETIME = this.datepipe.transform(this.todaysdateee1, 'yyyy-MM-dd');
            // // this.accetrejectdata.PHYSICAL_END_DATETIME = this.datepipe.transform(this.dateeeeeforremnderPH, 'yyyy-MM-dd') + ' 23:59:59';
            // this.api.updatefinalAllotmentDetailsAccept(this.accetrejectdata).subscribe(
            //   (dataa) => {
            //     if (dataa.code == 200) {
            //       // this.generateALletter(data,'')

            //     } else if (dataa.code == 300) {
            //       this.message.error('Reminder letter generation time is over.', '');
            //       this.isSpinning = false;
            //     } else {
            //       this.message.error('Failed To Generate Physical Letter', '');
            //       this.isSpinning = false;
            //     }
            //   },
            //   (error) => {
            //     this.message.error('Something Went Wrong.', '');
            //     this.isSpinning = false;
            //   });
          } else {
            this.message.error('Failed To Generate Physical Letter', '');
            this.IsspinningData = false;
            this.isSpinning = false;
          }
        },
        (error) => {
          this.message.error(
            'Something Went Wrong. Please try again later.',
            ''
          );
          this.IsspinningData = false;
          this.isSpinning = false;
        }
      );
  }

  cancelApprovependingAcceptance() {
    this.ApprovependingAcceptance = false;
  }

  ViewAFss(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'acceptanceLetter/' + url;
    window.open(fileUrl);
  }
  ViewAFsssss(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }

  elementAsString: any;
  elementAsString111: any;
  IsspinningData: boolean = false;

  AllotmentPreview: boolean = false;
  isSpinningmodal: boolean = false;
  todaysdate: any;
  newdate = new Date();
  todaysyear: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth()
  );
  nextyear: any = new Date(
    this.newdate.getFullYear() + 1,
    this.newdate.getMonth()
  );
  empdata: any;
  generatePOletter(data, n) {
    this.todaysyear = this.datepipe.transform(this.todaysyear, 'yyyy');
    this.nextyear = this.datepipe.transform(this.nextyear, 'yyyy');
    this.todaysdate = this.datepipe.transform(this.todaysdate, 'dd/MM/yyyy');
    this.empdata = Object.assign({}, data);
    let senddata = {
      ...this.empdata,
      PRINT_ALLOTMENT_ORDER_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
    };
    this.IsspinningData = true;
    this.api.updatefinalAllotmentDetailsEmployee(senddata).subscribe(
      (value) => {
        if (value.code == 200) {
          this.IsspinningData = false;
          this.isSpinning = false;
        } else {
          console.error('something went wrong');
          this.IsspinningData = false;
        }
      },
      (error) => {
        console.error(error, 'something went wrong');
        this.IsspinningData = false;
      }
    );
  }

  POPreview: boolean = false;
  closemodal() {
    this.AllotmentPreview = false;
    this.POPreview = false;
    this.search();
  }

  SEND_TO_CARETAKER_END_DATE_TIME: any;
  NONACCEPTANCE_END_DATETIME: any;
  uploaddata: any;
  generateALletter(data: any, n: any) {
    this.todaysyear = this.datepipe.transform(this.todaysyear, 'yyyy');
    this.nextyear = this.datepipe.transform(this.nextyear, 'yyyy');
    this.todaysdate = this.datepipe.transform(this.todaysdate, 'dd/MM/yyyy');
    this.empdata = Object.assign({}, data);
    this.IsspinningData = true;
    let newdate = new Date();
    this.SEND_TO_CARETAKER_END_DATE_TIME = new Date(
      newdate.getFullYear(),
      newdate.getMonth(),
      newdate.getDate() + 5
    );
    this.NONACCEPTANCE_END_DATETIME = new Date(
      newdate.getFullYear(),
      newdate.getMonth(),
      newdate.getDate() + 5
    );
    this.uploaddata = Object.assign({}, data);

    this.SEND_TO_CARETAKER_END_DATE_TIME = this.datepipe.transform(
      this.SEND_TO_CARETAKER_END_DATE_TIME,
      'yyyy-MM-dd'
    );
    this.NONACCEPTANCE_END_DATETIME = this.datepipe.transform(
      this.NONACCEPTANCE_END_DATETIME,
      'yyyy-MM-dd'
    );

    this.Submituploadfiles();
  }

  Submituploadfiles() {
    let senddata = {
      ID: this.uploaddata.ID,
      SEND_TO_CARETAKER_END_DATE_TIME: this.SEND_TO_CARETAKER_END_DATE_TIME,
      NON_ACCEPTANCE_END_DATE_TIME: this.NONACCEPTANCE_END_DATETIME,
      EMP_ID: this.uploaddata.EMP_ID,
    };
    this.isSpinning = true;
    this.api.updatefinalAllotmentDetailsuploadletters(senddata).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success('Reminder letter generated successfully', '');
          this.IsspinningData = false;
          this.isSpinning = false;
          this.printOrderModalVisible = false;
          this.generatephysical = false;
          this.search();
        } else {
          this.message.error('Failed To Submit Files', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        console.error(error);
        this.message.error('Something Went Wrong...', '');
        this.isSpinning = false;
      }
    );
  }
  isRecordLoading: boolean = false;
  isRecordLoadingTA: boolean = false;
  totalRecordsTotalA = 0;
  pageIndexTotalA = 1;
  pageSizeTotalA = 10;
  sortValueTotalA: string = 'asc';
  sortKeyTotalA: string = 'ID';
  datalistForTotalA: any = [];
  isRecordLoadingAPA: boolean = false;
  totalRecordsTotalAPA = 0;
  pageIndexTotalAPA = 1;
  pageSizeTotalAPA = 10;
  sortValueTotalAPA: string = 'asc';
  sortKeyTotalAPA: string = 'ID';
  datalistForTotalAPA: any = [];
  renst: any = '';
  isRecordLoadingAPR: boolean = false;
  totalRecordsTotalAPR = 0;
  pageIndexTotalAPR = 1;
  pageSizeTotalAPR = 10;
  sortValueTotalAPR: string = 'asc';
  sortKeyTotalAPR: string = 'ID';
  datalistForTotalAPR: any = [];
  isRecordLoadingTRA: boolean = false;
  totalRecordsTotalTRA = 0;
  pageIndexTotalTRA = 1;
  pageSizeTotalTRA = 10;
  sortValueTotalTRA: string = 'asc';
  sortKeyTotalTRA: string = 'ID';
  datalistForTotalTRA: any = [];

  isRecordLoadingTANR: boolean = false;
  totalRecordsTotalTANR = 0;
  pageIndexTotalTANR = 1;
  pageSizeTotalTANR = 10;
  sortValueTotalTANR: string = 'asc';
  sortKeyTotalTANR: string = 'ID';
  datalistForTotalTANR: any = [];
  searchText: string = '';
  columnsForTA: string[][] = [
    ['DESIGNATION', 'DESIGNATION'],
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['FLAT_NAME', 'FLAT_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['CITY_NAME', 'CITY_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
  ];
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('button');
    if (element != null) element.focus();
    this.search(reset);
  }
  clickCards(data: any) {
    this.openreceiveddiv = false;
    this.openreceiveddiv1 = false;
    this.searchdata = data;
    this.searchdataMAIN = data;
    this.searchText = '';
    this.search(true);
  }
  ViewAllotmentFinalletter(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }
  clickCards3(data: any) {
    this.openreceiveddiv = true;
    this.openreceiveddiv1 = false;
    this.searchdata = data;
    this.searchdataMAIN = data;
    this.searchText = '';
    this.search(true);
  }
  clickCards4(data: any) {
    this.openreceiveddiv1 = true;
    this.openreceiveddiv = false;
    this.searchdata = data;
    this.searchText = '';
    this.search(true);
  }

  openreceiveddiv: boolean = false;
  openreceiveddiv1: boolean = false;

  clickCardsMain(d: any) {
    this.openreceiveddiv = true;
    this.openreceiveddiv1 = false;
    this.searchdata = d;
    this.searchdataMAIN = d;
    this.searchText = '';
    this.search(true);
  }

  clickCardsMain1(d: any) {
    this.openreceiveddiv1 = true;
    this.openreceiveddiv = false;
    this.searchdata = 'TREPHYA';
    this.searchdataMAIN = d;
    this.searchText = '';
    this.search(true);
  }

  TimmerstartloopRE: any = [];
  countdownInterval1mis: any = [];

  search(reset: boolean = false) {
    for (let cc = 0; cc < this.datalistForTotalTPEA.length; cc++) {
      clearInterval(this.countdownInterval1mis[cc]);
    }
    for (let cc = 0; cc < this.datalistForTotalTREPHYA.length; cc++) {
      clearInterval(this.countdownInterval1alotend[cc]);
    }
    if (this.searchdata == 'TA') {
      if (reset) {
        this.pageIndexTotalA = 1;
        this.datalistForTotalA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingTA = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalA,
          this.pageSizeTotalA,
          'ID',
          'desc',
          " AND STATUS = 'Y' AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingTA = false;
              this.totalRecordsTotalA = data['count'];
              this.datalistForTotalA = data['data'];
            } else {
              this.isRecordLoadingTA = false;
            }
          },
          (err) => {
            this.isRecordLoadingTA = false;
          }
        );
    } else if (this.searchdata == 'APA') {
      if (reset) {
        this.pageIndexTotalAPA = 1;
        this.datalistForTotalAPA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalAPA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingAPA = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalAPA,
          this.pageSizeTotalAPA,
          'ID',
          'desc',
          ' AND FINAL_ALLOTMENT_MASTER_ID = ' +
          this.mislistdata.ID +
          " AND TAKEN_STATUS ='R' AND AUTO_BARRED = 1 AND IS_ACCEPTANCE_LETTER_SUBMITED != 1 AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL)" +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingAPA = false;
              this.totalRecordsTotalAPA = data['count'];
              this.datalistForTotalAPA = data['data'];
            } else {
              this.isRecordLoadingAPA = false;
            }
          },
          (err) => {
            this.isRecordLoadingAPA = false;
          }
        );
    } else if (this.searchdata == 'PBARD') {
      if (reset) {
        this.pageIndexTotalPBARD = 1;
        this.datalistForTotalPBARD = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalPBARD.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingPBARD = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalPBARD,
          this.pageSizeTotalPBARD,
          'ID',
          'desc',
          ' AND FINAL_ALLOTMENT_MASTER_ID = ' +
          this.mislistdata.ID +
          " AND TAKEN_STATUS ='R' AND AUTO_BARRED = 1 AND IS_ACCEPTANCE_LETTER_SUBMITED = 1 AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL)" +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingPBARD = false;
              this.totalRecordsTotalPBARD = data['count'];
              this.datalistForTotalPBARD = data['data'];
            } else {
              this.isRecordLoadingPBARD = false;
            }
          },
          (err) => {
            this.isRecordLoadingPBARD = false;
          }
        );
    } else if (this.searchdata == 'APR') {
      if (reset) {
        this.pageIndexTotalAPR = 1;
        this.datalistForTotalAPR = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalAPR.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingAPR = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalAPR,
          this.pageSizeTotalAPR,
          'ID',
          'desc',
          " AND TAKEN_STATUS ='R' AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          ' AND AUTO_BARRED = 0 AND IS_ACCEPTANCE_LETTER_SUBMITED != 1 AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL)' +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingAPR = false;
              this.totalRecordsTotalAPR = data['count'];
              this.datalistForTotalAPR = data['data'];
            } else {
              this.isRecordLoadingAPR = false;
            }
          },
          (err) => {
            this.isRecordLoadingAPR = false;
          }
        );
    } else if (this.searchdata == 'PNONACC') {
      if (reset) {
        this.pageIndexTotalPNONACC = 1;
        this.datalistForTotalPNONACC = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalPNONACC.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingPNONACC = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalPNONACC,
          this.pageSizeTotalPNONACC,
          'ID',
          'desc',
          " AND TAKEN_STATUS ='R' AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          ' AND AUTO_BARRED = 0 AND IS_ACCEPTANCE_LETTER_SUBMITED = 1 AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL)' +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingPNONACC = false;
              this.totalRecordsTotalPNONACC = data['count'];
              this.datalistForTotalPNONACC = data['data'];
            } else {
              this.isRecordLoadingPNONACC = false;
            }
          },
          (err) => {
            this.isRecordLoadingPNONACC = false;
          }
        );
    } else if (this.searchdata == 'TRA') {
      if (reset) {
        this.pageIndexTotalTRA = 1;
        this.datalistForTotalTRA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalTRA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingTRA = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalTRA,
          this.pageSizeTotalTRA,
          'ID',
          'desc',
          " AND STATUS ='Y' AND TAKEN_STATUS !='R' AND IS_BARRED = 0 AND (IS_ACCEPTANCE_LETTER_SUBMITED =  0 OR NON_ACCEPTANCE_REMARK = null) AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingTRA = false;
              this.totalRecordsTotalTRA = data['count'];
              this.datalistForTotalTRA = data['data'];
            } else {
              this.isRecordLoadingTRA = false;
            }
          },
          (err) => {
            this.isRecordLoadingTRA = false;
          }
        );
    } else if (this.searchdata == 'TPHYA') {
      if (reset) {
        this.pageIndexTotalTPHYA = 1;
        this.datalistForTotalTPHYA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalTPHYA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingTPHYA = true;
      this.api
        .getFlatTakenEmployeeFinalll(
          this.pageIndexTotalTPHYA,
          this.pageSizeTotalTPHYA,
          'ID',
          'desc',
          " AND CURRENT_POSITION = 'PP' AND IS_LIVING=1 AND TAKEN_STATUS != 'R' AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL) AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.isRecordLoadingTPHYA = false;
              this.totalRecordsTotalTPHYA = data['count'];
              this.datalistForTotalTPHYA = data['data'];
            } else {
              this.loadingRecords = false;
              this.isRecordLoadingTPHYA = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isRecordLoadingTPHYA = false;
          }
        );
    } else if (this.searchdata == 'DHRAL') {
      if (reset) {
        this.pageIndexTotalDHRAL = 1;
        this.datalistForTotalDHRAL = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalDHRAL.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingDHRAL = true;
      this.api
        .getFlatTakenEmployeeFinalll(
          this.pageIndexTotalDHRAL,
          this.pageSizeTotalDHRAL,
          'ID',
          'desc',
          " AND CURRENT_POSITION = 'HR' AND TAKEN_STATUS != 'R' AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL) AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.isRecordLoadingDHRAL = false;
              this.totalRecordsTotalDHRAL = data['count'];
              this.EmployeeDHRALlist = data['data'];
            } else {
              this.loadingRecords = false;
              this.isRecordLoadingDHRAL = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isRecordLoadingDHRAL = false;
          }
        );
    } else if (
      this.searchdata == 'TPEA' ||
      this.searchdataMAIN == 'MAIN_TPEA'
    ) {
      if (reset) {
        this.pageIndexTotalTPEA = 1;
        this.datalistForTotalTPEA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalTPEA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingTPEA = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalTPEA,
          this.pageSizeTotalTPEA,
          'ID',
          'desc',
          " AND STATUS = 'Y' AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          " AND (TAKEN_STATUS != 'R' OR (TAKEN_STATUS = 'R' AND IS_ACCEPTANCE_LETTER_SUBMITED = 1)) AND IS_ACCEPTANCE_LETTER_SUBMITED = 1 AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL)" +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingTPEA = false;
              this.totalRecordsTotalTPEA = data['count'];
              this.datalistForTotalTPEA = data['data'];
              this.fetchCurrentTime();
              //MIS
              this.imis = 2;
              this.Timmerstartloopmis.length = this.datalistForTotalTPEA.length;
              this.Timmerendloopmis.length = this.datalistForTotalTPEA.length;

              let timeremainingmis: any = [];
              let timeremaining2mis: any = [];
              timeremainingmis.length = this.datalistForTotalTPEA.length;
              timeremaining2mis.length = this.datalistForTotalTPEA.length;

              for (let cc = 0; cc < this.datalistForTotalTPEA.length; cc++) {
                let sapandatemis =
                  this.datalistForTotalTPEA[cc]['ACCEPTANCE_END_DATE_TIME'];

                let targetDatemis = new Date(sapandatemis);
                clearInterval(this.countdownInterval1mis[cc]);

                this.countdownInterval1mis[cc] = setInterval(() => {
                  const currentDatemis = new Date(this.currentTimeformis);
                  timeremaining2mis[cc] =
                    targetDatemis.getTime() - currentDatemis.getTime();

                  const secondsmis = Math.floor(timeremaining2mis[cc] / 1000);
                  const minutesmis = Math.floor(secondsmis / 60);
                  const hoursmis = Math.floor(minutesmis / 60);
                  const daysmis = Math.floor(hoursmis / 24);
                  this.Timmerendloopmis[cc] =
                    (daysmis % 24) +
                    ' Day : ' +
                    (hoursmis % 24) +
                    ' Hrs : ' +
                    (minutesmis % 60) +
                    ' Min : ' +
                    (secondsmis % 60) +
                    ' Sec';
                  if (timeremaining2mis[cc] <= 0) {
                    this.countdowndisablemis = false;
                    clearInterval(this.countdownInterval1mis[cc]);
                    this.imis = 2;
                    this.Timmerendloopmis[cc] = '';
                    timeremaining2mis[cc] = 0;
                  }
                  this.currentTimeformis.setSeconds(
                    this.currentTimeformis.getSeconds() + 1
                  );
                }, 1000);
              }
            } else {
              this.isRecordLoadingTPEA = false;
              this.totalRecordsTotalTPEA = 0;
              this.datalistForTotalTPEA = [];
            }
          },
          (err) => {
            this.isRecordLoadingTPEA = false;
            this.totalRecordsTotalTPEA = 0;
            this.datalistForTotalTPEA = [];
          }
        );
    } else if (this.searchdata == 'REMINDER') {
      if (reset) {
        this.pageIndexTotalREMINDER = 1;
        this.datalistForTotalREMINDER = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalREMINDER.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingREMINDER = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalREMINDER,
          this.pageSizeTotalREMINDER,
          'ID',
          'desc',
          " AND CURRENT_POSITION = 'PR' AND TAKEN_STATUS != 'R' AND (IS_APPLIEND_FOR_RENOVATION != 1 OR IS_APPLIEND_FOR_RENOVATION IS NULL) AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingREMINDER = false;
              this.totalRecordsTotalREMINDER = data['count'];
              this.datalistForTotalREMINDER = data['data'];
            } else {
              this.isRecordLoadingREMINDER = false;
            }
          },
          (err) => {
            this.isRecordLoadingREMINDER = false;
          }
        );
    } else if (this.searchdata == 'TREPHYA') {
      if (reset) {
        this.pageIndexTotalTREPHYA = 1;
        this.datalistForTotalTREPHYA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalTREPHYA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingTREPHYA = true;
      this.api
        .getFlatTakenEmployeeFinalll(
          this.pageIndexTotalTREPHYA,
          this.pageSizeTotalTREPHYA,
          'ID',
          'desc',
          ' AND IS_APPLIEND_FOR_RENOVATION = 1 AND FINAL_ALLOTMENT_MASTER_ID = ' +
          this.mislistdata.ID
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.isRecordLoadingTREPHYA = false;
              this.totalRecordsTotalTREPHYA = data['count'];
              this.datalistForTotalTREPHYA = data['data'];
              for (let oo = 0; oo < this.datalistForTotalTREPHYA.length; oo++) {
                if (
                  this.datalistForTotalTREPHYA[oo].STEP_NO > 4 &&
                  this.datalistForTotalTREPHYA[oo]['PHYSICAL_END_DATETIME'] !=
                  null
                ) {
                  this.iiiiphend = 2;
                  this.Timmerendloopphend.length =
                    this.datalistForTotalTREPHYA.length;

                  let timeremaining2pend: any = [];
                  timeremaining2pend.length =
                    this.datalistForTotalTREPHYA.length;

                  for (
                    let cc = 0;
                    cc < this.datalistForTotalTREPHYA.length;
                    cc++
                  ) {
                    let sapandate =
                      this.datalistForTotalTREPHYA[cc]['PHYSICAL_END_DATETIME'];
                    let targetDate = new Date(sapandate);
                    clearInterval(this.countdownInterval1alotend[cc]);

                    this.countdownInterval1alotend[cc] = setInterval(() => {
                      const currentDate = new Date(this.currentTimefoeph);
                      timeremaining2pend[cc] =
                        targetDate.getTime() - currentDate.getTime();

                      const seconds = Math.floor(timeremaining2pend[cc] / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
                      this.Timmerendloopphend[cc] =
                        (days % 24) +
                        ' Day : ' +
                        (hours % 24) +
                        ' Hrs : ' +
                        (minutes % 60) +
                        ' Min : ' +
                        (seconds % 60) +
                        ' Sec';
                      if (timeremaining2pend[cc] <= 0) {
                        this.countdowndisablephend = false;
                        clearInterval(this.countdownInterval1alotend[cc]);
                        this.iiiiphend = 2;
                        this.Timmerendloopphend[cc] = '';
                        timeremaining2pend[cc] = 0;
                      }
                      this.currentTimefoeph.setSeconds(
                        this.currentTimefoeph.getSeconds() + 1
                      );
                    }, 1000);
                  }
                }
              }
            } else {
              this.loadingRecords = false;
              this.isRecordLoadingTREPHYA = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isRecordLoadingTREPHYA = false;
          }
        );
    } else if (this.searchdata == 'RREMINDER') {
      if (reset) {
        this.pageIndexTotalRREMINDER = 1;
        this.datalistForTotalRREMINDER = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalRREMINDER.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingRREMINDER = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalRREMINDER,
          this.pageSizeTotalRREMINDER,
          'ID',
          'desc',
          " AND CURRENT_POSITION = 'PR' AND TAKEN_STATUS != 'R' AND IS_APPLIEND_FOR_RENOVATION = 1 AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingRREMINDER = false;
              this.totalRecordsTotalRREMINDER = data['count'];
              this.datalistForTotalRREMINDER = data['data'];
            } else {
              this.isRecordLoadingRREMINDER = false;
            }
          },
          (err) => {
            this.isRecordLoadingRREMINDER = false;
          }
        );
    } else if (this.searchdata == 'RTPHYA') {
      if (reset) {
        this.pageIndexTotalRTPHYA = 1;
        this.datalistForTotalRTPHYA = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalRTPHYA.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingRTPHYA = true;
      this.api
        .getFlatTakenEmployeeFinalll(
          this.pageIndexTotalRTPHYA,
          this.pageSizeTotalRTPHYA,
          'ID',
          'desc',
          " AND CURRENT_POSITION = 'PP' AND IS_LIVING=1 AND TAKEN_STATUS != 'R' AND IS_APPLIEND_FOR_RENOVATION = 1 AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.isRecordLoadingRTPHYA = false;
              this.totalRecordsTotalRTPHYA = data['count'];
              this.datalistForTotalRTPHYA = data['data'];
            } else {
              this.loadingRecords = false;
              this.isRecordLoadingRTPHYA = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isRecordLoadingRTPHYA = false;
          }
        );
    } else if (this.searchdata == 'RDHRAL') {
      if (reset) {
        this.pageIndexTotalRDHRAL = 1;
        this.datalistForTotalRDHRAL = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalRDHRAL.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingRDHRAL = true;
      this.api
        .getFlatTakenEmployeeFinalll(
          this.pageIndexTotalRDHRAL,
          this.pageSizeTotalRDHRAL,
          'ID',
          'desc',
          " AND CURRENT_POSITION = 'HR' AND TAKEN_STATUS != 'R' AND IS_APPLIEND_FOR_RENOVATION = 1 AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.isRecordLoadingRDHRAL = false;
              this.totalRecordsTotalRDHRAL = data['count'];
              this.EmployeeRDHRALlist = data['data'];
            } else {
              this.loadingRecords = false;
              this.isRecordLoadingRDHRAL = false;
            }
          },
          (err) => {
            this.loadingRecords = false;
            this.isRecordLoadingRDHRAL = false;
          }
        );
    } else if (this.searchdata == 'RPNONACC') {
      if (reset) {
        this.pageIndexTotalRPNONACC = 1;
        this.datalistForTotalRPNONACC = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalRPNONACC.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingRPNONACC = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalRPNONACC,
          this.pageSizeTotalRPNONACC,
          'ID',
          'desc',
          " AND TAKEN_STATUS ='R' AND FINAL_ALLOTMENT_MASTER_ID = " +
          this.mislistdata.ID +
          ' AND AUTO_BARRED = 0 AND IS_ACCEPTANCE_LETTER_SUBMITED = 1 AND IS_APPLIEND_FOR_RENOVATION = 1' +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingRPNONACC = false;
              this.totalRecordsTotalRPNONACC = data['count'];
              this.datalistForTotalRPNONACC = data['data'];
            } else {
              this.isRecordLoadingRPNONACC = false;
            }
          },
          (err) => {
            this.isRecordLoadingRPNONACC = false;
          }
        );
    } else if (this.searchdata == 'RPBARD') {
      if (reset) {
        this.pageIndexTotalRPBARD = 1;
        this.datalistForTotalRPBARD = [];
      }

      var sort: string;

      try {
        sort = this.sortValueTotalRPBARD.startsWith('a') ? 'asc' : 'desc';
      } catch (error) {
        sort = '';
      }

      var likeQuery = '';

      if (this.searchText != '') {
        likeQuery = ' AND (';

        this.columnsForTA.forEach((column, i) => {
          if (this.columnsForTA.length == i + 1) {
            likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
          } else {
            likeQuery +=
              ' ' + column[0] + " like '%" + this.searchText + "%' OR";
          }
        });
      }
      this.isRecordLoadingRPBARD = true;
      this.api
        .getFlatTakenEmployeeList111(
          this.pageIndexTotalRPBARD,
          this.pageSizeTotalRPBARD,
          'ID',
          'desc',
          ' AND FINAL_ALLOTMENT_MASTER_ID = ' +
          this.mislistdata.ID +
          " AND TAKEN_STATUS ='R' AND AUTO_BARRED = 1 AND IS_ACCEPTANCE_LETTER_SUBMITED = 1 AND IS_APPLIEND_FOR_RENOVATION = 1" +
          likeQuery
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.isRecordLoadingRPBARD = false;
              this.totalRecordsTotalRPBARD = data['count'];
              this.datalistForTotalRPBARD = data['data'];
            } else {
              this.isRecordLoadingRPBARD = false;
            }
          },
          (err) => {
            this.isRecordLoadingRPBARD = false;
          }
        );
    }

    this.api
      .getFinalAllotmentDatalist11(
        0,
        0,
        '',
        'desc',
        ' AND ID = ' + this.mislistdata.ID
      )
      .subscribe(
        (data) => {
          this.mislistdata = data['data'][0];
        },
        (err) => { }
      );
  }

  sortTotalA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalA = pageIndex;
    this.pageSizeTotalA = pageSize;

    if (this.pageSizeTotalA != pageSize) {
      this.pageIndexTotalA = 1;
      this.pageSizeTotalA = pageSize;
    }

    if (this.sortKeyTotalA != sortField) {
      this.pageIndexTotalA = 1;
      this.pageSizeTotalA = pageSize;
    }

    this.sortKeyTotalA = sortField;
    this.sortValueTotalA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  sortTotalAPA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalAPA = pageIndex;
    this.pageSizeTotalAPA = pageSize;

    if (this.pageSizeTotalAPA != pageSize) {
      this.pageIndexTotalAPA = 1;
      this.pageSizeTotalAPA = pageSize;
    }

    if (this.sortKeyTotalAPA != sortField) {
      this.pageIndexTotalAPA = 1;
      this.pageSizeTotalAPA = pageSize;
    }

    this.sortKeyTotalAPA = sortField;
    this.sortValueTotalAPA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  sortTotalAPR(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalAPR = pageIndex;
    this.pageSizeTotalAPR = pageSize;

    if (this.pageSizeTotalAPR != pageSize) {
      this.pageIndexTotalAPR = 1;
      this.pageSizeTotalAPR = pageSize;
    }

    if (this.sortKeyTotalAPR != sortField) {
      this.pageIndexTotalAPR = 1;
      this.pageSizeTotalAPR = pageSize;
    }

    this.sortKeyTotalAPR = sortField;
    this.sortValueTotalAPR = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  sortTotalTRA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalTRA = pageIndex;
    this.pageSizeTotalTRA = pageSize;

    if (this.pageSizeTotalTRA != pageSize) {
      this.pageIndexTotalTRA = 1;
      this.pageSizeTotalTRA = pageSize;
    }

    if (this.sortKeyTotalTRA != sortField) {
      this.pageIndexTotalTRA = 1;
      this.pageSizeTotalTRA = pageSize;
    }

    this.sortKeyTotalTRA = sortField;
    this.sortValueTotalTRA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  sortTotalTANR(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalTANR = pageIndex;
    this.pageSizeTotalTANR = pageSize;

    if (this.pageSizeTotalTANR != pageSize) {
      this.pageIndexTotalTANR = 1;
      this.pageSizeTotalTANR = pageSize;
    }

    if (this.sortKeyTotalTANR != sortField) {
      this.pageIndexTotalTANR = 1;
      this.pageSizeTotalTANR = pageSize;
    }

    this.sortKeyTotalTANR = sortField;
    this.sortValueTotalTANR = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  sortTotalTPHYA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalTPHYA = pageIndex;
    this.pageSizeTotalTPHYA = pageSize;

    if (this.pageSizeTotalTPHYA != pageSize) {
      this.pageIndexTotalTPHYA = 1;
      this.pageSizeTotalTPHYA = pageSize;
    }

    if (this.sortKeyTotalTPHYA != sortField) {
      this.pageIndexTotalTPHYA = 1;
      this.pageSizeTotalTPHYA = pageSize;
    }

    this.sortKeyTotalTPHYA = sortField;
    this.sortValueTotalTPHYA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }
  residencetypeshow: any;
  showPhysicalTechnical = false;
  filterqueryshow: any = '';

  totalRecordsTotalTPHYA = 0;
  pageIndexTotalTPHYA = 1;
  pageSizeTotalTPHYA = 10;
  isRecordLoadingTPHYA: boolean = false;
  sortValueTotalTPHYA: string = 'asc';
  sortKeyTotalTPHYA: string = 'ID';
  datalistForTotalTPHYA: any = [];
  ViewcaretakerAcceptance(data: any, filter: any) {
    this.residencetypeshow = data;
    this.filterqueryshow = filter;
    this.datalistForTotalTPHYA = [];
    this.showPhysicalTechnical = true;
    this.isRecordLoadingTPHYA = true;
    this.isRecordLoading = true;
    this.api
      .getFlatTakenEmployeeFinalll(
        0,
        0,
        'ID',
        'desc',
        " AND (IS_PHYSICALLY_FLAT_AVAILABLE = '1' OR OCCUPANCY_TYPE = 'P') AND DRAFT_ALLOTMENT_MASTER_ID = " +
        this.misdata.DRAFT_ALLOTMENT_ID +
        ' AND IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1'
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoadingTPHYA = false;
            this.totalRecordsTotalTPHYA = data['count'];
            this.datalistForTotalTPHYA = data['data'];
          } else {
            this.loadingRecords = false;
            this.isRecordLoadingTPHYA = false;
          }
        },
        (err) => {
          this.loadingRecords = false;
          this.isRecordLoadingTPHYA = false;
        }
      );
  }

  tecoccy: any;
  viewtechnicaldetailsoccupancy(data: any) {
    this.TechnicalModal22 = true;
    this.tecoccy = Object.assign({}, data);
  }

  TechnicalModal22 = false;
  CancelTechnicalModal22() {
    this.TechnicalModal22 = false;
    this.getViewcaretakerAcceptance();
  }
  occupancydata: any;
  Rejectoccupancydata: any;
  viewPdfSafe12: any;
  view11: any;
  VisibleOccupancyLetter = false;
  Viewoccupancyformletter(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'physicalOccupancyLetter/' + url;
    window.open(fileUrl);
  }
  Viewoccupancyformletter111(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'physicalOccupancyReminder/' + url;
    window.open(fileUrl);
  }
  viewhra(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'stopHRA/' + url;
    window.open(fileUrl);
  }
  getdateee(event: any) {
    var remainingDays = 0;
    var targetDate = new Date(event);
    var currentDate = new Date();
    const differenceMilliseconds = targetDate.getTime() - currentDate.getTime();
    remainingDays = Math.ceil(differenceMilliseconds / (1000 * 60 * 60 * 24));
    return remainingDays;
  }
  ViewPhysicaloccletter(emplist: any, pdfUrl: string) {
    this.occupancydata = Object.assign({}, emplist);
    this.Rejectoccupancydata = Object.assign({}, emplist);
    this.viewPdfSafe12 = '';
    this.view11 = 1;
    this.VisibleOccupancyLetter = true;
    this.viewPdfSafe12 = this.getS11(pdfUrl);
  }
  Rejectaccupancyremark = false;
  RejectOccupancyLetter() {
    this.REJECT_OCCUPANCY_REMARK = '';
    this.Rejectaccupancyremark = true;
  }

  REJECT_OCCUPANCY_REMARK: any = '';
  Rejectaccupancymodal() {
    this.Rejectaccupancyremark = false;
  }
  isSpinningAccept = false;

  ApproveOccupancyLetter() {
    this.OccupancyConfirm = true;
  }
  Rejectoccuancyconfirm() {
    if (
      this.REJECT_OCCUPANCY_REMARK == null ||
      this.REJECT_OCCUPANCY_REMARK == undefined ||
      this.REJECT_OCCUPANCY_REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      let datasend = {
        ...this.Rejectoccupancydata,
        INSPECTOR_FINAL_ACTION_DATE_TIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        INSPECTOR_FINAL_STATUS: 'R',
        INSPECTOR_FINAL_REMARK: this.REJECT_OCCUPANCY_REMARK,
        IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED: 0,
        PHYSICAL_OCCUPANCY_LETTER: null,
      };
      this.isSpinning = true;
      this.isSpinningReject = true;
      this.api.RejectPhysicalOccupancyRequest(datasend).subscribe(
        (data) => {
          if (data.code == 200) {
            this.message.success(
              'Physical Possession Rejected Successfully',
              ''
            );
            this.isSpinning = false;
            this.isSpinningReject = false;
            this.Rejectaccupancymodal();
            this.VisibleOccupancyLetterContentCancel();
          } else {
            this.message.error('Failed To Reject Physical Possession', '');
            this.isSpinning = false;
            this.isSpinningReject = false;
          }
        },
        (error) => {
          this.message.error('Failed To Reject Physical Possession', '');
          this.isSpinning = false;
          this.isSpinningReject = false;
        }
      );
    }
  }

  OccupancyConfirm = false;
  CancelOccupancyConfirm() {
    this.OccupancyConfirm = false;
  }

  Occupancyconfimok() {
    let datasend = {
      ...this.occupancydata,
      INSPECTOR_FINAL_ACTION_DATE_TIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
      IS_LIVING: '1',
      INSPECTOR_FINAL_STATUS: 'A',
    };
    this.isSpinning = true;
    this.api.UpdateIsInspectorApproved(datasend).subscribe(
      (data) => {
        if (data.code == 200) {
          this.message.success('Physical Possession Approved Successfully', '');
          this.isSpinning = false;
          this.VisibleOccupancyLetterContentCancel();
          this.CancelOccupancyConfirm();
        } else if (data.code == 300) {
          this.message.error('Acceptaance Time is Over', '');
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Approve Physical Possession', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Approve Physical Possession', '');
        this.isSpinning = false;
      }
    );
  }
  VisibleOccupancyLetterContentCancel() {
    this.getViewcaretakerAcceptance();
    this.VisibleOccupancyLetter = false;
  }
  sanitizedLink1: any = '';
  getS11(link: string) {
    this.sanitizedLink1 = '';
    if (this.view11 == 1) {
      var a: any = this.api.retriveimgUrl + 'physicalOccupancyLetter/' + link;
    }

    this.sanitizedLink1 = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink1;
  }
  getViewcaretakerAcceptance() {
    this.showPhysicalTechnical = true;
    this.isRecordLoadingTPHYA = true;
    this.api
      .getFlatTakenEmployeeFinalll(
        0,
        0,
        'ID',
        'desc',
        " AND (IS_PHYSICALLY_FLAT_AVAILABLE = '1' OR OCCUPANCY_TYPE = 'P') AND DRAFT_ALLOTMENT_MASTER_ID = " +
        this.misdata.DRAFT_ALLOTMENT_ID +
        ' AND IS_PHYSICAL_OCCUPANCY_LETTER_SIGNED = 1'
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            this.loadingRecords = false;
            this.isRecordLoadingTPHYA = false;
            this.totalRecordsTotalTPHYA = data['count'];
            this.datalistForTotalTPHYA = data['data'];
          } else {
            this.isRecordLoadingTPHYA = false;
          }
        },
        (err) => {
          this.isRecordLoadingTPHYA = false;
        }
      );
  }

  getdata() {
    this.loadingRecords = true;

    this.api
      .getFinalAllotmentDatalist11(
        0,
        0,
        '',
        'desc',
        ' AND ID = ' + this.mislistdata.ID
      )
      .subscribe(
        (data) => {
          this.mislistdata = data['data'][0];
          this.POPreview = false;
          this.AllotmentPreview = false;
          this.search();
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
  }

  getdatacancel() {
    this.POPreview = false;
    this.search();
  }

  totalRecordsTotalTREPHYA = 0;
  pageIndexTotalTREPHYA = 1;
  pageSizeTotalTREPHYA = 10;
  isRecordLoadingTREPHYA: boolean = false;
  sortValueTotalTREPHYA: string = 'asc';
  sortKeyTotalTREPHYA: string = 'ID';
  datalistForTotalTREPHYA: any = [];
  iiiiphend: any;
  Timmerendloopphend: any = [];
  Timmerstartloopphend: any = [];
  currentTimefoeph: Date = new Date();
  countdownInterval1alotend: any = [];

  sortTotalTREPHYA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalTREPHYA = pageIndex;
    this.pageSizeTotalTREPHYA = pageSize;

    if (this.pageSizeTotalTREPHYA != pageSize) {
      this.pageIndexTotalTREPHYA = 1;
      this.pageSizeTotalTREPHYA = pageSize;
    }

    if (this.sortKeyTotalTREPHYA != sortField) {
      this.pageIndexTotalTREPHYA = 1;
      this.pageSizeTotalTREPHYA = pageSize;
    }

    this.sortKeyTotalTREPHYA = sortField;
    this.sortValueTotalTREPHYA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }
  renovationdata: any;
  renovationdatad: any;
  key: any = '';
  renovationdata1: any;
  key1: any = '';
  RENOVATION_REMARK: any = '';
  renovationshow: boolean = false;
  RENOVATION_REMARK1: any = '';
  renovationshow1: boolean = false;
  approverenovation(data: any, key: any) {
    this.key = key;
    this.renovationdatad = data;
    this.renst = '';
    this.renovationshow = true;
  }
  rejectrenovation() {
    if (
      this.renovationdatad.RENOVATION_REJECTION_REMARK == '' ||
      this.renovationdatad.RENOVATION_REJECTION_REMARK == null ||
      this.renovationdatad.RENOVATION_REJECTION_REMARK == undefined
    ) {
      this.message.error('Please Enter the Rejection Remark', '');
    } else {
      this.isSpinningrenovation = true;
      this.renovationdatad.RENOVATION_APPROVED_DATETIME =
        this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.renovationdatad.RENOVATION_STATUS = 'R';
      var dateeeeeee = new Date();
      var datee3: any = dateeeeeee.setDate(dateeeeeee.getDate() + 3);
      datee3 = this.datepipe.transform(dateeeeeee, 'yyyy-MM-dd');
      this.renovationdatad.PHYSICAL_END_DATETIME = datee3 + ' 23:59:59';
      this.renovationdatad.IS_RENOVATION_RECEIVED = false;
      this.renovationdatad.IS_RENOVATION = 0;
      this.api
        .UpdateEmployeeDataflatfinalrenovation(this.renovationdatad)
        .subscribe(
          (value) => {
            if (value.code == 200) {
              this.message.success(
                'Renovation Request Rejected Successfully',
                ''
              );
              this.renovationshow = false;
              this.isSpinningrenovation = false;
              this.search();
            } else {
              this.message.error('Failed to reject renovation request', '');
              this.isSpinningrenovation = false;
            }
          },
          (error) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinningrenovation = false;
          }
        );
    }
  }
  isSpinningrenovation: boolean = false;
  approverrenovation() {
    this.renovationdatad.RENOVATION_STATUS = 'A';
    this.renovationdatad.PHYSICAL_END_DATETIME = '';
    this.renovationdatad.RENOVATION_APPROVED_DATETIME = new Date();
    this.renovationdatad.RENOVATION_APPROVED_DATETIME = this.datepipe.transform(
      this.renovationdatad.RENOVATION_APPROVED_DATETIME,
      'yyyy-MM-dd HH:mm:ss'
    );
    this.renovationdatad.IS_RENOVATION_RECEIVED = true;
    this.isSpinningrenovation = true;
    this.api
      .UpdateEmployeeDataflatfinalrenovation(this.renovationdatad)
      .subscribe(
        (value) => {
          if (value.code == 200) {
            this.message.success(
              'Renovation Request Approved Successfully',
              ''
            );
            this.renovationshow = false;
            this.isSpinningrenovation = false;
            this.search();
          } else {
            this.message.error('Failed to approve renovation request', '');
            this.isSpinningrenovation = false;
          }
        },
        (error) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinningrenovation = false;
        }
      );
  }
  cancelrenovation() {
    this.renovationshow = false;
    this.search();
  }
  NEW_SIGNATURE_ID: any;
  generatephy(data: any) {
    this.renst = '';
    this.empdata = data;
    this.POPreview = true;
    this.todaysyear = this.datepipe.transform(this.todaysyear, 'yyyy');
    this.nextyear = this.datepipe.transform(this.nextyear, 'yyyy');
    this.todaysdate = this.datepipe.transform(this.todaysdate, 'dd/MM/yyyy');
    var dateeeeeee: any = new Date();
    var datee3 = dateeeeeee.setDate(dateeeeeee.getDate() + 2);
    this.dateeeeeforremnder = datee3;
    if (data !== undefined && data !== null && data !== '') {
      var f: any = this.Signaturearray.filter((item) => item.ID == data);
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
    }
  }

  todaysdateee: any = new Date();
  todaysdateee1: any = new Date();
  dateeeeeforremnderPH: any;

  generaterenovationphysicalreminder() {
    if (
      this.NEW_SIGNATURE_ID == '' ||
      this.NEW_SIGNATURE_ID == null ||
      this.NEW_SIGNATURE_ID == undefined ||
      this.NEW_SIGNATURE_ID == 0
    ) {
      this.message.error('Please select signature', '');
    } else if (
      this.todaysdateee == null ||
      this.todaysdateee == undefined ||
      this.todaysdateee == ''
    ) {
      this.message.error('Please Select Date', '');
    } else if (
      this.dateeeeeforremnder == null ||
      this.dateeeeeforremnder == undefined ||
      this.dateeeeeforremnder == ''
    ) {
      this.message.error('Please Select Physical Possession Date', '');
    } else {
      this.IsspinningData = true;
      const element: any = document.getElementById('Prntmodal111bbb');
      this.elementAsString = element.outerHTML;

      this.api
        .physicallatterupload111(
          this.elementAsString,
          this.empdata.ID,
          this.datepipe.transform(
            this.dateeeeeforremnder,
            'yyyy/MM/dd HH:mm:ss'
          ),
          this.empdata.FINAL_ALLOTMENT_DETAILS_ID,
          0,
          this.NEW_SIGNATURE_ID,
          this.dataAllotmentPublish.PHYSICAL_ORDER_NO
        )
        .subscribe((data) => {
          if (data.code == 200) {
            this.message.success(
              'Physical Letter Letter Generated Successfully',
              ''
            );
            this.POPreview = false;
            this.IsspinningData = false;
            this.isSpinning = false;
            this.search();
          } else {
            this.IsspinningData = false;
            this.isSpinning = false;
          }
        });
    }
  }

  Viewoccupancyformletter1(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'renovationAttachments/' + url;
    window.open(fileUrl);
  }

  POPreview111111111: boolean = false;
  showstophra = false;
  showstophratitle = 'Generate HRA Deduction Letter';
  stophradata: any;
  generatestophra(data: any) {
    this.showstophra = true;
    this.stophradata = data;
    this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID = data.HRA_SIGNATURE_ID;
    if (
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID !== undefined &&
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID !== null &&
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID !== ''
    ) {
      var f = this.Signaturearray.filter(
        (item) => item.ID == this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID
      );
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID = null;
    }
    this.ddoOfTheOfficialList();
  }
  stophracancel() {
    this.showstophra = false;
    this.search();
  }

  generatestophrafinal(data) {
    if (
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID == '' ||
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID == null ||
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID == undefined ||
      this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID == 0
    ) {
      this.message.error('Please select signature', '');
    } else if (
      this.dataAllotmentPublishHRA.HRA_ORDER_NO == '' ||
      this.dataAllotmentPublishHRA.HRA_ORDER_NO == null ||
      this.dataAllotmentPublishHRA.HRA_ORDER_NO == undefined
    ) {
      this.message.error('Please Enter HRA Deduction Letter Order Number', '');
    } else if (
      this.todaysdatelatter == null ||
      this.todaysdatelatter == undefined ||
      this.todaysdatelatter == ''
    ) {
      this.message.error('Please Select Letter Date', '');
    } else if (
      this.stophradata.DDO_ID == null ||
      this.stophradata.DDO_ID == undefined ||
      this.stophradata.DDO_ID == ''
    ) {
      this.message.error('Please Select Correct DDO Of The Official', '');
    } else if (
      this.stophradata.WATER_CHARGES == null ||
      this.stophradata.WATER_CHARGES == undefined ||
      this.stophradata.WATER_CHARGES == ''
    ) {
      this.message.error('Please Enter Water Charges', '');
    } else if (
      this.stophradata.LICENSE_FEES == null ||
      this.stophradata.LICENSE_FEES == undefined ||
      this.stophradata.LICENSE_FEES == ''
    ) {
      this.message.error('Please Enter License Fees', '');
    } else if (
      this.wefdate == null ||
      this.wefdate == undefined ||
      this.wefdate == ''
    ) {
      this.message.error('Please Select w.e.f Date', '');
    } else {
      this.isSpinning = true;
      const element: any = document.getElementById('stophraprint');
      this.elementAsString = element.outerHTML;
      var senddata = {
        ID: this.stophradata.ID,
        FINAL_ALLOTMENT_DETAILS_ID: this.stophradata.FINAL_ALLOTMENT_DETAILS_ID,
        HRA_GENERATED_DATE: this.datepipe.transform(new Date(), 'yyyy-MM-dd'),
        DDO_ID: this.stophradata.DDO_ID,
        DDO_EMAIL_ID: this.DDO_EMAIL_ID,
        WATER_CHARGES: this.stophradata.WATER_CHARGES,
        LICENSE_FEES: this.stophradata.LICENSE_FEES,
        htmlContent: this.elementAsString,
        HRA_SIGNATURE_ID: this.dataAllotmentPublishHRA.HRA_SIGNATURE_ID,
        HRA_ORDER_NO: this.dataAllotmentPublishHRA.HRA_ORDER_NO,
      };
      this.api.stophralatter(senddata).subscribe(
        (data) => {
          if (data.code == 200) {
            this.message.success(
              'Deduction HRA Letter Generated Successfully',
              ''
            );
            this.showstophra = false;
            this.isSpinning = false;
            this.search();
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }
  isSpinningddo = false;

  ddoOfTheOfficialDataList: any = [];
  ddoOfTheOfficialList() {
    this.isSpinningddo = true;
    this.api.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            this.ddoOfTheOfficialDataList = data['data'];
          } else {
            this.ddoOfTheOfficialDataList = [];
          }
          this.isSpinningddo = false;
        } else {
          this.ddoOfTheOfficialDataList = [];
          this.isSpinningddo = false;
        }
      },
      (err) => {
        this.ddoOfTheOfficialDataList = [];
        this.isSpinningddo = false;
      }
    );
  }
  DDONAME = '';
  DDO_EMAIL_ID: any = '';
  getddoname(event: any) {
    this.DDONAME = this.ddoOfTheOfficialDataList.filter(
      (x) => x.ID == event
    )[0].HEAD_OF_OFFICE;
    this.DDO_EMAIL_ID = this.ddoOfTheOfficialDataList.filter(
      (x) => x.ID == event
    )[0].DDO_EMAIL_ID;
  }
  todaydate = new Date();

  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }
    return false;
  }

  printOrderModalCancel11() {
    this.generatephysical = false;
  }

  todaysdatelatter: any = new Date();
  wefdate: any = new Date();
  isRecordLoadingREMINDER: boolean = false;
  totalRecordsTotalREMINDER = 0;
  pageIndexTotalREMINDER = 1;
  pageSizeTotalREMINDER = 10;
  sortValueTotalREMINDER: string = 'asc';
  sortKeyTotalREMINDER: string = 'ID';
  datalistForTotalREMINDER: any = [];
  EmployeeReminderlist: any = [];
  sortTotalREMINDER(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalREMINDER = pageIndex;
    this.pageSizeTotalREMINDER = pageSize;

    if (this.pageSizeTotalREMINDER != pageSize) {
      this.pageIndexTotalREMINDER = 1;
      this.pageSizeTotalREMINDER = pageSize;
    }

    if (this.sortKeyTotalREMINDER != sortField) {
      this.pageIndexTotalREMINDER = 1;
      this.pageSizeTotalREMINDER = pageSize;
    }

    this.sortKeyTotalREMINDER = sortField;
    this.sortValueTotalREMINDER = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  isRecordLoadingDHRAL: boolean = false;
  totalRecordsTotalDHRAL = 0;
  pageIndexTotalDHRAL = 1;
  pageSizeTotalDHRAL = 10;
  sortValueTotalDHRAL: string = 'asc';
  sortKeyTotalDHRAL: string = 'ID';
  datalistForTotalDHRAL: any = [];
  EmployeeDHRALlist: any = [];
  sortTotalDHRAL(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalDHRAL = pageIndex;
    this.pageSizeTotalDHRAL = pageSize;

    if (this.pageSizeTotalDHRAL != pageSize) {
      this.pageIndexTotalDHRAL = 1;
      this.pageSizeTotalDHRAL = pageSize;
    }

    if (this.sortKeyTotalDHRAL != sortField) {
      this.pageIndexTotalDHRAL = 1;
      this.pageSizeTotalDHRAL = pageSize;
    }

    this.sortKeyTotalREMINDER = sortField;
    this.sortValueTotalREMINDER = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  isRecordLoadingPNONACC: boolean = false;
  totalRecordsTotalPNONACC = 0;
  pageIndexTotalPNONACC = 1;
  pageSizeTotalPNONACC = 10;
  sortValueTotalPNONACC: string = 'asc';
  sortKeyTotalPNONACC: string = 'ID';
  datalistForTotalPNONACC: any = [];
  EmployeePNONACClist: any = [];
  sortTotalPNONACC(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalPNONACC = pageIndex;
    this.pageSizeTotalPNONACC = pageSize;

    if (this.pageSizeTotalPNONACC != pageSize) {
      this.pageIndexTotalPNONACC = 1;
      this.pageSizeTotalPNONACC = pageSize;
    }

    if (this.sortKeyTotalPNONACC != sortField) {
      this.pageIndexTotalPNONACC = 1;
      this.pageSizeTotalPNONACC = pageSize;
    }

    this.sortKeyTotalPNONACC = sortField;
    this.sortValueTotalPNONACC = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  isRecordLoadingPBARD: boolean = false;
  totalRecordsTotalPBARD = 0;
  pageIndexTotalPBARD = 1;
  pageSizeTotalPBARD = 10;
  sortValueTotalPBARD: string = 'asc';
  sortKeyTotalPBARD: string = 'ID';
  datalistForTotalPBARD: any = [];
  EmployeePBARDlist: any = [];
  sortTotalPBARD(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalPBARD = pageIndex;
    this.pageSizeTotalPBARD = pageSize;

    if (this.pageSizeTotalPBARD != pageSize) {
      this.pageIndexTotalPBARD = 1;
      this.pageSizeTotalPBARD = pageSize;
    }

    if (this.sortKeyTotalPBARD != sortField) {
      this.pageIndexTotalPBARD = 1;
      this.pageSizeTotalPBARD = pageSize;
    }

    this.sortKeyTotalPBARD = sortField;
    this.sortValueTotalPBARD = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  isRecordLoadingTPEA: boolean = false;
  totalRecordsTotalTPEA = 0;
  pageIndexTotalTPEA = 1;
  pageSizeTotalTPEA = 10;
  sortValueTotalTPEA: string = 'asc';
  sortKeyTotalTPEA: string = 'ID';
  datalistForTotalTPEA: any = [];
  EmployeeTPEAlist: any = [];
  sortTotalTPEA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalTPEA = pageIndex;
    this.pageSizeTotalTPEA = pageSize;

    if (this.pageSizeTotalTPEA != pageSize) {
      this.pageIndexTotalTPEA = 1;
      this.pageSizeTotalTPEA = pageSize;
    }

    if (this.sortKeyTotalTPEA != sortField) {
      this.pageIndexTotalTPEA = 1;
      this.pageSizeTotalTPEA = pageSize;
    }

    this.sortKeyTotalTPEA = sortField;
    this.sortValueTotalTPEA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }
  isRecordLoadingRREMINDER: boolean = false;
  totalRecordsTotalRREMINDER = 0;
  pageIndexTotalRREMINDER = 1;
  pageSizeTotalRREMINDER = 10;
  sortValueTotalRREMINDER: string = 'asc';
  sortKeyTotalRREMINDER: string = 'ID';
  datalistForTotalRREMINDER: any = [];
  EmployeeRReminderlist: any = [];
  sortTotalRREMINDER(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalRREMINDER = pageIndex;
    this.pageSizeTotalRREMINDER = pageSize;

    if (this.pageSizeTotalRREMINDER != pageSize) {
      this.pageIndexTotalRREMINDER = 1;
      this.pageSizeTotalRREMINDER = pageSize;
    }

    if (this.sortKeyTotalRREMINDER != sortField) {
      this.pageIndexTotalRREMINDER = 1;
      this.pageSizeTotalRREMINDER = pageSize;
    }

    this.sortKeyTotalRREMINDER = sortField;
    this.sortValueTotalRREMINDER = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  totalRecordsTotalRTPHYA = 0;
  pageIndexTotalRTPHYA = 1;
  pageSizeTotalRTPHYA = 10;
  isRecordLoadingRTPHYA: boolean = false;
  sortValueTotalRTPHYA: string = 'asc';
  sortKeyTotalRTPHYA: string = 'ID';
  datalistForTotalRTPHYA: any = [];
  sortTotalRTPHYA(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalRTPHYA = pageIndex;
    this.pageSizeTotalRTPHYA = pageSize;

    if (this.pageSizeTotalRTPHYA != pageSize) {
      this.pageIndexTotalRTPHYA = 1;
      this.pageSizeTotalRTPHYA = pageSize;
    }

    if (this.sortKeyTotalRTPHYA != sortField) {
      this.pageIndexTotalRTPHYA = 1;
      this.pageSizeTotalRTPHYA = pageSize;
    }

    this.sortKeyTotalRTPHYA = sortField;
    this.sortValueTotalRTPHYA = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }
  isRecordLoadingRDHRAL: boolean = false;
  totalRecordsTotalRDHRAL = 0;
  pageIndexTotalRDHRAL = 1;
  pageSizeTotalRDHRAL = 10;
  sortValueTotalRDHRAL: string = 'asc';
  sortKeyTotalRDHRAL: string = 'ID';
  datalistForTotalRDHRAL: any = [];
  EmployeeRDHRALlist: any = [];
  sortTotalRDHRAL(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalRDHRAL = pageIndex;
    this.pageSizeTotalRDHRAL = pageSize;

    if (this.pageSizeTotalRDHRAL != pageSize) {
      this.pageIndexTotalRDHRAL = 1;
      this.pageSizeTotalRDHRAL = pageSize;
    }

    if (this.sortKeyTotalRDHRAL != sortField) {
      this.pageIndexTotalRDHRAL = 1;
      this.pageSizeTotalRDHRAL = pageSize;
    }

    this.sortKeyTotalRDHRAL = sortField;
    this.sortValueTotalRDHRAL = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }
  isRecordLoadingRPNONACC: boolean = false;
  totalRecordsTotalRPNONACC = 0;
  pageIndexTotalRPNONACC = 1;
  pageSizeTotalRPNONACC = 10;
  sortValueTotalRPNONACC: string = 'asc';
  sortKeyTotalRPNONACC: string = 'ID';
  datalistForTotalRPNONACC: any = [];
  EmployeeRPNONACClist: any = [];
  sortTotalRPNONACC(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalRPNONACC = pageIndex;
    this.pageSizeTotalRPNONACC = pageSize;

    if (this.pageSizeTotalRPNONACC != pageSize) {
      this.pageIndexTotalRPNONACC = 1;
      this.pageSizeTotalRPNONACC = pageSize;
    }

    if (this.sortKeyTotalRPNONACC != sortField) {
      this.pageIndexTotalRPNONACC = 1;
      this.pageSizeTotalRPNONACC = pageSize;
    }

    this.sortKeyTotalRPNONACC = sortField;
    this.sortValueTotalRPNONACC = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  isRecordLoadingRPBARD: boolean = false;
  totalRecordsTotalRPBARD = 0;
  pageIndexTotalRPBARD = 1;
  pageSizeTotalRPBARD = 10;
  sortValueTotalRPBARD: string = 'asc';
  sortKeyTotalRPBARD: string = 'ID';
  datalistForTotalRPBARD: any = [];
  EmployeeRPBARDlist: any = [];
  sortTotalRPBARD(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'asc';
    this.pageIndexTotalRPBARD = pageIndex;
    this.pageSizeTotalRPBARD = pageSize;

    if (this.pageSizeTotalRPBARD != pageSize) {
      this.pageIndexTotalRPBARD = 1;
      this.pageSizeTotalRPBARD = pageSize;
    }

    if (this.sortKeyTotalRPBARD != sortField) {
      this.pageIndexTotalRPBARD = 1;
      this.pageSizeTotalRPBARD = pageSize;
    }

    this.sortKeyTotalRPBARD = sortField;
    this.sortValueTotalRPBARD = sortOrder;
    if (currentSort != null && currentSort.value != undefined) {
      this.search();
    }
  }

  fetchCurrentTime(): void {
    this.api.getCurrentTime().subscribe(
      (data) => {
        this.currentTimeformis = new Date(data.datetime);
        this.currentTimefoeph = new Date(data.datetime);
      },
      (error) => {
        console.error('Error fetching time:', error);
      }
    );
  }

  dataAllotmentPublish: Allotmentpublishedlist = new Allotmentpublishedlist();
  dataAllotmentPublishHRA: Allotmentpublishedlist =
    new Allotmentpublishedlist();

  getAllUsers() {
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        ' AND STATUS = 1  AND SERVICE_ID = 5 '
        // AND DDO_ID=' +  Number(sessionStorage.getItem('ddoId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Signaturearray = data['data'];

            if (this.Signaturearray.length > 0) {
              if (this.dataAllotmentPublish['NEW_SIGNATURE_ID']) {
                const abc = Number(
                  this.dataAllotmentPublish['NEW_SIGNATURE_ID']
                );
                this.signature(abc);
              }

              if (this.dataAllotmentPublishHRA['NEW_SIGNATURE_ID']) {
                const abc = Number(
                  this.dataAllotmentPublishHRA['NEW_SIGNATURE_ID']
                );
                this.signature(abc);
              }
            }
          }
        },
        (err) => { }
      );
  }
  SIGNATURE_IMAGE = '';
  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HIN = f[0]['POST_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HIN = f[0]['OFFICE_NAME_HN'];
      this.SIGNATURE_IMAGE = f[0]['SIGNATURE_IMAGE'];
    } else {
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.POST = '';
      this.POST_HIN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HIN = '';
      this.SIGNATURE_IMAGE = '';
    }
  }

  retrieveimgUrl = appkeys.retriveimgUrl;

  openCertificate(data: any) {
    window.open(this.retrieveimgUrl + 'habitableCertificate/' + data);
  }
}
