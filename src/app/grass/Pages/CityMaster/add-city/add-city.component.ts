import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CityMaster } from 'src/app/grass/Models/CityMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css'],
})
export class AddCityComponent {
  isSpinning = false;
  @Input()
  drawerClose!: Function;
  @Input()
  data!: CityMaster;
  @Input()
  drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  floatpat = /^[+-]?([0-9]*[.])?[0-9]+$/;
  lati_longi_patt = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {}

  close(): void {
    this.drawerClose();
  }

  resetDrawer(Citypage: NgForm) {
    this.data = new CityMaster();
    Citypage.form.markAsPristine();
    Citypage.form.markAsUntouched();
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

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, Citypage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.NAME == '') {
      this.isOk = false;
      this.message.error(' Please Enter City Name ', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateCityMaster(this.data).subscribe((successCode) => {
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
        this.api.createCityMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new CityMaster();
              this.resetDrawer(Citypage);
              // this.api.getCityMaster(1,1,'SEQUENCE_NO','desc','').subscribe(
              //   (data) => {
              //     if (data['count'] == 0) {
              //       this.data.SEQUENCE_NO = 1;
              //     } else {
              //       this.data.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
              //     }
              //   },
              //   (err) => {
              //
              //   }
              // );
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
