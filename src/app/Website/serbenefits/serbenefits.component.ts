import { Component, OnInit } from '@angular/core';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';

@Component({
  selector: 'app-serbenefits',
  templateUrl: './serbenefits.component.html',
  styleUrls: ['./serbenefits.component.css']
})
export class SerbenefitsComponent implements OnInit {
  retrieveimgUrl = appkeys.retriveimgUrl;
  loadserv: any;
  constructor(public apiService: WebsiteService) { }
  ngOnInit(): void {
    this.loadserv = localStorage.getItem('serviceid');
    this.getfeatures();
  }

  benefitsettings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1100,
    pauseOnHover: true,
    speed: 500,
    arrows: false,
    fade: false,
    dots: true,
    swipe: true,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '10%',
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ]
  };
  fcount: any;
  benefit: any = [];

  getfeatures() {
    this.apiService.getbenefits(0, 0, 'SEQUENCE_NO', 'desc', " AND STATUS=1 AND SERVICE_ID=" + this.loadserv).subscribe((data) => {
      if (data['code'] == 200) {
        this.benefit = data['data'];
        this.fcount = data['count'];
        if (data['data'].length >= 3) {
          this.benefitsettings = {
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1100,
            pauseOnHover: true,
            speed: 500,
            arrows: false,
            fade: false,
            dots: true,
            swipe: true,
            responsive: [
              {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 576,
                settings: {
                  slidesToShow: 1,
                  centerMode: true,
                  centerPadding: '10%',
                },
              },
              {
                breakpoint: 400,
                settings: {
                  slidesToShow: 1,
                  centerMode: false,
                },
              },
            ]
          };
        } else if (data['data'].length == 2) {
          this.benefitsettings = {
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1100,
            pauseOnHover: true,
            speed: 500,
            arrows: false,
            fade: false,
            dots: true,
            swipe: true,
            responsive: [
              {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 576,
                settings: {
                  slidesToShow: 1,
                  centerMode: true,
                  centerPadding: '10%',
                },
              },
              {
                breakpoint: 400,
                settings: {
                  slidesToShow: 1,
                  centerMode: false,
                },
              },
            ]
          };
        } else if (data['data'].length == 1) {
          this.benefitsettings = {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1100,
            pauseOnHover: true,
            speed: 500,
            arrows: false,
            fade: false,
            dots: true,
            swipe: true,
            responsive: [
              {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 1,
                },
              },
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 576,
                settings: {
                  slidesToShow: 1,
                  centerMode: true,
                  centerPadding: '10%',
                },
              },
              {
                breakpoint: 400,
                settings: {
                  slidesToShow: 1,
                  centerMode: false,
                },
              },
            ]
          };
        } else {
          this.benefitsettings = {
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 1100,
            pauseOnHover: true,
            speed: 500,
            arrows: false,
            fade: false,
            dots: true,
            swipe: true,
            responsive: [
              {
                breakpoint: 1600,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 576,
                settings: {
                  slidesToShow: 1,
                  centerMode: true,
                  centerPadding: '10%',
                },
              },
              {
                breakpoint: 400,
                settings: {
                  slidesToShow: 1,
                  centerMode: false,
                },
              },
            ]
          };
        }
      }
    });
  }
}