import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ContactDirectory } from 'src/app/Modal/contact_directory';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-contact-directory-master',
  templateUrl: './contact-directory-master.component.html',
  styleUrls: ['./contact-directory-master.component.css'],
})
export class ContactDirectoryMasterComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any;

  isSpinning = false;
  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  OfficeName: any = [];
  serviceName: any = [];

  ngOnInit() {
    this.getOfficeName();
    this.getServiceName();
  }

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new ContactDirectory();
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

  getServiceName() {
    this.api.getAllService(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.serviceName = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getOfficeName() {
    this.api.getOfficeMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.OfficeName = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == '' &&
      this.data.DESIGNATION == undefined &&
      this.data.MOBILE_NO == undefined &&
      this.data.EMAIL_ID == undefined &&
      this.data.SERVICE_ID == undefined &&
      this.data.OFFICE_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME.trim() == '' || this.data.NAME == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Name  ', '');
    } else if (
      this.data.DESIGNATION == null ||
      this.data.DESIGNATION == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Designation.', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile Number  ', '');
    } else if (
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Email Id.', '');
    } else if (
      this.data.SERVICE_ID == null ||
      this.data.SERVICE_ID == undefined ||
      this.data.SERVICE_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Service Name.', '');
    } else if (
      this.data.OFFICE_ID == null ||
      this.data.OFFICE_ID == undefined ||
      this.data.OFFICE_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Office Name.', '');
    } else if (
      this.data.SEQUENCE_NO == null ||
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updateContactDirectory(this.data)
            .subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.message.success('Information Changed Successfully...', '');

                if (!addNew) {
                  this.drawerClose();
                  this.isSpinning = false;
                  websitebannerPage.form.reset();
                } else {
                  this.data = new ContactDirectory();
                  this.resetDrawer(websitebannerPage);
                }
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createContactDirectory(this.data)
            .subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.message.success('Information Save Successfully...', '');

                if (!addNew) {
                  this.drawerClose();
                  this.isSpinning = false;
                  this.resetDrawer(websitebannerPage);
                } else {
                  this.data = new ContactDirectory();
                  this.getSequenceNo();
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

  getSequenceNo() {
    this.api.getContactDirectory(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200 && data['count'] > 0) {
          var seqno = data['data'][0]['SEQUENCE_NO'];
          this.data.SEQUENCE_NO = Number(seqno) + 1;
        } else {
          this.data.SEQUENCE_NO = 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
