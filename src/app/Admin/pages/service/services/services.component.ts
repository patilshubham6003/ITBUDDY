import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Service } from 'src/app/Modal/service';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  providers: [DatePipe],
})
export class ServicesComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Service;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;

  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  fileDataIMAGE_URL: File | null = null;
  fileDataURL: File | null = null;
  imgurl = appkeys.retriveimgUrl;
  ROLE_DATA: any = [];
  folderName = 'service';
  folderName1 = 'serviceImg';
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
  };
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}
  details: any = [];
  ngOnInit() {
    this.api.getAllRoles(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.details = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  close(): void {
    this.drawerClose();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, servicePage: NgForm): void {
    var isOk = true;

    if (
      this.data.TITLE.trim() == '' &&
      this.data.DESCRIPTION.trim() == '' &&
      this.data.SERVICE_ROUTE.trim() == '' &&
      this.data.SHORT_CODE.trim() == '' &&
      this.data.ROLE_DATA == '' &&
      this.data.IMG_URL.trim() == '' &&
      this.data.SERVICE_IMG.trim() == ''
    ) {
      this.message.error('Please Fill All Required Fields', '');
      isOk = false;
    } else if (this.data.TITLE == undefined || this.data.TITLE.trim() == '') {
      this.message.error('Please Enter Title', '');
      isOk = false;
    } else if (
      this.data.DESCRIPTION == undefined ||
      this.data.DESCRIPTION.trim() == ''
    ) {
      this.message.error('Please Enter Description', '');
      isOk = false;
    } else if (
      this.data.SERVICE_ROUTE == undefined ||
      this.data.SERVICE_ROUTE.trim() == ''
    ) {
      this.message.error('Please Enter Service Route', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    } else if (
      this.data.SHORT_CODE == undefined ||
      this.data.SHORT_CODE.trim() == ''
    ) {
      this.message.error('Please Enter Short Code', '');
      isOk = false;
    } else if (this.data.ROLE_DATA == undefined || this.data.ROLE_DATA == '') {
      isOk = false;
      this.message.error('Please Enter Role Data', '');
    } else if (this.data.IMG_URL == null || this.data.IMG_URL.trim() == '') {
      isOk = false;
      this.message.error(' Please Select Image ', '');
    } else if (
      this.data.SERVICE_IMG == null ||
      this.data.SERVICE_IMG.trim() == ''
    ) {
      isOk = false;
      this.message.error(' Please Select Service Image ', '');
    }

    if (isOk) {
      this.isSpinning = true;

      this.data.ROLE_DATA = this.data.ROLE_DATA.toString();
      // this.data.ROLE_DATA.push(this.d.ROLE_ID)
      if (this.data.ID) {
        this.api.updateService(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.IMG_URL = '';
            this.data.SERVICE_IMG = '';
            this.data.ROLE_DATA = '';
            this.message.success(
              'Service information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update Service  information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createService(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(servicePage);
            this.message.success(
              'Service information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
              this.isSpinning = false;
              servicePage.form.reset();
            } else {
              this.data = new Service();
              this.data.ROLE_DATA = '';

              this.resetDrawer(servicePage);
              this.api.getAllService(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
                (data) => {
                  if (data['count'] == 0) {
                    this.data.SEQUENCE_NO = 1;
                  } else {
                    this.data.SEQUENCE_NO = data['data'][0]['SEQUENCE_NO'] + 1;
                  }
                },
                (err) => {
                  console.log(err);
                }
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to add Service information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  resetDrawer(servicePage: NgForm) {
    this.data = new Service();
    this.data.IMG_URL = '';
    this.data.SERVICE_IMG = '';
    this.data.ROLE_DATA = '';
    this.fileDataURL = null;
    this.fileDataIMAGE_URL = null;
    servicePage.form.markAsPristine();
    servicePage.form.markAsUntouched();
  }

  alphaonly(event) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    ) {
      return false;
    }

    return true;
  }
  event1: any;
  image: any;
  onFileSelectedIMAGE_URL(event) {
    let imgs = new Image();
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    // const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
    imgs.onload = () => {
      if (
        (event.target.files[0].type == 'image/jpeg' ||
          event.target.files[0].type == 'image/jpg' ||
          event.target.files[0].type == 'image/png') &&
        imgs.height == 67 &&
        imgs.width == 80
      ) {
        // isLtsize = true;
        this.fileDataIMAGE_URL = <File>event.target.files[0];
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.image = reader.result as string;
          };

          var number = Math.floor(100000 + Math.random() * 900000);

          var fileExt = this.fileDataIMAGE_URL.name.split('.').pop();

          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');

          var url = '';
          url = d == null ? '' : d + number + '.' + fileExt;
          // url =  d + number + '.' + fileExt;
          this.api.onUpload(this.folderName, this.fileDataIMAGE_URL, url);

          this.event1 = url;
          this.data.IMG_URL = url;
        }
      } else {
        this.message.error(
          'Please upload an image having type png,jpg,jpeg and with size 67*80',
          ''
        );
        this.fileDataIMAGE_URL = null;
        this.data.IMG_URL = '';
      }
    };
  }

  image1: any;
  onFileSelectedimage(event) {
    let imgs = new Image();
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    // const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
    imgs.onload = () => {
      if (
        (event.target.files[0].type == 'image/jpeg' ||
          event.target.files[0].type == 'image/jpg' ||
          event.target.files[0].type == 'image/png') &&
        imgs.height == 220 &&
        imgs.width == 356
      ) {
        // isLtsize = true;
        this.fileDataURL = <File>event.target.files[0];
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.image1 = reader.result as string;
          };
          var number = Math.floor(100000 + Math.random() * 900000);

          var fileExt = this.fileDataURL.name.split('.').pop();

          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');

          var url1 = '';
          url1 = d == null ? '' : d + number + '.' + fileExt;
          // url =  d + number + '.' + fileExt;
          this.api.onUpload(this.folderName1, this.fileDataURL, url1);

          this.event1 = url1;
          this.data.SERVICE_IMG = url1;
        }
      } else {
        this.message.error(
          'Please upload an image having type png,jpg,jpeg and with size 220 * 356',
          ''
        );
        this.fileDataURL = null;
        this.data.SERVICE_IMG = '';
      }
    };
  }
  image2: any;

  // clear() {
  //   this.fileDataIMAGE_URL = null;
  //   this.data.IMG_URL=''
  // }
  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileDataIMAGE_URL = null;
          this.data.IMG_URL = '';
          this.message.success('Image Deleted Successfully', '');
        } else {
          this.message.error('Failed To Delete', '');
        }
      },
      (err) => {
        this.message.error('Failed To Delete', '');
        console.log(err);
      }
    );
  }
  // clear1() {
  //   // this.fileDataURL = null;
  //   this.fileDataURL = null;
  //   this.data.SERVICE_IMG='';
  // }

  clear1(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileDataURL = null;
          this.data.SERVICE_IMG = '';
          this.message.success('Image Deleted Successfully', '');
        } else {
          this.message.error('Failed To Delete', '');
        }
      },
      (err) => {
        this.message.error('Failed To Delete', '');
        console.log(err);
      }
    );
  }
}
