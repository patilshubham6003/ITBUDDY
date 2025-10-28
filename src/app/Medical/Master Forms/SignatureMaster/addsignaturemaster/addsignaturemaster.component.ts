import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { adminsignature } from 'src/app/Modal/adminsignature';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-addsignaturemaster',
  templateUrl: './addsignaturemaster.component.html',
  styleUrls: ['./addsignaturemaster.component.css'],
})
export class AddsignaturemasterComponent {
  @Input() drawerClose: Function;
  @Input() data: any = new adminsignature();

  isSpinning = false;
  // @Input()
  // drawerClose!: Function;
  // @Input()
  // data!: Signature;
  // @Input()
  // drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  UserList: any;
  details: any = [];

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.getAllUsers();
    this.api.getAllService(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.details = data['data'];
        }
      },
      (err) => {}
    );
  }

  change(event: any) {}

  onchangeradio(event: any) {}

  close(SignaturePage: NgForm) {
    this.drawerClose();
    this.resetDrawer(SignaturePage);
    SignaturePage.form.reset();
  }

  resetDrawer(SignaturePage: NgForm) {
    this.data = new adminsignature();
    SignaturePage.form.markAsPristine();
    SignaturePage.form.markAsUntouched();
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

  getAllUsers() {
    this.api.getAllUsers(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.UserList = data['data'];
        }
      },
      (err) => {}
    );
  }

  save(addNew: boolean, SignaturePage: NgForm): void {
    this.data.DDO_ID = Number(sessionStorage.getItem('ddoId'));
    this.data.DDO_TYPE_ID = Number(sessionStorage.getItem('ddoId'));
    this.isSpinning = false;
    this.isOk = true;

    // if (
    //   // this.data.USER_ID == '' &&
    //   this.data.POST.trim() == '' &&
    //   this.data.POST_HN.trim() == '' &&
    //   this.data.NAME.trim() == '' &&
    //   this.data.NAME_HN.trim() == '' &&
    //   this.data.OFFICE_NAME.trim() == '' &&
    //   this.data.OFFICE_NAME_HN.trim() == ''
    //   // this.data.SECTION_TYPE == '' &&
    //   // this.data.SERVICE_ID <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Fill All Required Fields', '');
    // }
    // // else if (this.data.USER_ID == null || this.data.USER_ID.length <= 0) {
    // //   this.isOk = false;
    // //   this.message.error(' Please Select User from Users ', '');
    // // }
    //  else if (this.data.NAME == null || this.data.NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Name ', '');
    // } else if (this.data.NAME_HN == null || this.data.NAME_HN.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Name in Hindi', '');
    // } else if (this.data.POST == null || this.data.POST.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Post Name ', '');
    // } else if (this.data.POST_HN == null || this.data.POST_HN.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Post Name in Hindi ', '');
    // } else if (
    //   this.data.OFFICE_NAME == null ||
    //   this.data.OFFICE_NAME.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Office Name ', '');
    // } else if (
    //   this.data.OFFICE_NAME_HN == null ||
    //   this.data.OFFICE_NAME_HN.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Office Name in Hindi', '');
    // }
    // // else if (this.data.SECTION_TYPE == null || this.data.SECTION_TYPE == '') {
    // //   this.isOk = false;
    // //   this.message.error(' Please choose Section Type ', '');
    // // }
    // //  else if (this.data.SERVICE_ID == undefined || this.data.SERVICE_ID <= 0) {
    // //   this.isOk = false;
    // //   this.message.error('Please Select Service Name', '');
    // // }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateadminSignature(this.data).subscribe((successCode) => {
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
        this.api.createadminSignature(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            sessionStorage.setItem('signaturedata', successCode.ID);
            this.drawerClose();

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
