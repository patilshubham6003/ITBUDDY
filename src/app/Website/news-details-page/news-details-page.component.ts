import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-news-details-page',
  templateUrl: './news-details-page.component.html',
  styleUrls: ['./news-details-page.component.css'],
  providers: [DatePipe]
})
export class NewsDetailsPageComponent implements OnInit {
  news: any = [];
  ncounts: any;
  searchText: string = '';
  showx = false;
  allnews: any;
  pdf: any;
  urlss: any;
  new_status: any = [];
  filterQuery: string = "";
  retrieveimgUrl = appkeys.retriveimgUrl;
  date: any;
  date1: any;
  servises: any = [];
  SERVICE_IDS: any;
  SERVICE_IDS1: any = [];
  getserIdDoenload: any;
  servDEtailcondition: any;
  constructor(private api: WebsiteService, public datepipe: DatePipe) { }

  ngOnInit() {
    this.getservicedat();
    this.getserIdDoenload = sessionStorage.getItem('servDetailId');
    this.servDEtailcondition = sessionStorage.getItem('Isservisedetail');
    if (this.servDEtailcondition == 'T') {
      this.SERVICE_IDS = [parseInt(this.getserIdDoenload)];
    }
    if (this.servDEtailcondition == 'T') {
      this.filterQuery = '';
      this.filterQuery += ' AND ('
      this.filterQuery += " SERVICE_ID = '" + this.SERVICE_IDS + "')";
      if (this.filterQuery != '') {
        this.isSpinning = true;
        this.api.getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1' + this.filterQuery).subscribe((data) => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            this.news = data['data'];
            this.ncounts = data['count'];
            this.filt = true;
          }
        });
      }
    } else {
      this.getnews();

    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  isSpinning = false;
  AllFilters() {
    this.isSpinning = true;
  }
  getservicedat() {
    this.api.getservices(0, 0, '', 'desc', ' AND STATUS=1 ')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.servises = data['data'];
        }
      })
  }
  getnews() {
    this.isSpinning = true;
    this.api.getnews(0, 0, 'DATE', 'desc', ' AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200) {
        this.isSpinning = false;
        this.news = data['data'];
        this.ncounts = data['count'];
      }
    });
  }
  datefilt(data: any) {
    this.date = data;
    this.applyFilter();
  }
  datefilt1(data: any) {
    this.date1 = data;
    this.applyFilter();
  }
  news1(event) {
    this.getnews();
  }
  news2(event) {
    this.urlss = event;
    this.setnewstatus();
  }
  news3(event) {
    this.pdf = event;
    this.setnewstatus();
  }
  setnewstatus() {
    this.new_status = []
    if (this.urlss)
      this.new_status.push('L')
    if (this.pdf)
      this.new_status.push('P')
    this.applyFilter();

  }

  selectservice(data: any) {
    this.SERVICE_IDS1 = data;
    this.applyFilter();
  }
  searchBlogs1() {
    this.getnews();
    this.showx = false;
    this.searchText = '';
  }
  searchBlogs(event: any) {
    var filter = '';
    if (event == '') {
      filter = '';
      this.showx = false;
    } else {
      filter = " AND NAME like '%" + event + "%'";
      this.showx = true
    }
    this.api.getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1' + filter).subscribe((data) => {
      if (data['code'] == 200) {
        this.news = data['data'];
        this.ncounts = data['count'];
      }
    });
  }
  filt: boolean = false
  applyFilter() {
    this.filterQuery = '';

    if (this.SERVICE_IDS1 != null && this.SERVICE_IDS1.length > 0) {
      this.filterQuery += ' AND ('
      var query = ''
      for (var i = 0; i < this.SERVICE_IDS1.length; i++) {
        query += " SERVICE_ID = '" + this.SERVICE_IDS1[i] + "' OR";
      }
      this.filterQuery += query.substring(0, query.length - 2) + ' )'
    }
    if (this.new_status.length > 0) {
      this.filterQuery += ' AND ('
      var query = ''
      for (var i = 0; i < this.new_status.length; i++) {
        query += ' NEWS_CONTENT_TYPE = "' + this.new_status[i] + '" OR';
      }
      this.filterQuery += query.substring(0, query.length - 2) + ' )'
    }
    if (this.date != null && this.date1 != null) {
      this.date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
      this.date1 = this.datepipe.transform(this.date1, 'yyyy-MM-dd');
      this.filterQuery += ' AND date(DATE) between ' + "'" + this.date + "'" + ' AND ' + "'" + this.date1 + "'"
    }


    if (this.filterQuery != '') {

      this.api.getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1' + this.filterQuery).subscribe((data) => {
        if (data['code'] == 200) {
          this.news = data['data'];
          this.ncounts = data['count'];
          this.filt = true;
        }
      });
    }
  }
  clearfilt() {
    this.filterQuery = '';
    this.urlss = '';
    this.pdf = '';
    this.filt = false;
    this.new_status = [];
    this.date = null;
    this.date1 = null;
    this.SERVICE_IDS1 = [];
    this.SERVICE_IDS = null;
    this.api.getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200) {
        this.news = data['data'];
        this.ncounts = data['count'];
      }
    });
  }
}