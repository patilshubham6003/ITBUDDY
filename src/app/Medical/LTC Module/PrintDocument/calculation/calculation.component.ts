import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';

import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.css'],
  providers: [NzNotificationService],
})
export class CalculationComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  @Input() drawerClose: Function;
  @Input() LTC5data: any;
  @Input() destinationList: any;
  @Input() formdata7: any;
  @Input() amount: any;
  @Input() namount: any;
  pdfDownload: boolean = false;
  isAdmin: boolean = false;
  roleId: any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.remarkCount = Number(this.formdata7.length);
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
    const element = document.getElementById('calculation');
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
  getclaimedamount() {
    var amount = 0;
    if (this.formdata7.length > 0) {
      for (var i = 0; this.formdata7.length > i; i++) {
        amount += this.formdata7[i].JOURNEY_CLAIMED_AMOUNT;
      }
    }
    return amount;
  }
}
