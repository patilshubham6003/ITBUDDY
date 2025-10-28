import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeQuarterFormsMaster1 } from 'src/app/Modal/employeeQuarterForm';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-addnew-flat-of-quarter',
  templateUrl: './addnew-flat-of-quarter.component.html',
  styleUrls: ['./addnew-flat-of-quarter.component.css'],
  providers: [DatePipe],
})
export class AddnewFlatOfQuarterComponent implements OnInit {
  @Input()
  drawerVisible1: boolean = false;
  @Input() drawerClose1!: Function;
  @Input() data: any = EmployeeQuarterFormsMaster1;
  isSpinning = false;
  isOk: boolean = true;
  ResidenceType: any = [];
  FloorNo: any = [];
  BuildingName: any = [];
  cityList: any = [];
  areaList: any = [];
  BlockList: any = [];
  GenerateBuilding: any = [];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    public datePipe: DatePipe
  ) { }
  ngOnInit() {
    this.api
      .getmappedbuildingget(
        0,
        0,
        '',
        '',
        ' AND USER_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.GenerateBuilding = data['data'];
          }
        },
        (err) => { }
      );
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new EmployeeQuarterFormsMaster1();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose1();
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

  save(addNew: boolean, websitebannerPage: NgForm): void {
    if (
      this.data.BUILDING_ID == undefined ||
      this.data.BUILDING_ID == null ||
      this.data.BUILDING_ID <= 0 ||
      this.data.BUILDING_ID == ''
    ) {
      this.message.error('Please Select Building Name', '');
      this.isOk = false;
    } else if (
      this.data.FLOOR_ID == undefined ||
      this.data.FLOOR_ID == null ||
      this.data.FLOOR_ID.trim() == ''
    ) {
      this.message.error('Please Enter Floor Name', '');
      this.isOk = false;
    } else if (
      this.data.FLAT_ID == undefined ||
      this.data.FLAT_ID == null ||
      this.data.FLAT_ID.trim() == ''
    ) {
      this.message.error('Please Enter Quarter Name', '');
      this.isOk = false;
    }
    if (this.isOk) {
      if (
        this.data.APPLIED_RESIDENCE_TYPE_ID.length == 0 ||
        this.data.APPLIED_RESIDENCE_TYPE_ID == null ||
        this.data.APPLIED_RESIDENCE_TYPE_ID == undefined ||
        this.data.APPLIED_RESIDENCE_TYPE_ID == ''
      ) {
        this.data.APPLIED_RESIDENCE_TYPE_ID = null;
      } else {
        this.data.APPLIED_RESIDENCE_TYPE_ID =
          this.data.APPLIED_RESIDENCE_TYPE_ID;
      }
      this.isSpinning = true;
      this.data.CARETAKER_ID = sessionStorage.getItem('userId');
      this.data.STATUS = 'A';
      if (this.data.ID) {
        this.api.updatequarterallotmentData(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success(
                'Employee Quarter Details Updated Successfully',
                ''
              );
              if (!addNew) {
                this.drawerClose1();
                this.isSpinning = false;
                websitebannerPage.form.reset();
              } else {
                this.data = new EmployeeQuarterFormsMaster1();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error(
                'Failed To Update Employee Quarter Details',
                ''
              );
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong, Please Try Again', '');
            this.isSpinning = false;
          }
        );
      } else {
        this.data.CLIENT_ID = 1;
        this.api.CreatequarterallotmentData(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success(
                'Employee Quarter Details Created Successfully',
                ''
              );
              if (!addNew) {
                this.drawerClose1();
              } else {
                this.data = new EmployeeQuarterFormsMaster1();
              }
              this.isSpinning = false;
            } else {
              this.message.error(
                'Failed To Submit Employee Quarter Details',
                ''
              );
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error('Something Went Wrong, Please Try Again', '');
            this.isSpinning = false;
          }
        );
      }
    }
  }
}
