import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CityMastertransfer } from 'src/app/Medical/Models/citymastertransfer';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css'],
})
export class AddCityComponent implements OnInit {
  @Input()
  data: CityMastertransfer = new CityMastertransfer();
  @Input()
  drawerClose!: Function;
  @Input()
  drawerVisible: boolean = false;
  screenwidth: any;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.screenwidth = window.innerWidth;
  }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new CityMastertransfer();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter City Name.', '');
    } else if (
      this.data.SEQUENCE_NUMBER == undefined ||
      this.data.SEQUENCE_NUMBER <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number.', '');
    }

    // create update

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
                this.data = new CityMastertransfer();
                this.resetDrawer(websitebannerPage);
                // this.data.IMG_URL= '';

                this.api
                  .getCityMaster(1, 1, 'SEQUENCE_NUMBER', 'desc', '')
                  .subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NUMBER = 1;
                      } else {
                        this.data.SEQUENCE_NUMBER =
                          data['data'][0]['SEQUENCE_NUMBER'] + 1;
                      }
                    },
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
