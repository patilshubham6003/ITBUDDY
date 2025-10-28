import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-notificationlist',
  templateUrl: './notificationlist.component.html',
  styleUrls: ['./notificationlist.component.css'],
})
export class NotificationlistComponent {
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = genertaeSenioritylist;

  ResidenceType: any = [];
  ObjectionList: any = [];
  PublishedSenioritylist: any = [];
  datenew = new Date();
  Datenew = new Date(this.datenew.getFullYear(), this.datenew.getMonth() + 1);
  dateobj = new Date();
  isSpinning = false;
  loadingRecords = false;
  ListSpinning = false;
  listisgenerated = false;
  isOk = true;

  constructor(private api: APIServicesService) {}
  drawerData: any = [];

  ngOnInit() {
    var USER_ID = sessionStorage.getItem('userId');
    var ROLEID: any = sessionStorage.getItem('roleId');
    if (this.drawerVisible == true) {
      if (ROLEID == 2) {
        this.api
          .getNotifiaction(this.pageIndex, this.pageSize, '', '', '', USER_ID)
          .subscribe(
            (data) => {
              if (data['count'] != 0) {
                this.totalRecords = data['count'];
                this.drawerData = data['data'];
                this.pageIndex++;
              }
            },
            (err) => {}
          );
      } else {
        this.api
          .getNotifiactionuser(
            this.pageIndex,
            this.pageSize,
            '',
            '',
            '',
            USER_ID
          )
          .subscribe(
            (data) => {
              if (data['count'] != 0) {
                this.totalRecords = data['count'];
                this.drawerData = data['data'];
                this.pageIndex++;
              }
            },
            (err) => {}
          );
      }
    }
  }

  close(websitebannerPage: NgForm) {
    this.drawerClose();
  }
  pageSize = 5;
  pageIndex = 1;
  getNotifiaction(loadMore: boolean = false) {
    var USER_ID = sessionStorage.getItem('userId');
    var ROLEID: any = sessionStorage.getItem('roleId');
    if (ROLEID == 2) {
      this.api
        .getNotifiaction(this.pageIndex, this.pageSize, '', '', '', USER_ID)
        .subscribe(
          (localName) => {
            if (localName['code'] == 200) {
              this.totalRecords = localName['count'];

              if (loadMore) {
                this.drawerData.push(...localName['data']);
              } else {
                this.drawerData = localName['data'];
              }
              this.pageIndex++;
            }
          },
          (err) => {}
        );
    } else {
      this.api
        .getNotifiactionuser(this.pageIndex, this.pageSize, '', '', '', USER_ID)
        .subscribe(
          (localName) => {
            if (localName['code'] == 200) {
              this.totalRecords = localName['count'];

              if (loadMore) {
                this.drawerData.push(...localName['data']);
              } else {
                this.drawerData = localName['data'];
              }
              this.pageIndex++;
            }
          },
          (err) => {}
        );
    }
  }

  totalRecords = 0;
  private categoriesQuotation = new BehaviorSubject<Array<string>>([]);
  categoriesQuotation$ = this.categoriesQuotation.asObservable();
  emittedQuotation = false;

  loadMore(): void {
    if (this.getNext()) {
      this.categoriesQuotation.next(this.drawerData);
    }
  }
  getHeigthQuotation() {
    return '80vh';
  }

  onScroll(e: any) {
    var d = document.getElementById('notification');

    if (d != null) {
      if (
        Math.round(d.scrollTop + d.offsetHeight + 1) >= d.scrollHeight &&
        !this.emittedQuotation
      ) {
        this.emittedQuotation = true;
        this.onScrolling();
      } else if (
        Math.round(d.scrollTop + d.offsetHeight + 1) < d.scrollHeight
      ) {
        this.emittedQuotation = false;
      }
    } else {
      alert();
    }
  }

  onScrolling() {
    this.loadMore();
  }

  getNext(): boolean {
    if (this.drawerData.length >= this.totalRecords) {
      return false;
    }
    this.getNotifiaction(true);
    return true;
  }
}
