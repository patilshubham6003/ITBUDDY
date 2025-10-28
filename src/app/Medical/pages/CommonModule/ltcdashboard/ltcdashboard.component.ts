import { Component, OnInit } from '@angular/core';
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
  ApexYAxis,
} from 'ng-apexcharts';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
};

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
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
  selector: 'app-ltcdashboard',
  templateUrl: './ltcdashboard.component.html',
  styleUrls: ['./ltcdashboard.component.css'],
})
export class LTCdashboardComponent implements OnInit {
  TOTAL_CLAIM: number = 2500;
  NEW_CLAIM: number = 100;
  FORWARDED: number = 2060;
  APPROVED: number = 300;
  REJECTED: number = 140;
  QUERIED: number = 240;
  READY_TO_ZONAL: number = 300;
  chartOptions: any;
  chartOptions1: any;
  isLoading: boolean = false;
  date: any = new Date();
  sortValue: string = 'desc';
  sortKey: string = '';
  searchText: string = '';
  filterQuery: string = '';
  START_DATE: any;
  END_DATE: any;
  TYPE_OF_HOSPITAL: any = [];

  userId: any = sessionStorage.getItem('userId');

  Hospital_Count: any = [];
  ACTIVITIES: any = [];
  ACTIVITIES_COUNT: any = [];
  pageSize: number = 10;
  pageIndex: number = 1;
  pageSize1: number = 10;
  pageIndex1: number = 1;
  pageSize2: number = 10;
  pageIndex2: number = 1;
  pageSize3: number = 10;
  pageIndex3: number = 1;
  totalRecords: number;
  totalRecords1: number;
  totalRecords2: number;
  totalRecords3: number;

  i: number = 0;
  loadingRecords: boolean;

  constructor(private datepipe: DatePipe, private api: ApiService) { }

  ngOnInit() {
    this.chartOptions1 = {
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
          click: function (chart, w, e) {
            // 
          },
        },
      },
      // colors: [
      //   "#008FFB",
      //   "#00E396",
      //   "#FEB019",
      //   "#FF4560",
      //   "#775DD0",
      //   "#546E7A",
      //   "#26a69a",
      //   "#D10CE8"
      // ],
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
        categories: [],
        // ["1"],
        // ["2"],
        // ["3"],
        // ["4"],
        // ["5"],
        // ["6"],
        // ["7"],
        // ["8"],

        labels: {
          style: {
            // colors: [
            //   "#008FFB",
            //   "#00E396",
            //   "#FEB019",
            //   "#FF4560",
            //   "#775DD0",
            //   "#546E7A",
            //   "#26a69a",
            //   "#D10CE8"
            // ],
            fontSize: '12px',
          },
        },
      },
    };
    this.userId = sessionStorage.getItem('userId');
    // this.dashBoard();
    // this.stageStats();
    this.inspectorApplication();
    // this.hospitalApplication();
    // this.getActivityLog();
    // this.daywisesummary();

    // this.daywisedashboard();
    this.daywisecount = [];
    this.datapush = [];
    this.datapush2 = [];
    this.isLoading = true;
    this.onChange(this.date);

    this.chartOptions = {
      chart: {
        height: 400,
        type: 'pie',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],

      series: [],
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#48C9B0',
      ],
      labels: [
        'Closed',
        'Created',
        'In Advance',
        'In Final',
        'Pending At Me',
        'Pending At Others',
        'Transfered',
      ],
    };
  }
  today = new Date();
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  changedate: any;
  // dateformat = 'MMM/yyyy'
  onChange(result: Date): void {
    // this.i+=1
    // this.changedate=result

    if (result != null) {
      this.changedate = this.datepipe.transform(result, 'yyyy-MM-dd');
      this.day = new Date(result.getFullYear(), result.getMonth() + 1, 0);
      this.day = this.datepipe.transform(this.day, 'dd');
      // 
      this.daywisedashboard();
      // 
    } else {
      this.daywisedashboard();
    }
    // 
    if (this.datapush2.length <= 0) {
      this.daywisecount = [];
      this.datapush2 = [];
      this.date = null;
      for (let i = 0; i < this.daywisecount.length; i++) {
        this.datapush2.push((this.daywisecount[i]['COUNT'] = 0));
      }
      this.chartOptions1 = {
        series: [
          {
            name: 'Total Applications',
            data: this.datapush2,
          },
        ],
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart, w, e) {
              // 
            },
          },
        },
        // colors: [
        //   "#008FFB",
        //   "#00E396",
        //   "#FEB019",
        //   "#FF4560",
        //   "#775DD0",
        //   "#546E7A",
        //   "#26a69a",
        //   "#D10CE8"
        // ],
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
          categories: this.datapush,
          // ["1"],
          // ["2"],
          // ["3"],
          // ["4"],
          // ["5"],
          // ["6"],
          // ["7"],
          // ["8"],

          labels: {
            style: {
              // colors: [
              //   "#008FFB",
              //   "#00E396",
              //   "#FEB019",
              //   "#FF4560",
              //   "#775DD0",
              //   "#546E7A",
              //   "#26a69a",
              //   "#D10CE8"
              // ],
              fontSize: '12px',
            },
          },
        },
      };


    } else {
    }
  }
  daywisecount: any = [];
  datapush: any = [];
  datapush2: any = [];
  // day:any
  year: any;
  month: any;
  //  date1=new Date();
  day: any;
  daywisedashboard() {
    this.datapush = [];
    this.datapush2 = [];
    this.isLoading = true;
    this.year = this.datepipe.transform(this.changedate, 'yyyy');
    this.month = this.datepipe.transform(this.changedate, 'MM');
    // this.day=new Date(this.year, this.month + 1,0);
    // 
    // this.day=this.datepipe.transform(this.day, 'dd');
    // 
    // 
    // 
    // this.day=this.datepipe.transform(this.date, 'dd');
    if (this.userId == 1) {
      this.api
        .getdayWiseCountLtc(0, 0, '', '', '', this.month, this.year, this.day)
        .subscribe(
          (data1) => {
            // 
            if (data1['count'] > 0) {
              this.daywisecount = data1['data'];

              if (this.daywisecount.length > 0) {
                for (let i = 0; i < this.daywisecount.length; i++) {
                  this.datapush.push(data1['data'][i]['CREATED_DATE_TIME']);
                  this.datapush2.push(data1['data'][i]['COUNT']);
                  this.isLoading = false;
                }
                // 
                // 
              } else {
              }
            } else if (data1['count'] == 0) {

              for (let j = 0; j < data1['data'].length; j++) {
                this.datapush.push(data1['data'][j]['CREATED_MODIFIED_DATE']);
                this.isLoading = false;
                // this.datapush2.push(data1['data'][i]['COUNT'])
              }
              // this.datapush=[];

            } else {
              this.datapush2 = [];
              this.isLoading = false;
            }
            //   this.chartOptions1.series =
            //   // [this.stats[0]['NEW'], this.stats[0]['FORWARDED'], this.stats[0]['APPROVED'], this.stats[0]['REJECTED'], this.stats[0]['QUERIED'],
            //   // this.stats[0]['REDDY_FOR_ZONAL'],];
          },
          (err) => {

            this.isLoading = false;
          }
        );
    } else {
      this.api
        .getdayWiseCountLtc(
          0,
          0,
          '',
          '',
          ' AND INSPECTOR_ID= ' + this.userId,
          this.month,
          this.year,
          this.day
        )
        .subscribe(
          (data1) => {
            // 
            if (data1['data'].length > 0) {
              this.daywisecount = data1['data'];

              if (this.daywisecount.length > 0) {
                for (let i = 0; i < this.daywisecount.length; i++) {
                  this.datapush.push(data1['data'][i]['CREATED_DATE_TIME']);
                  this.datapush2.push(data1['data'][i]['COUNT']);
                  this.isLoading = false;
                }
                // 
                // 
              } else {
              }
            } else if (data1['count'] == 0) {

              for (let j = 0; j < data1['data'].length; j++) {
                this.datapush.push(data1['data'][j]['CREATED_MODIFIED_DATE']);
                this.isLoading = false;
                // this.datapush2.push(data1['data'][i]['COUNT'])
              }
              // this.datapush=[];

            } else {
              this.datapush2 = [];
              this.isLoading = false;
            }
            //   this.chartOptions1.series =
            //   // [this.stats[0]['NEW'], this.stats[0]['FORWARDED'], this.stats[0]['APPROVED'], this.stats[0]['REJECTED'], this.stats[0]['QUERIED'],
            //   // this.stats[0]['REDDY_FOR_ZONAL'],];
          },
          (err) => {

            this.isLoading = false;
          }
        );
    }
  }

  dashboard: any = [];


  stats: any = [];
  series1: any = [];


  rolename: any = sessionStorage.getItem('roleName');

  loadingRecords1: boolean;
  inspector: any = [];
  inspectorApplication() {
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.loadingRecords1 = true;
    if (this.userId == 1) {
      this.api
        .getinspecterwiseLtcSummaryReport(
          this.pageIndex1,
          this.pageSize1,
          this.sortKey,
          sort,
          '',
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data1) => {

            this.isLoading = false;
            this.loadingRecords1 = false;
            this.totalRecords = data1['count'];
            this.inspector = data1['data'];
          },
          (err) => {

            this.isLoading = false;
          }
        );
    } else {
      this.api
        .getinspecterwiseLtcSummaryReport(
          this.pageIndex1,
          this.pageSize1,
          this.sortKey,
          sort,
          ' AND INSPECTOR_ID= ' + this.userId,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data1) => {

            this.isLoading = false;
            this.loadingRecords1 = false;
            this.totalRecords = data1['count'];
            this.inspector = data1['data'];
          },
          (err) => {

            this.isLoading = false;
          }
        );
    }
  }
  loadingRecords2: boolean;

  loadingRecords3: boolean;

  sort1(params: NzTableQueryParams) {
    // this.loadingRecords=true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';



    this.pageIndex1 = pageIndex;
    this.pageSize1 = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    // this.dashBoard();
    // this.stageStats();
    this.inspectorApplication();
    // this.hospitalApplication();
    // this.dashBoard();
  }


  daywisesummarydata: any = [];


}
