import { Component } from '@angular/core';

@Component({
  selector: 'app-transfer-help',
  templateUrl: './transfer-help.component.html',
  styleUrls: ['./transfer-help.component.css']
})
export class TransferHelpComponent {
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
