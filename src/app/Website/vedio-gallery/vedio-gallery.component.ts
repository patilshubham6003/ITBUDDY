import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-vedio-gallery',
  templateUrl: './vedio-gallery.component.html',
  styleUrls: ['./vedio-gallery.component.css']
})
export class VedioGalleryComponent implements OnInit {
  isSpinning = true;

  constructor(private api: WebsiteService) { }
  ngOnInit() {
    this.allVideo();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  AllFilters(){
    this.isSpinning=true;
  }
  video: any = []

  imgurl = appkeys.retriveimgUrl
  videocount: any = [];
  drscti: any = [];
  allVideo() {
    this.api.getAllVideoWeb(0, 0, '', 'desc', ' AND STATUS=1').subscribe(data => {
      if (data['code'] == 200) {
        this.isSpinning = false;
        this.video = data['data'];
        this.videocount = data['count'];
        for (var i = 0; i < this.video.length; i++) {
          this.drscti[i] = this.video[i].TITLE;
        }
      }
    }, err => {
    });
  }
  currentPlayingVideo: HTMLVideoElement;
  onPlayingVideo(event: any) {
    event.preventDefault();
    if (this.currentPlayingVideo === undefined) {
      this.currentPlayingVideo = event.target;
      this.currentPlayingVideo.play();
    } else {
      if (event.target !== this.currentPlayingVideo) {
        this.currentPlayingVideo.pause();
        this.currentPlayingVideo = event.target;
        this.currentPlayingVideo.play();
      }
    }
  }
}