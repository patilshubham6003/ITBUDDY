import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from '../Models/Commonmodule/user';
import { Role } from '../Models/Commonmodule/role';
import { Form } from '../Models/Commonmodule/form';
import { Roledetails } from '../Models/Commonmodule/roledetails';
import { Homepage } from '../Models/homepage';
import { clientMaster } from '../Models/BasicForms/clientMaster';
import { project } from '../Models/BasicForms/project';
import { moduleMaster } from '../Models/BasicForms/moduleMaster';
import { featureMaster } from '../Models/BasicForms/featureMaster';
import { categoryMaster } from '../Models/BasicForms/categoryMaster';
import { attachmentMaster } from '../Models/BasicForms/attachmentMaster';
import { taskSubtaskMaster } from '../Models/BasicForms/taskSubtaskMaster';
import { worklogM } from '../Models/BasicForms/worklogM';
import { commentM } from '../Models/BasicForms/commentM';
import { taskTransferM } from '../Models/BasicForms/taskTransferM';
import { typeM } from '../Models/BasicForms/typeM';
import { assigneeMapping } from '../Models/BasicForms/assigneeMapping';
import { Filemaster } from '../Models/filemaster';
import { FileHierarchy } from '../Models/filehierarchy';
import { Router } from '@angular/router';
import { appkeysMedical } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // currentMessage = new BehaviorSubject(null);

  clientId = 1;

  // headers for forms all
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  // headers for forms file upload call
  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };
  // gmUrl = appkeysMedical.gmUrl;
  baseUrl = appkeysMedical.baseUrl;
  url = appkeysMedical.url;
  url1 = this.baseUrl + '';
  retriveimgUrl = appkeysMedical.retriveimgUrl;
  imgUrl = appkeysMedical.imgUrl;
  imgUrl1 = appkeysMedical.imgUrl1;

  // url = this.baseUrl + 'api/';
  // baseUrl = 'http://192.168.29.151:6927/'; //Harshwardhan
  // baseUrl = 'http://192.168.29.163:3000/'; //sumit
  // baseUrl = 'https://ac05-2409-40c2-2f-c36e-540-6f64-4114-1d55.ngrok-free.app/'; //Amit
  // baseUrl ='https://8301-2405-201-1011-1028-85cf-e678-f13c-3422.ngrok-free.app/'; //sumit
  // baseUrl ='https://f34c-2405-201-1011-1028-3997-303e-9fe3-5667.ngrok-free.app/'; //Harshvardhan
  // baseUrl = 'http://192.168.29.204:6927/'; //Darshan
  // baseUrl = 'http://emrcpsdemo.uvtechsoft.com:6930/'; //Testing
  // baseUrl = 'http://emrcps.uvtechsoft.com:6927/'; //Live
  // gmUrl = 'https://gm.tecpool.in:8078/';
  // gmUrl = "http://ea90-223-178-218-78.ngrok.io/";

  // imgUrl = this.baseUrl + 'upload/';
  // imgUrl = this.baseUrl + 'api/upload/';
  // retriveimgUrl = this.baseUrl + 'static/';

  // url = this.baseUrl + 'api/';
  // url1 = this.baseUrl + '';

  dateforlog =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  emailId = this.cookie.get('emailId'); ///
  userId = Number(sessionStorage.getItem('userId'));
  userName = this.cookie.get('userName');
  roleId = sessionStorage.getItem('roleId');

  socketUrl = 'http://pms.tecpool.in:3934';
  // socketUrl = "http://ea90-223-178-218-78.ngrok.io";

  getheader() {
    ////// For Testing /////

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    /////For Live/Local ////////

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
  }

  getheardsforupload() {
    // //////////////For Testing //////////////

    this.httpHeaders1 = new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      Accept: 'application/json',

      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };

    // //////////////For Live/Local //////////////

    // this.httpHeaders1 = new HttpHeaders({
    //   //'Content-Type': 'multipart/form-data',
    //   Accept: 'application/json',

    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = {
    //   headers: this.httpHeaders1,
    // };
  }

  // onUploadNewMethod(selectedFile, ext, fKey) {
  //   // //////////////For Testing //////////////

  //   this.httpHeaders1 = new HttpHeaders({
  //     //'Content-Type': 'multipart/form-data',
  //     Accept: 'application/json',
  //     f_key: fKey,
  //     f_ext: ext,
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options1 = {
  //     headers: this.httpHeaders1,
  //   };

  //   // //////////////For Live/Local //////////////

  //   // this.httpHeaders1 = new HttpHeaders({
  //   //   //'Content-Type': 'multipart/form-data',
  //   //   Accept: 'application/json',
  //   //   f_key: fKey,
  //   //   f_ext: ext,
  //   //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   //   applicationkey: 'AfIpESwBr5eHp7w3',
  //   //   supportkey: this.cookie.get('supportKey'),
  //   //   Token: this.cookie.get('token'),
  //   // });
  //   // this.options1 = {
  //   //   headers: this.httpHeaders1,
  //   // };

  //   const fd = new FormData();
  //   fd.append('F_DATA', selectedFile);
  //   fd.append('F_EXT', ext);
  //   fd.append('F_KEY', fKey);
  //   return this.httpClient.post(this.gmUrl + 'file/upload', fd, this.options1);
  // }

  onUpload(folderName, selectedFile, filename): Observable<any> {
    this.getheardsforupload();
    ////// For Testing /////

    // this.httpHeaders1 = new HttpHeaders({
    //   //'Content-Type': 'multipart/form-data',
    //   Accept: 'application/json',

    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'TQ7JZ1FDsSA1qHED',
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = {
    //   headers: this.httpHeaders1,
    // };

    // //////////////For Live/Local //////////////

    // // this.httpHeaders1 = new HttpHeaders({
    // //   //'Content-Type': 'multipart/form-data',
    // //   Accept: 'application/json',

    // //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    // //   applicationkey: 'AfIpESwBr5eHp7w3',
    // //   supportkey: this.cookie.get('supportKey'),
    // //   Token: this.cookie.get('token'),
    // // });
    // // this.options1 = {
    // //   headers: this.httpHeaders1,
    // // };

    // const fd = new FormData();
    // fd.append('Image', selectedFile, filename);
    //

    //
    // return this.httpClient.post(this.imgUrl + folderName, fd, this.options1);

    let params = new HttpParams();
    const options1 = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);

    const req = new HttpRequest(
      'POST',
      this.imgUrl1 + folderName,
      fd,
      options1
    );
    return this.httpClient.request(req);
  }

  // onUploadNewMethodBulk(selectedFile) {
  //   ////// For Testing /////
  //   this.getheardsforupload();

  //   // this.httpHeaders1 = new HttpHeaders({
  //   //   //'Content-Type': 'multipart/form-data',
  //   //   Accept: 'application/json',

  //   //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   //   applicationkey: 'TQ7JZ1FDsSA1qHED',
  //   //   supportkey: this.cookie.get('supportKey'),
  //   //   Token: this.cookie.get('token'),
  //   // });
  //   // this.options1 = {
  //   //   headers: this.httpHeaders1,
  //   // };

  //   //////////////For Live/Local //////////////

  //   // this.httpHeaders1 = new HttpHeaders({
  //   //   //'Content-Type': 'multipart/form-data',
  //   //   Accept: 'application/json',

  //   //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   //   applicationkey: 'AfIpESwBr5eHp7w3',
  //   //   supportkey: this.cookie.get('supportKey'),
  //   //   Token: this.cookie.get('token'),
  //   // });
  //   // this.options1 = {
  //   //   headers: this.httpHeaders1,
  //   // };

  //   const fd = new FormData();
  //   for (let file of selectedFile) {
  //     let name =
  //       file.f_key + '_' + file.url_key + '.' + file.name.split('.').pop();
  //     fd.append('F_DATA', file, name);
  //   }
  //   return this.httpClient.post(
  //     this.gmUrl + 'File/uploadBulk',
  //     fd,
  //     this.options1
  //   );
  // }

  onUpload3(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    ////// For Testing /////
    this.getheardsforupload();

    // this.httpHeaders1 = new HttpHeaders({
    //   //'Content-Type': 'multipart/form-data',
    //   Accept: 'application/json',

    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'TQ7JZ1FDsSA1qHED',
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = {
    //   headers: this.httpHeaders1,
    // };

    //////////////For Live/Local //////////////

    // this.httpHeaders1 = new HttpHeaders({
    //   //'Content-Type': 'multipart/form-data',
    //   Accept: 'application/json',

    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = {
    //   headers: this.httpHeaders1,
    // };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    return this.httpClient.post<any>(
      this.imgUrl + folderName,
      fd,
      this.options1
    );
  }

  //retrive file - GETTING_FILE
  // getFile(lkey) {
  //   ////// For Testing /////
  //   this.getheardsforupload();

  //   // this.httpHeaders1 = new HttpHeaders({
  //   //   //'Content-Type': 'multipart/form-data',
  //   //   Accept: 'application/json',

  //   //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   //   applicationkey: 'TQ7JZ1FDsSA1qHED',
  //   //   supportkey: this.cookie.get('supportKey'),
  //   //   Token: this.cookie.get('token'),
  //   // });
  //   // this.options1 = {
  //   //   headers: this.httpHeaders1,
  //   // };

  //   //////////////For Live/Local //////////////

  //   // this.httpHeaders1 = new HttpHeaders({
  //   //   //'Content-Type': 'multipart/form-data',
  //   //   Accept: 'application/json',

  //   //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   //   applicationkey: 'AfIpESwBr5eHp7w3',
  //   //   supportkey: this.cookie.get('supportKey'),
  //   //   Token: this.cookie.get('token'),
  //   // });
  //   // this.options1 = {
  //   //   headers: this.httpHeaders1,
  //   // };

  //   var data = {
  //     L_KEY: lkey,
  //   };
  //   return this.httpClient.post<any>(
  //     this.gmUrl + 'file/getFile',
  //     data,
  //     this.options1
  //   );
  // }

  // upload image with key - UPLOAD_IMAGEdd

  constructor(
    private cookie: CookieService,
    private message: NzNotificationService,
    private httpClient: HttpClient,
    private router: Router
  ) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = this.randomstring(16);
      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '',
        '',
        false,
        'Strict'
      );
    }
    // else if(this.userId == null || this.userName == null || this.roleId == null)
    // {
    //   this.logoutForSessionValues()
    // }
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };

    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
  }

  getSecondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    if (h == 0) return m + ' m ' + s + ' s ';
    else return h + ' h ' + m + ' m ';
  }

  //generate string as we pass length - LOGIN_FROMS
  randomstring(L) {
    var s = '';
    var randomchar = function () {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };
    while (s.length < L) s += randomchar();
    return s;
  }

  // removeDuplicates(originalArray, prop) {
  //   var newArray = [];
  //   var lookupObject = {};

  //   for (var i in originalArray) {
  //     lookupObject[originalArray[i][prop]] = originalArray[i];
  //   }

  //   for (i in lookupObject) {
  //     newArray.push(lookupObject[i]);
  //   }
  //   return newArray;
  // }

  generateRandomNumber(n) {
    return (
      Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) +
      Math.pow(10, n - 1)
    );
  }

  logoutForSessionValues() {
    this.cookie.deleteAll();
    window.location.reload();
    // setTimeout(() => {
    //   this.router.navigateByUrl('/login')

    // }, 3000);
  }

  //firebase methods - FIREBASE
  receiveMessage() {
    // this.angularFireMessaging.messages.subscribe(
    //   (payload) => {
    //
    //     this.message.info(payload['data']['title'], payload['data']['body'])
    //     this.currentMessage.next(payload);
    //   })
  }

  requestPermission(userId) {
    // this.angularFireMessaging.requestToken.subscribe(
    //   (token) => {
    //     this.cloudID = token
    //     //this.updateToken(userId, token);
    //   },
    //   (err) => {
    //     console.error('Unable to get permission to notify.', err);
    //   }
    // );
  }

  // implement logger - LOGGER
  // loggerInit() {
  //   this.getheader();
  //   var data = {
  //     CLIENT_ID: this.clientId,
  //   };
  //   return this.httpClient.post(
  //     this.gmUrl + 'device/init',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // addLog(type, text, userId): Observable<number> {
  //   this.getheader();
  //   var data = {
  //     LOG_TYPE: type,
  //     LOG_TEXT: this.dateforlog + ' ' + text,
  //     USER_ID: userId,
  //     CLIENT_ID: this.clientId,
  //   };
  //   return this.httpClient.post<number>(
  //     this.gmUrl + 'device/addLog',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // login method - LOGIN
  login(email: string, password: string) {
    this.getheader();
    var data = {
      username: email,
      password: password,
    };
    return this.httpClient.post(
      this.baseUrl + 'user/login',
      JSON.stringify(data),
      this.options
    );
  }

  //get all Form For login menu
  getForms(roleId: number) {
    var data = {
      ROLE_ID: roleId,
      SERVICE_ID: Number(localStorage.getItem('serviceid')),
    };
    return this.httpClient.post<Roledetails>(
      this.url + 'user/getForms',
      JSON.stringify(data),
      this.options
    );
  }
  getForms1(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<Roledetails>(
      this.url + 'user/getForms',
      JSON.stringify(data),
      this.options
    );
  }

  getCheckAccessOfForm(roleId: number, link: string) {
    var data = {
      ROLE_ID: roleId,
      LINK: link,
    };
    return this.httpClient.post<Roledetails>(
      this.url + 'roleDetails/checkAccess',
      JSON.stringify(data),
      this.options
    );
  }

  //methods for form related opearation  - FORM
  getAllForms(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Form[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<Form[]>(
      this.url + 'form/get',
      JSON.stringify(data),
      this.options
    );
  }

  createForm(form: Form): Observable<number> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'form/create/',
      JSON.stringify(form),
      this.options
    );
  }

  updateForm(form: Form): Observable<number> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'form/update/',
      JSON.stringify(form),
      this.options
    );
  }

  //methods for role related opearation  - ROLE
  getAllRoles(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Role[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<Role[]>(
      this.url + 'role/get',
      JSON.stringify(data),
      this.options
    );
  }

  createRole(application: Role): Observable<number> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'role/create/',
      JSON.stringify(application),
      this.options
    );
  }

  updateRole(application: Role): Observable<number> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'role/update/',
      JSON.stringify(application),
      this.options
    );
  }

  //get all form assigned - ROLE_DETAILS
  getRoleDetails(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<Roledetails[]>(
      this.url + 'roleDetails/getData',
      JSON.stringify(data),
      this.options
    );
  }

  //assign all method forms - ROLE_DETAILS
  addRoleDetail(roleId: number, data1: string[]): Observable<any> {
    //
    var data = {
      ROLE_ID: roleId,
      data: data1,
    };
    return this.httpClient.post<any>(
      this.url + 'roleDetail/addBulk',
      data,
      this.options
    );
  }

  getRoleDetail(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    //
    return this.httpClient.post<any>(
      this.url + 'roleDetail/getData',
      JSON.stringify(data),
      this.options
    );
  }

  // assign all method forms - ROLE_DETAILS
  addRoleDetails(roleId: number, data1: string[]): Observable<number> {
    var data = {
      ROLE_ID: roleId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'roleDetails/addBulk',
      data,
      this.options
    );
  }

  // Project Mapping : Get Data
  getProjectDetails(projectId: number, taskCategoryId: number) {
    var data = {
      PROJECT_ID: projectId,
      TASK_CATEGORY_ID: taskCategoryId,
    };
    return this.httpClient.post<[]>(
      this.url + 'projectTeamMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  // Module Mapping : Get Data
  getModuleDetails(moduleId: number, taskCategoryId: number) {
    var data = {
      MODULE_ID: moduleId,
      TASK_CATEGORY_ID: taskCategoryId,
    };
    return this.httpClient.post<[]>(
      this.url + 'moduleTeamMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  // Module Mapping : Add Bulk
  addModuleMappingDetails(
    moduleId: number,
    data1: string[]
  ): Observable<number> {
    var data = {
      MODULE_ID: moduleId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'moduleTeamMapping/addBulk',
      data,
      this.options
    );
  }

  // Feature Mapping : Get Data
  getFeatureDetails(featureId: number, taskCategoryId: number) {
    var data = {
      FEATURE_ID: featureId,
      TASK_CATEGORY_ID: taskCategoryId,
    };
    return this.httpClient.post<[]>(
      this.url + 'featureTeamMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  // Feature Mapping : Add Bulk
  addFeatureMappingDetails(
    featureId: Number,
    data1: string[]
  ): Observable<number> {
    var data = {
      FEATURE_ID: featureId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'featureTeamMapping/addBulk',
      data,
      this.options
    );
  }

  // Task, Subtask Mapping : Get Data
  getTaskSubtaskDetails(taskId: number, taskCategoryId: number) {
    var data = {
      TASK_ID: taskId,
      TASK_CATEGORY_ID: taskCategoryId,
    };

    return this.httpClient.post<[]>(
      this.url + 'taskTeamMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  // Task, Subtask Mapping : Add Bulk
  addTaskSubtaskMappingDetails(
    taskId: number,
    data1: string[]
  ): Observable<number> {
    var data = {
      TASK_ID: taskId,
      data: data1,
    };

    return this.httpClient.post<number>(
      this.url + 'taskTeamMapping/addBulk',
      data,
      this.options
    );
  }

  //method for user replated opearation - USER
  getAllUsers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<User[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<User[]>(
      this.url + 'user/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUser(user: User): Observable<number> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'user/create/',
      JSON.stringify(user),
      this.options
    );
  }

  updateUser(user: User): Observable<number> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'user/update/',
      JSON.stringify(user),
      this.options
    );
  }

  // Client Master
  getAllClients(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<clientMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<clientMaster[]>(
      this.url + 'client/get',
      JSON.stringify(data),
      this.options
    );
  }

  createClient(client: clientMaster): Observable<number> {
    client.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'client/create',
      JSON.stringify(client),
      this.options
    );
  }

  updateClient(client: clientMaster): Observable<number> {
    client.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'client/update',
      JSON.stringify(client),
      this.options
    );
  }

  // Project Master
  getAllProjects(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<project[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<project[]>(
      this.url + 'project/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllMappedProjects(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<project[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<project[]>(
      this.url + 'projectteammapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createProject(project: project): Observable<number> {
    project.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'project/create',
      JSON.stringify(project),
      this.options
    );
  }

  updateProject(project: project): Observable<number> {
    project.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'project/update',
      JSON.stringify(project),
      this.options
    );
  }

  // Module Master
  getAllModules(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<moduleMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<moduleMaster[]>(
      this.url + 'module/get',
      JSON.stringify(data),
      this.options
    );
  }

  createModule(module: moduleMaster): Observable<number> {
    module.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'module/create',
      JSON.stringify(module),
      this.options
    );
  }

  updateModule(module: moduleMaster): Observable<number> {
    module.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'module/update',
      JSON.stringify(module),
      this.options
    );
  }

  // Feature Master
  getAllFeatures(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<featureMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<featureMaster[]>(
      this.url + 'feature/get',
      JSON.stringify(data),
      this.options
    );
  }

  createFeature(feature: featureMaster): Observable<number> {
    feature.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'feature/create',
      JSON.stringify(feature),
      this.options
    );
  }

  updateFeature(feature: featureMaster): Observable<number> {
    feature.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'feature/update',
      JSON.stringify(feature),
      this.options
    );
  }

  // Category Master
  getAllCategories(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<categoryMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<categoryMaster[]>(
      this.url + 'taskCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCategory(category: categoryMaster): Observable<number> {
    category.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'taskCategory/create',
      JSON.stringify(category),
      this.options
    );
  }

  updateCategory(category: categoryMaster): Observable<number> {
    category.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'taskCategory/update',
      JSON.stringify(category),
      this.options
    );
  }

  // Task Subtask Master
  getAllTaskSubtask(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<taskSubtaskMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<taskSubtaskMaster[]>(
      this.url + 'task/get',
      JSON.stringify(data),
      this.options
    );
  }

  createTaskSubtask(taskSubtask: taskSubtaskMaster): Observable<number> {
    taskSubtask.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'task/create',
      JSON.stringify(taskSubtask),
      this.options
    );
  }

  updateTaskSubtask(taskSubtask: taskSubtaskMaster): Observable<number> {
    taskSubtask.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'task/update',
      JSON.stringify(taskSubtask),
      this.options
    );
  }

  // Attachment Master
  getAllAttachments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<attachmentMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<attachmentMaster[]>(
      this.url + 'attachments/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAttachment(attachment: attachmentMaster): Observable<number> {
    attachment.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'attachments/create',
      JSON.stringify(attachment),
      this.options
    );
  }

  updateAttachment(attachment: attachmentMaster): Observable<number> {
    attachment.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'attachments/update',
      JSON.stringify(attachment),
      this.options
    );
  }

  // Worklog Master
  getAllWorklogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<worklogM[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<worklogM[]>(
      this.url + 'workLogs/get',
      JSON.stringify(data),
      this.options
    );
  }

  createWorklog(worklog: worklogM): Observable<number> {
    worklog.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'workLogs/create',
      JSON.stringify(worklog),
      this.options
    );
  }

  updateWorklog(worklog: worklogM): Observable<number> {
    worklog.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'workLogs/update',
      JSON.stringify(worklog),
      this.options
    );
  }

  deleteWorklog(worklogID: number): Observable<number> {
    var data = {
      ID: worklogID,
    };
    return this.httpClient.put<number>(
      this.url + 'workLogs/delete',
      data,
      this.options
    );
  }

  // Comment Master
  getComments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<commentM[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<commentM[]>(
      this.url + 'comments/get',
      JSON.stringify(data),
      this.options
    );
  }

  createComment(comment: commentM): Observable<number> {
    comment.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'comments/create',
      JSON.stringify(comment),
      this.options
    );
  }

  updateComment(comment: commentM): Observable<number> {
    comment.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'comments/update',
      JSON.stringify(comment),
      this.options
    );
  }

  // Task Transfer History
  getAllTaskTransferHistory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<taskTransferM[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<taskTransferM[]>(
      this.url + 'taskTransferHistory/get',
      JSON.stringify(data),
      this.options
    );
  }

  createTaskTransferHistory(
    taskTransferData: taskTransferM
  ): Observable<number> {
    taskTransferData.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + 'taskTransferHistory/create',
      taskTransferData,
      this.options
    );
  }

  updateTaskTransferHistory(
    taskTransferData: taskTransferM
  ): Observable<number> {
    taskTransferData.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'taskTransferHistory/update',
      JSON.stringify(taskTransferData),
      this.options
    );
  }

  // Type Master
  getAllType(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<typeM[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<typeM[]>(
      this.url + 'type/get',
      JSON.stringify(data),
      this.options
    );
  }

  createType(typeData: typeM): Observable<number> {
    typeData.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'type/create',
      JSON.stringify(typeData),
      this.options
    );
  }

  updateType(typeData: typeM): Observable<number> {
    typeData.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'type/update',
      JSON.stringify(typeData),
      this.options
    );
  }

  // Get Assignees
  getAllAssignees(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<User[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<User[]>(
      this.url + 'assigneeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateAssignees(typeData: assigneeMapping): Observable<number> {
    typeData.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'assigneeMapping/update',
      JSON.stringify(typeData),
      this.options
    );
  }

  // Employee Wise Working Hours
  getEmplyeeWiseWorkingHours(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    userName: string,
    userID: string,
    projectID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      NAME: userName,
      USER_IDS: userID,
      PROJECT_IDS: projectID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getEmpDateWiseWorkingHours',
      JSON.stringify(data),
      this.options
    );
  }

  // Project Wise Employee's Working Hours
  getProjectWiseEmployeeWorkingHours(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    userName: string,
    userID: string,
    projectID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      NAME: userName,
      USER_IDS: userID,
      PROJECT_IDS: projectID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getEmpProjectWiseWorkingHours',
      JSON.stringify(data),
      this.options
    );
  }

  // Employee Wise Project's Working Hours
  getEmployeeWiseProjectWorkingHours(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    userName: string,
    userID: string,
    projectID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      NAME: userName,
      USER_IDS: userID,
      PROJECT_IDS: projectID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getProjectWiseSummary',
      JSON.stringify(data),
      this.options
    );
  }

  // Project Wise Working Hours
  getProjectWiseWorkingHours(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    projectID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      IDS: projectID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getProjectWiseWorkingHours',
      JSON.stringify(data),
      this.options
    );
  }

  // Project Wise Details
  getProjectWiseDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    projectID: number,
    userName: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      PROJECT_ID: projectID,
      LIKE_STRING: userName,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getProjectWiseEmpWorkingHours',
      JSON.stringify(data),
      this.options
    );
  }

  // Project Wise Summary
  getProjectWiseSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    projectID: number,
    userName: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      PROJECT_ID: projectID,
      LIKE_STRING: userName,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getProjectDetailedReport',
      JSON.stringify(data),
      this.options
    );
  }

  // User Wise Subtask Details Summary
  getUserWiseProjectSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    userName: string,
    userID: string,
    projectID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      LIKE_STRING: userName,
      USER_IDS: userID,
      PROJECT_IDS: projectID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getUserWiseDetailedReport',
      JSON.stringify(data),
      this.options
    );
  }

  // User Wise Details Summary
  getUserWiseDetailsSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    userName: string,
    userID: string,
    projectID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      LIKE_STRING: userName,
      USER_IDS: userID,
      PROJECT_IDS: projectID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getUserSubtaskDetails',
      JSON.stringify(data),
      this.options
    );
  }

  // User Wise Efficiency
  getUserEfficiencySummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    userName: string,
    userID: string,
    fromDate: string,
    toDate: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      NAME_LIKE: userName,
      USER_ID: userID,
      FROM_DATE: fromDate,
      TO_DATE: toDate,
    };
    return this.httpClient.post<[]>(
      this.url + 'reports/getEfficiency',
      JSON.stringify(data),
      this.options
    );
  }

  //method for user replated opearation - USER
  getAllMappedUsers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<User[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<User[]>(
      this.url + 'projectTeamMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  // Get User Initial
  createBadge(nameForBadge: string) {
    var initial = '';
    var nameArr = nameForBadge.split(' ');

    if (nameArr.length == 2) {
      var firstNameInitial = nameArr[0].charAt(0);
      var lastNameInitial = nameArr[1].charAt(0);
      initial = firstNameInitial + lastNameInitial;
    } else {
      var firstNameInitial = nameArr[0].charAt(0);
      initial = firstNameInitial;
    }
    return initial.toUpperCase();
  }

  // Conversion into HMS
  convertIntoHMS(value) {
    const sec = parseInt(value, 10);

    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;
    if (hours < 10) {
      hours = 0 + hours;
    }
    if (minutes < 10) {
      minutes = 0 + minutes;
    }
    if (seconds < 10) {
      seconds = 0 + seconds;
    }
    var totalWorklogTime = hours + 'h ' + minutes + 'm ' + seconds + 's';
    return totalWorklogTime;
  }

  getDairyOutletPincodeMapping(Id: number, filter: string) {
    var data = {
      DAIRY_OUTLET_MASTER_ID: Id,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'dairyOutletPincodeMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  addDairyOutletPincodeMapping(
    Id: number,
    data1: string[]
  ): Observable<number> {
    var data = {
      DAIRY_OUTLET_MASTER_ID: Id,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'dairyOutletPincodeMapping/addBulk',
      data,
      this.options
    );
  }

  getGavaliPincodeMapping(
    Id: number,
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ) {
    var data = {
      GAVALI_MASTER_ID: Id,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'gavaliPincodeMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  addGavaliOutletPincodeMapping(
    Id: number,
    data1: string[]
  ): Observable<number> {
    var data = {
      GAVALI_MASTER_ID: Id,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'gavaliPincodeMapping/addBulk',
      data,
      this.options
    );
  }

  getOnemanPincodeMapping(
    Id: number,
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ) {
    var data = {
      ONE_MAN_MASTER_ID: Id,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'oneManPincodeMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  addOnemanPincodeMapping(Id: number, data1: string[]): Observable<number> {
    var data = {
      ONE_MAN_MASTER_ID: Id,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'oneManPincodeMapping/addBulk',
      data,
      this.options
    );
  }

  getAllNotification(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Notification[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<Notification[]>(
      this.url + 'notificationMemorandum/get',
      JSON.stringify(data),
      this.options
    );
  }

  createNotification(notification): Observable<number> {
    notification.VISIBILITY = notification.VISIBILITY ? 1 : 0;
    notification.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'notificationMemorandum/create/',
      JSON.stringify(notification),
      this.options
    );
  }

  updateNotification(notification): Observable<number> {
    notification.VISIBILITY = notification.VISIBILITY ? 1 : 0;
    notification.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'notificationMemorandum/update/',
      JSON.stringify(notification),
      this.options
    );
  }

  getAllDairyOutletPincodeMappings(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'dairyOutletPincodeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllGavaliPincodeMappings(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'gavaliPincodeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllOnemanpincodemappings(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'oneManPincodeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllLiveVideoBatchMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'liveVideoBatchMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  addFarmerBatchMapping(Id: number, data1: string[]): Observable<number> {
    var data = {
      BATCH_ID: Id,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'farmerBatchMapping/addBulk',
      data,
      this.options
    );
  }

  getAllDashboarddata(month: number, year: number): Observable<string[]> {
    var data = {
      MONTH: month,
      YEAR: year,
    };
    return this.httpClient.post<string[]>(
      this.url + 'user/getDashboardData',
      JSON.stringify(data),
      this.options
    );
  }

  getLivePoleMapping(liveId: number) {
    var data = {
      LIVE_ID: liveId,
    };
    return this.httpClient.post<string[]>(
      this.url + 'livePoleMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  addLivePoleMapping(liveId: number, data1: string[]): Observable<number> {
    var data = {
      LIVE_ID: liveId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'livePoleMapping/addBulk',
      data,
      this.options
    );
  }

  getAllLiveVideoUserReponses(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'poleUserResponses/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllLiveComments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'liveVideoComments/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllLivevideonotificationMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'liveVideoNotificationSetting/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateLiveComments(liveVideos): Observable<number> {
    liveVideos.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'liveVideoComments/update/',
      JSON.stringify(liveVideos),
      this.options
    );
  }

  updateLiveUsers(liveVideos): Observable<number> {
    liveVideos.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'liveVideoUsers/update/',
      JSON.stringify(liveVideos),
      this.options
    );
  }

  getAllHomePageInfo(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<Homepage[]>(
      this.url + 'homepageInformation/get',
      JSON.stringify(data),
      this.options
    );
  }

  createHomePageInfo(batch: Homepage): Observable<number> {
    batch.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'homepageInformation/create/',
      JSON.stringify(batch),
      this.options
    );
  }

  updateHomePageInfo(batch: Homepage): Observable<number> {
    batch.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'homepageInformation/update/',
      JSON.stringify(batch),
      this.options
    );
  }

  getLiveFFFMapping(liveId: number) {
    var data = {
      LIVE_ID: liveId,
    };
    return this.httpClient.post<string[]>(
      this.url + 'fffLiveMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  addLiveFFFMapping(liveId: number, data1: string[]): Observable<number> {
    var data = {
      LIVE_ID: liveId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'fffLiveMapping/addBulk',
      data,
      this.options
    );
  }

  getAllLiveFFFMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<Homepage[]>(
      this.url + 'fffLiveMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllLiveVideofffUserReponses(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<string[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<string[]>(
      this.url + 'fffUserResponses/get',
      JSON.stringify(data),
      this.options
    );
  }

  addFarmerCertificateMapping(
    certificateId: string,
    courseId: number,
    data1: string[]
  ): Observable<number> {
    var data = {
      CERTIFICATE_ID: certificateId,
      COURSE_ID: courseId,
      CLIENT_ID: this.clientId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'farmerCertificateMapping/addBulk',
      data,
      this.options
    );
  }

  //city master
  getCityMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCityMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'city/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCityMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'city/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //facility
  getMedicalFacility(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'medicalFacilities/get',
      JSON.stringify(data),
      this.options
    );
  }

  createMedicalFacility(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'medicalFacilities/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateMedicalFacility(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'medicalFacilities/update/',
      JSON.stringify(role),
      this.options
    );
  }
  //Employee master
  getEmployeeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
      // filter: filter +' AND IS_RETIRED =0',
    };
    return this.httpClient.post<any>(
      this.url + 'employee/get',
      JSON.stringify(data),
      this.options
    );
  }

  createEmployeeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateEmployeeMasterFromClaim(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'employee/updateEmployee/',
      JSON.stringify(data),
      this.options
    );
  }
  updateEmployeeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'employee/update/',
      JSON.stringify(data),
      this.options
    );
  }
  //hospital master

  createhospital(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'hospital/create/',
      JSON.stringify(role),
      this.options
    );
  }

  //InvestigationMaster
  getinvestigationprocedure(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'investigationProcedure/get',
      JSON.stringify(data),
      this.options
    );
  }

  createinvestigationprocedure(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'investigationProcedure/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateinvestigationprocedure(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'investigationProcedure/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getdatabasetable(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'excelImportMaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  createdatabasetable(data: any): Observable<any> {
    this.getheader();
    // this.httpHeaders1 = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   supportkey: this.cookie.get('supportKey'),
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = { headers: this.httpHeaders1 };
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'excelImportMaster/create',
      JSON.stringify(data),
      this.options
    );
  }

  updatedatabsetable(insurance: any): Observable<any> {
    this.getheader();
    // this.httpHeaders1 = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   // Accept: "application/json",
    //   supportkey: this.cookie.get('supportKey'),
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   Token: this.cookie.get('token'),
    // });
    // this.options1 = { headers: this.httpHeaders1 };
    return this.httpClient.put<any>(
      this.url + 'excelImportMaster/update',
      JSON.stringify(insurance),
      this.options
    );
  }

  //Import Investigation Procedure Excel
  importexcelstep2(
    EXCEL_FILE_NAME: string,
    COLUMN_JSON: any,
    TABLE_ID: number,
    IS_ALLOW_DUPLICATES: string
  ): Observable<any> {
    var data = {
      EXCEL_FILE_NAME: EXCEL_FILE_NAME,
      COLUMN_JSON: COLUMN_JSON,
      TABLE_ID: TABLE_ID,
      IS_ALLOW_DUPLICATES: IS_ALLOW_DUPLICATES,
    };

    return this.httpClient.post<any>(
      this.url + 'excelImportMaster/ImportExcel',
      JSON.stringify(data),
      this.options
    );
  }
  createserviceModuleExcelMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'serviceModuleExcelMaster/create',
      JSON.stringify(role),
      this.options
    );
  }
  updateserviceModuleExcelMaster(role: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'serviceModuleExcelMaster/update/',
      JSON.stringify(role),
      this.options
    );
  }
  //investigationcategory
  getinvestigationcategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'investigationCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  createinvestigationcategory(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'investigationCategory/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateinvestigationcategory(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'investigationCategory/update/',
      JSON.stringify(role),
      this.options
    );
  }

  ///addclaimed
  getclaimed(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'claim/get',
      JSON.stringify(data),
      this.options
    );
  }

  createclaimed(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'claim/add/',
      JSON.stringify(data),
      this.options
    );
  }

  updateclaimed(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'claim/update/',
      JSON.stringify(data),
      this.options
    );
  }
  pickClaim(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'claim/pickClaim/',
      JSON.stringify(data),
      this.options
    );
  }

  updateClaimedAnnexure(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'claim/updateClaimAnnexture/',
      JSON.stringify(data),
      this.options
    );
  }

  //Reports
  getStage(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'claimStage/get/',
      JSON.stringify(data),
      this.options
    );
  }

  inspectorWiseSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'inspectorWiseSummary/getinspectorWiseSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  inspectorWiseAmountStatus(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'inspectorWiseAmountStatus/getinspectorWiseAmountStatus/',
      JSON.stringify(data),
      this.options
    );
  }

  DashboardCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'stagewisecount/getstagewisecount/',
      JSON.stringify(data),
      this.options
    );
  }

  stagewisestats(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'stagewisestats/getstagewisestats/',
      JSON.stringify(data),
      this.options
    );
  }

  dayWiseSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'dayWiseSummary/getdayWiseSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  //stage master
  getstage(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'claimStage/get',
      JSON.stringify(data),
      this.options
    );
  }

  createstage(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'claimStage/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatestage(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'claimStage/update/',
      JSON.stringify(role),
      this.options
    );
  }
  // getdaywisecount(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: any,
  //   MONTH: any,
  //   YEAR: any
  // ) {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     MONTH: MONTH,
  //     YEAR: YEAR,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'daywisecount/getdaywisecount',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getdaywisecount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,

    filter: any,
    MONTH: any,
    YEAR: any,
    DAY: any
  ) {
    var data = {
      pageIndex: pageIndex,

      pageSize: pageSize,

      sortKey: sortKey,

      sortValue: sortValue,

      filter: filter,

      MONTH: MONTH,

      YEAR: YEAR,

      DAY: DAY,
    };

    return this.httpClient.post<any>(
      this.url + 'daywisecount/getdaywisecount',
      JSON.stringify(data),
      this.options
    );
  }
  userchangepassordforgot(
    MOBILE_NO: string,
    NEW_PASSWORD: string
  ): Observable<User[]> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      NEW_PASSWORD: NEW_PASSWORD,
    };
    return this.httpClient.post<User[]>(
      this.url1 + 'user/changeForgotPassword',
      JSON.stringify(data),
      this.options
    );
  }

  otplogin(MOBILE_NO: string): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
    };

    return this.httpClient.post<any>(
      this.url1 + 'user/forgotPassword',
      JSON.stringify(data),
      this.options
    );
  }
  verifyOTP(MOBILE_NO: string, OTP: string): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      OTP: OTP,
    };

    return this.httpClient.post<any>(
      this.url1 + 'user/verifyOtp',
      JSON.stringify(data),
      this.options
    );
  }

  getcheckpassword(ID: string, PASSWORD: number): Observable<User[]> {
    var data = {
      ID: ID,
      PASSWORD: PASSWORD,
    };
    return this.httpClient.post<User[]>(
      this.url + 'user/checkPassword',
      JSON.stringify(data),
      this.options
    );
  }

  userchangepassord(ID: string, NEW_PASSWORD: string): Observable<User[]> {
    var data = {
      ID: ID,
      NEW_PASSWORD: NEW_PASSWORD,
    };
    return this.httpClient.post<User[]>(
      this.url + 'user/changePassword',
      JSON.stringify(data),
      this.options
    );
  }

  ///addclaimed
  // getclaimed(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<Homepage[]> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter
  //   };
  //   return this.httpClient.post<any>(this.url + "claim/get", JSON.stringify(data), this.options);
  // }

  getclaimMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any,
    TYPE_OF_HOSPITAL: any,
    STAGE_NAME: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      TYPE_OF_HOSPITAL: TYPE_OF_HOSPITAL,
      STAGE_NAME: STAGE_NAME,
    };
    return this.httpClient.post<any>(
      this.url + 'claim/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getClaimMasterCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'claim/getAllDataCount/',
      JSON.stringify(data),
      this.options
    );
  }
  // createclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;

  //   return this.httpClient.post<any>(this.url + "claim/add/", JSON.stringify(role), this.options);
  // }

  // createclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     'applicationkey': 'TQ7JZ1FDsSA1qHED',
  //     'deviceid': this.cookie.get('deviceId'),
  //     'supportkey': this.cookie.get('supportKey'),
  //     'Token': this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders
  //   };
  //   var data= Object.assign({},role)
  //   return this.httpClient.post<any>(this.url + "claim/add/", JSON.stringify(data), this.options);
  // }

  // updateclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;
  //
  //   return this.httpClient.put<any>(
  //     this.url + 'claim/update/',
  //     JSON.stringify(role),
  //     this.options
  //   );
  // }

  createannexture(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'annexture/create',
      JSON.stringify(role),
      this.options
    );
  }
  createannextureadd(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'annexture/addBulk',
      JSON.stringify(role),
      this.options
    );
  }
  updateannextureadd(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'annexture/update',
      JSON.stringify(role),
      this.options
    );
  }
  getannexture(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'annexture/get',
      JSON.stringify(data),
      this.options
    );
  }

  addannexturebulk(obj: any): Observable<any> {
    //
    var data = {
      // ROLE_ID: roleId,
      ANNEXTURES: obj,
    };
    return this.httpClient.post<any>(
      this.url + 'annexture/addBulk',
      data,
      this.options
    );
  }

  updateclaimed1(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'claim/update/',
      JSON.stringify(data),
      this.options
    );
  }
  updateEmployeeMaster1(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    //  EMPLOYEE_NAME_HN:EMPLOYEE_NAME_HN,
    // FILE_NO:FILE_NO,
    // RELATIONSHIP_HN

    return this.httpClient.put<any>(
      this.url + 'employee/update/',
      JSON.stringify(data),
      this.options
    );
  }
  ///addclaimed
  // getclaimed(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<Homepage[]> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter
  //   };
  //   return this.httpClient.post<any>(this.url + "claim/get", JSON.stringify(data), this.options);
  // }

  // // createclaimed(role: any): Observable<any> {
  // //   role.CLIENT_ID = this.clientId;

  // //   return this.httpClient.post<any>(this.url + "claim/add/", JSON.stringify(role), this.options);
  // // }

  // createclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     'applicationkey': 'TQ7JZ1FDsSA1qHED',
  //     'deviceid': this.cookie.get('deviceId'),
  //     'supportkey': this.cookie.get('supportKey'),
  //     'Token': this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders
  //   };
  //   var data= Object.assign({},role)
  //   return this.httpClient.post<any>(this.url + "claim/add/", JSON.stringify(data), this.options);
  // }

  // updateclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.url + 'claim/update/',
  //     JSON.stringify(role),
  //     this.options
  //   );
  // }
  ///addclaimed
  getAllHospital(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'hospital/get',
      JSON.stringify(data),
      this.options
    );
  }

  // createclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;

  //   return this.httpClient.post<any>(this.url + "claim/add/", JSON.stringify(role), this.options);
  // }

  createHospital(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'TQ7JZ1FDsSA1qHED',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'hospital/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateHospital(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'hospital/update/',
      JSON.stringify(role),
      this.options
    );
  }

  ///addclaimed
  getAllQuestions(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'questionaries/get',
      JSON.stringify(data),
      this.options
    );
  }

  createQuestions(data: any): Observable<any> {
    var role = Object.assign({}, data);
    role.CLIENT_ID = this.clientId;
    if (
      role.CGHS_AMA_REFERENCE_DATE != undefined &&
      role.CGHS_AMA_REFERENCE_DATE != null &&
      role.CGHS_AMA_REFERENCE_DATE != '' &&
      role.CGHS_AMA_REFERENCE_DATE.length != 0
    ) {
      role.CGHS_AMA_REFERENCE_DATE = role.CGHS_AMA_REFERENCE_DATE.toString();
    } else {
      role.CGHS_AMA_REFERENCE_DATE = '';
    }
    if (
      role.CGHS_AMA_REFERENCE_END_DATE != undefined &&
      role.CGHS_AMA_REFERENCE_END_DATE != null &&
      role.CGHS_AMA_REFERENCE_END_DATE != '' &&
      role.CGHS_AMA_REFERENCE_END_DATE.length != 0
    ) {
      role.CGHS_AMA_REFERENCE_END_DATE =
        role.CGHS_AMA_REFERENCE_END_DATE.toString();
    } else {
      role.CGHS_AMA_REFERENCE_END_DATE = '';
    }
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'questionaries/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateQuestions(data: any): Observable<any> {
    var role = Object.assign({}, data);
    role.CLIENT_ID = this.clientId;
    if (
      role.CGHS_AMA_REFERENCE_DATE != undefined &&
      role.CGHS_AMA_REFERENCE_DATE != null &&
      role.CGHS_AMA_REFERENCE_DATE != '' &&
      role.CGHS_AMA_REFERENCE_DATE.length != 0
    ) {
      role.CGHS_AMA_REFERENCE_DATE = role.CGHS_AMA_REFERENCE_DATE.toString();
    } else {
      role.CGHS_AMA_REFERENCE_DATE = '';
    }
    if (
      role.CGHS_AMA_REFERENCE_END_DATE != undefined &&
      role.CGHS_AMA_REFERENCE_END_DATE != null &&
      role.CGHS_AMA_REFERENCE_END_DATE != '' &&
      role.CGHS_AMA_REFERENCE_END_DATE.length != 0
    ) {
      role.CGHS_AMA_REFERENCE_END_DATE =
        role.CGHS_AMA_REFERENCE_END_DATE.toString();
    } else {
      role.CGHS_AMA_REFERENCE_END_DATE = '';
    }
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'questionaries/update/',
      JSON.stringify(data),
      this.options
    );
  }
  ///addclaimed
  getAllChecklist(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'checklist/get',
      JSON.stringify(data),
      this.options
    );
  }

  createChecklist(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'checklist/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateChecklist(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'checklist/update/',
      JSON.stringify(data),
      this.options
    );
  }

  otplogin1(MOBILE_NO: string): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
    };
    return this.httpClient.post<any>(
      this.url1 + 'employee/sendEmployeeRegistrationOtp',
      JSON.stringify(data),
      this.options
    );
  }

  verifyOTP1(MOBILE_NO: string, OTP: string): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      OTP: OTP,
    };
    return this.httpClient.post<any>(
      this.url1 + 'employee/verifyOtp',
      JSON.stringify(data),
      this.options
    );
  }

  loginemployee(email: string, password: string) {
    this.getheader();
    var data = {
      username: email,
      password: password,
    };
    return this.httpClient.post(
      this.baseUrl + 'employee/login',
      JSON.stringify(data),
      this.options
    );
  }

  createregistrtion(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url1 + 'employee/registrationEmployee',
      JSON.stringify(role),
      this.options
    );
  }

  getFileMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    userId: any
  ): Observable<Filemaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      USER_ID: userId,
    };
    return this.httpClient.post<Filemaster[]>(
      this.url + 'filemaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  createfile(filemaster: any): Observable<any> {
    filemaster.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'filemaster/create',
      JSON.stringify(filemaster),
      this.options
    );
  }

  updatefile(filemaster: any): Observable<any> {
    filemaster.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'filemaster/update/',
      JSON.stringify(filemaster),
      this.options
    );
  }

  getAllFilehierarchy(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FileHierarchy[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<FileHierarchy[]>(
      this.url + 'filehirarchy/get',
      JSON.stringify(data),
      this.options
    );
  }

  createFilehierarchy(FileHierarchy: FileHierarchy): Observable<number> {
    FileHierarchy.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'filehirarchy/create/',
      JSON.stringify(FileHierarchy),
      this.options
    );
  }

  updateFilehierarchy(FileHierarchy: FileHierarchy): Observable<number> {
    FileHierarchy.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'filehirarchy/update/',
      JSON.stringify(FileHierarchy),
      this.options
    );
  }

  getLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FileHierarchy[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<FileHierarchy[]>(
      this.url + 'filetransferdetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  createsimpleEmployeeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/createEmployee',
      JSON.stringify(data),
      this.options
    );
  }
  createEmployeeMasterBasic(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/createBasic',
      JSON.stringify(data),
      this.options
    );
  }

  getActivityLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'activityLogs/getactivityLogs',
      JSON.stringify(data),
      this.options
    );
  }

  beneficiarytypeamountstats(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'beneficiaryTypeWiseAmountStatus/get/',
      JSON.stringify(data),
      this.options
    );
  }

  beneficiarytypewisesummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'beneficiaryTypeWiseSummary/get/',
      JSON.stringify(data),
      this.options
    );
  }

  hospitalWiseSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    TYPE_OF_HOSPITAL: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TYPE_OF_HOSPITAL: TYPE_OF_HOSPITAL,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'hospitalWiseSummary/gethospitalWiseSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  employeewiseamountstats(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeWiseAmountStatus/get',
      JSON.stringify(data),
      this.options
    );
  }
  employeewisesummaryreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeWiseSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  hospitalWiseamountstats(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    HOSPITAL_TYPE: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      HOSPITAL_TYPE: HOSPITAL_TYPE,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'hospitalWiseAmountStatus/get',
      JSON.stringify(data),
      this.options
    );
  }

  userwisefilessummaryreports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'userWiseFileSummary/get',
      JSON.stringify(data),
      this.options
    );
  }
  userwiseFilesDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    CREATOR_ID: any,
    HIRARCHY_ID: any,
    FILE_YEAR: any,
    FILE_STATUS: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CREATOR_ID: CREATOR_ID,
      HIRARCHY_ID: HIRARCHY_ID,
      FILE_YEAR: FILE_YEAR,
      FILE_STATUS: FILE_STATUS,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'userWiseFileDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  getclaimMaster2(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'claim/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getAllhierarchywisesummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    START_DATE: any,
    END_DATE: any
  ): Observable<FileHierarchy[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<FileHierarchy[]>(
      this.url + 'hirarchyWiseFileSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  userfileactivitydetailedreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    // CREATOR_ID:any,
    // HIRARCHY_ID:any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      // CREATOR_ID:CREATOR_ID,
      // HIRARCHY_ID:HIRARCHY_ID,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'report/userFileActivityDetailedReport',
      JSON.stringify(data),
      this.options
    );
  }

  dayWiseFilesSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    CREATOR_ID: any,
    // HIRARCHY_ID:any,
    // FILE_YEAR:any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CREATOR_ID: CREATOR_ID,
      // HIRARCHY_ID:HIRARCHY_ID,
      // FILE_YEAR:FILE_YEAR,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'report/dayWiseFilesSummaryReport',
      JSON.stringify(data),
      this.options
    );
  }

  userWiseFileClosurereport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    CREATOR_ID: any,
    HIRARCHY_ID: any,
    FILE_YEAR: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CREATOR_ID: CREATOR_ID,
      HIRARCHY_ID: HIRARCHY_ID,
      FILE_YEAR: FILE_YEAR,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'userWiseFileColserDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updatefileor(filemaster: any): Observable<any> {
    filemaster.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'filemaster/updateOR/',
      JSON.stringify(filemaster),
      this.options
    );
  }

  addbulkforaccept(
    data1: any,
    status: any,
    REMARK: any,
    userId
  ): Observable<any> {
    //
    var data = {
      data: data1,
      ACTION_STATUS: status,
      REMARK: REMARK,
      USER_ID: userId,
    };
    return this.httpClient.post<any>(
      this.url + 'filemaster/addBulk',
      data,
      this.options
    );
  }
  addbulkforaccept1(
    data1: any,
    REMARK: any,
    IS_ADVANCE: any,
    userId: any
  ): Observable<any> {
    //
    var data = {
      data: data1,
      REMARK: REMARK,
      IS_ADVANCE: IS_ADVANCE,
      USER_ID: userId,
    };
    return this.httpClient.post<any>(
      this.url + 'filemaster/addBulk',
      data,
      this.options
    );
  }
  addbulkforaccept3(
    FileHierarchy: any,
    remark: any,
    UserId: any,
    ACTION_STATUS: any,
    sendData: any
  ): Observable<any> {
    //
    var data = {
      CLIENT_ID: this.clientId,
      RICIVER_ID: FileHierarchy,
      REMARK: remark,
      SENDER_ID: UserId,
      ACTION_STATUS: ACTION_STATUS,
      data: sendData,
    };
    return this.httpClient.post<any>(
      this.url + 'filemaster/addBulk',
      data,
      this.options
    );
  }

  transferFile(
    FileHierarchy: any,
    remark: any,
    FileID: any,
    UserId: any,
    ACTION_STATUS: any
  ): Observable<number> {
    var data = {
      CLIENT_ID: this.clientId,
      RICIVER_ID: FileHierarchy,
      REMARK: remark,
      FILE_ID: FileID,
      SENDER_ID: UserId,
      ACTION_STATUS: ACTION_STATUS,
    };
    return this.httpClient.post<number>(
      this.url + 'filetransferdetails/create/',
      JSON.stringify(data),
      this.options
    );
  }

  getHierarchyMaster1(Hierarchy, hierarchyiID, year): Observable<Filemaster[]> {
    var data = {
      FILE_HIERARCHY_NAME: Hierarchy,
      HIERARCHY_ID: hierarchyiID,
      YEAR: year,
    };
    return this.httpClient.post<Filemaster[]>(
      this.url + 'filemaster/gethirarchyName',
      JSON.stringify(data),
      this.options
    );
  }

  translate(obj: any) {
    var httpHeaders = new HttpHeaders({
      'content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });

    var options = {
      headers: httpHeaders,
    };
    return this.httpClient.post(
      'https://translation.googleapis.com/language/translate/v2?key=\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQ3G92hFH+AwYU\nKqt0Qg8Q1tr3XHZIqDNn1erIB8b7YoTSqvF1b+2fZJGcsGCzOBxUEO46bv/be7OT\n4O4TaZdGZbgnLykhQpH2oesMOqjCLFJ9jrwLRVgHiXh4sPi7vZJcI9veig9LchWQ\nemNCTywfInv/XYn68leANZ9w+x2Si67dWD99nQDsEFUHXMO8j628iU5Zs1Vo9awz\nx44niy2Iddsxf8q23o8d+LUkOf5RT0r3YeraAMikLOKbRfmxlyBjEdUL8dAlIl9n\nEoukOzDJxOSGdIqdxN8CYGVNOrzW4CDPP0iAWDHmPj7tWZE3Um8+h2lO3TspsS/E\nInW8ShgDAgMBAAECggEAKxUUJVhXFkeJ8Ed8dHgNCQINX1Hlb9huaWxKhjEh8bOs\nMwdaBoZCUoxTbhlauRJwAmSCpWhLudgBYXKc+7MEpZAtA6JYBidJR+OCB0IO3KjX\n47WmoWd/NcahyKtBXnyT4clcY8QFpneIiE6N5LOtOJlF7X3BQpv+gAfyomRcuC9W\nR3/MZot4C9RUJYabymaUEUWLUT5db1IGPzFNCxcWqtNQTHJaDanyVGT+FTy5HPvg\nhDNtsOwXJF6aravErUD/1TLilrQt4LBFcVYr46Hp7cGUMQv96ZjxlbGk+gjMF7PE\nkoUnGzQgzAiXwf42BhcGecY70lAV+cwJ8L1eTYdn4QKBgQDAmrj9hFfnyWOq3ChP\nGPisp5kvE15kN7HS25gFtRYDJWu8P9hd39nU8JZ788IN5xNdd6z9JPR0Km8ryF+W\nexIzvwdPHKjodmoTAjg6emVHjIExXVQUsVG0DqTgJ0ES5LTRmlk4ZnNnkNMbcKQ5\n+UwOMFwmUrXWSW+iTaoO7HpI0QKBgQDAisElOz67wpDs60VADJ6nxU9dN/5Ms/ii\nfjBlkgs6ToYoxYOqx+n/xXKv/7d3CCx9B3M7e9aSEbiT+ZnMDOanwxgetGuITZ3H\nUp1HdbOi7DuElAzq2at1d7CBObS1EGtSfIYA9z4QYGgiNJaorxWD+AdHcYXdczpz\nTV6AEf/IkwKBgGBhTG74efCwM2K9tqIWMeJcH+iRvatSv3ZvkrxQaMp8QFQ8cq5P\nJTdMiVFPomzIlEUybOtkQbubvHPhWgv4XBxu3F53TgK9tsj6VF7W/rV2FvQ36qpM\nLUF4DoNowUSOE/nLThhOFDPgIfPaQyQLn0Z+Zq56tymbJ/TE/nNnXK3xAoGAchdG\nT/uFNtkZ62mWBVf1A1EFsCUnyOez4wWHRAiAIrK5CJvRY3dGj0q+pM+QNTZgtk2d\n2JePE8rwZq62lZTncG1Ic5lRRtlHLv8jN17lbRsyQWNBLECDOv4LVueMzuXF0oD7\nHsNiwW1/BxXGWHo285YbKhh4zDolXoFwB8+ik4UCgYBN+zDjj2J9TWIEwEHZZyNN\nXQPPxeuFrz5f1Q5dr6jjn/S0tbKRzVJoNipHB6sWCLRpPOBm3So8EOyjzMVo7sTv\nEhdBsO7aNwb0HAAkW7T+O0TbqXX+S5lks8i9Uct8Dd3dLgbtgBH4e8RASiLMAHj5\nX3sLUU9N53T7ul4g+6xhkQ==',

      obj,
      options
    );
  }

  getuserwisesummary(userid: any, LOGIN_ROLE: any) {
    var data = {
      CREATOR_ID: userid,
      LOGIN_ROLE: LOGIN_ROLE,
    };
    return this.httpClient.post<any>(
      this.url + 'userWiseSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getdaywisefilessummaryreport(userid: any, date: any) {
    var data = {
      CREATOR_ID: userid,
      START_DATE: date,
    };
    return this.httpClient.post<any>(
      this.url + 'dayWiseFilesSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateClaimMaster(claimmaster: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'claim/updateClaimMaster',
      JSON.stringify(claimmaster),
      this.options
    );
  }
  getFileMaster1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    userId: any
  ): Observable<Filemaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      USER_ID: userId,
    };
    return this.httpClient.post<Filemaster[]>(
      this.url + 'filemaster/getFileMasterData',
      JSON.stringify(data),
      this.options
    );
  }
  getHospitalMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'claimHospitalMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  createHospitalMapping(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'claimHospitalMapping/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateHospitalMapping(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'claimHospitalMapping/update/',
      JSON.stringify(data),
      this.options
    );
  }
  deleteHospitalMapping(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'claimHospitalMapping/delete/',
      JSON.stringify(data),
      this.options
    );
  }

  updatebulk(data1: string[]): Observable<any> {
    //
    var data = {
      hospitalData: data1,
    };
    return this.httpClient.put<any>(
      this.url + 'claimHospitalMapping/updateBulk',
      data,
      this.options
    );
  }

  employeechangepassordforgot(
    MOBILE_NO: string,
    NEW_PASSWORD: string
  ): Observable<User[]> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      NEW_PASSWORD: NEW_PASSWORD,
    };
    return this.httpClient.post<User[]>(
      this.url1 + 'employee/changeForgotPassword',
      JSON.stringify(data),
      this.options
    );
  }

  beneficiarytypewisesummarydetailed(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    HOSPITAL_TYPE: any,
    // CURRENT_STAGE_ID: any,
    INSPECTOR_ID: any,
    BENEFICIARY_TYPE: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      HOSPITAL_TYPE: HOSPITAL_TYPE,
      // CURRENT_STAGE_ID: CURRENT_STAGE_ID,
      INSPECTOR_ID: INSPECTOR_ID,
      BENEFICIARY_TYPE: BENEFICIARY_TYPE,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'beneficiaryTypeWiseDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  hospitalWiseDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    HOSPITAL_TYPE: any,
    // CURRENT_STAGE_ID: any,
    INSPECTOR_ID: any,
    BENEFICIARY_TYPE: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      HOSPITAL_TYPE: HOSPITAL_TYPE,
      // CURRENT_STAGE_ID: CURRENT_STAGE_ID,
      INSPECTOR_ID: INSPECTOR_ID,
      BENEFICIARY_TYPE: BENEFICIARY_TYPE,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'hospitalWiseDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  inspectorWiseDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any,
    TYPE_OF_HOSPITAL: any
    // CURRENT_STAGE_ID: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      TYPE_OF_HOSPITAL: TYPE_OF_HOSPITAL,
      // CURRENT_STAGE_ID: CURRENT_STAGE_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'inspectorWiseDetails/getinspectorWiseDetails/',
      JSON.stringify(data),
      this.options
    );
  }
  employeewisedetailed(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    HOSPITAL_TYPE: any,
    // CURRENT_STAGE_ID: any,
    INSPECTOR_NAME: any,
    BENEFICIARY_TYPE: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      HOSPITAL_TYPE: HOSPITAL_TYPE,
      // CURRENT_STAGE_ID: CURRENT_STAGE_ID,
      INSPECTOR_NAME: INSPECTOR_NAME,
      BENEFICIARY_TYPE: BENEFICIARY_TYPE,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeWiseDetails/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getemployeecheckpassword(ID: string, PASSWORD: number): Observable<User[]> {
    var data = {
      ID: ID,
      PASSWORD: PASSWORD,
    };
    return this.httpClient.post<User[]>(
      this.url + 'employee/checkPassword',
      JSON.stringify(data),
      this.options
    );
  }

  forgotemployeeotp(MOBILE_NO: string): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
    };
    return this.httpClient.post<any>(
      this.url1 + 'employee/sendEmployeeOtp',
      JSON.stringify(data),
      this.options
    );
  }

  getSignature(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'signature/get',
      JSON.stringify(data),
      this.options
    );
  }

  createSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'signature/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'signature/update/',
      JSON.stringify(data),
      this.options
    );
  }

  getclaimLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FileHierarchy[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<FileHierarchy[]>(
      this.url + 'claimLog/get',
      JSON.stringify(data),
      this.options
    );
  }
  deleteClaim(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'claim/delete',
      JSON.stringify(data),
      this.options
    );
  }

  updateClaimEmployee(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'claim/updateClaimEmployee/',
      JSON.stringify(data),
      this.options
    );
  }

  deleteEmployee(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/delete',
      JSON.stringify(data),
      this.options
    );
  }

  getofficemaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'office/get',
      JSON.stringify(data),
      this.options
    );
  }

  createofficemaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'office/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateofficemaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'office/update/',
      JSON.stringify(role),
      this.options
    );
  }

  gettravelclass(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'travelClass/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtravelclass(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'travelClass/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetravelclass(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'travelClass/update/',
      JSON.stringify(role),
      this.options
    );
  }

  gettravelmode(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'travelMode/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtravelmode(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'travelMode/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetravelmode(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'travelMode/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getjourneydetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'journeyDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  createjourneydetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'journeyDetail/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatejourneydetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'journeyDetail/update/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetransferempdetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'transfer/tranferEmployee/',
      JSON.stringify(data),
      this.options
    );
  }

  transferbulkform(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'memberTransferParticular/createBulkMemberTransfer/',
      JSON.stringify(data),
      this.options
    );
  }

  gettransfarchnagedetails1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'roadBetweenPlacesConnectedRail/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtransfarchnagedetails1(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'roadBetweenPlacesConnectedRail/create',
      JSON.stringify(role),
      this.options
    );
  }

  updatetransfarchnagedetails1(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'roadBetweenPlacesConnectedRail/update',
      JSON.stringify(role),
      this.options
    );
  }
  getrelationtable(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'memberTransferParticular/get',
      JSON.stringify(data),
      this.options
    );
  }
  gettransferdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'transfer/get',
      JSON.stringify(data),
      this.options
    );
  }

  getHODPermissionMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'hodPermissionMaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  createHODPermission(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'hodPermissionMaster/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateHODPermission(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'hodPermissionMaster/update/',
      JSON.stringify(data),
      this.options
    );
  }
  getExpostFactoMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'exPostFactoMaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  createExpostFacto(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'exPostFactoMaster/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateExpostFacto(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'exPostFactoMaster/update/',
      JSON.stringify(data),
      this.options
    );
  }
  getDelayCondolationMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'delayCondolationMaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDelayCondolation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'delayCondolationMaster/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateDelayCondolation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'delayCondolationMaster/update/',
      JSON.stringify(data),
      this.options
    );
  }

  generateHODPermission(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'hodPermissionMaster/createPermission/',
      JSON.stringify(role),
      this.options
    );
  }
  generateExpostFacto(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'exPostFactoMaster/createPermission/',
      JSON.stringify(role),
      this.options
    );
  }
  generateDelayCondonation(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'delayCondolationMaster/createPermission/',
      JSON.stringify(role),
      this.options
    );
  }

  deleteTransfer(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'transfer/deleteTransferData',
      JSON.stringify(data),
      this.options
    );
  }

  updatetransfer(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'transfer/update',
      JSON.stringify(role),
      this.options
    );
  }

  gettransfortation(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'transportation/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtransfortation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'transportation/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetransfortation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'transportation/update/',
      JSON.stringify(role),
      this.options
    );
  }

  delettrasferrecord(dataa: number): Observable<any> {
    var data = {
      TRANSFER_ID: dataa,
    };
    return this.httpClient.put<any>(
      this.url + 'transportation/deleteRecords',
      JSON.stringify(data),
      this.options
    );
  }

  secondstagebulk(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'transportation/createTransportation/',
      JSON.stringify(role),
      this.options
    );
  }

  gettransfarchnagedetailspersonal(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'transportationChargesOfPersonalEffect/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtransfarchnagedetailspersonal(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'transportationChargesOfPersonalEffect/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetransfarchnagedetailspersonal(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'transportationChargesOfPersonalEffect/update/',
      JSON.stringify(role),
      this.options
    );
  }

  gettransfarchnagedetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'transportationChargesDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtransfarchnagedetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'transportationChargesDetail/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetransfarchnagedetails(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'transportationChargesDetail/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllltcMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ltc/get',
      JSON.stringify(data),
      this.options
    );
  }

  ltcMasterCreate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltc/create',
      JSON.stringify(role),
      this.options
    );
  }

  ltcMasterLTCCreate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltc/ltcCreate',
      JSON.stringify(role),
      this.options
    );
  }

  ltcMasterUpdate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltc/update',
      JSON.stringify(role),
      this.options
    );
  }

  ltcFamilyMasterCreate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltcFamily/create',
      JSON.stringify(role),
      this.options
    );
  }

  ltcFamilyMasterUpdate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltcFamily/update',
      JSON.stringify(role),
      this.options
    );
  }

  ltcJourneyDetail(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var dataaa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcJourneyDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  ltcJourneyDetailCreate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltcJourneyDetail/create',
      JSON.stringify(role),
      this.options
    );
  }

  ltcJourneyDetailUpdate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltcJourneyDetail/update',
      JSON.stringify(role),
      this.options
    );
  }

  ltcRoadConnectedRail(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var dataaa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcRoadBetweenPlacesConnectedRail/get',
      JSON.stringify(data),
      this.options
    );
  }

  ltcRoadConnectedRailCreate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltcRoadBetweenPlacesConnectedRail/create',
      JSON.stringify(role),
      this.options
    );
  }

  ltcRoadConnectedRailUpdate(role: any, LTC_ID: any): Observable<any> {
    var data = {
      LTC_ID: LTC_ID,
    };
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltcRoadBetweenPlacesConnectedRail/update',
      JSON.stringify(role),
      this.options
    );
  }

  getJourneyParticular(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var dataaa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'journeyParticular/get',
      JSON.stringify(data),
      this.options
    );
  }

  createJourneyParticular(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'journeyParticular/create',
      JSON.stringify(role),
      this.options
    );
  }
  updateJourneyParticular(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'journeyParticular/update',
      JSON.stringify(role),
      this.options
    );
  }

  updateHODPermissionLetter(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'hodPermissionMaster/updateHodPermission/',
      JSON.stringify(data),
      this.options
    );
  }

  updateExpostFactoLetter(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'exPostFactoMaster/updateExpostFacto/',
      JSON.stringify(data),
      this.options
    );
  }

  getltc_family_master(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcFamily/get',
      JSON.stringify(data),
      this.options
    );
  }

  getdeatilssofpurpose(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var dataa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataa,
    };
    return this.httpClient.post<any>(
      this.url + 'tourJourneyDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  createdeatilssofpurpose(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'tourJourneyDetail/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatedeatilssofpurpose(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'tourJourneyDetail/update/',
      JSON.stringify(role),
      this.options
    );
  }

  gettoursparticularhotel(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var dataaa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'particularsOfHotel/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtoursparticularhotel(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'particularsOfHotel/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetoursparticularhotel(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'particularsOfHotel/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getjourneyofparticulartours(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var dataaa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'journeyOfParticular/get',
      JSON.stringify(data),
      this.options
    );
  }

  createjourneyofparticulartours(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'journeyOfParticular/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatejourneyofparticulartours(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'journeyOfParticular/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getjourneyofparticularcity(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var dataaa = ' AND IS_DELETED = 0';
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'journeyDetailsPerformedByRoad/get',
      JSON.stringify(data),
      this.options
    );
  }

  createjourneyofparticularcity(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'journeyDetailsPerformedByRoad/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatejourneyofparticularcity(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'journeyDetailsPerformedByRoad/update/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetourmasterform(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'tour/tourDataCreate',
      JSON.stringify(data),
      this.options
    );
  }

  gettouralldata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'tour/get',
      JSON.stringify(data),
      this.options
    );
  }

  updatetour(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'tour/update/',
      JSON.stringify(data),
      this.options
    );
  }

  deleteDelayCondolationMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'delayCondolationMaster/delete',
      JSON.stringify(data),
      this.options
    );
  }

  deleteExPostFactoMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'exPostFactoMaster/delete',
      JSON.stringify(data),
      this.options
    );
  }

  deleteHODPermissionMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'hodPermissionMaster/delete',
      JSON.stringify(data),
      this.options
    );
  }

  deletetour(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'tour/deleteTourData',
      JSON.stringify(data),
      this.options
    );
  }

  getLTCquestions(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcQuestionariesDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  createLTCquestions(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltcQuestionariesDetail/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateLTCquestions(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltcQuestionariesDetail/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createtourmasterchecklist(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'tourChecklist/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatetourmasterchecklist(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'tourChecklist/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getTourChecklist(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'tourChecklist/get',
      JSON.stringify(data),
      this.options
    );
  }

  getcontact(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'claimReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  ///Transfer Checklist
  getAllTransferChecklist(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'transferChecklist/get',
      JSON.stringify(data),
      this.options
    );
  }
  // createclaimed(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;

  //   return this.httpClient.post<any>(this.url + "claim/add/", JSON.stringify(role), this.options);
  // }

  createTransferChecklist(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'transferChecklist/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateTransferChecklist(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'transferChecklist/update/',
      JSON.stringify(data),
      this.options
    );
  }

  updatebulkcal(data1: string[], ltcid: any): Observable<any> {
    var data = {
      ltcTravellingData: data1,
      LTC_ID: ltcid,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcJourneyDetail/addBulkLtcTravelling',
      data,
      this.options
    );
  }

  gettransferreddetailreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
    // CURRENT_STAGE_ID: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      // CURRENT_STAGE_ID: CURRENT_STAGE_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'transferDetailedReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getltcdetailreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcDetailedReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  deletedetailsofjourney(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'journeyDetail/update/',
      JSON.stringify(data),
      this.options
    );
  }

  deletetransportationcharges(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'transportationChargesOfPersonalEffect/update/',
      JSON.stringify(data),
      this.options
    );
  }

  deleterail(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'roadBetweenPlacesConnectedRail/update',
      JSON.stringify(data),
      this.options
    );
  }

  accommodation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'transportation/update/',
      JSON.stringify(data),
      this.options
    );
  }

  ltcJourneyChecklistcreate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltcJourneyChecklist/create',
      JSON.stringify(role),
      this.options
    );
  }

  ltcJourneyChecklistupdate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltcJourneyChecklist/update',
      JSON.stringify(role),
      this.options
    );
  }

  ltcJourneyChecklistget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'ltcJourneyChecklist/get',
      JSON.stringify(data),
      this.options
    );
  }

  modeWiseClassWiseCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'modeWiseClassWiseCount/get',
      JSON.stringify(data),
      this.options
    );
  }

  modeWiseAmountStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };

    return this.httpClient.post<any>(
      this.url + 'modeWiseAmountStat/get',
      JSON.stringify(data),
      this.options
    );
  }

  employeeWiseDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeWiseDetailedReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  dateWiseModeWiseCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'dateWiseModeWiseCount/get',
      JSON.stringify(data),
      this.options
    );
  }

  advancedAmountJourneyDetail(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    INSPECTOR_ID: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      INSPECTOR_ID: INSPECTOR_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'advancedAmountJourneyDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  getdayWiseCountReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,

    filter: any,
    MONTH: any,
    YEAR: any,
    DAY: any
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: MONTH,
      YEAR: YEAR,
      DAY: DAY,
    };

    return this.httpClient.post<any>(
      this.url + 'dayWiseCountReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getdayWiseCountTour(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,

    filter: any,
    MONTH: any,
    YEAR: any,
    DAY: any
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: MONTH,
      YEAR: YEAR,
      DAY: DAY,
    };

    return this.httpClient.post<any>(
      this.url + 'dayWiseCountTour/get',
      JSON.stringify(data),
      this.options
    );
  }

  getdayWiseCountLtc(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,

    filter: any,
    MONTH: any,
    YEAR: any,
    DAY: any
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: MONTH,
      YEAR: YEAR,
      DAY: DAY,
    };

    return this.httpClient.post<any>(
      this.url + 'dayWiseCountLtc/get',
      JSON.stringify(data),
      this.options
    );
  }

  inspecterwiseTransferSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any,
    INSPECTOR_ID: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      INSPECTOR_ID: INSPECTOR_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'inspecterwiseTransferSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getinspecterwiseTransferSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'inspecterwiseTransferSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  inspecterwiseLtcSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any,

    INSPECTOR_ID: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      INSPECTOR_ID: INSPECTOR_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'inspecterwiseLtcSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getinspecterwiseLtcSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'inspecterwiseLtcSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  inspecterwiseTourSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any,

    INSPECTOR_ID: any
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      INSPECTOR_ID: INSPECTOR_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'inspecterwiseTourSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getinspecterwiseTourSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'inspecterwiseTourSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  advanceGivenForJourneyLtc(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'advanceGivenForJourneyLtc/get',
      JSON.stringify(data),
      this.options
    );
  }

  modeWiseClassWiseLtcCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'modeWiseClassWiseLtcCount/get',
      JSON.stringify(data),
      this.options
    );
  }

  monthWiseClaimCountltc(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    INSPECTOR_ID: any,
    YEAR: any
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      INSPECTOR_ID: INSPECTOR_ID,
      YEAR: YEAR,
    };

    return this.httpClient.post<any>(
      this.url + 'monthWiseClaimCountLtc/get',
      JSON.stringify(data),
      this.options
    );
  }

  employeeWiseLtcDetailedReports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeWiseLtcDetailedReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  dateWiseModeWiseJourneyCountLtc(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    START_DATE: any,
    END_DATE: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    return this.httpClient.post<any>(
      this.url + 'dateWiseModeWiseJourneyCountLtc/get',
      JSON.stringify(data),
      this.options
    );
  }
  monthWiseTransferCountReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    MONTH_END: any,
    YEAR: any
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH_END: MONTH_END,
      YEAR: YEAR,
    };

    return this.httpClient.post<any>(
      this.url + 'monthWiseTransferCountReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateClaim(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //  applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'claim/updateClaim/',
      JSON.stringify(data),
      this.options
    );
  }
  gettoursFood(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var dataaa = ' AND IS_DELETED = 0';

    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter + dataaa,
    };
    return this.httpClient.post<any>(
      this.url + 'tourFoodExpenseDetail/get',
      JSON.stringify(data),
      this.options
    );
  }

  createtoursFood(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'tourFoodExpenseDetail/create',
      JSON.stringify(role),
      this.options
    );
  }

  updatetoursFood(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'tourFoodExpenseDetail/update',
      JSON.stringify(role),
      this.options
    );
  }
  getBlockYearMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcBlockYear/get',
      JSON.stringify(data),
      this.options
    );
  }

  createBlockYearMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'ltcBlockYear/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateBlockYearMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'ltcBlockYear/update/',
      JSON.stringify(data),
      this.options
    );
  }

  getltclog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ltcStageLog/get',
      JSON.stringify(data),
      this.options
    );
  }

  getTransferLog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'transferStageLog/get',
      JSON.stringify(data),
      this.options
    );
  }

  gettourlog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'tourStageLog/get',
      JSON.stringify(data),
      this.options
    );
  }

  //Designation Master
  getAllDesignations(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'designation/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDesignations(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'designation/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateDesignations(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'designation/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createClaimNew(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
    //   applicationkey: 'AfIpESwBr5eHp7w3',
    //   deviceid: this.cookie.get('deviceId'),
    //   supportkey: this.cookie.get('supportKey'),
    //   Token: this.cookie.get('token'),
    // });
    // this.options = {
    //   headers: this.httpHeaders,
    // };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'claim/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateClaimWithoutHospitalData(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'claim/updateClaimApp/',
      JSON.stringify(data),
      this.options
    );
  }

  employeechangechangepassord(
    ID: string,
    NEW_PASSWORD: string
  ): Observable<User[]> {
    var data = {
      ID: ID,
      NEW_PASSWORD: NEW_PASSWORD,
    };
    return this.httpClient.post<User[]>(
      this.url + 'employee/changePassword',
      JSON.stringify(data),
      this.options
    );
  }

  changepasss(MOBILE_NO: any, NEW_PASSWORD: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employee/changePassword',
      JSON.stringify({
        MOBILE_NO: MOBILE_NO,
        NEW_PASSWORD: NEW_PASSWORD,
      }),
      this.options
    );
  }
  changepasswordemployee(role: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employee/changePasswordForItbuddy',
      JSON.stringify(role),
      this.options
    );
  }
  changepassworduser(role: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'user/changePasswordForItBuddy',
      JSON.stringify(role),
      this.options
    );
  }
  logoutcall(): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      mobileNo: sessionStorage.getItem('loginmobileNo'),
    };
    return this.httpClient.post<any>(
      this.url + 'user/logout',
      JSON.stringify(data),
      this.options
    );
  }
  getAllGradePayLevel(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Form[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<Form[]>(
      this.url + 'graasGradePayLevel/get',
      JSON.stringify(data),
      this.options
    );
  }

  createGradePayLevel(form: Form): Observable<number> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'graasGradePayLevel/create/',
      JSON.stringify(form),
      this.options
    );
  }

  updateGradePayLevel(form: Form): Observable<number> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'graasGradePayLevel/update/',
      JSON.stringify(form),
      this.options
    );
  }

  Emailidotp(EMAIL_ID: any, EMP_ID: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employee/sendChangeEmailOtpForGraas',
      JSON.stringify({
        EMAIL_ID: EMAIL_ID,
        EMP_ID: EMP_ID,
      }),
      this.options
    );
  }

  Mobiledotp(MOBILE_NO: any, EMP_ID: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employee/sendChangeMobileNoOtpForGraas',
      JSON.stringify({
        MOBILE_NO: MOBILE_NO,
        EMP_ID: EMP_ID,
      }),
      this.options
    );
  }

  verifyOtp(EMAIL_ID: any, OTP: any, EMP_ID: any): Observable<any> {
    var data = {
      EMAIL_ID: EMAIL_ID,
      OTP: OTP,
      EMP_ID: EMP_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employee/verifyChangeEmailOtpForGraas',
      JSON.stringify(data),
      this.options
    );
  }

  onUpload2(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      // APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
    });
    let params = new HttpParams();
    const options1 = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);

    const req = new HttpRequest(
      'POST',
      this.imgUrl1 + folderName,
      fd,
      options1
    );
    return this.httpClient.request(req);
  }

  verifyMobileOTP(MOBILE_NO: any, OTP: any, EMP_ID: any): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      OTP: OTP,
      EMP_ID: EMP_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      'Access-Control-Allow-Headers': '*',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employee/verifyChangeMobileNoOtpForGraas',
      JSON.stringify(data),
      this.options
    );
  }
  getGradPay(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      applicationkey: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'gradePay/get',
      JSON.stringify(data),
      this.options
    );
  }

  deletePdf(FILE_URL: any): Observable<number> {
    // form.CLIENT_ID = this.clientId;
    var data = {
      FILE_URL: FILE_URL,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'web/removeFile',
      JSON.stringify(data),
      this.options
    );
  }
  getDDOTypeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoType/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateDDOTypeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ddoType/update',
      JSON.stringify(role),
      this.options
    );
  }
  getddoTypeDetailsMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoTypeDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  updateDDOTypeDetailsMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ddoTypeDetails/update',
      JSON.stringify(role),
      this.options
    );
  }

  createDDOTypeDetailsMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ddoTypeDetails/create',
      JSON.stringify(role),
      this.options
    );
  }
  createDDOTypeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ddoType/create',
      JSON.stringify(role),
      this.options
    );
  }

  ltcUpdateWithJourneyData(journey: any): Observable<any> {
    journey.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltc/addJourneyDetails',
      JSON.stringify(journey),
      this.options
    );
  }

  //DDO Master
  getAllDDOs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddo/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDDO(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ddo/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateDDO(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ddo/update/',
      JSON.stringify(role),
      this.options
    );
  }

  GettourSignature(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'tourSignature/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreatetourSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'tourSignature/create/',
      JSON.stringify(role),
      this.options
    );
  }

  UpdatetourSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'tourSignature/update/',
      JSON.stringify(role),
      this.options
    );
  }

  GetLTCSignature(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ltcSignature/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateLTCSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'ltcSignature/create/',
      JSON.stringify(role),
      this.options
    );
  }

  UpdateLTCSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ltcSignature/update/',
      JSON.stringify(role),
      this.options
    );
  }

  GetTransferSignature(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'transferSignature/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateTransferSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'transferSignature/create/',
      JSON.stringify(role),
      this.options
    );
  }

  UpdateTransferSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'transferSignature/update/',
      JSON.stringify(role),
      this.options
    );
  }

  GetMedicalSignature(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'claimSignature/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateMedicalSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'claimSignature/create/',
      JSON.stringify(role),
      this.options
    );
  }

  UpdateMedicalSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'claimSignature/update/',
      JSON.stringify(role),
      this.options
    );
  }

  tourDDOWiseSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoReportsTour/getClaimSummary/',
      JSON.stringify(data),
      this.options
    );
  }
  transferDDOWiseSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoReportsTransfer/getClaimSummary/',
      JSON.stringify(data),
      this.options
    );
  }
  medicalDDOWiseSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoReportsMedical/getClaimSummary/',
      JSON.stringify(data),
      this.options
    );
  }
  LTCDDOWiseSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoReportsLtc/getClaimSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  signatureSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<Homepage[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'ddoWiseReports/getSignatureSummary/',
      JSON.stringify(data),
      this.options
    );
  }
}
