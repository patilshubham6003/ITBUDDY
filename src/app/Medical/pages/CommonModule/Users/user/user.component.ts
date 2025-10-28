import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/Medical/Models/Commonmodule/user';
import { Role } from 'src/app/Medical/Models/Commonmodule/role';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: User;
  passwordVisible = false;
  password: string;
  isSpinning = false;
  dataList: User;
  roleLoading = false;
  roles: Role[];
  ROLE_IDS: number[];

  roleId = sessionStorage.getItem('roleId');

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.loadRoles();
    this.loadAllCategories();
  }

  loadRoles() {
    this.roleLoading = true;
    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (roles) => {
        this.roles = roles['data'];
        this.roleLoading = false;
      },
      (err) => {

        this.roleLoading = false;
      }
    );
  }

  categoryList: any = [];

  loadAllCategories() {
    this.api.getAllCategories(0, 0, 'ID', 'desc', ' and IS_ACTIVE=1').subscribe(
      (categoryData) => {
        this.categoryList = categoryData['data'];
      },
      (err) => {

      }
    );
  }

  close(): void {
    this.drawerClose();
  }

  isValidMobile(mobile) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }

  isValidEmail(email) {
    const expression =
      /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    return expression.test(String(email).toLowerCase());
  }

  save(addNew: boolean): void {


    if (
      this.isValidMobile(this.data.MOBILE_NUMBER) &&
      this.isValidEmail(this.data.EMAIL_ID) &&
      /^[a-zA-Z\s-, ]*$/.test(this.data.NAME) == true
    ) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateUser(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('User Updated Successfully', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else if (successCode['code'] == '300') {
            this.message.error('Email ID or Mobile No Already Exist', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed to Update User', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createUser(this.data).subscribe((successCode) => {

          if (successCode['code'] == '200') {
            this.message.success('User Added Successfully', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new User();
            }
            this.isSpinning = false;
          } else if (successCode['code'] == '300') {
            this.message.error('Email ID or Mobile No Already Exist', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed to Add User', '');
            this.isSpinning = false;
          }
        });
      }
    } else {
      if (!this.isValidMobile(this.data.MOBILE_NUMBER))
        this.message.error('Please Enter Valid Mobile Number', '');
      else if (!this.isValidEmail(this.data.EMAIL_ID))
        this.message.error('Please Enter Valid Email Id', '');
      else if (/^[a-zA-Z\s-, ]*$/.test(this.data.NAME) == false)
        this.message.error('Please Enter Valid Name', '');
    }
  }

  searchEmail(emailId): void {
    var likeQuery = 'EMAIL_ID=' + emailId + '';
    this.api.getAllUsers(0, 0, '', '', likeQuery).subscribe(
      (data) => {

        this.dataList = data['data'];
      },
      (err) => {

        if (err['ok'] == false) this.message.error('Server Not Found', '');
      }
    );
  }
}
