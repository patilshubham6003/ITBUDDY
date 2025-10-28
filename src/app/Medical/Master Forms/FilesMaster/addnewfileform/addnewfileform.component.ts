import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { log } from 'console';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { Filemaster } from 'src/app/Medical/Models/filemaster';
// import { NzNotificationService } from 'ng-zorro-antd';
// import { areaMaster } from 'src/app/Models/supportAreaMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-addnewfileform',
  templateUrl: './addnewfileform.component.html',
  styleUrls: ['./addnewfileform.component.css'],
})
export class AddnewfileformComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Filemaster;
  @Input() listOfData2: any = [];
  @Input() Hierarchy: any = [];

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private datepipe: DatePipe,
    private cookie: CookieService
  ) {}
  isSpinning = false;

  pageIndex = 1;
  pageSize = 10;
  totalRecords = 100;

  date = null;
  isOk = false;
  listOfData: any = [];

  ngOnInit() {
    this.getData();
    // this.getHierarchy();
    this.getallorg1();
  }

  listdata2: any = [];
  getallorg1() {
    this.Allfiles = [];

    this.api.getFileMaster1(0, 0, '', '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Allfiles = data['data'];
        }
      },
      (err) => {}
    );
  }

  getallorg2(userID) {
    this.listdata2 = [];

    var tempEmpList = this.Allfiles.filter((obj1) => {
      return obj1['ID'] != userID;
    });

    this.listdata2 = tempEmpList;
  }

  Hierarchy1: any;
  Hierarchy2: any = [];
  isadvance;
  FILENUM: any;
  hierarchyy: any;
  yearss: any;

  hierarchychange(event) {
    if (this.data.HIRARCHY_ID != null && this.data.YEAR != null) {
      this.Hierarchy2 = this.Hierarchy.filter((obj) => {
        return obj.ID == this.data.HIRARCHY_ID;
      });
      var filename = this.Hierarchy2[0]['HIRARCHY_NAME'];
      this.isadvance = this.Hierarchy2[0]['IS_ADVANCE'];

      this.api
        .getHierarchyMaster1(filename, this.data.HIRARCHY_ID, this.data.YEAR)
        .subscribe((data) => {
          this.Hierarchy1 = data['FILE_NUMBER'];

          var filenumber = this.Hierarchy1;

          //process
          const lastIndex = filenumber.toString().lastIndexOf('/');
          var Final = filenumber.toString().slice(0, lastIndex);

          //hierarchy
          const hierarchy = Final.lastIndexOf('/');
          this.hierarchyy = Final.slice(0, hierarchy);
          //

          //year
          const year = filenumber.toString().lastIndexOf('/');
          this.yearss = filenumber.toString().slice(year + 1);
          //

          //File number
          const lastIndex1 = Final.lastIndexOf('/');
          var main = Final.slice(lastIndex1 + 1);

          this.FILENUM = main;

          this.data.FILE_NUMBER =
            this.hierarchyy + '/' + this.FILENUM + '/' + this.yearss;
        });
    }
  }

  filenumberchange(event) {
    this.data.FILE_NUMBER = this.hierarchyy + '/' + event + '/' + this.yearss;
  }

  // Hierarchy:any = [];
  getHierarchy() {
    this.api
      .getAllFilehierarchy(0, 0, '', '', 'AND IS_LAST=1')
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.Hierarchy = data['data'];
        }
      });
  }
  Allfiles: any = [];
  // getallfiles() {
  //   this.api
  //     .getFileMaster(0, 0, '', '', '','')
  //     .subscribe((data) => {
  //       this.Allfiles = data['data'];
  //       //
  //     });
  // }

  getData() {
    this.api
      .getFileMaster(
        0,
        0,
        '',
        '',
        'AND STATUS=1',
        sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          this.listOfData = data['data'];

          // this.listOfOptions1 = data['data'];
          //
        }
      });
  }

  onSubmit(addNew: boolean, httpForm: NgForm) {
    this.isOk = true;
    if (this.data.HIRARCHY_ID == null || this.data.HIRARCHY_ID == undefined) {
      this.isOk = false;
      this.message.error('Please Select Hierarchy.', '');
    } else if (this.data.YEAR == null || this.data.YEAR.trim() == '') {
      this.isOk = false;
      this.message.error('Please Select Valid Year.', '');
    } else if (
      this.data.FILE_NAME == null ||
      this.data.FILE_NAME.trim() == ''
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid Name.', '');
    } else if (
      this.data.FILE_NUMBER == null ||
      this.data.FILE_NUMBER == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Valid File No.', '');
    } else if (
      this.data.FILE_STATUS == null ||
      this.data.FILE_STATUS == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Select File Status.', '');
    }
    this.data.CREATOR_ID = sessionStorage.getItem('userId');

    if (this.isOk) {
      if (this.data.ID) {
        var emailData2 = this.listdata2.filter((obj) => {
          return obj.FILE_NUMBER == this.data.FILE_NUMBER;
        });

        if (emailData2.length == 0) {
          this.isSpinning = true;
          this.api.updatefileor(this.data).subscribe((successCode: any) => {
            if (successCode['code'] == 200) {
              // this.getData();
              // this.isSpinning = true;
              this.message.success(
                'File information Updated successfully...',
                ''
              );
              this.getallorg1();

              if (!addNew) {
                this.drawerClose();
                this.reset(httpForm);
                this.isSpinning = false;
              } else {
                this.data = new Filemaster();
                this.message.error('Failed To Update', '');

                this.isSpinning = false;
              }
              //
            }
          });
        } else {
          this.message.error(
            ' File Number Already Exist. Please Enter Other File Number ',
            ''
          );
          this.isSpinning = false;
        }
      } else {
        var emailData = this.Allfiles.filter((obj) => {
          return obj.FILE_NUMBER == this.data.FILE_NUMBER;
        });

        if (emailData.length == 0) {
          this.isSpinning = true;
          this.data.CURRENT_POSITION_ID = sessionStorage.getItem('userId');
          this.data.ACTION_STATUS = 'M';
          this.data.IS_ADVANCE = this.isadvance;
          this.api.createfile(this.data).subscribe((successCode) => {
            if (successCode['code'] == 200) {
              this.message.success(
                'File information added successfully...',
                ''
              );

              this.getallorg1();
              // this.getData();
              if (!addNew) {
                // this.isSpinning = true;
                this.reset(httpForm);
                this.drawerClose();
              } else {
                this.data = new Filemaster();
                httpForm.resetForm();
                this.reset(httpForm);
              }
              this.isSpinning = false;
            } else {
              this.message.error('Failed to add File information...', '');

              this.isSpinning = false;
            }
          });
        } else {
          this.message.error(
            ' File Number Already Exist. Please Enter Other File Number',
            ''
          );
          this.isSpinning = false;
        }
      }
    }
  }

  close(httpForm: NgForm) {
    // this.isSpinning=true;
    this.reset(httpForm);
    this.yearss = '';
    this.hierarchyy = '';
    this.drawerClose();
  }

  reset(httpForm: NgForm) {
    // this.isSpinning = true;
    httpForm.reset();
  }
}

// save(addNew: boolean,fileHierarchy:NgForm): void {

//     if (this.data.ID) {
//         //   this.filteredOptions = this.employee.filter(option => option.NAME.toLowerCase().indexOf(value.toLowerCase()) !== -1);

//       // var emailData2 = this.listdata2.filter(obj => {
//       //   return (obj.CODE.toLowerCase().indexOf(this.data.CODE.toLowerCase()) !== -1)
//       // });
//       // if (emailData2.length == 0){

//
//       this.api.updateFilehierarchy(this.data)
//         .subscribe(successCode => {
//           if (successCode['code'] == "200") {
//             this.message.success("File Hierarchy information updated Successfully...", "");
//             if (!addNew)
//               this.drawerClose();
//               this.loadForms()
//               this.reset(fileHierarchy);
//               this.IS_ADVANCE=null
//             this.isSpinning = false;
//           }
//           else {
//             this.message.error("Failed to update File Hierarchy information...", "");
//             this.isSpinning = false;
//             this.IS_ADVANCE=null
//           }
//         });
//       }
//       else {

//     //     this.message.error(" Code Already Exist. Please Enter Other Code", "");
//     //     this.isSpinning = false;
//     //   }

//     // }
//     // else {
//     //
//     //   var emailData = this.listdata1.filter(obj => {
//     //     return (obj.CODE.toLowerCase().indexOf(this.data.CODE.toLowerCase()) !== -1)

//     //   })

//     //   if (emailData.length == 0) {
//       this.api.createFilehierarchy(this.data)
//         .subscribe(successCode => {
//           if (successCode['code'] == "200") {
//             this.message.success("File Hierarchy Information Added Successfully...", "");
//             if (!addNew){
//               this.drawerClose();
//               this.IS_ADVANCE=null
//               this.reset(fileHierarchy);
//             }

//             else {

//               this.data = new FileHierarchy();
//               fileHierarchy.resetForm();
//               this.reset(fileHierarchy);
//               this.loadForms()
//               this.getallorg1();
//               this.IS_ADVANCE=null
//             }
//             this.isSpinning = false;
//           }
//           else {
//             this.message.error("Failed To Add File Hierarchy Information...", "");
//             this.isSpinning = false;
//           }
//         });
//       }
//       // else {

//       //   this.message.error(" Code Already Exist. Please Enter Other Code", "");
//       //   this.isSpinning = false;
//       // }
//     // }
//   }
