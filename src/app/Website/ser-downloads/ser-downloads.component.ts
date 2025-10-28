import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-ser-downloads',
  templateUrl: './ser-downloads.component.html',
  styleUrls: ['./ser-downloads.component.css']
})
export class SerDownloadsComponent implements OnInit {
  retrieveimgUrl = appkeys.retriveimgUrl;
  loadserv: any;

  constructor(private api: WebsiteService, private router: Router) { }
  ngOnInit() {
    this.loadserv = localStorage.getItem('serviceid');
    this.downloads();
    this.downloads2();
    this.downloads3();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  downloads1: any
  typeTV: any = [];
  typeC: any = [];
  typeM: any = [];
  tvcount: any = [];
  tvcount1: any = [];

  tvcount2: any = [];
  servtitle: any;
  downloads() {
    this.api
      .getdownloads(
        0,
        0,
        'IS_LATEST',
        'desc',
        " AND STATUS=1 AND FILE_TYPE='TV' AND SERVICE_ID=" + this.loadserv
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.typeTV = data['data'];
          this.tvcount = data['count'];
          this.servtitle = data['data'][0]['SERVICE_TITLE'];
        }
      });
  }
  downloads2() {
    this.api
      .getdownloads(
        0,
        0,
        'IS_LATEST',
        'desc',
        " AND STATUS=1 AND FILE_TYPE='C' AND SERVICE_ID=" + this.loadserv
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.typeC = data['data'];
          this.tvcount1 = data['count'];
          this.servtitle = data['data'][0]['SERVICE_TITLE'];

        }
      });
  }
  downloads3() {
    this.api
      .getdownloads(
        0,
        0,
        'IS_LATEST',
        'desc',
        " AND STATUS=1 AND FILE_TYPE='M' AND SERVICE_ID=" + this.loadserv
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.typeM = data['data'];
          this.tvcount2 = data['count'];
          this.servtitle = data['data'][0]['SERVICE_TITLE'];

        }
      });
  }


  searchText: string = '';
  showx = false;
  searchBlogs1() {
    this.downloads2();
    this.showx = false;
    this.searchText = '';
  }
  searchBlogs(event: any) {
    var filter = '';
    if (event == '') {
      filter = '';
      this.showx = false;
    } else {
      filter = " AND TITLE like '%" + event + "%'";
      this.showx = true;
    }
    this.api.getdownloads(0, 0, 'IS_LATEST', 'desc', " AND STATUS=1 AND FILE_TYPE='C'" + filter + ' AND SERVICE_ID=' + this.loadserv).subscribe((data) => {
      this.typeC = data['data'];
      this.tvcount1 = data['count'];
    });
  }

  searchText1: string = '';
  showx1 = false;
  searchBlogs11() {
    this.downloads3();
    this.showx1 = false;
    this.searchText1 = '';
  }
  searchBlogs12(event: any) {
    var filter1 = '';
    if (event == '') {
      filter1 = '';
      this.showx1 = false;
    } else {
      filter1 = " AND TITLE like '%" + event + "%'";
      this.showx1 = true;
    }
    this.api.getdownloads(0, 0, 'IS_LATEST', 'desc', " AND STATUS=1 AND FILE_TYPE='M'" + filter1 + ' AND SERVICE_ID=' + this.loadserv).subscribe((data) => {
      this.typeM = data['data'];
      this.tvcount2 = data['count'];
    });
  }

  searchText111: string = '';
  showx11 = false;
  searchBlogs1111() {
    this.downloads();
    this.showx11 = false;
    this.searchText111 = '';
  }
  searchBlogs111(event: any) {
    var filter = '';
    if (event == '') {
      filter = '';
      this.showx11 = false;
    } else {
      filter = " AND TITLE like '%" + event + "%'";
      this.showx11 = true;
    }
    this.api.getdownloads(0, 0, 'IS_LATEST', 'desc', " AND STATUS=1 AND FILE_TYPE='TV'" + filter + ' AND SERVICE_ID=' + this.loadserv).subscribe((data) => {
      this.typeTV = data['data'];
      this.tvcount = data['count'];
    });
  }

  storeserviceiM(dd: any) {
    sessionStorage.setItem('servDetailId', this.loadserv);
    sessionStorage.setItem('Isservisedetail', 'T');
    var sanitizedTitle = dd.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    this.router.navigate([aa + '/manuals']);
  }
  storeserviceiC(dd: any) {
    sessionStorage.setItem('servDetailId', this.loadserv);
    sessionStorage.setItem('Isservisedetail', 'T');
    var sanitizedTitle = dd.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    this.router.navigate([aa + '/circulars']);
  }
  storeserviceiTV(data: any) {
    sessionStorage.setItem('servDetailId', this.loadserv);
    sessionStorage.setItem('Isservisedetail', 'T');
    var sanitizedTitle = data.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    this.router.navigate([aa + '/traning-videos']);
  }
}