import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Allotmentpublishedlist } from 'src/app/grass/Models/AllotmentPublishlist';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-flatallotmentadd',
  templateUrl: './flatallotmentadd.component.html',
  styleUrls: ['./flatallotmentadd.component.css'],
  providers: [DatePipe],
})
export class FlatallotmentaddComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = Allotmentpublishedlist;
  @Input() RESIDENCE_TYPE = '';
  ResidenceType: any = [];
  FlatAllotmentmaster: any = [];
  datenew = new Date();
  Datenew = new Date(this.datenew.getFullYear(), this.datenew.getMonth());
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
    if (this.data.FILE_URL != null) {
      this.generatePDF = false;
    } else {
      this.generatePDF = true;
    }
    this.getResidenceType();
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

  showgeneratedlist: any;
  generatelist() {
    this.loadingRecords = true;

    this.data.MONTH = this.datepipe.transform(this.Datenew, 'MM');
    let monthback = Number(this.data.MONTH) - 1;
    this.data.YEAR = this.datepipe.transform(this.Datenew, 'yyyy');
    let year = Number(this.data.YEAR);
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
                  this.showgeneratedlist = data['data'];
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
                      (err) => { }
                    );
                },
                (err) => { }
              );
          },
          (error) => {
            this.message.error('Failed To get data', '');
          }
        );
    }
  }
  currentstage = [];
  save(addNew: boolean, websitebannerPage: NgForm) {
    this.isOk = true;

    this.data.MONTH = this.datepipe.transform(this.Datenew, 'MM');
    this.data.YEAR = this.datepipe.transform(this.Datenew, 'yyyy');
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
      {
        if (this.data.ID) {
          this.api.UpdateFlatallocation(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              } else {
                this.data = new genertaeSenioritylist();
                this.resetDrawer(websitebannerPage);
              }
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          let fivedaygap = new Date();
          let keyofgap = new Date(
            fivedaygap.getFullYear(),
            fivedaygap.getMonth(),
            fivedaygap.getDate() + 5
          );
          this.data.OBJ_DATETIME_PERIOD = this.datepipe.transform(
            keyofgap,
            'yyyy-MM-dd HH:mm:ss'
          );

          if (this.FlatAllotmentmaster.length > 0) {
            this.modal.confirm({
              nzTitle:
                'The Type of Allotment Order is Already Published. Is this the Final Publish ?',
              nzOkText: 'Yes',
              nzOkType: 'primary',
              nzOkDanger: true,
              nzOnOk: () => {
                this.data.IS_FINAL = true;
                this.api
                  .CreateFlatAllocation(this.data)
                  .subscribe((successCode) => {
                    if (successCode.code == '200') {
                      this.message.success(
                        'Information Save Successfully...',
                        ''
                      );

                      this.api
                        .getstages(
                          0,
                          0,
                          '',
                          'desc',
                          '',
                          Number(sessionStorage.getItem('userId'))
                        )
                        .subscribe(
                          (data) => {
                            this.currentstage = data['data'][0];
                            this.currentstage['STEP_NO'] = 5;
                            this.api
                              .updatestates(this.currentstage)
                              .subscribe((successCode) => {
                                if (successCode.code == '200') {
                                  this.message.success(
                                    ' Information Updated Successfully...',
                                    ''
                                  );
                                } else {
                                  this.message.error(
                                    ' Failed To Update Information...',
                                    ''
                                  );
                                }
                              });
                          },
                          (err) => { }
                        );

                      if (!addNew) {
                        this.drawerClose();
                        this.isSpinning = false;
                        this.resetDrawer(websitebannerPage);
                      } else {
                        this.data = new genertaeSenioritylist();
                        this.resetDrawer(websitebannerPage);
                        this.data.FILE_URL = null;
                        this.showgeneratedlist = [];
                        if (this.data.FILE_URL != null) {
                          this.generatePDF = false;
                        } else {
                          this.generatePDF = true;
                        }

                        this.api
                          .getflatAllotmentMaster(
                            1,
                            1,
                            'SEQUENCE_NO',
                            'desc',
                            ''
                          )
                          .subscribe(
                            (data) => {
                              if (data['code'] == 200 && data['count'] > 0) {
                                var seqno = data['data'][0]['SEQUENCE_NO'];
                                this.data.SEQUENCE_NO = Number(seqno) + 1;
                              } else {
                                this.data.SEQUENCE_NO = 1;
                              }
                            },
                            (err) => { }
                          );
                      }

                      this.isSpinning = false;
                    } else {
                      this.message.error('Failed To Fill Information...', '');
                      this.isSpinning = false;
                    }
                  });
              },
              nzCancelText: 'No',
              nzOnCancel: () => { },
            });
          } else {
            this.data.IS_FINAL = false;
            this.api
              .CreateFlatAllocation(this.data)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success('Information Save Successfully...', '');

                  this.api
                    .getstages(
                      0,
                      0,
                      '',
                      'desc',
                      '',
                      Number(sessionStorage.getItem('userId'))
                    )
                    .subscribe(
                      (data) => {
                        this.currentstage = data['data'][0];
                        this.currentstage['STEP_NO'] = 5;
                        this.api
                          .updatestates(this.currentstage)
                          .subscribe((successCode) => {
                            if (successCode.code == '200') {
                              this.message.success(
                                ' Information Updated Successfully...',
                                ''
                              );
                            } else {
                              this.message.error(
                                ' Failed To Update Information...',
                                ''
                              );
                            }
                          });
                      },
                      (err) => { }
                    );

                  if (!addNew) {
                    this.drawerClose();
                    this.isSpinning = false;
                    this.resetDrawer(websitebannerPage);
                  } else {
                    this.data = new genertaeSenioritylist();
                    this.resetDrawer(websitebannerPage);
                    this.data.FILE_URL = null;
                    this.showgeneratedlist = [];
                    if (this.data.FILE_URL != null) {
                      this.generatePDF = false;
                    } else {
                      this.generatePDF = true;
                    }

                    this.api
                      .getflatAllotmentMaster(1, 1, 'SEQUENCE_NO', 'desc', '')
                      .subscribe(
                        (data) => {
                          if (data['code'] == 200 && data['count'] > 0) {
                            var seqno = data['data'][0]['SEQUENCE_NO'];
                            this.data.SEQUENCE_NO = Number(seqno) + 1;
                          } else {
                            this.data.SEQUENCE_NO = 1;
                          }
                        },
                        (err) => { }
                      );
                  }

                  this.isSpinning = false;
                } else {
                  this.message.error('Failed To Fill Information...', '');
                  this.isSpinning = false;
                }
              });
          }
        }
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
        .onUpload('flatAllocationList', this.transferFileURL, this.urllink)
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
  FlatprefListPDF = '';
  viewAssumptionPDF(pdfURL: string): void {
    this.FlatprefListPDF = '';
    this.view = 1;
    this.printOrderModalVisible = true;
    this.FlatprefListPDF = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  getS(link: string) {
    var a = '';
    if (this.view == 1) {
      a = this.api.retriveimgUrl + 'flatAllocationList/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
  generatePDF: boolean = true;
  clearGradepayletter() {
    this.data.FILE_URL = null;
    this.generatePDF = true;
  }

  AllotmentPreview: boolean = false;
  modaldata: any;
  modalarraydata: any;
  isSpinningmodal = false;
  openmodal() {
    // this.modaldata = this.data
    this.modalarraydata = this.showgeneratedlist;
    this.isSpinningmodal = true;
    this.api
      .getResidence(
        0,
        0,
        'ID',
        'asc',
        ' AND STATUS = 1 AND ID = ' + this.data.RESIDENCE_TYPE
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.modaldata = data['data'][0];
            this.AllotmentPreview = true;
            this.isSpinningmodal = false;
          }
        },
        (err) => { }
      );
  }
  closemodal() {
    this.AllotmentPreview = false;
  }
}
