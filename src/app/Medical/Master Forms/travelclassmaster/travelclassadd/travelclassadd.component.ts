import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Travelclass } from 'src/app/Medical/Models/Travelclass';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-travelclassadd',
  templateUrl: './travelclassadd.component.html',
  styleUrls: ['./travelclassadd.component.css'],
})
export class TravelclassaddComponent implements OnInit {
  @Input()
  data: Travelclass = new Travelclass();
  @Input()
  drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  screenwidth: any;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  travelmode: any = [];
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    // this.screenwidth = window.innerWidth;
    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.travelmode = data['data'];
        }
      },
      (err) => {}
    );
  }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new Travelclass();

    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.MODE_ID == 0 && this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.MODE_ID == null || this.data.MODE_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select Travel Mode', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Name.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updatetravelclass(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createtravelclass(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new Travelclass();
                this.resetDrawer(websitebannerPage);
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
