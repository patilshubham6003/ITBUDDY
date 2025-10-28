import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Download } from 'src/app/Modal/download';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css'],
  providers: [DatePipe],
})
export class DownloadsComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: Download = new Download();
  @Input() Visible: any;
  isSpinning = false;
  isOk = true;
  serviceName: any = [];
  fileURL: File | null = null;
  fileURLforC: File | null = null;
  fileURLforTV: File | null = null;
  isokfile: boolean;
  folderName = 'downloadFile';
  folderName1 = 'downloadVideo';
  imgurl = appkeys.retriveimgUrl;
  fileDataIMAGE_URL: any = null;

  ngOnInit() {
    this.getServiceName();
    // this.getDownloadData();
  }

  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  resetDrawer(downloadPage: NgForm) {
    this.data = new Download();
    this.data.FILE_URL = '';
    this.data.VIDEO_THUMBNAIL = '';
    this.data.serviceData = '';
    this.fileDataIMAGE_URL = null;
    this.fileURLforTV = null;
    this.fileURLforC = null;
    this.fileURL = null;

    downloadPage.form.markAsPristine();
    downloadPage.form.markAsUntouched();
  }

  close(downloadPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(downloadPage);
    downloadPage.form.reset();
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getServiceName() {
    this.api.getAllService(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.serviceName = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getDownloadData() {
    this.api.getDownloads(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.data = data['data'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  urlM: string = '';
  urlC: string = '';
  onFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL = <File>event.target.files[0];
    } else {
      this.message.error('Please Select Only PDF File', '');
      // this.fileURL = null;
    }
    if (this.fileURL != null && this.fileURL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      console.log(number);
      console.log(fileExt);
      // url = this.date1 + number + '.' + fileExt;
      this.urlM = this.fileURL.name;
      this.api.onUpload(this.folderName, this.fileURL, this.urlM);
    }
    this.data.FILE_URL = this.urlM;
  }

  onFileSelectedforC(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURLforC = <File>event.target.files[0];
    } else {
      this.message.error('Please Select Only PDF File', '');
    }
    if (this.fileURLforC != null && this.fileURLforC) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURLforC.name.split('.').pop();
      console.log(number);
      console.log(fileExt);
      // url = this.date1 + number + '.' + fileExt;
      this.urlC = this.fileURLforC.name;
      this.api.onUpload(this.folderName, this.fileURLforC, this.urlC);
    }
    this.data.FILE_URL = this.urlC;
  }
  image: any;
  image1: any;

  url11 = '';

  event: any;
  onFileSelectedforTV(event: any) {
    if (
      event.target.files[0].type == 'video/mp4' ||
      event.target.files[0].type == 'video/x-m4v' ||
      event.target.files[0].type == 'video/*' ||
      event.target.files[0].type == 'video/WEBM' ||
      event.target.files[0].type == 'video/webm'
    ) {
      this.fileURLforTV = <File>event.target.files[0];
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.image1 = reader.result as string;
        };

        var number = Math.floor(100000 + Math.random() * 900000);

        var fileExt = this.fileURLforTV.name.split('.').pop();

        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        console.log(number);
        console.log(fileExt);
        console.log(d);
        var url = '';
        url = this.fileURLforTV.name;
        this.api.onUpload(this.folderName, this.fileURLforTV, url);
        this.event = url;
        this.data.FILE_URL = url;
      } else {
        this.message.error(
          'Please Upload only mp4/ x-m4v/ WEBM/webm files.',
          ''
        );
        this.fileDataIMAGE_URL = null;
        this.data.FILE_URL = '';
      }
    }
  }
  event1: any;
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
          imgs.height == 480 &&
          imgs.width == 480
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

            var url1 = '';
            url1 = d == null ? '' : d + number + '.' + fileExt;
            this.api.onUpload(this.folderName1, this.fileDataIMAGE_URL, url1);

            this.event1 = url1;
            this.data.VIDEO_THUMBNAIL = url1;
          }
        } else {
          this.message.error(
            'Please upload an image having type png,jpg,jpeg and with size 480*480',
            ''
          );
          this.fileDataIMAGE_URL = null;
          this.data.VIDEO_THUMBNAIL = '';
        }
      };
    }
  }

  clickdatassss(data: any) {
    this.data.SERVICE_ID = data;
  }

  save(addNew: boolean, downloadPage: NgForm): void {
    var isOk = true;
    if (
      this.data.TITLE.trim() == '' &&
      this.data.serviceData == '' &&
      this.data.FILE_TYPE == undefined &&
      this.data.FILE_TYPE == '' &&
      this.data.SEQUENCE_NO == null
    ) {
      this.message.error('Please Select All Required Fields', '');
      isOk = false;
    } else if (this.data.TITLE == undefined || this.data.TITLE == '') {
      this.message.error('Please Enter Title', '');
      isOk = false;
    } else if (
      this.data.serviceData == undefined ||
      this.data.serviceData == ''
    ) {
      this.message.error('Please Select Service Name', '');
      isOk = false;
    } else if (this.data.FILE_TYPE == undefined || this.data.FILE_TYPE == '') {
      this.message.error('Please Select File Type', '');
      isOk = false;
    } else if (this.data.FILE_TYPE == 'M' && this.data.FILE_URL.trim() == '') {
      this.message.error('Please Upload Manual PDF ', '');
      isOk = false;
    } else if (this.data.FILE_TYPE == 'C' && this.data.FILE_URL.trim() == '') {
      this.message.error('Please Upload Circular PDF ', '');
      isOk = false;
    } else if (this.data.FILE_TYPE == 'TV' && this.data.FILE_URL.trim() == '') {
      this.message.error('Please Upload Training Video ', '');
      isOk = false;
    } else if (
      this.data.FILE_TYPE == 'TV' &&
      this.data.VIDEO_THUMBNAIL.trim() == ''
    ) {
      this.message.error('Please Upload Image', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    }
    if (isOk) {
      this.isSpinning = true;
      // this.data.SERVICE_ARRAY=this.data.SERVICE_ARRAY.toString();

      if (this.data.ID) {
        this.data.SERVICE_ID = this.data.serviceData;
        this.api.updateDownload(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.FILE_URL = '';
            this.data.serviceData = '';
            this.message.success(
              'Download Information Updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Update Download Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createDownloads(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(downloadPage);
            this.message.success(
              'Download Information Added Successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Download();
              this.resetDrawer(downloadPage);
              this.api.getDownloads(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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
            this.message.error('Failed to add Download Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  // clear() {
  //   this.fileURL = null;
  //   this.data.FILE_URL='';
  // }
  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURL = null;
          this.data.FILE_URL = '';
          this.message.success('PDF Deleted Successfully', '');
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

  clearforC(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURLforC = null;
          this.data.FILE_URL = '';
          this.message.success('PDF Deleted Successfully', '');
        } else {
          this.message.error('Failed To Delete', '');
        }
      },
      (err) => {
        this.message.error('Failed to delete', '');
        console.log(err);
      }
    );
  }

  clearforTV(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURLforTV = null;
          this.data.FILE_URL = '';
          this.message.success('Video Deleted Successfully', '');
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

  clearimage(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileDataIMAGE_URL = null;
          this.data.VIDEO_THUMBNAIL = '';
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
