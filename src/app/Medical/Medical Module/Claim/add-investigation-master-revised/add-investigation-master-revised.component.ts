import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as html2pdf from 'html2pdf.js';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { InvestigationMaster } from 'src/app/Medical/Models/InvestigationMaster';
import { ApiService } from 'src/app/Medical/Service/api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-investigation-master-revised',
  templateUrl: './add-investigation-master-revised.component.html',
  styleUrls: ['./add-investigation-master-revised.component.css'],
})
export class AddInvestigationMasterRevisedComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private api: ApiService
  ) {}
  additionalChange = 0;
  countt: any;
  @Input() total: any = 0;
  @Input() total1: any = 0;
  // @Input() citylist: any = [];
  citylist: any = [];
  @Input() CLAIM_ID: any;
  @Input() drawerClose: Function;
  @Input() data: InvestigationMaster;
  @Input() claimData: any;
  @Input() hospitallist: any = [];
  Cities: InvestigationMaster[];
  isSpinning = false;
  Names = InvestigationMaster;
  isOk: boolean = false;
  isVisible: boolean = false;
  TYPE: string = 'I';
  PACKAGE_RATE: number = 0;
  procedureList2: any = [];
  @Input() showlayoutDataList: any = [];
  city = '';
  currentDate = new Date('27-10-2022');
  CITY_ID = 0;
  procedureList: any = [];
  fileName: string = "Annexure 'A'";
  pdfDownload: boolean = false;
  procedureLoading: boolean = false;
  packages: any = [];
  userName = sessionStorage.getItem('userName');

  @Input() advanceAdmissible: any;
  isAdmin: boolean = false;
  roleId: any;

  editorConfigPrepared: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Prepared By',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };
  editorConfigChecked: AngularEditorConfig = {
    editable: true,
    height: '50',
    minHeight: '50',
    maxHeight: '50',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter Checked By',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
  };

  ngOnInit(): void {
    this.roleId = Number(sessionStorage.getItem('roleId'));
    this.allCityList();
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

  pageSize = 50;
  currentPage = 1;
  cityLoader = false;
  tempCount: any = 0;

  onScroll(event) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.currentPage++;
      if (this.tempCount == this.citylist.length) {
        this.message.info('All City Load', '');
      } else {
        this.loadCityData();
      }
    }
  }

  loadCityData() {
    if (!this.cityLoader) {
      this.currentPage = +this.currentPage;

      this.cityLoader = true;
      this.api
        .getCityMaster(
          this.currentPage,
          this.pageSize,
          'NAME',
          'ASC',
          ' AND STATUS = 1'
        )
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              const newData = data['data'];
              // this.employee = data['data'];
              this.tempCount = data['count'];
              this.citylist = [...this.citylist, ...newData];
              // this.filteredOptions = this.citylist;
            } else {
              this.message.error("Can't Load City Data", '');
            }
            this.cityLoader = false;
          },
          (err) => {
            this.cityLoader = false;
          }
        );
    }
  }
  allCityList() {
    this.cityLoader = true;
    this.tempCount = 0;
    this.api.getCityMaster(1, 50, 'NAME', 'ASC', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.citylist = data['data'];
          this.tempCount = data['count'];
          // this.filteredOptions = this.employee;
          this.cityLoader = false;
        } else {
          this.message.error("Can't Load City Data", '');
          this.cityLoader = false;
          // this.employee = [];
          this.tempCount = 0;
          // this.filteredOptions = [];
        }
      },
      (err) => {}
    );
  }

  searchCity(event: any) {
    var f = '';
    if (
      event != null &&
      event != undefined &&
      event != '' &&
      event.target.value.length != 0
    ) {
      if (event.target.value.length >= 3) {
        this.cityLoader = true;
        this.api
          .getCityMaster(
            0,
            0,
            'NAME',
            'ASC',
            " AND NAME like '%" + event.target.value + "%'" + f
          )
          .subscribe(
            (cityData) => {
              if (cityData['code'] == 200) {
                var filteredOptions = [];
                filteredOptions = cityData['data'];
                this.citylist = filteredOptions;
                this.cityLoader = false;
              } else {
                this.message.error("Can't Load Employee Data", '');
                this.cityLoader = false;
              }
            },
            (err) => {}
          );
      } else {
      }
    } else {
      this.citylist = [];
      this.loadCityData();
    }
  }

  setType(event: any) {
    this.data.IS_PACKAGE = event;
    if (this.data.IS_PACKAGE == true) {
      this.data.TYPE = 'P';
      this.setAmount();
    } else {
      this.changePerc(0);
      this.data.TYPE = 'I';
    }
  }

  setDiscount(event: any) {
    this.data.IS_DISCOUNT_APPLIED = event;
    this.data.CLAIMED_AMOUNT = 0;
    this.data.DESCRIPTION = '';
    this.data.ADMISSIBLE_AMOUNT = 0;
  }

  setAmount() {
    var FINALE_AMOUNT = this.data.RATE * this.data.QTY;

    if (
      this.data.SHORT_CODE != null &&
      this.data.SHORT_CODE.includes('2002') &&
      this.city.includes('mumbai')
    ) {
      this.data.FINALE_AMOUNT = FINALE_AMOUNT + (25 / 100) * FINALE_AMOUNT;
      this.additionalChange = 25; // if (this.currentDate <= new Date(this.claimData.BILL_FILIING_DATE)) {
      if (this.claimData.WARD_TYPE == 'G') {
        this.data.ADMISSIBLE_AMOUNT =
          this.data.FINALE_AMOUNT - (10 / 100) * this.data.FINALE_AMOUNT;
        this.data.CHANGE = -10;
      } else if (this.claimData.WARD_TYPE == 'P') {
        this.data.ADMISSIBLE_AMOUNT =
          this.data.FINALE_AMOUNT + (15 / 100) * this.data.FINALE_AMOUNT;
        this.data.CHANGE = 15;
      } else {
        this.data.ADMISSIBLE_AMOUNT = this.data.FINALE_AMOUNT;
        this.data.CHANGE = 0;
      } // }
    } else {
      this.additionalChange = 0;
      this.data.FINALE_AMOUNT = FINALE_AMOUNT;
      if (this.claimData.WARD_TYPE == 'G') {
        this.data.ADMISSIBLE_AMOUNT =
          this.data.FINALE_AMOUNT - (10 / 100) * this.data.FINALE_AMOUNT;
        this.data.CHANGE = -10;
      } else if (this.claimData.WARD_TYPE == 'P') {
        this.data.ADMISSIBLE_AMOUNT =
          this.data.FINALE_AMOUNT + (15 / 100) * this.data.FINALE_AMOUNT;
        this.data.CHANGE = 15;
      } else {
        this.data.ADMISSIBLE_AMOUNT = this.data.FINALE_AMOUNT;
        this.data.CHANGE = 0;
      }
    }
  }
  HOSPITAL_TYPE = '';
  @Input() ACCREDITATION = '';
  setHospital(event: any) {
    if (event) {
      this.data.CLAIM_HOSPITAL_MAPPING_ID = event;
      var h: any = this.hospitallist.filter((obj) => {
        return obj.ID == event;
      });

      this.HOSPITAL_TYPE = h[0]['TYPE'];
      this.ACCREDITATION = h[0]['ACCREDATION'];

      if (
        this.data.INVESTIGATION_PROCEDURE_ID != undefined &&
        this.data.INVESTIGATION_PROCEDURE_ID != null
      ) {
        this.peocedureRate(this.data.INVESTIGATION_PROCEDURE_ID);
      }
    } else {
    }
  }

  setCity(event: any) {
    this.CITY_ID = event;
    this.procedureList2 = [];
  }

  changeRateData(event: any) {
    this.data.RATE = event;
    if (this.data.IS_PACKAGE == true) {
      this.setAmount();
    } else {
      this.changePerc(0);
    }
  }

  changeQtyData(event: any) {
    this.data.QTY = event;
    if (this.data.IS_PACKAGE == true) {
      this.setAmount();
    } else {
      this.changePerc(0);
    }
  }

  cityID;
  hospitalID = 0;
  pakagedata(investigationMaster: NgForm) {
    this.isOk = true;

    if (
      this.data.IS_DISCOUNT_APPLIED != undefined &&
      this.data.IS_DISCOUNT_APPLIED == true
    ) {
      if (this.data.DESCRIPTION == undefined || this.data.DESCRIPTION == '') {
        this.isOk = false;
        this.message.error('Please Enter Description', '');
      }
      if (this.data.CLAIMED_AMOUNT == undefined) {
        this.isOk = false;
        this.message.error('Please Enter Claimed Amount', '');
      }
      // this.data.ADMISSIBLE_AMOUNT = 0;
    } else {
      if (
        this.data.CLAIM_HOSPITAL_MAPPING_ID == undefined ||
        this.data.CLAIM_HOSPITAL_MAPPING_ID == null ||
        this.data.CLAIM_HOSPITAL_MAPPING_ID == 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Hospital', '');
      } else if (
        this.data.PARTICULARS == undefined ||
        this.data.PARTICULARS == null
      ) {
        this.isOk = false;
        this.message.error('Please Enter Bill Item Name/ Particulars', '');
      } else if (
        this.data.INVESTIGATION_PROCEDURE_ID == undefined ||
        this.data.INVESTIGATION_PROCEDURE_ID < 0
      ) {
        this.isOk = false;
        this.message.error('Please Select Investigation/ Procedure', '');
      } else if (
        this.data.CLAIMED_AMOUNT == undefined ||
        this.data.CLAIMED_AMOUNT <= 0
      ) {
        this.isOk = false;
        this.message.error('Please Enter Claimed Amount', '');
      } else if (
        this.data.ADMISSIBLE_AMOUNT == undefined ||
        this.data.ADMISSIBLE_AMOUNT < 0
      ) {
        this.isOk = false;
        this.message.error('Please Enter Rate', '');
      }
    }

    if (this.isOk == true) {
      if (this.data.CODE_NO == undefined || this.data.CODE_NO == null) {
        this.data.CODE_NO = '';
      }
      if (this.data.SHORT_CODE == undefined && this.data.SHORT_CODE == null) {
        this.data.SHORT_CODE = '';
      }
      if (
        this.data.INVESTIGATION_PROCEDURE_ID == undefined ||
        this.data.INVESTIGATION_PROCEDURE_ID == null
      ) {
        this.data.INVESTIGATION_PROCEDURE_ID = 0;
      }
      if (this.data.PARTICULARS == undefined || this.data.PARTICULARS == null) {
        this.data.PARTICULARS = '';
      }
      if (
        this.data.FINALE_AMOUNT == undefined ||
        this.data.FINALE_AMOUNT == null
      ) {
        this.data.FINALE_AMOUNT = 0;
      }
      if (this.data.RATE == undefined || this.data.RATE == null) {
        this.data.RATE = 0;
      }

      if (this.data.QTY == undefined || this.data.QTY == null) {
        this.data.QTY = 0;
      }

      if (
        this.data.IS_DISCOUNT_APPLIED == false &&
        this.data.CLAIMED_AMOUNT < this.data.ADMISSIBLE_AMOUNT
      ) {
        this.data.ADMISSIBLE_AMOUNT = this.data.CLAIMED_AMOUNT;
      } else {
        // if (this.data.IS_DISCOUNT_APPLIED == true) {
        //   this.data.ADMISSIBLE_AMOUNT = 0;
      }

      this.advanceAdmissible = 0;

      if (this.data.ID) {
        this.isSpinning = true;
        this.cityID = this.CITY_ID;
        this.hospitalID = this.data.CLAIM_HOSPITAL_MAPPING_ID;
        this.data.IS_ADVANCE = 0;
        this.api.updateannextureadd(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.message.success('Information Updated Successfully', '');
            this.isSpinning = false;
            this.api
              .getannexture(
                0,
                0,
                'ID',
                'ASC',
                ' AND STATUS = 1 AND IS_ADVANCE = 0 AND CLAIM_ID=' +
                  this.claimData.ID
              )
              .subscribe(
                (data) => {
                  this.countt = data['count'];
                  this.showlayoutDataList = data['data'];
                  this.total = 0;
                  this.total1 = 0;
                  this.advanceAdmissible = 0;
                  for (var i = 0; this.countt > i; i++) {
                    this.total =
                      this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
                    this.total1 =
                      this.total1 +
                      this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
                    // if (
                    //   this.claimData.IS_ADVANCE_TAKEN == 1 &&
                    //   (this.showlayoutDataList[i][
                    //     'ADVANCE_ADMISSIBLE_AMOUNT'
                    //   ] != undefined ||
                    //     this.showlayoutDataList[i][
                    //       'ADVANCE_ADMISSIBLE_AMOUNT'
                    //     ] != null)
                    // ) {
                    //   this.advanceAdmissible +
                    //     this.showlayoutDataList[i]['ADVANCE_ADMISSIBLE_AMOUNT'];
                    // } else {
                    // }
                  }
                  this.claimData.ADMISSIBLE_AMOUNT = Math.round(this.total1);
                  this.claimData.CLAIMED_AMOUNT = this.total;
                  if (
                    this.claimData.IS_ADVANCE_TAKEN == 1 ||
                    this.claimData.IS_APPLYING_FOR_ADVANCE == 1
                  ) {
                    this.advanceAdmissible = Math.round(
                      (this.total1 * 90) / 100
                    );
                  } else {
                    this.advanceAdmissible = 0;
                  }
                  this.claimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
                    this.advanceAdmissible
                  );
                  this.total1 = Math.round(this.total1);
                  // this.claimData.ADVANCE_AMOUNT = this.advanceAdmissible;
                  this.api
                    .updateClaimedAnnexure(this.claimData)
                    .subscribe((successCode) => {
                      if (successCode.code == '200') {
                        // if (this.claimData.IS_ADVANCE_TAKEN == 1) {
                        //   if (
                        //     this.claimData.ADVANCE_AMOUNT == null ||
                        //     this.claimData.ADVANCE_AMOUNT == undefined ||
                        //     this.claimData.ADVANCE_AMOUNT == '' ||
                        //     this.claimData.ADVANCE_AMOUNT == 0
                        //   ) {
                        //     this.claimData.ADVANCE_AMOUNT =
                        //       this.advanceAdmissible;
                        //   } else {
                        //     this.claimData.ADVANCE_AMOUNT =
                        //       this.claimData.ADVANCE_AMOUNT;
                        //   }
                        // } else {
                        //   this.claimData.ADVANCE_AMOUNT = 0;
                        // }

                        this.api
                          .updateClaimWithoutHospitalData(this.claimData)
                          .subscribe((successCode) => {
                            if (successCode.code == '200') {
                              // this.message.success('Information Changed Successfully...', '');
                              // if (!addNew) this.drawerClose();
                              this.message.success(
                                'Information updated Successfully',
                                ''
                              );
                              this.isSpinning = false;
                            } else {
                              this.message.error(
                                'Information Has Not Changed...',
                                ''
                              );
                              this.isSpinning = false;
                            }
                          });
                        this.isSpinning = false;
                      } else {
                        this.isSpinning = false;
                      }
                    });
                  this.isSpinning = false;
                },
                (err) => {
                  this.isSpinning = false;
                }
              );
            this.resetDrawer(investigationMaster);
            // investigationMaster.form.reset();
            // this.drawerClose();

            this.isSpinning = false;
          } else {
            this.message.error('Information Not Saved', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.isSpinning = true;
        this.data.CLAIM_ID = this.claimData.ID;
        this.data.IS_ADVANCE = 0;
        this.api.createannexture(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            // this.message.success('Information Save Successfully', '');
            this.isSpinning = false;
            this.api
              .getannexture(
                0,
                0,
                'ID',
                'ASC',
                ' AND STATUS = 1 AND IS_ADVANCE = 0  AND CLAIM_ID=' +
                  this.claimData.ID
              )
              .subscribe(
                (data) => {
                  this.countt = data['count'];
                  this.showlayoutDataList = data['data'];
                  this.total = 0;
                  this.total1 = 0;
                  for (var i = 0; this.countt > i; i++) {
                    this.total =
                      this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
                    this.total1 =
                      this.total1 +
                      this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
                  }
                  this.claimData.ADMISSIBLE_AMOUNT = Math.round(this.total1);
                  this.claimData.CLAIMED_AMOUNT = this.total;
                  this.total1 = Math.round(this.total1);
                  if (
                    this.claimData.IS_ADVANCE_TAKEN == 1 ||
                    this.claimData.IS_APPLYING_FOR_ADVANCE == 1
                  ) {
                    this.advanceAdmissible = Math.round(
                      (this.total1 * 90) / 100
                    );
                  } else {
                    this.advanceAdmissible = 0;
                  }
                  this.claimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
                    this.advanceAdmissible
                  );

                  this.api
                    .updateClaimedAnnexure(this.claimData)
                    .subscribe((successCode) => {
                      if (successCode.code == '200') {
                        // if (this.claimData.IS_ADVANCE_TAKEN == 1) {
                        //   if (
                        //     this.claimData.ADVANCE_AMOUNT == null ||
                        //     this.claimData.ADVANCE_AMOUNT == undefined ||
                        //     this.claimData.ADVANCE_AMOUNT == '' ||
                        //     this.claimData.ADVANCE_AMOUNT == 0
                        //   ) {
                        //     this.claimData.ADVANCE_AMOUNT =
                        //       this.advanceAdmissible;
                        //   } else {
                        //     this.claimData.ADVANCE_AMOUNT =
                        //       this.claimData.ADVANCE_AMOUNT;
                        //   }
                        // } else {
                        //   this.claimData.ADVANCE_AMOUNT = 0;
                        // }
                        this.api
                          .updateClaimWithoutHospitalData(this.claimData)
                          .subscribe((successCode) => {
                            if (successCode.code == '200') {
                              // this.message.success('Information Changed Successfully...', '');
                              // if (!addNew) this.drawerClose();
                              this.message.success(
                                'Information updated Successfully',
                                ''
                              );
                              this.isSpinning = false;
                            } else {
                              this.message.error(
                                'Information Has Not Changed...',
                                ''
                              );
                              this.isSpinning = false;
                            }
                          });
                        this.isSpinning = false;
                      } else {
                        this.isSpinning = false;
                      }
                    });
                  this.isSpinning = false;
                },
                (err) => {
                  this.isSpinning = false;
                }
              );
            this.resetDrawer(investigationMaster);
            // investigationMaster.form.reset();
            // this.drawerClose();

            this.isSpinning = false;
          } else {
            this.message.error('Information Not Saved', '');
            this.isSpinning = false;
          }
        });
      }
      // }
    }
  }

  bulkddata(data: any) {
    this.api.addannexturebulk(this.data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Information Save Successfully', '');

        // this.showModal(showlayoutDataList)

        this.isSpinning = false;
      } else {
        this.message.error('Information Not Saved', '');
        this.isSpinning = false;
      }
    });
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  omit2(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      this.data.IS_DISCOUNT_APPLIED == true &&
      (charCode == 45 || charCode == 109)
    ) {
      return true;
    } else if (charCode == 46) {
      return true;
    } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  changedata(event: any) {
    if (this.data.INVESTIGATION_PROCEDURE_ID == 0) {
      this.data.ADMISSIBLE_AMOUNT = event;
    }
  }

  changePerc(event: number) {
    this.data.CHANGE = event;
    var FINALE_AMOUNT = 0;
    if (this.data.RATE != undefined && this.data.RATE != null) {
      if (this.data.QTY != undefined && this.data.QTY != null)
        FINALE_AMOUNT = this.data.RATE * this.data.QTY;
      else FINALE_AMOUNT = this.data.RATE;
      if (
        this.data.SHORT_CODE != null &&
        this.data.SHORT_CODE.includes('2002') &&
        this.city.includes('mumbai')
      ) {
        this.data.FINALE_AMOUNT = FINALE_AMOUNT + (25 / 100) * FINALE_AMOUNT;
        this.additionalChange = 25;
        this.data.ADMISSIBLE_AMOUNT =
          this.data.FINALE_AMOUNT +
          (this.data.CHANGE / 100) * this.data.FINALE_AMOUNT;
      } else {
        this.data.FINALE_AMOUNT = FINALE_AMOUNT;
        this.additionalChange = 0;
        this.data.ADMISSIBLE_AMOUNT =
          this.data.FINALE_AMOUNT +
          (this.data.CHANGE / 100) * this.data.FINALE_AMOUNT;
      }
    }
  }

  changeSheduleNo(event: any) {
    this.data.SHORT_CODE = event;

    if (this.data.IS_PACKAGE == true) {
      this.setAmount();
    } else {
      this.changePerc(0);
    }
  }

  peocedureRate2(event: any) {
    this.procedureList2 = [];
    var f = '';
    if (this.CITY_ID > 0) {
      f = ' AND CITY_ID =' + this.CITY_ID;
    }
    if (
      event.target.value != null &&
      event.target.value != undefined &&
      event.target.value != ''
    ) {
      if (
        event.target.value != null &&
        event.target.value != '' &&
        event.target.value.toString().length >= 3
      ) {
        this.procedureLoading = true;
        this.api
          .getinvestigationprocedure(
            0,
            0,
            'NAME',
            'asc',
            " and NAME like '%" + event.target.value + "%'" + f
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200 && data['data'].length > 0) {
                this.procedureLoading = false;
                this.procedureList2 = data['data'];
              } else {
                this.procedureLoading = false;
                this.procedureList2 = [];
              }
            },
            (err) => {
              this.isSpinning = false;
            }
          );
      }
    } else {
      this.procedureList2 = [];
    }
  }

  peocedureRate(event: any) {
    this.data.INVESTIGATION_PROCEDURE_ID = event;
    if (
      (this.data.CLAIM_HOSPITAL_MAPPING_ID == undefined ||
        this.data.CLAIM_HOSPITAL_MAPPING_ID == null ||
        this.data.CLAIM_HOSPITAL_MAPPING_ID == 0) &&
      this.data.INVESTIGATION_PROCEDURE_ID != undefined &&
      this.data.INVESTIGATION_PROCEDURE_ID != null
    ) {
      this.isOk = false;
      this.message.error('Please select hospital', '');
    } else {
      if (event > 0) {
        var a = this.procedureList2.filter((obj) => {
          return obj.ID == event;
        });
        if (this.ACCREDITATION == 'NN')
          this.data.RATE = a[0]['NON_NABH_AMOUNT'];
        else if (this.ACCREDITATION == 'N')
          this.data.RATE = a[0]['NABH_AMOUNT'];
        else this.data.RATE = a[0]['SUPER_SPECIALITY_AMOUNT'];

        this.city = a[0]['CITY_NAME'].toLowerCase();
        this.data.QTY = 1;
        this.data.FINALE_AMOUNT = this.data.RATE;
        this.data.SHORT_CODE = a[0]['SHORT_CODE'];
        this.data.CODE_NO = a[0]['SCHEDULE_NO'];
        this.data.PARTICULARS = a[0]['NAME'];

        if (this.data.IS_PACKAGE == true) {
          this.data.TYPE = 'P';
          this.setAmount();
        } else {
          this.changePerc(0);
          this.data.TYPE = 'I';
        }
      } else {
        this.data.QTY = 1;
        this.data.FINALE_AMOUNT = 0;
        this.data.SHORT_CODE = '';
        this.data.CODE_NO = 'NIS';
        this.data.CHANGE = 0;
        this.data.ADMISSIBLE_AMOUNT = 0;
        this.data.RATE = 0;
        this.data.IS_PACKAGE = false;
        this.city = '';
        this.additionalChange = 0;
      }
    }
  }

  getPackageRate(event: any) {
    if (event > 0) {
      var a = this.packages.filter((obj) => {
        return obj.ID == event;
      });

      this.PACKAGE_RATE = a[0]['AMT'];
    } else {
      this.PACKAGE_RATE = 0;
    }
  }

  REFRED_RATE_LIST = '';
  showModal(data: any): void {
    // this.api.addannexturebulk(data).subscribe((successCode) => {
    //   if (successCode.code == '200') {
    //     this.message.success('Information Save Successfully', '');
    this.REFRED_RATE_LIST = '';
    var arr: any = [];
    for (var i = 0; i < this.showlayoutDataList.length; i++) {
      arr.push(this.showlayoutDataList[i]['SHORT_CODE']);
      if (i + 1 == this.showlayoutDataList.length) {
        var unique = arr.filter(
          (value, index, array) => array.indexOf(value) === index
        );
        this.REFRED_RATE_LIST = unique.toString();
      }
    }

    this.isVisible = true;

    //     // this.drawerClose();

    //     this.isSpinning = false;
    //   } else {
    //     this.message.error('Information Not Saved', '');
    //     this.isSpinning = false;
    //   }
    // });
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  edit(data: any): void {
    this.data = Object.assign({}, data);
    if (
      data.INVESTIGATION_PROCEDURE_ID != null &&
      data.INVESTIGATION_PROCEDURE_ID != undefined &&
      data.INVESTIGATION_PROCEDURE_ID != ''
    ) {
      this.procedureLoading = true;
      this.api
        .getinvestigationprocedure(
          0,
          0,
          'ID',
          'asc',
          ' AND ID =' + data.INVESTIGATION_PROCEDURE_ID
        )
        .subscribe(
          (data1) => {
            if (data1['code'] == 200 && data1['data'].length > 0) {
              this.procedureLoading = false;
              this.procedureList2 = data1['data'];
            } else {
              this.procedureLoading = false;
              this.procedureList2 = [];
            }
            this.peocedureRate(data.INVESTIGATION_PROCEDURE_ID);
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    } else {
    }
  }

  resetDrawer(bundleMasterPage: NgForm) {
    var CITY_ID = this.CITY_ID;
    var SEQ_NO = this.data.SEQ_NO;
    var HOSP_ID = this.data.CLAIM_HOSPITAL_MAPPING_ID;
    this.data = new InvestigationMaster();
    bundleMasterPage.form.markAsPristine();
    bundleMasterPage.form.markAsUntouched();
    this.CITY_ID = CITY_ID;
    this.data.CLAIM_HOSPITAL_MAPPING_ID = HOSP_ID;
    this.data.SEQ_NO = SEQ_NO;

    this.additionalChange = 0;
  }

  close(investigationMaster: NgForm) {
    this.drawerClose();
    this.resetDrawer(investigationMaster);
    investigationMaster.form.reset();
  }

  public generatePDF() {
    var i = 0;
    var date = new Date();
    var datef = this.datePipe.transform(date, 'dd-MM-yyyy');
    var dates = this.datePipe.transform(date, 'hh-mm-ss a');
    var data = document.getElementById('printAnnexureModal');

    html2pdf()
      .from(data)
      .set({
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true },
        margin: [2, 10, 2, 5],
        pagebreak: { mode: ['css', 'legecy'] },
        jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' },
      })
      .toPdf()
      .get('pdf')
      .then(function (pdf) {
        // this.pdfDownload = true;
        var totalPages = pdf.internal.getNumberOfPages();

        for (i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(12);
          pdf.setTextColor(150);
          pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
        }

        // this.pdfDownload = false;
      })
      .save(this.fileName + '_' + datef + '_' + dates + '.pdf');
  }

  getdata() {
    this.isSpinning = true;
    if (
      this.claimData.ID != null &&
      this.claimData.ID != undefined &&
      this.claimData.ID != ''
    ) {
      this.api
        .getannexture(
          0,
          0,
          'ID',
          'ASC',
          ' AND STATUS = 1 AND CLAIM_ID=' + this.claimData.ID
        )
        .subscribe(
          (data) => {
            this.countt = data['count'];
            this.showlayoutDataList = data['data'];
            this.total = 0;
            this.total1 = 0;
            for (var i = 0; this.countt > i; i++) {
              this.total =
                this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
              this.total1 =
                this.total1 + this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
            }
            if (
              this.claimData.IS_ADVANCE_TAKEN == 1 ||
              this.claimData.IS_APPLYING_FOR_ADVANCE == 1
            ) {
              this.advanceAdmissible = Math.round((this.total1 * 90) / 100);
            } else {
              this.advanceAdmissible = 0;
            }
            this.claimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
              this.advanceAdmissible
            );
            this.isSpinning = false;
          },
          (err) => {
            this.isSpinning = false;
          }
        );
    } else {
    }
  }

  isOkLast: boolean = false;
  updateClaim(showlayoutDataList: any) {
    this.isSpinning = true;
    this.isOkLast = true;
    this.claimData.SUB_STAGE = 'A';
    this.claimData.ADMISSIBLE_AMOUNT = this.total1;
    this.claimData.CLAIMED_AMOUNT = this.total;
    if (
      (this.claimData.PREPARED_BY == null ||
        this.claimData.PREPARED_BY == undefined ||
        this.claimData.PREPARED_BY == '') &&
      (this.claimData.CHECKED_BY == null ||
        this.claimData.CHECKED_BY == undefined ||
        this.claimData.CHECKED_BY == '')
    ) {
      this.message.error('Enter Prepared By & Checked By', '');
      this.isSpinning = false;
      this.isOkLast = false;
    } else if (
      this.claimData.PREPARED_BY == null ||
      this.claimData.PREPARED_BY == undefined ||
      this.claimData.PREPARED_BY == ''
    ) {
      this.message.error('Enter Prepared By', '');
      this.isSpinning = false;
      this.isOkLast = false;
    } else if (
      this.claimData.CHECKED_BY == null ||
      this.claimData.CHECKED_BY == undefined ||
      this.claimData.CHECKED_BY == ''
    ) {
      this.message.error('Enter Checked By', '');
      this.isSpinning = false;
      this.isOkLast = false;
    }
    if (this.isOkLast) {
      if (
        this.claimData.IS_ADVANCE_TAKEN == 1 ||
        this.claimData.IS_APPLYING_FOR_ADVANCE == 1
      ) {
        if (
          this.claimData.ADVANCE_AMOUNT == null ||
          this.claimData.ADVANCE_AMOUNT == undefined ||
          this.claimData.ADVANCE_AMOUNT == '' ||
          this.claimData.ADVANCE_AMOUNT == 0
        ) {
          this.message.error('Please Enter Advance Taken Amount', '');
          this.isSpinning = false;
        } else {
          if (Number(this.claimData.ADVANCE_AMOUNT) > this.advanceAdmissible) {
            this.message.error(
              'Please Enter Advance Taken Amount Which Is Less Than Admissible Amount',
              ''
            );
            this.isSpinning = false;
          } else {
            if (this.claimData.IS_APPLYING_FOR_ADVANCE == 1) {
              this.claimData.IS_ADVANCE_ANNEXURE_CREATED = 1;
              this.claimData.IS_ADVANCE_TAKEN = 1;
              this.claimData.IS_ADVANCE_AMOUNT_CLAIMED = 1;
            }
            this.api
              .updateClaimedAnnexure(this.claimData)
              .subscribe((successCode) => {
                if (successCode.code == '200') {
                  // if (this.claimData.IS_ADVANCE_TAKEN == 1) {
                  //   if (
                  //     this.claimData.ADVANCE_AMOUNT == null ||
                  //     this.claimData.ADVANCE_AMOUNT == undefined ||
                  //     this.claimData.ADVANCE_AMOUNT == '' ||
                  //     this.claimData.ADVANCE_AMOUNT == 0
                  //   ) {
                  //     this.claimData.ADVANCE_AMOUNT = this.advanceAdmissible;
                  //   } else {
                  //     this.claimData.ADVANCE_AMOUNT = this.claimData.ADVANCE_AMOUNT;
                  //   }
                  // } else {
                  //   this.claimData.ADVANCE_AMOUNT = 0;
                  // }

                  this.api
                    .updateClaimWithoutHospitalData(this.claimData)
                    .subscribe((successCode) => {
                      if (successCode.code == '200') {
                        // this.message.success('Information Changed Successfully...', '');
                        // if (!addNew) this.drawerClose();
                        this.message.success(
                          'Information updated Successfully',
                          ''
                        );

                        // this.getdata();

                        this.showModal(showlayoutDataList);
                        this.isSpinning = false;
                      } else {
                        this.message.error(
                          'Information Has Not Changed...',
                          ''
                        );
                        this.isSpinning = false;
                      }
                    });
                } else {
                  this.message.error('Information Not Saved', '');
                  this.isSpinning = false;
                }
              });
          }
          this.isSpinning = false;
        }
      } else {
        if (this.claimData.IS_APPLYING_FOR_ADVANCE == 1) {
          this.claimData.IS_ADVANCE_ANNEXURE_CREATED = 1;
          this.claimData.IS_ADVANCE_TAKEN = 1;
          this.claimData.IS_ADVANCE_AMOUNT_CLAIMED = 1;
        }
        this.claimData.ADVANCE_AMOUNT = 0;
        this.api
          .updateClaimedAnnexure(this.claimData)
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              // if (this.claimData.IS_ADVANCE_TAKEN == 1) {
              //   if (
              //     this.claimData.ADVANCE_AMOUNT == null ||
              //     this.claimData.ADVANCE_AMOUNT == undefined ||
              //     this.claimData.ADVANCE_AMOUNT == '' ||
              //     this.claimData.ADVANCE_AMOUNT == 0
              //   ) {
              //     this.claimData.ADVANCE_AMOUNT = this.advanceAdmissible;
              //   } else {
              //     this.claimData.ADVANCE_AMOUNT = this.claimData.ADVANCE_AMOUNT;
              //   }
              // } else {
              //   this.claimData.ADVANCE_AMOUNT = 0;
              // }
              this.api
                .updateClaimWithoutHospitalData(this.claimData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    // this.message.success('Information Changed Successfully...', '');
                    // if (!addNew) this.drawerClose();
                    this.message.success(
                      'Information updated Successfully',
                      ''
                    );

                    // this.getdata();

                    this.showModal(showlayoutDataList);
                    this.isSpinning = false;
                  } else {
                    this.message.error('Information Has Not Changed...', '');
                    this.isSpinning = false;
                  }
                });
            } else {
              this.message.error('Information Not Saved', '');
              this.isSpinning = false;
            }
          });
      }
    }
  }

  confirm(data, i) {
    data.STATUS = 0;
    data.CODE_NO = ' ';
    data.INVESTIGATION_PROCEDURE_ID = 0;
    // data.ADMISSIBLE_AMOUNT = 0;
    // data.CLAIMED_AMOUNT = 0;
    this.api.updateannextureadd(data).subscribe((successCode) => {
      if (successCode.code == '200') {
        this.message.success('Particular removed successfully', '');
        this.isSpinning = false;
        this.api
          .getannexture(
            0,
            0,
            'ID',
            'ASC',
            ' AND STATUS = 1 AND CLAIM_ID=' + this.claimData.ID
          )
          .subscribe(
            (data) => {
              this.countt = data['count'];
              this.showlayoutDataList = data['data'];
              this.total = 0;
              this.total1 = 0;
              for (var i = 0; this.countt > i; i++) {
                this.total =
                  this.total + this.showlayoutDataList[i]['CLAIMED_AMOUNT'];
                this.total1 =
                  this.total1 + this.showlayoutDataList[i]['ADMISSIBLE_AMOUNT'];
              }
              this.claimData.ADMISSIBLE_AMOUNT = this.total1;
              this.claimData.CLAIMED_AMOUNT = this.total;
              if (
                this.claimData.IS_ADVANCE_TAKEN == 1 ||
                this.claimData.IS_APPLYING_FOR_ADVANCE == 1
              ) {
                this.advanceAdmissible = Math.round((this.total1 * 90) / 100);
              } else {
                this.advanceAdmissible = 0;
              }
              this.claimData.ADVANCE_ADMISSIBLE_AMOUNT = Math.round(
                this.advanceAdmissible
              );
              this.api
                .updateClaimedAnnexure(this.claimData)
                .subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.isSpinning = false;
                  } else {
                    this.isSpinning = false;
                  }
                });
              this.isSpinning = false;
            },
            (err) => {
              this.isSpinning = false;
            }
          );
      } else {
        this.message.error('Failed to remove particular', '');
        this.isSpinning = false;
      }
    });
  }

  cancel(): void {}
}
