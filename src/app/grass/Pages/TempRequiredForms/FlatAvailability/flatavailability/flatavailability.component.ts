import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-flatavailability',
  templateUrl: './flatavailability.component.html',
  styleUrls: ['./flatavailability.component.css'],
})
export class FlatavailabilityComponent {
  formTitle = 'Check Quarter Availability';
  CityList: any = [];
  AreaList: any = [];
  BlockList: any = [];
  dataList: any = [];
  ResidenceType: any = [];
  loadingRecords = false;
  isSpinning = false;
  CITY: any;
  AREA: any;
  BLOCK: any;
  TYPE_OF_RESIDENCE: any;
  filterQuery = '';
  empid: any;
  filterkey = '';

  ///// Employee Details To be Bind Starts here

  Grade_pay = '';

  ///// Employee Details To be Bind Ends here

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService
  ) { }

  ngOnInit() {
    this.empid = sessionStorage.getItem('userId');
    this.employeedetailsedit();
    this.getcitymaster();
  }

  employeedetailsedit() {
    if (this.empid) {
      this.isSpinning = true;
      this.api
        .getEmployeeMaster(0, 0, '', '', ' AND ID = ' + this.empid)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.Grade_pay = data['data'][0]['GRASS_GRADE_PAY'];
              if (this.Grade_pay >= '1300' && this.Grade_pay <= '1800') {
                this.filterkey = 'AMOUNT IN (1300,1400,1600,1650,1800)';
                this.getResidenceType();
              } else if (this.Grade_pay >= '1900' && this.Grade_pay <= '2800') {
                this.filterkey =
                  'AMOUNT IN (1300,1400,1600,1650,1800, 1900,2000, 2400,2800)';
                this.getResidenceType();
              } else if (this.Grade_pay >= '4200' && this.Grade_pay <= '4800') {
                this.filterkey =
                  'AMOUNT IN (1900,2000, 2400,2800, 4200, 4600, 4800)';
                this.getResidenceType();
              } else if (this.Grade_pay >= '5400' && this.Grade_pay < '6600') {
                this.filterkey = 'AMOUNT IN ( 4200, 4600, 4800,5400)';
                this.getResidenceType();
              } else if (this.Grade_pay == '6600') {
                this.filterkey = 'AMOUNT IN (4200, 4600, 4800,5400,6600)';
                this.getResidenceType();
              } else if (this.Grade_pay >= '7600' && this.Grade_pay <= '8000') {
                this.filterkey = 'AMOUNT IN (6600,7600,8000)';
                this.getResidenceType();
              } else if (this.Grade_pay >= '8700' && this.Grade_pay <= '8900') {
                this.filterkey = 'AMOUNT IN (7600,8000,8700,8900)';
                this.getResidenceType();
              } else if (this.Grade_pay == '10000') {
                this.filterkey = 'AMOUNT IN (8700,8900,10000)';
                this.getResidenceType();
              } else if (
                this.Grade_pay >= '67000' &&
                this.Grade_pay <= '74999'
              ) {
                this.filterkey = 'AMOUNT IN (10000,67000,74999)';
                this.getResidenceType();
              } else if (
                this.Grade_pay >= '75000' &&
                this.Grade_pay <= '79999'
              ) {
                this.filterkey = 'AMOUNT IN (67000,74999,75000,79999)';
                this.getResidenceType();
              } else if (this.Grade_pay >= '80000') {
                this.filterkey = 'AMOUNT IN (75000,79999,80000)';
                this.getResidenceType();
              }

              this.isSpinning = false;
            } else {
              this.message.error("Can't Load Employee Data", '');
              this.isSpinning = false;
            }
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    }
  }

  getResidenceType() {
    this.api
      .getGradPay(0, 0, '', 'desc', ' AND STATUS = 1 AND ' + this.filterkey)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            let listofresidence = [];
            listofresidence = data['data'];
            function removeDuplicates(arr: any) {
              const uniqueObjects: any = [];
              const uniqueResidenceTypeIds = new Set();
              for (const obj of arr) {
                if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
                  uniqueObjects.push(obj);
                  uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
                }
              }
              return uniqueObjects;
            }
            const result = removeDuplicates(listofresidence);

            this.ResidenceType = result;
            this.isSpinning = false;
          }
        },
        (err) => { }
      );
  }

  changecity(event: any) {
    this.AREA = null;
    this.api
      .getareamaster(0, 0, '', '', ' AND STATUS=1 AND CITY_ID = ' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.AreaList = data['data'];
          }
        },
        (err) => { }
      );
  }
  changearea(event: any) {
    this.BLOCK = null;
    this.api
      .getBlockmaster(0, 0, '', '', ' AND STATUS=1 AND AREA_ID = ' + event)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.BlockList = data['data'];
          }
        },
        (err) => { }
      );
  }

  getcitymaster() {
    this.isSpinning = true;
    this.api.getCityMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.CityList = data['data'];
          this.isSpinning = false;
        }
      },
      (err) => { }
    );
  }

  findflats() {
    if (this.CITY == null || this.CITY == undefined || this.CITY == '') {
      this.message.error('Please Select City', '');
    } else if (
      this.TYPE_OF_RESIDENCE == null ||
      this.TYPE_OF_RESIDENCE == undefined ||
      this.TYPE_OF_RESIDENCE == ''
    ) {
      this.message.error('Please Select Residence Type', '');
    } else if (
      this.TYPE_OF_RESIDENCE != null &&
      this.CITY != null &&
      this.AREA == null &&
      this.BLOCK == null
    ) {
      this.filterQuery =
        " AND AVAILABLE_STATUS = 'A' AND RESIDENCE_TYPE_ID = " +
        this.TYPE_OF_RESIDENCE +
        ' AND CITY_ID = ' +
        this.CITY;
      this.getFlats();
    } else if (
      this.TYPE_OF_RESIDENCE != null &&
      this.CITY != null &&
      this.AREA != null &&
      this.BLOCK == null
    ) {
      this.filterQuery =
        " AND AVAILABLE_STATUS = 'A' AND RESIDENCE_TYPE_ID = " +
        this.TYPE_OF_RESIDENCE +
        ' AND CITY_ID = ' +
        this.CITY +
        ' AND  AREA_ID = ' +
        this.AREA;
      this.getFlats();
    } else if (
      this.TYPE_OF_RESIDENCE != null &&
      this.CITY != null &&
      this.AREA != null &&
      this.BLOCK != null
    ) {
      this.filterQuery =
        " AND AVAILABLE_STATUS = 'A' AND RESIDENCE_TYPE_ID = " +
        this.TYPE_OF_RESIDENCE +
        ' AND CITY_ID = ' +
        this.CITY +
        ' AND  AREA_ID = ' +
        this.AREA +
        ' AND BLOCK_ID = ' +
        this.BLOCK;
      this.getFlats();
    }
  }

  getFlats() {
    this.loadingRecords = true;
    this.api.getQuarterMaster(0, 0, 'ID', 'desc', this.filterQuery).subscribe(
      (data) => {
        this.loadingRecords = false;
        this.dataList = data['data'];
        if (this.dataList.length <= 0) {
          this.message.info('Data Not Found', '');
        }
      },
      (err) => { }
    );
  }

  // ViewSeniorityList() {}

  // applyflatpreference() {}

  vacancyvisible = false;
  vacancyTitle = '';
  values: any;
  viewflatvacancy() {
    this.vacancyvisible = true;
    this.vacancyTitle = 'Quarter Vacancy';
    this.values = Object.assign({}, undefined);
  }
  vacancyvisibleclose() {
    this.vacancyvisible = false;
  }

  get vacancyclose111() {
    return this.vacancyvisibleclose.bind(this);
  }
}
