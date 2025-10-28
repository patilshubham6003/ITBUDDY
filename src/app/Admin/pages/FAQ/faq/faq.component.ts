import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/Service/service.service';
import { Faq } from 'src/app/Modal/faq';
import { FaqHead } from 'src/app/Modal/Faqhead';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  providers: [DatePipe],
})
export class FaqComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Faq;

  isSpinning = false;
  faqHeads: FaqHead[];
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  isOk = true;
  fileURL: any;
  formatedDate: string | null;

  fileDataURL: File | null = null;
  listOfOption: Array<{ label: string; value: string }> = [];
  f_key = 'VwKkXFiw';
  applicationId = Number(this.cookie.get('applicationId'));

  constructor(
    private api: ServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadFaqHeads();
  }
  loadFaqHeads() {
    this.isSpinning = true;
    // AND APPLICATION_ID=+this.applicationId
    this.api.getAllFaqHeads(0, 0, '', '', ' AND STATUS=1 ').subscribe(
      (localName) => {
        this.faqHeads = localName['data'];
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
        console.log(err);
      }
    );
  }

  resetDrawer(accountMasterPage: NgForm) {
    accountMasterPage.form.reset();
  }
  close(accountMasterPage: NgForm): void {
    this.resetDrawer(accountMasterPage);
    this.drawerClose();
  }

  save2(addNew: boolean, accountMasterPage: NgForm) {
    if (this.data.ID) {
      this.data.TAGS = this.data.TAGS_STRING.toString();

      this.api.updateFaq(this.data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Information Updated Successfully...', '');
          if (!addNew) this.drawerClose();
          this.resetDrawer(accountMasterPage);
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Update Information...', '');
          this.isSpinning = false;
        }
      });
    } else {
      if (this.fileDataURL) {
        this.data.URL = this.genarateKey();
      } else {
        this.data.URL = '';
      }
      this.data.POSITIVE_HELPFUL_COUNT = 0;
      this.data.NEGATIVE_HELPFUL_COUNT = 0;
      this.data.TAGS = this.data.TAGS_STRING.toString();

      this.api.createFaq(this.data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Information Save Successfully...', '');
          if (!addNew) {
            this.drawerClose();
            this.resetDrawer(accountMasterPage);
          } else {
            this.data = new Faq();
            this.resetDrawer(accountMasterPage);
            this.api.getAllFaqs(1, 1, 'SEQ_NO', 'desc', ' ').subscribe(
              (data) => {
                if (data['count'] == 0) {
                  this.data.SEQ_NO = 1;
                } else {
                  this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                }
              },
              (err) => {
                console.log(err);
              }
            );
          }
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Save Information...', '');
          this.isSpinning = false;
        }
      });
    }
  }
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      (this.data.FAQ_HEAD_ID == 0 || this.data.FAQ_HEAD_ID == undefined) &&
      (this.data.QUESTION.trim() == '' || this.data.QUESTION == undefined) &&
      (this.data.ANSWER.trim() == '' || this.data.ANSWER == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    } else if (
      this.data.FAQ_HEAD_ID == undefined ||
      this.data.FAQ_HEAD_ID == null ||
      this.data.FAQ_HEAD_ID == 0
    ) {
      this.isOk = false;
      this.message.error('Please Select FAQ Head Name', '');
    } else if (
      this.data.QUESTION.trim() == '' ||
      this.data.QUESTION == null ||
      this.data.QUESTION == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Question', '');
    } else if (this.data.ANSWER.trim() == '' || this.data.ANSWER == null) {
      this.isOk = false;
      this.message.error('Please Enter Answer', '');
    } else if (this.data.SEQ_NO <= 0 || this.data.SEQ_NO == null) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No', '');
    }
    if (this.isOk) {
      // this.data.ORG_ID = Number(this.cookie.get('orgId'));
      this.isSpinning = true;

      this.save2(addNew, accountMasterPage);
    }
  }

  genarateKey() {
    var number = Math.floor(100000 + Math.random() * 900000);
    console.log(number);
    // var fileExt = this.fileDataURL.name.split('.').pop();
    // var url = this.date1 + number + "." + fileExt
    var url = this.fileURL.name;
    // var url=this.fileDataURL.name;
    this.api.onUpload('faq', this.fileDataURL, url);
    this.data.URL = this.api.retriveimgUrl + 'faq/' + url;
    return this.data.URL;
  }
  onFileSelectedURL(event) {
    this.fileDataURL = <File>event.target.files[0];
    var fileExt = this.fileDataURL.name.split('.').pop();
    console.log(fileExt);
  }

  response(status, data) {
    this.isSpinning = true;
    data.STATUS = status;
  }

  getUrl(url) {
    if (url) return this.api.baseUrl + 'static/ticket/' + url;
    else return '';
  }
}
