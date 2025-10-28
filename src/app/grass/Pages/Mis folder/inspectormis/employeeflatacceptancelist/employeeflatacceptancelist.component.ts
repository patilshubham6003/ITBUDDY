import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-employeeflatacceptancelist',
  templateUrl: './employeeflatacceptancelist.component.html',
  styleUrls: ['./employeeflatacceptancelist.component.css'],
  providers: [DatePipe],
})
export class EmployeeflatacceptancelistComponent {
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any;

  dataList: any = [];
  loadingRecords = false;
  totalRecords = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'ID';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  Timmerstartloop: any = [];
  Timmerendloop: any = [];
  countdowndisable = true;
  isRecordLoading = false;
  columns: string[][] = [['EMPLOYEE_NAME', 'EMPLOYEE_NAME']];
  roleid: any;
  userid: any;
  constructor(
    private message: NzNotificationService,
    private sanitizer: DomSanitizer,
    private api: APIServicesService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.roleid = Number(sessionStorage.getItem('roleId'));
    this.userid = Number(sessionStorage.getItem('userId'));
    if (this.data) {
      this.search(true);
    }
  }

  search(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
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
      likeQuery = ' AND (';
      this.columns.forEach((column) => {
        likeQuery += ' ' + column[0] + " like '%" + this.searchText + "%' OR";
      });
      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
      likeQuery = likeQuery + ')';
    }
    this.isRecordLoading = true;
    if (this.data) {
      this.api
        .getFlatTakenEmployeeList(
          this.pageIndex,
          this.pageSize,
          this.sortKey,
          sort,
          likeQuery +
          ' AND IS_ACCEPTANCE_LETTER_SUBMITTED = 1 AND FINAL_ALLOTMENT_MASTER_ID = ' +
          this.data.ID
        )
        .subscribe(
          (data) => {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.dataList = data['data'];
            this.isRecordLoading = false;
          },
          (err) => {
            this.isRecordLoading = false;
          }
        );
    }
  }

  sort(params: NzTableQueryParams) {
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'ID';
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

  close() {
    this.drawerClose();
  }

  empdata: any;
  newdate = new Date();
  todaysyear: any = new Date(
    this.newdate.getFullYear(),
    this.newdate.getMonth()
  );
  nextyear: any = new Date(
    this.newdate.getFullYear() + 1,
    this.newdate.getMonth()
  );
  todaysdate: any = new Date();
  GenerateFinaletter(data, n) {
    this.todaysyear = this.datepipe.transform(this.todaysyear, 'yyyy');
    this.nextyear = this.datepipe.transform(this.nextyear, 'yyyy');
    this.todaysdate = this.datepipe.transform(this.todaysdate, 'dd/MM/yyyy');
    this.AllotmentPreview = true;
    this.empdata = Object.assign({}, data);
    this.filtergignatureid = ' AND SERVICE_ID = 5';
    this.getsignaturedata();
  }

  uploadfinallist(data, n) { }
  uploadAuthslip(data, n) { }

  AllotmentPreview = false;
  isSpinningmodal = false;
  closemodal() {
    this.search(true);
    this.AllotmentPreview = false;
  }

  // Final Allotment List Signature data
  SECTION_TYPE: any = '';
  NAME: any = '';
  NAME_HN: any = '';
  OFFICE_NAME: any = '';
  OFFICE_NAME_HN: any = '';
  POST: any = '';
  POST_HN: any = '';
  filtergignatureid = '';

  // Authorization Slip Signature 1 data
  SECTION_TYPE1: any = '';
  NAME1: any = '';
  NAME_HN1: any = '';
  OFFICE_NAME1: any = '';
  OFFICE_NAME_HN1: any = '';
  POST1: any = '';
  POST_HN1: any = '';

  // Authorization Slip Signature 2 data
  SECTION_TYPE2: any = '';
  NAME2: any = '';
  NAME_HN2: any = '';
  OFFICE_NAME2: any = '';
  OFFICE_NAME_HN2: any = '';
  POST2: any = '';
  POST_HN2: any = '';
  getsignaturedata() {
    this.Signaturelist = [];
    this.api.getSignature(0, 0, 'ID', 'desc', this.filtergignatureid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturelist = data['data'];
          this.Authsignaturelist1 = data['data'];
          this.Authsignaturelist2 = data['data'];

          // Final Allotment List Signature
          if (
            this.empdata.ALLOTMENT_FINAL_SIGNATURE != null &&
            this.empdata.ALLOTMENT_FINAL_SIGNATURE != undefined &&
            this.empdata.ALLOTMENT_FINAL_SIGNATURE != ''
          ) {
            var f = this.Signaturelist.filter(
              (item) => item['ID'] == this.empdata.ALLOTMENT_FINAL_SIGNATURE
            );
            this.SECTION_TYPE = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID = f[0]['ID'];
            this.NAME = f[0]['NAME'];
            this.NAME_HN = f[0]['NAME_HN'];
            this.OFFICE_NAME = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
            this.POST = f[0]['POST'];
            this.POST_HN = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID = data['data'][0]['ID'];
            this.SECTION_TYPE = data['data'][0]['SECTION_TYPE'];
            this.NAME = data['data'][0]['NAME'];
            this.NAME_HN = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN = data['data'][0]['OFFICE_NAME_HN'];
            this.POST = data['data'][0]['POST'];
            this.POST_HN = data['data'][0]['POST_HN'];
          }
        } else {
          console.error('someting went wrong');
        }
      },
      (error) => { }
    );
  }
  getsignaturedata2() {
    this.Authsignaturelist1 = [];
    this.Authsignaturelist2 = [];
    this.api.getSignature(0, 0, 'ID', 'desc', this.filtergignatureid).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturelist = data['data'];
          this.Authsignaturelist1 = data['data'];
          this.Authsignaturelist2 = data['data'];

          // Final Allotment List Signature

          // Authorization Slip Signature 1
          if (
            this.authdata.AUTHORISATION_SIGNATURE1 != null &&
            this.authdata.AUTHORISATION_SIGNATURE1 != undefined &&
            this.authdata.AUTHORISATION_SIGNATURE1 != ''
          ) {
            var f = this.Authsignaturelist1.filter(
              (item) => item['ID'] == this.authdata.AUTHORISATION_SIGNATURE1
            );
            this.SECTION_TYPE1 = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID1 = f[0]['ID'];
            this.NAME1 = f[0]['NAME'];
            this.NAME_HN1 = f[0]['NAME_HN'];
            this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN1 = f[0]['OFFICE_NAME_HN'];
            this.POST1 = f[0]['POST'];
            this.POST_HN1 = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID1 = data['data'][0]['ID'];
            this.SECTION_TYPE1 = data['data'][0]['SECTION_TYPE'];
            this.NAME1 = data['data'][0]['NAME'];
            this.NAME_HN1 = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME1 = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN1 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST1 = data['data'][0]['POST'];
            this.POST_HN1 = data['data'][0]['POST_HN'];
          }

          // Authorization Slip Signature 2
          if (
            this.authdata.AUTHORISATION_SIGNATURE2 != null &&
            this.authdata.AUTHORISATION_SIGNATURE2 != undefined &&
            this.authdata.AUTHORISATION_SIGNATURE2 != ''
          ) {
            var f = this.Authsignaturelist2.filter(
              (item) => item['ID'] == this.authdata.AUTHORISATION_SIGNATURE2
            );
            this.SECTION_TYPE2 = f[0]['SECTION_TYPE'];
            this.SIGNATURE_ID2 = f[0]['ID'];
            this.NAME2 = f[0]['NAME'];
            this.NAME_HN2 = f[0]['NAME_HN'];
            this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN2 = f[0]['OFFICE_NAME_HN'];
            this.POST2 = f[0]['POST'];
            this.POST_HN2 = f[0]['POST_HN'];
          } else {
            this.SIGNATURE_ID2 = data['data'][0]['ID'];
            this.SECTION_TYPE2 = data['data'][0]['SECTION_TYPE'];
            this.NAME2 = data['data'][0]['NAME'];
            this.NAME_HN2 = data['data'][0]['NAME_HN'];
            this.OFFICE_NAME2 = data['data'][0]['OFFICE_NAME'];
            this.OFFICE_NAME_HN2 = data['data'][0]['OFFICE_NAME_HN'];
            this.POST2 = data['data'][0]['POST'];
            this.POST_HN2 = data['data'][0]['POST_HN'];
          }
        } else {
          console.error('someting went wrong');
        }
      },
      (error) => { }
    );
  }

  SIGNATURE_ID: any;
  SIGNATURE_ID1: any;
  SIGNATURE_ID2: any;
  Signaturelist: any = [];
  Authsignaturelist1: any = [];
  Authsignaturelist2: any = [];
  IsspinningData = false;
  changesignature(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE = '';
      this.NAME = '';
      this.NAME_HN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HN = '';
      this.POST = '';
      this.POST_HN = '';
      this.SIGNATURE_ID = null;
    } else {
      var f = this.Signaturelist.filter((item) => item['ID'] == event);
      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID = f[0]['ID'];
      this.NAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];

      let signaturedata = {
        // ALLOTMENT_FINAL_SIGNATURE: this.SIGNATURE_ID,
        // ID: this.empdata.ID,
        ...this.empdata,
        ALLOTMENT_FINAL_SIGNATURE: this.SIGNATURE_ID,
      };
      this.IsspinningData = true;
      this.api.UpdateEmployeeDataflatfinal(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );
    }
  }
  changesignature1(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE1 = '';
      this.NAME1 = '';
      this.NAME_HN1 = '';
      this.OFFICE_NAME1 = '';
      this.OFFICE_NAME_HN1 = '';
      this.POST1 = '';
      this.POST_HN1 = '';
      this.SIGNATURE_ID1 = null;
    } else {
      var f = this.Authsignaturelist1.filter((item) => item['ID'] == event);
      this.SECTION_TYPE1 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID1 = f[0]['ID'];
      this.NAME1 = f[0]['NAME'];
      this.NAME_HN1 = f[0]['NAME_HN'];
      this.OFFICE_NAME1 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN1 = f[0]['OFFICE_NAME_HN'];
      this.POST1 = f[0]['POST'];
      this.POST_HN1 = f[0]['POST_HN'];

      let signaturedata = {
        // AUTHORISATION_SIGNATURE1: this.SIGNATURE_ID1,
        // ID: this.empdata.ID,
        ...this.authdata,
        AUTHORISATION_SIGNATURE1: this.SIGNATURE_ID1,
        AUTHORISATION_SIGNATURE2: this.SIGNATURE_ID2,
      };
      this.IsspinningData = true;
      this.api.UpdateEmployeeDataflatfinal(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );
    }
  }
  changesignature2(event) {
    if (event == null || event == undefined) {
      this.SECTION_TYPE2 = '';
      this.NAME2 = '';
      this.NAME_HN2 = '';
      this.OFFICE_NAME2 = '';
      this.OFFICE_NAME_HN2 = '';
      this.POST2 = '';
      this.POST_HN2 = '';
      this.SIGNATURE_ID2 = null;
    } else {
      var f = this.Authsignaturelist2.filter((item) => item['ID'] == event);
      this.SECTION_TYPE2 = f[0]['SECTION_TYPE'];
      this.SIGNATURE_ID2 = f[0]['ID'];
      this.NAME2 = f[0]['NAME'];
      this.NAME_HN2 = f[0]['NAME_HN'];
      this.OFFICE_NAME2 = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN2 = f[0]['OFFICE_NAME_HN'];
      this.POST2 = f[0]['POST'];
      this.POST_HN2 = f[0]['POST_HN'];

      let signaturedata = {
        // AUTHORISATION_SIGNATURE2: this.SIGNATURE_ID2,
        // ID: this.empdata.ID,
        ...this.authdata,
        AUTHORISATION_SIGNATURE1: this.SIGNATURE_ID1,
        AUTHORISATION_SIGNATURE2: this.SIGNATURE_ID2,
      };
      this.IsspinningData = true;
      this.api.UpdateEmployeeDataflatfinal(signaturedata).subscribe(
        (value) => {
          if (value.code == 200) {
            this.IsspinningData = false;
          } else {
            console.error('something went wrong');
            this.IsspinningData = false;
          }
        },
        (error) => {
          console.error(error, 'something went wrong');
          this.IsspinningData = false;
        }
      );
    }
  }

  pdfDownload = false;
  downloadPdf() {
    if (
      this.SIGNATURE_ID != null &&
      this.SIGNATURE_ID != undefined &&
      this.SIGNATURE_ID != ''
    ) {
      this.pdfDownload = true;
      const element = document.getElementById('Prntmodal');
      const opt = {
        margin: 0.2,
        filename: 'Final Allotment Letter.pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
      setTimeout(() => {
        this.pdfDownload = false;
      }, 5000);
    } else {
      this.message.error('Please Select Signature', '');
    }
  }

  ViewAcceptanceform(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'acceptanceLetter/' + url;
    window.open(fileUrl);
  }
  ViewAllotmentFinalletter(url: string) {
    const fileUrl = this.api.retriveimgUrl + 'allotmentFinalLetter/' + url;
    window.open(fileUrl);
  }
  ViewAuthSlip(url: string) {
    const fileUrl =
      this.api.retriveimgUrl + 'authorisationOccupationLetter/' + url;
    window.open(fileUrl);
  }

  authdata: any;
  newdate1 = new Date();
  todaysyear1: any = new Date(
    this.newdate1.getFullYear(),
    this.newdate1.getMonth()
  );
  nextyear1: any = new Date(
    this.newdate1.getFullYear() + 1,
    this.newdate1.getMonth()
  );
  todaysdate1: any = new Date();
  GenerateAuthslip(data, n) {
    this.todaysyear1 = this.datepipe.transform(this.todaysyear1, 'yyyy');
    this.nextyear1 = this.datepipe.transform(this.nextyear1, 'yyyy');
    this.todaysdate1 = this.datepipe.transform(this.todaysdate1, 'dd/MM/yyyy');
    this.authModelVisible = true;
    this.authdata = Object.assign({}, data);
    this.filtergignatureid = ' AND SERVICE_ID = 5';
    this.getsignaturedata2();
  }
  authModelVisible = false;
  authhandleCancel() {
    this.search(true);
    this.authModelVisible = false;
  }

  authopenpdfRecords = false;
  authopenpdf() {
    if (
      this.SIGNATURE_ID1 == null ||
      this.SIGNATURE_ID1 == undefined ||
      this.SIGNATURE_ID1 == ''
    ) {
      this.message.error('Please Select Signature 1', '');
    } else if (
      this.SIGNATURE_ID2 == null ||
      this.SIGNATURE_ID2 == undefined ||
      this.SIGNATURE_ID2 == ''
    ) {
      this.message.error('Please Select Signature 2', '');
    } else {
      this.authopenpdfRecords = true;
      const element = document.getElementById('excel-table');
      const opt = {
        margin: 0.2,
        filename: 'Authorization Slip.pdf',
        image: { type: 'jpeg', quality: 7 },
        html2canvas: { scale: 7 },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
      setTimeout(() => {
        this.authopenpdfRecords = false;
      }, 5000);
    }
  }

  progressBar: boolean = false;
  percent = 0;
  timer: any;
  appnPDF: any;
  urlappnPdf: any;
  appnPDF1: any;
  urlappnPdf1: any;
  applnform: boolean = true;

  onFileApplicationform(event: any, data: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.appnPDF = <File>event.target.files[0];

      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          data.ALLOTMENT_FINAL_LETTER != undefined &&
          data.ALLOTMENT_FINAL_LETTER.trim() != ''
        ) {
          var arr = data.ALLOTMENT_FINAL_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.loadingRecords = true;
      this.api
        .onUpload('allotmentFinalLetter', this.appnPDF, this.urlappnPdf)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              'Allotment Final Letter Uploaded Successfully.',
              ''
            );
            data.ALLOTMENT_FINAL_LETTER = this.urlappnPdf;
            data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
            this.api.UpdateEmployeeDataflatfinal(data).subscribe(
              (value) => {
                if (value.code == '200') {
                  this.loadingRecords = false;
                  this.search();
                } else {
                  console.error(
                    'Failed to Update Quarter Employee Quarter Acceptance'
                  );
                  this.loadingRecords = false;
                }
              },
              (error) => {
                console.error(error, 'Something Went Wrong.');
                this.loadingRecords = false;
              }
            );
          } else {
            this.message.error('Failed To Save Allotment Final Letter.', '');
            this.loadingRecords = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.loadingRecords = false;
      this.appnPDF = null;
      data.ALLOTMENT_FINAL_LETTER = null;
    }
  }

  onFileuploadAuthslip(event: any, data: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.appnPDF1 = <File>event.target.files[0];

      if (this.appnPDF1 != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF1.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf1 = url;
        if (
          data.AUTHORISATION_OCCUPATION_LETTER != undefined &&
          data.AUTHORISATION_OCCUPATION_LETTER.trim() != ''
        ) {
          var arr = data.AUTHORISATION_OCCUPATION_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.loadingRecords = true;
      this.api
        .onUpload(
          'authorisationOccupationLetter',
          this.appnPDF1,
          this.urlappnPdf1
        )
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(
              'Authorization Occupation Slip Uploaded Successfully.',
              ''
            );
            data.AUTHORISATION_OCCUPATION_LETTER = this.urlappnPdf1;
            // data.INSPECTOR_ID = Number(sessionStorage.getItem('userId'));
            this.api.UpdateEmployeeDataflatfinal(data).subscribe(
              (value) => {
                if (value.code == '200') {
                  this.loadingRecords = false;
                  this.search();
                } else {
                  console.error(
                    'Failed to Update Quarter Employee Quarter Acceptance.'
                  );
                  this.loadingRecords = false;
                }
              },
              (error) => {
                console.error(error, 'Something Went Wrong.');
                this.loadingRecords = false;
              }
            );
          } else {
            this.message.error(
              'Failed To Save Authorization Occupation Slip.',
              ''
            );
            this.loadingRecords = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.loadingRecords = false;
      this.appnPDF1 = null;
      data.AUTHORISATION_OCCUPATION_LETTER = null;
    }
  }

  clearallotmentfinalform(data: any) {
    data.ALLOTMENT_FINAL_LETTER = null;
    data.INSPECTOR_ID = null;
    this.loadingRecords = true;
    this.api.UpdateEmployeeDataflatfinal(data).subscribe(
      (value) => {
        if (value.code == '200') {
          this.message.success(
            'Allotment Final Letter Deleted Successfully',
            ''
          );
          this.loadingRecords = false;
          this.search();
        } else {
          this.message.error('Failed To Deleted Allotment Final Letter', '');
          this.loadingRecords = false;
        }
      },
      (error) => {
        this.message.error('Something Went Wrong', '');
        this.loadingRecords = false;
      }
    );
  }

  clearAuthSlip(data: any) {
    data.AUTHORISATION_OCCUPATION_LETTER = null;
    // data.INSPECTOR_ID = null;
    this.loadingRecords = true;
    this.api.UpdateEmployeeDataflatfinal(data).subscribe(
      (value) => {
        if (value.code == '200') {
          this.message.success(
            'Authorization Occupation Slip Deleted Successfully.',
            ''
          );
          this.loadingRecords = false;
          this.search();
        } else {
          this.message.error(
            'Failed To Deleted Authorization Occupation Slip.',
            ''
          );
          this.loadingRecords = false;
        }
      },
      (error) => {
        this.message.error('Something Went Wrong', '');
        this.loadingRecords = false;
      }
    );
  }
}
