import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Gallery } from 'src/app/Modal/gallery';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  providers: [DatePipe],
})
export class GalleryComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Gallery;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean = false;
  details: any = [];
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  fileDataIMAGE_URL: File | null = null;
  folderName = 'gallary';
  imgurl = appkeys.retriveimgUrl;
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.api.getAllGallerycategory(0, 0, '', 'desc', ' AND STATUS=1').subscribe(
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

  save(addNew: boolean): void {
    var isOk = true;
    if (
      this.data.TITLE.trim() == '' &&
      this.data.CATEGORY_ID <= 0 &&
      this.data.IMG_URL.trim() == ''
    ) {
      this.message.error('Please Fill All Required Fields', '');
      isOk = false;
    } else if (this.data.TITLE == undefined || this.data.TITLE.trim() == '') {
      this.message.error('Please Enter Title', '');
      isOk = false;
    } else if (this.data.CATEGORY_ID == null || this.data.CATEGORY_ID <= 0) {
      this.message.error('Please Select Category', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    } else if (this.data.IMG_URL == null || this.data.IMG_URL.trim() == '') {
      isOk = false;
      this.message.error(' Please Select Image ', '');
    }
    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateGallery(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.IMG_URL = '';
            this.message.success(
              'Gallery information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update Gallery information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createGallery(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.IMG_URL = '';
            this.message.success(
              'Gallery information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Gallery();
              this.api.getAllGallery(1, 1, '', 'desc', '').subscribe(
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
            this.message.error('Failed to add Gallery information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  image: any;
  event1;
  onFileSelectedIMAGE_URL(event) {
    {
      let imgs = new Image();
      imgs.src = window.URL.createObjectURL(event.target.files[0]);
      // const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
      imgs.onload = () => {
        if (
          (event.target.files[0].type == 'image/jpeg' ||
            event.target.files[0].type == 'image/jpg' ||
            event.target.files[0].type == 'image/png') &&
          imgs.height == 800
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
            this.api.onUpload(this.folderName, this.fileDataIMAGE_URL, url);
            // url =  d + number + '.' + fileExt;

            this.event1 = url;
            this.data.IMG_URL = url;
          }
        } else {
          this.message.error(
            'Please upload an image having type png,jpg,jpeg and 800 height',
            ''
          );
          this.fileDataIMAGE_URL = null;
          this.data.IMG_URL = '';
        }
      };
    }
  }
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
}
