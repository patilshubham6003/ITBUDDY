import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Employee } from 'src/app/Modal/employee_registration';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [DatePipe],
})
export class EmployeeComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Employee;
  @Input() fileExt: any;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  imgurl = appkeys.retriveimgUrl;
  date = new Date();
  getseionedit: any;
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private dom: DomSanitizer
  ) {}

  ngOnInit() {
    this.getseionedit = sessionStorage.getItem('editTT');
  }
  close(): void {
    this.drawerClose();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  editTfalse() {
    sessionStorage.setItem('editTT', 'F');
    this.getseionedit = 'F';
  }
  save(addNew: boolean): void {
    var isOk = true;
    // this.isSpinning = true;

    if (this.data.APPROVAL_STATUS == 'R') {
      if (
        this.data.REJECT_REMARK == undefined ||
        this.data.REJECT_REMARK.trim() == ''
      ) {
        isOk = false;
        this.message.error('Please Enter Rejection Remark', '');
      }
    }
    if (isOk) {
      this.isSpinning = true;

      this.api.updateEmployee(this.data).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success(
            'Employee Registration information updated Successfully...',
            ''
          );
          if (!addNew) this.drawerClose();
          this.isSpinning = false;
        } else {
          this.message.error(
            'Failed to update Employee Registration information...',
            ''
          );
          this.isSpinning = false;
        }
      });
    }
  }
  isVisible = false;
  open(link: string) {
    // window.open(this.fileExt);
    this.isVisible = true;
    var a = this.imgurl + 'idProof/' + link;
    this.sanitizedLink = this.dom.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  view = 0;
  sanitizedLink: any = '';

  showmobfile() {
    const fileUrl = this.imgurl + 'idProof/' + this.data.ID_PROOF;
    window.open(fileUrl);
  }
}
