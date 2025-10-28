import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { DataBaseTableMaster } from '../../databasetablemaster';

@Component({
  selector: 'app-adddatabasetablemaster',
  templateUrl: './adddatabasetablemaster.component.html',
  styleUrls: ['./adddatabasetablemaster.component.css']
})
export class AdddatabasetablemasterComponent implements OnInit {
  @Input()
  drawerClose!: Function;

  // @Input()
  // imgUrl:any;

  @Input()
  data: DataBaseTableMaster = new DataBaseTableMaster;
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  fileURL: any;
  imgurl = this.api.imgUrl
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  namepatt = /^[a-zA-Z \-\']+/
  mobpattern = /^[6-9]\d{9}$/
  uploadExcel: any = [];

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) {

  }

  ngOnInit() {

    // this.selectedRole=new RoleMaster();
    // this.loadOrganizations();
    // this.loadRoles();
  }

  removeImage() {
    this.data.EXCEL_URL = '';
    this.fileURL = '';

  }






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

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
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
      this.uploadExcel = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.uploadExcel.map(res => {
        if (res[0] === "no") {
        } else {
        }
      })
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // loadOrganizations() {
  //   this.isSpinning = false;

  //   this.api.getAllOrganizations(0,0,'','','').subscribe(organizations => {
  //     this.organizations = organizations['data'];
  //     this.isSpinning = false;
  //   }, err => {
  //     
  //     this.isSpinning = false;
  //   });
  // }

  loadRoles() {
    this.isSpinning = false;

    // this.api.getAllRoles(0,0,'','','').subscribe(roles => {
    //   this.roles = roles['data'];
    //   this.isSpinning = false;
    // }, err => {
    //   
    //   this.isSpinning = false;
    // });
  }

  getSequenceNo() {
    this.api.getdatabasetable(1, 1, 'SEQUENCE_NO', 'desc', '').subscribe(data => {
      if (data['code'] == 200 && data['count'] > 0) {
        var seqno = data['data'][0]['SEQUENCE_NO'];
        this.data.SEQUENCE_NO = Number(seqno) + 1;

      } else {
        this.data.SEQUENCE_NO = 1;
      }
    }, err => {

    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
    this.data.EXCEL_URL = '';
    this.fileURL = ''

  }

  reset(myForm: NgForm) {
    myForm.form.reset();

    myForm.form.markAsPristine();
    myForm.form.markAsUntouched();
  }

  // folderName = "Excel-Masters";
  // uploadedAttachmentStr: string;

  // imageUpload() {
  //   this.uploadedAttachmentStr = "";
  //   if (this.fileURL) {
  //     var number = Math.floor(100000 + Math.random() * 900000);
  //     var fileExt = this.fileURL.name.split('.').pop();
  //     // var url = "N" + number + "." + fileExt;
  //     var url = this.fileURL.name
  //     this.api.onUpload2(this.folderName, this.fileURL, url).subscribe(res => {
  //       if (res["code"] == 200) {
  //         this.message.success(this.fileURL.name + '' + ' file uploaded successfully.', '')
  //       } else {
  //         this.message.error('Something went wrong', '')
  //       }
  //     });
  //     this.uploadedAttachmentStr = this.api.retriveimgUrl + "Excel-Masters/" + url;
  //   } else {
  //     this.uploadedAttachmentStr = "";
  //   }
  // }


  onFileSelected(event: any) {


    if (
      event.target.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    ) {
      this.fileURL = <File>event.target.files[0];
    } else {
      this.message.error('Please select only excel file type.', '');
      this.fileURL = null;
      this.data.EXCEL_URL = '';

    }
  }

  save(addNew: boolean, myForm: NgForm): void {
    this.isSpinning = false;


    if (this.data.TABLE_NAME.trim() == "" && this.data.COLUMN_JSON.trim() == "" && this.data.EXCEL_URL.trim() == "" && this.data.SEQUENCE_NO != undefined) {
      this.isOk = false
      this.message.error("Please Fill All Required Fields", "");
    }
    else if
      (this.data.TABLE_NAME == null || this.data.TABLE_NAME.trim() == '') {
      this.isOk = false
      this.message.error('Please Enter Valid Name', '')
    }
    else
      if (!this.namepatt.test(this.data.TABLE_NAME)) {
        this.isOk = false
        this.message.error('Please Enter Valid Name', '')

      } else if
        (this.fileURL == null || this.fileURL == undefined) {
        this.isOk = false
        this.message.error('Please Select Valid Excel URl', '')
      }
      else if
        (this.data.COLUMN_JSON == null || this.data.COLUMN_JSON.trim() == '') {
        this.isOk = false
        this.message.error('Please Enter Valid Column Json', '')
      } else if
        (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
        this.isOk = false
        this.message.error('Please Enter Valid  Seq. No.', '')
      }

      else


        if (this.isOk) {


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
                if (successCode.code == '200') {
                  this.data.EXCEL_URL = url
                  if (this.data.ID) {
                    this.api.updatedatabsetable(this.data).subscribe((successCode) => {
                      if (successCode.code == '200') {
                        this.message.success('Information Updated Successfully', '');
                        if (!addNew) this.close(myForm);
                        // this.getdocument();
                        this.isSpinning = false;
                      } else {
                        this.message.error('Information Not Updated', '');
                        this.isSpinning = false;
                      }

                    });
                  } else {
                    this.isSpinning = true;
                    this.api.createdatabasetable(this.data).subscribe(successCode => {
                      if (successCode.code == "200") {
                        this.message.success('Information Saved Successfully...', "");
                        this.isSpinning = false;
                        if (!addNew)
                          this.close(myForm)

                        else {
                          this.data = new DataBaseTableMaster();
                          this.getSequenceNo();
                        }

                      } else {
                        this.message.error('Information Not Saved...', "");
                        this.isSpinning = false;
                      }
                    });
                  }
                } else {
                  this.message.error('Upload add problem...', '');
                  this.isSpinning = false;
                }
              });
          }
          else if (this.data.EXCEL_URL == null || this.data.EXCEL_URL == '') {
            this.message.error('Please Select Upload ...', '');
            this.isSpinning = false;
          } else {
            if (this.data.ID) {
              this.isSpinning = true;
              this.api.updatedatabsetable(this.data).subscribe((successCode) => {
                if (successCode.code == '200') {
                  this.message.success('Information Updated Successfully', '');
                  if (!addNew) this.close(myForm);
                  this.isSpinning = false;
                } else {
                  this.message.error('Information Not Updated', '');
                  this.isSpinning = false;
                }
              });
            }
            else {
              this.api.createdatabasetable(this.data).subscribe((successCode) => {
                if (successCode.code == "200") {
                  this.message.success('Information Saved Successfully...', "");
                  this.isSpinning = false;
                  if (!addNew)
                    this.close(myForm)
                  else {
                    this.data = new DataBaseTableMaster();
                    this.getSequenceNo();
                  }
                } else {
                  this.message.error('Information Not Saved...', "");
                  this.isSpinning = false;
                }
              });
            }
          }
        }
  }

}
