import { Component, Input } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-cmsview',
  templateUrl: './cmsview.component.html',
  styleUrls: ['./cmsview.component.css'],
})
export class CmsviewComponent {
  @Input() empdataaaa: any;
  @Input() dataPostingList: any;
  @Input() servicedata: any;
  @Input() drawerClose: any;
  @Input() show: any;

  constructor(private api: WebsiteService) {}
  calculateDateDifference(fromDate: string, toDate: string): any {
    if (
      fromDate != null &&
      fromDate != '' &&
      fromDate != undefined &&
      toDate != null &&
      toDate != '' &&
      toDate != undefined
    ) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          0
        );
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      if (years !== 0 && months !== 0 && days !== 0) {
        return years + ' y ' + months + ' M ' + days + 'd';
      } else if (years !== 0 && months !== 0 && days === 0) {
        return years + ' y ' + months + ' M';
      } else if (years !== 0 && months === 0 && days !== 0) {
        return years + ' y ' + days + 'd';
      } else if (years !== 0 && months === 0 && days === 0) {
        return years + ' y';
      } else if (years === 0 && months !== 0 && days !== 0) {
        return months + ' M ' + days + 'd';
      } else if (years === 0 && months !== 0 && days === 0) {
        return months + ' M';
      } else if (years === 0 && months === 0 && days !== 0) {
        return days + 'd';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  isTextOverflowing(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  drawerClose1111() {
    this.drawerVisible1 = false;
  }

  get closeCallbackssssssss() {
    return this.drawerClose1111.bind(this);
  }
  Dwidth = '90%';

  drawerTitle: any;
  addnew: any;
  drawerDatapersonal: any;
  empstatus: any;
  drawerVisible1: boolean = false;
  gotoposting = false;

  isSpinning: boolean = false;
  showemployee() {
    this.drawerTitle = 'Profile Details';
    this.addnew = true;
    this.isSpinning = true;

    this.api
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND ID=' + sessionStorage.getItem('userId') + ''
      )
      .subscribe(
        (data) => {
          if (data.code == '200' && data.data.length > 0) {
            var dataforper = data['data'][0];
            this.drawerDatapersonal = Object.assign({}, dataforper);
            this.api
              .getempstatus(
                0,
                0,
                '',
                'asc',
                ' AND ID=' + sessionStorage.getItem('userId')
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  if (data['data'].length > 0) {
                    this.empstatus = data['data'];
                    this.drawerVisible1 = true;
                    this.isSpinning = false;
                  } else {
                    this.empstatus = [];
                  }
                  this.drawerVisible1 = true;
                } else {
                }
              });
          }
        },
        (err) => {
          // this.toast.error('Something Went Wrong, Please Try Again Later.');
        }
      );
  }
}
