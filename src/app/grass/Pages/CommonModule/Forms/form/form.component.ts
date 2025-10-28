import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormMaster } from 'src/app/grass/Models/form-master';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

// import { ClientmasterService } from 'src/app/Services/clientmaster.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: FormMaster = new FormMaster();

  isSpinning = false;

  forms: FormMaster[] = [];
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.loadForms();
  }

  loadForms() {
    this.isSpinning = true;
    let filterQuery = ' and PARENT_ID=0';
    this.api.getAllForms(0, 0, '', '', filterQuery).subscribe(
      (forms) => {
        this.forms = forms['data'];
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  resetDrawer(form1: NgForm) {
    this.data = new FormMaster();
    form1.form.markAsPristine();
    form1.form.markAsUntouched();
  }

  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean, form1: NgForm): void {
    this.isSpinning = true;

    if (this.data.NAME != undefined && this.data.NAME != '') {
      if (this.data.ID) {
        this.api.updateForm(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Form Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Form Updation Failed...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createForm(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Form Created Successfully......', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new FormMaster();
              this.resetDrawer(form1);
            }
            this.loadForms();
            this.isSpinning = false;
          } else {
            this.message.error('Form Creation Failed...', '');
            this.isSpinning = false;
          }
        });
      }
    } else {
      this.message.error('Please Fill All Required Fields...', '');
      this.isSpinning = false;
    }
  }
}
