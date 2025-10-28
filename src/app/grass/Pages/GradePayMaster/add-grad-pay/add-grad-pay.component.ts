import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { ApiService } from 'src/app/Service/api.service';
// import { GradPayMaster } from '../../Models/GradPayMaster';
import { NgForm } from '@angular/forms';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { ResidenceMaster } from 'src/app/grass/Models/ResidenceModal';
import { QuarterMaster } from 'src/app/grass/Models/Quarter';
import { GradPayMaster } from 'src/app/grass/Models/GradPayMaster';
// import { ResidenceMaster } from '../../Models/ResidenceModal';
// import { QuarterMaster } from '../../Models/Quarter';

@Component({
  selector: 'app-add-grad-pay',
  templateUrl: './add-grad-pay.component.html',
  styleUrls: ['./add-grad-pay.component.css'],
})
export class AddGradPayComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService
  ) { }
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  abc = false;

  isOk = true;

  Residence: ResidenceMaster[] = [];
  Quarter: QuarterMaster[] = [];

  ngOnInit(): void {
    this.loadResidence();
    // this.loadQuarter();
  }

  loadResidence() {
    this.abc = true;
    this.api.getResidence(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
      (data) => {
        this.Residence = data['data'];
        this.abc = false;
      },
      (err) => {
        this.abc = false;
      }
    );
  }

  // loadQuarter() {
  //   this.api.getQuarterMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
  //     (data) => {
  //       this.Quarter = data['data'];
  //     },
  //     (err) => {
  //
  //       this.isSpinning = false;
  //     }
  //   );
  // }
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = GradPayMaster;

  Cities: any = GradPayMaster;

  Names = GradPayMaster;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new GradPayMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //// Only number and dot
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.RESIDENCE_TYPE_ID <= 0 &&
      this.data.QUARTER_ID <= 0 &&
      this.data.AMOUNT <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (
      this.data.RESIDENCE_TYPE_ID == undefined ||
      this.data.RESIDENCE_TYPE_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Residence Type', '');
    }

    // else if (this.data.QUARTER_ID == undefined || this.data.QUARTER_ID <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Select Quarter  ', '');
    // }
    else if (this.data.AMOUNT == undefined || this.data.AMOUNT <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Correct Amount ', '');
    } else if (
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Correct Sequence No ', '');
    }

    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateGradPay(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api
          .createGradPay(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new GradPayMaster();
                this.resetDrawer(websitebannerPage);
                this.api
                  .getResidence(1, 1, 'SEQUENCE_NO', 'desc', '')
                  .subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NO = 1;
                      } else {
                        this.data.SEQUENCE_NO =
                          data['data'][0]['SEQUENCE_NO'] + 1;
                      }
                    },
                    (err) => { }
                  );
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
}
