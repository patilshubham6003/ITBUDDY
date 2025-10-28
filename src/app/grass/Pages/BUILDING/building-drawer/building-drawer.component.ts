import { Component, Input, ViewEncapsulation } from '@angular/core';
import { BuildingMaster } from '../building/BuildingMaster';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
@Component({
  selector: 'app-building-drawer',
  templateUrl: './building-drawer.component.html',
  styleUrls: ['./building-drawer.component.css'],
})
export class BuildingDrawerComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data!: BuildingMaster;
  listofArea: any = [];
  isSpinning = false;
  isOk = true;
  floatpat = /^[+-]?([0-9]*[.])?[0-9]+$/;
  userDatss: any = [];
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    this.api.getareamaster(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.listofArea = data['data'];
        }
      },
      (err) => { }
    );

    this.api
      .getAllUsers(0, 0, '', 'desc', ' AND ROLE_IDS=51 AND IS_ACTIVE=1')
      .subscribe((data) => {
        this.userDatss = data['data'];
      });
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new BuildingMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.AREA_ID == null &&
      this.data.NAME.trim() == '' &&
      this.data.NO_FLOORS == undefined &&
      this.data.ADDRESS == undefined &&
      this.data.LONGITUDE == undefined &&
      this.data.LATITUDE == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.AREA_ID == '' ||
      this.data.AREA_ID == null ||
      this.data.AREA_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Area Name  ', '');
    } else if (
      this.data.NAME.trim() == '' ||
      this.data.NAME == null ||
      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Building Name  ', '');
    } else if (
      this.data.USER_ID == '' ||
      this.data.USER_ID == null ||
      this.data.USER_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select Caretaker Name', '');
    } else if (
      this.data.ADDRESS == undefined ||
      this.data.ADDRESS == null ||
      this.data.ADDRESS == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Address ', '');
    } else if (
      this.data.NO_FLOORS == null ||
      this.data.NO_FLOORS == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Number Of Floors.', '');
    } else if (
      this.data.LATITUDE == undefined ||
      this.data.LATITUDE == null ||
      this.data.LATITUDE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Latitude  ', '');
    } else if (!this.floatpat.test(this.data.LATITUDE)) {
      this.isOk = false;
      this.message.error(' Please Enter Latitude Properly', '');
    } else if (
      this.data.LONGITUDE == undefined ||
      this.data.LONGITUDE == null ||
      this.data.LONGITUDE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Longitude  ', '');
    } else if (!this.floatpat.test(this.data.LONGITUDE)) {
      this.isOk = false;
      this.message.error(' Please Enter Longitude Properly', '');
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Short Code', '');
    } else if (
      this.data.SEQUENCE_NO == null ||
      this.data.SEQUENCE_NO == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateBuildingMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              // if (!addNew) this.drawerClose();
              // this.isSpinning = false;

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              } else {
                this.data = new BuildingMaster();
                this.resetDrawer(websitebannerPage);
              }
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createBuildingMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              // if (!addNew) this.drawerClose();
              // else {
              //   this.data = new BuildingMaster();
              //   this.getSequenceNo();
              // }

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                this.resetDrawer(websitebannerPage);
              } else {
                this.data = new BuildingMaster();
                this.getSequenceNo();
                this.resetDrawer(websitebannerPage);
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

  getSequenceNo() {
    this.api.getBuildingMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200 && data['count'] > 0) {
          var seqno = data['data'][0]['SEQUENCE_NO'];
          this.data.SEQUENCE_NO = Number(seqno) + 1;
        } else {
          this.data.SEQUENCE_NO = 1;
        }
      },
      (err) => { }
    );
  }
}
