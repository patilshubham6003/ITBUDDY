import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ObjectionMaster } from 'src/app/grass/Models/ObjectionMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-objectionhistory',
  templateUrl: './objectionhistory.component.html',
  styleUrls: ['./objectionhistory.component.css'],
})
export class ObjectionhistoryComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data!: ObjectionMaster;
  isSpinning = false;
  arrray: any = [];
  userid: any;
  roleid: any;

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.userid = Number(sessionStorage.getItem('userId'));
    this.roleid = Number(sessionStorage.getItem('roleId'));

    this.isSpinning = true;
    if (this.data != undefined) {
      let datacheck = this.data[0];
      this.api
        .getObjectionMaster(
          0,
          0,
          'id',
          'asc',
          ' AND FLAT_REQUEST_ID = ' +
          datacheck.FLAT_REQUEST_ID +
          ' AND EMPLOYEE_ID = ' +
          datacheck.EMPLOYEE_ID +
          ' AND SENIORITY_LIST_ID = ' +
          datacheck.SENIORITY_LIST_ID
        )
        .subscribe(
          (data) => {
            this.arrray = data['data'];

            this.isSpinning = false;
          },
          (error) => { }
        );
    }
  }

  close() {
    this.drawerClose();
  }
}
