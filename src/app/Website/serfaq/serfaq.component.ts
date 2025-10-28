import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-serfaq',
  templateUrl: './serfaq.component.html',
  styleUrls: ['./serfaq.component.css']
})
export class SerfaqComponent implements OnInit {
  faqcount: any;
  faqs: any = [];
  loadserv: any;
  searchText: any = '';
  showx = false;
  columns: string[][] = [["QUESTION"], ["ANSWER"]];

  constructor(
    private api: WebsiteService
  ) { }

  ngOnInit() {
    this.loadserv = localStorage.getItem('serviceid');
    this.getfaq();
  }
  activeIndex = 0;
  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }

  getfaq() {
    this.api.getfaq(0, 0, '', 'desc', ' AND STATUS=1 AND SERVICE_ID=' + this.loadserv).subscribe((data) => {
      if (data['code'] == 200) {
        this.faqs = data['data'];
        this.faqcount = data['count'];
      }
    });
  }
  filter: any = ''
  searchFaq(data: any) {
    if (data == "") {
      this.filter = "";
      this.showx = false;
    }
    else if (this.searchText != '') {
      this.filter += ' AND ('
      this.columns.forEach(column => {
        this.filter += "  " + column[0] + " like '%" + this.searchText + "%' OR";
      });
      this.filter = this.filter.substring(0, this.filter.length - 2) + ' ) '
      this.showx = true;
    }
    else {
      this.filter = "";
      this.showx = false;
    }

    this.api.getfaq(0, 0, '', 'desc', ' AND STATUS=1 AND SERVICE_ID=' + this.loadserv + this.filter).subscribe((data) => {
      if (data['code'] == 200) {
        this.faqs = data['data'];
        this.faqcount = data['count'];
      }
    });
  }
  searchFaq1() {
    this.getfaq();
    this.showx = false;
    this.searchText = '';
  }
}