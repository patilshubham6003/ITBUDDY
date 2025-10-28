import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WebsiteService } from 'src/app/Service/website.service';

class PostingDetailsMaster {
  ID: number;
  EMPLOYEE_ID: any;
  RANK_ID: number;
  DESIGNATION_ID: number;
  OFFICE_ID: number;
  EMPLOYEE_NAME: any;
  RANK_NAME: any;
  DESIGNATION_NAME: any;
  OFFICE_NAME: any;
  POST_DESCRIPTION: any;
  FROM_DATE: any;
  TO_DATE: any;
  ORDER_DATE: any;
  ORDER_NO: any;
  RELIEVING_DATE: any;
  STATE_ID: any;
  AREA_ID: any;
  CITY_ID: any;
  CLASS_ID: any;
  POST_TYPE_ID: any;
  POST_CATEGORY_ID: any;

  STATE_NAME: any;
  AREA_NAME: any;
  CITY_NAME: any;
  CLASS_NAME: any;
  POST_TYPE_NAME: any;
  POST_CATEGORY_NAME: any;

  IS_POST: any;
  WARD_CIRCLE: any;
  ADDL_CCIT: any;
  CIT: any;
  CCIT: any;
  JOINING_DATE: any;
  REMARK: any;
}
@Component({
  selector: 'app-posting-details',
  templateUrl: './posting-details.component.html',
  styleUrls: ['./posting-details.component.css'],
})
export class PostingDetailsComponent {
  @Input() drawerVisibleFamily: boolean = false;
  @Input() drawerPostingClose: Function;
  @Input() data: any;
  @Input() drawerforwhat: any;
  close() {
    this.drawerPostingClose();
  }
  disabledDate18years = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      current >=
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };

  isSpinning = false;
  constructor(
    private datepipe: DatePipe,
    private api: WebsiteService,

    private message: NzNotificationService
  ) {}
  dateDOB: any;
  dubpilcatedata: any;
  ngOnInit() {
    if (this.drawerforwhat == 'P') {
      this.dubpilcatedata = this.data;
      this.data.OLD_ITHR_OFFICE_ID = this.dubpilcatedata.OFFICE_ID;
      this.data.OLD_ITHR_RANK_ID = this.dubpilcatedata.RANK_ID;
      this.data.OLD_ITHR_ORDER_TYPE = this.dubpilcatedata.ORDER_TYPE;
      this.data.OLD_ITHR_FROM_DATE = this.dubpilcatedata.FROM_DATE;
      this.data.OLD_ITHR_TO_DATE = this.dubpilcatedata.TO_DATE;
      // this.getallPostCategory();
      // this.getallPostType();
      // this.getallState();
      // this.getallArea();
      // this.getallClass();
      this.getallOffice();
      this.getallRank();
      // this.getpostingdataa();
      // this.ListOfDesignation();
    }
  }
  postCate: any = [];
  getallPostCategory() {
    if (this.postCate.length == 0) {
      this.api.getallPostCategory(0, 0, '', '', 'AND STATUS = 1').subscribe(
        (forms) => {
          this.postCate = forms['data'];
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  postType: any = [];
  getallPostType() {
    if (this.postType.length == 0) {
      this.isSpinning = true;
      this.api.getAllPostTypeMaster(0, 0, '', '', 'AND STATUS = 1').subscribe(
        (forms) => {
          this.postType = forms['data'];
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }
  State: any = [];
  getallState() {
    if (this.State.length == 0) {
      if (this.State.length == 0) {
        this.isSpinning = true;
        this.api.getAllStateMaster(0, 0, '', '', 'AND STATUS = 1').subscribe(
          (forms) => {
            this.State = forms['data'];
            if (this.data.STATE_ID) {
              // this.getCityyy(this.data.STATE_ID);
            }

            this.isSpinning = false;
          },
          (err) => {
            this.isSpinning = false;
          }
        );
      }
    }
  }
  class: any = [];
  getallClass() {
    if (this.class.length == 0) {
      this.isSpinning = true;
      this.api.getAllClass(0, 0, '', '', 'AND STATUS = 1').subscribe(
        (forms) => {
          this.class = forms['data'];
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }
  Area: any = [];
  getallArea() {
    if (this.Area.length == 0) {
      this.isSpinning = true;
      this.api.getAllZone(0, 0, '', '', 'AND STATUS = 1').subscribe(
        (forms) => {
          this.Area = forms['data'];
          this.isSpinning = false;
        },
        (err) => {
          this.isSpinning = false;
        }
      );
    }
  }
  office: any = [];
  isSpinningforoffice: boolean = false;
  getallOffice() {
    if (this.office.length == 0) {
      this.isSpinningforoffice = true;
      this.api
        .getAllOfficeForTransfer(
          0,
          0,
          'NAME',
          'asc',
          ' AND STATUS=1 AND MDB_ID is not NULL'
        )
        .subscribe(
          (forms) => {
            this.office = forms['data'];
            // forms['data'].forEach((element) => {
            //   element.OFFICE_NAME =
            //     element.OFFICE_NAME + ' (' + element.POST_TYPE_NAME + ')';
            // });

            // this.office = [...[], ...forms['data']];
            this.isSpinningforoffice = false;
          },
          (err) => {
            this.isSpinningforoffice = false;
          }
        );
    }
  }
  rank: any = [];
  isSpinningforrank: boolean = false;
  getallRank() {
    if (this.rank.length == 0) {
      this.isSpinningforrank = true;
      this.api
        .getallDesignationForTransfer(
          0,
          0,
          'NAME',
          'asc',
          ' AND STATUS=1 AND MDB_ID is not NULL '
        )
        .subscribe(
          (forms) => {
            this.rank = forms['data'];
            this.isSpinningforrank = false;
          },
          (err) => {
            this.isSpinningforrank = false;
          }
        );
    }
  }
  postingdata: PostingDetailsMaster = new PostingDetailsMaster();
  getpostingdataa() {
    this.isSpinning = true;
    this.api
      .getAllPostingDetailsMaster(
        0,
        0,
        '',
        '',
        'AND EMPLOYEE_ID = ' + sessionStorage.getItem('EMPLOYEE_ID') + ''
      )
      .subscribe(
        (data) => {
          if (data.code == '200' && data.data.length > 0) {
            this.postingdata = data['data'][0];

            this.isSpinning = false;
          } else {
            this.postingdata = new PostingDetailsMaster();
            this.isSpinning = false;
          }
        },
        (err) => {
          this.isSpinning = false;
        }
      );
  }
  City: any = [];
  // getCityyy(event: any) {
  //   var filter = ' AND STATUS = 1 AND STATE_ID = ' + event;
  //   this.api.getAllCityMaster(0, 0, '', '', filter).subscribe(
  //     (forms) => {
  //       this.City = forms['data'];
  //       this.isSpinning = false;
  //     },
  //     (err) => {
  //       this.isSpinning = false;
  //     }
  //   );
  // }

  onStartChange(date: Date): void {
    this.postingdata.FROM_DATE = date;
  }
  endOpen: boolean = false;
  startOpen: boolean = false;

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }

  disabledDate = (endValue: Date): boolean => {
    if (!endValue) {
      return false;
    }
    var previousDate = new Date(this.postingdata.FROM_DATE);
    previousDate.setDate(previousDate.getDate() + -1);
    return endValue <= new Date(previousDate);
  };

  designation: any = [];

  ListOfDesignation() {
    // if (this.designation.length == 0) {
    //   this.api
    //     .getallDesignation(0, 0, 'NAME', 'asc', ' AND STATUS = 1')
    //     .subscribe(
    //       (data) => {
    //         if (data['code'] == 200) {
    //           if (data['data'].length > 0) {
    //             this.designation = data['data'];
    //           } else {
    //           }
    //         } else {
    //           this.message.error("Can't Load Designation Data", '');
    //         }
    //       },
    //       (err) => {}
    //     );
    // }
  }

  isbUTTONSpinning = false;

  save(addNew: boolean): void {
    var isOk = true;

     if (
      this.data.REMARK1 == null ||
      this.data.REMARK1 == undefined ||
      this.data.REMARK1 == ''
    ) {
      isOk = false;
      this.message.error('Please enter Remark', '');
      return;
    } else  if (
      this.data.PROOF == null ||
      this.data.PROOF == undefined ||
      this.data.PROOF == ''
    ) {
      isOk = false;
      this.message.error('Please select Proof document', '');
      return;
    }

    if (
      this.data.FROM_DATE != null &&
      this.data.FROM_DATE != undefined &&
      this.data.FROM_DATE != ''
    ) {
      // this.data.FROM_DATE = this.data.FROM_DATE.split('/').reverse().join('-');
      this.data.FROM_DATE = this.datepipe.transform(
        this.data.FROM_DATE,
        'yyyy-MM-dd HH:mm:ss'
      );
    }
    if (
      this.data.TO_DATE != null &&
      this.data.TO_DATE != undefined &&
      this.data.TO_DATE != ''
    ) {
      // this.data.TO_DATE = this.data.TO_DATE.split('/').reverse().join('-');
      this.data.TO_DATE = this.datepipe.transform(
        this.data.TO_DATE,
        'yyyy-MM-dd HH:mm:ss'
      );
    }
    if (
      this.data.ORDER_DATE != null &&
      this.data.ORDER_DATE != undefined &&
      this.data.ORDER_DATE != ''
    ) {
      // this.data.ORDER_DATE = this.data.ORDER_DATE.split('/')
      //   .reverse()
      //   .join('-');
      this.data.ORDER_DATE = this.datepipe.transform(
        this.data.ORDER_DATE,
        'yyyy-MM-dd HH:mm:ss'
      );
    }
    this.data.POSTING_DETAILS_ID = this.data.ID;

    this.isbUTTONSpinning = true;
    this.data.EMPLOYEE_ID = Number(sessionStorage.getItem('userId'));
    this.data.ID = 0;

    this.data.APPROVAL_STATUS = 'P';
    this.data.CLIENT_ID = 1;

    this.data.REQUESTED_DATETIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );

    this.api.createposstingrequest(this.data).subscribe(
      (successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('Posting Details request send ', '');
          this.drawerPostingClose();

          this.isbUTTONSpinning = false;
        } else {
          this.message.error('Posting Details Creation Failed', '');
          this.isbUTTONSpinning = false;
        }
      },
      (err) => {
        this.isbUTTONSpinning = false;
      }
    );
  }

  onDOB(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    if (type == 'FD') {
      this.data.FROM_DATE = value;
    } else if (type == 'TD') {
      this.data.TO_DATE = value;
    } else if (type == 'JD') {
      this.data.JOINING_DATE = value;
    } else if (type == 'OD') {
      this.data.ORDER_DATE = value;
    }
  }
  isInvalidDate: boolean = false;
  showInvalidDateError(relievingDate: any): any {
    this.isInvalidDate = false;

    if (relievingDate.length == 10) {
      let tempJoiningDate = relievingDate.split('/');

      for (let i = 0; i < tempJoiningDate.length; i++) {
        if (i == 0) {
          if (
            Number(tempJoiningDate[i]) > 31 ||
            Number(tempJoiningDate[i]) < 1
          ) {
            this.isInvalidDate = true;
            break;
          }
        }

        if (i == 1) {
          if (
            Number(tempJoiningDate[i]) > 12 ||
            Number(tempJoiningDate[i]) < 1
          ) {
            this.isInvalidDate = true;
            break;
          }
        }

        if (i == 2) {
          if (
            tempJoiningDate[i].length < 4 ||
            Number(tempJoiningDate[i]) < 1900
          ) {
            this.isInvalidDate = true;
            break;
          }
        }
      }
    } else {
      this.isInvalidDate = true;
    }

    return this.isInvalidDate;
  }

  gradepaydrawnletter: any;
  urllink3: any = '';
  onFileSelectedTransfer2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.gradepaydrawnletter = <File>event.target.files[0];

      if (this.gradepaydrawnletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.gradepaydrawnletter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink3 = url;
        if (this.data.PROOF != undefined && this.data.PROOF.trim() != '') {
          var arr = this.data.PROOF.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.data.GRADE_PAY_DRAWN_LETTER = this.urllink3;
      this.api
        .onUpload('ithrAddressProof', this.gradepaydrawnletter, this.urllink3)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.PROOF = this.urllink3;

            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.gradepaydrawnletter = null;
      this.data.PROOF = null;
    }
  }

  onFileSelectedTransfer222(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.gradepaydrawnletter = <File>event.target.files[0];

      if (this.gradepaydrawnletter != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.gradepaydrawnletter.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urllink3 = url;
        if (this.PROOF != undefined && this.PROOF.trim() != '') {
          var arr = this.PROOF.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      // this.GRADE_PAY_DRAWN_LETTER = this.urllink3;
      this.api
        .onUpload('ithrAddressProof', this.gradepaydrawnletter, this.urllink3)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.PROOF = this.urllink3;

            this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.gradepaydrawnletter = null;
      this.data.PROOF = null;
    }
  }

  clearGradepayletter() {
    this.gradepaydrawnletter = null;
    this.data.PROOF = null;
  }

  viewidproof(event: any) {
    if (event)
      window.open(this.api.retriveimgUrl + 'ithrAddressProof/' + event);
  }

  PROOF: any;
  save11(addNew: boolean): void {
    var isOk = true;
    if (this.REMARK == null || this.REMARK == undefined || this.REMARK == '') {
      isOk = false;
      this.message.error('Please Enter Remark', '');
      return;
    } else if (
      this.PROOF == null ||
      this.PROOF == undefined ||
      this.PROOF == ''
    ) {
      isOk = false;
      this.message.error('Please select attchement document', '');
      return;
    }

    this.isbUTTONSpinning = true;

    var data = {
      EMPLOYEE_ID: Number(sessionStorage.getItem('userId')),
      REQUESTED_DATETIME: this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      ),
      CLIENT_ID: 1,
      APPROVAL_STATUS: 'P',
      REMARK: this.REMARK,
      ATTACHMENT: this.PROOF,
    };

    this.api.creategenrealrequest(data).subscribe(
      (successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('General Change request send ', '');
          this.drawerPostingClose();

          this.isbUTTONSpinning = false;
        } else {
          this.message.error('General Creation Failed', '');
          this.isbUTTONSpinning = false;
        }
      },
      (err) => {
        this.isbUTTONSpinning = false;
      }
    );
  }

  REMARK: any;
}
