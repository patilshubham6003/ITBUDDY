import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Role } from 'src/app/commonModule/role';

@Component({
  selector: 'app-roledetails',
  templateUrl: './roledetails.component.html',
  styleUrls: ['./roledetails.component.css']
})

export class RoledetailsComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Role;
  @Input() roleDetailsData: any = [];
  @Input() drawerVisible: boolean;

  searchText = ""
  isSpinning = false;
  loadingRecords = false;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  save() {
    this.isSpinning = true;


    this.api.addRoleDetails(this.data.ID, this.roleDetailsData).subscribe(successCode => {


      if (successCode['code'] == "200") {
        this.message.success("Role Details added Successfully", "");
        this.drawerClose();
        this.isSpinning = false;
      }

      else {
        this.message.error("Role Details assigning Failed", "");
        this.isSpinning = false;
      }
    });
  }
}
