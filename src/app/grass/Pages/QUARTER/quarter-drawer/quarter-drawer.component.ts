import { Component, Input, ViewEncapsulation } from '@angular/core';
import { QuarterMaster } from '../QuarterData';
import { NgForm } from '@angular/forms';
// import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-quarter-drawer',
  templateUrl: './quarter-drawer.component.html',
  styleUrls: ['./quarter-drawer.component.css'],
})
export class QuarterDrawerComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = QuarterMaster;

  isSpinning = false;
  isOk = true;
  ResidenceType: any = [];
  FloorNo: any = [];
  BuildingName: any = [];
  cityList: any = [];
  areaList: any = [];
  BlockList: any = [];
  BuildingList: any = [];
  userid: any;
  roleid: any;

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }
  ngOnInit() {
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.getResidenceType();

    if (this.data.ID) {
      if (this.data.CITY_ID != null || this.data.CITY_ID != undefined) {
        this.api
          .getCityMaster(
            0,
            0,
            '',
            '',
            ' AND STATUS = 1 AND ID=9'
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.cityList = data['data'];
                // this.data.CITY_ID = this.cityList[0]['ID'];
                if (this.data.CITY_ID != null || this.data.CITY_ID != undefined) {
                  this.api
                    .getareamaster(
                      0,
                      0,
                      '',
                      '',
                      ' AND STATUS = 1 AND CITY_ID = ' + this.data.CITY_ID
                    )
                    .subscribe(
                      (data) => {
                        if (data['code'] == 200) {
                          this.areaList = data['data'];
                          // this.data.AREA_ID = this.areaList[0]['ID'];
                          if (this.data.AREA_ID != null || this.data.AREA_ID != undefined) {
                            this.api
                              .getBuildingMaster(
                                0,
                                0,
                                '',
                                '',
                                ' AND STATUS = 1 AND AREA_ID = ' + this.data.AREA_ID
                              )
                              .subscribe(
                                (data) => {
                                  if (data['code'] == 200) {
                                    this.BuildingList = data['data'];
                                    // this.data.BUILDING_ID = this.data.BUILDING_ID;

                                    if (this.data.BUILDING_ID != null || this.data.BUILDING_ID != undefined) {
                                      this.api
                                        .getFloorMaster(
                                          0,
                                          0,
                                          '',
                                          '',
                                          ' AND STATUS = 1 AND BUILDING_ID = ' + this.data.BUILDING_ID
                                        )
                                        .subscribe(
                                          (data) => {
                                            if (data['code'] == 200) {
                                              this.FloorNo = data['data'];
                                            }
                                          },
                                          (err) => { }
                                        );
                                    }
                                  }
                                },
                                (err) => { }
                              );
                          }
                        }
                      },
                      (err) => { }
                    );
                }
              }
            },
            (err) => { }
          );
      }
    } else {
      this.getallcities();
    }
  }

  getallcities() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS = 1  AND ID=9').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.cityList = data['data'];
        }
      },
      (err) => { }
    );
  }

  changecity(event: any) {
    this.BlockList = [];
    this.BuildingList = [];
    this.FloorNo = [];
    this.areaList = [];
    this.data.AREA_ID = null;
    this.data.BLOCK_ID = null;
    this.data.BUILDING_ID = null;
    this.data.FLOOR = null;
    this.data.FLOOR_ID = null;
    this.api
      .getareamaster(0, 0, '', '', ' AND STATUS = 1 AND CITY_ID = ' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.areaList = data['data'];
          }
        },
        (err) => { }
      );
  }
  changearea(event: any) {
    // this.BuildingList = []
    // this.data.BLOCK_ID = null;
    // this.data.BUILDING_ID = null;
    // this.data.FLOOR = null;
    // this.data.FLOOR_ID = null;
    // this.api.getBlockmaster(0, 0, '', '', ' AND STATUS = 1 AND AREA_ID = '+event).subscribe(
    //   (data) => {
    //     if (data['code'] == 200) {
    //       this.BlockList = data['data'];
    //     }
    //   },
    //   (err) => {
    //
    //   }
    // );

    this.BuildingList = [];
    this.data.BUILDING_ID = null;
    this.data.FLOOR = null;
    this.data.FLOOR_ID = null;
    this.api
      .getBuildingMaster(0, 0, '', '', ' AND STATUS = 1 AND AREA_ID = ' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.BuildingList = data['data'];
          }
        },
        (err) => { }
      );
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new QuarterMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  ChangeBuilding(event: any) {
    this.data.FLOOR_ID = null;
    this.api
      .getFloorMaster(
        0,
        0,
        '',
        '',
        ' AND STATUS = 1 AND BUILDING_ID = ' + event
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.FloorNo = data['data'];
          }
        },
        (err) => { }
      );
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

  getResidenceType() {
    this.api.getResidence(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
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
      this.data.ROOM_TYPE == undefined &&
      this.data.RESIDENCE_TYPE_ID == undefined &&
      this.data.AVAILABLE_STATUS == undefined &&
      // this.data.TEMP_STATUS ==undefined &&
      // this.data.FLOOR_ID == undefined &&
      this.data.CATEGORY == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.CITY_ID == null || this.data.CITY_ID == undefined) {
      this.isOk = false;
      this.message.error(' Please Select City', '');
    } else if (this.data.AREA_ID == null || this.data.AREA_ID == undefined) {
      this.isOk = false;
      this.message.error(' Please Select Area', '');
    }

    // else if (
    //   this.data.BUILDING_ID == null ||
    //   this.data.BUILDING_ID == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Building', '');
    // }
    // else if (
    //   this.data.FLOOR_ID == null ||
    //   this.data.FLOOR_ID == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Floor', '');
    // }
    else if (
      this.data.RESIDENCE_TYPE_ID == null ||
      this.data.RESIDENCE_TYPE_ID == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Residence type.', '');
    } else if (this.data.NAME.trim() == '' || this.data.NAME == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Quarter Name  ', '');
    } else if (
      this.data.ROOM_TYPE == undefined ||
      this.data.ROOM_TYPE == null
    ) {
      this.isOk = false;
      this.message.error('Please Select Room Type  ', '');
    } else if (
      this.data.AVAILABLE_STATUS == null ||
      this.data.AVAILABLE_STATUS == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Select Available Status', '');
    } else if (this.data.CATEGORY == null || this.data.CATEGORY == undefined) {
      this.isOk = false;
      this.message.error(' Please Select Category', '');
    }
    // else if (
    //   this.data.TEMP_STATUS == null ||
    //   this.data.TEMP_STATUS == undefined
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Temporary Available Status', '');
    // }
    else if (
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
          this.api.updateQuarterMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              } else {
                this.data = new QuarterMaster();
                this.resetDrawer(websitebannerPage);
              }
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createQuarterMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                this.resetDrawer(websitebannerPage);
              } else {
                this.data = new QuarterMaster();
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
    this.api.getQuarterMaster(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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
