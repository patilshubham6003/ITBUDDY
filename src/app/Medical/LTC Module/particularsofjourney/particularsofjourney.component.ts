import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { journeyP } from '../../Models/journeyParticular';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-particularsofjourney',
  templateUrl: './particularsofjourney.component.html',
  styleUrls: ['./particularsofjourney.component.css'],
  providers: [NzNotificationService],
})
export class ParticularsofjourneyComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: journeyP;
  @Input() empID: any;
  @Input() ltcID: any;
  @Input() class: any = [];

  modedata: any[] = [];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isSpinning = false;
  isOk = true;
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
    this.getJourney();
    this.getMode();
  }

  classLoader: boolean = false;
  getClasses(event: any) {
    this.data.MODE_OF_CONVEYANCE_ID = event;
    this.data.ENTITLED_CLASS_ID = 0;
    this.data.TRAVELLED_CLASS_ID = 0;
    if (
      this.data.MODE_OF_CONVEYANCE_ID != undefined &&
      this.data.MODE_OF_CONVEYANCE_ID != null &&
      this.data.MODE_OF_CONVEYANCE_ID != ''
    )
      this.classLoader = true;
    this.api
      .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID=' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.class = data['data'];
            this.classLoader = false;
          } else {
            this.class = [];
            this.classLoader = false;
          }
        },
        (err) => {}
      );
  }
  mode: any = [];
  getMode() {
    this.api.gettravelmode(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.mode = data['data'];
        }
      },
      (err) => {}
    );
  }
  getJourney() {
    this.api.getJourneyParticular(0, 0, '', '', '').subscribe(
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
    this.data = new journeyP();

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
    if (
      this.data.JOURNEY_PARTICULAR_CLAIMED_AMOUNT != null ||
      this.data.JOURNEY_PARTICULAR_CLAIMED_AMOUNT != undefined
    ) {
      this.data.JOURNEY_PARTICULAR_CLAIMED_AMOUNT = Number(
        this.data.JOURNEY_PARTICULAR_CLAIMED_AMOUNT
      );
    } else {
    }
    if (
      (this.data.FAIR_PAID != null ||
        this.data.FAIR_PAID != undefined ||
        this.data.FAIR_PAID != '') &&
      this.roleId != 2
    ) {
      this.data.FAIR_PAID = Number(this.data.FAIR_PAID);
    } else {
    }
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.PLACE_FROM == undefined || this.data.PLACE_FROM == '') &&
      (this.data.PLACE_TO == undefined || this.data.PLACE_TO == '') &&
      (this.data.MODE_OF_CONVEYANCE_ID == undefined ||
        this.data.MODE_OF_CONVEYANCE_ID == '') &&
      (this.data.ENTITLED_CLASS_ID == undefined ||
        this.data.ENTITLED_CLASS_ID == '') &&
      (this.data.TRAVELLED_CLASS_ID == undefined ||
        this.data.TRAVELLED_CLASS_ID == '') &&
      (this.data.NO_OF_FAIRS == undefined || this.data.NO_OF_FAIRS == '')
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.PLACE_FROM == null || this.data.PLACE_FROM == '') {
      this.isOk = false;
      this.message.error(' Please Enter From Place.', '');
    } else if (this.data.PLACE_TO == null || this.data.PLACE_TO == '') {
      this.isOk = false;
      this.message.error('Please Enter To Place.', '');
    } else if (
      this.data.MODE_OF_CONVEYANCE_ID == null ||
      this.data.MODE_OF_CONVEYANCE_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Mode Of Conveyance', '');
    } else if (
      this.data.ENTITLED_CLASS_ID == null ||
      this.data.ENTITLED_CLASS_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Class Entitled.', '');
    } else if (
      this.data.TRAVELLED_CLASS_ID == null ||
      this.data.TRAVELLED_CLASS_ID == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Class Used To Travel.', '');
    } else if (this.data.NO_OF_FAIRS == null || this.data.NO_OF_FAIRS == 0) {
      this.isOk = false;
      this.message.error(' Please Enter No. Of Fare.', '');
    } else if (
      (this.data.FAIR_PAID == null || this.data.FAIR_PAID == undefined) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Fare Paid.', '');
    } else if (
      this.data.JOURNEY_PARTICULAR_CLAIMED_AMOUNT < this.data.FAIR_PAID &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Fare Paid claimed',
        ''
      );
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.data.LTC_ID = this.data.LTC_ID;
          this.api
            .updateJourneyParticular(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Changed Successfully...', '');

                this.getJourney();
                if (!addNew) {
                  this.drawerClose();

                  this.isSpinning = false;
                  AddNewRecord.form.reset();
                }
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.data.LTC_ID = this.ltcID;
          this.api
            .createJourneyParticular(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');

                this.getJourney();
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new journeyP();
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
