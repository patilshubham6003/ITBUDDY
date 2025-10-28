import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OfficeMaster } from 'src/app/Medical/Models/officemaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-officeadd',
  templateUrl: './officeadd.component.html',
  styleUrls: ['./officeadd.component.css'],
})
export class OfficeaddComponent implements OnInit {
  @Input()
  data: OfficeMaster = new OfficeMaster();
  @Input()
  drawerClose!: Function;
  @Input()
  drawerVisible: boolean = false;
  screenwidth: any;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  area: [] = [];
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.area = data['data'];
        }
      },
      (err) => {

      }
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
    this.data = new OfficeMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.NAME.trim() == '' && this.data.ADDRESS.trim() == '') {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Name.', '');
    } else if (this.data.ADDRESS == null || this.data.ADDRESS.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Address.', '');
    } else if (this.data.SEQ_NO == undefined || this.data.SEQ_NO <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number.', '');
    }

    // create update

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateofficemaster(this.data).subscribe((successCode) => {
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
          this.api.createofficemaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new OfficeMaster();
                this.resetDrawer(websitebannerPage);
                // this.data.IMG_URL= '';
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
