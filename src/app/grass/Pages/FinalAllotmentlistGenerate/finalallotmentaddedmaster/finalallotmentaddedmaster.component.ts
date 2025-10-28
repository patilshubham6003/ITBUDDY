import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpEventType } from '@angular/common/http';
import { finalAllotmentdetails12 } from 'src/app/grass/Models/finalAllotmentdetails';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as html2pdf from 'html2pdf.js';
import { appkeys, grass } from 'src/app/app.constant';
import { Allotmentpublishedlist } from 'src/app/grass/Models/AllotmentPublishlist';

@Component({
  selector: 'app-finalallotmentaddedmaster',
  templateUrl: './finalallotmentaddedmaster.component.html',
  styleUrls: ['./finalallotmentaddedmaster.component.css'],
  providers: [DatePipe],
})
export class FinalallotmentaddedmasterComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any;
  @Input() scenioritycardId: any;
  isSpinning = false;
  loadingRecords = false;
  currentStage = 0;
  current = 0;
  showgeneratedlist: any = [];
  Finalallotlist: any = [];
  userid: any;
  roleid: any;
  inspectorname: any;
  cutoffPeriod: any;
  imgurl = appkeys.retriveimgUrl;

  newdate = new Date();
  todaysdate: any = '';
  todaysdateee: any = new Date();
  todaysyear: any = '';
  sevendaysfromnow: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth(),
    this.newdate.getDate() + 7
  );
  fivedaysfromnow: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth(),
    this.newdate.getDate() + 5
  );
  nextyear: any = '';
  flatslist: any = [];

  constructor(
    private api: APIServicesService,
    private sanitizer: DomSanitizer,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) { }
  key: any = grass.key;

  showcolumn = false;
  ngOnInit() {
    this.getAllUsers();
    this.key = grass.key;

    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    let currentDatcute: Date = new Date();

    this.cutoffPeriod = new Date(
      currentDatcute.getFullYear(),
      currentDatcute.getMonth(),
      0
    );

    this.todaysdate = this.datePipe.transform(this.newdate, 'dd/MM/yyyy');
    this.sevendaysfromnow = this.datePipe.transform(
      this.sevendaysfromnow,
      'dd/MM/yyyy'
    );
    this.fivedaysfromnow = this.datePipe.transform(
      this.fivedaysfromnow,
      'dd/MM/yyyy'
    );
    this.todaysyear = this.datePipe.transform(this.newdate, 'yyyy');
    this.nextyear = Number(this.todaysyear) + 1;

    if (this.data) {
      if (this.data.RESIDENCE_TYPE_ID > 4) {
        this.showcolumn = true;
      } else {
        this.showcolumn = false;
      }
      this.filtergignatureid = ' AND SERVICE_ID = 5 ';
      this.getsignaturedata();
    }

    this.api
      .getQuarterMaster(
        0,
        0,
        '',
        '',
        " AND AVAILABLE_STATUS = 'A' AND IS_PUBLISHED=1 AND RESIDENCE_TYPE_ID = " +
        this.data.RESIDENCE_TYPE_ID
      )
      .subscribe(
        (data) => {
          this.flatslist = data['data'];
        },
        (err) => {
          // this.message.error("Failed To Get data","");
        }
      );

    if (this.data) {
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
              }
            },
            (error) => { }
          );
      }

      if (this.data.FINAL_FILE_URL != null) {
        this.joininglettershow = false;
      } else {
        this.joininglettershow = true;
      }

      if (this.current == 0) {
        this.getFinalAllotmentdetailslisthere();
      } else if (this.current == 1) {
        this.getfinalallotmentmasterlisthere();
      }
    }
  }

  dupshowgeneratedlist: any = [];
  getFinalAllotmentdetailslisthere() {
    this.loadingRecords = true;
    this.isSpinning = true;
    this.api
      .getdraftAllotmentdetailslist(
        0,
        0,
        '',
        'asc',
        " AND IS_ALLOTED = 'Y' AND DRAFT_ALLOTMENT_ID = " + this.data.ID
      )
      .subscribe(
        (value) => {
          if (value.code == 200) {
            this.showgeneratedlist = value['data'];
            this.dupshowgeneratedlist = value['data'];
            this.isSpinning = false;
            this.loadingRecords = false;
            let newdate = new Date();
            let todaysdate = new Date(
              newdate.getFullYear(),
              newdate.getMonth(),
              newdate.getDate(),
              newdate.getHours(),
              newdate.getMinutes(),
              newdate.getSeconds()
            );
            this.data.FINAL_ORDER_GENERATE_DATE_TIME = this.datePipe.transform(
              todaysdate,
              'yyyy-MM-dd HH:mm:ss'
            );
            this.api.updateAllotementlistbasic(this.data).subscribe(
              (value) => {
                if (value.code == 200) {
                } else {
                }
              },
              (error) => { }
            );
          } else {
            this.isSpinning = false;
            this.loadingRecords = false;
          }
        },
        (error) => {
          this.isSpinning = false;
          this.loadingRecords = false;
        }
      );
  }

  getfinalallotmentmasterlisthere() {
    this.isSpinning = true;
    this.api
      .getDraftAllotmentListmaster(
        0,
        0,
        'ID',
        'asc',
        ' AND ID = ' + this.data.ID
      )
      .subscribe(
        (value) => {
          if (value.code == 200) {
            this.Finalallotlist = value['data'];
            this.isSpinning = false;
            if (this.Finalallotlist.length > 0) {
              this.data.FINAL_FILE_URL =
                this.Finalallotlist[0]['FINAL_FILE_URL'];
              if (
                this.data.FINAL_FILE_URL != null &&
                this.data.FINAL_FILE_URL != ''
              ) {
                this.joininglettershow = false;
              } else {
                this.joininglettershow = true;
                this.progressBar1 = false;
                this.percent1 = 0;
              }
              console.log(' this.Finalallotlist[0]', this.Finalallotlist[0]);

              this.data.ACCEPTANCE_END_DATE_TIME =
                this.Finalallotlist[0]['ACCEPTANCE_END_DATE_TIME'];
              this.dataAllotmentPublish.NEW_SIGNATURE_ID =
                this.Finalallotlist[0]['NEW_SIGNATURE_ID'];
              this.signature(this.dataAllotmentPublish.NEW_SIGNATURE_ID);
            }
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          this.isSpinning = false;
        }
      );
  }

  searchfilteredrecords = '';
  searchrecords() {
    if (
      this.searchfilteredrecords == '' ||
      this.searchfilteredrecords.length < 3
    ) {
      this.showgeneratedlist = this.dupshowgeneratedlist;
    } else {
      this.showgeneratedlist = this.dupshowgeneratedlist.filter(
        (option) =>
          option.EMPLOYEE_NAME.toLowerCase().indexOf(
            this.searchfilteredrecords.toLowerCase()
          ) !== -1
      );
    }
  }

  Previous() {
    this.current--;
    if (this.current == 0) {
      this.getFinalAllotmentdetailslisthere();
    } else if (this.current == 1) {
      this.getfinalallotmentmasterlisthere();
    }
  }

  nextstep() {
    this.current++;
  }

  previousfromzerototwo() { }

  changeSeniority(data, i) { }

  changelist() { }

  close() {
    this.drawerClose();
  }
  employeefilterid: any = [];
  employeefilterdata: any = [];
  newFlatNameTemp: any;
  newFlatNamePer: any;
  FlatList: any = [];
  changeFlatData: any;
  changeSerial(data: any) {
    this.isSpinning = true;
    this.changeFlatData = data;
    this.newFlatNameTemp = data.NEW_FLAT_NAME;
    this.employeefilterdata = [];
    var employeefilteridd: any = localStorage.getItem('employeefilterid');
    this.employeefilterid = JSON.parse(employeefilteridd);
    for (let i = 0; i < this.employeefilterid.length; i++) {
      if (this.employeefilterid[i]['EMP_ID'] != 0) {
        var ii = -1;
        ii = this.dupshowgeneratedlist.findIndex(
          (x) => x.EMP_ID == this.employeefilterid[i]['EMP_ID']
        );
        if (ii == -1) {
          this.employeefilterdata.push(this.employeefilterid[i]);
        }
      }
    }
    this.isSpinning = false;
    this.changeSerialVisible = true;
  }

  changeSerialVisible: boolean = false;

  closeChangeSerial() {
    this.changeFlatData = '';
    this.newFlatNamePer = '';
    this.REMARK = '';
    this.oldempname = '';
    this.changeSerialVisible = false;
    this.isSpinning = true;
    this.api
      .getAllDraftAllotment(
        0,
        0,
        '',
        '',
        " AND IS_ALLOTED = 'Y' AND DRAFT_ALLOTMENT_ID = " + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.showgeneratedlist = data['data'];
            this.dupshowgeneratedlist = data['data'];
            this.isSpinning = false;
          } else {
            this.showgeneratedlist = [];
            this.dupshowgeneratedlist = [];
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  oldempname: any = '';
  REMARK = '';
  UpdateChangeSerial() {
    this.isSpinning = true;
    if (
      this.newFlatNamePer == undefined ||
      this.newFlatNamePer == null ||
      this.newFlatNamePer == ''
    ) {
      this.message.error('Please Select New Employee Name', '');
      this.isSpinning = false;
    } else if (
      this.REMARK == null ||
      this.REMARK == undefined ||
      this.REMARK == ''
    ) {
      this.message.error('Please Enter Remark', '');
      this.isSpinning = false;
    } else {
      this.changeFlatData['NEW_EMP_ID'] = this.newFlatNamePer;
      this.changeFlatData['REMARK'] = this.REMARK;
      this.api.updateAllotementDetail(this.changeFlatData).subscribe(
        (successCode) => {
          if (successCode.code == '200') {
            this.message.success('Information Changed Successfully...', '');
            this.closeChangeSerial();
            this.searchfilteredrecords = '';
            this.isSpinning = false;
          } else {
            this.message.error('Information Has Not Changed...', '');
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.ACCEPTANCE_START_DATE_TIME)
    ) < 0;

  disabledDate11 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) < 0;

  isVisibleseniority = false;
  num: any;
  handleCancel() {
    this.num = new finalAllotmentdetails12();
    this.generateseniortydate();
    this.isVisibleseniority = false;
  }

  generateseniortydate() { }

  SaveListandnextstep0() {
    this.current = 1;
    let today = new Date();
    this.ACCEPTANCE_END_DATE_TIME = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7
    );
    this.ACCEPTANCE_START_DATE_TIME = new Date();
    this.getfinalallotmentmasterlisthere();
  }
  filemasterid: any;
  htmlContent: any;

  PublishToUser() {
    const element: any = document.getElementById('pageprintforback');
    this.htmlContent = element.outerHTML;
    if (
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == null ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == undefined ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID == 0
    ) {
      this.message.error('Please Select Signature', '');
    } else if (
      this.dataAllotmentPublish.FINAL_ALLOT_ORDER_NO == null ||
      this.dataAllotmentPublish.FINAL_ALLOT_ORDER_NO == undefined ||
      this.dataAllotmentPublish.FINAL_ALLOT_ORDER_NO == ''
    ) {
      this.message.error('Please Enter Final Allotment Order Number', '');
    } else if (
      this.ACCEPTANCE_END_DATE_TIME == null ||
      this.ACCEPTANCE_END_DATE_TIME == undefined ||
      this.ACCEPTANCE_END_DATE_TIME == ''
    ) {
      this.message.error('Please Select Acceptance End DateTime', '');
    } else {
      this.isSpinning = true;
      this.data.PUBLISHER_ID = this.userid;
      this.data.DRAFT_ALLOTMENT_ID = this.data.ID;
      this.ACCEPTANCE_START_DATE_TIME = this.datePipe.transform(
        this.ACCEPTANCE_START_DATE_TIME,
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data.FINAL_ALLOTMENT_PUBLISH_DATE = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );

      this.ACCEPTANCE_END_DATE_TIME = this.datePipe.transform(
        this.ACCEPTANCE_END_DATE_TIME,
        'yyyy-MM-dd HH:mm:ss'
      );

      let datasend = {
        ...this.data,
        ACCEPTANCE_START_DATE_TIME: this.ACCEPTANCE_START_DATE_TIME,
        ACCEPTANCE_END_DATE_TIME: this.ACCEPTANCE_END_DATE_TIME,
        SIGNNAME: this.SIGNNAME,
        NAME_HN: this.NAME_HN,
        POST: this.POST,
        POST_HIN: this.POST_HIN,
        OFFICE: this.OFFICE,
        OFFICE_HN: this.OFFICE_HN,
        SIGNATURE_IMAGE: this.SIGNATURE_IMAGE,
      };

      this.api.UpdateFinalAllotmentListmaster(datasend).subscribe(
        (value) => {
          if (value.code == 200) {
            this.filemasterid = value.FINAL_ALLOTMENT_MASTER_ID;
            this.api
              .tempWaitingListStepUpdate(
                this.scenioritycardId.ID,
                5,
                this.scenioritycardId.ALL_START_DATETIME,
                this.scenioritycardId.ALL_END_DATETIME
              )
              .subscribe((stepdata) => { });
            this.api
              .allotmentpdfgenrationfinal(
                this.data.PREFERENCES_MASTER_ID,
                this.data.DRAFT_ALLOTMENT_ID,
                this.data['RESIDENCE_TYPE_NAME'],
                this.data['RESIDENCE_TYPE_ID'],
                this.filemasterid,
                this.dataAllotmentPublish.NEW_SIGNATURE_ID,
                this.dataAllotmentPublish.FINAL_ALLOT_ORDER_NO,
                this.htmlContent
              )
              .subscribe(
                (data) => {
                  if (data.code == 200) {
                    // this.message.success(' Successfully', '');
                    this.message.success(
                      'Final Allotment Order Published Successfully',
                      ''
                    );

                    this.isSpinning = false;
                    this.drawerClose();
                  } else {
                    this.isSpinning = false;
                  }
                },
                (err) => {
                  this.isSpinning = false;
                  this.message.error(
                    'Failed To Publish Final Allotment Order',
                    ''
                  );
                }
              );
          } else {
            this.message.error('Failed To Publish Final Allotment Order', '');
            this.isSpinning = false;
          }
        },
        (error) => {
          this.message.error('Failed To Publish Final Allotment Order', '');
          this.isSpinning = false;
        }
      );
    }
  }

  cancel() { }
  joininglettershow = true;
  joindateletter: any;
  urljoinletter: any;
  progressBar1: boolean = false;
  percent1 = 0;
  timer1: any;

  ACCEPTANCE_END_DATE_TIME: any;
  ACCEPTANCE_START_DATE_TIME: any;

  onFileSelectedJoiningletter(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.joindateletter = <File>event.target.files[0];

      if (this.joindateletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.joindateletter.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urljoinletter = url;
        this.progressBar1 = true;
        if (
          this.data.FINAL_FILE_URL != undefined &&
          this.data.FINAL_FILE_URL.trim() != ''
        ) {
          var arr = this.data.FINAL_FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.timer1 = this.api
        .onUpload2(
          'finalAllotmentList',
          this.joindateletter,
          this.urljoinletter
        )
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
            this.data.FINAL_FILE_URL = null;
            this.joininglettershow = true;
            this.ACCEPTANCE_START_DATE_TIME = null;
            this.ACCEPTANCE_END_DATE_TIME = null;
            this.progressBar1 = false;
            this.percent1 = 0;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'Final Allotment Order File Uploaded Successfully',
                ''
              );
              this.isSpinning = false;
              this.data.FINAL_FILE_URL = this.urljoinletter;
              if (this.data.FINAL_FILE_URL != null) {
                this.joininglettershow = false;
              } else {
                this.joininglettershow = true;
              }

              if (
                this.data.FINAL_FILE_URL != null &&
                this.data.FINAL_FILE_URL != undefined &&
                this.data.FINAL_FILE_URL != ''
              ) {
                let today = new Date();
                this.ACCEPTANCE_END_DATE_TIME = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + 7
                );
                this.ACCEPTANCE_START_DATE_TIME = new Date();
              }
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.joindateletter = null;
      this.data.FINAL_FILE_URL = null;
      this.isSpinning = false;
    }
  }

  clearJoiningletletter(fileurl: string, folder: string) {
    this.isSpinning = true;
    var deletefile = folder + '/' + fileurl;
    this.api.deletealluploadsgrass(deletefile).subscribe(
      (value) => {
        if (value.code == 200) {
          this.message.success(
            'Final Allotment Order File Deleted Successfully',
            ''
          );
          this.data.FINAL_FILE_URL = null;
          this.joininglettershow = true;
          this.ACCEPTANCE_START_DATE_TIME = null;
          this.ACCEPTANCE_END_DATE_TIME = null;
          this.progressBar1 = false;
          this.percent1 = 0;
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Delete Final Allotment Order File', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Delete Final Allotment Order File', '');
        this.isSpinning = false;
      }
    );
  }

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

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'finalAllotmentList/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  ShowPdf: boolean = false;
  cancelclose() {
    this.ShowPdf = false;
  }
  previewpdf() {
    this.ShowPdf = true;
  }

  prefrancebulish: boolean = false;
  PublishToUser111() {
    if (
      this.dataAllotmentPublish.NEW_SIGNATURE_ID === null ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID === undefined ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID === '' ||
      this.dataAllotmentPublish.NEW_SIGNATURE_ID === 0
    ) {
      this.message.error('Please Select Signature', '');
    } else {
      this.prefrancebulish = true;
    }
  }
  cancelfinal() {
    this.prefrancebulish = false;
  }

  pdfDownloaddraft: boolean = false;
  IsspinningData = false;
  SIGNATURE_ID1: any;
  SIGNATURE_ID2: any;
  SIGNATURE_ID3: any;
  Signaturelist1: any = [];
  Signaturelist2: any = [];
  Signaturelist3: any = [];
  filtergignatureid = '';
  SECTION_TYPE1: any = '';
  NAME1: any = '';
  NAME_HN1: any = '';
  OFFICE_NAME1: any = '';
  OFFICE_NAME_HN1: any = '';
  POST1: any = '';
  POST_HN1: any = '';
  SECTION_TYPE2: any = '';
  NAME2: any = '';
  NAME_HN2: any = '';
  OFFICE_NAME2: any = '';
  OFFICE_NAME_HN2: any = '';
  POST2: any = '';
  POST_HN2: any = '';
  SECTION_TYPE3: any = '';
  NAME3: any = '';
  NAME_HN3: any = '';
  OFFICE_NAME3: any = '';
  OFFICE_NAME_HN3: any = '';
  POST3: any = '';
  POST_HN3: any = '';

  getsignaturedata() {
    this.api.getSignature(0, 0, 'ID', 'desc', this.filtergignatureid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturelist1 = data['data'];
          this.Signaturelist2 = data['data'];
          this.Signaturelist3 = data['data'];

          if (
            this.data.SIGNATURE_ID1 != null &&
            this.data.SIGNATURE_ID1 != undefined &&
            this.data.SIGNATURE_ID1 != ''
          ) {
            var f = this.Signaturelist1.filter(
              (item) => item['ID'] == this.data.SIGNATURE_ID1
            );
            this.SECTION_TYPE1 = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID1 = f[0]['ID'];
            this.NAME1 = f[0]['NAME'];
            this.NAME_HN1 = f[0]['NAME_HN'];
            this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN1 = f[0]['OFFICE_NAME_HN'];
            this.POST1 = f[0]['POST'];
            this.POST_HN1 = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID1 = data['data'][0]['ID'];
            this.SECTION_TYPE1 = data['data'][0]['SECTION_TYPE'];
            this.NAME1 = data['data'][0]['NAME'];
            this.NAME_HN1 = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME1 = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN1 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST1 = data['data'][0]['POST'];
            this.POST_HN1 = data['data'][0]['POST_HN'];
          }

          if (
            this.data.SIGNATURE_ID2 != null &&
            this.data.SIGNATURE_ID2 != undefined &&
            this.data.SIGNATURE_ID2 != ''
          ) {
            var f = this.Signaturelist2.filter(
              (item) => item['ID'] == this.data.SIGNATURE_ID2
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
            this.OFFICE_NAME_HN2 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST2 = data['data'][0]['POST'];
            this.POST_HN2 = data['data'][0]['POST_HN'];
          }

          if (
            this.data.SIGNATURE_ID3 != null &&
            this.data.SIGNATURE_ID3 != undefined &&
            this.data.SIGNATURE_ID3 != ''
          ) {
            var f = this.Signaturelist3.filter(
              (item) => item['ID'] == this.data.SIGNATURE_ID3
            );
            this.SECTION_TYPE3 = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID3 = f[0]['ID'];
            this.NAME3 = f[0]['NAME'];
            this.NAME_HN3 = f[0]['NAME_HN'];
            this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN3 = f[0]['OFFICE_NAME_HN'];
            this.POST3 = f[0]['POST'];
            this.POST_HN3 = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID3 = data['data'][0]['ID'];
            this.SECTION_TYPE3 = data['data'][0]['SECTION_TYPE'];
            this.NAME3 = data['data'][0]['NAME'];
            this.NAME_HN3 = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME3 = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN3 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST3 = data['data'][0]['POST'];
            this.POST_HN3 = data['data'][0]['POST_HN'];
          }
        } else {
        }
      },
      (error) => { }
    );
  }
  changesignature1(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE1 = '';
      this.NAME1 = '';
      this.NAME_HN1 = '';
      this.OFFICE_NAME1 = '';
      this.OFFICE_NAME_HN1 = '';
      this.POST1 = '';
      this.POST_HN1 = '';
      this.SIGNATURE_ID1 = null;
    } else {
      var f = this.Signaturelist1.filter((item) => item['ID'] == event);
      this.SECTION_TYPE1 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID1 = f[0]['ID'];
      this.NAME1 = f[0]['NAME'];
      this.NAME_HN1 = f[0]['NAME_HN'];
      this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN1 = f[0]['OFFICE_NAME_HN'];
      this.POST1 = f[0]['POST'];
      this.POST_HN1 = f[0]['POST_HN'];

      let signaturedata = {
        SIGNATURE_ID1: this.SIGNATURE_ID1,
        ID: this.data.ID,
      };
      this.IsspinningData = true;
      this.api.UpdateDraftAllotmentSignature(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            this.IsspinningData = false;
          }
        },
        (error) => {
          this.IsspinningData = false;
        }
      );
    }
  }
  changesignature2(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE2 = '';
      this.NAME2 = '';
      this.NAME_HN2 = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME_HN2 = '';
      this.POST2 = '';
      this.POST_HN2 = '';
      this.SIGNATURE_ID2 = null;
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
        SIGNATURE_ID2: this.SIGNATURE_ID2,
        ID: this.data.ID,
      };
      this.IsspinningData = true;
      this.api.UpdateDraftAllotmentSignature(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            this.IsspinningData = false;
          }
        },
        (error) => {
          this.IsspinningData = false;
        }
      );
    }
  }
  changesignature3(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE3 = '';
      this.NAME3 = '';
      this.NAME_HN3 = '';
      this.OFFICE_NAME3 = '';
      this.OFFICE_NAME_HN3 = '';
      this.POST3 = '';
      this.POST_HN3 = '';
      this.SIGNATURE_ID3 = null;
    } else {
      var f = this.Signaturelist3.filter((item) => item['ID'] == event);
      this.SECTION_TYPE3 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID3 = f[0]['ID'];
      this.NAME3 = f[0]['NAME'];
      this.NAME_HN3 = f[0]['NAME_HN'];
      this.OFFICE_NAME3 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN3 = f[0]['OFFICE_NAME_HN'];
      this.POST3 = f[0]['POST'];
      this.POST_HN3 = f[0]['POST_HN'];

      let signaturedata = {
        SIGNATURE_ID3: this.SIGNATURE_ID3,
        ID: this.data.ID,
      };
      this.IsspinningData = true;
      this.api.UpdateDraftAllotmentSignature(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            this.IsspinningData = false;
          }
        },
        (error) => {
          this.IsspinningData = false;
        }
      );
    }
  }

  downloadPdfdraft() {
    this.pdfDownloaddraft = true;

    const element = document.getElementById('pageprint');

    const opt = {
      margin: 0.2,

      filename: 'Final_Allotment_Order.pdf',

      image: { type: 'jpeg', quality: 7 },

      html2canvas: { scale: 7 },

      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .then(() => {
        this.pdfDownloaddraft = false;
      })
      .save();
  }

  dataAllotmentPublish: Allotmentpublishedlist = new Allotmentpublishedlist();

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
            }
          }
        },
        (err) => { }
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
