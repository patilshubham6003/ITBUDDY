import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  constructor(
    private api: WebsiteService,
    private message: ToastrService
  ) { }

  ngOnInit() {
    this.getfaq();
    this.getfaqheads();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  faqhead: any;
  faqs: any;
  getfaqheads() {
    this.api.getfaqheads(0, 0, '', 'desc', ' AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        this.faqhead = data['data'];
      }
    });
  }
  isSpinning = false;
  AllFilters() {
    this.isSpinning = true;
  }
  showcolor: any;
  showcolor1 = 1;
  setevent: any;
  getheadfaqqs(event: any, i: any) {
    this.showcolor = i;
    this.showcolor1 = 0;
    this.setevent = event

    this.api.getfaq(0, 0, '', 'desc', ' AND STATUS=1 AND FAQ_HEAD_ID=' + event).subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        this.faqs = data['data'];
      }
    });
  }

  getfaq() {
    this.isSpinning = true;

    this.api.getfaq(0, 0, '', 'desc', ' AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        this.isSpinning = false;

        this.faqs = data['data'];
        this.showcolor = null;
        this.showcolor1 = 1;
        this.setevent = ''
      }
    });
  }
  isusefull: any = null;
  @ViewChild('nbjhb') nbjhb: any;
  @ViewChild('cldgdf') cldgdf: any;
  faqdata: any;
  showfaqdata(data: any) {
    this.faqdata = Object.assign({}, data);
    setTimeout(() => {
      this.nbjhb.nativeElement.click();
    }, 500);
  }
  ok: any;
  SUGGESTION: any;
  USER_EMAIL_ID: any;
  USER_MOBILE: any;
  data2: any;
  data: any;
  data1: any;
  sendresponse() {
    this.ok = true;
    if (this.isusefull == 'Yes') {
      this.data = {
        ID: this.faqdata.ID,
        TYPE: 'P',
      };
    } else if (this.isusefull == 'No') {
      this.data1 = {
        ID: this.faqdata.ID,
        SUGGESTION: this.faqdata.SUGGESTION,
        USER_EMAIL_ID: this.faqdata.USER_EMAIL_ID,
        USER_MOBILE: this.faqdata.USER_MOBILE,
      };
    }
    if (this.isusefull == 'No' && this.faqdata.SUGGESTION == null) {
      this.message.error('Please Enter Comment', '');
    } else if (
      this.isusefull == 'No' &&
      (this.faqdata.USER_MOBILE == null ||
        this.faqdata.USER_MOBILE == undefined)
    ) {
      this.message.error('Please Enter Mobile No.', '');
    } else if (
      this.isusefull == 'No' &&
      (this.faqdata.USER_EMAIL_ID == null ||
        this.faqdata.USER_EMAIL_ID == undefined)
    ) {
      this.message.error('Please Enter Email Id', '');
    } else {
      if (this.isusefull == 'Yes') {
        this.data2 = this.data;
      } else if (this.isusefull == 'No') {
        this.data2 = this.data1;
      }
      this.api.sendresponse(this.data2).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Response Send Successfully', '');
          this.cldgdf.nativeElement.click();
        } else {
          this.message.error('Failed to Send Response', '');
        }
      });
    }
  }
  activeIndex = 0;
  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? -1 : index;
  }
  showx: any = false
  searchText: any
  searchfaq(event: any) {
    var filter = '';
    if (event == '' && this.setevent == '') {
      filter = " AND STATUS=1"
      this.showx = false;
    } else if (event == '' && this.setevent != '') {
      filter = " AND FAQ_HEAD_ID=" + this.setevent + " AND STATUS=1"
      this.showx = false;
    } else if (event != '' && this.setevent == '') {
      filter = " AND STATUS=1 AND (QUESTION like '%" + event + "%' OR ANSWER like '%" + event + "%')";
      this.showx = true;
    }
    else {
      filter = " AND FAQ_HEAD_ID=" + this.setevent + " AND STATUS=1  AND (QUESTION like '%" + event + "%' OR ANSWER like '%" + event + "%')";
      this.showx = true
    }
    this.api.getfaq(0, 0, '', 'desc', filter).subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        this.faqs = data['data'];
      } else {
        this.faqs = null
      }
    });
  }
  searchfaq1() {
    this.searchText = '';
    var filter = '';
    if (this.setevent == '') {
      filter = " AND STATUS=1"
      this.showx = false;
    } else if (this.setevent != '') {
      filter = " AND FAQ_HEAD_ID=" + this.setevent + " AND STATUS=1"
      this.showx = false;
    }

    this.api.getfaq(0, 0, '', 'desc', filter).subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        this.faqs = data['data'];
      } else {
        this.faqs = null
      }
    });
  }
}