import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BlockMaster } from 'src/app/grass/Models/BlockMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-addblockmaster',
  templateUrl: './addblockmaster.component.html',
  styleUrls: ['./addblockmaster.component.css'],
})
export class AddblockmasterComponent {
  isSpinning = false;
  @Input()
  drawerClose!: Function;
  @Input()
  data!: BlockMaster;
  @Input()
  drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  floatpat = /^[+-]?([0-9]*[.])?[0-9]+$/;
  lati_longi_patt = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;
  listofArea: any = [];

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
  }

  changearea(event: any) { }

  close(): void {
    this.drawerClose();
  }

  resetDrawer(Citypage: NgForm) {
    this.data = new BlockMaster();
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

    if (this.data.NAME == '' && this.data.AREA_ID == null) {
      this.isOk = false;
      this.message.error(' Please Enter All Fields Required ', '');
    } else if (
      this.data.AREA_ID == '' ||
      this.data.AREA_ID == undefined ||
      this.data.AREA_ID == null
    ) {
      this.isOk = false;
      this.message.error(' Please Select Area', '');
    } else if (
      this.data.NAME == '' ||
      this.data.NAME == undefined ||
      this.data.NAME == null
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Block Name ', '');
    } else if (
      this.data.SEQUENCE_NO == 0 ||
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO == null
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.UpdateBlockmaster(this.data).subscribe((successCode) => {
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
        this.api.createBlockmaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new BlockMaster();
              this.resetDrawer(Citypage);
              this.api
                .getBlockmaster(1, 1, 'SEQUENCE_NO', 'desc', '')
                .subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.SEQUENCE_NO = 1;
                    } else {
                      this.data.SEQUENCE_NO =
                        data['data'][0]['SEQUENCE_NO'] + 1;
                    }
                  },
                  (err) => { }
                );
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
