import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Designation } from 'src/app/Modal/designation';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
})
export class DesignationComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Designation = new Designation();
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  details: any = [];

  constructor(
    private api: ServiceService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {}
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

  save(addNew: boolean): void {
    var isOk = true;
    if (this.data.NAME == undefined || this.data.NAME.trim() == '') {
      this.message.error('Please Enter Designation', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    }
    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateDesignation(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Designation information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to update Designation information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createDesignation(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Designation information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Designation();
              this.api
                .getAllDesignation(1, 1, 'SEQUENCE_NO', 'desc', '')
                .subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.SEQUENCE_NO = 1;
                    } else {
                      this.data.SEQUENCE_NO =
                        data['data'][0]['SEQUENCE_NO'] + 1;
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
              // this.logtext = 'Save & New - OrgInfo form - SUCCESS - '+ JSON.stringify(this.data)+" KEYWORD [C - OrgInfo ]";
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to add Designation information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
