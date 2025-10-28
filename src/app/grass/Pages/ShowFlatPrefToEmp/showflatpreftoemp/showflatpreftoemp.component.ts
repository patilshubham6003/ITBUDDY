import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-showflatpreftoemp',
  templateUrl: './showflatpreftoemp.component.html',
  styleUrls: ['./showflatpreftoemp.component.css'],
})
export class ShowflatpreftoempComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: AllotmentMaster;

  RESIDENCE_TYPE: any;
  listview: any = [];
  isSpinning: boolean = false;
  ResidenceType: any = [];
  ObjectionDataList: any = [];
  Senioritylistid: any;
  Datenew = new Date();
  arrayofflat: any = [];
  month: any;
  year: any;
  filterkey: string = '';

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.month = this.datepipe.transform(this.Datenew, 'MM');
    this.year = this.datepipe.transform(this.Datenew, 'yyyy');
    this.getResidenceType();
  }

  getflatpreference() {
    if (
      this.RESIDENCE_TYPE == null ||
      this.RESIDENCE_TYPE == undefined ||
      this.RESIDENCE_TYPE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else {
      this.isSpinning = true;
      let applnddate = this.data['APPLICATION_DATETIME'];
      let applnmonth = Number(this.datepipe.transform(applnddate, 'MM'));
      let applnyear = Number(this.datepipe.transform(applnddate, 'yyyy'));
      let applynnextmonth = applnmonth + 1;
      this.api
        .getWaitinglist(
          0,
          0,
          'ID',
          'desc',
          ' AND MONTH = ' +
          applynnextmonth +
          ' AND YEAR = ' +
          applnyear +
          ' AND RESIDENCE_TYPE = ' +
          this.RESIDENCE_TYPE
        )
        .subscribe(
          (data) => {
            this.listview = data['data'];
            this.isSpinning = false;
            if (this.listview.length <= 0) {
              this.message.info('No Order Generated Yet.', '');
            }
          },
          (error) => { }
        );
    }
  }

  getResidenceType() {
    this.isSpinning = true;
    if (this.data) {
      this.api
        .residenceTypeRequest(
          0,
          0,
          '',
          '',
          ' AND FLAT_REQUEST_ID = ' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.ResidenceType = data['data'];
            this.isSpinning = false;
          }
        });
    }
  }

  Close() {
    this.drawerClose();
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  showflatprefPDF = '';
  viewAssumptionPDF(pdfURL: string): void {
    this.showflatprefPDF = '';
    this.view = 1;
    this.printOrderModalVisible = true;
    this.showflatprefPDF = this.getS(pdfURL);
  }

  sanitizedLink: any = '';
  getS(link: string) {
    var a = '';
    if (this.view == 1) {
      a = this.api.retriveimgUrl + 'waitingList/' + link;
    }

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
}
