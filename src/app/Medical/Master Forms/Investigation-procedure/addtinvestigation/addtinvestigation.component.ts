import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Investigation } from 'src/app/Medical/Models/Investigation';
// import { Investigation } from 'src/app/Models/BasicForms/Investigation';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-addtinvestigation',
  templateUrl: './addtinvestigation.component.html',
  styleUrls: ['./addtinvestigation.component.css']
})

export class AddtinvestigationComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Investigation;

  constructor(private _apiService: ApiService, private notificationService: NzNotificationService) { }
  city: any = []
  category: any = [];
  memonotification: any = [];
  // daaaaaaaa=[]
  ngOnInit(): void {
    // this.INVESTIGATION_MASTER = [
    //   { ID: 1, NAME: "EYE HOSPITAL" },
    //   { ID: 2, NAME: "Dental Clinic", },
    //   { ID: 3, NAME: "CANCER", },
    //   { ID: 4, NAME: "GENERAL PURPOSE", },
    //   { ID: 5, NAME: "Cardiology", },
    //   { ID: 6, NAME: "Labs", },
    //   { ID: 7, NAME: "General", },
    // ];
    this.getname();
    this.getnotification();
    this.getcity();
  }
  getcity() {
    this._apiService.getCityMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.city = data['data'];
        }
      },
      (err) => {

      }
    );
  }


  getnotification() {
    this._apiService.getAllNotification(0, 0, '', '', ' ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.memonotification = data['data'];

        }
      },
      (err) => {

      }
    );
  }

  assigneeList: any = [];
  isSpinning = false;
  logtext: string = "";

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true
  }
  getname() {
    this._apiService.getinvestigationcategory(0, 0, '', 'asc', " AND STATUS = 1").subscribe(data => {
      this.category = data['data'];
    }, err => {

      this.isSpinning = false;
    });
  }

  save(addNew: boolean, InvestigationPage: NgForm): void {


    var isOk = true;

    if (

      this.data.CITY_ID == undefined && this.data.INVESTIGATION_CATEGORY_ID == undefined && this.data.NAME == undefined && this.data.NABH_AMOUNT == undefined
      && this.data.NON_NABH_AMOUNT == undefined && this.data.SUPER_SPECIALITY_AMOUNT == undefined
    ) {
      isOk = false;
      this.notificationService.error("Please Fill All The Required Fields ", "")



    }
    else if (this.data.CITY_ID == null || this.data.CITY_ID <= 0) {
      isOk = false;
      this.notificationService.error('Please Select City Name', '');
    }
    else if (this.data.SCHEDULE_NO == null || this.data.SCHEDULE_NO <= 0) {
      isOk = false;
      this.notificationService.error('Please Enter Schedule No', '');
    }
    // else if (this.data.INVESTIGATION_CATEGORY_ID == null || this.data.INVESTIGATION_CATEGORY_ID <= 0) {
    //   isOk = false;
    //   this.notificationService.error('Please Select Category Name', '');
    // } 
    else if (this.data.NAME == undefined || this.data.NAME.trim() == "") {
      isOk = false;
      this.notificationService.error('Please Enter Investigation/Procedure Name', '');
    }
    else if (this.data.NABH_AMOUNT == null) {
      isOk = false;
      this.notificationService.error('Please Enter NABH Rate', '');
    }
    else if (this.data.NON_NABH_AMOUNT == null) {
      isOk = false;
      this.notificationService.error('Please Enter NON NABH Rate', '');
    }
    else if (this.data.SUPER_SPECIALITY_AMOUNT == null) {
      isOk = false;
      this.notificationService.error('Please Enter Super Speciality Rate', '');
    }
    // else if(this.data.PRICELIST_NAME == undefined || this.data.PRICELIST_NAME.trim() == ""){
    //   isOk = false;
    //   this.notificationService.error('Please Enter Price List Name', ''); 
    // }

    if (isOk) {
      this.isSpinning = true;
      {
        if (this.data.ID) {
          this._apiService.updateinvestigationprocedure(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.notificationService.success('Information Changed Successfully...', '');
              if (!addNew) this.drawerClose();
              this.isSpinning = false;
            } else {
              this.notificationService.error('Information Has Not Changed...', '');
              this.isSpinning = false;
            }
          });
        }
        else {
          this._apiService.createinvestigationprocedure(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.notificationService.success('Information Saved Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new Investigation();
                this.resetDrawer(InvestigationPage);
                // this.data.IMG_URL= '';

                // this._apiService.getinvestigationprocedure(1,1,'','desc','').subscribe (data =>{
                //   // if (data['count']==0){
                //   //   this.data.SEQUENCE_NUMBER=1;
                //   // }else
                //   // {
                //   //   this.data.SEQUENCE_NUMBER=data['data'][0]['SEQUENCE_NUMBER']+1;
                //   // }
                // },err=>{
                //   
                // })
              }
              this.isSpinning = false;
            } else {
              this.notificationService.error('Failed To Fill Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  checkEmailIDIsValidOrNot(EmailID: string) {
    const expression = /[a-z0-9._%+-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return expression.test(String("" + EmailID).toLowerCase());
  }

  checkMobileNoIsValidOrNot(mobileNo: number) {
    const expression = /[6-9][0-9]{9}$/;
    return expression.test(String("" + mobileNo).toLowerCase());
  }

  checkPincodeIsValidOrNot(pincode: number) {
    const expression = /[1-9]{1}[0-9]{5}$/;
    return expression.test(String("" + pincode).toLowerCase());
  }

  checkLengthOfPincode(pincode: number) {
    var len = Math.ceil(Math.log(pincode + 1) / Math.LN10);

    if (len == 6) {
      return false;

    } else {
      return true;
    }
  }

  checkLengthOfMobileNo(mobileNo: number) {
    var len = Math.ceil(Math.log(mobileNo + 1) / Math.LN10);

    if (len == 10) {
      return false;

    } else {
      return true;
    }
  }



  close(InvestigationPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(InvestigationPage);
    InvestigationPage.form.reset();
  }

  resetDrawer(InvestigationPage: NgForm) {
    this.isSpinning = false;
    InvestigationPage.form.reset();
    this.data = new Investigation();
  }

}
