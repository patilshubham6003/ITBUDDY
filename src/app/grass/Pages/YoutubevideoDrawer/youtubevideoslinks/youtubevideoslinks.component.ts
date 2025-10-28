import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-youtubevideoslinks',
  templateUrl: './youtubevideoslinks.component.html',
  styleUrls: ['./youtubevideoslinks.component.css']
})
export class YoutubevideoslinksComponent {
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose!: Function;


  close(){
    this.drawerClose();
  }
}
