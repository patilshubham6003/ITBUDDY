import { Component, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { UserMaster } from 'src/app/grass/Models/usermaster';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  user: UserMaster = new UserMaster();
  EMAIL_ID = '';
  PASSWORD = '';
  supportKey = '';
  ORGANIZATION_ID: number | undefined;
  passwordVisible = false;
  isloginSpinning = false;
  isLogedIn = false;
  userId = sessionStorage.getItem('userId');
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');

  constructor(
    private cookie: CookieService,
    private router: Router,
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.router.navigate(['grass/login']);
    } else {
      if (this.userId == null || this.userName == null || this.roleId == null)
        this.api.logoutForSessionValues();
      else {
        if (this.roleId == '60') {
          this.isLogedIn = true;
          this.router.navigateByUrl('/grass/renovation-requests');
        } else {
          this.isLogedIn = true;
          this.router.navigate(['grass/graas_dashboard']);
        }
        // this.isLogedIn = true;
        // this.router.navigate(['grass/graas_dashboard']);
      }
    }
    // const userId = '1';
    // this.api.requestPermission(userId)
  }

  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '')
      this.message.error('Please enter email id and password', '');
    else {
      this.isloginSpinning = true;
      this.api.login(this.EMAIL_ID, this.PASSWORD).subscribe(
        (data) => {
          // this.logindata = data;
          // this.cookie.set("logindata",JSON.stringify(this.logindata))
          this.isloginSpinning = false;
          if (data['code'] == '200') {
            this.message.success('Successfully Logged In', '');
            this.cookie.set(
              'token',
              data['data'][0]['token'],
              365,
              '',
              '',
              false,
              'Strict'
            );
            sessionStorage.setItem(
              'userId',
              data['data'][0]['UserData'][0]['USER_ID']
            );
            sessionStorage.setItem(
              'userName',
              data['data'][0]['UserData'][0]['NAME']
            );
            sessionStorage.setItem(
              'emailId',
              data['data'][0]['UserData'][0]['EMAIL_ID']
            );
            sessionStorage.setItem(
              'roleId',
              data['data'][0]['UserData'][0]['ROLE_DETAILS'][0]['ROLE_ID']
            );
            sessionStorage.setItem(
              'level',
              data['data'][0]['UserData'][0]['ROLE_DETAILS'][0]['LEVEL']
            );
            sessionStorage.setItem(
              'roleName',
              data['data'][0]['UserData'][0]['ROLE_DETAILS'][0]['ROLE_NAME']
            );
            sessionStorage.setItem(
              'userId',
              data['data'][0]['UserData'][0]['USER_ID']
            );
            sessionStorage.setItem(
              'clientmasterid',
              data['data'][0]['UserData'][0]['CLIENT_MASTER_ID']
            );
            window.location.reload();
          } else {
            this.message.error('You have entered wrong credentials', '');
          }
        },
        (err) => {
          this.isloginSpinning = false;
          this.message.error(JSON.stringify(err), '');
        }
      );
    }
  }

  // forgot(): void {
  //   this.router.navigate(['/forgot'])
  // }
}
