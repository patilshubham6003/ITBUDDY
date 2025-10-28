import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-bulkflatvacantcaretaker',
  templateUrl: './bulkflatvacantcaretaker.component.html',
  styleUrls: ['./bulkflatvacantcaretaker.component.css'],
})
export class BulkflatvacantcaretakerComponent {
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  @Input() drawerClose!: Function;
  RESIDENCE_TYPE_ID: any;
  ResidenceType: any = [];
  dataList: any = [];
  sortValue: string = 'desc';
  sortKey: string = 'id';

  loadingRecords = false;

  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getResidenceTypestart();
  }

  getaddbulkdatalist: any = [];
  residencetypechange(event) {
    if (event != null && event != undefined && event != '') {
      this.loadingRecords = true;
      this.api
        .getQuarterMaster(
          0,
          0,
          this.sortKey,
          this.sortValue,
          " AND STATUS = 1 AND AVAILABLE_STATUS = 'B' AND TEMP_STATUS = 'A'  AND RESIDENCE_TYPE_ID = " +
          event
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.dataList = data['data'];

              let newdate = new Date();
              let month = Number(this.datepipe.transform(newdate, 'MM'));
              var demodate: any = '';
              if (month == 1) {
                demodate = new Date(
                  newdate.getFullYear() + 1,
                  newdate.getMonth() + 1
                );
              } else {
                demodate = new Date(
                  newdate.getFullYear(),
                  newdate.getMonth() + 1
                );
              }
              month = Number(this.datepipe.transform(demodate, 'MM'));

              let year = Number(this.datepipe.transform(demodate, 'yyyy'));
              let caretakerid = Number(sessionStorage.getItem('userId'));

              this.api
                .getaddbulkdatachek(
                  0,
                  0,
                  '',
                  'asc',
                  ' AND RESIDENCE_TYPE_ID = ' +
                  event +
                  ' AND MONTH = ' +
                  month +
                  ' AND YEAR = ' +
                  year +
                  ' AND CARETAKER_ID = ' +
                  caretakerid
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.getaddbulkdatalist = data['data'];
                    } else {
                      // this.message.error("Something Went Wrong", "");
                    }
                  },
                  (err) => {
                    // this.message.error("Something Went Wrong", "");
                  }
                );
            } else {
              this.message.error('Failed To Get Data', '');
              this.loadingRecords = false;
            }
          },
          (err) => {
            this.message.error('Failed To Get data', '');
            this.loadingRecords = false;
          }
        );
    } else {
      this.dataList = [];
    }
  }

  getResidenceTypestart() {
    this.RESIDENCE_TYPE_ID = '';
    this.api.getResidence(0, 0, 'ID', 'asc', ' AND STATUS=1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.ResidenceType = data['data'];
        } else {
          this.message.error('Something Went Wrong', '');
        }
      },
      (err) => {
        this.message.error('Something Went Wrong', '');
      }
    );
  }

  sendtoinspector() {
    if (this.dataList.length <= 0) {
      this.message.error('Cannot Send For Approval Due to Empty List', '');
    } else if (this.getaddbulkdatalist.length > 0) {
      this.message.error(
        'This Residence Type Quarters Already sent for a Approval ',
        ''
      );
    } else {
      this.isSpinning = true;
      let newdate = new Date();
      let month = this.datepipe.transform(newdate, 'MM');
      let year = this.datepipe.transform(newdate, 'yyyy');
      let caretakerid = sessionStorage.getItem('userId');
      this.api
        .Addbulkflatvacant(this.dataList, month, year, caretakerid)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.message.success('Quarters Sent For Approval Successfully', '');
              this.isSpinning = false;

              this.api
                .getaddbulkdatachek(
                  0,
                  0,
                  '',
                  'asc',
                  ' AND RESIDENCE_TYPE_ID = ' +
                  this.RESIDENCE_TYPE_ID +
                  ' AND MONTH = ' +
                  month +
                  ' AND YEAR = ' +
                  year +
                  ' AND CARETAKER_ID = ' +
                  caretakerid
                )
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      this.getaddbulkdatalist = data['data'];
                      this.drawerClose();
                    } else {
                      // this.message.error("Something Went Wrong", "");
                    }
                  },
                  (err) => {
                    // this.message.error("Something Went Wrong", "");
                  }
                );
            } else {
              this.message.error('Failed To send Quarters For Approval', '');
              this.isSpinning = false;
            }
          },
          (error) => {
            this.message.error('Failed To send Quarters For Approval', '');
            this.isSpinning = false;
          }
        );
    }
  }

  close() {
    this.drawerClose();
  }
}
