import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { News } from 'src/app/Modal/news';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [DatePipe],
})
export class NewsComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: News;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  // this.data.NEWS_CONTENT_TYPE='P
  imgurl = appkeys.retriveimgUrl;
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  dateFormat = 'yyyy-MM-dd';
  fileDataIMAGE_URL: File | null = null;

  folderName = 'news';
  details: any = [];

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

  showradio: any;
  dataclciik(data) {
    this.showradio = data;
  }

  save(addNew: boolean): void {
    var isOk = true;
    if (
      this.data.NAME == undefined &&
      this.data.NAME == '' &&
      this.data.DATE == undefined &&
      this.data.DATE == ''
    ) {
      this.message.error('Please Select All Required Fields', '');
      isOk = false;
    } else if (this.data.NAME == undefined || this.data.NAME == '') {
      this.message.error('Please Enter Name', '');
      isOk = false;
    } else if (this.data.DATE == undefined || this.data.DATE == '') {
      this.message.error('Please Select Date', '');
      isOk = false;
    } else if (this.data.NEWS_CONTENT_TYPE == 'P' && this.data.NEWS_URL == '') {
      this.message.error('Please Upload PDF', '');
      isOk = false;
    } else if (this.data.NEWS_CONTENT_TYPE == 'L' && this.data.NEWS_URL == '') {
      this.message.error('Please Enter Link', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    } else if (this.data.SHOW_IN_SERVICE == true && this.data.SERVICE_ID <= 0) {
      this.message.error('Please Select Service Name', '');
      isOk = false;
    }

    if (isOk) {
      this.isSpinning = true;
      this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');

      if (this.data.ID) {
        this.api.updateNews(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.IMG_URL = '';
            this.data.NEWS_URL = '';

            this.message.success(
              'News information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update News information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createNews(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.IMG_URL = '';
            this.data.NEWS_URL = '';
            this.fileDataIMAGE_URL = null;
            this.fileURL = null;
            this.message.success('News information added successfully...', '');
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new News();
              this.data.IMG_URL = '';
              this.data.NEWS_URL = '';
              this.fileDataIMAGE_URL = null;
              this.fileURL = null;
              this.api.getAllNews(1, 1, '', 'desc', '').subscribe(
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
              ); // this.logtext = 'Save & New - OrgInfo form - SUCCESS - '+ JSON.stringify(this.data)+" KEYWORD [C - OrgInfo ]";
            }
            this.isSpinning = false;
          } else {
            this.message.error('Failed to add News information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  event1: any;
  image: any;

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

            var url = '';
            url = d == null ? '' : d + number + '.' + fileExt;
            this.api.onUpload(this.folderName, this.fileDataIMAGE_URL, url);

            this.event1 = url;
            this.data.IMG_URL = url;
          }
        } else {
          this.message.error(
            'Please upload an image having type png,jpg,jpeg and with size 480*480',
            ''
          );
          this.fileDataIMAGE_URL = null;
          this.data.IMG_URL = '';
        }
      };
    }
  }
  fileURL: any = File;
  filesAmount;
  files;
  typeArry: any;

  url11: any;
  onFileSelected(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL = <File>event.target.files[0];
    } else {
      this.message.error('Please Select Only PDF File', '');

      // this.fileURL = null;
    }

    if (this.fileURL !== null && this.fileURL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      console.log(number);
      console.log(fileExt);
      // url = this.date1 + number + '.' + fileExt;
      this.url11 = this.fileURL.name;
      this.api.onUpload(this.folderName, this.fileURL, this.url11);
    }

    if (this.data.NEWS_CONTENT_TYPE == 'P') {
      this.data.NEWS_URL = this.url11;
    } else {
      this.data.NEWS_URL = this.data.NEWS_URL;
    }
  }

  // clear() {

  //   this.fileDataIMAGE_URL=null
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
  // clear1() {
  //   this.data.NEWS_URL = '';
  //   this.fileURL=null

  // }
  clear1(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileURL = null;
          this.data.NEWS_URL = '';
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
}
