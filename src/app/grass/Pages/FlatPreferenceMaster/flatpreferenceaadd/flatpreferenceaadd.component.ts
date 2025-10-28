import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { FlatPreferenceadd } from 'src/app/grass/Models/FlatPreferenceadd';
import { SeniorityListUsershow } from 'src/app/grass/Models/SeniorityListUsershow';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Flatpreference } from 'src/app/grass/Models/Flatpreference';
import { Observable, retry } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { senioritypass } from 'src/app/grass/Models/SeniorityDatapass';

@Component({
  selector: 'app-flatpreferenceaadd',
  templateUrl: './flatpreferenceaadd.component.html',
  styleUrls: ['./flatpreferenceaadd.component.css'],
  providers: [DatePipe],
})
export class FlatpreferenceaaddComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() seniortiylistdata!: senioritypass;
  @Input() empDATA!: AllotmentMaster;
  isSpinning = false;
  loadingRecords = false;
  arrray: any = [];
  CityList: any = [];
  AreaList: any = [];
  BlockList: any = [];
  BuildingList: any = [];
  FloorList: any = [];
  FlatList: any = [];
  preferenceSpinning = false;
  userid: any;
  roleid: any;
  arrayofflat: any = [];
  arrayofflatoff = true;
  arrayofflatdis = false;
  submitprefspin = false;
  submittrue = true;
  CITY_ID: any;
  AREA_ID: any;
  BLOCK_ID: any;
  BUILDING_ID: any;
  FLOOR_ID: any;
  FLAT_ID: any;
  flatlists: any = [];
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private modal: NzModalService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.userid = Number(sessionStorage.getItem('userId'));
    this.roleid = Number(sessionStorage.getItem('roleId'));
    if (this.seniortiylistdata) {
      this.isSpinning = true;
      this.api
        .getQuarterMaster(
          0,
          0,
          'ID',
          'desc',
          " AND AVAILABLE_STATUS = 'A' AND IS_PUBLISHED=1 AND RESIDENCE_TYPE_ID = " +
          this.seniortiylistdata.RESIDENCE_TYPE
        )
        .subscribe(
          (data) => {
            this.flatlists = data['data'];

            if (this.empDATA) {
              this.loadingRecords = true;
              this.api
                .getFlatPreference(
                  0,
                  0,
                  'PREFERNCE_NO',
                  'asc',
                  ' AND EMPLOYEE_ID = ' +
                  this.empDATA.EMPLOYEE_ID +
                  ' AND FLAT_REQUEST_ID = ' +
                  this.empDATA.ID +
                  ' AND TYPE = ' +
                  this.seniortiylistdata.RESIDENCE_TYPE
                )
                .subscribe(
                  (data) => {
                    this.arrayofflat = data['data'];
                    this.isSpinning = false;
                    if (this.arrayofflat.length > 0) {
                      this.arrayofflatoff = false;
                      this.arrayofflatdis = true;
                    } else {
                      this.arrayofflatoff = true;
                      this.arrayofflatdis = false;
                    }

                    this.arrayofflat.forEach((valu) => {
                      if (valu['IS_SUBMITTED'] == 'S') {
                        this.submittrue = false;
                      } else {
                        this.submittrue = true;
                      }
                    });
                    this.loadingRecords = false;
                  },
                  (error) => { }
                );
            }
          },
          (err) => { }
        );
    }

    // this.getcitymaster();
  }

  onDrop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.arrayofflat,
        event.previousIndex,
        event.currentIndex
      );
    }
    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['ID'] = i + 1;
      this.arrayofflat[i]['PREFERNCE_NO'] = i + 1;
    }
    this.arrayofflat = [...this.arrayofflat];
  }

  changeintable: any[] = [];
  Addtonexttable(data: any) {
    if (this.arrayofflat.length <= 5) {
      if (this.arrayofflat.length <= 0) {
        this.arrayofflat = [
          ...this.arrayofflat,
          {
            ID: this.arrayofflat.length + 1,
            CITY_ID: data.CITY_ID,
            CITY_NAME: data.CITY_NAME,
            AREA_ID: data.AREA_ID,
            AREA_NAME: data.AREA_NAME,
            BLOCK_ID: data.BLOCK_ID,
            BLOCK_NAME: data.BLOCK_NAME,
            BUILDING_ID: data.BUILDING_ID,
            BUILDING_NAME: data.BUILDING_NAME,
            FLOOR_ID: data.FLOOR_ID,
            FLOOR_NAME: data.FLOOR_NAME,
            FLAT_ID: data.ID,
            FLAT_NAME: data.NAME,
            NO_OF_FLATS: data.NO_OF_FLATS,
            PREFERNCE_NO: this.arrayofflat.length + 1,
            CLIENT_ID: 1,
            IS_SUBMITTED: 'D',
          },
        ];
      } else {
        let hasvalue = this.arrayofflat.find((value) => {
          return data.ID == value.FLAT_ID;
        });
        if (hasvalue != undefined) {
          this.message.error('Quarter Already Exists, Please Add Other Quarter', '');
        } else {
          this.arrayofflat = [
            ...this.arrayofflat,
            {
              ID: this.arrayofflat.length + 1,
              CITY_ID: data.CITY_ID,
              CITY_NAME: data.CITY_NAME,
              AREA_ID: data.AREA_ID,
              AREA_NAME: data.AREA_NAME,
              BLOCK_ID: data.BLOCK_ID,
              BLOCK_NAME: data.BLOCK_NAME,
              BUILDING_ID: data.BUILDING_ID,
              BUILDING_NAME: data.BUILDING_NAME,
              FLOOR_ID: data.FLOOR_ID,
              FLOOR_NAME: data.FLOOR_NAME,
              FLAT_ID: data.ID,
              FLAT_NAME: data.NAME,
              NO_OF_FLATS: data.NO_OF_FLATS,
              PREFERNCE_NO: this.arrayofflat.length + 1,
              CLIENT_ID: 1,
              IS_SUBMITTED: 'D',
            },
          ];
        }
      }
    } else {
      this.message.error('Maximum 5 Quarter Preferences Are allowed.', '');
    }
  }

  removefromtable(data: any) {
    this.arrayofflat = this.arrayofflat.filter((d) => d['ID'] !== data.ID);

    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['ID'] = i + 1;
      this.arrayofflat[i]['PREFERNCE_NO'] = i + 1;
    }
  }

  // getcitymaster() {
  //   this.isSpinning = true;
  //   this.api.getCityMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
  //     (data) => {
  //       if (data['code'] == 200) {
  //         this.CityList = data['data'];
  //         this.isSpinning = false;
  //       }
  //     },
  //     (err) => {
  //
  //     }
  //   );
  // }

  // changecity(event: any) {
  //   this.AREA_ID = null;
  //   this.BLOCK_ID = null;
  //   this.BUILDING_ID = null;
  //   this.FLOOR_ID = null;
  //   this.FLAT_ID = null;
  //   this.AreaList = [];
  //   this.BlockList = [];
  //   this.BuildingList = [];
  //   this.FloorList = [];
  //   this.FlatList = [];
  //   this.api
  //     .getareamaster(0, 0, '', '', ' AND STATUS = 1 AND CITY_ID = ' + event)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.AreaList = data['data'];
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }
  // changearea(event: any) {
  //   this.BLOCK_ID = null;
  //   this.BUILDING_ID = null;
  //   this.FLOOR_ID = null;
  //   this.FLAT_ID = null;
  //   this.BlockList = [];
  //   this.BuildingList = [];
  //   this.FloorList = [];
  //   this.FlatList = [];
  //   this.api
  //     .getBlockmaster(0, 0, '', '', ' AND STATUS = 1 AND AREA_ID = ' + event)
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.BlockList = data['data'];
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

  // changeblock(event: any) {
  //   this.BUILDING_ID = null;
  //   this.FLOOR_ID = null;
  //   this.FLAT_ID = null;
  //   this.BuildingList = [];
  //   this.FloorList = [];
  //   this.FlatList = [];
  //   this.api
  //     .getBuildingMaster(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ' AND STATUS = 1 AND BLOCK_ID = ' + event
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.BuildingList = data['data'];
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }
  // changeBuilding(event: any) {
  //   this.FLOOR_ID = null;
  //   this.FLAT_ID = null;
  //   this.FloorList = [];
  //   this.FlatList = [];

  //   this.api
  //     .getFloorMaster(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ' AND STATUS = 1 AND BUILDING_ID = ' + event
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.FloorList = data['data'];
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }
  // changeFloor(event: any) {
  //   this.FLAT_ID = null;
  //   this.FlatList = [];
  //   this.api
  //     .getQuarterMaster(
  //       0,
  //       0,
  //       '',
  //       '',
  //       ' AND AVAILABLE_STATUS = ' +
  //       '"A"' +
  //       ' AND STATUS = 1  AND RESIDENCE_TYPE_ID = ' +
  //       this.seniortiylistdata.RESIDENCE_TYPE +
  //       ' AND FLOOR_ID = ' +
  //       event
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.FlatList = data['data'];
  //           if (this.FlatList.length <= 0) {
  //             this.message.info(
  //               'Sorry, No Quarters Available With Residence Type " ' +
  //               this.seniortiylistdata.RESIDENCE_TYPE_NAME +
  //               ' "',
  //               ''
  //             );
  //           }
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Addtoflatlist() {
  //   if (
  //     this.CITY_ID == null &&
  //     this.AREA_ID == null &&
  //     this.BLOCK_ID == null &&
  //     this.BUILDING_ID == null &&
  //     this.FLOOR_ID == null &&
  //     this.FLAT_ID == null
  //   ) {
  //     this.message.error('Please Enter All The Fields Required', '');
  //   }
  //   else if (this.CITY_ID == null || this.CITY_ID == undefined || this.CITY_ID == '') {
  //     this.message.error('Please Select City Name', '');
  //   }
  //   else if (this.AREA_ID == null || this.AREA_ID == undefined || this.AREA_ID == '') {
  //     this.message.error('Please Select Area Name', '');
  //   }
  //   else if (this.BLOCK_ID == null || this.BLOCK_ID == undefined || this.BLOCK_ID == '') {
  //     this.message.error('Please Select Block Name', '');
  //   }
  //   else if (this.BUILDING_ID == null || this.BUILDING_ID == undefined || this.BUILDING_ID == '') {
  //     this.message.error('Please Select Building Name', '');
  //   }
  //   else if (this.FLOOR_ID == null || this.FLOOR_ID == undefined || this.FLOOR_ID == '') {
  //     this.message.error('Please Select Floor Name', '');
  //   }
  //   else if (this.FLAT_ID == null || this.FLAT_ID == undefined || this.FLAT_ID == '') {
  //     this.message.error('Please Select Quarter Name', '');
  //   }
  //   else {

  //     if (this.arrayofflat.length < 5) {
  //       let city = '';
  //       let area = '';
  //       let block = '';
  //       let building = '';
  //       let floor = '';
  //       let flat = '';

  //       this.CityList.forEach((ele) => {
  //         if (this.CITY_ID == ele['ID']) {
  //           city = ele['NAME'];
  //         }
  //       });
  //       this.AreaList.forEach((val) => {
  //         if (this.AREA_ID == val['ID']) {
  //           area = val['NAME'];
  //         }
  //       });
  //       this.BlockList.forEach((vala) => {
  //         if (this.BLOCK_ID == vala['ID']) {
  //           block = vala['NAME'];
  //         }
  //       });
  //       this.BuildingList.forEach((valu) => {
  //         if (this.BUILDING_ID == valu['ID']) {
  //           building = valu['NAME'];
  //         }
  //       });
  //       this.FloorList.forEach((value) => {
  //         if (this.FLOOR_ID == value['ID']) {
  //           floor = value['NAME'];
  //         }
  //       });
  //       this.FlatList.forEach((valuess) => {
  //         if (this.FLAT_ID == valuess['ID']) {
  //           flat = valuess['NAME'];
  //         }
  //       });

  //       let objectpush = {
  //         ID: this.arrayofflat.length + 1,
  //         CITY_ID: this.CITY_ID,
  //         CITY_NAME: city,
  //         AREA_ID: this.AREA_ID,
  //         AREA_NAME: area,
  //         BLOCK_ID: this.BLOCK_ID,
  //         BLOCK_NAME: block,
  //         BUILDING_ID: this.BUILDING_ID,
  //         BUILDING_NAME: building,
  //         FLOOR_ID: this.FLOOR_ID,
  //         FLOOR_NAME: floor,
  //         FLAT_ID: this.FLAT_ID,
  //         FLAT_NAME: flat,
  //         PREFERNCE_NO: this.arrayofflat.length + 1,
  //         CLIENT_ID: 1,
  //         IS_SUBMITTED: 'D',
  //       };

  //       if (this.arrayofflat.length > 0) {
  //         let hasvalue = this.arrayofflat.find((value) => {
  //           return this.FLAT_ID == value.FLAT_ID;
  //         });
  //         if (hasvalue != undefined) {
  //           this.message.error('Quarter Already Exists, Please Add Other Quarters', '');
  //         } else {
  //           this.arrayofflat.push(objectpush);
  //           this.CITY_ID = null;
  //           this.AREA_ID = null;
  //           this.BLOCK_ID = null;
  //           this.BUILDING_ID = null;
  //           this.FLOOR_ID = null;
  //           this.FLAT_ID = null;
  //           this.AreaList = [];
  //           this.BlockList = [];
  //           this.BuildingList = [];
  //           this.FloorList = [];
  //           this.FlatList = [];

  //         }
  //       } else {
  //         this.arrayofflat.push(objectpush);
  //         this.CITY_ID = null;
  //         this.AREA_ID = null;
  //         this.BLOCK_ID = null;
  //         this.BUILDING_ID = null;
  //         this.FLOOR_ID = null;
  //         this.FLAT_ID = null;
  //         this.AreaList = [];
  //         this.BlockList = [];
  //         this.BuildingList = [];
  //         this.FloorList = [];
  //         this.FlatList = [];

  //       }
  //     } else {
  //       this.message.info('You can Add Maximum 5 Preferences', '');
  //     }
  //   }
  // }

  moveRowUp(index: number) {
    if (index > 0) {
      const temp = this.arrayofflat[index];
      this.arrayofflat[index] = this.arrayofflat[index - 1];
      this.arrayofflat[index - 1] = temp;
    }
    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['ID'] = i + 1;
    }
    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['PREFERNCE_NO'] = i + 1;
    }
  }

  moveRowDown(index: number) {
    if (index < this.arrayofflat.length - 1) {
      const temp = this.arrayofflat[index];
      this.arrayofflat[index] = this.arrayofflat[index + 1];
      this.arrayofflat[index + 1] = temp;
    }
    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['ID'] = i + 1;
    }
    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['PREFERNCE_NO'] = i + 1;
    }
  }

  deletepreference(data: any) {
    this.arrayofflat.splice(data.ID - 1, 1);
    for (let i = 0; i < this.arrayofflat.length; i++) {
      this.arrayofflat[i]['ID'] = i + 1;
      this.arrayofflat[i]['PREFERNCE_NO'] = i + 1;
    }
  }

  SavePreference() {
    let preferenncedata: any = [];

    for (let i = 0; i < this.arrayofflat.length; i++) {
      preferenncedata.push({
        EMPLOYEE_ID: this.empDATA.EMPLOYEE_ID,
        FLAT_REQUEST_ID: this.empDATA.ID,
        CITY_ID: this.arrayofflat[i]['CITY_ID'],
        AREA_ID: this.arrayofflat[i]['AREA_ID'],
        BLOCK_ID: this.arrayofflat[i]['BLOCK_ID'],
        BUILDING_ID: this.arrayofflat[i]['BUILDING_ID'],
        FLOOR_ID: this.arrayofflat[i]['FLOOR_ID'],
        FLAT_ID: this.arrayofflat[i]['FLAT_ID'],
        PREFERNCE_NO: this.arrayofflat[i]['PREFERNCE_NO'],
        TYPE: this.seniortiylistdata.RESIDENCE_TYPE,
        CLIENT_ID: this.arrayofflat[i]['CLIENT_ID'],
        FLAT_PREFRENCE_URL: null,
        IS_SUBMITTED: this.arrayofflat[i]['IS_SUBMITTED'],
      });
    }
    if (preferenncedata.length <= 0) {
      this.message.error('Please Add Quarter Preference Properly', '');
    } else {
      this.preferenceSpinning = true;
      this.api
        .createFlatPreference(
          preferenncedata,
          this.empDATA.ID,
          this.seniortiylistdata.RESIDENCE_TYPE
        )
        .subscribe(
          (value) => {
            if (value['code'] == 200) {
              this.preferenceSpinning = false;
              this.message.success(
                'Your Quarter Preference Have Been Saved Successfully',
                ''
              );
              this.drawerClose();
            } else {
              this.message.error('Failed To Save Quarter Preferences.', '');
            }
          },
          (error) => {
            this.message.error('Something Went Wrong', '');
          }
        );
    }
  }

  close() {
    this.drawerClose();
  }
  SpinningRejection: boolean = false;
  transferFileURL: any;
  attachment1: boolean = true;
  urllink: any;
  FLAT_PREFRENCE_URL: any = '';
  onFileATTACHMENT1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.SpinningRejection = true;
      this.transferFileURL = <File>event.target.files[0];

      if (this.transferFileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.transferFileURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink = url;
        if (
          this.FLAT_PREFRENCE_URL != undefined &&
          this.FLAT_PREFRENCE_URL.trim() != ''
        ) {
          var arr = this.FLAT_PREFRENCE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }

      this.api
        .onUpload('flatPreferanceList', this.transferFileURL, this.urllink)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.FLAT_PREFRENCE_URL = this.urllink;
            this.message.success('File Uploaded Successfully...', '');
            for (let i = 0; i < this.arrayofflat.length; i++) {
              this.arrayofflat[i]['FLAT_PREFRENCE_URL'] =
                this.FLAT_PREFRENCE_URL;
            }
            if (this.FLAT_PREFRENCE_URL != null) {
              this.attachment1 = false;
            } else {
              this.attachment1 = true;
            }
            this.SpinningRejection = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
            this.SpinningRejection = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.transferFileURL = null;
      this.FLAT_PREFRENCE_URL = null;
    }
  }
  ATTACHMENT1clear() {
    this.FLAT_PREFRENCE_URL = null;
    if (this.FLAT_PREFRENCE_URL != null) {
      this.attachment1 = false;
    } else {
      this.attachment1 = true;
    }
  }

  AttachedpdfsVisible: boolean = false;
  AttachedpdfsCancel() {
    this.AttachedpdfsVisible = false;
  }

  view1 = 0;
  viewattachedpdf = '';
  viewAssumptionAttached(pdfURL: string): void {
    this.viewattachedpdf = '';
    this.view1 = 11;
    this.AttachedpdfsVisible = true;
    this.viewattachedpdf = this.getS1(pdfURL);
  }

  sanitizedLink12: any = '';
  getS1(link: string) {
    var a = '';
    if (this.view1 == 11) {
      a = this.api.retriveimgUrl + 'flatPreferanceList/' + link;
    }
    this.sanitizedLink12 = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink12;
  }

  noticevacancyvisible: boolean = false;
  noticeVacancytitle = '';
  employeedata: any;
  Senioritydata: any;
  arrayofflatslist: any[] = [];
  Openform() {
    this.noticevacancyvisible = true;
    this.noticeVacancytitle = 'Quarter Preference Form';
    this.employeedata = this.empDATA;
    this.Senioritydata = this.seniortiylistdata;
    this.arrayofflatslist = this.arrayofflat;
  }

  noticevacancyClose() {
    this.noticevacancyvisible = false;
  }

  get closenoticevacancyform() {
    return this.noticevacancyClose.bind(this);
  }

  Submitpreference() {
    this.RejectRemark = true;
    this.FLAT_PREFRENCE_URL = null;
  }

  RejectRemark: boolean = false;
  SubmitRemark() {
    if (
      this.FLAT_PREFRENCE_URL == null ||
      this.FLAT_PREFRENCE_URL == undefined ||
      this.FLAT_PREFRENCE_URL == ''
    ) {
      this.message.error('Please Upload Preference Form', '');
    } else {
      let prefersubmit: any = [];

      for (let i = 0; i < this.arrayofflat.length; i++) {
        prefersubmit.push({
          EMPLOYEE_ID: this.empDATA.EMPLOYEE_ID,
          FLAT_REQUEST_ID: this.empDATA.ID,
          CITY_ID: this.arrayofflat[i]['CITY_ID'],
          AREA_ID: this.arrayofflat[i]['AREA_ID'],
          BLOCK_ID: this.arrayofflat[i]['BLOCK_ID'],
          BUILDING_ID: this.arrayofflat[i]['BUILDING_ID'],
          FLOOR_ID: this.arrayofflat[i]['FLOOR_ID'],
          FLAT_ID: this.arrayofflat[i]['FLAT_ID'],
          PREFERNCE_NO: this.arrayofflat[i]['PREFERNCE_NO'],
          TYPE: this.seniortiylistdata.RESIDENCE_TYPE,
          CLIENT_ID: this.arrayofflat[i]['CLIENT_ID'],
          FLAT_PREFRENCE_URL: this.arrayofflat[i]['FLAT_PREFRENCE_URL'],
          IS_SUBMITTED: 'S',
        });
      }
      if (prefersubmit.length <= 0) {
        this.message.error('Please Add Quarter Preference Properly', '');
      } else {
        this.submitprefspin = true;
        this.api
          .createFlatPreference(
            prefersubmit,
            this.empDATA.ID,
            this.seniortiylistdata.RESIDENCE_TYPE
          )
          .subscribe(
            (value) => {
              if (value['code'] == 200) {
                this.submitprefspin = false;
                this.message.success(
                  'Your Quarter Preference Have Been Submitted Successfully',
                  ''
                );
                this.RejectRemark = false;
                this.drawerClose();
              } else {
                this.message.error('Failed To Submit Quarter Preferences.', '');
              }
            },
            (error) => {
              this.message.error('Something Went Wrong', '');
            }
          );
      }
    }
  }

  CancleRemark() {
    this.RejectRemark = false;
  }
}
