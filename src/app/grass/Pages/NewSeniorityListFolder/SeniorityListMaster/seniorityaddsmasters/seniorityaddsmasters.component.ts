import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finallistmaster } from 'src/app/grass/Models/FinalPublishListsend';
import { newSeniorityist } from 'src/app/grass/Models/NewSeniorityList';
import { TempDetailsMaster } from 'src/app/grass/Models/TempDetailsMaster';
import { differenceInCalendarDays } from 'date-fns';
import * as html2pdf from 'html2pdf.js';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-seniorityaddsmasters',
  templateUrl: './seniorityaddsmasters.component.html',
  styleUrls: ['./seniorityaddsmasters.component.css'],
  providers: [DatePipe],
})
export class SeniorityaddsmastersComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = newSeniorityist;
  @Input() currentStage: any;
  @Input() tempdataid: any;
  @Input() isdraft: any;

  finalpublish: finallistmaster = new finallistmaster();
  showgeneratedlist: any = [];
  loadingRecords = false;
  inspectorname: any;
  userid: any;
  roleid: any;

  newdate: any = new Date();
  todaysdate: any = '';
  todaysyear: any = '';
  nextyear: any = '';

  constructor(
    private dom: DomSanitizer,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private message: NzNotificationService,
    private api: APIServicesService
  ) {}

  RESIDENCETYPENAME: any = '';
  CUTOFFDATE: any = new Date();
  newdate121 = new Date();

  showcolumn: boolean = false;
  SIGNATURE_ID1: any;
  ngOnInit() {
    this.getdatee();
    this.userid = Number(sessionStorage.getItem('userId'));
    this.roleid = Number(sessionStorage.getItem('roleId'));
    this.todaysdate = this.datepipe.transform(this.newdate, 'dd/MM/yyyy');
    this.todaysyear = this.datepipe.transform(this.newdate, 'yyyy');
    this.nextyear = Number(this.todaysyear) + 1;

    let currentDatcute: Date = new Date();
    this.CUTOFFDATE = new Date(
      currentDatcute.getFullYear(),
      currentDatcute.getMonth(),
      0
    );

    if (this.data) {
      this.RESIDENCETYPENAME = this.data.RESIDENCE_TYPE_NAME;
      if (this.data.RESIDENCE_TYPE_ID > 4) {
        this.showcolumn = true;
      } else {
        this.showcolumn = false;
      }

      this.filtergignatureid = ' AND SERVICE_ID = 5 ';
      this.getsignaturedata();

      if (this.roleid == 15) {
        this.api
          .getAllUsers(0, 0, 'ID', 'desc', ' AND ID = ' + this.userid)
          .subscribe(
            (value) => {
              if (value.code == 200) {
                if (value['data'].length > 0) {
                  let inspectordata = value['data'][0];
                  this.inspectorname = inspectordata['NAME'];
                }
              } else {
                console.error('Something Went Wrong..');
              }
            },
            (error) => {
              console.error(error, 'Something Went Wrong..');
            }
          );
      }

      if (this.data.FILE_URL != null) {
        this.joininglettershow = false;
      } else {
        this.joininglettershow = true;
      }
      if (this.finalpublish.FINAL_FILE_URL != null) {
        this.FinalFileurlshow = false;
      } else {
        this.FinalFileurlshow = true;
      }
      if (this.currentStage == 0 && this.isdraft == 'draft') {
        this.gettempwaitinglistdetails();
        this.CastCategory = 'GN';
        this.CastCategoryPart2 = 'GN';
      } else if (this.currentStage == 1 && this.isdraft == 'draft') {
        this.CastCategory = 'GN';
        this.CastCategoryPart2 = 'GN';
        this.gettempwaitinglistdetails();
      } else if (this.currentStage == 0 && this.isdraft == 'final') {
        this.CastCategory = 'GN';
        this.CastCategoryPart2 = 'GN';
        this.getdraftsignaturedata();
        this.generateseniortydate();
      } else if (this.currentStage == 1 && this.isdraft == 'final') {
        this.CastCategory = 'GN';
        this.CastCategoryPart2 = 'GN';
        this.getdraftsignaturedata();
        this.generateseniortydate();
      }
    }
  }

  demodata: any = [];
  CastCategory: any = 'GN';
  changecastGeneral(event: any) {
    if (event == 'GN') {
      this.loadingRecords = true;
      this.showgeneratedlistone = [...this.duplicateshowgeneratedlistone];
      this.loadingRecords = false;
    } else if (event == 'SC') {
      this.loadingRecords = true;
      this.showgeneratedlistone = this.duplicateshowgeneratedlistone.filter(
        (value: any) => {
          this.loadingRecords = false;
          return value.CAST == 'SC';
        }
      );
    } else if (event == 'ST') {
      this.loadingRecords = true;
      this.showgeneratedlistone = this.duplicateshowgeneratedlistone.filter(
        (value: any) => {
          this.loadingRecords = false;
          return value.CAST == 'ST';
        }
      );
    }
  }

  CastCategoryPart2: any = 'GN';
  changecastGeneral2(event: any) {
    if (event == 'GN') {
      this.loadingRecords = true;
      this.showgeneratedlist = [...this.dupshowgeneratedlist];
      this.loadingRecords = false;
    } else if (event == 'SC') {
      this.loadingRecords = true;
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (value: any) => {
          this.loadingRecords = false;
          return value.CAST == 'SC';
        }
      );
    } else if (event == 'ST') {
      this.loadingRecords = true;
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (value: any) => {
          this.loadingRecords = false;
          return value.CAST == 'ST';
        }
      );
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onChange(result: Date): void {}

  onOk(result: Date | Date[] | null): void {}

  getsenioritylistdatafull() {
    this.api
      .getSenioritylist(
        0,
        0,
        'ID',
        'desc',
        ' AND MONTH = ' +
          this.data.MONTH +
          ' AND YEAR = ' +
          this.data.YEAR +
          ' AND RESIDENCE_TYPE_ID = ' +
          this.data.RESIDENCE_TYPE_ID
      )
      .subscribe(
        (data) => {
          let datasenioritydata = [];
          datasenioritydata = data['data'];
          if (datasenioritydata.length > 0) {
            let sennidata = data['data'][0];
            this.data.FILE_URL = sennidata.FILE_URL;
            this.data.OBJ_START_DATE_TIME = sennidata.OBJ_START_DATE_TIME;
            this.data.OBJ_END_DATE_TIME = sennidata.OBJ_END_DATE_TIME;
            this.data.FINAL_FILE_URL = sennidata.FINAL_FILE_URL;
          }
          this.isSpinning = false;
        },
        (err) => {}
      );
  }

  getfinalsenioritylistdata() {
    this.isSpinning = true;
    this.api
      .getfinalSenioritylist(
        0,
        0,
        'ID',
        'desc',
        ' AND MONTH = ' +
          this.data.MONTH +
          ' AND YEAR = ' +
          this.data.YEAR +
          ' AND RESIDENCE_TYPE_ID = ' +
          this.data.RESIDENCE_TYPE_ID
      )
      .subscribe(
        (data) => {
          let datasenioritydata = [];
          datasenioritydata = data['data'];
          if (datasenioritydata.length > 0) {
            let sennidata = data['data'][0];
            this.finalpublish.FINAL_FILE_URL = sennidata.FILE_URL;
            this.finalpublish.PREFERENCE_START_DATE_TIME =
              sennidata.PREFERENCE_START_DATE_TIME;
            this.finalpublish.PREFERENCE_END_DATE_TIME =
              sennidata.PREFERENCE_END_DATE_TIME;
          }

          let todaysdate = new Date();
          let sevendaysdate = new Date(
            todaysdate.getFullYear(),
            todaysdate.getMonth(),
            todaysdate.getDate() + 7,
            todaysdate.getHours(),
            todaysdate.getMinutes()
          );
          if (
            this.finalpublish.PREFERENCE_START_DATE_TIME == null ||
            this.finalpublish.PREFERENCE_START_DATE_TIME == undefined ||
            this.finalpublish.PREFERENCE_START_DATE_TIME == ''
          ) {
            this.finalpublish.PREFERENCE_START_DATE_TIME = todaysdate;
          }
          if (
            this.finalpublish.PREFERENCE_END_DATE_TIME == null ||
            this.finalpublish.PREFERENCE_END_DATE_TIME == undefined ||
            this.finalpublish.PREFERENCE_END_DATE_TIME == ''
          ) {
            this.finalpublish.PREFERENCE_END_DATE_TIME = sevendaysdate;
          }
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }

  OBJ_START_DATE_TIME;
  OBJ_END_DATE_TIME;
  PREFERENCE_START_DATE_TIME;
  OBJ_END_DATE_TIME1;

  endOpen: boolean = false;
  startOpen: boolean = false;

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue) {
      return false;
    }
    var previousDate = new Date(this.OBJ_START_DATE_TIME);
    previousDate.setDate(previousDate.getDate() + 4);

    return endValue <= new Date(previousDate);
  };
  disabledEndDate1 = (endValue: Date): boolean => {
    if (!endValue) {
      return false;
    }
    var previousDate = new Date(this.PREFERENCE_START_DATE_TIME);
    previousDate.setDate(previousDate.getDate() + 7);

    return endValue <= new Date(previousDate);
  };

  onStartChange(date: any): void {
    var aa = new Date(date);
    this.data.OBJ_END_DATE_TIME = new Date(date);
    this.data.OBJ_END_DATE_TIME.setDate(
      this.data.OBJ_END_DATE_TIME.getDate() + 4
    );
  }
  onStartChange1(date: Date): void {
    this.PREFERENCE_START_DATE_TIME = date;
    this.data.PREFERENCE_END_DATE_TIME = new Date(date);
    this.data.PREFERENCE_END_DATE_TIME.setDate(
      this.data.PREFERENCE_END_DATE_TIME.getDate() + 7
    );
  }

  duplicateshowgeneratedlistone: any = [];
  loadingRecordsdraft: boolean = false;
  gettempwaitinglistdetails() {
    this.showgeneratedlistone = [];
    this.duplicateshowgeneratedlistone = [];
    this.loadingRecords = true;
    this.loadingRecordsdraft = true;
    this.api
      .tempwaitinglistdetailscall(
        0,
        0,
        'CURRENT_SEQ',
        'asc',
        ' AND  TEMP_WAITING_MASTER_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          this.loadingRecords = false;
          this.loadingRecordsdraft = false;
          this.showgeneratedlistone = data['data'];
          this.duplicateshowgeneratedlistone = data['data'];
        },
        (error) => {
          this.loadingRecords = false;
          this.loadingRecordsdraft = false;
          this.message.error('Failed To get data', '');
        }
      );
  }

  dupshowgeneratedlist: any = [];
  generateseniortydate() {
    this.loadingRecords = true;
    this.dupshowgeneratedlist = [];
    this.showgeneratedlist = [];
    let month = Number(this.data.MONTH - 1);
    this.api
      .DraftwaitingListDetails(
        0,
        0,
        'CURRENT_SEQ_NO',
        'asc',
        ' AND DRAFT_WAITING_MASTER_ID = ' + this.data.DRAFT_WAITING_MASTER_ID
      )
      .subscribe(
        (data) => {
          this.showgeneratedlist = data['data'];
          this.dupshowgeneratedlist = data['data'];
          this.loadingRecords = false;
        },
        (error) => {
          this.message.error('Failed To get data', '');
        }
      );
  }

  searchfilteredrecordstwo: string = '';
  searchrecordstwo() {
    if (
      this.searchfilteredrecordstwo == '' ||
      this.searchfilteredrecordstwo.length < 3
    ) {
      this.showgeneratedlist = this.dupshowgeneratedlist;
    } else {
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (option) =>
          option.EMPLOYEE_NAME.toLowerCase().indexOf(
            this.searchfilteredrecordstwo.toLowerCase()
          ) !== -1
      );
    }
  }

  num: any;
  currentIndex: any = -1;
  isSpinning = false;
  SECOND_REMARK = '';
  changeSeniority(data) {
    this.NEW_NO = '';
    this.num = null;
    this.SECOND_REMARK = '';
    for (let i = 0; i < this.dupshowgeneratedlist.length; i++) {
      if (data['EMP_ID'] == this.dupshowgeneratedlist[i]['EMP_ID']) {
        this.currentIndex = i;
      }
    }
    this.isVisibleseniority = true;
    this.num = Object.assign({}, data);
  }

  isVisibleseniority = false;
  NEW_NO: any;
  handleCancel() {
    this.num = new TempDetailsMaster();
    this.isVisibleseniority = false;
  }
  saveandnextspin = false;
  SaveListandnextstep0() {
    if (this.showgeneratedlistone.length < 1) {
      this.message.error(
        'Seniority Order Cannot Be Saved Due To No Records',
        ''
      );
    } else {
      for (let j = 0; j < this.showgeneratedlistone.length; j++) {
        this.showgeneratedlistone[j]['CURRENT_SEQ'] = j + 1;
      }

      this.saveandnextspin = true;
      this.api
        .updateTempwaitingListdetails(this.showgeneratedlistone)
        .subscribe(
          (data) => {
            this.message.success('Information Saved Successfully', '');
            this.data.TEMP_STEP_NO = 1;
            this.data.NEW_STEP_NO = 0;

            this.api
              .UpdateSeniorityList1(
                this.data,
                Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (value) => {
                  this.gettempwaitinglistdetails();
                  this.currentStage = 1;
                  this.saveandnextspin = false;
                },
                (error) => {
                  this.saveandnextspin = false;
                }
              );
          },
          (err) => {
            this.message.error('Failed To Save Information', '');

            this.saveandnextspin = false;
          }
        );
    }
  }
  SaveListandnextstep1() {
    this.saveandnextspin = true;

    this.api
      .getSenioritylist(
        0,
        0,
        'ID',
        'desc',
        ' AND MONTH = ' +
          this.data.MONTH +
          ' AND YEAR = ' +
          this.data.YEAR +
          ' AND RESIDENCE_TYPE_ID = ' +
          this.data.RESIDENCE_TYPE_ID
      )
      .subscribe(
        (data) => {
          let datasenioritydata = [];
          datasenioritydata = data['data'];

          if (datasenioritydata.length > 0) {
            this.draftpublish = true;
            this.saveandnextspin = false;
            let sennidata = data['data'][0];
            this.data.FILE_URL = sennidata.FILE_URL;
            this.data.OBJ_START_DATE_TIME = sennidata.OBJ_START_DATE_TIME;
            this.data.OBJ_END_DATE_TIME = sennidata.OBJ_END_DATE_TIME;
            this.data.FINAL_FILE_URL = sennidata.FINAL_FILE_URL;
            let todaysdate = new Date();
            let fivedaysdate = new Date(
              todaysdate.getFullYear(),
              todaysdate.getMonth(),
              todaysdate.getDate() + 4,
              0,
              0
            );
            if (
              this.data.OBJ_START_DATE_TIME == null ||
              this.data.OBJ_START_DATE_TIME == undefined ||
              this.data.OBJ_START_DATE_TIME == ''
            ) {
              this.data.OBJ_START_DATE_TIME = todaysdate;
            }
            if (
              this.data.OBJ_END_DATE_TIME == null ||
              this.data.OBJ_END_DATE_TIME == undefined ||
              this.data.OBJ_END_DATE_TIME == ''
            ) {
              this.data.OBJ_END_DATE_TIME = fivedaysdate;
            }
          }
          this.isSpinning = false;
        },
        (err) => {}
      );
  }

  NextToFinalList() {
    this.saveandnextspin = true;
    this.data.TEMP_STEP_NO = 4;
    this.data['DATE_CONDITION'] = 'GFL';
    this.api.UpdateSeniorityListBasic(this.data).subscribe(
      (value) => {
        this.generateseniortydate();
        this.getdraftsignaturedata();
        this.currentStage = 1;
        this.saveandnextspin = false;
      },
      (error) => {}
    );
  }

  NextToFinalPrint() {
    this.saveandnextspin = true;
    for (let j = 0; j < this.showgeneratedlist.length; j++) {
      this.showgeneratedlist[j]['CURRENT_SEQ'] = j + 1;
    }
    this.api.updateTempwaitingListdetails(this.showgeneratedlist).subscribe(
      (data) => {
        this.message.success('Information Saved Successfully', '');
        this.data.TEMP_STEP_NO = 6;
        this.showgeneratedlist['DATE_CONDITION'] = 'PFO';
        this.api.UpdateSeniorityListBasic(this.data).subscribe(
          (value) => {
            this.printFinalOrder();
            this.currentStage = 6;
            this.saveandnextspin = false;
          },
          (error) => {}
        );
      },
      (err) => {
        this.message.error('Failed To Save Information', '');
      }
    );
  }

  FinalgeneratedList() {
    this.saveandnextspin = true;
    for (let j = 0; j < this.showgeneratedlist.length; j++) {
      this.showgeneratedlist[j]['CURRENT_SEQ'] = j + 1;
    }

    this.api.updateDraftwaitingListdetails(this.showgeneratedlist).subscribe(
      (data) => {
        this.message.success('Information Saved Successfully', '');
        this.data.TEMP_STEP_NO = 5;
        this.api.UpdateSeniorityListBasic(this.data).subscribe(
          (value) => {
            this.generateseniortydate();
            this.getdraftsignaturedata();
            this.currentStage = 1;
            this.saveandnextspin = false;
          },
          (error) => {}
        );
      },
      (err) => {
        this.message.error('Failed To Save Information', '');
      }
    );
  }

  printFinalOrder() {
    var data: any = {
      DATE_CONDITION: 'FP',
      ID: this.data.DRAFT_WAITING_MASTER_ID,
    };
    this.api.finalPrintDate(data).subscribe(
      (data) => {},
      (err) => {
        this.message.error('Failed To Save Information', '');
      }
    );
  }
  changelist() {
    if (
      this.NEW_NO == undefined ||
      this.NEW_NO == null ||
      this.NEW_NO == '' ||
      this.NEW_NO > this.dupshowgeneratedlist.length ||
      this.NEW_NO < 1
    ) {
      this.message.error('Please Enter New Number Properly', '');
    } else if (this.SECOND_REMARK == undefined || this.SECOND_REMARK == '') {
      this.message.error('Please Enter Reason', '');
    } else {
      var index = Number(this.NEW_NO) - 1;

      if (index > -1) {
        const temp = this.dupshowgeneratedlist[this.currentIndex];
        this.dupshowgeneratedlist = this.dupshowgeneratedlist.filter((data) => {
          if (data.CURRENT_SEQ_NO != this.num.CURRENT_SEQ_NO) return data;
        });

        this.dupshowgeneratedlist.splice(index, 0, temp);
        this.num.PREVIOUS_SEQ_NO = this.num.CURRENT_SEQ_NO;
        this.num.CURRENT_SEQ_NO = this.NEW_NO;
        this.num.IS_MANUALLY_CHANGED = 1;
        this.num.REMARK = this.SECOND_REMARK;
      }
      this.dupshowgeneratedlist = [...[], ...this.dupshowgeneratedlist];
      this.currentIndex = -1;

      for (let j = 0; j < this.dupshowgeneratedlist.length; j++) {
        this.dupshowgeneratedlist[j]['CURRENT_SEQ_NO'] = j + 1;
        if (this.num.ID == this.dupshowgeneratedlist[j]['ID']) {
          this.dupshowgeneratedlist.splice(j, 1, this.num);
        }
      }

      for (let i = 0; i < this.dupshowgeneratedlist.length; i++) {
        this.dupshowgeneratedlist[i]['CURRENT_SEQ_NO'] = i + 1;
      }

      this.searchrecordstwo();

      this.isVisibleseniority = false;
    }
  }

  publishSpin = false;
  UploadandSave() {
    if (
      this.data.OBJ_START_DATE_TIME == null ||
      this.data.OBJ_START_DATE_TIME == undefined ||
      this.data.OBJ_START_DATE_TIME == ''
    ) {
      this.message.error('Please Select Objection Start DateTime', '');
    } else if (
      this.data.OBJ_END_DATE_TIME == null ||
      this.data.OBJ_END_DATE_TIME == undefined ||
      this.data.OBJ_END_DATE_TIME == ''
    ) {
      this.message.error('Please Select Objection End DateTime', '');
    } else {
      this.data.IS_FINAL = false;
      this.data.OBJ_START_DATE_TIME = this.datepipe.transform(
        this.data.OBJ_START_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
      this.data.OBJ_END_DATE_TIME = this.datepipe.transform(
        this.data.OBJ_END_DATE_TIME,
        'yyyy-MM-dd HH:mm'
      );
      this.data.PUBLISH_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm'
      );
      this.isSpinning = true;
      this.publishSpin = true;
      this.data.TEMP_STEP_NO = 3;
      this.data.NEW_STEP_NO = 1;
      this.data.STATUS = 'D';
      this.data.DATE_CONDITION = 'UFU';
      this.api
        .UpdateSeniorityList1(
          this.data,
          Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (successCode) => {
            if (successCode.code == '200') {
              this.data.ID = successCode.DRAFT_WAITING_MASTER_ID;
              this.data.CUTOFFDATE = this.datepipe.transform(
                new Date(this.CUTOFFDATE),
                'dd/MM/yyyy'
              );
              this.data.TEMP_WAITING_ID = this.tempdataid;

              this.api.publishdraftorderrrrr(this.data).subscribe(
                (successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Draft Seniority Order Published Successfully...',
                      ''
                    );
                    this.publishSpin = false;
                    this.isSpinning = false;
                    this.drawerClose();
                  } else {
                    this.message.error(
                      'Failed To Publish Seniority Order...',
                      ''
                    );
                    this.isSpinning = false;
                    this.publishSpin = false;
                  }
                },
                (err) => {
                  this.message.error(
                    'Something went wrong, please try again later',
                    ''
                  );
                  this.isSpinning = false;
                  this.publishSpin = false;
                }
              );
            } else {
              this.message.error('Failed To Publish Seniority Order...', '');
              this.isSpinning = false;
              this.publishSpin = false;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.publishSpin = false;
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
          }
        );
    }
  }

  UploadandSaveFinal() {
    this.finalpublish.PREFERENCE_START_DATE_TIME =
      this.data.PREFERENCE_START_DATE_TIME;
    this.finalpublish.PREFERENCE_END_DATE_TIME =
      this.data.PREFERENCE_END_DATE_TIME;

    this.finalpublish.PREFERENCE_START_DATE_TIME = this.datepipe.transform(
      this.finalpublish.PREFERENCE_START_DATE_TIME,
      'yyyy-MM-dd HH:mm'
    );
    this.finalpublish.PREFERENCE_END_DATE_TIME = this.datepipe.transform(
      this.finalpublish.PREFERENCE_END_DATE_TIME,
      'yyyy-MM-dd HH:mm'
    );
    this.data.PREFERENCE_START_DATE_TIME = this.datepipe.transform(
      this.data.PREFERENCE_START_DATE_TIME,
      'yyyy-MM-dd HH:mm'
    );
    this.data.PREFERENCE_END_DATE_TIME = this.datepipe.transform(
      this.data.PREFERENCE_END_DATE_TIME,
      'yyyy-MM-dd HH:mm'
    );
    this.data.FINAL_PUBLISH_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm'
    );
    this.isSpinning = true;
    this.data.TEMP_STEP_NO = 8;
    this.data.NEW_STEP_NO = 3;
    this.data.STATUS = 'F';
    this.finalpublish.DRAFT_LIST_MASTER_ID = this.data.DRAFT_WAITING_MASTER_ID;
    this.finalpublish.PUBLISHER_ID = Number(sessionStorage.getItem('userId'));
    this.finalpublish.CUTOFFDATE = this.datepipe.transform(
      new Date(this.CUTOFFDATE),
      'dd/MM/yyyy'
    );
    this.api.DraftWaitinglistFinalPublish(this.finalpublish).subscribe(
      (successCode) => {
        if (successCode.code == '200') {
          this.api.UpdateSeniorityListBasic(this.data).subscribe(
            (successCode) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Final Seniority Order Published Successfully...',
                  ''
                );
                this.publishSpin = false;
                this.isSpinning = false;
                this.drawerClose();
              } else {
                this.message.error(
                  'Failed To Publish Final Seniority Order...',
                  ''
                );
                this.isSpinning = false;
                this.publishSpin = false;
              }
            },
            (err) => {
              this.message.error(
                'Failed To Publish Final Seniority Order...',
                ''
              );
              this.isSpinning = false;
              this.publishSpin = false;
            }
          );
        } else {
          this.message.error('Failed To Publish Final Seniority Order...', '');
          this.isSpinning = false;
          this.publishSpin = false;
        }
      },
      (err) => {
        this.message.error('Failed To Publish Final Seniority Order...', '');
        this.isSpinning = false;
        this.publishSpin = false;
      }
    );
  }

  previousfromzerototwo() {
    this.currentStage--;
    if (this.currentStage == 0) {
      this.CastCategory = 'GN';
      this.CastCategoryPart2 = 'GN';
      this.gettempwaitinglistdetails();
    } else if (this.currentStage == 1) {
      this.CastCategory = 'GN';
      this.CastCategoryPart2 = 'GN';
      this.gettempwaitinglistdetails();
    } else if (this.currentStage == 2) {
      this.getsenioritylistdatafull();
    }
  }

  previousfromthreetoseven() {
    this.currentStage--;
    if (this.currentStage == 1) {
      this.CastCategory = 'GN';
      this.CastCategoryPart2 = 'GN';
      this.getdraftsignaturedata();
      this.generateseniortydate();
    } else if (this.currentStage == 5) {
      this.CastCategory = 'GN';
      this.CastCategoryPart2 = 'GN';
      this.getdraftsignaturedata();
      this.generateseniortydate();
    } else if (this.currentStage == 6) {
    }
  }

  close() {
    this.drawerClose();
  }

  joininglettershow = true;
  joindateletter: any;
  urljoinletter: any;
  FinalFileurlshow = true;
  FinalFileurl: any;
  urlFinalFileurl: any;
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  SenioritylistPDF: any;
  viewJoiningLetter(pdfURL: string): void {
    this.SenioritylistPDF = '';
    this.view = 1;
    this.printOrderModalVisible = true;
    this.SenioritylistPDF = this.getS(pdfURL);
  }
  viewFinalFileUrl(pdfURL: string): void {
    this.SenioritylistPDF = '';
    this.view = 2;
    this.printOrderModalVisible = true;
    this.SenioritylistPDF = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'draftWaitingList/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'finalList/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  clearJoiningletletter(fileurl: string, folder: string) {
    this.isSpinning = true;
    var deletefile = folder + '/' + fileurl;
    this.api.deletealluploadsgrass(deletefile).subscribe(
      (value) => {
        if (value.code == 200) {
          this.message.success(
            'Draft Seniority Order File Deleted Successfully',
            ''
          );
          this.data.FILE_URL = null;
          this.joininglettershow = true;
          this.progressBar = false;
          this.percent = 0;
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Delete Draft Seniority Order File', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Delete Draft Seniority Order File', '');
        this.isSpinning = false;
      }
    );
  }
  clearFinalFileUrl(fileurl: string, folder: string) {
    this.isSpinning = true;
    var deletefile = folder + '/' + fileurl;
    this.api.deletealluploadsgrass(deletefile).subscribe(
      (value) => {
        if (value.code == 200) {
          this.message.success(
            'Final Seniority Order File Deleted Successfully',
            ''
          );
          this.finalpublish.FINAL_FILE_URL = null;
          this.FinalFileurlshow = true;
          this.progressBar1 = false;
          this.percent1 = 0;
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Delete Final Seniority Order File', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Delete Final Seniority Order File', '');
        this.isSpinning = false;
      }
    );
  }
  progressBar1: boolean = false;
  percent1 = 0;
  timer1: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;

  FinalFileUrlUpload(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.FinalFileurl = <File>event.target.files[0];

      if (this.FinalFileurl != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.FinalFileurl.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlFinalFileurl = url;
        if (
          this.finalpublish.FINAL_FILE_URL != undefined &&
          this.finalpublish.FINAL_FILE_URL.trim() != ''
        ) {
          var arr = this.finalpublish.FINAL_FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar1 = true;
      this.timer1 = this.api
        .onUpload2('finalList', this.FinalFileurl, this.urlFinalFileurl)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent1 = percentDone;
            if (this.percent1 == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.finalpublish.FINAL_FILE_URL = null;
            this.progressBar1 = false;
            this.percent1 = 0;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'Final Seniority Order File Uploaded Successfully',
                ''
              );
              this.isSpinning = false;
              this.finalpublish.FINAL_FILE_URL = this.urlFinalFileurl;
              if (this.finalpublish.FINAL_FILE_URL != null) {
                this.FinalFileurlshow = false;
              } else {
                this.FinalFileurlshow = true;
              }
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.FinalFileurl = null;
      this.finalpublish.FINAL_FILE_URL = null;
    }
  }

  onFileSelectedJoiningletter(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.joindateletter = <File>event.target.files[0];

      if (this.joindateletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.joindateletter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urljoinletter = url;
        if (
          this.data.FILE_URL != undefined &&
          this.data.FILE_URL.trim() != ''
        ) {
          var arr = this.data.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload2('draftWaitingList', this.joindateletter, this.urljoinletter)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Upload File...', '');
            this.isSpinning = false;
            this.progressBar = false;
            this.percent = 0;
            this.data.FILE_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'Draft Seniority Order File Uploaded Successfully',
                ''
              );
              this.isSpinning = false;
              this.data.FILE_URL = this.urljoinletter;
              if (this.data.FILE_URL != null) {
                this.joininglettershow = false;
              } else {
                this.joininglettershow = true;
              }
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.joindateletter = null;
      this.data.FILE_URL = null;
    }
  }

  printOrder() {
    this.data['DATE_CONDITION'] = 'PO';
    this.api
      .UpdateSeniorityList1(this.data, Number(sessionStorage.getItem('userId')))
      .subscribe(
        (value) => {
          if (value.code == '200') {
          } else {
          }
        },
        (error) => {}
      );
  }

  NEW_NO1: any;
  currentIndex1: any;
  num1: any;
  First_REMARK = '';
  isVisibleseniorityfirst = false;
  changeSenioritylistone(data) {
    this.NEW_NO1 = '';
    this.num1 = null;
    this.First_REMARK = '';

    for (let i = 0; i < this.duplicateshowgeneratedlistone.length; i++) {
      if (data['EMP_ID'] == this.duplicateshowgeneratedlistone[i]['EMP_ID']) {
        this.currentIndex1 = i;
      }
    }

    this.isVisibleseniorityfirst = true;
    this.num1 = Object.assign({}, data);
  }

  handleCancelone() {
    this.num1 = new TempDetailsMaster();
    this.isVisibleseniorityfirst = false;
  }

  searchfilteredrecords: string = '';
  searchrecords() {
    if (
      this.searchfilteredrecords == '' ||
      this.searchfilteredrecords.length < 3
    ) {
      this.showgeneratedlistone = this.duplicateshowgeneratedlistone;
    } else {
      this.showgeneratedlistone = this.duplicateshowgeneratedlistone.filter(
        (option) =>
          option.EMPLOYEE_NAME.toLowerCase().indexOf(
            this.searchfilteredrecords.toLowerCase()
          ) !== -1
      );
    }
  }

  showgeneratedlistone: any = [];
  changelistfirst() {
    if (
      this.NEW_NO1 == undefined ||
      this.NEW_NO1 == null ||
      this.NEW_NO1 == '' ||
      this.NEW_NO1 > this.duplicateshowgeneratedlistone.length ||
      this.NEW_NO1 < 1
    ) {
      this.message.error('Please Enter New Number Properly', '');
    } else if (this.First_REMARK == undefined || this.First_REMARK == '') {
      this.message.error('Please Enter Reason', '');
    } else {
      var index = Number(this.NEW_NO1) - 1;

      if (index > -1) {
        const temp = this.duplicateshowgeneratedlistone[this.currentIndex1];
        this.duplicateshowgeneratedlistone =
          this.duplicateshowgeneratedlistone.filter((data) => {
            if (data.CURRENT_SEQ != this.num1.CURRENT_SEQ) return data;
          });

        this.duplicateshowgeneratedlistone.splice(index, 0, temp);
        this.num1.PREVIOUS_SEQ_NO = this.num1.CURRENT_SEQ;
        this.num1.CURRENT_SEQ = this.NEW_NO1;
        this.num1.IS_MANUALLY_CHANGED = 1;
        this.num1.REMARK = this.First_REMARK;
      }
      this.duplicateshowgeneratedlistone = [
        ...[],
        ...this.duplicateshowgeneratedlistone,
      ];
      this.currentIndex1 = -1;

      for (let j = 0; j < this.duplicateshowgeneratedlistone.length; j++) {
        this.duplicateshowgeneratedlistone[j]['CURRENT_SEQ'] = j + 1;
        if (this.num1.ID == this.duplicateshowgeneratedlistone[j]['ID']) {
          this.duplicateshowgeneratedlistone.splice(j, 1, this.num1);
        }
      }
      for (let i = 0; i < this.duplicateshowgeneratedlistone.length; i++) {
        this.duplicateshowgeneratedlistone[i]['CURRENT_SEQ'] = i + 1;
      }
      this.searchrecords();
      this.isVisibleseniorityfirst = false;
    }
  }

  cancel() {}
  draftpublish: boolean = false;
  publishtouserdraft() {
    this.draftpublish = true;
    this.getsenioritylistdatafull();
  }
  canceldraft() {
    this.draftpublish = false;
  }
  finalpublish1: boolean = false;
  publishtouserfinal() {
    this.finalpublish1 = true;
  }
  cancelfinal() {
    this.finalpublish1 = false;
  }
  disabledStartDate = (current: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.datee = current;
    return current < yesterday;
  };
  datee: any;
  current;
  current1;
  disabledDateTime2: DisabledTimeFn | any = (current: Date) => {
    const now = new Date();
    this.current = this.datepipe.transform(current, 'dd-MM-yyyy');
    this.current1 = this.datepipe.transform(this.datee, 'dd-MM-yyyy');
    if (this.current == this.current1 && this.current != null) {
      const currentHour = this.OBJ_START_DATE_TIME.getHours();
      const currentMinute = this.OBJ_START_DATE_TIME.getMinutes();
      return {
        nzDisabledHours: () => [...Array(currentHour).keys()],
        nzDisabledMinutes: () => [...Array(currentMinute).keys()],
        nzDisabledSeconds: () => [55, 56],
      };
    } else {
      return {
        nzDisabledHours: () => [],
        nzDisabledMinutes: () => [],
        nzDisabledSeconds: () => [],
      };
    }
  };

  disabledDateTime: DisabledTimeFn | any = (current: Date) => {
    const now = new Date();
    if (current && current < now) {
      return {
        nzDisabledHours: () => this.getDisabledHours(),
        nzDisabledMinutes: () => this.getDisabledMinutes(),
        nzDisabledSeconds: () => [55, 56],
      };
    }
    return null;
  };

  isCurrentDate(date: Date): boolean {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  getDisabledHours(): number[] {
    const now = new Date();
    const currentHour = now.getHours();
    if (this.isCurrentDate(now)) {
      return this.range(0, currentHour);
    }
    return this.range(0, 23);
  }

  getDisabledMinutes(): number[] {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (this.isCurrentDate(now) && currentHour === now.getHours()) {
      return this.range(0, currentMinute);
    }
    return this.range(0, 59);
  }
  range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  downloadPdfdraft() {
    if (this.showcolumn) {
      this.pdfDownloaddraft = true;

      const element = document.getElementById('pageprintmodeldraft');
      const opt = {
        margin: 0.2,
        filename: 'Draft Senority Order .pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' },
      };
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          this.pdfDownloaddraft = false;
        });
    } else {
      this.pdfDownloaddraft = true;

      const element = document.getElementById('pageprintmodeldraft');
      const opt = {
        margin: 0.2,
        filename: 'Draft Senority Order .pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      };
      html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          this.pdfDownloaddraft = false;
        });
    }
  }
  pdfDownloaddraft: boolean = false;
  pdfDownloadfinal: boolean = false;
  downloadPdffinal() {
    if (this.showcolumn) {
      this.pdfDownloadfinal = true;
      const element = document.getElementById('page1printmodelfinal');
      const opt = {
        margin: 0.2,
        filename: 'Final Senority Order.pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' },
      };
      html2pdf().from(element).set(opt).save();

      setTimeout(() => {
        this.pdfDownloadfinal = false;
      }, 5000);
    } else {
      this.pdfDownloadfinal = true;
      const element = document.getElementById('page1printmodelfinal');
      const opt = {
        margin: 0.2,
        filename: 'Final Senority Order.pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();

      setTimeout(() => {
        this.pdfDownloadfinal = false;
      }, 5000);
    }
  }

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.data.OBJ_START_DATE_TIME)) <
    0;

  disabledDate11 = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date()) < 0;

  closemodaldraft() {
    this.draftpublishpreview = false;
  }
  closemodalfinal() {
    this.finalpublishpreview = false;
  }
  draftpublishpreview: boolean = false;
  finalpublishpreview: boolean = false;

  printFinalOrder1() {
    var data: any = {
      DATE_CONDITION: 'FP',
      ID: this.data.DRAFT_WAITING_MASTER_ID,
    };
    this.api.finalPrintDate(data).subscribe(
      (data) => {
        this.finalpublishpreview = true;
      },
      (err) => {
        this.message.success('Failed To Save Information', '');
      }
    );
  }

  printOrder1() {
    this.data['DATE_CONDITION'] = 'PO';
    this.api
      .UpdateSeniorityList1(this.data, Number(sessionStorage.getItem('userId')))
      .subscribe(
        (value) => {
          if (value.code == '200') {
          } else {
          }
          this.draftpublishpreview = true;
        },
        (error) => {}
      );
  }

  SECTION_TYPE: any = '';
  NAME: any = '';
  NAME_HN: any = '';
  OFFICE_NAME: any = '';
  OFFICE_NAME_HN: any = '';
  POST: any = '';
  POST_HN: any = '';
  filtergignatureid = '';
  getsignaturedata() {
    this.api.getSignature(0, 0, 'ID', 'desc', this.filtergignatureid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturelist = data['data'];

          if (
            this.data.SIGNATURE_ID != null &&
            this.data.SIGNATURE_ID != undefined &&
            this.data.SIGNATURE_ID != ''
          ) {
            var f = this.Signaturelist.filter(
              (item) => item['ID'] == this.data.SIGNATURE_ID
            );
            this.SECTION_TYPE = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID1 = f[0]['ID'];
            this.NAME = f[0]['NAME'];
            this.NAME_HN = f[0]['NAME_HN'];
            this.OFFICE_NAME = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
            this.POST = f[0]['POST'];
            this.POST_HN = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID1 = data['data'][0]['ID'];
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.NAME = data['data'][0]['NAME'];
            this.NAME_HN = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
            this.POST = data['data'][0]['POST'];
            this.POST_HN = data['data'][0]['POST_HN'];
          }
        } else {
          console.error('someting went wrong');
        }
      },
      (error) => {}
    );
  }

  Signaturelist: any = [];
  IsspinningData = false;
  changesignature(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE = '';
      this.NAME = '';
      this.NAME_HN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HN = '';
      this.POST = '';
      this.POST_HN = '';
    } else {
      var f = this.Signaturelist.filter((item) => item['ID'] == event);
      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID1 = f[0]['ID'];
      this.NAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];

      let signaturedata = {
        SIGNATURE_ID: this.SIGNATURE_ID1,
        ID: this.data.ID,
      };
      this.IsspinningData = true;
      this.api.UpdateBasicDraftwaitingmaster(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
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
  }

  SIGNATURE_ID2: any;
  Signaturelist2: any = [];

  SECTION_TYPE2: any = '';
  NAME2: any = '';
  NAME_HN2: any = '';
  OFFICE_NAME2: any = '';
  OFFICE_NAME_HN2: any = '';
  POST2: any = '';
  POST_HN2: any = '';
  filtergignatureid2 = '';

  getdraftsignaturedata() {
    this.filtergignatureid2 = ' AND SERVICE_ID = 5 ';
    this.api
      .getDraftwaitingMasterforsignature(
        0,
        0,
        'ID',
        'asc',
        ' AND TEMP_WAITING_MASTER_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data.code == 200) {
            if (data['data'].length > 0) {
              let signatutecodedata = data['data'][0];

              this.api
                .getSignature(0, 0, 'ID', 'desc', this.filtergignatureid2)
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.Signaturelist2 = data['data'];

                      if (
                        signatutecodedata.SIGNATURE_ID != null &&
                        signatutecodedata.SIGNATURE_ID != undefined &&
                        signatutecodedata.SIGNATURE_ID != ''
                      ) {
                        var f = this.Signaturelist2.filter(
                          (item) => item['ID'] == signatutecodedata.SIGNATURE_ID
                        );
                        this.SECTION_TYPE2 = f[0]['SECTION_TYPE'];
                        this.SIGNATURE_ID2 = f[0]['ID'];
                        this.NAME2 = f[0]['NAME'];
                        this.NAME_HN2 = f[0]['NAME_HN'];
                        this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
                        this.OFFICE_NAME_HN2 = f[0]['OFFICE_NAME_HN'];
                        this.POST2 = f[0]['POST'];
                        this.POST_HN2 = f[0]['POST_HN'];
                      } else {
                        this.SIGNATURE_ID2 = data['data'][0]['ID'];
                        this.SECTION_TYPE2 = data['data'][0]['SECTION_TYPE'];
                        this.NAME2 = data['data'][0]['NAME'];
                        this.NAME_HN2 = data['data'][0]['NAME_HN'];
                        this.OFFICE_NAME2 = data['data'][0]['OFFICE_NAME'];
                        this.OFFICE_NAME_HN2 =
                          data['data'][0]['OFFICE_NAME_HN'];
                        this.POST2 = data['data'][0]['POST'];
                        this.POST_HN2 = data['data'][0]['POST_HN'];
                      }
                    } else {
                      console.error('someting went wrong');
                    }
                  },
                  (error) => {}
                );
            }
          } else {
            console.error('Something Went Wrong');
          }
        },
        (error) => {
          console.error(error, 'Something Went Wrong');
        }
      );
  }
  IsspinningData1 = false;
  changesignature2(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE2 = '';
      this.NAME2 = '';
      this.NAME_HN2 = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME_HN2 = '';
      this.POST2 = '';
      this.POST_HN2 = '';
    } else {
      var f = this.Signaturelist2.filter((item) => item['ID'] == event);
      this.SECTION_TYPE2 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID2 = f[0]['ID'];
      this.NAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN2 = f[0]['OFFICE_NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST_HN2 = f[0]['POST_HN'];

      let signaturedata = {
        SIGNATURE_ID: this.SIGNATURE_ID2,
        ID: this.data.ID,
      };
      this.IsspinningData1 = true;
      this.api.UpdateDraftWaitingmaster(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData1 = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData1 = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData1 = false;
        }
      );
    }
  }

  lastmonthdate: any;
  getdatee() {
    var date: any = new Date();
    const firstDayOfCurrentMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    );
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth);
    lastDayOfPreviousMonth.setDate(firstDayOfCurrentMonth.getDate() - 1);
    this.lastmonthdate = lastDayOfPreviousMonth;
  }
}
