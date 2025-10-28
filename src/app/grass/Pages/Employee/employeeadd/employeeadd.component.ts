import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeMaster } from 'src/app/grass/Models/Employee';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-employeeadd',
  templateUrl: './employeeadd.component.html',
  styleUrls: ['./employeeadd.component.css'],
})
export class EmployeeaddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: APIServicesService
  ) {}
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  mobilepattern = /^[6-9]\d{9}$/;
  ngOnInit(): void {}
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data!: EmployeeMaster;
  @Input() claimID: any;

  Cities!: EmployeeMaster[];

  Names = EmployeeMaster;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  passwordVisible = false;
  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new EmployeeMaster();
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

  changecast(event: any) {}

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.NAME.trim() == '' &&
      this.data.EMPLOYEE_CODE == undefined &&
      this.data.GRADE_PAY == undefined &&
      // this.data.OFFICE_NAME.trim() == '' &&
      this.data.DESIGNATION.trim() == '' &&
      this.data.LOCATION.trim() == '' &&
      // this.data.DDO_OF_THE_OFFICIAL.trim() == '' &&
      this.data.MOBILE_NO == undefined
      // &&
      // this.data.EMAIL_ID == undefined &&
      // this.data.PASSWORD == undefined
      // && this.data.ADDRESS == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Employee Name.', '');
    } else if (this.data.MOBILE_NO == undefined || this.data.MOBILE_NO <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Mobile Number', '');
    } else if (!this.mobilepattern.test(this.data.MOBILE_NO.toString())) {
      this.isOk = false;
      this.message.error('Please Enter Mobile No.', '');
      // } else if (this.data.EMAIL_ID == null || this.data.EMAIL_ID.trim() == '') {
      //   this.isOk = false;
      //   this.message.error(' Please Enter Email ID', '');
      // } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
      //   this.isOk = false;
      //   this.message.error('Please Enter Email id', '');
    }
    // else if (this.data.PASSWORD == null || this.data.PASSWORD == undefined) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Password', '');
    // } else if (
    //   (this.data.PASSWORD != null || this.data.PASSWORD != undefined) &&
    //   this.data.PASSWORD.length < 8
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Password Must Be 8 Character/Digit', '');

    // }
    else if (this.data.LOCATION == null || this.data.LOCATION.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Office Location', '');
    } else if (
      this.data.DESIGNATION == null ||
      this.data.DESIGNATION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Designation', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Employee Code  ', '');
      // } else if (
      //   this.data.DDO_OF_THE_OFFICIAL == null ||
      //   this.data.DDO_OF_THE_OFFICIAL.trim() == ''
      // ) {
      //   this.isOk = false;
      //   this.message.error(' Please Enter DDO of the Official', '');
    } else if (this.data.GRADE_PAY == undefined || this.data.GRADE_PAY <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Basic Pay  ', '');
    }

    if (this.isOk) {
      if (
        this.data.ADDRESS == undefined ||
        this.data.ADDRESS == null ||
        this.data.ADDRESS == '' ||
        this.data.ADDRESS.trim() == ''
      ) {
        this.data.ADDRESS = ' ';
      } else {
        this.data.ADDRESS = this.data.ADDRESS;
      }
      if (
        this.data.EMAIL_ID == undefined ||
        this.data.EMAIL_ID == null ||
        this.data.EMAIL_ID == '' ||
        this.data.EMAIL_ID.trim() == ''
      ) {
        this.data.EMAIL_ID = null;
      } else {
        this.data.EMAIL_ID = this.data.EMAIL_ID;
      }
      if (
        this.data.OFFICE_NAME == undefined ||
        this.data.OFFICE_NAME == null ||
        this.data.OFFICE_NAME == '' ||
        this.data.OFFICE_NAME.trim() == ''
      ) {
        this.data.OFFICE_NAME = '';
      } else {
        this.data.OFFICE_NAME = this.data.OFFICE_NAME;
      }
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.data.CLAIM_ID = this.claimID;
          this.api.updateEmployeeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              }
            } else if (successCode.code == '300') {
              this.message.error(
                'Mobile Number or Email ID Already Exist...',
                ''
              );
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api
            .createsimpleEmployeeMaster(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) {
                  this.drawerClose();
                  websitebannerPage.form.reset();
                } else {
                  this.data = new EmployeeMaster();
                  this.resetDrawer(websitebannerPage);
                  // this.data.IMG_URL= '';

                  // this.api.getEmployeeMaster(0, 0, '', 'desc', '').subscribe(
                  //   (data) => {
                  // if (data['count']==0){
                  //   this.data.SEQUENCE_NUMBER=1;
                  // }else
                  // {
                  //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                  // }
                  //   },
                  //   (err) => {
                  //
                  //   }
                  // );
                }
                this.isSpinning = false;
              } else if (successCode.code == '300') {
                this.message.error(
                  'Mobile Number or Email ID Already Exist...',
                  ''
                );
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
