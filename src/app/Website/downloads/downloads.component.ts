import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css'],
  providers: [DatePipe]
})
export class DownloadsComponent implements OnInit {
  typeC: any = [];
  ncounts: any;
  searchText: string = '';
  showx = false;
  filterQuery: string = "";
  retrieveimgUrl = appkeys.retriveimgUrl;
  date: any;
  date1: any;
  isSpinning = true;

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
        this.api.getdownloads(0, 0, 'CREATED_MODIFIED_DATE', 'desc', " AND STATUS=1 AND FILE_TYPE='C'" + this.filterQuery).subscribe((data) => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            this.typeC = data['data'];
            this.ncounts = data['count'];
            this.filt = true;
          }
        });
      }
    } else {
      this.downloads3();
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  downloads3() {
    this.api
      .getdownloads(
        0,
        0,
        'CREATED_MODIFIED_DATE',
        'desc',
        " AND STATUS=1 AND FILE_TYPE='C'"
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.typeC = data['data'];
          this.ncounts = data['count'];
        }
      });
  }
  AllFilters(){
    this.isSpinning=true;
  }
  getservicedat() {
    this.api.getservices(0, 0, '', 'desc', ' AND STATUS=1 ')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.servises = data['data'];
        }
      })
  }
  datefilt(data: any) {
    this.date = data;
    this.applyFilter();
  }
  datefilt1(data: any) {
    this.date1 = data;
    this.applyFilter();
  }
  searchBlogs1() {
    this.downloads3();
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
      this.showx = true
    }
    this.api.getdownloads(0, 0, 'CREATED_MODIFIED_DATE', 'desc', " AND STATUS=1 AND FILE_TYPE='C'" + filter).subscribe((data) => {
      if (data['code'] == 200) {
        this.typeC = data['data'];
        this.ncounts = data['count'];
      }
    });
  }
  filt: boolean = false
  selectservice(data: any) {
    this.SERVICE_IDS1 = data;
    this.applyFilter();
  }
  applyFilter() {
    this.filterQuery = '';
    if (this.SERVICE_IDS1.length > 0) {
      this.filterQuery += ' AND ('
      var query = ''
      for (var i = 0; i < this.SERVICE_IDS1.length; i++) {
        query += " SERVICE_ID = '" + this.SERVICE_IDS1[i] + "' OR";
      }
      this.filterQuery += query.substring(0, query.length - 2) + ' )'
    }
    if (this.date != null && this.date1 != null) {
      this.date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
      this.date1 = this.datepipe.transform(this.date1, 'yyyy-MM-dd');
      this.filterQuery += ' AND date(CREATED_MODIFIED_DATE) between ' + "'" + this.date + "'" + ' AND ' + "'" + this.date1 + "'"
    }
    if (this.filterQuery != '') {
      this.api.getdownloads(0, 0, 'CREATED_MODIFIED_DATE', 'desc', " AND STATUS=1 AND FILE_TYPE='C'" + this.filterQuery).subscribe((data) => {
        if (data['code'] == 200) {
          this.typeC = data['data'];
          this.ncounts = data['count'];
          this.filt = true;
        }
      });
    }
  }
  clearfilt() {
    this.filterQuery = '';
    this.filt = false;
    this.date = null;
    this.date1 = null;
    this.SERVICE_IDS1 = [];
    this.SERVICE_IDS = null;
    this.api.getdownloads(0, 0, 'CREATED_MODIFIED_DATE', 'desc', " AND STATUS=1 AND FILE_TYPE='C'").subscribe((data) => {
      if (data['code'] == 200) {
        this.typeC = data['data'];
        this.ncounts = data['count'];
      }
    });
  }
}