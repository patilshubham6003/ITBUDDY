import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-calculation-drawer',
  templateUrl: './calculation-drawer.component.html',
  styleUrls: ['./calculation-drawer.component.css'],
})
// export class CalculationDrawerComponent {
//   @Input() drawerClose!: Function;
//   @Input()
//   drawerVisible:boolean;
// }
export class CalculationDrawerComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  @Input() drawerClose: Function;
  @Input() LTC5data: any;
  @Input() advDestinationList: any;
  @Input() advformdata7: any;
  // @Input() advAmount: any;
  // @Input() advNamount: any;
  @Input() eligibleAmount: any;
  @Input() advanceAllowable: any;
  pdfDownload: boolean = false;
  isAdmin: boolean = false;
  roleId: any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.remarkCount = Number(this.advformdata7.length);
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
  }
  visible5 = false;
  open(): void {
    this.visible5 = true;
  }

  close(): void {
    this.drawerClose();
  }

  openpdf() {
    const element = document.getElementById('advCalculation');
    const opt = {
      margin: 0.2,
      filename: 'Calculation.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  save() {
    this.loadingRecords = true;
    this.api.ltcMasterUpdate(this.LTC5data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.loadingRecords = false;
        this.printOrderModalVisible = true;

        this.message.success('Information Saved Successfully...', '');
      } else {
        this.loadingRecords = false;
        this.message.error('Failed To Save Information....', '');
      }
    });
  }
  openPrintModal() {
    this.printOrderModalVisible = true;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 900;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  editorConfigPara: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Remark...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };

  getlevel(level: any) {
    if (level != null && level != undefined && level != '') {
      const numbers = level.match(/\d+/g);
      return numbers;
    }
  }
  remarkCount: any = 0;
  totalClaimed: any = 0;
  getTotalClaimed() {
    this.totalClaimed = 0;
    var advAmountClaimed = 0;
    if (this.advformdata7.length > 0) {
      for (var i = 0; this.advformdata7.length > i; i++) {
        advAmountClaimed +=
          Number(this.advformdata7[i].JOURNEY_CLAIMED_AMOUNT) *
          Number(this.advformdata7[i].NO_OF_FAIRS);
      }
      this.totalClaimed = advAmountClaimed;
    }
    return advAmountClaimed;
  }
  // getTotalFarePaid() {
  //   var advFarePaid = 0;
  //   if (this.advformdata7.length > 0) {
  //     for (var i = 0; this.advformdata7.length > i; i++) {
  //       advFarePaid += this.advformdata7[i].FAIR_PAID;
  //     }
  //   }
  //   return advFarePaid;
  // }
  totalFarePaid: any = 0;
  getTotalFarePaid() {
    this.totalFarePaid = 0;
    var advFarePaid = 0;
    if (this.advformdata7.length > 0) {
      for (var i = 0; this.advformdata7.length > i; i++) {
        advFarePaid += this.advformdata7[i].FAIR_PAID;
      }
      this.totalFarePaid = advFarePaid;
    }
    return advFarePaid;
  }
}
