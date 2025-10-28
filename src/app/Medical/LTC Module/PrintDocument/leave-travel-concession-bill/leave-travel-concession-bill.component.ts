import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { checkListltc1 } from 'src/app/Medical/Models/checklistltc';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-leave-travel-concession-bill',
  templateUrl: './leave-travel-concession-bill.component.html',
  styleUrls: ['./leave-travel-concession-bill.component.css'],
  providers: [NzNotificationService],
})
export class LeaveTravelConcessionBillComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe
  ) {}
  isVisible = false;

  @Input() drawerClose: Function;
  @Input() LTC6data: any;
  @Input() relationdata1: any;
  @Input() formdata3: any;
  @Input() formdata1: any;
  @Input() aamount: any;
  @Input() checkListltc: checkListltc1 = new checkListltc1();

  @Input() formdata7: any;
  @Input() childrenList: any;
  @Input() wifeList: any;
  @Input() selfList: any;
  isAdmin: boolean = false;
  roleId: any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.DataFromDDO();
  }

  DDO_Master_Data: any = [];
  DataFromDDO() {
    if (this.LTC6data && this.LTC6data.DDO_OF_THE_OFFICIAL_ID) {
      this.DDO_Master_Data = [];
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' + this.LTC6data.DDO_OF_THE_OFFICIAL_ID
        )
        .subscribe(
          (data: any) => {
            if (data['code'] == 200) {
              if (data['count'] > 0) {
                this.DDO_Master_Data = data['data'];
              } else {
                this.DDO_Master_Data = [];
              }
            } else {
            }
          },
          (err) => {}
        );
    } else {
      this.DDO_Master_Data = [];
    }
  }
  concessionBill() {
    this.isVisible = true;
  }

  close(): void {
    this.drawerClose();
  }
  openpdf() {
    const element = document.getElementById('GoLtcFinal');
    const opt = {
      margin: 0.2,
      filename: 'Parta.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  showmodal() {
    if (
      this.checkListltc.LTC_ID != null &&
      this.checkListltc.LTC_ID != '' &&
      this.checkListltc.LTC_ID != undefined
    ) {
      this.api
        .ltcJourneyChecklistupdate(this.checkListltc)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.drawerClose();
            this.loadingRecords = false;
            this.printOrderModalVisible = true;
            this.message.success('Information Saved Successfully...', '');
          } else {
            this.loadingRecords = false;
            this.message.error('Failed To Save Information....', '');
          }
        });
    } else {
      this.checkListltc.LTC_ID = this.LTC6data.ID;
      this.api
        .ltcJourneyChecklistcreate(this.checkListltc)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.drawerClose();
            // this.loadingRecords = false;
            // this.printOrderModalVisible = true;
            this.printOrderModalVisible = true;
            this.message.success('Information Saved Successfully...', '');
          } else {
            this.loadingRecords = false;
            this.message.error('Failed To Save Information....', '');
          }
        });
    }
  }
  checkListData() {
    this.api
      .ltcJourneyChecklistget(
        0,
        0,
        'ID',
        'desc',
        ' AND LTC_ID=' + this.LTC6data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.checkListltc = data['data'][0];
          } else {
            this.message.error("Can't Load User Information", '');
          }
        },
        (err) => {}
      );
  }

  showModalOnly() {
    this.printOrderModalVisible = true;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 950;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
    this.checkListData();
  }

  getdate(a: any, b: any) {
    if (a != null && b != null) {
      a = new Date(a);
      b = new Date(b);
      a = this.datepipe.transform(a, 'dd-MM-yyyy');
      b = this.datepipe.transform(b, 'dd-MM-yyyy');
      if (a == b) {
        return 'on  ' + a;
      } else {
        return a + ' to ' + b;
      }
    } else {
      return '';
    }
  }
}
