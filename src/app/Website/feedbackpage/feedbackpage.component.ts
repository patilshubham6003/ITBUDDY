import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { appkeys } from 'src/app/app.constant';
import { feedback } from 'src/app/Modal/contact';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-feedbackpage',
  templateUrl: './feedbackpage.component.html',
  styleUrls: ['./feedbackpage.component.css'],
  providers: [DatePipe],
})
export class FeedbackpageComponent {
  imgurl = appkeys.retriveimgUrl;

  feedback: any = new feedback();
  loaded = false;
  emailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobpattern = /^[7-9]\d{9}$/;

  isSpinning = true;

  constructor(
    private apiservice: WebsiteService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.isSpinning = false;
  }
  AllFilters() {
    this.isSpinning = true;
  }

  onsubmit(addContact: NgForm) {
    this.loaded = true;

    if (this.feedback.TYPE.trim() == '' || this.feedback.TYPE == undefined) {
      this.toast.error('Please Select Feedback Type ', '');
      this.loaded = false;
    } else if (
      this.feedback.SUBJECT == '' ||
      this.feedback.SUBJECT.trim() == ''
    ) {
      this.toast.error('Please Enter Subject ', '');
      this.loaded = false;
    } else if (
      this.feedback.DESCRIPTION == null ||
      this.feedback.DESCRIPTION.trim() == ''
    ) {
      this.toast.error('Please Enter Description ', '');
      this.loaded = false;
    } else {
      this.loaded = true;
      this.feedback.EMPLOYEE_ID = sessionStorage.getItem('userId');
      this.feedback.STATUS = true;
      this.feedback.FEEDBACK_STATUS = 'P';
      this.feedback.CREATED_DATE = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd'
      );
      this.apiservice.createfeedback(this.feedback).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.loaded = false;
            this.toast.success(
              'Feedback Information Submitted Successfully',
              ''
            );
            addContact.reset();
            this.feedback.ATTACHMENT = null;
            this.percent = 0;
            this.progressBar = false;
          } else {
            this.loaded = false;
            this.toast.error('Feedback Information Not Submitted...', '');
          }
        },
        (err) => {
          this.loaded = false;
        }
      );
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  alphaonly(event) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }
  fileURL2: any;
  image: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  checkImage2(event: any) {
    if (event.target.files.length == 0) {
      this.toast.error('Please select Attachment', '');
      this.fileURL2 = null;
    } else if (event.target.files[0].type == 'application/pdf') {
      this.fileURL2 = <File>event.target.files[0];
    } else {
      this.toast.error('Please select olny PDF files.', '');
      this.fileURL2 = null;
    }
    const reader = new FileReader();

    // if (this.fileURL2 != null) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result as string;
      };
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL2.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      this.feedback.ATTACHMENT = url;
      this.uploadImage2(this.fileURL2, url);
    } else {
      this.fileURL2 = null;
      this.feedback.ATTACHMENT = null;
    }
  }

  uploadImage2(fileURL: any, url: any) {
    this.progressBar = true;
    this.timer = this.apiservice
      .onUploadidproof1('feedbackAttchment', fileURL, url)
      .subscribe(
        (successCode) => {
          if (successCode.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(
              (100 * successCode.loaded) / successCode.total
            );
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
              this.toast.success('Attachment Uploaded Successfully', '');
            }
          }
        },
        (err) => {
          this.isSpinning = false;
          this.toast.error('Failed To Upload Attachment', '');
          this.feedback.ATTACHMENT = null;
        }
      );
  }

  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.apiservice.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURL2 = null;
          this.feedback.ATTACHMENT = null;
          this.progressBar = false;
          this.percent = 0;
        } else {
          this.toast.error('Failed to delete Attachment', '');
        }
      },
      (err) => {
        this.toast.error('Failed to delete Attachment', '');
      }
    );
  }
}
