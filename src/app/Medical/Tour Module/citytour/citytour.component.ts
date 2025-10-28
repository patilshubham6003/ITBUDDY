import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Joureyofparticularcity } from '../../Models/journeydetailsbycity';

@Component({
  selector: 'app-citytour',
  templateUrl: './citytour.component.html',
  styleUrls: ['./citytour.component.css'],
})
export class CitytourComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Joureyofparticularcity;
  @Input() empID: any;
  @Input() tourID: any;
  modedata: any[] = [];
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isAdmin: boolean = false;
  isSpinning = false;
  isOk = true;
  roleId: any;
  isShowCSS: boolean = false;
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
    this.isSpinning = true;
    this.isOk = true;
    this.data.EMP_ID = this.empID;
    this.data.TOUR_ID = this.tourID;
    //

    if (
      (this.data.DATE == '' || this.data.DATE == undefined) &&
      (this.data.FROM_PLACE == '' || this.data.FROM_PLACE == undefined) &&
      (this.data.TO_PLACE == '' || this.data.TO_PLACE == undefined)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.DATE == null || this.data.DATE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Date.', '');
    } else if (
      (this.data.FARE_PAID === undefined ||
        this.data.FARE_PAID === null ||
        this.data.FARE_PAID === '') &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Fare Paid.', '');
    } else if (
      this.data.FARE_PAID_BY_OFFICER === undefined ||
      this.data.FARE_PAID_BY_OFFICER === null ||
      this.data.FARE_PAID_BY_OFFICER === ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Fare Paid By The Officer.', '');
    } else if (this.data.FROM_PLACE == null || this.data.FROM_PLACE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter From Place Name', '');
    } else if (this.data.TO_PLACE == null || this.data.TO_PLACE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter To Place Name.', '');
    } else if (
      this.roleId != 2 &&
      Number(this.data.FARE_PAID_BY_OFFICER) < Number(this.data.FARE_PAID)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Less than Fare Paid By The Officer',
        ''
      );
    }

    if (this.isOk) {
      // this.data.TRANSFER_ID = this.tourID;
      //
      if (this.data.DATE == undefined) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.datePipe.transform(
          this.data.DATE,
          'yyyy-MM-dd HH:mm'
        );
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
                if (!addNew) this.close(AddNewRecord);
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
