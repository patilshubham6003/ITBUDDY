import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  contactMaster: any;
  year: any;
  constructor(private apiservice: WebsiteService) { }
  ngOnInit(): void {
    this.year = (new Date()).getFullYear();
    this.getContact();
  }

  getContact() {
    this.apiservice.getAllcontact(1, 1, 'id', 'desc', ' AND STATUS=1').subscribe(data => {
      this.contactMaster = data['data'][0];
    });
  }
}