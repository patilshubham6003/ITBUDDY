import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmployeeReg } from 'src/app/Modal/empregistration2';
import { ServiceService } from 'src/app/Service/service.service';

@Component({
  selector: 'app-empregistrationdrawer',
  templateUrl: './empregistrationdrawer.component.html',
  styleUrls: ['./empregistrationdrawer.component.css'],
})
export class EmpregistrationdrawerComponent {
  @Input() drawerClose!: Function;
  @Input() data: EmployeeReg;
  @Input() showEmployeeSearch;
  constructor(
    private message: NzNotificationService,
    private api: ServiceService
  ) {}
  isOk = true;
  @Input()
  isdrawerVisible: boolean;
  @Input()
  isEmpCodevisible = true;
  @Input()
  isEmailVisible = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  EMPLOYEE_CODE: any;
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  isValidMobile(mobile) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }
  ranksss:any=[]
  rankspin:boolean=false
  ngOnInit() {
    this.rankspin=true
     this.api
        .getallDesignationForTransfer(
          0,
          0,
          'NAME',
          'asc',
          ' AND STATUS=1 AND MDB_ID is not NULL '
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.ranksss = data['data'];
                this.rankspin=false
              } else {
              }
            }
          },
          (err) => {}
        );
  }
  isSpinningSave: boolean = false;
  save(isNew: boolean, employee: NgForm) {
    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.NAME.trim() == '' &&
      this.data.EMPLOYEE_CODE == undefined &&
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    } else if (
      this.data.NAME == undefined ||
      this.data.NAME == null ||
      this.data.NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.data.EMAIL_ID == undefined ||
      this.data.EMAIL_ID == null ||
      this.data.EMAIL_ID.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Email ID', '');
    } else if (!this.emailpattern.test(this.data.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Email ID', '');
    } else if (
      this.data.EMPLOYEE_CODE == undefined ||
      this.data.EMPLOYEE_CODE == null ||
      this.data.EMPLOYEE_CODE == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Employee Code', '');
    } else if (
      this.data.MOBILE_NO == undefined ||
      this.data.MOBILE_NO == null
    ) {
      this.isOk = false;
      this.message.error('Please Enter Mobile number', '');
    } else if (!this.isValidMobile(this.data.MOBILE_NO)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Mobile Number', '');
    }

    if (this.isOk) {
      if (this.data.ID) {
        this.isSpinningSave = true;
        this.api.empUpdate(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success(' Information Updated Successfully...', '');
              if (!isNew) this.drawerClose();
              this.isSpinning = false;
              this.isSpinningSave = false;
            } else if (successCode['code'] == '300') {
              this.isSpinning = false;
              this.isSpinningSave = false;
              this.message.error(successCode['message'], '');
            } else if (successCode['code'] == '303') {
              this.isSpinning = false;
              this.isSpinningSave = false;
              this.message.error('This Email ID Is Already Exist', '');
            } else {
              this.message.error(' Failed To Update Information...', '');
              this.isSpinning = false;
              this.isSpinningSave = false;
            }
          },
          (err) => {
            this.message.error(
              'Something Went Wrong, Please Try Again Later',
              ''
            );
            this.isSpinningSave = false;
            this.isSpinning = false;
            console.log(err);
          }
        );
      } else {
        this.isSpinningSave = true;
        this.api.empCreate(this.data).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.isSpinningSave = false;
              this.message.success(' Information Save Successfully...', '');
              if (!isNew) this.drawerClose();
              else {
                this.data = new EmployeeReg();
                this.resetDrawer(employee);
              }
              this.isSpinning = false;
            } else if (successCode['code'] == '300') {
              this.isSpinningSave = false;
              this.isSpinning = false;
              this.message.error(successCode['message'], '');
            } else if (successCode['code'] == '303') {
              this.isSpinningSave = false;
              this.isSpinning = false;
              this.message.error('This Email ID Is Already Exist', '');
            } else {
              this.isSpinningSave = false;
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.message.error(
              'Something Went Wrong, Please Try Again Later',
              ''
            );
            this.isSpinningSave = false;
            this.isSpinning = false;
            console.log(err);
          }
        );
      }
    }
  }
  resetDrawer(employee: NgForm) {
    this.data = new EmployeeReg();
    employee.form.markAsPristine();
    employee.form.markAsUntouched();
  }
  close() {
    this.drawerClose();
    this.isdrawerVisible = false;
  }

  employeeCodeList: any = [];
  searchEmployee(event) {
    if (event) {
      if (event.length >= 3) {
        this.isSpinning = true;
        this.api
          .empget(0, 0, '', '', " AND EMPLOYEE_CODE = '" + event + "'")
          .subscribe(
            (data) => {
              this.isSpinning = false;
              if (data['code'] == 200) {
                if (data['data'].length > 0) {
                  this.data = data['data'][0];
                  this.data.EMPLOYEE_CODE = data['data'][0].EMPLOYEE_CODE;
                  this.data.MOBILE_NO = data['data'][0].MOBILE_NO;
                  this.data.NAME = data['data'][0].NAME;
                  this.data.EMAIL_ID = data['data'][0].EMAIL_ID;
                  this.message.info('Update employee details', '');
                } else {
                  this.data = new EmployeeReg();
                  this.message.error('Employee details not found', '');
                }
              } else {
                this.message.error('Employee details not found', '');
              }
            },
            (err) => {
              this.isSpinning = false;
              this.message.error('Failed to fetch data', '');
              console.log(err);
            }
          );
      } else {
        this.isSpinning = false;
        this.data = new EmployeeReg();
      }
    } else {
      this.isSpinning = false;
      if (!this.EMPLOYEE_CODE) {
        this.data = new EmployeeReg();
      }
    }
  }

  selectEmployee(event) {
    if (event) {
      var journeyData: any = '';

      journeyData = this.employeeCodeList.filter(
        (option) =>
          option.EMPLOYEE_CODE.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
      this.data = journeyData[0];
    } else {
      this.employeeCodeList = [];
      this.data = new EmployeeReg();
    }
  }
}
