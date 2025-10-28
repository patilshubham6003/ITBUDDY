import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FileHierarchy } from 'src/app/Medical/Models/filehierarchy';
// import { FileHierarchy } from 'src/app/Models/filehierarchy';
import { ApiService } from 'src/app/Medical/Service/api.service';
// import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-filehierarchies',
  templateUrl: './filehierarchies.component.html',
  styleUrls: ['./filehierarchies.component.css'],
})
export class FilehierarchiesComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: FileHierarchy;
  @Input() IS_ADVANCE;
  isSpinning = false;
  loadingForm = false;
  @Input() FileHierarchy: FileHierarchy[];

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit() {
    this.loadForms();
    this.getallorg1();
    this.FinalgetHierarchy();
  }

  FinalHierarchy: any = [];
  FinalgetHierarchy() {
    this.api
      .getAllFilehierarchy(0, 0, '', '', 'AND IS_ADVANCE = ' + '"N"')
      .subscribe((data) => {
        this.FinalHierarchy = data['data'];
      });
  }
  loadForms() {
    this.loadingForm = true;
    this.api.getAllFilehierarchy(0, 0, '', '', 'AND IS_LAST=0').subscribe(
      (data) => {
        this.FileHierarchy = data['data'];
        this.loadingForm = false;
      },
      (err) => {
        //this.loadingForm = false;
      }
    );
  }

  // close(): void {
  //   this.drawerClose();
  // }

  listdata1: any = [];
  @Input() listdata2: any = [];

  getallorg1() {
    this.FileHierarchy = [];

    this.api.getAllFilehierarchy(0, 0, 'ID', 'desc', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.FileHierarchy = data['data'];
        }
      },
      (err) => {}
    );
  }

  // getallorg2(id) {
  //   this.listdata2 = [];

  //   var tempEmpList = this.listdata1.filter(obj1 => {
  //     return obj1["ID"] != id;
  //   });

  //   this.listdata2 = tempEmpList;
  // }

  // save(addNew: boolean,fileHierarchy:NgForm): void {
  //   this.isSpinning = true;

  //   if(this.IS_ADVANCE==true){
  //     this.data.IS_ADVANCE='Y'
  //   }else{
  //     this.data.IS_ADVANCE='N'
  //   }
  //   if(this.data.IS_LAST==false){
  //     this.data.IS_LAST=false
  //   }

  //   if(this.data.IS_LAST==true){
  //     this.data.IS_LAST=true
  //   }

  //   // this.data.IS_LAST=this.data.IS_LAST

  //   if (this.data.ID) {
  //       //   this.filteredOptions = this.employee.filter(option => option.NAME.toLowerCase().indexOf(value.toLowerCase()) !== -1);

  //     // var emailData2 = this.listdata2.filter(obj => {
  //     //   return (obj.CODE.toLowerCase().indexOf(this.data.CODE.toLowerCase()) !== -1)
  //     // });
  //     // if (emailData2.length == 0){

  //     this.api.updateFilehierarchy(this.data)
  //       .subscribe(successCode => {
  //         if (successCode['code'] == "200") {
  //           this.message.success("File Hierarchy information updated Successfully...", "");
  //           if (!addNew)
  //             this.drawerClose();
  //             this.loadForms()
  //             this.reset(fileHierarchy);
  //             this.IS_ADVANCE=null
  //           this.isSpinning = false;
  //         }
  //         else {
  //           this.message.error("Failed to update File Hierarchy information...", "");
  //           this.isSpinning = false;
  //           this.IS_ADVANCE=null
  //         }
  //       });
  //     }
  //     else {

  //   //     this.message.error(" Code Already Exist. Please Enter Other Code", "");
  //   //     this.isSpinning = false;
  //   //   }

  //   // }
  //   // else {
  //   //   var emailData = this.listdata1.filter(obj => {
  //   //     return (obj.CODE.toLowerCase().indexOf(this.data.CODE.toLowerCase()) !== -1)

  //   //   })

  //   //   if (emailData.length == 0) {
  //     this.api.createFilehierarchy(this.data)
  //       .subscribe(successCode => {
  //         if (successCode['code'] == "200") {
  //           this.message.success("File Hierarchy Information Added Successfully...", "");
  //           if (!addNew){
  //             this.drawerClose();
  //             this.IS_ADVANCE=null
  //             this.reset(fileHierarchy);
  //           }

  //           else {

  //             this.data = new FileHierarchy();
  //             fileHierarchy.resetForm();
  //             this.reset(fileHierarchy);
  //             this.loadForms()
  //             this.getallorg1();
  //             this.IS_ADVANCE=null
  //           }
  //           this.isSpinning = false;
  //         }
  //         else {
  //           this.message.error("Failed To Add File Hierarchy Information...", "");
  //           this.isSpinning = false;
  //         }
  //       });
  //     }
  //     // else {

  //     //   this.message.error(" Code Already Exist. Please Enter Other Code", "");
  //     //   this.isSpinning = false;
  //     // }
  //   // }
  // }
  isOk = false;
  @Input() IS_LAST;
  save(addNew: boolean, fileHierarchy: NgForm): void {
    // log
    if (this.IS_ADVANCE == true) {
      this.data.IS_ADVANCE = 'Y';
    } else {
      this.data.IS_ADVANCE = 'N';
    }
    if (this.IS_LAST == false) {
      this.data.IS_LAST = false;
    }

    if (this.IS_LAST == true) {
      this.data.IS_LAST = true;
    }
    this.isOk = true;
    if (this.data.PARENT_ID == null || this.data.PARENT_ID == undefined) {
      this.isOk = false;
      this.message.error('Please Select Parent.', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Name.', '');
    } else if (this.data.CODE == null || this.data.CODE.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Valid Short Code.', '');
    } else if (
      this.IS_ADVANCE == true &&
      (this.data.FINAL_HIRARCHY_ID == null ||
        this.data.FINAL_HIRARCHY_ID == undefined)
    ) {
      this.isOk = false;
      this.message.error('Please Select Final Hierarchy.', '');
    }
    // this.data.IS_LAST=this.data.IS_LAST
    if (this.isOk) {
      if (this.data.ID) {
        this.isSpinning = true;
        this.api.updateFilehierarchy(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'File Hierarchy information updated Successfully...',
              ''
            );
            if (!addNew) this.drawerClose();
            this.loadForms();
            this.reset(fileHierarchy);
            this.IS_ADVANCE = null;
            this.IS_LAST = null;
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed to update File Hierarchy information...',
              ''
            );
            this.isSpinning = false;
            this.IS_ADVANCE = null;
            this.IS_LAST = null;
          }
        });
      } else {
        this.isSpinning = true;
        this.api.createFilehierarchy(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.message.success(
              'File Hierarchy Information Added Successfully...',
              ''
            );
            if (!addNew) {
              this.drawerClose();
              this.IS_ADVANCE = null;
              this.IS_LAST = null;
              this.reset(fileHierarchy);
              this.loadForms();
            } else {
              this.data = new FileHierarchy();
              fileHierarchy.resetForm();
              this.reset(fileHierarchy);
              this.getallorg1();
              this.IS_LAST = null;
              this.IS_ADVANCE = null;
              this.loadForms();
            }
            this.isSpinning = false;
          } else {
            this.message.error(
              'Failed To Add File Hierarchy Information...',
              ''
            );
            this.isSpinning = false;
          }
        });
      }
    }
    this.loadForms();
  }
  close(fileHierarchy: NgForm) {
    // this.isSpinning=true;
    this.reset(fileHierarchy);
    this.drawerClose();
  }

  reset(fileHierarchy: NgForm) {
    // this.isSpinning = true;
    fileHierarchy.reset();
  }
}
