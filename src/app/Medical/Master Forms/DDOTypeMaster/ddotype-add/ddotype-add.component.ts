import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DDOTypeData } from 'src/app/Medical/Models/DDOTypeData';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-ddotype-add',
  templateUrl: './ddotype-add.component.html',
  styleUrls: ['./ddotype-add.component.css'],
})
export class DDOTypeAddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) { }
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  ngOnInit(): void { }
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any = DDOTypeData;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new DDOTypeData();
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

    if (this.data.NAME.trim() == '' && this.data.NAME_HN.trim() == '') {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter DDO Type Hindi   Name.', '');
    } else if (this.data.NAME_HN == null || this.data.NAME_HN.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter DDO Type Hindi   Name.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateDDOTypeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
              // this.search()
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createDDOTypeMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new DDOTypeData();
                this.resetDrawer(websitebannerPage);

                this.api.getDDOTypeMaster(0, 0, '', 'desc', '').subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.SEQ_NO = 1;
                    } else {
                      this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                    }
                  },
                  (err) => {

                  }
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
