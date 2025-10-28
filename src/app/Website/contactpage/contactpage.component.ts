import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WebsiteService } from 'src/app/Service/website.service';
import { ContactMaster } from '../websiteModal/contact';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contactpage',
  templateUrl: './contactpage.component.html',
  styleUrls: ['./contactpage.component.css'],
})
export class ContactpageComponent implements OnInit {
  contactMaster: any = [];
  TITLE: any;
  contact: any = [];
  newContact: ContactMaster = new ContactMaster();
  loaded = false;
  emailpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobpattern = /^[7-9]\d{9}$/;
  LATITUDE: any;
  LONGITUDE: any;
  url: SafeUrl = '';
  isSpinning = true;
  columns: string[][] = [
    ['NAME'],
    ['SERVICE_TITLE'],
    ['OFFICE_NAME'],
    ['DESIGNATION'],
  ];

  constructor(
    private apiservice: WebsiteService,
    private toast: ToastrService,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.getContact();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  AllFilters() {
    this.isSpinning = true;
  }
  getContact() {
    this.apiservice
      .getAllcontact(0, 0, 'id', 'desc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.contactMaster = data['data'][0];
          this.contact = data['data'];
          this.LATITUDE = data['data'][0]['LATITUDE'];
          this.LONGITUDE = data['data'][0]['LONGITUDE'];
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://maps.google.com/maps?q=' +
              this.LONGITUDE +
              ',' +
              this.LATITUDE +
              '&output=embed'
          );
        }
      });
  }
  onsubmit(addContact: NgForm) {
    if (
      (this.newContact.EMPLOYEE_NAME == '' ||
        this.newContact.EMPLOYEE_NAME == undefined) &&
      (this.newContact.EMAIL_ID == '' ||
        this.newContact.EMAIL_ID == undefined) &&
      this.newContact.MOBILE_NO == undefined &&
      (this.newContact.SUBJECT == '' || this.newContact.SUBJECT == undefined) &&
      (this.newContact.MESSAGE == '' || this.newContact.MESSAGE == undefined)
    ) {
      this.toast.error('Please Enter All Details ', '');
    } else if (
      this.newContact.EMPLOYEE_NAME.trim() == '' ||
      this.newContact.EMPLOYEE_NAME == undefined
    ) {
      this.toast.error('Please Enter Name ', '');
    } else if (
      this.newContact.EMAIL_ID == '' ||
      this.newContact.EMAIL_ID.trim() == ''
    ) {
      this.toast.error('Please Enter Email ', '');
    } else if (!this.emailpattern.test(this.newContact.EMAIL_ID)) {
      this.toast.error('Please Enter Valid Email ', '');
    } else if (
      this.newContact.MOBILE_NO == undefined ||
      this.newContact.MOBILE_NO <= 0
    ) {
      this.toast.error('Please Enter Mobile Number ', '');
    } else if (!this.mobpattern.test(this.newContact.MOBILE_NO.toString())) {
      this.toast.error('Please Enter Valid Mobile Number ', '');
    } else if (
      this.newContact.SUBJECT == null ||
      this.newContact.SUBJECT.trim() == ''
    ) {
      this.toast.error('Please Enter Subject ', '');
    } else if (
      this.newContact.MESSAGE == null ||
      this.newContact.MESSAGE.trim() == ''
    ) {
      this.toast.error('Please Enter Message ', '');
    }

    if (addContact.valid == true) {
      this.loaded = true;
      this.apiservice.createcontact(this.newContact).subscribe(
        (successCode) => {
          if (successCode.code == '200') {
            this.loaded = false;
            this.toast.success('Contact Information Saved Successfully...', '');
            addContact.reset();
          } else {
            this.loaded = false;
            this.toast.error('Contact Information Not Saved...', '');
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
}
