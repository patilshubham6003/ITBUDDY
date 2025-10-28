import { Component } from '@angular/core';

@Component({
  selector: 'app-grass-allotment',
  templateUrl: './grass-allotment.component.html',
  styleUrls: ['./grass-allotment.component.css']
})
export class GrassAllotmentComponent {
  drawerVisible: boolean = false
  drawerTitle: string = ''
  constructor() {

  }

  ngOnInit() { }
  drawerClose() {
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this)
  }

  add(): void {
    this.drawerTitle = " Add Information ";

    this.drawerVisible = true;
  }
}