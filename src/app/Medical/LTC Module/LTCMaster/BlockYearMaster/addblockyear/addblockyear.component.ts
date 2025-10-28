import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BlockYear } from 'src/app/Medical/Models/blockyearmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-addblockyear',
  templateUrl: './addblockyear.component.html',
  styleUrls: ['./addblockyear.component.css'],
})
export class AddblockyearComponent implements OnInit {
  constructor(
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning = false;
  isOk = true;
  mobilepattern = /^[6-9]\d{9}$/;
  ngOnInit(): void {}
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: BlockYear;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  close(blockYearPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(blockYearPage);
    blockYearPage.form.reset();
  }

  resetDrawer(blockYearPage: NgForm) {
    this.data = new BlockYear();
    blockYearPage.form.markAsPristine();
    blockYearPage.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, blockYearPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    if (this.data.YEAR == null || this.data.YEAR.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Year', '');
    }else
    if (this.data.SPECIFICATION == null || this.data.SPECIFICATION.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Specification', '');
    }
    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateBlockYearMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) {
                this.drawerClose();
                this.isSpinning = false;
                blockYearPage.form.reset();
              }
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        } else {
          this.api.createBlockYearMaster(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) {
                this.drawerClose();
                blockYearPage.form.reset();
              } else {
                this.data = new BlockYear();
                this.resetDrawer(blockYearPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }
}
