import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DDOTypeDetailsData } from 'src/app/Medical/Models/ddotypedetails';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-ddotype-details-add',
  templateUrl: './ddotype-details-add.component.html',
  styleUrls: ['./ddotype-details-add.component.css'],
})
export class DDOTypeDetailsAddComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) { }
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  DDOTypeData: any = [];
  ngOnInit(): void {
    this.ListOfDDOType();
  }
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: any = Function;
  @Input() data: any = DDOTypeDetailsData;

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new DDOTypeDetailsData();
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
  ListOfDDOType() {
    this.api.getDDOTypeMaster(0, 0, '', '', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.DDOTypeData = data['data'];
        } else {
          this.message.error("Can't Load Designation Data", '');
        }
      },
      (err) => {

      }
    );
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == '' &&
      this.data.NAME_HN.trim() == '' &&
      this.data.DDO_TYPE_MASTER_ID == null
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter DDO Type Details   Name.', '');
    } else if (this.data.NAME_HN == null || this.data.NAME_HN.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter DDO Type Details Name in Hindi.', '');
    } else if (
      this.data.DDO_TYPE_MASTER_ID == null ||
      this.data.DDO_TYPE_MASTER_ID == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Selct DDO Type Name.', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updateDDOTypeDetailsMaster(this.data)
            .subscribe((successCode) => {
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
          this.api
            .createDDOTypeDetailsMaster(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new DDOTypeDetailsData();
                  this.resetDrawer(websitebannerPage);

                  this.api
                    .getddoTypeDetailsMaster(0, 0, '', 'desc', '')
                    .subscribe(
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
