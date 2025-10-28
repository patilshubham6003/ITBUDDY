import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FloorMaster } from '../floor/floorData';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
// import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-floor-drawer',
  templateUrl: './floor-drawer.component.html',
  styleUrls: ['./floor-drawer.component.css'],
})
export class FloorDrawerComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = FloorMaster;

  isSpinning = false;
  isOk = true;
  BuildingName: any = [];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    this.getBuildingName();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new FloorMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getBuildingName() {
    this.api.getBuildingMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.BuildingName = data['data'];
        }
      },
      (err) => { }
    );
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == '' &&
      this.data.NO_OF_FLATS == undefined &&
      this.data.BUILDING_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME.trim() == '' || this.data.NAME == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Floor Name  ', '');
    } else if (
      this.data.BUILDING_ID == null ||
      this.data.BUILDING_ID == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Building Name.', '');
    } else if (
      this.data.NO_OF_FLATS == undefined ||
      this.data.NO_OF_FLATS == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Number Of Quarter', '');
    } else if (
      this.data.SEQUENCE_NO == null ||
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence No.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateFloorMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              } else {
                this.data = new FloorMaster();
                this.resetDrawer(websitebannerPage);
              }
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createFloorMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                this.resetDrawer(websitebannerPage);
              } else {
                this.data = new FloorMaster();
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
    this.api.getFloorMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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
