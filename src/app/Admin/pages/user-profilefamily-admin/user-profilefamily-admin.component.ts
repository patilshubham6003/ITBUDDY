import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { Family, Personalinfo } from 'src/app/Modal/profile';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-user-profilefamily-admin',
  templateUrl: './user-profilefamily-admin.component.html',
  styleUrls: ['./user-profilefamily-admin.component.css'],
  providers: [DatePipe],
})
export class UserProfilefamilyAdminComponent implements OnInit {
  @Input() drawerVisibleFamily: boolean = false;
  @Input() drawerFamilyClose: Function;
  @Input() data: Family = new Family();
  personalinformation: Personalinfo;
  close() {
    this.drawerFamilyClose();
  }
  disabledDate18years = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      current >=
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };

  isSpinning = false;
  constructor(
    private datePipe: DatePipe,
    private api: WebsiteService,
    private message: NzNotificationService
  ) {}
  dateDOB: any;
  ngOnInit() {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    this.dateDOB = eighteenYearsAgo;
    this.getpersonaldata();
  }
  calculateAge1(selectedDate: Date): void {
    if (selectedDate) {
      const today = new Date();
      const birthDate = new Date(selectedDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      this.data.AGE = age.toString();
    } else {
      this.data.AGE = null;
    }
  }
  getpersonaldata() {
    this.isSpinning = true;
    this.api
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND ID=' + sessionStorage.getItem('userId') + ''
      )
      .subscribe(
        (data) => {
          if (data.code == '200' && data.data.length > 0) {
            this.personalinformation = data['data'][0];
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
          console.log(err);
        }
      );
  }

  onlyalpha(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  save(addNew: boolean, form1: NgForm): void {
    if (
      this.data.NAME == null ||
      this.data.NAME == undefined ||
      this.data.NAME == ''
    ) {
      this.message.error('Please Enter Name', '');
    } else if (
      (this.data.RELATION == 'Daughter' || this.data.RELATION == 'Son') &&
      (this.data.DOB == null ||
        this.data.DOB == undefined ||
        this.data.DOB == '')
    ) {
      this.message.error('Please Select Date Of Birth', '');
    } else {
      this.isSpinning = true;
      this.data.EMPLOYEE_ID = sessionStorage.getItem('EMPLOYEE_ID');
      if (this.data.RELATION == 'Daughter' || this.data.RELATION == 'Son') {
      } else {
        this.data.IS_ADOPTED = false;
      }
      if (this.data.DOB != null || this.data.DOB != undefined) {
        this.data.DOB = this.datePipe.transform(this.data.DOB, 'yyyy-MM-dd');
      } else {
        this.data.DOB = null;
      }
      if (this.data.NAME != undefined && this.data.NAME != '') {
        if (this.data.ID) {
          this.data.EMPLOYEE_ID = sessionStorage.getItem('userId');
          this.api.updateFamily(this.data).subscribe(
            (successCode) => {
              if (successCode['code'] == '200') {
                this.message.success('Family Details Updated Successfully', '');
                this.isSpinning = false;
                if (!addNew) this.drawerFamilyClose();
                this.personalinformation.ID = Number(
                  sessionStorage.getItem('userId')
                );
                this.personalinformation.STATUS = 1;
                this.personalinformation.IS_FAMILY_FILLED = 1;
                this.personalinformation.DOB = this.datePipe.transform(
                  this.personalinformation.DOB,
                  'yyyy-MM-dd'
                );
                this.api.updateprofile(this.personalinformation).subscribe(
                  (successCode) => {
                    if (successCode['code'] == '200') {
                      this.isSpinning = false;
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {
                    this.isSpinning = false;
                    console.log(err);
                  }
                );
                this.isSpinning = false;
              } else {
                this.isSpinning = false;
                this.message.error('Failed To Update Family Details', '');
              }
            },
            (err) => {
              this.isSpinning = false;
              this.message.error(
                'SOmething Went Wrong, Please Try Again Later.',
                ''
              );
              console.log(err);
            }
          );
        } else {
          this.data.EMPLOYEE_ID = sessionStorage.getItem('userId');
          this.api.createFamily(this.data).subscribe(
            (successCode) => {
              if (successCode['code'] == '200') {
                this.message.success('Family Details Created Successfully', '');
                if (!addNew) this.drawerFamilyClose();
                else {
                  this.resetDrawer(form1);
                  this.data = new Family();
                }
                this.isSpinning = false;
                this.personalinformation.ID = Number(
                  sessionStorage.getItem('userId')
                );
                this.personalinformation.STATUS = 1;
                this.personalinformation.IS_FAMILY_FILLED = 1;
                this.personalinformation.DOB = this.datePipe.transform(
                  this.personalinformation.DOB,
                  'yyyy-MM-dd'
                );
                this.api.updateprofile(this.personalinformation).subscribe(
                  (successCode) => {
                    if (successCode['code'] == '200') {
                      this.isSpinning = false;
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {
                    this.isSpinning = false;
                    console.log(err);
                  }
                );
              } else {
                this.isSpinning = false;
                this.message.error('Failed To Update Family Details', '');
              }
            },
            (err) => {
              this.message.error(
                'SOmething Went Wrong, Please Try Again Later.',
                ''
              );
              this.isSpinning = false;
              console.log(err);
            }
          );
        }
      } else {
        this.message.error('Please Fill Name Field', '');
        this.isSpinning = false;
      }
    }
  }

  resetDrawer(form1: NgForm) {
    this.data = new Family();
    form1.form.markAsPristine();
    form1.form.markAsUntouched();
    this.add();
  }
  @ViewChild('form1', { static: false }) form1var: NgForm;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F2') {
      this.getdata();
    } else if (event.shiftKey && event.key === 'F4' && !this.data.ID) {
      this.save(true, this.form1var);
    } else if (event.key === 'F4') {
      this.save(false, this.form1var);
    }
  }
  olddata: any = [];
  ID: any;
  getdata() {
    if (this.ID) {
      this.api
        .getFamily(0, 0, '', '', ' AND ID =' + this.ID)
        .subscribe((data) => {
          this.olddata = data['data'][0];
          this.data = this.olddata;
        });
    } else {
      this.message.error('Can not get previous record', '');
    }
  }
  add(): void {
    this.api.getFamily(0, 0, '', '', '').subscribe(
      (data) => {
        this.ID = data['data'][0]['ID'];
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
