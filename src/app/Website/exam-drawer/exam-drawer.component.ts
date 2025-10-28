import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ExamMaster } from 'src/app/Modal/profile';
import { differenceInCalendarDays } from 'date-fns';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-exam-drawer',
  templateUrl: './exam-drawer.component.html',
  styleUrls: ['./exam-drawer.component.css']
})
export class ExamDrawerComponent {
  @Input() drawerClose!: Function;
  @Input() data: ExamMaster = new ExamMaster();
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  exams: any[] = [];

  constructor(private _api: WebsiteService, private _message: NzNotificationService, private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getExamMaster();
  }

  getExamMaster(): void {
    this._api.getAllExam(0, 0, '', '', 'AND STATUS=1').subscribe((data) => {
      if (data['code'] == 200) {
        this.exams = data['data'];

      } else {
        this._message.error('Something Went Wrong', '');
      }

    }, (err) => {
      if (err['ok'] == false) {
        this._message.error("Server Not Found", "");
      }
    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.resetDrawer1(myForm);
  }

  resetDrawer1(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    let isOK = true;

    if (
      (this.data.EXAM_ID == null) ||
      (this.data.EXAM_ID == undefined)
    ) {
      isOK = false;
      this._message.error('Please Select Exam Name', '');
    }
    // if (this.isInvalidDate) {
    //   isOK = false
    //   this._message.error('Please Check if all entered Dates are valid', '')
    // }

    if (isOK) {
      this.data.EMPLOYEE_ID = Number(sessionStorage.getItem("EMPLOYEE_ID"));
      // this.data.PASSING_DATE = this._datePipe.transform(this.data.PASSING_DATE, 'yyyy-MM-dd');
      if (this.data.PASSING_DATE != null || this.data.PASSING_DATE != undefined) {
        // this.data.PASSING_DATE = this.data.PASSING_DATE.split('/').reverse().join('-');
        this.data.PASSING_DATE = this._datePipe.transform(this.data.PASSING_DATE,'yyyy-MM-dd');
      }
      else {
        this.data.PASSING_DATE = null
      }
      this.data.EMPLOYEE_ID=Number(sessionStorage.getItem('userId'));
      if (this.data.ID) {
        this._api.updateEmployeeExamDetails(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this._message.success("Exam Details Updated Successfully", "");
            if (!addNew)
              this.close(myForm);
            this.isSpinning = false;
          } else if (successCode['code'] == '304') {
            this._message.info(successCode.message, '');
            this.isSpinning = false;
            this.data.PASSING_DATE = this._datePipe.transform(this.data.PASSING_DATE,'dd/MM/yyyy');
          } else {
            this._message.error("Exam Details Updation Failed", "");
            this.isSpinning = false;
          }

        }, err => {
          if (err['ok'] == false) {
            this._message.error("Server Not Found", "");
            this.isSpinning = false;
          }
        });

      } else {
        this._api.createEmployeeExamDetails(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this._message.success("Exam Details Created Successfully", "");
            if (!addNew) {
              this.close(myForm);
            } else {
              this.resetDrawer(myForm)
              this.data = new ExamMaster();
            }
            this.isSpinning = false;

          } else if (successCode['code'] == '304') {
            this._message.info(successCode.message, '');
            this.isSpinning = false;
          } else {
            this._message.error("Exam Details Creation Failed", "");
            this.isSpinning = false;
          }

        }, err => {
          if (err['ok'] == false) {
            this._message.error("Server Not Found", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  today: Date = new Date();

  disabledPassingDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  }


  onDOB(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }


    this.data.PASSING_DATE = value;



  }


  isInvalidDate: boolean = false
  showInvalidDateError(relievingDate: any): any {
    this.isInvalidDate = false;

    if (relievingDate.length == 10) {
      let tempJoiningDate = relievingDate.split('/');

      for (let i = 0; i < tempJoiningDate.length; i++) {
        if (i == 0) {
          if ((Number(tempJoiningDate[i]) > 31) || (Number(tempJoiningDate[i]) < 1)) {
            this.isInvalidDate = true;
            break;
          }
        }

        if (i == 1) {
          if ((Number(tempJoiningDate[i]) > 12) || (Number(tempJoiningDate[i]) < 1)) {
            this.isInvalidDate = true;
            break;
          }
        }

        if (i == 2) {
          if ((tempJoiningDate[i].length < 4) || (Number(tempJoiningDate[i]) < 1900)) {
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


  //23-02
  resetDrawer(myForm: NgForm) {
    this.data = new ExamMaster();
    myForm.form.markAsPristine();
    myForm.form.markAsUntouched();
    this.add();
  }
  @ViewChild('myForm', { static: false }) myFormvar: NgForm;


  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.key === 'F2')) {
      this.getdata()
    }
    else if (event.shiftKey && (event.key === 'F4') && (!this.data.ID)) {
      this.save(true, this.myFormvar);
    } else if ((event.key === 'F4')) {
      this.save(false, this.myFormvar);
    }
  }
  olddata: any = []
  ID: any
  getdata() {
    if (this.ID) {
      this._api.getEmployeeExamDetails(0, 0, '', '', 'AND ID =' + this.ID).subscribe((data) => {
        this.olddata = data['data'][0]
        this.data = this.olddata
        // this.data.CITY_ID = data['data'][0]["CITY_ID"].split(',').map(Number);

      })
    }
    else {
      this._message.error('Can not get previous record', '')
    }
  }
  add(): void {
    this._api.getEmployeeExamDetails(0, 0, '', '', '').subscribe((data) => {

      this.ID = data['data'][0]['ID']
    }, (err) => {
    });


  }
}