import { Component, Input } from '@angular/core';
import { APIServicesService } from '../../Services/APIService.service';
import { DomSanitizer } from '@angular/platform-browser';
import { QuarterMaster } from '../QUARTER/QuarterData';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { genertaesecondSenioritylist } from '../../Models/Generatesecondssenioritylist';
import { seniorityUpdate } from '../../Models/seniorityUpdate';
import { Allotmentpublishedlist } from '../../Models/AllotmentPublishlist';
import { grass } from 'src/app/app.constant';
import { HttpEventType } from '@angular/common/http';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-preferencesnew-details',
  templateUrl: './preferencesnew-details.component.html',
  styleUrls: ['./preferencesnew-details.component.css'],
  providers: [DatePipe],
})
export class PreferencesnewDetailsComponent {
  stage = 0;
  isRecordLoading: any = false;
  urll = grass.retriveimgUrl;
  @Input() drawerClose: Function;
  @Input() datamap: any;
  @Input() perfdata: any;
  @Input() dataListFlat: any;
  @Input() dataList: any;
  @Input() dataListFinal: any;
  @Input() empdata: any;
  @Input() count: any;
  fileallot: any = Allotmentpublishedlist;
  empID: any = Number(sessionStorage.getItem('userId'));
  data = new genertaesecondSenioritylist();
  isSpinning0: boolean = false;
  Allotmentchecklistdata: any = [];
  ResidenceTypereq: any = [];
  Allotmentdata: any = [];
  datas1: any = new seniorityUpdate();
  addDateTime: any;
  PrintDateTime: any;
  UploadDateTime: any;
  idddddd: any;
  selectCard: boolean = false;
  RECIDENCE: any;
  fil: boolean = false;
  loadingRecords: boolean = false;
  totalRecords = 1;
  pageIndex = 0;
  pageSize = 0;
  sortValue: string = 'desc';
  sortKey: string = 'SEQUENCE_NO';
  searchText: string = '';
  filterQuery: string = '';
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: QuarterMaster = new QuarterMaster();
  counter: number = 1;
  disablenext: boolean = false;
  disableprevious: boolean = false;
  printOrderModalVisible = false;
  view = 0;
  FlatprefListPDF = '';
  sanitizedLink: any = '';
  FLAT_REQUEST_ID: number;
  IS_SUBMITTED_STATUS: string = 'D';
  recicence1: any = [];
  RecidenceList: any[] = [];
  month = new Date().getMonth().toString() + new Date().getMonth().toString();
  year = new Date().getFullYear();
  MONTH: any = new Date().getMonth();
  YEAR: any = new Date().getFullYear();
  count1: any;
  empdataa: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  printOrderModalVisible2: boolean = false;
  printOrderModalVisible1: boolean = false;
  modalFile: any;
  allot: any;
  RejectRemark: boolean = false;
  preferencesListView: any;
  currentDate: any = new Date();
  PREFERENCE_DATETIME: any = new Date();
  PRINT_DATETIME: any = new Date();
  UPLOAD_DATETIME: any = new Date();
  viewPDF: boolean = false;
  appnPDF: any;
  urlappnPdf: any;
  isSpinning: boolean = false;
  prafraceconfirm: boolean = false;
  elementAsString: any;
  employeeID = sessionStorage.getItem('userId');
  RESIDENCE_TYPE: any;
  ID: any;
  datas: any;
  flatlists: any = [];
  emdata: any;
  flatIdsArray: any = [];
  prdata: any = [];
  filterforprep: any = '';
  marterid: any;
  pdfURL;
  applnform: boolean = true;
  printOrderVisible: boolean = false;
  printpage: boolean = false;
  ShowApplnFormPDF = '';
  viewPdfPrefer: any;
  pdfDownload: boolean = false;

  constructor(
    private api: APIServicesService,
    private sanitizer: DomSanitizer,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.empID = Number(sessionStorage.getItem('userId'));

    if (this.datamap != undefined) {
      this.api
        .getperdata(
          0,
          0,
          'ID',
          'asc',
          ' AND PREFERENCES_MASTER_ID=' +
          this.datamap.ID +
          ' AND EMP_ID=' +
          Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.perfdata = data['data'][0];

                if (
                  this.perfdata != undefined &&
                  this.perfdata != null &&
                  this.perfdata != ''
                ) {
                  this.addDateTime = this.perfdata.ADD_DATE_TIME;
                  this.PrintDateTime = this.perfdata.PRINT_DATE_TIME;
                  this.UploadDateTime = this.perfdata.UPLOAD_DATE_TIME;
                }
              }
              this.isRecordLoading = false;
            }
          },
          (err) => { }
        );
    }
  }

  close() {
    this.drawerClose();
  }

  displayc() {
    this.stage++;

    if (this.stage == 6) {
      this.disablenext = true;
      this.drawerClose();
    }
  }

  previous() {
    if (this.stage == 1) {
      this.isRecordLoading = true;
      this.api
        .getmployeeaddbulk(
          0,
          0,
          'PREFERENCE_NO',
          'asc',
          ' AND PREFERENCES_MASTER_ID = ' +
          this.datamap.ID +
          ' AND EMP_ID = ' +
          Number(sessionStorage.getItem('userId'))
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              this.stage = 0;
              if (data['data'].length > 0) {
                this.dataListFlat = data['data'];
              } else {
                this.dataListFlat = [];
              }
              this.isRecordLoading = false;
            }
          },
          (err) => { }
        );
    } else {
      if (this.stage == 2) {
        this.isRecordLoading = true;

        this.api
          .getperdata(
            0,
            0,
            'ID',
            'asc',
            ' AND PREFERENCES_MASTER_ID=' +
            this.datamap.ID +
            ' AND EMP_ID=' +
            Number(sessionStorage.getItem('userId'))
          )
          .subscribe(
            (data: any) => {
              if (data['code'] == 200) {
                this.stage = 1;
                if (data['data'].length > 0) {
                  this.perfdata = data['data'][0];

                  if (
                    this.perfdata != undefined &&
                    this.perfdata != null &&
                    this.perfdata != ''
                  ) {
                    this.addDateTime = this.perfdata.ADD_DATE_TIME;
                    this.PrintDateTime = this.perfdata.PRINT_DATE_TIME;
                    this.UploadDateTime = this.perfdata.UPLOAD_DATE_TIME;
                  }
                }
                this.isRecordLoading = false;
              }
            },
            (err) => { }
          );
      }
    }
  }

  getS(link: string) {
    if (this.stage == 2) {
      var a: any = this.api.retriveimgUrl + 'applicationForm/' + link;
    }
  }

  getCity(): void {
    this.api
      .getAllotmenmaster(0, 0, 'ID', 'desc', ' AND EMPLOYEE_ID=' + this.empID)
      .subscribe(
        (data) => {
          if (data['data'].length > 0) {
            let allotmentdata = data['data'][0];

            this.api
              .residenceTypeRequest(
                0,
                0,
                'RESIDENCE_TYPE',
                'asc',
                ' AND FLAT_REQUEST_ID=' + allotmentdata.ID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.RecidenceList = data['data'];
                }
              });
          }
        },
        (err) => { }
      );
  }

  selectrecidence(e: any) {
    this.recicence1 = e;
  }
  clearfilt() {
    this.filterQuery = '';
    this.recicence1 = '';
    this.RECIDENCE = ';';
    this.fil = false;
    this.loadingRecords = true;
    this.dataList = [];
    this.dataListFlat = [];
    this.IS_SUBMITTED_STATUS = 'D';
  }

  addCard(data: any) {
    this.empdataa = this.empdata[0];
    const dob = new Date(this.empdataa.DOB);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    var a: any = 0;
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      a = age - 1;
    } else {
      a = age;
    }
    if (this.dataListFlat.length == 0) {
      this.dataListFlat = [
        ...this.dataListFlat,
        {
          ID: this.dataListFlat.length + 1,
          AREA_ID: data.AREA_ID,
          AREA_NAME: data.AREA_NAME,
          BUILDING_ID: data.BUILDING_ID,
          BUILDING_NAME: data.BUILDING_NAME,
          FLAT_ID: data.FLAT_ID,
          FLAT_NAME: data.NAME,
          CITY_ID: data.CITY_ID,
          CITY_NAME: data.CITY_NAME,
          FLOOR_ID: data.FLOOR_ID,
          FLOOR_NAME: data.FLOOR_NAME,
          ROOM_TYPE: data.ROOM_TYPE,
          NAME: data.NAME,
          PREFERENCE_NO: this.dataListFlat.length + 1,
          ROSTER_POINT_NO: data.ROSTER_POINT_NO,
        },
      ];
      this.flatIdsArray = [];
      this.flatIdsArray = this.dataListFlat.map(item => item.FLAT_ID);

      this.dataList = this.dataListFinal.filter(item => !this.flatIdsArray.includes(item.FLAT_ID));
      this.count = this.dataList.length;
    } else {
      if (this.dataListFlat.length <= 19) {
        let hasvalue = this.dataListFlat.find((value: any) => {
          return data['FLAT_ID'] == value['FLAT_ID'];
        });

        if (hasvalue) {
          this.message.info(
            'Quarter Already Exist, Please Add Another Quarter',
            ''
          );
        } else {
          this.dataListFlat = [
            ...this.dataListFlat,
            {
              ID: this.dataListFlat.length + 1,
              AREA_ID: data.AREA_ID,
              AREA_NAME: data.AREA_NAME,
              BUILDING_ID: data.BUILDING_ID,
              BUILDING_NAME: data.BUILDING_NAME,
              FLAT_ID: data.FLAT_ID,
              FLAT_NAME: data.NAME,
              CITY_ID: data.CITY_ID,
              CITY_NAME: data.CITY_NAME,
              FLOOR_ID: data.FLOOR_ID,
              FLOOR_NAME: data.FLOOR_NAME,
              ROOM_TYPE: data.ROOM_TYPE,
              NAME: data.NAME,
              PREFERENCE_NO: this.dataListFlat.length + 1,
              ROSTER_POINT_NO: data.ROSTER_POINT_NO,
            },
          ];
          this.flatIdsArray = [];
          if (this.dataListFlat.length > 0) {
            this.dataListFlat.forEach(item => {
              this.flatIdsArray.push(item.FLAT_ID);
            });
          } else {
            this.flatIdsArray = [];
          }
          if (this.flatIdsArray.length > 0) {
            this.dataList = this.dataListFinal.filter(item => !this.flatIdsArray.includes(item.FLAT_ID));
          } else {
            this.dataList = this.dataListFinal;
          }
          this.count = this.dataList.length;
        }
      } else {
        this.message.error('Maximum 20 Quarter Preferences Are Allowed', '');
        this.loadingRecords = false;
      }
    }
  }

  removeCard(data: any): void {
    this.dataListFlat = this.dataListFlat.filter((d) => d['ID'] !== data.ID);
    for (let i = 0; i < this.dataListFlat.length; i++) {
      this.dataListFlat[i]['ID'] = i + 1;
      this.dataListFlat[i]['PREFERENCE_NO'] = i + 1;
    }
    this.flatIdsArray = [];
    if (this.dataListFlat.length > 0) {
      this.dataListFlat.forEach(item => {
        this.flatIdsArray.push(item.FLAT_ID);
      });
    } else {
      this.flatIdsArray = [];
    }
    if (this.flatIdsArray.length > 0) {
      this.filterforprep = ' AND FLAT_ID NOT IN (' + this.flatIdsArray + ')'
    } else {
      this.filterforprep = '';
    }
    this.api
      .getpredranceflatdata(
        0,
        0,
        'SEQUENCE_NO',
        'desc',
        " AND STATUS=1 AND AVAILABLE_STATUS='A' AND IS_PUBLISHED=1 " +
        ' AND RESIDENCE_TYPE_ID = ' +
        this.datamap.RESIDENCE_TYPE_ID + this.filterforprep
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.dataList = data['data'];
            this.dataListFinal = data['data'];
            this.count = data['count'];
          }
        }
      )

  }

  onDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.dataListFlat,
        event.previousIndex,
        event.currentIndex
      );
    }

    for (let i = 0; i < this.dataListFlat.length; i++) {
      this.dataListFlat[i]['ID'] = i + 1;
      this.dataListFlat[i]['PREFERENCE_NO'] = i + 1;
    }

    this.dataListFlat = [...this.dataListFlat];
  }

  onSaveBtnClick(): void {
    let preferenncedata: any = [];
    if (this.PREFERENCE_DATETIME != undefined) {
      this.PREFERENCE_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.PRINT_DATETIME != undefined) {
      this.PRINT_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.UPLOAD_DATETIME != undefined) {
      this.UPLOAD_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.stage == 0) {
      var data1 = this.PREFERENCE_DATETIME;
    } else if (this.stage == 1) {
      var data2 = this.PRINT_DATETIME;
    } else if (this.stage == 2) {
      var data3 = this.UPLOAD_DATETIME;
    } else {
      var data = '';
    }
    for (let i = 0; i < this.dataListFlat.length; i++) {
      preferenncedata.push({
        EMPLOYEE_ID: this.empID,
        FLAT_REQUEST_ID: this.Allotmentdata.ID,
        CITY_ID: this.dataListFlat[i]['CITY_ID'],
        AREA_ID: this.dataListFlat[i]['AREA_ID'],
        BLOCK_ID: this.dataListFlat[i]['BLOCK_ID'],
        BUILDING_ID: this.dataListFlat[i]['BUILDING_ID'],
        FLOOR_ID: this.dataListFlat[i]['FLOOR_ID'],
        FLAT_ID: this.dataListFlat[i]['FLAT_ID'],
        PREFERENCE_NO: this.dataListFlat[i]['PREFERENCE_NO'],
        ROSTER_POINT_NO: this.dataListFlat[i]['ROSTER_POINT_NO'],
        TYPE: this.datamap.RESIDENCE_TYPE,
        CLIENT_ID: 1,
        FLAT_PREFRENCE_URL: null,
        IS_SUBMITTED: 'D',
      });
    }

    this.api
      .createFlatPreferencenew(
        preferenncedata,
        this.Allotmentdata.ID,
        this.datamap.RESIDENCE_TYPE,
        this.stage,
        data1,
        data2,
        data3
      )
      .subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.message.success(
              'Your Quarter Preference Has Been Saved Successfully',
              ''
            );
          } else {
            this.message.error('Preferences submission time has now ended.', '');

          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  step1save() {
    this.isRecordLoading = true;

    this.marterid = this.datamap.ID;
    let preferenncedata: any = [];
    for (let i = 0; i < this.dataListFlat.length; i++) {
      preferenncedata.push({
        PREFERENCES_MASTER_ID: this.datamap.ID,
        EMP_ID: this.empID,
        FLAT_ID: this.dataListFlat[i]['FLAT_ID'],
        PREFERENCE_NO: this.dataListFlat[i]['PREFERENCE_NO'],
        CLIENT_ID: 1,
      });
    }
    this.perfdata.ADD_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );

    if (this.perfdata.ID == 0) {
      this.perfdata.PREFERENCES_MASTER_ID = this.marterid;
      this.perfdata.EMP_ID = this.empID;
      this.perfdata.STEP_NO = 1;
      this.api.preferanceEmployeecreate(this.perfdata).subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.api
              .getperdata(
                0,
                0,
                'ID',
                'asc',
                ' AND PREFERENCES_MASTER_ID=' +
                this.perfdata.PREFERENCES_MASTER_ID +
                ' AND EMP_ID=' +
                Number(sessionStorage.getItem('userId'))
              )
              .subscribe(
                (data: any) => {
                  if (data['code'] == 200) {
                    if (data['data'].length > 0) {
                      this.perfdata = data['data'][0];

                      if (
                        this.perfdata != undefined &&
                        this.perfdata != null &&
                        this.perfdata != ''
                      ) {
                        this.addDateTime = this.perfdata.ADD_DATE_TIME;
                        this.PrintDateTime = this.perfdata.PRINT_DATE_TIME;
                        this.UploadDateTime = this.perfdata.UPLOAD_DATE_TIME;
                      }
                    }
                  }
                },
                (err) => { }
              );

            this.api
              .createmployeeaddbulk(preferenncedata, this.marterid)
              .subscribe(
                (value) => {
                  if (value['code'] == 200) {
                    this.message.success(
                      'Your Quarter Preference Has Been Saved Successfully',
                      ''
                    );
                    this.stage = 1;
                    this.isRecordLoading = false;
                  } else if (value['code'] == 400) {
                    this.message.error(
                      'At Least Add One Preference For Further Process',
                      ''
                    );
                    this.isRecordLoading = false;
                  } else {
                    this.isRecordLoading = false;
                    this.message.error('Something Went Wrong', '');
                  }
                },
                (error) => {
                  this.message.error('Something Went Wrong', '');
                  this.isRecordLoading = false;
                }
              );
          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
          this.isRecordLoading = false;
        }
      );
    } else {
      this.perfdata.EMP_ID = Number(sessionStorage.getItem('userId'))

      this.api.preferanceEmployeeupdate(this.perfdata).subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.api
              .createmployeeaddbulk(preferenncedata, this.marterid)
              .subscribe(
                (value) => {
                  if (value['code'] == 200) {
                    this.message.success(
                      'Your Quarter Preference Has Been Saved Successfully',
                      ''
                    );
                    this.stage = 1;
                    this.isRecordLoading = false;
                  } else if (value['code'] == 400) {
                    this.message.error(
                      'At Least Add One Preference For Further Process',
                      ''
                    );
                    this.isRecordLoading = false;
                  } else {
                    this.message.error('Something Went Wrong', '');
                    this.isRecordLoading = false;
                  }
                },
                (error) => {
                  this.message.error('Something Went Wrong', '');
                  this.isRecordLoading = false;
                }
              );
          } else if (value['code'] == 300) {
            this.isRecordLoading = false;
            this.message.error("You can't fill the preferences now due to the period over.", '');

          } else {
            this.isRecordLoading = false;
            this.message.error('Something Went Wrong', '');
          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
          this.isRecordLoading = false;
        }
      );
    }
  }

  submitp() {
    const element: any = document.getElementById('printForm11');
    this.elementAsString = element.outerHTML;
    this.percent = 0;
    this.progressBar = false;
    this.isRecordLoading = true;
    this.perfdata.STEP_NO = 2;
    this.perfdata.PRINT_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );

    this.perfdata.EMP_ID = Number(sessionStorage.getItem('userId'))

    this.api.preferanceEmployeeupdate(this.perfdata).subscribe(
      (value) => {
        if (value['code'] == 200) {
          this.api
            .getperdata(
              0,
              0,
              'ID',
              'asc',
              ' AND PREFERENCES_MASTER_ID=' +
              this.datamap.ID +
              ' AND EMP_ID=' +
              Number(sessionStorage.getItem('userId'))
            )
            .subscribe(
              (data: any) => {
                if (data['code'] == 200) {
                  if (data['data'].length > 0) {
                    this.perfdata = data['data'][0];
                    this.step3save();
                    if (
                      this.perfdata != undefined &&
                      this.perfdata != null &&
                      this.perfdata != ''
                    ) {
                      this.addDateTime = this.perfdata.ADD_DATE_TIME;
                      this.PrintDateTime = this.perfdata.PRINT_DATE_TIME;
                      this.UploadDateTime = this.perfdata.UPLOAD_DATE_TIME;
                    }
                  }
                } else {
                  this.isRecordLoading = false;
                  this.message.error('Preferences submission time has now ended.', '');
                }
              },
              (err) => {
                this.isRecordLoading = false;
                this.message.error('Something Went Wrong', '');
              });
        } else if (value['code'] == 300) {
          this.isRecordLoading = false;
          this.message.error('Preferences submission time has now ended.', '');
        } else {
          this.isRecordLoading = false;
          this.message.error('Something Went Wrong', '');
        }
      },
      (error) => {
        this.message.error('Something Went Wrong', '');
        this.isRecordLoading = false;
      }
    );
  }
  step2save() {
    this.prafraceconfirm = true;
  }

  step3save() {
    this.perfdata.STEP_NO = 3;
    this.perfdata.UPLOAD_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.perfdata.SUBMIT_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.perfdata.IS_SUBMITTED = 1;
    this.perfdata.EMP_ID = Number(sessionStorage.getItem('userId'))

    this.api.preferanceEmployeeupdate(this.perfdata).subscribe(
      (value) => {
        if (value['code'] == 200) {
          this.api.prefrancepdf(this.elementAsString, this.perfdata.ID).subscribe(
            (data) => {
              if (data.code == 200) {
                this.message.success(
                  'Your Quarter Preference Has Been saved Successfully',
                  ''
                );
                this.isRecordLoading = false;
                this.prafraceconfirm = false;
                this.drawerClose();
                this.close();
              } else {
                this.isRecordLoading = false;
                this.message.error('Something Went Wrong', '');
              }
            }, err => {
              this.isRecordLoading = false;
              this.message.error('Something Went Wrong', '');
            });
        } else if (value['code'] == 300) {
          this.isRecordLoading = false;
          this.message.error('Preferences submission time has now ended.', '');
        } else {
          this.isRecordLoading = false;
          this.message.error('Something Went Wrong', '');
        }
      },
      (error) => {
        this.message.error('Something Went Wrong', '');
        this.isRecordLoading = false;
      });
  }

  step3savecon() {
    if (
      this.perfdata.UPLOAD_URL == undefined ||
      this.perfdata.UPLOAD_URL == '' ||
      this.perfdata.UPLOAD_URL == null
    ) {
      this.message.error('Please Upload Application Form', '');
    } else {
      this.prafraceconfirm = true;
    }
  }

  cancelcon() {
    this.prafraceconfirm = false;
  }

  onSubmitBtnClick(): void {
    let preferenncedata: any = [];

    for (let i = 0; i < this.dataListFlat.length; i++) {
      preferenncedata.push({
        EMPLOYEE_ID: this.empID,
        FLAT_REQUEST_ID: this.Allotmentdata.ID,
        CITY_ID: this.dataListFlat[i]['CITY_ID'],
        AREA_ID: this.dataListFlat[i]['AREA_ID'],
        BLOCK_ID: this.dataListFlat[i]['BLOCK_ID'],
        BUILDING_ID: this.dataListFlat[i]['BUILDING_ID'],
        FLOOR_ID: this.dataListFlat[i]['FLOOR_ID'],
        FLAT_ID: this.dataListFlat[i]['FLAT_ID'],
        PREFERENCE_NO: this.dataListFlat[i]['PREFERENCE_NO'],
        ROSTER_POINT_NO: this.dataListFlat[i]['ROSTER_POINT_NO'],
        TYPE: this.datamap.RESIDENCE_TYPE,
        CLIENT_ID: 1,
        FLAT_PREFRENCE_URL: null,
        IS_SUBMITTED: 'S',
      });
    }

    if (this.PREFERENCE_DATETIME != undefined) {
      this.PREFERENCE_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.PRINT_DATETIME != undefined) {
      this.PRINT_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.UPLOAD_DATETIME != undefined) {
      this.UPLOAD_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    this.MONTH = this.datepipe.transform(new Date(), 'MM');
    this.YEAR = this.datepipe.transform(new Date(), 'YYYY');

    if (this.stage == 0) {
      var data1 = this.PREFERENCE_DATETIME;
    } else if (this.stage == 1) {
      var data2 = this.PRINT_DATETIME;
    } else if (this.stage == 2) {
      var data3 = this.UPLOAD_DATETIME;
    } else {
      var data = '';
    }

    this.RESIDENCE_TYPE = this.datamap.RESIDENCE_TYPE;

    this.api
      .createFlatPreferencenew(
        preferenncedata,
        this.Allotmentdata.ID,
        this.datamap.RESIDENCE_TYPE,
        this.stage,
        data1,
        data2,
        data3
      )
      .subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.message.success(
              'Your Quarter Preference Has Been Submitted Successfully',
              ''
            );
            this.stage = 1;

            this.api
              .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.empID)
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    let employeedata = data['data'];
                    this.emdata = employeedata;
                  }

                  this.api
                    .getpredranceflatdata(
                      0,
                      0,
                      'SEQUENCE_NO',
                      'desc',
                      " AND STATUS=1 AND VACANT_STATUS='A' AND IS_PUBLISHED=1" +
                      ' AND RESIDENCE_TYPE_ID = ' +
                      this.RESIDENCE_TYPE
                    )
                    .subscribe(
                      (data) => {
                        if (data['code'] == 200) {
                          this.flatlists = data['data'];
                        }
                      },
                      (err) => {
                        this.loadingRecords = false;
                      }
                    );
                },
                (err) => {
                  this.loadingRecords = false;
                }
              );
          } else {
            this.message.error('Preferences submission time has now ended.', '');

            this.loadingRecords = false;
          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
          this.loadingRecords = false;
        }
      );
  }

  onSubmitBtnPrint() {
    let preferenncedata: any = [];

    if (this.PREFERENCE_DATETIME != undefined) {
      this.PREFERENCE_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.PRINT_DATETIME != undefined) {
      this.PRINT_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.UPLOAD_DATETIME != undefined) {
      this.UPLOAD_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    this.MONTH = this.datepipe.transform(new Date(), 'MM');
    this.YEAR = this.datepipe.transform(new Date(), 'YYYY');

    if (this.stage == 0) {
      var data1 = this.PREFERENCE_DATETIME;
    } else if (this.stage == 1) {
      var data2 = this.PRINT_DATETIME;
    } else if (this.stage == 2) {
      var data3 = this.UPLOAD_DATETIME;
    } else {
      var data = '';
    }

    for (let i = 0; i < this.dataListFlat.length; i++) {
      preferenncedata.push({
        EMPLOYEE_ID: this.empID,
        FLAT_REQUEST_ID: this.Allotmentdata.ID,
        CITY_ID: this.dataListFlat[i]['CITY_ID'],
        AREA_ID: this.dataListFlat[i]['AREA_ID'],
        BLOCK_ID: this.dataListFlat[i]['BLOCK_ID'],
        BUILDING_ID: this.dataListFlat[i]['BUILDING_ID'],
        FLOOR_ID: this.dataListFlat[i]['FLOOR_ID'],
        FLAT_ID: this.dataListFlat[i]['FLAT_ID'],
        PREFERENCE_NO: this.dataListFlat[i]['PREFERENCE_NO'],
        ROSTER_POINT_NO: this.dataListFlat[i]['ROSTER_POINT_NO'],
        TYPE: this.datamap.RESIDENCE_TYPE,
        CLIENT_ID: 1,
        FLAT_PREFRENCE_URL: null,
        IS_SUBMITTED: 'S',
      });
    }
    this.stage = 1;
    this.api
      .createFlatPreferencenew(
        preferenncedata,
        this.Allotmentdata.ID,
        this.datamap.RESIDENCE_TYPE,
        this.stage,
        data1,
        data2,
        data3
      )
      .subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.message.success(
              'Your Quarter Preference Has Been Submitted Successfully',
              ''
            );
            this.stage = 2;
          } else {
            this.message.error('Preferences submission time has now ended.', '');

          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  onSubmitBtnView() {
    let preferenncedata: any = [];

    if (this.PREFERENCE_DATETIME != undefined) {
      this.PREFERENCE_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.PRINT_DATETIME != undefined) {
      this.PRINT_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    if (this.UPLOAD_DATETIME != undefined) {
      this.UPLOAD_DATETIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:MM:S'
      );
    }

    this.MONTH = this.datepipe.transform(new Date(), 'MM');
    this.YEAR = this.datepipe.transform(new Date(), 'YYYY');

    if (this.stage == 0) {
      var data1 = this.PREFERENCE_DATETIME;
    } else if (this.stage == 1) {
      var data2 = this.PRINT_DATETIME;
    } else if (this.stage == 2) {
      var data3 = this.UPLOAD_DATETIME;
    } else {
      var data = '';
    }

    for (let i = 0; i < this.dataListFlat.length; i++) {
      preferenncedata.push({
        PREFERENCES_MASTER_ID: this.datas1.ID,
        EMP_ID: this.empID,
        FLAT_ID: this.dataListFlat[i]['FLAT_ID'],
        PREFERENCE_NO: this.dataListFlat[i]['PREFERENCE_NO'],
        CLIENT_ID: 1,
      });
    }

    this.stage = 2;
    this.api
      .createFlatPreferencenew(
        preferenncedata,
        this.Allotmentdata.ID,
        this.datamap.RESIDENCE_TYPE,
        this.stage,
        data1,
        data2,
        data3
      )
      .subscribe(
        (value) => {
          if (value['code'] == 200) {
            this.message.success(
              'Your Quarter Preference Has Been Submitted Successfully',
              ''
            );
            this.close();
          } else {
            this.message.error('Preferences submission time has now ended.', '');

          }
        },
        (error) => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }
  openuploadmodal() {
    this.RejectRemark = true;
  }

  applnformshow(pdfURL: string): void {
    window.open(this.urll + 'employeePreferance/' + pdfURL, '_blank');
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  printOrderModalCancel1() {
    this.printOrderModalVisible1 = false;
  }

  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.appnPDF = <File>event.target.files[0];

      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.perfdata.UPLOAD_URL != undefined &&
          this.perfdata.UPLOAD_URL.trim() != ''
        ) {
          var arr = this.perfdata.UPLOAD_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload2('employeePreferance', this.appnPDF, this.urlappnPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }

          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
            }
          }
          if (res.body['code'] == 200) {
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar = false;
            this.percent = 0;
            this.perfdata.UPLOAD_URL = null;
          }
          this.perfdata.UPLOAD_URL = this.urlappnPdf;
          if (this.perfdata.UPLOAD_URL != null) {
            this.applnform = false;
          } else {
            this.applnform = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.appnPDF = null;
      this.perfdata.UPLOAD_URL = null;
    }
  }

  clearapplnform(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.perfdata.UPLOAD_URL = null;
          this.applnform = true;
          this.message.success('File Deleted Successfully', '');
          this.progressBar = false;
        } else {
          this.message.error('Failed to delete uploaded form', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete Profile Photo', '');
      }
    );
  }

  printOrderModalCancel2() {
    this.printOrderModalVisible2 = false;
  }
  view1() {
    this.printOrderModalVisible2 = true;
  }
  downloadPdf() {
    this.pdfDownload = true;
    const element = document.getElementById('printpage');
    const opt = {
      margin: 0.2,
      filename: 'PROFORMA FOR PREFERENCE.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
    this.pdfDownload = false;
  }
}