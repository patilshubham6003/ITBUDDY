import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { adminsignature } from 'src/app/Modal/adminsignature';
import { ServiceService } from 'src/app/Service/service.service';
import { WebsiteService } from 'src/app/Service/website.service';
@Component({
  selector: 'app-grass-signature-master-drawer',
  templateUrl: './grass-signature-master-drawer.component.html',
  styleUrls: ['./grass-signature-master-drawer.component.css'],
  providers: [DatePipe],
})
export class GrassSignatureMasterDrawerComponent {
  @Input() drawerClose: Function;
  @Input() data: any = new adminsignature();
  imgurl = appkeys.retriveimgUrl;

  isSpinning = false;
  // @Input()
  // drawerClose!: Function;
  // @Input()
  // data!: Signature;
  // @Input()
  // drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  UserList: any;
  details: any = [];

  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    public api1: WebsiteService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAllUsers();
    this.api.getAllService(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.details = data['data'];
        }
      },
      (err) => { }
    );
  }

  change(event: any) { }

  onchangeradio(event: any) { }

  close(SignaturePage: NgForm) {
    this.drawerClose();
    this.resetDrawer(SignaturePage);
    SignaturePage.form.reset();
  }

  resetDrawer(SignaturePage: NgForm) {
    this.data = new adminsignature();
    SignaturePage.form.markAsPristine();
    SignaturePage.form.markAsUntouched();
  }

  ///Allow only characters
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

  getAllUsers() {
    this.api.getAllUsers(0, 0, 'ID', 'desc', ' AND IS_ACTIVE = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.UserList = data['data'];
        }
      },
      (err) => { }
    );
  }

  save(addNew: boolean, SignaturePage: NgForm): void {
    // this.data.DDO_ID = Number(sessionStorage.getItem('ddoId'));
    // this.data.DDO_TYPE_ID = Number(sessionStorage.getItem('ddoId'));
    this.isSpinning = false;
    this.isOk = true;

    // if (
    //   // this.data.USER_ID == '' &&
    //   this.data.POST.trim() == '' &&
    //   this.data.POST_HN.trim() == '' &&
    //   this.data.NAME.trim() == '' &&
    //   this.data.NAME_HN.trim() == '' &&
    //   this.data.OFFICE_NAME.trim() == '' &&
    //   this.data.OFFICE_NAME_HN.trim() == ''
    //   // this.data.SECTION_TYPE == '' &&
    //   // this.data.SERVICE_ID <= 0
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Fill All Required Fields', '');
    // }
    // // else if (this.data.USER_ID == null || this.data.USER_ID.length <= 0) {
    // //   this.isOk = false;
    // //   this.message.error(' Please Select User from Users ', '');
    // // }
    //  else if (this.data.NAME == null || this.data.NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Name ', '');
    // } else if (this.data.NAME_HN == null || this.data.NAME_HN.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Name in Hindi', '');
    // } else if (this.data.POST == null || this.data.POST.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Post Name ', '');
    // } else if (this.data.POST_HN == null || this.data.POST_HN.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Post Name in Hindi ', '');
    // } else if (
    //   this.data.OFFICE_NAME == null ||
    //   this.data.OFFICE_NAME.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Office Name ', '');
    // } else if (
    //   this.data.OFFICE_NAME_HN == null ||
    //   this.data.OFFICE_NAME_HN.trim() == ''
    // ) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Your Office Name in Hindi', '');
    // }
    // // else if (this.data.SECTION_TYPE == null || this.data.SECTION_TYPE == '') {
    // //   this.isOk = false;
    // //   this.message.error(' Please choose Section Type ', '');
    // // }
    // //  else if (this.data.SERVICE_ID == undefined || this.data.SERVICE_ID <= 0) {
    // //   this.isOk = false;
    // //   this.message.error('Please Select Service Name', '');
    // // }

    if (this.isOk) {
      this.data.SERVICE_ID = 5;
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.updateadminSignature(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createadminSignature(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            // sessionStorage.setItem('signaturedata', successCode.ID);
            this.drawerClose();

            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  percent: any = 0;
  progressBar: any = false;

  clearprofile(url: any, folder: any) {
    this.data.SIGNATURE_IMAGE = null;
    this.progressBar = false;
    this.percent = 0;
  }

  timer: any;
  signImage: any;
  urlSign: any;

  onFileSelectedphoto(event: any) {
    if (event.target.files.length == 0) {
      this.message.error('Please select profile photo', '');
      this.signImage = null;
    } else if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      this.signImage = <File>event.target.files[0];
    } else {
      this.message.error('Please select olny JPEG/ JPG/ PNG files.', '');
      this.signImage = null;
    }

    if (this.signImage != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.signImage.name.split('.').pop();
      var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      this.urlSign = url;
      this.uploadImage(this.signImage, this.urlSign);
    }
  }

  uploadImage(urldemo: any, url: any) {
    this.isSpinning = true;
    this.progressBar = true;
    this.timer = this.api1.onUpload2('signatureImage', urldemo, url).subscribe(
      (res) => {
        if (res.type === HttpEventType.Response) {
        }
        if (res.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * res.loaded) / res.total);
          this.percent = percentDone;
          if (this.percent == 100) {
            this.isSpinning = false;
          }
        } else if (res.type == 2 && res.status != 200) {
          this.message.error('Failed To Upload File...', '');
          this.isSpinning = false;
          this.progressBar = false;
          this.percent = 0;
          this.data.SIGNATURE_IMAGE = null;
          this.isSpinning = false;
        } else if (res.type == 4 && res.status == 200) {
          if (res.body['code'] == 200) {
            this.message.success(
              'Signature Photo Uploaded Successfully...',
              ''
            );
            this.isSpinning = false;
            this.data.SIGNATURE_IMAGE = this.urlSign;
            this.isSpinning = false;
          } else {
            this.isSpinning = false;
          }
        }
      },
      (err) => {
        this.isSpinning = false;
        console.log(err);
      }
    );
  }
}
