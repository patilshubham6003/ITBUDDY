import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ApiService } from 'src/app/Medical/Service/api.service';
import * as XLSX from 'xlsx';
import { ServiceModuleExcel } from '../Components/servicemoduleexcel';
@Component({
  selector: 'app-import-excel-investigation-rate',
  templateUrl: './import-excel-investigation-rate.component.html',
  styleUrls: ['./import-excel-investigation-rate.component.css'],
})
export class ImportExcelInvestigationRateComponent implements OnInit {
  isOk: boolean = true;
  databaseexcel1: any = [];
  downloads: any;
  checked = false;
  DuplicateCount: any;
  FailedCount: any;
  SuccessCount: any;
  TotalCount: any;
  FailedRecords: any = [];
  DuplicateRecords: any = [];
  SuccessedRecords: any = [];
  keys: any = [];
  keys1: any = [];
  keys2: any = [];
  ALL_COLUMNS: any;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}
  // ngOnInit(): void {
  // }
  @Input()
  drawerVisible: boolean = false;

  Excelbox: any;
  ngOnInit() {
    this.DuplicateCount = [];
    this.FailedCount = [];
    this.SuccessCount = [];
    this.TotalCount = [];
    this.FailedRecords = [];
    this.DuplicateRecords = [];
    this.SuccessedRecords = [];
  }

  @Input()
  drawerClose!: Function;

  @Input()
  data: ServiceModuleExcel = new ServiceModuleExcel();

  isSpinning: boolean = false;
  loadingRecords: boolean = false;
  @Input()
  index = 0;
  downloadexcel: any = [];
  uploaddata: any = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'ImportExcel.xlsx';
  fileURL: any;
  databaseexcel: any = [];
  conditionalvalue: any = [];
  @Input()
  excel: any;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  @Input()
  dataList: any = [];
  sortValue: string = 'desc';
  sortKey: string = 'id';
  searchText: string = '';
  filterQuery: string = '';
  isFilterApplied: string = 'default';
  columns: string[][] = [
    ['Name', 'Name'],
    ['SEQUENCE_NO', 'Sequence No.'],
  ];
  failedrecorddata: any[] = [];
  stepsdisabled = true;
  stepsdisabled1 = true;

  folderName = 'ExcelMasters';
  uploadedAttachmentStr: string;
  uploadProgress: number = 0;
  isProgressVisible: boolean = false;
  timer: any;
  @Input()
  resetdrawaerusingboolean = false;
  COLUMN_JSON = [
    {
      TABLE_FIELD: 'NAME',
      EXCEL_FIELD: 'NAME',
      DATA_TYPE: 'VARCHAR',
      SIZE: '256',
    },
    {
      TABLE_FIELD: 'INVESTIGATION_CATEGORY_ID',
      EXCEL_FIELD: 'INVESTIGATION_CATEGORY_ID',
      DATA_TYPE: 'INT',
      SIZE: '',
    },
    {
      TABLE_FIELD: 'NABH_AMOUNT',
      EXCEL_FIELD: 'NABH_AMOUNT',
      DATA_TYPE: 'DECIMAL',
      SIZE: '',
    },
    {
      TABLE_FIELD: 'NON_NABH_AMOUNT',
      EXCEL_FIELD: 'NON_NABH_AMOUNT',
      DATA_TYPE: 'DECIMAL',
      SIZE: '',
    },
    {
      TABLE_FIELD: 'SUPER_SPECIALITY_AMOUNT',
      EXCEL_FIELD: 'SUPER_SPECIALITY_AMOUNT',
      DATA_TYPE: 'DECIMAL',
      SIZE: '',
    },
    {
      TABLE_FIELD: 'NOTIFICATION_MEMORAMDUM_ID',
      EXCEL_FIELD: 'NOTIFICATION_MEMORAMDUM_ID',
      DATA_TYPE: 'INT',
      SIZE: '',
    },
    {
      TABLE_FIELD: 'CITY_ID',
      EXCEL_FIELD: 'CITY_ID',
      DATA_TYPE: 'INT',
      SIZE: '',
    },
    {
      TABLE_FIELD: 'PRICELIST_NAME',
      EXCEL_FIELD: 'PRICELIST_NAME',
      DATA_TYPE: 'VARCHAR',
      SIZE: '128',
    },
    {
      TABLE_FIELD: 'SCHEDULE_NO',
      EXCEL_FIELD: 'SCHEDULE_NO',
      DATA_TYPE: 'VARCHAR',
      SIZE: '64',
    },
    {
      TABLE_FIELD: 'CODE_NO',
      EXCEL_FIELD: 'CODE_NO',
      DATA_TYPE: 'VARCHAR',
      SIZE: '16',
    },
  ];
  // excelurl="http://192.168.29.203:9440/static/ExcelMasters/EMPLOYEE_MASTER.xlsx"
  downloadMyFile() {
    this.loadingRecords = true;
    this.api.getdatabasetable(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200 && data['count'] > 0) {
          // this.downloadexcel = data['data']
          this.excel =
            'http://emrcps.uvtechsoft.com:6927/static/ExcelMasters/' +
            data['data'][0]['EXCEL_URL'];
          // this.excel = "http://192.168.29.34:3938/static/ExcelMasters/" + data['data'][0]['EXCEL_URL']

          window.open(this.excel, '_self');
          this.isSpinning = false;
          this.loadingRecords = false;
        }
        // else if (this.isSMRLead == true) {
        //     this.excel = "http://maihyundaihrms.tecpool.in:9443/static/ExcelMasters/" + data['data'][3]['EXCEL_URL']
        //
        //     window.open(this.excel, '_self')
        // }
        // else if (this.isPSFLead == true) {
        //     this.excel = "http://maihyundaihrms.tecpool.in:9443/static/ExcelMasters/" + data['data'][2]['EXCEL_URL']
        //
        //     window.open(this.excel, '_self')
        // }
        // else {
        //     this.excel = "http://maihyundaihrms.tecpool.in:9443/static/ExcelMasters/" + data['data'][4]['EXCEL_URL']
        //
        //     window.open(this.excel, '_self')
        // }
        // this.api.download(this.excel).subscribe(blob =>
        //   {
        //     // const a = document.createElement('a')
        //     // const objectUrl = URL.createObjectURL(blob)
        //     // a.download = 'EMPLOYEE_MASTER.xlsx';
        //     // a.click();
        //     // URL.revokeObjectURL(objectUrl);})
        //   })
        // const link = document.createElement('a');
        // link.setAttribute('target', '_blank');
        // link.setAttribute('href', 'abc.net/files/test.ino');
        // link.setAttribute('download', 'abcd.xlsx');
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        // this.excelService.exportAsExcelFile(this.excel, 'sample');
        this.isSpinning = false;
        this.loadingRecords = false;
      },
      (err) => {
        this.isSpinning = false;
      }
    );
  }

  // DownloadExcel(): void {
  //   /* generate worksheet */
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data["EXCEL_URL"]);

  //   /* generate workbook and add the worksheet */
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);
  // }

  onIndexChange(index: number): void {
    this.index = index;
  }
  data1: any = [];
  // data: AOA = [];

  progress: number;

  onFileSelected(event: any) {
    this.onFileChange(event);

    if (
      event.target.files[0].type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      this.fileURL = <File>event.target.files[0];
      // this.message.info("Upload And Next", '');
    } else {
      this.message.error('Please select only excel file type.', '');
      this.fileURL = null;
      this.data.EXCEL_URL = '';
    }
  }

  onFileChange(evt: any) {
    this.data1 = [];

    // this.progress = 1;

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.uploaddata = XLSX.utils.sheet_to_json(ws, { header: 1 });

      this.uploaddata.map((res) => {
        if (res[0] === 'no') {
        } else {
        }
      });

      this.data1.push(...this.uploaddata[0]);
      //
      //
    };

    reader.readAsBinaryString(target.files[0]);

    // this.message.success("Upload Successfull", '')
    // if(this.databaseexcel1.length<this.data1)
    // {
    //   this.databaseexcel1.length++;
    // }
    // else{}
  }
  // sort(sort: { key: string; value: string }): void {
  //     this.sortKey = sort.key;
  //     this.sortValue = sort.value;
  //     // this.search(false);
  // }

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
    // this.search();
  }
  save(addNew: boolean, myForm: NgForm): void {
    if (this.isOk) {
      this.data.UPLOADED_DATE_TIME = this.datePipe.transform(
        new Date(),
        'yyyy-MM-dd hh:mm:ss'
      );

      this.isSpinning = true;
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.EXCEL_URL != undefined &&
          this.data.EXCEL_URL.trim() != ''
        ) {
          var arr = this.data.EXCEL_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }

        this.api
          .onUpload3('ExcelMasters', this.fileURL, url)
          .subscribe((successCode) => {
            if (this.fileURL) {
              if (successCode.type === HttpEventType.UploadProgress) {
                this.isProgressVisible = true;
                const percentDone = Math.round(
                  (100 * successCode.loaded) / successCode.total
                );

                this.uploadProgress = percentDone;
              }
            } else {
              this.isProgressVisible = false;
            }
            if (successCode.type === HttpEventType.Response) {
              this.data.EXCEL_URL = url;
              this.api
                .createserviceModuleExcelMaster(this.data)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(
                      'Information Updated Successfully',
                      ''
                    );
                    this.stepsdisabled = false;
                    this.index = 1;
                    // this.onFileChange(myForm)
                    this.isSpinning = false;
                  } else {
                    this.message.error('Something went wrong', '');
                    this.isSpinning = false;
                  }
                });
            }
          });
        if ((this.resetdrawaerusingboolean = true)) {
          myForm.reset();
        }
      } else if (this.data.EXCEL_URL == null || this.data.EXCEL_URL == '') {
        this.message.error('Please Select An Excel To Upload ...', '');
        this.isSpinning = false;

        // this.api.createserviceModuleExcelMaster(this.data).subscribe((successCode) => {
        //     if (successCode.code == "200") {
        //         this.message.success('Information Saved Successfully...', "");
        //         this.isSpinning = false;
        //         // this.onFileChange(myForm)
        //         this.data = new ServiceModuleExcel();
        //         this.index = 1

        //     }
        //     else {
        //         // this.message.error('Something went wrong','')
        //     }
        // })
      }
      this.loadingRecords = true;
      this.api.getdatabasetable(0, 0, '', '', ' ').subscribe(
        (data) => {
          if (data['code'] == 200 && data['count'] > 0) {
            var json = data['data'][0]['COLUMN_JSON'];
            var val = JSON.parse(json);
            this.databaseexcel1 = val;
            this.COLUMN_JSON = [];
            for (var i = 0; i < this.data1.length; i++) {
              this.COLUMN_JSON.push({
                TABLE_FIELD: '',
                EXCEL_FIELD: this.data1[i],
                DATA_TYPE: '',
                SIZE: '',
              });
              for (var j = 0; j < val.length; j++) {
                if (this.data1[i] == val[j]['TABLE_FIELD'])
                  this.COLUMN_JSON[i] = {
                    EXCEL_FIELD: this.data1[i],
                    TABLE_FIELD: val[j]['TABLE_FIELD'],
                    DATA_TYPE: val[j]['DATA_TYPE'],
                    SIZE: val[j]['SIZE'],
                  };
              }
            }

            //  this.databaseexcel1 = json.map(object => object.FIELD_NAME);
          } else {
          }
          // for (let i = 0; i < this.databaseexcel1.length; i++) {
          //   if (this.databaseexcel1[i] == this.data1[i]) {
          //     this.databaseexcel1 = this.data1
          //
          //   }
          //   for (this.databaseexcel1; this.databaseexcel1.length < this.data1.length; this.databaseexcel1.length++) {

          //     if (this.databaseexcel1[i] != this.data1[i]) {
          //       this.databaseexcel1[i] = null
          //     }
          //   }
          // }
          // for (this.databaseexcel1; this.databaseexcel1.length > this.data1.length; this.databaseexcel1.length--) {
          //
          this.loadingRecords = false;
        },
        (err) => {
          this.isSpinning = false;
          this.loadingRecords = false;
        }
      );
    }
  }

  fieldchange(event: any, c: any) {
    for (var j = 0; j < this.databaseexcel1.length; j++) {
      if (event == this.databaseexcel1[j]['TABLE_FIELD']) {
        this.COLUMN_JSON[c]['TABLE_FIELD'] =
          this.databaseexcel1[j]['TABLE_FIELD'];
        this.COLUMN_JSON[c]['DATA_TYPE'] = this.databaseexcel1[j]['DATA_TYPE'];
        this.COLUMN_JSON[c]['SIZE'] = this.databaseexcel1[j]['SIZE'];
      }
    }
  }

  a: boolean;
  allowDuplicateRecords: boolean = false;
  data2: any = [];
  save2(addNew: boolean, myForm: NgForm) {
    var index1: any;
    var evt: any;
    this.fieldchange(evt, index1);

    this.a = false;
    var fcount = 0;

    for (var f = 0; f < this.COLUMN_JSON.length; f++) {
      for (var r = 0; r < this.COLUMN_JSON.length; r++) {
        if (
          this.COLUMN_JSON[f]['TABLE_FIELD'] ==
          this.COLUMN_JSON[r]['TABLE_FIELD']
        ) {
          this.a = true;
          fcount++;
          if (
            this.COLUMN_JSON[f]['TABLE_FIELD'] == null ||
            this.COLUMN_JSON[r]['TABLE_FIELD'] == null
          ) {
            this.COLUMN_JSON[f]['TABLE_FIELD'] = '';
            this.COLUMN_JSON[r]['TABLE_FIELD'] = '';
          }
          //
        }
      }
      if (f + 1 == this.COLUMN_JSON.length && this.a) {
        if (
          fcount > this.COLUMN_JSON.length &&
          this.COLUMN_JSON[f]['TABLE_FIELD'] != ''
        ) {
          this.message.error('Some Column on Application Fields Are Same', '');
          this.a = true;
        } else {
          this.a = false;
        }
      }
    }

    if (this.a == false) {
      this.isSpinning = true;
      this.data2 = this.COLUMN_JSON;

      // this.data2=JSON.stringify(this.COLUMN_JSON)

      if (this.allowDuplicateRecords == true) {
        this.data.IS_ALLOW_DUPLICATES = 'Y';
      }
      if (this.allowDuplicateRecords == false) {
        this.data.IS_ALLOW_DUPLICATES = 'N';
      }

      // }
      // if (this.isSMRLead == true) {
      //     this.api.serviceReminderSMR(this.data.EXCEL_URL, this.data2, 2, this.data.IS_ALLOW_DUPLICATES).subscribe((successCode) => {
      //         if (successCode.code == "200") {
      //             this.message.success('Information Saved Successfully...', "");
      //             this.isSpinning = false;
      //             this.stepsdisabled1 = false;
      //             this.index = 2
      //             // this.onFileChange(myForm)
      //             this.DuplicateCount = successCode.DuplicateCount
      //             this.FailedCount = successCode.FailedCount
      //             this.SuccessCount = successCode.SuccessCount
      //             this.TotalCount = successCode.TotalCount
      //             this.totalRecords = this.TotalCount
      //             this.FailedRecords = successCode.FailedRecords
      //             this.DuplicateRecords = successCode.DuplicateRecords
      //             this.SuccessedRecords = successCode.SuccessedRecords

      //             for (let i = 0; i < this.SuccessedRecords.length; i++) {

      //                 this.keys.push(Object.values(this.SuccessedRecords[i]))
      //             }

      //             for (let n = 0; n < this.DuplicateRecords.length; n++) {

      //                 this.keys1.push(Object.values(this.DuplicateRecords[n]))
      //             }
      //             for (let b = 0; b < this.FailedRecords.length; b++) {

      //                 this.keys2.push(Object.values(this.FailedRecords[b]))
      //             }

      //             // this.SuccessedRecords=this.keys
      //
      //             //
      //             // for (let i = 0; i < this.FailedRecords.length; i++) {

      //             //   // this.failedrecorddata.push({},this.FailedRecords[i])
      //             //   // this.keys = {...this.keys,}
      //             //   // Object.keys(this.SuccessedRecords[i]).map((item) => {
      //             //   //   this.keys.push(...this.keys,item)
      //             //   // });
      //             // }
      //             //

      //

      //
      //

      //         }
      //         else {
      //             // this.message.error('Something went wrong','')
      //         }
      //     })
      // }
      this.api
        .importexcelstep2(
          this.data.EXCEL_URL,
          this.data2,
          1,
          this.data.IS_ALLOW_DUPLICATES
        )
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Information Saved Successfully...', '');
            this.isSpinning = false;
            this.stepsdisabled1 = false;
            this.index = 2;
            // this.onFileChange(myForm)
            this.DuplicateCount = successCode.DuplicateCount;
            this.FailedCount = successCode.FailedCount;
            this.SuccessCount = successCode.SuccessCount;
            this.TotalCount = successCode.TotalCount;
            this.totalRecords = this.TotalCount;
            this.FailedRecords = successCode.FailedRecords;
            this.DuplicateRecords = successCode.DuplicateRecords;
            this.SuccessedRecords = successCode.SuccessedRecords;

            for (let i = 0; i < this.SuccessedRecords.length; i++) {
              this.keys.push(Object.values(this.SuccessedRecords[i]));
            }

            for (let n = 0; n < this.DuplicateRecords.length; n++) {
              this.keys1.push(Object.values(this.DuplicateRecords[n]));
            }
            for (let b = 0; b < this.FailedRecords.length; b++) {
              this.keys2.push(Object.values(this.FailedRecords[b]));
            }

            // this.SuccessedRecords=this.keys

            //
            // for (let i = 0; i < this.FailedRecords.length; i++) {

            //   // this.failedrecorddata.push({},this.FailedRecords[i])
            //   // this.keys = {...this.keys,}
            //   // Object.keys(this.SuccessedRecords[i]).map((item) => {
            //   //   this.keys.push(...this.keys,item)
            //   // });
            // }
            //
          } else {
            // this.message.error('Something went wrong','')
          }
        });
    }
  }
  finish(addnew: boolean, myForm: NgForm) {
    this.drawerClose();
    myForm.reset();
    this.stepsdisabled = true;
    this.stepsdisabled1 = true;
    this.index = 0;
    this.fileURL = '';
    this.DuplicateCount = [];
    this.FailedCount = [];
    this.SuccessCount = [];
    this.TotalCount = [];
    this.FailedRecords = [];
    this.DuplicateRecords = [];
    this.SuccessedRecords = [];
    this.uploadProgress = 0;
    this.keys = [];
    this.keys1 = [];
    this.keys2 = [];
  }
}
