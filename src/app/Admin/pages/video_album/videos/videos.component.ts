import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { Video } from 'src/app/Modal/video';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  providers: [DatePipe],
})
export class VideosComponent implements OnInit {
  @Input() photoID: any = 0;
  @Input() drawerClose!: Function;
  @Input() data: Video = new Video();
  @Input() drawerVisible: boolean = false;
  isSpinning = false;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  fileURL: any;
  imgurl = appkeys.retriveimgUrl;
  fileDataIMAGE_URL: File | null = null;
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMdd');
  folderName = 'video';
  details: any = [];

  constructor(
    public api: ServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.api.getAllGallerycategory(0, 0, '', '', ' AND STATUS=1').subscribe(
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
  resetDrawer(videoPage: NgForm) {
    this.data = new Video();
    this.data.VIDEO_URL = '';
    this.fileDataIMAGE_URL = null;
    videoPage.form.markAsPristine();
    videoPage.form.markAsUntouched();
  }
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  save(addNew: boolean, videoPage: NgForm): void {
    var isOk = true;
    if (
      this.data.TITLE.trim() == '' &&
      this.data.CATEGORY_ID <= 0 &&
      this.data.VIDEO_URL.trim() == ''
    ) {
      this.message.error('Please Select All Required Fields', '');
      isOk = false;
    } else if (this.data.TITLE == undefined || this.data.TITLE.trim() == '') {
      this.message.error('Please Enter Title', '');
      isOk = false;
    } else if (
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO <= 0
    ) {
      isOk = false;
      this.message.error('Please Enter Sequence No.', '');
    } else if (this.data.CATEGORY_ID == null || this.data.CATEGORY_ID <= 0) {
      this.message.error('Please Select Category', '');
      isOk = false;
    } else if (
      this.data.VIDEO_URL == null ||
      this.data.VIDEO_URL.trim() == ''
    ) {
      isOk = false;
      this.message.error('Please Select Video URL ', '');
    }
    if (isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        // if (this.fileDataIMAGE_URL && this.data.VIDEO_URL) {
        //   if (this.data.VIDEO_URL == '') {
        //     this.data.VIDEO_URL = this.genarateKeyIMAGE_URL();
        //   }
        //   else {
        //     var str = this.data.VIDEO_URL.substring(
        //       this.data.VIDEO_URL.lastIndexOf('/') + 1
        //     ).split('.');
        //     var fileExt = this.fileDataIMAGE_URL.name.split('.').pop();
        //     var url = str[0] + '.' + fileExt;
        //     this.api.onUpload(this.folderName, this.fileDataIMAGE_URL, url);
        //     this.data.VIDEO_URL = url;

        //   }
        // } else {
        //   this.data.VIDEO_URL = '';
        // }
        this.api.updateVideoMaster(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(videoPage);
            this.message.success(
              'Video information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update Video information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        // if (this.fileDataIMAGE_URL) {
        //   this.data.VIDEO_URL = this.genarateKeyIMAGE_URL();
        // } else {
        //   this.data.VIDEO_URL = '';
        // }

        this.api.createVideoMaster(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetDrawer(videoPage);
            this.message.success('Video information added successfully...', '');
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Video();
              this.resetDrawer(videoPage);
              this.api
                .getAllVideoMaster(1, 1, 'SEQUENCE_NO', 'desc', '')
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
            this.message.error('Failed to add Video information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  // genarateKeyIMAGE_URL() {
  //   let url: string = ''; // Initialize url with a default value
  //   if (this.fileDataIMAGE_URL !== null && this.fileDataIMAGE_URL) {
  //     var number = Math.floor(100000 + Math.random() * 900000);
  //     var fileExt = this.fileDataIMAGE_URL.name.split('.').pop();
  //     // url = this.date1 + number + '.' + fileExt;
  //     url = this.fileDataIMAGE_URL.name;
  //     this.api.onUpload(this.folderName, this.fileDataIMAGE_URL, url);

  //   }

  //   this.data.VIDEO_URL = url;
  //   return this.data.VIDEO_URL;
  // }
  // clear() {
  //   this.fileDataIMAGE_URL = null;
  //   this.data.VIDEO_URL = '';
  // }

  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileDataIMAGE_URL = null;
          this.data.VIDEO_URL = '';
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
  image: any;
  // onFileSelected(event: any) {
  //   if (
  //     event.target.files[0].type == "video/mp4" || event.target.files[0].type == "video/x-m4v" || event.target.files[0].type == "video/*" || event.target.files[0].type == "video/WEBM" || event.target.files[0].type == "video/webm"
  //   ) {
  //     this.fileDataIMAGE_URL = <File>event.target.files[0];
  //     const reader = new FileReader();
  //     if (event.target.files && event.target.files.length) {
  //       const [file] = event.target.files;
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         this.image = reader.result as string;
  //       };

  //     } else {
  //       this.message.error("Please Upload only mp4/ x-m4v/ WEBM/webm files.", "");
  //       // this.fileDataIMAGE_URL = null;
  //       // this.data.VIDEO_URL = '';
  //     }
  //   }
  // };
  event: any;
  onFileSelected(event: any) {
    if (
      event.target.files[0].type == 'video/mp4' ||
      event.target.files[0].type == 'video/x-m4v' ||
      event.target.files[0].type == 'video/*' ||
      event.target.files[0].type == 'video/WEBM' ||
      event.target.files[0].type == 'video/webm'
    ) {
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
        console.log(number, fileExt, d);
        var url = '';
        url = this.fileDataIMAGE_URL.name;
        this.api.onUpload(this.folderName, this.fileDataIMAGE_URL, url);

        this.event = url;
        this.data.VIDEO_URL = url;
      } else {
        this.message.error(
          'Please Upload only mp4/ x-m4v/ WEBM/webm files.',
          ''
        );
        this.fileDataIMAGE_URL = null;
        this.data.VIDEO_URL = '';
      }
    }
  }
}
