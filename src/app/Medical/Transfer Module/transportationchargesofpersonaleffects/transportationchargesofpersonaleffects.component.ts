import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { form3 } from '../../Models/form3';

@Component({
  selector: 'app-transportationchargesofpersonaleffects',
  templateUrl: './transportationchargesofpersonaleffects.component.html',
  styleUrls: ['./transportationchargesofpersonaleffects.component.css'],
})
export class TransportationchargesofpersonaleffectsComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: form3;
  @Input() empID: any;
  @Input() claimID: any;
  modedata: any[] = [];
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

  close(AddNewRecord: NgForm) {
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
    this.drawerClose();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new form3();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    AddNewRecord.form.markAsPristine();
    AddNewRecord.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, AddNewRecord: NgForm): void {
    this.isSpinning = true;
    this.data.TRANSFER_ID = this.claimID;
    this.isOk = true;

    this.data.EMP_ID = this.empID;

    if (
      this.data.AMOUNT == null ||
      this.data.AMOUNT == undefined ||
      this.data.AMOUNT == ''
    ) {
      this.data.AMOUNT = 0;
    }

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
      (this.data.AMOUNT != null ||
        this.data.AMOUNT != undefined ||
        this.data.AMOUNT != '') &&
      this.roleId != 2
    ) {
      this.data.AMOUNT = Number(this.data.AMOUNT);
    } else {
    }
    if (
      (this.data.DATE == null || this.data.DATE == undefined) &&
      (this.data.TRANSPORT_MODE_ID == null ||
        this.data.TRANSPORT_MODE_ID == undefined) &&
      (this.data.FROM_STATION == '' || this.data.FROM_STATION == undefined) &&
      (this.data.TO_STATION == '' || this.data.TO_STATION == undefined) &&
      (this.data.WEIGHT_IN_KG == '' || this.data.WEIGHT_IN_KG == undefined) &&
      (this.data.RATE == '' || this.data.RATE == undefined) &&
      (this.data.DISTANCE == '' || this.data.DISTANCE == undefined) &&
      (this.data.REMARKS == '' || this.data.REMARKS == undefined)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.DATE == null ||
      this.data.DATE == undefined ||
      this.data.DATE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Date.', '');
    } else if (
      this.data.TRANSPORT_MODE_ID == null ||
      this.data.TRANSPORT_MODE_ID == undefined ||
      this.data.TRANSPORT_MODE_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Transport Mode.', '');
    } else if (
      this.data.FROM_STATION == null ||
      this.data.FROM_STATION == undefined ||
      this.data.FROM_STATION == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter From Station.', '');
    } else if (
      this.data.TO_STATION == null ||
      this.data.TO_STATION == undefined ||
      this.data.TO_STATION == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter To Station.', '');
    } else if (
      this.data.WEIGHT_IN_KG == null ||
      this.data.WEIGHT_IN_KG == undefined ||
      this.data.WEIGHT_IN_KG == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Weight.', '');
    } else if (this.data.WEIGHT_IN_KG >= 6001) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Weight below 6000.', '');
    } else if (
      this.data.RATE == null ||
      this.data.RATE == undefined ||
      this.data.RATE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Rate.', '');
    } else if (
      this.data.DISTANCE == null ||
      this.data.DISTANCE == undefined ||
      this.data.DISTANCE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Distance.', '');
    } else if (
      (this.data.AMOUNT == null ||
        this.data.AMOUNT == undefined ||
        this.data.AMOUNT == '') &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Admissible Amount.', '');
    } else if (
      this.data.REMARKS == null ||
      this.data.REMARKS == undefined ||
      this.data.REMARKS == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Remark.', '');
    } else if (
      this.roleId != 2 &&
      this.data.TRANSPORTATION_CLAIMED_AMOUNT < this.data.AMOUNT
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Amount Which is Less than Claimed Amount',
        ''
      );
    }

    if (this.isOk) {
      this.data.TRANSFER_ID = this.claimID;
      if (this.data.DATE == undefined) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      }
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updatetransfarchnagedetailspersonal(this.data)
            .subscribe((successCode) => {
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
          this.api
            .createtransfarchnagedetailspersonal(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new form3();
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

  weightCalculation(event) {
    if (event != null) {
      if (this.data.TRANSPORT_MODE_ID != 3) {
        if (
          this.data.RATE != null &&
          this.data.RATE != undefined &&
          this.data.RATE != '' &&
          this.data.DISTANCE != null &&
          this.data.DISTANCE != undefined &&
          this.data.DISTANCE != ''
        ) {
          var calculateAmount: any =
            (event * this.data.RATE * this.data.DISTANCE) / 6000;
          calculateAmount = Math.max(0, parseInt(calculateAmount))
            .toString()
            .slice(0, 8);
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
          this.data.AMOUNT = this.data.AMOUNT;
        }
      } else {
      }
    } else {
    }
  }
  rateCalculation(event) {
    if (event != null) {
      // if (
      //   this.data.WEIGHT_IN_KG != null &&
      //   this.data.WEIGHT_IN_KG != undefined &&
      //   this.data.WEIGHT_IN_KG != '' &&
      //   this.data.DISTANCE != null &&
      //   this.data.DISTANCE != undefined &&
      //   this.data.DISTANCE != ''
      // ) {
      //   var calculateAmount: any =
      //     (event * this.data.WEIGHT_IN_KG * this.data.DISTANCE) / 6000;
      //   calculateAmount = Math.max(0, parseInt(calculateAmount))
      //     .toString()
      //     .slice(0, 8);
      //   this.data.AMOUNT = Math.round(calculateAmount);
      // } else {
      //   this.data.AMOUNT = this.data.AMOUNT;
      // }
      if (this.data.TRANSPORT_MODE_ID == 3) {
        if (
          this.data.DISTANCE != null &&
          this.data.DISTANCE != undefined &&
          this.data.DISTANCE != ''
        ) {
          var calculateAmount: any = '';
          calculateAmount = event * this.data.DISTANCE;
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
        }
      } else {
        if (
          this.data.WEIGHT_IN_KG != undefined &&
          this.data.WEIGHT_IN_KG != null &&
          this.data.WEIGHT_IN_KG != '' &&
          this.data.DISTANCE != undefined &&
          this.data.DISTANCE != null &&
          this.data.DISTANCE != ''
        ) {
          var calculateAmount: any =
            (event * this.data.WEIGHT_IN_KG * this.data.DISTANCE) / 6000;
          calculateAmount = Math.max(0, parseInt(calculateAmount))
            .toString()
            .slice(0, 8);
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
        }
      }
    } else {
    }
  }
  distanceCalculation(event) {
    if (event != null) {
      if (this.data.TRANSPORT_MODE_ID == 3) {
        if (
          this.data.RATE != null &&
          this.data.RATE != undefined &&
          this.data.RATE != ''
        ) {
          var calculateAmount: any = '';
          calculateAmount = event * this.data.RATE;
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
        }
      } else {
        if (
          this.data.WEIGHT_IN_KG != undefined &&
          this.data.WEIGHT_IN_KG != null &&
          this.data.WEIGHT_IN_KG != '' &&
          this.data.RATE != undefined &&
          this.data.RATE != null &&
          this.data.RATE != ''
        ) {
          var calculateAmount: any =
            (event * this.data.RATE * this.data.WEIGHT_IN_KG) / 6000;
          calculateAmount = Math.max(0, parseInt(calculateAmount))
            .toString()
            .slice(0, 8);
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
        }
      }

      // if (
      //   this.data.WEIGHT_IN_KG != null &&
      //   this.data.WEIGHT_IN_KG != undefined &&
      //   this.data.WEIGHT_IN_KG != '' &&
      //   this.data.RATE != null &&
      //   this.data.RATE != undefined &&
      //   this.data.RATE != ''
      // ) {
      //   var calculateAmount: any =
      //     (event * this.data.WEIGHT_IN_KG * this.data.RATE) / 6000;
      //   calculateAmount = Math.max(0, parseInt(calculateAmount))
      //     .toString()
      //     .slice(0, 8);
      //   this.data.AMOUNT = Math.round(calculateAmount);
      // } else {
      //   this.data.AMOUNT = this.data.AMOUNT;
      // }
    } else {
    }
  }

  changeAmonut(event) {
    if (event != null && event != undefined && event != '') {
      if (event == 3) {
        if (
          this.data.RATE != null &&
          this.data.RATE != undefined &&
          this.data.RATE != '' &&
          this.data.DISTANCE != null &&
          this.data.DISTANCE != undefined &&
          this.data.DISTANCE != ''
        ) {
          var calculateAmount: any = '';
          calculateAmount = this.data.RATE * this.data.DISTANCE;
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
          this.data.AMOUNT = 0;
        }
      } else {
        if (
          this.data.WEIGHT_IN_KG != null &&
          this.data.WEIGHT_IN_KG != undefined &&
          this.data.WEIGHT_IN_KG != '' &&
          this.data.RATE != null &&
          this.data.RATE != undefined &&
          this.data.RATE != '' &&
          this.data.DISTANCE != null &&
          this.data.DISTANCE != undefined &&
          this.data.DISTANCE != ''
        ) {
          var calculateAmount: any =
            (this.data.WEIGHT_IN_KG * this.data.RATE * this.data.DISTANCE) /
            6000;
          calculateAmount = Math.max(0, parseInt(calculateAmount))
            .toString()
            .slice(0, 8);
          this.data.AMOUNT = Math.round(calculateAmount);
        } else {
          this.data.AMOUNT = 0;
        }
      }
    } else {
    }
  }
}
