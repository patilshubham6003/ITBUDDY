import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-generateseniorityadd',
  templateUrl: './generateseniorityadd.component.html',
  styleUrls: ['./generateseniorityadd.component.css'],
  providers: [DatePipe],
})
export class GenerateseniorityaddComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = genertaeSenioritylist;

  ResidenceType: any = [];
  ObjectionList: any = [];
  PublishedSenioritylist: any = [];
  datenew = new Date();
  Datenew = new Date(this.datenew.getFullYear(), this.datenew.getMonth());
  dateobj = new Date();
  isSpinning = false;
  loadingRecords = false;
  ListSpinning = false;
  listisgenerated = false;
  isOk = true;

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private modal: NzModalService
  ) { }
  ngOnInit() {
    this.dateobj = new Date(
      this.dateobj.getFullYear(),
      this.dateobj.getMonth(),
      this.dateobj.getDate() + 5
    );

    if (this.data.FILE_URL != null) {
      this.generatePDF = false;
    } else {
      this.generatePDF = true;
    }
    this.getResidenceType();
    // this.api.getObjectionMaster(0, 0, 'ID', 'desc', "").subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.ObjectionList = data['data'];

    //     } else {
    //       this.message.error('Something Went Wrong', '');
    //     }
    //   },
    //   (err) => {
    //
    //   }
    // );
    // this.api.getSenioritylist(0, 0, 'ID', 'desc', "").subscribe(
    //   (data) => {
    //     this.PublishedSenioritylist = data['data'];
    //     for (let j = 0; j < this.PublishedSenioritylist.length; j++) {
    //       if (
    //         this.PublishedSenioritylist[j]['YEAR'] == this.data.YEAR &&
    //         this.PublishedSenioritylist[j]['MONTH'] == this.data.MONTH &&
    //         this.PublishedSenioritylist[j]['RESIDENCE_TYPE'] == this.data.RESIDENCE_TYPE
    //       ) {
    //         this.Seniorityid = this.PublishedSenioritylist[j]['ID'];
    //         this.Publishedalready = true;
    //       }
    //     }
    //   },
    //   (err) => {
    //
    //   }
    // );
  }

  getResidenceType() {
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
      },
      (err) => { }
    );
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new genertaeSenioritylist();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  moveRowUp(index: number) {
    if (index > 0) {
      const temp = this.showgeneratedlist[index];
      this.showgeneratedlist[index] = this.showgeneratedlist[index - 1];
      this.showgeneratedlist[index - 1] = temp;
    }
    for (let i = 0; i < this.showgeneratedlist.length; i++) {
      this.showgeneratedlist[i]['SEQ_NO'] = i + 1;
    }
  }

  disabledDate12 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.dateobj) < 0;

  disabledDate11 = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.Datenew) < 0;

  moveRowDown(index: number) {
    if (index < this.showgeneratedlist.length - 1) {
      const temp = this.showgeneratedlist[index];
      this.showgeneratedlist[index] = this.showgeneratedlist[index + 1];
      this.showgeneratedlist[index + 1] = temp;
    }
    for (let i = 0; i < this.showgeneratedlist.length; i++) {
      this.showgeneratedlist[i]['SEQ_NO'] = i + 1;
    }
  }

  showgeneratedlist: any = [];
  Senioritylistdata11: any = [];
  checkback = false;
  Publishedalready = false;
  generatelist() {
    this.loadingRecords = true;

    this.data.MONTH = this.datepipe.transform(this.Datenew, 'MM');
    this.data.YEAR = this.datepipe.transform(this.Datenew, 'yyyy');
    let monthbackgame = Number(this.data.MONTH) - 1;
    if (monthbackgame == 0) {
      monthbackgame = 12;
      this.data.YEAR = Number(this.data.YEAR) - 1;
    }
    if (
      this.data.RESIDENCE_TYPE == null ||
      this.data.RESIDENCE_TYPE == undefined ||
      this.data.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else if (
      this.data.MONTH == null ||
      this.data.MONTH == undefined ||
      this.data.MONTH == ''
    ) {
      this.message.error('Please Select Month', '');
    } else {
      this.ListSpinning = true;
      this.api
        .Senioritydate(
          0,
          0,
          '',
          '',
          ' AND YEAR(APPLICATION_DATETIME) = ' +
          this.data.YEAR +
          ' and MONTH(APPLICATION_DATETIME) = ' +
          monthbackgame,
          this.data.RESIDENCE_TYPE
        )
        .subscribe(
          (data) => {
            this.showgeneratedlist = data['data'];
            this.loadingRecords = false;
            this.ListSpinning = false;
            this.listisgenerated = true;

            this.checkback = false;
            this.Publishedalready = false;
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
                ' AND RESIDENCE_TYPE = ' +
                this.data.RESIDENCE_TYPE
              )
              .subscribe(
                (data) => {
                  this.PublishedSenioritylist = data['data'];

                  for (let j = 0; j < this.PublishedSenioritylist.length; j++) {
                    if (
                      this.PublishedSenioritylist[j]['YEAR'] ==
                      this.data.YEAR &&
                      this.PublishedSenioritylist[j]['MONTH'] ==
                      this.data.MONTH &&
                      this.PublishedSenioritylist[j]['RESIDENCE_TYPE'] ==
                      this.data.RESIDENCE_TYPE
                    ) {
                      this.Seniorityid = this.PublishedSenioritylist[j]['ID'];
                      this.Publishedalready = true;
                    } else {
                      this.Publishedalready = false;
                    }
                  }
                },
                (err) => { }
              );
          },
          (error) => {
            this.message.error('Failed To get data', '');
          }
        );

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
          ' AND RESIDENCE_TYPE = ' +
          this.data.RESIDENCE_TYPE
        )
        .subscribe(
          (data) => {
            this.Senioritylistdata11 = data['data'];
          },
          (err) => { }
        );
    }
  }
  currentstage = [];
  Isclicked: boolean = false;
  openuploadbtn() {
    this.Isclicked = true;
  }
  Seniorityid: any;
  save(addNew: boolean, websitebannerPage: NgForm) {
    this.isOk = true;

    this.data.MONTH = this.datepipe.transform(this.Datenew, 'MM');
    this.data.YEAR = this.datepipe.transform(this.Datenew, 'yyyy');
    this.data.OBJ_DATETIME_PERIOD = this.datepipe.transform(
      this.dateobj,
      'yyyy-MM-dd'
    );
    if (
      this.data.RESIDENCE_TYPE == null ||
      this.data.RESIDENCE_TYPE == undefined ||
      this.data.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else if (
      this.data.MONTH == null ||
      this.data.MONTH == undefined ||
      this.data.MONTH == ''
    ) {
      this.message.error('Please Select Month', '');
    } else if (
      this.data.FILE_URL == null ||
      this.data.FILE_URL == undefined ||
      this.data.FILE_URL == ''
    ) {
      this.message.error('Please Upload Generated Order PDF Document', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      let DATA = this.showgeneratedlist;
      if (this.Senioritylistdata11.length > 0) {
        this.modal.confirm({
          nzTitle:
            'The Type of Allotment Order is Already Published. Is this the Final Publish ?',
          nzOkText: 'Yes',
          nzOkType: 'primary',
          nzOkDanger: true,
          nzOnOk: () => {
            if (this.Seniorityid != undefined || this.Seniorityid != null) {
              this.data.IS_FINAL = true;
              this.data.FINAL_FILE_URL = this.data.FILE_URL;
              this.data.ID = this.Seniorityid;
              this.data.OBJ_DATETIME_PERIOD = null;
              this.api
                .updateFinalSenioritylistmaster(this.data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Final Seniority Order Published Successfully.',
                      ''
                    );
                    this.isSpinning = false;
                    this.api.SeniorityListdatapush(DATA).subscribe(
                      (data) => { },
                      (err) => { }
                    );

                    if (!addNew) {
                      this.drawerClose();
                      this.isSpinning = false;
                      websitebannerPage.form.reset();
                    } else {
                      this.data = new genertaeSenioritylist();
                      this.resetDrawer(websitebannerPage);
                    }
                  } else {
                    this.message.error(
                      'Failed To Published Final Seniority Order.',
                      ''
                    );
                    this.isSpinning = false;
                  }
                });
            }
          },
          nzCancelText: 'No',
          nzOnCancel: () => {
            this.isSpinning = false;
          },
        });
      } else {
        this.data.IS_FINAL = false;
        this.data.OBJ_DATETIME_PERIOD = this.datepipe.transform(
          this.dateobj,
          'yyyy-MM-dd HH:mm:ss'
        );
        this.api.CreateSeniorityList(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              'Seniority Order Published Successfully...',
              ''
            );
            this.isSpinning = false;

            if (!addNew) {
              this.drawerClose();
              this.isSpinning = false;
              this.resetDrawer(websitebannerPage);
            } else {
              this.data = new genertaeSenioritylist();
              this.resetDrawer(websitebannerPage);
              this.data.FILE_URL = null;
              if (this.data.FILE_URL != null) {
                this.generatePDF = false;
              } else {
                this.generatePDF = true;
              }
              this.api.SeniorityListdatapush(DATA).subscribe(
                (data) => { },
                (err) => { }
              );
            }

            this.isSpinning = false;
          } else {
            this.message.error('Failed To Publish Seniority Order...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  transferFileURL: any;
  urllink: any;
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
          this.data.FILE_URL != undefined &&
          this.data.FILE_URL.trim() != ''
        ) {
          var arr = this.data.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('seniorityLists', this.transferFileURL, this.urllink)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.FILE_URL = this.urllink;
            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
            if (this.data.FILE_URL != null) {
              this.generatePDF = false;
            } else {
              this.generatePDF = true;
            }
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.data.FILE_URL = null;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  SenioritylistPDF = '';
  viewAssumptionPDF(pdfURL: string): void {
    this.SenioritylistPDF = '';
    this.view = 1;
    this.printOrderModalVisible = true;
    this.SenioritylistPDF = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    var a = '';
    if (this.view == 1) {
      a = this.api.retriveimgUrl + 'seniorityLists/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
  generatePDF: boolean = true;
  clearGradepayletter() {
    this.data.FILE_URL = null;
    this.generatePDF = true;
  }
}
