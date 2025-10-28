import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { FlatOrderMaster } from '../FlatOrder';
import * as html2pdf from 'html2pdf.js';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-flat-order-drawer',
  templateUrl: './flat-order-drawer.component.html',
  styleUrls: ['./flat-order-drawer.component.css'],
})
export class FlatOrderDrawerComponent {
  isSpinning: boolean = false;
  @Input()
  drawerVisible: boolean = false;
  @Input() drawerClose!: Function;
  @Input() data: any = FlatOrderMaster;
  @Input() flatList: any;
  currentDate: any = new Date();
  userid: any;
  roleid: any;
  inspectorname: any = '';
  filtergignatureid: any;
  constructor(
    private api: APIServicesService,
    private message: NzNotificationService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.userid = sessionStorage.getItem('userId');
    this.roleid = sessionStorage.getItem('roleId');
    this.filtergignatureid = ' AND SERVICE_ID = 5 ';
    this.getsignaturedata();
    if (this.roleid == 15) {
      this.api
        .getAllUsers(0, 0, 'ID', 'desc', ' AND ID = ' + this.userid)
        .subscribe(
          (value) => {
            if (value.code == 200) {
              if (value['data'].length > 0) {
                let inspectordata = value['data'][0];
                this.inspectorname = inspectordata['NAME'];
              }
            } else {
              console.error('Something Went Wrong..');
            }
          },
          (error) => {
            console.error(error, 'Something Went Wrong..');
          }
        );
    }
    // this.search(true);
  }
  orderDocumentURL: any;
  onFileSelectedOrderFile(event: any) {
    // if (this.data.FILE_TYPE == 'PDF') {

    if (event.target.files[0].type == 'application/pdf') {
      this.isSpinning = true;
      this.orderDocumentURL = <File>event.target.files[0];

      if (this.orderDocumentURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.orderDocumentURL.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url: any = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        if (
          this.data.FILE_URL != undefined &&
          this.data.FILE_URL.trim() != ''
        ) {
          var arr = this.data.FILE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.api
        .onUpload('flatVacantOrder', this.orderDocumentURL, url)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.FILE_URL = url;
            // this.data.ASSUMPTION_CHARGE_STATUS = '';
            this.updatecall();
            // this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;

            // this.data.FILE_URL = url;
            //
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.orderDocumentURL = null;
      this.data.FILE_URL = null;
    }
  }
  Signaturelist: any = [];
  DefaultSignature: any = [];

  getsignaturedata() {
    this.api
      .getSignature(0, 0, 'ID', 'desc', this.filtergignatureid)
      // this.filtergignatureid + ' AND USER_ID =' + this.userid
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.Signaturelist = data['data'];

            for (let i = 0; i < this.Signaturelist.length; i++) {
              if (
                data['data'][i]['USER_ID'] ==
                Number(sessionStorage.getItem('userId'))
              ) {
                this.DefaultSignature = data['data'][i]['NAME'];
              }
            }
          } else {
            console.error('someting went wrong');
          }
        },
        (error) => { }
      );
  }
  updatecall() {
    this.data.APPROVER_ID = Number(sessionStorage.getItem('userId'));
    this.data.IS_PUBLISH = 0;
    this.data.PUBLISH_DATE_TIME = this.datepipe.transform(
      new Date(),
      'yyyy-MM-dd HH:mm:ss'
    );
    this.isSpinning = true;
    this.api.updateFlatOrder(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.isSpinning = false;
        this.message.success('File Uploaded Successfully...', '');
        // this.printOrderModalVisible = false;
      } else {
        this.message.error('Information Has Not Saved...', '');
        this.isSpinning = false;
      }
    });
  }
  publish() {
    this.isSpinning = true;
    if (
      this.data.FILE_URL != null &&
      this.data.FILE_URL != undefined &&
      this.data.FILE_URL != ''
    ) {
      this.data.APPROVER_ID = Number(sessionStorage.getItem('userId'));
      this.data.IS_PUBLISH = 1;

      this.data.PUBLISH_DATE_TIME = this.datepipe.transform(
        new Date(),
        'yyyy-MM-dd HH:mm:ss'
      );
      this.data['RESIDENCE_TYPE_ID'] = this.flatList;
      this.api.updateFlatOrder(this.data).subscribe((successCode) => {
        if (successCode.code == '200') {
          this.isSpinning = false;
          this.message.success('List Published...', '');
          this.drawerClose();
          // this.printOrderModalVisible = false;
        } else {
          this.message.error('Information Has Not Saved...', '');
          this.isSpinning = false;
        }
      });
    } else {
      this.message.error('Please First Upload The Signed Copy Of Order', '');
      this.isSpinning = false;
    }
  }

  close(): void {
    this.drawerClose();
  }

  viewOrderPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + 'flatVacantOrder/' + pdfURL);
  }


  generatePDF() {
    const element = document.getElementById('flatOrder');
    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();

    html2pdf().from(element).set(opt).outputPdf().then(function (pdf) {
      // This logs the right base64   
      // sessionStorage.setItem('pdf', btoa(pdf));
      sessionStorage.setItem('pdf', btoa(pdf));
      //  const ff=btoa(pdf);
      //  onFileSelectedOrderFile(btoa(pdf));

    });
    setTimeout(() => {
      // this.onFileSelectedOrderFile(sessionStorage.getItem('pdf'));
      var url = '234534534sdc.pdf'
      this.api
        .onUploaddfdf('flatVacantOrder', sessionStorage.getItem('pdf'), url)
        .subscribe((successCode) => {
          if (successCode.code == '200') {
            this.data.FILE_URL = url;
            // this.data.ASSUMPTION_CHARGE_STATUS = '';
            // this.updatecall();
            // this.message.success('File Uploaded Successfully...', '');
            this.isSpinning = false;

            // this.data.FILE_URL = url;
            //
          } else {
            this.message.error('Failed To Save File...', '');
            this.isSpinning = false;
          }
        });
    }, 9000);

    //   try {
    //     html2pdf()
    //         .from(element)
    //         .set(opt)
    //         .toPdf()
    //         .output('datauristring')
    //         .then((pdfDataUri: string) => {
    //             // Call method to upload PDF
    //             this.onFileSelectedOrderFile(pdfDataUri);
    //         });
    // } catch (error) {
    //     console.error("Error generating PDF:", error);
    // }
  }

  // generatePDF(): void {
  //   const element = document.getElementById('flatOrder');
  //   if (element) {
  //     const pdf = new jsPDF('p', 'in', 'letter');
  //     pdf.html(element, {
  //       callback: (pdf) => {
  //         pdf.save('Download.pdf');
  //         const pdfDataUri = pdf.output('datauristring');
  //         // Call method to upload PDF
  //         this.onFileSelectedOrderFile(pdfDataUri);
  //       }
  //     });
  //   } else {
  //     console.error('Element with id "flatOrder" not found.');
  //   }
  // }

  generasdsdtePDF() {
    const element = document.getElementById('flatOrder');
    if (!element) {
      console.error('Element with ID "flatOrder" not found.');
      return;
    }

    const opt = {
      margin: 0.2,
      filename: 'Download.pdf',
      image: { type: 'jpeg', quality: 5 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).outputPdf().then(function (pdf) {
    });
  }
  async wdsd(): Promise<void> {
    try {
      const element = document.getElementById('flatOrder');
      if (!element) {
        console.error('Element with ID "flatOrder" not found.');
        return;
      }

      const opt = {
        margin: 0.2,
        filename: 'Download.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
      const pdf = await html2pdf().from(element).set(opt).toPdf().output('blob');


      const successCode: any = await this.api.onUpload('flatVacantOrder', '', 'Download.pdf');
      if (successCode && successCode.code === '200') {

        this.message.success('PDF uploaded successfully.', '');
      } else {
        console.error('Failed to upload PDF. Error:', successCode);
        this.message.error('Failed to upload PDF.', '');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      this.message.error('An error occurred.', '');
    }
  }
}