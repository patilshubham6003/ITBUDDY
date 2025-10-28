import { Component, HostListener, Input, OnInit, ViewChild, } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { differenceInCalendarDays } from 'date-fns';
import { EMPEDUCATIONDETAILS, ExamMaster, Family, OtherInfoOptionalMaster, Personalinfo, address, services } from 'src/app/Modal/profile';
import { appkeys } from 'src/app/app.constant';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BehaviorSubject } from 'rxjs';
import { WebsiteService } from 'src/app/Service/website.service';

@Component({
  selector: 'app-oldemployeeprofile',
  templateUrl: './oldemployeeprofile.component.html',
  styleUrls: ['./oldemployeeprofile.component.css']
})
export class OldemployeeprofileComponent {
  @Input() drawerVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() personalinformation: Personalinfo;
  @Input() addnew: any;
  @Input() empstatus: any;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  panpattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  show: boolean = false;
  scrHeight: any;
  scrWidth: any;
  Dwidth: string;
  imgurl = appkeys.retriveimgUrl;
  LanguageListsFor1: any[] = [];
  LanguageListsFor2: any[] = [];
  LanguageListsFor3: any[] = [];
  LanguageListsFor4: any[] = [];

  LanguageLists: any[] = [
    { name: "Arabic", value: "Arabic" },
    { name: "Assamese", value: "Assamese" },
    { name: "Bihari", value: "Bihari" },
    { name: "Bengali", value: "Bengali" },
    { name: "Bodo", value: "Bodo" },
    { name: "Chinese", value: "Chinese" },
    { name: "Dogri", value: "Dogri" },
    { name: "English", value: "English" },
    { name: "German", value: "German" },
    { name: "Gujarati", value: "Gujarati" },
    { name: "Greek", value: "Greek" },
    { name: "Hindi", value: "Hindi" },
    { name: "Italian", value: "Italian" },
    { name: "Japanese", value: "Japanese" },
    { name: "Kannada", value: "Kannada" }, { name: "Korean", value: "Korean" },
    { name: "Kashmiri", value: "Kashmiri" },
    { name: "Konkani", value: "Konkani" },
    { name: "Latin", value: "Latin" },
    { name: "Malayalam", value: "Malayalam" },
    { name: "Maithili", value: "Maithili" },
    { name: "Manipuri", value: "Manipuri" },
    { name: "Marathi", value: "Marathi" }, { name: "Nepali", value: "Nepali" },
    { name: "Oriya", value: "Oriya" }, { name: "Punjabi", value: "Punjabi" },
    { name: "Russian", value: "Russian" }, { name: "Sanskrit", value: "Sanskrit" },
    { name: "Santali", value: "Santali" },
    { name: "Sindhi", value: "Sindhi" }, { name: "Spanish", value: "Spanish" },
    { name: "Tamil", value: "Tamil" }, { name: "Telugu", value: "Telugu" },
    { name: "Turkish", value: "Turkish" }, { name: "Urdu", value: "Urdu" },
  ]
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  constructor(
    public api: WebsiteService,
    public api1: WebsiteService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) {
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '80%';
    }
  }
  personalinformationEMAIL_IDtrue: boolean = false;
  personalinformationMOBILE_NOTrue: boolean = false;
  dateDOB: any;
  roleid = Number(sessionStorage.getItem('roleId'))
  ngOnInit() {
    this.EMPLOYEE_CODE = sessionStorage.getItem('Empcode');
    this.personalinformation.MOBILE_NO = sessionStorage.getItem('loginmobileNo');
    if (sessionStorage.getItem('loginmobileNo') != null && sessionStorage.getItem('loginmobileNo') != undefined && sessionStorage.getItem('loginmobileNo') != '') {
      this.personalinformationMOBILE_NOTrue = true;
    } else {
      this.personalinformationMOBILE_NOTrue = false;
    }
    this.personalinformation.EMAIL_ID = sessionStorage.getItem('emailId');
    if (sessionStorage.getItem('emailId') != null && sessionStorage.getItem('emailId') != undefined && sessionStorage.getItem('emailId') != '') {
      this.personalinformationEMAIL_IDtrue = true;
    } else {
      this.personalinformationEMAIL_IDtrue = false;
    }
    this.personalinformation.EMPLOYEE_CODE = sessionStorage.getItem('Empcode');

    this.personalinformation.NAME = sessionStorage.getItem('userName');
    this.LanguageListsFor1 = this.LanguageLists;
    this.LanguageListsFor2 = this.LanguageLists;
    this.LanguageListsFor3 = this.LanguageLists;
    this.LanguageListsFor4 = this.LanguageLists;

    if (this.addnew == true) {
      this.tabs = [
        {
          name: 'Personal Details',
          disabled: false,
        },
        {
          name: 'Address Details',
          disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true
        },
        {
          name: 'Service Details',
          disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
        },
        {
          name: 'Family Details',
          disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
        },
        {
          name: 'Education Data',
          disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
        },
        {
          name: 'Exam Data',
          disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
        },
        {
          name: 'Other Details',
          disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
        }
      ];
    } else {
      this.tabs = [
        {
          name: 'Personal Details',
          disabled: false,
        },
        {
          name: 'Address Details',
          disabled: false,
        },
        {
          name: 'Service Details',
          disabled: false,
        },
        {
          name: 'Family Details',
          disabled: false,
        },
        {
          name: 'Education Data',
          disabled: false,
        },
        {
          name: 'Exam Data',
          disabled: false,
        },
        {
          name: 'Other Details',
          disabled: false,
        }
      ];
    }


    this.ListOfCategory();
    this.ListOfsubCategory();

    const eighteenYearsAgo = new Date();

    if (
      this.personalinformation.DOB == null ||
      this.personalinformation.DOB == undefined ||
      this.personalinformation.DOB == ''
    ) {
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      this.dateDOB = eighteenYearsAgo;
    }

  }

  disabledDate18years = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (current > new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };
  changecat(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.CategoryList.filter((item) => item.ID == Number(dd));
      this.personalinformation.CATEGORY_NAME = posttypedata[0].NAME;
    }
  }
  changesubcat(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.subCategoryList.filter((item) => item.ID == Number(dd));
      this.personalinformation.SUB_CATEGORY_NAME = posttypedata[0].NAME;
    }
  }

  changetempstate(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.State.filter((item) => item.ID == Number(dd));
      this.address.TEMP_STATE_NAME = posttypedata[0].NAME;
    }
  }
  changetempcity(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.City1.filter((item) => item.ID == Number(dd));
      this.address.TEMP_CITY_NAME = posttypedata[0].NAME;
    }
  }

  changeperstate(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.State.filter((item) => item.ID == Number(dd));
      this.address.PERMANENT_STATE_NAME = posttypedata[0].NAME;
    }
  }
  changepercity(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.City.filter((item) => item.ID == Number(dd));
      this.address.PERMANENT_CITY_NAME = posttypedata[0].NAME;
    }
  }

  getposttypeid(event: any) {
    if (event != null && event != undefined) {
      let sss = this.ranksss.filter((item) => item.MDB_ID == Number(event));
      this.service.RANK_NAME = sss[0].NAME;
    }
  }
  officeranks(event: any) {
    // this.service.RANK_ID = undefined;
    if (event != undefined && event != null) {
      let posttypedata = this.Offices.filter((item) => item.MDB_ID == Number(event));
      this.service.OFFICE_NAME = posttypedata[0].NAME;
    }
  }
  changecalss(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.class.filter((item) => item.ID == Number(dd));
      this.service.CLASS_NAME = posttypedata[0].NAME;
      this.service.RANK_ID = undefined;
      this.api.getallDesignationForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND CLASS_ID=' + dd)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.ranksss = data['data'];
              } else {
              }
            }
          },
          (err) => { }
        );
    } else {
      this.ranksss = [];
      this.service.RANK_ID = undefined;
    }
  }
  rankofentry(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.Ranks.filter((item) => item.MDB_ID == Number(dd));
      this.service.RANK_ID_GOV_SERVICE_NAME = posttypedata[0].NAME;
    }
  }
  rankofentry1(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.Ranks.filter((item) => item.MDB_ID == Number(dd));
      this.service.RANK_ID_IT_IND_SERVICE_NAME = posttypedata[0].NAME;
    }
  }
  rankofentry2(dd: any) {
    if (dd != null && dd != undefined) {
      let posttypedata = this.Ranks.filter((item) => item.MDB_ID == Number(dd));
      this.service.RANK_ID_IT_STATE_SERVICE_NAME = posttypedata[0].NAME;
    }
  }
  tabs = [
    {
      name: 'Personal Details',
      disabled: false,
    },
    {
      name: 'Address Details',
      disabled: false,
    },
    {
      name: 'Service Details',
      disabled: false,
    },
    {
      name: 'Family Details',
      disabled: false,
    },
    {
      name: 'Education Data',
      disabled: false,
    },

    {
      name: 'Exam Data',
      disabled: false,
    },

    {
      name: 'Other Details',
      disabled: false,
    }
  ];

  close(websitebannerPage: NgForm) {
    this.drawerClose();
    this.getstatusdata();
    websitebannerPage.form.reset();
  }

  empno: any = '';
  designationList: any = [];
  religionList: any = [];
  CategoryList: any = [];
  subCategoryList: any = [];
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
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false;
  }
  ListOfDesignation() {
    if (this.designationList.length == 0) {
      this.api.getallDesignationForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND MDB_ID is not NULL')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.designationList = data['data'];
                this.Designation = data['data'];
                this.designation = data['data'];
              } else {
                this.designationList = [];
              }
            } else {
              this.message.error("Can't Load Designation Data", '');
            }
          },
          (err) => { }
        );
    }
  }

  ListOfreligion() {
    if (this.religionList.length == 0) {
      this.api
        .getreligionData(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.religionList = data['data'];
              } else {
                this.religionList = [];
              }
            } else {
              this.message.error("Can't Load Designation Data", '');
            }
          },
          (err) => { }
        );
    }
  }

  ListOfsubCategory() {
    if (this.subCategoryList.length == 0) {
      this.api
        .getAllSubcategoryMasterData(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.subCategoryList = data['data'];
              } else {
                this.subCategoryList = [];
              }
            } else {
              this.message.error("Can't Load Designation Data", '');
            }
          },
          (err) => { }
        );
    }
  }

  ListOfCategory() {
    if (this.CategoryList.length == 0) {
      this.api
        .getcategoryData(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              if (data['data'].length > 0) {
                this.CategoryList = data['data'];
              } else {
                this.CategoryList = [];
              }
            } else {
              this.message.error("Can't Load Designation Data", '');
            }
          },
          (err) => { }
        );
    }
  }

  percent5: any = 0;
  progressBar5: any = false;

  clearprofile(url: any, folder: any) {
    this.personalinformation.PROFILE_PHOTO = null;
    this.progressBar5 = false;
    this.percent5 = 0;
  }

  getimg() {
    var photo = '';

    if (this.personalinformation.PROFILE_PHOTO != null) {
      photo =
        this.imgurl +
        'profileImages/' +
        this.personalinformation.PROFILE_PHOTO;
    }
    return photo;
  }



  timer5: any;
  profilePDF: any;
  urlprofilePdf: any;
  isSpinning: boolean = false;
  isOk: boolean = false;

  onFileSelectedphoto(event: any) {
    if (event.target.files.length == 0) {
      this.message.error('Please select profile photo', '');
      this.profilePDF = null;
    } else if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.profilePDF = <File>event.target.files[0];
    } else {
      this.message.error('Please select olny JPEG/ JPG/ PNG files.', '');
      this.profilePDF = null;
    }

    if (this.profilePDF != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.profilePDF.name.split('.').pop();
      var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      this.urlprofilePdf = url;
      this.uploadImage(this.profilePDF, this.urlprofilePdf);
    }
  }

  uploadImage(urldemo: any, url: any) {
    this.isSpinning = true;
    this.progressBar5 = true;
    this.timer5 = this.api1.onUpload2('ProfileIMG', urldemo, url).subscribe(
      (res) => {
        if (res.type === HttpEventType.Response) {
        }
        if (res.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * res.loaded) / res.total);
          this.percent5 = percentDone;
          if (this.percent5 == 100) {
            this.isSpinning = false;
          }
        } else if (res.type == 2 && res.status != 200) {
          this.message.error('Failed To Upload File...', '');
          this.isSpinning = false;
          this.progressBar5 = false;
          this.percent5 = 0;
          this.personalinformation.PROFILE_PHOTO = null;
          this.isSpinning = false;
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            this.message.success('Profile Photo Uploaded Successfully...', '');
            this.isSpinning = false;
            this.personalinformation.PROFILE_PHOTO = this.urlprofilePdf;
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        }
      },
      (error) => {
        this.isSpinning = false;
      }
    );
  }

  EMPLOYEE_CODE: any;

  isValidMobile(mobile: string) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String('' + mobile).toLowerCase());
  }
  savepersonal(): void {
    this.isOk = true;
    if (!this.personalinformation.EMPLOYEE_CODE)
      this.personalinformation.EMPLOYEE_CODE = this.empno;

    if (this.personalinformation.NAME == undefined || this.personalinformation.NAME == null || this.personalinformation.NAME == '') {
      this.isOk = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.personalinformation.OFFICE_MAIL_ID == undefined || this.personalinformation.OFFICE_MAIL_ID == null || this.personalinformation.OFFICE_MAIL_ID.toString().trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Personal Email ID', '');
    } else if (!this.emailpattern.test(this.personalinformation.OFFICE_MAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Personal Email ID', '');
    } else if (
      this.personalinformation.OFFICE_MOBILE_NO == undefined || this.personalinformation.OFFICE_MOBILE_NO == null || this.personalinformation.OFFICE_MOBILE_NO.toString().trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Personal Mobile No.', '');
    } else if (!this.isValidMobile(this.personalinformation.OFFICE_MOBILE_NO)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Personal Mobile No.', '');
    } else if (this.personalinformation.DOB == undefined || this.personalinformation.DOB == null || this.personalinformation.DOB == '') {
      this.isOk = false;
      this.message.error('Please Select Date Of Birth', '');
    } else if (this.personalinformation.EMPLOYEE_CODE == undefined || this.personalinformation.EMPLOYEE_CODE == null || this.personalinformation.EMPLOYEE_CODE == '') {
      this.isOk = false;
      this.message.error('Please Enter Employee Code', '');
    } else if (this.personalinformation.GENDER == null || this.personalinformation.GENDER == undefined || this.personalinformation.GENDER == '') {
      this.isOk = false;
      this.message.error('Please Select Gender', '');
    } else if (
      this.personalinformation.EMAIL_ID == undefined || this.personalinformation.EMAIL_ID == null || this.personalinformation.EMAIL_ID.toString().trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Official Email ID', '');
    } else if (!this.emailpattern.test(this.personalinformation.EMAIL_ID)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Official Email ID', '');
    } else if (
      this.personalinformation.MOBILE_NO == undefined || this.personalinformation.MOBILE_NO == null || this.personalinformation.MOBILE_NO.toString().trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Official Mobile No.', '');
    } else if (!this.isValidMobile(this.personalinformation.MOBILE_NO)) {
      this.isOk = false;
      this.message.error('Please Enter Valid Official Mobile No.', '');
    } else if (this.personalinformation.MARRITAL_STATUS == null || this.personalinformation.MARRITAL_STATUS == undefined || this.personalinformation.MARRITAL_STATUS == '') {
      this.isOk = false;
      this.message.error('Please Select Marital Status', '');
    } else if (this.personalinformation.BLOOD_GROUP == null || this.personalinformation.BLOOD_GROUP == undefined || this.personalinformation.BLOOD_GROUP == '') {
      this.isOk = false;
      this.message.error('Please Select Blood Group', '');
    } else if (this.personalinformation.PAN_CARD == '' || this.personalinformation.PAN_CARD == undefined || this.personalinformation.PAN_CARD == null) {
      this.isOk = false;
      this.message.error('Please Enter PAN Card No.', '');
    } else if (!this.panpattern.test(this.personalinformation.PAN_CARD.toUpperCase())) {
      this.isOk = false;
      this.message.error('Please Enter Valid PAN Card No.', '');
    } else if (this.personalinformation.AADHAR_NO == '' || this.personalinformation.AADHAR_NO == undefined || this.personalinformation.AADHAR_NO == null) {
      this.isOk = false;
      this.message.error('Please Enter Aadhar No.', '');
    } else if (this.personalinformation.MOTHER_TONGUE == '' || this.personalinformation.MOTHER_TONGUE == undefined || this.personalinformation.MOTHER_TONGUE == null) {
      this.isOk = false;
      this.message.error('Please Enter Your Mother Tongue', '');
    }
    //  else if (this.personalinformation.CATEGORY_ID == null || this.personalinformation.CATEGORY_ID == undefined || this.personalinformation.CATEGORY_ID == '' || this.personalinformation.CATEGORY_ID == 0) {
    //   this.isOk = false;
    //   this.message.error('Please Select Category', '');
    // }
    else if (this.personalinformation.PROFILE_PHOTO == null || this.personalinformation.PROFILE_PHOTO == undefined || this.personalinformation.PROFILE_PHOTO == '') {
      this.isOk = false;
      this.message.error('Please Upload Profile Photo', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.personalinformation.EMAIL_ID == undefined || this.personalinformation.EMAIL_ID == '') {
        this.personalinformation.EMAIL_ID = null;
      }
      if (this.personalinformation.DOB) {
        this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
      } else {
        this.personalinformation.DOB = null;
      }

      if (this.empno) {
        this.personalinformation.EMPLOYEE_CODE = this.empno;
      }

      this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
      this.personalinformation.STATUS = 1;
      this.personalinformation.IS_PERSONAL_FILLED = 1;
      this.personalinformation.IS_UPDATED = true;
      this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          sessionStorage.setItem('emailId', this.personalinformation.EMAIL_ID)
          sessionStorage.setItem('loginmobileNo', this.personalinformation.MOBILE_NO)
          this.isSpinning = false;
          this.getpersonaldata();
          this.getstatusdata();
          this.message.success('Personal Details Updated Successfully...', '');
        } else if (successCode['code'] == '300') {
          this.message.error('Email ID / Mobile No. Already Exists', '');
          this.isSpinning = false;
        } else {
          this.message.error('Failed To Update Personal Details', '');
          this.isSpinning = false;
        }
      }, (err) => {
        this.isSpinning = false;
        this.message.error('Something Went Wrong, Please Try Again Later', '');
      });
    }
  }

  outertab: any = 0;
  innertab: any = 0;

  onSelectedIndexChange(event: any) {
    this.outertab = event;
    if (event == 0) {
      this.getpersonaldata();
    } else if (event == 1) {
      this.getCity();
      this.getallState();
      this.getAddress();
    } else if (event == 2) {
      this.getallservicemastersdata();
      this.getallOffice();
      this.ListOfDesignation();
    } else if (event == 3) {
      this.searchFamily();
    }
    else if (event == 4) {
      this.searchEducation();
    }
    else if (event == 5) {
      this.examSearch();
    }
    else if (event == 6) {
      this.getOtherInfoOptionalDetails();
    }
  }

  onSelectedIndexChangeinside(event: any) {
    this.innertab = event;
    if (event == 5) {
      this.getRankMaster();
    }
  }

  service: services = new services();
  Ranks: any = [];
  Designation: any = [];
  ranksss: any = [];

  officeranks1234(event: any) {
    this.api
      .getallDesignationForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND MDB_ID is not NULL')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ranksss = data['data'];
            } else {
            }
          }
        },
        (err) => { }
      );
  }
  getallservicemastersdata() {
    this.isSpinning = true;
    if (this.Offices.length == 0 || this.Ranks.length == 0 || this.class.length == 0) {
      this.api.getAllOfficeForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1  AND MDB_ID is not NULL').subscribe((data) => {
        this.Offices = data['data'];
        this.api.getallDesignationForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND MDB_ID is not NULL').subscribe((data) => {
          this.Ranks = data['data'];
          this.api.getAllClass(0, 0, 'NAME', 'asc', ' AND STATUS=1').subscribe((data) => {
            this.class = data['data'];
            this.api1.getAllServiceDetails(0, 0, '', 'desc', ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId')).subscribe((data) => {
              if (data.code == '200' && data.data.length > 0) {
                this.service = data['data'][0];

                if (this.service.RANK_ID_IT_IND_SERVICE != null && this.service.RANK_ID_IT_IND_SERVICE != undefined && this.service.RANK_ID_IT_IND_SERVICE != 0) {
                  this.service.RANK_ID_IT_IND_SERVICE = Number(this.service.RANK_ID_IT_IND_SERVICE)
                }
                // if (
                //   this.service.CLASS_ID != null &&
                //   this.service.CLASS_ID != undefined &&
                //   this.service.CLASS_ID != 0
                // ) {
                this.officeranks1234(this.service.CLASS_ID);
                // }
                this.isSpinning = false;
              } else {
                this.service = new services();
                this.isSpinning = false;
              }
            },
              (err) => {
                this.isSpinning = false;
              }
            );
          },
            (err) => {
              this.isSpinning = false;
            }
          );
        },
          (err) => {
            this.isSpinning = false;
          }
        );
      },
        (err) => {
          this.isSpinning = false;
        }
      );
    } else {
      this.api1.getAllServiceDetails(0, 0, '', 'desc', ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId') + '').subscribe((data) => {
        if (data.code == '200' && data.data.length > 0) {
          this.service = data['data'][0];
          this.isSpinning = false;
          if (this.service.RANK_ID_IT_IND_SERVICE != null && this.service.RANK_ID_IT_IND_SERVICE != undefined && this.service.RANK_ID_IT_IND_SERVICE != 0) {
            this.service.RANK_ID_IT_IND_SERVICE = Number(this.service.RANK_ID_IT_IND_SERVICE)
          }
          // if (
          //   this.service.CLASS_ID != null &&
          //   this.service.CLASS_ID != undefined &&
          //   this.service.CLASS_ID != 0
          // ) {
          this.officeranks1234(this.service.CLASS_ID);
          // }
        } else {
          this.service = new services();

          if (
            this.personalinformation.DOB != null &&
            this.personalinformation.DOB != undefined &&
            this.personalinformation.DOB != ''
          ) {
            var dob = new Date(this.personalinformation.DOB);
            const year = dob.getFullYear() + 60;
            const month = dob.getMonth() + 1;
            const lastDay = new Date(year, month, 0).getDate();
            var lastDayOfMonth = new Date(year, month - 1, lastDay);
            this.service.RETIREMENT_DATE = this.datepipe.transform(
              lastDayOfMonth,
              'yyyy-MM-dd'
            );
          }

          this.isSpinning = false;
        }
      },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }

  Offices: any = [];

  saveservices(): void {
    var isOk = true;
    if (this.service.OFFICE_ID == null || this.service.OFFICE_ID == undefined || this.service.OFFICE_ID == 0) {
      isOk = false;
      this.message.error(' Please Select Office', '');
    } else if (this.service.CLASS_ID == null || this.service.CLASS_ID == undefined || this.service.CLASS_ID == 0) {
      isOk = false;
      this.message.error(' Please Select Group', '');
    } else if (this.service.RANK_ID == null || this.service.RANK_ID == undefined || this.service.RANK_ID == 0) {
      isOk = false;
      this.message.error(' Please Select Rank', '');
    }
    else if (this.service.ICARD_NO == null || this.service.ICARD_NO == undefined || this.service.ICARD_NO == '' || this.service.ICARD_NO == '') {
      isOk = false;
      this.message.error(' Please Enter I-Card No.', '');
    } else if (this.service.DOJ_PRESENT_POST == null || this.service.DOJ_PRESENT_POST == undefined || this.service.DOJ_PRESENT_POST == '') {
      isOk = false;
      this.message.error(' Please Select Joining Date At Present Post', '');
    } else if (this.service.DOJ_PRESENT_RANK == null || this.service.DOJ_PRESENT_RANK == undefined || this.service.DOJ_PRESENT_RANK == '') {
      isOk = false;
      this.message.error(' Please Select Joining Date At Present Rank', '');
    } else if (this.service.DOE_GOV_SERVICE == null || this.service.DOE_GOV_SERVICE == undefined || this.service.DOE_GOV_SERVICE == '') {
      isOk = false;
      this.message.error(' Please Select Date Of Entry To Govt. Service', '');
    } else if (this.service.RANK_ID_GOV_SERVICE_NAME == null || this.service.RANK_ID_GOV_SERVICE_NAME == undefined || this.service.RANK_ID_GOV_SERVICE_NAME == '') {
      isOk = false;
      this.message.error(' Please Enter Rank of Entry For Govt. Service', '');
    } else if (this.service.DOJ_IT_STATE == null || this.service.DOJ_IT_STATE == undefined || this.service.DOJ_IT_STATE == '') {
      isOk = false;
      this.message.error('Please Select Joining Date In IT Department Mumbai', '');
    } else if (this.service.RANK_ID_IT_STATE_SERVICE == null || this.service.RANK_ID_IT_STATE_SERVICE == undefined || this.service.RANK_ID_IT_STATE_SERVICE == 0) {
      isOk = false;
      this.message.error('Please Select Rank of Entry For IT Department Mumbai', '');
    }

    if (isOk) {
      if (this.service.RETIREMENT_DATE) {
        this.service.RETIREMENT_DATE = this.datepipe.transform(
          this.service.RETIREMENT_DATE,
          'yyyy-MM-dd'
        );
      } else {
        this.service.RETIREMENT_DATE = null;
      }

      if (this.service.DOJ_PRESENT_POST) {
        this.service.DOJ_PRESENT_POST = this.datepipe.transform(
          new Date(this.service.DOJ_PRESENT_POST),
          'yyyy-MM-dd'
        );
      } else {
        this.service.DOJ_PRESENT_POST = null;
      }

      if (this.service.DOJ_PRESENT_RANK) {
        this.service.DOJ_PRESENT_RANK = this.datepipe.transform(
          new Date(this.service.DOJ_PRESENT_RANK),
          'yyyy-MM-dd'
        );
      } else {
        this.service.DOJ_PRESENT_RANK = null;
      }

      if (this.service.DOE_GOV_SERVICE) {
        this.service.DOE_GOV_SERVICE = this.datepipe.transform(
          new Date(this.service.DOE_GOV_SERVICE),
          'yyyy-MM-dd'
        );
      } else {
        this.service.DOE_GOV_SERVICE = null;
      }

      if (this.service.DOJ_IT_IND) {
        this.service.DOJ_IT_IND = this.datepipe.transform(
          new Date(this.service.DOJ_IT_IND),
          'yyyy-MM-dd'
        );
      } else {
        this.service.DOJ_IT_IND = null;
      }

      if (this.service.DOJ_IT_STATE) {
        this.service.DOJ_IT_STATE = this.datepipe.transform(
          new Date(this.service.DOJ_IT_STATE),
          'yyyy-MM-dd'
        );
      } else {
        this.service.DOJ_IT_STATE = null;
      }
      this.isSpinning = true;
      this.service.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
      this.service.IS_UPDATED = true;
      if (this.service.ID) {
        this.api1.updateServiceDetails(this.service).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Service Details Updated Successfully', '');
            this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
            this.personalinformation.STATUS = 1;
            this.personalinformation.IS_SERVICE_FILLED = 1;
            this.personalinformation.IS_UPDATED = true;
            this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
            this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.isSpinning = false;
                this.api1.getAllServiceDetails(0, 0, '', 'desc', ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId') + '').subscribe(
                  (data) => {
                    if (data.code == '200' && data.data.length > 0) {
                      this.service = data['data'][0];
                      this.isSpinning = false;
                    } else {
                      this.isSpinning = false;
                    }
                  },
                  (err) => {
                    this.isSpinning = false;
                  }
                );
                this.getstatusdata();
              } else {
                this.isSpinning = false;
              }
            }, (err) => {
              this.isSpinning = false;
            });
            this.isSpinning = false;
          } else {
            this.message.error('Service Details Updation Failed', '');
            this.isSpinning = false;
          }
        }, err => {
          this.message.error('Something Went Wrong, Please Try Again Later', '');
          this.isSpinning = false;
        });
      } else {
        this.api1.createServiceDetails(this.service).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.isSpinning = false;
            this.message.success('Service Details Submitted Successfully', '');
            this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
            this.personalinformation.STATUS = 1;
            this.personalinformation.IS_SERVICE_FILLED = 1;
            this.personalinformation.IS_UPDATED = true;

            this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
            this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.isSpinning = false;
                this.api1
                  .getAllServiceDetails(
                    0,
                    0,
                    '',
                    'desc',
                    ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId') + ''
                  )
                  .subscribe(
                    (data) => {
                      if (data.code == '200' && data.data.length > 0) {
                        this.service = data['data'][0];
                        this.isSpinning = false;
                        this.getstatusdata();
                      } else {
                        this.isSpinning = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
                this.getstatusdata();
              } else {
                this.isSpinning = false;
              }
            }, (err) => {
              this.isSpinning = false;
            });
            this.isSpinning = false;
          } else {
            this.message.error('Cannot save Service Details ', '');
            this.isSpinning = false;
          }
        }, err => {
          this.message.error('Something Went Wrong, Please Try Again Later', '');
          this.isSpinning = false;
        });
      }
    } else {
    }
  }

  disabledDatejoin = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInCalendarDays(current, today) > 0;
  };

  disabledDateleave = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return differenceInCalendarDays(current, today) < 0;
  };

  getservice;
  rank: any = [];
  designation: any;
  office: any = [];
  getallOffice() {
    if (this.office.length == 0) {
      this.isSpinning = true;
      this.api.getAllOfficeForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND MDB_ID is not NULL').subscribe((forms) => {
        this.office = forms['data'];
        this.isSpinning = false;
      }, (err) => {
        this.isSpinning = false;
      });
    } else {
      this.isSpinning = false;
    }
  }

  class: any = [];
  getallClass() {
    if (this.class.length == 0) {
      this.isSpinning = true;
      this.api.getAllClass(0, 0, 'NAME', 'asc', ' AND STATUS=1').subscribe((forms) => {
        this.class = forms['data'];
        this.isSpinning = false;
      }, (err) => {
        this.isSpinning = false;
      });
    }
  }

  City: any = [];
  getallCity() {
    this.isSpinning = true;
    this.api.getAllCityMaster(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND ID!= 266').subscribe((forms) => {
      this.City = forms['data'];
      this.isSpinning = false;
    }, (err) => {
      this.isSpinning = false;
    });
  }
  getCity() {
    this.isSpinning = true;
    this.api.getAllCityMaster(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND ID!= 266').subscribe((forms) => {
      this.City = forms['data'];
      this.City1 = forms['data'];
      this.City2 = forms['data'];
      this.isSpinning = false;
    }, (err) => {
      this.isSpinning = false;
    }
    );
  }

  State: any = [];
  getallState() {
    if (this.State.length == 0) {
      if (this.State.length == 0) {
        this.isSpinning = true;

        this.api.getAllStateMaster(0, 0, 'NAME', 'asc', ' AND STATUS = 1').subscribe(
          (forms) => {
            this.State = forms['data'];
            this.isSpinning = false;
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      }
    }
  }
  current = new Date();

  getpersonaldata() {
    this.isSpinning = true;
    this.api1.getprofiledata(0, 0, '', 'asc', ' AND ID=' + sessionStorage.getItem('userId') + '').subscribe(
      (data) => {
        if (data.code == '200' && data.data.length > 0) {
          this.personalinformation = data['data'][0];
          this.personalinformation.EMAIL_ID = sessionStorage.getItem('emailId');
          this.personalinformation.MOBILE_NO = sessionStorage.getItem('loginmobileNo');
          if (this.personalinformation.EMAIL_ID != null && this.personalinformation.EMAIL_ID != undefined && this.personalinformation.EMAIL_ID != '') {
            this.personalinformationEMAIL_IDtrue = true;
          } else {
            this.personalinformationEMAIL_IDtrue = false;
          }
          if (this.personalinformation.MOBILE_NO != null && this.personalinformation.MOBILE_NO != undefined && this.personalinformation.MOBILE_NO != '') {
            this.personalinformationMOBILE_NOTrue = true;
          } else {
            this.personalinformationMOBILE_NOTrue = false;
          }
          this.isSpinning = false;
        } else {
          this.isSpinning = false;
        }
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  formTitle = 'Family Details';
  drawerTitle = 'Add Family Details';
  loadingRecords: boolean = false;
  totalRecords = 0;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  columnACR: string[][] = [
    ['FROM_DATE', 'From Date'],
    ['TO_DATE', 'To Date'],
    ['FILE_NO', 'File No.'],
    ['GRADE_NAME', 'Grade'],
  ];
  columnFamily: string[][] = [
    ['NAME', 'Name'],
    ['EDUCATION', 'Education'],
    ['MARITAL_STATUS', 'Marital Status'],
    ['SPOUSE_CIVIL_CODE', 'Employed'],
    ['OCCUPATION', 'OCCUPATION'],
    ['RELATION', 'RELATION']
  ];
  columnEducation: string[][] = [
    ['EDUCATION_TYPE', 'Type'],
    ['COURSE_DEGREE_NAME', 'Degree Name'],
    ['COLLEGE_UNIVERSITY_NAME', 'College/University Name'],
    ['MONTH_YEAR', 'Year'],
    ['MAIN_SUBJECT', 'Subject'],
  ];
  columnAddition: string[][] = [
    ['DESIGNATION_NAME', 'Designation'],
    ['OFFICE_NAME', 'Office Name'],
    ['FROM_DATE', 'Form Date'],
    ['TO_DATE', 'To date'],
    ['ORDER_DATE', 'Order Date'],
    ['ORDER_NO', 'Order No'],
    ['IS_CURRENT_CHARGE', 'Current Charge'],
  ];
  totalAdditionRecords = 0;

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
  }

  sort(params: any) {
    this.search(true);
  }
  address: address = new address();
  keydisable: boolean = false;
  sametemp() {
    if (this.address.IS_PERMANENT == true) {
      this.City = this.City1;
      this.address.PERMANENT_ADDRESS_LINE_1 = this.address.TEMP_ADDRESS_LINE_1
      this.address.PERMANENT_ADDRESS_LINE_2 = this.address.TEMP_ADDRESS_LINE_2
      this.address.PERMANENT_STATE_ID = this.address.TEMP_STATE_ID
      this.address.PERMANENT_CITY_ID = this.address.TEMP_CITY_ID
      this.address.PERMANENT_PINCODE = this.address.TEMP_PINCODE
      this.address.PERMANENT_MUMBAI_LOCAL_LINE = this.address.TEMP_MUMBAI_LOCAL_LINE
      this.address.PERMANENT_STATE_NAME = this.address.PERMANENT_STATE_NAME
      this.address.PERMANENT_CITY_NAME = this.address.TEMP_CITY_NAME
      this.address.PERMANENT_AREA = this.address.TEMP_AREA
    } else {
      this.address.PERMANENT_ADDRESS_LINE_1 = '';
      this.address.PERMANENT_ADDRESS_LINE_2 = '';
      this.address.PERMANENT_STATE_ID = 0;
      this.address.PERMANENT_CITY_ID = 0;
      this.address.PERMANENT_PINCODE = '';
      this.address.PERMANENT_MUMBAI_LOCAL_LINE = '';
      this.address.IS_PERMANENT = false;
      this.address.PERMANENT_STATE_NAME = ''
      this.address.PERMANENT_CITY_NAME = ''
      this.address.PERMANENT_AREA = ''
    }
  }

  saveaddress() {
    this.isOk = true;
    this.isSpinning = true;
    this.address.EMPLOYEE_ID = sessionStorage.getItem('userId');
    if (this.address.TEMP_ADDRESS_LINE_1 == null || this.address.TEMP_ADDRESS_LINE_1 == undefined || this.address.TEMP_ADDRESS_LINE_1 == '') {
      this.isOk = false;
      this.message.error(' Please Enter Address Line 1 For Current address', '');
      this.isSpinning = false;
    } else if (this.address.TEMP_STATE_ID == null || this.address.TEMP_STATE_ID == undefined || this.address.TEMP_STATE_ID == 0) {
      this.isOk = false;
      this.message.error(' Please Select State For Current address', '');
      this.isSpinning = false;
    } else if (this.address.TEMP_CITY_ID == null || this.address.TEMP_CITY_ID == undefined || this.address.TEMP_CITY_ID == 0) {
      this.isOk = false;
      this.message.error(' Please Select Ciry For Current address', '');
      this.isSpinning = false;
    } else if (this.address.TEMP_PINCODE == null || this.address.TEMP_PINCODE == undefined || this.address.TEMP_PINCODE == 0) {
      this.isOk = false;
      this.message.error(' Please Enter Pincode For Current address', '');
      this.isSpinning = false;
    } else if (this.address.TEMP_PINCODE.length != 6) {
      this.isOk = false;
      this.message.error(' Please Enter Valid Pincode For Current address', '');
      this.isSpinning = false;
    }

    if (this.isOk) {
      this.address.IS_UPDATED = true;
      if (this.address.ID) {
        this.api1.updateAddressDetails(this.address).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Address Details Updated Successfully', '');
            this.isSpinning = false;
            this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
            this.personalinformation.STATUS = 1;
            this.personalinformation.IS_ADDRESS_FILLED = 1;
            this.personalinformation.IS_UPDATED = true;
            this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
            this.personalinformation.ADDRESS = this.address.TEMP_ADDRESS_LINE_1 + ',' + this.address.TEMP_ADDRESS_LINE_2 + ',' + this.address.TEMP_STATE_NAME + this.address.TEMP_STATE_NAME + ',' + this.address.TEMP_CITY_NAME + ',' + this.address.TEMP_PINCODE;
            this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.isSpinning = false;
                this.getpersonaldata();
                this.getAddress();
                this.getstatusdata();
              } else {
                this.isSpinning = false;
              }
            }, (err) => {
              this.isSpinning = false;
            });
          } else {
            this.message.error('Address Details Updation Failed', '');
            this.isSpinning = false;
          }
        }, err => {
          this.message.error('Something Went Wrong, Please Try Again Later', '');
          this.isSpinning = false;
        });

      } else {
        this.api1.createAddressDetails(this.address).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.isSpinning = false;
            this.message.success('Address Details Saved Successfully', '');
            this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
            this.personalinformation.STATUS = 1;
            this.personalinformation.IS_ADDRESS_FILLED = 1;
            this.personalinformation.IS_UPDATED = true;

            this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
            this.personalinformation.ADDRESS = this.address.TEMP_ADDRESS_LINE_1 + ',' + this.address.TEMP_ADDRESS_LINE_2 + ',' + this.address.TEMP_STATE_NAME + ',' + this.address.TEMP_CITY_NAME + ',' + this.address.TEMP_PINCODE;
            this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.isSpinning = false;
                this.getpersonaldata();
                this.getAddress();
                this.getstatusdata();
              } else {
                this.isSpinning = false;
              }
            }, (err) => {
              this.isSpinning = false;
            });

          } else {
            this.message.error('Failed To Save Address Details', '');
            this.isSpinning = false;
          }
        }, (err) => {
          this.message.error('Something Went Wrong, Please Try Again Later', '');
          this.isSpinning = false;
        });
      }
    }
  }

  // Optional details
  requirementRanks: any[] = [];
  requirementQuotas: any[] = [];
  permanentPosts: any[] = [];
  ACCESSBILITY1 = [
    { label: 'Read', value: 'Read', checked: true },
    { label: 'Write', value: 'Write' },
    { label: 'Speak', value: 'Speak' },
  ]
  ACCESSBILITY2 = [
    { label: 'Read', value: 'Read', checked: true },
    { label: 'Write', value: 'Write' },
    { label: 'Speak', value: 'Speak' },
  ]
  ACCESSBILITY3 = [
    { label: 'Read', value: 'Read', checked: true },
    { label: 'Write', value: 'Write' },
    { label: 'Speak', value: 'Speak' },
  ]
  ACCESSBILITY4 = [
    { label: 'Read', value: 'Read', checked: true },
    { label: 'Write', value: 'Write' },
    { label: 'Speak', value: 'Speak' },
  ]
  getRankMaster(): void {
    this.api.getallDesignationForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 AND MDB_ID is not NULL').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.requirementRanks = data['data'];
        } else {
          this.message.error('Something Went Wrong', '');
        }
      },
      (err) => {
        if (err['ok'] == false) {
          this.message.error('Something Went Wrong, Please Try Again Later', '');
        }
      }
    );
  }

  addresss: any = [];

  getAddress() {
    this.isSpinning = true;
    this.api1.getAllAddressDetails(0, 0, '', 'asc', ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId')).subscribe((data) => {
      if (data['data'].length > 0) {

        this.address = data['data'][0];
        this.addresss = this.address.IS_PERMANENT;

        if (this.addresss == '0') {
          this.address.IS_PERMANENT = false;
        } else if (this.addresss == '1') {
          this.address.IS_PERMANENT = true;
        }
      } else {
        this.address = new address();
      }

      this.isSpinning = false;
    },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  City1: any = [];
  City2: any = [];

  getCityyy(event: any) {
    this.address.PERMANENT_CITY_ID = 0;
    var filter = ' AND STATUS = 1 AND STATE_ID = ' + event;
    this.api.getAllCityMaster(0, 0, 'NAME', 'asc', filter + ' AND ID!= 266').subscribe(
      (forms) => {
        this.City = forms['data'];
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  getCityyy1(event: any) {
    this.address.CITY_ID = 0;
    var filter = ' AND STATUS = 1 AND STATE_ID = ' + event;

    this.api.getAllCityMaster(0, 0, 'NAME', 'asc', filter + ' AND ID!= 266').subscribe(
      (forms) => {
        this.City1 = forms['data'];
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  getCityyy2(event: any) {
    this.address.CITY_ID = 0;
    var filter = ' AND STATUS = 1 AND STATE_ID = ' + event;

    this.api.getAllCityMaster(0, 0, 'NAME', 'asc', filter + ' AND ID!= 266').subscribe(
      (forms) => {
        this.City2 = forms['data'];
        this.isSpinning = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  getstatusdata() {
    this.api1.getempstatus(0, 0, '', 'asc', ' AND ID=' + sessionStorage.getItem('userId')).subscribe((data) => {
      if (data['code'] == 200) {
        if (data['data'].length > 0) {
          this.empstatus = data['data'];
          this.tabs = [
            {
              name: 'Personal Details',
              disabled: false,
            },
            {
              name: 'Address Details',
              disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true
            },
            {
              name: 'Service Details',
              disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
            },
            {
              name: 'Family Details',
              disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
            },
            {
              name: 'Education Data',
              disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
            },
            {
              name: 'Exam Data',
              disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
            },
            {
              name: 'Other Details',
              disabled: this.empstatus[0].IS_PERSONAL_FILLED == 1 ? false : true,
            }
          ];
        } else {
          this.empstatus = [];
        }
      } else {
        this.message.error("Can't Load  Data", '');
      }
    },
      (err) => { }
    );
  }
  GLOBAL_TABLE_CARD: string = 'C';
  @ViewChild('accountMasterPage', { static: false }) accountMasterPagevar: NgForm;
  onmonthyear(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
  }
  isInvalidDate1: boolean = false;

  showInvalidDateErrorforpassingyear(relievingDate: any): any {
    this.isInvalidDate1 = false;

    if (relievingDate.length == 7) {
      let tempJoiningDate = relievingDate.split('/');

      for (let i = 0; i < tempJoiningDate.length; i++) {
        if (i == 0) {
          if (
            Number(tempJoiningDate[i]) > 12 ||
            Number(tempJoiningDate[i]) < 1
          ) {
            this.isInvalidDate1 = true;
            break;
          }
        }

        if (i == 1) {
          if (
            tempJoiningDate[i].length < 4 ||
            Number(tempJoiningDate[i]) < 1900
          ) {
            this.isInvalidDate1 = true;
            break;
          }
        }
      }

    } else {
      this.isInvalidDate1 = true;
    }

    return this.isInvalidDate1;
  }

  // Family Detaile
  drawerVisibleFamily = false;
  drawerDataFamily: Family = new Family();
  searchFamilyText = '';
  pageFamilyIndex = 1;
  pageFamilySize = 10;
  sortFamilyKey = 'id';
  sortFamilyValue = 'desc';
  totalFamilyRecords = 0;
  dataFamilyList: any = [];
  loadingFamilyRecords = false;

  sortFamily(params: NzTableQueryParams): void {
    this.loadingFamilyRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageFamilyIndex = pageIndex;
    this.pageFamilySize = pageSize;
    if (this.pageFamilySize != pageSize) {
      this.pageFamilyIndex = 1;
      this.pageFamilySize = pageSize;
    }
    if (this.sortFamilyKey != sortField) {
      this.pageFamilyIndex = 1;
      this.pageFamilySize = pageSize;
    }
    this.sortFamilyKey = sortField;
    this.sortFamilyValue = sortOrder;
    this.searchFamily(false);
  }

  searchFamily(reset: boolean = false) {
    if (reset) {
      this.sortFamilyKey = 'id';
      this.sortFamilyValue = 'desc';
      this.dataFamilyList = [];
    }
    var sort: string;
    try {
      sort = this.sortFamilyValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchFamilyText != '') {
      likeQuery = ' AND (';
      this.columnFamily.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchFamilyText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    if (this.searchFamilyText == '') {
      likeQuery = ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId');
    } else {
      likeQuery = likeQuery + ')' + ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId');
    }

    this.loadingFamilyRecords = true;
    this.api1.getFamily(this.pageFamilyIndex, this.pageFamilySize, this.sortFamilyKey, sort, likeQuery).subscribe((data) => {
      if (data['code'] == 200 && data['data'].length > 0) {
        this.loadingFamilyRecords = false;
        this.totalFamilyRecords = data['count'];
        this.dataFamilyList = [];

        if (this.GLOBAL_TABLE_CARD == 'C') {
          this.dataFamilyList = [...this.dataFamilyList, ...data['data']];
        } else {
          this.dataFamilyList = data['data'];
        }
      } else {
        this.loadingFamilyRecords = false;
        this.dataFamilyList = [];
      }
    },
      (err) => {
        this.loadingFamilyRecords = false;
        if (err['ok'] == false) this.message.error('Something Went Wrong, Please Try Again Later', '');
      }
    );
  }

  addFamily() {
    this.drawerTitle = 'Add Family Details';
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '60%';
    }
    this.drawerVisibleFamily = true;
    this.drawerDataFamily = new Family();
  }

  editFamily(data: any) {
    this.drawerTitle = 'Update Family Details';
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '60%';
    }
    this.drawerVisibleFamily = true;
    this.drawerDataFamily = data;
  }

  drawerFamilyClose(): void {
    this.drawerVisibleFamily = false;
    this.searchFamily(true);
    this.getstatusdata();
  }

  get closeCallbackFamily() {
    return this.drawerFamilyClose.bind(this);

  }

  //Optional Details
  otherInfoOptionalData: OtherInfoOptionalMaster = new OtherInfoOptionalMaster();
  isSpinningOtherInfoOptionalDetails: boolean = false;
  selectedLanguages: { ID: number, LANGUAGE_NAME: string, ACCESSBILITY: { label: string, value: string, checked?: boolean }[] }[] = [];

  onLanguageSelected(languageId: number, languageName: string, checkboxes: { label: string, value: string, checked?: boolean }[]) {
    const existingLanguageIndex = this.selectedLanguages.findIndex(item => item.ID == languageId);
    if (existingLanguageIndex != -1) {
      this.selectedLanguages[existingLanguageIndex].ACCESSBILITY = checkboxes;
      this.selectedLanguages[existingLanguageIndex].LANGUAGE_NAME = languageName;
      this.selectedLanguages[existingLanguageIndex].ID = languageId;

    } else {
      this.selectedLanguages.push({ ID: languageId, LANGUAGE_NAME: languageName, ACCESSBILITY: checkboxes });
    }
  }

  onCheckboxSelected(languageId: number, checkboxValues: { label: string, value: string, checked?: boolean }[]) {
    const existingLanguageIndex = this.selectedLanguages.findIndex(item => item.ID == languageId);
    if (existingLanguageIndex != -1) {
      this.selectedLanguages[existingLanguageIndex].ACCESSBILITY = checkboxValues;
    }
  }

  getOtherInfoOptionalDetails(): void {
    this.isSpinningOtherInfoOptionalDetails = true;
    this.isSpinning = true;

    this.api1.getEmployeeOtherInfoOptionalDetails(0, 0, '', 'desc', ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId')).subscribe((data) => {
      if (data['code'] == 200) {
        if (data['data'].length > 0) {
          let tempOtherInfoOptionalData = data['data'][0];
          this.otherInfoOptionalData = Object.assign({}, tempOtherInfoOptionalData);
          if (this.otherInfoOptionalData.KNOWN_LANGUAGES) {
            const datass = JSON.parse(this.otherInfoOptionalData.KNOWN_LANGUAGES);
            this.selectedLanguages = JSON.parse(this.otherInfoOptionalData.KNOWN_LANGUAGES);

            datass.forEach(languageData => {
              const languageId = languageData.ID;
              const languageName = languageData.LANGUAGE_NAME;
              const accessibility = languageData.ACCESSBILITY;
              switch (languageId) {
                case 1:
                  this.otherInfoOptionalData.KNOWN_LANGUAGES = languageName;
                  this.ACCESSBILITY1 = accessibility;
                  break;
                case 2:
                  this.otherInfoOptionalData.KNOWN_LANGUAGES_2 = languageName;
                  this.ACCESSBILITY2 = accessibility;
                  break;
                case 3:
                  this.otherInfoOptionalData.KNOWN_LANGUAGES_3 = languageName;
                  this.ACCESSBILITY3 = accessibility;
                  break;
                case 4:
                  this.otherInfoOptionalData.KNOWN_LANGUAGES_4 = languageName;
                  this.ACCESSBILITY4 = accessibility;
                  break;
                default:
                  break;
              }
              // if(languageId)
            });
          } else {
            this.selectedLanguages = [
              {
                ID: 1,
                LANGUAGE_NAME: '',
                ACCESSBILITY: [
                  { label: 'Read', value: 'Read', checked: true },
                  { label: 'Write', value: 'Write' },
                  { label: 'Speak', value: 'Speak' },
                ],
              },
            ];
          }
        }

        this.isSpinningOtherInfoOptionalDetails = false;
        this.isSpinning = false;
      } else {
        this.isSpinning = false;
        this.message.error('Something Went Wrong', '');
      }
    },
      (err) => {
        this.isSpinning = false;
        if (err['ok'] == false) {
          this.message.error('Something Went Wrong, Please Try Again Later', '');
        }
      }
    );
  }

  saveOptionalDetails(): void {
    let isOK = true;
    if (isOK) {
      this.otherInfoOptionalData.KNOWN_LANGUAGES = JSON.stringify(this.selectedLanguages)
      this.otherInfoOptionalData.EMPLOYEE_ID = Number(
        sessionStorage.getItem('userId')
      );
      this.otherInfoOptionalData.IS_UPDATED = true;
      if (this.otherInfoOptionalData.ID) {
        this.isSpinningOtherInfoOptionalDetails = true;

        this.api1.updateEmployeeOtherInfoOptionalDetails(this.otherInfoOptionalData).subscribe(
          (successCode) => {
            if (successCode['code'] == 200) {
              this.message.success(
                'Other Details Updated Successfully',
                ''
              );

              this.isSpinningOtherInfoOptionalDetails = false;
              this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
              this.personalinformation.STATUS = 1;
              this.personalinformation.IS_OPTIONAL_FILLED = 1;
              this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
              this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
                if (successCode['code'] == '200') {
                  this.getOtherInfoOptionalDetails();
                  this.isSpinning = false;
                  this.getstatusdata();
                } else {
                  this.isSpinning = false;
                }
              }, (err) => {
                this.isSpinning = false;
              });
            } else {
              this.message.error('Other Details Updation Failed', '');
              this.isSpinningOtherInfoOptionalDetails = false;
            }
          },
          (err) => {
            this.isSpinningOtherInfoOptionalDetails = false;
            if (err['ok'] == false) {
              this.message.error('Something Went Wrong, Please Try Again Later', '');
            }
          }
        );
      } else {
        this.api1.createEmployeeOtherInfoOptionalDetails(this.otherInfoOptionalData)
          .subscribe(
            (successCode) => {
              if (successCode['code'] == 200) {
                this.message.success(
                  'Other Details Submitted Successfully',
                  ''
                );
                this.isSpinningOtherInfoOptionalDetails = false;
                this.personalinformation.ID = Number(sessionStorage.getItem('userId'))
                this.personalinformation.STATUS = 1;
                this.personalinformation.IS_OPTIONAL_FILLED = 1;
                this.personalinformation.DOB = this.datepipe.transform(this.personalinformation.DOB, 'yyyy-MM-dd');
                this.api1.updateprofile(this.personalinformation).subscribe((successCode) => {
                  if (successCode['code'] == '200') {
                    this.getOtherInfoOptionalDetails();
                    this.isSpinning = false;
                    this.getstatusdata();
                  } else {
                    this.isSpinning = false;
                  }
                }, (err) => {
                  this.isSpinning = false;
                });
              } else {
                this.message.error('Other Details Creation Failed', '');
                this.isSpinningOtherInfoOptionalDetails = false;
              }
            },
            (err) => {
              this.isSpinningOtherInfoOptionalDetails = false;
              if (err['ok'] == false) {
                this.message.error('Something Went Wrong, Please Try Again Later', '');
              }
            }
          );
      }
    }
  }

  languagechange1(BuildingID: number) {
    if (BuildingID != null) {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    } else {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    }
  }

  languagechange2(BuildingID: number) {
    if (BuildingID != null) {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    } else {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    }
  }

  languagechange3(BuildingID: number) {
    if (BuildingID != null) {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    } else {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    }
  }

  languagechange4(BuildingID: number) {
    if (BuildingID != null) {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    } else {
      this.LanguageListsFor1 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );

      this.LanguageListsFor2 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor3 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_4
      );
      this.LanguageListsFor4 = this.LanguageLists.filter(
        (element: any) =>
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_3 &&
          element.value != this.otherInfoOptionalData.KNOWN_LANGUAGES_2
      );
    }
  }

  emitted = false;
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])
  onScrollFamily(e: any) {
    const activityItemFamily = document.getElementById("activityItemFamily");
    if (activityItemFamily) {
      const scrollTop = activityItemFamily.scrollTop;
      const offsetHeight = activityItemFamily.offsetHeight;
      const scrollHeight = activityItemFamily.scrollHeight;
      if (scrollTop + offsetHeight + 1 >= scrollHeight && !this.emitted) {
        this.emitted = true;
        this.onScrollingFinishedFamily();
      } else if (scrollTop + offsetHeight + 1 < scrollHeight) {
        this.emitted = false;
      }
    }
  }
  onScrollingFinishedFamily() {
    this.loadFamilyMore();
  }
  loadFamilyMore(): void {
    if (this.getNextItemsFamily()) {
      this.categoriesSubject.next(this.dataFamilyList);
    }
  }
  getNextItemsFamily(): boolean {
    if (this.dataFamilyList.length >= this.totalFamilyRecords) {
      return false;
    }
    this.pageFamilyIndex = this.pageFamilyIndex + 1;
    this.searchFamily(false);
    return true;
  }










  onScrollEducation(e: any) {
    const activityItemEducation = document.getElementById("activityItemEducation");
    if (activityItemEducation) {
      const scrollTop = activityItemEducation.scrollTop;
      const offsetHeight = activityItemEducation.offsetHeight;
      const scrollHeight = activityItemEducation.scrollHeight;
      if (scrollTop + offsetHeight + 1 >= scrollHeight && !this.emitted) {
        this.emitted = true;
        this.onScrollingFinishedEducation();
      } else if (scrollTop + offsetHeight + 1 < scrollHeight) {
        this.emitted = false;
      }
    }
  }
  onScrollingFinishedEducation() {
    this.loadEducationMore();
  }
  loadEducationMore(): void {
    if (this.getNextItemsEducation()) {
      this.categoriesSubject.next(this.dataEducationList);
    }
  }
  getNextItemsEducation(): boolean {
    if (this.dataEducationList.length >= this.totalEducationRecords) {
      return false;
    }
    this.pageEducationIndex = this.pageEducationIndex + 1;
    this.searchEducation(false);
    return true;
  }


  // EMPEDUCATION DETAILS

  drawerDataEducation: EMPEDUCATIONDETAILS = new EMPEDUCATIONDETAILS();
  drawerVisibleEducation = false;
  searchEducationText = '';
  pageEducationIndex = 1;
  pageEducationSize = 10;
  sortEducationKey = 'id';
  sortEducationValue = 'desc';
  totalEducationRecords = 0;
  dataEducationList: any = [];
  loadingEducationRecords = false;
  sortEducation(params: NzTableQueryParams): void {
    this.loadingEducationRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageEducationIndex = pageIndex;
    this.pageEducationSize = pageSize;
    if (this.pageEducationSize != pageSize) {
      this.pageEducationIndex = 1;
      this.pageEducationSize = pageSize;
    }
    if (this.sortEducationKey != sortField) {
      this.pageEducationIndex = 1;
      this.pageEducationSize = pageSize;
    }
    this.sortEducationKey = sortField;
    this.sortEducationValue = sortOrder;
    this.searchEducation(false);
  }

  searchEducation(reset: boolean = false) {
    if (reset) {
      this.dataEducationList = [];
      this.pageEducationIndex = 1;
    }
    var sort: string;
    try {
      sort = this.sortEducationValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchEducationText != '') {
      likeQuery = ' AND (';
      this.columnEducation.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchEducationText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    if (this.searchEducationText == '') {
      likeQuery = 'AND EMPLOYEE_ID=' + sessionStorage.getItem('userId');
    } else {
      likeQuery = likeQuery + ')' + 'AND EMPLOYEE_ID=' + sessionStorage.getItem('userId');
    }
    this.loadingEducationRecords = true;
    this.api.getEducation(this.pageEducationIndex, this.pageEducationSize, this.sortEducationKey, sort, likeQuery).subscribe(
      (data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.loadingEducationRecords = false;
          this.totalEducationRecords = 0

          this.totalEducationRecords = data['count'];
          // this.dataEducationList = data['data'];
          this.dataEducationList = [];
          if (this.GLOBAL_TABLE_CARD == 'C') {
            this.dataEducationList = [...this.dataEducationList, ...data['data']];
          } else {
            this.dataEducationList = data['data'];
          }
        } else {
          this.loadingEducationRecords = false;
          this.dataEducationList = [];
        }
      },
      (err) => {
        if (err['ok'] == false) this.message.error('Server Not Found', '');
      }
    );
  }

  addEducation() {
    this.drawerTitle = 'Add Education';
    this.Dwidth = '35%';
    this.drawerVisibleEducation = true;
    this.drawerDataEducation = new EMPEDUCATIONDETAILS();
  }
  editEducation(data: any) {
    this.drawerTitle = 'Update Education';
    this.Dwidth = '36%';
    this.drawerVisibleEducation = true;
    this.drawerDataEducation = data;
    if (this.drawerDataEducation.MONTH_YEAR) {
      this.drawerDataEducation.MONTH_YEAR = this.datepipe.transform(
        new Date(this.drawerDataEducation.MONTH_YEAR),
        'MMM/yyyy'
      );
    }
  }
  drawerEducationClose(): void {
    this.drawerVisibleEducation = false;
    this.searchEducation(true);
    this.getstatusdata();
  }
  get closeCallbackEducation() {
    return this.drawerEducationClose.bind(this);
  }












  examDataList: any = [];
  loadingExamRecords: boolean = false;
  totalExamRecords: number = 1;
  examPageIndex: number = 1;
  examPageSize: number = 10;
  examSortValue: string = 'desc';
  examSortKey: string = 'id';
  examSearchText: string = '';
  examColumns: string[][] = [
    ['EXAM_NAME', 'Exam Name'],
    ['PASSING_DATE', 'Passing Date'],
  ];
  examDrawerVisible: boolean = false;
  examDrawerTitle: string;
  examDrawerData: any = new ExamMaster();
  examDrawerWidth = '30%';

  addExamDetails(): void {
    this.examDrawerTitle = 'Add Exam Details';
    this.examDrawerData = new ExamMaster();
    this.examDrawerVisible = true;
  }

  editExamDetails(data: ExamMaster): void {
    this.examDrawerVisible = true;
    this.examDrawerTitle = 'Update Exam Details';
    this.examDrawerData = Object.assign({}, data);
    // if (this.examDrawerData.PASSING_DATE) {
    //   this.examDrawerData.PASSING_DATE = this.datepipe.transform(
    //     new Date(this.examDrawerData.PASSING_DATE),
    //     'dd/MM/yyyy'
    //   );
    // }
  }

  sortExam(params: NzTableQueryParams): void {
    this.loadingExamRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.examPageIndex = pageIndex;
    this.examPageSize = pageSize;

    if (this.examPageSize != pageSize) {
      this.examPageIndex = 1;
      this.examPageSize = pageSize;
    }

    if (this.examSortKey != sortField) {
      this.examPageIndex = 1;
      this.examPageSize = pageSize;
    }

    this.examSortKey = sortField;
    this.examSortValue = sortOrder;
    this.examSearch(false);
  }

  examSearch(reset: boolean = false): void {
    if (reset) {
      this.examPageIndex = 1;
      this.examDataList = [];
    }

    var sort: string;
    try {
      sort = this.examSortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.examSearchText != '') {
      likeQuery = ' AND (';
      this.examColumns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.examSearchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery += ')'
    }

    likeQuery += ' AND EMPLOYEE_ID = ' + sessionStorage.getItem('userId');
    this.loadingExamRecords = true;
    this.api.getEmployeeExamDetails(this.examPageIndex, this.examPageSize, this.examSortKey, sort, likeQuery)
      .subscribe((data) => {
        if ((data['code'] = 200)) {
          this.loadingExamRecords = false;
          this.examDataList = []
          this.totalExamRecords = data['count'];
          if (this.GLOBAL_TABLE_CARD == 'C') {
            this.examDataList = [...this.examDataList, ...data['data']];
          } else {
            this.examDataList = [...[], ...data['data']];
          }
          // this.examDataList = data['data'];
        }
      },
        (err) => {
          this.message.error('Something Went Wrong', '');
        }
      );
  }

  examDrawerClose(): void {
    this.examSearch(true);
    this.getstatusdata();
    this.examDrawerVisible = false;
  }

  get examCloseCallback() {
    return this.examDrawerClose.bind(this);
  }
  onScrollExam(e: any) {
    const activityItemExam = document.getElementById("activityItemExam");
    if (activityItemExam) {
      const scrollTop = activityItemExam.scrollTop;
      const offsetHeight = activityItemExam.offsetHeight;
      const scrollHeight = activityItemExam.scrollHeight;
      if (scrollTop + offsetHeight + 1 >= scrollHeight && !this.emitted) {
        this.emitted = true;
        this.onScrollingFinishedExam();
      } else if (scrollTop + offsetHeight + 1 < scrollHeight) {
        this.emitted = false;
      }
    }
  }
  onScrollingFinishedExam() {
    this.loadExamMore();
  }


  loadExamMore(): void {
    if (this.getNextItemsExam()) {
      this.categoriesSubject.next(this.examDataList);
    }
  }
  getNextItemsExam(): boolean {
    if (this.examDataList.length >= this.totalExamRecords) {
      return false;
    }
    this.examPageIndex = this.examPageIndex + 1;
    this.examSearch(false);
    return true;
  }





}