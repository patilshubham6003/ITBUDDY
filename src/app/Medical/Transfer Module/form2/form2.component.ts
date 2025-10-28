import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { form2 } from '../../Models/form2';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.css'],
})
export class Form2Component implements OnInit {
  modedata: any[] = [];
  @Input() classdata: any[] = [];
  classdatatravelled: any[] = [];
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: form2;
  @Input() empID: any;
  @Input() claimID: any;
  ID: any;
  DATE: any;
  MODE_OF_CONVEYANCE: any;
  FROM_PLACE_NAME: any;
  TO_PLACE_NAME: any;
  TO_ENTITLED: any;
  BY_TRAYLLED: any;
  FARE_PAID: any;
  roleId: any;
  isAdmin: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isSpinning = false;
  isShowCSS: boolean = false;
  isOk = true;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      Number(sessionStorage.getItem('roleId')) != null &&
      Number(sessionStorage.getItem('roleId')) == 2
    ) {
      this.isShowCSS = true;
    } else {
      this.isShowCSS = false;
    }

    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {}
    );

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
  }
  classLoader: boolean = false;
  conveyanceMode(event) {
    this.data.TRAVEL_MODE_ID = event;
    this.classdata = [];
    if (
      this.data.TRAVEL_MODE_ID != undefined &&
      this.data.TRAVEL_MODE_ID != null &&
      this.data.TRAVEL_MODE_ID != ''
    ) {
      this.classLoader = true;
      this.data.TRAVELLED_TRAVEL_CLASS_ID = null;
      this.data.ENTITLED_TRAVEL_CLASS_ID = null;
      this.api
        .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID = ' + event)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.classdata = data['data'];
              this.classLoader = false;
            } else {
              this.classLoader = false;
              this.classdata = [];
              this.message.error('Something Went Wrong', '');
            }
          },
          (err) => {}
        );
    } else {
      this.classLoader = false;
      this.data.TRAVELLED_TRAVEL_CLASS_ID = null;
      this.data.ENTITLED_TRAVEL_CLASS_ID = null;
      this.classdata = [];
    }
  }
  close(AddNewRecord: NgForm) {
    this.drawerClose();
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new form2();

    AddNewRecord.form.markAsPristine();
    AddNewRecord.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  save(addNew: boolean, AddNewRecord: NgForm): void {
    this.isSpinning = true;
    this.isOk = true;
    this.data.TRANSFER_ID = this.claimID;
    this.data.EMP_ID = this.empID;
    if (
      this.data.TRANSPORTATION_CLAIMED_AMOUNT != null ||
      this.data.TRANSPORTATION_CLAIMED_AMOUNT != undefined
    ) {
      this.data.TRANSPORTATION_CLAIMED_AMOUNT = Number(
        this.data.TRANSPORTATION_CLAIMED_AMOUNT
      );
    } else {
    }
    if (
      (this.data.FARE_OF_ENTITLED_CLASS != null ||
        this.data.FARE_OF_ENTITLED_CLASS != undefined ||
        this.data.FARE_OF_ENTITLED_CLASS != '') &&
      this.roleId != 2
    ) {
      this.data.FARE_OF_ENTITLED_CLASS = Number(
        this.data.FARE_OF_ENTITLED_CLASS
      );
    } else {
    }
    if (
      (this.data.DATE == '' || this.data.DATE == undefined) &&
      (this.data.FROM_PLACE == '' || this.data.FROM_PLACE == undefined) &&
      (this.data.TO_PLACE == '' || this.data.TO_PLACE == undefined) &&
      (this.data.ENTITLED_TRAVEL_CLASS_ID == '' ||
        this.data.ENTITLED_TRAVEL_CLASS_ID == undefined) &&
      (this.data.TRAVELLED_TRAVEL_CLASS_ID == '' ||
        this.data.TRAVELLED_TRAVEL_CLASS_ID == undefined)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.DATE == null || this.data.DATE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Date.', '');
    } else if (this.data.FROM_PLACE == null || this.data.FROM_PLACE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter From Place.', '');
    } else if (this.data.TO_PLACE == null || this.data.TO_PLACE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter To Place.', '');
    } else if (
      this.data.ENTITLED_TRAVEL_CLASS_ID == null ||
      this.data.ENTITLED_TRAVEL_CLASS_ID == '' ||
      this.data.ENTITLED_TRAVEL_CLASS_ID == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Class To Which Entitled.', '');
    } else if (
      this.data.TRAVELLED_TRAVEL_CLASS_ID == null ||
      this.data.TRAVELLED_TRAVEL_CLASS_ID == '' ||
      this.data.TRAVELLED_TRAVEL_CLASS_ID == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Class By Which Travelled.', '');
    } else if (
      (this.data.FARE_OF_ENTITLED_CLASS == null ||
        this.data.FARE_OF_ENTITLED_CLASS == '' ||
        this.data.FARE_OF_ENTITLED_CLASS == undefined) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Fare Of Entitled Class.', '');
    } else if (
      this.data.TRANSPORTATION_CLAIMED_AMOUNT == null ||
      this.data.TRANSPORTATION_CLAIMED_AMOUNT == '' ||
      this.data.TRANSPORTATION_CLAIMED_AMOUNT == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Claimed Amount.', '');
    } else if (
      this.roleId != 2 &&
      this.data.TRANSPORTATION_CLAIMED_AMOUNT < this.data.FARE_OF_ENTITLED_CLASS
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Of Entitled Class Which is Less than Claimed Amount',
        ''
      );
    }
    if (this.isOk) {
      this.data.TRANSFER_ID = this.claimID;
      this.data.EMP_ID = this.empID;
      if (this.data.DATE == undefined) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      }
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updatetransfortation(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
              AddNewRecord.form.reset();
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createtransfortation(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new form2();
                this.resetDrawer(AddNewRecord);
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
