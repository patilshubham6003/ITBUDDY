import { Component, OnInit, ViewChild } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.css']
})
export class EventGalleryComponent implements OnInit {
  constructor(private api: WebsiteService) { }
  imgurl = appkeys.retriveimgUrl
  gallery: any = [];
  galleryCategory: any
  datas: any = [];
  showcolor: any;
  showcolor1 = 1
  isVisible = false;
  videocount: any = [];
  isSpinning = true;
  ImageGalerytrue = false;
  ngOnInit() {
    this.api.getAllGalleryWeb(0, 0, '', 'desc', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.isSpinning = false;
        this.gallery = data['data'];
        this.videocount = data['count']
      }
    }, err => {
    });
    this.allGalleryCategory();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  AllFilters(){
    this.isSpinning=true;
  }
  galleryCategorys: any = []

  allGalleryCategory() {
    this.api.getAllGallerycategoryWeb(0, 0, '', 'desc', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.galleryCategory = data['data'];
      }
    }, err => {
    });
  }
  data1: any
  allApp(data: any) {
    this.api.getAllGalleryWeb(0, 0, '', 'desc', ' AND STATUS=1 AND CATEGORY_ID= ' + data.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.gallery = data['data'];
      }
    }, err => {
    });
  }

  gallery1: any = []
  allData() {
    this.api.getAllGalleryWeb(0, 0, '', 'desc', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.gallery = data['data'];
        this.showcolor = null
        this.showcolor1 = 1
      }
    }, err => {
    });
  }

  @ViewChild('eventmod') eventmod: any;
  imggg: any
  gallery11: any;
  ii: any;
  jj: any;
  show(event: any, i: any, j: any) {
    this.ImageGalerytrue = true;
    this.imggg = event;
    this.ii = i;
    this.jj = j;
    this.eventmod.nativeElement.click();
  }
  getI(event: any) {
    this.showcolor = event;
    this.showcolor1 = 0
  }
  clickprev() {
    this.ImageGalerytrue = false;
  }
  clicknext() {
    this.ImageGalerytrue = false;
  }
}