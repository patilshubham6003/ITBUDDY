import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { InvestigationCategory } from 'src/app/Medical/Models/InvestigationCategory';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-investigation-drawer',
  templateUrl: './investigation-drawer.component.html',
  styleUrls: ['./investigation-drawer.component.css']
})

export class InvestigationDrawerComponent implements OnInit {
  @Input()
  drawerVisible: boolean = false;
  // @Input() closeDrawer: Function
  @Input() drawerClose: Function;
  @Input() data: InvestigationCategory;
  city: InvestigationCategory[] = [];
  isSpinning = false
  loadingForm = false
  forms: any = [];
  isOk = true;
  constructor(private api: ApiService, private message: NzNotificationService) { }
  // isSpinning:boolean=false;
  ngOnInit(): void {
    this.getcity();
  }
  getcity() {
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.city = data['data'];
        }
      },
      (err) => {

      }
    );
  }
  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(websitebannerPage);
    websitebannerPage.form.reset();
  }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    if (

      this.data.NAME == undefined
    ) {
      this.isOk = false;
      this.message.error("Please Fill All The Required Fields ", "")



    }
    // else if (this.data.CITY_ID == null || this.data.CITY_ID <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Select City Name', '');
    // } 
    else if (this.data.NAME == undefined || this.data.NAME.trim() == "") {
      this.isOk = false;
      this.message.error('Please Enter Category Name', '');
    }


    // else if (this.data.NAME == null || this.data.NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Category Name.', '');
    // } 
    //   else if(this.data. SEQUENCE_NUMBER== undefined || this.data. SEQUENCE_NUMBER<=0){
    //   this.isOk =false
    //   this.message.error('Please Enter Sequence Number.','')
    // }

    // create update

    if (this.isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this.api.updateinvestigationcategory(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.message.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        }
        else {
          this.api.createinvestigationcategory(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success('Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new InvestigationCategory();
                this.resetDrawer(websitebannerPage);
                // this.data.IMG_URL= '';

                this.api.getinvestigationcategory(1, 1, 'SEQUENCE_NUMBER', 'desc', '').subscribe(data => {
                  // if (data['count']==0){
                  //   this.data.SEQUENCE_NUMBER=1;
                  // }else
                  // {
                  //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                  // }
                }, err => {

                })
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

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new InvestigationCategory();
    // this.data.PARENT_GROUP_ID=this.parentgroup;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();

  }
}
