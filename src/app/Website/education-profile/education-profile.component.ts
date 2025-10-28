import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EMPEDUCATIONDETAILS } from 'src/app/Modal/profile';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-education-profile',
  templateUrl: './education-profile.component.html',
  styleUrls: ['./education-profile.component.css'],
})
export class EducationProfileComponent {
  @Input() drawerVisibleEducation: boolean = false;
  @Input() drawerEducationClose: Function;
  @Input() data: EMPEDUCATIONDETAILS = new EMPEDUCATIONDETAILS();
  isSpinning = false;
  constructor(
    public api: WebsiteService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private modal: NzModalService
  ) { }
  ngOnInit(): void {
    this.getAll();
  }

  EducationData: any = [];
  Qualifications: any = [];
  getAll() {
    // this.api.geteducationTypeData(0, 0, '', '', 'AND STATUS=1').subscribe(
    //   (data) => {

    //     if (data['code'] == 200) {
    //       this.EducationData = data['data'];
    //     }
    //   },
    //   (err) => {
    //     if (err['ok'] == false) this.message.error('Server Not Found', '');
    //   }
    // );

    this.api.getAllQualifications(0, 0, '', '', 'AND IS_ACTIVE=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Qualifications = data['data'];
        }
      },
      (err) => {
        if (err['ok'] == false) this.message.error('Server Not Found', '');
      }
    );
  }
  isOk: boolean = false;
  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }
  save(addNew: boolean = false, form1: NgForm) {
    if (
      this.data.EDUCATION_TYPE_ID == undefined &&
      this.data.COURSE_DEGREE_NAME == undefined &&
      this.data.COLLEGE_UNIVERSITY_NAME == undefined
    ) {
      this.message.error('Please fill Data', '');
    } else if (this.isInvalidDate) {
      this.message.error('Please Check if all entered Dates are valid', '');
    }
    //  else if (Number(this.data.MARKS) > 10) {
    //   this.data.MARKS = 10;
    //   this.message.info('Marks should be less than or equal to 10', '');
    // }
    else {
      if (this.data.MONTH_YEAR != null || this.data.MONTH_YEAR != undefined) {
        // this.data.MONTH_YEAR = this.data.MONTH_YEAR.split('/').reverse().join('-');
        this.data.MONTH_YEAR = this.datePipe.transform(
          this.data.MONTH_YEAR,
          'yyyy-MM'
        );
      } else {
        this.data.MONTH_YEAR = null;
      }
      this.data.EMPLOYEE_ID = sessionStorage.getItem('userId');
      this.data.IS_UPDATED = 1;
      if (this.data.ID) {
        this.api.updateEducation(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Education Updated Successfully', '');

              if (!addNew) this.drawerEducationClose();
              this.isSpinning = false;
            } else if (successCode['code'] == '304') {
              this.message.info(successCode.message, '');
              this.isSpinning = false;
              this.data.MONTH_YEAR = this.datePipe.transform(
                this.data.MONTH_YEAR,
                'MM/yyyy'
              );
            } else {
              this.message.error('Education Updation Failed', '');
              this.isSpinning = false;
              this.data.MONTH_YEAR = this.datePipe.transform(
                this.data.MONTH_YEAR,
                'MM/yyyy'
              );
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      } else {
        this.api.createEducation(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Education Created Successfully', '');

              if (!addNew) this.drawerEducationClose();
              else {
                this.resetDrawer(form1);
                this.data = new EMPEDUCATIONDETAILS();
              }
              this.isSpinning = false;
            } else if (successCode['code'] == '304') {
              this.message.info(successCode.message, '');
              this.isSpinning = false;
              this.data.MONTH_YEAR = this.datePipe.transform(
                this.data.MONTH_YEAR,
                'MM/yyyy'
              );
            } else {
              this.message.error('Education Creation Failed', '');
              this.isSpinning = false;
              this.data.MONTH_YEAR = this.datePipe.transform(
                this.data.MONTH_YEAR,
                'MM/yyyy'
              );
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      }
    }
  }
  close() {
    this.drawerEducationClose();
  }

  onDOB(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    // if(type== 'FD'){
    //   this.data.FROM_DATE=value;
    // }else  if(type== 'TD'){
    //   this.data.TO_DATE=value;
    // }
    this.data.MONTH_YEAR = value;
  }

  isInvalidDate: boolean = false;

  showInvalidDateError(relievingDate: any): any {
    this.isInvalidDate = false;

    if (relievingDate.length == 7) {
      let tempJoiningDate = relievingDate.split('/');

      for (let i = 0; i < tempJoiningDate.length; i++) {
        // if (i == 0) {
        //   if ((Number(tempJoiningDate[i]) > 31) || (Number(tempJoiningDate[i]) < 1)) {
        //     isInvalidDate = true;
        //     break;
        //   }
        // }

        if (i == 0) {
          if (
            Number(tempJoiningDate[i]) > 12 ||
            Number(tempJoiningDate[i]) < 1
          ) {
            this.isInvalidDate = true;
            break;
          }
        }

        if (i == 1) {
          if (
            tempJoiningDate[i].length < 4 ||
            Number(tempJoiningDate[i]) < 1900
          ) {
            this.isInvalidDate = true;
            break;
          }
        }
      }
    } else {
      this.isInvalidDate = true;
    }

    return this.isInvalidDate;
  }

  resetDrawer(form1: NgForm) {
    this.data = new EMPEDUCATIONDETAILS();
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
        .getEducation(0, 0, '', '', 'AND ID =' + this.ID)
        .subscribe((data) => {
          this.olddata = data['data'][0];
          this.data = this.olddata;
          // this.data.CITY_ID = data['data'][0]["CITY_ID"].split(',').map(Number);
        });
    } else {
      this.message.error('Can not get previous record', '');
    }
  }
  add(): void {
    this.api.getEducation(0, 0, '', '', '').subscribe(
      (data) => {
        this.ID = data['data'][0]['ID'];
      },
      (err) => { }
    );
  }

  onMarksChange(event) {
    if (Number(event) > 10) {
      this.message.info('Marks should be less than or equal to 10', '');
    }
  }

  showConfirm(value: any): void {
    if (value == true || value == 1) {
      this.modal.confirm({
        nzTitle:
          '<i>Are you sure to set this as your Highest qualification?</i>',
        nzContent: '',
        nzOnOk: () => console.log('OK'),
        nzOnCancel: () => {
          this.data.IS_HIGHEST = false;
        },
      });
    } else {
      this.data.IS_HIGHEST = false;
    }
  }


}
