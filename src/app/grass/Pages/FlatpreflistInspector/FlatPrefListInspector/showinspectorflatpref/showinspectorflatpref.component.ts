import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { DatePipe } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Allotmentpublishedlist } from 'src/app/grass/Models/AllotmentPublishlist';
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as html2pdf from 'html2pdf.js';
import { HttpEventType } from '@angular/common/http';
import { appkeys, grass } from 'src/app/app.constant';

@Component({
  selector: 'app-showinspectorflatpref',
  templateUrl: './showinspectorflatpref.component.html',
  styleUrls: ['./showinspectorflatpref.component.css'],
  providers: [DatePipe],
})
export class ShowinspectorflatprefComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any;
  @Input() isPrevious: any;
  @Input() VacantFlatScenarityId: any;
  imgurl = appkeys.retriveimgUrl;

  RESIDENCE_TYPE: any;

  drawerVisibleAllotment: boolean = false;
  drawerTitleAllotment!: string;
  current = 0;
  formTitle = 'Quarter Preference Order';
  @Input() flatPreferenceDataList: any[] = [];
  @Input() employeefilterid: any[] = [];
  loadingRecords = false;
  totalRecords = 1;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() flatPreferenceList: any;
  sortValue: string = 'asc';
  sortKey: string = 'SENIORITY_SEQ_NO';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: any = 'default';
  filterClass: string = 'filter-invisible';
  ResidenceType: any = [];
  isSpinning = false;
  // RESIDENCE_TYPE = '';
  cutoffPeriod: any;
  Status = 'P';
  userid: any;
  roleid: any;
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME'],
  ];

  generatePDF: boolean = true;
  datenew = new Date();
  Datenew = new Date(this.datenew.getFullYear(), this.datenew.getMonth());
  ListSpinning = false;
  listisgenerated = false;
  FlatAllotmentmaster: any = [];
  inspectorname: any;

  newdate: any = new Date();
  fivedaysfromnow: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth(),
    this.newdate.getDate() + 2
  );
  todaysdate: any = '';
  todaysyear: any = '';
  nextyear: any = '';

  isPublish: boolean = false;
  dataAllotmentPublish: Allotmentpublishedlist = new Allotmentpublishedlist();
  isOk = true;
  dateobj = new Date();

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private modal: NzModalService
  ) {}
  key: any = grass.key;
  showcolumn = false;
  ngOnInit(): void {
    this.getAllUsers();
    this.key = grass.key;
    // this.current = 0;
    this.roleid = Number(sessionStorage.getItem('roleId'));
    this.userid = Number(sessionStorage.getItem('userId'));
    let currentDatcute: Date = new Date();
    this.cutoffPeriod = new Date(
      currentDatcute.getFullYear(),
      currentDatcute.getMonth(),
      0
    );

    this.todaysdate = this.datepipe.transform(this.newdate, 'dd/MM/yyyy');
    this.fivedaysfromnow = this.datepipe.transform(
      this.fivedaysfromnow,
      'dd/MM/yyyy'
    );
    this.todaysyear = this.datepipe.transform(this.newdate, 'yyyy');
    this.nextyear = Number(this.todaysyear) + 1;

    if (this.data) {
      if (this.data.RESIDENCE_TYPE_ID > 4) {
        this.showcolumn = true;
      } else {
        this.showcolumn = false;
      }
    }

    if (this.roleid == 15) {
      this.filtergignatureid = ' AND SERVICE_ID = 5 ';
      // this.getsignaturedata();

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
          (error) => {}
        );

      this.search();
    }

    // this.search(true);
    // this.getResidenceType();

    // if (this.data.FILE_URL != null) {
    //   this.generatePDF = false;
    // } else {
    //   this.generatePDF = true;
    // }
    // this.generatelist();
    // this.getResidenceTypeList();
    // this.getFlatAllotmentList();
  }
  cancel() {}
  close() {
    this.drawerClose();
  }
  getResidenceType() {
    this.api.getGradPay(0, 0, 'ID', 'asc', ' AND STATUS = 1 ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          let listofresidence = [];
          listofresidence = data['data'];
          function removeDuplicates(arr: any) {
            const uniqueObjects: any = [];
            const uniqueResidenceTypeIds = new Set();
            for (const obj of arr) {
              if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
                uniqueObjects.push(obj);
                uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
              }
            }
            return uniqueObjects;
          }
          const result = removeDuplicates(listofresidence);
          this.ResidenceType = result;
        }
      },
      (err) => {}
    );
  }

  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }

  searchfilteredrecords = '';
  searchrecords() {
    if (
      this.searchfilteredrecords == '' ||
      this.searchfilteredrecords.length < 3
    ) {
      this.flatAllotmentDataList = this.dupflatAllotmentDataList;
    } else {
      this.flatAllotmentDataList = this.dupflatAllotmentDataList.filter(
        (option) =>
          option.EMPLOYEE_NAME.toLowerCase().indexOf(
            this.searchfilteredrecords.toLowerCase()
          ) !== -1
      );
    }
  }

  applyFilter() {
    if (
      this.RESIDENCE_TYPE == null ||
      this.RESIDENCE_TYPE == undefined ||
      this.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      this.isFilterApplied = 'primary';
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
        likeQuery = likeQuery + ')';
      }
      this.search(true);
    }
  }
  clearFilter() {
    this.RESIDENCE_TYPE = '';
    this.search(true);
    this.isFilterApplied = 'default';
  }

  keyup(event: any) {
    this.search(true);
  }
  prefranceid: any;
  search(reset: boolean = false) {
    this.prefranceid = this.data.ID;
    this.flatPreferenceDataList = [];
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'SENIORITY_SEQ_NO';
      this.sortValue = 'asc';
    }
    this.loadingRecords = true;
    this.isSpinning = true;
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
      likeQuery = likeQuery + ')';
    }
    if (this.RESIDENCE_TYPE != '') {
      this.api
        .getFlatAllotmentList(
          this.pageIndex,
          this.pageSize,
          'SENIORITY_SEQ_NO',
          'asc',
          ' AND PREFERENCES_MASTER_ID = ' + this.data.ID + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.totalRecords = data['count'];
              this.flatPreferenceDataList = data['data'];
              if (this.flatPreferenceDataList.length > 0) {
                for (let i = 0; i < this.flatPreferenceDataList.length; i++) {
                  this.flatPreferenceDataList[i]['PREFERENCES'] = JSON.parse(
                    this.flatPreferenceDataList[i]['PREFERENCES']
                  );
                  this.flatPreferenceDataList[i]['PREFERENCES'] =
                    this.flatPreferenceDataList[i]['PREFERENCES'].sort(
                      function (a, b) {
                        return a.PREFERENCE_NO - b.PREFERENCE_NO;
                      }
                    );
                }
              }
            } else {
              this.flatPreferenceDataList = [];
            }

            // this.flatPreferenceDataList = data['data'];
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (error) => {
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          }
        );
    } else {
      this.api
        .getFlatAllotmentList(
          this.pageIndex,
          this.pageSize,
          'SENIORITY_SEQ_NO',
          'asc',
          ' AND PREFERENCES_MASTER_ID = ' + this.data.ID + likeQuery
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.flatPreferenceDataList = data['data'];
              if (this.flatPreferenceDataList.length > 0) {
                for (let i = 0; i < this.flatPreferenceDataList.length; i++) {
                  this.flatPreferenceDataList[i]['PREFERENCES'] = JSON.parse(
                    this.flatPreferenceDataList[i]['PREFERENCES']
                  );
                  this.flatPreferenceDataList[i]['PREFERENCES'] =
                    this.flatPreferenceDataList[i]['PREFERENCES'].sort(
                      function (a, b) {
                        return a.PREFERENCE_NO - b.PREFERENCE_NO;
                      }
                    );
                }
              }
            } else {
              this.flatPreferenceDataList = [];
            }

            // this.flatPreferenceDataList = data['data'];
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          },
          (error) => {
            this.loadingRecords = false;
            this.isSpinning = false;
            this.filterClass = 'filter-invisible';
          }
        );
    }
  }

  encloseddata: any;
  enclosedDocumentsVisible: boolean = false;
  ViewEnclosedDocuments(data: any) {
    this.api
      .getAllotmenmaster(0, 0, '', '', ' AND EMPLOYEE_ID = ' + data.EMP_ID)
      .subscribe(
        (data) => {
          this.encloseddata = data['data'][0];
        },
        (error) => {}
      );
    // this.encloseddata = data;
    this.enclosedDocumentsVisible = true;
  }

  SubmitRemark() {
    this.enclosedDocumentsVisible = false;
  }
  closeEnclosedDocuments() {
    this.api
      .getFlatAllotmentList(
        this.pageIndex,
        this.pageSize,
        'SENIORITY_SEQ_NO',
        'asc',
        ' AND PREFERENCES_MASTER_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.flatPreferenceDataList = data['data'];
            if (this.flatPreferenceDataList.length > 0) {
              for (let i = 0; i < this.flatPreferenceDataList.length; i++) {
                this.flatPreferenceDataList[i]['PREFERENCES'] = JSON.parse(
                  this.flatPreferenceDataList[i]['PREFERENCES']
                );
                this.flatPreferenceDataList[i]['PREFERENCES'] =
                  this.flatPreferenceDataList[i]['PREFERENCES'].sort(function (
                    a,
                    b
                  ) {
                    return a.PREFERENCE_NO - b.PREFERENCE_NO;
                  });
              }
            }
          } else {
            this.flatPreferenceDataList = [];
          }
          this.loadingRecords = false;
          this.isSpinning = false;
        },
        (error) => {
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
    this.enclosedDocumentsVisible = false;
  }

  AttachedpdfsVisible: boolean = false;
  AttachedpdfsCancel() {
    this.flatPreferenceDataList = [];

    this.api
      .getFlatAllotmentList(
        this.pageIndex,
        this.pageSize,
        'SENIORITY_SEQ_NO',
        'asc',
        ' AND PREFERENCES_MASTER_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.flatPreferenceDataList = data['data'];
            if (this.flatPreferenceDataList.length > 0) {
              for (let i = 0; i < this.flatPreferenceDataList.length; i++) {
                this.flatPreferenceDataList[i]['PREFERENCES'] = JSON.parse(
                  this.flatPreferenceDataList[i]['PREFERENCES']
                );
                this.flatPreferenceDataList[i]['PREFERENCES'] =
                  this.flatPreferenceDataList[i]['PREFERENCES'].sort(function (
                    a,
                    b
                  ) {
                    return a.PREFERENCE_NO - b.PREFERENCE_NO;
                  });
              }
            }
          } else {
            this.flatPreferenceDataList = [];
          }
          this.loadingRecords = false;
          this.isSpinning = false;
        },
        (error) => {
          this.loadingRecords = false;
          this.isSpinning = false;
        }
      );
    this.AttachedpdfsVisible = false;
  }

  view1 = 0;
  viewattachedpdf = '';

  ATTACHMENT1send(data) {
    this.viewattachedpdf = '';
    this.api
      .getperdata(
        0,
        0,
        '',
        '',
        ' AND EMP_ID =' +
          data.EMP_ID +
          ' AND PREFERENCES_MASTER_ID=' +
          data.PREFERENCES_MASTER_ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              if (data['data'][0]['UPLOAD_URL'] != null) {
                this.viewattachedpdf = data['data'][0]['UPLOAD_URL'];
                window.open(
                  this.api.retriveimgUrl +
                    'employeePreferance/' +
                    this.viewattachedpdf
                );
                this.view1 = 11;
              } else {
              }
            } else {
            }
          } else {
            this.message.error('Failed To Load Preference Form', '');
          }
        },
        (error) => {}
      );
  }
  ATTACHMENT2send(file) {
    if (file != null && file != undefined && file != '')
      window.open(this.api.retriveimgUrl + 'joiningLetter/' + file);
  }
  ATTACHMENT3send(file) {
    if (file != null && file != undefined && file != '')
      window.open(this.api.retriveimgUrl + 'iCards/' + file);
  }
  ATTACHMENT4send(file) {
    if (file != null && file != undefined && file != '')
      window.open(this.api.retriveimgUrl + 'paySlips/' + file);
  }
  ATTACHMENT5send(file) {
    if (file != null && file != undefined && file != '')
      window.open(this.api.retriveimgUrl + 'castCertificate/' + file);
  }

  sanitizedLink12: any = '';
  getS1(link: string) {
    var a = '';
    if (this.view1 == 11) {
      a = this.api.retriveimgUrl + 'employeePreferance/' + link;
    }
    if (this.view1 == 22) {
      a = this.api.retriveimgUrl + 'joiningLetter/' + link;
    }
    if (this.view1 == 33) {
      a = this.api.retriveimgUrl + 'iCards/' + link;
    }
    if (this.view1 == 44) {
      a = this.api.retriveimgUrl + 'paySlips/' + link;
    }
    this.sanitizedLink12 = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink12;
  }
  AllotmentList() {
    this.drawerTitleAllotment = 'Quarter Allotment Order';
    this.drawerVisibleAllotment = true;
  }

  drawerCloseAllotment(): void {
    this.search();
    this.drawerVisibleAllotment = false;
  }

  get closeCallbackAllotment() {
    return this.drawerCloseAllotment.bind(this);
  }
  flatAllotmentDataList: any = [];
  dupflatAllotmentDataList: any = [];
  generatelist() {
    this.loadingRecords = true;
    this.data.RESIDENCE_TYPE = this.RESIDENCE_TYPE;
    this.data.MONTH = this.datepipe.transform(this.Datenew, 'MM');

    let monthback = Number(this.data.MONTH) - 1;
    this.data.YEAR = this.datepipe.transform(this.Datenew, 'yyyy');
    let year = Number(this.data.YEAR);

    this.ListSpinning = true;
    this.api
      .getFlatAllocationInspector(monthback, year, this.data.RESIDENCE_TYPE)
      .subscribe(
        (data) => {
          this.api
            .getFlatAllocationMAster(
              0,
              0,
              'ID',
              '',
              ' AND MONTH(ALLOCATION_DATETIME) = ' +
                monthback +
                ' AND YEAR(ALLOCATION_DATETIME) = ' +
                this.data.YEAR +
                ' AND TYPE = ' +
                this.data.RESIDENCE_TYPE
            )
            .subscribe(
              (data) => {
                this.flatAllotmentDataList = data['data'];
                this.loadingRecords = false;
                this.ListSpinning = false;
                this.listisgenerated = true;

                this.api
                  .getflatAllotmentMaster(
                    0,
                    0,
                    'ID',
                    'desc',
                    ' AND MONTH = ' +
                      Number(Number(new Date().getMonth()) + 1) +
                      ' AND YEAR = ' +
                      new Date().getFullYear() +
                      ' AND RESIDENCE_TYPE = ' +
                      this.data.RESIDENCE_TYPE
                  )
                  .subscribe(
                    (data) => {
                      this.FlatAllotmentmaster = data['data'];
                    },
                    (err) => {}
                  );
              },
              (err) => {
                this.loadingRecords = false;
                this.ListSpinning = false;
              }
            );
        },
        (error) => {
          this.message.error('Failed To get data', '');
          this.loadingRecords = false;
          this.ListSpinning = false;
        }
      );
  }
  fileUrl: any;
  draftid: any;
  employeefilterdata: any = [];
  Next() {
    this.isSpinning = true;
    if (
      this.dataAllotmentPublish.FILE_URL != null &&
      this.dataAllotmentPublish.FILE_URL != ''
    ) {
      this.generatePDF = false;
    } else {
      this.dataAllotmentPublish.FILE_URL = null;
      this.progressBar = false;
      this.percent = 0;
      this.generatePDF = true;
    }
    if (this.current == 0) {
      if (this.isPrevious == false) {
        var data = {
          PREFERENCES_MASTER_ID: this.data.ID,
          RESIDENCE_TYPE_ID: this.data.RESIDENCE_TYPE_ID,
          CREATOR_ID: Number(sessionStorage.getItem('userId')),
        };
        this.api.createFlatAllotmentList(data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              'Quarter Allotment Order Generated Successfully...',
              ''
            );
            this.api
              .getAllDraftAllotment(
                0,
                0,
                'FINAL_SENIORITY_SEQ_NO',
                'asc',
                " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " +
                  this.data.ID
              )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.flatAllotmentDataList = data['data'];
                    this.dupflatAllotmentDataList = data['data'];
                    this.isSpinning = false;
                  } else {
                    this.flatAllotmentDataList = [];
                    this.isSpinning = false;
                  }
                },
                (err) => {}
              );
            this.current = 1;

            let today = new Date();
            this.dataAllotmentPublish.OBJ_END_DATE_TIME = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + 4,
              today.getHours(),
              today.getMinutes(),
              today.getSeconds()
            );
            this.dataAllotmentPublish.OBJ_START_DATE_TIME = new Date();
            this.isSpinning = false;
          } else if (successCode.code == '300') {
            this.message.error(
              'No Records Found, Cannot Generate Quarter Allotment Order',
              ''
            );
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Generate Order...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .getAllDraftAllotment(
            0,
            0,
            'FINAL_SENIORITY_SEQ_NO',
            'asc',
            " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " + this.data.ID
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.flatAllotmentDataList = data['data'];
                this.dupflatAllotmentDataList = data['data'];
                this.isSpinning = false;
              } else {
                this.flatAllotmentDataList = [];
                this.isSpinning = false;
              }
            },
            (err) => {}
          );
        this.current = 1;
      }
    } else if (this.current == 1) {
      this.api
        .getDraftAllotmentList(
          0,
          0,
          '',
          '',
          ' AND PREFERENCES_MASTER_ID =' + this.data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.dataAllotmentPublish = data['data'][0];

              this.draftid = this.dataAllotmentPublish.ID;
              this.fileUrl = data['data'][0]['FILE_URL'];
              this.isSpinning = false;
              this.openmodalsteps();
              this.getAllUsers();
              let today = new Date();
              this.dataAllotmentPublish.OBJ_END_DATE_TIME = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 4,
                0,
                0,
                0
              );
              this.dataAllotmentPublish.OBJ_START_DATE_TIME = new Date();
            } else {
              // this.dataAllotmentPublish = [];
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      this.current = 2;
    } else if (this.current == 2) {
      this.isSpinning = false;
    }
  }
  todaysdateee: any = new Date();

  pre() {
    this.isSpinning = true;
    this.dataAllotmentPublish.FILE_URL = null;
    this.progressBar = false;
    this.percent = 0;
    this.generatePDF = true;
    this.isPrevious = true;
    if (this.current == 2) {
      this.flatAllotmentDataList = [];
      this.api
        .getAllDraftAllotment(
          0,
          0,
          'FINAL_SENIORITY_SEQ_NO',
          'asc',
          " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " + this.data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.flatAllotmentDataList = data['data'];
              this.dupflatAllotmentDataList = data['data'];
              this.isSpinning = false;
            } else {
              this.flatAllotmentDataList = [];
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      this.current = 1;
    } else if (this.current == 1) {
      this.flatPreferenceDataList = [];

      this.api
        .getFlatAllotmentList(
          this.pageIndex,
          this.pageSize,
          'SENIORITY_SEQ_NO',
          'asc',
          ' AND PREFERENCES_MASTER_ID = ' + this.data.ID
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.flatPreferenceDataList = data['data'];
              this.isSpinning = false;
              if (this.flatPreferenceDataList.length > 0) {
                for (let i = 0; i < this.flatPreferenceDataList.length; i++) {
                  this.flatPreferenceDataList[i]['PREFERENCES'] = JSON.parse(
                    this.flatPreferenceDataList[i]['PREFERENCES']
                  );
                  this.flatPreferenceDataList[i]['PREFERENCES'] =
                    this.flatPreferenceDataList[i]['PREFERENCES'].sort(
                      function (a, b) {
                        return a.PREFERENCE_NO - b.PREFERENCE_NO;
                      }
                    );
                }
              }
            } else {
              this.flatPreferenceDataList = [];
              this.isSpinning = false;
            }
            this.loadingRecords = false;
            this.isSpinning = false;
          },
          (error) => {
            this.isSpinning = false;
          }
        );
      this.current = 0;
    } else if (this.current == 2) {
      this.isSpinning = false;
    }
  }
  getResidenceTypeList() {
    this.isSpinning = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
          this.isSpinning = false;
          if (this.data.ID) {
            this.generatelist();
          }
        }
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }
  AllotmentPreview: boolean = false;
  modaldata: any;
  modalarraydata: any;
  modalarraydatademo: any = [];
  isSpinningmodal = false;

  openmodal() {
    this.modalarraydatademo = [];
    this.modalarraydata = [];
    // this.modaldata = this.data
    // this.modalarraydata = this.flatAllotmentDataList;
    this.isSpinning = true;
    this.api
      .getAllDraftAllotment(
        0,
        0,
        'FINAL_SENIORITY_SEQ_NO',
        'asc',
        ' AND PREFERENCES_MASTER_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.modalarraydata = data['data'];
            // var count = -1;
            this.modalarraydata.forEach((element, index2) => {
              if (element.IS_ALLOTED == 'Y') {
                this.modalarraydatademo.push(element);
              }
              // if (index2 == this.modalarraydata.length - 1) {
              //   this.modalarraydata.forEach((element) => {
              //     var index = -1;
              //     index = this.modalarraydatademo.findIndex(
              //       (obj) => obj.EMP_ID == element.EMP_ID
              //     );

              //     if (index == -1) {
              //       this.modalarraydatademo.push(element);
              //     }
              //   });
              // }
              this.modalarraydatademo = this.modalarraydatademo.sort(function (
                a,
                b
              ) {
                return a.SEQUENCE_NO - b.SEQUENCE_NO;
              });
            });

            this.isSpinning = false;
            this.AllotmentPreview = true;
            this.isSpinning = false;
          } else {
            this.modalarraydata = [];
            this.isSpinning = false;
            this.isSpinning = false;
          }
        },
        (err) => {
          this.modalarraydata = [];
          this.isSpinning = false;
          this.isSpinning = false;
        }
      );
  }

  openmodalsteps() {
    this.modalarraydatademo = [];
    this.modalarraydata = [];
    this.isSpinning = true;
    this.api
      .getAllDraftAllotment(
        0,
        0,
        'FINAL_SENIORITY_SEQ_NO',
        'asc',
        ' AND PREFERENCES_MASTER_ID = ' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.modalarraydata = data['data'];
            // var count = -1;
            this.modalarraydata.forEach((element, index2) => {
              if (element.IS_ALLOTED == 'Y') {
                this.modalarraydatademo.push(element);
              }
              // if (index2 == this.modalarraydata.length - 1) {
              //   this.modalarraydata.forEach((element) => {
              //     var index = -1;
              //     index = this.modalarraydatademo.findIndex(
              //       (obj) => obj.EMP_ID == element.EMP_ID
              //     );

              //     if (index == -1) {
              //       this.modalarraydatademo.push(element);
              //     }
              //   });
              // }
              this.modalarraydatademo = this.modalarraydatademo.sort(function (
                a,
                b
              ) {
                return a.SEQUENCE_NO - b.SEQUENCE_NO;
              });
            });
            this.isSpinning = false;
          } else {
            this.modalarraydata = [];
            this.isSpinning = false;
          }
        },
        (err) => {
          this.modalarraydata = [];
          this.isSpinning = false;
        }
      );
  }
  closemodal() {
    this.AllotmentPreview = false;
  }
  getFlatAllotmentList() {
    this.isSpinning = true;
    this.api
      .getflatAllotmentMaster(
        0,
        0,
        'EMP_ID',
        'desc',
        ' AND MONTH = ' +
          Number(Number(new Date().getMonth()) + 1) +
          ' AND YEAR = ' +
          new Date().getFullYear() +
          ' AND RESIDENCE_TYPE = ' +
          this.RESIDENCE_TYPE
      )
      .subscribe(
        (data) => {
          this.FlatAllotmentmaster = data['data'];

          this.dataAllotmentPublish.OBJ_START_DATE_TIME =
            data['data'][0]['OBJ_START_DATE_TIME'];
          this.dataAllotmentPublish.OBJ_END_DATE_TIME =
            data['data'][0]['OBJ_END_DATE_TIME'];
          this.dataAllotmentPublish.ID = data['data'][0]['ID'];
          this.dataAllotmentPublish.FILE_URL = data['data'][0]['FILE_URL'];
          this.isSpinning = false;
          if (
            this.dataAllotmentPublish.FILE_URL != null ||
            this.dataAllotmentPublish.FILE_URL != undefined ||
            this.dataAllotmentPublish.FILE_URL != ''
          ) {
            this.isPublish = true;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  htmlContent: any;
  PublishToUser() {
    const element: any = document.getElementById('Prntmodalforbackend');
    this.htmlContent = element.outerHTML;
    this.isOk = true;
    if (
      this.dataAllotmentPublish.OBJ_START_DATE_TIME == null ||
      this.dataAllotmentPublish.OBJ_START_DATE_TIME == undefined
    ) {
      this.message.error('Please Select Allotment Objection Start Date', '');
      this.isOk = false;
    } else if (
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID == null ||
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID == undefined ||
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID == 0
    ) {
      this.message.error('Please Select Signature', '');
    } else if (
      this.dataAllotmentPublish.DRAFT_ALLOT_ORDER_NO == null ||
      this.dataAllotmentPublish.DRAFT_ALLOT_ORDER_NO == undefined ||
      this.dataAllotmentPublish.DRAFT_ALLOT_ORDER_NO == ''
    ) {
      this.message.error('Please Enter Draft Allotment Order Number', '');
      this.isOk = false;
    } else if (
      this.dataAllotmentPublish.OBJ_END_DATE_TIME == null ||
      this.dataAllotmentPublish.OBJ_END_DATE_TIME == undefined
    ) {
      this.message.error('Please Select Allotment Objection End Date', '');
      this.isOk = false;
    }
    if (this.isOk) {
      this.isSpinning = true;
      this.dataAllotmentPublish.OBJ_START_DATE_TIME = this.datepipe.transform(
        this.dataAllotmentPublish.OBJ_START_DATE_TIME,
        'yyyy-MM-dd HH:mm:ss'
      );
      this.dataAllotmentPublish.OBJ_END_DATE_TIME = this.datepipe.transform(
        this.dataAllotmentPublish.OBJ_END_DATE_TIME,
        'yyyy-MM-dd HH:mm:ss'
      );
      this.dataAllotmentPublish.DRAFT_ALLOTMENT_PUBLISH_DATE =
        this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      this.dataAllotmentPublish.OBJ_START_DATE_TIME =
        this.dataAllotmentPublish.OBJ_START_DATE_TIME;
      this.dataAllotmentPublish.OBJ_END_DATE_TIME =
        this.dataAllotmentPublish.OBJ_END_DATE_TIME;
      this.dataAllotmentPublish.STEP_NO = 2;
      this.dataAllotmentPublish.PUBLISHER_ID = Number(
        sessionStorage.getItem('userId')
      );
      // if (this.fileUrl == this.dataAllotmentPublish.FILE_URL) {
      //   this.dataAllotmentPublish.PUBLISH_DATE_TIME =
      //     this.dataAllotmentPublish.PUBLISH_DATE_TIME;
      // } else {
      this.dataAllotmentPublish.PUBLISH_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      // }
      if (this.dataAllotmentPublish.ID) {
        this.api.publishfinalalltoment(this.dataAllotmentPublish).subscribe(
          (successCode) => {
            if (successCode.code == '200') {
              var updateData = {
                ID: this.data.ID,
                PREFERENCE_STEP_NO: 3,
              };
              this.api
                .tempWaitingListStepUpdate(
                  this.VacantFlatScenarityId,
                  4,
                  this.dataAllotmentPublish.OBJ_START_DATE_TIME,
                  this.dataAllotmentPublish.OBJ_END_DATE_TIME
                )
                .subscribe((stepdata) => {});
              this.api.updatePreferanceList(updateData).subscribe(
                (successCode) => {
                  if (successCode.code == '200') {
                    this.api
                      .allotmentpdfgenration(
                        this.prefranceid,
                        this.dataAllotmentPublish.ID,
                        this.dataAllotmentPublish['RESIDENCE_TYPE_NAME'],
                        this.htmlContent,
                        this.dataAllotmentPublish.GRAAS_SIGNATURE_ID,
                        this.dataAllotmentPublish.DRAFT_ALLOT_ORDER_NO,
                        this.SIGNNAME,
                        this.NAME_HN,
                        this.POST,
                        this.POST_HIN,
                        this.OFFICE,
                        this.OFFICE_HN,
                        this.SIGNATURE_IMAGE
                      )
                      .subscribe(
                        (data) => {
                          if (data.code == 200) {
                            // this.message.success(' Successfully', '');
                            this.message.success(
                              'Draft allotment order published successfully',
                              ''
                            );
                            this.isSpinning = false;
                            this.drawerClose();
                          } else {
                            this.isSpinning = false;
                            this.message.error(
                              'Something went wrong, please try again later',
                              ''
                            );
                          }
                        },
                        (err) => {
                          this.isSpinning = false;
                          this.message.error(
                            'Something went wrong, please try again later',
                            ''
                          );
                        }
                      );
                  } else {
                    this.message.error('Information Has Not Changed...', '');
                    this.isSpinning = false;
                  }
                },
                (err) => {
                  this.isSpinning = false;
                }
              );
              // this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something went wrong, please try again later',
              ''
            );
            this.isSpinning = false;
          }
        );
      } else {
        this.isSpinning = false;
      }
    }
  }
  progressBar: any = false;
  percent: any = 0;
  transferFileURL: any;
  urllink: any;
  timer: any;
  onFileSelectedTransfer2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.transferFileURL = <File>event.target.files[0];

      if (this.transferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink = url;
        if (
          this.dataAllotmentPublish.FILE_URL != undefined &&
          this.dataAllotmentPublish.FILE_URL.trim() != ''
        ) {
          var arr = this.dataAllotmentPublish.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.progressBar = true;
      this.timer = this.api
        .onUpload2('draftAllotmentList', this.transferFileURL, this.urllink)
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
            this.dataAllotmentPublish.FILE_URL = null;
            this.dataAllotmentPublish.OBJ_START_DATE_TIME = null;
            this.dataAllotmentPublish.OBJ_END_DATE_TIME = null;
            this.generatePDF = true;
            this.isPublish = false;
            this.progressBar = false;
            this.percent = 0;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success(
                'Draft Allotment Order File Uploaded Successfully',
                ''
              );
              this.isSpinning = false;
              this.isPublish = true;
              this.dataAllotmentPublish.FILE_URL = this.urllink;

              if (
                this.dataAllotmentPublish.FILE_URL != null &&
                this.dataAllotmentPublish.FILE_URL != undefined &&
                this.dataAllotmentPublish.FILE_URL != ''
              ) {
                this.generatePDF = false;
              } else {
                this.dataAllotmentPublish.FILE_URL = null;
                this.generatePDF = true;
              }

              if (
                this.dataAllotmentPublish.FILE_URL != null &&
                this.dataAllotmentPublish.FILE_URL != undefined &&
                this.dataAllotmentPublish.FILE_URL != ''
              ) {
                let today = new Date();
                this.dataAllotmentPublish.OBJ_END_DATE_TIME = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() + 4,
                  today.getHours(),
                  today.getMinutes(),
                  today.getSeconds()
                );
                this.dataAllotmentPublish.OBJ_START_DATE_TIME = new Date();
              }
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.dataAllotmentPublish.FILE_URL = null;
    }
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  FlatprefListPDF = '';
  viewAssumptionPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'draftAllotmentList/' + pdfURL);
  }
  sanitizedLink: any = '';
  getS(link: string) {
    var a = '';
    if (this.view == 1) {
      a = this.api.retriveimgUrl + 'draftAllotmentList/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  clearGradepayletter(fileurl: string, folder: string) {
    this.isSpinning = true;
    var deletefile = folder + '/' + fileurl;
    this.api.deletealluploadsgrass(deletefile).subscribe(
      (value) => {
        if (value.code == 200) {
          this.message.success(
            'Draft Allotment Order File Deleted Successfully',
            ''
          );
          this.dataAllotmentPublish.FILE_URL = null;
          this.dataAllotmentPublish.OBJ_START_DATE_TIME = null;
          this.dataAllotmentPublish.OBJ_END_DATE_TIME = null;
          this.generatePDF = true;
          this.isPublish = false;
          this.progressBar = false;
          this.percent = 0;
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Delete Draft Allotment Order File', '');
          this.isSpinning = false;
        }
      },
      (error) => {
        this.message.error('Failed To Delete Draft Allotment Order File', '');
        this.isSpinning = false;
      }
    );
  }
  UploadPDF() {
    this.isOk = true;

    this.dataAllotmentPublish.MONTH = this.datepipe.transform(
      this.Datenew,
      'MM'
    );
    this.dataAllotmentPublish.YEAR = this.datepipe.transform(
      this.Datenew,
      'yyyy'
    );

    if (
      this.dataAllotmentPublish.FILE_URL == null ||
      this.dataAllotmentPublish.FILE_URL == undefined ||
      this.dataAllotmentPublish.FILE_URL == ''
    ) {
      this.message.error('Please Upload Generated Order PDF Document', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
      }
    }
  }
  disabledDate12 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.dateobj) < 0;

  disabledDate11 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.datenew) < 0;

  disabledDate2 = (current: Date): boolean =>
    differenceInCalendarDays(
      current,
      new Date(this.dataAllotmentPublish.OBJ_START_DATE_TIME)
    ) < 0;

  treatEndDate(date: any) {
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,
        new Date(this.dataAllotmentPublish.OBJ_START_DATE_TIME)
      ) < 0;

    this.dataAllotmentPublish.OBJ_END_DATE_TIME = new Date(date);
    this.dataAllotmentPublish.OBJ_END_DATE_TIME.setDate(
      this.dataAllotmentPublish.OBJ_END_DATE_TIME.getDate() + 4
    );
  }

  newFlatNameTemp: any;
  newFlatNamePer: any;
  FlatList: any = [];
  changeFlatData: any;
  FLAT_CHANGE_REMARK: any;
  employeefilterrecords: any = [];
  oldempname: any = '';
  changeSerial(data) {
    this.isSpinning = true;
    this.changeFlatData = data;
    this.oldempname = data.EMPLOYEE_NAME;
    // this.newFlatNameTemp = data.NEW_FLAT_NAME;
    this.employeefilterrecords = [];

    this.employeefilterdata = [];
    this.api
      .getAllDraftAllotment(
        0,
        0,
        'FINAL_SENIORITY_SEQ_NO',
        'asc',
        " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            var dataaaa = data['data'];
            var employeefilteridd: any =
              localStorage.getItem('employeefilterid');
            this.employeefilterid = JSON.parse(employeefilteridd);
            for (let i = 0; i < this.employeefilterid.length; i++) {
              if (this.employeefilterid[i]['EMP_ID'] != 0) {
                var ii = -1;
                ii = dataaaa.findIndex(
                  (x) => x.EMP_ID == this.employeefilterid[i]['EMP_ID']
                );
                if (ii == -1) {
                  this.employeefilterdata.push(this.employeefilterid[i]);
                }
              }
            }
            this.changeSerialVisible = true;
            this.isSpinning = false;
          } else {
            this.flatAllotmentDataList = [];
            this.isSpinning = false;
          }
        },
        (err) => {
          this.flatAllotmentDataList = [];
          this.isSpinning = false;
        }
      );
  }
  changeSerialVisible: boolean = false;
  closeChangeSerial() {
    this.changeFlatData = '';
    this.newFlatNamePer = '';
    this.oldempname = '';
    this.FLAT_CHANGE_REMARK = '';
    this.changeSerialVisible = false;
    this.isSpinning = true;
    this.api
      .getAllDraftAllotment(
        0,
        0,
        'FINAL_SENIORITY_SEQ_NO',
        'asc',
        " AND IS_ALLOTED = 'Y' AND PREFERENCES_MASTER_ID = " + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.flatAllotmentDataList = data['data'];
            this.dupflatAllotmentDataList = data['data'];
            this.isSpinning = false;
          } else {
            this.flatAllotmentDataList = [];
            this.isSpinning = false;
          }
        },
        (err) => {
          this.flatAllotmentDataList = [];
          this.isSpinning = false;
        }
      );
  }

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
      this.FLAT_CHANGE_REMARK == undefined ||
      this.FLAT_CHANGE_REMARK == null ||
      this.FLAT_CHANGE_REMARK == ''
    ) {
      this.message.error('Please Enter  Reason', '');
      this.isSpinning = false;
    } else {
      // this.changeFlatData['NEW_EMP_ID'] = this.changeFlatData['EMP_ID'];
      this.changeFlatData['NEW_EMP_ID'] = this.newFlatNamePer;
      this.changeFlatData['REMARK'] = this.FLAT_CHANGE_REMARK;

      this.api.updateAllotementDetail(this.changeFlatData).subscribe(
        (successCode) => {
          if (successCode.code == '200') {
            this.message.success('Information Changed Successfully...', '');

            this.isSpinning = false;
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

  pdfDownload: boolean = false;
  prefrancepublish: boolean = false;
  PublishToUser11() {
    if (
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID === null ||
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID === undefined ||
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID === '' ||
      this.dataAllotmentPublish.GRAAS_SIGNATURE_ID === 0
    ) {
      this.message.error('Please Select Signature', '');
    } else {
      this.prefrancepublish = true;
    }
  }
  PublishToUsercancel() {
    this.prefrancepublish = false;
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
            this.SIGNATURE_ID = f[0]['ID'];
            this.NAME = f[0]['NAME'];
            this.NAME_HN = f[0]['NAME_HN'];
            this.OFFICE_NAME = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
            this.POST = f[0]['POST'];
            this.POST_HN = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID = data['data'][0]['ID'];
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.NAME = data['data'][0]['NAME'];
            this.NAME_HN = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
            this.POST = data['data'][0]['POST'];
            this.POST_HN = data['data'][0]['POST_HN'];
          }
        } else {
        }
      },
      (error) => {}
    );
  }

  SIGNATURE_ID: any;
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
      this.SIGNATURE_ID = null;
    } else {
      var f = this.Signaturelist.filter((item) => item['ID'] == event);
      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID = f[0]['ID'];
      this.NAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];

      let signaturedata = {
        SIGNATURE_ID: this.SIGNATURE_ID,
        ID: this.data.ID,
      };
      this.isSpinning = true;
      this.api.UpdateEmployeeprefinspectormaster(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          this.isSpinning = false;
        }
      );
    }
  }

  downloadPdf() {
    this.pdfDownload = true;
    const element = document.getElementById('Prntmodal');
    const opt = {
      margin: 0.2,

      filename: 'Quarter Allotment.pdf',

      image: { type: 'jpeg', quality: 7 },

      html2canvas: { scale: 7 },

      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .then(() => {
        this.pdfDownload = false;
      })
      .save();
  }

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
              if (this.dataAllotmentPublish['GRAAS_SIGNATURE_ID']) {
                const abc = Number(
                  this.dataAllotmentPublish['GRAAS_SIGNATURE_ID']
                );
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
  // NAME_HN = '';
  // POST = '';
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
