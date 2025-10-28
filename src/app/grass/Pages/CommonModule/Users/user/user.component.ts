import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RoleMaster } from 'src/app/grass/Models/role-master';
import { UserMaster } from 'src/app/grass/Models/usermaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: UserMaster = new UserMaster();
  @Input() drawerVisible: boolean = false;
  mobpattern = /^[6-9]\d{9}$/;
  passwordVisible = false;
  isOk = true;
  userslist: any = [];
  numbercheck!: boolean;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  isSpinning = false;

  roles: RoleMaster[] = [];
  selectedRole: RoleMaster = new RoleMaster();
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.api.getAllUsers(0, 0, 'ID', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.userslist = data['data'];
        }
      },
      (err) => {
        //
        this.message.error('Something went wrong..', '');
        this.isSpinning = false;
      }
    );

    this.selectedRole = new RoleMaster();
    this.loadRoles();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  checkduplicatenumber(mobilenum: string, checknum: Array<any>) {
    this.numbercheck = false;
    for (let i = 0; i < checknum.length; i++) {
      if (mobilenum == checknum[i]['MOBILE_NUMBER']) {
        this.numbercheck = true;
      }
    }
  }

  checkdalreadyuplicatenumber(
    idtonotcheck: number,
    mobilenum: string,
    checknum: Array<any>
  ) {
    this.numbercheck = false;
    for (let i = 0; i < checknum.length; i++) {
      if (idtonotcheck != checknum[i]['ID']) {
        if (mobilenum == checknum[i]['MOBILE_NUMBER']) {
          this.numbercheck = true;
        }
      } else {
        this.numbercheck = false;
      }
    }
  }

  roleAssign() {
    this.data.ROLE_DATA = [];
    this.data.ROLE_DATA.push(this.data.ROLE_ID);
  }

  loadRoles() {
    this.isSpinning = true;
    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (roles) => {
        this.roles = roles.data;
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  resetDrawer(form1: NgForm) {
    this.data = new UserMaster();
    form1.form.markAsPristine();
    form1.form.markAsUntouched();
  }

  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, form1: NgForm): void {
    if (!this.data.ID) {
      this.checkduplicatenumber(this.data.MOBILE_NUMBER, this.userslist);
    } else {
      this.checkdalreadyuplicatenumber(
        this.data.ID,
        this.data.MOBILE_NUMBER,
        this.userslist
      );
    }

    this.isOk = true;
    if (
      this.data.ROLE_ID == null &&
      this.data.NAME == '' &&
      this.data.EMAIL_ID == '' &&
      this.data.MOBILE_NUMBER == '' &&
      this.data.PASSWORD == ''
    ) {
      this.isOk = false;
      this.message.error('Please fill required fields.', '');
    } else if (this.data.ROLE_ID == null || this.data.ROLE_ID == undefined) {
      this.isOk = false;
      this.message.error('Please select role', '');
    } else if (this.data.NAME == null || this.data.NAME == '') {
      this.isOk = false;
      this.message.error('Please Enter Person Name', '');
    } else if (this.data.EMAIL_ID == null || this.data.EMAIL_ID.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter E-Mail ID', '');
    } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter proper E-Mail ID', '');
    }
    //  if (this.data.MOBILE_NUMBER) {
    else if (
      this.data.MOBILE_NUMBER == undefined ||
      this.data.MOBILE_NUMBER.length < 10
    ) {
      this.isOk = false;
      this.message.error('Please Enter 10 Digit Contact Number', '');
    } else if (!this.mobpattern.test(this.data.MOBILE_NUMBER.toString())) {
      this.isOk = false;
      this.message.error('Please Enter Contact Number Properly', '');
    } else if (this.numbercheck) {
      this.isOk = false;
      this.message.error('Mobile Number Already Exists', '');
    }
    // }
    else if (this.data.PASSWORD == '' || this.data.PASSWORD == null) {
      this.isOk = false;
      this.message.error('Please Enter Password', '');
    } else if (this.data.PASSWORD.length < 8) {
      this.isOk = false;
      this.message.error('Password Length should be more than 8', '');
    } else if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateUser(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('User Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else if (successCode['code'] == '300') {
            this.message.error('Email Id Already taken', '');
            this.isSpinning = false;
          } else {
            this.message.error('User Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createUser(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('User Created Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new UserMaster();
              this.resetDrawer(form1);
            }
            this.isSpinning = false;
          }
          // else if (successCode['code'] == "300") {
          //   this.message.error("Email Id Already taken", "");
          //   this.isSpinning = false;
          // }
          else {
            this.message.error('User Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
