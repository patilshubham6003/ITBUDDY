import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentCheckList } from 'src/app/grass/Models/AllotmentCheckList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-addallotmentcheck',
  templateUrl: './addallotmentcheck.component.html',
  styleUrls: ['./addallotmentcheck.component.css'],
})
export class AddallotmentcheckComponent {
  isSpinning = false;
  @Input()
  drawerClose!: Function;
  @Input()
  data!: AllotmentCheckList;
  @Input()
  drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  floatpat = /^[+-]?([0-9]*[.])?[0-9]+$/;
  listofallotments: any = [];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    // this.api.getCityMaster(0, 0, 'ID', 'desc', " AND STATUS = 1").subscribe(data => {
    //   if (data['code'] == 200) {
    //     this.listofCities = data['data'];
    //   }
    // }, err => {
    //
    // });
  }

  change(event: any) { }
  // change2(event:any){

  // }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(usersPage: NgForm) {
    this.data = new AllotmentCheckList();
    usersPage.form.markAsPristine();
    usersPage.form.markAsUntouched();
  }

  ///Allow only characters
  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  floatomit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      (charCode < 46 || charCode > 46)
    ) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, usersPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    // if (
    //   this.data.CITY_ID == null &&
    //   this.data.NAME == '' &&
    //   this.data.ADDRESS == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Fill All Required Fields', '');
    // }
    // else if (this.data.CITY_ID == null || this.data.CITY_ID == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Select City ', '');
    // }
    // else if (this.data.NAME == null || this.data.NAME == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Area Name ', '');
    // }
    // else if (this.data.ADDRESS == null || this.data.ADDRESS == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Address ', '');
    // }
    // else if ( !this.floatpat.test(this.data.LATITUDE.toString())) {
    //   this.isOk = false;
    //   this.message.error(" Please Enter Latitude Properly", '');
    // }
    // else if (!this.floatpat.test(this.data.LONGITUDE.toString())) {
    //   this.isOk = false;
    //   this.message.error(" Please Enter Longitude Properly", '');
    // }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api
          .UpdateAllotmentCheckListmaster(this.data)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Updated Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
            }
          });
      } else {
        this.api
          .createAllotmentCheckListmaster(this.data)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new AllotmentCheckList();
                this.resetDrawer(usersPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }
}
