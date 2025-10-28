import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AllotmentMaster } from 'src/app/grass/Models/AllotmentMaster';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';

@Component({
  selector: 'app-application-form-allotment',
  templateUrl: './application-form-allotment.component.html',
  styleUrls: ['./application-form-allotment.component.css'],
  providers: [DatePipe],
})
export class ApplicationFormAllotmentComponent {
  @Input()
  drawerClose!: Function;
  @Input()
  data: any;
  @Input()
  drawerVisible: boolean = false;
  allotmentdata: any = [];
  data1: any;
  checklistdata: any = [];
  fatherdetail1: any;
  Father1name: any;
  Fathername: any;
  employeefullname: any = [];
  dateofbirth: any;
  dataisavailable: boolean = false;
  emp_names: any = [];
  datemm = new Date();
  // thisyear = new Date(this.datemm.getFullYear())
  thisyear: any;
  nextyear: any;
  filterkey = '';
  ResidenceType: any = [];
  flatarrlist: any = [];
  showbutton: boolean = true;
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    let ab = new Date(this.datemm.getFullYear());
    let cd = new Date(this.datemm.getFullYear() + 1);
    this.thisyear = this.datepipe.transform(ab, 'yyyyMMdd');
    this.nextyear = this.datepipe.transform(cd, 'yyyyMMdd');

    if (this.data) {
      this.data1 = this.data;
      this.dataisavailable = true;

      let trimname = this.data.EMPLOYEE_NAME.trim();
      this.emp_names = trimname.split(' ');

      if (this.emp_names.length == 1) {
        this.employeefullname = this.emp_names;
      } else if (this.emp_names.length > 1) {
        for (let i = 0; i < this.emp_names.length; i++) {
          if (this.emp_names[i] !== '') {
            this.employeefullname.push(this.emp_names[i]);
          }
        }
      }

      this.api
        .getAllotmentchecklist(
          0,
          0,
          'ID',
          'desc',
          ' AND ALLOTEMENT_ID  = ' + this.data.ID
        )
        .subscribe((data) => {
          if (data['code'] == 200) {
            let chedata = data['data'];
            this.checklistdata = chedata[0];

            this.api
              .residenceTypeRequest(
                0,
                0,
                'RESIDENCE_TYPE',
                'asc',
                ' AND FLAT_REQUEST_ID = ' + this.data.ID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.flatarrlist = data['data'];
                }
              });
          }
        });
      this.api
        .getAllotmenmaster(0, 0, '', '', ' AND ID = ' + this.data.ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              let allodata = data['data'];
              if (allodata[0]['STATUS'] == '') {
                this.showbutton = true;
              } else {
                this.showbutton = false;
              }
            }
          },
          (err) => { }
        );

      this.api
        .getfamilymaster(
          0,
          0,
          'ID',
          'desc',
          ' AND EMP_ID =' + this.data.EMPLOYEE_ID + ' AND RELATION = "Father"'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              let fatherdetail = data['data'];
              if (fatherdetail.length > 0) {
                this.fatherdetail1 = fatherdetail[0];
                this.Fathername = fatherdetail[0]['NAME'];
                let firstname = this.fatherdetail1.NAME.split(' ');
                this.Father1name = firstname[0];
              }
            }
          },
          (err) => { }
        );

      //   if (this.data.GRADE_PAY >= '1300' && this.data.GRADE_PAY <= '1800') {
      //     this.filterkey = 'AMOUNT IN (1300,1400,1600,1650,1800)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY >= '1900' && this.data.GRADE_PAY <= '2800') {
      //     this.filterkey =
      //       'AMOUNT IN (1300,1400,1600,1650,1800, 1900,2000, 2400,2800)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY >= '4200' && this.data.GRADE_PAY <= '4800') {
      //     this.filterkey =
      //       'AMOUNT IN (1300,1400,1600,1650,1800, 1900,2000, 2400,2800, 4200, 4600, 4800)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY >= '5400' && this.data.GRADE_PAY < '6600') {
      //     this.filterkey = 'AMOUNT IN (5400)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY == '6600') {
      //     this.filterkey = 'AMOUNT IN (5400,6600)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY >= '7600' && this.data.GRADE_PAY <= '8000') {
      //     this.filterkey = 'AMOUNT IN (7600,8000)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY >= '8700' && this.data.GRADE_PAY <= '8900') {
      //     this.filterkey = 'AMOUNT IN (7600,8000,8700,8900)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY == '10000') {
      //     this.filterkey = 'AMOUNT IN (10000)';
      //     this.getdetailsinfo();
      //   } else if (
      //     this.data.GRADE_PAY >= '67000' &&
      //     this.data.GRADE_PAY <= '74999'
      //   ) {
      //     this.filterkey = 'AMOUNT IN (10000,67000,74999)';
      //     this.getdetailsinfo();
      //   } else if (
      //     this.data.GRADE_PAY >= '75000' &&
      //     this.data.GRADE_PAY <= '79999'
      //   ) {
      //     this.filterkey = 'AMOUNT IN (10000,67000,74999,75000,79999)';
      //     this.getdetailsinfo();
      //   } else if (this.data.GRADE_PAY >= '80000') {
      //     this.filterkey = 'AMOUNT IN (10000,67000,74999,75000,79999,80000)';
      //     this.getdetailsinfo();
      //   }
    }
  }

  // getdetailsinfo() {
  //   this.api
  //     .getGradPay(
  //       0,
  //       0,
  //       'ID',
  //       'asc',
  //       " AND " + this.filterkey
  //     )
  //     .subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           let listofresidence = [];
  //           listofresidence = data['data'];
  //           function removeDuplicates(arr: any) {
  //             const uniqueObjects: any = [];
  //             const uniqueResidenceTypeIds = new Set();
  //             for (const obj of arr) {
  //               if (!uniqueResidenceTypeIds.has(obj.RESIDENCE_TYPE_ID)) {
  //                 uniqueObjects.push(obj);
  //                 uniqueResidenceTypeIds.add(obj.RESIDENCE_TYPE_ID);
  //               }
  //             }
  //             return uniqueObjects;
  //           }
  //           const result = removeDuplicates(listofresidence);
  //           this.ResidenceType = result;
  //         }
  //       },
  //       (err) => {
  //
  //       }
  //     );
  // }

  close() {
    this.drawerClose();
  }

  sendforverification() {
    if (
      this.data.APPLICATION_FORM == null ||
      this.data.APPLICATION_FORM == undefined ||
      this.data.APPLICATION_FORM == ''
    ) {
      this.message.error('Please Upload Application Form', '');
    } else {
      this.SpinningRejection = true;
      this.data.STATUS = 'P';
      this.api.UpdateAllotmentmaster(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success(
            'Application Send For Verification Sucessfully',
            ''
          );
          this.SpinningRejection = false;
          this.CancleRemark();
        } else {
          this.message.error(' Failed To Send For Verification...', '');
        }
      });
    }
  }

  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;
  SpinningRejection = false;
  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.SpinningRejection = true;
      this.appnPDF = <File>event.target.files[0];

      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.data.APPLICATION_FORM != undefined &&
          this.data.APPLICATION_FORM.trim() != ''
        ) {
          var arr = this.data.APPLICATION_FORM.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('applicationForm', this.appnPDF, this.urlappnPdf)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.APPLICATION_FORM = this.urlappnPdf;
            if (this.data.APPLICATION_FORM != null) {
              this.applnform = false;
            } else {
              this.applnform = true;
            }
            this.message.success('File Uploaded Successfully...', '');
            this.SpinningRejection = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.SpinningRejection = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.appnPDF = null;
      this.data.APPLICATION_FORM = null;
    }
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  printOrderModalVisible = false;
  view = 0;
  applnformshow(pdfURL: string): void {
    this.view = 1;
    this.printOrderModalVisible = true;
  }

  sanitizedLink: any = '';
  getS(link: string) {
    var a = '';
    if (this.view == 1) {
      a = this.api.retriveimgUrl + 'applicationForm/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  clearapplnform() {
    this.data.APPLICATION_FORM = null;
    this.applnform = true;
  }

  RejectRemark = false;
  openuploadmodal() {
    this.RejectRemark = true;
    if (this.data.APPLICATION_FORM != null) {
      this.applnform = false;
    } else {
      this.applnform = true;
    }
  }

  CancleRemark() {
    this.RejectRemark = false;
    this.ngOnInit();
  }
}
