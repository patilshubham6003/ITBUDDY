import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent implements OnInit {
  // userName = this.cookie.get('userName');
  // emailId = this.cookie.get('emailId');
  userName = sessionStorage.getItem('userName');
  emailId = sessionStorage.getItem('emailId');

  constructor(private cookie: CookieService) { }

  ngOnInit() { }
}
