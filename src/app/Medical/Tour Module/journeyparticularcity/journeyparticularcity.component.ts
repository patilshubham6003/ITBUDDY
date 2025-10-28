import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { NzNotificationService } from 'ng-zorro-antd/notification/public-api';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Joureyofparticularcity } from '../../Models/journeydetailsbycity';

@Component({
  selector: 'app-journeyparticularcity',
  templateUrl: './journeyparticularcity.component.html',
  styleUrls: ['./journeyparticularcity.component.css'],
})
export class JourneyparticularcityComponent implements OnInit {
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Joureyofparticularcity;
  // @Input() empID: any;
  // @Input() claimID: any;
  modedata: any[] = [];
  isAdmin: boolean = false
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) { }
  isSpinning = false;
  isOk = true;
  ngOnInit(): void {
    if (Number(sessionStorage.getItem('roleId')) != undefined && Number(sessionStorage.getItem('roleId')) == 47 || Number(sessionStorage.getItem('roleId')) == 46 || Number(sessionStorage.getItem('roleId')) == 48 || Number(sessionStorage.getItem('roleId')) == 49 || Number(sessionStorage.getItem('roleId')) == 50) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {

      }
    );
  }

  close(AddNewRecord: NgForm) {
    this.drawerClose();
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new Joureyofparticularcity();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
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
    this.isSpinning = false;
    this.isOk = true;
    // this.data.EMP_ID = this.empID;
    // this.data.TRANSFER_ID = this.claimID;
    // 

    if (
      (this.data.DATE == '' || this.data.DATE == undefined) &&
      (this.data.FROM_PLACE == '' || this.data.FROM_PLACE == undefined) &&
      (this.data.TO_PLACE == '' || this.data.TO_PLACE == undefined) &&
      (this.data.FARE_PAID == '' || this.data.FARE_PAID == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.DATE == null || this.data.DATE == '') {
      this.isOk = false;
      this.message.error(' Please Select Date.', '');
    } else if (this.data.FARE_PAID == null || this.data.FARE_PAID == '') {
      this.isOk = false;
      this.message.error(' Please Enter Fare Paid.', '');
    } else if (this.data.FROM_PLACE == null || this.data.FROM_PLACE == '') {
      this.isOk = false;
      this.message.error(' Please Enter From Place Name', '');
    } else if (this.data.TO_PLACE == null || this.data.TO_PLACE == '') {
      this.isOk = false;
      this.message.error('Please Enter To Place Name.', '');
    }

    if (this.isOk) {
      // this.data.TRANSFER_ID = this.claimID;
      // 
      if (this.data.DATE == undefined) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      }
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updatejourneyofparticularcity(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Changed Successfully...', '');
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
                AddNewRecord.form.reset();
                // this.search()
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .createjourneyofparticularcity(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new Joureyofparticularcity();
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
