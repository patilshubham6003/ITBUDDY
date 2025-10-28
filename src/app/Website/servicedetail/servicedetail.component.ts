import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
import counterUp from 'counterup2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicedetail',
  templateUrl: './servicedetail.component.html',
  styleUrls: ['./servicedetail.component.css'],
})
export class ServicedetailComponent implements OnInit, AfterViewInit {
  retrieveimgUrl = appkeys.retriveimgUrl;
  img_url1 = appkeys.retriveimgUrl;
  isSpinning = true;
  img_url = appkeys.retriveimgUrl + 'websiteBanner/';
  webbanner: any = [];
  downloads1: any = [];
  loadserv: any;
  servises: any = [];
  // @ViewChildren('counterElements') counterElements!: QueryList<ElementRef>;
  constructor(public apiService: WebsiteService, private router: Router) {}
  ngOnInit(): void {
    this.loadserv = localStorage.getItem('serviceid');
    this.getServices();
    this.getnews();
    // this.gethomestat();
    this.getWebsiteBannerPages();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  // ngAfterViewInit(): void {
  //   window.addEventListener('scroll', this.checkElementsInView.bind(this));
  //   this.checkElementsInView();
  // }

  // private checkElementsInView(): void {
  //   this.counterElements.forEach(elementRef => {
  //     const element = elementRef.nativeElement;
  //     const rect = element.getBoundingClientRect();
  //     if (rect.top <= window.innerHeight && rect.bottom >= 0) {
  //       this.triggerCounterUpAnimation(element);
  //     }
  //   });
  // }

  // private triggerCounterUpAnimation(element: HTMLElement): void {
  //   const countValue = element.textContent;
  //   if (countValue !== null && !isNaN(parseFloat(countValue))) {
  //     const value = parseFloat(countValue);
  //     counterUp(element, {
  //       delay: 10
  //     });
  //   }
  // }

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

  homestat: any = [];
  homecount: any;

  SERVICE_ROUTERLINK: any;
  gethomestat() {
    this.apiService
      .getstatsmastrrrrr(
        0,
        0,
        'SEQUENCE_NO',
        'asc',
        ' AND STATUS=1 AND IS_ON_SERVICE=1 AND SERVICE_ID=' + this.loadserv
      )
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.homestat = data['data'];
          this.homecount = data['count'];
        }
      });
  }
  ROLEDATA: any = [];
  AllFilters() {
    this.isSpinning = true;
  }
  getServices() {
    this.apiService
      .getservices(0, 0, '', 'desc', ' AND STATUS=1 AND ID=' + this.loadserv)
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.servises = data['data'][0];
          this.SERVICE_ROUTERLINK = data['data'][0]['SERVICE_ROUTE'];
          this.ROLEDATA = data['data'][0]['ROLE_DATA'];
        }
      });
  }
  news: any = [];
  ncounts: any;

  getnews() {
    this.apiService
      .getnews(
        1,
        20,
        'DATE',
        'desc',
        ' AND STATUS=1 AND SHOW_IN_SERVICE=1 AND SERVICE_ID=' + this.loadserv
      )
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.news = data['data'];
          this.ncounts = data['count'];
        }
      });
  }

  storeservfaq(dd: any) {
    sessionStorage.setItem('servDetailId', this.loadserv);
    sessionStorage.setItem('Isservisedetail', 'T');
    var sanitizedTitle = dd.replace(/[ ,/]/g, '-');
    var aa = sanitizedTitle.toLowerCase();
    this.router.navigate([aa + '/notifications']);
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
      .getnews(
        1,
        20,
        'DATE',
        'desc',
        ' AND STATUS=1 AND SHOW_IN_SERVICE=1' +
          filter +
          ' AND SERVICE_ID=' +
          this.loadserv
      )
      .subscribe((data) => {
        this.news = data['data'];
        this.ncounts = data['count'];
      });
  }

  getWebsiteBannerPages() {
    this.apiService
      .getAllwebsiteBanner(
        0,
        0,
        'SEQUENCE_NO',
        'desc',
        ' AND STATUS=1 AND SHOW_IN_SERVICE=1 AND SERVICE_ID=' + this.loadserv
      )
      .subscribe((data) => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.webbanner = data['data'];
        }
      });
  }

  @ViewChild('exampleModal') exampleModal: ElementRef;
  @ViewChild('ggggggggg') ggggggggg: ElementRef;

  @ViewChild('outofservice') outofservice: ElementRef;

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
          this.router.navigateByUrl(this.SERVICE_ROUTERLINK, {
            replaceUrl: false,
          });
        } else {
          this.outofservice.nativeElement.click();
        }
      } else {
        this.ggggggggg.nativeElement.click();
      }
    } else {
      this.exampleModal.nativeElement.click();
    }
  }
}
