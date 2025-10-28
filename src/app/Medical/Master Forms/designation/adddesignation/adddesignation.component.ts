import { Component, Input } from '@angular/core';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Designation } from 'src/app/Modal/designation';
@Component({
  selector: 'app-adddesignation',
  templateUrl: './adddesignation.component.html',
  styleUrls: ['./adddesignation.component.css'],
})
export class AdddesignationComponent {
  isSpinning = false;
  @Input() drawerClose!: Function;
  @Input() data: Designation;
  @Input() drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  floatpat = /^[+-]?([0-9]*[.])?[0-9]+$/;
  lati_longi_patt = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.drawerClose();
  }

  resetDrawer(designation: NgForm) {
    this.data = new Designation();
    designation.form.markAsPristine();
    designation.form.markAsUntouched();
  }

  alphaOnly(event: any) {
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

  floatomit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      (charCode < 46 || charCode > 46)
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

  save(addNew: boolean, designation: NgForm): void {
    this.isOk = true;
    if (this.data.NAME == '' && this.data.SEQUENCE_NO == undefined) {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    } else if (
      this.data.NAME == '' ||
      this.data.NAME == null ||
      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Hindi  Name ', '');
    } else if (
      this.data.NAME_HN == '' ||
      this.data.NAME_HN == null ||
      this.data.NAME_HN == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Hindi  Name ', '');
    } else if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateDesignations(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createDesignations(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new Designation();
              this.resetDrawer(designation);
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
