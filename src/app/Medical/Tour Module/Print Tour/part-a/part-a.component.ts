import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-part-a',
  templateUrl: './part-a.component.html',
  styleUrls: ['./part-a.component.css'],
})
export class PartAComponent implements OnInit {
  @Input() tform: any;
  @Input() drawerClose: any;
  @Input() partadata: any;
  @Input() detailsandpurpose: any;
  @Input() particularofhotelsdata: any;
  @Input() particularoftours: any;
  @Input() particularofcity: any;
  @Input() fooddata: any;
  pdfDownload: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isAdmin: boolean = false;
  ngOnInit(): void {
    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.DataFromDDO();
  }

  DDO_Master_Data: any = [];
  DataFromDDO() {
    if (this.partadata && this.partadata.DDO_OF_THE_OFFICIAL_ID) {
      this.DDO_Master_Data = [];
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' + this.partadata.DDO_OF_THE_OFFICIAL_ID
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
  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.loadingRecords = false;
    this.drawerClose();
  }
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Part-A.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }
  // printModel() {
  //   this.loadingRecords = true;
  //   this.api
  //     .gettransferdata(0, 0, '', '', ' AND ID = ' + this.partadata.ID)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.loadingRecords = false;
  //           this.partadata = data['data'][0];
  //           this.printOrderModalVisible = true;
  //         } else {
  //           // this.message.error("Can't Load Data", '');
  //           this.loadingRecords = false;
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

  printModel() {
    this.printOrderModalVisible = true;
  }
  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  showmodal() {
    this.loadingRecords = true;
    if (!this.isAdmin) {
      this.api.updatetour(this.partadata).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.loadingRecords = false;

          this.message.success('Information Saved Successfully...', '');
          this.printOrderModalVisible = true;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.loadingRecords = false;
        }
      });
    } else {
      this.printOrderModalVisible = true;
      this.loadingRecords = false;
    }
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  getTimeIn12Hour(time: any) {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd' + ' ' + time);
  }
}
