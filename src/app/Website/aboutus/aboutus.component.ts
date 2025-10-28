import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
import counterUp from 'counterup2';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit, AfterViewInit{
  img_url1 = appkeys.retriveimgUrl + 'about/';
  retrieveimgUrl = appkeys.retriveimgUrl;
  about: any = [];
  vision: any;
  mission: any;
  homestat: any = [];
  isSpinning = true;
  // @ViewChildren('counterElements') counterElements!: QueryList<ElementRef>;
  constructor(public apiService: WebsiteService) { }

  ngOnInit(): void {
    this.getaboutus();
    // this.gethomestat();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  AllFilters(){
    this.isSpinning=true;
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

  @ViewChildren('counterElements', { read: ElementRef }) counterElements: QueryList<ElementRef>;

  private animationTriggered = false;

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.checkElementsInView.bind(this));
    this.checkElementsInView();
  }

  private checkElementsInView(): void {
    if (!this.animationTriggered) {
      this.counterElements.forEach(elementRef => {
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
        delay: 10
      });
    }
  }
  getaboutus() {
    this.apiService.getabout(0, 0, 'SEQUENCE_NO', 'asc', " AND STATUS=1 AND IS_ON_HOME=0")
      .subscribe(data => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.about = data['data'];
          this.vision = data['data'][0]['VISION'];
          this.mission = data['data'][0]['MISSION'];
        }
      })
  }
  gethomestat() {
    this.apiService.getstatsmastrrrrr(0, 0, '', 'asc', ' AND STATUS=1 AND IS_ON_HOME=1')
      .subscribe(data => {
        if (data['code'] == '200') {
          this.isSpinning = false;
          this.homestat = data['data'];
        }
      })
  }
}