import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-find-allotement',
  templateUrl: './find-allotement.component.html',
  styleUrls: ['./find-allotement.component.css']
})
export class FindAllotementComponent {



  drawerVisible: boolean = false
  drawerTitle: string = ''


  constructor() {

  }

  ngOnInit() { }

  close() {
    this.drawerVisible = false
  }

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