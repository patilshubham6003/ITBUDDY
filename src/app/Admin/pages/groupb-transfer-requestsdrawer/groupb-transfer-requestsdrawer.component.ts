import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmpTransferDataForEdit } from 'src/app/Modal/employeeQuarterForm';
import { WebsiteService } from 'src/app/Service/website.service';
@Component({
  selector: 'app-groupb-transfer-requestsdrawer',
  templateUrl: './groupb-transfer-requestsdrawer.component.html',
  styleUrls: ['./groupb-transfer-requestsdrawer.component.css'],
  providers: [DatePipe],
})
export class GroupbTransferRequestsdrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: EmpTransferDataForEdit = new EmpTransferDataForEdit();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  details: any = [];
  isSpinningCom: boolean = false;
  isOk: boolean = false;

  constructor(
    private api: WebsiteService,
    private message: NzNotificationService,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {}
  close(): void {
    this.drawerClose();
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

  disabledDate2222 = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current < today;
  };

  save(addNew: boolean): void {
    console.log(addNew);
    // this.isOk = true;
    // if (
    //   this.data.HA_REQUEST == null ||
    //   this.data.HA_REQUEST == undefined ||
    //   this.data.HA_REQUEST == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Officer Request Type', '');
    // } else if (this.data.HA_REQUEST == 'Officer Name' &&
    //   (this.data.HA_REQUEST_NAME == null ||
    //     this.data.HA_REQUEST_NAME == undefined ||
    //     this.data.HA_REQUEST_NAME == '')
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Officer Name', '');
    // } else if (
    //   this.data.HA_DATE == null ||
    //   this.data.HA_DATE == undefined ||
    //   this.data.HA_DATE == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Select Request Date', '');
    // }
    // if (this.isOk) {

    var datafortransfer = {
      HA_DATE: (this.data.HA_DATE = this.datePipe.transform(
        this.data.HA_DATE,
        'yyyy-MM-dd'
      )),
      HA_REQUEST: this.data.HA_REQUEST,
      HA_REMARK: this.data.HA_REMARK,
      ID: this.data.ID,
    };
    this.isSpinningCom = true;
    this.api.updateemployeeTransferRequest(datafortransfer).subscribe(
      (successCode) => {
        if (successCode.code == 200) {
          this.message.success(
            'Employee Transfer Request Updated Successfully',
            ''
          );
          this.isSpinningCom = false;
          this.drawerClose();
        } else {
          this.message.error('Employee Transfer Request Updation Failed', '');
          this.isSpinningCom = false;
        }
      },
      (err) => {
        this.message.error('Something went wrong, Please try again.', '');
        this.isSpinningCom = false;
        console.log(err);
      }
    );
    // }
  }
}
