import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-bulkflatvacantinspector',
  templateUrl: './bulkflatvacantinspector.component.html',
  styleUrls: ['./bulkflatvacantinspector.component.css'],
})
export class BulkflatvacantinspectorComponent {
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
    let newdate = new Date();
    let month = Number(this.datepipe.transform(newdate, 'MM'));
    var demodate: any = '';
    if (month == 12) {
      demodate = new Date(newdate.getFullYear() + 1, newdate.getMonth() + 1);
    } else {
      demodate = new Date();
    }

    month = Number(this.datepipe.transform(demodate, 'MM'));
    let year = Number(this.datepipe.transform(demodate, 'yyyy'));
    if (event != null && event != undefined && event != '') {
      this.loadingRecords = true;
      this.api
        .getaddbulkdatachek(
          0,
          0,
          'ID',
          'desc',
          ' AND IS_APPROVED=0 AND RESIDENCE_TYPE_ID = ' +
          event +
          ' AND MONTH = ' +
          month +
          ' AND YEAR = ' +
          year
        )
        .subscribe(
          (data) => {
            if (data.code == 200) {
              this.loadingRecords = false;
              this.dataList = data['data'];
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

  Approvetheflats() {
    if (this.dataList.length <= 0) {
      this.message.error('Cannot Approve Due to Empty List', '');
    } else {
      this.isSpinning = true;

      let newdate = new Date();
      let month = Number(this.datepipe.transform(newdate, 'MM'));
      // var demodate:any=''
      //   if(month==12){
      //     demodate = new Date(
      //       newdate.getFullYear()+1,
      //       newdate.getMonth()+1,
      //     );
      //   }else{
      //     demodate=new Date();
      //   }

      month = Number(this.datepipe.transform(newdate, 'MM'));
      let year = Number(this.datepipe.transform(newdate, 'yyyy'));

      // let month = Number(this.datepipe.transform(newdate, "MM"));
      // let year = Number(this.datepipe.transform(newdate, "yyyy"));

      this.api
        .Approvebulkflatvacant(month, year, this.RESIDENCE_TYPE_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.message.success('Quarters Approved Successfully', '');
              this.isSpinning = false;
              this.drawerClose();
            } else if (data['code'] == 300) {
              this.message.info('Quarters Have Already Been Approved.', '');
              this.isSpinning = false;
            } else {
              this.message.error('Failed To Approve Quarters', '');
              this.isSpinning = false;
            }
          },
          (error) => {
            this.message.error('Failed To Approve Quarters', '');
            this.isSpinning = false;
          }
        );
    }
  }

  close() {
    this.drawerClose();
  }
}
