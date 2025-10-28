import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CityMaster } from 'src/app/Medical/Models/CityMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-city-drawer',
  templateUrl: './city-drawer.component.html',
  styleUrls: ['./city-drawer.component.css'],
  providers: [NzNotificationService],
})
export class CityDrawerComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  ngOnInit(): void {}
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any = CityMaster;

  Cities: CityMaster[] = [];

  Names = CityMaster;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new CityMaster();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter City Name.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateCityMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createCityMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new CityMaster();
                this.resetDrawer(websitebannerPage);
                // this.data.IMG_URL= '';

                this.api.getCityMaster(0, 0, '', 'desc', '').subscribe(
                  (data) => {},
                  (err) => {}
                );
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
