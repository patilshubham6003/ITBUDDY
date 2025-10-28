import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webdashboard',
  templateUrl: './webdashboard.component.html',
  styleUrls: ['./webdashboard.component.css']
})
export class WebdashboardComponent implements OnInit {
  usern:any;
  ngOnInit() {
    this.usern=sessionStorage.getItem("userName")
  }
}
