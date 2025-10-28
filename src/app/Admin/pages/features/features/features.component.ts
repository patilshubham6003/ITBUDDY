import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Feature } from 'src/app/Modal/feature';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css'],
  providers: [DatePipe],
})
export class FeaturesComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Feature;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  details: any = [];
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  event1: any;
  image: any;
  fileDataIMAGE_URL: File | null = null;
  imgurl = appkeys.retriveimgUrl;
  folderName = 'feature';
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {
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
      this.data.NAME.trim() == '' &&
      this.data.DESCRIPTION.trim() == '' &&
      this.data.SERVICE_ID <= 0 &&
      this.data.IMG_URL.trim() == ''
    ) {
      this.message.error('Please Fill All Required Fields', '');
      isOk = false;
    } else if (this.data.NAME == undefined || this.data.NAME.trim() == '') {
      this.message.error('Please Enter Name', '');
      isOk = false;
    } else if (
      this.data.DESCRIPTION == undefined ||
      this.data.DESCRIPTION.trim() == ''
    ) {
      this.message.error('Please Enter Description', '');
      isOk = false;
    } else if (this.data.SERVICE_ID == undefined || this.data.SERVICE_ID <= 0) {
      this.message.error('Please Select Service Name', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    } else if (this.data.IMG_URL == null || this.data.IMG_URL.trim() == '') {
      isOk = false;
      this.message.error(' Please select Image', '');
    }
    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateFeature(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'Features information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update Features information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createFeature(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.IMG_URL = '';
            this.message.success(
              'Features information added successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Feature();
              this.fileDataIMAGE_URL = null;
              this.api.getAllFeature(1, 1, '', 'desc', '').subscribe(
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
            this.message.error('Failed to add Features information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  onFileSelectedIMAGE_URL(event) {
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

          this.event1 = url;
          this.data.IMG_URL = url;
        }
      } else {
        this.message.error(
          'Please upload an image having type png,jpg,jpeg and with size 356*220',
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
