import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../commonModule/user';
import { featureMaster } from './Models/BasicForms/featureMaster';
import { moduleMaster } from './Models/BasicForms/moduleMaster';
import { taskSubtaskMaster } from './Models/BasicForms/taskSubtaskMaster';
import { EmployeeMaster } from './Models/Employee';
import { ApiService } from './Service/api.service';
import { changepassword } from '../Modal/changepasswordho';
import * as CryptoJS from 'crypto-js';
import { WebsiteService } from '../Service/website.service';
@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css'],
  providers: [DatePipe, NzNotificationService],
})
export class MedicalComponent {
  user = new User();
  isCollapsed = false;
  isLogedIn = false;
  userId = sessionStorage.getItem('userId');
  roleId = Number(sessionStorage.getItem('roleId'));
  level = Number(sessionStorage.getItem('level'));
  menus: any = [];
  USERNAME = sessionStorage.getItem('userName');
  pageName: string = '';
  scrHeight: any;
  scrWidth: any;
  @HostListener('window:resize', ['$event']) getScreenSize(event: any) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  Dwidth: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private cookie: CookieService,
    private notificationService: NzNotificationService,
    private datePipe: DatePipe,
    private api1: WebsiteService
  ) {
    if (this.scrWidth <= 500) {
      this.Dwidth = '100%';
    } else {
      this.Dwidth = '90%';
    }
    // this.loggerInit();
  }

  // loggerInit() {
  //   if (
  //     this.cookie.get('supportKey') === '' ||
  //     this.cookie.get('supportKey') === null
  //   ) {
  //     this.api.loggerInit().subscribe(
  //       (data) => {
  //         if (data['code'] == 200) {
  //           this.cookie.set(
  //             'supportKey',
  //             data['data'][0]['supportkey'],
  //             365,
  //             '',
  //             '',
  //             false,
  //             'Strict'
  //           );
  //         }
  //       },
  //       (err) => {}
  //     );
  //   } else;
  //   {
  //   }
  // }
  showsidebar: any;
  serviceid: any;
  isAdmin: any;
  ngOnInit() {
    this.employeeedit = sessionStorage.getItem('userId');
    this.serviceid = Number(localStorage.getItem('serviceid'));
    let url = window.location.href;
    var arr = url.split('/');

    this.pageName = arr[3];
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      this.isLogedIn = false;
      // this.isLogedIn=true;
    } else {
      if (this.userId || this.roleId != 0) {
        //   if(Number(sessionStorage.getItem('roleId'))!=undefined && Number(sessionStorage.getItem('roleId'))==47 || Number(sessionStorage.getItem('roleId'))==46 || Number(sessionStorage.getItem('roleId'))==48 || Number(sessionStorage.getItem('roleId'))==49 || Number(sessionStorage.getItem('roleId'))==50 ){
        //     this.isAdmin=true;
        //     // sessionStorage.setItem('isAdmin','isAdmin')
        //  }else{
        //    this.isAdmin=false;
        //  }

        this.isLogedIn = true;

        if (this.roleId == 2) {
          if (Number(localStorage.getItem('serviceid')) == 3) {
            this.showsidebar = false;
            this.router.navigateByUrl('/claim/employeeclaimmaster');
          } else if (Number(localStorage.getItem('serviceid')) == 4) {
            this.showsidebar = false;
            this.router.navigateByUrl('/claim/employeetour');
          } else if (Number(localStorage.getItem('serviceid')) == 6) {
            this.showsidebar = false;
            this.router.navigateByUrl('/claim/employeeltcmaster');
          } else if (Number(localStorage.getItem('serviceid')) == 7) {
            this.showsidebar = false;
            this.router.navigateByUrl('/claim/employeetransfer');
          }
        } else if (
          this.roleId != 2 &&
          localStorage.getItem('isfirst') == 'one'
        ) {
          localStorage.setItem('isfirst', 'two');
          this.router.navigateByUrl('/claim/dashboard');
          this.showsidebar = true;
        }

        if (this.roleId == 2) {
          this.showsidebar = false;
        } else {
          this.showsidebar = true;

          this.loadForms();
          //
        }
        // if (Number(localStorage.getItem('serviceid')) == 3) {
        //   if (this.roleId == 2) {
        //     this.showsidebar = false;
        //   } else {
        //     this.showsidebar = true;

        //     this.loadForms();
        //     //
        //   }
        // }

        // if (Number(localStorage.getItem('serviceid')) == 4) {
        //   if (this.roleId == 2) {
        //     this.showsidebar = false;
        //   } else {
        //     this.showsidebar = true;
        //     this.loadForms();
        //     //
        //   }
        // }
        // if (Number(localStorage.getItem('serviceid')) == 6) {
        //   if (this.roleId == 2) {
        //     this.showsidebar = false;
        //   } else {
        //     this.showsidebar = true;
        //     this.loadForms();
        //     //
        //   }
        // }
        // if (Number(localStorage.getItem('serviceid')) == 7) {
        //   if (this.roleId == 2) {
        //     this.showsidebar = false;
        //   } else {
        //     this.showsidebar = true;
        //     this.loadForms();
        //     // this.accessPageForRedirect();
        //   }
        // }

        if (
          this.roleId == 47 ||
          this.roleId == 46 ||
          this.roleId == 48 ||
          this.roleId == 49 ||
          this.roleId == 50 ||
          this.roleId == 56
        ) {
          this.router.navigateByUrl('/claim/dashboard');
          this.showsidebar = true;
          // this.loadForms();
        }

        let url = window.location.href;
        var arr = url.split('/');
        if (this.roleId != 2 && arr[3] != undefined) {
          if (arr[3] == 'claim') {
            if (arr[3] != undefined && arr[4] != undefined) {
              this.accessPageForRedirect(arr[3], arr[4]);
            }
          } else if (arr[3] == 'employeecorner') {
            if (arr[4] != undefined && arr[5] != undefined) {
              this.accessPageForRedirect(arr[4], arr[5]);
            }
          }
        }
      } else {
        // this.api.logoutForSessionValues();
      }
    }
    // this.api.receiveMessage()
    // this.notificationService1 = this.api.currentMessage
  }

  accessPageForRedirect(first: any, second: any) {
    if (this.roleId != 0) {
      let url = window.location.href;
      var arr = url.split('/');
      let validPage = '/' + arr[3];
      let validPage1 = '/' + first + '/' + second;
      this.api
        .getCheckAccessOfForm(this.roleId, validPage1)
        .subscribe((data) => {
          if (data['data'] == true) {
            this.router.navigateByUrl(validPage1);
            this.pageName = arr[3];
          } else {
            if (validPage != '/login') {
              // this.api.logoutForSessionValues();
              this.logout11();
              // alert('You do not have access to this page');
            }
          }
        });
    }
  }

  // loadForms() {
  //   this.api.getForms(this.roleId).subscribe((data) => {
  //     if (data['code'] == 200) {
  //       data['data'].forEach((element) => {
  //         element['children'].sort(this.sortFunction);

  //         if (element['children'].length == 0) delete element['children'];
  //       });

  //       this.menus = data['data'].sort(this.sortFunction);
  //     }
  //   });
  // }

  reports: any = [];
  logout11() {
    this.api.logoutcall().subscribe((data) => {
      if (data['code'] == '200') {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.notificationService.success('Logout Successfully', '');

        this.router.navigateByUrl('/', { replaceUrl: false });

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    });
  }
  loadForms() {
    if (
      this.roleId == 47 ||
      this.roleId == 46 ||
      this.roleId == 48 ||
      this.roleId == 49 ||
      this.roleId == 50 ||
      this.roleId == 56
    ) {
      this.api.getForms1(this.roleId).subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          data['data'].forEach((element) => {
            element['children'].sort(this.sortFunction);

            if (element['children'].length == 0) delete element['children'];
          });

          this.reports = data['data'];

          for (let k = 0; k < this.reports.length; k++) {
            if (
              this.reports[k].title != 'Medical Reports' &&
              this.reports[k].title != 'File Reports' &&
              this.reports[k].title != 'LTC Reports' &&
              this.reports[k].title != 'Tour Reports' &&
              this.reports[k].title != 'Transfer Reports' &&
              this.reports[k].title != 'ITHR Reports'
            ) {
              this.menus.push(this.reports[k]);
            }
          }

          this.menus.sort(this.sortFunction);
        }
      });
    } else {
      this.api.getForms(this.roleId).subscribe((data) => {
        if (data['code'] == 200 && data['data'].length > 0) {
          data['data'].forEach((element) => {
            element['children'].sort(this.sortFunction);
            if (element['children'].length == 0) delete element['children'];
          });

          this.reports = data['data'];

          for (let k = 0; k < this.reports.length; k++) {
            if (
              this.reports[k].title != 'Medical Reports' &&
              this.reports[k].title != 'File Reports' &&
              this.reports[k].title != 'LTC Reports' &&
              this.reports[k].title != 'Tour Reports' &&
              this.reports[k].title != 'Transfer Reports' &&
              this.reports[k].title != 'ITHR Reports'
            ) {
              this.menus.push(this.reports[k]);
            }
          }

          this.menus.sort(this.sortFunction);
        }
      });
    }
  }
  sortFunction(a, b) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }

  isSpinning = false;

  // logout() {
  //   this.isSpinning = true;

  //   setTimeout(() => {
  //     this.api.logoutForSessionValues();
  //     this.isSpinning = false;
  //   }, 1000);
  // }

  modalName = 'Create Issue';
  PROJECT_ID = 0;
  ISSUE_TYPE = '';

  MODULE_NAME = '';
  MODULE_DESCRIPTION = '';
  MODULE_ASSIGNEE_ID: any = [];
  MODULE_START_DATE: any = null;
  MODULE_END_DATE: any = null;
  MODULE_ESTIMATED_MANDAYS = 0;

  MODULE_ID = 0;
  FEATURE_NAME = '';
  FEATURE_DESCRIPTION = '';
  FEATURE_ASSIGNEE_ID: any = [];
  FEATURE_START_DATE: any = null;
  FEATURE_END_DATE: any = null;
  FEATURE_ESTIMATED_MANDAYS = 0;

  TASK_MODULE_ID = 0;
  TASK_FEATURE_ID = 0;
  TASK_NAME = '';
  TASK_DESCRIPTION = '';
  TASK_ASSIGNEE_ID: any = [];
  TASK_START_DATE: any = null;
  TASK_END_DATE: any = null;
  TASK_CATEGORY_ID = 0;
  TASK_PRIORITY = 'L';
  TASK_ESTIMATED_HOURS = 0;
  TASK_ESTIMATED_MINUTES = 0;
  TASK_ESTIMATED_SECONDS = 0;

  SUBTASK_MODULE_ID = 0;
  SUBTASK_FEATURE_ID = 0;
  PARENT_TASK_ID = 0;
  SUBTASK_NAME = '';
  SUBTASK_DESCRIPTION = '';
  SUBTASK_ASSIGNEE_ID: any = [];
  SUBTASK_START_DATE: any = null;
  SUBTASK_END_DATE: any = null;
  SUBTASK_CATEGORY_ID = 0;
  SUBTASK_PRIORITY = 'L';
  SUBTASK_ESTIMATED_HOURS = 0;
  SUBTASK_ESTIMATED_MINUTES = 0;
  SUBTASK_ESTIMATED_SECONDS = 0;

  isVisible = false;

  moduleDrawerVisible: boolean = false;
  moduleDrawerData = new moduleMaster();

  featureDrawerVisible: boolean = false;
  featureDrawerData = new featureMaster();

  taskDrawerVisible: boolean = false;
  taskDrawerData = new taskSubtaskMaster();

  subtaskDrawerVisible: boolean = false;
  subtaskDrawerData = new taskSubtaskMaster();

  isListLoading = false;

  moduleButtonHidden = true;
  featureButtonHidden = true;
  taskButtonHidden = true;
  subtaskButtonHidden = true;

  showModal(): void {
    this.loadAllProjects();

    this.PROJECT_ID = 0;
    // var defaultProject = sessionStorage.getItem("projectID");
    // this.PROJECT_ID = parseInt(defaultProject);

    this.hideShowRadioButtons();
  }

  levelVar = '0';

  hideShowRadioButtons() {
    this.moduleButtonHidden = true;
    this.featureButtonHidden = true;
    this.taskButtonHidden = true;
    this.subtaskButtonHidden = true;

    this.isVisible = true;

    this.moduleDrawerVisible = false;
    this.featureDrawerVisible = false;
    this.taskDrawerVisible = false;
    this.subtaskDrawerVisible = false;

    this.ISSUE_TYPE = '';

    if (this.levelVar == '1' || this.levelVar == '2' || this.levelVar == '3') {
      this.moduleButtonHidden = false;
      this.featureButtonHidden = false;
      this.taskButtonHidden = false;
      this.subtaskButtonHidden = false;

      // } else if(this.cookie.get("level")== "3") {
      // if(this.cookie.get("roleName")== "Project Manager") {
      //   this.moduleButtonHidden= false;
      //   this.featureButtonHidden= false;
      //   this.taskButtonHidden= true;
      //   this.subtaskButtonHidden= true;

      // } else if(this.cookie.get("roleName")== "Bussiness Analyst" || this.cookie.get("roleName")== "Owner") {
      //   this.moduleButtonHidden= false;
      //   this.featureButtonHidden= true;
      //   this.taskButtonHidden= true;
      //   this.subtaskButtonHidden= true;
      // }
    } else if (this.levelVar == '4') {
      this.moduleButtonHidden = true;
      this.featureButtonHidden = true;
      this.taskButtonHidden = false;
      this.subtaskButtonHidden = false;
    } else if (this.levelVar == '5') {
      this.moduleButtonHidden = true;
      this.featureButtonHidden = true;
      this.taskButtonHidden = true;
      this.subtaskButtonHidden = false;
    }
  }

  isFeatureModuleLoading = false;

  isTaskModuleLoading = false;
  isTaskFeatureLoading = false;
  isTaskCategoryLoading = false;

  isSubtaskModuleLoading = false;
  isSubtaskFeatureLoading = false;
  isSubtaskParentTaskLoading = false;
  isSubtaskCategoryLoading = false;

  radioButtonChange() {
    var isOK = true;
    this.moduleDrawerVisible = false;
    this.featureDrawerVisible = false;
    this.taskDrawerVisible = false;
    this.subtaskDrawerVisible = false;

    this.loadAllRoles();
    this.loadAllAssignee();

    if (this.PROJECT_ID != undefined) {
      if (
        this.PROJECT_ID.toString() == '' ||
        this.PROJECT_ID.toString() == 'NaN' ||
        this.PROJECT_ID == 0
      ) {
        isOK = false;
        this.notificationService.error('Please Select Valid Project', '');
      }
    } else {
      isOK = false;
      this.notificationService.error('Please Select Valid Project', '');
    }

    this.loadAllModules();
    this.loadAllCategories();

    if (isOK) {
      // sessionStorage.setItem("projectID", this.PROJECT_ID.toString());

      if (this.ISSUE_TYPE == 'M') {
        this.moduleDrawerVisible = true;
      } else if (this.ISSUE_TYPE == 'F') {
        this.featureDrawerVisible = true;
        this.isFeatureModuleLoading = true;
      } else if (this.ISSUE_TYPE == 'T') {
        this.taskDrawerVisible = true;
        this.isTaskModuleLoading = true;
        this.isTaskCategoryLoading = true;
      } else if (this.ISSUE_TYPE == 'S') {
        this.subtaskDrawerVisible = true;
        this.isSubtaskModuleLoading = true;
        this.isSubtaskCategoryLoading = true;
      }
    }
  }

  mappingData: any = [];

  handleOk(clear: boolean): void {
    if (this.ISSUE_TYPE == 'M') {
      var isOK = true;

      if (this.PROJECT_ID != undefined) {
        if (
          this.PROJECT_ID.toString() == '' ||
          this.PROJECT_ID.toString() == 'NaN' ||
          this.PROJECT_ID == 0
        ) {
          isOK = false;
          this.notificationService.error('Please Select Valid Project', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Project', '');
      }

      if (this.MODULE_NAME != undefined) {
        if (this.MODULE_NAME.trim() == '') {
          isOK = false;
          this.notificationService.error('Please Enter Valid Module Name', '');
        }
      }

      // if(this.MODULE_DESCRIPTION!= undefined) {
      //   if(this.MODULE_DESCRIPTION.trim()== "") {
      //     isOK= false;
      //     this.notificationService.error("Please Enter Valid Module Description","");
      //   }
      // }

      if (this.MODULE_ASSIGNEE_ID != undefined) {
        if (this.MODULE_ASSIGNEE_ID.length == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Assignee', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Assignee', '');
      }

      // if (this.MODULE_START_DATE != undefined) {
      //   if (this.MODULE_START_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid Start Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid Start Date", "");
      // }

      // if (this.MODULE_END_DATE != undefined) {
      //   if (this.MODULE_END_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid End Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid End Date", "");
      // }

      if (this.MODULE_ESTIMATED_MANDAYS != undefined) {
        if (this.MODULE_ESTIMATED_MANDAYS == null) {
          isOK = false;
          this.notificationService.error('Please Enter Valid Mandays', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Enter Valid Mandays', '');
      }

      if (isOK) {
        this.moduleDrawerData.PROJECT_ID = this.PROJECT_ID;
        this.moduleDrawerData.NAME = this.MODULE_NAME;
        this.moduleDrawerData.DESCRIPTION = this.MODULE_DESCRIPTION;
        this.moduleDrawerData.ESTIMATED_MANDAYS = this.MODULE_ESTIMATED_MANDAYS;
        this.moduleDrawerData.ESTIMATED_HOURS = 0;
        this.moduleDrawerData.ESTIMATED_MINUTES = 0;
        this.moduleDrawerData.ESTIMATED_SECONDS = 0;
        this.moduleDrawerData.START_DATE = this.datePipe.transform(
          this.MODULE_START_DATE,
          'yyyy-MM-dd'
        );
        this.moduleDrawerData.END_DATE = this.datePipe.transform(
          this.MODULE_END_DATE,
          'yyyy-MM-dd'
        );
        this.moduleDrawerData.STATUS = 'P';
        this.moduleDrawerData.IS_ACTIVE = true;

        this.moduleDrawerData.ASSIGNEES = this.MODULE_ASSIGNEE_ID;
        this.moduleDrawerData.REPORTER_ID = this.api.userId;
        this.moduleDrawerData.TYPE = 2;

        this.api.createModule(this.moduleDrawerData).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.notificationService.success(
                'Module Successfully Created',
                ''
              );
              // this.handleCancel();
              // this.modalClear();

              // Get Module Mapping Details
              var createdModuleID = successCode['insertId'];

              this.api.getModuleDetails(createdModuleID, 0).subscribe(
                (data) => {
                  if (data['code'] == '200') {
                    this.mappingData = data['data'];

                    for (var i = 0; i < this.mappingData.length; i++) {
                      for (var j = 0; j < this.MODULE_ASSIGNEE_ID.length; j++) {
                        if (
                          this.mappingData[i]['USER_ID'] ==
                          this.MODULE_ASSIGNEE_ID[j]
                        ) {
                          this.mappingData[i]['IS_ACTIVE'] = 1;
                          this.mappingData[i]['ROLE_ID'] = Number(
                            this.mappingData[i]['ROLE_IDS']
                          );
                        }
                      }
                    }

                    this.api
                      .addModuleMappingDetails(
                        createdModuleID,
                        this.mappingData
                      )
                      .subscribe((successCode) => {
                        if (successCode['code'] == '200') {
                          this.notificationService.success(
                            'Module Successfully Mapped',
                            ''
                          );

                          if (clear) {
                            this.modalClear();
                            this.handleCancel();
                          } else {
                            this.clearOnlyTextFields();
                          }
                        } else {
                          this.notificationService.error(
                            'Module Mapping Failed',
                            ''
                          );
                        }
                      });
                  }
                },
                (err) => {}
              );
            } else {
              this.notificationService.error('Failed to Create Module', '');
            }
          },
          (err) => {
            if (err['ok'] == false) {
              this.notificationService.error('Server Not Found', '');
            }
          }
        );
      }
    } else if (this.ISSUE_TYPE == 'F') {
      var isOK = true;

      if (this.PROJECT_ID != undefined) {
        if (
          this.PROJECT_ID.toString() == '' ||
          this.PROJECT_ID.toString() == 'NaN' ||
          this.PROJECT_ID == 0
        ) {
          isOK = false;
          this.notificationService.error('Please Select Valid Project', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Project', '');
      }

      if (this.MODULE_ID != undefined) {
        if (this.MODULE_ID == null || this.MODULE_ID == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Module', '');
        }
      }

      if (this.FEATURE_NAME != undefined) {
        if (this.FEATURE_NAME.trim() == '') {
          isOK = false;
          this.notificationService.error('Please Enter Valid Feature Name', '');
        }
      }

      // if(this.FEATURE_DESCRIPTION!= undefined) {
      //   if(this.FEATURE_DESCRIPTION.trim()== "") {
      //     isOK= false;
      //     this.notificationService.error("Please Enter Valid Feature Description","");
      //   }
      // }

      if (this.FEATURE_ASSIGNEE_ID != undefined) {
        if (this.FEATURE_ASSIGNEE_ID.length == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Assignee', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Assignee', '');
      }

      // if (this.FEATURE_START_DATE != undefined) {
      //   if (this.FEATURE_START_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid Start Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid Start Date", "");
      // }

      // if (this.FEATURE_END_DATE != undefined) {
      //   if (this.FEATURE_END_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid End Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid End Date", "");
      // }

      if (this.FEATURE_ESTIMATED_MANDAYS != undefined) {
        if (this.FEATURE_ESTIMATED_MANDAYS == null) {
          isOK = false;
          this.notificationService.error('Please Enter Valid Mandays', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Enter Valid Mandays', '');
      }

      if (isOK) {
        this.featureDrawerData.MODULE_ID = this.MODULE_ID;
        this.featureDrawerData.NAME = this.FEATURE_NAME;
        this.featureDrawerData.DESCRIPTION = this.FEATURE_DESCRIPTION;
        this.featureDrawerData.ESTIMATED_MANDAYS =
          this.FEATURE_ESTIMATED_MANDAYS;
        this.featureDrawerData.ESTIMATED_HOURS = 0;
        this.featureDrawerData.ESTIMATED_MINUTES = 0;
        this.featureDrawerData.ESTIMATED_SECONDS = 0;
        this.featureDrawerData.START_DATE = this.datePipe.transform(
          this.FEATURE_START_DATE,
          'yyyy-MM-dd'
        );
        this.featureDrawerData.END_DATE = this.datePipe.transform(
          this.FEATURE_END_DATE,
          'yyyy-MM-dd'
        );
        this.featureDrawerData.STATUS = 'P';
        this.featureDrawerData.IS_ACTIVE = true;

        this.featureDrawerData.ASSIGNEES = this.FEATURE_ASSIGNEE_ID;
        this.featureDrawerData.REPORTER_ID = this.api.userId;
        this.featureDrawerData.TYPE = 3;

        this.api.createFeature(this.featureDrawerData).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.notificationService.success(
                'Feature Successfully Created',
                ''
              );
              var createdFeatureID = successCode['insertId'];

              this.api.getFeatureDetails(createdFeatureID, 0).subscribe(
                (data) => {
                  if (data['code'] == '200') {
                    this.mappingData = data['data'];

                    for (var i = 0; i < this.mappingData.length; i++) {
                      for (
                        var j = 0;
                        j < this.FEATURE_ASSIGNEE_ID.length;
                        j++
                      ) {
                        if (
                          this.mappingData[i]['USER_ID'] ==
                          this.FEATURE_ASSIGNEE_ID[j]
                        ) {
                          this.mappingData[i]['IS_ACTIVE'] = 1;
                          this.mappingData[i]['ROLE_ID'] = Number(
                            this.mappingData[i]['ROLE_IDS']
                          );
                        }
                      }
                    }

                    this.api
                      .addFeatureMappingDetails(
                        createdFeatureID,
                        this.mappingData
                      )
                      .subscribe((successCode) => {
                        if (successCode['code'] == '200') {
                          this.notificationService.success(
                            'Feature Successfully Mapped',
                            ''
                          );

                          if (clear) {
                            this.modalClear();
                            this.handleCancel();
                          } else {
                            this.clearOnlyTextFields();
                          }
                        } else {
                          this.notificationService.error(
                            'Feature Mapping Failed',
                            ''
                          );
                        }
                      });
                  }
                },
                (err) => {}
              );
            } else {
              this.notificationService.error('Failed to Create Feature', '');
            }
          },
          (err) => {
            if (err['ok'] == false) {
              this.notificationService.error('Server Not Found', '');
            }
          }
        );
      }
    } else if (this.ISSUE_TYPE == 'T') {
      var isOK = true;

      if (this.PROJECT_ID != undefined) {
        if (
          this.PROJECT_ID.toString() == '' ||
          this.PROJECT_ID.toString() == 'NaN' ||
          this.PROJECT_ID == 0
        ) {
          isOK = false;
          this.notificationService.error('Please Select Valid Project', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Project', '');
      }

      if (this.TASK_MODULE_ID != undefined) {
        if (this.TASK_MODULE_ID == null || this.TASK_MODULE_ID == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Module', '');
        }
      }

      if (this.TASK_FEATURE_ID != undefined) {
        if (this.TASK_FEATURE_ID == null || this.TASK_FEATURE_ID == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Feature', '');
        }
      }

      if (this.TASK_NAME != undefined) {
        if (this.TASK_NAME.trim() == '') {
          isOK = false;
          this.notificationService.error('Please Enter Valid Task Name', '');
        }
      }

      // if(this.TASK_DESCRIPTION!= undefined) {
      //   if(this.TASK_DESCRIPTION.trim()== "") {
      //     isOK= false;
      //     this.notificationService.error("Please Enter Valid Task Description","");
      //   }
      // }

      if (this.TASK_ASSIGNEE_ID != undefined) {
        if (this.TASK_ASSIGNEE_ID.length == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Assignee', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Assignee', '');
      }

      if (this.TASK_CATEGORY_ID != undefined) {
        if (this.TASK_CATEGORY_ID == null || this.TASK_CATEGORY_ID == 0) {
          isOK = false;
          this.notificationService.error(
            'Please Select Valid Task Category',
            ''
          );
        }
      }

      if (this.TASK_PRIORITY != undefined) {
        if (this.TASK_PRIORITY == '') {
          isOK = false;
          this.notificationService.error(
            'Please Select Valid Task Priority',
            ''
          );
        }
      }

      // if (this.TASK_START_DATE != undefined) {
      //   if (this.TASK_START_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid Start Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid Start Date", "");
      // }

      // if (this.TASK_END_DATE != undefined) {
      //   if (this.TASK_END_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid End Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid End Date", "");
      // }

      if (this.TASK_ESTIMATED_HOURS != undefined) {
        if (this.TASK_ESTIMATED_HOURS == null) {
          isOK = false;
          this.notificationService.error(
            'Please Enter Valid Estimate Hours',
            ''
          );
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Enter Valid Estimate Hours', '');
      }

      if (this.TASK_ESTIMATED_MINUTES != undefined) {
        if (this.TASK_ESTIMATED_MINUTES == null) {
          isOK = false;
          this.notificationService.error(
            'Please Enter Valid Estimate Minutes',
            ''
          );
        }
      } else {
        isOK = false;
        this.notificationService.error(
          'Please Enter Valid Estimate Minutes',
          ''
        );
      }

      if (this.TASK_ESTIMATED_SECONDS != undefined) {
        if (this.TASK_ESTIMATED_SECONDS == null) {
          isOK = false;
          this.notificationService.error(
            'Please Enter Valid Estimate Seconds',
            ''
          );
        }
      } else {
        isOK = false;
        this.notificationService.error(
          'Please Enter Valid Estimate Seconds',
          ''
        );
      }

      if (isOK) {
        this.taskDrawerData.TASK_CATEGORY_ID = this.TASK_CATEGORY_ID;
        this.taskDrawerData.FEATURE_ID = this.TASK_FEATURE_ID;
        this.taskDrawerData.PARENT_ID = 0;
        this.taskDrawerData.NAME = this.TASK_NAME;
        this.taskDrawerData.DESCRIPTION = this.TASK_DESCRIPTION;
        this.taskDrawerData.ESTIMATED_HOURS = this.TASK_ESTIMATED_HOURS;
        this.taskDrawerData.ESTIMATED_MINUTES = this.TASK_ESTIMATED_MINUTES;
        this.taskDrawerData.ESTIMATED_SECONDS = this.TASK_ESTIMATED_SECONDS;

        this.taskDrawerData.PRIORITY = this.TASK_PRIORITY;

        this.taskDrawerData.TIME_TRACKED = new Date();
        this.taskDrawerData.TIME_TRACKED =
          this.datePipe.transform(this.taskDrawerData.TIME_TRACKED, 'HH:mm') +
          ':00';

        this.taskDrawerData.STATUS = 'P';

        this.taskDrawerData.START_DATE = this.datePipe.transform(
          this.TASK_START_DATE,
          'yyyy-MM-dd'
        );
        this.taskDrawerData.END_DATE = this.datePipe.transform(
          this.TASK_END_DATE,
          'yyyy-MM-dd'
        );

        this.taskDrawerData.IS_CHILD = false;
        this.taskDrawerData.DEPENDENT_TASK_ID = 0;

        this.taskDrawerData.UPDATED_DATETIME = new Date();
        this.taskDrawerData.UPDATED_DATETIME =
          this.datePipe.transform(
            this.taskDrawerData.UPDATED_DATETIME,
            'yyyy-MM-dd HH:mm'
          ) + ':00';

        this.taskDrawerData.TAGS = '';
        this.taskDrawerData.PROGRESS = 0;
        this.taskDrawerData.IS_ACTIVE = true;

        this.taskDrawerData.ASSIGNEES = this.TASK_ASSIGNEE_ID;
        this.taskDrawerData.REPORTER_ID = this.api.userId;
        this.taskDrawerData.TYPE = 4;

        this.api.createTaskSubtask(this.taskDrawerData).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.notificationService.success('Task Successfully Created', '');
              // this.handleCancel();
              // this.modalClear();

              var createdTaskID = successCode['insertId'];

              this.api.getTaskSubtaskDetails(createdTaskID, 0).subscribe(
                (data) => {
                  if (data['code'] == '200') {
                    this.mappingData = data['data'];

                    for (var i = 0; i < this.mappingData.length; i++) {
                      for (var j = 0; j < this.TASK_ASSIGNEE_ID.length; j++) {
                        if (
                          this.mappingData[i]['USER_ID'] ==
                          this.TASK_ASSIGNEE_ID[j]
                        ) {
                          this.mappingData[i]['IS_ACTIVE'] = 1;
                          this.mappingData[i]['ROLE_ID'] = Number(
                            this.mappingData[i]['ROLE_IDS']
                          );
                        }
                      }
                    }

                    this.api
                      .addTaskSubtaskMappingDetails(
                        createdTaskID,
                        this.mappingData
                      )
                      .subscribe((successCode) => {
                        if (successCode['code'] == '200') {
                          this.notificationService.success(
                            'Task Successfully Mapped',
                            ''
                          );

                          if (clear) {
                            this.modalClear();
                            this.handleCancel();
                          } else {
                            this.clearOnlyTextFields();
                          }
                        } else {
                          this.notificationService.error(
                            'Task Mapping Failed',
                            ''
                          );
                        }
                      });
                  }
                },
                (err) => {}
              );
            } else {
              this.notificationService.error('Failed to Create Task', '');
            }
          },
          (err) => {
            if (err['ok'] == false) {
              this.notificationService.error('Server Not Found', '');
            }
          }
        );
      }
    } else if (this.ISSUE_TYPE == 'S') {
      var isOK = true;

      if (this.PROJECT_ID != undefined) {
        if (
          this.PROJECT_ID.toString() == '' ||
          this.PROJECT_ID.toString() == 'NaN' ||
          this.PROJECT_ID == 0
        ) {
          isOK = false;
          this.notificationService.error('Please Select Valid Project', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Project', '');
      }

      if (this.SUBTASK_MODULE_ID != undefined) {
        if (this.SUBTASK_MODULE_ID == null || this.SUBTASK_MODULE_ID == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Module', '');
        }
      }

      if (this.SUBTASK_FEATURE_ID != undefined) {
        if (this.SUBTASK_FEATURE_ID == null || this.SUBTASK_FEATURE_ID == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Feature', '');
        }
      }

      if (this.PARENT_TASK_ID != undefined) {
        if (this.PARENT_TASK_ID == null || this.PARENT_TASK_ID == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Parent Task', '');
        }
      }

      if (this.SUBTASK_NAME != undefined) {
        if (this.SUBTASK_NAME.trim() == '') {
          isOK = false;
          this.notificationService.error('Please Enter Valid Subtask Name', '');
        }
      }

      // if(this.SUBTASK_DESCRIPTION!= undefined) {
      //   if(this.SUBTASK_DESCRIPTION.trim()== "") {
      //     isOK= false;
      //     this.notificationService.error("Please Enter Valid Subtask Description","");
      //   }
      // }

      if (this.SUBTASK_ASSIGNEE_ID != undefined) {
        if (this.SUBTASK_ASSIGNEE_ID.length == 0) {
          isOK = false;
          this.notificationService.error('Please Select Valid Assignee', '');
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Select Valid Assignee', '');
      }

      if (this.SUBTASK_CATEGORY_ID != undefined) {
        if (this.SUBTASK_CATEGORY_ID == null || this.SUBTASK_CATEGORY_ID == 0) {
          isOK = false;
          this.notificationService.error(
            'Please Select Valid Subtask Category',
            ''
          );
        }
      }

      if (this.SUBTASK_PRIORITY != undefined) {
        if (this.SUBTASK_PRIORITY == '') {
          isOK = false;
          this.notificationService.error(
            'Please Select Valid Subtask Priority',
            ''
          );
        }
      }

      // if (this.SUBTASK_START_DATE != undefined) {
      //   if (this.SUBTASK_START_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid Start Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid Start Date", "");
      // }

      // if (this.SUBTASK_END_DATE != undefined) {
      //   if (this.SUBTASK_END_DATE == null) {
      //     isOK = false;
      //     this.notificationService.error("Please Select Valid End Date", "");
      //   }
      // } else {
      //   isOK = false;
      //   this.notificationService.error("Please Select Valid End Date", "");
      // }

      if (this.SUBTASK_ESTIMATED_HOURS != undefined) {
        if (this.SUBTASK_ESTIMATED_HOURS == null) {
          isOK = false;
          this.notificationService.error(
            'Please Enter Valid Estimate Hours',
            ''
          );
        }
      } else {
        isOK = false;
        this.notificationService.error('Please Enter Valid Estimate Hours', '');
      }

      if (this.SUBTASK_ESTIMATED_MINUTES != undefined) {
        if (this.SUBTASK_ESTIMATED_MINUTES == null) {
          isOK = false;
          this.notificationService.error(
            'Please Enter Valid Estimate Minutes',
            ''
          );
        }
      } else {
        isOK = false;
        this.notificationService.error(
          'Please Enter Valid Estimate Minutes',
          ''
        );
      }

      if (this.SUBTASK_ESTIMATED_SECONDS != undefined) {
        if (this.SUBTASK_ESTIMATED_SECONDS == null) {
          isOK = false;
          this.notificationService.error(
            'Please Enter Valid Estimate Seconds',
            ''
          );
        }
      } else {
        isOK = false;
        this.notificationService.error(
          'Please Enter Valid Estimate Seconds',
          ''
        );
      }

      if (isOK) {
        this.taskDrawerData.TASK_CATEGORY_ID = this.SUBTASK_CATEGORY_ID;
        this.taskDrawerData.FEATURE_ID = this.SUBTASK_FEATURE_ID;
        this.taskDrawerData.PARENT_ID = this.PARENT_TASK_ID;
        this.taskDrawerData.NAME = this.SUBTASK_NAME;
        this.taskDrawerData.DESCRIPTION = this.SUBTASK_DESCRIPTION;
        this.taskDrawerData.ESTIMATED_HOURS = this.SUBTASK_ESTIMATED_HOURS;
        this.taskDrawerData.ESTIMATED_MINUTES = this.SUBTASK_ESTIMATED_MINUTES;
        this.taskDrawerData.ESTIMATED_SECONDS = this.SUBTASK_ESTIMATED_SECONDS;

        this.taskDrawerData.PRIORITY = this.SUBTASK_PRIORITY;

        this.taskDrawerData.TIME_TRACKED = new Date();
        this.taskDrawerData.TIME_TRACKED =
          this.datePipe.transform(this.taskDrawerData.TIME_TRACKED, 'HH:mm') +
          ':00';

        this.taskDrawerData.STATUS = 'P';

        this.taskDrawerData.START_DATE = this.datePipe.transform(
          this.SUBTASK_START_DATE,
          'yyyy-MM-dd'
        );
        this.taskDrawerData.END_DATE = this.datePipe.transform(
          this.SUBTASK_END_DATE,
          'yyyy-MM-dd'
        );

        this.taskDrawerData.IS_CHILD = false;
        this.taskDrawerData.DEPENDENT_TASK_ID = 0;

        this.taskDrawerData.UPDATED_DATETIME = new Date();
        this.taskDrawerData.UPDATED_DATETIME =
          this.datePipe.transform(
            this.taskDrawerData.UPDATED_DATETIME,
            'yyyy-MM-dd HH:mm'
          ) + ':00';

        this.taskDrawerData.TAGS = '';
        this.taskDrawerData.PROGRESS = 0;
        this.taskDrawerData.IS_ACTIVE = true;

        this.taskDrawerData.ASSIGNEES = this.SUBTASK_ASSIGNEE_ID;
        this.taskDrawerData.REPORTER_ID = this.api.userId;
        this.taskDrawerData.TYPE = 5;

        this.api.createTaskSubtask(this.taskDrawerData).subscribe(
          (successCode) => {
            if (successCode['code'] == '200') {
              this.notificationService.success(
                'Subtask Successfully Created',
                ''
              );
              // this.handleCancel();
              // this.modalClear();

              var createdTaskID = successCode['insertId'];

              this.api.getTaskSubtaskDetails(createdTaskID, 0).subscribe(
                (data) => {
                  if (data['code'] == '200') {
                    this.mappingData = data['data'];

                    for (var i = 0; i < this.mappingData.length; i++) {
                      for (
                        var j = 0;
                        j < this.SUBTASK_ASSIGNEE_ID.length;
                        j++
                      ) {
                        if (
                          this.mappingData[i]['USER_ID'] ==
                          this.SUBTASK_ASSIGNEE_ID[j]
                        ) {
                          this.mappingData[i]['IS_ACTIVE'] = 1;
                          this.mappingData[i]['ROLE_ID'] = Number(
                            this.mappingData[i]['ROLE_IDS']
                          );
                        }
                      }
                    }

                    this.api
                      .addTaskSubtaskMappingDetails(
                        createdTaskID,
                        this.mappingData
                      )
                      .subscribe((successCode) => {
                        if (successCode['code'] == '200') {
                          this.notificationService.success(
                            'Subtask Successfully Mapped',
                            ''
                          );

                          if (clear) {
                            this.modalClear();
                            this.handleCancel();
                          } else {
                            this.clearOnlyTextFields();
                          }
                        } else {
                          this.notificationService.error(
                            'Subtask Mapping Failed',
                            ''
                          );
                        }
                      });
                  }
                },
                (err) => {}
              );
            } else {
              this.notificationService.error('Failed to Create Subtask', '');
            }
          },
          (err) => {
            if (err['ok'] == false) {
              this.notificationService.error('Server Not Found', '');
            }
          }
        );
      }
    }
  }

  moduleDrawerClose() {
    this.moduleDrawerVisible = false;
  }

  callBackModuleDrawerClose() {
    this.moduleDrawerClose.bind(this);
  }

  featureDrawerClose() {
    this.featureDrawerVisible = false;
  }

  callBackFeatureDrawerClose() {
    this.featureDrawerClose.bind(this);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.modalClear();

    window.location.reload();
  }

  modalClear() {
    this.ISSUE_TYPE = '';
    this.moduleDrawerVisible = false;
    this.featureDrawerVisible = false;
    this.taskDrawerVisible = false;
    this.subtaskDrawerVisible = false;

    this.MODULE_NAME = '';
    this.MODULE_DESCRIPTION = '';
    this.MODULE_ASSIGNEE_ID = [];
    this.MODULE_START_DATE = null;
    this.MODULE_END_DATE = null;
    this.MODULE_ESTIMATED_MANDAYS = 0;

    this.MODULE_ID = 0;
    this.FEATURE_NAME = '';
    this.FEATURE_DESCRIPTION = '';
    this.FEATURE_ASSIGNEE_ID = [];
    this.FEATURE_START_DATE = null;
    this.FEATURE_END_DATE = null;
    this.FEATURE_ESTIMATED_MANDAYS = 0;

    this.TASK_MODULE_ID = 0;
    this.TASK_FEATURE_ID = 0;
    this.TASK_NAME = '';
    this.TASK_DESCRIPTION = '';
    this.TASK_ASSIGNEE_ID = [];
    this.TASK_START_DATE = null;
    this.TASK_END_DATE = null;
    this.TASK_CATEGORY_ID = 0;
    this.TASK_PRIORITY = 'L';
    this.TASK_ESTIMATED_HOURS = 0;
    this.TASK_ESTIMATED_MINUTES = 0;
    this.TASK_ESTIMATED_SECONDS = 0;

    this.SUBTASK_MODULE_ID = 0;
    this.SUBTASK_FEATURE_ID = 0;
    this.PARENT_TASK_ID = 0;
    this.SUBTASK_NAME = '';
    this.SUBTASK_DESCRIPTION = '';
    this.SUBTASK_ASSIGNEE_ID = [];
    this.SUBTASK_START_DATE = null;
    this.SUBTASK_END_DATE = null;
    this.SUBTASK_CATEGORY_ID = 0;
    this.SUBTASK_PRIORITY = 'L';
    this.SUBTASK_ESTIMATED_HOURS = 0;
    this.SUBTASK_ESTIMATED_MINUTES = 0;
    this.SUBTASK_ESTIMATED_SECONDS = 0;
  }

  clearOnlyTextFields() {
    // this.ISSUE_TYPE = "";
    // this.moduleDrawerVisible = false;
    // this.featureDrawerVisible = false;
    // this.taskDrawerVisible = false;
    // this.subtaskDrawerVisible = false;

    this.MODULE_NAME = '';
    this.MODULE_DESCRIPTION = '';
    // this.MODULE_ASSIGNEE_ID = [];
    this.MODULE_START_DATE = null;
    this.MODULE_END_DATE = null;
    this.MODULE_ESTIMATED_MANDAYS = 0;

    // this.MODULE_ID = 0;
    this.FEATURE_NAME = '';
    this.FEATURE_DESCRIPTION = '';
    // this.FEATURE_ASSIGNEE_ID = [];
    this.FEATURE_START_DATE = null;
    this.FEATURE_END_DATE = null;
    this.FEATURE_ESTIMATED_MANDAYS = 0;

    // this.TASK_MODULE_ID = 0;
    // this.TASK_FEATURE_ID = 0;
    this.TASK_NAME = '';
    this.TASK_DESCRIPTION = '';
    // this.TASK_ASSIGNEE_ID = [];
    this.TASK_START_DATE = null;
    this.TASK_END_DATE = null;
    // this.TASK_CATEGORY_ID = 0;
    this.TASK_PRIORITY = 'L';
    this.TASK_ESTIMATED_HOURS = 0;
    this.TASK_ESTIMATED_MINUTES = 0;
    this.TASK_ESTIMATED_SECONDS = 0;

    // this.SUBTASK_MODULE_ID = 0;
    // this.SUBTASK_FEATURE_ID = 0;
    // this.PARENT_TASK_ID = 0;
    this.SUBTASK_NAME = '';
    this.SUBTASK_DESCRIPTION = '';
    // this.SUBTASK_ASSIGNEE_ID = [];
    this.SUBTASK_START_DATE = null;
    this.SUBTASK_END_DATE = null;
    // this.SUBTASK_CATEGORY_ID = 0;
    this.SUBTASK_PRIORITY = 'L';
    this.SUBTASK_ESTIMATED_HOURS = 0;
    this.SUBTASK_ESTIMATED_MINUTES = 0;
    this.SUBTASK_ESTIMATED_SECONDS = 0;
  }

  projectList = [];

  loadAllProjects() {
    this.projectList = [];
    this.isListLoading = true;

    if (
      sessionStorage.getItem('level') == '1' ||
      sessionStorage.getItem('level') == '2' ||
      sessionStorage.getItem('level') == '3'
    ) {
      this.api
        .getAllProjects(0, 0, 'START_DATE', 'desc', ' and IS_ACTIVE=1')
        .subscribe(
          (projectData) => {
            if (projectData['code'] == 200) {
              this.isListLoading = false;
              this.projectList = projectData['data'];
            }
          },
          (err) => {}
        );
    } else {
      this.api
        .getAllMappedProjects(
          0,
          0,
          'START_DATE',
          'desc',
          ' and IS_ACTIVE=1 and USER_ID=' + this.api.userId
        )
        .subscribe(
          (projectData) => {
            if (projectData['code'] == 200) {
              this.isListLoading = false;
              this.projectList = projectData['data'];
            }
          },
          (err) => {}
        );
    }
  }

  assigneeList = [];

  loadAllAssignee() {
    this.assigneeList = [];
    var USER_ID = this.api.userId;

    this.api
      .getAllMappedUsers(
        0,
        0,
        'LEVEL',
        'asc',
        ' and IS_ACTIVE=1 and PROJECT_ID=' + this.PROJECT_ID
      )
      .subscribe(
        (userData) => {
          if (userData['code'] == 200) {
            this.assigneeList = userData['data'];

            this.findNewAssigneeList();
          }
        },
        (err) => {}
      );
  }

  roleData = [];

  loadAllRoles() {
    this.roleData = [];

    var level = sessionStorage.getItem('level');
    var nextLevel = Number(sessionStorage.getItem('level')) + 1;

    level = level + ',' + nextLevel;

    if (
      sessionStorage.getItem('level') == '1' ||
      sessionStorage.getItem('level') == '2'
    ) {
      this.api.getAllRoles(0, 0, 'ID', 'desc', '').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.roleData = data['data'];

            this.findNewAssigneeList();
          }
        },
        (err) => {}
      );
    } else {
      // this.api.getAllRoles(0, 0, 'ID', 'desc', ' and LEVEL in (' + level + ')').subscribe(data => {
      this.api.getAllRoles(0, 0, 'ID', 'asc', '').subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.roleData = data['data'];

            this.findNewAssigneeList();
          }
        },
        (err) => {}
      );
    }
  }

  newAssigneeList = [];

  findNewAssigneeList() {
    this.newAssigneeList = [];

    for (var j = 0; j < this.roleData.length; j++) {
      for (var k = 0; k < this.assigneeList.length; k++) {
        if (this.assigneeList[k]['ROLE_ID'] == this.roleData[j]['ID']) {
          this.newAssigneeList.push(this.assigneeList[k]);
        }
      }
    }

    // Pre select of Level 3 Users
    this.MODULE_ASSIGNEE_ID = [];
    this.FEATURE_ASSIGNEE_ID = [];
    this.TASK_ASSIGNEE_ID = [];
    this.SUBTASK_ASSIGNEE_ID = [];

    var currentCat = 0;

    for (var i = 0; i < this.newAssigneeList.length; i++) {
      if (this.newAssigneeList[i]['LEVEL'] == 3) {
        this.MODULE_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
        this.TASK_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
        this.SUBTASK_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
      }

      if (
        this.newAssigneeList[i]['LEVEL'] == 3 ||
        this.newAssigneeList[i]['LEVEL'] == 4
      ) {
        this.FEATURE_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
      }

      if (this.newAssigneeList[i]['LEVEL'] == 4) {
        if (
          this.newAssigneeList[i]['USER_ID'] ==
          Number(sessionStorage.getItem('userId'))
        ) {
          this.TASK_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
          this.SUBTASK_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);

          currentCat = this.newAssigneeList[i]['TASK_CATEGORY_ID'];
          this.TASK_CATEGORY_ID = currentCat;
        }
      }

      if (this.newAssigneeList[i]['LEVEL'] == 5) {
        if (this.newAssigneeList[i]['TASK_CATEGORY_ID'] == currentCat) {
          this.TASK_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
          this.SUBTASK_ASSIGNEE_ID.push(this.newAssigneeList[i]['USER_ID']);
        }
      }
    }
  }

  loadModal() {
    this.getRoleProjectWise(this.PROJECT_ID);
  }

  moduleList = [];

  loadAllModules() {
    sessionStorage.setItem('projectID', this.PROJECT_ID.toString());

    if (this.ISSUE_TYPE == 'M') {
      this.moduleDrawerVisible = true;
    } else if (this.ISSUE_TYPE == 'F') {
      this.featureDrawerVisible = true;
    } else if (this.ISSUE_TYPE == 'T') {
      this.taskDrawerVisible = true;
    } else if (this.ISSUE_TYPE == 'S') {
      this.subtaskDrawerVisible = true;
    }

    this.moduleList = [];
    this.loadAllAssignee();

    // this.MODULE_ID = 0;
    // this.TASK_MODULE_ID = 0;
    // this.SUBTASK_MODULE_ID = 0;

    this.isFeatureModuleLoading = true;
    this.isTaskModuleLoading = true;
    this.isSubtaskModuleLoading = true;

    this.api
      .getAllModules(
        0,
        0,
        'ID',
        'asc',
        ' and IS_ACTIVE=1 and PROJECT_ID=' + this.PROJECT_ID
      )
      .subscribe(
        (moduleData) => {
          if (moduleData['code'] == 200) {
            this.isFeatureModuleLoading = false;
            this.isTaskModuleLoading = false;
            this.isSubtaskModuleLoading = false;
            this.moduleList = moduleData['data'];
          }
        },
        (err) => {}
      );
  }

  getRoleProjectWise(projectID) {
    this.api.getProjectDetails(projectID, 0).subscribe(
      (data) => {
        if (data['code'] == 200) {
          var roleData = data['data'];

          var roleData1 = roleData.filter((obj) => {
            return obj.USER_ID == this.api.userId;
          });

          // Get Level Role ID Wise
          this.api
            .getAllRoles(0, 0, '', '', ' and ID=' + roleData1[0]['ROLE_ID'])
            .subscribe(
              (data) => {
                if (data['code'] == 200) {
                  this.levelVar = data['data'][0]['LEVEL'];
                  this.hideShowRadioButtons();
                }
              },
              (err) => {
                if (err['ok'] == false)
                  this.notificationService.error('Server Not Found', '');
              }
            );
        }
      },
      (err) => {}
    );
  }

  fillTaskFeatureModuleWise(moduleID) {
    this.TASK_FEATURE_ID = 0;
    this.isTaskFeatureLoading = true;

    this.loadAllTaskFeatures(moduleID);
  }

  fillSubtaskFeatureModuleWise(moduleID) {
    this.SUBTASK_FEATURE_ID = 0;
    this.PARENT_TASK_ID = 0;
    this.isSubtaskFeatureLoading = true;

    this.loadAllSubtaskFeatures(moduleID);
  }

  taskFeatureList = [];
  loadAllTaskFeatures(moduleID) {
    this.taskFeatureList = [];

    this.api
      .getAllFeatures(
        0,
        0,
        'ID',
        'asc',
        ' and IS_ACTIVE=1 and MODULE_ID=' + moduleID
      )
      .subscribe(
        (featureData) => {
          if (featureData['code'] == 200) {
            this.isTaskFeatureLoading = false;
            this.taskFeatureList = featureData['data'];
          }
        },
        (err) => {}
      );
  }

  subtaskFeatureList = [];
  loadAllSubtaskFeatures(moduleID) {
    this.subtaskFeatureList = [];

    this.api
      .getAllFeatures(
        0,
        0,
        'ID',
        'asc',
        ' and IS_ACTIVE=1 and MODULE_ID=' + moduleID
      )
      .subscribe(
        (featureData) => {
          if (featureData['code'] == 200) {
            this.isSubtaskFeatureLoading = false;
            this.subtaskFeatureList = featureData['data'];
          }
        },
        (err) => {}
      );
  }

  categoryList = [];

  loadAllCategories() {
    this.categoryList = [];

    this.api.getAllCategories(0, 0, 'ID', 'asc', ' and IS_ACTIVE=1').subscribe(
      (categoryData) => {
        if (categoryData['code'] == 200) {
          this.isTaskCategoryLoading = false;
          this.isSubtaskCategoryLoading = false;
          this.categoryList = categoryData['data'];

          this.TASK_CATEGORY_ID = 0;
          this.SUBTASK_CATEGORY_ID = 0;
          var USER_ID = this.api.userId;

          this.api
            .getAllUsers(0, 0, 'ID', 'desc', ' and ID=' + USER_ID)
            .subscribe(
              (userData) => {
                this.TASK_CATEGORY_ID = userData['data'][0]['TASK_CATEGORY_ID'];
                this.SUBTASK_CATEGORY_ID =
                  userData['data'][0]['TASK_CATEGORY_ID'];
              },
              (err) => {}
            );
        }
      },
      (err) => {}
    );
  }

  fillTaskSubtaskFeatureWise(featureID) {
    this.PARENT_TASK_ID = 0;
    this.isSubtaskParentTaskLoading = true;
    this.loadAllParentTasks(featureID);
  }

  parentTaskList = [];
  loadAllParentTasks(featureID) {
    this.parentTaskList = [];

    this.api
      .getAllTaskSubtask(
        0,
        0,
        'ID',
        'asc',
        ' and IS_ACTIVE=1 and PARENT_ID=0 and FEATURE_ID=' + featureID
      )
      .subscribe(
        (taskData) => {
          if (taskData['code'] == 200) {
            this.isSubtaskParentTaskLoading = false;
            this.parentTaskList = taskData['data'];
          }
        },
        (err) => {}
      );
  }

  @ViewChild('moduleEndDatePicker') moduleEndDatePicker: NzDatePickerComponent;

  moduleStartDateHandle(open: boolean) {
    this.MODULE_END_DATE = null;

    if (!open) {
      this.moduleEndDatePicker.open();
      this.MODULE_END_DATE = this.MODULE_START_DATE;
    }
  }

  @ViewChild('featureEndDatePicker')
  featureEndDatePicker: NzDatePickerComponent;

  featureStartDateHandle(open: boolean) {
    this.FEATURE_END_DATE = null;

    if (!open) {
      this.featureEndDatePicker.open();
      this.FEATURE_END_DATE = this.FEATURE_START_DATE;
    }
  }

  @ViewChild('taskEndDatePicker') taskEndDatePicker: NzDatePickerComponent;

  taskStartDateHandle(open: boolean) {
    this.TASK_END_DATE = null;

    if (!open) {
      this.taskEndDatePicker.open();
      this.TASK_END_DATE = this.TASK_START_DATE;
    }
  }

  @ViewChild('subtaskEndDatePicker')
  subtaskEndDatePicker: NzDatePickerComponent;

  subtaskStartDateHandle(open: boolean) {
    this.SUBTASK_END_DATE = null;

    if (!open) {
      this.subtaskEndDatePicker.open();
      this.SUBTASK_END_DATE = this.SUBTASK_START_DATE;
    }
  }

  // disabledModuleEndDate = (endValue: Date): boolean => {
  //   if (this.MODULE_START_DATE != null) {
  //     if (!endValue) {
  //       return false;
  //     }

  //     var modulePreviousDate = new Date(this.MODULE_START_DATE);
  //     modulePreviousDate.setDate(modulePreviousDate.getDate() + -1);

  //     return endValue <= new Date(modulePreviousDate);
  //   }
  // };

  // disabledFeatureEndDate = (endValue: Date): boolean => {
  //   if (this.FEATURE_START_DATE != null) {
  //     if (!endValue) {
  //       return false;
  //     }

  //     var featurePreviousDate = new Date(this.FEATURE_START_DATE);
  //     featurePreviousDate.setDate(featurePreviousDate.getDate() + -1);

  //     return endValue <= new Date(featurePreviousDate);
  //   }
  // };

  // disabledTaskEndDate = (endValue: Date): boolean => {
  //   if (this.TASK_START_DATE != null) {
  //     if (!endValue) {
  //       return false;
  //     }

  //     var taskPreviousDate = new Date(this.TASK_START_DATE);
  //     taskPreviousDate.setDate(taskPreviousDate.getDate() + -1);

  //     return endValue <= new Date(taskPreviousDate);
  //   }
  // };

  // disabledSubtaskEndDate = (endValue: Date): boolean => {
  //   if (this.SUBTASK_START_DATE != null) {
  //     if (!endValue) {
  //       return false;
  //     }

  //     var subtaskPreviousDate = new Date(this.SUBTASK_START_DATE);
  //     subtaskPreviousDate.setDate(subtaskPreviousDate.getDate() + -1);

  //     return endValue <= new Date(subtaskPreviousDate);
  //   }
  // };

  generateBadge(nameForBadge: string) {
    return this.api.createBadge(nameForBadge);
  }

  isVisible1 = false;
  PASSWORD: any = '';
  NEW_PASSWORD: any = '';
  CONFPASSWORD: any = '';

  changepass(): void {
    this.NEW_PASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
    this.isVisible1 = true;
  }
  handleCancel1(): void {
    window.location.reload();
    this.isVisible1 = false;
    this.NEW_PASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
  }

  USER_ID: any;
  ID: any = sessionStorage.getItem('userId');
  showconfirm = false;
  checkpass() {
    this.api.getcheckpassword(this.ID, this.PASSWORD).subscribe(
      (data) => {
        // this.user = data['data'][0];
        if (data['code'] == 200) {
          this.showconfirm = true;
        } else {
          this.showconfirm = false;
          this.notificationService.error('Please Enter Correct Password', '');
        }
      },
      (err) => {}
    );
  }
  isOk = true;
  userid: any;
  confpass() {
    this.isSpinning = false;
    this.isOk = true;

    this.user.USER_ID = this.userid;

    if (this.NEW_PASSWORD.trim() == '' && this.CONFPASSWORD.trim() == '') {
      this.isOk = false;
      this.notificationService.error('Please Enter All Fields', '');
    } else if (
      this.NEW_PASSWORD == undefined ||
      this.NEW_PASSWORD.trim() == ''
    ) {
      this.isOk = false;
      this.notificationService.error('Please Enter New Password', '');
    } else if (
      this.CONFPASSWORD == undefined ||
      this.CONFPASSWORD.trim() == ''
    ) {
      this.isOk = false;
      this.notificationService.error(
        'Please Enter Correct Confirm Password',
        ''
      );
    } else if (this.NEW_PASSWORD == this.CONFPASSWORD) {
      this.user.PASSWORD = this.NEW_PASSWORD;
      this.api
        .userchangepassord(this.ID, this.NEW_PASSWORD)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.notificationService.success(
              'Password Changed Successfully...',
              ''
            );
            window.location.reload();
            this.isVisible = false;
            this.NEW_PASSWORD = '';
            this.CONFPASSWORD = '';
            this.PASSWORD = '';

            this.isSpinning = false;
          } else {
            this.notificationService.error('Password Change Failed...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.notificationService.error(
        'New Password & Confirm Password Must Be Same',
        ''
      );
    }
  }

  ///////////////////////////////////////////
  dataList = [];
  drawerVisible: boolean = false;
  drawerTitle!: string;
  employeeedit: any;
  drawerData: EmployeeMaster = new EmployeeMaster();
  drawerClose(): void {
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  edit(): void {
    this.drawerTitle = 'Update Employee ';
    // this.drawerData = Object.assign({}, data);
    this.api
      .getEmployeeMaster(0, 0, '', '', ' AND ID =' + this.employeeedit)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.drawerData = Object.assign({}, data['data'][0]);
          }
          this.drawerVisible = true;
        },
        (err) => {}
      );
  }

  isVisible2: boolean = false;
  changepass1(): void {
    this.NEW_PASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
    this.isVisible2 = true;
  }
  handleCancel11(): void {
    window.location.reload();
    this.isVisible2 = false;
    this.NEW_PASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
  }

  checkpassemp() {
    this.api.getemployeecheckpassword(this.ID, this.PASSWORD).subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.showconfirm = true;
        } else {
          this.showconfirm = false;
          this.notificationService.error('Please Enter Correct Password', '');
        }
      },
      (err) => {}
    );
  }
  console() {
    this.router.navigate(['/my-profile']);
  }
  confpassemp() {
    this.isSpinning = false;
    this.isOk = true;

    this.user.USER_ID = this.userid;

    if (this.NEW_PASSWORD.trim() == '' && this.CONFPASSWORD.trim() == '') {
      this.isOk = false;
      this.notificationService.error('Please Enter All Fields', '');
    } else if (
      this.NEW_PASSWORD == undefined ||
      this.NEW_PASSWORD.trim() == ''
    ) {
      this.isOk = false;
      this.notificationService.error('Please Enter New Password', '');
    } else if (
      this.CONFPASSWORD == undefined ||
      this.CONFPASSWORD.trim() == ''
    ) {
      this.isOk = false;
      this.notificationService.error(
        'Please Enter Correct Confirm Password',
        ''
      );
    } else if (this.NEW_PASSWORD == this.CONFPASSWORD) {
      this.user.PASSWORD = this.NEW_PASSWORD;
      this.api
        .employeechangechangepassord(this.ID, this.NEW_PASSWORD)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.notificationService.success(
              'Password Changed Successfully...',
              ''
            );
            window.location.reload();
            this.isVisible = false;
            this.NEW_PASSWORD = '';
            this.CONFPASSWORD = '';
            this.PASSWORD = '';

            this.isSpinning = false;
          } else {
            this.notificationService.error('Password Change Failed...', '');
            this.isSpinning = false;
          }
        });
    } else {
      this.notificationService.error(
        'New Password & Confirm Password Must Be Same',
        ''
      );
    }
  }
  infoVisible: boolean = false;
  infoDrawerTitle: string = '';
  info(event) {
    this.router.navigateByUrl('claim/aboutInfo');

    // this.infoVisible = true
    // this.infoDrawerTitle = 'Info'
  }

  InfoDrawerClose(): void {
    this.drawerVisible = false;
  }

  get InfoCloseCallback() {
    return this.InfoDrawerClose.bind(this);
  }

  logout() {
    this.api.logoutcall().subscribe((data) => {
      if (data['code'] == '200') {
        this.cookie.deleteAll();
        sessionStorage.clear();
        localStorage.clear();
        this.notificationService.success('Logout Successfully', '');
        setTimeout(() => {
          this.router.navigateByUrl('/', { replaceUrl: false });
        }, 500);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  @ViewChild('otpve') otpve: ElementRef;
  @ViewChild('otpve1') otpve1: ElementRef;
  @ViewChild('openregi') openregi: ElementRef;
  @ViewChild('openregi1') openregi1: ElementRef;
  @ViewChild('openregi2') openregi2: ElementRef;
  @ViewChild('clodeOTP') clodeOTP: ElementRef;
  @ViewChild('clodeOTP1') clodeOTP1: ElementRef;
  @ViewChild('openotpmodemail') openotpmodemail: ElementRef;
  @ViewChild('openotpmodmobile') openotpmodmobile: ElementRef;
  @ViewChild('regsuccessmodal1111') regsuccessmodal1111: ElementRef;
  @ViewChild('rolemapmod') rolemapmod: ElementRef;
  @ViewChild('ngOtpInputttt') ngOtpInputttt: any;
  @ViewChild('pinChange') pinChange: any;
  OTP = '';
  OTP1 = '';
  isagreedisable: boolean = false;
  OTP11 = '';
  otpSpinning = false;
  NAME: any;
  MOBILE_NO: any;
  DESIGNATION: any;
  GRADE_PAY_LEVEL: any;
  POSTED_CITY_ID: any;
  PAN_CARD: any;
  GRADE_PAY: any;
  GRASS_GRADE_PAY: any;
  EMPLOYEE_CODE: any;
  APPROVAL_STATUS: any;
  ID_PROOF: any;
  mobilev = false;
  showforgot = false;
  PASS = '';
  CPASS = '';
  design_IDS: any;
  design_IDS1: any = [];
  GradePay_ID: any;
  GradePay_ID1: any = [];
  gradepayData: any = [];
  pass1: boolean = false;
  pass2: boolean = false;
  pass3: boolean = false;
  pass4: boolean = false;
  pass11: boolean = false;
  showforgot1: boolean = false;
  showforgot2: boolean = false;
  timerMobile: boolean = false;
  showforgot3: boolean = false;
  fieldTextType: boolean = false;
  fsendOtp: boolean = false;
  statedata;
  EMAIL_ID;
  // PASSWORD
  PHONE;
  closeModal() {
    this.OTP = '';
    this.OTP1 = '';
    this.OTP11 = '';
    this.MOBILE_NO = '';
    this.PAN_CARD = '';
    this.APPROVAL_STATUS = '';
    this.DESIGNATION = '';
    this.design_IDS1 = '';
    this.design_IDS = '';
    this.GradePay_ID = '';
    this.GradePay_ID1 = '';
    this.EMPLOYEE_CODE = '';
    this.EMAIL_ID = '';
    this.GRADE_PAY = '';
    this.GRASS_GRADE_PAY = '';
    this.GRADE_PAY_LEVEL = '';
    this.PASSWORD = '';
    this.statedata = '';
    this.POSTED_CITY_ID = '';
    this.NAME = '';
    this.showforgot1 = false;
    this.showforgot2 = false;
    this.showforgot3 = false;
    this.pass3 = false;
    this.pass4 = false;
    this.pass11 = false;
    this.fieldTextType = false;
    this.CPASS = '';
    this.PASS = '';
    this.PHONE = '';
    this.fsendOtp = false;
    this.timerMobile = false;
    this.pass1 = false;
    this.pass2 = false;
    this.isagreedisable = true;
  }
  isValidPassword(password: string) {
    const expression =
      /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return expression.test(String('' + password).toLowerCase());
  }
  Changepasss() {
    if (!this.isValidPassword(this.PASS)) {
      this.notificationService.error('Please Enter Valid Password', '');
    } else if (this.PASS == undefined || this.PASS.toString().trim() == '') {
      this.notificationService.error('Please Enter Password', '');
    } else if (this.PASS != this.CPASS) {
      this.notificationService.error(
        'Password And Confirm Password Must Be Same',
        ''
      );
    } else {
      this.otpSpinning = true;
      this.api.changepasss(this.PHONE, this.PASS).subscribe(
        (successCode) => {
          this.otpSpinning = false;
          if (successCode['code'] == '200') {
            this.notificationService.success(
              'Password Changed Successfully.',
              ''
            );
            this.PASSWORD = '';
            this.OTP = '';
            this.OTP11 = '';
            this.showforgot1 = false;
            this.showforgot2 = false;
            this.showforgot3 = false;
            this.CPASS = '';
            this.PASS = '';
          } else if (successCode['code'] == '300') {
            this.notificationService.error(
              'Something Went Wrong.Please Try Again.',
              ''
            );
            this.OTP = '';
          } else if (successCode['code'] == '400') {
            this.notificationService.error(
              'Something Went Wrong.Please Try Again.',
              ''
            );
          }
        },
        (err) => {
          this.notificationService.error(
            'Something Went Wrong.Please Try Again.',
            ''
          );
        }
      );
    }
  }
  RETYPE_PASSWORD: string = '';
  changepassss: changepassword = new changepassword();

  @ViewChild('closechangeppp') closechangeppp: ElementRef;
  rroleIdd: any = localStorage.getItem('roleId');
  changepasss() {
    if (
      this.changepassss.PASSWORD == '' ||
      this.changepassss.PASSWORD == null
    ) {
      this.notificationService.error('Please Enter Old Password', '');
    } else if (
      this.changepassss.NEW_PASSWORD == '' ||
      this.changepassss.NEW_PASSWORD == null
    ) {
      this.notificationService.error('Please Enter New Password', '');
    } else if (!this.isValidPassword(this.changepassss.NEW_PASSWORD)) {
      this.notificationService.error('Please Enter Valid New Password', '');
    } else if (this.changepassss.PASSWORD == this.changepassss.NEW_PASSWORD) {
      this.notificationService.error('Old And New Password Are Same', '');
    } else if (this.changepassss.PASSWORD == this.RETYPE_PASSWORD) {
      this.notificationService.error('Old And Retype Password Are Same', '');
    } else if (this.changepassss.NEW_PASSWORD != this.RETYPE_PASSWORD) {
      this.notificationService.error(
        'New Password And Retype Password Are Not Same',
        ''
      );
    } else {
      this.changepassss.ID = Number(sessionStorage.getItem('userId'));
      this.changepassss.NEW_PASSWORD = CryptoJS.MD5(
        this.changepassss.NEW_PASSWORD
      ).toString(CryptoJS.enc.Hex);
      this.changepassss.PASSWORD = CryptoJS.MD5(
        this.changepassss.PASSWORD
      ).toString(CryptoJS.enc.Hex);
      this.otpSpinning = true;
      // if (this.rroleIdd == 2) {
      this.api.changepasswordemployee(this.changepassss).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.otpSpinning = false;

            this.changepassss.NEW_PASSWORD = '';
            this.changepassss.PASSWORD = '';
            this.closechangeppp.nativeElement.click();
            this.notificationService.success(
              'Password Changed Successfully',
              ''
            );
          } else if (successCode['code'] == '303') {
            this.notificationService.error(
              'New Password Not Match To The Old Password.',
              ''
            );
            this.otpSpinning = false;
          } else {
            this.notificationService.error(
              'Something went wrong please try later...',
              ''
            );
            this.otpSpinning = false;
          }
        },
        (err) => {
          this.notificationService.error(
            'Something went wrong please try later...',
            ''
          );
          this.otpSpinning = false;
        }
      );
      // } else {
      //   this.api.changepassworduser(this.changepassss).subscribe(
      //     (successCode) => {
      //       if (successCode['code'] == 200) {
      //         this.otpSpinning = false;
      //         this.notificationService.success('Password Changed Successfully',"");
      //         this.changepassss.NEW_PASSWORD = '';
      //         this.changepassss.PASSWORD = '';
      //         this.closechangeppp.nativeElement.click();
      //       } else if (successCode['code'] == '303') {
      //         this.notificationService.error('New Password Not Match To The Old Password.',"");
      //         this.otpSpinning = false;
      //       } else {
      //         this.notificationService.error('Something went wrong please try later...',"");
      //         this.otpSpinning = false;
      //       }
      //     },
      //     (err) => {
      //       this.notificationService.error('Something went wrong please try later...',"");
      //       this.otpSpinning = false;
      //     }
      //   );
      // }
    }
  }
  onOtpChange(otp: any) {
    this.OTP = otp.toString();
  }
  onOtpChange1(otp1: any) {
    this.OTP1 = otp1.toString();
  }
  onOtpChange3(otp2: any) {
    this.OTP11 = otp2.toString();
  }
  showpass3() {
    this.pass3 = !this.pass3;
  }
  showpass4() {
    this.pass4 = !this.pass4;
  }
  showpass1() {
    this.pass1 = !this.pass1;
  }
  showpass2() {
    this.pass2 = !this.pass2;
  }
  showp() {
    this.pass11 = !this.pass11;
  }

  drawerVisible1 = false;
  drawerData1: any = [];
  drawerTitle1: string = 'Profile Details';
  addnew: boolean = false;
  drawerDatapersonal: any = [];
  empstatus: any = [
    {
      IS_ACR_FILLED: 0,
      IS_ADDITIONAL_FILLED: 0,
      IS_ADDRESS_FILLED: 0,
      IS_EDUCATION_FILLED: 0,
      IS_EXAM_FILLED: 0,
      IS_FAMILY_FILLED: 0,
      IS_IPR_FILLED: 0,
      IS_OPTIONAL_FILLED: 0,
      IS_PERSONAL_FILLED: 0,
      IS_POSTING_FILLED: 0,
      IS_PROMOTION_FILLED: 0,
      IS_SERVICE_FILLED: 0,
      IS_TRAINING_FILLED: 0,
    },
  ];
  drawerClose1(): void {
    this.drawerVisible1 = false;
  }
  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
  add() {
    this.drawerTitle1 = 'Profile Details';
    this.addnew = true;
    this.api1
      .getprofiledata(
        0,
        0,
        '',
        '',
        ' AND ID=' + sessionStorage.getItem('userId') + ''
      )
      .subscribe(
        (data) => {
          if (data.code == '200' && data.data.length > 0) {
            var dataforper = data['data'][0];
            this.drawerDatapersonal = Object.assign({}, dataforper);
            this.api1
              .getempstatus(
                0,
                0,
                '',
                'asc',
                ' AND ID=' + sessionStorage.getItem('userId')
              )
              .subscribe((data) => {
                if (data['code'] == 200) {
                  if (data['data'].length > 0) {
                    this.empstatus = data['data'];
                    this.drawerVisible1 = true;
                  } else {
                    this.empstatus = [];
                  }
                  this.drawerVisible1 = true;
                } else {
                  this.notificationService.error(
                    'Something Went Wrong, Please Try Again Later.',
                    ''
                  );
                }
              });
          }
        },
        (err) => {
          this.notificationService.error(
            'Something Went Wrong, Please Try Again Later.',
            ''
          );
        }
      );
  }

  getconditionsss() {
    if (
      this.roleId == 47 ||
      this.roleId == 46 ||
      this.roleId == 48 ||
      this.roleId == 49 ||
      this.roleId == 50 ||
      this.roleId == 56
    ) {
      return false;
    } else {
      return true;
    }
  }
}
