import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Role } from 'src/app/commonModule/role';
import { User } from 'src/app/commonModule/user';
import { ServiceService } from 'src/app/Service/service.service';
import * as CryptoJS from 'crypto-js';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: User;
  @Input() show: any;
  @Input() show1: any;
  passwordVisible = false;
  password: string;
  isSpinning = false;
  dataList: User;
  roleLoading = false;
  roles: Role[];
  parentUsers: Role[];
  ROLE_IDS: number[];
  ddoOfTheOfficialDataList: any = [];
  roleId = sessionStorage.getItem('roleId');

  constructor(
    private api: ServiceService,
    private medapi: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.loadParentUsers();
    this.loadAllCategories();
    this.getResidenceType();
    this.ddoOfTheOfficialList();
  }
  ddoOfTheOfficialList() {
    this.isSpinning = true;
    this.medapi.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            this.ddoOfTheOfficialDataList = data['data'];
          } else {
            this.ddoOfTheOfficialDataList = [];
          }
          this.isSpinning = false;
        } else {
          this.ddoOfTheOfficialDataList = [];
          this.isSpinning = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
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
        console.log(err);
      }
    );
  }
  loadParentUsers() {
    this.roleLoading = true;
    this.api.getAllUsers(0, 0, '', '', ' AND IS_ACTIVE = 1').subscribe(
      (users) => {
        if (users['code'] == 200) {
          this.parentUsers = users['data'];
        } else {
          this.parentUsers = [];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  categoryList = [];

  loadAllCategories() {
    this.api.getAllCategories(0, 0, 'ID', 'desc', ' and IS_ACTIVE=1').subscribe(
      (categoryData) => {
        this.categoryList = categoryData['data'];
      },
      (err) => {
        console.log(err);
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
      this.isValidEmail(this.data.EMAIL_ID)
      // && /^[a-zA-Z\s-, ]*$/.test(this.data.NAME) == true
    ) {
      this.isSpinning = true;
      this.data.PASSWORD = CryptoJS.MD5(this.data.PASSWORD).toString(
        CryptoJS.enc.Hex
      );
      this.data.RESIDENCE_TYPE_IDS = this.data.RESIDENCE_TYPE_IDS.toString();
      if (this.data.ID) {
        this.api.updateUser(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('User Updated Successfully', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else if (successCode['code'] == '305') {
            this.message.error('Mobile Number Is Already registered.', '');
            this.isSpinning = false;
          } else if (successCode['code'] == '304') {
            this.message.error('Email ID Is Already registered.', '');
            this.isSpinning = false;
          } else if (successCode['code'] == '306') {
            this.message.error(
              'Email ID And Mobile No Is Already registered.',
              ''
            );
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
              this.loadParentUsers();
            }
            this.isSpinning = false;
          } else if (successCode['code'] == '305') {
            this.message.error('Mobile Number Is Already registered.', '');
            this.isSpinning = false;
          } else if (successCode['code'] == '304') {
            this.message.error('Email ID Is Already registered.', '');
            this.isSpinning = false;
          } else if (successCode['code'] == '306') {
            this.message.error(
              'Email ID And Mobile No Is Already registered.',
              ''
            );
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
      // else if (/^[a-zA-Z\s-, ]*$/.test(this.data.NAME) == false)
      //   this.message.error('Please Enter Valid Name', '');
    }
  }

  searchEmail(emailId): void {
    var likeQuery = 'EMAIL_ID=' + emailId + '';
    this.api.getAllUsers(0, 0, '', '', likeQuery).subscribe(
      (dataa) => {
        this.dataList = dataa['data'];
      },
      (err) => {
        if (err['ok'] == false) this.message.error('Server Not Found', '');
      }
    );
  }
  ResidenceType111: any = [];
  getResidenceType() {
    this.api.getResidenceforuser(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType111 = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
