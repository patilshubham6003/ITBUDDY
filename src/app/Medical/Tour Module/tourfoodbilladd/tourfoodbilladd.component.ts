import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { foodtable } from '../../Models/foodaddd';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-tourfoodbilladd',
  templateUrl: './tourfoodbilladd.component.html',
  styleUrls: ['./tourfoodbilladd.component.css'],
})
export class TourfoodbilladdComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: foodtable;
  @Input() show: any;
  @Input() gradpaylevel: any;
  @Input() maxAdmissibleAmount: any = 0;
  isAdmin: boolean = false;
  @Input() tourID: any;

  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}
  roleId: any;
  isShowCSS: boolean = false;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      Number(sessionStorage.getItem('roleId')) != null &&
      Number(sessionStorage.getItem('roleId')) == 2
    ) {
      this.isShowCSS = true;
    } else {
      this.isShowCSS = false;
    }
  }
  close(AddNewRecord: NgForm) {
    this.drawerClose();
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new foodtable();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    AddNewRecord.form.markAsPristine();
    AddNewRecord.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Journeychange(event: any) {
    if (event == true) {
      this.data.ALLOWED_PERCENTAGE = 100;
      this.data.START_TIME = null;
      this.data.END_TIME = null;
    } else if (event == false) {
      this.data.JOURNEY_END_DATE = null;
    }
  }

  fileURL1: any;
  progressBartourFoodVoucher: boolean = false;
  percenttourFoodVoucher = 0;
  timertourFoodVoucher: any;
  onFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
      if (this.fileURL1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.VOUCHER_URL != undefined &&
          this.data.VOUCHER_URL.trim() != ''
        ) {
          var arr = this.data.VOUCHER_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBartourFoodVoucher = true;
      this.timertourFoodVoucher = this.api
        .onUpload('tourFoodVoucher', this.fileURL1, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourFoodVoucher = percentDone;
            if (this.percenttourFoodVoucher == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourFoodVoucher = false;
            this.percenttourFoodVoucher = 0;
            this.fileURL1 = null;
            this.data.VOUCHER_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.VOUCHER_URL = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (successCode.code == '200') {
          //   this.data.VOUCHER_URL = url;
          //   this.message.success('File saved Successfully...', '');
          //   // this.data.FILE_URL = url;
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
      this.data.VOUCHER_URL = null;
      this.isSpinning = false;
    }
  }

  save(addNew: boolean, AddNewRecord: NgForm): void {
    this.isSpinning = true;
    this.isOk = true;
    this.data.TOUR_ID = this.tourID;
    if (
      this.data.EXPENSE_DATE == undefined &&
      this.data.EXPENSE_AMOUNT == undefined &&
      this.data.START_TIME == undefined &&
      this.data.END_TIME == undefined &&
      this.data.ALLOWED_PERCENTAGE == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.IS_LONG_JOURNEY == true &&
      (this.data.EXPENSE_DATE == null || this.data.EXPENSE_DATE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please  Select From Start Date', '');
    } else if (
      this.data.IS_LONG_JOURNEY == false &&
      (this.data.EXPENSE_DATE == null || this.data.EXPENSE_DATE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please  Select From Date', '');
    } else if (
      this.data.IS_LONG_JOURNEY == true &&
      (this.data.JOURNEY_END_DATE == null || this.data.JOURNEY_END_DATE == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select From End Date', '');
    } else if (
      this.data.IS_LONG_JOURNEY == false &&
      (this.data.START_TIME == null || this.data.START_TIME == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select From Start Time', '');
    } else if (
      this.data.IS_LONG_JOURNEY == false &&
      (this.data.END_TIME == null || this.data.END_TIME == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select From End Time', '');
    } else if (
      this.data.EXPENSE_AMOUNT == null ||
      this.data.EXPENSE_AMOUNT == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Claimed Amount', '');
    } else if (
      this.data.ALLOWED_PERCENTAGE == null ||
      this.data.ALLOWED_PERCENTAGE == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Allowed Percentage', '');
    } else if (
      this.show == true &&
      (this.data.FOOD_ADMISIBLE_AMOUNT == null ||
        this.data.FOOD_ADMISIBLE_AMOUNT == '')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Admisible Amount', '');
    } else if (
      this.data.IS_VOUCHER == true &&
      (this.data.VOUCHER_URL == null ||
        this.data.VOUCHER_URL == '' ||
        this.data.VOUCHER_URL == undefined)
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Voucher', '');
    } else if (
      this.roleId != 2 &&
      this.data.FOOD_ADMISIBLE_AMOUNT > this.data.EXPENSE_AMOUNT
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Claimed Amount',
        ''
      );
    }

    if (this.isOk) {
      if (this.data.EXPENSE_DATE == undefined) {
        this.data.EXPENSE_DATE = null;
      } else {
        this.data.EXPENSE_DATE = this.datePipe.transform(
          this.data.EXPENSE_DATE,
          'yyyy-MM-dd'
        );
      }

      if (this.data.JOURNEY_END_DATE == undefined) {
        this.data.JOURNEY_END_DATE = null;
      } else {
        this.data.JOURNEY_END_DATE = this.datePipe.transform(
          this.data.JOURNEY_END_DATE,
          'yyyy-MM-dd'
        );
      }

      if (
        this.data.IS_LONG_JOURNEY == true ||
        this.data.START_TIME == undefined ||
        this.data.START_TIME == null
      ) {
        this.data.START_TIME = null;
      } else {
        this.data.START_TIME = this.datePipe.transform(
          this.data.START_TIME,
          'HH:mm'
        );
      }
      if (
        this.data.IS_LONG_JOURNEY == true ||
        this.data.END_TIME == undefined ||
        this.data.END_TIME == null
      ) {
        this.data.END_TIME = null;
      } else {
        this.data.END_TIME = this.datePipe.transform(
          this.data.END_TIME,
          'HH:mm'
        );
      }

      {
        if (this.data.ID) {
          this.api.updatetoursFood(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
              AddNewRecord.form.reset();
              // this.search()
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createtoursFood(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new foodtable();
                this.resetDrawer(AddNewRecord);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }
  timeDifference: any;
  calculateTimeDifference(event: any): void {
    this.data.START_TIME = event;

    if (this.data.START_TIME != null && this.data.START_TIME != '') {
      this.calculateTimeDifference3();
    }
  }

  calculateTimeDifference2(event: any): void {
    this.data.END_TIME = event;

    if (this.data.END_TIME != null && this.data.END_TIME != '') {
      this.calculateTimeDifference3();
    }
  }
  calculateTimeDifference3(): void {
    if (
      this.data.START_TIME != null &&
      this.data.END_TIME != null &&
      this.data.START_TIME != '' &&
      this.data.END_TIME != ''
    ) {
      var startdate: any = this.datePipe.transform(
        this.data.START_TIME,
        'HH:mm'
      );

      var enddate: any = this.datePipe.transform(this.data.END_TIME, 'HH:mm');

      const startTimeParts = startdate.split(':');
      const endTimeParts = enddate.split(':');

      const startHour = parseInt(startTimeParts[0], 10);
      const startMinute = parseInt(startTimeParts[1], 10);
      const endHour = parseInt(endTimeParts[0], 10);
      const endMinute = parseInt(endTimeParts[1], 10);

      const totalStartMinutes = startHour * 60 + startMinute;
      const totalEndMinutes = endHour * 60 + endMinute;

      const differenceInMinutes = totalEndMinutes - totalStartMinutes;

      const hours = Math.floor(differenceInMinutes / 60);
      const minutes = differenceInMinutes % 60;
      if (hours < 6) {
        this.data.ALLOWED_PERCENTAGE = 30;
      } else if (hours >= 6 && hours < 12) {
        this.data.ALLOWED_PERCENTAGE = 70;
      } else if (hours >= 12) {
        this.data.ALLOWED_PERCENTAGE = 100;
      }
    }
  }

  calculateamt(event: any) {
    if (event != null) {
      if (this.data.ALLOWED_PERCENTAGE != null) {
        this.data.FOOD_ADMISIBLE_AMOUNT = 0;

        this.data.FOOD_ADMISIBLE_AMOUNT =
          Number(event) -
          (Number(event) * Number(this.data.ALLOWED_PERCENTAGE)) / 100;
      }
    }
  }
  calculateAmtPercentage(event: any) {
    if (event != null && event != undefined && event != '') {
      if (
        this.data.EXPENSE_AMOUNT != null &&
        this.data.EXPENSE_AMOUNT != undefined &&
        this.data.EXPENSE_AMOUNT != ''
      ) {
        this.data.FOOD_ADMISIBLE_AMOUNT =
          // Number(this.data.EXPENSE_AMOUNT) -
          (Number(this.data.EXPENSE_AMOUNT) * Number(event)) / 100;
      }
    } else {
      this.data.FOOD_ADMISIBLE_AMOUNT = 0;
    }
  }
  notAboveHundred(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const inputValue = Number(
      event.target.value + String.fromCharCode(charCode)
    );
    if (charCode > 31 && (charCode < 48 || charCode > 57 || inputValue > 100)) {
      console.error('Input value cannot be greater than 100');
      this.message.error('Input value cannot be greater than 100', '');
      return false;
    }
    return true;
  }
  printOrderModalVisible: any = false;
  viewAssumptionPDF(pdfURL: string): void {
    var a: any = this.api.retriveimgUrl + 'tourFoodVoucher/' + pdfURL;
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    this.printOrderModalVisible = true;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  sanitizedLink: any = '';
  getS(link: string) {
    var a: any = this.api.retriveimgUrl + 'tourFoodVoucher/' + link;

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);

    return this.sanitizedLink;
  }
  // calculateTimeDifference(){
  //   var diff = this.data.START_TIME.getTime() - this.data.END_TIME.getTime();
  //   var days = Math.floor(diff / (60 * 60 * 24 * 1000));
  //   var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
  //   var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
  //   var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
  //   // return { day: days, hour: hours, minute: minutes, second: seconds };

  // }
  startDateDays(event) {
    var date1: any = new Date(event);
    event = this.datePipe.transform(event, 'yyyy-MM-dd');
    if (
      this.data.JOURNEY_END_DATE != undefined &&
      this.data.JOURNEY_END_DATE != null &&
      this.data.JOURNEY_END_DATE != ''
    ) {
      let time1 = new Date(event).getTime();
      let time2 = new Date(this.data.JOURNEY_END_DATE).getTime();
      this.data.JOURNEY_END_DATE = this.datePipe.transform(
        this.data.JOURNEY_END_DATE,
        'yyyy-MM-dd'
      );
      var date2: any = new Date(this.data.JOURNEY_END_DATE);
      var days = Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
      var days2 = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
      let time = time2 - time1; //msec
      var timeDiff = time / (1000 / 60 / 60);

      this.maxAdmissibleAmount = 0;
      if (
        this.gradpaylevel == 'Level 6' ||
        this.gradpaylevel == 'Level 7' ||
        this.gradpaylevel == 'Level 8'
      ) {
        this.maxAdmissibleAmount = 500 * Number(days);
      } else if (
        this.gradpaylevel == 'Level 9' ||
        this.gradpaylevel == 'Level 10' ||
        this.gradpaylevel == 'Level 11'
      ) {
        this.maxAdmissibleAmount = 800 * Number(days);
      } else if (
        this.gradpaylevel == 'Level 12' ||
        this.gradpaylevel == 'Level 13'
      ) {
        this.maxAdmissibleAmount = 1000 * Number(days);
      } else if (this.gradpaylevel >= 'Level 14') {
        this.maxAdmissibleAmount = 1200 * Number(days);
      }
    } else {
    }
  }

  endDateDays(event) {
    var date1: any = new Date(event);
    event = this.datePipe.transform(event, 'yyyy-MM-dd');
    if (
      this.data.EXPENSE_DATE != undefined &&
      this.data.EXPENSE_DATE != null &&
      this.data.EXPENSE_DATE != ''
    ) {
      let time1 = new Date(event).getTime();
      let time2 = new Date(this.data.EXPENSE_DATE).getTime();
      this.data.EXPENSE_DATE = this.datePipe.transform(
        this.data.EXPENSE_DATE,
        'yyyy-MM-dd'
      );
      var date2: any = new Date(this.data.EXPENSE_DATE);
      var days = Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
      let time = time2 - time1; //msec
      var timeDiff2 = time / (1000 / 60 / 60);

      this.maxAdmissibleAmount = 0;
      if (
        this.gradpaylevel == 'Level 6' ||
        this.gradpaylevel == 'Level 7' ||
        this.gradpaylevel == 'Level 8'
      ) {
        this.maxAdmissibleAmount = 500 * Number(days);
      } else if (
        this.gradpaylevel == 'Level 9' ||
        this.gradpaylevel == 'Level 10' ||
        this.gradpaylevel == 'Level 11'
      ) {
        this.maxAdmissibleAmount = 800 * Number(days);
      } else if (
        this.gradpaylevel == 'Level 12' ||
        this.gradpaylevel == 'Level 13'
      ) {
        this.maxAdmissibleAmount = 1000 * Number(days);
      } else if (this.gradpaylevel >= 'Level 14') {
        this.maxAdmissibleAmount = 1200 * Number(days);
      }
    } else {
    }
  }
}
