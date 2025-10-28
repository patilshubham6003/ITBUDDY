import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { Journeydetails } from '../../Models/journeydetails';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-detailsjorney',
  templateUrl: './detailsjorney.component.html',
  styleUrls: ['./detailsjorney.component.css'],
})
export class DetailsjorneyComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Journeydetails;
  @Input() empID: any;
  @Input() claimID: any;
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
  roleId: any;
  isShowCSS: boolean = false;
  isAdmin: boolean = false;
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

    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {}
    );
  }
  classLoader: boolean = false;
  travelMode(event) {
    this.data.TRAVEL_MODE_ID = event;

    this.data.TRAVEL_CLASS_ID = 0;
    this.classdata = [];
    if (
      this.data.TRAVEL_MODE_ID != undefined &&
      this.data.TRAVEL_MODE_ID != null &&
      this.data.TRAVEL_MODE_ID != ''
    ) {
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
              this.message.error('Something Went Wrong', '');
            }
          },
          (err) => {}
        );
    } else {
      this.classLoader = false;
      this.classdata = [];
    }
  }
  close(AddNewRecord: NgForm) {
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
    this.drawerClose();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new Journeydetails();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    AddNewRecord.form.markAsPristine();
    AddNewRecord.form.markAsUntouched();
  }

  airTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'airTickets/' + pdfURL);
  }
  boardingPass(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'boardingPass/' + pdfURL);
  }
  boatShipTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'boatShipTickets/' + pdfURL);
  }
  irctcTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'irctcTickets/' + pdfURL);
  }
  roadTickets(pdfURL: string): void {
    // this.view = 2
    // this.printOrderModalVisible = true;
    window.open(this.api.retriveimgUrl + 'roadTickets/' + pdfURL);
  }

  fileURL1: any;
  progressBarairTickets: boolean = false;
  percentairTickets = 0;
  timerairTickets: any;
  onFileSelected(event: any) {
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
          this.data.AIR_TICKET != undefined &&
          this.data.AIR_TICKET.trim() != ''
        ) {
          var arr = this.data.AIR_TICKET.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.progressBarairTickets = true;
      this.timerairTickets = this.api
        .onUpload('airTickets', this.fileURL1, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentairTickets = percentDone;
            if (this.percentairTickets == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarairTickets = false;
            this.percentairTickets = 0;
            this.fileURL1 = null;
            this.data.AIR_TICKET = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.AIR_TICKET = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL1 = null;
      this.data.AIR_TICKET = null;
    }
  }

  fileURL2: any;
  progressBarboardingPass: boolean = false;
  percentboardingPass = 0;
  timerboardingPass: any;
  onFileSelected1(event: any) {
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
          this.data.BOARDING_PASS != undefined &&
          this.data.BOARDING_PASS.trim() != ''
        ) {
          var arr = this.data.BOARDING_PASS.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.progressBarboardingPass = true;
      this.timerboardingPass = this.api
        .onUpload('boardingPass', this.fileURL2, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentboardingPass = percentDone;
            if (this.percentboardingPass == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarboardingPass = false;
            this.percentboardingPass = 0;
            this.fileURL2 = null;
            this.data.BOARDING_PASS = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.BOARDING_PASS = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL2 = null;
      this.data.BOARDING_PASS = null;
    }
  }

  fileURL6: any;
  progressBarroadTickets: boolean = false;
  percentroadTickets = 0;
  timerroadTickets: any;
  onFileSelected2(event: any) {
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
          this.data.ROAD_TICKET != undefined &&
          this.data.ROAD_TICKET.trim() != ''
        ) {
          var arr = this.data.ROAD_TICKET.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.progressBarroadTickets = true;
      this.timerroadTickets = this.api
        .onUpload('roadTickets', this.fileURL2, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentroadTickets = percentDone;
            if (this.percentroadTickets == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarroadTickets = false;
            this.percentroadTickets = 0;
            this.fileURL6 = null;
            this.data.ROAD_TICKET = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.ROAD_TICKET = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL6 = null;
      this.data.ROAD_TICKET = null;
    }
  }

  fileURL3: any;
  progressBarirctcTickets: boolean = false;
  percentirctcTickets = 0;
  timerirctcTickets: any;
  onFileSelected3(event: any) {
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
          this.data.IRCTC_TICKET != undefined &&
          this.data.IRCTC_TICKET.trim() != ''
        ) {
          var arr = this.data.IRCTC_TICKET.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.progressBarirctcTickets = true;
      this.timerirctcTickets = this.api
        .onUpload('irctcTickets', this.fileURL3, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentirctcTickets = percentDone;
            if (this.percentirctcTickets == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarirctcTickets = false;
            this.percentirctcTickets = 0;
            this.fileURL3 = null;
            this.data.IRCTC_TICKET = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.IRCTC_TICKET = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (successCode.code == '200') {
          //   this.data.IRCTC_TICKET = url;
          //   this.message.success('File saved Successfully...', '');
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL3 = null;
      this.data.IRCTC_TICKET = null;
    }
  }

  fileURL4: any;
  progressBarboatShipTickets: boolean = false;
  percentboatShipTickets = 0;
  timerboatShipTickets: any;
  onFileSelected4(event: any) {
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
          this.data.BOAT_SHIP_TICKET != undefined &&
          this.data.BOAT_SHIP_TICKET.trim() != ''
        ) {
          var arr = this.data.BOAT_SHIP_TICKET.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBarboatShipTickets = true;
      this.timerboatShipTickets = this.api
        .onUpload('boatShipTickets', this.fileURL4, url)
        .subscribe((res) => {
          if (res.type === HttpEventType.Response) {
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percentboatShipTickets = percentDone;
            if (this.percentboatShipTickets == 100) {
              this.isSpinning = false;
              // this.message.success('File Uploaded Successfully', '')
            }
          } else if (res.type == 2 && res.status != 200) {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.progressBarboatShipTickets = false;
            this.percentboatShipTickets = 0;
            this.fileURL4 = null;
            this.data.BOAT_SHIP_TICKET = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('File Uploaded Successfully...', '');
              this.data.BOAT_SHIP_TICKET = url;
              this.isSpinning = false;
            } else {
              this.isSpinning = false;
            }
          }

          // if (successCode.code == '200') {
          //   this.data.BOAT_SHIP_TICKET = url;
          //   this.message.success('File saved Successfully...', '');
          //   // this.data.FILE_URL = url;
          //   //
          // } else {
          //   this.message.error('Failed To Save File...', '');
          //   this.isSpinning = false;
          // }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.fileURL4 = null;
      this.data.BOAT_SHIP_TICKET = null;
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, AddNewRecord: NgForm): void {
    this.isSpinning = true;
    this.isOk = true;
    this.data.TRANSFER_ID = this.claimID;
    this.data.EMP_ID = this.empID;
    if (
      this.data.TRANSFER_JOURNEY_CLAIMED_AMOUNT != null ||
      this.data.TRANSFER_JOURNEY_CLAIMED_AMOUNT != undefined
    ) {
      this.data.TRANSFER_JOURNEY_CLAIMED_AMOUNT = Number(
        this.data.TRANSFER_JOURNEY_CLAIMED_AMOUNT
      );
    } else {
    }
    if (
      (this.data.FAIR_PAID != null ||
        this.data.FAIR_PAID != undefined ||
        this.data.FAIR_PAID != '') &&
      this.roleId != 2
    ) {
      this.data.FAIR_PAID = Number(this.data.FAIR_PAID);
    } else {
    }

    if (
      this.data.DISTANCE_BY_ROAD == undefined &&
      this.data.NO_OF_FAIRS == undefined &&
      this.data.TRAVEL_MODE_ID == undefined &&
      this.data.TRAVEL_CLASS_ID == undefined &&
      this.data.DEPARTURE_FROM == undefined &&
      this.data.FROM_DATETIME == undefined &&
      this.data.ARRIVAL_TO == undefined &&
      this.TO_PLACE_NAME == undefined &&
      this.FARE_PAID == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (
      this.data.FROM_DATETIME == null ||
      this.data.FROM_DATETIME == '' ||
      this.data.FROM_DATETIME == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select From Date.', '');
    } else if (
      this.data.DEPARTURE_FROM == null ||
      this.data.DEPARTURE_FROM == '' ||
      this.data.DEPARTURE_FROM == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Enter Journey From.', '');
    } else if (
      this.data.TO_DATETIME == null ||
      this.data.TO_DATETIME == '' ||
      this.data.TO_DATETIME == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(' Please Select To Date', '');
    } else if (
      this.data.ARRIVAL_TO == null ||
      this.data.ARRIVAL_TO == '' ||
      this.data.ARRIVAL_TO == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Journey To', '');
    } else if (
      this.data.TRAVEL_MODE_ID == null ||
      this.data.TRAVEL_MODE_ID <= 0 ||
      this.data.TRAVEL_MODE_ID == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Travel Mode', '');
    } else if (
      this.data.TRAVEL_CLASS_ID == null ||
      this.data.TRAVEL_CLASS_ID == undefined ||
      this.data.TRAVEL_CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Select Class of Mode.', '');
    } else if (
      this.data.NO_OF_FAIRS == null ||
      this.data.NO_OF_FAIRS == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter No. of Fairs.', '');
    } else if (
      (this.data.FAIR_PAID == null || this.data.FAIR_PAID == undefined) &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Fare Paid', '');
    } else if (
      this.data.DISTANCE_BY_ROAD == null ||
      this.data.DISTANCE_BY_ROAD == undefined
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error('Please Enter Distance of Road', '');
      // } else if (
      //   this.data.TRAVEL_MODE_ID == 5 &&
      //   (this.data.AIR_TICKET == null ||
      //     this.data.AIR_TICKET == undefined ||
      //     this.data.AIR_TICKET == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Upload Air Ticket', '');
      // } else if (
      //   this.data.TRAVEL_MODE_ID == 5 &&
      //   (this.data.BOARDING_PASS == null ||
      //     this.data.BOARDING_PASS == undefined ||
      //     this.data.BOARDING_PASS == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Upload Boarding Pass', '');
      // } else if (
      //   this.data.TRAVEL_MODE_ID == 4 &&
      //   (this.data.IRCTC_TICKET == null ||
      //     this.data.IRCTC_TICKET == undefined ||
      //     this.data.IRCTC_TICKET == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Upload IRCTC Ticket', '');
      // } else if (
      //   this.data.TRAVEL_MODE_ID == 6 &&
      //   (this.data.BOAT_SHIP_TICKET == null ||
      //     this.data.BOAT_SHIP_TICKET == undefined ||
      //     this.data.BOAT_SHIP_TICKET == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Upload Boat/Ship Ticket', '');
      // } else if (
      //   this.data.TRAVEL_MODE_ID == 3 &&
      //   (this.data.ROAD_TICKET == null ||
      //     this.data.ROAD_TICKET == undefined ||
      //     this.data.ROAD_TICKET == '')
      // ) {
      //   this.isOk = false;
      // this.isSpinning = false;
      //   this.message.error('Please Upload Road Ticket', '');
    } else if (
      this.roleId != 2 &&
      this.data.TRANSFER_JOURNEY_CLAIMED_AMOUNT < this.data.FAIR_PAID
    ) {
      this.isOk = false;
      this.isSpinning = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Claimed Amount',
        ''
      );
    }

    if (this.isOk) {
      this.data.TRANSFER_ID = this.claimID;
      this.data.EMP_ID = this.empID;
      if (this.data.TO_DATETIME == undefined) {
        this.data.TO_DATETIME = null;
      } else {
        this.data.TO_DATETIME = this.datePipe.transform(
          this.data.TO_DATETIME,
          'yyyy-MM-dd'
        );
      }
      if (this.data.FROM_DATETIME == undefined) {
        this.data.FROM_DATETIME = null;
      } else {
        this.data.FROM_DATETIME = this.datePipe.transform(
          this.data.FROM_DATETIME,
          'yyyy-MM-dd'
        );
      }
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updatejourneydetails(this.data).subscribe((successCode) => {
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
          this.api.createjourneydetails(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.close(AddNewRecord);
              else {
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
  today2 = new Date();
  disabledDate2: any;
  startDateChange(event: any) {
    this.data.FROM_DATETIME = event;
    this.data.TO_DATETIME = null;
    this.disabledDate2 = (current: Date): boolean =>
      differenceInCalendarDays(
        current,

        new Date(this.data.FROM_DATETIME)
      ) < 0;
  }
  disabledFromDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) < 0;

  openFromDatePicker() {
    if (
      this.data.TO_DATETIME == null ||
      this.data.TO_DATETIME == undefined ||
      this.data.TO_DATETIME == ''
    ) {
      this.disabledFromDate = (current: Date): boolean =>
        differenceInCalendarDays(current, this.today2) > 0;
    } else {
      this.disabledFromDate = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.data.TO_DATETIME)) > 0;
    }
  }

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today2) < 0;
  openToDatePicker() {
    if (
      this.data.FROM_DATETIME == null ||
      this.data.FROM_DATETIME == undefined ||
      this.data.FROM_DATETIME == ''
    ) {
      this.disabledToDate = (current: Date): boolean =>
        differenceInCalendarDays(current, this.today2) > 0;
    } else {
      this.disabledToDate = (current: Date): boolean =>
        differenceInCalendarDays(current, new Date(this.data.FROM_DATETIME)) <
        0;
    }
  }
}
