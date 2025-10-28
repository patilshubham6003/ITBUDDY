import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { family } from 'src/app/Modal/family';
import { profile } from 'src/app/Modal/profile';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [DatePipe],
})
export class ProfileComponent implements OnInit {
  profiledata: any = new profile();
  familydata: any = new family();
  gradepayDatas: any = [];
  isValidgp: boolean = true;
  GradePay_ID: any;
  GradePay_ID1: any = [];
  gradeIds: any = [];
  RESIDENCE_TYPE_NAME1: any = [];

  gradepayData: any = [];
  gradepaylevel: any = [];

  imgurl = appkeys.retriveimgUrl;
  isSpinning = true;
  constructor(
    private datePipe: DatePipe,
    private api: WebsiteService,
    private message: ToastrService
  ) { }
  ngOnInit() {
    this.getdata();
    this.getfamilydata();
    this.getcityy();
    this.ddoOfTheOfficialList();
    this.api
      .getgradepaylevel(0, 0, 'ID', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.gradepaylevel = data['data'];
        }
      });
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  AllFilters() {
    this.isSpinning = true;
  }
  ddoOfTheOfficialDataList: any = [];
  ddoOfTheOfficialList() {
    this.isSpinning = true;
    this.api.getAllDDOs(0, 0, 'ID', 'ASC', ' AND STATUS = 1').subscribe(
      (data: any) => {
        if (data['code'] == 200) {
          if (data['count'] > 0) {
            this.ddoOfTheOfficialDataList = data['data'];
          } else {
            this.ddoOfTheOfficialDataList = [];
          }
        } else {
          this.ddoOfTheOfficialDataList = [];
        }
      },
      (err) => {
        this.ddoOfTheOfficialDataList = [];
      }
    );
  }

  isok: any;
  Designationn: any;

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  isValiddgs: boolean = true;
  selectdesign(data: any) {
    var castid = this.designation.find((item) => item.NAME == data);

    if (castid != undefined) {
      this.profiledata.DESIGNATION_ID = castid.ID;
    }
    // else {
    //   this.profiledata.DESIGNATION_ID = '';
    // }
    this.isValiddgs = this.designation.some((item) => item.NAME === data);
    return this.isValiddgs;
  }

  selectddo(data: any) {
    var castid = this.ddoOfTheOfficialDataList.find((item) => item.HEAD_OF_OFFICE == data);
    if (castid != undefined) {
      this.profiledata.DDO_OF_THE_OFFICIAL_ID = castid.ID;
    }
  }

  gradepaylevelID: any;
  isValidgradepay: boolean = true;

  selectgradepaylevel(data: any) {
    var gradepayid = this.gradepaylevel.find(
      (item) => item.GRADE_PAY_LEVEL == data
    );
    if (gradepayid != undefined) {
      this.profiledata.GRADE_PAY_LEVEL_ID = gradepayid.ID;
    }
    this.isValidgradepay = this.gradepaylevel.some(
      (item) => item.GRADE_PAY_LEVEL === data
    );
    return this.isValidgradepay;
  }
  selectgradepay(data: any) {
    // this.profiledata.GRADE_PAY = data;

    var recidence = data.split('--');
    var castid = this.gradepayDatas.find(
      (item) =>
        item.AMOUNT == recidence[0] && recidence[1] == item.RESIDENCE_TYPE_NAME
    );

    if (castid !== undefined) {
      this.gradeIds = castid.AMOUNT;
      this.RESIDENCE_TYPE_NAME1 = castid.ID;
    } else {
      this.gradeIds = data;
      this.RESIDENCE_TYPE_NAME1 = 0;
    }
    // this.isValidgp = this.gradepayDatas.some(item => item.AMOUNT.toString() === data);
    // return this.isValidgp;
  }

  changeswitch(datasd: any) {
    if (datasd == false) {
      this.profiledata.PRESENT_PAY_LEVEL_DATE = null;
    }
  }
  saveupdate() {
    this.isok = true;
    // const validGradePayLevels = [
    //   'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5',
    //   'Level 6', 'Level 7', 'Level 8', 'Level 9', 'Level 10',
    //   'Level 11', 'Level 12', 'Level 13', 'Level 14', 'Level 15',
    //   'Level 16', 'Level 17'
    // ];
    if (
      this.profiledata.PRESENT_PAY_LEVEL_DATE != null &&
      this.profiledata.PRESENT_PAY_LEVEL_DATE != undefined &&
      this.profiledata.PRESENT_PAY_LEVEL_DATE != ''
    ) {
      this.profiledata.PRESENT_PAY_LEVEL_DATE = this.datePipe.transform(
        this.profiledata.PRESENT_PAY_LEVEL_DATE,
        'yyyy-MM-dd'
      );
    }
    if (
      this.profiledata.NAME == '' ||
      this.profiledata.NAME == null ||
      this.profiledata.NAME == undefined
    ) {
      this.isok = false;
      this.message.error('Please Enter Name', '');
    } else if (
      this.profiledata.DOB == '' ||
      this.profiledata.DOB == undefined ||
      this.profiledata.DOB == null
    ) {
      this.isok = false;
      this.message.error('Please select Date Of Birth', '');
    } else if (
      this.profiledata.CAST_CERTIFICATE == null &&
      (this.profiledata.CAST == 'ST' || this.profiledata.CAST == 'SC')
    ) {
      this.isok = false;
      this.message.error('Please upload Caste Certificate', '');
    } else if (
      this.profiledata.PAN_CARD == '' ||
      this.profiledata.PAN_CARD == undefined ||
      this.profiledata.PAN_CARD == null
    ) {
      this.isok = false;
      this.message.error('Please Enter Pan Card', '');
    } else if (
      this.profiledata.GENDER == null ||
      this.profiledata.GENDER == undefined ||
      this.profiledata.GENDER == ''
    ) {
      this.isok = false;
      this.message.error('Please Select Gender', '');
    } else if (
      this.profiledata.ADDRESS == '' ||
      this.profiledata.ADDRESS == null ||
      this.profiledata.ADDRESS == undefined
    ) {
      this.isok = false;
      this.message.error('Please Enter Address', '');
    } else if (
      this.profiledata.OFFICE_NAME == '' ||
      this.profiledata.OFFICE_NAME == undefined ||
      this.profiledata.OFFICE_NAME == null
    ) {
      this.isok = false;
      this.message.error('Please Enter Office Name', '');
    } else if (
      this.profiledata.LOCATION == '' ||
      this.profiledata.LOCATION == undefined ||
      this.profiledata.LOCATION == null
    ) {
      this.isok = false;
      this.message.error('Please Enter Location', '');
    } else if (
      this.profiledata.DESIGNATION_ID == undefined ||
      this.profiledata.DESIGNATION_ID.toString().trim() == ''
    ) {
      this.isok = false;
      this.message.error('Please Select Designation', '');
    } else if (!this.isValiddgs) {
      this.isok = false;
      this.message.error(
        'Invalid Designation. Please select from the valid options.',
        ''
      );
    } else if (
      this.profiledata.EMPLOYEE_CODE == '' ||
      this.profiledata.EMPLOYEE_CODE == undefined ||
      this.profiledata.EMPLOYEE_CODE == null
    ) {
      this.isok = false;
      this.message.error('Please Enter Employee Code', '');
    } else if (
      this.gradeIds == undefined ||
      this.gradeIds.toString().trim() == ''
    ) {
      this.isok = false;
      this.message.error('Please Select Grade Pay', '');
    }
    //  else if (!this.isValidgp) {
    //   this.isok = false;
    //   this.message.error('Invalid Grade Pay. Please select from the valid options.', '');
    // }
    else if (
      this.profiledata.GRADE_PAY_LEVEL_ID == undefined ||
      this.profiledata.GRADE_PAY_LEVEL_ID.toString().trim() == ''
    ) {
      this.isok = false;
      this.message.error('Please select Grade Pay Level', '');
    } else if (!this.isValidgradepay) {
      this.isok = false;
      this.message.error(
        'Invalid Grade Pay Level. Please select from the valid options.',
        ''
      );
    } else if (
      this.profiledata.IS_PRESENT_PAY_LEVEL_CHANGED == 1 &&
      (this.profiledata.PRESENT_PAY_LEVEL_DATE == null ||
        this.profiledata.PRESENT_PAY_LEVEL_DATE == undefined ||
        this.profiledata.PRESENT_PAY_LEVEL_DATE == '')
    ) {
      this.isok = false;
      this.message.error('Please Select Date of Present Pay Level', '');
    } else if (
      this.profiledata.SERVICE_TYPE == '' ||
      this.profiledata.SERVICE_TYPE == undefined ||
      this.profiledata.SERVICE_TYPE == null
    ) {
      this.isok = false;
      this.message.error('Please select service type', '');
    } else if (
      this.profiledata.JOINING_DATE == '' ||
      this.profiledata.JOINING_DATE == undefined ||
      this.profiledata.JOINING_DATE == null
    ) {
      this.isok = false;
      this.message.error('Please Select Joining Date', '');
    }

    if (this.isok) {
      this.isSpinning = true;
      this.profiledata.GRASS_GRADE_PAY = this.gradeIds;
      (this.profiledata.GRAAS_GRADE_PAY_ID = this.RESIDENCE_TYPE_NAME1),
        this.api.updateprofile(this.profiledata).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.message.success('Profile Details Updated Successfully', '');
              this.isSpinning = false;
              this.progressBar = false;
              this.progressBar4 = false;
              this.api
                .getprofiledata(
                  0,
                  0,
                  '',
                  'asc',
                  ' AND ID=' + sessionStorage.getItem('userId')
                )
                .subscribe((data) => {
                  if (data['code'] == 200) {
                    this.profiledata = data['data'][0];
                    this.isSpinning = false;
                  }
                });
            } else {
              this.isSpinning = false;
              this.message.error('Failed to Update Profile Details', '');
            }
          },
          (err) => {
            this.isSpinning = false;
            this.message.error(
              'Something went wrong. Please try again later',
              ''
            );
          }
        );
    }
  }

  alphaonly(event) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }
  isotpSpinning: boolean = false;
  savefamily() {
    if (
      this.familydata.NAME == null ||
      this.familydata.NAME == undefined ||
      this.familydata.NAME == ''
    ) {
      this.message.error('Please Enter Name', '');
    } else if (
      this.familydata.RELATION == null ||
      this.familydata.RELATION == undefined ||
      this.familydata.RELATION == ''
    ) {
      this.message.error('Please Select relationship', '');
    } else if (
      this.familydata.DOB == null ||
      this.familydata.DOB == undefined ||
      this.familydata.DOB == ''
    ) {
      this.message.error('Please Select date of birth', '');
    } else if (
      this.familydata.AGE == null ||
      this.familydata.AGE == undefined ||
      this.familydata.AGE == ''
    ) {
      this.message.error('Please Enter Age', '');
    } else if (
      this.familydata.GENDER == null ||
      this.familydata.GENDER == undefined ||
      this.familydata.GENDER == ''
    ) {
      this.message.error('Please Select Gender', '');
    } else {
      this.familydata.CLIENT_ID = 1;
      this.familydata.EMP_ID = sessionStorage.getItem('userId');

      if (this.familydata.ID) {
        this.isotpSpinning = true;
        this.api.updatefamily(this.familydata).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.isotpSpinning = false;
              this.isSpinning = false;
              this.message.success('Family Data Updated Successfully', '');
              this.familydata.NAME = '';
              this.familydata.RELATION = '';
              this.familydata.DOB = '';
              this.familydata.AGE = '';
              this.familydata.GENDER = '';
              this.familydata.STATUS = '';
              this.familydata.ID = '';
              this.familydata = new family();
              this.getfamilydata();
            } else {
              this.isotpSpinning = false;
              this.message.error('Failed to Update Family Data', '');
            }
          },
          (err) => {
            this.isotpSpinning = false;
          }
        );
      } else {
        this.isotpSpinning = true;
        this.api.Createfamily(this.familydata).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.isotpSpinning = false;
              this.isSpinning = false;
              this.message.success('Family Data Submitted Successfully', '');
              this.familydata.NAME = '';
              this.familydata.RELATION = '';
              this.familydata.DOB = '';
              this.familydata.AGE = '';
              this.familydata.GENDER = '';
              this.familydata.STATUS = '';
              this.familydata.ID = '';
              this.familydata = new family();
              this.getfamilydata();
            } else {
              this.isotpSpinning = false;
              this.message.error('Failed to created Family Data', '');
            }
          },
          (err) => {
            this.isotpSpinning = false;
          }
        );
      }
    }
  }

  getdata() {
    this.api
      .getprofiledata(
        0,
        0,
        '',
        'asc',
        ' AND ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.profiledata = data['data'][0];
          this.gradeIds = data['data'][0]['GRASS_GRADE_PAY'];
          this.RESIDENCE_TYPE_NAME1 = data['data'][0]['GRAAS_GRADE_PAY_ID'];
          this.isSpinning = false;
        }
      });

    this.api
      .getgradepay(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.gradepayDatas = data['data'];
        }
      });
  }

  familydata1: any;
  getfamilydata() {
    this.api
      .getfamilydata(
        0,
        0,
        '',
        'asc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          if (data['data'].length > 0) {
            this.familydata1 = data['data'];
          }
        }
      });
  }
  get maxJoiningDate(): string {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day
    return currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
  edit(data: family) {
    this.familydata = data;
  }
  fileURL1: any;
  isLtsize = false;
  height = 315;
  width = 315;
  checkImage1(event: any) {
    if (event.target.files.length == 0) {
      this.message.error('Please select profile photo', '');
      this.fileURL1 = null;
    } else if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.fileURL1 = <File>event.target.files[0];
    } else {
      this.message.error('Please select olny JPEG/ JPG/ PNG files.', '');
      this.fileURL1 = null;
    }

    if (this.fileURL1 != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL1.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      this.profiledata.PROFILE_PHOTO = url;
      this.uploadImage(this.fileURL1, url);
    }
  }

  uploadImage(fileURL: any, url: any) {
    this.api.onUpload('ProfileIMG', fileURL, url).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.api.updateprofile(this.profiledata).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success('Profile Updated Successfully', '');
            this.getdata();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          } else {
            this.message.error('Failed to Update Profile', '');
          }
        });
      } else {
        this.message.error('Upload Fails...', '');
      }
    });
  }

  // clear() {
  //   this.fileURL2 = null;
  //   this.profiledata.JOINING_LETTER = null;
  //   this.progressBar = false;
  // }

  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURL2 = null;
          this.profiledata.JOINING_LETTER = null;
          this.progressBar = false;
          this.percent = 0;
        } else {
          this.message.error('Failed to delete joining letter', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete joining letter', '');
      }
    );
  }

  fileURL2: any;
  image: any;
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  checkImage2(event: any) {
    if (event.target.files.length == 0) {
      this.message.error('Please select Joining Letter', '');
      this.fileURL2 = null;
    } else if (event.target.files[0].type == 'application/pdf') {
      this.fileURL2 = <File>event.target.files[0];
    } else {
      this.message.error('Please select olny PDF files.', '');
      this.fileURL2 = null;
    }
    const reader = new FileReader();

    // if (this.fileURL2 != null) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result as string;
      };
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL2.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      this.profiledata.JOINING_LETTER = url;
      this.uploadImage2(this.fileURL2, url);
    } else {
      this.fileURL2 = null;
      this.profiledata.JOINING_LETTER = null;
    }
  }

  uploadImage2(fileURL: any, url: any) {
    this.progressBar = true;
    this.timer = this.api
      .onUploadidproof1('joiningLetter', fileURL, url)
      .subscribe(
        (successCode) => {
          if (successCode.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(
              (100 * successCode.loaded) / successCode.total
            );
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
              this.message.success('Joining Letter Uploaded Successfully', '');
            }
          }
        },
        (err) => {
          this.isSpinning = false;
          this.message.error('Failed To Upload Joining Letter', '');
          this.profiledata.JOINING_LETTER = null;
        }
      );
  }

  progressBar4: boolean = false;
  percent4 = 0;
  timer4: any;
  castPDF: any;
  urlcastPdf: any;
  onFileSelectedcaste(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.castPDF = <File>event.target.files[0];

      if (this.castPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.castPDF.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlcastPdf = url;
        if (
          this.profiledata.CAST_CERTIFICATE != undefined &&
          this.profiledata.CAST_CERTIFICATE.trim() != ''
        ) {
          var arr = this.profiledata.CAST_CERTIFICATE.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar4 = true;
      this.timer4 = this.api
        .onUploadidproof1('castCertificate', this.castPDF, this.urlcastPdf)
        .subscribe((res) => {
          if (this.profiledata.CAST_CERTIFICATE != null) {
            this.castshow = false;
          } else {
            this.castshow = true;
          }
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * res.loaded) / res.total);
            this.percent4 = percentDone;
            if (this.percent4 == 100) {
              this.isSpinning = false;
              this.profiledata.CAST_CERTIFICATE = this.urlcastPdf;
              this.message.success(
                'Caste Certificate Uploaded Successfully',
                ''
              );
            }
          }

          if (this.profiledata.CAST_CERTIFICATE != null) {
            this.castshow = false;
          } else {
            this.castshow = true;
          }
        });
    } else {
      this.message.error('Failed To Upload Caste Certificate', '');
      this.castPDF = null;
      this.profiledata.CAST_CERTIFICATE = null;
    }
  }

  castshow: boolean = false;
  // clearcaste() {
  //   this.profiledata.CAST_CERTIFICATE = null;
  //   this.castshow = true;
  //   this.progressBar4 = false;
  //   this.percent4 = 0
  // }
  changecaster(data: any) {
    if (data == 'GN') {
      this.profiledata.CAST_CERTIFICATE = null;
      this.castshow = true;
      this.progressBar4 = false;
      this.percent4 = 0;
    }
  }
  clearcaste(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.profiledata.CAST_CERTIFICATE = null;
          this.castshow = true;
          this.progressBar4 = false;
          this.percent4 = 0;
        } else {
          this.message.error('Failed to delete Caste Certificate', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete Caste Certificate', '');
      }
    );
  }

  designation: any = [];
  getcityy() {
    this.api
      .getDesignation(0, 0, 'SEQUENCE_NO', 'desc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.designation = data['data'];
        }
      });
  }

  calculateAge() {
    const dob = new Date(this.familydata.DOB);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      this.familydata.AGE = age - 1;
    } else {
      this.familydata.AGE = age;
    }
  }

  calculateAge1() {
    const dob = new Date(this.profiledata.DOB);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      this.profiledata.AGE = age - 1;
    } else {
      this.profiledata.AGE = age;
    }
  }

  restrictToDatalist1(input: HTMLInputElement): void {
    const datalist = document.getElementById('Marital') as HTMLDataListElement;
    const options = Array.from(datalist.options).map((option) =>
      option.value.toLowerCase()
    );

    const inputValue = input.value.toLowerCase();

    if (!options.includes(inputValue)) {
      // If the input value is not in the datalist, clear the input.
      input.value = '';
    }
  }

  restrictToDatalist3(input: HTMLInputElement): void {
    const datalist = document.getElementById('level') as HTMLDataListElement;
    const options = Array.from(datalist.options).map((option) =>
      option.value.toLowerCase()
    );

    const inputValue = input.value.toLowerCase();

    if (!options.includes(inputValue)) {
      // If the input value is not in the datalist, clear the input.
      input.value = '';
    }
  }
}
