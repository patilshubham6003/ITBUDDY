import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { About } from 'src/app/Modal/about';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-about-form',
  templateUrl: './about-form.component.html',
  styleUrls: ['./about-form.component.css'],
  providers: [DatePipe],
})
export class AboutFormComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: About;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;

  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  fileDataIMAGE_URL: File | null = null;
  folderName = 'about';
  imgurl = appkeys.retriveimgUrl;
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

  editorConfig2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '80px',
    //  minHeight: '0',
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
    height: '80px',
    // minHeight: '0',
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

  editorConfig4: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '80px',
    // minHeight: '0',
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
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {}
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

  save(addNew: boolean, aboutPage: NgForm): void {
    var isOk = true;
    if (
      this.data.TITLE.trim() == '' &&
      this.data.DESCRIPTION.trim() == '' &&
      this.data.IMG_URL.trim() == ''
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
    } else if (this.data.IMG_URL == null || this.data.IMG_URL.trim() == '') {
      isOk = false;
      this.message.error(' Please Select Image ', '');
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    }
    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateAbout(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(aboutPage);
            this.message.success(
              'About Us  information updated Successfully',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update About Us  information', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createAbout(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(aboutPage);
            this.message.success(
              'About Us  information added successfully',
              ''
            );
            if (!addNew) {
              this.drawerClose();
              this.isSpinning = false;
              aboutPage.form.reset();
            } else {
              this.data = new About();
              this.resetDrawer(aboutPage);
              this.api.getAllAbout(1, 1, '', 'desc', '').subscribe(
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
              // this.logtext = 'Save & New - OrgInfo form - SUCCESS - '+ JSON.stringify(this.data)+" KEYWORD [C - OrgInfo ]";
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to add About Us information', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  resetDrawer(aboutPage: NgForm) {
    this.data = new About();
    this.data.IMG_URL = '';
    this.fileDataIMAGE_URL = null;
    aboutPage.form.markAsPristine();
    aboutPage.form.markAsUntouched();
  }
  image: any;
  event1: any;
  onFileSelectedIMAGE_URL(event) {
    let imgs = new Image();
    imgs.src = window.URL.createObjectURL(event.target.files[0]);
    // const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
    imgs.onload = () => {
      if (
        (event.target.files[0].type == 'image/jpeg' ||
          event.target.files[0].type == 'image/jpg' ||
          event.target.files[0].type == 'image/png') &&
        imgs.height == 370 &&
        imgs.width == 450
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
          'Please upload an image having type png,jpg,jpeg and with size 370*450',
          ''
        );
        this.fileDataIMAGE_URL = null;
        this.data.IMG_URL = '';
      }
    };
  }

  // clear() {
  //   this.fileDataIMAGE_URL = null;
  //   this.data.IMG_URL = '';
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
}
