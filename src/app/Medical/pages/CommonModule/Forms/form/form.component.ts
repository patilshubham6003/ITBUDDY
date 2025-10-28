import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
// import { Form } from '@angular/forms';
import { Form } from 'src/app/commonModule/form';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Form;
  isSpinning = false
  loadingForm = false
  forms: Form[];


  constructor(private api: ApiService, private message: NzNotificationService) {
  }

  ngOnInit() {
    this.loadForms();

  }
  loadForms() {
    this.loadingForm = true;
    this.api.getAllForms(0, 0, '', '', 'AND PARENT_ID=0').subscribe(data => {
      this.forms = data['data'];
      this.loadingForm = false;
    }, err => {

      //this.loadingForm = false;
    });
  }

  close(): void {
    this.drawerClose();
  }

  save(addNew: boolean): void {
    this.isSpinning = true;
    if (this.data.ID) {
      this.api.updateForm(this.data)
        .subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.message.success("Form Information Updated Successfully", "");
            if (!addNew)
              this.drawerClose();
            this.isSpinning = false;
          }
          else {
            this.message.error("Failed to Update Form Information", "");
            this.isSpinning = false;
          }
        });
    }
    else {
      this.data.ICON = ""
      this.api.createForm(this.data)
        .subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.message.success("Form Information Added Successfully", "");
            if (!addNew)
              this.drawerClose();
            else {

              this.data = new Form();
            }
            this.isSpinning = false;
          }
          else {
            this.message.error("Failed to Add Form Information", "");
            this.isSpinning = false;
          }
        });
    }
    this.loadForms()
  }


}