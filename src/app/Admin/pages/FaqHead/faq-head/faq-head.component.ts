import { Component, OnInit, Input } from '@angular/core';
// import { Application } from 'src/app/Models/Application';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { NgForm } from '@angular/forms';
// import { Application } from 'src/app/Models/application';
import { ServiceService } from 'src/app/Service/service.service';
import { FaqHead } from 'src/app/Modal/Faqhead';

@Component({
  selector: 'app-faq-head',
  templateUrl: './faq-head.component.html',
  styleUrls: ['./faq-head.component.css'],
})
export class FaqHeadComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: FaqHead;
  org = [];
  isSpinning = false;
  // applications: Application[];
  faqHeads: FaqHead[];
  isOk = true;
  applicationId = Number(this.cookie.get('applicationId'));
  namepatt = /[a-zA-Z][a-zA-Z ]+/;

  constructor(
    private api: ServiceService,
    private cookie: CookieService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadFaqHeads();
  }

  alphaOnly(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  loadFaqHeads() {
    this.isSpinning = true;
    //  let filterQuery=" AND IS_PARENT=1 AND APPLICATION_ID = "+this.applicationId
    // let filterQuery = ' AND IS_PARENT=1 ';

    this.api.getAllFaqHeads(0, 0, '', '', '').subscribe(
      (localName) => {
        this.faqHeads = localName['data'];
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
        console.log(err);
      }
    );

    this.api.getAllFaqHeads(1, 1, 'SEQUENCE_NO', 'DESC', ' ').subscribe(
      (data) => {
        if (data['count'] == 0) {
          this.data['SEQUENCE_NO'] = 1;
        } else {
          this.data['SEQUENCE_NO'] = data['data'][0]['SEQUENCE_NO'] + 1;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadFaqHeads1() {
    this.faqHeads = [];

    let filterQuery = ' AND IS_PARENT=1 ';

    this.api
      .getAllFaqHeads(0, 0, '', '', filterQuery + ' AND STATUS =1 ')
      .subscribe(
        (localName) => {
          if (localName['code'] == 200) {
            this.faqHeads = localName['data'];
          }
        },
        (err) => {
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

  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.PARENT_ID == undefined && this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    } else if (this.data.PARENT_ID == null || this.data.PARENT_ID < 0) {
      this.isOk = false;
      this.message.error('Please Enter Parent Name', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter FAQ Head Name', '');
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Name', '');
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      this.isOk = false;
      this.message.error('Please Enter Sequence Number', '');
    }

    if (this.isOk) {
      //  this.isSpinning=false;

      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.data.APPLICATION_ID = 1;

          this.api.updateFaqHead(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Information Updated Successfully', '');
              if (!addNew) this.drawerClose();

              this.resetDrawer(accountMasterPage);
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Update Information', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createFaqHead(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.resetDrawer(accountMasterPage);
              this.message.success('Information Saved Successfully', '');

              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                this.resetDrawer(accountMasterPage);
              } else {
                this.data = new FaqHead();
                this.resetDrawer(accountMasterPage);
                this.api
                  .getAllFaqHeads(1, 1, 'SEQUENCE_NO', 'desc', '')
                  .subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NO = 1;
                      } else {
                        this.data.SEQUENCE_NO =
                          data['data'][0]['SEQUENCE_NO'] + 1;
                      }
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }

              this.data.IS_PARENT = true;
              this.data.STATUS = true;
              // this.loadFaqHeads();
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Save Information', '');
              this.isSpinning = false;
            }
          });
        }
      }
      // else {
      //   this.message.error("Please Fill All Required Fields...", "");
      //   this.isSpinning = false;
    }
  }
}
