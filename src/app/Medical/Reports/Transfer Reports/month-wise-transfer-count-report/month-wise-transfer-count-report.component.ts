import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};
@Component({
  selector: 'app-month-wise-transfer-count-report',
  templateUrl: './month-wise-transfer-count-report.component.html',
  styleUrls: ['./month-wise-transfer-count-report.component.css'],
})
export class MonthWiseTransferCountReportComponent implements OnInit {
  // chartOptions1: any;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: any;
  date: any = new Date();
  constructor(private datepipe: DatePipe, private api: ApiService) {
    const year = new Date().getFullYear();
    this.endDates = this.getEndDatesOfYear(year);
  }

  getLastDayOfMonth(year: number, month: number): number {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  }

  // getEndDatesOfYear(year: number): number[] {
  //   const endDates: number[] = [];
  //   for (let month = 0; month < 12; month++) {
  //     const lastDay = this.getLastDayOfMonth(year, month);
  //     endDates.push(lastDay);
  //   }
  //   return endDates;

  // }

  ngOnInit() {
    this.chartOptions = {
      series: [
        {
          name: 'Total Applications',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {},
        },
      },

      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      // xaxis: {
      //   categories: this.datapush,

      //   // labels: {
      //   //   style: {

      //   //     fontSize: '12px',
      //   //   },
      //   // },
      // },
    };
    this.userId = sessionStorage.getItem('userId');

    this.daywisedashboard();
    this.daywisecount = [];
    this.datapush = [];
    this.datapush2 = [];
    this.isLoading = true;
    this.onChange(this.date);
  }
  endDates: number[];
  daywisecount: any = [];
  datapush: any = [];
  datapush2: any = [];

  year: any;
  month: any;

  day: any;
  isLoading: boolean = false;
  userId: any = sessionStorage.getItem('userId');

  daywisedashboard() {
    this.datapush = [];
    this.datapush2 = [];
    this.isLoading = true;
    this.year = this.datepipe.transform(this.changedate, 'yyyy');
    this.month = this.datepipe.transform(this.changedate, 'MM');

    this.api
      .monthWiseTransferCountReport(
        0,
        0,
        '',
        '',
        '',
        this.enddatesarray,
        this.monthwieseyear
      )
      .subscribe(
        (data1) => {
          if (data1['count'] > 0) {
            this.daywisecount = data1['data'];

            if (this.daywisecount.length > 0) {
              for (let i = 0; i < this.daywisecount.length; i++) {
                for (let k = 0; k < this.daywisecount[i].length; k++) {
                  this.datapush.push(data1['data'][i][k]['TOTAL_COUNT']);
                }

                this.datapush2.push(data1['data'][i]['TOTAL_COUNT']);
                this.isLoading = false;
              }
            } else {
            }
          } else if (data1['count'] == 0) {
            for (let j = 0; j < data1['data'].length; j++) {
              this.datapush.push(data1['data'][j]['TOTAL_COUNT']);
              this.isLoading = false;
            }
          } else {
            this.datapush2 = [];
            this.isLoading = false;
          }
        },
        (err) => {
          this.isLoading = false;
        }
      );

    // else {
    //   this.api
    //     .monthWiseTransferCountReport(
    //       0,
    //       0,
    //       '',
    //       '',
    //       '',
    //       this.enddatesarray, this.monthwieseyear

    //     )
    //     .subscribe(
    //       (data1) => {

    //         if (data1['count'] > 0) {
    //           this.daywisecount = data1['data'];
    //
    //           if (this.daywisecount.length > 0) {
    //             for (let i = 0; i < this.daywisecount.length; i++) {
    //               this.datapush.push(data1['data'][i]['TOTAL_COUNT']);
    //               this.datapush2.push(data1['data'][i]['TOTAL_COUNT']);
    //               this.isLoading = false;
    //             }

    //           } else {
    //           }
    //         } else if (data1['count'] == 0) {
    //
    //           for (let j = 0; j < data1['data'].length; j++) {
    //             this.datapush.push(data1['data'][j]['TOTAL_COUNT']);
    //             this.isLoading = false;

    //           }

    //
    //         } else {
    //           this.datapush2 = [];
    //           this.isLoading = false;
    //         }

    //       },
    //       (err) => {
    //
    //         this.isLoading = false;
    //       }
    //     );
    // }
  }

  today = new Date();
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };
  changedate: any;

  onChange(result: Date): void {
    if (result != null || result != undefined) {
      const year = result.getFullYear();
      this.monthwieseyear = year;
      const endDates = this.getEndDatesOfYear(year);
      const month = result.getMonth() + 1;

      this.enddatesarray = endDates;

      this.daywisedashboard();
    }

    if (this.datapush2.length <= 0) {
      this.daywisecount = [];
      this.datapush2 = [];
      this.date = null;
      for (let i = 0; i < this.daywisecount.length; i++) {
        this.datapush2.push((this.daywisecount[i]['TOTAL_COUNT'] = 0));
      }
      this.chartOptions = {
        series: [
          {
            name: 'Total Applications',
            data: this.datapush,
          },
        ],
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart, w, e) {},
          },
        },

        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
        },
        // xaxis: {
        //   categories: this.datapush,

        //   // labels: {
        //   //   style: {

        //   //     fontSize: '12px',
        //   //   },
        //   // },
        // },
      };
    } else {
    }
  }

  enddatesarray: number[] = [];
  monthwieseyear: any;
  getEndDatesOfYear(year: number): number[] {
    const endDates: number[] = [];
    for (let month = 0; month < 12; month++) {
      const date = new Date(year, month + 1, 0);
      endDates.push(date.getDate());
    }
    return endDates;
  }
}
