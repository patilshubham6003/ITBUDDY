import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Deatailsandpurposeoftours } from '../../Models/deatailsandpurposetour';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-detailsandpurposetour',
  templateUrl: './detailsandpurposetour.component.html',
  styleUrls: ['./detailsandpurposetour.component.css'],
})
export class DetailsandpurposetourComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() empID: any;
  @Input() tourID: any;
  @Input() data: Deatailsandpurposeoftours;
  @Input() gradpaylevel: any;
  isSpinning = false;
  isOk = true;
  isAdmin: boolean = false;
  isShowCSS: boolean = false;
  modedata: any[] = [];
  @Input() classdata: any[] = [];
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  roleId: any;
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

    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {}
    );

    this.api.gettravelclass(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.classdata = data['data'];
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

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new Deatailsandpurposeoftours();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
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

  changefairpaid(event: any) {
    if (event != null) {
      this.data.FARE_PAID = 0;
      this.data.FARE_PAID = this.data.DISTANCE_IN_KM_FOR_ROAD * event;
    }
  }

  save(addNew: boolean, AddNewRecord: NgForm): void {
    this.isSpinning = true;
    this.isOk = true;
    // this.data.TRANSFER_ID = this.claimID;
    // this.data.EMP_ID = this.empID
    if (
      (this.data.FARE_PAID != null ||
        this.data.FARE_PAID != undefined ||
        this.data.FARE_PAID != '') &&
      this.roleId != 2
    ) {
      this.data.FARE_PAID = Number(this.data.FARE_PAID);
    } else {
    }
    if (
      (this.data.CLAIMED_FARE_PAID != null ||
        this.data.CLAIMED_FARE_PAID != undefined ||
        this.data.CLAIMED_FARE_PAID != '') &&
      this.roleId != 2
    ) {
      this.data.CLAIMED_FARE_PAID = Number(this.data.CLAIMED_FARE_PAID);
    } else {
    }

    if (
      // this.data.DISTANCE_IN_KM_FOR_ROAD == undefined &&

      this.data.TRAVEL_MODE_ID == 0 &&
      this.data.TRAVEL_CLASS_ID == 0 &&
      this.data.DEPARTURE_DATETIME == undefined &&
      this.data.DEPARTURE_FROM == undefined &&
      this.data.ARRIVAL_TO == undefined &&
      this.data.PURPOSE_OF_JOURNEY == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.DEPARTURE_DATETIME == null ||
      this.data.DEPARTURE_DATETIME == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Departure From Date.', '');
    } else if (
      this.data.DEPARTURE_FROM == null ||
      this.data.DEPARTURE_FROM == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Departure Form.', '');
    } else if (
      this.data.ARRIVAL_DATETIME == null ||
      this.data.ARRIVAL_DATETIME == ''
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select Arival Date', '');
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
    }

    // else if (
    //   this.data.PURPOSE_OF_JOURNEY == null ||
    //   this.data.PURPOSE_OF_JOURNEY <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please purpose of Journey.', '');
    // }

    // else if (this.data.DAYS_OF_HALT == null || this.data.DAYS_OF_HALT <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please days of halts.', '');
    // }

    // else if (
    //   this.data.HOURS_OF_HALT == null ||
    //   this.data.HOURS_OF_HALT == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Hours of Halts.', '');
    // }
    else if (
      (this.data.FARE_PAID == undefined || this.data.FARE_PAID == null) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Admissible Amount.', '');
    } else if (
      this.data.CLAIMED_FARE_PAID == undefined ||
      this.data.CLAIMED_FARE_PAID == null
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Fare Paid By The Officer.', '');
    }

    // else if (
    //   this.data.DISTANCE_IN_KM_FOR_ROAD == null ||
    //   this.data.DISTANCE_IN_KM_FOR_ROAD <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Distance in KM for Road.', '');
    // }
    else if (
      this.data.TICKET_FROM == false &&
      this.data.RELAXATION_PROVIDED == false
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Check Is Ticket From IRCTC, Ashoka Tour & Travels and Balmer & Lawrie Or Is Relaxation Provided .',
        ''
      );
    } else if (
      this.roleId != 2 &&
      this.data.CLAIMED_FARE_PAID < this.data.FARE_PAID
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Fare Paid By The Officer',
        ''
      );
    }

    if (this.isOk) {
      this.data.TOUR_ID = this.tourID;
      this.data.EMP_ID = this.empID;

      if (this.data.TRAVEL_MODE_ID == 3) {
        this.data.TOUR_BOATSHIP_TICKET = null;
        this.data.TOUR_AIR_TICKET = null;
        this.data.TOUR_BOARDING_PASS = null;
        this.data.TOUR_IRCTC_ROAD_TICKETS = null;
      } else if (this.data.TRAVEL_MODE_ID == 4) {
        this.data.TOUR_BOATSHIP_TICKET = null;
        this.data.TOUR_ROAD_TICKETS = null;
        this.data.TOUR_AIR_TICKET = null;
        this.data.TOUR_BOARDING_PASS = null;
      } else if (this.data.TRAVEL_MODE_ID == 5) {
        this.data.TOUR_IRCTC_ROAD_TICKETS = null;
        this.data.TOUR_BOATSHIP_TICKET = null;
        this.data.TOUR_ROAD_TICKETS = null;
      } else if (this.data.TRAVEL_MODE_ID == 6) {
        this.data.TOUR_IRCTC_ROAD_TICKETS = null;
        this.data.TOUR_ROAD_TICKETS = null;
        this.data.TOUR_AIR_TICKET = null;
        this.data.TOUR_BOARDING_PASS = null;
      } else {
      }

      if (this.data.ARRIVAL_DATETIME == undefined) {
        this.data.ARRIVAL_DATETIME = null;
      } else {
        this.data.ARRIVAL_DATETIME = this.datePipe.transform(
          this.data.ARRIVAL_DATETIME,
          'yyyy-MM-dd HH:mm'
        );
      }
      if (this.data.DEPARTURE_DATETIME == undefined) {
        this.data.DEPARTURE_DATETIME = null;
      } else {
        this.data.DEPARTURE_DATETIME = this.datePipe.transform(
          this.data.DEPARTURE_DATETIME,
          'yyyy-MM-dd HH:mm'
        );
      }

      {
        if (this.data.ID) {
          this.api
            .updatedeatilssofpurpose(this.data)
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
            .createdeatilssofpurpose(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) this.close(AddNewRecord);
                else {
                  this.data = new Deatailsandpurposeoftours();
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

  classLoader: boolean = false;
  getclassmode(event: any) {
    this.classLoader = true;
    this.classdata = [];
    this.data.TRAVEL_CLASS_ID = null;
    if (
      this.data.TRAVEL_MODE_ID != undefined &&
      this.data.TRAVEL_MODE_ID != null &&
      this.data.TRAVEL_MODE_ID != ''
    ) {
      this.api
        .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID = ' + event)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.classdata = data['data'];
              this.classLoader = false;
              // this.classdata1 = data['data'];
            } else {
              this.classLoader = false;
              this.classdata = [];
            }
          },
          (err) => {}
        );
    } else {
      this.classLoader = false;
      this.classdata = [];
    }
  }
  expoDiffDays: any;
  try(event) {
    //
    //
    event = this.datePipe.transform(event, 'yyyy-MM-dd');
    //
    if (
      this.data.ARRIVAL_DATETIME != null ||
      this.data.ARRIVAL_DATETIME != undefined ||
      this.data.ARRIVAL_DATETIME != ''
    ) {
      // var date2: any = new Date(this.data.ARRIVAL_DATETIME);
      var date2: any = this.datePipe.transform(
        this.data.ARRIVAL_DATETIME,
        'yyyy-MM-dd'
      );
      this.expoDiffDays = Math.floor((date2 - event) / (1000 * 60 * 60 * 24));
    } else {
    }
    // var date1: any = new Date(
    //   Math.max.apply(
    //     null,
    //     this.data3.CGHS_AMA_REFERENCE_DATE.map(function (e) {
    //
    //       return new Date(e);
    //     })
    //   )
    // );
    //
    //
    // var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    // //

    // this.expoDiffDays = Math.floor(
    //   (date2 - this.date1) / (1000 * 60 * 60 * 24)
    // );
  }

  try1(event) {
    //
    //
    event = this.datePipe.transform(event, 'yyyy-MM-dd');
    //
    if (
      this.data.DEPARTURE_DATETIME != null ||
      this.data.DEPARTURE_DATETIME != undefined ||
      this.data.DEPARTURE_DATETIME != ''
    ) {
      // var date2: any = new Date(this.data.DEPARTURE_DATETIME);
      var date2: any = this.datePipe.transform(
        this.data.DEPARTURE_DATETIME,
        'yyyy-MM-dd'
      );
      this.expoDiffDays = Math.floor((date2 - event) / (1000 * 60 * 60 * 24));
    } else {
    }
    // var date1: any = new Date(
    //   Math.max.apply(
    //     null,
    //     this.data3.CGHS_AMA_REFERENCE_DATE.map(function (e) {
    //
    //       return new Date(e);
    //     })
    //   )
    // );
    //
    //
    // var date2: any = new Date(this.data2.BILL_FILIING_DATE);
    // //

    // this.expoDiffDays = Math.floor(
    //   (date2 - this.date1) / (1000 * 60 * 60 * 24)
    // );
  }

  days(event) {
    var date1 = new Date(event);
    var date2 = new Date('07/30/2019');
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  }

  dateDifference(event) {
    var date1: any = new Date(event);
    event = this.datePipe.transform(event, 'yyyy-MM-dd');
    if (
      this.data.ARRIVAL_DATETIME != undefined ||
      this.data.ARRIVAL_DATETIME != null
    ) {
      let time1 = new Date(event).getTime();
      let time2 = new Date(this.data.ARRIVAL_DATETIME).getTime();
      this.data.ARRIVAL_DATETIME = this.datePipe.transform(
        this.data.ARRIVAL_DATETIME,
        'yyyy-MM-dd HH:mm'
      );
      var date2: any = new Date(this.data.ARRIVAL_DATETIME);
      this.data.DAYS_OF_HALT = Math.ceil(
        Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)
      );
      let time = time2 - time1; //msec
      var timeDiff = time / (1000 / 60 / 60);
    } else {
    }

    // event = this.datePipe.transform(event, 'yyyy-MM-dd');

    // this.data.DEPARTURE_FROM = this.datePipe.transform(

    //   this.data.DEPARTURE_FROM,

    //   'yyyy-MM-dd'

    // );

    // var diffDays: any = Math.ceil(

    //   Math.abs(event - this.data.DEPARTURE_FROM) / (1000 * 60 * 60 * 24)

    // );

    //

    // return diffDays;
  }

  dateDifference1(event) {
    var date1: any = new Date(event);
    event = this.datePipe.transform(event, 'yyyy-MM-dd');
    if (
      this.data.DEPARTURE_DATETIME != undefined ||
      this.data.DEPARTURE_DATETIME != null
    ) {
      let time1 = new Date(event).getTime();
      let time2 = new Date(this.data.DEPARTURE_DATETIME).getTime();
      this.data.DEPARTURE_DATETIME = this.datePipe.transform(
        this.data.DEPARTURE_DATETIME,
        'yyyy-MM-dd HH:mm'
      );
      var date2: any = new Date(this.data.DEPARTURE_DATETIME);
      this.data.DAYS_OF_HALT = Math.ceil(
        Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)
      );
      let time = time2 - time1; //msec
      var timeDiff2 = time / (1000 / 60 / 60);
    } else {
    }

    // event = this.datePipe.transform(event, 'yyyy-MM-dd');

    // this.data.DEPARTURE_FROM = this.datePipe.transform(

    //   this.data.DEPARTURE_FROM,

    //   'yyyy-MM-dd'

    // );

    // var diffDays: any = Math.ceil(

    //   Math.abs(event - this.data.DEPARTURE_FROM) / (1000 * 60 * 60 * 24)

    // );

    //

    // return diffDays;
  }

  fileURL1: any;
  progressBartourAirTicket: boolean = false;
  percenttourAirTicket = 0;
  timertourAirTicket: any;
  onAirTicketFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
      if (this.fileURL1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_AIR_TICKET != undefined &&
          this.data.TOUR_AIR_TICKET.trim() != ''
        ) {
          var arr = this.data.TOUR_AIR_TICKET.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBartourAirTicket = true;
      this.timertourAirTicket = this.api
        .onUpload('tourAirTicket', this.fileURL1, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourAirTicket = percentDone;
            if (this.percenttourAirTicket == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourAirTicket = false;
            this.percenttourAirTicket = 0;
            this.fileURL1 = null;
            this.data.TOUR_AIR_TICKET = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              // this.message.success('I-Card Uploaded Successfully...', '');
              this.data.TOUR_AIR_TICKET = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
      this.data.TOUR_AIR_TICKET = null;
    }
  }

  fileURL2: any;
  progressBartourBoardingPass: boolean = false;
  percenttourBoardingPass = 0;
  timertourBoardingPass: any;
  onBordingPassFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL2 = <File>event.target.files[0];

      if (this.fileURL2 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_BOARDING_PASS != undefined &&
          this.data.TOUR_BOARDING_PASS.trim() != ''
        ) {
          var arr = this.data.TOUR_BOARDING_PASS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBartourBoardingPass = true;
      this.timertourBoardingPass = this.api
        .onUpload('tourBoardingPass', this.fileURL2, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourBoardingPass = percentDone;
            if (this.percenttourBoardingPass == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourBoardingPass = false;
            this.percenttourBoardingPass = 0;
            this.fileURL2 = null;
            this.data.TOUR_BOARDING_PASS = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.TOUR_BOARDING_PASS = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (successCode.code == '200') {
          //   this.data.TOUR_BOARDING_PASS = url;
          //   this.message.success('File saved Successfully...', '');
          //   this.isSpinning = false;
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL2 = null;
      this.data.TOUR_BOARDING_PASS = null;
    }
  }

  fileURL6: any;
  progressBartourRoadTickets: boolean = false;
  percenttourRoadTickets = 0;
  timertourRoadTickets: any;
  onTicketFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL6 = <File>event.target.files[0];
      if (this.fileURL6 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL6.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_ROAD_TICKETS != undefined &&
          this.data.TOUR_ROAD_TICKETS.trim() != ''
        ) {
          var arr = this.data.TOUR_ROAD_TICKETS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBartourRoadTickets = true;
      this.timertourRoadTickets = this.api
        .onUpload('tourRoadTickets', this.fileURL6, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourRoadTickets = percentDone;
            if (this.percenttourRoadTickets == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourRoadTickets = false;
            this.percenttourRoadTickets = 0;
            this.fileURL6 = null;
            this.data.TOUR_ROAD_TICKETS = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.TOUR_ROAD_TICKETS = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL6 = null;
      this.data.TOUR_ROAD_TICKETS = null;
    }
  }

  fileURL3: any;
  progressBartourIrctcRoadTicket: boolean = false;
  percenttourIrctcRoadTicket = 0;
  timertourIrctcRoadTicket: any;
  onRailTicketFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL3 = <File>event.target.files[0];

      if (this.fileURL3 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_IRCTC_ROAD_TICKETS != undefined &&
          this.data.TOUR_IRCTC_ROAD_TICKETS.trim() != ''
        ) {
          var arr = this.data.TOUR_IRCTC_ROAD_TICKETS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBartourIrctcRoadTicket = true;
      this.timertourIrctcRoadTicket = this.api
        .onUpload('tourIrctcRoadTicket', this.fileURL3, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourIrctcRoadTicket = percentDone;
            if (this.percenttourIrctcRoadTicket == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourIrctcRoadTicket = false;
            this.percenttourIrctcRoadTicket = 0;
            this.fileURL3 = null;
            this.data.TOUR_IRCTC_ROAD_TICKETS = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.TOUR_IRCTC_ROAD_TICKETS = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL3 = null;
      this.data.TOUR_IRCTC_ROAD_TICKETS = null;
    }
  }

  fileURL4: any;
  progressBartourBoatShipTicket: boolean = false;
  percenttourBoatShipTicket = 0;
  timertourBoatShipTicket: any;
  onBoatShipFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL4 = <File>event.target.files[0];

      if (this.fileURL4 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL4.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.TOUR_BOATSHIP_TICKET != undefined &&
          this.data.TOUR_BOATSHIP_TICKET.trim() != ''
        ) {
          var arr = this.data.TOUR_BOATSHIP_TICKET.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.isSpinning = true;
      this.progressBartourBoatShipTicket = true;
      this.timertourBoatShipTicket = this.api
        .onUpload('tourBoatShipTicket', this.fileURL4, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percenttourBoatShipTicket = percentDone;
            if (this.percenttourBoatShipTicket == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBartourBoatShipTicket = false;
            this.percenttourBoatShipTicket = 0;
            this.fileURL4 = null;
            this.data.TOUR_BOATSHIP_TICKET = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              // this.message.success('I-Card Uploaded Successfully...', '');
              this.data.TOUR_BOATSHIP_TICKET = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL4 = null;
      this.data.TOUR_BOATSHIP_TICKET = null;
    }
  }

  airTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'tourAirTicket/' + pdfURL);
  }
  boardingPass(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'tourBoardingPass/' + pdfURL);
  }
  boatShipTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'tourBoatShipTicket/' + pdfURL);
  }
  irctcTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'tourIrctcRoadTicket/' + pdfURL);
  }
  roadTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'tourRoadTickets/' + pdfURL);
  }
}
