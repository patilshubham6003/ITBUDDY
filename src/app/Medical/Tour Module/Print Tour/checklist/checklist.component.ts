import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TourSignatureMapData } from 'src/app/Medical/Models/TourSignatures';
import { Tourmaster } from 'src/app/Medical/Models/Tourmaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css'],
})
export class ChecklistComponent implements OnInit {
  @Input() drawerClose: any;
  @Input() SignatureMapCheckList: any;
  @Input() checklist: Tourmaster;
  @Input() checklistyesno: any;
  @Input() SECTION_TYPE: any;
  @Input() SIGNNAME: any;
  @Input() NAME_HN: any;
  @Input() OFFICE_NAME: any;
  @Input() OFFICE_NAME_HN: any;
  @Input() POST: any;
  @Input() POST_HN: any;

  //   SECTION_TYPE: any;
  // SIGNNAME: any;
  // NAME_HN: any;
  // OFFICE_NAME: any;
  // OFFICE_NAME_HN: any;
  // POST: any;
  // POST_HN: any;

  isAdmin: boolean = false;
  SIGNATURE_ID: any;
  pdfDownload: boolean = false;
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}

  isVisible = false;
  loadingRecords: boolean = false;
  GET_SIGNATURE_IDS: any;

  ngOnInit(): void {
    this.GET_SIGNATURE_IDS = sessionStorage.getItem('SIGNATURE_IDS');

    this.getAllUsers();
    if (
      (Number(sessionStorage.getItem('roleId')) != undefined &&
        Number(sessionStorage.getItem('roleId')) == 47) ||
      Number(sessionStorage.getItem('roleId')) == 46 ||
      Number(sessionStorage.getItem('roleId')) == 48 ||
      Number(sessionStorage.getItem('roleId')) == 49 ||
      Number(sessionStorage.getItem('roleId')) == 50
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  orderBtn() {
    this.isVisible = true;
  }

  close(): void {
    this.drawerClose();
  }

  download() {}

  print() {}
  printOrderModalVisible = false;
  showmodal() {
    if (!this.isAdmin) {
      var isOk = true;
      // if (
      //   this.SignatureMapCheckList.TOUR_CHECKLIST_SIGNATURE_1 === undefined ||
      //   this.SignatureMapCheckList.TOUR_CHECKLIST_SIGNATURE_1 === null
      // ) {
      //   isOk = false;
      //   this.message.error('Please Select Signature 1', '');
      // }

      if (isOk) {
        this.api.updatetour(this.checklist).subscribe((successCode) => {
          if (successCode.code === 200) {
            if (this.SignatureMapCheckList.ID) {
              this.api
                .UpdatetourSignature(this.SignatureMapCheckList)
                .subscribe((successCode) => {
                  if (successCode.code === 200) {
                    this.message.success(
                      'Information Updated Successfully',
                      ''
                    );
                    this.printOrderModalVisible = true;
                    this.getData();
                  } else {
                    this.message.error('Failed To Update Information', '');
                    this.printOrderModalVisible = false;
                  }
                });
            } else {
              this.SignatureMapCheckList.TOUR_ID = this.checklist.ID;

              this.api
                .CreatetourSignature(this.SignatureMapCheckList)
                .subscribe((response) => {
                  if (response.code === 200) {
                    this.message.success('Information Saved Successfully', '');
                    this.printOrderModalVisible = true;
                    this.getData();
                  } else {
                    this.message.error('Failed to Save Information', '');
                    this.printOrderModalVisible = false;
                  }
                });
            }
          } else {
            this.message.error('Information Has Not Saved...', '');
          }
        });
      }
    } else {
      this.printOrderModalVisible = true;
    }
  }
  getData() {
    this.api
      .GettourSignature(0, 0, '', 'asc', ' AND TOUR_ID =' + this.checklist.ID)
      .subscribe((data) => {
        if (data['code'] === 200 && data['data'] && data['data'].length > 0) {
          this.SignatureMapCheckList = data['data'][0];
        } else {
          this.SignatureMapCheckList = new TourSignatureMapData();
        }
      });
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }
  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }
  openpdf() {
    const element = document.getElementById('excel-table');
    const opt = {
      margin: 0.2,
      filename: 'Checklist.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  Signaturearray: any = [];
  getAllUsers() {
    this.api
      .getSignature(
        0,
        0,
        'ID',
        'desc',
        // 'AND STATUS!=false AND ID in(' + this.GET_SIGNATURE_IDS + ')'
        ' AND STATUS = 1 AND DDO_ID=' + Number(sessionStorage.getItem('ddoId'))
      )
      .subscribe(
        (data) => {
          if (data['code'] === 200) {
            this.Signaturearray = data['data'];

            if (this.Signaturearray.length > 0) {
              if (this.SignatureMapCheckList['TOUR_CHECKLIST_SIGNATURE_1']) {
                const abc = Number(
                  this.SignatureMapCheckList['TOUR_CHECKLIST_SIGNATURE_1']
                );
                this.signature(abc);
              }
            }
          }
        },
        (err) => {}
      );
  }
  signatureData: any = [];
  Name = '';
  signature(event: any) {
    if (event !== undefined && event !== null && event !== '') {
      var f = this.Signaturearray.filter((item) => item.ID == event);

      this.SECTION_TYPE = f[0]['SECTION_TYPE'];
      this.SIGNNAME = f[0]['NAME'];
      this.NAME_HN = f[0]['NAME_HN'];
      this.OFFICE_NAME = f[0]['OFFICE_NAME'];
      this.OFFICE_NAME_HN = f[0]['OFFICE_NAME_HN'];
      this.POST = f[0]['POST'];
      this.POST_HN = f[0]['POST_HN'];
    } else {
      this.SECTION_TYPE = '';
      this.SIGNNAME = '';
      this.NAME_HN = '';
      this.OFFICE_NAME = '';
      this.OFFICE_NAME_HN = '';
      this.POST = '';
      this.POST_HN = '';
    }
  }

  drawerVisiblesign: boolean = false;
  opensignature() {
    this.drawerVisiblesign = true;
  }

  drawerClosesign(): void {
    this.drawerVisiblesign = false;
    this.getAllUsers();
  }
  get closeCallbacksign() {
    return this.drawerClosesign.bind(this);
  }
}
