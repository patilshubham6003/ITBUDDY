import { Component, Input } from '@angular/core';
import { genertaeSenioritylist } from 'src/app/grass/Models/GenerateSeniorityList';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-adminnotification',
  templateUrl: './adminnotification.component.html',
  styleUrls: ['./adminnotification.component.css'],
})
export class AdminnotificationComponent {
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
    if (this.drawerVisible == true) {
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
          (err) => {
            console.log(err);
          }
        );
    }
  }

  pageSize = 5;
  pageIndex = 1;
  getNotifiaction(loadMore: boolean = false) {
    var USER_ID = sessionStorage.getItem('userId');
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
        (err) => {
          console.log(err);
        }
      );
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
    console.log(e);

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
