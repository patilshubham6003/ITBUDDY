import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { WebsiteService } from 'src/app/Service/website.service';
import { appkeys } from 'src/app/app.constant';
@Component({
  selector: 'app-cmsprofilepage',
  templateUrl: './cmsprofilepage.component.html',
  styleUrls: ['./cmsprofilepage.component.css'],
  providers: [DatePipe],
})
export class CmsprofilepageComponent implements OnInit {
  news: any = [];
  ncounts: any;
  searchText: string = '';
  showx = false;
  allnews: any;
  pdf: any;
  urlss: any;
  new_status: any = [];
  filterQuery: string = '';
  retrieveimgUrl = appkeys.retriveimgUrl;
  date: any;
  date1: any;
  servises: any = [];
  SERVICE_IDS: any;
  SERVICE_IDS1: any = [];
  getserIdDoenload: any;
  servDEtailcondition: any;
  constructor(
    private api: WebsiteService,
    public datepipe: DatePipe,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    // this.getnews();
    // this.officeranks1234();

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  isSpinning = false;
  isSpinningggg = false;
  AllFilters() {
    this.isSpinning = true;
  }

  getnews() {
    var filter = '';
    if (this.EMP_CODE.length == 6) {
      filter = " AND EMPLOYEE_CODE ='" + this.EMP_CODE + "'";
    } else if (this.EMP_CODE.length > 2) {
      filter = " AND EMPLOYEE_CODE like '%" + this.EMP_CODE + "%'";
    } else {
      filter = '';
    }

    this.isSpinningggg = true;
    this.api
      .getprofiledata(
        this.pageindex,
        this.pagesize,
        'ID',
        'desc',
        ' AND STATUS=1' + filter
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.news = data['data'];
          this.ncounts = data['count'];
          this.filt = true;
          this.isSpinningggg = false;
        }
      });
  }

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
    this.api
      .getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1' + filter)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.news = data['data'];
          this.ncounts = data['count'];
        }
      });
  }
  filt: boolean = false;
  applyFilter() {
    this.filterQuery = '';

    if (this.SERVICE_IDS1 != null && this.SERVICE_IDS1.length > 0) {
      this.filterQuery += ' AND (';
      var query = '';
      for (var i = 0; i < this.SERVICE_IDS1.length; i++) {
        query += " SERVICE_ID = '" + this.SERVICE_IDS1[i] + "' OR";
      }
      this.filterQuery += query.substring(0, query.length - 2) + ' )';
    }
    if (this.new_status.length > 0) {
      this.filterQuery += ' AND (';
      var query = '';
      for (var i = 0; i < this.new_status.length; i++) {
        query += ' NEWS_CONTENT_TYPE = "' + this.new_status[i] + '" OR';
      }
      this.filterQuery += query.substring(0, query.length - 2) + ' )';
    }
    if (this.date != null && this.date1 != null) {
      this.date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
      this.date1 = this.datepipe.transform(this.date1, 'yyyy-MM-dd');
      this.filterQuery +=
        ' AND date(DATE) between ' +
        "'" +
        this.date +
        "'" +
        ' AND ' +
        "'" +
        this.date1 +
        "'";
    }

    if (this.filterQuery != '') {
      this.api
        .getprofiledata(0, 0, '', 'desc', ' AND STATUS=1' + this.filterQuery)
        .subscribe((data) => {
          if (data['code'] == 200) {
            this.news = data['data'];
            this.ncounts = data['count'];
            this.filt = true;
          }
        });
    }
  }

  getsizechange() {}

  clearfilt() {
    this.filterQuery = '';
    this.urlss = '';
    this.pdf = '';
    this.filt = false;
    this.new_status = [];
    this.date = null;
    this.date1 = null;
    this.SERVICE_IDS1 = [];
    this.SERVICE_IDS = null;
    this.api
      .getnews(0, 0, 'IS_LATEST', 'desc', ' AND STATUS=1')
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.news = data['data'];
          this.ncounts = data['count'];
        }
      });
  }

  RANK_NAME: any = [];

  ranksss: any = [];

  officeranks1234() {
    this.api
      .getallDesignationForTransfer(0, 0, 'NAME', 'asc', ' AND STATUS=1 ')
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.ranksss = data['data'];
            } else {
              this.ranksss = [];
            }
          }
        },
        (err) => {}
      );
  }

  showerror: any = false;
  EMP_CODE: any = '';
  selectedDate: any = [];
  selectedDate22: any = [];

  changeemp(event: any) {
    console.log(event);
    this.EMP_CODE = event;
    if (this.EMP_CODE.length > 2) {
      this.getnews();
    } else if (this.EMP_CODE.length == 0) {
      this.getnews();
    } else {
    }
  }
  showprofile: any = false;
  @ViewChild('profileviewwwwwwww') profileviewwwwwwww: ElementRef;
  empdataaaa: any;

  dataPostingList: any = [];
  servicedata: any;
  drawertitile = '';
  onviewclick(data: any) {
    this.empdataaaa = data;
    this.drawertitile =
      this.empdataaaa.NAME + ' - ' + this.empdataaaa.EMPLOYEE_CODE;

    this.isSpinningggg = true;
    this.api
      .getAllPostingDetailsMaster(
        0,
        0,
        '',
        '',
        ' AND EMPLOYEE_ID=' + this.empdataaaa.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200 && data['data'].length > 0) {
            this.dataPostingList = data['data'];

            this.api
              .getAllServiceDetails(
                0,
                0,
                '',
                'desc',
                ' AND EMPLOYEE_ID=' + this.empdataaaa.ID
              )
              .subscribe(
                (datasss) => {
                  if (datasss.code == '200' && datasss.data.length > 0) {
                    this.servicedata = datasss['data'][0];

                    this.isSpinningggg = false;
                    this.drawerVisible1s = true;
                  } else {
                    this.servicedata = [];
                    this.drawerVisible1s = true;
                    this.isSpinningggg = false;
                  }
                },
                (err) => {
                  this.isSpinning = false;
                }
              );
          } else {
            this.dataPostingList = [];

            this.api
              .getAllServiceDetails(
                0,
                0,
                '',
                'desc',
                ' AND EMPLOYEE_ID=' + this.empdataaaa.ID
              )
              .subscribe(
                (datasss) => {
                  if (datasss.code == '200' && datasss.data.length > 0) {
                    this.servicedata = datasss['data'][0];

                    this.isSpinningggg = false;
                    this.drawerVisible1s = true;
                  } else {
                    this.servicedata = [];
                    this.isSpinningggg = false;
                    this.drawerVisible1s = true;
                  }
                },
                (err) => {
                  this.isSpinningggg = false;
                }
              );
          }
        },
        (err) => {
          if (err['ok'] == false) this.message.error('Server Not Found', '');
        }
      );

    // this.showprofile = true;
    // this.profileviewwwwwwww.nativeElement.click();
  }
  pagesize = 20;
  pageindex = 1;

  applyfilternew(reset = false) {
    if (
      (this.EMP_CODE == '' ||
        this.EMP_CODE == null ||
        this.EMP_CODE == undefined) &&
      (this.RANK_NAME == '' ||
        this.RANK_NAME == null ||
        this.RANK_NAME == undefined) &&
      (this.NAMEEEEE == '' ||
        this.NAMEEEEE == null ||
        this.NAMEEEEE == undefined)
    ) {
      this.message.error('Please fill in the fields', '');
      return;
    }

    if (reset) {
      this.pageindex = 1;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    var filter = '';
    if (this.EMP_CODE.length == 6) {
      filter = " AND EMPLOYEE_CODE ='" + this.EMP_CODE + "'";
    } else if (this.EMP_CODE.length > 2) {
      filter = " AND EMPLOYEE_CODE like '%" + this.EMP_CODE + "%'";
    } else {
      filter = '';
    }

    var filter111 = '';
    if (
      this.RANK_NAME != null &&
      this.RANK_NAME != '' &&
      this.RANK_NAME != undefined
    ) {
      filter111 = " AND ITHR_DESIGNATION_NAME like '%" + this.RANK_NAME + "%'";
    } else {
      filter111 = '';
    }

    if (
      this.NAMEEEEE != null &&
      this.NAMEEEEE != '' &&
      this.NAMEEEEE != undefined
    ) {
      filter111 += " AND NAME like '%" + this.NAMEEEEE + "%'";
    } else {
      filter111 += '';
    }

    var filter1112222 = '';
    if (this.selectedDate.length == 2) {
      filter1112222 =
        " AND (DOB BETWEEN '" +
        this.datepipe.transform(this.selectedDate[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.selectedDate[1], 'yyyy-MM-dd') +
        "')";
    } else {
      filter1112222 = '';
    }

    var filter1112222333 = '';
    if (this.selectedDate22.length == 2) {
      filter1112222333 =
        " AND (RETIREMENT_DATE BETWEEN '" +
        this.datepipe.transform(this.selectedDate22[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.selectedDate22[1], 'yyyy-MM-dd') +
        "')";
    } else {
      filter1112222333 = '';
    }

    this.isSpinningggg = true;

    this.api
      .getprofiledata(
        this.pageindex,
        this.pagesize,
        '',
        'desc',
        ' AND STATUS=1' + filter + filter111 + filter1112222 + filter1112222333
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.news = data['data'];
          this.ncounts = data['count'];
          this.isSpinningggg = false;
        }
      });
  }

  // getindexchange(){

  //   this.api
  //     .getprofiledata(
  //       this.pageindex,
  //       this.pagesize,
  //       '',
  //       'desc',
  //       ' AND STATUS=1' + filter + filter111 + filter1112222 + filter1112222333
  //     )
  //     .subscribe((data) => {
  //       if (data['code'] == 200) {
  //         this.news = data['data'];
  //         this.ncounts = data['count'];
  //         this.isSpinningggg = false;
  //       }
  //     });
  // }

  clearfilterrrr() {
    this.news = [];
    this.selectedDate = [];
    this.selectedDate22 = [];
    this.EMP_CODE = '';
    this.RANK_NAME = '';
    this.NAMEEEEE = '';
  }

  backkkk() {
    this.showprofile = false;
    this.empdataaaa = '';
  }

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

  onscrolldata: any = '';
  onScroll(event: any) {
    console.log(event);
    if (this.isSpinningggg == false) {
      const scrollContainer = event.target;
      this.onscrolldata = scrollContainer;
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight - 20
      ) {
        if (this.ncounts == this.news.length) {
          // Display message: 'All Employee Load'
        } else {
          this.applyfilternewmoreee();
        }
      }
    }
  }

  applyfilternewmoreee() {
    var filter = '';
    if (this.EMP_CODE.length == 6) {
      filter = " AND EMPLOYEE_CODE ='" + this.EMP_CODE + "'";
    } else if (this.EMP_CODE.length > 2) {
      filter = " AND EMPLOYEE_CODE like '%" + this.EMP_CODE + "%'";
    } else {
      filter = '';
    }

    var filter111 = '';
    if (
      this.RANK_NAME != null &&
      this.RANK_NAME != '' &&
      this.RANK_NAME != undefined
    ) {
      filter111 = " AND DESIGNATION like '%" + this.RANK_NAME + "%'";
    } else {
      filter111 = '';
    }
    if (
      this.NAMEEEEE != null &&
      this.NAMEEEEE != '' &&
      this.NAMEEEEE != undefined
    ) {
      filter111 += " AND NAME like '%" + this.NAMEEEEE + "%'";
    } else {
      filter111 += '';
    }

    var filter1112222 = '';
    if (this.selectedDate.length == 2) {
      filter1112222 =
        " AND (DOB BETWEEN '" +
        this.datepipe.transform(this.selectedDate[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.selectedDate[1], 'yyyy-MM-dd') +
        "')";
    } else {
      filter1112222 = '';
    }

    var filter1112222333 = '';
    if (this.selectedDate22.length == 2) {
      filter1112222333 =
        " AND (RETIREMENT_DATE BETWEEN '" +
        this.datepipe.transform(this.selectedDate22[0], 'yyyy-MM-dd') +
        "' AND '" +
        this.datepipe.transform(this.selectedDate22[1], 'yyyy-MM-dd') +
        "')";
    } else {
      filter1112222333 = '';
    }

    this.isSpinningggg = true;

    this.pageindex++;
    this.api
      .getprofiledata(
        this.pageindex,
        this.pagesize,
        '',
        'desc',
        ' AND STATUS=1' + filter + filter111 + filter1112222 + filter1112222333
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          const newData = data['data'];
          this.ncounts = data['count'];
          this.news = [...this.news, ...newData];
          this.isSpinningggg = false;
        }
      });
  }

  NAMEEEEE: any = '';
  sortValue: string = 'desc';
  sortKey: string = 'id';
  sort(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    this.pageindex = pageIndex;
    this.pagesize = pageSize;

    if (this.pagesize != pageSize) {
      this.pageindex = 1;
      this.pagesize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageindex = 1;
      this.pagesize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;

    if (
      (this.EMP_CODE == '' ||
        this.EMP_CODE == null ||
        this.EMP_CODE == undefined) &&
      (this.RANK_NAME == '' ||
        this.RANK_NAME == null ||
        this.RANK_NAME == undefined) &&
      (this.NAMEEEEE == '' ||
        this.NAMEEEEE == null ||
        this.NAMEEEEE == undefined)
    ) {
      return;
    } else {
      this.applyfilternew();
    }
  }

  drawerVisible1s = false;
  Dwidth = '90%';
  drawerClosess(): void {
    this.drawerVisible1s = false;
  }
  get closeCallbackss() {
    return this.drawerClosess.bind(this);
  }

  carderrrrr: { key: string; value: string }[] = [
    { key: 'ITI', value: 'Income Tax Inspector (ITI)' },
    { key: 'MTS', value: 'Multi Tasking Staff' },
    { key: 'NS', value: 'Notice Server' },
    { key: 'OS', value: 'Office Superintendent' },
    { key: 'STENO', value: 'Stenographer' },
    { key: 'TA', value: 'Tax Assistant' },
    { key: 'CA', value: 'Canteen Attendant' },
    { key: 'AHC', value: 'Asst. Halwai-cum-Cook' },
    { key: 'HCC', value: 'HALWAI CUM COOK' },
    { key: 'SCD', value: 'Staff Car Driver' },
  ];

  getcount() {

    if(this.news.length>0){
      return `Showing ${this.news?.length || 0} matching records out of ${
        this.ncounts || 0
      }`;
    }else {
      return ''
    }


   
  }
}
