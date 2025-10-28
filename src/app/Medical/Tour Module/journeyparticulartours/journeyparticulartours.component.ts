import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Joureyofparticulartours } from '../../Models/journeyofparticulartours';

@Component({
  selector: 'app-journeyparticulartours',
  templateUrl: './journeyparticulartours.component.html',
  styleUrls: ['./journeyparticulartours.component.css'],
})
export class JourneyparticulartoursComponent implements OnInit {
  modedata: any[] = [];
  classdata: any[] = [];
  classdata1: any[] = [];
  classdatatravelled: any[] = [];
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Joureyofparticulartours;
  @Input() empID: any;
  @Input() tourID: any;
  @Input() gradpaylevel: any;
  isAdmin: boolean = false;
  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datePipe: DatePipe
  ) {}
  isSpinning = false;
  isOk = true;
  roleId: any;
  isShowCSS: boolean = false;
  ngOnInit(): void {
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
    this.api.gettravelmode(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.modedata = data['data'];
        }
      },
      (err) => {}
    );

    if (this.data.ID) {
      this.classdata = [];
      this.classdata1 = [];
      if (this.data.TRAVEL_MODE_ID) {
        this.api
          .gettravelclass(
            0,
            0,
            '',
            '',
            ' AND STATUS=1 AND MODE_ID = ' + this.data.TRAVEL_MODE_ID
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.classdata = data['data'];
                this.classdata1 = data['data'];
              }
            },
            (err) => {}
          );
      } else {
      }
    } else {
    }
  }

  classLoader: boolean = false;
  getclassmode(event: any) {
    this.data.ENTITLED_CLASS_ID = null;
    this.data.TRAVELLED_CLASS_ID = null;
    // this.data.TRAVEL_MODE_ID = event;
    if (
      this.data.TRAVEL_MODE_ID != undefined &&
      this.data.TRAVEL_MODE_ID != null &&
      this.data.TRAVEL_MODE_ID != ''
    ) {
      this.classLoader = true;
      this.classdata = [];
      this.classdata1 = [];
      this.api
        .gettravelclass(0, 0, '', '', ' AND STATUS=1 AND MODE_ID = ' + event)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.classdata = data['data'];
              this.classdata1 = data['data'];
              this.classLoader = false;
            } else {
              this.classLoader = false;
            }
          },
          (err) => {}
        );
    } else {
    }
  }
  close(AddNewRecord: NgForm) {
    this.drawerClose();
    this.resetDrawer(AddNewRecord);
    AddNewRecord.form.reset();
  }

  resetDrawer(AddNewRecord: NgForm) {
    this.data = new Joureyofparticulartours();
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
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  // save(addNew: boolean, AddNewRecord: NgForm): void {
  //   this.isSpinning = false;
  //   this.isOk = true;
  //   this.data.TOUR_ID = this.tourID;
  //   this.data.EMP_ID = this.empID;
  //   if (
  //     this.data.DATE == undefined &&
  //     this.data.PERIOD_FROM == undefined &&
  //     this.data.TRAVEL_MODE_ID == 0 &&
  //     this.data.TRAVELLED_CLASS_ID == 0 &&
  //     this.data.ENTITLED_CLASS_ID == 0 &&
  //     this.data.FARE_OF_ENTITLED_CLASS == undefined &&
  //     this.data.PERIOD_TO == undefined &&
  //     this.data.PLACE_TO == undefined &&
  //     this.data.PLACE_FROM == undefined
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Fill All The Required Fields ', '');
  //   } else if (this.data.DATE == null || this.data.DATE == '') {
  //     this.isOk = false;
  //     this.message.error('Please Select Date.', '');
  //   } else if (
  //     this.data.TRAVEL_MODE_ID == null ||
  //     this.data.TRAVEL_MODE_ID <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Travel Mode Name.', '');
  //   } else if (this.data.PERIOD_FROM == null || this.data.PERIOD_FROM == '') {
  //     this.isOk = false;
  //     this.message.error(' Please Select Period From Date.', '');
  //   } else if (this.data.PERIOD_TO == null || this.data.PERIOD_TO == '') {
  //     this.isOk = false;
  //     this.message.error(' Please Select Period To Date.', '');
  //   } else if (this.data.PLACE_FROM == null || this.data.PLACE_FROM == '') {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Place From.', '');
  //   } else if (this.data.PLACE_TO == null || this.data.PLACE_TO == '') {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Place To.', '');
  //   } else if (
  //     this.data.ENTITLED_CLASS_ID == null ||
  //     this.data.ENTITLED_CLASS_ID <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Class To Which Entitled.', '');
  //   } else if (
  //     this.data.TRAVELLED_CLASS_ID == null ||
  //     this.data.TRAVELLED_CLASS_ID <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Select Class By Which Travelled.', '');
  //   } else if (
  //     this.data.FARE_OF_ENTITLED_CLASS == undefined ||
  //     this.data.FARE_OF_ENTITLED_CLASS == null ||
  //     this.data.FARE_OF_ENTITLED_CLASS == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Admissible Amount.', '');
  //   } else if (
  //     this.data.FARE_PAID_BY_OFFICER == undefined ||
  //     this.data.FARE_PAID_BY_OFFICER == null ||
  //     this.data.FARE_PAID_BY_OFFICER == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Fare Paid By The Officer.', '');
  //   }

  //   if (this.isOk) {
  //     // this.data.TRANSFER_ID = this.tourID;
  //     // this.data.EMP_ID = this.empID;
  //     if (this.data.DATE == undefined) {
  //       this.data.DATE = null;
  //     } else {
  //       this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
  //     }
  //     if (this.data.PERIOD_FROM == undefined) {
  //       this.data.PERIOD_FROM = null;
  //     } else {
  //       this.data.PERIOD_FROM = this.datePipe.transform(
  //         this.data.PERIOD_FROM,
  //         'yyyy-MM-dd HH:mm'
  //       );
  //     }
  //     if (this.data.PERIOD_TO == undefined) {
  //       this.data.PERIOD_TO = null;
  //     } else {
  //       this.data.PERIOD_TO = this.datePipe.transform(
  //         this.data.PERIOD_TO,
  //         'yyyy-MM-dd HH:mm'
  //       );
  //     }
  //     this.isSpinning = true;
  //     {
  //       if (this.data.ID) {
  //         this.api
  //           .updatejourneyofparticulartours(this.data)
  //           .subscribe((successCode) => {
  //             if (successCode.code == '200') {
  //               this.message.success('Information Changed Successfully...', '');
  //               if (!addNew) this.drawerClose();
  //               this.isSpinning = false;
  //               AddNewRecord.form.reset();
  //               // this.search()
  //             } else {
  //               this.message.error('Information Has Not Changed...', '');
  //               this.isSpinning = false;
  //             }
  //           });
  //       } else {
  //         this.api
  //           .createjourneyofparticulartours(this.data)
  //           .subscribe((successCode) => {
  //             if (successCode.code == '200') {
  //               this.message.success('Information Save Successfully...', '');
  //               if (!addNew) this.close(AddNewRecord);
  //               else {
  //                 this.data = new Joureyofparticulartours();
  //                 this.resetDrawer(AddNewRecord);
  //               }
  //               this.isSpinning = false;
  //             } else {
  //               this.message.error('Failed To Fill Information...', '');
  //               this.isSpinning = false;
  //             }
  //           });
  //       }
  //     }
  //   }
  // }

  save(addNew: boolean, AddNewRecord: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (
      this.data.FARE_OF_ENTITLED_CLASS != null ||
      this.data.FARE_OF_ENTITLED_CLASS != undefined ||
      this.data.FARE_OF_ENTITLED_CLASS != ''
    ) {
      this.data.FARE_OF_ENTITLED_CLASS = Number(
        this.data.FARE_OF_ENTITLED_CLASS
      );
    } else {
    }
    if (
      (this.data.FARE_PAID_BY_OFFICER != null ||
        this.data.FARE_PAID_BY_OFFICER != undefined ||
        this.data.FARE_PAID_BY_OFFICER != '') &&
      this.roleId != 2
    ) {
      this.data.FARE_PAID_BY_OFFICER = Number(this.data.FARE_PAID_BY_OFFICER);
    } else {
    }
    this.data.TOUR_ID = this.tourID;
    this.data.EMP_ID = this.empID;
    if (
      this.data.DATE == undefined &&
      this.data.PERIOD_FROM == undefined &&
      this.data.TRAVEL_MODE_ID == 0 &&
      this.data.TRAVELLED_CLASS_ID == 0 &&
      this.data.ENTITLED_CLASS_ID == 0 &&
      this.data.FARE_OF_ENTITLED_CLASS == undefined &&
      this.data.PERIOD_TO == undefined &&
      this.data.PLACE_TO == undefined &&
      this.data.PLACE_FROM == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.DATE == null || this.data.DATE == '') {
      this.isOk = false;
      this.message.error('Please Select Date.', '');
    } else if (
      this.data.TRAVEL_MODE_ID == null ||
      this.data.TRAVEL_MODE_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Travel Mode Name.', '');
    } else if (this.data.PERIOD_FROM == null || this.data.PERIOD_FROM == '') {
      this.isOk = false;
      this.message.error(' Please Select Period From Date.', '');
    } else if (this.data.PERIOD_TO == null || this.data.PERIOD_TO == '') {
      this.isOk = false;
      this.message.error(' Please Select Period To Date.', '');
    } else if (this.data.PLACE_FROM == null || this.data.PLACE_FROM == '') {
      this.isOk = false;
      this.message.error(' Please Enter Place From.', '');
    } else if (this.data.PLACE_TO == null || this.data.PLACE_TO == '') {
      this.isOk = false;
      this.message.error(' Please Enter Place To.', '');
    } else if (
      this.data.ENTITLED_CLASS_ID == null ||
      this.data.ENTITLED_CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Class To Which Entitled.', '');
    } else if (
      this.data.TRAVELLED_CLASS_ID == null ||
      this.data.TRAVELLED_CLASS_ID <= 0
    ) {
      this.isOk = false;
      this.message.error(' Please Select Class By Which Travelled.', '');
    } else if (
      (this.data.FARE_OF_ENTITLED_CLASS === undefined ||
        this.data.FARE_OF_ENTITLED_CLASS === null ||
        this.data.FARE_OF_ENTITLED_CLASS === '') &&
      this.roleId != 2
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Admissible Amount.', '');
    } else if (
      this.data.FARE_PAID_BY_OFFICER === undefined ||
      this.data.FARE_PAID_BY_OFFICER === null ||
      this.data.FARE_PAID_BY_OFFICER === ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Fare Paid By The Officer.', '');
    } else if (
      this.roleId != 2 &&
      this.data.FARE_PAID_BY_OFFICER < this.data.FARE_OF_ENTITLED_CLASS
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Fare Paid Admisible Amount Which is Less than Fare Paid By The Officer',
        ''
      );
    }

    if (this.isOk) {
      // this.data.TRANSFER_ID = this.tourID;
      // this.data.EMP_ID = this.empID;
      if (this.data.DATE == undefined) {
        this.data.DATE = null;
      } else {
        this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      }
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
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api
            .updatejourneyofparticulartours(this.data)
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
            .createjourneyofparticulartours(this.data)
            .subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success('Information Save Successfully...', '');
                if (!addNew) this.close(AddNewRecord);
                else {
                  this.data = new Joureyofparticulartours();
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
}
