import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dahforquarterappl',
  templateUrl: './dahforquarterappl.component.html',
  styleUrls: ['./dahforquarterappl.component.css']
})
export class DahforquarterapplComponent implements OnInit {
  usern: any;
  ngOnInit() {
    this.usern = sessionStorage.getItem("userName")
  }
}
