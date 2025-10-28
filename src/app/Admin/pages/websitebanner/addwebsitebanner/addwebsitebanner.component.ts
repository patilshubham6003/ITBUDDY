import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebsiteBannerMaster } from 'src/app/Modal/WebsiteBannerMaster';
// import { ClientmasterService } from 'src/app/Services/clientmaster.service';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-addwebsitebanner',
  templateUrl: './addwebsitebanner.component.html',
  styleUrls: ['./addwebsitebanner.component.css'],
  providers: [DatePipe],
})
export class AddwebsitebannerComponent implements OnInit {
  isSpinning = false;
  folderName = 'websiteBanner';
  @Input()
  drawerClose!: Function;
  @Input()
  data: WebsiteBannerMaster = new WebsiteBannerMaster();
  @Input()
  drawerVisible: boolean = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  imgurl = appkeys.retriveimgUrl;
  @Input() color: any;
  @Input() colort1: any;
  @Input() colort2: any;
  height = 540;
  width = 1920;
  fileURL: any;
  details: any = [];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    public datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.api.getAllService(0, 0, '', '', ' AND STATUS=1').subscribe(
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

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new WebsiteBannerMaster();
    this.data.IMG_URL = '';
    this.fileURL = null;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  numchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return true;
    if (48 <= charCode && charCode <= 57) return true;
    if (65 <= charCode && charCode <= 90) return true;
    if (97 <= charCode && charCode <= 122) return true;
    return false;
  }

  nonumchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return false;
    if (48 <= charCode && charCode <= 57) return false;
    if (65 <= charCode && charCode <= 90) return false;
    if (97 <= charCode && charCode <= 122) return false;
    return false;
  }

  save(addNew: boolean, websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.COLOR_CODE_NAME = this.color;
    this.data.COLOR_CODE_T1 = this.colort1;
    this.data.COLOR_CODE_T2 = this.colort2;

    if (
      this.data.NAME.trim() == '' &&
      this.data.SUB_TITLE.trim() == '' &&
      this.data.SUB_TITLE2.trim() == '' &&
      this.data.IMG_URL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Banner Name ', '');
    } else if (this.data.NAME.length > 256) {
      this.isOk = false;
      this.message.error(' Banner Name length should be less than 256 ', '');
    } else if (!this.namepatt.test(this.data.NAME)) {
      this.isOk = false;
      this.message.error(' Please Enter Valid Banner Name ', '');
    } else if (
      this.data.SUB_TITLE == null ||
      this.data.SUB_TITLE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sub Title ', '');
    } else if (this.data.SUB_TITLE.length > 256) {
      this.isOk = false;
      this.message.error(' Sub Title length should be less than 256', '');
    } else if (!this.namepatt.test(this.data.SUB_TITLE)) {
      this.isOk = false;
      this.message.error(' Please Enter Valid Sub Title ', '');
    } else if (
      this.data.SUB_TITLE2 == null ||
      this.data.SUB_TITLE2.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sub Title2 ', '');
    } else if (this.data.SUB_TITLE2.length > 256) {
      this.isOk = false;
      this.message.error(' Sub Title 2 length should be less than 256', '');
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    } else if (this.data.SHOW_IN_SERVICE == true && this.data.SERVICE_ID <= 0) {
      this.isOk = false;
      this.message.error(' Please Select Service Name', '');
    } else if (
      this.data.IMG_URL == undefined ||
      this.data.IMG_URL.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Select Image', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updatewebsiteBanner(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(websitebannerPage);

            this.data = new WebsiteBannerMaster();
            this.message.success(
              'Website Banner information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to update Website Banner  information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createwebsiteBanner(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.COLOR_CODE_NAME = '';
            this.data.COLOR_CODE_T1 = '';
            this.data.COLOR_CODE_T2 = '';
            this.resetDrawer(websitebannerPage);

            this.data = new WebsiteBannerMaster();

            this.message.success(
              'Website Banner information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
              this.isSpinning = false;
              websitebannerPage.form.reset();
            } else {
              this.data = new WebsiteBannerMaster();
              this.resetDrawer(websitebannerPage);
              this.api
                .getAllwebsiteBanner(1, 1, 'SEQUENCE_NO', 'desc', '')
                .subscribe(
                  (data) => {
                    if (data['count'] == 0) {
                      this.data.SEQUENCE_NO = 1;
                    } else {
                      this.data.SEQUENCE_NO =
                        data['data'][0]['SEQUENCE_NO'] + 1;
                    }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to add Website Banner information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      }
    }
  }

  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  event1: any;
  image: any;

  genarateKeyIMAGE_URL() {
    let url: string = ''; // Initialize url with a default value

    if (this.fileURL !== null && this.date1 !== null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      url = this.date1 + number + '.' + fileExt;
      this.api.onUpload('websiteBanner', this.fileURL, url);
    }

    this.data.IMG_URL = url;
    return this.data.IMG_URL;
  }

  onFileSelected(event) {
    let imgs = new Image();
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    imgs.onload = () => {
      if (
        (event.target.files[0].type == 'image/jpeg' ||
          event.target.files[0].type == 'image/jpg' ||
          event.target.files[0].type == 'image/png') &&
        imgs.height == 540 &&
        imgs.width == 1920
      ) {
        // isLtsize = true;
        this.fileURL = <File>event.target.files[0];
        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.image = reader.result as string;
          };

          var number = Math.floor(100000 + Math.random() * 900000);

          var fileExt = this.fileURL.name.split('.').pop();

          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');

          var url = '';
          url = d == null ? '' : d + number + '.' + fileExt;
          // url =  d + number + '.' + fileExt;
          this.api.onUpload(this.folderName, this.fileURL, url);

          this.event1 = url;
          this.data.IMG_URL = url;
        }
      } else {
        this.message.error(
          'Please upload an image having type png,jpg,jpeg and with size 1920*540',
          ''
        );
        this.fileURL = null;
        this.data.IMG_URL = '';
      }
    };
  }
  // removeImage() {
  //   this.data.IMG_URL = '';
  //   this.fileURL = null;
  // }

  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURL = null;
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

  max1 = 256;
  // max2 = 256;
  editorConfig1: AngularEditorConfig = {
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
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fonts', 'uploadUrl'], ['video']],
  };

  editorConfig2: AngularEditorConfig = {
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
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fonts', 'uploadUrl'], ['video']],
  };

  editorConfig3: AngularEditorConfig = {
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
      { class: 'big-caslon', name: 'Big Caslon' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'bodoni-mt', name: 'Bodoni MT' },
      { class: 'book-antiqua', name: 'Book Antiqua' },
      { class: 'courier-new', name: 'Courier New' },
      { class: 'lucida-console', name: 'Lucida Console' },
      { class: 'trebuchet-ms', name: 'Trebuchet MS' },
      { class: 'candara', name: 'Candara' },
    ],

    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['fonts', 'uploadUrl'], ['video']],
  };
}
