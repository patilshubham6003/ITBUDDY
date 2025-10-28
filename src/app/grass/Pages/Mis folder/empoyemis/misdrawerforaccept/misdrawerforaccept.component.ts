import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { APIServicesService } from 'src/app/grass/Services/APIService.service';
import { FamilydataMaster } from '../familydatamaster';
import { HousedataMaster } from '../houseDataMaster';
import { ServiceTypeWiseMaster } from '../servicetypewiseMaster';
import { MisEmpMaster } from '../miseployee';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-misdrawerforaccept',
  templateUrl: './misdrawerforaccept.component.html',
  styleUrls: ['./misdrawerforaccept.component.css'],
  providers: [DatePipe]
})
export class MisdrawerforacceptComponent implements OnInit {
  @Input() empid: any;
  // @Input() data2!: AllotmentCheckList;
  @Input() employerecordfilled!: boolean;
  @Input() isdraweropendedggg: boolean = false;
  @Input() drawerClose;
  @Input() stage!: number;
  @Input() data: any = new MisEmpMaster();
  @Input() DataForSendLetters: any;
  familydata: any = new FamilydataMaster();
  housedata: any = new HousedataMaster();
  suritydata: any = new ServiceTypeWiseMaster();
  printdate: Date = new Date();
  isotpSpinning: boolean = false;

  disableprevious: boolean = false;
  disablenext: boolean = false;
  printOrderModalVisible = false;
  view = 0;
  viewPdfSafe: any;
  isagreedisable1 = true;
  isSpinning = false;
  date: any;
  Designationtypes: any = [];

  constructor(
    private api: APIServicesService,
    private datepipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {

    const today = new Date();
    if (this.familydata.DOB == null || this.familydata.DOB == undefined) {
      this.date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    }

    if (this.isdraweropendedggg == true) {
      if (this.stage == 0) {
        // if(this.isdraweropendedggg==true){
        this.getfamilydata();
        this.getDesignation();
        // }

      } else if (this.stage == 1) {

        this.api.getaceptancedata(
          0,
          0,
          '',
          'asc',
          '',
          sessionStorage.getItem('userId'),
          this.data.ID
        )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.acceptancedatalist1 = data['data'][0]['FLAT_CHECKLIST_DATA'][0]
              this.acceptancedatalist2 = data['data'][0]['FLAT_REQUEST_DATA'][0]
              this.acceptancedatalist3 = data['data'][0]['FLAT_TAKEN_LIST_DATA'][0]

            }
          });
        this.api
          .getAcceptanceformsss(
            0,
            0,
            'ID',
            'desc',
            ' AND EMP_ID=' + sessionStorage.getItem('userId') + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.suritydata = data['data'][0];
                this.api
                  .getAcceptanceHouse(
                    0,
                    0,
                    '',
                    'asc',
                    ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
                  )
                  .subscribe((data) => {
                    if (data['code'] == 200) {
                      this.isSpinning = false;
                      if (data['data'].length > 0) {
                        this.relationdata = data['data'];
                      }
                    }
                  });
              }
            },
            (err) => {
            }
          );
        this.api
          .getfamilydata(
            0,
            0,
            '',
            'asc',
            ' AND EMP_ID=' + sessionStorage.getItem('userId')
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.isSpinning = false;
              if (data['data'].length > 0) {
                this.familydata1 = data['data'];
              } else {
                this.familydata1 = [];
              }
            }
          });
      } else if (this.stage == 2) {

        this.api.updategetflatgetlist(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.api.getfinalallotementdetailss(
              0,
              0,
              'ID',
              'desc',
              " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
            )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data = data['data'][0];
                    if (this.data.ACCEPTANCE_LETTER != null) {
                      this.applnform = false;
                    } else {
                      this.applnform = true;
                    }
                  }
                })
            // this.stage = 3;
          }
        })
      } else {

        // if(this.isdraweropendedggg==true){
        this.getfamilydata();
        this.getDesignation();
        // }
      }
    }
  }
  getDesignation() {
    this.api.getallDesignation(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Designationtypes = data['data'];
        }
      },
      (err) => {
      }
    );
    this.api
      .getAcceptanceformsss(
        0,
        0,
        'ID',
        'desc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId') + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            if (data['data'].length > 0) {
              this.suritydata = data['data'][0];
              this.api
                .getAcceptanceHouse(
                  0,
                  0,
                  '',
                  'asc',
                  ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
                )
                .subscribe((data) => {
                  if (data['code'] == 200) {
                    this.isSpinning = false;
                    if (data['data'].length > 0) {
                      this.relationdata = data['data'];
                    }
                  }
                });
            } else {
              this.suritydata = new ServiceTypeWiseMaster();
            }


          }
        },
        (err) => {
        }
      );
  }
  close() {
    this.drawerClose();
  }

  previouslast() {
    if (this.stage > 0) {
      this.stage -= 1;
    }
    if (this.stage <= 0) {
      this.stage = 0;
    }
    this.isagreedisable1 = true;
    this.api.getfinalallotementdetailss(
      0,
      0,
      'ID',
      'desc',
      " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
    )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data = data['data'][0];
            if (this.data.ACCEPTANCE_LETTER != null) {
              this.applnform = false;
            } else {
              this.applnform = true;
            }
            this.api
              .getaceptancedata(
                0,
                0,
                '',
                'asc',
                '',
                sessionStorage.getItem('userId'),
                this.data.ID
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.acceptancedatalist1 = data['data'][0]['FLAT_CHECKLIST_DATA'][0]
                  this.acceptancedatalist2 = data['data'][0]['FLAT_REQUEST_DATA'][0]
                  this.acceptancedatalist3 = data['data'][0]['FLAT_TAKEN_LIST_DATA'][0]

                }
              });
          }
        })
    this.api
      .getAcceptanceformsss(
        0,
        0,
        'ID',
        'desc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId') + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.suritydata = data['data'][0];
            this.api
              .getAcceptanceHouse(
                0,
                0,
                '',
                'asc',
                ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.isSpinning = false;
                  if (data['data'].length > 0) {
                    this.relationdata = data['data'];
                  }
                }
              });
          }
        },
        (err) => {
        }
      );
    this.api
      .getfamilydata(
        0,
        0,
        '',
        'asc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          if (data['data'].length > 0) {
            this.familydata1 = data['data'];
          } else {
            this.familydata1 = [];
          }
        }
      });
  }
  previous1() {
    if (this.stage > 0) {
      this.stage -= 1;
    }
    if (this.stage <= 0) {
      this.stage = 0;
    }

    this.api.getallDesignation(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Designationtypes = data['data'];
        }
      },
      (err) => {
      }
    );
    this.api.getfinalallotementdetailss(
      0,
      0,
      'ID',
      'desc',
      " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
    )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data = data['data'][0];
          }
        })
    this.api
      .getAcceptanceformsss(
        0,
        0,
        'ID',
        'desc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId') + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.suritydata = data['data'][0];
          }
        },
        (err) => {
        }
      );
    this.api
      .getfamilydata(
        0,
        0,
        '',
        'asc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          if (data['data'].length > 0) {
            this.familydata1 = data['data'];
          } else {
            this.familydata1 = [];
          }
        }
      });
  }
  previous2() {
    if (this.stage > 0) {
      this.stage -= 1;
      this.isagreedisable1 = true;
    }
    if (this.stage <= 0) {
      this.stage = 0;
      this.isagreedisable1 = true;
    }
    this.api.getallDesignation(0, 0, 'ID', 'desc', ' AND STATUS = 1').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.Designationtypes = data['data'];
        }
      },
      (err) => {
      }
    );
    this.api.getfinalallotementdetailss(
      0,
      0,
      'ID',
      'desc',
      " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
    )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.data = data['data'][0];
          }
        })
    this.api
      .getAcceptanceformsss(
        0,
        0,
        'ID',
        'desc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId') + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.suritydata = data['data'][0];
            this.api
              .getAcceptanceHouse(
                0,
                0,
                '',
                'asc',
                ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  this.isSpinning = false;
                  if (data['data'].length > 0) {
                    this.relationdata = data['data'];
                  }
                }
              });
          }
        },
        (err) => {
        }
      );
    this.api
      .getfamilydata(
        0,
        0,
        '',
        'asc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          if (data['data'].length > 0) {
            this.familydata1 = data['data'];
          } else {
            this.familydata1 = [];
          }
        }
      });
  }

  displayc() {
    this.stage == 4;
    alert("heloooooooo")
    if (this.data.ACCEPTANCE_LETTER != null) {
      this.applnform = false;
    } else {
      this.applnform = true;
    }

    if (this.stage == 5) {
      this.disablenext = true;
      this.drawerClose();
    }
  }
  otherdd: any;
  selectd(d: any) {
    this.otherdd = d;
  }
  onlynumdot(event) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }
    return false;
  }
  loaddisaplyac: boolean = false;

  empSave() {
    if (this.data.SERVICE_TYPE == 'Temporary' && (this.suritydata.NAME_OF_SURETY == undefined || this.suritydata.NAME_OF_SURETY.trim() == '')) {
      this.message.error('Please Enter Name Of Surety', '')
    } else if (this.data.SERVICE_TYPE == 'Temporary' && (this.suritydata.SURETY_DESIGNATION_ID == undefined || this.suritydata.SURETY_DESIGNATION_ID.toString().trim() == '')) {
      this.message.error('Please Select Designation', '')
    } else if (this.data.SERVICE_TYPE == 'Temporary' && (this.suritydata.SURETY_DESIGNATION_ID == 56 && (this.suritydata.SURETY_DESIGNATION_OTHER == undefined || this.suritydata.SURETY_DESIGNATION_OTHER.trim() == ''))) {
      this.message.error('Please Enter Designation', '')
    } else if (this.data.SERVICE_TYPE == 'Temporary' && (this.suritydata.OFFICE_WHERE_EMPLOYEED == undefined || this.suritydata.OFFICE_WHERE_EMPLOYEED.trim() == '')) {
      this.message.error('Please Enter Office where Employed ', '')
    } else {
      this.isSpinning = true;
      this.loaddisaplyac = true;

      this.data.ACCEPTANCE_LETTER_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      if (this.suritydata.ID) {
        this.suritydata.EMP_ID = this.empid;
        // this.suritydata.FLAT_TAKEN_LIST_ID = this.data.ID;
        this.suritydata.FINAL_ALLOTMENT_DETAILS_ID = this.data.ID;
        this.suritydata.SPECIAL_PAY = this.suritydata.SPECIAL_PAY ? this.suritydata.SPECIAL_PAY : 0;
        this.suritydata.DEPUTATION_PAY = this.suritydata.DEPUTATION_PAY ? this.suritydata.DEPUTATION_PAY : 0;
        this.suritydata.CCA = this.suritydata.CCA ? this.suritydata.CCA : 0;
        this.suritydata.OTHER_RECEIPTS_EMOLUMENTS = this.suritydata.OTHER_RECEIPTS_EMOLUMENTS ? this.suritydata.OTHER_RECEIPTS_EMOLUMENTS : 0;

        this.data.STEP_NO = '0';
        this.api.updategetflatgetlist(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.api.getfinalallotementdetailss(
              0,
              0,
              'ID',
              'desc',
              " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')

            )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data = data['data'][0];
                    this.loaddisaplyac = false;

                    if (this.data.ACCEPTANCE_LETTER != null) {
                      this.applnform = false;
                    } else {
                      this.applnform = true;
                    }
                    this.api
                      .getaceptancedata(
                        0,
                        0,
                        '',
                        'asc',
                        '',
                        sessionStorage.getItem('userId'),
                        this.data.ID
                      )
                      .subscribe((data) => {
                        if (data['code'] == 200) {
                          this.acceptancedatalist1 = data['data'][0]['FLAT_CHECKLIST_DATA'][0]
                          this.acceptancedatalist2 = data['data'][0]['FLAT_REQUEST_DATA'][0]
                          this.acceptancedatalist3 = data['data'][0]['FLAT_TAKEN_LIST_DATA'][0]

                        }
                      });
                  }
                })
            // this.message.success('Information Updated Successfully...', '');
            this.api.updateAcceptanceformss(this.suritydata).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.message.success('Information Updated Successfully...', '');
                // this.next();
                this.stage = 1;
                this.api
                  .getAcceptanceformsss(
                    0,
                    0,
                    'ID',
                    'desc',
                    ' AND EMP_ID=' + this.empid + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.suritydata = data['data'][0];
                        this.loaddisaplyac = false;

                        this.housedata = this.relationdata;
                        for (var i = 0; i < this.housedata.length; i++) {
                          this.housedata[i].ACCEPTANCE_FORM_ID = this.suritydata.ID;
                        }
                        // this.housedata.ACCEPTANCE_FORM_ID = this.suritydata.ID;
                        if (this.housedata.length > 0) {
                          this.isotpSpinning1 = true;

                          this.api.CreateAcceptanceHoue(this.housedata).subscribe((successCode) => {
                            if (successCode['code'] == '200') {
                              this.isotpSpinning1 = false;
                              this.isSpinning = false;
                              // this.message.success('Detailes of House Submitted Successfully', '');
                              this.housedata.LOCALITY = '';
                              this.housedata.HOUSE_NO = '';
                              this.housedata.MONTHLY_RENTAL_INCOME = '';
                              this.housedata.MONTHLY_RENTAL_INCOME_PROOF = '';
                              this.housedata.OWNED_BY = '';
                              this.housedata.ID = '';
                              this.progressBar3 = false;
                              this.Payslipshow = true;
                              this.housedata = new HousedataMaster();
                              // this.gethousedata();
                              this.api
                                .getAcceptanceformsss(
                                  0,
                                  0,
                                  'ID',
                                  'desc',
                                  ' AND EMP_ID=' + this.empid + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      this.suritydata = data['data'][0];

                                      this.api
                                        .getAcceptanceHouse(
                                          0,
                                          0,
                                          '',
                                          'asc',
                                          ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
                                        )
                                        .subscribe((data) => {
                                          if (data['code'] == 200) {
                                            this.isSpinning = false;
                                            if (data['data'].length > 0) {
                                              this.relationdata = data['data'];
                                            }
                                          }
                                        });
                                    }
                                  },
                                  (err) => {
                                  }
                                );
                            } else {
                              this.isotpSpinning1 = false;
                              // this.message.error('Failed to Create Details of House', '');
                            }
                          }, (err) => {
                            this.isotpSpinning1 = false;
                          });
                        }


                      }
                    },
                    (err) => {
                    }
                  );

                this.isSpinning = false;
              } else {
                this.message.error(' Failed To Update Information...', '');
                this.isSpinning = false;
              }
            });
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
            this.loaddisaplyac = false;

          }
        }, err => {
          this.isSpinning = false;
          this.loaddisaplyac = false;

          this.message.error(' Failed To Update Information...', '');
        });
      } else {
        this.suritydata.EMP_ID = this.empid;
        // this.suritydata.FLAT_TAKEN_LIST_ID = this.data.ID;
        this.suritydata.FINAL_ALLOTMENT_DETAILS_ID = this.data.ID;
        this.suritydata.SPECIAL_PAY = this.suritydata.SPECIAL_PAY ? this.suritydata.SPECIAL_PAY : 0;
        this.suritydata.DEPUTATION_PAY = this.suritydata.DEPUTATION_PAY ? this.suritydata.DEPUTATION_PAY : 0;
        this.suritydata.CCA = this.suritydata.CCA ? this.suritydata.CCA : 0;
        this.suritydata.OTHER_RECEIPTS_EMOLUMENTS = this.suritydata.OTHER_RECEIPTS_EMOLUMENTS ? this.suritydata.OTHER_RECEIPTS_EMOLUMENTS : 0;

        this.data.STEP_NO = '0';

        this.api.updategetflatgetlist(this.data).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.api.getfinalallotementdetailss(
              0,
              0,
              'ID',
              'desc',
              " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
            )
              .subscribe(
                (data) => {
                  if (data['code'] == 200) {
                    this.data = data['data'][0];
                    this.loaddisaplyac = false;

                    if (this.data.ACCEPTANCE_LETTER != null) {
                      this.applnform = false;
                    } else {
                      this.applnform = true;
                    }

                    this.api
                      .getaceptancedata(
                        0,
                        0,
                        '',
                        'asc',
                        '',
                        sessionStorage.getItem('userId'),
                        this.data.ID
                      )
                      .subscribe((data) => {
                        if (data['code'] == 200) {
                          this.acceptancedatalist1 = data['data'][0]['FLAT_CHECKLIST_DATA'][0]
                          this.acceptancedatalist2 = data['data'][0]['FLAT_REQUEST_DATA'][0]
                          this.acceptancedatalist3 = data['data'][0]['FLAT_TAKEN_LIST_DATA'][0]

                        }
                      });
                  }
                })
            this.api.CreateAcceptformss(this.suritydata).subscribe((successCode) => {
              if (successCode['code'] == '200') {
                this.message.success(' Information Save Successfully...', '');
                // this.next();
                this.stage = 1;
                this.api
                  .getAcceptanceformsss(
                    0,
                    0,
                    'ID',
                    'desc',
                    ' AND EMP_ID=' + this.empid + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
                  )
                  .subscribe(
                    (data) => {
                      if (data['code'] == 200) {
                        this.suritydata = data['data'][0];
                        this.loaddisaplyac = false;

                        this.housedata = this.relationdata;
                        // this.housedata.ACCEPTANCE_FORM_ID = this.suritydata.ID;
                        for (var i = 0; i < this.housedata.length; i++) {
                          this.housedata[i].ACCEPTANCE_FORM_ID = this.suritydata.ID;
                        }
                        if (this.housedata.length > 0) {
                          this.isotpSpinning1 = true;

                          this.api.CreateAcceptanceHoue(this.housedata).subscribe((successCode) => {
                            if (successCode['code'] == '200') {
                              this.isotpSpinning1 = false;
                              this.isSpinning = false;
                              // this.message.success('Detailes of House Submitted Successfully', '');
                              this.housedata.LOCALITY = '';
                              this.housedata.HOUSE_NO = '';
                              this.housedata.MONTHLY_RENTAL_INCOME = '';
                              this.housedata.MONTHLY_RENTAL_INCOME_PROOF = '';
                              this.housedata.OWNED_BY = '';
                              this.housedata.ID = '';
                              this.progressBar3 = false;
                              this.Payslipshow = true;
                              this.housedata = new HousedataMaster();
                              // this.gethousedata();
                              this.api
                                .getAcceptanceformsss(
                                  0,
                                  0,
                                  'ID',
                                  'desc',
                                  ' AND EMP_ID=' + this.empid + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
                                )
                                .subscribe(
                                  (data) => {
                                    if (data['code'] == 200) {
                                      this.suritydata = data['data'][0];

                                      this.api
                                        .getAcceptanceHouse(
                                          0,
                                          0,
                                          '',
                                          'asc',
                                          ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
                                        )
                                        .subscribe((data) => {
                                          if (data['code'] == 200) {
                                            this.isSpinning = false;
                                            if (data['data'].length > 0) {
                                              this.relationdata = data['data'];
                                            }
                                          }
                                        });
                                    }
                                  },
                                  (err) => {
                                  }
                                );
                            } else {
                              this.isotpSpinning1 = false;
                              // this.message.error('Failed to Create Details of House', '');
                            }
                          }, (err) => {
                            this.isotpSpinning1 = false;
                          });
                        }
                      }
                    },
                    (err) => {
                    }
                  );
                this.isSpinning = false;
              } else {
                this.message.error(' Failed To Save Information...', '');
                this.isSpinning = false;
              }
            });
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
            this.loaddisaplyac = false;

          }
        }, err => {
          this.isSpinning = false;
          this.loaddisaplyac = false;

          this.message.error(' Failed To Update Information...', '');
        });
      }
    }
  }


  index = -1;
  housedatass: HousedataMaster = new HousedataMaster();
  edit11(data: HousedataMaster, i: any): void {
    this.index = i;
    this.housedatass = Object.assign({}, data);
    this.Payslipshow = false;
  }
  relationdata: any = [];
  addData(addNew: boolean, relation: NgForm) {
    if (
      this.housedatass.LOCALITY == null ||
      this.housedatass.LOCALITY == undefined ||
      this.housedatass.LOCALITY.trim() == ''
    ) {
      this.message.error('Please Enter Locality', '');
    } else if (
      this.housedatass.HOUSE_NO == null ||
      this.housedatass.HOUSE_NO == undefined ||
      this.housedatass.HOUSE_NO.trim() == ''
    ) {
      this.message.error('Please Enter House Number', '');
    } else if (
      this.housedatass.MONTHLY_RENTAL_INCOME == null ||
      this.housedatass.MONTHLY_RENTAL_INCOME == undefined
    ) {
      this.message.error('Please Enter Monthly Rental Income', '');
    } else if (
      this.housedatass.MONTHLY_RENTAL_INCOME_PROOF == '' ||
      this.housedatass.MONTHLY_RENTAL_INCOME_PROOF == undefined ||
      this.housedatass.MONTHLY_RENTAL_INCOME_PROOF == null
    ) {
      this.message.error('Please Upload Monthly Rental Income Proof', '');
    } else {
      // this.housedatass.CLIENT_ID = 1;
      // this.housedatass.ID = undefined;

      if (this.index > -1) {
        this.relationdata[this.index] = Object.assign({}, this.housedatass);
      } else {
        this.relationdata.push(Object.assign({}, this.housedatass));
      }
      this.relationdata = [...[], ...this.relationdata];
      relation.form.reset();
      this.Payslipshow = true;
      this.progressBar3 = false;
      this.housedatass = new HousedataMaster();
      this.index = -1;
    }
  }
  acceptancedatalist1: any = [];
  acceptancedatalist2: any = [];
  acceptancedatalist3: any = [];

  checkSave() {
    this.data.STEP_NO = 1;
    this.data.HOUSE_DETAILS_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    this.api.updategetflatgetlist(this.data).subscribe((successCode) => {
      if (successCode['code'] == '200') {
        this.api.getfinalallotementdetailss(
          0,
          0,
          'ID',
          'desc',
          " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId')
        )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.data = data['data'][0];
                if (this.data.ACCEPTANCE_LETTER != null) {
                  this.applnform = false;
                } else {
                  this.applnform = true;
                }
                this.api
                  .getaceptancedata(
                    0,
                    0,
                    '',
                    'asc',
                    '',
                    sessionStorage.getItem('userId'),
                    this.data.ID
                  )
                  .subscribe((data) => {
                    if (data['code'] == 200) {
                      this.acceptancedatalist1 = data['data'][0]['FLAT_CHECKLIST_DATA'][0]
                      this.acceptancedatalist2 = data['data'][0]['FLAT_REQUEST_DATA'][0]
                      this.acceptancedatalist3 = data['data'][0]['FLAT_TAKEN_LIST_DATA'][0]

                    }
                  });
              }
            })
        this.api
          .getAcceptanceformsss(
            0,
            0,
            'ID',
            'desc',
            ' AND EMP_ID=' + sessionStorage.getItem('userId') + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
          )
          .subscribe(
            (data) => {
              if (data['code'] == 200) {
                this.suritydata = data['data'][0];
                this.api
                  .getAcceptanceHouse(
                    0,
                    0,
                    '',
                    'asc',
                    ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
                  )
                  .subscribe((data) => {
                    if (data['code'] == 200) {
                      this.isSpinning = false;
                      if (data['data'].length > 0) {
                        this.relationdata = data['data'];
                      }
                    }
                  });
              }
            },
            (err) => {
            }
          );

        this.api
          .getfamilydata(
            0,
            0,
            '',
            'asc',
            ' AND EMP_ID=' + sessionStorage.getItem('userId')
          )
          .subscribe((data) => {
            if (data['code'] == 200) {
              this.isSpinning = false;
              if (data['data'].length > 0) {
                this.familydata1 = data['data'];
              } else {
                this.familydata1 = [];
              }
            }
          });
        this.stage = 2;
      }
    })
    // this.getfamilydata();
  }

  loaddingprintfgc: boolean = false;


  viewpayslip(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 4;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }
  Payslipshow: boolean = true;

  // clearpayslip() {
  //   this.housedata.MONTHLY_RENTAL_INCOME_PROOF = null;
  //   this.Payslipshow = true;
  //   this.progressBar3 = false;
  // }

  clearpayslip(url: any, folder: any) {
    var datadelete = folder + '///' + url
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.housedatass.MONTHLY_RENTAL_INCOME_PROOF = null;
          this.Payslipshow = true;
          this.progressBar3 = false;
          this.percent3 = 0
        } else {
          this.message.error('Failed to delete income certrificate', '');
        }
      },
      (err) => {
        this.message.error('Something went wrong, Please try again later', '');
      })
  }

  progressBar3: boolean = false
  percent3 = 0
  timer3: any
  payslippdf: any;
  urlpayslip: any;
  insomeuploadcert: boolean = false;
  onFileSelectedPayslip(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      // this.isSpinning = true;
      this.insomeuploadcert = true;
      this.payslippdf = <File>event.target.files[0];

      if (this.payslippdf != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.payslippdf.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlpayslip = url;
        if (
          this.housedatass.MONTHLY_RENTAL_INCOME_PROOF != undefined &&
          this.housedatass.MONTHLY_RENTAL_INCOME_PROOF.trim() != ''
        ) {
          var arr = this.housedatass.MONTHLY_RENTAL_INCOME_PROOF.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar3 = true
      this.timer3 = this.api
        .onUpload2('monthlyRentalIncomeProof', this.payslippdf, this.urlpayslip)
        .subscribe((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * res.loaded / res.total);
            this.percent3 = percentDone;
            if (this.percent3 == 100) {
              this.isSpinning = false;
              this.insomeuploadcert = false;
            }
          } else if (res.type == 2 && (res.status != 200)) {
            this.message.error('Failed To Upload Monthly Rental Income Proof.', '');
            this.isSpinning = false;
            this.insomeuploadcert = false;
            this.progressBar3 = false;
            this.percent3 = 0;
            this.housedatass.MONTHLY_RENTAL_INCOME_PROOF = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('Monthly Rental Income Proof Uploaded Successfully...', '');
              this.isSpinning = false;
              this.insomeuploadcert = false;
              this.housedatass.MONTHLY_RENTAL_INCOME_PROOF = this.urlpayslip;
            } else {
              this.isSpinning = false;
              this.insomeuploadcert = false;
            }
          }

          if (this.housedatass.MONTHLY_RENTAL_INCOME_PROOF != null) {
            this.Payslipshow = false;
          } else {
            this.Payslipshow = true;
          }

        }, (err) => {
          this.message.error('Failed To Upload Monthly Rental Income Proof.', '');
          this.isSpinning = false;
          this.progressBar3 = false;
          this.insomeuploadcert = false;

          this.percent3 = 0;
          this.housedatass.MONTHLY_RENTAL_INCOME_PROOF = null;
        })
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.payslippdf = null;
      this.insomeuploadcert = false;
      this.progressBar3 = false;
      this.percent3 = 0;
      this.housedatass.MONTHLY_RENTAL_INCOME_PROOF = null;
    }
  }
  agrreconfirmation1() {
    this.isagreedisable1 = !this.isagreedisable1;
  }

  progressBar: boolean = false
  percent = 0
  timer: any
  appnPDF: any;
  urlappnPdf: any;
  applnform: boolean = true;
  formuploadaa: boolean = false;
  onFileApplicationform(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.appnPDF = <File>event.target.files[0];
      this.formuploadaa = true;
      if (this.appnPDF != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.appnPDF.name.split('.').pop();
        var d = this.datepipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;
        this.urlappnPdf = url;
        if (
          this.data.ACCEPTANCE_LETTER != undefined &&
          this.data.ACCEPTANCE_LETTER.trim() != ''
        ) {
          var arr = this.data.ACCEPTANCE_LETTER.split('/');
          if (arr.length > 1) {
            url = arr[5];
          }
        }
      }
      this.progressBar = true;
      this.timer = this.api
        .onUpload2('acceptanceLetter', this.appnPDF, this.urlappnPdf)
        .subscribe((res) => {
          if (res.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * res.loaded / res.total);
            this.percent = percentDone;
            if (this.percent == 100) {
              this.isSpinning = false;
              this.formuploadaa = false;
            }
          } else if (res.type == 2 && (res.status != 200)) {
            this.message.error('Failed To Upload Application Form.', '');
            this.isSpinning = false;
            this.formuploadaa = false;
            this.progressBar = false;
            this.percent = 0;
            this.data.ACCEPTANCE_LETTER = null;
          } else if (res.type == 4 && res.status == 200) {
            if (res.body['code'] == 200) {
              this.message.success('Application Form Uploaded Successfully...', '');
              this.isSpinning = false;
              this.formuploadaa = false;
              this.data.ACCEPTANCE_LETTER = this.urlappnPdf;
            } else {
              this.isSpinning = false;
              this.formuploadaa = false;
            }
          }
          if (this.data.ACCEPTANCE_LETTER != null) {
            this.applnform = false;
          } else {
            this.applnform = true;
          }
        });
    } else {
      this.message.error('Please Select Only PDF File', '');
      this.appnPDF = null;
      this.data.ACCEPTANCE_LETTER = null;
      this.formuploadaa = false;
    }
  }


  applnformshow(pdfURL: string): void {
    this.viewPdfSafe = '';
    this.view = 6;
    this.printOrderModalVisible = true;
    this.viewPdfSafe = this.getS(pdfURL);
  }

  // clearapplnform() {
  //   this.data.ACCEPTANCE_LETTER = null;
  //   this.applnform = true;
  //   this.progressBar = false
  // }
  clearapplnform(url: any, folder: any) {
    var datadelete = folder + '/' + url
    this.api.deletealluploadsgrass(datadelete).subscribe(
      (successCode) => {
        if (successCode['code'] == 200) {
          this.data.ACCEPTANCE_LETTER = null;
          this.applnform = true;
          this.progressBar = false
          this.percent = 0
        } else {
          this.data.ACCEPTANCE_LETTER = null;
          this.applnform = true;
          this.progressBar = false
          this.percent = 0
          // this.message.error('Failed to delete acceptance form', '');
        }
      },
      (err) => {
        this.data.ACCEPTANCE_LETTER = null;
        this.applnform = true;
        this.progressBar = false
        this.percent = 0
        // this.message.error('Failed to delete acceptance form', '');
      })
  }


  sanitizedLink: any = '';
  getS(link: string) {
    this.sanitizedLink = '';
    if (this.view == 1) {
      var a: any = this.api.retriveimgUrl + 'gradePayDrawnLetter/' + link;
    }
    if (this.view == 2) {
      var a: any = this.api.retriveimgUrl + 'joiningAllotmentLetter/' + link;
    }
    if (this.view == 3) {
      var a: any = this.api.retriveimgUrl + 'joiningLetter/' + link;
    }
    if (this.view == 4) {
      var a: any = this.api.retriveimgUrl + 'monthlyRentalIncomeProof/' + link;
    }
    if (this.view == 5) {
      var a: any = this.api.retriveimgUrl + 'iCards/' + link;
    }
    if (this.view == 6) {
      var a: any = this.api.retriveimgUrl + 'acceptanceLetter/' + link;
    }
    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(a);
    return this.sanitizedLink;
  }

  printOrderModalCancel() {
    this.printOrderModalVisible = false;
  }

  submitload: boolean = false;
  elementAsString111: string;
  NONACCEPTANCE_END_DATETIME: any;
  SEND_TO_CARETAKER_END_DATE_TIME: any;
  Submitapplication() {
    const element: any = document.getElementById('Prntmodalforbackend');
    this.elementAsString111 = element.outerHTML;
    this.submitload = true;
    this.api.getfinalallotementdetailss(0, 0, 'ID', 'desc', " AND STATUS = 'Y' AND EMP_ID=" + sessionStorage.getItem('userId'))
      .subscribe(
        (dataall) => {
          if (dataall['code'] == 200) {
            this.data = dataall['data'][0];
            var dateeeeeee1: any = new Date(this.data.ACCEPTANCE_END_DATE_TIME);
            var datee31 = dateeeeeee1.setDate(dateeeeeee1.getDate() + 5);
            datee31 = this.datepipe.transform(dateeeeeee1, 'yyyy-MM-dd HH:mm:ss');
            let newdate = new Date();
            this.SEND_TO_CARETAKER_END_DATE_TIME = new Date(
              newdate.getFullYear(),
              newdate.getMonth(),
              newdate.getDate() + 5
            );
            this.NONACCEPTANCE_END_DATETIME = new Date(
              newdate.getFullYear(),
              newdate.getMonth(),
              newdate.getDate() + 5
            );
            this.SEND_TO_CARETAKER_END_DATE_TIME = this.datepipe.transform(
              this.SEND_TO_CARETAKER_END_DATE_TIME, 'yyyy-MM-dd HH:mm:ss');
            this.NONACCEPTANCE_END_DATETIME = this.datepipe.transform(
              this.NONACCEPTANCE_END_DATETIME, 'yyyy-MM-dd HH:mm:ss');
            this.api.submitacceptanceform(dataall['data'][0]['ID'], dataall['data'][0]['YEAR'], dataall['data'][0]['MONTH'], sessionStorage.getItem('userId'), dataall['data'][0]['FINAL_ALLOTMENT_MASTER_ID'], dataall['data'][0]['REMARK'], dataall['data'][0]['ACCEPTANCE_LETTER'], dataall['data'][0]['FLAT_ID'], datee31, this.NONACCEPTANCE_END_DATETIME, this.SEND_TO_CARETAKER_END_DATE_TIME)
              .subscribe(
                (datas) => {
                  if (datas['code'] == 200) {
                    this.data.STEP_NO = 1;
                    this.data.PRINT_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.data.UPLOAD_SUBMITE_DATE_TIME = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    this.data.IS_ACCEPTANCE_LETTER_SUBMITTED = 1;
                    this.api.updategetflatgetlist(this.data).subscribe((successCode) => {
                      var dateeeeeee: any = new Date(this.data.ACCEPTANCE_END_DATE_TIME);
                      var datee3 = dateeeeeee.setDate(dateeeeeee.getDate() + 5);
                      datee3 = this.datepipe.transform(dateeeeeee, 'yyyy-MM-dd HH:mm:ss');

                      var senddata = {
                        'ID': this.data.ID,
                        'RESIDENCE_TYPE_NAME': this.data.RESIDENCE_TYPE_NAME,
                        'FLAT_NAME': this.data.FLAT_NAME,
                        'BULDING_NAME': this.data.BULDING_NAME,
                        'CITY_NAME': this.data.CITY_NAME,
                        'PHYSICAL_END_DATETIME': datee3,
                        'ALLOTMENT_DATE_TIME': this.data.ALLOTMENT_DATE_TIME,
                        'ACCEPTANCE_LETTER_DATE_TIME': this.data.ACCEPTANCE_LETTER_DATE_TIME,
                        'EMPLOYEE_NAME': this.data.EMPLOYEE_NAME,
                        'htmlContent': this.elementAsString111
                      }
                      if (successCode['code'] == '200') {
                        this.api.finalAllotmentList(senddata)
                          .subscribe((dasta) => {
                            if (dasta.code == 200) {
                              this.submitload = false;
                              this.Rulesandapply = false;
                              this.drawerClose();
                              this.message.success(
                                'Acceptance Form Send For Verification Sucessfully',
                                ''
                              );
                            } else {
                              this.submitload = false;
                              this.message.error(' Failed To Send Acceptance Form For Verification...', '');
                            }
                          }, err => {
                            this.submitload = false;
                            this.message.error(' Failed To Send Acceptance Form For Verification...', '');
                          });
                      } else {
                        this.submitload = false;
                      }
                    }, err => {
                      this.submitload = false;
                    });

                  } else if (datas['code'] == 300) {
                    this.submitload = false;
                    this.message.info('Quarter Acceptance Time Is Over', '');
                  } else {
                    this.submitload = false;
                    this.message.error(' Failed To Send Acceptance Form For Verification...', '');
                  }
                }, err => {
                  this.submitload = false;
                  this.message.error(' Failed To Send Acceptance Form For Verification...', '');
                })
          } else {
            this.submitload = false;
          }
        }, err => {
          this.submitload = false;
        })

  }

  cancelappliactionform() {
    this.Rulesandapply = false;
  }

  Rulesandapply = false;
  agrreconfirmation() {
    this.Rulesandapply = true;
  }

  nextUpload() {
    this.Rulesandapply = true;
  }
  handleOkform(): void {
    if (this.data.ACCEPTANCE_LETTER === null || this.data.ACCEPTANCE_LETTER === undefined || this.data.ACCEPTANCE_LETTER === '') {
      this.message.error('Please upload signed copy of acceptance letter', '');
    }
    else if (this.isagreedisable1) {
      this.message.info('Please review and accept the following terms and conditions, To proceed with your application', '');
    } else {
      this.Rulesandapply = true;
    }
  }
  calculateAgeemp() {
    const dob = new Date(this.familydata.DOB);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
      this.familydata.AGE = age - 1;
    } else {
      this.familydata.AGE = age;
    }
  }
  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Disable dates earlier than today
    return (
      current >
      new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    );
  };
  familydata1: any = [];
  housedata1: any = [];
  getfamilydata() {
    this.api
      .getfamilydata(
        0,
        0,
        '',
        'asc',
        ' AND EMP_ID=' + sessionStorage.getItem('userId')
      )
      .subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          if (data['data'].length > 0) {
            this.familydata1 = data['data'];

          } else {
            this.familydata1 = [];
          }
        }
      });
  }

  savfamload: boolean = false;
  savefamily() {
    if (
      this.familydata.NAME == null ||
      this.familydata.NAME == undefined ||
      this.familydata.NAME == ''
    ) {
      this.message.error('Please Enter Name', '');
    } else if (
      this.familydata.RELATION == null ||
      this.familydata.RELATION == undefined ||
      this.familydata.RELATION == ''
    ) {
      this.message.error('Please Select relationship', '');
    } else if (
      this.familydata.DOB == null ||
      this.familydata.DOB == undefined ||
      this.familydata.DOB == ''
    ) {
      this.message.error('Please Select date of birth', '');
    } else if (
      this.familydata.AGE == null ||
      this.familydata.AGE == undefined ||
      this.familydata.AGE == ''
    ) {
      this.message.error('Please Enter Age', '');
    } else if (
      this.familydata.GENDER == null ||
      this.familydata.GENDER == undefined ||
      this.familydata.GENDER == ''
    ) {
      this.message.error('Please Select Gender', '');
    } else {
      this.familydata.CLIENT_ID = 1;
      this.familydata.EMP_ID = sessionStorage.getItem('userId');

      if (this.familydata.ID) {
        this.savfamload = true;
        this.familydata.DOB = this.datepipe.transform(this.familydata.DOB, 'yyyy-MM-dd');
        this.isotpSpinning = true;
        this.api.updatefamily(this.familydata).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.isotpSpinning = false;
            this.isSpinning = false;
            this.savfamload = false;
            this.message.success(' Family data updated successfully', '');
            this.familydata.NAME = '';
            this.familydata.RELATION = '';
            this.familydata.DOB = '';
            this.familydata.AGE = '';
            this.familydata.GENDER = '';
            this.familydata.STATUS = '';
            this.familydata.ID = '';
            this.familydata = new FamilydataMaster();
            this.getfamilydata();
          } else {
            this.isotpSpinning = false;
            this.savfamload = false;
            this.message.error('Failed to Update Family Data', '');
          }
        }, (err) => {
          this.savfamload = false;
          this.isotpSpinning = false;
        });
      } else {
        this.isotpSpinning = true;
        this.savfamload = true;

        this.familydata.DOB = this.datepipe.transform(this.familydata.DOB, 'yyyy-MM-dd');
        this.api.Createfamily(this.familydata).subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.isotpSpinning = false;
            this.savfamload = false;
            this.isSpinning = false;
            this.message.success(' Family data saved successfully', '');
            this.familydata.NAME = '';
            this.familydata.RELATION = '';
            this.familydata.DOB = '';
            this.familydata.AGE = '';
            this.familydata.GENDER = '';
            this.familydata.STATUS = '';
            this.familydata.ID = '';
            this.familydata = new FamilydataMaster();
            this.getfamilydata();
          } else {
            this.savfamload = false;

            this.isotpSpinning = false;
            this.message.error('Failed to created Family Data', '');
          }
        }, (err) => {
          this.savfamload = false;

          this.isotpSpinning = false;
        });
      }
    }
  }

  isotpSpinning1: boolean = false;
  saveHousedetails() {
    if (
      this.housedata.LOCALITY == null ||
      this.housedata.LOCALITY == undefined ||
      this.housedata.LOCALITY.trim() == ''
    ) {
      this.message.error('Please Enter Locality', '');
    } else if (
      this.housedata.HOUSE_NO == null ||
      this.housedata.HOUSE_NO == undefined ||
      this.housedata.HOUSE_NO.trim() == ''
    ) {
      this.message.error('Please Enter House Number', '');
    } else if (
      this.housedata.MONTHLY_RENTAL_INCOME == null ||
      this.housedata.MONTHLY_RENTAL_INCOME == undefined ||
      this.housedata.MONTHLY_RENTAL_INCOME.trim() == ''
    ) {
      this.message.error('Please Enter Monthly Rental Income', '');
    } else if (
      this.housedata.MONTHLY_RENTAL_INCOME_PROOF == '' ||
      this.housedata.MONTHLY_RENTAL_INCOME_PROOF == undefined ||
      this.housedata.MONTHLY_RENTAL_INCOME_PROOF == null
    ) {
      this.message.error('Please Upload Monthly Rental Income Proof', '');
    } else {
      this.housedata.CLIENT_ID = 1;
      this.isotpSpinning1 = true;
      this.housedata.ACCEPTANCE_FORM_ID = this.suritydata.ID;
      this.api.CreateAcceptanceHoue(this.housedata).subscribe((successCode) => {
        if (successCode['code'] == '200') {
          this.isotpSpinning1 = false;
          this.isSpinning = false;
          // this.message.success('Detailes of House Submitted Successfully', '');
          this.housedata.LOCALITY = '';
          this.housedata.HOUSE_NO = '';
          this.housedata.MONTHLY_RENTAL_INCOME = '';
          this.housedata.MONTHLY_RENTAL_INCOME_PROOF = '';
          this.housedata.OWNED_BY = '';
          this.housedata.ID = '';
          this.progressBar3 = false;
          this.Payslipshow = true;

          this.housedata = new HousedataMaster();
          // this.gethousedata();
          this.api
            .getAcceptanceformsss(
              0,
              0,
              'ID',
              'desc',
              ' AND EMP_ID=' + this.empid + ' AND FINAL_ALLOTMENT_DETAILS_ID=' + this.data.ID
            )
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.suritydata = data['data'][0];

                  this.api
                    .getAcceptanceHouse(
                      0,
                      0,
                      '',
                      'asc',
                      ' AND ACCEPTANCE_FORM_ID=' + data['data'][0]['ID']
                    )
                    .subscribe((data) => {
                      if (data['code'] == 200) {
                        this.isSpinning = false;
                        if (data['data'].length > 0) {
                          this.relationdata = data['data'];
                        }
                      }
                    });
                }
              },
              (err) => {
              }
            );
        } else {
          this.isotpSpinning1 = false;
          // this.message.error('Failed to Create Details of House', '');
        }
      }, (err) => {
        this.isotpSpinning1 = false;
      });

    }
  }
  edit(data: FamilydataMaster) {
    this.familydata = data;
  }
  edit1(data: HousedataMaster) {
    this.housedata = data;
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  alphaOnly(event) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    )
      return false;
    return true;
  }

  Rulesandapplyterms: boolean = false;
  termsmodal() {
    this.Rulesandapplyterms = true;
  }
  handleOkterms() {
    this.Rulesandapplyterms = false;
  }
}