import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-servicepage',
  templateUrl: './servicepage.component.html',
  styleUrls: ['./servicepage.component.css']
})
export class ServicepageComponent implements OnInit {
  servises: any = [];
  retrieveimgUrl = appkeys.retriveimgUrl;
  isSpinning = true;
  constructor(public apiService: WebsiteService, public router: Router) { }
  ngOnInit(): void {
    this.getServices();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  AllFilters(){
    this.isSpinning=true;
  }
  getServices() {
    this.apiService.getservices(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS=1 ')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.servises = data['data'];
        }
      })
  }

  servclick(data, title) {
    var sanitizedTitle = title.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    localStorage.setItem("serviceid", data);
    this.router.navigate(['/service/' + aa]);
  }
}