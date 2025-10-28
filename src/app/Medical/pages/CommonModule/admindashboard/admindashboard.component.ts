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
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
})
export class AdmindashboardComponent implements OnInit {
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
    this.userId = sessionStorage.getItem('userId');
    this.dashBoard();
    this.stageStats();
    this.inspectorApplication();
    this.hospitalApplication();
    this.getActivityLog();
    this.daywisesummary();

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
        .getdaywisecount(0, 0, '', '', '', this.month, this.year, this.day)
        .subscribe(
          (data1) => {
            // 
            if (data1['count'] > 0) {
              this.daywisecount = data1['data'];

              if (this.daywisecount.length > 0) {
                for (let i = 0; i < this.daywisecount.length; i++) {
                  this.datapush.push(data1['data'][i]['CREATED_MODIFIED_DATE']);
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
        .getdaywisecount(
          0,
          0,
          '',
          '',
          ' AND EMP_ID= ' + this.userId,
          this.month,
          this.year,
          this.day
        )
        .subscribe(
          (data1) => {
            // 
            if (data1['count'] > 0) {
              this.daywisecount = data1['data'];

              if (this.daywisecount.length > 0) {
                for (let i = 0; i < this.daywisecount.length; i++) {
                  this.datapush.push(data1['data'][i]['CREATED_MODIFIED_DATE']);
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
  dashBoard() {
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.loadingRecords = true;
    if (this.userId == 1) {
      this.api.DashboardCount(0, 0, this.sortKey, sort, '').subscribe(
        (data1) => {

          this.dashboard = data1['data'];
          this.isLoading = false;
          this.loadingRecords = false;
        },
        (err) => {

          this.isLoading = false;
          this.loadingRecords = false;
        }
      );
    } else {
      this.api
        .DashboardCount(
          0,
          0,
          this.sortKey,
          sort,
          ' AND INSPECTOR_ID= ' + this.userId
        )
        .subscribe(
          (data1) => {

            this.dashboard = data1['data'];
            this.isLoading = false;
            this.loadingRecords = false;
          },
          (err) => {

            this.isLoading = false;
            this.loadingRecords = false;
          }
        );
    }
  }

  stats: any = [];
  series1: any = [];
  // stageStats() {
  //   if (this.userId == 1) {
  //     this.api.getuserwisesummary('').subscribe(
  //       (data1) => {
  //         
  //         this.stats = data1['data'];
  //         this.isLoading = false;
  //         if (this.stats[0]['CLOSED'] == null) {
  //           this.stats[0]['CLOSED'] = 0;
  //         } else if (this.stats[0]['CREATED'] == null) {
  //           this.stats[0]['CREATED'] = 0;
  //         } else if (this.stats[0]['IN_ADVANCE'] == null) {
  //           this.stats[0]['IN_ADVANCE'] = 0;
  //         } else if (this.stats[0]['IN_FINAL'] == null) {
  //           this.stats[0]['IN_FINAL'] = 0;
  //         } else if (this.stats[0]['PENDING_AT_ME'] == null) {
  //           this.stats[0]['PENDING_AT_ME'] = 0;
  //         }
  //         if (this.stats[0]['PENDING_AT_OTHERS'] == null) {
  //           this.stats[0]['PENDING_AT_OTHERS'] = 0;
  //         }
  //         if (this.stats[0]['TRANSFERED'] == null) {
  //           this.stats[0]['TRANSFERED'] = 0;
  //         }

  //         this.chartOptions.series = [
  //           this.stats[0]['CLOSED'],
  //           this.stats[0]['CREATED'],
  //           this.stats[0]['IN_ADVANCE'],
  //           this.stats[0]['IN_FINAL'],
  //           this.stats[0]['PENDING_AT_ME'],
  //           this.stats[0]['PENDING_AT_OTHERS'],
  //           this.stats[0]['TRANSFERED'],
  //         ];
  //         
  //         this.chartOptions.chart = {
  //           width: 400,
  //           type: 'pie',
  //         };
  //         // this.chartOptions.colors = ["#447b40", "#cc7870", "#e74ce4","#FF4560","#775DD0","#546E7A"]
  //         this.isLoading = false;
  //         
  //       },
  //       (err) => {
  //         
  //         this.isLoading = false;
  //       }
  //     );
  //   } else {
  //     this.api.getuserwisesummary(this.userId).subscribe(
  //       (data1) => {
  //         
  //         this.stats = data1['data'];
  //         this.isLoading = false;
  //         if (this.stats[0]['CLOSED'] == null) {
  //           this.stats[0]['CLOSED'] = 0;
  //         } else if (this.stats[0]['CREATED'] == null) {
  //           this.stats[0]['CREATED'] = 0;
  //         } else if (this.stats[0]['IN_ADVANCE'] == null) {
  //           this.stats[0]['IN_ADVANCE'] = 0;
  //         } else if (this.stats[0]['IN_FINAL'] == null) {
  //           this.stats[0]['IN_FINAL'] = 0;
  //         } else if (this.stats[0]['PENDING_AT_ME'] == null) {
  //           this.stats[0]['PENDING_AT_ME'] = 0;
  //         }
  //         if (this.stats[0]['PENDING_AT_OTHERS'] == null) {
  //           this.stats[0]['PENDING_AT_OTHERS'] = 0;
  //         }
  //         if (this.stats[0]['TRANSFERED'] == null) {
  //           this.stats[0]['TRANSFERED'] = 0;
  //         }

  //         this.chartOptions.series = [
  //           this.stats[0]['CLOSED'],
  //           this.stats[0]['CREATED'],
  //           this.stats[0]['IN_ADVANCE'],
  //           this.stats[0]['IN_FINAL'],
  //           this.stats[0]['PENDING_AT_ME'],
  //           this.stats[0]['PENDING_AT_OTHERS'],
  //           this.stats[0]['TRANSFERED'],
  //         ];
  //         
  //         this.chartOptions.chart = {
  //           width: 400,
  //           type: 'pie',
  //         };
  //         // this.chartOptions.colors = ["#447b40", "#cc7870", "#e74ce4","#FF4560","#775DD0","#546E7A"]
  //         this.isLoading = false;
  //         
  //       },
  //       (err) => {
  //         
  //         this.isLoading = false;
  //       }
  //     );
  //   }
  // }

  rolename: any = sessionStorage.getItem('roleName');
  stageStats() {
    this.series1 = [];
    if (this.userId == 1) {
      this.api.getuserwisesummary(this.userId, this.rolename).subscribe(
        (data1) => {

          this.stats = data1['data'];
          this.isLoading = false;

          if (this.stats.length > 0) {
            if (this.stats[0]['CLOSED'] == null) {
              this.stats[0]['CLOSED'] = 0;
            } else if (this.stats[0]['CREATED'] == null) {
              this.stats[0]['CREATED'] = 0;
            } else if (this.stats[0]['IN_ADVANCE'] == null) {
              this.stats[0]['IN_ADVANCE'] = 0;
            } else if (this.stats[0]['IN_FINAL'] == null) {
              this.stats[0]['IN_FINAL'] = 0;
            } else if (this.stats[0]['PENDING_AT_ME'] == null) {
              this.stats[0]['PENDING_AT_ME'] = 0;
            }
            if (this.stats[0]['PENDING_AT_OTHERS'] == null) {
              this.stats[0]['PENDING_AT_OTHERS'] = 0;
            }
            if (this.stats[0]['TRANSFERED'] == null) {
              this.stats[0]['TRANSFERED'] = 0;
            }

            this.chartOptions.series = [
              this.stats[0]['CLOSED'],
              this.stats[0]['CREATED'],
              this.stats[0]['IN_ADVANCE'],
              this.stats[0]['IN_FINAL'],
              this.stats[0]['PENDING_AT_ME'],
              this.stats[0]['PENDING_AT_OTHERS'],
              this.stats[0]['TRANSFERED'],
            ];
          } else {
            // Handle the case when stats.length is 0 (no data)
            this.chartOptions.series = [];
          }


          this.chartOptions.chart = {
            width: 400,
            type: 'pie',
          };
          // this.chartOptions.colors = ["#447b40", "#cc7870", "#e74ce4","#FF4560","#775DD0","#546E7A"]
          this.isLoading = false;

        },
        (err) => {

          this.isLoading = false;
        }
      );
    } else {
      this.api.getuserwisesummary(this.userId, this.rolename).subscribe(
        (data1) => {

          this.stats = data1['data'];
          this.isLoading = false;
          if (this.stats[0]['CLOSED'] == null) {
            this.stats[0]['CLOSED'] = 0;
          } else if (this.stats[0]['CREATED'] == null) {
            this.stats[0]['CREATED'] = 0;
          } else if (this.stats[0]['IN_ADVANCE'] == null) {
            this.stats[0]['IN_ADVANCE'] = 0;
          } else if (this.stats[0]['IN_FINAL'] == null) {
            this.stats[0]['IN_FINAL'] = 0;
          } else if (this.stats[0]['PENDING_AT_ME'] == null) {
            this.stats[0]['PENDING_AT_ME'] = 0;
          }
          if (this.stats[0]['PENDING_AT_OTHERS'] == null) {
            this.stats[0]['PENDING_AT_OTHERS'] = 0;
          }
          if (this.stats[0]['TRANSFERED'] == null) {
            this.stats[0]['TRANSFERED'] = 0;
          }

          this.chartOptions.series = [
            this.stats[0]['CLOSED'],
            this.stats[0]['CREATED'],
            this.stats[0]['IN_ADVANCE'],
            this.stats[0]['IN_FINAL'],
            this.stats[0]['PENDING_AT_ME'],
            this.stats[0]['PENDING_AT_OTHERS'],
            this.stats[0]['TRANSFERED'],
          ];

          this.chartOptions.chart = {
            width: 400,
            type: 'pie',
          };
          // this.chartOptions.colors = ["#447b40", "#cc7870", "#e74ce4","#FF4560","#775DD0","#546E7A"]
          this.isLoading = false;

        },
        (err) => {

          this.isLoading = false;
        }
      );
    }
  }
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
        .inspectorWiseSummary(
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
        .inspectorWiseSummary(
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
  hospital: any = [];
  hospitalApplication() {
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.loadingRecords2 = true;
    if (this.userId == 1) {
      this.api
        .hospitalWiseSummary(
          this.pageIndex2,
          this.pageSize2,
          this.sortKey,
          sort,
          '',
          this.TYPE_OF_HOSPITAL,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data1) => {

            this.isLoading = false;
            this.loadingRecords2 = false;
            this.totalRecords1 = data1['count'];
            this.hospital = data1['data'];
          },
          (err) => {

            this.loadingRecords2 = false;
            this.isLoading = false;
          }
        );
    } else {
      this.api
        .hospitalWiseSummary(
          this.pageIndex2,
          this.pageSize2,
          this.sortKey,
          sort,
          ' AND INSPECTOR_ID= ' + this.userId,
          this.TYPE_OF_HOSPITAL,
          this.START_DATE,
          this.END_DATE
        )
        .subscribe(
          (data1) => {

            this.isLoading = false;
            this.loadingRecords2 = false;
            this.totalRecords1 = data1['count'];
            this.hospital = data1['data'];
          },
          (err) => {

            this.loadingRecords2 = false;
            this.isLoading = false;
          }
        );
    }
  }
  loadingRecords3: boolean;
  getActivityLog() {
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.loadingRecords3 = true;
    this.ACTIVITIES = [];
    if (this.userId == 1) {
      this.api
        .getLogs(this.pageIndex, this.pageSize, this.sortKey, sort, '')
        .subscribe(
          (data1) => {

            this.loadingRecords3 = false;
            this.ACTIVITIES = data1['data'];
            this.totalRecords3 = data1['count'];
          },
          (err) => {

          }
        );
    } else {
      this.api
        .getLogs(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          ' AND CURRENT_POSITION_ID= ' + this.userId
        )
        .subscribe(
          (data1) => {

            this.loadingRecords3 = false;
            this.ACTIVITIES = data1['data'];
            this.totalRecords3 = data1['count'];
          },
          (err) => {

          }
        );
    }
  }
  sort(params: NzTableQueryParams) {
    // this.loadingRecords=true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';



    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

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
    this.dashBoard();
    // this.stageStats();
    // this.inspectorApplication();
    // this.hospitalApplication();
    // this.dashBoard();
  }
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
  sort2(params: NzTableQueryParams) {
    // this.loadingRecords=true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';



    this.pageIndex2 = pageIndex;
    this.pageSize2 = pageSize;

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
    // this.inspectorApplication();
    this.hospitalApplication();
    // this.dashBoard();
  }

  sort3(params: NzTableQueryParams) {
    // this.loadingRecords=true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';



    this.pageIndex3 = pageIndex;
    this.pageSize3 = pageSize;

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
    // this.inspectorApplication();
    // this.hospitalApplication();
    // this.dashBoard();
    this.getActivityLog();
  }

  sort23(params: NzTableQueryParams) {
    // this.loadingRecords=true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || '';
    const sortOrder = (currentSort && currentSort.value) || 'asc';



    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

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
    this.daywisesummary();
  }

  daywisesummarydata: any = [];

  // daywisesummary() {
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
  //   } catch (error) {
  //     sort = '';
  //   }
  //   this.loadingRecords = true;
  //   var today1 = this.datepipe.transform(this.today, 'yyyy-MM-dd');
  //   // this.api.getdaywisefilessummaryreport(this.userId, today1).subscribe(
  //   //   (data1) => {
  //   //     
  //   //     this.daywisesummarydata = data1['data'];
  //   //     this.isLoading = false;
  //   //     this.loadingRecords = false;
  //   //   },
  //   //   (err) => {
  //   //     
  //   //     this.isLoading = false;
  //   //     this.loadingRecords = false;
  //   //   }
  //   // );

  //   if (this.userId == 1) {
  //     this.api.getdaywisefilessummaryreport('', today1).subscribe(
  //       (data1) => {
  //         

  //         this.daywisesummarydata = data1['data'];

  //         this.totalRecords2 = data1['count'];

  //         this.isLoading = false;

  //         this.loadingRecords = false;
  //       },

  //       (err) => {
  //         

  //         this.isLoading = false;

  //         this.loadingRecords = false;
  //       }
  //     );
  //   } else {
  //     this.api.getdaywisefilessummaryreport(this.userId, today1).subscribe(
  //       (data1) => {
  //         

  //         this.daywisesummarydata = data1['data'];

  //         this.totalRecords2 = data1['count'];

  //         this.isLoading = false;

  //         this.loadingRecords = false;
  //       },

  //       (err) => {
  //         

  //         this.isLoading = false;

  //         this.loadingRecords = false;
  //       }
  //     );
  //   }
  // }

  daywisesummary() {
    var sort: string;

    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.loadingRecords = true;

    var today1 = this.datepipe.transform(this.today, 'yyyy-MM-dd');

    if (this.userId == 1) {
      this.api.getdaywisefilessummaryreport('', today1).subscribe(
        (data1) => {


          this.daywisesummarydata = data1['data'];

          this.totalRecords2 = data1['count'];

          this.isLoading = false;

          this.loadingRecords = false;
        },

        (err) => {


          this.isLoading = false;

          this.loadingRecords = false;
        }
      );
    } else {
      this.api.getdaywisefilessummaryreport(this.userId, today1).subscribe(
        (data1) => {


          this.daywisesummarydata = data1['data'];

          this.totalRecords2 = data1['count'];

          this.isLoading = false;

          this.loadingRecords = false;
        },

        (err) => {


          this.isLoading = false;

          this.loadingRecords = false;
        }
      );
    }
  }
}
