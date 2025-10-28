import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { appkeys, grass } from 'src/app/app.constant';

@Injectable({
  providedIn: 'root',
})
export class APIServicesService {
  Baseurl = grass.baseUrl;
  url = grass.url;
  clientId = 1;
  retriveimgUrl = grass.retriveimgUrl;
  imgUrl = grass.imgUrl;
  imgUrl1 = grass.imgUrl + 'api/';
  url1 = this.Baseurl + '';
  dateforlog =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };

  // loggerUrl = grass.gmUrl;

  constructor(public httpClient: HttpClient, public cookie: CookieService) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = Math.floor(100000 + Math.random() * 900000);

      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '',
        '',
        false,
        'Strict'
      );
      //localStorage.setItem("deviceId",deviceId.toString())
    }

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      // 'APPLICATION_KEY': 'TQ7JZ1FDsSA1qHED',

      deviceid: this.cookie.get('deviceId'),
      visitorid: this.cookie.get('visitorId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  logoutForSessionValues() {
    this.cookie.delete('supportKey');
    this.cookie.delete('token');
    sessionStorage.clear();
    window.location.reload();
  }

  //get all any For login menu
  // getForms(userId: number, roleId: number) {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   var data = {
  //     USER_ID: userId,
  //     ROLE_ID: roleId,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'user/getForms',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  //get all any For login menu
  getForms(userId: number, roleId: number, service: any) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      USER_ID: userId,
      ROLE_ID: roleId,
      SERVICE_ID: service,
    };
    return this.httpClient.post<any>(
      this.url + 'user/getForms',
      JSON.stringify(data),
      this.options
    );
  }

  getCheckAccessOfForm(roleId: number, link: string) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      ROLE_ID: roleId,
      LINK: link,
    };
    return this.httpClient.post<any>(
      this.url + 'roleDetails/checkAccess',
      JSON.stringify(data),
      this.options
    );
  }

  // Password Validation(Alphanumeric)
  passwordIsValid(value: any) {
    const expression = /^[A-Za-z0-9@#]*$/;
    return expression.test(String('' + value).toLowerCase());
  }

  loginemployee(email: string, password: string) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      username: email,
      password: password,
    };

    return this.httpClient.post<any>(
      this.Baseurl + 'employee/login',
      JSON.stringify(data),
      this.options
    );
  }

  login(email: string, password: string) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = {
      username: email,
      password: password,
    };
    return this.httpClient.post<any>(
      this.Baseurl + 'user/login',
      JSON.stringify(data),
      this.options
    );
  }

  // addLog(type: any, text: any, userId: any): Observable<number> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   var data = {
  //     LOG_TYPE: type,
  //     LOG_TEXT: this.dateforlog + ' ' + text,
  //     USER_ID: userId,
  //     CLIENT_ID: this.clientId,
  //   };
  //   return this.httpClient.post<number>(
  //     this.loggerUrl + 'device/addLog',
  //     JSON.stringify(data),
  //     this.options1
  //   );
  // }

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

  employeechangepassordforgot(
    MOBILE_NO: string,
    NEW_PASSWORD: string
  ): Observable<any> {
    var data = {
      MOBILE_NO: MOBILE_NO,
      NEW_PASSWORD: NEW_PASSWORD,
    };
    return this.httpClient.post<any>(
      this.url1 + 'employee/changeForgotPassword',
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

  deleteEmployee(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/delete',
      JSON.stringify(data),
      this.options
    );
  }

  requestPermission(userId: string) {
    // this.angularFireMessaging.requestToken.subscribe(
    //   (token) => {
    //
    //     this.cloudID=token
    //
    //    //this.updateToken(userId, token);
    //   },
    //   (err) => {
    //     console.error('Unable to get permission to notify.', err);
    //   }
    // );
  }

  // httpHeaders2 = new HttpHeaders({
  //   Accept: 'application/json',
  //   APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //   // 'APPLICATION_KEY': 'TQ7JZ1FDsSA1qHED',
  //   Token: this.cookie.get('token'),
  // });
  // options2 = {
  //   headers: this.httpHeaders2,
  // };

  // loggerInit() {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   var data = {
  //     CLIENT_ID: this.clientId,
  //   };
  //   return this.httpClient.post<any>(
  //     this.loggerUrl + 'device/init',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getAllForms(
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
      this.url + 'form/get',
      JSON.stringify(data),
      this.options
    );
  }

  createForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'form/create/',
      JSON.stringify(form),
      this.options
    );
  }

  updateForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'form/update/',
      JSON.stringify(form),
      this.options
    );
  }

  //methods for role related opearation  - ROLE
  // logout(): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'APIKEY': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     'APPLICATION_KEY': 'TQ7JZ1FDsSA1qHED',
  //     'deviceid': this.cookie.get('deviceId'),
  //     'supportkey': this.cookie.get('supportKey'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders
  //   };
  //   var data = {
  //     USER_ID: this.userid1,
  //     LAST_LOGIN_DATETIME: this.lastlogin
  //   };
  //   // return this.httpClient.post<any>(this.Baseurl + "user/login", JSON.stringify(data), this.options);
  //   return this.httpClient.post<any>(this.Baseurl + "user/clearToken", JSON.stringify(data) ,this.options);
  // }

  getAllRoles(
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
      this.url + 'role/get',
      JSON.stringify(data),
      this.options
    );
  }

  createRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'role/create/',
      JSON.stringify(application),
      this.options
    );
  }

  updateRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'role/update/',
      JSON.stringify(application),
      this.options
    );
  }

  //get all form assigned - ROLE_DETAILS
  getRoleDetail(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    //
    return this.httpClient.post<any>(
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
      this.url + 'roleDetails/addBulk',
      data,
      this.options
    );
  }

  //method for user replated opearation - USER
  getmappinguser(
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
      this.url + 'userRoleMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllUsers(
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
      this.url + 'user/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    // user.PASSWORD = (Md5.hashStr(user.PASSWORD)).toString()
    return this.httpClient.post<any>(
      this.url + 'user/create/',
      JSON.stringify(user),
      this.options
    );
  }

  updateUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    // user.PASSWORD = (Md5.hashStr(user.PASSWORD)).toString()
    return this.httpClient.put<any>(
      this.url + 'user/update/',
      JSON.stringify(user),
      this.options
    );
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getAllotmentchecklist(
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
    return this.httpClient.post<any>(
      this.url + 'flatChecklist/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateAllotmentchecklist(data: any): Observable<any> {
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
    return this.httpClient.put<any>(
      this.url + 'flatChecklist/update',
      JSON.stringify(data),
      this.options
    );
  }

  createAllotmentchecklist(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
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
    return this.httpClient.post<any>(
      this.url + 'flatChecklist/create',
      JSON.stringify(data),
      this.options
    );
  }

  getResidence(
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
    var residanceTypeIds: any;
    if (
      sessionStorage.getItem('residanceids') != null &&
      sessionStorage.getItem('residanceids') != '' &&
      sessionStorage.getItem('residanceids') != undefined
    ) {
      residanceTypeIds =
        ' AND ID in (' + sessionStorage.getItem('residanceids') + ')';
    } else {
      residanceTypeIds = '';
    }

    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: residanceTypeIds + filter,
    };
    return this.httpClient.post<any>(
      this.url + 'residenceType/get/',
      JSON.stringify(data),
      this.options
    );
  }
  getResidence1111(
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
      this.url + 'residenceType/get/',
      JSON.stringify(data),
      this.options
    );
  }
  createResidence(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
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

    return this.httpClient.post<any>(
      this.url + 'residenceType/create',
      JSON.stringify(user),
      this.options
    );
  }

  updateResidencr(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'residenceType/update',
      JSON.stringify(user),
      this.options
    );
  }

  //

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

  createGradPay(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

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

    return this.httpClient.post<any>(
      this.url + 'gradePay/create',

      JSON.stringify(user),

      this.options
    );
  }

  updateGradPay(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
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
    return this.httpClient.put<any>(
      this.url + 'gradePay/update',
      JSON.stringify(user),
      this.options
    );
  }

  // ---------------------------------------------- Area Master ------------------------------------------------

  getareamaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'area/get',
      JSON.stringify(data),
      this.options
    );
  }

  Updateareamaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'area/update',
      JSON.stringify(data),
      this.options
    );
  }

  createareamaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'area/create',
      JSON.stringify(data),
      this.options
    );
  }

  // ------------------------------------------- City Master ----------------------------------------------------------------

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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data),
      this.options
    );
  }

  getStateMaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  getDistrictMaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'district/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateCityMaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(data),
      this.options
    );
  }

  createCityMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(data),
      this.options
    );
  }

  // ---------------------------------------------- Block Master ------------------------------------------------

  getBlockmaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'block/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateBlockmaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'block/update',
      JSON.stringify(data),
      this.options
    );
  }

  createBlockmaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'block/create',
      JSON.stringify(data),
      this.options
    );
  }

  // ---------------------------------------------- AllotmentCheckList Master ------------------------------------------------

  getAllotmentCheckListmaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatChecklist/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateAllotmentCheckListmaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'flatChecklist/update',
      JSON.stringify(data),
      this.options
    );
  }

  createAllotmentCheckListmaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatChecklist/create',
      JSON.stringify(data),
      this.options
    );
  }

  // onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
  //   this.httpHeaders1 = new HttpHeaders({
  //     'Accept': 'application/json',
  //     'APIKEY': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     // APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     'Token': this.cookie.get('token'),
  //     'supportkey': this.cookie.get('supportKey'),
  //   });
  //   this.options1 = {
  //     headers: this.httpHeaders1
  //   };
  //   const fd = new FormData()
  //   fd.append("Document", selectedFile, filename)
  //   return this.httpClient.post<any>(grass.imgUrl + folderName, fd, this.options1);
  // }

  //Employee master
  getEmployeeMaster(
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
      this.url + 'employee/get',
      JSON.stringify(data),
      this.options
    );
  }

  createEmployeeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/create/',
      JSON.stringify(data),
      this.options
    );
  }

  updateEmployeeMasterFromClaim(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'employee/updateEmployee/',
      JSON.stringify(data),
      this.options
    );
  }
  updateEmployeeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'employee/update/',
      JSON.stringify(data),
      this.options
    );
  }

  createsimpleEmployeeMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'employee/createEmployee',
      JSON.stringify(data),
      this.options
    );
  }

  // ---------------------------------------------- Allotment Master ------------------------------------------------

  getAllotmenmaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    // var keyyyy=' AND IS_DELETED=0'
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatRequest/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateAllotmentmaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'flatRequest/update',
      JSON.stringify(data),
      this.options
    );
  }

  createAllotmentmaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatRequest/createRequest',
      JSON.stringify(data),
      this.options
    );
  }

  // makeobservable;

  getQuarterMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'flat/get',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatAvailabilityget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    EMP_ID: any
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      EMP_ID: EMP_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'flat/getFlatData',
      JSON.stringify(data),
      this.options
    );
  }

  updateQuarterMaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'flat/update',
      JSON.stringify(data),
      this.options
    );
  }

  createQuarterMaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flat/create',
      JSON.stringify(data),
      this.options
    );
  }

  onUpload(folderName: any, selectedFile: any, filename: any): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      // APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append('Image', selectedFile, filename);

    return this.httpClient.post(this.imgUrl + folderName, fd, this.options1);
  }
  onUploaddfdf(
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
    this.options1 = {
      headers: this.httpHeaders1,
    };

    // const fd = new FormData();
    // fd.append('Image', selectedFile, filename);

    return this.httpClient.post(
      this.imgUrl + folderName,
      selectedFile,
      this.options1
    );
  }

  // *********** BUILDING MASTER ***********

  getBuildingMaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'building/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateBuildingMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'building/update',
      JSON.stringify(data),
      this.options
    );
  }

  createBuildingMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'building/create',
      JSON.stringify(data),
      this.options
    );
  }

  // ************ FLOOR MASTER ***********

  getFloorMaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'floor/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateFloorMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'floor/update',
      JSON.stringify(data),
      this.options
    );
  }

  createFloorMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'floor/create',
      JSON.stringify(data),
      this.options
    );
  }

  Senioritydate(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    residencetype: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      RESIDENCE_TYPE: residencetype,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatRequest/getSeniorityList',
      JSON.stringify(data),
      this.options
    );
  }
  getSenioritylist(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/get',
      JSON.stringify(data),
      this.options
    );
  }

  // UpdateSeniorityList(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   var data = Object.assign({}, role);
  //   return this.httpClient.put<any>(
  //     this.url + 'seniorityList/update',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  // UpdateSeniorityList(
  //   role: any,
  //   PREFERANCE_ADDED_DATETIME: any,
  //   PREFERANCE_PRINT_DATETIME: any,
  //   PREFERANCE_UPLOAD_DATETIME: any,
  //   YEAR: any,
  //   MONTH: any,
  //   RESIDENCE_TYPE: any,
  //   ID: any
  // ): Observable<any> {
  //   (role.CLIENT_ID = this.clientId),
  //     (this.httpHeaders = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //       APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //       deviceid: this.cookie.get('deviceId'),
  //       supportkey: this.cookie.get('supportKey'),
  //       Token: this.cookie.get('token'),
  //     }));
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   // var data = Object.assign({}, role);
  //   var data1 = {
  //     PREFERANCE_ADDED_DATETIME: PREFERANCE_ADDED_DATETIME,
  //     PREFERANCE_PRINT_DATETIME: PREFERANCE_PRINT_DATETIME,
  //     PREFERANCE_UPLOAD_DATETIME: PREFERANCE_UPLOAD_DATETIME,
  //     YEAR: YEAR,
  //     MONTH: MONTH,
  //     RESIDENCE_TYPE: RESIDENCE_TYPE,
  //     ID: ID,
  //   };

  //   return this.httpClient.put<any>(
  //     this.url + 'seniorityList/update',
  //     JSON.stringify(data1),
  //     this.options
  //   );
  // }

  // SeniorityListdatapush(data1: any): Observable<any> {
  //   // data1.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   let data22 = {
  //     data: data1,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'seniorityList/updateBulkSeniorityListFinal',
  //     JSON.stringify(data22),
  //     this.options
  //   );
  // }

  // CreateSeniorityList(role: any): Observable<any> {
  //   role.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data = Object.assign({}, role);
  //   return this.httpClient.post<any>(
  //     this.url + 'seniorityList/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // getObjectionMaster(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'seniorityObjection/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // updateObjectionmaster(data: any): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.put<any>(
  //     this.url + 'seniorityObjection/update',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // createObjectionmaster(data: any): Observable<any> {
  //   data.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'seniorityObjection/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getFlatPreference(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'flatPreference/get',
      JSON.stringify(data),
      this.options
    );
  }
  getFlatPreferenceInspector(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'flatPreference/getPreferenceReport',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatAllocationInspector(month, year, residencetype): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      MONTH: month,
      YEAR: year,
      TYPE: residencetype,
    };

    return this.httpClient.post<any>(
      this.url + 'flatAllocation/flatAllotment',
      JSON.stringify(data),
      this.options
    );
  }

  updateFlatPreference(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'flatPreference/update',
      JSON.stringify(data),
      this.options
    );
  }

  createFlatPreference(
    data: any,
    FlatID: any,
    ResidenceType: any
  ): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data12 = {
      FLAT_PREFERENCE: data,
      FLAT_REQUEST_ID: FlatID,
      TYPE_ID: ResidenceType,
    };

    return this.httpClient.post<any>(
      this.url + 'flatPreference/addbulk',
      JSON.stringify(data12),
      this.options
    );
  }

  getallDesignation(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'designation/get',
      JSON.stringify(data),
      this.options
    );
  }

  getfamilymaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'family/get',
      JSON.stringify(data),
      this.options
    );
  }

  getWaitinglist(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatPreferanceList/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateWaitingList(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'flatPreferanceList/update',
      JSON.stringify(data),
      this.options
    );
  }

  CreateWaitingList(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'flatPreferanceList/create',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatAllocationMAster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatAllocation/get',
      JSON.stringify(data),
      this.options
    );
  }

  getflatAllotmentMaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatAllocationList/get',
      JSON.stringify(data),
      this.options
    );
  }

  residenceTypeRequest(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'residenceTypeRequest/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateFlatallocation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'flatAllocationList/update',
      JSON.stringify(data),
      this.options
    );
  }

  CreateFlatAllocation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'flatAllocationList/create',
      JSON.stringify(data),
      this.options
    );
  }

  getAllotmentObjectionMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'allotmentObjection/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateAllotmentObjectionmaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.put<any>(
      this.url + 'allotmentObjection/update',
      JSON.stringify(data),
      this.options
    );
  }

  updateFinalSenioritylistmaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'seniorityList/updateFinalList',
      JSON.stringify(data),
      this.options
    );
  }

  createAllotmentObjectionmaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'allotmentObjection/create',
      JSON.stringify(data),
      this.options
    );
  }

  getcurrentstagesMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'grassStage/get',
      JSON.stringify(data),
      this.options
    );
  }

  getstages(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    empid: any
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      EMP_ID: empid,
    };

    return this.httpClient.post<any>(
      this.url + 'grassStage/getEmployeeCurrentStage',
      JSON.stringify(data),
      this.options
    );
  }
  updatestates(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    // var data = {
    //   STEP_ID:stepid,
    //   STAGE_ID:1,
    //   EMP_ID:Number(sessionStorage.getItem('userId'))
    // };

    return this.httpClient.post<any>(
      this.url + 'grassStage/updateStep',
      JSON.stringify(data),
      this.options
    );
  }

  updatecurrentstagesmaster(empid, data1: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var dataarray = {
      EMP_ID: empid,
      STAGE_NO: data1,
    };

    return this.httpClient.post<any>(
      this.url + 'grassStage/updateStage',
      JSON.stringify(dataarray),
      this.options
    );
  }

  createcurrentstagesmaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + 'grassStage/create',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatAvailabilityPublish(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatAvailabilityList/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateFlatAvailabilityPublish(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'flatAvailabilityList/update',
      JSON.stringify(data),
      this.options
    );
  }

  createFlatAvailabilityPublish(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'flatAvailabilityList/create',
      JSON.stringify(data),
      this.options
    );
  }

  getsenioritylistcount(): Observable<any> {
    var data = {};
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityObjection/getSeniorityObjectionCount',
      JSON.stringify(data),
      this.options
    );
  }

  getApplicationCounts(): Observable<any> {
    var data = {};
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatRequest/getApplicationCounts',
      JSON.stringify(data),
      this.options
    );
  }

  getSenioritylist1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    month: any,
    year: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: month,
      YEAR: year,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityList/getSeniorityList',
      JSON.stringify(data),
      this.options
    );
  }

  getAllUsers12(
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
      this.url + 'userRoleMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  MapBuildings(data1: string[]): Observable<any> {
    //
    return this.httpClient.post<any>(
      this.url + 'caretakerBuildingMapping/addbulk',
      data1,
      this.options
    );
  }
  getBuildingsMapped(
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
      this.url + 'caretakerBuildingMapping/get',
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
  UpdateSeniorityList1(role: any, USER_ID: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    role.USER_ID = Number(USER_ID);
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',

      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',

      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',

      deviceid: this.cookie.get('deviceId'),

      supportkey: this.cookie.get('supportKey'),

      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/updateTempWaitingList',
      JSON.stringify(data),
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

  verifyOTP(EMAIL_ID: any, OTP: any, EMP_ID: any): Observable<any> {
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

  createFlatPreferencenew(
    data: any,
    FlatID: any,
    ResidenceType: any,
    STAGE_NO: any,
    PREFERENCE_DATETIME: any,
    PRINT_DATETIME: any,
    UPLOAD_DATETIME: any
  ): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data12 = {
      FLAT_PREFERENCE: data,
      FLAT_REQUEST_ID: FlatID,
      TYPE_ID: ResidenceType,
      STAGE_NO: STAGE_NO,
      PREFERENCE_DATETIME: PREFERENCE_DATETIME,
      PRINT_DATETIME: PRINT_DATETIME,
      UPLOAD_DATETIME: UPLOAD_DATETIME,
    };

    return this.httpClient.post<any>(
      this.url + 'flatPreference/addbulk',
      JSON.stringify(data12),
      this.options
    );
  }
  getFlatOrderLog(
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
      this.url + 'flatOrderLog/get/',
      JSON.stringify(data),
      this.options
    );
  }
  getFlatOrder(
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
      this.url + 'flatVacantOrderMaster/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createFlatOrder(data): Observable<any> {
    data.CLIENT_ID = this.clientId;

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

    return this.httpClient.post<any>(
      this.url + 'flatVacantOrderMaster/create',
      JSON.stringify(data),
      this.options
    );
  }
  createFlatOrderBulk(data): Observable<any> {
    data.CLIENT_ID = this.clientId;

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

    return this.httpClient.post<any>(
      this.url + 'flatVacantOrderMaster/addBulk',
      JSON.stringify(data),
      this.options
    );
  }

  updateFlatOrder(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'flatVacantOrderMaster/update',
      JSON.stringify(user),
      this.options
    );
  }

  getSenioritylistdraft(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/get',
      JSON.stringify(data),
      this.options
    );
  }

  createObjectionmaster1(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityListObjection//createObjection',
      JSON.stringify(data),
      this.options
    );
  }
  getObjectionMaster1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'seniorityListObjection/get',
      JSON.stringify(data),
      this.options
    );
  }

  getflatperf(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    FROM_DATE: any,
    TO_DATE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      RESIDENCE_TYPE_ID: filter,
      EMP_ID: Number(sessionStorage.getItem('userId')),
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferanceMasterLists/getPreferanceEmployeeStatus',
      JSON.stringify(data),
      this.options
    );
  }
  viewprefdata(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/get',
      JSON.stringify(data),
      this.options
    );
  }

  createmployeeaddbulk(data: any, marterid: any): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data12 = {
      FLAT_PREFERENCE: data,
      PREFERNCE_MASTER_ID: marterid,
      EMP_ID: Number(sessionStorage.getItem('userId')),
    };

    return this.httpClient.post<any>(
      this.url + 'employeeFlatPreferances/addBulk',
      JSON.stringify(data12),
      this.options
    );
  }
  getmployeeaddbulk(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'employeeFlatPreferances/get',
      JSON.stringify(data),
      this.options
    );
  }

  preferanceEmployeecreate(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferanceEmployeeStatus/create',
      JSON.stringify(data),
      this.options
    );
  }
  preferanceEmployeeupdate(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'preferanceEmployeeStatus/submitPreferances',
      JSON.stringify(data),
      this.options
    );
  }

  getperdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'preferanceEmployeeStatus/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateSeniorityList(
    role: any,
    PREFERANCE_ADDED_DATETIME: any,
    PREFERANCE_PRINT_DATETIME: any,
    PREFERANCE_UPLOAD_DATETIME: any,
    YEAR: any,
    MONTH: any,
    RESIDENCE_TYPE: any,
    ID: any
  ): Observable<any> {
    (role.CLIENT_ID = this.clientId),
      (this.httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
        APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
        deviceid: this.cookie.get('deviceId'),
        supportkey: this.cookie.get('supportKey'),
        Token: this.cookie.get('token'),
      }));
    this.options = {
      headers: this.httpHeaders,
    };
    // var data = Object.assign({}, role);
    var data1 = {
      PREFERANCE_ADDED_DATETIME: PREFERANCE_ADDED_DATETIME,
      PREFERANCE_PRINT_DATETIME: PREFERANCE_PRINT_DATETIME,
      PREFERANCE_UPLOAD_DATETIME: PREFERANCE_UPLOAD_DATETIME,
      YEAR: YEAR,
      MONTH: MONTH,
      RESIDENCE_TYPE: RESIDENCE_TYPE,
      ID: ID,
    };

    return this.httpClient.put<any>(
      this.url + 'seniorityList/update',
      JSON.stringify(data1),
      this.options
    );
  }

  SeniorityListdatapush(data1: any): Observable<any> {
    // data1.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    let data22 = {
      data: data1,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityList/updateBulkSeniorityListFinal',
      JSON.stringify(data22),
      this.options
    );
  }

  updateTempwaitingListdetails(dataarray: any): Observable<any> {
    // data1.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var datalistarray = {
      tempDetailsArr: dataarray,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingListDetails/updateDetails',
      JSON.stringify(datalistarray),
      this.options
    );
  }

  CreateSeniorityList(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/createWaitingList',
      JSON.stringify(data),
      this.options
    );
  }
  DraftWaitinglistFinalPublish(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/publishFinalList',
      JSON.stringify(data),
      this.options
    );
  }

  TempwaitingDetails(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingListDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  getfinalSenioritylist(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finallistMaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  getObjectionMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'seniorityListObjection/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateObjectionmaster(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.put<any>(
      this.url + 'seniorityListObjection/update',
      JSON.stringify(data),
      this.options
    );
  }

  createObjectionmaster(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityListObjection/create',
      JSON.stringify(data),
      this.options
    );
  }

  getAllotementObjection(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'allotmentListObjection/get',
      JSON.stringify(data),
      this.options
    );
  }
  createAllotementObjection(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'allotmentListObjection/createObjection',
      JSON.stringify(data),
      this.options
    );
  }
  getFinalAllotementlist(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllotementlistdraft(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/get',
      JSON.stringify(data),
      this.options
    );
  }

  onUpload1(
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    return this.httpClient.post<any>(
      appkeys.imgUrl1 + folderName,
      fd,
      this.options1
    );
  }

  getAllPreferanceList(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferanceMasterLists/get',
      JSON.stringify(data),
      this.options
    );
  }
  getEmployeeFlatReferanceList(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeFlatPreferances/get',
      JSON.stringify(data),
      this.options
    );
  }
  getEmployeesAllDocument(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferanceEmployeeStatus/get',
      JSON.stringify(data),
      this.options
    );
  }
  getFlatAllotmentList(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeFlatPreferances/getEmployeePreferences',
      JSON.stringify(data),
      this.options
    );
  }
  // getAllDraftAllotment(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentDetails/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // updateAllotementDetail(user: any): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentDetails/changeFlat',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }
  getDraftAllotmentList(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateDraftAllotmentList(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'draftAllotmentLists/update',
      JSON.stringify(user),
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

    const req = new HttpRequest('POST', this.imgUrl + folderName, fd, options1);
    return this.httpClient.request(req);
  }
  onUpload3(
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

    const req = new HttpRequest('POST', this.imgUrl + folderName, fd, options1);
    return this.httpClient.request(req);
  }

  createFlatAllotmentList(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/flatAllotment',
      JSON.stringify(data),
      this.options
    );
  }
  // getFinalAllotmentObjections(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'allotmentListObjection/getObjection',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  UpdateFinalAllotmentObjections(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'allotmentListObjection/update',
      JSON.stringify(user),
      this.options
    );
  }

  getFinalAllotmentListgenerate(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/get',
      JSON.stringify(data),
      this.options
    );
  }

  // UpdateFinalAllotmentListmaster(user: any): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.url + 'finalAllotmentList/update',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  // getAllDraftAllotment(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentDetails/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getFinalAllotmentListmaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/get',
      JSON.stringify(data),
      this.options
    );
  }

  // getdraftAllotmentdetailslist(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentDetails/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  updatePreferanceList(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'preferanceMasterLists/update',
      JSON.stringify(user),
      this.options
    );
  }

  updateDraftAllotmentPdf(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'draftAllotmentLists/update',
      JSON.stringify(user),
      this.options
    );
  }

  publishfinalalltoment(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'draftAllotmentLists/updateDraftList',
      JSON.stringify(user),
      this.options
    );
  }

  // new

  getdraftAllotmentdetailslist(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  getDraftAllotmentListmaster(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllDraftAllotment(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateAllotementDetail(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentDetails/changeAllotment',
      JSON.stringify(user),
      this.options
    );
  }
  // updateAllotementDetail(user: any): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentDetails/changeFlat',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  UpdateFinalAllotmentListmaster(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/publishFinalAllotmentList',
      JSON.stringify(user),
      this.options
    );
  }

  // getDraftAllotmentListgenerate(
  //     pageIndex: number,
  //     pageSize: number,
  //     sortKey: string,
  //     sortValue: string,
  //     filter: string
  //   ): Observable<any> {
  //     var data = {
  //       pageIndex: pageIndex,
  //       pageSize: pageSize,
  //       sortKey: sortKey,
  //       sortValue: sortValue,
  //       filter: filter,
  //     };
  //     this.httpHeaders = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //       APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //       deviceid: this.cookie.get('deviceId'),
  //       supportkey: this.cookie.get('supportKey'),
  //       Token: this.cookie.get('token'),
  //     });
  //     this.options = {
  //       headers: this.httpHeaders,
  //     };
  //     return this.httpClient.post<any>(
  //       this.url + 'draftAllotmentLists/get',
  //       JSON.stringify(data),
  //       this.options
  //     );
  //   }

  getSeniorityListWithCount(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/getTempDataWithCount',
      JSON.stringify(data),
      this.options
    );
  }

  getSenioritylistdraftchange(
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
      EMP_ID: Number(sessionStorage.getItem('userId')),
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/getDraftData',
      JSON.stringify(data),
      this.options
    );
  }

  getDraftAllotmentListgenerate(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/getDraftAllotmentList',
      JSON.stringify(data),
      this.options
    );
  }

  finalPrintDate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/updateDraftList/',
      JSON.stringify(data),
      this.options
    );
  }

  tempwaitinglistdetailscall(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingListDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateDraftwaitingListdetails(dataarray: any): Observable<any> {
    // data1.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var datalistarray = {
      draftDetailsArr: dataarray,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingListDetails/updateDetails',
      JSON.stringify(datalistarray),
      this.options
    );
  }

  DraftwaitingListDetails(
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

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingListDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  getObjectionMasterWithCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    DRAFT_WAITING_MASTER_ID: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      DRAFT_WAITING_MASTER_ID: DRAFT_WAITING_MASTER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'seniorityListObjection/getObjectionData',
      JSON.stringify(data),
      this.options
    );
  }

  getFinalAllotmentObjections(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    DRAFT_ALLOTMENT_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      DRAFT_ALLOTMENT_ID: DRAFT_ALLOTMENT_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'allotmentListObjection/getObjection',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateSeniorityListBasic(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = Object.assign({}, role);

    return this.httpClient.put<any>(
      this.url + 'tempWaitingList/update',
      JSON.stringify(data),
      this.options
    );
  }

  getCount(
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
      this.url + 'flatRequest/getApplicationStatus',
      JSON.stringify(data),
      this.options
    );
  }
  getemployeeresidencetype(
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
      EMP_ID: Number(sessionStorage.getItem('userId')),
    };
    return this.httpClient.post<any>(
      this.url + 'flat/getResidenceType',
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

  UpdateDraftAllotmentSignature(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'draftAllotmentLists/update',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateEmployeeprefinspectormaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'preferanceMasterLists/update',
      JSON.stringify(data),
      this.options
    );
  }

  getDraftwaitingMasterforsignature(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateBasicDraftwaitingmaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'tempWaitingList/update',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateDraftWaitingmaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'draftWaitingList/update',
      JSON.stringify(data),
      this.options
    );
  }

  getNotifiactionuser(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    USER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      USER_ID: USER_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'notification/getNotifications',
      JSON.stringify(data),
      this.options
    );
  }
  getNotifiaction(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    USER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      EMPLOYEE_ID: USER_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'notification/getNotifications',
      JSON.stringify(data),
      this.options
    );
  }

  getcaretakeraprovedata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }

  updatecaretakeraprovedata(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'finalFlatTakenEmployeeList/update',
      JSON.stringify(data),
      this.options
    );
  }

  occupacyletterupdate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'finalFlatTakenEmployeeList/updatePhysicalLetter',
      JSON.stringify(data),
      this.options
    );
  }

  // CreateAcceptanceHoue(data: any) {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });

  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   return this.httpClient.post(
  //     this.url + 'acceptanceHouseDetails/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  updateAllotementlistbasic(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'draftAllotmentLists/update',
      JSON.stringify(user),
      this.options
    );
  }

  getFinalAllotmentDatalist11(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/getData',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatTakenEmployeeFinalll(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateIsInspectorApproved(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/updatePhysical',
      JSON.stringify(user),
      this.options
    );
  }

  getNonAcceptanceDetails(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'nonAcceptance/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateNonAcceptanceStatus(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'nonAcceptance/update',
      JSON.stringify(user),
      this.options
    );
  }

  //new changes
  //  getnonaccetances(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter
  //   };
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
  //   return this.httpClient.post<any>(this.url + "nonAcceptance/get", JSON.stringify(data), this.options);
  // }
  // updatenonacceptances(data:any) {
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
  //   return this.httpClient.put(
  //     this.url + 'nonAcceptance/update',
  //     JSON.stringify(data),
  //     this.options
  //   );
  //   }
  // Createnonacceptances(data:any) {
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
  //   return this.httpClient.post(
  //     this.url + 'nonAcceptance/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  //   }
  //   CreateAcceptanceHoue(data: any) {
  //     this.httpHeaders = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //       applicationkey: 'TQ7JZ1FDsSA1qHED',
  //       deviceid: this.cookie.get('deviceId'),
  //       supportkey: this.cookie.get('supportKey'),
  //       Token: this.cookie.get('token'),
  //     });

  //     this.options = {
  //       headers: this.httpHeaders,
  //     };
  //     return this.httpClient.post(
  //       this.url + 'acceptanceHouseDetails/addBulk',
  //       JSON.stringify(data),
  //       this.options
  //     );
  //   }

  //   //newwww
  //   getfinalflattakenEmployeeLists(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
  //     var data = {
  //       pageIndex: pageIndex,
  //       pageSize: pageSize,
  //       sortKey: sortKey,
  //       sortValue: sortValue,
  //       filter: filter
  //     };
  //     this.httpHeaders = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'apikey': 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //       'applicationkey': 'TQ7JZ1FDsSA1qHED',
  //       'deviceid': this.cookie.get('deviceId'),
  //       'supportkey': this.cookie.get('supportKey'),
  //       'Token': this.cookie.get('token'),
  //     });
  //     this.options = {
  //       headers: this.httpHeaders
  //     };
  //     return this.httpClient.post<any>(this.url + "finalFlatTakenEmployeeList/get", JSON.stringify(data), this.options);
  //   }

  getpredranceflatdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'vacancyRoaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  //19-10-2023 Employee Side
  // getFlatAvailabilityget1(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string,
  //   EMP_ID: any
  // ): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     EMP_ID: EMP_ID,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'flat/getFlatData',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getAllPreferanceList111(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferanceMasterLists/getPreferanceMasterListWithCount',
      JSON.stringify(data),
      this.options
    );
  }

  getrosterdata(
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
      this.url + 'vacancyRoaster/get',
      JSON.stringify(data),
      this.options
    );
  }

  getapplicationReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'applicationReport/getSummaryReport',
      JSON.stringify(data),
      this.options
    );
  }

  getapplicationdetailedReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatRequest/get',
      JSON.stringify(data),
      this.options
    );
  }

  getflatvacantsummaryreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    MONTH: any,
    YEAR: any,
    RESIDENCE_TYPE_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: MONTH,
      YEAR: YEAR,
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatVacantSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getflatvacantdetailedreport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flat/get',
      JSON.stringify(data),
      this.options
    );
  }

  //   finalAllotmentDetailsReports(
  //     pageIndex: number,
  //     pageSize: number,
  //     sortKey: string,
  //     sortValue: string,
  //     filter: any,
  //   ): Observable<any> {
  //     var data = {
  //       pageIndex: pageIndex,
  //       pageSize: pageSize,
  //       sortKey: sortKey,
  //       sortValue: sortValue,
  //       filter: filter,
  //     };
  //     return this.httpClient.post<any>(
  //       this.url + 'finalAllotmentDetails/get   ',
  //       JSON.stringify(data),
  //       this.options
  //     );
  //   }

  //  senioritydetailedReports(
  //     pageIndex: number,
  //     pageSize: number,
  //     sortKey: string,
  //     sortValue: string,
  //     filter: any,
  //   ): Observable<any> {
  //     var data = {
  //       pageIndex: pageIndex,
  //       pageSize: pageSize,
  //       sortKey: sortKey,
  //       sortValue: sortValue,
  //       filter: filter,
  //     };
  //     return this.httpClient.post<any>(
  //       this.url + 'finalListdetails/get   ',
  //       JSON.stringify(data),
  //       this.options
  //     );
  //   }

  finalAllotmentDetailsReports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'grass/deletedapplicationrequest   ',
      JSON.stringify(data),
      this.options
    );
  }
  // finalAllotmentDetailsReports(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: any
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'finalAllotmentDetails/get   ',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  senioritydetailedReports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'finalListdetails/get   ',
      JSON.stringify(data),
      this.options
    );
  }

  //  getEmployeeMaster(
  //     pageIndex: number,
  //     pageSize: number,
  //     sortKey: string,
  //     sortValue: string,
  //     filter: string
  //   ): Observable<any> {
  //     var data = {
  //       pageIndex: pageIndex,
  //       pageSize: pageSize,
  //       sortKey: sortKey,
  //       sortValue: sortValue,
  //       filter: filter,
  //     };
  //     return this.httpClient.post<any>(
  //       this.url + 'employee/get',
  //       JSON.stringify(data),
  //       this.options
  //     );
  //   }

  getresidenceType(
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
      this.url + 'residenceType/get',
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
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'graasGradePayLevel/get',
      JSON.stringify(data),
      this.options
    );
  }

  getallotmentSummary(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'allotmentSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getpreferenceFilledSummary(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferenceFilledSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  //  getfinalSenioritylist(
  //     pageIndex: number,
  //     pageSize: number,
  //     sortKey: string,
  //     sortValue: string,
  //     filter: string
  //   ): Observable<any> {
  //     var data = {
  //       pageIndex: pageIndex,
  //       pageSize: pageSize,
  //       sortKey: sortKey,
  //       sortValue: sortValue,
  //       filter: filter,
  //     };
  //     this.httpHeaders = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //       APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //       deviceid: this.cookie.get('deviceId'),
  //       supportkey: this.cookie.get('supportKey'),
  //       Token: this.cookie.get('token'),
  //     });
  //     this.options = {
  //       headers: this.httpHeaders,
  //     };
  //     return this.httpClient.post<any>(
  //       this.url + 'finallistMaster/get',
  //       JSON.stringify(data),
  //       this.options
  //     );
  //   }

  getpreferenceFilledDetail(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferenceFilledDetailedReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllGradPayLevel(
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
      this.url + 'graasGradePayLevel/get',
      JSON.stringify(data),
      this.options
    );
  }

  Proiorityget(
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
      this.url + 'priority/get',
      JSON.stringify(data),
      this.options
    );
  }

  flatSurenderGet(
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
      this.url + 'surrender/get',
      JSON.stringify(data),
      this.options
    );
  }




  Acceptflatsurrendercaretaker(data: any) {
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
    return this.httpClient.post(
      this.url + 'surrender/acceptCaretaker',
      JSON.stringify(data),
      this.options
    );
  }

  Rejectflatsurrendercaretaker(data: any) {
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
    return this.httpClient.post(
      this.url + 'surrender/rejectCaretaker',
      JSON.stringify(data),
      this.options
    );
  }

  Acceptflatsurrenderinspector(data: any) {
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
    return this.httpClient.post(
      this.url + 'surrender/acceptForm',
      JSON.stringify(data),
      this.options
    );
  }

  Rejectflatsurrenderinspector(data: any) {
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
    return this.httpClient.post(
      this.url + 'surrender/rejectInspector',
      JSON.stringify(data),
      this.options
    );
  }

  getdatasurrenderlist(
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
      this.url + 'finalAllotmentList/getDataSurrender',
      JSON.stringify(data),
      this.options
    );
  }

  RejectNonAcceptanceStatus(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'nonAcceptance/rejectForm',
      JSON.stringify(user),
      this.options
    );
  }

  ApproveNonAcceptanceStatus(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'nonAcceptance/acceptForm',
      JSON.stringify(user),
      this.options
    );
  }

  // shreyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

  // shreya

  // acceptanceHouseDetails/create
  getAcceptanceformsss(
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
    return this.httpClient.post<any>(
      this.url + 'acceptanceForm/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateAcceptanceformss(data: any) {
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
    return this.httpClient.put(
      this.url + 'acceptanceForm/update',
      JSON.stringify(data),
      this.options
    );
  }
  CreateAcceptformss(data: any) {
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
    return this.httpClient.post(
      this.url + 'acceptanceForm/create',
      JSON.stringify(data),
      this.options
    );
  }

  acceptFlat(
    ID: any,
    YEAR: any,
    MONTH: any,
    EMP_ID: any,
    FLAT_ID: any,
    FINAL_ALLOTMENT_MASTER_ID: any,
    REMARK: any
  ): Observable<any> {
    var data = {
      ID: ID,
      YEAR: YEAR,
      MONTH: MONTH,
      EMP_ID: EMP_ID,
      FLAT_ID: FLAT_ID,
      FINAL_ALLOTMENT_MASTER_ID: FINAL_ALLOTMENT_MASTER_ID,
      REMARK: REMARK,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/acceptFlat',
      JSON.stringify(data),
      this.options
    );
  }

  updategetflatgetlist(data: any) {
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
    return this.httpClient.put(
      this.url + 'finalAllotmentDetails/update',
      JSON.stringify(data),
      this.options
    );
  }

  getmislistofcards(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    EMP_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      EMP_ID: EMP_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/getList',
      JSON.stringify(data),
      this.options
    );
  }
  getfamilydata(
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
    return this.httpClient.post<any>(
      this.url + 'family/get',
      JSON.stringify(data),
      this.options
    );
  }
  updatefamily(data: any) {
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
    return this.httpClient.put(
      this.url + 'family/update',
      JSON.stringify(data),
      this.options
    );
  }
  Createfamily(data: any) {
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
    return this.httpClient.post(
      this.url + 'family/create',
      JSON.stringify(data),
      this.options
    );
  }

  getfinalallotementdetailss(
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
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  // House detailsssssssssssssssssssssssssssssssssss
  getaceptancedata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    EMP_ID: any,
    FINAL_ALLOTMENT_DETAILS_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      EMP_ID: EMP_ID,
      ID: FINAL_ALLOTMENT_DETAILS_ID,
    };
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
    return this.httpClient.post<any>(
      this.url + 'acceptanceForm/getData',
      JSON.stringify(data),
      this.options
    );
  }
  getAcceptanceHouse(
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
    return this.httpClient.post<any>(
      this.url + 'acceptanceHouseDetails/get',
      JSON.stringify(data),
      this.options
    );
  }
  updateAcceptanceHouse(data: any) {
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
    return this.httpClient.post(
      this.url + 'acceptanceHouseDetails/updateBulk',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatTakenEmployeeList(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }

  getFinalAllotmentDatalist(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/get',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateEmployeeDataflatfinal(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.put<any>(
      this.url + 'finalFlatTakenEmployeeList/update',
      JSON.stringify(data),
      this.options
    );
  }
  UpdateEmployeeDataflatfinal1(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/applyRenovation',
      JSON.stringify(data),
      this.options
    );
  }
  agetFlatTakenEmployeeList(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updatefinalAllotmentDetailsEmployee(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'finalAllotmentDetails/update',
      JSON.stringify(user),
      this.options
    );
  }

  updatefinalAllotmentDetailsAccept(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/acceptRequest',
      JSON.stringify(user),
      this.options
    );
  }

  updatefinalAllotmentDetailsuploadletters(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/sendLetters',
      JSON.stringify(user),
      this.options
    );
  }

  updatefinalAllotmentDetailsReject(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/rejectInspector',
      JSON.stringify(user),
      this.options
    );
  }

  getFlatTakenEmployeeList111(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  sendtocaretakeraccform(
    ID: any,
    EMP_ID: any,
    CARETAKER_ID: any
  ): Observable<any> {
    var data = {
      ID: ID,
      EMP_ID: EMP_ID,
      CARETAKER_ID: CARETAKER_ID,
    };
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
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/sendToCaretaker',
      JSON.stringify(data),
      this.options
    );
  }

  deletealluploadsgrass(FILE_URL: any): Observable<any> {
    var data = {
      FILE_URL: FILE_URL,
    };
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
    return this.httpClient.post<any>(
      this.Baseurl + 'web/removeFile',
      JSON.stringify(data),
      this.options
    );
  }

  //new changes
  getnonaccetances(
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
    return this.httpClient.post<any>(
      this.url + 'nonAcceptance/get',
      JSON.stringify(data),
      this.options
    );
  }
  updatenonacceptances(data: any) {
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
    return this.httpClient.put(
      this.url + 'nonAcceptance/update',
      JSON.stringify(data),
      this.options
    );
  }
  Createnonacceptances(data: any) {
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
    return this.httpClient.post(
      this.url + 'nonAcceptance/create',
      JSON.stringify(data),
      this.options
    );
  }
  CreateAcceptanceHoue(data: any) {
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
    return this.httpClient.post(
      this.url + 'acceptanceHouseDetails/addBulk',
      JSON.stringify(data),
      this.options
    );
  }

  //newwww
  getfinalflattakenEmployeeLists(
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
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }

  //19-10-2023 Employee Side
  getFlatAvailabilityget1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    EMP_ID: any
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      EMP_ID: EMP_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'flat/getFlatData',
      JSON.stringify(data),
      this.options
    );
  }

  RejectPhysicalOccupancyRequest(user: any): Observable<any> {
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
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/rejectInspector',
      JSON.stringify(user),
      this.options
    );
  }

  /////////////////////////////////// 02-11-2023 ///////////////////////////////////////////////

  getflatchangerequestsdetails(
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
      this.url + 'changeFlat/get',
      JSON.stringify(data),
      this.options
    );
  }

  changeflatrequestAction(data: any) {
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
    return this.httpClient.post(
      this.url + 'changeFlat/updateInspector',
      JSON.stringify(data),
      this.options
    );
  }

  Addbulkflatvacant(array: any, month: any, year: any, caretakerid: any) {
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
    var senddata = {
      data: array,
      MONTH: month,
      YEAR: year,
      CARETAKER_ID: caretakerid,
    };
    return this.httpClient.post(
      this.url + 'tempVacantOrder/addBulk',
      JSON.stringify(senddata),
      this.options
    );
  }

  Approvebulkflatvacant(month: any, year: any, residencetype) {
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
    var senddata = {
      MONTH: month,
      YEAR: year,
      RESIDENCE_TYPE_ID: residencetype,
    };
    return this.httpClient.post(
      this.url + 'tempVacantOrder/approve',
      JSON.stringify(senddata),
      this.options
    );
  }

  getaddbulkdatachek(
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
      this.url + 'tempVacantOrder/get',
      JSON.stringify(data),
      this.options
    );
  }

  // new shreyaaaaaaaaa
  //new surrender
  getsurrenderemp(
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
    return this.httpClient.post<any>(
      this.url + 'surrender/get',
      JSON.stringify(data),
      this.options
    );
  }
  updatesurrenderemp(data: any) {
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
    return this.httpClient.put(
      this.url + 'surrender/update',
      JSON.stringify(data),
      this.options
    );
  }


  Createsurrenderemp(data: any): Observable<any> {
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
    return this.httpClient.post(
      this.url + 'surrender/create',
      JSON.stringify(data),
      this.options
    );
  }



  submitacceptanceform(
    ID: any,
    YEAR: number,
    MONTH: any,
    EMP_ID: any,
    FINAL_ALLOTMENT_MASTER_ID: string,
    REMARK: any,
    ACCEPTANCE_LETTER: any,
    FLAT_ID: any,
    PHYSICAL_END_DATETIME: any,
    NON_ACCEPTANCE_END_DATE_TIME: any,
    SEND_TO_CARETAKER_END_DATE_TIME: any
  ): Observable<any> {
    var data = {
      ID: ID,
      YEAR: YEAR,
      MONTH: MONTH,
      EMP_ID: EMP_ID,
      FINAL_ALLOTMENT_MASTER_ID: FINAL_ALLOTMENT_MASTER_ID,
      REMARK: REMARK,
      ACCEPTANCE_LETTER: ACCEPTANCE_LETTER,
      FLAT_ID: FLAT_ID,
      PHYSICAL_END_DATETIME: PHYSICAL_END_DATETIME,
      NON_ACCEPTANCE_END_DATE_TIME: NON_ACCEPTANCE_END_DATE_TIME,
      SEND_TO_CARETAKER_END_DATE_TIME: SEND_TO_CARETAKER_END_DATE_TIME,
    };
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
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/submit',
      JSON.stringify(data),
      this.options
    );
  }

  //new Change flat
  getchangeemp(
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
    return this.httpClient.post<any>(
      this.url + 'changeFlat/get',
      JSON.stringify(data),
      this.options
    );
  }
  updatechangeemp(data: any) {
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
    return this.httpClient.put(
      this.url + 'changeFlat/update',
      JSON.stringify(data),
      this.options
    );
  }
  Createchangeemp(data: any) {
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
    return this.httpClient.post(
      this.url + 'changeFlat/createForm',
      JSON.stringify(data),
      this.options
    );
  }

  //reports 03-11-2023 Shreya
  areaWiseFlatSummarySReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'areaWiseFlatSummary/get      ',
      JSON.stringify(data),
      this.options
    );
  }

  caretakerWiseFlatSummarySReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'caretakerWiseFlatSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  QuaterAllotementSReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'quaterAllotmentReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  CaretakerwiseFlatDetailedReports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'flat/get      ',
      JSON.stringify(data),
      this.options
    );
  }

  acceptanceDetailedReports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    YEAR: any,
    MONTH: any,
    RESIDENCE_TYPE_ID: any,
    OCCUPANCY_TYPE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      MONTH: MONTH,
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
      OCCUPANCY_TYPE: OCCUPANCY_TYPE,
    };
    return this.httpClient.post<any>(
      this.url + 'acceptanceDetailed/get  ',
      JSON.stringify(data),
      this.options
    );
  }

  acceptanceSummaryReports(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    YEAR: any,
    MONTH: any,
    RESIDENCE_TYPE_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      MONTH: MONTH,
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'acceptanceSummary/get   ',
      JSON.stringify(data),
      this.options
    );
  }

  TechnicalOccupancyApproveReject(data: any) {
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
    return this.httpClient.post(
      this.url + 'finalFlatTakenEmployeeList/updateTechnical',
      JSON.stringify(data),
      this.options
    );
  }

  deleteapplicationform(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'flatRequest/deleteTransfer',
      JSON.stringify(data),
      this.options
    );
  }
  getflatrequestrecyclebindata(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'residenceTypeRequestRecyclebin/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllDDOs(
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
      this.url + 'ddo/get',
      JSON.stringify(data),
      this.options
    );
  }

  getCurrentOccupationDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[any]>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }

  // tempWaitingListStepUpdate(ID: any, NEW_STEP_NO: any, ALL_START_DATETIME: any, ALL_END_DATETIME: any): Observable<any> {
  //   // data.CLIENT_ID = this.clientId;
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data12 = {
  //     ID: ID,
  //     NEW_STEP_NO: NEW_STEP_NO,
  //     ALL_START_DATETIME: ALL_START_DATETIME,
  //     ALL_END_DATETIME: ALL_END_DATETIME
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'tempWaitingList/updateStep',
  //     JSON.stringify(data12),
  //     this.options
  //   );
  // }

  publishdraftorderrrrr(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    // role.USER_ID = Number(USER_ID);

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',

      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',

      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',

      deviceid: this.cookie.get('deviceId'),

      supportkey: this.cookie.get('supportKey'),

      Token: this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);

    console.log('123457890', data);

    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/publishDraftList',
      JSON.stringify(data),
      this.options
    );
  }

  flatVacantOrderMasterGenPDForder(
    RESIDENCE_TYPE_ID: any,
    RESIDENCE_TYPE_NAME: any,
    FLAT_IDS: any,
    VACANT_MASTER_ID: any
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
      RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
      FLAT_IDS: FLAT_IDS,
      VACANT_MASTER_ID: VACANT_MASTER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'flatVacantOrderMaster/generateOrderPdf',
      JSON.stringify(data),
      this.options
    );
  }

  pdfffff(user: any): Observable<any> {
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
      htmlContent: user,
    };
    return this.httpClient.post<any>(
      this.url + 'draftWaitingList/generatePDF',
      JSON.stringify(data),
      this.options
    );
  }
  prefrancepdf(html: any, ID: any): Observable<any> {
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
      htmlContent: html,
      PREFERENCES_ID: ID,
    };

    return this.httpClient.post<any>(
      this.url + 'preferanceEmployeeStatus/generatePdf',
      JSON.stringify(data),
      this.options
    );
  }

  applicationFormPDF(user: any, FLAT_REQ_ID: any): Observable<any> {
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
      htmlContent: user,
      FLAT_REQ_ID: FLAT_REQ_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'flatRequest/generatePdf',
      JSON.stringify(data),
      this.options
    );
  }
  removeRecidencetype(FLAT_REQUEST_ID: any): Observable<any> {
    var data = {
      FLAT_REQUEST_ID: FLAT_REQUEST_ID,
    };
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
    return this.httpClient.post<any>(
      this.url + 'residenceTypeRequest/remove',
      JSON.stringify(data),
      this.options
    );
  }

  allotmentlatterupload(user: any, ID: any): Observable<any> {
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
      htmlContent: user,
      ID: ID,
    };

    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/generatePdf',
      JSON.stringify(data),
      this.options
    );
  }
  physicallatterupload(user: any, ID: any, date: any): Observable<any> {
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
      htmlContent: user,
      ID: ID,
      PHYSICAL_END_DATETIME: date,
    };

    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/generateRenovationReminderPdf',
      JSON.stringify(data),
      this.options
    );
  }
  physicallatterupload11(
    user: any,
    ID: any,
    date: any,
    FINAL_ALLOTMENT_DETAILS_ID: any,
    IS_RENOVATION: number,
    HRA_SIGNATURE_ID: any
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
      htmlContent: user,
      ID: ID,
      PHYSICAL_END_DATETIME: date,
      ALLOTMENT_DETAILS_ID: FINAL_ALLOTMENT_DETAILS_ID,
      IS_RENOVATION: IS_RENOVATION,
      HRA_SIGNATURE_ID: HRA_SIGNATURE_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/generateRenovationReminderPdf',
      JSON.stringify(data),
      this.options
    );
  }
  allotmentpdfgenration(
    PREFERENCES_MASTER_ID: any,
    DRAFT_ALLOTMENT_ID: any,
    RESIDENCE_TYPE_NAME: any,
    htmlContent: any,
    SIGNATURE_ID: any,
    DRAFT_ALLOT_ORDER_NO: any,
    SIGNNAME: any,
    NAME_HN: any,
    POST: any,
    POST_HIN: any,
    OFFICE: any,
    OFFICE_HN: any,
    SIGNATURE_IMAGE: any
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
      PREFERENCES_MASTER_ID: PREFERENCES_MASTER_ID,
      DRAFT_ALLOTMENT_ID: DRAFT_ALLOTMENT_ID,
      RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
      htmlContent: htmlContent,
      SIGNATURE_ID: SIGNATURE_ID,
      DRAFT_ALLOT_ORDER_NO: DRAFT_ALLOT_ORDER_NO,
      SIGNNAME: SIGNNAME,
      NAME_HN: NAME_HN,
      POST: POST,
      POST_HIN: POST_HIN,
      OFFICE: OFFICE,
      OFFICE_HN: OFFICE_HN,
      SIGNATURE_IMAGE: SIGNATURE_IMAGE,
    };

    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/generateDraftPdf',
      JSON.stringify(data),
      this.options
    );
  }
  // allotmentpdfgenration(
  //   PREFERENCES_MASTER_ID: any,
  //   DRAFT_ALLOTMENT_ID: any,
  //   RESIDENCE_TYPE_NAME: any,
  //   htmlContent: any,
  //   SIGNATURE_ID: any,
  //   DRAFT_ALLOT_ORDER_NO: any,
  //   SIGNNAME: any,
  //   NAME_HN: any,
  //   POST: any,
  //   POST_HIN: any,
  //   OFFICE: any,
  //   OFFICE_HN: any
  // ): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data = {
  //     PREFERENCES_MASTER_ID: PREFERENCES_MASTER_ID,
  //     DRAFT_ALLOTMENT_ID: DRAFT_ALLOTMENT_ID,
  //     RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
  //     htmlContent: htmlContent,
  //     SIGNATURE_ID: SIGNATURE_ID,
  //     DRAFT_ALLOT_ORDER_NO: DRAFT_ALLOT_ORDER_NO,
  //     SIGNNAME: SIGNNAME,
  //     NAME_HN: NAME_HN,
  //     POST: POST,
  //     POST_HIN: POST_HIN,
  //     OFFICE: OFFICE,
  //     OFFICE_HN: OFFICE_HN,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentLists/generateDraftPdf',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  allotmentpdfgenrationfinal(
    PREFERENCES_MASTER_ID: any,
    DRAFT_ALLOTMENT_ID: any,
    RESIDENCE_TYPE_NAME: any,
    RESIDENCE_TYPE_ID: any,
    FINAL_ALLOTMENT_MASTER_ID: any,
    NEW_SIGNATURE_ID: any,
    FINAL_ALLOT_ORDER_NO: any,
    htmlContent: any
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
      PREFERENCES_MASTER_ID: PREFERENCES_MASTER_ID,
      DRAFT_ALLOTMENT_ID: DRAFT_ALLOTMENT_ID,
      RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
      FINAL_ALLOTMENT_MASTER_ID: FINAL_ALLOTMENT_MASTER_ID,
      NEW_SIGNATURE_ID: NEW_SIGNATURE_ID,
      FINAL_ALLOT_ORDER_NO: FINAL_ALLOT_ORDER_NO,
      htmlContent: htmlContent,
    };

    return this.httpClient.post<any>(
      this.url + 'draftAllotmentLists/generateFinalPdf',
      JSON.stringify(data),
      this.options
    );
  }

  // allotmentpdfgenrationfinal(
  //   PREFERENCES_MASTER_ID: any,
  //   DRAFT_ALLOTMENT_ID: any,
  //   RESIDENCE_TYPE_NAME: any,
  //   RESIDENCE_TYPE_ID: any,
  //   FINAL_ALLOTMENT_MASTER_ID: any,
  //   htmlContent: any
  // ): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data = {
  //     PREFERENCES_MASTER_ID: PREFERENCES_MASTER_ID,
  //     DRAFT_ALLOTMENT_ID: DRAFT_ALLOTMENT_ID,
  //     RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
  //     RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
  //     FINAL_ALLOTMENT_MASTER_ID: FINAL_ALLOTMENT_MASTER_ID,
  //     htmlContent: htmlContent,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'draftAllotmentLists/generateFinalPdf',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // flatVacantOrderMasterGenPDF(
  //   RESIDENCE_TYPE_ID: any,
  //   RESIDENCE_TYPE_NAME: any,
  //   FLAT_IDS: any,
  //   VACANT_MASTER_ID: any,
  //   elementAsString: any,
  //   NOTICE_DATETIME: any,
  //   PREFERENCE_END_DATE_TIME: any,
  //   PREFERENCE_START_DATE_TIME: any,
  //   PREFERENCE_END_DATE_TIME1: any,
  //   DRAFT_WAITING_MASTER_ID: any,
  //   SIGNATURE_ID: any,
  //   VACANT_ORDER_NO: any,
  //   SIGNNAME: any,
  //   NAME_HN: any,
  //   POST: any,
  //   POST_HIN: any,
  //   OFFICE: any,
  //   OFFICE_HN: any
  // ): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };

  //   var data = {
  //     RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
  //     RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
  //     FLAT_IDS: FLAT_IDS,
  //     VACANT_MASTER_ID: VACANT_MASTER_ID,
  //     CUTOFFDATE: elementAsString,
  //     PREFERANCE_END_TIME: PREFERENCE_END_DATE_TIME,
  //     NOTICE_DATETIME: NOTICE_DATETIME,
  //     PREFERENCE_START_DATE_TIME: PREFERENCE_START_DATE_TIME,
  //     PREFERENCE_END_DATE_TIME: PREFERENCE_END_DATE_TIME1,
  //     DRAFT_WAITING_MASTER_ID: DRAFT_WAITING_MASTER_ID,
  //     SIGNATURE_ID: SIGNATURE_ID,
  //     VACANT_ORDER_NO: VACANT_ORDER_NO,
  //     SIGNNAME: SIGNNAME,
  //     NAME_HN: NAME_HN,
  //     POST: POST,
  //     POST_HIN: POST_HIN,
  //     OFFICE: OFFICE,
  //     OFFICE_HN: OFFICE_HN,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'flatVacantOrderMaster/generatePdf',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }


  flatVacantOrderMasterGenPDF(
    RESIDENCE_TYPE_ID: any,
    RESIDENCE_TYPE_NAME: any,
    FLAT_IDS: any,
    VACANT_MASTER_ID: any,
    elementAsString: any,
    NOTICE_DATETIME: any,
    PREFERENCE_END_DATE_TIME: any,
    PREFERENCE_START_DATE_TIME: any,
    PREFERENCE_END_DATE_TIME1: any,
    DRAFT_WAITING_MASTER_ID: any,
    SIGNATURE_ID: any,
    VACANT_ORDER_NO: any,
    SIGNNAME: any,
    NAME_HN: any,
    POST: any,
    POST_HIN: any,
    OFFICE: any,
    OFFICE_HN: any,
    SIGNATURE_IMAGE: any
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
      RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
      FLAT_IDS: FLAT_IDS,
      VACANT_MASTER_ID: VACANT_MASTER_ID,
      CUTOFFDATE: elementAsString,
      PREFERANCE_END_TIME: PREFERENCE_END_DATE_TIME,
      NOTICE_DATETIME: NOTICE_DATETIME,
      PREFERENCE_START_DATE_TIME: PREFERENCE_START_DATE_TIME,
      PREFERENCE_END_DATE_TIME: PREFERENCE_END_DATE_TIME1,
      DRAFT_WAITING_MASTER_ID: DRAFT_WAITING_MASTER_ID,
      SIGNATURE_ID: SIGNATURE_ID,
      VACANT_ORDER_NO: VACANT_ORDER_NO,
      SIGNNAME: SIGNNAME,
      NAME_HN: NAME_HN,
      POST: POST,
      POST_HIN: POST_HIN,
      OFFICE: OFFICE,
      OFFICE_HN: OFFICE_HN,
      SIGNATURE_IMAGE: SIGNATURE_IMAGE,
    };

    return this.httpClient.post<any>(
      this.url + 'flatVacantOrderMaster/generatePdf',
      JSON.stringify(data),
      this.options
    );
  }


  tempWaitingListStepUpdate(
    ID: any,
    NEW_STEP_NO: any,
    ALL_START_DATETIME: any,
    ALL_END_DATETIME: any
  ): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data12 = {
      ID: ID,
      NEW_STEP_NO: NEW_STEP_NO,
      ALL_START_DATETIME: ALL_START_DATETIME,
      ALL_END_DATETIME: ALL_END_DATETIME,
      EMP_STEP_UPDATE: false,
    };

    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/updateStep',
      JSON.stringify(data12),
      this.options
    );
  }

  getDatacurrentstagesMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
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
      this.url + 'grassStage/getData',
      JSON.stringify(data),
      this.options
    );
  }

  finalAllotmentList(user: any): Observable<any> {
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

    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/generateAcceptancePdf',
      JSON.stringify(user),
      this.options
    );
  }
  private apiUrl = 'https://worldtimeapi.org/api/timezone/Etc/UTC';

  getCurrentTime(): Observable<any> {
    return this.httpClient.get(this.apiUrl);
  }

  tempWaitingListStepUpdateForvacantflat11(
    ID: any,
    NEW_STEP_NO: any,
    ALL_START_DATETIME: any,
    ALL_END_DATETIME: any,
    VACANCY_MASTER_ID: any,
    DRAFT_WAITING_ID: any,
    PREFERENCE_START_DATE_TIME: any,
    PREFERENCE_END_DATE_TIME: any
  ): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data12 = {
      ID: ID,
      NEW_STEP_NO: NEW_STEP_NO,
      ALL_START_DATETIME: ALL_START_DATETIME,
      ALL_END_DATETIME: ALL_END_DATETIME,
      EMP_STEP_UPDATE: true,
      VACANCY_MASTER_ID: VACANCY_MASTER_ID,
      DRAFT_WAITING_ID: DRAFT_WAITING_ID,
      PREFERENCE_START_DATE_TIME: PREFERENCE_START_DATE_TIME,
      PREFERENCE_END_DATE_TIME: PREFERENCE_END_DATE_TIME,
    };

    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/updateStep',
      JSON.stringify(data12),
      this.options
    );
  }

  UpdateEmployeeDataflatfinalrenovation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/takeRenovationAction',
      JSON.stringify(data),
      this.options
    );
  }
  rejectFlat(
    ID: any,
    YEAR: any,
    MONTH: any,
    EMP_ID: any,
    REMARK: any,
    FLAT_REJECTED_DATE_TIME: any
  ): Observable<any> {
    var data = {
      ID: ID,
      YEAR: YEAR,
      MONTH: MONTH,
      EMP_ID: EMP_ID,
      NON_ACCEPTANCE_REMARK: REMARK,
      FLAT_REJECTED_DATE_TIME: FLAT_REJECTED_DATE_TIME,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/rejectFlat',
      JSON.stringify(data),
      this.options
    );
  }
  rejectFlat11(
    ID: any,
    YEAR: any,
    MONTH: any,
    EMP_ID: any,
    REMARK: any,
    FLAT_REJECTED_DATE_TIME: any,
    RESIDENCE_TYPE_ID: any,
    FLAT_REQUEST_ID: any
  ): Observable<any> {
    var data = {
      ID: ID,
      YEAR: YEAR,
      MONTH: MONTH,
      EMP_ID: EMP_ID,
      NON_ACCEPTANCE_REMARK: REMARK,
      FLAT_REJECTED_DATE_TIME: FLAT_REJECTED_DATE_TIME,
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
      FLAT_REQUEST_ID: FLAT_REQUEST_ID,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/rejectFlat',
      JSON.stringify(data),
      this.options
    );
  }

  stophralatter(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/generateStopHRAPdf',
      JSON.stringify(data),
      this.options
    );
  }
  tempWaitingListStepUpdateForvacantflat(
    ID: any,
    NEW_STEP_NO: any,
    ALL_START_DATETIME: any,
    ALL_END_DATETIME: any,
    VACANCY_MASTER_ID: any,
    DRAFT_WAITING_ID: any,
    VACANT_DATETIME: any
  ): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data12 = {
      ID: ID,
      NEW_STEP_NO: NEW_STEP_NO,
      ALL_START_DATETIME: ALL_START_DATETIME,
      ALL_END_DATETIME: ALL_END_DATETIME,
      EMP_STEP_UPDATE: true,
      VACANCY_MASTER_ID: VACANCY_MASTER_ID,
      DRAFT_WAITING_ID: DRAFT_WAITING_ID,
      VACANCY_DATE_TIME: VACANT_DATETIME,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/updateStep',
      JSON.stringify(data12),
      this.options
    );
  }

  getGRAACoutsSummary(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = { headers: this.httpHeaders };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'dashBoard/getAllCounts',
      JSON.stringify(data),
      this.options
    );
  }

  getRenovationRequest(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = { headers: this.httpHeaders };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatRequestBarchart(RESIDENCE_TYPE: any, YEAR: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = { headers: this.httpHeaders };
    var data = { RESIDENCE_TYPE: RESIDENCE_TYPE, YEAR: YEAR };
    return this.httpClient.post<any>(
      this.url + 'dashBoard/getFlatRequest',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatdatapiechart(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options = { headers: this.httpHeaders };
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'dashBoard/getFlatCount',
      JSON.stringify(data),
      this.options
    );
  }

  getapplicationsReport1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    DATE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      DATE: DATE,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'quarterApplicationSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  getapplicationdetailedReport1(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'residenceTypeRequest/get',
      JSON.stringify(data),
      this.options
    );
  }

  ResidenceTypewiseQuartersSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'residenceTypewiseQuartersSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  ResidenceTypewiseQuartersDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'flat/get',
      JSON.stringify(data),
      this.options
    );
  }

  // pdfffffForreminder(
  //   user: any,
  //   ID: any,
  //   EMAIL_ID: any,
  //   RESIDENCE_TYPE_NAME: any,
  //   EMPLOYEE_NAME: any,
  //   INSPECTOR_ID: any,
  //   INSPECTOR_REMARK: any
  // ): Observable<any> {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
  //     applicationkey: 'TQ7JZ1FDsSA1qHED',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  //   var data = {
  //     HTML_FOR_PHYSICAL: user,
  //     ID: ID,
  //     EMAIL_ID: EMAIL_ID,
  //     RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
  //     EMPLOYEE_NAME: EMPLOYEE_NAME,
  //     INSPECTOR_ID: INSPECTOR_ID,
  //     INSPECTOR_REMARK: INSPECTOR_REMARK,
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'finalAllotmentList/generatePdf',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  pdfffffForreminder(
    user: any,
    ID: any,
    EMAIL_ID: any,
    RESIDENCE_TYPE_NAME: any,
    EMPLOYEE_NAME: any,
    INSPECTOR_ID: any,
    INSPECTOR_REMARK: any,
    NEW_SIGNATURE_ID: any,
    PHYSICAL_ORDER_NO: any
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
      HTML_FOR_PHYSICAL: user,
      ID: ID,
      EMAIL_ID: EMAIL_ID,
      RESIDENCE_TYPE_NAME: RESIDENCE_TYPE_NAME,
      EMPLOYEE_NAME: EMPLOYEE_NAME,
      INSPECTOR_ID: INSPECTOR_ID,
      INSPECTOR_REMARK: INSPECTOR_REMARK,
      NEW_SIGNATURE_ID: NEW_SIGNATURE_ID,
      PHYSICAL_ORDER_NO: PHYSICAL_ORDER_NO,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentList/generatePdf',
      JSON.stringify(data),
      this.options
    );
  }

  getSeniorityObjectionSummary(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityObjectionSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }
  getQuarterAllocationDetailReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'quartersAllocationDetailedReport/get',
      JSON.stringify(data),
      this.options
    );
  }
  getSeniorityObjectionDetailReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'seniorityListObjection/get',
      JSON.stringify(data),
      this.options
    );
  }

  getQuarterAllocationSummary(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'quartersAllocationSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }

  // reports rushikesh sir
  getAllotementObjectionSummaryReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'allotementObjectionsSummaryReport/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllotementObjectionDetailedReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'allotmentListObjection/get',
      JSON.stringify(data),
      this.options
    );
  }

  getPreferancesFilledSummaryReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'preferenceFilledSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAcceptanceSummary(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'acceptanceSummary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAcceptanceDetailedReport(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalAllotmentDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  employeeRetirementDetailedReport(
    pageIndex: any,
    pageSize: any,
    sortKey: string,
    sortValue: string,
    filter: string,
    RANK_ID: any,
    OFFICE_ID: any,
    FROM_RETIREMENT_DATE: any,
    TO_RETIREMENT_DATE: any,
    RETIREMENT_TYPE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      RANK_ID: RANK_ID,
      OFFICE_ID: OFFICE_ID,
      FROM_RETIREMENT_DATE: FROM_RETIREMENT_DATE,
      TO_RETIREMENT_DATE: TO_RETIREMENT_DATE,
      RETIREMENT_TYPE: RETIREMENT_TYPE,
    };
    return this.httpClient.post<any>(
      this.url + 'employeeRetirementDetailed/get',
      JSON.stringify(data),
      this.options
    );
  }

  PaylevelupdateFlatRequestDetails(data: any): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'tempWaitingList/updateFlatRequestDetails',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatRequestOldDetails(
    EMP_ID: any,
    RESIDENCE_TYPE_ID: any
  ): Observable<any> {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      EMP_ID: EMP_ID,
      RESIDENCE_TYPE_ID: RESIDENCE_TYPE_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'payLevelUpgrade/getFlatRequestOldDetails',
      JSON.stringify(data),
      this.options
    );
  }

  getpayLevelUpgrade(
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
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'payLevelUpgrade/get',
      JSON.stringify(data),
      this.options
    );
  }

  getuserAreaMapping(
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
      this.url + 'userAreaMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  unMapScope(USER_ID: number, datas: any[], CLIENT_ID: 1): Observable<any> {
    var data = { USER_ID: USER_ID, data: datas, CLIENT_ID: CLIENT_ID };
    return this.httpClient.post<any>(
      this.url + 'userAreaMapping/UnmapScope',
      data,
      this.options
    );
  }

  mapScope(USER_ID: number, datas: any[], CLIENT_ID: 1): Observable<any> {
    var data = {
      USER_ID: USER_ID,
      data: datas,
      CLIENT_ID: CLIENT_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'userAreaMapping/mapScope',
      data,
      this.options
    );
  }

  getUnmappedAreas(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    USER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      USER_ID: USER_ID,
    };
    return this.httpClient.post<any>(
      this.url + 'userAreaMapping/getUnmappedAreas',
      JSON.stringify(data),
      this.options
    );
  }

  sendHabitableCertificate(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    var data = Object.assign({}, role);
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/sendHabitableCertificate',
      JSON.stringify(data),
      this.options
    );
  }

  getFlatTakenEmployeeFinalllNew(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    countFilter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      countFilter: countFilter,
    };
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      APIKEY: 'Tjphsix0vzY9ZGsmI4oulgzcmzV2psPK',
      APPLICATION_KEY: 'TQ7JZ1FDsSA1qHED',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/get',
      JSON.stringify(data),
      this.options
    );
  }


  AcceptSurrender(data: any) {
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
    return this.httpClient.post(
      this.url + 'surrender/accept',
      JSON.stringify(data),
      this.options
    );
  }

  RejectSurrender(data: any) {
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
    return this.httpClient.post(
      this.url + 'surrender/reject',
      JSON.stringify(data),
      this.options
    );
  }

  physicallatterupload111(
    user: any,
    ID: any,
    date: any,
    FINAL_ALLOTMENT_DETAILS_ID: any,
    IS_RENOVATION: number,
    NEW_SIGNATURE_ID: any,
    PHYSICAL_ORDER_NO: any
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
      htmlContent: user,
      ID: ID,
      PHYSICAL_END_DATETIME: date,
      ALLOTMENT_DETAILS_ID: FINAL_ALLOTMENT_DETAILS_ID,
      IS_RENOVATION: IS_RENOVATION,
      NEW_SIGNATURE_ID: NEW_SIGNATURE_ID,
      PHYSICAL_ORDER_NO: PHYSICAL_ORDER_NO,
    };

    return this.httpClient.post<any>(
      this.url + 'finalFlatTakenEmployeeList/generateRenovationReminderPdf',
      JSON.stringify(data),
      this.options
    );
  }


  flatSurenderGet1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string, countFilter: any,
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
      countFilter: countFilter,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'surrender/get',
      JSON.stringify(data),
      this.options
    );
  }

  getallDesignationForTransfer(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
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
      this.url + 'rank/get',
      JSON.stringify(data),
      this.options
    );
  }
}
