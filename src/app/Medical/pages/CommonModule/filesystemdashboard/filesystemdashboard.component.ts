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
  selector: 'app-filesystemdashboard',
  templateUrl: './filesystemdashboard.component.html',
  styleUrls: ['./filesystemdashboard.component.css'],
})
export class FilesystemdashboardComponent implements OnInit {
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
  date = new Date();
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
  totalRecords: number;
  totalRecords1: number;
  totalRecords2: number;
  totalRecords3: number;
  // columns: string[][] = [["STAGE_NAME", "Stage Name"], ["COUNT", "Count"]];
  // activityColumns: string[][] = [["USER_NAME", "Claimed Person"], ["STAGE_NAME", "Stage Name"],["LOG_TEXT","Log Text"],["CREATED_DATETIME", "Date Time"],["REJECT_REMARK","Reject Remark"]];

  // inspectorColumns: string[][] = [["INSPECTOR_NAME", "Inspector Name"],
  // ["STAGE1", "Application Created"], ["STAGE2", "Bill Items Added"], ["STAGE3", "Application Submited"],
  // ["STAGE4", "Claim Information Verified"], ["STAGE5", "Claim Rejected By Inspector"], ["STAGE6", "Claim Forwarded Towards Administrative Officer"],
  // ["STAGE7", "Claim Forwarded Towards ITO"], ["STAGE8", "Query Raised By Administative Officer"], ["STAGE9", "Claim Forwarded Towards JCIT"],
  // ["STAGE10", "Query Raised By ITO"], ["STAGE11", "Claim Forwarded Towards CIT"], ["STAGE12", "Query Raised By JCIT"],
  // ["STAGE13", "Ready to Forward to Zonal CBDT"], ["STAGE14", "Query Raised By CIT"], ["STAGE15", "Forwarded to Zonal CBDT"],
  // ["STAGE16", "Query Raised By Zonal CBDT"], ["STAGE17", "Claim Approved"],];

  // hospitalColumns: string[][] = [["NAME_OF_HOSPITAL", "Hospital Name"], ["TYPE_OF_HOSPITAL", "Hospital Type"],
  // ["STAGE1", "Stage Name 1"], ["STAGE2", "Stage Name 2"], ["STAGE3", "Stage Name 3"],
  // ["STAGE4", "Stage Name 4"], ["STAGE5", "Stage Name 5"], ["STAGE6", "Stage Name 6"],
  // ["STAGE7", "Stage Name 7"], ["STAGE8", "Stage Name 8"], ["STAGE9", "Stage Name 9"],
  // ["STAGE10", "Stage Name 10"], ["STAGE11", "Stage Name 11"], ["STAGE12", "Stage Name 12"],
  // ["STAGE13", "Stage Name 13"], ["STAGE14", "Stage Name 14"], ["STAGE15", "Stage Name 15"],
  // ["STAGE16", "Stage Name 16"], ["STAGE17", "Stage Name 17"],];
  i: number = 0;
  loadingRecords: boolean;
  constructor(private datepipe: DatePipe, private api: ApiService) { }

  ngOnInit() {
    this.chartOptions = {
      chart: {
        height: 350,
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
      // labels: ["IT", "Product Development", "Sales"],
      series: [],
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#00FFFF',
      ],
      labels: [
        'Created',
        'Transfered',
        'Pending At Me',
        'Pending At Others',
        'In Advance',
        'In Final',
        'Closed',
      ],
    };
    // this.inspectorApplication();
    // this.hospitalApplication();
    // this.getActivityLog();
    // this.daywisedashboard();
    this.daywisecount = [];
    this.datapush = [];
    this.datapush2 = [];
    this.isLoading = true;
    if (this.userId == 1) {
      this.userId = '';
    } else {
      this.userId = this.userId;
    }
    this.daywisesummary();
    this.getuserwisessummary();
    // this.onChange(this.date);
    // this.getActivitylogs();
    // this.CLAIM_DATA = [
    //   { ID: 1, NAME: "Inspector Name", COUNT: 25},
    //   { ID: 2, NAME: "Application Created", COUNT: 25},
    //   { ID: 3, NAME: "Bill Items Added", COUNT: 30},
    //   { ID: 4, NAME: "Application Submited", COUNT: 40},
    //   { ID: 5, NAME: "Claim Information Verified", COUNT: 50},
    //   { ID: 6, NAME: "Claim Forwarded Towards Administrative Officer", COUNT: 15},
    //   { ID: 6, NAME: "Claim Forwarded Towards ITO", COUNT: 15},
    //   { ID: 6, NAME: "Query Raised By Administative Officer", COUNT: 15},
    //   { ID: 6, NAME: "Claim Forwarded Towards JCIT", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},
    //   { ID: 6, NAME: "Claim Rejected By Inspector", COUNT: 15},

    // ];

    // this.Hospital_Count = [
    //   { ID: 1, HOSPITAL: "Mehta Hospital", NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0", QUERIES: "9", READY_TO_ZONAL: "9" },
    //   { ID: 2, HOSPITAL: "Synergy Hospital", NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0", QUERIES: "9", READY_TO_ZONAL: "9" },

    // ];

    // this.ACTIVITIES = [
    //   { ID: 1, CLAIM_NO: "4676576576", CLAIMED_PERSON: "ANIL S. PATIL", ACTIVITY_NAME: "Forworded to SATISH KOLI", DATE_TIME: "01 Jun 2023, 12:20 PM" },
    //   { ID: 2, CLAIM_NO: "6769696666", CLAIMED_PERSON: "ANUP A. SANE", ACTIVITY_NAME: "Forworded to SATISH KOLI", DATE_TIME: "01 Jun 2023, 01:20 PM" },
    //   { ID: 3, CLAIM_NO: "4747644464", CLAIMED_PERSON: "RUSHIKESH S. PATIL", ACTIVITY_NAME: "Forworded to SATISH KOLI", DATE_TIME: "01 Jun 2023, 12:30 PM" },
    //   { ID: 4, CLAIM_NO: "6876976966", CLAIMED_PERSON: "RAKESH S. PATIL", ACTIVITY_NAME: "Forworded to RUSHIKESH GURAV", DATE_TIME: "01 Jun 2023, 05:20 PM" },
    // ];

    // this.ACTIVITIES_COUNT = [
    //   { ID: 1, INSPECTOR: "Shubham patil", NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0",QUERIES: "9",READY_TO_ZONAL:"9" },
    //   { ID: 2, INSPECTOR: "Rushikesh Salunkhe",NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0",QUERIES: "9",READY_TO_ZONAL:"9"},
    //   { ID: 3, INSPECTOR: "Rajdoot Herlekar", NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0",QUERIES: "9",READY_TO_ZONAL:"9"},
    //   { ID: 4, INSPECTOR: "Aniket Patil", NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0",QUERIES: "9",READY_TO_ZONAL:"9" },
    //   { ID: 5, INSPECTOR: "Digambar Patil", NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0",QUERIES: "9",READY_TO_ZONAL:"9"},
    //   { ID: 6, INSPECTOR: "Tushar Shinde",NEW: "10", APPROVED: "10", FORWARDED: "0", REJECTED: "0",QUERIES: "9",READY_TO_ZONAL:"9"},

    // ];
    // this.chartOptions = {

    //   series: [],
    //   chart: {
    //     width: 380,
    //     type: "pie"
    //   },
    //   labels: ["New Claim", "Forwarded", "Rejected", "Queried", "Approved", "Ready For Zonal"],
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         chart: {
    //           width: 200
    //         },
    //         legend: {
    //           position: "bottom"
    //         }
    //       }
    //     }
    //   ]
    // };
    this.chartOptions = {
      chart: {
        height: 350,
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
      // labels: ["IT", "Product Development", "Sales"],
      series: [],
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#00FFFF',
      ],
      labels: [
        'Created',
        'Transfered',
        'Pending At Me',
        'Pending At Others',
        'In Advance',
        'In Final',
        'Closed',
      ],
    };

    // this.chartOptions1 = {
    //   series: [
    //     {
    //       name: "distributed",
    //       data: this.datapush2
    //     }
    //   ],
    //   chart: {
    //     height: 350,
    //     type: "bar",
    //     events: {
    //       click: function (chart, w, e) {
    //         // 
    //       }
    //     }
    //   },
    //   // colors: [
    //   //   "#008FFB",
    //   //   "#00E396",
    //   //   "#FEB019",
    //   //   "#FF4560",
    //   //   "#775DD0",
    //   //   "#546E7A",
    //   //   "#26a69a",
    //   //   "#D10CE8"
    //   // ],
    //   plotOptions: {
    //     bar: {
    //       columnWidth: "45%",
    //       distributed: true
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   legend: {
    //     show: false
    //   },
    //   grid: {
    //     show: false
    //   },
    //   xaxis: {
    //     categories: this.datapush
    //     // ["1"],
    //     // ["2"],
    //     // ["3"],
    //     // ["4"],
    //     // ["5"],
    //     // ["6"],
    //     // ["7"],
    //     // ["8"],

    //     ,
    //     labels: {
    //       style: {
    //         // colors: [
    //         //   "#008FFB",
    //         //   "#00E396",
    //         //   "#FEB019",
    //         //   "#FF4560",
    //         //   "#775DD0",
    //         //   "#546E7A",
    //         //   "#26a69a",
    //         //   "#D10CE8"
    //         // ],
    //         fontSize: "12px"
    //       }
    //     }
    //   }
    // };
  }
  today = new Date();
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  changedate: any;
  // dateformat = 'MMM/yyyy'
  // onChange(result: Date): void {
  //   // this.i+=1
  //   // this.changedate=result
  //   
  //   if (result != null) {
  //     this.changedate = this.datepipe.transform(result, 'yyyy-MM-dd');
  //     this.day = new Date(result.getFullYear(), result.getMonth() + 1, 0)
  //     this.day = this.datepipe.transform(this.day, 'dd');
  //     // 
  //     this.daywisedashboard();
  //     // 
  //   }
  //   else {
  //     this.daywisedashboard();
  //   }
  //   // 
  //   if (this.datapush2.length <= 0) {
  //     this.daywisecount = []
  //     this.datapush2 = []
  //     this.date = null
  //     for (let i = 0; i < this.daywisecount.length; i++) {
  //       this.datapush2.push(this.daywisecount[i]['COUNT'] = 0)
  //     }
  //     this.chartOptions1 = {
  //       series: [
  //         {
  //           name: "distributed",
  //           data: this.datapush2
  //         }
  //       ],
  //       chart: {
  //         height: 350,
  //         type: "bar",
  //         events: {
  //           click: function (chart, w, e) {
  //             // 
  //           }
  //         }
  //       },
  //       // colors: [
  //       //   "#008FFB",
  //       //   "#00E396",
  //       //   "#FEB019",
  //       //   "#FF4560",
  //       //   "#775DD0",
  //       //   "#546E7A",
  //       //   "#26a69a",
  //       //   "#D10CE8"
  //       // ],
  //       plotOptions: {
  //         bar: {
  //           columnWidth: "45%",
  //           distributed: true
  //         }
  //       },
  //       dataLabels: {
  //         enabled: false
  //       },
  //       legend: {
  //         show: false
  //       },
  //       grid: {
  //         show: false
  //       },
  //       xaxis: {
  //         categories: this.datapush
  //         // ["1"],
  //         // ["2"],
  //         // ["3"],
  //         // ["4"],
  //         // ["5"],
  //         // ["6"],
  //         // ["7"],
  //         // ["8"],

  //         ,
  //         labels: {
  //           style: {
  //             // colors: [
  //             //   "#008FFB",
  //             //   "#00E396",
  //             //   "#FEB019",
  //             //   "#FF4560",
  //             //   "#775DD0",
  //             //   "#546E7A",
  //             //   "#26a69a",
  //             //   "#D10CE8"
  //             // ],
  //             fontSize: "12px"
  //           }
  //         }
  //       }
  //     };

  //     

  //   }
  //   else {

  //   }
  // }
  daywisecount: any = [];
  datapush: any = [];
  datapush2: any = [];
  // day:any
  year: any;
  month: any;
  //  date1=new Date();
  day: any;
  // daywisedashboard() {
  //   this.datapush = [];
  //   this.datapush2 = [];
  //   this.isLoading = true;
  //   this.year = this.datepipe.transform(this.changedate, 'yyyy');
  //   this.month = this.datepipe.transform(this.changedate, 'MM');
  //   // this.day=new Date(this.year, this.month + 1,0);
  //   // 
  //   // this.day=this.datepipe.transform(this.day, 'dd');
  //   // 
  //   // 
  //   // 
  //   // this.day=this.datepipe.transform(this.date, 'dd');
  //   this.api.getdaywisecount(0, 0, '', '', '', this.month, this.year, this.day).subscribe((data1) => {
  //     // 
  //     if (data1['count'] > 0) {
  //       this.daywisecount = data1['data'];
  //       
  //       if (this.daywisecount.length > 0) {
  //         for (let i = 0; i < this.daywisecount.length; i++) {
  //           this.datapush.push(data1['data'][i]['CREATED_MODIFIED_DATE']);
  //           this.datapush2.push(data1['data'][i]['COUNT'])
  //           this.isLoading = false;
  //         }
  //         // 
  //         // 
  //       }
  //       else { }
  //     }
  //     else if (data1['count'] == 0) {
  //       
  //       for (let j = 0; j < data1['data'].length; j++) {
  //         this.datapush.push(data1['data'][j]['CREATED_MODIFIED_DATE']);
  //         this.isLoading = false;
  //         // this.datapush2.push(data1['data'][i]['COUNT'])
  //       }
  //       // this.datapush=[];
  //       
  //     }
  //     else {
  //       this.datapush2 = [];
  //       this.isLoading = false;
  //     }
  //     //   this.chartOptions1.series =
  //     //   // [this.stats[0]['NEW'], this.stats[0]['FORWARDED'], this.stats[0]['APPROVED'], this.stats[0]['REJECTED'], this.stats[0]['QUERIED'],
  //     //   // this.stats[0]['REDDY_FOR_ZONAL'],];
  //   },
  //     (err) => {
  //       
  //       this.isLoading = false;
  //     }
  //   );
  // }

  daywisesummarydata: any = [];
  daywisesummary() {
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.loadingRecords = true;
    var today1 = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    this.api.getdaywisefilessummaryreport(this.userId, today1).subscribe(
      (data1) => {

        this.daywisesummarydata = data1['data'];
        this.isLoading = false;
        this.loadingRecords = false;
      },
      (err) => {

        this.isLoading = false;
        this.loadingRecords = false;
      }
    );
  }

  // stats = [];
  // datapush3=[];
  // stageStats() {
  //   this.api.stagewisestats(0, 0, '', '', '').subscribe((data2) => {
  //     // 
  //     this.stats = data2['data'];
  //     
  //     if(this.stats.length > 0)
  //     {
  //     for(let i=0;i<this.stats.length;i++)
  //     {
  //       this.datapush3.push(data2['data'][i]);
  //     }
  //     // 
  //     
  //     }
  //     else
  //     {
  //       // this.datapush=[];
  //       this.datapush3=[];
  //     }
  //   //   this.chartOptions1.series =
  //   //   // [this.stats[0]['NEW'], this.stats[0]['FORWARDED'], this.stats[0]['APPROVED'], this.stats[0]['REJECTED'], this.stats[0]['QUERIED'],
  //   //   // this.stats[0]['REDDY_FOR_ZONAL'],];
  //   },
  //     (err) => {
  //       
  //     }
  //   );
  // }
  stats: any = [];
  series1: any = [];
  rolename: any = sessionStorage.getItem('roleName');

  getuserwisessummary() {
    this.api.getuserwisesummary(this.userId, this.rolename).subscribe(
      (data1) => {

        this.stats = data1['data'];
        this.isLoading = false;

        // this.chartOptions = {

        //   series:[],
        //   chart: {
        //     width: 380,
        //     type: "pie"
        //   },

        //   labels: ["New Claim", "Forwarded", "Approved", "Rejected", "Queried", "Ready For Zonal"],
        //   responsive: [
        //     {
        //       breakpoint: 480,
        //       options: {
        //         chart: {
        //           width: 200
        //         },
        //         legend: {
        //           position: "bottom"
        //         }
        //       }
        //     }
        //   ]
        // };
        this.chartOptions.series = [
          this.stats[0]['CREATED'],
          this.stats[0]['TRANSFERED'],
          this.stats[0]['PENDING_AT_ME'],
          this.stats[0]['PENDING_AT_OTHERS'],
          this.stats[0]['IN_ADVANCE'],
          this.stats[0]['IN_FINAL'],
          this.stats[0]['CLOSED'],
        ];
        // 
        this.chartOptions.chart = {
          width: 380,
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
  // loadingRecords1:boolean;
  // inspector = [];
  // inspectorApplication() {
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith("a") ? "asc" : "desc";
  //   } catch (error) {
  //     sort = "";
  //   }
  //     this.loadingRecords1=true;
  //     this.api.inspectorWiseSummary(this.pageIndex, this.pageSize, this.sortKey,sort, this.filterQuery, this.START_DATE, this.END_DATE).subscribe((data1) => {
  //     
  //     this.isLoading = false;
  //     this.loadingRecords1=false;
  //     this.totalRecords=data1['count']
  //     this.inspector = data1['data'];
  //   },
  //     (err) => {
  //       
  //       this.isLoading = false;
  //     }
  //   );
  // }
  // loadingRecords2:boolean;
  // hospital = [];
  // hospitalApplication() {
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith("a") ? "asc" : "desc";
  //   } catch (error) {
  //     sort = "";
  //   }
  //   this.loadingRecords2=true;
  //   this.api.hospitalWiseSummary(this.pageIndex, this.pageSize, this.sortKey, sort, this.filterQuery, this.TYPE_OF_HOSPITAL, this.START_DATE, this.END_DATE).subscribe((data1) => {
  //     
  //     this.isLoading = false;
  //     this.loadingRecords2=false;
  //     this.totalRecords1=data1['count']
  //     this.hospital = data1['data'];
  //   },
  //     (err) => {
  //       
  //       this.loadingRecords2=false;
  //       this.isLoading = false;

  //     }
  //   );
  // }
  // loadingRecords3:boolean;
  // getActivityLog(){
  //   var sort: string;
  //   try {
  //     sort = this.sortValue.startsWith("a") ? "asc" : "desc";
  //   } catch (error) {
  //     sort = "";
  //   }
  //   this.loadingRecords3=true;
  //   this.ACTIVITIES=[]
  //   this.api.getActivityLogs(this.pageIndex, this.pageSize, this.sortKey, sort, this.filterQuery).subscribe((data1) => {
  //     
  //     this.loadingRecords3=false
  //     this.ACTIVITIES = data1['data'];
  //     this.totalRecords3=data1['count'];
  //   },
  //     (err) => {
  //       
  //     }
  //   );
  // }
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
    this.daywisesummary();
    // this.stageStats();
    // this.inspectorApplication();
    // this.hospitalApplication();
    // this.dashBoard();
  }
  // sort1(params: NzTableQueryParams) {
  //   // this.loadingRecords=true;
  //   const { pageSize, pageIndex, sort} = params;
  //   const currentSort = sort.find(item => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || '';
  //   const sortOrder = (currentSort && currentSort.value) || 'asc';
  //   

  //   
  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if(this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if( this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize =pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   // this.dashBoard();
  //   // this.stageStats();
  //   this.inspectorApplication();
  //   // this.hospitalApplication();
  //   // this.dashBoard();
  // }
  // sort2(params: NzTableQueryParams) {
  //   // this.loadingRecords=true;
  //   const { pageSize, pageIndex, sort} = params;
  //   const currentSort = sort.find(item => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || '';
  //   const sortOrder = (currentSort && currentSort.value) || 'asc';
  //   

  //   
  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if(this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if( this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize =pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   // this.dashBoard();
  //   // this.stageStats();
  //   // this.inspectorApplication();
  //   this.hospitalApplication();
  //   // this.dashBoard();
  // }

  // sort3(params: NzTableQueryParams) {
  //   // this.loadingRecords=true;
  //   const { pageSize, pageIndex, sort} = params;
  //   const currentSort = sort.find(item => item.value !== null);
  //   const sortField = (currentSort && currentSort.key) || '';
  //   const sortOrder = (currentSort && currentSort.value) || 'asc';
  //   

  //   
  //   this.pageIndex = pageIndex;
  //   this.pageSize = pageSize;

  //   if(this.pageSize != pageSize) {
  //     this.pageIndex = 1;
  //     this.pageSize = pageSize;
  //   }

  //   if( this.sortKey != sortField) {
  //     this.pageIndex = 1;
  //     this.pageSize =pageSize;
  //   }

  //   this.sortKey = sortField;
  //   this.sortValue = sortOrder;
  //   // this.dashBoard();
  //   // this.stageStats();
  //   // this.inspectorApplication();
  //   // this.hospitalApplication();
  //   // this.dashBoard();
  //   this.getActivityLog()
  // }
}
