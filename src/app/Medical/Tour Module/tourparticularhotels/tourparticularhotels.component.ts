import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Particularhotels } from '../../Models/particulardetailsofhotel';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-tourparticularhotels',
  templateUrl: './tourparticularhotels.component.html',
  styleUrls: ['./tourparticularhotels.component.css'],
})
export class TourparticularhotelsComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Particularhotels;
  @Input() empID: any;
  @Input() tourID: any;
  @Input() gradpaylevel: any;
  roleId: any;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isShowCSS: boolean = false;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
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
    this.data = new Particularhotels();
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

  save(addNew: boolean, AddNewRecord: NgForm): void {
    if (
      this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT != null ||
      this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT != undefined ||
      this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT != ''
    ) {
      this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT = Number(
        this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT
      );
    } else {
    }
    if (
      this.data.TOTAL_AMOUNT_PAID != null ||
      this.data.TOTAL_AMOUNT_PAID != undefined ||
      this.data.TOTAL_AMOUNT_PAID != ''
    ) {
      this.data.TOTAL_AMOUNT_PAID = Number(this.data.TOTAL_AMOUNT_PAID);
    } else {
    }
    if (
      this.data.DAYS_AT_HOTEL != null &&
      this.data.DAYS_AT_HOTEL != undefined &&
      this.data.DAYS_AT_HOTEL > 0
    ) {
      var a = 0;
      var b = 0;
      var c = 0;
      a = this.data.DAYS_AT_HOTEL * 2250;
      b = this.data.DAYS_AT_HOTEL * 4500;
      c = this.data.DAYS_AT_HOTEL * 7500;
    } else {
      a = 2250;
      b = 4500;
      c = 7500;
    }
    this.isSpinning = true;
    this.isOk = true;
    this.data.TOUR_ID = this.tourID;
    this.data.EMP_ID = this.empID;

    if (
      this.data.TOTAL_AMOUNT_PAID == 0 &&
      this.data.DAILY_RATE_OF_LODGING_CHARGES == 0 &&
      this.data.PERIOD_TO == undefined &&
      this.data.NAME_OF_HOTEL == undefined &&
      this.data.PLACE == undefined &&
      this.data.PERIOD_FROM == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.NAME_OF_HOTEL == null ||
      this.data.NAME_OF_HOTEL == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Name of Hotel', '');
    } else if (this.data.PERIOD_FROM == null || this.data.PERIOD_FROM == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select From Period Date', '');
    } else if (this.data.PERIOD_TO == null || this.data.PERIOD_TO == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select To Period Date ', '');
    } else if (this.data.PLACE == null || this.data.PLACE == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Place', '');
    } else if (
      (this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT == null ||
        this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT == '') &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Amount', '');
    } else if (
      (this.data.TOTAL_AMOUNT_PAID == null ||
        this.data.TOTAL_AMOUNT_PAID <= 0) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Admissible Amount (Rs)', '');
    } else if (
      (this.data.AMOUNT_WITHOUT_GST == null ||
        this.data.AMOUNT_WITHOUT_GST == undefined) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Admissible Amount Without GST (Rs)', '');
    } else if (
      this.data.HOTEL_GST == null ||
      this.data.HOTEL_GST == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter GST(%)', '');
    } else if (
      this.data.AMOUNT_WITHOUT_GST >= a + 1 &&
      (this.gradpaylevel == 'Level 9' ||
        this.gradpaylevel == 'Level 10' ||
        this.gradpaylevel == 'Level 11')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Admissible Amount Without GST below ' + a,
        ''
      );
    } else if (
      this.data.AMOUNT_WITHOUT_GST >= b + 1 &&
      (this.gradpaylevel == 'Level 12' || this.gradpaylevel == 'Level 13')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Admissible Amount Without GST below ' + b,
        ''
      );
    } else if (
      c + 1 <= this.data.AMOUNT_WITHOUT_GST &&
      (this.gradpaylevel == 'Level 14' ||
        this.gradpaylevel == 'Level 15' ||
        this.gradpaylevel == 'Level 16' ||
        this.gradpaylevel == 'Level 17')
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Admissible Amount Without GST below ' + c,
        ''
      );
    } else if (
      this.roleId != 2 &&
      this.data.PLACE_ORDER_ACCOMODATION_ADMISSIBLE_AMOUNT <
        this.data.TOTAL_AMOUNT_PAID
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Fare Paid By The Officer',
        ''
      );
    }

    if (this.isOk) {
      if (this.data.PERIOD_FROM == undefined) {
        this.data.PERIOD_FROM = null;
      } else {
        this.data.PERIOD_FROM = this.datePipe.transform(
          this.data.PERIOD_FROM,
          'yyyy-MM-dd HH:mm'
        );
      }
      if (this.data.PERIOD_TO == undefined) {
        this.data.PERIOD_TO = null;
      } else {
        this.data.PERIOD_TO = this.datePipe.transform(
          this.data.PERIOD_TO,
          'yyyy-MM-dd HH:mm'
        );
      }

      {
        if (this.data.ID) {
          this.api
            .updatetoursparticularhotel(this.data)
            .subscribe((successCode) => {
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
          this.api
            .createtoursparticularhotel(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) this.drawerClose();
                else {
                  this.data = new Particularhotels();
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
  changetotalvalue(event: any) {
    if (event != null) {
      if (event == 0) {
        this.data.TOTAL_AMOUNT_PAID = this.data.AMOUNT_WITHOUT_GST;
      } else if (event > 0) {
        this.data.TOTAL_AMOUNT_PAID = 0;
        this.data.TOTAL_AMOUNT_PAID =
          Number(this.data.AMOUNT_WITHOUT_GST) +
          (this.data.AMOUNT_WITHOUT_GST * event) / 100;
      }
    }
  }

  changetotalvalue1(event: any) {
    if (this.data.HOTEL_GST != null && this.data.HOTEL_GST != undefined) {
      if (this.data.HOTEL_GST == 0) {
        this.data.TOTAL_AMOUNT_PAID = event;
      } else if (event > 0) {
        this.data.TOTAL_AMOUNT_PAID = 0;
        this.data.TOTAL_AMOUNT_PAID =
          Number(event) + (event * this.data.HOTEL_GST) / 100;
      }
    }
  }

  fileURL: any;
  progressBarhotelBill: boolean = false;
  percenthotelBill = 0;
  timerhotelBill: any;
  onBillFileSelected(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL = <File>event.target.files[0];
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.HOTEL_BILL != undefined &&
          this.data.HOTEL_BILL.trim() != ''
        ) {
          var arr = this.data.HOTEL_BILL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBarhotelBill = true;
      this.timerhotelBill = this.api
        .onUpload('hotelBill', this.fileURL, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenthotelBill = percentDone;
            if (this.percenthotelBill == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarhotelBill = false;
            this.percenthotelBill = 0;
            this.fileURL = null;
            this.data.HOTEL_BILL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.HOTEL_BILL = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL = null;
      this.data.HOTEL_BILL = null;
      this.isSpinning = false;
    }
  }

  billPDFView(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'hotelBill/' + pdfURL);
  }
}
