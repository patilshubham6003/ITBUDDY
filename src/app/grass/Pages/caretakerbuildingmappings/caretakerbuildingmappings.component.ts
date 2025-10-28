import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiceService } from 'src/app/Service/service.service';
import { APIServicesService } from '../../Services/APIService.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-caretakerbuildingmappings',
  templateUrl: './caretakerbuildingmappings.component.html',
  styleUrls: ['./caretakerbuildingmappings.component.css'],
})
export class CaretakerbuildingmappingsComponent {
  isVisible: boolean = false;
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private cookie: CookieService
  ) { }
  searchText: string = '';
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  ngOnInit() {
    this.loadRoles();
  }
  dataList36: any;
  drawerData;
  empid;
  status;
  count;
  existingArray;
  columns2: string[][] = [['BUILDING_NAMES', 'Building Name']];
  MapBuilding(data) {
    this.drawerData = Object.assign({}, data);
    this.isVisible = true;
    this.api
      .getBuildingMaster(0, 0, '', '', ' AND IS_MAPPED=' + "'0'")
      .subscribe(
        (roles) => {
          this.roles = roles['data'];
        },
        (err) => { }
      );

    this.api
      .getBuildingsMapped(0, 0, '', '', ' AND USER_ID=' + data.USER_ID)
      .subscribe(
        (roles) => {
          if (roles['code'] == 200 && roles['count'] != 0) {
            this.dataList36 = roles['data'];
            this.roles = this.roles.concat(this.dataList36);

            for (let i = 0; i < this.roles.length; i++) {
              this.BUILDING_ID.push(Number(this.roles[i]['BUILDING_ID']));
              if (i + 1 == this.roles.length) {
                this.BUILDING_ID = [...[], ...this.BUILDING_ID];
              }
            }
          }
        },
        (err) => { }
      );
  }
  roles1;
  roles;
  BUILDING_ID: any = [];
  loadRoles() {
    this.api.getAllUsers12(0, 0, '', '', ' AND ROLE_ID=14').subscribe(
      (roles) => {
        this.roles1 = roles['data'];
      },
      (err) => { }
    );
  }
  handleCancel() {
    this.isVisible = false;
    this.BUILDING_ID = [];
    this.loadRoles();
  }
  handleOk() { }
  userId = this.cookie.get('userId');
  isSpinning = false;
  save() {
    var d: any = [];
    if (this.BUILDING_ID != undefined && this.BUILDING_ID.length > 0) {
      this.isSpinning = true;
      d = {
        CLIENT_ID: 1,
        USER_ID: this.drawerData.USER_ID,
        BUILDING_ID: this.BUILDING_ID,
      };
    }
    this.api.MapBuildings(d).subscribe((successCode) => {
      if (successCode['code'] == '200') {
        this.isSpinning = false;
        this.message.success('Buildings Mapped Successfully', '');
        this.loadRoles();
        this.isVisible = false;
        this.BUILDING_ID = [];
      } else {
        this.message.error('Buildings Mapping Failed', '');
        this.loadRoles();
        this.isVisible = false;
        this.BUILDING_ID = [];
      }
    });
  }
  pageIndex;
  search(reset: boolean = false) {
    var filter = '';
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns2.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (likeQuery) filter += likeQuery;

    this.api
      .getAllUsers12(0, 0, '', '', likeQuery + ' AND ROLE_ID=14')
      .subscribe(
        (data) => {
          this.roles1 = data['data'];
        },
        (err) => {
          //
        }
      );
  }
  keyup(event: any) {
    this.search(true);
  }
}
