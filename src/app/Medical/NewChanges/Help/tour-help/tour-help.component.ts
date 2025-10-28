import { Component } from '@angular/core';

@Component({
  selector: 'app-tour-help',
  templateUrl: './tour-help.component.html',
  styleUrls: ['./tour-help.component.css']
})
export class TourHelpComponent {
  items: any[] = [1,2,3,4];
  currentIndex = 0
  loggedin = true


  logout() {
    this.loggedin = false
  }


  nextSlide() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else {
      this.logout();
    }
  }
}
