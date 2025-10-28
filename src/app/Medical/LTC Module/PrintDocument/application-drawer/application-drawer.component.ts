import { Component, Input } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'ls-application-drawer',
  templateUrl: './application-drawer.component.html',
  styleUrls: ['./application-drawer.component.css'],
})
export class ApplicationDrawerComponent {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  @Input() data;
  @Input() relationdata1;
  @Input() numberOfSingleFare;
  @Input() amountOfSingleFare;
  @Input() journeyClassModes;
  @Input() journeyModes;
  @Input() advJourneyData;
  @Input() singleFareTotal;
  @Input() drawerClose: Function;
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
    if (this.data && this.data.DDO_OF_THE_OFFICIAL_ID) {
      this.DDO_Master_Data = [];
      this.api
        .getAllDDOs(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND ID = ' + this.data.DDO_OF_THE_OFFICIAL_ID
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
  close(): void {
    this.drawerClose();
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 1000;
    }
  }
  loadingRecords: any;
  printApplicationVisible = false;
  printApplicationCancel() {
    this.printApplicationVisible = false;
    // this.checkListData();
  }
  openPrintModal() {
    this.printApplicationVisible = true;
  }

  openApplicationPdf() {
    const element = document.getElementById('advanceApplication');
    const opt = {
      margin: 0.2,
      filename: 'AdvanceApplication.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  save() {
    this.loadingRecords = true;
    if (
      this.data.IS_ADVANCE_LTC_CREATED == false &&
      this.data.JOURNEY_DATA != null &&
      this.data.JOURNEY_DATA != undefined &&
      this.data.JOURNEY_DATA != ''
    ) {
      var journeyData = {
        CURRENT_STAGE_ID: this.data.CURRENT_STAGE_ID,
        JOURNEY_DATA: JSON.parse(this.data.JOURNEY_DATA),
        INSPECTOR_ID: this.data.INSPECTOR_ID,
        LTC_ID: this.data.ID,
      };
      this.api
        .ltcUpdateWithJourneyData(journeyData)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.IS_ADVANCE_LTC_CREATED = true;
            this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(
                  'Advance Claim Approve Successfully...',
                  ''
                );
                this.api
                  .getAllltcMaster(0, 0, '', '', ' AND ID =' + this.data.ID)
                  .subscribe((data) => {
                    if (data['code'] == 200) {
                      this.loadingRecords = false;
                      this.printApplicationVisible = true;
                    } else {
                      this.loadingRecords = false;
                    }
                  });
              } else {
                this.loadingRecords = false;
                this.message.error('Failed To Approve Claim....', '');
              }
            });
          } else {
            this.loadingRecords = false;
            this.message.error('Failed To Approve Claim....', '');
          }
        });
    } else {
      this.api.ltcMasterUpdate(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.loadingRecords = false;
          this.printApplicationVisible = true;
          this.message.success('Advance Claim Approve Successfully...', '');
        } else {
          this.loadingRecords = false;
          this.message.error('Failed To Approve Claim....', '');
        }
      });
    }
  }
}
