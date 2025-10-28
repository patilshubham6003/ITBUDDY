import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { stagemasterfile } from 'src/app/Medical/Models/stagemaster';

@Component({
  selector: 'app-addclaimstages',
  templateUrl: './addclaimstages.component.html',
  styleUrls: ['./addclaimstages.component.css']
})
export class AddclaimstagesComponent implements OnInit {

  @Input() closeDrawer: Function
  @Input() drawerClose: Function;
  @Input() data: stagemasterfile;
  isSpinning = false
  loadingForm = false
  forms: stagemasterfile[];
  isOk = true;
  @Input()
  drawerVisible: boolean = false;
  constructor(private message: NzNotificationService, private api: ApiService) { }
  // isSpinning:boolean=false;
  ngOnInit(): void {
  }
  // NAME = '';
  // IS_ACTIVE = true;
  // ID = '';
  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new stagemasterfile();
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

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "")



    }


    else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Stage Name', '');
    }


    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updatestage(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        }
        else {
          this.api.createstage(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new stagemasterfile();
                this.resetDrawer(websitebannerPage);
                // this.data.IMG_URL= '';

                this.api.getstage(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(data => {
                  if (data['count'] == 0) {
                    this.data.SEQUENCE_NUMBER = 1;
                  } else {
                    this.data.SEQUENCE_NUMBER = data['data'][0]['SEQUENCE_NUMBER'] + 1;
                  }
                }, err => {

                })
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
