import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { Form } from 'src/app/commonModule/form';
import { Role } from 'src/app/commonModule/role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  providers: [DatePipe]
})

export class RoleComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Role;
  isSpinning = false
  roleLoading = false
  moduleLoading = false
  @Input() drawerVisible: boolean;
  roles: Role[];
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMddHHmmss')
  fileDataLOGO_URL: any = null
  folderName = "roleIcon"
  fKey = ""
  roleId = sessionStorage.getItem("roleId")
  formData: Form[]

  constructor(private api: ApiService, private datePipe: DatePipe, private message: NzNotificationService) { }

  ngOnInit() {
    this.loadRoles()
  }

  close(): void {
    this.drawerClose();
  }

  loadRoles() {
    this.roleLoading = true;
    var Filter = ""
    if (this.roleId != "1")
      Filter = " AND ID=" + this.roleId;
    else
      Filter = " AND PARENT_ID=0"
    this.api.getAllRoles(0, 0, '', '', Filter).subscribe(roles => {
      this.roles = roles['data'];
      this.roleLoading = false;
    }, err => {

      this.roleLoading = false;
    });
  }

  onFileSelectedLOGO_URL(event) {
    this.fileDataLOGO_URL = <File>event.target.files[0];

    var fileExt = this.fileDataLOGO_URL.name.split('.').pop();
  }

  save(addNew: boolean): void {
    if (this.data.NAME != undefined && this.data.NAME != "") {
      if (/^[a-zA-Z\s-, ]*$/.test(this.data.NAME) == true) {

        if (this.data.DESCRIPTION == "")
          this.data.DESCRIPTION = " "
        if (this.data.START_PAGE.startsWith("/")) {

          this.api.getAllForms(0, 0, 'ID', 'desc', "").subscribe(data => {
            this.formData = data['data'];

            var filterData = this.formData.filter(object => {
              return object['LINK'] == this.data.START_PAGE
            });

            if (filterData.length > 0) {
              this.isSpinning = true;
              if (this.data.ID) {

                this.api.updateRole(this.data)
                  .subscribe(successCode => {

                    if (successCode['code'] == "200") {
                      this.message.success("Role Updated Successfully", "");
                      if (!addNew)
                        this.drawerClose();
                      this.isSpinning = false;

                    }
                    else {

                      this.message.error("Role Updation Failed", "");
                      this.isSpinning = false;
                    }
                  });
              }
              else {

                this.api.createRole(this.data)
                  .subscribe(successCode => {

                    if (successCode['code'] == "200") {
                      this.message.success("Role Created Successfully", "");
                      if (!addNew)
                        this.drawerClose();
                      else {

                        this.data = new Role();
                      }
                      this.loadRoles()
                      this.isSpinning = false;
                    }
                    else {
                      this.message.error("Role Creation Failed", "");
                      this.isSpinning = false;
                    }
                  });
              }
            }
            else {
              this.message.error("Your Entered StartPage is not present in Database", "");
            }
          }, err => {

          });
        }
        else {
          this.message.error("Please Enter Valid StartPage", "");
        }
      }
      else {
        this.message.error("Please Check Name", "");
      }
    }
    else {
      this.message.error("Please Fill All Required Fields", "");
      this.isSpinning = false;
    }
  }
}