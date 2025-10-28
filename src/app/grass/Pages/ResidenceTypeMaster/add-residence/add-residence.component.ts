import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { ResidenceMaster } from 'src/app/grass/Models/ResidenceModal';

@Component({
  selector: 'app-add-residence',
  templateUrl: './add-residence.component.html',
  styleUrls: ['./add-residence.component.css'],
})
export class AddResidenceComponent implements OnInit {
  constructor(
    private message: NzNotificationService,

    private api: APIServicesService
  ) {}
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  ngOnInit(): void {}
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = ResidenceMaster;

  Cities: any = ResidenceMaster;

  Names = ResidenceMaster;

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

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new ResidenceMaster();
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

    if (
      this.data.TYPE == '' &&
      // && this.data.RESIDENCE_TYPE_ID == ' &&
      this.data.PAY_BILL_SECTION <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields ', '');
    } else if (this.data.TYPE == null || this.data.TYPE.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter  Residence Type', '');
    } else if (
      this.data.PAY_BILL_SECTION == null ||
      this.data.PAY_BILL_SECTION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter  Pay Bill Section', '');
    }

    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateResidencr(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createResidence(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new ResidenceMaster();
              this.resetDrawer(websitebannerPage);
              this.api.getResidence(1, 1, '', 'desc', '').subscribe(
                (data) => {
                  if (data['count'] == 0) {
                    this.data.SEQUENCE_NO = 1;
                  } else {
                    this.data.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
                  }
                },
                (err) => {}
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
