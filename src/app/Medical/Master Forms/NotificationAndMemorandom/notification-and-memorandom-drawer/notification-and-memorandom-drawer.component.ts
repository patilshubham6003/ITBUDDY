import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NotificationAndMemorandomMaster } from 'src/app/Medical/Models/NotificationAndMemorandom';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-notification-and-memorandom-drawer',
  templateUrl: './notification-and-memorandom-drawer.component.html',
  styleUrls: ['./notification-and-memorandom-drawer.component.css'],
})
export class NotificationAndMemorandomDrawerComponent implements OnInit {
  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  @Input() drawerClose: Function;
  @Input() data: NotificationAndMemorandomMaster;
  isSpinning = false;
  isOk = true;
  fileURL1: any;

  resetDrawer(cityMasterPage: NgForm) {
    this.data = new NotificationAndMemorandomMaster();
    cityMasterPage.form.markAsPristine();
    cityMasterPage.form.markAsUntouched();
  }
  close(notificationMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(notificationMasterPage);
    notificationMasterPage.form.reset();
  }

  save(addNew: boolean, notificationMasterPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == '' &&
      this.data.DATE == undefined &&
      this.data.PDF_URL.trim() == '' &&
      this.data.FILE_NO == null
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Fields.', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Notification/ Momorandum Name', '');
    }
    // else
    //     if (this.data.DATE == null || this.data.DATE == undefined) {
    //       this.isOk = false
    //       this.message.error('Please Select Date', '')
    //       // }else
    //       // if(!this.namepatt.test(this.data.NAME_MR)){
    //       //   this.message.error('Please Enter Valid Marathi Name','')
    //     }
    else if (this.data.PDF_URL == null || this.data.PDF_URL.trim() == '') {
      this.isOk = false;
      this.message.error('Please Select Pdf File', '');
    } else if (this.data.FILE_NO == null || this.data.FILE_NO == undefined) {
      this.isOk = false;
      this.message.error('Please Enter File No', '');
    }
    if (this.isOk) {
      // this.isSpinning=false;

      this.isSpinning = true;
      if (this.data.DATE == undefined) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      }
      if (this.fileURL1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (this.data.PDF_URL != undefined && this.data.PDF_URL.trim() != '') {
          var arr = this.data.PDF_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
        this.api
          .onUpload('notificationPdf/', this.fileURL1, url)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.data.PDF_URL = url;

              if (this.data.ID) {
                this.api
                  .updateNotification(this.data)
                  .subscribe((successCode) => {
                    if (successCode['code'] == '200') {
                      this.message.success(
                        'Information Updated Successfully...',
                        ''
                      );
                      if (!addNew) this.drawerClose();
                      this.isSpinning = false;
                    } else {
                      this.message.error('Information Not Updated...', '');
                      this.isSpinning = false;
                    }
                  });
              } else {
                this.api
                  .createNotification(this.data)
                  .subscribe((successCode) => {
                    if (successCode['code'] == '200') {
                      this.message.success(
                        'Information Saved Successfully...',
                        ''
                      );
                      if (!addNew) {
                        this.drawerClose();
                      } else {
                        this.data = new NotificationAndMemorandomMaster();
                        this.resetDrawer(notificationMasterPage);
                        this.data.PDF_URL = '';
                      }
                      this.isSpinning = false;
                    } else {
                      this.message.error('Information Not Saved...', '');
                      this.isSpinning = false;
                    }
                  });
              }
            } else {
              this.message.error('Failed To Save PDF File...', '');
              this.isSpinning = false;
            }
          });
      } else if (this.data.PDF_URL == null || this.data.PDF_URL == '') {
        this.message.error('Please Select File', '');
        this.isSpinning = false;
      } else {
        if (this.data.ID) {
          this.api.updateNotification(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Information Updated Successfully', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Store Information', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createNotification(this.data).subscribe((successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Information Saved Successfully...', '');
              if (!addNew) {
                this.drawerClose();
              } else {
                this.data = new NotificationAndMemorandomMaster();
                this.resetDrawer(notificationMasterPage);
                this.data.PDF_URL = '';
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Store Information', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  onFileSelected(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
    }
  }
}
