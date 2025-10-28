import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { EmployeeReg } from 'src/app/Modal/empregistration2';
import { ServiceService } from 'src/app/Service/service.service';
@Component({
  selector: 'app-uploadithrfilelist',
  templateUrl: './uploadithrfilelist.component.html',
  styleUrls: ['./uploadithrfilelist.component.css'],
  providers: [DatePipe],
})
export class UploadithrfilelistComponent {
  formTitle: any = 'Manage Backup Files';
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterClass: string;

  dataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any;
  columns: string[][] = [
    ['EMPLOYEE_NAME', 'Name'],
    ['EMPLOYEE_CODE', 'Employee Code'],
  ];
  constructor(
    private api: ServiceService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) {}
  sort(params: NzTableQueryParams): void {
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
    this.search();
  }

  approvedCount: any = 0;
  pendingCount: any = 0;
  rejectedCount: any = 0;
  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    var likeQuery = '';
    if (this.searchText != '') {
      likeQuery = ' AND';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }
    // var fil=' AND APPROVAL_STATUS = '+ this.VERIFIED_STATUS

    this.api
      .getallfile(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataList = data['data'];
          this.loadingRecords = false;
        } else {
          this.dataList = [];
          this.message.error('Failed To Get Employees', '');
          this.loadingRecords = false;
        }
      });
  }

  VERIFIED_STATUS: string = 'P';
  showFilter() {
    if (this.filterClass === 'filter-visible')
      this.filterClass = 'filter-invisible';
    else this.filterClass = 'filter-visible';
  }
  showEmployeeSearch: boolean = true;
  isEmpCodevisible = true;
  isEmailVisible = true;

  selectStatus(data: any) {
    this.VERIFIED_STATUS = data;
    this.search();
  }
  REMARK: any;
  verifydata: any;
  verifystatus: any;
  cancel() {
    this.openmodell = false;
    this.viewdataaaa = false;
    this.REMARK = '';
  }
  openmodell: boolean = false;
  oldpostindata: any;
  approverejectdata(data: any, status: any) {
    this.verifydata = data;
    this.verifystatus = status;
    this.openmodell = true;
  }
  loadsendto: boolean = false;

  verify(data: any, status: any) {
    if (
      status == 'R' &&
      (this.REMARK == null || this.REMARK == undefined || this.REMARK == '')
    ) {
      this.message.error('Please Enter Remark', '');
    } else {
      this.loadingRecords = true;
      this.verifydata.APPROVAL_STATUS = status;

      this.verifydata.REJECT_REMARK = this.REMARK ? this.REMARK : null;

      this.api.updategenralrequest(this.verifydata).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          if (status == 'A') {
            this.message.success(' Information Approved Successfully...', '');
          } else {
            this.message.success(' Information Rejected Successfully...', '');
            this.loadingRecords = false;
            this.openmodell = false;
          }
          this.search();

          this.verifydata = '';
          this.oldpostindata = [];
          this.verifystatus = '';
          this.REMARK = '';
        } else {
          this.message.error(' Failed To Update Information...', '');
          this.loadingRecords = false;
        }
      });
    }
  }

  viewidproof(event: any) {
    if (event) window.open(this.api.retrieveimgUrl + 'ithrMdbFile/' + event);
  }

  clearGradepayletter() {
    this.PROOF = null;
  }
  viewipayslip(event: any) {
    if (event) window.open(this.api.retrieveimgUrl + 'paySlips/' + event);
  }

  viewdataaaa: boolean = false;
  PROOF: any;
  urllink3: any;
  viewdataaaaaaaaaa(data: any) {
    this.verifydata = data;
    this.openmodell = true;
  }
  isSpinning: boolean = false;
  gradepaydrawnletter: any;
  onFileSelectedTransfer222(event: any) {
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
      .onUpload1212('ithrMdbFile', this.gradepaydrawnletter, this.urllink3)
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
  }

  save() {
    if (this.PROOF == null || this.PROOF == undefined || this.PROOF == '') {
      this.message.error('Please select Backup file', '');
    } else {
      this.isSpinning = true;

      var dataaa = {
        UPLOAD_COMPLETE_DATETIME: this.datepipe.transform(
          new Date(),
          'yyyy-MM-dd HH:mm:ss'
        ),
        STATUS: true,
        ITHR_DB_FILE: this.PROOF,
        CLIENT_ID: 1,
      };

      this.api.createnewmbdfile(dataaa).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.message.success('File saved Successfully...', '');
          this.isSpinning = false;
          this.openmodell = false;

          this.search();

          this.verifydata = '';
          this.oldpostindata = [];
          this.verifystatus = '';
          this.REMARK = '';
        } else {
          this.message.error(' Failed To save Information...', '');
          this.isSpinning = false;
        }
      });
    }
  }

  add() {
    this.loadingRecords = true;
    this.PROOF = null;
    this.openmodell = true;
    this.api.getallgenralreqcount(0, 0, '', '', '').subscribe(
      (forms) => {
        if (
          forms['data'][0]['PENDING'] == null ||
          forms['data'][0]['PENDING'] == 0
        ) {
          this.api.getallpostingreqcount(0, 0, '', '', '').subscribe(
            (formsssss) => {
              var dataaaaa = formsssss['data'];

              if (
                formsssss['data'][0]['PENDING'] == null ||
                formsssss['data'][0]['PENDING'] == 0
              ) {
                this.PROOF = null;
                this.openmodell = true;
              } else {
                this.loadingRecords = false;
                this.message.info(
                  'Please approve or reject the pending posting verification.',
                  ''
                );
              }

              this.loadingRecords = false;
            },
            (err) => {
              // this.isSpinning = false;
              this.loadingRecords = false;
            }
          );
        } else {
          this.loadingRecords = false;
          
          this.message.info(
            'Please approve or reject the pending general verification.',
            ''
          );
        }
      },
      (err) => {
        // this.isSpinning = false;
        this.loadingRecords = false;
      }
    );
  }
}
