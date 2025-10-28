import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-admin1',
  templateUrl: './admin1.component.html',
  styleUrls: ['./admin1.component.css'],
})
export class Admin1Component implements OnInit {
  constructor(
    // private router: Router,
    private api: ServiceService,
    private message: NzNotificationService,
    private cookie: CookieService
  ) {}

  ngOnInit() {}

  EMAIL_ID: any;
  PASSWORD: any;
  emailId: any;
  login(): void {
    if (this.EMAIL_ID == '' && this.PASSWORD == '')
      this.message.error('Please Enter Email Id and Password', '');
    else {
      // this.isloginSpinning = true;
      this.api.loginemployee(this.EMAIL_ID, this.PASSWORD).subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.cookie.set(
              'token',
              data['data'][0]['token'],
              365,
              '',
              '',
              true,
              'None'
            );
            sessionStorage.setItem('isLogedIn', 'true');
            sessionStorage.setItem(
              'userId',
              data['data'][0]['UserData'][0]['EMP_ID']
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
              data['data'][0]['UserData'][0]['EMP_ID']
            );
            sessionStorage.setItem(
              'clientmasterid',
              data['data'][0]['UserData'][0]['CLIENT_MASTER_ID']
            );

            this.message.info(data['message'], '');
            this.emailId = sessionStorage.getItem('emailId');
            window.location.reload();

            setTimeout(() => {
              // this.isloginSpinning = false;
            }, 1000);
          }
        },
        (err) => {
          this.message.error('Server not found', '');
          console.log(err);

          // this.isloginSpinning = false;
        }
      );
    }
  }
}
