import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
import counterUp from 'counterup2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-web1',
  templateUrl: './web1.component.html',
  styleUrls: ['./web1.component.css'],
  providers: [DatePipe],
})
export class Web1Component implements OnInit, AfterViewInit {
  img_url = appkeys.retriveimgUrl + 'websiteBanner/';
  retrieveimgUrl = appkeys.retriveimgUrl;
  webbanner: any = [];
  servises: any = [];
  homestat: any = [];
  scrHeight: any;
  scrWidth: any;
  show: boolean = false;
  isSpinning = true;
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  // @ViewChildren('counterElements') counterElements!: QueryList<ElementRef>;
  constructor(
    public apiService: WebsiteService,
    public router: Router,
    private toast: ToastrService,
    private datePipe: DatePipe
  ) {
    this.getScreenSize(event);
    if (this.scrWidth <= 992) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  ranksss: any = [];

  roleid: any = sessionStorage.getItem('roleId') || '';
  ngOnInit(): void {
    this.roleid = sessionStorage.getItem('roleId');

    this.apiService
      .getallDesignationForTransfer(
        0,
        0,
        'NAME',
        'asc',
        ' AND STATUS=1 AND MDB_ID is not NULL '
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ranksss = data['data'];
            } else {
            }
          }
        },
        (err) => {}
      );
    // this.getWebsiteBannerPages();
    this.totalrecords();
    this.getemployeedata();
    this.getiprdata();
    this.getServices();
    this.getnews();

    // this.getabout();
    // this.gethomestat();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  @ViewChildren('counterElements', { read: ElementRef })
  counterElements: QueryList<ElementRef>;

  private animationTriggered = false;

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.checkElementsInView.bind(this));
    this.checkElementsInView();
  }

  private checkElementsInView(): void {
    if (!this.animationTriggered) {
      this.counterElements.forEach((elementRef) => {
        const element = elementRef.nativeElement;
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          this.triggerCounterUpAnimation(element);
          this.animationTriggered = true; // Set the flag to true after triggering the animation
        }
      });
    }
  }

  private triggerCounterUpAnimation(element: HTMLElement): void {
    const countValue = element.textContent;
    if (countValue !== null && !isNaN(parseFloat(countValue))) {
      const value = parseFloat(countValue);
      counterUp(element, {
        delay: 10,
      });
    }
  }

  AllFilters() {
    this.isSpinning = true;
  }
  deadline: any;
  servclick(data, title) {
    var sanitizedTitle = title.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    localStorage.setItem('serviceid', data);
    this.router.navigate(['/service/' + aa]);
  }

  servicedetailroutecon() {
    sessionStorage.setItem('Isservisedetail', 'F');
    this.router.navigate(['/notifications/']);
  }
  getWebsiteBannerPages() {
    this.apiService
      .getAllwebsiteBanner(
        0,
        0,
        'SEQUENCE_NO',
        'desc',
        ' AND STATUS=1 AND SHOW_IN_HOME=1'
      )
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.webbanner = data['data'];
        }
      });
  }
  homecount: any;
  gethomestat() {
    this.apiService
      .getstatsmastrrrrr(
        0,
        0,
        'SEQUENCE_NO',
        'asc',
        ' AND STATUS=1 AND IS_ON_HOME=1'
      )
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.homestat = data['data'];
          this.homecount = data['count'];
        }
      });
  }
  getServices() {
    this.apiService
      .getservices(0, 0, 'SEQUENCE_NO', 'asc', ' AND STATUS=1 ')
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.servises = data['data'];
          this.isSpinning = false;
        }
      });
  }
  getAnimationDuration(): string {
    const newsCount = this.news.length;
    const animationDuration = newsCount * 5 + 's';
    return animationDuration;
  }
  settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    speed: 800,
    arrows: false,
    fade: false,
    dots: false,
    swipe: true,
    adaptiveHeight: true,
    nextArrow: '<button><i class="bi bi-arrow-left-circle-fill"></i></button>',
    prevArrow: '<button><i class="bi bi-arrow-right-circle-fill"></i></button>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  news: any = [];
  news1: any = [];
  ncounts: any;
  getnews() {
    // this.apiService
    //   .getnews(1, 20, 'IS_LATEST', 'desc', ' AND STATUS=1')
    //   .subscribe((data) => {
    //     if (data['code'] == 200) {
    //       this.news = data['data'];
    //       this.ncounts = data['count'];
    //     }
    //   });
    this.apiService
      .getnews(1, 10, 'DATE', 'desc', ' AND STATUS=1 AND IS_LATEST=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.news1 = data['data'];
          this.news = data['data'];
          this.ncounts = data['count'];
        }
      });
  }
  about1: any;
  getabout() {
    this.apiService
      .getabout(1, 1, 'SEQUENCE_NO', 'asc', ' AND STATUS=1 AND IS_ON_HOME=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.about1 = data['data'][0];
        }
      });
  }
  searchText: string = '';
  showx = false;
  searchBlogs1() {
    this.getnews();
    this.showx = false;
    this.searchText = '';
  }
  searchBlogs(event: any) {
    var filter = '';
    if (event == '') {
      filter = '';
      this.showx = false;
    } else {
      filter = " AND NAME like '%" + event + "%'";
      this.showx = true;
    }
    this.apiService
      .getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1' + filter)
      .subscribe((data) => {
        this.news = data['data'];
        this.ncounts = data['count'];
      });
  }

  ROLEDATA: any = [];
  SERVICE_ROUTERLINK: any;
  loadserv: any;
  @Output() getAllFilter: any = new EventEmitter();
  @ViewChild('exampleModal111w') exampleModal111w: ElementRef;
  @ViewChild('ggggggggg11') ggggggggg11: ElementRef;
  @ViewChild('outofservice1') outofservice1: ElementRef;
  getServices33(data: any) {
    this.isSpinning = true;
    localStorage.setItem('serviceid', data);
    this.loadserv = localStorage.getItem('serviceid');
    this.apiService
      .getservices(0, 0, '', 'desc', ' AND STATUS=1 AND ID=' + this.loadserv)
      .subscribe(
        (data) => {
          if (data['code'] == '200') {
            if (
              data['data'][0]['SERVICE_ROUTE'] == '' ||
              data['data'][0]['SERVICE_ROUTE'] == null ||
              data['data'][0]['SERVICE_ROUTE'] == undefined
            ) {
              this.isSpinning = false;
            }
            this.SERVICE_ROUTERLINK = data['data'][0]['SERVICE_ROUTE'];
            this.ROLEDATA = data['data'][0]['ROLE_DATA'];
            this.openServiceAdmin();
          } else {
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  openServiceAdmin() {
    if (
      sessionStorage.getItem('isLoggedIn') != undefined &&
      sessionStorage.getItem('isLoggedIn') != null
    ) {
      localStorage.setItem('isfirst', 'one');
      localStorage.setItem('firsttime', 'true');
      if (
        this.SERVICE_ROUTERLINK != '' &&
        this.SERVICE_ROUTERLINK != null &&
        this.SERVICE_ROUTERLINK != undefined
      ) {
        var sessionroleId = sessionStorage.getItem('roleId');
        var ids = this.ROLEDATA.split(',');
        if (ids.findIndex((x) => x == sessionroleId) > -1) {
          // this.getAllFilter.emit();
          this.router.navigateByUrl(this.SERVICE_ROUTERLINK, {
            replaceUrl: false,
          });
          this.router.navigate([this.SERVICE_ROUTERLINK]).then(() => {
            this.isSpinning = false;
          });
          // this.isSpinning = false;
        } else {
          this.isSpinning = false;
          this.outofservice1.nativeElement.click();
        }
      } else {
        this.isSpinning = false;
        this.ggggggggg11.nativeElement.click();
      }
    } else {
      this.isSpinning = false;
      this.exampleModal111w.nativeElement.click();
    }
  }

  CURRENT_POSTING: any = '';
  EMPLOYEE_CODE: any = '';
  NAME: any = '';

  @ViewChild('iprmodel') iprmodel: ElementRef;
  @ViewChild('clodeOTP11111') clodeOTP11111: ElementRef;
  openiprmodel() {
    this.iiprSpinning = true;
    this.apiService
      .getEmployeeMaster(
        0,
        0,
        '',
        '',
        ' AND ID = ' + Number(sessionStorage.getItem('userId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.iiprSpinning = false;
            // this.dataList = data['data'];
            this.NAME =
              data['data'][0]['FIRST_NAME'] != null &&
              data['data'][0]['FIRST_NAME'] != undefined &&
              data['data'][0]['FIRST_NAME'] != ''
                ? data['data'][0]['FIRST_NAME']
                : '' + ' ' + data['data'][0]['MIDDLE_NAME'] != null &&
                  data['data'][0]['MIDDLE_NAME'] != undefined &&
                  data['data'][0]['MIDDLE_NAME'] != ''
                ? data['data'][0]['MIDDLE_NAME']
                : '' + ' ' + data['data'][0]['LAST_NAME'] != null &&
                  data['data'][0]['LAST_NAME'] != undefined &&
                  data['data'][0]['LAST_NAME'] != ''
                ? data['data'][0]['LAST_NAME']
                : '';

            this.EMPLOYEE_CODE = data['data'][0]['EMPLOYEE_CODE'];
            this.CURRENT_POSTING = data['data'][0]['DESIGNATION'];

            this.iprmodel.nativeElement.click();
          }
        },
        (err) => {}
      );
  }

  iprSpinning: boolean = false;
  submitiprform() {
    this.iprSpinning = true;
    if (this.NAME == null || this.NAME.trim() == '' || this.NAME == undefined) {
      this.toast.error('Please enter Name');
      this.iprSpinning = false;
    } else if (
      this.EMPLOYEE_CODE == null ||
      this.EMPLOYEE_CODE.trim() == '' ||
      this.EMPLOYEE_CODE == undefined
    ) {
      this.toast.error('Please employee code');
      this.iprSpinning = false;
    } else if (
      this.CURRENT_POSTING == null ||
      this.CURRENT_POSTING.trim() == '' ||
      this.CURRENT_POSTING == undefined
    ) {
      this.toast.error('Please enter current posting');
      this.iprSpinning = false;
    } else if (
      this.IPR_SIGNED_COPY == null ||
      this.IPR_SIGNED_COPY.trim() == '' ||
      this.IPR_SIGNED_COPY == undefined
    ) {
      this.toast.error('Please select IPR signed copy');
      this.iprSpinning = false;
    } else {
      var dataaaa = {
        EMPLOYEE_CODE: this.EMPLOYEE_CODE,
        IPR_SIGNED_COPY: this.IPR_SIGNED_COPY,
        CURRENT_POSTING: this.CURRENT_POSTING,
        NAME: this.NAME,
        SUBMITTED_DATE_TIME: this.datePipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        EMPLOYEE_ID: sessionStorage.getItem('userId'),
      };
      this.apiService.submitipr(dataaaa).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.toast.success(
              'Feedback Information Submitted Successfully',
              ''
            );
            this.iprSpinning = false;
            this.clodeOTP11111.nativeElement.click();
            this.getiprdata();
          } else {
            this.iprSpinning = false;
            this.toast.error('Feedback Information Not Submitted...', '');
          }
        },
        (err) => {
          this.iprSpinning = false;
        }
      );
    }
  }
  closeModal() {
    this.NAME = '';
    this.EMPLOYEE_CODE = '';
    this.IPR_SIGNED_COPY = '';
    this.CURRENT_POSTING = '';
    this.showmoreee = false;
  }

  IPR_SIGNED_COPY: any = '';
  progressBar: boolean = false;
  percent = 0;
  timer: any;
  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;
  image: any = '';
  dateeeeee: any = new Date();
  checkImagedoc(event: any) {
    const maxFileSize = 1 * 1024 * 1024;
    if (event.target.files.length == 0) {
      this.toast.error('Please Select IPR Signed Copy', '');
      this.image = null;
    } else if (event.target.files[0].type == 'application/pdf') {
      this.image = <File>event.target.files[0];
      if (this.image.size > maxFileSize) {
        this.toast.error('File size should not exceed 1024 Kb.', '');
        this.image = null;
        return;
      }
    } else {
      this.toast.error('Please select olny  pdf files.', '');
      this.image = null;
    }
    if (this.image != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.image.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = d == null ? '' : d + number + '.' + fileExt;
      if (
        this.IPR_SIGNED_COPY != undefined &&
        this.IPR_SIGNED_COPY.trim() != ''
      ) {
        var arr = this.IPR_SIGNED_COPY.split('/');
        if (arr.length > 1) {
          url = arr[0];
        }
      }

      this.uploadImagedoc(url);
    }
  }
  imgurl = appkeys.retriveimgUrl;

  uploadImagedoc(url11: any) {
    var fileURL = this.image;
    var url = url11;
    this.progressBar = true;
    this.timer = this.apiService
      .onUploadidproof1('iPRForms', fileURL, url)
      .subscribe(
        (successCode) => {
          if (successCode.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(
              (100 * successCode.loaded) / successCode.total
            );
            this.percent = percentDone;
            // if (this.percent == 100) {
            //   this.toast.success('ID Proof Uploaded Successfully');
            // }
          } else if (successCode.type == 2 && successCode.status != 200) {
            this.toast.error('Failed To Upload IPR Signed Copy', '');
            this.progressBar = false;
            this.percent = 0;
            this.IPR_SIGNED_COPY = null;
          } else if (successCode.type == 4 && successCode.status == 200) {
            if (successCode.body['code'] == 200) {
              this.IPR_SIGNED_COPY = url;
              this.toast.success('IPR Signed Copy Uploaded Successfully', '');
              this.progressBar = false;
              this.percent = 0;
            }
          }
        },
        (err) => {
          this.toast.error('Failed To Upload IPR Signed Copy', '');
          this.IPR_SIGNED_COPY = null;
          this.progressBar = false;
          this.percent = 0;
        }
      );
  }
  iiprSpinning: boolean = false;
  clearcaste(url: any, folder: any) {
    var datadelete = folder + '/' + url;
    this.apiService.deletealluploads(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.IPR_SIGNED_COPY = null;
          this.progressBar = false;
          this.percent = 0;
        } else {
          this.toast.error('Failed to delete ID Proof', '');
        }
      },
      (err) => {
        this.toast.error('Failed to delete ID Proof', '');
      }
    );
  }
  viewidproof() {
    if (this.IPR_SIGNED_COPY)
      window.open(
        this.apiService.retriveimgUrl + 'iPRForms/' + this.IPR_SIGNED_COPY
      );
  }

  clearifproff() {
    this.IPR_SIGNED_COPY = '';
    this.progressBar = false;
    this.percent = 0;
  }

  submmited: boolean = false;
  showmoreee: boolean = false;
  showmore() {
    if (this.showmoreee) {
      this.showmoreee = false;
    } else {
      this.showmoreee = true;
    }
  }

  iprdataaaa: any = [];
  SUBMITTED_DATE_TIME: any = '';
  getiprdata() {
    this.apiService
      .getIPRdata(
        0,
        0,
        '',
        '',
        ' AND EMPLOYEE_ID = ' + Number(sessionStorage.getItem('userId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.iprdataaaa = data['data'];
            if (this.iprdataaaa.length > 0) {
              this.submmited = true;
              this.SUBMITTED_DATE_TIME = data['data'][0].SUBMITTED_DATE_TIME;
              this.IPR_SIGNED_COPY = data['data'][0].IPR_SIGNED_COPY;
            } else {
              this.submmited = false;
            }
          }
        },
        (err) => {}
      );
  }

  dataPostingList: any = [];
  servicedata: any = [];
  empdataaaa: any = [];

  calculateDateDifference(fromDate: string, toDate: string): any {
    if (
      fromDate != null &&
      fromDate != '' &&
      fromDate != undefined &&
      toDate != null &&
      toDate != '' &&
      toDate != undefined
    ) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);

      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          0
        );
        days += prevMonth.getDate();
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }
      return years + ' y ' + months + ' M ' + days + 'd';
    } else {
      return '';
    }
  }

  @ViewChild('profileviewww') profileviewww: ElementRef;
  isSpinningggg = false;
  onviewclick() {
    this.isSpinning = true;
    this.apiService
      .getprofiledata(
        0,
        0,
        '',
        'desc',
        ' AND STATUS=1 AND ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.empdataaaa = data['data'][0];
          this.drawertitile =
            this.empdataaaa.NAME + ' - ' + this.empdataaaa.EMPLOYEE_CODE;

          this.apiService
            .getAllPostingDetailsMaster(
              0,
              0,
              '',
              '',
              ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId')
            )
            .subscribe((dataaaa) => {
              if (dataaaa['code'] == 200) {
                if (dataaaa['data'].length > 0) {
                  this.dataPostingList = dataaaa['data'];
                } else {
                  this.dataPostingList = [];
                }

                this.apiService
                  .getAllServiceDetails(
                    0,
                    0,
                    '',
                    'desc',
                    ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId')
                  )
                  .subscribe(
                    (data1212) => {
                      if (data1212.code == '200' && data1212.data.length > 0) {
                        this.servicedata = data1212['data'][0];
                        this.drawerVisible1s = true;
                        this.isSpinning = false;
                      } else {
                        this.servicedata = [];
                        this.drawerVisible1s = true;
                        this.isSpinning = false;
                      }
                    },
                    (err) => {
                      this.isSpinning = false;
                    }
                  );
              } else {
                this.isSpinning = false;
              }
            });

          // this.profileviewww.nativeElement.click();
          // this.isSpinningggg=false
        } else {
          this.isSpinning = false;
        }
      });
  }
  drawertitile = '';
  drawerVisible1s = false;
  Dwidth = '90%';
  drawerClosess(): void {
    this.drawerVisible1s = false;
  }
  get closeCallbackss() {
    return this.drawerClosess.bind(this);
  }

  onclickkkk() {
    this.router.navigateByUrl('/cms-service');
  }
  employeedataaaadataaaa: any;
  employeedataaaa: any = [];
  employeedataaaa11111: any = [];
  IS_ITHR_DATA: boolean = false;
  getemployeedata() {
    this.apiService
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND STATUS=1 AND ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.employeedataaaa = data['data'][0];

            this.employeedataaaa11111 = data['data'][0];
            this.employeedataaaadataaaa = data['data'][0];

            sessionStorage.setItem(
              'rankid',
              this.employeedataaaa11111.DESIGNATION_ID
            );
            if (
              sessionStorage.getItem('rankid') == null ||
              sessionStorage.getItem('rankid') == undefined ||
              sessionStorage.getItem('rankid') == '' ||
              sessionStorage.getItem('rankid') == 'null'
            ) {
              if (sessionStorage.getItem('roleId') == '2') {
                this.modelshowwwww = true;
              } else {
                this.modelshowwwww = false;
              }
            } else {
              this.modelshowwwww = false;
            }

            if (
              data['data'][0].IS_ITHR_DATA == null ||
              data['data'][0].IS_ITHR_DATA == undefined
            ) {
              this.IS_ITHR_DATA = false;
            } else {
              this.IS_ITHR_DATA = data['data'][0].IS_ITHR_DATA;
            }

            sessionStorage.setItem(
              'officeid',
              this.employeedataaaa.ITHR_OFFICE_ID
            );
          }
        },
        (err) => {}
      );
  }

  modelshowwwww = false;

  getcondition() {
    if (
      sessionStorage.getItem('roleId') != null &&
      sessionStorage.getItem('roleId') != undefined &&
      sessionStorage.getItem('roleId') != ''
    ) {
      if (sessionStorage.getItem('roleId') == '56') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  Dwidthtt = '65%';

  drawerVisiblerepresentation: boolean = false;
  drawertitilerepresentation: any =
    'Representation Module for Transfers & Postings ';
  drawerClosessrepresentation() {
    this.totalrecords();
    this.employeedataaaa = this.employeedataaaadataaaa;
    this.drawerVisiblerepresentation = false;
  }

  openrepresentation() {
    if (this.TPforview) {
      this.drawertitilerepresentation =
        'View Representation Module for Transfers & Postings ';
      this.employeedataaaa = this.tpviewdata;
    } else {
      this.drawertitilerepresentation =
        'Representation Module for Transfers & Postings ';
    }

    this.drawerVisiblerepresentation = true;
  }

  get closeCallbackssTP() {
    return this.drawerClosessrepresentation.bind(this);
  }

  TPforview: boolean = false;
  tpviewdata: any;
  totalrecords() {
    this.apiService
      .getalltpreqlist(
        0,
        0,
        '',
        '',
        ' AND EMPLOYEE_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe(
        (data) => {
          if (data['data'].length > 0) {
            this.tpviewdata = data['data'][0];
            this.TPforview = true;
          } else {
            this.TPforview = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  loadingRecords: any = false;
  handleOk() {
    this.loadingRecords = true;
    this.apiService
      .updateprofile(this.employeedataaaa11111)
      .subscribe((successCode: any) => {
        if (successCode.code == '200') {
          this.loadingRecords = false;
          window.location.reload();
          this.toast.success('Cadre Changed Successfully...', '');
        } else {
          this.toast.error('Cadre Has Not Changed...', '');
          this.loadingRecords = false;
        }
      });
  }
}
