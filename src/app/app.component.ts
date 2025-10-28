// import { Component } from '@angular/core';

import { Component } from '@angular/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from 'src/environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'itbuddy';
  constructor(private cookie: CookieService, private router: Router) { }
  ngOnInit(): void {
    const hashedPassword = CryptoJS.SHA256('39b92f97c75419a9b0850f80a7c6d42b').toString();
    this.requestPermission();
    navigator.serviceWorker.addEventListener('message',
      (event) => {
        this.callAfterMessageReceived(event['data'])
      });



    let url = window.location.href;
    var arr = url.split('/');

    if (arr[3] != undefined) {
      if (arr[3] == 'AGT') {
        sessionStorage.setItem('AGT', 'AGT')
        this.router.navigateByUrl('/');
      } else if (arr[3] == 'ITHR') {
        sessionStorage.setItem('ITHR', 'ITHR')
        this.router.navigateByUrl('/');
      } else if (arr[3] == 'employeecorner') {
        if (arr[4] != undefined) {
          if (arr[4] == 'AGT') {
            sessionStorage.setItem('AGT', 'AGT')
            this.router.navigateByUrl('/');
          } else if (arr[4] == 'ITHR') {
            sessionStorage.setItem('ITHR', 'ITHR')
            this.router.navigateByUrl('/');
          }
        }
      }
    }


  }

  callAfterMessageReceived(payload: any) {
  }
  requestPermission() {
    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
      if (currentToken) {
        this.cookie.set('CLOUD_ID', currentToken, 365, "", "", true, "None");
      }
    }).catch((err) => {
      Notification.requestPermission().then(function (getperm) {
      });
    });
  }
}