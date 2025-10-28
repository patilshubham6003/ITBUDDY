import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { roadRail } from '../../Models/RoadRail';

@Component({
  selector: 'app-placesconnectedbyrail',
  templateUrl: './placesconnectedbyrail.component.html',
  styleUrls: ['./placesconnectedbyrail.component.css'],
  providers: [NzNotificationService],
})
export class PlacesconnectedbyrailComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: roadRail;
  @Input() empID: any;
  @Input() ltcID: any;

  modedata: any[] = [];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isSpinning = false;
  isOk: any = true;
  isAdmin: boolean = false;
  isShowCSS: boolean = false;
  roleId: any;
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

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.getClass();
  }
  classdata: any = [];
  getClass() {
    this.api
      .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID= 3')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classdata = data['data'];
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
    this.data = new roadRail();

    AddNewRecord.form.markAsPristine();
    AddNewRecord.form.markAsUntouched();
    this.data.LTC_ID = this.ltcID;
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
    this.data.LTC_ID = this.ltcID;
    if (
      this.data.ROAD_CLAIMED_AMOUNT != null ||
      this.data.ROAD_CLAIMED_AMOUNT != undefined
    ) {
      this.data.ROAD_CLAIMED_AMOUNT = Number(this.data.ROAD_CLAIMED_AMOUNT);
    } else {
    }
    if (
      (this.data.FARE_PAID != null ||
        this.data.FARE_PAID != undefined ||
        this.data.FARE_PAID != '') &&
      this.roleId != 2
    ) {
      this.data.FARE_PAID = Number(this.data.FARE_PAID);
    } else {
    }
    if (
      (this.data.FROM_PLACE == undefined || this.data.FROM_PLACE == '') &&
      (this.data.TO_PLACE == undefined || this.data.TO_PLACE == '') &&
      (this.data.ENTITLED_TRAVEL_CLASS_ID == undefined ||
        this.data.ENTITLED_TRAVEL_CLASS_ID == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.FROM_PLACE == undefined ||
      this.data.FROM_PLACE == null ||
      this.data.FROM_PLACE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter From Place Name', '');
    } else if (
      this.data.TO_PLACE == undefined ||
      this.data.TO_PLACE == null ||
      this.data.TO_PLACE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter To Place Name.', '');
    } else if (
      this.data.ENTITLED_TRAVEL_CLASS_ID == undefined ||
      this.data.ENTITLED_TRAVEL_CLASS_ID == null ||
      this.data.ENTITLED_TRAVEL_CLASS_ID == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Class.', '');
    } else if (
      (this.data.FARE_PAID == undefined || this.data.FARE_PAID == null) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Fare Paid.', '');
    } else if (
      this.data.ROAD_CLAIMED_AMOUNT < this.data.FARE_PAID &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Fare Paid claimed',
        ''
      );
    }

    if (this.isOk) {
      this.ltcID = this.data.LTC_ID;

      if (this.data.ID) {
        this.api
          .ltcRoadConnectedRailUpdate(this.data, this.ltcID)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                AddNewRecord.form.reset();
              }
            } else {
              this.data = new roadRail();
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .ltcRoadConnectedRailCreate(this.data)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');

              if (!addNew) {
                this.close(AddNewRecord);
              } else {
                this.data = new roadRail();
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
