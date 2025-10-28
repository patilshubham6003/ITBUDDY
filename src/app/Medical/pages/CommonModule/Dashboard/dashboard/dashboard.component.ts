import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})

export class DashboardComponent implements OnInit {
  userName = this.cookie.get('userName');
  emailId = this.cookie.get('emailId');
  userId = sessionStorage.getItem('userName');
  constructor(private cookie: CookieService) { }

  ngOnInit() { }
}
