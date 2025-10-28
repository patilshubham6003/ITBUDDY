import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from '../../Services/APIService.service';
import { subYears, endOfMonth, startOfYear, endOfYear, startOfMonth } from 'date-fns';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { Router } from '@angular/router';


// pie chart
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

// barchart
export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
@Component({
  selector: 'app-graas-main-dashboard',
  templateUrl: './graas-main-dashboard.component.html',
  styleUrls: ['./graas-main-dashboard.component.css'],
  providers: [DatePipe]
})
export class GraasMainDashboardComponent implements OnInit {
  Monthrange: any = [];
  RESIDENCE_TYPE_IDD: any;
  ResidenceTypelist: any = [];
  userid: any = Number(sessionStorage.getItem('userId'));
  roleid: any = Number(sessionStorage.getItem('roleId'));
  isSpinning: boolean = false;
  isSpinningForResidence: boolean = false;
  filterQuery: any = '';
  cardcounts: any;

  //Rennovation Table
  pageIndex: any = 1;
  pageSize: any = 10;
  totalRecords: any = 1;
  dataList: any = [];
  loadingRecords: boolean = false;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  columns: string[][] = [
    ['DESIGNATION', 'DESIGNATION'],
    ['EMPLOYEE_NAME', 'EMPLOYEE_NAME'],
    ['EMAIL_ID', 'EMAIL_ID'],
    ['FLAT_NAME', 'FLAT_NAME'],
    ['BUILDING_NAME', 'BUILDING_NAME'],
    ['AREA_NAME', 'AREA_NAME'],
    ['CITY_NAME', 'CITY_NAME'],
    ['RESIDENCE_TYPE_NAME', 'RESIDENCE_TYPE_NAME']
  ];


  // Quarter data pie chart
  @ViewChild("chartpie") chartpie: ChartComponent;
  public chartOptions3: Partial<ChartOptions> | any;
  loadingpieRecords: boolean = false;
  totalRecords2: any = 0;
  totalFlats: any;
  newFlats: any;
  bookedFlats: any;
  availableFlats: any;
  renovationFlats: any;
  Totalflats: any;
  //timeline
  dataListForTimeline: any = [];
  dataListForTimelineCount: any = 0;
  isSpinningTrue: boolean = false;
  MONTH1: any;
  MONTH2: any;
  RESIDENCE_TYPE_IDD1: any = [];
  Monthrange1: any;
  //APplication bar chart
  isSpinningTrueForBar: boolean = false;
  isBarCountEmpty: boolean = true;
  dataListForBar: any = [];
  @ViewChild("chartsss") chartsss: ChartComponent;
  public chartOptions: Partial<ChartOptions1> | any;
  constructor(private datepipe: DatePipe, private router: Router, private message: NzNotificationService, private api: APIServicesService) { }
  ngOnInit() {
    if (this.userid == 26) {
      this.RESIDENCE_TYPE_IDD = 3;
      this.RESIDENCE_TYPE_IDD1 = 3;
    } else {
      this.RESIDENCE_TYPE_IDD = 4;
      this.RESIDENCE_TYPE_IDD1 = 4;
    }
    var currentDate = new Date();
    var lastYearSameMonth = subYears(startOfMonth(currentDate), 1);
    var endOfCurrentMonth = endOfMonth(currentDate);
    var nextMonthDate = new Date(lastYearSameMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    this.Monthrange[0] = nextMonthDate;
    this.Monthrange[1] = endOfCurrentMonth;

    var currentDate1 = new Date();
    this.Monthrange1 = new Date();
    this.MONTH1 = new Date(currentDate1.getFullYear(), currentDate1.getMonth(), 1);
    this.MONTH2 = new Date(currentDate1.getFullYear(), currentDate1.getMonth() + 1, 0);
    this.userid = Number(sessionStorage.getItem('userId'));
    this.roleid = Number(sessionStorage.getItem('roleId'));

    this.getResidenceTypestart();
    this.onChangemonth(this.Monthrange);
    this.getpiecount();
    this.getTimeline();
    this.getApplicationbarChart();
  }
  ranges = {
    'This Month': [startOfMonth(new Date()), endOfMonth(new Date())],
    'This Year': [startOfYear(new Date()), endOfYear(new Date())]
  };
  onResidencechange(data: any) {
    this.RESIDENCE_TYPE_IDD = data;
    this.getcount();
    this.searchRennovation();
    this.getpiecount();
    this.getTimeline();
    this.getApplicationbarChart();
  }
  onChangemonth(result: Date[]): void {
    this.Monthrange[0] = new Date(
      result[0].getFullYear(),
      result[0].getMonth(),
      1
    );
    this.Monthrange[1] = new Date(
      result[1].getFullYear(),
      result[1].getMonth() + 1,
      0
    );

    this.getcount();
    this.searchRennovation();
    // this.getpiecount();
  }

  getResidenceTypestart() {
    this.isSpinningForResidence = true;
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.isSpinningForResidence = false;
          this.ResidenceTypelist = data['data'];
          // for (var i = 0; i < this.ResidenceTypelist.length; i++) {
          //   this.RESIDENCE_TYPE_IDD.push(this.ResidenceTypelist[i]['ID']);
          // }
          if (this.userid == '26') {
            this.RESIDENCE_TYPE_IDD = 3;
          } else {
            this.RESIDENCE_TYPE_IDD = 4;
          }
        } else {
          this.isSpinningForResidence = false;
        }
      },
      (err) => {
        this.isSpinningForResidence = false;
      }
    );
  }

  // card count
  getcount() {
    this.isSpinning = true;
    var dateFilter = "";
    var ResidenceFilter = "";

    this.Monthrange[0] = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.Monthrange[1] = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');
    if ((this.Monthrange != undefined) && (this.Monthrange.length != 0)) {
      dateFilter = " AND DATE_CREATED_BY_MONTH BETWEEN '" + this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd') + "' AND '" + this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd') + "'";
    } else {
      dateFilter = ''
    }
    if (this.RESIDENCE_TYPE_IDD != undefined && this.RESIDENCE_TYPE_IDD != null && this.RESIDENCE_TYPE_IDD != '') {
      ResidenceFilter = " AND RESIDENCE_TYPE_ID in (" + this.RESIDENCE_TYPE_IDD + ")";
    } else {
      ResidenceFilter = ''
    }
    this.api.getGRAACoutsSummary(0, 0, '', '', dateFilter + ResidenceFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            // this.cardcounts = data['data'][0];
            if (data['data'].length > 0) {
              this.cardcounts = data['data'][0];
            } else {
              this.cardcounts = [
                {
                  SEN_COUNT: 0
                },
                {
                  VACANT_COUNT: 0
                }, {
                  PREF_COUNT: 0
                },
                {
                  ALLOTED_COUNT: 0
                }, {
                  RECIVED_ACCEPTANCE: 0
                },
                {
                  REJECTED_ACCEPTANCE: 0
                }, {
                  PHYSICAL_OCCUPANCY: 0
                },
                {
                  RENOVATION: 0
                }
              ]
            }
          } else {
            // this.message.error("Something Went Wrong. Please try again Later.", "");
            this.isSpinning = false;
            this.cardcounts = [
              {
                SEN_COUNT: 0
              },
              {
                VACANT_COUNT: 0
              }, {
                PREF_COUNT: 0
              },
              {
                ALLOTED_COUNT: 0
              }, {
                RECIVED_ACCEPTANCE: 0
              },
              {
                REJECTED_ACCEPTANCE: 0
              }, {
                PHYSICAL_OCCUPANCY: 0
              },
              {
                RENOVATION: 0
              }
            ]
          }
        },
        (err) => {
          // this.message.error("Something Went Wrong. Please try again Later.", "");
          this.isSpinning = false;
          this.cardcounts = [
            {
              SEN_COUNT: 0
            },
            {
              VACANT_COUNT: 0
            }, {
              PREF_COUNT: 0
            },
            {
              ALLOTED_COUNT: 0
            }, {
              RECIVED_ACCEPTANCE: 0
            },
            {
              REJECTED_ACCEPTANCE: 0
            }, {
              PHYSICAL_OCCUPANCY: 0
            },
            {
              RENOVATION: 0
            }
          ]
        });
  }

  // Renovation Table
  sortForRennovation(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
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
    if (currentSort != null && currentSort.value != undefined) {
      this.searchRennovation(false);
    }
  }
  applnformshow(pdfURL: string): void {
    var a: any = this.api.retriveimgUrl + 'renovationAttachments/' + pdfURL;
    window.open(a)
  }
  onKeypressEvent(reset: any) {
    const element = window.document.getElementById('buttonss');
    if (element != null) element.focus();
    this.searchRennovation(reset);
  }
  searchRennovation(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.dataList = [];
    }
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND (';
      this.columns.forEach((column, i) => {
        if (this.columns.length == i + 1) {
          likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%')";
        } else {
          likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
        }
      });
    }

    var dateFilter = "";
    var ResidenceFilter = "";
    this.Monthrange[0] = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.Monthrange[1] = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');
    if ((this.Monthrange != undefined) && (this.Monthrange.length != 0)) {
      dateFilter = " AND ALLOTMENT_DATE_TIME BETWEEN '" + this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd') + "' AND '" + this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd') + "'";
    } else {
      dateFilter = ''
    }
    if (this.RESIDENCE_TYPE_IDD != undefined && this.RESIDENCE_TYPE_IDD != null && this.RESIDENCE_TYPE_IDD != '') {
      ResidenceFilter = " AND RESIDENCE_TYPE_ID in (" + this.RESIDENCE_TYPE_IDD + ")";
    } else {
      ResidenceFilter = ''
    }
    likeQuery = likeQuery + dateFilter + ResidenceFilter
    this.loadingRecords = true;
    this.api.getRenovationRequest(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + ' AND IS_APPLIEND_FOR_RENOVATION=1').subscribe((data) => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      } else {
        this.loadingRecords = false;
        this.totalRecords = 0;
        this.dataList = [];
      }
    }, (err) => {
      this.loadingRecords = false;
      this.totalRecords = 0;
      this.dataList = [];
    });
  }

  // Quarter data pie chart
  getpiecount() {
    var dateFilter = "";
    var ResidenceFilter = "";
    this.Monthrange[0] = this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd');
    this.Monthrange[1] = this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd');
    if ((this.Monthrange != undefined) && (this.Monthrange.length != 0)) {
      dateFilter = " AND ALLOTMENT_DATE_TIME BETWEEN '" + this.datepipe.transform(this.Monthrange[0], 'yyyy-MM-dd') + "' AND '" + this.datepipe.transform(this.Monthrange[1], 'yyyy-MM-dd') + "'";
    } else {
      dateFilter = '';
    }
    if (this.RESIDENCE_TYPE_IDD != undefined && this.RESIDENCE_TYPE_IDD != null && this.RESIDENCE_TYPE_IDD != '') {
      ResidenceFilter = " AND RESIDENCE_TYPE_ID in (" + this.RESIDENCE_TYPE_IDD + ")";
    } else {
      ResidenceFilter = ''
    }
    this.loadingpieRecords = true;
    this.api.getFlatdatapiechart(0, 0, '', '', ResidenceFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.loadingpieRecords = false;
            // this.totalRecords2 = data['count'];
            if (data['data'].length > 0) {
              this.availableFlats = data['data'][0]['AVAILABLE'];
              this.renovationFlats = data['data'][0]['UNDER_MAINTAINENCE'];
              this.bookedFlats = data['data'][0]['BOOKED'];
              this.newFlats = data['data'][0]['NEW'];
              this.Totalflats = data['data'][0]['TOTAL'];
            } else {
              this.loadingpieRecords = false;
              this.availableFlats = 0;
              this.renovationFlats = 0;
              this.bookedFlats = 0;
              this.newFlats = 0;
              this.Totalflats = 0;
            }
            const cropValues: any = [this.newFlats, this.availableFlats, this.bookedFlats, this.renovationFlats];
            this.chartOptions3 = {
              chart: {
                height: 300,
                width: '100%',
                type: 'pie',
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: '100%',
                    },
                    legend: {
                      position: 'bottom',
                    },
                  },
                },
              ],

              series: cropValues,
              colors: [
                '#008FFB',
                '#FF4560',
                '#FEB019',
                '#00E396'
              ],
              labels: ['New', 'Available', 'Occupied', 'Renovation'],
              legend: {
                position: 'bottom', // Ensure legend is at the bottom
              },
            };

          } else {
            this.loadingpieRecords = false;
          }
        },
        (err) => {
          this.loadingpieRecords = false;
        }
      );
  }

  //get Timline data
  onResidencechange1() {
    this.RESIDENCE_TYPE_IDD1 = this.RESIDENCE_TYPE_IDD1;
    this.getTimeline();
    this.getApplicationbarChart();

  }
  onChangemonth1(result: any): void {
    this.MONTH1 = new Date(this.Monthrange1.getFullYear(), this.Monthrange1.getMonth(), 1);
    this.MONTH2 = new Date(this.Monthrange1.getFullYear(), this.Monthrange1.getMonth() + 1, 0);
    this.getTimeline();
    this.getApplicationbarChart();

  }
  getTimeline() {
    var dateFilter = "";
    var ResidenceFilter = "";
    this.MONTH1 = this.datepipe.transform(this.MONTH1, 'yyyy-MM-dd');
    this.MONTH2 = this.datepipe.transform(this.MONTH2, 'yyyy-MM-dd');
    if (this.MONTH1 != undefined && this.MONTH1 != null && this.MONTH2 != undefined && this.MONTH2 != null) {
      dateFilter = " AND DATE_CREATED_BY_MONTH BETWEEN '" + this.datepipe.transform(this.MONTH1, 'yyyy-MM-dd') + "' AND '" + this.datepipe.transform(this.MONTH2, 'yyyy-MM-dd') + "'";
    } else {
      dateFilter = '';
    }
    if (this.RESIDENCE_TYPE_IDD != undefined && this.RESIDENCE_TYPE_IDD != null && this.RESIDENCE_TYPE_IDD != '') {
      ResidenceFilter = " AND RESIDENCE_TYPE_ID in (" + this.RESIDENCE_TYPE_IDD + ")";
    } else {
      ResidenceFilter = ''
    }
    this.isSpinningTrue = true;
    this.api
      .getSeniorityListWithCount(1, 1, 'ID', 'desc', ResidenceFilter + dateFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isSpinningTrue = false;
            this.dataListForTimelineCount = data['count'];
            this.dataListForTimeline = data['data'][0];
          } else {
            this.isSpinningTrue = false;
            this.dataListForTimelineCount = 0;
            this.dataListForTimeline = [];
          }
        }, err => {
          this.isSpinningTrue = false;
          this.dataListForTimelineCount = 0;
          this.dataListForTimeline = [];
        })
  }

  // bar chart for application
  getApplicationbarChart() {
    var dateFilter = "";
    var ResidenceFilter = "";
    dateFilter = this.Monthrange1.getFullYear();
    // this.MONTH1 = this.datepipe.transform(this.MONTH1, 'yyyy-MM-dd');
    // this.MONTH2 = this.datepipe.transform(this.MONTH2, 'yyyy-MM-dd');
    if (dateFilter != undefined && dateFilter != null) {
      dateFilter = dateFilter;
    } else {
      dateFilter = '';
    }
    if (this.RESIDENCE_TYPE_IDD != undefined && this.RESIDENCE_TYPE_IDD != null && this.RESIDENCE_TYPE_IDD != '') {
      ResidenceFilter = this.RESIDENCE_TYPE_IDD;
    } else {
      ResidenceFilter = ''
    }
    this.isSpinningTrueForBar = true;
    this.api
      .getFlatRequestBarchart(ResidenceFilter, dateFilter)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.isSpinningTrueForBar = false;
            this.dataListForBar = data['data'];
            if (this.dataListForBar.length > 0) {
              this.isBarCountEmpty = false;
            } else {
              this.isBarCountEmpty = true;
            }
            this.chartOptions = {
              series: this.getSeriesData(),
              chart: {
                type: "bar",
                height: 350,
                stacked: true,
                toolbar: {
                  show: true
                },
                zoom: {
                  enabled: true
                }
              },
              dataLabels: {
                enabled: false,
              },
              plotOptions: {
                bar: {
                  horizontal: false
                }
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    legend: {
                      position: "bottom",
                      offsetX: -10,
                      offsetY: 0
                    }
                  }
                }
              ],
              xaxis: {
                title: {
                  text: 'Months',
                },
                categories: this.getMonths()
              },
              yaxis: {
                title: {
                  text: 'Application Count',
                },
              },
              legend: {
                position: "top"
              },
              fill: {
                opacity: 1
              }
            };
          } else {
            this.isSpinningTrueForBar = false;
            this.dataListForBar = [];
          }
        }, err => {
          this.isSpinningTrueForBar = false;
          this.dataListForBar = [];
        })
  }

  getSeriesData() {
    const approved: number[] = [];
    const rejected: number[] = [];
    const pending: number[] = [];
    const deleted: number[] = [];
    this.dataListForBar.forEach(item => {
      approved.push(item.APPROVED);
      rejected.push(item.REJECTED);
      pending.push(item.PENDING);
      deleted.push(item.DELETED);
    });
    return [
      { name: 'Approved', data: approved },
      { name: 'Rejected', data: rejected },
      { name: 'Pending', data: pending },
      { name: 'Deleted', data: deleted }
    ];
  }

  getMonths() {
    const monthNames: any = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return this.dataListForBar.map(item => monthNames[item.MONTH - 1]);
    // return this.dataListForBar.map(item => `Month ${item.MONTH}`);
  }
  show() {
    this.router.navigate(['/grass/grass-dashboard']);
  }
}
