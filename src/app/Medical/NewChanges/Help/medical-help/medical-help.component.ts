import { Component } from '@angular/core';

@Component({
  selector: 'app-medical-help',
  templateUrl: './medical-help.component.html',
  styleUrls: ['./medical-help.component.css']
})
export class MedicalHelpComponent {
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
