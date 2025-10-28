import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { WebsiteService } from 'src/app/Service/website.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { differenceInCalendarDays, setHours } from 'date-fns';
@Component({
  selector: 'app-drawerforrepresentation',
  templateUrl: './drawerforrepresentation.component.html',
  styleUrls: ['./drawerforrepresentation.component.css'],
})
export class DrawerforrepresentationComponent {
  @Input() data: any;
  @Input() drawerCloseTP: any;
  @Input() TPforview: any;
  loadingUpdate: boolean = false;
  openconfirmationmodel: boolean = false;
  FROM_DATE: any;
  TO_DATE: any;
  ngOnInit() {
    if (!this.TPforview) {
      this.data.CADRE = this.data.ITHR_DESIGNATION_NAME;
      this.data.CURRENT_RESIDENT_ADD = this.data.ADDRESS;

      if (this.data.DESIGNATION_ID == 30) {
        this.officeOptions1 = [
          { key: 'JAO', value: 'JAO' },
          { key: 'Faceless Assessment', value: 'Faceless Assessment' },
          { key: 'TDS/IT/DGIT/Exemption', value: 'TDS/IT/DGIT/Exemption' },
          { key: 'HQs/Audit/Judicial', value: 'HQs/Audit/Judicial' },
          { key: 'Others', value: 'Others' },
        ];
        this.officed1 = this.officeOptions1;
        this.officed2 = this.officeOptions1;
        this.officed3 = this.officeOptions1;
      } else if (
        this.data.DESIGNATION_ID == 31 ||
        this.data.DESIGNATION_ID == 32
      ) {
        this.officeOptions1 = [
          { key: 'JAO', value: 'JAO' },
          { key: 'Faceless Assessment', value: 'Faceless Assessment' },
          { key: 'Others', value: 'Others' },
          { key: 'Appeals', value: 'Appeals' },
        ];
        this.officed1 = this.officeOptions1;
        this.officed2 = this.officeOptions1;
        this.officed3 = this.officeOptions1;
      }
    }

    if (
      this.data.EMAIL_ID != null &&
      this.data.EMAIL_ID != '' &&
      this.data.EMAIL_ID != undefined
    ) {
      this.istruemail = true;
    } else {
      this.istruemail = false;
    }
    if (
      this.data.MOBILE_NO != null &&
      this.data.MOBILE_NO != '' &&
      this.data.MOBILE_NO != undefined
    ) {
      this.istrumobile = true;
    } else {
      this.istrumobile = false;
    }

    this.ReqBuildinglist = this.ReqBuildinglistforfilter;
    this.ReqBuildinglist2 = this.ReqBuildinglistforfilter;
    this.ReqBuildinglist3 = this.ReqBuildinglistforfilter;
  }
  UpdateTransferForm() {
    this.loadingRecords = true;
    if (!this.data.EMAIL_ID) {
      this.toast.error('Please enter email ID');
      this.loadingRecords = false;
    } else if (!this.data.MOBILE_NO) {
      this.toast.error('Please enter mobile number');
      this.loadingRecords = false;
    } else if (!this.data.CADRE) {
      this.toast.error('Please enter cadre');
      this.loadingRecords = false;
    } else if (!this.data.TENURE_CURRENT_POSTING_YR) {
      this.toast.error('Please enter Period Spent In Current Office in month');
      this.loadingRecords = false;
    } else if (!this.data.TENURE_CURRENT_POSTING_MNT) {
      this.toast.error('Please enter Period Spent In Current Office in year');
      this.loadingRecords = false;
    } else if (!this.data.CURRENT_POSTING) {
      this.toast.error('Please enter current posting');
      this.loadingRecords = false;
    } else if (!this.data.CURRENT_RESIDENT_ADD) {
      this.toast.error('Please enter current residential address');
      this.loadingRecords = false;
    } else if (!this.data.BUILDING_1) {
      this.toast.error('Please enter first building choice');
      this.loadingRecords = false;
    } else if (!this.data.BUILDING_2) {
      this.toast.error('Please enter second building choice');
      this.loadingRecords = false;
    } else if (!this.data.BUILDING_3) {
      this.toast.error('Please enter third building choice');
      this.loadingRecords = false;
    } else if (!this.data.CHARGE_1) {
      this.toast.error('Please enter first charge');
      this.loadingRecords = false;
    } else if (!this.data.CHARGE_2) {
      this.toast.error('Please enter second charge');
      this.loadingRecords = false;
    } else if (!this.data.CHARGE_3) {
      this.toast.error('Please enter third charge');
      this.loadingRecords = false;
      // } else if (!this.data.REASON_FOR_REQUEST) {
      //   this.toast.error('Please enter reason for request');
      //   this.loadingRecords = false;
      // } else if (!this.data.REQUEST) {
      //   this.toast.error('Please enter request details');
      // this.loadingRecords = false;
    } else {
      this.loadingRecords = false;
      this.openconfirmationmodel = true;
    }
  }
  constructor(
    private api: WebsiteService,
    private message: NzNotificationService,
    private datepipe: DatePipe,
    private toast: ToastrService
  ) {}
  officengchange1(BuildingID: number) {
    if (BuildingID != null) {
      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_2 &&
          element.value != this.data.CHARGE_3
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_3
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_2
      );
      this.data.CHARGE_2 = '';
      this.data.CHARGE_3 = '';
    } else {
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_2 &&
          element.value != this.data.CHARGE_3
      );

      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_3
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_2
      );

      this.data.CHARGE_2 = '';
      this.data.CHARGE_3 = '';
    }
  }
  officengchange2(BuildingID: number) {
    if (BuildingID != null) {
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_2
      );
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.CHARGE_2 &&
          element.value != this.data.CHARGE_3
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_3
      );

      this.data.CHARGE_3 = '';
    } else {
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_2
      );
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_2 &&
          element.value != this.data.CHARGE_3
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_3
      );
      this.data.CHARGE_3 = '';
    }
  }
  officengchange3(BuildingID: number) {
    if (BuildingID != null) {
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.CHARGE_2 &&
          element.value != this.data.CHARGE_3
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != BuildingID &&
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_3
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_2
      );
    } else {
      this.officed1 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_2 &&
          element.value != this.data.CHARGE_3
      );

      this.officed2 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_3
      );
      this.officed3 = this.officeOptions1.filter(
        (element: any) =>
          element.value != this.data.CHARGE_1 &&
          element.value != this.data.CHARGE_2
      );
    }
  }

  GetReqOfficeData1(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_2 &&
          element.name != this.data.BUILDING_3
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != BuildingID &&
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_3
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != BuildingID &&
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_2
      );
      this.data.BUILDING_3 = '';
      this.data.BUILDING_2 = '';
    } else {
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_2 &&
          element.name != this.data.BUILDING_3
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_3
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_2
      );

      this.data.BUILDING_3 = '';
      this.data.BUILDING_2 = '';
    }
  }
  GetReqOfficeData2(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != BuildingID &&
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_2
      );
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != BuildingID &&
          element.name != this.data.BUILDING_2 &&
          element.name != this.data.BUILDING_3
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_3
      );
      this.data.BUILDING_3 = '';
    } else {
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_2
      );
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_2 &&
          element.name != this.data.BUILDING_3
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_3
      );
      this.data.BUILDING_3 = '';
    }
  }
  GetReqOfficeData3(BuildingID: number) {
    if (BuildingID != null) {
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != BuildingID &&
          element.name != this.data.BUILDING_2 &&
          element.name != this.data.BUILDING_3
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != BuildingID &&
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_3
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_2
      );
    } else {
      this.ReqBuildinglist = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_2 &&
          element.name != this.data.BUILDING_3
      );

      this.ReqBuildinglist2 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_3
      );
      this.ReqBuildinglist3 = this.ReqBuildinglistforfilter.filter(
        (element: any) =>
          element.name != this.data.BUILDING_1 &&
          element.name != this.data.BUILDING_2
      );
    }
  }

  officeOptions1: any = [
    { key: 'JAO', value: 'JAO' },
    { key: 'Faceless Assessment', value: 'Faceless Assessment' },
    { key: 'TDS/IT/DGIT/Exemption', value: 'TDS/IT/DGIT/Exemption' },
    { key: 'HQs/Audit/Judicial', value: 'HQs/Audit/Judicial' },
    { key: 'Others', value: 'Others' },
    { key: 'Appeals', value: 'Appeals' },
  ];
  ReqBuildinglistforfilter: any = [
    { key: 'Aayakar Bhavan', name: 'Aayakar Bhavan/Pratishtha Bhavan' },
    { key: 'Cumballa Hills', name: 'Cumballa Hills' },
    { key: 'Earnest House', name: 'Earnest House' },
    { key: 'Kautilya Bhavan', name: 'Kautilya Bhavan' },
    { key: 'Mahalaxmi Chambers', name: 'Mahalaxmi Chambers' },
    { key: 'Piramal Chambers', name: 'Piramal Chambers' },
    { key: 'Scindia House', name: 'Scindia House' },
    {
      key: 'Vashi Mtnl Office',
      name: 'Vashi Mtnl Office/Vashi Station Complex',
    },
    { key: 'World Trade Centre', name: 'World Trade Centre' },
  ];
  loadBuilding: boolean = false;
  istruename: boolean = false;
  istruemail: boolean = false;
  istrucode: boolean = false;
  istrumobile: boolean = false;
  mobpattern: any;
  officed1: any = [];
  officed2: any = [];
  officed3: any = [];

  ReqBuildinglist1: any = [];
  ReqBuildinglist: any = [];
  ReqBuildinglist2: any = [];
  ReqBuildinglist3: any = [];
  loadDesignation: any = [];
  Designationlist: any = [];

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }
  designationChanged(event: any) {}
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  appcode: any;
  loadingRecords: boolean = false;
  cancel() {
    this.openconfirmationmodel = false;
  }
  verify() {
    // this.data.APPLICATION_DATE=this.datepipe.
    this.loadingRecords = true;
    if (!this.data.EMAIL_ID) {
      this.toast.error('Please enter email ID');
      this.loadingRecords = false;
    } else if (!this.data.MOBILE_NO) {
      this.toast.error('Please enter mobile number');
      this.loadingRecords = false;
    } else if (!this.data.CADRE) {
      this.toast.error('Please enter cadre');
      this.loadingRecords = false;
    } else if (!this.data.TENURE_CURRENT_POSTING_YR) {
      this.toast.error('Please enter Period Spent In Current Office in month');
      this.loadingRecords = false;
    } else if (!this.data.TENURE_CURRENT_POSTING_MNT) {
      this.toast.error('Please enter Period Spent In Current Office in year');
      this.loadingRecords = false;
    } else if (!this.data.CURRENT_POSTING) {
      this.toast.error('Please enter current posting');
      this.loadingRecords = false;
    } else if (!this.data.CURRENT_RESIDENT_ADD) {
      this.toast.error('Please enter current residential address');
      this.loadingRecords = false;
    } else if (!this.data.BUILDING_1) {
      this.toast.error('Please enter first building choice');
      this.loadingRecords = false;
    } else if (!this.data.BUILDING_2) {
      this.toast.error('Please enter second building choice');
      this.loadingRecords = false;
    } else if (!this.data.BUILDING_3) {
      this.toast.error('Please enter third building choice');
      this.loadingRecords = false;
    } else if (!this.data.CHARGE_1) {
      this.toast.error('Please enter first charge');
      this.loadingRecords = false;
    } else if (!this.data.CHARGE_2) {
      this.toast.error('Please enter second charge');
      this.loadingRecords = false;
    } else if (!this.data.CHARGE_3) {
      this.toast.error('Please enter third charge');
      this.loadingRecords = false;
    } else if (!this.data.REASON_FOR_REQUEST) {
      this.toast.error('Please enter reason for request');
      this.loadingRecords = false;
    } else if (!this.data.REQUEST) {
      this.toast.error('Please enter request details');
      this.loadingRecords = false;
    } else {
      var dataaaa = {
        APPLICATION_DATE: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        EMPLOYEE_ID: this.data.ID,
        APPLICATION_NO: '1',
        EMAIL_ID: this.data.EMAIL_ID,
        MOBILE_NO: this.data.MOBILE_NO,
        CADRE: this.data.CADRE,
        CURRENT_POSTING: this.data.CURRENT_POSTING,
        TENURE_CURRENT_POSTING_MNT: this.datepipe.transform(
          this.data.TENURE_CURRENT_POSTING_MNT,
          'yyyy-MM-dd'
        ),
        TENURE_CURRENT_POSTING_YR: this.datepipe.transform(
          this.data.TENURE_CURRENT_POSTING_YR,
          'yyyy-MM-dd'
        ),
        CURRENT_RESIDENT_ADD: this.data.CURRENT_RESIDENT_ADD,
        BUILDING_1: this.data.BUILDING_1,
        BUILDING_2: this.data.BUILDING_2,
        BUILDING_3: this.data.BUILDING_3,
        CHARGE_1: this.data.CHARGE_1,
        CHARGE_2: this.data.CHARGE_2,
        CHARGE_3: this.data.CHARGE_3,
        REASON_FOR_REQUEST: this.data.REASON_FOR_REQUEST,
        REQUEST: this.data.REQUEST,
        ATTACHMENT: this.data.ATTACHMENT,
        CLIENT_ID: this.data.CLIENT_ID,
      };

      this.api.submitTP(dataaaa).subscribe(
        (successCode) => {
          if (successCode['code'] == '200') {
            this.appcode = successCode['applicationNo'];
            this.openconfirmationmodel = false;
            this.openconfirmationmodel11 = true;

            this.loadingRecords = false;
          } else {
            this.loadingRecords = false;
            this.toast.error('Feedback Information Not Submitted...', '');
          }
        },
        (err) => {
          this.loadingRecords = false;
        }
      );
    }
  }

  cancel11() {
    this.openconfirmationmodel = false;
    this.openconfirmationmodel11 = false;
    this.drawerCloseTP();
  }
  openconfirmationmodel11: boolean = false;

  percent = 0;
  progressBar: boolean = false;
  loadattach: boolean = false;

  clearAttachments() {
    this.data.ATTACHMENT = null;
  }

  AttachmentURL: any;
  timer: any;
  onFileSelectAttachments(event: any) {
    const file = event.target.files[0];

    if (file) {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      ) {
        if (file.size <= 10 * 1024 * 1024) {
          this.loadattach = true;
          this.AttachmentURL = file;
          var urll: any;
          if (this.AttachmentURL != null) {
            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.AttachmentURL.name.split('.').pop();
            var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
            urll = '';
            urll = d == null ? '' : d + number + '.' + fileExt;
          }

          this.progressBar = true;
          this.loadattach = true;

          this.timer = this.api
            .onUploadAttachments('representModuleTP', this.AttachmentURL, urll)
            .subscribe(
              (res) => {
                if (res.type === HttpEventType.Response) {
                  this.loadattach = false;
                } else if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  this.percent = percentDone;

                  if (this.percent == 100) {
                    this.loadattach = false;
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed To Upload File...', '');

                  this.progressBar = false;
                  this.loadattach = false;

                  this.percent = 0;
                  this.data.ATTACHMENT = null;
                }

                if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] == 200) {
                    this.message.success('File Uploaded Successfully...', '');
                    this.data.ATTACHMENT = urll;
                    this.loadattach = false;
                  } else {
                    this.message.error('Failed To Upload File...', '');

                    this.loadattach = false;
                    this.data.ATTACHMENT = null;
                    this.percent = 0;
                    this.progressBar = false;
                  }
                }
              },
              (error) => {
                this.loadattach = false;
              }
            );

          event.target.value = null;
        } else {
          this.data.ATTACHMENTS = null;
          this.percent = 0;
          this.progressBar = false;
          this.message.info(
            'Select only PDF, JPEG, or PNG file less than 10 MB',
            ''
          );
        }
      } else {
        this.data.ATTACHMENTS = null;
        this.percent = 0;
        this.progressBar = false;
        this.message.info('Select only PDF, JPEG, or PNG file', '');
      }
    }
  }

  Year: any;
  month: any;

  showimg() {
    window.open(
      this.api.retriveimgUrl + 'representModuleTP/' + this.data.ATTACHMENT
    );
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.data.TENURE_CURRENT_POSTING_YR) < 0;
}
