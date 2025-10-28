import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Medical/Service/api.service';

@Component({
  selector: 'app-nature',
  templateUrl: './nature.component.html',
  styleUrls: ['./nature.component.css'],
  providers: [NzNotificationService],
})
export class NatureComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  isAdmin: boolean = false;
  roleId: any;
  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));

    if (
      Number(sessionStorage.getItem('roleId')) != undefined &&
      (Number(sessionStorage.getItem('roleId')) == 46 ||
        Number(sessionStorage.getItem('roleId')) == 47 ||
        Number(sessionStorage.getItem('roleId')) == 48 ||
        Number(sessionStorage.getItem('roleId')) == 49 ||
        Number(sessionStorage.getItem('roleId')) == 50)
    ) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  @Input() drawerClose: Function;
  @Input() LTC7data: any;
  @Input() formdata7: any;
  @Input() passenger: any;
  close(): void {
    this.drawerClose();
  }

  openpdf() {
    const element = document.getElementById('nature');
    const opt = {
      margin: 0.2,
      filename: 'nature.pdf',
      image: { type: 'jpeg', quality: 7 },
      html2canvas: { scale: 7 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().from(element).set(opt).save();
  }

  loadingRecords = false;
  printOrderModalVisible: boolean = false;
  save() {
    this.loadingRecords = true;

    for (var i = 0; this.formdata7.length > i; i++) {
      this.formdata7[i]['TRAVEL_CLASS_NAME'] = undefined;
      this.formdata7[i]['TRAVEL_MODE_NAME'] = undefined;
      this.formdata7[i]['AMOUNT_OF_ADVANCE'] = undefined;
      this.formdata7[i]['CREATED_DATE_TIME'] = undefined;
      this.formdata7[i]['EMP_ID'] = undefined;
      this.formdata7[i]['IS_ADVANCE_TAKEN'] = undefined;
      this.formdata7[i]['IS_SANCTIONED'] = undefined;
      this.formdata7[i]['LEAVE_END_DATE'] = undefined;
      this.formdata7[i]['LEAVE_START_DATE'] = undefined;

      if (
        this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'] == null ||
        this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'] =
          this.formdata7[i]['CUTE_RCS_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'] == null ||
        this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'] =
          this.formdata7[i]['DEVELOPEMENT_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'] == null ||
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'] =
          this.formdata7[i]['USER_DEVELOPEMENT_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'] == null ||
        this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'] =
          this.formdata7[i]['AVIATION_SECURITY_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['GST_CLAIMED'] == undefined ||
        this.formdata7[i]['GST_CLAIMED'] == null ||
        this.formdata7[i]['GST_CLAIMED'] == '' ||
        this.formdata7[i]['GST_CLAIMED'] < 0
      ) {
        this.formdata7[i]['GST_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['GST_CLAIMED'] = this.formdata7[i]['GST_CLAIMED'];
      }

      if (
        this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'] == null ||
        this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'] =
          this.formdata7[i]['AIRPORT_SECURITY_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'] == null ||
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'] =
          this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'] == undefined ||
        this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'] == null ||
        this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'] == '' ||
        this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'] < 0
      ) {
        this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'] =
          this.formdata7[i]['PASSENGER_SERVICES_FEES_CLAIMED'];
      }

      if (
        this.formdata7[i]['OTHERS_CLAIMED'] == undefined ||
        this.formdata7[i]['OTHERS_CLAIMED'] == null ||
        this.formdata7[i]['OTHERS_CLAIMED'] == '' ||
        this.formdata7[i]['OTHERS_CLAIMED'] < 0
      ) {
        this.formdata7[i]['OTHERS_CLAIMED'] = 0;
      } else {
        this.formdata7[i]['OTHERS_CLAIMED'] =
          this.formdata7[i]['OTHERS_CLAIMED'];
      }

      if (
        this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'] == null ||
        this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'] =
          this.formdata7[i]['CUTE_RCS_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'] == null ||
        this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'] =
          this.formdata7[i]['DEVELOPEMENT_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'] == null ||
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'] =
          this.formdata7[i]['USER_DEVELOPEMENT_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'] == null ||
        this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'] =
          this.formdata7[i]['AVIATION_SECURITY_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['GST_ALLOWED'] == undefined ||
        this.formdata7[i]['GST_ALLOWED'] == null ||
        this.formdata7[i]['GST_ALLOWED'] == '' ||
        this.formdata7[i]['GST_ALLOWED'] < 0
      ) {
        this.formdata7[i]['GST_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['GST_ALLOWED'] = this.formdata7[i]['GST_ALLOWED'];
      }

      if (
        this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'] == null ||
        this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'] =
          this.formdata7[i]['AIRPORT_SECURITY_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'] == null ||
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'] =
          this.formdata7[i]['REGIONAL_CONNECTIVITY_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'] == undefined ||
        this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'] == null ||
        this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'] == '' ||
        this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'] < 0
      ) {
        this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'] =
          this.formdata7[i]['PASSENGER_SERVICES_FEES_ALLOWED'];
      }

      if (
        this.formdata7[i]['OTHERS_ALLOWED'] == undefined ||
        this.formdata7[i]['OTHERS_ALLOWED'] == null ||
        this.formdata7[i]['OTHERS_ALLOWED'] == '' ||
        this.formdata7[i]['OTHERS_ALLOWED'] < 0
      ) {
        this.formdata7[i]['OTHERS_ALLOWED'] = 0;
      } else {
        this.formdata7[i]['OTHERS_ALLOWED'] =
          this.formdata7[i]['OTHERS_ALLOWED'];
      }
    }

    this.api
      .updatebulkcal(this.formdata7, this.LTC7data.ID)
      .subscribe((successCode) => {
        if (successCode.code == '200') {
          this.message.success('Information updated Successfully', '');

          this.api
            .ltcJourneyDetail(
              0,
              0,
              '',
              'asc',
              ' AND LTC_ID =' + this.LTC7data.ID
            )
            .subscribe((data) => {
              if (data['code'] == 200) {
                this.formdata7 = data['data'];
                this.loadingRecords = false;
                this.printOrderModalVisible = true;
              }
            });
        } else {
          this.message.error('Information Not Saved', '');
          this.loadingRecords = false;
        }
      });
  }

  previewOnly() {
    this.printOrderModalVisible = true;
  }
  getwidth() {
    if (window.innerWidth <= 400) {
      return 400;
    } else {
      return 850;
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  gstcost = 0;
  getgstamount(i: any) {
    this.gstcost = 0;
    if (this.formdata7 != undefined && this.formdata7[i].FAIR_PAID != undefined)
      this.gstcost = (this.formdata7[i].FAIR_PAID * 12) / 100;

    return this.gstcost;
  }

  gsttotal = 0;
  gettotal(i: any) {
    // this.gsttotal = 0;
    this.formdata7[i].ALLOWED_TOTAL = 0;

    if (
      this.formdata7 != undefined &&
      this.formdata7[i].CUTE_RCS_FEES_ALLOWED != undefined &&
      this.formdata7[i].DEVELOPEMENT_FEES_ALLOWED != undefined &&
      this.formdata7[i].USER_DEVELOPEMENT_FEES_ALLOWED != undefined &&
      this.formdata7[i].AVIATION_SECURITY_FEES_ALLOWED != undefined &&
      this.formdata7[i].GST_ALLOWED != undefined &&
      this.formdata7[i].AIRPORT_SECURITY_FEES_ALLOWED != undefined &&
      this.formdata7[i].REGIONAL_CONNECTIVITY_FEES_ALLOWED != undefined &&
      this.formdata7[i].PASSENGER_SERVICES_FEES_ALLOWED != undefined &&
      this.formdata7[i].OTHERS_ALLOWED != undefined
    ) {
      this.formdata7[i].ALLOWED_TOTAL =
        Number(this.formdata7[i].CUTE_RCS_FEES_ALLOWED) +
        Number(this.formdata7[i].DEVELOPEMENT_FEES_ALLOWED) +
        Number(this.formdata7[i].USER_DEVELOPEMENT_FEES_ALLOWED) +
        Number(this.formdata7[i].AVIATION_SECURITY_FEES_ALLOWED) +
        Number(this.formdata7[i].GST_ALLOWED) +
        Number(this.formdata7[i].AIRPORT_SECURITY_FEES_ALLOWED) +
        Number(this.formdata7[i].REGIONAL_CONNECTIVITY_FEES_ALLOWED) +
        Number(this.formdata7[i].PASSENGER_SERVICES_FEES_ALLOWED) +
        Number(this.formdata7[i].OTHERS_ALLOWED);
    }

    return this.formdata7[i].ALLOWED_TOTAL;
  }
  gettotal1(i) {
    if (
      this.formdata7[i].FAIR_PAID != undefined &&
      this.formdata7[i].FAIR_PAID != null
    ) {
      this.formdata7[i].AMOUNT_WITH_TAX =
        Number(this.formdata7[i].ALLOWED_TOTAL) +
        Number(this.formdata7[i].FAIR_PAID);
    }
    return this.formdata7[i].AMOUNT_WITH_TAX;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  gettotalclaimed(i: any) {
    // this.gsttotal = 0;
    this.formdata7[i].CLAIMED_TOTAL = 0;

    if (
      this.formdata7 != undefined &&
      this.formdata7[i].CUTE_RCS_FEES_CLAIMED != undefined &&
      this.formdata7[i].DEVELOPEMENT_FEES_CLAIMED != undefined &&
      this.formdata7[i].USER_DEVELOPEMENT_FEES_CLAIMED != undefined &&
      this.formdata7[i].AVIATION_SECURITY_FEES_CLAIMED != undefined &&
      this.formdata7[i].GST_CLAIMED != undefined &&
      this.formdata7[i].AIRPORT_SECURITY_FEES_CLAIMED != undefined &&
      this.formdata7[i].REGIONAL_CONNECTIVITY_FEES_CLAIMED != undefined &&
      this.formdata7[i].PASSENGER_SERVICES_FEES_CLAIMED != undefined &&
      this.formdata7[i].OTHERS_CLAIMED != undefined
    ) {
      this.formdata7[i].CLAIMED_TOTAL =
        Number(this.formdata7[i].CUTE_RCS_FEES_CLAIMED) +
        Number(this.formdata7[i].DEVELOPEMENT_FEES_CLAIMED) +
        Number(this.formdata7[i].USER_DEVELOPEMENT_FEES_CLAIMED) +
        Number(this.formdata7[i].AVIATION_SECURITY_FEES_CLAIMED) +
        Number(this.formdata7[i].GST_CLAIMED) +
        Number(this.formdata7[i].AIRPORT_SECURITY_FEES_CLAIMED) +
        Number(this.formdata7[i].REGIONAL_CONNECTIVITY_FEES_CLAIMED) +
        Number(this.formdata7[i].PASSENGER_SERVICES_FEES_CLAIMED) +
        Number(this.formdata7[i].OTHERS_CLAIMED);
    }

    return this.formdata7[i].CLAIMED_TOTAL;
  }

  gettotalallowedandbase(i: any) {
    this.formdata7[i].TOTAL_BASE_ALLOWED = 0;
    if (
      this.formdata7 != undefined &&
      this.formdata7[i].ALLOWED_TOTAL != undefined
    ) {
      this.formdata7[i].TOTAL_BASE_ALLOWED =
        Number(this.formdata7[i].ALLOWED_TOTAL) +
        Number(this.formdata7[i].FAIR_PAID);
    }

    return this.formdata7[i].TOTAL_BASE_ALLOWED;
  }
  alltabestotal = 0;
  getalltabestotal() {
    this.alltabestotal = 0;
    if (this.formdata7 != undefined) {
      for (let j = 0; j < this.formdata7.length; j++) {
        this.alltabestotal =
          Number(this.alltabestotal) +
          Number(this.formdata7[j].TOTAL_BASE_ALLOWED);
      }
    }

    return this.alltabestotal;
  }
}
