import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { Journeydetails } from '../../Models/journeydetails';
import { ApiService } from '../../Service/api.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-detailsofjourney',
  templateUrl: './detailsofjourney.component.html',
  styleUrls: ['./detailsofjourney.component.css'],
  providers: [NzNotificationService],
})
export class DetailsofjourneyComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Journeydetails;
  @Input() empID: any;
  @Input() ltcID: any;
  @Input() gradePayLevel: any;
  ID: any;
  DATE: any;
  FARE_PAID: any;
  FROM_PLACE_NAME: any;
  TO_PLACE_NAME: any;
  modedata: any[] = [];
  @Input() classdata: any[] = [];
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isSpinning = false;
  isOk = true;
  isAdmin: boolean = false;
  isShowCSS: boolean = false;
  roleId: any;
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

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.ltcID = this.ltcID;
    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {}
    );
  }
  close(AddNewRecord: NgForm) {
    this.drawerClose();
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
  }

  classLoader: boolean = false;
  getClasses(event: any) {
    this.data.TRAVEL_MODE_ID = event;
    this.data.TRAVEL_CLASS_ID = 0;
    if (
      this.data.TRAVEL_MODE_ID != undefined &&
      this.data.TRAVEL_MODE_ID != null &&
      this.data.TRAVEL_MODE_ID != ''
    )
      this.classLoader = true;
    this.api
      .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID=' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.classdata = data['data'];
            this.classLoader = false;
          } else {
            this.classLoader = false;
            this.classdata = [];
          }
        },
        (err) => {}
      );
  }
  resetDrawer(AddNewRecord: NgForm) {
    this.data = new Journeydetails();

    AddNewRecord.form.markAsPristine();
    AddNewRecord.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  disabledEndDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.data.FROM_DATETIME)) < 0;

  leaveEndDate() {
    this.disabledEndDate = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date(this.data.FROM_DATETIME)) < 0;
  }
  disabledStartDate = (current: Date): boolean =>
    differenceInCalendarDays(current, new Date(this.data.TO_DATETIME)) > 0;

  leaveStartDate() {
    this.disabledStartDate = (current: Date): boolean =>
      differenceInCalendarDays(current, new Date(this.data.TO_DATETIME)) > 0;
  }

  save(addNew: boolean, AddNewRecord: NgForm): void {
    if (
      this.data.FAIR_PAID != null ||
      this.data.FAIR_PAID != undefined ||
      this.data.FAIR_PAID != ''
    ) {
      this.data.FAIR_PAID = Number(this.data.FAIR_PAID);
    } else {
    }
    if (
      this.data.JOURNEY_CLAIMED_AMOUNT != null ||
      this.data.JOURNEY_CLAIMED_AMOUNT != undefined
    ) {
      this.data.JOURNEY_CLAIMED_AMOUNT = Number(
        this.data.JOURNEY_CLAIMED_AMOUNT
      );
    } else {
    }
    this.isSpinning = true;
    this.isOk = true;
    this.data.LTC_ID = this.ltcID;
    this.data.EMP_ID = this.empID;
    if (
      this.data.FAIR_PAID == undefined &&
      this.data.NO_OF_FAIRS == undefined &&
      this.data.TRAVEL_MODE_ID == 0 &&
      this.data.TRAVEL_CLASS_ID == 0 &&
      this.data.FROM_DATETIME == undefined &&
      this.data.DEPARTURE_FROM == undefined &&
      this.data.FROM_DATETIME == undefined &&
      this.data.ARRIVAL_TO == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.FROM_DATETIME == null ||
      this.data.FROM_DATETIME == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select From Date.', '');
    } else if (
      this.data.DEPARTURE_FROM == null ||
      this.data.DEPARTURE_FROM == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Departure Form.', '');
    } else if (this.data.TO_DATETIME == null || this.data.TO_DATETIME == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select To Date', '');
    } else if (this.data.ARRIVAL_TO == null || this.data.ARRIVAL_TO == '') {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Arrival to.', '');
    } else if (
      this.data.TRAVEL_MODE_ID == null ||
      this.data.TRAVEL_MODE_ID <= 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Travel Mode', '');
    } else if (
      this.data.TRAVEL_CLASS_ID == null ||
      this.data.TRAVEL_CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Class of Mode.', '');
    } else if (this.data.NO_OF_FAIRS == null || this.data.NO_OF_FAIRS <= 0) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter No of Fairs.', '');
    } else if (
      this.data.JOURNEY_CLAIMED_AMOUNT == null ||
      this.data.JOURNEY_CLAIMED_AMOUNT == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Fare Paid claimed.', '');
    } else if (
      this.data.FAIR_PAID == null ||
      this.data.FAIR_PAID == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Fare Paid Admisible.', '');
    } else if (this.data.FAIR_PAID > this.data.JOURNEY_CLAIMED_AMOUNT) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Fare Paid claimed',
        ''
      );
    }

    if (this.isOk) {
      if (this.data.TO_DATETIME == undefined) {
        this.data.TO_DATETIME = null;
      } else {
        this.data.TO_DATETIME = this.datePipe.transform(
          this.data.TO_DATETIME,
          'yyyy-MM-dd HH:mm'
        );
      }
      if (this.data.FROM_DATETIME == undefined) {
        this.data.FROM_DATETIME = null;
      } else {
        this.data.FROM_DATETIME = this.datePipe.transform(
          this.data.FROM_DATETIME,
          'yyyy-MM-dd HH:mm'
        );
      }

      {
        if (this.data.ID) {
          this.api
            .ltcJourneyDetailUpdate(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Changed Successfully...', '');

                if (!addNew) {
                  this.drawerClose();
                }
                this.isSpinning = false;
                AddNewRecord.form.reset();
              } else {
                this.message.error('Information Has Not Changed...', '');
                this.isSpinning = false;
              }
            });
        } else {
          this.api
            .ltcJourneyDetailCreate(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');

                if (!addNew) {
                  this.close(AddNewRecord);
                } else {
                  this.data = new Journeydetails();
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

  assignToDate(event) {
    if (event != null || event != undefined) {
      if (
        this.data.TO_DATETIME == undefined ||
        this.data.TO_DATETIME == null ||
        this.data.TO_DATETIME == ''
      ) {
        this.data.TO_DATETIME = event;
      } else {
      }
    } else {
    }
  }

  fileURL1: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  onFileSelected(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
      if (this.fileURL1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TICKET_URL != undefined &&
          this.data.TICKET_URL.trim() != ''
        ) {
          var arr = this.data.TICKET_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.isSpinning = true;
      this.progressBar = true;
      this.timer = this.api
        .onUpload('ltcTicket', this.fileURL1, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBar = false;
            this.percent = 0;
            this.fileURL1 = null;
            this.data.TICKET_URL = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.data.TICKET_URL = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
      this.data.TICKET_URL = null;
    }
  }
  ticketsView(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'ltcTicket/' + pdfURL);
  }
}
