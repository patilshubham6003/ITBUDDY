import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { DDOMaster } from 'src/app/Modal/ddoMaster';

export class InnerInwardMaster {
  ID: number;
  SIGNATURE_ID: any;
  SIGNATURE_NAME: any;
}

@Component({
  selector: 'app-managesignedit',
  templateUrl: './managesignedit.component.html',
  styleUrls: ['./managesignedit.component.css'],
})
export class ManagesigneditComponent {
  isSpinning = false;
  @Input() drawerClose!: Function;
  @Input() data: DDOMaster;
  @Input() drawerVisible: boolean = false;
  @Input() SignatureData: any;
  Signatureitemload: boolean = false;
  totaldata = 1;
  data2 = new InnerInwardMaster();
  Signaturedata: any = [];
  loadingRecords: any;
  INNERTABLEDATA: any = new InnerInwardMaster();
  index = -1;
  ddoid: any = sessionStorage.getItem('ddoId');
  @Input()
  HEAD_OF_OFFICE: any;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  floatpat = /^[+-]?([0-9]*[.])?[0-9]+$/;
  mobpattern = /^[6-9]\d{9}$/;
  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.loadSignatures();
  }

  loadSignatures() {
    this.Signatureitemload = true;
    // change get
    this.api
      .getSignature(
        0,
        0,
        '',
        '',
        ' AND STATUS!=false AND  DDO_ID=' + this.ddoid + ' OR DDO_ID=0'
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Signaturedata = data['data'];
            this.Signatureitemload = false;
          } else {
            this.Signatureitemload = false;
            this.Signaturedata = [];
          }
          this.Signatureitemload = false;
        },
        (err) => {
          this.Signatureitemload = false;
        }
      );
  }
  close(): void {
    this.drawerClose();
  }

  resetDrawer(designation: NgForm) {
    this.data = new DDOMaster();
    this.SignatureData = [];
    designation.form.markAsPristine();
    designation.form.markAsUntouched();
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

  floatomit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 31 &&
      (charCode < 48 || charCode > 57) &&
      (charCode < 46 || charCode > 46)
    ) {
      return false;
    }
    return true;
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  namechange(data) {
    this.HEAD_OF_OFFICE = this.data.HEAD_OF_OFFICE;
  }
  dupplicate = true;

  selectchange2(key: any) {
    let name;
    if (key != null || key != undefined) {
      this.dupplicate = true;
      for (let i = 0; i < this.SignatureData.length; i++) {
        if (key == this.SignatureData[i].SIGNATURE_ID) {
          this.message.warning('Signature Already Exists ', '');
          this.data2.SIGNATURE_ID = null;
          this.data2.SIGNATURE_NAME = null;
          this.dupplicate = false;
        } else {
        }
      }

      if (this.dupplicate) {
        var obj = this.Signaturedata.filter((obj) => obj.ID == key);
        this.data2.SIGNATURE_NAME = obj[0].NAME;
      } else {
        this.data2.SIGNATURE_ID = '';
      }
    }
  }

  addData(addNew: boolean, form2: NgForm) {
    var isOK = true;
    this.isSpinning = false;

    if (
      this.data2.SIGNATURE_ID == null ||
      this.data2.SIGNATURE_ID == undefined ||
      this.data2.SIGNATURE_ID <= 0
    ) {
      isOK = false;
      this.message.error('Please Select Signature ', '');
    }
    this.dupplicate = true;
    if (isOK) {
      if (this.SignatureData.length > 0) {
      }
    }
    let nextID = 1;

    if (this.dupplicate && isOK) {
      this.INNERTABLEDATA = {
        ID: nextID++,
        SIGNATURE_ID: this.data2.SIGNATURE_ID,
        SIGNATURE_NAME: this.data2.SIGNATURE_NAME,
      };
      if (this.index > -1) {
        this.SignatureData[this.index] = this.INNERTABLEDATA;
      } else {
        this.SignatureData.push(this.INNERTABLEDATA);
      }

      this.SignatureData = [...[], ...this.SignatureData];
      this.index = -1;
      this.totaldata = this.SignatureData.length;
      // this.editdata = false;
      form2.form.reset();
    }
  }

  delete(data: any, index: number): void {
    this.SignatureData.splice(index, 1);
    this.SignatureData = [...[], ...this.SignatureData];
  }

  cancel(): void { }

  save(addNew: boolean, designation: NgForm): void {
    this.isOk = true;
    if (
      this.data.HEAD_OF_OFFICE == '' &&
      this.data.LOCATION == '' &&
      this.data.SEQ_NO <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Fill All Required Information', '');
    } else if (
      this.data.HEAD_OF_OFFICE == '' ||
      this.data.HEAD_OF_OFFICE == null ||
      this.data.HEAD_OF_OFFICE == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Head Of Office ', '');
    } else if (
      this.data.LOCATION == '' ||
      this.data.LOCATION == null ||
      this.data.LOCATION == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Location ', '');
    } else if (
      this.data.SEQ_NO <= 0 ||
      this.data.SEQ_NO == null ||
      this.data.SEQ_NO == undefined
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number ', '');
    } else if (this.SignatureData.length == 0) {
      this.isOk = false;
      this.message.error(' Please Map Signature ', '');
    } else if (this.isOk) {
      const signatureIds = this.SignatureData.map(
        (signature) => signature.SIGNATURE_ID
      );

      this.data['SIGNATURE_IDS'] = signatureIds.join(', ');
      if (
        this.data.POSITION_NO == '' ||
        this.data.POSITION_NO == null ||
        this.data.POSITION_NO == undefined
      ) {
        this.data.POSITION_NO = null;
      } else {
        this.data.POSITION_NO = this.data.POSITION_NO;
      }
      if (
        this.data.MOBILE_NO == '' ||
        this.data.MOBILE_NO == null ||
        this.data.MOBILE_NO == undefined
      ) {
        this.data.MOBILE_NO = null;
      } else {
        this.data.MOBILE_NO = this.data.MOBILE_NO;
      }
      if (
        this.data.PR_CCIT == '' ||
        this.data.PR_CCIT == null ||
        this.data.PR_CCIT == undefined
      ) {
        this.data.PR_CCIT = null;
      } else {
        this.data.PR_CCIT = this.data.PR_CCIT;
      }
      if (
        this.data.DESCRIPTION == '' ||
        this.data.DESCRIPTION == null ||
        this.data.DESCRIPTION == undefined
      ) {
        this.data.DESCRIPTION = null;
      } else {
        this.data.DESCRIPTION = this.data.DESCRIPTION;
      }
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateDDO(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');

            sessionStorage.setItem(
              'SIGNATURE_IDS',
              this.data['SIGNATURE_IDS'].toString()
            );
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createDDO(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new DDOMaster();
              this.resetDrawer(designation);
              this.api.getAllDDOs(0, 0, '', 'desc', '').subscribe(
                (data) => {
                  if (data['count'] == 0) {
                    this.data.SEQ_NO = 1;
                  } else {
                    this.data.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
                  }
                },
                (err) => { }
              );
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  opensignature() {
    this.drawerVisiblesign = true;
  }
  drawerVisiblesign: boolean = false;

  drawerClosesign(): void {
    this.drawerVisiblesign = false;

    this.api
    .getSignature(
      0,
      0,
      '',
      '',
      ' AND STATUS!=false AND  DDO_ID=' + this.ddoid + ' OR DDO_ID=0'
    )
    .subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Signaturedata = data['data'];
          
          if(sessionStorage.getItem('signaturedata')){
            let nextID=1
            var ddd=this.Signaturedata.find(x=>x.ID==Number(sessionStorage.getItem('signaturedata')));
            this.data2.SIGNATURE_ID=ddd.ID;
            this.data2.SIGNATURE_NAME=ddd.NAME;
            this.INNERTABLEDATA = {
              ID: nextID++,
              SIGNATURE_ID: this.data2.SIGNATURE_ID,
              SIGNATURE_NAME: this.data2.SIGNATURE_NAME,
            };

              this.SignatureData.push(this.INNERTABLEDATA);
              sessionStorage.removeItem('signaturedata');
            this.SignatureData = [...[], ...this.SignatureData];
         
            this.totaldata = this.SignatureData.length;
          }
          
          this.data2.SIGNATURE_ID=''
          this.data2.SIGNATURE_NAME=''
          this.Signatureitemload = false;
        } else {
          this.Signatureitemload = false;
          this.Signaturedata = [];
        }
        this.Signatureitemload = false;
      },
      (err) => {
        this.Signatureitemload = false;
      }
    );
  }
  get closeCallback() {
    return this.drawerClosesign.bind(this);
  }
}
