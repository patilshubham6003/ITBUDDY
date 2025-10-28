import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NgForm } from '@angular/forms';
import { HospitalMaster } from 'src/app/Medical/Models/HospitalMaster';

@Component({
  selector: 'app-addhospitalmaster',
  templateUrl: './addhospitalmaster.component.html',
  styleUrls: ['./addhospitalmaster.component.css'],
})
export class AddhospitalmasterComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: HospitalMaster;
  @Input() list: any = [];
  @Input() list1: any = [];
  @Input() list2: any = [];
  @Input() list3: any = [];
  @Input() list4: any = [];
  @Input() list5: any = [];
  @Input() facility: any = [];

  accreditation: any = [];
  hospitaltype: any = [];
  memorandom: any = [];
  city: HospitalMaster[] = [];
  isSpinning = false;
  isOk = true;
  mobpattern = /^[6-9]\d{9}$/;

  status: boolean = true;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.getcity();
    this.getFacility();
    this.getnotification();
  }

  categoryList: any = [];

  getcity() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.city = data['data'];
        }
      },
      (err) => {}
    );
  }
  getFacility() {
    this.api.getMedicalFacility(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.facility = data['data'];
        }
      },
      (err) => {}
    );
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

  isValidMobile(mobile) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }

  isValidEmail(email) {
    const expression =
      /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    return expression.test(String(email).toLowerCase());
  }
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  memonotification: any = [];

  getnotification() {
    this.api.getAllNotification(0, 0, '', '', ' ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.memonotification = data['data'];
        }
      },
      (err) => {}
    );
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.CITY_ID == undefined &&
      this.data.HOSPITAL_TYPE == undefined &&
      this.data.NAME.trim() == '' &&
      // this.data.CONTACT_NOS <= 0 &&

      this.data.ADDRESS.trim() == '' &&
      // this.data.EMAILS .trim() == '' &&

      // this.data.NODAL_OFFICER_NAMES .trim() == '' &&
      // this.data.MOBILE_NOS <= 0 &&
      this.data.ACCREDITATION == undefined &&
      // this.data.EMPANELLED_FOR .trim() == '' &&
      this.data.NOTIFICATION_MEMORAMDUM_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.CITY_ID == null || this.data.CITY_ID <= 0) {
      this.isOk = false;
      this.message.error('Please Select City Name', '');
    } else if (
      this.data.HOSPITAL_TYPE == null ||
      this.data.HOSPITAL_TYPE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Hospital Type', '');
    }
    // else if (this.data.NAME == null || this.data.NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter City Name.', '');
    // }
    else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Hospital Name', '');
    } else if (this.data.ADDRESS == null || this.data.ADDRESS.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Address ', '');
    }
    // else if (this.data.CONTACT_NOS == undefined || this.data.CONTACT_NOS <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Contact Number  ', '');
    // }
    // else if (this.data.EMAILS == null || this.data.EMAILS.trim() == '') {
    //   this.isOk = false;
    //   this.message.error('Please Enter Email id', '');
    // }
    // else if (!this.emailpattern.test(this.data.EMAILS)) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Email id', '');

    // }
    // else if (this.data.NODAL_OFFICER_NAMES == null || this.data.NODAL_OFFICER_NAMES.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Nodal Officer Name', '');
    // }
    // else if (this.data.MOBILE_NOS == undefined || this.data.MOBILE_NOS <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Mobile Number  ', '');
    // }
    // else if (!this.mobpattern.test(this.data.MOBILE_NOS.toString())) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Mobile No.', '');

    // }
    else if (
      this.data.ACCREDITATION == null ||
      this.data.ACCREDITATION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Accteditation', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (
        this.data.CONTACT_NOS !== null &&
        this.data.CONTACT_NOS !== undefined
      ) {
      } else {
      }
      this.data.CONTACT_NOS = this.data.CONTACT_NOS.toString();
      this.data.NODAL_OFFICER_NAMES = this.data.NODAL_OFFICER_NAMES.toString();
      this.data.EMAILS = this.data.EMAILS.toString();
      this.data.MOBILE_NOS = this.data.MOBILE_NOS.toString();
      this.data.FACILITIES_ID = this.data.FACILITIES_ID.toString();
      {
        if (this.data.ID) {
          this.api.updateHospital(this.data).subscribe((successCode) => {
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
          this.api.createhospital(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new HospitalMaster();
                this.resetDrawer(websitebannerPage);
                // this.data.IMG_URL= '';

                this.api.getAllHospital(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    // if (data['count']==0){
                    //   this.data.SEQUENCE_NUMBER=1;
                    // }else
                    // {
                    //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                    // }
                  },
                  (err) => {}
                );
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
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new HospitalMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
}
