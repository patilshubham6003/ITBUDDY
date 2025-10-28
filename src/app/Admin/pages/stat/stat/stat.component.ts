import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Stat } from 'src/app/Modal/stat';
import { ServiceService } from 'src/app/Service/service.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css'],
  providers: [DatePipe],
})
export class StatComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Stat = new Stat();
  @Input() show: boolean = false;
  isSpinning = false;
  logtext: string = '';
  isokfile: boolean;
  imgurl = appkeys.retriveimgUrl;
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyy-MM-dd');
  dateFormat = 'yyyy-MM-dd';

  folderName = 'countImg';
  folderName1 = 'statFileImg';
  folderName2 = 'statInspectorImg';

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
      this.data.TOTAL_COUNT <= 0 &&
      this.data.SERVICE_ID <= 0 &&
      this.data.COUNT_URL.trim() == ''
    ) {
      this.message.error('Please Select All Required Fields', '');
      isOk = false;
    } else if (this.data.TITLE == undefined || this.data.TITLE.trim() == '') {
      this.message.error('Please Enter Title', '');
      isOk = false;
    } else if (
      this.data.TOTAL_COUNT == undefined ||
      this.data.TOTAL_COUNT <= 0
    ) {
      this.message.error('Please Enter Count', '');
      isOk = false;
    } else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    } else if (this.data.IS_ON_SERVICE == true && this.data.SERVICE_ID <= 0) {
      isOk = false;
      this.message.error(' Please Select Service Name', '');
    } else if (
      this.data.COUNT_URL == undefined ||
      this.data.COUNT_URL.trim() == ''
    ) {
      this.message.error('Please Select Image', '');
      isOk = false;
    }
    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateStat(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.COUNT_URL = '';
            this.message.success(
              'Stat information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error('Failed to update Stat information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createStat(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.data.COUNT_URL = '';
            this.message.success('Stat information added successfully...', '');
            if (!addNew) {
              this.drawerClose();
            } else {
              this.data = new Stat();
              this.data.COUNT_URL = '';
              this.fileDataIMAGE_URL = null;
              this.api.getAllStat(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(
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
            this.message.error('Failed to add Stat information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  event: any;
  image: any;
  fileDataIMAGE_URL: File | null = null;

  onFileSelectedIMAGE_URL(event) {
    {
      let imgs = new Image();
      imgs.src = window.URL.createObjectURL(event.target.files[0]);
      imgs.onload = () => {
        if (
          event.target.files[0].type == 'image/png' &&
          imgs.height == 48 &&
          imgs.width == 48
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

            this.event = url;
            this.data.COUNT_URL = url;
          }
        } else {
          this.message.error(
            'Please upload an image having type png and with size 48*48',
            ''
          );
          this.fileDataIMAGE_URL = null;
          this.data.COUNT_URL = '';
        }
      };
    }
  }

  // clear() {
  //   this.data.COUNT_URL = '';
  //   this.fileDataIMAGE_URL=null

  // }

  clear(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.api.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.fileDataIMAGE_URL = null;
          this.data.COUNT_URL = '';
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
