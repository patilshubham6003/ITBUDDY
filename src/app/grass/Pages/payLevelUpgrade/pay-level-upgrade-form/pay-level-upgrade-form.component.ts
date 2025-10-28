import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { payLevelUpgrade } from '../../QUARTER/QuarterData';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pay-level-upgrade-form',
  templateUrl: './pay-level-upgrade-form.component.html',
  styleUrls: ['./pay-level-upgrade-form.component.css'],
  providers: [DatePipe]
})
export class PayLevelUpgradeFormComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = payLevelUpgrade;

  isSpinning = false;
  isOk = true;
  ResidenceType: any = [];
  FloorNo: any = [];
  BuildingName: any = [];
  cityList: any = [];
  areaList: any = [];
  BlockList: any = [];
  BuildingList: any = [];
  userid: any;
  roleid: any;
  GradePayLevelData: any = [];

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService, public datepipe: DatePipe
  ) { }
  ngOnInit() {
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.getResidenceType();
    this.getDesignation();
    this.getEmployee(this.searchkey);
    this.api.getAllGradePayLevel(0, 0, '', 'desc', ' AND STATUS=1').subscribe(
      (data1) => {
        this.GradePayLevelData = data1['data'];
      });
  }
  disabledDate2222 = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current > today;
  };

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new payLevelUpgrade();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }


  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  loadresodence: boolean = false;

  getResidenceType() {
    this.loadresodence = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.loadresodence = false;
          this.ResidenceType = data['data'];
        } else {
          this.loadresodence = false;
          this.ResidenceType = [];
        }
      },
      (err) => {
        this.loadresodence = false;
        this.ResidenceType = [];
      }
    );
  }

  Designationtypes: any = [];
  loaddesignation: boolean = false;

  getDesignation() {
    this.loaddesignation = true;
    this.api.getallDesignation(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Designationtypes = data['data'];
          this.loaddesignation = false;
        } else {
          this.loaddesignation = false;
          this.Designationtypes = [];
        }
      },
      (err) => {
        this.loaddesignation = false;
        this.Designationtypes = [];
      }
    );
  }

  GetEmployee: any = [];
  loademployee: boolean = false;
  searchkey = '';
  pageIndex = 1;
  totalrecords = 0;

  PRESENT_PAY_LEVEL_DATE: any;
  GRAD_PAY_LEVEL_ID: any;
  DESIGNATION_ID: any;

  getEmployee(event: any) {
    event =
      (event != '' && event != undefined && event != null)
        ? ' AND (NAME like "%' +
        event + '%" ) '
        : '';
    this.loademployee = true;
    this.api.getEmployeeMaster(this.pageIndex, 10, 'NAME', 'asc', ' AND STATUS = 1' + event).subscribe(
      (data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.loademployee = false;
          if (this.pageIndex == 1) {
            this.GetEmployee = [...[], ...data['data']];
          } else {
            this.GetEmployee = [...this.GetEmployee, ...data['data']];
          }
          this.totalrecords = data['count'];
        }
        else {
          this.loademployee = false;
          this.GetEmployee = [];
        }

      }),
      (err) => {
        this.loademployee = false;
        this.GetEmployee = [];
      }
  }


  loadMore() {
    if (this.totalrecords > this.GetEmployee.length) {
      this.pageIndex++;
      this.getEmployee(this.searchkey);
    }
  }
  search(event: any) {
    this.searchkey = event;
    if (event.length >= 3) {
      this.GetEmployee = [];
      this.pageIndex = 1;
      this.getEmployee(this.searchkey);
    }
  }

  keyup(event: any) {
    if (
      this.searchkey == '' &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      this.GetEmployee = [];
      this.pageIndex = 1;
      this.getEmployee('');
    }
  }
  selectemployee(data: any) {

    if ((data === undefined || data === null || data === '')) {
      this.data.OLD_PRESENT_PAY_LEVEL_DATE = null;
      this.data.OLD_GRADE_PAY_LEVEL_ID = null;
      this.data.OLD_DESIGNATION_ID = null;
      return;
    }
    if ((data !== undefined && data !== null && data !== '') && (this.data.RESIDENCE_TYPE_ID !== undefined && this.data.RESIDENCE_TYPE_ID !== null && this.data.RESIDENCE_TYPE_ID !== '')) {
      this.api.getFlatRequestOldDetails(data, this.data.RESIDENCE_TYPE_ID).subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            console.log(data, "data")
            this.data.OLD_PRESENT_PAY_LEVEL_DATE = new Date(data['data'][0]['PRESENT_PAY_LEVEL_DATE'])
            this.data.OLD_GRADE_PAY_LEVEL_ID = Number(data['data'][0]['GRAD_PAY_LEVEL_ID'])
            this.data.OLD_DESIGNATION_ID = Number(data['data'][0]['DESIGNATION_ID'])
          } else {
            this.data.OLD_PRESENT_PAY_LEVEL_DATE = null;
            this.data.OLD_GRADE_PAY_LEVEL_ID = null;
            this.data.OLD_DESIGNATION_ID = null;
          }
        },
        (err) => {
          this.data.OLD_PRESENT_PAY_LEVEL_DATE = null;
          this.data.OLD_GRADE_PAY_LEVEL_ID = null;
          this.data.OLD_DESIGNATION_ID = null;
        }
      );
    }
  }


  selectresidencetype(data: any) {
    if ((data === undefined || data === null || data === '')) {
      this.data.OLD_PRESENT_PAY_LEVEL_DATE = null;
      this.data.OLD_GRADE_PAY_LEVEL_ID = null;
      this.data.OLD_DESIGNATION_ID = null;
      return;
    }
    if ((data !== undefined && data !== null && data !== '') && (this.data.EMP_ID !== undefined && this.data.EMP_ID !== null && this.data.EMP_ID !== '')) {
      this.api.getFlatRequestOldDetails(this.data.EMP_ID, data).subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            console.log(data, "data")
            this.data.OLD_PRESENT_PAY_LEVEL_DATE = new Date(data['data'][0]['PRESENT_PAY_LEVEL_DATE'])
            this.data.OLD_GRADE_PAY_LEVEL_ID = Number(data['data'][0]['GRAD_PAY_LEVEL_ID'])
            this.data.OLD_DESIGNATION_ID = Number(data['data'][0]['DESIGNATION_ID'])
          } else {
            this.data.OLD_PRESENT_PAY_LEVEL_DATE = null;
            this.data.OLD_GRADE_PAY_LEVEL_ID = null;
            this.data.OLD_DESIGNATION_ID = null;
          }
        },
        (err) => {
          this.data.OLD_PRESENT_PAY_LEVEL_DATE = null;
          this.data.OLD_GRADE_PAY_LEVEL_ID = null;
          this.data.OLD_DESIGNATION_ID = null;
        }
      );
    }
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.EMP_ID == undefined &&
      this.data.RESIDENCE_TYPE_ID == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Fill All The Required Fields ', '');
    } else if (this.data.EMP_ID == null || this.data.EMP_ID == undefined || this.data.EMP_ID == '') {
      this.isOk = false;
      this.message.error(' Please Select Employee Name', '');
    }
    else if (
      this.data.RESIDENCE_TYPE_ID == null ||
      this.data.RESIDENCE_TYPE_ID == undefined || this.data.RESIDENCE_TYPE_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Residence type.', '');
    } else if (
      this.data.OLD_DESIGNATION_ID == null ||
      this.data.OLD_DESIGNATION_ID == undefined || this.data.OLD_DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Old Designation', '');
    } else if (
      this.data.OLD_GRADE_PAY_LEVEL_ID == null ||
      this.data.OLD_GRADE_PAY_LEVEL_ID == undefined || this.data.OLD_GRADE_PAY_LEVEL_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Old Grade Pay Level', '');
    } else if (
      this.data.OLD_PRESENT_PAY_LEVEL_DATE == null ||
      this.data.OLD_PRESENT_PAY_LEVEL_DATE == undefined || this.data.OLD_PRESENT_PAY_LEVEL_DATE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select Old Present Pay Level Date', '');
    }
    else if (
      this.data.NEW_DESIGNATION_ID == null ||
      this.data.NEW_DESIGNATION_ID == undefined || this.data.NEW_DESIGNATION_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select New Designation', '');
    } else if (
      this.data.NEW_GRADE_PAY_LEVEL_ID == null ||
      this.data.NEW_GRADE_PAY_LEVEL_ID == undefined || this.data.NEW_GRADE_PAY_LEVEL_ID == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select New Grade Pay Level', '');
    } else if (
      this.data.NEW_PRESENT_PAY_LEVEL_DATE == null ||
      this.data.NEW_PRESENT_PAY_LEVEL_DATE == undefined || this.data.NEW_PRESENT_PAY_LEVEL_DATE == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Select New Present Pay Level Date', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        this.data.USER_ID = Number(this.userid)
        this.data.NEW_PRESENT_PAY_LEVEL_DATE = this.datepipe.transform(this.data.NEW_PRESENT_PAY_LEVEL_DATE, 'yyyy-MM-dd')
        this.data.OLD_PRESENT_PAY_LEVEL_DATE = this.datepipe.transform(this.data.OLD_PRESENT_PAY_LEVEL_DATE, 'yyyy-MM-dd')

        this.api.PaylevelupdateFlatRequestDetails(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Information Updated Successfully...', '');
            if (!addNew) {
              this.drawerClose();
              this.isSpinning = false;
              websitebannerPage.form.reset();
            } else {
              this.data = new payLevelUpgrade();
              this.resetDrawer(websitebannerPage);
            }
          } else {
            this.message.error('Failed To Update Information', '');
            this.isSpinning = false;
          }
        }, err => {
          this.message.error('Something went wrong, please try again later', '');
          this.isSpinning = false;
        });

      }
    }
  }
}
