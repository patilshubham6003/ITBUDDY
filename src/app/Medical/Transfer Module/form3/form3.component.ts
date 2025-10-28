import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { form3 } from '../../Models/form3';

@Component({
  selector: 'app-form3',
  templateUrl: './form3.component.html',
  styleUrls: ['./form3.component.css'],
})
export class Form3Component implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: form3;
  @Input() empID: any;
  @Input() claimID: any;
  modedata: any[] = [];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isSpinning = false;
  isOk = true;
  ngOnInit(): void {
    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {}
    );
  }

  close(AddNewRecord: NgForm) {
    this.drawerClose();
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new form3();

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
    this.isSpinning = false;
    this.data.TRANSFER_ID = this.claimID;
    this.isOk = true;

    this.data.EMP_ID = this.empID;

    if (
      (this.data.TRANSPORT_MODE_ID == '' ||
        this.data.TRANSPORT_MODE_ID == undefined) &&
      (this.data.FROM_STATION == '' || this.data.FROM_STATION == undefined) &&
      (this.data.TO_STATION == '' || this.data.TO_STATION == undefined) &&
      (this.data.WEIGHT_IN_KG == '' || this.data.WEIGHT_IN_KG == undefined) &&
      (this.data.RATE == '' || this.data.RATE == undefined) &&
      (this.data.AMOUNT == '' || this.data.AMOUNT == undefined) &&
      (this.data.REMARKS == '' || this.data.REMARKS == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    }
    // else if (this.data.DATE == null || this.data.DATE == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Select Date.', '');
    // }
    else if (
      this.data.TRANSPORT_MODE_ID == null ||
      this.data.TRANSPORT_MODE_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Mode.', '');
    } else if (this.data.FROM_STATION == null || this.data.FROM_STATION == '') {
      this.isOk = false;
      this.message.error(' Please Enter From Station.', '');
    } else if (this.data.TO_STATION == null || this.data.TO_STATION == '') {
      this.isOk = false;
      this.message.error('Please Enter To Station.', '');
    } else if (this.data.WEIGHT_IN_KG == null || this.data.WEIGHT_IN_KG == '') {
      this.isOk = false;
      this.message.error(' Please Enter Weight.', '');
    } else if (this.data.RATE == null || this.data.RATE == '') {
      this.isOk = false;
      this.message.error(' Please Enter Rate.', '');
    } else if (this.data.AMOUNT == null || this.data.AMOUNT == '') {
      this.isOk = false;
      this.message.error(' Please Enter Amount.', '');
    } else if (this.data.REMARKS == null || this.data.REMARKS == '') {
      this.isOk = false;
      this.message.error(' Please Enter Remark.', '');
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
}
